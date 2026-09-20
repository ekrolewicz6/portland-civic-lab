"use client";
import Link from "next/link";
import { ArrowRight, X } from "lucide-react";
import type { SheetRow } from "@/lib/voters-guide/race-sheet";
import type { Issue } from "@/lib/voters-guide/race-sheet/issues";
import { SourceChipButton } from "./CandidateCard";
import { Gap, SaidGlyph } from "./Glyph";
import { IssueIcon } from "./IssueIcon";
import styles from "./stance.module.css";

/**
 * What opens under a grid cell: the sourced sentence behind the chip, the
 * full position with its qualifier, the source, and the way to the brief.
 * Interpretation stays labeled; the candidate's words stay attributed.
 */
export default function StanceDetail({
  row,
  issue,
  raceId,
  id,
  onClose,
}: {
  row: SheetRow;
  issue: Issue;
  raceId: string;
  id: string;
  onClose: () => void;
}) {
  const cell = row.cells[issue.id];
  const position = cell.position ?? cell.line;
  return (
    <div className={styles.detail} id={id} data-issue={issue.id}>
      <div className={styles.detailHead}>
        <p className={styles.detailTitle}>
          <IssueIcon issue={issue.id} />
          <span>
            <Link href={`/voters-guide/${raceId}/${row.id}`} prefetch={false} className={styles.detailName}>
              {row.name}
            </Link>{" "}
            on {issue.label.toLowerCase()}
          </span>
        </p>
        <button type="button" className={styles.detailClose} onClick={onClose} aria-label="Close">
          <X size={16} aria-hidden="true" />
        </button>
      </div>

      {position ? (
        <>
          <p className={styles.detailLine}>
            <SaidGlyph />
            {position}
          </p>
          <div className={styles.detailMeta}>
            {cell.source && <SourceChipButton chip={cell.source} />}
            <span className={styles.detailNote}>Our paraphrase of the candidate’s statement.</span>
          </div>
        </>
      ) : (
        <p className={styles.detailGap}>
          <Gap /> Not found in the sources we reviewed. That is a research gap, not a position.
        </p>
      )}

      {row.missingText && <p className={styles.detailFull}>{row.missingText}</p>}

      <div className={styles.detailActions}>
        <Link href={`/voters-guide/${raceId}/${row.id}`} prefetch={false} className={styles.detailBrief}>
          Full brief <ArrowRight size={14} aria-hidden="true" />
        </Link>
        {row.incumbent && (
          <a href="#votes-panel" className={styles.detailVotes}>
            See their Council votes ↓
          </a>
        )}
      </div>
    </div>
  );
}
