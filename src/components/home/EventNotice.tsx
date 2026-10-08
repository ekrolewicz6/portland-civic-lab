import Link from "next/link";
import { ArrowRight, CalendarDays } from "lucide-react";
import { eventPath, shortDate, type LabEvent } from "@/lib/events";

/**
 * The homepage's notice for the next Lab event, at the top of the hero. The
 * homepage passes nextEvent(now), so the notice changes or disappears on its
 * own once an event ends.
 */
export default function EventNotice({ event }: { event: LabEvent }) {
  return (
    <Link
      href={eventPath(event)}
      data-testid="event-notice"
      className="group mb-8 flex max-w-xl items-center gap-3 rounded-sm bg-white/[0.06] px-3.5 py-3 ring-1 ring-white/15 transition-colors animate-fade-up hover:bg-white/[0.11] hover:ring-white/30 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-ember-bright)] sm:gap-4 sm:px-4"
    >
      <span
        className="flex h-9 w-9 flex-none items-center justify-center rounded-full bg-[var(--color-ember-bright)]/12 text-[var(--color-ember-bright)] ring-1 ring-[var(--color-ember-bright)]/30"
        aria-hidden="true"
      >
        <CalendarDays size={16} strokeWidth={2} />
      </span>
      <span className="min-w-0 flex-1">
        <span className="block font-mono text-[12px] font-semibold uppercase tracking-[0.08em] text-[var(--color-ember-bright)]">
          {event.kind} · {shortDate(event)}
        </span>
        <span className="mt-0.5 block text-[15px] font-semibold leading-snug text-white">{event.title}</span>
      </span>
      <ArrowRight className="h-4 w-4 flex-none text-white/70 transition-transform group-hover:translate-x-0.5 group-hover:text-white" aria-hidden="true" />
    </Link>
  );
}
