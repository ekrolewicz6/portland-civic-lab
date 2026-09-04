import type { Metadata } from "next";
import Link from "next/link";
import { pageMeta } from "@/lib/page-meta";
import { DIVE_CONTAINER } from "@/components/deep-dives/shared";
import { SOURCES, FTE_BY_FUNCTION, type Source } from "@/lib/pps-budget/data";
import { DEBATES, CASE_FILE } from "@/lib/pps-budget/arguments";
import { Panel, Depth, FormulaStrip } from "@/components/deep-dives/pps-budget/SectionFrame";
import TheWholeStory from "@/components/deep-dives/pps-budget/TheWholeStory";
import MoneyDecomposition from "@/components/deep-dives/pps-budget/MoneyDecomposition";
import DecadeSpine from "@/components/deep-dives/pps-budget/DecadeSpine";
import LevyLeak from "@/components/deep-dives/pps-budget/LevyLeak";
import HomeownerCalculator from "@/components/deep-dives/pps-budget/HomeownerCalculator";
import EmptyChair from "@/components/deep-dives/pps-budget/EmptyChair";
import BondLedger from "@/components/deep-dives/pps-budget/BondLedger";
import EsserCliff from "@/components/deep-dives/pps-budget/EsserCliff";
import Benchmarks from "@/components/deep-dives/pps-budget/Benchmarks";
import SchoolUtilization from "@/components/deep-dives/pps-budget/SchoolUtilization";
import PensionTimeline from "@/components/deep-dives/pps-budget/PensionTimeline";
import WasteVerdicts from "@/components/deep-dives/pps-budget/WasteVerdicts";
import OverrunAnatomy from "@/components/deep-dives/pps-budget/OverrunAnatomy";
import PlanDecisions from "@/components/deep-dives/pps-budget/PlanDecisions";
import CannotKnow from "@/components/deep-dives/pps-budget/CannotKnow";
import DoctrineCard from "@/components/deep-dives/pps-budget/DoctrineCard";
import Tripwires from "@/components/deep-dives/pps-budget/Tripwires";
import FieldKit from "@/components/deep-dives/pps-budget/FieldKit";
import Debate from "@/components/deep-dives/pps-budget/Debate";
import ReadingProgress from "@/components/deep-dives/venues/ReadingProgress";

export const metadata: Metadata = pageMeta({
  title: "Where the next dollar goes: the PPS budget, examined",
  description:
    "Portland Public Schools cut teachers while its budget hit $2.77 billion, and both facts are true. Eleven years of budget books and every audit, read so you don't have to. What decides whether a dollar reaches a student, where the waste actually is, and ten things the school board could do about it.",
  path: "/deep-dives/pps-budget",
  type: "article",
});

/**
 * Twelve panels, one claim each, carried by a visual. The prose that used to
 * sit between exhibits lives in <Depth> toggles, closed by default. See
 * SectionFrame.tsx for the anatomy.
 */

const NAV = [
  { id: "salems-machine", label: "How the money works" },
  { id: "the-levy-leak", label: "The levy leak" },
  { id: "the-empty-chair", label: "Who checks it" },
  { id: "the-decade", label: "What happened" },
  { id: "where-it-goes", label: "Where it goes" },
  { id: "the-benchmarks", label: "Is it a lot?" },
  { id: "empty-seats", label: "Empty schools" },
  { id: "waste", label: "The waste" },
  { id: "arguments", label: "The big fights" },
  { id: "the-plan", label: "The plan" },
  { id: "watch", label: "Your move" },
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

/** A one-line, three-up credit strip. Kept visible on purpose: critics should see it. */
function CreditStrip() {
  const items = [
    { k: "It teaches well", v: "56% reading proficiency vs 43% statewide; 82.5% graduate", s: "academicJourney" as const },
    { k: "It saw the cliff coming", v: "Built a reserve after 2019 and spent it down instead of cutting sooner, over union objections", s: "tsccFy26" as const },
    { k: "Its strike math held", v: "It said the settlement would force deep cuts. It did.", s: "opbStrikeFaq" as const },
  ];
  return (
    <div className="grid gap-px overflow-hidden rounded-sm border border-[var(--color-fern)]/40 bg-[var(--color-fern)]/20 sm:grid-cols-3">
      {items.map((c) => (
        <div key={c.k} className="bg-[var(--color-sage-tint)] p-4">
          <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.16em] text-[var(--color-fern)]">
            Credit · {c.k}
          </p>
          <p className="mt-1.5 text-[13.5px] leading-snug text-[var(--color-ink)]">
            {c.v} (<Src id={c.s} />)
          </p>
        </div>
      ))}
    </div>
  );
}

