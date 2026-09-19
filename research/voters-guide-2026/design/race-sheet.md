# The Race Sheet: one screen per race

Design proposal, September 19, 2026. Supersedes the race-page layout in `voter-journey.md`; keeps its promise ("understand the choices well enough to make your own") and its rules. Produced from a full read of every published and unpublished race, the editorial standards, five independent design attempts, three judges and three adversarial critiques. Everything below was checked against the data files.

## 1. The problem, measured

| Page | Words shipped | Read time at 230 wpm | Visible before first tap |
|---|---|---|---|
| /voters-guide/portland-district-3 | 48,801 | 3.5 hours | ~120 |
| /voters-guide/portland-district-4 | 44,750 | 3.2 hours | ~120 |
| Hub | 598 | 2.6 min | all |

The entry screen is short. Everything after the first tap is the problem:

- The Council record panel is 21,800 words across 29 topics and covers 3 of 21 candidates. Nine of its topics have no split at all, yet render six near-identical cards each.
- Each incumbent profile is ~6,200 words (73 collapsed decisions). Each challenger profile is 300–665 words, about a third of it caveat boilerplate. The 22-word "research gap" sentence appears 65 times on District 3.
- There is no view where a voter sees the whole field on one issue. Cards paginate four at a time (six pages for D3). Comparison is pairwise, through three different selection surfaces, for a race where the voter ranks candidates for three seats.
- Every candidate is described three times (summary, priorities, issue positions), and nearly every sentence carries its own hedge.
- The page ships 1.6 MB of HTML and hides 99% of it with CSS.

What is already good: every candidate has the same nine base fields; the one-sentence `summary` averages 13–15 words; 87 issue positions exist across the four topics; the six incumbents have 73 checked votes, 29 plain-language topic readings, and nine plain yes/no vote questions (`discovery.ts`) with 25-word contexts already written.

## 2. Thesis

The voter has the ballot on the table and a phone in the other hand. The race page becomes that same list of names, alphabetical, with one short line beside each name, and nothing else on the first screen. Four issue chips swap the line in place, so the whole field is visible on one axis at once. Below the list: four real Council votes phrased as the plain question Council actually decided, with the three sitting councilors' recorded votes and, beneath each, what other candidates have explicitly said about that same choice. A private "My ballot" lets the reader keep and order their own picks; the site never seeds, orders, scores, or shares it. Everything longer than a line is one tap away (an 80-word card), two taps (a 300–500-word brief on its own route, same shape for everyone), or three (the unchanged votes-and-reasons record). Interpretation, caveats and provenance never appear in a shallower layer than the claim they qualify.

Research objects are untouched; the preservation hash stays green. District 3 renders ~720 words by default instead of shipping 48,800.

## 3. The race page, top to bottom (District 3 worked copy)

