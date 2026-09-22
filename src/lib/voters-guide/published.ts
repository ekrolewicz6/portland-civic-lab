import { races as researched } from "./index";
import { portraits } from "./portraits";
import { withCouncilAnalysis } from "./council-analysis";
import { withCouncilDecisions } from "./council-decisions";
import { packs } from "./race-sheet/content/packs";
import { officeOf } from "./race-sheet/office";
import type { Candidate, Race } from "./types";
import type { RacePack } from "./race-sheet/types";

/**
 * Explicit publication boundary. A race is public only when its id is
 * listed here; every other researched race returns 404. The council races
 * carry their analysis in council-analysis.ts; every other office carries
 * its analysis, portraits and overlay lines in a race pack under
 * race-sheet/content/packs, filled to the same standard.
 */
export const PUBLISHED_RACE_IDS = [
  // Portland City Council
  "portland-district-3",
  "portland-district-4",
  // On every Portland ballot
  "portland-auditor",
  "multnomah-chair",
  "multnomah-district-2",
  "multnomah-auditor",
  "multnomah-sheriff",
  "oregon-governor",
  "oregon-us-senate",
  "oregon-house-1",
  "oregon-house-3",
  "oregon-house-5",
  // The rest of the metro area and the state
  "oregon-house-2",
  "oregon-house-4",
  "oregon-house-6",
  "oregon-state-senate-13",
  "oregon-state-senate-15",
  "oregon-state-senate-16",
  "oregon-state-senate-17",
  "oregon-state-senate-19",
  "oregon-state-senate-20",
  "oregon-state-senate-24",
  "oregon-state-senate-26",
  "oregon-state-house-26",
  "oregon-state-house-29",
  "oregon-state-house-40",
  "oregon-state-house-51",
  "oregon-state-house-52",
  "washington-chair",
  "washington-district-4",
  "clackamas-position-2",
  "clackamas-position-4",
  "clackamas-sheriff",
  "clackamas-clerk",
  "clackamas-treasurer",
  "gresham-mayor",
  "gresham-position-2",
  "gresham-position-4",
  "gresham-position-6",
  "beaverton-position-1",
  "hillsboro-ward-1",
  "hillsboro-ward-2",
  "hillsboro-ward-3",
  "tigard-mayor",
  "tigard-council",
  "lake-oswego-council",
  "oregon-city-mayor",
  "oregon-city-commission",
] as const;

const packAnalysis = Object.assign({}, ...packs.map((p) => p.analysis)) as Record<string, Candidate["analysis"]>;
const packPortraits = Object.assign({}, ...packs.map((p) => p.portraits)) as typeof portraits;
const packProfiles = Object.assign({}, ...packs.map((p) => p.profiles)) as RacePack["profiles"];

/** Non-council candidates: the pack's analysis and portrait, when research has landed them. */
function withRaceAnalysis(person: Candidate): Candidate {
  const analysis = packAnalysis[person.id];
  const portrait = packPortraits[person.id] ?? person.portrait;
  const profile = packProfiles[person.id];
  const { missing: _closedGap, ...rest } = person;
  const base = profile ? { ...rest, ...profile } : person;
  return {
    ...base,
    portrait,
    ...(analysis ? { analysis, sources: [...person.sources, ...analysis.sources.filter((s) => !person.sources.some((x) => x.url === s.url))] } : {}),
  };
}

const order = new Map(PUBLISHED_RACE_IDS.map((id, i) => [id, i]));

export const races: Race[] = researched
  .filter((race) => order.has(race.id as (typeof PUBLISHED_RACE_IDS)[number]))
  .sort((a, b) => order.get(a.id as never)! - order.get(b.id as never)!)
  .map((race) =>
    officeOf(race).group === "council"
      ? {
          ...race,
          candidates: race.candidates.map((person) =>
            withCouncilDecisions(
              withCouncilAnalysis({
                ...person,
                portrait: portraits[person.id],
              }),
            ),
          ),
        }
      : { ...race, candidates: race.candidates.map(withRaceAnalysis) },
  );

export const candidateCount = races.reduce((n, r) => n + r.candidates.length, 0);
export const profileCount = races.reduce((n, r) => n + r.candidates.filter((c) => !c.missing).length, 0);
export const findRace = (id: string) => races.find((r) => r.id === id);
