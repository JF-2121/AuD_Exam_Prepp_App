import { Check, X } from 'lucide-react';
import type { MultipleChoiceQuestion } from '../../lib/types';
import { useT } from '../../lib/i18n/locale';
import { OPTION_LETTERS } from './mcBank';

interface McOptionsProps {
  question: MultipleChoiceQuestion;
  selected: number[];
  onToggle?: (index: number) => void;
  /** When true the correct answers are shown and the list stops responding to clicks. */
  revealed?: boolean;
}

export function McOptions({ question, selected, onToggle, revealed = false }: McOptionsProps) {
  const required = question.correctIndexes.length;
  const multi = required > 1;

  return (
    <ul className="flex flex-col gap-2">
      {question.options.map((option, i) => {
        const isSelected = selected.includes(i);
        const isCorrect = question.correctIndexes.includes(i);
        // A locked-out option is one the "pick exactly N" cap has already ruled out.
        const capped = multi && !isSelected && selected.length >= required;

        let tone = 'border-[var(--color-border)]';
        if (revealed && isCorrect) tone = 'border-[var(--color-good)] bg-[var(--color-good-dim)]';
        else if (revealed && isSelected) tone = 'border-[var(--color-bad)] bg-[var(--color-bad-dim)]';
        else if (!revealed && isSelected) tone = 'border-[var(--color-accent)] bg-[var(--color-accent-dim)]';

        return (
          <li key={i}>
            <button
              type="button"
              disabled={revealed || (capped && !isSelected)}
              aria-pressed={isSelected}
              onClick={() => onToggle?.(i)}
              className={`flex w-full min-h-11 items-start gap-3 rounded-md border px-3 py-2.5 text-left text-sm transition-colors ${tone} ${
                revealed
                  ? 'cursor-default'
                  : capped
                    ? 'cursor-not-allowed opacity-45'
                    : 'hover:bg-[var(--color-surface-hover)]'
              }`}
            >
              <span
                className={`mt-px flex h-5 w-5 shrink-0 items-center justify-center border text-[10px] font-semibold ${
                  multi ? 'rounded' : 'rounded-full'
                } ${
                  isSelected
                    ? 'border-transparent bg-[var(--color-accent-fill)] text-[var(--color-on-accent-fill)]'
                    : 'border-[var(--color-border-strong)] text-[var(--color-text-dim)]'
                }`}
              >
                {isSelected ? <Check size={12} strokeWidth={3} /> : OPTION_LETTERS[i]}
              </span>
              <span className="min-w-0 flex-1">{option}</span>
              {revealed && (
                <span className="mt-0.5 shrink-0">
                  {isCorrect ? (
                    <Check size={15} className="text-[var(--color-good)]" strokeWidth={3} />
                  ) : isSelected ? (
                    <X size={15} className="text-[var(--color-bad)]" strokeWidth={3} />
                  ) : null}
                </span>
              )}
            </button>
          </li>
        );
      })}
    </ul>
  );
}

/** The "n/N chosen" line under a 2-of-4 prompt — the format's defining constraint, stated up front. */
export function McSelectionHint({ question, selected }: { question: MultipleChoiceQuestion; selected: number[] }) {
  const t = useT();
  const required = question.correctIndexes.length;
  if (required < 2) return null;
  const complete = selected.length === required;
  return (
    <p className={`mb-3 text-xs ${complete ? 'text-[var(--color-accent)]' : 'text-[var(--color-text-dim)]'}`}>
      {t('mc.selectHint', { count: required, chosen: selected.length })}
    </p>
  );
}
