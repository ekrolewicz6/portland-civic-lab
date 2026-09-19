import type { Metadata } from "next";
import type { Candidate, Race } from "../types";
import { missingStates, roleOverrides } from "./content/roles";
import { byName, shortRaceTitle } from "./index";
import type { MissingState } from "./types";

/**
 * Metadata, share-image copy and structured data for the Race Sheet routes.
 *
 * One template per route type, filled the same way for every race and every
 * candidate: nobody gets a longer title, a warmer description or a portrait
 * in the share card. The og:image / twitter:image for each route come from
 * the segment's own `opengraph-image.tsx` automatically (see
 * `src/lib/page-meta.ts`), so nothing here sets `images`.
 *
 * The site origin lives here (and is re-exported by `../metadata`) so the
 * hub's share cards can derive their district copy from these templates
 * without an import cycle.
 */

export const GUIDE_ORIGIN = "https://www.portlandciviclab.org";

const SITE = "Portland Civic Lab";
const HUB_PATH = "/voters-guide";
const HUB_LABEL = "2026 Portland Voter Guide";

/** The Race Sheet's publication and last-modified dates, reported on every route. */
export const RACE_SHEET_PUBLISHED = "2026-09-19";
export const RACE_SHEET_MODIFIED = "2026-09-19";

/** Election day, as it appears in copy and in the share artwork. */
export const ELECTION_DAY = "November 3, 2026";

/* ── Paths ──────────────────────────────────────────────────────────── */

export function racePath(race: Race) {
  return `${HUB_PATH}/${race.id}`;
}
export function candidatePath(race: Race, person: Candidate) {
  return `${racePath(race)}/${person.id}`;
}
export function votesPath(race: Race) {
  return `${racePath(race)}/votes`;
}
export function printPath(race: Race) {
  return `${racePath(race)}/print`;
}
export const absoluteUrl = (path: string) => `${GUIDE_ORIGIN}${path}`;

/* ── Race facts shared by copy and artwork ──────────────────────────── */

const NUMBER_WORDS = ["zero", "one", "two", "three", "four", "five", "six", "seven", "eight", "nine"];

export function districtNumber(race: Race): string | null {
  const m = race.title.match(/District (\d+)/);
  return m ? m[1] : null;
}

/** The facts every Race Sheet artefact quotes, computed once from the race object. */
export function raceFacts(race: Race) {
  const count = race.candidates.length;
  return {
    short: shortRaceTitle(race),
    district: districtNumber(race),
    count,
    seats: race.seats,
    seatsWord: NUMBER_WORDS[race.seats] ?? String(race.seats),
    /** "21 candidates · 3 seats · November 3, 2026" */
    strapline: `${count} candidate${count === 1 ? "" : "s"} · ${race.seats} seat${race.seats === 1 ? "" : "s"} · ${ELECTION_DAY}`,
  };
}

/** The row's role line, identical to the Race Sheet's: an authored ≤6-word override or the first clause of `background`. */
export function candidateRole(person: Candidate): string {
  const override = roleOverrides.find((r) => r.candidateId === person.id)?.role;
  if (override) return override;
  const clause = person.background.split(/[;.]/)[0].trim();
  const words = clause.split(/\s+/);
  return words.length <= 6 ? clause : `${words.slice(0, 6).join(" ")}…`;
}

/* ── Copy templates ─────────────────────────────────────────────────── */

/** Cut `text` to at most `max` characters on a word boundary, marking the cut with an ellipsis. */
export function clip(text: string, max: number): string {
  const clean = text.trim();
  if (clean.length <= max) return clean;
  const head = clean.slice(0, max - 1);
  const cut = head.lastIndexOf(" ");
  return `${(cut > max * 0.5 ? head.slice(0, cut) : head).replace(/[\s,;:]+$/, "")}…`;
}

/** Meta description lengths that render whole in search results. */
const DESCRIPTION_MIN = 140;
const DESCRIPTION_MAX = 160;
/** How much of a candidate's one-line summary the description may quote. */
const SUMMARY_QUOTE_MAX = 90;

export function raceTitle(race: Race) {
  const { short, count } = raceFacts(race);
  return `Portland City Council ${short} Voter Guide 2026: All ${count} Candidates`;
}

/** 157 characters for a two-digit candidate count, so the whole sentence renders in search results. */
export function raceDescription(race: Race) {
  const { short, count } = raceFacts(race);
  return `All ${count} Portland City Council ${short} candidates on one page: what they say on rent, safety, taxes and streets, how councilors voted, sources. Nonpartisan.`;
}

