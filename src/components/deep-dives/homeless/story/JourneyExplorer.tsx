"use client";

import { useId, useState } from "react";
import styles from "./JourneyExplorer.module.css";

type RouteStop = { title: string; caption: string };
type JourneyMode = "stuck" | "repair";
type Journey = {
  id: string;
  label: string;
  title: string;
  need: string;
  icon: "home" | "care" | "person";
  start: RouteStop;
  stuck: { middle: RouteStop; end: RouteStop; support: string[]; explanation: string };
  repair: { middle: RouteStop; end: RouteStop; support: string[]; explanation: string };
  verify: string;
  sources: { name: string; url: string; note: string }[];
};

const JOURNEYS: Journey[] = [
  {
    id: "rent",
    label: "A rent crisis",
    title: "Keep the home. Prevent the crisis.",
    need: "A renter needs help closing a financial gap so they can stay in the home they already have.",
    icon: "home",
    start: { title: "Still at home", caption: "Rent is becoming unaffordable." },
    stuck: {
      middle: { title: "Help without a solution", caption: "A conversation does not pay the arrears." },
      end: { title: "Home still at risk", caption: "The financial gap remains." },
      support: ["Ask about the housing crisis", "Assistance not secured", "Housing status uncertain"],
      explanation: "Housing problem solving already exists. The missing link in this example is timely financial help and an agreement that lets the renter stay.",
    },
    repair: {
      middle: { title: "A workable rent plan", caption: "Match assistance to the actual gap." },
      end: { title: "Keep the existing home", caption: "Successful prevention needs no shelter stay." },
      support: ["Check benefits and eligibility", "Arrange legal or mediation help", "Follow through with the renter"],
      explanation: "Connect housing problem solving with eligible rent assistance, benefits, and landlord mediation or legal help. Confirm the plan is affordable beyond the immediate payment.",
    },
    verify: "Was assistance delivered, was the housing crisis resolved, and is the renter still housed at follow-up?",
    sources: [
      {
        name: "Multnomah County · Coordinated Access policies",
        url: "https://hsd.multco.us/wp-content/uploads/2025/12/1.0_CA_Policies_FINAL_2025.pdf",
        note: "November 2025, pp. 7–8: housing problem solving includes mediation and sometimes limited financial assistance; coverage is limited.",
      },
      {
        name: "Multnomah County · Rent assistance",
        url: "https://hsd.multco.us/healthcare-resources/",
        note: "The county lists Medicaid rent-assistance and other housing-support routes. Eligibility and available funding must be checked.",
      },
    ],
  },
  {
    id: "discharge",
    label: "Leaving the hospital",
    title: "A place to recover. The care to stay there.",
    need: "A person leaving the hospital needs a safe place to recover and hands-on help with daily activities.",
    icon: "care",
    start: { title: "Preparing for discharge", caption: "Housing and care both need a plan." },
    stuck: {
      middle: { title: "The care does not fit", caption: "A bed alone cannot meet this need." },
      end: { title: "No confirmed next place", caption: "The receiving care is unresolved." },
      support: ["Needs identified", "Daily-living support not arranged", "Receiving team unconfirmed"],
      explanation: "Medical respite is not a fit for everyone: CCC requires independent daily activities and medication management. A person needing hands-on help needs an appropriate care arrangement.",
    },
    repair: {
      middle: { title: "Match housing and care", caption: "Check what the receiving setting can provide." },
      end: { title: "An appropriate place", caption: "Confirm the placement and its care plan." },
      support: ["Qualified care assessment", "Arrange daily-living support", "Connect the receiving care team"],
      explanation: "Plan housing and care together, using care navigation and existing cross-sector partners. Confirm that the next setting can provide the support this person actually needs.",
    },
    verify: "Has the receiving setting accepted the referral, with transport, medication continuity, and daily support arranged?",
    sources: [
      {
        name: "Central City Concern · Recuperative Care",
        url: "https://centralcityconcern.org/health-care-location/recuperative-care/",
        note: "Published eligibility requires independent daily activities, mobility with or without aids, and medication management.",
      },
      {
        name: "Multnomah County · Cross Sector Case Conferencing",
        url: "https://hsd.multco.us/cross-sector-case-conferencing/",
        note: "Existing partners help connect people to health care and daily-living support. This forum does not offer housing resources.",
      },
      {
        name: "Multnomah County · Navigation Team",
        url: "https://hsd.multco.us/healthcare-resources/",
        note: "The spring 2026 pilot helps people with behavioral health conditions navigate long-term support services.",
      },
    ],
  },
  {
    id: "outside",
    label: "An offer from the street",
    title: "Make an offer that works for the person.",
    need: "A person outside needs a safe option that works for their mobility, partner, pet, and belongings.",
    icon: "person",
    start: { title: "Living outside", caption: "A conversation starts with what matters." },
    stuck: {
      middle: { title: "An unsuitable offer", caption: "The available option does not fit." },
      end: { title: "Still outside", caption: "Declining this offer has not resolved the need." },
      support: ["An outreach connection", "Preferences not resolved", "No completed handoff"],
      explanation: "A referral can fall apart when the option is inaccessible or separates a person from essential support. Record the reason this offer failed, rather than label the person.",
    },
    repair: {
      middle: { title: "A suitable, accepted offer", caption: "Confirm fit, availability, and transport." },
      end: { title: "A safe place + a plan", caption: "Verify arrival; continue the housing work." },
      support: ["Keep the outreach relationship", "Connect care by consent", "Continue housing navigation"],
      explanation: "Check the person's preferences and the destination's access rules before making the offer. Arrange the handoff and keep permanent housing work moving alongside care.",
    },
    verify: "Did the person arrive and find the placement suitable—and is someone accountable for the next housing step?",
    sources: [
      {
        name: "Multnomah County · Coordinated Access",
        url: "https://hsd.multco.us/coordinated-access/",
        note: "Existing housing matching considers household needs and preferences; a housing assessment does not guarantee an immediate bed.",
      },
      {
        name: "Portland · Street Services, July 20–26, 2026",
        url: "https://www.portland.gov/homelessness-impact-reduction/news/2026/7/28/weekly-street-services-report-july-20-26-2026",
        note: "The city reports interest, accepted referrals, and use of a bed for at least one night as separate measures.",
      },
    ],
  },
];

