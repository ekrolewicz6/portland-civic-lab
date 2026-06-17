import { SHELTER_CONTINUUM } from "@/lib/homeless/data";

export default function ShelterContinuum() {
  return (
    <div className="rounded-sm border border-[var(--color-parchment)] bg-white overflow-hidden">
      <div className="grid border-b border-[var(--color-parchment)] bg-[var(--color-canopy)] px-5 py-3 text-[11px] font-mono uppercase tracking-[0.12em] text-white/75 md:grid-cols-[1.1fr_1.3fr_1.6fr]">
        <span>Model</span>
        <span className="hidden md:block">Job</span>
        <span className="hidden md:block">Gap to fix</span>
      </div>
      {SHELTER_CONTINUUM.map((row) => (
        <div
          key={row.model}
          className="grid gap-2 border-b border-[var(--color-parchment)] px-5 py-4 last:border-b-0 md:grid-cols-[1.1fr_1.3fr_1.6fr] md:gap-5"
        >
          <h3 className="text-[14px] font-semibold text-[var(--color-canopy)]">{row.model}</h3>
          <p className="text-[13px] leading-relaxed text-[var(--color-ink-light)]">{row.job}</p>
          <p className="text-[13px] leading-relaxed text-[var(--color-ink-muted)]">{row.gap}</p>
        </div>
      ))}
    </div>
  );
}

