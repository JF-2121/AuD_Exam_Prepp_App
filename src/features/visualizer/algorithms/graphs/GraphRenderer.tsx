import type { AlgorithmStep } from '../../core/types';
import { exampleEdges, exampleNodes } from './graphData';

export interface GraphState {
  /** Node currently being processed/extracted. */
  current?: string;
  /** Nodes considered finalized/visited. */
  visited?: string[];
  /** Per-node running value shown under the label (Dijkstra distance, Prim key, ...). Use '∞' for infinity. */
  labels?: Record<string, string>;
  /** Edges to draw highlighted/accepted (e.g. shortest-path tree, MST-so-far), as "from-to" pairs (order-insensitive). */
  acceptedEdges?: string[];
  /** A single edge currently being considered/relaxed, drawn in the "active" color. */
  activeEdge?: string;
  /** Edges explicitly rejected (e.g. Kruskal cycle rejection), drawn dashed/muted. */
  rejectedEdges?: string[];
}

function edgeKey(a: string, b: string): string {
  return [a, b].sort().join('-');
}

export function GraphRenderer({ step }: { step: AlgorithmStep<GraphState> }) {
  const { current, visited = [], labels = {}, acceptedEdges = [], activeEdge, rejectedEdges = [] } = step.state;
  const nodeById = Object.fromEntries(exampleNodes.map((n) => [n.id, n]));
  const width = 440;
  const height = 300;

  return (
    <svg width="100%" height={height} viewBox={`0 0 ${width} ${height}`} className="mx-auto block">
      {exampleEdges.map((e) => {
        const a = nodeById[e.from];
        const b = nodeById[e.to];
        const key = edgeKey(e.from, e.to);
        const isAccepted = acceptedEdges.includes(key);
        const isActive = activeEdge === key;
        const isRejected = rejectedEdges.includes(key);
        let stroke = 'var(--color-border-strong)';
        let strokeWidth = 1.5;
        let dash: string | undefined;
        if (isRejected) {
          stroke = 'var(--color-bad)';
          dash = '4 3';
        } else if (isActive) {
          stroke = 'var(--color-warn)';
          strokeWidth = 2.5;
        } else if (isAccepted) {
          stroke = 'var(--color-good)';
          strokeWidth = 2.5;
        }
        const mx = (a.x + b.x) / 2;
        const my = (a.y + b.y) / 2;
        return (
          <g key={key}>
            <line x1={a.x} y1={a.y} x2={b.x} y2={b.y} stroke={stroke} strokeWidth={strokeWidth} strokeDasharray={dash} />
            <rect x={mx - 9} y={my - 8} width={18} height={14} fill="var(--color-surface)" opacity={0.9} />
            <text x={mx} y={my + 3} textAnchor="middle" fontSize={11} fill="var(--color-text-dim)">
              {e.weight}
            </text>
          </g>
        );
      })}
      {exampleNodes.map((n) => {
        const isCurrent = current === n.id;
        const isVisited = visited.includes(n.id);
        const fill = isCurrent ? 'var(--color-warn)' : isVisited ? 'var(--color-good)' : 'var(--color-accent)';
        const label = labels[n.id];
        return (
          <g key={n.id}>
            <circle cx={n.x} cy={n.y} r={17} fill={fill} />
            <text x={n.x} y={n.y + 4} textAnchor="middle" fontSize={12} fontWeight={600} fill="#0b0b10">
              {n.label}
            </text>
            {label !== undefined && (
              <text x={n.x} y={n.y - 24} textAnchor="middle" fontSize={11} fill="var(--color-text-h)">
                {label}
              </text>
            )}
          </g>
        );
      })}
    </svg>
  );
}
