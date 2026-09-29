import 'server-only';
import Link from 'next/link';
import { candidateFinance, financeFacts, percentage, type CommitteeFacts } from '@/lib/campaign-finance/candidate-facts';
import { BASE, money, basisLabel } from '@/lib/campaign-finance/filters';
import { activeManifest } from '@/lib/campaign-finance/active';
import { currentCandidateFacts, currentContributionRecords } from '@/lib/campaign-finance/query';
import styles from './candidate-finance.module.css';
import ContributionMosaic from './ContributionMosaic';

export function FinanceWindow({ end }: { end: string }) {
  return <p className={styles.note}>January 1, 2025–{end} · Current transaction snapshot. November–December 2024 is missing; recent filings and manual-export coverage are provisional. Reviewed candidate–committee links do not make every transaction a 2026 campaign transaction. Official account balances and editorial findings are updated separately.</p>;
}

async function CommitteeBreakdown({ facts, snapshot }: { facts: CommitteeFacts; snapshot: string }) {
  const explorer = `${BASE}/explorer?committee=${facts.committeeId}&snapshot=${snapshot}`;
  if (!facts.observedRecords) return <p>No own-filer records for this reviewed committee appear in the snapshot. This is not evidence of zero fundraising.</p>;
  const contributions = await currentContributionRecords(facts.committeeId);
  if (contributions.length !== facts.cashRecords || contributions.reduce((sum,row)=>sum+row.cents,0)!==facts.cashCents) throw new Error(`Current contribution records do not reconcile for ${facts.committeeId}`);
  const largestMonth = Math.max(1, ...facts.monthly.map(m => m.cashCents));
  return <div className={styles.committee}>
    <h3>{facts.committeeName ?? `Committee ${facts.committeeId}`}</h3>
    <p className={styles.note}>ORESTAR committee {facts.committeeId} · Latest reported cash-contribution date: {facts.latestCashDate ?? 'none observed'}.</p>
    <dl className={styles.stats}>
      <div><dt>Gross cash contributions</dt><dd>{money(facts.cashCents)}</dd></div>
      <div><dt>Included City matching funds</dt><dd>{money(facts.publicCents)}</dd></div>
      <div><dt>Cash excluding reviewed matches</dt><dd>{money(facts.nonmatchingCents)}</dd></div>
      <div><dt>Cash-contribution records</dt><dd>{facts.cashRecords.toLocaleString('en-US')}</dd></div>
    </dl>
    <ContributionMosaic committeeId={facts.committeeId} rows={contributions} topSources={facts.topSources} publicCents={facts.publicCents} />
    <p className={styles.note}>{facts.repeatIndividualGroups} of {facts.visibleIndividualGroups} matched individual donor entries appear on more than one reported date. These are not confirmed counts of people.</p>

    <h4>Where the cash came from</h4>
    <div className={styles.scroll} role="region" aria-label={`Cash sources for committee ${facts.committeeId}`} tabIndex={0}>
      <table><caption>Exclusive source categories; these rows sum to gross cash contributions.</caption><thead><tr><th scope="col">Reported source type</th><th scope="col">Cash</th><th scope="col">Share of cash</th><th scope="col">Records</th></tr></thead>
        <tbody>{facts.sources.map(s => <tr key={s.key}><th scope="row">{s.label}</th><td>{money(s.cents)}</td><td>{percentage(s.cents, facts.cashCents)}</td><td>{s.records}</td></tr>)}</tbody>
      </table>
    </div>
    <p className={styles.note}>Matching receipts are classified first, then unidentified/aggregate records, then the reported source type. “Other” does not mean an individual. Generic reporting labels are not treated as donors. Types follow the filing: a union-affiliated PAC may appear under political committees, not labor organizations. This is not a reviewed economic-sector classification.</p>

    <h4>Reported geography of cash outside City matches</h4>
    <ul className={styles.geo}>{facts.geography.map(g => <li key={g.key}><span>{g.label}</span><strong>{money(g.cents)} <span className={styles.note}>({percentage(g.cents, facts.nonmatchingCents)})</span></strong></li>)}</ul>
    <p className={styles.note}>{financeFacts.definitions.geography} The denominator here is {money(facts.nonmatchingCents)}, not all cash contributions.</p>

    <h4>When receipts were reported</h4>
    {facts.peak2026 ? <p>The largest 2026 Monday–Sunday week outside reviewed City matches was {facts.peak2026.start}–{facts.peak2026.end}: <strong>{money(facts.peak2026.cents)}</strong>.{facts.peak2026.provisional ? ' This recent week remains provisional.' : ''} This describes timing, not why contributors gave.</p> : <p>No 2026 cash receipts outside reviewed City matches are recorded.</p>}
    <details className={styles.details}><summary>Monthly cash, loan and noncash records</summary>
      <p className={styles.note}>Gold bars are reviewed City matches; green bars are other cash. Each profile uses its own scale. The table supplies exact values and separate financing measures.</p>
      <div className={styles.scroll} role="region" aria-label={`Monthly fundraising for committee ${facts.committeeId}`} tabIndex={0}>
        <table><thead><tr><th scope="col">Month</th><th scope="col">Gross cash</th><th scope="col">City matches</th><th scope="col">Other cash contributions</th><th scope="col">Loans received</th><th scope="col">In-kind support</th></tr></thead><tbody>{facts.monthly.map(m => <tr key={m.month}><th scope="row">{m.month}<span className={styles.monthBar} aria-hidden="true"><span className={styles.publicBar} style={{ width: `${100 * m.publicCents / largestMonth}%` }} /><span className={styles.privateBar} style={{ width: `${100 * m.nonmatchingCents / largestMonth}%` }} /></span></th><td>{money(m.cashCents)}</td><td>{money(m.publicCents)}</td><td>{money(m.nonmatchingCents)}</td><td>{money(m.loanCents)}</td><td>{money(m.inKindCents)}</td></tr>)}</tbody></table>
      </div>
    </details>

    <h4>Other financing and cash uses</h4>
    <dl className={styles.stats}>{[['loan_received', 'Loans received'], ['noncash_support', 'In-kind support'], ['contribution_refund', 'Contribution refunds'], ['cash_payment', 'Cash payments']].map(([basis, label]) => <div key={basis}><dt><Link href={`${explorer}&basis=${basis}`}>{label}</Link></dt><dd>{money(facts.bases[basis]?.cents ?? 0)}</dd></div>)}</dl>
    <p className={styles.note}>These are separate measures, not amounts to add to fundraising. Loans are financing, in-kind support is noncash, and refunds are not new receipts. Payables are not added to their subsequent payments.</p>
    <details className={styles.details}><summary>All recorded accounting measures</summary>
      <div className={styles.scroll} role="region" aria-label={`All accounting measures for committee ${facts.committeeId}`} tabIndex={0}><table><thead><tr><th scope="col">Accounting basis</th><th scope="col">Reported amount</th><th scope="col">Records</th></tr></thead><tbody>{Object.entries(facts.bases).sort(([a], [b]) => a.localeCompare(b)).map(([basis, total]) => <tr key={basis}><th scope="row"><Link href={`${explorer}&basis=${basis}`}>{basisLabel(basis)}</Link></th><td>{money(total.cents)}</td><td>{total.records}</td></tr>)}</tbody></table></div>
      <p className={styles.note}>No combined total is shown: cash movements, obligations, cancellations and adjustments answer different accounting questions.</p>
    </details>
    {facts.account ? <details className={styles.details}><summary>Official reported cash and outstanding obligations</summary><dl className={styles.stats}><div><dt>Opening cash, {facts.account.year}</dt><dd>{money(facts.account.openingCashCents)}</dd></div><div><dt>Reported ending cash</dt><dd>{money(facts.account.endingCashCents)}</dd></div><div><dt>Outstanding loans</dt><dd>{money(facts.account.outstandingLoanCents)}</dd></div><div><dt>Accounts payable</dt><dd>{money(facts.account.payableCents)}</dd></div><div><dt>Personal-expenditure balance</dt><dd>{money(facts.account.personalExpenditureCents)}</dd></div></dl><p className={styles.note}>Official account summary retrieved {facts.account.retrievedAt.slice(0, 10)}. {facts.account.reconciliation === 'agrees' ? 'Cash flows reconcile with this snapshot.' : 'An unresolved reconciliation difference remains.'} Not an independently audited bank balance or spending forecast. Negative source balances are retained for review.</p><a href={facts.account.source}>ORESTAR account-summary source</a></details> : <p className={styles.note}>Current official cash-on-hand and debt balances have not been reconciled to this transaction snapshot. Payments do not tell us how much cash is left without a verified opening balance.</p>}
    <div className={styles.links}><Link href={`${BASE}?committee=${facts.committeeId}#zip-map`}>Map contributions by reported ZIP</Link><Link href={`${BASE}/entities/committee:${facts.committeeId}`}>Explore committee {facts.committeeId} and its financial evidence</Link><Link href={`${explorer}&basis=cash_contribution`}>Inspect all cash-contribution records</Link><a href={facts.evidenceUrl} download>Download this committee’s cash-contribution evidence (CSV)</a><Link href={`${BASE}/methodology`}>Definitions and limitations</Link></div>
  </div>;
}

