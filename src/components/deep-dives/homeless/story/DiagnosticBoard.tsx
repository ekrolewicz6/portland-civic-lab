"use client";

import { useCallback, useEffect, useState } from "react";
import { AlertTriangle, ArrowRight, CircleHelp, Filter, Plus } from "lucide-react";
import { DIAGNOSES, DIAGNOSIS_SOURCES, DIMENSIONS, type Dimension, type EvidenceStatus } from "./diagnosis-data";
import styles from "./DiagnosticBoard.module.css";

const STATUS = {
  documented: { label: "Documented problem", symbol: "!" },
  limit: { label: "Access rule / service boundary", symbol: "↳" },
  question: { label: "Question not resolved here", symbol: "?" },
};

function StatusMark({ status, dimension }: { status?: EvidenceStatus; dimension: string }) {
  return <span className={`${styles.cell} ${status ? styles[status] : styles.unassessed}`} title={`${dimension}: ${status ? STATUS[status].label : "No finding assigned"}`}>
    <span className={styles.mobileDimension} aria-hidden="true">{dimension}</span>
    <span aria-hidden="true">{status ? STATUS[status].symbol : "—"}</span>
    <span className={styles.srOnly}>{dimension}: {status ? STATUS[status].label : "No finding assigned"}</span>
  </span>;
}

