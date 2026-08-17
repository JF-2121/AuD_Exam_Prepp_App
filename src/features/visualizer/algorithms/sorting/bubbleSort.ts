import type { AlgorithmDef, AlgorithmStep } from '../../core/types';
import { ArrayRenderer, type ArrayState } from './ArrayRenderer';

const pseudocode = [
  'for i in 0..n-1:',
  '  for j in 0..n-i-2:',
  '    if a[j] > a[j+1]:',
  '      swap(a[j], a[j+1])',
];

function generateSteps(input: number[]): AlgorithmStep<ArrayState>[] {
  const a = [...input];
  const n = a.length;
  const steps: AlgorithmStep<ArrayState>[] = [
    { state: { values: [...a] }, description: 'Initial array.', highlightLine: 0 },
  ];

  for (let i = 0; i < n; i++) {
    for (let j = 0; j < n - i - 1; j++) {
      steps.push({
        state: { values: [...a], comparing: [j, j + 1], sortedFrom: n - i },
        description: `Compare a[${j}]=${a[j]} and a[${j + 1}]=${a[j + 1]}.`,
        highlightLine: 2,
      });
      if (a[j] > a[j + 1]) {
        [a[j], a[j + 1]] = [a[j + 1], a[j]];
        steps.push({
          state: { values: [...a], swapping: [j, j + 1], sortedFrom: n - i },
          description: `Swap: a[${j}] and a[${j + 1}] were out of order.`,
          highlightLine: 3,
        });
      }
    }
  }
  steps.push({ state: { values: [...a], sortedFrom: 0 }, description: 'Array is sorted.', highlightLine: 0 });
  return steps;
}

export const bubbleSort: AlgorithmDef<number[], ArrayState> = {
  id: 'bubble-sort',
  title: 'Bubble Sort',
  topicId: 'sorting-bubble',
  pseudocode,
  defaultInput: [5, 3, 8, 1, 9, 4],
  generateSteps,
  Renderer: ArrayRenderer,
  extractResult: (state) => state.values,
};
