import { bubbleSort } from './algorithms/sorting/bubbleSort';
import { bstInsert } from './algorithms/trees/bstInsert';
import type { AnyAlgorithmDef } from './core/types';

export const algorithmRegistry: AnyAlgorithmDef[] = [bubbleSort, bstInsert];

export function getAlgorithm(id: string): AnyAlgorithmDef | undefined {
  return algorithmRegistry.find((a) => a.id === id);
}
