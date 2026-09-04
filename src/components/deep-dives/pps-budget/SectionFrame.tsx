/**
 * The fixed anatomy every section of the PPS budget page follows, so a reader
 * can scan only the sticky rails and still get the whole argument:
 *
 *   rail:  question (title) → one-sentence answer (lead) → <Insight/>: the one
 *          number that proves it, and which kind of money the section is about
 *   body:  ≤ 120 words of prose → the exhibit(s) → <Bridge/>: the question the
 *          next section answers, as a link
 *
 * The "which money" chip reuses the four-slice color system from
 * TheWholeStory, so the opening exhibit threads through the entire page.
 * Server components, no state.
 */

export type MoneyKey = "rules" | "locked" | "restricted" | "committed" | "movable";

const MONEY: Record<MoneyKey, { label: string; color: string; outline?: boolean }> = {
  rules: { label: "The rules from Salem", color: "var(--color-ink-muted)", outline: true },
  locked: { label: "Locked money", color: "var(--color-canopy)" },
  restricted: { label: "Restricted grants", color: "var(--color-clay)" },
  committed: { label: "Committed money", color: "var(--color-ember)" },
  movable: { label: "The movable slice", color: "var(--color-fern)" },
};

function Dot({ k, dark }: { k: MoneyKey; dark: boolean }) {
  const m = MONEY[k];
  return (
    <span
      aria-hidden
      className="inline-block h-2.5 w-2.5 shrink-0 rounded-sm"
      style={
        m.outline
          ? { border: `1.5px solid ${dark ? "rgba(255,255,255,0.55)" : m.color}` }
          : { backgroundColor: m.color }
      }
    />
  );
}

export function Insight({
  number,
  label,
  money,
  dark = false,
}: {
  number: string;
  label: string;
  money: MoneyKey | MoneyKey[];
  dark?: boolean;
}) {
  const keys = Array.isArray(money) ? money : [money];
  const moneyLabel =
    keys.length === 1 ? MONEY[keys[0]].label : "All four kinds of money";
  return (
    <div
      className={`rounded-sm border p-4 ${
        dark
          ? "border-white/15 bg-white/[0.04]"
          : "border-[var(--color-parchment)] bg-white"
      }`}
    >
      <p
        className={`font-mono text-[10px] font-semibold uppercase tracking-[0.18em] ${
          dark ? "text-[var(--color-ember-bright)]" : "text-[var(--color-ember)]"
        }`}
      >
        The number
      </p>
      <p
        className={`mt-1.5 font-mono text-[34px] font-bold tabular-nums leading-none ${
          dark ? "text-white" : "text-[var(--color-clay)]"
        }`}
      >
        {number}
      </p>
      <p
        className={`mt-2 text-[13px] leading-snug ${
          dark ? "text-white/70" : "text-[var(--color-ink-light)]"
        }`}
      >
        {label}
      </p>
      <div
        className={`mt-3 flex items-center gap-2 border-t pt-3 ${
          dark ? "border-white/15" : "border-[var(--color-parchment)]"
        }`}
      >
        <span className="flex items-center gap-1">
          {keys.map((k) => (
            <Dot key={k} k={k} dark={dark} />
          ))}
        </span>
        <span
          className={`font-mono text-[10px] uppercase tracking-[0.14em] ${
            dark ? "text-white/60" : "text-[var(--color-ink-muted)]"
          }`}
        >
          {moneyLabel}
        </span>
      </div>
    </div>
  );
}

