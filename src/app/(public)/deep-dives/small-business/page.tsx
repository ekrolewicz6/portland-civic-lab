import Link from "next/link";
import {
  ArrowDown,
  ArrowUpRight,
  BookOpen,
  Check,
  Download,
  Factory,
  HeartPulse,
  Store,
  Wrench,
} from "lucide-react";
import { pageMeta } from "@/lib/page-meta";
import {
  Chapter,
  Figure,
  Note,
  Source,
} from "@/components/deep-dives/small-business/Evidence";
import {
  BarrierJourney,
  ContributionChart,
  DynamicsChart,
  EvidenceLibrary,
  IndustryExplorer,
  JobFlows,
  MetroContext,
  NonemployerChart,
  OwnerCalculator,
  PayrollChart,
  PeerComparison,
  PolicyLab,
  SectorMatrix,
  SizeBands,
  SupportFunnel,
} from "@/components/deep-dives/small-business/Charts";
import "./small-business.css";
import { ReadingNav } from "@/components/deep-dives/small-business/ReadingNav";

export const metadata = pageMeta({
  title: "The state of small business in Portland",
  description:
    "An interactive investigation of Portland’s business economy: who works where, how we compare, what holds firms back, what support achieves, and a better system for the AI era.",
  path: "/deep-dives/small-business",
  type: "article",
});

const chapters = [
  ["picture", "The picture"],
  ["size", "Small vs. big"],
  ["businesses", "Our businesses"],
  ["peers", "Our peers"],
  ["recovery", "The recovery"],
  ["livelihoods", "Making a living"],
  ["dynamics", "Starts & exits"],
  ["friction", "The obstacles"],
  ["support", "The support"],
  ["future", "The next system"],
  ["priorities", "The decisions"],
  ["evidence", "The evidence"],
];

