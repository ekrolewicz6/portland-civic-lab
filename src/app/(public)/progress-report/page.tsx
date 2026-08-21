import type { Metadata } from "next";
import { headers } from "next/headers";
import Link from "next/link";
import { BookOpen } from "lucide-react";
import ReportCard from "@/components/progress-report/ReportCard";
import type { ProgressReportSummary } from "@/app/api/progress-report/route";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  // Empty shell until the first report publishes — keep out of search.
  robots: { index: false, follow: false },
  title: "Portland Progress Report — Archive",
  description:
    "Quarterly publication combining dashboard data with narrative analysis. Portland's unofficial performance review.",
  openGraph: {
    title: "Portland Progress Report | Portland Civic Lab",
    description: "Quarterly data-driven analysis of Portland city government performance.",
    url: "https://www.portlandciviclab.org/progress-report",
  },
  alternates: { canonical: "https://www.portlandciviclab.org/progress-report" },
};

async function fetchReports(baseUrl: string): Promise<ProgressReportSummary[]> {
  try {
    const res = await fetch(`${baseUrl}/api/progress-report`, {
      cache: "no-store",
    });
    if (!res.ok) return [];
    const data = await res.json();
    return data.reports ?? [];
  } catch {
    return [];
  }
}

export default async function ProgressReportArchivePage() {
  const hdrs = await headers();
  const host = hdrs.get("host") ?? "localhost:3000";
  const proto = hdrs.get("x-forwarded-proto") ?? "http";
  const baseUrl = `${proto}://${host}`;

  const reports = await fetchReports(baseUrl);
  const [featured, ...rest] = reports;

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <div className="relative overflow-hidden noise-overlay bg-[var(--color-canopy)] text-white">
        <div className="absolute right-0 top-0 h-[420px] w-[520px] translate-x-1/4 -translate-y-1/3 rounded-full bg-[var(--color-canopy-light)] opacity-25 blur-[150px]" />
        <div className="relative max-w-[1400px] 3xl:max-w-[1800px] mx-auto px-5 sm:px-8 lg:px-12 py-14 sm:py-18">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-[10px] font-mono text-white/40 uppercase tracking-[0.22em] mb-8">
            <Link href="/dashboard" className="hover:text-white/60 transition-colors">
              Dashboard
            </Link>
            <span>/</span>
            <span className="text-[var(--color-ember)]">Progress Report</span>
          </div>

          <div className="flex items-start gap-4 mb-4">
            <div className="w-10 h-10 rounded-sm bg-[var(--color-ember)]/20 flex items-center justify-center flex-shrink-0 mt-1">
              <BookOpen className="w-5 h-5 text-[var(--color-ember)]" />
            </div>
            <div>
              <h1 className="font-editorial-normal text-[40px] sm:text-[56px] lg:text-[64px] leading-[1.08] tracking-tight mb-4">
                Portland Progress Report
              </h1>
              <p className="text-[17px] sm:text-[19px] text-white/60 leading-relaxed max-w-2xl">
                Quarterly publication combining dashboard data with narrative
                analysis. Portland&apos;s unofficial performance review.
              </p>
            </div>
          </div>
        </div>
        {/* Bottom accent */}
        <div className="h-px bg-gradient-to-r from-transparent via-[var(--color-ember)]/40 to-transparent" />
      </div>

      {/* Content */}
      <div className="max-w-[1400px] 3xl:max-w-[1800px] mx-auto px-5 sm:px-8 lg:px-12 py-12 sm:py-16">
        {reports.length === 0 ? (
          <div className="text-center py-20">
            <BookOpen className="w-12 h-12 text-[var(--color-parchment)] mx-auto mb-4" />
            <h2 className="font-editorial-normal text-[28px] text-[var(--color-ink-muted)] mb-2">
              No reports published yet
            </h2>
            <p className="text-[var(--color-ink-muted)] text-[14px]">
              The first Portland Progress Report is coming soon.
            </p>
          </div>
        ) : (
          <div className="space-y-12">
            {/* Featured (latest) report */}
            {featured && (
              <div className="animate-fade-up">
                <ReportCard report={featured} featured />
              </div>
            )}

            {/* Past issues */}
            {rest.length > 0 && (
              <div>
                <div className="section-divider mb-8">
                  <h2>Past Issues</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {rest.map((report) => (
                    <ReportCard key={report.id} report={report} />
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
