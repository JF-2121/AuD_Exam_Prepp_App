import type { AlgorithmStep } from '../../core/types';

export interface BTreeNode {
  id: string;
  keys: number[];
  children: string[];
}

export interface BTreeState {
  nodes: Record<string, BTreeNode>;
  rootId: string | null;
  /** Node currently being examined/modified. */
  highlightId?: string;
  /** Node just created or freshly modified (split result, merge result, root after grow/shrink). */
  newId?: string;
}

interface Positioned {
  node: BTreeNode;
  x: number;
  y: number;
  width: number;
}

const CELL = 30;
const GAP_CELLS = 1;
const LEVEL_HEIGHT = 68;
const NODE_HEIGHT = 32;

function layout(state: BTreeState): { positioned: Positioned[]; totalWidth: number; totalHeight: number } {
  const positioned: Positioned[] = [];
  let cursor = 0;
  let maxDepth = 0;

  function visit(id: string, depth: number): number {
    const node = state.nodes[id];
    maxDepth = Math.max(maxDepth, depth);
    const width = Math.max(node.keys.length, 1) * CELL;
    if (node.children.length === 0) {
      const x = cursor * CELL;
      cursor += Math.max(node.keys.length, 1) + GAP_CELLS;
      positioned.push({ node, x, y: depth, width });
      return x;
    }
    const childXs = node.children.map((c) => visit(c, depth + 1));
    const first = childXs[0];
    const last = childXs[childXs.length - 1];
    const childWidths = node.children.map((c) => Math.max(state.nodes[c].keys.length, 1) * CELL);
    const center = (first + last + childWidths[childWidths.length - 1]) / 2 - width / 2;
    positioned.push({ node, x: center, y: depth, width });
    return center;
  }

  if (state.rootId) visit(state.rootId, 0);

  const totalWidth = Math.max(cursor * CELL, 200);
  const totalHeight = (maxDepth + 1) * LEVEL_HEIGHT + 20;
  return { positioned, totalWidth, totalHeight };
}

export function BTreeRenderer({ step }: { step: AlgorithmStep<BTreeState> }) {
  const { rootId, highlightId, newId } = step.state;
  if (!rootId || !step.state.nodes[rootId]) {
    return <div className="flex h-40 items-center justify-center text-[var(--color-text-dim)]">Empty tree</div>;
  }
  const { positioned, totalWidth, totalHeight } = layout(step.state);
  const byId = Object.fromEntries(positioned.map((p) => [p.node.id, p]));

  return (
    <svg width="100%" height={totalHeight} viewBox={`0 0 ${totalWidth} ${totalHeight}`} className="mx-auto block">
      {positioned.map((p) => {
        const py = p.y * LEVEL_HEIGHT + 20;
        const nSlots = p.node.children.length || 1;
        return p.node.children.map((childId, i) => {
          const child = byId[childId];
          if (!child) return null;
          const anchorX = p.x + (p.width * (i + 0.5)) / nSlots;
          const cy = child.y * LEVEL_HEIGHT + 20;
          const ccx = child.x + child.width / 2;
          return (
            <line
              key={`${p.node.id}-${childId}`}
              x1={anchorX}
              y1={py + NODE_HEIGHT}
              x2={ccx}
              y2={cy}
              stroke="var(--color-border)"
              strokeWidth={2}
            />
          );
        });
      })}
      {positioned.map((p) => {
        const py = p.y * LEVEL_HEIGHT + 20;
        const isHighlight = p.node.id === highlightId;
        const isNew = p.node.id === newId;
        let fill = 'var(--color-accent-fill)';
        let textColor = 'var(--color-on-accent-fill)';
        let stroke = 'var(--color-accent)';
        if (isNew) {
          fill = 'var(--color-good)';
          textColor = 'var(--color-ink)';
        } else if (isHighlight) {
          fill = 'var(--color-warn)';
          textColor = 'var(--color-ink)';
        }
        const cellW = p.width / p.node.keys.length;
        return (
          <g key={p.node.id}>
            <rect x={p.x} y={py} width={p.width} height={NODE_HEIGHT} rx={5} fill={fill} stroke={stroke} strokeWidth={1.5} />
            {p.node.keys.slice(1).map((_, i) => (
              <line
                key={i}
                x1={p.x + cellW * (i + 1)}
                y1={py}
                x2={p.x + cellW * (i + 1)}
                y2={py + NODE_HEIGHT}
                stroke={stroke}
                strokeWidth={1}
                opacity={0.5}
              />
            ))}
            {p.node.keys.map((k, i) => (
              <text
                key={i}
                x={p.x + cellW * (i + 0.5)}
                y={py + NODE_HEIGHT / 2 + 5}
                textAnchor="middle"
                fontSize={13}
                fontWeight={700}
                fill={textColor}
              >
                {k}
              </text>
            ))}
          </g>
        );
      })}
    </svg>
  );
}
