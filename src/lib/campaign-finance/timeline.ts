import catalog from './timeline-events.json';

export const timelineCatalog = catalog;
export const cashKeys = ['cash_cents', 'public_cents', 'nonmatching_cents', 'individual_itemized_cents', 'unidentified_cents'] as const;
export type CashKey = typeof cashKeys[number];
export type WindowAmounts = { beforeCents: number | null; afterCents: number | null };
export type TimelineEvent = typeof catalog.events[number] & {
  comparisons: { committeeId: string; beforeCents: number | null; afterCents: number | null; byBasis?: Partial<Record<CashKey, WindowAmounts>> }[];
};
export const dayAt = (date: string, offset: number) => new Date(Date.parse(date + 'T00:00:00Z') + offset * 86400000).toISOString().slice(0, 10);
export const eventKey = (event: { date: string; label: string }) => event.date + '|' + event.label;

export function buildEventWindows(ids: string[], start: string, end: string, value: (id: string, date: string, key: CashKey) => number): TimelineEvent[] {
  return catalog.events.filter(event => event.date <= end).map(event => ({
    ...event,
    comparisons: ids.map(committeeId => {
      const byBasis = Object.fromEntries(cashKeys.map(key => {
        let before = 0, after = 0;
        for (let offset = 1; offset <= 7; offset++) {
          before += value(committeeId, dayAt(event.date, -offset), key);
          after += value(committeeId, dayAt(event.date, offset), key);
        }
        return [key, { beforeCents: dayAt(event.date, -7) < start ? null : before, afterCents: dayAt(event.date, 7) > end ? null : after }];
      })) as Record<CashKey, WindowAmounts>;
      return { committeeId, ...byBasis.nonmatching_cents, byBasis };
    }),
  }));
}

// Older validated snapshots contain only the nonmatching window. Never reuse it for another basis.
export function alignEvents(events: TimelineEvent[]): TimelineEvent[] {
  return catalog.events.map(event => ({
    ...event, comparisons: events.find(previous => eventKey(previous) === eventKey(event))?.comparisons ?? [],
  }));
}
export function eventAmounts(event: TimelineEvent, ids: string[], basis: CashKey): WindowAmounts {
  const amounts = ids.map(id => {
    const row = event.comparisons.find(item => item.committeeId === id);
    return row?.byBasis?.[basis] ?? (basis === 'nonmatching_cents' ? row : undefined);
  });
  return {
    beforeCents: amounts.length && amounts.every(row => row?.beforeCents != null) ? amounts.reduce((sum, row) => sum + row!.beforeCents!, 0) : null,
    afterCents: amounts.length && amounts.every(row => row?.afterCents != null) ? amounts.reduce((sum, row) => sum + row!.afterCents!, 0) : null,
  };
}

// Equal-width time bins keep every event represented while reserving touch-sized targets.
export function eventBins(events: TimelineEvent[], start: string, end: string, count: number) {
  const from = Date.parse(start), duration = Math.max(1, Date.parse(end) - from);
  return Array.from({ length: count }, (_, index) => ({
    index,
    events: events.filter(event => Math.min(count - 1, Math.floor((Date.parse(event.date) - from) / duration * count)) === index),
  }));
}
