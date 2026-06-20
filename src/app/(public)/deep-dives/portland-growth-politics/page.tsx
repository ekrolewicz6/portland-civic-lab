import type { ComponentType, ReactNode } from "react";
import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  BadgeDollarSign,
  Building2,
  Calculator,
  CheckCircle2,
  ChevronDown,
  ExternalLink,
  Home,
  Landmark,
  Map,
  Scale,
  Shield,
  SlidersHorizontal,
  Sparkles,
  Users,
} from "lucide-react";
import { DIVE_CONTAINER, Section } from "@/components/deep-dives/shared";
import {
  Measure50Calculator,
  ProjectFeasibilityCalculator,
  PropertyTaxMiniChart,
  ReformLeverSimulator,
  ScarcityTransferCalculator,
} from "@/components/deep-dives/growth-politics/GrowthPoliticsCalculators";
import { ParcelCohortLookup } from "@/components/deep-dives/growth-politics/ParcelCohortLookup";
import {
  COHORTS,
  HEADLINE_STATS,
  NAV,
  PACKAGE_COHORT_IMPACTS,
  REFORMS,
  SOURCES,
  STAKEHOLDER_BARGAIN,
  SYSTEM_LAYERS,
  type SourceKey,
} from "@/lib/growth-politics/data";
import { DEFAULTS, annualTax, fmtMoney, fmtPct } from "@/lib/growth-politics/engine";
import { pageMeta } from "@/lib/page-meta";

export const metadata: Metadata = pageMeta({
  title: "The hidden contradictions in Portland's growth politics",
  description:
    "A Portland Civic Lab deep dive into why Portland's housing and tax rules often protect people already inside the system while making renters, new buyers, and new homes pay today's costs.",
  path: "/deep-dives/portland-growth-politics",
  type: "article",
});

type SourceEntry = (typeof SOURCES)[SourceKey];

const SOURCE_ENTRIES = Object.entries(SOURCES) as Array<[SourceKey, SourceEntry]>;

const CONTRADICTIONS: Array<{
  eyebrow: string;
  title: string;
  problem: string;
  whyItPersists: string;
  sources: SourceKey[];
  icon: ComponentType<{ className?: string }>;
}> = [
  {
    eyebrow: "Fair taxes",
    title: "Similar homes should get similar tax bills. In Portland, they often do not.",
    problem:
      "Two similar homes can carry very different tax bills because Measure 50 limits how fast taxable value can grow and does not generally make that taxable value catch up when a home sells.",
    whyItPersists:
      "The cap really does help some homeowners who could not handle a sudden tax jump. But it also helps some wealthy properties and shifts pressure onto new residents, fees, and income taxes.",
    sources: ["multcoAssessment", "dorMav", "lroInequity"],
    icon: Scale,
  },
  {
    eyebrow: "Supply",
    title: "The city says it wants more homes inside Portland, then makes the next home carry the bill.",
    problem:
      "New housing pays current taxable value, development charges, interest while waiting, affordable-unit costs, design reviews, appeals, and delay risk.",
    whyItPersists:
      "Every rule has a purpose. But together they hit the next home hardest, especially smaller builders and projects that barely work financially.",
    sources: ["sdcExemption", "inclusionary", "permitImprovement", "auditorPermit"],
    icon: Building2,
  },
  {
    eyebrow: "Land use",
    title: "Portland wants a tight urban growth boundary without always accepting urban growth.",
    problem:
      "The region limits outward expansion to protect farms, forests, and compact infrastructure, but local politics still often resists apartments, middle housing, and smaller lots in high-demand places.",
    whyItPersists:
      "Residents experience visible neighborhood change locally, while the missing household, rent premium, and displacement pressure are spread across the whole region.",
    sources: ["metroUgb", "hna", "middleHousing"],
    icon: Map,
  },
  {
    eyebrow: "Affordability",
    title: "Portland wants affordable homes but often hides the cost inside new buildings.",
    problem:
      "Inclusionary housing can create real below-market units, but if the city does not fully pay for that discount, the cost lands on the other units in the same building.",
    whyItPersists:
      "It is politically easier to hide the cost inside a building than to vote for public funding, even if that means fewer projects get built.",
    sources: ["inclusionary", "sb1521"],
    icon: Home,
  },
  {
    eyebrow: "Tenants",
    title: "Protections help tenants already housed but do less for people searching now.",
    problem:
      "Rent caps and relocation assistance reduce shocks for covered households. They do not, by themselves, create enough available homes for people trying to move in, move out, or start over.",
    whyItPersists:
      "The tenant facing a rent hike is visible and urgent. The future renter who cannot find a place is harder to see and often not yet here.",
    sources: ["rentCap", "relocation", "pit"],
    icon: Shield,
  },
  {
    eyebrow: "Revenue",
    title: "Portland taxes paychecks and businesses more visibly than some property wealth.",
    problem:
      "Local income and business taxes are obvious to workers, renters, and firms. Meanwhile, some property that has grown a lot in value still gets taxed on a much smaller value.",
    whyItPersists:
      "Income taxes are easier to collect and can be aimed at higher earners. But when the property-tax problem stays untouched, workers, renters, and businesses feel the imbalance.",
    sources: ["personalTax", "businessTax", "multcoCpr"],
    icon: BadgeDollarSign,
  },
];

const PERSONAL_PATHS = [
  {
    title: "If you rent",
    icon: Users,
    use: "Start with the housing shortage calculator. Change your rent and the shortage premium to see how a tight market turns into yearly cost for your household.",
    question: "How much extra are renters paying because Portland does not have enough homes?",
  },
  {
    title: "If you own a home",
    icon: Home,
    use: "Start with the property-tax calculator. Enter your home's market value and the share of that value that gets taxed from your county record.",
    question: "Is your tax bill lower than a similar newer home, or higher than a similar older one?",
  },
  {
    title: "If you build housing",
    icon: Building2,
    use: "Start with the new-apartment calculator. Move delay, development fees, taxes, and affordable-unit costs until the project flips from possible to impossible.",
    question: "Which costs are worth paying, and which ones mostly stop the next home from existing?",
  },
  {
    title: "If you set policy",
    icon: SlidersHorizontal,
    use: "Use the reform simulator and the public bargain. The goal is not one perfect fix. It is a package that protects vulnerable people while building enough homes.",
    question: "Who gets help, who pays more, and what new homes do people get in return?",
  },
];

const PAGE_FLOW = [
  {
    step: "1",
    title: "Look up an address",
    text: "See whether the parcel looks under-taxed, over-burdened, or mostly affected through the housing shortage.",
    href: "#parcel-lookup",
  },
  {
    step: "2",
    title: "Read the current ledger",
    text: "See the ranked view of which cohorts appear to gain or lose under today's policies before any reform argument.",
    href: "#current-ledger",
  },
  {
    step: "3",
    title: "Understand the rule",
    text: "Measure 50 separates market value from taxable value. That is the hidden mechanism behind much of the politics.",
    href: "#measure-50",
  },
  {
    step: "4",
    title: "Move the levers",
    text: "Use the calculators to see how rent, assessed value, delay, fees, and funding choices change the result.",
    href: "#calculator",
  },
  {
    step: "5",
    title: "Check the bargain",
    text: "A serious reform has to show who pays more, who is protected, and what new homes or services people get back.",
    href: "#package-impact",
  },
] as const;

