import type { MissingState, PrimaryStatement, RoleOverride } from "../types";
import { packs } from "./packs";

/**
 * Row roles (≤6 words) for every published candidate whose `background`
 * runs past six words. Each role is clipped from the background field only:
 * it may drop clauses, never add a fact. Candidates whose background is
 * already ≤6 words use `clampRole()` in the builder and are not listed.
 * Incumbency is written as text ("Incumbent councilor") so every row has
 * the same shape; no badge, no numeral.
 */
const councilRoles: RoleOverride[] = [
  /* ── District 3 ─────────────────────────────────────────────────── */
  { candidateId: "ali-beaudoin", role: "Tax and business consultant", from: "background" },
  { candidateId: "cristal-otero", role: "Social-work and government-administration professional", from: "background" },
  { candidateId: "darren-mccormick", role: "Writer and discussion organizer", from: "background" },
  { candidateId: "guy-frankenstein", role: "Human-rights graduate student", from: "background" },
  { candidateId: "heart-free-pham", role: "Campus safety officer; former teacher", from: "background" },
  { candidateId: "joel-corcoran", role: "Lawyer; former Council policy counsel", from: "background" },
  { candidateId: "john-sweeney", role: "Mechanical designer; former parks worker", from: "background" },
  { candidateId: "keir-legree", role: "Art-glass business manager and founder", from: "background" },
  { candidateId: "kellie-torres", role: "Portland Parks external-affairs manager", from: "background" },
  { candidateId: "kenneth-kent-r-landgraver-iii", role: "Instrument technician; National Guard veteran", from: "background" },
  { candidateId: "larry-kelly", role: "Chef with a biochemistry degree", from: "background" },
  { candidateId: "martin-ward", role: "Holds a political-science master’s degree", from: "background" },
  { candidateId: "patrick-hilton", role: "Building operations manager", from: "background" },
  { candidateId: "steve-novick", role: "Incumbent councilor; former city commissioner", from: "background" },
  { candidateId: "terry-parker", role: "Retired customer-relations professional", from: "background" },
  { candidateId: "tiffany-koyama-lane", role: "Incumbent councilor; former teacher, union organizer", from: "background" },
  /* ── District 4 ─────────────────────────────────────────────────── */
  { candidateId: "eli-arnold", role: "Bicycle police officer; military veteran", from: "background" },
  { candidateId: "eric-zimmerman", role: "Incumbent councilor; National Guard officer", from: "background" },
  { candidateId: "jamey-evenstar", role: "City Council chief of staff", from: "background" },
  { candidateId: "jayne-cronlund", role: "Small-business owner; former nonprofit executive", from: "background" },
  { candidateId: "john-j-goldsmith", role: "Security officer; former Justice Department analyst", from: "background" },
  { candidateId: "josh-leake", role: "Housing-finance professional and business owner", from: "background" },
  { candidateId: "mitch-green", role: "Incumbent councilor; economist, Army veteran", from: "background" },
  { candidateId: "olivia-clark", role: "Incumbent councilor; former TriMet public-affairs director", from: "background" },
  { candidateId: "timothy-tj-anderson", role: "Student and disability advocate", from: "background" },
];

/**
 * The two canonical missing states. Both render with one visual treatment.
 * "filing-only": a policy statement exists only in the City filing (quoted on tap).
 * "no-platform": background only; the card carries the existing `missing` sentence.
 * Any other candidate with a `missing` field falls through to the builder's default.
 */
const councilMissing: Record<string, MissingState> = {
  "darren-mccormick": "filing-only",
  "john-j-goldsmith": "no-platform",
};

/**
 * One source chip per published candidate, chosen explicitly (never `sources[0]`,
 * which is the City register for three people). Preference order: the county
 * pamphlet page (URL carries #page=), then the campaign site, then a
 * questionnaire, then the City filing. The City candidate register is never
 * used. Every URL is verified to exist in that candidate's evidence pool.
 */
const pamphlet = (page: number) =>
  `https://multco.us/file/multnomah_county_voters%27_pamphlet_-_november_2026_general_election/download#page=${page}`;

