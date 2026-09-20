"use client";
import { Bookmark, ChevronDown } from "lucide-react";
import type { SheetRow } from "@/lib/voters-guide/race-sheet";
import type { Issue } from "@/lib/voters-guide/race-sheet/issues";
import CandidatePortrait from "@/components/voters-guide/CandidatePortrait";
import CandidateCard, { portraitPerson } from "./CandidateCard";
import { Gap, SaidGlyph, SrOnly } from "./Glyph";
import styles from "./race-sheet.module.css";

export function missingLabel(missing: SheetRow["missing"]) {
  return missing === "filing-only" ? "Filing statement only" : "No platform found";
}

/** What the row shows beside the name for the active chip. */
function Line({ row, issue }: { row: SheetRow; issue: Issue | null }) {
  if (issue) {
    const cell = row.cells[issue.id];
    if (cell.line) {
      return (
        <span className={styles.line}>
          <SaidGlyph />
          {cell.line}
        </span>
      );
    }
    if (row.missing) return <span className={styles.missingChip}>{missingLabel(row.missing)}</span>;
    return (
      <span className={styles.line}>
        <Gap text="Not found in the sources we reviewed" />
      </span>
    );
  }
  if (row.missing) return <span className={styles.missingChip}>{missingLabel(row.missing)}</span>;
  return <span className={`${styles.line} ${styles.lineClamp}`}>{row.summary}</span>;
}

export default function CandidateRow({
  row,
  raceId,
  issue,
  saved,
  onToggleSave,
}: {
  row: SheetRow;
  raceId: string;
  issue: Issue | null;
  saved: boolean;
  onToggleSave: (id: string) => void;
}) {
  const nameId = `name-${row.id}`;
  return (
    <article className={styles.row} id={`row-${row.id}`} data-candidate={row.id} aria-labelledby={nameId}>
      <button
        type="button"
        className={styles.save}
        aria-pressed={saved}
        aria-label={`Save ${row.name}`}
        onClick={() => onToggleSave(row.id)}
      >
        <Bookmark size={18} aria-hidden="true" fill={saved ? "currentColor" : "none"} />
      </button>
      <details className={styles.details}>
        <summary className={styles.summary}>
          <span className={styles.avatar}>
            <CandidatePortrait person={portraitPerson(row)} compact />
          </span>
          <span className={styles.who}>
            <span className={styles.name} id={nameId}>
              {row.name}
            </span>
            {/* Explicit separators: the three fields are flex items, so their
                text would otherwise run together for VoiceOver and copy-paste. */}
            <SrOnly>, </SrOnly>
            <span className={styles.role}>{row.role}</span>
            <SrOnly>, </SrOnly>
          </span>
          <span className={styles.lineCell}>
            <Line row={row} issue={issue} />
          </span>
          <ChevronDown size={16} aria-hidden="true" className={styles.chevron} />
        </summary>
        <CandidateCard row={row} raceId={raceId} issue={issue} />
      </details>
    </article>
  );
}
