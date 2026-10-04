import 'server-only';
import Link from 'next/link';
import {
  governor, governorCandidate, governorCandidates, governorUnlinked, GOVERNOR_PATH, KIND_ORDER, KIND_SHORT, KIND_SINGULAR,
  explorerHref, longDate, longMonthDay, roundMoney, share, wholeDollars,
} from '@/lib/campaign-finance/governor';
import styles from '../candidate-finance.module.css';

export const isGovernorRace = (raceId: string) => raceId === governor.raceId;
const plain = (name: string) => name.replace(/\s*\(\d+\)$/, '');
const nowrap = { whiteSpace: 'nowrap' } as const;
const kindCents = (candidateId: string, key: string) => governorCandidate(candidateId)?.kinds.find(kind => kind.key === key)?.cents ?? 0;

function Window() {
  return <p className={styles.note}>Cash contributions from January 1, 2025 through {longDate(governor.end)}, before refunds. Both committees existed before this race, and the newest filings can still change. Analysis dated {longDate(governor.reviewedAt)}.</p>;
}

/** Governor's race panel for the voter guide: same accounting for every candidate, listed in guide order. */
export function GovernorRaceFinance({ raceId, candidates }: { raceId: string; candidates: { id: string; name: string }[] }) {
  const drazan = governorCandidate('christine-drazan')!;
  const kotek = governorCandidate('tina-kotek')!;
  const total = governorCandidates.reduce((sum, candidate) => sum + candidate.totals.cashCents, 0);
  return <section id="race-fundraising" className={styles.section} aria-labelledby="race-finance-heading" data-finance-snapshot={governor.snapshot}>
    <h2 id="race-finance-heading">What the fundraising records show</h2>
    <Window />
    <div className={styles.story}>
      <p>{drazan.name} and {kotek.name} have reported {roundMoney(total)} in cash contributions between them. {governorUnlinked.map(candidate => candidate.name).join(' and ')} has no committee in these records, which is missing coverage and does not mean no money was raised.</p>
      <p>Named individuals supplied {share(kindCents(drazan.candidateId, 'individual'), drazan.totals.cashCents)} of Drazan’s cash and businesses {share(kindCents(drazan.candidateId, 'business'), drazan.totals.cashCents)}. Unions and their committees supplied at least {share(kindCents(kotek.candidateId, 'labor'), kotek.totals.cashCents)} of Kotek’s, and national Democratic governors’ groups {share(kindCents(kotek.candidateId, 'governors'), kotek.totals.cashCents)}.</p>
    </div>
    <div className={styles.scroll} role="region" aria-label="Candidate fundraising comparison" tabIndex={0}><table>
      <caption>The same dates and definitions for every candidate, listed alphabetically.</caption>
      <thead><tr><th scope="col">Candidate</th><th scope="col">Cash raised</th><th scope="col">From named individuals</th><th scope="col">Paid out so far</th><th scope="col">Cash on {longMonthDay(governor.commonPaymentDate)}</th><th scope="col">Coverage</th></tr></thead>
      <tbody>{[...candidates].sort((a, b) => a.name.localeCompare(b.name)).map(candidate => {
        const facts = governorCandidate(candidate.id);
        return <tr key={candidate.id}><th scope="row"><Link href={`/voters-guide/${raceId}/${candidate.id}#campaign-finance`}>{candidate.name}</Link></th>
          {facts ? <>
            <td style={nowrap}>{wholeDollars(facts.totals.cashCents)}</td>
            <td style={nowrap}>{wholeDollars(kindCents(candidate.id, 'individual'))}</td>
            <td style={nowrap}>{wholeDollars(facts.totals.paidCents)}<span className={styles.sourceNote}>through {longMonthDay(facts.totals.latestPaymentDate)}</span></td>
            <td style={nowrap}>{wholeDollars(facts.likeForLike.cashPositionCents)}</td>
            <td>Reviewed committee records</td>
          </> : <><td>Not available</td><td>Not available</td><td>Not available</td><td>Not available</td><td>No committee in these records</td></>}
        </tr>;
      })}</tbody>
    </table></div>
    <p>{longMonthDay(governor.commonPaymentDate)} is the last day both committees have payments on file, so it is the fairest date for comparing cash. Fundraising totals describe money and do not measure voter support.</p>
    <div className={styles.links}>
      <Link href={GOVERNOR_PATH}>Read the full investigation: who gave, when, where it came from and what it paid for</Link>
      {governorCandidates.map(candidate => <Link key={candidate.candidateId} href={explorerHref(candidate.committeeId, '&basis=cash_contribution')}>Inspect {candidate.name}’s contribution records</Link>)}
      <Link href="/deep-dives/campaign-finance/methodology">Accounting and identity methods</Link>
    </div>
  </section>;
}

