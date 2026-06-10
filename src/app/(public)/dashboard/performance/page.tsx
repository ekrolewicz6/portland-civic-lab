import type { Metadata } from "next";
import Link from "next/link";
import { buildPerformanceDecisionSuite } from "@/lib/performance/decision-tools";
import { getPerformanceSnapshot } from "@/lib/performance/service";
import PerformanceDashboardClient from "./PerformanceDashboardClient";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export const metadata: Metadata = {
  title: "Performance Portland Mirror | Portland Civic Lab",
  description:
    "A public mirror of Performance Portland scorecards with official metric history, narrative notes, change logs, and decision tools for Portland leadership.",
};

export default async function PerformanceDashboardPage() {
  try {
    const snapshot = await getPerformanceSnapshot();
    const decisionSuite = buildPerformanceDecisionSuite(snapshot);

    return <PerformanceDashboardClient snapshot={snapshot} decisionSuite={decisionSuite} />;
  } catch (error) {
    console.error("[performance page]", error);
    return (
      <main className="min-h-screen bg-[var(--color-paper)] px-5 py-16 sm:px-8 lg:px-12">
        <section className="mx-auto max-w-3xl rounded-sm border border-[var(--color-parchment)] bg-[var(--color-paper-warm)] p-8">
          <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-[var(--color-canopy)]">
            Performance Portland Mirror
          </p>
          <h1 className="mt-3 font-editorial text-4xl text-[var(--color-ink)]">
            Performance cache is not available
          </h1>
          <p className="mt-4 text-sm leading-relaxed text-[var(--color-ink-light)]">
            The platform could not read cached Performance Portland data or fetch a live
            ClearImpact fallback.
          </p>
          <p className="mt-5 rounded-sm bg-white p-4 text-xs text-[var(--color-ink-light)]">
            Please try again in a few minutes. If the problem persists, let us
            know through the contact page.
          </p>
          <Link
            href="/dashboard"
            className="mt-6 inline-flex rounded-sm bg-[var(--color-canopy)] px-4 py-2 text-sm font-semibold text-white"
          >
            Back to dashboard
          </Link>
        </section>
      </main>
    );
  }
}
