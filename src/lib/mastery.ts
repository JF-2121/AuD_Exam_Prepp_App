import { MATURE_INTERVAL_DAYS } from './srs';
import type { ExamAttempt, Flashcard, QuizAttempt, SrsState, Topic } from './types';

export interface TopicMastery {
  topicId: string;
  title: string;
  score: number;
  srsMaturity: number;
  quizAccuracy: number | null;
  examAccuracy: number | null;
}

export function computeMastery(
  topics: Topic[],
  flashcards: Flashcard[],
  srsStates: SrsState[],
  quizAttempts: QuizAttempt[],
  examAttempts: ExamAttempt[],
): TopicMastery[] {
  const srsById = new Map(srsStates.map((s) => [s.flashcardId, s]));

  return topics.map((topic) => {
    const cards = flashcards.filter((f) => f.topicId === topic.id);
    const matureCount = cards.filter((c) => {
      const s = srsById.get(c.id);
      return s && s.interval >= MATURE_INTERVAL_DAYS;
    }).length;
    const srsMaturity = cards.length ? matureCount / cards.length : 0;

    const attempts = quizAttempts.filter((a) => a.topicId === topic.id);
    const recent = attempts.slice(-15);
    const quizAccuracy = recent.length ? recent.filter((a) => a.correct).length / recent.length : null;

    const examScores = examAttempts
      .map((e) => e.perTopic[topic.id])
      .filter((v): v is number => typeof v === 'number');
    const examAccuracy = examScores.length ? examScores.reduce((a, b) => a + b, 0) / examScores.length : null;

    const parts = [srsMaturity, quizAccuracy ?? 0, examAccuracy ?? 0];
    const weights = [1, quizAccuracy !== null ? 1 : 0, examAccuracy !== null ? 1 : 0];
    const totalWeight = weights.reduce((a, b) => a + b, 0) || 1;
    const score = Math.round((parts.reduce((sum, p, i) => sum + p * weights[i], 0) / totalWeight) * 100);

    return { topicId: topic.id, title: topic.title, score, srsMaturity, quizAccuracy, examAccuracy };
  });
}
