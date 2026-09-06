import { msg, type AlgorithmDef, type AlgorithmStep } from '../../core/types';
import { GraphRenderer, type GraphState } from './GraphRenderer';
import { exampleNodes, neighborsOf } from './graphData';

const pseudocode = [
  'BFS(G, s):',
  '  for each vertex u: color[u] = WHITE, dist[u] = ∞',
  '  color[s] = GRAY; dist[s] = 0; enqueue(Q, s)',
  '  while Q not empty:',
  '    u = dequeue(Q)',
  '    for each neighbor v of u:',
  '      if color[v] == WHITE:',
  '        color[v] = GRAY; dist[v] = dist[u] + 1; parent[v] = u',
  '        enqueue(Q, v)',
  '    color[u] = BLACK',
];

function edgeKey(a: string, b: string): string {
  return [a, b].sort().join('-');
}

function generateSteps(source: string): AlgorithmStep<GraphState>[] {
  const dist: Record<string, number> = {};
  const parent: Record<string, string | null> = {};
  const visited = new Set<string>(); // BLACK (finished)
  const discovered = new Set<string>(); // GRAY or BLACK
  for (const n of exampleNodes) {
    dist[n.id] = Infinity;
    parent[n.id] = null;
  }

  const labelsOf = () => Object.fromEntries(exampleNodes.map((n) => [n.id, dist[n.id] === Infinity ? '∞' : String(dist[n.id])]));
  const acceptedOf = () =>
    Object.entries(parent)
      .filter(([, p]) => p !== null)
      .map(([v, p]) => edgeKey(v, p as string));

  const queue: string[] = [source];
  discovered.add(source);
  dist[source] = 0;

  const steps: AlgorithmStep<GraphState>[] = [
    {
      state: { labels: labelsOf(), visited: [], current: source },
      description: msg('viz.bfs.start', { source }),
      highlightLine: 2,
    },
  ];

  while (queue.length > 0) {
    const u = queue.shift()!;
    steps.push({
      state: { labels: labelsOf(), visited: [...visited], current: u, acceptedEdges: acceptedOf() },
      description: msg('viz.bfs.dequeue', { u, dist: dist[u] }),
      highlightLine: 4,
    });

    for (const { id: v } of neighborsOf(u)) {
      steps.push({
        state: { labels: labelsOf(), visited: [...visited], current: u, activeEdge: edgeKey(u, v), acceptedEdges: acceptedOf() },
        description: msg(discovered.has(v) ? 'viz.bfs.lookKnown' : 'viz.bfs.lookNew', { v }),
        highlightLine: 6,
      });
      if (!discovered.has(v)) {
        discovered.add(v);
        dist[v] = dist[u] + 1;
        parent[v] = u;
        queue.push(v);
        steps.push({
          state: { labels: labelsOf(), visited: [...visited], current: u, activeEdge: edgeKey(u, v), acceptedEdges: acceptedOf() },
          description: msg('viz.bfs.discover', { v, dist: dist[v], u }),
          highlightLine: 7,
        });
      }
    }
    visited.add(u);
    steps.push({
      state: { labels: labelsOf(), visited: [...visited], acceptedEdges: acceptedOf() },
      description: msg('viz.bfs.finished', { u }),
      highlightLine: 9,
    });
  }

  const unreached = exampleNodes.filter((n) => dist[n.id] === Infinity);
  steps.push({
    state: { labels: labelsOf(), visited: [...visited], acceptedEdges: acceptedOf() },
    description:
      unreached.length === 0
        ? msg('viz.bfs.done')
        : msg('viz.bfs.doneUnreachable', { nodes: unreached.map((n) => n.id).join(', '), source }),
    highlightLine: 0,
  });
  return steps;
}

export const bfs: AlgorithmDef<string, GraphState> = {
  id: 'bfs',
  title: 'Breadth-First Search (BFS)',
  topicId: 'graphs-traversal',
  family: 'Graphs',
  pseudocode,
  defaultInput: 'A',
  generateSteps,
  Renderer: GraphRenderer,
  extractResult: (state) => state.labels,
};
