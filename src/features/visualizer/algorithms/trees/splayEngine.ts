import { msg, type AlgorithmStep, type StepText } from '../../core/types';
import type { TreeNode, TreeState } from './TreeRenderer';

export interface SplayNode {
  id: string;
  value: number;
  left: string | null;
  right: string | null;
  parent: string | null;
}

function cloneNodes(nodes: Record<string, SplayNode>): Record<string, TreeNode> {
  return Object.fromEntries(
    Object.entries(nodes).map(([k, v]) => [k, { id: v.id, value: v.value, left: v.left, right: v.right }]),
  );
}

/** Shared BST + splay engine reused by the Splay Tree insert and delete visualizers. */
export function createSplayEngine() {
  const nodes: Record<string, SplayNode> = {};
  let root: string | null = null;

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

  function insertPlain(value: number): string {
    const id = `s${value}-${Math.random().toString(36).slice(2, 6)}`;
    nodes[id] = { id, value, left: null, right: null, parent: null };
    if (!root) {
      root = id;
      return id;
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
    return id;
  }

  /** Plain BST search; returns the node containing `value` if present, otherwise the last node visited. */
  function findLastVisited(value: number): string | null {
    if (!root) return null;
    let cursor = root;
    while (true) {
      const cur = nodes[cursor];
      if (value === cur.value) return cursor;
      const next = value < cur.value ? cur.left : cur.right;
      if (!next) return cursor;
      cursor = next;
    }
  }

  function maxOf(startId: string): string {
    let cursor = startId;
    while (nodes[cursor].right) cursor = nodes[cursor].right!;
    return cursor;
  }

  /** Runs splay(nodeId) to the root, invoking onStep after each Zig/Zig-Zig/Zig-Zag rotation. */
  function splay(nodeId: string, onStep: (label: 'Zig' | 'Zig-Zig' | 'Zig-Zag', description: StepText) => void) {
    while (nodes[nodeId].parent) {
      const p = nodes[nodeId].parent!;
      const g = nodes[p].parent;
      if (!g) {
        const nodeIsRight = nodes[p].right === nodeId;
        if (nodeIsRight) rotateLeft(p);
        else rotateRight(p);
        onStep('Zig', msg('viz.splay.zig', { node: nodes[nodeId].value, parent: nodes[p].value }));
      } else {
        const pIsLeftOfG = nodes[g].left === p;
        const nodeIsLeftOfP = nodes[p].left === nodeId;
        if (pIsLeftOfG === nodeIsLeftOfP) {
          if (pIsLeftOfG) rotateRight(g);
          else rotateLeft(g);
          if (nodeIsLeftOfP) rotateRight(p);
          else rotateLeft(p);
          onStep(
            'Zig-Zig',
            msg(pIsLeftOfG ? 'viz.splay.zigzigLeft' : 'viz.splay.zigzigRight', { node: nodes[nodeId].value }),
          );
        } else {
          if (nodeIsLeftOfP) rotateRight(p);
          else rotateLeft(p);
          if (pIsLeftOfG) rotateRight(g);
          else rotateLeft(g);
          onStep('Zig-Zag', msg('viz.splay.zigzag', { node: nodes[nodeId].value }));
        }
      }
    }
  }

  return {
    nodes,
    getRoot: () => root,
    setRoot: (id: string | null) => {
      root = id;
    },
    deleteNode: (id: string) => {
      delete nodes[id];
    },
    insertPlain,
    findLastVisited,
    maxOf,
    splay,
    snapshot(highlightId?: string, newId?: string): TreeState {
      return { nodes: cloneNodes(nodes), rootId: root, highlightId, newId };
    },
  };
}

export type SplayEngine = ReturnType<typeof createSplayEngine>;

/** Inserts `value` (plain BST insert) then splays it to the root, narrating every step. */
export function performInsert(
  engine: SplayEngine,
  steps: AlgorithmStep<TreeState>[],
  value: number,
  lines: { insert: number; zig: number; zigzig: number; zigzag: number; done: number },
) {
  const id = engine.insertPlain(value);
  steps.push({ state: engine.snapshot(undefined, id), description: msg('viz.splay.insertLeaf', { value }), highlightLine: lines.insert });
  engine.splay(id, (label, description) => {
    const line = label === 'Zig' ? lines.zig : label === 'Zig-Zig' ? lines.zigzig : lines.zigzag;
    steps.push({ state: engine.snapshot(id), description, highlightLine: line });
  });
  steps.push({ state: engine.snapshot(undefined, id), description: msg('viz.splay.splayed', { value }), highlightLine: lines.done });
  return id;
}

/** Searches for `value` (plain BST search) then splays the last-visited node to the root. */
export function performSearch(
  engine: SplayEngine,
  steps: AlgorithmStep<TreeState>[],
  value: number,
  lines: { search: number; zig: number; zigzig: number; zigzag: number; done: number },
) {
  const id = engine.findLastVisited(value);
  if (!id) return null;
  const found = engine.nodes[id].value === value;
  steps.push({
    state: engine.snapshot(id),
    description: found
      ? msg('viz.splay.searchFound', { value })
      : msg('viz.splay.searchAbsent', { value, node: engine.nodes[id].value }),
    highlightLine: lines.search,
  });
  engine.splay(id, (label, description) => {
    const line = label === 'Zig' ? lines.zig : label === 'Zig-Zig' ? lines.zigzig : lines.zigzag;
    steps.push({ state: engine.snapshot(id), description, highlightLine: line });
  });
  steps.push({ state: engine.snapshot(undefined, id), description: msg(found ? 'viz.splay.splayedFound' : 'viz.splay.splayedNotFound', { value: engine.nodes[id].value }), highlightLine: lines.done });
  return id;
}
