import Link from "next/link";
import { CalendarDays } from "lucide-react";
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
 * Used only when the district overlay has not been authored yet. The
 * authored line (content/districts.ts) always wins once it exists.
 */
const NEIGHBORHOOD_FALLBACK: Record<string, string> = {
  "portland-district-3": "Inner Southeast Portland",
  "portland-district-4": "West side and Sellwood",
};

const RANKED_CHOICE_GUIDE = "https://multco.us/info/ranked-choice-voting-rcv";

function DistrictCard({ sheet }: { sheet: RaceSheet }) {
  const { race } = sheet;
  const short = shortRaceTitle(race);
  const numeral = short.match(/\d+/)?.[0] ?? "";
  const neighborhoods =
    sheet.district?.neighborhoods ?? NEIGHBORHOOD_FALLBACK[race.id] ?? null;
  const lookupUrl = sheet.district?.mapUrl ?? officialSources.myVote;
  const count = sheet.rows.length;
  const headingId = `district-${race.id}`;

  return (
    <li className={styles.card}>
      <article aria-labelledby={headingId}>
        <div className={styles.cardHead}>
          <span className={styles.numeral} aria-hidden="true">
            {numeral}
          </span>
          <div className={styles.cardTitle}>
            <p className={styles.cardEyebrow}>Portland City Council</p>
            <h2 id={headingId}>
              <Link
                href={`/voters-guide/${race.id}`}
                className={styles.cardLink}
              >
                {short}
              </Link>
            </h2>
          </div>
        </div>
        <p className={styles.cardMeta}>
          {count} candidates · {race.seats} seats · ranked choice
        </p>
        <ul className={styles.mosaic} aria-label={`${short} candidates`}>
          {sheet.rows.map((row) => (
            <li key={row.id} className={styles.mosaicItem} title={row.name}>
              <CandidatePortrait person={{ id: row.id, name: row.name, portrait: row.portrait } as never} compact />
              <span className={styles.srOnly}>{row.name}</span>
            </li>
          ))}
        </ul>
        {neighborhoods ? <p className={styles.neighborhoods}>{neighborhoods}</p> : null}
        <div className={styles.chipBlock}>
          <p className={styles.chipLabel}>Jump straight to one issue</p>
          <ul
            className={styles.chips}
            aria-label={`${short} candidates by issue`}
          >
            {issues.map((issue) => (
              <li key={issue.id}>
                <Link
                  href={`/voters-guide/${race.id}#issue=${issue.id}`}
                  className={styles.chip}
                >
                  {issue.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div className={styles.cardFoot}>
          <Link href={`/voters-guide/${race.id}`} className={styles.cta}>
            See every candidate{" "}
            <span className={styles.arrow} aria-hidden="true">
              →
            </span>
          </Link>
          <a
            href={lookupUrl}
            className={styles.lookup}
            rel="noopener noreferrer"
          >
            Not sure? Look up your district{" "}
            <span aria-hidden="true">↗</span>
          </a>
        </div>
      </article>
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
              <a href={officialSources.myVote} rel="noopener noreferrer">
                Check your registration <span aria-hidden="true">↗</span>
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
        <Link href="/voters-guide/methodology#coverage">
          Coverage and gaps <span aria-hidden="true">→</span>
        </Link>
      </p>

      <section className={styles.districts} aria-labelledby="districts-title">
        <div className={styles.sectionHead}>
          <p className={styles.eyebrow}>On your ballot</p>
          <h2 id="districts-title" className={styles.sectionTitle}>
            Which district am I in?
          </h2>
        </div>
        <div className={styles.mapRow}>
          <div className={styles.mapCol}>
            <DistrictMap
              published={sheets.map((s) => Number(shortRaceTitle(s.race).match(/\d+/)?.[0]) as 1 | 2 | 3 | 4)}
              hrefFor={(d) => `/voters-guide/portland-district-${d}`}
              labels={{ 3: "Inner SE", 4: "West side" }}
            />
            <DistrictMapSource />
          </div>
          <ul className={styles.cards}>
            {sheets.map((sheet) => (
              <DistrictCard key={sheet.race.id} sheet={sheet} />
            ))}
          </ul>
        </div>
        <p className={styles.alsoOnBallot}>
          The uncontested City Auditor race is also on the Portland ballot.
        </p>
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
