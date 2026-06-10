import {
  PERFORMANCE_NOTE_KEYS,
  type PerformanceContainer,
  type PerformanceMeasureInstance,
  type PerformanceMeasureValue,
  type PerformanceMetric,
  type PerformanceMetricType,
  type PerformanceNarrative,
  type PerformanceNoteKey,
  type PerformanceRawPayload,
  type PerformanceScorecard,
  type PerformanceScorecardConfig,
  type PerformanceSnapshot,
  type PerformanceTrend,
} from "./types";

export const PERFORMANCE_PARSER_VERSION = "2026-05-08.1";
export const CLEARIMPACT_BASE_URL = "https://embed.clearimpact.com";
export const PERFORMANCE_PORTLAND_URL = "https://www.portland.gov/performance";

export const PERFORMANCE_SCORECARDS: PerformanceScorecardConfig[] = [
  {
    scorecardId: "89552",
    title: "Portland and Its Government",
    slug: "city-and-government",
    officialPath: "https://www.portland.gov/performance/city-and-government",
  },
  {
    scorecardId: "90259",
    title: "City Operations",
    slug: "city-operations",
    officialPath: "https://www.portland.gov/performance/city-operations",
  },
  {
    scorecardId: "89654",
    title: "Community and Economic Development",
    slug: "community-and-economic-development",
    officialPath: "https://www.portland.gov/performance/community-and-economic-development",
  },
  {
    scorecardId: "89655",
    title: "Public Safety",
    slug: "public-safety",
    officialPath: "https://www.portland.gov/performance/public-safety",
  },
  {
    scorecardId: "89657",
    title: "Public Works",
    slug: "public-works",
    officialPath: "https://www.portland.gov/performance/public-works",
  },
];

type FetchLike = (input: string | URL, init?: RequestInit) => Promise<Response>;

interface ContainerCallbackItem {
  Value?: string;
  ObjectID?: string | number;
  [key: string]: unknown;
}

interface MeasureSummary {
  measureId: string;
  valueId: string;
  title: string;
  metricType: PerformanceMetricType;
  latestPeriod: string | null;
  latestActual: string | null;
  metadata: Record<string, unknown>;
}

function scorecardEmbedUrl(scorecardId: string): string {
  return `${CLEARIMPACT_BASE_URL}/Scorecard/Embed/${scorecardId}`;
}

function containerUrl(containerId: string, scorecardId: string): string {
  return `${CLEARIMPACT_BASE_URL}/Scorecard/GetContainers?containerId=${containerId}&scorecardId=${scorecardId}`;
}

function measureDataUrl(valueId: string, measureId: string): string {
  return `${CLEARIMPACT_BASE_URL}/Scorecard/GetAdditionalPMData/${valueId}?v=2&skip=0&take=100&parentObjectID=${measureId}`;
}

function nowIso(): string {
  return new Date().toISOString();
}

function decodeHtml(value: string): string {
  const named: Record<string, string> = {
    amp: "&",
    lt: "<",
    gt: ">",
    quot: '"',
    apos: "'",
    nbsp: " ",
    ndash: "-",
    mdash: "-",
  };

  return value
    .replace(/&#x([0-9a-f]+);/gi, (_, hex: string) =>
      String.fromCodePoint(Number.parseInt(hex, 16)),
    )
    .replace(/&#(\d+);/g, (_, code: string) =>
      String.fromCodePoint(Number.parseInt(code, 10)),
    )
    .replace(/&([a-z]+);/gi, (match, key: string) => named[key.toLowerCase()] ?? match);
}

export function cleanText(value: string | null | undefined): string {
  if (!value) return "";

  return decodeHtml(
    value
      .replace(/<script[\s\S]*?<\/script>/gi, " ")
      .replace(/<style[\s\S]*?<\/style>/gi, " ")
      .replace(/<br\s*\/?>/gi, "\n")
      .replace(/<\/p>/gi, "\n")
      .replace(/<[^>]+>/g, " ")
      .replace(/\s+/g, " ")
      .trim(),
  );
}

