import { useState } from 'react';
import { Check } from 'lucide-react';
import type { MultipleChoiceQuestion } from '../../lib/types';

export function MultipleChoice({
  question,
  onSubmit,
}: {
  question: MultipleChoiceQuestion;
  onSubmit: (answer: number[]) => void;
}) {
  const [selected, setSelected] = useState<number[]>([]);
  const requiredCount = question.correctIndexes.length;
  const multi = requiredCount > 1;

  function toggle(i: number) {
    if (!multi) {
      setSelected([i]);
      return;
    }
    setSelected((prev) => {
      if (prev.includes(i)) return prev.filter((x) => x !== i);
      if (prev.length >= requiredCount) return prev;
      return [...prev, i];
    });
  }

  return (
    <div>
      <p className="mb-1">{question.prompt}</p>
      {multi && (
        <p className="mb-3 text-xs text-[var(--color-text-dim)]">
          Select exactly {requiredCount} options ({selected.length}/{requiredCount} chosen).
        </p>
      )}
      <div className={multi ? 'mt-3 flex flex-col gap-2' : 'flex flex-col gap-2'}>
        {question.options.map((opt, i) => {
          const isSelected = selected.includes(i);
          return (
            <button
              key={i}
              className={`flex min-h-11 items-center gap-2 rounded-md border px-3 py-2 text-left text-sm transition-colors ${
                isSelected
                  ? 'border-[var(--color-accent)] bg-[var(--color-accent-dim)]'
                  : 'border-[var(--color-border)] hover:bg-[var(--color-surface-hover)]'
              }`}
              onClick={() => toggle(i)}
            >
              <span
                className={`flex h-4 w-4 shrink-0 items-center justify-center border ${multi ? 'rounded' : 'rounded-full'} ${
                  isSelected ? 'border-[var(--color-accent-fill)] bg-[var(--color-accent-fill)]' : 'border-[var(--color-border-strong)]'
                }`}
              >
                {isSelected && <Check size={11} className="text-[var(--color-on-accent-fill)]" strokeWidth={3} />}
              </span>
              {opt}
            </button>
          );
        })}
      </div>
      <button className="btn btn-primary mt-3" disabled={selected.length !== requiredCount} onClick={() => onSubmit(selected)}>
        Submit
      </button>
    </div>
  );
}
