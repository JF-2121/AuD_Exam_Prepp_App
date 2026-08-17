import type { AlgorithmDef, AlgorithmStep } from '../../core/types';
import { GraphRenderer, type GraphState } from './GraphRenderer';
import { exampleEdges, exampleNodes } from './graphData';

const pseudocode = [
  'MSTKruskal(G, w):',
  '  A = ∅',
  '  for each v in V: set(v) = {v}',
  '  sort edges by weight ascending',
  '  for each {u,v} in E in that order:',
  '    if set(u) != set(v):',
  '      A = A ∪ {u,v}   // add edge to MST',
  '      union(u, v)     // merge the two sets',
  '  return A',
];

function edgeKey(a: string, b: string): string {
  return [a, b].sort().join('-');
}

function generateSteps(): AlgorithmStep<GraphState>[] {
  const parent: Record<string, string> = {};
  for (const n of exampleNodes) parent[n.id] = n.id;

  function find(x: string): string {
    while (parent[x] !== x) x = parent[x];
    return x;
  }

  const sorted = [...exampleEdges].sort((a, b) => a.weight - b.weight);
  const accepted: string[] = [];
  const rejected: string[] = [];

  const steps: AlgorithmStep<GraphState>[] = [
    {
      state: {},
      description: `Start with every node in its own set. Sort all ${sorted.length} edges by weight ascending.`,
      highlightLine: 3,
    },
  ];

  for (const e of sorted) {
    const key = edgeKey(e.from, e.to);
    const rootA = find(e.from);
    const rootB = find(e.to);
    steps.push({
      state: { activeEdge: key, acceptedEdges: [...accepted], rejectedEdges: [...rejected] },
      description: `Consider edge ${e.from}-${e.to} (weight ${e.weight}). set(${e.from})=${rootA}, set(${e.to})=${rootB}.`,
      highlightLine: 5,
    });
    if (rootA !== rootB) {
      accepted.push(key);
      parent[rootA] = rootB;
      steps.push({
        state: { acceptedEdges: [...accepted], rejectedEdges: [...rejected] },
        description: `Different sets → accept ${e.from}-${e.to} into the MST and merge the sets.`,
        highlightLine: 6,
      });
    } else {
      rejected.push(key);
      steps.push({
        state: { acceptedEdges: [...accepted], rejectedEdges: [...rejected] },
        description: `Same set already → ${e.from}-${e.to} would form a cycle. Reject.`,
        highlightLine: 5,
      });
    }
    if (accepted.length === exampleNodes.length - 1) break;
  }

  steps.push({
    state: { acceptedEdges: [...accepted], rejectedEdges: [...rejected] },
    description: `MST complete: ${accepted.length} edges connect all ${exampleNodes.length} nodes.`,
    highlightLine: 8,
  });
  return steps;
}

export const kruskal: AlgorithmDef<undefined, GraphState> = {
  id: 'kruskal',
  title: "Kruskal's Algorithm (MST)",
  topicId: 'minimum-spanning-trees',
  pseudocode,
  defaultInput: undefined,
  generateSteps,
  Renderer: GraphRenderer,
};
