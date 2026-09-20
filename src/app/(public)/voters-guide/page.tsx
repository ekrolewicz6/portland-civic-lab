import Link from "next/link";
import { ArrowUpRight, CalendarDays, SearchX } from "lucide-react";
import c from "@/components/race-sheet/controls.module.css";
import { voterGuideMetadata } from "@/lib/voters-guide/metadata";
import GuideStructuredData from "@/components/voters-guide/GuideStructuredData";
import { races } from "@/lib/voters-guide/published";
import { officialSources, REVIEW_LABEL } from "@/lib/voters-guide/types";
import {
  buildRaceSheet,
  issues,
  shortRaceTitle,
  type RaceSheet,
} from "@/lib/voters-guide/race-sheet";
import DistrictMap, { DistrictMapSource } from "@/components/voters-guide/DistrictMap";
import CandidatePortrait from "@/components/voters-guide/CandidatePortrait";
import styles from "./hub.module.css";

export const metadata = voterGuideMetadata("guide");

/**
 * Mosaic column counts that leave no ragged last row: the widest count that
 * divides the field evenly (21 candidates → 7 columns; 12 → 6 on desktop,
 * 6 on phones). Falls back to 7 on desktop and 5 on phones when nothing
 * from the allowed range divides.
 */
function mosaicColumns(count: number) {
  const pick = (options: number[], fallback: number) => options.find((n) => count % n === 0) ?? fallback;
  return {
    "--mosaic-cols": pick([8, 7, 6, 5], 7),
    "--mosaic-cols-phone": pick([7, 6, 5, 4], 5),
  } as React.CSSProperties;
}


const RANKED_CHOICE_GUIDE = "https://multco.us/info/ranked-choice-voting-rcv";

function DistrictCard({ sheet }: { sheet: RaceSheet }) {
  const { race } = sheet;
  const short = shortRaceTitle(race);
  const numeral = short.match(/\d+/)?.[0] ?? "";
  return (
    <li className={styles.card}>
      <Link href={`/voters-guide/${race.id}`} className={styles.cardLink}>
        <div className={styles.cardHead}>
          <span className={styles.numeral} aria-hidden="true">
            0{numeral}
          </span>
          <div>
            <h3>{short}</h3>
            <p>
              {sheet.rows.length} candidates · {race.seats} seats
            </p>
          </div>
          <ArrowUpRight aria-hidden="true" />
        </div>
        <div className={styles.mosaic} aria-hidden="true" style={mosaicColumns(sheet.rows.length)}>
          {sheet.rows.map((row) => (
            <CandidatePortrait key={row.id} person={{ id: row.id, name: row.name, portrait: row.portrait } as never} compact />
          ))}
        </div>
        <span className={styles.cta}>
          Explore the complete field <span aria-hidden="true">→</span>
        </span>
      </Link>
    </li>
  );
}

