import { ChevronDown } from "lucide-react";
import type { Race } from "@/lib/voters-guide/types";
import { splitIssues, surname, type SplitDecision, type SplitTopic } from "@/lib/voters-guide/race-sheet/council-splits";
import { joinNames, ModaDisclosure } from "./FourVotes";
import { VotePill } from "./Glyph";
import styles from "./votes.module.css";

const OPEN_BY_DEFAULT = "supplemental-budget";
const MODA_DECISION_ID = "moda";

/* Opens the <details> a hash points at (e.g. /votes#moda from the race
   sheet), then scrolls to it. No framework needed for a static page. */
const openTargeted = `(function(){function go(){var h=location.hash.slice(1);if(!h)return;var el=document.getElementById(h);if(el&&el.tagName==="DETAILS"&&el.hasAttribute("data-topic")){el.open=true;el.scrollIntoView({block:"start"});}}go();addEventListener("hashchange",go);})();`;

function countLine(topic: SplitTopic) {
  const n = topic.decisions.length;
  if (n === 1) return "Split on its one vote";
  return `Split on ${topic.splitCount} of ${n} votes`;
}

function DecisionRow({ entry }: { entry: SplitDecision }) {
  const { decision, votes, split } = entry;
  return (
    <div className={styles.decisionRow} role="row" data-split={split || undefined}>
      <div className={styles.decisionHead} role="rowheader">
        <b>{decision.title}</b>
        <span className={styles.decisionMeta}>
          <a href={decision.source.url} aria-label={`City record, ${decision.source.date} (external)`}>
            {decision.source.date} <span aria-hidden="true">↗</span>
          </a>
          {split && <span className={styles.splitTag}>Split</span>}
        </span>
        {decision.id === MODA_DECISION_ID && <ModaDisclosure />}
      </div>
      <div className={styles.decisionVotes}>
        {votes.map((vote) => (
          <div key={vote.name} className={styles.cell} role="cell">
            <span className={styles.cellName} aria-hidden="true">
              {surname(vote.name)}
            </span>
            <VotePill vote={vote.vote} name={vote.name} />
          </div>
        ))}
      </div>
    </div>
  );
}

function Topic({ topic, incumbents, open }: { topic: SplitTopic; incumbents: { id: string; name: string }[]; open: boolean }) {
  return (
    <details className={`${styles.row} ${styles.topic}`} id={topic.id} data-topic open={open || undefined}>
      <summary className={styles.topicSummary}>
        <ChevronDown className={styles.chevron} size={16} aria-hidden="true" />
        <span className={styles.topicLabel}>
          <b>{topic.label}</b>
          <span>{countLine(topic)}</span>
        </span>
      </summary>
      <div className={styles.topicBody}>
        <div className={styles.table} role="table" aria-label={`${topic.label}: how each councilor voted`}>
          <div className={styles.headerRow} role="row">
            <span role="columnheader">Decision</span>
            {incumbents.map((p) => (
              <span key={p.id} role="columnheader">
                {p.name}
              </span>
            ))}
          </div>
          {topic.decisions.map((entry) => (
            <DecisionRow key={entry.decision.id} entry={entry} />
          ))}
        </div>
        <p className={styles.contrast}>
          <b>All six councilors:</b> {topic.contrast}
        </p>
      </div>
    </details>
  );
}

/**
 * The split-sorted matrix: every Council topic where this district's
 * sitting councilors divided, most split first, budget open by default.
 * Topics where they agreed are listed, not hidden.
 */
export default function VoteMatrix({ race }: { race: Race }) {
  const { topics, agreed, incumbents } = splitIssues(race);
  const hasBudget = topics.some((t) => t.id === OPEN_BY_DEFAULT);

  return (
    <section className={`${styles.votes} ${styles.matrix}`} aria-labelledby="vote-matrix-heading">
      <div className={styles.matrixHead}>
        <p className={styles.eyebrow}>Where they split</p>
        <h2 id="vote-matrix-heading" className={styles.heading}>
          {topics.length === 0
            ? "No split votes among these councilors"
            : `${topics.length} issue${topics.length === 1 ? "" : "s"} where they split`}
        </h2>
        <p className={styles.note}>
          A split means at least one Yes and one No among {joinNames(incumbents.map((p) => p.name))}. Absences and
          committee seats never count as a split. Most divided first.
        </p>
      </div>

      {topics.map((topic, i) => (
        <Topic
          key={topic.id}
          topic={topic}
          incumbents={incumbents}
          open={hasBudget ? topic.id === OPEN_BY_DEFAULT : i === 0}
        />
      ))}

      {agreed.length > 0 && (
        <div className={styles.agreed}>
          <p className={styles.eyebrow}>Agreed on every vote</p>
          <ul className={styles.agreedList}>
            {agreed.map((topic) => (
              <li key={topic.id}>
                {topic.label}
                <span>
                  {topic.decisions} {topic.decisions === 1 ? "decision" : "decisions"}
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}

      <script dangerouslySetInnerHTML={{ __html: openTargeted }} />
    </section>
  );
}
