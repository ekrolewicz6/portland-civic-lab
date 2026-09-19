"use client";
import { useState } from "react";
import CandidatePortrait from "./CandidatePortrait";
import { Printer } from "lucide-react";
import type { Candidate, Evidence, Race } from "@/lib/voters-guide/types";
import styles from "@/app/(public)/voters-guide/guide.module.css";
function Source({ source }: { source: Evidence }) {
  return (
    <>
      <a href={source.url}>{source.label}</a>
      <small>
        {source.kind} · {source.date}
      </small>
      {source.note && <small>{source.note}</small>}
    </>
  );
}
function Profile({
  person,
  showPortrait,
}: {
  person: Candidate;
  showPortrait: boolean;
}) {
  return (
    <article
      className={styles.candidate}
      id={person.id}
      aria-labelledby={`${person.id}-title`}
    >
      <header className={styles.candidateHead}>
        {showPortrait && (
          <div className={styles.profilePortrait}>
            <CandidatePortrait person={person} />
          </div>
        )}
        <div className={styles.profileIdentity}>
          <div className={styles.eyebrow}>{person.affiliation}</div>
          <h2 id={`${person.id}-title`}>
            <a href={`#${person.id}`}>{person.name}</a>
          </h2>
          <p>{person.background}</p>
          {person.portrait && (
            <a className={styles.photoCredit} href={person.portrait.sourceUrl}>
              Photo: {person.portrait.credit} ↗
            </a>
          )}
        </div>
      </header>
      <div className={styles.candidateBody}>
        <h3>What they say they would do</h3>
        <p>{person.summary}</p>
        {person.priorities.length > 0 && (
          <ul>
            {person.priorities.map((p) => (
              <li key={p}>{p}</li>
            ))}
          </ul>
        )}
        {person.missing && <p className={styles.gap}>{person.missing}</p>}
        <div className={styles.interpretation}>
          <h3>What that means · our interpretation</h3>
          <p>{person.interpretation}</p>
        </div>
        <h3>Checked against the record</h3>
        {person.record?.length ? (
          person.record.map((r, i) => (
            <div className={styles.record} key={i}>
              <p>{r.text}</p>
              <Source source={r.source} />
            </div>
          ))
        ) : (
          <p>
            Independent record review is not yet complete. The policy summary
            above is attributed to the linked candidate materials.
          </p>
        )}
        <div className={styles.questions}>
          <h3>A question the evidence leaves open</h3>
          <p>{person.question}</p>
        </div>
        <details className={styles.sources}>
          <summary>
            Sources behind this profile ({person.sources.length})
          </summary>
          <ol>
            {person.sources.map((s, i) => (
              <li key={`${s.url}-${i}`}>
                <Source source={s} />
              </li>
            ))}
          </ol>
        </details>
      </div>
    </article>
  );
}
export default function CandidateComparison({ race }: { race: Race }) {
  const [selected, setSelected] = useState<string[]>([]);
  const [comparing, setComparing] = useState(false);
  const people = [...race.candidates].sort((a, b) =>
    a.name.localeCompare(b.name, "en"),
  );
  const hasPortraits = people.some((p) => p.portrait);
  const compared = people.filter((p) => selected.includes(p.id));
  function toggle(id: string) {
    setComparing(false);
    setSelected((old) =>
      old.includes(id)
        ? old.filter((x) => x !== id)
        : old.length < 3
          ? [...old, id]
          : old,
    );
  }
  function print() {
    const closed = [
      ...document.querySelectorAll<HTMLDetailsElement>("details"),
    ].filter((d) => !d.open);
    closed.forEach((d) => {
      d.open = true;
    });
    window.addEventListener(
      "afterprint",
      () =>
        closed.forEach((d) => {
          d.open = false;
        }),
      { once: true },
    );
    window.print();
  }
  return (
    <>
      <div className={styles.compareControls} id="candidates">
        <div className={styles.sectionTop}>
          <h2>
            {race.candidates.length > 1
              ? "Read, then compare."
              : "Read the candidate’s brief."}
          </h2>
          <button className={styles.printButton} onClick={print}>
            <Printer size={16} aria-hidden="true" />{" "}
            {comparing ? "Print comparison" : "Print this race"}
          </button>
        </div>
        {race.candidates.length > 1 && (
          <>
            <p>
              Select two or three candidates to compare the same questions.
              Selection is temporary and does not record a vote or preference.
            </p>
            <div className={styles.compareActions}>
              <button
                disabled={selected.length < 2}
                onClick={() => setComparing(true)}
              >
                Compare selected ({selected.length}/3)
              </button>
              <button
                onClick={() => {
                  setSelected([]);
                  setComparing(false);
                }}
              >
                Show all candidates
              </button>
              <span className={styles.results} role="status">
                {comparing
                  ? `Comparing ${compared.map((c) => c.name).join(", ")}`
                  : `${selected.length} selected`}
              </span>
            </div>
            {hasPortraits && (
              <p className={styles.directoryNote}>
                The complete field, alphabetically. Open a brief or select
                candidates to compare. Photo credits appear in each brief.
              </p>
            )}
            <div
              className={
                hasPortraits
                  ? styles.portraitDirectory
                  : styles.candidateChoices
              }
              role="group"
              aria-label="Candidates to compare"
            >
              {people.map((p) =>
                hasPortraits ? (
                  <div key={p.id} className={styles.directoryPerson}>
                    <a
                      className={styles.directoryLink}
                      href={`#${p.id}`}
                      onClick={() => setComparing(false)}
                    >
                      <CandidatePortrait person={p} />
                      <span className={styles.directoryName}>{p.name}</span>
                      <span className={styles.readBrief}>
                        Read their brief <span aria-hidden="true">↗</span>
                      </span>
                    </a>
                    <label className={styles.portraitChoice}>
                      <input
                        type="checkbox"
                        aria-label={`Compare ${p.name}`}
                        checked={selected.includes(p.id)}
                        disabled={
                          selected.length === 3 && !selected.includes(p.id)
                        }
                        onChange={() => toggle(p.id)}
                      />
                      Compare<span className={styles.srOnly}> {p.name}</span>
                    </label>
                  </div>
                ) : (
                  <label key={p.id} className={styles.choice}>
                    <input
                      type="checkbox"
                      checked={selected.includes(p.id)}
                      disabled={
                        selected.length === 3 && !selected.includes(p.id)
                      }
                      onChange={() => toggle(p.id)}
                    />
                    {p.name}
                  </label>
                ),
              )}
            </div>
          </>
        )}
      </div>
      {comparing && (
        <div
          className={styles.comparison}
          tabIndex={0}
          aria-label="Scrollable candidate comparison"
        >
          <table>
            <caption>
              Same questions, side by side. Policy statements are campaign
              positions; interpretation is the Lab’s analysis.
            </caption>
            <thead>
              <tr>
                <th scope="col">Compare</th>
                {compared.map((p) => (
                  <th key={p.id} scope="col">
                    {p.name}
                    <br />
                    <small>{p.affiliation}</small>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              <tr>
                <th scope="row">Proposed direction</th>
                {compared.map((p) => (
                  <td key={p.id}>{p.summary}</td>
                ))}
              </tr>
              <tr>
                <th scope="row">Specific commitments</th>
                {compared.map((p) => (
                  <td key={p.id}>
                    {p.priorities.length ? (
                      <ul>
                        {p.priorities.map((t) => (
                          <li key={t}>{t}</li>
                        ))}
                      </ul>
                    ) : (
                      p.missing
                    )}
                  </td>
                ))}
              </tr>
              <tr>
                <th scope="row">Our interpretation</th>
                {compared.map((p) => (
                  <td key={p.id}>{p.interpretation}</td>
                ))}
              </tr>
              <tr>
                <th scope="row">Checked record</th>
                {compared.map((p) => (
                  <td key={p.id}>
                    {p.record?.length
                      ? p.record.map((r, i) => (
                          <p key={i}>
                            {r.text} <a href={r.source.url}>Source</a>
                          </p>
                        ))
                      : "Independent record review not yet complete."}
                  </td>
                ))}
              </tr>
              <tr>
                <th scope="row">Open question</th>
                {compared.map((p) => (
                  <td key={p.id}>{p.question}</td>
                ))}
              </tr>
              <tr>
                <th scope="row">Read the sources</th>
                {compared.map((p) => (
                  <td key={p.id}>
                    {p.sources.map((s, i) => (
                      <p key={i}>
                        <a href={s.url}>{s.label}</a>
                        <br />
                        <small>{s.kind}</small>
                      </p>
                    ))}
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      )}
      <div className={styles.candidateGrid}>
        {(comparing ? compared : people).map((person) => (
          <Profile
            person={person}
            showPortrait={hasPortraits}
            key={person.id}
          />
        ))}
      </div>
    </>
  );
}
