import { Bar, BarChart, CartesianGrid, Cell, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { Link } from 'react-router-dom';
import type { TopicMastery } from '../../lib/mastery';

function colorFor(score: number): string {
  if (score < 40) return '#f87171';
  if (score < 70) return '#fbbf24';
  return '#4ade80';
}

export function MasteryHeatmap({ mastery }: { mastery: TopicMastery[] }) {
  if (mastery.length === 0) {
    return <p className="text-[var(--color-text-dim)]">No topics yet.</p>;
  }

  return (
    <div>
      <div style={{ width: '100%', height: Math.max(mastery.length * 40, 120) }}>
        <ResponsiveContainer>
          <BarChart data={mastery} layout="vertical" margin={{ left: 24, right: 24 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#2a2e38" horizontal={false} />
            <XAxis type="number" domain={[0, 100]} stroke="#8b909c" fontSize={12} />
            <YAxis type="category" dataKey="title" stroke="#8b909c" fontSize={12} width={150} />
            <Tooltip
              contentStyle={{ background: '#171a21', border: '1px solid #2a2e38', color: '#d5d8e0' }}
              formatter={(value) => [`${value}%`, 'Mastery']}
            />
            <Bar dataKey="score" radius={4}>
              {mastery.map((m) => (
                <Cell key={m.topicId} fill={colorFor(m.score)} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
      <ul className="mt-4 flex flex-col gap-1 text-sm">
        {mastery.map((m) => (
          <li key={m.topicId} className="flex items-center justify-between rounded px-2 py-1 hover:bg-[var(--color-surface-hover)]">
            <Link to={`/topics/${m.topicId}`} className="text-[var(--color-text)] hover:text-[var(--color-accent)]">
              {m.title}
            </Link>
            <span className="text-[var(--color-text-dim)]">{m.score}%</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
