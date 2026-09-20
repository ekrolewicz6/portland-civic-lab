'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import data from '@/lib/maker-economy/figures.json';
import { showcaseCommission, showcaseRemainder } from '@/lib/maker-economy/model';
import { NETWORK_COLORS_LIGHT, NETWORK_NAMES, NETWORK_NOTES, NETWORK_ORDER } from '@/lib/maker-economy/palette';
import { ListingMural, RolesFigure, RoadmapFigure } from './Visuals';
import styles from './figures.module.css';

const money = (n: number) => n.toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 });
const millions = (n: number) => `$${(n / 1e6).toFixed(n >= 1e6 ? 1 : 2)}m`;

function Caption({ children }: { children: React.ReactNode }) { return <figcaption className={styles.caption}>{children}</figcaption>; }
function FigureTitle({ eyebrow, title, description }: { eyebrow: string; title: string; description?: string }) {
  return <div className={styles.figureHeading}><span className={styles.eyebrow}>{eyebrow}</span><h3>{title}</h3>{description && <p>{description}</p>}</div>;
}

/* ── 1. The register: one dot per listing, then the explorer ─────────────── */

export function DirectoryFigure() {
  const [query, setQuery] = useState('');
  const [source, setSource] = useState('all');
  const [limit, setLimit] = useState(8);
  const profiles = useMemo(() => data.profiles.filter(p => (source === 'all' || p.sources.includes(source)) && `${p.names.join(' ')} ${p.medium}`.toLowerCase().includes(query.toLowerCase().trim())), [query, source]);
  const networks = NETWORK_ORDER.map(id => data.networks.find(n => n.id === id)!);
  return <figure className={styles.figure}>
    <FigureTitle eyebrow="A register we can inspect" title="597 public listings. One dot each." description="Four artist and craft networks, extracted name by name. Reviewed September 15, 2026." />
    <div className={styles.registerGrid}>
      <ListingMural tone="light" columns={40} legend={false} />
      <ul className={styles.networkList}>{networks.map(n => <li key={n.id}>
        <i style={{ background: NETWORK_COLORS_LIGHT[n.id] }} />
        <div><a href={n.url}>{NETWORK_NAMES[n.id]}</a><small>{NETWORK_NOTES[n.id]}</small></div>
        <strong>{n.count}</strong>
      </li>)}</ul>
    </div>
    <div className={styles.explorer}>
      <div className={styles.explorerHeading}><h4>Find a name or material</h4><a href="/data/maker-economy/data/directory-listings.csv">Download all listings ↗</a></div>
      <div className={styles.controls}><label>Search<input type="search" placeholder="Try wood, jewelry, or a name" value={query} onChange={e => { setQuery(e.target.value); setLimit(8); }} /></label><label>Network<select value={source} onChange={e => { setSource(e.target.value); setLimit(8); }}><option value="all">All four networks</option>{networks.map(n => <option key={n.id} value={n.id}>{NETWORK_NAMES[n.id]}</option>)}</select></label></div>
      <p className={styles.resultCount} aria-live="polite">{profiles.length} matching profile groups. Grouping is provisional; these are not unique people or verified city businesses.</p>
      <ul className={styles.results}>{profiles.slice(0, limit).map(p => <li key={p.id}><div><strong><a href={p.url}>{p.names.join(' / ')}</a></strong><span>{p.medium}</span></div><div className={styles.profileSources}>{p.sources.map(id => <a key={id} href={data.networks.find(n => n.id === id)!.url}><i style={{ background: NETWORK_COLORS_LIGHT[id] }} />{NETWORK_NAMES[id]}</a>)}<small>{p.scope} · production location unverified</small></div></li>)}</ul>
      {!profiles.length && <p>No matching profile in these four directories.</p>}
      {profiles.length > limit && <button className={styles.more} onClick={() => setLimit(n => n + 20)}>Show 20 more</button>}
    </div>
    <Caption>Source counts are listings, not additive counts of people. Exact normalized names and one reviewed website link produce {data.totals.profileGroups} browsing groups; unresolved aliases and collective entries remain. Market listings still need individual activity screening. <Link href="/deep-dives/maker-economy/methodology#6-the-expanded-discovery-register">Matching rules and limitations</Link>.</Caption>
  </figure>;
}

