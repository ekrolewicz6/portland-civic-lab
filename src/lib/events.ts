/**
 * Events the Lab hosts. One registry feeds the /events index, each event's
 * own page, the homepage notice, the sitemap and the contact form, so a date
 * or venue changes in one place. Registration runs on Luma; each event page
 * embeds its Luma widget and links to the listing directly.
 *
 * Every event has a page at /events/<slug> (tests/events.test.ts checks).
 * Times carry their Pacific offset. The homepage banner runs from an event's
 * announceFrom until it ends; once it ends the event moves to "Past" on the
 * index. Both happen without a deploy.
 */

export type LabEvent = {
  slug: string;
  title: string;
  /** Short label for the kind of event, e.g. "Free screening". */
  kind: string;
  /** One sentence for the index card. */
  summary: string;
  start: string;
  end: string;
  /** When the homepage banner for this event starts; it runs until the event ends. */
  announceFrom: string;
  /** True while the listed start time is a placeholder. */
  timeTentative: boolean;
  /** Null until the venue is confirmed. */
  venue: string | null;
  city: string;
  cost: string;
  /** What is still unsettled, in a sentence or two; null once it is all set. */
  status: string | null;
  luma: { url: string; embedUrl: string };
};

export const EVENTS: LabEvent[] = [
  {
    slug: "aaron-swartz-at-40",
    title: "Aaron Swartz at 40: The Internet’s Own Boy",
    kind: "Free screening",
    summary:
      "A free screening of the documentary about Aaron Swartz on what would have been his 40th birthday.",
    start: "2026-11-08T17:00:00-08:00",
    end: "2026-11-08T19:30:00-08:00",
    // The day after the Nov 3 election, once the election banner has retired.
    announceFrom: "2026-11-04T00:00:00-08:00",
    timeTentative: true,
    venue: null,
    city: "Portland, Oregon",
    cost: "Free",
    status:
      "The venue and final start time are still being confirmed. Register to get the details when they are set. The number of registrations also tells us how big a room to book, and Luma will confirm each place once arrangements are final.",
    luma: {
      url: "https://luma.com/xv5vrxzk",
      embedUrl: "https://luma.com/embed/event/evt-X9O9Vaal9djDyGz/simple",
    },
  },
];

const TZ = "America/Los_Angeles";

export function eventPath(e: LabEvent): string {
  return `/events/${e.slug}`;
}

export function eventBySlug(slug: string): LabEvent | undefined {
  return EVENTS.find((e) => e.slug === slug);
}

export function isPast(e: LabEvent, now: Date): boolean {
  return now >= new Date(e.end);
}

/** Events that have not ended, soonest first. */
export function upcomingEvents(now: Date): LabEvent[] {
  return EVENTS.filter((e) => !isPast(e, now)).sort((a, b) => Date.parse(a.start) - Date.parse(b.start));
}

/** Events that have ended, most recent first. */
export function pastEvents(now: Date): LabEvent[] {
  return EVENTS.filter((e) => isPast(e, now)).sort((a, b) => Date.parse(b.start) - Date.parse(a.start));
}

/** The event the homepage banner announces: the soonest one inside its announcement window. */
export function announcedEvent(now: Date): LabEvent | null {
  return upcomingEvents(now).find((e) => now >= new Date(e.announceFrom)) ?? null;
}

const LONG_DATE = new Intl.DateTimeFormat("en-US", { timeZone: TZ, weekday: "long", month: "long", day: "numeric", year: "numeric" });
const SHORT_DATE = new Intl.DateTimeFormat("en-US", { timeZone: TZ, weekday: "short", month: "short", day: "numeric" });
const CLOCK = new Intl.DateTimeFormat("en-US", { timeZone: TZ, hour: "numeric", minute: "2-digit", hour12: true });

/** "Sunday, November 8, 2026" */
export function longDate(e: LabEvent): string {
  return LONG_DATE.format(new Date(e.start));
}

/** "Sun, Nov 8" */
export function shortDate(e: LabEvent): string {
  return SHORT_DATE.format(new Date(e.start));
}

/** The pieces of the index card's date block: { weekday: "Sun", month: "Nov", day: "8" }. */
export function dateBlock(e: LabEvent): { weekday: string; month: string; day: string } {
  const parts = SHORT_DATE.formatToParts(new Date(e.start));
  const get = (type: Intl.DateTimeFormatPartTypes) => parts.find((p) => p.type === type)?.value ?? "";
  return { weekday: get("weekday"), month: get("month"), day: get("day") };
}

function clock(iso: string): { time: string; period: string } {
  const parts = CLOCK.formatToParts(new Date(iso));
  const hour = parts.find((p) => p.type === "hour")?.value ?? "";
  const minute = parts.find((p) => p.type === "minute")?.value ?? "00";
  const period = (parts.find((p) => p.type === "dayPeriod")?.value ?? "").toLowerCase() === "am" ? "a.m." : "p.m.";
  return { time: minute === "00" ? hour : `${hour}:${minute}`, period };
}

/** "5 to 7:30 p.m.", or "11 a.m. to 1 p.m." across noon. Pacific time. */
export function timeRange(e: LabEvent): string {
  const a = clock(e.start);
  const b = clock(e.end);
  return a.period === b.period ? `${a.time} to ${b.time} ${b.period}` : `${a.time} ${a.period} to ${b.time} ${b.period}`;
}
