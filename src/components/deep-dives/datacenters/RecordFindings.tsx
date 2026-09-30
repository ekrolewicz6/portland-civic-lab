import { SOURCES } from "@/lib/datacenters/data";
import { RECORD_FINDINGS } from "@/lib/datacenters/dcac-findings";

/** What the committee's own record establishes, with attribution to the deck. */
export default function RecordFindings() {
  return (
    <div className="space-y-3">
      {RECORD_FINDINGS.map((f, i) => (
        <div key={f.claim} className="rounded-sm border border-[var(--color-parchment)] bg-white p-5">
          <div className="flex items-baseline gap-3">
            <span className="font-mono text-base font-bold text-[#795423] flex-shrink-0">
              {String(i + 1).padStart(2, "0")}
            </span>
            <div>
              <h4 className="text-base font-semibold text-[var(--color-canopy)] leading-snug">
                {f.claim}
              </h4>
              <p className="text-base text-[var(--color-ink-light)] leading-relaxed mt-1">
                {f.detail}
              </p>
              <p className="text-[.9375rem] font-mono uppercase tracking-wide text-[var(--color-ink-muted)] mt-2">
                <a href={SOURCES[f.sourceId].url} className="underline">{f.attribution}</a>
              </p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
