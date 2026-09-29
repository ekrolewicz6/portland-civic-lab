'use client';

import { useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import { BASE, money } from '@/lib/campaign-finance/filters';
import type { ContributionRecord } from '@/lib/campaign-finance/donation-records';
import type { CommitteeFacts } from '@/lib/campaign-finance/candidate-facts';
import styles from './candidate-finance.module.css';

type View = 'all' | 'named' | 'unidentified';
type Props = {
  committeeId: string;
  rows: ContributionRecord[];
  topSources: CommitteeFacts['topSources'];
  publicCents: number;
};

const isNamed = (row: ContributionRecord) => row.category !== 'public' && row.category !== 'unidentified';
const recordLabel = (row: ContributionRecord) => row.category === 'unidentified' ? 'Combined or unnamed donations' : row.source;
// One scale on every candidate page: area = 4 square pixels per dollar.
const squareSide = (cents: number) => 2 * Math.sqrt(cents / 100);
const tileKind = (row: ContributionRecord) => row.category === 'unidentified' ? styles.tileUnknown
  : row.category === 'individual' ? styles.tilePerson
  : row.category === 'self_family' ? styles.tileFamily
  : styles.tileOrganization;

export default function ContributionMosaic({ committeeId, rows, topSources, publicCents }: Props) {
  const [view, setView] = useState<View>('all');
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [shown, setShown] = useState(25);
  const field = useRef<HTMLDivElement>(null);
  const ordered = useMemo(() => rows.filter(row => row.category !== 'public')
    .sort((a, b) => b.cents - a.cents || a.date.localeCompare(b.date) || a.id.localeCompare(b.id)), [rows]);
  const visible = useMemo(() => ordered.filter(row => view === 'all' || (view === 'named' ? isNamed(row) : row.category === 'unidentified')), [ordered, view]);
  const named = ordered.filter(isNamed);
  const unnamed = ordered.filter(row => row.category === 'unidentified');
  const sum = (items: ContributionRecord[]) => items.reduce((total, item) => total + item.cents, 0);
  const namedCents = sum(named);
  const unnamedCents = sum(unnamed);
  const publicRecords = rows.filter(row => row.category === 'public').length;
  const selected = visible.find(row => row.id === selectedId) ?? visible.find(isNamed) ?? visible[0];
  const topFiveCents = topSources.slice(0, 5).reduce((total, source) => total + source.cents, 0);
  const setFilter = (next: View) => { setView(next); setSelectedId(null); setShown(25); };
  const moveSelection = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (!['ArrowRight', 'ArrowDown', 'ArrowLeft', 'ArrowUp', 'Home', 'End'].includes(event.key) || !visible.length) return;
    event.preventDefault();
    const index = visible.findIndex(row => row.id === selected?.id);
    const next = event.key === 'Home' ? 0 : event.key === 'End' ? visible.length - 1
      : Math.max(0, Math.min(visible.length - 1, index + (event.key === 'ArrowRight' || event.key === 'ArrowDown' ? 1 : -1)));
    setSelectedId(visible[next].id);
    document.getElementById('contribution-' + committeeId + '-' + visible[next].id)?.scrollIntoView({ block: 'nearest', inline: 'nearest' });
  };

  return <figure className={styles.mosaic} data-committee={committeeId}>
    <figcaption><h4>Every reported contribution, at a glance</h4><p>Each square is one line in the filings, excluding City matching payments. Bigger squares mean more money; the scale is the same for every candidate. Gray squares may combine many smaller gifts.</p></figcaption>
    <div className={styles.mosaicSummary}>
      <div><strong>{named.length.toLocaleString('en-US')}</strong><span>records with a reported source · {money(namedCents)}</span></div>
      <div><strong>{unnamed.length.toLocaleString('en-US')}</strong><span>combined or unnamed records · {money(unnamedCents)}</span></div>
      <div><strong>{money(publicCents)}</strong><span>City matching deposits · {publicRecords} records, shown separately</span></div>
    </div>
    <div className={styles.mosaicControls} aria-label="Choose contribution records to show">
      <button type="button" aria-pressed={view === 'all'} onClick={() => setFilter('all')}>All non-City cash</button>
      <button type="button" aria-pressed={view === 'named'} onClick={() => setFilter('named')}>Named sources</button>
      <button type="button" aria-pressed={view === 'unidentified'} onClick={() => setFilter('unidentified')}>Combined / unnamed</button>
    </div>
    <div className={styles.tileLegend}><span><i className={styles.tilePerson} />Person</span><span><i className={styles.tileOrganization} />Organization or PAC</span><span><i className={styles.tileFamily} />Candidate or family</span><span><i className={styles.tileUnknown} />Combined / unnamed</span></div>
    <div className={styles.tileField} ref={field} role="listbox" tabIndex={0} aria-label={visible.length + ' cash-contribution records, largest first. Use arrow keys to inspect squares.'} aria-activedescendant={selected ? 'contribution-' + committeeId + '-' + selected.id : undefined} onKeyDown={moveSelection}>
      {visible.map(row => <button key={row.id} id={'contribution-' + committeeId + '-' + row.id} type="button" role="option" tabIndex={-1} aria-selected={selected?.id === row.id} aria-label={row.date + ': ' + recordLabel(row) + ', ' + money(row.cents)} title={row.date + ' · ' + recordLabel(row) + ' · ' + money(row.cents)} className={tileKind(row)} style={{ width: squareSide(row.cents), height: squareSide(row.cents) }} onClick={() => { setSelectedId(row.id); field.current?.focus(); }} />)}
    </div>
    <div className={styles.squareKey} aria-hidden="true"><span>Square area</span>{[25, 100, 400].map(dollars => <span key={dollars}><i style={{ width: squareSide(dollars * 100), height: squareSide(dollars * 100) }} />${dollars}</span>)}</div>
    {selected && <div className={styles.selectedGift} aria-live="polite"><div><span>Selected record · {selected.date}</span><strong>{money(selected.cents)}</strong></div><p>{recordLabel(selected)}{selected.category === 'unidentified' ? ' — this filing row may combine several gifts.' : selected.bookType ? ' · ' + selected.bookType : ''} · ORESTAR {selected.id}</p>{isNamed(selected) && /^(record:|committee:)/.test(selected.entityId) && <Link href={BASE + '/entities/' + encodeURIComponent(selected.entityId)}>See this reported source</Link>}</div>}
    <div className={styles.topSourceHead}><div><h4>Largest reported funding sources</h4><p>Totals across each source’s records, before refunds. Combined or unnamed records are excluded.</p></div>{namedCents > 0 && <strong>Top five: {(100 * topFiveCents / namedCents).toFixed(1)}% of named-source cash</strong>}</div>
    {topSources.length ? <ol className={styles.topSourceList}>{topSources.slice(0, 6).map(source => <li key={source.id}><div><Link href={BASE + '/entities/' + encodeURIComponent(source.id)}>{source.name}</Link><strong>{money(source.cents)}</strong></div><span className={styles.sourceTrack} aria-hidden="true"><span style={{ width: (100 * source.cents / topSources[0].cents).toFixed(1) + '%' }} /></span><small>{source.records} record{source.records === 1 ? '' : 's'} · {source.bookType}</small></li>)}</ol> : <p>No named cash sources appear in this committee’s reviewed records.</p>}
    {topSources.length > 6 && <details className={styles.details}><summary>See the next {topSources.length - 6} reported sources</summary><ol className={styles.moreSources}>{topSources.slice(6).map(source => <li key={source.id}><Link href={BASE + '/entities/' + encodeURIComponent(source.id)}>{source.name}</Link><strong>{money(source.cents)}</strong><small>{source.records} record{source.records === 1 ? '' : 's'}</small></li>)}</ol></details>}
    <details className={styles.details}><summary>Inspect every {visible.length.toLocaleString('en-US')} record in this view</summary><div className={styles.scroll} role="region" tabIndex={0} aria-label="Contribution record table"><table><thead><tr><th scope="col">Date</th><th scope="col">Reported source</th><th scope="col">Amount</th><th scope="col">ORESTAR ID</th></tr></thead><tbody>{visible.slice(0, shown).map(row => <tr key={row.id}><td>{row.date}</td><th scope="row">{recordLabel(row)}{row.category === 'unidentified' && <span className={styles.sourceNote}>{row.source}</span>}</th><td>{money(row.cents)}</td><td>{row.id}</td></tr>)}</tbody></table></div>{shown < visible.length && <button className={styles.showMore} type="button" onClick={() => setShown(current => current + 25)}>Show 25 more records</button>}</details>
    <p className={styles.note}>A combined row may represent many gifts; it is not one donor. Reported names are not verified identities. The squares show gross receipts, not money left after refunds.</p>
  </figure>;
}
