import type { AlgorithmDef, AlgorithmStep } from '../../core/types';
import { GraphRenderer, type GraphState } from './GraphRenderer';
import { exampleNodes, neighborsOf } from './graphData';

const pseudocode = [
  'DijkstraSSSP(G, s, w):',
  '  initSSSP(G, s, w)   // dist[v]=∞, pred[v]=nil, dist[s]=0',
  '  Q = V',
  '  while Q not empty:',
  '    u = extractMin(Q)  // by dist',
  '    for each v in adj(u):',
  '      relax(G, u, v, w)',
  'relax(G, u, v, w):',
  '  if v.dist > u.dist + w(u,v):',
  '    v.dist = u.dist + w(u,v); v.pred = u',
];

function edgeKey(a: string, b: string): string {
  return [a, b].sort().join('-');
}

function generateSteps(source: string): AlgorithmStep<GraphState>[] {
  const dist: Record<string, number> = {};
  const pred: Record<string, string | null> = {};
  const visited = new Set<string>();
  for (const n of exampleNodes) {
    dist[n.id] = Infinity;
    pred[n.id] = null;
  }
  dist[source] = 0;

  const labelsOf = () =>
    Object.fromEntries(exampleNodes.map((n) => [n.id, dist[n.id] === Infinity ? '∞' : String(dist[n.id])]));
  const acceptedOf = () =>
    Object.entries(pred)
      .filter(([, p]) => p !== null)
      .map(([v, p]) => edgeKey(v, p as string));

  const steps: AlgorithmStep<GraphState>[] = [
    {
      state: { labels: labelsOf(), visited: [...visited] },
      description: `Initialize: dist[${source}]=0, all others ∞.`,
      highlightLine: 1,
    },
  ];

  while (visited.size < exampleNodes.length) {
    let u: string | null = null;
    let best = Infinity;
    for (const n of exampleNodes) {
      if (!visited.has(n.id) && dist[n.id] < best) {
        best = dist[n.id];
        u = n.id;
      }
    }
    if (u === null) break; // remaining nodes unreachable
    steps.push({
      state: { labels: labelsOf(), visited: [...visited], current: u, acceptedEdges: acceptedOf() },
      description: `Extract closest unvisited node: ${u} (dist=${dist[u]}).`,
      highlightLine: 4,
    });

    for (const { id: v, weight } of neighborsOf(u)) {
      if (visited.has(v)) continue;
      steps.push({
        state: { labels: labelsOf(), visited: [...visited], current: u, activeEdge: edgeKey(u, v), acceptedEdges: acceptedOf() },
        description: `Relax edge ${u}-${v} (weight ${weight}): dist[${u}]+${weight} vs dist[${v}]=${dist[v] === Infinity ? '∞' : dist[v]}.`,
        highlightLine: 6,
      });
      if (dist[u] + weight < dist[v]) {
        dist[v] = dist[u] + weight;
        pred[v] = u;
        steps.push({
          state: { labels: labelsOf(), visited: [...visited], current: u, activeEdge: edgeKey(u, v), acceptedEdges: acceptedOf() },
          description: `Improved: dist[${v}] = ${dist[v]}, pred[${v}] = ${u}.`,
          highlightLine: 9,
        });
      }
    }
    visited.add(u);
  }

  steps.push({
    state: { labels: labelsOf(), visited: [...visited], acceptedEdges: acceptedOf() },
    description: 'Done. Highlighted edges form the shortest-path tree from the source.',
    highlightLine: 0,
  });
  return steps;
}

export const dijkstra: AlgorithmDef<string, GraphState> = {
  id: 'dijkstra',
  title: "Dijkstra's Algorithm",
  topicId: 'shortest-paths',
  family: 'Graphs',
  pseudocode,
  defaultInput: 'A',
  generateSteps,
  Renderer: GraphRenderer,
};
