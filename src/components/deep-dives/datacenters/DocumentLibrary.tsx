import { FileText, Video } from "lucide-react";
import { DCAC_FOUNDATIONAL, DCAC_SESSIONS } from "@/lib/datacenters/dcac-docs";

/**
 * Selected documents and recordings from the committee, session by session —
 * the primary record behind this deep-dive.
 */
export default function DocumentLibrary() {
  return (
    <div className="space-y-4">
      <p className="text-sm leading-relaxed">We assembled this reading list in August 2026 and added the committee’s September report. For newer material or updated links, use the <a className="underline" href="https://www.oregon.gov/energy/get-involved/pages/oregon-data-center-advisory-committee.aspx">official committee index</a>.</p>
      <div className="rounded-sm border border-[var(--color-parchment)] bg-white p-5">
        <h4 className="text-[13px] font-semibold text-[var(--color-ink)] mb-2.5">
          Committee documents
        </h4>
        <ul className="grid sm:grid-cols-2 gap-x-6 gap-y-1.5">
          {DCAC_FOUNDATIONAL.map((d) => (
            <DocLink key={d.url} title={d.title} org={d.org} url={d.url} />
          ))}
        </ul>
      </div>

      {DCAC_SESSIONS.map((s) => (
        <div key={s.id} className="rounded-sm border border-[var(--color-parchment)] bg-white p-5">
          <div className="flex flex-wrap items-baseline justify-between gap-2 mb-2.5">
            <h4 className="text-[13px] font-semibold text-[var(--color-ink)]">
              <span className="font-mono text-[11px] uppercase tracking-wide text-[var(--color-ember)] mr-2">
                {s.date}
              </span>
              {s.topic}
            </h4>
            {s.recording && (
              <a
                href={s.recording}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-[11px] font-mono uppercase tracking-wide text-[var(--color-river-deep)] hover:underline"
              >
                <Video className="w-3.5 h-3.5" />
                Recording
              </a>
            )}
          </div>
          {s.docs.length > 0 ? (
            <ul className="grid sm:grid-cols-2 2xl:grid-cols-3 gap-x-6 gap-y-1.5">
              {s.docs.map((d) => (
                <DocLink key={d.url} title={d.title} org={d.org} url={d.url} />
              ))}
            </ul>
          ) : (
            <p className="text-[12px] text-[var(--color-ink-muted)]">
              A recording is available; no slides were posted.
            </p>
          )}
        </div>
      ))}
    </div>
  );
}

const ORGANIZATIONS: Record<string, string> = {
  ODOE: "Oregon Department of Energy",
  DCAC: "Data Center Advisory Committee",
  "Oregon DEQ": "Oregon Department of Environmental Quality",
  "Oregon PUC": "Oregon Public Utility Commission",
  CRITFC: "Columbia River Inter-Tribal Fish Commission",
  DLCD: "Oregon Department of Land Conservation and Development",
  "Northern Wasco County PUD": "Northern Wasco County People’s Utility District",
  CTUIR: "Confederated Tribes of the Umatilla Indian Reservation",
};
function DocLink({ title, org, url }: { title: string; org: string; url: string }) {
  return (
    <li>
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className="group flex items-start gap-2 py-0.5"
      >
        <FileText className="mt-0.5 w-3.5 h-3.5 flex-shrink-0 text-[var(--color-ink-muted)] group-hover:text-[var(--color-ember)]" />
        <span>
          <span className="block text-[12.5px] text-[var(--color-ink)] group-hover:text-[var(--color-canopy)] leading-snug">
            {title}
          </span>
          <span className="block text-[11px] text-[var(--color-ink-muted)]">{ORGANIZATIONS[org] ?? org}</span>
        </span>
      </a>
    </li>
  );
}
