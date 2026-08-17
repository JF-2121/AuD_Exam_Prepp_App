import { Link, useParams } from 'react-router-dom';
import type { Topic } from '../../lib/types';

export function TopicTree({ topics }: { topics: Topic[] }) {
  const { topicId } = useParams();
  const categories = [...new Set(topics.map((t) => t.category))];

  return (
    <nav className="flex flex-col gap-4">
      {categories.map((category) => (
        <div key={category}>
          <h3 className="mb-1 text-xs font-semibold uppercase tracking-wide text-[var(--color-text-dim)]">
            {category}
          </h3>
          <ul className="flex flex-col gap-0.5">
            {topics
              .filter((t) => t.category === category)
              .map((t) => (
                <li key={t.id}>
                  <Link
                    to={`/topics/${t.id}`}
                    className={`block rounded px-2 py-1 text-sm ${
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
      ))}
    </nav>
  );
}
