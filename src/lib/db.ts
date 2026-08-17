import { openDB, type DBSchema, type IDBPDatabase } from 'idb';
import type { ExamAttempt, QuizAttempt, SrsState } from './types';

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
  meta: {
    key: string;
    value: unknown;
  };
}

let dbPromise: Promise<IDBPDatabase<AudGrindDB>> | null = null;

function getDb() {
  if (!dbPromise) {
    dbPromise = openDB<AudGrindDB>('aud-grind', 1, {
      upgrade(db) {
        db.createObjectStore('srsState', { keyPath: 'flashcardId' });
        const quizStore = db.createObjectStore('quizAttempts', { keyPath: 'id', autoIncrement: true });
        quizStore.createIndex('topicId', 'topicId');
        db.createObjectStore('examAttempts', { keyPath: 'id', autoIncrement: true });
        db.createObjectStore('meta');
      },
    });
  }
  return dbPromise;
}

export async function getSrsState(flashcardId: string): Promise<SrsState | undefined> {
  const db = await getDb();
  return db.get('srsState', flashcardId);
}

export async function getAllSrsState(): Promise<SrsState[]> {
  const db = await getDb();
  return db.getAll('srsState');
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
  const db = await getDb();
  return db.getAll('quizAttempts');
}

export async function recordExamAttempt(attempt: ExamAttempt): Promise<void> {
  const db = await getDb();
  await db.add('examAttempts', attempt);
}

export async function getAllExamAttempts(): Promise<ExamAttempt[]> {
  const db = await getDb();
  return db.getAll('examAttempts');
}
