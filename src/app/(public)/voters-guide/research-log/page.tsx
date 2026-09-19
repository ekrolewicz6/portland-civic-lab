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
        <h2>
          September 18, 2026 · Budget priorities and the broader Council record
        </h2>
        <p>
          Expanded the opening comparison from three examples to seven topics
          and seventeen matched roll calls. Added the 2025 parks/police choice,
          three competing June 2026 restoration amendments, annual budget
          adoption, Zenith’s investigation and transfer debates, camp-removal
          funding, detention-facility fees, housing development charges, the
          small-business exemption and PSU/Keller planning.
        </p>
        <p>
          Checked June amendment votes against the clerk’s archived roll-call
          sheets. These distinguish Novick’s smaller climate-interest proposal
          from Services First and Clark’s oversight-funding proposal. Budget
          summaries describe priorities across successive choices, with the
          underlying record available in chronological order.
        </p>
        <p>
          Zenith coverage includes the February investigation’s findings and the
          pending September 23 reconsideration. Absences remain separate from
          opposition. Shared-ground examples and a wider topic map make the
          selection’s limits visible. Incumbent record entries now expand
          individually to keep mobile profiles manageable.
        </p>
        <h2>September 18, 2026 · Explain the disagreements</h2>
        <p>
          Added an immediate comparison of incumbents on the competing July
          budget packages, Moda negotiations and rent-setting software. Record
          entries now distinguish final votes, alternative proposals and
          amendments. The July comparison shows who supported the larger plan,
          who supported the smaller package, and who supported both.
        </p>
        <p>
          Added individual explanations from office statements and attributed
          reporting, including the split over Moda rent and financial
          safeguards. Earlier statements retain their dates. Where a personal
          explanation was not established, the entry describes the documented
          action without inventing a motive. Replaced repeated caveats in
          incumbent briefs with concise evidence links and shared context.
        </p>
        <h2>
          September 18, 2026 · Issue comparison and deeper Council research
        </h2>
        <p>
          Added direct candidate selectors and mobile reading cards for
          governing values, housing, safety, money, climate and recorded
          decisions. Every candidate receives the same issue framework,
          including visible evidence gaps. Selections are temporary; there are
          no rankings or match scores.
        </p>
        <p>
          Added issue-level evidence from twelve campaign websites, including
          Pham’s rendered issue pages, which resolve the previous
          current-platform retrieval gap. His policy claims remain attributed
          rather than treated as verified outcomes. Expanded the same record
          check for all six incumbents from one to four final actions, including
          the July service-restoration budget and the September data-center
          resolution. Distinguished enacted rules, temporary funding,
          negotiating frameworks and statements of future intent.
        </p>
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
          September 18, 2026: removed unsupported male pronouns from Jamey
          Evenstar’s interpretation; the text now uses the candidate’s name.
          Expanded the brief using the{" "}
          <a href="https://evenstarforportland.com/platform">
            current platform
          </a>{" "}
          and <a href="https://evenstarforportland.com">campaign biography</a>.
          Also replaced the assertion that Guy Frankenstein prioritizes
          confrontation over coalition-building: the reviewed questionnaire
          supports his policy targets but does not establish his approach to
          assembling a legislative coalition.
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
