import type { Difficulty } from '../lib/types';

const CLASS_BY_DIFFICULTY: Record<Difficulty, string> = {
  easy: 'badge badge-easy',
  medium: 'badge badge-medium',
  hard: 'badge badge-hard',
};

export function DifficultyBadge({ difficulty }: { difficulty: Difficulty }) {
  return <span className={CLASS_BY_DIFFICULTY[difficulty]}>{difficulty}</span>;
}
