"use client";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import type { Candidate, Race } from "@/lib/voters-guide/types";
import {
  comparisonEvent,
  comparisonChangeEvent,
  explorerTopics,
  hasTopic,
  topicPosition,
  type ExplorerTopic,
} from "@/lib/voters-guide/explorer";
import CandidatePortrait from "./CandidatePortrait";
import styles from "./discovery.module.css";

export default function CandidateDiscovery({ race }: { race: Race }) {
  const [page, setPage] = useState(0);
  const [topic, setTopic] = useState<ExplorerTopic>("overview");
  const [selected, setSelected] = useState<string[]>([]);
  const [paired, setPaired] = useState(false);
  const [ready, setReady] = useState(false);
  const [storageAvailable, setStorageAvailable] = useState(true);
  const [inView, setInView] = useState(false);
  const region = useRef<HTMLElement>(null);
  const selectionChanged = useRef(true);
  const heading = useRef<HTMLHeadingElement>(null);
  const key = `pcl-explore-${race.id}`;
  const people = [...race.candidates].sort((a, b) =>
    a.name.localeCompare(b.name),
  );
  useEffect(() => {
    try {
      const raw = sessionStorage.getItem(key);
      if (raw) {
        const value = JSON.parse(raw);
        if (explorerTopics.some((t) => t.id === value.topic))
          setTopic(value.topic);
        if (Array.isArray(value.selected))
          setSelected(
            [
              ...new Set<string>(
                value.selected.filter((id: string) =>
                  race.candidates.some((p) => p.id === id),
                ),
              ),
            ].slice(0, 2),
          );
      }
      // The previous quiz session stays intact. Its answers are not candidate positions.
    } catch {
      setStorageAvailable(false);
    }
    setReady(true);
  }, [key, race.candidates]);
  useEffect(() => {
    if (!ready) return;
    try {
      sessionStorage.setItem(key, JSON.stringify({ topic, selected }));
    } catch {
      setStorageAvailable(false);
    }
  }, [key, topic, selected, ready]);
  useEffect(() => {
    if (!region.current) return;
    const observer = new IntersectionObserver(([entry]) =>
      setInView(entry.isIntersecting),
    );
    observer.observe(region.current);
    return () => observer.disconnect();
  }, []);
  useEffect(() => {
    function sync(event: Event) {
      const detail = (event as CustomEvent).detail;
      if (detail?.raceId !== race.id) return;
      selectionChanged.current = false;
      if (Array.isArray(detail.selected)) {
        const ids = [
          ...new Set<string>(
            detail.selected.filter((id: string) =>
              race.candidates.some((p) => p.id === id),
            ),
          ),
        ].slice(0, 2);
        setSelected(ids);
        setPaired(ids.length === 2);
      }
      const nextTopic = detail.topic === "values" ? "overview" : detail.topic;
      if (explorerTopics.some((t) => t.id === nextTopic)) setTopic(nextTopic);
    }
    window.addEventListener(comparisonChangeEvent, sync);
    return () => window.removeEventListener(comparisonChangeEvent, sync);
  }, [race.id, race.candidates]);
  const known = people.filter((p) => hasTopic(p, topic));
  const missing = people.filter((p) => !hasTopic(p, topic));
  const browsable = known.length ? known : people;
  const pageCount = Math.ceil(browsable.length / 4);
  const currentPage = Math.min(page, pageCount - 1);
  const chosen = people.filter((p) => selected.includes(p.id));
  function focus() {
    requestAnimationFrame(() => {
      heading.current?.focus({ preventScroll: true });
      heading.current?.scrollIntoView({ block: "start", behavior: "instant" });
    });
  }
  function toggle(id: string) {
    selectionChanged.current = true;
    setSelected((old) =>
      old.includes(id)
        ? old.filter((v) => v !== id)
        : old.length < 2
          ? [...old, id]
          : old,
    );
  }
  useEffect(() => {
    function shareSelection() {
      if (!selectionChanged.current) return;
      selectionChanged.current = false;
      window.dispatchEvent(new CustomEvent(comparisonEvent, { detail: {
        raceId: race.id, selected, topic: topic === "overview" ? "values" : topic,
      } }));
    }
    window.addEventListener("pcl:request-candidate-comparison", shareSelection);
    return () => window.removeEventListener("pcl:request-candidate-comparison", shareSelection);
  }, [race.id, selected, topic]);
  function openRecords() {
    selectionChanged.current = false;
    window.dispatchEvent(
      new CustomEvent(comparisonEvent, {
        detail: {
          raceId: race.id,
          selected,
          topic: topic === "overview" ? "values" : topic,
        },
      }),
    );
  }
  function card(person: Candidate, comparing = false) {
    const position = topicPosition(person, topic);
    const available = hasTopic(person, topic);
    return (
      <section
        className={styles.card}
        key={person.id}
        data-candidate={person.id}
        aria-label={`${person.name} quick profile`}
      >
        <header className={styles.identity}>
          <div className={styles.portrait}>
            <CandidatePortrait person={person} compact />
          </div>
          <h3>{person.name}</h3>
        </header>
        {!available && (
          <p className={styles.note}>
            We don’t have a documented position on this topic. Here is their
            broader platform.
          </p>
        )}
        <p className={styles.position}>
          {topic === "experience"
            ? person.background
            : (position?.position ?? person.summary)}
        </p>
        {position && (
          <a className={styles.source} href={position.source.url}>
            {position.source.kind === "Candidate statement"
              ? "Campaign statement"
              : position.source.kind}{" "}
            · source ↗
          </a>
        )}
        <details>
          <summary>Background &amp; context</summary>
          {topic !== "experience" && (
            <p>
              <strong>Experience:</strong> {person.background}
            </p>
          )}
          <p>
            <strong>Our reading:</strong>{" "}
            {person.analysis?.tradeoff ?? person.interpretation}
          </p>
          <p>
            <strong>A question still to answer:</strong> {person.question}
          </p>
          <div className={styles.sources}>
            {Array.from(
              new Map(person.sources.map((s) => [s.url, s])).values(),
            ).map((source) => (
              <a key={source.url + source.label} href={source.url}>
                {source.label}
              </a>
            ))}
          </div>
        </details>
        <div className={styles.cardActions}>
          <a href={`#${person.id}`}>Full profile &amp; record →</a>
          {!comparing && (
            <button
              type="button"
              aria-pressed={selected.includes(person.id)}
              disabled={selected.length === 2 && !selected.includes(person.id)}
              onClick={() => toggle(person.id)}
              aria-label={`${selected.includes(person.id) ? "Remove" : "Select"} ${person.name} for quick comparison`}
            >
              {selected.includes(person.id) ? "Selected" : "Compare"}
            </button>
          )}
        </div>
      </section>
    );
  }
  return (
    <section
      ref={region}
      id="find-candidates"
      className={styles.discovery}
      data-selected={selected.length > 0 && !paired}
      aria-label="Quick candidate comparison"
    >
      <h2 ref={heading} tabIndex={-1}>
        {paired ? "Side by side." : "Compare candidates."}
      </h2>
      <p className={styles.lede}>
        {paired
          ? "Switch topics to compare what they propose."
          : "Choose a topic. Select two candidates to compare."}
      </p>
      <label className={styles.topicControl}>
        Explore a topic
        <select
          value={topic}
          onChange={(event) => {
            selectionChanged.current = true;
            setTopic(event.target.value as ExplorerTopic);
            setPage(0);
            requestAnimationFrame(() =>
              heading.current?.scrollIntoView({
                block: "start",
                behavior: "instant",
              }),
            );
          }}
        >
          {explorerTopics.map((t) => (
            <option key={t.id} value={t.id}>
              {t.label}
            </option>
          ))}
        </select>
      </label>
      {!paired && <label className={styles.topicControl}>
        Go straight to a candidate
        <select value="" onChange={(event) => { if (event.target.value) window.location.hash = event.target.value; }}>
          <option value="">Choose a name…</option>
          {people.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
        </select>
      </label>}
      {paired && chosen.length === 2 ? (
        <>
          <div className={styles.viewActions}>
            <button
              onClick={() => {
                setPaired(false);
                focus();
              }}
            >
              ← All candidates
            </button>
            <a href="#compare" onClick={openRecords}>
              Compare full records →
            </a>
          </div>
          <div className={`${styles.cards} ${styles.paired}`}>
            {chosen.map((person) => card(person, true))}
          </div>
        </>
      ) : (
        <>
          <p className={styles.note} role="status">
            {known.length === people.length
              ? `${people.length} candidates`
              : `${known.length} candidates with a documented position`}{" "}
            · A–Z
          </p>
          {!!missing.length && (
            <details className={styles.gaps} key={topic}>
              <summary>
                {missing.length} more candidates · no topic statement in our
                sources
              </summary>
              <p>
                They remain part of this race. Read their profiles or switch to
                “At a glance” to see everyone.
              </p>
              <ul>
                {missing.map((person) => (
                  <li key={person.id}>
                    <a href={`#${person.id}`}>{person.name}</a>
                    <span>{person.background}</span>
                  </li>
                ))}
              </ul>
              <button onClick={() => { selectionChanged.current = true; setTopic("overview"); setPage(0); }}>
                Show everyone at a glance
              </button>
            </details>
          )}
          {!known.length && (
            <p>
              There are no documented positions on this topic yet. Here are the
              candidates’ broader platforms.
            </p>
          )}
          <nav className={styles.pagination} aria-label="Candidate pages">
            <button disabled={currentPage === 0} onClick={() => { setPage(currentPage - 1); focus(); }}>← Previous</button>
            <span role="status">{currentPage * 4 + 1}–{Math.min(currentPage * 4 + 4, browsable.length)} of {browsable.length}</span>
            <button disabled={currentPage + 1 >= pageCount} onClick={() => { setPage(currentPage + 1); focus(); }}>Next →</button>
          </nav>
          <div className={styles.cards}>
            {browsable.slice(currentPage * 4, currentPage * 4 + 4).map((person) => card(person))}
          </div>
          <nav className={styles.pagination} aria-label="More candidates">
            <button disabled={currentPage === 0} onClick={() => { setPage(currentPage - 1); focus(); }}>← Previous</button>
            <span>{currentPage + 1} / {pageCount}</span>
            <button disabled={currentPage + 1 >= pageCount} onClick={() => { setPage(currentPage + 1); focus(); }}>Next →</button>
          </nav>
        </>
      )}
      {!!selected.length && !paired && (
        <div
          className={`${styles.selectionBar} ${inView ? styles.floatingActions : ""}`}
        >
          <div>
            <strong>
              {selected.length === 1
                ? "Choose one more candidate"
                : "Ready to compare"}
            </strong>
            <div className={styles.selectedNames}>
              {chosen.map((p) => (
                <button
                  key={p.id}
                  onClick={() => toggle(p.id)}
                  aria-label={`Remove ${p.name} from selection`}
                >
                  {p.name} ×
                </button>
              ))}
            </div>
          </div>
          {selected.length === 2 && (
            <button
              className={styles.primary}
              onClick={() => {
                setPaired(true);
                focus();
              }}
            >
              Compare these two →
            </button>
          )}
        </div>
      )}
      <nav className={styles.footer} aria-label="Explore the full research">
        <a href="#disagreements">Where incumbents disagree</a>
        <a href="#candidates">All full profiles</a>
        <Link href="/voters-guide/methodology#guided-comparison">
          How we compare
        </Link>
        {!!selected.length && (
          <button
            onClick={() => {
              selectionChanged.current = true;
              setSelected([]);
              setPaired(false);
            }}
          >
            Clear selection
          </button>
        )}
      </nav>
      {!storageAvailable && (
        <p className={styles.note}>
          Your selections work here, but this browser cannot save them after a
          reload.
        </p>
      )}
    </section>
  );
}
