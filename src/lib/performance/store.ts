import { createHash } from "crypto";
import sql from "@/lib/db-query";
import { PERFORMANCE_SCORECARDS } from "./clearimpact";
import {
  PERFORMANCE_NOTE_KEYS,
  type PerformanceContainer,
  type PerformanceMeasureChange,
  type PerformanceMeasureInstance,
  type PerformanceMeasureValue,
  type PerformanceMetric,
  type PerformanceMetricType,
  type PerformanceNarrative,
  type PerformanceNoteKey,
  type PerformanceRawPayload,
  type PerformanceScorecard,
  type PerformanceSnapshot,
  type PerformanceTrend,
} from "./types";

type Row = Record<string, unknown>;

const SCHEMA_STATEMENTS = [
  "CREATE SCHEMA IF NOT EXISTS performance",
  `CREATE TABLE IF NOT EXISTS performance.ingest_runs (
    id serial PRIMARY KEY,
    started_at timestamp with time zone NOT NULL DEFAULT now(),
    finished_at timestamp with time zone,
    status text NOT NULL,
    parser_version text NOT NULL,
    scorecards_requested integer DEFAULT 0,
    scorecards_loaded integer DEFAULT 0,
    measure_instances_loaded integer DEFAULT 0,
    unique_measures_loaded integer DEFAULT 0,
    error text,
    metadata jsonb
  )`,
  `CREATE TABLE IF NOT EXISTS performance.raw_payloads (
    payload_key text PRIMARY KEY,
    payload_kind text NOT NULL,
    source_url text NOT NULL,
    content_text text,
    content_json jsonb,
    content_hash text NOT NULL,
    fetched_at timestamp with time zone NOT NULL DEFAULT now()
  )`,
  `CREATE TABLE IF NOT EXISTS performance.scorecards (
    scorecard_id text PRIMARY KEY,
    title text NOT NULL,
    slug text NOT NULL,
    source_url text NOT NULL,
    raw_payload_key text,
    last_fetched_at timestamp with time zone NOT NULL DEFAULT now(),
    metadata jsonb
  )`,
  `CREATE TABLE IF NOT EXISTS performance.containers (
    container_id text PRIMARY KEY,
    scorecard_id text NOT NULL REFERENCES performance.scorecards(scorecard_id) ON DELETE CASCADE,
    title text NOT NULL,
    sort_order integer NOT NULL DEFAULT 0,
    source_url text NOT NULL,
    raw_payload_key text,
    last_fetched_at timestamp with time zone NOT NULL DEFAULT now(),
    metadata jsonb
  )`,
  `CREATE TABLE IF NOT EXISTS performance.measures (
    measure_id text PRIMARY KEY,
    value_id text NOT NULL,
    title text NOT NULL,
    metric_type text NOT NULL,
    latest_period text,
    latest_actual text,
    latest_trend_direction text,
    latest_trend_tone text,
    latest_trend_periods integer,
    polarity integer,
    source_url text NOT NULL,
    additional_data_url text NOT NULL,
    chart_data jsonb,
    files jsonb,
    metadata jsonb,
    latest_changed_at timestamp with time zone,
    last_fetched_at timestamp with time zone NOT NULL DEFAULT now()
  )`,
  `CREATE TABLE IF NOT EXISTS performance.measure_instances (
    scorecard_id text NOT NULL REFERENCES performance.scorecards(scorecard_id) ON DELETE CASCADE,
    container_id text NOT NULL REFERENCES performance.containers(container_id) ON DELETE CASCADE,
    measure_id text NOT NULL REFERENCES performance.measures(measure_id) ON DELETE CASCADE,
    sort_order integer NOT NULL DEFAULT 0,
    PRIMARY KEY (scorecard_id, container_id, measure_id)
  )`,
  `CREATE TABLE IF NOT EXISTS performance.measure_values (
    id serial PRIMARY KEY,
    measure_id text NOT NULL REFERENCES performance.measures(measure_id) ON DELETE CASCADE,
    time_period_id text,
    time_period text NOT NULL,
    sort_order integer NOT NULL DEFAULT 0,
    actual_value text,
    target_value text,
    forecast_value text,
    variance_from_target text,
    percentage text,
    percent_change_from_prior text,
    baseline_change text,
    current_trend_direction integer,
    current_trend_periods integer,
    actual_value_color jsonb,
    raw_value jsonb
  )`,
  `CREATE TABLE IF NOT EXISTS performance.measure_notes (
    measure_id text NOT NULL REFERENCES performance.measures(measure_id) ON DELETE CASCADE,
    note_key text NOT NULL,
    note_title text NOT NULL,
    note_html text,
    note_text text,
    links jsonb,
    last_fetched_at timestamp with time zone NOT NULL DEFAULT now(),
    PRIMARY KEY (measure_id, note_key)
  )`,
  `CREATE TABLE IF NOT EXISTS performance.measure_changes (
    id serial PRIMARY KEY,
    run_id integer REFERENCES performance.ingest_runs(id) ON DELETE SET NULL,
    measure_id text NOT NULL REFERENCES performance.measures(measure_id) ON DELETE CASCADE,
    scorecard_id text,
    container_id text,
    change_type text NOT NULL,
    previous_period text,
    previous_actual text,
    new_period text,
    new_actual text,
    changed_at timestamp with time zone NOT NULL DEFAULT now()
  )`,
  "CREATE INDEX IF NOT EXISTS performance_containers_scorecard_idx ON performance.containers(scorecard_id)",
  "CREATE INDEX IF NOT EXISTS performance_measure_instances_measure_idx ON performance.measure_instances(measure_id)",
  "CREATE INDEX IF NOT EXISTS performance_measure_values_measure_idx ON performance.measure_values(measure_id, sort_order)",
  "CREATE INDEX IF NOT EXISTS performance_measure_changes_measure_idx ON performance.measure_changes(measure_id, changed_at DESC)",
];

