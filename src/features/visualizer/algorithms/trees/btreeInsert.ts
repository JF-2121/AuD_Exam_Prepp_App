import { msg, type AlgorithmDef, type AlgorithmStep } from '../../core/types';
import { BTreeRenderer, type BTreeNode, type BTreeState } from './BTreeRenderer';
import { normalizeBTreeSpec, validateBTreeInput, type BTreeSpec } from './btreeSpec';

const pseudocode = [
  'insert(T, key):',
  '  if T.root is full (2t-1 keys):',
  '    split the root                // height grows by 1, only way a B-Tree grows',
  '  x = T.root',
  '  while x is not a leaf:',
  '    c = the child of x that key must descend into',
  '    if c is full:',
  '      splitChild(x, c)            // median of c moves up into x',
  '      if key > the promoted key: c = the new right sibling',
  '    x = c',
  '  insert key into x at the correct sorted position   // x is guaranteed non-full and a leaf',
];

export type { BTreeSpec };

export interface BTreeInsertInput {
  t: number;
  /**
   * The starting tree, either spelled out node by node or — as exam exercises state it — as a flat
   * list of the keys it holds, which is then built by inserting them in order.
   */
  initial: BTreeSpec | number[];
  insertions: number[];
}

function freshId(): string {
  return `bt-${Math.random().toString(36).slice(2, 9)}`;
}

function cloneNodes(nodes: Record<string, BTreeNode>): Record<string, BTreeNode> {
  return Object.fromEntries(Object.entries(nodes).map(([k, v]) => [k, { id: v.id, keys: [...v.keys], children: [...v.children] }]));
}

function buildFromSpec(spec: BTreeSpec, nodes: Record<string, BTreeNode>): string {
  const id = freshId();
  const children = (spec.children ?? []).map((c) => buildFromSpec(c, nodes));
  nodes[id] = { id, keys: [...spec.keys], children };
  return id;
}

function generateSteps({ t, initial, insertions }: BTreeInsertInput): AlgorithmStep<BTreeState>[] {
  const nodes: Record<string, BTreeNode> = {};
  let root = buildFromSpec(normalizeBTreeSpec(initial, t), nodes);
  const steps: AlgorithmStep<BTreeState>[] = [];
  const maxKeys = 2 * t - 1;

  function snapshot(highlightId?: string, newId?: string): BTreeState {
    return { nodes: cloneNodes(nodes), rootId: root, highlightId, newId };
  }

  steps.push({ state: snapshot(), description: msg('viz.btree.starting', { t, min: t - 1, max: maxKeys }), highlightLine: 0 });

  function childIndexFor(node: BTreeNode, key: number): number {
    let i = 0;
    while (i < node.keys.length && key > node.keys[i]) i += 1;
    return i;
  }

  function splitChild(xId: string, i: number) {
    const x = nodes[xId];
    const cId = x.children[i];
    const c = nodes[cId];
    const median = c.keys[t - 1];
    const rightId = freshId();
    const right: BTreeNode = {
      id: rightId,
      keys: c.keys.slice(t),
      children: c.children.length ? c.children.slice(t) : [],
    };
    nodes[rightId] = right;
    c.keys = c.keys.slice(0, t - 1);
    c.children = c.children.length ? c.children.slice(0, t) : [];
    x.keys.splice(i, 0, median);
    x.children.splice(i + 1, 0, rightId);
    steps.push({
      state: snapshot(xId, rightId),
      description: msg(c.keys.length + 1 === t ? 'viz.btree.splitChild' : 'viz.btree.splitNode', { max: maxKeys, median }),
      highlightLine: 7,
    });
  }

  for (const key of insertions) {
    if (nodes[root].keys.length === maxKeys) {
      const oldRoot = root;
      const newRoot = freshId();
      nodes[newRoot] = { id: newRoot, keys: [], children: [oldRoot] };
      root = newRoot;
      steps.push({ state: snapshot(root), description: msg('viz.btree.splitRoot', { key }), highlightLine: 2 });
      splitChild(root, 0);
    }

    let xId = root;
    steps.push({ state: snapshot(xId), description: msg('viz.btree.insertStart', { key }), highlightLine: 3 });
    while (nodes[xId].children.length > 0) {
      const x = nodes[xId];
      const i = childIndexFor(x, key);
      let cId = x.children[i];
      if (nodes[cId].keys.length === maxKeys) {
        splitChild(xId, i);
        if (key > nodes[xId].keys[i]) cId = nodes[xId].children[i + 1];
      }
      const finalIdx = nodes[xId].children.indexOf(cId);
      steps.push({
        state: snapshot(cId),
        description: msg('viz.btree.descend', {
        key,
        low: nodes[xId].keys[finalIdx - 1] ?? '-∞',
        high: nodes[xId].keys[finalIdx] ?? '+∞',
      }),
        highlightLine: 5,
      });
      xId = cId;
    }

    const leaf = nodes[xId];
    const pos = childIndexFor(leaf, key);
    leaf.keys.splice(pos, 0, key);
    steps.push({ state: snapshot(undefined, xId), description: msg('viz.btree.insertedLeaf', { key, count: leaf.keys.length }), highlightLine: 10 });
  }

  steps.push({ state: snapshot(), description: msg('viz.btree.doneInsert'), highlightLine: 0 });
  return steps;
}

function sortedKeys(state: BTreeState): number[] {
  const result: number[] = [];
  function visit(id: string | null) {
    if (!id) return;
    const node = state.nodes[id];
    if (node.children.length === 0) {
      result.push(...node.keys);
      return;
    }
    for (let i = 0; i < node.keys.length; i++) {
      visit(node.children[i]);
      result.push(node.keys[i]);
    }
    visit(node.children[node.children.length - 1]);
  }
  visit(state.rootId);
  return result;
}

export const btreeInsert: AlgorithmDef<BTreeInsertInput, BTreeState> = {
  id: 'btree-insert',
  title: 'B-Tree Insert',
  topicId: 'b-trees',
  family: 'Trees',
  pseudocode,
  defaultInput: {
    t: 2,
    initial: { keys: [9, 40], children: [{ keys: [2, 4, 5] }, { keys: [12, 15, 30] }, { keys: [55, 60, 69] }] },
    insertions: [67, 45, 13, 56],
  },
  generateSteps,
  Renderer: BTreeRenderer,
  validateInput: (input) => validateBTreeInput(input, 'insertions'),
  inputHint: 'viz.hint.btreeInsert',
  extractResult: sortedKeys,
};
