"use client";
import { useState } from "react";
import Link from "next/link";
import { ArrowRight, Search } from "lucide-react";
import type { RaceSummary, Geography } from "@/lib/voters-guide/types";
import styles from "@/app/(public)/voters-guide/guide.module.css";
const areas: ("All races" | Geography)[] = [
  "All races",
  "Portland",
  "Multnomah",
  "Washington",
  "Clackamas",
  "Oregon",
];
const searchable = (text: string) =>
  text
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLocaleLowerCase();
export default function GuideExplorer({ races }: { races: RaceSummary[] }) {
  const [area, setArea] = useState<(typeof areas)[number]>("All races");
  const [query, setQuery] = useState("");
  const availableAreas = areas.filter(
    (a) => a === "All races" || races.some((r) => r.geography === a),
  );
  const terms = searchable(query).trim().split(/\s+/).filter(Boolean);
  const visible = races.filter(
    (r) =>
      (area === "All races" ||
        r.geography === area ||
        (r.id === "lake-oswego-council" &&
          ["Multnomah", "Washington", "Clackamas"].includes(area))) &&
      terms.every((term) =>
        searchable(
          `${r.title} ${r.jurisdiction} ${r.candidates.map((c) => c.name).join(" ")}`,
        ).includes(term),
      ),
  );
  return (
    <section className={styles.explorer} aria-labelledby="races-title">
      <div className={styles.sectionTop}>
        <h2 id="races-title">Explore the races</h2>
        <label className={styles.search}>
          <Search size={18} aria-hidden="true" />
          <span className="sr-only">Search races or candidates</span>
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Find a race or candidate"
            type="search"
          />
        </label>
      </div>
      {availableAreas.length > 2 && (
        <div
          className={styles.filters}
          role="group"
          aria-label="Filter races by geography"
        >
          {availableAreas.map((a) => (
            <button
              key={a}
              type="button"
              aria-pressed={area === a}
              onClick={() => setArea(a)}
            >
              {a}
            </button>
          ))}
        </div>
      )}
      <p className={styles.filterHelp}>
        Search the published races by office or candidate name. Your address
        determines which district appears on your ballot.
      </p>
      <p className={styles.results} role="status">
        {visible.length} {visible.length === 1 ? "race" : "races"}
        {area !== "All races" ? ` · ${area}` : ""}
      </p>
      <div className={styles.raceList}>
        {visible.map((r, i) => (
          <Link
            href={`/voters-guide/${r.id}`}
            className={styles.raceLink}
            key={r.id}
          >
            <span className={styles.raceNumber}>
              {String(i + 1).padStart(2, "0")}
            </span>
            <div>
              <div className={styles.eyebrow}>
                {r.jurisdiction} · {r.method}
              </div>
              <h3>{r.title}</h3>
              <p>{r.stakes}</p>
              <div className={styles.names}>
                {r.candidates
                  .map((c) => c.name)
                  .sort((a, b) => a.localeCompare(b, "en"))
                  .join(" · ")}
              </div>
            </div>
            <div className={styles.raceEnd}>
              <span>
                {r.candidates.length}{" "}
                {r.candidates.length === 1 ? "candidate" : "candidates"}
                <br />
                {r.profileCount} {r.profileCount === 1 ? "brief" : "briefs"}
              </span>
              <ArrowRight aria-hidden="true" />
            </div>
          </Link>
        ))}
      </div>
      {!visible.length && (
        <div className={styles.empty}>
          <h3>No matching race</h3>
          <p>
            Try another name or geography. Some races are still in the research
            queue.
          </p>
          <button
            onClick={() => {
              setArea("All races");
              setQuery("");
            }}
          >
            Clear filters
          </button>
        </div>
      )}
    </section>
  );
}
