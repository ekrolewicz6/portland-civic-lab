import type { ReactNode } from "react";
import type { VoteWord } from "@/lib/voters-guide/race-sheet";
import styles from "./glyph.module.css";

/**
 * The one glyph vocabulary for the guide. "Said" marks a candidate statement,
 * "Voted" marks a roll call, the dash marks a research gap. Every surface
 * (rows, cards, votes panel, ballot, brief, print) imports these so the page
 * reads as one object and screen readers hear the same words everywhere.
 */

export function SrOnly({ children }: { children: ReactNode }) {
  return <span className={styles.srOnly}>{children}</span>;
}

export function SaidGlyph({ label = "Said" }: { label?: string }) {
  return (
    <span className={styles.said} aria-hidden={label ? undefined : true}>
      <span className={`${styles.icon} ${styles.iconSaid}`} aria-hidden="true" />
      {label && <SrOnly>{label}: </SrOnly>}
    </span>
  );
}

export function VotedGlyph({ label = "Voted" }: { label?: string }) {
  return (
    <span className={styles.voted}>
      <span className={`${styles.icon} ${styles.iconVoted}`} aria-hidden="true" />
      {label && <SrOnly>{label}: </SrOnly>}
    </span>
  );
}

/** The identical gap marker for everyone: same markup, same color. */
export function Gap({ text = "not found in the sources we reviewed" }: { text?: string }) {
  return (
    <span className={styles.gap}>
      <span aria-hidden="true">—</span>
      <SrOnly>{text}</SrOnly>
    </span>
  );
}

/**
 * A recorded vote as a word, never color alone. `name` is announced to
 * screen readers so a row of pills stays attributable when the visible
 * column header is decorative.
 */
export function VotePill({ vote, name }: { vote: VoteWord; name?: string }) {
  return (
    <strong className={styles.pill} data-vote={vote}>
      {name && <SrOnly>{name}: </SrOnly>}
      <span className={`${styles.icon} ${styles.iconVoted}`} aria-hidden="true" />
      <span className={styles.word}>{vote}</span>
    </strong>
  );
}
