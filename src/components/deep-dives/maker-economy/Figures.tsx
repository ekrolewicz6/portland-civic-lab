'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import data from '@/lib/maker-economy/figures.json';
import { showcaseCommission, showcaseRemainder } from '@/lib/maker-economy/model';
import styles from './figures.module.css';

const money = (n: number) => n.toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 });
const sourceNames: Record<string, string> = {
  'open-studios-2025': 'Portland Open Studios', 'potters-directory': 'Ceramic Showcase',
  'guilds-2026': 'Gathering of the Guilds', 'market-directory': 'Portland Saturday Market',
};
function Caption({ children }: { children: React.ReactNode }) { return <figcaption className={styles.caption}>{children}</figcaption>; }
function FigureTitle({ eyebrow, title, description }: { eyebrow: string; title: string; description?: string }) {
  return <div className={styles.figureHeading}><span className={styles.eyebrow}>{eyebrow}</span><h3>{title}</h3>{description && <p>{description}</p>}</div>;
}

export function DirectoryFigure() {
  const [query, setQuery] = useState('');
  const [source, setSource] = useState('all');
  const [limit, setLimit] = useState(8);
  const profiles = useMemo(() => data.profiles.filter(p => (source === 'all' || p.sources.includes(source)) && `${p.names.join(' ')} ${p.medium}`.toLowerCase().includes(query.toLowerCase().trim())), [query, source]);
  return <figure className={styles.figure}>
    <FigureTitle eyebrow="A register we can inspect" title="Four windows into who makes things" description="597 source listings · Portland studio tour and regional craft networks · reviewed September 15, 2026" />
    <div className={styles.networks}>{data.networks.map(n => <div key={n.id} className={styles.networkRow}>
      <div><a href={n.url}>{sourceNames[n.id]}</a><small>{n.id === 'open-studios-2025' ? '2025 tour profiles' : n.id === 'guilds-2026' ? '2026 exhibitor listings, including shared booths' : 'Undated public directory'}</small></div>
      <div className={styles.networkBar}><span style={{ width: `${n.count / 207 * 100}%` }} /></div><strong>{n.count}</strong>
    </div>)}</div>
    <div className={styles.explorer}>
      <div className={styles.explorerHeading}><h4>Find a name or material</h4><a href="/data/maker-economy/data/directory-listings.csv">Download all listings ↗</a></div>
      <div className={styles.controls}><label>Search<input type="search" placeholder="Try wood, jewelry, or a name" value={query} onChange={e => { setQuery(e.target.value); setLimit(8); }} /></label><label>Network<select value={source} onChange={e => { setSource(e.target.value); setLimit(8); }}><option value="all">All four networks</option>{data.networks.map(n => <option key={n.id} value={n.id}>{sourceNames[n.id]}</option>)}</select></label></div>
      <p className={styles.resultCount} aria-live="polite">{profiles.length} matching profile groups. Grouping is provisional; these are not unique people or verified city businesses.</p>
      <ul className={styles.results}>{profiles.slice(0,limit).map(p => <li key={p.id}><div><strong><a href={p.url}>{p.names.join(' / ')}</a></strong><span>{p.medium}</span></div><div className={styles.profileSources}>{p.sources.map(id => <a key={id} href={data.networks.find(n => n.id === id)!.url}>{sourceNames[id]}</a>)}<small>{p.scope} · production location unverified</small></div></li>)}</ul>
      {!profiles.length && <p>No matching profile in these four directories.</p>}
      {profiles.length > limit && <button className={styles.more} onClick={() => setLimit(n => n + 20)}>Show 20 more</button>}
    </div>
    <Caption>Source counts are listings, not additive counts of people. Exact normalized names and one reviewed website link produce {data.totals.profileGroups} browsing groups; unresolved aliases and collective entries remain. Market listings still need individual activity screening. <Link href="/deep-dives/maker-economy/methodology#6-the-expanded-discovery-register">Matching rules and limitations</Link>.</Caption>
  </figure>;
}

