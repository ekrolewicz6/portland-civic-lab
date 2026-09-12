"use client";
import { Layers, ArrowUpRight } from "lucide-react";
import {
  MTBS_LEGEND,
  MTBS_VERIFIED_YEAR,
  scarColor,
  type LandscapeResult,
} from "@/lib/oregon-fire/landscape";

export interface ScarSettings {
  scars: string;
  scarYears: string;
  scarEnd: string;
  scarMode: string;
}
export default function LandscapeControls({
  settings,
  change,
  data,
  loading,
  error,
  severityState,
}: {
  settings: ScarSettings;
  change: (patch: Partial<ScarSettings>) => void;
  data: LandscapeResult | null;
  loading: boolean;
  error: string;
  severityState: string;
}) {
  const enabled = settings.scars === "1",
    severity = settings.scarMode === "severity";
  const end = Number(settings.scarEnd),
    start = end - Number(settings.scarYears) + 1;
  return (
    <div className="fire-landscape-controls">
      <div className="fire-landscape-heading">
        <div>
          <span className="fire-eyebrow">Fire history, in the landscape</span>
          <h2>The landscape remembers.</h2>
          <p>See recent wildfire boundaries alongside the burns we plan.</p>
        </div>
        <div className="fire-scar-count" aria-live="polite">
          <strong>
            {!enabled
              ? "—"
              : loading
                ? "…"
                : data
                  ? data.total.toLocaleString()
                  : "—"}
          </strong>
          <span>
            perimeter records in view
            <br />
            {start === end ? end : `${start}–${end}`}
          </span>
        </div>
      </div>
      <div className="fire-landscape-options">
        <button
          className="fire-scar-toggle"
          aria-pressed={enabled}
          onClick={() => change({ scars: enabled ? "0" : "1" })}
        >
          <Layers size={17} /> Recent fire scars{" "}
          <span>{enabled ? "On" : "Off"}</span>
        </button>
        <div
          className="fire-segment"
          role="group"
          aria-label="Fire scar display"
        >
          <button
            disabled={!enabled}
            aria-pressed={!severity}
            onClick={() => change({ scarMode: "age" })}
          >
            Year of fire
          </button>
          <button
            disabled={!enabled}
            aria-pressed={severity}
            onClick={() =>
              change({
                scarMode: "severity",
                scarYears: "1",
                scarEnd: String(Math.min(2024, end)),
              })
            }
          >
            Burn severity
          </button>
        </div>
        {!severity && (
          <div
            className="fire-segment"
            role="group"
            aria-label="Fire scar time window"
          >
            {["1", "5", "10"].map((y) => (
              <button
                key={y}
                disabled={!enabled}
                aria-pressed={settings.scarYears === y}
                onClick={() => change({ scarYears: y })}
              >
                {y} {y === "1" ? "year" : "years"}
              </button>
            ))}
          </div>
        )}
        <label className="fire-scar-year">
          {severity ? "Severity fire year" : "Through year"}
          <select
            disabled={!enabled}
            aria-label={
              severity ? "Severity fire year" : "Fire scars through year"
            }
            value={settings.scarEnd}
            onChange={(e) => change({ scarEnd: e.target.value })}
          >
            {Array.from(
              { length: new Date().getFullYear() - 2008 },
              (_, i) => new Date().getFullYear() - i,
            )
              .filter((y) => !severity || y <= MTBS_VERIFIED_YEAR)
              .map((y) => (
                <option key={y}>{y}</option>
              ))}
          </select>
        </label>
      </div>
      {enabled && (
        <div className="fire-scar-key">
          <div
            className="fire-scar-legend"
            aria-label={severity ? "Burn severity legend" : "Fire age legend"}
          >
            {severity
              ? MTBS_LEGEND.map(([c, l]) => (
                  <span key={l}>
                    <i style={{ background: c }} />
                    {l}
                  </span>
                ))
              : data?.years.map((y) => (
                  <span key={y.year}>
                    <i style={{ background: scarColor(y.year, end) }} />
                    {y.year}
                  </span>
                ))}
          </div>
          <p>
            {severity
              ? `MTBS ${end}: published assessments, including wildfire and prescribed fire. Colors show vegetation change, not ecological benefit. Unmapped ground is not necessarily unburned.`
              : "Perimeters can include unburned ground. Overview boundaries are simplified. Select an outline to read its source record. These time controls affect fire scars; record filters below affect the list."}
          </p>
          {severity && (
            <p className="fire-severity-state" role="status">
              {severityState === "error"
                ? "Some severity tiles could not load. Boundaries remain visible; retry by switching the layer off and on."
                : severityState === "loading"
                  ? "Loading satellite burn-severity assessments…"
                  : "MTBS generally maps western fires of at least 1,000 acres. Assessment coverage and publication dates vary."}{" "}
              <a href="https://www.mtbs.gov/faqs">
                Read the method <ArrowUpRight size={11} />
              </a>
            </p>
          )}
          {loading && <p role="status">Updating wildfire boundaries…</p>}
          {error && <p role="alert">{error}</p>}
          {data && !loading && !error && data.total === 0 && (
            <p>
              No perimeter records in this time window and map area. This does
              not establish that no fire occurred.
            </p>
          )}
          {data?.coverage.some(
            (c) => !c.lastSuccess || c.state === "stale",
          ) && (
            <p>
              Some perimeter coverage is unavailable or overdue. Last successful
              source timestamps are listed below.
            </p>
          )}
        </div>
      )}
    </div>
  );
}
