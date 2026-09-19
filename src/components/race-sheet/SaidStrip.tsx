import Link from "next/link";
import type { FeaturedRow } from "@/lib/voters-guide/race-sheet";
import { SaidGlyph } from "./Glyph";
import styles from "./votes.module.css";

/**
 * What other candidates have said about the exact choice a featured vote
 * decided. Alphabetical, no sides, no group labels; the reader's eyes do
 * the grouping. With no placements the strip is one muted line and no
 * heading, identical for every row in that state.
 */
export default function SaidStrip({ row, raceId }: { row: FeaturedRow; raceId: string }) {
  if (row.said.length === 0) {
    return (
      <p className={styles.muted}>
        No other candidate addresses this exact choice in the sources we reviewed ({row.notAddressed} checked).
      </p>
    );
  }
  return (
    <div className={styles.strip}>
      <p className={styles.label}>What other candidates have said</p>
      <ul className={styles.saidList}>
        {row.said.map((entry) => (
          <li key={entry.id} className={styles.saidItem}>
            <Link href={`/voters-guide/${raceId}/${entry.id}`} prefetch={false}>
              {entry.name}
            </Link>
            <span className={styles.saidLine}>
              <SaidGlyph />
              <span>{entry.line}</span>
            </span>
            <a
              className={styles.chip}
              href={entry.source?.url ?? entry.sourceUrl}
              title={entry.source ? `${entry.source.evidence.kind} · ${entry.source.evidence.date}` : undefined}
            >
              {entry.source?.label ?? "Source"}
            </a>
          </li>
        ))}
      </ul>
      <p className={styles.muted}>Not addressed in their sources ({row.notAddressed})</p>
    </div>
  );
}
