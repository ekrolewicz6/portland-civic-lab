"use client";
import { useEffect, useId, useRef, useState } from "react";
import { Info, X } from "lucide-react";
import { issues, type IssueId } from "@/lib/voters-guide/race-sheet/issues";
import styles from "./race-sheet.module.css";

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

export default function ChipRail({
  active,
  onChange,
  coverage,
  total,
}: {
  active: IssueId | null;
  onChange: (issue: IssueId | null) => void;
  coverage: Record<IssueId, number>;
  total: number;
}) {
  const [info, setInfo] = useState<IssueId | null>(null);
  const baseId = useId();
  const root = useRef<HTMLDivElement>(null);
  const rail = useRef<HTMLDivElement>(null);
  const groups = useRef<Partial<Record<IssueId, HTMLSpanElement | null>>>({});
  const infoPanel = useRef<HTMLDivElement>(null);
  const openedBy = useRef<HTMLButtonElement | null>(null);

  // A deep-linked or newly pressed chip scrolls into view within the rail
  // (horizontal only, so the page itself never jumps).
  useEffect(() => {
    if (!active) return;
    const scroller = rail.current;
    const chip = groups.current[active];
    if (!scroller || !chip) return;
    const outer = scroller.getBoundingClientRect();
    const inner = chip.getBoundingClientRect();
    if (inner.left < outer.left) scroller.scrollLeft += inner.left - outer.left - 8;
    else if (inner.right > outer.right) scroller.scrollLeft += inner.right - outer.right + 8;
  }, [active]);

  // The (i) panel: focus moves into it on open; Escape or a press outside the
  // rail closes it, and focus returns to the (i) that opened it.
  useEffect(() => {
    if (!info) return;
    infoPanel.current?.focus({ preventScroll: false });
    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setInfo(null);
        openedBy.current?.focus();
      }
    }
    function onPointerDown(event: PointerEvent) {
      if (root.current && !root.current.contains(event.target as Node)) setInfo(null);
    }
    document.addEventListener("keydown", onKey);
    document.addEventListener("pointerdown", onPointerDown);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("pointerdown", onPointerDown);
    };
  }, [info]);

  const current = info ? issues.find((i) => i.id === info) : null;
  const status = active
    ? coverageParts(active, coverage[active] ?? 0, total)
    : { head: `${total} candidates, A–Z.`, tail: " Tap a chip for the sentence and its source." };

  return (
    <div ref={root} className={styles.railRoot} data-race-sheet-rail>
      {/* Only the 44px rail sticks under the site header. */}
      <div className={styles.railWrap}>
        <div ref={rail} className={styles.rail} role="group" aria-label="Show each candidate's line on">
          <button type="button" className={styles.chip} aria-pressed={active === null} onClick={() => onChange(null)}>
            All issues
          </button>
          {issues.map((issue) => {
            const pressed = active === issue.id;
            const panelId = `${baseId}-info-${issue.id}`;
            return (
              <span
                key={issue.id}
                ref={(el) => {
                  groups.current[issue.id] = el;
                }}
                className={styles.chipGroup}
                data-active={pressed || undefined}
              >
                <button type="button" className={styles.chip} aria-pressed={pressed} onClick={() => onChange(issue.id)}>
                  {issue.label}
                </button>
                <button
                  type="button"
                  className={styles.chipInfo}
                  aria-label={`About the ${issue.label} question`}
                  aria-expanded={info === issue.id}
                  aria-controls={panelId}
                  onClick={(event) => {
                    openedBy.current = event.currentTarget;
                    setInfo((prev) => (prev === issue.id ? null : issue.id));
                  }}
                >
                  <Info size={16} aria-hidden="true" />
                </button>
              </span>
            );
          })}
        </div>
      </div>

      {/* Below the rail, in flow: the (i) panel, the status line and the key. */}
      <div className={styles.railBelow}>
        {current && (
          <div
            ref={infoPanel}
            id={`${baseId}-info-${current.id}`}
            className={styles.infoPanel}
            role="region"
            aria-label={`${current.label}: the question`}
            tabIndex={-1}
          >
            <div className={styles.infoBody}>
              <p className={styles.eyebrow}>{current.label}</p>
              <p className={styles.infoQuestion}>{current.question}</p>
              <p className={styles.infoContext}>{current.context}</p>
            </div>
            <button
              type="button"
              className={styles.iconButton}
              aria-label="Close"
              onClick={() => {
                setInfo(null);
                openedBy.current?.focus();
              }}
            >
              <X size={16} aria-hidden="true" />
            </button>
          </div>
        )}
        <p className={styles.status} role="status" aria-live="polite">
          {status.head}
          <span className={styles.statusTail}>{status.tail}</span>
        </p>
        <p className={styles.railKey}>
          <span className={styles.dash} aria-hidden="true">
            —
          </span>{" "}
          not found in sources
        </p>
      </div>
    </div>
  );
}