export default function DiagnosticBoard() {
  const [filter, setFilter] = useState<Dimension | "all">("all");
  const reveal = useCallback((id: string) => {
    setFilter("all");
    requestAnimationFrame(() => {
      const row = document.getElementById(`diagnosis-${id}`);
      if (!(row instanceof HTMLDetailsElement)) return;
      row.open = true;
      row.querySelector("summary")?.focus({ preventScroll: true });
      row.scrollIntoView({ block: "start", behavior: "instant" });
    });
  }, []);
  useEffect(() => {
    function revealHash() {
      const id = window.location.hash.replace("#diagnosis-", "");
      if (DIAGNOSES.some((row) => row.id === id)) reveal(id);
    }
    revealHash();
    window.addEventListener("hashchange", revealHash);
    return () => window.removeEventListener("hashchange", revealHash);
  }, [reveal]);
  const shown = filter === "all" ? DIAGNOSES : DIAGNOSES.filter((row) => row.cells[filter]);
  return <div className={styles.board}>
    <div className={styles.faultCards}>
      <a href="#diagnosis-shelter" onClick={() => reveal("shelter")} className={styles.faultCard}><span className={styles.faultType}><AlertTriangle size={16} aria-hidden="true" />Shelter → a usable bed</span><h3>Built capacity. <br />Not enough staff to use it.</h3><p>Kenton Women’s Village could not operate at full capacity early in FY25 because of staffing shortages.</p><span className={styles.faultFoot}>County shelter review · FY25 <ArrowRight size={16} aria-hidden="true" /></span></a>
      <a href="#diagnosis-supportive" onClick={() => reveal("supportive")} className={styles.faultCard}><span className={styles.faultType}><AlertTriangle size={16} aria-hidden="true" />Ready unit → move-in</span><h3>Vacant apartments. <br />Veterans waiting.</h3><p>The latest SHS report identifies delayed unit turnovers and a placement backlog tied to property management.</p><span className={styles.faultFoot}>County SHS report · FY26 Q4 <ArrowRight size={16} aria-hidden="true" /></span></a>
      <a href="#oversight-failure" className={styles.faultCard}><span className={styles.faultType}><AlertTriangle size={16} aria-hidden="true" />Contracts → reliable services</span><h3>Known risks. <br />Incomplete oversight.</h3><p>In April 2026, the Auditor again sought stronger high-risk monitoring and independent provider oversight.</p><span className={styles.faultFoot}>County Auditor · April 21, 2026 <ArrowRight size={16} aria-hidden="true" /></span></a>
    </div>

    <div className={styles.boardIntro}>
      <div><p className={styles.eyebrow}>The operating diagnosis</p><h3>Which part is broken—and in what way?</h3><p>Fourteen functions. Seven possible constraints. Read across a row, then open it for the evidence and the exact question to investigate.</p></div>
      <div className={styles.legend} aria-label="Evidence key">
        <span><i className={styles.documented}>!</i>Documented problem</span>
        <span><i className={styles.limit}>↳</i>Access rule / boundary</span>
        <span><i className={styles.question}>?</i>Question unresolved here</span>
        <span><i className={styles.unassessed}>—</i>No finding assigned</span>
      </div>
    </div>
    <p className={styles.readingNote}>A red mark identifies a specific reported problem, at the date shown. It does not mean every provider fails. An access rule may be appropriate; the question is whether an alternative exists. A question mark is a research gap, not a verdict.</p>

    <div className={styles.filters} role="group" aria-label="Filter diagnosis by type of constraint"><span><Filter size={14} aria-hidden="true" />Focus on</span><button type="button" aria-pressed={filter === "all"} onClick={() => setFilter("all")}>All functions</button>{DIMENSIONS.map(({ id, label }) => <button type="button" key={id} aria-pressed={filter === id} onClick={() => setFilter(id)}>{label}</button>)}</div>
    <p className={styles.results} role="status">{shown.length} of 14 functions shown{filter !== "all" ? ` · ${DIMENSIONS.find((d) => d.id === filter)?.label}` : " · Open any row"}</p>
    <div className={styles.matrix}>
      <div className={styles.matrixHeader} aria-hidden="true"><span>Function</span><span>Issue &amp; evidence period</span>{DIMENSIONS.map(({ id, label }) => <span key={id}>{label}</span>)}<span /></div>
      {shown.map((row) => {
        const source = DIAGNOSIS_SOURCES[row.source];
        return <details className={styles.row} id={`diagnosis-${row.id}`} key={row.id}>
          <summary className={styles.rowSummary}>
            <div className={styles.function}><strong>{row.name}</strong><span>{row.phase}</span></div>
            <div className={styles.issue}><strong>{row.headline}</strong><span>{row.period}</span></div>
            {DIMENSIONS.map(({ id, label }) => <StatusMark key={id} status={row.cells[id]} dimension={label} />)}
            <Plus className={styles.expand} size={18} aria-hidden="true" />
          </summary>
          <div className={styles.rowDetail}>
            <div className={styles.evidenceBlock}>
              <span className={`${styles.evidenceLabel} ${styles[row.status]}`}>{STATUS[row.status].label}</span>
              <h4>What the source establishes</h4><p>{row.evidence}</p>
              <a href={source.href} target="_blank" rel="noreferrer">{source.label}{row.locator ? ` · ${row.locator}` : ""} ↗</a>
              <h4>Why this matters</h4><p>{row.consequence}</p>
              {row.id === "withdrawal" && <div className={styles.transferChart} role="img" aria-label="In the 2022 Hooper cohort, 264 residential placements at discharge out of 1554 assessments recommending residential care, about 17 percent."><div><span style={{ width: `${264 / 1554 * 100}%` }} /></div><p><strong>17%</strong> placed in residential care at discharge · 2022 cohort</p></div>}
              {row.progress && <p className={styles.progress}><strong>What also matters:</strong> {row.progress}</p>}
              {row.progressSource && <a href={DIAGNOSIS_SOURCES[row.progressSource].href} target="_blank" rel="noreferrer">{DIAGNOSIS_SOURCES[row.progressSource].label}{row.progressLocator ? ` · ${row.progressLocator}` : ""} ↗</a>}
            </div>
            <div className={styles.investigateBlock}><span className={styles.eyebrow}>The next investigation</span><h4>{row.question}</h4><dl><div><dt>Records that would answer it</dt><dd>{row.records}</dd></div><div><dt>Who holds the next step</dt><dd>{row.owner}</dd></div></dl><a href="#investigate">Get a request for the records <ArrowRight size={16} aria-hidden="true" /></a></div>
          </div>
        </details>;
      })}
    </div>

    <div className={styles.workforceAnswer}>
      <CircleHelp size={24} aria-hidden="true" /><div><h3>So, do we have enough workers?</h3><p>Workers and teams are operating. Specific staffing constraints are documented above. This review does not establish today’s total gap in outreach workers, case managers or clinical staff. The missing comparison is <strong>funded roles → filled roles → staffed shifts → caseloads → completed placements</strong>, by program.</p><a href="#investigate">Ask for staffing and caseload records →</a></div>
    </div>

    <aside id="oversight-failure" className={styles.oversight} aria-labelledby="oversight-title">
      <div><span className={styles.eyebrow}>Execution failure · across the continuum</span><h3 id="oversight-title">Oversight is part of service delivery.</h3><p>The April 21, 2026 Auditor memo says that, to the Auditor’s understanding, monitoring of high-risk provider Sunstone Way had not increased to the recommended level. It also challenges the unresolved dual role of advocating for providers while judging their performance.</p><a href={DIAGNOSIS_SOURCES.oversight.href} target="_blank" rel="noreferrer">Read the Auditor’s memo · pp. 3–4 ↗</a></div>
      <div className={styles.oversightQuestions}><h4>What needs to be figured out</h4><ol><li>Were required financial and performance checks completed?</li><li>Who approved changes to targets, and on what evidence?</li><li>What protected residents and staff during an operator transition?</li></ol><p>The memo identifies service-disruption risk. It does not establish that all providers misuse funds or that oversight failures explain all homelessness.</p><a href="#investigate">Inspect the implementation record →</a></div>
    </aside>
    <p className={styles.scopeNote}>These functions can happen together. Their order here is an explanation, not a treatment or housing eligibility sequence. Dated findings require follow-up before being described as current at every site.</p>
  </div>;
}
