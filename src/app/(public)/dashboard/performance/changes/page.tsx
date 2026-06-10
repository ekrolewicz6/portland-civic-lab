import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, ArrowUpRight, Clock, FileWarning } from "lucide-react";
import { buildPerformanceDecisionSuite } from "@/lib/performance/decision-tools";
import { getPerformanceSnapshot } from "@/lib/performance/service";
import { PageGuide } from "../_components/PageGuide";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export const metadata: Metadata = {
  title: "Performance Change Log | Portland Civic Lab",
  description:
    "Changed values, stale or weak metrics, and update-risk tracking for the Performance Portland mirror.",
};

function ageLabel(period: string | null): string {
  if (!period) return "Unknown period";
  return period;
}

export default async function PerformanceChangeLogPage() {
  const snapshot = await getPerformanceSnapshot();
  const decisionSuite = buildPerformanceDecisionSuite(snapshot);
  const weakMetrics = decisionSuite.staleOrWeakMetrics;

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top_left,#fffdf8_0,#f7f3ed_42%,#efe8dc_100%)]">
      <section className="relative overflow-hidden bg-[var(--color-canopy)] noise-overlay">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_78%_18%,rgba(224,168,112,0.18),transparent_32%),linear-gradient(135deg,rgba(255,255,255,0.08),transparent_42%)]" />
        <div className="mx-auto max-w-[1300px] px-5 py-10 sm:px-8 lg:px-12">
          <Link
            href="/dashboard/performance"
            className="performance-dark-link inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.16em]"
          >
            <ArrowLeft className="h-4 w-4" />
            Performance warehouse
          </Link>
          <div className="mt-8 max-w-4xl">
            <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-[var(--color-ember-bright)]">
              Change Log
            </p>
            <h1 className="mt-3 font-editorial-normal text-[42px] leading-[1.03] text-white sm:text-[64px]">
              What moved, what is stale, and what needs an owner
            </h1>
            <p className="performance-dark-copy mt-5 max-w-3xl text-base leading-relaxed">
              This page turns ClearImpact cache refreshes into a public update log. Changed
              values appear after the cache has been synced at least twice.
            </p>
          </div>
          <PageGuide
            start="Check whether any official latest values changed after the last cache refresh."
            importance="A public change log lets staff and advocates spot newly updated metrics before they show up in meetings."
            scrollFor="Changed values, cache status, and weak or stale metric candidates that need follow-up."
            nextHref="/dashboard/performance"
            nextLabel="Back to warehouse"
          />
        </div>
      </section>

      <section className="mx-auto grid max-w-[1300px] gap-6 px-5 py-8 sm:px-8 lg:grid-cols-[1fr_420px] lg:px-12">
        <div className="rounded-sm border border-[var(--color-parchment)] bg-white p-5 shadow-[0_22px_80px_rgba(15,36,25,0.07)] sm:p-6">
          <div className="flex items-center gap-3">
            <Clock className="h-5 w-5 text-[var(--color-canopy)]" />
            <h2 className="font-editorial text-3xl text-[var(--color-ink)]">
              Changed Values
            </h2>
          </div>
          <p className="mt-3 text-sm leading-relaxed text-[var(--color-ink-light)]">
            The platform compares the latest cached value and period against the prior
            cache record. This avoids treating every historical row as a new event.
          </p>
          <div className="mt-5 space-y-3">
            {snapshot.changes.length === 0 ? (
              <div className="rounded-sm border border-dashed border-[var(--color-parchment)] bg-[var(--color-paper-warm)] p-6 text-sm leading-relaxed text-[var(--color-ink-muted)]">
                No changed values are recorded yet. Run the internal performance sync job
                after the first cache seed to start producing this log.
              </div>
            ) : (
              snapshot.changes.map((change) => (
                <Link
                  key={`${change.measureId}-${change.changedAt}`}
                  href={`/dashboard/performance/${change.measureId}`}
                  className="group grid gap-3 rounded-sm border border-[var(--color-parchment)] bg-[var(--color-paper-warm)] p-4 shadow-[0_10px_35px_rgba(15,36,25,0.035)] transition-all hover:-translate-y-0.5 hover:border-[var(--color-sage)] sm:grid-cols-[1fr_auto]"
                >
                  <div>
                    <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-[var(--color-canopy)]">
                      Measure #{change.measureId}
                    </p>
                    <p className="mt-2 text-sm text-[var(--color-ink-light)]">
                      {change.previousPeriod ?? "none"} / {change.previousActual ?? "none"} →{" "}
                      {change.newPeriod ?? "none"} / {change.newActual ?? "none"}
                    </p>
                  </div>
                  <p className="font-mono text-[11px] text-[var(--color-ink-muted)]">
                    {new Date(change.changedAt).toLocaleString()}
                  </p>
                </Link>
              ))
            )}
          </div>
        </div>

        <aside className="space-y-5">
          <div className="rounded-sm border border-[var(--color-parchment)] bg-[var(--color-canopy)] p-5 text-white shadow-[0_18px_70px_rgba(15,36,25,0.14)]">
            <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-[var(--color-ember-bright)]">
              Cache Status
            </p>
            <dl className="mt-4 space-y-3 text-sm">
              <div>
                <dt className="font-semibold text-white">Last fetched</dt>
                <dd className="text-white/70">
                  {new Date(snapshot.fetchedAt).toLocaleString()}
                </dd>
              </div>
              <div>
                <dt className="font-semibold text-white">Metric instances</dt>
                <dd className="text-white/70">
                  {snapshot.counts.metricInstances}
                </dd>
              </div>
              <div>
                <dt className="font-semibold text-white">Narrative notes</dt>
                <dd className="text-white/70">
                  {snapshot.counts.narrativeNotes}
                </dd>
              </div>
            </dl>
          </div>

          <div className="rounded-sm border border-[var(--color-parchment)] bg-white p-5 shadow-[0_18px_60px_rgba(15,36,25,0.06)]">
            <div className="flex items-center gap-3">
              <FileWarning className="h-5 w-5 text-[var(--color-ember)]" />
              <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-[var(--color-canopy)]">
                Weak / Stale Candidates
              </p>
            </div>
            <div className="mt-4 space-y-3">
              {weakMetrics.map((metric) => (
                <Link
                  key={metric.measureId}
                  href={`/dashboard/performance/${metric.measureId}`}
                  className="block rounded-sm border border-[var(--color-parchment)] bg-white/75 p-3 hover:border-[var(--color-sage)]"
                >
                  <span className="line-clamp-2 text-sm font-semibold text-[var(--color-ink)]">
                    {metric.title}
                  </span>
                  <span className="mt-1 flex items-center justify-between gap-3 text-xs text-[var(--color-ink-muted)]">
                    {ageLabel(metric.latestPeriod)}
                    <ArrowUpRight className="h-3 w-3" />
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </aside>
      </section>
    </main>
  );
}
