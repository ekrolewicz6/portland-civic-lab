import RaceAbout from "@/components/voters-guide/RaceAbout";
import { voterGuideMetadata, type GuideCard } from "@/lib/voters-guide/metadata";
import GuideStructuredData from "@/components/voters-guide/GuideStructuredData";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { findRace, races } from "@/lib/voters-guide/published";
import { REVIEW_LABEL } from "@/lib/voters-guide/types";
import CandidateComparison from "@/components/voters-guide/CandidateComparison";
import RaceNavigation from "@/components/voters-guide/RaceNavigation";
import CandidateDiscovery from "@/components/voters-guide/CandidateDiscovery";
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
  if (!race) notFound();
  return voterGuideMetadata(`district-${race.id.slice(-1)}` as GuideCard);
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
      <GuideStructuredData card={`district-${race.id.slice(-1)}` as GuideCard} />
      <Link className={styles.back} href="/voters-guide">
        <ArrowLeft size={16} /> All races
      </Link>
      <header className={styles.raceHeader}>
        <div className={styles.eyebrow}>November 3, 2026 · {race.method}</div>
        <h1>{race.title.replace(/District (\d+)/, "District\u00a0$1")}</h1>
        <div className={styles.meta}>
          <span>{race.candidates.length} candidates · Reviewed {REVIEW_LABEL}</span>
          <a href="#about-guide">About this guide</a>
        </div>
      </header>
      <RaceNavigation race={race}>
      <CandidateDiscovery race={race} />
      <RaceAbout race={race} />
      <CandidateComparison key={race.id} race={race} />
      </RaceNavigation>
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
