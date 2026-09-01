import { GAMING_RULES, SCORECARD } from "@/lib/libraries/data";

/**
 * The 2040 scorecard: twelve domains, each a proposed north star with its
 * proof method, plus the three rules that stop a flagship or an average from
 * hiding an underserved branch.
 */
export default function Scorecard() {
  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {SCORECARD.map((row) => (
          <div key={row.domain} className="rounded-sm border border-[var(--color-parchment)] bg-white p-5">
            <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.14em] text-[var(--color-ember)]">
              {row.domain}
            </p>
            <p className="mt-2 text-[14px] leading-snug text-[var(--color-ink)]">{row.northStar}</p>
            <p className="mt-3 border-t border-[var(--color-parchment)] pt-2.5 text-[12px] leading-relaxed text-[var(--color-ink-muted)]">
              <span className="font-semibold uppercase tracking-[0.08em]">Proof — </span>
              {row.proof}
            </p>
          </div>
        ))}
      </div>

      <div className="rounded-sm border border-[var(--color-parchment)] bg-[var(--color-paper-warm)] p-5 sm:p-7">
        <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.18em] text-[var(--color-ember)]">
          Three rules prevent gaming
        </p>
        <div className="mt-4 grid gap-4 sm:grid-cols-3">
          {GAMING_RULES.map((r, i) => (
            <div key={r.title} className="rounded-sm border border-[var(--color-parchment)] bg-white p-4">
              <span className="font-mono text-[11px] font-semibold text-[var(--color-clay)]">
                {String(i + 1).padStart(2, "0")}
              </span>
              <h3 className="mt-1 font-editorial text-[17px] leading-snug text-[var(--color-ink)]">{r.title}</h3>
              <p className="mt-1.5 text-[12.5px] leading-relaxed text-[var(--color-ink-light)]">{r.body}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