const councilPrimary: PrimaryStatement[] = [
  /* ── District 3 ─────────────────────────────────────────────────── */
  // Beaudoin's only statement in the pool is a public post (no pamphlet, site or questionnaire).
  {
    candidateId: "ali-beaudoin",
    sourceUrl:
      "https://www.linkedin.com/posts/ali-beaudoin-75b9558_meet-the-candidates-for-city-council-district-activity-7503657810526846979-aEnb",
  },
  { candidateId: "angelita-morillo", sourceUrl: pamphlet(56) },
  { candidateId: "cristal-otero", sourceUrl: pamphlet(59) },
  // McCormick: filing only (no pamphlet statement, no campaign site).
  {
    candidateId: "darren-mccormick",
    sourceUrl: "https://www.portland.gov/auditor/elections/documents/mccormick-darren-2026-aud-120/download#page=4",
  },
  { candidateId: "esther-leon", sourceUrl: pamphlet(60) },
  // Frankenstein: questionnaire only.
  {
    candidateId: "guy-frankenstein",
    sourceUrl: "https://www.portlandmercury.com/news/meet-the-candidates-for-city-council-district-3/",
  },
  // Pham: no pamphlet statement; campaign site (first listed issue page).
  { candidateId: "heart-free-pham", sourceUrl: "https://fightwithheartpdx.com/homelessness" },
  { candidateId: "joel-corcoran", sourceUrl: pamphlet(56) },
  { candidateId: "john-sweeney", sourceUrl: pamphlet(53) },
  { candidateId: "keir-legree", sourceUrl: pamphlet(59) },
  { candidateId: "kellie-torres", sourceUrl: pamphlet(58) },
  { candidateId: "kenneth-kent-r-landgraver-iii", sourceUrl: pamphlet(60) },
  // Tucker: questionnaire only.
  {
    candidateId: "kimberly-tucker",
    sourceUrl: "https://www.portlandmercury.com/news/meet-the-candidates-for-city-council-district-3/",
  },
  { candidateId: "larry-kelly", sourceUrl: pamphlet(54) },
  { candidateId: "martin-ward", sourceUrl: pamphlet(55) },
  { candidateId: "matthias-hallett", sourceUrl: pamphlet(58) },
  { candidateId: "patrick-hilton", sourceUrl: pamphlet(57) },
  { candidateId: "steve-novick", sourceUrl: pamphlet(57) },
  { candidateId: "terry-parker", sourceUrl: pamphlet(55) },
  { candidateId: "tiffany-koyama-lane", sourceUrl: pamphlet(54) },
  { candidateId: "tom-sollitt", sourceUrl: pamphlet(53) },
  /* ── District 4 ─────────────────────────────────────────────────── */
  { candidateId: "eli-arnold", sourceUrl: pamphlet(65) },
  { candidateId: "eric-zimmerman", sourceUrl: pamphlet(64) },
  { candidateId: "jamey-evenstar", sourceUrl: pamphlet(64) },
  { candidateId: "jayne-cronlund", sourceUrl: pamphlet(63) },
  { candidateId: "jeremy-beausoleil-smith", sourceUrl: pamphlet(61) },
  // Goldsmith: no pamphlet statement, no site; the amended City filing is the only statement.
  {
    candidateId: "john-j-goldsmith",
    sourceUrl:
      "https://www.portland.gov/auditor/elections/documents/goldsmith-john-2026-aud-120-amendment-redacted/download#page=4",
  },
  { candidateId: "john-mcdonald", sourceUrl: pamphlet(63) },
  { candidateId: "josh-leake", sourceUrl: pamphlet(66) },
  { candidateId: "matt-schulte", sourceUrl: pamphlet(61) },
  { candidateId: "mitch-green", sourceUrl: pamphlet(62) },
  { candidateId: "olivia-clark", sourceUrl: pamphlet(62) },
  { candidateId: "timothy-tj-anderson", sourceUrl: pamphlet(65) },
];

export const roleOverrides: RoleOverride[] = [...councilRoles, ...packs.flatMap((p) => p.roles)];
export const missingStates: Record<string, MissingState> = Object.assign({}, councilMissing, ...packs.map((p) => p.missing));
export const primaryStatements: PrimaryStatement[] = [...councilPrimary, ...packs.flatMap((p) => p.primary)];
