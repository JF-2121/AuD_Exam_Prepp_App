import type { AlgorithmDef, AlgorithmStep } from '../../core/types';
import { TreeRenderer, type TreeState } from './TreeRenderer';
import { createSplayEngine, performInsert, performSearch } from './splayEngine';

const pseudocode = [
  'find(T, value):                 // plain BST search, then splay the last node visited',
  '  w = bstSearch(T, value)       // w = node with value, or last node before a null child',
  '  splay(w)',
  '  return w',
  '',
  'delete(T, value):',
  '  w = find(T, value)            // splays regardless of outcome',
  '  if T.root.value != value: return   // not present — nothing further to do',
  '  L, R = T.root.left, T.root.right',
  '  remove T.root',
  '  if L == null: T.root = R',
  '  else:',
  '    w\' = max(L)                 // rightmost node of L, so it has no right child',
  '    splay(w\')                   // w\' becomes L\'s new root',
  '    w\'.right = R',
  '    T.root = w\'',
];

const FIND_LINES = { search: 1, zig: 2, zigzig: 2, zigzag: 2, done: 2 };
const INSERT_LINES = { insert: 1, zig: 2, zigzig: 2, zigzag: 2, done: 2 };

export interface SplayDeleteInput {
  seed: number[];
  insertions: number[];
  searches: number[];
  deletions: number[];
}

function generateSteps({ seed, insertions, searches, deletions }: SplayDeleteInput): AlgorithmStep<TreeState>[] {
  const engine = createSplayEngine();
  const steps: AlgorithmStep<TreeState>[] = [];

  for (const v of seed) engine.insertPlain(v);
  steps.push({ state: engine.snapshot(), description: `Starting tree (given), built from [${seed.join(', ')}].`, highlightLine: 0 });

  for (const value of insertions) {
    performInsert(engine, steps, value, INSERT_LINES);
  }
  if (insertions.length) {
    steps.push({ state: engine.snapshot(), description: `Insertions complete.`, highlightLine: 0 });
  }

  for (const value of searches) {
    performSearch(engine, steps, value, FIND_LINES);
  }

  for (const value of deletions) {
    const id = performSearch(engine, steps, value, FIND_LINES);
    if (!id) {
      steps.push({ state: engine.snapshot(), description: `Delete ${value}: tree is empty, nothing to do.`, highlightLine: 7 });
      continue;
    }
    const rootId = engine.getRoot()!;
    if (engine.nodes[rootId].value !== value) {
      steps.push({
        state: engine.snapshot(rootId),
        description: `Delete ${value}: not present (${engine.nodes[rootId].value} splayed to root instead) — tree left unchanged.`,
        highlightLine: 7,
      });
      continue;
    }
    const L = engine.nodes[rootId].left;
    const R = engine.nodes[rootId].right;
    steps.push({
      state: engine.snapshot(rootId),
      description: `Delete ${value}: it is now the root (just splayed). Remove it, splitting the tree into L (left subtree) and R (right subtree).`,
      highlightLine: 9,
    });
    engine.deleteNode(rootId);

    if (!L) {
      if (R) engine.nodes[R].parent = null;
      engine.setRoot(R);
      steps.push({ state: engine.snapshot(), description: 'L is empty: R becomes the new tree.', highlightLine: 10 });
    } else {
      engine.nodes[L].parent = null;
      engine.setRoot(L);
      const maxId = engine.maxOf(L);
      steps.push({ state: engine.snapshot(maxId), description: `Find the maximum of L: ${engine.nodes[maxId].value} (descend rightmost — it has no right child).`, highlightLine: 12 });
      engine.splay(maxId, (_label, description) => {
        steps.push({ state: engine.snapshot(maxId), description, highlightLine: 13 });
      });
      if (R) engine.nodes[R].parent = maxId;
      engine.nodes[maxId].right = R;
      steps.push({ state: engine.snapshot(undefined, maxId), description: `${engine.nodes[maxId].value} is L's new root (no right child); attach R directly as its right child.`, highlightLine: 14 });
    }
  }

  steps.push({ state: engine.snapshot(), description: 'All operations complete.', highlightLine: 0 });
  return steps;
}

export const splayDelete: AlgorithmDef<SplayDeleteInput, TreeState> = {
  id: 'splay-delete',
  title: 'Splay Tree Search & Delete',
  topicId: 'splay-trees',
  family: 'Trees',
  pseudocode,
  defaultInput: {
    seed: [12, 20, 13, 21, 15],
    insertions: [14, 18, 17, 11, 16, 19],
    searches: [15],
    deletions: [18],
  },
  generateSteps,
  Renderer: TreeRenderer,
  extractResult: (state) => (state.rootId ? state.nodes[state.rootId].value : null),
};