let schemaReady = false;

function json(value: unknown) {
  return sql.json(value as Parameters<typeof sql.json>[0]);
}

function rowString(row: Row, key: string): string | null {
  const value = row[key];
  if (value === null || value === undefined) return null;
  return String(value);
}

function rowNumber(row: Row, key: string): number | null {
  const value = row[key];
  if (typeof value === "number" && Number.isFinite(value)) return value;
  if (typeof value === "string") {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : null;
  }
  return null;
}

function rowDate(row: Row, key: string): string | null {
  const value = row[key];
  if (!value) return null;
  if (value instanceof Date) return value.toISOString();
  const date = new Date(String(value));
  return Number.isNaN(date.getTime()) ? null : date.toISOString();
}

function hashPayload(payload: PerformanceRawPayload): string {
  const source =
    payload.contentText ??
    (payload.contentJson === undefined ? "" : JSON.stringify(payload.contentJson));
  return createHash("sha256").update(source).digest("hex");
}

function trendFromRow(row: Row): PerformanceTrend {
  const direction = rowString(row, "latest_trend_direction");
  const tone = rowString(row, "latest_trend_tone");

  return {
    direction:
      direction === "up" || direction === "down" || direction === "flat"
        ? direction
        : "unknown",
    tone:
      tone === "positive" || tone === "negative" || tone === "neutral" ? tone : "unknown",
    periods: rowNumber(row, "latest_trend_periods"),
    rawDirection: null,
  };
}

function officialPath(scorecardId: string): string {
  return (
    PERFORMANCE_SCORECARDS.find((scorecard) => scorecard.scorecardId === scorecardId)
      ?.officialPath ?? "https://www.portland.gov/performance"
  );
}

export async function ensurePerformanceSchema(): Promise<void> {
  if (schemaReady) return;
  for (const statement of SCHEMA_STATEMENTS) {
    await sql.unsafe(statement);
  }
  schemaReady = true;
}

async function insertRawPayload(payload: PerformanceRawPayload): Promise<void> {
  const contentHash = hashPayload(payload);
  const contentText = payload.contentText ?? null;
  const contentJson = payload.contentJson === undefined ? null : json(payload.contentJson);

  await sql`
    INSERT INTO performance.raw_payloads (
      payload_key,
      payload_kind,
      source_url,
      content_text,
      content_json,
      content_hash,
      fetched_at
    )
    VALUES (
      ${payload.payloadKey},
      ${payload.payloadKind},
      ${payload.sourceUrl},
      ${contentText},
      ${contentJson},
      ${contentHash},
      ${payload.fetchedAt}
    )
    ON CONFLICT (payload_key)
    DO UPDATE SET
      payload_kind = EXCLUDED.payload_kind,
      source_url = EXCLUDED.source_url,
      content_text = EXCLUDED.content_text,
      content_json = EXCLUDED.content_json,
      content_hash = EXCLUDED.content_hash,
      fetched_at = EXCLUDED.fetched_at
  `;
}