function JourneyIcon({ kind }: { kind: Journey["icon"] }) {
  return (
    <svg viewBox="0 0 32 32" fill="none" aria-hidden="true" focusable="false">
      {kind === "home" ? (
        <>
          <path d="m4 14 12-9 12 9M7 12v15h18V12" />
          <path d="M13 27V17h6v10" />
        </>
      ) : kind === "care" ? (
        <>
          <path d="M11 5h10v7h7v10h-7v7H11v-7H4V12h7V5Z" />
          <path d="M12 17h8M16 13v8" />
        </>
      ) : (
        <>
          <circle cx="16" cy="8" r="4" />
          <path d="M7 27v-5a9 9 0 0 1 18 0v5M12 20v7M20 20v7" />
        </>
      )}
    </svg>
  );
}

export default function JourneyExplorer() {
  const [selected, setSelected] = useState(0);
  const [mode, setMode] = useState<JourneyMode>("stuck");
  const panelId = useId();
  const journey = JOURNEYS[selected];
  const route = journey[mode];
  const isRepair = mode === "repair";

  return (
    <div className={styles.explorer}>
      <fieldset className={styles.picker}>
        <legend className={styles.legend}>Choose a situation</legend>
        <div className={styles.choices}>
          {JOURNEYS.map((item, index) => (
            <button
              key={item.id}
              type="button"
              className={styles.choice}
              aria-pressed={selected === index}
              aria-controls={panelId}
              onClick={() => setSelected(index)}
            >
              <JourneyIcon kind={item.icon} />
              <span>{item.label}</span>
              <span className={styles.choiceNumber} aria-hidden="true">0{index + 1}</span>
            </button>
          ))}
        </div>
      </fieldset>

      <div className={styles.story} id={panelId}>
        <div className={styles.intro}>
          <p className={styles.eyebrow}>Illustrative journey <span aria-hidden="true">/</span> 0{selected + 1}</p>
          <h3 className={styles.title}>{journey.title}</h3>
          <p className={styles.need}>{journey.need}</p>
        </div>

        <fieldset className={styles.modePicker}>
          <legend className={styles.srOnly}>Compare the handoff</legend>
          <button
            type="button"
            aria-pressed={!isRepair}
            aria-controls={`${panelId}-route`}
            className={styles.modeButton}
            onClick={() => setMode("stuck")}
          >
            <span className={styles.stuckDot} aria-hidden="true" />
            Where it gets stuck
          </button>
          <button
            type="button"
            aria-pressed={isRepair}
            aria-controls={`${panelId}-route`}
            className={styles.modeButton}
            onClick={() => setMode("repair")}
          >
            <span className={styles.repairDot} aria-hidden="true" />
            A better handoff
          </button>
        </fieldset>

        <div
          className={styles.diagram}
          data-mode={mode}
          id={`${panelId}-route`}
          role="group"
          aria-label={`${journey.label}: ${isRepair ? "a proposed better handoff" : "an illustrative bottleneck"}`}
        >
          <div className={styles.diagramHeading}>
            <span className={styles.railLabel}>Housing route</span>
            <span className={styles.viewLabel}>{isRepair ? "Proposed improvement" : "Illustrative bottleneck"}</span>
          </div>
          <ol className={styles.route}>
            {[journey.start, route.middle, route.end].map((stop, index) => (
              <li className={styles.stop} key={index} data-position={index}>
                <span className={styles.station} aria-hidden="true">
                  {index === 1 ? (
                    <svg viewBox="0 0 24 24" fill="none" focusable="false">
                      {isRepair ? <path d="m5 12 4 4L19 6" /> : <path d="M8 5v14M16 5v14" />}
                    </svg>
                  ) : index === 2 ? (
                    <JourneyIcon kind="home" />
                  ) : (
                    <span />
                  )}
                </span>
                <h4 className={styles.stopTitle}>{stop.title}</h4>
                <p className={styles.stopCaption}>{stop.caption}</p>
              </li>
            ))}
          </ol>

          <div className={styles.supportRail}>
            <div className={styles.supportLabel}>
              <span className={styles.parallelSymbol} aria-hidden="true">∥</span>
              <span>Support alongside housing</span>
            </div>
            <ul className={styles.supportStops}>
              {route.support.map((support, index) => (
                <li key={index}>
                  <span className={styles.supportNode} aria-hidden="true" />
                  <span>{support}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className={styles.explanation} aria-live="polite" aria-atomic="true">
          <span className={styles.explanationLabel}>{isRepair ? "Repair the connection" : "The missing link"}</span>
          <p>{route.explanation}</p>
        </div>
        <div className={styles.verification}>
          <span className={styles.verificationIcon} aria-hidden="true">↳</span>
          <div>
            <p className={styles.verificationLabel}>The next outcome to verify</p>
            <p>{journey.verify}</p>
          </div>
        </div>

        <details className={styles.sources} key={journey.id}>
          <summary>Evidence &amp; existing resources <span aria-hidden="true">+</span></summary>
          <ul>
            {journey.sources.map((source) => (
              <li key={source.url}>
                <a href={source.url}>{source.name} <span aria-hidden="true">↗</span></a>
                <p>{source.note}</p>
              </li>
            ))}
          </ul>
        </details>
        <p className={styles.note}>Illustrations, not individual case records. Better handoffs are proposals, not guaranteed placements or outcomes.</p>
      </div>
    </div>
  );
}
