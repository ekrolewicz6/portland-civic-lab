# Governor · topic sweep (September 22, 2026)

Fills the candidate × topic gaps on the ten governor topics (`gov-…` entries in
`src/lib/voters-guide/race-sheet/content/packs/state.ts`) under the standing rules in the council sweep
brief: an explicit statement by the candidate about the topic, the candidate's own words first, reported
quotes second, "partial" when a statement speaks to the topic but not the exact choice, nothing inferred
from party, endorsements or silence. Identical venues were searched for all three candidates. Web
searches were run against the outlets the task names (OPB, The Oregonian, Willamette Week, Statesman
Journal, KGW, KOIN, Oregon Capital Chronicle, KATU, KLCC, JPR); The Oregonian, Statesman Journal and
Register-Guard block our fetcher, so their stories were read through syndication copies (Central Oregon
Daily, Lake Oswego Review, East Oregonian, eClips) where one existed.

## Counts

| Candidate | On record before | Added | Partial (added) | Gaps after |
|---|---:|---:|---:|---:|
| Tina Kotek | 9 of 10 | 0 | 1 (`gov-new-revenue`) | 0 |
| Christine Drazan | 10 of 10 | 0 | 0 | 0 |
| Brett Smith | 2 of 10 | 0 | 0 | 8 |

Entries changed: none. Entries added: one. Tests (`npx vitest run tests/voters-guide/race-sheet.test.ts`,
2,168 passing) and `npx tsc --noEmit -p .` both pass.

## Tina Kotek

| Topic | Status | Source in the pack | Sweep note |
|---|---|---|---|
| Transportation taxes | existing (mixed) | OLIS HB 3991 record; note cites KATU for the January 2026 repeal request | Stronger primary found, entry not changed: the governor's own January 7, 2026 release ("redirect, repeal, and rebuild") and her January 21, 2026 statement, both on the governor's newsroom (see "Primary-source check"). |
| Kicker refund | existing (supports) | OPB, May 19, 2025 (press-briefing quote) | No governor's-office release exists; the same briefing quotes appear in KATU, KGW and Capital Chronicle. Reporting stands. |
| Data-center moratorium | existing (supports) | Governor's release, September 8, 2026 | Primary. |
| Data-center power rates | existing (supports) | OLIS HB 3546 record | Primary. |
| Homelessness emergency | existing (supports) | Executive Order 26-01 | Primary. |
| Climate Protection Program | existing (supports) | DEQ release with her statement | Primary (her quote in a state release). |
| Sanctuary law | existing (supports) | Governor's release, April 9, 2026 | Primary. |
| School instructional time | existing (supports) | Executive Order 26-06 | Primary. |
| New state taxes | **partial (added)** | Her SB 1507 signing letter, April 9, 2026 (Public record) | See below. |
| Interstate Bridge | existing (supports) | Joint statement with Gov. Ferguson, March 17, 2026 | Primary. |

**The added entry.** SB 1507 (2026) disconnects Oregon's tax code from several H.R. 1 tax breaks
(vehicle-loan interest, the qualified-small-business-stock exclusion, most bonus depreciation), expands
the state EITC, and keeps about $342 million the state would otherwise have lost, per the Legislative
Revenue Office estimate reported by the Statesman Journal. Kotek's two-page signing letter to the
Secretary of State says H.R. 1 has "significant consequences for Oregon's ability to pay for essential
services" and that "having Oregon magnify that damage by automatically copying every new tax break in
H.R. 1 is neither fair nor responsible"; it also notes tips and overtime stay untaxed, calls the
disconnect a risk to competitiveness, and promises 2027 legislation on the small-business stock
exemption. That is her own word on state revenue in 2026, but it does not say whether she would propose
new taxes for the 2027–29 gap, and her Chief Financial Office told agencies in February that proposals
must be revenue-neutral. Hence "partial", with the sentence saying what she has not said. A Republican
referendum against SB 1507 ("No Tax Clawback") failed to qualify by the June 4, 2026 deadline, so the
law stands. The PDF is a scan hosted by Silicon Florist (the Department of Revenue's 2026 Summary of
Legislation lists the letter by date but links only to OLIS); no oregon.gov copy was found.

