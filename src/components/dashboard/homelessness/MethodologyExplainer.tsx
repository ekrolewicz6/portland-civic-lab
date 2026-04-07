"use client";

import { useState } from "react";
import {
  BookOpen,
  ChevronDown,
  ChevronRight,
  ExternalLink,
  ClipboardList,
  Database,
  BedDouble,
  TrendingUp,
  FileBarChart,
} from "lucide-react";

export interface DataSource {
  sourceKey: string;
  displayName: string;
  agency: string;
  methodology: string;
  scope: string;
  whatItMisses: string;
  updateFrequency: string;
  lastUpdated: string | null;
  nextExpected: string | null;
  url: string;
  usedBy: string[];
}

const ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  pit_count: ClipboardList,
  hmis_bnl: Database,
  city_shelter_census: BedDouble,
  hrac_prevalence: TrendingUp,
  shs_outcomes: FileBarChart,
};

function MethodologyCard({ source }: { source: DataSource }) {
  const [open, setOpen] = useState(false);
  const Icon = ICONS[source.sourceKey] ?? BookOpen;

  const lastUpdated = source.lastUpdated
    ? new Date(source.lastUpdated).toLocaleDateString("en-US", {
        month: "short",
        year: "numeric",
        timeZone: "UTC",
      })
    : "—";

  return (
    <div className="border border-[var(--color-parchment)] rounded-sm overflow-hidden bg-[var(--color-paper-warm)]">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center gap-3 p-4 text-left hover:bg-[var(--color-parchment)]/30 transition-colors"
      >
        <Icon className="w-4 h-4 text-[#8b6c5c] flex-shrink-0" />
        <div className="flex-1 min-w-0">
          <p className="text-[14px] font-semibold text-[var(--color-ink)] truncate">
            {source.displayName}
          </p>
          <p className="text-[11px] text-[var(--color-ink-muted)] truncate">
            {source.agency} · {source.updateFrequency} · last updated{" "}
            {lastUpdated}
          </p>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          {source.usedBy.map((u) => (
            <span
              key={u}
              className="text-[9px] font-mono uppercase tracking-wider bg-[var(--color-parchment)] text-[var(--color-ink-muted)] px-1.5 py-0.5 rounded-sm"
            >
              {u}
            </span>
          ))}
          {open ? (
            <ChevronDown className="w-4 h-4 text-[var(--color-ink-muted)]" />
          ) : (
            <ChevronRight className="w-4 h-4 text-[var(--color-ink-muted)]" />
          )}
        </div>
      </button>

      {open && (
        <div className="px-4 pb-5 pt-1 border-t border-[var(--color-parchment)] space-y-3">
          <div>
            <p className="text-[10px] font-semibold text-[var(--color-ink-muted)] uppercase tracking-wider mb-1">
              What it measures
            </p>
            <p className="text-[13px] text-[var(--color-ink)] leading-relaxed">
              {source.methodology}
            </p>
          </div>

          <div>
            <p className="text-[10px] font-semibold text-[var(--color-ink-muted)] uppercase tracking-wider mb-1">
              Scope
            </p>
            <p className="text-[13px] text-[var(--color-ink)] leading-relaxed">
              {source.scope}
            </p>
          </div>

          {source.whatItMisses && (
            <div>
              <p className="text-[10px] font-semibold text-[var(--color-ink-muted)] uppercase tracking-wider mb-1">
                What it misses
              </p>
              <p className="text-[13px] text-[var(--color-ink)] leading-relaxed">
                {source.whatItMisses}
              </p>
            </div>
          )}

          {source.url && (
            <a
              href={source.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-[11px] text-[var(--color-ink-muted)] hover:text-[var(--color-ink)] font-mono uppercase tracking-wider pt-1"
            >
              Original source <ExternalLink className="w-3 h-3" />
            </a>
          )}
        </div>
      )}
    </div>
  );
}

export default function MethodologyExplainer({
  sources,
}: {
  sources: DataSource[];
}) {
  if (!sources || sources.length === 0) return null;

  return (
    <section>
      <div className="flex items-center gap-2.5 mb-4">
        <BookOpen className="w-4 h-4 text-[#8b6c5c]" />
        <h2 className="text-[11px] font-semibold text-[var(--color-ink-muted)] uppercase tracking-[0.15em]">
          How These Numbers Are Measured
        </h2>
        <div className="flex-1 h-px bg-[var(--color-parchment)]" />
      </div>

      <p className="text-[13px] text-[var(--color-ink-muted)] mb-4 leading-relaxed">
        Every homelessness number on this page comes from a different
        methodology. Click any source to see what it measures, what it misses,
        and how often it&rsquo;s updated.
      </p>

      <div className="space-y-2">
        {sources.map((source) => (
          <MethodologyCard key={source.sourceKey} source={source} />
        ))}
      </div>
    </section>
  );
}
