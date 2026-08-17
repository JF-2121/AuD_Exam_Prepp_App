export interface GraphNodeDef {
  id: string;
  label: string;
  x: number;
  y: number;
}

export interface GraphEdgeDef {
  from: string;
  to: string;
  weight: number;
}

// Shared small example graph (undirected, weighted) used by Dijkstra, Kruskal, and Prim
// so all three algorithms are directly comparable on the same instance.
export const exampleNodes: GraphNodeDef[] = [
  { id: 'A', label: 'A', x: 60, y: 150 },
  { id: 'B', label: 'B', x: 170, y: 55 },
  { id: 'C', label: 'C', x: 170, y: 245 },
  { id: 'D', label: 'D', x: 280, y: 150 },
  { id: 'E', label: 'E', x: 390, y: 55 },
  { id: 'F', label: 'F', x: 390, y: 245 },
];

export const exampleEdges: GraphEdgeDef[] = [
  { from: 'A', to: 'B', weight: 4 },
  { from: 'A', to: 'C', weight: 2 },
  { from: 'B', to: 'C', weight: 1 },
  { from: 'B', to: 'D', weight: 5 },
  { from: 'C', to: 'D', weight: 8 },
  { from: 'C', to: 'E', weight: 10 },
  { from: 'D', to: 'E', weight: 2 },
  { from: 'D', to: 'F', weight: 6 },
  { from: 'E', to: 'F', weight: 3 },
];

export function neighborsOf(nodeId: string): { id: string; weight: number }[] {
  const result: { id: string; weight: number }[] = [];
  for (const e of exampleEdges) {
    if (e.from === nodeId) result.push({ id: e.to, weight: e.weight });
    else if (e.to === nodeId) result.push({ id: e.from, weight: e.weight });
  }
  return result;
}