export function ReceiptsFigure() {
  const rows = [...data.nonemployers].sort((a,b) => Number(b.receipts_usd) - Number(a.receipts_usd));
  const labels: Record<string,string> = { '315':'Apparel', '316':'Leather & related products', '321':'Wood products', '3231':'Printing & support', '3271':'Clay & refractory products', '3272':'Glass & glass products', '332':'Fabricated metal', '337':'Furniture & related products', '81142':'Reupholstery & furniture repair' };
  return <figure className={styles.figure}>
    <FigureTitle eyebrow="Business activity · Multnomah County · 2023" title="$25.7 million in receipts, before expenses" description="542 tax-reporting businesses without paid employees, across nine selected industry categories." />
    <div className={styles.columnLabels}><span>Industry category</span><span>Gross receipts</span><span>Businesses</span></div>
    <div className={styles.receiptsRows}>{rows.map(r => <div className={styles.receiptRow} key={r.code}><div>{labels[r.code]}</div><div className={styles.receiptTrack}><span style={{width:`${Number(r.receipts_usd)/5000000*100}%`}} /><strong>${(Number(r.receipts_usd)/1000000).toFixed(2)}m</strong></div><span>{r.establishments}</span></div>)}</div>
    <Caption>Census Nonemployer Statistics, 2023, NAICS codes shown in the <a href="/data/maker-economy/data/nonemployers.csv">data download</a>. Mailing-address geography; categories include non-maker work and omit other makers. Nominal receipts are not profit, wages, or value added. This selected county basket is not a city maker-economy total.</Caption>
  </figure>;
}

export function JobsFigure() {
  const labels: Record<string,string> = {'327110':'Pottery, ceramics & plumbing fixtures','337122':'Wood household furniture','337212':'Custom woodwork & millwork','339910':'Jewelry & silverware','339992':'Musical instruments','332323':'Ornamental & architectural metal','315':'Apparel'};
  return <figure className={styles.figure}>
    <FigureTitle eyebrow="Covered private payroll jobs · Multnomah County" title="Some kinds of production grew. Others contracted." description="Annual-average jobs, 2019 → 2025. All private industries in the county: −7.0%." />
    <div className={styles.legend}><span><i className={styles.dot2019} />2019</span><span><i className={styles.dot2025} />2025</span></div>
    <div className={styles.jobs}>{data.payroll.filter(r => r.code !== '10').map(r => {
      const start=Number(r.jobs_2019), end=Number(r.jobs_2025), pct=Number(r.jobs_change_pct);
      return <div key={r.code} className={styles.jobRow}><div>{labels[r.code]}<small>{start} → {end} jobs</small></div><div className={styles.jobTrack} aria-hidden="true"><span className={styles.jobLine} style={{left:`${Math.min(start,end)/500*100}%`,width:`${Math.abs(end-start)/500*100}%`}}/><i className={styles.dot2019} style={{left:`${start/500*100}%`}}/><i className={styles.dot2025} style={{left:`${end/500*100}%`}}/></div><strong className={pct >= 0 ? styles.positive : styles.negative}>{pct >= 0 ? '+' : '−'}{Math.abs(pct).toFixed(0)}%</strong></div>;
    })}<div className={styles.jobAxis}><span>Same scale on every row</span><div><span>0 jobs</span><span>250</span><span>500</span></div><span /></div></div>
    <Caption>BLS QCEW, private ownership, 2019 and 2025 annual files; <a href="/data/maker-economy/data/derived/employment-comparison.csv">exact counts, classifications, pay, and sources</a>. Industry employment includes non-maker roles and industrial production; self-employed proprietors are excluded. Suppressed categories are omitted from this chart, not treated as zero.</Caption>
  </figure>;
}

export function RevenueBandsFigure() {
  const rows=data.historical.filter(r => r.series==='revenue-band');
  return <figure className={`${styles.figure} ${styles.historical}`}>
    <FigureTitle eyebrow="Historical evidence · 2015 survey" title="There was no single typical maker business" description="Annual sales reported by 84 Portland Made Collective enterprises; a broader mix than this article’s maker definition." />
    <div className={styles.histogram}>{rows.map(r => <div key={r.label}><strong>{r.value}</strong><div className={styles.histColumn}><span style={{height:`${Number(r.value)/30*100}%`}} /></div><span>{r.label}</span></div>)}</div>
    <Caption>Number of responding enterprises in each revenue band. <a href="https://artisaneconomyinitiative.wordpress.com/wp-content/uploads/2016/05/portland-made-collective-survey-report-2015.pdf#page=6">Original report, chart 1</a>. Convenience membership survey; not a city census or a current income estimate. Gross sales do not measure owner earnings.</Caption>
  </figure>;
}

