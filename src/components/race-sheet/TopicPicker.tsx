"use client";
import { Plus, Check } from "lucide-react";
import type { ExtraTopic } from "@/lib/voters-guide/race-sheet/types";
import styles from "./stance.module.css";
import c from "./controls.module.css";

/**
 * Add any of the concrete choices this Council has faced as grid columns
 * beside the four issues; all of them at once if you want to see who has
 * said nothing about what. Opens from the toolbar's one control. The count
 * on each chip is how many candidates are on record: a recorded vote or an
 * explicit statement counts; silence never does.
 */
export default function TopicPicker({
  id,
  open,
  topics,
  coverage,
  total,
  selected,
  onChange,
}: {
  id: string;
  open: boolean;
  topics: ExtraTopic[];
  coverage: Record<string, number>;
  total: number;
  selected: string[];
  onChange: (next: string[]) => void;
}) {
  if (!open) return null;
  const all = selected.length === topics.length;
  return (
    <div id={id} className={styles.picker} role="group" aria-label="Add topics to compare">
      <div className={styles.pickerHead}>
        <p className={styles.pickerLabel}>
          Add columns for the choices this Council has faced. The count is how many of {total} are on record; a dash is a
          gap the candidate could still fill.
        </p>
        <div className={styles.pickerActions}>
          <button
            type="button"
            className={`${c.btn} ${c.quiet} ${c.small}`}
            aria-pressed={all}
            onClick={() => onChange(all ? [] : topics.map((t) => t.id))}
          >
            {all ? "None" : `All ${topics.length}`}
          </button>
        </div>
      </div>
      <div className={styles.pickerChips}>
        {topics.map((topic) => {
          const on = selected.includes(topic.id);
          return (
            <button
              key={topic.id}
              type="button"
              className={`${c.btn} ${c.small} ${styles.pickerChip}`}
              aria-pressed={on}
              title={topic.question}
              onClick={() => onChange(on ? selected.filter((x) => x !== topic.id) : [...selected, topic.id])}
            >
              {on ? <Check size={14} aria-hidden="true" /> : <Plus size={14} aria-hidden="true" />}
              <span>{topic.label}</span>
              <span className={styles.pickerCount}>{coverage[topic.id] ?? 0}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
