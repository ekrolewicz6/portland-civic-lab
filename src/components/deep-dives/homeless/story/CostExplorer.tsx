"use client";

import { useId, useState } from "react";
import styles from "./CostExplorer.module.css";

type CostView = "shelter" | "housing" | "budgets";
type ShelterPeriod = "year" | "day";
type Bedroom = "studio" | "one" | "two";

const VIEWS: { id: CostView; label: string; number: string }[] = [
  { id: "shelter", label: "Shelter costs", number: "01" },
  { id: "housing", label: "Housing receipt", number: "02" },
  { id: "budgets", label: "Current budgets", number: "03" },
];

const SHELTERS = [
  { label: "Congregate shelter", annual: 37_000, detail: "Per bed", average: false },
  { label: "Adult shelter average", annual: 47_000, detail: "Per bed or unit · all reviewed models", average: true },
  { label: "Alternative / village", annual: 51_000, detail: "Per unit", average: false },
];

const RENTS: Record<Bedroom, { label: string; monthly: number }> = {
  studio: { label: "Studio", monthly: 1_570 },
  one: { label: "1 bedroom", monthly: 1_677 },
  two: { label: "2 bedrooms", monthly: 1_922 },
};

const SOURCES = {
  shelter: "https://hsd.multco.us/wp-content/uploads/2026/01/Adult-Shelter-Review-FY25.pdf",
  housing: "https://www.homeforward.org/wp-content/uploads/2026/04/1_2026-Payment-Standard-Voucher-Issuance.pdf",
  budgets: "https://multco.us/file/homeless_services_department-0/download",
};

const dollars = (value: number) => `$${Math.round(value).toLocaleString("en-US")}`;

