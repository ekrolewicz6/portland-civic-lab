'use client';

import {useState} from 'react';
import data from '@/lib/campaign-finance/major-donor-matrix.json';
import {money} from '@/lib/campaign-finance/filters';
import s from './major-donor-matrix.module.css';

type Kind = 'all' | 'individual' | 'organization' | 'family';
const races = [
  {id:'portland-district-3',label:'District 3'},
  {id:'portland-district-4',label:'District 4'},
] as const;
const kinds: {id:Kind;label:string}[] = [
  {id:'all',label:'All shown donors'},
  {id:'individual',label:'People'},
  {id:'organization',label:'Organizations & PACs'},
  {id:'family',label:'Candidate & family'},
];
type Row = typeof data.rows[number];
const raceGross = (row:Row, candidateIds:Set<string>) =>
  row.support.reduce((sum, support) => sum + (candidateIds.has(support.committeeId) ? support.grossCents : 0), 0);
const includesKind = (row:Row, kind:Kind) =>
  kind === 'all' || (kind === 'individual' ? row.bookType === 'Individual'
    : kind === 'family' ? row.bookType === 'Candidate & Immediate Family'
    : row.bookType !== 'Individual' && row.bookType !== 'Candidate & Immediate Family');

export default function MajorDonorMatrix() {
  const [raceId, setRaceId] = useState<string>('portland-district-3');
  const [kind, setKind] = useState<Kind>('all');
  const [showAll, setShowAll] = useState(false);
  const candidates = data.candidates.filter(candidate => candidate.raceId === raceId);
  const candidateIds = new Set(candidates.map(candidate => candidate.committeeId));
  const rows = data.rows
    .filter(row => includesKind(row, kind) && raceGross(row, candidateIds) > 0)
    .sort((a,b) => raceGross(b,candidateIds) - raceGross(a,candidateIds) || a.name.localeCompare(b.name));
  const visible = showAll ? rows : rows.slice(0,25);
  const switchRace = (id:string) => {setRaceId(id);setShowAll(false);};
  const switchKind = (value:Kind) => {setKind(value);setShowAll(false);};
  return <figure className={s.figure} id="major-donors" data-snapshot={data.snapshot}>
    <figcaption><span className={s.kicker}>Named donor and organization records</span><h3>Who gave how much to whom?</h3><p>Each cell shows how much that person or group gave a candidate. Giving money is not the same as endorsing someone.</p></figcaption>
    <div className={s.filters}><fieldset><legend>Race</legend><div className={s.buttons}>{races.map(race => <button key={race.id} type="button" aria-pressed={raceId === race.id} onClick={() => switchRace(race.id)}>{race.label}</button>)}</div></fieldset><fieldset><legend>Donor type</legend><div className={s.buttons}>{kinds.map(option => <button key={option.id} type="button" aria-pressed={kind === option.id} onClick={() => switchKind(option.id)}>{option.label}</button>)}</div></fieldset></div>
    <p className={s.count}>Showing {visible.length} of {rows.length} selected donor entries in {races.find(race => race.id===raceId)?.label}, largest dollar totals first.</p>
    <div className={s.tableWrap} role="region" tabIndex={0} aria-label={`Reported donor amounts to ${races.find(race=>race.id===raceId)?.label} candidates; scroll horizontally for every candidate`}>
      <table><caption>Reported cash contributions before refunds by named donor entry and candidate, January 1, 2025–September 27, 2026</caption><thead><tr><th scope="col">Donor or group</th><th scope="col">Race total</th>{candidates.map(candidate => <th scope="col" key={candidate.committeeId}><a href={candidate.href}>{candidate.name}</a></th>)}</tr></thead><tbody>{visible.map(row => <tr key={row.entityId}><th scope="row"><span className={s.name}>{row.name}{row.groupCode && <small> · entry {row.groupCode}</small>}</span><small>{row.bookType}{row.identityStatus === 'authoritative_committee_id' ? ' · verified committee ID' : ' · matched filing entry'}</small></th><td className={s.total}>{money(raceGross(row,candidateIds))}</td>{candidates.map(candidate => {const support=row.support.find(item=>item.committeeId===candidate.committeeId);return <td key={candidate.committeeId} data-positive={Boolean(support?.grossCents)}>{support ? <><strong>{money(support.grossCents)}</strong><small>{support.records} gift record{support.records===1?'':'s'}{support.refundCents>0 ? ` · ${money(support.refundCents)} refunded` : ''}</small></> : <span aria-label="No linked contribution in these records">—</span>}</td>;})}</tr>)}</tbody></table>
    </div>
    {rows.length>25 && <button className={s.more} type="button" aria-expanded={showAll} onClick={()=>setShowAll(!showAll)}>{showAll?'Show top 25':`Show all ${rows.length} donor entries`}</button>}
    <p className={s.note}>This chart includes named organizations and people who gave at least {money(data.individualMinimumCents)} across these 17 campaigns. A dash means no donation was found here, not opposition. Amounts are before refunds; refunds appear in affected cells.</p>
    <p className={s.note}>Filing names are not verified identities. We keep same-name entries separate when other details differ. Anonymous gifts, City matching, loans and noncash support are not in this chart. <a href="/deep-dives/campaign-finance/methodology">How we match donor records</a>.</p>
    <p className={s.links}><a href={data.evidencePath} download>Download chart amounts</a><a href={data.fullLedgerPath} download>Download all named donor–candidate records</a></p>
  </figure>;
}
