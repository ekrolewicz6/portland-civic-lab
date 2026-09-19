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
import {
  CompressionDiagram,
  LevyOutlook,
  FundingTradeoff,
  CouncilDecision,
} from "@/components/deep-dives/fpdr/CouncilBriefing";
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
  ["menu", "Decide"],
  ["fix", "Explore"],
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
                How should Portland <em>pay for its pensions?</em>
              </h1>
              <p className={styles.heroLead}>
                Keep paying older pensions from annual taxes, build a partial
                reserve, or move toward full prefunding? Each approach shifts
                costs and risks between today’s and tomorrow’s residents.
              </p>
              <p className={styles.heroQuestion}>
                The evidence here explains the choices. It does not establish
                which funding approach offers Portland the best value.
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
                The strongest case. The main tradeoff.
              </h2>
              {[
                {
                  title: "Keep paying year by year",
                  now: "Preserve money for other needs",
                  later: "Future taxes must cover benefits",
                },
                {
                  title: "Save and invest",
                  now: "Earnings could reduce future taxes",
                  later: "Pay earlier; accept investment risk",
                },
                {
                  title: "Borrow to invest",
                  now: "Potential gains above borrowing costs",
                  later: "Debt remains even after losses",
                },
              ].map((choice) => (
                <div key={choice.title}>
                  <h3>{choice.title}</h3>
                  <dl className={styles.stakesFlow}>
                    <div>
                      <dt>Case for</dt>
                      <dd>{choice.now}</dd>
                    </div>
                    <span className={styles.stakesDivider} aria-hidden="true" />
                    <div>
                      <dt>Tradeoff</dt>
                      <dd>{choice.later}</dd>
                    </div>
                  </dl>
                </div>
              ))}
              <p className={styles.asideFoot}>
                Promised benefits stay the same. The Lab’s synthesis of{" "}
                <SourceLink id="pewFunding2026">
                  Pew’s funding advice
                </SourceLink>
                , the{" "}
                <SourceLink id="cityFinancing2026">
                  City’s transition concerns
                </SourceLink>{" "}
                and <SourceLink id="gfoaBonds">borrowing risks</SourceLink>.
              </p>
            </aside>
          </div>
          <div className={styles.councilBrief}>
            <h2>Before Council acts</h2>
            <p>
              <strong>Compare all three paths on equal terms.</strong> Keep
              annual funding, build partial reserves, or fully prefund. Change
              course only where benefits justify costs and risks.
            </p>
            <a href="#menu">
              When to act—and what to ask <ArrowRight size={16} />
            </a>
          </div>
          <p className={styles.meetingNote}>
            <span>September 16, 2026 · Council briefing</span>
            Financing is the focus; benefit changes are outside the scope.{" "}
            <SourceLink id="councilSeptember2026">
              Agenda &amp; presentations
            </SourceLink>
          </p>
          <p className={styles.byline}>
            Portland Civic Lab · Reviewed September 16, 2026
            <br />
            Source disclosure:{" "}
            <SourceLink id="machizOpEd">
              Kevin Machiz’s published analysis
            </SourceLink>{" "}
            advocates prefunding and is one of the sources used here.
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
        <details className={`${styles.disclosure} ${styles.financialSnapshot}`}>
          <summary>
            The financial snapshot: liability, assets and annual levy
          </summary>
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
        </details>
        <details id="who" className={styles.disclosure}>
          <summary>Who receives these pensions?</summary>
          <p>
            Former public-safety employees and surviving family members. These
            financing options leave their promised benefits unchanged.
          </p>
          <WhoBenefits />
        </details>
      </Section>

      <Section
        id="cost"
        layout="stacked"
        tone="warm"
        eyebrow="02 / Your bill"
        title="What does it cost you?"
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
        <CompressionDiagram />
      </Section>

      <Section
        id="growing"
        eyebrow="03 / The outlook"
        title="Will the bill keep growing?"
        lead="Old-pension costs eventually decline. Contributions for newer workers continue. A falling tax rate does not necessarily mean a smaller bill."
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
        <LevyOutlook />
        <div className={styles.outlook}>
          <div>
            <span className={styles.miniLabel}>A long transition</span>
            <h3>The old promises last for decades</h3>
            <p>
              Legacy benefit payments are projected to crest in the mid-to-late
              2030s and then decline gradually. PERS contributions and other
              fund costs continue.
            </p>
            <SourceLink id="millimanPresentation2025">
              Milliman, printed slides 5 and 10–12
            </SourceLink>
          </div>
          <div>
            <span className={styles.miniLabel}>The capacity check</span>
            <h3>Below the cap in over 98% of scenarios</h3>
            <p>
              Milliman’s model stays within the levy cap through FY2043–44 in
              over 98% of 10,000 scenarios. That tests payment capacity—not
              whether taxes are affordable or other services are protected.
            </p>
            <SourceLink id="millimanPresentation2025">
              Milliman, printed slide 30
            </SourceLink>
          </div>
        </div>
        <details className={styles.disclosure}>
          <summary>What the model does—and does not—test</summary>
          <p>
            The model varies inflation, market values and Oregon PERS investment
            returns. It does not vary every risk: property-tax law changes,
            workforce changes, demographic surprises, and market-linked changes
            in compression or delinquency are among the exclusions. The result
            covers FY2025–2044, not all future years.
            <SourceLink id="millimanPresentation2025">
              {" "}
              Milliman, printed slides 20–23 and 30
            </SourceLink>
            .
          </p>
        </details>
      </Section>

      <Section
        id="hard"
        layout="stacked"
        eyebrow="04 / The central tradeoff"
        title="What does prefunding change?"
        lead="Portland already prefunds newer workers’ pensions. Moving older pensions to an invested reserve changes when residents pay and which risks they bear."
      >
        <FundingTradeoff />
      </Section>

      <Section
        id="menu"
        layout="stacked"
        eyebrow="05 / The choices"
        title="Which option fits—and when?"
        lead="Match the approach to what Portland can afford and withstand. Lower interest rates alone are not a reason to act."
      >
        <ReformMenu />
        <CouncilDecision />
      </Section>

      <Section
        id="fix"
        layout="stacked"
        tone="dark"
        eyebrow="06 / Explore the tradeoff"
        title="How much do assumptions change the result?"
        lead="Compare three illustrative return assumptions. These calculations show cash contributions—not which policy delivers the best economic value."
      >
        <ReformSimulator />
      </Section>

      <Section
        id="sources"
        layout="stacked"
        tone="warm"
        eyebrow="07 / Evidence & method"
        title="Facts, forecasts and choices—kept distinct."
        lead="Includes the September 16, 2026 Council packet. The Milliman slides in that packet are dated January 2025 and use June 2024 data. Audited finances run through June 2025."
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
            Kevin Machiz’s published analysis advocates prefunding. It is cited
            as a source; he is not credited as a co-author or independent
            reviewer of this page. Pew’s advice to compare funding approaches,
            the City&apos;s assessment of payment capacity and transition costs,
            and GFOA&apos;s position against pension-obligation bonds, are
            presented alongside it. The comparison and decision questions are
            the Lab’s editorial synthesis. No independent actuarial review of
            this page’s teaching model is claimed. The evidence does not
            establish one optimal policy.
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
              title: "Council’s briefing & the policy choices",
              ids: [
                "councilSeptember2026",
                "cityFinancing2026",
                "pewFunding2026",
                "legalFunding2026",
                "millimanPresentation2025",
                "oregonCompression",
                "charterLevy",
                "oregonAssessment",
                "machizDeck",
                "gfoaBonds",
              ],
            },
          ].map((group) => (
            <details key={group.title} className={styles.sourceGroup}>
              <summary>
                {group.title}
                <span>{group.ids.length} sources</span>
              </summary>
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
            </details>
          ))}
        </div>
      </Section>
    </div>
  );
}
