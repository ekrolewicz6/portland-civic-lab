import type { Metadata } from "next";
import Link from "next/link";
import { ArrowDown, ArrowRight, Landmark } from "lucide-react";
import { HEADLINE, SOURCES } from "@/lib/fpdr/data";
import { fmtMoney, fmtPct } from "@/lib/fpdr/engine";
import { DIVE_CONTAINER, Section } from "@/components/deep-dives/shared";
import PersonalCostCalculator from "@/components/deep-dives/fpdr/PersonalCostCalculator";
import ReformSimulator from "@/components/deep-dives/fpdr/ReformSimulator";
import LevyGrowthChart from "@/components/deep-dives/fpdr/LevyGrowthChart";
import SpendingChart from "@/components/deep-dives/fpdr/SpendingChart";
import WhoBenefits from "@/components/deep-dives/fpdr/WhoBenefits";
import ReformMenu from "@/components/deep-dives/fpdr/ReformMenu";
import SourceLink from "@/components/deep-dives/fpdr/SourceLink";
import { pageMeta } from "@/lib/page-meta";
import styles from "./fpdr.module.css";

export const metadata: Metadata = pageMeta({
  title: "The Pension on Your Property Tax Bill — FPDR, Explained",
  description:
    "Portland's police and fire pensions: your tax bill, the case for prefunding, the case for caution, and the choices facing today's and tomorrow's taxpayers.",
  path: "/deep-dives/fpdr",
  type: "article",
});

const NAV = [
  ["what", "The basics"],
  ["cost", "Your bill"],
  ["growing", "The outlook"],
  ["hard", "The tradeoff"],
  ["fix", "Explore"],
  ["menu", "Options"],
  ["sources", "Sources"],
];

