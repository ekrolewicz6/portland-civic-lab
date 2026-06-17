import { Eye, EyeOff } from "lucide-react";
import { BED_LAYERS } from "@/lib/homeless/data";

export default function BedReality() {
  return (
    <div className="rounded-sm border border-[var(--color-parchment)] bg-white p-6 sm:p-8">
      <p className="text-[14px] text-[var(--color-ink-light)] leading-relaxed mb-6 max-w-2xl">
        To send someone to a treatment or shelter bed tonight, you need to know it&apos;s open tonight.
        But the public data mostly tracks reports, dashboards, licensed capacity, or program lists.
        The three rungs that matter to a worker in the field — is it <em>staffed</em>, is it{" "}
        <em>occupied</em>, is it <em>open right now</em> for this person — still go{" "}
        <strong>unreported.</strong>
      </p>

      <div className="space-y-2">
        {BED_LAYERS.map((layer, i) => (
          <div
            key={layer.key}
            className={`flex items-center gap-4 rounded-sm border p-3.5 ${
              layer.tracked
                ? "border-[var(--color-parchment)] bg-[var(--color-paper-warm)]"
                : "border-dashed border-[var(--color-clay)]/30 bg-[#fdf8f5]"
            }`}
            style={{ marginLeft: `${i * 14}px` }}
          >
            <span
              className={`flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full ${
                layer.tracked ? "bg-[var(--color-fern)]/15 text-[var(--color-fern)]" : "bg-[var(--color-clay)]/10 text-[var(--color-clay)]"
              }`}
            >
              {layer.tracked ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
            </span>
            <div className="flex-1 min-w-0">
              <span className="text-[14px] font-semibold text-[var(--color-ink)]">{layer.label}</span>
              <span className="text-[13px] text-[var(--color-ink-muted)]"> — {layer.desc}</span>
            </div>
            <span
              className={`flex-shrink-0 rounded-sm px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide ${
                layer.tracked ? "bg-[#dceadf] text-[var(--color-fern)]" : "bg-[#f0d9cf] text-[var(--color-clay)]"
              }`}
            >
              {layer.tracked ? "Tracked" : "Not reported"}
            </span>
          </div>
        ))}
      </div>

      <p className="text-[13px] text-[var(--color-ink-muted)] leading-relaxed mt-6">
        City shelter dashboards are useful for participation, utilization, and outcomes, but they
        are not the same as a universal live placement feed. So a worker in the willingness moment
        still makes phone calls on stale information and can lose the person — <strong>even when a
        suitable bed sits empty.</strong> The cheapest new bed is the empty one you already own but
        can&apos;t see.
      </p>
    </div>
  );
}
