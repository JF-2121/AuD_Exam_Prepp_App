import {
  getAllExamAttempts,
  getAllQuizAttempts,
  getAllReviewLog,
  getAllSrsState,
  putSrsState,
  recordExamAttempt,
  recordQuizAttempt,
  recordReviewLog,
  type ReviewLogEntry,
} from './db';
import type { ExamAttempt, QuizAttempt, SrsState } from './types';

const SCHEMA_VERSION = 1;

export interface BackupFile {
  app: 'aud-grind-backup';
  schemaVersion: number;
  exportedAt: string;
  srsState: SrsState[];
  quizAttempts: QuizAttempt[];
  examAttempts: ExamAttempt[];
  reviewLog: ReviewLogEntry[];
}

export interface ImportSummary {
  flashcardsUpdated: number;
  quizAttemptsAdded: number;
  examAttemptsAdded: number;
  reviewLogAdded: number;
}

export async function buildBackup(): Promise<BackupFile> {
  const [srsState, quizAttempts, examAttempts, reviewLog] = await Promise.all([
    getAllSrsState(),
    getAllQuizAttempts(),
    getAllExamAttempts(),
    getAllReviewLog(),
  ]);
  return {
    app: 'aud-grind-backup',
    schemaVersion: SCHEMA_VERSION,
    exportedAt: new Date().toISOString(),
    srsState,
    quizAttempts,
    examAttempts,
    reviewLog,
  };
}

export async function downloadBackup(): Promise<void> {
  const backup = await buildBackup();
  const blob = new Blob([JSON.stringify(backup, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const dateStamp = backup.exportedAt.slice(0, 10);
  const a = document.createElement('a');
  a.href = url;
  a.download = `aud-grind-progress-${dateStamp}.json`;
  a.click();
  URL.revokeObjectURL(url);
}

function isBackupFile(value: unknown): value is BackupFile {
  if (!value || typeof value !== 'object') return false;
  const v = value as Record<string, unknown>;
  return (
    v.app === 'aud-grind-backup' &&
    typeof v.schemaVersion === 'number' &&
    Array.isArray(v.srsState) &&
    Array.isArray(v.quizAttempts) &&
    Array.isArray(v.examAttempts) &&
    Array.isArray(v.reviewLog)
  );
}

export async function parseBackupFile(file: File): Promise<BackupFile> {
  const text = await file.text();
  let parsed: unknown;
  try {
    parsed = JSON.parse(text);
  } catch {
    throw new Error('That file is not valid JSON.');
  }
  if (!isBackupFile(parsed)) {
    throw new Error('That file does not look like an AuD Grind progress export.');
  }
  if (parsed.schemaVersion > SCHEMA_VERSION) {
    throw new Error('That export was made by a newer version of the app — update the app before importing it.');
  }
  return parsed;
}

/**
 * Merges an imported backup into this device's local data — never replaces wholesale, since a
 * student may have studied on both devices since the last export.
 *   - Spaced-repetition state (one record per flashcard): keep whichever side reviewed it more
 *     recently, by `lastReviewed`.
 *   - Event logs (quiz/exam attempts, review log): append-only, deduplicated by content so
 *     re-importing the same file twice is a no-op instead of double-counting stats.
 */
export async function mergeBackup(backup: BackupFile): Promise<ImportSummary> {
  const [localSrsState, localQuizAttempts, localExamAttempts, localReviewLog] = await Promise.all([
    getAllSrsState(),
    getAllQuizAttempts(),
    getAllExamAttempts(),
    getAllReviewLog(),
  ]);

  const localSrsByCard = new Map(localSrsState.map((s) => [s.flashcardId, s]));
  let flashcardsUpdated = 0;
  for (const incoming of backup.srsState) {
    const local = localSrsByCard.get(incoming.flashcardId);
    if (!local || new Date(incoming.lastReviewed).getTime() > new Date(local.lastReviewed).getTime()) {
      await putSrsState(incoming);
      flashcardsUpdated += 1;
    }
  }

  const quizKey = (q: QuizAttempt) => `${q.questionId}|${q.topicId}|${q.correct}|${q.timestamp}`;
  const localQuizKeys = new Set(localQuizAttempts.map(quizKey));
  let quizAttemptsAdded = 0;
  for (const incoming of backup.quizAttempts) {
    if (!localQuizKeys.has(quizKey(incoming))) {
      const { id: _id, ...rest } = incoming;
      await recordQuizAttempt(rest);
      quizAttemptsAdded += 1;
    }
  }

  const examKey = (e: ExamAttempt) => `${e.examId}|${e.startedAt}|${e.finishedAt}|${e.score}`;
  const localExamKeys = new Set(localExamAttempts.map(examKey));
  let examAttemptsAdded = 0;
  for (const incoming of backup.examAttempts) {
    if (!localExamKeys.has(examKey(incoming))) {
      const { id: _id, ...rest } = incoming;
      await recordExamAttempt(rest);
      examAttemptsAdded += 1;
    }
  }

  const reviewKey = (r: ReviewLogEntry) => `${r.flashcardId}|${r.timestamp}`;
  const localReviewKeys = new Set(localReviewLog.map(reviewKey));
  let reviewLogAdded = 0;
  for (const incoming of backup.reviewLog) {
    if (!localReviewKeys.has(reviewKey(incoming))) {
      await recordReviewLog(incoming.flashcardId, incoming.timestamp);
      reviewLogAdded += 1;
    }
  }

  return { flashcardsUpdated, quizAttemptsAdded, examAttemptsAdded, reviewLogAdded };
}
