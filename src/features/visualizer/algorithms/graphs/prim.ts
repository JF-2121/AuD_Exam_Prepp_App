import type { AlgorithmDef, AlgorithmStep } from '../../core/types';
import { GraphRenderer, type GraphState } from './GraphRenderer';
import { exampleNodes, neighborsOf } from './graphData';

const pseudocode = [
  'Prim(G, s):',
  '  for each vertex v: key[v] = ∞',
  '  key[s] = 0',
  '  PQ = all vertices, keyed by key',
  '  while PQ not empty:',
  '    u = extractMin(PQ)   // by key',
  '    for each neighbor v of u with weight w(u,v):',
  '      if v in PQ and w(u,v) < key[v]:',
  '        key[v] = w(u,v); parent[v] = u',
];

function edgeKey(a: string, b: string): string {
  return [a, b].sort().join('-');
}

function generateSteps(source: string): AlgorithmStep<GraphState>[] {
  const key: Record<string, number> = {};
  const parent: Record<string, string | null> = {};
  const inTree = new Set<string>();
  for (const n of exampleNodes) {
    key[n.id] = Infinity;
    parent[n.id] = null;
  }
  key[source] = 0;

  const labelsOf = () => Object.fromEntries(exampleNodes.map((n) => [n.id, key[n.id] === Infinity ? '∞' : String(key[n.id])]));
  const acceptedOf = () =>
    Object.entries(parent)
      .filter(([, p]) => p !== null)
      .map(([v, p]) => edgeKey(v, p as string));

  const steps: AlgorithmStep<GraphState>[] = [
    {
      state: { labels: labelsOf(), visited: [] },
      description: `Start Prim's from ${source}: key[${source}]=0, every other key ∞.`,
      highlightLine: 2,
    },
  ];

  while (inTree.size < exampleNodes.length) {
    let u: string | null = null;
    let best = Infinity;
    for (const n of exampleNodes) {
      if (!inTree.has(n.id) && key[n.id] < best) {
        best = key[n.id];
        u = n.id;
      }
    }
    if (u === null) break; // remaining nodes unreachable
    steps.push({
      state: { labels: labelsOf(), visited: [...inTree], current: u, acceptedEdges: acceptedOf() },
      description: `Extract cheapest vertex to attach: ${u} (key=${key[u]}).`,
      highlightLine: 5,
    });
    inTree.add(u);

    for (const { id: v, weight } of neighborsOf(u)) {
      if (inTree.has(v)) continue;
      steps.push({
        state: { labels: labelsOf(), visited: [...inTree], current: u, activeEdge: edgeKey(u, v), acceptedEdges: acceptedOf() },
        description: `Edge ${u}-${v} (weight ${weight}) vs key[${v}]=${key[v] === Infinity ? '∞' : key[v]}.`,
        highlightLine: 7,
      });
      if (weight < key[v]) {
        key[v] = weight;
        parent[v] = u;
        steps.push({
          state: { labels: labelsOf(), visited: [...inTree], current: u, activeEdge: edgeKey(u, v), acceptedEdges: acceptedOf() },
          description: `Cheaper connection found: key[${v}] = ${weight}, parent[${v}] = ${u}.`,
          highlightLine: 8,
        });
      }
    }
  }

  steps.push({
    state: { labels: labelsOf(), visited: [...inTree], acceptedEdges: acceptedOf() },
    description: 'Done. Highlighted edges form the minimum spanning tree grown from the source.',
    highlightLine: 0,
  });
  return steps;
}

export const prim: AlgorithmDef<string, GraphState> = {
  id: 'prim',
  title: "Prim's Algorithm (MST)",
  topicId: 'minimum-spanning-trees',
  family: 'Graphs',
  pseudocode,
  defaultInput: 'A',
  generateSteps,
  Renderer: GraphRenderer,
};
