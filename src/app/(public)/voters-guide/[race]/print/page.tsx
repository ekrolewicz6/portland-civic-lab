import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { findRace, races } from "@/lib/voters-guide/published";
import { ELECTION_DATE, REVIEW_LABEL } from "@/lib/voters-guide/types";
import { buildRaceSheet, issues, shortRaceTitle, type FeaturedRow } from "@/lib/voters-guide/race-sheet";
import { printMetadata, racePath } from "@/lib/voters-guide/race-sheet/seo";
import CandidateBrief, { NotFound } from "@/components/race-sheet/CandidateBrief";
import { Gap, SaidGlyph, VotedGlyph, VotePill } from "@/components/race-sheet/Glyph";
import { PrintButton } from "@/components/race-sheet/Term";
import styles from "@/components/race-sheet/brief.module.css";

type Params = Promise<{ race: string }>;

export function generateStaticParams() {
  return races.map((race) => ({ race: race.id }));
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { race: id } = await params;
  const race = findRace(id);
  if (!race) notFound();
  return printMetadata(race);
}

/** The founder-conflict disclosure, printed wherever a Moda vote appears. */
function ModaDisclosure() {
  return (
    <p className={styles.disclosure}>
      Disclosure: the Lab’s founder runs an advocacy campaign about the Moda deal.{" "}
      <Link href="/independence">Read our independence policy →</Link>
    </p>
  );
}

/**
 * Table column widths for the A–Z grid: Name 14, Role 12, Summary 26, four
 * issues at 12 each. With `table-layout: fixed` the browser keeps these on
 * paper too, so names wrap on spaces instead of breaking mid-word.
 */
const GRID_COLUMNS = [14, 12, 26, ...issues.map(() => 12)];

function FeaturedVote({ row }: { row: FeaturedRow }) {
  return (
    <section className={styles.featured} aria-labelledby={`print-vote-${row.questionId}`}>
      <h3 id={`print-vote-${row.questionId}`}>{row.title}</h3>
      <p className={styles.muted}>{row.context}</p>
      <ul className={styles.featuredVotes} aria-label="Recorded votes">
        {row.votes.map((vote) => (
          <li key={vote.id}>
            <span>{vote.name}</span>
            <VotePill vote={vote.vote} />
          </li>
        ))}
      </ul>
      {row.said.length > 0 && (
        <ul className={styles.saidList} aria-label="What other candidates have said about this choice">
          {row.said.map((said) => (
            <li key={said.id}>
              <SaidGlyph />
              <span>{said.name}</span>
              <span className={styles.muted}>{said.line}</span>
              {said.source && <span className={styles.chip}>{said.source.label}</span>}
            </li>
          ))}
        </ul>
      )}
      <p className={styles.muted}>Not addressed in their sources ({row.notAddressed}).</p>
      <p className={styles.muted}>{row.decision.limit}</p>
      {row.isModa && <ModaDisclosure />}
      <p className={styles.meta}>
        {row.decision.source.label} · {row.decision.source.date}
      </p>
    </section>
  );
}

