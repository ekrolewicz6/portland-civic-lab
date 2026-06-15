import type { Metadata } from "next";
import Link from "next/link";
import {
  PiggyBank,
  Receipt,
  ArrowRight,
  Scale,
  EyeOff,
  Repeat,
  Landmark,
} from "lucide-react";
import { HEADLINE, SOURCES, FACTS } from "@/lib/fpdr/data";
import { fmtMoney, fmtMillions, fmtPct } from "@/lib/fpdr/engine";
import PersonalCostCalculator from "@/components/deep-dives/fpdr/PersonalCostCalculator";
import ReformSimulator from "@/components/deep-dives/fpdr/ReformSimulator";
import LevyGrowthChart from "@/components/deep-dives/fpdr/LevyGrowthChart";
import SpendingChart from "@/components/deep-dives/fpdr/SpendingChart";
import WhoBenefits from "@/components/deep-dives/fpdr/WhoBenefits";
import ReformMenu from "@/components/deep-dives/fpdr/ReformMenu";

export const metadata: Metadata = {
  title: "The Pension on Your Property Tax Bill — FPDR Explained | Portland Civic Lab",
  description:
    "Portland owes $3.9 billion in police and fire pensions and has saved almost none of it. A plain-language, interactive deep-dive into FPDR: what it costs you, who gets it, and how it could be fixed.",
};

const NAV = [
  { id: "what", label: "What it is" },
  { id: "cost", label: "Your cost" },
  { id: "growing", label: "The trend" },
  { id: "who", label: "Who gets it" },
  { id: "hard", label: "Why it's stuck" },
  { id: "fix", label: "Try a fix" },
  { id: "menu", label: "All the fixes" },
  { id: "sources", label: "Sources" },
];

function Src({ id }: { id: keyof typeof SOURCES }) {
  const s = SOURCES[id];
  return (
    <a
      href={s.url}
      target="_blank"
      rel="noopener noreferrer"
      className="text-[var(--color-river-deep)] underline decoration-[var(--color-river)]/40 underline-offset-2 hover:decoration-[var(--color-river)]"
    >
      {s.org}
    </a>
  );
}

const SECTION = "max-w-[1080px] mx-auto px-5 sm:px-8";

