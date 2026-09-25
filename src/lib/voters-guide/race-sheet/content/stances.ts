import type { StanceChip } from "../types";
import { packs } from "./packs";

/**
 * Grid chips: one per filled analysis.issues slot, shortened from the same
 * PUBLISHED position as the issue line in lines.ts (and agreeing with it).
 *
 * Rules applied to every chip:
 * - 2–4 words, ≤26 characters; a noun phrase or short imperative naming
 *   the candidate's stated approach. Never a judgment, a side label or a
 *   comparison with other candidates.
 * - Where a position has two parts, the chip carries the part the candidate
 *   leads with; the full sentence stays one tap away on the card.
 * - Standards and emphases (Beaudoin, Landgraver, Tucker on money) name the
 *   standard, never a commitment or a cuts claim.
 * - Plain words: zoning, permitting, PCEF, term sheet and the rest of the
 *   §9 list appear only glossed within the four words.
 * - No quoted candidate language for McCormick.
 * Alphabetical by candidate id within each race, then by issue.
 */

const reviewed = { reviewedBy: "pending", reviewedOn: "2026-09-19" } as const;

const chip = (candidateId: string, issue: StanceChip["issue"], text: string): StanceChip => ({
  candidateId,
  issue,
  chip: text,
  from: `analysis.issues.${issue}.position`,
  ...reviewed,
});

