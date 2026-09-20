"use client";
import { useEffect, useId, useState } from "react";
import { Printer } from "lucide-react";
import { glossary, type GlossaryKey } from "@/lib/voters-guide/race-sheet/glossary";
import styles from "./brief.module.css";

/**
 * A glossary term on first use: a <dfn> with a dotted underline whose button
 * reveals the plain definition inline, on its own line right after the term.
 * Keyboard operable (Enter/Space toggle, Escape closes); no title-only tips.
 */
export default function Term({ id, children }: { id: GlossaryKey; children: React.ReactNode }) {
  const entry = glossary[id];
  const [open, setOpen] = useState(false);
  const panelId = useId();
  if (!entry) return <>{children}</>;
  return (
    <>
      <dfn className={styles.term} id={`term-${id}`}>
        <button
          type="button"
          className={styles.termButton}
          aria-expanded={open}
          aria-controls={panelId}
          onClick={() => setOpen((value) => !value)}
          onKeyDown={(event) => {
            if (event.key === "Escape" && open) setOpen(false);
          }}
        >
          {children}
        </button>
      </dfn>
      <span id={panelId} role="note" className={styles.termDefinition} hidden={!open}>
        <strong>{entry.term}.</strong> {entry.definition}
      </span>
    </>
  );
}

/**
 * The print edition's one interactive control. Also opens every <details>
 * before any print (including Cmd+P) so the paper copy is complete, and
 * restores them afterwards.
 */
export function PrintButton({ className }: { className?: string }) {
  useEffect(() => {
    let closed: HTMLDetailsElement[] = [];
    const before = () => {
      closed = [...document.querySelectorAll<HTMLDetailsElement>("details")].filter((d) => !d.open);
      closed.forEach((d) => {
        d.open = true;
      });
    };
    const after = () => {
      closed.forEach((d) => {
        d.open = false;
      });
      closed = [];
    };
    window.addEventListener("beforeprint", before);
    window.addEventListener("afterprint", after);
    return () => {
      window.removeEventListener("beforeprint", before);
      window.removeEventListener("afterprint", after);
    };
  }, []);
  return (
    <button type="button" className={className} onClick={() => window.print()}>
      <Printer size={16} aria-hidden="true" /> Print
    </button>
  );
}
