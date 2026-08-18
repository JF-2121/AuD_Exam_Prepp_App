import type { AlgorithmDef, AlgorithmStep } from '../../core/types';
import { TreeRenderer, type TreeNode, type TreeState } from './TreeRenderer';

const pseudocode = [
  'delete(value): // BST-delete (transplant), then walk up from the removal point',
  '  for each ancestor a, bottom-up, ALL THE WAY to the root:',
  '    updateHeight(a)',
  '    bf = height(a.left) - height(a.right)',
  '    if bf > 1:',
  '      if bf(a.left) < 0: rotateLeft(a.left)   // LR case',
  '      rotateRight(a)   // no break: keep climbing — delete can rebalance many levels',
  '    if bf < -1:',
  '      if bf(a.right) > 0: rotateRight(a.right) // RL case',
  '      rotateLeft(a)',
];

export interface AvlDeleteInput {
  initial: number[];
  deletions: number[];
}

interface AvlNode {
  id: string;
  value: number;
  left: string | null;
  right: string | null;
  parent: string | null;
  height: number;
}

function bfLabel(bf: number): string {
  return bf > 0 ? `+${bf}` : String(bf);
}

function cloneNodes(nodes: Record<string, AvlNode>): Record<string, TreeNode> {
  const bfOf = (id: string) => {
    const n = nodes[id];
    const hl = n.left ? nodes[n.left].height : -1;
    const hr = n.right ? nodes[n.right].height : -1;
    return hl - hr;
  };
  return Object.fromEntries(
    Object.entries(nodes).map(([k, v]) => [
      k,
      { id: v.id, value: v.value, left: v.left, right: v.right, label: bfLabel(bfOf(k)) },
    ]),
  );
}

