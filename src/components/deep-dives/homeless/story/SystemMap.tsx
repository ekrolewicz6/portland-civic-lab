"use client";

import { useState } from "react";
import { ArrowDown, ArrowRight, Check, CircleHelp, DoorOpen, HeartHandshake, Home, KeyRound, PersonStanding, ShieldCheck, Unplug } from "lucide-react";
import styles from "./ContinuumStory.module.css";

const SHELTER_REVIEW = "https://hsd.multco.us/wp-content/uploads/2026/01/Adult-Shelter-Review-FY25.pdf";

const BREAKS = [
  {
    id: "supply", label: "No place to go", icon: KeyRound, at: "housing", tag: "Housing resources",
    title: "A shelter stay needs a way out.",
    evidence: "The County’s shelter review found unequal access to the resources that help people move into housing.",
    meaning: "A shelter can provide safety while the person still waits for a suitable home, rent assistance or support.",
    repair: "Fund the housing connection.",
    action: "Attach housing navigation, rent assistance and suitable units to shelter programs. Start the housing work at first contact.",
    owner: "County HSD · City · housing providers",
    measure: "Days from a housing request to a funded match and move-in",
    href: SHELTER_REVIEW, source: "County shelter review · FY25",
  },
  {
    id: "access", label: "Can’t get in", icon: DoorOpen, at: "entry", tag: "Access rules",
    title: "Open does not always mean accepting you.",
    evidence: "County sobering operates 24/7, but admission is voluntary, referral-only and subject to care criteria.",
    meaning: "Hours, referral authority, staffing and the person’s needs determine whether a resource is usable.",
    repair: "Verify the door before the offer.",
    action: "Check who can enter, who can refer, current intake, staffing and transport. Expand access where appropriate and funded.",
    owner: "Receiving provider · referring team · funder",
    measure: "Suitable referrals unable to enter, by reason and hour",
    href: "https://multco.us/info/sobering-services", source: "County sobering access · reviewed July 2026",
  },
  {
    id: "fit", label: "Wrong fit", icon: PersonStanding, at: "entry", tag: "Household & care needs",
    title: "The offer has to work for the person.",
    evidence: "PSU’s local survey identified pets, household relationships and permanence as important housing considerations.",
    meaning: "Turning down a specific option does not tell us that someone wants to remain homeless.",
    repair: "Match the place to the person.",
    action: "Ask about safety, partners, pets, mobility, daily care and location. Record the reason an offer does not fit and offer an alternative.",
    owner: "Housing and shelter providers · navigators",
    measure: "Declined or unsuitable offers, by barrier; completed matches",
    href: "https://hsd.multco.us/wp-content/uploads/2026/04/Pathways-Survey-Findings-Published-4.9.2026.pdf", source: "PSU Pathways study · April 2026, pp. 44–49",
  },
  {
    id: "handoff", label: "Handoff unconfirmed", icon: Unplug, at: "entry", tag: "Referral → arrival",
    title: "Sending a referral is only the beginning.",
    evidence: "In one July 2026 week, the City reported 11 accepted shelter referrals and 8 people using a bed. The report does not explain the difference.",
    meaning: "Weekly totals cannot establish each person’s journey. A completed handoff needs a receiving record.",
    repair: "Keep ownership until arrival.",
    action: "Name the receiving worker, hold the place and arrange a ride. Confirm arrival and follow up when the connection fails.",
    owner: "Referring worker + receiving provider",
    measure: "Accepted referrals with confirmed arrivals and elapsed time",
    href: "https://www.portland.gov/homelessness-impact-reduction/news/2026/7/28/weekly-street-services-report-july-20-26-2026", source: "City Street Services · July 20–26, 2026",
  },
  {
    id: "support", label: "Unmet support", icon: HeartHandshake, at: "support", tag: "After move-in",
    title: "The key does not meet every need.",
    evidence: "The County already brings housing-service providers together with health and disability systems through case conferencing.",
    meaning: "A lease and adequate care are different resources. Some people need both to make housing work.",
    repair: "Make support travel with the person.",
    action: "Connect care, benefits and tenancy help before move-in. Keep a responsible team available when needs change.",
    owner: "Housing providers · health plans · care teams",
    measure: "Unmet support needs and housing stability after move-in",
    href: "https://hsd.multco.us/cross-sector-case-conferencing/", source: "County Cross Sector Case Conferencing",
  },
  {
    id: "visibility", label: "Outcome unknown", icon: CircleHelp, at: "housing", tag: "Follow-up data",
    title: "We lose sight of what happened next.",
    evidence: "Roughly half of the exits in the County’s FY25 shelter review had unreported destinations. Its exact totals need reconciliation.",
    meaning: "Missing information cannot tell us whether a person found housing, moved elsewhere or returned outside.",
    repair: "Track outcomes and missing follow-up.",
    action: "Follow placement cohorts over time. Publish confirmed housing, observed returns, other outcomes and unknown status separately.",
    owner: "County HSD · City · participating providers",
    measure: "Housing status at 6 and 12 months, including the unknown share",
    href: SHELTER_REVIEW, source: "County shelter review · FY25, pp. 13 & 35",
  },
] as const;

