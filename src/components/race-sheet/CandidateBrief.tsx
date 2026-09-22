import Link from "next/link";
import { ArrowLeft, ArrowRight, ArrowUpRight, ChevronDown, ExternalLink, Globe } from "lucide-react";
import type { Candidate, Evidence, Race } from "@/lib/voters-guide/types";
import { ELECTION_DATE } from "@/lib/voters-guide/types";
import { issuesFor, shortRaceTitle, topicsFor, type FeaturedRow, type RaceSheet, type SheetRow } from "@/lib/voters-guide/race-sheet";
import { councilDecisions } from "@/lib/voters-guide/council-decisions";
import { sourceChip, type SourceChip } from "@/lib/voters-guide/race-sheet/source-chip";
import { candidatePath, racePath } from "@/lib/voters-guide/race-sheet/seo";
import { councilDisagreements } from "@/lib/voters-guide/council-record-accounts";
import CandidatePortrait from "@/components/voters-guide/CandidatePortrait";
import ShareGuide from "@/components/voters-guide/ShareGuide";
import { SaidGlyph, VotePill } from "./Glyph";
import Term from "./Term";
import ReachCampaign from "./ReachCampaign";
import c from "./controls.module.css";
import { SourceIcon } from "./SourceIcon";
import Ladder from "./Ladder";
import { SourceChipButton } from "./CandidateCard";
import type { OwnWordsRule } from "@/lib/voters-guide/race-sheet/content/own-words";
import styles from "./brief.module.css";

/* ── Shared pieces (the glyph vocabulary itself lives in Glyph.tsx) ── */

/** "—": not found in the sources we reviewed. Identical markup for everyone. */
export function NotFound({ text = "Not found in the sources we reviewed. That is a research gap, not a position." }: { text?: string }) {
  return (
    <p className={styles.gap}>
      <span className={c.gapNote}>
        <span aria-hidden="true">—</span> Not found
      </span>
      <span className={styles.gapText}>{text}</span>
    </p>
  );
}

/** A source chip that expands to kind · date, the full citation and its provenance note. */
export function SourceLine({ chip }: { chip: SourceChip }) {
  const { evidence } = chip;
  return (
    <details className={styles.source}>
      <summary className={c.source}>
        <SourceIcon venue={chip.venue} className={c.sourceVenueIcon} />
        <span>{chip.label}</span>
        <ChevronDown size={14} aria-hidden="true" className={c.sourceCaret} />
      </summary>
      <div className={styles.sourceBody}>
        <p>
          {evidence.kind} · {evidence.date}
        </p>
        <a href={evidence.url} rel="noopener">
          {evidence.label} ↗
        </a>
        {evidence.note && <p>{evidence.note}</p>}
      </div>
    </details>
  );
}

/* ── Helpers ──────────────────────────────────────────────────────── */

function districtNumber(race: Race) {
  return race.title.match(/District (\d+)/)?.[1] ?? null;
}

/**
 * Every source behind the brief, first appearance wins, one entry per URL.
 * Roll-call records belong to the Votes route; only dated earlier statements
 * from the record are cited here.
 */
export function allSources(person: Candidate): Evidence[] {
  const pool: Evidence[] = [
    ...person.sources,
    ...(person.analysis?.sources ?? []),
    ...Object.values(person.analysis?.issues ?? {}).map((issue) => issue.source),
    ...(person.record ?? []).filter((entry) => !entry.decisionId).map((entry) => entry.source),
  ];
  const seen = new Set<string>();
  return pool.filter((source) => {
    if (seen.has(source.url)) return false;
    seen.add(source.url);
    return true;
  });
}

function votesHref(race: Race, row?: FeaturedRow) {
  const base = `${racePath(race)}/votes`;
  return row?.topicId ? `${base}#disagreement-${row.topicId}` : base;
}

type Level = 1 | 2;

/* ── The brief ────────────────────────────────────────────────────── */

/**
 * L2: 300–500 words, one skeleton for everyone, research text unchanged.
 * `embedded` (the print edition) drops the breadcrumb, share and pager and
 * steps every heading down one level under the page's own H1.
 */