export default function VotersGuidePage() {
  const sheets = races.map(buildRaceSheet);
  const districtList = sheets.map((s) => shortRaceTitle(s.race));
  const districtsLabel =
    districtList.length > 1
      ? `${districtList.slice(0, -1).join(", ")} and ${districtList.at(-1)}`
      : (districtList[0] ?? "");
  const editionDistricts = districtsLabel.replace(/District /g, "").trim();

  return (
    <div className={styles.hub}>
      <GuideStructuredData card="guide" />

      <header className={styles.intro}>
        <p className={styles.eyebrow}>Portland Civic Lab / Election 2026</p>
        <div className={styles.titleRow}>
          <h1 className={styles.title}>
            Know the choice.
            <br />
            <span>Make your own.</span>
          </h1>
          <div className={styles.election}>
            <CalendarDays aria-hidden="true" size={18} />
            <div className={styles.electionText}>
              <strong>November 3, 2026</strong>
              <span>Oregon general election</span>
              <a href={officialSources.myVote} rel="noopener noreferrer" className={`${c.btn} ${c.secondary} ${c.small} ${styles.electionLink}`}>
                Check your registration <ArrowUpRight size={14} aria-hidden="true" />
              </a>
            </div>
          </div>
        </div>
        <p className={styles.lede}>
          Every City Council candidate on one page per district, what they
          propose, how sitting councilors voted, and the sources behind all of
          it.
        </p>
      </header>

      {/* Each segment carries its own separator (CSS), so a dot never ends a line alone. */}
      <p className={styles.edition}>
        <strong>Working research edition</strong>
        <span>Districts {editionDistricts}</span>
        <span>reviewed {REVIEW_LABEL}</span>
        <span className={styles.editionLong}>AI-assisted, human review not yet complete</span>
        <Link href="/voters-guide/methodology#coverage" className={`${c.btn} ${c.quiet} ${c.small} ${styles.editionLink}`}>
          <SearchX size={14} aria-hidden="true" /> Coverage and gaps
        </Link>
      </p>

      <section className={styles.districts} aria-labelledby="districts-title">
        <div className={styles.sectionHead}>
          <p className={styles.eyebrow}>On the Portland ballot</p>
          <h2 id="districts-title" className={styles.sectionTitle}>
            A city council. <em>A city’s direction.</em>
          </h2>
        </div>
        <ul className={styles.cards}>
          {sheets.map((sheet) => (
            <DistrictCard key={sheet.race.id} sheet={sheet} />
          ))}
        </ul>
        <div className={styles.mapBlock}>
          <div className={styles.mapCol}>
            <DistrictMap
              published={sheets.map((s) => Number(shortRaceTitle(s.race).match(/\d+/)?.[0]) as 1 | 2 | 3 | 4)}
              hrefFor={(d) => `/voters-guide/portland-district-${d}`}
              labels={{ 3: "Inner SE", 4: "West side" }}
            />
            <DistrictMapSource />
          </div>
          <div className={styles.mapText}>
            <h3 className={styles.mapTitle}>Which district am I in?</h3>
            <p>Tap your part of the map. Districts 1 and 2 are not yet covered.</p>
            <a href={officialSources.myVote} rel="noopener noreferrer">
              Not sure? Look up your district <span aria-hidden="true">↗</span>
            </a>
            <p className={styles.alsoOnBallot}>The uncontested City Auditor race is also on the Portland ballot.</p>
          </div>
        </div>
      </section>

      <section className={styles.voting} aria-labelledby="voting-title">
        <div className={styles.votingIntro}>
          <p className={`${styles.eyebrow} ${styles.eyebrowOnCanopy}`}>
            Before you vote
          </p>
          <h2 id="voting-title" className={styles.votingTitle}>
            Your address determines your ballot.
          </h2>
          <p className={styles.votingNote}>
            This guide helps you explore. Only your county elections office can
            confirm your district and produce your official ballot.
          </p>
          <a
            href={officialSources.myVote}
            className={styles.votingLink}
            rel="noopener noreferrer"
          >
            Find your voter information <span aria-hidden="true">↗</span>
          </a>
        </div>
        <ol className={styles.dates}>
          <li>
            <strong>October 13</strong>
            <span>Registration deadline</span>
          </li>
          <li>
            <strong>October 14</strong>
            <span>Ballot mailing begins</span>
          </li>
          <li>
            <strong>November 3 · 8 p.m.</strong>
            <span>Official drop-box deadline</span>
          </li>
        </ol>
        <p className={styles.sourceNote}>
          Dates:{" "}
          <a href={officialSources.state} rel="noopener noreferrer">
            Oregon Secretary of State
          </a>
          . For mail returns, follow the election office’s postmark and receipt
          requirements. Portland and Multnomah County contests use ranked
          choice; other contests may use different instructions.{" "}
          <a href={RANKED_CHOICE_GUIDE} rel="noopener noreferrer">
            Read the official ranked-choice guide.
          </a>
        </p>
      </section>

      <footer className={styles.foot} aria-label="About this guide">
        <ul className={styles.footLinks}>
          <li>
            <Link href="/voters-guide/methodology">Our editorial standards</Link>
          </li>
          <li>
            <Link href="/voters-guide/research-log">Research log</Link>
          </li>
          <li>
            <Link href="/voters-guide/evidence" prefetch={false}>
              Evidence export
            </Link>
          </li>
        </ul>
        <p className={styles.footNote}>
          We do not endorse, rank or score. Every candidate is listed
          alphabetically and answers the same questions.
        </p>
      </footer>
    </div>
  );
}
