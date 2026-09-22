# Depth pass: the seven federal races (September 22, 2026)

Scope: U.S. Senate and U.S. House districts 1–6 (src/lib/voters-guide/race-sheet/content/packs/federal.ts). The pack
now carries one shared `RaceTopics` entry (eight topics, ids `fed-…`) for all seven races, 86 `topicStances`, and one
`RaceStakes` per race (8 items each, built from 11 shared, sourced items). Reviewed fields: reviewedOn 2026-09-22,
reviewedBy pending. Type check and `tests/voters-guide/race-sheet.test.ts` (2,168 tests) pass.

Method. Congress's own record came first: every House vote is cited from the Clerk's roll-call page
(clerk.house.gov/Votes/…; the XML at clerk.house.gov/evs/… was read for each Oregon member's vote) and every Senate vote
from senate.gov's roll-call page (the XML was read for Merkley's vote). An incumbent's recorded vote is the stance
("Public record"; the page labels it "What they did"), one per candidate per topic, always with the caveat that a
package vote is a vote on the whole bill. Challengers' stances come from the Secretary of State's filed candidate
statements PDF (extracted locally with pdftotext, pages 1–30), their campaign sites, and, where 2026-dated, their
Ballotpedia Candidate Connection survey. Nothing is inferred from party, endorsements or silence. The session's
web-search budget ran out after the first sweep of live issues, so the rest of the research went through direct fetches
(WebFetch, and curl for hosts that refuse WebFetch: Ballotpedia, GovTrack, KFF). Oregon Capital Chronicle and
congress.gov block both and are listed as unchecked where relevant.

## The eight topics (shared by all seven races), with the URL behind each context

- fed-hr1-medicaid · Medicaid and SNAP cuts · "Keep H.R. 1's Medicaid work rules, six-month renewals and SNAP cuts, or
  repeal them?" — https://www.oregon.gov/oha/hsd/ohp/pages/federal-changes.aspx (rules start 2027 for adults 19–64;
  80 hours a month or $580 a month; six-month renewals late 2027), https://www.opb.org/article/2026/07/29/think-out-loud-oregon-health-plan/
  (about 600,000 adults checked; 100,000–200,000 could lose coverage; $718 million–$1.4 billion a year federal loss;
  1.4 million on OHP), https://www.wweek.com/news/health/2026/09/14/as-federal-law-kicks-in-oregon-health-plan-will-for-thousands-soon-be-harder-to-get/
  (200,000 over a decade; $421 million 2027–29 shortfall). Votes: https://clerk.house.gov/Votes/2025190 (218–214,
  July 3, 2025; Bentz Aye, the five Democrats No) and https://www.senate.gov/legislative/LIS/roll_call_votes/vote1191/vote_119_1_00372.htm
  (50–50 plus the vice president, July 1, 2025; Merkley Nay).
- fed-aca-credits · ACA premium credits · "Restore the enhanced ACA premium tax credits that expired December 31, 2025?"
  — https://clerk.house.gov/Votes/202611 (H.R. 1834, 230–196, January 8, 2026; Bentz Nay, the five Democrats Yea),
  https://www.senate.gov/legislative/LIS/roll_call_votes/vote1191/vote_119_1_00644.htm (cloture on S. 3385 failed
  51–48, December 11, 2025; Merkley Yea), https://www.govtrack.us/congress/bills/119/hr1834 (no Senate action as of
  September 22, 2026), https://www.govtrack.us/congress/bills/119/s3385 (Lower Health Care Costs Act, Schumer),
  https://www.kff.org/affordable-care-act/state-indicator/marketplace-enrollment/ (Oregon plan selections 139,688 for
  2025, 118,372 for 2026).
