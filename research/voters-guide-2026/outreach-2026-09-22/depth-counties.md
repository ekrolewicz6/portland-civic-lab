# Depth pass: the Washington County and Clackamas County races (September 22, 2026)

Scope: Washington County Chair and Commissioner District 4 (county-washington.ts); Clackamas Commissioner Positions 2
and 4, Sheriff, Clerk and Treasurer (county-clackamas.ts). Each pack now carries `topics` (ids prefixed `wash-` and
`clack-`), `topicStances` and one `RaceStakes` per race, seven in all. Reviewed fields: reviewedOn 2026-09-22,
reviewedBy pending. Both packs pass `npx vitest run tests/voters-guide/race-sheet.test.ts` and `npx tsc --noEmit -p .`.

Method. Live choices were taken from each county's own record first (Clerk's minutes packets on
washingtoncounty.civicweb.net, Clackamas policy-session worksheets on docs.clackamas.us, adopted budgets, the
elections pages) and dated. A candidate gets a cell only for an explicit statement on that choice: their pamphlet
statement (read with pdftotext), their site, their written OPB questionnaire answers (May 2026 PDFs on opb.org), a
quote printed by a named outlet, or, for a sitting commissioner, a recorded vote. Gaps are gaps. The session's
web-search budget ran out after the first dozen queries, so the rest of the research went through direct fetches
and Bing result pages read in the browser pane; oregonlive.com, koin.com and hillsboro-oregon.gov news pages refuse
automated fetches, and the Hillsboro data-center page was read in the browser instead.

## Washington County (shared list, wash-…)

One `RaceTopics` covers washington-chair and washington-district-4. Six topics; the URL behind each context:

- wash-data-center-pause · Data-center pause — https://washingtoncounty.civicweb.net/document/335765 (September 1,
  2026 work session packet: no large standalone data centers, no pending applications, rural rules bar them,
  120-day moratorium plus one six-month extension); https://www.hillsboro-oregon.gov/community/data-centers
  (updated September 10, 2026: 23 sites, 16 built on 346 acres, 7 in permitting/construction on 224 acres, about 570
  acres; moratorium enacted July 27); https://www.opb.org/article/2026/07/27/hillsboro-approves-data-center-moratorium/;
  Fai's August 25 proposal: https://www.kxl.com/washington-county-commissioner-to-propose-temporary-pause-on-new-data-center-development/
- wash-enterprise-zone · Data-center tax breaks — Hillsboro FAQ (same page: 50 active agreements, 33 data-center
  sites, 15 more data-center applications approved since March 2026 under HB 4084's window; the zone manager and the
  Washington County Assessor authorize each agreement); lawsuit: https://katu.com/news/local/lawsuit-filed-against-hillsboro-washington-county-over-data-center-tax-breaks-billionaire-environment-company-fortune-500-oregon-portland-salem-politics-business-jobs-water-privacy
  (1000 Friends of Oregon, OEA and Councilor Sinclair v. Hillsboro and Washington County; June 6, 2026 statewide pause)
- wash-vehicle-fee · Vehicle fee increase — https://washingtoncounty.civicweb.net/document/335538 (August 25, 2026
  minutes packet: Ordinance 917, ayes Treece, Snider, Willey; nay Fai; Harrington abstained; result 3–1);
  https://www.washingtoncountyor.gov/lut/vehicle-registration-fee ($30 → $40 July 2027 → $50 July 2029 → $60 July
  2031; 60/40 county–cities split); $20.6 million county share at the full rate:
  https://hillsborotoday.com/articles/washington-county-doubles-vehicle-registration-fee-by-2032-mtbhj2c1
- wash-budget-gap · Budget gap — https://www.washingtoncountyor.gov/home/news/2026/04/27/washington-county-adopted-budget-preserves-critical-services-amid-uncertainty
  ($2.1 billion approved June 16, 2026; five consecutive years of reductions; ~$6.2 million General Fund savings;
  one-time 11% assessed-value growth from Hillsboro industrial property, expected to return to ~4.5%);
  https://www.washingtoncountyor.gov/finance/news/2025/06/18/board-county-commissioners-adopts-2-billion-balanced-budget-closing-205-million-general-fund-gap-and
  ($20.5 million gap closed for FY 2025-26)
