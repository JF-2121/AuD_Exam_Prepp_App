import { msg, type AlgorithmDef, type AlgorithmStep, type StepText } from '../../core/types';
import { TreeRenderer, type TreeNode, type TreeState } from './TreeRenderer';

const pseudocode = [
  'delete(z):',
  '  if z.left == nil:',
  '    transplant(z, z.right)',
  '  elif z.right == nil:',
  '    transplant(z, z.left)',
  '  else:',
  '    y = min(z.right)   // successor',
  '    if y.parent != z:',
  '      transplant(y, y.right)',
  '      y.right = z.right',
  '    transplant(z, y)',
  '    y.left = z.left',
];

export interface BstDeleteInput {
  initial: number[];
  deletions: number[];
}

interface Node {
  id: string;
  value: number;
  left: string | null;
  right: string | null;
  parent: string | null;
}

function cloneNodes(nodes: Record<string, Node>): Record<string, TreeNode> {
  return Object.fromEntries(
    Object.entries(nodes).map(([k, v]) => [k, { id: v.id, value: v.value, left: v.left, right: v.right }]),
  );
}

function generateSteps({ initial, deletions }: BstDeleteInput): AlgorithmStep<TreeState>[] {
  const nodes: Record<string, Node> = {};
  let root: string | null = null;
  const steps: AlgorithmStep<TreeState>[] = [];

  function pushStep(description: StepText, highlightLine: number, extra?: Partial<TreeState>) {
    steps.push({ state: { nodes: cloneNodes(nodes), rootId: root, ...extra }, description, highlightLine });
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

  // Build the initial tree silently.
  for (const value of initial) {
    const id = `n${value}-${Math.random().toString(36).slice(2, 6)}`;
    nodes[id] = { id, value, left: null, right: null, parent: null };
    if (!root) {
      root = id;
      continue;
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
  }
  pushStep(msg('viz.d.startingTree', { values: initial.join(', ') }), 0);

  for (const value of deletions) {
    const zId = findId(value);
    if (!zId) {
      pushStep(msg('viz.d.notInTree', { value }), 0);
      continue;
    }
    const z = nodes[zId];
    pushStep(msg('viz.d.deleteValue', { value }), 0, { highlightId: zId });

    if (!z.left) {
      pushStep(msg('viz.bst.noLeftChild', { value }), 2);
      transplant(zId, z.right);
    } else if (!z.right) {
      pushStep(msg('viz.bst.noRightChild', { value }), 4);
      transplant(zId, z.left);
    } else {
      let yId = z.right;
      while (nodes[yId].left) yId = nodes[yId].left!;
      const y = nodes[yId];
      pushStep(msg('viz.bst.twoChildren', { value, succ: y.value }), 6, {
        highlightId: yId,
      });
      if (y.parent !== zId) {
        transplant(yId, y.right);
        y.right = z.right;
        if (y.right) nodes[y.right].parent = yId;
        pushStep(msg('viz.bst.detachSucc', { succ: y.value, value }), 9);
      }
      transplant(zId, yId);
      y.left = z.left;
      if (y.left) nodes[y.left].parent = yId;
      pushStep(msg('viz.bst.succTakesPlace', { succ: y.value, value }), 11, { newId: yId });
    }
  }

  pushStep(msg('viz.d.allDeleted'), 0);
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

export const bstDelete: AlgorithmDef<BstDeleteInput, TreeState> = {
  id: 'bst-delete',
  title: 'Binary Search Tree Delete',
  topicId: 'bst',
  family: 'Trees',
  pseudocode,
  defaultInput: { initial: [8, 3, 10, 1, 6, 14, 4, 7, 13], deletions: [1, 3, 8] },
  generateSteps,
  Renderer: TreeRenderer,
  extractResult: (state) => inorderValues(state.nodes, state.rootId),
};