**Gap questions for the campaign (`gov-new-revenue`, to close the "partial"):**
1. Will your 2027–29 recommended budget propose any new or increased state tax or fee to cover the gap
   the Chief Financial Office projected from H.R. 1, or will it hold to cuts and reserves? If revenue,
   which tax?
2. Your SB 1507 signing letter promises a 2027 bill on the small-business stock exemption; would that
   bill be revenue-neutral, and what would it cost?
3. Do you support the Prosperity Council's June 2026 recommendation to raise the estate-tax threshold
   from $1 million to $3 million?

**Venues checked for Kotek:** SoS candidate statements PDF pp. 33–34; tinafororegon.com/oregons-future/
(grepped for tax, revenue, budget, kicker); KATU "Know Your Candidates" index (no Kotek interview
listed); KATU February 2025 sit-down (pre-campaign, video only); KATU September 18, 2025 (decoupling;
her office: "analyzing the recent revenue forecast"); NBC16 September 2025 forecast story; OPB and
Capital Chronicle September 16, 2025 (agencies told to prepare for cuts); Oregon Capital Chronicle via
Rogue Valley Times September 9, 2026 (Prosperity Council hearing); Silicon Florist April 9, 2026 (signing
letter PDF, read in full); Central Oregon Daily / Statesman Journal April 2026 (SB 1507 signing and
referendum); Central Oregon Daily June 2026 (referendum failed); DOR 2026 Summary of Legislation; OLIS SB
1507; governor's newsroom, Transportation category (January 7 and 21, April 23, 2026); Street Roots May
5, 2026 questionnaire (she did not respond); general-election debates (none held yet: October 1 KVAL/UO,
October 7 Medford; she declined the KGW/Oregonian debate).

## Christine Drazan

| Topic | Status | Source in the pack | Sweep note |
|---|---|---|---|
| Transportation taxes | existing (opposes) | KATU "Know Your Candidates" transcript, April 27, 2026 + OLIS vote | Own words; primary. |
| Kicker refund | existing (opposes) | christinefororegon.com/drazan-plan/ | Own words; primary. |
| Data-center moratorium | existing (supports) | OPB Think Out Loud transcript (Sept 14) quoting her KATU interview of Sept 8, 2026 | Second-hand transcript. A standalone KATU page for the Sept 8 segment was not located; The Oregonian's Sept 9 story ("Drazan joins Kotek in calling for data center moratorium") carries the same quote but is blocked to our fetcher. Her own September 4, 2026 campaign release adds, in her name, "we cannot continue to be the Wild West for data center development" but does not use the word moratorium, so it supplements rather than replaces the KATU quote. Entry not changed. |
| Data-center power rates | existing (opposes) | OLIS HB 3546 record (nay vote) | Her own recorded action; primary. |
| Homelessness emergency | existing (mixed) | drazan-plan | Own words; primary. |
| Climate Protection Program | existing (opposes) | drazan-plan | Own words; primary. |
| Sanctuary law | existing (opposes) | KATU transcript, April 27, 2026 | Own words; primary. |
| School instructional time | existing (supports) | drazan-plan | Own words; primary. |
| New state taxes | existing (opposes) | drazan-plan | Own words; primary. Her September 18, 2025 KATU statement against decoupling from H.R. 1 ("an immediate increase in taxes on Oregonians") is consistent and could be added to the note. |
| Interstate Bridge | existing (mixed) | KATU transcript, April 27, 2026 | Own words; primary. Her September 8, 2026 radio-ad release calls the I-5 bridge "over budget by $8 billion" ($6 billion in 2022 to "$15 billion or more") but does not say build, scale back or cancel, so the KATU quote remains the source for the choice. |

No gaps. Nothing to ask that the ladder outreach of September 21 does not already ask.

**Venues checked for Drazan:** SoS candidate statements PDF pp. 35–36; christinefororegon.com home,
/drazan-plan/ and /news/ (six releases August 6 – September 8, 2026; the September 4, September 8 and
August 25 releases read as PDFs); KATU "Know Your Candidates" (April 27, 2026, already cited); KATU
September 18, 2025 (decoupling); Oregon Capital Chronicle via Rogue Valley Times September 9, 2026
(Prosperity Council hearing; her estate-tax remarks); OPB Think Out Loud September 14, 2026; KLCC
September 8, 2026; eClips September 10, 2026 (Oregonian headline only); Street Roots May 5, 2026
questionnaire (she did not respond); KEPW, OPB July 23 and September 16 (Smith pieces, checked for her
quotes); general-election debates (none held yet).

