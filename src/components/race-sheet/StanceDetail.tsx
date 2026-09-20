"use client";
import Link from "next/link";
import { ArrowRight, X } from "lucide-react";
import type { SheetRow } from "@/lib/voters-guide/race-sheet";
import type { Issue } from "@/lib/voters-guide/race-sheet/issues";
import type { ExtraTopic } from "@/lib/voters-guide/race-sheet/types";
import Ladder from "./Ladder";
import { VotePill } from "./Glyph";
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
  topic,
  raceId,
  id,
  onClose,
}: {
  row: SheetRow;
  issue: Issue | null;
  topic?: ExtraTopic | null;
  raceId: string;
  id: string;
  onClose: () => void;
}) {
  const cell = issue ? row.cells[issue.id] : null;
  const position = cell ? (cell.position ?? cell.line) : null;
  const tc = topic ? row.topicCells[topic.id] : null;
  return (
    <div className={styles.detail} id={id} data-issue={issue?.id ?? "topic"}>
      <div className={styles.detailHead}>
        <p className={styles.detailTitle}>
          {issue && <IssueIcon issue={issue.id} />}
          <span>
            <Link href={`/voters-guide/${raceId}/${row.id}`} prefetch={false} className={styles.detailName}>
              {row.name}
            </Link>{" "}
            on {issue ? issue.label.toLowerCase() : topic?.label}
          </span>
        </p>
        <button type="button" className={styles.detailClose} onClick={onClose} aria-label="Close">
          <X size={16} aria-hidden="true" />
        </button>
      </div>

      {topic && tc ? (
        <>
          <p className={styles.detailQuestion}>{topic.question}</p>
          {tc.vote && (
            <p className={styles.detailLine}>
              <VotePill vote={tc.vote} /> <span className={styles.detailVoteNote}>Recorded Council vote.</span>
            </p>
          )}
          {tc.text ? (
            <>
              <p className={styles.detailLine}>
                <SaidGlyph />
                {tc.text}
              </p>
              <div className={styles.detailMeta}>
                {tc.source && <SourceChipButton chip={tc.source} />}
                <span className={styles.detailNote}>Our paraphrase of the candidate’s statement.</span>
              </div>
            </>
          ) : !tc.vote ? (
            <p className={styles.detailGap}>
              <Gap />{" "}
              {tc.askedOn
                ? `No statement on this choice in their sources. We asked the candidate on ${tc.askedOn}; no reply yet.`
                : "No statement on this exact choice in the sources we reviewed. That is a research gap, not a position."}
            </p>
          ) : null}
          <p className={styles.detailContext}>{topic.context}</p>
        </>
      ) : issue && cell && position ? (
        <Ladder
          ladder={row.ladder[issue.id]}
          what={
            <>
              <span className={styles.rungText}>
                <SaidGlyph />
                {position}
              </span>
              {cell.source && <SourceChipButton chip={cell.source} />}
            </>
          }
        />
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
