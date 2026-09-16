"use client";

import { useState } from "react";
import { personalCost, projectedCost, fmtMoney } from "@/lib/fpdr/engine";
import SourceLink from "./SourceLink";
import styles from "./fpdr-tools.module.css";

const PRESETS = [200_000, 350_000, 550_000, 850_000];

export default function PersonalCostCalculator() {
  const [av, setAv] = useState(350_000);
  const [draft, setDraft] = useState("350000");
  const [growth, setGrowth] = useState(0.03);
  const valid =
    draft.trim() !== "" &&
    Number.isFinite(Number(draft)) &&
    Number(draft) >= 0 &&
    Number(draft) <= 1_500_000;
  const cost = personalCost(av);
  const projection = projectedCost(av, growth);
  const choose = (value: number) => {
    setAv(value);
    setDraft(String(value));
  };

  return (
    <div className={`${styles.tool} ${styles.householdTool}`}>
      <div className={styles.calculator}>
        <div className={styles.inputPanel}>
          <p className={styles.eyebrow}>Your assessed value · FY2025–26</p>
          <h3 className={styles.toolTitle}>Find the value. See the cost.</h3>
          <p className={styles.body}>
            Use the assessed value on your county statement. It can differ
            substantially from market value—even for similar homes.
          </p>
          <dl className={styles.liveEstimate} aria-label="Your estimate">
            <div>
              <dt>FY2025–26 estimate</dt>
              <dd>
                {fmtMoney(cost.annual)}
                <span> / year</span>
              </dd>
            </div>
            <div>
              <dt>Six-year estimate</dt>
              <dd>{fmtMoney(projection.total)}</dd>
            </div>
          </dl>
          <label className={styles.label} htmlFor="fpdr-home-value">
            Assessed value in dollars
          </label>
          <div className={styles.moneyInput}>
            <span aria-hidden="true">$</span>
            <input
              id="fpdr-home-value"
              type="number"
              inputMode="numeric"
              min={0}
              max={1_500_000}
              step={1}
              value={draft}
              aria-invalid={!valid}
              aria-describedby="fpdr-value-help"
              onChange={(event) => {
                const value = event.target.value;
                setDraft(value);
                const number = Number(value);
                if (
                  value.trim() &&
                  Number.isFinite(number) &&
                  number >= 0 &&
                  number <= 1_500_000
                )
                  setAv(number);
              }}
            />
          </div>
          <p
            id="fpdr-value-help"
            className={valid ? styles.hint : styles.error}
          >
            {valid
              ? "Enter an exact amount, or use the slider."
              : "Enter a value from $0 to $1,500,000. Results retain the last valid value."}
          </p>
          <input
            className={styles.range}
            type="range"
            min={0}
            max={1_500_000}
            step={1}
            value={av}
            onChange={(event) => choose(Number(event.target.value))}
            aria-label="Home assessed value"
            aria-valuetext={`${fmtMoney(av)} assessed value`}
          />
          <div className={styles.rangeEnds}>
            <span>$0</span>
            <span>$1.5M</span>
          </div>
          <div
            className={styles.presets}
            role="group"
            aria-label="Example assessed values"
          >
            {PRESETS.map((value) => (
              <button
                type="button"
                key={value}
                aria-pressed={av === value}
                onClick={() => choose(value)}
              >
                {fmtMoney(value)}
              </button>
            ))}
          </div>
          <label className={styles.label} htmlFor="fpdr-growth">
            Assumed annual growth after FY2025–26
          </label>
          <select
            id="fpdr-growth"
            className={styles.select}
            value={growth}
            onChange={(event) => setGrowth(Number(event.target.value))}
          >
            <option value={0.03}>3% assessed-value growth</option>
            <option value={0}>No assessed-value growth</option>
          </select>
          <p className={styles.hint}>
            A household scenario, separate from citywide tax-base growth.
            Property changes and the relationship between market and assessed
            value can produce different outcomes.
          </p>
        </div>
        <div className={styles.resultPanel}>
          <p className={styles.eyebrow}>Estimated FY2025–26 charge</p>
          <p className={styles.bigResult} aria-live="polite" aria-atomic="true">
            {fmtMoney(cost.annual)}
          </p>
          <p className={styles.body}>
            per year · {fmtMoney(cost.monthly)} monthly equivalent
          </p>
          <div className={styles.resultFacts}>
            <div>
              <span>FY2026–27 forecast</span>
              <strong>{fmtMoney(projection.rows[1].annual)}</strong>
              <p>
                One year of {growth * 100}% growth, then the City&apos;s
                forecast rate.
              </p>
            </div>
            <div>
              <span>Six-year total</span>
              <strong>{fmtMoney(projection.total)}</strong>
              <p>FY2025–26 through FY2030–31, including the base year.</p>
            </div>
          </div>
          <div className={styles.projectionBars} aria-hidden="true">
            {projection.rows.map((row) => (
              <div key={row.fy}>
                <div
                  style={{
                    height: `${Math.max(3, (row.annual / (projection.finalAnnual || 1)) * 84)}px`,
                    background: row.projected ? "#9bad98" : "#1a3a2a",
                  }}
                />
                <span>{row.fy.slice(-2)}</span>
              </div>
            ))}
          </div>
          <p className={styles.hint}>
            Fiscal year ending · dark = base year; light = forecast
          </p>
          <p className={styles.resultNote}>
            Estimate before tax compression, exemptions and payment discounts.
            Check the FPDR line on your county statement for the actual charge.
            Future amounts are scenarios, not a tax quote.
          </p>
        </div>
      </div>
      <details className={styles.details}>
        <summary>See the calculation and year-by-year estimates</summary>
        <p>
          Assessed value ÷ 1,000 × the FPDR rate. The FY2025–26 rate is $2.9874
          per $1,000; subsequent rates come from the City&apos;s five-year plan.
          Only future years apply your selected growth assumption.
        </p>
        <div
          className={styles.tableScroll}
          tabIndex={0}
          role="region"
          aria-label="Year-by-year household estimates"
        >
          <table>
            <caption>
              Household estimates with {growth * 100}% annual assessed-value
              growth
            </caption>
            <thead>
              <tr>
                <th scope="col">Fiscal year</th>
                <th scope="col">Assessed value</th>
                <th scope="col">Rate / $1,000</th>
                <th scope="col">Estimated charge</th>
              </tr>
            </thead>
            <tbody>
              {projection.rows.map((row) => (
                <tr key={row.fy}>
                  <th scope="row">
                    {row.fy}
                    <small>
                      {row.projected ? "Forecast" : "Certified rate"}
                    </small>
                  </th>
                  <td>{fmtMoney(row.assessedValue)}</td>
                  <td>${row.rate.toFixed(4)}</td>
                  <td>{fmtMoney(row.annual)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p>
          <SourceLink id="county2526">County rates</SourceLink> ·{" "}
          <SourceLink id="fiveYearPlan2731">City forecast, p. 6</SourceLink> ·{" "}
          <SourceLink id="oregonAssessment">Oregon assessment rules</SourceLink>
          . The 3% scenario approximates a common unchanged-property case. It is
          not a universal cap on assessed-value changes or tax bills.
        </p>
      </details>
    </div>
  );
}