export default function SystemMap() {
  const [selected, setSelected] = useState<string>("supply");
  const [repaired, setRepaired] = useState(false);
  const current = BREAKS.find((item) => item.id === selected) ?? BREAKS[0];
  const Icon = current.icon;

  return (
    <div className={styles.systemExplorer}>
      <div className={styles.breakPicker} role="group" aria-label="Explore six ways a placement can fail">
        {BREAKS.map((item, index) => {
          const ItemIcon = item.icon;
          return (
            <button key={item.id} type="button" aria-pressed={selected === item.id} onClick={() => setSelected(item.id)} className={styles.breakButton}>
              <span className={styles.breakNumber}>0{index + 1}</span>
              <ItemIcon size={21} aria-hidden="true" />
              <span>{item.label}</span>
            </button>
          );
        })}
      </div>

      <div className={styles.systemBody}>
        <div className={styles.mapCanvas}>
          <div className={styles.mapToolbar}>
            <span className={styles.smallLabel}>The path to a lasting home</span>
            <div className={styles.modeSwitch} role="group" aria-label="Map view">
              <button type="button" aria-pressed={!repaired} onClick={() => setRepaired(false)}>The break</button>
              <button type="button" aria-pressed={repaired} onClick={() => setRepaired(true)}>The repair</button>
            </div>
          </div>

          <figure className={styles.systemFigure} aria-label={`${current.label}: ${repaired ? current.repair : current.title}`}>
            <div className={styles.directPath}><span>Prevent the loss of housing, or move directly into a home</span><ArrowRight size={17} aria-hidden="true" /></div>
            <div className={styles.mapRail}>
              <div className={styles.mapNode}>
                <span className={styles.nodeIcon}><PersonStanding size={29} strokeWidth={1.5} aria-hidden="true" /></span>
                <strong>Needs a safe place</strong>
                <span>Outside or at risk of losing housing</span>
              </div>
              <div className={`${styles.mapConnection} ${current.at === "entry" ? (repaired ? styles.repairedConnection : styles.brokenConnection) : ""}`}>
                {current.at === "entry" ? <span className={styles.connectionMarker}>{repaired ? <Check size={17} aria-label="Proposed repair" /> : <Unplug size={17} aria-label="Break point" />}</span> : <ArrowRight size={21} aria-hidden="true" />}
              </div>
              <div className={styles.mapNode}>
                <span className={styles.nodeIcon}><ShieldCheck size={29} strokeWidth={1.5} aria-hidden="true" /></span>
                <strong>Safe interim place</strong>
                <span>Shelter or a suitable care setting</span>
                <em>When needed</em>
              </div>
              <div className={`${styles.mapConnection} ${current.at === "housing" ? (repaired ? styles.repairedConnection : styles.brokenConnection) : ""}`}>
                {current.at === "housing" ? <span className={styles.connectionMarker}>{repaired ? <Check size={17} aria-label="Proposed repair" /> : <Unplug size={17} aria-label="Break point" />}</span> : <ArrowRight size={21} aria-hidden="true" />}
              </div>
              <div className={`${styles.mapNode} ${styles.homeNode}`}>
                <span className={styles.nodeIcon}><Home size={29} strokeWidth={1.5} aria-hidden="true" /></span>
                <strong>A lasting home</strong>
                <span>Affordable, suitable and supported</span>
              </div>
            </div>
            <div className={styles.parallelTracks}>
              <div><KeyRound size={18} aria-hidden="true" /><span><strong>Housing work</strong> Rent help, a suitable unit and a way in</span><ArrowRight size={18} aria-hidden="true" /></div>
              <div className={current.at === "support" ? (repaired ? styles.repairedTrack : styles.brokenTrack) : undefined}><HeartHandshake size={18} aria-hidden="true" /><span><strong>Support throughout</strong> Health care, recovery, daily living and tenancy help</span><ArrowRight size={18} aria-hidden="true" /></div>
            </div>
            <figcaption>Routes are conceptual. People can receive housing help and care at the same time.</figcaption>
          </figure>
        </div>

        <div className={`${styles.breakDetail} ${repaired ? styles.repairDetail : ""}`} aria-live="polite" aria-atomic="true">
          <div className={styles.detailTag}><Icon size={18} aria-hidden="true" />{repaired ? "Proposed repair" : current.tag}</div>
          <h3>{repaired ? current.repair : current.title}</h3>
          <p className={styles.detailMain}>{repaired ? current.action : current.meaning}</p>
          {repaired ? (
            <dl className={styles.repairMeasures}>
              <div><dt>Who can act</dt><dd>{current.owner}</dd></div>
              <div><dt>What to measure</dt><dd>{current.measure}</dd></div>
            </dl>
          ) : (
            <div className={styles.evidenceNote}>
              <span className={styles.smallLabel}>What the local source shows</span>
              <p>{current.evidence}</p>
              <a href={current.href} target="_blank" rel="noreferrer">{current.source} <ArrowRight size={13} aria-hidden="true" /></a>
            </div>
          )}
          <button type="button" className={styles.detailAction} onClick={() => setRepaired(!repaired)}>{repaired ? "Return to the evidence" : "See what would repair this"}<ArrowRight size={17} aria-hidden="true" /></button>
        </div>
      </div>
      <div className={styles.mapTakeaway}><ArrowDown size={18} aria-hidden="true" /><span><strong>The handoff is part of the service.</strong> Funding a place is only one part of making it usable.</span></div>
    </div>
  );
}
