import { useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { BookMarked, ListChecks, Timer } from 'lucide-react';
import type { MultipleChoiceQuestion, Topic } from '../../lib/types';
import { McCompendium } from './McCompendium';
import { McDrill } from './McDrill';
import { McExam } from './McExam';
import { EXAM_MAX_POINTS, EXAM_MINUTES, mcStats } from './mcBank';
import { useT, type Translate } from '../../lib/i18n/locale';

const MODES = [
  { id: 'drill', labelKey: 'mc.modeDrill', blurbKey: 'mc.modeDrillBlurb', icon: ListChecks },
  { id: 'exam', labelKey: 'mc.modeExam', blurbKey: 'mc.modeExamBlurb', icon: Timer },
  { id: 'compendium', labelKey: 'mc.modeCompendium', blurbKey: 'mc.modeCompendiumBlurb', icon: BookMarked },
] as const;

type Mode = (typeof MODES)[number]['id'];

export function McPage({
  questions,
  topics,
}: {
  questions: MultipleChoiceQuestion[];
  topics: Topic[];
}) {
  const t = useT();
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
      <McHero stats={stats} t={t} />

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
                  {t(m.labelKey)}
                </span>
                <span className="block text-[11px] text-[var(--color-text-dim)]">
                  {t(m.blurbKey, { points: EXAM_MAX_POINTS, minutes: EXAM_MINUTES })}
                </span>
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
function McHero({ stats, t }: { stats: ReturnType<typeof mcStats>; t: Translate }) {
  return (
    <header className="mb-6">
      <h1 className="mb-1 text-2xl font-semibold tracking-tight text-[var(--color-text-h)]">
        {t('mc.title')}
      </h1>
      {/* The lead sentence emphasises one clause, so it carries a <b> in the catalogue and is
          split around it rather than being assembled from fragments that don't reorder well. */}
      <p className="mb-4 text-sm text-[var(--color-text-dim)]">
        <Emphasised text={t('mc.heroLead', { points: EXAM_MAX_POINTS })} />
      </p>

      <div className="card overflow-hidden">
        <div className="flex" aria-hidden>
          <div
            className="h-1.5 bg-[var(--color-accent-fill)]"
            style={{ width: '36%' }}
            title={t('mc.barDouble')}
          />
          <div className="h-1.5 bg-[var(--color-accent)]" style={{ width: '6%' }} title={t('mc.barSingle')} />
          <div className="h-1.5 flex-1 bg-[var(--color-border)]" title={t('mc.barRest')} />
        </div>

        <div className="grid grid-cols-2 divide-x divide-[var(--color-border)] sm:grid-cols-4">
          <Stat value={stats.total} label={t('mc.statQuestions')} />
          <Stat value={stats.double} label={t('mc.statDouble')} emphasis />
          <Stat value={stats.single} label={t('mc.statSingle')} />
          <Stat value={stats.totalPoints} label={t('mc.statPoints')} />
        </div>

        <p className="border-t border-[var(--color-border)] px-4 py-3 text-xs leading-relaxed text-[var(--color-text-dim)]">
          <span className="font-semibold text-[var(--color-warn)]">{t('mc.allOrNothingLabel')}</span>{' '}
          {t('mc.allOrNothingBody')}
        </p>
      </div>
    </header>
  );
}

/** Renders a translated string that marks one clause with `<b>…</b>`. */
function Emphasised({ text }: { text: string }) {
  const [before, rest] = text.split('<b>');
  const [bold, after] = (rest ?? '').split('</b>');
  if (rest === undefined) return <>{text}</>;
  return (
    <>
      {before}
      <span className="text-[var(--color-text)]">{bold}</span>
      {after}
    </>
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
