import 'server-only';
import { activeStart, axisTicks, clipToWindow, daysBetween, lastValue, monthAndYear, monthStart, niceCeiling, shortDay, wholeDollars as dollars, type MoneyPanel, type MoneyPoint, type MoneySeries } from '@/lib/campaign-finance/money-flow';
import type { MoneyTotals } from '@/lib/campaign-finance/query';
import MoneyLines, { type Line } from './MoneyLines';
import s from './money-flow.module.css';

const percent = (part: number, whole: number) => {
  if (whole <= 0 || part <= 0) return '0%';
  const rounded = Math.round(100 * part / whole);
  return rounded === 0 ? 'under 1%' : rounded === 100 && part < whole ? 'over 99%' : `${rounded}%`;
};
type Measure = 'raised' | 'paid';
const pointsOf = (series: MoneySeries, measure: Measure): MoneyPoint[] => series[measure];
const before = (points: MoneyPoint[], day: string) => points.filter(point => point[0] < day).at(-1)?.[1] ?? 0;

/**
 * One lead chart: a stepped running total for every candidate, in one panel per race.
 * The time axis begins once money starts to move in earnest, at the same month for the
 * raised chart and the paid chart, and a line that began earlier enters at the height it
 * had reached. Each line stops on its last record, so it never implies a date the
 * records do not cover.
 */
export type MoneyEvent = { id: string; date: string; label: string; source?: string };

export function MoneyOverTime({ measure, panels, end, kicker, title, howTo, source, events = [], ranked: rankByValue = true }: {
  measure: Measure; panels: MoneyPanel[]; end: string; kicker: string; title: string; howTo: string; source: React.ReactNode; events?: MoneyEvent[];
  /** Legends follow the amounts by default. Pass false to keep the order the panel was given, such as alphabetical. */
  ranked?: boolean;
}) {
  const everySeries = panels.flatMap(panel => panel.series);
  const earliest = monthStart(everySeries.flatMap(series => [...series.raised, ...series.paid]).reduce((first, [day]) => day < first ? day : first, end));
  // Both charts share one window, set by money in and money out together.
  const start = activeStart(everySeries.flatMap(series => [series.raised, series.paid])) ?? earliest;
  const span = Math.max(1, daysBetween(start, end));
  const top = niceCeiling(Math.max(...everySeries.map(series => lastValue(pointsOf(series, measure))), 1));
  const ticks = axisTicks(start, end).map(tick => ({ offset: daysBetween(start, tick.day), label: tick.label, year: tick.year }));
  const marked = events.filter(event => event.date >= start && event.date <= end);
  const total = everySeries.reduce((sum, series) => sum + lastValue(pointsOf(series, measure)), 0);
  const carried = everySeries.reduce((sum, series) => sum + before(pointsOf(series, measure), start), 0);
  const verb = measure === 'raised' ? 'raised' : 'paid out';
  return <figure className={s.figure} data-chart={`lead-${measure}`} data-start={start}>
    <figcaption><span className={s.kicker}>{kicker}</span><h2 className={s.title}>{title}</h2><p className={s.howTo}>{howTo}{start > earliest ? <> The chart starts in {monthAndYear(start)}. The {dollars(carried)} {verb} before then, {percent(carried, total)} of the total, is already in each line where it begins.</> : null}</p></figcaption>
    <div className={`${s.panels} ${panels.length === 1 ? s.wide : ''}`}>{panels.map(panel => {
      const ranked = rankByValue ? [...panel.series].sort((a, b) => lastValue(pointsOf(b, measure)) - lastValue(pointsOf(a, measure)) || a.name.localeCompare(b.name)) : panel.series;
      const panelTotal = ranked.reduce((sum, series) => sum + lastValue(pointsOf(series, measure)), 0);
      const lines: Line[] = ranked.map(series => {
        const points = pointsOf(series, measure);
        const detail = !points.length ? (measure === 'raised' ? 'No contributions in these records' : 'No payments in these records')
          : measure === 'raised' ? `Latest contribution ${shortDay(points.at(-1)![0])}${series.matchingCents > 0 ? `. ${dollars(series.matchingCents)} is City matching funds.` : ''}`
          : `First payment ${shortDay(points[0][0])}, latest ${shortDay(points.at(-1)![0])}`;
        return { id: series.id, name: series.name, href: series.href, color: series.color, dashed: series.dashed, ...clipToWindow(points, start), totalCents: lastValue(points), detail };
      });
      const leaders = lines.filter(line => line.points.length).slice(0, 4);
      return <div className={s.panel} key={panel.key} data-panel={panel.key}>
        <div className={s.panelHead}><strong>{panel.title}</strong><span>{dollars(panelTotal)} {verb} in all</span></div>
        <MoneyLines measure={measure} start={start} span={span} top={top} lines={lines} ticks={ticks}
          flags={marked.map(event => ({ id: event.id, offset: daysBetween(start, event.date) }))}
          label={`${panel.title}: ${measure === 'raised' ? 'cash raised' : 'cash paid out'} over time. ${leaders.map(line => `${line.name} ${dollars(line.totalCents)}`).join(', ')}. Every campaign’s total is listed below the chart.`} />
      </div>;
    })}</div>
    {marked.length ? <ol className={s.events}>{marked.map((event, index) => <li key={event.id}><b aria-hidden="true">{index + 1}</b><span><time dateTime={event.date}>{shortDay(event.date)}</time>{event.source ? <a href={event.source}>{event.label}</a> : event.label}</span></li>)}</ol> : null}
    <p className={s.source}>{source}</p>
  </figure>;
}

