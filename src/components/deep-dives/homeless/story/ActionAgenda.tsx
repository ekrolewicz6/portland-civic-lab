import { ArrowRight, Plus } from "lucide-react";
import { BH_ACTIONS } from "@/lib/homeless/behavioral-health";
import { BhCitation } from "../BehavioralHealthEvidence";
import styles from "./ContinuumStory.module.css";

const ACTIONS = [
  { title: "Resolve the rent crisis early", lead: "Some people need a financial bridge to stay housed.", body: "Build on existing housing problem-solving and prevention services. Make flexible assistance, benefit enrollment and landlord mediation available before a household loses its home.", owner: "County HSD · prevention providers · housing authorities", measure: "Time to assistance; housing status at 6 and 12 months; unmet eligible requests", source: "Existing Coordinated Access policy", href: "https://hsd.multco.us/wp-content/uploads/2025/12/1.0_CA_Policies_FINAL_2025.pdf" },
  { title: "Make an offer people can use", lead: "A vacancy needs a fit check before it becomes an offer.", body: "Record household, safety, accessibility, pet and care needs with the person. Verify that the receiving setting can meet them. Publish barriers to placement by reason, including options the person found unsuitable.", owner: "Receiving providers · referring teams · County HSD", measure: "Suitable vacancies; time to a usable offer; reasons a match fails", source: "PSU Pathways survey · April 2026", href: "https://hsd.multco.us/wp-content/uploads/2026/04/Pathways-Survey-Findings-Published-4.9.2026.pdf" },
  { title: "Close the loop on every handoff", lead: "Assign responsibility through confirmed arrival.", body: "Use a named receiving contact, agreed arrival time, transport and a fallback if the place falls through. Build on existing referral and denial tracking. A sent referral should remain open until its outcome is confirmed.", owner: "Referring worker + receiving provider", measure: "Accepted referrals with a confirmed arrival; elapsed time; failed connections by reason", source: "Existing Coordinated Access policy", href: "https://hsd.multco.us/wp-content/uploads/2025/12/1.0_CA_Policies_FINAL_2025.pdf" },
  { title: "Fund the route from shelter to housing", lead: "Safety tonight needs a funded next step.", body: "Pair shelter with housing navigation, rent assistance and access to suitable units. Compare resources and outcomes within similar populations before shifting money between shelter models.", owner: "County HSD · City · housing providers · housing authorities", measure: "Time to funded housing match and move-in; resources available per household", source: "County adult shelter review · FY25", href: "https://hsd.multco.us/wp-content/uploads/2026/01/Adult-Shelter-Review-FY25.pdf" },
  { title: "Bring housing and care together", lead: "A care plan and a lease solve different needs.", body: "Use the County’s existing cross-sector case conferencing and health navigation. Identify daily-living assistance, clinical care and benefits alongside housing. Give the plan access to actual housing resources; conferencing alone does not supply them.", owner: "County · health plans · health and housing providers", measure: "Time to appropriate care and housing; unmet support needs; housing stability", source: "Existing Cross Sector Case Conferencing", href: "https://hsd.multco.us/cross-sector-case-conferencing/" },
  { title: "Count stable housing—and what is unknown", lead: "Show the outcome and the follow-up coverage together.", body: "Publish linked placement cohorts with confirmed housing status, observed returns, other known outcomes and unknown follow-up. Reconcile conflicting shelter-exit totals. Compare like populations and use privacy-preserving public aggregates.", owner: "County HSD · City · participating providers", measure: "6- and 12-month housing status; unknown share; returns to homelessness", source: "County adult shelter review · FY25", href: "https://hsd.multco.us/wp-content/uploads/2026/01/Adult-Shelter-Review-FY25.pdf" },
];

export default function ActionAgenda() {
  return <>
    <div className={styles.actionGrid}>
      {ACTIONS.map((action, index) => <details className={styles.actionCard} key={action.title}>
        <summary><span className={styles.actionIndex}>0{index + 1}</span><div><h3>{action.title}</h3><p>{action.lead}</p></div><Plus size={19} aria-hidden="true" /></summary>
        <div className={styles.actionBody}><p>{action.body}</p><dl><div><dt>Who can act</dt><dd>{action.owner}</dd></div><div><dt>Proposed public measure</dt><dd>{action.measure}</dd></div></dl><a href={action.href} target="_blank" rel="noreferrer">Foundation: {action.source} ↗</a></div>
      </details>)}
    </div>
    <div id="legislative-2027" className={styles.sectionHeader} style={{ scrollMarginTop: "8rem", marginTop: "2.5rem" }}>
      <span className={styles.eyebrow}>September 9 Council briefing · proposal</span>
      <h3>A proposed 2027 behavioral-health agenda</h3>
      <p>The September 4 memo frames a possible focus for the City’s 2027 legislative agenda. The packet does not establish Council endorsement. Expected benefits remain forecasts; these milestones are proposed accountability measures.</p>
      <BhCitation source="memo" locator="pp. 1–3" /><BhCitation source="slides" locator="slides 12–14" />
    </div>
    <div className={styles.actionGrid}>
      {BH_ACTIONS.map((action) => <details className={styles.actionCard} key={action.title}>
        <summary><div><h3>{action.title}</h3></div><Plus size={19} aria-hidden="true" /></summary>
        <div className={styles.actionBody}><p>{action.body}</p><dl>
          <div><dt>Decision-makers</dt><dd>{action.owner}</dd></div>
          <div><dt>Evidence still needed</dt><dd>{action.evidence}</dd></div>
          <div><dt>Proposed milestone and measure</dt><dd>{action.measure}</dd></div>
        </dl><a href="#investigate">Prepare the evidence request ↓</a></div>
      </details>)}
    </div>
    <div className={styles.opportunity}>
      <div><span className={styles.smallLabel}>An opportunity already in the FY27 budget</span><h3>Turn eligibility into rent that gets paid.</h3><p>The County funded a team to help eligible Home Forward households access Medicaid rent benefits. Track whether that help arrives and keeps people housed.</p><a href="https://multco.us/news/news-release-multnomah-county-board-commissioners-closes-significant-spending-gap-adopts" target="_blank" rel="noreferrer">County adopted-budget release · June 5, 2026 ↗</a></div>
      <div><div className={styles.opportunityNumbers}><div><strong>$565k</strong><span>funded for the team</span></div><ArrowRight size={24} aria-hidden="true" /><div><strong>$7.8m</strong><span>expected rent benefits</span></div></div><div className={styles.benefitFlow} aria-label="Proposed benefit tracking: applications, approvals, payments, housing stability"><span>Apply</span><ArrowRight size={14} aria-hidden="true" /><span>Approve</span><ArrowRight size={14} aria-hidden="true" /><span>Pay</span><ArrowRight size={14} aria-hidden="true" /><span>Stay housed</span></div><p>The $7.8m is a County forecast, not realized savings or a measured return. Track each step above.</p></div>
    </div>
  </>;
}
