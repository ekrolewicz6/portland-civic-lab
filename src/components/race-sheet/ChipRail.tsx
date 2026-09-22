"use client";
import { useEffect, useRef } from "react";
import { ArrowDown, ChevronDown } from "lucide-react";
import type { Issue, IssueId } from "@/lib/voters-guide/race-sheet/issues";
import { coverageParts } from "@/lib/voters-guide/race-sheet/issue-framing";
import styles from "./race-sheet.module.css";
import c from "./controls.module.css";

/**
 * The rail and the toolbar. On phones the rail is five chips that stick
 * under the site header (All · Homes · Safety · Money · Streets) and pick
 * which column the cards show; from 769px up the grid's own column headers
 * do that and the rail is hidden. The toolbar beneath is shared: the
 * question a pressed chip asks, the coverage line, and one jump to the
 * office's own choices, the boards beneath the grid.
 */
export default function ChipRail({
  issues,
  active,
  onChange,
  coverage,
  total,
  topics,
}: {
  /** The four issues as this office frames them. */
  issues: Issue[];
  active: IssueId | null;
  onChange: (issue: IssueId | null) => void;
  coverage: Record<IssueId, number>;
  total: number;
  /** How many boards the race has and how many are open; null when it has none (the control is then omitted). */
  topics: { count: number; open: number } | null;
}) {
  const rail = useRef<HTMLDivElement>(null);
  const chips = useRef<Partial<Record<IssueId, HTMLButtonElement | null>>>({});

  // A deep-linked or newly pressed chip scrolls into view within the rail
  // (horizontal only, so the page itself never jumps).
  useEffect(() => {
    if (!active) return;
    const scroller = rail.current;
    const chip = chips.current[active];
    if (!scroller || !chip) return;
    const outer = scroller.getBoundingClientRect();
    const inner = chip.getBoundingClientRect();
    if (inner.left < outer.left) scroller.scrollLeft += inner.left - outer.left - 8;
    else if (inner.right > outer.right) scroller.scrollLeft += inner.right - outer.right + 8;
  }, [active]);

  const current = active ? issues.find((i) => i.id === active) : null;
  const status = current
    ? coverageParts(current, coverage[current.id] ?? 0, total)
    : { head: `${total} candidates, A–Z.`, tail: " Tap any position to read the sentence, how they would deliver it, and the source." };

  return (
    <div className={styles.railRoot} data-race-sheet-rail>
      {/* Phones only: the 44px rail sticks under the site header. */}
      <div className={styles.railWrap}>
        <div ref={rail} className={styles.rail} role="group" aria-label="Show each candidate's line on">
          <button type="button" className={styles.chip} aria-pressed={active === null} onClick={() => onChange(null)}>
            All
          </button>
          {issues.map((issue) => (
            <button
              key={issue.id}
              ref={(el) => {
                chips.current[issue.id] = el;
              }}
              type="button"
              className={styles.chip}
              data-issue={issue.id}
              aria-pressed={active === issue.id}
              title={issue.label}
              onClick={() => onChange(issue.id)}
            >
              <span className={styles.dot} aria-hidden="true" />
              {issue.short}
            </button>
          ))}
        </div>
      </div>

      {/* All widths, in flow: the question, the coverage line, the columns control. */}
      <div className={styles.toolbar}>
        <div className={styles.toolbarText}>
          {current && <p className={styles.question}>{current.question}</p>}
          <p className={styles.status} role="status" aria-live="polite">
            {status.head}
            <span className={styles.statusTail}>{status.tail}</span>
          </p>
          <p className={styles.tapHint} aria-hidden="true">
            <ChevronDown size={13} /> Tap any position to open it
          </p>
        </div>
        {topics && (
          <a href="#topics" className={`${c.btn} ${c.quiet} ${c.small} ${styles.moreButton}`}>
            <span className={styles.moreLong}>{topics.count} more choices, below</span>
            <span className={styles.moreShort}>{topics.count} more choices</span>
            {topics.open > 0 && <span className={styles.moreCount}>{topics.open} open</span>}
            <ArrowDown size={15} aria-hidden="true" />
          </a>
        )}
      </div>
    </div>
  );
}
