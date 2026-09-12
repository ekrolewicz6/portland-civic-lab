"use client";
import dynamic from "next/dynamic";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  ArrowDownToLine,
  ArrowUpRight,
  Search,
  X,
  MapPin,
  Layers,
  ChevronRight,
} from "lucide-react";
import type { Geometry } from "geojson";
import type {
  FireRecord,
  RecordResult,
  SourceCoverage,
} from "@/lib/oregon-fire/types";
import LandscapeControls, { type ScarSettings } from "./LandscapeControls";
import type { LandscapeResult } from "@/lib/oregon-fire/landscape";
import { SOURCE_BY_ID } from "@/lib/oregon-fire/sources";

const Map = dynamic(() => import("./FireMap"), {
  ssr: false,
  loading: () => (
    <div className="fire-map fire-map-loading">Loading the map…</div>
  ),
});
type Detail = {
  record: FireRecord;
  geometry: Geometry;
  observedAt: string;
  history: { status: string; observed_at: string }[];
  related: FireRecord[];
  explanations: {
    title: string;
    body: string;
    source_url: string;
    attribution: string;
  }[];
};
const initial = {
  from: "2021",
  to: String(new Date().getFullYear()),
  kind: "prescribed",
  q: "",
  agency: "",
  method: "",
  purpose: "",
  status: "",
  bbox: "-124.9,41.8,-116.3,46.4",
  zoom: "6",
  cursor: "0",
  selected: "",
  scars: "1",
  scarYears: "5",
  scarEnd: String(new Date().getFullYear()),
  scarMode: "age",
  markers: "1",
};
type Filters = typeof initial;
function when(r: FireRecord) {
  if (!r.date) return r.year ? `${r.year} · year only` : "Date not reported";
  if (r.datePrecision === "year") return `${r.year} · year only`;
  if (r.datePrecision === "month") return `${r.date.slice(0, 7)} · month only`;
  if (r.datePrecision === "unknown") return "Date precision not reported";
  return new Date(r.date).toLocaleDateString("en-US", {
    timeZone: "UTC",
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}
function area(value: number | null) {
  return value === null
    ? "Not reported"
    : `${value.toLocaleString(undefined, { maximumFractionDigits: 1 })} acres`;
}
export default function FireExplorer({
  sources,
}: {
  sources: SourceCoverage[];
}) {
  const [filters, setFilters] = useState<Filters>(initial),
    [ready, setReady] = useState(false),
    [result, setResult] = useState<RecordResult | null>(null),
    [loading, setLoading] = useState(true),
    [error, setError] = useState(""),
    [detail, setDetail] = useState<Detail | null>(null),
    [detailError, setDetailError] = useState("");
  const [landscape, setLandscape] = useState<LandscapeResult | null>(null);
  const [scarLoading, setScarLoading] = useState(true);
  const [scarError, setScarError] = useState("");
  const [severityState, setSeverityState] = useState("loading");
  const changeScars = useCallback((patch: Partial<ScarSettings>) => {
    setFilters((f) => ({ ...f, ...patch }));
    setSeverityState("loading");
  }, []);
  useEffect(() => {
    if (!ready || filters.scars !== "1") return;
    const c = new AbortController();
    setScarLoading(true);
    setScarError("");
    const p = new URLSearchParams({
      bbox: filters.bbox,
      zoom: filters.zoom,
      years: filters.scarMode === "severity" ? "1" : filters.scarYears,
      end: filters.scarEnd,
    });
    const timer = setTimeout(() => {
      fetch(`/api/oregon-fire/landscape?${p}`, { signal: c.signal })
        .then(async (r) => {
          const d = await r.json();
          if (!r.ok) throw new Error(d.error);
          setLandscape(d);
        })
        .catch((e) => {
          if (!c.signal.aborted) {
            setScarError(e.message);
            setLandscape(null);
          }
        })
        .finally(() => {
          if (!c.signal.aborted) setScarLoading(false);
        });
    }, 200);
    return () => {
      clearTimeout(timer);
      c.abort();
    };
  }, [
    ready,
    filters.scars,
    filters.scarYears,
    filters.scarEnd,
    filters.scarMode,
    filters.bbox,
    filters.zoom,
  ]);
  const detailRef = useRef<HTMLDivElement>(null);
  const [mapGeneration, setMapGeneration] = useState(0);
  useEffect(() => {
    const read = () => {
      const p = new URLSearchParams(window.location.search);
      const next = {
        ...initial,
        ...Object.fromEntries(
          [...p.entries()].filter(([key]) => key in initial),
        ),
      };
      next.scars = next.scars === "0" ? "0" : "1";
      next.markers = next.markers === "0" ? "0" : "1";
      next.scarMode = next.scarMode === "severity" ? "severity" : "age";
      if (!["1", "5", "10"].includes(next.scarYears)) next.scarYears = "5";
      if (
        !/^\d{4}$/.test(next.scarEnd) ||
        Number(next.scarEnd) < 2009 ||
        Number(next.scarEnd) > Number(initial.scarEnd)
      )
        next.scarEnd = initial.scarEnd;
      if (next.scarMode === "severity") next.scarYears = "1";
      setFilters(next);
      setReady(true);
      setMapGeneration((g) => g + 1);
    };
    read();
    window.addEventListener("popstate", read);
    return () => window.removeEventListener("popstate", read);
  }, []);
  const recordQuery = new URLSearchParams(
    Object.entries(filters).filter(
      ([k]) => !k.startsWith("scar") && k !== "selected" && k !== "markers",
    ),
  ).toString();
  useEffect(() => {
    if (!ready) return;
    const controller = new AbortController();
    const p = recordQuery;
    const timer = setTimeout(async () => {
      setLoading(true);
      setError("");
      try {
        const response = await fetch(`/api/oregon-fire/records?${p}`, {
          signal: controller.signal,
        });
        const data = await response.json();
        if (!response.ok) throw new Error(data.error);
        setResult(data);
      } catch (e) {
        if (!controller.signal.aborted) {
          setError(e instanceof Error ? e.message : "Records unavailable");
          setResult(null);
        }
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    }, 250);
    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [recordQuery, ready]);
  useEffect(() => {
    if (!ready) return;
    const urlParams = new URLSearchParams(
      Object.entries(filters).filter(
        ([k, v]) => v !== "" && v !== initial[k as keyof Filters],
      ),
    );
    window.history.replaceState(
      null,
      "",
      `${window.location.pathname}${urlParams.size ? `?${urlParams}` : ""}#explore`,
    );
  }, [filters, ready]);
  useEffect(() => {
    if (!filters.selected) {
      setDetail(null);
      setDetailError("");
      return;
    }
    const c = new AbortController();
    setDetail(null);
    setDetailError("");
    fetch(`/api/oregon-fire/records/${encodeURIComponent(filters.selected)}`, {
      signal: c.signal,
    })
      .then(async (r) => {
        const d = await r.json();
        if (!r.ok) throw new Error(d.error);
        setDetail(d);
      })
      .catch((e) => {
        if (!c.signal.aborted) setDetailError(e.message);
      });
    return () => c.abort();
  }, [filters.selected]);
  const change = useCallback(
    (key: keyof Filters, value: string) =>
      setFilters((f) => ({ ...f, [key]: value, cursor: "0" })),
    [],
  );
  const onView = useCallback(
    (bbox: string, zoom: number) =>
      setFilters((f) =>
        f.bbox === bbox && f.zoom === String(zoom)
          ? f
          : { ...f, bbox, zoom: String(zoom), cursor: "0" },
      ),
    [],
  );
  const select = useCallback(
    (id: string) => {
      change("selected", id);
      setTimeout(() => detailRef.current?.focus(), 100);
    },
    [change],
  );
  const exportParams = new URLSearchParams(filters);
  exportParams.delete("selected");
  const options = result?.filters;
  return (
    <section
      id="explore"
      className="fire-explorer"
      aria-label="Explore Oregon fire records"
    >
      <LandscapeControls
        settings={filters}
        change={changeScars}
        data={landscape}
        loading={scarLoading}
        error={scarError}
        severityState={severityState}
      />
      <div className="fire-toolbar">
        <div className="fire-tabs" role="group" aria-label="Record layers">
          {[
            ["prescribed", "Prescribed burns"],
            ["planned", "Plans & permits"],
            ["wildfire", "Wildfire context"],
            ["all", "All records"],
          ].map(([v, label]) => (
            <button
              key={v}
              aria-pressed={filters.kind === v}
              onClick={() => change("kind", v)}
            >
              <span className={`fire-dot ${v}`} />
              {label}
            </button>
          ))}
        </div>
        <button
          className="fire-markers-toggle"
          aria-pressed={filters.markers === "1"}
          onClick={() => change("markers", filters.markers === "1" ? "0" : "1")}
        >
          Record markers {filters.markers === "1" ? "on" : "off"}
        </button>
        <a
          className="fire-export"
          href={`/api/oregon-fire/export?${exportParams}`}
        >
          <ArrowDownToLine size={15} /> Export records
        </a>
      </div>
      <details
        className="fire-filter-drawer"
        open={
          filters.from !== initial.from ||
          filters.to !== initial.to ||
          !!filters.q ||
          !!filters.agency ||
          !!filters.method ||
          !!filters.purpose ||
          !!filters.status
        }
      >
        <summary>
          Refine records <span>Dates, agency, method & purpose</span>
        </summary>
        <div className="fire-filters">
          <label className="fire-search">
            <span>Search records</span>
            <div>
              <Search size={17} />
              <input
                aria-label="Search records"
                placeholder="Burn name, county or agency"
                value={filters.q}
                onChange={(e) => change("q", e.target.value)}
              />
            </div>
          </label>
          <label>
            <span>From year</span>
            <input
              type="number"
              min="1800"
              max="2200"
              value={filters.from}
              onChange={(e) => change("from", e.target.value)}
            />
          </label>
          <label>
            <span>Through year</span>
            <input
              type="number"
              min="1800"
              max="2200"
              value={filters.to}
              onChange={(e) => change("to", e.target.value)}
            />
          </label>
          {(["agency", "method", "purpose", "status"] as const).map(
            (key, i) => (
              <label key={key}>
                <span>
                  {["Agency", "Burn method", "Reported purpose", "Status"][i]}
                </span>
                <select
                  value={filters[key]}
                  onChange={(e) => change(key, e.target.value)}
                >
                  <option value="">All</option>
                  {(
                    options?.[
                      (
                        ["agencies", "methods", "purposes", "statuses"] as const
                      )[i]
                    ] ?? []
                  )
                    .filter(Boolean)
                    .map((v) => (
                      <option key={v} value={v}>
                        {v}
                      </option>
                    ))}
                </select>
              </label>
            ),
          )}
          <button
            className="fire-reset"
            onClick={() => {
              setFilters(initial);
              setMapGeneration((g) => g + 1);
            }}
          >
            Reset
          </button>
        </div>
      </details>
      <div className="fire-workspace">
        <div className="fire-map-pane">
          {ready && (
            <Map
              key={mapGeneration}
              initialBounds={filters.bbox}
              items={
                loading || filters.markers === "0" ? [] : (result?.map ?? [])
              }
              selected={detail?.geometry ?? null}
              onSelect={select}
              onView={onView}
              scars={
                filters.scars === "1" && !scarLoading
                  ? (landscape?.scars ?? [])
                  : []
              }
              scarEnd={Number(filters.scarEnd)}
              severity={
                filters.scars === "1" && filters.scarMode === "severity"
              }
              onSeverityState={setSeverityState}
            />
          )}
          <div className="fire-map-caption">
            <Layers size={16} />
            {loading
              ? "Updating this view…"
              : result?.aggregated
                ? "Circles group source records. Zoom in to see individual units."
                : "Polygons show source boundaries; points show reported locations."}
            <span>Map data is incomplete</span>
          </div>
        </div>
        <div className="fire-results" aria-busy={loading}>
          <div className="fire-results-heading">
            <span className="fire-eyebrow">In this view</span>
            <strong aria-live="polite">
              {loading
                ? "Loading…"
                : result
                  ? `${result.total.toLocaleString()} records`
                  : "Records unavailable"}
            </strong>
            <p>
              Source records, not a count of unique fires. Includes records with
              unknown dates.
            </p>
            {!loading && result && (
              <details>
                <summary>Counts by source</summary>
                <ul>
                  {result.sourceCounts.map((s) => (
                    <li key={s.sourceId}>
                      {SOURCE_BY_ID[s.sourceId]?.name}:{" "}
                      {s.count.toLocaleString()}
                    </li>
                  ))}
                </ul>
              </details>
            )}
          </div>
          {error && (
            <p className="fire-state" role="alert">
              {error}
            </p>
          )}
          {!loading && result?.total === 0 && (
            <div className="fire-state">
              <MapPin size={24} />
              <p>
                {result.dataStatus === "unavailable"
                  ? "Data has not been imported yet. Explore the source directory below."
                  : "No matching records in this view. Try another year, layer, or map area."}
              </p>
              <p>A missing record does not mean a burn did not happen.</p>
            </div>
          )}
          {!loading &&
            result?.records.map((r) => (
              <button
                key={r.id}
                className={`fire-result ${filters.selected === r.id ? "selected" : ""}`}
                onClick={() => select(r.id)}
              >
                <span className="fire-result-meta">
                  {r.agency} <span>{r.year ?? "Date unknown"}</span>
                </span>
                <strong>
                  {r.name}
                  <ChevronRight size={16} />
                </strong>
                <span>{r.method}</span>
                <span className="fire-result-status">{r.status}</span>
                {r.inLatestFeed === false && (
                  <span className="fire-small">
                    Archived observation · absent from latest feed
                  </span>
                )}
              </button>
            ))}
          {!loading && result && result.total > 50 && (
            <div className="fire-pagination">
              <button
                disabled={Number(filters.cursor) === 0}
                onClick={() =>
                  setFilters((f) => ({
                    ...f,
                    cursor: String(Math.max(0, Number(f.cursor) - 50)),
                  }))
                }
              >
                Previous
              </button>
              <span>
                {Number(filters.cursor) + 1}–
                {Math.min(Number(filters.cursor) + 50, result.total)}
              </span>
              <button
                disabled={!result.nextCursor}
                onClick={() =>
                  setFilters((f) => ({
                    ...f,
                    cursor: result.nextCursor ?? "0",
                  }))
                }
              >
                Next
              </button>
            </div>
          )}
        </div>
      </div>
      {filters.selected && (
        <div
          className="fire-detail"
          tabIndex={-1}
          ref={detailRef}
          aria-label="Selected burn record"
        >
          <button
            className="fire-close"
            aria-label="Close record details"
            onClick={() => change("selected", "")}
          >
            <X size={20} />
          </button>
          {detailError ? (
            <p role="alert">{detailError}</p>
          ) : !detail ? (
            <p>Loading record details…</p>
          ) : (
            <>
              <div>
                <span className="fire-eyebrow">
                  {detail.record.recordKind.replace("-", " ")} ·{" "}
                  {when(detail.record)}
                </span>
                <h2>{detail.record.name}</h2>
                <p>
                  {detail.record.agency} · {detail.record.status}
                </p>
                {detail.record.inLatestFeed === false && (
                  <p>
                    Absent from the latest feed. This is its last observed
                    status; absence does not establish cancellation or
                    completion.
                  </p>
                )}
                {detail.record.dateNote && <p>{detail.record.dateNote}</p>}
                <p className="fire-accuracy">
                  {detail.record.geometryMeaning}. {detail.record.accuracy}
                </p>
                <dl className="fire-facts">
                  <div>
                    <dt>Treatment area</dt>
                    <dd>{area(detail.record.treatmentAcres)}</dd>
                  </div>
                  <div>
                    <dt>Reported fire size</dt>
                    <dd>{area(detail.record.burnedAcres)}</dd>
                  </div>
                  <div>
                    <dt>Mapped polygon area</dt>
                    <dd>{area(detail.record.polygonAcres)}</dd>
                  </div>
                  <div>
                    <dt>Burn method</dt>
                    <dd>{detail.record.method}</dd>
                  </div>
                </dl>
              </div>
              <div>
                <h3>Why this place?</h3>
                <span className="fire-eyebrow">Reported purpose</span>
                <p>{detail.record.purpose ?? "Not reported in this source."}</p>
                <span className="fire-eyebrow">
                  Documented site-selection explanation
                </span>
                {detail.explanations.length ? (
                  detail.explanations.map((e) => (
                    <p key={e.source_url}>
                      {e.body} <a href={e.source_url}>{e.attribution}</a>
                    </p>
                  ))
                ) : (
                  <p>
                    Not yet documented. A purpose code tells us what a treatment
                    was intended to do; it does not fully explain why this
                    particular unit was chosen.
                  </p>
                )}
                {detail.record.documentIds.length > 0 && (
                  <p>
                    Source document references:{" "}
                    {detail.record.documentIds.join(" · ")}. These identifiers
                    have not been matched to a document unless a link is
                    supplied above.
                  </p>
                )}
                <a className="fire-source-link" href={detail.record.sourceUrl}>
                  Open original source <ArrowUpRight size={15} />
                </a>
                <p className="fire-small">
                  Last observed: {new Date(detail.observedAt).toLocaleString()}.{" "}
                  {SOURCE_BY_ID[detail.record.sourceId]?.limitations}
                </p>
              </div>
              <div className="fire-detail-bottom">
                <details>
                  <summary>Observed status history & related records</summary>
                  <ul>
                    {detail.history.map((h, i) => (
                      <li key={i}>
                        {new Date(h.observed_at).toLocaleDateString()} —{" "}
                        {h.status}
                      </li>
                    ))}
                  </ul>
                  {detail.related.length ? (
                    <ul>
                      {detail.related.map((r) => (
                        <li key={r.id}>
                          <button onClick={() => select(r.id)}>
                            {r.name} · {SOURCE_BY_ID[r.sourceId]?.name}
                          </button>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p>No verified cross-source links yet.</p>
                  )}
                </details>
                <Link
                  className="fire-contribute"
                  href={`/contact?topic=Data+correction&project=Oregon+Fire+Map&fireRecord=${encodeURIComponent(detail.record.id)}`}
                >
                  Explain this burn or suggest a correction{" "}
                  <ArrowUpRight size={16} />
                </Link>
                <p className="fire-small">
                  Submissions are private until reviewed. Include supporting
                  evidence and your publication preference.
                </p>
              </div>
            </>
          )}
        </div>
      )}
      <div className="fire-source-strip">
        {sources
          .filter((s) => s.role === "primary")
          .map((s) => (
            <a href="#sources" key={s.id}>
              <span className={`fire-health ${s.state}`} />
              {s.agency}: {s.lastSuccess ? s.state : "not imported"}
            </a>
          ))}
      </div>
    </section>
  );
}
