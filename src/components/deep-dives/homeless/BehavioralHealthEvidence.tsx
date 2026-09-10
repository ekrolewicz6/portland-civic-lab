import { BH_COHORT, BH_PROGRAMS, BH_COMPARISONS, BH_SOURCES, type BhEvidence, type BhSource } from "@/lib/homeless/behavioral-health";
import styles from "./BehavioralHealth.module.css";

export function BhCitation({ source, locator }: { source: BhSource; locator?: string }) {
  const record = BH_SOURCES[source];
  const fragment = source === "slides" && locator?.match(/^slide[s]? (\d+)/)?.[1];
  return <a className={styles.source} href={`${record.url}${fragment ? `#page=${fragment}` : ""}`}>{record.title} · {record.date}{locator ? ` · ${locator}` : ""} ↗</a>;
}

function EvidenceScope({ record }: { record: BhEvidence }) {
  return <dl className={styles.meta}>
    <dt>Evidence status and period</dt><dd>{record.status}. {record.period}.</dd>
    <dt>Geography</dt><dd>{record.geography}.</dd>
    <dt>Population and denominator</dt><dd>{record.population}</dd>
  </dl>;
}

export default function BehavioralHealthEvidence() {
  return <div className={styles.panel}>
    <div className={styles.intro}>
      <p className={styles.eyebrow}>Local evidence · Council briefing, September 9, 2026</p>
      <h3>Behavioral-health needs follow people across the housing system.</h3>
      <p>The presentation’s high-acuity behavioral-health cohort is defined by {BH_COHORT.definition.toLowerCase()} Our pathways describe the help someone needs now. These claims records describe diagnoses recorded for a population.</p>
      <p><strong>{BH_COHORT.limitation}</strong></p>
    </div>
    <div className={styles.grid}>
      <article className={styles.card}>
        <h4>{BH_COHORT.memberShare}% of members; a larger share of spending</h4>
        <p>Share of each spending category attributed to this cohort in the Council deck:</p>
        {BH_COHORT.spending.map((item) => <div className={styles.barRow} key={item.label}>
          <div className={styles.barLabel}><span>{item.label}</span><strong>{item.percent}%</strong></div>
          <div className={styles.track} aria-hidden="true"><div className={styles.fill} style={{ width: `${item.percent}%` }} /></div>
        </div>)}
        <EvidenceScope record={BH_COHORT} />
        <BhCitation source={BH_COHORT.source} locator={BH_COHORT.locator} />
      </article>
      <article className={styles.card}>
        <h4>Overlap extends into permanent housing</h4>
        <p>Reported high-acuity share among people represented in each program:</p>
        {BH_PROGRAMS.rows.slice(0, 4).map((item) => <div className={styles.barRow} key={item.label}>
          <div className={styles.barLabel}><span>{item.label}</span><strong>{item.percent}%</strong></div>
          <div className={styles.track} aria-hidden="true"><div className={styles.fill} style={{ width: `${item.percent}%` }} /></div>
        </div>)}
        <EvidenceScope record={BH_PROGRAMS} />
        <BhCitation source={BH_PROGRAMS.source} locator={BH_PROGRAMS.locator} />
      </article>
    </div>
    <div className={styles.callout}><p><strong>Housing and care can proceed together.</strong> Someone may need hospitalization today while housing planning begins immediately. A need for clinical care does not establish a general sobriety or treatment-completion requirement for housing. Psychiatric services also do not replace prevention or affordable homes.</p></div>
    <details className={styles.disclosure}>
      <summary>Read the spending units and all program categories</summary>
      <div className={styles.tableWrap}><table className={styles.table}>
        <caption>Spending per member per month · Council slide 7</caption>
        <thead><tr><th scope="col">Service</th><th scope="col">High-acuity cohort</th><th scope="col">Comparison cohort</th></tr></thead>
        <tbody>{BH_COHORT.monthly.map((row) => <tr key={row.label}><th scope="row">{row.label}</th><td>${row.cohort}</td><td>${row.comparison}</td></tr>)}</tbody>
      </table></div>
      <p>These monthly averages are across cohort members, not costs per visit, hospital day or homeless person. The deck does not supply the observation period or full comparison-cohort exclusions. Medical inpatient spending is distinct from psychiatric inpatient spending. The difference is not an estimate of avoidable cost or savings from new psychiatric beds.</p>
      <div className={styles.tableWrap}><table className={styles.table}>
        <caption>Program-level overlap · Council slide 8 · period not supplied</caption>
        <thead><tr><th scope="col">Program</th><th scope="col">High-acuity share</th><th scope="col">Reported high-acuity count</th></tr></thead>
        <tbody>{BH_PROGRAMS.rows.map((row) => <tr key={row.label}><th scope="row">{row.label}</th><td>{row.percent}%</td><td>{row.count.toLocaleString("en-US")}</td></tr>)}</tbody>
      </table></div>
      <p>{BH_PROGRAMS.limitation}</p>
      <BhCitation source="slides" locator="slides 7–8" />
    </details>
    <details className={styles.disclosure}>
      <summary>Conflicting estimates and claims awaiting clarification</summary>
      {BH_COMPARISONS.map((item) => <article className={styles.card} key={item.title}>
        <h4>{item.title}</h4><p>{item.report}</p><p><strong>{item.caution}</strong></p>
        <p className={styles.meta}>The linked cohorts’ full denominators, geography and observation windows are not established by these summaries. Unknown follow-up must remain separate from both confirmed housing and observed returns.</p>
        <BhCitation source={item.source} locator={item.locator} />{item.comparison && <BhCitation source={item.comparison} />}
      </article>)}
    </details>
    <details className={styles.disclosure}>
      <summary>What the peer-reviewed local study adds</summary>
      <p>A study of 2023 Health Share adult members found a medical inpatient admission among <strong>29.7%</strong> of housing-insecure members with the specified substance-use or psychotic disorders, compared with <strong>12.4%</strong> of housing-secure members with those disorders. These are proportions within the two housing-status groups, not admission rates for Portland’s homeless population.</p>
      <p>The study concerns the Portland tri-county service region. It excludes members without medical claims; housing insecurity is broader than street homelessness. Its cross-sectional association supports studying housing and health together, but does not establish causality or validate the deck’s retention or mortality multipliers.</p>
      <BhCitation source="study" />
    </details>
  </div>;
}
