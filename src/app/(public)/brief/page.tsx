import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  ArrowUpRight,
  CalendarClock,
  ListOrdered,
  Radar,
} from "lucide-react";
import { pageMeta } from "@/lib/page-meta";
import { latestIssue } from "@/lib/brief/issues";

export const dynamic = "force-static";

export const metadata: Metadata = pageMeta({
  title: "The Portland Portfolio Brief",
  description:
    "A weekly, public-source brief on Portland's development portfolio: the five things that need attention, the decisions on the record as unresolved, and the dates worth watching.",
  path: "/brief",
});

export default function BriefPage() {
  const issue = latestIssue();

  return (
    <div className="bg-[var(--color-paper)]">
      {/* Masthead */}
      <section className="max-w-[900px] mx-auto w-full px-5 sm:px-8 pt-16 sm:pt-24 pb-10">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-8 h-px bg-[var(--color-ember)]" />
          <span className="text-[10px] font-mono font-semibold uppercase tracking-[0.22em] text-[var(--color-ember)]">
            Weekly · free · public sources only
          </span>
        </div>
        <h1 className="font-editorial-normal text-[40px] sm:text-[56px] lg:text-[64px] text-[var(--color-ink)] leading-[1.05]">
          The Portland Portfolio Brief
        </h1>
        <p className="mt-6 max-w-2xl text-[17px] sm:text-[18px] text-[var(--color-ink-light)] leading-relaxed">
          Portland&apos;s development portfolio — housing, permitting, climate
          capital, economic development, arts and venues — moves every week,
          across a dozen agencies. The Brief reads the public record so you
          don&apos;t have to: the five things that need attention, the decisions
          still open, and the dates worth watching. Every claim links to its
          source.
        </p>
      </section>

      {issue ? (
        <section className="max-w-[900px] mx-auto w-full px-5 sm:px-8 pb-16 sm:pb-20">
          <article className="rounded-sm border border-[var(--color-parchment)] bg-white p-6 sm:p-10">
            {/* Issue header */}
            <div className="flex flex-wrap items-baseline justify-between gap-2 border-b border-[var(--color-parchment)] pb-5">
              <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-[var(--color-ember)]">
                Issue {String(issue.number).padStart(3, "0")}
              </span>
              <span className="font-mono text-[12px] text-[var(--color-ink-muted)]">
                {issue.date}
              </span>
            </div>

            <p className="mt-6 text-[16px] leading-relaxed text-[var(--color-ink)]">
              {issue.intro}
            </p>

            {/* Five things */}
            <div className="mt-9">
              <div className="flex items-center gap-2">
                <ListOrdered className="h-4 w-4 text-[var(--color-canopy)]" />
                <h2 className="font-mono text-[11px] font-semibold uppercase tracking-[0.2em] text-[var(--color-canopy)]">
                  Five things that need attention
                </h2>
              </div>
              <ol className="mt-5 space-y-6">
                {issue.attention.map((item, i) => (
                  <li key={item.title} className="flex gap-4">
                    <span className="font-editorial text-[28px] leading-none text-[var(--color-ember)]">
                      {i + 1}
                    </span>
                    <div>
                      <h3 className="font-editorial text-[21px] leading-tight text-[var(--color-ink)]">
                        {item.title}
                      </h3>
                      <p className="mt-1.5 text-[15px] leading-relaxed text-[var(--color-ink-light)]">
                        {item.body}
                      </p>
                      {item.source && (
                        <a
                          href={item.source.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="group mt-2 inline-flex items-center gap-1 font-mono text-[10px] uppercase tracking-[0.12em] text-[var(--color-canopy)] hover:text-[var(--color-fern)]"
                        >
                          {item.source.label}
                          <ArrowUpRight className="h-3 w-3 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                        </a>
                      )}
                    </div>
                  </li>
                ))}
              </ol>
            </div>

            {/* Decisions due */}
            <div className="mt-10">
              <div className="flex items-center gap-2">
                <CalendarClock className="h-4 w-4 text-[var(--color-canopy)]" />
                <h2 className="font-mono text-[11px] font-semibold uppercase tracking-[0.2em] text-[var(--color-canopy)]">
                  Decisions on the record as unresolved
                </h2>
              </div>
              <div className="mt-4 divide-y divide-[var(--color-parchment)] rounded-sm border border-[var(--color-parchment)]">
                {issue.decisionsDue.map((d) => (
                  <div
                    key={d.what}
                    className="grid gap-1 px-4 py-3.5 sm:grid-cols-[1fr_200px_120px] sm:items-baseline sm:gap-4"
                  >
                    <span className="text-[14px] font-semibold leading-snug text-[var(--color-ink)]">
                      {d.what}
                    </span>
                    <span className="text-[13px] text-[var(--color-ink-light)]">
                      {d.who}
                    </span>
                    <span className="font-mono text-[12px] text-[var(--color-clay)] sm:text-right">
                      {d.due}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Watching */}
            <div className="mt-10">
              <div className="flex items-center gap-2">
                <Radar className="h-4 w-4 text-[var(--color-canopy)]" />
                <h2 className="font-mono text-[11px] font-semibold uppercase tracking-[0.2em] text-[var(--color-canopy)]">
                  Watching
                </h2>
              </div>
              <ul className="mt-4 space-y-2.5">
                {issue.watching.map((w) => (
                  <li
                    key={w}
                    className="border-l-2 border-[var(--color-ember)]/50 pl-3 text-[14.5px] leading-relaxed text-[var(--color-ink-light)]"
                  >
                    {w}
                  </li>
                ))}
              </ul>
            </div>
          </article>

          {/* Footer / CTA */}
          <div className="mt-8 rounded-sm border border-[var(--color-parchment)] bg-[var(--color-paper-warm)] p-6 sm:p-7">
            <p className="text-[15px] leading-relaxed text-[var(--color-ink-light)]">
              New issues publish here. The underlying portfolio — every
              initiative, decision, and source — lives on the{" "}
              <Link
                href="/dashboard/performance/dcas/ced"
                className="font-semibold text-[var(--color-canopy)] hover:underline"
              >
                CED cockpit
              </Link>
              , free and public.
            </p>
            <p className="mt-3 text-[13px] leading-relaxed text-[var(--color-ink-light)]">
              <span className="font-semibold text-[var(--color-ink)]">
                Disclosure:
              </span>{" "}
              Portland Civic Lab sells a paid version of this capability to
              public institutions —{" "}
              <Link
                href="/institutions"
                className="font-semibold text-[var(--color-canopy)] hover:underline"
              >
                described, with prices, here
              </Link>
              . The public Brief is free and stays free.
            </p>
            <Link
              href="/signup"
              prefetch={false}
              className="mt-5 inline-flex items-center gap-2 rounded-sm bg-[var(--color-canopy)] px-5 py-3 text-[15px] font-semibold text-white transition-colors hover:bg-[var(--color-canopy-mid)]"
            >
              Join the Lab to follow along
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </section>
      ) : (
        <section className="max-w-[900px] mx-auto w-full px-5 sm:px-8 pb-16 sm:pb-20">
          <div className="rounded-sm border border-[var(--color-parchment)] bg-white p-8 text-center">
            <p className="font-editorial text-[24px] text-[var(--color-ink)]">
              Issue 001 is in the works.
            </p>
            <p className="mx-auto mt-3 max-w-xl text-[15px] text-[var(--color-ink-light)] leading-relaxed">
              The first issue publishes here soon, built from the public
              portfolio on the CED cockpit.
            </p>
          </div>
        </section>
      )}
    </div>
  );
}
