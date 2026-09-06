import { msg, type AlgorithmDef, type AlgorithmStep } from '../../core/types';
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
    { state: { values: [...a] }, description: msg('viz.d.initialArray'), highlightLine: 0 },
  ];

  for (let i = 0; i < n; i++) {
    for (let j = 0; j < n - i - 1; j++) {
      steps.push({
        state: { values: [...a], comparing: [j, j + 1], sortedFrom: n - i },
        description: msg('viz.bubble.compare', { j, aj: a[j], j1: j + 1, aj1: a[j + 1] }),
        highlightLine: 2,
      });
      if (a[j] > a[j + 1]) {
        [a[j], a[j + 1]] = [a[j + 1], a[j]];
        steps.push({
          state: { values: [...a], swapping: [j, j + 1], sortedFrom: n - i },
          description: msg('viz.bubble.swap', { j, j1: j + 1 }),
          highlightLine: 3,
        });
      }
    }
  }
  steps.push({ state: { values: [...a], sortedFrom: 0 }, description: msg('viz.d.arraySorted'), highlightLine: 0 });
  return steps;
}

export const bubbleSort: AlgorithmDef<number[], ArrayState> = {
  id: 'bubble-sort',
  title: 'Bubble Sort',
  topicId: 'sorting-bubble',
  family: 'Sorting',
  pseudocode,
  defaultInput: [5, 3, 8, 1, 9, 4],
  generateSteps,
  Renderer: ArrayRenderer,
  extractResult: (state) => state.values,
};