/* ── 2. Receipts: a treemap of $25.7 million ─────────────────────────────── */

type Rect = { x: number; y: number; w: number; h: number };
type Tile = Rect & { code: string; value: number };

/** Squarified treemap (Bruls, Huizing & van Wijk). Items must be sorted descending. */
function squarify(items: { code: string; value: number }[], rect: Rect): Tile[] {
  const total = items.reduce((s, i) => s + i.value, 0);
  const scale = (rect.w * rect.h) / total;
  const tiles: Tile[] = [];
  let remaining = items.map(i => ({ ...i, area: i.value * scale }));
  let free = { ...rect };
  const worst = (row: { area: number }[], side: number) => {
    const sum = row.reduce((s, r) => s + r.area, 0);
    const max = Math.max(...row.map(r => r.area)), min = Math.min(...row.map(r => r.area));
    return Math.max((side * side * max) / (sum * sum), (sum * sum) / (side * side * min));
  };
  const layoutRow = (row: { code: string; value: number; area: number }[]) => {
    const sum = row.reduce((s, r) => s + r.area, 0);
    const horizontal = free.w >= free.h; // lay the row along the shorter side
    if (horizontal) {
      const w = sum / free.h; let y = free.y;
      for (const r of row) { const h = r.area / w; tiles.push({ x: free.x, y, w, h, code: r.code, value: r.value }); y += h; }
      free = { x: free.x + w, y: free.y, w: free.w - w, h: free.h };
    } else {
      const h = sum / free.w; let x = free.x;
      for (const r of row) { const w = r.area / h; tiles.push({ x, y: free.y, w, h, code: r.code, value: r.value }); x += w; }
      free = { x: free.x, y: free.y + h, w: free.w, h: free.h - h };
    }
  };
  let row: typeof remaining = [];
  while (remaining.length) {
    const side = Math.min(free.w, free.h);
    const next = remaining[0];
    if (!row.length || worst([...row, next], side) <= worst(row, side)) { row.push(next); remaining = remaining.slice(1); }
    else { layoutRow(row); row = []; }
  }
  if (row.length) layoutRow(row);
  return tiles;
}

const RECEIPT_LABELS: Record<string, string> = { '315': 'Apparel', '316': 'Leather', '321': 'Wood products', '3231': 'Printing', '3271': 'Clay', '3272': 'Glass', '332': 'Fabricated metal', '337': 'Furniture', '81142': 'Furniture repair' };

