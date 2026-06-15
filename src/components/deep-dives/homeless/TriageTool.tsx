"use client";

import { useState } from "react";
import { Check, X, ArrowRight } from "lucide-react";
import { TRIAGE } from "@/lib/homeless/data";

export default function TriageTool() {
  const [active, setActive] = useState(TRIAGE[0].id);
  const group = TRIAGE.find((g) => g.id === active)!;

  return (
    <div className="rounded-sm border border-[var(--color-parchment)] bg-white overflow-hidden">
      {/* Selector */}
      <div className="grid sm:grid-cols-3 border-b border-[var(--color-parchment)]">
        {TRIAGE.map((g) => {
          const on = g.id === active;
          return (
            <button
              key={g.id}
              onClick={() => setActive(g.id)}
              className={`p-4 text-left border-b sm:border-b-0 sm:border-r last:border-r-0 border-[var(--color-parchment)] transition-colors ${
                on ? "bg-[var(--color-paper-warm)]" : "bg-white hover:bg-[var(--color-paper-warm)]/50"
              }`}
            >
              <span
                className="block h-1 w-8 rounded-full mb-2"
                style={{ backgroundColor: on ? group.color : "var(--color-parchment)" }}
              />
              <span className={`block text-[15px] font-semibold ${on ? "text-[var(--color-canopy)]" : "text-[var(--color-ink-light)]"}`}>
                {g.label}
              </span>
              <span className="block text-[12px] text-[var(--color-ink-muted)] mt-0.5">{g.share}</span>
            </button>
          );
        })}
      </div>

      {/* Detail */}
      <div className="p-6 sm:p-8">
        <p className="text-[15px] text-[var(--color-ink-light)] leading-relaxed">{group.who}</p>

        <div className="mt-6 grid md:grid-cols-2 gap-5">
          <div className="rounded-sm border border-[var(--color-parchment)] bg-[var(--color-paper-warm)] p-5">
            <div className="flex items-center gap-2 mb-1.5">
              <Check className="w-4 h-4 text-[var(--color-fern)]" />
              <h4 className="text-[13px] font-semibold uppercase tracking-[0.08em] text-[var(--color-fern)]">
                The right fix
              </h4>
            </div>
            <p className="text-[14px] text-[var(--color-ink)] leading-relaxed">{group.rightFix}</p>
            <p className="text-[13px] text-[var(--color-ink-muted)] mt-2 font-mono">{group.cost}</p>
          </div>
          <div className="rounded-sm border border-[var(--color-clay)]/25 bg-[#fbf4f0] p-5">
            <div className="flex items-center gap-2 mb-1.5">
              <X className="w-4 h-4 text-[var(--color-clay)]" />
              <h4 className="text-[13px] font-semibold uppercase tracking-[0.08em] text-[var(--color-clay)]">
                The expensive mistake
              </h4>
            </div>
            <p className="text-[14px] text-[var(--color-ink)] leading-relaxed">{group.mismatch}</p>
          </div>
        </div>

        <p className="mt-5 flex items-start gap-2 text-[13px] text-[var(--color-ink-muted)] leading-relaxed">
          <ArrowRight className="w-4 h-4 mt-0.5 flex-shrink-0 text-[var(--color-ember)]" />
          The twin errors — putting the economic group in expensive supportive housing, or the chronic
          group in bare rapid-rehousing — waste money and cycle people back. Matching the intervention
          to the person is most of the game.
        </p>
      </div>
    </div>
  );
}