async function upsertScorecard(scorecard: PerformanceScorecard): Promise<void> {
  await sql`
    INSERT INTO performance.scorecards (
      scorecard_id,
      title,
      slug,
      source_url,
      raw_payload_key,
      last_fetched_at,
      metadata
    )
    VALUES (
      ${scorecard.scorecardId},
      ${scorecard.title},
      ${scorecard.slug},
      ${scorecard.sourceUrl},
      ${scorecard.rawPayloadKey ?? null},
      ${scorecard.lastFetchedAt},
      ${json({ officialPath: scorecard.officialPath })}
    )
    ON CONFLICT (scorecard_id)
    DO UPDATE SET
      title = EXCLUDED.title,
      slug = EXCLUDED.slug,
      source_url = EXCLUDED.source_url,
      raw_payload_key = EXCLUDED.raw_payload_key,
      last_fetched_at = EXCLUDED.last_fetched_at,
      metadata = EXCLUDED.metadata
  `;
}

async function upsertContainer(container: PerformanceContainer): Promise<void> {
  await sql`
    INSERT INTO performance.containers (
      container_id,
      scorecard_id,
      title,
      sort_order,
      source_url,
      raw_payload_key,
      last_fetched_at,
      metadata
    )
    VALUES (
      ${container.containerId},
      ${container.scorecardId},
      ${container.title},
      ${container.sortOrder},
      ${container.sourceUrl},
      ${container.rawPayloadKey ?? null},
      ${container.lastFetchedAt},
      ${json({ metricCount: container.metrics.length })}
    )
    ON CONFLICT (container_id)
    DO UPDATE SET
      scorecard_id = EXCLUDED.scorecard_id,
      title = EXCLUDED.title,
      sort_order = EXCLUDED.sort_order,
      source_url = EXCLUDED.source_url,
      raw_payload_key = EXCLUDED.raw_payload_key,
      last_fetched_at = EXCLUDED.last_fetched_at,
      metadata = EXCLUDED.metadata
  `;
}

async function recordMeasureChange(
  runId: number,
  metric: PerformanceMetric,
): Promise<string | null> {
  const rows = (await sql`
    SELECT latest_period, latest_actual
    FROM performance.measures
    WHERE measure_id = ${metric.measureId}
  `) as Row[];

  if (rows.length === 0) return null;

  const previous = rows[0];
  const previousPeriod = rowString(previous, "latest_period");
  const previousActual = rowString(previous, "latest_actual");
  const changed =
    previousPeriod !== metric.latestPeriod || previousActual !== metric.latestActual;

  if (!changed) return rowDate(previous, "latest_changed_at");

  const changedAt = new Date().toISOString();
  await sql`
    INSERT INTO performance.measure_changes (
      run_id,
      measure_id,
      scorecard_id,
      container_id,
      change_type,
      previous_period,
      previous_actual,
      new_period,
      new_actual,
      changed_at
    )
    VALUES (
      ${runId},
      ${metric.measureId},
      ${metric.scorecardIds[0] ?? null},
      ${metric.containerIds[0] ?? null},
      'latest_value',
      ${previousPeriod},
      ${previousActual},
      ${metric.latestPeriod},
      ${metric.latestActual},
      ${changedAt}
    )
  `;

  return changedAt;
}

