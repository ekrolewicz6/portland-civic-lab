"use client";
import Link from "next/link";
import { ArrowRight, ExternalLink, Globe, Vote, X } from "lucide-react";
import type { SheetRow } from "@/lib/voters-guide/race-sheet";
import type { Issue } from "@/lib/voters-guide/race-sheet/issues";
import CandidatePortrait from "@/components/voters-guide/CandidatePortrait";
import Ladder from "./Ladder";
import { portraitPerson, SourceChipButton } from "./CandidateCard";
import { Gap, SaidGlyph } from "./Glyph";
import { IssueIcon } from "./IssueIcon";
import styles from "./stance.module.css";
import c from "./controls.module.css";

/**
 * What opens under a grid cell. One frame for every candidate and every
 * column: who (portrait, name, role), the question being answered, then the
 * ladder (what, how, measured by) with a source on each rung. Interpretation
 * stays labeled; the candidate's words stay attributed. Gaps are named as
 * gaps. The office's own choices open on the boards beneath the grid instead.
 */
export default function StanceDetail({
  row,
  issue,
  raceId,
  id,
  onClose,
}: {
  row: SheetRow;
  issue: Issue | null;
  raceId: string;
  id: string;
  onClose: () => void;
}) {
  const cell = issue ? row.cells[issue.id] : null;
  const position = cell ? (cell.position ?? cell.line) : null;
  const briefHref = `/voters-guide/${raceId}/${row.id}`;
  const question = issue ? issue.question : null;
  const website = row.contact.channels.find((ch) => ch.kind === "website") ?? null;

  return (
    <div className={styles.detail} id={id} data-issue={issue?.id ?? "summary"}>
      <header className={styles.detailHead}>
        <span className={styles.detailPortrait}>
          <CandidatePortrait person={portraitPerson(row)} compact />
        </span>
        <div className={styles.detailWho}>
          <p className={styles.detailTitle}>
            <Link href={briefHref} prefetch={false} className={styles.detailName}>
              {row.name}
            </Link>
            <span className={styles.detailOn}>
              {" "}
              on {issue?.label.toLowerCase()}
            </span>
          </p>
          <p className={styles.detailRole}>{row.role}</p>
        </div>
        <div className={styles.detailHeadActions}>
          {website && (
            <a href={website.url} className={`${c.btn} ${c.quiet} ${c.small}`} rel="noopener noreferrer" target="_blank">
              <Globe size={15} aria-hidden="true" /> Site <ExternalLink size={12} aria-hidden="true" />
              <span className={styles.srOnly}> (opens in a new tab)</span>
            </a>
          )}
          <Link href={briefHref} prefetch={false} className={`${c.btn} ${c.secondary} ${c.small}`}>
            Full brief <ArrowRight size={15} aria-hidden="true" />
          </Link>
          <button type="button" className={`${c.btn} ${c.icon} ${styles.detailClose}`} onClick={onClose} aria-label="Close">
            <X size={18} aria-hidden="true" />
          </button>
        </div>
      </header>

      {question && (
        <h3 className={styles.detailQuestion}>
          {issue && <IssueIcon issue={issue.id} size={18} />}
          <span>{question}</span>
        </h3>
      )}

      {issue && cell && position ? (
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
          <span className={c.gapNote}>
            <Gap text="" /> Not found
          </span>
          <span className={styles.detailGapText}>Not found in the sources we reviewed. That is a research gap, not a position.</span>
        </p>
      )}

      {row.missingText && <p className={styles.detailFull}>{row.missingText}</p>}

      {row.incumbent && (
        <div className={`${c.row} ${styles.detailActions}`}>
          <a href="#votes-panel" className={`${c.btn} ${c.quiet} ${c.small}`}>
            <Vote size={15} aria-hidden="true" /> Their Council votes
          </a>
        </div>
      )}
    </div>
  );
}
