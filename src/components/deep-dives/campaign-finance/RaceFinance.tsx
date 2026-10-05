import 'server-only';
import Link from 'next/link';
import { financeFacts, raceFinance, type CommitteeFacts, type RaceCandidate } from '@/lib/campaign-finance/candidate-facts';
import { BASE, money } from '@/lib/campaign-finance/filters';
import { activeManifest } from '@/lib/campaign-finance/active';
import { currentCandidateFacts } from '@/lib/campaign-finance/query';
import { FinanceWindow } from './CandidateFinance';
import { GovernorRaceFinance, isGovernorRace } from './governor/GovernorGuide';
import styles from './candidate-finance.module.css';

export default async function RaceFinance({ raceId, candidates, federal = false }: { raceId: string; candidates: RaceCandidate[]; federal?: boolean }) {
  // The governor's race has its own reviewed edition; see /deep-dives/campaign-finance/governor.
  if (isGovernorRace(raceId)) return <GovernorRaceFinance raceId={raceId} candidates={candidates} />;
  const active=activeManifest();
  const ids=[...new Set(financeFacts.links.filter(link=>link.status==='reviewed'&&link.raceId===raceId).map(link=>link.committeeId))];
  const pairs=await Promise.all(ids.map(async id=>[id,await currentCandidateFacts(id)] as const));
  const current=Object.fromEntries(pairs.filter((pair):pair is readonly [string,CommitteeFacts]=>Boolean(pair[1])));
  const summary = raceFinance(raceId, federal ? [] : candidates, current);
  return <section id="race-fundraising" className={styles.section} aria-labelledby="race-finance-heading" data-finance-snapshot={active.snapshot}>
    <h2 id="race-finance-heading">What the fundraising records show</h2>
    <FinanceWindow end={active.end} />
    {federal ? <p className={styles.notice}>Federal campaigns require FEC records and are outside these ORESTAR totals. A reviewed FEC comparison is not yet available.</p> : <>
      <div className={styles.story}>{summary.sentences.map(s => <p key={s}>{s}</p>)}</div>
      {summary.covered > 0 && !summary.ambiguous ? <>
        <div className={styles.scroll} role="region" aria-label="Candidate fundraising comparison" tabIndex={0}><table>
          <caption>Same observation window and accounting definitions for every candidate. Listed in voter-guide order, not ranked by fundraising.</caption>
          <thead><tr><th scope="col">Candidate</th><th scope="col">Gross cash contributions</th><th scope="col">Included City matches</th><th scope="col">Cash excluding matches</th><th scope="col">Coverage</th></tr></thead>
          <tbody>{summary.rows.map(r => <tr key={r.candidate.id}><th scope="row"><Link href={`/voters-guide/${raceId}/${r.candidate.id}#campaign-finance`}>{r.candidate.name}</Link></th><td>{r.covered ? money(r.cashCents) : 'Not available'}</td><td>{r.covered ? money(r.publicCents) : 'Not available'}</td><td>{r.covered ? money(r.nonmatchingCents) : 'Not available'}</td><td>{r.covered ? 'Reviewed committee records' : r.committees.length ? 'No own-filer records in snapshot' : 'No reviewed link; not zero'}</td></tr>)}</tbody>
        </table></div>
        <p>Fundraising totals describe financial activity, not voter support or a forecast of the result. A difference in recorded receipts does not establish the effect of an endorsement, controversy or campaign strategy. Candidate profiles separate source types, geography, timing, loans, noncash support and refunds.</p>
        <div className={styles.links}><Link href={`${BASE}/explorer?race=${raceId}&snapshot=${active.snapshot}&basis=cash_contribution`}>Inspect this race’s linked cash-contribution records</Link><Link href={`${BASE}/methodology`}>Accounting and identity methods</Link><Link href={`${BASE}/evidence`}>Download current evidence</Link></div>
      </> : null}
    </>}
  </section>;
}
