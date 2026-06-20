"use client";

import { FormEvent, useState } from "react";
import { AlertTriangle, ArrowRight, CheckCircle2, LockKeyhole, Search } from "lucide-react";
import type {
  HouseholdIncomeBand,
  ParcelClassification,
  ParcelLookupResponse,
  ParcelLookupResult,
  ParcelRelationship,
} from "@/lib/growth-politics/parcel-lookup";
import { fmtPct } from "@/lib/growth-politics/engine";

const RELATIONSHIPS: Array<{ value: ParcelRelationship; label: string }> = [
  { value: "owner_occupier", label: "I own and live here" },
  { value: "owner_landlord", label: "I own and rent it out" },
  { value: "renter", label: "I rent here" },
  { value: "buyer", label: "I might buy here" },
  { value: "builder", label: "I might build here" },
  { value: "business_owner", label: "I own/use it for business" },
  { value: "neighbor", label: "I live nearby" },
  { value: "unknown", label: "Not sure yet" },
];

const HOUSEHOLD_INCOME_BANDS: Array<{ value: HouseholdIncomeBand; label: string; helper: string }> = [
  {
    value: "not_provided",
    label: "Prefer not to say / not sure",
    helper: "Today's parcel facts do not require income. Later policy scenarios will treat protection as unknown.",
  },
  {
    value: "under_50k",
    label: "Under $50k",
    helper: "Used later to show how a policy scenario might protect lower-income owner-occupiers.",
  },
  {
    value: "50k_75k",
    label: "$50k-$75k",
    helper: "Used later to show how a policy scenario might protect lower-income owner-occupiers.",
  },
  {
    value: "75k_100k",
    label: "$75k-$100k",
    helper: "Used later to show partial or full household protection in policy scenarios.",
  },
  {
    value: "100k_150k",
    label: "$100k-$150k",
    helper: "Used later to show partial or full household protection in policy scenarios.",
  },
  {
    value: "150k_250k",
    label: "$150k-$250k",
    helper: "Used later to estimate policy-scenario exposure for higher-income households.",
  },
  {
    value: "250k_plus",
    label: "$250k+",
    helper: "Used later to estimate policy-scenario exposure for higher-income households.",
  },
];

function formatDollars(value: number): string {
  const sign = value < 0 ? "-" : "";
  return `${sign}$${Math.abs(value).toLocaleString("en-US", { maximumFractionDigits: 0 })}`;
}

function valueOrDash(value: number | null | undefined): string {
  return typeof value === "number" ? formatDollars(value) : "Not found";
}

function signedValueOrDash(value: number | null | undefined): string {
  if (typeof value !== "number") return "Not modeled";
  if (value === 0) return "$0";
  return valueOrDash(value);
}

function percentOrDash(value: number | null | undefined): string {
  return typeof value === "number" ? fmtPct(value) : "Not enough data";
}

function FactTile({ label, value, sub }: { label: string; value: string; sub?: string }) {
  return (
    <div className="min-w-0 border-y border-[var(--color-parchment)] bg-white p-4 sm:rounded-sm sm:border">
      <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.16em] text-[var(--color-ink-muted)]">
        {label}
      </p>
      <p className="mt-2 break-words text-[22px] font-bold leading-none text-[var(--color-ink)]">{value}</p>
      {sub ? <p className="mt-2 text-[12px] leading-snug text-[var(--color-ink-light)]">{sub}</p> : null}
    </div>
  );
}

