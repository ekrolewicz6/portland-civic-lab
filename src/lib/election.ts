/**
 * Oregon general election, November 3, 2026. Drives the homepage election
 * banner: the day count and the moment it retires itself.
 */

// Polls close 8 p.m. Pacific on November 3, 2026: 04:00 UTC November 4 (PST).
export const ELECTION_DAY = new Date("2026-11-03T12:00:00-08:00");
export const POLLS_CLOSE = new Date("2026-11-04T04:00:00Z");

const PACIFIC_DAY = new Intl.DateTimeFormat("en-CA", {
  timeZone: "America/Los_Angeles",
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
});

/** Whole calendar days from `now` to Election Day, in Pacific time. */
export function daysUntilElection(now: Date): number {
  const [today, election] = [now, ELECTION_DAY].map((d) => Date.parse(PACIFIC_DAY.format(d)));
  return Math.round((election - today) / 86_400_000);
}

/** Countdown copy for the banner, or null once polls have closed. */
export function electionBannerLabel(now: Date): string | null {
  if (now >= POLLS_CLOSE) return null;
  const days = daysUntilElection(now);
  if (days <= 0) return "Election Day is today. Ballots are due by 8 p.m.";
  if (days === 1) return "Election Day is tomorrow";
  return `${days} days until Election Day`;
}
