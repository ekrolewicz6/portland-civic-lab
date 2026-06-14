import type { Metadata } from "next";
import Link from "next/link";
import OrgChartExplorer from "@/components/org/OrgChartExplorer";
import { ORG_AS_OF } from "@/data/org-structure";

export const metadata: Metadata = {
  title: "Portland City Org Chart",
  description:
    "An interactive, sourced org chart of City of Portland government under the new charter — the Mayor, 12-member Council, Auditor, City Administrator, and every bureau across the four service areas.",
  alternates: {
    canonical: "https://www.portlandciviclab.org/org-chart",
  },
};

export default function OrgChartPage() {
  return (
    <div className="bg-[var(--color-paper)]">
      <section className="relative overflow-hidden bg-[var(--color-canopy)] noise-overlay">
        <div className="absolute right-0 top-0 h-[420px] w-[520px] translate-x-1/4 -translate-y-1/3 rounded-full bg-[var(--color-canopy-light)] opacity-25 blur-[150px]" />
        <div className="mx-auto max-w-[1400px] px-5 py-14 sm:px-8 sm:py-18 lg:px-12">
          <div className="max-w-3xl">
            <div className="flex items-center gap-3 text-[10px] font-mono uppercase tracking-[0.22em] text-[var(--color-ember)]/85">
              <span>City government</span>
              <div className="h-px w-8 bg-[var(--color-ember)]/60" />
              <span>Who runs Portland</span>
            </div>
            <h1 className="mt-6 font-editorial-normal text-[42px] leading-[1.02] tracking-tight text-white sm:text-[56px]">
              The Portland org chart
            </h1>
            <p className="mt-5 max-w-2xl text-[16px] leading-relaxed text-white/70 sm:text-[18px]">
              Portland rebuilt its government in 2025 — a mayor, a 12-member
              council, a city administrator, and dozens of bureaus regrouped
              into four service areas, employing some 7,300 people. This is the
              whole structure in one place, every node tied to an official
              source and sized by authorized headcount. Click anything to see
              who runs it, how it&apos;s funded, and how many positions it holds.
            </p>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-[1400px] px-5 py-10 sm:px-8 sm:py-12 lg:px-12">
        <OrgChartExplorer />
      </section>

      <section className="border-t border-[var(--color-parchment)] bg-[var(--color-paper-warm)]">
        <div className="mx-auto max-w-[1400px] px-5 py-12 sm:px-8 sm:py-16 lg:px-12">
          <h2 className="font-editorial text-[26px] sm:text-[32px] text-[var(--color-ink)] leading-tight">
            How this was built
          </h2>
          <div className="mt-6 grid grid-cols-1 gap-5 md:grid-cols-3">
            <div className="rounded-sm border border-[var(--color-parchment)] bg-white p-6">
              <h3 className="font-editorial text-[20px] text-[var(--color-ink)]">
                Sourced, node by node
              </h3>
              <p className="mt-3 text-[14px] leading-relaxed text-[var(--color-ink-light)]">
                Every bureau and office links to an official portland.gov page or
                the FY2026-27 budget. The structure was reconciled against the
                city&apos;s Summer 2025 org chart and the budget&apos;s service-area
                organization, current as of {ORG_AS_OF}.
              </p>
            </div>
            <div className="rounded-sm border border-[var(--color-parchment)] bg-white p-6">
              <h3 className="font-editorial text-[20px] text-[var(--color-ink)]">
                Honest about what&apos;s uncertain
              </h3>
              <p className="mt-3 text-[14px] leading-relaxed text-[var(--color-ink-light)]">
                Leaders and placements we couldn&apos;t confirm on an official
                page are tagged{" "}
                <span className="font-semibold">Unconfirmed</span> rather than
                guessed. The 2025 reorganization moved many bureaus; those moves
                are flagged so you can see what changed.
              </p>
            </div>
            <div className="rounded-sm border border-[var(--color-parchment)] bg-white p-6">
              <h3 className="font-editorial text-[20px] text-[var(--color-ink)]">
                What comes next
              </h3>
              <p className="mt-3 text-[14px] leading-relaxed text-[var(--color-ink-light)]">
                Budget, authorized headcount, and individual salaries attach to
                these nodes in later phases — the salary roster is being pursued
                through a{" "}
                <Link
                  href="/records"
                  className="font-semibold text-[var(--color-canopy)] hover:underline"
                >
                  public records request
                </Link>
                . Spot something wrong?{" "}
                <Link
                  href="/contact"
                  className="font-semibold text-[var(--color-canopy)] hover:underline"
                >
                  Tell us
                </Link>
                .
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
