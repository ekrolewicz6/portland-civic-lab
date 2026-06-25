import type { Metadata } from "next";
import { pageMeta } from "@/lib/page-meta";
import Link from "next/link";
import { ArrowRight, Building2, Landmark, Network, Scale, Store, TreePine, Users } from "lucide-react";
import { HEADLINE } from "@/lib/fpdr/data";
import { fmtMoney } from "@/lib/fpdr/engine";
import { DIVE_CONTAINER } from "@/components/deep-dives/shared";

export const metadata: Metadata = pageMeta({
  title: "Policy Deep-Dives",
  description:
    "In-depth, plain-language explainers of the Portland policy issues that matter most — with the numbers, the people, and the trade-offs laid out so anyone can understand them.",
  path: "/deep-dives",
});

interface DeepDive {
  href: string;
  eyebrow: string;
  title: string;
  blurb: string;
  stat: string;
  statLabel: string;
  icon: React.ComponentType<{ className?: string }>;
  available: boolean;
}

const DIVES: DeepDive[] = [
  {
    href: "/deep-dives/lloyd",
    eyebrow: "Housing & redevelopment",
    title: "Lloyd Center: demolished on a promise",
    blurb:
      "Portland's dead mall is coming down for up to 5,141 homes — but the approval requires zero affordable units and no ice rink, and the city is building fewer homes than any year since 2009. Both sides, the fine print, and an interactive look at whether the homes actually get built.",
    stat: "5,141",
    statLabel: "homes promised — zero of them required",
    icon: Store,
    available: true,
  },
  {
    href: "/deep-dives/oregon-economic-development",
    eyebrow: "Economy & government",
    title: "Is Oregon serious about its own economy?",
    blurb:
      "Governor Kotek's Prosperity Council wants to blow up Business Oregon and build a Department of Commerce. The case against the agency — and the asterisks the headline numbers hide — with the scorecard, the $1B decoded, the front door no CEO would use, and a four-state field test on whether a reorg actually works.",
    stat: "1,200 → 800",
    statLabel: "where the job target moved after years of missing it",
    icon: Building2,
    available: true,
  },
  {
    href: "/deep-dives/portland-growth-politics",
    eyebrow: "Housing & taxes",
    title: "The hidden contradictions in Portland's growth politics",
    blurb:
      "Portland wants affordability, climate infill, stable neighborhoods, tenant protections, progressive taxes, and enough homes for the next generation. This deep dive shows where those goals collide, who benefits, who pays, and what changes when you move the levers.",
    stat: "120,560",
    statLabel: "homes Portland must plan for by 2045",
    icon: Scale,
    available: true,
  },
  {
    href: "/deep-dives/who-runs-portland",
    eyebrow: "Power map",
    title: "Who actually runs Portland?",
    blurb:
      "Portland's biggest fights often happen because power is spread across the city, county, Metro, state, transit, schools, hospitals, providers, and funders. This is the map of who owns what - and the Street-to-Stability system Civic Lab is building first.",
    stat: "9",
    statLabel: "major layers of civic power",
    icon: Network,
    available: true,
  },
  {
    href: "/deep-dives/fpdr",
    eyebrow: "Budgets & pensions",
    title: "The pension on your property tax bill",
    blurb:
      "Portland owes billions in police and fire pensions and saved almost none of it. What FPDR costs you, who receives it, and how it could be fixed — with calculators and an interactive reform simulator.",
    stat: fmtMoney(HEADLINE.liability),
    statLabel: "promised, less than 1% saved",
    icon: Landmark,
    available: true,
  },
  {
    href: "/deep-dives/mass-timber",
    eyebrow: "Housing & industry",
    title: "Mass timber: Oregon's big housing bet",
    blurb:
      "Can building homes out of wood in factories help fix the housing shortage? What mass timber is, what it's good for, how much housing it can provide and at what cost — with a factory-cost calculator, the success stories, and the long graveyard of failures.",
    stat: "491,347",
    statLabel: "homes Oregon needs in 20 years",
    icon: TreePine,
    available: true,
  },
  {
    href: "/deep-dives/homelessness",
    eyebrow: "Homelessness",
    title: "Why Portland can't end homelessness",
    blurb:
      "Portland spends more than ever and it keeps growing. The math that explains why — the inflow/outflow simulator, who's actually homeless, the true cost of doing nothing, why nobody can see the beds, and what would actually work.",
    stat: "+~400",
    statLabel: "net added to the list every month",
    icon: Users,
    available: true,
  },
];

