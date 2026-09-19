"use client";

import { useState } from "react";
import {
  councilDecisions,
  type CouncilDecision,
} from "@/lib/voters-guide/council-decisions";
import {
  councilDisagreements,
  decisionAccounts,
} from "@/lib/voters-guide/council-record-accounts";
import type { Candidate, Evidence } from "@/lib/voters-guide/types";
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
        <span>Final vote</span>
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

export default function CouncilDisagreements({
  people,
}: {
  people: Candidate[];
}) {
  const [active, setActive] = useState("supplemental-budget");
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
          Three decisions. Your district’s incumbents. See the alternatives they
          backed and the reasons they put on the record.
        </p>
      </div>
      <div
        className={styles.disagreementPicker}
        role="group"
        aria-label="Council disagreements"
      >
        {councilDisagreements.map((item, index) => (
          <button
            key={item.id}
            onClick={() => setActive(item.id)}
            aria-pressed={active === item.id}
            aria-controls={`disagreement-${item.id}`}
          >
            <span aria-hidden="true">0{index + 1}</span>
            {item.label}
          </button>
        ))}
      </div>
      {councilDisagreements.map((item) => {
        const decision = councilDecisions.find((d) => d.id === item.id)!;
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
              <p>{item.contrast}</p>
            </div>
            <div className={styles.choiceOverview}>
              {incumbents.map((person) => (
                <div key={person.id} className={styles.choiceSummary}>
                  <div className={styles.recordPortrait}>
                    <CandidatePortrait person={person} compact />
                  </div>
                  <div>
                    <a href={`#${person.id}`}>{person.name} ↗</a>
                    <h4>{decisionAccounts[item.id][person.name].choice}</h4>
                  </div>
                </div>
              ))}
            </div>
            <details className={styles.disagreementEvidence}>
              <summary>Read the decisions and reasons</summary>
              <div className={styles.disagreementContext}>
                <p>{item.context}</p>
                <div className={styles.recordProof}>
                  {(item.sources.length ? item.sources : [decision.source]).map(
                    (source) => (
                      <Proof source={source} key={source.url} />
                    ),
                  )}
                </div>
              </div>
              <div className={styles.disagreementGrid}>
                {incumbents.map((person) => (
                  <DecisionExplanation
                    key={person.id}
                    person={person}
                    decision={decision}
                    identity
                  />
                ))}
              </div>
            </details>
            <p className={styles.disagreementTakeaway}>{item.takeaway}</p>
          </section>
        );
      })}
      <p className={styles.disagreementFootnote}>
        Recorded choices and stated reasons are labeled separately.{" "}
        <a href="#compare">Compare every candidate’s plans below ↓</a>
      </p>
    </section>
  );
}
