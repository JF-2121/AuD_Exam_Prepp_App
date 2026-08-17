import { bubbleSort } from './algorithms/sorting/bubbleSort';
import { insertionSort } from './algorithms/sorting/insertionSort';
import { selectionSort } from './algorithms/sorting/selectionSort';
import { mergeSort } from './algorithms/sorting/mergeSort';
import { quickSort } from './algorithms/sorting/quickSort';
import { bstInsert } from './algorithms/trees/bstInsert';
import { rbtInsert } from './algorithms/trees/rbtInsert';
import { dijkstra } from './algorithms/graphs/dijkstra';
import { kruskal } from './algorithms/graphs/kruskal';
import type { AnyAlgorithmDef } from './core/types';

export const algorithmRegistry: AnyAlgorithmDef[] = [
  insertionSort,
  bubbleSort,
  selectionSort,
  mergeSort,
  quickSort,
  bstInsert,
  rbtInsert,
  dijkstra,
  kruskal,
];

export function getAlgorithm(id: string): AnyAlgorithmDef | undefined {
  return algorithmRegistry.find((a) => a.id === id);
}