export function ReceiptsFigure() {
  const rows = [...data.nonemployers].map(r => ({ code: r.code, value: Number(r.receipts_usd), establishments: Number(r.establishments) })).sort((a, b) => b.value - a.value);
  const tiles = squarify(rows, { x: 0, y: 0, w: 1000, h: 440 });
  const max = rows[0].value, min = rows[rows.length - 1].value;
  const total = rows.reduce((s, r) => s + r.value, 0);
  const shade = (v: number) => { const t = (v - min) / (max - min); return `color-mix(in oklab, var(--color-lichen) ${Math.round((1 - t) * 100)}%, var(--color-canopy-light))`; };
  return <figure className={styles.figure}>
    <FigureTitle eyebrow="Business activity · Multnomah County · 2023" title="$25.7 million in receipts, before expenses" description="542 tax-reporting businesses without paid employees, across nine selected production and repair categories. Tile area is gross receipts." />
    <div className={styles.treemap} role="img" aria-label="Treemap of nonemployer receipts by category; values listed below.">
      {tiles.map(t => {
        const r = rows.find(x => x.code === t.code)!;
        const tier = t.w >= 150 && t.h >= 70 ? styles.tileLg : t.w >= 100 && t.h >= 44 ? styles.tileMd : styles.tileSm;
        return <div key={t.code} className={`${styles.tile} ${tier} ${t.w < 300 ? styles.tileNarrow : ''} ${t.w < 200 ? styles.tileTight : ''} ${t.value > (max + min) / 2 ? styles.tileLight : ''}`} style={{ left: `${t.x / 10}%`, top: `${t.y / 4.4}%`, width: `${t.w / 10}%`, height: `${t.h / 4.4}%`, background: shade(t.value) }} title={`${RECEIPT_LABELS[t.code]}: ${millions(t.value)} across ${r.establishments} businesses`}>
          <span className={styles.tileLabel}>{RECEIPT_LABELS[t.code]}</span>
          <span className={styles.tileValue}>{millions(t.value)}<small>{r.establishments} businesses</small></span>
        </div>;
      })}
    </div>
    <ul className={styles.tileKey}>{rows.map(r => <li key={r.code}><i style={{ background: shade(r.value) }} /><span>{RECEIPT_LABELS[r.code]}</span><b>{millions(r.value)}</b><small>{r.establishments}</small></li>)}</ul>
    <Caption>Total {millions(total)} across {rows.reduce((s, r) => s + r.establishments, 0)} businesses. Census Nonemployer Statistics, 2023, NAICS codes shown in the <a href="/data/maker-economy/data/nonemployers.csv">data download</a>. Mailing-address geography; categories include non-maker work and omit other makers. Nominal receipts are not profit, wages, or value added. This selected county basket is not a city maker-economy total.</Caption>
  </figure>;
}

/* ── 3. Jobs: an indexed slope chart, 2019 → 2025 ────────────────────────── */

const JOB_LABELS: Record<string, string> = { '327110': 'Pottery & ceramics', '337122': 'Wood household furniture', '337212': 'Custom woodwork & millwork', '339910': 'Jewelry & silverware', '339992': 'Musical instruments', '332323': 'Ornamental & architectural metal', '315': 'Apparel', '10': 'All private industries' };

/** Push labels apart until none are closer than `gap`, preserving order. */
function spread(values: number[], gap: number, lo: number, hi: number) {
  const order = values.map((v, i) => [v, i] as const).sort((a, b) => a[0] - b[0]);
  const out = order.map(o => o[0]);
  for (let i = 1; i < out.length; i++) out[i] = Math.max(out[i], out[i - 1] + gap);
  const overflow = out[out.length - 1] - hi;
  if (overflow > 0) for (let i = out.length - 1; i >= 0; i--) out[i] = Math.min(out[i], i === out.length - 1 ? hi : out[i + 1] - gap);
  for (let i = 0; i < out.length; i++) out[i] = Math.max(out[i], lo + i * gap);
  const result = new Array(values.length).fill(0);
  order.forEach((o, k) => { result[o[1]] = out[k]; });
  return result;
}

