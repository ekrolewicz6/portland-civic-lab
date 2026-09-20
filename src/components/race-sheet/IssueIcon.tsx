import { House, Leaf, ShieldCheck, Wallet } from "lucide-react";
import type { IssueId } from "@/lib/voters-guide/race-sheet/issues";
import styles from "./stance.module.css";

/** One icon per issue column; the column's hue comes from the stylesheet. */
export function IssueIcon({ issue, size = 16 }: { issue: IssueId; size?: number }) {
  const Icon = issue === "housing" ? House : issue === "safety" ? ShieldCheck : issue === "money" ? Wallet : Leaf;
  return (
    <span className={styles.issueIcon} data-issue={issue} aria-hidden="true">
      <Icon size={size} strokeWidth={2} />
    </span>
  );
}