function TaxComparisonRow({
  label,
  value,
  max,
  note,
  tone = "neutral",
}: {
  label: string;
  value: number | null;
  max: number;
  note: string;
  tone?: "neutral" | "benchmark";
}) {
  const width = value && max > 0 ? Math.max(8, Math.min(100, (value / max) * 100)) : 0;

  return (
    <div className="rounded-sm border border-[var(--color-parchment)] bg-white p-4">
      <div className="grid gap-2 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-baseline">
        <div>
          <p className="text-[13px] font-bold text-[var(--color-ink)]">{label}</p>
          <p className="mt-1 text-[12px] leading-relaxed text-[var(--color-ink-light)]">{note}</p>
        </div>
        <p className="font-mono text-[22px] font-bold leading-none tabular-nums text-[var(--color-ink)]">
          {valueOrDash(value)}
        </p>
      </div>
      <div className="mt-3 h-3 overflow-hidden rounded-full bg-[var(--color-paper-warm)]">
        <div
          className={`h-full rounded-full transition-[width] ${
            tone === "benchmark" ? "bg-[var(--color-ember)]" : "bg-[var(--color-canopy)]"
          }`}
          style={{ width: `${width}%` }}
        />
      </div>
    </div>
  );
}

function TaxMechanicsPanel({ classification, maxTax }: { classification: ParcelClassification; maxTax: number }) {
  const difference = classification.annualAdvantageVsBenchmark;
  const absDifference = typeof difference === "number" ? Math.abs(difference) : null;
  const status =
    difference === null
      ? "unknown"
      : difference > 250
        ? "discount"
        : difference < -250
          ? "higher"
          : "near";
  const headline =
    status === "discount"
      ? `This address is modeled ${valueOrDash(absDifference)} lower than the county benchmark.`
      : status === "higher"
        ? `This address is modeled ${valueOrDash(absDifference)} higher than the county benchmark.`
        : status === "near"
          ? "This address is close to the county benchmark."
          : "This comparison needs both market value and assessed value.";
  const meaning =
    status === "discount"
      ? "That suggests today's tax formula gives this parcel a lower yearly bill than a similar residential property assessed under current county rules."
      : status === "higher"
        ? "That means this is not one of the low-tax-bill examples. In this comparison, the address is already carrying more tax load than the benchmark."
        : status === "near"
          ? "The tax-basis gap is not the main story for this address. Other costs, income, rent, and housing supply may matter more."
          : "Once both values are available, this block will show whether the address looks advantaged, burdened, or close to the benchmark.";
  const statusClass =
    status === "discount"
      ? "border-[var(--color-sage)] bg-[#f0faf4] text-[var(--color-canopy)]"
      : status === "higher"
        ? "border-[#df9b86] bg-[#fff5ef] text-[#8c3d25]"
        : "border-[var(--color-parchment)] bg-white text-[var(--color-ink)]";

  return (
    <div className="-mx-4 border-y border-[var(--color-parchment)] bg-[var(--color-paper)] p-4 sm:mx-0 sm:rounded-sm sm:border sm:p-5">
      <div className="grid gap-4 xl:grid-cols-[minmax(320px,0.58fr)_minmax(0,1.42fr)]">
        <div>
          <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.16em] text-[var(--color-ember)]">
            Compare this address
          </p>
          <h4 className="mt-3 font-editorial text-[26px] leading-tight text-[var(--color-ink)]">
            Does this parcel look undertaxed, overtaxed, or close to normal?
          </h4>
          <p className="mt-3 text-[14px] leading-relaxed text-[var(--color-ink-light)]">
            This is owner-side tax math. It is not your final tax bill, and it is not a policy proposal.
            It only compares this address with the county&apos;s current benchmark for similar new or heavily
            changed residential property.
          </p>
        </div>

        <div className="grid gap-3">
          <div className={`rounded-sm border p-4 ${statusClass}`}>
            <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.16em] opacity-70">
              What it means today
            </p>
            <p className="mt-2 text-[20px] font-bold leading-tight">{headline}</p>
            <p className="mt-2 text-[13px] leading-relaxed opacity-80">{meaning}</p>
          </div>

          <div className="grid gap-3 lg:grid-cols-2">
            <TaxComparisonRow
              label="Modeled tax at this address"
              value={classification.currentAnnualTax}
              max={maxTax}
              note="Uses this parcel's market value and assessed-value share."
            />
            <TaxComparisonRow
              label="Modeled tax at county benchmark"
              value={classification.benchmarkAnnualTax}
              max={maxTax}
              note={`Uses the ${fmtPct(classification.benchmarkRatio)} changed-property ratio.`}
              tone="benchmark"
            />
          </div>

          <details className="group rounded-sm border border-[var(--color-parchment)] bg-white">
            <summary className="flex cursor-pointer items-center justify-between gap-4 px-4 py-3">
              <span className="font-mono text-[10px] font-semibold uppercase tracking-[0.16em] text-[var(--color-ink-muted)]">
                Show the math
              </span>
              <span className="text-[12px] font-semibold text-[var(--color-ink-muted)] group-open:hidden">Open</span>
              <span className="hidden text-[12px] font-semibold text-[var(--color-ink-muted)] group-open:inline">Close</span>
            </summary>
            <div className="border-t border-[var(--color-parchment)] px-4 py-3 text-[12px] leading-relaxed text-[var(--color-ink-light)]">
              <p>
                Current modeled tax uses this address&apos;s assessed-value share. The benchmark modeled tax uses
                the county changed-property ratio. Difference today:{" "}
                <span className="font-semibold text-[var(--color-ink)]">
                  {valueOrDash(classification.annualAdvantageVsBenchmark)}
                </span>
                . Positive means the address is modeled lower than benchmark; negative means higher.
              </p>
            </div>
          </details>
        </div>
      </div>
    </div>
  );
}

