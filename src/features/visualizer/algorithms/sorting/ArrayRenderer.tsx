import type { AlgorithmStep } from '../../core/types';

export interface ArrayState {
  values: number[];
  comparing?: [number, number];
  swapping?: [number, number];
  sortedFrom?: number;
}

export function ArrayRenderer({ step }: { step: AlgorithmStep<ArrayState> }) {
  const { values, comparing, swapping, sortedFrom } = step.state;
  const max = Math.max(...values, 1);

  return (
    <div className="flex h-56 items-end justify-center gap-2">
      {values.map((v, i) => {
        const isComparing = comparing && (comparing[0] === i || comparing[1] === i);
        const isSwapping = swapping && (swapping[0] === i || swapping[1] === i);
        const isSorted = sortedFrom !== undefined && i >= sortedFrom;
        let color = 'bg-[var(--color-accent)]';
        if (isSorted) color = 'bg-[var(--color-good)]';
        else if (isSwapping) color = 'bg-[var(--color-bad)]';
        else if (isComparing) color = 'bg-[var(--color-warn)]';
        return (
          <div key={i} className="flex flex-col items-center gap-1">
            <div
              className={`w-8 rounded-t ${color}`}
              style={{ height: `${(v / max) * 180 + 10}px` }}
            />
            <span className="text-xs text-[var(--color-text-dim)]">{v}</span>
          </div>
        );
      })}
    </div>
  );
}
