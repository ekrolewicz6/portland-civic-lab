import 'server-only';
import Link from 'next/link';
import { BASE, SNAPSHOT, money, shortMoney } from '@/lib/campaign-finance/filters';
import { financeFacts } from '@/lib/campaign-finance/candidate-facts';
import { story, storyCandidate, shortDate, STORY_EVIDENCE } from '@/lib/campaign-finance/story';
import s from './story.module.css';
const percent = (part: number, whole: number) => whole ? (100 * part / whole).toFixed(1) + '%' : '0%';

export function Evidence({ file, children = 'Download chart evidence' }: { file: string; children?: React.ReactNode }) { return <a href={STORY_EVIDENCE + file} download>{children}</a>; }

export function SeptemberChart() {
  const rows = ['23295', '17629', '23365'].map(id => story.september.find(r => r.committee_id === id)!);
  const max = Math.max(...rows.flatMap(r => [r.pre_cents, r.post_cents]));
  return <figure className={s.figure} data-chart="september"><figcaption><span className={s.kicker}>District 4 · a seven-day comparison</span><h3>Receipts rose for Arnold, Zimmerman and Green.</h3></figcaption>
    <div className={s.legend}><span><i className={s.before} />Sept. 6–12</span><span><i className={s.after} />Sept. 14–20</span></div>
    {rows.map(r => <div className={s.pairRow} key={r.committee_id}><Link href={storyCandidate(r.committee_id).href}>{r.candidate}</Link><div>{[['Before', r.pre_cents, 'before'], ['After', r.post_cents, 'after']].map(([label, cents, color]) => <div className={s.pairBar} key={String(label)}><span className={s.srOnly}>{label}: </span><div aria-hidden="true" className={s[String(color)]} style={{ width: `${Number(cents) / max * 100}%` }} /><strong>{money(Number(cents))}</strong></div>)}</div></div>)}
    <p className={s.source}>Cash excluding City matching payments. Both weeks use the same scale; September 13 is left out. Recent filings may change. <Evidence file="event-windows.csv" />.</p>
  </figure>;
}

export function WeeklyChart({ ids, title }: { ids: string[]; title: string }) {
  const max = Math.max(...story.weeks.filter(w => ids.includes(w.committee_id)).map(w => w.nonmatching_cents), 1);
  return <figure className={s.figure} data-chart="weekly"><figcaption><span className={s.kicker}>January–September 2026 · weekly cash excluding City matches</span><h3>{title}</h3></figcaption><p className={s.chartNote}>Every chart uses the same dollar scale. Gold marks the biggest week. The final two weeks may change as new filings arrive.</p>
    <div className={s.sparkGrid}>{ids.map(id => {
      const c = storyCandidate(id); const weeks = story.weeks.filter(w => w.committee_id === id); const best = Math.max(...weeks.map(w => w.nonmatching_cents));
      const peak = c.peak2026;
      const peakWeek = peak ? weeks.find(w => w.week_start === peak.start) : undefined;
      return <div className={s.sparkPanel} key={id}><Link href={c.href}>{c.name}</Link><p>{peak ? <>{shortDate(peak.start)}–{shortDate(peak.end)}: <strong>{money(peak.cents)}</strong></> : 'No peak in these records'}</p>
        <svg viewBox="0 0 380 115" role="img" aria-label={`${c.name}, weekly cash excluding City matching. Peak ${money(best)}. Exact weeks downloadable below.`}>
          <rect x={360} y={0} width={20} height={100} fill="#f0e0c5" /><line x1={0} y1={100} x2={380} y2={100} stroke="#bbc5bf" />
          {weeks.map((w, i) => <rect key={w.week_start} x={i * 10 + 1} y={100 - w.nonmatching_cents / max * 92} width={8} height={w.nonmatching_cents / max * 92} fill={w.nonmatching_cents === best ? '#bb8125' : '#286955'}><title>{`${shortDate(w.week_start)}: ${money(w.nonmatching_cents)}${w.provisional ? '; may change' : ''}`}</title></rect>)}
        </svg><div className={s.axis}><span>Jan. 5</span><span>June</span><span>Sept. 21</span></div>
        {peak && peakWeek && <div className={s.peakSources}>
          <span>Named individual gifts <strong>{money(peakWeek.individual_itemized_cents)}</strong></span>
          {peakWeek.nonmatching_cents > peakWeek.individual_itemized_cents + peakWeek.unidentified_cents && <span>Other named sources <strong>{money(peakWeek.nonmatching_cents - peakWeek.individual_itemized_cents - peakWeek.unidentified_cents)}</strong></span>}
          <span>Unnamed or combined gifts <strong>{money(peakWeek.unidentified_cents)}</strong></span>
          {peakWeek.public_cents > 0 && <span>Separate City matching deposit <strong>{money(peakWeek.public_cents)}</strong></span>}
          <Link href={`${BASE}/explorer?snapshot=${SNAPSHOT}&committee=${id}&start=${peak.start}&end=${peak.end}&basis=cash_contribution&matching=exclude`}>See every contribution behind this peak</Link>
        </div>}
      </div>;
    })}</div><p className={s.source}>Weeks run Monday–Sunday, based on the dates reported in filings. Some small gifts are reported in a combined row, so their exact gift dates may differ. <Evidence file="candidate-weeks.csv">Download all weekly amounts</Evidence>.</p></figure>;
}

