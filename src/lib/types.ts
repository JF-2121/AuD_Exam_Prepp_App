export interface Topic {
  id: string;
  title: string;
  category: string;
  order: number;
  relatedAlgorithmIds: string[];
  body: string;
}

export interface Flashcard {
  id: string;
  topicId: string;
  front: string;
  back: string;
  tags?: string[];
}

export type Difficulty = 'easy' | 'medium' | 'hard';

interface QuestionBase {
  id: string;
  topicId: string;
  difficulty: Difficulty;
  prompt: string;
  explanation: string;
}

export interface MultipleChoiceQuestion extends QuestionBase {
  type: 'multiple-choice';
  /** Always 4, matching the real exam's format. */
  options: string[];
  /**
   * Indexes of every correct option. Length 1 = the exam's Part I ("genau eine der vier
   * Aussagen ist richtig", 1 point); length 2 = Part II ("genau zwei der vier Aussagen sind
   * richtig", 2 points, awarded only if *exactly* both are marked).
   */
  correctIndexes: number[];
  /**
   * Revision pointer into the typed course summary, e.g. "AuD-Zusammenfassung §6.2, rotation
   * table". Never a reference to an exercise sheet, past paper or exam protocol — see content/README.
   */
  source?: string;
}

/** The two MC formats the exam uses, keyed off how many options are correct. */
export type McFormat = 'single' | 'double';

export function mcFormat(q: MultipleChoiceQuestion): McFormat {
  return q.correctIndexes.length >= 2 ? 'double' : 'single';
}

/**
 * Points a question is worth in the real exam: 1 for a 1-of-4, 2 for a 2-of-4. Scoring is
 * all-or-nothing per question ("Es werden nur dann Punkte vergeben, wenn genau die beiden
 * richtigen Aussagen markiert wurden") — a half-right 2-of-4 scores 0, not 1.
 */
export function mcPoints(q: MultipleChoiceQuestion): number {
  return mcFormat(q) === 'double' ? 2 : 1;
}

export interface ShortAnswerQuestion extends QuestionBase {
  type: 'short-answer';
  acceptedAnswers: string[];
}

export interface TraceQuestion extends QuestionBase {
  type: 'trace';
  algorithmId: string;
  initialInput: unknown;
  expectedFinalOutput: unknown;
}

export type Question = MultipleChoiceQuestion | ShortAnswerQuestion | TraceQuestion;

export interface ExamSection {
  topicIds: string[];
  count: number;
  types?: Question['type'][];
  difficulty?: Difficulty;
}

export interface ExamTemplate {
  id: string;
  title: string;
  durationMinutes: number;
  sections: ExamSection[];
}

export interface SrsState {
  flashcardId: string;
  easeFactor: number;
  interval: number;
  repetitions: number;
  dueDate: string;
  lastReviewed: string;
}

export interface QuizAttempt {
  id?: number;
  questionId: string;
  topicId: string;
  correct: boolean;
  timestamp: string;
}

export interface ExamAttempt {
  id?: number;
  examId: string;
  startedAt: string;
  finishedAt: string;
  score: number;
  perTopic: Record<string, number>;
}
