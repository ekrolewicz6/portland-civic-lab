/**
 * The field kit: six questions that end most school-budget arguments, plus
 * the mechanics of actually showing up. This is the page's action layer for
 * ordinary readers; it renders in the "Your move" section. Server component.
 */

const QUESTIONS = [
  {
    when: "Any dollar figure",
    ask: "Which slice is that money in: locked, restricted, committed, or movable?",
    good: "A good answer names the fund. A bad one repeats the total louder.",
  },
  {
    when: "A levy pitch",
    ask: "What is the effective rate, next to the $1.99?",
    good: "A good answer says about $1.51 and explains compression. Silence means they hope you will not ask.",
  },
  {
    when: "A cut",
    ask: "Is instruction taking it faster than central office? Show me the FTE, not adjectives.",
    good: "A good answer is a staffing table by function, two years side by side.",
  },
  {
    when: "A closure",
    ask: "Where is the published savings model, and where do the savings go?",
    good: "A good answer exists before the vote and names the receiving school's gains.",
  },
  {
    when: "A bond promise",
    ask: "What is the current estimate-at-completion against the ballot number?",
    good: "A good answer is a number with a date. 'On track' is not a number.",
  },
  {
    when: "“The state should pay”",
    ask: "Which specific ask: the special-education cap, the compression exemption, or the pension shock?",
    good: "A good answer picks one and names the bill or referral it needs.",
  },
] as const;

export default function FieldKit() {
  return (
    <div>
      {/* The six questions */}
      <div className="overflow-hidden rounded-sm border border-[var(--color-parchment)] bg-white">
        <div className="border-b border-[var(--color-parchment)] bg-[var(--color-paper-warm)] px-5 py-4">
          <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.18em] text-[var(--color-ember)]">
            The field kit
          </p>
          <h3 className="mt-1.5 font-editorial text-[22px] leading-tight text-[var(--color-ink)]">
            Six questions that end most school-budget arguments
          </h3>
          <p className="mt-1.5 text-[13px] leading-relaxed text-[var(--color-ink-light)]">
            Portable, neutral, and answerable. Use them on anyone, including us.
          </p>
        </div>
        <ul className="divide-y divide-[var(--color-parchment)]">
          {QUESTIONS.map((q) => (
            <li key={q.when} className="grid gap-x-6 gap-y-1 px-5 py-4 md:grid-cols-[150px_minmax(0,1fr)]">
              <p className="font-mono text-[11px] font-semibold uppercase tracking-[0.12em] text-[var(--color-ink-muted)] md:pt-0.5">
                {q.when}
              </p>
              <div>
                <p className="text-[14.5px] font-semibold leading-snug text-[var(--color-ink)]">
                  &ldquo;{q.ask}&rdquo;
                </p>
                <p className="mt-1 text-[12.5px] leading-relaxed text-[var(--color-ink-light)]">{q.good}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>

      {/* Where to take them */}
      <div className="mt-4 grid gap-3 md:grid-cols-3">
        <div className="rounded-sm border border-[var(--color-parchment)] bg-white p-5">
          <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.18em] text-[var(--color-ember)]">
            Show up
          </p>
          <p className="mt-2 text-[13px] leading-relaxed text-[var(--color-ink-light)]">
            The board meets at the Prophet Education Center, 501 N. Dixon St., 6:00 pm on select
            Tuesdays, with public comment; agendas and sign-up are on the board&apos;s meeting
            portal. The citizen budget committee meets monthly, October through June, and its
            meetings are public too.
          </p>
        </div>
        <div className="rounded-sm border border-[var(--color-parchment)] bg-white p-5">
          <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.18em] text-[var(--color-ember)]">
            Read along
          </p>
          <p className="mt-2 text-[13px] leading-relaxed text-[var(--color-ink-light)]">
            The quarterly financial reports are public at pps.net under Finance. When the year-end
            forecast moves by millions between quarters, that is the moment to ask why, in public
            comment, while it can still change the year.
          </p>
        </div>
        <div className="rounded-sm border border-[var(--color-parchment)] bg-white p-5">
          <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.18em] text-[var(--color-ember)]">
            Ask for records
          </p>
          <p className="mt-2 text-[13px] leading-relaxed text-[var(--color-ink-light)]">
            Anyone can file a records request under ORS 192, and the district must acknowledge
            within five business days. The two with the most public value right now: the
            position-control reports that would settle the central-office argument, and the
            closure savings model, before any vote. One paragraph and an email is enough.
          </p>
        </div>
      </div>
    </div>
  );
}
