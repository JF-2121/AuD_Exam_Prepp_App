import type { AlgorithmStep } from '../../core/types';

export interface TreeNode {
  id: string;
  value: number;
  left: string | null;
  right: string | null;
  /** Present for Red-Black trees; absent for plain BSTs, which fall back to the default accent color. */
  color?: 'red' | 'black';
}

export interface TreeState {
  nodes: Record<string, TreeNode>;
  rootId: string | null;
  highlightId?: string;
  newId?: string;
}

interface Positioned extends TreeNode {
  x: number;
  y: number;
}

function layout(state: TreeState): Positioned[] {
  const result: Positioned[] = [];
  let cursor = 0;

  function visit(id: string | null, depth: number) {
    if (!id) return;
    const node = state.nodes[id];
    visit(node.left, depth + 1);
    const x = cursor;
    cursor += 1;
    result.push({ ...node, x, y: depth });
    visit(node.right, depth + 1);
  }

  visit(state.rootId, 0);
  return result;
}

export function TreeRenderer({ step }: { step: AlgorithmStep<TreeState> }) {
  const { rootId, highlightId, newId } = step.state;
  const positioned = layout(step.state);
  const byId = Object.fromEntries(positioned.map((n) => [n.id, n]));
  const xSpacing = 56;
  const ySpacing = 56;
  const width = Math.max(positioned.length * xSpacing, 200);
  const height = (Math.max(0, ...positioned.map((n) => n.y)) + 1) * ySpacing + 30;

  if (!rootId) {
    return <div className="flex h-56 items-center justify-center text-[var(--color-text-dim)]">Empty tree</div>;
  }

  return (
    <svg width="100%" height={height} viewBox={`0 0 ${width} ${height}`} className="mx-auto block">
      {positioned.map((node) => {
        const cx = node.x * xSpacing + xSpacing / 2;
        const cy = node.y * ySpacing + 24;
        return [node.left, node.right].map((childId) => {
          if (!childId) return null;
          const child = byId[childId];
          const ccx = child.x * xSpacing + xSpacing / 2;
          const ccy = child.y * ySpacing + 24;
          return (
            <line
              key={`${node.id}-${childId}`}
              x1={cx}
              y1={cy}
              x2={ccx}
              y2={ccy}
              stroke="var(--color-border)"
              strokeWidth={2}
            />
          );
        });
      })}
      {positioned.map((node) => {
        const cx = node.x * xSpacing + xSpacing / 2;
        const cy = node.y * ySpacing + 24;
        const isHighlight = node.id === highlightId;
        const isNew = node.id === newId;
        let fill = 'var(--color-accent)';
        let textColor = '#0b0b10';
        if (node.color === 'red') {
          fill = '#dc2626';
          textColor = '#fef2f2';
        } else if (node.color === 'black') {
          fill = '#3f3f46';
          textColor = '#f4f4f5';
        }
        if (isNew) {
          fill = 'var(--color-good)';
          textColor = '#0b0b10';
        } else if (isHighlight) {
          fill = 'var(--color-warn)';
          textColor = '#0b0b10';
        }
        return (
          <g key={node.id}>
            <circle cx={cx} cy={cy} r={18} fill={fill} stroke={node.color ? 'var(--color-border-strong)' : 'none'} strokeWidth={1.5} />
            <text x={cx} y={cy + 5} textAnchor="middle" fontSize={13} fill={textColor}>
              {node.value}
            </text>
          </g>
        );
      })}
    </svg>
  );
}
