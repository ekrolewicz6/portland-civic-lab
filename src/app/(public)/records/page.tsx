import type { Metadata } from "next";
import { pageMeta } from "@/lib/page-meta";
import Link from "next/link";
import { FileSearch, Send, Scale, CircleDollarSign } from "lucide-react";
import sql from "@/lib/db-query";

export const metadata: Metadata = pageMeta({
  title: "Public Records",
  description:
    "How to file an Oregon public records request, and a public tracker of the requests Portland Civic Lab has filed to fill gaps in the city's data.",
  path: "/records",
});

export const dynamic = "force-dynamic";

interface RecordsRequest {
  id: number;
  title: string;
  agency: string;
  description: string;
  requested_data: string | null;
  status: string;
  filed_at: string | null;
  resolved_at: string | null;
  outcome_note: string | null;
  result_url: string | null;
}

const STATUS_STYLES: Record<string, string> = {
  planned: "bg-slate-50 text-slate-700 border-slate-200",
  filed: "bg-blue-50 text-blue-800 border-blue-200",
  acknowledged: "bg-amber-50 text-amber-800 border-amber-200",
  fulfilled: "bg-emerald-50 text-emerald-800 border-emerald-200",
  denied: "bg-red-50 text-red-800 border-red-200",
  appealed: "bg-purple-50 text-purple-800 border-purple-200",
};

const guideSteps = [
  {
    icon: FileSearch,
    title: "1. Figure out who holds the record",
    body: "Oregon's Public Records Law (ORS 192.311–192.478) covers every state and local agency — city bureaus, the county, school districts, Metro, TriMet. Ask the agency that actually does the work; portland.gov lists a records contact for each city bureau.",
  },
  {
    icon: Send,
    title: "2. Ask in writing, specifically",
    body: "Email works. Describe the records (not the question you're trying to answer), a date range, and ask for machine-readable format (CSV) when it's data. The City of Portland accepts requests through its online portal; other agencies take email.",
  },
  {
    icon: CircleDollarSign,
    title: "3. Know the fee rules",
    body: "Agencies can only charge their actual cost of responding, and they must give you a fee estimate over $25 before doing the work. You can ask for a fee waiver or reduction when disclosure primarily benefits the public — say so explicitly, and explain why.",
  },
  {
    icon: Scale,
    title: "4. Know your deadlines and appeal rights",
    body: "The agency must acknowledge your request within 5 business days, and complete it as soon as practicable without unreasonable delay — 15 business days is the statutory benchmark. If you're denied, you can petition the District Attorney (local agencies) or Attorney General (state agencies) for review. It's free.",
  },
];