export function JobsFigure() {
  const series = data.payroll.map(r => ({ code: r.code, start: Number(r.jobs_2019), end: Number(r.jobs_2025), pct: Number(r.jobs_change_pct), index: (Number(r.jobs_2025) / Number(r.jobs_2019)) * 100, county: r.code === '10' }));
  const lo = 60, hi = 170;
  const y = (index: number) => ((hi - index) / (hi - lo)) * 100;
  const rightY = spread(series.map(s => y(s.index)), 8.5, 2, 98);
  const sorted = [...series].sort((a, b) => b.index - a.index);
  return <figure className={styles.figure}>
    <FigureTitle eyebrow="Covered private payroll jobs · Multnomah County" title="Some kinds of production grew. Others contracted." description="Annual-average jobs, indexed to 2019 = 100. The gray line is every private industry in the county: −7%." />
    <div className={styles.slope}>
      <div className={styles.slopeAxis}><span>2019</span><span>2025</span></div>
      <div className={styles.slopeBody}>
        <div className={styles.slopeLeft}><span style={{ top: `${y(100)}%` }}>100</span></div>
        <svg className={styles.slopeSvg} viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
          {[80, 100, 120, 140, 160].map(v => <line key={v} x1="0" x2="100" y1={y(v)} y2={y(v)} className={v === 100 ? styles.slopeBase : styles.slopeGrid} />)}
          {series.map(s => <line key={s.code} x1="0" y1={y(100)} x2="100" y2={y(s.index)} className={s.county ? styles.slopeCountyLine : s.pct >= 0 ? styles.slopeUp : styles.slopeDown} />)}
        </svg>
        <div className={styles.slopeDots} aria-hidden="true">{series.map(s => <i key={s.code} style={{ top: `${y(s.index)}%` }} className={s.county ? styles.dotCounty : s.pct >= 0 ? styles.dotUp : styles.dotDown} />)}</div>
        <div className={styles.slopeRight}>{series.map((s, i) => <div key={s.code} style={{ top: `${rightY[i]}%` }} className={`${styles.slopeLabel} ${s.county ? styles.slopeCounty : ''}`}><strong className={s.county ? '' : s.pct >= 0 ? styles.positive : styles.negative}>{s.pct >= 0 ? '+' : '−'}{Math.abs(s.pct).toFixed(0)}%</strong><span>{JOB_LABELS[s.code]} · {s.start.toLocaleString()} → {s.end.toLocaleString()} jobs</span></div>)}</div>
      </div>
      <ol className={styles.slopeTable}>{sorted.map(s => <li key={s.code}><i className={s.county ? styles.dotCounty : s.pct >= 0 ? styles.dotUp : styles.dotDown} /><span>{JOB_LABELS[s.code]}</span><b>{s.start.toLocaleString()} → {s.end.toLocaleString()}</b><em className={s.county ? '' : s.pct >= 0 ? styles.positive : styles.negative}>{s.pct >= 0 ? '+' : '−'}{Math.abs(s.pct).toFixed(1)}%</em></li>)}</ol>
    </div>
    <Caption>BLS QCEW, private ownership, 2019 and 2025 annual files; <a href="/data/maker-economy/data/derived/employment-comparison.csv">exact counts, classifications, pay, and sources</a>. Industry employment includes non-maker roles and industrial production; self-employed proprietors are excluded. Suppressed categories are omitted from this chart, not treated as zero.</Caption>
  </figure>;
}

/* ── 4. Historical revenue bands ─────────────────────────────────────────── */

export function RevenueBandsFigure() {
  const rows = data.historical.filter(r => r.series === 'revenue-band');
  const max = 30;
  return <figure className={`${styles.figure} ${styles.historical}`}>
    <FigureTitle eyebrow="Historical evidence · 2015 survey" title="There was no single typical maker business" description="Annual sales reported by 84 Portland Made Collective enterprises; a broader mix than this article’s maker definition." />
    <div className={styles.histogram}>{rows.map(r => <div key={r.label}><strong>{r.value}</strong><div className={styles.histColumn}><span style={{ height: `${Number(r.value) / max * 100}%` }} /></div><span>{r.label}</span></div>)}</div>
    <p className={styles.histNote}>41 of 84 respondents sat in the two bands up to $50,000. Nine reported more than $500,000.</p>
    <Caption>Number of responding enterprises in each revenue band. <a href="https://artisaneconomyinitiative.wordpress.com/wp-content/uploads/2016/05/portland-made-collective-survey-report-2015.pdf#page=6">Original report, chart 1</a>. Convenience membership survey; not a city census or a current income estimate. Gross sales do not measure owner earnings.</Caption>
  </figure>;
}

/* ── 5. Workspace: what access costs ─────────────────────────────────────── */

