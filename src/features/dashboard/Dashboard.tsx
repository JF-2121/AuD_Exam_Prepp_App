import { useEffect, useState } from 'react';
import { LayoutDashboard, SquareStack, ListChecks, Trophy, TrendingUp, type LucideIcon } from 'lucide-react';
import { getAllExamAttempts, getAllQuizAttempts, getAllReviewLog, getAllSrsState, type ReviewLogEntry } from '../../lib/db';
import { computeMastery, type TopicMastery } from '../../lib/mastery';
import { buildActivityCalendar } from '../../lib/activity';
import type { ExamAttempt, Flashcard, QuizAttempt, SrsState, Topic } from '../../lib/types';
import { MasteryHeatmap } from './MasteryHeatmap';
import { ActivityHeatmap } from './ActivityHeatmap';

export function Dashboard({ topics, flashcards }: { topics: Topic[]; flashcards: Flashcard[] }) {
  const [srsStates, setSrsStates] = useState<SrsState[]>([]);
  const [quizAttempts, setQuizAttempts] = useState<QuizAttempt[]>([]);
  const [examAttempts, setExamAttempts] = useState<ExamAttempt[]>([]);
  const [reviewLog, setReviewLog] = useState<ReviewLogEntry[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    Promise.all([getAllSrsState(), getAllQuizAttempts(), getAllExamAttempts(), getAllReviewLog()]).then(([s, q, e, r]) => {
      setSrsStates(s);
      setQuizAttempts(q);
      setExamAttempts(e);
      setReviewLog(r);
      setLoaded(true);
    });
  }, []);

  if (!loaded) {
    return <p className="text-[var(--color-text-dim)]">Loading…</p>;
  }

  const mastery: TopicMastery[] = computeMastery(topics, flashcards, srsStates, quizAttempts, examAttempts).sort(
    (a, b) => a.score - b.score,
  );
  const overallScore = mastery.length ? Math.round(mastery.reduce((sum, m) => sum + m.score, 0) / mastery.length) : 0;

  const activityTimestamps = [
    ...reviewLog.map((r) => r.timestamp),
    ...quizAttempts.map((q) => q.timestamp),
    ...examAttempts.map((e) => e.finishedAt),
  ];
  const calendar = buildActivityCalendar(activityTimestamps, 18);

  return (
    <div>
      <h1 className="mb-1 flex items-center gap-2 text-2xl font-semibold tracking-tight text-[var(--color-text-h)]">
        <LayoutDashboard size={22} className="text-[var(--color-accent)]" /> Dashboard
      </h1>
      <p className="mb-6 text-sm text-[var(--color-text-dim)]">
        Weakest topics first — combines flashcard maturity, quiz accuracy, and mock exam performance.
      </p>

      <div className="card mb-6 p-5">
        <div className="mb-2 flex items-baseline justify-between">
          <h2 className="text-sm font-semibold text-[var(--color-text-h)]">Overall exam readiness</h2>
          <span className="text-2xl font-bold tabular-nums text-[var(--color-text-h)]">{overallScore}%</span>
        </div>
        <div className="h-3 overflow-hidden rounded-full bg-[var(--color-surface-hover)]">
          <div
            className="h-full rounded-full bg-gradient-to-r from-[var(--color-accent)] to-[var(--color-good)] transition-[width] duration-500"
            style={{ width: `${overallScore}%` }}
          />
        </div>
      </div>

      <div className="mb-6 grid grid-cols-2 gap-3 text-sm md:grid-cols-4">
        <Stat icon={SquareStack} label="Cards reviewed" value={srsStates.length} />
        <Stat icon={ListChecks} label="Quiz attempts" value={quizAttempts.length} />
        <Stat icon={Trophy} label="Mock exams taken" value={examAttempts.length} />
        <Stat
          icon={TrendingUp}
          label="Avg exam score"
          value={
            examAttempts.length
              ? `${Math.round((examAttempts.reduce((s, e) => s + e.score, 0) / examAttempts.length) * 100)}%`
              : '—'
          }
        />
      </div>

      <div className="mb-6">
        <ActivityHeatmap days={calendar} />
      </div>

      <MasteryHeatmap mastery={mastery} />
    </div>
  );
}

function Stat({ icon: Icon, label, value }: { icon: LucideIcon; label: string; value: string | number }) {
  return (
    <div className="card flex items-center gap-3 p-4">
      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-[var(--color-accent-dim)] text-[var(--color-accent)]">
        <Icon size={16} />
      </span>
      <div className="min-w-0">
        <p className="truncate text-xs text-[var(--color-text-dim)]">{label}</p>
        <p className="text-lg font-semibold text-[var(--color-text-h)]">{value}</p>
      </div>
    </div>
  );
}