## Brett Smith

| Topic | Status | Sweep note |
|---|---|---|
| Transportation taxes | gap | No statement found on the gas tax, vehicle fees or ODOT funding. |
| Kicker refund | gap | No statement found. |
| Data-center moratorium | existing (supports) | Pamphlet statement p. 31 ("A permanent moratorium on data centers"); site: "Permanent Moratorium … I am the Only anti data center candidate." Primary. |
| Data-center power rates | gap | No statement on the POWER Act or a separate data-center rate class; his moratorium pledge is about siting, not rates, so it does not reach this choice. |
| Homelessness emergency | gap | No statement on the state emergency or shelter funding. His KEPW remark that he "was homeless for a while" is biography, not a position. |
| Climate Protection Program | gap | No statement. |
| Sanctuary law | gap | Near miss, left as a gap: on KEPW he wants to bolster the Oregon Civil Defense Force so the state can "respond" when federal agents "decide that they don't have to get a warrant signed by a judge and they can start kicking people's doors in," and his pamphlet pledges "No unconstitutional surveillance." Neither names immigration enforcement, ICE or the sanctuary law, so it is not an explicit statement on this topic. A human may judge otherwise; see "Least sure". |
| School instructional time | gap | No statement. |
| New state taxes | existing (supports) | Site, "Affordability": the Wage Gap Public Cost Recovery Surcharge; pamphlet p. 31 also pledges "a full audit of our systems and tax code by independent contractors." Primary. |
| Interstate Bridge | gap | No statement. |

**Gap questions for the campaign (contact@brett-smith.us · (503) 826-3412 · form at brett-smith.us):**
1. Transportation: after voters repealed HB 3991's gas-tax and fee increases, would you support raising
   the gas tax or vehicle fees again in 2027 to fund ODOT, or fund roads another way? Which?
2. Kicker: should the state ever hold back part of a kicker refund for other uses (for example
   wildfire costs), or should the full refund always go out?
3. Data-center power rates: do you support the 2025 POWER Act's separate, higher electricity rate class
   for data centers, and would you keep it for the roughly 144 existing sites your moratorium would not
   remove?
4. Homelessness: should the state homelessness emergency and its state-funded shelter beds continue past
   January 2027, and would you keep HB 3644's shelter funding in the 2027–29 budget?
5. Climate Protection Program: keep the declining cap on fuel emissions as re-adopted in 2024, change
   it, or repeal it?
6. Sanctuary law: keep Oregon's sanctuary-law limits on state and local help to federal immigration
   enforcement as they stand, strengthen them, or loosen them? Does your Civil Defense Force proposal
   apply to federal immigration agents specifically?
7. Schools: should the state require districts to keep and add classroom hours even when budgets are
   short, as Executive Order 26-06 does?
8. Interstate Bridge: build the I-5 bridge replacement as planned with tolls, scale it back, or stop it?

**Venues checked for Smith:** SoS candidate statements PDF pp. 31–32 (read in full); brett-smith.us
home (all sections: corruption, Affordability, Data Centers, healthcare, Ports for Peace, defend the
guard, Dark Money amendment text, About me, What I believe, Endorsements, Press, contact), /q-a (one
answer, on disability rights), /endorsements; KEPW "Meet the candidate" August 7, 2026 (read in full);
OPB July 23, 2026 and September 16, 2026 (both read in full; the KLCC and JPR copies are the same
stories); KLCC tag page; Pacific Green "Meet the Candidates for Nomination" (April 10, 2026; three
questionnaire answers, none on these topics); Pacific Green July 18, 2026 nominating-convention
recording (YouTube, no transcript, not reviewed); Ballotpedia (no 2026 Candidate Connection survey;
his 2024 survey and 2024 site pledge are about Congress and do not touch these topics); his X timeline
via the syndication endpoint (101 entries, almost all replies; one September 7, 2026 post, "the protest
vote"); his Facebook page (returns an error page, not readable); Street Roots May 5, 2026 (primary
candidates only; he was nominated in July); KATU "Know Your Candidates" (primary candidates only);
KOIN 2024 interviews (congressional race, not used); Willamette Week and Oregon Capital Chronicle
September 15, 2026 poll stories (his 4%; no quotes); Vote411 (address-gated; the LWV Oregon page gives
no publication date for the general-election guide).