export function Bridge({
  href,
  question,
  dark = false,
}: {
  href: string;
  question: string;
  dark?: boolean;
}) {
  return (
    <a
      href={href}
      className={`group mt-10 flex items-center justify-between gap-6 rounded-sm border-t-2 pt-5 ${
        dark ? "border-white/20" : "border-[var(--color-canopy)]/30"
      }`}
    >
      <div>
        <p
          className={`font-mono text-[10px] font-semibold uppercase tracking-[0.18em] ${
            dark ? "text-[var(--color-ember-bright)]" : "text-[var(--color-ember)]"
          }`}
        >
          Next question
        </p>
        <p
          className={`mt-1.5 font-editorial text-[19px] leading-snug sm:text-[22px] ${
            dark
              ? "text-white group-hover:text-[var(--color-ember-bright)]"
              : "text-[var(--color-ink)] group-hover:text-[var(--color-canopy)]"
          }`}
        >
          {question}
        </p>
      </div>
      <span
        aria-hidden
        className={`shrink-0 font-mono text-[28px] transition-transform group-hover:translate-x-1 ${
          dark ? "text-white/60" : "text-[var(--color-canopy)]"
        }`}
      >
        →
      </span>
    </a>
  );
}

/** One line under an exhibit that says what the reader should now believe. */
export function Takeaway({ children }: { children: React.ReactNode }) {
  return (
    <p className="mt-4 border-l-[3px] border-[var(--color-ember)] pl-4 text-[15px] font-semibold leading-relaxed text-[var(--color-ink)]">
      {children}
    </p>
  );
}

/**
 * The state formula as a schematic: the identity that makes local tax growth
 * a wash, plus the short list of what actually adds money. No dollar figures,
 * on purpose; the shape is the lesson.
 */
export function FormulaStrip() {
  const box =
    "flex-1 rounded-sm border border-[var(--color-parchment)] bg-white px-4 py-3 text-center";
  const op = "shrink-0 font-mono text-[22px] font-bold text-[var(--color-ink-muted)]";
  return (
    <div className="rounded-sm border border-[var(--color-parchment)] bg-[var(--color-paper-warm)] p-5 sm:p-6">
      <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.18em] text-[var(--color-ink-muted)]">
        How Oregon decides what PPS gets, since 1991
      </p>
      <div className="mt-4 flex flex-col items-stretch gap-2 sm:flex-row sm:items-center sm:gap-3">
        <div className={box}>
          <p className="text-[14px] font-semibold text-[var(--color-ink)]">Formula total</p>
          <p className="mt-0.5 text-[12px] text-[var(--color-ink-light)]">students × state weights</p>
        </div>
        <span className={`${op} text-center`}>−</span>
        <div className={`${box} border-[var(--color-clay)]/40`}>
          <p className="text-[14px] font-semibold text-[var(--color-ink)]">Local property taxes</p>
          <p className="mt-0.5 text-[12px] text-[var(--color-ink-light)]">what Portland collects</p>
        </div>
        <span className={`${op} text-center`}>=</span>
        <div className={`${box} border-[var(--color-canopy)]/40`}>
          <p className="text-[14px] font-semibold text-[var(--color-ink)]">The state check</p>
          <p className="mt-0.5 text-[12px] text-[var(--color-ink-light)]">what Salem sends</p>
        </div>
      </div>
      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        <div className="rounded-sm border border-[var(--color-parchment)] bg-white p-4">
          <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.14em] text-[var(--color-clay)]">
            So if Portland&apos;s tax base grows by $1
          </p>
          <p className="mt-1.5 text-[14px] leading-snug text-[var(--color-ink)]">
            the state check shrinks by $1, and the schools get{" "}
            <span className="font-mono font-bold">$0</span> more. Local wealth does not buy local
            school. That is the design, not a scandal.
          </p>
        </div>
        <div className="rounded-sm border border-[var(--color-parchment)] bg-white p-4">
          <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.14em] text-[var(--color-fern)]">
            What sits outside the formula and does add money
          </p>
          <p className="mt-1.5 text-[14px] leading-snug text-[var(--color-ink)]">
            The teachers levy, construction bonds, the Student Success Act, federal grants, the
            city&apos;s arts tax, and, for four years, pandemic relief. Two of those are things
            Portlanders vote on directly.
          </p>
        </div>
      </div>
    </div>
  );
}
