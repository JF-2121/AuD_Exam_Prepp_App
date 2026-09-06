import { mcFormat, mcPoints } from '../../lib/types';
import type { MultipleChoiceQuestion } from '../../lib/types';
import { useT } from '../../lib/i18n/locale';

/**
 * The 2-of-4 badge is deliberately the loud one: 36 of the MC section's 42 points come from
 * that format, so it should read as the main event at a glance, not as a peer of 1-of-4.
 */
export function McFormatBadge({ question }: { question: MultipleChoiceQuestion }) {
  const t = useT();
  const isDouble = mcFormat(question) === 'double';
  return (
    <span
      className={`badge ${
        isDouble
          ? 'bg-[var(--color-accent-fill)] text-[var(--color-on-accent-fill)]'
          : 'badge-neutral'
      }`}
      title={t(isDouble ? 'mc.badgeDoubleTitle' : 'mc.badgeSingleTitle')}
    >
      {t(isDouble ? 'mc.badgeDouble' : 'mc.badgeSingle')} · {mcPoints(question)} {t('common.pointsShort')}
    </span>
  );
}
