export interface Topic {
  id: string;
  title: string;
  category: string;
  order: number;
  relatedAlgorithmIds: string[];
  sourceFiles?: string[];
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
  options: string[];
  correctIndex: number;
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