export default function FpdrDeepDivePage() {
  const wastedShare = 1 - HEADLINE.fundedRatio;

  return (
    <div className="bg-[var(--color-paper)]">
      {/* ───────────────────────── Hero ───────────────────────── */}
      <section className="relative bg-[var(--color-canopy)] text-white noise-overlay overflow-hidden">
        <div className="absolute top-0 right-0 w-[620px] h-[620px] bg-[var(--color-canopy-light)] rounded-full blur-[180px] opacity-25 -translate-y-1/3 translate-x-1/4 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[420px] h-[420px] bg-[var(--color-ember)] rounded-full blur-[160px] opacity-[0.07] translate-y-1/2 -translate-x-1/3 pointer-events-none" />
        <div className="relative z-10 max-w-[1080px] mx-auto px-5 sm:px-8 py-16 sm:py-24">
          <div className="flex items-center gap-3 text-[10px] font-mono uppercase tracking-[0.22em] text-[var(--color-ember)]/90">
            <Link href="/deep-dives" className="hover:text-[var(--color-ember-bright)] transition-colors">
              Policy Deep-Dive
            </Link>
            <div className="w-8 h-px bg-[var(--color-ember)]/50" />
            <span>Portland budgets</span>
          </div>

          <h1 className="mt-6 font-editorial-normal text-[40px] sm:text-[58px] lg:text-[70px] leading-[1.04] tracking-tight max-w-4xl">
            The pension hiding on your
            <span className="block font-editorial italic text-[var(--color-ember-bright)]">
              property tax bill
            </span>
          </h1>

          <p className="mt-6 max-w-2xl text-[17px] sm:text-[20px] text-white/75 leading-relaxed">
            Portland has promised <strong className="text-white">{fmtMoney(HEADLINE.liability)}</strong> in
            retirement and disability benefits to its police and firefighters — and has saved almost
            none of it. Instead, the bill lands on your property taxes, a little more every year.
            Here&apos;s how it works, what it costs you, and how it could be fixed.
          </p>

          <div className="mt-9 flex flex-col sm:flex-row gap-3">
            <a
              href="#cost"
              className="inline-flex items-center justify-center gap-2 rounded-sm bg-[var(--color-ember)] px-5 py-3 text-[15px] font-semibold text-[var(--color-canopy)] transition-colors hover:bg-[var(--color-ember-bright)]"
            >
              See what it costs you
              <ArrowRight className="w-4 h-4" />
            </a>
            <a
              href="#fix"
              className="inline-flex items-center justify-center gap-2 rounded-sm border border-white/15 bg-white/[0.06] px-5 py-3 text-[15px] font-semibold text-white transition-colors hover:bg-white/10"
            >
              Try fixing it yourself
            </a>
          </div>
        </div>
      </section>

      {/* ─────────────────── 30-second version ─────────────────── */}
      <section className="bg-[var(--color-canopy-mid)] text-white border-t border-white/10">
        <div className="max-w-[1080px] mx-auto px-5 sm:px-8 py-10 grid grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { v: fmtMoney(HEADLINE.liability), l: "promised to retirees", s: "in today's dollars" },
            { v: fmtPct(wastedShare, 1), l: "of it is unsaved", s: `only ${fmtMoney(HEADLINE.assets)} set aside` },
            { v: `${fmtMoney(HEADLINE.annualLevyFY26)}`, l: "from property taxes this year", s: "and rising every year" },
            { v: fmtPct(HEADLINE.shareOfCityLine, 0), l: "of your city tax line", s: "goes to this one fund" },
          ].map((s) => (
            <div key={s.l}>
              <p className="font-mono text-[30px] sm:text-[38px] font-bold tabular-nums leading-none text-[var(--color-ember-bright)]">
                {s.v}
              </p>
              <p className="text-[13px] font-semibold mt-2 leading-snug">{s.l}</p>
              <p className="text-[12px] text-white/55 mt-0.5">{s.s}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ─────────────────── Sticky section nav ─────────────────── */}
      <nav className="sticky top-14 z-40 bg-[var(--color-paper)]/95 backdrop-blur border-b border-[var(--color-parchment)]">
        <div className="max-w-[1080px] mx-auto px-5 sm:px-8">
          <div className="flex gap-1 overflow-x-auto py-2 text-[12px] font-mono uppercase tracking-[0.08em] scrollbar-hide">
            {NAV.map((n) => (
              <a
                key={n.id}
                href={`#${n.id}`}
                className="whitespace-nowrap rounded-sm px-3 py-1.5 text-[var(--color-ink-muted)] hover:bg-[var(--color-paper-warm)] hover:text-[var(--color-canopy)] transition-colors"
              >
                {n.label}
              </a>
            ))}
          </div>
        </div>
      </nav>

      {/* ───────────────────── What it is ───────────────────── */}
      <section id="what" className="py-16 sm:py-20">
        <div className={SECTION}>
          <Eyebrow>The basics</Eyebrow>
          <H2>A pension fund with almost no money in it</H2>
          <Lead>
            FPDR stands for <strong>Fire &amp; Police Disability and Retirement</strong>. It pays
            pensions, disability, and survivor benefits to Portland&apos;s police officers and
            firefighters. The benefits themselves are normal. What&apos;s strange — and expensive — is
            how Portland pays for them.
          </Lead>

          <div className="mt-10 grid md:grid-cols-2 gap-5">
            <div className="rounded-sm border border-[var(--color-parchment)] bg-white p-7">
              <div className="flex items-center gap-2.5 mb-3">
                <PiggyBank className="w-6 h-6 text-[var(--color-fern)]" />
                <h3 className="font-editorial-normal text-[20px] text-[var(--color-canopy)]">
                  How almost every pension works
                </h3>
              </div>
              <p className="text-[14px] text-[var(--color-ink-light)] leading-relaxed">
                Money is set aside <strong>while you&apos;re still working</strong> and invested for
                decades. By the time you retire, investment growth has done most of the heavy
                lifting. It&apos;s a piggy bank that fills up and earns interest. This is how Oregon&apos;s
                PERS system works, and nearly every other public pension in the country.
              </p>
            </div>
            <div className="rounded-sm border-2 border-[var(--color-clay)]/30 bg-[#fbf4f0] p-7">
              <div className="flex items-center gap-2.5 mb-3">
                <Receipt className="w-6 h-6 text-[var(--color-clay)]" />
                <h3 className="font-editorial-normal text-[20px] text-[var(--color-clay)]">
                  How FPDR works: &ldquo;pay-as-you-go&rdquo;
                </h3>
              </div>
              <p className="text-[14px] text-[var(--color-ink-light)] leading-relaxed">
                Portland saves <strong>essentially nothing</strong>. Each year, property taxes are
                collected to cover that year&apos;s retiree checks — and that&apos;s it. There&apos;s no invested
                piggy bank doing the work, so taxpayers are on the hook for the whole thing, forever.
                Analysts say only Portland and Puerto Rico still run a public pension this way.
              </p>
            </div>
          </div>

          <div className="mt-8 rounded-sm bg-[var(--color-canopy)] text-white p-7 sm:p-9">
            <p className="text-[16px] sm:text-[18px] leading-relaxed">
              The result: FPDR has promised{" "}
              <strong className="text-[var(--color-ember-bright)]">{fmtMoney(HEADLINE.liability)}</strong>{" "}
              in benefits but holds just{" "}
              <strong className="text-[var(--color-ember-bright)]">{fmtMoney(HEADLINE.assets)}</strong>{" "}
              in savings — less than{" "}
              <strong className="text-[var(--color-ember-bright)]">one percent</strong> of what it owes.
              A normal pension aims for 100%.
            </p>
            <p className="text-[12px] text-white/55 mt-3">
              Source: <Src id="milliman2024" /> actuarial valuation, June 30, 2024.
            </p>
          </div>

          {/* Where the money goes */}
          <div className="mt-12">
            <H3>Where this year&apos;s money goes</H3>
            <p className="text-[14px] text-[var(--color-ink-light)] leading-relaxed mt-2 mb-6 max-w-2xl">
              Of the roughly {fmtMoney(HEADLINE.annualLevyFY26)} collected this year, most pays
              pensions to people who already retired. A growing slice pre-funds PERS for officers and
              firefighters hired since 2007 — so Portland is now paying for{" "}
              <strong>two systems at once.</strong>
            </p>
            <SpendingChart />
            <p className="text-[12px] text-[var(--color-ink-muted)] mt-4">
              Program spending, FY2025-26. Source: <Src id="fiveYearPlan" />.
            </p>
          </div>
        </div>
      </section>

      {/* ───────────────────── Your cost ───────────────────── */}
      <section id="cost" className="py-16 sm:py-20 bg-[var(--color-paper-warm)] border-y border-[var(--color-parchment)]">
        <div className={SECTION}>
          <Eyebrow>Your cost</Eyebrow>
          <H2>What are you personally paying?</H2>
          <Lead>
            FPDR is its own line on your Multnomah County property tax bill. Move the slider to your
            home&apos;s assessed value to see your share.
          </Lead>
          <div className="mt-10">
            <PersonalCostCalculator />
          </div>
          <p className="text-[12px] text-[var(--color-ink-muted)] mt-4 max-w-2xl leading-relaxed">
            Based on the FY2025-26 FPDR rate of ${HEADLINE.ratePer1000AV_FY26.toFixed(4)} per $1,000 of
            assessed value (<Src id="county2526" />). In Oregon, a home&apos;s assessed value is usually
            well below its market value, so your real-world bill tracks the assessed number, not the
            sale price.
          </p>
        </div>
      </section>

      {/* ───────────────────── The trend ───────────────────── */}
      <section id="growing" className="py-16 sm:py-20">
        <div className={SECTION}>
          <Eyebrow>The trend</Eyebrow>
          <H2>The bill keeps climbing</H2>
          <Lead>
            Because Portland never saved up, the yearly tax bill grows as more officers and
            firefighters retire. It has gone from about $169 million a few years ago to{" "}
            {fmtMoney(HEADLINE.annualLevyFY27)} just approved for next year.
          </Lead>
          <div className="mt-10 rounded-sm border border-[var(--color-parchment)] bg-white p-6 sm:p-8">
            <LevyGrowthChart />
            <p className="text-[12px] text-[var(--color-ink-muted)] mt-3">
              FPDR levy by fiscal year, in millions. FY30 is the city&apos;s own projection. Sources:{" "}
              <Src id="county2526" />, <Src id="fiveYearPlan" />.
            </p>
          </div>

          <div className="mt-8 grid md:grid-cols-2 gap-5">
            <InfoCard
              icon={<Scale className="w-5 h-5 text-[var(--color-ember)]" />}
              title="It quietly squeezes other services"
            >
              Oregon caps how much property tax can be charged. As FPDR&apos;s slice grows, it pushes the
              city toward that cap — and when the cap is hit, other levies get cut (&ldquo;compression&rdquo;).
              In FY2025-26 the City&apos;s tax line lost about {fmtMoney(FACTS.compressionLossCityLineFY26)}{" "}
              this way, money that could have funded parks, police, or libraries.
            </InfoCard>
            <InfoCard
              icon={<Landmark className="w-5 h-5 text-[var(--color-ember)]" />}
              title="But it probably won't hit its ceiling"
            >
              The fund has a legal cap of ${HEADLINE.capPer1000RMV.toFixed(2)} per $1,000 of market
              value. The city&apos;s actuary ran 10,000 scenarios and found less than a{" "}
              {fmtPct(FACTS.capBreachOddsThru2044, 0)} chance of hitting it before 2044 — the rate is
              forecast to crest around 2033, then ease as older retirees pass away.
            </InfoCard>
          </div>
        </div>
      </section>

      {/* ───────────────────── Who gets it ───────────────────── */}
      <section id="who" className="py-16 sm:py-20 bg-[var(--color-paper-warm)] border-y border-[var(--color-parchment)]">
        <div className={SECTION}>
          <Eyebrow>Who gets it</Eyebrow>
          <H2>The people on the other end</H2>
          <Lead>
            This isn&apos;t an abstraction — it&apos;s real benefits for real people who did dangerous jobs.
            About 2,000 retirees and survivors get a check today, and a few hundred officers and
            firefighters are still earning the old pension.
          </Lead>
          <div className="mt-10">
            <WhoBenefits />
          </div>
        </div>
      </section>

      {/* ───────────────────── Why it's stuck ───────────────────── */}
      <section id="hard" className="py-16 sm:py-20">
        <div className={SECTION}>
          <Eyebrow>Why it&apos;s stuck</Eyebrow>
          <H2>If everyone agrees it&apos;s a mess, why isn&apos;t it fixed?</H2>
          <Lead>
            Almost everyone — including the city&apos;s own pension director — agrees pay-as-you-go is the
            wrong way to fund this. It stays in place anyway, for four stubborn reasons.
          </Lead>

          <div className="mt-10 space-y-4">
            <ReasonRow
              n={1}
              icon={<Scale className="w-5 h-5" />}
              title="You can't cut the benefits"
            >
              Oregon courts treat an earned pension as a binding promise. In a line of cases ending
              with <em>Moro v. State</em> (<Src id="moro" />), the Oregon Supreme Court ruled that
              benefits already earned can&apos;t be reduced. So reform can&apos;t shrink the{" "}
              {fmtMoney(HEADLINE.liability)} that&apos;s owed — it can only change <em>how it&apos;s paid for.</em>
            </ReasonRow>
            <ReasonRow
              n={2}
              icon={<Repeat className="w-5 h-5" />}
              title="Fixing it means paying twice for a while"
            >
              To start saving properly, Portland would have to keep paying today&apos;s retirees{" "}
              <strong>and</strong> set aside new money for the future at the same time. That &ldquo;pay
              twice&rdquo; hump is the single hardest part — it raises taxes now to lower them much more
              later. The payoff is real, but it arrives decades after today&apos;s officials are gone.
            </ReasonRow>
            <ReasonRow
              n={3}
              icon={<EyeOff className="w-5 h-5" />}
              title="Almost nobody knows it's there"
            >
              The cost is buried in a line item most people never read, set by a separate board, and
              it rises automatically without a public vote. A problem nobody sees is a problem nobody
              is forced to fix.
            </ReasonRow>
            <ReasonRow
              n={4}
              icon={<Landmark className="w-5 h-5" />}
              title="It needs a citywide vote"
            >
              The rules live in the city charter, so any real change — including the option to start
              saving — would have to go to the ballot. That takes years of public education and
              political will the city hasn&apos;t spent yet, even as it faces a{" "}
              {fmtMoney(FACTS.cityFY26ShortfallLow)}+ budget shortfall.
            </ReasonRow>
          </div>
        </div>
      </section>

      {/* ───────────────────── Try a fix ───────────────────── */}
      <section id="fix" className="py-16 sm:py-20 bg-[var(--color-canopy)] text-white">
        <div className={SECTION}>
          <p className="text-[11px] font-mono font-semibold uppercase tracking-[0.18em] text-[var(--color-ember)]">
            Try a fix
          </p>
          <h2 className="mt-3 font-editorial-normal text-[30px] sm:text-[42px] leading-tight">
            Could saving up actually be cheaper?
          </h2>
          <p className="mt-4 max-w-2xl text-[16px] sm:text-[18px] text-white/75 leading-relaxed">
            Pick a way to start pre-funding and choose how well the investments do. Watch the bill go{" "}
            <span className="text-[var(--color-ember-bright)] font-semibold">up first</span>, then drop
            below the do-nothing path for decades. Set the return to 0% and the savings vanish — proof
            that the only thing that makes saving worth it is investment growth.
          </p>
          <div className="mt-10">
            <ReformSimulator />
          </div>
          <p className="text-[12px] text-white/50 mt-4 max-w-2xl leading-relaxed">
            This is a simplified teaching model, not an official forecast. It&apos;s anchored to real
            figures — the {fmtMillions(8469)} lifetime pay-go cost and the mid-2030s peak from the{" "}
            <Src id="milliman2024" /> projections — and the savings percentages match what analysts
            like Kevin Machiz estimate (<Src id="machizDeck" />). The future bill is shown in plain
            (not inflation-adjusted) dollars.
          </p>
        </div>
      </section>

      {/* ───────────────────── All the fixes ───────────────────── */}
      <section id="menu" className="py-16 sm:py-20">
        <div className="max-w-[1280px] mx-auto px-5 sm:px-8">
          <div className="max-w-[1080px] mx-auto">
            <Eyebrow>The full menu</Eyebrow>
            <H2>Every option, with the catch</H2>
            <Lead>
              There&apos;s no free lunch. Each fix trades near-term pain for long-term savings — or avoids
              the pain by taking on a different risk. Here&apos;s the honest version of each.
            </Lead>
          </div>
          <div className="mt-10">
            <ReformMenu />
          </div>
        </div>
      </section>

      {/* ───────────────────── Sources ───────────────────── */}
      <section id="sources" className="py-16 sm:py-20 bg-[var(--color-paper-warm)] border-t border-[var(--color-parchment)]">
        <div className={SECTION}>
          <Eyebrow>Sources &amp; method</Eyebrow>
          <H2>Where these numbers come from</H2>
          <Lead>
            Every figure on this page is drawn from primary sources — the city&apos;s actuary, county tax
            records, and city budget documents — verified in June 2026. The reform simulator is a
            simplified educational model; everything else is reported data.
          </Lead>
          <div className="mt-8 grid sm:grid-cols-2 gap-x-8 gap-y-3">
            {Object.values(SOURCES).map((s) => (
              <a
                key={s.id}
                href={s.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-start gap-3 rounded-sm border border-transparent hover:border-[var(--color-parchment)] hover:bg-white p-2 -m-2 transition-colors"
              >
                <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-[var(--color-ember)]" />
                <span>
                  <span className="block text-[14px] text-[var(--color-ink)] group-hover:text-[var(--color-canopy)] leading-snug">
                    {s.title}
                  </span>
                  <span className="block text-[12px] text-[var(--color-ink-muted)] font-mono uppercase tracking-wide mt-0.5">
                    {s.org} · {s.kind}
                  </span>
                </span>
              </a>
            ))}
          </div>

          <div className="mt-12 rounded-sm border border-[var(--color-parchment)] bg-white p-7">
            <h3 className="font-editorial-normal text-[20px] text-[var(--color-canopy)]">
              A note on the &ldquo;pay twice&rdquo; debate
            </h3>
            <p className="text-[14px] text-[var(--color-ink-light)] leading-relaxed mt-3">
              People who study FPDR closely — including analysts Kevin Machiz and Marc Poris — argue
              Portland should start pre-funding, because over the life of the plan it could save a
              quarter to a third of the cost. The city counters that the upfront &ldquo;pay twice&rdquo; cost is
              enormous and arrives exactly when budgets are tightest. Both are right: it&apos;s a real
              trade-off between spending more now and spending much less over time. That&apos;s what makes
              it a genuinely hard problem rather than an obvious one.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}

// ── Small presentational helpers ──────────────────────────────────

function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-3 mb-4">
      <div className="w-8 h-px bg-[var(--color-ember)]" />
      <span className="text-[10px] font-mono font-semibold uppercase tracking-[0.22em] text-[var(--color-ember)]">
        {children}
      </span>
    </div>
  );
}

