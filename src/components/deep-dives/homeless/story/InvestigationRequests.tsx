"use client";

import { useId, useRef, useState } from "react";
import { Check, Copy } from "lucide-react";
import styles from "./InvestigationRequests.module.css";

type Investigation = {
  id: string;
  label: string;
  question: string;
  holder: string;
  answers: string;
  records: string[];
};

const REQUESTS: Investigation[] = [
  {
    id: "capacity",
    label: "Usable capacity",
    question: "How much of the capacity can someone actually use?",
    holder: "City Shelter Services; County HSD and Health; OHA; contracted operators, through their public funder",
    answers: "Separates a shortage of physical places from closures, staffing limits, admission rules and a mismatch with the person’s needs.",
    records: [
      "Monthly inventory by public program, site and service type: designed or licensed spaces, funded spaces, staffed/operable spaces, occupied spaces, reserved spaces and temporarily closed spaces. Identify whether each figure counts beds, rooms, units or people.",
      "Published admission hours, referral channels, household and accessibility criteria, care level, and the date each rule or capacity change took effect.",
      "Existing monthly counts of referrals not admitted, grouped by reason and broad time of day; distinguish no space, no staff, intake closed, eligibility, care mismatch and unknown reason.",
    ],
  },
  {
    id: "workforce",
    label: "Staffing",
    question: "Are funded services staffed to deliver the work?",
    holder: "County HSD and Health; City Shelter Services; public contract managers and funded providers",
    answers: "Tests whether vacant positions, caseloads or gaps in shift coverage constrain access and housing work.",
    records: [
      "Monthly funded and filled full-time-equivalent positions by program and role: outreach, housing navigation, tenancy support, peer support, clinical care and operations. Distinguish filled positions from funded vacancies.",
      "Existing vacancy-duration and turnover summaries, planned versus actual shift coverage, and service hours reduced because staff were unavailable. Use role and program totals, not staff names.",
      "Active caseload totals and existing caseload ranges or standards by team and role; identify which roles provide housing placement, clinical care or daily-living assistance.",
    ],
  },
  {
    id: "outreach",
    label: "Outreach",
    question: "What follows a contact on the street?",
    holder: "City Street Services; County HSD; contracted outreach teams through their funders",
    answers: "Distinguishes visits and contacts from people engaged, suitable offers and completed connections.",
    records: [
      "Monthly counts by reporting program: visits, contact attempts, unique people reached, people newly engaged, people already receiving ongoing support, and people offered a specific resource. Keep campsite counts separate from people.",
      "For reported offers, aggregate counts by resource type and result: interested, accepted, declined, provider unable to accept, arrival confirmed, pending and unknown; provide available reason categories without identifying free text.",
      "Definitions of contact, engagement, offer and arrival; how repeat contacts and repeat offers are counted; reporting coverage and any changes in the programs included.",
    ],
  },
  {
    id: "handoff",
    label: "Handoffs",
    question: "Where do accepted referrals stop becoming arrivals?",
    holder: "County HSD; City referral programs; public health and corrections agencies for their discharge programs",
    answers: "Tests whether delays arise from receiving-site acceptance, transport, contact continuity, an expired hold or another barrier.",
    records: [
      "Existing monthly summaries that follow the same accepted-referral group: receiving provider accepted, place reserved, transport arranged, arrival confirmed, still pending, canceled and outcome unknown. Group by referring program and destination type.",
      "Time from acceptance to arrival in bands: same day, 1–3 days, 4–7 days, over 7 days and unknown. Include the date the report was produced so pending referrals have a clear follow-up window.",
      "Aggregate reasons for failed or delayed connections, and the policy identifying which staff role owns follow-up. Include hospital, treatment and jail discharge programs where the agency holds those records; exclude individual discharge records.",
    ],
  },
  {
    id: "housing-funding",
    label: "Housing & funding",
    question: "Is the next move blocked by a home, money or support?",
    holder: "County HSD; Home Forward; City housing and shelter programs; public housing funders",
    answers: "Separates a shortage of suitable units from unused assistance, vacancy delays, missing services and money not yet delivered.",
    records: [
      "Monthly or quarterly appropriated, contracted and actually spent amounts by program for rent assistance, housing navigation, move-in help and ongoing support. Identify funding restrictions and one-time versus recurring money.",
      "Existing counts of funded housing slots, assistance issued, leased units, unused or expired assistance, and new move-ins. Include vacant-unit days and match-to-move-in time by recorded reason for delay.",
      "Existing summaries showing which shelter or referral programs can access rental assistance, housing workers and support services, with available allocation or caseload figures and the rules for requesting that help.",
    ],
  },
  {
    id: "execution",
    label: "Execution",
    question: "Were the promised fixes and contract checks carried out?",
    holder: "County HSD; County CFO and contract oversight; City program funders; the relevant Auditor’s Office",
    answers: "Tests follow-through: whether risks were assessed, checks happened, changes were authorized and service continuity was planned.",
    records: [
      "The latest audit-recommendation tracking records: recommendation, responsible office and role, due date, current status, completion evidence and independent verification where available. Include the April 21, 2026 HSD oversight memorandum and related implementation records.",
      "Existing provider-risk classifications, required monitoring schedules, completed reviews, unresolved findings and corrective-action deadlines; include public copies of relevant procedures and monitoring reports with personal information removed.",
      "Changes to contract performance targets, with dates, reasons and approving role; aggregate invoice-payment delays and reasons; and existing service-continuity plans for announced provider or site closures.",
    ],
  },
  {
    id: "outcomes",
    label: "Lasting outcomes",
    question: "Did people reach housing, and do we know whether it lasted?",
    holder: "County HSD; City shelter and housing programs; participating providers through their public funders",
    answers: "Separates confirmed housing, observed returns and missing follow-up, and resolves conflicting shelter-exit totals.",
    records: [
      "The reconciled FY25 Adult Shelter Review outcome worksheet, definitions and any correction history explaining differences in exit totals, housing exits and unreported destinations across the report.",
      "Existing monthly move-in cohort summaries by housing program and assistance type: people due for 3-, 6- and 12-month follow-up; confirmed housed; observed return to homelessness; other known outcomes; and unknown status.",
      "For every rate, the numerator, denominator, observation period, reporting coverage and definition of success. Identify whether housing status is positively confirmed or inferred from no recorded return, and how repeated stays and moves are handled.",
    ],
  },
];

