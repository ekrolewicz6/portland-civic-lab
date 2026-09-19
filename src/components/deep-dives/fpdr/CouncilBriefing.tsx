import {
  ArrowDown,
  ArrowRight,
  Building2,
  House,
  Landmark,
  Users,
  TrendingUp,
  Wallet,
  ShieldCheck,
} from "lucide-react";
import { LEVY_MEDIAN_COMPARISON } from "@/lib/fpdr/data";
import SourceLink from "./SourceLink";
import styles from "./briefing.module.css";

export function CompressionDiagram() {
  return (
    <section className={styles.compression} aria-labelledby="compression-title">
      <div className={styles.heading}>
        <span className={styles.eyebrow}>
          Conditional effect · size not estimated here
        </span>
        <h3 id="compression-title">
          More for pensions can mean less for other services.
        </h3>
        <p>
          Oregon limits certain property taxes on each property. Where that
          limit binds, a higher FPDR levy can crowd out other collections.
        </p>
      </div>
      <div className={styles.forkRoot}>
        <Landmark aria-hidden="true" size={22} />
        <strong>If the FPDR levy increases</strong>
      </div>
      <div className={styles.fork}>
        <div>
          <ArrowDown aria-hidden="true" className={styles.flowArrow} />
          <span className={styles.eyebrow}>
            Where there is room below the limit
          </span>
          <House aria-hidden="true" size={26} />
          <h4>Property owners pay more</h4>
          <p>Additional tax can be collected.</p>
        </div>
        <div>
          <ArrowDown aria-hidden="true" className={styles.flowArrow} />
          <span className={styles.eyebrow}>Where the tax limit binds</span>
          <Building2 aria-hidden="true" size={26} />
          <h4>Other levies may collect less</h4>
          <p>Residents can feel the cost through services.</p>
        </div>
      </div>
      <p className={styles.note}>
        The tax-limit rules are documented. How much a specific proposal would
        raise bills or reduce other revenue still needs property-level analysis.
      </p>
      <details className={styles.details}>
        <summary>How the tax limit works</summary>
        <p>
          “Compression” is the reduction in taxes needed to fit within a
          property’s legal limit. Local-option taxes are reduced first. If those
          reach zero and the limit is still exceeded, other taxes in the
          category are reduced proportionally. FPDR can also lose collections.
        </p>
        <p>
          This is not a fixed dollar-for-dollar transfer from another service.
          Renters may be affected through services and possible rent changes;
          tax increases do not pass through to rent one-for-one.
        </p>
        <p>
          <SourceLink id="oregonCompression">
            Oregon’s compression rules
          </SourceLink>{" "}
          ·{" "}
          <SourceLink id="cityFinancing2026">
            City presentation, slides 11 and 16
          </SourceLink>
        </p>
      </details>
    </section>
  );
}