const FORMULAS = [
  {
    label: "Annual property tax",
    audience: "Owners, buyers, renters in taxed buildings, and local service budgets",
    headline: "This estimates the yearly property-tax bill attached to a home or building.",
    plainEnglish:
      "Start with the property's market value. Then ask what share of that value Oregon actually lets local governments tax. Multiply that taxable share by the local tax rate.",
    code: "Real Market Value x Assessed-Value Ratio / 1,000 x Tax Rate",
    exampleLabel: "Example yearly bill",
    example: `${fmtMoney(DEFAULTS.medianHomeValue)} home x ${fmtPct(DEFAULTS.residentialCpr)} taxable share = ${fmtMoney(annualTax(DEFAULTS.medianHomeValue, DEFAULTS.residentialCpr))}/year`,
    readerImpact:
      "If your address is taxed on a much smaller share, the current owner may have a lower bill than a similar newer property. If it is already above the proposed floor, the floor should not raise it.",
  },
  {
    label: "Annual renter shortage cost",
    audience: "Renters, people trying to move, employers, service workers, and families forming households",
    headline: "This estimates the extra rent paid when too few homes are available.",
    plainEnglish:
      "A tight housing market lets landlords charge more than they could in a looser market. The model treats that as a shortage premium on rent.",
    code: "Monthly Rent x 12 x Shortage Premium x Renter Households",
    exampleLabel: "Example renter burden",
    example: `${fmtMoney(DEFAULTS.medianRent)}/month x 12 x 10% = ${fmtMoney(DEFAULTS.medianRent * 12 * 0.1)}/year for one renting household`,
    readerImpact: `Across ${DEFAULTS.renterHouseholds.toLocaleString()} renter households, that same 10% premium is roughly ${fmtMoney(DEFAULTS.medianRent * 12 * 0.1 * DEFAULTS.renterHouseholds)}/year. This is why renters can be hurt by rules that never appear on their own tax bill.`,
  },
  {
    label: "Value of a lower yearly tax bill",
    audience: "Owners selling property, buyers bidding on property, heirs, landlords, and neighbors",
    headline: "This estimates how a yearly tax discount can turn into property wealth.",
    plainEnglish:
      "A lower tax bill is not just a one-year savings. Buyers may pay more for a property if it comes with lower future bills.",
    code: "Annual Tax Advantage / Investment Return Rate",
    exampleLabel: "Example value of the discount",
    example: `${fmtMoney(2_000)}/year lower tax bill / 5% return = about ${fmtMoney(40_000)} in property value`,
    readerImpact:
      "If you own the under-taxed property, this can increase what the property is worth. If you are trying to buy, build, or rent, the cost may show up as higher prices, fewer homes, or more pressure on other taxes and fees.",
  },
];

const CURRENT_POLICY_COHORT_RANKING = PACKAGE_COHORT_IMPACTS.map((impact) => {
  const signedAmount =
    impact.currentAnnual.kind === "benefit"
      ? impact.currentAnnual.amount
      : impact.currentAnnual.kind === "neutral"
        ? 0
        : -impact.currentAnnual.amount;

  return {
    name: impact.name,
    amount: Math.round(signedAmount),
    label: impact.currentAnnual.label,
    unit: impact.unit,
    explanation: impact.currentPosition,
    confidence: impact.certainty,
  };
}).sort((a, b) => b.amount - a.amount);

const CURRENT_POLICY_MAX_ABS = Math.max(
  1,
  ...CURRENT_POLICY_COHORT_RANKING.map((item) => Math.abs(item.amount)),
);

function fmtSignedMoney(value: number): string {
  if (value === 0) return "$0";
  return `${value > 0 ? "+" : "-"}${fmtMoney(Math.abs(value))}`;
}

function SourceLink({ id, children, tone = "light" }: { id: SourceKey; children?: ReactNode; tone?: "light" | "dark" }) {
  const source = SOURCES[id];
  return (
    <a
      href={source.url}
      target="_blank"
      rel="noopener noreferrer"
      className={`inline-flex items-center gap-1 font-semibold underline underline-offset-4 transition-colors ${
        tone === "dark"
          ? "text-[var(--color-ember-bright)] decoration-[var(--color-ember-bright)]/40 hover:text-white"
          : "text-[var(--color-canopy)] decoration-[var(--color-sage)]/40 hover:text-[var(--color-ember)]"
      }`}
    >
      {children ?? source.org}
      <ExternalLink className="h-3.5 w-3.5" />
    </a>
  );
}

function StatCard({ value, label }: { value: string; label: string }) {
  return (
    <div className="rounded-sm border border-white/12 bg-white/[0.055] p-5 backdrop-blur-sm">
      <p className="font-mono text-[34px] font-bold leading-none tracking-tight text-white tabular-nums">
        {value}
      </p>
      <p className="mt-3 text-[12px] font-semibold uppercase tracking-[0.12em] text-white/58">
        {label}
      </p>
    </div>
  );
}

function MiniKicker({ children }: { children: ReactNode }) {
  return (
    <p className="text-[10px] font-mono font-semibold uppercase tracking-[0.2em] text-[var(--color-ember)]">
      {children}
    </p>
  );
}

function FormulaCard({
  label,
  audience,
  headline,
  plainEnglish,
  code,
  exampleLabel,
  example,
  readerImpact,
}: {
  label: string;
  audience: string;
  headline: string;
  plainEnglish: string;
  code: string;
  exampleLabel: string;
  example: string;
  readerImpact: string;
}) {
  return (
    <div className="-mx-4 min-w-0 border-y border-[var(--color-parchment)] bg-white p-4 sm:mx-0 sm:rounded-sm sm:border sm:p-5">
      <div className="flex h-full flex-col gap-4">
        <div>
          <MiniKicker>{label}</MiniKicker>
          <h4 className="mt-3 font-editorial text-[24px] leading-tight text-[var(--color-ink)]">
            {headline}
          </h4>
          <p className="mt-3 text-[13px] font-semibold leading-relaxed text-[var(--color-canopy)]">
            Who feels this: {audience}.
          </p>
          <p className="mt-3 text-[14px] leading-relaxed text-[var(--color-ink-light)]">
            {plainEnglish}
          </p>
        </div>

        <div className="rounded-sm border border-[var(--color-parchment)] bg-[var(--color-paper-warm)] p-4">
          <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.16em] text-[var(--color-ink-muted)]">
            The math
          </p>
          <p className="mt-2 break-words font-mono text-[12px] leading-relaxed text-[var(--color-ink)] [overflow-wrap:anywhere]">
            {code}
          </p>
        </div>

        <div className="rounded-sm border border-[var(--color-parchment)] bg-[var(--color-paper)] p-4">
          <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.16em] text-[var(--color-ink-muted)]">
            {exampleLabel}
          </p>
          <p className="mt-2 break-words font-mono text-[16px] font-bold leading-relaxed text-[var(--color-ink)] [overflow-wrap:anywhere]">
            {example}
          </p>
        </div>

        <div className="mt-auto border-l border-[var(--color-ember)] pl-4">
          <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.16em] text-[var(--color-ink-muted)]">
            What it means for you
          </p>
          <p className="mt-2 text-[13px] leading-relaxed text-[var(--color-ink-light)]">
            {readerImpact}
          </p>
        </div>
      </div>
    </div>
  );
}

