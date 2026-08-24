import type { AlgorithmDef, AlgorithmStep } from '../../core/types';
import { BTreeRenderer, type BTreeNode, type BTreeState } from './BTreeRenderer';
import type { BTreeSpec } from './btreeInsert';

const pseudocode = [
  'delete(T, key):',
  '  x = T.root',
  '  loop:',
  '    if key is in x:',
  '      if x is a leaf: remove key from x; return',
  '      elif child-before-key has >= t keys:      // predecessor',
  "        k' = predecessor(key); replace key with k'; x = child-before; key = k'",
  '      elif child-after-key has >= t keys:       // successor',
  "        k' = successor(key); replace key with k'; x = child-after; key = k'",
  '      else: merge(child-before, key, child-after); x = merged node   // 2c',
  '    else:',
  '      c = the child x must descend into to find key',
  '      if c has t - 1 keys:',
  '        if a sibling of c has >= t keys: borrow through x (rotation)',
  '        else: merge c with a sibling and the separating key from x',
  '      x = c                                     // now guaranteed >= t keys',
];

export interface BTreeDeleteInput {
  t: number;
  initial: BTreeSpec;
  deletions: number[];
}

function freshId(): string {
  return `btd-${Math.random().toString(36).slice(2, 9)}`;
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

function generateSteps({ t, initial, deletions }: BTreeDeleteInput): AlgorithmStep<BTreeState>[] {
  const nodes: Record<string, BTreeNode> = {};
  let root = buildFromSpec(initial, nodes);
  const steps: AlgorithmStep<BTreeState>[] = [];

  function snapshot(highlightId?: string, newId?: string): BTreeState {
    return { nodes: cloneNodes(nodes), rootId: root, highlightId, newId };
  }

  steps.push({ state: snapshot(), description: `Starting B-Tree (degree t = ${t}, so ${t - 1}–${2 * t - 1} keys per non-root node).`, highlightLine: 0 });

  function descendIndexFor(node: BTreeNode, key: number): number {
    let i = 0;
    while (i < node.keys.length && key > node.keys[i]) i += 1;
    return i;
  }

  function findMax(id: string): number {
    let cur = nodes[id];
    while (cur.children.length) cur = nodes[cur.children[cur.children.length - 1]];
    return cur.keys[cur.keys.length - 1];
  }
  function findMin(id: string): number {
    let cur = nodes[id];
    while (cur.children.length) cur = nodes[cur.children[0]];
    return cur.keys[0];
  }

  function mergeChildren(xId: string, i: number, line: number = 9) {
    const x = nodes[xId];
    const leftId = x.children[i];
    const rightId = x.children[i + 1];
    const left = nodes[leftId];
    const right = nodes[rightId];
    const sep = x.keys[i];
    left.keys = [...left.keys, sep, ...right.keys];
    left.children = [...left.children, ...right.children];
    x.keys.splice(i, 1);
    x.children.splice(i + 1, 1);
    delete nodes[rightId];
    steps.push({
      state: snapshot(xId, leftId),
      description: `Both neighboring children have exactly t−1 keys — merge them together with separator ${sep} from the parent into one node of ${left.keys.length} keys.`,
      highlightLine: line,
    });
  }

  function borrowFromLeft(xId: string, i: number) {
    const x = nodes[xId];
    const c = nodes[x.children[i]];
    const leftSib = nodes[x.children[i - 1]];
    const downKey = x.keys[i - 1];
    c.keys.unshift(downKey);
    x.keys[i - 1] = leftSib.keys.pop()!;
    if (leftSib.children.length) c.children.unshift(leftSib.children.pop()!);
    steps.push({
      state: snapshot(xId, c.id),
      description: `Left sibling has ≥ t keys: rotate through the parent — ${downKey} moves down into the deficient child, ${x.keys[i - 1]} moves up to replace it.`,
      highlightLine: 13,
    });
  }
  function borrowFromRight(xId: string, i: number) {
    const x = nodes[xId];
    const c = nodes[x.children[i]];
    const rightSib = nodes[x.children[i + 1]];
    const downKey = x.keys[i];
    c.keys.push(downKey);
    x.keys[i] = rightSib.keys.shift()!;
    if (rightSib.children.length) c.children.push(rightSib.children.shift()!);
    steps.push({
      state: snapshot(xId, c.id),
      description: `Right sibling has ≥ t keys: rotate through the parent — ${downKey} moves down into the deficient child, ${x.keys[i]} moves up to replace it.`,
      highlightLine: 13,
    });
  }

  function deleteKey(xId: string, key: number) {
    const x = nodes[xId];
    const idx = x.keys.indexOf(key);

    if (idx !== -1) {
      if (x.children.length === 0) {
        x.keys.splice(idx, 1);
        steps.push({ state: snapshot(xId), description: `${key} found in a leaf with keys to spare — remove it directly.`, highlightLine: 4 });
        return;
      }
      const leftChildId = x.children[idx];
      const rightChildId = x.children[idx + 1];
      const leftChild = nodes[leftChildId];
      const rightChild = nodes[rightChildId];
      if (leftChild.keys.length >= t) {
        const pred = findMax(leftChildId);
        x.keys[idx] = pred;
        steps.push({ state: snapshot(xId, leftChildId), description: `${key} is internal; its predecessor child has ≥ t keys — replace ${key} with predecessor ${pred}, then delete ${pred} from that child.`, highlightLine: 6 });
        deleteKey(leftChildId, pred);
      } else if (rightChild.keys.length >= t) {
        const succ = findMin(rightChildId);
        x.keys[idx] = succ;
        steps.push({ state: snapshot(xId, rightChildId), description: `${key} is internal; predecessor child only has t−1 keys, but the successor child has ≥ t — replace ${key} with successor ${succ}, then delete ${succ} from that child.`, highlightLine: 8 });
        deleteKey(rightChildId, succ);
      } else {
        mergeChildren(xId, idx);
        deleteKey(leftChildId, key);
      }
      return;
    }

    if (x.children.length === 0) {
      steps.push({ state: snapshot(xId), description: `${key} is not in the tree.`, highlightLine: 0 });
      return;
    }

    let i = descendIndexFor(x, key);
    const cId = x.children[i];
    if (nodes[cId].keys.length === t - 1) {
      const leftSibId = i > 0 ? x.children[i - 1] : null;
      const rightSibId = i < x.children.length - 1 ? x.children[i + 1] : null;
      if (leftSibId && nodes[leftSibId].keys.length >= t) {
        borrowFromLeft(xId, i);
      } else if (rightSibId && nodes[rightSibId].keys.length >= t) {
        borrowFromRight(xId, i);
      } else if (leftSibId) {
        mergeChildren(xId, i - 1, 14);
        i -= 1;
      } else {
        mergeChildren(xId, i, 14);
      }
    }
    const nextId = x.children[i];
    steps.push({ state: snapshot(nextId), description: `Descend into the child covering ${key} (now guaranteed ≥ t keys).`, highlightLine: 11 });
    deleteKey(nextId, key);
  }

  for (const key of deletions) {
    if (!nodes[root] || (nodes[root].keys.length === 0 && nodes[root].children.length === 0)) {
      steps.push({ state: snapshot(), description: `Delete ${key}: tree is empty.`, highlightLine: 0 });
      continue;
    }
    steps.push({ state: snapshot(root), description: `Delete ${key}: start at the root.`, highlightLine: 1 });
    deleteKey(root, key);

    if (nodes[root].keys.length === 0) {
      if (nodes[root].children.length > 0) {
        const newRoot = nodes[root].children[0];
        delete nodes[root];
        root = newRoot;
        steps.push({ state: snapshot(undefined, root), description: `Root became empty after a merge — its only remaining child becomes the new root. Tree height decreases by one.`, highlightLine: 0 });
      } else {
        delete nodes[root];
        steps.push({ state: { nodes: {}, rootId: null }, description: 'The tree is now empty.', highlightLine: 0 });
      }
    }
  }

  steps.push({ state: snapshot(), description: 'All deletions complete. Every non-root node still has between t−1 and 2t−1 keys.', highlightLine: 0 });
  return steps;
}

function sortedKeys(state: BTreeState): number[] {
  const result: number[] = [];
  function visit(id: string | null) {
    if (!id) return;
    const node = state.nodes[id];
    if (!node) return;
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

export const btreeDelete: AlgorithmDef<BTreeDeleteInput, BTreeState> = {
  id: 'btree-delete',
  title: 'B-Tree Delete',
  topicId: 'b-trees',
  family: 'Trees',
  pseudocode,
  defaultInput: {
    t: 3,
    initial: {
      keys: [16],
      children: [
        { keys: [3, 7, 13], children: [{ keys: [1, 2] }, { keys: [4, 5, 6] }, { keys: [10, 11, 12] }, { keys: [14, 15] }] },
        { keys: [20, 23], children: [{ keys: [17, 18, 19] }, { keys: [21, 22] }, { keys: [24, 25] }] },
      ],
    },
    deletions: [6, 13, 7, 4],
  },
  generateSteps,
  Renderer: BTreeRenderer,
  extractResult: sortedKeys,
};
