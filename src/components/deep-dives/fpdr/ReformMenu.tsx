import { Check, X } from "lucide-react";
import { REFORM_OPTIONS, type ReformOption } from "@/lib/fpdr/data";

function nearTermBadge(v: ReformOption["nearTerm"]) {
  switch (v) {
    case "same":
      return { label: "No change now", cls: "bg-[var(--color-parchment)] text-[var(--color-ink-light)]" };
    case "higher":
      return { label: "Costs more now", cls: "bg-[#f6e7df] text-[var(--color-clay)]" };
    case "much-higher":
      return { label: "Costs a lot more now", cls: "bg-[#f0d9cf] text-[var(--color-clay)]" };
    default:
      return { label: "Costs less now", cls: "bg-[#e3efe7] text-[var(--color-fern)]" };
  }
}

function lifetimeBadge(v: ReformOption["lifetime"]) {
  switch (v) {
    case "lower":
      return { label: "Cheaper overall", cls: "bg-[#e3efe7] text-[var(--color-fern)]" };
    case "much-lower":
      return { label: "Much cheaper overall", cls: "bg-[#d3e7da] text-[var(--color-fern)]" };
    default:
      return { label: "Same total cost", cls: "bg-[var(--color-parchment)] text-[var(--color-ink-light)]" };
  }
}

export default function ReformMenu() {
  return (
    <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-5">
      {REFORM_OPTIONS.map((opt) => {
        const nt = nearTermBadge(opt.nearTerm);
        const lt = lifetimeBadge(opt.lifetime);
        return (
          <div
            key={opt.id}
            className="flex flex-col rounded-sm border border-[var(--color-parchment)] bg-white p-6"
          >
            <h3 className="font-editorial-normal text-[22px] text-[var(--color-canopy)] leading-tight">
              {opt.name}
            </h3>
            <p className="text-[13px] text-[var(--color-ink-muted)] mt-1 italic">{opt.oneLiner}</p>

            <div className="flex flex-wrap gap-2 mt-3">
              <span className={`rounded-sm px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.06em] ${nt.cls}`}>
                {nt.label}
              </span>
              <span className={`rounded-sm px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.06em] ${lt.cls}`}>
                {lt.label}
              </span>
            </div>

            <p className="text-[13px] text-[var(--color-ink-light)] leading-relaxed mt-4">{opt.how}</p>

            <div className="mt-4 pt-4 border-t border-[var(--color-parchment)] space-y-2 flex-1">
              {opt.pros.map((p) => (
                <div key={p} className="flex items-start gap-2">
                  <Check className="w-3.5 h-3.5 text-[var(--color-fern)] mt-0.5 flex-shrink-0" />
                  <span className="text-[12px] text-[var(--color-ink-light)] leading-snug">{p}</span>
                </div>
              ))}
              {opt.cons.map((c) => (
                <div key={c} className="flex items-start gap-2">
                  <X className="w-3.5 h-3.5 text-[var(--color-clay)] mt-0.5 flex-shrink-0" />
                  <span className="text-[12px] text-[var(--color-ink-light)] leading-snug">{c}</span>
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
