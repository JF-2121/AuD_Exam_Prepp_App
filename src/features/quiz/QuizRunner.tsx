import { useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { CheckCircle2, XCircle } from 'lucide-react';
import { recordQuizAttempt } from '../../lib/db';
import type { Difficulty, Question, Topic } from '../../lib/types';
import { DifficultyBadge } from '../../components/DifficultyBadge';
import { gradeQuestion, type GradeResult } from './grading';
import { MultipleChoice } from './MultipleChoice';
import { ShortAnswer } from './ShortAnswer';
import { TraceAlgorithm } from './TraceAlgorithm';

function shuffle<T>(arr: T[]): T[] {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

export function QuizRunner({ questions, topics }: { questions: Question[]; topics: Topic[] }) {
  const [params, setParams] = useSearchParams();
  const topicId = params.get('topic') ?? undefined;
  const difficulty = (params.get('difficulty') as Difficulty | null) ?? undefined;

  const pool = useMemo(() => {
    let p = questions;
    if (topicId) p = p.filter((q) => q.topicId === topicId);
    if (difficulty) p = p.filter((q) => q.difficulty === difficulty);
    return shuffle(p);
  }, [questions, topicId, difficulty]);

  const [cursor, setCursor] = useState(0);
  const [result, setResult] = useState<GradeResult | null>(null);
  const [score, setScore] = useState({ correct: 0, total: 0 });
  const question = pool[cursor];

  async function handleSubmit(answer: unknown) {
    if (!question) return;
    const gradeResult = gradeQuestion(question, answer);
    setResult(gradeResult);
    setScore((s) => ({ correct: s.correct + (gradeResult.correct ? 1 : 0), total: s.total + 1 }));
    await recordQuizAttempt({
      questionId: question.id,
      topicId: question.topicId,
      correct: gradeResult.correct,
      timestamp: new Date().toISOString(),
    });
  }

  function next() {
    setResult(null);
    setCursor((c) => c + 1);
  }

  return (
    <div>
      <div className="mb-4 flex flex-wrap items-center gap-2">
        <h1 className="text-2xl font-semibold tracking-tight text-[var(--color-text-h)]">Practice</h1>
        <select
          className="input ml-auto"
          value={topicId ?? ''}
          onChange={(e) => setParams((p) => new URLSearchParams({ ...Object.fromEntries(p), topic: e.target.value || '' }))}
        >
          <option value="">All topics</option>
          {topics.map((t) => (
            <option key={t.id} value={t.id}>
              {t.title}
            </option>
          ))}
        </select>
        <select
          className="input"
          value={difficulty ?? ''}
          onChange={(e) => setParams((p) => new URLSearchParams({ ...Object.fromEntries(p), difficulty: e.target.value || '' }))}
        >
          <option value="">Any difficulty</option>
          <option value="easy">Easy</option>
          <option value="medium">Medium</option>
          <option value="hard">Hard</option>
        </select>
      </div>

      <p className="mb-3 text-sm text-[var(--color-text-dim)]">
        Score this session: <span className="font-medium text-[var(--color-text)]">{score.correct}/{score.total}</span>
      </p>

      {!question ? (
        <p className="text-[var(--color-text-dim)]">No questions match this filter (or you've been through them all).</p>
      ) : (
        <div className="card p-5">
          <div className="mb-3 flex items-center gap-2">
            <DifficultyBadge difficulty={question.difficulty} />
            <span className="badge badge-neutral">{question.type}</span>
          </div>
          {!result && question.type === 'multiple-choice' && <MultipleChoice question={question} onSubmit={handleSubmit} />}
          {!result && question.type === 'short-answer' && <ShortAnswer question={question} onSubmit={handleSubmit} />}
          {!result && question.type === 'trace' && <TraceAlgorithm question={question} onSubmit={handleSubmit} />}
          {result && (
            <div>
              <p className={`flex items-center gap-1.5 font-medium ${result.correct ? 'text-[var(--color-good)]' : 'text-[var(--color-bad)]'}`}>
                {result.correct ? <CheckCircle2 size={16} /> : <XCircle size={16} />}
                {result.correct ? 'Correct!' : 'Not quite.'}
              </p>
              <p className="mt-1 text-sm text-[var(--color-text-dim)]">{result.explanation}</p>
              <button className="btn btn-primary mt-3" onClick={next}>
                Next question
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
