import type { Metadata } from "next";
import Link from "next/link";
import { pageMeta } from "@/lib/page-meta";
import { DIVE_CONTAINER, Section } from "@/components/deep-dives/shared";
import {
  SOURCES,
  HEADLINE,
  PRIORITY_TIERS,
  VERDICT,
  DOCTRINE_POINTS,
  ANNUAL_QUESTION,
  type Source,
} from "@/lib/venues/data";
import { ASSETS, type VenueAsset } from "@/lib/venues/assets";
import { DEBATES } from "@/lib/venues/arguments";
import { fmtMillions } from "@/lib/venues/engine";
import PortfolioMap from "@/components/deep-dives/venues/PortfolioMap";
import GovernanceGrade from "@/components/deep-dives/venues/GovernanceGrade";
import FourEconomics from "@/components/deep-dives/venues/FourEconomics";
import UtilizationChart from "@/components/deep-dives/venues/UtilizationChart";
import CapitalCliff from "@/components/deep-dives/venues/CapitalCliff";
import RankingMatrix from "@/components/deep-dives/venues/RankingMatrix";
import PhaseTimeline from "@/components/deep-dives/venues/PhaseTimeline";
import FinancingSources from "@/components/deep-dives/venues/FinancingSources";
import InstitutionModel from "@/components/deep-dives/venues/InstitutionModel";
import OwnerDataModel from "@/components/deep-dives/venues/OwnerDataModel";
import DoctrineCard from "@/components/deep-dives/venues/DoctrineCard";
import Debate from "@/components/deep-dives/venues/Debate";
import LiveStatus from "@/components/deep-dives/venues/LiveStatus";
import AffordabilityCalculator from "@/components/deep-dives/venues/AffordabilityCalculator";
import PortfolioQuadrant from "@/components/deep-dives/venues/PortfolioQuadrant";
import ReadingProgress from "@/components/deep-dives/venues/ReadingProgress";
import CapitalScore from "@/components/deep-dives/venues/CapitalScore";

export const metadata: Metadata = pageMeta({
  title: "Every big stage in Portland belongs to you. So do the bills.",
  description:
    "The arena, the sold-out stadium, five theaters, the raceway, the town square. Portlanders own them all. Repairs could top a billion dollars, and City Hall can't say what any of these buildings earns, costs, or needs. An accounting of what you own, and a plan to run it well.",
  path: "/deep-dives/venue-portfolio",
  type: "article",
});

const NAV = [
  { id: "doctrine", label: "The doctrine" },
  { id: "portfolio", label: "The portfolio" },
  { id: "economics", label: "Four kinds of money" },
  { id: "utilization", label: "Utilization" },
  { id: "money", label: "The architecture" },
  { id: "assets", label: "Asset by asset" },
  { id: "cliff", label: "The capital cliff" },
  { id: "afford", label: "Affordability" },
  { id: "framework", label: "Gates & score" },
  { id: "strategy", label: "Ten years" },
  { id: "financing", label: "Ten kinds of capital" },
  { id: "institution", label: "The owner" },
  { id: "data", label: "The operating system" },
  { id: "verdict", label: "The verdict" },
  { id: "method", label: "Method" },
];

function Src({ id }: { id: keyof typeof SOURCES }) {
  const s = SOURCES[id];
  return (
    <a
      href={s.url}
      target={s.url.startsWith("/") ? undefined : "_blank"}
      rel="noopener noreferrer"
      className="text-[var(--color-canopy)] underline decoration-[var(--color-sage)]/50 underline-offset-2 hover:decoration-[var(--color-canopy)]"
    >
      {s.org}
    </a>
  );
}

function DarkSrc({ id }: { id: keyof typeof SOURCES }) {
  const s = SOURCES[id];
  return (
    <a
      href={s.url}
      target={s.url.startsWith("/") ? undefined : "_blank"}
      rel="noopener noreferrer"
      className="text-white/80 underline decoration-white/40 underline-offset-2 hover:text-white hover:decoration-white"
    >
      {s.org}
    </a>
  );
}

function dedupeSources(): Source[] {
  const all = Object.values(SOURCES) as Source[];
  const byUrl = new Map<string, Source>();
  for (const s of all) if (!byUrl.has(s.url)) byUrl.set(s.url, s);
  const rank = { primary: 0, analysis: 1, book: 2, news: 3 } as const;
  return [...byUrl.values()].sort(
    (a, b) => (rank[a.kind] ?? 9) - (rank[b.kind] ?? 9) || a.org.localeCompare(b.org),
  );
}

/**
 * Required by our independence commitments: public analysis touching the
 * Moda Center deal carries this disclosure in-page.
 */
