import { ASSETS, SOURCES } from "@/lib/mass-timber/data";

const STATUS_STYLE: Record<string, { label: string; cls: string }> = {
  built: { label: "Built", cls: "bg-[#dceadf] text-[var(--color-fern)]" },
  delivered: { label: "Delivered", cls: "bg-[#dceadf] text-[var(--color-fern)]" },
  funded: { label: "Funded", cls: "bg-[#dde7ee] text-[var(--color-river-deep)]" },
  leased: { label: "Under lease", cls: "bg-[#f6ecdf] text-[#9a6b34]" },
  planned: { label: "Planned", cls: "bg-[var(--color-parchment)] text-[var(--color-ink-light)]" },
};

export default function OregonAssets() {
  return (
    <div className="relative">
      {/* vertical spine */}
      <div className="absolute left-[7px] top-2 bottom-2 w-px bg-[var(--color-parchment)] sm:left-[calc(80px+7px)]" />
      <div className="space-y-5">
        {ASSETS.map((a) => {
          const src = SOURCES[a.sourceId];
          const st = STATUS_STYLE[a.status];
          return (
            <div key={a.name} className="relative grid sm:grid-cols-[80px_1fr] gap-x-5">
              <div className="hidden sm:block text-right font-mono text-[13px] text-[var(--color-ink-muted)] pt-0.5">
                {a.year}
              </div>
              <div className="relative pl-7">
                <span className="absolute left-0 top-1.5 h-3.5 w-3.5 rounded-full border-2 border-white bg-[var(--color-fern)] shadow-[0_0_0_1px_var(--color-parchment)]" />
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="text-[16px] font-semibold text-[var(--color-canopy)]">{a.name}</h3>
                  <span className={`rounded-sm px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide ${st.cls}`}>
                    {st.label}
                  </span>
                  <span className="sm:hidden font-mono text-[11px] text-[var(--color-ink-muted)]">{a.year}</span>
                </div>
                <p className="mt-1 text-[13px] text-[var(--color-ink-light)] leading-relaxed">{a.what}</p>
                <a
                  href={src.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-1 inline-block text-[12px] text-[var(--color-river-deep)] underline decoration-[var(--color-river)]/40 underline-offset-2 hover:decoration-[var(--color-river)]"
                >
                  {src.org}
                </a>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
