import enrichment from '@/lib/campaign-finance/enrichment.json';
import {financeFacts} from '@/lib/campaign-finance/candidate-facts';
import CandidateFinance from '@/components/deep-dives/campaign-finance/CandidateFinance';
import Link from 'next/link';
import {notFound} from 'next/navigation';
import {BASE,parseFilters,money} from '@/lib/campaign-finance/filters';
import {entityProfile,transactions} from '@/lib/campaign-finance/query';
import {activeManifest} from '@/lib/campaign-finance/active';
import {Shell,Records,styles} from '@/components/deep-dives/campaign-finance/Shared';
export const runtime='nodejs';export const dynamic='force-dynamic';
export default async function Entity({params}:{params:Promise<{id:string}>}) {
  const {id:routeId}=await params;
  let id:string, filters;
  const active=activeManifest();
  try {
    id=decodeURIComponent(routeId);
    filters=parseFilters(new URLSearchParams(id.startsWith('committee:')?{committee:id.slice(10)}:{entity:id}),active);
    parseFilters(new URLSearchParams({entity:id}),active);
  } catch {notFound();}
  const profile=await entityProfile(id);if(!profile)notFound();
  if(id.startsWith('committee:')&&!profile.observedFiler)filters=parseFilters(new URLSearchParams({entity:id}),active);
  const activity=await transactions(filters);const committee=id.startsWith('committee:');
  const candidateLink = committee ? financeFacts.links.find(l=>l.committeeId===id.slice(10)&&l.status==='reviewed') : undefined;
  const official=committee?enrichment.profiles[id.slice(10) as keyof typeof enrichment.profiles]:undefined;
  return <Shell><header className={styles.profileHeader}><p className={styles.tag}>{committee?'Authoritative ORESTAR committee ID':String(profile.row.identity_status).replaceAll('_',' ')}</p><h1>{String(profile.row.name)||'Unknown counterparty'}</h1><p className={styles.code}>{id}</p><p>Observed {String(profile.row.first_observed)}–{String(profile.row.last_observed)}. This is a record history, not a complete institutional biography.</p></header>
    <aside className={styles.notice}>{committee?'The committee ID is authoritative. Current names and financial activity do not by themselves identify every election or establish a full-cycle balance.':'This is a conservative name/type/address fingerprint. Matching records are not independent verification of a person or organization. Similar names and address changes remain separate until reviewed.'}</aside>
    <div className={styles.actions}><Link className={styles.button} href={`${BASE}/explorer?entity=${encodeURIComponent(id)}`}>Explore all relationships</Link>{committee&&<Link href={`${BASE}/explorer?committee=${id.slice(10)}`}>Only this committee’s own filings</Link>}</div>
    {candidateLink && <CandidateFinance raceId={candidateLink.raceId} candidateId={candidateLink.candidateId} />}
    {official&&<section className={styles.section}><h2>Official profile and account observations</h2><p>{official.candidateName??'Political committee'}{official.electionOffice?' · '+official.electionOffice:''}. Statement effective {official.effectiveFrom}; retrieved {official.retrievedAt.slice(0,10)}. <a href={official.source}>ORESTAR public source</a></p><p className={styles.muted}>The source search is session-dependent. Search by committee ID {id.slice(10)}. Current candidacy does not attribute every historical transaction to that election.</p><div className={styles.tableScroll} role="region" aria-label="Official account summaries" tabIndex={0}><table><thead><tr><th>Year</th><th>Opening cash</th><th>Reported closing cash</th><th>Outstanding loans</th><th>Payables / personal obligations</th><th>Snapshot reconciliation</th></tr></thead><tbody>{official.accountSummaries.map(a=><tr key={a.year}><td>{a.year}</td><td>{money(a.beginning_cash_cents)}</td><td>{money(a.ending_cash_cents)}</td><td>{money(a.outstanding_loans_cents)}</td><td>{money(a.accounts_payable_cents+a.outstanding_personal_expenditures_cents)}</td><td>{a.status==='agrees'?'Cash flows agree':'Unresolved difference: '+money(a.net_difference_cents)+' net cash'}</td></tr>)}</tbody></table></div><p>Balances are official observations at retrieval, not independently audited bank balances or forecasts. No spending runway is inferred. <a href="/data/campaign-finance/account-summaries.csv">Download reconciliation evidence</a>.</p></section>}
    {committee&&!profile.observedFiler&&<aside className={styles.notice}>This committee appears as a counterparty, but has no own-filer records in this snapshot. The activity below comes from other committees’ filings. It is not evidence of zero fundraising or spending by this committee.</aside>}
    <section className={styles.section}><h2>Reported activity, kept on separate bases</h2><div className={styles.tableScroll} role="region" aria-label="Financial bases" tabIndex={0}><table><thead><tr><th>Basis</th><th>Records</th><th className={styles.numeric}>Amount</th></tr></thead><tbody>{activity.totals.map(t=><tr key={t.basis}><td>{t.basis.replaceAll('_',' ')}</td><td>{String(t.records)}</td><td className={styles.numeric}>{money(t.amount_cents)}</td></tr>)}</tbody></table></div><p className={styles.muted}>{profile.observedFiler?'These totals include only this committee’s own filings. The relationship explorer separately includes records naming it as a counterparty; reciprocal filings must not be added as new money.':'Direction is always relative to the filing committee, not this counterparty.'}</p></section>
    <section className={styles.section}><h2>Largest documented relationships</h2><div className={styles.tableScroll} role="region" aria-label="Related entities" tabIndex={0}><table><thead><tr><th>Related record group</th><th>Basis</th><th className={styles.numeric}>Reported amount</th></tr></thead><tbody>{profile.relationships.map((r,i)=><tr key={i}><td>{(String(r.related_id).startsWith('disclosure:')||String(r.related_id).startsWith('unknown:'))?<span>{String(r.name)||'Not identified'}</span>:<Link href={`${BASE}/entities/${encodeURIComponent(String(r.related_id))}`}>{String(r.name)||'Not identified'}</Link>}</td><td>{String(r.basis).replaceAll('_',' ')}</td><td className={styles.numeric}>{money(String(r.amount_cents))}</td></tr>)}</tbody></table></div><p className={styles.muted}>Largest 40 entity-and-basis combinations. Connectivity is not proof of coordination, influence or a donor’s money reaching a particular vendor.</p></section>
    <section className={styles.section}><h2>Recent evidence</h2><Records rows={activity.rows}/><Link href={`${BASE}/explorer?entity=${encodeURIComponent(id)}`}>See every matching record and download evidence →</Link></section>
    <section className={styles.section}><h2>Names present in the record</h2><ul>{profile.aliases.map((r,i)=><li key={i}>{String(r.name)} <span className={styles.muted}>({String(r.first_observed)}–{String(r.last_observed)})</span></li>)}</ul></section>
  </Shell>;
}
