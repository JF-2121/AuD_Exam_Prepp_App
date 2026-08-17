import { Bar, BarChart, CartesianGrid, Cell, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { Link } from 'react-router-dom';
import { ListChecks, SquareStack, Target } from 'lucide-react';
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

  const weakest = mastery.slice(0, 5);

  return (
    <div className="flex flex-col gap-6 lg:flex-row">
      <div className="card min-w-0 flex-1 p-5">
        <h2 className="mb-4 text-sm font-semibold text-[var(--color-text-h)]">Mastery by topic</h2>
        <div style={{ width: '100%', height: Math.max(mastery.length * 32, 120) }}>
          <ResponsiveContainer>
            <BarChart data={mastery} layout="vertical" margin={{ left: 24, right: 24 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#27272a" horizontal={false} />
              <XAxis type="number" domain={[0, 100]} stroke="#8b8b93" fontSize={11} />
              <YAxis type="category" dataKey="title" stroke="#8b8b93" fontSize={11} width={150} />
              <Tooltip
                contentStyle={{ background: '#18181b', border: '1px solid #27272a', color: '#d4d4d8', borderRadius: 8 }}
                formatter={(value) => [`${value}%`, 'Mastery']}
              />
              <Bar dataKey="score" radius={4} maxBarSize={16}>
                {mastery.map((m) => (
                  <Cell key={m.topicId} fill={colorFor(m.score)} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="card w-full shrink-0 p-5 lg:w-72">
        <h2 className="mb-4 flex items-center gap-1.5 text-sm font-semibold text-[var(--color-text-h)]">
          <Target size={14} className="text-[var(--color-accent)]" /> Focus next
        </h2>
        <ul className="flex flex-col gap-3">
          {weakest.map((m) => (
            <li key={m.topicId}>
              <div className="mb-1 flex items-center justify-between text-sm">
                <Link to={`/topics/${m.topicId}`} className="truncate text-[var(--color-text)] hover:text-[var(--color-accent)]">
                  {m.title}
                </Link>
                <span className="shrink-0 pl-2 text-xs text-[var(--color-text-dim)]">{m.score}%</span>
              </div>
              <div className="mb-1.5 h-1.5 overflow-hidden rounded-full bg-[var(--color-surface-hover)]">
                <div className="h-full rounded-full" style={{ width: `${m.score}%`, background: colorFor(m.score) }} />
              </div>
              <div className="flex gap-2 text-xs">
                <Link to={`/quiz?topic=${m.topicId}`} className="flex items-center gap-1 text-[var(--color-text-dim)] hover:text-[var(--color-accent)]">
                  <ListChecks size={12} /> Practice
                </Link>
                <Link to={`/flashcards?topic=${m.topicId}`} className="flex items-center gap-1 text-[var(--color-text-dim)] hover:text-[var(--color-accent)]">
                  <SquareStack size={12} /> Flashcards
                </Link>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
