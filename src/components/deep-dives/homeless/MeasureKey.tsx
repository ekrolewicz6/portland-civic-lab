import { MEASURES } from "@/lib/homeless/measures";
import { SOURCES } from "@/lib/homeless/data";

/**
 * What each homelessness number on the page measures. Shown once, near the top, so a
 * reader never has to guess whether a figure is a one-night count or a services roster.
 */
export default function MeasureKey({ dark = false }: { dark?: boolean }) {
  const muted = dark ? "text-white/70" : "text-[var(--color-ink-muted)]";
  const link = dark ? "text-white underline decoration-white/40" : "text-[var(--color-river-deep)] underline decoration-[var(--color-river)]/40";
  return (
    <div data-measure-key>
      <h2 className={`font-mono text-[12px] font-semibold uppercase tracking-[0.14em] ${dark ? "text-[var(--color-ember-bright)]" : "text-[var(--color-ember)]"}`}>
        What these numbers measure
      </h2>
      <p className={`mt-2 max-w-3xl text-[15px] leading-relaxed ${muted}`}>
        Multnomah County&apos;s homeless population is measured in different ways that give different answers. A figure from one
        cannot be compared with a figure from another.
      </p>
      <dl className="mt-5 grid gap-x-8 gap-y-6 sm:grid-cols-2">
        {MEASURES.map((m) => (
          <div key={m.id} data-measure={m.id} className={`border-t pt-3 ${dark ? "border-white/15" : "border-[var(--color-parchment)]"}`}>
            <dt className="text-[16px] font-semibold leading-snug">{m.name}</dt>
            <dd className="mt-1">
              <p className="text-[15px] font-medium leading-snug tabular-nums">{m.latest}</p>
              <p className={`mt-1.5 text-[14px] leading-relaxed ${muted}`}>{m.what}</p>
              <p className={`mt-1.5 text-[14px] leading-relaxed ${muted}`}>{m.caveat}</p>
              <p className={`mt-1.5 text-[13px] ${muted}`}>
                Source{m.sources.length > 1 ? "s" : ""}:{" "}
                {m.sources.map((id, i) => {
                  const s = SOURCES[id];
                  return (
                    <span key={id}>
                      {i ? " · " : ""}
                      <a href={s.url} target="_blank" rel="noopener noreferrer" className={`${link} underline-offset-2`}>{s.org}</a>
                    </span>
                  );
                })}
              </p>
            </dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
