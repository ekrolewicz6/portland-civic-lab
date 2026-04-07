"use client";

import { Scale, AlertCircle, ExternalLink } from "lucide-react";

export interface DataDispute {
  slug: string;
  title: string;
  dateSurfaced: string;
  status: string;
  claimASource: string;
  claimASummary: string;
  claimAData: unknown;
  claimBSource: string;
  claimBSummary: string;
  claimBData: unknown;
  expertAssessment: string;
  expertSource: string;
  methodologyDifference: string;
  newsUrl: string;
}

interface ClaimCardProps {
  source: string;
  summary: string;
  accent: string;
}

function ClaimCard({ source, summary, accent }: ClaimCardProps) {
  return (
    <div
      className="rounded-sm border p-5 flex flex-col"
      style={{
        backgroundColor: `${accent}06`,
        borderColor: `${accent}30`,
      }}
    >
      <p
        className="text-[10px] font-semibold uppercase tracking-[0.15em] mb-2"
        style={{ color: accent }}
      >
        {source}
      </p>
      <p className="text-[14px] text-[var(--color-ink)] leading-relaxed">
        {summary}
      </p>
    </div>
  );
}

export default function DataReconciliation({
  disputes,
}: {
  disputes: DataDispute[];
}) {
  if (!disputes || disputes.length === 0) return null;

  return (
    <section>
      <div className="flex items-center gap-2.5 mb-4">
        <Scale className="w-4 h-4 text-[#8b6c5c]" />
        <span className="text-[10px] font-mono font-bold text-[var(--color-ink-muted)]/60 bg-[var(--color-parchment)] px-1.5 py-0.5 rounded-sm">
          Q0
        </span>
        <h2 className="text-[11px] font-semibold text-[var(--color-ink-muted)] uppercase tracking-[0.15em]">
          Understanding the Numbers
        </h2>
        <div className="flex-1 h-px bg-[var(--color-parchment)]" />
      </div>

      {disputes.map((dispute) => {
        const surfaced = new Date(dispute.dateSurfaced).toLocaleDateString(
          "en-US",
          { month: "long", day: "numeric", year: "numeric", timeZone: "UTC" },
        );

        return (
          <div
            key={dispute.slug}
            className="bg-[var(--color-paper-warm)] border border-[var(--color-parchment)] rounded-sm p-6 mb-4"
          >
            <div className="flex items-start gap-3 mb-4">
              <AlertCircle className="w-5 h-5 text-[#b8860b] flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <h3 className="font-editorial-normal text-[22px] sm:text-[26px] leading-snug text-[var(--color-ink)]">
                  {dispute.title}
                </h3>
                <p className="text-[11px] text-[var(--color-ink-muted)] mt-1 font-mono uppercase tracking-wider">
                  Surfaced {surfaced}
                </p>
              </div>
            </div>

            <p className="text-[13px] text-[var(--color-ink-muted)] italic mb-5 leading-relaxed border-l-2 border-[#b8860b]/40 pl-4">
              Different agencies count homelessness differently. None of these
              numbers are wrong — they measure different things. Here is what
              each side is claiming and why the gap exists.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
              <ClaimCard
                source={dispute.claimASource}
                summary={dispute.claimASummary}
                accent="#7c8a4c"
              />
              <ClaimCard
                source={dispute.claimBSource}
                summary={dispute.claimBSummary}
                accent="#8b5a3c"
              />
            </div>

            <div className="mb-5">
              <h4 className="text-[11px] font-semibold text-[var(--color-ink-muted)] uppercase tracking-wider mb-2">
                Why the Numbers Differ
              </h4>
              <p className="text-[14px] text-[var(--color-ink)] leading-relaxed">
                {dispute.methodologyDifference}
              </p>
            </div>

            {dispute.expertAssessment && (
              <div className="bg-[var(--color-parchment)]/40 border border-[var(--color-parchment)] rounded-sm p-4 mb-4">
                <p className="text-[10px] font-semibold text-[var(--color-ink-muted)] uppercase tracking-wider mb-1">
                  Independent Assessment · {dispute.expertSource}
                </p>
                <p className="text-[13px] text-[var(--color-ink)] leading-relaxed">
                  {dispute.expertAssessment}
                </p>
              </div>
            )}

            {dispute.newsUrl && (
              <a
                href={dispute.newsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-[11px] text-[var(--color-ink-muted)] hover:text-[var(--color-ink)] font-mono uppercase tracking-wider"
              >
                Source coverage <ExternalLink className="w-3 h-3" />
              </a>
            )}
          </div>
        );
      })}
    </section>
  );
}
