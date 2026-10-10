import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { pageMeta } from "@/lib/page-meta";
import { DOWNTOWN_URL, PARKS_URL } from "@/lib/site";
import { portfolio, stats, EDITION, dateLabel } from "@/lib/ced/model";
import {
  ArtifactFrame,
  ClosingCta,
  Ledger,
  NumberedList,
  PageHero,
  PrimaryAction,
  QuietAction,
  SectionHead,
  SHELL,
  type LedgerRow,
} from "@/components/site/Page";

export const dynamic = "force-static";

export const metadata: Metadata = pageMeta({
  title: "For Public Institutions",
  description:
    "Portland Civic Lab keeps the record a bureau's decisions run on: one reconciled register of what it owns, promised, and owes, with a monthly review. Diagnostics, data products, and independent evaluation, at published prices, through open procurement.",
  path: "/institutions",
});

const OFFERINGS = [
  {
    title: "The maintained record",
    body: "One record of what your bureau owns, promised, and owes: assets, agreements, decisions, and dates, reconciled from public and provided records and kept current, with every line sourced. Your monthly review runs from it. We do the reconciling; your staff never maintain a second tracking system.",
    note: "Flagship · $100,000 to $180,000 a year, after a pilot",
  },
  {
    title: "Diagnostics and decision analysis",
    body: "One hard question at a time: the factual baseline, the options actually available, what each one costs, and a decision memo written to survive legal review, budget review, and a hostile hearing.",
    note: "Four to six weeks · from $15,000",
  },
  {
    title: "Civic data products",
    body: "Atlas-class data products for your domain: inventories, conditions, service levels, outcomes. Built the way we build our own dashboards and the Parks Atlas: source-linked, public, and honest about gaps.",
    note: "Priced by scope",
  },
  {
    title: "Independent evaluation",
    body: "Did the program work? Mixed-method evaluation with published methodology. Where independence demands it, an outside evaluator of record signs the result. We don't grade our own homework.",
    note: "Outside evaluator of record where needed",
  },
];

const PRICING: LedgerRow[] = [
  {
    name: "Diagnostic",
    price: "$15,000–$25,000",
    detail:
      "Four to six weeks on one question. Complete in itself: evidence, options, and a recommendation you can act on with or without us.",
  },
  {
    name: "Maintained-record pilot",
    price: "$40,000–$90,000",
    detail:
      "A bounded pilot sized to one portfolio: the reconciled baseline, the kept record, facilitated monthly reviews, and a written evaluation at the end. Every pilot closes with our honest recommendation: continue, change, or stop.",
  },
  {
    name: "Ongoing maintained record",
    price: "$100,000–$180,000 / year",
    detail:
      "Competitively procured and itemized into three components, so you buy only what you use. The components add up to the annual band; priced by portfolio size and scope after a pilot has proven the value.",
    components: [
      { label: "Data infrastructure & tools", range: "$20–40K" },
      { label: "Portfolio data stewardship", range: "$30–60K" },
      { label: "Review and briefing service", range: "$50–80K" },
    ],
  },
];

const CONTRACT_RULES = [
  {
    title: "We compete",
    body: "Small one-time engagements go through your normal small-procurement process. Anything ongoing, or above the informal threshold, we win through a process someone else could win. We never price work to slip under a threshold.",
  },
  {
    title: "We don't write the spec and then bid on it",
    body: "If we helped scope your solicitation, we say so in writing and accept that we may not be able to bid on it.",
  },
  {
    title: "No back channels",
    body: "While a solicitation we might bid on is open, we don't contact the sponsoring office outside the process.",
  },
  {
    title: "Conflicts flagged in the document",
    body: "Any recommendation that touches something we sell or own carries a conflict flag in the document itself, and recommends independent validation before any procurement.",
  },
  {
    title: "Written as a public record",
    body: "Everything we deliver to a public body is written as a public record, because it is one.",
  },
];

function RecordSample() {
  const summary = stats(EDITION);
  const movements = portfolio.changes.filter((c) =>
    ["psu-adopted", "albina-adopted", "p5-rfp-issued"].includes(c.id),
  );
  return (
    <div className="overflow-hidden rounded-sm border border-[var(--color-parchment)] bg-white shadow-lg">
      <div className="bg-[var(--color-canopy)] p-6 text-white">
        <p className="font-mono text-xs uppercase tracking-widest text-[var(--color-lichen)]">
          A public-source example
        </p>
        <h2 className="mt-3 font-editorial text-3xl">CED Portfolio Map</h2>
        <p className="mt-2 text-sm text-white/80">
          The work across bureau lines, connected to decisions and outcomes.
        </p>
      </div>
      <div className="grid grid-cols-2 gap-4 border-b border-[var(--color-parchment)] p-5">
        <div>
          <strong className="block text-3xl">{summary.initiatives}</strong>
          <span className="text-xs">initiatives mapped</span>
        </div>
        <div>
          <strong className="block text-3xl">{summary.decisions}</strong>
          <span className="text-xs">unresolved decisions</span>
        </div>
      </div>
      <ol className="divide-y divide-[var(--color-parchment)]">
        {movements.map((c) => (
          <li key={c.id} className="px-5 py-4">
            <p className="font-mono text-xs text-[var(--color-ink-muted)]">
              {dateLabel(c.eventDate)}
            </p>
            <Link
              className="mt-1 block text-sm font-semibold"
              href={`/ced/initiatives/${c.initiative}`}
            >
              {portfolio.initiatives.find((i) => i.id === c.initiative)?.name}:{" "}
              {c.after}
            </Link>
            <p className="mt-1 text-xs text-[var(--color-ink-light)]">
              {c.significance}
            </p>
          </li>
        ))}
      </ol>
      <Link
        href="/ced"
        className="flex items-center justify-between border-t border-[var(--color-parchment)] bg-[var(--color-paper-warm)] px-5 py-4 text-sm font-semibold"
      >
        Explore the full public portfolio <ArrowRight className="h-4 w-4" />
      </Link>
      <p className="px-5 py-3 text-xs text-[var(--color-ink-muted)]">
        Record checked {dateLabel(EDITION)} · Independent demonstration, not
        authoritative City status.
      </p>
    </div>
  );
}