export default async function CandidateFinance({ raceId, candidateId, federal = false }: { raceId: string; candidateId: string; federal?: boolean }) {
  const active=activeManifest();
  const ids=financeFacts.links.filter(link=>link.status==='reviewed'&&link.raceId===raceId&&link.candidateId===candidateId).map(link=>link.committeeId);
  const current=Object.fromEntries(await Promise.all(ids.map(async id=>[id,await currentCandidateFacts(id)] as const)).then(rows=>rows.filter((row):row is readonly [string,CommitteeFacts]=>Boolean(row[1]))));
  const committees = federal ? [] : candidateFinance(raceId, candidateId, current);
  return <section id="campaign-finance" className={styles.section} aria-labelledby="candidate-finance-heading" data-finance-snapshot={active.snapshot}>
    <h2 id="candidate-finance-heading">Campaign finance</h2>
    <FinanceWindow end={active.end} />
    {committees.length ? committees.map(c => <CommitteeBreakdown key={c.committeeId} facts={c} snapshot={active.snapshot} />) : <p className={styles.notice}>{federal ? 'Federal campaign fundraising requires FEC records and is outside this ORESTAR analysis. A reviewed FEC breakdown has not yet been published here.' : 'No reviewed candidate-to-committee financial breakdown is available in this edition. This is missing coverage, not zero fundraising.'}</p>}
  </section>;
}
