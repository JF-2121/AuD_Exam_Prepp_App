import { Link, useParams } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { BookOpen, ListChecks, Play, SquareStack } from 'lucide-react';
import type { Topic } from '../../lib/types';
import { getAlgorithm } from '../visualizer/registry';
import { useT } from '../../lib/i18n/locale';
import type { MessageKey } from '../../lib/i18n/messages';

export function TopicPage({ topics }: { topics: Topic[] }) {
  const t = useT();
  const { topicId } = useParams();
  const topic = topics.find((t) => t.id === topicId);

  if (!topicId) {
    return (
      <div className="flex flex-col items-center justify-center gap-2 py-24 text-center text-[var(--color-text-dim)]">
        <BookOpen size={28} strokeWidth={1.5} />
        <p>{t('topics.pickPrompt')}</p>
      </div>
    );
  }

  if (!topic) {
    return <p className="text-[var(--color-text-dim)]">{t('topics.notFound')}</p>;
  }

  return (
    <article>
      <h1 className="mb-1 text-2xl font-semibold tracking-tight text-[var(--color-text-h)]">{topic.title}</h1>
      <span className="badge badge-neutral mb-4">{t(`category.${topic.category}` as MessageKey)}</span>
      <div className="mb-6 flex flex-wrap gap-2">
        {topic.relatedAlgorithmIds.map((algoId) => (
          <Link key={algoId} to={`/visualize/${algoId}`} className="btn btn-primary">
            <Play size={14} /> {getAlgorithm(algoId)?.title ?? algoId}
          </Link>
        ))}
        <Link to={`/quiz?topic=${topic.id}`} className="btn">
          <ListChecks size={14} /> {t('topics.practiceThis')}
        </Link>
        <Link to={`/flashcards?topic=${topic.id}`} className="btn">
          <SquareStack size={14} /> {t('topics.reviewFlashcards')}
        </Link>
      </div>
      <div className="prose prose-invert max-w-none text-[var(--color-text)]">
        <ReactMarkdown remarkPlugins={[remarkGfm]}>{topic.body}</ReactMarkdown>
      </div>
    </article>
  );
}
