import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, MapPin } from "lucide-react";
import { findRace, races } from "@/lib/voters-guide/published";
import { buildRaceSheet, clientSheet, shortRaceTitle } from "@/lib/voters-guide/race-sheet";
import { raceMetadata, raceStructuredData } from "@/lib/voters-guide/race-sheet/seo";
import RaceSheet from "@/components/race-sheet/RaceSheet";
import FourVotes from "@/components/race-sheet/FourVotes";
import Stakes from "@/components/race-sheet/Stakes";
import AboutStrip from "@/components/race-sheet/AboutStrip";
import Lede from "@/components/race-sheet/Lede";
import RaceSheetStructuredData from "@/components/race-sheet/RaceSheetStructuredData";
import styles from "./race-page.module.css";
import c from "@/components/race-sheet/controls.module.css";

/**
 * One screen per race. The masthead is four facts and a district name; the
 * grid of candidates is the page. Everything a reader might want to know
 * before they scan (how ranked choice works, what Council can do, how the
 * list was made) lives one screen down in the About strip, and the choice
 * paragraph folds to two lines on a phone so names are visible on the first
 * screen. See research/voters-guide-2026/design/race-sheet.md.
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

const NUMBER_WORDS: Record<string, string> = {
  one: "1", two: "2", three: "3", four: "4", five: "5", six: "6", seven: "7", eight: "8", nine: "9", ten: "10",
};

/**
 * The ranking limit as a numeral, read from the sourced instruction ("You
 * rank up to six candidates…"), never from the seat count. Null when the
 * instruction does not state one; the facts strip then shows the method.
 */
function rankLimit(text: string | undefined): string | null {
  const word = text?.match(/rank up to (\w+)/i)?.[1]?.toLowerCase();
  if (!word) return null;
  return NUMBER_WORDS[word] ?? (/^\d+$/.test(word) ? word : null);
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
  const limit = rankLimit(sheet.ballot?.text);

  return (
    <div className={styles.page}>
      <RaceSheetStructuredData data={raceStructuredData(race)} />

      <header className={styles.masthead}>
        <div className={styles.mastTop}>
          <Link className={`${c.btn} ${c.quiet} ${c.small} ${styles.back}`} href="/voters-guide" prefetch={false}>
            <ArrowLeft size={15} aria-hidden="true" /> All races
          </Link>
          <p className={`${styles.eyebrow} ${sheet.office.group === "council" ? "" : styles.eyebrowKeep}`}>
            {sheet.office.body} · November 3, 2026
          </p>
        </div>

        <div className={styles.mastGrid}>
          <div className={styles.mastMain}>
            <h1 className={styles.title}>
              <span className={styles.srOnly}>Portland City Council, </span>
              {short}
            </h1>

            <dl className={styles.facts} aria-label="This race at a glance">
              <div>
                <dd>{sheet.rows.length}</dd>
                <dt>Candidates</dt>
              </div>
              <div>
                <dd>{race.seats}</dd>
                <dt>Seats</dt>
              </div>
              {limit ? (
                <div>
                  <dd>{limit}</dd>
                  <dt>Rank up to</dt>
                </div>
              ) : (
                <div>
                  <dd className={styles.factWord}>{race.method.split(/[;·]/)[0].trim()}</dd>
                  <dt>Method</dt>
                </div>
              )}
              <div>
                <dd>Nov 3</dd>
                <dt>Due 8 p.m.</dt>
              </div>
            </dl>

            {sheet.district && (
              <p className={styles.where}>
                <MapPin size={15} aria-hidden="true" />
                <span className={styles.whereText}>{sheet.district.neighborhoods}</span>
                <span className={styles.whereShort}>{sheet.district.neighborhoods.split(":")[0]}</span>
                {other && (
                  <Link href={`/voters-guide/${other.id}`} prefetch={false} className={styles.otherRace}>
                    <span className={styles.otherLong}>Not yours? </span>
                    {other.short} <ArrowRight size={13} aria-hidden="true" />
                  </Link>
                )}
              </p>
            )}
          </div>

          <Lede text={sheet.choice.text} reviewed={sheet.choice.reviewed} />
        </div>
      </header>

      <RaceSheet sheet={clientSheet(sheet)} />

      <Stakes sheet={sheet} />

      {sheet.office.hasCouncilRecord && <FourVotes sheet={sheet} />}

      <AboutStrip sheet={sheet} />
    </div>
  );
}
