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
export const daysBetween = (from: string, to: string) => Math.round((utc(to) - utc(from)) / DAY);
export const addDays = (day: string, days: number) => new Date(utc(day) + days * DAY).toISOString().slice(0, 10);

export const wholeDollars = (cents: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(Math.round(cents / 100));
export const axisDollars = (cents: number) => cents === 0 ? '$0' : new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', notation: 'compact', maximumFractionDigits: 1 }).format(cents / 100);
export const shortDay = (day: string) => new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', year: 'numeric', timeZone: 'UTC' }).format(new Date(`${day}T12:00:00Z`));
export const monthAndYear = (day: string) => new Intl.DateTimeFormat('en-US', { month: 'long', year: 'numeric', timeZone: 'UTC' }).format(new Date(`${day}T12:00:00Z`));

/**
 * Where a chart should begin: the first day of the month in which the combined running
 * total of every line first reaches `share` of its final value. The months before that
 * hold almost none of the money and would squeeze everything else against the right edge.
 */
export function activeStart(lines: MoneyPoint[][], share = 0.02): string | null {
  const moves = lines.flatMap(points => points.map(([day, cents], index) => ({ day, cents: cents - (index ? points[index - 1][1] : 0) }))).sort((a, b) => a.day.localeCompare(b.day));
  const total = moves.reduce((sum, move) => sum + move.cents, 0);
  if (total <= 0) return null;
  let running = 0;
  for (const move of moves) {
    running += move.cents;
    if (running >= share * total) return monthStart(move.day);
  }
  return monthStart(moves[0].day);
}

/** A point on a chart's own time axis: days after the chart's first day, and the running total in cents. */
export type PlotPoint = [offset: number, cents: number];
export type PlotLine = { points: PlotPoint[]; carried: boolean };

/** Cut a running total to the chart's window. A line that began earlier enters at the left edge holding what it had already reached. */
export function clipToWindow(points: MoneyPoint[], start: string): PlotLine {
  const inside = points.filter(([day]) => day >= start).map(([day, cents]): PlotPoint => [daysBetween(start, day), cents]);
  const before = points.filter(([day]) => day < start).at(-1);
  if (!before) return { points: inside, carried: false };
  return { points: inside[0]?.[0] === 0 ? inside : [[0, before[1]], ...inside], carried: true };
}

/** The running total on a day: the last point on or before it. */
export function valueAt(points: PlotPoint[], offset: number): number {
  let value = 0;
  for (const [day, cents] of points) {
    if (day > offset) break;
    value = cents;
  }
  return value;
}

/**
 * Month labels for the time axis. Short spans get a label every month, then every quarter,
 * half year or year as the span grows. The first label and each January also carry the
 * year, which the chart prints on its own line so neighboring labels never collide.
 */
export function axisTicks(start: string, end: string): { day: string; label: string; year?: string }[] {
  const months = 12 * (Number(end.slice(0, 4)) - Number(start.slice(0, 4))) + Number(end.slice(5, 7)) - Number(start.slice(5, 7));
  const step = months <= 7 ? 1 : months <= 16 ? 3 : months <= 36 ? 6 : 12;
  const ticks: { day: string; label: string; year?: string }[] = [];
  const cursor = new Date(`${monthStart(start)}T00:00:00Z`);
  while (cursor.toISOString().slice(0, 10) <= end) {
    const month = cursor.getUTCMonth();
    const day = cursor.toISOString().slice(0, 10);
    if (month % step === 0 && day >= start) {
      const label = new Intl.DateTimeFormat('en-US', { month: 'short', timeZone: 'UTC' }).format(cursor);
      ticks.push(!ticks.length || month === 0 ? { day, label, year: day.slice(0, 4) } : { day, label });
    }
    cursor.setUTCMonth(month + 1);
  }
  return ticks;
}

/** A stepped path: flat until money moves, then straight up. Coordinates are in a 1000 by 300 box. A carried line starts at its own height on the left edge. */
export function stepPath(points: PlotPoint[], span: number, top: number, carried = false): string {
  if (!points.length) return '';
  const x = (offset: number) => (1000 * offset / Math.max(1, span)).toFixed(1);
  const y = (cents: number) => (300 - 300 * cents / top).toFixed(1);
  let path = carried ? `M${x(points[0][0])},${y(points[0][1])}` : `M${x(points[0][0])},${y(0)}V${y(points[0][1])}`;
  for (const [offset, cents] of points.slice(1)) path += `H${x(offset)}V${y(cents)}`;
  return path;
}

export type Nearest = { index: number; offset: number; distance: number };
/**
 * The line closest to a pointer, in pixels, measured against the stepped shape that is
 * drawn: flat runs and vertical rises. A pointer resting on a rise picks that line, and
 * the day it reports always lies on a date the line covers.
 */
export function nearestLine(lines: PlotLine[], px: number, py: number, box: { width: number; height: number; span: number; top: number }): Nearest | null {
  const span = Math.max(1, box.span);
  const X = (offset: number) => box.width * offset / span;
  const Y = (cents: number) => box.height * (1 - cents / box.top);
  const pointerDay = Math.round(span * px / Math.max(1, box.width));
  const found: { best: Nearest | null } = { best: null };
  lines.forEach(({ points, carried }, index) => {
    const consider = (distance: number, offset: number) => { if (!found.best || distance < found.best.distance) found.best = { index, offset, distance }; };
    if (!points.length) return;
    if (!carried) consider(Math.hypot(px - X(points[0][0]), Math.max(Y(points[0][1]) - py, 0, py - Y(0))), points[0][0]);
    for (let i = 0; i < points.length; i++) {
      const [offset, cents] = points[i];
      const next = points[i + 1];
      if (!next) { consider(Math.hypot(px - X(offset), py - Y(cents)), offset); break; }
      const flat = Math.max(X(offset) - px, 0, px - X(next[0]));
      consider(Math.hypot(flat, py - Y(cents)), Math.min(next[0] - 1, Math.max(offset, pointerDay)));
      const high = Math.min(Y(cents), Y(next[1])), low = Math.max(Y(cents), Y(next[1]));
      consider(Math.hypot(px - X(next[0]), Math.max(high - py, 0, py - low)), next[0]);
    }
  });
  return found.best;
}
