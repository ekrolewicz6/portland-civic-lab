import { STRUCTURAL_FACTORS } from "@/lib/datacenters/dcac-findings";

/**
 * Why the committee process is producing the outcome it is — the structural
 * features of the process itself, drawn from the charge, the roster, and the
 * facilitator summaries.
 */
export default function StructuralFactors() {
  return (
    <div className="grid md:grid-cols-2 gap-4">
      {STRUCTURAL_FACTORS.map((f, i) => (
        <div key={f.title} className="rounded-sm border border-white/12 bg-white/[0.05] p-5 backdrop-blur">
          <div className="flex items-baseline gap-2.5 mb-1.5">
            <span className="font-mono text-[13px] font-bold text-[var(--color-ember-bright)]/70">
              {String(i + 1).padStart(2, "0")}
            </span>
            <h4 className="text-[14.5px] font-semibold text-white leading-snug">{f.title}</h4>
          </div>
          <p className="text-[12.5px] text-white/70 leading-relaxed">{f.detail}</p>
        </div>
      ))}
    </div>
  );
}
