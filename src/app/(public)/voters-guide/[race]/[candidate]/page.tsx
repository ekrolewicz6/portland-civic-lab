import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { findRace, races } from "@/lib/voters-guide/published";
import { buildRaceSheet } from "@/lib/voters-guide/race-sheet";
import { candidateMetadata, candidateStructuredData } from "@/lib/voters-guide/race-sheet/seo";
import CandidateBrief from "@/components/race-sheet/CandidateBrief";
import RaceSheetStructuredData from "@/components/race-sheet/RaceSheetStructuredData";
import styles from "@/components/race-sheet/brief.module.css";

/** Segments that belong to sibling routes, never a candidate id. */
const reserved = new Set(["votes", "print"]);

type Params = Promise<{ race: string; candidate: string }>;

export function generateStaticParams() {
  return races.flatMap((race) =>
    race.candidates.map((person) => ({ race: race.id, candidate: person.id })),
  );
}

function resolve(raceId: string, candidateId: string) {
  if (reserved.has(candidateId)) return null;
  const race = findRace(raceId);
  const person = race?.candidates.find((p) => p.id === candidateId);
  return race && person ? { race, person } : null;
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { race: raceId, candidate } = await params;
  const found = resolve(raceId, candidate);
  if (!found) notFound();
  return candidateMetadata(found.race, found.person);
}

export default async function CandidatePage({ params }: { params: Params }) {
  const { race: raceId, candidate } = await params;
  const found = resolve(raceId, candidate);
  if (!found) notFound();
  const { race, person } = found;
  const sheet = buildRaceSheet(race);
  const row = sheet.rows.find((r) => r.id === person.id);
  if (!row) notFound();
  return (
    <div className={styles.page}>
      <RaceSheetStructuredData data={candidateStructuredData(race, person)} />
      <CandidateBrief race={race} person={person} row={row} sheet={sheet} />
    </div>
  );
}
