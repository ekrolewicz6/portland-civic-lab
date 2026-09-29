import { describe, it, expect } from 'vitest';
import { alignEvents, buildEventWindows, cashKeys, dayAt, eventAmounts, eventBins, eventKey, timelineCatalog } from '../../src/lib/campaign-finance/timeline';

describe('campaign timeline', () => {
  it('has distinct sourced events and only four public Moda anchors', () => {
    const events = timelineCatalog.events;
    expect(new Set(events.map(eventKey)).size).toBe(events.length);
    expect(events.filter(event => event.category === 'moda').map(event => event.date)).toEqual(['2026-06-24','2026-07-30','2026-08-06','2026-08-12']);
    expect(events.filter(event => event.date >= '2026-03-23' && event.category !== 'moda').length).toBeGreaterThan(20);
    for (const event of events) expect(event.sourceUrl).toMatch(/^https:\/\//);
  });
  it('computes all money types independently, excludes the event day, and follows selected campaigns', () => {
    const anchor = '2026-04-08';
    const events = buildEventWindows(['a','b'], '2025-01-01', '2026-09-28', (id, date, key) =>
      date === anchor ? 999999 : (id === 'a' ? 1 : 10) * (cashKeys.indexOf(key) + 1) * (date < anchor ? 100 : 200));
    const event = events.find(event => event.date === anchor)!;
    expect(eventAmounts(event, ['a'], 'cash_cents')).toEqual({ beforeCents: 700, afterCents: 1400 });
    expect(eventAmounts(event, ['a','b'], 'public_cents')).toEqual({ beforeCents: 15400, afterCents: 30800 });
    expect(eventAmounts(event, ['missing'], 'cash_cents')).toEqual({ beforeCents: null, afterCents: null });
  });
  it('never fills incomplete windows with zero or uses legacy nonmatching totals as all cash', () => {
    const events = buildEventWindows(['a'], '2025-01-01', '2026-09-28', () => 100);
    const latest = events.find(event => event.date === '2026-09-23')!;
    expect(eventAmounts(latest, ['a'], 'cash_cents')).toEqual({ beforeCents: 700, afterCents: null });
    const legacy = { ...latest, comparisons: [{ committeeId: 'a', beforeCents: 100, afterCents: 200 }] };
    expect(eventAmounts(legacy, ['a'], 'cash_cents').beforeCents).toBeNull();
    expect(eventAmounts(legacy, ['a'], 'nonmatching_cents').beforeCents).toBe(100);
    expect(alignEvents([]).every(event => event.comparisons.length === 0)).toBe(true);
    expect(dayAt('2026-08-31', 1)).toBe('2026-09-01');
  });
  it('represents every date exactly once in both phone and desktop event clusters', () => {
    const events = alignEvents([]).filter(event => event.date >= '2026-03-23');
    for (const count of [3, 4, 18, 24]) {
      const bins = eventBins(events, '2026-03-23', '2026-09-28', count);
      expect(bins.flatMap(bin => bin.events).map(eventKey).sort()).toEqual(events.map(eventKey).sort());
    }
  });
});