async function upsertMetric(runId: number, metric: PerformanceMetric): Promise<void> {
  const latestChangedAt = await recordMeasureChange(runId, metric);

  await sql`
    INSERT INTO performance.measures (
      measure_id,
      value_id,
      title,
      metric_type,
      latest_period,
      latest_actual,
      latest_trend_direction,
      latest_trend_tone,
      latest_trend_periods,
      polarity,
      source_url,
      additional_data_url,
      chart_data,
      files,
      metadata,
      latest_changed_at,
      last_fetched_at
    )
    VALUES (
      ${metric.measureId},
      ${metric.valueId},
      ${metric.title},
      ${metric.metricType},
      ${metric.latestPeriod},
      ${metric.latestActual},
      ${metric.trend.direction},
      ${metric.trend.tone},
      ${metric.trend.periods},
      ${metric.polarity},
      ${metric.sourceUrl},
      ${metric.additionalDataUrl},
      ${json(metric.chartData ?? null)},
      ${json(metric.files ?? [])},
      ${json({
        ...metric.metadata,
        scorecardIds: metric.scorecardIds,
        containerIds: metric.containerIds,
      })},
      ${latestChangedAt ?? metric.latestChangedAt ?? null},
      ${metric.lastFetchedAt}
    )
    ON CONFLICT (measure_id)
    DO UPDATE SET
      value_id = EXCLUDED.value_id,
      title = EXCLUDED.title,
      metric_type = EXCLUDED.metric_type,
      latest_period = EXCLUDED.latest_period,
      latest_actual = EXCLUDED.latest_actual,
      latest_trend_direction = EXCLUDED.latest_trend_direction,
      latest_trend_tone = EXCLUDED.latest_trend_tone,
      latest_trend_periods = EXCLUDED.latest_trend_periods,
      polarity = EXCLUDED.polarity,
      source_url = EXCLUDED.source_url,
      additional_data_url = EXCLUDED.additional_data_url,
      chart_data = EXCLUDED.chart_data,
      files = EXCLUDED.files,
      metadata = EXCLUDED.metadata,
      latest_changed_at = COALESCE(EXCLUDED.latest_changed_at, performance.measures.latest_changed_at),
      last_fetched_at = EXCLUDED.last_fetched_at
  `;

  await sql`DELETE FROM performance.measure_values WHERE measure_id = ${metric.measureId}`;
  for (const value of metric.values) {
    await insertMeasureValue(metric.measureId, value);
  }

  await sql`DELETE FROM performance.measure_notes WHERE measure_id = ${metric.measureId}`;
  for (const narrative of Object.values(metric.narratives)) {
    if (narrative) {
      await insertNarrative(metric.measureId, narrative, metric.lastFetchedAt);
    }
  }
}

async function insertMeasureValue(
  measureId: string,
  value: PerformanceMeasureValue,
): Promise<void> {
  await sql`
    INSERT INTO performance.measure_values (
      measure_id,
      time_period_id,
      time_period,
      sort_order,
      actual_value,
      target_value,
      forecast_value,
      variance_from_target,
      percentage,
      percent_change_from_prior,
      baseline_change,
      current_trend_direction,
      current_trend_periods,
      actual_value_color,
      raw_value
    )
    VALUES (
      ${measureId},
      ${value.timePeriodId},
      ${value.timePeriod},
      ${value.sortOrder},
      ${value.actualValue},
      ${value.targetValue},
      ${value.forecastValue},
      ${value.varianceFromTarget},
      ${value.percentage},
      ${value.percentChangeFromPrior},
      ${value.baselineChange},
      ${value.currentTrendDirection},
      ${value.currentTrendPeriods},
      ${json(value.actualValueColor ?? null)},
      ${json(value.rawValue)}
    )
  `;
}

async function insertNarrative(
  measureId: string,
  narrative: PerformanceNarrative,
  lastFetchedAt: string,
): Promise<void> {
  await sql`
    INSERT INTO performance.measure_notes (
      measure_id,
      note_key,
      note_title,
      note_html,
      note_text,
      links,
      last_fetched_at
    )
    VALUES (
      ${measureId},
      ${narrative.key},
      ${narrative.title},
      ${narrative.html},
      ${narrative.text},
      ${json(narrative.links)},
      ${lastFetchedAt}
    )
    ON CONFLICT (measure_id, note_key)
    DO UPDATE SET
      note_title = EXCLUDED.note_title,
      note_html = EXCLUDED.note_html,
      note_text = EXCLUDED.note_text,
      links = EXCLUDED.links,
      last_fetched_at = EXCLUDED.last_fetched_at
  `;
}

async function insertInstance(instance: PerformanceMeasureInstance): Promise<void> {
  await sql`
    INSERT INTO performance.measure_instances (
      scorecard_id,
      container_id,
      measure_id,
      sort_order
    )
    VALUES (
      ${instance.scorecardId},
      ${instance.containerId},
      ${instance.measureId},
      ${instance.sortOrder}
    )
    ON CONFLICT (scorecard_id, container_id, measure_id)
    DO UPDATE SET sort_order = EXCLUDED.sort_order
  `;
}

