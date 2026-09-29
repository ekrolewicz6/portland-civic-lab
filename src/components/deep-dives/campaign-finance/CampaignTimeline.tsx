'use client';

import { useEffect, useRef, useState } from 'react';
import frozen from '@/lib/campaign-finance/campaign-dynamics.json';
import { alignEvents, dayAt, eventAmounts, eventBins, eventKey, timelineCatalog, type CashKey, type TimelineEvent } from '@/lib/campaign-finance/timeline';
import { money } from '@/lib/campaign-finance/filters';
import s from './campaign-dynamics.module.css';

type Timeline = Omit<typeof frozen, 'events'> & { events: TimelineEvent[] };
const bases: { key: CashKey; label: string }[] = [
  { key: 'nonmatching_cents', label: 'Without City matches' },
  { key: 'cash_cents', label: 'All cash' },
  { key: 'public_cents', label: 'City matching' },
  { key: 'individual_itemized_cents', label: 'Named individuals' },
];
const windows = [
  { label: 'Since late March', start: '2026-03-23' },
  { label: 'All 2026', start: '2026-01-01' },
  { label: 'Since Jan. 2025', start: '2025-01-01' },
];
const colors = ['#176b58', '#a45b31', '#315b97', '#8b4f85', '#8a751e', '#45575f', '#c06962', '#5b7661', '#6866a1'];
const lanes = [
  { key: 'campaign', label: 'Campaigns', color: '#315b97' },
  { key: 'city', label: 'City decisions', color: '#9b6330' },
  { key: 'funding', label: 'Public funding', color: '#176b58' },
];
const utc = (date: string) => Date.parse(date + 'T00:00:00Z');
const dateLabel = (date: string) => new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', timeZone: 'UTC' }).format(utc(date));
const compact = (cents: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', notation: 'compact', maximumFractionDigits: 1 }).format(cents / 100);
const laneOf = (event: TimelineEvent) => event.category === 'moda' ? 'city' : event.category;

export function CampaignTimeline() {
  const [data, setData] = useState<Timeline>({ ...frozen, events: alignEvents(frozen.events) });
  const [refresh, setRefresh] = useState('Checking for newer filings…');
  const [race, setRace] = useState(3);
  const [basis, setBasis] = useState<CashKey>('nonmatching_cents');
  const [from, setFrom] = useState(windows[0].start);
  const [mode, setMode] = useState<'cumulative' | 'weekly'>('cumulative');
  const [selected, setSelected] = useState(['23208', '23028', '15109', '24897']);
  const [focusKeys, setFocusKeys] = useState<string[]>([]);
  const [activeKey, setActiveKey] = useState('');
  const [highlightWeek, setHighlightWeek] = useState('');
  const chartRef = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(1040);
  useEffect(() => {
    const controller = new AbortController();
    fetch('/api/campaign-finance/daily', { signal: controller.signal }).then(async response => {
      if (!response.ok) throw new Error('Timeline unavailable');
      return response.json();
    }).then(next => {
      if (controller.signal.aborted) return;
      setData({ ...next, events: alignEvents(next.events) });
      setRefresh(`Filings through ${next.end}${next.refresh?.status === 'provisional' ? ' · late filings may be missing.' : next.refresh?.status === 'stale' ? ' · newer filings are not yet shown.' : '.'}`);
    }).catch(() => { if (!controller.signal.aborted) setRefresh('Showing September 27 filings; newer data could not be checked.'); });
    return () => controller.abort();
  }, []);
  useEffect(() => {
    if (!chartRef.current) return;
    const observer = new ResizeObserver(([entry]) => setWidth(Math.max(200, Math.round(entry.contentRect.width))));
    observer.observe(chartRef.current);
    return () => observer.disconnect();
  }, []);
  const candidates = data.candidates.filter(candidate => candidate.raceId === `portland-district-${race}`);
  const shown = candidates.filter(candidate => selected.includes(candidate.committeeId));
  const points = data.weekly.filter(row => selected.includes(row.committeeId) && row.weekEnd >= from);
  const events = data.events.filter(event => event.date >= from && event.date <= data.end);
  const activeEvent = events.find(event => eventKey(event) === activeKey);
  const focusEvents = events.filter(event => focusKeys.includes(eventKey(event)));
  const weekly = [...new Set(points.map(row => row.weekStart))].map(start => {
    const rows = points.filter(row => row.weekStart === start);
    return { start, end: rows[0].weekEnd, total: rows.reduce((sum, row) => sum + row.weekly[basis], 0), rows };
  });
  const peaks = weekly.filter(week => week.start >= from && dayAt(week.start, 6) <= data.end)
    .sort((a, b) => b.total - a.total || a.start.localeCompare(b.start)).slice(0, 3);
  const selectedWeek = weekly.find(week => week.start === highlightWeek);
  const height = width < 600 ? 280 : 360, left = width < 600 ? 46 : 60, right = 12, top = 18, bottom = 32;
  const plotWidth = width - left - right, plotHeight = height - top - bottom;
  const beginning = utc(from), end = utc(data.end);
  const x = (date: string) => left + (Math.max(beginning, Math.min(utc(date), end)) - beginning) / Math.max(1, end - beginning) * plotWidth;
  const max = Math.max(1, ...points.map(row => row[mode][basis]));
  const step = 10 ** Math.floor(Math.log10(max));
  const ceiling = Math.ceil(max / step) * step;
  const y = (value: number) => top + (1 - value / ceiling) * plotHeight;
  const tickCount = width < 600 ? 3 : 6;
  const ticks = Array.from({ length: tickCount }, (_, i) => new Date(beginning + (end - beginning) * i / (tickCount - 1)).toISOString().slice(0, 10));
  const basisLabel = bases.find(item => item.key === basis)!.label;
  const clearFocus = () => { setFocusKeys([]); setActiveKey(''); setHighlightWeek(''); };
  const chooseEvent = (event: TimelineEvent) => { setActiveKey(eventKey(event)); setHighlightWeek(''); };
  const comparison = activeEvent ? eventAmounts(activeEvent, selected, basis) : null;
  const comparisonMax = Math.max(1, comparison?.beforeCents ?? 0, comparison?.afterCents ?? 0);

  return <figure className={s.panel} data-snapshot={data.snapshot} id="cumulative-fundraising">
    <figcaption><span className={s.kicker}>Money & moments</span><h3>When did fundraising pick up?</h3><p>Follow the money above. See what was happening below.</p><p className={s.refresh} role="status">{refresh}</p></figcaption>
    <div className={s.controls}>
      <fieldset><legend>Race</legend><div className={s.buttonRow}>{[3, 4].map(value => <button key={value} type="button" aria-pressed={race === value} onClick={() => {
        setRace(value); setSelected(data.candidates.filter(candidate => candidate.raceId === `portland-district-${value}`).sort((a, b) => b.nonmatchingCents - a.nonmatchingCents).slice(0, 4).map(candidate => candidate.committeeId)); clearFocus();
      }}>District {value}</button>)}</div></fieldset>
      <label className={s.compactSelect}>Money shown<select aria-label="Money shown" value={basis} onChange={event => setBasis(event.target.value as CashKey)}>{bases.map(item => <option key={item.key} value={item.key}>{item.label}</option>)}</select></label>
      <label className={s.compactSelect}>Time period<select aria-label="Time period" value={from} onChange={event => { setFrom(event.target.value); clearFocus(); }}>{windows.map(item => <option key={item.start} value={item.start}>{item.label}</option>)}</select></label>
    </div>
    <details className={s.candidatePicker}><summary>Compare candidates · {selected.length} selected</summary><fieldset className={s.candidates}><legend>Show candidates</legend>{candidates.map((candidate, index) => <label key={candidate.committeeId}><input type="checkbox" checked={selected.includes(candidate.committeeId)} onChange={() => setSelected(current => current.includes(candidate.committeeId) ? current.length > 1 ? current.filter(id => id !== candidate.committeeId) : current : [...current, candidate.committeeId])} /><i style={{ background: colors[index] }} aria-hidden="true" />{candidate.name}</label>)}</fieldset></details>
    <div className={s.timelineMode}><div className={s.buttonRow} aria-label="Chart view">{(['cumulative', 'weekly'] as const).map(value => <button key={value} aria-pressed={mode === value} onClick={() => setMode(value)}>{value === 'cumulative' ? 'Running total' : 'Each week'}</button>)}</div><p>{mode === 'cumulative' ? 'Steeper lines = faster fundraising.' : 'Taller peaks = bigger fundraising weeks.'}</p></div>
    <div className={s.chartScroll} ref={chartRef}><svg viewBox={`0 0 ${width} ${height}`} role="img" aria-label={`${mode === 'cumulative' ? 'Running total' : 'Weekly cash'} · ${basisLabel} · District ${race}, ${from} through ${data.end}`}>
      <rect x={left} y={top} width={plotWidth} height={plotHeight} fill="#fffdf8" />
      {selectedWeek && <rect x={x(selectedWeek.start)} y={top} width={Math.max(2, x(selectedWeek.end) - x(selectedWeek.start))} height={plotHeight} fill="#e8d9b8" opacity=".6" />}
      {Array.from({ length: 5 }, (_, i) => { const value = ceiling * i / 4; return <g key={i}><line x1={left} x2={width - right} y1={y(value)} y2={y(value)} stroke="#dce4dc" /><text x={left - 7} y={y(value) + 4} textAnchor="end" fontSize="12" fill="#53675d">{compact(value)}</text></g>; })}
      {ticks.map((date, i) => <text key={date} x={x(date)} y={height - 8} textAnchor={i === 0 ? 'start' : i === ticks.length - 1 ? 'end' : 'middle'} fontSize="12" fill="#53675d">{dateLabel(date)}</text>)}
      {events.map(event => <line key={eventKey(event)} x1={x(event.date)} x2={x(event.date)} y1={height - bottom - 7} y2={height - bottom} stroke={lanes.find(lane => lane.key === laneOf(event))?.color} strokeWidth="2"><title>{`${dateLabel(event.date)}: ${event.label}`}</title></line>)}
      {activeEvent && <line x1={x(activeEvent.date)} x2={x(activeEvent.date)} y1={top} y2={height - bottom} stroke="#a76e20" strokeWidth="2" strokeDasharray="5 4" />}
      {shown.map(candidate => {
        const rows = points.filter(row => row.committeeId === candidate.committeeId).sort((a, b) => a.weekEnd.localeCompare(b.weekEnd));
        return <g key={candidate.committeeId}><polyline fill="none" stroke={colors[candidates.indexOf(candidate)]} strokeWidth="3" strokeLinejoin="round" points={rows.map(row => `${x(row.weekEnd)},${y(row[mode][basis])}`).join(' ')} />{rows.map(row => <circle key={row.weekStart} cx={x(row.weekEnd)} cy={y(row[mode][basis])} r={mode === 'weekly' ? 2.5 : row === rows.at(-1) ? 4 : 0} fill={colors[candidates.indexOf(candidate)]}><title>{`${candidate.name}: ${dateLabel(row.weekStart)}–${dateLabel(row.weekEnd)}, ${money(row[mode][basis])}`}</title></circle>)}</g>;
      })}
    </svg></div>
    <div className={s.eventRibbon} aria-label="All events on the chart timeline">
      <p className={s.ribbonIntro}>{events.length} events · tap a circle to explore nearby dates</p>
      {lanes.map(lane => <div className={s.eventLane} key={lane.key}>
        <span style={{ color: lane.color }}>{lane.label}</span>
        <div className={s.eventTrack} style={{ marginLeft: left, marginRight: right, gridTemplateColumns: `repeat(${Math.max(2, Math.floor(plotWidth / 44))}, minmax(0, 1fr))` }}>
          {eventBins(events.filter(event => laneOf(event) === lane.key), from, data.end, Math.max(2, Math.floor(plotWidth / 44))).map(bin => <div className={s.eventBin} key={bin.index}>{bin.events.length > 0 && <button style={{ color: lane.color }} aria-pressed={bin.events.some(event => focusKeys.includes(eventKey(event)))} aria-label={`${lane.label}: ${bin.events.map(event => dateLabel(event.date) + ', ' + event.label).join('; ')}`} onClick={() => { setFocusKeys(bin.events.map(eventKey)); chooseEvent(bin.events[0]); }}><span>{bin.events.length}</span></button>}</div>)}
        </div>
      </div>)}
    </div>
    <p className={s.chartCaption}>{basisLabel} · {mode === 'cumulative' ? 'Running totals include earlier gifts.' : 'Monday–Sunday weeks; the last week may be incomplete.'} Circles group nearby dates; small ticks above mark exact dates.</p>
    <div className={s.lineKey}>{shown.map(candidate => <span key={candidate.committeeId}><i style={{ background: colors[candidates.indexOf(candidate)] }} />{candidate.name}: {money(points.filter(row => row.committeeId === candidate.committeeId).at(-1)?.cumulative[basis] ?? 0)} total</span>)}</div>
    <section className={s.timelinePeaks}><h4>The three biggest weeks</h4><p>For the selected candidates and money type. Complete weeks only.</p><div className={s.peakCards}>{peaks.map((week, index) => {
      const leader = [...week.rows].sort((a, b) => b.weekly[basis] - a.weekly[basis])[0];
      const nearby = events.filter(event => event.date >= week.start && event.date <= week.end);
      return <button key={week.start} aria-pressed={highlightWeek === week.start} onClick={() => { setMode('weekly'); setHighlightWeek(week.start); setFocusKeys(nearby.map(eventKey)); setActiveKey(''); }}>
        <span className={s.peakRank}>#{index + 1} · {dateLabel(week.start)}–{dateLabel(week.end)}</span><strong>{money(week.total)}</strong>
        <span className={s.peakTrack} aria-hidden="true">{week.rows.map(row => <i key={row.committeeId} style={{ width: `${week.total ? 100 * row.weekly[basis] / week.total : 0}%`, background: colors[candidates.findIndex(candidate => candidate.committeeId === row.committeeId)] }} />)}</span>
        <small>Most: {candidates.find(candidate => candidate.committeeId === leader.committeeId)?.name}</small><span className={s.peakExplore}>Explore this week →</span>
      </button>;
    })}</div></section>
    {(focusEvents.length > 0 || selectedWeek) && <section className={s.timelineDetail} aria-label="Timeline selection">
      <div className={s.detailHeading}><h4>{selectedWeek ? `${dateLabel(selectedWeek.start)}–${dateLabel(selectedWeek.end)}` : 'What happened around then?'}</h4><button onClick={clearFocus} aria-label="Close timeline details">Close ×</button></div>
      {selectedWeek && <div className={s.weekBreakdown}>{selectedWeek.rows.sort((a, b) => b.weekly[basis] - a.weekly[basis]).map(row => <div key={row.committeeId}><span>{candidates.find(candidate => candidate.committeeId === row.committeeId)?.name}</span><strong>{money(row.weekly[basis])}</strong></div>)}<a href={`/deep-dives/campaign-finance/explorer?race=portland-district-${race}&start=${selectedWeek.start}&end=${selectedWeek.end}&basis=cash_contribution&family=contributions&matching=${basis === 'public_cents' ? 'only' : basis === 'cash_cents' ? 'all' : 'exclude'}`}>Browse this race’s cash contributions for the week →</a></div>}
      {focusEvents.length ? <ul className={s.focusEvents}>{focusEvents.map(event => <li key={eventKey(event)}><button aria-pressed={activeKey === eventKey(event)} onClick={() => chooseEvent(event)}><time>{dateLabel(event.date)}</time>{event.label}</button><a href={event.sourceUrl} target="_blank" rel="noopener noreferrer" aria-label={`Source: ${event.label}`}>Source ↗</a></li>)}</ul> : <p>No event in this selected calendar falls in that week.</p>}
      {activeEvent && comparison && <div className={s.windowComparison}><h4>The week before & after</h4><p>{basisLabel} · {selected.length} selected campaigns · event day excluded</p>{([['Before', comparison.beforeCents], ['After', comparison.afterCents]] as const).map(([label, amount]) => <div className={s.comparisonRow} key={label}><span>{label}</span><span className={s.comparisonTrack}><i style={{ width: `${100 * (amount ?? 0) / comparisonMax}%` }} /></span><strong>{amount === null ? 'Unavailable' : money(amount)}</strong></div>)}<p className={s.note}>{activeEvent.dateKind}. {activeEvent.limitation} {comparison.afterCents === null || comparison.beforeCents === null ? 'A full seven-day window is unavailable in this snapshot.' : 'Timing alone does not tell us why people gave.'}</p></div>}
    </section>}
    <details className={s.eventLedger}><summary>All {events.length} events & sources</summary><p className={s.note}>{timelineCatalog.selection}</p><ol>{events.map(event => <li key={eventKey(event)}><button onClick={() => { setFocusKeys([eventKey(event)]); chooseEvent(event); }}><time>{dateLabel(event.date)} · {event.date.slice(0, 4)}</time> <strong>{event.label}</strong></button><span>{event.dateKind} · <a href={event.sourceUrl} target="_blank" rel="noopener noreferrer">Source ↗</a></span></li>)}</ol></details>
    <p className={s.note}>Events are context, not a measure of their effect on donations. Fundraising appeals and filing delays also shape these lines.</p>
    <p className={s.links}><a href="/api/campaign-finance/daily" download="campaign-timeline-current.json">Download current totals & event windows</a></p>
  </figure>;
}
