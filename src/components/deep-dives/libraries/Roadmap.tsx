import { ROADMAP } from "@/lib/libraries/data";

/** Four stages, 2026 to 2040, each a card of concrete moves. */
export default function Roadmap() {
  return (
    <div className="grid gap-5 lg:grid-cols-2">
      {ROADMAP.map((stage, i) => (
        <article key={stage.range} className="overflow-hidden rounded-sm border border-[var(--color-parchment)] bg-white">
          <div className="border-b border-[var(--color-parchment)] bg-[var(--color-paper-warm)] px-5 py-4">
            <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.18em] text-[var(--color-ember)]">
              Stage {i + 1} · {stage.range}
            </p>
            <h3 className="mt-1 font-editorial text-[21px] leading-tight text-[var(--color-ink)]">
              {stage.title}
            </h3>
          </div>
          <ul className="space-y-2.5 p-5 sm:p-6">
            {stage.items.map((item) => (
              <li key={item} className="flex gap-2.5 text-[13.5px] leading-relaxed text-[var(--color-ink-light)]">
                <span className="mt-[7px] h-1 w-1 shrink-0 rounded-full bg-[var(--color-clay)]" />
                {item}
              </li>
            ))}
          </ul>
        </article>
      ))}
    </div>
  );
}
