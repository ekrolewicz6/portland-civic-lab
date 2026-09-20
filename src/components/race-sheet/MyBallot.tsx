"use client";
import { useCallback, useEffect, useId, useRef, useState, type RefObject } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import MiniChips from "./MiniChips";
import { ArrowDown, ArrowUp, Bookmark, Printer, Trash2, X } from "lucide-react";
import type { ClientSheet, SheetRow } from "@/lib/voters-guide/race-sheet";
import {
  BALLOT_MAX,
  NOTE_MAX,
  moveInBallot,
  noteInBallot,
  removeFromBallot,
  type BallotState,
} from "@/lib/voters-guide/race-sheet/ballot-store";
import { SrOnly, VotePill, VotedGlyph } from "./Glyph";
import styles from "./race-sheet.module.css";

const ORDINALS = ["1st", "2nd", "3rd", "4th", "5th", "6th"];
export const RETURN_BY = "Return your ballot by 8 p.m. November 3, 2026";

const FOCUSABLE =
  'a[href], button:not([disabled]), input:not([disabled]), textarea:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])';

/** Rendered and not display:none (offsetParent is null for fixed elements, so use rects). */
function isShown(el: Element | null | undefined): el is HTMLElement {
  return el instanceof HTMLElement && el.getClientRects().length > 0;
}

type PendingFocus = { kind: "move"; id: string; dir: -1 | 1 } | { kind: "remove"; index: number };