- wash-ice-emergency · ICE emergency response — https://washingtoncounty.civicweb.net/document/317404 (November 4,
  2025 minutes packet: RO 25-72 adopted 5–0 on Fai's motion, $200,000 from contingency, to be replenished in FY
  2026-27; RO 25-71, $250,000 for food banks, also 5–0); arrests figure:
  https://www.opb.org/article/2025/11/05/washington-county-emergency-increased-ice-activity/ (135+ in October 2025,
  nearly half of 329 statewide)
- wash-ugb-farmland · Farmland for industry — https://www.opb.org/article/2026/03/03/hillsboro-will-not-get-more-industrial-land-for-high-tech-data-centers/
  (SB 1586: 373 acres into the UGB, ~1,400 acres for future industry, data centers as accessory uses; shelved by
  Sen. Sollman in early March 2026). The exact day is written as "early March" because the article URL is dated
  March 3 and the Hillsboro Herald's report is dated March 4.

Not used: a supportive-housing-services or shelter column (no candidate in either race has stated a position on a
specific SHS or shelter choice; Treece's site says only that she supports new shelters, Fai's lists past pod
villages) and Treece's reported priority of a new jail and courthouse (no county study or cost estimate was found to
anchor a context sentence). The public-safety levy is a stakes item instead: voters already replaced it in November
2025. Not researched to standard in this pass, and therefore not used: the county's FY 2026-27 supportive housing
services budget and shelter counts, any new-jail or courthouse study, and the WCCLS library levy's next renewal date;
the Washington County record sweep delegated for those items had not returned when this report was written.

### Washington County Chair (washington-chair): Nafisa Fai, Pam Treece

Stakes intro: what the chair presides over, the $2.1 billion budget (county release above), and the vacancy.
Items (8): vacant chair's office (https://www.washingtoncountyor.gov/home/news/2026/09/21/board-chair-kathryn-harrington-announces-resignation:
effective October 2; Willey presides, Snider chair pro tem; new chair sworn January 3, 2027); balanced on one-time
growth (FY 2026-27 release); data centers outside cities (September 1 packet); no county pause adopted
(https://www.dailytidings.com/washington-county-will-not-pause-new-data-center-projects-for-now-despite-oregon-wide-concerns/:
resolution instead, "de facto moratorium", eight parcels all developed); tax-break lawsuit (KATU); vehicle fee doubles
(August 25 minutes); emergency reserves spent (November 4 minutes); public safety levy
(https://www.washingtoncountyor.gov/finance/documents/washington-county-budget-questions-and-answers-fy-2026-27-may-18/download?inline:
replacement levy approved November 2025, first year July 1, 2026; restores 11 Sheriff's Office FTE and funds 8 DA
FTE; General Fund ~68% of public-safety spending on average).

| Candidate | Data pause | Tax breaks | Vehicle fee | Budget gap | ICE response | Farmland |
|---|---|---|---|---|---|---|
| Nafisa Fai | added, supports (Reporting: KXL, Aug 25) | partial (pamphlet p.4: "pay fair share") | added, opposes (Public record: no vote, Aug 25) | added, supports (site: fees and levies) | added, supports (Public record: moved RO 25-72) | partial (OPB questionnaire: grow inside the UGB) |
| Pam Treece | added, mixed (Reporting: KGW, Sept 17) | gap | added, supports (Public record: aye, Aug 25) | added, mixed (OPB questionnaire: taxes a last resort) | added, supports (Public record: aye, Nov 4) | partial (OPB questionnaire: planning with Metro) |

Gap questions for the campaigns:
- Fai: Should the county assessor stop authorizing new enterprise-zone agreements for data centers, or is "fair share"
  a different fee? Which specific levy (public safety, libraries, both) would you refer, and when? Why did you vote no
  on Ordinance 917: the rate, the timing or the process?
