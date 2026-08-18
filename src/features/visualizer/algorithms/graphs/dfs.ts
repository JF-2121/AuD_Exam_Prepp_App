import type { AlgorithmDef, AlgorithmStep } from '../../core/types';
import { GraphRenderer, type GraphState } from './GraphRenderer';
import { exampleNodes, neighborsOf } from './graphData';

const pseudocode = [
  'DFS(G):',
  '  for each vertex u: color[u] = WHITE',
  '  time = 0',
  '  for each vertex u: if color[u]==WHITE: DFS-VISIT(u)',
  'DFS-VISIT(u):',
  '  color[u] = GRAY; time+=1; disc[u]=time',
  '  for each neighbor v of u:',
  '    if color[v]==WHITE: parent[v]=u; DFS-VISIT(v)',
  '  color[u] = BLACK; time+=1; finish[u]=time',
];

function edgeKey(a: string, b: string): string {
  return [a, b].sort().join('-');
}

function generateSteps(source: string): AlgorithmStep<GraphState>[] {
  const color: Record<string, 'white' | 'gray' | 'black'> = {};
  const disc: Record<string, number> = {};
  const finish: Record<string, number> = {};
  const parent: Record<string, string | null> = {};
  for (const n of exampleNodes) {
    color[n.id] = 'white';
    parent[n.id] = null;
  }
  let time = 0;

  const labelsOf = () =>
    Object.fromEntries(
      exampleNodes.map((n) => [
        n.id,
        finish[n.id] !== undefined ? `${disc[n.id]}/${finish[n.id]}` : disc[n.id] !== undefined ? `${disc[n.id]}/–` : '',
      ]),
    );
  const acceptedOf = () =>
    Object.entries(parent)
      .filter(([, p]) => p !== null)
      .map(([v, p]) => edgeKey(v, p as string));
  const visitedOf = () => exampleNodes.filter((n) => color[n.id] === 'black').map((n) => n.id);

  const steps: AlgorithmStep<GraphState>[] = [
    { state: { labels: labelsOf(), visited: [] }, description: 'All vertices start WHITE (undiscovered).', highlightLine: 1 },
  ];

  function visit(u: string) {
    color[u] = 'gray';
    time += 1;
    disc[u] = time;
    steps.push({
      state: { labels: labelsOf(), visited: visitedOf(), current: u, acceptedEdges: acceptedOf() },
      description: `Discover ${u}: disc[${u}]=${time}.`,
      highlightLine: 5,
    });

    for (const { id: v } of neighborsOf(u)) {
      steps.push({
        state: { labels: labelsOf(), visited: visitedOf(), current: u, activeEdge: edgeKey(u, v), acceptedEdges: acceptedOf() },
        description: `Examine edge ${u}-${v}: ${v} is ${color[v].toUpperCase()}.`,
        highlightLine: 7,
      });
      if (color[v] === 'white') {
        parent[v] = u;
        visit(v);
        steps.push({
          state: { labels: labelsOf(), visited: visitedOf(), current: u, acceptedEdges: acceptedOf() },
          description: `Back to ${u} after fully exploring ${v}.`,
          highlightLine: 7,
        });
      }
    }

    color[u] = 'black';
    time += 1;
    finish[u] = time;
    steps.push({
      state: { labels: labelsOf(), visited: visitedOf(), acceptedEdges: acceptedOf() },
      description: `${u} finished: finish[${u}]=${time}.`,
      highlightLine: 9,
    });
  }

  visit(source);
  const rest = exampleNodes.filter((n) => color[n.id] === 'white');
  for (const n of rest) {
    steps.push({
      state: { labels: labelsOf(), visited: visitedOf(), acceptedEdges: acceptedOf() },
      description: `${n.id} still WHITE and not reachable from ${source}: start a new DFS tree there.`,
      highlightLine: 3,
    });
    visit(n.id);
  }

  steps.push({
    state: { labels: labelsOf(), visited: visitedOf(), acceptedEdges: acceptedOf() },
    description: `DFS complete. Labels show disc/finish times; highlighted edges are the DFS tree${rest.length ? '(s)' : ''}.`,
    highlightLine: 0,
  });
  return steps;
}

export const dfs: AlgorithmDef<string, GraphState> = {
  id: 'dfs',
  title: 'Depth-First Search (DFS)',
  topicId: 'graphs-traversal',
  family: 'Graphs',
  pseudocode,
  defaultInput: 'A',
  generateSteps,
  Renderer: GraphRenderer,
};