function H2({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="font-editorial text-[30px] sm:text-[42px] text-[var(--color-ink)] leading-tight">
      {children}
    </h2>
  );
}

function H3({ children }: { children: React.ReactNode }) {
  return (
    <h3 className="font-editorial-normal text-[24px] text-[var(--color-canopy)] leading-tight">
      {children}
    </h3>
  );
}

function Lead({ children }: { children: React.ReactNode }) {
  return (
    <p className="mt-4 max-w-2xl text-[16px] sm:text-[17px] text-[var(--color-ink-light)] leading-relaxed">
      {children}
    </p>
  );
}

function InfoCard({
  icon,
  title,
  children,
}: {
  icon: React.ReactNode;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-sm border border-[var(--color-parchment)] bg-white p-6">
      <div className="flex items-center gap-2.5 mb-2">
        {icon}
        <h4 className="text-[15px] font-semibold text-[var(--color-ink)]">{title}</h4>
      </div>
      <p className="text-[13px] text-[var(--color-ink-light)] leading-relaxed">{children}</p>
    </div>
  );
}

function ReasonRow({
  n,
  icon,
  title,
  children,
}: {
  n: number;
  icon: React.ReactNode;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex gap-5 rounded-sm border border-[var(--color-parchment)] bg-white p-6">
      <div className="flex-shrink-0 flex flex-col items-center gap-2">
        <span className="font-mono text-[26px] font-bold text-[var(--color-parchment)] leading-none">
          {n}
        </span>
        <span className="text-[var(--color-ember)]">{icon}</span>
      </div>
      <div>
        <h3 className="text-[17px] font-semibold text-[var(--color-canopy)] mb-1.5">{title}</h3>
        <p className="text-[14px] text-[var(--color-ink-light)] leading-relaxed">{children}</p>
      </div>
    </div>
  );
}
