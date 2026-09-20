import Link from "next/link";
import { ArrowUpRight, BookOpen, ChevronDown, Download, MessageSquareWarning, Printer, SearchX } from "lucide-react";
import type { RaceSheet } from "@/lib/voters-guide/race-sheet";
import { glossary } from "@/lib/voters-guide/race-sheet/glossary";
import { councilDisagreements } from "@/lib/voters-guide/council-record-accounts";
import { REVIEW_LABEL } from "@/lib/voters-guide/types";
import styles from "./about.module.css";
import c from "./controls.module.css";

/**
 * The About strip: three short blocks a reader may want before or after
 * scanning (how to vote, what this Council can do, how the list was made),
 * then the standards links and the glossary. Two dates are printed on
 * purpose: the research was reviewed on one day and the overlay lines carry
 * their own edition stamp.
 */
export default function AboutStrip({ sheet }: { sheet: RaceSheet }) {
  const { race, ballot } = sheet;
  const votesPath = `/voters-guide/${race.id}/votes`;
  return (
    <section id="about" className={styles.about} aria-labelledby="about-title">
      <h2 id="about-title" className={styles.title}>
        About this race
      </h2>

      <div className={styles.blocks}>
        <div className={styles.block}>
          <h3 className={styles.blockTitle}>How to vote</h3>
          {ballot ? (
            <p>
              <strong>{ballot.text}</strong> {ballot.note}{" "}
              <span className={styles.dates}>Ballots mail October 14; return by 8 p.m. November 3.</span>
            </p>
          ) : (
            <p>
              <strong>{race.method}.</strong> Follow the instructions on your official ballot.{" "}
              <span className={styles.dates}>Ballots mail October 14; return by 8 p.m. November 3.</span>
            </p>
          )}
          {ballot && (
            <a href={ballot.source.url} className={`${c.btn} ${c.quiet} ${c.small}`}>
              How ranked choice works <ArrowUpRight size={14} aria-hidden="true" />
            </a>
          )}
        </div>

        <div className={styles.block}>
          <h3 className={styles.blockTitle}>What this Council can do</h3>
          <p>{race.authority}</p>
        </div>

        <div className={styles.block}>
          <h3 className={styles.blockTitle}>How this list was made</h3>
          <p>
            Same questions for everyone, A–Z. Each chip is our short reading of a sourced statement; tap it for the
            sentence and the source. We do not endorse, rank or score. The four featured votes are this district’s
            most reported, most divided Council decisions; the{" "}
            <Link href={votesPath} className={c.inlineLink}>
              Votes page
            </Link>{" "}
            has all {councilDisagreements.length}.
          </p>
          <p className={styles.edition}>
            Research reviewed {REVIEW_LABEL} · lines edition {sheet.version} · AI-assisted, human review pending.
          </p>
        </div>
      </div>

      <ul className={`${c.row} ${styles.links}`}>
        <li>
          <Link href="/voters-guide/methodology" className={`${c.btn} ${c.quiet} ${c.small}`}>
            <BookOpen size={15} aria-hidden="true" /> Standards
          </Link>
        </li>
        <li>
          <Link href="/voters-guide/methodology#corrections" className={`${c.btn} ${c.quiet} ${c.small}`}>
            <MessageSquareWarning size={15} aria-hidden="true" /> Suggest a correction
          </Link>
        </li>
        <li>
          <Link href="/voters-guide/methodology#coverage" className={`${c.btn} ${c.quiet} ${c.small}`}>
            <SearchX size={15} aria-hidden="true" /> Research gaps
          </Link>
        </li>
        <li>
          <Link href={`/voters-guide/${race.id}/print`} prefetch={false} className={`${c.btn} ${c.quiet} ${c.small}`}>
            <Printer size={15} aria-hidden="true" /> Print everything
          </Link>
        </li>
        <li>
          <Link href="/voters-guide/evidence" prefetch={false} className={`${c.btn} ${c.quiet} ${c.small}`}>
            <Download size={15} aria-hidden="true" /> Evidence export
          </Link>
        </li>
      </ul>

      <details className={styles.terms}>
        <summary className={`${c.btn} ${c.quiet} ${c.small}`}>
          Terms explained <ChevronDown size={16} aria-hidden="true" className={styles.termsCaret} />
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
