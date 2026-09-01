import { BOUNDARIES, LAYERS, PROTECTED_PURPOSES } from "@/lib/libraries/data";

/**
 * The Portland Public Knowledge Commons: three layers, five protected
 * purposes, and the boundaries that keep the mission from drifting. Three
 * stacked treatments on a dark section, matching the doctrine-card register
 * used elsewhere for "the model, stated plainly."
 */
export default function FutureModel() {
  return (
    <div className="space-y-10">
      <div>
        <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.18em] text-[var(--color-ember-bright)]">
          Three layers, one commons
        </p>
        <div className="mt-4 space-y-4">
          {LAYERS.map((l) => (
            <div key={l.n} className="rounded-sm border border-white/15 bg-white/[0.04] p-5 sm:p-6">
              <div className="flex items-baseline gap-3">
                <span className="font-mono text-[13px] font-semibold text-[var(--color-ember-bright)]">
                  Layer {l.n}
                </span>
                <h3 className="font-editorial text-[20px] leading-snug text-white sm:text-[22px]">
                  {l.title}
                </h3>
              </div>
              <p className="mt-2 max-w-3xl text-[14px] leading-relaxed text-white/75">{l.body}</p>
            </div>
          ))}
        </div>
      </div>

      <div>
        <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.18em] text-[var(--color-ember-bright)]">
          Five protected purposes
        </p>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          {PROTECTED_PURPOSES.map((p) => (
            <div key={p.n} className="rounded-sm border border-white/15 bg-white/[0.04] p-5">
              <span className="font-mono text-[24px] font-bold tabular-nums text-[var(--color-ember-bright)]">
                {String(p.n).padStart(2, "0")}
              </span>
              <h3 className="mt-1 font-editorial text-[19px] leading-snug text-white">{p.title}</h3>
              <p className="mt-2 text-[13.5px] leading-relaxed text-white/70">{p.body}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-sm border border-[var(--color-clay)]/50 bg-[var(--color-clay)]/15 p-5 sm:p-7">
        <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.18em] text-[var(--color-ember)]">
          What the library should not become
        </p>
        <p className="mt-2 max-w-3xl text-[13.5px] leading-relaxed text-white/85">
          Boundaries that protect the mission — and make partnership more, not less, important:
        </p>
        <ul className="mt-4 grid gap-2 sm:grid-cols-2">
          {BOUNDARIES.map((b) => (
            <li key={b} className="flex gap-2.5 text-[13.5px] leading-snug text-white/80">
              <span className="mt-[7px] h-1 w-1 shrink-0 rounded-full bg-[var(--color-ember-bright)]" />
              {b}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