export default function FpdrDeepDivePage() {
  return (
    <div className={styles.page}>
      <section className={styles.hero}>
        <div className={DIVE_CONTAINER}>
          <div className={styles.heroGrid}>
            <div>
              <Link href="/deep-dives" className={styles.kicker}>
                Portland’s police &amp; fire pensions
              </Link>
              <h1>
                Pay more now. <em>Pay less later?</em>
              </h1>
              <p className={styles.heroLead}>
                Portland must pay promised pensions. The choice is whether to
                put more money aside today so investment earnings could reduce
                future tax bills.
              </p>
              <p className={styles.heroQuestion}>
                That money has to come from somewhere: higher taxes, other
                priorities, or borrowing. Future savings are possible—not
                guaranteed.
              </p>
              <div className={styles.heroActions}>
                <a href="#menu" className={styles.primaryLink}>
                  Compare the choices <ArrowRight size={17} />
                </a>
                <a href="#cost" className={styles.secondaryLink}>
                  See your bill <ArrowDown size={16} />
                </a>
              </div>
            </div>
            <aside
              className={styles.heroAside}
              aria-labelledby="fpdr-stakes-title"
            >
              <h2 id="fpdr-stakes-title" className={styles.kicker}>
                Who benefits. Who carries the cost.
              </h2>
              <div>
                <h3>Keep paying year by year</h3>
                <p>
                  Today’s taxpayers avoid an extra saving contribution.
                  Tomorrow’s taxpayers keep paying with little investment income
                  to help.
                </p>
              </div>
              <div>
                <h3>Start saving and investing</h3>
                <p>
                  Future taxpayers could pay less. Today’s residents fund the
                  head start through higher taxes or money that could serve
                  other needs.
                </p>
              </div>
              <div>
                <h3>Borrow to invest</h3>
                <p>
                  Taxpayers could benefit if returns beat borrowing costs. They
                  still owe the debt if investments lose money.
                </p>
              </div>
              <p className={styles.asideFoot}>
                These funding options leave promised benefits unchanged. The
                Lab’s summary of the{" "}
                <SourceLink id="fiveYearPlan2731">City’s outlook</SourceLink>{" "}
                and <SourceLink id="gfoaBonds">borrowing risks</SourceLink>.
              </p>
            </aside>
          </div>
          <div className={styles.councilBrief}>
            <h2>Before Council acts</h2>
            <p>
              <strong>Name who pays more now.</strong> Show the next five years
              of costs, what that money would otherwise fund, when savings could
              arrive, and who covers a loss.
            </p>
            <a href="#menu">
              What a proposal must answer <ArrowRight size={16} />
            </a>
          </div>
          <p className={styles.byline}>
            Portland Civic Lab · Co-authored with{" "}
            <SourceLink id="machizOpEd">Kevin Machiz, CFA, FRM</SourceLink>
            <br />
            Reviewed September 16, 2026 · Figures dated below
          </p>
          <dl className={styles.heroStats}>
            <div>
              <dt>Pension liability · June 2025</dt>
              <dd>{fmtMoney(HEADLINE.liability)}</dd>
              <p>Present value of earned benefits</p>
            </div>
            <div>
              <dt>Assets / liability · June 2025</dt>
              <dd>{fmtPct(HEADLINE.fundedRatio, 2)}</dd>
              <p>{fmtMoney(HEADLINE.assets)} in plan net assets</p>
            </div>
            <div>
              <dt>Authorized levy · FY2026–27</dt>
              <dd>{fmtMoney(HEADLINE.annualLevyFY27)}</dd>
              <p>Includes more than the old pension</p>
            </div>
          </dl>
          <p className={styles.heroNote}>
            The liability is an accounting estimate, not a bill due today.
            Future tax revenues are not counted as pension assets.{" "}
            <SourceLink id="audit2025">2025 audit</SourceLink> ·{" "}
            <SourceLink id="levy2027">2026–27 levy ordinance</SourceLink>
          </p>
        </div>
      </section>

      <nav aria-label="On this page" className={styles.nav}>
        <div className={DIVE_CONTAINER}>
          <div className={styles.navScroll}>
            {NAV.map(([id, label]) => (
              <a key={id} href={`#${id}`}>
                {label}
              </a>
            ))}
          </div>
        </div>
      </nav>

      <Section
        id="what"
        eyebrow="01 / Follow the money"
        title="One tax line. Two generations."
        lead="FPDR means Fire & Police Disability & Retirement. The old pension is pay-as-you-go; the levy also helps fund PERS pensions for newer employees."
      >
        <div className={styles.generation}>
          <div>
            <span className={styles.miniLabel}>Hired before 2007</span>
            <h3>Taxes pay benefits as they come due</h3>
            <p>
              FPDR One and Two are closed to new hires. Their remaining
              obligations continue as members retire and survivors receive
              benefits.
            </p>
          </div>
          <div>
            <span className={styles.miniLabel}>Hired from 2007 onward</span>
            <h3>Taxes fund contributions to PERS</h3>
            <p>
              Portland already changed course for new hires. The transition
              means paying old-plan benefits and prefunding newer workers&apos;
              pensions together.
            </p>
          </div>
        </div>
        <p className={styles.sourceNote}>
          <SourceLink id="fiveYearPlan2731">
            City five-year plan, pp. 1–2
          </SourceLink>
          . FPDR also provides disability coverage for sworn employees.
        </p>
        <div className={styles.chartPanel}>
          <div className={styles.panelHeading}>
            <h3>What the operating budget buys</h3>
            <span>FY2026–27 adopted</span>
          </div>
          <SpendingChart />
          <p className={styles.sourceNote}>
            Shares of $258.7M in program operating expenses—not shares of the
            $279.2M gross levy. Excludes fund-level items such as borrowing
            repayment and contingency.{" "}
            <SourceLink id="adopted2027">Adopted budget</SourceLink>.
          </p>
        </div>
      </Section>

      <Section
        id="cost"
        layout="stacked"
        tone="warm"
        eyebrow="02 / Your bill"
        title="Make the tax line tangible."
        lead="Start with the assessed value on your FY2025–26 statement, not your home's sale price. Reconstruct that year's charge, then explore the City's forecast rates."
      >
        <PersonalCostCalculator />
        <div className={styles.contextStrip}>
          <Landmark size={20} />
          <p>
            <strong>
              About {fmtPct(HEADLINE.shareOfCityLine, 0)} of the City&apos;s
              gross levy
            </strong>{" "}
            goes to FPDR in FY2026–27. That is $279.2M of $868.5M across City
            levies. It is not {fmtPct(HEADLINE.shareOfCityLine, 0)} of your
            whole tax bill, which includes other governments.{" "}
            <SourceLink id="levy2027">Levy ordinance</SourceLink>.
          </p>
        </div>
      </Section>

      <Section
        id="growing"
        eyebrow="03 / The outlook"
        title="A rising bill. A long transition."
        lead="The pressure is real, but “rises forever” is the wrong story. Old-plan costs eventually decline; PERS contributions for the active workforce continue."
      >
        <div className={styles.chartPanel}>
          <div className={styles.panelHeading}>
            <h3>The annual levy has grown</h3>
            <span>Selected fiscal years · $ millions</span>
          </div>
          <LevyGrowthChart />
          <p className={styles.sourceNote}>
            FY27 is authorized, not collected revenue. Earlier years are
            reported levy amounts.{" "}
            <SourceLink id="county2526">County tax records</SourceLink> ·{" "}
            <SourceLink id="levy2027">FY27 ordinance</SourceLink>.
          </p>
        </div>
        <div className={styles.outlook}>
          <div>
            <span className={styles.miniLabel}>The near-term pressure</span>
            <h3>Two pension systems at once</h3>
            <p>
              The City&apos;s plan expects total FPDR expenses to peak around
              2039 in nominal dollars. Wages, retirements and PERS costs can
              move that path.
            </p>
            <SourceLink id="fiveYearPlan2731">
              Five-year plan, pp. 1–2
            </SourceLink>
          </div>
          <div>
            <span className={styles.miniLabel}>The capacity check</span>
            <h3>Low modeled risk of hitting the cap</h3>
            <p>
              The actuary found a levy-cap breach in fewer than 2% of 10,000
              scenarios through FY2043–44. That is a conditional model result,
              not a guarantee of affordable taxes.
            </p>
            <SourceLink id="millimanLevy2025">
              Levy adequacy analysis
            </SourceLink>
          </div>
        </div>
        <details className={styles.disclosure}>
          <summary>Why can this affect other public services?</summary>
          <p>
            Oregon&apos;s property-tax limits can reduce collections on a
            property when combined levies reach the limit. A larger FPDR levy
            can increase that “compression.” This is different from saying every
            FPDR dollar directly removes a dollar from parks or libraries.{" "}
            <SourceLink id="fiveYearPlan2731">City forecast, p. 4</SourceLink>.
          </p>
        </details>
      </Section>

      <Section
        id="who"
        tone="warm"
        eyebrow="04 / The promise"
        title="People, not just liabilities."
        lead="These pensions support former public-safety employees and surviving family members. Funding reform changes how benefits are financed; it does not make those commitments disappear."
      >
        <WhoBenefits />
      </Section>

      <Section
        id="hard"
        layout="stacked"
        eyebrow="05 / The central tradeoff"
        title="The strongest case on each side."
        lead="Both approaches leave taxpayers responsible for the promise. They differ in when taxpayers pay, how much investment risk they take, and what else today's money could do."
      >
        <div className={styles.arguments}>
          <article className={styles.caseFor}>
            <span className={styles.miniLabel}>The case for prefunding</span>
            <h3>Put time and investment earnings to work.</h3>
            <p>
              Building assets can reduce the taxes needed later and stop leaving
              nearly the entire old-plan bill to future residents.
            </p>
            <ul>
              <li>
                <strong>Investment income</strong> could pay part of future
                benefits.
              </li>
              <li>
                <strong>An explicit contribution plan</strong> makes the
                transition cost visible.
              </li>
              <li>
                <strong>More assets</strong> can reduce reliance on future tax
                collections.
              </li>
            </ul>
            <div className={styles.argumentCatch}>
              <strong>The hard question</strong>
              <p>
                Where does the extra money come from during the years when
                budgets are already under pressure?
              </p>
            </div>
            <SourceLink id="machizDeck">
              Machiz&apos;s argument for funding reform
            </SourceLink>
          </article>
          <article className={styles.caseCaution}>
            <span className={styles.miniLabel}>The case for caution</span>
            <h3>Protect today&apos;s capacity to pay.</h3>
            <p>
              The existing levy can cover benefits in most tested scenarios.
              Adding contributions now has a cost, even if it reduces later tax
              payments.
            </p>
            <ul>
              <li>
                <strong>Current households</strong> already finance both
                generations.
              </li>
              <li>
                <strong>Investment returns</strong> are uncertain; benefits
                still have to be paid.
              </li>
              <li>
                <strong>Earlier contributions</strong> compete with other uses
                of public money.
              </li>
            </ul>
            <div className={styles.argumentCatch}>
              <strong>The hard question</strong>
              <p>
                How much future tax pressure is worth accepting to avoid a
                larger transition cost today?
              </p>
            </div>
            <SourceLink id="fiveYearPlan2731">
              The City&apos;s transition and risk assessment
            </SourceLink>
          </article>
        </div>
        <div className={styles.perspectives}>
          <div>
            <span>For households</span>
            <p>
              Show the near-term bill, not just decades of potential savings.
              Renters may face indirect costs through rents and services;
              pass-through is not one-for-one.
            </p>
          </div>
          <div>
            <span>For workers & retirees</span>
            <p>
              Keep benefits dependable. A funding debate should distinguish
              earned compensation from the risks of financing it.
            </p>
          </div>
          <div>
            <span>For service users</span>
            <p>
              Compare the transition against other priorities—and identify who
              absorbs losses if investments underperform.
            </p>
          </div>
        </div>
        <p className={styles.sourceNote}>
          These questions are the Lab&apos;s synthesis of the tradeoffs, not
          claims that every member of a group takes the same position.
        </p>
      </Section>

      <Section
        id="fix"
        layout="stacked"
        tone="dark"
        eyebrow="06 / Explore the tradeoff"
        title="What changes when you start saving?"
        lead="Use this teaching model to see how earlier contributions and investment returns interact. It models the old pension only, not your future tax bill or the entire FPDR levy."
      >
        <ReformSimulator />
      </Section>

      <Section
        id="menu"
        layout="stacked"
        eyebrow="07 / The choices"
        title="Prefunding and borrowing are different decisions."
        lead="There is more than one way to change the timing of contributions. A phased transition could be evaluated alongside these options; the simulator is only one illustrative schedule."
      >
        <ReformMenu />
        <div className={styles.decision}>
          <div>
            <span className={styles.miniLabel}>
              What would make a decision ready?
            </span>
            <h3>Ask for a comparison the public can test.</h3>
          </div>
          <ol>
            <li>
              <span>01</span>
              <p>
                <strong>Price the transition.</strong> Show annual
                contributions, distributional effects and the competing uses of
                that money.
              </p>
            </li>
            <li>
              <span>02</span>
              <p>
                <strong>Test the downside.</strong> Include weak returns, early
                market losses and adverse wage or tax-base changes.
              </p>
            </li>
            <li>
              <span>03</span>
              <p>
                <strong>Name the authority.</strong> Identify required charter
                changes, the public vote if needed, and who must act by when.
              </p>
            </li>
          </ol>
        </div>
        <p className={styles.sourceNote}>
          The charter assigns annual funding roles to the FPDR Board and City
          Council. A different funding structure needs a legal review; not every
          administrative improvement requires a charter vote.{" "}
          <SourceLink id="charterLevy">Charter §5-103</SourceLink>.
        </p>
      </Section>

      <Section
        id="sources"
        layout="stacked"
        tone="warm"
        eyebrow="08 / Evidence & method"
        title="Facts, forecasts and choices—kept distinct."
        lead="Reviewed September 16, 2026. Source dates vary: audited finances through June 2025, an adopted FY2026–27 budget, and beneficiary detail from the June 2024 valuation."
      >
        <div className={styles.evidenceKey}>
          <div>
            <strong>Reported</strong>
            <p>Audit balances, adopted budgets and certified tax rates.</p>
          </div>
          <div>
            <strong>Projected</strong>
            <p>
              The City&apos;s rate forecast and the actuary&apos;s levy
              scenarios.
            </p>
          </div>
          <div>
            <strong>Illustrative</strong>
            <p>
              Household growth assumptions and this page&apos;s funding
              simulator.
            </p>
          </div>
        </div>
        <details className={styles.disclosure}>
          <summary>Why the headline changed from $3.9B to $3.36B</summary>
          <p>
            The June 2024 actuarial valuation reported a $3.91B accrued
            liability. The FY2024–25 audit reports a $3.36B total pension
            liability at June 2025. These measurements use different dates and
            valuation roll-forwards. The audit identifies a higher discount rate
            as a major reason for the decline; it does not mean hundreds of
            millions were newly saved or benefits were cut. The updated page
            uses the latest audited figure.{" "}
            <SourceLink id="audit2025">Audit, pp. 10–12 and 25</SourceLink>.
          </p>
        </details>
        <details className={styles.disclosure}>
          <summary>
            Who contributed, and how the arguments are presented
          </summary>
          <p>
            Kevin Machiz, a co-author, advocates prefunding. His proposal is
            labeled as analysis. The City&apos;s assessment of payment capacity
            and transition costs, and GFOA&apos;s position against
            pension-obligation bonds, are presented alongside it. The comparison
            and decision questions are editorial synthesis; this page does not
            establish that one policy is optimal.
          </p>
        </details>
        <div className={styles.sourceGrid}>
          {[
            {
              title: "The numbers & their dates",
              ids: [
                "audit2025",
                "adopted2027",
                "levy2027",
                "county2526",
                "fiveYearPlan2731",
                "milliman2024",
                "millimanLevy2025",
              ],
            },
            {
              title: "The rules & competing arguments",
              ids: [
                "charterLevy",
                "oregonAssessment",
                "machizDeck",
                "gfoaBonds",
              ],
            },
          ].map((group) => (
            <div key={group.title}>
              <h3>{group.title}</h3>
              {group.ids.map((id) => (
                <a
                  key={id}
                  href={SOURCES[id].url}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <span>{SOURCES[id].title}</span>
                  <small>
                    {SOURCES[id].org} · {SOURCES[id].kind}
                  </small>
                  <ArrowRight size={15} />
                </a>
              ))}
            </div>
          ))}
        </div>
      </Section>
    </div>
  );
}
