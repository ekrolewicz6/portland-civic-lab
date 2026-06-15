import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Leaf, Briefcase, AlertTriangle, Sparkles } from "lucide-react";
import { SOURCES, HOUSING, ECON, CLIMATE, JOBS, FINANCE } from "@/lib/mass-timber/data";
import { UTIL, VIABLE_HOMES, fmtMoney, fmtPct } from "@/lib/mass-timber/engine";
import MassTimberTypes from "@/components/deep-dives/mass-timber/MassTimberTypes";
import ProjectFitTool from "@/components/deep-dives/mass-timber/ProjectFitTool";
import UtilizationCalculator from "@/components/deep-dives/mass-timber/UtilizationCalculator";
import HousingScaleCalculator from "@/components/deep-dives/mass-timber/HousingScaleCalculator";
import OregonAssets from "@/components/deep-dives/mass-timber/OregonAssets";
import Graveyard from "@/components/deep-dives/mass-timber/Graveyard";

export const metadata: Metadata = {
  title: "Mass Timber & Housing: Oregon's Big Bet — Explained | Portland Civic Lab",
  description:
    "Can building homes out of wood in factories help fix Oregon's housing shortage? A plain-language, interactive deep-dive into mass timber: what it is, what it's good for, how much housing it can provide and at what cost, the success stories, and the failure modes — credibly sourced.",
};

const NAV = [
  { id: "what", label: "What it is" },
  { id: "best", label: "Best for" },
  { id: "economics", label: "Real cost" },
  { id: "scale", label: "How much housing" },
  { id: "exists", label: "What's real" },
  { id: "graveyard", label: "Failure modes" },
  { id: "lever", label: "The fix" },
  { id: "climate", label: "Climate & jobs" },
  { id: "sources", label: "Sources" },
];

function Src({ id }: { id: keyof typeof SOURCES }) {
  const s = SOURCES[id];
  return (
    <a
      href={s.url}
      target="_blank"
      rel="noopener noreferrer"
      className="text-[var(--color-river-deep)] underline decoration-[var(--color-river)]/40 underline-offset-2 hover:decoration-[var(--color-river)]"
    >
      {s.org}
    </a>
  );
}

const SECTION = "max-w-[1080px] mx-auto px-5 sm:px-8";

