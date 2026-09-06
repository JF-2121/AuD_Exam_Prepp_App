import { useMemo, useState } from 'react';
import { ChevronRight, Eye, EyeOff, Search } from 'lucide-react';
import { mcFormat } from '../../lib/types';
import type { McFormat, MultipleChoiceQuestion, Topic } from '../../lib/types';
import { DifficultyBadge } from '../../components/DifficultyBadge';
import { McFormatBadge } from './McFormatBadge';
import { McOptions } from './McOptions';
import { McPrompt } from './McPrompt';
import { filterMc, groupByTopic, mcStats } from './mcBank';

/**
 * Every question in the bank, grouped by topic and searchable — the reference half of the tab,
 * for looking something up rather than being tested on it. Answers are hidden by default so a
 * group can also be used as a quick self-test.
 */
export function McCompendium({
  questions,
  topics,
}: {
  questions: MultipleChoiceQuestion[];
  topics: Topic[];
}) {
  const [query, setQuery] = useState('');
  const [format, setFormat] = useState<McFormat | ''>('');
  const [open, setOpen] = useState<Set<string>>(new Set());
  const [revealAll, setRevealAll] = useState(false);

  const matched = useMemo(() => {
    const base = filterMc(questions, { format: format || undefined });
    const q = query.trim().toLowerCase();
    if (!q) return base;
    return base.filter(
      (item) =>
        item.prompt.toLowerCase().includes(q) ||
        item.explanation.toLowerCase().includes(q) ||
        item.options.some((o) => o.toLowerCase().includes(q)) ||
        (item.source ?? '').toLowerCase().includes(q),
    );
  }, [questions, query, format]);

  const groups = useMemo(() => groupByTopic(matched, topics), [matched, topics]);
  const searching = query.trim().length > 0;

  function toggleTopic(id: string) {
    setOpen((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  return (
    <div>
      <div className="mb-4 flex flex-wrap items-center gap-2">
        <div className="relative min-w-56 flex-1">
          <Search
            size={14}
            className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[var(--color-text-dim)]"
          />
          <input
            className="input w-full pl-10"
            placeholder="Search prompts, options, explanations, sources…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
        <select
          className="input"
          value={format}
          onChange={(e) => setFormat(e.target.value as McFormat | '')}
        >
          <option value="">Both formats</option>
          <option value="double">2 of 4 only</option>
          <option value="single">1 of 4 only</option>
        </select>
        <button className="btn" onClick={() => setRevealAll((v) => !v)}>
          {revealAll ? <EyeOff size={14} /> : <Eye size={14} />}
          {revealAll ? 'Hide answers' : 'Show answers'}
        </button>
      </div>

      <p className="mb-3 text-sm text-[var(--color-text-dim)]">
        {matched.length} question{matched.length === 1 ? '' : 's'} across {groups.length} topic
        {groups.length === 1 ? '' : 's'}
        {searching && ' matching your search'}.
      </p>

      {groups.length === 0 && (
        <div className="card p-8 text-center">
          <p className="text-[var(--color-text-dim)]">Nothing matches that search.</p>
        </div>
      )}

      <div className="flex flex-col gap-2">
        {groups.map(({ topic, questions: items }) => {
          // A search implies the reader wants to see the hits, so matched groups open themselves.
          const expanded = searching || open.has(topic.id);
          const stats = mcStats(items);
          return (
            <section key={topic.id} className="card overflow-hidden">
              <button
                className="flex w-full min-h-11 items-center gap-3 px-4 py-3 text-left transition-colors hover:bg-[var(--color-surface-hover)]"
                onClick={() => toggleTopic(topic.id)}
              >
                <ChevronRight
                  size={15}
                  className={`shrink-0 text-[var(--color-text-dim)] transition-transform ${expanded ? 'rotate-90' : ''}`}
                />
                <span className="min-w-0 flex-1 text-sm font-semibold text-[var(--color-text-h)]">
                  {topic.title}
                </span>
                <span className="shrink-0 text-xs text-[var(--color-text-dim)]">
                  {stats.double} × 2/4 · {stats.single} × 1/4 · {stats.totalPoints} P
                </span>
              </button>

              {expanded && (
                <ol className="flex flex-col gap-4 border-t border-[var(--color-border)] px-4 py-4">
                  {items.map((q, i) => (
                    <CompendiumEntry key={q.id} question={q} index={i + 1} forceReveal={revealAll} />
                  ))}
                </ol>
              )}
            </section>
          );
        })}
      </div>
    </div>
  );
}

function CompendiumEntry({
  question,
  index,
  forceReveal,
}: {
  question: MultipleChoiceQuestion;
  index: number;
  forceReveal: boolean;
}) {
  const [reveal, setReveal] = useState(false);
  const shown = forceReveal || reveal;

  return (
    <li>
      <div className="mb-2 flex flex-wrap items-center gap-2">
        <span className="text-xs font-semibold text-[var(--color-text-dim)]">{index}.</span>
        <McFormatBadge question={question} />
        <DifficultyBadge difficulty={question.difficulty} />
        {question.source && (
          <span className="text-[11px] text-[var(--color-text-dim)] opacity-70">{question.source}</span>
        )}
      </div>
      <McPrompt text={question.prompt} className="mb-2 text-sm text-[var(--color-text)]" />
      <McOptions
        question={question}
        selected={shown ? question.correctIndexes : []}
        revealed={shown}
      />
      {shown ? (
        <p className="mt-2 text-sm text-[var(--color-text-dim)]">{question.explanation}</p>
      ) : (
        <button
          className="mt-2 text-xs font-semibold text-[var(--color-accent)] hover:text-[var(--color-accent-hover)]"
          onClick={() => setReveal(true)}
        >
          Reveal {mcFormat(question) === 'double' ? 'both answers' : 'the answer'}
        </button>
      )}
    </li>
  );
}
