"use client";

import { useState } from "react";
import { CircleHelp } from "lucide-react";
import styles from "./ContinuumStory.module.css";

const WEEKS = [
  { label: "Aug 3–9, 2026", counts: [11, 3, 3], href: "https://www.portland.gov/homelessness-impact-reduction/news/2026/8/11/weekly-street-services-report-august-3-9-2026" },
  { label: "Jul 20–26, 2026", counts: [20, 11, 8], href: "https://www.portland.gov/homelessness-impact-reduction/news/2026/7/28/weekly-street-services-report-july-20-26-2026" },
] as const;

const STEPS = [
  { title: "Interested in a referral", detail: "People reported as interested in shelter referral" },
  { title: "Accepted a referral", detail: "People reported as accepting shelter referral" },
  { title: "Used a shelter bed", detail: "People reported as using a bed for at least one night" },
];

export default function EvidenceFlow() {
  const [selected, setSelected] = useState(0);
  const week = WEEKS[selected];

  return (
    <div className={styles.evidencePanel}>
      <div className={styles.panelTop}>
        <span className={styles.factBadge}>Reported City weekly totals</span>
        <div className={styles.weekPicker} role="group" aria-label="Choose a reporting week">
          {WEEKS.map((item, index) => <button type="button" key={item.label} aria-pressed={selected === index} onClick={() => setSelected(index)}>{item.label}</button>)}
        </div>
      </div>
      <div className={styles.flowGrid} aria-live="polite" aria-atomic="true">
        {STEPS.map((step, index) => (
          <div className={styles.flowStep} key={step.title}>
            <span className={styles.flowValue}>{week.counts[index]}</span>
            <h3>{step.title}</h3>
            <p>{step.detail}</p>
            <div className={styles.dotPlot} aria-hidden="true">
              {Array.from({ length: 20 }, (_, dot) => <span key={dot} className={dot < week.counts[index] ? styles.filledDot : undefined} />)}
            </div>
          </div>
        ))}
        <div className={`${styles.flowStep} ${styles.unknownStep}`}>
          <span className={styles.flowValue}>?</span>
          <h3>Reached lasting housing</h3>
          <p>These weekly reports do not follow people through to housing.</p>
          <span className={styles.unknownLabel}><CircleHelp size={15} aria-hidden="true" />Not reported here</span>
        </div>
      </div>
      <div className={styles.flowConclusion}>
        <h3>A referral, an arrival and a home are three different results.</h3>
        <p>These totals show the importance of checking each handoff. They do not tell us why a connection failed, or what happened to each person afterward.</p>
      </div>
      <div className={styles.sourceRow}>
        <span>Each green square = one person in that reported total.</span>
        <a href={week.href} target="_blank" rel="noreferrer">City Street Services · {week.label} ↗</a>
      </div>
      <details className={styles.method}>
        <summary>Why this is not a conversion-rate chart</summary>
        <p>The City publishes weekly aggregates, not linked records tracing the same people through each step. These figures are not all people contacted or all shelter offers. Dividing them would imply a person-level conversion rate the report does not establish. The two weeks are examples, not a trend. Unknown housing outcomes are not evidence of a return to the street.</p>
      </details>
    </div>
  );
}
