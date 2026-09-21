"use client";
import Link from "next/link";
import { ArrowRight, ExternalLink, Globe, Info, Vote, X } from "lucide-react";
import type { SheetRow, TopicDecision } from "@/lib/voters-guide/race-sheet";
import type { Issue } from "@/lib/voters-guide/race-sheet/issues";
import type { ExtraTopic } from "@/lib/voters-guide/race-sheet/types";
import CandidatePortrait from "@/components/voters-guide/CandidatePortrait";
import Ladder from "./Ladder";
import { portraitPerson, SourceChipButton } from "./CandidateCard";
import { Gap, SaidGlyph, VotePill } from "./Glyph";
import { IssueIcon } from "./IssueIcon";
import styles from "./stance.module.css";
import c from "./controls.module.css";

/**
 * What opens under a grid cell. One frame for every candidate and every
 * column: who (portrait, name, role), the question being answered, then
 * labeled cards. An issue cell shows the ladder (what, how, measured by).
 * A topic cell shows the recorded vote, if any, beside what the candidate
 * said, each with its own source. Interpretation stays labeled; the
 * candidate's words stay attributed. Gaps are named as gaps.
 */
export default function StanceDetail({
  row,
  issue,
  topic,
  decision,
  raceId,
  id,
  onClose,
}: {
  row: SheetRow;
  issue: Issue | null;
  topic?: ExtraTopic | null;
  decision?: TopicDecision | null;
  raceId: string;
  id: string;
  onClose: () => void;
}) {
  const cell = issue ? row.cells[issue.id] : null;
  const position = cell ? (cell.position ?? cell.line) : null;
  const tc = topic ? row.topicCells[topic.id] : null;
  const briefHref = `/voters-guide/${raceId}/${row.id}`;
  const question = topic ? topic.question : issue ? issue.question : null;
  const website = row.contact.channels.find((ch) => ch.kind === "website") ?? null;

  return (
    <div className={styles.detail} id={id} data-issue={issue?.id ?? "topic"}>
      <header className={styles.detailHead}>
        <span className={styles.detailPortrait}>
          <CandidatePortrait person={portraitPerson(row)} compact />
        </span>
        <div className={styles.detailWho}>
          <p className={styles.detailTitle}>
            <Link href={briefHref} prefetch={false} className={styles.detailName}>
              {row.name}
            </Link>
            <span className={styles.detailOn}>
              {" "}
              on {issue ? issue.label.toLowerCase() : topic?.label}
            </span>
          </p>
          <p className={styles.detailRole}>{row.role}</p>
        </div>
        <div className={styles.detailHeadActions}>
          {website && (
            <a href={website.url} className={`${c.btn} ${c.quiet} ${c.small}`} rel="noopener noreferrer" target="_blank">
              <Globe size={15} aria-hidden="true" /> Site <ExternalLink size={12} aria-hidden="true" />
              <span className={styles.srOnly}> (opens in a new tab)</span>
            </a>
          )}
          <Link href={briefHref} prefetch={false} className={`${c.btn} ${c.secondary} ${c.small}`}>
            Full brief <ArrowRight size={15} aria-hidden="true" />
          </Link>
          <button type="button" className={`${c.btn} ${c.icon} ${styles.detailClose}`} onClick={onClose} aria-label="Close">
            <X size={18} aria-hidden="true" />
          </button>
        </div>
      </header>

      {question && (
        <h3 className={styles.detailQuestion}>
          {issue && <IssueIcon issue={issue.id} size={18} />}
          <span>{question}</span>
        </h3>
      )}

      {topic && tc ? (
        <>
          <div className={styles.detailCards}>
            {tc.vote && (
              <section className={styles.detailCard} data-kind="vote" aria-label="Recorded Council vote">
                <p className={styles.cardLabel}>
                  <Vote size={14} aria-hidden="true" /> Recorded Council vote
                </p>
                <p className={styles.cardVote}>
                  <VotePill vote={tc.vote} />
                  {decision && <span className={styles.cardVoteOn}>{decision.voteLabel ?? decision.title}</span>}
                </p>
                <div className={styles.cardMeta}>
                  {decision && <SourceChipButton chip={decision.source} />}
                  <a href="#votes-panel" className={`${c.btn} ${c.quiet} ${c.small}`}>
                    All their votes
                  </a>
                </div>
              </section>
            )}
            {tc.text ? (
              <section className={styles.detailCard} data-kind="said" aria-label="What the candidate said">
                <p className={styles.cardLabel}>
                  <SaidGlyph /> What they said
                </p>
                <p className={styles.cardText}>{tc.text}</p>
                <div className={styles.cardMeta}>
                  {tc.source && <SourceChipButton chip={tc.source} />}
                  <span className={styles.detailNote}>Our paraphrase of the candidate’s statement.</span>
                </div>
              </section>
            ) : (
              <section className={styles.detailCard} data-kind="gap" aria-label="No statement found">
                <p className={styles.cardLabel}>
                  <SaidGlyph /> What they said
                </p>
                <p className={styles.detailGap}>
                  <span className={c.gapNote}>
                    <Gap text="" /> {tc.askedOn ? "Asked, no reply yet" : "Not in their sources"}
                  </span>
                  <span className={styles.detailGapText}>
                    {tc.askedOn
                      ? `No statement on this choice in their sources. We asked the candidate on ${tc.askedOn}.`
                      : tc.vote
                        ? "No statement about this choice beyond the recorded vote. That is a research gap, not a position."
                        : "No statement on this exact choice in the sources we reviewed. That is a research gap, not a position."}
                  </span>
                </p>
              </section>
            )}
          </div>
          <p className={styles.detailContext}>
            <Info size={14} aria-hidden="true" />
            <span>{topic.context}</span>
          </p>
        </>
      ) : issue && cell && position ? (
        <Ladder
          ladder={row.ladder[issue.id]}
          what={
            <>
              <span className={styles.rungText}>
                <SaidGlyph />
                {position}
              </span>
              {cell.source && <SourceChipButton chip={cell.source} />}
            </>
          }
        />
      ) : (
        <p className={styles.detailGap}>
          <span className={c.gapNote}>
            <Gap text="" /> Not found
          </span>
          <span className={styles.detailGapText}>Not found in the sources we reviewed. That is a research gap, not a position.</span>
        </p>
      )}

      {row.missingText && <p className={styles.detailFull}>{row.missingText}</p>}

      {row.incumbent && !topic && (
        <div className={`${c.row} ${styles.detailActions}`}>
          <a href="#votes-panel" className={`${c.btn} ${c.quiet} ${c.small}`}>
            <Vote size={15} aria-hidden="true" /> Their Council votes
          </a>
        </div>
      )}
    </div>
  );
}
