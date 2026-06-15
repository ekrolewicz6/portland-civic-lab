import { Skull } from "lucide-react";
import { GRAVEYARD, SOURCES } from "@/lib/mass-timber/data";

export default function Graveyard() {
  return (
    <div className="space-y-4">
      {GRAVEYARD.map((g) => {
        const src = SOURCES[g.sourceId];
        return (
          <div
            key={g.name}
            className="rounded-sm border border-[var(--color-parchment)] bg-white p-6 sm:p-7"
          >
            <div className="grid sm:grid-cols-[auto_1fr] gap-x-5 gap-y-3">
              <div className="flex sm:flex-col items-center sm:items-start gap-3 sm:gap-1">
                <Skull className="w-6 h-6 text-[var(--color-clay)]" strokeWidth={1.5} />
                <span className="font-mono text-[13px] text-[var(--color-ink-muted)]">{g.year}</span>
              </div>
              <div>
                <h3 className="font-editorial-normal text-[22px] text-[var(--color-ink)] leading-tight">
                  {g.name}
                  <span className="ml-2 text-[13px] font-mono uppercase tracking-wide text-[var(--color-ink-muted)]">
                    {g.where}
                    {g.raised ? ` · raised ${g.raised}` : ""}
                  </span>
                </h3>
                <p className="mt-2 text-[14px] text-[var(--color-ink-light)] leading-relaxed">
                  {g.whatHappened}
                </p>
                <div className="mt-3 border-l-2 border-[var(--color-clay)]/40 pl-3">
                  <p className="text-[13px] text-[var(--color-ink)] leading-relaxed">
                    <span className="font-semibold text-[var(--color-clay)]">The lesson: </span>
                    {g.lesson}
                  </p>
                </div>
                <a
                  href={src.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-3 inline-block text-[12px] text-[var(--color-river-deep)] underline decoration-[var(--color-river)]/40 underline-offset-2 hover:decoration-[var(--color-river)]"
                >
                  {src.org}
                </a>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
