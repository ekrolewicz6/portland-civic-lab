import type { SheetRow } from "@/lib/voters-guide/race-sheet";
import { issues } from "@/lib/voters-guide/race-sheet/issues";
import { Gap } from "./Glyph";
import styles from "./stance.module.css";

/**
 * A candidate's four grid chips in one compact strip: the same structured
 * facts as the grid, in the same order, so a name is never introduced by a
 * sentence we chose. Gaps stay visible as the same dash.
 */
export default function MiniChips({ row, label }: { row: SheetRow; label?: string }) {
  return (
    <ul className={styles.miniChips} aria-label={label ?? `${row.name}: where they stand`}>
      {issues.map((issue) => {
        const chip = row.cells[issue.id].chip;
        return (
          <li key={issue.id} className={styles.miniChip} data-issue={issue.id}>
            <span className={styles.miniLabel}>{issue.short}</span>
            {chip ? <span className={styles.miniText}>{chip}</span> : <Gap />}
          </li>
        );
      })}
    </ul>
  );
}
