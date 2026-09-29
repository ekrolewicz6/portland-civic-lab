'use client';

import { useState } from 'react';
import frozenData from '@/lib/campaign-finance/campaign-dynamics.json';
import { money } from '@/lib/campaign-finance/filters';
import s from './campaign-dynamics.module.css';
export { CampaignTimeline } from './CampaignTimeline';
const data = frozenData;
const utc = (value: string) => Date.parse(`${value}T00:00:00Z`);
const formatDate = (value: string) => new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', timeZone: 'UTC' }).format(utc(value));

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