function absolutizeUrl(href: string): string {
  try {
    return new URL(href, CLEARIMPACT_BASE_URL).toString();
  } catch {
    return href;
  }
}

function extractLinks(html: string): PerformanceNarrative["links"] {
  const links: PerformanceNarrative["links"] = [];
  const anchorRegex = /<a\s+[^>]*href=["']([^"']+)["'][^>]*>([\s\S]*?)<\/a>/gi;
  let match = anchorRegex.exec(html);

  while (match) {
    links.push({
      href: absolutizeUrl(decodeHtml(match[1] ?? "")),
      text: cleanText(match[2] ?? "").slice(0, 240),
    });
    match = anchorRegex.exec(html);
  }

  return links;
}

function normalizeNoteKey(noteTypeName: string): PerformanceNoteKey | null {
  const normalized = cleanText(noteTypeName).toLowerCase();

  if (normalized.includes("why is this important")) return "why_is_this_important";
  if (normalized.includes("what do the numbers show")) return "what_do_the_numbers_show";
  if (normalized.includes("how did we arrive")) return "how_did_we_arrive";
  if (normalized.includes("where can i find more information")) {
    return "where_can_i_find_more_information";
  }

  return null;
}

function asRecord(value: unknown): Record<string, unknown> {
  return value && typeof value === "object" && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : {};
}

function stringFrom(record: Record<string, unknown>, keys: string[]): string | null {
  for (const key of keys) {
    const value = record[key];
    if (value === null || value === undefined) continue;
    const text = cleanText(String(value));
    if (text.length > 0) return text;
  }
  return null;
}

function numberFrom(value: unknown): number | null {
  if (typeof value === "number" && Number.isFinite(value)) return value;
  if (typeof value === "string" && value.trim() !== "") {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : null;
  }
  return null;
}

function trendFrom(value: Record<string, unknown>, polarity: number | null): PerformanceTrend {
  const currentTrend = asRecord(value.CurrentTrend ?? value.currentTrend);
  const rawDirection = numberFrom(currentTrend.Item1 ?? currentTrend.item1);
  const periods = numberFrom(currentTrend.Item2 ?? currentTrend.item2);
  const direction =
    rawDirection === null
      ? "unknown"
      : rawDirection > 0
        ? "up"
        : rawDirection < 0
          ? "down"
          : "flat";

  let tone: PerformanceTrend["tone"] = "unknown";
  if (direction === "flat") {
    tone = "neutral";
  } else if (direction !== "unknown" && polarity !== null) {
    if (polarity === 2 || polarity === -1) {
      tone = direction === "down" ? "positive" : "negative";
    } else {
      tone = direction === "up" ? "positive" : "negative";
    }
  }

  return {
    direction,
    tone,
    periods,
    rawDirection,
  };
}

function parseMetricType(block: string): PerformanceMetricType {
  const labelMatch = block.match(/<span[^>]*>\s*(PM|I)\s*<\/span>/i);
  const label = labelMatch?.[1]?.toUpperCase();

  if (label === "PM") return "Performance Measure";
  if (label === "I") return "Indicator";
  return "Measure";
}

function extractOne(block: string, pattern: RegExp): string | null {
  const match = block.match(pattern);
  return match?.[1] ? cleanText(match[1]) : null;
}

