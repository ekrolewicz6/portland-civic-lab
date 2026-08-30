import { HEADLINE } from "@/lib/pps-budget/data";

/**
 * The whole story in one screen, directly under the hero. A reader who stops
 * here has the full thesis: (a) the $2.77B decomposed by what can actually
 * move, "the one-page budget the district has never published"; (b) the three
 * findings, each with its one number, deep-linking to their acts; (c) the
 * annual question. Every act below pays off one element of this exhibit.
 *
 * Segment math ($K, FY2026-27 adopted): locked = capital 1,382,508 + debt
 * service 278,876 [budget-fy2026-27-vol1 p173, p157]; grants = special revenue
 * 223,936 [p122]; committed = GF salaries+benefits 680,500 [p107] + internal
 * service 21,159 [p205]; movable = GF remainder 181,612.
 */

const TOTAL_K = 2_768_591;

const SEGMENTS = [
  {
    label: "Locked",
    valueK: 1_661_384,
    display: "$1.66B",
    detail: "Bond construction and debt. Spending it on teachers would be illegal.",
    color: "var(--color-canopy)",
  },
  {
    label: "Restricted grants",
    valueK: 223_936,
    display: "$224M",
    detail: "Federal and state money with its purposes attached.",
    color: "var(--color-canopy-light)",
  },
  {
    label: "Committed",
    valueK: 701_659,
    display: "$702M",
    detail: "Contracts, pensions, and the people who are the school system.",
    color: "var(--color-ember)",
  },
  {
    label: "The movable slice",
    valueK: 181_612,
    display: "$182M",
    detail: "Where board choices actually bite. Utilities and buses live here too.",
    color: "var(--color-fern)",
  },
] as const;

const FINDINGS = [
  {
    href: "#the-empty-chair",
    stat: "9",
    statLabel: "working days",
    title: "The empty chair",
    body: "Oregon law seats citizens on every big district's budget committee. A carve-out lets Portland's board review its own budget alone; the volunteer substitute got nine working days for $2.8 billion.",
  },
  {
    href: "#the-levy-leak",
    stat: "$1.51",
    statLabel: "of every $1.99",
    title: "The levy leak",
    body: "Voters renewed a $1.99 teachers levy. The 1990s tax constitution delivers about $1.51 of it, the leak is growing fast, and only Salem can fix it.",
  },
  {
    href: "#waste",
    stat: "$41M→$18M",
    statLabel: "one year's own forecast",
    title: "The forecast problem",
    body: "The district's quarterly reports are public, and inside FY2025-26 they show its own year-end forecast swinging from $41M to $18M and back to $35M. The books exist. The steering does not.",
  },
] as const;

export default function TheWholeStory() {
  return (
    <div className="border-b border-[var(--color-parchment)] bg-[var(--color-paper-warm)]">
      <div className="mx-auto w-full max-w-[1400px] 3xl:max-w-[1800px] px-5 sm:px-8 lg:px-12 py-10 sm:py-12">
        <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.22em] text-[var(--color-ember)]">
          The whole story in one screen
        </p>

        {/* (a) The one-page budget the district has never published */}
        <div className="mt-5 rounded-sm border border-[var(--color-parchment)] bg-white p-5 sm:p-6">
          <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1">
            <h2 className="font-editorial text-[22px] sm:text-[26px] leading-tight text-[var(--color-ink)]">
              ${(HEADLINE.allFundsFy27 / 1e9).toFixed(2)} billion, sorted by what can actually move
            </h2>
            <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-[var(--color-ink-muted)]">
              FY2026-27 adopted · the one-page budget PPS has never published
            </p>
          </div>

          <div className="mt-5 flex h-14 w-full overflow-hidden rounded-sm">
            {SEGMENTS.map((s) => (
              <div
                key={s.label}
                className="relative h-full"
                style={{ width: `${(s.valueK / TOTAL_K) * 100}%`, backgroundColor: s.color }}
                title={`${s.label}: ${s.display}`}
              />
            ))}
          </div>

          <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {SEGMENTS.map((s) => (
              <div key={s.label} className="flex gap-2.5">
                <span
                  className="mt-1 h-3 w-3 shrink-0 rounded-sm"
                  style={{ backgroundColor: s.color }}
                />
                <div>
                  <p className="text-[13px] font-semibold leading-tight text-[var(--color-ink)]">
                    {s.label}{" "}
                    <span className="font-mono tabular-nums text-[var(--color-ink-light)]">
                      {s.display}
                    </span>
                  </p>
                  <p className="mt-0.5 text-[12px] leading-snug text-[var(--color-ink-light)]">
                    {s.detail}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <p className="mt-4 border-t border-[var(--color-parchment)] pt-3 text-[13px] leading-relaxed text-[var(--color-ink-light)]">
            Every fight about this budget is a fight about the green sliver, and most of the
            loudest claims are about money that cannot legally reach it. The operating fund
            itself fell <span className="font-mono tabular-nums font-semibold text-[var(--color-ink)]">$6.5M</span>{" "}
            this year, the first drop in eleven years, while the headline total grew{" "}
            <span className="font-mono tabular-nums">$733M</span>. Both are true. That is the story.
          </p>
        </div>

        {/* (b) The three findings */}
        <div className="mt-4 grid gap-3 md:grid-cols-3">
          {FINDINGS.map((f) => (
            <a
              key={f.title}
              href={f.href}
              className="group rounded-sm border border-[var(--color-parchment)] bg-white p-5 transition-colors hover:border-[var(--color-ember)]"
            >
              <div className="flex items-baseline gap-2">
                <span className="font-mono text-[30px] font-semibold tabular-nums leading-none text-[var(--color-clay)]">
                  {f.stat}
                </span>
                <span className="font-mono text-[10px] uppercase tracking-[0.12em] text-[var(--color-ink-muted)]">
                  {f.statLabel}
                </span>
              </div>
              <p className="mt-2.5 font-editorial text-[17px] leading-tight text-[var(--color-ink)] group-hover:text-[var(--color-canopy)]">
                {f.title}
              </p>
              <p className="mt-1.5 text-[12.5px] leading-relaxed text-[var(--color-ink-light)]">
                {f.body}
              </p>
              <p className="mt-2.5 font-mono text-[10px] uppercase tracking-[0.14em] text-[var(--color-ember)]">
                Read the evidence ↓
              </p>
            </a>
          ))}
        </div>

        {/* (c) The annual question */}
        <p className="mt-6 text-center font-editorial text-[18px] sm:text-[20px] italic text-[var(--color-ink)]">
          The question this page exists to arm you to ask: &ldquo;Does the next dollar reach a
          student, and can you show me?&rdquo;
        </p>
      </div>
    </div>
  );
}
