import { mcFormat, mcPoints } from '../../lib/types';
import type { Difficulty, McFormat, MultipleChoiceQuestion, Topic } from '../../lib/types';

/**
 * Shape of the real exam's MC section (Gedächtnisprotokoll SoSe 2025, Section 1 — 42 of 100
 * points, i.e. the single largest block on the paper):
 *
 *   Part I  — "genau *eine* der vier Aussagen ist richtig"  ·  6 questions × 1 P =  6 P
 *   Part II — "genau *zwei* der vier Aussagen sind richtig" · 18 questions × 2 P = 36 P
 *
 * Part II carries 6× the weight of Part I, which is why the 2-of-4 format is the one the
 * compendium is built around.
 */
export const EXAM_SINGLE_COUNT = 6;
export const EXAM_DOUBLE_COUNT = 18;
export const EXAM_MAX_POINTS = EXAM_SINGLE_COUNT * 1 + EXAM_DOUBLE_COUNT * 2; // 42
/** 120 min for 100 points on the real paper, scaled to this section's 42. */
export const EXAM_MINUTES = 50;
/** The paper passes at 50/100, so the same rate on this section is 21/42. */
export const EXAM_PASS_POINTS = Math.ceil(EXAM_MAX_POINTS / 2);

export const EXAM_INSTRUCTIONS: Record<McFormat, { de: string; en: string }> = {
  single: {
    de: 'In diesem Abschnitt ist bei jeder Aufgabe genau eine der vier Aussagen richtig. Markieren Sie diese mit einem Kreuz (X).',
    en: 'Exactly one of the four statements is correct. Mark it.',
  },
  double: {
    de: 'In diesem Abschnitt sind bei jeder Aufgabe genau zwei der vier Aussagen richtig. Markieren Sie diese mit einem Kreuz (X). Es werden nur dann Punkte vergeben, wenn genau die beiden richtigen Aussagen markiert wurden.',
    en: 'Exactly two of the four statements are correct. Points are awarded only if exactly both correct statements are marked — one right and one wrong scores 0, not 1.',
  },
};

export function shuffle<T>(arr: readonly T[]): T[] {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

export interface McFilters {
  topicId?: string;
  format?: McFormat;
  difficulty?: Difficulty;
}

export function filterMc(questions: MultipleChoiceQuestion[], f: McFilters): MultipleChoiceQuestion[] {
  return questions.filter(
    (q) =>
      (!f.topicId || q.topicId === f.topicId) &&
      (!f.format || mcFormat(q) === f.format) &&
      (!f.difficulty || q.difficulty === f.difficulty),
  );
}

export interface McStats {
  total: number;
  single: number;
  double: number;
  /** Points on the table if every question in the bank were answered. */
  totalPoints: number;
}

export function mcStats(questions: MultipleChoiceQuestion[]): McStats {
  const double = questions.filter((q) => mcFormat(q) === 'double').length;
  const single = questions.length - double;
  return { total: questions.length, single, double, totalPoints: single + double * 2 };
}

/**
 * Assembles one MC section in the real exam's shape, spreading picks across topics so a single
 * over-represented topic can't dominate a run. Falls back to fewer questions (never to the wrong
 * format) if the bank runs dry for a format.
 */
export function assembleMcExam(questions: MultipleChoiceQuestion[]): MultipleChoiceQuestion[] {
  const pick = (format: McFormat, count: number) =>
    spreadAcrossTopics(questions.filter((q) => mcFormat(q) === format), count);
  return [...pick('single', EXAM_SINGLE_COUNT), ...pick('double', EXAM_DOUBLE_COUNT)];
}

/**
 * Round-robins over topics (each topic's own pool shuffled) so the picks cover as many distinct
 * topics as possible before any topic contributes a second question.
 */
function spreadAcrossTopics(pool: MultipleChoiceQuestion[], count: number): MultipleChoiceQuestion[] {
  const byTopic = new Map<string, MultipleChoiceQuestion[]>();
  for (const q of pool) {
    const bucket = byTopic.get(q.topicId);
    if (bucket) bucket.push(q);
    else byTopic.set(q.topicId, [q]);
  }
  const queues = shuffle([...byTopic.values()].map((qs) => shuffle(qs)));
  const picked: MultipleChoiceQuestion[] = [];
  for (let round = 0; picked.length < count; round++) {
    const before = picked.length;
    for (const queue of queues) {
      if (picked.length >= count) break;
      const q = queue[round];
      if (q) picked.push(q);
    }
    if (picked.length === before) break; // every queue exhausted
  }
  return shuffle(picked);
}

export interface McGrade {
  /** True only when the selection is exactly the correct set — the exam's all-or-nothing rule. */
  correct: boolean;
  /** Points actually earned: full value when correct, otherwise 0. Never partial. */
  awarded: number;
  /** Points the question was worth. */
  possible: number;
  /** Set for a 2-of-4 where exactly one of the two correct options was found. */
  halfRight: boolean;
}

export function gradeMc(q: MultipleChoiceQuestion, selected: readonly number[] | undefined): McGrade {
  const possible = mcPoints(q);
  const chosen = new Set(selected ?? []);
  const hits = q.correctIndexes.filter((i) => chosen.has(i)).length;
  const correct = hits === q.correctIndexes.length && chosen.size === q.correctIndexes.length;
  return {
    correct,
    awarded: correct ? possible : 0,
    possible,
    halfRight: !correct && possible === 2 && hits === 1,
  };
}

export interface McScore {
  points: number;
  maxPoints: number;
  correct: number;
  answered: number;
  total: number;
  /** Questions where exactly one of two correct options was marked — worth 0, the costliest miss. */
  halfRight: number;
}

export function scoreMcRun(
  questions: MultipleChoiceQuestion[],
  answers: Record<string, number[]>,
): McScore {
  let points = 0;
  let maxPoints = 0;
  let correct = 0;
  let answered = 0;
  let halfRight = 0;
  for (const q of questions) {
    const grade = gradeMc(q, answers[q.id]);
    maxPoints += grade.possible;
    points += grade.awarded;
    if (grade.correct) correct++;
    if (grade.halfRight) halfRight++;
    if (answers[q.id]?.length) answered++;
  }
  return { points, maxPoints, correct, answered, total: questions.length, halfRight };
}

/** Groups a bank by topic, ordered by the topic list's own ordering. */
export function groupByTopic(
  questions: MultipleChoiceQuestion[],
  topics: Topic[],
): { topic: Topic; questions: MultipleChoiceQuestion[] }[] {
  return topics
    .map((topic) => ({ topic, questions: questions.filter((q) => q.topicId === topic.id) }))
    .filter((g) => g.questions.length > 0);
}

export const OPTION_LETTERS = ['A', 'B', 'C', 'D'] as const;