function IndependenceNote() {
  return (
    <div className="mt-6 rounded-sm border border-[var(--color-parchment)] bg-[var(--color-paper-warm)] p-5">
      <div className="h-[2px] w-8 bg-[var(--color-ember)]" />
      <p className="mt-3 font-mono text-[10px] uppercase tracking-[0.18em] text-[var(--color-ember)]">
        Where we&apos;re not neutral
      </p>
      <p className="mt-2 text-[13.5px] leading-relaxed text-[var(--color-ink-light)]">
        Portland Civic Lab&apos;s founder publicly runs Rip City Not Rip Off, an advocacy campaign
        about the Moda Center deal analyzed on this page. This analysis is built entirely from
        public sources, every source is labeled, and our paid work excludes the live arena matter.
        The full policy lives on our{" "}
        <Link href="/independence" className="font-semibold text-[var(--color-canopy)] hover:underline">
          Independence page
        </Link>
        .
      </p>
    </div>
  );
}

const GRADE_TONES: Record<string, string> = {
  good: "border-[var(--color-fern)]/50 bg-[var(--color-fern)]/10 text-[var(--color-canopy)]",
  warn: "border-[var(--color-clay)]/50 bg-[var(--color-clay)]/10 text-[var(--color-clay)]",
  bad: "border-[var(--color-ember)]/60 bg-[var(--color-ember)]/12 text-[var(--color-clay)]",
  na: "border-[var(--color-parchment)] bg-[var(--color-paper-warm)] text-[var(--color-ink-muted)]",
};