function BenchmarkExplainer({ classification }: { classification: ParcelClassification }) {
  const benchmark = fmtPct(classification.benchmarkRatio);
  const isMultifamily = classification.benchmarkLabel.toLowerCase().includes("multifamily");
  const isRoughSignal = classification.benchmarkLabel.toLowerCase().includes("rough");
  const propertyType = isMultifamily ? "multifamily" : "residential";

  return (
    <div className="-mx-4 border-y border-[var(--color-parchment)] bg-[var(--color-paper-warm)] p-4 sm:mx-0 sm:rounded-sm sm:border">
      <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.16em] text-[var(--color-ember)]">
        Why this benchmark?
      </p>
      <div className="mt-3 grid gap-3 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
        <p className="text-[15px] font-semibold leading-relaxed text-[var(--color-ink)]">
          {benchmark} is not a Civic Lab target. It is the county comparison point for property that enters
          today&apos;s tax rolls as new or heavily changed.
        </p>
        <p className="text-[13px] leading-relaxed text-[var(--color-ink-light)]">
          Multnomah County publishes changed-property ratios each tax year. For 2025-26, the{" "}
          {propertyType} ratio used here is {benchmark}. We compare an address to that ratio because it shows roughly what
          a similar {propertyType} property would look like if today&apos;s assessment rules counted it as new
          or substantially changed.
          {isRoughSignal
            ? " This parcel appears non-residential, so treat the comparison as directional until commercial ratios are added."
            : null}
        </p>
      </div>
    </div>
  );
}

const CURRENT_POLICY_KIND_STYLES = {
  gain: "border-[var(--color-sage)] bg-[#effaf3] text-[var(--color-canopy)]",
  loss: "border-[#df9b86] bg-[#fff5ef] text-[#8c3d25]",
  mixed: "border-[#d6a15f] bg-[#fff8ea] text-[#80511b]",
  neutral: "border-[var(--color-parchment)] bg-white text-[var(--color-ink)]",
  unknown: "border-[var(--color-parchment)] bg-white text-[var(--color-ink-muted)]",
} as const;