export default function MassTimberDeepDive() {
  return (
    <div className="bg-[var(--color-paper)]">
      {/* ── Hero ── */}
      <section className="relative bg-[var(--color-canopy)] text-white noise-overlay overflow-hidden">
        <div className="absolute top-0 right-0 w-[620px] h-[620px] bg-[var(--color-canopy-light)] rounded-full blur-[180px] opacity-25 -translate-y-1/3 translate-x-1/4 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[420px] h-[420px] bg-[var(--color-fern)] rounded-full blur-[160px] opacity-[0.1] translate-y-1/2 -translate-x-1/3 pointer-events-none" />
        <div className="relative z-10 max-w-[1080px] mx-auto px-5 sm:px-8 py-16 sm:py-24">
          <div className="flex items-center gap-3 text-[10px] font-mono uppercase tracking-[0.22em] text-[var(--color-ember)]/90">
            <Link href="/deep-dives" className="hover:text-[var(--color-ember-bright)] transition-colors">
              Policy Deep-Dive
            </Link>
            <div className="w-8 h-px bg-[var(--color-ember)]/50" />
            <span>Housing & industry</span>
          </div>

          <h1 className="mt-6 font-editorial-normal text-[40px] sm:text-[56px] lg:text-[68px] leading-[1.05] tracking-tight max-w-4xl">
            Can we build homes out of wood
            <span className="block font-editorial italic text-[var(--color-ember-bright)]">
              in a factory — and fix the housing shortage?
            </span>
          </h1>

          <p className="mt-6 max-w-2xl text-[17px] sm:text-[20px] text-white/75 leading-relaxed">
            Oregon has quietly built almost everything it needs to make
            mass-timber housing a real industry — the research, the building code,
            tens of millions in funding, a riverfront factory campus. One piece is
            missing, and it&apos;s the one that decides whether this works at all.
            Here&apos;s the honest version: the promise, the math, the success
            stories, and the long graveyard of factories that tried this and failed.
          </p>

          <div className="mt-9 flex flex-col sm:flex-row gap-3">
            <a
              href="#economics"
              className="inline-flex items-center justify-center gap-2 rounded-sm bg-[var(--color-ember)] px-5 py-3 text-[15px] font-semibold text-[var(--color-canopy)] transition-colors hover:bg-[var(--color-ember-bright)]"
            >
              See the real economics
              <ArrowRight className="w-4 h-4" />
            </a>
            <a
              href="#scale"
              className="inline-flex items-center justify-center gap-2 rounded-sm border border-white/15 bg-white/[0.06] px-5 py-3 text-[15px] font-semibold text-white transition-colors hover:bg-white/10"
            >
              How much housing could it build?
            </a>
          </div>
        </div>
      </section>

      {/* ── Stat band ── */}
      <section className="bg-[var(--color-canopy-mid)] text-white border-t border-white/10">
        <div className="max-w-[1080px] mx-auto px-5 sm:px-8 py-10 grid grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { v: HOUSING.twentyYearNeed.toLocaleString(), l: "homes Oregon needs", s: "over the next 20 years" },
            { v: `~${UTIL.capacity}`, l: "homes/year the new factory can build", s: "Portland's Terminal 2 plant" },
            { v: `~${VIABLE_HOMES}`, l: "committed orders/year it needs", s: "to survive (the missing piece)" },
            { v: "6", l: "mass-timber homes delivered so far", s: "Hacienda's prototype 'Casitas'" },
          ].map((s) => (
            <div key={s.l}>
              <p className="font-mono text-[30px] sm:text-[38px] font-bold tabular-nums leading-none text-[var(--color-ember-bright)]">
                {s.v}
              </p>
              <p className="text-[13px] font-semibold mt-2 leading-snug">{s.l}</p>
              <p className="text-[12px] text-white/55 mt-0.5">{s.s}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Sticky nav ── */}
      <nav className="sticky top-14 z-40 bg-[var(--color-paper)]/95 backdrop-blur border-b border-[var(--color-parchment)]">
        <div className="max-w-[1080px] mx-auto px-5 sm:px-8">
          <div className="flex gap-1 overflow-x-auto py-2 text-[12px] font-mono uppercase tracking-[0.08em] scrollbar-hide">
            {NAV.map((n) => (
              <a
                key={n.id}
                href={`#${n.id}`}
                className="whitespace-nowrap rounded-sm px-3 py-1.5 text-[var(--color-ink-muted)] hover:bg-[var(--color-paper-warm)] hover:text-[var(--color-canopy)] transition-colors"
              >
                {n.label}
              </a>
            ))}
          </div>
        </div>
      </nav>

      {/* ── The setup ── */}
      <section className="py-16 sm:py-20">
        <div className={SECTION}>
          <Eyebrow>The setup</Eyebrow>
          <H2>Oregon built the supply side. The demand side is empty.</H2>
          <Lead>
            Oregon needs <strong>{HOUSING.twentyYearNeed.toLocaleString()} homes</strong> over 20
            years (<Src id="ohna2026" />), but its housing supply grew only about{" "}
            {fmtPct(HOUSING.supplyGrowth2020to2025)} from 2020 to 2025 (<Src id="wwSupply" />). The
            idea behind mass timber: build homes in a factory — faster, with a smaller crew, out of
            Oregon&apos;s own wood — to attack the cost and speed of construction.
          </Lead>
          <p className="mt-4 max-w-2xl text-[16px] text-[var(--color-ink-light)] leading-relaxed">
            And Oregon has gone further than anywhere else to set it up: the first statewide tall-wood
            building code in the country (<Src id="codeDive" />), a national research institute
            (<Src id="tallwood" />), a <strong>$41.4 million federal grant</strong> (<Src id="edaGrant" />),
            and a 39-acre factory campus on the Portland riverfront (<Src id="portT2" />). The machine is
            built. It&apos;s just idling — because nobody has assembled the one thing a factory needs to
            survive: a steady stream of committed orders. That gap is this whole story.
          </p>
        </div>
      </section>

      {/* ── What it is ── */}
      <section id="what" className="py-16 sm:py-20 bg-[var(--color-paper-warm)] border-y border-[var(--color-parchment)]">
        <div className={SECTION}>
          <Eyebrow>The basics</Eyebrow>
          <H2>What &ldquo;mass timber&rdquo; actually is</H2>
          <Lead>
            Mass timber means gluing smaller pieces of wood into big, strong components that can
            replace concrete and steel in mid- and high-rise buildings. It&apos;s <em>not</em> the
            flimsy 2×4 framing of a typical house — it&apos;s engineered wood strong enough to hold up
            an 18-story building.
          </Lead>
          <div className="mt-10">
            <MassTimberTypes />
          </div>
          <p className="text-[12px] text-[var(--color-ink-muted)] mt-4">
            Sources: <Src id="codeDive" />, <Src id="freres" />, <Src id="tallwood" />.
          </p>
        </div>
      </section>

      {/* ── Best for ── */}
      <section id="best" className="py-16 sm:py-20">
        <div className={SECTION}>
          <Eyebrow>What it&apos;s good for</Eyebrow>
          <H2>It&apos;s not right for every building</H2>
          <Lead>
            Mass timber has a sweet spot, and outside it, cheaper options win. The decisive rule:
            ordinary &ldquo;stick-frame&rdquo; wood is cheapest for low buildings; mass timber&apos;s
            edge shows up on <strong>large, repetitive, mid-rise buildings in places where labor is
            expensive</strong> (<Src id="costPhysics" />). Try a few combinations:
          </Lead>
          <div className="mt-10">
            <ProjectFitTool />
          </div>
        </div>
      </section>

      {/* ── Real economics ── */}
      <section id="economics" className="py-16 sm:py-20 bg-[var(--color-paper-warm)] border-y border-[var(--color-parchment)]">
        <div className={SECTION}>
          <Eyebrow>The honest economics</Eyebrow>
          <H2>The myth: wood is cheaper. The reality is harder.</H2>
          <Lead>
            This is the crux. The popular pitch — &ldquo;mass timber is a cheaper way to build&rdquo;
            — is wrong in a way that, if you build on it, sinks the whole effort.
          </Lead>

          <div className="mt-8 grid md:grid-cols-2 gap-5">
            <div className="rounded-sm border-2 border-[var(--color-clay)]/25 bg-[#fbf4f0] p-6">
              <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-[var(--color-clay)]">
                The myth
              </p>
              <p className="mt-2 text-[15px] text-[var(--color-ink-light)] leading-relaxed">
                &ldquo;Building with wood is cheaper than concrete and steel.&rdquo;
              </p>
            </div>
            <div className="rounded-sm border border-[var(--color-parchment)] bg-white p-6">
              <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-[var(--color-fern)]">
                The reality
              </p>
              <p className="mt-2 text-[15px] text-[var(--color-ink-light)] leading-relaxed">
                The <strong>material costs the same or more</strong> — a median premium around{" "}
                {fmtPct(ECON.premiumMedian)}, up to {fmtPct(ECON.premiumHigh)} (<Src id="costPhysics" />).
                Savings come from elsewhere: a lighter foundation, a smaller on-site crew, and faster
                construction — but only under the right conditions.
              </p>
            </div>
          </div>

          <div className="mt-6 grid sm:grid-cols-3 gap-4">
            <SaveCard title="Lighter foundation" body={`Mass timber is much lighter — up to ~${fmtPct(ECON.lighterVsConcrete)} lighter than concrete on some projects — so foundations shrink and seismic demand drops (a real edge in earthquake country).`} src={<Src id="thinkWood" />} />
            <SaveCard title="Half the on-site crew" body="Prefabrication can cut the on-site labor force roughly in half — a big win where labor is expensive, and almost nothing where it's cheap." src={<Src id="thinkWood" />} />
            <SaveCard title="Faster = cheaper financing" body="Building ~25% faster (sometimes more) cuts months of construction-loan interest. Speed is, in effect, a form of financing." src={<Src id="thinkWood" />} />
          </div>

          <div className="mt-8 rounded-sm bg-[var(--color-canopy)] text-white p-7 sm:p-9">
            <div className="flex items-center gap-2.5 mb-3">
              <AlertTriangle className="w-5 h-5 text-[var(--color-ember-bright)]" />
              <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[var(--color-ember-bright)]">
                The single most important honest finding
              </p>
            </div>
            <p className="text-[16px] sm:text-[18px] leading-relaxed">
              Whether mass timber can actually make <strong>affordable</strong> housing cheaper is
              still <strong>unproven</strong>. It&apos;s the subject of an active {ECON.hudStudyMonths}-month
              federal study (<Src id="hudWsu" />), and the industry&apos;s own affordable-housing guide
              avoids cost numbers entirely (<Src id="woodworksAffordable" />). For affordable housing,
              any added cost lands straight on an already-tight public subsidy — with nothing to absorb
              it (<Src id="meyerCost" />). The honest position isn&apos;t &ldquo;it&apos;s cheaper.&rdquo;
              It&apos;s &ldquo;it <em>can</em> be — if specific things are fixed first.&rdquo;
            </p>
          </div>
        </div>
      </section>

      {/* ── The utilization model ── */}
      <section className="py-16 sm:py-20">
        <div className={SECTION}>
          <Eyebrow>The missing math</Eyebrow>
          <H2>Why a factory&apos;s costs depend on how full it is</H2>
          <Lead>
            Here&apos;s the part most cost arguments leave out. A factory is a fixed-cost machine: rent,
            equipment, and a payroll that cost the same whether the line runs full or half-empty. Spread
            that overhead across <em>few</em> homes and each one is expensive; spread it across <em>many</em>
            and it nearly disappears. So the same factory can make homes that cost <strong>more</strong>
            than building on site — or <strong>less</strong> — depending entirely on demand. Drag the slider:
          </Lead>
          <div className="mt-10">
            <UtilizationCalculator />
          </div>
          <p className="text-[12px] text-[var(--color-ink-muted)] mt-4 max-w-2xl leading-relaxed">
            Modeled on the briefing&apos;s default inputs ({fmtMoney(UTIL.conventionalAllIn)} site-built
            all-in; {fmtMoney(UTIL.modularMarginal)} modular marginal cost; {fmtMoney(UTIL.fixedAnnual)}/yr
            fixed cost; {UTIL.capacity}-home capacity). These are estimates — the durable truth is
            structural: a half-empty factory loses money, so committed demand is the whole game.
          </p>
        </div>
      </section>

      {/* ── How much housing ── */}
      <section id="scale" className="py-16 sm:py-20 bg-[var(--color-paper-warm)] border-y border-[var(--color-parchment)]">
        <div className={SECTION}>
          <Eyebrow>How much housing, at what cost</Eyebrow>
          <H2>Building it at scale</H2>
          <Lead>
            Say Oregon wanted to build a serious number of affordable, factory-built homes. What would
            it cost, and who would pay? Most of the money isn&apos;t public — federal tax credits and
            private debt carry the bulk. Drag to see the stack.
          </Lead>
          <div className="mt-10">
            <HousingScaleCalculator />
          </div>
          <p className="text-[12px] text-[var(--color-ink-muted)] mt-4 max-w-2xl leading-relaxed">
            Illustrative, scaled from the briefing&apos;s 5,000-unit model (≈$1.7B total, ~⅓ public).
            For comparison, Portland&apos;s 2016 housing bond was {fmtMoney(FINANCE.bond2016)} and has
            opened {FINANCE.bond2016Units.toLocaleString()} affordable homes (<Src id="phbBond" />); Metro&apos;s
            2018 regional bond was {fmtMoney(FINANCE.metroBond2018)} (<Src id="metroBond" />).
          </p>
        </div>
      </section>

      {/* ── What's real in Oregon (successes) ── */}
      <section id="exists" className="py-16 sm:py-20">
        <div className={SECTION}>
          <Eyebrow>The success stories</Eyebrow>
          <H2>What Oregon has already built</H2>
          <Lead>
            This isn&apos;t vaporware — most of the hard pieces exist and are funded, further along than
            most people realize. The honest caveat: the actual <em>housing</em> delivered so far is six
            prototype homes. The supply side is real; the demand side is empty.
          </Lead>
          <div className="mt-10">
            <OregonAssets />
          </div>
        </div>
      </section>

      {/* ── The graveyard (failure mode) ── */}
      <section id="graveyard" className="py-16 sm:py-20 bg-[#1c1410] text-white">
        <div className={SECTION}>
          <p className="text-[11px] font-mono font-semibold uppercase tracking-[0.18em] text-[var(--color-ember)]">
            The failure modes
          </p>
          <h2 className="mt-3 font-editorial-normal text-[30px] sm:text-[42px] leading-tight">
            The graveyard
          </h2>
          <p className="mt-4 max-w-2xl text-[16px] sm:text-[18px] text-white/70 leading-relaxed">
            Factory-built housing has failed repeatedly for a century, and the failures are
            consistent — and avoidable only if you understand them. None of these died because the
            buildings didn&apos;t work. They died on economics.
          </p>
          <div className="mt-10">
            <Graveyard />
          </div>
          <p className="mt-6 max-w-2xl text-[15px] text-white/70 leading-relaxed">
            The decisive lesson from the UK, which ran the closest thing to a national demand push:{" "}
            <strong className="text-white">demand is necessary but not sufficient.</strong> Diffuse
            requirements didn&apos;t save the factories — and the UK&apos;s new 2026–2036 program dropped
            its modular target entirely (<Src id="sahp" />). The demand has to be guaranteed,
            standardized, and big enough to hold a factory above break-even.
          </p>
        </div>
      </section>

      {/* ── The missing lever ── */}
      <section id="lever" className="py-16 sm:py-20">
        <div className={SECTION}>
          <Eyebrow>Doing it right</Eyebrow>
          <H2>The missing piece: someone to aggregate the demand</H2>
          <Lead>
            The demand for these homes exists many times over. The problem is that it&apos;s{" "}
            <strong>fragmented</strong> (scattered across dozens of small builders),{" "}
            <strong>mistimed</strong> (it clumps around tax-credit deadlines), and stuck in a{" "}
            <strong>standoff</strong> (no buyer commits to an unproven factory; the factory can&apos;t
            prove itself without commitments). Solve those three and you solve demand.
          </Lead>

          <div className="mt-8 grid md:grid-cols-3 gap-4">
            <LeverCard n="1" title="A demand aggregator" body="One entity signs framework deals with many buyers — 'when you build, source through us' — then smooths their lumpy orders into a steady factory calendar, because one buyer's slow year offsets another's busy one." />
            <LeverCard n="2" title="A public demand floor" body="Government commits to buy a floor number of homes if private demand falls short. It can't go bankrupt and always needs housing — so it can hold the line through downturns. It spends creditworthiness, not cash." />
            <LeverCard n="3" title="A private operator runs the line" body="Government guarantees the demand; a disciplined private firm runs the factory. Like public transit: the public commits to the service, a contractor operates it. Public ownership of the factory recreates the Katerra failure with taxpayer money." />
          </div>

          <div className="mt-8 rounded-sm border border-[var(--color-parchment)] bg-[var(--color-paper-warm)] p-6">
            <p className="text-[14px] text-[var(--color-ink-light)] leading-relaxed">
              <strong className="text-[var(--color-canopy)]">No one has proven this yet.</strong> The
              most-promoted U.S. example — a California master agreement for 560+ homes — is an
              operational framework, not a binding guaranteed purchase, and has delivered zero units so
              far (<Src id="guerdon" />). Oregon wouldn&apos;t be copying a proven model; it would be
              building one. That&apos;s both the opportunity and the risk.
            </p>
          </div>
        </div>
      </section>

      {/* ── Climate & jobs ── */}
      <section id="climate" className="py-16 sm:py-20 bg-[var(--color-paper-warm)] border-y border-[var(--color-parchment)]">
        <div className={SECTION}>
          <Eyebrow>Climate & jobs</Eyebrow>
          <H2>The other two payoffs — honestly</H2>

          <div className="mt-8 grid md:grid-cols-2 gap-5">
            <div className="rounded-sm border border-[var(--color-parchment)] bg-white p-6">
              <div className="flex items-center gap-2.5 mb-2">
                <Leaf className="w-5 h-5 text-[var(--color-fern)]" />
                <h3 className="text-[16px] font-semibold text-[var(--color-ink)]">The climate case (both sides)</h3>
              </div>
              <p className="text-[13px] text-[var(--color-ink-light)] leading-relaxed">
                Wood stores carbon and avoids the heavy emissions of concrete and steel. A 2025 study
                found scaling mass timber could net{" "}
                <strong>{CLIMATE.netBenefitLow}–{CLIMATE.netBenefitHigh} billion tons of CO₂</strong> by
                2100 (<Src id="nature" />). But the honest catch: most of that benefit is{" "}
                <em>forest storage, not the panels</em>, and it comes bundled with{" "}
                <strong>more logging</strong> — natural forests shrink by{" "}
                {CLIMATE.naturalForestShrinkLow}–{CLIMATE.naturalForestShrinkHigh} million hectares in
                the model. Real and contested at once.
              </p>
            </div>
            <div className="rounded-sm border border-[var(--color-parchment)] bg-white p-6">
              <div className="flex items-center gap-2.5 mb-2">
                <Briefcase className="w-5 h-5 text-[var(--color-river)]" />
                <h3 className="text-[16px] font-semibold text-[var(--color-ink)]">The jobs case</h3>
              </div>
              <p className="text-[13px] text-[var(--color-ink-light)] leading-relaxed">
                The sector could support up to <strong>{JOBS.potentialJobs.toLocaleString()} jobs</strong>{" "}
                in Oregon (<Src id="coalition" />) — factory work ({fmtMoney(JOBS.factoryWageLow)}–
                {fmtMoney(JOBS.factoryWageHigh)}), forestry and mill jobs in rural towns, and union
                construction trades — most without needing a four-year degree, spread across the
                urban–rural divide. It&apos;s a rare lever that hits housing, jobs, and climate at once.
              </p>
            </div>
          </div>
          <p className="text-[12px] text-[var(--color-ink-muted)] mt-4 max-w-2xl leading-relaxed">
            A feedstock wrinkle: the federal government manages ~{fmtPct(CLIMATE.federalForestlandShare)} of
            Oregon&apos;s forestland but supplies only ~{fmtPct(CLIMATE.federalHarvestShare)} of the
            harvest, and lumber is the single biggest cost in a CLT panel — so the &ldquo;rural
            jobs&rdquo; story runs straight into federal forest policy (<Src id="ofriEcon" />).
          </p>
        </div>
      </section>

      {/* ── The verdict ── */}
      <section className="py-16 sm:py-20">
        <div className={SECTION}>
          <Eyebrow>The bottom line</Eyebrow>
          <H2>Fix what blocks it — don&apos;t just &ldquo;scale it&rdquo;</H2>
          <Lead>
            Mass-timber housing in Oregon is a rare triple win <em>if</em> it&apos;s done right, and
            another well-funded grave if it&apos;s done wrong. The pieces exist; the savings are
            conditional; the failure record is long. What decides it isn&apos;t the technology — it&apos;s
            whether committed, deliverable demand shows up before the factory has to carry its overhead.
          </Lead>
          <div className="mt-8 grid sm:grid-cols-2 gap-x-8 gap-y-4">
            {[
              "Demand is guaranteed, standardized, and big enough to keep the line above ~70% full — through downturns.",
              "The factory stays asset-light; the public absorbs the ramp-up risk but never owns or runs the line.",
              "The product is standardized and repeatable, not a bespoke building every time.",
              "Financing fits the front-loaded cost curve, stacking tax credits + bonds + a green layer + land.",
              "The state pulls its own levers — rewarding factory-built homes in how it hands out tax credits.",
              "Everyone respects the honest economics: ~10% cheaper at full tilt at best, and only at full tilt.",
            ].map((t, i) => (
              <div key={i} className="flex items-start gap-3">
                <Sparkles className="w-4 h-4 text-[var(--color-ember)] mt-1 flex-shrink-0" />
                <p className="text-[14px] text-[var(--color-ink-light)] leading-relaxed">{t}</p>
              </div>
            ))}
          </div>
          <p className="mt-7 text-[15px] text-[var(--color-ink-light)] leading-relaxed max-w-2xl">
            The window is now: the Portland factory reaches early production around 2026 and full
            operation around 2028. The demand-side answer has to exist before the line must carry its
            overhead — <strong>the 2026–2028 window.</strong> That timing, not the technology, is what
            makes this urgent.
          </p>
        </div>
      </section>

      {/* ── Sources ── */}
      <section id="sources" className="py-16 sm:py-20 bg-[var(--color-paper-warm)] border-t border-[var(--color-parchment)]">
        <div className={SECTION}>
          <Eyebrow>Sources & method</Eyebrow>
          <H2>Where these numbers come from</H2>
          <Lead>
            This page is built from a deeply-researched briefing, with each load-bearing claim
            re-checked against a primary or credible source in June 2026. A few figures are
            <strong> modeled estimates</strong> (the factory cost curve, the scale illustration) and are
            labeled as such; the rest is reported data. Where a popular figure didn&apos;t hold up — like
            a widely-shared Portland permit number — it was corrected rather than repeated.
          </Lead>
          <div className="mt-8 grid sm:grid-cols-2 gap-x-8 gap-y-3">
            {Object.values(SOURCES).map((s) => (
              <a
                key={s.id}
                href={s.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-start gap-3 rounded-sm border border-transparent hover:border-[var(--color-parchment)] hover:bg-white p-2 -m-2 transition-colors"
              >
                <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-[var(--color-fern)]" />
                <span>
                  <span className="block text-[14px] text-[var(--color-ink)] group-hover:text-[var(--color-canopy)] leading-snug">
                    {s.title}
                  </span>
                  <span className="block text-[12px] text-[var(--color-ink-muted)] font-mono uppercase tracking-wide mt-0.5">
                    {s.org} · {s.kind}
                  </span>
                </span>
              </a>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

// ── helpers ──────────────────────────────────────────────────────

function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-3 mb-4">
      <div className="w-8 h-px bg-[var(--color-ember)]" />
      <span className="text-[10px] font-mono font-semibold uppercase tracking-[0.22em] text-[var(--color-ember)]">
        {children}
      </span>
    </div>
  );
}

function H2({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="font-editorial text-[30px] sm:text-[42px] text-[var(--color-ink)] leading-tight">
      {children}
    </h2>
  );
}

function Lead({ children }: { children: React.ReactNode }) {
  return (
    <p className="mt-4 max-w-2xl text-[16px] sm:text-[17px] text-[var(--color-ink-light)] leading-relaxed">
      {children}
    </p>
  );
}

function SaveCard({ title, body, src }: { title: string; body: string; src: React.ReactNode }) {
  return (
    <div className="rounded-sm border border-[var(--color-parchment)] bg-white p-5">
      <h4 className="text-[14px] font-semibold text-[var(--color-canopy)] mb-1.5">{title}</h4>
      <p className="text-[13px] text-[var(--color-ink-light)] leading-relaxed">{body}</p>
      <p className="text-[11px] text-[var(--color-ink-muted)] mt-2">{src}</p>
    </div>
  );
}

function LeverCard({ n, title, body }: { n: string; title: string; body: string }) {
  return (
    <div className="rounded-sm border border-[var(--color-parchment)] bg-white p-6">
      <div className="flex items-center gap-3 mb-2">
        <span className="font-mono text-[22px] font-bold text-[var(--color-parchment)]">{n}</span>
        <h3 className="text-[16px] font-semibold text-[var(--color-canopy)] leading-tight">{title}</h3>
      </div>
      <p className="text-[13px] text-[var(--color-ink-light)] leading-relaxed">{body}</p>
    </div>
  );
}
