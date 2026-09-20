import Link from "next/link";
import { ChevronDown } from "lucide-react";
import type { RaceSheet } from "@/lib/voters-guide/race-sheet";
import { glossary } from "@/lib/voters-guide/race-sheet/glossary";
import { councilDisagreements } from "@/lib/voters-guide/council-record-accounts";
import { REVIEW_LABEL } from "@/lib/voters-guide/types";
import styles from "./about.module.css";
import c from "./controls.module.css";

/**
 * The About strip: three short blocks a reader may want before or after
 * scanning (how to vote, what this Council can do, how the list was made),
 * then one line of links and the glossary. Each block is two or three
 * sentences; the sourced ranked-choice note shows its first sentence only.
 * Two dates are printed on purpose: the research was reviewed on one day
 * and the overlay lines carry their own edition stamp.
 */
export default function AboutStrip({ sheet }: { sheet: RaceSheet }) {
  const { race, ballot } = sheet;
  const votesPath = `/voters-guide/${race.id}/votes`;
  const [noteFirst = ""] = (ballot?.note ?? "").split(/(?<=\.)\s+/);
  return (
    <section id="about" className={styles.about} aria-labelledby="about-title">
      <h2 id="about-title" className={styles.title}>
        About this race
      </h2>

      <div className={styles.blocks}>
        <div className={styles.block}>
          <h3 className={styles.blockTitle}>How to vote</h3>
          <p>
            {ballot ? (
              <>
                <strong>{ballot.text}</strong> {noteFirst}{" "}
                <a href={ballot.source.url} className={c.inlineLink}>
                  How it works
                </a>
              </>
            ) : (
              <>
                <strong>{race.method}.</strong> Follow the instructions on your official ballot.
              </>
            )}
          </p>
          <p className={styles.dates}>Ballots mail Oct 14 · return by 8 p.m. Nov 3</p>
        </div>

        <div className={styles.block}>
          <h3 className={styles.blockTitle}>What this Council can do</h3>
          <p>{race.authority}</p>
        </div>

        <div className={styles.block}>
          <h3 className={styles.blockTitle}>How this list was made</h3>
          <p>
            Same questions for everyone, A–Z. Each chip is our short reading of a sourced statement; we do not
            endorse, rank or score. The four featured votes are this district’s most reported, most divided
            decisions; the{" "}
            <Link href={votesPath} className={c.inlineLink}>
              Votes page
            </Link>{" "}
            has all {councilDisagreements.length}.
          </p>
          <p className={styles.edition}>
            Reviewed {REVIEW_LABEL} · lines {sheet.version} · AI-assisted, human review pending
          </p>
        </div>
      </div>

      <ul className={styles.links}>
        <li>
          <Link href="/voters-guide/methodology">Standards</Link>
        </li>
        <li>
          <Link href="/voters-guide/methodology#corrections">Suggest a correction</Link>
        </li>
        <li>
          <Link href="/voters-guide/methodology#coverage">Research gaps</Link>
        </li>
        <li>
          <Link href={`/voters-guide/${race.id}/print`} prefetch={false}>
            Print everything
          </Link>
        </li>
        <li>
          <Link href="/voters-guide/evidence" prefetch={false}>
            Evidence export
          </Link>
        </li>
      </ul>

      <details className={styles.terms}>
        <summary>
          Terms explained <ChevronDown size={14} aria-hidden="true" className={styles.termsCaret} />
        </summary>
        <dl>
          {Object.entries(glossary).map(([key, entry]) => (
            <div key={key}>
              <dt id={`glossary-${key}`}>{entry.term}</dt>
              <dd>{entry.definition}</dd>
            </div>
          ))}
        </dl>
      </details>
    </section>
  );
}
