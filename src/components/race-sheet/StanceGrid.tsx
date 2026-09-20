"use client";
import { Fragment, useCallback, useState } from "react";
import Link from "next/link";
import { Bookmark, BookmarkCheck } from "lucide-react";
import type { SheetRow } from "@/lib/voters-guide/race-sheet";
import { issues, type IssueId } from "@/lib/voters-guide/race-sheet/issues";
import type { ExtraTopic } from "@/lib/voters-guide/race-sheet/types";
import { VotePill } from "./Glyph";
import CandidatePortrait from "@/components/voters-guide/CandidatePortrait";
import { portraitPerson } from "./CandidateCard";
import { missingLabel } from "./CandidateRow";
import { Gap, SrOnly } from "./Glyph";
import { IssueIcon } from "./IssueIcon";
import StanceDetail from "./StanceDetail";
import styles from "./stance.module.css";
import c from "./controls.module.css";

/**
 * Where they stand: every candidate × every issue in one grid. On desktop a
 * real table with sticky column headers; on phones each row restyles into a
 * portrait card with the four chips, same markup, same semantics. A chip is
 * our ≤4-word reading of a sourced statement; tapping it opens the sentence
 * and the source. Columns are tinted by topic, never by side. Order is A–Z.
 */

/** Until a chip is authored, fall back to the first words of the line. */
function fallbackChip(line: string | null, position: string | null): string | null {
  const text = line ?? position;
  if (!text) return null;
  const words = text.replace(/[.;,].*$/, "").split(/\s+/).slice(0, 4);
  return words.join(" ") + (words.length < text.split(/\s+/).length ? "…" : "");
}

