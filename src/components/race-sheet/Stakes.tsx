import { ArrowUpRight } from "lucide-react";
import type { RaceSheet } from "@/lib/voters-guide/race-sheet";
import { sourceChip } from "@/lib/voters-guide/race-sheet/source-chip";
import { SourceChipButton } from "./CandidateCard";
import styles from "./stakes.module.css";

/**
 * What this office decides right now: the biggest current problems and
 * pending decisions as sourced facts, the same block for every candidate.
 * It sits under the grid, so a reader meets the names first and the
 * stakes second, then the topic picker above can add the office's own
 * choices as columns.
 */
export default function Stakes({ sheet }: { sheet: RaceSheet }) {
  const stakes = sheet.stakes;
  if (!stakes) return null;
  const topics = sheet.office.group === "council" ? 0 : sheet.rows.length ? Object.keys(sheet.rows[0].topicCells).length : 0;
  return (
    <section id="stakes" className={styles.stakes} aria-labelledby="stakes-title">
      <div className={styles.head}>
        <p className={styles.eyebrow}>What this office decides right now</p>
        <h2 id="stakes-title" className={styles.title}>
          What’s at stake
        </h2>
        <p className={styles.intro}>{stakes.intro}</p>
        {topics > 0 && (
          <p className={styles.hint}>
            The <a href="#list">Topics</a> control above adds this office’s {topics} live choices as columns, with each candidate’s stated position or a gap.
          </p>
        )}
      </div>
      <ol className={styles.items}>
        {stakes.items.map((item) => (
          <li key={item.label} className={styles.item}>
            <p className={styles.label}>{item.label}</p>
            <p className={styles.text}>{item.text}</p>
            <div className={styles.source}>
              <SourceChipButton chip={sourceChip(item.source)} />
              <a href={item.source.url} className={styles.srcLink} rel="noopener noreferrer" target="_blank" aria-label={`Open source: ${item.source.label}`}>
                <ArrowUpRight size={13} aria-hidden="true" />
              </a>
            </div>
          </li>
        ))}
      </ol>
    </section>
  );
}