export function candidateTitle(race: Race, person: Candidate) {
  return `${person.name} for Portland City Council ${raceFacts(race).short} | 2026 Voter Guide`;
}

/**
 * The row's missing state, by the same rule `buildRaceSheet` applies: an
 * authored override first, otherwise a `missing` sentence with any priorities
 * or values is "filing-only" and one without is "no-platform".
 */
export function candidateMissingState(person: Candidate): MissingState | null {
  if (person.id in missingStates) return missingStates[person.id];
  if (!person.missing) return null;
  return person.priorities.length || person.analysis?.values?.length ? "filing-only" : "no-platform";
}

/**
 * The same sentence for everyone, plus up to 90 characters of their one-line
 * summary, labelled as ours. The quote is shortened further only so the whole
 * description stays within 160 characters; long names get a shorter quote,
 * never a different sentence. A candidate in a missing state gets one fixed
 * sentence for that state instead of a quote, so a research gap is never
 * presented as a summary of the candidate.
 */
export function candidateDescription(race: Race, person: Candidate) {
  const tail = " No endorsements.";
  const missing = candidateMissingState(person);
  if (missing) {
    const lead = `${person.name} for Portland City Council ${raceFacts(race).short} (2026). `;
    const state =
      missing === "filing-only"
        ? "Filing statement only in the sources we reviewed; a gap, not a position."
        : "No platform found in the sources we reviewed; a gap, not a position.";
    return `${lead}${state}${tail}`;
  }
  const lead = `${person.name} for Portland City Council ${raceFacts(race).short} (2026). Our summary: `;
  const room = DESCRIPTION_MAX - lead.length - tail.length;
  let quote = clip(person.summary, Math.min(SUMMARY_QUOTE_MAX, room));
  if (!/[.!?…]$/.test(quote)) quote = `${quote}.`;
  let text = `${lead}${quote}${tail}`;
  if (text.length < DESCRIPTION_MIN) text = `${text.slice(0, -tail.length)} Sources included; no endorsements.`;
  return text;
}

export function votesTitle(race: Race) {
  return `How ${raceFacts(race).short} Councilors Voted | Portland Voter Guide 2026`;
}

export function votesDescription(race: Race) {
  const { short } = raceFacts(race);
  return `Every split vote among the sitting ${short} councilors on Portland City Council since January 2025: the question decided, each vote, and their stated reasons.`;
}

export function printTitle(race: Race) {
  return `Print Edition: Portland City Council ${raceFacts(race).short} | 2026 Voter Guide`;
}

export function printDescription(race: Race) {
  const { short } = raceFacts(race);
  return `The complete Portland City Council ${short} research edition for printing: every candidate brief, every featured Council vote and every source, on paper.`;
}

/* ── Share-image alt text ───────────────────────────────────────────── */

/**
 * The race and votes images keep a static `alt` export, so those two describe
 * the card without the district number; candidate images carry a per-name
 * alt via `generateImageMetadata`. No image URL is ever hand-built from a
 * segment path: a production build serves every image under a hashed path
 * that only the og:image meta tag knows, so JSON-LD carries no `image`.
 */
export const RACE_IMAGE_ALT =
  "Portland City Council district voter guide, November 3, 2026: every candidate on one page. A cream card with the district number on a deep green panel. Free and nonpartisan, from Portland Civic Lab.";

export const VOTES_IMAGE_ALT =
  "How this district's Portland City Council members voted: every split vote since January 2025, with reasons. A cream card with the district number on a deep green panel. Portland Civic Lab.";

export function candidateImageAlt(race: Race, person: Candidate) {
  const { short } = raceFacts(race);
  return `${person.name}, ${candidateRole(person)}. Candidate brief for Portland City Council ${short}, ${ELECTION_DAY}. Typographic card, no photograph. Free and nonpartisan, from Portland Civic Lab.`;
}

/* ── Metadata ───────────────────────────────────────────────────────── */

function base(title: string, description: string, path: string, extra: Partial<Metadata> = {}): Metadata {
  const url = absoluteUrl(path);
  return {
    title: { absolute: title },
    description,
    alternates: { canonical: url },
    openGraph: { title, description, url, siteName: SITE, type: "website", locale: "en_US" },
    twitter: { card: "summary_large_image", title, description },
    ...extra,
  };
}

export function raceMetadata(race: Race): Metadata {
  return base(raceTitle(race), raceDescription(race), racePath(race));
}

export function candidateMetadata(race: Race, person: Candidate): Metadata {
  return base(candidateTitle(race, person), candidateDescription(race, person), candidatePath(race, person));
}

