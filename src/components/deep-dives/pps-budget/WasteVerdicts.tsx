import { WASTE_VERDICTS } from "@/lib/pps-budget/data";

/**
 * The waste examination, W1 to W5: the Act IV opener (document.md section 10).
 * Opens with the waste standard and the no-total rule in a bordered band, then
 * renders the five examined claims as verdict cards. W4, information waste,
 * closes the grid full-width because it is the largest shown verdict and the
 * one every other problem on the page got more expensive through.
 */

type WasteVerdict = (typeof WASTE_VERDICTS)[number];

const LEDGER_LABELS: Record<WasteVerdict["ledger"], string> = {
  locked: "Locked ledger",
  movable: "Movable ledger",
  committed: "Committed ledger",
};

/** Verdict chip colors: clay for shown, ember for cost of delay,
 *  sage for a defensible choice, canopy for unexplained overhead. */
const VERDICT_STYLES: Record<WasteVerdict["id"], { bg: string; fg: string }> = {
  W1: { bg: "var(--color-clay)", fg: "#ffffff" },
  W2: { bg: "var(--color-ember)", fg: "var(--color-canopy-deep)" },
  W3: { bg: "var(--color-canopy)", fg: "var(--color-paper)" },
  W4: { bg: "var(--color-clay)", fg: "#ffffff" },
  W5: { bg: "var(--color-sage)", fg: "var(--color-canopy-deep)" },
};

function Eyebrow({ children, className = "" }: { children: string; className?: string }) {
  return (
    <p
      className={`font-mono text-[10px] font-semibold uppercase tracking-[0.18em] text-[var(--color-ink-muted)] ${className}`}
    >
      {children}
    </p>
  );
}

function StandardBand() {
  return (
    <div>
      <div className="rounded-sm border border-[var(--color-canopy)]/40 bg-[var(--color-paper-warm)] p-5 sm:p-6">
        <Eyebrow>The standard</Eyebrow>
        <p className="mt-3 max-w-3xl font-editorial text-[18px] leading-relaxed text-[var(--color-ink)] sm:text-[20px]">
          {
            "A dollar is wasted only when the district controlled it, a better use in the same ledger was predictable, and the district had, or refused to gather, the information to know at the time."
          }
        </p>
        <p className="mt-4 max-w-3xl border-t border-[var(--color-parchment)] pt-4 text-[13.5px] leading-relaxed text-[var(--color-ink-light)]">
          {
            "This page never sums a waste headline. Anyone who gives you one number for PPS waste is doing false precision on purpose."
          }
        </p>
      </div>

      {/* What the examination found, in one breath */}
      <p className="mt-4 max-w-3xl text-[14.5px] leading-relaxed text-[var(--color-ink)]">
        <strong>What it finds:</strong> hundreds of millions in controllable bond overruns on the
        locked ledger, years of paying full costs on emptying buildings, central overhead nobody
        can benchmark because the numbers were never published, and an institution that steers
        late. <strong>What it does not find:</strong> a hidden pot. There is none big enough to
        matter.
      </p>
    </div>
  );
}

function VerdictCard({ v }: { v: WasteVerdict }) {
  const isLargest = v.id === "W4";
  const chip = VERDICT_STYLES[v.id];

  return (
    <article
      className={`rounded-sm border p-5 ${
        isLargest
          ? "border-[var(--color-clay)]/50 bg-[var(--color-paper-warm)] md:col-span-2"
          : "border-[var(--color-parchment)] bg-white"
      }`}
    >
      <div className="flex flex-wrap items-baseline gap-x-3 gap-y-2">
        <span
          className={`shrink-0 rounded-full border border-[var(--color-parchment)] px-2 py-0.5 font-mono text-[11px] font-semibold tabular-nums text-[var(--color-ink-light)] ${
            isLargest ? "bg-white" : "bg-[var(--color-paper-warm)]"
          }`}
        >
          {v.id}
        </span>
        <h3 className="font-editorial text-[20px] leading-tight text-[var(--color-ink)]">
          {v.title}
        </h3>
        <span className="rounded-full border border-[var(--color-parchment)] px-2 py-0.5 font-mono text-[10px] uppercase tracking-[0.12em] text-[var(--color-ink-muted)]">
          {LEDGER_LABELS[v.ledger]}
        </span>
      </div>

      <p className="mt-3">
        <span
          className="inline-block rounded-sm px-2 py-1 font-mono text-[10px] font-semibold uppercase tracking-[0.14em]"
          style={{ backgroundColor: chip.bg, color: chip.fg }}
        >
          {v.verdict}
        </span>
      </p>

      <div className={`mt-4 ${isLargest ? "grid gap-6 sm:grid-cols-2" : "space-y-4"}`}>
        <div>
          <Eyebrow>The evidence</Eyebrow>
          <p className="mt-2 text-[14px] leading-relaxed text-[var(--color-ink-light)]">
            {v.evidence}
          </p>
        </div>
        <p className="text-[14px] leading-relaxed text-[var(--color-ink-light)]">
          <span className="font-semibold text-[var(--color-ink)]">
            {"The strongest defense: "}
          </span>
          {v.defense}
        </p>
      </div>

      <p className="mt-4 border-t border-[var(--color-parchment)] pt-3 text-[14px] font-semibold leading-relaxed text-[var(--color-ink)]">
        {v.bottomLine}
      </p>
    </article>
  );
}

export default function WasteVerdicts() {
  // W4 closes the grid full-width; the id chips keep the W-numbering legible.
  const ordered = [...WASTE_VERDICTS].sort((a, b) =>
    a.id === "W4" ? 1 : b.id === "W4" ? -1 : 0
  );

  return (
    <div className="space-y-4">
      <StandardBand />

      <div className="grid gap-4 md:grid-cols-2">
        {ordered.map((v) => (
          <VerdictCard key={v.id} v={v} />
        ))}
      </div>

      <p className="font-mono text-[10px] leading-relaxed text-[var(--color-ink-muted)]">
        Sources: PPS bond performance audits, Oregon Secretary of State 2019 performance
        audit, Tax Supervising and Conservation Commission annual reviews, PPS adopted
        budget documents.
      </p>
    </div>
  );
}
