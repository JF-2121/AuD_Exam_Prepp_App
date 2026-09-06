import { msg, type AlgorithmDef, type AlgorithmStep } from '../../core/types';
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
      description: msg('viz.dij.init', { source }),
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
      description: msg('viz.dij.extract', { u, dist: dist[u] }),
      highlightLine: 4,
    });

    for (const { id: v, weight } of neighborsOf(u)) {
      if (visited.has(v)) continue;
      steps.push({
        state: { labels: labelsOf(), visited: [...visited], current: u, activeEdge: edgeKey(u, v), acceptedEdges: acceptedOf() },
        description: msg('viz.dij.relax', { u, v, weight, distV: dist[v] === Infinity ? '∞' : dist[v] }),
        highlightLine: 6,
      });
      if (dist[u] + weight < dist[v]) {
        dist[v] = dist[u] + weight;
        pred[v] = u;
        steps.push({
          state: { labels: labelsOf(), visited: [...visited], current: u, activeEdge: edgeKey(u, v), acceptedEdges: acceptedOf() },
          description: msg('viz.dij.improved', { v, dist: dist[v], u }),
          highlightLine: 9,
        });
      }
    }
    visited.add(u);
  }

  steps.push({
    state: { labels: labelsOf(), visited: [...visited], acceptedEdges: acceptedOf() },
    description: msg('viz.dij.done'),
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
  extractResult: (state) => state.labels,
};
