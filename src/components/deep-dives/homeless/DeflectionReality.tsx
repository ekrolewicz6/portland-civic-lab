import { AlertTriangle } from "lucide-react";
import { DEFLECTION_REALITY } from "@/lib/homeless/data";

export default function DeflectionReality() {
  return (
    <div className="rounded-sm border border-[var(--color-parchment)] bg-white p-6 sm:p-8">
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
        {DEFLECTION_REALITY.map((row) => (
          <div key={row.label} className="rounded-sm border border-[var(--color-parchment)] bg-[var(--color-paper-warm)] p-4">
            <p className="font-mono text-[30px] font-bold leading-none text-[var(--color-clay)]">
              {row.value}
            </p>
            <p className="mt-2 text-[13px] font-semibold leading-snug text-[var(--color-ink)]">{row.label}</p>
            <p className="mt-1 text-[11px] leading-relaxed text-[var(--color-ink-muted)]">{row.note}</p>
          </div>
        ))}
      </div>

      <div className="mt-5 flex gap-3 rounded-sm border border-[var(--color-clay)]/25 bg-[#fbf4f0] p-4">
        <AlertTriangle className="mt-0.5 h-4 w-4 flex-shrink-0 text-[var(--color-clay)]" />
        <p className="text-[13px] leading-relaxed text-[var(--color-ink-light)]">
          The correction matters: in FY26 Q3, do not say success only meant a food pantry or shelter
          night, and do not say only one person got treatment. The snapshot says one successful
          completion was SUD/recovery-only, seven combined SUD/recovery access with sustained care
          coordination, and one was care-coordination-only. It still does not prove residential
          treatment completion.
        </p>
      </div>
    </div>
  );
}

