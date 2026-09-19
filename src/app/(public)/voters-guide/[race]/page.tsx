import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { findRace, races } from "@/lib/voters-guide/published";
import { REVIEW_LABEL } from "@/lib/voters-guide/types";
import CandidateComparison from "@/components/voters-guide/CandidateComparison";
import styles from "../guide.module.css";
export function generateStaticParams() {
  return races.map((r) => ({ race: r.id }));
}
export async function generateMetadata({
  params,
}: {
  params: Promise<{ race: string }>;
}): Promise<Metadata> {
  const { race: id } = await params;
  const race = findRace(id);
  return {
    title: race ? `${race.title} · 2026 Voters’ Guide` : "Race not found",
    description: race?.stakes,
  };
}
export default async function RacePage({
  params,
}: {
  params: Promise<{ race: string }>;
}) {
  const { race: id } = await params;
  const race = findRace(id);
  if (!race) notFound();
  return (
    <div className={styles.guide}>
      <Link className={styles.back} href="/voters-guide">
        <ArrowLeft size={16} /> All races
      </Link>
      <header className={styles.raceHeader}>
        <div className={styles.eyebrow}>
          {race.jurisdiction} / November 3, 2026 / {race.method}
        </div>
        <h1>{race.title}</h1>
        <p className={styles.lede}>{race.stakes}</p>
        <a href="#candidates" className={styles.meetCandidates}>
          Meet the{" "}
          {race.candidates.length === 1
            ? "candidate"
            : `${race.candidates.length} candidates`}{" "}
          <span aria-hidden="true">↓</span>
        </a>
        <div className={styles.meta}>
          <span>
            {race.candidates.length} candidates · Reviewed {REVIEW_LABEL}
          </span>
          <Link href="/voters-guide/methodology">
            How we research and write
          </Link>
        </div>
      </header>
      <div className={styles.raceFacts}>
        <section>
          <h2>What this office can do</h2>
          <p>{race.authority}</p>
        </section>
        <section>
          <h2>
            Where the choices differ{" "}
            <span className={styles.eyebrow}> / Editorial synthesis</span>
          </h2>
          <p>{race.comparison}</p>
        </section>
      </div>
      <div className={styles.note}>
        <strong>{race.rosterStatus}.</strong>{" "}
        <a href={race.rosterSource.url}>{race.rosterSource.label}</a>. This is a
        working research edition; separate human editorial review remains
        incomplete. The roster and policy research are separate checks. A
        candidate’s published statement establishes what they say, not that
        their factual claims are true.
      </div>
      <CandidateComparison key={race.id} race={race} />
      <div className={styles.footerNote}>
        <p>
          These are research briefs, not endorsements. Candidates receive the
          same profile structure and appear alphabetically by displayed name. A
          missing record section means this edition has not completed a
          comparable record review; it does not mean the candidate lacks a
          record.
        </p>
        <p>
          <Link href="/voters-guide/methodology#corrections">
            Suggest a sourced correction
          </Link>{" "}
          ·{" "}
          <Link href="/voters-guide/methodology#coverage">
            Coverage and research gaps
          </Link>
        </p>
      </div>
    </div>
  );
}
