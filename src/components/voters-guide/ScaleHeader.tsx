import { ArrowUpRight } from "lucide-react";
import type { BodyScale, ScaleTier } from "@/lib/voters-guide/race-sheet/scale";
import styles from "./scale-header.module.css";

/**
 * One rung of the ladder of government: the body, how much money it
 * controls, how many people it serves, who decides, and what it decides.
 * The budget bar is on a log scale from $10 million to $10 trillion so a
 * city and Congress can share one page; the label beside it carries the
 * real number and its source. Colors mark tiers, never parties.
 */
const FLOOR = Math.log10(1e7);
const CEIL = Math.log10(1e13);

export function budgetShare(budget: number) {
  const x = (Math.log10(Math.max(budget, 1e7)) - FLOOR) / (CEIL - FLOOR);
  return Math.round(Math.min(1, Math.max(0.04, x)) * 1000) / 10;
}

export default function ScaleHeader({
  body,
  tier,
  scale,
  races,
  candidates,
  id,
}: {
  body: string;
  tier: ScaleTier;
  scale: BodyScale | null;
  races: number;
  candidates: number;
  id?: string;
}) {
  return (
    <header className={styles.rung} data-tier={tier} id={id}>
      <div className={styles.top}>
        <h3 className={styles.body}>{body}</h3>
        <p className={styles.count}>
          {races} race{races === 1 ? "" : "s"} · {candidates} candidate{candidates === 1 ? "" : "s"}
        </p>
      </div>
      {scale ? (
        <>
          <div className={styles.bar} aria-hidden="true">
            <span className={styles.fill} style={{ width: `${budgetShare(scale.budget)}%` }} />
          </div>
          <dl className={styles.facts}>
            <div>
              <dt>Budget</dt>
              <dd>
                {scale.budgetLabel}
                <a className={styles.src} href={scale.budgetSource.url} rel="noopener noreferrer" target="_blank" aria-label={`Source: ${scale.budgetSource.label}`}>
                  <ArrowUpRight size={12} aria-hidden="true" />
                </a>
              </dd>
            </div>
            <div>
              <dt>People</dt>
              <dd>
                {scale.peopleLabel}
                <a className={styles.src} href={scale.peopleSource.url} rel="noopener noreferrer" target="_blank" aria-label={`Source: ${scale.peopleSource.label}`}>
                  <ArrowUpRight size={12} aria-hidden="true" />
                </a>
              </dd>
            </div>
            <div>
              <dt>Who decides</dt>
              <dd>{scale.members}</dd>
            </div>
          </dl>
          <p className={styles.decides}>
            <span className={styles.decidesLabel}>Decides</span> {scale.decides}
          </p>
        </>
      ) : null}
    </header>
  );
}