export default function DeepDivesIndex() {
  return (
    <div className="bg-[var(--color-paper)] min-h-screen">
      {/* Hero */}
      <section className="relative bg-[var(--color-canopy)] text-white noise-overlay overflow-hidden">
        <div className="absolute top-0 right-0 w-[560px] h-[560px] bg-[var(--color-canopy-light)] rounded-full blur-[180px] opacity-25 -translate-y-1/3 translate-x-1/4 pointer-events-none" />
        <div className={`relative z-10 ${DIVE_CONTAINER} py-16 sm:py-20`}>
          <div className="flex items-center gap-3 text-[10px] font-mono uppercase tracking-[0.22em] text-[var(--color-ember)]/90">
            <span>Portland Civic Lab</span>
            <div className="w-8 h-px bg-[var(--color-ember)]/50" />
            <span>Policy Deep-Dives</span>
          </div>
          <h1 className="mt-6 font-editorial-normal text-[40px] sm:text-[56px] lg:text-[66px] leading-[1.05] tracking-tight max-w-3xl">
            The big issues,
            <span className="block font-editorial italic text-[var(--color-ember-bright)]">
              explained for everyone
            </span>
          </h1>
          <p className="mt-6 max-w-2xl text-[17px] sm:text-[19px] text-white/75 leading-relaxed">
            Some of Portland&apos;s most important policy questions are buried in actuarial reports and
            budget footnotes. We pull them into the open — visuals first, plain language, real
            numbers, and interactive tools — so anyone can understand what&apos;s at stake and why.
          </p>
        </div>
      </section>

      {/* Dives */}
      <section className={`${DIVE_CONTAINER} py-14 sm:py-18`}>
        <div className="grid gap-6">
          {DIVES.map((d) => (
            <Link
              key={d.href}
              href={d.href}
              className="group grid md:grid-cols-[1fr_auto] gap-6 items-center rounded-sm border border-[var(--color-parchment)] bg-white p-7 sm:p-9 transition-all hover:border-[var(--color-sage)] hover:shadow-[0_8px_32px_rgba(15,36,25,0.06)] hover:-translate-y-0.5"
            >
              <div>
                <div className="flex items-center gap-2.5 mb-3">
                  <d.icon className="w-5 h-5 text-[var(--color-ember)]" />
                  <span className="text-[10px] font-mono font-semibold uppercase tracking-[0.18em] text-[var(--color-ember)]">
                    {d.eyebrow}
                  </span>
                </div>
                <h2 className="font-editorial text-[26px] sm:text-[32px] text-[var(--color-ink)] leading-tight group-hover:text-[var(--color-canopy)] transition-colors">
                  {d.title}
                </h2>
                <p className="mt-3 max-w-2xl text-[15px] text-[var(--color-ink-light)] leading-relaxed">
                  {d.blurb}
                </p>
                <span className="mt-5 inline-flex items-center gap-2 text-[14px] font-semibold text-[var(--color-canopy)]">
                  Read the deep-dive
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </span>
              </div>
              <div className="md:border-l md:border-[var(--color-parchment)] md:pl-8 md:text-right">
                <p className="font-mono text-[34px] sm:text-[40px] font-bold text-[var(--color-canopy)] tabular-nums leading-none">
                  {d.stat}
                </p>
                <p className="text-[12px] text-[var(--color-ink-muted)] mt-2 max-w-[200px] md:ml-auto leading-snug">
                  {d.statLabel}
                </p>
              </div>
            </Link>
          ))}

          {/* Coming soon hint */}
          <div className="rounded-sm border border-dashed border-[var(--color-parchment)] p-7 text-center">
            <p className="text-[14px] text-[var(--color-ink-muted)]">
              More deep-dives coming — housing, public safety spending, and climate.{" "}
              <Link href="/contact" className="text-[var(--color-canopy)] underline underline-offset-2">
                Suggest a topic
              </Link>
              .
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
