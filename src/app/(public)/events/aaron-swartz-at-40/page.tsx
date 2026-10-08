import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowDown, ArrowRight } from "lucide-react";
import { pageMeta } from "@/lib/page-meta";
import { eventBySlug, isPast, longDate, timeRange } from "@/lib/events";
import LumaRegistration from "@/components/events/LumaRegistration";

const SLUG = "aaron-swartz-at-40";

export const metadata: Metadata = pageMeta({
  title: "Aaron Swartz at 40: a free screening of The Internet’s Own Boy",
  description:
    "Portland Civic Lab is hosting a free Portland screening of The Internet’s Own Boy on Sunday, November 8, 2026, which would have been Aaron Swartz’s 40th birthday.",
  path: `/events/${SLUG}`,
});

// Swaps registration for a past-event note once the screening ends.
export const revalidate = 3600;

const HELP_HREF = `/contact?topic=${encodeURIComponent("Events")}&event=${SLUG}`;

export default function AaronSwartzAt40Page() {
  const event = eventBySlug(SLUG);
  if (!event) notFound();
  const past = isPast(event, new Date());
  const [main, film] = event.title.split(": ");

  return (
    <div className="bg-[var(--color-paper)]">
      <section className="relative overflow-hidden bg-[var(--color-canopy)] noise-overlay">
        <div className="absolute right-0 top-0 h-[420px] w-[520px] translate-x-1/4 -translate-y-1/3 rounded-full bg-[var(--color-canopy-light)] opacity-25 blur-[150px]" />
        <div className="relative mx-auto max-w-[1400px] 3xl:max-w-[1800px] px-5 py-14 sm:px-8 sm:py-18 lg:px-12">
          <div className="max-w-3xl">
            <div className="flex items-center gap-3 text-[12px] font-mono uppercase tracking-[0.18em] text-[var(--color-ember)]">
              <Link href="/events" className="-my-2 inline-flex min-h-[24px] items-center py-2 hover:text-[var(--color-ember-bright)]">Events</Link>
              <div className="h-px w-8 bg-[var(--color-ember)]/60" />
              <span>{event.kind}</span>
            </div>
            <h1 className="mt-6 font-editorial-normal text-[42px] leading-[1.02] tracking-tight text-white sm:text-[56px]">
              {main}
              <span className="sr-only">: </span>
              <span className="block font-editorial italic text-[var(--color-ember-bright)]">{film}</span>
            </h1>
            <p className="mt-5 max-w-2xl text-[16px] leading-relaxed text-white/70 sm:text-[18px]">
              A free screening in Portland of the documentary about Aaron Swartz, on what would
              have been his 40th birthday.
            </p>
          </div>

          <dl className="mt-10 grid max-w-4xl grid-cols-1 gap-x-8 gap-y-5 border-t border-white/12 pt-6 sm:grid-cols-3">
            <div>
              <dt className="font-mono text-[12px] font-semibold uppercase tracking-[0.16em] text-white/55">When</dt>
              <dd className="mt-1.5 text-[16px] leading-snug text-white">
                {longDate(event)}
                <span className="block text-white/70">
                  {timeRange(event)}
                  {event.timeTentative && " (start time to be confirmed)"}
                </span>
              </dd>
            </div>
            <div>
              <dt className="font-mono text-[12px] font-semibold uppercase tracking-[0.16em] text-white/55">Where</dt>
              <dd className="mt-1.5 text-[16px] leading-snug text-white">
                {event.venue ?? "Venue to be announced"}
                <span className="block text-white/70">{event.city}</span>
              </dd>
            </div>
            <div>
              <dt className="font-mono text-[12px] font-semibold uppercase tracking-[0.16em] text-white/55">Cost</dt>
              <dd className="mt-1.5 text-[16px] leading-snug text-white">
                {event.cost}
                <span className="block text-white/70">Registration required</span>
              </dd>
            </div>
          </dl>

          {!past && (
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <a
                href="#register"
                className="inline-flex items-center justify-center gap-2 rounded-sm bg-[var(--color-ember)] px-5 py-3 text-[15px] font-semibold text-[var(--color-canopy)] transition-colors hover:bg-[var(--color-ember-bright)]"
              >
                Register
                <ArrowDown className="h-4 w-4" aria-hidden="true" />
              </a>
              <a
                href="#help"
                className="inline-flex items-center justify-center gap-2 rounded-sm border border-white/20 bg-white/[0.06] px-5 py-3 text-[15px] font-semibold text-white transition-colors hover:bg-white/[0.12]"
              >
                Help make it happen
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </a>
            </div>
          )}
        </div>
      </section>

      <section className="mx-auto max-w-[1400px] 3xl:max-w-[1800px] px-5 py-12 sm:px-8 sm:py-16 lg:px-12">
        <div className="max-w-3xl space-y-12">
          {past ? (
            <p className="rounded-sm border border-[var(--color-parchment)] bg-[var(--color-paper-warm)] p-5 text-[16px] leading-relaxed text-[var(--color-ink-light)]">
              This screening took place on {longDate(event)}.{" "}
              <Link href="/events" className="font-semibold text-[var(--color-canopy)] hover:underline">See upcoming events</Link>.
            </p>
          ) : (
            event.status && (
              <div className="rounded-sm border-l-2 border-[var(--color-ember)] bg-[var(--color-paper-warm)] p-5 sm:p-6">
                <p className="font-mono text-[12px] font-semibold uppercase tracking-[0.18em] text-[var(--color-fern)]">Still being arranged</p>
                <p className="mt-2 text-[16px] leading-relaxed text-[var(--color-ink)]">{event.status}</p>
              </div>
            )
          )}

          {!past && <LumaRegistration event={event} />}

          <div>
            <h2 className="font-editorial text-[28px] leading-tight text-[var(--color-ink)] sm:text-[34px]">The evening</h2>
            <div className="mt-4 space-y-4 text-[16px] leading-relaxed text-[var(--color-ink-light)]">
              <p>
                November 8 would have been Aaron Swartz’s 40th birthday. We are marking it with a free
                screening of <cite>The Internet’s Own Boy</cite>, Brian Knappenberger’s 2014 documentary
                about his life, his work and his fight for an open internet. We’ll come together to
                remember him, talk about his ideas, and think about how to carry them forward here in
                Portland.
              </p>
              <p>
                The format is simple: a short welcome, the film, and a brief closing. You don’t need a
                technical background, or to know anything about Aaron’s story, to come.
              </p>
            </div>
          </div>

          <div>
            <h2 className="font-editorial text-[28px] leading-tight text-[var(--color-ink)] sm:text-[34px]">Who Aaron Swartz was</h2>
            <div className="mt-4 space-y-4 text-[16px] leading-relaxed text-[var(--color-ink-light)]">
              <p>
                Aaron Swartz was a programmer and activist. At 14 he helped write the RSS 1.0
                specification. He later helped build the technical architecture of Creative Commons and
                was an early co-owner of Reddit. He also founded Demand Progress, which campaigned
                against the Stop Online Piracy Act until Congress shelved the bill in 2012. He believed knowledge
                should be open to everyone and that technology could give people more power over their
                own lives. He died in January 2013, at 26, while facing federal charges for downloading
                millions of academic articles through MIT’s network.
              </p>
            </div>
          </div>

          <figure className="border-t border-[var(--color-parchment)] pt-8">
            <h2 className="font-mono text-[12px] font-semibold uppercase tracking-[0.18em] text-[var(--color-ink-muted)]">
              A note from the organizer
            </h2>
            <blockquote className="mt-4 font-editorial text-[22px] leading-snug text-[var(--color-ink)] sm:text-[24px]">
              <p>
                I was at MIT from 2008 to 2013, and like many in that community, I was heartbroken by
                Aaron’s death. His belief in making knowledge accessible and using technology for the
                public good feels more important than ever. It’s a spirit I hope to carry into the work
                of Portland Civic Lab, and one I’d love to bring people together around.
              </p>
            </blockquote>
            <figcaption className="mt-4 text-[14px] text-[var(--color-ink-muted)]">
              Edan Krolewicz, founder, Portland Civic Lab
            </figcaption>
          </figure>

          {!past && (
            <div id="help" className="scroll-mt-24 rounded-sm border border-[var(--color-parchment)] bg-white p-6 sm:p-8">
              <h2 className="font-editorial text-[26px] text-[var(--color-ink)]">Help make it happen</h2>
              <p className="mt-3 max-w-2xl text-[15px] leading-relaxed text-[var(--color-ink-light)]">
                Do you know a good venue, want to help on the night, or belong to a group that would
                like to come together? Tell us. And please share this page with anyone who cares about
                open knowledge, technology and the public good.
              </p>
              <Link
                href={HELP_HREF}
                className="mt-5 inline-flex items-center justify-center gap-2 rounded-sm bg-[var(--color-canopy)] px-5 py-3 text-[15px] font-semibold text-white transition-colors hover:bg-[var(--color-canopy-mid)]"
              >
                Offer to help
              </Link>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
