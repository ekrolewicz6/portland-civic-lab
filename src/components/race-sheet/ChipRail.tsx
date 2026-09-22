"use client";
import { useEffect, useRef } from "react";
import { Plus } from "lucide-react";
import { issues, type IssueId } from "@/lib/voters-guide/race-sheet/issues";
import styles from "./race-sheet.module.css";
import c from "./controls.module.css";

/** Plain noun for the status line: "12 of 21 have a housing position…". */
const nouns: Record<IssueId, string> = {
  housing: "housing",
  safety: "safety",
  money: "taxes-and-bills",
  climate: "streets-and-climate",
};

/**
 * The status line in two parts: the head is what phones show on one line;
 * the tail completes the sentence from 769px up (and in the DOM text).
 */
export function coverageParts(issue: IssueId, count: number, total: number) {
  const noun = nouns[issue].replace(/-/g, " ");
  return { head: `${count} of ${total} have a ${noun} position`, tail: " in the sources we reviewed." };
}

export function coverageSentence(issue: IssueId, count: number, total: number) {
  const { head, tail } = coverageParts(issue, count, total);
  return head + tail;
}

/**
 * The rail and the toolbar. On phones the rail is five chips that stick
 * under the site header (All · Homes · Safety · Money · Streets) and pick
 * which column the cards show; from 769px up the grid's own column headers
 * do that and the rail is hidden. The toolbar beneath is shared: the
 * question a pressed chip asks, the coverage line, and the one control that
 * adds columns.
 */
export default function ChipRail({
  active,
  onChange,
  coverage,
  total,
  pickerOpen,
  pickerId,
  selectedTopics,
  onTogglePicker,
}: {
  active: IssueId | null;
  onChange: (issue: IssueId | null) => void;
  coverage: Record<IssueId, number>;
  total: number;
  pickerOpen: boolean;
  pickerId: string;
  selectedTopics: number;
  /** Null when the race has no extra topics; the control is then omitted. */
  onTogglePicker: (() => void) | null;
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
  const status = active
    ? coverageParts(active, coverage[active] ?? 0, total)
    : { head: `${total} candidates, A–Z.`, tail: " Tap a chip for the sentence and its source." };

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
        </div>
        {onTogglePicker && (
        <button
          type="button"
          className={`${c.btn} ${c.quiet} ${c.small} ${styles.moreButton}`}
          aria-expanded={pickerOpen}
          aria-controls={pickerId}
          onClick={onTogglePicker}
        >
          <Plus size={15} aria-hidden="true" />
          <span className={styles.moreLong}>Compare on more topics</span>
          <span className={styles.moreShort}>Topics</span>
          {selectedTopics > 0 && <span className={styles.moreCount}>{selectedTopics}</span>}
        </button>
        )}
      </div>
    </div>
  );
}
