import { useState } from 'react';
import type { ShortAnswerQuestion } from '../../lib/types';

export function ShortAnswer({
  question,
  onSubmit,
}: {
  question: ShortAnswerQuestion;
  onSubmit: (answer: string) => void;
}) {
  const [value, setValue] = useState('');

  return (
    <div>
      <p className="mb-3">{question.prompt}</p>
      <input
        className="w-full rounded border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-2 text-sm"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={(e) => e.key === 'Enter' && value.trim() && onSubmit(value)}
        placeholder="Type your answer…"
      />
      <button className="btn btn-primary mt-3" disabled={!value.trim()} onClick={() => onSubmit(value)}>
        Submit
      </button>
    </div>
  );
}
