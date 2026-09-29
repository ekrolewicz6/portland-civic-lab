'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import frozenData from '@/lib/campaign-finance/campaign-dynamics.json';
const data = frozenData;
import { money } from '@/lib/campaign-finance/filters';
import s from './campaign-dynamics.module.css';

type Basis = 'nonmatching_cents' | 'cash_cents' | 'public_cents' | 'individual_itemized_cents';
type Window = 'active' | 'year' | 'all';
const bases: { key: Basis; label: string }[] = [
  { key: 'nonmatching_cents', label: 'Without City matches' },
  { key: 'cash_cents', label: 'All cash' },
  { key: 'public_cents', label: 'City matching' },
  { key: 'individual_itemized_cents', label: 'Named individuals' },
];
const windows: { key: Window; label: string; start: string }[] = [
  { key: 'active', label: 'Since late March', start: frozenData.paceSegments[1].start },
  { key: 'year', label: 'All 2026', start: '2026-01-01' },
  { key: 'all', label: 'Since Jan. 2025', start: '2025-01-01' },
];
const colors = ['#176b58', '#a45b31', '#315b97', '#8b4f85', '#8a751e', '#45575f', '#c06962', '#5b7661', '#6866a1'];
const utc = (value: string) => Date.parse(`${value}T00:00:00Z`);
const formatDate = (value: string) => new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', timeZone: 'UTC' }).format(utc(value));
const formatMonth = (value: string) => new Intl.DateTimeFormat('en-US', { month: 'short', year: '2-digit', timeZone: 'UTC' }).format(utc(value));
const compact = (cents: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', notation: 'compact', maximumFractionDigits: 1 }).format(cents / 100);

export function CampaignTimeline() {
  const [data, setData] = useState(frozenData);
  const [refresh, setRefresh] = useState('Checking for newer filings…');
  useEffect(() => {
    const controller = new AbortController();
    fetch('/api/campaign-finance/daily', { signal: controller.signal })
      .then(async response => {
        if (!response.ok) throw new Error('Daily snapshot unavailable');
        return response.json();
      })
      .then(next => {
        if (controller.signal.aborted) return;
        setData(next as typeof frozenData);
        setRefresh(next.refresh?.status === 'validated'
          ? `Updated through ${next.end}.`
          : next.refresh?.status === 'provisional'
            ? `Updated through ${next.end} · late filings may be missing.`
          : next.refresh?.status === 'stale'
            ? `Timeline last updated through ${next.end}; newer filings are not yet shown.`
            : 'No newer verified timeline is available; showing the September 27 edition.');
      })
      .catch(() => { if (!controller.signal.aborted) setRefresh('New filings could not be checked; showing the September 27 edition.'); });
    return () => controller.abort();
  }, []);
  const [race, setRace] = useState(3);
  const [basis, setBasis] = useState<Basis>('nonmatching_cents');
  const [window, setWindow] = useState<Window>('active');
  const [selected, setSelected] = useState<string[]>(['23208', '23028', '15109', '24897']);
  const [selectedEventKey, setSelectedEventKey] = useState('2026-08-12|Council approves nonbinding Moda term sheet, 8–4');
  const chartRef = useRef<HTMLDivElement>(null);
  const [chartWidth, setChartWidth] = useState(1040);
  useEffect(() => {
    const element = chartRef.current;
    if (!element) return;
    const observer = new ResizeObserver(([entry]) => setChartWidth(Math.max(240, Math.round(entry.contentRect.width))));
    observer.observe(element);
    return () => observer.disconnect();
  }, []);
  const candidates = data.candidates.filter(candidate => candidate.raceId === `portland-district-${race}`);
  const from = windows.find(item => item.key === window)!.start;
  const points = useMemo(() => data.weekly.filter(row => selected.includes(row.committeeId) && row.weekEnd >= from), [data, selected, from]);
  const events = data.events.filter(item => item.date >= from && item.date <= data.end);
  const end = utc(data.end);
  const beginning = utc(from);
  const width = chartWidth, height = width < 600 ? 300 : 410, left = width < 600 ? 56 : 62, right = 16, top = 22, bottom = 38;
  const plotWidth = width - left - right, plotHeight = height - top - bottom;
  const max = Math.max(1, ...points.map(row => row.cumulative[basis]));
  const ceiling = Math.ceil(max / 1000000) * 1000000;
  const x = (day: string) => left + (Math.min(utc(day), end) - beginning) / (end - beginning) * plotWidth;
  const y = (cents: number) => top + (1 - cents / ceiling) * plotHeight;
  const tickCount = width < 600 ? 3 : 6;
  const months = Array.from({ length: tickCount }, (_, index) => new Date(beginning + (end - beginning) * index / (tickCount - 1)).toISOString().slice(0, 10));
  const activeEvent = data.events.find(item => `${item.date}|${item.label}` === selectedEventKey && item.date >= from);
  const before = activeEvent?.comparisons.filter(item => candidates.some(candidate => candidate.committeeId === item.committeeId)).reduce((sum, item) => sum + item.beforeCents, 0);
  const afterValues = activeEvent?.comparisons.filter(item => candidates.some(candidate => candidate.committeeId === item.committeeId));
  const after = afterValues?.every(item => item.afterCents !== null) ? afterValues.reduce((sum, item) => sum + (item.afterCents ?? 0), 0) : null;
  const eventCandidates = afterValues?.map(item => ({ ...item, name: candidates.find(candidate => candidate.committeeId === item.committeeId)?.name ?? item.committeeId }))
    .sort((a, b) => Math.abs((b.afterCents ?? b.beforeCents) - b.beforeCents) - Math.abs((a.afterCents ?? a.beforeCents) - a.beforeCents));
  const changeRace = (value: number) => {
    setRace(value);
    setSelected(data.candidates.filter(candidate => candidate.raceId === `portland-district-${value}`)
      .sort((a, b) => b.nonmatchingCents - a.nonmatchingCents).slice(0, 4).map(candidate => candidate.committeeId));
  };
  const toggleCandidate = (id: string) => setSelected(current => current.includes(id) ? current.length > 1 ? current.filter(item => item !== id) : current : [...current, id]);

  return <figure className={s.panel} data-snapshot={data.snapshot} id="cumulative-fundraising">
    <figcaption><span className={s.kicker}>Follow the pace of fundraising</span><h3>Steeper lines mean money arrived faster.</h3><p>Compare campaigns over time, then choose an event to see the week before and after.</p><p className={s.refresh} role="status">{refresh}</p></figcaption>
    <div className={s.controls}><fieldset><legend>Race</legend><div className={s.buttonRow}>{[3, 4].map(value => <button key={value} type="button" aria-pressed={race === value} onClick={() => changeRace(value)}>District {value}</button>)}</div></fieldset><label className={s.compactSelect}>Money shown<select value={basis} onChange={event => setBasis(event.target.value as Basis)}>{bases.map(item => <option key={item.key} value={item.key}>{item.label}</option>)}</select></label><label className={s.compactSelect}>Time period<select value={window} onChange={event => setWindow(event.target.value as Window)}>{windows.map(item => <option key={item.key} value={item.key}>{item.label}</option>)}</select></label></div>
    <details className={s.candidatePicker}><summary>Compare candidates · {selected.length} selected</summary><fieldset className={s.candidates}><legend>Show candidates</legend>{candidates.map((candidate, index) => <label key={candidate.committeeId}><input type="checkbox" checked={selected.includes(candidate.committeeId)} onChange={() => toggleCandidate(candidate.committeeId)} /><i style={{ background: colors[index] }} aria-hidden="true" />{candidate.name}</label>)}</fieldset></details>
    <p className={s.chartCaption}>Cumulative cash · {bases.find(item => item.key === basis)!.label}. Totals include earlier gifts.</p>
    <div className={s.chartScroll} ref={chartRef}><svg viewBox={`0 0 ${width} ${height}`} role="img" aria-label={`Cumulative cash, ${bases.find(item => item.key === basis)!.label.toLowerCase()}, for selected District ${race} candidates, ${from} through ${data.end}`}>
      <rect x={left} y={top} width={plotWidth} height={plotHeight} fill="#fffdf8" />
      {Array.from({ length: 5 }, (_, index) => { const value = ceiling * index / 4; return <g key={index}><line x1={left} x2={width - right} y1={y(value)} y2={y(value)} stroke="#dce4dc" /><text x={left - 10} y={y(value) + 4} textAnchor="end" fontSize="13" fill="#53675d">{compact(value)}</text></g>; })}
      {months.map((day,index) => <g key={day}><line x1={x(day)} x2={x(day)} y1={top} y2={height - bottom} stroke="#edf0e9" /><text x={x(day)} y={height - bottom + 24} textAnchor={index===0?'start':index===months.length-1?'end':'middle'} fontSize="12" fill="#53675d">{formatMonth(day)}</text></g>)}
      {activeEvent && <g><line x1={x(activeEvent.date)} x2={x(activeEvent.date)} y1={top} y2={height - bottom} stroke="#a76e20" strokeWidth="2" strokeDasharray="5 4"/><text x={Math.min(width-18,Math.max(left+65,x(activeEvent.date)))} y={14} textAnchor="end" fontSize="12" fill="#80521a">{formatDate(activeEvent.date)}</text></g>}
      {candidates.filter(candidate => selected.includes(candidate.committeeId)).map(candidate => { const candidatePoints = points.filter(row => row.committeeId === candidate.committeeId).sort((a, b) => a.weekEnd.localeCompare(b.weekEnd)); const color = colors[candidates.indexOf(candidate)]; return <g key={candidate.committeeId}><polyline fill="none" stroke={color} strokeWidth="3.5" strokeLinejoin="round" points={candidatePoints.map(row => `${x(row.weekEnd)},${y(row.cumulative[basis])}`).join(' ')} /><circle cx={x(candidatePoints.at(-1)?.weekEnd ?? data.end)} cy={y(candidatePoints.at(-1)?.cumulative[basis] ?? 0)} r="5" fill={color} /></g>; })}
    </svg></div>
    <div className={s.lineKey}>{candidates.filter(candidate => selected.includes(candidate.committeeId)).map(candidate => <span key={candidate.committeeId}><i style={{ background: colors[candidates.indexOf(candidate)] }} />{candidate.name}: {money(points.filter(row => row.committeeId === candidate.committeeId).at(-1)?.cumulative[basis] ?? 0)}</span>)}</div>
    <label className={s.eventSelect}>Choose an event · marked by the gold line<select value={activeEvent ? selectedEventKey : ''} onChange={event=>setSelectedEventKey(event.target.value)}><option value="" disabled>Select an event</option>{events.map(item=><option key={item.date+'|'+item.label} value={item.date+'|'+item.label}>{formatDate(item.date)} · {item.label}</option>)}</select></label>
    <div className={s.eventFocus}><strong>{activeEvent ? `${formatDate(activeEvent.date)}: ${activeEvent.label}` : 'Select a date below'}</strong>{activeEvent && <><p>Cash excluding City matches across these {candidates.length} campaigns: {money(before ?? 0)} in the seven days before; {after === null ? 'not enough later data yet' : money(after)} in the seven days after. The event day is left out.</p><small>{activeEvent.dateKind}. {activeEvent.limitation || 'Other events, fundraising appeals and filing delays could also explain the change.'} <a href={activeEvent.sourceUrl} target="_blank" rel="noopener noreferrer">Dated source</a></small><details className={s.eventComparison}><summary>See each candidate’s amounts</summary><div className={s.tableScroll} role="region" tabIndex={0} aria-label="Candidate event-window comparison"><table><thead><tr><th scope="col">Candidate</th><th scope="col">Before</th><th scope="col">After</th><th scope="col">Difference</th></tr></thead><tbody>{eventCandidates?.map(item => <tr key={item.committeeId}><th scope="row">{item.name}</th><td>{money(item.beforeCents)}</td><td>{item.afterCents === null ? 'Incomplete' : money(item.afterCents)}</td><td>{item.afterCents === null ? '—' : money(item.afterCents - item.beforeCents)}</td></tr>)}</tbody></table></div><p>Based on the dates in filings. A missing later week is not filled in or guessed.</p></details></>}</div>
    <details className={s.eventLedger}><summary>All {events.length} events and sources</summary><ol>{events.map(item => <li key={`${item.date}-${item.label}`}><button type="button" onClick={() => setSelectedEventKey(`${item.date}|${item.label}`)} aria-pressed={selectedEventKey === `${item.date}|${item.label}`}><time dateTime={item.date}>{formatDate(item.date)}</time> <strong>{item.label}</strong></button><span>{item.category === 'moda' ? 'Moda Center' : item.category === 'campaign' ? 'Campaign' : 'City'} · {item.dateKind} · <a href={item.sourceUrl} target="_blank" rel="noopener noreferrer">source</a></span></li>)}</ol></details>
    <p className={s.note}>Events provide context, not proof of what caused a gift. Recent filings may change. This timeline uses the latest imported data; other researched charts retain their September 27 date.</p>
    <p className={s.links}><a href="/data/campaign-finance/story/candidate-cumulative-weekly.csv" download>Download weekly totals</a><a href="/data/campaign-finance/story/active-campaign-events.csv" download>Download event list</a><a href="/api/campaign-finance/daily" download="campaign-timeline-current.json">Download latest checked timeline data</a></p>
  </figure>;
}

export function CandidateDonorDossier() {
  const [id, setId] = useState('23365');
  const candidate = data.candidates.find(item => item.committeeId === id)!;
  const peakWeeks = data.weekly.filter(item => item.committeeId === id && item.weekStart >= '2026-01-05')
    .sort((a, b) => b.weekly.nonmatching_cents - a.weekly.nonmatching_cents).slice(0, 3);
  const topDonors = candidate.topDonors.slice(0, 5);
  const largestDonor = Math.max(1, ...topDonors.map(donor => donor.grossCents));
  const largestWeek = Math.max(1, ...peakWeeks.map(item => item.weekly.nonmatching_cents));
  const allCandidates = new Map(data.candidates.map(item => [item.committeeId, item.name]));
  const percent = (value: number, total: number) => total ? (100 * value / total).toFixed(1) + '%' : '0%';
  return <figure className={s.panel} id="donor-dossiers" data-snapshot={data.snapshot}>
    <figcaption className={s.dossierHeading}>
      <div><span className={s.kicker}>17 reviewed campaigns · pick one</span><h3>Follow one candidate’s money.</h3></div>
      <label className={s.selectLabel}>Candidate <select value={id} onChange={event => setId(event.target.value)}>{data.candidates.map(item => <option value={item.committeeId} key={item.committeeId}>{item.name} · District {item.raceId.endsWith('3') ? 3 : 4}</option>)}</select></label>
    </figcaption>
    <div className={s.fundingVisual}>
      <div className={s.fundingTotal}><span>Total cash raised</span><strong>{money(candidate.cashCents)}</strong></div>
      <div className={s.fundingBar} role="img" aria-label={money(candidate.nonmatchingCents) + ' cash outside City matching; ' + money(candidate.publicCents) + ' City matching money'}><span style={{ width: percent(candidate.nonmatchingCents, candidate.cashCents) }} /><span style={{ width: percent(candidate.publicCents, candidate.cashCents) }} /></div>
      <div className={s.fundingLegend}><div><i className={s.privateKey} /><span>Outside City matches</span><strong>{money(candidate.nonmatchingCents)}</strong></div><div><i className={s.publicKey} /><span>City matching</span><strong>{money(candidate.publicCents)}</strong></div></div>
    </div>
    <div className={s.dossierGrid}>
      <section className={s.dossierBlock}><h4>Where did the non-City cash come from?</h4>
        <div className={s.stacked} role="img" aria-label={'Reported inside district ' + money(candidate.geography.insideCents) + ', outside district ' + money(candidate.geography.outsideCents) + ', location unknown ' + money(candidate.geography.uncertainCents)}><span style={{ width: percent(candidate.geography.insideCents, candidate.nonmatchingCents), background: '#176b58' }} /><span style={{ width: percent(candidate.geography.outsideCents, candidate.nonmatchingCents), background: '#b27641' }} /><span style={{ width: percent(candidate.geography.uncertainCents, candidate.nonmatchingCents), background: '#a5ada6' }} /></div>
        <div className={s.locationRows}><div><i className={s.insideKey} /><span>Inside district</span><strong>{money(candidate.geography.insideCents)}</strong><small>{candidate.geography.insideRecords} records</small></div><div><i className={s.outsideKey} /><span>Outside district</span><strong>{money(candidate.geography.outsideCents)}</strong><small>{candidate.geography.outsideRecords} records</small></div><div><i className={s.unknownKey} /><span>Location unknown</span><strong>{money(candidate.geography.uncertainCents)}</strong><small>{candidate.geography.uncertainRecords} records</small></div></div>
      </section>
      <section className={s.dossierBlock}><h4>How spread out were the named gifts?</h4>
        <div className={s.concentrationNumber}><strong>{percent(candidate.topFiveVisibleShare ?? 0, 1)}</strong><span>of identifiable gift dollars came from the five largest donor entries</span></div>
        <div className={s.concentrationBar} role="img" aria-label={'Five largest donor entries: ' + percent(candidate.topFiveVisibleShare ?? 0, 1) + ' of identifiable gift dollars'}><span style={{ width: percent(candidate.topFiveVisibleShare ?? 0, 1) }} /></div>
        <div className={s.namedContext}><strong>{candidate.visibleGroups}</strong> donor entries · <strong>{money(candidate.visibleItemizedCents)}</strong> in identifiable gifts</div>
      </section>
    </div>
    <div className={s.dossierGrid}>
      <section className={s.dossierBlock}><h4>Largest reported givers</h4>
        <ol className={s.donorBars}>{topDonors.map(donor => <li key={donor.entityId}><div><a href={'/deep-dives/campaign-finance/entities/' + encodeURIComponent(donor.entityId)}>{donor.name}</a><strong>{money(donor.grossCents)}</strong></div><span className={s.donorTrack} aria-hidden="true"><span style={{ width: percent(donor.grossCents, largestDonor) }} /></span>{donor.otherSupport.length > 0 && <small>Also gave to {donor.otherSupport.map(other => allCandidates.get(other.committeeId) + ' ' + money(other.grossCents)).join(' · ')}</small>}{donor.refundCents > 0 && <small>{money(donor.refundCents)} later refunded</small>}</li>)}</ol>
      </section>
      <section className={s.dossierBlock}><h4>Three biggest fundraising weeks in 2026</h4>
        <ol className={s.weekBars}>{peakWeeks.map(item => <li key={item.weekStart}><div><time dateTime={item.weekStart}>{formatDate(item.weekStart)}–{formatDate(item.weekEnd)}</time><strong>{money(item.weekly.nonmatching_cents)}</strong></div><span className={s.weekTrack} aria-hidden="true"><span style={{ width: percent(item.weekly.nonmatching_cents, largestWeek) }} /></span></li>)}</ol>
        <p className={s.weekCaption}>Cash outside City matches · Monday–Sunday</p>
      </section>
    </div>
    <details className={s.dossierDetails}><summary>See all 15 largest donor entries and their other gifts</summary><div className={s.tableScroll} role="region" tabIndex={0} aria-label={'Top reported donors for ' + candidate.name}><table><caption>Reported gifts to {candidate.name}, before refunds</caption><thead><tr><th scope="col">Donor or group</th><th scope="col">To {candidate.name}</th><th scope="col">Other reviewed candidates</th></tr></thead><tbody>{candidate.topDonors.map(donor => <tr key={donor.entityId}><th scope="row"><a href={'/deep-dives/campaign-finance/entities/' + encodeURIComponent(donor.entityId)}>{donor.name}</a><small>{donor.bookType} · {donor.records} gift record{donor.records === 1 ? '' : 's'}</small></th><td>{money(donor.grossCents)}{donor.refundCents > 0 && <small>{money(donor.refundCents)} observed refunds</small>}</td><td>{donor.otherSupport.length ? donor.otherSupport.map(other => allCandidates.get(other.committeeId) + ' ' + money(other.grossCents)).join(' · ') : 'None found among these 17 campaigns'}</td></tr>)}</tbody></table></div></details>
    <details className={s.dossierDetails}><summary>What these numbers can and cannot tell us</summary><p>These are reported gifts from January 2025 through September 2026. Donor amounts are before refunds. Similar names stay separate unless other filing details match. Unnamed gifts cannot be assigned to people; City matching deposits cannot be placed at a donor address. “Inside district” uses a reported address or ZIP, which may be a home, office or mailing address—not verified residence. Street addresses are not published. Peak weeks show transaction dates, not what caused the gifts.</p></details>
    <p className={s.links}><a href="/data/campaign-finance/story/donor-candidate-complete-ledger.csv" download>Download donor gifts</a><a href="/data/campaign-finance/zip-map/candidate-district-address-summary.csv" download>Download district totals</a></p>
  </figure>;
}

export function CrossListSupport() {
  const names = new Map(data.candidates.map(item => [item.committeeId, item.name]));
  return <figure className={s.panel} data-snapshot={data.snapshot}><figcaption><span className={s.kicker}>Donors who crossed the lists</span><h3>Four donor entries gave across both endorsement lists.</h3><p>Each gave to at least one candidate on each reviewed endorsement list. That shows a wider giving pattern, not why they gave.</p></figcaption><div className={s.crossGrid}>{data.crossList.map(row => <div className={s.crossCard} key={row.entityId}><strong>{row.name}</strong><small>{row.bookType} · {row.identityStatus === 'authoritative_committee_id' ? 'verified committee ID' : 'matched filing entry'}</small><div>{row.support.map(item => <p key={item.committeeId}><span>{names.get(item.committeeId)}</span><b>{money(item.grossCents)}</b></p>)}</div></div>)}</div><p className={s.note}>Only entries matched closely across filings appear here. Donors not shown may still give to multiple candidates, and these gifts do not reveal anyone’s motive.</p></figure>;
}
