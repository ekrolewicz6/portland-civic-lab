import {
  fetchPerformanceSnapshot,
  stripRawPayloads,
} from "./clearimpact";
import { buildPerformanceDecisionSuite } from "./decision-tools";
import {
  loadPerformanceMetricFromDb,
  loadPerformanceSnapshotFromDb,
  savePerformanceSnapshot,
} from "./store";
import type {
  PerformanceDecisionSuite,
  PerformanceMetric,
  PerformanceSnapshot,
} from "./types";

export async function getPerformanceSnapshot(options?: {
  allowLiveFallback?: boolean;
}): Promise<PerformanceSnapshot> {
  const cached = await loadPerformanceSnapshotFromDb();
  if (cached) return cached;

  if (options?.allowLiveFallback === false) {
    throw new Error("Performance Portland cache is empty");
  }

  const live = await fetchPerformanceSnapshot();
  return stripRawPayloads(live);
}

export async function getPerformanceMetric(
  measureId: string,
): Promise<PerformanceMetric | null> {
  const cached = await loadPerformanceMetricFromDb(measureId);
  if (cached) return cached;

  const snapshot = await getPerformanceSnapshot();
  return snapshot.metrics.find((metric) => metric.measureId === measureId) ?? null;
}

export async function getPerformanceDecisionSuite(): Promise<PerformanceDecisionSuite> {
  const snapshot = await getPerformanceSnapshot();
  return buildPerformanceDecisionSuite(snapshot);
}

export async function syncPerformanceSnapshot(): Promise<{
  runId: number;
  snapshot: PerformanceSnapshot;
}> {
  const snapshot = await fetchPerformanceSnapshot();
  const runId = await savePerformanceSnapshot(snapshot);

  return {
    runId,
    snapshot: {
      ...stripRawPayloads(snapshot),
      cacheStatus: "synced",
    },
  };
}
