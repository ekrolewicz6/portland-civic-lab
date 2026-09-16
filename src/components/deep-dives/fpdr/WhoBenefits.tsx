"use client";

import { useState } from "react";
import { BENEFICIARIES as B } from "@/lib/fpdr/data";
import { fmtMoney } from "@/lib/fpdr/engine";
import SourceLink from "./SourceLink";
import styles from "./fpdr-tools.module.css";

type Group = "all" | "police" | "fire";
export default function WhoBenefits() {
  const [group, setGroup] = useState<Group>("all");
  const retirees =
    group === "police"
      ? B.retireesPolice
      : group === "fire"
        ? B.retireesFire
        : B.retireesAndSurvivors;
  const active =
    group === "police"
      ? B.activeFpdrTwoPolice
      : group === "fire"
        ? B.activeFpdrTwoFire
        : B.activeFpdrTwo;
  const average =
    group === "police"
      ? B.avgAnnualPensionPolice
      : group === "fire"
        ? B.avgAnnualPensionFire
        : B.avgAnnualPension;
  return (
    <div>
      <p className={styles.eyebrow}>A dated snapshot · June 30, 2024</p>
      <div
        className={styles.segmented}
        role="group"
        aria-label="Benefit recipients"
      >
        {(
          [
            ["all", "Everyone"],
            ["police", "Police"],
            ["fire", "Fire"],
          ] as const
        ).map(([id, label]) => (
          <button
            key={id}
            type="button"
            aria-pressed={group === id}
            onClick={() => setGroup(id)}
          >
            {label}
          </button>
        ))}
      </div>
      <dl className={styles.benefits} aria-live="polite">
        <div>
          <dt>Retirees & survivors</dt>
          <dd>{retirees.toLocaleString("en-US")}</dd>
          <p>Receiving old-plan pensions</p>
        </div>
        <div>
          <dt>Average annual pension</dt>
          <dd>{fmtMoney(average)}</dd>
          <p>Annualized from monthly benefits</p>
        </div>
        <div>
          <dt>Active old-plan members</dt>
          <dd>{active.toLocaleString("en-US")}</dd>
          <p>Still earning FPDR Two benefits</p>
        </div>
      </dl>
      <p className={styles.body}>
        Newer hires have a different pension system. Their PERS contributions
        continue even after the old plan winds down. An old-plan funding reform
        cannot make the whole FPDR tax line disappear.
      </p>
      <p className={styles.hint}>
        <SourceLink id="milliman2024">
          2024 actuarial valuation, Appendix A
        </SourceLink>
        . Counts are not a current roster; disability recipients and alternate
        payees are separate categories. Pension averages are not total
        compensation.
      </p>
    </div>
  );
}
