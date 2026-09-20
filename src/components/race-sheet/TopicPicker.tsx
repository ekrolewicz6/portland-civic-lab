"use client";
import { Plus, Check } from "lucide-react";
import type { ExtraTopic } from "@/lib/voters-guide/race-sheet/types";
import styles from "./stance.module.css";

export const MAX_EXTRA = 2;

/**
 * Add up to two concrete choices as grid columns beside the four issues.
 * Coverage is shown on each control so a sparse column is never a surprise:
 * a recorded vote or an explicit statement counts; silence never does.
 */
export default function TopicPicker({
  topics,
  coverage,
  total,
  selected,
  onChange,
}: {
  topics: ExtraTopic[];
  coverage: Record<string, number>;
  total: number;
  selected: string[];
  onChange: (next: string[]) => void;
}) {
  const full = selected.length >= MAX_EXTRA;
  return (
    <div className={styles.picker} role="group" aria-label="Add a topic to compare">
      <span className={styles.pickerLabel}>Compare on more</span>
      <div className={styles.pickerChips}>
        {topics.map((topic) => {
          const on = selected.includes(topic.id);
          const disabled = !on && full;
          return (
            <button
              key={topic.id}
              type="button"
              className={styles.pickerChip}
              aria-pressed={on}
              disabled={disabled}
              title={disabled ? `Remove a topic to add ${topic.label}` : topic.question}
              onClick={() => onChange(on ? selected.filter((id) => id !== topic.id) : [...selected, topic.id])}
            >
              {on ? <Check size={14} aria-hidden="true" /> : <Plus size={14} aria-hidden="true" />}
              <span>{topic.label}</span>
              <span className={styles.pickerCount}>
                {coverage[topic.id] ?? 0}/{total}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
