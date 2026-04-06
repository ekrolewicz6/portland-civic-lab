"use client";

import { useState } from "react";
import { ChevronDown, Info } from "lucide-react";
import type { CashTransfer } from "@/data/general-fund-budget";

// ─── Transfer Descriptions ────────────────────────────────────────────────────
// Context for each transfer, sourced from budget documents and city code

const TRANSFER_CONTEXT: Record<
  string,
  { short: string; detail: string; category: string }
> = {
  "General Fund Overhead Charge": {
    short: "Pays for shared city services every bureau uses",
    detail:
      "The cost of centralized services — IT, HR, facilities, legal, finance, risk management — allocated proportionally across all bureaus. This is how the General Fund pays for the infrastructure that keeps city government running. It's the single largest transfer because every bureau depends on these shared services.",
    category: "operations",
  },
  "Joint Office of Homeless Services": {
    short: "Portland's ongoing commitment to the city-county shelter system",
    detail:
      "The General Fund's ongoing cash transfer to JOHS, the joint Portland-Multnomah County homelessness system. This is separate from the $35M Alternative Shelter and $19.8M Overnight Shelter in the City Administrator's budget — meaning the city's total homelessness spend is closer to $85M when combined. The JOHS partnership expires July 2027, creating uncertainty about future governance.",
    category: "homelessness",
  },
  "Parks Construction": {
    short: "Capital projects — building and renovating parks infrastructure",
    detail:
      "Funds capital improvements to Portland's 200+ parks: playground replacements, trail construction, facility renovations, and ADA accessibility upgrades. Separate from the Parks operating budget, which covers daily maintenance and programming. The Parks Levy funds some capital work, but this General Fund transfer fills gaps.",
    category: "infrastructure",
  },
  "ADU Ramp Bond": {
    short: "Debt service on accessibility and housing bonds",
    detail:
      "Annual principal and interest payments on bonds issued for the Accessory Dwelling Unit (ADU) fee waiver program and ADA ramp/accessibility improvements. The ADU program was created to increase Portland's housing supply by reducing barriers to building backyard homes.",
    category: "housing",
  },
  "Pension Debt Cash Transfer": {
    short: "Paying down bonded pension debt from PERS unfunded liability",
    detail:
      "Portland issued bonds to address part of Oregon's PERS (Public Employees Retirement System) unfunded liability, currently ~$24B statewide at ~78.8% funded. This transfer covers annual debt service on those bonds. Pension obligations are constitutionally protected in Oregon — they cannot be reduced.",
    category: "debt",
  },
  "OMF ITS Transfer": {
    short: "Internal IT infrastructure — networks, servers, systems",
    detail:
      "Payment to the Office of Management & Finance for citywide Information Technology Services: data centers, network infrastructure, enterprise software licenses, cybersecurity, and system maintenance. This covers the backbone technology that all city bureaus run on.",
    category: "operations",
  },
  "Public Elections Fund": {
    short: "Small Donor Elections — public campaign matching funds",
    detail:
      "Funds Portland's Small Donor Elections program, which matches small campaign contributions with public funds to reduce the influence of large donors. Currently operating at 50% match caps due to budget constraints. The program was approved by voters in 2018.",
    category: "governance",
  },
  PBOT: {
    short: "General Fund support for transportation functions",
    detail:
      "A small General Fund supplement to the Portland Bureau of Transportation, which is primarily funded by gas taxes, parking revenue, and federal/state grants. This transfer covers specific functions — like derelict RV removal coordination — that aren't eligible for dedicated transportation revenue sources.",
    category: "infrastructure",
  },
  "PP&D Neighborhood Quality": {
    short: "Code enforcement for neighborhood livability",
    detail:
      "Funds Portland Permitting & Development's neighborhood livability enforcement: noise complaints, nuisance properties, abandoned vehicles, and property maintenance violations. This is the team that responds when a neighbor's property becomes a public health or safety concern.",
    category: "livability",
  },
  "Habitat Remediation": {
    short: "Environmental cleanup obligations, including Superfund work",
    detail:
      "Funding for environmental remediation, primarily related to Portland's obligations at contaminated sites. Portland Harbor is an EPA Superfund site spanning 10 miles of the Willamette River. The city, as a potentially responsible party, contributes to ongoing assessment, cleanup planning, and remediation activities.",
    category: "environment",
  },
  "HIF Bond Principal": {
    short: "Housing Investment Fund debt service — principal",
    detail:
      "Principal payments on Housing Investment Fund bonds that finance affordable housing construction and preservation. These bonds leverage General Fund commitments to access capital markets, multiplying the city's housing investment capacity.",
    category: "housing",
  },
  "HIF Bond Interest": {
    short: "Housing Investment Fund debt service — interest",
    detail:
      "Interest payments on Housing Investment Fund bonds. Combined with the principal payment, the city pays $937K/year in debt service on these housing bonds.",
    category: "housing",
  },
  "Council Protection Services": {
    short: "Security detail for City Council members",
    detail:
      "Funds security services for Portland's 12 City Council members. The FY 2026-27 budget includes a request to increase this from $1.3M to $2.9M total due to escalating threats against elected officials. The proposal would transition from reactive to proactive security with 24-hour residential protection when credible threats are identified.",
    category: "governance",
  },
  "PP&D Liquor Licensing": {
    short: "Liquor license administration and compliance",
    detail:
      "Funds the administration of liquor license applications, renewals, compliance inspections, and enforcement for Portland establishments. Oregon's liquor licensing is shared between state (OLCC) and local government.",
    category: "livability",
  },
  "PP&D Noise": {
    short: "Noise regulation and complaint response",
    detail:
      "Funds Portland's noise control program — investigating noise complaints, enforcing noise ordinances, and issuing noise variances for construction and events. Portland's noise code sets limits by zone and time of day.",
    category: "livability",
  },
  "Facilities - Charter Transition Loan": {
    short: "Loan payment for government transition costs",
    detail:
      "Debt service on a loan that funded Portland's transition to its new form of government under the 2022 charter reform. The transition included standing up 12 council districts, new administrative structures, and ranked-choice voting implementation.",
    category: "governance",
  },
  "HIF CAL Target": {
    short: "Housing Investment Fund baseline allocation",
    detail:
      "The Housing Investment Fund's Current Appropriation Level target — a baseline General Fund allocation that supports ongoing affordable housing programs beyond bond-funded projects.",
    category: "housing",
  },
  "Water-Parks": {
    short: "Water utility costs for park irrigation and facilities",
    detail:
      "Covers water utility costs for Portland's parks system — irrigation for athletic fields, community gardens, and landscaped areas, plus water service for restrooms, splash pads, and pool facilities.",
    category: "infrastructure",
  },
  "Portland Harbor": {
    short: "Superfund site coordination and legal costs",
    detail:
      "Funds the city's policy coordination and legal representation related to the Portland Harbor Superfund site. The EPA-designated cleanup area spans from the Broadway Bridge to Sauvie Island. The city participates in the multi-party cleanup process alongside other responsible parties.",
    category: "environment",
  },
  "Facilities - Westside Staging": {
    short: "Temporary staging space for displaced city staff",
    detail:
      "Lease costs for temporary workspace used during building renovations or when staff are displaced from their primary offices. Part of the city's facilities management portfolio.",
    category: "operations",
  },
  "Parks Memorial Trust": {
    short: "Memorial donations and trust fund distributions",
    detail:
      "Distributions from the Parks Memorial Trust, which holds donations made in memory of individuals for park improvements, benches, trees, and other memorial installations.",
    category: "infrastructure",
  },
  "Facilities - Council Security": {
    short: "Physical security infrastructure at Council chambers",
    detail:
      "Funds security equipment and infrastructure at City Hall and Council chambers — access control, screening equipment, and security systems. Separate from the Council Protection Services personnel budget.",
    category: "governance",
  },
  "Facilities - McCall's Building O&M": {
    short: "Operations and maintenance for McCall's building",
    detail:
      "Operating and maintenance costs for the McCall's Waterfront Park building, which houses some city functions and event spaces along the Willamette River.",
    category: "operations",
  },
};