export function WorkspaceFigure() {
  const offers = [
    { name: 'Radius', monthly: 150, price: '$150 / month', note: 'One shelf; six-month initial commitment; firing extra.', url: 'https://www.radiusstudio.org/membership/' },
    { name: 'ADX woodshop', monthly: 160, price: '$160 / month', note: 'Annual contract; demonstrated tool proficiency required.', url: 'https://artdesignxchange.com/woodshop-portland' },
    { name: 'Morning Ceramics', monthly: 195, price: '$195 / month', note: 'One shelf; firing is an additional production cost.', url: 'https://www.morningceramics.com/membership' },
    { name: 'Past Lives', monthly: 200, price: '$200 / month', note: 'Standard tier; three-month minimum; orientations extra.', url: 'https://www.pastlives.space/membership' },
    { name: 'Woodworkers Guild', monthly: null, price: '$85 / year + $15 / hour', note: 'General dues plus shop time. A different access model.', url: 'https://www.guildoforegonwoodworkers.org/About-the-Guild' },
  ];
  return <figure className={`${styles.figure} ${styles.workspaceFigure}`}>
    <FigureTitle eyebrow="Production infrastructure · offers reviewed September 2026" title="Access has a price, and a different bundle at every shop" />
    <div className={styles.offerRows}>{offers.map(o => <div key={o.name}>
      <a href={o.url}>{o.name}</a>
      <div className={styles.offerTrack} aria-hidden="true">{o.monthly ? <span style={{ width: `${o.monthly / 220 * 100}%` }} /> : <span className={styles.offerDashed} />}</div>
      <strong>{o.price}</strong>
      <span>{o.note}</span>
    </div>)}</div>
    <Caption>Selected advertised offers at Portland commercial sites; availability and additional costs vary. These prices do not rank equivalent services or measure operator receipts. <a href="https://guildoforegonwoodworkers.com/page-1863380">Guild annual dues</a>. See the <a href="/data/maker-economy/data/ecosystem.csv">inventory</a> for source and coverage notes.</Caption>
  </figure>;
}

/* ── 6. The sale-to-income calculator, with a waterfall ──────────────────── */

