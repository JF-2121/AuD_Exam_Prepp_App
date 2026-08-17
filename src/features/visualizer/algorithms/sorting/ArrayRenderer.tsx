import type { AlgorithmStep } from '../../core/types';

export interface ArrayState {
  values: number[];
  comparing?: [number, number];
  swapping?: [number, number];
  sortedFrom?: number;
  /** Highlights the subarray [start, end] currently being divided/merged/partitioned (inclusive). */
  activeRange?: [number, number];
  pivotIndex?: number;
}

export function ArrayRenderer({ step }: { step: AlgorithmStep<ArrayState> }) {
  const { values, comparing, swapping, sortedFrom, activeRange, pivotIndex } = step.state;
  const max = Math.max(...values, 1);

  return (
    <div className="flex h-56 items-end justify-center gap-2">
      {values.map((v, i) => {
        const isComparing = comparing && (comparing[0] === i || comparing[1] === i);
        const isSwapping = swapping && (swapping[0] === i || swapping[1] === i);
        const isSorted = sortedFrom !== undefined && i >= sortedFrom;
        const isPivot = pivotIndex === i;
        const inActiveRange = activeRange && i >= activeRange[0] && i <= activeRange[1];
        let color = 'bg-[var(--color-accent)]';
        if (isSorted) color = 'bg-[var(--color-good)]';
        else if (isSwapping) color = 'bg-[var(--color-bad)]';
        else if (isPivot) color = 'bg-[var(--color-warn)]';
        else if (isComparing) color = 'bg-[var(--color-warn)]';
        else if (!inActiveRange && activeRange) color = 'bg-[var(--color-border)]';
        return (
          <div key={i} className="flex flex-col items-center gap-1">
            <div
              className={`w-8 rounded-t ${color} ${inActiveRange ? 'ring-2 ring-[var(--color-text-dim)]' : ''}`}
              style={{ height: `${(v / max) * 180 + 10}px` }}
            />
            <span className="text-xs text-[var(--color-text-dim)]">{v}</span>
          </div>
        );
      })}
    </div>
  );
}
