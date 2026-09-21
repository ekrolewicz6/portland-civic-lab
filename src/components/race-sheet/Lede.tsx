"use client";
import { useId, useState } from "react";
import { ChevronDown } from "lucide-react";
import styles from "./lede.module.css";

/**
 * The choice in one paragraph: our reading, ≤45 words, no names. On a phone
 * it is folded away behind one "Read" control so the candidates stay on the first screen; it
 * unfolds it in place. From 769px up it always shows in full. The draft tag
 * stays beside the label until a human has reviewed the paragraph.
 */
export default function Lede({ text, reviewed }: { text: string; reviewed: boolean }) {
  const [open, setOpen] = useState(false);
  const id = useId();
  return (
    <section className={styles.lede} aria-labelledby={`${id}-label`} data-open={open || undefined}>
      <div className={styles.head}>
        <h2 id={`${id}-label`} className={styles.label}>
          Our reading
          {!reviewed && (
            <span className={styles.draft} title="Draft; human review pending">
              Draft
            </span>
          )}
        </h2>
        <button
          type="button"
          className={styles.more}
          aria-expanded={open}
          aria-controls={`${id}-text`}
          onClick={() => setOpen((v) => !v)}
        >
          {open ? "Hide" : "Read"}
          <ChevronDown size={14} aria-hidden="true" />
        </button>
      </div>
      <p id={`${id}-text`} className={styles.text}>
        {text}
      </p>
    </section>
  );
}