export function OverlapChart() {
  const pairs = story.pairs.filter(p => p.bh_q < .05);
  const max = Math.max(...pairs.map(p => p.shared), 1);
  return <figure className={s.figure} data-chart="overlap"><figcaption><span className={s.kicker}>Shared named donors</span><h3>These candidate pairs share more named donors than usual.</h3></figcaption>
    <div className={s.legend}><span><i className={s.after} />Shared donors in the filings</span><span><i className={s.before} />Average in comparison runs</span></div>
    {pairs.map(p => <div className={s.overlapRow} key={p.committee_a + p.committee_b}><div><strong>{p.candidate_a} + {p.candidate_b}</strong><span>{p.shared} shared donor entries · {money(p.pair_gross_cents)} given to both · comparison average {p.null_mean.toFixed(1)}</span></div><div className={s.overlapTrack} aria-hidden="true"><div className={s.after} style={{ width: `${p.shared / max * 100}%` }} /><div className={s.before} style={{ width: `${p.null_mean / max * 100}%` }} /></div></div>)}
    <details className={s.details}><summary>How did we choose these pairs?</summary><p>We compared the shared donors with many reshuffled versions of the same donor network. Each version kept campaign donor counts and the number of campaigns per donor entry unchanged. Six of 136 candidate pairs shared more donors than we would usually expect. The test cannot tell us why.</p><p>The dollar figure adds gifts from the shared entries to both candidates. The same giver can appear in several pairs, so do not add pair totals. Unnamed donations are missing from this chart. <Link href="/deep-dives/campaign-finance/methodology">Full test details</Link>.</p></details>
    <p className={s.source}><Evidence file="donor-overlap-tests.csv">All 136 pair results</Evidence>. <Evidence file="shared-donor-pair-amounts.csv">Pair amounts and refunds</Evidence>. <Evidence file="donor-candidate-complete-ledger.csv">Donor–candidate records</Evidence>.</p>
  </figure>;
}

export function EndorsementChart() {
  const ids = financeFacts.links.filter(link => link.status === 'reviewed' && (link.raceId === 'portland-district-3' || link.raceId === 'portland-district-4')).map(link => link.committeeId);
  return <figure className={s.figure} data-chart="endorsements"><figcaption><span className={s.kicker}>Six organizations · all 17 reviewed candidates</span><h3>Endorsement lists do not form two sealed camps.</h3></figcaption><div className={s.tableWrap} role="region" tabIndex={0} aria-label="Endorsement matrix, horizontally scrollable"><table className={s.matrix}><thead><tr><th scope="col">Candidate</th>{story.endorsements.map(e => <th key={e.organization} scope="col"><a href={e.url}>{e.organization}</a></th>)}</tr></thead><tbody>{ids.map(id => { const c = storyCandidate(id); return <tr key={id}><th scope="row"><Link href={c.href}>{c.name}</Link></th>{story.endorsements.map(e => { const yes = e.candidates.includes(c.name); return <td key={e.organization} data-endorsed={yes}><span aria-hidden="true">{yes ? '●' : '—'}</span><span className={s.srOnly}>{yes ? 'Listed endorsement' : 'Not on this reviewed list'}</span></td>; })}</tr>; })}</tbody></table></div><p className={s.source}>A dot means the organization lists that candidate. A dash means the candidate is not on that list—not that the organization opposes them. This is not every endorsement. Sources are linked in the column headings; Portland for All’s <a href="https://www.portlandforall.org/district4">District 4 list</a> is separate. Reviewed September 27, 2026.</p></figure>;
}

export function ReservesChart() {
  const ids = ['23208', '23028', '15109', '24897', '23295', '23365', '17629', '23199'];
  const rows = ids.map(storyCandidate).sort((a, b) => (b.account?.endingCashCents ?? 0) - (a.account?.endingCashCents ?? 0));
  const max = Math.max(...rows.flatMap(row => [row.account?.endingCashCents ?? 0, row.bases.cash_payment.cents]), 1);
  return <figure className={s.figure} data-chart="reserves">
    <figcaption><span className={s.kicker}>Eight highest-receipt council committees</span><h3>How much has each campaign paid out—and how much cash is left?</h3><p className={s.chartNote}>Two separate reported measures on the same dollar scale. They are not pieces of one total.</p></figcaption>
    <div className={s.legend}><span><i className={s.before} />Cash paid out</span><span><i className={s.after} />Cash on hand</span></div>
    <div className={s.fundingRows}>{rows.map(candidate => <div key={candidate.committeeId} className={s.reserveRow}>
      <Link href={candidate.href}>{candidate.name}</Link>
      <div className={s.reservePair}>
        <div><span>Paid out</span><div className={s.track} aria-hidden="true"><span className={s.before} style={{ width: percent(candidate.bases.cash_payment.cents, max) }} /></div><strong>{money(candidate.bases.cash_payment.cents)}</strong></div>
        <div><span>Cash left</span><div className={s.track} aria-hidden="true"><span className={s.after} style={{ width: percent(candidate.account!.endingCashCents, max) }} /></div><strong>{money(candidate.account!.endingCashCents)}</strong></div>
      </div>
      {candidate.account!.outstandingLoanCents > 0 && <p className={s.chartNote}>Also reports {money(candidate.account!.outstandingLoanCents)} in outstanding loans.</p>}
    </div>)}</div>
    <p className={s.source}>Cash paid out covers January 2025–September 2026. Cash on hand comes from official 2026 account summaries retrieved September 27. Do not subtract one from the other: opening balances and other cash activity matter. <a href="/data/campaign-finance/account-summaries.csv" download>Check reported balances</a>.</p>
  </figure>;
}