export default function SmallBusinessPage() {
  return (
    <article className="sb-report">
      <section className="sb-hero">
        <div className="sb-wrap">
          <div className="sb-hero-kicker">
            <Link href="/deep-dives">Portland Civic Lab / Deep dives</Link>
            <span>State of small business · 2026</span>
          </div>
          <div className="sb-hero-grid">
            <div className="sb-hero-copy">
              <p className="sb-eyebrow">
                An economy. A livelihood. A public choice.
              </p>
              <h1>
                Small business.
                <br />
                <em>Big questions.</em>
              </h1>
              <p className="sb-hero-deck">
                Portland loves its small businesses.
                <br />
                How well do we actually help them thrive?
              </p>
              <p className="sb-hero-description">
                A visual investigation of the businesses we have, the work they
                support, the pressures they face, and what it would take to make
                Portland an exceptional place to build a sustainable business.
              </p>
              <a href="#picture" className="sb-hero-link">
                Explore the evidence <ArrowDown size={18} />
              </a>
            </div>
            <div className="sb-hero-viz">
              <div className="sb-hero-viz-top">
                <span>The regional picture</span>
                <span>Census · 2022</span>
              </div>
              <div className="sb-hero-stat">
                50.2<span>%</span>
              </div>
              <p>
                of metro employer jobs are at
                <br />
                enterprises with fewer than 500 employees.
              </p>
              <div className="sb-hero-bars">
                {[
                  { label: "Jobs", value: 50.2 },
                  { label: "Payroll", value: 41.0 },
                  { label: "Receipts", value: 35.4 },
                ].map((r) => (
                  <div key={r.label}>
                    <span>{r.label}</span>
                    <div>
                      <i style={{ width: `${r.value}%` }} />
                    </div>
                    <strong>{r.value.toFixed(1)}%</strong>
                  </div>
                ))}
              </div>
              <div className="sb-hero-viz-bottom">
                <span>
                  Three measures.
                  <br />
                  Three different answers.
                </span>
                <ArrowUpRight size={34} />
              </div>
              <p className="sb-hero-source">
                Portland–Vancouver–Hillsboro metro. Employer businesses only.
                Receipts are not GDP. <Source id="susb-msa-2022">Source</Source>
              </p>
            </div>
          </div>
          <div className="sb-hero-footer">
            <span>Evidence through September 30, 2026</span>
            <span>City questions · County and metro data clearly labeled</span>
            <a href="#evidence">Methods & downloadable data ↗</a>
          </div>
        </div>
      </section>
      <ReadingNav chapters={chapters} />

      <Chapter
        id="picture"
        number="01"
        label="The picture in focus"
        title="A business is small. Its effects are not."
        intro={
          <p>
            The useful question is whether Portland makes it easier to earn a
            sustainable living, create good jobs, and provide things people
            need. More business registrations alone will not tell us.
          </p>
        }
      >
        <div className="sb-editorial-grid">
          <div className="sb-prose">
            <p>
              A restaurant is a small business. So is a therapist’s practice, a
              subcontractor, a home-care provider, a design studio, a repair
              shop, or a consultant working alone. Some owners want to expand.
              Others want a dependable income and control over their time. Their
              problems overlap, but a single “entrepreneurship” program cannot
              meet all their needs.
            </p>
            <p>
              The evidence points to a region with a substantial
              small-enterprise economy, an uneven recovery, and a support system
              whose activity is easier to count than its effects. That leaves
              Portland with a real opportunity: make the journey from a viable
              idea to a viable livelihood easier to complete, and measure
              whether it worked.
            </p>
          </div>
          <aside className="sb-reading-key">
            <p className="sb-eyebrow">How to read this report</p>
            <div>
              <span className="sb-status-dot" />
              <p>
                <strong>Measured</strong>Published administrative or statistical
                data, with a defined population.
              </p>
            </div>
            <div>
              <span className="sb-status-dot sb-amber" />
              <p>
                <strong>Reported</strong>Agency totals or survey responses;
                useful, but not a controlled evaluation.
              </p>
            </div>
            <div>
              <span className="sb-status-dot sb-outline" />
              <p>
                <strong>Proposed</strong>Our interpretation, design choices and
                scenarios to test.
              </p>
            </div>
          </aside>
        </div>
        <div className="sb-takeaways">
          <a href="#peers">
            <span>01 / Structure</span>
            <strong>Portland is unusually small-firm-intensive.</strong>
            <p>
              The pattern survives a broad industry-mix adjustment against eight
              selected peers.
            </p>
            <ArrowUpRight />
          </a>
          <a href="#livelihoods">
            <span>02 / Prosperity</span>
            <strong>Business counts are not a living standard.</strong>
            <p>
              Receipts, payroll and survival each tell us something. None alone
              tells us whether owners and workers thrive.
            </p>
            <ArrowUpRight />
          </a>
          <a href="#support">
            <span>03 / Accountability</span>
            <strong>
              We can count contacts. Can we count solved problems?
            </strong>
            <p>
              That is the missing bridge between helping a business and proving
              public value.
            </p>
            <ArrowUpRight />
          </a>
        </div>
        <Figure
          number="01"
          title="Three geographies. Different questions."
          subtitle="The policy focus is Portland city. The most reproducible firm-size comparisons cover a larger economy."
          sources={["prosper-insights", "susb-county-2022", "susb-msa-2022"]}
          note="Portland city crosses county boundaries. Multnomah County includes communities outside Portland. The interstate metro includes suburban employment centers and Vancouver; these populations are not interchangeable."
        >
          <div className="sb-geographies">
            <div>
              <span className="sb-geo-label">City of Portland</span>
              <strong>112,411</strong>
              <p>“Small-business” jobs reported for 2024</p>
              <small>
                Best city policy lens; reported size unit needs confirmation.
              </small>
              <div className="sb-geo-art sb-city-art" aria-hidden="true">
                <Store />
                <Wrench />
                <HeartPulse />
                <Factory />
              </div>
            </div>
            <div>
              <span className="sb-geo-label">Multnomah County</span>
              <strong>439,591</strong>
              <p>Employer jobs in 2022 SUSB</p>
              <small>
                Useful county detail; includes places outside the city and omits
                its other county portions.
              </small>
              <div className="sb-geo-rule" aria-hidden="true" />
            </div>
            <div>
              <span className="sb-geo-label">Portland–Vancouver–Hillsboro</span>
              <strong>1,084,535</strong>
              <p>Metro employer jobs in 2022 SUSB</p>
              <small>
                The regional labor market; the basis for most size comparisons
                in this report.
              </small>
              <div className="sb-geo-rule sb-geo-wide" aria-hidden="true" />
            </div>
          </div>
        </Figure>
        <Note title="A finding is only as local as its data.">
          <p>
            Every chart carries its geography, measurement period and
            population. The report does not turn county or metro values into a
            city estimate by relabeling them. The latest common year differs by
            dataset; older detailed evidence can be more useful than a newer
            incompatible headline.
          </p>
        </Note>
      </Chapter>

      <Chapter
        id="size"
        number="02"
        label="The size question"
        title="How small is small?"
        intro={
          <p>
            Change the threshold and the answer moves from about one job in five
            to one job in two. That is a definition change, not an economic
            transformation.
          </p>
        }
      >
        <div className="sb-prose sb-prose-wide">
          <p>
            We use two transparent Census enterprise thresholds: fewer than 20
            employees and fewer than 500. Neither is a universal legal
            definition of a small business. Program eligibility can depend on
            industry, revenue, ownership and geography. A location with ten
            employees can belong to an enterprise with thousands; a locally
            owned franchise may have a different ownership and operating
            structure again.
          </p>
        </div>
        <Figure
          number="02"
          title="Small enterprises account for half the jobs—but less of the money."
          subtitle="Portland–Vancouver–Hillsboro metro · 2022 · Shares of employer-business totals"
          sources={["susb-msa-2022", "susb-method"]}
          download="metro-size-2022.csv"
          note="Employment is measured in mid-March; payroll and receipts cover the year. Enterprise size is measured across the whole firm. Census disclosure-noise flags are preserved in the download; estimates are rounded here."
        >
          <ContributionChart />
        </Figure>
        <Figure
          number="03"
          title="The businesses between a solo practice and a corporate giant."
          subtitle="Portland metro · 2022 · Employer payroll jobs by enterprise size"
          sources={["susb-msa-2022"]}
          download="metro-size-2022.csv"
          note="Six nonoverlapping bins sum to 1,084,535 employer jobs. The under-20 and under-500 thresholds used elsewhere overlap; do not add them together."
        >
          <SizeBands />
        </Figure>
        <div className="sb-editorial-grid">
          <div className="sb-prose">
            <h3>Why payroll and receipts tell a different story</h3>
            <p>
              An under-500 employment share of 50.2% coexists with a 41.0%
              payroll share and a 35.4% receipts share. The composition of work
              matters: industries differ in wages, hours, capital, intermediate
              purchases and the scale at which production makes sense. These
              aggregate shares cannot establish that a particular small firm is
              inefficient or that a large firm creates more public benefit.
            </p>
            <p>
              They do establish why “small businesses are most of our
              businesses” is an incomplete argument for any particular subsidy.
              A firm count gives a one-person practice and a large employer one
              unit each. Jobs, owner earnings, useful services and fiscal costs
              belong in the decision too.
            </p>
          </div>
          <div className="sb-gdp-card">
            <p className="sb-eyebrow">
              The question we cannot honestly give a pie chart
            </p>
            <h3>What share of Portland GDP comes from small business?</h3>
            <div className="sb-gdp-symbol" aria-hidden="true">
              ?
            </div>
            <p>
              <strong>A defensible city split is not established here.</strong>{" "}
              GDP measures value added, not sales or employment. BEA’s
              small-business estimates are experimental and no longer regularly
              produced. <Source id="bea-small">BEA’s status note</Source>
            </p>
            <a href="/data/small-business/gdp-feasibility.md" download>
              Read the GDP feasibility memo <Download size={15} />
            </a>
          </div>
        </div>
        <details className="sb-deep-detail">
          <summary>What it would take to estimate the GDP split</summary>
          <div className="sb-prose">
            <p>
              Start with a geographic output total and reconcile its sector
              coverage. Estimate value added by enterprise size within
              industries using compatible payroll, production and income
              information. Treat nonemployers separately. Identify government,
              owner-occupied housing and unallocated activity rather than
              assigning the remainder to “big business.” Then test how
              assumptions about productivity, profit, geography and enterprise
              affiliation change the result.
            </p>
            <p>
              Multiplying local GDP by a national small-business percentage
              would merely import the national answer. Multiplying by the local
              employment share would assume away the productivity question we
              are trying to investigate. Both would look precise while leaving
              the central problem unsolved.
            </p>
            <p>
              A model could eventually be useful, but only as a labeled scenario
              with a sensitivity range and reconciliation to the output
              accounts—not as an observed fact.
            </p>
          </div>
        </details>
      </Chapter>

      <Chapter
        id="businesses"
        number="03"
        label="The businesses behind the image"
        title="Look beyond the storefront."
        intro={
          <p>
            The visible economy is only part of the economy. Health care,
            construction, professional services and solo work deserve as much
            attention as restaurants and retail.
          </p>
        }
      >
        <Figure
          number="04"
          title="What Portland’s employer economy actually does."
          subtitle="Portland metro · 2022 · Broad industry sectors, all enterprise sizes"
          sources={["susb-msa-2022"]}
          download="metro-sectors-2022.csv"
          note="Green shows the under-500 portion within each sector; rust shows 500+. Payroll is annual, jobs are mid-March. Sector firm counts may overlap for enterprises operating in multiple industries."
        >
          <IndustryExplorer />
        </Figure>
        <div className="sb-three-col sb-editorial-cards">
          <div>
            <HeartPulse />
            <h3>Essential services</h3>
            <p>
              A clinic, childcare provider or home-care business creates value
              partly through access, reliability and continuity. Growth without
              affordable services or sustainable staffing can miss the public
              purpose.
            </p>
          </div>
          <div>
            <Wrench />
            <h3>Production and trades</h3>
            <p>
              A fabricator or contractor needs space, equipment, power, skilled
              people, customers and working capital. A marketing workshop
              addresses only a fraction of that operating model.
            </p>
          </div>
          <div>
            <BookOpen />
            <h3>Knowledge and independent work</h3>
            <p>
              A professional practice can sell beyond the region with little
              physical footprint. Its scarce resources may be reputation,
              contracts, specialized skills and the owner’s time.
            </p>
          </div>
        </div>
        <div className="sb-stat-banner">
          <div>
            <strong>77,829</strong>
            <span>nonemployer businesses</span>
          </div>
          <p>
            Multnomah County’s 2023 tax-reporting businesses without paid
            employees had <strong>$4.27 billion in gross receipts</strong>. They
            are absent from the employer-size charts.{" "}
            <Source id="nes-2023">Census NES</Source>
          </p>
        </div>
        <Figure
          number="05"
          title="The solo economy has its own shape."
          subtitle="Multnomah County · 2023 · Top ten sectors under the selected measure"
          sources={["nes-2023", "nes-method"]}
          download="nonemployer-sectors-2023.csv"
          note="Nonemployers are tax-reporting businesses without paid employees, generally subject to federal income tax and minimum receipts thresholds. Mailing address may differ from workplace. This population can include side businesses; receipts are not owner earnings."
        >
          <NonemployerChart />
        </Figure>
        <div className="sb-prose sb-prose-wide">
          <h3>A business without employees is not a business without work.</h3>
          <p>
            The owner may be doing sales, production, bookkeeping and customer
            service, sometimes alongside another job. Supporting these firms can
            improve independence and income even if they never hire. Conversely,
            a rise in nonemployer activity can reflect people piecing together
            income after losing stable work. The counts alone cannot distinguish
            opportunity from necessity.
          </p>
          <p>
            Do not add the 2023 county nonemployer count to the 2022 metro
            employer count and call it “Portland’s businesses.” The geography,
            year and unit differ. A useful future city inventory would link
            active operating locations to enterprises while retaining solo
            activity, franchises, local ownership, nonprofits and unknown
            affiliations as distinct dimensions.
          </p>
        </div>
      </Chapter>

      <Chapter
        id="peers"
        number="04"
        label="The comparison"
        title="Small firms matter more here. Is that a strength?"
        intro={
          <p>
            Portland has a higher small-enterprise job share than most of our
            selected peers. The relationship remains after controlling for broad
            industry mix. The interpretation still requires judgment.
          </p>
        }
      >
        <Figure
          number="06"
          title="Compare the same measure across the same year."
          subtitle="Nine U.S. metropolitan areas · 2022 · Enterprise employment thresholds"
          sources={["susb-msa-2022"]}
          download="metro-industry-standardized-2022.csv"
          note="Observed shares use each metro’s employer totals. The optional adjustment uses Portland’s 19 broad-sector job weights; it controls industry composition only. Geography, detailed specialization, firm age and enterprise structure still differ."
        >
          <PeerComparison />
        </Figure>
        <div className="sb-two-col sb-argument-cards">
          <div>
            <span className="sb-eyebrow">The case for strength</span>
            <h3>A broad base of independent activity</h3>
            <p>
              A high small-firm share may reflect accessible ownership
              opportunities, specialized supplier networks, professional
              practices, locally useful services and an ability to start
              modestly. Many of those benefits are real even when the business
              does not become a national brand.
            </p>
          </div>
          <div>
            <span className="sb-eyebrow">The competing explanation</span>
            <h3>A shortage of scale, anchors or alternatives</h3>
            <p>
              The same share can be high because there are fewer large
              employers, because businesses struggle to grow, or because people
              cannot find attractive paid work. Portland cannot resolve those
              possibilities by celebrating the share itself.
            </p>
          </div>
        </div>
        <Figure
          number="07"
          title="Zoom out to metropolitan America."
          subtitle="2022 · Share of employer jobs at enterprises with fewer than 500 employees"
          sources={["susb-msa-2022"]}
          download="all-metro-context-2022.csv"
          note="Original calculation from all 387 areas labeled Metro Area in the revised source. Employment-weighted metropolitan benchmark: 47.5%. This is not a national total, an equal-city average or a business-climate ranking."
        >
          <MetroContext />
        </Figure>
        <div className="sb-prose sb-prose-wide">
          <h3>
            The goal is a productive ecosystem, not a permanent size category.
          </h3>
          <p>
            A successful Portland firm may grow beyond 500 employees. That
            should not count as a failure of small-business policy. A big
            employer can support small suppliers, provide stable household
            purchasing power and train people who later start companies. Small
            firms can help anchors adapt, innovate and reach specialized
            markets. Each can also impose costs on the other through market
            power or slow payment.
          </p>
          <p>
            Our peer set spans different industry structures and regional
            economies. Seattle’s large technology employers, Sacramento’s
            public-sector role, and the growth paths of Austin or Salt Lake City
            make raw comparisons imperfect. The industry adjustment reduces one
            problem; it does not create a policy experiment. Public-sector
            employment is outside the SUSB private employer universe.
          </p>
        </div>
        <Note title="One widely cited comparison is internally inconsistent.">
          <p>
            The Chamber’s 2023 report, with analysis by ECONorthwest, gives a
            metro small-business employment share of <strong>20%</strong> in its
            summary and <strong>28%</strong> in its narrative, using a 1–50
            employee definition. We retain that discrepancy rather than choose a
            preferred number. Its figures cannot be substituted for our
            enterprise-size Census measures.{" "}
            <Source id="chamber-2023">Read the original</Source>
          </p>
        </Note>
      </Chapter>

      <Chapter
        id="recovery"
        number="05"
        label="Where we shine, where we struggle"
        title="There is no single Portland recovery."
        intro={
          <p>
            A citywide small-business series improved modestly from 2019. The
            county’s overall private employment remained below its pre-pandemic
            level. Different geographies, populations and industries can all
            move differently.
          </p>
        }
      >
        <Figure
          number="08"
          title="A city signal worth following—and defining more carefully."
          subtitle="Portland city · Reported small-business employment endpoints · 2019 and 2024"
          sources={["prosper-insights"]}
          download="city-small-employment-report-2019-2024.csv"
          note="Prosper Insights & Indicators 2025, Figure 1.06, PDF p. 17. The report says 1–20 employees here and 1–19 elsewhere; it calls them firms, although standard QCEW size tabulations refer to establishments. Treat as reported endpoints pending the underlying city extract."
        >
          <div className="sb-endpoint-chart">
            <div>
              <span>2019</span>
              <strong>108,785</strong>
              <div>
                <i style={{ width: "90.65%" }} />
              </div>
            </div>
            <div className="sb-endpoint-change">
              +3.3%<span>net change</span>
            </div>
            <div>
              <span>2024</span>
              <strong>112,411</strong>
              <div>
                <i style={{ width: "93.68%" }} />
              </div>
            </div>
          </div>
          <p className="sb-chart-explainer">
            The bars share a zero baseline and a 120,000-job scale. These two
            endpoints do not describe individual firms’ survival, or a city
            small-versus-large employment share.
          </p>
        </Figure>
        <div className="sb-stat-banner sb-rust-banner">
          <div>
            <strong>−7.0%</strong>
            <span>private county jobs, 2019–2025</span>
          </div>
          <p>
            Multnomah County fell from <strong>447,067 to 415,659</strong>{" "}
            annual-average covered private jobs. Health care grew while
            manufacturing, retail and accommodation/food remained below 2019.{" "}
            <Source id="qcew-2025">BLS QCEW</Source>
          </p>
        </div>
        <Figure
          number="09"
          title="A sector can be concentrated, shrinking and well paid—all at once."
          subtitle="Multnomah County · Private employment, 2019–2025 · 2025 concentration and pay"
          sources={["qcew-2019", "qcew-2025", "qcew-method"]}
          download="qcew-sectors-2019-2025.csv"
          note="Location quotient = county industry share divided by the national industry share. Above 1 means more concentrated, not more productive. Pay is annual average covered wages, not median earnings or inflation-adjusted wage growth. All employer sizes are included."
        >
          <SectorMatrix />
        </Figure>
        <div className="sb-three-col sb-editorial-cards">
          <div>
            <span className="sb-card-number">+11.6%</span>
            <h3>Health care jobs</h3>
            <p>
              A growing source of work and essential services. Growth may
              reflect unmet needs, changing demographics or consolidation; it
              does not by itself prove accessible business ownership.
            </p>
          </div>
          <div>
            <span className="sb-card-number sb-negative">−20.8%</span>
            <h3>Manufacturing jobs</h3>
            <p>
              A substantial loss in the county. We need establishment-level and
              subsector evidence to distinguish closures, automation, relocation
              and changes in demand.
            </p>
          </div>
          <div>
            <span className="sb-card-number sb-negative">−14.8%</span>
            <h3>Accommodation & food jobs</h3>
            <p>
              A visible part of the city’s identity under pressure. Recovering
              customer demand and viable operating margins matter alongside the
              number of openings.
            </p>
          </div>
        </div>
        <p className="sb-section-source">
          Calculations from the BLS county extract above. These are employment
          changes, not small-firm-only outcomes or estimates of policy effects.
        </p>
      </Chapter>

      <Chapter
        id="livelihoods"
        number="06"
        label="The prosperity test"
        title="Can people make a decent living?"
        intro={
          <p>
            That is the most important question the standard business dashboards
            struggle to answer. Revenue is visible in some datasets. Owner
            profit, unpaid time and financial security are much harder to see.
          </p>
        }
      >
        <div className="sb-editorial-grid">
          <div className="sb-prose">
            <h3>For the owner, the remainder matters.</h3>
            <p>
              Gross receipts pay for materials, rent, employees, insurance,
              software and many other costs before they support the owner. A
              business with impressive sales can leave very little for household
              expenses. A smaller professional practice may produce more owner
              income with much less revenue.
            </p>
            <p>
              The next layer is time and risk. How many unpaid hours did the
              owner contribute? Did a partner’s job provide health insurance?
              Was debt personally guaranteed? Did the household absorb months of
              losses? A sustainable business can offer autonomy and flexibility.
              It can also transfer risk and uncompensated work onto a family.
            </p>
            <p>
              Research on small-business owners finds heterogeneous objectives;
              many do not intend to grow substantially. A good program should
              help people choose a viable path, including deciding not to open
              an unviable business.{" "}
              <Source id="owner-goals">Hurst & Pugsley</Source>
            </p>
          </div>
          <aside className="sb-question-card">
            <span className="sb-eyebrow">The missing local distribution</span>
            <h3>
              Not “How many owners?”
              <br />
              <em>“What life does ownership support?”</em>
            </h3>
            <ul>
              <li>Net income after expenses</li>
              <li>Total owner and family hours</li>
              <li>Income volatility and debt exposure</li>
              <li>Benefits and financial reserves</li>
              <li>Choice, necessity and satisfaction</li>
            </ul>
            <a href="/data/small-business/fieldwork-kit.md" download>
              Read the prepared interview and records kit ↓
            </a>
          </aside>
        </div>
        <Figure
          number="10"
          title="The same sales can support very different livelihoods."
          subtitle="Interactive illustration · Adjust receipts, operating costs and owner time"
          sources={["nes-method"]}
          note="This calculator explains the accounting distinction; its inputs are hypothetical. It does not estimate a typical Portland business’s margin, tax liability or hourly wage."
        >
          <OwnerCalculator />
        </Figure>
        <Figure
          number="11"
          title="Workers’ pay belongs in the small-business conversation."
          subtitle="Portland metro · 2022 · Annual payroll per mid-March employee"
          sources={["susb-msa-2022"]}
          download="metro-size-2022.csv"
          note="A descriptive aggregate, not a causal employer-size wage premium. Within-industry and occupation comparisons, hours, benefits and worker characteristics are needed before attributing differences to business size."
        >
          <PayrollChart />
        </Figure>
        <div className="sb-prose sb-prose-wide">
          <h3>Support the business without making the worker invisible.</h3>
          <p>
            A small workplace can offer close relationships, flexibility and
            opportunities to learn. It can also struggle to provide predictable
            schedules, benefits, advancement or coverage when someone is sick.
            Neither a “local” label nor the size of the payroll settles the
            question of job quality.
          </p>
          <p>
            The local data here cannot measure comparable benefits, schedule
            stability, injuries or wage compliance by enterprise size. That is a
            reason to collect worker evidence, not to assume the jobs are good
            or bad. Public assistance should make its job-quality expectations
            explicit and proportionate to the support provided.
          </p>
          <p>
            A useful evaluation follows both sides of the labor relationship:
            owner income and hours; employee hourly pay, hours, stability,
            benefits and retention. If a program raises sales while relying on
            more unpaid owner work or worse worker schedules, its headline
            success needs qualification.
          </p>
        </div>
      </Chapter>

      <Chapter
        id="dynamics"
        number="07"
        label="The business life cycle"
        title="Openings are only half the story."
        intro={
          <p>
            A healthy economy needs entry, productive growth and room for people
            to change direction. It also needs to understand the closures,
            contractions and household losses hidden behind net growth.
          </p>
        }
      >
        <Figure
          number="12"
          title="The doors opening—and the doors closing."
          subtitle="Census Business Dynamics Statistics · Metro employer establishments · 2019–2023"
          sources={["bds-msa-2023", "bds-method"]}
          download="bds-metro-2019-2023.csv"
          note="An establishment is a location, not necessarily a new enterprise. Rates divide flows by the average of adjacent-year establishment totals. These are not cohort survival rates; closures and relocations require further investigation."
        >
          <DynamicsChart />
        </Figure>
        <Figure
          number="13"
          title="The net number hides the churn."
          subtitle="Portland metro · 2023 · Employer job creation and destruction, all firm sizes"
          sources={["bds-msa-2023", "bds-msa-age-2023"]}
          download="bds-portland-firm-age-2023.csv"
          note="BDS records 148,949 jobs created and 129,091 destroyed, net +19,858. Firm-age groups are source-native; the left-censored group has uncertain exact age because its history predates observation."
        >
          <JobFlows />
        </Figure>
        <div className="sb-editorial-grid">
          <div className="sb-prose">
            <h3>Young and small are different.</h3>
            <p>
              In 2023, BDS records{" "}
              <strong>4,472 age-zero employer firms and 18,724 jobs</strong> in
              the Portland metro. That is a much more specific formation measure
              than registrations or the opening of additional locations. It
              still leaves out solo nonemployers.
            </p>
            <p>
              Foundational research shows that accounting for firm age changes
              the apparent relationship between size and job growth. A
              twenty-year-old three-person practice and a two-year-old company
              hiring its first ten employees are both small. Their needs and
              likely contributions are different.{" "}
              <Source id="young-firms">Haltiwanger, Jarmin & Miranda</Source>
            </p>
          </div>
          <aside className="sb-note">
            <strong>Survival is a means, not the whole objective.</strong>
            <p>
              High survival can indicate strong businesses, but also limited
              entry or protected incumbents. A closure can reflect distress,
              retirement, an acquisition, relocation or a better opportunity. A
              serious city scorecard tracks the reason and the owner’s next
              outcome—not just whether a registration remains active.
            </p>
          </aside>
        </div>
      </Chapter>

      <Chapter
        id="friction"
        number="08"
        label="What gets in the way"
        title="The right help depends on the business."
        intro={
          <p>
            Finding customers, financing cash flow and navigating a buildout are
            different problems. Before prescribing more advice, identify the
            constraint that is actually preventing the next step.
          </p>
        }
      >
        <Figure
          number="14"
          title="Follow the decisions, not just the departments."
          subtitle="Illustrative business journeys · Requirements vary with activity and location"
          sources={["osb-site", "city-permits", "oregon-osba"]}
          note="These are analytical journey maps, not complete licensing checklists or measured permit durations. The carrying-cost scenario makes the cost of delay visible without attributing every delay to government."
        >
          <BarrierJourney />
        </Figure>
        <div className="sb-two-col sb-argument-cards">
          <div>
            <p className="sb-eyebrow">Demand</p>
            <h3>A grant writer cannot create a customer.</h3>
            <p>
              The 2025 Federal Reserve small-business survey identifies reaching
              customers and growing sales as the leading operational challenge.
              For a neighborhood business, better foot traffic, safe access,
              useful nearby destinations and repeat customers may matter more
              than another business-plan template.
            </p>
            <p>
              This is national survey evidence, not a ranking of Portland’s
              barriers. Local interviews should separate “I need help marketing”
              from “the customers who used to buy this are gone.”{" "}
              <Source id="fed-employer-2026">Federal Reserve</Source>
            </p>
          </div>
          <div>
            <p className="sb-eyebrow">Capital</p>
            <h3>Is the problem liquidity, risk—or a weak business model?</h3>
            <p>
              Working capital can bridge a delayed payment or a seasonal gap. It
              cannot indefinitely repair an operation whose ordinary costs
              exceed its revenue. A loan also creates repayment obligations, and
              a guarantee can expose the owner’s household.
            </p>
            <p>
              Match financing to the problem: patient equipment finance, a line
              against reliable invoices, a targeted grant for public benefits,
              or honest advice to stop. The best outcome is not always the
              largest loan.
            </p>
          </div>
        </div>
        <Figure
          number="15"
          title="Even among applicants, finance is far from automatic."
          subtitle="United States · 2025 Small Business Credit Survey · Financing applicants"
          sources={["fed-employer-2026"]}
          note="42% received all requested financing, 36% some or most, 22% none. The overall employer survey has 6,525 respondents in a weighted convenience sample; these percentages apply to the applicant subset, not all firms or Portland specifically."
        >
          <div
            className="sb-finance-bar"
            role="img"
            aria-label="Financing applicants: 42 percent received all, 36 percent some or most, 22 percent none"
          >
            <div style={{ width: "42%" }}>
              <strong>42%</strong>
              <span>All</span>
            </div>
            <div style={{ width: "36%" }}>
              <strong>36%</strong>
              <span>Some / most</span>
            </div>
            <div style={{ width: "22%" }}>
              <strong>22%</strong>
              <span>None</span>
            </div>
          </div>
          <p className="sb-chart-explainer">
            Application outcomes miss people discouraged from applying. Approval
            also says little about whether the amount, interest, repayment
            schedule and personal exposure are appropriate.
          </p>
        </Figure>
        <div className="sb-editorial-grid">
          <div className="sb-prose">
            <h3>Permitting needs an end-to-end clock.</h3>
            <p>
              Portland’s permit dashboard reports application and issuance
              counts, valuations and review timing. Those are useful measures.
              But a business owner experiences the full path from finding a
              space to opening: pre-application work, redesign, applicant
              response time, approvals, construction, inspections and occupancy.
            </p>
            <p>
              The right cohort analysis follows every application—including
              abandoned and withdrawn cases—and separates city review time from
              applicant and construction time. Compare similar work types and
              project complexity. An average for issued permits alone cannot
              describe the experience of everyone who tried to open.{" "}
              <Source id="city-permits">City dashboard and definitions</Source>
            </p>
            <h3>Taxes combine dollar costs with administrative costs.</h3>
            <p>
              A business may owe little and still spend time understanding which
              returns to file. Simplifying a filing or coordinating an exemption
              can matter independently of the tax rate. Revenue also pays for
              services businesses depend on, so evaluate a tax change alongside
              the services or other revenue that finance it.
            </p>
          </div>
          <aside className="sb-tax-card">
            <p className="sb-eyebrow">A concrete change already adopted</p>
            <h3>City gross-receipts exemption threshold</h3>
            <div>
              <span>Before 2026</span>
              <strong>&lt; $50,000</strong>
            </div>
            <div>
              <span>Tax year 2026</span>
              <strong>&lt; $75,000</strong>
            </div>
            <div>
              <span>From 2027</span>
              <strong>&lt; $100,000</strong>
            </div>
            <p>
              These are eligibility thresholds using gross receipts everywhere,
              not tax rates on sales. City and county exemptions still require
              annual filing under current guidance. Other taxes have different
              rules.
            </p>
            <Source id="city-tax-2026">Revenue Division guidance</Source>
            <Source id="city-tax-adoption-2026">April 2026 adoption</Source>
          </aside>
        </div>
        <Note title="A vacant space is not automatically a usable space.">
          <p>
            Rent, permitted use, seismic and accessibility work, ventilation,
            power, plumbing, insurance and lease terms can prevent a seemingly
            cheap unit from becoming an affordable business location. Tenant
            improvements can also raise a landlord’s asset value. Public space
            subsidies should specify who retains the benefit and for how long,
            with tenant protections proportionate to the subsidy.
          </p>
        </Note>
      </Chapter>

      <Chapter
        id="support"
        number="09"
        label="Reach, fairness and results"
        title="Portland has a support network. Does it close the gap?"
        intro={
          <p>
            OSB, community providers, lenders and public programs offer a range
            of services. The next standard is whether people with different
            starting points can reach them—and whether the help changes the
            outcome.
          </p>
        }
      >
        <div className="sb-three-col sb-program-stats">
          <div>
            <span>Office of Small Business</span>
            <strong>759</strong>
            <p>
              unique businesses reported in its first year, May 2025–May 2026
            </p>
            <Source id="osb-2026">Year One, p. 4</Source>
          </div>
          <div>
            <span>IBRN</span>
            <strong>691</strong>
            <p>
              clients reported in FY 2024–25; a different program population and
              period
            </p>
            <Source id="prosper-insights">Table 4.14</Source>
          </div>
          <div>
            <span>IBRN client composition</span>
            <strong>70%</strong>
            <p>identified as BIPOC; 69% women and/or gender expansive</p>
            <Source id="prosper-insights">FY 2024–25</Source>
          </div>
        </div>
        <p className="sb-section-source">
          These counts must not be added as unique businesses. Program
          participation overlaps, and the population of eligible nonparticipants
          is not established.
        </p>
        <Figure
          number="16"
          title="The missing middle between a contact and an outcome."
          subtitle="OSB first-year reach in the context of a full service-accountability chain"
          sources={["osb-2026"]}
          note="Known program activity is shown beside the denominators and outcomes still needed. The report’s district and interaction totals are retained as unresolved discrepancies in the expandable check below."
        >
          <SupportFunnel />
        </Figure>
        <div className="sb-editorial-grid">
          <div className="sb-prose">
            <h3>Who owns a business—and who has the option?</h3>
            <p>
              Ownership opportunities depend on savings, collateral, networks,
              language, time, health, care responsibilities and access to
              customers. A program can serve many underrepresented owners and
              still miss people who never heard about it, could not meet its
              conditions, or abandoned the application.
            </p>
            <p>
              IBRN’s client demographics show who its services reach, not the
              ownership distribution of the city or equal access among everyone
              eligible. Representation should be compared with an appropriate
              business population and with need. A raw comparison to the entire
              resident population can conceal differences in age, labor-force
              participation, sector and the constraints that kept people from
              becoming owners.
            </p>
            <p>
              The next evidence should combine Census ownership data where
              available, privacy-protected city aggregates, program records and
              interviews with nonusers and unsuccessful applicants. Race,
              gender, disability, immigration background and language may
              intersect; small cells need protection rather than speculative
              rankings.
            </p>
          </div>
          <aside className="sb-question-card">
            <span className="sb-eyebrow">
              A service mix is not an economic census
            </span>
            <h3>
              33% food service.
              <br />
              15% retail.
            </h3>
            <p>
              That is the OSB report’s client mix. It tells us something about
              demand for this service and whom outreach reaches. It does not
              mean those sectors make up the same share of Portland’s
              businesses.
            </p>
            <p>
              Half of recorded services involved Prosper resources; 7% involved
              access to capital. The next question is what those referrals
              completed.
            </p>
            <Source id="osb-2026">Year One, p. 4</Source>
          </aside>
        </div>
        <div className="sb-program-table">
          <div className="sb-table-scroll">
            <table>
              <caption>What the support system does—and what to verify</caption>
              <thead>
                <tr>
                  <th>Channel</th>
                  <th>Job to be done</th>
                  <th>What would demonstrate value</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <th>
                    <Source id="osb-site">OSB navigation</Source>
                  </th>
                  <td>Help a business find the right service and bureau.</td>
                  <td>
                    Resolved problems, fewer repeated contacts, shorter elapsed
                    time.
                  </td>
                </tr>
                <tr>
                  <th>
                    <Source id="ibrn-2025">IBRN and community providers</Source>
                  </th>
                  <td>
                    Advising, skills, trusted relationships and specialist
                    referrals.
                  </td>
                  <td>
                    Completed tasks and stronger owner finances relative to a
                    fair comparison.
                  </td>
                </tr>
                <tr>
                  <th>
                    <Source id="meso-site">MESO</Source> /{" "}
                    <Source id="livelihood-site">Livelihood NW</Source> /{" "}
                    <Source id="sbdc-site">SBDCs</Source>
                  </th>
                  <td>
                    Different combinations of advising, training and financing.
                  </td>
                  <td>
                    Service-specific eligibility, follow-through, cost and
                    outcomes; avoid double counting clients.
                  </td>
                </tr>
                <tr>
                  <th>
                    <Source id="prosper-loans">Loans and grants</Source>
                  </th>
                  <td>
                    Address a financing gap or purchase a defined public
                    benefit.
                  </td>
                  <td>
                    Additional investment or resilience, affordability,
                    repayment and who captures the benefit.
                  </td>
                </tr>
                <tr>
                  <th>
                    <Source id="port-procurement">
                      Procurement and supplier access
                    </Source>
                  </th>
                  <td>Connect capable firms with contracts.</td>
                  <td>
                    Actual awards, payment speed, sustainable margins and repeat
                    customers.
                  </td>
                </tr>
                <tr>
                  <th>
                    <Source id="city-permits">
                      Permits and basic city services
                    </Source>
                  </th>
                  <td>
                    Make lawful operations predictable, accessible and workable.
                  </td>
                  <td>
                    End-to-end timelines, less avoidable rework, safety and
                    service reliability.
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <p className="sb-chart-explainer">
            An institutional map, not a live eligibility checker. Follow each
            provider for current availability and requirements. No relationship
            with the Lab is implied.
          </p>
        </div>
        <div className="sb-prose sb-prose-wide">
          <h3>Are we spending too much—or too little?</h3>
          <p>
            The evidence here cannot justify a single spending verdict.
            Prosper’s agencywide budget includes real estate, workforce and
            other functions. Loan principal is not equivalent to a grant
            expense; approvals are not disbursements; and a one-time allocation
            is not recurring operating capacity.
          </p>
          <p>
            The 2025 Insights report’s <strong>$37 million</strong> headline
            combines grants and loans approved or awarded to businesses and
            nonprofits. It is not the annual cost of small-business assistance.
            A defensible ledger would separately show staff and contracts,
            grants paid, lending and repayments, guarantees, tax expenditures
            and pass-through funding, then reconcile them to actual accounts.{" "}
            <Source id="prosper-insights">Report summary</Source>{" "}
            <Source id="prosper-acfr">FY 2025 financial statements</Source>
          </p>
          <p>
            Then ask what the next dollar achieves. Is the bottleneck a lack of
            advisors, confusing eligibility, a permit dependency, an
            unaffordable buildout, or insufficient customer demand? The
            comparison is not simply “small business versus no small business.”
            It is one intervention against the best available alternative,
            including reliable everyday city services.
          </p>
        </div>
        <div className="sb-two-col sb-argument-cards">
          <div>
            <span className="sb-eyebrow">
              What evaluation has already taught us
            </span>
            <h3>Satisfied clients are not a counterfactual.</h3>
            <p>
              The City Auditor’s emergency-grant review identified weaknesses in
              award standards and outcome evidence. Its findings apply to the
              pandemic program examined, not automatically to OSB today. The
              broader lesson is to define success and comparison groups before
              funds are spent.{" "}
              <Source id="city-audit-grants">2021 audit</Source>
            </p>
          </div>
          <div>
            <span className="sb-eyebrow">
              Why test assistance rather than assume it works
            </span>
            <h3>Training can change starts without raising earnings.</h3>
            <p>
              Project GATE used randomized assignment to evaluate
              entrepreneurship services. Its long-term report found early
              business-ownership effects that faded and no effect on
              self-employment earnings. That does not settle every Portland
              program; it shows why counting starts is insufficient.{" "}
              <Source id="gate-eval">
                U.S. Department of Labor evaluation
              </Source>
            </p>
          </div>
        </div>
      </Chapter>

      <Chapter
        id="future"
        number="10"
        label="An institution for the next decade"
        title="Make useful capability available to a very small firm."
        intro={
          <p>
            The promise of AI is cheaper, faster access to some work that owners
            currently do alone. The public challenge is to turn that capability
            into completed, reliable services—and fix processes that should not
            require help in the first place.
          </p>
        }
        dark
      >
        <div className="sb-editorial-grid">
          <div className="sb-prose">
            <h3>Build a service with an accountable person behind it.</h3>
            <p>
              Imagine an owner describing a specific objective: open this shop,
              understand next month’s cash position, submit this bid, or resolve
              this tax notice. The system gathers only the needed information,
              checks the applicable rules, prepares the work, and gives a named
              advisor responsibility for the next step. The owner can see what
              is waiting, who owns it and when to expect a response.
            </p>
            <p>
              AI can draft, classify, translate, organize and check consistency.
              A qualified person must review consequential accounting, legal,
              licensing and financing work. Government must still make
              authoritative decisions. The owner must approve submissions and
              control access to business records.
            </p>
            <p>
              The 2025 Federal Reserve survey reports 46% AI use among
              responding employer firms, with accuracy a leading concern. Census
              BTOS reported roughly 17–20% over December 2025–May 2026 using a
              different sample and question. These are not interchangeable
              adoption measures or Portland estimates.{" "}
              <Source id="fed-employer-2026">Federal Reserve</Source>{" "}
              <Source id="census-ai-2026">Census</Source>
            </p>
          </div>
          <aside className="sb-future-principle">
            <span>Design principle</span>
            <strong>
              One front door.
              <br />
              One case owner.
              <br />
              <em>A completed next step.</em>
            </strong>
            <p>
              Measure the work finished, the accuracy of the result and the
              owner’s time recovered. A larger library of links is not the
              outcome.
            </p>
          </aside>
        </div>
        <Figure
          number="17"
          title="What the next service could actually deliver."
          subtitle="Proposed service design · Human responsibility and structural constraints remain visible"
          sources={[
            "seattle-services",
            "singapore-digital",
            "singapore-cto",
            "nyc-mycity",
          ]}
          note="Design hypotheses informed by existing services and audits. International examples illustrate mechanisms, not a comparable global ranking or proof of effectiveness in Portland."
        >
          <div className="sb-service-blueprint">
            {[
              [
                "01",
                "Understand the need",
                "A multilingual conversation, a phone call or an in-person visit.",
                "Human owner: a navigator checks the actual problem, urgency and eligibility.",
              ],
              [
                "02",
                "Do the preparation",
                "Organize records, draft a cash-flow view, identify eligible bids, prepare an application.",
                "AI-assisted work is checked against dated sources and the owner’s actual records.",
              ],
              [
                "03",
                "Resolve the dependency",
                "Secure a specialist answer, an agency decision, a complete submission or a workable alternative.",
                "Named professionals and bureaus own decisions; a model does not issue a permit.",
              ],
              [
                "04",
                "Confirm the result",
                "Did the owner finish the task? Was it correct? Did time, money or business stability improve?",
                "Follow up after the referral and publish privacy-protected performance measures.",
              ],
            ].map(([n, t, b, h]) => (
              <div key={n}>
                <span>{n}</span>
                <h4>{t}</h4>
                <p>{b}</p>
                <small>{h}</small>
              </div>
            ))}
          </div>
        </Figure>
        <div className="sb-program-table">
          <div className="sb-table-scroll">
            <table>
              <caption>Put AI where the task is suitable</caption>
              <thead>
                <tr>
                  <th>Service</th>
                  <th>Useful AI-supported work</th>
                  <th>What still needs people or policy</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <th>Bookkeeping preparation</th>
                  <td>
                    Sort documents, suggest categories, flag missing records.
                  </td>
                  <td>
                    Owner confirmation, accountant review, tax treatment and
                    reliable underlying records.
                  </td>
                </tr>
                <tr>
                  <th>Cash-flow planning</th>
                  <td>
                    Build scenarios from invoices, recurring costs and timing
                    assumptions.
                  </td>
                  <td>
                    Demand judgment, creditor negotiation and the cash itself.
                  </td>
                </tr>
                <tr>
                  <th>Procurement</th>
                  <td>
                    Find relevant opportunities, summarize requirements,
                    organize a bid checklist.
                  </td>
                  <td>
                    Capacity, certification, bonding, fair purchasing and timely
                    payment.
                  </td>
                </tr>
                <tr>
                  <th>Applications and grants</th>
                  <td>
                    Reuse verified facts, draft answers, check completeness and
                    translate.
                  </td>
                  <td>
                    Clear eligibility, simpler forms, transparent selection and
                    sufficient funding.
                  </td>
                </tr>
                <tr>
                  <th>Permitting</th>
                  <td>
                    Explain a documented pathway and assemble a complete package
                    for review.
                  </td>
                  <td>
                    Authoritative interpretation, inspections, professional
                    design and process reform.
                  </td>
                </tr>
                <tr>
                  <th>Marketing and sales</th>
                  <td>
                    Draft material, improve accessibility and support customer
                    follow-up.
                  </td>
                  <td>
                    A differentiated offer, genuine trust and customers with
                    purchasing power.
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        <div className="sb-two-col sb-argument-cards">
          <div>
            <h3>Better grant writing does not create more grant money.</h3>
            <p>
              If funding is fixed, better applications can simply intensify the
              competition. Compare an application assistant with a shorter
              application, reusable verified business profile, clearer
              eligibility, or a less burdensome allocation rule. Time saved for
              unsuccessful applicants counts too.
            </p>
            <p>
              The same principle applies to navigation: a system that explains
              an unnecessarily confusing process can be useful, but simplifying
              that process may deliver more lasting value.
            </p>
          </div>
          <div>
            <h3>A wrong answer can be an expensive service.</h3>
            <p>
              New York’s MyCity audit documented inconsistent and inaccurate
              chatbot responses and disputed performance measures. Portland
              should evaluate real tasks with independent checks, including
              different languages, ambiguous questions and changing rules. An
              unresolved task must not be classified as a success merely because
              the system answered.{" "}
              <Source id="nyc-mycity">NYC Comptroller</Source>
            </p>
          </div>
        </div>
        <div className="sb-prose sb-prose-wide">
          <h3>Why doesn’t the ideal system exist already?</h3>
          <p>
            No single institution controls the whole journey. Rules sit across
            agencies and levels of government. Data are fragmented, eligibility
            differs by funding source, and a referring organization may have no
            authority over the next decision. Trusted providers need stable
            capacity; small firms have limited time to adopt unfamiliar tools.
          </p>
          <p>
            AI lowers the cost of some information work. It does not remove
            those institutional constraints. Nor does it create affordable
            premises, working capital or local purchasing power. A successful
            system requires service agreements, budget authority, usable data
            and accountability for unresolved cases.
          </p>
          <p>
            It also creates tradeoffs. Subsidized AI services could displace
            local bookkeepers, designers or administrative workers. The city
            could instead contract with those providers to supervise and improve
            service. That choice should be explicit. Follow effects on service
            quality, worker income, competition and customer demand alongside
            owner time saved.
          </p>
        </div>
        <Figure
          number="18"
          title="Three ways to spend the next dollar."
          subtitle="A policy lab, not an official budget · Change the cost, reach and assumed effect"
          sources={["oecd-eval", "gate-eval"]}
          download="future-program.md"
          note="These are alternative illustrative concepts. No causal effect is established. A higher activity count only improves the scenario if the intervention resolves more problems than would otherwise be resolved."
        >
          <PolicyLab />
        </Figure>
      </Chapter>

      <Chapter
        id="priorities"
        number="11"
        label="What Portland should decide"
        title="Aim to be the easiest place to build a viable livelihood."
        intro={
          <p>
            “Number one in the world” becomes useful when it means a measurable
            experience. The goal should reward accessible opportunity, useful
            output and durable prosperity—not an ever-rising count of small
            firms.
          </p>
        }
      >
        <div className="sb-scorecard">
          <div className="sb-scorecard-head">
            <span>A proposed public scorecard</span>
            <span>
              Targets require a baseline; these are measures, not claimed
              results.
            </span>
          </div>
          {[
            [
              "A predictable start",
              "Median and 90th-percentile time from a complete initial case to opening or a definitive decision.",
              "Include abandoned cases, project complexity, applicant time and safety outcomes.",
            ],
            [
              "Help that finishes the task",
              "Additional share of cases resolved; cost per additional resolution.",
              "Independent quality checks and an appropriate comparison group.",
            ],
            [
              "A sustainable owner income",
              "Net income per owner hour, reserves, volatility and household exposure.",
              "Measure costs and hours; include closed businesses and nonrespondents.",
            ],
            [
              "Work worth having",
              "Hourly pay, benefits, stable hours, retention and advancement.",
              "Compare similar sectors, occupations and worker characteristics.",
            ],
            [
              "Opportunity that reaches people",
              "Awareness, uptake, rejection, abandonment and outcomes by eligible group.",
              "Use correct denominators, language access and privacy-protected cells.",
            ],
            [
              "A productive local economy",
              "Value added where measurable, customer demand, supplier growth and useful services.",
              "Account for displaced competitors, landlord capture and costs borne by residents.",
            ],
          ].map(([t, m, c], i) => (
            <div className="sb-scorecard-row" key={t}>
              <span>{String(i + 1).padStart(2, "0")}</span>
              <h3>{t}</h3>
              <p>{m}</p>
              <small>{c}</small>
            </div>
          ))}
        </div>
        <div className="sb-roadmap">
          <div>
            <p className="sb-eyebrow">First 90 days · Establish the baseline</p>
            <h3>Make the system legible.</h3>
            <p>
              Publish a reconciled inventory of actual spending and services.
              Agree on a case and a resolution. Resolve the OSB totals and city
              size definitions. Sample nonusers, unsuccessful applicants and
              closed businesses. Identify the two or three recurrent delays
              owners cannot resolve alone.
            </p>
          </div>
          <div>
            <p className="sb-eyebrow">Months 4–9 · Test a complete service</p>
            <h3>Run a bounded, comparative pilot.</h3>
            <p>
              Choose concrete tasks with enough volume to evaluate. Compare
              existing assistance, AI-assisted human service and process
              simplification. Define acceptable error rates and escalation rules
              before launch. Track costs and owner effort from intake through
              completion.
            </p>
          </div>
          <div>
            <p className="sb-eyebrow">Months 10–18 · Scale what earns it</p>
            <h3>Publish results and change the rules.</h3>
            <p>
              Measure six- and twelve-month outcomes with nonresponse disclosed.
              Expand what provides additional value; redesign or stop what does
              not. Use recurring case failures to change permits, purchasing,
              payment and eligibility rules. Give the public a durable
              performance record.
            </p>
          </div>
        </div>
        <div className="sb-prose sb-prose-wide">
          <h3>What would change our judgment?</h3>
          <p>
            If the majority of lost owner time comes from repeated
            documentation, shared services become more compelling. If
            commercially viable projects repeatedly fail at the same
            city-controlled step, structural reform becomes the priority. If
            firms can open readily but cannot attract customers, demand,
            household prosperity and place management move to the center.
          </p>
          <p>
            If grants mainly move customers between nearby businesses, claimed
            growth needs to be reduced for displacement. If landlords capture
            most of a space subsidy, program design should change. If a trusted
            advisor prevents an owner from taking on unaffordable debt or
            starting a business that cannot work, that can be a valuable outcome
            even though no new firm appears in the statistics.
          </p>
        </div>
        <div className="sb-closing">
          <span className="sb-eyebrow">The standard to hold ourselves to</span>
          <p>
            Celebrate the business.
            <br />
            <em>Measure the life it makes possible.</em>
          </p>
          <div>
            <Check size={22} />
            <span>
              For the owner. For the worker. For the customer. For the city.
            </span>
          </div>
        </div>
      </Chapter>

      <Chapter
        id="evidence"
        number="12"
        label="Open notebook"
        title="Go all the way back to the evidence."
        intro={
          <p>
            Explore the source register, download the numerical extracts, and
            inspect the definitions. A polished chart should make its
            uncertainty easier to see.
          </p>
        }
      >
        <div className="sb-method-grid">
          <div>
            <h3>How the calculations work</h3>
            <p>
              Census SUSB provides employer enterprise-size comparisons. NES
              covers tax-reporting nonemployers. QCEW measures annual-average
              covered jobs and wages. BDS tracks employer-business dynamics.
              They describe related but different populations.
            </p>
            <p>
              Headline shares divide the relevant size-group value by the same
              source’s total. Industry-adjusted peer shares apply Portland’s
              broad-sector employment weights to each peer’s within-sector
              small-enterprise share. Suppressed values are not treated as zero.
            </p>
          </div>
          <div>
            <h3>What is—and is not—complete</h3>
            <p>
              This is an evidence-led investigation, not a complete census of
              city firms or a claim to have reviewed the entire web. The library
              includes reviewed sources and leads whose methods or data remain
              unresolved. Source status is visible below.
            </p>
            <p>
              Owner-profit distributions, local benefits by firm size, complete
              city survival cohorts, procurement flows, a valid city GDP split
              and causal program effects remain research priorities. No
              interviews or public-records requests have been sent for this
              report.
            </p>
          </div>
        </div>
        <div className="sb-downloads">
          {[
            ["methodology.md", "Measurement rules"],
            ["sources.tsv", "Original source register"],
            ["claims.tsv", "Original claim ledger"],
            ["web-claims.tsv", "Webpage claim extension"],
            ["web-sources.json", "Additional reviewed sources"],
            ["gdp-feasibility.md", "GDP feasibility"],
            ["fieldwork-kit.md", "Prepared fieldwork kit"],
            ["future-program.md", "Program cost assumptions"],
            ["webpage-methods.md", "New calculations & methods"],
            ["raw-inputs.tsv", "Raw input URLs & hashes"],
            ["build-web.py", "Rebuild the webpage data"],
          ].map(([file, label]) => (
            <a key={file} href={`/data/small-business/${file}`} download>
              <Download size={16} />
              {label}
            </a>
          ))}
        </div>
        <details className="sb-deep-detail">
          <summary>The five cautions that matter most</summary>
          <ol>
            <li>
              <strong>Geography:</strong> city, county and metro boundaries are
              different. Postal addresses are not a city boundary.
            </li>
            <li>
              <strong>Units:</strong> an entity is not necessarily active; a
              location is not a firm; a job is not a full-time person; receipts
              are not profit or GDP.
            </li>
            <li>
              <strong>Dates:</strong> each chart uses its actual measurement
              period. Latest common years differ. Nominal payroll cannot
              demonstrate real income gains.
            </li>
            <li>
              <strong>Causality:</strong> clients select into programs, outcomes
              may have happened anyway, and surveys miss nonrespondents.
              Reported effects need a comparator.
            </li>
            <li>
              <strong>Missing evidence:</strong> official reports can contain
              ambiguities. OSB totals, the Chamber’s 20%/28% shares and the
              city’s size unit remain visible until resolved.
            </li>
          </ol>
        </details>
        <EvidenceLibrary />
        <div className="sb-report-end">
          <p>
            Research assembled October 3, 2026 · Evidence cutoff September 30,
            2026 · Measurement dates shown with every figure.
          </p>
          <div>
            <Link href="/contact?topic=Small%20business%20report%20correction">
              Send a correction or source <ArrowUpRight size={16} />
            </Link>
            <Link href="/business">
              Explore business support <ArrowUpRight size={16} />
            </Link>
            <Link href="/deep-dives/maker-economy">
              Read the maker economy investigation <ArrowUpRight size={16} />
            </Link>
          </div>
        </div>
      </Chapter>
    </article>
  );
}
