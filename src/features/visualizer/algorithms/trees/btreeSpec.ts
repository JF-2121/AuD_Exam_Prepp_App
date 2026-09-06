import { msg } from '../../core/types';
import { MAX_LIST, isPlainObject, type InputIssue } from '../../core/inputSchema';

/**
 * A B-Tree written out by hand: a node is its sorted key list plus, unless it is a leaf, one more
 * child than it has keys.
 */
export interface BTreeSpec {
  keys: number[];
  children?: BTreeSpec[];
}

/**
 * The minimum degree `t` the editor accepts. `t = 1` is not a B-Tree (a node would be allowed
 * `t - 1 = 0` keys), and the renderer stops being readable well before `t = 8`.
 */
export const MIN_DEGREE = 2;
export const MAX_DEGREE = 8;

function isFiniteNumber(value: unknown): value is number {
  return typeof value === 'number' && Number.isFinite(value);
}

/**
 * Inserts `keys` one at a time into an empty tree of degree `t`, using the same preemptive-split
 * insert the visualizer animates. This is what lets `initial` be written as a flat key list —
 * "a B-Tree holding 5, 20 and 25" — instead of spelling out the node structure, which is how exam
 * exercises state their starting tree.
 */
export function buildBTreeFromKeys(t: number, keys: number[]): BTreeSpec {
  const maxKeys = 2 * t - 1;
  let root: BTreeSpec = { keys: [], children: [] };

  function splitChild(parent: BTreeSpec, i: number) {
    const children = parent.children as BTreeSpec[];
    const child = children[i];
    const grandkids = child.children ?? [];
    const right: BTreeSpec = {
      keys: child.keys.slice(t),
      children: grandkids.length ? grandkids.slice(t) : [],
    };
    parent.keys.splice(i, 0, child.keys[t - 1]);
    child.keys = child.keys.slice(0, t - 1);
    child.children = grandkids.length ? grandkids.slice(0, t) : [];
    children.splice(i + 1, 0, right);
  }

  for (const key of keys) {
    if (root.keys.length === maxKeys) {
      root = { keys: [], children: [root] };
      splitChild(root, 0);
    }
    let node = root;
    while ((node.children ?? []).length > 0) {
      const children = node.children as BTreeSpec[];
      let i = 0;
      while (i < node.keys.length && key > node.keys[i]) i += 1;
      if (children[i].keys.length === maxKeys) {
        splitChild(node, i);
        if (key > node.keys[i]) i += 1;
      }
      node = children[i];
    }
    let pos = 0;
    while (pos < node.keys.length && key > node.keys[pos]) pos += 1;
    node.keys.splice(pos, 0, key);
  }
  return root;
}

/** Total number of keys held anywhere in the spec. */
function countKeys(spec: BTreeSpec): number {
  return spec.keys.length + (spec.children ?? []).reduce((sum, c) => sum + countKeys(c), 0);
}

/**
 * Checks that a hand-written `initial` really is a B-Tree of degree `t`, and reports the first
 * thing that isn't. The structural rules are exactly the ones `generateSteps` assumes: without
 * them a node can end up with fewer children than it has key slots, and the descent walks off the
 * end of `children` into `undefined`.
 *
 * The one rule deliberately *not* enforced is the minimum key count of the root, which is allowed
 * to be a single key (or none, for an empty tree).
 */