- fed-tariffs · Tariffs · "End the tariffs and take tariff power back from the president?" —
  https://en.wikipedia.org/wiki/Learning_Resources,_Inc._v._Trump (6–3, February 20, 2026; IEEPA tariffs ended
  February 24; 10% Section 122 surcharge to July 24, 2026; Section 301 duties of 10–12.5% on about 60 countries),
  https://en.wikipedia.org/wiki/Tariffs_in_the_second_Trump_administration (same sequence; 12.1% average effective rate
  July 21, 2026), https://statt.com/blog/section-122-tariff-expiration-what-businesses-need-to-know/ (July 20, 2026: no
  extension enacted). Votes: https://clerk.house.gov/Votes/202665 (H.J.Res. 72, 219–211, February 11, 2026; Bentz Nay,
  the five Democrats Yea), https://www.senate.gov/legislative/LIS/roll_call_votes/vote1191/vote_119_1_00600.htm
  (S.J.Res. 88, 51–47, October 30, 2025; Merkley Yea).
- fed-ice-funding · ICE and border money · "Fund the $70 billion expansion of ICE and Border Patrol through 2029 (the
  Secure America Act)?" — https://www.americanimmigrationcouncil.org/fact-sheet/whats-in-the-secure-america-act/
  ($69.5 billion through September 30, 2029: ICE $38.5 billion, CBP $26 billion, DHS $5 billion; no detention
  guardrails), https://www.govtrack.us/congress/bills/119/s2 (CRS summary: $70 billion through FY2029; Public Law
  119-98, signed June 10, 2026), https://en.wikipedia.org/wiki/2026_United_States_federal_government_shutdowns
  (January 31–February 3 and February 14–April 30, 2026), https://www.portland.gov/federal/federal-troops (Judge
  Immergut's November 7, 2025 order; December 31 withdrawal announcement). Votes: https://clerk.house.gov/Votes/2026214
  (214–212, June 9, 2026; Bentz Aye, the five Democrats No), https://www.senate.gov/legislative/LIS/roll_call_votes/vote1192/vote_119_2_00163.htm
  (52–47, June 5, 2026; Merkley Nay). Also read: https://clerk.house.gov/Votes/202642 (H.R. 7147, DHS appropriations,
  220–207, January 22, 2026, same split) and https://bynum.house.gov/media/press-releases/congresswoman-bynum-votes-against-dhs-funding-bill.
- fed-iran-war · Iran war powers · "Direct the president to end U.S. military involvement in the war with Iran?" —
  https://en.wikipedia.org/wiki/2026_Iran_war (strikes began February 28, 2026, "Operation Epic Fury"; renewed
  hostilities from September 1), https://rollcall.com/2026/07/23/23warpowersvote/ (H.Con.Res. 89 214–208; S.J.Res.
  180 failed 47–49; July 10 notice that fighting resumed). Votes: https://clerk.house.gov/Votes/2026282 (July 23,
  2026) and https://clerk.house.gov/Votes/2026199 (H.Con.Res. 86, 215–208, June 3, 2026), both Bentz Nay and the five
  Democrats Yea; https://www.senate.gov/legislative/LIS/roll_call_votes/vote1192/vote_119_2_00184.htm (H.Con.Res. 86,
  50–48, June 23, 2026; Merkley Yea).
- fed-fix-our-forests · Fix Our Forests Act · "Pass the Fix Our Forests Act: faster thinning and logging on federal
  forests with shorter windows to sue?" — https://en.wikipedia.org/wiki/Fix_Our_Forests_Act (10,000-acre categorical
  exclusion; 120-day suit limit; no Senate floor vote as of July 2026), https://www.naco.org/news/bipartisan-legislation-encouraging-active-forest-management-advances-us-senate
  (committee 18–5, October 2025; from the search sweep), https://salinas.house.gov/media/press-releases/reps-salinas-and-ansari-react-white-house-repeal-roadless-rule
  (repeal August 2026; 58.5 million acres). Vote: https://clerk.house.gov/Votes/202525 (H.R. 471, 279–141, January 23,
  2025; Bentz, Hoyle and Bynum Yea; Bonamici, Dexter and Salinas Nay). No Senate vote; Merkley's cell is his July 22,
  2026 biomass bill with Bentz (partial).
