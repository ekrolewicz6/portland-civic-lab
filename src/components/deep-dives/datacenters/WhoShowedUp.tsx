import { VOICES, CAMP_LABEL, type Camp } from "@/lib/datacenters/dcac-findings";

const CAMP_STYLE: Record<Camp, { color: string; bg: string }> = {
  industry: { color: "#2d5f7e", bg: "#e6eef3" },
  utility: { color: "#4a7f9e", bg: "#e9f1f5" },
  "local-gov": { color: "#3d7a5a", bg: "#e3efe7" },
  labor: { color: "#7a6a3d", bg: "#f2eede" },
  tribal: { color: "#8a4f6d", bg: "#f4e9ef" },
  advocate: { color: "#b85c3a", bg: "#f6e7df" },
  agency: { color: "#44403c", bg: "#eeecea" },
  academic: { color: "#c8956c", bg: "#f6ecd9" },
};

const ORDER: Camp[] = [
  "agency",
  "academic",
  "local-gov",
  "utility",
  "industry",
  "advocate",
  "tribal",
  "labor",
];

/**
 * Every camp that presented to the committee, with the hardest number each
 * put on the record. Grouped so the coalition structure is visible.
 */
export default function WhoShowedUp() {
  return (
    <div className="space-y-6">
      {ORDER.map((camp) => {
        const voices = VOICES.filter((v) => v.camp === camp);
        if (!voices.length) return null;
        const s = CAMP_STYLE[camp];
        return (
          <div key={camp}>
            <div className="flex items-center gap-2.5 mb-2.5">
              <span
                className="rounded-sm px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.1em]"
                style={{ color: s.color, backgroundColor: s.bg }}
              >
                {CAMP_LABEL[camp]}
              </span>
              <span className="h-px flex-1" style={{ backgroundColor: `${s.color}25` }} />
            </div>
            <div className="grid md:grid-cols-2 gap-3">
              {voices.map((v) => (
                <div
                  key={v.who}
                  className="rounded-sm border border-[var(--color-parchment)] bg-white p-4"
                  style={{ borderLeftWidth: 3, borderLeftColor: s.color }}
                >
                  <h4 className="text-[14px] font-semibold text-[var(--color-ink)] leading-snug">
                    {v.who}
                  </h4>
                  <p className="text-[11px] font-mono uppercase tracking-wide text-[var(--color-ink-muted)] mt-0.5">
                    {v.org}
                  </p>
                  <p className="text-[13px] text-[var(--color-canopy)] font-medium leading-snug mt-2">
                    {v.position}
                  </p>
                  <p className="text-[12.5px] text-[var(--color-ink-light)] leading-relaxed mt-1.5">
                    {v.evidence}
                  </p>
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
