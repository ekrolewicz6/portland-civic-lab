import { portlandRaces } from "./portland";
import { portraits } from "./portraits";

/** Explicit publication boundary. Other researched races remain unpublished. */
export const races = portlandRaces
  .filter((race) =>
    ["portland-district-3", "portland-district-4"].includes(race.id),
  )
  .map((race) => ({
    ...race,
    candidates: race.candidates.map((person) => ({
      ...person,
      portrait: portraits[person.id],
    })),
  }));
export const candidateCount = races.reduce(
  (n, r) => n + r.candidates.length,
  0,
);
export const profileCount = races.reduce(
  (n, r) => n + r.candidates.filter((c) => !c.missing).length,
  0,
);
export const findRace = (id: string) => races.find((r) => r.id === id);
