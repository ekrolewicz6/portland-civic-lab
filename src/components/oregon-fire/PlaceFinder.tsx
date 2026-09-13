"use client";
import { useEffect, useMemo, useState } from "react";
import { Search, ArrowRight, ArrowUpRight, MapPin } from "lucide-react";
import places from "@/lib/oregon-fire/places.json";
import { GUIDE_SOURCES } from "@/lib/oregon-fire/guide";
import { SOURCE_BY_ID } from "@/lib/oregon-fire/sources";
import type { RecordResult } from "@/lib/oregon-fire/types";
import { exploreScene, useGuideChoice } from "./guide-navigation";
const featured = [
  "Bend",
  "Corvallis",
  "Burns",
  "Portland",
  "Medford",
  "La Grande",
];
export default function PlaceFinder() {
  const [query, setQuery] = useState("");
  const [id, choose] = useGuideChoice(
    "place",
    places.map((p) => p.id),
    "",
  );
  const place = places.find((p) => p.id === id);
  const matches = useMemo(
    () =>
      query.trim()
        ? places
            .filter((p) =>
              p.name.toLowerCase().includes(query.trim().toLowerCase()),
            )
            .sort(
              (a, b) =>
                Number(b.name.toLowerCase() === query.toLowerCase()) -
                Number(a.name.toLowerCase() === query.toLowerCase()),
            )
            .slice(0, 12)
        : featured.flatMap((n) => places.filter((p) => p.name === n)),
    [query],
  );
  const [data, setData] = useState<RecordResult | null>(null),
    [error, setError] = useState(""),
    [loading, setLoading] = useState(false);
  const bounds = place
    ? [place.lon - 0.4, place.lat - 0.28, place.lon + 0.4, place.lat + 0.28]
        .map((n) => n.toFixed(5))
        .join(",")
    : "";
  useEffect(() => {
    if (!bounds) return;
    const c = new AbortController();
    setLoading(true);
    setError("");
    setData(null);
    fetch(
      `/api/oregon-fire/records?${new URLSearchParams({ bbox: bounds, kind: "all", from: "2021", zoom: "8" })}`,
      { signal: c.signal },
    )
      .then(async (r) => {
        const d = await r.json();
        if (!r.ok || d.dataStatus !== "available")
          throw new Error(d.error || "Local records are not available yet.");
        setData(d);
      })
      .catch((e) => {
        if (!c.signal.aborted) setError(e.message);
      })
      .finally(() => {
        if (!c.signal.aborted) setLoading(false);
      });
    return () => c.abort();
  }, [bounds]);
  return (
    <section
      id="find-place"
      className="fire-place-section"
      aria-labelledby="place-title"
    >
      <div className="fire-place-intro">
        <span className="fire-eyebrow">
          <MapPin size={14} /> Make it local
        </span>
        <h2 id="place-title">
          Start with somewhere
          <br />
          <em>you know.</em>
        </h2>
        <p>
          A town, a home base, a place you return to. Find the documented fires
          and treatments in the surrounding landscape.
        </p>
        <a href={GUIDE_SOURCES.census}>
          426 Oregon places · Census 2025
          <ArrowUpRight size={13} />
        </a>
      </div>
      <div className="fire-place-tool">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (matches[0]) choose(matches[0].id);
          }}
        >
          <label htmlFor="fire-place-search">
            Find an Oregon city or community
          </label>
          <div className="fire-place-input">
            <Search size={20} />
            <input
              id="fire-place-search"
              type="search"
              autoComplete="off"
              placeholder="Try Bend, Corvallis, or Burns…"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            <button type="submit" disabled={!matches.length}>
              Find
            </button>
          </div>
        </form>
        <div className="fire-place-matches" aria-label="Matching places">
          {matches.map((p) => (
            <button
              key={p.id}
              aria-pressed={p.id === id}
              onClick={() => choose(p.id)}
            >
              {p.name}
              <span>{p.type}</span>
            </button>
          ))}
          {!matches.length && (
            <p role="status">
              No matching place in the Census list. Try a nearby town. Park and
              watershed names are not yet included.
            </p>
          )}
        </div>
        {place && (
          <div className="fire-place-summary" aria-live="polite">
            <div className="fire-place-summary-heading">
              <h3>Around {place.name}</h3>
              <span>2021–{new Date().getFullYear()}</span>
            </div>
            {loading ? (
              <p role="status">Reading the local records…</p>
            ) : error ? (
              <p role="alert">{error}</p>
            ) : (
              data && (
                <>
                  <div className="fire-place-stats">
                    <div>
                      <strong>{data.total.toLocaleString()}</strong>
                      <span>source records</span>
                    </div>
                    <div>
                      <strong>{data.sourceCounts.length}</strong>
                      <span>data sources</span>
                    </div>
                    <div>
                      <strong>{data.records[0]?.year ?? "—"}</strong>
                      <span>newest reported year</span>
                    </div>
                  </div>
                  <p>
                    {data.total
                      ? "These records describe fires, treatments, and plans intersecting the surrounding map view. They are not a count of unique fires."
                      : "No imported records match this view and period. This does not establish that no fire or treatment occurred."}
                  </p>
                  <p className="fire-guide-note">
                    Sources:{" "}
                    {data.sourceCounts
                      .map((s) => SOURCE_BY_ID[s.sourceId]?.name || s.sourceId)
                      .join(" · ") || "None in this view"}
                    . Coverage is incomplete. Each record identifies its
                    reporting organization and original source.
                  </p>
                </>
              )
            )}
            <button
              className="fire-guide-primary"
              onClick={() =>
                exploreScene({
                  bbox: bounds,
                  kind: "all",
                  from: "2021",
                  to: String(new Date().getFullYear()),
                  place: id,
                  zoom: "8",
                  scars: "1",
                  scarMode: "age",
                  scarYears: "5",
                  scarEnd: String(new Date().getFullYear()),
                })
              }
            >
              Explore records around {place.name}
              <ArrowRight size={16} />
            </button>
            <small>
              View centered on a Census reference point; not a city boundary,
              parcel risk score, or evacuation area. Ecology varies within this
              view.
            </small>
          </div>
        )}
      </div>
    </section>
  );
}
