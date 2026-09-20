import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, ArrowUpRight, CheckSquare, ChevronDown, MapPin } from "lucide-react";
import { findRace, races } from "@/lib/voters-guide/published";
import { buildRaceSheet, clientSheet, shortRaceTitle } from "@/lib/voters-guide/race-sheet";
import { raceMetadata, raceStructuredData } from "@/lib/voters-guide/race-sheet/seo";
import RaceSheet from "@/components/race-sheet/RaceSheet";
import FourVotes from "@/components/race-sheet/FourVotes";
import AboutStrip from "@/components/race-sheet/AboutStrip";
import RaceSheetStructuredData from "@/components/race-sheet/RaceSheetStructuredData";
import styles from "./race-page.module.css";
import c from "@/components/race-sheet/controls.module.css";

/**
 * One screen per race. The reader sees every candidate at once with one
 * short line each; issue chips swap the line in place; four featured votes
 * show how the sitting councilors split; My ballot is the reader's own.
 * Briefs, the full record and the print edition live on their own routes.
 * See research/voters-guide-2026/design/race-sheet.md.
 */

export function generateStaticParams() {
  return races.map((r) => ({ race: r.id }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ race: string }>;
}): Promise<Metadata> {
  const { race: id } = await params;
  const race = findRace(id);
  if (!race) notFound();
  return raceMetadata(race);
}

export default async function RacePage({
  params,
}: {
  params: Promise<{ race: string }>;
}) {
  const { race: id } = await params;
  const race = findRace(id);
  if (!race) notFound();
  const sheet = buildRaceSheet(race);
  const short = shortRaceTitle(race);
  const other = sheet.otherRaces[0];
  // On phones only the first sentence of the sourced ranked-choice note shows.
  const [noteFirst = "", ...noteMore] = (sheet.ballot?.note ?? "").split(/(?<=\.)\s+/);
  const noteRest = noteMore.join(" ");

  return (
    <div className={styles.page}>
      <RaceSheetStructuredData data={raceStructuredData(race)} />

      <div className={styles.top}>
      <header className={styles.header}>
        <Link className={`${c.btn} ${c.quiet} ${c.small} ${styles.back}`} href="/voters-guide" prefetch={false}>
          <ArrowLeft size={15} aria-hidden="true" /> All races
        </Link>
        <p className={styles.eyebrow}>Portland City Council · November 3, 2026</p>
        <div className={styles.titleRow}>
          <h1 className={styles.title}>
            <span className={styles.srOnly}>Portland City Council, </span>
            {short}
          </h1>
          <p className={styles.titleCount}>
            {sheet.rows.length} candidates · {race.seats} seats
          </p>
        </div>

        {sheet.district && (
          <p className={styles.district}>
            <MapPin size={15} aria-hidden="true" />
            <span className={styles.districtBody}>
              <span className={styles.districtText}>{sheet.district.neighborhoods}</span>
              {other && (
                <Link href={`/voters-guide/${other.id}`} prefetch={false} className={`${c.btn} ${c.quiet} ${c.small} ${styles.otherRace}`}>
                  Not your district? {other.short} <ArrowRight size={14} aria-hidden="true" />
                </Link>
              )}
            </span>
          </p>
        )}

        <p className={styles.howToVote}>
          <CheckSquare size={15} aria-hidden="true" />
          <span>
            {sheet.ballot ? (
              <>
                <strong>{sheet.ballot.text}</strong> {noteFirst}
                {noteRest && <span className={styles.noteRest}> {noteRest}</span>}{" "}
              </>
            ) : (
              <>
                <strong>{race.method}.</strong>{" "}
              </>
            )}
            <span className={styles.dates}>Ballots mail Oct 14; due 8 p.m. Nov 3.</span>{" "}
            {sheet.ballot && (
              <a href={sheet.ballot.source.url} className={`${c.btn} ${c.quiet} ${c.small} ${styles.sourceLink}`}>
                How it works <ArrowUpRight size={14} aria-hidden="true" />
              </a>
            )}
          </span>
        </p>
      </header>

      <section className={styles.choice} aria-labelledby="choice-title">
        <h2 id="choice-title" className={styles.choiceLabel}>
          <span className={styles.ourReading}>Our reading</span> · The choice in one paragraph
        </h2>
        <p className={styles.choiceText}>{sheet.choice.text}</p>
        {!sheet.choice.reviewed && <p className={styles.draft}>Draft; human review pending.</p>}
        <details className={styles.authority}>
          <summary className={`${c.btn} ${c.quiet} ${c.small}`}>
            What this Council can do <ChevronDown size={15} aria-hidden="true" className={styles.authorityCaret} />
          </summary>
          <p>{race.authority}</p>
          <p>
            <span className={styles.ourReading}>Our reading of the field.</span> {race.comparison}
          </p>
        </details>
      </section>
      </div>

      <RaceSheet sheet={clientSheet(sheet)} />

      <FourVotes sheet={sheet} />

      <AboutStrip sheet={sheet} />
    </div>
  );
}
