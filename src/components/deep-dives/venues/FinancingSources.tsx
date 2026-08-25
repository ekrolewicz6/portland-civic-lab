import { FINANCING_SOURCES } from "@/lib/venues/data";
import type { FinancingSource } from "@/lib/venues/data";

/**
 * §12 — the ten kinds of capital, in order, each with what it is best
 * for, what it risks, and the guardrails that make it safe to use.
 * The General Fund closes the grid full-width, because its entire
 * meaning is positional: it is the final source, never the automatic one.
 */

function Tick({ color }: { color: string }) {
  return (
    <span aria-hidden className="select-none" style={{ color }}>
      ▸
    </span>
  );
}

function TickList({
  label,
  items,
  tickColor,
}: {
  label: string;
  items: string[];
  tickColor: string;
}) {
  return (
    <div>
      <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-[var(--color-ink-muted)]">
        {label}
      </p>
      <ul className="mt-2 space-y-1.5">
        {items.map((item) => (
          <li
            key={item}
            className="flex gap-2 text-[14px] leading-snug text-[var(--color-ink-light)]"
          >
            <Tick color={tickColor} />
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function Guardrails({ items }: { items: string[] }) {
  return (
    <div className="mt-4 border-l-2 border-[var(--color-ember)] pl-3">
      <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-[var(--color-ember)]">
        Guardrails
      </p>
      <ul className="mt-1.5 space-y-1">
        {items.map((item) => (
          <li key={item} className="text-[13px] leading-snug text-[var(--color-ink-light)]">
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}

function SourceCard({ source }: { source: FinancingSource }) {
  const isGeneralFund = source.id === "general";

  return (
    <article
      className={`rounded-sm border p-5 ${
        isGeneralFund
          ? "border-[var(--color-ember)]/50 bg-[var(--color-paper-warm)] lg:col-span-2"
          : "border-[var(--color-parchment)] bg-white"
      }`}
    >
      <div className="flex items-baseline gap-3">
        <span
          className={`shrink-0 rounded-full border border-[var(--color-parchment)] px-2 py-0.5 font-mono text-[11px] font-semibold tabular-nums text-[var(--color-ink-light)] ${
            isGeneralFund ? "bg-white" : "bg-[var(--color-paper-warm)]"
          }`}
        >
          {source.n}
        </span>
        <h3 className="font-editorial text-[20px] leading-tight text-[var(--color-ink)]">
          {source.name}
        </h3>
      </div>

      {isGeneralFund && (
        <p className="mt-3 max-w-2xl text-[13.5px] leading-relaxed text-[var(--color-ink-light)]">
          {
            "Nine sources come before this one. Reaching the General Fund should be a deliberate, publicly defended choice about what the City is buying — never the path of least resistance."
          }
        </p>
      )}

      <div className={`mt-4 ${isGeneralFund ? "grid gap-6 sm:grid-cols-2" : "space-y-4"}`}>
        <TickList label="Best for" items={source.bestFor} tickColor="var(--color-ember)" />
        {source.advantages && (
          <TickList label="Advantages" items={source.advantages} tickColor="var(--color-fern)" />
        )}
        <TickList label="Risks" items={source.risks} tickColor="var(--color-clay)" />
      </div>

      {source.guardrails && <Guardrails items={source.guardrails} />}
    </article>
  );
}

export default function FinancingSources() {
  return (
    <div className="grid gap-4 lg:grid-cols-2">
      {FINANCING_SOURCES.map((source) => (
        <SourceCard key={source.id} source={source} />
      ))}
    </div>
  );
}
