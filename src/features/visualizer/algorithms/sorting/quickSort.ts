import { msg, type AlgorithmDef, type AlgorithmStep } from '../../core/types';
import { ArrayRenderer, type ArrayState } from './ArrayRenderer';

const pseudocode = [
  'quicksort(a, left, right):',
  '  if left < right:',
  '    p = partition(a, left, right)',
  '    quicksort(a, left, p)',
  '    quicksort(a, p+1, right)',
  'partition(a, left, right):',
  '  pivot = a[left]',
  '  scan from both ends, swap out-of-place pairs',
];

function generateSteps(input: number[]): AlgorithmStep<ArrayState>[] {
  const a = [...input];
  const steps: AlgorithmStep<ArrayState>[] = [
    { state: { values: [...a] }, description: msg('viz.d.initialArray'), highlightLine: 0 },
  ];

  function partition(left: number, right: number): number {
    const pivot = a[left];
    let p = left - 1;
    let q = right + 1;
    steps.push({
      state: { values: [...a], activeRange: [left, right], pivotIndex: left },
      description: msg('viz.quick.partition', { left, right, pivot }),
      highlightLine: 6,
    });
    while (p < q) {
      do {
        p++;
      } while (a[p] < pivot);
      do {
        q--;
      } while (a[q] > pivot);
      if (p < q) {
        steps.push({
          state: { values: [...a], activeRange: [left, right], comparing: [p, q] },
          description: msg('viz.quick.wrongSide', { p, ap: a[p], q, aq: a[q] }),
          highlightLine: 7,
        });
        [a[p], a[q]] = [a[q], a[p]];
        steps.push({
          state: { values: [...a], activeRange: [left, right], swapping: [p, q] },
          description: msg('viz.quick.swapped', { p, q }),
          highlightLine: 7,
        });
      }
    }
    return q;
  }

  function quicksort(left: number, right: number) {
    if (left >= right) return;
    const p = partition(left, right);
    quicksort(left, p);
    quicksort(p + 1, right);
  }

  quicksort(0, a.length - 1);
  steps.push({ state: { values: [...a], sortedFrom: 0 }, description: msg('viz.d.arraySorted'), highlightLine: 0 });
  return steps;
}

export const quickSort: AlgorithmDef<number[], ArrayState> = {
  id: 'quicksort',
  title: 'Quicksort',
  topicId: 'sorting-merge-quick',
  family: 'Sorting',
  pseudocode,
  defaultInput: [4, 3, 2, 5, 1],
  generateSteps,
  Renderer: ArrayRenderer,
  extractResult: (state) => state.values,
};