function AssetCard({ asset }: { asset: VenueAsset }) {
  return (
    <article
      id={`asset-${asset.id}`}
      className="scroll-mt-24 overflow-hidden rounded-sm border border-[var(--color-parchment)] bg-white"
    >
      <div className="border-b border-[var(--color-parchment)] bg-[var(--color-paper-warm)] px-5 py-4 sm:px-6">
        <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-[var(--color-ember)]">
          {asset.kicker}
        </p>
        <h3 className="mt-1 font-editorial text-[26px] leading-tight text-[var(--color-ink)]">
          {asset.name}
        </h3>
      </div>

      <div className="p-5 sm:p-6">
        <p className="max-w-3xl text-[15px] leading-relaxed text-[var(--color-ink-light)]">
          {asset.role}
        </p>

        <div className="mt-4 flex flex-wrap gap-2">
          {asset.grades.map((g) => (
            <span
              key={g.label}
              className={`inline-flex items-center gap-1.5 rounded-sm border px-2.5 py-1 font-mono text-[11px] ${GRADE_TONES[g.tone]}`}
            >
              <span className="uppercase tracking-[0.08em] opacity-70">{g.label}</span>
              <span className="font-semibold">{g.value}</span>
            </span>
          ))}
        </div>

        <div className="mt-5 grid gap-4 md:grid-cols-2">
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-[var(--color-canopy)]">
              Strengths
            </p>
            <ul className="mt-2 space-y-1.5">
              {asset.strengths.map((s) => (
                <li key={s} className="flex gap-2 text-[13.5px] leading-snug text-[var(--color-ink)]">
                  <span className="mt-[7px] h-1 w-1 flex-shrink-0 rounded-full bg-[var(--color-fern)]" />
                  {s}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-[var(--color-clay)]">
              Weaknesses &amp; risks
            </p>
            <ul className="mt-2 space-y-1.5">
              {asset.risks.map((r) => (
                <li key={r} className="flex gap-2 text-[13.5px] leading-snug text-[var(--color-ink)]">
                  <span className="mt-[7px] h-1 w-1 flex-shrink-0 rounded-full bg-[var(--color-clay)]" />
                  {r}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {asset.subVenues && (
          <div className="mt-5 grid gap-3 md:grid-cols-3">
            {asset.subVenues.map((sv) => (
              <div key={sv.name} className="rounded-sm border border-[var(--color-parchment)] bg-[var(--color-paper-warm)] p-4">
                <p className="text-[13.5px] font-semibold leading-snug text-[var(--color-ink)]">{sv.name}</p>
                <p className="mt-1.5 text-[12.5px] leading-relaxed text-[var(--color-ink-light)]">{sv.body}</p>
              </div>
            ))}
          </div>
        )}

        {asset.keyQuestion && (
          <p className="mt-5 border-l-2 border-[var(--color-ember)] pl-4 text-[14px] font-semibold leading-relaxed text-[var(--color-ink)]">
            The question: {asset.keyQuestion}
          </p>
        )}

        <div className="mt-5 rounded-sm border border-[var(--color-canopy)]/25 bg-[var(--color-canopy)]/[0.05] p-4">
          <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-[var(--color-canopy)]">
            What Portland should do
          </p>
          <p className="mt-1.5 text-[14.5px] font-semibold text-[var(--color-ink)]">
            {asset.directive.headline}
          </p>
          <p className="mt-1 text-[13.5px] leading-relaxed text-[var(--color-ink-light)]">
            {asset.directive.detail}
          </p>
        </div>

        {asset.liveSlug && <div className="mt-4"><LiveStatus slug={asset.liveSlug} /></div>}

        {asset.sourceIds && (
          <p className="mt-4 flex flex-wrap gap-x-3 gap-y-1 font-mono text-[10px] uppercase tracking-[0.12em] text-[var(--color-ink-muted)]">
            <span>Sources:</span>
            {asset.sourceIds.map((sid) => (
              <Src key={sid} id={sid} />
            ))}
          </p>
        )}
      </div>
    </article>
  );
}

export default function VenuePortfolioPage() {
  return (
    <article className="bg-[var(--color-paper)]">
      {/* ── hero ── */}
      <header className="noise-overlay relative overflow-hidden bg-[var(--color-canopy)] py-16 text-white sm:py-20">
        <div className={`relative z-10 ${DIVE_CONTAINER}`}>
          <div className="grid gap-10 xl:grid-cols-[minmax(0,1fr)_minmax(300px,380px)]">
            <div>
              <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-[var(--color-ember-bright)]">
                <Link href="/deep-dives" className="hover:text-white">Policy deep-dive</Link> ——— Venues &amp; public assets
              </p>
              <h1 className="mt-5 font-editorial-normal text-[40px] leading-[1.05] sm:text-[56px] xl:text-[64px]">
                Every big stage in Portland belongs to you.
                <span className="block font-editorial italic text-[var(--color-ember-bright)]">
                  So do the bills.
                </span>
              </h1>
              <p className="mt-6 max-w-2xl text-[17px] leading-relaxed text-white/75">
                The court the Blazers play on. The stadium where the Timbers sell out. The hall
                where the symphony plays, the stage the Broadway tours land on, the square with the
                holiday tree. If Portland gathers there, odds are Portland owns it. You own it.
                Over the next ten years these buildings need repairs that could top a billion
                dollars, and nobody at City Hall can tell you what any of them earns, what any of
                them costs, or which one deserves the next dollar. This is an accounting of what
                you own, and a plan for running it well.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <a
                  href="#doctrine"
                  className="rounded-sm bg-[var(--color-ember)] px-5 py-3 text-[15px] font-semibold text-[var(--color-canopy)] hover:bg-[var(--color-ember-bright)]"
                >
                  The one-page plan
                </a>
                <a
                  href="#cliff"
                  className="rounded-sm border border-white/25 px-5 py-3 text-[14px] font-semibold text-white hover:bg-white/10"
                >
                  See the bills coming due
                </a>
              </div>
            </div>

            <aside className="hidden rounded-sm border border-white/15 bg-white/[0.04] p-6 xl:block">
              <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-[var(--color-ember-bright)]">
                The short version
              </p>
              <dl className="mt-4 space-y-4">
                <div>
                  <dt className="text-[14px] font-semibold text-white">The good news</dt>
                  <dd className="mt-1 text-[14px] leading-relaxed text-white/65">
                    The buildings are busy. A million and a half people a year at the arena,
                    sold-out soccer, packed Broadway runs. Nobody has to invent demand.
                  </dd>
                </div>
                <div>
                  <dt className="text-[14px] font-semibold text-white">The problem</dt>
                  <dd className="mt-1 text-[14px] leading-relaxed text-white/65">
                    Ask City Hall what any one building earns, costs, or needs, and no single office
                    can answer. We grade how the city manages all of it: C.
                  </dd>
                </div>
                <div>
                  <dt className="text-[14px] font-semibold text-white">The stakes</dt>
                  <dd className="mt-1 text-[14px] leading-relaxed text-white/65">
                    Repair-or-replace decisions worth as much as a billion dollars, all landing
                    between now and 2036. They will be decided well, or one crisis at a time.
                  </dd>
                </div>
              </dl>
            </aside>
          </div>

          <dl className="mt-12 grid grid-cols-2 gap-px overflow-hidden rounded-sm border border-white/10 bg-white/10 sm:grid-cols-4">
            {[
              { k: "People through these venues every year", v: "2M+" },
              { k: "Bills that could come due by 2036", v: "$1B+" },
              { k: "The biggest single renovation on the table", v: fmtMillions(HEADLINE.modaFramework) },
              { k: "Our grade for how it's all managed", v: HEADLINE.ownerGrade },
            ].map((s) => (
              <div key={s.k} className="bg-[var(--color-canopy)] p-5">
                <dd className="font-mono text-[26px] font-bold tabular-nums text-white sm:text-[30px]">
                  {s.v}
                </dd>
                <dt className="mt-1 font-mono text-[10px] uppercase tracking-[0.12em] text-white/50">
                  {s.k}
                </dt>
              </div>
            ))}
          </dl>
        </div>
      </header>

      {/* ── nav ── */}
      <nav className="sticky top-14 z-40 border-b border-[var(--color-parchment)] bg-[var(--color-paper)]/95 backdrop-blur print:hidden" aria-label="Section navigation">
        <ReadingProgress />
        <div className={DIVE_CONTAINER}>
          <div className="scrollbar-hide flex gap-1 overflow-x-auto py-2 font-mono text-[12px] uppercase tracking-[0.08em]">
            {NAV.map((n) => (
              <a
                key={n.id}
                href={`#${n.id}`}
                className="flex min-h-[44px] items-center whitespace-nowrap rounded-sm px-3 py-3 text-[var(--color-ink-light)] hover:bg-[var(--color-paper-warm)] hover:text-[var(--color-canopy)]"
              >
                {n.label}
              </a>
            ))}
          </div>
        </div>
      </nav>

      {/* ── 1 · doctrine ── */}
      <Section
        id="doctrine"
        tone="dark"
        eyebrow="01 · For the elected reader"
        title="One page you could govern by"
        lead="Everything below argues for a single management philosophy. Here it is up front: quotable, printable, and short enough to survive a work session."
      >
        <DoctrineCard />
        <p className="mt-5 max-w-3xl text-[13.5px] leading-relaxed text-white/60">
          The framework, grades, and doctrine on this page are <DarkSrc id="pclAnalysis" />, our
          synthesis of the public record. Every load-bearing figure links to its source; everything
          we could not verify is listed in the <a href="#method" className="underline decoration-white/40 hover:decoration-white">Method</a> section.
        </p>
      </Section>

      {/* ── 2 · portfolio ── */}
      <Section
        id="portfolio"
        eyebrow="02 · The complete perimeter"
        title="What Portland owns, and who actually runs it"
        lead="The assets are split across a City program, an arts office, a parks bureau, a regional government, nonprofit managers, and private operators. Fragmentation is why the basic owner questions go unanswered."
      >
        <PortfolioMap />
        <div className="mt-8">
          <GovernanceGrade />
        </div>
        <p className="mt-5 max-w-3xl text-[14px] leading-relaxed text-[var(--color-ink-light)]">
          The structural problem is not outsourcing. Specialized operators can outperform government
          at booking, concessions, and event production. The problem is <strong className="text-[var(--color-ink)]">outsourcing without a
          sufficiently powerful owner function</strong>: contracts going out the door faster than the
          capacity to watch them.
        </p>
      </Section>

      {/* ── 3 · economics ── */}
      <Section
        id="economics"
        tone="warm"
        eyebrow="03 · The accounting problem"
        title="Four kinds of money, routinely blurred together"
        lead="A venue can generate enormous regional spending and weak owner economics. A cultural hall can lose money while buying exactly what the public wants. Until the ledgers are separated, every venue debate is two people using the same word for different things."
      >
        <FourEconomics />
        <p className="mt-5 max-w-3xl text-[14px] leading-relaxed text-[var(--color-ink-light)]">
          Portland&apos;5 exposes the weakness plainly: the performing-arts workgroup had to{" "}
          <em>model</em> expense allocation across buildings because clean venue-level books were
          never kept. Every venue needs both an owner-financial scorecard and a public-value
          scorecard, and the two must never be netted into one number.
        </p>
        <Debate debate={DEBATES.subsidyVsCommercial} />
      </Section>

      {/* ── 4 · utilization ── */}
      <Section
        id="utilization"
        eyebrow="04 · What the buildings actually do"
        title="Event count is not utilization"
        lead="The portfolio is not suffering from lack of demand. It is suffering from an owner who counts events instead of people and dollars."
      >
        <UtilizationChart />
        <p className="mt-3 max-w-3xl text-[12.5px] leading-relaxed text-[var(--color-ink-muted)]">
          Venue-level events, attendance, and charges-for-services: <Src id="p5RevenueDoc" />.
          Newmark&apos;s revenue line carries all Hatfield Hall allocated revenues per that
          document&apos;s own footnote.
        </p>
        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          <div className="rounded-sm border border-[var(--color-parchment)] bg-white p-5">
            <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-[var(--color-ember)]">
              Moda Center
            </p>
            <p className="mt-2 font-mono text-[30px] font-bold tabular-nums text-[var(--color-ink)]">1.5M</p>
            <p className="text-[13px] leading-relaxed text-[var(--color-ink-light)]">
              annual visitors through a ~19,000-seat arena that opened in 1995. The question was
              never demand. It is whether the owner captures enough value under its contracts.{" "}
              <Src id="wikiModa" />
            </p>
          </div>
          <div className="rounded-sm border border-[var(--color-parchment)] bg-white p-5">
            <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-[var(--color-ember)]">
              Providence Park
            </p>
            <p className="mt-2 font-mono text-[30px] font-bold tabular-nums text-[var(--color-ink)]">~150</p>
            <p className="text-[13px] leading-relaxed text-[var(--color-ink-light)]">
              events a year (matches, concerts, camps) in a 25,000+ seat stadium expanded in 2019
              on roughly {fmtMillions(HEADLINE.providencePrivate)} of private money. Proof that
              strong public venues can attract private capital. <Src id="wikiProvidence" />
            </p>
          </div>
        </div>
      </Section>

      {/* ── 5 · money ── */}
      <Section
        id="money"
        eyebrow="05 · The financial architecture"
        title="A dollar, a fund, and a cross-subsidy"
        lead="Three structures carry the portfolio's money, and each hides something worth seeing."
      >
        <div className="space-y-5">
          <div className="rounded-sm border border-[var(--color-parchment)] bg-white p-5 sm:p-6">
            <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-[var(--color-canopy)]">
              The Spectator Venues &amp; Visitor Activities Fund
            </p>
            <p className="mt-2 max-w-3xl text-[14.5px] leading-relaxed text-[var(--color-ink-light)]">
              Ticket and user fees, Rose Quarter parking, agreement revenues, and allocations from
              the Multnomah County Visitor Facilities Trust Account (lodging and rental-car taxes)
              flow in; Rose Quarter and Providence Park obligations, debt, capital, and
              visitor-economy commitments flow out. The strategic mistake would be treating
              dedicated revenues as economically free because they are not General Fund dollars.{" "}
              <strong className="text-[var(--color-ink)]">Parking revenue, ticket fees, and visitor taxes are still public resources
              with opportunity costs.</strong>{" "}
              (Fund structure: <Src id="fin358" />; the trust account&apos;s lodging and rental-car
              surcharges: <Src id="multcoTlt" />, <Src id="multcoRental" />.)
            </p>
          </div>

          <div className="rounded-sm border border-[var(--color-parchment)] bg-white p-5 sm:p-6">
            <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-[var(--color-canopy)]">
              The 2024 Rose Quarter bridge deal: before and after
            </p>
            <div className="mt-3 grid gap-4 md:grid-cols-2">
              <div className="rounded-sm bg-[var(--color-paper-warm)] p-4">
                <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-[var(--color-ink-muted)]">Before 2024</p>
                <p className="mt-1.5 text-[13.5px] leading-relaxed text-[var(--color-ink)]">
                  The City owned most Rose Quarter land, the Coliseum, garages, and public areas.
                  Moda Center and the adjacent office/retail building were privately owned on
                  City ground-leased land.
                </p>
              </div>
              <div className="rounded-sm bg-[var(--color-paper-warm)] p-4">
                <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-[var(--color-ink-muted)]">After 2024</p>
                <p className="mt-1.5 text-[13.5px] leading-relaxed text-[var(--color-ink)]">
                  The arena transferred to the City for <span className="font-mono font-semibold">$1</span>; the City
                  paid <span className="font-mono font-semibold">$7.13M</span>, based on independent
                  appraisals, for the remaining private land under part of it; the team committed
                  through October 2030 with an option to 2035. The City became the owner of an
                  aging major-league arena while the much larger renovation-and-lease negotiation
                  stayed unresolved.
                </p>
              </div>
            </div>
            <p className="mt-3 max-w-3xl text-[13.5px] leading-relaxed text-[var(--color-ink-light)]">
              More asset value, more strategic control, and more exposure. The dollar was cheap.
              What the dollar obligates is not. (<Src id="ord191857" />, <Src id="bridgeFactSheet" />)
            </p>
          </div>

          <div className="rounded-sm border border-[var(--color-parchment)] bg-white p-5 sm:p-6">
            <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-[var(--color-canopy)]">
              The Portland&apos;5 cross-subsidy
            </p>
            <p className="mt-2 max-w-3xl text-[14.5px] leading-relaxed text-[var(--color-ink-light)]">
              Workgroup modeling of FY2023–24 shows Keller with a positive operating contribution,
              and the Schnitzer and Hatfield Hall carrying substantial earned deficits. The
              cross-subsidy is not irrational: Keller&apos;s commercial strength supports cultural
              programming elsewhere. But it means <strong className="text-[var(--color-ink)]">the future of Keller is inseparable from
              the economics of the entire Portland&apos;5 system</strong>: modest annual operations
              sitting on top of very large building liabilities.
            </p>
          </div>
        </div>
        <IndependenceNote />
      </Section>

      {/* ── 6 · assets ── */}
      <Section
        id="assets"
        eyebrow="06 · Asset by asset"
        title="Eleven verdicts"
        lead="Each asset judged against its mission: commercial assets on owner return and risk transfer, cultural assets on measured outcomes and affordable lifecycle plans. Grades are ours; the facts are sourced."
      >
        <div className="mb-6 flex flex-wrap gap-1.5">
          {ASSETS.map((a) => (
            <a
              key={a.id}
              href={`#asset-${a.id}`}
              className="flex min-h-[36px] items-center rounded-full border border-[var(--color-parchment)] bg-white px-3 py-1.5 font-mono text-[11px] text-[var(--color-ink-light)] transition-colors hover:border-[var(--color-sage)] hover:text-[var(--color-canopy)]"
            >
              {a.name}
            </a>
          ))}
        </div>
        <div className="space-y-6">
          <AssetCard asset={ASSETS[0]} />
          <Debate debate={DEBATES.modaInvestVsWalk} />
          <AssetCard asset={ASSETS[1]} />
          <AssetCard asset={ASSETS[2]} />
          <Debate debate={DEBATES.garagesParkVsRedevelop} />
          <AssetCard asset={ASSETS[3]} />
          <AssetCard asset={ASSETS[4]} />
          <AssetCard asset={ASSETS[5]} />
          <AssetCard asset={ASSETS[6]} />
          <Debate debate={DEBATES.hatfieldConsolidateVsPreserve} />
          <AssetCard asset={ASSETS[7]} />
          <AssetCard asset={ASSETS[8]} />
          <AssetCard asset={ASSETS[9]} />
          <AssetCard asset={ASSETS[10]} />
        </div>

        <div className="mt-10">
          <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-[var(--color-ember)]">
            The portfolio, ranked
          </p>
          <h3 className="mt-1 font-editorial text-[24px] text-[var(--color-ink)]">
            Twelve assets, two axes, one table
          </h3>
          <div className="mt-4">
            <PortfolioQuadrant />
          </div>
          <div className="mt-5">
            <RankingMatrix />
          </div>
        </div>
      </Section>

      {/* ── 7 · cliff ── */}
      <Section
        id="cliff"
        tone="dark"
        eyebrow="07 · The capital cliff"
        title="Everything is arriving at once"
        lead="Ten exposures, three of them unknown: different periods, different funding sources, mutually exclusive choices. They must not be mechanically added. They must also not be faced one political emergency at a time."
      >
        <CapitalCliff />
        <p className="mt-4 max-w-3xl text-[12.5px] leading-relaxed text-white/50">
          Sources: Moda framework and eligible projects, <DarkSrc id="modaResolution" /> and{" "}
          <DarkSrc id="sb1501" />; VMC bond proceeds, <DarkSrc id="svAnnualReport" />;
          Portland&apos;5 ranges, <DarkSrc id="sazanFca" />; PSU figures,{" "}
          <DarkSrc id="res2026270" /> and <DarkSrc id="artswatchPsu" />. Unknowns are unknowns
          because no public document resolves them.
        </p>
      </Section>

      {/* ── 8 · afford ── */}
      <Section
        id="afford"
        tone="warm"
        eyebrow="08 · The affordability test"
        title="Efficiency cannot solve a capital problem"
        lead="Finance the Portland'5 backlog with 30-year debt and see what the annual payment does to a system whose whole FY24–25 shortfall was $4.51 million, and whose food-and-beverage program nets $1.7 million."
      >
        <AffordabilityCalculator />
        <p className="mt-5 max-w-3xl text-[14px] leading-relaxed text-[var(--color-ink-light)]">
          Better concessions, sponsorship, ticketing, and dark-day programming could plausibly
          improve results by millions. That is valuable, and nowhere near sufficient. Even an implausibly
          clean doubling of food-and-beverage adds about {fmtMillions(HEADLINE.p5FnbNet)} before
          incremental expense. The arithmetic is the argument: the capital program needs capital
          sources, not operating hopes. (Shortfall and F&amp;B actuals: <Src id="p5Financials" />;
          capital ranges: the February–March 2026 Säzän Group facility-condition assessments,{" "}
          <Src id="sazanFca" />, reported at &ldquo;up to $336 million&rdquo; by <Src id="artswatchFca" />.)
        </p>
      </Section>

      {/* ── 9 · framework ── */}
      <Section
        id="framework"
        eyebrow="09 · The allocation framework"
        title="Five gates, one hundred points"
        lead="Before any project is scored, it must pass five pass/fail gates. Only then do a hundred weighted points force the same questions across every asset, arena and theater alike. Try it."
      >
        <CapitalScore />
        <div className="mt-8">
          <PriorityTiers />
        </div>
      </Section>

      {/* ── 10 · strategy ── */}
      <Section
        id="strategy"
        eyebrow="10 · The ten-year strategy"
        title="August 2026 to June 2036, in four phases"
        lead="Establish owner control. Stabilize and redesign. Make the major physical choices. Then renew, rebid, and rebalance, all of it on evidence."
      >
        <PhaseTimeline />
        <Debate debate={DEBATES.psuVsKeller} />
        <div className="mt-8">
          <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-[var(--color-ember)]">
            The live record
          </p>
          <h3 className="mt-1 font-editorial text-[24px] text-[var(--color-ink)]">
            Where these decisions stand right now
          </h3>
          <div className="mt-4">
            <LiveStatus />
          </div>
        </div>
      </Section>

      {/* ── 11 · financing ── */}
      <Section
        id="financing"
        tone="warm"
        eyebrow="11 · The financing doctrine"
        title="Ten kinds of capital, matched to what each is for"
        lead="Ordered deliberately: private money first where private upside is created, land value before broad taxes, and the General Fund last: the final source, never the automatic one."
      >
        <FinancingSources />
      </Section>

      {/* ── 12 · institution ── */}
      <Section
        id="institution"
        eyebrow="12 · The institutional model"
        title="The owner Portland has never built"
        lead="Not a new operating mega-bureau. Eight to ten people who own the strategy, the data, the contracts, and the capital plan, while specialized operators keep delivering events."
      >
        <InstitutionModel />
        <Debate debate={DEBATES.integratedVsFragmented} />
      </Section>

      {/* ── 13 · data ── */}
      <Section
        id="data"
        eyebrow="13 · The owner's operating system"
        title="Five ledgers, seven tables, eight answers"
        lead="This is not a glossy economic-impact website. It is an owner's operating system, plus the public-records plan to build it from documents the City already holds."
      >
        <OwnerDataModel />
      </Section>

      {/* ── 14 · verdict ── */}
      <Section
        id="verdict"
        tone="darker"
        eyebrow="14 · The management judgment"
        title="The buildings are fine. The owner is missing."
        lead="Portland's venue managers and operators have succeeded at one hard thing: the buildings remain active and relevant. The serious conclusions are about the system above them."
      >
        <VerdictBlocks />
      </Section>

      {/* ── method ── */}
      <Section
        id="method"
        tone="warm"
        eyebrow="15 · Method & sources"
        title="What we could not verify"
        lead="The same rule as every Civic Lab deep-dive: judgments are ours and labeled; facts carry sources; gaps are listed, not papered over."
      >
        <MethodBlock />
      </Section>
    </article>
  );
}

/* ---------------------------------------------------------------- local blocks */

const TIER_TONES: Record<string, string> = {
  good: "border-[var(--color-fern)]/50",
  warn: "border-[var(--color-clay)]/50",
  bad: "border-[var(--color-ember)]/60",
};

function PriorityTiers() {
  return (
    <div className="grid gap-4 lg:grid-cols-3">
      {PRIORITY_TIERS.map((tier) => (
        <div key={tier.title} className={`rounded-sm border-t-2 ${TIER_TONES[tier.tone]} border border-[var(--color-parchment)] bg-white p-5`}>
          <p className="font-editorial text-[19px] text-[var(--color-ink)]">{tier.title}</p>
          <ul className="mt-3 space-y-2">
            {tier.items.map((item) => (
              <li key={item} className="flex gap-2 text-[13px] leading-snug text-[var(--color-ink-light)]">
                <span className="mt-[6px] h-1 w-1 flex-shrink-0 rounded-full bg-[var(--color-ember)]" />
                {item}
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}

function VerdictBlocks() {
  return (
    <div>
      <div className="grid gap-4 md:grid-cols-2">
        {VERDICT.map((v) => (
          <div key={v.n} className="rounded-sm border border-white/12 bg-white/[0.06] p-5">
            <p className="font-mono text-[22px] font-bold text-[var(--color-ember-bright)]">{v.n}</p>
            <p className="mt-2 text-[15px] font-semibold leading-snug text-white">{v.title}</p>
            <p className="mt-2 text-[13.5px] leading-relaxed text-white/70">{v.body}</p>
          </div>
        ))}
      </div>

      <div className="mt-8 rounded-sm border border-white/15 bg-white/[0.04] p-6 sm:p-8">
        <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--color-ember-bright)]">
          The bottom line
        </p>
        <p className="mt-3 max-w-3xl font-editorial text-[22px] leading-snug text-white sm:text-[26px]">
          The portfolio has strong demand, valuable brands, important cultural institutions, and
          exceptional public real estate. Its primary weakness is not the market. It is that the
          City has never built the institutional machinery to manage these assets as one portfolio.
        </p>
        <ol className="mt-6 grid gap-x-8 gap-y-2 sm:grid-cols-2">
          {DOCTRINE_POINTS.map((p, i) => (
            <li key={p} className="flex gap-3 text-[13.5px] leading-snug text-white/80">
              <span className="font-mono text-[12px] font-bold text-[var(--color-ember-bright)]">{i + 1}</span>
              {p}
            </li>
          ))}
        </ol>
        <div className="mt-7 border-l-2 border-[var(--color-ember)] pl-5">
          <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-white/50">
            The question Portland should answer in public, every year
          </p>
          <p className="mt-2 max-w-3xl font-editorial text-[19px] leading-snug text-white">
            {ANNUAL_QUESTION}
          </p>
          <p className="mt-3 max-w-3xl text-[13px] leading-relaxed text-white/60">
            Until it can, no individual venue proposal, however popular, can honestly be described
            as a complete capital strategy.
          </p>
        </div>
      </div>
    </div>
  );
}

function MethodBlock() {
  return (
    <div>
      <div className="rounded-sm border border-[var(--color-parchment)] bg-white p-5 sm:p-6">
        <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-[var(--color-clay)]">
          Not yet verifiable from the public record
        </p>
        <ul className="mt-3 space-y-2">
          {[
            "A Pioneer Courthouse Square successor management agreement: we searched council records and found no early-2026 authorization. The last verifiable term is the 2022–25 agreement (Ordinance 190912, $470,000/year City contribution), which expired June 30, 2025. The current arrangement's operative terms are an open question.",
            "Providence Park's current comprehensive facility-condition exposure, publicly unreconciled. Note also a figure discrepancy: the City's own venue page puts the 2019 private expansion at ~$75 million, while independent reporting consistently uses $85 million; we cite the City's figure.",
            "The Veterans Memorial Coliseum figure: ~$56 million is bond proceeds including earned interest per the Spectator Venues annual report; the bureau page separately says $53 million in bonds.",
            "A complete public lifecycle plan for Portland International Raceway, a known reserve concern without a published plan.",
            "A consolidated condition-and-capital report for the smaller community venues.",
            "Portland'5 building-level profit and loss: the cross-subsidy figures are workgroup expense allocations, not maintained venue-level accounts, which is itself part of this page's argument. The capital ranges, by contrast, are now verifiable: they sum from the February–March 2026 Säzän Group facility-condition assessments, across horizons that must not be added to each other.",
            "The precise overlap between the $288.6M Moda eligible-projects program and the $573M initial framework, and how much would be venue-fee-funded rather than unrestricted City cash.",
            "The PSU venue's cost: 'up to $449 million' in August 2026 resolution coverage, $447 million in Resolution 2026-270's cited May 2024 consultant estimate; both are presented and sourced above.",
          ].map((item) => (
            <li key={item} className="flex gap-2 text-[13.5px] leading-relaxed text-[var(--color-ink-light)]">
              <span className="mt-[7px] h-1 w-1 flex-shrink-0 rounded-full bg-[var(--color-clay)]" />
              {item}
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-5 rounded-sm border border-[var(--color-parchment)] bg-white p-5 sm:p-6">
        <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-[var(--color-canopy)]">
          What is ours and what is sourced
        </p>
        <p className="mt-2 max-w-3xl text-[13.5px] leading-relaxed text-[var(--color-ink-light)]">
          The letter grades, the four-economics framing, the five gates and hundred-point weights,
          the four phases, the financing doctrine, the portfolio-office design, the debate
          adjudications, and the closing doctrine are Portland Civic Lab analysis. Every
          load-bearing figure (dollar amounts, dates, attendance, votes) carries a public source
          below. Disclosure, restated: our founder publicly runs Rip City Not Rip Off, an advocacy
          campaign about the Moda Center deal; this page&apos;s paid-work firewall and the full
          policy live on the{" "}
          <Link href="/independence" className="font-semibold text-[var(--color-canopy)] hover:underline">
            Independence page
          </Link>
          .
        </p>
      </div>

      <div className="mt-8">
        <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-[var(--color-ember)]">
          Sources
        </p>
        <div className="mt-3 grid gap-2 sm:grid-cols-2 xl:grid-cols-3">
          {dedupeSources().map((s) => (
            <a
              key={s.url}
              href={s.url}
              target={s.url.startsWith("/") ? undefined : "_blank"}
              rel="noopener noreferrer"
              className="group rounded-sm border border-[var(--color-parchment)] bg-white p-3 transition-colors hover:border-[var(--color-sage)]"
            >
              <p className="font-mono text-[10px] uppercase tracking-[0.12em] text-[var(--color-ink-muted)]">
                {s.org}
                {s.year ? ` · ${s.year}` : ""} · {s.kind}
              </p>
              <p className="mt-1 text-[13px] font-semibold leading-snug text-[var(--color-ink)] group-hover:text-[var(--color-canopy)]">
                {s.title}
              </p>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
