import { GAPS } from "@/lib/pps-budget/data";

/**
 * Act IV close (document.md section 13, "What we cannot know"): the census of
 * what the public record cannot answer about the PPS budget. One row per
 * missing document: what it would settle, who holds it, and the specific ask
 * that would produce it.
 */

type GapRow = (typeof GAPS)[number];

function Ask({ text }: { text: string }) {
  return (
    <p className="text-[12.5px] leading-snug text-[var(--color-ink)]">
      <span className="font-mono text-[10px] font-semibold uppercase tracking-[0.14em] text-[var(--color-fern)]">
        How to get it ·{" "}
      </span>
      {text}
    </p>
  );
}

function Holder({ text }: { text: string }) {
  return (
    <p className="text-[12.5px] leading-snug text-[var(--color-ink-light)]">
      <span className="font-mono text-[10px] font-semibold uppercase tracking-[0.14em] text-[var(--color-ink-muted)]">
        Who has it ·{" "}
      </span>
      {text}
    </p>
  );
}

function GapCard({ r }: { r: GapRow }) {
  return (
    <li className="px-4 py-4 sm:px-5">
      <p className="text-[14.5px] font-semibold leading-snug text-[var(--color-ink)]">{r.gap}</p>
      <p className="mt-1.5 text-[13px] leading-relaxed text-[var(--color-ink-light)]">
        <span className="font-semibold text-[var(--color-ink)]">{"What it would settle: "}</span>
        {r.settles}
      </p>
      <div className="mt-2.5 space-y-1.5 border-t border-[var(--color-parchment)] pt-2.5">
        <Holder text={r.holder} />
        <Ask text={r.ask} />
      </div>
    </li>
  );
}

export default function CannotKnow() {
  return (
    <div className="mt-8">
      <h3 className="font-editorial text-[20px] sm:text-[22px] leading-snug text-[var(--color-ink)]">
        Eight missing documents, and who holds each one
      </h3>
      <p className="mt-3 max-w-3xl border-l-2 border-[var(--color-fern)] pl-4 font-editorial text-[16px] leading-snug text-[var(--color-ink)]">
        What a public body declines to publish is a decision about the public.
      </p>
      <p className="mt-3 max-w-3xl text-[14px] leading-relaxed text-[var(--color-ink-light)]">
        Most of the fights on this page cannot be settled, and this is why: the settling document
        has never been published. Each entry below names the document, the argument it would end,
        who has it, and the specific request that would produce it. Four sit in district files
        today. One belongs to the state. Three do not exist yet and would each take one vote to
        create.
      </p>

      <div className="mt-4 rounded-sm border border-[var(--color-parchment)] bg-white">
        <ul className="divide-y divide-[var(--color-parchment)]">
          {GAPS.map((r) => (
            <GapCard key={r.gap} r={r} />
          ))}
        </ul>
      </div>

      <p className="mt-2 font-mono text-[10px] uppercase tracking-[0.14em] text-[var(--color-ink-muted)]">
        Our records requests for the district-held documents are drafted and unsent; the district
        can moot every one of them by publishing.
      </p>
      <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.14em] text-[var(--color-ink-muted)]">
        Portland Public Schools financial reports page, inspected directly · MSRB EMMA · Oregon
        Secretary of State audits division
      </p>
    </div>
  );
}
