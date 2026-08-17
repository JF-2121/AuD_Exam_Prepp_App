import type { AlgorithmDef, AlgorithmStep } from '../../core/types';
import { TreeRenderer, type TreeNode, type TreeState } from './TreeRenderer';

const pseudocode = [
  'insert(z): // BST-insert, then:',
  '  z.color = RED',
  '  fixColorsAfterInsertion(z)',
  'fixColorsAfterInsertion(z):',
  '  while z.parent.color == RED:',
  '    y = uncle(z)',
  '    if y.color == RED:        // Case 1',
  '      recolor parent/uncle black,',
  '      grandparent red; z = grandparent',
  '    else:                      // Case 2/3',
  '      if z is "inner" child: rotate to outer',
  '      recolor parent black, gp red',
  '      rotate grandparent',
  '  root.color = BLACK',
];

type Color = 'red' | 'black';
interface RBNode {
  id: string;
  value: number;
  left: string | null;
  right: string | null;
  parent: string | null;
  color: Color;
}

function cloneNodes(nodes: Record<string, RBNode>): Record<string, TreeNode> {
  return Object.fromEntries(
    Object.entries(nodes).map(([k, v]) => [k, { id: v.id, value: v.value, left: v.left, right: v.right, color: v.color }]),
  );
}

function generateSteps(input: number[]): AlgorithmStep<TreeState>[] {
  const nodes: Record<string, RBNode> = {};
  let root: string | null = null;
  const steps: AlgorithmStep<TreeState>[] = [
    { state: { nodes: {}, rootId: null }, description: 'Empty tree.', highlightLine: 0 },
  ];

  function pushStep(description: string, highlightLine: number, extra?: Partial<TreeState>) {
    steps.push({
      state: { nodes: cloneNodes(nodes), rootId: root, ...extra },
      description,
      highlightLine,
    });
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
  }

  function fixup(zId: string) {
    let z = zId;
    while (nodes[z].parent && nodes[nodes[z].parent!].color === 'red') {
      const parentId = nodes[z].parent!;
      const parent = nodes[parentId];
      const grandparentId = parent.parent!;
      const grandparent = nodes[grandparentId];

      if (parentId === grandparent.left) {
        const uncleId = grandparent.right;
        const uncle = uncleId ? nodes[uncleId] : null;
        if (uncle && uncle.color === 'red') {
          parent.color = 'black';
          uncle.color = 'black';
          grandparent.color = 'red';
          pushStep(`Case 1 (uncle ${uncle.value} is red): recolor parent and uncle black, grandparent red.`, 7, { highlightId: grandparentId });
          z = grandparentId;
        } else {
          if (z === parent.right) {
            z = parentId;
            rotateLeft(z);
            pushStep(`Case 2 (uncle black, z is inner child): rotate left at ${nodes[z].value}.`, 10);
          }
          nodes[nodes[z].parent!].color = 'black';
          nodes[nodes[nodes[z].parent!].parent!].color = 'red';
          const gp = nodes[nodes[z].parent!].parent!;
          rotateRight(gp);
          pushStep('Case 3 (uncle black, z is outer child): recolor and rotate right at grandparent.', 12);
        }
      } else {
        const uncleId = grandparent.left;
        const uncle = uncleId ? nodes[uncleId] : null;
        if (uncle && uncle.color === 'red') {
          parent.color = 'black';
          uncle.color = 'black';
          grandparent.color = 'red';
          pushStep(`Case 1 (uncle ${uncle.value} is red): recolor parent and uncle black, grandparent red.`, 7, { highlightId: grandparentId });
          z = grandparentId;
        } else {
          if (z === parent.left) {
            z = parentId;
            rotateRight(z);
            pushStep(`Case 2 (uncle black, z is inner child): rotate right at ${nodes[z].value}.`, 10);
          }
          nodes[nodes[z].parent!].color = 'black';
          nodes[nodes[nodes[z].parent!].parent!].color = 'red';
          const gp = nodes[nodes[z].parent!].parent!;
          rotateLeft(gp);
          pushStep('Case 3 (uncle black, z is outer child): recolor and rotate left at grandparent.', 12);
        }
      }
    }
  }

  for (const value of input) {
    const id = `n${value}-${Math.random().toString(36).slice(2, 6)}`;
    nodes[id] = { id, value, left: null, right: null, parent: null, color: 'red' };

    if (!root) {
      root = id;
      pushStep(`Insert ${value}: tree was empty, becomes root.`, 1, { newId: id });
    } else {
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
      pushStep(`Insert ${value} as a red leaf (BST insert).`, 1, { newId: id });
    }

    fixup(id);

    if (nodes[root!].color !== 'black') {
      nodes[root!].color = 'black';
      pushStep('Recolor root black (rule 2 must always hold).', 13);
    }
  }

  pushStep('All values inserted. Every root-to-leaf path has the same black-height.', 0);
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

export const rbtInsert: AlgorithmDef<number[], TreeState> = {
  id: 'rbt-insert',
  title: 'Red-Black Tree Insert',
  topicId: 'red-black-trees',
  family: 'Trees',
  pseudocode,
  defaultInput: [10, 18, 7, 15, 16, 30, 25, 40, 60, 2],
  generateSteps,
  Renderer: TreeRenderer,
  extractResult: (state) => inorderValues(state.nodes, state.rootId),
};