export function SalesCalculator() {
  const [sales, setSales] = useState(3500), [production, setProduction] = useState(1050), [other, setOther] = useState(250), [hours, setHours] = useState(80);
  const commission = showcaseCommission(sales), remainder = showcaseRemainder(sales, production, other);
  const inputs: [string, string, number, (n: number) => void, number, number][] = [['maker-sales', 'Event sales ($)', sales, setSales, 0, 25000], ['maker-production', 'Materials & firing ($)', production, setProduction, 0, 25000], ['maker-other', 'Other costs counted ($)', other, setOther, 0, 25000], ['maker-hours', 'All work hours counted', hours, setHours, 1, 1000]];
  const steps = [
    { label: 'Gross sales', amount: sales, kind: 'total' as const },
    { label: 'Commission', amount: -commission, kind: 'cost' as const },
    { label: 'Booth + registration', amount: -295, kind: 'cost' as const },
    { label: 'Materials & firing', amount: -production, kind: 'cost' as const },
    { label: 'Other costs', amount: -other, kind: 'cost' as const },
    { label: 'Remaining', amount: remainder, kind: 'result' as const },
  ];
  const top = Math.max(sales, 1), floor = Math.min(0, remainder), span = top - floor || 1;
  let running = sales;
  const bars = steps.map(s => {
    if (s.kind === 'total') return { ...s, from: 0, to: sales };
    if (s.kind === 'result') return { ...s, from: Math.min(0, remainder), to: Math.max(0, remainder) };
    const from = running + s.amount; const bar = { ...s, from: Math.min(from, running), to: Math.max(from, running) }; running = from; return bar;
  });
  const pct = (v: number) => ((top - v) / span) * 100;
  return <figure className={`${styles.figure} ${styles.calculator}`}>
    <FigureTitle eyebrow="Explore the economics · not a forecast" title="How much of a pottery sale becomes income?" description="2026 Ceramic Showcase individual booth. Change the illustrative sales, costs, and hours; event charges follow the published rules." />
    <div className={styles.waterfall} aria-hidden="true">
      {bars.map(b => <div key={b.label} className={styles.wfCol}>
        <div className={styles.wfTrack}>
          {b.kind !== 'total' && <span className={styles.wfZero} style={{ top: `${pct(0)}%` }} />}
          <span className={`${styles.wfBar} ${b.kind === 'cost' ? styles.wfCost : b.kind === 'result' ? (remainder >= 0 ? styles.wfResult : styles.wfLoss) : styles.wfTotal}`} style={{ top: `${pct(b.to)}%`, height: `${Math.max(0.6, ((b.to - b.from) / span) * 100)}%` }} />
        </div>
        <strong>{b.kind === 'cost' ? `−${money(-b.amount)}` : money(b.amount)}</strong>
        <span>{b.label}</span>
      </div>)}
    </div>
    <div className={styles.calcGrid}>
      <div><div className={styles.calcInputs}>{inputs.map(([id, label, value, set, min, max]) => <label key={id} htmlFor={id}>{label}<input id={id} type="number" min={min} max={max} step={id === 'maker-hours' ? 1 : 50} value={value} onChange={e => set(Math.max(min, Math.min(max, Number(e.target.value) || min)))} /></label>)}</div><p className={styles.assumptionNote}>Starting costs of $1,050 and $250, and 80 hours, are examples, not surveyed averages. Include preparation, selling, and required event work in your hours.</p></div>
      <div className={styles.receipt} aria-live="polite"><div className={styles.receiptLabel}>Illustrative event account</div><dl><div><dt>Gross sales</dt><dd>{money(sales)}</dd></div><div><dt>Tiered commission</dt><dd>−{money(commission)}</dd></div><div><dt>5 × 10 ft booth + registration</dt><dd>−$295</dd></div><div><dt>Materials & firing entered</dt><dd>−{money(production)}</dd></div><div><dt>Other costs entered</dt><dd>−{money(other)}</dd></div><div className={styles.receiptTotal}><dt>Remaining</dt><dd>{money(remainder)}</dd></div></dl><p><strong>{money(remainder / hours)}</strong> per hour entered, before remaining overhead and taxes.</p></div>
    </div>
    <details className={styles.rules}><summary>See the calculation and what is still unpaid</summary><p>Individual-booth commission: 17% of the first $2,000; 14% of the next $1,000; 12% of the next $1,000; 10% of the next $1,500; 5% above $5,500. Registration is $20; this booth is $275. Group and gallery participation have different terms.</p><p>Remainder = sales − commission − $295 − entered costs. It is available for owner compensation and uncounted costs, including association dues, rent, equipment, insurance, unsold production, and taxes. A negative result means entered costs exceed sales; this is not a business earnings forecast.</p></details>
    <Caption>Fee source: <a href="https://www.oregonpotters.org/showcase-2026">Oregon Potters Association, 2026 Showcase rules</a>. Regional exhibitors at a Portland event. The source’s own $3,500 sales example produces a $540 commission; the calculation reproduces it.</Caption>
  </figure>;
}

export default function MakerFigure({ name }: { name: string }) {
  if (name === 'directory') return <DirectoryFigure />;
  if (name === 'receipts') return <ReceiptsFigure />;
  if (name === 'jobs') return <JobsFigure />;
  if (name === 'revenue-bands') return <RevenueBandsFigure />;
  if (name === 'workspace') return <WorkspaceFigure />;
  if (name === 'calculator') return <SalesCalculator />;
  if (name === 'roles') return <RolesFigure />;
  if (name === 'roadmap') return <RoadmapFigure />;
  return null;
}
