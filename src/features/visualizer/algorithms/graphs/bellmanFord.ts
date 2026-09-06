import { msg, type AlgorithmDef, type AlgorithmStep } from '../../core/types';
import { GraphRenderer, type GraphState } from './GraphRenderer';
import { exampleEdges, exampleNodeIds, exampleNodes } from './graphData';
import { only, oneOf } from '../../core/inputSchema';

const pseudocode = [
  'BellmanFord(G, s):',
  '  for each vertex v: dist[v] = ∞',
  '  dist[s] = 0',
  '  repeat (V-1) times:',
  '    for each edge (u,v) weight w:',
  '      if dist[u]+w < dist[v]: dist[v]=dist[u]+w; pred[v]=u',
  '  for each edge (u,v) weight w:   // negative-cycle check',
  '    if dist[u]+w < dist[v]: report "negative cycle"',
];

function edgeKey(a: string, b: string): string {
  return [a, b].sort().join('-');
}

function generateSteps(source: string): AlgorithmStep<GraphState>[] {
  const dist: Record<string, number> = {};
  const pred: Record<string, string | null> = {};
  for (const n of exampleNodes) {
    dist[n.id] = Infinity;
    pred[n.id] = null;
  }
  dist[source] = 0;

  const labelsOf = () => Object.fromEntries(exampleNodes.map((n) => [n.id, dist[n.id] === Infinity ? '∞' : String(dist[n.id])]));
  const acceptedOf = () =>
    Object.entries(pred)
      .filter(([, p]) => p !== null)
      .map(([v, p]) => edgeKey(v, p as string));

  // This example graph is undirected, so relaxing "(u,v) with weight w" means trying it in both directions.
  const directedPairs = exampleEdges.flatMap((e) => [
    { from: e.from, to: e.to, weight: e.weight },
    { from: e.to, to: e.from, weight: e.weight },
  ]);

  const steps: AlgorithmStep<GraphState>[] = [
    {
      state: { labels: labelsOf(), visited: [] },
      description: msg('viz.bf.init', { source }),
      highlightLine: 2,
    },
  ];

  const V = exampleNodes.length;
  for (let pass = 1; pass <= V - 1; pass++) {
    let changedInPass = false;
    steps.push({
      state: { labels: labelsOf(), visited: [], acceptedEdges: acceptedOf() },
      description: msg('viz.bf.pass', { pass, total: V - 1 }),
      highlightLine: 4,
    });
    for (const { from: u, to: v, weight } of directedPairs) {
      steps.push({
        state: { labels: labelsOf(), visited: [], current: u, activeEdge: edgeKey(u, v), acceptedEdges: acceptedOf() },
        description: msg('viz.bf.relax', { u, v, weight, distV: dist[v] === Infinity ? '∞' : dist[v] }),
        highlightLine: 5,
      });
      if (dist[u] !== Infinity && dist[u] + weight < dist[v]) {
        dist[v] = dist[u] + weight;
        pred[v] = u;
        changedInPass = true;
        steps.push({
          state: { labels: labelsOf(), visited: [], current: u, activeEdge: edgeKey(u, v), acceptedEdges: acceptedOf() },
          description: msg('viz.dij.improved', { v, dist: dist[v], u }),
          highlightLine: 5,
        });
      }
    }
    if (!changedInPass) {
      steps.push({
        state: { labels: labelsOf(), visited: [], acceptedEdges: acceptedOf() },
        description: msg('viz.bf.converged', { pass }),
        highlightLine: 3,
      });
      break;
    }
  }

  let negativeCycle = false;
  for (const { from: u, to: v, weight } of directedPairs) {
    if (dist[u] !== Infinity && dist[u] + weight < dist[v]) negativeCycle = true;
  }

  steps.push({
    state: { labels: labelsOf(), visited: [], acceptedEdges: acceptedOf() },
    description: msg(negativeCycle ? 'viz.bf.negativeCycle' : 'viz.bf.noNegativeCycle'),
    highlightLine: 6,
  });
  return steps;
}

export const bellmanFord: AlgorithmDef<string, GraphState> = {
  id: 'bellman-ford',
  title: 'Bellman-Ford Algorithm',
  topicId: 'shortest-paths',
  family: 'Graphs',
  pseudocode,
  defaultInput: 'A',
  generateSteps,
  Renderer: GraphRenderer,
  validateInput: only(oneOf(exampleNodeIds), 'source'),
  inputHint: 'viz.hint.graphSource',
  extractResult: (state) => state.labels,
};
