import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, ArrowUpRight, Check, Wrench } from "lucide-react";
import { SOURCES, STATS, PLAN, MYTHS } from "@/lib/homeless/data";
import { fmtMoney, fmtNum } from "@/lib/homeless/engine";
import { DIVE_CONTAINER, Section } from "@/components/deep-dives/shared";
import FlowSimulator from "@/components/deep-dives/homeless/FlowSimulator";
import CostOfInactionCalculator from "@/components/deep-dives/homeless/CostOfInactionCalculator";
import TriageTool from "@/components/deep-dives/homeless/TriageTool";
import BedReality from "@/components/deep-dives/homeless/BedReality";

export const metadata: Metadata = {
  title: "Why Portland Can't End Homelessness — The Math, Explained | Portland Civic Lab",
  description:
    "Portland spends more than ever and homelessness keeps growing. A plain-language, interactive deep-dive into why: the inflow/outflow math, who's actually homeless, the true cost of doing nothing, why nobody can see the beds, and what would actually work — credibly sourced.",
};

const NAV = [
  { id: "flow", label: "The math" },
  { id: "who", label: "Who" },
  { id: "cost", label: "Cost of nothing" },
  { id: "beds", label: "The beds" },
  { id: "works", label: "What works" },
  { id: "myths", label: "Myths" },
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

export default function HomelessnessDeepDive() {
  return (
    <div className="bg-[var(--color-paper)]">
      {/* ── Hero ── */}
      <section className="relative bg-[var(--color-canopy)] text-white noise-overlay overflow-hidden">
        <div className="absolute top-0 right-0 w-[760px] h-[760px] bg-[var(--color-canopy-light)] rounded-full blur-[190px] opacity-25 -translate-y-1/3 translate-x-1/4 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[460px] h-[460px] bg-[var(--color-river)] rounded-full blur-[160px] opacity-[0.12] translate-y-1/2 -translate-x-1/3 pointer-events-none" />
        <div className={`relative z-10 ${DIVE_CONTAINER} py-16 sm:py-24`}>
          <div className="grid xl:grid-cols-12 gap-10 xl:gap-16 items-end">
            <div className="xl:col-span-8">
              <div className="flex items-center gap-3 text-[10px] font-mono uppercase tracking-[0.22em] text-[var(--color-ember)]/90">
                <Link href="/deep-dives" className="hover:text-[var(--color-ember-bright)] transition-colors">
                  Policy Deep-Dive
                </Link>
                <div className="w-8 h-px bg-[var(--color-ember)]/50" />
                <span>Homelessness</span>
              </div>
              <h1 className="mt-6 font-editorial-normal text-[38px] sm:text-[54px] lg:text-[64px] 3xl:text-[76px] leading-[1.05] tracking-tight max-w-4xl 3xl:max-w-5xl">
                Why Portland can&apos;t seem to end homelessness
                <span className="block font-editorial italic text-[var(--color-ember-bright)]">
                  — and the math that explains it
                </span>
              </h1>
              <p className="mt-6 max-w-2xl text-[17px] sm:text-[20px] text-white/75 leading-relaxed">
                Portland spends more on homelessness than ever, and it keeps growing. The reason
                isn&apos;t a mystery or a lack of compassion — it&apos;s arithmetic the system can&apos;t
                see. More people fall into homelessness each month than climb out, the &ldquo;beds&rdquo;
                we count don&apos;t exist the way we think, and the true cost of doing nothing is hidden
                across a dozen budgets. Here&apos;s the honest version.
              </p>
              <div className="mt-9 flex flex-col sm:flex-row gap-3">
                <a
                  href="#flow"
                  className="inline-flex items-center justify-center gap-2 rounded-sm bg-[var(--color-ember)] px-5 py-3 text-[15px] font-semibold text-[var(--color-canopy)] transition-colors hover:bg-[var(--color-ember-bright)]"
                >
                  See the math
                  <ArrowRight className="w-4 h-4" />
                </a>
                <a
                  href="#works"
                  className="inline-flex items-center justify-center gap-2 rounded-sm border border-white/15 bg-white/[0.06] px-5 py-3 text-[15px] font-semibold text-white transition-colors hover:bg-white/10"
                >
                  What would actually work?
                </a>
              </div>
            </div>

            <aside className="hidden xl:block xl:col-span-4">
              <div className="rounded-sm border border-white/12 bg-white/[0.05] p-6 backdrop-blur">
                <div className="text-[10px] font-mono uppercase tracking-[0.22em] text-[var(--color-ember)]">
                  The honest take
                </div>
                <dl className="mt-4 space-y-4">
                  {[
                    { t: "It's a flow problem", d: "Homelessness grows because more people enter each month than exit — not mainly because we build too little." },
                    { t: "The system is blind", d: "Nobody tracks which beds are actually staffed and open tonight, so people are lost even when beds sit empty." },
                    { t: "The fixes are invisible", d: "The highest-leverage moves — closing the inflow, staffing beds, counting the true cost — aren't the ones we fight about." },
                  ].map((r) => (
                    <div key={r.t}>
                      <dt className="text-[13px] font-semibold text-white">{r.t}</dt>
                      <dd className="text-[13px] text-white/65 leading-relaxed mt-0.5">{r.d}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            </aside>
          </div>
        </div>
      </section>

      {/* ── Stat band ── */}
      <section className="bg-[var(--color-canopy-mid)] text-white border-t border-white/10">
        <div className={`${DIVE_CONTAINER} py-10 grid grid-cols-2 lg:grid-cols-4 gap-6`}>
          {[
            { v: `~${fmtNum(STATS.byNameTotal)}`, l: "on the county's by-name list", s: "early 2026, up from 14,361 a year earlier" },
            { v: `+~${STATS.netMonthly}`, l: "net, every month", s: `${fmtNum(STATS.monthlyInflow)} in vs ${fmtNum(STATS.monthlyOutflow)} out` },
            { v: fmtMoney(STATS.shsRaisedSince2021), l: "raised by the homeless-services tax", s: "across the region since 2021" },
            { v: fmtNum(STATS.deaths2024), l: "died homeless in 2024", s: `mostly overdose; average age ${STATS.avgAgeAtDeath}` },
          ].map((s) => (
            <div key={s.l}>
              <p className="font-mono text-[30px] sm:text-[38px] 3xl:text-[46px] font-bold tabular-nums leading-none text-[var(--color-ember-bright)]">
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
        <div className={DIVE_CONTAINER}>
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

      {/* ── The math (flow) ── */}
      <Section
        id="flow"
        eyebrow="The one insight"
        title="It's a flow problem, not a stock problem"
        lead={
          <>
            Picture a bathtub. Homelessness is the water level; what matters is the{" "}
            <strong>faucet</strong> (people falling in) versus the <strong>drain</strong> (people
            getting out). In Multnomah County about <strong>{fmtNum(STATS.monthlyInflow)} people</strong>{" "}
            are added to the by-name list each month, and only about{" "}
            <strong>{fmtNum(STATS.monthlyOutflow)}</strong> exit (<Src id="byNameRelease" />). That gap
            is why it grows. Try closing it:
          </>
        }
      >
        <FlowSimulator />
        <p className="text-[12px] text-[var(--color-ink-muted)] mt-4 max-w-2xl leading-relaxed">
          A simplified model ported from the founder&apos;s homelessness-system cockpit. The behavioral
          assumptions (how much of inflow is eviction- vs. discharge-driven, how many people each
          treatment bed durably houses) are deliberately visible and contestable. The net flow varies
          month to month; the ~{STATS.netMonthly}/month figure is from January 2025 (<Src id="byNameRelease" />).
          The big lesson is structural: <strong>you can flip the trajectory by closing the inflow alone —
          before building a single new unit.</strong>
        </p>
      </Section>

      {/* ── Who ── */}
      <Section
        id="who"
        tone="warm"
        eyebrow="Who's actually homeless"
        title="Three different problems wearing one coat"
        lead="The loudest myth is that everyone on the street is the same — addicted, chronically homeless, beyond help. The data says otherwise: homelessness is really three populations that need three different things, and matching the wrong fix to the wrong person is most of what wastes money."
        aside={
          <div className="rounded-sm border border-[var(--color-parchment)] bg-white p-5">
            <p className="font-mono text-[28px] font-bold text-[var(--color-clay)] tabular-nums leading-none">
              {fmtNum(STATS.deaths2024)}
            </p>
            <p className="text-[13px] font-semibold text-[var(--color-ink)] mt-1.5">
              people died homeless in Multnomah County in 2024
            </p>
            <p className="text-[12px] text-[var(--color-ink-muted)] mt-1 leading-relaxed">
              {fmtNum(STATS.overdoseDeaths2024)} from overdose ({fmtNum(STATS.fentanylDeaths2024)}{" "}
              fentanyl-involved), average age {STATS.avgAgeAtDeath}. The first year-over-year decline
              since 2013 (<Src id="domicile" />) — the stakes behind the numbers.
            </p>
          </div>
        }
      >
        <TriageTool />
        <p className="text-[12px] text-[var(--color-ink-muted)] mt-4 max-w-2xl leading-relaxed">
          The plain-language version of the transitional / episodic / chronic typology (Kuhn &amp;
          Culhane, 1998). Per-person costs are national averages (<Src id="naehTriageCost" />); about{" "}
          {Math.round(STATS.chronicSharePct * 100)}% of Multnomah&apos;s homeless population was
          chronically homeless in the 2023 count (<Src id="pit2023" />).
        </p>
      </Section>

      {/* ── Cost of nothing ── */}
      <Section
        id="cost"
        eyebrow="The cost of doing nothing"
        title="The status quo isn't free — it's just hidden"
        lead={
          <>
            Fixes look expensive against a baseline of zero. But the street isn&apos;t zero: it&apos;s
            emergency-room visits, jail stays, ambulance runs, and sanitation — spread across a dozen
            budgets so no one sees the total. Study after study finds it costs <em>more</em> to leave a
            chronically homeless person on the street than to house them. Move the slider:
          </>
        }
        aside={
          <p className="text-[12px] text-[var(--color-ink-muted)] leading-relaxed">
            The street-cost figure is a central estimate; studies range from ~$35k/year
            (<Src id="naehCost" />) to far higher for the costliest individuals. Housing-is-cheaper holds
            across cities: Los Angeles found a 79% cost drop (<Src id="economicRt" />), Utah 91%
            (<Src id="utahNpr" />).
          </p>
        }
      >
        <CostOfInactionCalculator />
      </Section>

      {/* ── The beds ── */}
      <Section
        id="beds"
        tone="warm"
        eyebrow="The deepest problem"
        title="Nobody can see the beds"
        lead={
          <>
            Here&apos;s the throughline made literal. Oregon is short roughly{" "}
            <strong>{fmtNum(STATS.treatmentBedGap)} treatment beds</strong> (<Src id="pcgBeds" />) — but
            it can&apos;t even tell you how many of the beds it <em>has</em> are open tonight. A
            multi-million-dollar bed registry produced only a handful of placements (<Src id="obcc" />),
            because a database isn&apos;t a coordination system.
          </>
        }
      >
        <BedReality />

        {/* We're building the fix */}
        <a
          href="https://portland-bed-finder.vercel.app/"
          target="_blank"
          rel="noopener noreferrer"
          className="group mt-5 block rounded-sm bg-[var(--color-canopy)] text-white p-6 sm:p-7 transition-all hover:-translate-y-0.5 hover:shadow-[0_8px_32px_rgba(15,36,25,0.18)]"
        >
          <div className="grid sm:grid-cols-[auto_1fr_auto] items-center gap-x-5 gap-y-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-sm bg-white/10 text-[var(--color-ember-bright)]">
              <Wrench className="h-5 w-5" />
            </div>
            <div>
              <div className="text-[10px] font-mono uppercase tracking-[0.2em] text-[var(--color-ember-bright)]">
                We&apos;re building the fix
              </div>
              <h3 className="mt-1 font-editorial-normal text-[22px] sm:text-[24px] leading-tight">
                Portland Bed Finder — a working prototype
              </h3>
              <p className="mt-2 text-[14px] text-white/70 leading-relaxed max-w-2xl">
                We didn&apos;t just write this down. Bed Finder is a live tool that answers
                &ldquo;where can someone go right now?&rdquo; — matching a specific person to the beds
                they&apos;re actually eligible for, with facilities self-reporting real openings. It&apos;s
                the coordination layer Oregon doesn&apos;t have, built to prove it can exist.
              </p>
            </div>
            <span className="inline-flex items-center gap-2 text-[12px] font-mono uppercase tracking-[0.14em] text-[var(--color-ember-bright)] whitespace-nowrap">
              Try the prototype
              <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </span>
          </div>
        </a>
      </Section>

      {/* ── What works ── */}
      <Section
        id="works"
        eyebrow="What would actually work"
        title="The fastest-reduction plan, in order of speed"
        lead="None of this is a mystery. The plan that survives a hostile hearing is sequenced by what's cheapest and fastest first — and the iron rule underneath it all: you can't move someone off the street faster than you can build somewhere to put them. Capacity precedes enforcement, always."
      >
        <div className="space-y-4">
          {PLAN.map((step) => (
            <div key={step.n} className="flex gap-5 rounded-sm border border-[var(--color-parchment)] bg-white p-6">
              <span className="font-mono text-[26px] font-bold text-[var(--color-parchment)] leading-none flex-shrink-0">
                {step.n}
              </span>
              <div>
                <h3 className="text-[17px] font-semibold text-[var(--color-canopy)] mb-1.5">{step.title}</h3>
                <p className="text-[14px] text-[var(--color-ink-light)] leading-relaxed">{step.body}</p>
              </div>
            </div>
          ))}
        </div>
      </Section>

      {/* ── Myths ── */}
      <Section
        id="myths"
        tone="warm"
        eyebrow="Myths vs. reality"
        title="The objections that survive a hostile hearing"
        lead="An honest broker has to hold the strongest version of every objection. Here are the four that come up at every council meeting — and what the evidence actually says."
      >
        <div className="grid md:grid-cols-2 gap-4">
          {MYTHS.map((m) => (
            <div key={m.myth} className="rounded-sm border border-[var(--color-parchment)] bg-white p-6">
              <p className="text-[15px] font-semibold text-[var(--color-clay)] leading-snug">{m.myth}</p>
              <div className="mt-3 flex items-start gap-2 border-t border-[var(--color-parchment)] pt-3">
                <Check className="w-4 h-4 text-[var(--color-fern)] mt-0.5 flex-shrink-0" />
                <p className="text-[13px] text-[var(--color-ink-light)] leading-relaxed">{m.truth}</p>
              </div>
            </div>
          ))}
        </div>
        <p className="text-[12px] text-[var(--color-ink-muted)] mt-4 max-w-2xl leading-relaxed">
          Housing First&apos;s ~85–90% retention and the entry-vs-rules distinction: <Src id="housingFirstNaeh" />;
          the aggregate-vs-individual critique: <Src id="manhattanHF" />.
        </p>
      </Section>

      {/* ── Sources ── */}
      <Section
        id="sources"
        tone="warm"
        eyebrow="Sources & method"
        title="Where these numbers come from"
        lead="Headline figures are read from primary sources — the county's by-name dashboard, the Point-in-Time count, Metro's tax reports, the state's bed studies — and were re-checked in June 2026. The flow model is a simplified teaching tool with visible assumptions. Where a popular figure didn't hold up (a $500M+ unspent balance, a flat '$50k per person'), it was corrected, not repeated."
      >
        <div className="grid sm:grid-cols-2 2xl:grid-cols-3 gap-x-8 gap-y-3">
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
                <span className="block text-[13px] text-[var(--color-ink)] group-hover:text-[var(--color-canopy)] leading-snug">
                  {s.title}
                </span>
                <span className="block text-[11px] text-[var(--color-ink-muted)] font-mono uppercase tracking-wide mt-0.5">
                  {s.org} · {s.kind}
                </span>
              </span>
            </a>
          ))}
        </div>
      </Section>
    </div>
  );
}
