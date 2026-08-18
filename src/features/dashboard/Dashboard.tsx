import { useEffect, useState } from 'react';
import { LayoutDashboard, SquareStack, ListChecks, Trophy, TrendingUp, type LucideIcon } from 'lucide-react';
import { getAllExamAttempts, getAllQuizAttempts, getAllReviewLog, getAllSrsState, type ReviewLogEntry } from '../../lib/db';
import { computeMastery, type TopicMastery } from '../../lib/mastery';
import { buildActivityCalendar } from '../../lib/activity';
import type { ExamAttempt, Flashcard, QuizAttempt, SrsState, Topic } from '../../lib/types';
import { MasteryHeatmap } from './MasteryHeatmap';
import { ActivityHeatmap } from './ActivityHeatmap';
import { BackupPanel } from './BackupPanel';

export function Dashboard({ topics, flashcards }: { topics: Topic[]; flashcards: Flashcard[] }) {
  const [srsStates, setSrsStates] = useState<SrsState[]>([]);
  const [quizAttempts, setQuizAttempts] = useState<QuizAttempt[]>([]);
  const [examAttempts, setExamAttempts] = useState<ExamAttempt[]>([]);
  const [reviewLog, setReviewLog] = useState<ReviewLogEntry[]>([]);
  const [loaded, setLoaded] = useState(false);

  function loadAll() {
    return Promise.all([getAllSrsState(), getAllQuizAttempts(), getAllExamAttempts(), getAllReviewLog()]).then(
      ([s, q, e, r]) => {
        setSrsStates(s);
        setQuizAttempts(q);
        setExamAttempts(e);
        setReviewLog(r);
        setLoaded(true);
      },
    );
  }

  useEffect(() => {
    loadAll();
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
      <h1 className="mb-1 flex items-center gap-2.5 text-[28px] font-semibold tracking-tight text-[var(--color-text-h)]">
        <LayoutDashboard size={24} className="text-[var(--color-accent)]" strokeWidth={2} /> Dashboard
      </h1>
      <p className="mb-6 text-sm text-[var(--color-text-dim)]">
        Weakest topics first — combines flashcard maturity, quiz accuracy, and mock exam performance.
      </p>

      <div className="card mb-6 overflow-hidden p-5 sm:p-6">
        <div className="mb-3 flex items-baseline justify-between gap-4">
          <h2 className="text-sm tracking-wide text-[var(--color-text-dim)]">Overall exam readiness</h2>
          <span className="text-4xl font-semibold tabular-nums text-[var(--color-accent)]">
            {overallScore}
            <span className="text-xl text-[var(--color-text-dim)]">%</span>
          </span>
        </div>
        <div className="h-2.5 overflow-hidden rounded-full bg-[var(--color-surface-hover)]">
          <div
            className="h-full rounded-full bg-[var(--color-accent-fill)] transition-[width] duration-500"
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

      <div className="mb-6">
        <MasteryHeatmap mastery={mastery} />
      </div>

      <BackupPanel onImported={loadAll} />
    </div>
  );
}

function Stat({ icon: Icon, label, value }: { icon: LucideIcon; label: string; value: string | number }) {
  return (
    <div className="card flex items-center gap-3 p-4">
      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[var(--color-accent-dim)] text-[var(--color-accent)]">
        <Icon size={16} strokeWidth={2} />
      </span>
      <div className="min-w-0">
        <p className="truncate text-xs text-[var(--color-text-dim)]">{label}</p>
        <p className="text-xl font-semibold text-[var(--color-text-h)]">{value}</p>
      </div>
    </div>
  );
}
