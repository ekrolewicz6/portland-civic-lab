import type { ReactNode } from "react";
import Link from "next/link";
import {
  ArrowDown,
  ArrowUpRight,
  BookOpen,
  Download,
  HeartPulse,
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
    "Half the jobs in the Portland area are at companies with fewer than 500 employees. See what those businesses do, what they pay, what gets in their way and whether the help on offer is working.",
  path: "/deep-dives/small-business",
  type: "article",
});

const chapters = [
  ["picture", "Big picture"],
  ["size", "How small?"],
  ["businesses", "Industries"],
  ["peers", "Other metros"],
  ["recovery", "Since 2019"],
  ["livelihoods", "Making a living"],
  ["dynamics", "Openings and closings"],
  ["friction", "Obstacles"],
  ["support", "The help"],
  ["future", "A better system"],
  ["priorities", "What to decide"],
  ["evidence", "Sources"],
];

const supportRows: { who: ReactNode; does: string; proof: string }[] = [
  {
    who: <Source id="osb-site">Office of Small Business</Source>,
    does: "Points a business to the right service or city bureau.",
    proof:
      "Problems solved, fewer repeat calls and less time from first contact to an answer.",
  },
  {
    who: (
      <Source id="ibrn-2025">
        Inclusive Business Resource Network and community groups
      </Source>
    ),
    does: "Advice, training, trusted relationships and referrals to specialists.",
    proof:
      "Tasks finished and stronger owner finances, compared with similar businesses that got no help.",
  },
  {
    who: (
      <>
        <Source id="meso-site">MESO</Source> /{" "}
        <Source id="livelihood-site">Livelihood NW</Source> /{" "}
        <Source id="sbdc-site">SBDCs</Source>
      </>
    ),
    does: "Different mixes of advice, training and loans.",
    proof:
      "For each service: who qualifies, who follows through, what it costs and what changes. A client who uses several should be counted once.",
  },
  {
    who: <Source id="prosper-loans">Loans and grants</Source>,
    does: "Fill a financing gap, or pay for something the public benefits from.",
    proof:
      "Investment that would not have happened otherwise, repayment the owner can afford, and a clear answer on who ends up with the benefit.",
  },
  {
    who: <Source id="port-procurement">Public contracting</Source>,
    does: "Connects capable firms with government contracts.",
    proof:
      "Contracts actually won, how fast they are paid, whether the margins hold up and whether firms win again.",
  },
  {
    who: <Source id="city-permits">Permits and basic city services</Source>,
    does: "Make it predictable and practical to operate legally.",
    proof:
      "Time from start to finish, less redone work, safety and services that show up.",
  },
];

const aiRows = [
  [
    "Bookkeeping",
    "Sort documents, suggest categories and flag missing records.",
    "The owner confirming the entries, an accountant’s review, tax decisions and accurate records to begin with.",
  ],
  [
    "Cash-flow planning",
    "Build what-if scenarios from invoices, regular bills and timing.",
    "Judging future demand, negotiating with creditors, and the cash itself.",
  ],
  [
    "Bidding on contracts",
    "Find relevant bids, summarize the requirements and build a checklist.",
    "The capacity to do the work, certification, bonding, fair purchasing rules and payment on time.",
  ],
  [
    "Applications and grants",
    "Reuse verified facts, draft answers, check for gaps and translate.",
    "Clear eligibility rules, simpler forms, open selection and enough funding.",
  ],
  [
    "Permits",
    "Explain the documented steps and assemble a complete package.",
    "Official interpretations, inspections, professional design and fixing the process itself.",
  ],
  [
    "Marketing and sales",
    "Draft materials, improve accessibility and help follow up with customers.",
    "An offer that stands out, real trust and customers with money to spend.",
  ],
];

const scorecard = [
  [
    "A predictable start",
    "How long it takes to get from a complete application to opening day or a final decision, for the typical case and for the slowest tenth.",
    "Count projects that were abandoned. Note how complex each one was, how much of the time was the applicant’s, and the safety results.",
  ],
  [
    "Help that finishes the task",
    "How many more problems get solved because of the help, and what each one costs.",
    "Needs independent quality checks and a fair comparison group.",
  ],
  [
    "An income owners can live on",
    "What owners earn per hour worked, what they have saved, how much their income swings and how much risk the household carries.",
    "Measure costs and hours. Include businesses that closed and owners who did not answer.",
  ],
  [
    "Jobs worth having",
    "Hourly pay, benefits, steady hours, how long people stay and whether they move up.",
    "Compare similar industries, jobs and workers.",
  ],
  [
    "Opportunity people can reach",
    "For each group a program is meant to serve: who knows about it, who applies, who is turned down, who gives up and how they fare.",
    "Compare with the right group, offer help in people’s languages and protect privacy when groups are small.",
  ],
  [
    "A productive local economy",
    "Value added where it can be measured, customer demand, growth among suppliers and services people use.",
    "Subtract business taken from competitors, gains captured by landlords and costs that fall on residents.",
  ],
];

function Split({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="sb-split">
      <h3>{title}</h3>
      <div className="sb-prose">{children}</div>
    </div>
  );
}

