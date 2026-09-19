import type { Metadata } from "next";
import Link from "next/link";
import styles from "../guide.module.css";
export const metadata: Metadata = { title: "Voters’ Guide · Research Log" };
export default function ResearchLog() {
  return (
    <div className={styles.guide}>
      <Link className={styles.back} href="/voters-guide">
        ← Back to the guide
      </Link>
      <header className={styles.raceHeader}>
        <div className={styles.eyebrow}>Evidence, changes and corrections</div>
        <h1>The research log</h1>
        <p className={styles.lede}>
          Material changes should be visible. Construction notes are separate
          from corrections to a published claim.
        </p>
      </header>
      <div className={styles.prose}>
        <h2>September 18, 2026 · Council publication</h2>
        <p>
          Released the District 3 and District 4 Council guide as a working
          research edition. The public directory, race pages, evidence export
          and sitemap include these two races only. Other research described
          below remains unpublished.
        </p>
        <h2>September 18, 2026 · Research development</h2>
        <p>
          Built the candidate briefs from official candidate registers, county
          pamphlets and campaign sources. Recorded the same final Moda
          term-sheet vote for all six Portland council incumbents and the same
          final House action on H.R. 1 for all six congressional incumbents.
        </p>
        <p>
          Checked the statewide field against qualified general-election
          filings. Consolidated multiple party nominations into one candidate
          entry. Included candidates who did not submit pamphlet statements,
          rather than treating pamphlet participation as the ballot roster.
        </p>
        <p>
          Disclosed older campaign material and failed source retrievals. Left
          unsupported policy summaries blank. No campaign has been contacted for
          a response, and separate human editorial review remains incomplete.
        </p>
        <p>
          Expanded legislative research to eight Senate and five House
          districts. Checked party cross-nominations against the narrowed
          official filing snapshot. Added current candidate statements outside
          county pamphlets, including campaign websites and published
          questionnaire responses.
        </p>
        <h2>September 18, 2026 · Portland portraits and filing review</h2>
        <p>
          Added source-credited portraits for 31 of 33 Council candidates and
          the auditor, with equal-size frames and placeholders for missing
          images. Added McCormick’s limited 2026 filing statement, Pham’s
          current occupational background and explicitly historical 2024
          answers, and Goldsmith’s amended 2026 background. These additions do
          not close the three candidates’ broader policy-research gaps.
        </p>
        <h2>Corrections</h2>
        <p>
          No corrections to a previously published edition have been logged.
          Future entries should identify the original claim, the correction, its
          supporting source and the date of the change.
        </p>
        <p>
          <Link href="/voters-guide/methodology#corrections">
            Submit a sourced correction
          </Link>{" "}
          ·{" "}
          <a
            href="/voters-guide/evidence"
            download="oregon-voters-guide-2026.json"
          >
            Download the briefs and evidence links (JSON)
          </a>
        </p>
      </div>
    </div>
  );
}
