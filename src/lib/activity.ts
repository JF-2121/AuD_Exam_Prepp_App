export interface ActivityDay {
  date: string; // YYYY-MM-DD, in local time
  count: number;
}

/** Formats a Date using its LOCAL calendar date — never mix this with toISOString() (UTC), or dates shift by a day in non-UTC timezones. */
function formatLocalDate(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

/** Buckets a list of ISO timestamps into per-day counts (by local calendar date), filling in every day (zero-filled) across `weeks` weeks ending today. */
export function buildActivityCalendar(timestamps: string[], weeks: number): ActivityDay[] {
  const counts = new Map<string, number>();
  for (const ts of timestamps) {
    const key = formatLocalDate(new Date(ts));
    counts.set(key, (counts.get(key) ?? 0) + 1);
  }

  const days: ActivityDay[] = [];
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const totalDays = weeks * 7;

  for (let i = totalDays - 1; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    const key = formatLocalDate(d);
    days.push({ date: key, count: counts.get(key) ?? 0 });
  }

  return days;
}

export function currentStreak(days: ActivityDay[]): number {
  let streak = 0;
  for (let i = days.length - 1; i >= 0; i--) {
    if (days[i].count > 0) streak++;
    else break;
  }
  return streak;
}
