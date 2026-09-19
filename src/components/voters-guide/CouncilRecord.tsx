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
          Seven topics. Seventeen matched votes since January 2025. See what
          your district’s incumbents protected, changed and agreed on.
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
              <p>{item.contrast}</p>
            </div>
            {item.readings && (
              <p className={styles.readingLabel}>
                What the record shows · our interpretation
              </p>
            )}
            <div className={styles.choiceOverview}>
              {incumbents.map((person) => (
                <div key={person.id} className={styles.choiceSummary}>
                  <div className={styles.recordPortrait}>
                    <CandidatePortrait person={person} compact />
                  </div>
                  <div>
                    <a href={`#${person.id}`}>{person.name} ↗</a>
                    <h4>
                      {item.readings?.[person.name]?.headline ??
                        decisionAccounts[decision.id][person.name].choice}
                    </h4>
                    <p>
                      {item.readings?.[person.name]?.text ??
                        decisionAccounts[decision.id][person.name].action}
                    </p>
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
            <p className={styles.disagreementTakeaway}>{item.takeaway}</p>
          </section>
        );
      })}
      <details className={styles.coverageMap}>
        <summary>What else has this Council taken up?</summary>
        <p>
          This comparison covers selected consequential choices, not every major
          debate. Continue into the source-linked Council dossiers for
          transportation funding, Street Response, the police-accountability
          system, arts-tax reform, water infrastructure, labor and governance.
          Those records are not yet synthesized into matched candidate accounts
          here.
        </p>
        <div className={styles.coverageLinks}>
          {[
            ["Transportation funding", "transportation-funding"],
            ["Portland Street Response", "portland-street-response"],
            ["Police-accountability system", "police-accountability"],
            ["Arts-tax reform", "arts-tax-reform"],
            ["Bull Run filtration", "bull-run-filtration"],
            ["Council governance", "new-council-governance"],
            ["All 24 topic dossiers", ""],
          ].map(([label, slug]) => (
            <a
              key={label}
              href={`https://council.portlandciviclab.org/topics${slug ? `/${slug}` : ""}`}
            >
              {label} ↗
            </a>
          ))}
        </div>
      </details>
      <p className={styles.disagreementFootnote}>
        Recorded choices and stated reasons are labeled separately.{" "}
        <a href="#compare">Compare every candidate’s plans below ↓</a>
      </p>
    </section>
  );
}
