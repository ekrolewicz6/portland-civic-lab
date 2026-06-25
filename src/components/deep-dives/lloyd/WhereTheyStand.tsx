import { Check } from "lucide-react";
import { AGREEMENTS, FAULT_LINES } from "@/lib/lloyd/data";

export default function WhereTheyStand() {
  return (
    <div className="space-y-5">
      {/* Common ground */}
      <div className="rounded-sm border border-[var(--color-fern)]/30 bg-[#f1f7f3] p-6">
        <h3 className="font-editorial-normal text-[19px] text-[var(--color-canopy)]">
          Where they actually agree
        </h3>
        <ul className="mt-3 space-y-2">
          {AGREEMENTS.map((a) => (
            <li
              key={a}
              className="flex items-start gap-2.5 text-[14px] text-[var(--color-ink-light)] leading-snug"
            >
              <Check className="w-4 h-4 text-[var(--color-fern)] mt-0.5 flex-shrink-0" />
              {a}
            </li>
          ))}
        </ul>
      </div>

      {/* Fault lines */}
      <div className="space-y-3">
        <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[var(--color-ink-muted)]">
          Where the real fight is
        </p>
        {FAULT_LINES.map((f) => (
          <div
            key={f.issue}
            className="rounded-sm border border-[var(--color-parchment)] bg-white p-5"
          >
            <h4 className="text-[12px] font-mono uppercase tracking-[0.08em] text-[var(--color-ink-muted)] mb-3">
              {f.issue}
            </h4>
            <div className="grid sm:grid-cols-2 gap-3">
              <div className="rounded-sm bg-[#f4f8f5] border-l-2 border-[var(--color-river)] p-3">
                <p className="text-[10px] font-semibold uppercase tracking-wide text-[var(--color-river-deep)] mb-1">
                  &ldquo;Save Lloyd&rdquo;
                </p>
                <p className="text-[13px] text-[var(--color-ink-light)] leading-snug">{f.save}</p>
              </div>
              <div className="rounded-sm bg-[#fbf4f0] border-l-2 border-[var(--color-clay)] p-3">
                <p className="text-[10px] font-semibold uppercase tracking-wide text-[var(--color-clay)] mb-1">
                  &ldquo;Redevelop&rdquo;
                </p>
                <p className="text-[13px] text-[var(--color-ink-light)] leading-snug">
                  {f.redevelop}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
