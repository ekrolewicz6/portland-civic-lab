import Link from 'next/link';
import { ClipboardList, DoorOpen, Factory, HandCoins, Package, Ruler, Search, Wallet, Wrench } from 'lucide-react';
import data from '@/lib/maker-economy/figures.json';
import { NETWORK_COLORS_DARK, NETWORK_COLORS_LIGHT, NETWORK_NAMES, NETWORK_ORDER } from '@/lib/maker-economy/palette';
import styles from './visuals.module.css';

/* ────────────────────────────────────────────────────────────────────────── */
/* One dot per public listing. 597 listings, four networks, 30 columns.       */
/* ────────────────────────────────────────────────────────────────────────── */

const COLS = 30;

export function ListingMural({ tone = 'dark', columns = COLS, legend = true }: { tone?: 'dark' | 'light'; columns?: number; legend?: boolean }) {
  const colors = tone === 'dark' ? NETWORK_COLORS_DARK : NETWORK_COLORS_LIGHT;
  const networks = NETWORK_ORDER.map(id => data.networks.find(n => n.id === id)!);
  const dots: { id: string; i: number }[] = [];
  for (const n of networks) for (let k = 0; k < n.count; k++) dots.push({ id: n.id, i: dots.length });
  const rows = Math.ceil(dots.length / columns);
  return (
    <figure className={`${styles.mural} ${tone === 'dark' ? styles.muralDark : styles.muralLight}`}>
      <svg viewBox={`0 0 ${columns} ${rows}`} role="img" aria-label={`${data.totals.listings} public listings drawn as one dot each, grouped by the four networks they came from.`} className={styles.muralSvg}>
        {dots.map(d => <circle key={d.i} cx={(d.i % columns) + .5} cy={Math.floor(d.i / columns) + .5} r={.34} fill={colors[d.id]} />)}
      </svg>
      {legend && <figcaption className={styles.muralLegend}>
        <span className={styles.muralTotal}><strong>{data.totals.listings}</strong> public listings · one dot each</span>
        <ul>{networks.map(n => <li key={n.id}><i style={{ background: colors[n.id] }} />{NETWORK_NAMES[n.id]} <b>{n.count}</b></li>)}</ul>
      </figcaption>}
    </figure>
  );
}

/* ────────────────────────────────────────────────────────────────────────── */
/* Four objects, four production routes. The article's opening, drawn.       */
/* ────────────────────────────────────────────────────────────────────────── */

const stroke = { fill: 'none', stroke: 'currentColor', strokeWidth: 1.6, strokeLinecap: 'round', strokeLinejoin: 'round' } as const;

function JacketIcon() {
  return <svg viewBox="0 0 64 64" aria-hidden="true"><g {...stroke}><path d="M24 12l8 4 8-4 10 6-4 12-4-2v24H22V28l-4 2-4-12z" /><path d="M32 16v36M18 30l8-14M46 30l-8-14" /><path d="M26 42h4M34 42h4" strokeDasharray="1.5 2.5" /></g></svg>;
}
function BowlIcon() {
  return <svg viewBox="0 0 64 64" aria-hidden="true"><g {...stroke}><path d="M10 26h44c0 14-9 22-22 22S10 40 10 26z" /><path d="M14 26c4-2 10-3 18-3s14 1 18 3" /><path d="M24 48v4h16v-4" /><path d="M16 32c2 6 8 10 16 10" opacity=".5" /></g></svg>;
}
function TableIcon() {
  return <svg viewBox="0 0 64 64" aria-hidden="true"><g {...stroke}><path d="M8 24h48v6H8z" /><path d="M14 30v22M50 30v22M14 40h36" /><path d="M12 24c6-4 14-6 20-6s14 2 20 6" opacity=".5" /><path d="M20 27h8M36 27h6" opacity=".6" /></g></svg>;
}
function PrototypeIcon() {
  return <svg viewBox="0 0 64 64" aria-hidden="true"><g {...stroke}><rect x="12" y="16" width="40" height="32" rx="2" /><rect x="20" y="24" width="12" height="10" /><circle cx="42" cy="29" r="4" /><path d="M20 40h24M12 22h-4M12 30h-4M12 38h-4M56 22h-4M56 30h-4M56 38h-4" /></g></svg>;
}

const OBJECTS = [
  { icon: <JacketIcon />, name: 'A jacket from reclaimed jerseys', maker: 'Portland Garment Factory', route: ['Reclaimed jerseys & soccer balls', 'PGF build team + two collaborators', 'Nike’s Portland flagship'], known: 'A commercial commission with published credits.', unknown: 'The contract price and how it was divided.', href: '/deep-dives/maker-economy/case-studies#5-portland-garment-factory-commissioned-fabrication' },
  { icon: <BowlIcon />, name: 'A bowl shaped in a home studio', maker: 'Rachael Potter Ceramics', route: ['Clay & glaze bought locally', 'Home studio', 'Online orders, no storefront'], known: 'A home producer reaching customers directly.', unknown: 'How many outside orders were actually filled.', href: '/deep-dives/maker-economy/case-studies#6-rachael-potter-ceramics-making-beyond-shared-space-membership' },
  { icon: <TableIcon />, name: 'A table from Oregon white oak', maker: 'The Joinery', route: ['Oak donated by Zena Forest Products', 'Built in Portland', 'CityTeam, 2025'], known: 'A regional material and production relationship.', unknown: 'No sale: this project was a donation.', href: '/deep-dives/maker-economy/case-studies#8-the-joinery-a-visible-regional-material-relationship' },
  { icon: <PrototypeIcon />, name: 'A prototype on shared tools', maker: 'Past Lives', route: ['Shared wood, metal & textile shop', 'Members or the design/build team', 'Collectors, commissions, industrial clients'], known: 'Infrastructure that makes projects feasible.', unknown: 'Output and income; a tool inventory shows neither.', href: '/deep-dives/maker-economy/case-studies#1-past-lives-shared-production-across-materials' },
];

