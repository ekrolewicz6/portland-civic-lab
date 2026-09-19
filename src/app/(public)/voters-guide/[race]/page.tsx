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
      <div id="about-guide" data-panel="about">
      <section aria-label="The complete research guide">
        <h2>About this race</h2>
        <p>{race.stakes}</p>
        <p>
          Explore the choices behind the headlines, what each vote changed, and
          what candidates say they would do. Every candidate profile, recorded
          decision and source is available through the navigation.
        </p>
        <nav aria-label="Full research navigation" className={styles.meta}>
          <a href="#disagreements">Where incumbents disagree</a>
          <a href="#compare">Compare values &amp; issues</a>
          <a href="#candidates">Meet the {race.candidates.length} candidates</a>
        </nav>
        <details className={styles.raceContext}>
          <summary>A few terms that make the record easier to read</summary>
          <dl>
            <dt>
              <strong>Amendment</strong>
            </dt>
            <dd>
              A proposed change to a measure. A vote on one amendment does not
              establish support for the final package.
            </dd>
            <dt>
              <strong>Supplemental budget</strong>
            </dt>
            <dd>
              A change to a budget after its original adoption, often to respond
              to new costs or revenue.
            </dd>
            <dt>
              <strong>Appropriation</strong>
            </dt>
            <dd>
              Permission to spend public money for a particular purpose. It does
              not mean the money has already been spent.
            </dd>
            <dt>
              <strong>PCEF</strong>
            </dt>
            <dd>
              The Portland Clean Energy Fund. Debates involve both what climate
              work to fund and whether its money should help cover other city
              costs.
            </dd>
            <dt>
              <strong>Term sheet</strong>
            </dt>
            <dd>
              A document setting out the main terms of a proposed deal. Read the
              specific vote to see what was approved and what still required
              agreement.
            </dd>
            <dt>
              <strong>Social housing</strong>
            </dt>
            <dd>
              Housing intended to remain affordable through public or nonprofit
              ownership. Proposals differ in who qualifies, how rents are set
              and how construction is paid for.
            </dd>
            <dt>
              <strong>CEI Hub</strong>
            </dt>
            <dd>
              The Critical Energy Infrastructure Hub, an area of fuel storage
              and related facilities along the Willamette River. The research
              covers pollution, earthquake risks and proposals affecting
              individual operators such as Zenith.
            </dd>
          </dl>
        </details>
      </section>
      <details className={styles.raceContext}>
        <summary>
          About this office, the evidence and this working edition
        </summary>
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
          <a href={race.rosterSource.url}>{race.rosterSource.label}</a>. This is
          a working research edition; separate human editorial review remains
          incomplete. The roster and policy research are separate checks. A
          candidate’s published statement establishes what they say, not that
          their factual claims are true.
        </div>
      </details>
      </div>
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