- fed-housing-aid · Federal housing programs · "Expand the federal role in housing, from the new ROAD to Housing law to
  more vouchers and tax credits?" — https://www.govtrack.us/congress/bills/119/hr6644 (Public Law 119-101, enacted
  July 11, 2026 by the ten-day rule; CRS summary of August 6, 2026: RAD permanent at 555,000 units, NEPA changes, HOME
  conversions FY2027–31), https://www2.census.gov/econ/bps/State/st2025a.txt (Oregon 2025: 9,215 + 480 + 219 + 4,925 =
  14,839 units), https://www.oregon.gov/das/oea/Documents/OHNA-2026-Results-Report.pdf (29,359-unit annual target).
  Votes: https://clerk.house.gov/Votes/2026224 (358–32, June 23, 2026; all six Yea) and
  https://www.senate.gov/legislative/LIS/roll_call_votes/vote1192/vote_119_2_00182.htm (85–5, June 22, 2026; Merkley
  Yea).
- fed-data-centers · Data-center costs · "Should federal policy rein in data centers' power, water and cost impacts, or
  keep fast-tracking them?" — https://www.whitehouse.gov/presidential-actions/2025/07/accelerating-federal-permitting-of-data-center-infrastructure/
  (EO 14318, July 23, 2025; 100 MW / $500 million threshold), https://www.ijpr.org/politics-government/2026-09-09/gov-kotek-pauses-data-centers-on-state-land-capitol-demonstrators-want-her-to-go-further
  (144 data centers; at least $450 million in property tax breaks; pause through July 1, 2027),
  https://www.merkley.senate.gov/wyden-merkley-ask-state-data-center-advisory-committee-to-consider-multiple-issues-raised-by-oregonians/
  (the state advisory committee). No recorded vote exists; every cell is a candidate statement.

Not used as topics: the December 11 stopgap (H.R. 6500, https://clerk.house.gov/Votes/2026286, 370–48 on September 1,
2026: Bonamici, Bentz, Hoyle, Bynum and Salinas Yea, Dexter Nay; Senate https://www.senate.gov/legislative/LIS/roll_call_votes/vote1192/vote_119_2_00228.htm
90–6, Merkley Yea) is a stakes item instead because only one challenger (Adair) speaks to shutdown votes; the
Interstate Bridge (https://interstatebridge.org/CostEstimate and https://www.interstatebridge.org/resources/program-news/interstate-bridge-replacement-program-receives-federal-approval-to-move-to-construction/,
Amended Record of Decision July 1, 2026) is a stakes item for the Senate and districts 1 and 3 because no candidate
page addresses the federal share.

## Stakes items (shared; each race gets eight)

- Medicaid work rules — OPB, July 29, 2026 (above). · ACA premium credits — KFF State Health Facts (above).
- December 11 deadline — House Clerk roll call 286 (above); GovTrack https://www.govtrack.us/congress/bills/119/hr6500
  (Public Law 119-103, signed September 2, 2026).
- ICE expansion — American Immigration Council fact sheet (above). · Iran war — Roll Call, July 23, 2026 (above).
- Tariff power — Wikipedia, Learning Resources v. Trump (above). · Fix Our Forests Act — Wikipedia (above).
- Housing law to fund — GovTrack H.R. 6644 (above). · Data centers — Capital Chronicle via JPR (above).
- Interstate Bridge — interstatebridge.org/CostEstimate ($14.4 billion; $7.09 billion first phase; $5.7 billion
  committed; $1 billion FTA grant sought; tolling 2028). · Federal troops in Portland — portland.gov (above).

