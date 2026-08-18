import { Flame } from 'lucide-react';
import type { ActivityDay } from '../../lib/activity';
import { currentStreak } from '../../lib/activity';

const MONTH_LABELS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

function levelFor(count: number): 0 | 1 | 2 | 3 | 4 {
  if (count === 0) return 0;
  if (count <= 2) return 1;
  if (count <= 5) return 2;
  if (count <= 9) return 3;
  return 4;
}

const LEVEL_COLOR: Record<number, string> = {
  0: 'rgba(227, 226, 234, 0.06)',
  1: 'color-mix(in srgb, var(--color-accent) 28%, var(--color-surface))',
  2: 'color-mix(in srgb, var(--color-accent) 52%, var(--color-surface))',
  3: 'color-mix(in srgb, var(--color-accent) 78%, var(--color-surface))',
  4: 'var(--color-accent)',
};

export function ActivityHeatmap({ days }: { days: ActivityDay[] }) {
  // Pad the front so the first column starts on a Sunday, GitHub-style.
  const firstDow = new Date(days[0].date + 'T00:00:00').getDay();
  const padded: (ActivityDay | null)[] = [...Array(firstDow).fill(null), ...days];
  const weeks: (ActivityDay | null)[][] = [];
  for (let i = 0; i < padded.length; i += 7) {
    weeks.push(padded.slice(i, i + 7));
  }

  // One label per week-column where a new month starts.
  const monthLabels: { weekIndex: number; label: string }[] = [];
  let lastMonth = -1;
  weeks.forEach((week, i) => {
    const firstReal = week.find((d) => d !== null);
    if (!firstReal) return;
    const month = new Date(firstReal.date + 'T00:00:00').getMonth();
    if (month !== lastMonth) {
      monthLabels.push({ weekIndex: i, label: MONTH_LABELS[month] });
      lastMonth = month;
    }
  });

  const totalActive = days.filter((d) => d.count > 0).length;
  const streak = currentStreak(days);

  return (
    <div className="card p-5">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
        <h2 className="text-sm font-semibold text-[var(--color-text-h)]">Study activity</h2>
        <div className="flex items-center gap-3 text-xs text-[var(--color-text-dim)]">
          <span>{totalActive} active days</span>
          {streak > 0 && (
            <span className="flex items-center gap-1 font-semibold text-[var(--color-warn)]">
              <Flame size={13} /> {streak}-day streak
            </span>
          )}
        </div>
      </div>
      <div className="overflow-x-auto">
        <div className="inline-block min-w-full">
          <div className="mb-1 grid gap-[3px]" style={{ gridTemplateColumns: `repeat(${weeks.length}, 11px)` }}>
            {weeks.map((_, i) => {
              const label = monthLabels.find((m) => m.weekIndex === i);
              return (
                <span key={i} className="text-[10px] text-[var(--color-text-dim)]">
                  {label?.label ?? ''}
                </span>
              );
            })}
          </div>
          <div className="grid grid-flow-col gap-[3px]" style={{ gridTemplateRows: 'repeat(7, 11px)' }}>
            {weeks.map((week, wi) =>
              week.map((day, di) => (
                <div
                  key={`${wi}-${di}`}
                  title={day ? `${day.date}: ${day.count} ${day.count === 1 ? 'activity' : 'activities'}` : ''}
                  className="h-[11px] w-[11px] rounded-[2px]"
                  style={{ background: day ? LEVEL_COLOR[levelFor(day.count)] : 'transparent' }}
                />
              )),
            )}
          </div>
        </div>
      </div>
      <div className="mt-3 flex items-center justify-end gap-1 text-[10px] text-[var(--color-text-dim)]">
        Less
        {[0, 1, 2, 3, 4].map((l) => (
          <span key={l} className="h-[10px] w-[10px] rounded-[2px]" style={{ background: LEVEL_COLOR[l] }} />
        ))}
        More
      </div>
    </div>
  );
}
