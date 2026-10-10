import { existsSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { EVENTS, announcedEvent, dateBlock, eventBySlug, longDate, pastEvents, shortDate, timeRange, upcomingEvents } from "@/lib/events";

const swartz = eventBySlug("aaron-swartz-at-40")!;

describe("events", () => {
  it("gives every event a page and a unique slug", () => {
    expect(new Set(EVENTS.map((e) => e.slug)).size).toBe(EVENTS.length);
    for (const e of EVENTS) {
      expect(existsSync(path.join(process.cwd(), "src/app/(public)/events", e.slug, "page.tsx")), e.slug).toBe(true);
      expect(Date.parse(e.end)).toBeGreaterThan(Date.parse(e.start));
      expect(Date.parse(e.announceFrom)).toBeLessThan(Date.parse(e.start));
      expect(e.luma.url).toMatch(/^https:\/\/luma\.com\//);
      expect(e.luma.embedUrl).toMatch(/^https:\/\/luma\.com\/embed\/event\/evt-/);
    }
  });
  it("formats dates and times in Pacific time", () => {
    expect(longDate(swartz)).toBe("Sunday, November 8, 2026");
    expect(shortDate(swartz)).toBe("Sun, Nov 8");
    expect(dateBlock(swartz)).toEqual({ weekday: "Sun", month: "Nov", day: "8" });
    expect(timeRange(swartz)).toBe("5 to 7:30 p.m.");
    expect(timeRange({ ...swartz, start: "2026-11-08T11:00:00-08:00", end: "2026-11-08T13:00:00-08:00" })).toBe("11 a.m. to 1 p.m.");
  });
  it("banners the screening from the day after the election until it ends, then lists it as past", () => {
    expect(announcedEvent(new Date("2026-10-07T12:00:00-07:00"))).toBeNull();
    // Polls close at 8 p.m. on Nov 3; the event banner waits for Nov 4.
    expect(announcedEvent(new Date("2026-11-03T23:59:00-08:00"))).toBeNull();
    expect(announcedEvent(new Date("2026-11-04T00:00:00-08:00"))?.slug).toBe("aaron-swartz-at-40");
    expect(announcedEvent(new Date("2026-11-08T19:29:00-08:00"))?.slug).toBe("aaron-swartz-at-40");
    const after = new Date("2026-11-08T19:30:00-08:00");
    expect(announcedEvent(after)).toBeNull();
    expect(upcomingEvents(after).map((e) => e.slug)).not.toContain("aaron-swartz-at-40");
    expect(pastEvents(after).map((e) => e.slug)).toContain("aaron-swartz-at-40");
  });
});
