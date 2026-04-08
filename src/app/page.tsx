import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import {
  fetchQuestionData,
  getBaseUrl,
  extractHeadlineValue,
  extractHeadlineLabel,
} from "@/lib/dashboard-data";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: {
    absolute: "Portland Civic Lab — How is Portland actually doing?",
  },
  description:
    "A live civic dashboard for Portland, Oregon. Eight questions held to public record — housing, safety, homelessness, economy, education, climate, quality of life, and accountability. Real data from city APIs and government records. Updated automatically. No spin.",
  alternates: { canonical: "https://www.portlandciviclab.org" },
  openGraph: {
    title: "Portland Civic Lab — How is Portland actually doing?",
    description:
      "Eight questions held to public record. Real data, updated automatically, no spin.",
    url: "https://www.portlandciviclab.org",
    siteName: "Portland Civic Lab",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Portland Civic Lab — How is Portland actually doing?",
    description:
      "Eight questions held to public record. Real data, updated automatically, no spin.",
  },
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

export default async function HomePage() {
  const baseUrl = await getBaseUrl();
  const questions = await fetchQuestionData(baseUrl);
  const editionDate = formatEditionDate(new Date());

  return (
    <div className="min-h-screen flex flex-col bg-[var(--color-paper)]">
      <Header />

      {/* ─── Newspaper Masthead ──────────────────────────────────────── */}
      <section className="relative bg-[var(--color-canopy)] noise-overlay overflow-hidden">
        {/* Subtle background atmosphere */}
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-[var(--color-canopy-light)] rounded-full blur-[180px] opacity-25 -translate-y-1/2 translate-x-1/4 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[420px] h-[420px] bg-[var(--color-ember)] rounded-full blur-[160px] opacity-[0.06] translate-y-1/2 -translate-x-1/3 pointer-events-none" />

        <div className="relative z-10 max-w-[1400px] 3xl:max-w-[1800px] mx-auto px-5 sm:px-8 lg:px-12 pt-8 pb-10 sm:pt-10 sm:pb-12">
          {/* Edition rule */}
          <div className="flex items-center gap-4 text-[10px] font-mono uppercase tracking-[0.22em] text-white/35">
            <span className="text-[var(--color-ember)]/80">Vol. I &middot; No. 1</span>
            <div className="flex-1 h-px bg-white/10" />
            <span>{editionDate}</span>
          </div>

          {/* Masthead headline */}
          <div className="mt-5 sm:mt-6 grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-10 items-end">
            <div className="lg:col-span-8">
              <h1 className="font-editorial-normal text-[40px] sm:text-[52px] lg:text-[64px] text-white leading-[1.02] tracking-tight animate-fade-up">
                How is Portland{" "}
                <span className="font-editorial italic text-[var(--color-ember-bright)]">
                  actually
                </span>{" "}
                doing?
              </h1>
            </div>
            <div className="lg:col-span-4 lg:pb-2">
              <p
                className="text-[14px] sm:text-[15px] text-white/55 leading-relaxed max-w-md lg:border-l lg:border-white/15 lg:pl-5 animate-fade-up"
                style={{ animationDelay: "100ms" }}
              >
                Eight questions held to public record. Every number sourced
                from city APIs and government data — updated automatically,
                no spin.
              </p>
            </div>
          </div>

          {/* Bottom rule */}
          <div className="mt-7 sm:mt-8 h-px bg-gradient-to-r from-[var(--color-ember)]/40 via-white/15 to-transparent" />
        </div>
      </section>

      {/* ─── 8-Card Dashboard Grid ──────────────────────────────────── */}
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
                {/* Accent rule along the top */}
                <div
                  className="absolute top-0 left-0 right-0 h-[3px] transition-all duration-300 group-hover:h-[5px]"
                  style={{ backgroundColor: q.color, opacity: 0.85 }}
                />

                {/* Section label */}
                <div className="flex items-center justify-between mb-3 mt-1">
                  <span
                    className="text-[9px] font-mono font-semibold uppercase tracking-[0.18em]"
                    style={{ color: q.color }}
                  >
                    Section {String(i + 1).padStart(2, "0")}
                  </span>
                  <ArrowUpRight className="w-3.5 h-3.5 text-[var(--color-ink-muted)]/30 group-hover:text-[var(--color-ink-muted)] group-hover:-translate-y-0.5 group-hover:translate-x-0.5 transition-all" />
                </div>

                {/* Question */}
                <h2 className="font-editorial text-[15px] sm:text-[16px] text-[var(--color-ink)] leading-snug min-h-[44px]">
                  {q.question}
                </h2>

                {/* Big stat */}
                <p className="mt-4 text-[34px] sm:text-[38px] lg:text-[42px] font-bold text-[var(--color-ink)] tracking-tight leading-none tabular-nums">
                  {value}
                </p>

                {/* Label */}
                <p className="mt-2 text-[12px] sm:text-[13px] text-[var(--color-ink-muted)] leading-snug line-clamp-2 min-h-[34px]">
                  {label}
                </p>

                {/* Footer source line */}
                <div className="mt-4 pt-3 border-t border-[var(--color-parchment)]/70 flex items-center justify-between gap-2">
                  <span className="text-[10px] font-mono uppercase tracking-[0.12em] text-[var(--color-ink-muted)]/70 truncate">
                    {sourceText}
                  </span>
                  <span className="text-[10px] font-mono uppercase tracking-wider text-[var(--color-ink-muted)]/50 group-hover:text-[var(--color-ink)] transition-colors flex-shrink-0">
                    Read →
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* ─── Below the fold: editorial note + sources strip ─────────── */}
      <section className="max-w-[1400px] 3xl:max-w-[1800px] mx-auto w-full px-5 sm:px-8 lg:px-12 mt-16 sm:mt-20 mb-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 sm:gap-12">
          <div className="md:col-span-2">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-8 h-px bg-[var(--color-ember)]" />
              <span className="text-[10px] font-mono font-semibold uppercase tracking-[0.22em] text-[var(--color-ember)]">
                Editor&apos;s Note
              </span>
            </div>
            <p className="font-editorial text-[20px] sm:text-[22px] lg:text-[24px] leading-snug text-[var(--color-ink)] max-w-2xl">
              Portland is having a hard conversation with itself about housing,
              homelessness, public safety, and what kind of city it wants to be.
              This dashboard exists so that conversation has{" "}
              <em className="font-editorial italic text-[var(--color-canopy)]">
                shared facts
              </em>{" "}
              instead of competing narratives.
            </p>
            <p className="mt-5 text-[14px] text-[var(--color-ink-muted)] leading-relaxed max-w-2xl">
              Every number above is pulled directly from a public source —
              the city&apos;s permit database, the county&apos;s by-name list,
              ODE enrollment files, BLS labor reports — and updated
              automatically. Click any section to see the underlying data,
              the methodology, and the gaps we&apos;re still trying to fill.
            </p>
          </div>

          <div>
            <div className="flex items-center gap-3 mb-5">
              <div className="w-8 h-px bg-[var(--color-ember)]" />
              <span className="text-[10px] font-mono font-semibold uppercase tracking-[0.22em] text-[var(--color-ember)]">
                Principles
              </span>
            </div>
            <ul className="space-y-3 text-[13px] text-[var(--color-ink-muted)] leading-snug">
              <li className="flex gap-3">
                <span className="font-mono text-[var(--color-canopy)]/40 flex-shrink-0">
                  01
                </span>
                <span>
                  <span className="text-[var(--color-ink)] font-semibold">
                    Real data only.
                  </span>{" "}
                  No projections, no marketing.
                </span>
              </li>
              <li className="flex gap-3">
                <span className="font-mono text-[var(--color-canopy)]/40 flex-shrink-0">
                  02
                </span>
                <span>
                  <span className="text-[var(--color-ink)] font-semibold">
                    Open methodology.
                  </span>{" "}
                  If we can&apos;t show the math, we won&apos;t make the claim.
                </span>
              </li>
              <li className="flex gap-3">
                <span className="font-mono text-[var(--color-canopy)]/40 flex-shrink-0">
                  03
                </span>
                <span>
                  <span className="text-[var(--color-ink)] font-semibold">
                    Honest gaps.
                  </span>{" "}
                  When the data isn&apos;t there, we say so.
                </span>
              </li>
              <li className="flex gap-3">
                <span className="font-mono text-[var(--color-canopy)]/40 flex-shrink-0">
                  04
                </span>
                <span>
                  <span className="text-[var(--color-ink)] font-semibold">
                    Built for Portlanders.
                  </span>{" "}
                  Questions residents are actually asking.
                </span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
