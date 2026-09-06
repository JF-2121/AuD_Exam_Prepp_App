import type { ReactNode } from 'react';
import { CheckCircle2, XCircle, AlertTriangle } from 'lucide-react';
import type { MultipleChoiceQuestion } from '../../lib/types';
import { DifficultyBadge } from '../../components/DifficultyBadge';
import { useT } from '../../lib/i18n/locale';
import { McFormatBadge } from './McFormatBadge';
import { McOptions, McSelectionHint } from './McOptions';
import { McPrompt } from './McPrompt';
import type { McGrade } from './mcBank';

interface McCardProps {
  question: MultipleChoiceQuestion;
  topicTitle?: string;
  selected: number[];
  onToggle?: (index: number) => void;
  revealed?: boolean;
  /** When present, the verdict banner + explanation are shown above the explanation text. */
  grade?: McGrade;
  /** Small label above the prompt, e.g. "Q7 of 24". */
  label?: ReactNode;
  actions?: ReactNode;
}

export function McCard({
  question,
  topicTitle,
  selected,
  onToggle,
  revealed = false,
  grade,
  label,
  actions,
}: McCardProps) {
  return (
    <div className="card p-5">
      <div className="mb-3 flex flex-wrap items-center gap-2">
        {label && <span className="text-xs font-semibold text-[var(--color-text-dim)]">{label}</span>}
        <McFormatBadge question={question} />
        {topicTitle && <span className="badge badge-neutral">{topicTitle}</span>}
        <DifficultyBadge difficulty={question.difficulty} />
      </div>

      <McPrompt text={question.prompt} className="mb-3 text-[var(--color-text)]" />
      <McSelectionHint question={question} selected={selected} />
      <McOptions question={question} selected={selected} onToggle={onToggle} revealed={revealed} />

      {grade && <McVerdict grade={grade} />}
      {revealed && (
        <div className="mt-3 border-t border-[var(--color-border)] pt-3">
          <p className="text-sm text-[var(--color-text-dim)]">{question.explanation}</p>
          {question.source && (
            <p className="mt-2 text-[11px] uppercase tracking-wide text-[var(--color-text-dim)] opacity-70">
              {question.source}
            </p>
          )}
        </div>
      )}
      {actions && <div className="mt-4 flex flex-wrap gap-2">{actions}</div>}
    </div>
  );
}

/**
 * The half-right case gets its own callout rather than being folded into "incorrect": on a 2-of-4
 * it is the single most expensive mistake in the exam (two points gone for one wrong mark), and
 * it is the one students most often assume is worth partial credit.
 */
export function McVerdict({ grade }: { grade: McGrade }) {
  const t = useT();

  if (grade.correct) {
    return (
      <p className="mt-3 flex items-center gap-1.5 text-sm font-semibold text-[var(--color-good)]">
        <CheckCircle2 size={15} />{' '}
        {t('mc.verdictCorrect', {
          points: grade.awarded,
          unit: t(grade.awarded === 1 ? 'common.point' : 'common.points'),
        })}
      </p>
    );
  }
  if (grade.halfRight) {
    return (
      <p className="mt-3 flex items-start gap-1.5 text-sm font-semibold text-[var(--color-warn)]">
        <AlertTriangle size={15} className="mt-0.5 shrink-0" />
        <span>{t('mc.verdictHalf', { possible: grade.possible })}</span>
      </p>
    );
  }
  return (
    <p className="mt-3 flex items-center gap-1.5 text-sm font-semibold text-[var(--color-bad)]">
      <XCircle size={15} />{' '}
      {t('mc.verdictWrong', {
        possible: grade.possible,
        unit: t(grade.possible === 1 ? 'common.point' : 'common.points'),
      })}
    </p>
  );
}
