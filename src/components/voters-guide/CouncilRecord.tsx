import Link from "next/link";
import { ChevronDown } from "lucide-react";
import { councilDecisions, type CouncilDecision } from "@/lib/voters-guide/council-decisions";
import { councilDisagreements, decisionAccounts } from "@/lib/voters-guide/council-record-accounts";
import type { Candidate, Evidence } from "@/lib/voters-guide/types";
import { councilReaderCopy } from "@/lib/voters-guide/council-reader-copy";
import { SrOnly, VotePill } from "@/components/race-sheet/Glyph";
import { ModaDisclosure } from "@/components/race-sheet/FourVotes";
import styles from "@/components/race-sheet/votes.module.css";

const MODA_DECISION_ID = "moda";

function Proof({ source }: { source: Evidence }) {
  return (
    <a href={source.url} className={styles.proof} title={`${source.kind} · ${source.date}`}>
      {source.label} <span aria-hidden="true">↗</span>
      <SrOnly> (external)</SrOnly>
    </a>
  );
}

/** One councilor's recorded action on one decision, with the stated reason and its proof. */
export function DecisionExplanation({ person, decision }: { person: Candidate; decision: CouncilDecision }) {
  const account = decisionAccounts[decision.id]?.[person.name];
  const vote = decision.votes[person.name];
  return (
    <div className={styles.account}>
      <p className={styles.accountHead}>
        <b>{person.name}</b>
        {vote ? <VotePill vote={vote} name={person.name} /> : <span className={styles.muted}>No vote in this record</span>}
      </p>
      {account ? (
        <>
          <p className={styles.accountChoice}>{account.choice}</p>
          <p className={styles.accountText}>{account.action}</p>
          {account.reason && (
            <p className={styles.accountText}>
              <span className={styles.accountReasonLabel}>{account.reason.label}.</span> {account.reason.text}
            </p>
          )}
          <p className={styles.proofs}>
            <Proof source={decision.source} />
            {account.actionSource && account.actionSource.url !== decision.source.url && <Proof source={account.actionSource} />}
            {account.reason && <Proof source={account.reason.source} />}
          </p>
        </>
      ) : (
        <p className={styles.muted}>No account of this vote in the record.</p>
      )}
    </div>
  );
}

/**
 * The full record: every Council topic since January 2025 as one disclosure
 * row, in the same idiom as the split matrix above it. Open a row for the
 * question Council faced, the context, our reading of each sitting
 * councilor's record, and beneath that every matched decision with the
 * recorded vote, the stated reason and the City record. A hash of
 * `#disagreement-{topic}` (from a brief or the race sheet) opens that row.
 */
export default function CouncilDisagreements({ people }: { people: Candidate[] }) {
  return (
    <div className={styles.record} id="disagreements">
      {councilDisagreements.map((item) => {
        const copy = councilReaderCopy[item.id];
        const decisions = item.decisionIds.map((id) => councilDecisions.find((d) => d.id === id)!).filter(Boolean);
        const first = decisions[0];
        const incumbents = people.filter((p) => first && first.votes[p.name]);
        const n = decisions.length;
        return (
          <details key={item.id} id={`disagreement-${item.id}`} className={`${styles.row} ${styles.topic}`} data-record>
            <summary className={styles.topicSummary}>
              <ChevronDown className={styles.chevron} size={16} aria-hidden="true" />
              <span className={styles.topicLabel}>
                <b>{item.label}</b>
                <span className={styles.recordQuestion}>
                  {item.question} <span className={styles.recordCount}>· {n} {n === 1 ? "decision" : "decisions"}</span>
                </span>
              </span>
            </summary>
            <div className={styles.recordBody}>
              <p className={styles.recordContrast}>{copy?.contrast ?? item.contrast}</p>
              <p className={styles.note}>{copy?.context ?? item.context}</p>

              {copy?.readings && incumbents.length > 0 && (
                <div>
                  <p className={styles.label}>Our reading of the record</p>
                  <div className={styles.readingCards}>
                    {incumbents.map((person) => {
                      const reading = copy.readings[person.name];
                      return (
                        <div key={person.id} className={styles.readingCard} data-reader-candidate={person.id}>
                          <b>{person.name}</b>
                          <h4>{reading.headline}</h4>
                          {reading.text.split("\n\n").map((paragraph, i) => (
                            <p key={i}>{paragraph}</p>
                          ))}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              <details className={styles.decisions}>
                <summary>
                  <ChevronDown size={14} aria-hidden="true" className={styles.decisionsCaret} />
                  {n === 1 ? "The decision, the votes and the stated reasons" : `The ${n} decisions, the votes and the stated reasons`}
                </summary>
                <div className={styles.decisionList}>
                  {decisions.map((entry) => (
                    <section key={entry.id} className={styles.decision} aria-label={entry.title}>
                      <p className={styles.decisionDate}>{entry.source.date}</p>
                      <h4 className={styles.decisionTitle}>{entry.title}</h4>
                      <p className={styles.note}>{entry.summary}</p>
                      {entry.id === MODA_DECISION_ID && <ModaDisclosure />}
                      <div className={styles.accounts}>
                        {incumbents.map((person) => (
                          <DecisionExplanation key={person.id} person={person} decision={entry} />
                        ))}
                      </div>
                      <p className={styles.limit}>{entry.limit}</p>
                    </section>
                  ))}
                  {item.sources.length > 0 && (
                    <p className={styles.proofs}>
                      {item.sources.map((source) => (
                        <Proof source={source} key={source.url} />
                      ))}
                    </p>
                  )}
                </div>
              </details>

              {copy?.takeaway && <p className={styles.takeaway}>{copy.takeaway}</p>}
            </div>
          </details>
        );
      })}
      <p className={styles.recordFoot}>
        Reviewed through September 18, 2026. A vote, a stated reason and our interpretation are distinct. “Not on
        committee” means the member had no vote in that committee; “Absent” means they missed that roll call.{" "}
        <Link href="/voters-guide/methodology#council-coverage">How we checked topic coverage</Link>
      </p>
    </div>
  );
}
