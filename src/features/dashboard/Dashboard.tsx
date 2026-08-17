import { useEffect, useState } from 'react';
import { getAllExamAttempts, getAllQuizAttempts, getAllSrsState } from '../../lib/db';
import { computeMastery, type TopicMastery } from '../../lib/mastery';
import type { ExamAttempt, Flashcard, QuizAttempt, SrsState, Topic } from '../../lib/types';
import { MasteryHeatmap } from './MasteryHeatmap';

export function Dashboard({ topics, flashcards }: { topics: Topic[]; flashcards: Flashcard[] }) {
  const [srsStates, setSrsStates] = useState<SrsState[]>([]);
  const [quizAttempts, setQuizAttempts] = useState<QuizAttempt[]>([]);
  const [examAttempts, setExamAttempts] = useState<ExamAttempt[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    Promise.all([getAllSrsState(), getAllQuizAttempts(), getAllExamAttempts()]).then(([s, q, e]) => {
      setSrsStates(s);
      setQuizAttempts(q);
      setExamAttempts(e);
      setLoaded(true);
    });
  }, []);

  if (!loaded) {
    return <p className="text-[var(--color-text-dim)]">Loading…</p>;
  }

  const mastery: TopicMastery[] = computeMastery(topics, flashcards, srsStates, quizAttempts, examAttempts).sort(
    (a, b) => a.score - b.score,
  );

  return (
    <div>
      <h1 className="mb-1 text-2xl font-semibold text-[var(--color-text-h)]">Dashboard</h1>
      <p className="mb-6 text-sm text-[var(--color-text-dim)]">
        Weakest topics first — combines flashcard maturity, quiz accuracy, and mock exam performance.
      </p>
      <MasteryHeatmap mastery={mastery} />
      <div className="mt-8 grid grid-cols-2 gap-4 text-sm md:grid-cols-4">
        <Stat label="Cards reviewed" value={srsStates.length} />
        <Stat label="Quiz attempts" value={quizAttempts.length} />
        <Stat label="Mock exams taken" value={examAttempts.length} />
        <Stat
          label="Avg exam score"
          value={
            examAttempts.length
              ? `${Math.round((examAttempts.reduce((s, e) => s + e.score, 0) / examAttempts.length) * 100)}%`
              : '—'
          }
        />
      </div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] p-4">
      <p className="text-xs text-[var(--color-text-dim)]">{label}</p>
      <p className="text-xl font-semibold text-[var(--color-text-h)]">{value}</p>
    </div>
  );
}