## Primary-source check on existing entries

Checked whether each existing stance has a stronger source in the candidate's own words. Nothing was
found to be wrong, so no entry was changed; these are the upgrades a human may want to make.

| Candidate / topic | Current source | Stronger primary found | Suggested use |
|---|---|---|---|
| Kotek / Transportation taxes | OLIS HB 3991 record; note attributes the January 7, 2026 repeal request to KATU | Governor's newsroom, "Governor Kotek Outlines Next Steps for Oregon's Transportation System," January 7, 2026: she called for repeal of HB 3991, urged redirecting existing ODOT funds in February, and "committed to leading a bipartisan process to develop a comprehensive transportation funding and investment package for the 2027 legislative session," summing it up as "redirect, repeal, and rebuild." Also "Governor Kotek Responds to Legal Analysis on Transportation Repeal," January 21, 2026. | Replace "(KATU)" in the `kotekHb3991` note with the January 7 release, or add it as the note's citation. The stance sentence needs no change. |
| Kotek / Kicker | OPB May 19, 2025 | None. The quotes come from a press briefing; OPB, KATU, KGW and Capital Chronicle print the same lines. | Keep. |
| Kotek / Data-center moratorium | Governor's release | Already primary. | Keep. |
| Drazan / Data-center moratorium | OPB Think Out Loud transcript quoting KATU | Not located: KATU's September 8 segment has no standalone page we could find; The Oregonian's September 9 story is blocked. Her September 4, 2026 release (own words, "Wild West") is on-topic but says nothing about a moratorium. | Keep; if KATU posts the segment, cite it directly. |
| Drazan / Interstate Bridge | KATU transcript, April 27, 2026 | Her September 8, 2026 radio-ad release is own words on the bridge's cost but not on the choice. | Optionally cite it in the note as a later restatement of the cost objection. |
| Drazan / New state taxes | drazan-plan | KATU September 18, 2025 statement and interview against decoupling from H.R. 1. | Optional note. |
| Smith / both entries | Pamphlet statement and site | Already primary. | Keep. |

## Least sure

