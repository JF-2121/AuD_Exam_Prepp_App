import { useSearchParams } from 'react-router-dom';
import { useState } from 'react';
import { useSrsQueue } from './useSrsQueue';
import type { Flashcard, Topic } from '../../lib/types';

export function FlashcardReview({ flashcards, topics }: { flashcards: Flashcard[]; topics: Topic[] }) {
  const [params, setParams] = useSearchParams();
  const topicId = params.get('topic') ?? undefined;
  const { dueCards, loaded, grade } = useSrsQueue(flashcards, topicId);
  const [flipped, setFlipped] = useState(false);
  const [cursor, setCursor] = useState(0);

  const card = dueCards[cursor % Math.max(dueCards.length, 1)];

  async function handleGrade(g: 'again' | 'good' | 'easy') {
    if (!card) return;
    await grade(card.id, g);
    setFlipped(false);
    setCursor((c) => c + 1);
  }

  return (
    <div>
      <div className="mb-4 flex items-center gap-2">
        <h1 className="text-2xl font-semibold text-[var(--color-text-h)]">Flashcards</h1>
        <select
          className="ml-auto rounded border border-[var(--color-border)] bg-[var(--color-surface)] px-2 py-1 text-sm"
          value={topicId ?? ''}
          onChange={(e) => setParams(e.target.value ? { topic: e.target.value } : {})}
        >
          <option value="">All topics</option>
          {topics.map((t) => (
            <option key={t.id} value={t.id}>
              {t.title}
            </option>
          ))}
        </select>
      </div>

      {!loaded ? (
        <p className="text-[var(--color-text-dim)]">Loading…</p>
      ) : !card ? (
        <p className="text-[var(--color-text-dim)]">Nothing due right now — nice work. Check back later or pick another topic.</p>
      ) : (
        <div className="mx-auto max-w-lg">
          <button
            className="flex min-h-48 w-full items-center justify-center rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] p-6 text-center text-lg"
            onClick={() => setFlipped((f) => !f)}
          >
            {flipped ? card.back : card.front}
          </button>
          <p className="mt-2 text-center text-xs text-[var(--color-text-dim)]">
            {flipped ? 'Answer' : 'Question — click to flip'} · {dueCards.length} due
          </p>
          {flipped && (
            <div className="mt-4 flex justify-center gap-2">
              <button className="btn" style={{ borderColor: 'var(--color-bad)' }} onClick={() => handleGrade('again')}>
                Again
              </button>
              <button className="btn" style={{ borderColor: 'var(--color-warn)' }} onClick={() => handleGrade('good')}>
                Good
              </button>
              <button className="btn" style={{ borderColor: 'var(--color-good)' }} onClick={() => handleGrade('easy')}>
                Easy
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
