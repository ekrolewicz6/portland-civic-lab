import type { Metadata } from "next";
import Link from "next/link";
import {
  races,
  candidateCount,
  profileCount,
} from "@/lib/voters-guide/published";
import {
  officialSources,
  REVIEW_LABEL,
  pamphlets,
} from "@/lib/voters-guide/types";
import styles from "../guide.module.css";
export const metadata: Metadata = {
  title: "Voters’ Guide · Editorial Standards & Coverage",
};
export default function Methodology() {
  const recordCount = races
    .flatMap((r) => r.candidates)
    .filter((c) => c.record?.length).length;
  return (
    <div className={styles.guide}>
      <Link className={styles.back} href="/voters-guide">
        ← Back to the guide
      </Link>
      <header className={styles.raceHeader}>
        <div className={styles.eyebrow}>The rules behind the guide</div>
        <h1>
          Fair to candidates.
          <br />
          Accountable to the evidence.
        </h1>
        <p className={styles.lede}>
          Nonpartisan means using the same standards for everyone. It does not
          mean treating a documented fact and an unsupported assertion as
          equally credible.
        </p>
        <p>
          Research reviewed {REVIEW_LABEL}. This edition contains AI-assisted
          research and drafting; it has not completed a separate human editorial
          review.
        </p>
      </header>
      <div className={styles.prose}>
        <h2>What we are trying to explain</h2>
        <p>
          For each candidate: what they want government to do, how they propose
          to do it, what their public record can establish, and what remains
          unanswered. We describe tradeoffs and institutional limits. We do not
          endorse candidates, recommend rankings, assign ideological scores, or
          infer private motives.
        </p>
        <h2>The same questions for every candidate</h2>
        <ol>
          <li>
            What specific policy or administrative changes do they propose?
          </li>
          <li>Does this office have the power to make those changes?</li>
          <li>
            What would they cost, who would pay, and what would be reduced?
          </li>
          <li>
            What evidence supports their factual claims and claims of success?
          </li>
          <li>
            What result and deadline would allow the public to evaluate the
            promise?
          </li>
        </ol>
        <p>
          The same questions do not require identical conclusions or word
          counts. A concrete policy warrants more explanation than a slogan. A
          documented falsehood warrants a correction regardless of who said it.
        </p>
        <h2>Three kinds of writing, visibly separated</h2>
        <h3>Candidate statements</h3>
        <p>
          Campaign websites, interviews, questionnaires and candidate-authored
          voters’ pamphlet entries establish stated positions. Hosting a
          statement on a government website does not make its claims verified.
          We paraphrase with attribution and do not convert a promised result
          into an established fact.
        </p>
        <h3>Public records</h3>
        <p>
          We check the actual bill, roll call, budget, audit or official
          decision. We distinguish introduction from passage, a procedural
          motion from a final vote, and an appropriation from an achieved
          outcome. A single vote is not a complete political identity. In this
          edition, all six Portland council incumbents are compared on the same
          73 decisions across 29 issues. Every subject in the Council site’s
          current 24-topic index is covered, alongside additional major votes on
          labor, children’s services, policing, elections and City governance.
          Each decision includes the same six incumbents, with amendments,
          absences and committee membership clearly distinguished. This is a
          comparison of consequential choices, not a score.
        </p>
        <p>
          We follow competing budget proposals and Zenith’s successive stages,
          alongside the amendments that shaped the Moda negotiations. Personal
          explanations are attributed to the councilor or reporting that
          identifies the speaker. Earlier statements keep their dates. A
          documented action is labeled as an action when we have not established
          an individual explanation; we do not turn a vote into an inferred
          motive. The opening disagreement view covers incumbents; the issue
          comparison includes every candidate.
        </p>
        <h3 id="council-coverage">How we checked Council topic coverage</h3>
        <p>
          We reviewed the Council site’s 24 topic dossiers and scanned 339
          unique final-action entries in its vote index. We then checked
          selected measures against the City’s official legislation and roll
          calls, rather than treating topic summaries or index dates as the
          authoritative record. The downloadable evidence includes a map from
          every dossier to its issue comparison here.
        </p>
        <p>
          Coverage means that every indexed subject has a matched account; it
          does not mean every motion, hearing or public statement appears in
          this guide. Routine transactions are not all reproduced. For pending
          matters, we describe the latest verified stage: the firearms proposal
          was tabled in committee, natural-psychedelics legislation awaited full
          Council consideration, and Zenith reconsideration remained scheduled
          for September 23. Members outside a committee are marked “Not on
          committee,” never “Absent” or “No.”
        </p>
        <h3>Editorial interpretation</h3>
        <p>
          We explain the practical meaning of the supported position: for
          example, a temporary moratorium leaves a different decision open than
          a permanent prohibition. Every interpretation must be traceable to the
          cited evidence. We do not turn party affiliation, endorsements,
          donors, identity or silence into a position the candidate has not
          expressed.
        </p>
        <h2>Selection, fairness and context</h2>
        <p>
          The comparison’s values labels describe priorities supported by the
          cited materials, not personal virtue, hidden motives or fixed
          ideological identities. Readers can compare the same issue across
          candidates without a score or recommendation. An unfilled issue means
          the reviewed evidence does not establish a position; it does not mean
          neutrality, opposition or lack of interest. More detailed campaign
          writing is not itself evidence of stronger performance.
        </p>
        <ul>
          <li>
            Include every named candidate on the checked roster for a covered
            race, including smaller-party candidates and candidates with little
            public material.
          </li>
          <li>
            Display candidates alphabetically by the name shown, with the same
            visual treatment. No candidate is preselected for comparison.
          </li>
          <li>
            Give incumbents an independently checked record where available. Do
            not penalize challengers for lacking roll-call votes; look for
            relevant professional, civic and public statements instead.
          </li>
          <li>
            Use complete source context. Before publishing quotations from audio
            or automatic transcripts, verify the recording, speaker, date and
            timestamp. This edition does not quote unchecked transcripts.
          </li>
          <li>
            Distinguish current platforms from historical statements. A change
            of position needs dated evidence on both sides and, where available,
            the candidate’s explanation.
          </li>
          <li>
            Do not publish a serious allegation as fact on an opponent’s say-so.
            Establish the underlying evidence and seek the subject’s response
            before adding disputed allegations.
          </li>
          <li>
            Endorsements and contributions may illuminate alliances, but do not
            establish motive, control or agreement with every position held by a
            supporter.
          </li>
        </ul>
        <h2>Photographs and equal presentation</h2>
        <p>
          Portland Council portraits use candidate-submitted voters’ pamphlet
          photographs wherever available, with additional images from identified
          campaign, civic-event or news sources. Each brief links to its photo
          source. Images share the same frame and receive no synthetic
          retouching. A placeholder means a suitable portrait has not yet been
          sourced; it is not a judgment about the candidate. Published
          photographs remain the work of their respective owners.
        </p>
        <h2 id="portland-status">Portland Council: what is ready</h2>
        <p>
          Both districts have complete checked rosters: 21 candidates in
          District 3 and 12 in District 4. Thirty-one have substantive current
          policy briefs. Darren McCormick has a limited current filing
          statement; Pham’s current issue pages are now reviewed separately from
          his historical 2024 answers; John J Goldsmith has verified current
          background but needs additional platform research. Thirty-one Council
          portraits are sourced; photographs for McCormick and Goldsmith remain
          outstanding.
        </p>
        <p>
          This supports an openly labeled initial research edition. It does not
          establish a complete investigation of each candidate’s public record.
          The six incumbents have seventeen common roll-call checks; additional
          topics such as transportation funding, Street Response, the oversight
          system’s design, water infrastructure, labor and governance still need
          matched candidate accounts. The race pages link to the Council
          dossiers for this wider context. Independent editorial review remains
          incomplete.
        </p>
        <h2 id="coverage">Coverage, honestly stated</h2>
        <div className={styles.coverage}>
          <div>
            <strong>{races.length}</strong>
            <span>races in this edition</span>
          </div>
          <div>
            <strong>
              {profileCount}/{candidateCount}
            </strong>
            <span>candidates with substantive briefs</span>
          </div>
          <div>
            <strong>{recordCount}</strong>
            <span>profiles with a separate record check</span>
          </div>
        </div>
        <p>
          The public edition covers Portland City Council Districts 3 and 4
          only. Both elect three councilors in November 2026. Research for
          Multnomah, Washington and Clackamas counties and major state and
          federal races is in development and has not been published here.
        </p>
        <p>
          This is a working research edition, not a claim to have reviewed
          everything every candidate has said. Ballot measures and other offices
          are outside this first release. The coverage count describes published
          entries, not all races on your ballot. Pamphlets are not complete
          candidate rosters: candidates can decline to submit a statement.
        </p>
        <h3>Known gaps in this edition</h3>
        <ul>
          {races.flatMap((r) =>
            r.candidates
              .filter((c) => c.missing)
              .map((c) => (
                <li key={`${r.id}-${c.id}`}>
                  <Link href={`/voters-guide/${r.id}#${c.id}`}>
                    {c.name} · {r.title}
                  </Link>
                  : {c.missing}
                </li>
              )),
          )}
        </ul>
        <p>
          Across the remaining profiles, campaign finance, complete roll-call
          histories, past-position changes, independent outcome verification and
          full debate/interview review are not yet complete. On September 19,
          2026, we emailed all 33 candidates in the published District 3 and 4
          races with individual research questions and an invitation to correct
          or clarify their profiles. Sending does not establish delivery or a
          response. An open question is our research question, not a claim that
          a candidate refused to answer it.
        </p>
        <h2 id="guided-comparison">How the guided introduction works</h2>
        <p>
          The optional introduction starts with your priorities, concrete policy
          choices and preferences about relevant experience. It gives no match
          percentage, endorsement or ballot order. The complete research guide
          remains available without answering any questions.
        </p>
        <p>
          The short route asks up to three questions, one per priority, followed
          by optional experience preferences. Extra questions come after
          results. We compare answers with votes on the exact proposal, not
          broad campaign goals. A past vote does not establish a candidate’s
          complete current position. Challengers’ answers to these exact
          proposals are not yet established; their campaign positions remain in
          the full profiles. Each question reports how many candidates have
          evidence. A question affects groups only when at least two candidates
          have recorded votes and those votes differ within the race. “It
          depends,” absence and missing evidence never become agreement or
          disagreement. Individual explanations and the limits of each vote
          remain available. Repeated votes add no weight, and there is no
          overall score.
        </p>
        <p>
          Within each policy group, relevant experience you selected moves a
          candidate forward; otherwise names appear alphabetically. An
          experience requirement limits initial results, with everyone else
          still accessible. Reported roles are labeled and do not establish
          successful outcomes. A missing example does not establish a lack of
          ability. The evidence export includes the question bank and candidate
          mappings.
        </p>
        <p>
          Your answers and shortlist stay in this browser tab’s session storage.
          They are not sent to us or placed in the page address. Reset clears
          your choices. Real first-time-voter usability testing and independent
          editorial review remain outstanding; technical checks are not a
          substitute.
        </p>
        <h2>Sources and reproducibility</h2>
        <p>
          Each profile links to its evidence, with document dates or a clearly
          identified review date. PDF links use the PDF page number, which can
          differ from the printed page label. Retrieved sources are retained as
          research working files. The manifest hashes original PDF and
          spreadsheet downloads and normalized extracted text for web pages; it
          identifies which representation each checksum covers. Policy briefs
          are dated editorial snapshots, not a live feed.
        </p>
        <ul>
          <li>
            <a href={officialSources.portland}>Portland candidate register</a>
          </li>
          <li>
            <a href={officialSources.multnomah}>Multnomah candidate filings</a>{" "}
            · <a href={pamphlets.multnomah}>County pamphlet</a>
          </li>
          <li>
            <a href={officialSources.washington}>
              Washington County candidate list
            </a>{" "}
            · <a href={pamphlets.washington}>County pamphlet</a>
          </li>
          <li>
            <a href={officialSources.clackamas}>
              Clackamas County candidate list
            </a>{" "}
            · <a href={pamphlets.clackamas}>County pamphlet</a>
          </li>
          <li>
            <a href={officialSources.filings}>Oregon candidate filings</a>
          </li>
          <li>
            <a href="https://council.portlandciviclab.org/people">
              Council Lab’s current-term research index
            </a>
            , followed back to official City documents for published vote
            claims.
          </li>
        </ul>
        <p>
          <Link href="/voters-guide/research-log">
            Read the research and corrections log
          </Link>{" "}
          ·{" "}
          <a
            href="/voters-guide/evidence"
            download="oregon-voters-guide-2026.json"
          >
            Download the briefs and evidence links (JSON)
          </a>
        </p>
        <h2 id="corrections">Corrections and candidate responses</h2>
        <p>
          Use the{" "}
          <Link href="/contact?topic=Voters%20guide%20correction">
            Lab’s contact form
          </Link>{" "}
          with the race, candidate, exact sentence, proposed correction and
          public source. Candidates and readers use the same evidence standard.
          A campaign may correct a factual error or add a sourced response; it
          does not control the guide’s analysis.
        </p>
        <p>
          Material corrections should identify what changed, why, the evidence
          and the date. The initial research edition has no published correction
          entries. Subsequent changes belong in the public research log rather
          than silently rewriting the record.
        </p>
        <h2>Independence</h2>
        <p>
          This guide is produced by Portland Civic Lab, an independent
          organization unaffiliated with election authorities. It contains no
          paid candidate placements or endorsements. Read the Lab’s{" "}
          <Link href="/independence">independence and funding policy</Link>. Any
          relevant financial or personal conflict discovered during editorial
          review must be disclosed before a profile is described as fully
          reviewed.
        </p>
      </div>
    </div>
  );
}
