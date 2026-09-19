import { portraits } from "./portraits";
import { filingReferences } from "./filing-references";
import { electionSource } from "./types";
import { portlandRaces } from "./portland";
import { countyRaces } from "./counties";
import { cityRaces } from "./cities";
import { stateRaces } from "./state";
import { legislativeRaces } from "./legislature";
import type { Race } from "./types";
export const races: Race[] = [
  ...portlandRaces,
  ...countyRaces,
  ...cityRaces,
  ...stateRaces,
  ...legislativeRaces,
];
// Link readers directly to the dated filings, rather than only to a moving
// “current election” search. The research validator reconciles these with the roster.
for (const race of races) {
  for (const person of race.candidates) {
    if (race.geography === "Portland") person.portrait = portraits[person.id];
    for (const [party, filingId] of filingReferences[race.id]?.[person.name] ??
      []) {
      person.sources.push(
        electionSource(
          `2026 qualified filing · ${party}`,
          `https://secure.sos.state.or.us/orestar/cfDetail.do?page=search&cfRsn=${filingId}`,
        ),
      );
    }
  }
}
export const findRace = (id: string) => races.find((r) => r.id === id);
export const candidateCount = races.reduce(
  (n, r) => n + r.candidates.length,
  0,
);
export const profileCount = races.reduce(
  (n, r) => n + r.candidates.filter((c) => !c.missing).length,
  0,
);
