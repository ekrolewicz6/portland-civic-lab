import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import {
  fetchQuestionData,
  getBaseUrl,
  extractHeadlineValue,
  extractHeadlineLabel,
} from "@/lib/dashboard-data";
import { PERMITS_URL } from "@/lib/site";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Live Dashboard | Portland Civic Labs",
  description:
    "A live civic dashboard for Portland, Oregon. Explore housing, safety, homelessness, economy, education, climate, quality of life, and accountability through public data.",
};

function formatEditionDate(d: Date): string {
  return d
    .toLocaleDateString("en-US", {
      weekday: "long",
      month: "long",
      day: "numeric",
      year: "numeric",
    })
    .toUpperCase();
}

export default async function DashboardPage() {
  const baseUrl = await getBaseUrl();
  const questions = await fetchQuestionData(baseUrl);
  const editionDate = formatEditionDate(new Date());

  return (
    <div>
      <section className="relative bg-[var(--color-canopy)] noise-overlay overflow-hidden">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-[var(--color-canopy-light)] rounded-full blur-[180px] opacity-25 -translate-y-1/2 translate-x-1/4 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[420px] h-[420px] bg-[var(--color-ember)] rounded-full blur-[160px] opacity-[0.06] translate-y-1/2 -translate-x-1/3 pointer-events-none" />

        <div className="relative z-10 max-w-[1400px] 3xl:max-w-[1800px] mx-auto px-5 sm:px-8 lg:px-12 pt-8 pb-10 sm:pt-10 sm:pb-12">
          <div className="flex items-center gap-4 text-[10px] font-mono uppercase tracking-[0.22em] text-white/35">
            <span className="text-[var(--color-ember)]/80">Live Dashboard</span>
            <div className="flex-1 h-px bg-white/10" />
            <span>{editionDate}</span>
          </div>

          <div className="mt-5 sm:mt-6 grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-10 items-end">
            <div className="lg:col-span-8">
              <h1 className="font-editorial-normal text-[40px] sm:text-[52px] lg:text-[64px] text-white leading-[1.02] tracking-tight animate-fade-up">
                Portland,{" "}
                <span className="font-editorial italic text-[var(--color-ember-bright)]">
                  by the numbers
                </span>
              </h1>
            </div>
            <div className="lg:col-span-4 lg:pb-2">
              <p
                className="text-[14px] sm:text-[15px] text-white/55 leading-relaxed max-w-md lg:border-l lg:border-white/15 lg:pl-5 animate-fade-up"
                style={{ animationDelay: "100ms" }}
              >
                A secondary tool in the platform: public data on housing,
                safety, infrastructure, and city performance, with every number
                linked to its source.
              </p>
            </div>
          </div>

          <div className="mt-6">
            <a
              href={PERMITS_URL}
              className="inline-flex items-center gap-2 text-[12px] font-mono uppercase tracking-[0.16em] text-[var(--color-sage)] hover:text-white transition-colors"
            >
              Need to act on a property? Start with Portland Permits
              <ArrowUpRight className="w-4 h-4" />
            </a>
          </div>

          <div className="mt-7 sm:mt-8 h-px bg-gradient-to-r from-[var(--color-ember)]/40 via-white/15 to-transparent" />
        </div>
      </section>

      <section className="relative max-w-[1400px] 3xl:max-w-[1800px] mx-auto w-full px-5 sm:px-8 lg:px-12 pt-8 sm:pt-10">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-5">
          {questions.map((q, i) => {
            const api = q.apiData;
            const hasData =
              api && api.dataStatus !== "unavailable" && api.dataAvailable !== false;
            const value = hasData ? extractHeadlineValue(api?.headline) : "—";
            const label = hasData
              ? extractHeadlineLabel(api?.headline)
              : "Data collection in progress";
            const sourceText = hasData ? api?.source : "Pending";

            return (
              <Link
                key={q.id}
                href={`/dashboard/${q.id}`}
                className="group relative bg-[var(--color-paper-warm)] border border-[var(--color-parchment)] rounded-sm p-5 sm:p-6 transition-all duration-300 hover:border-[var(--color-sage)] hover:-translate-y-0.5 overflow-hidden animate-fade-up"
                style={
                  {
                    animationDelay: `${120 + i * 50}ms`,
                    "--accent": q.color,
                  } as React.CSSProperties
                }
              >
                <div
                  className="absolute top-0 left-0 right-0 h-[3px] transition-all duration-300 group-hover:h-[5px]"
                  style={{ backgroundColor: q.color, opacity: 0.85 }}
                />

                <div className="flex items-center justify-between mb-3 mt-1">
                  <span
                    className="text-[11px] sm:text-[12px] font-mono font-bold uppercase tracking-[0.16em]"
                    style={{ color: q.color }}
                  >
                    Section {String(i + 1).padStart(2, "0")}
                  </span>
                  <ArrowUpRight className="w-4 h-4 text-[var(--color-ink-muted)]/40 group-hover:text-[var(--color-ink)] group-hover:-translate-y-0.5 group-hover:translate-x-0.5 transition-all" />
                </div>

                <h2 className="font-editorial text-[16px] sm:text-[17px] lg:text-[18px] text-[var(--color-ink)] leading-snug min-h-[48px]">
                  {q.question}
                </h2>

                <p className="mt-4 text-[34px] sm:text-[38px] lg:text-[42px] font-bold text-[var(--color-ink)] tracking-tight leading-none tabular-nums">
                  {value}
                </p>

                <p className="mt-2 text-[13px] sm:text-[14px] text-[var(--color-ink-light)] leading-snug line-clamp-2 min-h-[36px]">
                  {label}
                </p>

                <div className="mt-4 pt-3 border-t border-[var(--color-parchment)] flex items-center justify-between gap-2">
                  <span className="text-[11px] sm:text-[12px] font-mono uppercase tracking-[0.1em] text-[var(--color-ink-muted)] truncate">
                    {sourceText}
                  </span>
                  <span className="text-[11px] sm:text-[12px] font-mono font-semibold uppercase tracking-wider text-[var(--color-canopy)]/70 group-hover:text-[var(--color-canopy)] transition-colors flex-shrink-0">
                    Read →
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      </section>
    </div>
  );
}