export default function SmallBusinessPage() {
  return (
    <article className="sb-report">
      <section className="sb-hero">
        <div className="sb-wrap">
          <div className="sb-hero-kicker">
            <Link href="/deep-dives">Portland Civic Lab / Deep dives</Link>
            <span>The state of small business · 2026</span>
          </div>
          <div className="sb-hero-grid">
            <div className="sb-hero-copy">
              <h1>
                Portland loves its small businesses.{" "}
                <em>How well does it help them?</em>
              </h1>
              <p className="sb-hero-deck">
                About half the jobs in the Portland area are at companies with
                fewer than 500 employees. We looked at what those businesses do,
                what they pay, what gets in their way and whether the help on
                offer is working.
              </p>
              <a href="#picture" className="sb-hero-link">
                Start with the big picture <ArrowDown size={18} />
              </a>
            </div>
            <div className="sb-hero-viz">
              <div className="sb-hero-viz-top">
                <span>Portland metro area</span>
                <span>Census · 2022</span>
              </div>
              <div className="sb-hero-stat">
                50.2<span>%</span>
              </div>
              <p>
                of jobs are at companies with fewer than 500 employees. Those
                companies account for a smaller share of pay and sales.
              </p>
              <div className="sb-hero-bars">
                {[
                  { label: "Jobs", value: 50.2 },
                  { label: "Pay", value: 41.0 },
                  { label: "Sales", value: 35.4 },
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
              <p className="sb-hero-source">
                Portland–Vancouver–Hillsboro metro area. Counts only businesses
                that have employees. Sales are not the same thing as GDP.{" "}
                <Source id="susb-msa-2022">Source</Source>
              </p>
            </div>
          </div>
          <div className="sb-hero-footer">
            <span>Data through September 30, 2026</span>
            <span>
              Every chart says whether it covers the city, the county or the
              metro area
            </span>
            <a href="#evidence">Sources and data downloads ↓</a>
          </div>
        </div>
      </section>
      <ReadingNav chapters={chapters} />

      <Chapter
        id="picture"
        number="01"
        label="The big picture"
        title="Counting businesses is easy. Knowing how they’re doing is harder."
        intro={
          <p>
            A restaurant is a small business. So is a therapist’s practice, a
            subcontractor, a home-care provider, a design studio, a repair shop
            and a consultant working alone. Some owners want to grow. Others
            want a steady income and control over their own time.
          </p>
        }
      >
        <div className="sb-editorial-grid">
          <div className="sb-prose">
            <p>
              We set out to answer a plain question: is Portland a good place to
              make a living from a small business? Public data answers part of
              it. We can see how many jobs small companies provide, what
              industries they are in and how the years since 2019 have gone.
            </p>
            <p>
              We can see very little about what owners take home, or whether the
              help the city offers has solved anyone’s problem. That gap is also
              an opening. Portland could make it easier to get from a workable
              idea to a workable living, and then check whether it did.
            </p>
          </div>
          <aside className="sb-reading-key">
            <p className="sb-eyebrow">Where the numbers come from</p>
            <div>
              <span className="sb-status-dot" />
              <p>
                <strong>Federal data</strong>Most charts use counts from the
                Census Bureau and the Bureau of Labor Statistics.
              </p>
            </div>
            <div>
              <span className="sb-status-dot sb-amber" />
              <p>
                <strong>City and agency reports</strong>Prosper Portland and the
                Office of Small Business publish their own totals. We quote them
                but could not check them against the records behind them.
              </p>
            </div>
            <div>
              <span className="sb-status-dot sb-outline" />
              <p>
                <strong>Our proposals</strong>The ideas in the last chapters are
                ours. They are things to test, and nobody has tested them yet.
              </p>
            </div>
          </aside>
        </div>
        <div className="sb-takeaways">
          <a href="#peers">
            <span>Finding 1</span>
            <strong>
              Small companies employ a bigger share of workers here than in most
              similar metro areas.
            </strong>
            <p>
              Half of Portland-area jobs are at companies with fewer than 500
              employees. Of the eight metro areas we compared, only Sacramento’s
              share is higher.
            </p>
            <ArrowDown />
          </a>
          <a href="#livelihoods">
            <span>Finding 2</span>
            <strong>
              We found no local data on whether business owners are making a
              living.
            </strong>
            <p>
              Sales, payroll and survival each show part of the picture. None of
              them shows what an owner keeps after expenses.
            </p>
            <ArrowDown />
          </a>
          <a href="#support">
            <span>Finding 3</span>
            <strong>
              The city reports how many businesses it helps, but not how many
              problems got solved.
            </strong>
            <p>
              The Office of Small Business reported serving 759 businesses in
              its first year. Its report describes activity. It does not show
              how often the help fixed the problem.
            </p>
            <ArrowDown />
          </a>
        </div>
        <Figure
          number="01"
          title="The city, the county and the metro area are three different places."
          subtitle="Our questions are about the city of Portland. The most detailed data on company size covers the whole metro area, so we show which place each number describes."
          sources={["prosper-insights", "susb-county-2022", "susb-msa-2022"]}
          note="These three numbers measure different places and different things, so they should not be compared with each other. Every chart below names the place and year it covers."
        >
          <div className="sb-geographies">
            <div>
              <span className="sb-geo-label">City of Portland</span>
              <strong>112,411</strong>
              <p>
                jobs at small businesses in 2024, as reported by Prosper
                Portland
              </p>
              <small>
                The closest match to city policy. The report is not clear about
                how it defines a small business.
              </small>
            </div>
            <div>
              <span className="sb-geo-label">Multnomah County</span>
              <strong>439,591</strong>
              <p>jobs at businesses with employees in 2022</p>
              <small>
                Includes places outside Portland and leaves out the parts of
                Portland that sit in other counties.
              </small>
            </div>
            <div>
              <span className="sb-geo-label">Portland metro area</span>
              <strong>1,084,535</strong>
              <p>jobs at businesses with employees in 2022</p>
              <small>
                The whole regional job market, including Vancouver and
                Hillsboro. Most of our size comparisons use it.
              </small>
            </div>
          </div>
        </Figure>
      </Chapter>

      <Chapter
        id="size"
        number="02"
        label="What counts as small"
        title="How small is small?"
        intro={
          <p>
            It depends on where you draw the line. Count only companies with
            fewer than 20 employees, and small business is about one job in
            five. Count every company with fewer than 500, and it is one job in
            two.
          </p>
        }
      >
        <Split title="We use two cutoffs, and neither is official.">
          <p>
            The Census Bureau publishes figures for companies with fewer than 20
            employees and for companies with fewer than 500, so we show both.
            Neither is a legal definition. Grant and loan programs set their own
            rules, often by industry, revenue, ownership or location.
          </p>
          <p>
            The Census counts the whole company. A shop with ten workers that
            belongs to a national chain is counted with the chain, as a large
            company. The Census also uses the word “receipts” for what a
            business takes in. We call that sales.
          </p>
        </Split>
        <Figure
          number="02"
          title="Small companies have half the jobs and a smaller share of the money."
          subtitle="Portland metro area, 2022. Each number is a share of the total for all businesses with employees."
          sources={["susb-msa-2022", "susb-method"]}
          download="metro-size-2022.csv"
          note="Jobs are counted in mid-March. Pay and sales cover the full year. The Census Bureau slightly alters some figures to protect individual businesses, so we round them here. The download keeps the Census flags."
        >
          <ContributionChart />
        </Figure>
        <Figure
          number="03"
          title="About half of all jobs are at companies with 500 or more employees."
          subtitle="Portland metro area, 2022. Jobs at businesses with employees, by the size of the whole company."
          sources={["susb-msa-2022"]}
          download="metro-size-2022.csv"
          note="The six groups add up to 1,084,535 jobs. The under-20 and under-500 cutoffs used elsewhere overlap, so they should not be added together."
        >
          <SizeBands />
        </Figure>
        <div className="sb-editorial-grid">
          <div className="sb-prose">
            <h3>Why the money is split less evenly than the jobs</h3>
            <p>
              Companies with fewer than 500 employees have 50.2% of the jobs,
              41.0% of the pay and 35.4% of the sales. One reason is that large
              and small companies tend to be in different lines of work.
              Industries differ in what they pay, how many hours people work and
              how much equipment and material a business has to buy.
            </p>
            <p>
              These totals don’t show that any one small business is badly run,
              or that a large company does more good. They do show why “most of
              our businesses are small” is a weak argument for a subsidy. A
              count of businesses treats a one-person practice and a large
              employer as one each. Jobs, what owners earn, what the business
              provides and what the subsidy costs all belong in the decision.
            </p>
          </div>
          <div className="sb-gdp-card">
            <p className="sb-eyebrow">A number we can’t give you</p>
            <h3>What share of Portland’s economy comes from small business?</h3>
            <div className="sb-gdp-symbol" aria-hidden="true">
              ?
            </div>
            <p>
              <strong>We could not find a reliable answer for the city.</strong>{" "}
              GDP measures the value a business adds, which is different from
              its sales or its headcount. The federal Bureau of Economic
              Analysis published experimental small-business estimates and no
              longer produces them regularly.{" "}
              <Source id="bea-small">The bureau’s notice</Source>
            </p>
            <a href="/data/small-business/gdp-feasibility.md" download>
              Download our memo on estimating it <Download size={15} />
            </a>
          </div>
        </div>
        <details className="sb-deep-detail">
          <summary>How someone could estimate the GDP share</summary>
          <div className="sb-prose">
            <p>
              Start with total economic output for the area. Work industry by
              industry, estimating how much of each industry’s output comes from
              small companies, using pay, production and income data that line
              up with each other. Estimate businesses with no employees
              separately. Set aside government, housing and anything that can’t
              be assigned, so the leftover is not counted as “big business.”
              Then test how far the answer moves when the assumptions change.
            </p>
            <p>
              The shortcuts don’t work. Applying the national small-business
              share to Portland’s GDP only repeats the national answer. Using
              the local share of jobs assumes small and large companies are
              equally productive, which is the thing we are trying to find out.
            </p>
            <p>
              An estimate like this could be useful if it came with a range and
              was clearly labeled as a model.
            </p>
          </div>
        </details>
      </Chapter>

      <Chapter
        id="businesses"
        number="03"
        label="What the businesses do"
        title="Restaurants and shops are only the part you can see."
        intro={
          <p>
            Health care employs more people here than any other industry.
            Construction, professional services and people who work for
            themselves deserve as much attention as restaurants and retail.
          </p>
        }
      >
        <Figure
          number="04"
          title="Health care, retail and manufacturing employ the most people."
          subtitle="Portland metro area, 2022. Every business with employees, grouped by industry."
          sources={["susb-msa-2022"]}
          download="metro-sectors-2022.csv"
          note="Jobs are counted in mid-March. Pay is the total for the year."
        >
          <IndustryExplorer />
        </Figure>
        <div className="sb-three-col sb-editorial-cards">
          <div>
            <HeartPulse />
            <h3>Care and other essential services</h3>
            <p>
              A clinic, a childcare provider or a home-care business is valuable
              because people can get to it and count on it. If it grows while
              families can’t afford it or staff keep leaving, the growth has
              missed the point.
            </p>
          </div>
          <div>
            <Wrench />
            <h3>Manufacturing and the trades</h3>
            <p>
              A fabricator or contractor needs space, equipment, power, skilled
              workers, customers and cash to cover costs until the customer
              pays. A marketing workshop helps with one of those.
            </p>
          </div>
          <div>
            <BookOpen />
            <h3>Professional and independent work</h3>
            <p>
              A professional practice can sell to clients far outside the region
              and needs very little space. What runs short is reputation,
              contracts, specialized skill and the owner’s time.
            </p>
          </div>
        </div>
        <div className="sb-stat-banner">
          <div>
            <strong>77,829</strong>
            <span>businesses with no employees</span>
          </div>
          <p>
            That is how many Multnomah County businesses filed taxes in 2023
            without a single paid employee. Together they took in{" "}
            <strong>$4.27 billion</strong>. None of them appear in the charts
            above, which count only businesses with employees.{" "}
            <Source id="nes-2023">Census Bureau</Source>
          </p>
        </div>
        <Figure
          number="05"
          title="Businesses with no employees are most common in professional services, transportation and the arts."
          subtitle="Multnomah County, 2023. The ten largest industries by the measure you choose."
          sources={["nes-2023", "nes-method"]}
          download="nonemployer-sectors-2023.csv"
          note="The Census places each business by its mailing address, which may not be where the work happens. The count includes side businesses. Sales are before expenses, so they are not what the owner earned."
        >
          <NonemployerChart />
        </Figure>
        <Split title="A business with no employees is still someone’s job.">
          <p>
            The owner does the selling, the work, the bookkeeping and the
            customer service, sometimes on top of another job. Helping these
            businesses can raise someone’s income and independence even if they
            never hire anyone.
          </p>
          <p>
            More of these businesses is not always good news. It can mean people
            are piecing together income after losing steady work, and the counts
            can’t tell us which.
          </p>
          <p>
            We also can’t add these 77,829 businesses to the metro numbers above
            to get a total for “Portland’s businesses.” The places, the years
            and the things being counted are all different.
          </p>
        </Split>
      </Chapter>

      <Chapter
        id="peers"
        number="04"
        label="How we compare"
        title="Small companies matter more here. Is that a strength?"
        intro={
          <p>
            Among nine metro areas, only Sacramento has a bigger share of its
            jobs at companies with fewer than 500 employees. When we give every
            metro the same mix of industries, Portland comes out on top. What
            that says about the economy is a judgment call.
          </p>
        }
      >
        <Figure
          number="06"
          title="Only Sacramento has a bigger share of jobs at small companies."
          subtitle="Nine U.S. metro areas, 2022. Share at companies below the size you choose."
          sources={["susb-msa-2022"]}
          download="metro-industry-standardized-2022.csv"
          note="The industry adjustment covers 19 broad industries and leaves out a small “unclassified” group, which is 0.006% of Portland jobs."
        >
          <PeerComparison />
        </Figure>
        <div className="sb-two-col sb-argument-cards">
          <div>
            <span className="sb-eyebrow">It could be a strength</span>
            <h3>Many people here can own something.</h3>
            <p>
              A high share may mean it is possible to start small in Portland.
              It may reflect networks of specialized suppliers, professional
              practices and services that neighborhoods use. Those benefits are
              real even when a business never becomes a national brand.
            </p>
          </div>
          <div>
            <span className="sb-eyebrow">It could be a weakness</span>
            <h3>There may be too few big employers or good jobs.</h3>
            <p>
              The same share can be high because the region has fewer large
              employers, because businesses here struggle to grow, or because
              people start businesses when they can’t find good paid work. The
              number alone can’t tell us which.
            </p>
          </div>
        </div>
        <Figure
          number="07"
          title="Portland is a little above the figure for all U.S. metro areas."
          subtitle="Every U.S. metro area, 2022. Share of jobs at companies with fewer than 500 employees."
          sources={["susb-msa-2022"]}
          download="all-metro-context-2022.csv"
          note="Across all 387 metro areas in the Census file, 47.5% of jobs are at companies with fewer than 500 employees. That figure covers metro areas only, so it is different from a national total."
        >
          <MetroContext />
        </Figure>
        <Split title="A business that outgrows “small” is a success.">
          <p>
            If a Portland company grows past 500 employees, small-business
            policy has not failed. Large employers buy from small suppliers, pay
            wages that customers spend locally and train people who later start
            companies of their own. Small companies help large ones adapt and
            reach specialized markets. Each can also hurt the other, through
            market power or slow payment.
          </p>
          <p>
            The eight other metros are different kinds of places. Seattle has
            very large technology employers. Sacramento has a large public
            sector. Austin and Salt Lake City have grown along their own paths.
            Adjusting for industry mix removes one of those differences and
            leaves the rest. Government jobs are not in this data at all.
          </p>
        </Split>
        <Note title="One widely cited report gives two different numbers.">
          <p>
            The Portland Metro Chamber’s 2023 report, with analysis by
            ECONorthwest, says small businesses account for <strong>20%</strong>{" "}
            of metro jobs in its summary and <strong>28%</strong> in its main
            text. It defines small as 1 to 50 employees. We show both numbers
            because we can’t tell which is right. Neither can be swapped in for
            the Census figures above, which use a different definition.{" "}
            <Source id="chamber-2023">Read the report</Source>
          </p>
        </Note>
      </Chapter>

      <Chapter
        id="recovery"
        number="05"
        label="Since 2019"
        title="There is no single Portland recovery."
        intro={
          <p>
            Jobs at small businesses inside the city were up a little between
            2019 and 2024. Private-sector jobs across Multnomah County were down
            7% between 2019 and 2025. The two numbers cover different places,
            businesses and years, so they don’t contradict each other.
          </p>
        }
      >
        <Figure
          number="08"
          title="Small-business jobs in the city grew 3.3% from 2019 to 2024."
          subtitle="City of Portland. Jobs at small businesses in 2019 and 2024, as reported by Prosper Portland."
          sources={["prosper-insights"]}
          download="city-small-employment-report-2019-2024.csv"
          note="From Prosper Portland’s Insights & Indicators 2025, Figure 1.06, PDF page 17. The report describes these businesses as having 1 to 20 employees in one place and 1 to 19 in another, and it is unclear whether it counts whole companies or individual locations. We have not seen the city data behind the figure."
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
              +3.3%<span>change</span>
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
            Both bars start at zero and use the same scale. Two yearly totals
            can’t show which businesses survived, or how small businesses
            compare with large ones inside the city.
          </p>
        </Figure>
        <div className="sb-stat-banner sb-rust-banner">
          <div>
            <strong>−7.0%</strong>
            <span>private-sector jobs in Multnomah County, 2019 to 2025</span>
          </div>
          <p>
            The county went from <strong>447,067 to 415,659</strong>{" "}
            private-sector jobs, measured as a yearly average. Health care grew.
            Manufacturing, retail, and hotels and restaurants were all still
            below 2019.{" "}
            <Source id="qcew-2025">Bureau of Labor Statistics</Source>
          </p>
        </div>
        <Figure
          number="09"
          title="Thirteen of 18 industries had fewer jobs in 2025 than in 2019."
          subtitle="Multnomah County, private-sector jobs. Each circle is an industry. Farther right means it added jobs. Higher means it is a bigger part of the economy here than nationally."
          sources={["qcew-2019", "qcew-2025", "qcew-method"]}
          download="qcew-sectors-2019-2025.csv"
          note="The vertical scale compares an industry’s share of county jobs with its share of U.S. jobs. Above 1.0 means the industry is a bigger part of the economy here. It says nothing about productivity. Pay is the yearly average across all jobs in the industry and is not adjusted for inflation. Businesses of every size are included. The chart shows the 18 industries with more than 1,000 jobs in the county."
        >
          <SectorMatrix />
        </Figure>
        <div className="sb-three-col sb-editorial-cards">
          <div>
            <span className="sb-card-number">+11.6%</span>
            <h3>Health care</h3>
            <p>
              Health care added jobs while most industries lost them. That could
              reflect unmet need, an aging population or large systems buying up
              practices. It doesn’t tell us whether owning a health care
              business got any easier.
            </p>
          </div>
          <div>
            <span className="sb-card-number sb-negative">−20.8%</span>
            <h3>Manufacturing</h3>
            <p>
              The county lost about one manufacturing job in five. We would need
              data on individual plants to know how much came from closures,
              automation, moves out of the county or falling demand.
            </p>
          </div>
          <div>
            <span className="sb-card-number sb-negative">−14.8%</span>
            <h3>Hotels and restaurants</h3>
            <p>
              The businesses most tied to Portland’s image had fewer jobs than
              in 2019. New openings matter less than whether customers have come
              back and whether the margins work.
            </p>
          </div>
        </div>
        <p className="sb-section-source">
          Our calculations from Bureau of Labor Statistics county data. These
          figures cover businesses of every size and do not measure the effect
          of any policy.
        </p>
      </Chapter>

      <Chapter
        id="livelihoods"
        number="06"
        label="Making a living"
        title="Can people make a decent living?"
        intro={
          <p>
            This is the question that matters most, and it is where public data
            is weakest. Some datasets show what a business takes in. Almost none
            show what the owner keeps, how many unpaid hours went into it or how
            secure the household is.
          </p>
        }
      >
        <div className="sb-editorial-grid">
          <div className="sb-prose">
            <h3>What counts is what’s left.</h3>
            <p>
              Sales have to cover materials, rent, wages, insurance, software
              and everything else before the owner is paid. A business with
              impressive sales can leave very little for the owner’s household.
              A small professional practice can leave more from far less.
            </p>
            <p>
              Then there is time and risk. How many unpaid hours did the owner
              put in? Did a partner’s job provide the health insurance? Did the
              owner personally guarantee the loan? Did the family cover months
              of losses? Owning a business can bring freedom and flexibility. It
              can also push risk and unpaid work onto a family.
            </p>
            <p>
              Research finds that owners want different things, and many don’t
              intend to grow much. A good program helps people choose a path
              that works, which sometimes means deciding not to open.{" "}
              <Source id="owner-goals">Hurst & Pugsley</Source>
            </p>
          </div>
          <aside className="sb-question-card">
            <span className="sb-eyebrow">What nobody measures locally</span>
            <h3>What kind of life does owning a business pay for?</h3>
            <ul>
              <li>Income after expenses</li>
              <li>Hours worked by the owner and family</li>
              <li>How much income swings, and how much debt there is</li>
              <li>Benefits and savings</li>
              <li>Whether it was a choice, and whether they’d do it again</li>
            </ul>
            <a href="/data/small-business/fieldwork-kit.md" download>
              Download our interview and records-request kit ↓
            </a>
          </aside>
        </div>
        <Figure
          number="10"
          title="The same sales can leave very different take-home pay."
          subtitle="A calculator with made-up numbers. Move the sliders to see what is left for the owner."
          sources={["nes-method"]}
          note="This does not estimate a typical Portland business’s margin, tax bill or hourly pay."
        >
          <OwnerCalculator />
        </Figure>
        <Figure
          number="11"
          title="The largest companies pay the most per job."
          subtitle="Portland metro area, 2022. Total yearly pay divided by the number of jobs in mid-March, by company size."
          sources={["susb-msa-2022"]}
          download="metro-size-2022.csv"
          note="The gap doesn’t prove that company size causes higher pay. Testing that would mean comparing similar jobs in the same industry, with hours, benefits and worker experience taken into account."
        >
          <PayrollChart />
        </Figure>
        <Split title="Don’t forget the people who work there.">
          <p>
            A small workplace can mean close relationships, flexibility and a
            chance to learn the whole business. It can also mean unpredictable
            schedules, thin benefits, nowhere to advance and nobody to cover
            when someone is sick. Being local, or being small, doesn’t settle
            whether the jobs are good.
          </p>
          <p>
            Local data can’t compare benefits, schedules, injuries or wage
            violations by company size. That is a reason to go and ask workers.
            When the public helps a business, it should say plainly what it
            expects on job quality, in proportion to the help.
          </p>
          <p>
            A fair evaluation looks at both sides: the owner’s income and hours,
            and the employees’ pay, hours, stability and benefits. If a program
            raises sales by leaning on more unpaid owner hours or worse
            schedules for workers, the headline number overstates the win.
          </p>
        </Split>
      </Chapter>

      <Chapter
        id="dynamics"
        number="07"
        label="Openings and closings"
        title="Openings are only half the story."
        intro={
          <p>
            A healthy economy needs new businesses, room for good ones to grow
            and room for people to change course. It also needs to see the
            closures and layoffs that a positive net number hides.
          </p>
        }
      >
        <Figure
          number="12"
          title="Each year about one business location in ten is new, and nearly as many close."
          subtitle="Business locations with employees, 2019 to 2023. The chart starts with the Portland metro area. Choose another metro to compare."
          sources={["bds-msa-2023", "bds-method"]}
          download="bds-metro-2019-2023.csv"
          note="A location is one place of business, so a second branch of an existing company counts as an opening. Each rate divides the year’s openings or closings by the average number of locations in that year and the year before. The rates do not show how long new businesses survive, and some closings are moves."
        >
          <DynamicsChart />
        </Figure>
        <Figure
          number="13"
          title="Portland-area employers added 148,949 jobs in 2023 and cut 129,091."
          subtitle="Portland metro area, 2023. Companies of every size."
          sources={["bds-msa-2023", "bds-msa-age-2023"]}
          download="bds-portland-firm-age-2023.csv"
          note="The net gain was 19,858 jobs. In the table by company age, the oldest group was founded before the records begin, so its exact age is unknown."
        >
          <JobFlows />
        </Figure>
        <div className="sb-editorial-grid">
          <div className="sb-prose">
            <h3>Young and small are two different things.</h3>
            <p>
              In 2023 the Portland metro area had{" "}
              <strong>
                4,472 brand-new companies with employees, accounting for 18,724
                jobs
              </strong>
              . That is a sharper measure of new business than registrations or
              new branch locations. It still leaves out people who work for
              themselves.
            </p>
            <p>
              Research shows that the link between a company’s size and its job
              growth changes once you account for how old the company is. A
              twenty-year-old practice with three people and a two-year-old
              company hiring its tenth employee are both small. They need
              different things and are likely to contribute differently.{" "}
              <Source id="young-firms">Haltiwanger, Jarmin & Miranda</Source>
            </p>
          </div>
          <aside className="sb-note">
            <strong>Staying open isn’t always the goal.</strong>
            <p>
              A high survival rate can mean strong businesses. It can also mean
              few people are starting anything, or that existing businesses are
              shielded from competition. A business may close because it failed,
              or because the owner retired, sold it, moved or found something
              better. A serious city scorecard would record why each one closed
              and what the owner did next.
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
            Finding customers, covering cash flow and getting through a buildout
            are three different problems. Before offering more advice, find out
            which one is actually stopping the business.
          </p>
        }
      >
        <Figure
          number="14"
          title="The steps to opening depend on the kind of business."
          subtitle="Three simplified examples. Real requirements depend on what the business does and where it is."
          sources={["osb-site", "city-permits", "oregon-osba"]}
          note="These are simplified paths. They are not complete licensing checklists, and they do not measure how long permits take. The delay calculator shows what waiting costs whatever the cause. Not every delay is the government’s doing."
        >
          <BarrierJourney />
        </Figure>
        <div className="sb-two-col sb-argument-cards">
          <div>
            <p className="sb-eyebrow">Customers</p>
            <h3>A grant writer cannot create a customer.</h3>
            <p>
              In the Federal Reserve’s 2025 survey of small businesses, reaching
              customers and growing sales was the leading day-to-day challenge.
              For a neighborhood business, foot traffic, safe access, nearby
              places people want to go and repeat customers may matter more than
              another business-plan template.
            </p>
            <p>
              That survey is national and does not rank Portland’s problems.
              Local interviews should separate “I need help with marketing” from
              “the customers who used to buy this are gone.”{" "}
              <Source id="fed-employer-2026">Federal Reserve</Source>
            </p>
          </div>
          <div>
            <p className="sb-eyebrow">Money</p>
            <h3>A loan can’t fix a business that loses money.</h3>
            <p>
              Working capital can cover a late payment or a slow season. It
              can’t keep rescuing a business whose ordinary costs are higher
              than its sales. A loan also has to be repaid, and a personal
              guarantee puts the owner’s household on the hook.
            </p>
            <p>
              The financing should fit the problem: a long-term loan for
              equipment, a credit line backed by reliable invoices, a grant when
              the public gets something in return, or honest advice to stop. The
              biggest loan is not always the best result.
            </p>
          </div>
        </div>
        <Figure
          number="15"
          title="Fewer than half of the businesses that applied for financing got all of it."
          subtitle="United States, 2025 Small Business Credit Survey. Businesses with employees that applied for financing."
          sources={["fed-employer-2026"]}
          note="The survey had 6,525 responses from businesses with employees. It is weighted to resemble businesses nationally but is not a random sample, and it is not specific to Portland."
        >
          <div
            className="sb-finance-bar"
            role="img"
            aria-label="Financing applicants: 42 percent received all, 36 percent some or most, 22 percent none"
          >
            <div style={{ width: "42%" }}>
              <strong>42%</strong>
              <span>Got all of it</span>
            </div>
            <div style={{ width: "36%" }}>
              <strong>36%</strong>
              <span>Got some or most</span>
            </div>
            <div style={{ width: "22%" }}>
              <strong>22%</strong>
              <span>Got none</span>
            </div>
          </div>
          <p className="sb-chart-explainer">
            These figures leave out owners who never applied because they
            expected to be turned down. Being approved also doesn’t mean the
            amount, the interest rate or the repayment terms were right for the
            business.
          </p>
        </Figure>
        <div className="sb-editorial-grid">
          <div className="sb-prose">
            <h3>Permits should be timed from start to finish.</h3>
            <p>
              Portland’s permit dashboard reports how many applications come in,
              how many permits go out, what the projects are worth and how long
              reviews take. That is useful. But an owner lives through the whole
              path from finding a space to opening the doors: the meetings
              before applying, the redesigns, the time spent answering the
              city’s questions, approvals, construction, inspections and final
              permission to occupy.
            </p>
            <p>
              A fair measurement would follow every application, including the
              ones that were abandoned or withdrawn. It would separate the
              city’s review time from the applicant’s time and the builder’s,
              and compare similar kinds of projects. An average that covers only
              the permits that were issued leaves out everyone who gave up.{" "}
              <Source id="city-permits">City dashboard and definitions</Source>
            </p>
            <h3>Taxes cost time as well as money.</h3>
            <p>
              A business can owe very little and still spend hours working out
              which returns to file. Simpler filing, or exemptions that line up
              across governments, can help without changing any tax rate. Taxes
              also pay for services that businesses depend on, so a tax cut
              should be weighed against what it would stop paying for.
            </p>
          </div>
          <aside className="sb-tax-card">
            <p className="sb-eyebrow">One change already made</p>
            <h3>More small businesses are exempt from the city business tax</h3>
            <div>
              <span>Before 2026</span>
              <strong>Sales under $50,000</strong>
            </div>
            <div>
              <span>Tax year 2026</span>
              <strong>Under $75,000</strong>
            </div>
            <div>
              <span>From 2027</span>
              <strong>Under $100,000</strong>
            </div>
            <p>
              A business qualifies when its total sales, from everywhere it
              operates, are under the cutoff. The cutoff decides who is exempt.
              It is not a tax rate. Exempt businesses still have to file with
              the city and county every year, and other taxes have their own
              rules.
            </p>
            <Source id="city-tax-2026">Revenue Division guidance</Source>
            <Source id="city-tax-adoption-2026">April 2026 adoption</Source>
          </aside>
        </div>
        <Note title="An empty storefront isn’t always a usable one.">
          <p>
            A cheap space can turn out to be unaffordable once you add the legal
            use, seismic and accessibility work, ventilation, power, plumbing,
            insurance and the lease terms. Improvements a tenant pays for can
            also raise the value of the landlord’s building. When the public
            subsidizes a space, the deal should say who keeps the benefit and
            for how long, and protect the tenant in proportion to the subsidy.
          </p>
        </Note>
      </Chapter>

      <Chapter
        id="support"
        number="09"
        label="The help on offer"
        title="Portland offers a lot of help. Is it working?"
        intro={
          <p>
            The city’s Office of Small Business, community groups, lenders and
            public programs all offer services. Two questions come next. Can
            people who start from different places actually reach that help? And
            does it change how things turn out?
          </p>
        }
      >
        <div className="sb-three-col sb-program-stats">
          <div>
            <span>Office of Small Business</span>
            <strong>759</strong>
            <p>
              businesses served in its first year, May 2025 to May 2026, by its
              own count
            </p>
            <Source id="osb-2026">Year One report, p. 4</Source>
          </div>
          <div>
            <span>Inclusive Business Resource Network</span>
            <strong>691</strong>
            <p>
              clients in fiscal year 2024–25. This is a different program and a
              different period.
            </p>
            <Source id="prosper-insights">Table 4.14</Source>
          </div>
          <div>
            <span>Who the network serves</span>
            <strong>70%</strong>
            <p>
              of its clients identified as Black, Indigenous or people of color.
              69% were women or gender expansive.
            </p>
            <Source id="prosper-insights">Fiscal year 2024–25</Source>
          </div>
        </div>
        <p className="sb-section-source">
          These counts can’t be added together. Some businesses use more than
          one program, and nobody has counted the eligible businesses that use
          none.
        </p>
        <Figure
          number="16"
          title="Of five numbers worth knowing, the public can see one."
          subtitle="What the Office of Small Business reported for its first year, next to what would need to be measured to judge it."
          sources={["osb-2026"]}
          note="The 759 figure is from the office’s Year One report."
        >
          <SupportFunnel />
        </Figure>
        <div className="sb-editorial-grid">
          <div className="sb-prose">
            <h3>Who gets the chance to own a business?</h3>
            <p>
              Whether someone can start a business depends on savings,
              collateral, connections, language, time, health, family care and
              access to customers. A program can serve many owners from
              underrepresented groups and still miss people who never heard of
              it, couldn’t meet its conditions or gave up on the application.
            </p>
            <p>
              The network’s client figures show who its services reach. They
              don’t show who owns businesses across the city, or whether
              everyone eligible had the same access. The fair comparison is with
              the businesses and would-be owners a program is meant for.
              Comparing with the whole population hides differences in age,
              work, industry and the barriers that kept people from starting.
            </p>
            <p>
              Better evidence would combine Census data on owners, city data
              with identities protected, program records, and interviews with
              people who didn’t use the programs or were turned down. Small
              groups would need their privacy protected.
            </p>
          </div>
          <aside className="sb-question-card">
            <span className="sb-eyebrow">Who walks in the door</span>
            <h3>
              33% food service.
              <br />
              15% retail.
            </h3>
            <p>
              That is the mix of businesses the Office of Small Business served.
              It shows who asks for this kind of help and who the outreach
              reaches. It doesn’t mean a third of Portland’s businesses serve
              food.
            </p>
            <p>
              Half of the services it recorded involved Prosper Portland’s
              resources, and 7% involved access to capital. We don’t know what
              those referrals led to.
            </p>
            <Source id="osb-2026">Year One report, p. 4</Source>
          </aside>
        </div>
        <div className="sb-program-table">
          <div className="sb-table-scroll">
            <table>
              <caption>Who helps, and how we would know it worked</caption>
              <thead>
                <tr>
                  <th>Who</th>
                  <th>What they do</th>
                  <th>What would show it works</th>
                </tr>
              </thead>
              <tbody>
                {supportRows.map((r) => (
                  <tr key={r.does}>
                    <th>{r.who}</th>
                    <td data-label="What they do">{r.does}</td>
                    <td data-label="What would show it works">{r.proof}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="sb-chart-explainer">
            This is a map of who does what. It can’t tell you what you qualify
            for, so check with each provider. The Lab has no relationship with
            any of them.
          </p>
        </div>
        <Split title="Is Portland spending too much or too little?">
          <p>
            We can’t tell from the public record. Prosper Portland’s budget also
            covers real estate, workforce programs and other work. A loan is not
            the same as a grant. An approval is not the same as money paid out.
            One-time money is not the same as yearly staffing.
          </p>
          <p>
            Prosper’s 2025 report cites <strong>$37 million</strong> in grants
            and loans approved or awarded to businesses and nonprofits. That is
            not what small-business help costs in a year. A clear accounting
            would list staff and contracts, grants paid, loans made and repaid,
            guarantees, tax breaks and money passed through to other groups, and
            then match each line to the agency’s actual accounts.{" "}
            <Source id="prosper-insights">Report summary</Source>{" "}
            <Source id="prosper-acfr">
              Fiscal year 2025 financial statements
            </Source>
          </p>
          <p>
            Then ask what one more dollar would do. Is the shortage advisors,
            clear eligibility rules, a permit that holds everything up, an
            affordable buildout or customers? Each option should be compared
            with the next best use of the money, including simply running
            everyday city services well.
          </p>
        </Split>
        <div className="sb-two-col sb-argument-cards">
          <div>
            <span className="sb-eyebrow">From the City Auditor</span>
            <h3>Happy clients don’t prove a program worked.</h3>
            <p>
              The City Auditor’s review of pandemic emergency grants found
              weaknesses in how awards were decided and in the evidence on
              results. Those findings are about that program and don’t
              automatically apply to the Office of Small Business today. The
              broader lesson is to decide what success means, and who to compare
              against, before the money goes out.{" "}
              <Source id="city-audit-grants">2021 audit</Source>
            </p>
          </div>
          <div>
            <span className="sb-eyebrow">From a federal experiment</span>
            <h3>
              Training got more people to start businesses without raising what
              they earned.
            </h3>
            <p>
              Project GATE assigned people to entrepreneurship services at
              random so the results could be compared fairly. Its long-term
              report found an early rise in business ownership that faded, and
              no effect on self-employment earnings. That doesn’t settle the
              question for every Portland program. It shows why counting new
              businesses is not enough.{" "}
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
        label="A better system"
        title="Better help would finish the task, with a person in charge of it."
        intro={
          <p>
            AI can make some of the work owners now do alone cheaper and faster.
            The hard part for the public is turning that into finished, reliable
            work, and fixing the processes that shouldn’t need a helper in the
            first place.
          </p>
        }
        dark
      >
        <div className="sb-editorial-grid">
          <div className="sb-prose">
            <h3>Start with what the owner is trying to get done.</h3>
            <p>
              Picture an owner with a specific goal: open this shop, see next
              month’s cash, submit this bid or answer this tax notice. The
              service asks only for the information it needs, checks the rules
              that apply, prepares the paperwork and puts a named advisor in
              charge of the next step. The owner can see what is waiting, who
              has it and when to expect an answer.
            </p>
            <p>
              AI can draft, sort, translate, organize and check for
              inconsistencies. A qualified person still has to review anything
              with real consequences in accounting, law, licensing or lending.
              Government still makes the official decisions. The owner approves
              what gets submitted and controls who sees the business’s records.
            </p>
            <p>
              How many businesses already use AI depends on who is asking. In
              the Federal Reserve’s 2025 survey, 46% of responding businesses
              with employees said they use it, and accuracy was a leading
              concern. The Census Bureau found about 17% to 20% between December
              2025 and May 2026, using a different sample and a different
              question. Neither figure is specific to Portland.{" "}
              <Source id="fed-employer-2026">Federal Reserve</Source>{" "}
              <Source id="census-ai-2026">Census Bureau</Source>
            </p>
          </div>
          <aside className="sb-future-principle">
            <span>What we would design for</span>
            <strong>
              One place to go and one person responsible.{" "}
              <em>The owner leaves with the next step done.</em>
            </strong>
            <p>
              Measure the work finished, how often it was right and how much of
              the owner’s time it saved. A longer list of links is not a result.
            </p>
          </aside>
        </div>
        <Figure
          number="17"
          title="How the service would work, step by step."
          subtitle="Our proposal. A person stays responsible at every step."
          sources={[
            "seattle-services",
            "singapore-digital",
            "singapore-cto",
            "nyc-mycity",
          ]}
          note="These are ideas to test. They draw on existing services in Seattle, Singapore and New York and on audits of them. Those examples show how such services work. They do not prove the same thing would work in Portland."
        >
          <div className="sb-service-blueprint">
            {[
              [
                "01",
                "Understand the need",
                "The owner explains the problem in their own language, online, by phone or in person.",
                "A person checks what the real problem is, how urgent it is and what the owner qualifies for.",
              ],
              [
                "02",
                "Do the preparation",
                "Organize the records, lay out the cash flow, find bids the firm could win or fill in an application.",
                "Anything AI prepares is checked against current rules and the owner’s own records.",
              ],
              [
                "03",
                "Clear the roadblock",
                "Get the specialist’s answer, the agency’s decision or a complete submission. If none of those is possible, find another route.",
                "Named professionals and bureaus make the decisions. Software does not issue a permit.",
              ],
              [
                "04",
                "Confirm it worked",
                "Did the owner finish the task? Was it done correctly? Did it save time or money, or steady the business?",
                "Follow up after the referral and publish results without identifying anyone.",
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
              <caption>Where AI can help and where it can’t</caption>
              <thead>
                <tr>
                  <th>Task</th>
                  <th>What AI can help with</th>
                  <th>What still takes people or policy</th>
                </tr>
              </thead>
              <tbody>
                {aiRows.map(([task, ai, people]) => (
                  <tr key={task}>
                    <th>{task}</th>
                    <td data-label="What AI can help with">{ai}</td>
                    <td data-label="What still takes people or policy">
                      {people}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        <div className="sb-two-col sb-argument-cards">
          <div>
            <h3>Better applications don’t create more grant money.</h3>
            <p>
              If the pot is fixed, better applications mostly make the
              competition tougher. An application assistant should be compared
              with a shorter form, a business profile that is verified once and
              reused, clearer eligibility rules or a simpler way of choosing
              winners. Time saved for the people who don’t win counts too.
            </p>
            <p>
              The same goes for navigation. A tool that explains a confusing
              process is useful. Making the process less confusing may be worth
              more and last longer.
            </p>
          </div>
          <div>
            <h3>A wrong answer can be an expensive service.</h3>
            <p>
              The New York City Comptroller’s audit of the city’s MyCity chatbot
              documented inconsistent and inaccurate answers, and it disputed
              the city’s performance measures. Portland should test any tool on
              real tasks with independent checks, in several languages, with
              ambiguous questions and with rules that change. A task that was
              not resolved should not count as a success because the system
              replied. <Source id="nyc-mycity">NYC Comptroller</Source>
            </p>
          </div>
        </div>
        <Split title="Why doesn’t this exist already?">
          <p>
            No single institution controls the whole path. The rules sit with
            different agencies and levels of government. The data is scattered,
            each funding source has its own eligibility rules, and the group
            that refers a business often has no say over the next decision.
            Trusted community groups need steady capacity, and owners have
            little time to learn unfamiliar tools.
          </p>
          <p>
            AI makes some information work cheaper. It doesn’t change who is in
            charge of what, and it doesn’t produce affordable space, working
            capital or customers with money to spend. A system that works needs
            agreements between agencies, a budget, usable data and someone
            answerable for the cases that don’t get solved.
          </p>
          <p>
            There are tradeoffs too. A subsidized AI service could take work
            from local bookkeepers, designers and office workers. The city could
            instead hire those people to supervise and improve the service. That
            choice should be made in the open. The effects on service quality,
            workers’ income, competition and customer demand should be tracked
            along with the time owners save.
          </p>
        </Split>
        <Figure
          number="18"
          title="Three ways to spend the next dollar."
          subtitle="Three example programs with rough first-year costs. These are our scenarios and not a city budget. Move the sliders to change the assumptions."
          sources={["oecd-eval", "gate-eval"]}
          download="future-program.md"
          note="Serving more businesses improves the result only if the program solves problems that would not have been solved anyway."
        >
          <PolicyLab />
        </Figure>
      </Chapter>

      <Chapter
        id="priorities"
        number="11"
        label="What Portland should decide"
        title="Aim to be the easiest place to make a living from a business."
        intro={
          <p>
            Being the best city for small business only means something if
            owners can feel it and the city can measure it. The goal should
            reward opportunity people can reach, work that is useful and
            prosperity that lasts. A rising count of small businesses does none
            of that.
          </p>
        }
      >
        <div className="sb-scorecard">
          <div className="sb-scorecard-head">
            <span>A scorecard we propose</span>
            <span>
              These are things to measure. Nobody has a baseline yet, so there
              are no targets.
            </span>
          </div>
          <div
            className="sb-scorecard-row sb-scorecard-labels"
            aria-hidden="true"
          >
            <span />
            <span>Goal</span>
            <span>What to measure</span>
            <span>What to watch for</span>
          </div>
          {scorecard.map(([t, m, c], i) => (
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
            <p className="sb-eyebrow">First 90 days</p>
            <h3>Find out where things stand.</h3>
            <p>
              Publish one reconciled list of what is actually spent and what
              services exist. Agree on what counts as a case and what counts as
              solved. Clear up the Office of Small Business totals and the
              city’s definition of small. Talk to owners who didn’t use the
              programs, were turned down or closed. Name the two or three delays
              owners keep hitting and can’t fix on their own.
            </p>
          </div>
          <div>
            <p className="sb-eyebrow">Months 4 to 9</p>
            <h3>Run a small, fair test.</h3>
            <p>
              Choose specific tasks that come up often enough to evaluate.
              Compare today’s help, human help with AI and a simpler process.
              Decide before launch what error rate is acceptable and when a case
              goes to a person. Track cost and the owner’s effort from first
              contact to finish.
            </p>
          </div>
          <div>
            <p className="sb-eyebrow">Months 10 to 18</p>
            <h3>Publish the results and change the rules.</h3>
            <p>
              Measure results at six and twelve months, and say how many people
              didn’t respond. Expand what clearly helps. Redesign or stop what
              doesn’t. Where cases keep failing at the same point, change the
              permit, purchasing, payment or eligibility rule behind it. Keep
              the results public.
            </p>
          </div>
        </div>
        <Split title="What would change our minds">
          <p>
            If owners lose most of their time to filling out the same paperwork
            again and again, a shared back office looks better. If workable
            projects keep failing at the same city-controlled step, fixing that
            step comes first. If businesses open easily and then can’t find
            customers, the focus should move to demand, household incomes and
            the condition of business districts.
          </p>
          <p>
            If grants mostly move customers from one nearby business to another,
            the growth claimed for them should be marked down. If landlords
            capture most of a space subsidy, the program needs a new design. And
            if a trusted advisor talks an owner out of debt they can’t afford,
            or out of a business that can’t work, that is a good result even
            though no new business shows up in the statistics.
          </p>
        </Split>
        <div className="sb-closing">
          <span className="sb-eyebrow">The standard we would use</span>
          <p>
            Celebrate the business that opens.{" "}
            <em>Then ask whether the people in it can make a living.</em>
          </p>
        </div>
      </Chapter>

      <Chapter
        id="evidence"
        number="12"
        label="Sources and methods"
        title="Check our work."
        intro={
          <p>
            Every source, data file and definition we used is here. Search the
            sources, download the numbers and tell us what we got wrong.
          </p>
        }
      >
        <div className="sb-method-grid">
          <div>
            <h3>How we calculated things</h3>
            <p>
              We use four federal datasets, and each one counts something
              different. The Census Bureau’s Statistics of U.S. Businesses gives
              jobs, pay and sales by company size. Its Nonemployer Statistics
              covers businesses with no employees. The Bureau of Labor
              Statistics’ Quarterly Census of Employment and Wages gives yearly
              average jobs and pay by industry. The Census Bureau’s Business
              Dynamics Statistics tracks openings, closings and job changes.
            </p>
            <p>
              Each share is a group’s total divided by the total from the same
              source. To adjust for industry mix, we take each metro’s
              small-company share within each industry and weight it by
              Portland’s jobs in that industry. Where the Census withheld a
              number, we did not treat it as zero.
            </p>
          </div>
          <div>
            <h3>What this covers and what it doesn’t</h3>
            <p>
              This is not a count of every business in the city, and we have not
              read everything written on the subject. The list below includes
              sources we reviewed and leads we have not finished checking. Each
              one is labeled.
            </p>
            <p>
              Still missing: what owners earn, benefits by company size, how
              long city businesses survive, who wins public contracts, a sound
              city GDP figure and proof of what the programs cause. We have not
              interviewed anyone or filed public-records requests for this
              report.
            </p>
          </div>
        </div>
        <div className="sb-downloads">
          {[
            ["methodology.md", "How we measured"],
            ["sources.tsv", "Source list, first round"],
            ["claims.tsv", "Claims we checked, first round"],
            ["web-claims.tsv", "Claims added for this page"],
            ["web-sources.json", "Sources added for this page"],
            ["gdp-feasibility.md", "GDP memo"],
            ["fieldwork-kit.md", "Interview and records kit"],
            ["future-program.md", "Program cost assumptions"],
            ["webpage-methods.md", "Calculations added for this page"],
            ["raw-inputs.tsv", "Raw data links and checksums"],
            ["build-web.py", "Script that builds the page data"],
          ].map(([file, label]) => (
            <a key={file} href={`/data/small-business/${file}`} download>
              <Download size={16} />
              {label}
            </a>
          ))}
        </div>
        <details className="sb-deep-detail">
          <summary>
            Five things to keep in mind when reading the numbers
          </summary>
          <ol>
            <li>
              <strong>Place.</strong> The city, the county and the metro area
              have different boundaries. A Portland mailing address does not
              mean a business is inside the city.
            </li>
            <li>
              <strong>What is being counted.</strong> A registered business may
              not be operating. A location is not a company. A job is not a
              full-time worker. Sales are not profit and are not GDP.
            </li>
            <li>
              <strong>Dates.</strong> Each chart uses the year its data was
              collected, and the newest year differs by source. Pay figures are
              not adjusted for inflation, so they can’t show real gains.
            </li>
            <li>
              <strong>Cause and effect.</strong> Businesses choose to join
              programs, some results would have happened anyway, and surveys
              miss the people who don’t answer. A claimed effect needs something
              to compare against.
            </li>
            <li>
              <strong>Loose ends.</strong> Official reports sometimes contradict
              themselves. The Office of Small Business totals, the Chamber’s 20%
              and 28%, and the city’s definition of small stay flagged here
              until someone resolves them.
            </li>
          </ol>
        </details>
        <EvidenceLibrary />
        <div className="sb-report-end">
          <p>
            Published October 3, 2026, using sources available through September
            30, 2026. Each figure shows the year its data was collected.
          </p>
          <div>
            <Link href="/contact?topic=Small%20business%20report%20correction">
              Send a correction or a source <ArrowUpRight size={16} />
            </Link>
            <Link href="/business">
              Find funding for a Portland small business{" "}
              <ArrowUpRight size={16} />
            </Link>
            <Link href="/deep-dives/maker-economy">
              Read our report on the maker economy <ArrowUpRight size={16} />
            </Link>
          </div>
        </div>
      </Chapter>
    </article>
  );
}
