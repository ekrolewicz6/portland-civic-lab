"use client";

import { useMemo, useState } from "react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ReferenceLine,
} from "recharts";
import {
  simulateFundingPolicy,
  fmtMillions,
  fmtPct,
  FUNDING_ASSUMPTIONS as A,
} from "@/lib/fpdr/engine";
import { SIM_START_YEAR, SIM_END_YEAR } from "@/lib/fpdr/data";
import SourceLink from "./SourceLink";
import styles from "./fpdr-tools.module.css";

export default function ReformSimulator() {
  const [bond, setBond] = useState(0);
  const [returns, setReturns] = useState(0.07);
  const [view, setView] = useState<"annual" | "cumulative">("annual");
  const sim = useMemo(
    () => simulateFundingPolicy(returns, bond),
    [returns, bond],
  );
  const negative = sim.lifetimeSavings < -0.01;
  const meaningful = Math.abs(sim.lifetimeSavings) > 0.01;
  const magnitude = meaningful ? Math.abs(sim.lifetimeSavings) : 0;
  const firstYearExtra = sim.rows[0].reform - sim.rows[0].payGo;
  const crossover =
    view === "annual" ? sim.crossoverYear : sim.cumulativeCrossoverYear;

  return (
    <div className={styles.tool}>
      <div className={styles.simIntro}>
        <span className={styles.eyebrow}>
          Teaching model · {SIM_START_YEAR}–{SIM_END_YEAR} · Old pension only
        </span>
        <p>
          Each scenario assumes a constant return known in advance and
          recalculates the required contributions. This shows the mechanics of
          prefunding; it does not predict investment performance or the full
          FPDR levy. It excludes tax compression and effects on other services;
          it cannot replace the comparison Council needs.
        </p>
      </div>
      <div className={styles.simControls}>
        <div>
          <div className={styles.controlHeading}>
            <label htmlFor="fpdr-return">Annual investment return</label>
            <output htmlFor="fpdr-return">{fmtPct(returns, 1)}</output>
          </div>
          <input
            id="fpdr-return"
            className={styles.range}
            type="range"
            min={0}
            max={0.08}
            step={0.005}
            value={returns}
            onChange={(event) => setReturns(Number(event.target.value))}
            aria-label="Assumed annual investment return"
            aria-valuetext={`${fmtPct(returns, 1)} per year`}
          />
          <div className={styles.rangeEnds}>
            <span>0%</span>
            <span>8%</span>
          </div>
          <div
            className={styles.segmented}
            role="group"
            aria-label="Investment return scenarios"
          >
            {[0, 0.04, 0.07].map((rate) => (
              <button
                key={rate}
                type="button"
                aria-pressed={returns === rate}
                onClick={() => setReturns(rate)}
              >
                {fmtPct(rate)} return
              </button>
            ))}
          </div>
          <p className={styles.hint}>
            Try lower returns to see the contribution tradeoff. No scenario here
            includes market volatility.
          </p>
        </div>
        <div>
          <p
            className={styles.label}
            style={{ marginTop: 0 }}
            id="fpdr-bond-label"
          >
            Seed the reserve with borrowed money?
          </p>
          <div
            className={styles.segmented}
            role="group"
            aria-labelledby="fpdr-bond-label"
          >
            {[0, 200].map((amount) => (
              <button
                key={amount}
                type="button"
                aria-pressed={bond === amount}
                onClick={() => setBond(amount)}
              >
                {amount ? "$200M bond" : "No bond"}
              </button>
            ))}
          </div>
          <p className={styles.hint}>
            {fmtPct(A.bondRate, 1)} interest, repaid over {A.bondYears} years.
            Debt service is included in the results.
          </p>
          <p className={styles.hint}>
            <strong>Borrowing adds risk.</strong>{" "}
            <SourceLink id="gfoaBonds">
              GFOA recommends against pension-obligation bonds.
            </SourceLink>
          </p>
        </div>
      </div>
      <div className={styles.chart}>
        <div className={styles.chartHeader}>
          <h3>
            {view === "annual"
              ? "What taxpayers contribute each year"
              : "What taxpayers have contributed in total"}
          </h3>
          <div
            className={styles.segmented}
            role="group"
            aria-label="Chart view"
          >
            <button
              type="button"
              aria-pressed={view === "annual"}
              onClick={() => setView("annual")}
            >
              Annual
            </button>
            <button
              type="button"
              aria-pressed={view === "cumulative"}
              onClick={() => setView("cumulative")}
            >
              Cumulative
            </button>
          </div>
        </div>
        <div className={styles.chartLegend}>
          <span>
            <i />
            Pay-as-you-go
          </span>
          <span>
            <i />
            Prefunding{bond ? " + bond debt service" : ""}
          </span>
          <span>Nominal dollars · $ millions</span>
        </div>
        <div
          style={{ width: "100%", height: 300 }}
          role="img"
          aria-label={`${view === "annual" ? "Annual" : "Cumulative"} contributions. ${crossover ? `Prefunding becomes lower in ${crossover}.` : `No crossover through ${SIM_END_YEAR}.`} Tabular values follow below.`}
        >
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={sim.rows}
              margin={{ top: 12, right: 16, left: 0, bottom: 0 }}
              accessibilityLayer
            >
              <CartesianGrid
                strokeDasharray="2 6"
                stroke="#d9ded2"
                vertical={false}
              />
              {crossover && (
                <ReferenceLine
                  x={crossover}
                  stroke="#6a8563"
                  strokeDasharray="3 4"
                />
              )}
              <XAxis
                dataKey="year"
                type="number"
                domain={[SIM_START_YEAR, SIM_END_YEAR]}
                ticks={[2025, 2040, 2055, 2070, 2082]}
                minTickGap={16}
                tick={{ fontSize: 12, fill: "#5b6951" }}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                width={55}
                tick={{ fontSize: 12, fill: "#5b6951" }}
                tickLine={false}
                axisLine={false}
                tickFormatter={(value: number) =>
                  view === "annual"
                    ? `$${value}`
                    : `$${(value / 1000).toFixed(1)}B`
                }
              />
              <Tooltip
                contentStyle={{
                  background: "#fff",
                  border: "1px solid #d8decf",
                  color: "#183723",
                  fontSize: 13,
                }}
                labelFormatter={(value) => `Year ${value}`}
                formatter={(value: number, name: string) => [
                  fmtMillions(value),
                  name.includes("PayGo") || name === "payGo"
                    ? "Pay-as-you-go"
                    : "Prefunding",
                ]}
              />
              <Line
                type="linear"
                dataKey={view === "annual" ? "payGo" : "cumulativePayGo"}
                stroke="#8a8177"
                strokeWidth={2}
                strokeDasharray="5 5"
                dot={false}
                isAnimationActive={false}
              />
              <Line
                type="linear"
                dataKey={view === "annual" ? "reform" : "cumulativeReform"}
                stroke="#28523a"
                strokeWidth={2.5}
                dot={false}
                isAnimationActive={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
        <p className={styles.hint}>
          {view === "annual"
            ? `New trust contributions end in ${sim.contributionEndYear} by design; the trust still pays benefits afterward. This does not end PERS contributions or the whole FPDR levy.`
            : "A lower annual payment is not the same as recovering the earlier contributions. The cumulative view shows when total nominal contributions cross."}
        </p>
      </div>
      <div className={styles.simMetrics} aria-live="polite" aria-atomic="true">
        <div data-testid="fpdr-cost-outcome">
          <p className={styles.eyebrow}>
            {negative ? "Added cash cost" : "Cash contributions saved"} through{" "}
            {SIM_END_YEAR}
          </p>
          <p
            className={`${styles.metricValue} ${negative ? styles.metricNegative : ""}`}
          >
            {fmtMillions(magnitude)}
          </p>
          <p className={styles.metricText}>
            {negative
              ? "Borrowing costs outweigh the modeled investment gains."
              : meaningful
                ? `${fmtPct(sim.savingsPct)} below pay-as-you-go in this scenario.`
                : "No investment earnings and no bond: contributions just shift earlier."}{" "}
            Undiscounted; not a household savings forecast.
          </p>
        </div>
        <div>
          <p className={styles.eyebrow}>
            Extra contribution in {SIM_START_YEAR}
          </p>
          <p className={`${styles.metricValue} ${styles.metricNegative}`}>
            {firstYearExtra >= 0 ? "+" : "−"}
            {fmtMillions(Math.abs(firstYearExtra))}
          </p>
          <p className={styles.metricText}>
            Above the same year&apos;s pay-as-you-go contribution. This is the
            initial transition cost in this illustrative schedule.
          </p>
        </div>
        <div>
          <p className={styles.eyebrow}>Two different crossover dates</p>
          <div className={styles.crossover}>
            <p>
              Annual cost lower<strong>{sim.crossoverYear ?? "None"}</strong>
            </p>
            <p>
              Total cost lower
              <strong>{sim.cumulativeCrossoverYear ?? "None"}</strong>
            </p>
          </div>
          <p className={styles.hint}>
            “None” means no crossover through {SIM_END_YEAR}.
          </p>
        </div>
      </div>
      <details className={styles.details}>
        <summary>What the model includes—and what it cannot tell you</summary>
        <p>
          <strong>Included:</strong> an illustrative old-plan benefit path,{" "}
          {A.years} years of contributions declining{" "}
          {fmtPct(A.contributionDecline)} annually, the selected constant
          return, and optional bond principal and interest. Contributions are
          solved to keep the trust solvent through {SIM_END_YEAR} under those
          assumptions.
        </p>
        <p>
          <strong>Not included:</strong> market losses or return sequencing,
          inflation, a discount rate for comparing dollars across time, PERS,
          disability and administration costs, existing assets, or benefits
          after {SIM_END_YEAR}. The benefit path is reconstructed from selected{" "}
          <SourceLink id="milliman2024">2024 actuarial anchors</SourceLink> with
          an illustrative long tail; the intermediate years and total are not a
          published actuarial forecast.
        </p>
        <p>
          <strong>How to read it:</strong> lower nominal contributions are not
          proof of better economic value. Earlier payments have opportunity
          costs. A real proposal needs an actuarial funding valuation, legal
          review and adverse-scenario testing. Changing the slider reprices the
          plan with hindsight; it does not show what happens if returns
          disappoint after a policy is adopted.
        </p>
      </details>
      <details className={styles.details}>
        <summary>Read the chart as a table</summary>
        <div
          className={styles.tableScroll}
          style={{ maxHeight: "20rem" }}
          tabIndex={0}
          role="region"
          aria-label="Modeled annual and cumulative contributions"
        >
          <table>
            <caption>
              Illustrative contributions in $ millions, with{" "}
              {fmtPct(returns, 1)} returns and {bond ? "$200M" : "no"} bond
            </caption>
            <thead>
              <tr>
                <th scope="col">Year</th>
                <th scope="col">Annual pay-go</th>
                <th scope="col">Annual prefund</th>
                <th scope="col">Total pay-go</th>
                <th scope="col">Total prefund</th>
              </tr>
            </thead>
            <tbody>
              {sim.rows.map((row) => (
                <tr key={row.year}>
                  <th scope="row">{row.year}</th>
                  <td>{row.payGo.toFixed(1)}</td>
                  <td>{row.reform.toFixed(1)}</td>
                  <td>{row.cumulativePayGo.toFixed(1)}</td>
                  <td>{row.cumulativeReform.toFixed(1)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </details>
    </div>
  );
}
