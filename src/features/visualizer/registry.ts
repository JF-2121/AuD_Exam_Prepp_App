import { bubbleSort } from './algorithms/sorting/bubbleSort';
import { insertionSort } from './algorithms/sorting/insertionSort';
import { selectionSort } from './algorithms/sorting/selectionSort';
import { mergeSort } from './algorithms/sorting/mergeSort';
import { quickSort } from './algorithms/sorting/quickSort';
import { bstInsert } from './algorithms/trees/bstInsert';
import { bstDelete } from './algorithms/trees/bstDelete';
import { rbtInsert } from './algorithms/trees/rbtInsert';
import { rbtDelete } from './algorithms/trees/rbtDelete';
import { avlInsert } from './algorithms/trees/avlInsert';
import { avlDelete } from './algorithms/trees/avlDelete';
import { dijkstra } from './algorithms/graphs/dijkstra';
import { kruskal } from './algorithms/graphs/kruskal';
import { prim } from './algorithms/graphs/prim';
import { bfs } from './algorithms/graphs/bfs';
import { dfs } from './algorithms/graphs/dfs';
import { bellmanFord } from './algorithms/graphs/bellmanFord';
import type { AlgorithmFamily, AnyAlgorithmDef } from './core/types';

export const algorithmRegistry: AnyAlgorithmDef[] = [
  insertionSort,
  bubbleSort,
  selectionSort,
  mergeSort,
  quickSort,
  bstInsert,
  bstDelete,
  rbtInsert,
  rbtDelete,
  avlInsert,
  avlDelete,
  bfs,
  dfs,
  dijkstra,
  bellmanFord,
  kruskal,
  prim,
];

export const FAMILY_ORDER: AlgorithmFamily[] = ['Sorting', 'Trees', 'Graphs'];

export function getAlgorithm(id: string): AnyAlgorithmDef | undefined {
  return algorithmRegistry.find((a) => a.id === id);
}
