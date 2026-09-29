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
import { indexLabel, onPortlandBallot } from "@/lib/voters-guide/race-sheet/office";
import { scaleFor, type BodyScale, type ScaleTier } from "@/lib/voters-guide/race-sheet/scale";
import ScaleHeader from "@/components/voters-guide/ScaleHeader";
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
  /* Closest to home first: the Portland ballot, then the rest of the region, then the seats outside
     the city. Each block is one body; Congress and the Legislature each split into the districts that
     cover Portland and the rest. Every race lands in exactly one block; a body this list does not name
     falls through to a final group rather than vanishing. */
  const bodyOf = (s: RaceSheet) => (s.office.body === "Portland City Council" ? "City of Portland" : s.office.body);
  /* Within a body: the executive seat, then district or position seats, then the other offices. */
  const seatRank = (s: RaceSheet) => {
    const m = s.office.mark;
    if (s.office.group === "council") return 0;
    if (m === "GOV" || m === "MAYOR" || m === "CHAIR" || m === "SEN") return 0;
    if (/^(D|P|W|OR-|SD |HD )/.test(m)) return m.startsWith("HD") ? 2 : 1;
    if (m === "CNCL") return 3;
    return { SHF: 4, AUD: 5, CLK: 6, TRS: 7 }[m] ?? 8;
  };
  const bodySheets = (body: string) =>
    sheets.filter((s) => bodyOf(s) === body).sort((a, b) => seatRank(a) - seatRank(b) || raceNumber(a) - raceNumber(b));
  const byId = (ids: string[]) => ids.map((id) => sheets.find((s) => s.race.id === id)).filter((s): s is RaceSheet => Boolean(s));
  /* The congressional seats on Portland ballots, the district that covers most of the city first. */
  const PORTLAND_CONGRESS = ["oregon-us-senate", "oregon-house-3", "oregon-house-1", "oregon-house-5"];
  /* The state Senate districts that reach into Portland (office.ts keeps the same list). */
  const PORTLAND_SENATE = sheets.filter((s) => s.office.group === "legislature" && onPortlandBallot(s.race)).map((s) => s.race.id);
  const outside = (ids: string[]) => (s: RaceSheet) => !ids.includes(s.race.id);
  type Block = { id: string; body: string; label: string; tier: ScaleTier; scale: BodyScale | null; sheets: RaceSheet[] };
  const block = (body: string, bs: RaceSheet[], opts: { id?: string; label?: string; scale?: boolean } = {}): Block => ({
    id: opts.id ?? `body-${body.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`,
    body,
    label: opts.label ?? body,
    tier: scaleFor(body)?.tier ?? "city",
    scale: opts.scale === false ? null : scaleFor(body),
    sheets: bs,
  });
  type Group = { id: string; eyebrow: string; title: string; blocks: Block[] };
  const groups: Group[] = [
    {
      id: "ballot-portland",
      eyebrow: "Start here",
      title: "The Portland ballot",
      blocks: [
        block("City of Portland", bodySheets("City of Portland")),
        block("Multnomah County", bodySheets("Multnomah County")),
        block("State of Oregon", bodySheets("State of Oregon")),
        block("U.S. Congress", byId(PORTLAND_CONGRESS), { label: "U.S. Congress · the seats on Portland ballots" }),
        block("Oregon Legislature", byId(PORTLAND_SENATE), { label: "Oregon Legislature · the Senate districts inside Portland" }),
      ],
    },
    { id: "ballot-gresham", eyebrow: "East Multnomah County", title: "Gresham", blocks: [block("City of Gresham", bodySheets("City of Gresham"))] },
    {
      id: "ballot-washington-county",
      eyebrow: "West of Portland",
      title: "Washington County",
      blocks: ["Washington County", "City of Beaverton", "City of Hillsboro", "City of Tigard"].map((b) => block(b, bodySheets(b))),
    },
    {
      id: "ballot-clackamas-county",
      eyebrow: "South and east of Portland",
      title: "Clackamas County",
      blocks: ["Clackamas County", "City of Lake Oswego", "City of Oregon City"].map((b) => block(b, bodySheets(b))),
    },
    {
      id: "ballot-oregon",
      eyebrow: "Beyond the city",
      title: "The rest of the Legislature and the delegation",
      blocks: [
        block("Oregon Legislature", bodySheets("Oregon Legislature").filter(outside(PORTLAND_SENATE)), { id: "body-oregon-legislature-more", label: "Oregon Legislature · districts outside Portland", scale: false }),
        block("U.S. Congress", bodySheets("U.S. Congress").filter(outside(PORTLAND_CONGRESS)), { id: "body-u-s-congress-more", label: "U.S. Congress · districts outside Portland", scale: false }),
      ],
    },
  ];
  const placed = new Set(groups.flatMap((g) => g.blocks.flatMap((b) => b.sheets.map((s) => s.race.id))));
  const leftover = sheets.filter((s) => !placed.has(s.race.id));
  if (leftover.length) {
    groups.push({
      id: "ballot-more",
      eyebrow: "Also covered",
      title: "More races",
      blocks: [...new Set(leftover.map(bodyOf))].map((b) => block(b, leftover.filter((s) => bodyOf(s) === b))),
    });
  }
  const shown = groups.map((g) => ({ ...g, blocks: g.blocks.filter((b) => b.sheets.length) })).filter((g) => g.blocks.length);

  /* The Portland ballot, one line per office, the seats as links; then one line of jumps for everyone else. */
  const ballotIndex = [
    { label: "City of Portland", races: bodySheets("City of Portland") },
    { label: "Multnomah County", races: bodySheets("Multnomah County") },
    { label: "Oregon", races: bodySheets("State of Oregon") },
    { label: "U.S. Congress", races: byId(PORTLAND_CONGRESS) },
    { label: "Legislature", races: byId(PORTLAND_SENATE) },
  ].filter((g) => g.races.length);
  /* The index row for everyone else: one short jump per group. */
  const INDEX_LABEL: Record<string, string> = { "ballot-oregon": "Other districts", "ballot-more": "More races" };
  const elsewhere = shown.filter((g) => g.id !== "ballot-portland").map((g) => ({ id: g.id, label: INDEX_LABEL[g.id] ?? g.title }));
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
            <Link href="/deep-dives/campaign-finance" className={styles.heroFinance}>
              Follow the money in the council races <ArrowRight size={16} aria-hidden="true" />
            </Link>

            <nav className={styles.ballotIndex} aria-label="Jump to your ballot">
              <p className={styles.ballotIndexTitle}>Jump to your ballot</p>
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
                {elsewhere.length > 0 && (
                  <div className={styles.ballotIndexRow}>
                    <dt>Elsewhere</dt>
                    <dd>
                      {elsewhere.map((g) => (
                        <a key={g.id} href={`#${g.id}`} className={styles.ballotIndexLink}>
                          {g.label}
                        </a>
                      ))}
                    </dd>
                  </div>
                )}
              </dl>
              <a href="#ladder-title" className={styles.ballotIndexMore}>
                All {sheets.length} races we cover, closest to home first ↓
              </a>
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

      <aside className={styles.financeSpotlight} aria-labelledby="finance-spotlight-title">
        <div>
          <p className={styles.eyebrow}>Campaign finance · Districts 3 and 4</p>
          <h2 id="finance-spotlight-title">Who is paying for these races?</h2>
          <p>Compare what candidates raised, see who gave, and follow where the money went.</p>
        </div>
        <div className={styles.financeSpotlightLinks}>
          <Link href="/deep-dives/campaign-finance" className={styles.financeSpotlightPrimary}>
            Explore the money <ArrowRight size={16} aria-hidden="true" />
          </Link>
          <Link href="/deep-dives/campaign-finance/suppliers" className={styles.financeSpotlightSecondary}>
            Who campaigns paid <ArrowRight size={15} aria-hidden="true" />
          </Link>
        </div>
      </aside>

      <section className={styles.districts} aria-labelledby="ladder-title">
        <div className={styles.sectionHead}>
          <p className={styles.eyebrow}>Every race we cover, closest to home first</p>
          <h2 id="ladder-title" className={styles.sectionTitle}>
            {sheets.length} races. <em>Start with yours.</em>
          </h2>
          <p className={styles.ladderNote}>
            Each body’s bar is its adopted budget on a log scale, with its source, so you can see how much money the seat controls. Colors mark levels of government, never sides.
          </p>
        </div>

        {shown.map(({ id, eyebrow, title, blocks }) => (
          <div key={id} className={styles.tier} id={id}>
            <div className={styles.tierHead}>
              <p className={styles.eyebrow}>{eyebrow}</p>
              <h3 className={styles.tierTitle}>{title}</h3>
            </div>
            {blocks.map(({ id: blockId, body, label, tier, scale, sheets: bs }) => (
              <div key={blockId} className={styles.bodyBlock} id={blockId}>
                <ScaleHeader body={label} tier={tier} scale={scale} races={bs.length} candidates={bs.reduce((n, x) => n + x.rows.length, 0)} />
                <ul className={`${styles.cards} ${body === "City of Portland" ? "" : styles.cardsMany}`}>
                  {bs.map((sheet) => (
                    <DistrictCard key={sheet.race.id} sheet={sheet} />
                  ))}
                </ul>
                {body === "City of Portland" && (
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
                      <h4 className={styles.mapTitle}>Which Council district am I in?</h4>
                      <p>Tap your part of the map. Districts 1 and 2 don’t elect councilors until 2028.</p>
                      <a href={officialSources.myVote} rel="noopener noreferrer">
                        Not sure? Look up your district <span aria-hidden="true">↗</span>
                      </a>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        ))}
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
