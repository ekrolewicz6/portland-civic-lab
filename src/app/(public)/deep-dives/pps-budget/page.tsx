import type { Metadata } from "next";
import Link from "next/link";
import { pageMeta } from "@/lib/page-meta";
import { DIVE_CONTAINER, Section } from "@/components/deep-dives/shared";
import { SOURCES, FTE_BY_FUNCTION, type Source } from "@/lib/pps-budget/data";
import { DEBATES, CASE_FILE } from "@/lib/pps-budget/arguments";
import { Insight, Bridge, Takeaway, FormulaStrip } from "@/components/deep-dives/pps-budget/SectionFrame";
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
 * Every section follows one anatomy (see SectionFrame.tsx): the rail asks a
 * question, answers it in one sentence, and shows the number that proves it;
 * the body carries at most a short paragraph before the exhibit; a Bridge
 * hands the reader the next question. Read only the rails and you have the
 * whole argument.
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

/** Short prose only. Anything longer than a paragraph belongs in an exhibit. */
function Prose({ children }: { children: React.ReactNode }) {
  return (
    <div className="max-w-3xl space-y-4 text-[15.5px] leading-relaxed text-[var(--color-ink-light)] [&_strong]:text-[var(--color-ink)] [div+&]:mt-8 [&+div]:mt-8">
      {children}
    </div>
  );
}