function extractContainerIds(scorecardHtml: string, scorecardId: string): string[] {
  const ids: string[] = [];
  const seen = new Set<string>();
  const regex = /ProgramContainer[^>]*data-id=["'](\d+)["'][^>]*data-scorecardid=["'](\d+)["']/gi;
  let match = regex.exec(scorecardHtml);

  while (match) {
    const containerId = match[1];
    const discoveredScorecardId = match[2];
    if (discoveredScorecardId === scorecardId && !seen.has(containerId)) {
      seen.add(containerId);
      ids.push(containerId);
    }
    match = regex.exec(scorecardHtml);
  }

  return ids;
}

function parseContainerCallback(text: string): ContainerCallbackItem[] {
  const trimmed = text.trim();
  const start = trimmed.indexOf("(");
  const end = trimmed.lastIndexOf(")");
  const jsonText =
    trimmed.startsWith("universalCallback") && start !== -1 && end !== -1
      ? trimmed.slice(start + 1, end)
      : trimmed;
  const parsed = JSON.parse(jsonText) as unknown;

  return Array.isArray(parsed) ? (parsed as ContainerCallbackItem[]) : [];
}

function extractContainerTitle(containerHtml: string, fallback: string): string {
  return (
    extractOne(
      containerHtml,
      /<a\s+href=["']\/Container\/Details\/\d+["'][^>]*>([\s\S]*?)<\/a>/i,
    ) ?? fallback
  );
}

function extractMeasureSummaries(containerHtml: string): MeasureSummary[] {
  const starts: Array<{ index: number; measureId: string }> = [];
  const marker = /<div\s+class=["']PerfMeasure_(\d+)/gi;
  let match = marker.exec(containerHtml);

  while (match) {
    starts.push({ index: match.index, measureId: match[1] });
    match = marker.exec(containerHtml);
  }

  const summaries: MeasureSummary[] = [];

  for (const [index, start] of starts.entries()) {
    const next = starts[index + 1]?.index ?? containerHtml.length;
    const block = containerHtml.slice(start.index, next);
    const valueId = extractOne(block, /data-valueid=["'](\d+)["']/i);
    const title = extractOne(
      block,
      /<a\s+href=["']\/Measure\/Details\/\d+["'][^>]*>([\s\S]*?)<\/a>/i,
    );

    if (!valueId || !title) continue;

    summaries.push({
      measureId: start.measureId,
      valueId,
      title,
      metricType: parseMetricType(block),
      latestPeriod: extractOne(
        block,
        /<div\s+class=["']sc-timeperiod[^"']*["'][^>]*>\s*<div[^>]*>([\s\S]*?)<\/div>/i,
      ),
      latestActual: extractOne(
        block,
        /<div\s+class=["']sc-actualvalue[^"']*["'][^>]*>\s*<div[^>]*>([\s\S]*?)<\/div>/i,
      ),
      metadata: {
        clearImpactBlockTitle: title,
      },
    });
  }

  return summaries;
}

function normalizeValue(rawValue: unknown, sortOrder: number): PerformanceMeasureValue {
  const raw = asRecord(rawValue);
  const trend = asRecord(raw.CurrentTrend ?? raw.currentTrend);

  return {
    timePeriodId: stringFrom(raw, ["TimePeriodID", "TimePeriodId", "timePeriodId", "ID"]),
    timePeriod: stringFrom(raw, ["TimePeriod", "TimePeriodName", "Period", "Label"]) ?? "Unknown",
    sortOrder,
    actualValue: stringFrom(raw, ["ActualValue", "actualValue", "Value"]),
    targetValue: stringFrom(raw, ["TargetValue", "targetValue"]),
    forecastValue: stringFrom(raw, ["ForecastValue", "forecastValue"]),
    varianceFromTarget: stringFrom(raw, ["VarianceFromTarget", "varianceFromTarget"]),
    percentage: stringFrom(raw, ["Percentage", "percentage"]),
    percentChangeFromPrior: stringFrom(raw, [
      "PercentChangeFromPrior",
      "PercentChangeFromPrevious",
      "percentChangeFromPrior",
    ]),
    baselineChange: stringFrom(raw, ["BaselineChange", "baselineChange"]),
    currentTrendDirection: numberFrom(trend.Item1 ?? trend.item1),
    currentTrendPeriods: numberFrom(trend.Item2 ?? trend.item2),
    actualValueColor: raw.ActualValueColor ?? raw.actualValueColor ?? null,
    rawValue: raw,
  };
}

function normalizeNarratives(additionalData: Record<string, unknown>): PerformanceMetric["narratives"] {
  const notes = Array.isArray(additionalData.Notes) ? additionalData.Notes : [];
  const narratives: PerformanceMetric["narratives"] = {};

  for (const note of notes) {
    const record = asRecord(note);
    const title = stringFrom(record, ["NoteTypeName", "noteTypeName", "Title"]) ?? "";
    const key = normalizeNoteKey(title);
    if (!key || !PERFORMANCE_NOTE_KEYS.includes(key)) continue;

    const html =
      typeof record.Note === "string"
        ? record.Note
        : typeof record.NoteText === "string"
          ? record.NoteText
        : typeof record.Value === "string"
          ? record.Value
          : typeof record.Text === "string"
            ? record.Text
            : "";

    narratives[key] = {
      key,
      title,
      html,
      text: cleanText(html),
      links: extractLinks(html),
    };
  }

  return narratives;
}

async function fetchText(fetchImpl: FetchLike, url: string): Promise<string> {
  const response = await fetchImpl(url, {
    headers: { accept: "text/html,application/json;q=0.9,*/*;q=0.8" },
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(`ClearImpact request failed ${response.status} for ${url}`);
  }

  return response.text();
}

async function fetchJson(fetchImpl: FetchLike, url: string): Promise<Record<string, unknown>> {
  const text = await fetchText(fetchImpl, url);
  return JSON.parse(text) as Record<string, unknown>;
}

function mergeMetricLocation(
  metric: PerformanceMetric,
  scorecardId: string,
  containerId: string,
): void {
  if (!metric.scorecardIds.includes(scorecardId)) metric.scorecardIds.push(scorecardId);
  if (!metric.containerIds.includes(containerId)) metric.containerIds.push(containerId);
}

function buildMetricFromAdditionalData(
  summary: MeasureSummary,
  scorecardId: string,
  containerId: string,
  additionalData: Record<string, unknown>,
  fetchedAt: string,
): PerformanceMetric {
  const values = Array.isArray(additionalData.Values)
    ? additionalData.Values.map((value, index) => normalizeValue(value, index))
    : [];
  const latest = values[0];
  const polarity = numberFrom(additionalData.Polarity);
  const trend = trendFrom(latest?.rawValue ?? {}, polarity);

  return {
    measureId: summary.measureId,
    valueId: summary.valueId,
    title: summary.title,
    metricType: summary.metricType,
    scorecardIds: [scorecardId],
    containerIds: [containerId],
    latestPeriod: latest?.timePeriod ?? summary.latestPeriod,
    latestActual: latest?.actualValue ?? summary.latestActual,
    trend,
    polarity,
    sourceUrl: `${CLEARIMPACT_BASE_URL}/Measure/Details/${summary.measureId}`,
    additionalDataUrl: measureDataUrl(summary.valueId, summary.measureId),
    chartData: additionalData.ChartData ?? null,
    files: Array.isArray(additionalData.Files) ? additionalData.Files : [],
    values,
    narratives: normalizeNarratives(additionalData),
    metadata: {
      ...summary.metadata,
      graphType: additionalData.GraphType ?? null,
      graphComparison: additionalData.GraphComparison ?? null,
      displayTargetValues: additionalData.DisplayTargetValues ?? null,
      displayTrendline: additionalData.DisplayTrendline ?? null,
      hasDrillDown: additionalData.HasDrillDown ?? null,
    },
    lastFetchedAt: fetchedAt,
  };
}

export async function fetchPerformanceSnapshot(
  fetchImpl: FetchLike = fetch,
): Promise<PerformanceSnapshot> {
  const fetchedAt = nowIso();
  const rawPayloads: PerformanceRawPayload[] = [];
  const scorecards: PerformanceScorecard[] = [];
  const metricsById = new Map<string, PerformanceMetric>();
  const instances: PerformanceMeasureInstance[] = [];

  for (const config of PERFORMANCE_SCORECARDS) {
    const scorecardSourceUrl = scorecardEmbedUrl(config.scorecardId);
    const scorecardHtml = await fetchText(fetchImpl, scorecardSourceUrl);
    const scorecardRawKey = `scorecard:${config.scorecardId}:html`;
    rawPayloads.push({
      payloadKey: scorecardRawKey,
      payloadKind: "scorecard_html",
      sourceUrl: scorecardSourceUrl,
      contentText: scorecardHtml,
      fetchedAt,
    });

    const containerIds = extractContainerIds(scorecardHtml, config.scorecardId);
    const containers: PerformanceContainer[] = [];

    for (const [containerIndex, containerId] of containerIds.entries()) {
      const sourceUrl = containerUrl(containerId, config.scorecardId);
      const containerText = await fetchText(fetchImpl, sourceUrl);
      const containerPayload = parseContainerCallback(containerText);
      const containerHtml = containerPayload.map((item) => item.Value ?? "").join("\n");
      const containerRawKey = `container:${config.scorecardId}:${containerId}`;
      rawPayloads.push({
        payloadKey: containerRawKey,
        payloadKind: "container_payload",
        sourceUrl,
        contentText: containerText,
        contentJson: containerPayload,
        fetchedAt,
      });

      const containerTitle = extractContainerTitle(containerHtml, `Section ${containerIndex + 1}`);
      const summaries = extractMeasureSummaries(containerHtml);
      const containerMetrics: PerformanceMetric[] = [];

      for (const [metricIndex, summary] of summaries.entries()) {
        let metric = metricsById.get(summary.measureId);
        if (!metric) {
          const additionalDataUrl = measureDataUrl(summary.valueId, summary.measureId);
          const additionalData = await fetchJson(fetchImpl, additionalDataUrl);
          rawPayloads.push({
            payloadKey: `measure:${summary.measureId}:${summary.valueId}:additional`,
            payloadKind: "measure_json",
            sourceUrl: additionalDataUrl,
            contentJson: additionalData,
            fetchedAt,
          });
          metric = buildMetricFromAdditionalData(
            summary,
            config.scorecardId,
            containerId,
            additionalData,
            fetchedAt,
          );
          metricsById.set(summary.measureId, metric);
        } else {
          mergeMetricLocation(metric, config.scorecardId, containerId);
        }

        containerMetrics.push(metric);
        instances.push({
          scorecardId: config.scorecardId,
          containerId,
          measureId: summary.measureId,
          sortOrder: metricIndex,
        });
      }

      containers.push({
        containerId,
        scorecardId: config.scorecardId,
        title: containerTitle,
        sortOrder: containerIndex,
        sourceUrl,
        metrics: containerMetrics,
        rawPayloadKey: containerRawKey,
        lastFetchedAt: fetchedAt,
      });
    }

    scorecards.push({
      scorecardId: config.scorecardId,
      title: config.title,
      slug: config.slug,
      sourceUrl: scorecardSourceUrl,
      officialPath: config.officialPath,
      containers,
      rawPayloadKey: scorecardRawKey,
      lastFetchedAt: fetchedAt,
    });
  }

  const metrics = Array.from(metricsById.values()).sort((a, b) => a.title.localeCompare(b.title));
  const narrativeNotes = metrics.reduce(
    (total, metric) => total + Object.keys(metric.narratives).length,
    0,
  );

  return {
    parserVersion: PERFORMANCE_PARSER_VERSION,
    fetchedAt,
    source: PERFORMANCE_PORTLAND_URL,
    cacheStatus: "live_uncached",
    scorecards,
    metrics,
    instances,
    changes: [],
    counts: {
      scorecards: scorecards.length,
      containers: scorecards.reduce((total, scorecard) => total + scorecard.containers.length, 0),
      metricInstances: instances.length,
      uniqueMeasures: metrics.length,
      narrativeNotes,
    },
    rawPayloads,
  };
}

export function stripRawPayloads(snapshot: PerformanceSnapshot): PerformanceSnapshot {
  const { rawPayloads: _rawPayloads, ...publicSnapshot } = snapshot;
  return publicSnapshot;
}