export type MoneyRow = { key: string; label: string; totals: MoneyTotals; note?: React.ReactNode };
const PLACES = [['oregon', 'Paid to Oregon addresses', 'placeOregon'], ['other_state', 'Paid to addresses in other states', 'placeOther'], ['committee', 'Passed to other committees', 'placeCommittee'], ['unplaced', 'No address reported', 'placeUnplaced']] as const;

/** Money in, money out, and the share of payments that went to Oregon addresses, for one or more groups of committees. */
export function MoneyInOut({ rows, kicker, title, howTo, source }: { rows: MoneyRow[]; kicker: string; title: string; howTo: string; source: React.ReactNode }) {
  return <figure className={s.figure} data-chart="money-in-out">
    <figcaption><span className={s.kicker}>{kicker}</span><h2 className={s.title}>{title}</h2><p className={s.howTo}>{howTo}</p></figcaption>
    <div className={s.rows}>{rows.map(({ key, label, totals, note }) => {
      const parts = PLACES.map(([place, name, style]) => ({ place, name, style, ...totals.places[place] })).filter(part => part.cents > 0);
      return <div className={s.row} key={key} data-money-row={key}>
        <div className={s.rowHead}><strong>{label}</strong><span><b>{dollars(totals.inCents)}</b> in · <b>{dollars(totals.outCents)}</b> out</span></div>
        {note ? <p className={s.rowNote}>{note}</p> : null}
        <div className={s.bar} role="img" aria-label={`${label}, payments by where they went: ${parts.map(part => `${part.name} ${dollars(part.cents)}, ${percent(part.cents, totals.outCents)}`).join('; ')}`}>
          {parts.map(part => <span key={part.place} className={s[part.style]} style={{ width: `${100 * part.cents / totals.outCents}%` }} />)}
        </div>
        <div className={s.parts}>{parts.map(part => <div key={part.place}><i className={s[part.style]} aria-hidden="true" /><span>{part.name}<b>{dollars(part.cents)}</b><small>{percent(part.cents, totals.outCents)} of payments</small></span></div>)}</div>
        {totals.topOutside.length ? <p className={s.payees}>Largest payees outside Oregon: {totals.topOutside.map((payee, index) => <span key={`${payee.name}-${payee.state}`}>{index ? '; ' : ''}{payee.name} ({payee.state}), {dollars(payee.cents)}</span>)}.</p> : null}
      </div>;
    })}</div>
    <p className={s.source}>{source}</p>
  </figure>;
}
