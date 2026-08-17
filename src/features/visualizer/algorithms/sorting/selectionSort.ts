import type { AlgorithmDef, AlgorithmStep } from '../../core/types';
import { ArrayRenderer, type ArrayState } from './ArrayRenderer';

const pseudocode = [
  'for i in 0..n-2:',
  '  min = i',
  '  for j in i+1..n-1:',
  '    if a[j] < a[min]:',
  '      min = j',
  '  swap(a[i], a[min])',
];

function generateSteps(input: number[]): AlgorithmStep<ArrayState>[] {
  const a = [...input];
  const n = a.length;
  const steps: AlgorithmStep<ArrayState>[] = [
    { state: { values: [...a] }, description: 'Initial array.', highlightLine: 0 },
  ];

  for (let i = 0; i < n - 1; i++) {
    let min = i;
    steps.push({
      state: { values: [...a], comparing: [i, i], sortedFrom: i },
      description: `Assume a[${i}]=${a[i]} is the minimum of the unsorted region.`,
      highlightLine: 1,
    });
    for (let j = i + 1; j < n; j++) {
      steps.push({
        state: { values: [...a], comparing: [min, j], sortedFrom: i },
        description: `Compare a[${j}]=${a[j]} with current min a[${min}]=${a[min]}.`,
        highlightLine: 3,
      });
      if (a[j] < a[min]) {
        min = j;
        steps.push({
          state: { values: [...a], comparing: [min, min], sortedFrom: i },
          description: `New minimum found: a[${min}]=${a[min]}.`,
          highlightLine: 4,
        });
      }
    }
    [a[i], a[min]] = [a[min], a[i]];
    steps.push({
      state: { values: [...a], swapping: [i, min], sortedFrom: i + 1 },
      description: `Swap a[${i}] and a[${min}]: minimum placed at position ${i}.`,
      highlightLine: 5,
    });
  }
  steps.push({ state: { values: [...a], sortedFrom: 0 }, description: 'Array is sorted.', highlightLine: 0 });
  return steps;
}

export const selectionSort: AlgorithmDef<number[], ArrayState> = {
  id: 'selection-sort',
  title: 'Selection Sort',
  topicId: 'sorting-selection',
  pseudocode,
  defaultInput: [5, 3, 2, 4, 1],
  generateSteps,
  Renderer: ArrayRenderer,
  extractResult: (state) => state.values,
};
