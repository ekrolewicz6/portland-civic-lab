"use client";

import { useState } from "react";
import { Landmark, Receipt } from "lucide-react";
import TaxDetail from "../tax/TaxDetail";
import BudgetExplorer from "./BudgetExplorer";

const FISCAL_COLOR = "#1e40af";

type Tab = "budget" | "tax";

const TABS: {
  id: Tab;
  label: string;
  shortLabel: string;
  Icon: React.ComponentType<{ className?: string }>;
  description: string;
}[] = [
  {
    id: "budget",
    label: "Budget Explorer",
    shortLabel: "Budget",
    Icon: Landmark,
    description:
      "Where the General Fund goes, how it's funded, and what happens if we cut.",
  },
  {
    id: "tax",
    label: "Tax Comparison",
    shortLabel: "Taxes",
    Icon: Receipt,
    description:
      "How Portland's effective tax rate compares to peer cities across income levels.",
  },
];

export default function FiscalDetail() {
  const [activeTab, setActiveTab] = useState<Tab>("budget");

  const ActiveTab = TABS.find((t) => t.id === activeTab)!;

  return (
    <div className="space-y-8">
      {/* Tab nav */}
      <section>
        <div className="flex items-center gap-2.5 mb-4">
          <ActiveTab.Icon
            className="w-4 h-4 text-[#1e40af]"
          />
          <h2 className="text-[13px] font-semibold text-[var(--color-ink-muted)] uppercase tracking-[0.15em]">
            {ActiveTab.label}
          </h2>
          <div className="flex-1 h-px bg-[var(--color-parchment)]" />
        </div>

        <div className="flex flex-wrap gap-1 mb-6">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className="flex items-center gap-2 px-4 py-2 rounded-sm text-[13px] font-medium transition-all"
              style={{
                backgroundColor:
                  activeTab === tab.id
                    ? FISCAL_COLOR
                    : "var(--color-paper-warm)",
                color:
                  activeTab === tab.id ? "white" : "var(--color-ink-muted)",
                border: `1px solid ${activeTab === tab.id ? FISCAL_COLOR : "var(--color-parchment)"}`,
              }}
            >
              <tab.Icon className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">{tab.label}</span>
              <span className="sm:hidden">{tab.shortLabel}</span>
            </button>
          ))}
        </div>

        <p className="text-[13px] text-[var(--color-ink-muted)] mb-5 italic">
          {ActiveTab.description}
        </p>

        {/* Active view */}
        {activeTab === "budget" && <BudgetExplorer />}
        {activeTab === "tax" && <TaxDetail />}
      </section>
    </div>
  );
}
