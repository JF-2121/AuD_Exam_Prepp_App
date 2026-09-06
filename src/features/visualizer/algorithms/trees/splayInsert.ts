import { msg, type AlgorithmDef, type AlgorithmStep } from '../../core/types';
import { TreeRenderer, type TreeState } from './TreeRenderer';
import { createSplayEngine, performInsert } from './splayEngine';

const pseudocode = [
  'insert(T, value):',
  '  w = bstInsert(T, value)   // plain BST insert; w = the new leaf',
  '  splay(w)                  // bring w to the root',
  '',
  'splay(node):',
  '  while node.parent != null:',
  '    p = node.parent; g = p.parent',
  '    if g == null: rotate(p)                          // Zig',
  '    elif sameSide(node, p, g): rotate(g); rotate(p)   // Zig-Zig: far first',
  '    else: rotate(p); rotate(g)                        // Zig-Zag: near first',
];

const LINES = { insert: 1, zig: 7, zigzig: 8, zigzag: 9, done: 2 };

export interface SplayInsertInput {
  seed: number[];
  insertions: number[];
}

function generateSteps({ seed, insertions }: SplayInsertInput): AlgorithmStep<TreeState>[] {
  const engine = createSplayEngine();
  const steps: AlgorithmStep<TreeState>[] = [];

  for (const v of seed) engine.insertPlain(v);
  steps.push({ state: engine.snapshot(), description: msg('viz.d.startingTreeGiven', { values: seed.join(', ') }), highlightLine: 0 });

  for (const value of insertions) {
    performInsert(engine, steps, value, LINES);
  }

  steps.push({ state: engine.snapshot(), description: msg('viz.d.allInserted'), highlightLine: 0 });
  return steps;
}

export const splayInsert: AlgorithmDef<SplayInsertInput, TreeState> = {
  id: 'splay-insert',
  title: 'Splay Tree Insert',
  topicId: 'splay-trees',
  family: 'Trees',
  pseudocode,
  defaultInput: { seed: [12, 20, 13, 21, 15], insertions: [14, 18, 17, 11, 16, 19] },
  generateSteps,
  Renderer: TreeRenderer,
  extractResult: (state) => (state.rootId ? state.nodes[state.rootId].value : null),
};