export default async function RecordsPage() {
  let requests: RecordsRequest[] = [];
  try {
    requests = (await sql`
      SELECT id, title, agency, description, requested_data, status,
             filed_at, resolved_at, outcome_note, result_url
      FROM records_requests
      ORDER BY created_at ASC
    `) as unknown as RecordsRequest[];
  } catch {
    requests = [];
  }

  return (
    <div className="bg-[var(--color-paper)]">
      <section className="relative overflow-hidden bg-[var(--color-canopy)] noise-overlay">
        <div className="absolute right-0 top-0 h-[420px] w-[520px] translate-x-1/4 -translate-y-1/3 rounded-full bg-[var(--color-canopy-light)] opacity-25 blur-[150px]" />
        <div className="mx-auto max-w-[1400px] px-5 py-14 sm:px-8 sm:py-18 lg:px-12">
          <div className="max-w-3xl">
            <div className="flex items-center gap-3 text-[10px] font-mono uppercase tracking-[0.22em] text-[var(--color-ember)]/85">
              <span>Public records</span>
              <div className="h-px w-8 bg-[var(--color-ember)]/60" />
              <span>ORS 192 — your right to know</span>
            </div>
            <h1 className="mt-6 font-editorial-normal text-[42px] leading-[1.02] tracking-tight text-white sm:text-[56px]">
              The records belong to you
            </h1>
            <p className="mt-5 max-w-2xl text-[16px] leading-relaxed text-white/70 sm:text-[18px]">
              Oregon law gives every person the right to inspect public
              records — no reason required. Here&apos;s how to file a request,
              and a public log of the requests we&apos;re filing to close the
              gaps in Portland&apos;s data.
            </p>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-[1400px] px-5 py-12 sm:px-8 sm:py-16 lg:px-12">
        <h2 className="font-editorial text-[28px] sm:text-[34px] text-[var(--color-ink)] leading-tight">
          How to file a request
        </h2>
        <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-5">
          {guideSteps.map((step) => (
            <div
              key={step.title}
              className="rounded-sm border border-[var(--color-parchment)] bg-[var(--color-paper-warm)] p-6"
            >
              <div className="flex h-11 w-11 items-center justify-center rounded-sm bg-[var(--color-canopy)]/8 text-[var(--color-canopy)]">
                <step.icon className="h-5 w-5" />
              </div>
              <h3 className="mt-5 font-editorial text-[22px] leading-tight text-[var(--color-ink)]">
                {step.title}
              </h3>
              <p className="mt-3 text-[14px] leading-relaxed text-[var(--color-ink-light)]">
                {step.body}
              </p>
            </div>
          ))}
        </div>
        <p className="mt-6 text-[13px] text-[var(--color-ink-muted)]">
          This is practical guidance, not legal advice. The Oregon DOJ
          publishes the authoritative Public Records and Meetings Manual.
        </p>
      </section>

      <section className="border-y border-[var(--color-parchment)] bg-[var(--color-paper-warm)]">
        <div className="mx-auto max-w-[1400px] px-5 py-12 sm:px-8 sm:py-16 lg:px-12">
          <h2 className="font-editorial text-[28px] sm:text-[34px] text-[var(--color-ink)] leading-tight">
            What we&apos;re requesting
          </h2>
          <p className="mt-3 max-w-2xl text-[15px] leading-relaxed text-[var(--color-ink-light)]">
            When a dashboard says &ldquo;data not available,&rdquo; this is
            where we do something about it. Every request we file is tracked
            here, and fulfilled records get published back into the open data
            commons.
          </p>

          <div className="mt-8 space-y-5">
            {requests.length === 0 && (
              <p className="text-[14px] text-[var(--color-ink-muted)]">
                Request log temporarily unavailable.
              </p>
            )}
            {requests.map((req) => (
              <div
                key={req.id}
                className="rounded-sm border border-[var(--color-parchment)] bg-white p-6"
              >
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <h3 className="font-editorial text-[22px] leading-tight text-[var(--color-ink)]">
                      {req.title}
                    </h3>
                    <p className="mt-1 text-[12px] font-mono uppercase tracking-[0.14em] text-[var(--color-ink-muted)]">
                      {req.agency}
                    </p>
                  </div>
                  <span
                    className={`inline-flex items-center rounded-sm border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider ${
                      STATUS_STYLES[req.status] ?? STATUS_STYLES.planned
                    }`}
                  >
                    {req.status}
                  </span>
                </div>
                <p className="mt-4 text-[14px] leading-relaxed text-[var(--color-ink-light)]">
                  {req.description}
                </p>
                {req.requested_data && (
                  <p className="mt-3 text-[13px] leading-relaxed text-[var(--color-ink-muted)]">
                    <strong className="text-[var(--color-ink-light)]">
                      Records sought:
                    </strong>{" "}
                    {req.requested_data}
                  </p>
                )}
                {req.outcome_note && (
                  <p className="mt-3 text-[13px] leading-relaxed text-[var(--color-ink-muted)]">
                    <strong className="text-[var(--color-ink-light)]">Outcome:</strong>{" "}
                    {req.outcome_note}
                  </p>
                )}
                {req.result_url && (
                  <a
                    href={req.result_url}
                    className="mt-3 inline-block text-[13px] font-semibold text-[var(--color-canopy)] hover:underline"
                  >
                    View the released records →
                  </a>
                )}
              </div>
            ))}
          </div>

          <div className="mt-10 rounded-sm border border-[var(--color-parchment)] bg-white p-6 sm:p-8">
            <h3 className="font-editorial text-[24px] text-[var(--color-ink)]">
              Know a record Portland should see?
            </h3>
            <p className="mt-3 max-w-2xl text-[14px] leading-relaxed text-[var(--color-ink-light)]">
              Suggest a records request — or tell us about one you&apos;ve
              filed — and we&apos;ll add it to the public tracker.
            </p>
            <Link
              href="/contact"
              className="mt-5 inline-flex items-center justify-center gap-2 rounded-sm bg-[var(--color-canopy)] px-5 py-3 text-[15px] font-semibold text-white transition-colors hover:bg-[var(--color-canopy-mid)]"
            >
              Suggest a request
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