export async function savePerformanceSnapshot(snapshot: PerformanceSnapshot): Promise<number> {
  await ensurePerformanceSchema();

  const runRows = (await sql`
    INSERT INTO performance.ingest_runs (
      status,
      parser_version,
      scorecards_requested,
      scorecards_loaded,
      measure_instances_loaded,
      unique_measures_loaded,
      metadata
    )
    VALUES (
      'running',
      ${snapshot.parserVersion},
      ${PERFORMANCE_SCORECARDS.length},
      0,
      0,
      0,
      ${json({ source: snapshot.source })}
    )
    RETURNING id
  `) as Row[];
  const runId = Number(runRows[0]?.id);

  try {
    for (const payload of snapshot.rawPayloads ?? []) {
      await insertRawPayload(payload);
    }

    for (const scorecard of snapshot.scorecards) {
      await upsertScorecard(scorecard);
      for (const container of scorecard.containers) {
        await upsertContainer(container);
      }
    }

    for (const metric of snapshot.metrics) {
      await upsertMetric(runId, metric);
    }

    await sql`DELETE FROM performance.measure_instances`;
    for (const instance of snapshot.instances) {
      await insertInstance(instance);
    }

    await sql`
      UPDATE performance.ingest_runs
      SET
        status = 'success',
        finished_at = NOW(),
        scorecards_loaded = ${snapshot.counts.scorecards},
        measure_instances_loaded = ${snapshot.counts.metricInstances},
        unique_measures_loaded = ${snapshot.counts.uniqueMeasures},
        metadata = ${json(snapshot.counts)}
      WHERE id = ${runId}
    `;

    return runId;
  } catch (error) {
    await sql`
      UPDATE performance.ingest_runs
      SET
        status = 'error',
        finished_at = NOW(),
        error = ${error instanceof Error ? error.message : String(error)}
      WHERE id = ${runId}
    `;
    throw error;
  }
}

function groupBy<T>(items: T[], keyFn: (item: T) => string): Map<string, T[]> {
  const grouped = new Map<string, T[]>();
  for (const item of items) {
    const key = keyFn(item);
    grouped.set(key, [...(grouped.get(key) ?? []), item]);
  }
  return grouped;
}

function normalizeMetricType(value: string | null): PerformanceMetricType {
  if (value === "Indicator" || value === "Performance Measure" || value === "Measure") {
    return value;
  }
  return "Measure";
}

function metricFromRow(
  row: Row,
  values: PerformanceMeasureValue[],
  narratives: PerformanceMetric["narratives"],
  instances: PerformanceMeasureInstance[],
): PerformanceMetric {
  return {
    measureId: rowString(row, "measure_id") ?? "",
    valueId: rowString(row, "value_id") ?? "",
    title: rowString(row, "title") ?? "Untitled metric",
    metricType: normalizeMetricType(rowString(row, "metric_type")),
    scorecardIds: Array.from(new Set(instances.map((instance) => instance.scorecardId))),
    containerIds: Array.from(new Set(instances.map((instance) => instance.containerId))),
    latestPeriod: rowString(row, "latest_period"),
    latestActual: rowString(row, "latest_actual"),
    trend: trendFromRow(row),
    polarity: rowNumber(row, "polarity"),
    sourceUrl: rowString(row, "source_url") ?? "",
    additionalDataUrl: rowString(row, "additional_data_url") ?? "",
    chartData: row.chart_data ?? null,
    files: Array.isArray(row.files) ? row.files : [],
    values,
    narratives,
    metadata: asRecord(row.metadata),
    lastFetchedAt: rowDate(row, "last_fetched_at") ?? new Date().toISOString(),
    latestChangedAt: rowDate(row, "latest_changed_at"),
  };
}

function asRecord(value: unknown): Record<string, unknown> {
  return value && typeof value === "object" && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : {};
}

function valueFromRow(row: Row): PerformanceMeasureValue {
  return {
    timePeriodId: rowString(row, "time_period_id"),
    timePeriod: rowString(row, "time_period") ?? "Unknown",
    sortOrder: rowNumber(row, "sort_order") ?? 0,
    actualValue: rowString(row, "actual_value"),
    targetValue: rowString(row, "target_value"),
    forecastValue: rowString(row, "forecast_value"),
    varianceFromTarget: rowString(row, "variance_from_target"),
    percentage: rowString(row, "percentage"),
    percentChangeFromPrior: rowString(row, "percent_change_from_prior"),
    baselineChange: rowString(row, "baseline_change"),
    currentTrendDirection: rowNumber(row, "current_trend_direction"),
    currentTrendPeriods: rowNumber(row, "current_trend_periods"),
    actualValueColor: row.actual_value_color ?? null,
    rawValue: asRecord(row.raw_value),
  };
}