function CurrentPolicyLedger() {
  return (
    <div className="-mx-4 border-y border-[var(--color-parchment)] bg-white p-4 sm:mx-0 sm:rounded-sm sm:border sm:p-6">
      <div className="grid gap-5 xl:grid-cols-[minmax(340px,0.38fr)_minmax(0,0.62fr)]">
        <div>
          <MiniKicker>Current policy ledger</MiniKicker>
          <h3 className="mt-3 font-editorial text-[33px] leading-tight text-[var(--color-ink)]">
            Who appears to gain or lose under today&apos;s rules?
          </h3>
          <p className="mt-4 text-[15px] leading-relaxed text-[var(--color-ink-light)]">
            This is the diagnostic view before any reform package. Positive numbers mean the cohort is modeled
            as receiving a current benefit or protected position. Negative numbers mean the cohort is modeled
            as carrying a current cost, barrier, or exposure.
          </p>
          <div className="mt-5 rounded-sm border border-[var(--color-parchment)] bg-[var(--color-paper-warm)] p-4">
            <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.16em] text-[var(--color-ink-muted)]">
              Method note
            </p>
            <p className="mt-2 text-[13px] leading-relaxed text-[var(--color-ink-light)]">
              Rows use the units shown in each label, so this is a ranked ledger rather than a single
              household-to-household comparison. Some rows are per household, some per project unit, and one
              is system-wide. The dollar label is the important number.
            </p>
          </div>
        </div>

        <div className="min-w-0">
          <div className="mb-3 grid grid-cols-[1fr_1fr] gap-2 text-[11px] font-mono font-semibold uppercase tracking-[0.14em]">
            <p className="rounded-sm bg-[#f3fbf5] px-3 py-2 text-[var(--color-canopy)]">Current gain / protection</p>
            <p className="rounded-sm bg-[#fff7f2] px-3 py-2 text-right text-[#8c3d25]">Current cost / exposure</p>
          </div>
          <div className="grid gap-2">
            {CURRENT_POLICY_COHORT_RANKING.map((item) => {
              const isGain = item.amount > 0;
              const isLoss = item.amount < 0;
              const width = Math.max(3, (Math.abs(item.amount) / CURRENT_POLICY_MAX_ABS) * 100);

              return (
                <div key={item.name} className="rounded-sm border border-[var(--color-parchment)] bg-[var(--color-paper)] p-3">
                  <div className="grid gap-3 lg:grid-cols-[minmax(220px,0.45fr)_minmax(0,0.55fr)] lg:items-center">
                    <div className="min-w-0">
                      <p className="text-[13px] font-bold leading-snug text-[var(--color-ink)]">{item.name}</p>
                      <p className="mt-1 text-[11px] leading-snug text-[var(--color-ink-muted)]">{item.unit}</p>
                    </div>
                    <div className="min-w-0">
                      <div className="grid grid-cols-[1fr_1fr] items-center gap-0">
                        <div className="flex justify-end border-r border-[var(--color-parchment)] pr-1">
                          {isGain ? (
                            <div
                              className="h-5 rounded-l-full bg-[var(--color-sage)]"
                              style={{ width: `${width}%` }}
                            />
                          ) : null}
                        </div>
                        <div className="pl-1">
                          {isLoss ? (
                            <div
                              className="h-5 rounded-r-full bg-[#c95f3c]"
                              style={{ width: `${width}%` }}
                            />
                          ) : null}
                        </div>
                      </div>
                      <div className="mt-2 flex flex-col gap-1 sm:flex-row sm:items-baseline sm:justify-between">
                        <p className={`font-mono text-[18px] font-bold tabular-nums ${
                          isGain ? "text-[var(--color-canopy)]" : isLoss ? "text-[#8c3d25]" : "text-[var(--color-ink)]"
                        }`}>
                          {fmtSignedMoney(item.amount)}
                        </p>
                        <p className="text-[11px] font-semibold leading-snug text-[var(--color-ink-muted)]">
                          {item.label} · certainty {item.confidence.toLowerCase()}
                        </p>
                      </div>
                    </div>
                  </div>
                  <p className="mt-2 text-[12px] leading-relaxed text-[var(--color-ink-light)]">
                    {item.explanation}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

function MechanismStep({
  step,
  title,
  text,
}: {
  step: string;
  title: string;
  text: ReactNode;
}) {
  return (
    <div className="-mx-4 border-y border-[var(--color-parchment)] bg-white p-4 sm:mx-0 sm:rounded-sm sm:border sm:p-5">
      <div className="flex items-center gap-3">
        <span className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-[var(--color-canopy)] font-mono text-[12px] font-bold text-white">
          {step}
        </span>
        <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.16em] text-[var(--color-ember)]">
          Mechanism
        </p>
      </div>
      <h3 className="mt-4 font-editorial text-[25px] leading-tight text-[var(--color-ink)]">{title}</h3>
      <p className="mt-3 text-[14px] leading-relaxed text-[var(--color-ink-light)]">{text}</p>
    </div>
  );
}

function ContradictionCard({
  eyebrow,
  title,
  problem,
  whyItPersists,
  sources,
  icon: Icon,
}: (typeof CONTRADICTIONS)[number]) {
  return (
    <article className="-mx-4 border-y border-[var(--color-parchment)] bg-white p-4 shadow-none sm:mx-0 sm:rounded-sm sm:border sm:p-5 sm:shadow-[0_16px_46px_rgba(15,36,25,0.035)]">
      <div className="flex items-start justify-between gap-4">
        <div>
          <MiniKicker>{eyebrow}</MiniKicker>
          <h3 className="mt-3 font-editorial text-[25px] leading-tight text-[var(--color-ink)]">{title}</h3>
        </div>
        <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-full bg-[var(--color-canopy)] text-white">
          <Icon className="h-5 w-5" />
        </div>
      </div>
      <div className="mt-5 grid gap-4 md:grid-cols-2">
        <div className="border-l border-[var(--color-ember)]/35 pl-4">
          <p className="text-[11px] font-mono font-semibold uppercase tracking-[0.16em] text-[var(--color-ink-muted)]">
            The contradiction
          </p>
          <p className="mt-2 text-[15px] leading-relaxed text-[var(--color-ink-light)]">{problem}</p>
        </div>
        <div className="border-l border-[var(--color-sage)]/45 pl-4">
          <p className="text-[11px] font-mono font-semibold uppercase tracking-[0.16em] text-[var(--color-ink-muted)]">
            Why it survives
          </p>
          <p className="mt-2 text-[15px] leading-relaxed text-[var(--color-ink-light)]">{whyItPersists}</p>
        </div>
      </div>
      <div className="mt-5 flex flex-wrap gap-x-4 gap-y-2 text-[13px]">
        {sources.map((source) => (
          <SourceLink key={source} id={source} />
        ))}
      </div>
    </article>
  );
}

function PolicyLayerCard({ layer }: { layer: (typeof SYSTEM_LAYERS)[number] }) {
  const Icon = layer.icon;
  return (
    <details className="group -mx-4 border-y border-[var(--color-parchment)] bg-white transition-all hover:border-[var(--color-sage)] sm:mx-0 sm:rounded-sm sm:border sm:hover:shadow-[0_20px_70px_rgba(15,36,25,0.08)]">
      <summary className="cursor-pointer list-none p-4 outline-none transition-colors hover:bg-[var(--color-paper)] focus-visible:ring-2 focus-visible:ring-[var(--color-ember)] sm:p-5 [&::-webkit-details-marker]:hidden">
        <div className="flex items-start justify-between gap-4">
          <div className="flex min-w-0 gap-3">
            <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-full bg-[var(--color-paper-warm)] text-[var(--color-canopy)]">
              <Icon className="h-5 w-5" />
            </div>
            <div className="min-w-0">
              <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.16em] text-[var(--color-ember)]">
                Rule layer
              </p>
              <h3 className="mt-2 font-editorial text-[24px] leading-tight text-[var(--color-ink)]">
                {layer.title}
              </h3>
            </div>
          </div>
          <ChevronDown className="mt-1 h-5 w-5 flex-shrink-0 text-[var(--color-ink-muted)] transition-transform group-open:rotate-180" />
        </div>
        <p className="mt-3 hidden text-[14px] leading-relaxed text-[var(--color-ink-light)] sm:line-clamp-2 sm:block">
          {layer.hiddenEffect}
        </p>
        <div className="mt-3 flex w-fit items-center gap-2 rounded-sm border border-[var(--color-parchment)] bg-white px-3 py-2 font-mono text-[10px] font-semibold uppercase tracking-[0.14em] text-[var(--color-ink-muted)] sm:mt-4">
          <span className="group-open:hidden">Open rule details</span>
          <span className="hidden group-open:inline">Close rule details</span>
        </div>
      </summary>

      <div className="border-t border-[var(--color-parchment)] px-4 pb-4 pt-4 sm:px-5 sm:pb-5">
        <div className="mb-4 flex flex-wrap gap-x-4 gap-y-2 text-[13px]">
          <SourceLink id={layer.source}>Source</SourceLink>
        </div>
        <dl className="space-y-4">
          <div>
            <dt className="text-[10px] font-mono font-semibold uppercase tracking-[0.16em] text-[var(--color-ink-muted)]">
              Why this rule exists
            </dt>
            <dd className="mt-1 text-[14px] leading-relaxed text-[var(--color-ink-light)]">{layer.intent}</dd>
          </div>
          <div>
            <dt className="text-[10px] font-mono font-semibold uppercase tracking-[0.16em] text-[var(--color-ink-muted)]">
              What can happen in practice
            </dt>
            <dd className="mt-1 text-[14px] leading-relaxed text-[var(--color-ink-light)]">{layer.hiddenEffect}</dd>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="rounded-sm bg-[var(--color-paper-warm)] p-3">
              <dt className="text-[10px] font-mono font-semibold uppercase tracking-[0.16em] text-[var(--color-canopy)]">
                Who may benefit
              </dt>
              <dd className="mt-1 text-[13px] leading-snug text-[var(--color-ink-light)]">{layer.winners}</dd>
            </div>
            <div className="rounded-sm bg-[var(--color-paper-warm)] p-3">
              <dt className="text-[10px] font-mono font-semibold uppercase tracking-[0.16em] text-[var(--color-ember)]">
                Who may pay more
              </dt>
              <dd className="mt-1 text-[13px] leading-snug text-[var(--color-ink-light)]">{layer.losers}</dd>
            </div>
          </div>
        </dl>
      </div>
    </details>
  );
}

function CohortCard({ cohort }: { cohort: (typeof COHORTS)[number] }) {
  const tone =
    cohort.kind === "winner"
      ? "border-[var(--color-sage)] bg-[#f5fbf6]"
      : cohort.kind === "loser"
        ? "border-[#f0b6a8] bg-[#fff7f3]"
        : "border-[var(--color-parchment)] bg-white";
  const label =
    cohort.kind === "winner" ? "Often benefits" : cohort.kind === "loser" ? "Often pays more" : "Mixed";

  return (
    <details className={`group -mx-4 border-y sm:mx-0 sm:rounded-sm sm:border ${tone}`}>
      <summary className="cursor-pointer list-none p-4 outline-none transition-colors hover:bg-white/45 focus-visible:ring-2 focus-visible:ring-[var(--color-ember)] sm:p-5 [&::-webkit-details-marker]:hidden">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <h3 className="font-editorial text-[22px] leading-tight text-[var(--color-ink)] sm:text-[23px]">
            {cohort.name}
          </h3>
          <span className="rounded-full border border-black/10 bg-white px-3 py-1 text-[10px] font-mono font-semibold uppercase tracking-[0.12em] text-[var(--color-ink-light)]">
            {label}
          </span>
        </div>
        <p className="mt-3 text-[11px] font-mono font-semibold uppercase tracking-[0.13em] text-[var(--color-ink-muted)] sm:text-[12px]">
          {cohort.scale}
        </p>
        <p className="mt-3 hidden rounded-sm bg-white/70 p-3 font-mono text-[12px] leading-relaxed text-[var(--color-ink)] sm:block">
          {cohort.quantified}
        </p>
        <div className="mt-3 flex items-center justify-between gap-3 rounded-sm border border-black/10 bg-white/65 px-3 py-2 font-mono text-[10px] font-semibold uppercase tracking-[0.14em] text-[var(--color-ink-muted)] sm:mt-4">
          <span className="group-open:hidden">How this cohort is affected</span>
          <span className="hidden group-open:inline">Hide cohort detail</span>
          <ChevronDown className="h-4 w-4 transition-transform group-open:rotate-180" />
        </div>
      </summary>

      <div className="border-t border-black/10 px-4 pb-4 pt-4 sm:px-5 sm:pb-5">
        <div className="grid gap-4 md:grid-cols-[0.85fr_1.15fr]">
          <div>
            <p className="text-[10px] font-mono font-semibold uppercase tracking-[0.16em] text-[var(--color-ink-muted)]">
              Key number
            </p>
            <p className="mt-2 rounded-sm bg-white/70 p-3 font-mono text-[12px] leading-relaxed text-[var(--color-ink)]">
              {cohort.quantified}
            </p>
          </div>
          <div>
            <p className="text-[10px] font-mono font-semibold uppercase tracking-[0.16em] text-[var(--color-ink-muted)]">
              Mechanism
            </p>
            <p className="mt-2 text-[14px] leading-relaxed text-[var(--color-ink-light)]">{cohort.mechanism}</p>
          </div>
        </div>
      </div>
    </details>
  );
}

function ReformCard({ reform, index }: { reform: string; index: number }) {
  return (
    <div className="-mx-4 flex gap-4 border-y border-[var(--color-parchment)] bg-white p-4 sm:mx-0 sm:rounded-sm sm:border">
      <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-[var(--color-canopy)] font-mono text-[13px] font-bold text-white">
        {index + 1}
      </div>
      <p className="text-[15px] leading-relaxed text-[var(--color-ink-light)]">{reform}</p>
    </div>
  );
}

function PersonalPathCard({
  title,
  icon: Icon,
  use,
  question,
}: {
  title: string;
  icon: ComponentType<{ className?: string }>;
  use: string;
  question: string;
}) {
  return (
    <div className="-mx-4 border-y border-white/12 bg-white/[0.055] p-4 sm:mx-0 sm:rounded-sm sm:border sm:p-5">
      <Icon className="h-5 w-5 text-[var(--color-ember-bright)]" />
      <h3 className="mt-4 font-editorial text-[25px] leading-tight text-white">{title}</h3>
      <p className="mt-3 text-[14px] leading-relaxed text-white/70">{use}</p>
      <p className="mt-4 border-l border-[var(--color-ember)] pl-4 text-[13px] font-semibold leading-relaxed text-white/90">
        {question}
      </p>
    </div>
  );
}

function FlowCard({ item }: { item: (typeof PAGE_FLOW)[number] }) {
  return (
    <a
      href={item.href}
      className="group -mx-4 border-y border-[var(--color-parchment)] bg-white p-4 transition-all hover:border-[var(--color-sage)] sm:mx-0 sm:rounded-sm sm:border sm:hover:-translate-y-0.5 sm:hover:shadow-[0_18px_48px_rgba(15,36,25,0.08)]"
    >
      <div className="flex items-center justify-between gap-4">
        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[var(--color-canopy)] font-mono text-[13px] font-bold text-white">
          {item.step}
        </span>
        <ArrowRight className="h-4 w-4 text-[var(--color-ember)] transition-transform group-hover:translate-x-0.5" />
      </div>
      <p className="mt-4 text-[15px] font-bold leading-tight text-[var(--color-ink)]">{item.title}</p>
      <p className="mt-2 text-[12px] leading-relaxed text-[var(--color-ink-light)]">{item.text}</p>
    </a>
  );
}

const PACKAGE_RESULT_STYLES = {
  paysMore: {
    label: "Likely pays more",
    className: "border-[#df9b86] bg-[#fff7f2] text-[#8c3d25]",
  },
  losesAdvantage: {
    label: "Gives up hidden value",
    className: "border-[#d6a15f] bg-[#fff8ea] text-[#80511b]",
  },
  benefits: {
    label: "Likely benefits",
    className: "border-[var(--color-sage)] bg-[#f3fbf5] text-[var(--color-canopy)]",
  },
  protected: {
    label: "Protected, but affected",
    className: "border-[#9bb6cf] bg-[#f1f7fb] text-[#244d68]",
  },
  mixed: {
    label: "Mixed / depends",
    className: "border-[var(--color-parchment)] bg-white text-[var(--color-ink-light)]",
  },
} as const;

const ANNUAL_EFFECT_STYLES = {
  cost: "border-[#df9b86] bg-[#fff7f2] text-[#8c3d25]",
  benefit: "border-[var(--color-sage)] bg-[#f3fbf5] text-[var(--color-canopy)]",
  exposure: "border-[#d6a15f] bg-[#fff8ea] text-[#80511b]",
  neutral: "border-[var(--color-parchment)] bg-[var(--color-paper)] text-[var(--color-ink-light)]",
} as const;

function AnnualEffectBox({
  title,
  effect,
}: {
  title: string;
  effect: (typeof PACKAGE_COHORT_IMPACTS)[number]["currentAnnual"];
}) {
  return (
    <div className={`rounded-sm border p-4 ${ANNUAL_EFFECT_STYLES[effect.kind]}`}>
      <p className="text-[10px] font-mono font-semibold uppercase tracking-[0.16em] opacity-70">
        {title}
      </p>
      <p className="mt-2 font-mono text-[28px] font-bold leading-none tracking-tight tabular-nums">
        {fmtMoney(effect.amount)}
      </p>
      <p className="mt-2 text-[12px] font-semibold leading-snug">{effect.label}</p>
    </div>
  );
}

function PackageImpactCard({ impact }: { impact: (typeof PACKAGE_COHORT_IMPACTS)[number] }) {
  const style = PACKAGE_RESULT_STYLES[impact.result];
  const netChange = impact.futureAnnual.amount - impact.currentAnnual.amount;

  return (
    <details className="group -mx-4 min-w-0 border-y border-[var(--color-parchment)] bg-white shadow-none sm:mx-0 sm:rounded-sm sm:border sm:shadow-[0_14px_44px_rgba(15,36,25,0.045)]">
      <summary className="cursor-pointer list-none p-4 outline-none transition-colors hover:bg-[var(--color-paper)] focus-visible:ring-2 focus-visible:ring-[var(--color-ember)] sm:p-5 [&::-webkit-details-marker]:hidden">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <h3 className="max-w-2xl font-editorial text-[23px] leading-tight text-[var(--color-ink)]">
            {impact.name}
          </h3>
          <span
            className={`inline-flex w-fit flex-shrink-0 rounded-full border px-3 py-1 text-[10px] font-mono font-semibold uppercase tracking-[0.12em] ${style.className}`}
          >
            {style.label}
          </span>
        </div>

        <div className="mt-4 flex items-center justify-between gap-3 rounded-sm border border-[var(--color-parchment)] bg-[var(--color-paper)] px-3 py-2 sm:hidden">
          <div>
            <p className="text-[9px] font-mono font-semibold uppercase tracking-[0.16em] text-[var(--color-ink-muted)]">
              Modeled net
            </p>
            <p className="mt-1 font-mono text-[20px] font-bold leading-none tabular-nums text-[var(--color-ink)]">
              {fmtMoney(netChange)}
            </p>
          </div>
          <div className="flex items-center gap-2 font-mono text-[10px] font-semibold uppercase tracking-[0.14em] text-[var(--color-ink-muted)]">
            <span className="group-open:hidden">Open details</span>
            <span className="hidden group-open:inline">Close details</span>
            <ChevronDown className="h-4 w-4 transition-transform group-open:rotate-180" />
          </div>
        </div>

        <div className="mt-4 hidden gap-2 sm:grid sm:grid-cols-[0.7fr_0.7fr_0.7fr_auto] sm:items-center">
          <div className={`rounded-sm border px-3 py-2 ${ANNUAL_EFFECT_STYLES[impact.currentAnnual.kind]}`}>
            <p className="text-[9px] font-mono font-semibold uppercase tracking-[0.16em] opacity-70">
              Current rules
            </p>
            <p className="mt-1 font-mono text-[19px] font-bold leading-none tabular-nums sm:text-[21px]">
              {fmtMoney(impact.currentAnnual.amount)}
            </p>
          </div>
          <div className={`rounded-sm border px-3 py-2 ${ANNUAL_EFFECT_STYLES[impact.futureAnnual.kind]}`}>
            <p className="text-[9px] font-mono font-semibold uppercase tracking-[0.16em] opacity-70">
              With package
            </p>
            <p className="mt-1 font-mono text-[19px] font-bold leading-none tabular-nums sm:text-[21px]">
              {fmtMoney(impact.futureAnnual.amount)}
            </p>
          </div>
          <div className="rounded-sm border border-[var(--color-parchment)] bg-[var(--color-paper)] px-3 py-2">
            <p className="text-[9px] font-mono font-semibold uppercase tracking-[0.16em] text-[var(--color-ink-muted)]">
              Modeled net
            </p>
            <p className="mt-1 font-mono text-[19px] font-bold leading-none tabular-nums text-[var(--color-ink)] sm:text-[21px]">
              {fmtMoney(netChange)}
            </p>
          </div>
          <div className="flex items-center justify-between gap-3 rounded-sm border border-[var(--color-parchment)] bg-white px-3 py-2 text-[11px] font-mono font-semibold uppercase tracking-[0.14em] text-[var(--color-ink-muted)] sm:min-w-[132px] sm:justify-center sm:self-center">
            <span className="group-open:hidden">Open details</span>
            <span className="hidden group-open:inline">Close details</span>
            <ChevronDown className="h-4 w-4 transition-transform group-open:rotate-180" />
          </div>
        </div>
      </summary>

      <div className="border-t border-[var(--color-parchment)] px-4 pb-4 pt-4 sm:px-5 sm:pb-5">
        <div className="grid gap-3 lg:grid-cols-[1fr_1fr_1.35fr]">
          <AnnualEffectBox title="Current rules" effect={impact.currentAnnual} />
          <AnnualEffectBox title="With package" effect={impact.futureAnnual} />
          <div className="rounded-sm border border-[var(--color-parchment)] bg-[var(--color-paper)] p-4">
            <p className="text-[10px] font-mono font-semibold uppercase tracking-[0.16em] text-[var(--color-ink-muted)]">
              Annual change
            </p>
            <p className="mt-2 text-[14px] font-semibold leading-relaxed text-[var(--color-ink)]">
              {impact.annualChange}
            </p>
            <p className="mt-3 text-[11px] font-mono font-semibold uppercase tracking-[0.12em] text-[var(--color-ink-muted)]">
              {impact.unit}
            </p>
          </div>
        </div>

        <div className="mt-5 grid gap-4 lg:grid-cols-2">
          <div className="rounded-sm bg-[var(--color-paper-warm)] p-4">
            <p className="text-[10px] font-mono font-semibold uppercase tracking-[0.16em] text-[var(--color-ink-muted)]">
              Today
            </p>
            <p className="mt-2 text-[14px] leading-relaxed text-[var(--color-ink-light)]">
              {impact.currentPosition}
            </p>
          </div>
          <div className="rounded-sm bg-[var(--color-paper-warm)] p-4">
            <p className="text-[10px] font-mono font-semibold uppercase tracking-[0.16em] text-[var(--color-ink-muted)]">
              Under the ten-part package
            </p>
            <p className="mt-2 text-[14px] leading-relaxed text-[var(--color-ink-light)]">
              {impact.packageEffect}
            </p>
          </div>
        </div>

        <div className="mt-4 grid gap-4 md:grid-cols-3">
          <div className="border-l border-[#df9b86] pl-4">
            <p className="text-[10px] font-mono font-semibold uppercase tracking-[0.16em] text-[var(--color-ink-muted)]">
              New burden
            </p>
            <p className="mt-2 text-[13px] leading-relaxed text-[var(--color-ink-light)]">{impact.burden}</p>
          </div>
          <div className="border-l border-[var(--color-sage)] pl-4">
            <p className="text-[10px] font-mono font-semibold uppercase tracking-[0.16em] text-[var(--color-ink-muted)]">
              Upside
            </p>
            <p className="mt-2 text-[13px] leading-relaxed text-[var(--color-ink-light)]">{impact.benefit}</p>
          </div>
          <div className="border-l border-[var(--color-ember)] pl-4">
            <p className="text-[10px] font-mono font-semibold uppercase tracking-[0.16em] text-[var(--color-ink-muted)]">
              Honest read
            </p>
            <p className="mt-2 text-[13px] leading-relaxed text-[var(--color-ink-light)]">{impact.honesty}</p>
          </div>
        </div>

        <div className="mt-5 flex flex-col gap-2 rounded-sm border border-[var(--color-parchment)] bg-[var(--color-paper)] p-3 sm:flex-row sm:items-start sm:justify-between">
          <p className="text-[12px] leading-relaxed text-[var(--color-ink-muted)]">
            <span className="font-semibold text-[var(--color-ink)]">Method note:</span> {impact.calculationNote}
          </p>
          <p className="w-fit flex-shrink-0 rounded-full border border-[var(--color-parchment)] bg-white px-3 py-1 font-mono text-[10px] font-semibold uppercase tracking-[0.14em] text-[var(--color-ink-muted)]">
            Certainty: {impact.certainty}
          </p>
        </div>
      </div>
    </details>
  );
}

export default function PortlandGrowthPoliticsPage() {
  const packageSummary = PACKAGE_COHORT_IMPACTS.reduce(
    (counts, impact) => {
      counts[impact.result] += 1;
      return counts;
    },
    {
      paysMore: 0,
      losesAdvantage: 0,
      benefits: 0,
      protected: 0,
      mixed: 0,
    },
  );

  return (
    <div className="min-h-screen bg-[var(--color-paper)]">
      <section className="relative overflow-hidden bg-[var(--color-canopy)] text-white noise-overlay">
        <div className="absolute right-[-20%] top-[-20%] h-[760px] w-[760px] rounded-full bg-[var(--color-sage)]/20 blur-[170px]" />
        <div className="absolute bottom-[-28%] left-[-12%] h-[520px] w-[520px] rounded-full bg-[var(--color-ember)]/16 blur-[140px]" />
        <div className={`relative z-10 ${DIVE_CONTAINER} py-16 sm:py-20 xl:py-24`}>
          <Link
            href="/deep-dives"
            className="inline-flex items-center gap-2 text-[13px] font-semibold text-white/70 transition-colors hover:text-white"
          >
            <ArrowRight className="h-4 w-4 rotate-180" />
            Deep Dives
          </Link>

          <div className="mt-10 grid items-end gap-10 xl:grid-cols-[minmax(0,1.05fr)_minmax(360px,0.95fr)]">
            <div>
              <div className="flex flex-wrap items-center gap-3 text-[10px] font-mono font-semibold uppercase tracking-[0.22em] text-[var(--color-ember-bright)]">
                <span>Housing</span>
                <span className="h-px w-8 bg-[var(--color-ember)]/60" />
                <span>Tax policy</span>
                <span className="h-px w-8 bg-[var(--color-ember)]/60" />
                <span>Growth politics</span>
              </div>
              <h1 className="mt-7 max-w-5xl font-editorial-normal text-[46px] leading-[0.98] tracking-tight sm:text-[64px] lg:text-[82px] 2xl:text-[96px]">
                The hidden contradictions in{" "}
                <span className="font-editorial italic text-[var(--color-ember-bright)]">
                  Portland&apos;s growth politics
                </span>
              </h1>
              <p className="mt-7 max-w-3xl text-[18px] leading-relaxed text-white/76 sm:text-[20px]">
                Portland says it wants affordable homes, stable neighborhoods, tenant protection, climate-friendly
                growth, fair taxes, and enough housing for the next generation. The problem is not that those
                goals are fake. The problem is that the rules often make one goal block another.
              </p>
              <div className="mt-7 flex flex-col gap-3 sm:flex-row">
                <a
                  href="#parcel-lookup"
                  className="inline-flex items-center justify-center gap-2 rounded-sm bg-[var(--color-ember-bright)] px-5 py-3 text-[14px] font-bold text-[var(--color-canopy)] transition-colors hover:bg-white"
                >
                  Start with your address
                  <ArrowRight className="h-4 w-4" />
                </a>
                <a
                  href="#calculator"
                  className="inline-flex items-center justify-center gap-2 rounded-sm border border-white/18 bg-white/[0.06] px-5 py-3 text-[14px] font-bold text-white transition-colors hover:border-white/40 hover:bg-white/[0.1]"
                >
                  Jump to calculators
                  <Calculator className="h-4 w-4" />
                </a>
              </div>
              <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                {HEADLINE_STATS.map((stat) => (
                  <StatCard key={stat.label} value={stat.value} label={stat.label} />
                ))}
              </div>
            </div>

            <div className="rounded-sm border border-white/12 bg-white/[0.06] p-5 shadow-[0_28px_90px_rgba(0,0,0,0.18)] backdrop-blur-md">
              <div className="flex items-start justify-between gap-5">
                <div>
                  <MiniKicker>Quick read</MiniKicker>
                  <h2 className="mt-3 font-editorial text-[31px] leading-tight text-white">
                    Same-value homes can get very different tax bills.
                  </h2>
                  <p className="mt-3 text-[14px] leading-relaxed text-white/70">
                    Oregon caps how fast a property&apos;s taxable value can rise. So an older home might
                    be worth {fmtMoney(DEFAULTS.medianHomeValue)} today but get taxed as if much less
                    of that value counts. That lower bill stays with the property when it sells. A new
                    home usually starts closer to today&apos;s value.
                  </p>
                </div>
                <Landmark className="h-8 w-8 flex-shrink-0 text-[var(--color-ember-bright)]" />
              </div>
              <div className="mt-6">
                <PropertyTaxMiniChart />
              </div>
              <p className="mt-4 text-[12px] leading-relaxed text-white/58">
                Modeled on a {fmtMoney(DEFAULTS.medianHomeValue)} property. The blue bar uses Multnomah
                County&apos;s 2025-26 ratio for new or heavily changed residential property.
              </p>
            </div>
          </div>
        </div>
      </section>

      <nav className="sticky top-0 z-30 border-b border-[var(--color-parchment)] bg-[var(--color-paper)]/92 backdrop-blur-md">
        <div className={`${DIVE_CONTAINER} flex gap-2 overflow-x-auto py-3`}>
          {NAV.map((item) => (
            <a
              key={item.id}
              href={`#${item.id}`}
              className="whitespace-nowrap rounded-full border border-[var(--color-parchment)] bg-white px-4 py-2 text-[12px] font-semibold text-[var(--color-ink-light)] transition-colors hover:border-[var(--color-sage)] hover:text-[var(--color-canopy)]"
            >
              {item.label}
            </a>
          ))}
        </div>
      </nav>

      <main>
        <section id="parcel-lookup" className="scroll-mt-24 border-b border-[var(--color-parchment)] bg-[var(--color-paper-warm)] py-8 sm:py-10">
          <div className={DIVE_CONTAINER}>
            <div className="mb-5 grid gap-4 lg:grid-cols-[0.9fr_1.1fr] lg:items-end">
              <div>
                <MiniKicker>Start with your address</MiniKicker>
                <h2 className="mt-2 font-editorial text-[34px] leading-tight text-[var(--color-ink)] sm:text-[42px]">
                  Put the rest of the page in context.
                </h2>
              </div>
              <p className="max-w-3xl text-[15px] leading-relaxed text-[var(--color-ink-light)]">
                The same policy system means different things depending on whether you rent, own, might buy,
                might build, operate a business, or live nearby. Look up an address first; the rest of the page
                explains the citywide rules behind that result.
              </p>
            </div>
            <ParcelCohortLookup />
          </div>
        </section>

        <section className="border-b border-[var(--color-parchment)] bg-white py-6">
          <div className={DIVE_CONTAINER}>
            <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-5">
              {PAGE_FLOW.map((item) => (
                <FlowCard key={item.step} item={item} />
              ))}
            </div>
          </div>
        </section>

        <Section
          id="current-ledger"
          eyebrow="Today, before any reform"
          title="Before the policy fight, look at who is already winning and losing."
          lead="Portland's housing politics often start with the next proposal. But the current system is already moving money around. Some people get lower tax bills, protected property value, or scarcity-driven leverage. Others pay through rent, higher purchase prices, project costs, or weaker public services. The address lookup shows one parcel; the ledger below shows the pattern across groups."
          tone="warm"
        >
          <CurrentPolicyLedger />
        </Section>

        <Section
          id="thesis"
          eyebrow="The thesis"
          title="The fight is about who already gets a deal, and who has to pay today's price."
          lead="This is not just homeowners versus renters, or neighborhood groups versus builders. The real split is between people already helped by old rules and people trying to find a home, buy a first home, build housing, run a business, or fund public services today."
          aside={
            <div className="-mx-4 border-y border-[var(--color-parchment)] bg-white p-4 text-[13px] leading-relaxed text-[var(--color-ink-light)] sm:mx-0 sm:rounded-sm sm:border">
              Source grounding: <SourceLink id="hna">Portland Housing Needs Analysis</SourceLink>,{" "}
              <SourceLink id="multcoAssessment">Multnomah County assessment rules</SourceLink>, and{" "}
              <SourceLink id="lroInequity">Legislative Revenue Office Measure 50 analysis</SourceLink>.
            </div>
          }
        >
          <div className="grid gap-5 lg:grid-cols-[minmax(0,1.25fr)_minmax(300px,0.75fr)] 2xl:grid-cols-[minmax(0,1fr)_minmax(520px,0.8fr)]">
            <div className="-mx-4 border-y border-[var(--color-parchment)] bg-white p-4 sm:mx-0 sm:rounded-sm sm:border sm:p-6">
              <MiniKicker>Plain English</MiniKicker>
              <h3 className="mt-3 font-editorial text-[32px] leading-tight text-[var(--color-ink)]">
                Portland protects many people who are already housed, then asks the next home to carry more of the cost.
              </h3>
              <div className="mt-6 grid gap-5 md:grid-cols-2">
                <p className="text-[16px] leading-relaxed text-[var(--color-ink-light)]">
                  A homeowner with a low taxable value can support tenant protections, climate goals, high design
                  standards, preservation rules, and strict permitting. But many of the costs land somewhere else:
                  on renters, buyers, new buildings, and public-service budgets.
                </p>
                <p className="text-[16px] leading-relaxed text-[var(--color-ink-light)]">
                  That does not make every owner with tax protection rich or selfish. Some are exactly the people policy
                  should protect. But when the protection follows the property instead of the person&apos;s ability
                  to pay, it can also protect wealth and give some owners a financial reason to oppose more homes.
                </p>
              </div>
            </div>
            <div className="-mx-4 border-y border-[var(--color-parchment)] bg-[var(--color-paper-warm)] p-4 sm:mx-0 sm:rounded-sm sm:border sm:p-6">
              <MiniKicker>What this is not saying</MiniKicker>
              <ul className="mt-5 grid gap-4 text-[14px] leading-relaxed text-[var(--color-ink-light)] 2xl:grid-cols-1">
                <li className="flex gap-3">
                  <CheckCircle2 className="mt-0.5 h-5 w-5 flex-shrink-0 text-[var(--color-sage)]" />
                  Older homeowners are not the villain. Some need real help so they are not forced out by taxes.
                </li>
                <li className="flex gap-3">
                  <CheckCircle2 className="mt-0.5 h-5 w-5 flex-shrink-0 text-[var(--color-sage)]" />
                  Tenant protections are not the enemy. They work better when the city also builds enough homes and funds direct help.
                </li>
                <li className="flex gap-3">
                  <CheckCircle2 className="mt-0.5 h-5 w-5 flex-shrink-0 text-[var(--color-sage)]" />
                  The Urban Growth Boundary is not the problem by itself. The problem is limiting outward growth
                  and then blocking enough homes inside the city.
                </li>
              </ul>
            </div>
          </div>

          <div className="mt-6 grid gap-5 md:grid-cols-2">
            {CONTRADICTIONS.map((item) => (
              <ContradictionCard key={item.title} {...item} />
            ))}
          </div>
        </Section>

        <Section
          id="measure-50"
          eyebrow="Measure 50"
          title="The property-tax rule at the center of this."
          lead="Measure 50 is an Oregon tax rule that limits how fast a property's taxable value can rise. That can protect people from sudden tax jumps. It can also mean two similar homes owe very different taxes."
          tone="warm"
        >
          <div className="grid items-start gap-5 xl:grid-cols-[minmax(0,1fr)_minmax(360px,0.42fr)]">
            <div className="grid items-start gap-4 md:grid-cols-3">
              <MechanismStep
                step="1"
                title="Market value is what the property is worth."
                text={
                  <>
                    This is roughly what the home or building would sell for. The lookup uses the county
                    or PortlandMaps market value when available.
                  </>
                }
              />
              <MechanismStep
                step="2"
                title="Assessed value is what the tax system counts."
                text={
                  <>
                    Multnomah County says property taxes are based on assessed value, which can be far lower
                    than market value because of Measure 50.
                  </>
                }
              />
              <MechanismStep
                step="3"
                title="The gap creates winners, losers, and politics."
                text={
                  <>
                    For 2025-26, the county&apos;s changed-property ratio is {fmtPct(DEFAULTS.residentialCpr)}
                    for residential property and {fmtPct(DEFAULTS.multifamilyCpr)} for multifamily property.
                  </>
                }
              />
            </div>

            <div className="-mx-4 border-y border-[var(--color-parchment)] bg-[var(--color-canopy)] p-4 text-white sm:mx-0 sm:rounded-sm sm:border sm:p-5">
              <MiniKicker>Why it matters</MiniKicker>
              <p className="mt-4 font-editorial text-[27px] leading-tight">
                A lower yearly tax bill can become part of the property&apos;s value.
              </p>
              <p className="mt-4 text-[14px] leading-relaxed text-white/72">
                Buyers value lower future bills. Landlords value extra cash flow. Some neighbors then have
                a financial reason to resist new homes that would compete with the old deal.
              </p>
              <div className="mt-5 rounded-sm border border-white/12 bg-white/[0.055] p-4">
                <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.16em] text-white/55">
                  Key distinction
                </p>
                <p className="mt-2 text-[15px] leading-relaxed text-white/86">
                  Protecting someone from being taxed out of a home is different from protecting every
                  dollar of property advantage forever.
                </p>
              </div>
              <div className="mt-4 flex flex-wrap gap-x-4 gap-y-2 text-[13px]">
                <SourceLink id="multcoAssessment" tone="dark">County assessment FAQs</SourceLink>
                <SourceLink id="multcoCpr" tone="dark">Changed-property ratios</SourceLink>
                <SourceLink id="dorMav" tone="dark">DOR tax manual</SourceLink>
                <SourceLink id="lroInequity" tone="dark">LRO fairness report</SourceLink>
              </div>
            </div>
          </div>

          <div className="mt-6 grid min-w-0 gap-5 lg:grid-cols-3">
            {FORMULAS.map((formula) => (
              <FormulaCard key={formula.label} {...formula} />
            ))}
          </div>
        </Section>

        <Section
          id="calculator"
          eyebrow="Calculators"
          title="Change the assumptions and see who pays."
          lead="These are civic math tools, not official tax advice. They show direction and scale: what happens to renters, buyers, projects, and public budgets when Portland moves one cost from one place to another."
          aside={
            <div className="-mx-4 border-y border-[var(--color-parchment)] bg-white p-4 sm:mx-0 sm:rounded-sm sm:border">
              <div className="flex items-center gap-3">
                <Calculator className="h-5 w-5 text-[var(--color-ember)]" />
                <p className="text-[13px] font-semibold text-[var(--color-ink)]">Use your own numbers first.</p>
              </div>
              <p className="mt-3 text-[13px] leading-relaxed text-[var(--color-ink-light)]">
                The point is not the default assumption. The point is how fast the result changes when the
                inputs move.
              </p>
            </div>
          }
          tone="dark"
        >
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {PERSONAL_PATHS.map((path) => (
              <PersonalPathCard key={path.title} {...path} />
            ))}
          </div>
          <div className="mt-8 space-y-8">
            <Measure50Calculator />
            <ScarcityTransferCalculator />
            <ProjectFeasibilityCalculator />
          </div>
        </Section>

        <Section
          id="stack"
          eyebrow="Rules pile-up"
          title="The problem is not one rule. It is what happens when the rules pile up."
          lead="Most Portland housing rules have a good reason behind them. But each one can add cost, delay, or another way to stop a project. The public debate gets confusing when each rule is defended alone and nobody adds up the combined burden."
        >
          <div className="grid gap-5 md:grid-cols-2">
            {SYSTEM_LAYERS.map((layer) => (
              <PolicyLayerCard key={layer.title} layer={layer} />
            ))}
          </div>
        </Section>

        <Section
          id="cohorts"
          eyebrow="Who it affects"
          title="Who benefits and who pays more?"
          lead="These are not moral labels. The same person can benefit in one way and be hurt in another: a homeowner with adult children who rent, a renter who supports apartments but fears displacement, or a small builder who supports strong standards but cannot survive a long delay."
          tone="warm"
        >
          <div className="grid gap-5 md:grid-cols-2">
            {COHORTS.map((cohort) => (
              <CohortCard key={cohort.name} cohort={cohort} />
            ))}
          </div>
        </Section>

        <Section
          id="reforms"
          eyebrow="Reform package"
          title="A serious fix has to protect people and build enough homes."
          lead="The goal is not deregulation for its own sake, and it is not a universal tax reset. The goal is a fairer deal: raise deeply under-taxed property toward a minimum share of market value, protect low-income and fixed-income residents directly, stop hiding public costs inside the next new home, and make the city actually deliver the housing it says it needs."
        >
          <div className="grid gap-6">
            <details className="group -mx-4 border-y border-[var(--color-parchment)] bg-white sm:mx-0 sm:rounded-sm sm:border">
              <summary className="cursor-pointer list-none p-4 outline-none transition-colors hover:bg-[var(--color-paper)] focus-visible:ring-2 focus-visible:ring-[var(--color-ember)] sm:p-6 [&::-webkit-details-marker]:hidden">
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                  <div className="min-w-0">
                    <div className="flex items-center gap-3">
                      <Sparkles className="h-5 w-5 text-[var(--color-ember)]" />
                      <MiniKicker>Ten-part package</MiniKicker>
                    </div>
                    <h3 className="mt-3 max-w-3xl font-editorial text-[30px] leading-tight text-[var(--color-ink)]">
                      The full package is available, but the bargain matters more than memorizing every item.
                    </h3>
                    <p className="mt-3 max-w-3xl text-[14px] leading-relaxed text-[var(--color-ink-light)]">
                      First read the bargain below. Open this list when you want the actual policy components.
                    </p>
                  </div>
                  <div className="flex w-fit items-center gap-3 rounded-sm border border-[var(--color-parchment)] bg-white px-4 py-3 font-mono text-[11px] font-semibold uppercase tracking-[0.14em] text-[var(--color-ink-muted)]">
                    <span className="group-open:hidden">Open 10-part list</span>
                    <span className="hidden group-open:inline">Close 10-part list</span>
                    <ChevronDown className="h-4 w-4 transition-transform group-open:rotate-180" />
                  </div>
                </div>
              </summary>

              <div className="border-t border-[var(--color-parchment)] p-4 sm:p-6 sm:pt-5">
                <div className="grid gap-3 2xl:grid-cols-2">
                  {REFORMS.map((reform, index) => (
                    <ReformCard key={reform} reform={reform} index={index} />
                  ))}
                </div>
              </div>
            </details>
            <div className="-mx-4 border-y border-[var(--color-parchment)] bg-[var(--color-paper-warm)] p-4 sm:mx-0 sm:rounded-sm sm:border sm:p-6">
              <MiniKicker>The bargain</MiniKicker>
              <h3 className="mt-3 font-editorial text-[32px] leading-tight text-[var(--color-ink)]">
                Every group needs a reason to believe the deal is real.
              </h3>
              <div className="mt-6 grid gap-3 md:grid-cols-2 2xl:grid-cols-3">
                {STAKEHOLDER_BARGAIN.map((item) => (
                  <div key={item.audience} className="rounded-sm border border-[var(--color-parchment)] bg-white p-4">
                    <p className="font-mono text-[11px] font-semibold uppercase tracking-[0.16em] text-[var(--color-ember)]">
                      {item.audience}
                    </p>
                    <p className="mt-2 text-[14px] leading-relaxed text-[var(--color-ink-light)]">{item.promise}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="-mx-4 mt-8 border-y border-[var(--color-parchment)] bg-white p-4 sm:mx-0 sm:rounded-sm sm:border sm:p-7">
            <div className="mb-6 flex flex-col justify-between gap-4 md:flex-row md:items-end">
              <div>
                <MiniKicker>What changes for whom?</MiniKicker>
                <h3 className="mt-2 font-editorial text-[32px] leading-tight text-[var(--color-ink)]">
                  A tax fix is not credible unless people can see where the money goes.
                </h3>
              </div>
              <p className="max-w-md text-[14px] leading-relaxed text-[var(--color-ink-light)]">
                The simulator below is intentionally simple. It shows how new taxable value could turn into
                public dollars, and what those dollars could pay for. It assumes new revenue comes from parcels
                below the floor, not automatic cuts for parcels already above it.
              </p>
            </div>
            <ReformLeverSimulator />
          </div>
        </Section>

        <Section
          id="package-impact"
          eyebrow="Cohort balance sheet"
          title="Who would actually carry the burden of this package?"
          lead="A fairer tax base is not free. The revenue-positive version raises deeply under-taxed property toward a minimum share of market value, protects vulnerable households from cash shock, and spends the net new money on renters, future residents, public services, and new homes. The honest version has to say who gives something up."
          tone="warm"
          aside={
            <div className="-mx-4 border-y border-[var(--color-parchment)] bg-white p-4 sm:mx-0 sm:rounded-sm sm:border">
              <p className="text-[12px] font-mono font-semibold uppercase tracking-[0.16em] text-[var(--color-ember)]">
                Quick count
              </p>
              <div className="mt-3 grid grid-cols-2 gap-2 text-[12px] text-[var(--color-ink-light)]">
                <span>{packageSummary.paysMore} pay more</span>
                <span>{packageSummary.losesAdvantage} lose hidden value</span>
                <span>{packageSummary.benefits} benefit</span>
                <span>{packageSummary.protected} protected but affected</span>
                <span className="col-span-2">{packageSummary.mixed} mixed or depends</span>
              </div>
            </div>
          }
        >
          <div className="-mx-4 border-y border-[var(--color-parchment)] bg-[var(--color-canopy)] p-4 text-white sm:mx-0 sm:rounded-sm sm:border sm:p-6">
            <MiniKicker>Plain English</MiniKicker>
            <div className="mt-4 grid gap-5 lg:grid-cols-3">
              <div>
                <p className="font-editorial text-[27px] leading-tight">The clearest payers are protected property positions.</p>
                <p className="mt-3 text-[14px] leading-relaxed text-white/70">
                  Low-tax property below the floor, high-income low-MAV owners, legacy landlords, and underused
                  urban land would give up some cash flow, tax shelter value, or scarcity value.
                </p>
              </div>
              <div>
                <p className="font-editorial text-[27px] leading-tight">The clearest beneficiaries are people trying to enter.</p>
                <p className="mt-3 text-[14px] leading-relaxed text-white/70">
                  Renters searching now, future Portlanders, first-time buyers, unhoused households, and new
                  housing projects benefit if the city really converts the money into homes and stability.
                </p>
              </div>
              <div>
                <p className="font-editorial text-[27px] leading-tight">The morally hard group is older low-income owners.</p>
                <p className="mt-3 text-[14px] leading-relaxed text-white/70">
                  The package should protect them from being forced out, but not permanently protect every dollar
                  of asset value for heirs or future high-income buyers.
                </p>
              </div>
            </div>
            <div className="mt-6 rounded-sm border border-white/12 bg-white/[0.06] p-4">
              <p className="text-[14px] leading-relaxed text-white/74">
                The dollar figures below are modeled annual effects, not official bills. For property-tax rows,
                the floor is one-way: parcels below the floor can owe more, while parcels already above the floor
                show no automatic cut. Any relief for overburdened households is a separate hardship or income-based
                protection, not a blanket reduction.
              </p>
            </div>
          </div>

          <div className="mt-6 grid gap-4">
            {PACKAGE_COHORT_IMPACTS.map((impact) => (
              <PackageImpactCard key={impact.name} impact={impact} />
            ))}
          </div>
        </Section>

        <Section
          id="sources"
          eyebrow="Sources"
          title="Source registry"
          lead="This page is built from official public sources, city documents, state tax materials, and Portland Civic Lab's source memo. The models are our interpretation, but the cited facts should be traceable."
          tone="darker"
        >
          <details className="group -mx-4 border-y border-white/12 bg-white/[0.055] sm:mx-0 sm:rounded-sm sm:border">
            <summary className="cursor-pointer list-none p-4 outline-none transition-colors hover:bg-white/[0.035] focus-visible:ring-2 focus-visible:ring-[var(--color-ember)] sm:p-6 [&::-webkit-details-marker]:hidden">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <MiniKicker>Source list</MiniKicker>
                  <p className="mt-2 max-w-2xl text-[15px] leading-relaxed text-white/74">
                    {SOURCE_ENTRIES.length} source records are available for audit, citation, and follow-up.
                  </p>
                </div>
                <div className="flex w-fit items-center gap-3 rounded-sm border border-white/14 bg-white/[0.06] px-4 py-3 font-mono text-[11px] font-semibold uppercase tracking-[0.14em] text-white/72">
                  <span className="group-open:hidden">Open source registry</span>
                  <span className="hidden group-open:inline">Close source registry</span>
                  <ChevronDown className="h-4 w-4 transition-transform group-open:rotate-180" />
                </div>
              </div>
            </summary>

            <div className="border-t border-white/12 p-4 sm:p-6 sm:pt-5">
              <div className="grid min-w-0 gap-3 md:grid-cols-2 2xl:grid-cols-3">
                {SOURCE_ENTRIES.map(([id, source]) => (
                  <a
                    key={id}
                    href={source.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group min-w-0 rounded-sm border border-white/12 bg-white/[0.055] p-4 transition-colors hover:border-[var(--color-ember)]/60"
                  >
                    <p className="break-words font-mono text-[10px] font-semibold uppercase tracking-[0.16em] text-[var(--color-ember-bright)]">
                      {source.org}
                    </p>
                    <p className="mt-2 break-words text-[14px] font-semibold leading-snug text-white group-hover:text-[var(--color-ember-bright)]">
                      {source.title}
                    </p>
                    <p className="mt-3 break-words [overflow-wrap:anywhere] font-mono text-[10px] leading-relaxed text-white/42">
                      {source.url}
                    </p>
                  </a>
                ))}
              </div>
            </div>
          </details>

          <div className="mt-8 grid gap-5 lg:grid-cols-2">
            <div className="-mx-4 border-y border-white/12 bg-white/[0.055] p-4 sm:mx-0 sm:rounded-sm sm:border sm:p-6">
              <MiniKicker>Limits</MiniKicker>
              <p className="mt-4 text-[15px] leading-relaxed text-white/72">
                The calculators are not exact forecasts for a specific property, household, or project.
                They show direction and scale under simplified assumptions. Actual results depend on tax area,
                exemptions, voter-approved bond taxes, construction costs, interest rates, operating expenses, rents, public funding,
                and legal details.
              </p>
            </div>
            <div className="-mx-4 border-y border-white/12 bg-white/[0.055] p-4 sm:mx-0 sm:rounded-sm sm:border sm:p-6">
              <MiniKicker>Next data layer</MiniKicker>
              <p className="mt-4 text-[15px] leading-relaxed text-white/72">
                The next version should add property-level tax patterns, district-level rent and income data,
                permitting timelines by project type, and a public method note for every calculator. That would
                turn this from an explainer into a living civic tool.
              </p>
            </div>
          </div>
        </Section>
      </main>
    </div>
  );
}
