"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  councilDecisions,
  type CouncilDecision,
} from "@/lib/voters-guide/council-decisions";
import {
  councilDisagreements,
  decisionAccounts,
} from "@/lib/voters-guide/council-record-accounts";
import type { Candidate, Evidence } from "@/lib/voters-guide/types";
import { councilReaderCopy } from "@/lib/voters-guide/council-reader-copy";
import CandidatePortrait from "./CandidatePortrait";
import styles from "@/app/(public)/voters-guide/guide.module.css";

function Proof({ source }: { source: Evidence }) {
  return (
    <a href={source.url} title={`${source.kind} · ${source.date}`}>
      {source.label} ↗
    </a>
  );
}

export function DecisionExplanation({
  person,
  decision,
  identity = false,
}: {
  person: Candidate;
  decision: CouncilDecision;
  identity?: boolean;
}) {
  const account = decisionAccounts[decision.id]?.[person.name];
  const vote = decision.votes[person.name];
  return (
    <div className={styles.recordAccount}>
      {identity && (
        <header className={styles.recordIdentity}>
          <div className={styles.recordPortrait}>
            <CandidatePortrait person={person} compact />
          </div>
          <a href={`#${person.id}`}>{person.name} ↗</a>
        </header>
      )}
      <div className={styles.recordVote}>
        <span>{decision.voteLabel ?? "Final vote"}</span>
        <strong data-vote={vote ?? "unknown"}>
          {vote ?? "No vote in this record"}
        </strong>
      </div>
      {account ? (
        <>
          <h4>{account.choice}</h4>
          <p>{account.action}</p>
          {account.reason && (
            <div className={styles.statedReason}>
              <h5>{account.reason.label}</h5>
              <p>{account.reason.text}</p>
            </div>
          )}
          <div className={styles.recordProof}>
            <Proof source={decision.source} />
            {account.actionSource &&
              account.actionSource.url !== decision.source.url && (
                <Proof source={account.actionSource} />
              )}
            {account.reason && <Proof source={account.reason.source} />}
          </div>
        </>
      ) : (
        <p>
          Compare this candidate’s stated plans using the issue buttons above.
        </p>
      )}
    </div>
  );
}

export function CouncilIssuePicker({
  value,
  onChange,
  label = "Choose a Council issue",
}: {
  value: string;
  onChange: (id: string) => void;
  label?: string;
}) {
  return (
    <label className={styles.councilIssuePicker}>
      <span>{label}</span>
      <select value={value} onChange={(event) => onChange(event.target.value)}>
        {councilDisagreements.map((item) => (
          <option key={item.id} value={item.id}>
            {item.label}
          </option>
        ))}
      </select>
    </label>
  );
}