export function votesMetadata(race: Race): Metadata {
  return base(votesTitle(race), votesDescription(race), votesPath(race));
}

export function printMetadata(race: Race): Metadata {
  return base(printTitle(race), printDescription(race), printPath(race), {
    robots: { index: false, follow: true },
  });
}

/* ── Structured data ────────────────────────────────────────────────── */

type Crumb = { name: string; item: string };

const organization = { "@type": "Organization", name: SITE, url: GUIDE_ORIGIN } as const;
const website = { "@type": "WebSite", name: SITE, url: GUIDE_ORIGIN } as const;

function breadcrumbList(id: string, trail: Crumb[]) {
  return {
    "@type": "BreadcrumbList",
    "@id": id,
    itemListElement: trail.map((entry, i) => ({ "@type": "ListItem", position: i + 1, ...entry })),
  };
}

function raceTrail(race: Race): Crumb[] {
  return [
    { name: SITE, item: GUIDE_ORIGIN },
    { name: HUB_LABEL, item: absoluteUrl(HUB_PATH) },
    { name: `Portland City Council ${raceFacts(race).short}`, item: absoluteUrl(racePath(race)) },
  ];
}

function webPage(path: string, name: string, description: string, extra: Record<string, unknown> = {}) {
  const url = absoluteUrl(path);
  return {
    "@type": "WebPage",
    "@id": `${url}#page`,
    url,
    name,
    description,
    inLanguage: "en-US",
    isAccessibleForFree: true,
    datePublished: RACE_SHEET_PUBLISHED,
    dateModified: RACE_SHEET_MODIFIED,
    isPartOf: website,
    publisher: organization,
    breadcrumb: { "@id": `${url}#breadcrumb` },
    ...extra,
  };
}

/** The same job title for every candidate in a race. */
function candidateJobTitle(race: Race) {
  const { district } = raceFacts(race);
  return district ? `Candidate for Portland City Council, District ${district}` : `Candidate for ${race.title}`;
}

function personNode(race: Race, person: Candidate) {
  const url = absoluteUrl(candidatePath(race, person));
  return { "@type": "Person", "@id": `${url}#person`, name: person.name, url, jobTitle: candidateJobTitle(race) };
}

/** Race page: WebPage + BreadcrumbList + an explicitly unordered ItemList of candidates, A–Z. */
export function raceStructuredData(race: Race) {
  const url = absoluteUrl(racePath(race));
  const { short } = raceFacts(race);
  const people = [...race.candidates].sort(byName);
  return {
    "@context": "https://schema.org",
    "@graph": [
      webPage(racePath(race), raceTitle(race), raceDescription(race), {
        mainEntity: { "@id": `${url}#candidates` },
      }),
      breadcrumbList(`${url}#breadcrumb`, raceTrail(race)),
      {
        "@type": "ItemList",
        "@id": `${url}#candidates`,
        name: `Candidates for Portland City Council ${short}, alphabetical`,
        description: `Every certified candidate for Portland City Council ${short} on the ${ELECTION_DAY} ballot, listed alphabetically by displayed name. No ranking, score or endorsement.`,
        itemListOrder: "https://schema.org/ItemListUnordered",
        numberOfItems: people.length,
        itemListElement: people.map((person, i) => ({
          "@type": "ListItem",
          position: i + 1,
          item: personNode(race, person),
        })),
      },
    ],
  };
}

/**
 * Candidate page: Person + WebPage + BreadcrumbList. The Person carries no
 * image: only some candidates have a portrait, and a richer result for that
 * subset would break equal treatment.
 */
export function candidateStructuredData(race: Race, person: Candidate) {
  const url = absoluteUrl(candidatePath(race, person));
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        ...personNode(race, person),
        description: person.summary,
        mainEntityOfPage: { "@id": `${url}#page` },
      },
      webPage(candidatePath(race, person), candidateTitle(race, person), candidateDescription(race, person), {
        mainEntity: { "@id": `${url}#person` },
      }),
      breadcrumbList(`${url}#breadcrumb`, [...raceTrail(race), { name: person.name, item: url }]),
    ],
  };
}

/** Votes page: WebPage + BreadcrumbList. */
export function votesStructuredData(race: Race) {
  const url = absoluteUrl(votesPath(race));
  return {
    "@context": "https://schema.org",
    "@graph": [
      webPage(votesPath(race), votesTitle(race), votesDescription(race)),
      breadcrumbList(`${url}#breadcrumb`, [...raceTrail(race), { name: "Council votes", item: url }]),
    ],
  };
}
