import type { AlgorithmDef, AlgorithmStep } from '../../core/types';
import { TreeRenderer, type TreeNode, type TreeState } from './TreeRenderer';

const pseudocode = [
  'buildHeap(A):                          // bottom-up, first half only',
  '  for i = floor((n-1)/2) downto 0:',
  '    heapify(A, i, n)',
  'extractMax(H):',
  '  max = H[0]',
  '  H[0] = H[last]; removeLast(H)         // move last element to the root',
  '  heapify(H, 0, H.size)                 // sift-down',
  '  return max',
  'heapify(A, i, size):                    // sift-down: swap with the LARGER child',
  '  largest = i; l = 2i+1; r = 2i+2',
  '  if l < size and A[l] > A[largest]: largest = l',
  '  if r < size and A[r] > A[largest]: largest = r',
  '  if largest != i: swap(A[i], A[largest]); heapify(A, largest, size)',
];

export interface HeapExtractInput {
  initial: number[];
  extractCount: number;
}

function buildState(arr: number[], size: number, highlightIdx?: number, extractedOrder?: number[]): TreeState {
  const nodes: Record<string, TreeNode> = {};
  arr.slice(0, size).forEach((v, i) => {
    const id = String(i);
    nodes[id] = {
      id,
      value: v,
      left: 2 * i + 1 < size ? String(2 * i + 1) : null,
      right: 2 * i + 2 < size ? String(2 * i + 2) : null,
      label: `[${i}]`,
    };
  });
  return {
    nodes,
    rootId: size ? '0' : null,
    highlightId: highlightIdx !== undefined ? String(highlightIdx) : undefined,
    extractedOrder,
  };
}

function generateSteps({ initial, extractCount }: HeapExtractInput): AlgorithmStep<TreeState>[] {
  const arr = [...initial];
  const n = arr.length;
  const extracted: number[] = [];
  const steps: AlgorithmStep<TreeState>[] = [
    { state: buildState(arr, n), description: `Starting array [${arr.join(', ')}], not yet heap-ordered.`, highlightLine: 0 },
  ];

  function heapify(size: number, i: number) {
    let largest = i;
    const l = 2 * i + 1;
    const r = 2 * i + 2;
    if (l < size && arr[l] > arr[largest]) largest = l;
    if (r < size && arr[r] > arr[largest]) largest = r;
    steps.push({
      state: buildState(arr, size, i),
      description: `heapify at index ${i} (${arr[i]}): compare with children — largest is index ${largest} (${arr[largest]}).`,
      highlightLine: 9,
    });
    if (largest !== i) {
      [arr[i], arr[largest]] = [arr[largest], arr[i]];
      steps.push({
        state: buildState(arr, size, largest),
        description: `Swap index ${i} and ${largest}: ${arr[largest]} moves up, ${arr[i]} sifts further down.`,
        highlightLine: 12,
      });
      heapify(size, largest);
    }
  }

  // buildHeap: bottom-up, only the first half (non-leaves) needs a heapify call.
  for (let i = Math.floor((n - 1) / 2); i >= 0; i--) {
    heapify(n, i);
  }
  steps.push({ state: buildState(arr, n), description: `Heap built: [${arr.join(', ')}] now satisfies the max-heap property everywhere.`, highlightLine: 0 });

  let size = n;
  for (let k = 0; k < extractCount && size > 0; k++) {
    const max = arr[0];
    steps.push({ state: buildState(arr, size, 0, [...extracted]), description: `Extract max: root is ${max}.`, highlightLine: 4 });
    arr[0] = arr[size - 1];
    size -= 1;
    extracted.push(max);
    steps.push({
      state: buildState(arr, size, 0, [...extracted]),
      description: `Move the last element (${arr[0]}) into the root, shrink the heap to size ${size}. ${max} is placed at the end of the sorted output.`,
      highlightLine: 5,
    });
    if (size > 0) heapify(size, 0);
    steps.push({ state: buildState(arr, size, undefined, [...extracted]), description: `Heap property restored for the remaining ${size} element(s). Extracted so far: [${extracted.join(', ')}].`, highlightLine: 0 });
  }

  steps.push({ state: buildState(arr, size, undefined, [...extracted]), description: `Done. Extracted in order (descending): [${extracted.join(', ')}].`, highlightLine: 0 });
  return steps;
}

export const heapDelete: AlgorithmDef<HeapExtractInput, TreeState> = {
  id: 'heap-delete',
  title: 'Binary Heap Extract-Max (Delete)',
  topicId: 'heaps',
  family: 'Trees',
  pseudocode,
  defaultInput: { initial: [7, 5, 2, 9, 4, 8], extractCount: 6 },
  generateSteps,
  Renderer: TreeRenderer,
  extractResult: (state) => state.extractedOrder ?? [],
};
