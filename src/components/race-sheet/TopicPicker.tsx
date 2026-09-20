"use client";
import { Plus, Check } from "lucide-react";
import type { ExtraTopic } from "@/lib/voters-guide/race-sheet/types";
import styles from "./stance.module.css";
import c from "./controls.module.css";

export const MAX_EXTRA = 2;

/**
 * Add up to two concrete choices as grid columns beside the four issues.
 * Opens from the toolbar's one control and closes with it. Coverage is
 * shown on each chip so a sparse column is never a surprise: a recorded
 * vote or an explicit statement counts; silence never does.
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
  const full = selected.length >= MAX_EXTRA;
  return (
    <div id={id} className={styles.picker} role="group" aria-label="Add a topic to compare">
      <p className={styles.pickerLabel}>
        Add up to two columns. The count is how many of {total} are on record.
      </p>
      <div className={styles.pickerChips}>
        {topics.map((topic) => {
          const on = selected.includes(topic.id);
          const disabled = !on && full;
          return (
            <button
              key={topic.id}
              type="button"
              className={`${c.btn} ${c.small} ${styles.pickerChip}`}
              aria-pressed={on}
              disabled={disabled}
              title={disabled ? `Remove a topic to add ${topic.label}` : topic.question}
              onClick={() => onChange(on ? selected.filter((id) => id !== topic.id) : [...selected, topic.id])}
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
