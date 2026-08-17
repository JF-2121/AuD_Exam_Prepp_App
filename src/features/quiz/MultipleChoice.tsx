import { useState } from 'react';
import type { MultipleChoiceQuestion } from '../../lib/types';

export function MultipleChoice({
  question,
  onSubmit,
}: {
  question: MultipleChoiceQuestion;
  onSubmit: (answer: number) => void;
}) {
  const [selected, setSelected] = useState<number | null>(null);

  return (
    <div>
      <p className="mb-3">{question.prompt}</p>
      <div className="flex flex-col gap-2">
        {question.options.map((opt, i) => (
          <button
            key={i}
            className={`rounded border px-3 py-2 text-left text-sm ${
              selected === i
                ? 'border-[var(--color-accent)] bg-[var(--color-accent-dim)]'
                : 'border-[var(--color-border)] hover:bg-[var(--color-surface-hover)]'
            }`}
            onClick={() => setSelected(i)}
          >
            {opt}
          </button>
        ))}
      </div>
      <button className="btn btn-primary mt-3" disabled={selected === null} onClick={() => onSubmit(selected!)}>
        Submit
      </button>
    </div>
  );
}