export function validateBTreeSpec(spec: unknown, t: number): InputIssue | null {
  const maxKeys = 2 * t - 1;
  const minKeys = t - 1;
  const leafDepths = new Set<number>();

  function walk(node: unknown, depth: number, isRoot: boolean, low: number | null, high: number | null): InputIssue | null {
    if (!isPlainObject(node)) return msg('viz.input.btree.node');
    const keys = node.keys;
    if (!Array.isArray(keys) || !keys.every(isFiniteNumber)) return msg('viz.input.numberList', { field: 'keys' });

    for (let i = 1; i < keys.length; i++) {
      if (keys[i] <= keys[i - 1]) return msg('viz.input.btree.keyOrder', { keys: keys.join(', ') });
    }
    if (keys.length > maxKeys) {
      return msg('viz.input.btree.tooManyKeys', { keys: keys.join(', '), count: keys.length, max: maxKeys, t });
    }
    if (!isRoot && keys.length < minKeys) {
      return msg('viz.input.btree.tooFewKeys', { keys: keys.join(', ') || '—', count: keys.length, min: minKeys, t });
    }
    if (isRoot && keys.length === 0 && (node.children as unknown[] | undefined)?.length) {
      return msg('viz.input.btree.emptyRoot');
    }
    if (low !== null && keys.length && keys[0] <= low) {
      return msg('viz.input.btree.keyRange', { key: keys[0], low, high: high === null ? '+∞' : high });
    }
    if (high !== null && keys.length && keys[keys.length - 1] >= high) {
      return msg('viz.input.btree.keyRange', { key: keys[keys.length - 1], low: low === null ? '-∞' : low, high });
    }

    const children = node.children;
    if (children === undefined || (Array.isArray(children) && children.length === 0)) {
      leafDepths.add(depth);
      return null;
    }
    if (!Array.isArray(children) || children.length !== keys.length + 1) {
      return msg('viz.input.btree.childCount', {
        keys: keys.join(', ') || '—',
        keyCount: keys.length,
        expected: keys.length + 1,
        actual: Array.isArray(children) ? children.length : 0,
      });
    }
    for (let i = 0; i < children.length; i++) {
      const childLow = i === 0 ? low : keys[i - 1];
      const childHigh = i === keys.length ? high : keys[i];
      const issue = walk(children[i], depth + 1, false, childLow, childHigh);
      if (issue) return issue;
    }
    return null;
  }

  const issue = walk(spec, 0, true, null, null);
  if (issue) return issue;
  if (leafDepths.size > 1) return msg('viz.input.btree.leafDepth', { depths: [...leafDepths].sort((a, b) => a - b).join(', ') });
  if (countKeys(spec as BTreeSpec) > MAX_LIST) return msg('viz.input.tooLong', { field: 'initial', max: MAX_LIST });
  return null;
}

/**
 * Accepts `initial` in either form — a spelled-out node structure, or a flat key list that is
 * built into one — and returns the spec `generateSteps` should run on.
 */
export function normalizeBTreeSpec(initial: unknown, t: number): BTreeSpec {
  if (Array.isArray(initial)) return buildBTreeFromKeys(t, initial as number[]);
  return initial as BTreeSpec;
}

/** Whole-input validator shared by B-Tree insert and delete; `opsField` is `insertions`/`deletions`. */
export function validateBTreeInput(input: unknown, opsField: 'insertions' | 'deletions'): InputIssue | null {
  if (!isPlainObject(input)) return msg('viz.input.expectedObject', { fields: `t, initial, ${opsField}` });

  const t = input.t;
  if (!isFiniteNumber(t) || !Number.isInteger(t) || t < MIN_DEGREE || t > MAX_DEGREE) {
    return msg('viz.input.btree.degree', { min: MIN_DEGREE, max: MAX_DEGREE });
  }

  const ops = input[opsField];
  if (!Array.isArray(ops) || !ops.every(isFiniteNumber)) return msg('viz.input.numberList', { field: opsField });
  if (ops.length > MAX_LIST) return msg('viz.input.tooLong', { field: opsField, max: MAX_LIST });

  const initial = input.initial;
  if (initial === undefined) return msg('viz.input.missingField', { field: 'initial', fields: `t, initial, ${opsField}` });
  if (Array.isArray(initial)) {
    if (!initial.every(isFiniteNumber)) return msg('viz.input.numberList', { field: 'initial' });
    if (initial.length > MAX_LIST) return msg('viz.input.tooLong', { field: 'initial', max: MAX_LIST });
    return null;
  }
  return validateBTreeSpec(initial, t);
}