function generateSteps({ initial, deletions }: AvlDeleteInput): AlgorithmStep<TreeState>[] {
  const nodes: Record<string, AvlNode> = {};
  let root: string | null = null;
  const steps: AlgorithmStep<TreeState>[] = [];

  function pushStep(description: string, highlightLine: number, extra?: Partial<TreeState>) {
    steps.push({ state: { nodes: cloneNodes(nodes), rootId: root, ...extra }, description, highlightLine });
  }

  function height(id: string | null): number {
    return id ? nodes[id].height : -1;
  }
  function updateHeight(id: string) {
    nodes[id].height = 1 + Math.max(height(nodes[id].left), height(nodes[id].right));
  }
  function balanceFactor(id: string): number {
    return height(nodes[id].left) - height(nodes[id].right);
  }

  function rotateLeft(x: string) {
    const nx = nodes[x];
    const y = nx.right!;
    const ny = nodes[y];
    nx.right = ny.left;
    if (ny.left) nodes[ny.left].parent = x;
    ny.parent = nx.parent;
    if (!nx.parent) root = y;
    else if (nodes[nx.parent].left === x) nodes[nx.parent].left = y;
    else nodes[nx.parent].right = y;
    ny.left = x;
    nx.parent = y;
    updateHeight(x);
    updateHeight(y);
  }

  function rotateRight(x: string) {
    const nx = nodes[x];
    const y = nx.left!;
    const ny = nodes[y];
    nx.left = ny.right;
    if (ny.right) nodes[ny.right].parent = x;
    ny.parent = nx.parent;
    if (!nx.parent) root = y;
    else if (nodes[nx.parent].right === x) nodes[nx.parent].right = y;
    else nodes[nx.parent].left = y;
    ny.right = x;
    nx.parent = y;
    updateHeight(x);
    updateHeight(y);
  }

  function insertPlain(value: number) {
    const id = `n${value}-${Math.random().toString(36).slice(2, 6)}`;
    nodes[id] = { id, value, left: null, right: null, parent: null, height: 0 };
    if (!root) {
      root = id;
      return;
    }
    let cursor = root;
    while (true) {
      const cur = nodes[cursor];
      if (value < cur.value) {
        if (!cur.left) {
          cur.left = id;
          nodes[id].parent = cursor;
          break;
        }
        cursor = cur.left;
      } else {
        if (!cur.right) {
          cur.right = id;
          nodes[id].parent = cursor;
          break;
        }
        cursor = cur.right;
      }
    }
    let a: string | null = nodes[id].parent;
    while (a) {
      updateHeight(a);
      const bf = balanceFactor(a);
      if (bf > 1) {
        const leftChild = nodes[a].left!;
        if (balanceFactor(leftChild) < 0) rotateLeft(leftChild);
        rotateRight(a);
        break;
      }
      if (bf < -1) {
        const rightChild = nodes[a].right!;
        if (balanceFactor(rightChild) > 0) rotateRight(rightChild);
        rotateLeft(a);
        break;
      }
      a = nodes[a].parent;
    }
  }

  function findId(value: number): string | null {
    let cursor = root;
    while (cursor) {
      const n = nodes[cursor];
      if (value === n.value) return cursor;
      cursor = value < n.value ? n.left : n.right;
    }
    return null;
  }

  function transplant(u: string, v: string | null) {
    const un = nodes[u];
    if (!un.parent) root = v;
    else if (nodes[un.parent].left === u) nodes[un.parent].left = v;
    else nodes[un.parent].right = v;
    if (v) nodes[v].parent = un.parent;
  }

  // Build the initial tree silently (plain AVL inserts, no narration).
  for (const value of initial) insertPlain(value);
  pushStep(`Starting tree, built from [${initial.join(', ')}].`, 0);

  function rebalanceFrom(start: string | null) {
    let a = start;
    while (a) {
      updateHeight(a);
      const bf = balanceFactor(a);
      pushStep(`Walk up to ${nodes[a].value}: height=${nodes[a].height}, balance factor=${bfLabel(bf)}.`, 2, { highlightId: a });

      if (bf > 1) {
        const leftChild = nodes[a].left!;
        if (balanceFactor(leftChild) < 0) {
          pushStep(`${nodes[a].value} left-heavy (bf=${bfLabel(bf)}), left child right-heavy: rotate left at ${nodes[leftChild].value} first (LR case).`, 5);
          rotateLeft(leftChild);
        } else {
          pushStep(`${nodes[a].value} is left-heavy (bf=${bfLabel(bf)}): rotate right at ${nodes[a].value} (LL case).`, 5);
        }
        rotateRight(a);
        // rotateRight(a) sets a's parent to the new local subtree root; continue climbing from there.
        a = nodes[a].parent;
        continue;
      } else if (bf < -1) {
        const rightChild = nodes[a].right!;
        if (balanceFactor(rightChild) > 0) {
          pushStep(`${nodes[a].value} right-heavy (bf=${bfLabel(bf)}), right child left-heavy: rotate right at ${nodes[rightChild].value} first (RL case).`, 8);
          rotateRight(rightChild);
        } else {
          pushStep(`${nodes[a].value} is right-heavy (bf=${bfLabel(bf)}): rotate left at ${nodes[a].value} (RR case).`, 8);
        }
        rotateLeft(a);
        a = nodes[a].parent;
        continue;
      }
      // Unlike insert, deletion can require rebalancing at every level up to the root.
      a = nodes[a].parent;
    }
  }

  for (const value of deletions) {
    const zId = findId(value);
    if (!zId) {
      pushStep(`${value} is not in the tree — nothing to delete.`, 0);
      continue;
    }
    const z = nodes[zId];
    pushStep(`Delete ${value}.`, 0, { highlightId: zId });

    let rebalanceStart: string | null;
    if (!z.left) {
      pushStep(`${value} has no left child: transplant its right child into its place.`, 0);
      rebalanceStart = z.parent;
      transplant(zId, z.right);
    } else if (!z.right) {
      pushStep(`${value} has no right child: transplant its left child into its place.`, 0);
      rebalanceStart = z.parent;
      transplant(zId, z.left);
    } else {
      let yId = z.right;
      while (nodes[yId].left) yId = nodes[yId].left!;
      const y = nodes[yId];
      pushStep(`${value} has two children: its successor is ${y.value} (leftmost node of its right subtree).`, 0, { highlightId: yId });
      if (y.parent !== zId) {
        rebalanceStart = y.parent;
        transplant(yId, y.right);
        y.right = z.right;
        if (y.right) nodes[y.right].parent = yId;
      } else {
        rebalanceStart = yId;
      }
      transplant(zId, yId);
      y.left = z.left;
      if (y.left) nodes[y.left].parent = yId;
      pushStep(`${y.value} takes ${value}'s place, inheriting its subtrees.`, 0, { newId: yId });
    }

    rebalanceFrom(rebalanceStart);
  }

  pushStep('All deletions complete. Every node satisfies |balance factor| ≤ 1.', 0);
  return steps;
}

function inorderValues(nodes: Record<string, TreeNode>, rootId: string | null): number[] {
  const result: number[] = [];
  function visit(id: string | null) {
    if (!id) return;
    const node = nodes[id];
    visit(node.left);
    result.push(node.value);
    visit(node.right);
  }
  visit(rootId);
  return result;
}

export const avlDelete: AlgorithmDef<AvlDeleteInput, TreeState> = {
  id: 'avl-delete',
  title: 'AVL Tree Delete',
  topicId: 'avl-trees',
  family: 'Trees',
  pseudocode,
  defaultInput: { initial: [10, 20, 30, 25, 5, 1, 15, 22, 28], deletions: [1, 5, 30] },
  generateSteps,
  Renderer: TreeRenderer,
  extractResult: (state) => inorderValues(state.nodes, state.rootId),
};