const councilChips: StanceChip[] = [
  /* ── Portland City Council, District 3 ─────────────────────────────── */

  chip("ali-beaudoin", "housing", "Supply and buyer help"),
  chip("ali-beaudoin", "safety", "Match response to problem"),
  chip("ali-beaudoin", "climate", "Fix basics, keep bikes"),
  chip("ali-beaudoin", "money", "Test programs first"),

  chip("joel-corcoran", "money", "Independent budget office"),
  chip("joel-corcoran", "climate", "Expand public utilities"),

  chip("guy-frankenstein", "money", "Large companies pay more"),

  chip("matthias-hallett", "housing", "Faster building permits"),
  chip("matthias-hallett", "safety", "Two officers per 1,000"),
  chip("matthias-hallett", "money", "Audits and spending limits"),

  chip("patrick-hilton", "housing", "Reuse existing buildings"),
  chip("patrick-hilton", "safety", "Safe sleeping plus rules"),
  chip("patrick-hilton", "money", "Vacancy and polluter taxes"),

  chip("larry-kelly", "housing", "More housing choices"),
  chip("larry-kelly", "safety", "Street Response, treatment"),
  chip("larry-kelly", "money", "Easier for small business"),

  chip("tiffany-koyama-lane", "housing", "Publicly owned housing"),
  chip("tiffany-koyama-lane", "money", "Fund public services"),
  chip("tiffany-koyama-lane", "climate", "Zero traffic deaths"),

  chip("kenneth-kent-r-landgraver-iii", "money", "Dollars for people’s work"),

  chip("esther-leon", "housing", "Accelerate social housing"),
  chip("esther-leon", "safety", "24/7 Street Response"),
  chip("esther-leon", "money", "Land-value, vacancy taxes"),
  chip("esther-leon", "climate", "Bikeways, car-free plazas"),

  chip("darren-mccormick", "safety", "More police and jail"),

  chip("angelita-morillo", "housing", "Tenant rights"),
  chip("angelita-morillo", "safety", "Street Response, oversight"),
  chip("angelita-morillo", "money", "Fair Moda deal"),
  chip("angelita-morillo", "climate", "Transit, bikes, sidewalks"),

  chip("steve-novick", "housing", "Faster permits, investment"),
  chip("steve-novick", "safety", "Property-crime detectives"),
  chip("steve-novick", "money", "Cut Council office budgets"),
  chip("steve-novick", "climate", "Clean-energy fund transit"),

  chip("cristal-otero", "housing", "Rentals into co-ops"),
  chip("cristal-otero", "safety", "Response plus prevention"),
  chip("cristal-otero", "money", "Measure results first"),
  chip("cristal-otero", "climate", "Climate fund for climate"),

  chip("terry-parker", "safety", "Police and fire staffing"),
  chip("terry-parker", "money", "Streets and parks first"),
  chip("terry-parker", "climate", "No 82nd bus lanes"),

  chip("heart-free-pham", "housing", "Hemp-block construction"),
  chip("heart-free-pham", "safety", "Treatment and consequences"),
  chip("heart-free-pham", "money", "Cost-benefit before taxes"),

  chip("tom-sollitt", "housing", "Preserve homes first"),
  chip("tom-sollitt", "safety", "Match responder to call"),
  chip("tom-sollitt", "money", "Audits before new taxes"),
  chip("tom-sollitt", "climate", "Maintain before building"),

  chip("john-sweeney", "housing", "Build to the price"),
  chip("john-sweeney", "safety", "Homelessness to the County"),
  chip("john-sweeney", "money", "No Blazers spending"),


  chip("keir-legree", "housing", "More supply, public homes"),

  chip("keir-legree", "safety", "Police, shelter, results"),

  chip("keir-legree", "money", "Cheaper project delivery"),

  chip("keir-legree", "climate", "Balanced streets, measured"),
  chip("kellie-torres", "housing", "4,000 homes a year"),
  chip("kellie-torres", "safety", "Police follow-through"),
  chip("kellie-torres", "money", "Partnerships, philanthropy"),
  chip("kellie-torres", "climate", "Parks, trails and habitat"),

  chip("kimberly-tucker", "safety", "More officers, specialists"),
  chip("kimberly-tucker", "money", "Cost-benefit analysis"),

  chip("martin-ward", "housing", "Test government housing"),
  chip("martin-ward", "safety", "More officers, cameras"),
  chip("martin-ward", "money", "No Moda renovation, cuts"),

  /* ── Portland City Council, District 4 ─────────────────────────────── */

  chip("timothy-tj-anderson", "housing", "Investment, reused assets"),
  chip("timothy-tj-anderson", "safety", "Officers plus cadets"),
  chip("timothy-tj-anderson", "money", "Audit before new taxes"),
  chip("timothy-tj-anderson", "climate", "Green tech, more transit"),
  chip("eli-arnold", "housing", "Fill subsidized vacancies"),
  chip("eli-arnold", "safety", "Police-clinician teams"),
  chip("eli-arnold", "money", "Small-business tax relief"),
  chip("eli-arnold", "climate", "Phased fareless transit"),

  chip("olivia-clark", "housing", "Faster permits, lower fees"),
  chip("olivia-clark", "safety", "Remove camps, add shelter"),
  chip("olivia-clark", "money", "Small business support"),
  chip("olivia-clark", "climate", "Harden water and streets"),

  chip("jayne-cronlund", "housing", "Offices into housing"),
  chip("jayne-cronlund", "safety", "Modest police increase"),
  chip("jayne-cronlund", "money", "Living-wage jobs"),
  chip("jayne-cronlund", "climate", "Parks and natural areas"),

  chip("jamey-evenstar", "housing", "Permanent affordability"),
  chip("jamey-evenstar", "safety", "Unarmed crisis response"),
  chip("jamey-evenstar", "money", "Early transparent budgets"),
  chip("jamey-evenstar", "climate", "Cheaper youth transit"),

  chip("mitch-green", "housing", "Rents linked to income"),
  chip("mitch-green", "safety", "Expand Street Response"),
  chip("mitch-green", "money", "Invest in public assets"),
  chip("mitch-green", "climate", "Expand clean-energy fund"),

  chip("josh-leake", "housing", "Public and private funding"),
  chip("josh-leake", "safety", "Enforcement with dignity"),
  chip("josh-leake", "money", "Creative, tech industries"),

  chip("john-mcdonald", "safety", "Cap homelessness contracts"),
  chip("john-mcdonald", "money", "Modernize Moda Center"),
  chip("john-mcdonald", "climate", "Continue new I-5 bridge"),

  chip("matt-schulte", "housing", "Conversions, home sharing"),
  chip("matt-schulte", "safety", "Help navigating services"),
  chip("matt-schulte", "money", "Cap household costs"),
  chip("matt-schulte", "climate", "Safe Routes to schools"),

  chip("jeremy-beausoleil-smith", "housing", "Build social housing"),
  chip("jeremy-beausoleil-smith", "safety", "Expand Street Response"),
  chip("jeremy-beausoleil-smith", "money", "Protect clean-energy fund"),
  chip("jeremy-beausoleil-smith", "climate", "Four-year data-center ban"),

  chip("eric-zimmerman", "housing", "Build housing and shelter"),
  chip("eric-zimmerman", "safety", "Police and Street Response"),
  chip("eric-zimmerman", "money", "Against tax, fee increases"),
];

export const stanceChips: StanceChip[] = [...councilChips, ...packs.flatMap((p) => p.chips)];
