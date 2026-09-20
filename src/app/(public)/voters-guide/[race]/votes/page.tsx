import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { findRace, races } from "@/lib/voters-guide/published";
import { REVIEW_LABEL } from "@/lib/voters-guide/types";
import { shortRaceTitle } from "@/lib/voters-guide/race-sheet";
import { racePath, votesMetadata, votesStructuredData } from "@/lib/voters-guide/race-sheet/seo";
import RaceSheetStructuredData from "@/components/race-sheet/RaceSheetStructuredData";
import VoteMatrix from "@/components/race-sheet/VoteMatrix";
import CouncilDisagreements from "@/components/voters-guide/CouncilRecord";
import { councilDisagreements } from "@/lib/voters-guide/council-record-accounts";
import styles from "@/components/race-sheet/votes.module.css";

export function generateStaticParams() {
  return races.map((r) => ({ race: r.id }));
}

export async function generateMetadata({ params }: { params: Promise<{ race: string }> }): Promise<Metadata> {
  const { race: id } = await params;
  const race = findRace(id);
  if (!race) notFound();
  return votesMetadata(race);
}

export default async function VotesPage({ params }: { params: Promise<{ race: string }> }) {
  const { race: id } = await params;
  const race = findRace(id);
  if (!race) notFound();
  const short = shortRaceTitle(race);

  return (
    <div className={`${styles.votes} ${styles.page}`}>
      <RaceSheetStructuredData data={votesStructuredData(race)} />
      <header className={styles.pageHeader}>
        <Link className={styles.back} href={racePath(race)} prefetch={false}>
          <ArrowLeft size={16} aria-hidden="true" /> {short} race sheet
        </Link>
        <p className={styles.eyebrow}>Recorded votes · Reviewed {REVIEW_LABEL}</p>
        <h1 className={styles.title}>How {short}’s councilors voted</h1>
        <p className={styles.note}>
          Challengers have no Council votes; only sitting councilors appear here. That is not a judgment.
        </p>
      </header>

      <div className={styles.measure}>
        <VoteMatrix race={race} />
      </div>

      <section className={styles.recordSection} aria-labelledby="every-issue-heading">
        <p className={styles.eyebrow}>The full record</p>
        <h2 id="every-issue-heading" className={styles.heading}>
          Every issue, with reasons
        </h2>
        <p className={styles.note}>
          All {councilDisagreements.length} Council topics since January 2025. Open one for the question, our reading of each
          councilor’s record, and every matched vote with its stated reason and the City record.
        </p>
        <CouncilDisagreements people={race.candidates} />
      </section>
    </div>
  );
}
