import type { Metadata } from "next";
import Link from "next/link";
import { pageMeta } from "@/lib/page-meta";
import { DIVE_CONTAINER, Section } from "@/components/deep-dives/shared";
import { SOURCES, HEADLINE, FTE_BY_FUNCTION, type Source } from "@/lib/pps-budget/data";
import { DEBATES, CASE_FILE } from "@/lib/pps-budget/arguments";
import TheWholeStory from "@/components/deep-dives/pps-budget/TheWholeStory";
import MoneyDecomposition from "@/components/deep-dives/pps-budget/MoneyDecomposition";
import DecadeSpine from "@/components/deep-dives/pps-budget/DecadeSpine";
import LevyLeak from "@/components/deep-dives/pps-budget/LevyLeak";
import HomeownerCalculator from "@/components/deep-dives/pps-budget/HomeownerCalculator";
import EmptyChair from "@/components/deep-dives/pps-budget/EmptyChair";
import BondLedger from "@/components/deep-dives/pps-budget/BondLedger";
import EsserCliff from "@/components/deep-dives/pps-budget/EsserCliff";
import WasteVerdicts from "@/components/deep-dives/pps-budget/WasteVerdicts";
import PlanDecisions from "@/components/deep-dives/pps-budget/PlanDecisions";
import CannotKnow from "@/components/deep-dives/pps-budget/CannotKnow";
import DoctrineCard from "@/components/deep-dives/pps-budget/DoctrineCard";
import Tripwires from "@/components/deep-dives/pps-budget/Tripwires";
import Debate from "@/components/deep-dives/pps-budget/Debate";
import ReadingProgress from "@/components/deep-dives/venues/ReadingProgress";

export const metadata: Metadata = pageMeta({
  title: "Where the next dollar goes: the PPS budget, examined",
  description:
    "Portland Public Schools cut teachers while its budget hit $2.77 billion, and both facts are true. Eleven years of budget books, every audit, and the district's own watchdogs, read so you don't have to. Plus the ten decisions that would change it, red-teamed until they survived.",
  path: "/deep-dives/pps-budget",
  type: "article",
});

const NAV = [
  { id: "salems-machine", label: "Salem's machine" },
  { id: "the-levy-leak", label: "The levy leak" },
  { id: "the-empty-chair", label: "The empty chair" },
  { id: "the-decade", label: "The decade" },
  { id: "where-it-goes", label: "Where it goes" },
  { id: "empty-seats", label: "Empty seats" },
  { id: "waste", label: "The waste exam" },
  { id: "arguments", label: "Four arguments" },
  { id: "cannot-know", label: "What we can't know" },
  { id: "the-plan", label: "The plan" },
  { id: "watch", label: "What to watch" },
  { id: "doctrine", label: "The doctrine" },
  { id: "method", label: "Method" },
];

function Src({ id }: { id: keyof typeof SOURCES }) {
  const s = SOURCES[id];
  return (
    <a
      href={s.url}
      target="_blank"
      rel="noopener noreferrer"
      className="text-[var(--color-canopy)] underline decoration-[var(--color-sage)]/50 underline-offset-2 hover:decoration-[var(--color-canopy)]"
    >
      {s.org}
    </a>
  );
}

function dedupeSources(): Source[] {
  const all = Object.values(SOURCES) as Source[];
  const byUrl = new Map<string, Source>();
  for (const s of all) if (!byUrl.has(s.url)) byUrl.set(s.url, s);
  const rank = { primary: 0, statute: 1, analysis: 2, news: 3 } as const;
  return [...byUrl.values()].sort(
    (a, b) => (rank[a.kind] ?? 9) - (rank[b.kind] ?? 9) || a.org.localeCompare(b.org),
  );
}

