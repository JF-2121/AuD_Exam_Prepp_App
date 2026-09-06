import type { Difficulty } from '../lib/types';
import { useT } from '../lib/i18n/locale';
import type { MessageKey } from '../lib/i18n/messages';

const CLASS_BY_DIFFICULTY: Record<Difficulty, string> = {
  easy: 'badge badge-easy',
  medium: 'badge badge-medium',
  hard: 'badge badge-hard',
};

const KEY_BY_DIFFICULTY: Record<Difficulty, MessageKey> = {
  easy: 'common.easy',
  medium: 'common.medium',
  hard: 'common.hard',
};

export function DifficultyBadge({ difficulty }: { difficulty: Difficulty }) {
  const t = useT();
  return <span className={CLASS_BY_DIFFICULTY[difficulty]}>{t(KEY_BY_DIFFICULTY[difficulty])}</span>;
}