export default function StanceGrid({
  rows,
  raceId,
  active,
  coverage,
  extra,
  topicCoverage,
  saved,
  onToggleSave,
  onHighlight,
}: {
  rows: SheetRow[];
  raceId: string;
  active: IssueId | null;
  coverage: Record<IssueId, number>;
  extra: ExtraTopic[];
  topicCoverage: Record<string, number>;
  saved: Set<string>;
  onToggleSave: (id: string) => void;
  onHighlight: (issue: IssueId | null) => void;
}) {
  const [open, setOpen] = useState<{ id: string; key: string } | null>(null);
  const toggle = useCallback(
    (id: string, key: string) =>
      setOpen((current) => (current && current.id === id && current.key === key ? null : { id, key })),
    [],
  );
  const columns = issues.length + extra.length + 2;

  return (
    <div className={styles.wrap} id="list" data-extra={extra.length || undefined}>
      <table className={styles.grid} data-active={active ?? ""}>
        <caption className={styles.srOnly}>
          Where each candidate stands on four issues, in our short reading of their statements. Activate a cell to read
          the sentence and its source. Candidates appear alphabetically.
        </caption>
        <thead className={styles.head}>
          <tr>
            <th scope="col" className={styles.whoHead}>
              Candidate
            </th>
            {issues.map((issue) => (
              <th key={issue.id} scope="col" className={styles.issueHead} data-issue={issue.id}>
                <button
                  type="button"
                  className={styles.headButton}
                  aria-pressed={active === issue.id}
                  onClick={() => onHighlight(active === issue.id ? null : issue.id)}
                  title={active === issue.id ? "Show all columns" : `Highlight ${issue.label.toLowerCase()}`}
                >
                  <IssueIcon issue={issue.id} size={18} />
                  <span className={styles.issueShort}>{issue.short}</span>
                  <span className={styles.issueLong}>{issue.label}</span>
                </button>
                <span className={styles.count}>
                  {coverage[issue.id]} of {rows.length} documented
                </span>
              </th>
            ))}
            {extra.map((topic) => (
              <th key={topic.id} scope="col" className={`${styles.issueHead} ${styles.topicHead}`} data-issue="topic">
                <span className={styles.headButton}>{topic.label}</span>
                <span className={styles.count}>
                  {topicCoverage[topic.id] ?? 0} of {rows.length} on record
                </span>
              </th>
            ))}
            <th scope="col" className={styles.saveHead}>
              <SrOnly>Save to my ballot</SrOnly>
            </th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => {
            const isOpen = open?.id === row.id;
            const detailId = `stance-${row.id}`;
            const isSaved = saved.has(row.id);
            return (
              <Fragment key={row.id}>
                <tr className={styles.row} id={`row-${row.id}`} data-open={isOpen || undefined}>
                  <th scope="row" className={styles.who}>
                    <span className={styles.portrait}>
                      <CandidatePortrait person={portraitPerson(row)} compact />
                    </span>
                    <span className={styles.identity}>
                      <Link href={`/voters-guide/${raceId}/${row.id}`} prefetch={false} className={styles.name} id={`name-${row.id}`}>
                        {row.name}
                      </Link>
                      <span className={styles.role}>{row.role}</span>
                      {row.missing && <span className={styles.missing}>{missingLabel(row.missing)}</span>}
                    </span>
                  </th>
                  {issues.map((issue) => {
                    const cell = row.cells[issue.id];
                    const chip = cell.chip ?? fallbackChip(cell.line, cell.position);
                    const cellOpen = isOpen && open?.key === issue.id;
                    return (
                      <td key={issue.id} className={styles.cell} data-issue={issue.id}>
                        <span className={styles.cellLabel}>{issue.short}</span>
                        {chip ? (
                          <button
                            type="button"
                            className={styles.chip}
                            aria-expanded={cellOpen}
                            aria-controls={cellOpen ? detailId : undefined}
                            onClick={() => toggle(row.id, issue.id)}
                          >
                            {chip}
                          </button>
                        ) : (
                          <button
                            type="button"
                            className={c.gapPill}
                            aria-expanded={cellOpen}
                            aria-controls={cellOpen ? detailId : undefined}
                            aria-label={`${row.name} on ${issue.label.toLowerCase()}: not found in the sources we reviewed`}
                            onClick={() => toggle(row.id, issue.id)}
                          >
                            <Gap text="" /> Not found
                          </button>
                        )}
                      </td>
                    );
                  })}
                  {extra.map((topic) => {
                    const tc = row.topicCells[topic.id];
                    const cellOpen = isOpen && open?.key === `topic:${topic.id}`;
                    const has = Boolean(tc.vote || tc.chip);
                    return (
                      <td key={topic.id} className={styles.cell} data-issue="topic">
                        <span className={styles.cellLabel}>{topic.short}</span>
                        <button
                          type="button"
                          className={has ? styles.chip : c.gapPill}
                          aria-expanded={cellOpen}
                          aria-controls={cellOpen ? detailId : undefined}
                          aria-label={has ? undefined : `${row.name} on ${topic.label.toLowerCase()}: no statement in the sources we reviewed`}
                          onClick={() => toggle(row.id, `topic:${topic.id}`)}
                        >
                          {tc.vote ? <VotePill vote={tc.vote} /> : tc.chip ? tc.chip : tc.askedOn ? <><Gap text="" /> Asked</> : <><Gap text="" /> Not found</>}
                        </button>
                      </td>
                    );
                  })}
                  <td className={styles.saveCell}>
                    <button
                      type="button"
                      className={`${c.btn} ${c.small} ${c.save} ${styles.save}`}
                      aria-pressed={isSaved}
                      aria-label={`${isSaved ? "Remove" : "Save"} ${row.name}${isSaved ? " from" : " to"} my ballot`}
                      onClick={() => onToggleSave(row.id)}
                    >
                      {isSaved ? <BookmarkCheck size={16} aria-hidden="true" /> : <Bookmark size={16} aria-hidden="true" />}
                      <span className={styles.saveWord}>{isSaved ? "Saved" : "Save"}</span>
                    </button>
                  </td>
                </tr>
                {isOpen && open && (
                  <tr className={styles.detailRow}>
                    <td colSpan={columns}>
                      <StanceDetail
                        row={row}
                        issue={issues.find((i) => i.id === open.key) ?? null}
                        topic={open.key.startsWith("topic:") ? (extra.find((t) => `topic:${t.id}` === open.key) ?? null) : null}
                        raceId={raceId}
                        id={detailId}
                        onClose={() => setOpen(null)}
                      />
                    </td>
                  </tr>
                )}
              </Fragment>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
