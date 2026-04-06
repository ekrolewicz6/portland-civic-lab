"use client";

import { useState } from "react";
import { ChevronDown, Lock, Unlock } from "lucide-react";
import type { RestrictedFund } from "@/data/general-fund-budget";

function formatM(n: number): string {
  if (n >= 1_000_000_000) return `$${(n / 1_000_000_000).toFixed(2)}B`;
  if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(0)}M`;
  if (n >= 1_000) return `$${(n / 1_000).toFixed(0)}K`;
  return `$${n.toLocaleString()}`;
}

const CATEGORY_COLORS: Record<string, string> = {
  utility: "#2563eb",
  enterprise: "#6366f1",
  "voter-mandate": "#059669",
  "state-law": "#d97706",
  federal: "#7c3aed",
  debt: "#dc2626",
  "internal-service": "#6b7280",
  "general-fund": "#16a34a",
};

const CATEGORY_LABELS: Record<string, string> = {
  utility: "Utility Rate",
  enterprise: "Fee-for-Service",
  "voter-mandate": "Voter Mandate",
  "state-law": "State Law",
  federal: "Federal/TIF",
  debt: "Debt Obligation",
  "internal-service": "Internal Service",
  "general-fund": "Discretionary",
};

function FundRow({
  fund,
  totalBudget,
}: {
  fund: RestrictedFund;
  totalBudget: number;
}) {
  const [open, setOpen] = useState(false);
  const pct = (fund.amount / totalBudget) * 100;
  const color = CATEGORY_COLORS[fund.category] ?? "#94a3b8";
  const isGF = fund.category === "general-fund";

  return (
    <div className="border-b border-[var(--color-parchment)]/50 last:border-0">
      <button
        onClick={() => setOpen(!open)}
        className="w-full text-left py-3 px-3 sm:px-4 hover:bg-[var(--color-parchment)]/30 transition-colors"
      >
        <div className="flex items-center gap-2 sm:gap-3">
          {isGF ? (
            <Unlock className="w-3.5 h-3.5 flex-shrink-0 text-green-600" />
          ) : (
            <Lock className="w-3.5 h-3.5 flex-shrink-0 text-[var(--color-ink-muted)]/40" />
          )}
          <span
            className={`text-[13px] sm:text-[14px] font-medium flex-1 min-w-0 truncate ${
              isGF ? "text-green-700 font-semibold" : "text-[var(--color-ink)]"
            }`}
          >
            {fund.name}
          </span>
          <span
            className="text-[10px] sm:text-[11px] font-semibold uppercase tracking-wider px-1.5 py-0.5 rounded-sm flex-shrink-0 hidden sm:block"
            style={{ color, backgroundColor: `${color}15` }}
          >
            {CATEGORY_LABELS[fund.category] ?? fund.category}
          </span>
          <span className="text-[12px] sm:text-[13px] font-mono text-[var(--color-ink-muted)] tabular-nums flex-shrink-0">
            {pct.toFixed(1)}%
          </span>
          <span
            className={`text-[13px] sm:text-[14px] font-mono font-semibold tabular-nums flex-shrink-0 ${
              isGF ? "text-green-700" : "text-[var(--color-ink)]"
            }`}
          >
            {formatM(fund.amount)}
          </span>
          <ChevronDown
            className={`w-3.5 h-3.5 text-[var(--color-ink-muted)]/40 flex-shrink-0 transition-transform duration-200 ${
              open ? "rotate-180" : ""
            }`}
          />
        </div>
      </button>

      {open && (
        <div className="px-3 sm:px-4 pb-3 ml-6 sm:ml-8">
          <div
            className="rounded-sm p-3 sm:p-4 border-l-[3px]"
            style={{
              borderColor: color,
              backgroundColor: `${color}06`,
            }}
          >
            <div className="flex items-center gap-2 mb-2 sm:hidden">
              <span
                className="text-[10px] font-semibold uppercase tracking-wider px-1.5 py-0.5 rounded-sm"
                style={{ color, backgroundColor: `${color}15` }}
              >
                {CATEGORY_LABELS[fund.category] ?? fund.category}
              </span>
            </div>
            <p className="text-[13px] text-[var(--color-ink-light)] leading-relaxed mb-2">
              {fund.restriction}
            </p>
            <p className="text-[11px] text-[var(--color-ink-muted)] font-mono leading-relaxed">
              {fund.legalAuthority}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

export default function CityBudgetOverview({
  totalAllFunds,
  generalFundPct,
  restrictedFunds,
}: {
  totalAllFunds: number;
  generalFundPct: number;
  restrictedFunds: RestrictedFund[];
}) {
  const sorted = [...restrictedFunds].sort((a, b) => b.amount - a.amount);
  const gfFund = sorted.find((f) => f.category === "general-fund");
  const restrictedOnly = sorted.filter((f) => f.category !== "general-fund");

  return (
    <div className="space-y-5">
      {/* Key insight */}
      <div className="flex flex-col sm:flex-row gap-3 sm:gap-6 items-start">
        <div className="flex-1">
          <p className="text-[15px] text-[var(--color-ink-muted)] leading-relaxed">
            Portland&apos;s total budget is{" "}
            <span className="font-semibold text-[var(--color-ink)]">
              {formatM(totalAllFunds)}
            </span>
            . But{" "}
            <span className="font-semibold text-[var(--color-ink)]">
              {(100 - generalFundPct).toFixed(0)}%
            </span>{" "}
            is legally restricted — locked to specific purposes by voter
            mandates, bond covenants, state law, and federal requirements. Only
            the General Fund can be spent flexibly. Click any row to see what
            restricts it.
          </p>
        </div>
        <div className="flex-shrink-0 bg-green-50 border border-green-200/60 rounded-sm px-4 py-2.5 text-center">
          <p className="text-[9px] sm:text-[10px] text-green-600 font-semibold uppercase tracking-wider">
            Flexible
          </p>
          <p className="text-[20px] sm:text-[24px] font-mono font-bold text-green-700 leading-none tabular-nums">
            {generalFundPct.toFixed(0)}%
          </p>
          <p className="text-[10px] text-green-600 mt-0.5">
            of total budget
          </p>
        </div>
      </div>

      {/* Stacked bar */}
      <div className="space-y-2">
        <div className="h-8 sm:h-10 rounded-sm overflow-hidden flex border border-[var(--color-parchment)]">
          {sorted.map((fund) => {
            const pct = (fund.amount / totalAllFunds) * 100;
            if (pct < 0.5) return null;
            const color = CATEGORY_COLORS[fund.category] ?? "#94a3b8";
            const isGF = fund.category === "general-fund";
            return (
              <div
                key={fund.name}
                className="h-full relative group transition-opacity hover:opacity-90"
                style={{
                  width: `${pct}%`,
                  backgroundColor: isGF ? "#16a34a" : color,
                  opacity: isGF ? 1 : 0.35,
                }}
                title={`${fund.name}: ${formatM(fund.amount)} (${pct.toFixed(1)}%)`}
              >
                {isGF && pct > 5 && (
                  <span className="absolute inset-0 flex items-center justify-center text-[10px] sm:text-[11px] font-semibold text-white whitespace-nowrap">
                    General Fund
                  </span>
                )}
              </div>
            );
          })}
        </div>
        <div className="flex items-center justify-between text-[10px] text-[var(--color-ink-muted)]">
          <span className="flex items-center gap-1">
            <Lock className="w-3 h-3" /> Legally restricted ({(100 - generalFundPct).toFixed(0)}%)
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-sm bg-green-600 inline-block" />
            General Fund ({generalFundPct.toFixed(0)}%)
          </span>
        </div>
      </div>

      {/* Fund list */}
      <div className="border border-[var(--color-parchment)] rounded-sm bg-white/50">
        {/* General Fund first, highlighted */}
        {gfFund && (
          <FundRow fund={gfFund} totalBudget={totalAllFunds} />
        )}
        {/* Then all restricted funds */}
        {restrictedOnly.map((fund) => (
          <FundRow key={fund.name} fund={fund} totalBudget={totalAllFunds} />
        ))}
      </div>
    </div>
  );
}
