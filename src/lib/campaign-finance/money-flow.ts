/** Pure helpers for the raised-over-time and spent-over-time line charts. */
export type MoneyPoint = [day: string, cumulativeCents: number];
export type MoneySeries = {
  id: string; name: string; href?: string; color: string; dashed: boolean;
  raised: MoneyPoint[]; paid: MoneyPoint[]; matchingCents: number;
};
export type MoneyPanel = { key: string; title: string; series: MoneySeries[] };
export type DayFlow = { committee_id: string; day: string; raised_cents: number; matching_cents: number; paid_cents: number };

/** Nine line colors that stay distinct on the cream page; later ones are also dashed. */
export const SERIES_COLORS = ['#173c31', '#c08a2d', '#4f5d95', '#b0483f', '#2f86a6', '#8d4f6d', '#7d9a4d', '#d97b29', '#6f7873'];

/** Running total at each day that had activity; days with nothing are skipped so a line never claims a date it has no record for. */
export function cumulative(days: { day: string; cents: number }[]): MoneyPoint[] {
  let running = 0;
  const points: MoneyPoint[] = [];
  for (const { day, cents } of [...days].sort((a, b) => a.day.localeCompare(b.day))) {
    if (cents === 0) continue;
    running += cents;
    points.push([day, running]);
  }
  return points;
}
export const lastValue = (points: MoneyPoint[]) => points.at(-1)?.[1] ?? 0;

/** One panel of candidates: ordered by money raised, each keeping one color across both charts. */
export function buildPanel(key: string, title: string, candidates: { id: string; name: string; href?: string; color?: string; dashed?: boolean }[], flows: DayFlow[]): MoneyPanel {
  const series = candidates.map(candidate => {
    const own = flows.filter(flow => flow.committee_id === candidate.id);
    return {
      id: candidate.id, name: candidate.name, href: candidate.href, color: candidate.color ?? '', dashed: candidate.dashed ?? false,
      raised: cumulative(own.map(flow => ({ day: flow.day, cents: flow.raised_cents }))),
      paid: cumulative(own.map(flow => ({ day: flow.day, cents: flow.paid_cents }))),
      matchingCents: own.reduce((sum, flow) => sum + flow.matching_cents, 0),
    };
  }).sort((a, b) => lastValue(b.raised) - lastValue(a.raised) || a.name.localeCompare(b.name));
  series.forEach((item, index) => {
    if (!item.color) { item.color = SERIES_COLORS[index % SERIES_COLORS.length]; item.dashed = index >= 5; }
  });
  return { key, title, series };
}

/** The next round axis top at or above the value: 1, 1.2, 1.5, 2, 2.5, 3, 4, 5, 6, 8 or 10 times a power of ten. */
export function niceCeiling(cents: number): number {
  if (cents <= 0) return 100;
  const power = 10 ** Math.floor(Math.log10(cents));
  for (const step of [1, 1.2, 1.5, 2, 2.5, 3, 4, 5, 6, 8, 10]) if (step * power >= cents) return step * power;
  return 10 * power;
}

const DAY = 86_400_000;
const utc = (day: string) => Date.parse(`${day}T00:00:00Z`);
export const monthStart = (day: string) => `${day.slice(0, 7)}-01`;
/** Position of a day between start and end, from 0 to 1. */
export const position = (day: string, start: string, end: string) => (utc(day) - utc(start)) / Math.max(DAY, utc(end) - utc(start));

/** January and July labels between two days; January ones are major and survive on phones. */
export function quarterTicks(start: string, end: string): { day: string; label: string; minor: boolean }[] {
  const ticks: { day: string; label: string; minor: boolean }[] = [];
  const cursor = new Date(`${monthStart(start)}T00:00:00Z`);
  while (cursor.toISOString().slice(0, 10) <= end) {
    const month = cursor.getUTCMonth();
    if (month % 6 === 0) {
      const day = cursor.toISOString().slice(0, 10);
      if (day >= start) ticks.push({ day, label: new Intl.DateTimeFormat('en-US', { month: 'short', year: 'numeric', timeZone: 'UTC' }).format(cursor), minor: month !== 0 });
    }
    cursor.setUTCMonth(month + 1);
  }
  return ticks;
}

/** A stepped path: flat until money moves, then straight up. Coordinates are in a 1000 by 300 box. */
export function stepPath(points: MoneyPoint[], start: string, end: string, top: number): string {
  if (!points.length) return '';
  const x = (day: string) => (1000 * position(day, start, end)).toFixed(1);
  const y = (cents: number) => (300 - 300 * cents / top).toFixed(1);
  let path = `M${x(points[0][0])},${y(0)}V${y(points[0][1])}`;
  for (const [day, cents] of points.slice(1)) path += `H${x(day)}V${y(cents)}`;
  return path;
}
