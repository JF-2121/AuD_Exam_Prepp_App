import type { ReactNode } from 'react';
import type { AlgorithmStep } from '../../core/types';

export interface RadixState {
  /** The array as it stands at the start of the current pass — the lecture's "i = k:" row. */
  array: string[];
  /** The array being rebuilt while draining the buckets; null = slot not written yet. */
  output: (string | null)[];
  /** buckets[k] in arrival order (index 0 = front of the FIFO queue = drained first). */
  buckets: string[][];
  radix: number;
  digitCount: number;
  /** Which digit position this pass sorts on: 0 = least significant. */
  digitPos: number;
  phase: 'distribute' | 'collect' | 'done';
  /** Index in `array` currently being placed into a bucket. */
  activeIndex?: number;
  /** Bucket being appended to (distribute) or drained (collect). */
  activeBucket?: number;
}

/**
 * Renders a numeral with the digit this pass sorts on picked out. When the numeral is too short
 * for that position the algorithm reads an implicit 0 (the sheet's zero-padding rule), so a
 * dimmed padding zero is drawn rather than nothing — otherwise the bucket choice looks arbitrary.
 */
function Numeral({ value, digitPos, radix }: { value: string; digitPos: number; radix: number }) {
  const idx = value.length - 1 - digitPos;
  return (
    <span className="font-mono text-[13px] leading-none text-[var(--color-text-h)]">
      {idx < 0 && <span className="text-[var(--color-accent)] opacity-50">0</span>}
      {value.split('').map((ch, i) => (
        <span
          key={i}
          className={i === idx ? 'text-[var(--color-accent)] underline underline-offset-2' : ''}
        >
          {ch}
        </span>
      ))}
      {radix !== 10 && <sub className="text-[9px] text-[var(--color-text-dim)]">{radix}</sub>}
    </span>
  );
}

type Tone = 'plain' | 'active' | 'collect' | 'done' | 'empty';

const TONES: Record<Tone, string> = {
  plain: 'border-[var(--color-border-strong)] bg-[var(--color-surface)]',
  active: 'border-[var(--color-accent)] bg-[var(--color-accent-dim)]',
  collect: 'border-[var(--color-warn)] bg-[var(--color-warn-dim)]',
  done: 'border-[var(--color-good)] bg-[var(--color-good-dim)]',
  empty: 'border-dashed border-[var(--color-border)] bg-transparent',
};

function Cell({ children, tone = 'plain' }: { children?: ReactNode; tone?: Tone }) {
  return (
    <div className={`flex h-8 min-w-11 items-center justify-center rounded border px-1.5 ${TONES[tone]}`}>
      {children}
    </div>
  );
}

function Row({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="flex items-center gap-2">
      <span className="w-12 shrink-0 text-right font-mono text-[11px] text-[var(--color-accent)]">{label}</span>
      <div className="flex gap-1.5">{children}</div>
    </div>
  );
}

export function BucketRenderer({ step }: { step: AlgorithmStep<RadixState> }) {
  const { array, output, buckets, radix, digitCount, digitPos, phase, activeIndex, activeBucket } =
    step.state;
  const distributing = phase === 'distribute';
  const collecting = phase === 'collect';
  const done = phase === 'done';
  // Every bucket column is drawn to the same height, like the lecture's Abbildung 1 — a bucket
  // filling up then reads as a change against its neighbours instead of reflowing the whole row.
  const columnHeight = Math.max(2, ...buckets.map((b) => b.length));

  return (
    <div className="flex flex-col gap-4 pb-2">
      <p className="flex flex-wrap items-baseline gap-x-3 gap-y-1 text-xs text-[var(--color-text-dim)]">
        {done ? (
          <span className="font-semibold text-[var(--color-good)]">Sorted — no comparison ever made</span>
        ) : (
          <>
            <span className="font-semibold text-[var(--color-accent)]">i = {digitPos}</span>
            <span>
              of {digitCount - 1} · sorting on digit position {digitPos} · base {radix}, so {radix} buckets
            </span>
          </>
        )}
      </p>

      <Row label={done ? 'sorted' : `i = ${digitPos}`}>
        {array.map((v, i) => (
          <Cell key={i} tone={done ? 'done' : distributing && activeIndex === i ? 'active' : 'plain'}>
            <Numeral value={v} digitPos={digitPos} radix={radix} />
          </Cell>
        ))}
      </Row>

      {!done && (
        <div className="flex gap-1.5 pl-14">
          {buckets.map((bucket, k) => {
            const isActive = activeBucket === k;
            return (
              <div key={k} className="flex flex-col items-center gap-1">
                {/* Drawn bottom-up in arrival order, mirroring the lecture figure: the front of
                    the FIFO queue sits at the bottom and is the first value drained back out. */}
                <div className="flex flex-col-reverse gap-0.5">
                  {Array.from({ length: columnHeight }, (_, slot) => {
                    const v = bucket[slot];
                    if (v === undefined) return <Cell key={slot} tone="empty" />;
                    let tone: Tone = 'plain';
                    if (isActive && collecting && slot === 0) tone = 'collect';
                    else if (isActive && distributing && slot === bucket.length - 1) tone = 'active';
                    return (
                      <Cell key={slot} tone={tone}>
                        <Numeral value={v} digitPos={digitPos} radix={radix} />
                      </Cell>
                    );
                  })}
                </div>
                <span
                  className={`text-[10px] ${isActive ? 'font-semibold text-[var(--color-accent)]' : 'text-[var(--color-text-dim)]'}`}
                >
                  {k}
                </span>
              </div>
            );
          })}
        </div>
      )}

      {collecting && (
        <Row label="collect">
          {output.map((v, i) => (
            <Cell key={i} tone={v === null ? 'empty' : 'done'}>
              {v !== null && <Numeral value={v} digitPos={digitPos} radix={radix} />}
            </Cell>
          ))}
        </Row>
      )}
    </div>
  );
}
