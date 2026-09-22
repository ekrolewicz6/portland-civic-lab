"use client";
import { useCallback } from "react";
import Link from "next/link";
import { ChevronDown, Info, Vote } from "lucide-react";
import type { SheetRow, TopicDecision } from "@/lib/voters-guide/race-sheet";
import type { ExtraTopic } from "@/lib/voters-guide/race-sheet/types";
import type { Office } from "@/lib/voters-guide/race-sheet/office";
import CandidatePortrait from "@/components/voters-guide/CandidatePortrait";
import { portraitPerson, SourceChipButton } from "./CandidateCard";
import { Gap, SaidGlyph, VotePill } from "./Glyph";
import styles from "./boards.module.css";
import c from "./controls.module.css";

/**
 * The office's own choices, one board per topic beneath the grid. Each board
 * is a disclosure row: the label, the plain question, and how many of the
 * field are on record (naming who is missing when the field is small). Open,
 * it lists every candidate A–Z with the recorded vote or our short reading
 * as a static pill, the sentence, and the source; a gap is a one-line row
 * that says so. Nothing here needs a click to read, and nothing scrolls
 * sideways: a topic is one question and N answers, which is a list.
 */

const NUMBER = ["zero", "one", "two", "three", "four", "five", "six", "seven", "eight", "nine", "ten", "eleven", "twelve"];
const numberWord = (n: number) => NUMBER[n] ?? String(n);

/** Who is on record, and the sentence that says so at a glance. */
function coverageLine(rows: SheetRow[], topicId: string) {
  const on = rows.filter((r) => r.topicCells[topicId]?.vote || r.topicCells[topicId]?.chip);
  const off = rows.filter((r) => !(r.topicCells[topicId]?.vote || r.topicCells[topicId]?.chip));
  const head = `${on.length} of ${rows.length} on record`;
  if (off.length === 0) return { head, tail: null };
  if (off.length <= 3) return { head, tail: `Not found: ${off.map((r) => r.name).join(", ")}` };
  if (on.length > 0 && on.length <= 3) return { head, tail: `On record: ${on.map((r) => r.name).join(", ")}` };
  return { head, tail: null };
}

function Board({
  topic,
  rows,
  raceId,
  decision,
  open,
  onToggle,
}: {
  topic: ExtraTopic;
  rows: SheetRow[];
  raceId: string;
  decision: TopicDecision | null;
  open: boolean;
  onToggle: (id: string, open: boolean) => void;
}) {
  const coverage = coverageLine(rows, topic.id);
  const id = `topic-${topic.id}`;
  return (
    <details
      className={styles.board}
      id={id}
      open={open || undefined}
      data-topic={topic.id}
      onToggle={(event) => {
        const next = event.currentTarget.open;
        if (next !== open) onToggle(topic.id, next);
      }}
    >
      <summary className={styles.summary} aria-describedby={`${id}-coverage`}>
        <ChevronDown className={styles.chevron} size={16} aria-hidden="true" />
        <span className={styles.summaryText}>
          <span className={styles.boardLabel}>{topic.label}</span>
          <span className={styles.boardQuestion}>{topic.question}</span>
        </span>
        <span className={styles.coverage} id={`${id}-coverage`}>
          <span className={styles.coverageHead}>{coverage.head}</span>
          {coverage.tail && <span className={styles.coverageTail}>{coverage.tail}</span>}
        </span>
      </summary>
      <div className={styles.body}>
        <p className={styles.context}>
          <Info size={14} aria-hidden="true" />
          <span>{topic.context}</span>
        </p>
        <ol className={styles.rows} aria-label={`Every candidate on ${topic.label.toLowerCase()}, A to Z`}>
          {rows.map((row) => {
            const tc = row.topicCells[topic.id];
            const acted = Boolean(tc.source && tc.source.evidence.kind === "Public record");
            const state = tc.vote ? "vote" : tc.chip ? (tc.stance === "partial" ? "partial" : "chip") : "gap";
            return (
              <li key={row.id} className={styles.row} id={`${id}-${row.id}`} data-state={state}>
                <div className={styles.who}>
                  <span className={styles.portrait}>
                    <CandidatePortrait person={portraitPerson(row)} compact />
                  </span>
                  <span className={styles.identity}>
                    <Link href={`/voters-guide/${raceId}/${row.id}`} prefetch={false} className={styles.name}>
                      {row.name}
                    </Link>
                    <span className={styles.role}>{row.role}</span>
                  </span>
                </div>
                <div className={styles.reading}>
                  {tc.vote && <VotePill vote={tc.vote} name={row.name} />}
                  {tc.chip && <span className={styles.chip}>{tc.chip}</span>}
                  {!tc.vote && !tc.chip && (
                    <span className={c.gapNote}>
                      <Gap text="" /> {tc.askedOn ? "Asked, no reply yet" : "Not found"}
                    </span>
                  )}
                </div>
                <div className={styles.answer}>
                  {tc.vote && decision && (
                    <div className={styles.voteBlock}>
                      <p className={styles.answerLabel}>
                        <Vote size={13} aria-hidden="true" /> Recorded vote
                      </p>
                      <p className={styles.voteLine}>
                        <span className={styles.voteOn}>{decision.voteLabel ?? decision.title}</span>
                        <SourceChipButton chip={decision.source} compact />
                      </p>
                    </div>
                  )}
                  {tc.text ? (
                    <>
                      <p className={styles.answerLabel}>
                        {acted ? <Vote size={13} aria-hidden="true" /> : <SaidGlyph />}
                        {acted ? "What they did" : "What they said"}
                      </p>
                      <p className={styles.text}>{tc.text}</p>
                      <p className={styles.meta}>
                        {tc.source && <SourceChipButton chip={tc.source} compact />}
                        <span className={styles.note}>
                          {acted
                            ? "A recorded action; our summary of the official record."
                            : tc.stance === "partial"
                              ? "On the topic; the exact choice is unsaid. Our paraphrase."
                              : "Our paraphrase of the candidate’s statement."}
                        </span>
                      </p>
                    </>
                  ) : (
                    <p className={styles.gapText}>
                      {tc.askedOn
                        ? `Nothing on this choice in their sources; we asked the campaign on ${tc.askedOn}.`
                        : tc.vote
                          ? "No statement beyond the recorded vote; a research gap, not a position."
                          : "Nothing on this exact choice in the sources we reviewed; a research gap, not a position."}
                    </p>
                  )}
                </div>
              </li>
            );
          })}
        </ol>
      </div>
    </details>
  );
}

