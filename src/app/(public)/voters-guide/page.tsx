import { voterGuideMetadata } from "@/lib/voters-guide/metadata";
import GuideStructuredData from "@/components/voters-guide/GuideStructuredData";
import Link from "next/link";
import { ArrowUpRight, BookOpen, CalendarDays } from "lucide-react";
import {
  races,
  candidateCount,
  profileCount,
} from "@/lib/voters-guide/published";
import { officialSources, REVIEW_LABEL } from "@/lib/voters-guide/types";
import CandidatePortrait from "@/components/voters-guide/CandidatePortrait";
import GuideExplorer from "@/components/voters-guide/GuideExplorer";
import styles from "./guide.module.css";
export const metadata = voterGuideMetadata("guide");
export default function VotersGuidePage() {
  return (
    <div className={styles.guide}>
      <GuideStructuredData card="guide" />
      <header className={styles.intro}>
        <div className={styles.eyebrow}>Portland Civic Lab / Election 2026</div>
        <div className={styles.titleRow}>
          <h1>
            Know the choice.
            <br />
            <span>Make your own.</span>
          </h1>
          <div className={styles.election}>
            <CalendarDays aria-hidden="true" size={23} />
            <strong>November 3, 2026</strong>
            <span>Oregon general election</span>
            <a href={officialSources.myVote}>
              Check your registration <ArrowUpRight size={16} />
            </a>
          </div>
        </div>
        <p className={styles.lede}>
          What candidates propose. What the record shows. What still needs an
          answer. A nonpartisan voters’ guide to Portland City Council Districts
          3 and 4.
        </p>
        <div className={styles.meta}>
          <span>Research reviewed {REVIEW_LABEL}</span>
          <Link href="/voters-guide/methodology">
            <BookOpen size={16} /> Our editorial standards
          </Link>
        </div>
      </header>
      <div className={styles.edition}>
        <strong>Working research edition</strong>
        <p>
          {races.length} races · {candidateCount} candidates listed ·{" "}
          {profileCount} substantive briefs. Coverage is still being expanded
          and independently checked. Regional and statewide guides are in
          development. Missing research is labeled on each profile. This is not
          yet a complete guide to every race or every candidate’s public record.
        </p>
        <Link href="/voters-guide/methodology#coverage">
          See coverage and gaps →
        </Link>
      </div>
      <section
        className={styles.portlandFeature}
        aria-labelledby="portland-feature-title"
      >
        <div className={styles.featureIntro}>
          <div className={styles.eyebrow}>On the Portland ballot</div>
          <h2 id="portland-feature-title">
            A city council.
            <br />
            <em>A city’s direction.</em>
          </h2>
          <p>
            Six seats. Two districts. Meet everyone asking to represent you, and
            explore what their choices could mean for Portland.
          </p>
          <Link href="/voters-guide/methodology">
            Evidence before endorsements ↗
          </Link>
        </div>
        <div className={styles.districtFeatures}>
          {races
            .filter(
              (r) =>
                r.id === "portland-district-3" ||
                r.id === "portland-district-4",
            )
            .map((r) => (
              <Link
                key={r.id}
                href={`/voters-guide/${r.id}`}
                className={styles.districtFeature}
              >
                <div className={styles.districtFeatureHeading}>
                  <span className={styles.districtNumber}>
                    0{r.id.slice(-1)}
                  </span>
                  <div>
                    <h3>District {r.id.slice(-1)}</h3>
                    <p>{r.candidates.length} candidates · 3 seats</p>
                  </div>
                  <ArrowUpRight aria-hidden="true" />
                </div>
                <div className={styles.fieldMosaic} aria-hidden="true">
                  {[...r.candidates]
                    .sort((a, b) => a.name.localeCompare(b.name, "en"))
                    .map((p) => (
                      <CandidatePortrait person={p} compact key={p.id} />
                    ))}
                </div>
                <span className={styles.districtCta}>
                  Explore the complete field <span aria-hidden="true">→</span>
                </span>
              </Link>
            ))}
        </div>
      </section>
      <GuideExplorer
        races={races.map(
          ({
            id,
            title,
            geography,
            jurisdiction,
            method,
            stakes,
            candidates,
          }) => ({
            id,
            title,
            geography,
            jurisdiction,
            method,
            stakes,
            candidates: candidates.map(({ name }) => ({ name })),
            profileCount: candidates.filter((c) => !c.missing).length,
          }),
        )}
      />
      <section className={styles.voting} aria-labelledby="voting-title">
        <div>
          <div className={styles.eyebrow}>Before you vote</div>
          <h2 id="voting-title">Your address determines your ballot.</h2>
          <p>
            A county filter helps you explore. It does not determine your
            eligibility for a district or produce your official ballot.
          </p>
          <a href={officialSources.myVote}>
            Find your voter information <ArrowUpRight size={16} />
          </a>
        </div>
        <ol>
          <li>
            <strong>October 13</strong>
            <span>Registration deadline</span>
          </li>
          <li>
            <strong>October 14</strong>
            <span>Ballot mailing begins</span>
          </li>
          <li>
            <strong>November 3 · 8 p.m.</strong>
            <span>Official drop-box deadline</span>
          </li>
        </ol>
        <p className={styles.sourceNote}>
          Dates: <a href={officialSources.state}>Oregon Secretary of State</a>.
          For mail returns, follow the election office’s postmark and receipt
          requirements. Portland and Multnomah County contests use ranked
          choice; other contests may use different instructions.{" "}
          <a href="https://multco.us/info/ranked-choice-voting-rcv">
            Read the official ranked-choice guide.
          </a>
        </p>
      </section>
    </div>
  );
}
