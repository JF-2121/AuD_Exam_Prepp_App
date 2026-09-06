import { useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { BookMarked, ListChecks, Timer } from 'lucide-react';
import type { MultipleChoiceQuestion, Topic } from '../../lib/types';
import { McCompendium } from './McCompendium';
import { McDrill } from './McDrill';
import { McExam } from './McExam';
import { EXAM_MAX_POINTS, EXAM_MINUTES, mcStats } from './mcBank';

const MODES = [
  { id: 'drill', label: 'Drill', icon: ListChecks, blurb: 'One at a time, instant feedback' },
  { id: 'exam', label: 'Exam simulation', icon: Timer, blurb: `${EXAM_MAX_POINTS} P in ${EXAM_MINUTES} min` },
  { id: 'compendium', label: 'Compendium', icon: BookMarked, blurb: 'Every question, by topic' },
] as const;

type Mode = (typeof MODES)[number]['id'];

export function McPage({
  questions,
  topics,
}: {
  questions: MultipleChoiceQuestion[];
  topics: Topic[];
}) {
  const [params, setParams] = useSearchParams();
  const mode = (MODES.some((m) => m.id === params.get('mode')) ? params.get('mode') : 'drill') as Mode;
  const stats = useMemo(() => mcStats(questions), [questions]);

  function setMode(next: Mode) {
    setParams((prev) => {
      const p = new URLSearchParams(prev);
      p.set('mode', next);
      return p;
    });
  }

  return (
    <div>
      <McHero stats={stats} />

      <nav className="mb-6 grid gap-2 sm:grid-cols-3">
        {MODES.map((m) => {
          const active = m.id === mode;
          return (
            <button
              key={m.id}
              onClick={() => setMode(m.id)}
              aria-current={active ? 'page' : undefined}
              className={`flex min-h-11 items-center gap-2.5 rounded-md border px-3 py-2.5 text-left transition-colors ${
                active
                  ? 'border-[var(--color-accent)] bg-[var(--color-accent-dim)]'
                  : 'border-[var(--color-border)] bg-[var(--color-surface)] hover:bg-[var(--color-surface-hover)]'
              }`}
            >
              <m.icon
                size={16}
                className={active ? 'text-[var(--color-accent)]' : 'text-[var(--color-text-dim)]'}
              />
              <span className="min-w-0">
                <span
                  className={`block text-sm font-semibold ${active ? 'text-[var(--color-text-h)]' : 'text-[var(--color-text)]'}`}
                >
                  {m.label}
                </span>
                <span className="block text-[11px] text-[var(--color-text-dim)]">{m.blurb}</span>
              </span>
            </button>
          );
        })}
      </nav>

      {mode === 'drill' && <McDrill questions={questions} topics={topics} />}
      {mode === 'exam' && <McExam questions={questions} topics={topics} />}
      {mode === 'compendium' && <McCompendium questions={questions} topics={topics} />}
    </div>
  );
}

/**
 * The header exists to make one thing unmissable: 42 of the exam's 100 points are MC, and 36 of
 * those 42 come from 2-of-4 questions that pay nothing unless *both* marks are right.
 */
function McHero({ stats }: { stats: ReturnType<typeof mcStats> }) {
  return (
    <header className="mb-6">
      <h1 className="mb-1 text-2xl font-semibold tracking-tight text-[var(--color-text-h)]">
        Multiple Choice
      </h1>
      <p className="mb-4 text-sm text-[var(--color-text-dim)]">
        The biggest single block on the paper: {EXAM_MAX_POINTS} of 100 points, and{' '}
        <span className="text-[var(--color-text)]">36 of those 42 are 2-of-4 questions</span>.
      </p>

      <div className="card overflow-hidden">
        <div className="flex" aria-hidden>
          <div
            className="h-1.5 bg-[var(--color-accent-fill)]"
            style={{ width: '36%' }}
            title="18 × 2-of-4 = 36 points"
          />
          <div className="h-1.5 bg-[var(--color-accent)]" style={{ width: '6%' }} title="6 × 1-of-4 = 6 points" />
          <div className="h-1.5 flex-1 bg-[var(--color-border)]" title="The other 58 points of the exam" />
        </div>

        <div className="grid grid-cols-2 divide-x divide-[var(--color-border)] sm:grid-cols-4">
          <Stat value={stats.total} label="questions in the bank" />
          <Stat value={stats.double} label="× 2 of 4 · 2 P each" emphasis />
          <Stat value={stats.single} label="× 1 of 4 · 1 P each" />
          <Stat value={stats.totalPoints} label="points if you cleared it all" />
        </div>

        <p className="border-t border-[var(--color-border)] px-4 py-3 text-xs leading-relaxed text-[var(--color-text-dim)]">
          <span className="font-semibold text-[var(--color-warn)]">All or nothing.</span> On a
          2-of-4, points are awarded only if exactly both correct statements are marked — one right
          and one wrong scores 0, not 1.
        </p>
      </div>
    </header>
  );
}

function Stat({ value, label, emphasis = false }: { value: number; label: string; emphasis?: boolean }) {
  return (
    <div className="px-4 py-3">
      <p
        className={`text-xl font-semibold tracking-tight ${emphasis ? 'text-[var(--color-accent)]' : 'text-[var(--color-text-h)]'}`}
      >
        {value}
      </p>
      <p className="text-[11px] leading-tight text-[var(--color-text-dim)]">{label}</p>
    </div>
  );
}
