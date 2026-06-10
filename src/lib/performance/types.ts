export const PERFORMANCE_NOTE_KEYS = [
  "why_is_this_important",
  "what_do_the_numbers_show",
  "how_did_we_arrive",
  "where_can_i_find_more_information",
] as const;

export type PerformanceNoteKey = (typeof PERFORMANCE_NOTE_KEYS)[number];

export type PerformanceMetricType = "Indicator" | "Performance Measure" | "Measure";

export interface PerformanceScorecardConfig {
  scorecardId: string;
  title: string;
  slug: string;
  officialPath: string;
}

export interface PerformanceSourceLink {
  text: string;
  href: string;
}

export interface PerformanceNarrative {
  key: PerformanceNoteKey;
  title: string;
  html: string;
  text: string;
  links: PerformanceSourceLink[];
}

export interface PerformanceTrend {
  direction: "up" | "down" | "flat" | "unknown";
  tone: "positive" | "negative" | "neutral" | "unknown";
  periods: number | null;
  rawDirection: number | null;
}

export interface PerformanceMeasureValue {
  timePeriodId: string | null;
  timePeriod: string;
  sortOrder: number;
  actualValue: string | null;
  targetValue: string | null;
  forecastValue: string | null;
  varianceFromTarget: string | null;
  percentage: string | null;
  percentChangeFromPrior: string | null;
  baselineChange: string | null;
  currentTrendDirection: number | null;
  currentTrendPeriods: number | null;
  actualValueColor: unknown;
  rawValue: Record<string, unknown>;
}

export interface PerformanceRawPayload {
  payloadKey: string;
  payloadKind: "scorecard_html" | "container_payload" | "measure_json";
  sourceUrl: string;
  contentText?: string;
  contentJson?: unknown;
  fetchedAt: string;
}

export interface PerformanceMetric {
  measureId: string;
  valueId: string;
  title: string;
  metricType: PerformanceMetricType;
  scorecardIds: string[];
  containerIds: string[];
  latestPeriod: string | null;
  latestActual: string | null;
  trend: PerformanceTrend;
  polarity: number | null;
  sourceUrl: string;
  additionalDataUrl: string;
  chartData: unknown;
  files: unknown[];
  values: PerformanceMeasureValue[];
  narratives: Partial<Record<PerformanceNoteKey, PerformanceNarrative>>;
  metadata: Record<string, unknown>;
  lastFetchedAt: string;
  latestChangedAt?: string | null;
}

export interface PerformanceMeasureInstance {
  scorecardId: string;
  containerId: string;
  measureId: string;
  sortOrder: number;
}

export interface PerformanceContainer {
  containerId: string;
  scorecardId: string;
  title: string;
  sortOrder: number;
  sourceUrl: string;
  metrics: PerformanceMetric[];
  rawPayloadKey?: string;
  lastFetchedAt: string;
}

export interface PerformanceScorecard {
  scorecardId: string;
  title: string;
  slug: string;
  sourceUrl: string;
  officialPath: string;
  containers: PerformanceContainer[];
  rawPayloadKey?: string;
  lastFetchedAt: string;
}

export interface PerformanceMeasureChange {
  id?: number;
  runId?: number | null;
  measureId: string;
  scorecardId: string | null;
  containerId: string | null;
  changeType: string;
  previousPeriod: string | null;
  previousActual: string | null;
  newPeriod: string | null;
  newActual: string | null;
  changedAt: string;
}

export interface PerformanceSnapshotCounts {
  scorecards: number;
  containers: number;
  metricInstances: number;
  uniqueMeasures: number;
  narrativeNotes: number;
}

export interface PerformanceSnapshot {
  parserVersion: string;
  fetchedAt: string;
  source: string;
  cacheStatus?: "cached" | "live_uncached" | "synced";
  scorecards: PerformanceScorecard[];
  metrics: PerformanceMetric[];
  instances: PerformanceMeasureInstance[];
  changes: PerformanceMeasureChange[];
  counts: PerformanceSnapshotCounts;
  rawPayloads?: PerformanceRawPayload[];
}

export interface PerformanceToolMetric {
  measureId: string;
  title: string;
  latestPeriod: string | null;
  latestActual: string | null;
  trendDirection: PerformanceTrend["direction"];
}

export interface PerformanceDecisionTool {
  slug: string;
  audience: "raymond_lee" | "dca" | "city_council";
  title: string;
  purpose: string;
  delivery: string;
  priorityMetrics: PerformanceToolMetric[];
  openQuestions: string[];
}

export interface PerformanceDecisionSuite {
  raymondLee: PerformanceDecisionTool[];
  dcas: PerformanceDecisionTool[];
  cityCouncil: PerformanceDecisionTool[];
  riskRegister: PerformanceToolMetric[];
  staleOrWeakMetrics: PerformanceToolMetric[];
}
