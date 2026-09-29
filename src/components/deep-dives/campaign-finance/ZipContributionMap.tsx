'use client';

import { useEffect, useMemo, useState } from 'react';
import { money } from '@/lib/campaign-finance/filters';
import data from '@/lib/campaign-finance/zip-map-data.json';
import districtZip from '@/lib/campaign-finance/district-zip-data.json';
import origin from '@/lib/campaign-finance/district-address-data.json';
import s from './zip-map.module.css';

type Shape = { type: 'Feature'; properties: { GEOID: string }; geometry: { type: 'Polygon' | 'MultiPolygon'; coordinates: number[][][] | number[][][][] } };
type Shapes = { type: 'FeatureCollection'; features: Shape[] };
type Candidate = typeof data.candidates[number];
type MapSubject = { candidate: string; cashCents: number; coverageCents: Record<string, number | undefined>; zipTotals: Candidate['zipTotals'][number][] };
type ViewMode = 'candidate' | 'district';
const races = [{ id: 'portland-district-3', label: 'District 3' }, { id: 'portland-district-4', label: 'District 4' }, { id: 'portland-auditor', label: 'Auditor' }];
const colors = ['#e0ede3', '#aacdb3', '#6da889', '#377b5b', '#12523b'];
const coverage = (candidate: MapSubject, key: string) => candidate.coverageCents[key] ?? 0;
const nameOrder = (a: Candidate, b: Candidate) => b.cashCents - a.cashCents || a.candidate.localeCompare(b.candidate);
const polygons = (shape: Shape) => shape.geometry.type === 'Polygon'
  ? [shape.geometry.coordinates as number[][][]]
  : shape.geometry.coordinates as number[][][][];

function paths(shapes: Shapes) {
  const xy: number[][] = [];
  for (const feature of shapes.features) for (const poly of polygons(feature)) for (const ring of poly) for (const [lon, lat] of ring) xy.push([lon * .7, -lat]);
  const xs = xy.map(p => p[0]), ys = xy.map(p => p[1]);
  const xmin = Math.min(...xs), xmax = Math.max(...xs), ymin = Math.min(...ys), ymax = Math.max(...ys);
  const scale = Math.min(772 / (xmax - xmin), 552 / (ymax - ymin));
  const xoffset = (800 - (xmax - xmin) * scale) / 2, yoffset = (580 - (ymax - ymin) * scale) / 2;
  const point = ([lon, lat]: number[]) => `${((lon * .7 - xmin) * scale + xoffset).toFixed(1)},${((-lat - ymin) * scale + yoffset).toFixed(1)}`;
  return shapes.features.map(feature => ({
    zip5: feature.properties.GEOID,
    d: polygons(feature).map(poly => poly.map(ring => ring.map((p, i) => `${i ? 'L' : 'M'}${point(p)}`).join(' ') + ' Z').join(' ')).join(' '),
  }));
}

