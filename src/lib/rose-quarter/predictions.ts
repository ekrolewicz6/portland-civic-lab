/**
 * The predictions on record, before the closure.
 *
 * ODOT's forecast is quoted verbatim from its own public notice, with a date
 * and a link. That is the standard every prediction on this page has to meet.
 *
 * The opposing prediction does not yet meet it, and we say so rather than
 * quietly paraphrasing. The reduced-demand hypothesis is well established in
 * the literature and is No More Freeways' consistent public position, so it is
 * pre-registered here attributed to the ORGANISATION and the literature — not
 * to any individual, and not as a quotation nobody can check. Both sides have
 * an open invitation to put a specific, dated number on the record before
 * September 11, and if they do it gets added here with its source.
 *
 * The asymmetry is stated on the page too: ODOT is a public agency whose
 * forecast is an official planning document that people are being asked to
 * plan around. No More Freeways is an advocacy group. Scoring them by an
 * identical standard without noting that difference would itself distort.
 */

export type Verdict = "borne-out" | "partly" | "not-borne-out" | "not-testable" | "too-early";

export interface Prediction {
  id: string;
  side: "odot" | "opposition";
  who: string;
  role: string;
  /** Verbatim where we have it; null where we are stating a hypothesis instead. */
  quote: string | null;
  /** Our plain-language statement of the testable claim. */
  claim: string;
  sourceTitle: string;
  sourceUrl: string;
  publishedOn: string | null;
  retrievedOn: string;
  /** True when this is our formulation of a position, not the speaker's words. */
  isParaphrase: boolean;
  /** The pre-registered rule that decides it. */
  rule: string;
  verdict: Verdict;
}

export const PREDICTIONS: Prediction[] = [
  {
    id: "O2",
    side: "odot",
    who: "Oregon Department of Transportation",
    role: "The agency running the closure",
    quote:
      "Travel times on I-5 near the project site could be two to three times longer than a typical travel day if every driver sticks to their normal travel patterns.",
    claim:
      "Peak travel time on the realistic southbound path will run 2–3× a normal day during the closure.",
    sourceTitle: "ODOT closure notice",
    sourceUrl:
      "https://www.i5rosequarter.org/news/odot-to-close-i-5-southbound-in-the-rose-quarter-in-september-for-up-to-five-weeks-for-structural-repairs/",
    publishedOn: "2026-05-04",
    retrievedOn: "2026-08-13",
    isParaphrase: false,
    rule: "Borne out if peak travel time on the path I-5 approach → I-405 → I-5 south reaches 2.0× the matched baseline on at least 3 of 5 weekdays in week 3. Partly, if 1.5–2.0×.",
    verdict: "too-early",
  },
  {
    id: "O3",
    side: "odot",
    who: "Oregon Department of Transportation",
    role: "The agency running the closure",
    quote:
      "Congestion on I-5 southbound during the morning and afternoon commutes is expected to extend into Vancouver.",
    claim:
      "Southbound queues will reach across the Columbia River into Washington. Unlike the travel-time forecast, this one carries no condition.",
    sourceTitle: "ODOT closure notice",
    sourceUrl:
      "https://www.i5rosequarter.org/news/odot-to-close-i-5-southbound-in-the-rose-quarter-in-september-for-up-to-five-weeks-for-structural-repairs/",
    publishedOn: "2026-05-04",
    retrievedOn: "2026-08-13",
    isParaphrase: false,
    rule: "Borne out if peak speeds at Washington I-5 stations north of the Interstate Bridge fall to 60% of baseline on 3 of 5 weekdays, and the same drop is absent northbound.",
    verdict: "too-early",
  },
  {
    id: "N2",
    side: "opposition",
    who: "No More Freeways",
    role: "The coalition opposing the widening",
    quote: null,
    claim:
      "After an initial shock of a few days, traffic will redistribute and conditions will settle close to normal — because some trips will not be made at all. This is the reduced-demand hypothesis: the mirror image of induced demand, and the reason advocates argue the corridor does not need more lanes.",
    sourceTitle: "No More Freeways — published position on induced and reduced demand",
    sourceUrl: "https://nomorefreewayspdx.com/",
    publishedOn: null,
    retrievedOn: "2026-08-13",
    isParaphrase: true,
    rule: "Borne out if peak travel time on the realistic path is within 1.25× the matched baseline on at least 4 of 5 weekdays in week 3. Partly, if 1.25–1.5×.",
    verdict: "too-early",
  },
  {
    id: "N3",
    side: "opposition",
    who: "No More Freeways",
    role: "The coalition opposing the widening",
    quote: null,
    claim:
      "Some trips will disappear rather than move. This is the claim that actually bears on the $2 billion question, and it is the one we designed the measurement around.",
    sourceTitle: "The case against the I-5 Rose Quarter widening",
    sourceUrl: "https://cityobservatory.org/case_against_rose_quarter/",
    publishedOn: null,
    retrievedOn: "2026-08-13",
    isParaphrase: true,
    rule: "Demonstrated if southbound volume across the two Columbia River crossings in week 3 falls to 0.95 or less of the matched baseline, and the drop exceeds two standard deviations of normal day-to-day variation. At 0.98 or above, traffic merely diverted.",
    verdict: "too-early",
  },
];

/** Shown wherever a verdict appears. Not a footnote. */
export const TEMPORARY_CAVEAT = {
  heading: "This is a five-week closure, not a freeway removal.",
  body: [
    "People behave differently when they know a disruption ends. For five weeks you can defer a trip, take vacation, work from home, or put up with a longer drive. You do not move house, change jobs, or buy a transit pass — and those are the adjustments that would matter most if these lanes were gone for good.",
    "That cuts both ways, and we do not know which way it cuts harder. A temporary closure can make traffic look like it evaporated when the trips were only postponed. It can equally understate the long-run effect, because the durable changes that drive most reduced demand never get a chance to happen in five weeks.",
    "So this closure can settle whether either side's extreme case is wrong. It cannot settle the $2 billion question. Anyone who tells you it did — in either direction — is selling something.",
  ],
} as const;

/** The open invitation, published before the closure. */
export const INVITATION = {
  heading: "An open invitation, before September 11",
  body: "ODOT has put a number on the record. We have pre-registered the opposing hypothesis from published positions rather than attributing a figure to anyone who has not stated one. If you speak for ODOT, for No More Freeways, for Albina Vision Trust, or for anyone else with a stake here, and you want a specific prediction scored against this method, send it with a date and we will publish it alongside the others — before the closure begins, not after.",
  contact: "/contact",
} as const;
