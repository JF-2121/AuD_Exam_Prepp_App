import type { AlgorithmStep } from '../../core/types';

export interface StringMatchState {
  text: (string | number)[];
  pattern: (string | number)[];
  /** Shift currently being tested/displayed; undefined before the first shift starts. */
  sft?: number;
  /** How many leading pattern characters have been confirmed matching at this shift (colored green). */
  matchedUpTo?: number;
  /** Pattern-local index where a mismatch just occurred (colored red), if any. */
  mismatchIndex?: number;
  /** Valid shifts found so far. */
  matches: number[];
  /** Extra label:value rows shown in the info panel (e.g. Rabin-Karp's p, t_sft, mod q). */
  info?: { label: string; value: string; ok?: boolean }[];
}

const CELL = 34;
const ROW_GAP = 46;

export function StringMatchRenderer({ step }: { step: AlgorithmStep<StringMatchState> }) {
  const { text, pattern, sft, matchedUpTo, mismatchIndex, matches, info } = step.state;
  const m = pattern.length;
  const width = Math.max(text.length * CELL + 20, 240);
  const svgHeight = 2 * ROW_GAP + CELL + 10;
  const patternX = (sft ?? 0) * CELL;

  return (
    <div>
      <svg width="100%" height={svgHeight} viewBox={`0 0 ${width} ${svgHeight}`} className="mx-auto block">
        {text.map((ch, i) => {
          const inWindow = sft !== undefined && i >= sft && i < sft + m;
          return (
            <g key={`t-${i}`}>
              <rect
                x={i * CELL + 10}
                y={10}
                width={CELL - 2}
                height={CELL - 2}
                rx={4}
                fill={inWindow ? 'var(--color-accent-dim)' : 'var(--color-surface)'}
                stroke="var(--color-border)"
                strokeWidth={1.5}
              />
              <text x={i * CELL + 10 + CELL / 2 - 1} y={10 + CELL / 2 + 5} textAnchor="middle" fontSize={13} fontWeight={700} fill="var(--color-text-h)">
                {ch}
              </text>
              <text x={i * CELL + 10 + CELL / 2 - 1} y={10 + CELL + 12} textAnchor="middle" fontSize={9} fill="var(--color-text-dim)">
                {i}
              </text>
            </g>
          );
        })}
        {sft !== undefined &&
          pattern.map((ch, j) => {
            const isMismatch = mismatchIndex === j;
            const isMatched = matchedUpTo !== undefined && j < matchedUpTo && !isMismatch;
            let fill = 'var(--color-surface)';
            let textColor = 'var(--color-text-h)';
            if (isMismatch) {
              fill = 'var(--color-bad)';
              textColor = 'var(--color-ink)';
            } else if (isMatched) {
              fill = 'var(--color-good)';
              textColor = 'var(--color-ink)';
            }
            return (
              <g key={`p-${j}`}>
                <rect
                  x={patternX + j * CELL + 10}
                  y={ROW_GAP + 10}
                  width={CELL - 2}
                  height={CELL - 2}
                  rx={4}
                  fill={fill}
                  stroke="var(--color-accent)"
                  strokeWidth={1.5}
                />
                <text x={patternX + j * CELL + 10 + CELL / 2 - 1} y={ROW_GAP + 10 + CELL / 2 + 5} textAnchor="middle" fontSize={13} fontWeight={700} fill={textColor}>
                  {ch}
                </text>
              </g>
            );
          })}
      </svg>
      <div className="mt-2 flex flex-wrap items-start justify-between gap-3 text-xs">
        <p className="text-[var(--color-text-dim)]">
          Shift <span className="font-semibold text-[var(--color-text-h)]">{sft ?? '–'}</span> · Valid shifts found:{' '}
          <span className="font-semibold text-[var(--color-good)]">{matches.length ? matches.join(', ') : '(none yet)'}</span>
        </p>
        {info && info.length > 0 && (
          <div className="rounded-md border border-[var(--color-border)] p-2">
            {info.map((row, i) => (
              <div key={i} className="flex items-center gap-2">
                <span className="text-[var(--color-text-dim)]">{row.label}</span>
                <span
                  className={`font-mono font-semibold ${
                    row.ok === true ? 'text-[var(--color-good)]' : row.ok === false ? 'text-[var(--color-bad)]' : 'text-[var(--color-text-h)]'
                  }`}
                >
                  {row.value}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