**A. Header (≤40 words).** "← All races" · H1 "Portland City Council · District 3" · "Southeast Portland: Buckman, Hawthorne, Richmond, Mt. Tabor, Montavilla, Woodstock, Lents… Not your district? District 4 →" (neighborhood list from the City's adopted district map; official lookup as the fallback link) · mono meta "3 seats · 21 candidates · Reviewed Sept 18".

**B. How to vote (≤30 words, sourced).** "You rank up to six names. Ranking more people never hurts your first choice. Ballots mail October 14; return by 8 p.m. November 3." The "six" must be verified against the City's official ranked-choice page before it renders; until then show `race.method` and the official link. Drop-box finder link.

**C. The choice in one paragraph (≤45 words, versioned, human-reviewed, no names, no forced binaries).** "Candidates differ on how far to rely on building new homes versus protecting renters, on the mix of police and unarmed responders, and on taxes versus cuts to keep services running. Many propose some of each." Tap "What this Council can do" → `race.authority` and the unchanged `race.comparison`.

**D. Chip rail (sticky under the site header, 44px tall, horizontal scroll).** [Summary ●] [Rent and homes] [Camps, crime and who responds] [Your bills and taxes] [Streets, buses and air]. One label set in a new `issues.ts`, imported by `explorer.ts` and `council-topics.ts` (today they disagree). Each chip has an (i) showing `comparisonTopics[x].question` and `context`. Beside the rail, a four-word key: "— not found in sources".

**E. The list (21 rows, ~20 words each ≈ 420 words).** Row = Save bookmark (44px) · 32px portrait · name as printed on the register · role, one line · the line. Real rows, default chip:

- Ali Beaudoin · Tax and business consultant · "Wants to apply financial and operational discipline to city government, with small-business growth and long-term economic health as priorities."
- Guy Frankenstein · Human-rights graduate student · "Describes himself as a democratic socialist and calls for confrontational opposition to ICE and large corporations."
- Matthias Hallett · Estate-planning attorney · "Argues that police staffing, faster permitting and a more competitive business tax structure are prerequisites for Portland's recovery."
- Esther León · Physical therapist; college professor · "Proposes a larger public role in housing, utilities, climate protection and non-police crisis response."
- Tiffany Koyama Lane · Councilor since 2025; former teacher and union organizer · "Identifies as a democratic socialist and emphasizes workers, renters, immigrant protections and public participation."
- Darren McCormick · Writer and discussion organizer · [Filing statement only] (tap: his quoted filing language, attributed, with the existing "That is his language" line).

The default line is the existing `summary` field, clamped to two lines, and labeled in the About strip as "our one-line summary of what each candidate says". It needs no new authoring (max 28 words, Pham; everyone else ≤20) and it avoids two traps the critiques caught: presenting our paraphrase as the candidate's words, and elevating whichever priority the researcher happened to list first.

Tap [Rent and homes]: rows keep position; only the line changes. Hallett "Speed up permits; set deadlines when applications stall." · León "Build social housing, simplify zoning, tax large landlords' vacant units." · Koyama Lane "Publicly owned housing as an alternative to for-profit landlords; keep rental assistance." · Beaudoin, Frankenstein, Parker "—". A computed status line: "12 of 21 have a housing position in the sources we reviewed." Rows never paginate, sort, or hide.

**F. Four votes that split this Council (≤150 words).** Intro: "Only Koyama Lane, Morillo and Novick sit on Council today. The other 18 have no votes yet; that is not a judgment." Then four rows, each the plain question from `discovery.ts` with its 25-word context behind (i):

| Question Council decided | Koyama Lane | Morillo | Novick |
|---|---|---|---|
| Spend less on clearing camps to fund other services? | Yes | Yes | No |
| Raise water bills by about $5 a month? | No | No | Yes |
| Use expected police-oversight savings to fund police and firefighters? | No | No | Yes |
| Back the starting terms for renovating Moda Center? | No | No | Yes |

Votes render as the word (Yes / No / Absent / Not on committee) with the "Voted" glyph, never as color alone. Each row carries its `limit` sentence behind the (i) ("This was a spending amendment, not a vote to repeal the camping ban"). Any Moda row links to `/independence` inline. Tap a row → the three `councilReaderCopy` headlines under "Our reading of the record" → "Read the votes and their reasons →" (`/votes#…`).

The four are chosen editorially per district and the rule is printed in About: "the most reported and most divided votes, phrased as the question Council decided; the full record of 29 topics is one tap away." District 4 (Clark, Green, Zimmerman): homebuyer income limit (Y/Y/N), water bills (Y/Y/N), street repair fee (Y/Y/N), Moda terms (Y/N/Y). A computed "most split" rule was tested and rejected: it puts "Council powers, offices & oversight" on both pages by alphabetical tie-break and drops camps and Moda entirely.

**G. What other candidates have said (under each vote row, collapsed by default).** For the same question, an alphabetical list of challengers whose sources contain an explicit statement about that exact choice, each with a ≤10-word paraphrase, the "Said" glyph and a source chip. Moda, D3: Hallett "an agreement to retain the Blazers" · Sweeney "oppose spending to keep the Blazers" · Ward "reject Moda renovations". (Koyama Lane and Novick also have statements, but they are incumbents and appear only in the Voted column.) Then "Not addressed in their sources (15)". No group labels, no sides: the reader's eyes do the grouping. Only explicit statements about the exact proposal qualify (the retired quiz's own rule); broad goals never do. About 15 placements exist in the data today; each needs a `from` reference and a reviewer.

**H. My ballot tray (fixed above the bottom bar).** "3 saved · Open my ballot". Appears after the first save.

