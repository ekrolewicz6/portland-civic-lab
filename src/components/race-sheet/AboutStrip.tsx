import Link from "next/link";
import { BookOpen, ChevronDown, Download, MessageSquareWarning, Printer, SearchX } from "lucide-react";
import type { RaceSheet } from "@/lib/voters-guide/race-sheet";
import { glossary } from "@/lib/voters-guide/race-sheet/glossary";
import { councilDisagreements } from "@/lib/voters-guide/council-record-accounts";
import { REVIEW_LABEL } from "@/lib/voters-guide/types";
import styles from "./brief.module.css";
import c from "./controls.module.css";

/**
 * The About strip: ≤60 words, the featured-vote rule disclosed, and the
 * glossary. Two dates are printed on purpose: the research was reviewed on
 * one day and the overlay lines carry their own edition stamp.
 */
export default function AboutStrip({ sheet }: { sheet: RaceSheet }) {
  const votesPath = `/voters-guide/${sheet.race.id}/votes`;
  return (
    <section id="about" className={styles.about} aria-labelledby="about-title">
      <h2 id="about-title" className={styles.sectionTitle}>
        About this list
      </h2>
      <p>
        Same questions, A–Z. Each chip is our short reading of a sourced statement; tap it for the
          sentence, the source and the brief. We do not endorse, rank or score. The four featured votes are this
        district’s most reported, most divided Council decisions, phrased as the question Council
        decided; the <Link href={votesPath} className={c.inlineLink}>Votes page</Link> has all {councilDisagreements.length}.
        Research reviewed {REVIEW_LABEL}; lines edition {sheet.version}, AI-assisted; human review pending.
      </p>
      <ul className={`${c.row} ${styles.aboutLinks}`}>
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
          <Link href={`/voters-guide/${sheet.race.id}/print`} prefetch={false} className={`${c.btn} ${c.quiet} ${c.small}`}>
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
