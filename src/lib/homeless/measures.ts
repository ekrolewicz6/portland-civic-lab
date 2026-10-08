/**
 * The three ways Multnomah County's homeless population is measured, defined once.
 *
 * Every page that shows a count should say which of these it is and what date it
 * describes. The by-name list and the Point-in-Time count use different methods and
 * cannot be compared one to one, and the difference between them should not be read as
 * a change in homelessness (Dr. Minji Cho, PSU Homelessness Research & Action
 * Collaborative, October 5 and 8, 2026). Sources and verbatim quotes:
 * research/homelessness-data-2026-10/sources.md.
 */

export type Measure = {
  id: "pit" | "byName" | "hic" | "chronic";
  name: string;
  /** The newest figure, with its date. */
  latest: string;
  /** What it counts, in plain words. */
  what: string;
  /** What a reader must know before comparing it with anything else. */
  caveat: string;
  /** Keys into SOURCES in data.ts. */
  sources: string[];
};

export const MEASURES: Measure[] = [
  {
    id: "pit",
    name: "Point-in-Time count",
    latest: "10,526 people on January 22, 2025: 3,614 sheltered and 6,912 unsheltered.",
    what: "A federal count, required at least every two years, of everyone homeless on one night in late January: in emergency shelter, transitional housing or a Safe Haven (sheltered), or outdoors, in a vehicle or another place not meant for living (unsheltered).",
    caveat: "In 2025 the county added 5,090 people it presumed were unsheltered, drawn from its service records, to the 1,822 counted on the street that night, so 2025 is not directly comparable with earlier counts. Unsheltered counts are required only in odd years, so 2025 stays the latest official figure until the January 2027 count.",
    sources: ["pitHic", "hudPopSub2025"],
  },
  {
    id: "byName",
    name: "By-name list",
    latest: "About 18,000 people in January 2026, about 8,800 of them unsheltered.",
    what: "The county’s monthly roster of everyone in its homeless services database: people who stayed in a shelter, met an outreach worker, signed up for housing or used certain day centers. People leave it when they are housed, after a stretch without contact, or when they die.",
    caveat: "It covers everyone in contact with services over months, so it runs well above a one-night count and is a different measure; the gap between the two may come from the methods alone and is not evidence that homelessness grew. County staff said in September 2026 that people will drop off after 60 to 90 days without contact instead of 90 to 180, removing about 3,500 people and restating the list back to January 2024. The county’s dashboard was offline for maintenance as of October 7, 2026.",
    sources: ["byName", "opbByName2026", "byNameMethodChange"],
  },
  {
    id: "hic",
    name: "Housing Inventory Count",
    latest: "4,187 emergency shelter, Safe Haven and transitional beds on January 22, 2025.",
    what: "HUD’s inventory, taken the same January night, of beds set aside for homeless people, from shelter to rapid rehousing and permanent supportive housing.",
    caveat: "It counts beds that exist, not beds that are empty, and it predates the shelter closures in the county’s 2026–27 budget. PSU’s statewide report, which uses the data as first submitted to the state, lists 4,008.",
    sources: ["hudHic2025", "hracStatewide2025"],
  },
  {
    id: "chronic",
    name: "Chronically homeless",
    latest: "5,158 people, 49% of the January 2025 count (41% in 2023).",
    what: "HUD’s term for someone with a disabling condition who has been homeless continuously for a year, or at least four times in three years adding up to a year, while living outside, in a shelter or in a Safe Haven.",
    caveat: "People in transitional housing are never counted as chronically homeless.",
    sources: ["hudPopSub2025"],
  },
];
