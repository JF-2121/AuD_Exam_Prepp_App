import { mcFormat, mcPoints } from '../../lib/types';
import type { MultipleChoiceQuestion } from '../../lib/types';

/**
 * The 2-of-4 badge is deliberately the loud one: 36 of the MC section's 42 points come from
 * that format, so it should read as the main event at a glance, not as a peer of 1-of-4.
 */
export function McFormatBadge({ question }: { question: MultipleChoiceQuestion }) {
  const isDouble = mcFormat(question) === 'double';
  return (
    <span
      className={`badge ${
        isDouble
          ? 'bg-[var(--color-accent-fill)] text-[var(--color-on-accent-fill)]'
          : 'badge-neutral'
      }`}
      title={isDouble ? 'Exactly 2 of 4 correct · 2 points · all or nothing' : 'Exactly 1 of 4 correct · 1 point'}
    >
      {isDouble ? '2 of 4' : '1 of 4'} · {mcPoints(question)} P
    </span>
  );
}
