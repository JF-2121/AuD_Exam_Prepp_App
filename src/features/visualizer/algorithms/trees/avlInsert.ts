import { msg, type AlgorithmDef, type AlgorithmStep, type StepText } from '../../core/types';
import { TreeRenderer, type TreeNode, type TreeState } from './TreeRenderer';

const pseudocode = [
  'insert(value): // BST-insert, then walk up from the new leaf\'s parent',
  '  for each ancestor a, bottom-up:',
  '    updateHeight(a)',
  '    bf = height(a.left) - height(a.right)',
  '    if bf > 1:              // left-heavy',
  '      if bf(a.left) < 0: rotateLeft(a.left)   // LR case',
  '      rotateRight(a); break  // at most one (single/double) rotation needed',
  '    if bf < -1:             // right-heavy',
  '      if bf(a.right) > 0: rotateRight(a.right) // RL case',
  '      rotateLeft(a); break',
];

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

function generateSteps(input: number[]): AlgorithmStep<TreeState>[] {
  const nodes: Record<string, AvlNode> = {};
  let root: string | null = null;
  const steps: AlgorithmStep<TreeState>[] = [
    { state: { nodes: {}, rootId: null }, description: msg('viz.d.emptyTree'), highlightLine: 0 },
  ];

  function pushStep(description: StepText, highlightLine: number, extra?: Partial<TreeState>) {
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

  for (const value of input) {
    const id = `n${value}-${Math.random().toString(36).slice(2, 6)}`;
    nodes[id] = { id, value, left: null, right: null, parent: null, height: 0 };

    if (!root) {
      root = id;
      pushStep(msg('viz.d.insertBecomesRoot', { value }), 0, { newId: id });
      continue;
    }

    let cursor = root;
    while (true) {
      const cur = nodes[cursor];
      pushStep(msg('viz.bst.compare', { value, node: cur.value }), 0, { highlightId: cursor });
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
    pushStep(msg('viz.avl.insertLeaf', { value }), 1, { newId: id });

    let a: string | null = nodes[id].parent;
    while (a) {
      updateHeight(a);
      const bf = balanceFactor(a);
      pushStep(msg('viz.avl.walkUp', { node: nodes[a].value, height: nodes[a].height, bf: bfLabel(bf) }), 3, { highlightId: a });

      if (bf > 1) {
        const leftChild = nodes[a].left!;
        if (balanceFactor(leftChild) < 0) {
          pushStep(
            msg('viz.avl.lrCase', { node: nodes[a].value, bf: bfLabel(bf), child: nodes[leftChild].value }),
            6,
          );
          rotateLeft(leftChild);
        } else {
          pushStep(msg('viz.avl.llCase', { node: nodes[a].value, bf: bfLabel(bf) }), 7);
        }
        rotateRight(a);
        pushStep(msg('viz.avl.rebalanced'), 7);
        break;
      }
      if (bf < -1) {
        const rightChild = nodes[a].right!;
        if (balanceFactor(rightChild) > 0) {
          pushStep(
            msg('viz.avl.rlCase', { node: nodes[a].value, bf: bfLabel(bf), child: nodes[rightChild].value }),
            9,
          );
          rotateRight(rightChild);
        } else {
          pushStep(msg('viz.avl.rrCase', { node: nodes[a].value, bf: bfLabel(bf) }), 10);
        }
        rotateLeft(a);
        pushStep(msg('viz.avl.rebalanced'), 10);
        break;
      }
      a = nodes[a].parent;
    }
  }

  pushStep(msg('viz.avl.doneInsert'), 0);
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

export const avlInsert: AlgorithmDef<number[], TreeState> = {
  id: 'avl-insert',
  title: 'AVL Tree Insert',
  topicId: 'avl-trees',
  family: 'Trees',
  pseudocode,
  defaultInput: [10, 20, 30, 25, 5, 1, 15],
  generateSteps,
  Renderer: TreeRenderer,
  extractResult: (state) => inorderValues(state.nodes, state.rootId),
};
