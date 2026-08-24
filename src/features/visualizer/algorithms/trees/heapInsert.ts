import type { AlgorithmDef, AlgorithmStep } from '../../core/types';
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
    { state: buildState(arr), description: 'Empty heap.', highlightLine: 0 },
  ];

  for (const k of input) {
    arr.push(k);
    let i = arr.length - 1;
    steps.push({
      state: buildState(arr, undefined, i),
      description: `Insert ${k}: append at index ${i} (the last free slot — keeps the tree complete).`,
      highlightLine: 1,
    });
    while (i > 0 && arr[parentOf(i)] < arr[i]) {
      const p = parentOf(i);
      steps.push({
        state: buildState(arr, i),
        description: `Compare index ${i} (${arr[i]}) with parent index ${p} (${arr[p]}): ${arr[i]} > ${arr[p]}, violates heap property — sift up.`,
        highlightLine: 3,
      });
      [arr[p], arr[i]] = [arr[i], arr[p]];
      i = p;
      steps.push({
        state: buildState(arr, i),
        description: `Swapped. ${arr[i]} now at index ${i}.`,
        highlightLine: 4,
      });
    }
    steps.push({
      state: buildState(arr, i),
      description: `${k} settles at index ${i}: parent (if any) is now ≥ ${k}, heap property restored.`,
      highlightLine: 0,
    });
  }

  steps.push({ state: buildState(arr), description: 'All values inserted. Every parent ≥ its children.', highlightLine: 0 });
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