/** One candidate's summary on their guide profile. */
export function GovernorCandidateFinance({ candidateId }: { candidateId: string }) {
  const facts = governorCandidate(candidateId);
  const missing = governorUnlinked.find(candidate => candidate.candidateId === candidateId);
  return <section id="campaign-finance" className={styles.section} aria-labelledby="candidate-finance-heading" data-finance-snapshot={governor.snapshot}>
    <h2 id="candidate-finance-heading">Campaign finance</h2>
    {!facts ? <p className={styles.notice}>{missing?.linkBasis ?? 'No reviewed committee records are available for this candidate. This is missing coverage and does not mean no money was raised.'}</p> : <>
      <Window />
      <h3>{facts.committeeName}</h3>
      <p className={styles.note}>ORESTAR committee {facts.committeeId} · Latest contribution on file: {longDate(facts.totals.latestCashDate)} · Latest payment on file: {longDate(facts.totals.latestPaymentDate)}</p>
      <dl className={styles.stats}>
        <div><dt>Cash contributions</dt><dd>{wholeDollars(facts.totals.cashCents)}</dd></div>
        <div><dt>Contribution records</dt><dd>{facts.totals.cashRecords.toLocaleString('en-US')}</dd></div>
        <div><dt>Paid out so far</dt><dd>{wholeDollars(facts.totals.paidCents)}</dd></div>
        <div><dt>Cash on {longMonthDay(facts.likeForLike.asOf)}, our calculation</dt><dd>{wholeDollars(facts.likeForLike.cashPositionCents)}</dd></div>
      </dl>
      <h4>Where the cash came from</h4>
      <div className={styles.scroll} role="region" aria-label={`Cash sources for ${facts.name}`} tabIndex={0}><table>
        <caption>Groups do not overlap, and the rows add up to all cash contributions.</caption>
        <thead><tr><th scope="col">Kind of source</th><th scope="col">Cash</th><th scope="col">Share</th><th scope="col">Contributions</th></tr></thead>
        <tbody>{KIND_ORDER.map(key => facts.kinds.find(kind => kind.key === key)!).filter(kind => kind.cents > 0).map(kind => <tr key={kind.key}><th scope="row">{KIND_SHORT[kind.key]}</th><td>{wholeDollars(kind.cents)}</td><td>{share(kind.cents, facts.totals.cashCents)}</td><td>{kind.records.toLocaleString('en-US')}</td></tr>)}</tbody>
      </table></div>
      <h4>Five largest sources</h4>
      <ul className={styles.geo}>{facts.topSources.slice(0, 5).map(source => <li key={source.id}><span>{plain(source.name)}<span className={styles.sourceNote}>{KIND_SINGULAR[source.kind]} · {[source.city, source.state].filter(Boolean).join(', ')}</span></span><strong>{wholeDollars(source.cents)}</strong></li>)}</ul>
      <p className={styles.note}>Names appear as the campaign reported them. Committees that gave $50,000 or more are grouped by sponsor where the sponsor is clear, so the union and trade figures are minimums.</p>
      <div className={styles.links}>
        <Link href={GOVERNOR_PATH}>Read the full investigation of the money in this race</Link>
        <Link href={explorerHref(facts.committeeId, '&basis=cash_contribution')}>Inspect every contribution record</Link>
        <Link href={explorerHref(facts.committeeId, '&basis=cash_payment')}>Inspect every payment record</Link>
      </div>
    </>}
  </section>;
}
