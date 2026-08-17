import type { AlgorithmDef, AlgorithmStep } from '../../core/types';
import { TreeRenderer, type TreeNode, type TreeState } from './TreeRenderer';

const pseudocode = [
  'delete(z):',
  '  splice z out (BST-style via transplant),',
  '  x = the node that took its place',
  "  if z's original color was BLACK:",
  '    deleteFixup(x)',
  'deleteFixup(x):',
  '  while x != root and x.color == BLACK:',
  '    w = sibling(x)',
  '    if w.color == RED: // Case 1',
  '      recolor w black, parent red; rotate parent',
  '    if both of w.children are BLACK: // Case 2',
  '      w.color = RED; x = x.parent',
  '    else:',
  '      if outer nephew is BLACK: // Case 3',
  '        recolor + rotate w',
  '      // Case 4',
  "      w.color = parent's color; parent, outer nephew = BLACK",
  '      rotate parent; x = root',
  '  x.color = BLACK',
];

export interface RbtDeleteInput {
  initial: number[];
  deletions: number[];
}

type Color = 'red' | 'black';
interface Node {
  id: string;
  value: number;
  left: string;
  right: string;
  parent: string;
  color: Color;
}

const NIL = 'NIL';

function cloneNodes(nodes: Record<string, Node>): Record<string, TreeNode> {
  const out: Record<string, TreeNode> = {};
  for (const [k, v] of Object.entries(nodes)) {
    if (k === NIL) continue;
    out[k] = {
      id: v.id,
      value: v.value,
      left: v.left === NIL ? null : v.left,
      right: v.right === NIL ? null : v.right,
      color: v.color,
    };
  }
  return out;
}