function requestText(request: Investigation) {
  return [
    `Records request: ${request.label.toLowerCase()} in the homelessness response`,
    `Likely records holder: ${request.holder}`,
    "",
    "Please provide the existing public records described below for September 1, 2025 through August 31, 2026, with the latest available status as of September 8, 2026. Where a specific earlier report or policy is named, please include that record and any revisions needed to interpret it.",
    "",
    `Question these records would help answer: ${request.question}`,
    "",
    ...request.records.map((record, index) => `${index + 1}. ${record}`),
    "",
    "Please provide public program information, redacted public documents and aggregate tables only. Do not provide individual client or staff records, names, personal identifiers, individual locations, exact personal contact or discharge dates, or medical records. Use monthly groups, time bands and staff roles; suppress small groups where needed to prevent identification.",
    "",
    "An existing spreadsheet or machine-readable table is preferred when available. This requests existing records, not new analysis. If the exact summary is not maintained, please identify the missing fields and any existing non-identifying equivalent. If another office holds the records, please identify that office. Please provide a fee estimate before work that would incur charges.",
  ].join("\n");
}

export default function InvestigationRequests() {
  const [selected, setSelected] = useState(REQUESTS[0].id);
  const [status, setStatus] = useState("");
  const panelId = useId();
  const fullRequest = useRef<HTMLDetailsElement>(null);
  const copyArea = useRef<HTMLTextAreaElement>(null);
  const request = REQUESTS.find((item) => item.id === selected) ?? REQUESTS[0];
  const text = requestText(request);

  async function copyRequest() {
    try {
      await navigator.clipboard.writeText(text);
      setStatus(`${request.label} request copied. It has not been sent.`);
    } catch {
      if (fullRequest.current) fullRequest.current.open = true;
      copyArea.current?.focus();
      copyArea.current?.select();
      setStatus("Copy was unavailable. The full request is selected below for you to copy.");
    }
  }

  return (
    <div className={styles.investigation}>
      <div className={styles.choices} role="group" aria-label="Choose a records request">
        {REQUESTS.map((item) => (
          <button key={item.id} type="button" aria-pressed={selected === item.id} aria-controls={panelId} onClick={() => { setSelected(item.id); setStatus(""); }}>
            {item.label}
          </button>
        ))}
      </div>
      <div className={styles.panel} id={panelId}>
        <div className={styles.heading}>
          <span className={styles.eyebrow}>Proposed records request</span>
          <h3>{request.question}</h3>
          <p>{request.answers}</p>
        </div>
        <div className={styles.requestGrid}>
          <div>
            <h4 className={styles.label}>Ask for these records</h4>
            <ol className={styles.records}>
              {request.records.map((record) => <li key={record}>{record}</li>)}
            </ol>
          </div>
          <aside className={styles.holder}>
            <h4 className={styles.label}>Likely records holder</h4>
            <p>{request.holder}</p>
            <h4 className={styles.label}>Suggested reporting period</h4>
            <p>September 2025–August 2026, plus the latest available status. The request names older records where needed.</p>
            <p className={styles.scope}>Public aggregates and redacted documents only. No personal records or exact individual locations.</p>
          </aside>
        </div>
        <div className={styles.copyRow}>
          <button className={styles.copyButton} type="button" onClick={copyRequest}>
            {status.includes("request copied") ? <Check size={18} aria-hidden="true" /> : <Copy size={18} aria-hidden="true" />}
            Copy this request
          </button>
          <span className={styles.notSent}>Copies text only. No request is sent.</span>
        </div>
        <p className={styles.status} role="status">{status}</p>
        <details className={styles.fullRequest} ref={fullRequest}>
          <summary>Read the full request before sending</summary>
          <label className={styles.textLabel} htmlFor={`${panelId}-text`}>Full request text</label>
          <textarea id={`${panelId}-text`} ref={copyArea} className={styles.requestText} value={text} readOnly rows={16} spellCheck={false} />
        </details>
      </div>
    </div>
  );
}
