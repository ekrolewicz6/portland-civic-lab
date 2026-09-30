"use client";

import { useState } from "react";
import styles from "@/app/(public)/deep-dives/participatory-budgeting/participatory-budgeting.module.css";

const allocation = 16.4;
export default function BudgetIllustration() {
  const [administration, setAdministration] = useState(1);
  const projects = allocation - administration;
  return (
    <figure className={styles.budget} aria-labelledby="budget-title">
      <figcaption id="budget-title">One allocation. Two uses.</figcaption>
      <p>Illustrate how process costs change the money left for projects within a fixed $16.4 million allocation.</p>
      <fieldset>
        <legend>Assumed annual administration and process cost</legend>
        <div className={styles.choices}>
          {[1, 2, 3].map((amount) => (
            <button key={amount} type="button" aria-pressed={administration === amount} onClick={() => setAdministration(amount)}>
              ${amount} million
            </button>
          ))}
        </div>
      </fieldset>
      <div aria-live="polite" aria-atomic="true">
        <div className={styles.bar} aria-hidden="true">
          <div style={{ flex: projects }} />
          <div style={{ flex: administration }} />
        </div>
        <dl className={styles.split}>
          <div><dt>Available for projects</dt><dd>${projects.toFixed(1)}M</dd></div>
          <div><dt>Administration & process</dt><dd>${administration.toFixed(1)}M <small>({(100 * administration / allocation).toFixed(1)}%)</small></dd></div>
        </dl>
      </div>
      <p className={styles.budgetNote}>
        Scenarios, not forecasts. $16.4M is the ballot’s preliminary estimate; $1M is an advocate’s administration estimate.
        $2M and $3M are illustrative alternatives. No detailed city implementation budget was supplied.
        This shows the allocation’s composition, not its net fiscal impact or which services might change.
        {" "}<a href="https://www.pboregon.org/your2centspdx">Advocate FAQ</a> · <a href="https://multco.us/file/measure_26-267/download">Ballot estimate</a>
      </p>
    </figure>
  );
}