function changeFromRow(row: Row): PerformanceMeasureChange {
  return {
    id: rowNumber(row, "id") ?? undefined,
    runId: rowNumber(row, "run_id"),
    measureId: rowString(row, "measure_id") ?? "",
    scorecardId: rowString(row, "scorecard_id"),
    containerId: rowString(row, "container_id"),
    changeType: rowString(row, "change_type") ?? "latest_value",
    previousPeriod: rowString(row, "previous_period"),
    previousActual: rowString(row, "previous_actual"),
    newPeriod: rowString(row, "new_period"),
    newActual: rowString(row, "new_actual"),
    changedAt: rowDate(row, "changed_at") ?? new Date().toISOString(),
  };
}

export async function loadPerformanceSnapshotFromDb(): Promise<PerformanceSnapshot | null> {
  try {
    await ensurePerformanceSchema();

    const scorecardRows = (await sql`
      SELECT *
      FROM performance.scorecards
      ORDER BY scorecard_id
    `) as Row[];
    if (scorecardRows.length === 0) return null;

    const containerRows = (await sql`
      SELECT *
      FROM performance.containers
      ORDER BY scorecard_id, sort_order, title
    `) as Row[];
    const measureRows = (await sql`
      SELECT *
      FROM performance.measures
      ORDER BY title
    `) as Row[];
    const instanceRows = (await sql`
      SELECT *
      FROM performance.measure_instances
      ORDER BY scorecard_id, container_id, sort_order
    `) as Row[];
    const valueRows = (await sql`
      SELECT *
      FROM performance.measure_values
      ORDER BY measure_id, sort_order
    `) as Row[];
    const noteRows = (await sql`
      SELECT *
      FROM performance.measure_notes
      ORDER BY measure_id, note_key
    `) as Row[];
    const changeRows = (await sql`
      SELECT *
      FROM performance.measure_changes
      ORDER BY changed_at DESC
      LIMIT 100
    `) as Row[];

    const instances: PerformanceMeasureInstance[] = instanceRows.map((row) => ({
      scorecardId: rowString(row, "scorecard_id") ?? "",
      containerId: rowString(row, "container_id") ?? "",
      measureId: rowString(row, "measure_id") ?? "",
      sortOrder: rowNumber(row, "sort_order") ?? 0,
    }));
    const instancesByMeasure = groupBy(instances, (instance) => instance.measureId);
    const valuesByMeasure = groupBy(valueRows, (row) => rowString(row, "measure_id") ?? "");
    const notesByMeasure = groupBy(noteRows, (row) => rowString(row, "measure_id") ?? "");

    const metricsById = new Map<string, PerformanceMetric>();
    for (const row of measureRows) {
      const measureId = rowString(row, "measure_id") ?? "";
      const notes: PerformanceMetric["narratives"] = {};
      for (const noteRow of notesByMeasure.get(measureId) ?? []) {
        const key = rowString(noteRow, "note_key") as PerformanceNoteKey | null;
        if (!key || !PERFORMANCE_NOTE_KEYS.includes(key)) continue;
        notes[key] = {
          key,
          title: rowString(noteRow, "note_title") ?? key,
          html: rowString(noteRow, "note_html") ?? "",
          text: rowString(noteRow, "note_text") ?? "",
          links: Array.isArray(noteRow.links) ? noteRow.links : [],
        };
      }

      const metric = metricFromRow(
        row,
        (valuesByMeasure.get(measureId) ?? []).map(valueFromRow),
        notes,
        instancesByMeasure.get(measureId) ?? [],
      );
      metricsById.set(measureId, metric);
    }

    const scorecards: PerformanceScorecard[] = scorecardRows.map((scorecardRow) => {
      const scorecardId = rowString(scorecardRow, "scorecard_id") ?? "";
      const containers: PerformanceContainer[] = containerRows
        .filter((containerRow) => rowString(containerRow, "scorecard_id") === scorecardId)
        .map((containerRow) => {
          const containerId = rowString(containerRow, "container_id") ?? "";
          const containerInstances = instances
            .filter((instance) => instance.containerId === containerId)
            .sort((a, b) => a.sortOrder - b.sortOrder);
          const metrics = containerInstances
            .map((instance) => metricsById.get(instance.measureId))
            .filter((metric): metric is PerformanceMetric => metric !== undefined);

          return {
            containerId,
            scorecardId,
            title: rowString(containerRow, "title") ?? "Untitled section",
            sortOrder: rowNumber(containerRow, "sort_order") ?? 0,
            sourceUrl: rowString(containerRow, "source_url") ?? "",
            metrics,
            rawPayloadKey: rowString(containerRow, "raw_payload_key") ?? undefined,
            lastFetchedAt: rowDate(containerRow, "last_fetched_at") ?? new Date().toISOString(),
          };
        });

      return {
        scorecardId,
        title: rowString(scorecardRow, "title") ?? "Untitled scorecard",
        slug: rowString(scorecardRow, "slug") ?? scorecardId,
        sourceUrl: rowString(scorecardRow, "source_url") ?? "",
        officialPath: officialPath(scorecardId),
        containers,
        rawPayloadKey: rowString(scorecardRow, "raw_payload_key") ?? undefined,
        lastFetchedAt: rowDate(scorecardRow, "last_fetched_at") ?? new Date().toISOString(),
      };
    });

    const metrics = Array.from(metricsById.values()).sort((a, b) => a.title.localeCompare(b.title));
    const fetchedAt =
      metrics
        .map((metric) => new Date(metric.lastFetchedAt).getTime())
        .filter(Number.isFinite)
        .sort((a, b) => b - a)[0] ?? Date.now();

    return {
      parserVersion: "cached",
      fetchedAt: new Date(fetchedAt).toISOString(),
      source: "https://www.portland.gov/performance",
      cacheStatus: "cached",
      scorecards,
      metrics,
      instances,
      changes: changeRows.map(changeFromRow),
      counts: {
        scorecards: scorecards.length,
        containers: containerRows.length,
        metricInstances: instances.length,
        uniqueMeasures: metrics.length,
        narrativeNotes: metrics.reduce(
          (total, metric) => total + Object.keys(metric.narratives).length,
          0,
        ),
      },
    };
  } catch (error) {
    console.warn(
      "[performance] cache read failed:",
      error instanceof Error ? error.message : error,
    );
    return null;
  }
}