export default function MyBallot({
  sheet,
  state,
  persistent,
  open,
  opener,
  onOpenChange,
  onChange,
  onClear,
  notice,
}: {
  sheet: ClientSheet;
  state: BallotState;
  /** False when this browser could not keep the list across a reload. */
  persistent: boolean;
  open: boolean;
  /** The control that opened the dialog, captured at click time by the caller. */
  opener?: RefObject<HTMLElement | null>;
  onOpenChange: (open: boolean, opener?: HTMLElement) => void;
  onChange: (next: BallotState) => void;
  onClear: () => void;
  /** A short, transient line under the tray (e.g. the six-name limit). */
  notice?: string | null;
}) {
  const [mounted, setMounted] = useState(false);
  const [confirmClear, setConfirmClear] = useState(false);
  const [announce, setAnnounce] = useState("");
  const panel = useRef<HTMLDivElement>(null);
  const heading = useRef<HTMLHeadingElement>(null);
  const localOpener = useRef<HTMLElement | null>(null);
  const pendingFocus = useRef<PendingFocus | null>(null);
  const titleId = useId();
  const descId = useId();

  const rowsById = new Map(sheet.rows.map((r) => [r.id, r]));
  const saved = state.order.map((id) => rowsById.get(id)).filter((r): r is SheetRow => Boolean(r));
  const count = saved.length;
  const district = sheet.district;

  useEffect(() => setMounted(true), []);

  const controlId = (kind: "up" | "down" | "remove", id: string) => `${titleId}-${kind}-${id}`;

  // Focus management: move focus in, trap Tab, restore to the opener on close.
  useEffect(() => {
    if (!open) return;
    // The opener was captured at click time; the tray button unmounts on open,
    // so document.activeElement here would already be <body>.
    const openedFrom = opener?.current ?? localOpener.current;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    heading.current?.focus();
    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") {
        event.preventDefault();
        onOpenChange(false);
        return;
      }
      if (event.key !== "Tab" || !panel.current) return;
      const items = Array.from(panel.current.querySelectorAll<HTMLElement>(FOCUSABLE)).filter(
        (el) => el.offsetParent !== null,
      );
      if (items.length === 0) return;
      const first = items[0];
      const last = items[items.length - 1];
      const activeEl = document.activeElement;
      // Focus on <body> (after a control unmounted) counts as outside the dialog.
      const outside = !activeEl || activeEl === document.body || !panel.current.contains(activeEl);
      if (event.shiftKey && (outside || activeEl === first || activeEl === heading.current)) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && (outside || activeEl === last)) {
        event.preventDefault();
        first.focus();
      }
    }
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = previousOverflow;
      setConfirmClear(false);
      setAnnounce("");
      // After close, focus the opener if it is still on the page and shown;
      // otherwise the first visible entry point (tray on desktop, bar on phones).
      window.requestAnimationFrame(() => {
        if (openedFrom && openedFrom !== document.body && openedFrom.isConnected && isShown(openedFrom)) {
          openedFrom.focus();
          return;
        }
        const entry = Array.from(
          document.querySelectorAll<HTMLElement>("[data-race-sheet-tray] button, [data-race-sheet-bar] button"),
        ).find(isShown);
        entry?.focus();
      });
    };
  }, [open, opener, onOpenChange]);

  // After a Remove or Move re-renders the slots, put focus somewhere deliberate
  // instead of letting it fall to <body> outside the trap.
  useEffect(() => {
    const pending = pendingFocus.current;
    if (!pending || !open) return;
    pendingFocus.current = null;
    let target: HTMLElement | null = null;
    if (pending.kind === "move") {
      const same = document.getElementById(controlId(pending.dir === -1 ? "up" : "down", pending.id));
      const other = document.getElementById(controlId(pending.dir === -1 ? "down" : "up", pending.id));
      target = same instanceof HTMLButtonElement && !same.disabled ? same : other;
    } else {
      const next = saved[pending.index] ?? saved[pending.index - 1];
      target = next ? document.getElementById(controlId("remove", next.id)) : null;
    }
    (target ?? heading.current)?.focus();
    // eslint-disable-next-line react-hooks/exhaustive-deps -- runs once per order change
  }, [state.order, open]);

  const move = (row: SheetRow, dir: -1 | 1) => {
    const next = moveInBallot(state, row.id, dir);
    const index = next.order.indexOf(row.id);
    pendingFocus.current = { kind: "move", id: row.id, dir };
    setAnnounce(`${row.name} is now ${ORDINALS[index] ?? `${index + 1}th`}.`);
    onChange(next);
  };

  const remove = (row: SheetRow, index: number) => {
    pendingFocus.current = { kind: "remove", index };
    setAnnounce(`Removed ${row.name}.`);
    onChange(removeFromBallot(state, row.id));
  };

  const printCard = useCallback(() => {
    const body = document.body;
    body.setAttribute("data-print-ballot", "");
    const done = () => {
      body.removeAttribute("data-print-ballot");
      window.removeEventListener("afterprint", done);
    };
    window.addEventListener("afterprint", done);
    window.print();
    // Browsers without afterprint: clear once the print dialog has had its turn.
    window.setTimeout(done, 60_000);
  }, []);

  useEffect(() => () => document.body.removeAttribute("data-print-ballot"), []);

  const votesFor = (id: string) =>
    sheet.featured
      .map((f) => ({ title: f.title, vote: f.votes.find((v) => v.id === id)?.vote ?? null }))
      .filter((x): x is { title: string; vote: NonNullable<typeof x.vote> } => x.vote !== null);

  const trayLabel = count === 1 ? "1 saved" : `${count} saved`;

  return (
    <>
      {/* Tray wrapper: always mounted so its live region exists before it has
          text. The tray button itself appears after the first save; from 769px
          up it is the way into My ballot, on phones the bottom bar is. */}
      <div className={styles.trayWrap}>
        {count > 0 && !open && (
          <div className={styles.tray} data-race-sheet-tray>
            <button
              type="button"
              className={styles.trayButton}
              onClick={(event) => {
                localOpener.current = event.currentTarget;
                onOpenChange(true, event.currentTarget);
              }}
              aria-haspopup="dialog"
            >
              <Bookmark size={18} aria-hidden="true" fill="currentColor" />
              <span>{trayLabel} · Open my ballot</span>
            </button>
          </div>
        )}
        <p role="status" aria-live="polite" className={notice ? styles.trayNotice : styles.srOnly}>
          {notice ?? ""}
        </p>
      </div>

      {/* Panel */}
      {open && <div className={styles.backdrop} onClick={() => onOpenChange(false)} aria-hidden="true" />}
      {open && (
        <div
          ref={panel}
          id="my-ballot"
          className={styles.panel}
          role="dialog"
          aria-modal="true"
          aria-labelledby={titleId}
          aria-describedby={descId}
        >
          <div className={styles.panelHead}>
            <h2 id={titleId} ref={heading} tabIndex={-1} className={styles.panelTitle}>
              My ballot
            </h2>
            <button type="button" className={styles.iconButton} aria-label="Close my ballot" onClick={() => onOpenChange(false)}>
              <X size={18} aria-hidden="true" />
            </button>
          </div>
          <p id={descId} className={styles.panelNote}>
            Your order. Stored only in this browser tab. The site never fills, sorts or shares it.
          </p>
          {!persistent && (
            <p className={styles.storageNotice} role="status">
              This browser cannot save your list after a reload.
            </p>
          )}
          {/* Always mounted: announces the result of Remove / Move. */}
          <p role="status" aria-live="polite" className={styles.srOnly} data-ballot-announce>
            {announce}
          </p>

          <ol className={styles.slots} aria-label={`Your ${BALLOT_MAX} ballot slots`}>
            {Array.from({ length: BALLOT_MAX }, (_, i) => {
              const row = saved[i];
              if (!row) {
                return (
                  <li key={`empty-${i}`} className={styles.slotEmpty}>
                    <span className={styles.ordinal}>{ORDINALS[i]}</span>
                    <span className={styles.slotHint}>{i === 0 ? "Tap Save beside a name" : "Empty"}</span>
                  </li>
                );
              }
              const votes = row.incumbent ? votesFor(row.id) : [];
              const noteId = `${titleId}-note-${row.id}`;
              return (
                <li key={row.id} className={styles.slot}>
                  <div className={styles.slotTop}>
                    <span className={styles.ordinal}>{ORDINALS[i]}</span>
                    <div className={styles.slotBody}>
                      <p className={styles.slotName}>
                        <Link href={`/voters-guide/${sheet.raceId}/${row.id}`} prefetch={false}>
                          {row.name}
                        </Link>
                      </p>
                      <p className={styles.slotRole}>{row.role}</p>
                      <MiniChips row={row} />
                      {votes.length > 0 && (
                        <div className={styles.slotVotes}>
                          <p className={styles.metaLabel}>
                            <VotedGlyph label="" />
                            Voted
                          </p>
                          <ul className={styles.voteList}>
                            {votes.map((v) => (
                              <li key={v.title}>
                                <span>{v.title}</span>
                                <VotePill vote={v.vote} />
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                      <label className={styles.noteLabel} htmlFor={noteId}>
                        <SrOnly>Private note for {row.name}</SrOnly>
                        <input
                          id={noteId}
                          className={styles.noteInput}
                          type="text"
                          maxLength={NOTE_MAX}
                          placeholder="Why (private)"
                          autoComplete="off"
                          value={state.notes[row.id] ?? ""}
                          onChange={(event) => onChange(noteInBallot(state, row.id, event.target.value))}
                        />
                      </label>
                    </div>
                  </div>
                  <div className={styles.slotActions}>
                    <button
                      type="button"
                      id={controlId("up", row.id)}
                      className={styles.smallButton}
                      disabled={i === 0}
                      aria-label={`Move ${row.name} up`}
                      onClick={() => move(row, -1)}
                    >
                      <ArrowUp size={16} aria-hidden="true" />
                      <span>Move up</span>
                    </button>
                    <button
                      type="button"
                      id={controlId("down", row.id)}
                      className={styles.smallButton}
                      disabled={i === count - 1}
                      aria-label={`Move ${row.name} down`}
                      onClick={() => move(row, 1)}
                    >
                      <ArrowDown size={16} aria-hidden="true" />
                      <span>Move down</span>
                    </button>
                    <button
                      type="button"
                      id={controlId("remove", row.id)}
                      className={styles.smallButton}
                      aria-label={`Remove ${row.name}`}
                      onClick={() => remove(row, i)}
                    >
                      <X size={16} aria-hidden="true" />
                      <span>Remove</span>
                    </button>
                  </div>
                </li>
              );
            })}
          </ol>

          <div className={styles.panelActions}>
            <button type="button" className={styles.primaryButton} onClick={printCard} disabled={count === 0}>
              <Printer size={16} aria-hidden="true" />
              Print ballot card
            </button>
            {confirmClear ? (
              <span className={styles.confirm} role="group" aria-label="Clear your ballot?">
                <span>Clear all saved names?</span>
                <button
                  type="button"
                  className={styles.smallButton}
                  onClick={() => {
                    onClear();
                    setConfirmClear(false);
                    setAnnounce("Cleared all saved names.");
                    heading.current?.focus();
                  }}
                >
                  Yes, clear
                </button>
                <button type="button" className={styles.smallButton} onClick={() => setConfirmClear(false)}>
                  Keep
                </button>
              </span>
            ) : (
              <button type="button" className={styles.secondaryButton} onClick={() => setConfirmClear(true)} disabled={count === 0}>
                <Trash2 size={16} aria-hidden="true" />
                Clear
              </button>
            )}
          </div>
          <p className={styles.panelFoot}>{RETURN_BY}.</p>
        </div>
      )}

      {/* Print-only ballot card: a direct child of <body>, so print CSS can show it alone. */}
      {mounted &&
        createPortal(
          <div className={styles.printCard} aria-hidden="true" data-race-sheet-print-card>
            <p className={styles.printEyebrow}>My ballot · Portland City Council</p>
            <p className={styles.printDistrict}>{district}</p>
            <ol className={styles.printSlots}>
              {Array.from({ length: BALLOT_MAX }, (_, i) => {
                const row = saved[i];
                return (
                  <li key={row?.id ?? `p-${i}`}>
                    <span className={styles.printOrdinal}>{ORDINALS[i]}</span>
                    <span className={styles.printName}>{row?.name ?? ""}</span>
                    {row && state.notes[row.id] && <span className={styles.printNote}>{state.notes[row.id]}</span>}
                  </li>
                );
              })}
            </ol>
            <p className={styles.printReturn}>{RETURN_BY}.</p>
          </div>,
          document.body,
        )}
    </>
  );
}