function IndependenceNote() {
  return (
    <div className="mt-6 rounded-sm border border-[var(--color-parchment)] bg-[var(--color-paper-warm)] p-5">
      <div className="h-[2px] w-8 bg-[var(--color-ember)]" />
      <p className="mt-3 font-mono text-[10px] uppercase tracking-[0.18em] text-[var(--color-ember)]">
        Where we stand
      </p>
      <p className="mt-2 text-[13.5px] leading-relaxed text-[var(--color-ink-light)]">
        Portland Civic Lab is unaffiliated with and unfunded by PPS, any employee union, any
        contractor or vendor named on this page, and any campaign. Every number traces to a public
        document; press-only figures are labeled press; the judgments are ours and labeled. Our
        standing disclosures live on the{" "}
        <Link href="/independence" className="font-semibold text-[var(--color-canopy)] hover:underline">
          Independence page
        </Link>
        , and corrections are invited and logged.
      </p>
    </div>
  );
}

function Prose({ children }: { children: React.ReactNode }) {
  return (
    <div className="max-w-3xl space-y-4 text-[15px] leading-relaxed text-[var(--color-ink-light)] [&_strong]:text-[var(--color-ink)]">
      {children}
    </div>
  );
}

export default function PpsBudgetPage() {
  return (
    <article className="bg-[var(--color-paper)]">
      {/* ── hero ── */}
      <header className="noise-overlay relative overflow-hidden bg-[var(--color-canopy)] py-16 text-white sm:py-20">
        <div className={`relative z-10 ${DIVE_CONTAINER}`}>
          <div className="grid gap-10 xl:grid-cols-[minmax(0,1fr)_minmax(300px,380px)]">
            <div>
              <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-[var(--color-ember-bright)]">
                <Link href="/deep-dives" className="hover:text-white">Policy deep-dive</Link> ——— Schools &amp; public money
              </p>
              <h1 className="mt-5 font-editorial-normal text-[40px] leading-[1.05] sm:text-[56px] xl:text-[64px]">
                Where the next dollar goes.
                <span className="block font-editorial italic text-[var(--color-ember-bright)]">
                  And the ten decisions that would change it.
                </span>
              </h1>
              <p className="mt-6 max-w-2xl text-[17px] leading-relaxed text-white/75">
                Portland Public Schools just eliminated 322 positions, its sixth straight year of
                cuts, in the same season its headline budget reached $2.77 billion, the largest in
                its history. Both facts are true, no public document explains how, and every fight
                in the city runs on the confusion. We read eleven years of budget books, every
                audit, and the district&apos;s own watchdogs so you don&apos;t have to. Here is
                what actually decides whether a dollar reaches a student, where money is
                demonstrably doing less than it could, and the ten decisions, attacked by seven
                hostile reviewers until they survived, that would change it.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <a
                  href="#the-plan"
                  className="rounded-sm bg-[var(--color-ember)] px-5 py-3 text-[15px] font-semibold text-[var(--color-canopy)] hover:bg-[var(--color-ember-bright)]"
                >
                  Skip to the plan
                </a>
                <a
                  href="#the-levy-leak"
                  className="rounded-sm border border-white/25 px-5 py-3 text-[14px] font-semibold text-white hover:bg-white/10"
                >
                  See where your levy goes
                </a>
              </div>
            </div>

            <aside className="hidden rounded-sm border border-white/15 bg-white/[0.04] p-6 xl:block">
              <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-[var(--color-ember-bright)]">
                How to read this page
              </p>
              <dl className="mt-4 space-y-4">
                <div>
                  <dt className="text-[14px] font-semibold text-white">First, the rules</dt>
                  <dd className="mt-1 text-[14px] leading-relaxed text-white/65">
                    Most of what Portlanders blame the district for was decided in Salem in the
                    1990s. Knowing which is which is the whole game.
                  </dd>
                </div>
                <div>
                  <dt className="text-[14px] font-semibold text-white">Then, the record</dt>
                  <dd className="mt-1 text-[14px] leading-relaxed text-white/65">
                    What the district did with its decade: the one-time money, the strike, the
                    cuts, and the verdicts that survive every excuse.
                  </dd>
                </div>
                <div>
                  <dt className="text-[14px] font-semibold text-white">Then, the plan</dt>
                  <dd className="mt-1 text-[14px] leading-relaxed text-white/65">
                    Ten decisions a board member could move on Monday, printed with the hardest
                    objections we could find and the answers.
                  </dd>
                </div>
              </dl>
            </aside>
          </div>

          <dl className="mt-12 grid grid-cols-2 gap-px overflow-hidden rounded-sm border border-white/10 bg-white/10 sm:grid-cols-4">
            {[
              { k: "The headline budget", v: "$2.77B" },
              { k: "The actual operating fund, down $6.5M", v: "$862M" },
              { k: "Already projected out of next year's budget", v: "$65M+" },
              { k: "Students, down one in eight since 2019", v: "42,304" },
            ].map((s) => (
              <div key={s.k} className="bg-[var(--color-canopy)] p-5">
                <dd className="font-mono text-[26px] font-bold tabular-nums text-white sm:text-[30px]">
                  {s.v}
                </dd>
                <dt className="mt-1 font-mono text-[10px] uppercase tracking-[0.12em] text-white/50">
                  {s.k}
                </dt>
              </div>
            ))}
          </dl>
        </div>
      </header>

      {/* ── the whole story in one screen ── */}
      <TheWholeStory />

      {/* ── nav ── */}
      <nav
        className="sticky top-14 z-40 border-b border-[var(--color-parchment)] bg-[var(--color-paper)]/95 backdrop-blur print:hidden"
        aria-label="Section navigation"
      >
        <ReadingProgress />
        <div className={`${DIVE_CONTAINER} scrollbar-hide flex gap-1 overflow-x-auto`}>
          {NAV.map((n) => (
            <a
              key={n.id}
              href={`#${n.id}`}
              className="flex min-h-[44px] shrink-0 items-center px-3 font-mono text-[11px] uppercase tracking-[0.08em] text-[var(--color-ink-muted)] hover:text-[var(--color-canopy)]"
            >
              {n.label}
            </a>
          ))}
        </div>
      </nav>

      {/* ════ ACT II · THE RULES NOBODY IN THE ROOM CONTROLS ════ */}

      <Section
        id="salems-machine"
        eyebrow="Act II · The rules"
        title="Start with the strangest fact in Oregon school finance."
        lead="For operating money, Portland's property wealth mostly buys Portland's schools nothing. That is not a scandal. It is the design."
      >
        <Prose>
          <p>
            The green sliver above is small because almost everything around it was decided before
            this board was elected. Since 1991, Oregon has funded schools through an equalization
            formula with one governing identity: the state grant equals a district&apos;s formula
            total <em>minus its local property taxes</em>. Every ordinary tax dollar Portland
            collects is subtracted from its state check. If the tax base booms, the check shrinks
            by the same amount. The Legislative Revenue Office says it flatly: if local revenues
            are high, state aid is low (<Src id="lro524" />). The statute even counts tax capacity
            a district declines to levy as if it had collected it (<Src id="ors327011" />).
          </p>
          <p>
            The formula weights students, not buildings: a student with a disability counts double,
            but the state pays that weight only up to 11 percent of enrollment, a 1990s cap, while
            PPS reports 17 percent of its students receive special education services (
            <Src id="cbrcFy27" />). The gap lands on the operating fund, involuntarily, every year.
            One mercy for a shrinking district: the state pays on the <em>higher</em> of this
            year&apos;s or last year&apos;s count, so enrollment loss hits with a one-year lag.
          </p>
          <p>
            What actually adds money sits outside the formula: the local option levy, bond levies,
            the Student Success Act, federal grants, the city&apos;s arts tax, and, for four
            years, almost $115 million of one-time pandemic relief. Which means the two taxes
            Portlanders vote on directly are nearly the only local levers that work. One of them
            is leaking.
          </p>
        </Prose>
      </Section>

      <Section
        id="the-levy-leak"
        eyebrow="Act II · The rules"
        title="Voters approved $1.99 for teachers. About $1.51 arrives."
        lead="The leak is not mismanagement. It is the 1990s tax constitution working exactly as written, and it is growing fast."
        tone="warm"
      >
        <Prose>
          <p>
            The local option levy is legally restricted to teacher salaries, held in its own
            sub-account, and audited clean every year (<Src id="cbrcLevy2025" />). It is also the
            first thing sacrificed when a property&apos;s taxes hit the constitutional ceiling:
            Measure 5 caps education taxes against <em>market</em> value, Measure 50 grows{" "}
            <em>assessed</em> value at 3 percent regardless, and when the two collide, the
            shortfall, called compression, comes out of the levy first, down to zero, before any
            other line is touched. Portland&apos;s post-2022 market, flat prices on a ratcheting
            assessment base, is the worst case for that arithmetic.
          </p>
        </Prose>
        <LevyLeak />
        <Prose>
          <p>
            Put people to the arithmetic and it reads like this: roughly flat receipts now buy
            about a quarter fewer teachers than in 2019, because compression grew 72 percent in
            three years while the average cost of a teacher rose from $106,000 toward $152,000.
            The district&apos;s own levy reviewers wrote the sentence that should be on every 2029
            renewal mailer: without intervention, PPS could lose nearly one quarter of its
            levy-funded teaching positions (<Src id="cbrcLevy2025" />). A board member who wants
            more teachers per levy dollar has exactly one venue, and it is not the district office.
            It is the legislature. What that leak costs your own house, at your own assessed
            value:
          </p>
        </Prose>
        <HomeownerCalculator />
      </Section>

      <Section
        id="the-empty-chair"
        eyebrow="Act II · The rules"
        title="Who reviews the budget? In Portland, the people who wrote it."
        lead="Oregon seats citizens beside the board on nearly every district's budget committee. Portland is the carve-out."
      >
        <Prose>
          <p>
            If Salem writes the revenue rules, at least the spending gets reviewed, somewhere, by
            someone. Here is who. For most Oregon districts, state law requires the budget
            committee to be the elected board <em>plus an equal number of appointed citizens</em>,
            ordinary residents with the same seat, the same questions, the same vote on approval (
            <Src id="ors294414" />). A carve-out for large districts in counties with a tax
            supervising commission lets the board serve as its own committee instead (
            <Src id="ors294423" />), and PPS&apos;s board does. The citizen half of the table,
            standard in Beaverton and Salem-Keizer, is an empty chair here.
          </p>
        </Prose>
        <EmptyChair />
        <Prose>
          <p>
            The volunteer substitute, the Community Budget Review Committee, has asked for more
            time three years running; its request, in its own words the following year,
            &ldquo;remains unaddressed&rdquo; (<Src id="cbrcFy26" />). The commission that must
            certify the budget, TSCC, checks legal form and found no objections in any of the last
            three years (<Src id="tsccFy26" />). Which leaves the obvious question: with the rules
            set in Salem and the review this thin, what did the district actually do with its
            decade? That story has a shape, and the shape is a cliff.
          </p>
        </Prose>
      </Section>

      {/* ════ ACT III · WHAT THE DISTRICT DID WITH ITS DECADE ════ */}

      <Section
        id="the-decade"
        eyebrow="Act III · The record"
        title="Eleven years: money up every year, students down, then the bill."
        lead="Nominal operating money rose without interruption until this year. Purchasing power peaked in 2021-22 and has fallen nine percent since."
      >
        <DecadeSpine />
        <Prose>
          <p>
            The turn has a date and a cause. Enrollment held near 49,500 for four years, then fell
            off a cliff whose edge was 2019-20: down one student in eight since, by the
            district&apos;s own count (<Src id="suptMessageFy27" />), concentrated brutally in
            kindergarten, where the share of eligible children enrolling fell from about 80
            percent to about 70 and stayed there. Students who never arrive in kindergarten never
            arrive in any later grade either. Meanwhile the money kept coming: the state check,
            cushioned by the formula&apos;s lag, and a one-time federal river.
          </p>
        </Prose>
        <EsserCliff />
        <Prose>
          <p>
            The relief was spent on people and programs, deliberately, and federal guidance
            encouraged exactly that. But one-time money was carrying ongoing commitments, and the
            district&apos;s own citizen committee said so in real time, in spring 2023, six months
            before the strike: the funding was &ldquo;hiding the looming shortfall ... from the
            general public&rdquo; (<Src id="cbrcFy24" />). Then November 2023: the first strike in
            district history, settled at a press-reported cost near $175 million over three years,
            a figure no published cost model has ever supported or refuted, because none exists (
            <Src id="opbStrikeFaq" />). Then the cliff, then the cuts, in a sequence the chart
            above prints: $30 million, $40 million, $56.3 million, with more than $65 million
            already projected for next year (<Src id="budgetFy27Vol1" />). So where inside the
            operating fund did the squeeze actually land?
          </p>
        </Prose>
      </Section>

      <Section
        id="where-it-goes"
        eyebrow="Act III · The record"
        title="Where the operating dollar goes, and where the cuts landed."
        lead="Seventy-nine cents of every operating dollar is people. When cuts came, classrooms gave up ground twice as fast as the back office."
        tone="warm"
      >
        <Prose>
          <p>
            Of the $862 million operating fund, 78.9 percent, $680.5 million, is salaries and
            benefits (<Src id="budgetFy27Vol1" />). The pension system explains more of the squeeze
            than any headline: PPS bought its way to a roughly 4 percent pension rate with $510
            million of pension bonds, those credits are now expiring into a rate near 23 percent,
            and the reserve built for exactly this cliff was spent in a single year, down to its
            last $394,000 (<Src id="tsccFy26" />).
          </p>
        </Prose>
        <div className="mt-6 overflow-x-auto rounded-sm border border-[var(--color-parchment)] bg-white">
          <table className="w-full min-w-[560px] text-left">
            <thead>
              <tr className="border-b border-[var(--color-parchment)] bg-[var(--color-paper-warm)]">
                {["Staffing by function", "FY2021-22 actual", "FY2025-26 adopted", "Change"].map((h) => (
                  <th key={h} className="px-4 py-3 font-mono text-[10px] font-semibold uppercase tracking-[0.18em] text-[var(--color-ink-muted)]">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--color-parchment)]">
              {FTE_BY_FUNCTION.map((r) => (
                <tr key={r.group}>
                  <td className="px-4 py-3 text-[13px] font-semibold text-[var(--color-ink)]">{r.group}</td>
                  <td className="px-4 py-3 font-mono text-[13px] tabular-nums text-[var(--color-ink-light)]">{r.fy22.toLocaleString()}</td>
                  <td className="px-4 py-3 font-mono text-[13px] tabular-nums text-[var(--color-ink-light)]">{r.fy26.toLocaleString()}</td>
                  <td className={`px-4 py-3 font-mono text-[13px] font-semibold tabular-nums ${r.pct < 0 ? "text-[var(--color-clay)]" : "text-[var(--color-fern)]"}`}>
                    {r.pct > 0 ? "+" : ""}{r.pct}%
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <p className="border-t border-[var(--color-parchment)] px-4 py-2.5 font-mono text-[10px] uppercase tracking-[0.12em] text-[var(--color-ink-muted)]">
            PPS FY2025-26 Adopted Budget, FTE by major function
          </p>
        </div>
        <Prose>
          <p>
            Regular instruction gave up 12.2 percent while central business support gave up 5.5,
            and the district&apos;s own committee could not verify the central-office cut claims
            because no publication separates them: the year 65 central positions were reportedly
            cut, the whole support function fell half a percent, and the central-only line was, in
            the committee&apos;s words, &ldquo;not clearly presented&rdquo; (<Src id="cbrcFy26" />
            ). Per student, the honest paradox: real dollars per student are <em>up</em> 24 percent
            over the decade, because enrollment fell faster than inflation ate the budget, and the
            institution still feels poorer every year, because its fixed footprint never shrank.
            Which brings us to the buildings.
          </p>
        </Prose>
      </Section>

      <Section
        id="empty-seats"
        eyebrow="Act III · The record"
        title="The structure under the deficit: empty seats, full costs."
        lead="Revenue arrives per student. Costs arrive per building. Nobody voted for the gap between them, and it grew for five years before anyone moved."
      >
        <Prose>
          <p>
            The district operates on the order of 80 schools across 152 square miles for a student
            body down about 16 percent from its peak, with the slide forecast to continue toward
            roughly 39,900 by 2028-29 (<Src id="tsccFy26" />). Every year of that divergence pays
            principals, boilers, custodians, and bus routes for seats without students in them,
            out of the same fund cutting classroom positions. The forecasts were public and
            unambiguous by 2021-22. The consolidation process began in fall 2026, with up to 20
            schools reported on the table (<Src id="wwTwentySchools" />, press).
          </p>
          <p>
            Hold both truths, because the fight ahead will drop one of them. Small schools are a
            purchase, not a waste: walkability, belonging, and the memory of what closures did to
            Black and brown North and Northeast Portland the last time. And the purchase has a
            price nobody published: the honest per-building savings are modest, roughly one to two
            million dollars per elementary, and the district&apos;s own savings model is not
            public. Communities are being asked to trust arithmetic nobody can check. Whether any
            of this rises to the word everyone reaches for, waste, deserves an actual standard
            instead of a shout. Here is ours.
          </p>
        </Prose>
      </Section>

      {/* ════ ACT IV · THE EXAMINATION ════ */}

      <Section
        id="waste"
        eyebrow="Act IV · The examination"
        title="Where is the waste? An honest standard, five verdicts, no fake total."
        lead="A definition first, so the verdicts cannot bend to the argument. Then the largest finding, which is not a line item at all."
        tone="warm"
      >
        <WasteVerdicts />
        <div className="mt-8">
          <p className="max-w-3xl text-[15px] leading-relaxed text-[var(--color-ink-light)]">
            The capital ledger deserves its own exhibit, because it is where the biggest
            controllable failures live, and also the proof the machine can perform when it states
            honest numbers:
          </p>
          <BondLedger />
        </div>
      </Section>

      <Section
        id="arguments"
        eyebrow="Act IV · The examination"
        title="The four arguments Portland keeps having, adjudicated."
        lead="Each side at full strength, then where the evidence lands. Arithmetic outranks balance: where the numbers settle it, we say so."
      >
        <div className="space-y-8">
          {DEBATES.map((d) => (
            <Debate key={d.id} debate={d} />
          ))}
        </div>

        {/* The equity formula: live litigation gets a case file, not a debate. */}
        <div className="mt-8 rounded-sm border border-[var(--color-parchment)] bg-white">
          <div className="border-b border-[var(--color-parchment)] bg-[var(--color-paper-warm)] px-5 py-4">
            <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-[var(--color-clay)]">
              A case file, not a debate
            </p>
            <h3 className="mt-1.5 font-editorial text-[22px] leading-tight text-[var(--color-ink)]">
              {CASE_FILE.title}
            </h3>
            <p className="mt-1.5 text-[12.5px] leading-relaxed text-[var(--color-ink-muted)]">{CASE_FILE.status}</p>
          </div>
          <div className="space-y-3 p-5 text-[13.5px] leading-relaxed text-[var(--color-ink-light)]">
            <p><span className="font-semibold text-[var(--color-ink)]">The mechanics:</span> {CASE_FILE.mechanics}</p>
            <p><span className="font-semibold text-[var(--color-ink)]">The allegation:</span> {CASE_FILE.allegation}</p>
            <p><span className="font-semibold text-[var(--color-ink)]">What is fair game now:</span> {CASE_FILE.fairGame}</p>
            <p className="border-t border-[var(--color-parchment)] pt-3 font-semibold text-[var(--color-ink)]">{CASE_FILE.bottomLine}</p>
          </div>
        </div>

        <Prose>
          <p className="mt-8">
            Notice what three of these four adjudications have in common: they end at a document
            the district has never published. The cost model. The position-control records. The
            benchmarking study. The pattern is the finding, and it deserves its own section.
          </p>
        </Prose>
      </Section>

      <Section
        id="cannot-know"
        eyebrow="Act IV · The examination"
        title="What the public record cannot answer."
        lead="Including the one we got wrong ourselves, left visible on purpose."
        tone="warm"
      >
        <CannotKnow />
      </Section>

      {/* ════ ACT V · THE PLAN ════ */}

      <Section
        id="the-plan"
        eyebrow="Act V · The plan"
        title="Ten decisions, built to be attacked."
        lead="Everything above is diagnosis. This is the treatment: motion-level, sequenced, with the hardest objection we could find printed under each decision, and the answer."
        tone="dark"
      >
        <PlanDecisions />
      </Section>

      <Section
        id="watch"
        eyebrow="Act V · The plan"
        title="Six tripwires for the next two years."
        lead="You do not need to read 500 pages to hold the district accountable. You need six numbers and the dates they arrive."
      >
        <Tripwires />
      </Section>

      <Section
        id="doctrine"
        eyebrow="Act V · The plan"
        title="The doctrine of the movable dollar."
        lead="One sentence to govern by, ten commitments that operationalize it, and the question to ask every April."
        tone="warm"
      >
        <DoctrineCard />
      </Section>

      {/* ── method ── */}
      <Section
        id="method"
        eyebrow="Method"
        title="How this page knows what it claims."
        lead="A corpus of 120 checksummed public documents, two fact-checked analyses, and every correction on the record."
      >
        <Prose>
          <p>
            This page condenses two published analyses: the research document{" "}
            <Src id="researchDoc" /> (262 figures verified page-by-page against source documents by
            an adversarial fact-check that returned 80 corrections, all applied) and the
            recommendations <Src id="planDoc" /> (58 red-team objections, 18 fatal to the first
            draft, dispositions preserved). The corpus behind both, 120 documents fetched and
            checksummed with every extraction citing its page, is public: <Src id="pclAnalysis" />.
          </p>
          <p>
            Cautions we owe the reader: figures that exist only in press reporting, the strike
            settlement cost, the closure counts, the kindergarten capture rate, are labeled press
            wherever they appear. Searching this topic is hazardous: portlandschools.org and
            portlandk12.org belong to Portland, Maine, whose voter-approved school budget pollutes
            results; Oregon school budgets never go to a referendum. And the official record
            disagrees with itself more than anyone should be comfortable with: our extraction
            logged nineteen cross-document contradictions in oversight tables and an audited
            report whose statistical section prints an impossible enrollment figure. Where sources
            conflict, the page says so rather than smoothing it.
          </p>
        </Prose>
        <IndependenceNote />
        <div className="mt-10">
          <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.18em] text-[var(--color-ink-muted)]">
            Sources
          </p>
          <div className="mt-4 grid gap-2 sm:grid-cols-2 xl:grid-cols-3">
            {dedupeSources().map((s) => (
              <a
                key={s.url}
                href={s.url}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-sm border border-[var(--color-parchment)] bg-white p-3.5 hover:border-[var(--color-sage)]"
              >
                <p className="text-[12.5px] font-semibold leading-snug text-[var(--color-ink)]">{s.title}</p>
                <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.1em] text-[var(--color-ink-muted)]">
                  {s.org}
                  {s.year ? ` · ${s.year}` : ""}
                </p>
              </a>
            ))}
          </div>
        </div>
      </Section>
    </article>
  );
}