/** Comparable cost views. Rent benchmarks and budgets never share a cost axis. */
export default function CostExplorer() {
  const [view, setView] = useState<CostView>("shelter");
  const [period, setPeriod] = useState<ShelterPeriod>("year");
  const [bedroom, setBedroom] = useState<Bedroom>("one");
  const id = useId();
  const rent = RENTS[bedroom];

  return (
    <div className={styles.explorer}>
      <div className={styles.viewButtons} role="group" aria-label="Choose a cost comparison">
        {VIEWS.map((item) => (
          <button
            key={item.id}
            type="button"
            aria-pressed={view === item.id}
            aria-controls={`${id}-panel`}
            onClick={() => setView(item.id)}
          >
            <span className={styles.buttonNumber} aria-hidden="true">{item.number}</span>
            {item.label}
          </button>
        ))}
      </div>

      <div id={`${id}-panel`} className={styles.panel}>
        {view === "shelter" && (
          <>
            <div className={styles.panelHeading}>
              <div>
                <p className={styles.eyebrow}>Reported costs · FY2025 · 24/7 adult shelters</p>
                <h3>A bed has a price. So does the next step.</h3>
              </div>
              <div className={styles.smallButtons} role="group" aria-label="Shelter cost period">
                {(["year", "day"] as const).map((value) => (
                  <button type="button" key={value} aria-pressed={period === value} onClick={() => setPeriod(value)}>
                    Per {value}
                  </button>
                ))}
              </div>
            </div>

            <div className={styles.shelterLayout}>
              <aside className={styles.context}>
                <p className={styles.stat}>$98<span>m</span></p>
                <p className={styles.statLabel}>across 31 reviewed shelter programs</p>
                <p className={styles.contextDetail}>The bill pays for shelter operations. Moving someone into a home can require additional housing assistance.</p>
              </aside>

              <div className={styles.chart} aria-label={`Selected reported shelter costs per ${period}`}>
                <p className={styles.chartNote}>Selected comparisons · approximate averages</p>
                {SHELTERS.map((shelter) => (
                  <div key={shelter.label} className={styles.barRow}>
                    <div className={styles.barLabels}>
                      <span className={styles.barName}>{shelter.label}</span>
                      <strong>{dollars(period === "year" ? shelter.annual : shelter.annual / 365)}</strong>
                    </div>
                    <div className={styles.barTrack} aria-hidden="true">
                      <div
                        className={`${styles.barFill} ${shelter.average ? styles.averageBar : ""}`}
                        style={{ width: `${(shelter.annual / 60_000) * 100}%` }}
                      />
                    </div>
                    <p className={styles.barDetail}>{shelter.detail}</p>
                  </div>
                ))}
                <p className={styles.chartFootnote}>
                  {period === "day"
                    ? "Daily equivalents divide annual averages by 365. They are not costs per occupied night."
                    : "July 2024–June 2025. These are the report’s averages, not the total bill divided by all beds."}
                </p>
              </div>
            </div>

            <div className={styles.takeaway}>
              <span className={styles.takeawayLabel}>The decision</span>
              <p>Fund the move to housing alongside the place to wait.</p>
            </div>
            <details className={styles.method}>
              <summary>Source &amp; what this comparison includes</summary>
              <div>
                <p>Multnomah County’s January 2026 review covers 31 City- and County-funded adult shelter programs. Figures reflect reported FY2025 program costs. The overall average includes other models, including motels.</p>
                <p>External housing-placement funds are excluded. Occupancy, partial-year operation, shared expenses, double occupancy, and differences in residents’ needs affect comparisons. A lower operating cost alone does not establish a better outcome. Freeing a bed does not automatically save its annual cost.</p>
                <a href={SOURCES.shelter} target="_blank" rel="noopener noreferrer">Read the Adult Shelter Review · pp. 49–59, 91–94 <span aria-hidden="true">↗</span></a>
              </div>
            </details>
          </>
        )}

        {view === "housing" && (
          <>
            <div className={styles.panelHeading}>
              <div>
                <p className={styles.eyebrow}>Payment standard · 2026 · Multnomah County</p>
                <h3>Start with the rent. Show the rest of the bill.</h3>
              </div>
            </div>

            <div className={styles.receiptLayout}>
              <div className={styles.housingContext}>
                <div className={styles.smallButtons} role="group" aria-label="Housing unit size">
                  {(Object.keys(RENTS) as Bedroom[]).map((value) => (
                    <button type="button" key={value} aria-pressed={bedroom === value} onClick={() => setBedroom(value)}>
                      {RENTS[value].label}
                    </button>
                  ))}
                </div>
                <p className={styles.rentValue} aria-live="polite" aria-atomic="true">{dollars(rent.monthly)}<span>/ month</span></p>
                <p className={styles.statLabel}>gross-rent benchmark for {bedroom === "studio" ? "a studio" : `a ${bedroom === "one" ? "one" : "two"}-bedroom home`}</p>
                <p className={styles.contextDetail}>Home Forward’s payment standard helps calculate assistance. It does not tell us the full cost of a supported tenancy.</p>
              </div>

              <div className={styles.receipt}>
                <p className={styles.receiptTitle}>The housing receipt</p>
                <dl>
                  <div><dt>Monthly rent benchmark</dt><dd>{dollars(rent.monthly)}</dd></div>
                  <div><dt>Resident’s contribution</dt><dd className={styles.variable}>Depends on income</dd></div>
                  <div><dt>Public rent subsidy</dt><dd className={styles.variable}>Calculated per household</dd></div>
                  <div><dt>Support services &amp; move-in costs</dt><dd className={styles.variable}>Priced separately</dd></div>
                </dl>
                <div className={styles.receiptTotal}>
                  <span>12 months at this rent benchmark</span>
                  <strong>{dollars(rent.monthly * 12)}</strong>
                </div>
                <p className={styles.receiptNote}>Rent benchmark only. No all-in program price is implied.</p>
              </div>
            </div>

            <div className={styles.takeaway}>
              <span className={styles.takeawayLabel}>The decision</span>
              <p>Price a complete tenancy: a home plus the support that helps someone keep it.</p>
            </div>
            <details className={styles.method}>
              <summary>Source &amp; how to read this receipt</summary>
              <div>
                <p>Home Forward’s standards, effective January 1, 2026, are $1,570 for a studio, $1,677 for one bedroom, and $1,922 for two bedrooms across Multnomah County. Annual figures multiply the monthly standard by 12.</p>
                <p>These are administrative gross-rent benchmarks, not advertised vacancies or actual subsidy payments. A household’s contribution, program rules, utilities, and approved rent affect the subsidy. Case management, care, deposits, administration, and risk reserves need their own cost records.</p>
                <a href={SOURCES.housing} target="_blank" rel="noopener noreferrer">Read Home Forward’s 2026 payment standards <span aria-hidden="true">↗</span></a>
              </div>
            </details>
          </>
        )}

        {view === "budgets" && (
          <>
            <div className={styles.panelHeading}>
              <div>
                <p className={styles.eyebrow}>Adopted budgets · Multnomah County HSD</p>
                <h3>Less funding. The same need for a complete path.</h3>
              </div>
            </div>

            <div className={styles.budgetLayout}>
              <div>
                <div className={styles.budgetHeadline}>
                  <p className={styles.budgetValue}>$242.9<span>m</span></p>
                  <span className={styles.change}>−21.7%</span>
                </div>
                <p className={styles.statLabel}>FY2027 adopted operating budget</p>
                <div className={styles.budgetChart} aria-label="HSD adopted operating budget: 310.2 million dollars in fiscal 2026; 242.9 million in fiscal 2027">
                  <div className={styles.budgetBarRow}>
                    <div className={styles.barLabels}><span>FY2026</span><strong>$310.2m</strong></div>
                    <div className={styles.barTrack} aria-hidden="true"><div className={`${styles.barFill} ${styles.previousBudget}`} /></div>
                  </div>
                  <div className={styles.budgetBarRow}>
                    <div className={styles.barLabels}><span>FY2027</span><strong>$242.9m</strong></div>
                    <div className={styles.barTrack} aria-hidden="true"><div className={styles.barFill} style={{ width: `${(242.9 / 310.2) * 100}%` }} /></div>
                  </div>
                </div>
                <p className={styles.chartFootnote}>A $67.3m operating reduction, comparing adopted budgets on the same basis.</p>
              </div>

              <aside className={styles.bridgeCard}>
                <p className={styles.eyebrow}>Inside the FY2027 budget</p>
                <h4>Bridge housing</h4>
                <p className={styles.bridgeAmount}>$2,947,286</p>
                <p className={styles.bridgeDescription}>budgeted for a program with <strong>42 shelter units</strong></p>
                <div className={styles.bridgeRatio}>
                  <span>Budget ÷ target capacity</span>
                  <strong>$70,173 <span>/ unit / year</span></strong>
                </div>
                <p className={styles.receiptNote}>A planning ratio, not an invoice-backed cost per resident.</p>
              </aside>
            </div>

            <div className={styles.takeaway}>
              <span className={styles.takeawayLabel}>The decision</span>
              <p>Follow each dollar from its budget line to a delivered service and a housing outcome.</p>
            </div>
            <details className={styles.method}>
              <summary>Source &amp; what these budgets measure</summary>
              <div>
                <p>The FY2027 adopted HSD budget reports $242.9m in operating spending authority, down $67.3m from FY2026 adopted. FY2027 runs July 1, 2026–June 30, 2027. The operating total excludes $5.9m in cash transfers, contingencies, and unappropriated balances.</p>
                <p>Bridge Housing is program 30207: $2,947,286 divided by its 42-unit target equals approximately $70,173 per unit. Appropriations and targets do not demonstrate actual spending, occupancy, or outcomes. HSD is one department, not the entire region’s homelessness budget.</p>
                <a href={SOURCES.budgets} target="_blank" rel="noopener noreferrer">Read the FY2027 adopted HSD budget · pp. 6, 9, 65 <span aria-hidden="true">↗</span></a>
              </div>
            </details>
          </>
        )}
      </div>
    </div>
  );
}
