"use client";

import { useState } from "react";
import { Check, X } from "lucide-react";
import {
  projectFit,
  type Stories,
  type Repetition,
  type Labor,
} from "@/lib/mass-timber/engine";

const VERDICT_COLOR: Record<string, string> = {
  ideal: "var(--color-fern)",
  strong: "var(--color-fern)",
  fair: "var(--color-ember)",
  poor: "var(--color-clay)",
};

function Toggle<T extends string>({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: T;
  options: { id: T; label: string }[];
  onChange: (v: T) => void;
}) {
  return (
    <div>
      <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-[var(--color-ink-light)] mb-2">
        {label}
      </p>
      <div className="inline-flex flex-wrap gap-1.5">
        {options.map((o) => (
          <button
            key={o.id}
            onClick={() => onChange(o.id)}
            className={`rounded-sm border px-3 py-2 text-[13px] font-medium transition-colors ${
              value === o.id
                ? "border-[var(--color-canopy)] bg-[var(--color-canopy)] text-white"
                : "border-[var(--color-parchment)] bg-white text-[var(--color-ink-light)] hover:border-[var(--color-sage)]"
            }`}
          >
            {o.label}
          </button>
        ))}
      </div>
    </div>
  );
}

export default function ProjectFitTool() {
  const [stories, setStories] = useState<Stories>("mid");
  const [repetition, setRepetition] = useState<Repetition>("repetitive");
  const [labor, setLabor] = useState<Labor>("high");

  const fit = projectFit({ stories, repetition, labor });
  const color = VERDICT_COLOR[fit.verdict];

  return (
    <div className="rounded-sm border border-[var(--color-parchment)] bg-white overflow-hidden grid lg:grid-cols-2">
      {/* Controls */}
      <div className="p-6 sm:p-8 border-b lg:border-b-0 lg:border-r border-[var(--color-parchment)] space-y-6">
        <Toggle<Stories>
          label="How tall is the building?"
          value={stories}
          onChange={setStories}
          options={[
            { id: "low", label: "Low-rise (1–3)" },
            { id: "mid", label: "Mid-rise (4–12)" },
            { id: "tall", label: "Tall (13–18)" },
          ]}
        />
        <Toggle<Repetition>
          label="How repetitive is the design?"
          value={repetition}
          onChange={setRepetition}
          options={[
            { id: "repetitive", label: "Regular & repeatable" },
            { id: "oneoff", label: "One-off & custom" },
          ]}
        />
        <Toggle<Labor>
          label="What's the local labor market?"
          value={labor}
          onChange={setLabor}
          options={[
            { id: "high", label: "High-cost labor" },
            { id: "low", label: "Low-cost labor" },
          ]}
        />
      </div>

      {/* Verdict */}
      <div className="p-6 sm:p-8 bg-[var(--color-paper-warm)] flex flex-col">
        <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[var(--color-ink-muted)]">
          Verdict
        </p>
        <h3
          className="mt-1 font-editorial-normal text-[24px] sm:text-[26px] leading-tight"
          style={{ color }}
        >
          {fit.headline}
        </h3>

        {/* Score meter */}
        <div className="mt-4">
          <div className="h-2.5 w-full rounded-full bg-[var(--color-parchment)] overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-500"
              style={{ width: `${fit.score}%`, backgroundColor: color }}
            />
          </div>
          <div className="flex justify-between text-[10px] font-mono uppercase tracking-wide text-[var(--color-ink-muted)] mt-1">
            <span>light-frame wins</span>
            <span>mass timber wins</span>
          </div>
        </div>

        <div className="mt-5 space-y-2.5">
          {fit.reasons.map((r, i) => (
            <div key={i} className="flex items-start gap-2.5">
              {r.good ? (
                <Check className="w-4 h-4 text-[var(--color-fern)] mt-0.5 flex-shrink-0" />
              ) : (
                <X className="w-4 h-4 text-[var(--color-clay)] mt-0.5 flex-shrink-0" />
              )}
              <span className="text-[13px] text-[var(--color-ink-light)] leading-snug">{r.text}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