export async function loadPerformanceMetricFromDb(
  measureId: string,
): Promise<PerformanceMetric | null> {
  const snapshot = await loadPerformanceSnapshotFromDb();
  return snapshot?.metrics.find((metric) => metric.measureId === measureId) ?? null;
}

function csvEscape(value: unknown): string {
  const text = value === null || value === undefined ? "" : String(value);
  return /[",\n]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text;
}

export function snapshotToCsv(snapshot: PerformanceSnapshot, measureId?: string): string {
  const headers = [
    "scorecard_id",
    "scorecard_title",
    "section_id",
    "section_title",
    "measure_id",
    "value_id",
    "metric_type",
    "metric_title",
    "latest_period",
    "latest_actual",
    "time_period",
    "actual_value",
    "target_value",
    "trend_direction",
    "why_is_this_important",
    "what_do_the_numbers_show",
    "how_did_we_arrive",
    "where_can_i_find_more_information",
    "source_url",
    "additional_data_url",
  ];
  const rows = [headers];

  for (const scorecard of snapshot.scorecards) {
    for (const container of scorecard.containers) {
      for (const metric of container.metrics) {
        if (measureId && metric.measureId !== measureId) continue;
        const values = metric.values.length > 0 ? metric.values : [null];
        for (const value of values) {
          rows.push([
            scorecard.scorecardId,
            scorecard.title,
            container.containerId,
            container.title,
            metric.measureId,
            metric.valueId,
            metric.metricType,
            metric.title,
            metric.latestPeriod ?? "",
            metric.latestActual ?? "",
            value?.timePeriod ?? "",
            value?.actualValue ?? "",
            value?.targetValue ?? "",
            metric.trend.direction,
            metric.narratives.why_is_this_important?.text ?? "",
            metric.narratives.what_do_the_numbers_show?.text ?? "",
            metric.narratives.how_did_we_arrive?.text ?? "",
            metric.narratives.where_can_i_find_more_information?.text ?? "",
            metric.sourceUrl,
            metric.additionalDataUrl,
          ]);
        }
      }
    }
  }

  return rows.map((row) => row.map(csvEscape).join(",")).join("\n");
}
