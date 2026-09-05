import { HEADLINE_METRICS } from "@/lib/homeless/continuum";

/** The nine numbers the whole system is judged on, published together or not at all. */
export default function HeadlineMetrics() {
  return (
    <ol className="grid gap-[1px] rounded-sm border border-[var(--color-parchment)] bg-[var(--color-parchment)] md:grid-cols-3">
      {HEADLINE_METRICS.map((m, i) => (
        <li key={m.name} className="bg-white px-4 py-4">
          <p className="flex items-baseline gap-2">
            <span className="font-mono text-[13px] font-bold text-[var(--color-ember)]">{String(i + 1).padStart(2, "0")}</span>
            <span className="text-[14.5px] font-semibold leading-tight text-[var(--color-ink)]">{m.name}</span>
          </p>
          <p className="mt-1.5 text-[12.5px] leading-snug text-[var(--color-ink-light)]">{m.def}</p>
        </li>
      ))}
    </ol>
  );
}
