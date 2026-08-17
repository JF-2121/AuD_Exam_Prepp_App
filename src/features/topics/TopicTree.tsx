import { Link, useParams } from 'react-router-dom';
import { ArrowDownWideNarrow, Compass, GitBranch, Infinity as InfinityIcon, Layers, Puzzle, Share2, type LucideIcon } from 'lucide-react';
import type { Topic } from '../../lib/types';

const CATEGORY_ICONS: Record<string, LucideIcon> = {
  Grundlagen: Compass,
  Sorting: ArrowDownWideNarrow,
  'Basic Data Structures': Layers,
  Trees: GitBranch,
  Graphs: Share2,
  'Advanced Design': Puzzle,
  'Complexity Theory': InfinityIcon,
};

export function TopicTree({ topics }: { topics: Topic[] }) {
  const { topicId } = useParams();
  const categories = [...new Set(topics.map((t) => t.category))];

  return (
    <nav className="flex flex-col gap-4">
      {categories.map((category) => {
        const Icon = CATEGORY_ICONS[category] ?? Layers;
        return (
          <div key={category}>
            <h3 className="mb-1 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-[var(--color-text-dim)]">
              <Icon size={13} />
              {category}
            </h3>
            <ul className="flex flex-col gap-0.5">
              {topics
                .filter((t) => t.category === category)
                .map((t) => (
                  <li key={t.id}>
                    <Link
                      to={`/topics/${t.id}`}
                      className={`block rounded-md px-2 py-1 text-sm transition-colors ${
                        topicId === t.id
                          ? 'bg-[var(--color-accent-dim)] text-[var(--color-accent)]'
                          : 'text-[var(--color-text)] hover:bg-[var(--color-surface-hover)]'
                      }`}
                    >
                      {t.title}
                    </Link>
                  </li>
                ))}
            </ul>
          </div>
        );
      })}
    </nav>
  );
}