export default function InstitutionsPage() {
  return (
    <div className="bg-[var(--color-paper)]">
      <PageHero
        eyebrow="For public institutions"
        title={
          <>The decisions cross bureau lines. The information doesn&apos;t.</>
        }
        lede="Where the money goes, which projects slip, and what is waiting on whom are questions that cut across teams, systems, and bureaus, and the records for them rarely do. Portland reorganized its bureaus into service areas in 2025, but the records they run on stayed where they were. We keep the record your decisions depend on, as a service you can start using next month."
        actions={
          <>
            <PrimaryAction href="/contact?topic=Institutional%20work">
              Start a conversation
            </PrimaryAction>
            <QuietAction href="/independence">How we contract</QuietAction>
          </>
        }
        aside={<RecordSample />}
      />

      {/* What we do */}
      <section className="border-y border-[var(--color-parchment)] bg-[var(--color-paper-warm)]">
        <div className={`${SHELL} py-14 sm:py-16 lg:py-20`}>
          <SectionHead
            eyebrow="What we do"
            title="Four things we do for institutions."
            lede="The first one is the main service. The others are how an engagement usually starts, what it produces, and how the results get checked."
          />
          <div className="mt-10">
            <NumberedList items={OFFERINGS} columns={2} />
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className={`${SHELL} py-14 sm:py-16 lg:py-20`}>
        <SectionHead
          eyebrow="Published pricing"
          title="The same prices for every buyer."
          lede="These are ranges rather than quotes. Where the number lands depends on the size of the portfolio and the scope, and it stays inside the range. We price to what the work is worth, not to a procurement threshold."
        />
        <div className="mt-10">
          <Ledger rows={PRICING} />
        </div>
        <p className="mt-5 text-[13.5px] leading-relaxed text-[var(--color-ink-light)]">
          Custom analysis and new modules are scoped and priced separately, and
          appear here when they become standard offerings. Property owners and
          development teams have their own practice and price list on the{" "}
          <Link
            href="/property"
            className="font-semibold text-[var(--color-canopy)] hover:underline"
          >
            property page
          </Link>
          .
        </p>
      </section>

      {/* How we contract */}
      <section className="bg-[var(--color-canopy)] noise-overlay">
        <div className={`${SHELL} relative z-10 py-14 sm:py-16 lg:py-20`}>
          <SectionHead
            light
            eyebrow="How we contract"
            title="How we contract."
            lede="If your organization has procurement rules, bring your procurement office in early. We would rather that than a surprise later."
          />
          <div className="mt-10">
            <NumberedList items={CONTRACT_RULES} columns={2} light />
          </div>
          <Link
            href="/independence"
            className="mt-10 inline-flex items-center gap-2 rounded-sm border border-white/15 bg-white/[0.06] px-5 py-3 text-[14px] font-semibold text-white transition-colors hover:bg-white/10"
          >
            The rules in full, and every contract we hold
            <ArrowUpRight className="h-4 w-4" />
          </Link>
        </div>
      </section>

      {/* Proof */}
      <section className={`${SHELL} py-14 sm:py-16 lg:py-20`}>
        <SectionHead
          eyebrow="Proof"
          title="You can see the same kind of record on this site."
          lede="The Parks Atlas tracks 316 parks and their partners. The downtown model covers 5,275 parcels. The performance cockpits follow the City's own measures. All of it is free and built from public data, using the same methods we use for paid work."
        />
        <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-3">
          <div>
            <ArtifactFrame
              src="/images/home/parks-b.jpg"
              alt="The Parks Atlas"
              caption="Parks Atlas · 316 assets"
              href={PARKS_URL}
              external
            />
            <p className="mt-3 text-[14px] font-semibold text-[var(--color-ink)]">
              A kept record of every park, its condition, and its partners.
            </p>
          </div>
          <div>
            <ArtifactFrame
              src="/images/home/downtown.jpg"
              alt="The downtown parcel model"
              caption="Portland Possible · 5,275 parcels"
              href={DOWNTOWN_URL}
              external
              position="object-center"
            />
            <p className="mt-3 text-[14px] font-semibold text-[var(--color-ink)]">
              A kept record of what every downtown parcel is and could become.
            </p>
          </div>
          <div>
            <ArtifactFrame
              src="/images/home/dashboards-b.jpg"
              alt="A performance dashboard"
              caption="Performance cockpits"
              href="/dashboard/performance"
              position="object-left-top"
            />
            <p className="mt-3 text-[14px] font-semibold text-[var(--color-ink)]">
              The City&apos;s own measures, every source linked, updated as they
              publish.
            </p>
          </div>
        </div>
      </section>

      <ClosingCta
        eyebrow="Start here"
        title="Tell us about the decision."
        body="Tell us what your bureau is trying to decide, who owns that decision, and how your organization buys outside help. We will reply within two working days and say whether a diagnostic makes sense and, if it does, what it would cost."
        primary={{
          label: "Start a conversation",
          href: "/contact?topic=Institutional%20work",
        }}
        secondary={{
          label: "Property owners and developers",
          href: "/property",
        }}
      />
    </div>
  );
}
