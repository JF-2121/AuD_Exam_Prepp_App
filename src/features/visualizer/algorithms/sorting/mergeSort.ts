import type { AlgorithmDef, AlgorithmStep } from '../../core/types';
import { ArrayRenderer, type ArrayState } from './ArrayRenderer';

const pseudocode = [
  'mergeSort(a, left, right):',
  '  if left < right:',
  '    mid = floor((left+right)/2)',
  '    mergeSort(a, left, mid)',
  '    mergeSort(a, mid+1, right)',
  '    merge(a, left, mid, right)',
  'merge(a, left, mid, right):',
  '  merge sorted halves via temp array',
];

function generateSteps(input: number[]): AlgorithmStep<ArrayState>[] {
  const a = [...input];
  const steps: AlgorithmStep<ArrayState>[] = [
    { state: { values: [...a] }, description: 'Initial array.', highlightLine: 0 },
  ];

  function mergeSort(left: number, right: number) {
    if (left >= right) return;
    const mid = Math.floor((left + right) / 2);
    steps.push({
      state: { values: [...a], activeRange: [left, right] },
      description: `Divide a[${left}..${right}] at mid=${mid}.`,
      highlightLine: 2,
    });
    mergeSort(left, mid);
    mergeSort(mid + 1, right);

    const temp: number[] = [];
    let p = left;
    let q = mid + 1;
    while (temp.length < right - left + 1) {
      steps.push({
        state: { values: [...a], activeRange: [left, right], comparing: [p <= mid ? p : mid, q <= right ? q : right] },
        description: `Merging a[${left}..${mid}] and a[${mid + 1}..${right}]: compare candidates.`,
        highlightLine: 5,
      });
      if (q > right || (p <= mid && a[p] <= a[q])) {
        temp.push(a[p]);
        p++;
      } else {
        temp.push(a[q]);
        q++;
      }
    }
    for (let i = 0; i < temp.length; i++) a[left + i] = temp[i];
    steps.push({
      state: { values: [...a], activeRange: [left, right] },
      description: `a[${left}..${right}] merged and sorted.`,
      highlightLine: 5,
    });
  }

  mergeSort(0, a.length - 1);
  steps.push({ state: { values: [...a], sortedFrom: 0 }, description: 'Array is sorted.', highlightLine: 0 });
  return steps;
}

export const mergeSort: AlgorithmDef<number[], ArrayState> = {
  id: 'merge-sort',
  title: 'Merge Sort',
  topicId: 'sorting-merge-quick',
  family: 'Sorting',
  pseudocode,
  defaultInput: [5, 3, 8, 1, 9, 4],
  generateSteps,
  Renderer: ArrayRenderer,
  extractResult: (state) => state.values,
};
