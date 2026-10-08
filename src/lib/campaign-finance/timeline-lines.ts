/** Pure helpers for reading one candidate's line in the weekly fundraising timeline. */
export type LinePoint = { x: number; y: number };
/** One week on one candidate's line. `week` is the Monday the week starts on. */
export type Reading = { id: string; week: string };
export type TimelineMode = 'cumulative' | 'weekly';

const distanceToSegment = (px: number, py: number, a: LinePoint, b: LinePoint) => {
  const dx = b.x - a.x, dy = b.y - a.y, length = dx * dx + dy * dy;
  const along = length ? Math.max(0, Math.min(1, ((px - a.x) * dx + (py - a.y) * dy) / length)) : 0;
  return Math.hypot(px - a.x - along * dx, py - a.y - along * dy);
};

/**
 * The drawn line closest to a pointer, measured against the straight segments on screen.
 * Lines are painted in list order, so where several coincide the last one is the one a
 * reader can see, and it wins the tie. `keep` names the line already being read: it holds
 * on until another is closer by more than `slack`, which stops the reading from flickering
 * where lines run together. Lines with no points are skipped.
 */
export function nearestPolyline(lines: LinePoint[][], px: number, py: number, keep = -1, slack = 3): { index: number; distance: number } | null {
  let best: { index: number; distance: number } | null = null;
  let held: number | null = null;
  for (let index = 0; index < lines.length; index++) {
    const points = lines[index];
    if (!points.length) continue;
    let distance = Math.hypot(px - points[0].x, py - points[0].y);
    for (let i = 1; i < points.length; i++) distance = Math.min(distance, distanceToSegment(px, py, points[i - 1], points[i]));
    if (index === keep) held = distance;
    if (!best || distance <= best.distance) best = { index, distance };
  }
  return best && held !== null && held <= best.distance + slack ? { index: keep, distance: held } : best;
}

/** The point on a line nearest a pointer's horizontal position: the week under the pointer. */
export function nearestPoint(points: LinePoint[], px: number): number {
  let index = 0;
  for (let i = 1; i < points.length; i++) if (Math.abs(points[i].x - px) < Math.abs(points[index].x - px)) index = i;
  return index;
}

/** The row for a week. When a new time period or newer filings no longer hold that week, the closest earlier row, or the first. */
export function rowAt(rows: { weekStart: string }[], week: string): number {
  let index = 0;
  for (let i = 0; i < rows.length && rows[i].weekStart <= week; i++) index = i;
  return index;
}

/**
 * Where a key press lands. Left and right move a week, Page Up and Page Down four weeks,
 * Home and End go to the ends, up and down change line at the same week. The first arrow
 * key starts on the first line's latest week. Returns null for any other key or when
 * there is nothing to read.
 */
export function stepReading(lines: { id: string; rows: { weekStart: string }[] }[], current: Reading | null, key: string): Reading | null {
  const index = current ? lines.findIndex(line => line.id === current.id) : -1;
  const line = lines[Math.max(index, 0)];
  if (!line?.rows.length) return null;
  const last = line.rows.length - 1;
  const from = index < 0 ? last : rowAt(line.rows, current!.week);
  const at = (row: number): Reading => ({ id: line.id, week: line.rows[Math.max(0, Math.min(last, row))].weekStart });
  switch (key) {
    case 'ArrowLeft': return at(index < 0 ? last : from - 1);
    case 'ArrowRight': return at(from + 1);
    case 'PageUp': return at(from - 4);
    case 'PageDown': return at(from + 4);
    case 'Home': return at(0);
    case 'End': return at(last);
    case 'ArrowDown': case 'ArrowUp': {
      if (index < 0) return at(last);
      const other = lines[(index + (key === 'ArrowDown' ? 1 : lines.length - 1)) % lines.length];
      return other.rows.length ? { id: other.id, week: other.rows[rowAt(other.rows, line.rows[from].weekStart)].weekStart } : null;
    }
    default: return null;
  }
}

const dayParts = (day: string) => {
  const date = new Date(`${day}T12:00:00Z`);
  return { month: new Intl.DateTimeFormat('en-US', { month: 'short', timeZone: 'UTC' }).format(date), day: date.getUTCDate(), year: date.getUTCFullYear() };
};
/** A week's dates as words, repeating the month and year only when they change: "Sep 14 to 20, 2026". */
export function weekRange(start: string, end: string): string {
  const a = dayParts(start), b = dayParts(end);
  if (start === end) return `${b.month} ${b.day}, ${b.year}`;
  if (a.year !== b.year) return `${a.month} ${a.day}, ${a.year} to ${b.month} ${b.day}, ${b.year}`;
  if (a.month !== b.month) return `${a.month} ${a.day} to ${b.month} ${b.day}, ${b.year}`;
  return `${a.month} ${a.day} to ${b.day}, ${b.year}`;
}

/** What one point says: a week's money in the weekly view, everything up to that week's end in the running total. */
export const readingText = (mode: TimelineMode, amount: string, start: string, end: string) =>
  mode === 'weekly' ? `${amount} in the week of ${weekRange(start, end)}` : `${amount} in total through the week of ${weekRange(start, end)}`;

/** Who else sits on the same amount in the same week. Up to three are named; a longer list is counted, since the legend and the arrow keys reach each one. */
export const sameAmount = (names: string[]) => !names.length ? ''
  : `Same amount: ${names.length > 3 ? `${names.length} other candidates` : new Intl.ListFormat('en-US', { style: 'long', type: 'conjunction' }).format(names)}`;
