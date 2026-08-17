import type { SrsState } from './types';

export type Grade = 'again' | 'good' | 'easy';

const GRADE_QUALITY: Record<Grade, number> = {
  again: 0,
  good: 3,
  easy: 5,
};

function initialState(flashcardId: string): SrsState {
  return {
    flashcardId,
    easeFactor: 2.5,
    interval: 0,
    repetitions: 0,
    dueDate: new Date().toISOString(),
    lastReviewed: new Date().toISOString(),
  };
}

/** SM-2 spaced repetition. `previous` is undefined for a card that has never been reviewed. */
export function nextSrsState(previous: SrsState | undefined, flashcardId: string, grade: Grade): SrsState {
  const state = previous ?? initialState(flashcardId);
  const quality = GRADE_QUALITY[grade];

  let { easeFactor, interval, repetitions } = state;

  if (quality < 3) {
    repetitions = 0;
    interval = 1;
  } else {
    repetitions += 1;
    if (repetitions === 1) interval = 1;
    else if (repetitions === 2) interval = 6;
    else interval = Math.round(interval * easeFactor);
  }

  easeFactor = Math.max(1.3, easeFactor + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02)));

  const now = new Date();
  const dueDate = new Date(now);
  dueDate.setDate(dueDate.getDate() + interval);

  return {
    flashcardId,
    easeFactor,
    interval,
    repetitions,
    dueDate: dueDate.toISOString(),
    lastReviewed: now.toISOString(),
  };
}

export function isDue(state: SrsState | undefined): boolean {
  if (!state) return true;
  return new Date(state.dueDate).getTime() <= Date.now();
}

/** A card is considered "mature" once its interval clears this many days. */
export const MATURE_INTERVAL_DAYS = 21;
