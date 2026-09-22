import Link from "next/link";
import { ArrowRight, ArrowUpRight, MapPin, SearchX } from "lucide-react";
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
import { GROUP_ORDER, groupLabel, indexLabel, onPortlandBallot, type OfficeGroup } from "@/lib/voters-guide/race-sheet/office";
import DistrictMap, { DistrictMapSource } from "@/components/voters-guide/DistrictMap";
import CandidatePortrait from "@/components/voters-guide/CandidatePortrait";
import HeroMap from "@/components/voters-guide/HeroMap";
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

/** One line above each group of races, saying whose ballot it is on. */
const GROUP_EYEBROW: Record<OfficeGroup, string> = {
  council: "On the Portland ballot",
  county: "Multnomah is on the Portland ballot · Washington and Clackamas for their residents",
  state: "On every Oregon ballot",
  federal: "By congressional district · Portland is in Districts 1, 3 and 5",
  legislature: "By legislative district · metro area",
  city: "By city · Portland's auditor, then the metro area's cities",
};

function DistrictCard({ sheet }: { sheet: RaceSheet }) {
  const { race, office } = sheet;
  const short = shortRaceTitle(race);
  const n = sheet.rows.length;
  return (
    <li className={styles.card}>
      <Link href={`/voters-guide/${race.id}`} className={styles.cardLink}>
        <div className={styles.cardHead}>
          <span className={`${styles.numeral} ${office.group === "council" ? "" : styles.mark}`} aria-hidden="true">
            {office.mark}
          </span>
          <div>
            <h3>{short}</h3>
            <p>
              {n} candidate{n === 1 ? "" : "s"} · {race.seats} seat{race.seats === 1 ? "" : "s"}
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
  const councilSheets = sheets.filter((s) => s.office.group === "council");
  const raceNumber = (s: RaceSheet) => Number(s.race.id.match(/(\d+)$/)?.[1] ?? 0);
  const groups = GROUP_ORDER.filter((g) => g !== "council")
    .map((g) => {
      const gs = sheets.filter((s) => s.office.group === g).sort((a, b) => (g === "federal" || g === "legislature" ? raceNumber(a) - raceNumber(b) : 0));
      // Within a group, one sub-heading per body when there is more than one (three counties, six cities).
      const bodies = [...new Set(gs.map((s) => s.office.body))];
      return { group: g, bodies: bodies.map((body) => ({ body, sheets: gs.filter((s) => s.office.body === body) })) };
    })
    .filter((g) => g.bodies.length);

  const ballotIndex = [
    { label: "City of Portland", races: sheets.filter((s) => onPortlandBallot(s.race) && (s.office.group === "council" || s.office.group === "city")) },
    { label: "Multnomah County", races: sheets.filter((s) => onPortlandBallot(s.race) && s.office.group === "county") },
    { label: "Oregon", races: sheets.filter((s) => onPortlandBallot(s.race) && s.office.group === "state") },
    { label: "U.S. Congress", races: sheets.filter((s) => onPortlandBallot(s.race) && s.office.group === "federal") },
  ].filter((g) => g.races.length);
  const candidateCount = sheets.reduce((n, s) => n + s.rows.length, 0);
  const seatCount = sheets.reduce((n, s) => n + s.race.seats, 0);
  const fields = councilSheets.map((s) => ({
    district: Number(shortRaceTitle(s.race).match(/\d+/)?.[0]) as 1 | 2 | 3 | 4,
    rows: s.rows,
  }));

  return (
    <div className={styles.hub}>
      <GuideStructuredData card="guide" />

      <header className={styles.hero} aria-labelledby="hub-title">
        <div className={styles.heroInner}>
          <div className={styles.heroText}>
            <p className={styles.heroEyebrow}>
              <span>Portland City Council</span> · General election · November 3, 2026
            </p>
            <h1 id="hub-title" className={styles.heroTitle}>
              Know their choices.
              <br />
              <span>Make your own.</span>
            </h1>
            <p className={styles.heroLede}>
              Every candidate on your ballot, from City Council to governor, one page per race: what they propose,
              how they would deliver it, how sitting councilors voted, and the sources behind all of it. No
              endorsements, no scores.
            </p>
            <div className={styles.heroActions}>
              {councilSheets.map((sheet) => (
                <Link key={sheet.race.id} href={`/voters-guide/${sheet.race.id}`} className={`${c.btn} ${styles.heroCta}`}>
                  Council {shortRaceTitle(sheet.race)} <ArrowRight size={16} aria-hidden="true" />
                </Link>
              ))}
              <a href="#find-district" className={`${c.btn} ${styles.heroQuiet}`}>
                <MapPin size={16} aria-hidden="true" /> Which district am I in?
              </a>
            </div>

            {/* The Portland ballot, top to bottom: one line per office, the seats as links. */}
            <nav className={styles.ballotIndex} aria-label="Races on the Portland ballot">
              <p className={styles.ballotIndexTitle}>On the Portland ballot</p>
              <dl className={styles.ballotIndexList}>
                {ballotIndex.map(({ label, races: rs }) => (
                  <div key={label} className={styles.ballotIndexRow}>
                    <dt>{label}</dt>
                    <dd>
                      {rs.map((sheet) => (
                        <Link key={sheet.race.id} href={`/voters-guide/${sheet.race.id}`} className={styles.ballotIndexLink}>
                          {indexLabel(sheet.race)}
                        </Link>
                      ))}
                    </dd>
                  </div>
                ))}
              </dl>
              {groups.length > 0 && (
                <a href={`#group-${groups[0].group}`} className={styles.ballotIndexMore}>
                  All {sheets.length} races we cover, including the rest of the metro area ↓
                </a>
              )}
            </nav>
            <dl className={styles.heroFacts}>
              <div>
                <dt>Races</dt>
                <dd>{sheets.length}</dd>
              </div>
              <div>
                <dt>Candidates</dt>
                <dd>{candidateCount}</dd>
              </div>
              <div>
                <dt>Seats</dt>
                <dd>{seatCount}</dd>
              </div>
              <div>
                <dt>Ballots mail</dt>
                <dd>Oct 14</dd>
              </div>
              <div>
                <dt>Due</dt>
                <dd>Nov 3, 8 p.m.</dd>
              </div>
            </dl>
            <p className={styles.heroRegister}>
              Registration deadline October 13.{" "}
              <a href={officialSources.myVote} rel="noopener noreferrer">
                Check your registration <ArrowUpRight size={13} aria-hidden="true" />
              </a>
            </p>
          </div>
          <div className={styles.heroArt}>
            <HeroMap fields={fields} />
            <p className={styles.heroCaption}>Every candidate, standing on the district they want to represent.</p>
          </div>
        </div>
      </header>

      {/* Each segment carries its own separator (CSS), so a dot never ends a line alone. */}
      <p className={styles.edition}>
        <strong>Working research edition</strong>
        <span>{sheets.length} races · {sheets.reduce((n, s) => n + s.rows.length, 0)} candidates</span>
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
          {councilSheets.map((sheet) => (
            <DistrictCard key={sheet.race.id} sheet={sheet} />
          ))}
        </ul>
        <div className={styles.mapBlock} id="find-district">
          <div className={styles.mapCol}>
            <DistrictMap
              published={councilSheets.map((s) => s.office.district as 1 | 2 | 3 | 4)}
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
          </div>
        </div>
      </section>

      {groups.map(({ group, bodies }) => (
        <section key={group} className={styles.districts} aria-labelledby={`group-${group}`}>
          <div className={styles.sectionHead}>
            <p className={styles.eyebrow}>{GROUP_EYEBROW[group]}</p>
            <h2 id={`group-${group}`} className={styles.sectionTitle}>
              {groupLabel(group)}
            </h2>
          </div>
          {bodies.map(({ body, sheets: bs }) => (
            <div key={body} className={styles.bodyBlock}>
              {bodies.length > 1 && <h3 className={styles.bodyTitle}>{body}</h3>}
              <ul className={`${styles.cards} ${styles.cardsMany}`}>
                {bs.map((sheet) => (
                  <DistrictCard key={sheet.race.id} sheet={sheet} />
                ))}
              </ul>
            </div>
          ))}
        </section>
      ))}

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
