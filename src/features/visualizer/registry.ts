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
import { heapInsert } from './algorithms/trees/heapInsert';
import { heapDelete } from './algorithms/trees/heapExtract';
import { splayInsert } from './algorithms/trees/splayInsert';
import { splayDelete } from './algorithms/trees/splayDelete';
import { btreeInsert } from './algorithms/trees/btreeInsert';
import { btreeDelete } from './algorithms/trees/btreeDelete';
import { dijkstra } from './algorithms/graphs/dijkstra';
import { kruskal } from './algorithms/graphs/kruskal';
import { prim } from './algorithms/graphs/prim';
import { bfs } from './algorithms/graphs/bfs';
import { dfs } from './algorithms/graphs/dfs';
import { bellmanFord } from './algorithms/graphs/bellmanFord';
import { naiveStringMatch } from './algorithms/strings/naiveStringMatch';
import { rabinKarpMatch } from './algorithms/strings/rabinKarpMatch';
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
  splayInsert,
  splayDelete,
  btreeInsert,
  btreeDelete,
  heapInsert,
  heapDelete,
  bfs,
  dfs,
  dijkstra,
  bellmanFord,
  kruskal,
  prim,
  naiveStringMatch,
  rabinKarpMatch,
];

export const FAMILY_ORDER: AlgorithmFamily[] = ['Sorting', 'Trees', 'Graphs', 'Strings'];

export function getAlgorithm(id: string): AnyAlgorithmDef | undefined {
  return algorithmRegistry.find((a) => a.id === id);
}
