"use client";
import { useId, useState } from "react";
import Link from "next/link";
import { ArrowRight, ArrowDown, ChevronDown, ExternalLink } from "lucide-react";
import type { Candidate } from "@/lib/voters-guide/types";
import type { SheetRow } from "@/lib/voters-guide/race-sheet";
import type { SourceChip } from "@/lib/voters-guide/race-sheet/source-chip";
import type { Issue } from "@/lib/voters-guide/race-sheet/issues";
import CandidatePortrait from "@/components/voters-guide/CandidatePortrait";
import { Gap, SaidGlyph, SrOnly } from "./Glyph";
import styles from "./race-sheet.module.css";
import c from "./controls.module.css";
import { SourceIcon } from "./SourceIcon";

/** CandidatePortrait wants a Candidate; a row has just the two fields it reads. */
export function portraitPerson(row: Pick<SheetRow, "name" | "portrait" | "id">): Candidate {
  return {
    id: row.id,
    name: row.name,
    portrait: row.portrait,
    affiliation: "",
    background: "",
    summary: "",
    priorities: [],
    interpretation: "",
    question: "",
    sources: [],
  };
}

/** A source chip: a button that expands kind · date · note, then the link. */
export function SourceChipButton({ chip, label, compact = false }: { chip: SourceChip; label?: string; compact?: boolean }) {
  const [open, setOpen] = useState(false);
  const id = useId();
  const e = chip.evidence;
  const text = label ?? chip.label;
  return (
    <span className={styles.sourceWrap}>
      <button
        type="button"
        className={compact ? `${c.source} ${c.sourceCompact}` : c.source}
        aria-expanded={open}
        aria-controls={id}
        onClick={() => setOpen((v) => !v)}
      >
        <SourceIcon venue={chip.venue} className={c.sourceVenueIcon} />
        <span>{text}</span>
        <SrOnly>, {chip.venue.toLowerCase()} source</SrOnly>
        <ChevronDown size={14} aria-hidden="true" className={c.sourceCaret} />
      </button>
      {open && (
        <span id={id} className={styles.sourceDetail}>
          <span className={styles.sourceMeta}>
            {e.kind} · {e.date}
          </span>
          {e.note && <span className={styles.sourceNote}>{e.note}</span>}
          <a href={chip.url} target="_blank" rel="noopener noreferrer" className={styles.sourceLink}>
            {e.label}
            <ExternalLink size={14} aria-hidden="true" />
            <SrOnly> (opens in a new tab)</SrOnly>
          </a>
        </span>
      )}
    </span>
  );
}

/* ── The card: the open body of a row ───────────────────────────────── */

export default function CandidateCard({
  row,
  raceId,
  issue,
}: {
  row: SheetRow;
  raceId: string;
  issue: Issue | null;
}) {
  const cell = issue ? row.cells[issue.id] : null;
  const priorities = row.priorities.slice(0, 3);
  const showReading = row.values.length > 0 || Boolean(row.tradeoff);

  return (
    <div className={styles.card}>
      {row.background !== row.role && <p className={styles.cardBackground}>{row.background}</p>}

      {row.missing ? (
        <div className={styles.cardBlock}>
          <p className={styles.eyebrow}>
            {row.missing === "filing-only" ? "Filing statement only" : "No platform found"}
          </p>
          {row.missing === "filing-only" && row.summary && (
            <p className={styles.cardSummary}>
              <SaidGlyph />
              {row.summary}
            </p>
          )}
          {row.missingText && <p className={styles.cardMissing}>{row.missingText}</p>}
        </div>
      ) : issue ? (
        <p className={styles.cardSummary}>{row.summary}</p>
      ) : null}

      {priorities.length > 0 && (
        <div className={styles.cardBlock}>
          <p className={styles.eyebrow}>Priorities</p>
          <ul className={styles.priorities}>
            {priorities.map((p) => (
              <li key={p}>
                <SaidGlyph />
                {p}
              </li>
            ))}
          </ul>
        </div>
      )}

      {showReading && (
        <div className={styles.cardBlock} data-layer="interpretation">
          <p className={styles.eyebrow}>Our reading</p>
          {row.values.length > 0 && (
            <ul className={styles.values} aria-label="Values we read in their statements">
              {row.values.map((v) => (
                <li key={v}>{v}</li>
              ))}
            </ul>
          )}
          {row.tradeoff && <p className={styles.tradeoff}>{row.tradeoff}</p>}
        </div>
      )}

      {issue && (
        <div className={styles.cardBlock} data-layer="position">
          <p className={styles.eyebrow}>{issue.label}</p>
          {cell?.position ? (
            <>
              <p className={styles.position}>
                <SaidGlyph />
                {cell.position}
              </p>
              {cell.source && <SourceChipButton chip={cell.source} />}
            </>
          ) : (
            <p className={styles.positionGap}>
              <Gap text="" /> No position on this question in the sources we reviewed.
            </p>
          )}
        </div>
      )}

      {row.answers.length > 0 && (
        <div className={styles.cardBlock} data-layer="answers">
          <p className={styles.eyebrow}>In their words</p>
          {row.answers.map((a) => (
            <div key={a.question} className={styles.answer}>
              <p className={styles.answerQuestion}>{a.question}</p>
              <p className={styles.answerText}>
                <SaidGlyph />
                {a.text}
              </p>
              <p className={styles.meta}>Received {a.received}</p>
            </div>
          ))}
        </div>
      )}

      <div className={styles.cardSource}>
        <span className={styles.metaLabel}>Primary source</span>
        <SourceChipButton chip={row.primarySource} />
      </div>

      <div className={styles.cardActions}>
        {row.incumbent && (
          <a href="#votes-panel" className={`${c.btn} ${c.quiet} ${c.small}`}>
            See their Council votes
            <ArrowDown size={16} aria-hidden="true" />
          </a>
        )}
        <Link href={`/voters-guide/${raceId}/${row.id}`} prefetch={false} className={`${c.btn} ${c.secondary} ${c.small}`}>
          Full brief
          <ArrowRight size={16} aria-hidden="true" />
        </Link>
      </div>
    </div>
  );
}
