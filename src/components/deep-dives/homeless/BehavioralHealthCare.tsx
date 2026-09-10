import { BH_CARE_SETTINGS, BH_RESPONSIBILITIES } from "@/lib/homeless/behavioral-health";
import BehavioralHealthEvidence, { BhCitation } from "./BehavioralHealthEvidence";
import styles from "./BehavioralHealth.module.css";

export default function BehavioralHealthCare() {
  return <div className={styles.panel}>
    <div className={styles.intro}><p>The September 9 Council materials identify a specific clinical gap: preserving acute psychiatric care and creating appropriate receiving care after hospitalization. A discharge-ready patient can still need substantial psychiatric support. A downstream delay can keep an upstream hospital bed occupied.</p><p>These are source descriptions and proposed directions, not a verified inventory of services accepting referrals or evidence that Council adopted the proposals.</p><BhCitation source="slides" locator="slides 11–14" /></div>
    <div className={styles.grid}>{BH_CARE_SETTINGS.map((care) => <article className={`${styles.card} ${styles.careCard}`} key={care.id}>
      <h3>{care.name}</h3><p>{care.purpose}</p><p><strong>Check the fit:</strong> {care.boundary}</p>
      <details><summary>What to measure and where this comes from</summary><p>{care.measure}</p><BhCitation source={care.source} locator={care.locator} /></details>
    </article>)}</div>
    <div className={styles.callout}><p><strong>A completed clinical transfer is not a housing outcome.</strong> Continue housing navigation, benefits, medication and clinical follow-up through the move. Measure a suitable arrival and later housing stability separately. <a href="#pathways">Explore the psychiatric transition example ↓</a></p></div>
    <details className={styles.disclosure}>
      <summary>Who funds, authorizes, operates and controls admission?</summary>
      <p>This is a responsibility map to verify for each service and person. Assigning the transition to one agency does not give that agency control over every decision.</p>
      <div className={styles.grid}>{BH_RESPONSIBILITIES.map((item) => <article key={item.role}><h4>{item.role}</h4><p><strong>{item.actor}</strong></p><p>{item.question}</p></article>)}</div>
      <BhCitation source="slides" locator="slides 3–5, 12–14" />
      <h4>State Hospital civil access is constrained, not categorically nonexistent</h4>
      <p>The memo’s blanket statement about access outside the justice system is too broad. The court monitor recorded 35 civil patients at OSH on March 1, 2026 and ten approved expedited civil-admission requests in January–February. These statewide historical counts concern different populations and periods; they are not a current vacancy count or an admission rate.</p>
      <p>Check current civil and forensic protocols and orders before describing access today. The reviewed case listing includes a September 4 motion to purge contempt and September 8 opposition; neither filing establishes release from contempt. Meeting an admission deadline and a court ruling on contempt are different events.</p>
      <BhCitation source="monitor" locator="p. 21" /><BhCitation source="docket" />
    </details>
    <details className={styles.disclosure}>
      <summary>Construction, operating finance and usable capacity</summary>
      <p>A funded building still needs a licensed service, a staffed team, continuing reimbursement and an accepting provider. Compare service-level operating costs with payment by payer, uncovered care, authorization delays and staffing requirements. The presentation’s break-even reimbursement proposal needs a specified payment mechanism and a recurring budget.</p>
      <p>Statewide, multiyear appropriations are not Portland’s annual operating budget or beds currently available. Reconcile funded projects, closures, opening dates and staffing against OHA’s project records before calculating capacity or a cost per bed.</p>
      <p>Federal matching shares describe how Medicaid is financed. OHA pays predetermined monthly capitation amounts to CCOs. Lower claims can affect plan finances under their risk arrangements and later rate-setting; they do not automatically divide into federal and CCO savings at the matching rate.</p>
      <p>SHARE is a potential reinvestment mechanism subject to financial conditions and spending requirements. Its housing priority does not automatically reserve money for a County-selected project.</p>
      <BhCitation source="slides" locator="slides 6, 12–14" /><BhCitation source="investments" /><BhCitation source="rates" /><BhCitation source="share" />
    </details>
    <details className={styles.disclosure}>
      <summary>Build on existing programs and obtain the regional model</summary>
      <p>Health Share describes hospital addiction consultation, emergency-department medication initiation, outreach and peers, wound care, Regional Integration Continuum coordination and EMS service coordination. Investigate each program’s reach, staffing and completed connections; a program description does not establish adequate coverage or effectiveness.</p>
      <BhCitation source="programs" />
      <p>A February 2024 regional announcement allocated $500,000 to a two-year OHSU capacity-modeling project. The County’s original action plan assigned the named regional model to CareOregon and Health Share with a December 2025 due date. Confirm whether this is the model cited in the Council deck and obtain its methods, validation, scenarios and results.</p>
      <p>Our educational flow simulator assumes four annual treatment episodes per staffed bed and a 35% durable homelessness-exit rate. Those planning assumptions do not describe acute psychiatry, subacute care or psychiatric respite. No numerical psychiatric scenario is added without supporting evidence.</p>
      <BhCitation source="model" /><BhCitation source="roles" locator="p. 23 · action 3.1.2" /><a href="#investigate">Prepare a model evidence request ↓</a>
    </details>
    <details className={styles.disclosure}><summary>Explore the local cohort evidence and unresolved comparisons</summary><BehavioralHealthEvidence /></details>
  </div>;
}