**I. About strip (≤60 words).** "Same questions for everyone, A–Z. Lines are our one-line summaries of what candidates say; tap a name for their statement and our sources. We do not endorse, rank or score. Reviewed September 18, 2026; AI-assisted, human review not yet complete. Standards · Suggest a correction · Research gaps · Print everything."

**Bottom bar:** List · My ballot · Votes · About (existing fixed-bar pattern, `--race-navigation-height`).

**Budget.** Default render ≈ 720 words. Path to three saved names ≈ list 420 + one chip flip 250 + four votes 150 + three cards 240 ≈ 1,060 words and 6–8 taps, against 3,500–9,000 words today. These are targets for the first-time-reader test, not claims for the page.

## 4. The candidate unit

**Row (≤24 words):** name · role (≤6 words; `background` clamped, with an authored override for the three long ones: McCormick, Pham, Goldsmith) · line (`summary` clamped, or a reviewed ≤14-word issue line, or "—", or one of two missing states). Incumbency is text in the role, not a badge, so every row has the same shape.

**Card (≤100 words, inline `details` expansion under the row, no bottom sheet):** portrait 56px · name · background · summary · up to three priorities as bullets · "Our reading:" value tags **and** the tradeoff sentence together (tags alone read as ideological labels) · one source chip chosen explicitly per candidate (`primaryStatement`, never `sources[0]`, which is the City roster for three people) · [Save] [Full brief →]. With a chip active, the card adds that issue's full position with its remainder sentence ("Specific cuts and tax changes are not established in the reviewed announcement") so the hedge lives next to the claim, never on the row. Incumbents add "See their Council votes ↓".

**Brief (`/voters-guide/portland-district-3/esther-leon`, 300–500 words, one skeleton for everyone):** the existing `Profile` article from `CandidateComparison.tsx`, research text unchanged: summary, priorities, interpretation and tradeoff, four issue positions with full source notes, the open question, all sources with kind/date/note. Minus the "Nonpartisan office" eyebrow. Incumbents' record block becomes the four vote rows plus "All 29 topics →". Challengers: "No Council vote yet. That is not a judgment." Record entries without a `decisionId` (Pham's dated 2024 answers) render as "Earlier statement" with date. Brief pages get a fixed-template title, the district share card (no portrait), and an explicit index decision logged in the research log.

**Two missing states, one visual treatment, same color as any chip:** "Filing statement only" (McCormick: quote on tap; his safety line may appear on that chip because it exists) and "No platform found" (Goldsmith: background only, card carries the existing missing sentence). Anderson is not missing: normal row, "—" on all four chips, card line "Statement is biographical; no issue positions found."

**Source chips** (`sourceChip(evidence)`, a pure function keyed by URL host): PAMPHLET p.60 · SITE · FILING · QUESTIONNAIRE · POST · RECORD. The chip is a button that expands kind, date and the provenance note, keyboard-reachable. This moves the 25-word pamphlet note out of every line without losing it.

## 5. My ballot

Reader-owned, private, and the only place the reader's judgment lives.

- Six numbered slots mirroring the ballot (once "six" is sourced), tap-to-reorder, an optional 12-word private note per name. Label: "Your order. Stored only in this browser tab. The site never fills, sorts or shares it."
- A printable "ballot card" (District 3 · 1st…6th · return by 8 p.m. Nov 3) carrying only the reader's order. No portraits, no site copy beyond the deadline.
- Each saved name shows its summary line, the four issue lines, and for incumbents a labeled "Voted" block with the four rows. Stacked blocks, never two 170px columns on a phone.
- State: `sessionStorage["pcl-ballot-{raceId}"]`, validated against the race's candidate ids on read, try/catch everywhere, in-memory fallback with the existing "cannot save after reload" line. No localStorage. Nothing in any URL, screenshot label, or analytics event.
- Legacy `#compare?people=` links open a transient "Shared view: A, B · sent to you" panel that is not written to storage and offers "Save these to my ballot". No URL can populate the list (e2e assertion).

This requires one sentence on the methodology page distinguishing a reader's own list from a site ranking. If the owner prefers not to add it this cycle, the fallback is the same tray, alphabetical only, labeled "You decide the order on your ballot." The ordered version is recommended: a District 3 voter must write six names in order, and stopping one step short of the ballot is where the current page loses them.

## 6. Depth path