function CurrentPolicyPanel({ classification }: { classification: ParcelClassification }) {
  const impact = classification.currentPolicyImpact;
  const signedAmount =
    impact.amount === null
      ? "Not enough data"
      : impact.amount === 0
        ? "$0"
        : signedValueOrDash(impact.amount);

  return (
    <div className="-mx-4 border-y border-[var(--color-parchment)] bg-white p-4 sm:mx-0 sm:rounded-sm sm:border sm:p-5 2xl:p-6">
      <div className="grid gap-4 xl:grid-cols-[minmax(320px,0.62fr)_minmax(0,1.38fr)] xl:items-start">
        <div className={`rounded-sm border p-4 ${CURRENT_POLICY_KIND_STYLES[impact.kind]}`}>
          <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.16em] opacity-70">
            Today under current rules
          </p>
          <h4 className="mt-3 font-editorial text-[28px] leading-tight">
            {impact.label}
          </h4>
          <p className="mt-4 font-mono text-[34px] font-bold leading-none tracking-tight tabular-nums sm:text-[42px]">
            {signedAmount}
          </p>
          <p className="mt-2 text-[11px] font-semibold uppercase tracking-[0.12em] opacity-70">
            {impact.unit}
          </p>
        </div>

        <div className="grid gap-3 lg:grid-cols-[1.05fr_0.95fr]">
          <div className="rounded-sm border border-[var(--color-parchment)] bg-[var(--color-paper)] p-4">
            <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.16em] text-[var(--color-ink-muted)]">
              How to read this
            </p>
            <p className="mt-3 text-[15px] font-semibold leading-relaxed text-[var(--color-ink)]">
              {impact.summary}
            </p>
            <p className="mt-3 text-[13px] leading-relaxed text-[var(--color-ink-light)]">
              {impact.readerMeaning}
            </p>
          </div>

          <div className="rounded-sm border border-[var(--color-parchment)] bg-[var(--color-paper-warm)] p-4">
            <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.16em] text-[var(--color-ink-muted)]">
              What this uses
            </p>
            <p className="mt-3 text-[13px] leading-relaxed text-[var(--color-ink-light)]">
              {impact.howCalculated}
            </p>
            <p className="mt-3 w-fit rounded-full border border-[var(--color-parchment)] bg-white px-3 py-1 font-mono text-[10px] font-semibold uppercase tracking-[0.14em] text-[var(--color-ink-muted)]">
              Confidence: {impact.confidence}
            </p>
          </div>
        </div>
      </div>

      <details className="group mt-3 rounded-sm border border-[var(--color-parchment)] bg-[var(--color-paper-warm)]">
        <summary className="flex cursor-pointer items-center justify-between gap-4 px-4 py-3">
          <span className="font-mono text-[10px] font-semibold uppercase tracking-[0.16em] text-[var(--color-ink-muted)]">
            What would make this estimate official
          </span>
          <span className="text-[12px] font-semibold text-[var(--color-ink-muted)] group-open:hidden">Open</span>
          <span className="hidden text-[12px] font-semibold text-[var(--color-ink-muted)] group-open:inline">Close</span>
        </summary>
        <div className="grid gap-2 border-t border-[var(--color-parchment)] px-4 py-3 text-[12px] leading-relaxed text-[var(--color-ink-light)] md:grid-cols-2">
          {impact.whatWouldMakeThisMoreExact.map((item) => (
            <p key={item} className="flex gap-2">
              <span className="mt-2 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-[var(--color-ember)]" />
              <span>{item}</span>
            </p>
          ))}
        </div>
      </details>
    </div>
  );
}

