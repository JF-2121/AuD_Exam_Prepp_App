import { Link, useParams } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import type { Topic } from '../../lib/types';

export function TopicPage({ topics }: { topics: Topic[] }) {
  const { topicId } = useParams();
  const topic = topics.find((t) => t.id === topicId);

  if (!topic) {
    return <p className="text-[var(--color-text-dim)]">Topic not found.</p>;
  }

  return (
    <article>
      <h1 className="mb-1 text-2xl font-semibold text-[var(--color-text-h)]">{topic.title}</h1>
      <p className="mb-4 text-sm text-[var(--color-text-dim)]">{topic.category}</p>
      <div className="mb-6 flex gap-2">
        {topic.relatedAlgorithmIds.map((algoId) => (
          <Link key={algoId} to={`/visualize/${algoId}`} className="btn btn-primary">
            Visualize {algoId}
          </Link>
        ))}
        <Link to={`/quiz?topic=${topic.id}`} className="btn">
          Practice this topic
        </Link>
        <Link to={`/flashcards?topic=${topic.id}`} className="btn">
          Review flashcards
        </Link>
      </div>
      <div className="prose prose-invert max-w-none text-[var(--color-text)]">
        <ReactMarkdown remarkPlugins={[remarkGfm]}>{topic.body}</ReactMarkdown>
      </div>
    </article>
  );
}