/** The same disclosure for everyone: which mechanical rule picked the opening. */
const OPENING_RULE: Record<OwnWordsRule, string> = {
  "pamphlet-opening": "The verbatim opening of their voters’ pamphlet statement, the same rule for every candidate. We chose nothing.",
  "filing-opening": "No pamphlet statement was published; this is the verbatim opening of their City filing statement.",
  "site-opening": "No pamphlet statement was published; this is the verbatim opening of their campaign site’s About page.",
  "questionnaire-opening": "No pamphlet statement was published; this is the verbatim opening of their written questionnaire answer.",
  "announcement-opening": "No pamphlet statement was published; this is the verbatim opening of their campaign announcement.",
};

export default function CandidateBrief({
  race,
  person,
  row,
  sheet,
  embedded = false,
}: {
  race: Race;
  person: Candidate;
  row: SheetRow;
  sheet: RaceSheet;
  embedded?: boolean;
}) {
  const level: Level = embedded ? 2 : 1;
  const Name = level === 1 ? "h1" : "h2";
  const Section = level === 1 ? "h2" : "h3";
  const Item = level === 1 ? "h3" : "h4";
  const short = shortRaceTitle(race);
  const district = districtNumber(race);
  const issues = issuesFor(sheet.office.group);
  const districtLabel = district ? `District ${district}` : short;
  const index = sheet.rows.findIndex((r) => r.id === row.id);
  const neighbour = (at: number) => {
    const id = sheet.rows[at]?.id;
    return id ? (race.candidates.find((c) => c.id === id) ?? null) : null;
  };
  const previous = index > 0 ? neighbour(index - 1) : null;
  const next = index >= 0 ? neighbour(index + 1) : null;
  // The role line is the row's ≤6-word clamp; it earns a line here only when
  // it condenses a long background rather than restating a short one.
  const roleAddsInformation =
    Boolean(row.role) &&
    !row.background.replace(/\.$/, "").startsWith(row.role.replace(/…$/, "")) &&
    row.background.split(/\s+/).length > 10;
  const council = sheet.office.hasCouncilRecord;
  const rollCalls = (person.record ?? []).filter((entry) => !entry.decisionId && entry.source.kind === "Public record");
  const earlier = (person.record ?? []).filter((entry) => !entry.decisionId && entry.source.kind !== "Public record");
  const featured = sheet.featured
    .map((f) => ({ row: f, vote: f.votes.find((v) => v.id === person.id) }))
    .filter((x): x is { row: FeaturedRow; vote: NonNullable<FeaturedRow["votes"][number]> } => Boolean(x.vote));
  const sources = allSources(person);
  const heading = (name: string) => `${row.id}-${name}`;
  /* The office's own choices, split into what this candidate has answered and what is still open. */
  const topics = topicsFor(race);
  const answered = topics.filter((t) => row.topicCells[t.id]?.vote || row.topicCells[t.id]?.chip);
  const open = topics.filter((t) => !(row.topicCells[t.id]?.vote || row.topicCells[t.id]?.chip));
  const decisionFor = (topicId: string) => {
    const t = topics.find((x) => x.id === topicId);
    const d = t?.decisionId ? councilDecisions.find((x) => x.id === t.decisionId) : undefined;
    return d ? { label: d.voteLabel ?? d.title, source: sourceChip(d.source) } : null;
  };
  const website = row.contact.channels.find((ch) => ch.kind === "website") ?? null;

  return (
    <article className={styles.brief} id={embedded ? row.id : undefined} aria-labelledby={heading("name")}>
      {!embedded && (
        <nav aria-label="Breadcrumb">
          <ol className={styles.crumbs}>
            <li>
              <Link href="/voters-guide">Voter guide</Link>
            </li>
            <li>
              <Link href={racePath(race)}>{districtLabel}</Link>
            </li>
            <li>
              <span aria-current="page">{person.name}</span>
            </li>
          </ol>
        </nav>
      )}

      <header className={styles.head}>
        <div className={styles.portrait}>
          {/* Only the standalone brief loads its hero eagerly; the print edition embeds every brief. */}
          <CandidatePortrait person={person} priority={!embedded} />
        </div>
        <div>
          <p className={styles.eyebrow}>
            {sheet.office.short} candidate · {sheet.office.body} · {ELECTION_DATE}
          </p>
          <Name id={heading("name")} className={embedded ? styles.name : undefined}>
            {person.name}
          </Name>
          {roleAddsInformation && <p className={styles.role}>{row.role}</p>}
          <p className={styles.background}>{row.background}</p>
        </div>
        {!embedded && (
          <div className={styles.headActions}>
            {website && (
              <a href={website.url} className={`${c.btn} ${c.primary} ${styles.siteButton}`} rel="noopener noreferrer" target="_blank">
                <Globe size={16} aria-hidden="true" /> Campaign website <ExternalLink size={13} aria-hidden="true" />
                <span className={styles.srOnly}> (opens in a new tab)</span>
              </a>
            )}
            <ShareGuide title={`${person.name} · ${short} · Portland Civic Lab`} fragment="" label="Share this brief" />
            {person.portrait && (
              <a className={styles.credit} href={person.portrait.sourceUrl} rel="noopener">
                Photo: {person.portrait.credit} ↗
              </a>
            )}
          </div>
        )}
        {!embedded && (
          <div className={styles.headReach} aria-labelledby={heading("reach")}>
            <p id={heading("reach")} className={styles.label}>
              Reach the campaign
            </p>
            <ReachCampaign channels={row.contact.channels} none={row.contact.none} />
          </div>
        )}
        {embedded && person.portrait && (
          <p className={`${styles.credit} ${styles.headActions}`}>Photo: {person.portrait.credit}</p>
        )}
      </header>

      {row.ownWords && (
        <section className={`${styles.section} ${styles.opening}`} aria-labelledby={heading("opening")}>
          <Section id={heading("opening")} className={styles.sectionTitle}>
            In their words
          </Section>
          <blockquote className={styles.openingQuote}>
            <p>
              <SaidGlyph /> {row.ownWords.text}
            </p>
          </blockquote>
          <SourceLine chip={row.ownWords.source} />
          <p className={styles.muted}>{OPENING_RULE[row.ownWords.rule]}</p>
        </section>
      )}

      <section className={styles.section} aria-labelledby={heading("say")}>
        <Section id={heading("say")} className={styles.sectionTitle}>
          What they say they would do
        </Section>
        <span className={styles.label}>Our summary of their platform, in our words</span>
        <p>{row.summary}</p>
        {row.priorities.length > 0 && (
          <ul>
            {row.priorities.map((priority) => (
              <li key={priority}>{priority}</li>
            ))}
          </ul>
        )}
        {row.missingText && <p className={styles.muted}>{row.missingText}</p>}
      </section>

      <section className={styles.section} aria-labelledby={heading("reading")}>
        <Section id={heading("reading")} className={styles.sectionTitle}>
          Our reading
        </Section>
        <span className={styles.label}>Our interpretation, not their words</span>
        {row.values.length > 0 && (
          <ul className={styles.tags} aria-label="Values we read in their program">
            {row.values.map((value) => (
              <li key={value}>{value}</li>
            ))}
          </ul>
        )}
        <p>{row.tradeoff}</p>
        {person.analysis && person.analysis.sources.length > 0 && (
          <div className={styles.inlineSources}>
            {person.analysis.sources.map((source) => (
              <a key={source.url} href={source.url} rel="noopener">
                {source.label} ↗
              </a>
            ))}
          </div>
        )}
      </section>

      <section className={styles.section} aria-labelledby={heading("stand")}>
        <Section id={heading("stand")} className={styles.sectionTitle}>
          Where they stand
        </Section>
        {issues.map((issue) => {
          const cell = row.cells[issue.id];
          return (
            <div key={issue.id} className={styles.issue} data-issue={issue.id}>
              <div className={styles.issueHead}>
                <span className={styles.issueDot} aria-hidden="true" />
                <Item>{issue.label}</Item>
                {cell.chip && <span className={styles.issueChip}>{cell.chip}</span>}
              </div>
              {cell.position ? (
                <div data-issue={issue.id} className={styles.ladderWrap}>
                  <Ladder
                    compact
                    ladder={row.ladder[issue.id]}
                    what={
                      <>
                        <span className={styles.ladderWhat}>
                          <SaidGlyph /> {cell.position}
                        </span>
                        {cell.source && <SourceChipButton chip={cell.source} compact />}
                      </>
                    }
                  />
                </div>
              ) : (
                <NotFound />
              )}
            </div>
          );
        })}
      </section>

      {topics.length > 0 && (
        <section className={styles.section} aria-labelledby={heading("choices")}>
          <Section id={heading("choices")} className={styles.sectionTitle}>
            The choices this office faces
          </Section>
          <p className={styles.muted}>
            Every candidate in this race is asked the same {topics.length} questions. {row.name} is on record on{" "}
            {answered.length}
            {open.length > 0 ? `, with ${open.length} still open` : ""}. A question without an answer is a research gap,
            not a position.
          </p>

          {open.length > 0 && (
            <>
              <span className={styles.label}>No answer we could find</span>
              <ul className={styles.choiceList}>
                {open.map((topic) => {
                  const cell = row.topicCells[topic.id];
                  return (
                    <li key={topic.id} className={styles.choice} data-state="open">
                      <p className={styles.choiceQuestion}>{topic.question}</p>
                      <p className={styles.gapText}>
                        {cell?.askedOn
                          ? `Asked of the campaign on ${cell.askedOn}; no reply yet.`
                          : "Nothing on this exact choice in the sources we reviewed."}
                      </p>
                    </li>
                  );
                })}
              </ul>
            </>
          )}

          {answered.length > 0 && (
            <>
              <span className={styles.label}>On record</span>
              <ul className={styles.choiceList}>
                {answered.map((topic) => {
                  const cell = row.topicCells[topic.id];
                  const decision = cell.vote ? decisionFor(topic.id) : null;
                  const acted = Boolean(cell.source && cell.source.evidence.kind === "Public record");
                  return (
                    <li key={topic.id} className={styles.choice} data-state={cell.vote ? "vote" : "said"}>
                      <p className={styles.choiceQuestion}>{topic.question}</p>
                      {cell.vote && (
                        <p className={styles.choiceVote}>
                          <VotePill vote={cell.vote} name={row.name} />
                          {decision && <span className={styles.choiceVoteOn}>{decision.label}</span>}
                        </p>
                      )}
                      {cell.text ? (
                        <p className={styles.choiceText}>
                          <SaidGlyph /> {cell.text}
                        </p>
                      ) : (
                        cell.vote && (
                          <p className={styles.choiceNote}>No statement beyond the recorded {acted ? "action" : "vote"}.</p>
                        )
                      )}
                      {cell.stance === "partial" && (
                        <p className={styles.choiceNote}>On the topic; the exact choice is unsaid.</p>
                      )}
                      <div className={styles.choiceSources}>
                        {cell.source && <SourceChipButton chip={cell.source} compact />}
                        {decision && <SourceChipButton chip={decision.source} compact />}
                      </div>
                    </li>
                  );
                })}
              </ul>
            </>
          )}

          <Link className={`${c.btn} ${c.secondary} ${c.small}`} href={`${racePath(race)}#topics`} prefetch={false}>
            Compare every candidate <ArrowRight size={15} aria-hidden="true" />
          </Link>
        </section>
      )}

      {row.answers.length > 0 && (
        <section className={styles.section} aria-labelledby={heading("words")}>
          <Section id={heading("words")} className={styles.sectionTitle}>
            Their answers to our questions
          </Section>
          {row.answers.map((answer) => (
            <blockquote key={`${answer.question}-${answer.received}`} className={styles.quote}>
              <p className={styles.muted}>{answer.question}</p>
              <p>
                <SaidGlyph /> {answer.text}
              </p>
              <p className={styles.meta}>Received {answer.received}</p>
            </blockquote>
          ))}
        </section>
      )}

      {council && (
      <section className={styles.section} aria-labelledby={heading("votes")}>
        <Section id={heading("votes")} className={styles.sectionTitle}>
          Council votes
        </Section>
        {row.incumbent ? (
          <>
            <span id={heading("votes-label")} className={styles.label}>
              Recorded vote · then our reading of the record
            </span>
            {featured.length > 0 ? (
              <ol className={styles.voteList} aria-describedby={heading("votes-label")}>
                {featured.map(({ row: f, vote }) => (
                  <li key={f.questionId} className={styles.voteRow}>
                    <div className={styles.voteLine}>
                      <Item>{f.title}</Item>
                      <VotePill vote={vote.vote} />
                    </div>
                    {vote.headline && (
                      <p className={styles.headline}>
                        <span className={styles.headlineLabel}>Our reading:</span> {vote.headline}
                      </p>
                    )}
                    <details>
                      <summary>
                        What Council decided <ChevronDown size={16} aria-hidden="true" />
                      </summary>
                      <p>{f.context}</p>
                      <p>{f.decision.limit}</p>
                      {f.isModa && (
                        <p>
                          A <Term id="term-sheet">term sheet</Term>, not a final contract.
                        </p>
                      )}
                      <p>
                        <Link href={votesHref(race, f)} prefetch={false}>
                          Read the votes and their reasons →
                        </Link>
                      </p>
                    </details>
                  </li>
                ))}
              </ol>
            ) : (
              <p className={styles.muted}>No featured votes are selected for this race yet.</p>
            )}
            <Link className={`${c.btn} ${c.secondary} ${c.small}`} href={votesHref(race)} prefetch={false}>
              All {councilDisagreements.length} topics <ArrowRight size={15} aria-hidden="true" />
            </Link>
          </>
        ) : (
          <p>No Council vote yet. That is not a judgment about experience.</p>
        )}
      </section>
      )}

      {!council && rollCalls.length > 0 && (
        <section className={styles.section} aria-labelledby={heading("record")}>
          <Section id={heading("record")} className={styles.sectionTitle}>
            Public record
          </Section>
          <span className={styles.label}>Recorded actions, from the official record</span>
          {rollCalls.map((entry, i) => (
            <div key={`${entry.source.url}-${i}`} className={styles.statement}>
              <p>{entry.text}</p>
              <SourceLine chip={sourceChip(entry.source)} />
            </div>
          ))}
        </section>
      )}

      {earlier.length > 0 && (
        <section className={styles.section} aria-labelledby={heading("earlier")}>
          <Section id={heading("earlier")} className={styles.sectionTitle}>
            Earlier statements
          </Section>
          {earlier.map((entry, i) => (
            <div key={`${entry.source.url}-${i}`} className={styles.statement}>
              <p className={styles.meta}>{entry.source.date}</p>
              <p>
                <SaidGlyph /> {entry.text}
              </p>
              <SourceLine chip={sourceChip(entry.source)} />
            </div>
          ))}
        </section>
      )}

      <section className={styles.section} aria-labelledby={heading("question")}>
        <Section id={heading("question")} className={styles.sectionTitle}>
          A question the evidence leaves open
        </Section>
        <p>{row.question}</p>
      </section>

      <section className={`${styles.section} ${styles.sources}`} aria-labelledby={heading("sources")}>
        <Section id={heading("sources")} className={styles.sectionTitle}>
          Sources ({sources.length})
        </Section>
        <ol>
          {sources.map((source) => (
            <li key={source.url}>
              <a href={source.url} rel="noopener" className={styles.sourceLink}>
                <span>{source.label}</span>
                <ArrowUpRight size={14} aria-hidden="true" />
              </a>
              <small>
                {source.kind} · {source.date}
              </small>
              {source.note && <small>{source.note}</small>}
            </li>
          ))}
        </ol>
      </section>

      {!embedded && (
        <footer className={styles.pager}>
          <nav className={styles.pagerLinks} aria-label="Other candidates, alphabetical">
            {previous && (
              <Link href={candidatePath(race, previous)} prefetch={false} rel="prev" className={styles.pagerLink}>
                <ArrowLeft size={16} aria-hidden="true" />
                <span>
                  <small>Previous</small>
                  {previous.name}
                </span>
              </Link>
            )}
            {next && (
              <Link href={candidatePath(race, next)} prefetch={false} rel="next" className={styles.pagerLink}>
                <span>
                  <small>Next</small>
                  {next.name}
                </span>
                <ArrowRight size={16} aria-hidden="true" />
              </Link>
            )}
          </nav>
          <Link href={racePath(race)} prefetch={false} className={`${c.btn} ${c.secondary}`}>
            <ArrowLeft size={16} aria-hidden="true" /> Back to the {districtLabel} {council ? "list" : "race"}
          </Link>
        </footer>
      )}
    </article>
  );
}