function generateSteps({ initial, deletions }: RbtDeleteInput): AlgorithmStep<TreeState>[] {
  const nodes: Record<string, Node> = {
    [NIL]: { id: NIL, value: NaN, left: NIL, right: NIL, parent: NIL, color: 'black' },
  };
  let root: string = NIL;
  const steps: AlgorithmStep<TreeState>[] = [];

  function pushStep(description: string, highlightLine: number, extra?: Partial<TreeState>) {
    steps.push({
      state: { nodes: cloneNodes(nodes), rootId: root === NIL ? null : root, ...extra },
      description,
      highlightLine,
    });
  }

  function rotateLeft(x: string) {
    const nx = nodes[x];
    const y = nx.right;
    const ny = nodes[y];
    nx.right = ny.left;
    if (ny.left !== NIL) nodes[ny.left].parent = x;
    ny.parent = nx.parent;
    if (nx.parent === NIL) root = y;
    else if (nodes[nx.parent].left === x) nodes[nx.parent].left = y;
    else nodes[nx.parent].right = y;
    ny.left = x;
    nx.parent = y;
  }

  function rotateRight(x: string) {
    const nx = nodes[x];
    const y = nx.left;
    const ny = nodes[y];
    nx.left = ny.right;
    if (ny.right !== NIL) nodes[ny.right].parent = x;
    ny.parent = nx.parent;
    if (nx.parent === NIL) root = y;
    else if (nodes[nx.parent].right === x) nodes[nx.parent].right = y;
    else nodes[nx.parent].left = y;
    ny.right = x;
    nx.parent = y;
  }

  function insertFixup(zId: string) {
    let z = zId;
    while (nodes[nodes[z].parent].color === 'red') {
      const parentId = nodes[z].parent;
      const grandparentId = nodes[parentId].parent;
      if (parentId === nodes[grandparentId].left) {
        const uncleId = nodes[grandparentId].right;
        if (nodes[uncleId].color === 'red') {
          nodes[parentId].color = 'black';
          nodes[uncleId].color = 'black';
          nodes[grandparentId].color = 'red';
          z = grandparentId;
        } else {
          if (z === nodes[parentId].right) {
            z = parentId;
            rotateLeft(z);
          }
          nodes[nodes[z].parent].color = 'black';
          nodes[nodes[nodes[z].parent].parent].color = 'red';
          rotateRight(nodes[nodes[z].parent].parent);
        }
      } else {
        const uncleId = nodes[grandparentId].left;
        if (nodes[uncleId].color === 'red') {
          nodes[parentId].color = 'black';
          nodes[uncleId].color = 'black';
          nodes[grandparentId].color = 'red';
          z = grandparentId;
        } else {
          if (z === nodes[parentId].left) {
            z = parentId;
            rotateRight(z);
          }
          nodes[nodes[z].parent].color = 'black';
          nodes[nodes[nodes[z].parent].parent].color = 'red';
          rotateLeft(nodes[nodes[z].parent].parent);
        }
      }
    }
    nodes[root].color = 'black';
  }

  function insert(value: number) {
    const id = `n${value}-${Math.random().toString(36).slice(2, 6)}`;
    nodes[id] = { id, value, left: NIL, right: NIL, parent: NIL, color: 'red' };
    let cursor = root;
    let parent = NIL;
    while (cursor !== NIL) {
      parent = cursor;
      cursor = value < nodes[cursor].value ? nodes[cursor].left : nodes[cursor].right;
    }
    nodes[id].parent = parent;
    if (parent === NIL) root = id;
    else if (value < nodes[parent].value) nodes[parent].left = id;
    else nodes[parent].right = id;
    insertFixup(id);
  }

  function transplant(u: string, v: string) {
    const un = nodes[u];
    if (un.parent === NIL) root = v;
    else if (nodes[un.parent].left === u) nodes[un.parent].left = v;
    else nodes[un.parent].right = v;
    nodes[v].parent = un.parent;
  }

  function treeMin(x: string): string {
    while (nodes[x].left !== NIL) x = nodes[x].left;
    return x;
  }

  function deleteFixup(xId: string) {
    let x = xId;
    while (x !== root && nodes[x].color === 'black') {
      const parentId = nodes[x].parent;
      if (x === nodes[parentId].left) {
        let w = nodes[parentId].right;
        if (nodes[w].color === 'red') {
          nodes[w].color = 'black';
          nodes[parentId].color = 'red';
          rotateLeft(parentId);
          pushStep(`Case 1: sibling is red — recolor and rotate left at ${nodes[parentId].value}.`, 9);
          w = nodes[parentId].right;
        }
        if (nodes[nodes[w].left].color === 'black' && nodes[nodes[w].right].color === 'black') {
          nodes[w].color = 'red';
          pushStep('Case 2: both of sibling’s children are black — recolor sibling red, move deficiency up.', 12);
          x = parentId;
        } else {
          if (nodes[nodes[w].right].color === 'black') {
            nodes[nodes[w].left].color = 'black';
            nodes[w].color = 'red';
            rotateRight(w);
            pushStep(`Case 3: sibling's outer nephew is black — recolor and rotate right at ${nodes[w].value}.`, 15);
            w = nodes[parentId].right;
          }
          nodes[w].color = nodes[parentId].color;
          nodes[parentId].color = 'black';
          nodes[nodes[w].right].color = 'black';
          rotateLeft(parentId);
          pushStep(`Case 4: rotate left at ${nodes[parentId].value} — deficiency resolved.`, 18);
          x = root;
        }
      } else {
        let w = nodes[parentId].left;
        if (nodes[w].color === 'red') {
          nodes[w].color = 'black';
          nodes[parentId].color = 'red';
          rotateRight(parentId);
          pushStep(`Case 1: sibling is red — recolor and rotate right at ${nodes[parentId].value}.`, 9);
          w = nodes[parentId].left;
        }
        if (nodes[nodes[w].right].color === 'black' && nodes[nodes[w].left].color === 'black') {
          nodes[w].color = 'red';
          pushStep('Case 2: both of sibling’s children are black — recolor sibling red, move deficiency up.', 12);
          x = parentId;
        } else {
          if (nodes[nodes[w].left].color === 'black') {
            nodes[nodes[w].right].color = 'black';
            nodes[w].color = 'red';
            rotateLeft(w);
            pushStep(`Case 3: sibling's outer nephew is black — recolor and rotate left at ${nodes[w].value}.`, 15);
            w = nodes[parentId].left;
          }
          nodes[w].color = nodes[parentId].color;
          nodes[parentId].color = 'black';
          nodes[nodes[w].left].color = 'black';
          rotateRight(parentId);
          pushStep(`Case 4: rotate right at ${nodes[parentId].value} — deficiency resolved.`, 18);
          x = root;
        }
      }
    }
    nodes[x].color = 'black';
  }

  function findId(value: number): string | null {
    let cursor = root;
    while (cursor !== NIL) {
      if (value === nodes[cursor].value) return cursor;
      cursor = value < nodes[cursor].value ? nodes[cursor].left : nodes[cursor].right;
    }
    return null;
  }

  for (const value of initial) insert(value);
  pushStep(`Starting Red-Black tree, built from [${initial.join(', ')}].`, 0);

  for (const value of deletions) {
    const zId = findId(value);
    if (!zId) {
      pushStep(`${value} is not in the tree — nothing to delete.`, 0);
      continue;
    }
    pushStep(`Delete ${value}.`, 0, { highlightId: zId });
    const z = nodes[zId];
    let y = zId;
    let yOriginalColor = z.color;
    let x: string;

    if (z.left === NIL) {
      x = z.right;
      transplant(zId, z.right);
    } else if (z.right === NIL) {
      x = z.left;
      transplant(zId, z.left);
    } else {
      y = treeMin(z.right);
      yOriginalColor = nodes[y].color;
      x = nodes[y].right;
      if (nodes[y].parent === zId) {
        nodes[x].parent = y;
      } else {
        transplant(y, nodes[y].right);
        nodes[y].right = z.right;
        nodes[nodes[y].right].parent = y;
      }
      transplant(zId, y);
      nodes[y].left = z.left;
      nodes[nodes[y].left].parent = y;
      nodes[y].color = z.color;
      pushStep(`${value} has two children: successor ${nodes[y].value} takes its place.`, 0, { newId: y });
    }

    if (yOriginalColor === 'black') {
      pushStep('Spliced-out node was black — the tree may now be unbalanced. Fixing up.', 6);
      deleteFixup(x);
    }
  }

  pushStep('All deletions complete. Red-Black properties restored.', 0);
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

export const rbtDelete: AlgorithmDef<RbtDeleteInput, TreeState> = {
  id: 'rbt-delete',
  title: 'Red-Black Tree Delete',
  topicId: 'red-black-trees',
  family: 'Trees',
  pseudocode,
  defaultInput: { initial: [10, 18, 7, 15, 16, 30, 25, 40, 60, 2], deletions: [18, 7] },
  generateSteps,
  Renderer: TreeRenderer,
  extractResult: (state) => inorderValues(state.nodes, state.rootId),
};