export function ObjectsBand() {
  return (
    <section className={styles.objects} aria-label="Four objects and how they were made">
      <ul className={styles.objectGrid}>
        {OBJECTS.map(o => (
          <li key={o.name} className={styles.objectCard}>
            <div className={styles.objectIcon}>{o.icon}</div>
            <h3>{o.name}</h3>
            <p className={styles.objectMaker}>{o.maker}</p>
            <ol className={styles.route}>{o.route.map((step, i) => <li key={step}><span>{i + 1}</span>{step}</li>)}</ol>
            <dl className={styles.objectFacts}><div><dt>Documented</dt><dd>{o.known}</dd></div><div><dt>Still unknown</dt><dd>{o.unknown}</dd></div></dl>
            <Link href={o.href} className={styles.objectLink}>Read the case</Link>
          </li>
        ))}
      </ul>
      <p className={styles.objectsNote}>Different products, the same three questions: <strong>who does the work, who buys it, and how much of the payment becomes a livelihood?</strong></p>
    </section>
  );
}

/* ────────────────────────────────────────────────────────────────────────── */
/* Five economic roles, each with its own measure of success.                 */
/* ────────────────────────────────────────────────────────────────────────── */

const ROLES = [
  { icon: <Wallet />, title: 'Livelihoods and supplemental earnings', evidence: 'Payroll and tax records document paid production.', measure: 'Owner earnings, hours, volatility, share of household income.' },
  { icon: <Factory />, title: 'Specialist work for other industries', evidence: 'PGF’s commercial projects; Past Lives’ prototyping offer.', measure: 'Contract values and subcontractor payments.' },
  { icon: <Package />, title: 'Local purchasing and production relationships', evidence: 'Clay, wood, glass, firing, shipping, specialist labor.', measure: 'Which dollars stay in Portland, in Oregon, or leave.' },
  { icon: <DoorOpen />, title: 'A lower-cost way to start and keep producing', evidence: 'Shared facilities without owning every machine.', measure: 'Task cost versus the maker’s next-best alternative.' },
  { icon: <Wrench />, title: 'Repair and longer use', evidence: 'Reupholstery and furniture repair already appear in business data.', measure: 'Completed repairs and payments, before avoided purchases.' },
];

export function RolesFigure() {
  return (
    <figure className={styles.roles}>
      <ol className={styles.roleGrid}>
        {ROLES.map((r, i) => (
          <li key={r.title} className={styles.roleCard}>
            <div className={styles.roleHead}><span className={styles.roleIcon}>{r.icon}</span><span className={styles.roleIndex}>0{i + 1}</span></div>
            <h3>{r.title}</h3>
            <dl><div><dt>Evidence so far</dt><dd>{r.evidence}</dd></div><div><dt>Measure of success</dt><dd>{r.measure}</dd></div></dl>
          </li>
        ))}
      </ol>
    </figure>
  );
}

/* ────────────────────────────────────────────────────────────────────────── */
/* The road to a credible estimate: five steps, in order.                     */
/* ────────────────────────────────────────────────────────────────────────── */

const STEPS = [
  { icon: <ClipboardList />, title: 'Establish the population', detail: 'One calendar year; three targets: people who made things, people paid to, and businesses producing eligible work.' },
  { icon: <Search />, title: 'Audit the discovery register', detail: 'Coverage per source, individuals vs businesses, aliases, activity and location. Publish what stays unresolved.' },
  { icon: <Factory />, title: 'Test coverage with administrative records', detail: 'City-boundary aggregates from Oregon Employment Department and Portland planning staff.' },
  { icon: <HandCoins />, title: 'Measure money where records exist', detail: 'Event-sales extracts, workshop billing, maker accounts. None obtained yet.' },
  { icon: <Ruler />, title: 'Estimate only within a defined frame', detail: 'Eligible records × active-and-paid fraction from a probability sample, by stratum.' },
];

export function RoadmapFigure() {
  return (
    <figure className={styles.roadmap}>
      <ol className={styles.roadmapSteps}>
        {STEPS.map((s, i) => (
          <li key={s.title} className={styles.step}>
            <div className={styles.stepMarker}><span className={styles.stepIcon}>{s.icon}</span></div>
            <p className={styles.stepIndex}>Step {i + 1}</p>
            <h3>{s.title}</h3>
            <p>{s.detail}</p>
          </li>
        ))}
      </ol>
      <figcaption className={styles.roadmapNote}>Not a guessed citywide multiplier on workshop memberships. Formulas and sensitivity checks are in the <Link href="/deep-dives/maker-economy/methodology">measurement appendix</Link>; instruments are in the <Link href="/deep-dives/maker-economy/community-research-kit">community research kit</Link>.</figcaption>
    </figure>
  );
}
