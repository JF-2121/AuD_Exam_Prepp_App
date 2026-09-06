import { msg, type AlgorithmDef, type AlgorithmStep } from '../../core/types';
import { TreeRenderer, type TreeNode, type TreeState } from './TreeRenderer';

const pseudocode = [
  'insert(H, k):',
  '  append(H, k)              // place k at the last free slot',
  '  i = H.size - 1',
  '  while i > 0 and H[parent(i)] < H[i]:',
  '    swap(H[parent(i)], H[i])   // sift-up',
  '    i = parent(i)',
];

function parentOf(i: number): number {
  return Math.floor((i - 1) / 2);
}

function buildState(arr: number[], highlightIdx?: number, newIdx?: number): TreeState {
  const nodes: Record<string, TreeNode> = {};
  arr.forEach((v, i) => {
    const id = String(i);
    nodes[id] = {
      id,
      value: v,
      left: 2 * i + 1 < arr.length ? String(2 * i + 1) : null,
      right: 2 * i + 2 < arr.length ? String(2 * i + 2) : null,
      label: `[${i}]`,
    };
  });
  return {
    nodes,
    rootId: arr.length ? '0' : null,
    highlightId: highlightIdx !== undefined ? String(highlightIdx) : undefined,
    newId: newIdx !== undefined ? String(newIdx) : undefined,
  };
}

function generateSteps(input: number[]): AlgorithmStep<TreeState>[] {
  const arr: number[] = [];
  const steps: AlgorithmStep<TreeState>[] = [
    { state: buildState(arr), description: msg('viz.d.emptyTree'), highlightLine: 0 },
  ];

  for (const k of input) {
    arr.push(k);
    let i = arr.length - 1;
    steps.push({
      state: buildState(arr, undefined, i),
      description: msg('viz.heap.insertAppend', { value: k, i }),
      highlightLine: 1,
    });
    while (i > 0 && arr[parentOf(i)] < arr[i]) {
      const p = parentOf(i);
      steps.push({
        state: buildState(arr, i),
        description: msg('viz.heap.siftUp', { i, vi: arr[i], p, vp: arr[p] }),
        highlightLine: 3,
      });
      [arr[p], arr[i]] = [arr[i], arr[p]];
      i = p;
      steps.push({
        state: buildState(arr, i),
        description: msg('viz.heap.swapped', { value: arr[i], i }),
        highlightLine: 4,
      });
    }
    steps.push({
      state: buildState(arr, i),
      description: msg('viz.heap.settled', { value: k, i }),
      highlightLine: 0,
    });
  }

  steps.push({ state: buildState(arr), description: msg('viz.heap.doneInsert'), highlightLine: 0 });
  return steps;
}

function extractArray(state: TreeState): number[] {
  const values: number[] = [];
  let i = 0;
  while (state.nodes[String(i)]) {
    values.push(state.nodes[String(i)].value);
    i += 1;
  }
  return values;
}

export const heapInsert: AlgorithmDef<number[], TreeState> = {
  id: 'heap-insert',
  title: 'Binary Heap Insert',
  topicId: 'heaps',
  family: 'Trees',
  pseudocode,
  defaultInput: [7, 5, 2, 9, 4, 8],
  generateSteps,
  Renderer: TreeRenderer,
  extractResult: extractArray,
};
