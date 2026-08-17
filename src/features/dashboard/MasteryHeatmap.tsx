import { Link } from 'react-router-dom';
import { ListChecks, SquareStack } from 'lucide-react';
import type { TopicMastery } from '../../lib/mastery';

function colorFor(score: number): string {
  if (score < 40) return 'var(--color-bad)';
  if (score < 70) return 'var(--color-warn)';
  return 'var(--color-good)';
}

export function MasteryHeatmap({ mastery }: { mastery: TopicMastery[] }) {
  if (mastery.length === 0) {
    return <p className="text-[var(--color-text-dim)]">No topics yet.</p>;
  }

  return (
    <div className="card p-5">
      <h2 className="mb-4 text-sm font-semibold text-[var(--color-text-h)]">Mastery by topic — weakest first</h2>
      <ul className="flex flex-col gap-4">
        {mastery.map((m) => (
          <li key={m.topicId}>
            <div className="mb-1.5 flex items-center justify-between gap-3 text-sm">
              <Link to={`/topics/${m.topicId}`} className="min-w-0 truncate text-[var(--color-text)] hover:text-[var(--color-accent)]">
                {m.title}
              </Link>
              <span className="shrink-0 font-mono text-xs text-[var(--color-text-dim)]">{m.score}%</span>
            </div>
            <div className="mb-1.5 h-2 overflow-hidden rounded-full bg-[var(--color-surface-hover)]">
              <div
                className="h-full rounded-full transition-[width] duration-300"
                style={{ width: `${m.score}%`, background: colorFor(m.score) }}
              />
            </div>
            <div className="flex gap-3 text-xs">
              <Link to={`/quiz?topic=${m.topicId}`} className="flex items-center gap-1 text-[var(--color-text-dim)] hover:text-[var(--color-accent)]">
                <ListChecks size={12} /> Practice
              </Link>
              <Link to={`/flashcards?topic=${m.topicId}`} className="flex items-center gap-1 text-[var(--color-text-dim)] hover:text-[var(--color-accent)]">
                <SquareStack size={12} /> Flashcards
              </Link>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