export default function ZipContributionMap() {
  const [committeeId, setCommitteeId] = useState('23208');
  const [raceId, setRaceId] = useState('portland-district-3');
  const [viewMode, setViewMode] = useState<ViewMode>('candidate');
  const [shapes, setShapes] = useState<Shapes | null>(null);
  const [boundaryError, setBoundaryError] = useState(false);
  const [selectedZip, setSelectedZip] = useState<string | null>(null);
  const [showAll, setShowAll] = useState(false);
  const [extent, setExtent] = useState<'core' | 'metro'>('core');
  useEffect(() => {
    const params = new URL(window.location.href).searchParams;
    const id = params.get('committee');
    const selected = data.candidates.find(candidate => candidate.committeeId === id);
    const race = params.get('race');
    if (params.get('view') === 'district' && (race === 'portland-district-3' || race === 'portland-district-4')) {
      setRaceId(race);
      setCommitteeId(data.candidates.filter(candidate => candidate.raceId === race).sort(nameOrder)[0].committeeId);
      setViewMode('district');
    } else if (selected) {
      setCommitteeId(selected.committeeId);
      setRaceId(selected.raceId);
    }
  }, []);
  useEffect(() => {
    const controller = new AbortController();
    fetch(data.boundaryPath, { signal: controller.signal }).then(async response => {
      if (!response.ok) throw new Error(`Boundary HTTP ${response.status}`);
      return response.json() as Promise<Shapes>;
    }).then(value => {
      if (value.type !== 'FeatureCollection' || value.features.length !== 109) throw new Error('Boundary count mismatch');
      setShapes(value);
    }).catch(error => { if (error.name !== 'AbortError') setBoundaryError(true); });
    return () => controller.abort();
  }, []);
  const candidate = data.candidates.find(c => c.committeeId === committeeId) ?? data.candidates.find(c => c.committeeId === '23208')!;
  const inRace = data.candidates.filter(c => c.raceId === raceId).sort(nameOrder);
  const district = districtZip.races.find(race => race.raceId === raceId);
  const subject = viewMode === 'district' && raceId !== 'portland-auditor' ? district! : candidate;
  const values = useMemo(() => new Map(subject.zipTotals.map(row => [row.zip5, row])), [subject]);
  const drawn = useMemo(() => shapes ? paths(shapes) : [], [shapes]);
  const mappedRows = subject.zipTotals.filter(row => row.mapped).sort((a, b) => b.cents - a.cents || a.zip5.localeCompare(b.zip5));
  const allRows = [...subject.zipTotals].sort((a, b) => b.cents - a.cents || a.zip5.localeCompare(b.zip5));
  const listed = showAll ? allRows : mappedRows.slice(0, 12);
  const top = mappedRows[0];
  const picked = values.get(selectedZip ?? top?.zip5 ?? '');
  const originRows = viewMode === 'candidate'
    ? origin.candidates.filter(row => row.committeeId === candidate.committeeId)
    : origin.candidates.filter(row => row.raceId === raceId);
  type OriginRow = typeof origin.candidates[number];
  const districtOrigin: OriginRow | undefined = originRows.length ? {
    ...originRows[0],
    cashCents: originRows.reduce((sum, row) => sum + row.cashCents, 0),
    cashRecords: originRows.reduce((sum, row) => sum + row.cashRecords, 0),
    categories: Object.fromEntries(Object.keys(originRows[0].categories).map(key => [key, {
      cents: originRows.reduce((sum, row) => sum + row.categories[key as keyof OriginRow['categories']].cents, 0),
      records: originRows.reduce((sum, row) => sum + row.categories[key as keyof OriginRow['categories']].records, 0),
    }])) as OriginRow['categories'],
  } : undefined;
  const inside = districtOrigin ? { cents: districtOrigin.categories.address_inside.cents + districtOrigin.categories.zip_inside.cents, records: districtOrigin.categories.address_inside.records + districtOrigin.categories.zip_inside.records } : null;
  const outside = districtOrigin ? { cents: districtOrigin.categories.address_outside.cents + districtOrigin.categories.state_outside.cents + districtOrigin.categories.zip_outside.cents, records: districtOrigin.categories.address_outside.records + districtOrigin.categories.state_outside.records + districtOrigin.categories.zip_outside.records } : null;
  const geographicUnknown = districtOrigin?.categories.uncertain;
  const nonpublicCents = districtOrigin ? districtOrigin.cashCents - districtOrigin.categories.public.cents : 0;
  const max = top?.cents ?? 0;
  const bucket = (cents: number) => cents <= max * .02 ? 0 : cents <= max * .08 ? 1 : cents <= max * .2 ? 2 : cents <= max * .5 ? 3 : 4;
  const updateUrl = (mode: ViewMode, race: string, id: string) => {
    const url = new URL(window.location.href);
    if (mode === 'district' && race !== 'portland-auditor') {
      url.searchParams.delete('committee');
      url.searchParams.set('view', 'district');
      url.searchParams.set('race', race);
    } else {
      url.searchParams.set('committee', id);
      url.searchParams.delete('view');
      url.searchParams.delete('race');
    }
    url.hash = 'zip-map';
    window.history.replaceState(null, '', url);
  };
  const change = (id: string) => {
    const selected = data.candidates.find(row => row.committeeId === id);
    if (!selected) return;
    setCommitteeId(id); setRaceId(selected.raceId); setSelectedZip(null); setShowAll(false);
    updateUrl('candidate', selected.raceId, id);
  };
  const changeRace = (id: string) => {
    const first = data.candidates.filter(row => row.raceId === id).sort(nameOrder)[0];
    const nextMode = id === 'portland-auditor' ? 'candidate' : viewMode;
    setRaceId(id); setCommitteeId(first.committeeId); setViewMode(nextMode);
    setSelectedZip(null); setShowAll(false);
    updateUrl(nextMode, id, first.committeeId);
  };
  const changeView = (mode: ViewMode) => {
    setViewMode(mode); setSelectedZip(null); setShowAll(false);
    updateUrl(mode, raceId, candidate.committeeId);
  };
  return <div className={s.explorer} data-snapshot={data.snapshot}>
    <div className={s.controls}><fieldset><legend>Race</legend><div className={s.races}>{races.map(r => <button key={r.id} type="button" aria-pressed={raceId === r.id} onClick={() => changeRace(r.id)}>{r.label}</button>)}</div></fieldset>
      {raceId !== 'portland-auditor' && <fieldset><legend>Show</legend><div className={s.races}><button type="button" aria-pressed={viewMode === 'candidate'} onClick={() => changeView('candidate')}>One candidate</button><button type="button" aria-pressed={viewMode === 'district'} onClick={() => changeView('district')}>All reviewed candidates</button></div></fieldset>}
      {viewMode === 'candidate' || raceId === 'portland-auditor' ? <label className={s.candidate}>Candidate <select value={candidate.committeeId} onChange={event => change(event.target.value)}>{inRace.map(c => <option key={c.committeeId} value={c.committeeId}>{c.candidate}</option>)}</select></label> : <div className={s.aggregateLabel}><strong>{subject.candidate}</strong><span>Combines {inRace.length} of {district?.rosteredCandidates} candidates with reviewed records. Other candidates are missing, not counted as $0.</span></div>}</div>
    {districtOrigin && inside && outside && geographicUnknown ? <section className={s.origin} aria-label={`District ${districtOrigin.district} reported-source comparison`}><div className={s.originHeading}><div><h3>How much came from District {districtOrigin.district}?</h3><p>{viewMode === 'district' ? 'All reviewed campaigns in this district are combined.' : 'This candidate’s reported contributions are shown.'} We place a reported source inside or outside only when its address or ZIP is clear. The rest stays unknown.</p></div><a href={origin.evidencePath} download>Download all candidate totals</a></div><div className={s.originCards}><div><span>Reported inside District {districtOrigin.district}</span><strong>{money(inside.cents)}</strong><small>{inside.records.toLocaleString()} contribution records · {districtOrigin.categories.address_inside.records} exact address matches ({money(districtOrigin.categories.address_inside.cents)})</small></div><div><span>Reported outside District {districtOrigin.district}</span><strong>{money(outside.cents)}</strong><small>{outside.records.toLocaleString()} contribution records · {districtOrigin.categories.address_outside.records} exact address matches ({money(districtOrigin.categories.address_outside.cents)})</small></div><div><span>Location unknown</span><strong>{money(geographicUnknown.cents)}</strong><small>{geographicUnknown.records.toLocaleString()} contribution records</small></div></div><div className={s.originBar} role="img" aria-label={`For cash outside City matches: ${money(inside.cents)} classified inside, ${money(outside.cents)} outside, and ${money(geographicUnknown.cents)} uncertain`}><span style={{width:nonpublicCents ? `${100*inside.cents/nonpublicCents}%` : '0%'}}/><span style={{width:nonpublicCents ? `${100*outside.cents/nonpublicCents}%` : '0%'}}/><span style={{width:nonpublicCents ? `${100*geographicUnknown.cents/nonpublicCents}%` : '0%'}}/></div><p className={s.originCaveat}>The three categories cover {money(nonpublicCents)} in cash outside City matches. Another {money(districtOrigin.categories.public.cents)} came from City matching payments, which have no donor location.</p><details className={s.originDetails}><summary>How exact are these classifications?</summary><div className={s.tableWrap}><table><thead><tr><th scope="col">Evidence</th><th scope="col">Cash</th><th scope="col">Transactions</th></tr></thead><tbody><tr><th scope="row">Exact City address point inside District {districtOrigin.district}</th><td>{money(districtOrigin.categories.address_inside.cents)}</td><td>{districtOrigin.categories.address_inside.records}</td></tr><tr><th scope="row">Exact City address point outside District {districtOrigin.district}</th><td>{money(districtOrigin.categories.address_outside.cents)}</td><td>{districtOrigin.categories.address_outside.records}</td></tr><tr><th scope="row">Reported state outside Oregon</th><td>{money(districtOrigin.categories.state_outside.cents)}</td><td>{districtOrigin.categories.state_outside.records}</td></tr><tr><th scope="row">Unmatched ZIP area wholly inside</th><td>{money(districtOrigin.categories.zip_inside.cents)}</td><td>{districtOrigin.categories.zip_inside.records}</td></tr><tr><th scope="row">Unmatched ZIP area wholly outside</th><td>{money(districtOrigin.categories.zip_outside.cents)}</td><td>{districtOrigin.categories.zip_outside.records}</td></tr><tr><th scope="row">Aggregate, ambiguous or unlocated</th><td>{money(geographicUnknown.cents)}</td><td>{geographicUnknown.records}</td></tr></tbody></table></div></details><p className={s.originCaveat}>A reported address may be a home, office, mailing address or PO box. It does not prove where someone lives or votes. We publish only combined totals, never street addresses. ZIP areas that cross a district line stay unknown. <a href={origin.evidencePath} download>Anonymous candidate-level CSV</a> · <a href="https://www.portlandmaps.com/od/rest/services/COP_OpenData_Property/MapServer/1272">City address-point source</a> · <a href="https://www.portlandmaps.com/od/rest/services/COP_OpenData_Boundary/MapServer/1413">Official district boundary</a>.</p></section> : <p className={s.originNotApplicable}>The auditor race is citywide, so there is no council district to compare.</p>}
    <div className={s.summary}><div><span>Cash from ZIPs shown</span><strong>{money(coverage(subject, 'mapped'))}</strong><small>{mappedRows.length} reported ZIPs shown</small></div><div><span>Other reported ZIPs</span><strong>{money(coverage(subject, 'other_zip'))}</strong><small>Not drawn on this map</small></div><div><span>Cash without a usable ZIP</span><strong>{money(coverage(subject, 'unidentified') + coverage(subject, 'missing_zip') + coverage(subject, 'invalid_zip'))}</strong><small>Unnamed source or missing ZIP</small></div><div><span>City matching money</span><strong>{money(coverage(subject, 'public'))}</strong><small>Public money has no donor ZIP</small></div></div>
    <div className={s.grid}><div className={s.mapPanel}><div className={s.viewSwitch}><span>Map view</span><button type="button" aria-pressed={extent === 'core'} onClick={() => setExtent('core')}>Portland area</button><button type="button" aria-pressed={extent === 'metro'} onClick={() => setExtent('metro')}>Wider region</button></div>
      {boundaryError ? <p role="alert">The boundary file could not be loaded. Exact ZIP totals remain available in the table and CSV.</p> : !shapes ? <p role="status">Loading the local Census boundary file…</p> : <svg className={s.map} viewBox={extent === 'core' ? '250 160 260 220' : '0 0 800 580'} role="img" aria-label={`Map of reported cash contributions excluding City matches by ZIP for ${subject.candidate}. Exact figures follow in the table.`}>{drawn.map(shape => { const value = values.get(shape.zip5); const active = shape.zip5 === (selectedZip ?? top?.zip5); return <path key={shape.zip5} d={shape.d} fill={value?.cents ? colors[bucket(value.cents)] : '#f4f2ea'} fillRule="evenodd" stroke={active ? '#1b3327' : '#fffdf8'} strokeWidth={active ? 2.5 : 1} role={value ? 'button' : undefined} tabIndex={value ? 0 : undefined} aria-label={value ? `ZIP ${shape.zip5}, ${money(value.cents)}, ${value.records} records` : `ZIP ${shape.zip5}, no mapped contribution records`} onClick={() => setSelectedZip(shape.zip5)} onKeyDown={event => { if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); setSelectedZip(shape.zip5); } }}><title>ZIP {shape.zip5}: {value ? money(value.cents) : 'no mapped cash records'}</title></path>; })}</svg>}
      <div className={s.legend}><span><i style={{background:'#f4f2ea'}} />No mapped records</span>{colors.map((color, i) => <span key={color}><i style={{background:color}} />{i === 0 ? `≤ ${money(max * .02)}` : i === 4 ? `> ${money(max * .5)}` : `≤ ${money(max * [.02, .08, .2, .5][i])}`}</span>)}</div><p className={s.cropNote}>{extent === 'core' ? 'Close-up crops the regional extent; use Full regional extent to see every shaded ZIP.' : 'The wider map shows every ZIP area used here.'}</p>
    </div><aside className={s.readout}><span className={s.eyebrow}>Selected ZIP</span><strong>{picked ? picked.zip5 : 'No mappable ZIP'}</strong><p>{picked ? money(picked.cents) : 'No reported cash with a ZIP inside the map boundary.'}</p>{picked && <small>{picked.records} contribution record{picked.records === 1 ? '' : 's'} · {picked.mapped ? 'shown on map' : 'no local polygon'}</small>}<p className={s.note}>These are dollars linked to a reported ZIP, not a count of people or proof of residence.</p></aside></div>
    <details className={s.details} open={showAll}><summary onClick={event => { event.preventDefault(); setShowAll(!showAll); }}>Exact ZIP totals {showAll ? '(all valid ZIPs)' : '(top 12 mapped)'}</summary><div className={s.tableWrap}><table><caption>{subject.candidate}: reported cash excluding City matches by five-digit ZIP</caption><thead><tr><th scope="col">Reported ZIP</th><th scope="col">Cash</th><th scope="col">Records</th><th scope="col">On map?</th></tr></thead><tbody>{listed.map(row => <tr key={row.zip5}><th scope="row"><button type="button" onClick={() => setSelectedZip(row.zip5)}>{row.zip5}</button></th><td>{money(row.cents)}</td><td>{row.records}</td><td>{row.mapped ? 'Yes' : 'Not mapped'}</td></tr>)}</tbody></table></div></details>
    <p className={s.note}>The four amounts above add to {money(subject.cashCents)} in reported cash. City matching money is shown separately because it cannot be tied to a donor neighborhood. <a href={data.evidencePath} download>Download the full ZIP table</a>.</p>
    <p className={s.links}>{viewMode === 'district' && raceId !== 'portland-auditor' && <><a href="/data/campaign-finance/zip-map/district-zip-totals.csv" download>Download district–ZIP totals (CSV)</a><a href="/data/campaign-finance/zip-map/district-coverage.csv" download>Download district cash coverage (CSV)</a></>}<a href={data.evidencePath} download>Download every candidate–ZIP total (CSV)</a><a href={data.boundaryPath} download>Download map outlines</a><a href="https://www.census.gov/programs-surveys/geography/guidance/geo-areas/zctas.html">How Census ZIP areas work</a></p>
  </div>;
}