- Treece: Should the enterprise-zone exemptions for data centers end, and should the county's role change from
  "assessment and taxation"? Which services would give way first if the gap returns and you hold taxes to a last
  resort? Should the county pause data-center permits under its own authority, or only ask cities to?

Venues checked: Fai — https://www.nafisaforwashingtoncounty.com/ (home, /priorities, /accomplishments, /press),
pamphlet PDF page 4, OPB questionnaire PDF, KXL (Aug 25), Hillsboro Herald
(https://hillsboroherald.com/commissioner-nafisa-fai-calls-for-temporary-pause-on-new-data-center-development-in-washington-county/),
KOIN (Sept 6; fetch refused; Yahoo copy read), OPB (May 7, 2026 and Sept 17, 2026), minutes of August 25, 2026 and
November 4, 2025. Treece — https://www.pamforwashingtoncounty.com/ (home, /priorities/), pamphlet PDF page 4, OPB
questionnaire PDF, KGW via Yahoo (Sept 17), Hillsboro Herald (Aug 2026, "assessment and taxation only"), the same two
minutes packets and the September 1 work session packet.

### Washington Commissioner · District 4 (washington-district-4): Steve Callaway, Kipperlyn Sinclair

Stakes intro: District 4's share of the county, one of five votes on the budget and land-use code, an open seat.
Items (8): balanced on one-time growth; five years of cuts ($20.5 million gap release); data centers outside cities;
no county pause adopted; Hillsboro's moratorium (Hillsboro data-center page); tax-break lawsuit (KATU); farmland bill
shelved (OPB, SB 1586); vehicle fee doubles (August 25 minutes).

| Candidate | Data pause | Tax breaks | Vehicle fee | Budget gap | ICE response | Farmland |
|---|---|---|---|---|---|---|
| Steve Callaway | partial (pamphlet p.5: "carefully evaluate") | partial (Reporting: Valley Times forum, Apr 28) | gap | added, mixed (OPB questionnaire) | added, supports (OPB questionnaire) | partial (OPB questionnaire: state reform first) |
| Kipperlyn Sinclair | added, supports (site petition) | added, supports ending (pamphlet p.5) | gap | added, mixed (pamphlet p.5: tax data centers) | partial (Reporting: Valley Times forum) | added, opposes (site /about: testified against SB 1586) |

Gap questions for the campaigns:
- Callaway: Would you vote for a county moratorium on data-center permits, and what findings would make you reject a
  project or an enterprise-zone agreement? Would you have voted for Ordinance 917's fee schedule? Should SB 1586's
  373 acres come into the boundary through Metro's process?
- Sinclair: Would you have voted for Ordinance 917? Beyond taxing existing data centers, which county fees or levies
  would you support or oppose? Did you vote for Hillsboro's July 27 moratorium (the reporting says the vote was
  unanimous; the city's roll call was not published where we could read it)?

Venues checked: Callaway — https://electstevecallaway.com/ (home, /issues/, /news-events/), pamphlet PDF page 5, OPB
questionnaire PDF (https://www.opb.org/pdf/Callaway_washington%20county%20district%204_1778194261861.pdf), OPB May 8
race preview, Valley Times forum report (Apr 28), Hillsboro Today runoff report (Sept 4), Ballotpedia (no survey
completed). Sinclair — https://www.kipperlynsinclair.com/ (home, /about, /data-center-moritorium), pamphlet PDF page 5,
Valley Times forum report, Hillsboro Today (Sept 4), KATU lawsuit report, OPB May 8 preview (she did not answer OPB's
questions); the Hillsboro council's July 27 special-meeting record was not reachable (hillsboro-oregon.gov news pages
return 403 to fetches and "Not found" in the browser).

Least sure (Washington):
- Treece's data-pause cell rests on one KGW quote syndicated on Yahoo; the original kgw.com URL was not found. The
  Hillsboro Herald separately reports her saying the county's role is "assessment and taxation only"; the cell is
  "mixed" to hold both.
- The Daily Tidings item on the September 1 outcome (resolution, "de facto moratorium", eight parcels) is the only
  account of what the Board decided; work sessions have no minutes, and the Board's news page carries nothing on it.
- Fai's reason for voting no on Ordinance 917 is not in the minutes; the cell records the vote only.
- The KATU lawsuit report gives no court or filing date; the Oregon Capital Chronicle's report (June 24, 2026) refused
  the fetch.

## Clackamas County (clack-…)

Four `RaceTopics` entries: a five-topic commission list shared by clackamas-position-2 and clackamas-position-4; a
three-topic sheriff list; a three-topic clerk list; a two-topic treasurer list (one candidate). The sheriff, clerk and
treasurer lists are separate because a shared county list would have put topics on those pages that none of their
candidates has addressed. Topic ids cannot repeat across lists (the test dedupes them), so the sheriff's levy column is
its own topic (clack-sheriff-levy) with a sheriff-shaped question.

Commission topics, with the URL behind each context:
- clack-levy-2027 · Public safety levy retry — https://docs.clackamas.us/documents/drupal/4065baba-ddab-421d-8f87-05b524e2385f
  (official May 19, 2026 results: 3-633 Yes 52,440 / 37.84%, No 86,133 / 62.16%; 318,500 registered voters; 44.86%
  turnout); https://docs.clackamas.us/documents/drupal/60e03697-d523-4d02-a260-bcfeeeed0b2c (county memorandum, July
  23, 2026: levy renewed 2006, 2011, 2016, 2021; "will expire on December 21, 2026" as printed, read as December 31 per
  KPTV and the sheriff); https://www.kptv.com/2026/05/20/sheriff-releases-statement-after-clackamas-county-public-safety-levy-fails/
  (36¢ → 53.4¢ per $1,000; ~$202.88 million over five years; 84 jail beds, 26 medical/mental-health beds, 36 jail
  deputies, 34 patrol deputies, five detectives, drug team, body cameras, two IA investigators; expires Dec. 31, 2026);
  https://oregoncitynewsonline.com/2026/02/11/clackamas-county-to-move-forward-with-public-safety-levy-for-may-election/
  (referred February 10, 2026 on Helm's motion; $59.48 a year for the average homeowner);
  https://milwaukiereview.com/2026/07/29/clackamas-county-planning-to-wait-until-next-may-for-public-safety-funding-vote/
  (July 28 policy session: May 2027 chosen). OPB's May 14 preview prints "59 cents" and a 45% increase; four other
  sources and the sheriff's statement say 53.4¢, so 53.4¢ is used.
- clack-data-centers · Data-center moratorium — https://docs.clackamas.us/documents/drupal/83d5a6c6-6bbe-492d-8458-1e179a92d53a
  (county memorandum, August 11, 2026: no data centers built in unincorporated county; GI, LI and BP zones allow them;
  Option 5 "wait for 2027 session" recommended; 45-day DLCD notice, 120-day limit, six-month extension); the Board's
  unanimous contrary direction: https://www.kxl.com/home/clackamas-county-initiates-process-to-enact-moratorium-on-data-centers/
  (August 11, 2026), also in Savas's September 18 post; OPB's August 5 preview
  (https://www.opb.org/article/2026/08/05/clackamas-county-to-consider-data-center-moratorium/) records Helm's reversal
  from "we can and we should" in July to seeking a countywide moratorium
- clack-sanctuary · Judicial-warrant rule — the 1987 law and 2021 Sanctuary Promise Act facts reuse the governor
  pack's verified context (state.ts, gov-immigration-enforcement); OPB's May 2026 question is on each questionnaire PDF
  (URLs below)
- clack-senior-tax · Senior tax relief — https://www.oregon.gov/dor/programs/property/pages/senior-and-disabled-property-tax-deferral-program.aspx
  (state pays taxes November 15; lien; 6% simple interest; $70,000 household income limit for 2026);
  https://www.clackamas.us/budget (county keeps ~18% of property tax raised locally)
- clack-recovery-campus · Recovery Campus — https://www.clackamas.us/news/2026-07-29/clackamas-county-recovery-campus-breaks-ground
  (July 29, 2026: 76 beds; $13.5 million SHS, $10 million governor-directed, $5 million lottery bonds, $2.5 million
  congressional; late 2027; Fora Health) and https://www.clackamas.us/news/2026-09-10/notice-of-public-hearing-with-respect-to-the-issuance-of-a-financing-by-clackamas-county-oregon
  (up to $10,300,000; two buildings at 15301 SE 92nd Ave; hearing September 17, 2026, 10 a.m.)

Sheriff topics: clack-sheriff-levy (levy memorandum and OPB May 14, above; $28.4 million levy fund and 92 positions from
the proposed budget's CCSO summary, page 61); clack-sheriff-cuts (CCSO summary: $155,831,878 total, $87,328,999 General
Fund support = 56% of the office and 44.7% of all GFS; 607 FTE, 534 filled, 73 vacant; patrol 71.8 FTE, 16 vacant);
clack-sheriff-rural (same table: Estacada 5.3, Happy Valley 18.0, Wilsonville 22.0 contract FTE; ELED 36 FTE).

Clerk topics: clack-hand-count (https://sos.oregon.gov/elections/Pages/security.aspx: never connected to the internet,
tested three times, random-sample hand counts or risk-limiting audits required, ORS 254.483–254.545;
https://www.opb.org/article/2022/08/11/clackamas-county-oregon-clerk-sherry-hall-election-mistakes-blame/: more than
half of May 2022 primary ballots misprinted, $600,000); clack-voter-rolls (SOS page: ERIC, NCOA, vital records, Motor
Voter; 318,500 registered voters from the official May 2026 results; Clerk's Elections program $3,148,157 and 6.0 FTE
from the proposed budget, page 23); clack-watermark (SOS page on signature matching; ballots mailed from October 14 per
https://www.clackamas.us/elections/november-3-2026-general-election).

Treasurer topics: clack-treasury-priorities (https://docs.clackamas.us/documents/drupal/0089609e-9d67-4cae-8afc-1bd63f079055,
FY 2025 ACFR note 3: cash and investments $827,470,054, LGIP $163,127,070, U.S. Treasury $136,812,795;
https://www.clackamas.us/treasurer: chief investment officer, 125+ districts; $15.3 million expected interest income
from the budget message BM-6);
clack-cash-controls (Treasurer's Office GFS $1,101,900, budget message BM-9; internal audit role from the treasurer page).

Not used: I-205 tolling (Savas and Shull both oppose; no 2026 county decision found to anchor a context, and neither
Position 4 candidate addresses it); shelter siting (no 2026 board siting vote found in the meeting pages read; the
Recovery Campus column carries the treatment-and-housing question instead); the UGB/rural reserves (all four
commission candidates say protect rural land; not contested); Portland's $4 million homelessness request, declined
April 7, 2026 without a formal vote (Helm and Savas both opposed it per the Portland Tribune; neither challenger has
addressed it). Adopted budget: https://www.clackamas.us/meetings/bcc/business/2026-06-17 (item 13.1, June 17, 2026,
5–0, Savas moved, Helm seconded) and the resolution https://docs.clackamas.us/documents/drupal/a2737b17-455b-4d19-9d99-f862e2bb0fd8
(total $1,528,305,199; appropriations $1,401,336,042; General Fund Support $198,116,517; Clerk $6,215,266; Treasurer's
Office $1,776,912; CCSO General Fund $128,949,394; local option tax $0.3680/$1,000); the all-county "about $2.0 billion"
comes from the proposed budget's $1,996,903,715 and the county budget page.

### Clackamas Commissioner · Position 2 (clackamas-position-2): Paul Savas (incumbent), Mark Shull

Stakes intro: the five-member board, the ~$2.0 billion budget, the levy, courthouse payments, the moratorium.
Items (8): the adopted budget (June 17 meeting page and resolution, above); fewer positions, thin margins (proposed
budget: 2,495.3 FTE, −20.5; H3S −38 FTE; costs outpacing revenue); levy defeated, expiring (July 23 memorandum); what
the levy pays for (KPTV May 20: 53.4¢, ~$202.9 million over five years, the funded list); retry set for May 2027
(Milwaukie Review July 29); courthouse payments begin (https://www.clackamas.us/courthouse: opened May 19, 2025; 16
courtrooms; $345.1 million; state cap $139.1 million; county $206 million; ~$15 million a year for 30 years, ~$620
million); Board overrode staff (KXL August 11: unanimous direction to start the moratorium); 76 beds by late 2027
(Recovery Campus groundbreaking release).

| Candidate | Levy retry | Data centers | Sanctuary | Senior taxes | Recovery Campus |
|---|---|---|---|---|---|
| Paul Savas | added, supports (Reporting: Your Oregon News, June 4) | added, supports (site post, Sept 18) | added, mixed (OPB questionnaire) | added, mixed (OPB questionnaire) | added, supports (site post, Apr 9) |
| Mark Shull | added, mixed (OPB questionnaire) | gap | added, opposes (OPB questionnaire) | added, supports (pamphlet p.17) | partial (OPB questionnaire) |

Gap questions: Savas — at what rate would you refer the May 2027 levy, and would you back-fill levy services from the
General Fund if it fails? Should the county adopt a judicial-warrant declaration, or leave it to the sheriff? Shull —
would you vote for the data-center moratorium now under way, or wait for the 2027 session? Would you support the
$10.3 million Recovery Campus bonds and its operating costs? What rate for the levy is "responsible"?

Venues checked: Savas — https://electpaulsavas.com/ (home, /issues/, the February 19, March 27, April 9 and
September 18, 2026 posts), pamphlet PDF page 17, OPB questionnaire PDF
(https://www.opb.org/pdf/Savas_clackamas%20county%20position%202_1777999802794.pdf), OPB May 5 race preview, Your
Oregon News (June 4, July 29 via Milwaukie Review). Shull — pamphlet PDF page 17, OPB questionnaire PDF
(https://www.opb.org/pdf/Shull_clackamas%20county%20position%202_1777918550350.pdf), OPB May 5 preview; no campaign
site (his filing is the only channel). His Hoodview News editorial on sanctuary (April 2026) was not fetched.

### Clackamas Commissioner · Position 4 (clackamas-position-4): Diana Helm (appointed), R W Smith

Stakes intro: the board, the budget, and the seat's appointment history.
Items (8): a seat filled by appointment (https://www.clackamas.us/news/2025-05-19/diana-helm-appointed-clackamas-county-commissioner:
May 19, 2025; 59 applicants; serves through December 2026; term January 2027–December 2028); the adopted budget; the
February referral (Oregon City News, February 11: Helm moved the 53.4¢ referral, Savas "I'm supporting this levy");
levy defeated, expiring; retry set for May 2027; courthouse in the General Fund (proposed budget: $17,549,000 payment,
$16,994,000 GFS, 8.7%; 30-year forecast required by county code); moratorium under way (August 11 memorandum); housing
tax money (budget BM-10: $78 million SHS in FY 2026-27 plus $67 million carryover; 246 shelter beds, 9,299
eviction-prevention, 3,146 placed through FY 2025-26 Q2).

| Candidate | Levy retry | Data centers | Sanctuary | Senior taxes | Recovery Campus |
|---|---|---|---|---|---|
| Diana Helm | added, supports (Reporting: Your Oregon News, June 4) | added, supports (pamphlet p.18) | partial (OPB questionnaire) | added, supports (OPB questionnaire) | added, supports (site) |
| R W Smith | partial (OPB questionnaire) | added, supports (pamphlet p.18: a ban, not a pause) | added, supports (OPB questionnaire) | gap | partial (site /policies/) |

Gap questions: Helm — at what rate would you refer the levy in May 2027? Should the moratorium become a ban, or rules
that allow data centers somewhere? Would you vote for a judicial-warrant declaration? Smith — do you support a property
tax freeze for seniors? Would you vote for the $10.3 million Recovery Campus bonds and operating money? What rate and
timing for the levy?

Venues checked: Helm — https://www.votedianahelm.com/ (home), pamphlet PDF page 18, OPB questionnaire PDF
(https://www.opb.org/pdf/Helm_Clackamas%20County%20position%204_1777936583069.pdf), OPB May 5 preview, OPB August 5
(data centers), Your Oregon News June 4, county appointment release. Smith — https://friendsofremysmith.org/ (home,
/policies/, /blog/), pamphlet PDF page 18, OPB questionnaire PDF
(https://www.opb.org/pdf/Smith_Clackamas%20County%20position%204_1777936706977.pdf), OPB May 5 preview.

### Clackamas County Sheriff (clackamas-sheriff): Brad O'Neil, James Rhodes (appointed)

Stakes intro: what the sheriff runs, the 483-bed jail, the ~$156 million budget, the July resignation, the levy.
Items (7): sheriff resigned mid-term (https://www.opb.org/article/2026/07/28/clackamas-county-sheriffs-office-rhodes/:
Brandenburg resigned July 23; Rhodes appointed July 28, Roberts opposed; O'Neil named as interested); sheriff's budget
and vacancies (proposed budget CCSO summary, page 61; the adopted Exhibit B total is $157,747,896); 483 jail beds
(https://www.clackcosheriff.us/forcedReleaseDashboard, read in the browser); levy defeated, expiring; what the levy
pays for (KPTV); retry set for May 2027; jail medical contract (https://www.clackamas.us/meetings/bcc/business/2026-08-13:
NaphCare, $50.5 million, five years, partly levy-funded; $2.66 million state shelter grant).

| Candidate | Levy fallback | Cuts order | Rural patrol |
|---|---|---|---|
| Brad O'Neil | partial (site /brads-priorities/) | added, supports (site /brads-priorities/) | added, supports (site /brads-priorities/) |
| James Rhodes | partial (site /theplan) | added, supports (site /theplan) | partial (site /theplan) |

Gap questions (both): if the May 2027 levy fails, which of the 36 jail deputies, 84 beds and body cameras go first?
Will the office honor ICE detainers without a judicial warrant? What would restoring traffic and DUII enforcement cost
in positions? Rhodes — how many of the 73 vacancies would you fill first? O'Neil — what numeric rural response-time
target would you set?

Venues checked: O'Neil — https://www.oneilforsheriff.com/ (home, /brads-priorities/, /vision/), pamphlet PDF page 16,
OPB July 28, Your Oregon News July 29, Ballotpedia (no survey). Rhodes — https://www.electsheriffrhodes.com/ (home,
/theplan), pamphlet PDF page 16, Woodburn Independent (Sept 4), OPB July 28, sheriff's office welcome page listing
(not fetched). No forum coverage of the sheriff race was found.

### Clackamas County Clerk (clackamas-clerk): Catherine McMullen (incumbent), Mark Reaksecker

Stakes intro: elections, records, certification; the $6.2 million office budget.
Items (6): clerk's office budget (proposed budget page 23: $6,215,266, matching the adopted resolution; Elections
$3,148,157 / 6 FTE; Recording $984,769 / 7 FTE; Records Management $843,872 / 5 FTE; GFS $2,741,900); record primary,
one recount (https://www.clackamas.us/news/2026-06-12/clerk-mcmullen-certifies-may-19-2026-primary-election: 44.87%,
142,908 ballots, highest gubernatorial primary since 1998; SOS-ordered full recount of Circuit Court Position 13 from
June 15); state counting rules (SOS security page); the 2022 misprint (OPB August 11, 2022); this election's workload
(county elections page: five county races, justice of the peace, nine local measures plus Portland's 26-267; ballots
mailed from October 14; call by October 22); retry set for May 2027 (Milwaukie Review).

| Candidate | Hand count | Voter rolls | Watermarks |
|---|---|---|---|
| Catherine McMullen | partial (pamphlet p.14: replaced aging equipment) | partial (pamphlet p.14: records current) | gap |
| Mark Reaksecker | added, supports (site /solutions) | added, supports (site /solutions) | added, supports (site /solutions) |

Gap questions: McMullen — would you oppose a switch to full hand counts, and what did the post-election audits find in
2024 and 2026? Would you add county-level roll checks beyond the state's? Reaksecker — how many staff and days would a
hand count of a general election take, and what would it cost against the $3.1 million elections budget?

Venues checked: McMullen — https://clackamasvoice.org/ (home, /priorities/, /blog/ and the March 8, 2026 post),
pamphlet PDF page 14, https://www.clackamas.us/clerk (listing only), Ballotpedia (no survey). Reaksecker —
https://www.markforcountyclerk.com/ (home, /solutions), pamphlet PDF page 14 (cites a May 11, 2026 statement by the
Secretary of State on tabulators; not verified), Ballotpedia (no survey). No news coverage of the clerk race was found.

### Clackamas County Treasurer (clackamas-treasurer): Brian T Nava (incumbent, unopposed)

Stakes intro: cash, banking, tax distribution; reserves and new bonds.
Items (6): $827 million in cash and investments (FY 2025 ACFR note 3: money market $302,093,310; LGIP $163,127,070;
U.S. agencies $144,232,086; Treasuries $136,812,795; municipal $19,301,695; demand deposits $37,487,570); what the
office holds (treasurer page); interest and reserves (budget: $15.3 million interest; $1.1 million GFS; contingency
−$10.4 million to $128.9 million; GF contingency $23.6 million; GF reserves $21.3 million); a $328 million, no-interest
loan (ACFR courthouse note: $327,812,939; $908,069 a month to April 2055; state's $130 million passed through; FY 2026
O&M and renewal fee $3,495,374); Recovery Campus bonds (September 10 notice); the adopted budget.

| Candidate | Investing | Cash controls |
|---|---|---|
| Brian T Nava | added, supports (pamphlet p.15) | added, supports (pamphlet p.15) |

Gap questions: which benchmark and risk measures does the office publish for the portfolio, and how much sits in the
Oregon Short Term Fund versus the county's own holdings?

Venues checked: pamphlet PDF page 15, county filing (SEL 101, contact fields), https://www.clackamas.us/treasurer; no
campaign site.

## Least sure (Clackamas)
- The Board's August 11 direction to start a moratorium is documented in Savas's own post and in reporting (The
  Oregonian, August 13, refused the fetch; OPB August 5 predates the vote); the September 15 Issues & Updates agenda
  lists "Public Hearings on Data Center Moratorium" without a document. No ordinance number yet.
- Helm's and Savas's levy cells rest on quotes printed by Your Oregon News from the June 2 session; the February 10,
  2026 referral is documented only in Oregon City News (a stakes item), not in county minutes: the Feb. 5, 12, 19, 26
  and March 5 business-meeting pages and the Feb. 10 Issues & Updates page carry no referral resolution, so it is not
  cited as a public record.
- Measure 3-633's rate: OPB (May 14) prints 59¢ and a 45% increase; KPTV, Oregon City News, the sheriff's statement and
  the county's own $59.48-per-average-homeowner figure support 53.4¢. The pack uses 53.4¢.
- The July 23 memorandum prints the levy expiry as "December 21, 2026"; KPTV and the sheriff say December 31, 2026.
- The Recovery Campus release gives a $30.5 million total while its four funding lines sum to $31 million; the pack
  lists the lines and no total.
- The proposed budget's "tax revenue … expected to increase by 3.5% or $210.5 million" is ambiguous and was not used.
- The sheriff's 2025 financial-management problems that OPB's questionnaire references were not sourced independently
  and appear only inside the candidates' own answers.
