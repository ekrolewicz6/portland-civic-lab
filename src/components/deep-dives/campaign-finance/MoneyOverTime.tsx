import 'server-only';
import Link from 'next/link';
import { lastValue, monthStart, niceCeiling, position, quarterTicks, stepPath, type MoneyPanel, type MoneyPoint, type MoneySeries } from '@/lib/campaign-finance/money-flow';
import type { MoneyTotals } from '@/lib/campaign-finance/query';
import s from './money-flow.module.css';

const dollars = (cents: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(Math.round(cents / 100));
const axisMoney = (cents: number) => cents === 0 ? '$0' : new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', notation: 'compact', maximumFractionDigits: 1 }).format(cents / 100);
const shortDay = (day: string) => new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', year: 'numeric', timeZone: 'UTC' }).format(new Date(`${day}T12:00:00Z`));
const percent = (part: number, whole: number) => {
  if (whole <= 0 || part <= 0) return '0%';
  const rounded = Math.round(100 * part / whole);
  return rounded === 0 ? 'under 1%' : rounded === 100 && part < whole ? 'over 99%' : `${rounded}%`;
};
type Measure = 'raised' | 'paid';
const pointsOf = (series: MoneySeries, measure: Measure): MoneyPoint[] => series[measure];

/**
 * One lead chart: a stepped running total for every candidate, in one panel per race.
 * Each line starts on the candidate's first record and stops on the last, so a
 * line never implies a date the records do not cover.
 */
export type MoneyEvent = { id: string; date: string; label: string; source?: string };

export function MoneyOverTime({ measure, panels, end, kicker, title, howTo, source, events = [], ranked: rankByValue = true }: {
  measure: Measure; panels: MoneyPanel[]; end: string; kicker: string; title: string; howTo: string; source: React.ReactNode; events?: MoneyEvent[];
  /** Legends follow the amounts by default. Pass false to keep the order the panel was given, such as alphabetical. */
  ranked?: boolean;
}) {
  const everyPoint = panels.flatMap(panel => panel.series.flatMap(series => pointsOf(series, measure)));
  const start = monthStart(everyPoint.reduce((earliest, [day]) => day < earliest ? day : earliest, end));
  const top = niceCeiling(Math.max(...panels.flatMap(panel => panel.series.map(series => lastValue(pointsOf(series, measure)))), 1));
  const ticks = quarterTicks(start, end);
  const gridlines = [0, top / 2, top];
  const marked = events.filter(event => event.date >= start && event.date <= end);
  return <figure className={s.figure} data-chart={`lead-${measure}`}>
    <figcaption><span className={s.kicker}>{kicker}</span><h2 className={s.title}>{title}</h2><p className={s.howTo}>{howTo}</p></figcaption>
    <div className={`${s.panels} ${panels.length === 1 ? s.wide : ''}`}>{panels.map(panel => {
      const ranked = rankByValue ? [...panel.series].sort((a, b) => lastValue(pointsOf(b, measure)) - lastValue(pointsOf(a, measure)) || a.name.localeCompare(b.name)) : panel.series;
      const drawn = ranked.filter(series => pointsOf(series, measure).length);
      const total = ranked.reduce((sum, series) => sum + lastValue(pointsOf(series, measure)), 0);
      return <div className={s.panel} key={panel.key} data-panel={panel.key}>
        <div className={s.panelHead}><strong>{panel.title}</strong><span>{dollars(total)} {measure === 'raised' ? 'raised' : 'paid out'} in all</span></div>
        <div className={s.chart}>
          <div className={s.yLabels} aria-hidden="true">{gridlines.map(value => <span key={value} style={{ top: `${100 - 100 * value / top}%` }}>{axisMoney(value)}</span>)}</div>
          <div className={s.area}>
            <svg viewBox="0 0 1000 300" preserveAspectRatio="none" role="img" aria-label={`${panel.title}: ${measure === 'raised' ? 'cash raised' : 'cash paid out'} over time. ${drawn.slice(0, 4).map(series => `${series.name} ${dollars(lastValue(pointsOf(series, measure)))}`).join(', ')}. Every campaign's total is listed below the chart.`}>
              <line x1="0" x2="1000" y1="150" y2="150" stroke="#dde3db" vectorEffect="non-scaling-stroke" />
              <line x1="0" x2="1000" y1="0" y2="0" stroke="#dde3db" vectorEffect="non-scaling-stroke" />
              {marked.map(event => <line key={event.id} x1={1000 * position(event.date, start, end)} x2={1000 * position(event.date, start, end)} y1="0" y2="300" stroke="#7d8f84" strokeDasharray="4 4" vectorEffect="non-scaling-stroke" />)}
              {[...drawn].reverse().map(series => <path key={series.id} data-series={series.id} d={stepPath(pointsOf(series, measure), start, end, top)} fill="none" stroke={series.color} strokeWidth="2.5" strokeDasharray={series.dashed ? '7 4' : undefined} strokeLinejoin="round" vectorEffect="non-scaling-stroke"><title>{`${series.name}: ${dollars(lastValue(pointsOf(series, measure)))}`}</title></path>)}
            </svg>
            {marked.map((event, index) => <span key={event.id} className={s.flag} style={{ left: `${100 * position(event.date, start, end)}%` }} aria-hidden="true">{index + 1}</span>)}
            {drawn.map(series => { const [day, cents] = pointsOf(series, measure).at(-1)!; return <span key={series.id} className={s.dot} aria-hidden="true" style={{ left: `${100 * position(day, start, end)}%`, top: `${100 - 100 * cents / top}%`, background: series.color }} />; })}
          </div>
          <div className={s.xLabels} aria-hidden="true">{ticks.map(tick => <span key={tick.day} className={tick.minor ? s.xMinor : undefined} style={{ left: `${100 * position(tick.day, start, end)}%` }}>{tick.label}</span>)}</div>
        </div>
        <ol className={s.legend}>{ranked.map(series => {
          const points = pointsOf(series, measure);
          const name = series.href ? <Link href={series.href}>{series.name}</Link> : series.name;
          if (!points.length) return <li key={series.id} className={s.noRecords}><i className={s.key} style={{ color: '#c9d2c8' }} aria-hidden="true" /><span>{name}</span><strong>None</strong><small>{measure === 'raised' ? 'No contributions in these records' : 'No payments in these records'}</small></li>;
          return <li key={series.id} data-series={series.id}>
            <i className={`${s.key} ${series.dashed ? s.keyDashed : ''}`} style={{ color: series.color }} aria-hidden="true" />
            <span>{name}</span><strong>{dollars(lastValue(points))}</strong>
            <small>{measure === 'raised'
              ? <>Latest contribution {shortDay(points.at(-1)![0])}{series.matchingCents > 0 ? <>. {dollars(series.matchingCents)} is City matching funds.</> : null}</>
              : <>First payment {shortDay(points[0][0])}, latest {shortDay(points.at(-1)![0])}</>}</small>
          </li>;
        })}</ol>
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