function ClassificationPanel({ classification }: { classification: ParcelClassification }) {
  const taxValues = [
    classification.currentAnnualTax,
    classification.benchmarkAnnualTax,
  ].filter((value): value is number => typeof value === "number");
  const maxTax = Math.max(1, ...taxValues);

  return (
    <div
      data-layout="parcel-classification"
      className="-mx-4 grid gap-4 border-y border-[var(--color-parchment)] bg-white shadow-none sm:mx-0 sm:gap-5 sm:rounded-sm sm:border sm:p-5 sm:shadow-[0_18px_60px_rgba(15,36,25,0.04)] 2xl:p-6"
    >
      <CurrentPolicyPanel classification={classification} />

      <div className="grid min-w-0 gap-4 px-4 pb-4 sm:gap-5 sm:px-0 sm:pb-0">
        <div className="grid gap-4 sm:gap-5 xl:grid-cols-[minmax(360px,0.75fr)_minmax(0,1.25fr)]">
          <div className="min-w-0 border-y border-[var(--color-parchment)] bg-white p-4 sm:rounded-sm sm:border">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between 2xl:block">
              <div>
                <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.18em] text-[var(--color-ember)]">
                  Current parcel signal
                </p>
                <h4 className="mt-2 font-editorial text-[26px] leading-tight text-[var(--color-ink)]">
                  {classification.primaryCohort}
                </h4>
              </div>
              <span
                className={`inline-flex w-fit rounded-full border px-3 py-1 text-[10px] font-mono font-semibold uppercase tracking-[0.14em] 2xl:mt-4 ${
                  classification.canClassify
                    ? "border-[var(--color-sage)] bg-[#f3fbf5] text-[var(--color-canopy)]"
                    : "border-[#e3b38b] bg-[#fff8ea] text-[#80511b]"
                }`}
              >
                {classification.canClassify ? "Classified" : "Needs one number"}
              </span>
            </div>

            <p className="mt-4 text-[14px] leading-relaxed text-[var(--color-ink-light)]">
              {classification.plainEnglish}
            </p>
          </div>

          <div className="-mx-4 grid min-w-0 gap-2 sm:mx-0 sm:gap-3 md:grid-cols-2 xl:grid-cols-4">
            <FactTile
              label="Taxed share"
              value={percentOrDash(classification.taxedShare)}
              sub="Assessed value divided by market value."
            />
            <FactTile
              label="County benchmark"
              value={fmtPct(classification.benchmarkRatio)}
              sub={`2025-26 ${classification.benchmarkLabel}.`}
            />
            <FactTile
              label="Current modeled tax"
              value={valueOrDash(classification.currentAnnualTax)}
              sub="Estimated from market value, assessed value, and the modeled rate."
            />
            <FactTile
              label="Difference today"
              value={valueOrDash(classification.annualAdvantageVsBenchmark)}
              sub="Positive means lower than benchmark; negative means higher."
            />
          </div>
        </div>

        <BenchmarkExplainer classification={classification} />

        {classification.canClassify ? (
          <TaxMechanicsPanel classification={classification} maxTax={maxTax} />
        ) : (
          <div className="-mx-4 border-y border-[#e3b38b] bg-[#fff8ea] p-4 sm:mx-0 sm:rounded-sm sm:border">
            <div className="flex gap-3">
              <AlertTriangle className="mt-0.5 h-5 w-5 flex-shrink-0 text-[#9a5d1f]" />
              <div>
                <p className="font-semibold text-[#74410d]">We found the parcel, but cannot classify the tax cohort yet.</p>
                <p className="mt-2 text-[13px] leading-relaxed text-[#74410d]/80">
                  The county assessment table did not return a usable taxable value. Open the manual fallback
                  and add the M50 assessed value from the tax bill so we can compare it with market value.
                </p>
                {classification.missing.length > 0 ? (
                  <p className="mt-2 text-[12px] leading-relaxed text-[#74410d]/70">
                    Missing: {classification.missing.join(" ")}
                  </p>
                ) : null}
              </div>
            </div>
          </div>
        )}

        <div className="grid gap-3 md:grid-cols-2 2xl:grid-cols-3">
          {classification.relatedCohorts.map((cohort) => (
            <div key={cohort.label} className="rounded-sm border border-[var(--color-parchment)] bg-[var(--color-paper-warm)] p-4">
              <p className="text-[13px] font-semibold leading-snug text-[var(--color-ink)]">{cohort.label}</p>
              <p className="mt-2 text-[12px] leading-relaxed text-[var(--color-ink-light)]">{cohort.reason}</p>
            </div>
          ))}
        </div>

        {classification.warnings.length > 0 ? (
          <div className="grid gap-2 md:grid-cols-2">
            {classification.warnings.map((warning) => (
              <p key={warning} className="rounded-sm border border-[#e3b38b] bg-[#fff8ea] p-3 text-[12px] leading-relaxed text-[#74410d]">
                {warning}
              </p>
            ))}
          </div>
        ) : null}
      </div>
    </div>
  );
}