export default function TopicBoards({
  topics,
  rows,
  raceId,
  office,
  decisions,
  open,
  onChange,
}: {
  topics: ExtraTopic[];
  rows: SheetRow[];
  raceId: string;
  office: Office;
  decisions: Record<string, TopicDecision>;
  /** Ids of the open boards; mirrored into the hash by the parent. */
  open: string[];
  onChange: (next: string[]) => void;
}) {
  const toggle = useCallback(
    (id: string, next: boolean) => {
      onChange(next ? [...open.filter((x) => x !== id), id] : open.filter((x) => x !== id));
    },
    [open, onChange],
  );
  if (topics.length === 0) return null;
  const all = open.length === topics.length;
  const whose =
    office.group === "council"
      ? "this Council has faced"
      : office.group === "state"
        ? `the next ${office.memberWord} faces`
        : office.group === "legislature"
          ? "the 2027 Legislature faces"
          : office.group === "federal"
            ? "Congress faces"
            : office.group === "county"
              ? `${office.body} faces`
              : office.group === "city"
                ? `the ${office.body} faces`
                : "this office faces";

  return (
    <section id="topics" className={styles.boards} aria-labelledby="topics-title">
      <div className={styles.head}>
        <div className={styles.headText}>
          <p className={styles.eyebrow}>Where they stand · {numberWord(topics.length)} more choices</p>
          <h2 id="topics-title" className={styles.title}>
            {topics.length === 1 ? "One choice" : `${numberWord(topics.length)[0].toUpperCase()}${numberWord(topics.length).slice(1)} choices`} {whose}
          </h2>
          <p className={styles.intro}>
            One question at a time: every candidate’s answer, A–Z, with its source. Open all to see who has said
            nothing about what.
          </p>
        </div>
        <button
          type="button"
          className={`${c.btn} ${c.quiet} ${c.small}`}
          aria-pressed={all}
          onClick={() => onChange(all ? [] : topics.map((t) => t.id))}
        >
          {all ? "Close all" : `Open all ${topics.length}`}
        </button>
      </div>
      {topics.map((topic) => (
        <Board
          key={topic.id}
          topic={topic}
          rows={rows}
          raceId={raceId}
          decision={decisions[topic.id] ?? null}
          open={open.includes(topic.id)}
          onToggle={toggle}
        />
      ))}
    </section>
  );
}