const CATEGORY_STYLES: Record<string, { color: string; label: string }> = {
  operations: { color: "#6b7280", label: "City Operations" },
  homelessness: { color: "#b45309", label: "Homelessness" },
  infrastructure: { color: "#2563eb", label: "Infrastructure" },
  housing: { color: "#7c3aed", label: "Housing" },
  debt: { color: "#dc2626", label: "Debt Service" },
  governance: { color: "#0f766e", label: "Governance" },
  livability: { color: "#059669", label: "Livability" },
  environment: { color: "#16a34a", label: "Environment" },
};

function formatM(n: number): string {
  if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `$${Math.round(n / 1_000).toLocaleString()}K`;
  return `$${n.toLocaleString()}`;
}

function TransferRow({
  transfer,
  totalTransfers,
  maxAmount,
}: {
  transfer: CashTransfer;
  totalTransfers: number;
  maxAmount: number;
}) {
  const [open, setOpen] = useState(false);
  const ctx = TRANSFER_CONTEXT[transfer.name];
  const pct = (transfer.amount / totalTransfers) * 100;
  const barWidth = (transfer.amount / maxAmount) * 100;
  const catStyle = ctx
    ? CATEGORY_STYLES[ctx.category]
    : { color: "#94a3b8", label: "Other" };

  return (
    <div className="border-b border-[var(--color-parchment)]/50 last:border-0">
      <button
        onClick={() => ctx && setOpen(!open)}
        className={`w-full text-left py-3.5 px-4 transition-colors ${
          ctx ? "hover:bg-[var(--color-parchment)]/30 cursor-pointer" : ""
        }`}
      >
        {/* Main row */}
        <div className="flex items-start sm:items-center gap-2 sm:gap-3">
          <span
            className="w-[5px] h-[5px] rounded-full flex-shrink-0 mt-1.5 sm:mt-0"
            style={{ backgroundColor: catStyle.color }}
          />
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1 sm:gap-2">
              <span className="text-[13px] sm:text-[14px] text-[var(--color-ink)] font-medium truncate">
                {transfer.name}
              </span>
              {ctx && (
                <Info className="w-3 h-3 text-[var(--color-ink-muted)]/50 flex-shrink-0 hidden sm:block" />
              )}
            </div>
            {ctx && !open && (
              <p className="text-[11px] text-[var(--color-ink-muted)] mt-0.5 leading-snug hidden sm:block">
                {ctx.short}
              </p>
            )}
          </div>
          <span className="text-[11px] sm:text-[12px] font-mono text-[var(--color-ink-muted)] tabular-nums flex-shrink-0 hidden sm:block">
            {pct.toFixed(1)}%
          </span>
          <span className="text-[13px] sm:text-[14px] font-mono font-semibold text-[var(--color-ink)] tabular-nums flex-shrink-0 text-right">
            {formatM(transfer.amount)}
          </span>
          {ctx && (
            <ChevronDown
              className={`w-3.5 h-3.5 text-[var(--color-ink-muted)]/40 flex-shrink-0 transition-transform duration-200 ${
                open ? "rotate-180" : ""
              }`}
            />
          )}
        </div>

        {/* Proportional bar */}
        <div className="mt-2 ml-3 sm:ml-5 h-[4px] bg-[var(--color-parchment)]/50 rounded-full overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-500"
            style={{
              width: `${barWidth}%`,
              backgroundColor: catStyle.color,
              opacity: 0.45,
            }}
          />
        </div>
      </button>

      {/* Expanded detail */}
      {open && ctx && (
        <div className="px-3 sm:px-4 pb-4 ml-2 sm:ml-5">
          <div
            className="rounded-sm p-4 border-l-[3px]"
            style={{
              borderColor: catStyle.color,
              backgroundColor: `${catStyle.color}08`,
            }}
          >
            <div className="flex items-center gap-2 mb-2">
              <span
                className="text-[10px] font-semibold uppercase tracking-[0.1em] px-2 py-0.5 rounded-sm"
                style={{
                  color: catStyle.color,
                  backgroundColor: `${catStyle.color}15`,
                }}
              >
                {catStyle.label}
              </span>
            </div>
            <p className="text-[13px] text-[var(--color-ink-light)] leading-relaxed">
              {ctx.detail}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

export default function CashTransfers({
  transfers,
}: {
  transfers: CashTransfer[];
}) {
  const sorted = [...transfers].sort((a, b) => b.amount - a.amount);
  const totalTransfers = transfers.reduce((s, t) => s + t.amount, 0);
  const maxAmount = sorted[0]?.amount ?? 1;

  // Group by category for summary
  const categoryTotals = sorted.reduce(
    (acc, t) => {
      const ctx = TRANSFER_CONTEXT[t.name];
      const cat = ctx?.category ?? "other";
      acc[cat] = (acc[cat] ?? 0) + t.amount;
      return acc;
    },
    {} as Record<string, number>,
  );

  // Top-level insight
  const overheadAndHomelessness =
    (transfers.find((t) => t.name.includes("Overhead"))?.amount ?? 0) +
    (transfers.find((t) => t.name.includes("Homeless"))?.amount ?? 0);
  const ohPct = ((overheadAndHomelessness / totalTransfers) * 100).toFixed(0);

  return (
    <div className="space-y-5">
      {/* Narrative lead */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <p className="text-[15px] text-[var(--color-ink-muted)] leading-relaxed">
            Before a dollar reaches a bureau program, the General Fund transfers{" "}
            <span className="font-semibold text-[var(--color-ink)]">
              {formatM(totalTransfers)}
            </span>{" "}
            to other funds.{" "}
            <span className="font-semibold text-[var(--color-ink)]">
              {ohPct}%
            </span>{" "}
            goes to just two things: the shared services overhead charge and the
            Joint Office of Homeless Services. Click any row to learn what it
            funds.
          </p>
        </div>
      </div>

      {/* Category summary chips */}
      <div className="flex flex-wrap gap-2">
        {Object.entries(categoryTotals)
          .sort(([, a], [, b]) => b - a)
          .map(([cat, total]) => {
            const style = CATEGORY_STYLES[cat] ?? {
              color: "#94a3b8",
              label: "Other",
            };
            return (
              <div
                key={cat}
                className="flex items-center gap-1.5 px-2.5 py-1 rounded-sm"
                style={{ backgroundColor: `${style.color}10` }}
              >
                <span
                  className="w-[6px] h-[6px] rounded-full"
                  style={{ backgroundColor: style.color }}
                />
                <span
                  className="text-[11px] font-medium"
                  style={{ color: style.color }}
                >
                  {style.label}
                </span>
                <span className="text-[11px] font-mono font-semibold text-[var(--color-ink-muted)]">
                  {formatM(total)}
                </span>
              </div>
            );
          })}
      </div>

      {/* Transfer rows */}
      <div className="border border-[var(--color-parchment)] rounded-sm bg-white/50">
        {sorted.map((transfer) => (
          <TransferRow
            key={transfer.name}
            transfer={transfer}
            totalTransfers={totalTransfers}
            maxAmount={maxAmount}
          />
        ))}
      </div>
    </div>
  );
}
