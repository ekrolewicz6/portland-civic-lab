"use client";

import { useState } from "react";
import { GATES } from "@/lib/venues/data";
import {
  SCORE_DIMENSIONS,
  SCORE_PRESETS,
  scoreProject,
  type GateId,
  type DimId,
} from "@/lib/venues/engine";

/**
 * §10: the five-gates / 100-point capital framework, made operable.
 * Gates are pass/fail and not tradeable: until every gate is on, the
 * scoring dimensions are physically unreachable. Presets are illustrative
 * Portland Civic Lab analysis, not scores of live proposals.
 */

const EMPTY_GATES: Record<GateId, boolean> = {
  necessity: false,
  ownership: false,
  portfolio: false,
  lifecycle: false,
  downside: false,
};

const EMPTY_DIMS: Record<DimId, number> = {
  safety: 0,
  ownerReturn: 0,
  demand: 0,
  mission: 0,
  leverage: 0,
  district: 0,
  optionality: 0,
};

interface Tier {
  label: string;
  chip: string;
}

function tierFor(total: number): Tier {
  if (total >= 70)
    return {
      label: "High-priority zone",
      chip: "border-[var(--color-fern)] bg-[var(--color-fern)]/10 text-[var(--color-fern)]",
    };
  if (total >= 45)
    return {
      label: "Conditional",
      chip: "border-[var(--color-clay)] bg-[var(--color-clay)]/10 text-[var(--color-clay)]",
    };
  return {
    label: "Low priority unless redesigned",
    chip: "border-[var(--color-ember)] bg-[var(--color-ember)]/10 text-[var(--color-ember)]",
  };
}

