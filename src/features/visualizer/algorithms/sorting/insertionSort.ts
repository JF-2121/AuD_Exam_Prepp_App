import type { AlgorithmDef, AlgorithmStep } from '../../core/types';
import { ArrayRenderer, type ArrayState } from './ArrayRenderer';

const pseudocode = [
  'for i in 1..n-1:',
  '  key = a[i]',
  '  j = i - 1',
  '  while j >= 0 and a[j] > key:',
  '    a[j+1] = a[j]',
  '    j = j - 1',
  '  a[j+1] = key',
];

function generateSteps(input: number[]): AlgorithmStep<ArrayState>[] {
  const a = [...input];
  const n = a.length;
  const steps: AlgorithmStep<ArrayState>[] = [
    { state: { values: [...a], sortedFrom: n - Math.min(1, n) }, description: 'Initial array. A[0] counts as sorted.', highlightLine: 0 },
  ];

  for (let i = 1; i < n; i++) {
    const key = a[i];
    let j = i - 1;
    steps.push({
      state: { values: [...a], comparing: [i, i], sortedFrom: i },
      description: `Take key = a[${i}] = ${key}.`,
      highlightLine: 1,
    });
    while (j >= 0 && a[j] > key) {
      steps.push({
        state: { values: [...a], comparing: [j, i], sortedFrom: i },
        description: `a[${j}]=${a[j]} > key=${key}: shift right.`,
        highlightLine: 3,
      });
      a[j + 1] = a[j];
      j = j - 1;
      steps.push({
        state: { values: [...a], swapping: [j + 1, j + 2 <= n - 1 ? j + 2 : j + 1], sortedFrom: i },
        description: `Shifted. Continue looking left.`,
        highlightLine: 4,
      });
    }
    a[j + 1] = key;
    steps.push({
      state: { values: [...a], sortedFrom: i + 1 },
      description: `Insert key=${key} at position ${j + 1}.`,
      highlightLine: 6,
    });
  }
  steps.push({ state: { values: [...a], sortedFrom: 0 }, description: 'Array is sorted.', highlightLine: 0 });
  return steps;
}

export const insertionSort: AlgorithmDef<number[], ArrayState> = {
  id: 'insertion-sort',
  title: 'Insertion Sort',
  topicId: 'sorting-insertion',
  family: 'Sorting',
  pseudocode,
  defaultInput: [5, 3, 2, 4, 1],
  generateSteps,
  Renderer: ArrayRenderer,
  extractResult: (state) => state.values,
};
