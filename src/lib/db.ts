import { openDB, type DBSchema, type IDBPDatabase } from 'idb';
import type { ExamAttempt, QuizAttempt, SrsState } from './types';

export interface ReviewLogEntry {
  id?: number;
  flashcardId: string;
  timestamp: string;
}

interface AudGrindDB extends DBSchema {
  srsState: {
    key: string;
    value: SrsState;
  };
  quizAttempts: {
    key: number;
    value: QuizAttempt;
    indexes: { topicId: string };
  };
  examAttempts: {
    key: number;
    value: ExamAttempt;
  };
  reviewLog: {
    key: number;
    value: ReviewLogEntry;
  };
  meta: {
    key: string;
    value: unknown;
  };
}

let dbPromise: Promise<IDBPDatabase<AudGrindDB>> | null = null;

/**
 * IndexedDB's open() can hang forever if another tab holds an older-version connection open
 * (its `versionchange` never fires until that tab closes or self-closes). The `blocking` handler
 * makes THIS tab self-close when a newer version wants in elsewhere, so it never becomes the
 * thing blocking someone else. The timeout below is the safety net for the reverse case — some
 * other tab blocking us — so the UI degrades to "empty" instead of hanging indefinitely.
 */
function openDbFresh() {
  return openDB<AudGrindDB>('aud-grind', 2, {
    upgrade(db, oldVersion) {
      if (oldVersion < 1) {
        db.createObjectStore('srsState', { keyPath: 'flashcardId' });
        const quizStore = db.createObjectStore('quizAttempts', { keyPath: 'id', autoIncrement: true });
        quizStore.createIndex('topicId', 'topicId');
        db.createObjectStore('examAttempts', { keyPath: 'id', autoIncrement: true });
        db.createObjectStore('meta');
      }
      if (oldVersion < 2) {
        db.createObjectStore('reviewLog', { keyPath: 'id', autoIncrement: true });
      }
    },
    blocking() {
      dbInstance?.close();
      dbPromise = null;
    },
    terminated() {
      dbPromise = null;
    },
  }).then((database) => {
    dbInstance = database;
    return database;
  });
}

let dbInstance: IDBPDatabase<AudGrindDB> | undefined;

function getDb(): Promise<IDBPDatabase<AudGrindDB>> {
  if (!dbPromise) {
    dbPromise = openDbFresh();
  }
  return dbPromise;
}

function withTimeout<T>(promise: Promise<T>, fallback: T, ms = 4000): Promise<T> {
  return Promise.race([
    promise,
    new Promise<T>((resolve) => setTimeout(() => resolve(fallback), ms)),
  ]);
}

export async function getSrsState(flashcardId: string): Promise<SrsState | undefined> {
  const db = await getDb();
  return db.get('srsState', flashcardId);
}

export async function getAllSrsState(): Promise<SrsState[]> {
  return withTimeout(
    getDb().then((db) => db.getAll('srsState')),
    [],
  );
}

export async function putSrsState(state: SrsState): Promise<void> {
  const db = await getDb();
  await db.put('srsState', state);
}

export async function recordQuizAttempt(attempt: QuizAttempt): Promise<void> {
  const db = await getDb();
  await db.add('quizAttempts', attempt);
}

export async function getAllQuizAttempts(): Promise<QuizAttempt[]> {
  return withTimeout(
    getDb().then((db) => db.getAll('quizAttempts')),
    [],
  );
}

export async function recordExamAttempt(attempt: ExamAttempt): Promise<void> {
  const db = await getDb();
  await db.add('examAttempts', attempt);
}

export async function getAllExamAttempts(): Promise<ExamAttempt[]> {
  return withTimeout(
    getDb().then((db) => db.getAll('examAttempts')),
    [],
  );
}

export async function recordReviewLog(flashcardId: string, timestamp = new Date().toISOString()): Promise<void> {
  const db = await getDb();
  await db.add('reviewLog', { flashcardId, timestamp });
}

export async function getAllReviewLog(): Promise<ReviewLogEntry[]> {
  return withTimeout(
    getDb().then((db) => db.getAll('reviewLog')),
    [],
  );
}
