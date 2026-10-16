import { pageMeta } from "@/lib/page-meta";
import type { Metadata } from "next";
import { buildPerformanceDecisionSuite } from "@/lib/performance/decision-tools";
import { getPerformanceSnapshot } from "@/lib/performance/service";
import PerformanceDashboardClient from "./PerformanceDashboardClient";
import PerformanceUnavailable from "./PerformanceUnavailable";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export const metadata: Metadata = pageMeta({
  title: "Portland City Performance Dashboard",
  description: "Explore Portland’s official performance measures, trends and explanations. Follow service results, budget context and changes in what the City reports.",
  path: "/dashboard/performance",
});

export default async function PerformanceDashboardPage() {
  try {
    const snapshot = await getPerformanceSnapshot();
    const decisionSuite = buildPerformanceDecisionSuite(snapshot);

    return <PerformanceDashboardClient snapshot={snapshot} decisionSuite={decisionSuite} />;
  } catch (error) {
    console.error("[performance page]", error);
    return <PerformanceUnavailable />;
  }
}
