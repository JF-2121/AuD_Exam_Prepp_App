import { msg, type AlgorithmDef, type AlgorithmStep } from '../../core/types';
import { TreeRenderer, type TreeNode, type TreeState } from './TreeRenderer';
import { MAX_LIST, integer, numberList, shape } from '../../core/inputSchema';

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
    { state: buildState(arr, n), description: msg('viz.heap.startArray', { values: arr.join(', ') }), highlightLine: 0 },
  ];

  function heapify(size: number, i: number) {
    let largest = i;
    const l = 2 * i + 1;
    const r = 2 * i + 2;
    if (l < size && arr[l] > arr[largest]) largest = l;
    if (r < size && arr[r] > arr[largest]) largest = r;
    steps.push({
      state: buildState(arr, size, i),
      description: msg('viz.heap.heapify', { i, vi: arr[i], largest, vl: arr[largest] }),
      highlightLine: 9,
    });
    if (largest !== i) {
      [arr[i], arr[largest]] = [arr[largest], arr[i]];
      steps.push({
        state: buildState(arr, size, largest),
        description: msg('viz.heap.siftDown', { i, largest, vl: arr[largest], vi: arr[i] }),
        highlightLine: 12,
      });
      heapify(size, largest);
    }
  }

  // buildHeap: bottom-up, only the first half (non-leaves) needs a heapify call.
  for (let i = Math.floor((n - 1) / 2); i >= 0; i--) {
    heapify(n, i);
  }
  steps.push({ state: buildState(arr, n), description: msg('viz.heap.built', { values: arr.join(', ') }), highlightLine: 0 });

  let size = n;
  for (let k = 0; k < extractCount && size > 0; k++) {
    const max = arr[0];
    steps.push({ state: buildState(arr, size, 0, [...extracted]), description: msg('viz.heap.extractMax', { max }), highlightLine: 4 });
    arr[0] = arr[size - 1];
    size -= 1;
    extracted.push(max);
    steps.push({
      state: buildState(arr, size, 0, [...extracted]),
      description: msg('viz.heap.moveLast', { value: arr[0], size, max }),
      highlightLine: 5,
    });
    if (size > 0) heapify(size, 0);
    steps.push({ state: buildState(arr, size, undefined, [...extracted]), description: msg('viz.heap.restored', { size, extracted: extracted.join(', ') }), highlightLine: 0 });
  }

  steps.push({ state: buildState(arr, size, undefined, [...extracted]), description: msg('viz.heap.doneExtract', { extracted: extracted.join(', ') }), highlightLine: 0 });
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
  validateInput: shape({ initial: numberList, extractCount: integer(0, MAX_LIST) }),
  inputHint: 'viz.hint.heapExtract',
  extractResult: (state) => state.extractedOrder ?? [],
};