1. **Kotek / New state taxes, "partial".** The signing letter is squarely about state revenue and is her
   own words, but the topic asks about the 2027–29 gap and the letter is about H.R. 1 conformity. A
   reader could argue the disconnect *is* a revenue-raising choice (Republicans called it a "$300 million
   tax increase") and that "mixed" fits better given her promise of a 2027 QSBS fix; I chose "partial"
   because she has not said what she would do about the 2027–29 gap itself, which is the question. The
   chip "Signed H.R. 1 disconnect" is accurate but terse; "Kept H.R. 1 revenue" is an alternative.
2. **Kotek / New state taxes, source URL.** The letter PDF is hosted by Silicon Florist (a scan of the
   original, dated April 9, 2026, RICOH scanner metadata), not by the state. The DOR page confirms the
   letter exists and its date. If an oregon.gov or OLIS copy surfaces, swap the URL.
3. **Smith / Sanctuary law, left as a gap.** His Civil Defense Force remarks on KEPW (respond when federal
   agents act "without a warrant signed by a judge") and his "No unconstitutional surveillance" pledge
   read, in 2026 Oregon, as being about federal immigration enforcement, but he never says so. Under the
   "explicit statement" rule that is a gap; a reviewer who reads it as a partial should write the
   sentence so it says he does not mention the sanctuary law or immigration enforcement.
4. **Smith / Data-center power rates, left as a gap.** A permanent moratorium on data centers is not a
   position on the POWER Act's rate class for the sites that already exist; treating it as "supports" or
   "partial" would be inference.
5. **Drazan / Data-center moratorium.** The source remains a second-hand transcript (OPB quoting KATU).
   The quote is consistent across OPB, KLCC and the Oregonian's headline, so the entry is not in doubt,
   only the chain of custody.

## Sources fetched and read (this sweep)

- https://sos.oregon.gov/elections/Voters-Pamphlet/Documents/Candidate-Statements.pdf (pp. 31–36)
- https://brett-smith.us/ · https://brett-smith.us/q-a · https://brett-smith.us/endorsements
- https://kepw-wholecommunity.news/2026/08/07/meet-the-candidate-brett-smith-for-oregon-governor/
- https://www.opb.org/article/2026/07/23/oregon-governor-race-third-party-candidate-brett-smith/
- https://www.opb.org/article/2026/09/16/spoilers-happen-in-oregon-will-this-years-race-for-governor-join-the-list/
- https://www.klcc.org/tags/brett-smith
- https://www.pacificgreens.org/meet_the_candidates_for_nomination_brett_smith
- https://www.pacificgreens.org/2026_summer_nominating_convention_recording_now_available
- https://ballotpedia.org/Brett_Smith_(Oregon)
- https://syndication.twitter.com/srv/timeline-profile/screen-name/Brett_Smith_D5
- https://www.streetroots.org/news-stories/2026/05/05/oregon-gubernatorial-candidates-on-housing-and-homelessness/
- https://www.tinafororegon.com/oregons-future/
- https://katu.com/news/know-your-candidates/find-know-your-candidates-interviews-for-oregon-governor-2026-primary
- https://katu.com/news/your-voice-your-vote/watch-the-full-katu-exclusive-interview-with-oregon-governor-tina-kotek
- https://katu.com/news/politics/state-lawmakers-weigh-breaking-oregons-link-to-the-federal-tax-code-as-budget-gap-widens
- https://nbc16.com/newsletter-daily/oregons-budget-faces-significant-shortfall-as-kicker-shrinks-and-future-rebates-uncertain-governor-tina-kotek
- https://rv-times.com/2026/09/09/oregon-lawmakers-preview-koteks-prosperity-council-findings-amid-economic-inflection-point/
- https://www.oregon.gov/dor/pages/2026-summary-of-legislation.aspx
- https://olis.oregonlegislature.gov/liz/2026R1/Measures/Overview/SB1507
- https://siliconflorist.com/2026/04/09/governor-kotek-signed-sb-1507-as-expected-but-she-also-said-something-about-qsbs-that-you-need-to-hear/
- https://siliconflorist.com/wp-content/uploads/2026/04/2026.04.09_SB-1507-Signing-Letter-1.pdf
- https://www.centraloregondaily.com/news/regional/republicans-launch-referendum-after-gov-tina-kotek-signs-tax-bill/article_38cf579d-4a2e-418c-aa32-4f3a358d9a43.html
- https://www.centraloregondaily.com/news/politics/oregon-tax-ballot-referendum-fails-signatures/article_aadbaf82-fab1-5deb-a610-ca9baa223b36.html (Statesman Journal story, June 2, 2026: campaign leaders conceded they would not reach 78,000 signatures by June 4)
- https://apps.oregon.gov/oregon-newsroom/OR/GOV/Posts/Post/governor-kotek-outlines-next-steps-for-oregon%E2%80%99s-transportation-system
- https://apps.oregon.gov/oregon-newsroom/OR/GOV/Posts/Post/governor-kotek-responds-to-legal-analysis-on-transportation-repeal
- https://apps.oregon.gov/oregon-newsroom/OR/GOV/Posts/Post/governor-kotek-convenes-vision-group-to-chart-oregons-transportation-future
- https://www.christinefororegon.com/ · https://www.christinefororegon.com/news/
- https://www.christinefororegon.com/wp-content/uploads/2026/09/RELEASE_-Christine-Drazan-Launches-New-Radio-Ad-Exposing-Billions-in-Cost-Increases-on-Transportation-Megaprojects-Under-Tina-Kotek.pdf
- https://www.christinefororegon.com/wp-content/uploads/2026/09/RELEASE_-Christine-Drazan-Launches-New-Ad-Exposing-Tina-Koteks-Record-of-Tax-Breaks-for-Data-Centers-and-Tax-Hikes-for-Everyone-Else.pdf
- https://statelibraryeclips.wordpress.com/2026/09/10/drazan-joins-kotek-in-calling-for-data-center-moratorium-oregons-gubernatorial-candidates-converged-on-the-issue-within-hours-of-each-other-after-years-of-taking-more-cautious-stances/
- https://www.vote411.org/oregon
