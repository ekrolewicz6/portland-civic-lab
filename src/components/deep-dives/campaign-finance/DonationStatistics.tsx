import 'server-only';
import Link from 'next/link';
import { activeManifest } from '@/lib/campaign-finance/active';
import { donationCandidates, currentDonationStatistics } from '@/lib/campaign-finance/current-donations';
import { fundingLabels, type DonationStatistics as Statistics, type FundingKey } from '@/lib/campaign-finance/donation-statistics';
import { BASE, money } from '@/lib/campaign-finance/filters';
import s from './donation-statistics.module.css';

const share = (cents: number, total: number) => total ? `${(100 * cents / total).toFixed(1)}%` : '—';
const amount = (cents: number | null) => cents === null ? 'Not available' : money(cents);
const modes = (stats: Statistics['individuals']) => stats.modesCents.length ? `${stats.modesCents.slice(0, 4).map(money).join(', ')}${stats.modesCents.length > 4 ? ` + ${stats.modesCents.length - 4} tied amounts` : ''}` : stats.count ? 'No repeated amount' : 'Not available';
const keys = Object.keys(fundingLabels) as FundingKey[];
function Definitions({ end }: { end: string }) {
  return <><p className={s.note}>January 1, 2025–{end}, before refunds. Median, mean and mode describe positive cash gift records from named individuals. City matching deposits, unnamed combined entries, businesses, committees, labor and candidate/family entries are excluded from these individual-gift statistics. An even-sized median can have a half cent; displayed amounts round to cents.</p><p className={s.note}>The funding bars use cash outside City matches. Individual size bands add all recorded gifts to each reported donor group over this window: a group giving five $25 gifts belongs in the $100.01–$1,000 band. These are conservative filing groups, not verified unique people. Unnamed entries can include small gifts, but their donor counts and gift sizes are unknown. Committees include known committee IDs and reported unregistered or party committees. Reported businesses are not automatically large corporations; PAC and union affiliations need separate review.</p></>;
}
function Funding({ stats, name }: { stats: Statistics; name: string }) {
  return <div className={s.funding} role="img" aria-label={`${name}: ${keys.filter(key => stats.funding[key].cents).map(key => `${fundingLabels[key]} ${money(stats.funding[key].cents)}, ${share(stats.funding[key].cents, stats.nonmatchingCents)}`).join('; ')}`}>{keys.map(key => stats.funding[key].cents > 0 ? <span key={key} data-source={key} style={{ width: `${100 * stats.funding[key].cents / stats.nonmatchingCents}%` }} /> : null)}</div>;
}
export async function DonationComparison({ raceId }: { raceId: string }) {
  const active = activeManifest();
  const candidates = donationCandidates.filter(candidate => candidate.raceId === raceId);
  const rows = await Promise.all(candidates.map(async candidate => ({ ...candidate, stats: await currentDonationStatistics(candidate.committeeId) })));
  return <section className={s.section} data-donation-comparison={raceId} data-snapshot={active.snapshot}>
    <h3>{{ 'portland-district-3': 'District 3', 'portland-district-4': 'District 4', 'portland-auditor': 'Portland auditor', 'oregon-governor': 'Governor' }[raceId] ?? raceId}: typical named gifts and funding sources</h3><Definitions end={active.end} />
    <div className={s.legend}>{keys.map(key => <span key={key}><i data-source={key} />{fundingLabels[key]}</span>)}</div>
    {rows.map(row => <div className={s.row} key={row.committeeId}><div className={s.rowHeading}><Link href={row.href}>{row.name}</Link><span>{money(row.stats.nonmatchingCents)} outside City matches</span></div><Funding stats={row.stats} name={row.name} /></div>)}
    <div className={s.scroll} role="region" aria-label="Individual donation size comparison, horizontally scrollable" tabIndex={0}><table><caption>Named individual gift records · exact amounts and source details on each candidate’s profile</caption><thead><tr><th scope="col">Candidate</th><th scope="col">Gift records</th><th scope="col">Median</th><th scope="col">Mean</th><th scope="col">Mode</th><th scope="col">Largest gift</th><th scope="col">Businesses</th><th scope="col">Committees / PACs</th><th scope="col">Individuals giving ≤ $100 total</th></tr></thead><tbody>{rows.map(row => <tr key={row.committeeId}><th scope="row"><Link href={row.href}>{row.name}</Link></th><td>{row.stats.individuals.count.toLocaleString('en-US')}</td><td>{amount(row.stats.individuals.medianCents)}</td><td>{amount(row.stats.individuals.meanCents)}</td><td>{modes(row.stats.individuals)}</td><td>{amount(row.stats.individuals.maxCents)}</td>{(['business','committee','small_individual'] as const).map(key => <td key={key}>{money(row.stats.funding[key].cents)}<small>{share(row.stats.funding[key].cents, row.stats.nonmatchingCents)} of non-City cash</small></td>)}</tr>)}</tbody></table></div>
    <p className={s.note}>Missing candidate committees are not $0. These records may include activity preceding the 2026 race; recent filings and manual-export coverage remain provisional. <a href={`/api/campaign-finance/donations?race=${raceId}`} download>Download these statistics and source totals (JSON)</a>.</p>
  </section>;
}
export async function CandidateDonationStatistics({ committeeId }: { committeeId: string }) {
  const active = activeManifest(), stats = await currentDonationStatistics(committeeId);
  const candidate = donationCandidates.find(row => row.committeeId === committeeId)!;
  return <section className={s.section} data-donation-statistics={committeeId} data-snapshot={active.snapshot}>
    <h4>Donation amounts and funding sources</h4><Definitions end={active.end} />
    <dl className={s.stats}>{[['Named individual gift records', stats.individuals.count.toLocaleString('en-US')], ['Median individual gift', amount(stats.individuals.medianCents)], ['Mean individual gift', amount(stats.individuals.meanCents)], ['Mode (most frequent amount)', modes(stats.individuals)], ['Middle half of individual gifts', `${amount(stats.individuals.q1Cents)}–${amount(stats.individuals.q3Cents)}`], ['Smallest / largest individual gift', `${amount(stats.individuals.minCents)} / ${amount(stats.individuals.maxCents)}`]].map(([label, value]) => <div key={label}><dt>{label}</dt><dd>{value}</dd></div>)}</dl>
    <p className={s.note}>{stats.individuals.modesCents.length ? `Each mode occurs ${stats.individuals.modeFrequency} times.` : 'No mode is shown when every amount occurs once.'} {stats.individualGroups} named individual groups; {stats.smallIndividualGroups} gave $100 or less in total during this window.</p>
    <Funding stats={stats} name={candidate.name} />
    <div className={s.scroll} role="region" tabIndex={0} aria-label="Exact funding source amounts"><table><caption>Cash outside City matches: {money(stats.nonmatchingCents)}. Separate City matches: {money(stats.matchingCents)}.</caption><thead><tr><th scope="col">Source</th><th scope="col">Cash</th><th scope="col">Share of non-City cash</th><th scope="col">Records</th></tr></thead><tbody>{keys.map(key => <tr key={key}><th scope="row">{fundingLabels[key]}</th><td>{money(stats.funding[key].cents)}</td><td>{share(stats.funding[key].cents, stats.nonmatchingCents)}</td><td>{stats.funding[key].records}</td></tr>)}</tbody></table></div>
    <details><summary>All named source types: gift statistics</summary><p>Businesses, committees, labor, self/family and other named sources are included here. City matches and unnamed combined entries are excluded. This is a distribution of records, not individual people.</p><p>{stats.itemized.count} records · Median {amount(stats.itemized.medianCents)} · Mean {amount(stats.itemized.meanCents)} · Mode {modes(stats.itemized)} · Largest {amount(stats.itemized.maxCents)}</p></details>
    <details><summary>Largest reported business, committee and labor sources</summary>{stats.topOrganizations.length ? <ol>{stats.topOrganizations.map(source => <li key={source.category + source.id}><Link href={`${BASE}/entities/${encodeURIComponent(source.id)}`}>{source.name}</Link> · {source.category === 'committee' ? 'political committee / PAC' : source.category} · <strong>{money(source.cents)}</strong> ({source.records} records)</li>)}</ol> : <p>No named business, committee or labor cash contributions in these records.</p>}<p className={s.note}>Names and types follow the filings; related subsidiaries and sponsors are not consolidated.</p></details>
    <p className={s.note}><a href={`/api/campaign-finance/donations?committee=${committeeId}`} download>Download these statistics (JSON)</a> · <a href={`${BASE}/explorer?committee=${committeeId}&basis=cash_contribution`}>Inspect contribution records</a></p>
  </section>;
}
