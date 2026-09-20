import Link from "next/link";
import { ChevronDown, ArrowRight } from "lucide-react";
import type { FeaturedRow, RaceSheet } from "@/lib/voters-guide/race-sheet";
import { surname } from "@/lib/voters-guide/race-sheet/council-splits";
import { VotePill } from "./Glyph";
import SaidStrip from "./SaidStrip";
import styles from "./votes.module.css";
import c from "./controls.module.css";

/* ── Helpers ────────────────────────────────────────────────────────── */

export function joinNames(names: string[]) {
  if (names.length <= 1) return names.join("");
  if (names.length === 2) return `${names[0]} and ${names[1]}`;
  return `${names.slice(0, -1).join(", ")} and ${names[names.length - 1]}`;
}

/**
 * The founder-conflict line for any Moda row. It lives inside the
 * <summary> so a reader sees it while the row is still collapsed.
 */
export function ModaDisclosure() {
  return (
    <p className={styles.disclosure}>
      Disclosure: the Lab’s founder runs an advocacy campaign about the Moda deal.{" "}
      <Link href="/independence" prefetch={false} className={c.inlineLink}>
        Read our independence policy
      </Link>
    </p>
  );
}

/**
 * One councilor's vote. On phones the surname sits above the word; at
 * ≥600px the shared column header carries the full names. The pill itself
 * always announces the full name, so the visible label is decorative.
 */
function VoteCell({ vote }: { vote: FeaturedRow["votes"][number] }) {
  return (
    <div className={styles.cell}>
      <span className={styles.cellName} aria-hidden="true">
        {surname(vote.name)}
      </span>
      <VotePill vote={vote.vote} name={vote.name} />
    </div>
  );
}

/* ── Panel ──────────────────────────────────────────────────────────── */

function FeaturedVote({ row, raceId, open }: { row: FeaturedRow; raceId: string; open: boolean }) {
  const withReading = row.votes.filter((v) => v.headline);
  const votesHref = `/voters-guide/${raceId}/votes${row.topicId ? `#${row.topicId}` : ""}`;
  return (
    <details className={styles.row} id={`vote-${row.questionId}`} open={open || undefined}>
      <summary className={styles.summary}>
        <div className={styles.summaryHead}>
          <ChevronDown className={styles.chevron} size={16} aria-hidden="true" />
          <div className={styles.summaryText}>
            <h3 className={styles.question}>{row.title}</h3>
            {row.isModa && <ModaDisclosure />}
          </div>
        </div>
        <div className={styles.votesGrid}>
          {row.votes.map((vote) => (
            <VoteCell key={vote.id} vote={vote} />
          ))}
        </div>
      </summary>
      <div className={styles.body}>
        <p className={styles.note}>{row.context}</p>

        {withReading.length > 0 && (
          <div>
            <p className={styles.label}>Our reading of the record</p>
            <ul className={styles.reading}>
              {withReading.map((vote) => (
                <li key={vote.id}>
                  <b>
                    <Link href={`/voters-guide/${raceId}/${vote.id}`} prefetch={false}>
                      {vote.name}
                    </Link>
                  </b>
                  <span>{vote.headline}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        <p className={styles.limit}>{row.decision.limit}</p>

        <SaidStrip row={row} raceId={raceId} />

        <Link className={`${c.btn} ${c.secondary} ${c.small}`} href={votesHref} prefetch={false}>
          Read the votes and their reasons <ArrowRight size={15} aria-hidden="true" />
        </Link>
      </div>
    </details>
  );
}

export default function FourVotes({ sheet }: { sheet: RaceSheet }) {
  const { incumbents, rows, featured, race } = sheet;
  const others = rows.length - incumbents.length;
  const intro =
    incumbents.length > 0
      ? `Only ${joinNames(incumbents.map((p) => p.name))} ${incumbents.length === 1 ? "sits" : "sit"} on Council today. The other ${others} candidate${others === 1 ? "" : "s"} ${others === 1 ? "has" : "have"} no votes yet; that is not a judgment.`
      : `None of the ${rows.length} candidates sits on Council today, so none has a Council vote yet; that is not a judgment.`;

  return (
    <section id="votes-panel" className={`${styles.votes} ${styles.panel}`} aria-labelledby="votes-panel-heading">
      <p className={styles.eyebrow}>Recorded votes</p>
      <h2 id="votes-panel-heading" className={styles.heading}>
        Four votes that split this Council
      </h2>
      <p className={styles.intro}>{intro}</p>

      {featured.length > 0 ? (
        <>
          <div className={styles.columns} aria-hidden="true">
            <span />
            <div className={styles.columnsInner}>
              {incumbents.map((p) => (
                <Link key={p.id} href={`/voters-guide/${race.id}/${p.id}`} prefetch={false}>
                  {p.name}
                </Link>
              ))}
            </div>
          </div>
          {featured.map((row, i) => (
            <FeaturedVote key={row.questionId} row={row} raceId={race.id} open={i === 0} />
          ))}
        </>
      ) : (
        <p className={styles.muted}>No featured votes for this race yet.</p>
      )}
    </section>
  );
}