Per race: Senate = Medicaid, ACA, deadline, ICE, Iran, tariffs, forests, data centers. D1 = Medicaid, ACA, deadline,
ICE, Portland troops, tariffs, bridge, data centers. D2 = Medicaid, ACA, deadline, forests, tariffs, Iran, ICE, data
centers. D3 = Medicaid, ACA, deadline, ICE, Portland troops, Iran, tariffs, bridge. D4 = Medicaid, ACA, deadline,
forests, ICE, Iran, tariffs, housing. D5 = Medicaid, ACA, deadline, ICE, Iran, forests, tariffs, data centers. D6 =
Medicaid, ACA, deadline, ICE, Iran, tariffs, housing, forests. The 2024 margins in each intro are from Ballotpedia's
certified results (https://ballotpedia.org/Oregon%27s_1st_Congressional_District … _6th_, read via curl): D1 68.6–28.1,
D2 63.9–32.8, D3 67.7–25.2, D4 51.7–43.9–2.7, D5 47.7–45.0 (Smith 4.7, Feintech 1.5, Townsend 1.0), D6 53.3–46.5.
District geography reuses the pack's `districts` entries.

## U.S. Senate (oregon-us-senate)

| Candidate | H.R. 1 | ACA credits | Tariffs | ICE funding | Iran war | Forests | Housing aid | Data centers |
|---|---|---|---|---|---|---|---|---|
| David Brock Smith | gap | gap | gap | gap | gap | partial (site) | gap | added (pamphlet p. 2) |
| Gary Lyndon Dye | gap | gap | gap | gap | gap | gap | gap | gap |
| Chris Henry | partial (pamphlet p. 6) | partial (p. 5) | added (p. 5) | gap | partial (p. 5) | gap | gap | gap |
| Jeff Merkley | added (vote 372) | added (vote 644) | added (vote 600) | added (vote 163) | added (vote 184) | partial (biomass bill) | added (vote 182) | partial (July 2 letter) |

Gap questions. Smith: would you vote for the Fix Our Forests Act as passed by the House; keep or repeal H.R. 1's
Medicaid work rules; restore the enhanced premium credits; fund the Secure America Act's $70 billion; end the tariffs;
direct withdrawal from Iran? Dye: any 2026 statement at all (the filed site is the 2020 campaign). Henry: would you
vote for the Iran war-powers resolutions; keep or repeal the Medicaid and SNAP changes; fund or cut ICE; FOFA; housing
aid; data centers? Merkley: would you vote for S. 1462 (Fix Our Forests) if it reaches the floor; what federal
data-center rule, if any, would you support?
Venues checked. Smith: pamphlet pp. 1–2; davidbrocksmithfororegon.com (home, /issues, /news and the launch post);
Ballotpedia (no survey). Dye: garydye2020.wordpress.com (dated October 7, 2020); Ballotpedia (a 2024 survey for an
earlier race; not used). Henry: pamphlet pp. 5–6; chrishenry.org and henryforsenate.us do not resolve; pacificgreens.org
lists no page for him; Ballotpedia (a 2024 survey for a Portland council race; not used). Merkley: pamphlet pp. 3–4;
jeffmerkley.com/issues; merkley.senate.gov press page and site search for "Fix Our Forests" and "data center".
Least sure: whether Merkley has stated a position on S. 1462 anywhere (his site search returns none); Henry's "End
Pointless Wars" is read as partial, not as a position on the resolutions.

## U.S. House · District 1 (oregon-house-1)

| Candidate | H.R. 1 | ACA credits | Tariffs | ICE funding | Iran war | Forests | Housing aid | Data centers |
|---|---|---|---|---|---|---|---|---|
| Suzanne Bonamici | added (roll 190) | added (roll 11) | added (roll 65) | added (roll 214) | added (roll 282) | added (roll 25, Nay) | added (roll 224) | added (pamphlet p. 9) |
| Barbara J Kahl | partial (Ballotpedia 2026 survey) | gap | gap | gap | gap | partial (site) | partial (site) | gap |

Gap questions. Kahl: keep or repeal H.R. 1's Medicaid work rules; restore the premium credits; end the tariffs; fund
the $70 billion ICE expansion; the Iran resolutions; FOFA; vouchers and the housing tax credit; data centers. Bonamici:
none on the eight; worth asking which federal data-center rule she would back.
Venues checked. Bonamici: pamphlet pp. 9–10; bonamiciforcongress.com /priorities/ and economy, immigration,
climate-crisis, health-care, affordable-housing sub-pages. Kahl: pamphlet pp. 7–8; drkahlforcongress.com (home, /about,
/events); Ballotpedia Barbara_Kahl (2026 survey).
Least sure: Kahl's "removing citizens who don't qualify for programs from benefits" is recorded as partial on H.R. 1;
it may be a general eligibility view rather than a position on the law.

## U.S. House · District 2 (oregon-house-2)

| Candidate | H.R. 1 | ACA credits | Tariffs | ICE funding | Iran war | Forests | Housing aid | Data centers |
|---|---|---|---|---|---|---|---|---|
| Chris Beck | added (site) | partial (site) | added (site) | gap | added (site) | partial (site) | partial (site) | added (site) |
| Cliff Bentz | added (roll 190, Aye) | added (roll 11, Nay) | added (roll 65, Nay) | added (roll 214, Aye) | added (roll 282, Nay) | added (roll 25, Yea) | added (roll 224) | gap |

Beck's ICE cell is a gap: his site speaks to legal immigration, not ICE funding.
Gap questions. Beck: fund or cut the Secure America Act money; would you vote for FOFA as passed; restore the enhanced
premium credits. Bentz: what federal data-center rule, if any; would you vote for S. 1462 if it differs from H.R. 471.
Venues checked. Beck: pamphlet pp. 11–12; chrisbeckforcongress.com/district2issues (Issues, Everything Costs Too Much,
Healthcare, Agriculture sections); Ballotpedia (404). Bentz: pamphlet pp. 13–14 (lists his Secure America, FOFA and
Farm Bill votes); cliffbentz.com/issues/ (twelve 2023-dated pages); bentz.house.gov press page (July 28, 2026 FEMA
release; July 22, 2026 biomass bill; June 2026 hydropower and Juniper Canyon bills).
Least sure: Beck's Iran figures (18 killed, 600+ wounded, $100+ billion) are his; Wikipedia's tally (19–23 deaths,
$113.3 billion through June) differs, so the text attributes them to him.

## U.S. House · District 3 (oregon-house-3)

| Candidate | H.R. 1 | ACA credits | Tariffs | ICE funding | Iran war | Forests | Housing aid | Data centers |
|---|---|---|---|---|---|---|---|---|
| Loran Ayles | gap | gap | gap | gap | gap | gap | gap | gap |
| Maxine E Dexter | added (roll 190) | added (roll 11) | added (roll 65) | added (roll 214) | added (roll 282) | added (roll 25, Nay) | added (roll 224) | gap |

Gap questions. Ayles: any published position (no site, no pamphlet statement, no survey). Dexter: data centers; also
why she voted no on the September 1 stopgap (roll 286), the only Oregon member to do so.
Venues checked. Dexter: pamphlet pp. 15–16; maxinefororegon.com/issues/ and immigration, economic-opportunity,
climate, healthcare, housing sub-pages; dexter.house.gov press page (August 15 and 31, 2026 detention oversight;
September 17, 2026 firefighter bill). Ayles: ORESTAR filing (cfRsn 25472) via the pack; Ballotpedia Loran_Ayles (no
survey); no site found.
Least sure: nothing beyond the votes; her site's "voting NO on ICE and CBP funding until raids end" is on the
four-issue grid, not the board, since one source per cell.

## U.S. House · District 4 (oregon-house-4)

| Candidate | H.R. 1 | ACA credits | Tariffs | ICE funding | Iran war | Forests | Housing aid | Data centers |
|---|---|---|---|---|---|---|---|---|
| Monique DeSpain | gap | gap | gap | partial (site) | gap | added (site) | partial (site) | gap |
| Justin Filip | gap | partial (platform) | partial (platform) | added (platform) | partial (platform) | added (home page) | partial (Meet Justin) | added (home page) |
| Val Hoyle | added (roll 190) | added (roll 11) | added (roll 65) | added (roll 214) | added (roll 282) | added (roll 25, Yea) | added (roll 224) | gap |

Gap questions. DeSpain: keep or repeal H.R. 1's Medicaid rules; restore the premium credits; end the tariffs; fund the
$70 billion ICE expansion; the Iran resolutions; data centers. Filip: H.R. 1; would you have voted for H.Con.Res. 89;
should the current tariffs end. Hoyle: data centers.
Venues checked. Hoyle: pamphlet pp. 19–20 ("fighting illegal tariffs"; "opposing the Trump Administration's war in
Iran"); valhoyle.com/issues/; hoyle.house.gov press page (September 16, 2026 "200 Days and $40 Billion Later"; June 23
and July 13, 2026 ROAD Act releases). DeSpain: pamphlet pp. 17–18; moniqueforcongress.com/issues/ (immigration, forest,
spending sections); Ballotpedia Monique_DeSpain (2026 survey: "responsible forest management", "end reckless
tax-and-spend policies"; nothing new on the eight). Filip: pamphlet pp. 21–22; justin4congress.com (home with the FOFA
and data-center passages, /our-platform, /meet-justin); pacificgreens.org candidate page (May 16, 2026; no answers).
Least sure: Filip's home-page FOFA passage is undated on the page; it names H.R. 471 and asks the Senate to reject it,
so it is treated as current.

## U.S. House · District 5 (oregon-house-5)

| Candidate | H.R. 1 | ACA credits | Tariffs | ICE funding | Iran war | Forests | Housing aid | Data centers |
|---|---|---|---|---|---|---|---|---|
| Patti Adair | partial (pamphlet p. 25) | gap | gap | partial (Feb. 4 post) | gap | gap | gap | added (pamphlet p. 25) |
| Janelle S Bynum | added (roll 190) | added (roll 11) | added (roll 65) | added (roll 214) | added (roll 282) | added (roll 25, Yea) | added (roll 224) | partial (BILL Drivers Act) |
| Andrea Townsend | gap | gap | gap | gap | partial (PGP questionnaire) | gap | partial (questionnaire) | gap |
Gap questions. Adair: keep or repeal the Medicaid work rules; restore the premium credits; end the tariffs; would you
have voted for the Secure America Act; the Iran resolutions; FOFA; vouchers. Townsend: everything except war and
housing. Bynum: would she back a federal rule making data centers pay their grid costs.
Venues checked. Bynum: pamphlet pp. 23–24; janellebynum.com/issues and the healthcare, climate, cruelty-and-chaos
sub-pages; bynum.house.gov press page (January 22, 2026 DHS vote release; July 10, 2026 BILL Drivers Act; July 23, 2026
wildfire release). Adair: pamphlet pp. 25–26; pattiforcongress.com (home, /priorities, /news with 15 posts, /media);
the February 4, 2026 shutdown post and the July 15 Detroit Reservoir post (not data centers); Ballotpedia (no survey).
Townsend: pacificgreens.org questionnaire (July 17, 2026); no site; Ballotpedia (404).
Least sure: Adair's "no tax on tips, overtime and Social Security" is recorded as partial on H.R. 1 because those are
H.R. 1's temporary deductions; her statement does not name the law.

## U.S. House · District 6 (oregon-house-6)

| Candidate | H.R. 1 | ACA credits | Tariffs | ICE funding | Iran war | Forests | Housing aid | Data centers |
|---|---|---|---|---|---|---|---|---|
| David Russ | gap | gap | gap | partial (site) | gap | partial (site) | gap | gap |
| Andrea Salinas | added (roll 190) | added (roll 11) | added (roll 65) | added (roll 214) | added (roll 282) | added (roll 25, Nay) | added (roll 224) | partial (pamphlet p. 27) |

Gap questions. Russ: keep or repeal the Medicaid rules; premium credits; tariffs; fund the $70 billion ICE expansion;
Iran; FOFA; housing; data centers. Salinas: what "prioritized public infrastructure over corporate-owned data centers"
refers to in federal terms.
Venues checked. Salinas: pamphlet pp. 27–28; andreasalinasfororegon.com/issues/; salinas.house.gov press page (August
20, September 3 and 11, 2026 Roadless Rule releases; September 3 Newberg ICE detention statement). Russ: pamphlet pp.
29–30; russisforus.com (home, /proposed-bills, /immigration); Ballotpedia (a 2023 survey for the 2024 race; not used).
Least sure: Russ's "remove the invaders" is recorded as partial on ICE funding; it is an enforcement position, not a
funding one.

## Sources that could not be reached this session

congress.gov (403 to WebFetch and curl; GovTrack used instead), oregoncapitalchronicle.com (403; its stories were read
via ijpr.org where republished), dfr.oregon.gov newsroom (404), the Oregon marketplace news page (404), CBO search
(empty), Perkins Coie and CFR tariff explainers (404/redirect), the Census API (now requires a key; Ballotpedia used for
2024 results; no ACS district figures in the stakes as a result).