function ParcelFactsPanel({ lookup }: { lookup: ParcelLookupResult }) {
  const { parcel, taxAssessment } = lookup;
  const marketValue = taxAssessment?.realMarketValue ?? parcel.latestMarketValue.value;

  return (
    <div
      data-layout="parcel-facts"
      className="-mx-4 border-y border-[var(--color-parchment)] bg-[var(--color-paper-warm)] p-4 sm:mx-0 sm:rounded-sm sm:border sm:p-5"
    >
      <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.18em] text-[var(--color-ember)]">
        Parcel data found
      </p>
      <h4 className="mt-2 font-editorial text-[29px] leading-tight text-[var(--color-ink)]">
        {parcel.address ?? parcel.matchedAddress}
      </h4>
      <p className="mt-3 text-[13px] leading-relaxed text-[var(--color-ink-light)]">
        Matched by PortlandMaps with score {Math.round(parcel.geocodeScore)}. Owner names and mailing
        addresses are intentionally not returned here.
      </p>

      <div className="-mx-4 mt-5 grid gap-2 sm:mx-0 sm:grid-cols-2 sm:gap-3 lg:grid-cols-3 2xl:grid-cols-5">
        <FactTile
          label="Market value"
          value={valueOrDash(marketValue)}
          sub={
            taxAssessment?.taxYear
              ? `Multnomah County tax year ${taxAssessment.taxYear}`
              : parcel.latestMarketValue.year
                ? `PortlandMaps value year ${parcel.latestMarketValue.year}`
                : undefined
          }
        />
        <FactTile
          label="M50 assessed"
          value={valueOrDash(taxAssessment?.assessedValue)}
          sub={taxAssessment ? `Pulled from ${taxAssessment.sourceName}.` : "County lookup did not return this value."}
        />
        <FactTile
          label="Property type"
          value={parcel.propertyCodeDescription ?? parcel.dwellingType ?? parcel.propertyType ?? "Not listed"}
          sub={parcel.landUse ? `Land use: ${parcel.landUse}` : undefined}
        />
        <FactTile
          label="Units"
          value={typeof parcel.units === "number" ? parcel.units.toLocaleString() : "Not listed"}
          sub={parcel.yearBuilt ? `Year built: ${parcel.yearBuilt}` : undefined}
        />
        <FactTile
          label="Council district"
          value={parcel.councilDistrict ?? "Not listed"}
          sub={parcel.neighborhood ?? parcel.zone ?? undefined}
        />
      </div>

      <div className="-mx-4 mt-5 grid gap-4 border-y border-[var(--color-parchment)] bg-white p-4 sm:mx-0 sm:rounded-sm sm:border lg:grid-cols-[0.35fr_1fr]">
        <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.16em] text-[var(--color-ink-muted)]">
          Source method
        </p>
        <div className="min-w-0">
          <p className="text-[12px] leading-relaxed text-[var(--color-ink-light)]">{lookup.methodNote}</p>
          <p className="mt-2 text-[12px] leading-relaxed text-[var(--color-ink-muted)]">{lookup.privacyNote}</p>
        </div>
      </div>
    </div>
  );
}