/** One-line handoff between two exhibits inside a section. */
function Lede({ children }: { children: React.ReactNode }) {
  return (
    <p className="mt-8 max-w-3xl text-[15.5px] leading-relaxed text-[var(--color-ink-light)]">
      {children}
    </p>
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
                <Link href="/deep-dives" className="hover:text-white">Policy deep-dive</Link> ——— The Portland Public Schools budget
              </p>
              <h1 className="mt-5 font-editorial-normal text-[40px] leading-[1.05] sm:text-[56px] xl:text-[64px]">
                Where the next dollar goes.
                <span className="block font-editorial italic text-[var(--color-ember-bright)]">
                  And the ten decisions that would change it.
                </span>
              </h1>
              <p className="mt-6 max-w-2xl text-[17px] leading-relaxed text-white/85">
                Portland Public Schools just cut 322 positions, its sixth straight year of cuts.
                Its budget is $2.77 billion, the largest in its history. Both are true, and no
                public document explains how.
              </p>
              <p className="mt-4 max-w-2xl text-[16px] leading-relaxed text-white/70">
                We read eleven years of budget books and every audit so you don&apos;t have to.
                Twelve questions, each answered in one sentence and one number, then shown.
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
                    Oregon sets most of the rules for school money. We start there, because the
                    rules explain most of the fights.
                  </dd>
                </div>
                <div>
                  <dt className="text-[14px] font-semibold text-white">Then, what happened</dt>
                  <dd className="mt-1 text-[14px] leading-relaxed text-white/65">
                    The last ten years: where the money came from, where it went, what got cut,
                    and where it was wasted.
                  </dd>
                </div>
                <div>
                  <dt className="text-[14px] font-semibold text-white">Then, what to do</dt>
                  <dd className="mt-1 text-[14px] leading-relaxed text-white/65">
                    Ten specific things the school board could do, and what you can do yourself:
                    six questions, six dates, one rule.
                  </dd>
                </div>
              </dl>
              <p className="mt-5 border-t border-white/15 pt-4 text-[13px] leading-relaxed text-white/60">
                In a hurry? Each section&apos;s left column is the whole point of that section:
                the question, the answer, and the number.
              </p>
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

      {/* ════ THE RULES FROM SALEM ════ */}

      <Section
        id="salems-machine"
        eyebrow="The rules from Salem · 1 of 12"
        title="How can the budget hit a record while the district cuts teachers?"
        lead="Because $2.77 billion mixes five kinds of money that legally cannot mix, and the one kind that pays teachers is the only one that fell."
        aside={
          <Insight
            number="$182M"
            label="of the $2.77 billion is money this year's board votes actually decide. Everything else was decided in Salem, at the ballot, or in a signed contract."
            money="movable"
          />
        }
      >
        <Prose>
          <p>
            Construction money rose $739 million this year because voters passed a bond. The
            operating fund, the one that pays teachers, fell $6.5 million, its first drop in
            eleven years (<Src id="budgetFy27Vol1" />). Add them together and you get a record.
            Keep them apart and you get the truth.
          </p>
        </Prose>
        <MoneyDecomposition />
        <Lede>
          And the operating fund cannot be fixed by local prosperity, because of a rule the state
          finished writing in 1991:
        </Lede>
        <div className="mt-4">
          <FormulaStrip />
        </div>
        <Takeaway>
          The state check equals a district&apos;s formula total minus its local property taxes,
          in the Legislative Revenue Office&apos;s own words (<Src id="lro524" />). The formula
          also pays for special education only up to 11 percent of students; PPS serves 17
          percent (<Src id="cbrcFy27" />). That gap lands on the operating fund every year, and no
          board vote can decline it.
        </Takeaway>
        <Bridge
          href="#the-levy-leak"
          question="Voters approved $1.99 for teachers. Why does only $1.51 arrive?"
        />
      </Section>

      <Section
        id="the-levy-leak"
        eyebrow="The rules from Salem · 2 of 12"
        title="Voters approved $1.99 for teachers. Why does only $1.51 arrive?"
        lead="A 1990 tax cap deletes whatever a bill exceeds, and the constitution says the teachers levy is deleted first. It was designed as the overflow."
        tone="warm"
        aside={
          <Insight
            number="48¢"
            label="of every levy dollar is erased by 1990s tax limits before it reaches a classroom. The leak grows every year, and nobody in Portland can fix it."
            money="rules"
          />
        }
      >
        <Prose>
          <p>
            Start with one tax bill. The teachers levy is written as $1.99 per $1,000 of your
            home&apos;s <em>assessed</em> value. But Measure 5, from 1990, caps school taxes at $5
            per $1,000 of <em>market</em> value. When a bill breaks that ceiling the county does
            not defer the extra. It deletes it, and the law names what goes first: add-on levies
            like this one, down to zero before any other line loses a cent. Averaged across every
            property, that deletion is now 48 cents of the $1.99. Tax people call it compression.
            The dollars that do arrive are restricted to teacher pay and audited every year (
            <Src id="cbrcLevy2025" />).
          </p>
          <p>
            Why design a tax to be deleted? Because in 1997, Measure 50 let districts ask voters
            for extra money only from whatever room the $5 ceiling left over. The levy was born
            as the overflow, so it is cut first. For two decades rising home prices kept that room
            wide. Since 2022, flat prices against assessed values still ratcheting up 3 percent a
            year have closed it on thousands of properties at once.
          </p>
        </Prose>
        <LevyLeak />
        <Takeaway>
          Roughly flat receipts now buy about a quarter fewer teachers than in 2019, and the
          district&apos;s own levy reviewers warned PPS could lose nearly one quarter of its
          levy-funded positions (<Src id="cbrcLevy2025" />). The only venue that can fix it is
          the legislature. And the one sentence every voter can carry to the 2029 renewal:{" "}
          <strong>print the effective rate next to the $1.99.</strong>
        </Takeaway>
        <Lede>What the leak costs your own house, at your own assessed value:</Lede>
        <div className="mt-4">
          <HomeownerCalculator />
        </div>
        <Bridge
          href="#the-empty-chair"
          question="If Salem sets the revenue, who reviews the spending?"
        />
      </Section>

      <Section
        id="the-empty-chair"
        eyebrow="The rules from Salem · 3 of 12"
        title="Who reviews the budget?"
        lead="In Portland, the seven people who wrote it. Oregon seats citizens with a vote on nearly every other district's budget committee; here they get nine days and no vote."
        aside={
          <Insight
            number="9"
            label="working days the volunteer citizen reviewers were given to weigh a $2.8 billion budget. Their advice has no vote and no required answer."
            money="rules"
          />
        }
      >
        <Prose>
          <p>
            For most Oregon districts, state law makes the budget committee the elected board
            plus an equal number of appointed citizens, same seat, same vote (
            <Src id="ors294414" />). Portland is exempt for a reason: Multnomah County is the one
            county with a Tax Supervising and Conservation Commission, a Governor-appointed
            watchdog created in 1919 that must certify every local budget in the county (
            <Src id="tsccFy26" />). Lawmakers let large districts under that commission skip the
            citizen committee (<Src id="ors294423" />), and PPS took the exemption.
          </p>
        </Prose>
        <EmptyChair />
        <Takeaway>
          Did the 1919 trade work? The commission checks legal form and has certified PPS
          without a single objection in each of the last three years, the same three years the
          deficit compounded. Certification asks whether a budget is lawful, never whether it is
          wise. The judgment half fell to volunteers, and the scorecard above shows what advice
          is worth when ignoring it costs nothing.
        </Takeaway>
        <div className="mt-6 max-w-3xl rounded-sm border-l-2 border-[var(--color-ember)] bg-[var(--color-paper-warm)] p-4">
          <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.18em] text-[var(--color-ember)]">
            The rule this page reads everything by
          </p>
          <p className="mt-1.5 text-[14.5px] leading-relaxed text-[var(--color-ink)]">
            Judge the district by how it handles the problems it can control. The state created
            many of these problems, but &ldquo;Salem did it&rdquo; cannot excuse the choices the
            district makes for itself. Every section below does both.
          </p>
        </div>
        <Bridge
          href="#the-decade"
          question="With the rules set and the review this thin, what did the district do with its decade?"
        />
      </Section>

      {/* ════ WHAT HAPPENED ════ */}

      <Section
        id="the-decade"
        eyebrow="What happened · 4 of 12"
        title="What happened over eleven years?"
        lead="Money rose every year while students fell one in eight. Then the temporary federal money that had hidden the gap ran out, and the bill came due as cuts, bigger every year."
        aside={
          <Insight
            number="$126M+"
            label="cut in three years once the federal relief ran out, already more than the $115 million of relief that delayed those cuts."
            money="movable"
          />
        }
      >
        <div className="rounded-sm border border-[var(--color-fern)]/40 bg-[var(--color-sage-tint)] p-5">
          <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.18em] text-[var(--color-fern)]">
            Credit where the record supports it
          </p>
          <ul className="mt-3 grid gap-3 text-[13.5px] leading-relaxed text-[var(--color-ink-light)] sm:grid-cols-3">
            <li>
              <span className="font-semibold text-[var(--color-ink)]">It teaches well.</span>{" "}
              Reading proficiency 56.4 percent against a 43.0 state average, math 48.0 against
              31.2, graduation 82.5 percent (<Src id="academicJourney" />).
            </li>
            <li>
              <span className="font-semibold text-[var(--color-ink)]">It saw the cliff coming.</span>{" "}
              A 2019 reserve policy, a balance built above the floor, and a drawdown that avoided
              earlier mass layoffs while the union argued the money should be spent faster (
              <Src id="tsccFy26" />).
            </li>
            <li>
              <span className="font-semibold text-[var(--color-ink)]">Its strike math held.</span>{" "}
              It said a settlement on those terms would force deep cuts. It did. Nothing below
              claims nobody at PPS was paying attention.
            </li>
          </ul>
        </div>
        <div className="mt-8">
          <DecadeSpine />
        </div>
        <Takeaway>
          The turn has a date and a cause. Enrollment held near 49,500 for four years, then fell
          from 2019-20: down one student in eight since, by the district&apos;s own count (
          <Src id="suptMessageFy27" />), worst in kindergarten. Meanwhile the money kept coming:
          the state check, cushioned by the formula&apos;s one-year lag, and a flood of temporary
          federal relief.
        </Takeaway>
        <div className="mt-8">
          <EsserCliff />
        </div>
        <Takeaway>
          The district&apos;s own citizen committee said it in spring 2023, six months before
          the strike: the relief was &ldquo;hiding the looming shortfall ... from the general
          public&rdquo; (<Src id="cbrcFy24" />). Then November 2023, the first strike in district
          history, at a press-reported cost near $175 million over three years (
          <Src id="opbStrikeFaq" />). Then the relief ran out. Then the cuts: $30 million, $40
          million, $56.3 million, with more than $65 million already projected for next year (
          <Src id="budgetFy27Vol1" />).
        </Takeaway>
        <Bridge
          href="#where-it-goes"
          question="Where inside the operating fund did the squeeze actually land?"
        />
      </Section>

      <Section
        id="where-it-goes"
        eyebrow="What happened · 5 of 12"
        title="Where does the operating dollar go?"
        lead="Seventy-nine cents of it is people, and the fastest-growing piece is a pension bill set in Salem decades ago. When cuts came, classrooms gave up ground twice as fast as the back office."
        tone="warm"
        aside={
          <Insight
            number="4% → 23%"
            label="the pension rate jump now arriving, promised by 1990s legislatures and sealed by the courts. The reserve built for it was spent in one year."
            money="committed"
          />
        }
      >
        <Prose>
          <p>
            Of the $862 million operating fund, 78.9 percent, $680.5 million, is salaries and
            benefits (<Src id="budgetFy27Vol1" />). The fastest-growing piece is not salaries.
            It is the pension bill, jumping from roughly 4 percent of payroll to nearly 23 (
            <Src id="cbrcFy27" />). A number that strange needs its own explanation, because
            nobody at PPS chose it.
          </p>
        </Prose>
        <div className="mt-8 rounded-sm border border-[var(--color-parchment)] bg-white p-5 sm:p-6">
          <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.18em] text-[var(--color-ember)]">
            The pension bill, explained
          </p>
          <div className="mt-4 grid gap-x-8 gap-y-5 md:grid-cols-2">
            <div>
              <p className="text-[14px] font-semibold text-[var(--color-ink)]">What PERS is</p>
              <p className="mt-1.5 text-[13.5px] leading-relaxed text-[var(--color-ink-light)]">
                The statewide pension system the legislature created in 1945 for every Oregon
                public employer (<Src id="persOverview" />). The district writes the checks and
                controls nothing else. Rates are set in Salem by the PERS board, on its
                actuaries&apos; schedule.
              </p>
            </div>
            <div>
              <p className="text-[14px] font-semibold text-[var(--color-ink)]">Where the hole came from</p>
              <p className="mt-1.5 text-[13.5px] leading-relaxed text-[var(--color-ink-light)]">
                For workers hired before 1996, the state guaranteed retirement accounts would grow
                about 8 percent a year, in good markets and bad. The crashes of 2001 and 2008
                turned those guarantees into debt, and in 2015 the Oregon Supreme Court ruled
                earned benefits cannot be cut. Every public employer now pays extra to fill the
                hole. That surcharge is most of the 23 percent.
              </p>
            </div>
            <div>
              <p className="text-[14px] font-semibold text-[var(--color-ink)]">Why PPS looked immune for twenty years</p>
              <p className="mt-1.5 text-[13.5px] leading-relaxed text-[var(--color-ink-light)]">
                In 2002 and 2003 the district borrowed hundreds of millions through pension bonds,
                $510.3 million still outstanding (<Src id="acfrFy2025" />), and parked the money
                with PERS. The investment credits paid most of its pension bill for two decades
                and held its rate near 4 percent. They are running out now, on a schedule
                published years in advance. The jump was a calendar event, not a surprise.
              </p>
            </div>
            <div>
              <p className="text-[14px] font-semibold text-[var(--color-ink)]">So who is to blame?</p>
              <p className="mt-1.5 text-[13.5px] leading-relaxed text-[var(--color-ink-light)]">
                For the rate: legislatures and pension boards of the 1980s and 1990s, and the
                courts that sealed their promises. Nobody now at PPS had a vote. For being
                unready: the district. It built a reserve for exactly this moment and spent it
                in a single year, down to its last $394,000 (<Src id="tsccFy26" />).
              </p>
            </div>
          </div>
        </div>
        <div className="mt-8 overflow-x-auto rounded-sm border border-[var(--color-parchment)] bg-white">
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
                  <td className="px-4 py-3 text-[13.5px] font-semibold text-[var(--color-ink)]">{r.group}</td>
                  <td className="px-4 py-3 font-mono text-[13px] tabular-nums text-[var(--color-ink-light)]">{r.fy22.toLocaleString()}</td>
                  <td className="px-4 py-3 font-mono text-[13px] tabular-nums text-[var(--color-ink-light)]">{r.fy26.toLocaleString()}</td>
                  <td className={`px-4 py-3 font-mono text-[13px] font-semibold tabular-nums ${r.pct < 0 ? "text-[var(--color-clay)]" : "text-[var(--color-fern)]"}`}>
                    {r.pct > 0 ? "+" : ""}{r.pct}%
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <p className="border-t border-[var(--color-parchment)] px-4 py-2.5 text-[12px] leading-snug text-[var(--color-ink-light)]">
            Special programs grew because special-education caseloads grew, and federal law
            protects that service. It is the least-cuttable line on this table, not the most
            bloated.
          </p>
          <p className="border-t border-[var(--color-parchment)] px-4 py-2 font-mono text-[10px] uppercase tracking-[0.12em] text-[var(--color-ink-muted)]">
            PPS FY2025-26 Adopted Budget, FTE by major function
          </p>
        </div>
        <Takeaway>
          Regular instruction gave up 12.2 percent while central business support gave up 5.5,
          and nobody outside the building can check the central-office claims, because no
          publication separates them; the committee called the central line &ldquo;not clearly
          presented&rdquo; (<Src id="cbrcFy26" />). One paradox to carry forward: real dollars
          per student are <em>up</em> 24 percent over the decade, because enrollment fell faster
          than inflation, and the institution still feels poorer every year, because its fixed
          footprint never shrank.
        </Takeaway>
        <Bridge
          href="#the-benchmarks"
          question="Is $22,000 a student a lot? And are teachers the reason?"
        />
      </Section>

      <Section
        id="the-benchmarks"
        eyebrow="What happened · 6 of 12"
        title="Is that a lot of money? And are teachers paid too much?"
        lead="Yes, and no. PPS spends about a quarter more per student than its Oregon peers, and its teachers' salaries, adjusted for Portland prices, rank last among six peer cities. The difference disappears into pensions, benefits, buildings, and overhead."
        aside={
          <Insight
            number="+27%"
            label="PPS operating spending per student above the Oregon average, on the state's own books. Every other large district sits within 2 percent of that average."
            money={["committed", "movable"]}
          />
        }
      >
        <Prose>
          <p>
            Two ground rules. Per-student spending can be counted Oregon&apos;s way or the federal
            way, and the two produce different numbers for the same district (
            <Src id="odeNoe2324" />
            <Src id="censusFin2024" />), so each panel below compares like with like and the panels
            are never mixed. And &ldquo;should&rdquo; has no neutral answer, so the closest thing
            offered is the state&apos;s own: Oregon&apos;s Quality Education Model, which the
            legislature commissioned and has never funded.
          </p>
        </Prose>
        <Benchmarks />
        <Takeaway>
          Put the halves together and the two loudest arguments in town both fail. &ldquo;PPS is
          starved&rdquo; does not survive the peer comparison. &ldquo;Teachers are overpaid&rdquo;
          does not survive the cost-of-living table (<Src id="beaRpp2024" />
          <Src id="neaPay2025" />). What remains is a district that takes in more per student
          than nearly anyone it can fairly be compared to, and gets less of it into classroom
          teaching, because pensions, benefits, buildings, and overhead take their cut first.
        </Takeaway>
        <Bridge
          href="#empty-seats"
          question="If it's a lot, where does it go instead of classrooms? Start with the buildings."
        />
      </Section>

      <Section
        id="empty-seats"
        eyebrow="What happened · 7 of 12"
        title="Why do the buildings matter so much?"
        lead="Sixteen thousand empty seats, and the real cost is not the dollars. Below a certain size a school cannot offer what a larger one can, and Portland now has a lot of schools below that size."
        tone="warm"
        aside={
          <Insight
            number="16,511"
            label="empty seats across 70 schools, by the district's own capacity numbers. Sixteen schools are less than half full, and ten of those are Title I."
            money="movable"
          />
        }
      >
        <Prose>
          <p>
            The district runs about 80 schools for a student body down 16 percent from its peak,
            forecast to fall toward 39,900 by 2028-29 (<Src id="tsccFy26" />). Every year that
            gap pays principals, boilers, and bus routes for seats with no students in them, out
            of the fund that is cutting teachers. That is the money argument, and it is the
            smaller one. The district&apos;s own case for consolidating is about what a school can
            offer: a counselor five days a week instead of two, a librarian, a full slate of
            electives, and a school of 160 does not get there on any budget. Consolidation began
            in fall 2026 with up to 20 schools reported on the table (
            <Src id="wwTwentySchools" />, press). Here is the whole footprint, school by school,
            from an open-source compilation of the district&apos;s own numbers (
            <Src id="ppsdataInfo" />) that we checked against the state enrollment file, the
            facility plan, and the engineers&apos; seismic report before using it (
            <Src id="odeFallMembership2526" />
            <Src id="lrfp2021" />
            <Src id="holmesSeismic2024" />):
          </p>
        </Prose>
        <SchoolUtilization />
        <Takeaway>
          Both sides of the coming fight are right about something. Small schools are something
          Portland pays extra for on purpose, and the last closures fell hardest on Black and
          brown North and Northeast Portland. But per-building savings of one to two million
          dollars will not close a $65 million gap, so the honest test is not savings. It is two
          published documents before any vote: what closing saves, and what students at the
          receiving school actually gain, in named programs and positions. Neither exists.
        </Takeaway>
        <Bridge
          href="#waste"
          question="Is any of this waste? It depends what the word means."
        />
      </Section>

      {/* ════ THE JUDGMENT CALLS ════ */}

      <Section
        id="waste"
        eyebrow="The judgment calls · 8 of 12"
        title="Where is the waste, really?"
        lead="Not in a hidden pot; there is none big enough to matter. It is in bond overruns that could never have paid a teacher, five years of not deciding about buildings, and a district that moves late."
        aside={
          <Insight
            number="0"
            label="hidden pots of money. The waste that exists is overruns, delay, and numbers nobody outside the building can check."
            money={["locked", "committed", "movable"]}
          />
        }
      >
        <WasteVerdicts />
        <Lede>
          The construction bonds deserve their own exhibit. They hold the district&apos;s biggest
          self-inflicted losses and also its best recent work, the proof that it can deliver on
          budget when the number voters see is honest to begin with:
        </Lede>
        <div className="mt-4">
          <BondLedger />
        </div>
        <Lede>
          A ledger of overruns raises the natural question: <em>why</em>, and how much of it is
          anyone&apos;s fault? Benson is the one project where the audit trail answers step by
          step (<Src id="bondAuditY6" />
          <Src id="opbBondTrim" />
          <Src id="turnerCostIndex" />
          <Src id="megaprojectBaseRates" />):
        </Lede>
        <OverrunAnatomy />
        <Bridge
          href="#arguments"
          question="Who is right in the four fights Portland keeps having?"
        />
      </Section>

      <Section
        id="arguments"
        eyebrow="The judgment calls · 9 of 12"
        title="Who is right in the four fights Portland keeps having?"
        lead="Nobody entirely. We give each side its best argument, then say where the evidence lands. Three of the four stall at the same wall: a document the district holds and has never published."
        tone="warm"
        aside={
          <Insight
            number="3 of 4"
            label="of the city's biggest budget fights would end tomorrow if the district published one document it already has. The eight missing documents are listed below."
            money="movable"
          />
        }
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

        <Takeaway>
          Notice the pattern. The broke-or-hiding fight would end with the district&apos;s
          staffing records. The strike fight would end with the settlement cost model it built to
          negotiate. The equity question would end with the effectiveness study its own committee
          asked for twice. All three sit in district files today.
        </Takeaway>
        <div id="cannot-know" className="scroll-mt-24">
          <CannotKnow />
        </div>
        <Bridge href="#the-plan" question="Diagnosis done. What could the board actually do?" />
      </Section>

      {/* ════ THE PLAN ════ */}

      <Section
        id="the-plan"
        eyebrow="The plan · 10 of 12"
        title="Ten things the school board could actually do."
        lead="Everything above is diagnosis. This is the treatment: specific enough to vote on, in the order it should happen, starting with the three that cost nothing because they are about publishing, not spending."
        tone="dark"
        aside={
          <Insight
            number="$0"
            label="the cost of the first three decisions. They require the district to publish what it already has, and they make every later decision checkable."
            money="movable"
            dark
          />
        }
      >
        <PlanDecisions />
        <Bridge href="#watch" question="And what can you do, starting this month?" dark />
      </Section>

      <Section
        id="watch"
        eyebrow="Your part · 11 of 12"
        title="What do you do with all of this?"
        lead="You do not need to read 500 pages to hold the district accountable. You need six questions, six dates, the address of the board room, and one rule to read every budget by."
        aside={
          <Insight
            number="6"
            label="questions that end most school-budget arguments, portable and neutral. Use them on anyone, including us."
            money="movable"
          />
        }
      >
        <FieldKit />
        <div className="mt-10">
          <p className="mb-4 font-mono text-[10px] font-semibold uppercase tracking-[0.18em] text-[var(--color-ember)]">
            The calendar: six tripwires, and your move at each
          </p>
          <Tripwires />
        </div>
        <div id="doctrine" className="mt-10 scroll-mt-24">
          <p className="mb-4 font-mono text-[10px] font-semibold uppercase tracking-[0.18em] text-[var(--color-ember)]">
            One rule to carry out of here
          </p>
          <DoctrineCard />
        </div>
        <Bridge href="#method" question="How does this page know what it claims?" />
      </Section>

      {/* ── method ── */}
      <Section
        id="method"
        eyebrow="Method · 12 of 12"
        title="How this page knows what it claims."
        lead="Built on 134 public documents, archived with a tamper-evident record, and two fact-checked working papers."
        tone="warm"
      >
        <Prose>
          <p>
            This page condenses two longer working papers: the research document{" "}
            <Src id="researchDoc" /> and the recommendations <Src id="planDoc" />. Every figure was
            checked page-by-page against the source documents, and the plan was stress-tested
            against the strongest counterarguments we could construct from seven hostile
            perspectives, then rewritten until it held. The corpus, 134 public documents fetched
            and checksummed with every extraction citing its page, is public: <Src id="pclAnalysis" />.
          </p>
          <p>
            Three cautions, each for a different reason. First, some figures exist only in press
            reporting, never in an official document: the strike settlement cost, the closure
            counts, the kindergarten capture rate. They are labeled press wherever they appear.
            Second, for anyone fact-checking with a search engine: portlandschools.org and
            portlandk12.org belong to Portland, <em>Maine</em>, whose school budget really does go
            to a voter referendum every June, so headlines about &ldquo;Portland voters&rdquo;
            approving a school budget are about a different Portland; no Oregon school budget is
            ever voted on directly. Third, the official Oregon record disagrees with itself: our
            extraction logged nineteen contradictions between the oversight bodies&apos; own
            published tables, and the district&apos;s audited annual report carries an impossible
            enrollment figure in its statistical section. Where sources conflict, this page shows
            the conflict rather than smoothing it over.
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