export default function CapitalScore() {
  const [gates, setGates] = useState<Record<GateId, boolean>>({ ...EMPTY_GATES });
  const [dims, setDims] = useState<Record<DimId, number>>({ ...EMPTY_DIMS });
  const [activePreset, setActivePreset] = useState<string | null>(null);

  const result = scoreProject({ gates, dims });
  const tier = tierFor(result.total);
  const preset = activePreset ? SCORE_PRESETS.find((p) => p.id === activePreset) : null;

  function applyPreset(id: string) {
    const p = SCORE_PRESETS.find((s) => s.id === id);
    if (!p) return;
    setGates({ ...p.gates });
    setDims({ ...p.dims });
    setActivePreset(id);
  }

  function toggleGate(id: GateId) {
    setGates((g) => ({ ...g, [id]: !g[id] }));
    setActivePreset(null);
  }

  function setDim(id: DimId, value: number) {
    setDims((d) => ({ ...d, [id]: value }));
    setActivePreset(null);
  }

  return (
    <div className="rounded-sm border border-[var(--color-parchment)] bg-white overflow-hidden">
      {/* ── Presets ── */}
      <div className="border-b border-[var(--color-parchment)] bg-[var(--color-paper-warm)] p-4 sm:p-5">
        <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-[var(--color-ink-muted)]">
          Example presets: our analysis, not scores of live proposals
        </p>
        <div className="mt-2 grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
          {SCORE_PRESETS.map((p) => {
            const selected = activePreset === p.id;
            return (
              <button
                key={p.id}
                type="button"
                onClick={() => applyPreset(p.id)}
                aria-pressed={selected}
                aria-label={`Load preset: ${p.label}`}
                className={`min-h-[44px] rounded-sm border px-3 py-2 text-left text-[12px] font-semibold leading-snug transition-colors ${
                  selected
                    ? "border-[var(--color-canopy)] bg-[var(--color-canopy)] text-white"
                    : "border-[var(--color-parchment)] bg-white text-[var(--color-ink-light)] hover:border-[var(--color-sage)]"
                }`}
              >
                {p.label}
              </button>
            );
          })}
        </div>
        {preset ? (
          <p className="mt-3 text-[13px] leading-relaxed text-[var(--color-ink-light)]">
            {preset.rationale}
          </p>
        ) : null}
      </div>

      {/* ── Gates ── */}
      <div className="p-5 sm:p-7">
        <h3 className="font-editorial text-[19px] leading-snug text-[var(--color-ink)]">
          The five gates: pass/fail, not tradeable
        </h3>
        <div className="mt-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
          {GATES.map((gate) => {
            const gid = gate.id as GateId;
            const on = gates[gid];
            return (
              <button
                key={gate.id}
                type="button"
                onClick={() => toggleGate(gid)}
                aria-pressed={on}
                aria-label={`Gate ${gate.n}: ${gate.title}, ${on ? "passing" : "failing"}`}
                className={`min-h-[44px] rounded-sm border p-3 text-left transition-colors ${
                  on
                    ? "border-[var(--color-fern)] bg-[var(--color-fern)]/10"
                    : "border-[var(--color-parchment)] bg-white hover:border-[var(--color-sage)]"
                }`}
              >
                <span className="flex items-center justify-between gap-2">
                  <span
                    className={`font-mono text-[10px] uppercase tracking-[0.18em] ${
                      on ? "text-[var(--color-fern)]" : "text-[var(--color-ink-muted)]"
                    }`}
                  >
                    Gate {gate.n}
                  </span>
                  {on ? (
                    <span
                      aria-hidden="true"
                      className="rounded-full bg-[var(--color-fern)] px-1.5 py-0.5 font-mono text-[10px] font-bold leading-none text-white"
                    >
                      ✓
                    </span>
                  ) : (
                    <span aria-hidden="true" className="font-mono text-[11px] text-[var(--color-ink-muted)]">
                      ✗
                    </span>
                  )}
                </span>
                <span className="mt-1 block text-[13px] font-semibold text-[var(--color-ink)]">
                  {gate.title}
                </span>
                <span className="mt-0.5 line-clamp-2 block text-[11px] leading-snug text-[var(--color-ink-muted)]">
                  {gate.question}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* ── Dimensions + score: unreachable until every gate passes ── */}
      <div className="relative">
        <div className="border-t border-[var(--color-parchment)] p-5 sm:p-7">
          <h3 className="font-editorial text-[19px] leading-snug text-[var(--color-ink)]">
            The 100-point score: seven weighted dimensions
          </h3>
          <div className="mt-4 grid gap-x-8 gap-y-4 sm:grid-cols-2">
            {SCORE_DIMENSIONS.map((d) => (
              <div key={d.id}>
                <div className="flex items-baseline justify-between gap-3">
                  <label className="text-[13px] text-[var(--color-ink)]">{d.label}</label>
                  <span className="font-mono text-[13px] font-bold tabular-nums text-[var(--color-canopy)] whitespace-nowrap">
                    {dims[d.id]} / {d.weight}
                  </span>
                </div>
                <input
                  type="range"
                  min={0}
                  max={d.weight}
                  step={1}
                  value={dims[d.id]}
                  onChange={(e) => setDim(d.id, Number(e.target.value))}
                  disabled={!result.gatesPassed}
                  className="mt-1.5 w-full accent-[var(--color-canopy)] cursor-pointer disabled:cursor-not-allowed"
                  aria-label={`${d.label}: points out of ${d.weight}`}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Score band */}
        <div className="border-t border-[var(--color-parchment)] p-5 sm:p-7">
          <div className="flex flex-wrap items-center gap-x-5 gap-y-3">
            <p className="font-mono text-[44px] font-bold leading-none tabular-nums text-[var(--color-ink)]">
              {result.total}
              <span className="text-[20px] font-normal text-[var(--color-ink-muted)]"> / 100</span>
            </p>
            <span
              className={`rounded-full border px-3 py-1 text-[11px] font-semibold ${tier.chip}`}
            >
              {tier.label}
            </span>
          </div>
          <p className="mt-2 text-[12px] leading-snug text-[var(--color-ink-muted)]">
            The bands are illustrative: the score forces the same questions of every project; it
            does not make the decision by itself.
          </p>
        </div>

        {/* Gate overlay: dims + score do not exist until the gates pass */}
        {!result.gatesPassed ? (
          <div className="absolute inset-0 z-10 flex items-center justify-center bg-white/85 p-6 backdrop-blur-[2px]">
            <div className="max-w-sm rounded-sm border border-[var(--color-parchment)] bg-white p-5 text-center shadow-sm">
              <p className="text-[15px] font-semibold text-[var(--color-ink)]">
                Stopped at the gates
              </p>
              <p className="mt-2 text-[13px] leading-relaxed text-[var(--color-ink-light)]">
                Gates are pass/fail, not tradeable. A project that fails any gate is redesigned or
                rejected, never scored into approval.
              </p>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}