export function LevyOutlook() {
  return (
    <div className={styles.outlook}>
      <div className={styles.heading}>
        <span className={styles.eyebrow}>
          Projected · January 2025 analysis
        </span>
        <h3>A lower tax rate can still raise more dollars.</h3>
        <p>
          Two years from the same Milliman forecast. Growth in the city’s
          property values can support a larger levy at a lower rate.
        </p>
      </div>
      <div className={styles.charts}>
        {(
          [
            {
              key: "levy",
              title: "Total taxes raised",
              unit: "$ millions · before collection losses",
              max: 450,
              color: "#28543d",
              values: ["$374.1M", "$412.7M"],
            },
            {
              key: "rmvRate",
              title: "Rate against market value",
              unit: "Dollars per $1,000 of citywide RMV",
              max: 2.8,
              color: "#a66d43",
              values: ["$1.69", "$1.36"],
            },
          ] as const
        ).map((chart) => (
          <figure key={chart.key} className={styles.chart}>
            <figcaption>
              <strong>{chart.title}</strong>
              <span>{chart.unit}</span>
            </figcaption>
            <div className={styles.bars}>
              {chart.key === "rmvRate" && (
                <div className={styles.cap}>Charter cap · $2.80</div>
              )}
              {LEVY_MEDIAN_COMPARISON.map((row, i) => (
                <div className={styles.barColumn} key={row.year}>
                  <div
                    className={styles.bar}
                    style={{
                      height: `${(row[chart.key] / chart.max) * 100}%`,
                      background: chart.color,
                    }}
                  >
                    <strong>{chart.values[i]}</strong>
                  </div>
                  <span>FY{row.fy}</span>
                </div>
              ))}
            </div>
          </figure>
        ))}
      </div>
      <p className={styles.takeaway}>
        <strong>
          A peak in the rate is not a promise that your bill will fall.
        </strong>{" "}
        Your bill uses assessed value; the Charter cap uses market value.
      </p>
      <details className={styles.details}>
        <summary>Read the figures and forecast limits</summary>
        <table className={styles.dataTable}>
          <caption>
            Selected annual median projections · January 2025 analysis
          </caption>
          <thead>
            <tr>
              <th scope="col">Fiscal year</th>
              <th scope="col">Gross levy</th>
              <th scope="col">Rate / $1,000 RMV</th>
            </tr>
          </thead>
          <tbody>
            {LEVY_MEDIAN_COMPARISON.map((row) => (
              <tr key={row.year}>
                <th scope="row">{row.fy}</th>
                <td>${row.levy}M</td>
                <td>${row.rmvRate.toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <p>
          These are nominal dollars and annual medians from 10,000 economic
          scenarios, not a single household’s forecast. The median RMV rate
          peaks at $1.69 in FY2032–33; benefit payments and total levy dollars
          follow different paths. The calculation includes PERS contributions
          and other fund costs.
        </p>
        <p>
          Milliman’s January 28, 2025 presentation uses June 2024 data. The
          City’s September 2026 presentation reuses that analysis; it is not a
          new valuation. The City lists the next levy analysis update for
          January 2027.
        </p>
      </details>
      <p className={styles.note}>
        <SourceLink id="millimanPresentation2025">
          Milliman, printed slides 28 and 30 (PDF pp. 29 and 31)
        </SourceLink>{" "}
        · <SourceLink id="cityFinancing2026">City, slides 11–14</SourceLink>
      </p>
    </div>
  );
}

export function FundingTradeoff() {
  return (
    <div>
      <div className={styles.promise}>
        <ShieldCheck size={22} aria-hidden="true" />
        <span>
          <strong>The pension promise stays.</strong> The question is how to pay
          for it.
        </span>
      </div>
      <div className={styles.tradeoff}>
        <div>
          <Wallet aria-hidden="true" />
          <span className={styles.eyebrow}>Today</span>
          <h3>Put more money in</h3>
          <p>
            Higher taxes, cash diverted from other priorities, or debt to repay.
          </p>
          <strong className={styles.cost}>A cost residents bear now</strong>
        </div>
        <ArrowRight aria-hidden="true" className={styles.tradeArrow} />
        <div>
          <TrendingUp aria-hidden="true" />
          <span className={styles.eyebrow}>Over time</span>
          <h3>Invest the savings</h3>
          <p>
            Earnings can help pay benefits. Losses can leave taxpayers with more
            to cover.
          </p>
          <strong className={styles.uncertain}>Returns are uncertain</strong>
        </div>
        <ArrowRight aria-hidden="true" className={styles.tradeArrow} />
        <div>
          <Users aria-hidden="true" />
          <span className={styles.eyebrow}>Later</span>
          <h3>Change future tax costs</h3>
          <p>
            Future residents could pay less. Poor results could leave them
            covering a shortfall.
          </p>
          <strong className={styles.benefit}>
            The outcome depends on returns
          </strong>
        </div>
      </div>
      <div className={styles.balance}>
        <div>
          <h4>The case for annual funding</h4>
          <p>
            Preserve resources for other priorities and avoid the transition
            cost of building a reserve for a plan already closed to new hires.
          </p>
        </div>
        <div>
          <h4>The case for prefunding</h4>
          <p>
            Build invested assets whose earnings could reduce future tax
            contributions and provide a reserve for future payments.
          </p>
        </div>
      </div>
      <p className={styles.note}>
        Pew supports prefunding as standard practice and recommends comparing
        the costs of catching up now. This diagram is the Lab’s synthesis, not a
        quantified proposal.{" "}
        <SourceLink id="pewFunding2026">Pew, pp. 6–7 and 12</SourceLink> ·{" "}
        <SourceLink id="machizDeck">
          Machiz’s case for funding reform
        </SourceLink>
      </p>
    </div>
  );
}

export function CouncilDecision() {
  return (
    <div className={styles.council}>
      <div className={styles.heading}>
        <span className={styles.eyebrow}>
          The Lab’s recommended decision process
        </span>
        <h3>Compare first. Choose on evidence.</h3>
        <p>
          Compare continued annual funding, partial reserves and fuller
          prefunding. Recommend a change only where expected benefits justify
          transition costs and risks.
        </p>
      </div>
      <ol className={styles.decisionSteps}>
        <li>
          <span>01 / Compare</span>
          <h4>Get ready to choose</h4>
          <p>
            Price the options, identify legal approvals and set limits on
            household costs and service impacts.
          </p>
        </li>
        <li>
          <span>02 / Choose</span>
          <h4>Keep or change course</h4>
          <p>
            Retaining annual funding is a valid outcome. Any change needs a
            stronger case and the required legal approvals.
          </p>
        </li>
        <li>
          <span>03 / Revisit</span>
          <h4>Name what could change</h4>
          <p>
            For any chosen approach, publish review dates and the evidence that
            would justify reconsidering it.
          </p>
        </li>
      </ol>
      <div className={styles.nextStep}>
        <span className={styles.eyebrow}>
          Four questions to ask in the room
        </span>
        <h3>What evidence would change your vote?</h3>
        <div className={styles.questions}>
          <div>
            <span>01 / Affordability</span>
            <strong>How much extra is too much?</strong>
            <p>
              Show household costs over 5, 10 and 20 years. Council sets the
              acceptable burden.
            </p>
          </div>
          <div>
            <span>02 / Public services</span>
            <strong>What would residents give up?</strong>
            <p>
              Show lost revenue for each affected levy and alternative uses of
              any cash committed.
            </p>
          </div>
          <div>
            <span>03 / Resilience</span>
            <strong>Can we keep paying in a recession?</strong>
            <p>
              Combine weak City revenues with early investment losses. Name who
              covers the shortfall.
            </p>
          </div>
          <div>
            <span>04 / Payoff</span>
            <strong>Which approach offers better value?</strong>
            <p>
              Compare annual funding and reserves using cash totals, payment
              timing, fees and alternative uses of money.
            </p>
          </div>
        </div>
        <p className={styles.note}>
          Data estimate the consequences. Council decides what burdens and risks
          are acceptable. These tests are the Lab’s recommendation.{" "}
          <SourceLink id="pewFunding2026">
            Pew recommends comparative analysis, p. 12
          </SourceLink>
          .
        </p>
      </div>
      <details className={styles.details}>
        <summary>How to interpret a claim that an option “works”</summary>
        <p>
          <strong>Decades for investments to grow?</strong> Ask how much money
          can stay invested after paying benefits. A pension obligation that
          lasts decades does not give every contributed dollar decades to grow.
        </p>
        <p>
          <strong>Enough to pay benefits?</strong> That is a solvency question.
          It does not establish that bills are affordable or that the funding
          method offers the best value.
        </p>
        <p>
          <strong>A lower payment in one year?</strong> That is not the same as
          recovering all the extra money paid earlier. Ask when cumulative costs
          break even—and how that changes after accounting for the timing of
          payments.
        </p>
        <p>
          <strong>Savings at an assumed return?</strong> Ask for poor-return
          cases too. This page’s simulator uses a constant return; it does not
          test a recession or predict your tax bill.
        </p>
      </details>
      <details className={styles.details}>
        <summary>Who has authority to act?</summary>
        <ol className={styles.authority}>
          <li>
            <span>01</span>
            <h4>FPDR Board</h4>
            <p>Calculates annual funding needs under the current rules.</p>
          </li>
          <li>
            <span>02</span>
            <h4>City Council</h4>
            <p>
              Levies required funding within Charter limits. Can pursue analysis
              and a reform proposal.
            </p>
          </li>
          <li>
            <span>03</span>
            <h4>Portland voters</h4>
            <p>
              Decide the Charter changes needed for a different funding
              structure.
            </p>
          </li>
        </ol>
        <p className={styles.note}>
          Preparation does not itself authorize a new fund or different
          investments. A transition needs lawful investment authority and a
          funding policy.{" "}
          <SourceLink id="legalFunding2026">
            Legal overview, pp. 8–11
          </SourceLink>{" "}
          ·{" "}
          <SourceLink id="millimanPresentation2025">
            Milliman, printed slide 15
          </SourceLink>
          .
        </p>
      </details>
    </div>
  );
}