Row → card → brief route → source chip → vote row → three headlines → `/voters-guide/portland-district-3/votes` (a split-sorted matrix of the 16 split topics with the `contrast` sentence per row, agreement topics listed rather than collapsed, budget row open by default, above the unchanged `CouncilDisagreements` panels and `DecisionExplanation` cards) → `/print` (header, key, all five columns, the matrix with every decision open, every brief in full). `/voters-guide/evidence` exports the overlay with its version so reviewers can diff every line against its parent field. Legacy hashes redirect: `#{candidateId}` → brief route; `#disagreement-{id}` → votes route.

## 7. The hub

Ballot-first. Keep the H1 and election box. Replace the 60-word "Working research edition" box with one line and a link. One row per published race: title, neighborhood line, "21 candidates · 3 seats · rank up to six", the race's choice paragraph, four chip deep-links (`#issue=housing`, validated like `sharedComparison`). Hide search and the inline name paragraphs while two races are published; remove the portrait mosaics; keep the dates block and the geography filter for later releases. Note that the uncontested City Auditor race is on the same ballot.

## 8. Unpublished races on the same template

The template depends only on fields all 48 races already have (`title, jurisdiction, seats, method, authority, stakes, comparison, rosterSource, rosterStatus`; per candidate `name, background, summary, priorities, interpretation, question, sources`). Optional overlays add sections only when present: `analysis` (chips appear only when any candidate has issue positions), `record` with `decisionId` (votes panel and route), `portrait` (initials otherwise), `missing` (mapped to the two canonical states in an overlay, not by editing the four `pending()` helpers).