export function ParcelCohortLookup() {
  const [address, setAddress] = useState("");
  const [assessedValue, setAssessedValue] = useState("");
  const [monthlyRent, setMonthlyRent] = useState("");
  const [relationship, setRelationship] = useState<ParcelRelationship>("owner_occupier");
  const [householdIncomeBand, setHouseholdIncomeBand] = useState<HouseholdIncomeBand>("not_provided");
  const [response, setResponse] = useState<ParcelLookupResponse | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setResponse(null);

    const params = new URLSearchParams({
      address,
      relationship,
      householdIncomeBand,
    });

    if (assessedValue.trim()) {
      params.set("assessedValue", assessedValue);
    }

    if (relationship === "renter" && monthlyRent.trim()) {
      params.set("monthlyRent", monthlyRent);
    }

    try {
      const res = await fetch(`/api/growth-politics/parcel?${params.toString()}`);
      const payload = (await res.json()) as ParcelLookupResponse;
      setResponse(payload);
    } catch {
      setResponse({ ok: false, error: "Lookup failed. Check the address and try again." });
    } finally {
      setLoading(false);
    }
  }

  const lookup = response?.ok ? response.lookup : null;
  const selectedIncomeBand =
    HOUSEHOLD_INCOME_BANDS.find((option) => option.value === householdIncomeBand) ?? HOUSEHOLD_INCOME_BANDS[0];

  return (
    <section data-layout="parcel-lookup-root" className="grid gap-5">
      <div
        data-layout="parcel-lookup-intro"
        className="-mx-4 grid gap-5 border-y border-[var(--color-parchment)] bg-white p-4 shadow-none sm:mx-0 sm:rounded-sm sm:border sm:p-6 sm:shadow-[0_18px_60px_rgba(15,36,25,0.06)] xl:grid-cols-[minmax(340px,0.72fr)_minmax(0,1.28fr)] 2xl:grid-cols-[minmax(360px,0.58fr)_minmax(0,1.42fr)]"
      >
        <div>
          <div className="flex items-center gap-3">
            <Search className="h-5 w-5 text-[var(--color-ember)]" />
            <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.18em] text-[var(--color-ember)]">
              Look up your parcel
            </p>
          </div>
          <h3 className="mt-3 font-editorial text-[34px] leading-tight text-[var(--color-ink)]">
            See which tax-and-housing cohort your address looks like.
          </h3>
          <p className="mt-4 text-[15px] leading-relaxed text-[var(--color-ink-light)]">
            Enter an address or Multnomah County property ID. The tool pulls parcel facts from PortlandMaps
            and the county assessment table from TaxGraph, so most people do not need to type in tax values.
          </p>

          <div className="mt-5 flex gap-3 rounded-sm border border-[var(--color-parchment)] bg-[var(--color-paper-warm)] p-3 sm:p-4">
            <LockKeyhole className="mt-0.5 h-5 w-5 flex-shrink-0 text-[var(--color-canopy)]" />
            <p className="text-[12px] leading-relaxed text-[var(--color-ink-light)]">
              Privacy choice: this tool does not display owner names or owner mailing addresses, even though
              some public property systems include them.
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="-mx-4 border-y border-[var(--color-parchment)] bg-[var(--color-paper)] p-4 sm:mx-0 sm:rounded-sm sm:border sm:p-5">
          <div className="grid gap-4 lg:grid-cols-[minmax(0,1.25fr)_minmax(220px,0.75fr)]">
            <label className="block lg:col-span-2">
              <span className="font-mono text-[10px] font-semibold uppercase tracking-[0.16em] text-[var(--color-ink-muted)]">
                Portland address or property ID
              </span>
              <input
                value={address}
                onChange={(event) => setAddress(event.target.value)}
                placeholder="Example: 2410 SW Nebraska St or R494022"
                className="mt-2 w-full rounded-sm border border-[var(--color-parchment)] bg-white px-4 py-3 text-[15px] text-[var(--color-ink)] outline-none transition-colors placeholder:text-[var(--color-ink-muted)] focus:border-[var(--color-canopy)]"
              />
            </label>

            <label className="block">
              <span className="font-mono text-[10px] font-semibold uppercase tracking-[0.16em] text-[var(--color-ink-muted)]">
                Your relationship
              </span>
              <select
                value={relationship}
                onChange={(event) => setRelationship(event.target.value as ParcelRelationship)}
                className="mt-2 w-full rounded-sm border border-[var(--color-parchment)] bg-white px-4 py-3 text-[15px] text-[var(--color-ink)] outline-none transition-colors focus:border-[var(--color-canopy)]"
              >
                {RELATIONSHIPS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </label>

            <label className="block">
              <span className="font-mono text-[10px] font-semibold uppercase tracking-[0.16em] text-[var(--color-ink-muted)]">
                Household income band
              </span>
              <select
                value={householdIncomeBand}
                onChange={(event) => setHouseholdIncomeBand(event.target.value as HouseholdIncomeBand)}
                className="mt-2 w-full rounded-sm border border-[var(--color-parchment)] bg-white px-4 py-3 text-[15px] text-[var(--color-ink)] outline-none transition-colors focus:border-[var(--color-canopy)]"
              >
                {HOUSEHOLD_INCOME_BANDS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              <p className="mt-2 text-[12px] leading-relaxed text-[var(--color-ink-light)]">
                {selectedIncomeBand.helper} This does not change the current parcel facts.
              </p>
            </label>

            {relationship === "renter" ? (
              <label className="block lg:col-span-2">
                <span className="font-mono text-[10px] font-semibold uppercase tracking-[0.16em] text-[var(--color-ink-muted)]">
                  Total monthly rent for this unit
                </span>
                <input
                  value={monthlyRent}
                  onChange={(event) => setMonthlyRent(event.target.value)}
                  inputMode="numeric"
                  placeholder="Optional, e.g. 2200"
                  className="mt-2 w-full rounded-sm border border-[var(--color-parchment)] bg-white px-4 py-3 text-[15px] text-[var(--color-ink)] outline-none transition-colors placeholder:text-[var(--color-ink-muted)] focus:border-[var(--color-canopy)]"
                />
                <p className="mt-2 text-[12px] leading-relaxed text-[var(--color-ink-light)]">
                  Enter the full monthly rent for the whole apartment or house, not only your personal
                  share if you have roommates. Leave blank to use the default citywide median rent assumption.
                </p>
              </label>
            ) : null}

            <details className="rounded-sm border border-[var(--color-parchment)] bg-white p-4 lg:col-span-2">
              <summary className="cursor-pointer font-mono text-[10px] font-semibold uppercase tracking-[0.16em] text-[var(--color-ink-muted)]">
                Manual fallback only if county lookup fails
              </summary>
              <label className="mt-4 block">
                <span className="text-[12px] font-semibold text-[var(--color-ink-light)]">
                  County assessed value from tax bill (M50)
                </span>
                <input
                  value={assessedValue}
                  onChange={(event) => setAssessedValue(event.target.value)}
                  inputMode="numeric"
                  placeholder="Optional, e.g. 318730"
                  className="mt-2 w-full rounded-sm border border-[var(--color-parchment)] bg-[var(--color-paper)] px-4 py-3 text-[15px] text-[var(--color-ink)] outline-none transition-colors placeholder:text-[var(--color-ink-muted)] focus:border-[var(--color-canopy)]"
                />
              </label>
              <p className="mt-2 text-[12px] leading-relaxed text-[var(--color-ink-light)]">
                Leave this blank unless the automatic Multnomah County assessment lookup cannot find the
                M50 assessed value.
              </p>
            </details>

            <button
              type="submit"
              disabled={loading || address.trim().length < 4}
              className="group inline-flex w-full items-center justify-center gap-2 rounded-sm bg-[var(--color-canopy)] px-5 py-4 text-[15px] font-bold text-white transition-colors hover:bg-[var(--color-ink)] disabled:cursor-not-allowed disabled:bg-[var(--color-ink-muted)] lg:col-span-2"
            >
              {loading ? "Looking up parcel..." : "Find my cohort"}
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </button>
          </div>

          <div className="mt-4 rounded-sm border border-[var(--color-parchment)] bg-white p-3 sm:p-4">
            <div className="flex gap-3">
              <CheckCircle2 className="mt-0.5 h-5 w-5 flex-shrink-0 text-[var(--color-sage)]" />
              <p className="text-[12px] leading-relaxed text-[var(--color-ink-light)]">
                Normally leave the fallback blank. The tool first tries to pull the county assessment table
                and only needs manual help if that lookup fails.
              </p>
            </div>
          </div>
        </form>
      </div>

      {response && !response.ok ? (
        <div className="-mx-4 border-y border-[#e3b38b] bg-[#fff8ea] p-4 text-[14px] leading-relaxed text-[#74410d] sm:mx-0 sm:rounded-sm sm:border">
          {response.error}
        </div>
      ) : null}

      {lookup ? (
        <div className="grid gap-5">
          <ParcelFactsPanel lookup={lookup} />
          <ClassificationPanel classification={lookup.classification} />
        </div>
      ) : null}
    </section>
  );
}