export default function PpsBudgetPage() {
  return (
    <article className="bg-[var(--color-paper)]">
      {/* ── hero ── */}
      <header className="noise-overlay relative overflow-hidden bg-[var(--color-canopy)] py-16 text-white sm:py-20">
        <div className={`relative z-10 ${DIVE_CONTAINER}`}>
          <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-[var(--color-ember-bright)]">
            <Link href="/deep-dives" className="hover:text-white">Policy deep-dive</Link> ——— The Portland Public Schools budget
          </p>
          <h1 className="mt-5 max-w-4xl font-editorial-normal text-[40px] leading-[1.05] sm:text-[56px] xl:text-[64px]">
            Where the next dollar goes.
            <span className="block font-editorial italic text-[var(--color-ember-bright)]">
              And the ten decisions that would change it.
            </span>
          </h1>
          <p className="mt-6 max-w-2xl text-[17px] leading-relaxed text-white/85 sm:text-[19px]">
            PPS just cut 322 positions, its sixth straight year of cuts, on a record $2.77 billion
            budget. Both are true. Twelve pictures explain how, and what to do about it.
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

          <dl className="mt-12 grid grid-cols-2 gap-px overflow-hidden rounded-sm border border-white/10 bg-white/10 sm:grid-cols-4">
            {[
              { k: "The headline budget", v: "$2.77B" },
              { k: "The fund that pays teachers, down $6.5M", v: "$862M" },
              { k: "Already projected out of next year", v: "$65M+" },
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

      <TheWholeStory />

      <nav
        className="sticky top-14 z-40 border-b border-[var(--color-parchment)] bg-[var(--color-paper)]/95 backdrop-blur print:hidden"
        aria-label="Section navigation"
      >
        <ReadingProgress />
        <div className={`${DIVE_CONTAINER} scrollbar-hide flex gap-1 overflow-x-auto`}>
          {NAV.map((n, i) => (
            <a
              key={n.id}
              href={`#${n.id}`}
              className="flex min-h-[44px] shrink-0 items-center gap-1.5 px-3 font-mono text-[11px] uppercase tracking-[0.08em] text-[var(--color-ink-muted)] hover:text-[var(--color-canopy)]"
            >
              <span className="text-[var(--color-ember)]">{i + 1}</span> {n.label}
            </a>
          ))}
        </div>
      </nav>

      {/* ════ THE RULES FROM SALEM ════ */}

      <Panel
        id="salems-machine"
        n={1}
        act="The rules from Salem"
        claim="A record budget and a sixth year of cuts are both true."
        sub={
          <>
            Five kinds of money that legally cannot mix. Construction rose $739M because voters
            passed a bond. The fund that pays teachers fell $6.5M (<Src id="budgetFy27Vol1" />).
            And local prosperity cannot refill it, because of the formula below.
          </>
        }
        number="$182M"
        numberLabel="is all this year's board actually decides"
        next={{ href: "#the-levy-leak", question: "Why does only $1.51 of the $1.99 teachers levy arrive?" }}
      >
        <MoneyDecomposition />
        <div className="mt-6">
          <FormulaStrip />
        </div>
        <Depth title="The formula, with sources">
          <p>
            Since 1991 the state grant equals a district&apos;s formula total minus its local
            property taxes, in the Legislative Revenue Office&apos;s own words (
            <Src id="lro524" />). The statute even counts tax capacity a district declines to levy
            as if it had collected it (<Src id="ors327011" />).
          </p>
          <p>
            The formula pays for special education only up to 11 percent of students; PPS serves
            17 percent (<Src id="cbrcFy27" />). That gap lands on the operating fund every year,
            and no board vote can decline it.
          </p>
        </Depth>
      </Panel>

      <Panel
        id="the-levy-leak"
        n={2}
        act="The rules from Salem"
        claim="Voters approved $1.99 for teachers. About $1.51 arrives."
        sub="A 1990 cap on school taxes deletes whatever a bill exceeds, and the teachers levy is deleted first, by design: it was only ever allowed to exist in the room the cap left over."
        tone="warm"
        number="48¢"
        numberLabel="of every levy dollar never reaches a classroom, and the leak grows yearly"
        next={{ href: "#the-empty-chair", question: "If Salem sets the revenue, who reviews the spending?" }}
      >
        <LevyLeak />
        <Depth title="How the leak works, on one tax bill">
          <p>
            The levy is written as $1.99 per $1,000 of your home&apos;s <em>assessed</em> value.
            Measure 5, from 1990, caps school taxes at $5 per $1,000 of <em>market</em> value.
            When a bill breaks that ceiling the county does not defer the extra. It deletes it,
            and the constitution names what goes first: add-on levies like this one, down to
            zero before any other line loses a cent. Averaged across every property, that is
            now 48 cents of the $1.99. Tax people call it compression. What does arrive is
            restricted to teacher pay and audited every year (<Src id="cbrcLevy2025" />).
          </p>
          <p>
            Why design a tax to be deleted? In 1997, Measure 50 let districts ask voters for
            extra money only from whatever room the $5 ceiling left. The levy was born as the
            overflow. For two decades rising home prices kept that room wide; since 2022, flat
            prices against assessed values still ratcheting up 3 percent a year have closed it
            on thousands of properties at once. Only the legislature can change it. The
            sentence to carry to the 2029 renewal: print the effective rate next to the $1.99.
          </p>
        </Depth>
        <div className="mt-6">
          <HomeownerCalculator />
        </div>
      </Panel>

      <Panel
        id="the-empty-chair"
        n={3}
        act="The rules from Salem"
        claim="Who reviews the budget? In Portland, the people who wrote it."
        sub={
          <>
            Nearly every Oregon district seats citizens with a vote on its budget committee (
            <Src id="ors294414" />). Portland is exempt because Multnomah County has a 1919 tax
            commission that certifies budgets for legality, never for wisdom (
            <Src id="ors294423" />
            <Src id="tsccFy26" />).
          </>
        }
        number="9"
        numberLabel="working days for the citizen reviewers. No vote, no required answer."
        next={{ href: "#the-decade", question: "What did the district do with its decade?" }}
      >
        <EmptyChair />
        <Depth title="Did the 1919 trade work?">
          <p>
            The commission checks legal form: rates within limits, hearings held, funds balanced.
            It has certified PPS without a single objection in each of the last three years, the
            same three years the deficit compounded. Certification asks whether a budget is
            lawful, never whether it is wise. The judgment half fell to volunteers with nine days
            and no vote, and the scorecard above shows what advice is worth when ignoring it costs
            nothing.
          </p>
          <p className="font-semibold text-[var(--color-ink)]">
            The rule this page reads everything by: judge the district by how it handles the
            problems it can control. &ldquo;Salem did it&rdquo; cannot excuse the choices the
            district makes for itself.
          </p>
        </Depth>
      </Panel>

      {/* ════ WHAT HAPPENED ════ */}

      <Panel
        id="the-decade"
        n={4}
        act="What happened"
        claim="Money rose every year. Students fell one in eight. Then the bill came due."
        sub="Temporary federal relief hid the gap for four years. When it ran out, the same deficit surfaced as cuts, bigger every year."
        number="$126M+"
        numberLabel="cut in three years, already more than the relief that delayed the cuts"
        next={{ href: "#where-it-goes", question: "Where inside the operating fund did the squeeze land?" }}
      >
        <CreditStrip />
        <div className="mt-6">
          <DecadeSpine />
        </div>
        <div className="mt-6">
          <EsserCliff />
        </div>
        <Depth title="The sequence, with sources">
          <p>
            Enrollment held near 49,500 for four years, then fell from 2019-20, worst in
            kindergarten: down one student in eight since, by the district&apos;s own count (
            <Src id="suptMessageFy27" />). The money kept coming: the state check, cushioned by
            the formula&apos;s one-year lag, and almost $115 million of pandemic relief spent on
            ongoing programs. The citizen committee said in spring 2023 the relief was
            &ldquo;hiding the looming shortfall&rdquo; (<Src id="cbrcFy24" />). Then the first
            strike in district history, at a press-reported cost near $175 million over three
            years (<Src id="opbStrikeFaq" />). Then the relief ran out. Then the cuts: $30
            million, $40 million, $56.3 million, with more than $65 million projected next year (
            <Src id="budgetFy27Vol1" />).
          </p>
        </Depth>
      </Panel>

      <Panel
        id="where-it-goes"
        n={5}
        act="What happened"
        claim="Seventy-nine cents of every operating dollar is people. The fastest-growing cost is a pension bill set in Salem."
        sub={
          <>
            $680.5M of the $862M fund is salaries and benefits (<Src id="budgetFy27Vol1" />). The
            pension rate is jumping from about 4 percent of payroll to nearly 23 (
            <Src id="cbrcFy27" />), and nobody at PPS chose it.
          </>
        }
        tone="warm"
        number="4% → 23%"
        numberLabel="the pension rate now arriving. The reserve built for it was spent in one year."
        next={{ href: "#the-benchmarks", question: "Is $22,000 a student a lot? Are teachers overpaid?" }}
      >
        <PensionTimeline />
        <div className="mt-6 overflow-x-auto rounded-sm border border-[var(--color-parchment)] bg-white">
          <table className="w-full min-w-[560px] text-left">
            <thead>
              <tr className="border-b border-[var(--color-parchment)] bg-[var(--color-paper-warm)]">
                {["Where the cuts landed", "FY2021-22", "FY2025-26", "Change"].map((h) => (
                  <th key={h} className="px-4 py-3 font-mono text-[10px] font-semibold uppercase tracking-[0.18em] text-[var(--color-ink-muted)]">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--color-parchment)]">
              {FTE_BY_FUNCTION.map((r) => (
                <tr key={r.group}>
                  <td className="px-4 py-3 text-[14px] font-semibold text-[var(--color-ink)]">{r.group}</td>
                  <td className="px-4 py-3 font-mono text-[13px] tabular-nums text-[var(--color-ink-light)]">{r.fy22.toLocaleString()}</td>
                  <td className="px-4 py-3 font-mono text-[13px] tabular-nums text-[var(--color-ink-light)]">{r.fy26.toLocaleString()}</td>
                  <td className={`px-4 py-3 font-mono text-[14px] font-bold tabular-nums ${r.pct < 0 ? "text-[var(--color-clay)]" : "text-[var(--color-fern)]"}`}>
                    {r.pct > 0 ? "+" : ""}{r.pct}%
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <p className="border-t border-[var(--color-parchment)] px-4 py-2.5 text-[13px] leading-snug text-[var(--color-ink)]">
            Classrooms gave up 12 percent; central support gave up 5. Special programs grew because
            special-education caseloads grew, and federal law protects that service.
          </p>
        </div>
        <Depth title="Why nobody can check the central-office claims">
          <p>
            The year 65 central positions were reportedly cut, the whole support function fell
            half a percent, and the committee called the central-only line &ldquo;not clearly
            presented&rdquo; (<Src id="cbrcFy26" />). No publication separates central office from
            the rest of support services, so the argument runs on faith in both directions.
          </p>
          <p>
            One paradox to carry: real dollars per student are <em>up</em> 24 percent over the
            decade, because enrollment fell faster than inflation, and the institution still
            feels poorer every year, because its fixed footprint never shrank.
          </p>
        </Depth>
      </Panel>

      <Panel
        id="the-benchmarks"
        n={6}
        act="What happened"
        claim="Yes, it is a lot of money. No, teachers are not why."
        sub="A quarter more per student than Oregon peers; last of six cities in cost-of-living-adjusted teacher pay. The difference disappears into pensions, benefits, buildings, and overhead before it reaches a classroom."
        number="+27%"
        numberLabel="above the Oregon average per student, on the state's own books"
        next={{ href: "#empty-seats", question: "Where does it go instead? Start with the buildings." }}
      >
        <Benchmarks />
        <Depth title="Ground rules and sources">
          <p>
            Per-student spending can be counted Oregon&apos;s way or the federal way, and the two
            give different numbers for the same district (<Src id="odeNoe2324" />
            <Src id="censusFin2024" />); each panel compares like with like. Teacher pay uses
            published 2025-26 schedules and federal regional price parities (<Src id="beaRpp2024" />
            <Src id="neaPay2025" />). &ldquo;Should&rdquo; has no neutral answer, so the closest
            thing offered is the state&apos;s own adequacy model (<Src id="qem2026" />).
          </p>
        </Depth>
      </Panel>

      <Panel
        id="empty-seats"
        n={7}
        act="What happened"
        claim="16,511 empty seats, and the real cost is not the dollars."
        sub={
          <>
            Below a certain size a school cannot offer a full-time counselor, a librarian, or a
            full slate of electives at any budget. Consolidation began in fall 2026 with up to 20
            schools reported on the table (<Src id="wwTwentySchools" />, press). Here is every
            school, from an open-source compilation we verified against the primaries (
            <Src id="ppsdataInfo" />).
          </>
        }
        tone="warm"
        number="16"
        numberLabel="schools less than half full. Ten of them are Title I."
        next={{ href: "#waste", question: "Is any of this waste?" }}
      >
        <SchoolUtilization />
        <Depth title="Both sides of the closure fight, and the two tests">
          <p>
            Small schools are something Portland pays extra for on purpose, and the last closures
            fell hardest on Black and brown North and Northeast Portland. But per-building savings
            of one to two million dollars will not close a $65 million gap, so savings is not
            the honest test. Two documents should exist before any vote: what closing saves, and
            what students at the receiving school gain, in named programs and positions. Neither
            does.
          </p>
          <p>
            Sources verified: ODE Fall Membership 2025-26 (<Src id="odeFallMembership2526" />),
            the 2021 facility plan (<Src id="lrfp2021" />), the Holmes seismic assessments (
            <Src id="holmesSeismic2024" />).
          </p>
        </Depth>
      </Panel>

      {/* ════ THE JUDGMENT CALLS ════ */}

      <Panel
        id="waste"
        n={8}
        act="The judgment calls"
        claim="There is no hidden pot. The waste is overruns, delay, and numbers nobody can check."
        number="$219M"
        numberLabel="Benson's overrun. Most of it was the ballot number, not construction."
        next={{ href: "#arguments", question: "Who is right in the four fights Portland keeps having?" }}
      >
        <WasteVerdicts />
        <div className="mt-8">
          <BondLedger />
        </div>
        <div className="mt-2">
          <OverrunAnatomy />
        </div>
        <Depth title="Sources for the overrun anatomy">
          <p>
            Bond performance audits (<Src id="bondAuditY6" />); the pre-ballot estimate cut (
            <Src id="opbBondTrim" />); construction cost index (<Src id="turnerCostIndex" />);
            base rates for public-project overruns (<Src id="megaprojectBaseRates" />).
          </p>
        </Depth>
      </Panel>

      <Panel
        id="arguments"
        n={9}
        act="The judgment calls"
        claim="Nobody is entirely right. Three of the four fights stall at a document the district holds."
        tone="warm"
        number="8"
        numberLabel="missing documents. Four sit in district files today."
        next={{ href: "#the-plan", question: "What could the board actually do?" }}
      >
        <div className="space-y-6">
          {DEBATES.map((d) => (
            <Debate key={d.id} debate={d} />
          ))}
        </div>

        <div className="mt-6 rounded-sm border border-[var(--color-parchment)] bg-white">
          <div className="border-b border-[var(--color-parchment)] bg-[var(--color-paper-warm)] px-5 py-4">
            <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-[var(--color-clay)]">
              A case file, not a debate
            </p>
            <h3 className="mt-1.5 font-editorial text-[22px] leading-tight text-[var(--color-ink)]">
              {CASE_FILE.title}
            </h3>
          </div>
          <div className="p-5">
            <p className="font-semibold leading-relaxed text-[var(--color-ink)]">{CASE_FILE.bottomLine}</p>
            <details className="group mt-3">
              <summary className="cursor-pointer list-none font-mono text-[10px] font-semibold uppercase tracking-[0.16em] text-[var(--color-canopy)] hover:text-[var(--color-ink)]">
                The mechanics, the allegation, and what is fair game{" "}
                <span aria-hidden className="inline-block transition-transform group-open:rotate-90">›</span>
              </summary>
              <div className="mt-3 space-y-3 border-t border-[var(--color-parchment)] pt-3 text-[13.5px] leading-relaxed text-[var(--color-ink-light)]">
                <p className="text-[12.5px] text-[var(--color-ink-muted)]">{CASE_FILE.status}</p>
                <p><span className="font-semibold text-[var(--color-ink)]">The mechanics:</span> {CASE_FILE.mechanics}</p>
                <p><span className="font-semibold text-[var(--color-ink)]">The allegation:</span> {CASE_FILE.allegation}</p>
                <p><span className="font-semibold text-[var(--color-ink)]">What is fair game now:</span> {CASE_FILE.fairGame}</p>
              </div>
            </details>
          </div>
        </div>

        <div id="cannot-know" className="scroll-mt-24">
          <CannotKnow />
        </div>
      </Panel>

      {/* ════ THE PLAN ════ */}

      <Panel
        id="the-plan"
        n={10}
        act="The plan"
        claim="Ten things the board could do, starting with three that cost nothing."
        tone="dark"
        number="$0"
        numberLabel="cost of the first three. They are about publishing, not spending."
        next={{ href: "#watch", question: "And what can you do, starting this month?" }}
      >
        <PlanDecisions />
      </Panel>

      <Panel
        id="watch"
        n={11}
        act="Your part"
        claim="Six questions, six dates, one rule."
        sub="You do not need 500 pages to hold the district accountable."
        number="6"
        numberLabel="questions that end most school-budget arguments. Use them on anyone, including us."
        next={{ href: "#method", question: "How does this page know what it claims?" }}
      >
        <FieldKit />
        <div className="mt-10">
          <p className="mb-4 font-mono text-[10px] font-semibold uppercase tracking-[0.18em] text-[var(--color-ember)]">
            Six dates, and your move at each
          </p>
          <Tripwires />
        </div>
        <div id="doctrine" className="mt-10 scroll-mt-24">
          <DoctrineCard />
        </div>
      </Panel>

      <Panel
        id="method"
        n={12}
        act="Method"
        claim="134 public documents, archived with a tamper-evident record, and two fact-checked working papers."
        tone="warm"
      >
        <div className="grid gap-4 md:grid-cols-3">
          {[
            { k: "Read it in full", v: <>The research document (<Src id="researchDoc" />) and the recommendations (<Src id="planDoc" />), both fact-checked page by page.</> },
            { k: "Check our work", v: <>The corpus, checksummed, every extraction citing its page: <Src id="pclAnalysis" />.</> },
            { k: "Where we stand", v: <>Unaffiliated with and unfunded by PPS, any union, any vendor, any campaign. Disclosures on the <Link href="/independence" className="font-semibold text-[var(--color-canopy)] hover:underline">Independence page</Link>; corrections invited and logged.</> },
          ].map((c) => (
            <div key={c.k} className="rounded-sm border border-[var(--color-parchment)] bg-white p-5">
              <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.18em] text-[var(--color-ember)]">{c.k}</p>
              <p className="mt-2 text-[14px] leading-relaxed text-[var(--color-ink-light)]">{c.v}</p>
            </div>
          ))}
        </div>
        <Depth title="Three cautions">
          <p>
            Some figures exist only in press reporting, never in an official document: the strike
            settlement cost, the closure counts, the kindergarten capture rate. They are labeled
            press wherever they appear.
          </p>
          <p>
            For anyone fact-checking with a search engine: portlandschools.org and portlandk12.org
            belong to Portland, <em>Maine</em>, whose school budget really does go to a voter
            referendum every June. No Oregon school budget is ever voted on directly.
          </p>
          <p>
            The official Oregon record disagrees with itself: our extraction logged nineteen
            contradictions between the oversight bodies&apos; own published tables, and the
            district&apos;s audited annual report carries an impossible enrollment figure. Where
            sources conflict, this page shows the conflict.
          </p>
        </Depth>
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
      </Panel>
    </article>
  );
}
