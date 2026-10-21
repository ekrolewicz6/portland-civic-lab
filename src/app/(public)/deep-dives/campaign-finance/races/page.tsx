import Link from 'next/link';
import { portlandRaces } from '@/lib/voters-guide/portland';
import { BASE } from '@/lib/campaign-finance/filters';
import { currentMoneyFlows, reviewedLinks } from '@/lib/campaign-finance/query';
import { activeManifest } from '@/lib/campaign-finance/active';
import { GOVERNOR_PATH, governor } from '@/lib/campaign-finance/governor';
import { Shell } from '@/components/deep-dives/campaign-finance/Shared';
import { pageMeta } from '@/lib/page-meta';
import s from './races.module.css';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export const metadata = pageMeta({
  title: 'Compare campaign money race by race',
  description: 'What every campaign on Portland’s November 3, 2026 ballot has raised and spent in cash, race by race, from District 3, District 4 and city auditor to governor, from Oregon’s campaign finance records.',
  path: `${BASE}/races`,
  sectionImage: true,
});

const dollars = (cents: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(Math.round(cents / 100));
const longDay = (day: string) => new Intl.DateTimeFormat('en-US', { month: 'long', day: 'numeric', year: 'numeric', timeZone: 'UTC' }).format(new Date(`${day.slice(0, 10)}T12:00:00Z`));

/** The voters guide lists candidates by last name; the governor's data does not, so sort it the same way. */
const lastName = (name: string) => name.split(' ').at(-1) ?? name;

type Row = { id: string; name: string; href: string; committeeId: string | null; raised: number; matching: number; paid: number };
type RaceBlock = { id: string; title: string; method: string; href: string; cta: string; guide: string; rows: Row[]; matchingApplies: boolean };

/** Every race with a reviewed committee for at least one candidate, read from the live ledger. */
async function loadRaces(): Promise<{ races: RaceBlock[]; end: string }> {
  const linkFor = (raceId: string, candidateId: string) =>
    reviewedLinks.find(link => link.status === 'reviewed' && link.raceId === raceId && link.candidateId === candidateId)?.committeeId ?? null;
  const shells = [
    ...portlandRaces.map(race => ({
      id: race.id, title: race.title.replace(' · ', ', '), method: race.method, href: `${BASE}/races/${race.id}`, cta: 'Compare these campaigns', guide: `/voters-guide/${race.id}`, matchingApplies: true,
      people: race.candidates.map(c => ({ id: c.id, name: c.name, href: `/voters-guide/${race.id}/${c.id}#campaign-finance`, committeeId: linkFor(race.id, c.id) })),
    })),
    {
      id: 'oregon-governor', title: 'Governor of Oregon', method: 'Vote for one', href: GOVERNOR_PATH, cta: 'Read the governor’s race investigation', guide: '/voters-guide/oregon-governor', matchingApplies: false,
      people: [...governor.candidates].sort((a, b) => lastName(a.name).localeCompare(lastName(b.name)))
        .map(c => ({ id: c.candidateId, name: c.name, href: `/voters-guide/oregon-governor/${c.candidateId}`, committeeId: c.linkStatus === 'reviewed' ? c.committeeId : null })),
    },
  ];
  const ids = [...new Set(shells.flatMap(race => race.people.map(p => p.committeeId).filter((id): id is string => Boolean(id))))];
  const flows = ids.length ? await currentMoneyFlows(ids) : [];
  const sums = new Map<string, { raised: number; matching: number; paid: number }>();
  for (const f of flows) {
    const t = sums.get(f.committee_id) ?? { raised: 0, matching: 0, paid: 0 };
    t.raised += f.raised_cents; t.matching += f.matching_cents; t.paid += f.paid_cents;
    sums.set(f.committee_id, t);
  }
  const races = shells.map(({ people, ...race }) => ({
    ...race,
    rows: people.map(p => ({ ...p, ...(p.committeeId ? sums.get(p.committeeId) ?? { raised: 0, matching: 0, paid: 0 } : { raised: 0, matching: 0, paid: 0 }) })),
  }));
  return { races, end: activeManifest().end };
}

export default async function Races() {
  const { races, end } = await loadRaces();
  const through = longDay(end);
  return <Shell>
    <header className={s.header}>
      <h1 className={s.title}>Campaign money, race by race</h1>
      <p className={s.lede}>What every campaign on Portland’s November 3 ballot has raised and spent in cash, from Oregon’s campaign finance records through {through}. Open a race to see who gave, when the money came in and how much is City matching funds.</p>
    </header>

    <nav className={s.jump} aria-label="Races on this page">
      {races.map(race => <a key={race.id} href={`#${race.id}`}>{race.title}</a>)}
    </nav>

    {races.map(race => {
      const withMoney = race.rows.filter(r => r.committeeId);
      const unmatched = race.rows.filter(r => !r.committeeId);
      const raised = withMoney.reduce((n, r) => n + r.raised, 0);
      const paid = withMoney.reduce((n, r) => n + r.paid, 0);
      const max = Math.max(1, ...withMoney.map(r => r.raised));
      return <section key={race.id} id={race.id} className={s.race} aria-labelledby={`${race.id}-title`} data-race={race.id}>
        <div className={s.raceHead}>
          <div>
            <h2 id={`${race.id}-title`} className={s.raceTitle}><Link href={race.href}>{race.title}</Link></h2>
            <p className={s.meta}>{race.method} · {race.rows.length} {race.rows.length === 1 ? 'candidate' : 'candidates'}</p>
          </div>
          <dl className={s.totals}>
            <div><dt>Raised in all</dt><dd>{dollars(raised)}</dd></div>
            <div><dt>Spent in all</dt><dd>{dollars(paid)}</dd></div>
          </dl>
        </div>

        {race.matchingApplies && <p className={s.legend}><span className={s.keyRaised} aria-hidden="true" />Raised from donors and other sources <span className={s.keyMatch} aria-hidden="true" />City matching funds</p>}
        <ol className={s.rows}>
          {withMoney.map(row => <li key={row.id} className={s.row} data-candidate={row.id}>
            <Link href={row.href} className={s.name}>{row.name}</Link>
            <div className={s.track} aria-hidden="true">
              <span className={s.bar} style={{ width: `${100 * row.raised / max}%` }}>
                {race.matchingApplies && row.matching > 0 && <span className={s.match} style={{ width: `${100 * row.matching / Math.max(1, row.raised)}%` }} />}
              </span>
            </div>
            <p className={s.figures}>
              <strong>{dollars(row.raised)}</strong> raised
              {race.matchingApplies && row.matching > 0 && <span className={s.matchNote}>, {dollars(row.matching)} City match</span>}
              <span className={s.spent}>{dollars(row.paid)} spent</span>
            </p>
          </li>)}
        </ol>
        {unmatched.length > 0 && <p className={s.none} data-unmatched={unmatched.length}>
          We have not matched a campaign committee to {unmatched.map((row, i) => <span key={row.id}>{i > 0 && (i === unmatched.length - 1 ? ' and ' : ', ')}<Link href={row.href}>{row.name}</Link></span>)} in these records, so {unmatched.length === 1 ? 'that total is' : 'their totals are'} unknown, not zero.
        </p>}

        <p className={s.more}>
          <Link href={race.href} className={s.cta}>{race.cta} <span aria-hidden="true">→</span></Link>
          <Link href={race.guide}>Positions in the voters guide</Link>
        </p>
      </section>;
    })}

    <section className={s.about} aria-labelledby="about-numbers">
      <h2 id="about-numbers">About these numbers</h2>
      <ul>
        <li>Cash contributions and cash payments that campaigns reported to the Oregon Secretary of State, from January 1, 2025 through {through}. Loans, in-kind help and unpaid bills are left out.</li>
        <li>Campaigns have up to 30 days to report, and 7 days in the six weeks before the election, so the most recent weeks will keep growing.</li>
        <li>Bars compare the campaigns within one race, not one race with another. City of Portland matching funds apply to city races only.</li>
        <li>A committee’s total can include money it raised for an earlier campaign by the same candidate.</li>
        <li>These records come from a manual export of ORESTAR, Oregon’s campaign finance system, and may miss late filings, amendments or removals. November and December 2024 are not included. <Link href={`${BASE}/methodology`}>How we read the records</Link></li>
      </ul>
    </section>
  </Shell>;
}