export default function CouncilDisagreements({
  people,
}: {
  people: Candidate[];
}) {
  const [active, setActive] = useState("supplemental-budget");
  useEffect(() => {
    let frame = 0;
    const restore = () => {
      const id = window.location.hash.replace("#disagreement-", "");
      if (councilDisagreements.some((item) => item.id === id)) {
        setActive(id);
        // The target starts hidden in server HTML. Scroll after React reveals it.
        window.cancelAnimationFrame(frame);
        frame = window.requestAnimationFrame(() => {
          document.getElementById(`disagreement-${id}`)?.scrollIntoView();
        });
      }
    };
    restore();
    window.addEventListener("hashchange", restore);
    return () => {
      window.removeEventListener("hashchange", restore);
      window.cancelAnimationFrame(frame);
    };
  }, []);
  function choose(id: string) {
    setActive(id);
    window.history.replaceState(null, "", `#disagreement-${id}`);
  }
  return (
    <section
      className={styles.disagreements}
      aria-labelledby="disagreement-heading"
      id="disagreements"
    >
      <div className={styles.disagreementHeading}>
        <div>
          <div className={styles.eyebrow}>
            Start with the choices that divided Council
          </div>
          <h2 id="disagreement-heading">
            Where they <em>disagree.</em>
          </h2>
        </div>
        <p>
          {councilDisagreements.length} issues. {councilDecisions.length}{" "}
          matched decisions since January 2025. Understand the proposal, compare
          your incumbents’ choices, then read the votes and their explanations.
        </p>
      </div>
      <div className={styles.issueNavigation}>
        <CouncilIssuePicker value={active} onChange={choose} />
        <div
          className={styles.disagreementPicker}
          role="group"
          aria-label="Key Council issues"
        >
          {["supplemental-budget", "zenith", "water", "transportation"].map(
            (id) => {
              const item = councilDisagreements.find(
                (entry) => entry.id === id,
              )!;
              return (
                <button
                  key={id}
                  onClick={() => choose(id)}
                  aria-pressed={active === id}
                  aria-controls={`disagreement-${id}`}
                >
                  {item.label}
                </button>
              );
            },
          )}
        </div>
      </div>
      {councilDisagreements.map((item) => {
        const copy = councilReaderCopy[item.id];
        const decisions = item.decisionIds.map((id) =>
          councilDecisions.find((d) => d.id === id)!,
        );
        const decision = decisions[0];
        const incumbents = people.filter((p) => decision.votes[p.name]);
        return (
          <section
            key={item.id}
            id={`disagreement-${item.id}`}
            aria-labelledby={`${item.id}-question`}
            data-active={active === item.id}
            className={styles.disagreementPanel}
          >
            <div className={styles.disagreementContext}>
              <h3 id={`${item.id}-question`}>{item.question}</h3>
              <p className={styles.issueContrast}>{copy.contrast}</p>
              <p>{copy.context}</p>
            </div>
            {copy.readings && (
              <p className={styles.readingLabel}>
                What the record shows · our interpretation
              </p>
            )}
            <div className={styles.choiceOverview}>
              {incumbents.map((person) => (
                <div key={person.id} className={styles.choiceSummary} data-reader-candidate={person.id}>
                  <div className={styles.recordPortrait}>
                    <CandidatePortrait person={person} compact />
                  </div>
                  <div>
                    <a href={`#${person.id}`}>{person.name} ↗</a>
                    <h4>
                      {copy.readings[person.name].headline}
                    </h4>
                    {copy.readings[person.name].text.split("\n\n").map((paragraph, i) => <p key={i}>{paragraph}</p>)}
                  </div>
                </div>
              ))}
            </div>
            <details className={styles.disagreementEvidence}>
              <summary>Read the decisions and reasons</summary>
              <div className={styles.disagreementContext}>
                <div className={styles.recordProof}>
                  {(item.sources.length ? item.sources : [decision.source]).map(
                    (source) => (
                      <Proof source={source} key={source.url} />
                    ),
                  )}
                </div>
              </div>
              <div className={styles.decisionTimeline}>
                {decisions.map((entry) => (
                  <section key={entry.id} className={styles.timelineDecision}>
                    <div className={styles.eyebrow}>{entry.source.date}</div>
                    <h4>{entry.title}</h4>
                    <p>{entry.summary}</p>
                    <div className={styles.disagreementGrid}>
                      {incumbents.map((person) => (
                        <DecisionExplanation
                          key={person.id}
                          person={person}
                          decision={entry}
                          identity
                        />
                      ))}
                    </div>
                    <p className={styles.decisionLimit}>{entry.limit}</p>
                  </section>
                ))}
              </div>
            </details>
            <p className={styles.disagreementTakeaway}>{copy.takeaway}</p>
          </section>
        );
      })}
      <details className={styles.coverageMap}>
        <summary>Browse all {councilDisagreements.length} issues</summary>
        <p>
          The comparison covers every subject in the Council site’s 24-topic
          index, plus major decisions on labor, children’s services, policing,
          campaign finance and other City responsibilities. Select an issue to
          read its matched accounts here.
        </p>
        <div className={styles.coverageLinks}>
          {councilDisagreements.map((item) => (
            <a
              key={item.id}
              href={`#disagreement-${item.id}`}
              onClick={() => setActive(item.id)}
            >
              {item.label} →
            </a>
          ))}
        </div>
        <p>
          <Link href="/voters-guide/methodology#council-coverage">
            How we checked topic coverage ↗
          </Link>
        </p>
      </details>
      <p className={styles.disagreementFootnote}>
        Reviewed through September 18, 2026. A vote, a stated reason and our
        interpretation are distinct. “Not on committee” means the member had no
        vote in that committee; “Absent” means they missed that roll call.{" "}
        <a href="#compare">Compare every candidate’s plans →</a>
      </p>
    </section>
  );
}
