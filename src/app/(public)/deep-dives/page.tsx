import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Landmark, TreePine } from "lucide-react";
import { HEADLINE } from "@/lib/fpdr/data";
import { fmtMoney } from "@/lib/fpdr/engine";

export const metadata: Metadata = {
  title: "Policy Deep-Dives | Portland Civic Lab",
  description:
    "In-depth, plain-language explainers of the Portland policy issues that matter most — with the numbers, the people, and the trade-offs laid out so anyone can understand them.",
};

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
];

export default function DeepDivesIndex() {
  return (
    <div className="bg-[var(--color-paper)] min-h-screen">
      {/* Hero */}
      <section className="relative bg-[var(--color-canopy)] text-white noise-overlay overflow-hidden">
        <div className="absolute top-0 right-0 w-[560px] h-[560px] bg-[var(--color-canopy-light)] rounded-full blur-[180px] opacity-25 -translate-y-1/3 translate-x-1/4 pointer-events-none" />
        <div className="relative z-10 max-w-[1080px] mx-auto px-5 sm:px-8 py-16 sm:py-20">
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
      <section className="max-w-[1080px] mx-auto px-5 sm:px-8 py-14 sm:py-18">
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
