import type { AlgorithmDef, AlgorithmStep } from '../../core/types';
import { TreeRenderer, type TreeNode, type TreeState } from './TreeRenderer';

const pseudocode = [
  'insert(node, value):',
  '  if node is null: return new Node(value)',
  '  if value < node.value:',
  '    node.left = insert(node.left, value)',
  '  else:',
  '    node.right = insert(node.right, value)',
  '  return node',
];

function cloneNodes(nodes: Record<string, TreeNode>): Record<string, TreeNode> {
  return Object.fromEntries(Object.entries(nodes).map(([k, v]) => [k, { ...v }]));
}

function generateSteps(input: number[]): AlgorithmStep<TreeState>[] {
  const nodes: Record<string, TreeNode> = {};
  let rootId: string | null = null;
  const steps: AlgorithmStep<TreeState>[] = [
    { state: { nodes: {}, rootId: null }, description: 'Empty tree.', highlightLine: 0 },
  ];

  for (const value of input) {
    const newId = `n${value}-${Math.random().toString(36).slice(2, 6)}`;
    if (!rootId) {
      nodes[newId] = { id: newId, value, left: null, right: null };
      rootId = newId;
      steps.push({
        state: { nodes: cloneNodes(nodes), rootId, newId },
        description: `Insert ${value}: tree was empty, becomes root.`,
        highlightLine: 1,
      });
      continue;
    }

    let cursorId = rootId;
    while (true) {
      const cursor = nodes[cursorId];
      steps.push({
        state: { nodes: cloneNodes(nodes), rootId, highlightId: cursorId },
        description: `Insert ${value}: compare with ${cursor.value}.`,
        highlightLine: 2,
      });
      if (value < cursor.value) {
        if (!cursor.left) {
          nodes[newId] = { id: newId, value, left: null, right: null };
          cursor.left = newId;
          steps.push({
            state: { nodes: cloneNodes(nodes), rootId, newId },
            description: `${value} < ${cursor.value}: insert as left child.`,
            highlightLine: 3,
          });
          break;
        }
        cursorId = cursor.left;
      } else {
        if (!cursor.right) {
          nodes[newId] = { id: newId, value, left: null, right: null };
          cursor.right = newId;
          steps.push({
            state: { nodes: cloneNodes(nodes), rootId, newId },
            description: `${value} >= ${cursor.value}: insert as right child.`,
            highlightLine: 5,
          });
          break;
        }
        cursorId = cursor.right;
      }
    }
  }

  steps.push({ state: { nodes: cloneNodes(nodes), rootId }, description: 'All values inserted.', highlightLine: 6 });
  return steps;
}

function inorderValues(state: TreeState): number[] {
  const result: number[] = [];
  function visit(id: string | null) {
    if (!id) return;
    const node = state.nodes[id];
    visit(node.left);
    result.push(node.value);
    visit(node.right);
  }
  visit(state.rootId);
  return result;
}

export const bstInsert: AlgorithmDef<number[], TreeState> = {
  id: 'bst-insert',
  title: 'Binary Search Tree Insert',
  topicId: 'bst',
  family: 'Trees',
  pseudocode,
  defaultInput: [8, 3, 10, 1, 6, 14, 4, 7],
  generateSteps,
  Renderer: TreeRenderer,
  extractResult: inorderValues,
};
