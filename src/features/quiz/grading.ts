import { getAlgorithm } from '../visualizer/registry';
import type { MultipleChoiceQuestion, Question, ShortAnswerQuestion, TraceQuestion } from '../../lib/types';

export interface GradeResult {
  correct: boolean;
  explanation: string;
}

function gradeMultipleChoice(q: MultipleChoiceQuestion, answer: number[]): GradeResult {
  const expected = [...q.correctIndexes].sort((a, b) => a - b);
  const given = [...answer].sort((a, b) => a - b);
  const correct = expected.length === given.length && expected.every((v, i) => v === given[i]);
  return { correct, explanation: q.explanation };
}

function normalize(s: string): string {
  return s.trim().toLowerCase().replace(/\s+/g, ' ');
}

function gradeShortAnswer(q: ShortAnswerQuestion, answer: string): GradeResult {
  const correct = q.acceptedAnswers.some((a) => normalize(a) === normalize(answer));
  return { correct, explanation: q.explanation };
}

/**
 * Ground truth for a `trace` question comes from re-running the same generateSteps
 * function the visualizer uses (not from the question's own expectedFinalOutput field,
 * which is only an authoring-time sanity check) so grading can never drift from the
 * visualizer's behavior.
 */
function gradeTrace(q: TraceQuestion, studentAnswer: unknown): GradeResult {
  const algorithm = getAlgorithm(q.algorithmId);
  if (!algorithm) {
    return { correct: false, explanation: `Unknown algorithm "${q.algorithmId}" referenced by this question.` };
  }
  const steps = algorithm.generateSteps(q.initialInput);
  const finalState = steps[steps.length - 1].state;
  const actual = algorithm.extractResult ? algorithm.extractResult(finalState) : finalState;
  const correct = JSON.stringify(studentAnswer) === JSON.stringify(actual);
  return { correct, explanation: q.explanation };
}

export function gradeQuestion(question: Question, answer: unknown): GradeResult {
  if (answer === undefined || answer === null) {
    return { correct: false, explanation: question.explanation };
  }
  switch (question.type) {
    case 'multiple-choice':
      return gradeMultipleChoice(question, answer as number[]);
    case 'short-answer':
      return gradeShortAnswer(question, answer as string);
    case 'trace':
      return gradeTrace(question, answer);
  }
}
