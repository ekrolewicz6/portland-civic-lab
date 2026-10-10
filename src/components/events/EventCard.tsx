import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { dateBlock, eventPath, longDate, timeRange, type LabEvent } from "@/lib/events";

/** One row of the /events index: a date block, the title, and when and where. */
export default function EventCard({ event, past = false }: { event: LabEvent; past?: boolean }) {
  const d = dateBlock(event);
  const when = `${longDate(event)}, ${timeRange(event)}${event.timeTentative ? " (start time to be confirmed)" : ""}`;
  return (
    <li className="border-t border-[var(--color-parchment)] first:border-t-0">
      <Link href={eventPath(event)} className="group grid grid-cols-[64px_1fr] gap-5 py-8 sm:grid-cols-[88px_1fr] sm:gap-8">
        <div
          className={`flex flex-col items-center self-start rounded-sm py-3 text-center ${
            past ? "bg-[var(--color-paper-warm)] text-[var(--color-ink-muted)] ring-1 ring-[var(--color-parchment)]" : "bg-[var(--color-canopy)] text-white"
          }`}
        >
          <span className={`font-mono text-[12px] font-semibold uppercase tracking-[0.12em] ${past ? "" : "text-[var(--color-ember-bright)]"}`}>
            {d.weekday}
          </span>
          <span className="mt-1 font-editorial text-[34px] leading-none tabular-nums sm:text-[40px]">{d.day}</span>
          <span className={`mt-1 font-mono text-[12px] uppercase tracking-[0.12em] ${past ? "" : "text-white/75"}`}>{d.month}</span>
        </div>
        <div className="min-w-0">
          <p className="font-mono text-[12px] font-semibold uppercase tracking-[0.18em] text-[var(--color-fern)]">
            {event.kind}
          </p>
          <h3 className="mt-2 font-editorial text-[26px] leading-tight text-[var(--color-ink)] transition-colors group-hover:text-[var(--color-canopy)] sm:text-[32px]">
            {event.title}
          </h3>
          <p className="mt-2 max-w-2xl text-[16px] leading-relaxed text-[var(--color-ink-light)]">{event.summary}</p>
          <p className="mt-3 text-[14px] leading-relaxed text-[var(--color-ink-muted)]">
            {when}. {event.venue ?? "Venue to be announced"}, {event.city}.
          </p>
          <p className="mt-4 inline-flex items-center gap-1.5 text-[14px] font-semibold text-[var(--color-canopy)]">
            {past ? "About this event" : "Details and registration"}
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
          </p>
        </div>
      </Link>
    </li>
  );
}