export default async function PrintPage({ params }: { params: Params }) {
  const { race: id } = await params;
  const race = findRace(id);
  if (!race) notFound();
  const sheet = buildRaceSheet(race);
  const short = shortRaceTitle(race);
  const people = new Map(race.candidates.map((person) => [person.id, person]));
  const featuresModa = sheet.featured.some((row) => row.isModa);
  return (
    <div className={`${styles.page} ${styles.printPage}`}>
      <header className={styles.printHead}>
        <p className={styles.eyebrow}>Print edition · Portland City Council · {ELECTION_DATE}</p>
        <h1>{race.title}</h1>
        <p className={styles.meta}>
          {race.candidates.length} candidates · {race.method} · Research reviewed {REVIEW_LABEL} · Lines edition{" "}
          {sheet.version}
        </p>
        <p className={styles.muted}>
          {race.rosterStatus}. Candidates appear alphabetically by displayed name and receive the same structure. We do
          not endorse, rank or score.
        </p>
        <div className={styles.printActions}>
          <PrintButton className={styles.printButton} />
          <Link href={racePath(race)} prefetch={false}>
            <ArrowLeft size={16} aria-hidden="true" /> Back to the {short} list
          </Link>
        </div>
      </header>

      <section className={styles.section} aria-labelledby="print-choice">
        <h2 id="print-choice" className={styles.sectionTitle}>
          The choice in one paragraph
        </h2>
        <span className={styles.label}>Our reading</span>
        <p>{sheet.choice.text}</p>
        {!sheet.choice.reviewed && <p className={styles.muted}>Draft; human review pending.</p>}
      </section>

      <section className={styles.section} aria-labelledby="print-key">
        <h2 id="print-key" className={styles.sectionTitle}>
          Key
        </h2>
        <dl className={styles.key}>
          <div>
            <dt>
              <SaidGlyph label="" /> Said
            </dt>
            <dd>A campaign statement, in our summary or their words.</dd>
          </div>
          <div>
            <dt>
              <VotedGlyph label="" /> Voted
            </dt>
            <dd>A recorded Council roll call.</dd>
          </div>
          <div>
            <dt>
              <span className={styles.dash} aria-hidden="true">
                —
              </span>{" "}
              Not found
            </dt>
            <dd>Not in the sources we reviewed. A research gap, not a position.</dd>
          </div>
          <div>
            <dt>
              <VotePill vote="Yes" /> <VotePill vote="No" />
            </dt>
            <dd>The vote as the word, never as color alone.</dd>
          </div>
          <div>
            <dt>
              <VotePill vote="Absent" />
            </dt>
            <dd>Missed that roll call.</dd>
          </div>
          <div>
            <dt>
              <VotePill vote="Not on committee" />
            </dt>
            <dd>Had no vote in that committee.</dd>
          </div>
        </dl>
        {featuresModa && <ModaDisclosure />}
      </section>

      <section className={styles.section} aria-labelledby="print-list">
        <h2 id="print-list" className={styles.sectionTitle}>
          Every candidate, A–Z
        </h2>
        <table className={styles.grid}>
          <colgroup>
            {GRID_COLUMNS.map((width, i) => (
              <col key={i} style={{ width: `${width}%` }} />
            ))}
          </colgroup>
          <thead>
            <tr>
              <th scope="col">Name</th>
              <th scope="col">Role</th>
              <th scope="col">Summary</th>
              {issues.map((issue) => (
                <th key={issue.id} scope="col">
                  {issue.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {sheet.rows.map((row) => (
              <tr key={row.id}>
                <th scope="row">
                  <a href={`#${row.id}`}>{row.name}</a>
                </th>
                <td data-label="Role">{row.role}</td>
                <td data-label="Summary">{row.summary}</td>
                {issues.map((issue) => (
                  <td key={issue.id} data-label={issue.label}>
                    {row.cells[issue.id].line ?? <Gap />}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
        <p className={styles.muted}>
          Summaries are our one-line readings of what each candidate says. Issue lines are short forms of the positions
          in each brief, AI-drafted and awaiting human review; “—” means not found in the sources we reviewed.
        </p>
      </section>

      <section className={styles.section} aria-labelledby="print-votes">
        <h2 id="print-votes" className={styles.sectionTitle}>
          Four votes that split this Council
        </h2>
        {sheet.incumbents.length > 0 ? (
          <p>
            Only {sheet.incumbents.map((p) => p.name).join(", ").replace(/, ([^,]*)$/, " and $1")} sit on Council today. The
            other {race.candidates.length - sheet.incumbents.length} have no votes yet; that is not a judgment.
          </p>
        ) : (
          <p>No candidate in this race sits on Council today.</p>
        )}
        {sheet.featured.length > 0 ? (
          sheet.featured.map((row) => <FeaturedVote key={row.questionId} row={row} />)
        ) : (
          <NotFound text="No featured votes are selected for this race yet." />
        )}
      </section>

      <section className={styles.section} aria-labelledby="print-briefs">
        <h2 id="print-briefs" className={styles.sectionTitle}>
          Candidate briefs, A–Z
        </h2>
        {sheet.rows.map((row) => {
          const person = people.get(row.id);
          return person ? <CandidateBrief key={row.id} race={race} person={person} row={row} sheet={sheet} embedded /> : null;
        })}
      </section>
    </div>
  );
}
