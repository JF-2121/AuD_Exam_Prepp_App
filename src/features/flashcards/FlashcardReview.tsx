import { useSearchParams } from 'react-router-dom';
import { useState } from 'react';
import { RotateCcw, SquareStack, X, Check, Zap, PartyPopper } from 'lucide-react';
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
        <h1 className="flex items-center gap-2 text-2xl font-semibold tracking-tight text-[var(--color-text-h)]">
          <SquareStack size={22} className="text-[var(--color-accent)]" /> Flashcards
        </h1>
        <select
          className="input ml-auto"
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
        <div className="card flex flex-col items-center gap-2 py-16 text-center text-[var(--color-text-dim)]">
          <PartyPopper size={26} className="text-[var(--color-good)]" strokeWidth={1.5} />
          <p>Nothing due right now — nice work. Check back later or pick another topic.</p>
        </div>
      ) : (
        <div className="mx-auto max-w-lg">
          <button
            className="card flex min-h-48 w-full items-center justify-center p-6 text-center text-lg transition-colors hover:bg-[var(--color-surface-hover)]"
            onClick={() => setFlipped((f) => !f)}
          >
            {flipped ? card.back : card.front}
          </button>
          <p className="mt-2 flex items-center justify-center gap-1.5 text-center text-xs text-[var(--color-text-dim)]">
            <RotateCcw size={11} />
            {flipped ? 'Answer' : 'Question — click to flip'} · {dueCards.length} due
          </p>
          {flipped && (
            <div className="mt-4 flex justify-center gap-2">
              <button className="btn" style={{ borderColor: 'var(--color-bad)', color: 'var(--color-bad)' }} onClick={() => handleGrade('again')}>
                <X size={14} /> Again
              </button>
              <button className="btn" style={{ borderColor: 'var(--color-warn)', color: 'var(--color-warn)' }} onClick={() => handleGrade('good')}>
                <Check size={14} /> Good
              </button>
              <button className="btn" style={{ borderColor: 'var(--color-good)', color: 'var(--color-good)' }} onClick={() => handleGrade('easy')}>
                <Zap size={14} /> Easy
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
