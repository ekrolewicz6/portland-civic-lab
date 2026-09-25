# Summary audit, September 25, 2026

A reader showed that Kellie Torres's safety chip, "More police investigations," overstated her source (fixed in PR #40) and argued that the summaries lean once you follow the cites. This pass tested that claim against every summary in the published guide.

## Scope

- 48 published races, 153 candidates.
- 472 documented issue positions, each with its row line and grid chip (`council-analysis.ts`, `lines.ts`, `stances.ts` and the race packs).
- 607 topic-board stances: stance value, chip and sentence (`topic-stances-d3.ts`, `topic-stances-d4.ts` and each pack's `topicStances`).
- 282 distinct cited sources. Campaign pages were read live on September 24–25, 2026. Pamphlet citations were read on the cited PDF page (county pamphlets from the local copies in `runtime-data/voters-guide-2026/`; the Secretary of State's 394-page candidate-statements PDF was downloaded fresh). Votes were checked against minutes, OLIS measure histories (the Overview pages returned HTTP 500, so the Legislature's API was used), House and Senate roll calls. Replies cited to the research log were checked against the stored excerpts and, where an excerpt was not enough, the full email.

Not in scope: delivery rungs (how and measured by), tradeoff and summary paragraphs, own-words openings, and the stakes blocks.

## Method

Eleven auditors each took a group of races and compared every item with its source under the rules in `auditor-instructions.md`: flag an item only if it (a) adds a claim or intensity the source lacks, (b) drops a qualifier that changes meaning, (c) uses loaded framing the candidate didn't use, or (d) picks a stance value the words don't support. They also flagged factual errors and wording that is accurate but sits on a different page than the one cited. They returned 305 flags: 129 confirmed, 176 borderline (`findings/*.json`). The lead checked each quote against the saved source text, decided each one, and applied the edits with a script that fails unless the old text matches exactly once in the right slot. `findings.md` lists every flag with the source quote and the outcome. `decisions.json` has every edit (old and new text) and every item kept, with the reason.

## Outcome

- 493 edits for 118 candidates: 114 positions, 98 lines, 46 chips, 115 topic sentences, 57 topic chips, 46 stance values, 17 re-cited sources.
- 74 candidates' research objects changed (positions or their sources), and only those 74 preservation hashes were re-recorded. `e2e/voters-preservation.spec.ts` passes.
- 14 flags were reviewed and kept (see `decisions.json`, "kept").
- One research-log correction entry (`#summary-audit-2026-09-25`) lists the changed candidates by race.

## What the errors looked like

The errors ran in both directions and did not favor one party.

- **Commitment inflation.** "Explore" became "would" (Beaudoin's rate help, Cronlund's office conversions, Tiemann's subsidies, Fai's fees and levies). "Consider a short-term reduction" became "trimming" (Zimmerman). A complaint became a pledge (Lancaster's "programs that grow even when they fail"). "Identify rules and fees" became "repeal" (Drazan).
- **Dropped qualifiers.** "Unnecessary" (Helm, La Barr, Baker), "growth of" taxes (Garino), taxes "on working families" (Hubbell), "unconstitutional" raids (Dexter), "hidden" fees (Bangs), "one-time" and "up to" amounts, "with a few exceptions for hunting rifles" (Reynolds), "not just" profitability (Mead), "if we maintain urban renewal" (Nicita).
- **Words the candidate didn't use.** "Clear" public spaces for "clean up" (Drazan), "purge" for "verify" (Reaksecker, and the Clackamas clerk topic question itself), "public housing" for "social housing" (León, Beausoleil Smith), "ban" for "moratorium" (Brett Smith), "Back the police" for "supporting" (Goodhouse, Miles), "giveaways" (Ong Norris).
- **Softening.** "Data-informed enforcement" became "responses" (Leake); a filing's harsh wording became a mild paraphrase (McCormick); "bleed every billion dollar company" became "larger contributions" (Frankenstein); "maintaining a strong emergency response system" lost "strong" (Otero).
- **Stance labels.** 46 changed. Most became "partial" where the words speak to the topic without reaching its exact choice.
- **Wrong page.** The wording was the candidate's but came from a different page of their own materials than the one cited. Where one page held the whole summary it was re-cited; otherwise the summary was trimmed to the cited page.
- **Facts.** Drazan voted aye on HB 3546's first House passage (April 22, 2025; 41 ayes, 16 nays, 3 excused, and she is in neither list) before voting no on June 5. Piazza voted for Gresham's rate resolutions but did not move them. Bynum introduced the BILL Drivers Act on July 9, not July 10. Kocher's transportation sentence named TriMet southwest expansion and bike-lane barriers on Murray, Scholls Ferry and Lombard that appear on no page of hers (live site, home page, Wayback copies, pamphlet); it now follows her pamphlet. Kotek's executive order on school time directs rulemaking rather than barring cuts, and the Interstate Bridge statement never mentions tolls.

## Consistency rulings applied across races

- **Street Response 24/7:** a statement that supports Street Response but does not address a 24/7 role is "partial" (Arnold, Zimmerman and Novick, matching Hilton, Kelly and Evenstar).
- **Camp removals at current funding:** enforcement statements that do not reach funding are "partial" (Clark, Legree, matching Beaudoin, Hilton, Parker and Ward). Zimmerman keeps "supports" on his pamphlet's "YES to Camp Cleanups"; Anderson and Novick keep theirs.
- **Data centers:** "fair share," "unchecked growth" or "rules are insufficient" without a remedy is "partial" (Marugg, Rieke Smith, Mead, Muñoz, Adair). A blanket "no" that never names the moratorium is "partial" on moratorium questions (R W Smith, Nicita).
- **Budget gaps:** a precondition ("before asking taxpayers for more") is "mixed" (Carkin, as Beaudoin); a tax shift filed under "cutting taxes" is "partial" (Sugar).
- **One source per sentence:** topic sentences that pulled a clause from a second source were trimmed or re-cited so the cited page holds the whole sentence.

## Auditor errors caught in review

- David Russ: two flags said "the border is now secured" and "after federal lands are returned" were not in his reply. His full September 24 email (Gmail) says "The border is currently secured" and "Returning those lands to the States will ensure that they are properly managed." Both clauses stay; only his ICE-funding stance moved to "partial," because "sufficient funding" doesn't say whether $70 billion is that amount.

## Access notes

- The District 4 auditor read full candidate replies in Gmail (read-only; nothing sent). For Matt Schulte it used a `.docx` saved by an earlier session's scratchpad; it matches the email by date but was not confirmed to be the same file.
- The lead read two Gmail threads (Ali Beaudoin, David Russ), read-only.
- Fetched source texts (including those email replies) are kept out of the repo in `runtime-data/voters-guide-2026/summary-audit-2026-09-25/`.

## Open items

1. **Pronouns.** The guide called Ali Beaudoin "she"; Beaudoin's own materials state no pronoun and the Mercury profile uses "he." Beaudoin's public copy is now pronoun-free. Other candidates' pronouns were not audited in this pass and may also have been inferred from names.
2. **Tom Sollitt's climate column** still shows his September 22 streets answer; the climate answer he sent September 23 is logged but not folded into the column.
3. **Keir Legree:** two clauses ("a public-benefit test before major projects begin" in money; "evaluated for use, safety, cost and system impacts" in climate) were not matched to the stored excerpts. His full reply is off-repo; we haven't checked those two against it yet.
4. **Caveat sentences** ("not independently established," "not established in the reviewed statement") appear only in the original District 3 analysis, spread across the field (Beaudoin, Frankenstein, Kelly, Koyama Lane, Landgraver, León, Parker, Pham, Torres, Ward). They were left as they are. A later pass could make them uniform or drop them.
5. **Unverified in cited sources** (flagged by auditors, not changed): Stovall's $924,981,292 budget figure and fund-balance draw; Salgado's $726,000 vote; Marl's May 2025 budget framework; several Gresham and Hillsboro dates listed in `findings/b10-gresham-beav-hills.json` notes.
6. Kotek's money chip "Ban personalized pricing" wraps to three lines at desktop width.