Voting instructions are never derived from seat counts (README rule 5; Oregon City is deliberately deferred; Beaverton's runoff lives in `jurisdiction`, not `method`). Add `ballotInstruction: { text, source }` to `Race`, populated only from a checked ballot or county instruction; otherwise render "Follow the instructions on your official ballot." A row line requires a source dated this cycle; stale-site candidates (state.ts flags two) render "—" with the dated note on the card. Minimum to publish a race: the nine race fields, a reviewed choice paragraph, `rosterStatus` "Official list checked", and `summary` or a missing state for every candidate. Hub badge "In research" until issue lines exist.

## 9. Editorial rules and caps

- Every overlay line carries `from` (the parent field) and a source; a build test fails if the parent is empty or its hash changed after the overlay's version date.
- A line may omit, never add. Attribution verbs are allowed (supports, opposes, would); reporting verbs are not (emphasizes, calls for, prioritizes). When a source states a standard or emphasis rather than a proposal (Beaudoin, Landgraver, Tucker, Sollitt, Torres on money), the row shows a "Wants …" line that names the standard and never a commitment or a cuts claim; the card carries the full position with its hedge. *Amended September 19, 2026 (owner decision): the original rule showed "—" for these five; a documented emphasis is a position, and a dash would misreport it as a gap.*
- No vote language in a "Said" line; no statement inside a "Voted" cell. Test both.
- No "X, or Y" dichotomies in the choice paragraph. Test it.
- Banned on rows and chip labels without a parenthetical: zoning, permitting, vacancy tax, social housing, PCEF, Bull Run, Zenith, term sheet, appropriation, oversight, escalation, unarmed response. Glossary terms render as `<dfn>` on first use from `glossary.ts`.
- Nothing from a deeper layer appears in a shallower one. Alphabetical everywhere. No preselection. Identical missing-state markup. No numeral beside a name at 320px (screenshot test).
- Hard cases reviewed by two people before their chips enable: Ward, McCormick, Pham, Goldsmith, Anderson.
- No public claim of a reading grade or time-to-decision until the first-time-reader tasks run.

| Field | Cap | Source |
|---|---|---|
| Choice paragraph | 45 words, no names, no dichotomy | `race.comparison` rewrite, versioned |
| Row line, default | 2-line clamp | `summary` |
| Row issue line | 14 words, dated this cycle | `analysis.issues[x].position`, authored, `from`, `reviewedBy` |
| Row role | 6 words | `background` clamped or override |
| Card | 100 words (+ ≤60 active issue) | existing fields |
| Brief | 300–500 words | `Profile` article |
| Vote row question | `discovery.ts` title | existing |
| "Said" placement | 10 words, explicit statement only | authored, `from`, `reviewedBy` |
| Headline | 11 words | `councilReaderCopy` (verified max) |
| About strip | 60 words, once | new |
| My ballot | 6 names, reader-ordered | reader |

Editorial work this creates, with counts: 87 issue lines (48 exceed 14 words today, so this is a rewrite, not a trim), 2 choice paragraphs, ~15 "Said" placements, 8 featured-vote selections, 3 role overrides, 2 neighborhood lines, 1 sourced ranking limit, 1 district-lookup URL. Chips ship per race only when every line for that race has `reviewedBy`; the list, votes panel and My ballot ship without them.

*Amended September 19, 2026 (owner decision): the chips shipped on both races before human review, with every line marked `reviewedBy: "pending"` and a "human review pending" disclosure on the race page, the hub, the print edition and the research log. The gating sentence above is retired for this cycle; reviewer names still land per line, and the hard-case two-person review in the bullet list still applies before a line is described as reviewed.*

## 10. Privacy fixes the current page already needs

- GA4 sends `page_location` with the fragment, so `#issue=` and legacy `#compare?people=` reach Google today. Set `page_location` without the hash (or `send_page_view: false` plus a stripped manual event) and confirm enhanced-measurement history tracking is off.
- `prefetch={false}` on every link inside My ballot and cards, or the reader's saved names hit the CDN logs as prefetched brief routes.
- Methodology sentence: "Page views, including candidate brief pages, are recorded by our analytics; your saved list and chip choice are not."

## 11. What to cut

The 78-word welcome and its 2×2 buttons; 4-per-page pagination; the three selection surfaces and their two CustomEvents; the Compare studio (selects, seven topic buttons, 73 re-rendered decision cards); the About hero, tiles and tagline heroes; the gap sentence outside cards (65 occurrences); per-source notes and per-decision limits outside the depth layer; "Nonpartisan office"; the open question outside the brief; the 21,800-word Council record as default; in-page profiles (1.6 MB); hub name paragraphs, mosaics, search and caveat box; the vocabulary "brief / quick comparison / full records / Decisions & reasons" (now List, Card, Full brief, Votes, My ballot). Not built: agree/disagree marks, camp labels, a priority-picker gate, Council-choice columns across the whole field, "no specifics" chips, localStorage, a third full-voice rewrite of every profile.

## 12. Implementation plan (ballots mail October 14)

**Week 1, by September 26: foundations, no visible change.**
`src/lib/voters-guide/issues.ts`, `glossary.ts`, `race-sheet.ts` (versioned overlay: choice paragraphs, issue lines with `from`/`reviewedBy`, role overrides, missing-state map, `primaryStatement`, "Said" placements, featured votes per district), `council-splits.ts` (`splitIssues(race)` for the votes route), `ballot.ts` (`sourceChip`, `rowLine`, `ballotInstruction` rendering), `ballot-store.ts` (validated sessionStorage). Vitest cap and rule tests under `tests/voters-guide/`. Move the preservation-hash test to its own spec before touching `voters-discovery.spec.ts`. `[race]/print/page.tsx` first (the print e2e depends on it), then `[race]/[candidate]/page.tsx` (extract `Profile` into `CandidateBrief.tsx`) and `[race]/votes/page.tsx` (`VoteMatrix.tsx` above unchanged `CouncilRecord.tsx`). GA fragment fix. Overlay added to `evidence/route.ts`.

**Week 2, by October 3: the race page.**
`RaceSheet.tsx` (list), `CandidateRow.tsx` + `CandidateCard.tsx` (reuse `CandidatePortrait`, `Source`), `FourVotes.tsx` (reuse `strong[data-vote]`, `DecisionExplanation`), `SaidStrip.tsx`, `MyBallot.tsx` (reuse `.floatingActions`, `ShareGuide`), `AboutStrip.tsx`, `Term.tsx`, `race-sheet.module.css`. `RaceNavigation.tsx` reduced to the tray and the hash redirect map. Hub edits. Chips enabled per race as `reviewedBy` lands. Rewrite `voters-*.spec.ts` around rows, chips, saves, votes, routes: every candidate on every chip; identical gap glyph; list never pre-filled by any URL; share URL has no query and ≤3 ids; storage failure keeps saves working; 320/390/768 no overflow.

**Week 3, by October 10: test with readers, then ship.**
Run the tasks in `voter-journey.md` with 6–8 first-time readers on the Week 2 page (choose a chip, explain one difference, open a source, save two names, order them, print). Fix what they trip on. Rewrite methodology `#guided-comparison` and the incumbent-view sentence; add the reader-list and analytics sentences; log the overlay version and the design change in the research log; delete `CandidateDiscovery.tsx`, the compare studio and the About hero. Ship. County and city races on the template are a stretch goal after October 14, not before.

## 13. Decisions for the owner

1. **Reader-ordered My ballot now, with the methodology sentence?** Recommended: yes. Fallback: alphabetical this cycle.
2. **Featured votes chosen editorially and disclosed, rather than computed?** Recommended: editorial. The computed rule was tested and produces arbitrary, wonkish rows.
3. **Who reviews the 87 issue lines, 2 paragraphs and 15 placements, and by when?** Chips cannot enable for a race until its lines carry a reviewer name. If no reviewer exists, ship the list with the summary line only; it is still a large improvement. *Decided September 19, 2026: the chips shipped before human review, disclosed on the page and in the research log (see the §9 amendment). Reviewer assignment remains open.*
4. **Campaign finance totals (ORESTAR, dated) as a labeled fact line?** Every major Oregon guide shows it and it is how real voters shrink 21 names; the methodology permits labeled facts. Recommended: defer to after October 14 unless a reviewer can source 33 numbers in a day.
5. **A slot for candidates' answers to the September 19 outreach?** Recommended: yes, an optional `answers[]` field rendered on the card as "In their words", with "No reply yet (asked Sept 19)" as a state distinct from "—".
6. **Spanish edition of rows, votes panel and ballot card?** Out of scope for this cycle; note it as a known gap in About.

## Shipped · September 19, 2026

Built as specified above with these deviations, all recorded in the evidence export (`raceSheet` block):

- The default row line is the existing `summary` field (clamped to three lines), not `priorities[0]`. No new authoring, no false "first priority" claim.
- 87 issue lines, 2 choice paragraphs, 25 role overrides, 33 primary-statement choices, 2 district lines and 2 sourced ballot instructions were authored; every line names its parent field and is marked `reviewedBy: "pending"` until a human reviewer signs it. The chips are enabled with that disclosure on the page and in the research log.
- Only 3 explicit "Said" placements survive in the data (Sweeney and Ward on Moda in District 3; McDonald on Moda in District 4). Two more shipped on the first day and were struck the same day by the editorial audit: León on camp funding rested on a general "opposes sweeps" position, not on the $4.3 million amendment, and Hallett on Moda concerned keeping the team, not these starting terms. No challenger has an explicit statement on the camp-removal amendment, the water rate, street fee or oversight-savings votes; the strips show the honest count instead.
- Featured votes per district: District 3 camp-removal funding, water rates, oversight savings, Moda; District 4 water rates, street fee, oversight savings, Moda.
- The votes panel shows each councilor's recorded vote as the word, and under each featured vote a block labeled "Our reading of the record" carrying the `councilReaderCopy` headlines (§3.F). A first-day block labeled "What they did · public record" that printed the `decisionAccounts[].choice` phrases was removed on September 19 after the audit found several of those phrases were characterizations, not record.
- The choice paragraph is labeled "Our reading" on the race page and hub and carries "Draft; human review pending." until it is reviewed; the print edition already said so.
- The District 3 neighborhood line is headed "Southeast and inner Northeast", not "Inner Southeast" as first shipped: the City page's 21-name list includes Northeast neighborhoods (Laurelhurst, Rose City Park, Roseway, Beaumont-Wilshire, Madison South). Roseway and Mt. Scott-Arleta were added so the outer edges are represented; every name on the line is on the City page, checked September 19.
- My ballot ships reader-ordered with private notes and a printable ballot card; the methodology page now distinguishes the reader's list from a site ranking.
- Analytics no longer receive URL fragments; brief links inside My ballot do not prefetch.
- Rendered words on District 3: ~3,950 including closed cards and the votes panel, versus 48,801 shipped before; the page is about 70 KB gzipped.

Still outstanding: human review of the overlay lines; the first-time-reader tasks in `voter-journey.md`; candidate replies to the September 19 outreach (an `answers` slot exists); county, city, state and legislative races on the same template.