export function WorkspaceFigure() {
  const offers = [
    ['Radius', '$150 / month', 'One shelf; six-month initial commitment; firing extra.', 'https://www.radiusstudio.org/membership/'],
    ['ADX woodshop', '$160 / month', 'Annual contract; demonstrated tool proficiency required.', 'https://artdesignxchange.com/woodshop-portland'],
    ['Morning Ceramics', '$195 / month', 'One shelf; firing is an additional production cost.', 'https://www.morningceramics.com/membership'],
    ['Past Lives', '$200 / month', 'Standard tier; three-month minimum; orientations extra.', 'https://www.pastlives.space/membership'],
    ['Woodworkers Guild', '$85 / year + shop use', 'General dues; shop time $15/hour. Different access model.', 'https://www.guildoforegonwoodworkers.org/About-the-Guild'],
  ];
  return <figure className={`${styles.figure} ${styles.workspaceFigure}`}>
    <FigureTitle eyebrow="Production infrastructure · offers reviewed September 2026" title="Access has a price—and a different bundle at every shop" />
    <div className={styles.offerRows}>{offers.map(([name,price,note,url]) => <div key={name}><a href={url}>{name}</a><strong>{price}</strong><span>{note}</span></div>)}</div>
    <Caption>Selected advertised offers at Portland commercial sites; availability and additional costs vary. These prices do not rank equivalent services or measure operator receipts. <a href="https://guildoforegonwoodworkers.com/page-1863380">Guild annual dues</a>. See the <a href="/data/maker-economy/data/ecosystem.csv">inventory</a> for source and coverage notes.</Caption>
  </figure>;
}

export function SalesCalculator() {
  const [sales,setSales]=useState(3500), [production,setProduction]=useState(1050), [other,setOther]=useState(250), [hours,setHours]=useState(80);
  const commission=showcaseCommission(sales), remainder=showcaseRemainder(sales,production,other);
  const inputs: [string,string,number,(n:number)=>void,number,number][]=[['maker-sales','Event sales ($)',sales,setSales,0,25000],['maker-production','Materials & firing ($)',production,setProduction,0,25000],['maker-other','Other costs counted ($)',other,setOther,0,25000],['maker-hours','All work hours counted',hours,setHours,1,1000]];
  return <figure className={`${styles.figure} ${styles.calculator}`}>
    <FigureTitle eyebrow="Explore the economics · not a forecast" title="How much of a pottery sale becomes income?" description="2026 Ceramic Showcase individual booth. Change the illustrative sales, costs, and hours; event charges follow the published rules." />
    <div className={styles.calcGrid}><div><div className={styles.calcInputs}>{inputs.map(([id,label,value,set,min,max]) => <label key={id} htmlFor={id}>{label}<input id={id} type="number" min={min} max={max} step={id==='maker-hours'?1:50} value={value} onChange={e=>set(Math.max(min, Math.min(max, Number(e.target.value)||min)))} /></label>)}</div><p className={styles.assumptionNote}>Starting costs of $1,050 and $250, and 80 hours, are examples—not surveyed averages. Include preparation, selling, and required event work in your hours.</p></div>
      <div className={styles.receipt} aria-live="polite"><div className={styles.receiptLabel}>Illustrative event account</div><dl><div><dt>Gross sales</dt><dd>{money(sales)}</dd></div><div><dt>Tiered commission</dt><dd>−{money(commission)}</dd></div><div><dt>5 × 10 ft booth + registration</dt><dd>−$295</dd></div><div><dt>Materials & firing entered</dt><dd>−{money(production)}</dd></div><div><dt>Other costs entered</dt><dd>−{money(other)}</dd></div><div className={styles.receiptTotal}><dt>Remaining</dt><dd>{money(remainder)}</dd></div></dl><p><strong>{money(remainder/hours)}</strong> per hour entered, before remaining overhead and taxes.</p></div>
    </div>
    <details className={styles.rules}><summary>See the calculation and what is still unpaid</summary><p>Individual-booth commission: 17% of the first $2,000; 14% of the next $1,000; 12% of the next $1,000; 10% of the next $1,500; 5% above $5,500. Registration is $20; this booth is $275. Group and gallery participation have different terms.</p><p>Remainder = sales − commission − $295 − entered costs. It is available for owner compensation and uncounted costs, including association dues, rent, equipment, insurance, unsold production, and taxes. A negative result means entered costs exceed sales; this is not a business earnings forecast.</p></details>
    <Caption>Fee source: <a href="https://www.oregonpotters.org/showcase-2026">Oregon Potters Association, 2026 Showcase rules</a>. Regional exhibitors at a Portland event. The source’s own $3,500 sales example produces a $540 commission; the calculation reproduces it.</Caption>
  </figure>;
}

export default function MakerFigure({ name }: { name: string }) {
  if(name==='directory') return <DirectoryFigure/>;
  if(name==='receipts') return <ReceiptsFigure/>;
  if(name==='jobs') return <JobsFigure/>;
  if(name==='revenue-bands') return <RevenueBandsFigure/>;
  if(name==='workspace') return <WorkspaceFigure/>;
  if(name==='calculator') return <SalesCalculator/>;
  return null;
}
