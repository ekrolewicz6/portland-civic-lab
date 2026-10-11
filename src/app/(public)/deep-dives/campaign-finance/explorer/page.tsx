import Link from 'next/link';
import { pageMeta } from '@/lib/page-meta';
import { BASE,bases,basisLabel,filterParams,parseFilters,FilterError,money } from '@/lib/campaign-finance/filters';
import { transactions,reviewedLinks } from '@/lib/campaign-finance/query';
import { Shell,Records,styles } from '@/components/deep-dives/campaign-finance/Shared';
import { activeManifest } from '@/lib/campaign-finance/active';
export const runtime='nodejs';export const dynamic='force-dynamic';
export const metadata=pageMeta({title:'Oregon campaign-finance explorer',description:'Search the current local ORESTAR transaction database by entity, financial basis, dates, geography and reviewed race links.',path:`${BASE}/explorer`,sectionImage:true});
export default async function Explorer({searchParams}:{searchParams:Promise<Record<string,string|string[]|undefined>>}) {
  const active=activeManifest();
  const manualSource=active.source_files.some(source=>source.method==='user_supplied_manual_export');
  const manualNew=active.source_files.filter(source=>source.method==='user_supplied_manual_export').reduce((sum,source)=>sum+(source.new_rows??0),0);
  const raw=await searchParams;const params=new URLSearchParams();
  for(const [k,v] of Object.entries(raw))if(Array.isArray(v))v.forEach(value=>params.append(k,value));else if(v!==undefined)params.set(k,v);
  let result;
  try{result=await transactions(parseFilters(params,active));}catch(e){return <Shell><header className={styles.profileHeader}><h1>Explore the records</h1></header><div className={styles.empty} role="alert">{e instanceof FilterError?e.message:'The verified local database is unavailable. This is not a zero result.'}<p><Link href={`${BASE}/explorer`}>Reset filters</Link></p></div></Shell>;}
  const f=result.filters;
  const url=(changes:Record<string,string|number>)=>{const p=filterParams(f);for(const[k,v]of Object.entries(changes))p.set(k,String(v));return `${BASE}/explorer?${p}`;};
  const download=filterParams(f);download.delete('page');download.set('format','csv');
  const races=[...new Set(reviewedLinks.filter(l=>l.status==='reviewed').map(l=>l.raceId))];
  return <Shell><header className={styles.profileHeader}><p className={styles.eyebrow} style={{color:'#397356'}}>Follow the evidence</p><h1>Explore the financial record</h1><p>Find committees, donor record groups and payees. Every filter is saved in the URL.</p></header><aside className={styles.notice}><strong>One current transaction database, through {active.end}.</strong> {manualSource?`It includes ${manualNew.toLocaleString()} new records from manual exports. Those files do not establish complete coverage of late filings, so totals remain provisional.`:'The source exports matched their recorded ORESTAR search counts; recent filings may still arrive later.'} Candidate profiles and race comparisons use current transaction totals. Council funding and cumulative charts, statewide accounting, governor totals and supplier payments use the active ledger. Event studies, maps, donor-network tests and official balances retain their separate evidence dates.{result.records>0&&<> For this filter, the latest transaction is dated {result.latest.transaction_date ?? 'unknown'}.</>}</aside>
    <form action={`${BASE}/explorer`} method="get" className={styles.form}><input type="hidden" name="snapshot" value={active.snapshot}/>
      <label>Name search<input name="q" defaultValue={f.q} placeholder="Committee, contributor or payee" maxLength={120}/></label>
      <label>Accounting basis<select name="basis" defaultValue={f.basis}>{bases.map(b=><option value={b} key={b}>{b==='all'?'All bases, kept separate':basisLabel(b)}</option>)}</select></label>
      <label>City matching deposits<select name="matching" defaultValue={f.matching}><option value="all">Include all</option><option value="exclude">Leave out reviewed City matches</option><option value="only">Show only reviewed City matches</option></select></label>
      <label>Transaction family<select name="family" defaultValue={f.family}><option value="all">All records</option><option value="contributions">All contribution subtypes</option><option value="everything_else">Everything except contributions</option></select></label>
      <label>From<input type="date" name="start" defaultValue={f.start} min="2025-01-01" max={active.end} required/></label><label>Through<input type="date" name="end" defaultValue={f.end} min="2025-01-01" max={active.end} required/></label>
      <label>Reported state<input name="state" defaultValue={f.state} maxLength={2} placeholder="OR"/></label><label>Reported city (exact)<input name="city" defaultValue={f.city} placeholder="PORTLAND"/></label>
      <label>Reviewed race<select name="race" defaultValue={f.race}><option value="">All / not linked</option>{races.map(id=><option value={id} key={id}>{id.replaceAll('-',' ')}</option>)}</select></label>
      <label>Filing committee ID<input name="committee" defaultValue={f.committee} inputMode="numeric" placeholder="ORESTAR ID"/></label>
      <label>Entity identifier<input name="entity" defaultValue={f.entity} placeholder="Set by entity profile"/></label><label>Exact source subtype<input name="subtype" defaultValue={f.subtype} placeholder="Optional"/></label>
      <div className={styles.actions}><button type="submit">Apply filters</button><Link href={`${BASE}/explorer`}>Clear</Link></div>
    </form>
    <div className={styles.actions}><h2>{result.records.toLocaleString()} matching records</h2><a className={styles.button} href={`/api/campaign-finance?${download}`}>Download all matching CSV</a></div>
    <p className={styles.muted}>Download includes all matching records, not only this page. The City matching filter uses reviewed deposit IDs; it does not classify every public-source receipt. Residential addresses are omitted. Geographic filters describe the reported counterparty location, not the committee’s jurisdiction.</p>
    <div className={styles.tableScroll} role="region" aria-label="Separate accounting totals" tabIndex={0}><table><thead><tr><th>Basis</th><th>Records</th><th className={styles.numeric}>Reported amount</th></tr></thead><tbody>{result.totals.map(t=><tr key={t.basis}><td>{basisLabel(t.basis)}</td><td>{Number(t.records).toLocaleString()}</td><td className={styles.numeric}>{money(t.amount_cents)}</td></tr>)}</tbody></table></div>
    <p className={styles.muted}>There is deliberately no grand total across these bases. An obligation and its later cash payment are not two purchases. Loans, refunds and noncash support remain separate.</p>
    {result.rows.length?<Records rows={result.rows}/>:<p className={styles.empty}>{result.records?'This page is beyond the filtered results.':'No matching records in this snapshot. That does not establish zero campaign fundraising.'} <Link href={url({page:1})}>Go to first page</Link></p>}
    <nav className={styles.pagination} aria-label="Record pages">{f.page>1&&<Link href={url({page:f.page-1})}>← Previous</Link>}<span>Page {f.page} of {Math.max(1,Math.ceil(result.records/result.pageSize)).toLocaleString()}</span>{f.page*result.pageSize<result.records&&<Link href={url({page:f.page+1})}>Next →</Link>}</nav>
    <footer className={styles.footnote}>Snapshot {result.snapshot} · metric definition {result.metric}. Dates are inclusive. Amounts are stored as integer cents. <Link href={`${BASE}/methodology`}>Interpretation and limitations</Link>.</footer>
  </Shell>;
}
