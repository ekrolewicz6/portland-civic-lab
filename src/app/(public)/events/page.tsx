import type { Metadata } from "next";
import Link from "next/link";
import { pageMeta } from "@/lib/page-meta";
import { pastEvents, upcomingEvents } from "@/lib/events";
import EventCard from "@/components/events/EventCard";

export const metadata: Metadata = pageMeta({
  title: "Events",
  description:
    "Free screenings and gatherings Portland Civic Lab hosts in Portland, with the date, the place and how to register for each.",
  path: "/events",
});

// Events move from Upcoming to Past when they end, without a redeploy.
export const revalidate = 3600;

const CONTACT_EVENTS = `/contact?topic=${encodeURIComponent("Events")}`;

export default function EventsPage() {
  const now = new Date();
  const upcoming = upcomingEvents(now);
  const past = pastEvents(now);
  return (
    <div className="bg-[var(--color-paper)]">
      <section className="relative overflow-hidden bg-[var(--color-canopy)] noise-overlay">
        <div className="absolute right-0 top-0 h-[420px] w-[520px] translate-x-1/4 -translate-y-1/3 rounded-full bg-[var(--color-canopy-light)] opacity-25 blur-[150px]" />
        <div className="mx-auto max-w-[1400px] 3xl:max-w-[1800px] px-5 py-14 sm:px-8 sm:py-18 lg:px-12">
          <div className="max-w-3xl">
            <div className="flex items-center gap-3 text-[12px] font-mono uppercase tracking-[0.18em] text-[var(--color-ember)]">
              <span>Events</span>
              <div className="h-px w-8 bg-[var(--color-ember)]/60" />
              <span>Hosted by the Lab</span>
            </div>
            <h1 className="mt-6 font-editorial-normal text-[42px] leading-[1.02] tracking-tight text-white sm:text-[56px]">
              Events
            </h1>
            <p className="mt-5 max-w-2xl text-[16px] leading-relaxed text-white/70 sm:text-[18px]">
              Gatherings Portland Civic Lab hosts in the city. Each listing has the date, the place
              and a way to register.
            </p>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-[1400px] 3xl:max-w-[1800px] px-5 py-12 sm:px-8 sm:py-16 lg:px-12" aria-labelledby="upcoming-title">
        <h2 id="upcoming-title" className="font-mono text-[12px] font-semibold uppercase tracking-[0.18em] text-[var(--color-ink-muted)]">
          Upcoming
        </h2>
        {upcoming.length > 0 ? (
          <ul className="mt-2">
            {upcoming.map((e) => (
              <EventCard key={e.slug} event={e} />
            ))}
          </ul>
        ) : (
          <p className="mt-4 max-w-2xl text-[16px] leading-relaxed text-[var(--color-ink-light)]">
            Nothing is scheduled right now. The next event will be listed here and on the homepage
            as soon as it has a date.
          </p>
        )}

        {past.length > 0 && (
          <div className="mt-12 border-t border-[var(--color-parchment)] pt-10">
            <h2 className="font-mono text-[12px] font-semibold uppercase tracking-[0.18em] text-[var(--color-ink-muted)]">
              Past events
            </h2>
            <ul className="mt-2">
              {past.map((e) => (
                <EventCard key={e.slug} event={e} past />
              ))}
            </ul>
          </div>
        )}

        <div className="mt-12 rounded-sm border border-[var(--color-parchment)] bg-white p-6 sm:p-8">
          <h2 className="font-editorial text-[26px] text-[var(--color-ink)]">Have a room, or an idea for an event?</h2>
          <p className="mt-3 max-w-2xl text-[15px] leading-relaxed text-[var(--color-ink-light)]">
            We are looking for venues and partners around Portland. If you have a space, or a film or
            a subject you would like to bring people together around, tell us about it.
          </p>
          <Link
            href={CONTACT_EVENTS}
            className="mt-5 inline-flex items-center justify-center gap-2 rounded-sm bg-[var(--color-canopy)] px-5 py-3 text-[15px] font-semibold text-white transition-colors hover:bg-[var(--color-canopy-mid)]"
          >
            Get in touch
          </Link>
        </div>
      </section>
    </div>
  );
}
