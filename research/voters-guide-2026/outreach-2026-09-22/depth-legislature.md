# Depth pass: Oregon Legislature races — topics, stances and stakes (September 22, 2026)

Pack: `src/lib/voters-guide/race-sheet/content/packs/legislature.ts` (one shared `RaceTopics` entry, 121 topic
stances, 13 `RaceStakes` entries). Races: oregon-state-senate-13, -15, -16, -17, -19, -20, -24, -26 and
oregon-state-house-26, -29, -40, -51, -52 (29 candidates). Reviewed fields: `reviewedOn: "2026-09-22"`,
`reviewedBy: "pending"`.

Method: incumbents' cells are recorded floor votes read from OLIS measure histories (the AJAX history endpoint,
`/liz/<session>/Measures/Overview/GetHistory/<bill>`, which prints the ayes/nays/excused by name); each cell names
the bill and the vote date. Challengers' cells are their own published words (campaign site, the Secretary of
State's filed candidate statements PDF, the Abigail Adams or Ballotpedia questionnaires) or a quote as printed by a
named outlet. Nothing is inferred from party, endorsements or silence; a candidate with nothing explicit on a topic
has no cell. The session's web-search budget was exhausted before this task started and the search engines' HTML
endpoints answered with bot challenges, so discovery ran through direct fetches (OLIS, oregon.gov, OPB tag pages,
KATU site search, syndicated Capital Chronicle copies on Pamplin sites) rather than search.

## Topics (ids `leg-…`), with the URL behind each context sentence

| id | label · short | question | context verified with |
|---|---|---|---|
| leg-transportation-package | 2027 road package · Road taxes | Vote for a 2027 transportation package that raises the gas tax and vehicle fees again? | OLIS HB 3991 (2025S1) history and digest, https://olis.oregonlegislature.gov/liz/2025S1/Measures/Overview/HB3991; ODOT HB 3991 page ($297 million, two 2026 bills), https://www.oregon.gov/odot/pages/hb3991.aspx; KATU May 20, 2026 (83% no), https://katu.com/news/politics/whats-next-for-odot-after-oregon-voters-reject-the-gas-tax-hike-politics-taxes-transportation-bill-funding-budget-money-transit-roads-bridges-measure-120-m120-package-vehicle-fees-drivers-gasoline; OPB/Capital Chronicle Aug 21, 2026 ($200 million 2027–29 gap, nearly 200 maintenance jobs), https://www.opb.org/article/2026/08/21/odot-staff-cuts-maintenance-weather/ |
| leg-kicker | Kicker refund · Kicker | Let the state keep part of a future kicker refund for wildfire or other one-time needs? | OEA September 2026 forecast ($1.4 billion kicker credit; personal income taxes $526 million under the threshold), https://www.oregon.gov/das/oea/Documents/revenue0926.pdf; OLIS HB 4125 (2026R1) history (hearing Feb 2, in committee at adjournment), https://olis.oregonlegislature.gov/liz/2026R1/Measures/Overview/HB4125 |
| leg-new-revenue | Budget gap: taxes? · Budget gap | Close the 2027–29 budget gap with new revenue, or with cuts alone? | CFO 2027–29 policy-package guidance, Feb 10, 2026, https://www.oregon.gov/das/Financial/Documents/2027-29%20Budget%20POP%20Guidance%20-%20CFO.pdf; OLIS SB 1507 (2026R1) history, https://olis.oregonlegislature.gov/liz/2026R1/Measures/Overview/SB1507; LRO revenue impact SB 1507 A (net $313.9 million 2027–29), https://olis.oregonlegislature.gov/liz/2026R1/Downloads/CommitteeMeetingDocument/314766; OEA forecast (reserves $3,463 million) |
| leg-data-centers | Data-center limits · Data centers | Make data centers pay their own way: separate power rates, an end to tax breaks, or a pause on new ones? | Capital Chronicle via JPR, Sept 9, 2026 (144 data centers; $450 million "pretty close"), https://www.ijpr.org/politics-government/2026-09-09/gov-kotek-pauses-data-centers-on-state-land-capitol-demonstrators-want-her-to-go-further; OLIS HB 3546 (2025R1) history, https://olis.oregonlegislature.gov/liz/2025R1/Measures/Overview/HB3546; governor's Sept 8, 2026 release (pause through July 1, 2027; 2027 framework), https://apps.oregon.gov/oregon-newsroom/OR/GOV/Posts/Post/governor-kotek-pauses-work-on-requests-for-state-land-to-support-new-data-centers |
| leg-shelter-funding | Shelter funding · Shelter | Keep paying for state-funded shelter beds and the homelessness emergency after June 2027? | LFO HB 5011 budget report ($204,918,652 GF, $102,459,326 one-time), https://olis.oregonlegislature.gov/liz/2025R1/Downloads/CommitteeMeetingDocument/308817; OLIS HB 3644 (2025R1); governor's Jan 9, 2026 release on EO 26-01 (6,286 beds; 5,539 rehoused; 25,942 households; through Jan 10, 2027), https://apps.oregon.gov/oregon-newsroom/OR/GOV/Posts/Post/governor-kotek-issues-executive-order-to-extend-homelessness-emergency |
| leg-deflection | Drugs: deflection · Deflection | Keep the 2024 approach of recriminalized possession plus county deflection programs, and fund them in 2027–29? | OLIS HB 4002 (2024R1) history and summary (misdemeanor on Sept 1, 2024; BHD program), https://olis.oregonlegislature.gov/liz/2024R1/Measures/Overview/HB4002; CJC Behavioral Health Initiatives Report, Nov 1, 2025 ($40 million 2025–27; 28 counties, six tribes; 2,096 / 1,308 / 277 / 630), https://www.oregon.gov/cjc/CJC%20Document%20Library/2025_CJC_Behavioral_Health_Initiatives_Report.pdf |
| leg-wildfire-funding | Wildfire money · Wildfire | Spend more state money on wildfire prevention and firefighting? | OPB/Capital Chronicle Aug 21, 2026 ("record 2.5 million acres this summer"); HB 3940 B staff measure summary, https://olis.oregonlegislature.gov/liz/2025R1/Downloads/CommitteeMeetingDocument/309502; LRO revenue impact HB 3940 -A24 ($14.1m + $29.2m = $43.3m 2025–27; $21.0m + $42.0m = $63.0m 2027–29), https://olis.oregonlegislature.gov/liz/2025R1/Downloads/CommitteeMeetingDocument/309208; OLIS SB 83 (2025R1) summary and history, https://olis.oregonlegislature.gov/liz/2025R1/Measures/Overview/SB83 |
| leg-sanctuary | Sanctuary law · Sanctuary | Keep adding state limits on federal immigration enforcement, on top of Oregon's sanctuary law? | Governor's April 9, 2026 release (eight bills listed, incl. HB 4138 and SB 1570), https://apps.oregon.gov/oregon-newsroom/OR/GOV/Posts/Post/governor-kotek-signs-bills-bolstering-protections-for-immigrant-and-refugee-communities; OLIS HB 4138 (2026R1) history (House 36–19 / concurrence 34–18; Senate 18–10), https://olis.oregonlegislature.gov/liz/2026R1/Measures/Overview/HB4138. The 1987 law / 2021 Sanctuary Promise Act framing is carried over from the governor pack's `gov-immigration-enforcement` context. |

Not chosen: school funding / instructional time (broad but rarely a contested choice in these candidates' materials;
EO 26-06 appears in the SD17 stakes instead) and the Climate Protection Program (no legislative floor vote to cite
for the incumbents). The kicker board is thin (2 of 29 on record) but is a live two-thirds vote and two candidates
addressed it explicitly.

## Roll calls used (all from OLIS measure histories, reviewed September 22, 2026)

- HB 3991 (2025 special session): House Sept 1, 2025, 36–12 (McLain carried; Rieke Smith aye with vote explanation;
  Helfrich excused); Senate Sept 29, 2025, 18–11 (Jama, Meek, Neron Misslin, Reynolds, Wagner aye). Signed Nov 7, 2025.
- HB 3546 POWER Act (2025): House Apr 22, 41–16 and concurrence June 5, 37–17 (Helfrich nay both; McLain aye;
  Neron aye Apr 22 while still in the House); Senate June 3, 18–12 (Jama, Meek, Neron Misslin, Reynolds, Wagner aye).
- HB 3644 shelter program (2025): House June 23, 33–11 (Helfrich nay; McLain, Rieke Smith aye); Senate June 26,
  19–10, carried by Neron Misslin (Jama, Meek, Reynolds, Wagner aye).
- HB 4002 (2024): House Feb 29, 51–7 (Helfrich, McLain, Neron, Reynolds aye); Senate Mar 1, 21–8 (Jama nay with vote
  explanation; Meek, Wagner aye).
- HB 3940 wildfire (2025): House June 23, 37–8 (Helfrich nay; McLain, Rieke Smith aye); Senate June 26, 20–8
  (Reynolds nay; Meek absent; Jama, Neron Misslin, Wagner aye).
- SB 1507 disconnect / EITC (2026): Senate Feb 16, 17–13 (Meek nay; Jama, Neron Misslin, Reynolds, Wagner aye);
  House Feb 25, 34–21 (Bunch, Helfrich nay; McLain, Rieke Smith aye).
- HB 4138 identification and masks (2026): House Feb 24, 36–19 and concurrence Mar 6, 34–18 (Bunch, Helfrich nay;
  McLain, Rieke Smith aye); Senate Mar 5, 18–10 (Jama, Meek, Neron Misslin, Reynolds, Wagner aye).
- Tenure checks: Neron Misslin sworn into the Senate May 9, 2025 (Washington County release, May 7, 2025); Rieke
  Smith took office June 9, 2025 (Capital Chronicle, June 9, 2025); Bunch took office Nov 17, 2025 (OPB, Nov 17, 2025),
  so only 2026-session votes are cited for him.

## Per race: stakes items, and each candidate's topic cells (added / partial / gap)

Shared stakes items and their sources: 2027–29 budget gap (OEA September 2026 forecast; CFO guidance in the note); Tax disconnect (LRO revenue impact, SB 1507 A); Road funding (OPB/Capital Chronicle Aug 21, 2026; ODOT and KATU in the note); Shelter money cliff (LFO HB 5011 budget report; EO 26-01 release in the note); Data centers (Capital Chronicle via JPR Sept 9, 2026; governor's release in the note); Deflection funding (CJC report Nov 1, 2025); Wildfire costs (LRO HB 3940 -A24; OPB acreage and SB 83 in the note); Federal enforcement (governor's April 9, 2026 release). District items: Boone Bridge money and Coastal road crews (Capital Chronicle via The Outlook, Feb 12, 2026); West Linn-Wilsonville schools (OPB Mar 9, 2026); Hillsboro data centers (OPB June 18, 2026; Mar 3, 2026 in the note); ICE at the Port (KMUN via OPB, June 8, 2026); Beaverton schools (OPB July 9, 2026; EO 26-06 release in the note); Abernethy Bridge (KATU Oct 1, 2025); Hospital detention (OPB Jan 23, 2026); Hood River bridge (OPB July 8, 2025; Bridge Authority overview in the note); Grasshopper Fire (OPB Aug 17, 2026); Wildfire map repeal (OLIS SB 83).
### Oregon Senate · District 13 (`oregon-state-senate-13`)

**Stakes items:** 2027–29 budget gap — Oregon Office of Economic Analysis · September 2026 revenue forecast (https://www.oregon.gov/das/oea/Documents/revenue0926.pdf); Road funding — OPB, from the Oregon Capital Chronicle · ODOT faces staff cuts as severe weather strains maintenance (https://www.opb.org/article/2026/08/21/odot-staff-cuts-maintenance-weather/); Boone Bridge money — Oregon Capital Chronicle, via The Outlook · Layoffs or redirecting funding: lawmakers grapple with ODOT budget gap again (https://theoutlookonline.com/2026/02/12/layoffs-or-redirecting-funding-oregon-lawmakers-grapple-with-odot-budget-gap-again/); West Linn-Wilsonville schools — OPB · After school closure vote, West Linn-Wilsonville school board faces recall (https://www.opb.org/article/2026/03/09/school-closure-vote-west-linn-wilsonville-recall/); Shelter money cliff — Legislative Fiscal Office · HB 5011 budget report, Housing and Community Services Department 2025–27 (https://olis.oregonlegislature.gov/liz/2025R1/Downloads/CommitteeMeetingDocument/308817); Data centers — Oregon Capital Chronicle, via Jefferson Public Radio · Kotek pauses data centers on state land; demonstrators want more (https://www.ijpr.org/politics-government/2026-09-09/gov-kotek-pauses-data-centers-on-state-land-capitol-demonstrators-want-her-to-go-further); Deflection funding — Oregon Criminal Justice Commission · Behavioral Health Initiatives Report (https://www.oregon.gov/cjc/CJC%20Document%20Library/2025_CJC_Behavioral_Health_Initiatives_Report.pdf).

| Candidate | Road pkg | Kicker | Budget gap | Data centers | Shelter | Deflection | Wildfire | Sanctuary |
|---|---|---|---|---|---|---|---|---|
| Courtney Neron Misslin | added: supports (record) | gap | added: supports (record) | added: supports (record) | added: supports (record) | added: supports (record) | added: supports (record) | added: supports (record) |
| Glenn Lancaster | added: opposes (own words) | added: opposes (own words) | added: opposes (own words) | gap | partial (own words) | partial (own words) | gap | gap |
| Tim E Nelson | gap | gap | gap | gap | gap | gap | gap | gap |

### Oregon Senate · District 15 (`oregon-state-senate-15`)

**Stakes items:** 2027–29 budget gap — Oregon Office of Economic Analysis · September 2026 revenue forecast (https://www.oregon.gov/das/oea/Documents/revenue0926.pdf); Hillsboro data centers — OPB · Hillsboro mayor’s absence looms large in heated data center discussions (https://www.opb.org/article/2026/06/18/hillsboro-mayor-absence-looms-large-heated-data-center-discussions/); Data centers — Oregon Capital Chronicle, via Jefferson Public Radio · Kotek pauses data centers on state land; demonstrators want more (https://www.ijpr.org/politics-government/2026-09-09/gov-kotek-pauses-data-centers-on-state-land-capitol-demonstrators-want-her-to-go-further); Road funding — OPB, from the Oregon Capital Chronicle · ODOT faces staff cuts as severe weather strains maintenance (https://www.opb.org/article/2026/08/21/odot-staff-cuts-maintenance-weather/); Shelter money cliff — Legislative Fiscal Office · HB 5011 budget report, Housing and Community Services Department 2025–27 (https://olis.oregonlegislature.gov/liz/2025R1/Downloads/CommitteeMeetingDocument/308817); Federal enforcement — Governor’s Office · Signs eight bills bolstering protections for immigrant and refugee communities (https://apps.oregon.gov/oregon-newsroom/OR/GOV/Posts/Post/governor-kotek-signs-bills-bolstering-protections-for-immigrant-and-refugee-communities); Deflection funding — Oregon Criminal Justice Commission · Behavioral Health Initiatives Report (https://www.oregon.gov/cjc/CJC%20Document%20Library/2025_CJC_Behavioral_Health_Initiatives_Report.pdf).

| Candidate | Road pkg | Kicker | Budget gap | Data centers | Shelter | Deflection | Wildfire | Sanctuary |
|---|---|---|---|---|---|---|---|---|
| Harold Hutchison | added: opposes (own words) | added: opposes (own words) | partial (own words) | gap | gap | gap | partial (own words) | added: opposes (own words) |
| Myrna A Munoz | gap | gap | added: supports (own words) | added: supports (own words) | partial (own words) | gap | gap | added: supports (own words) |

### Oregon Senate · District 16 (`oregon-state-senate-16`)

**Stakes items:** 2027–29 budget gap — Oregon Office of Economic Analysis · September 2026 revenue forecast (https://www.oregon.gov/das/oea/Documents/revenue0926.pdf); Road funding — OPB, from the Oregon Capital Chronicle · ODOT faces staff cuts as severe weather strains maintenance (https://www.opb.org/article/2026/08/21/odot-staff-cuts-maintenance-weather/); Coastal road crews — Oregon Capital Chronicle, via The Outlook · Layoffs or redirecting funding: lawmakers grapple with ODOT budget gap again (https://theoutlookonline.com/2026/02/12/layoffs-or-redirecting-funding-oregon-lawmakers-grapple-with-odot-budget-gap-again/); ICE at the Port — KMUN, via OPB · ICE operations at Port of Astoria spark concerns (https://www.opb.org/article/2026/06/08/astoria-oregon-ice-operations-spark-concerns-sanctuary-law/); Wildfire costs — Legislative Revenue Office · revenue impact of HB 3940 -A24 (https://olis.oregonlegislature.gov/liz/2025R1/Downloads/CommitteeMeetingDocument/309208); Shelter money cliff — Legislative Fiscal Office · HB 5011 budget report, Housing and Community Services Department 2025–27 (https://olis.oregonlegislature.gov/liz/2025R1/Downloads/CommitteeMeetingDocument/308817); Deflection funding — Oregon Criminal Justice Commission · Behavioral Health Initiatives Report (https://www.oregon.gov/cjc/CJC%20Document%20Library/2025_CJC_Behavioral_Health_Initiatives_Report.pdf).

| Candidate | Road pkg | Kicker | Budget gap | Data centers | Shelter | Deflection | Wildfire | Sanctuary |
|---|---|---|---|---|---|---|---|---|
| Courtney Bangs | added: opposes (own words) | gap | added: opposes (own words) | gap | gap | gap | gap | gap |
| Melisa Finkle | partial (own words) | gap | gap | gap | gap | gap | gap | gap |
| Rachel Armitage | added: opposes (reported) | gap | added: opposes (reported) | gap | gap | gap | gap | gap |

### Oregon Senate · District 17 (`oregon-state-senate-17`)

**Stakes items:** 2027–29 budget gap — Oregon Office of Economic Analysis · September 2026 revenue forecast (https://www.oregon.gov/das/oea/Documents/revenue0926.pdf); Beaverton schools — OPB · Oregon’s second largest school district has a new leader (https://www.opb.org/article/2026/07/09/beaverton-school-district-new-superintendent/); Road funding — OPB, from the Oregon Capital Chronicle · ODOT faces staff cuts as severe weather strains maintenance (https://www.opb.org/article/2026/08/21/odot-staff-cuts-maintenance-weather/); Shelter money cliff — Legislative Fiscal Office · HB 5011 budget report, Housing and Community Services Department 2025–27 (https://olis.oregonlegislature.gov/liz/2025R1/Downloads/CommitteeMeetingDocument/308817); Data centers — Oregon Capital Chronicle, via Jefferson Public Radio · Kotek pauses data centers on state land; demonstrators want more (https://www.ijpr.org/politics-government/2026-09-09/gov-kotek-pauses-data-centers-on-state-land-capitol-demonstrators-want-her-to-go-further); Deflection funding — Oregon Criminal Justice Commission · Behavioral Health Initiatives Report (https://www.oregon.gov/cjc/CJC%20Document%20Library/2025_CJC_Behavioral_Health_Initiatives_Report.pdf); Federal enforcement — Governor’s Office · Signs eight bills bolstering protections for immigrant and refugee communities (https://apps.oregon.gov/oregon-newsroom/OR/GOV/Posts/Post/governor-kotek-signs-bills-bolstering-protections-for-immigrant-and-refugee-communities).

| Candidate | Road pkg | Kicker | Budget gap | Data centers | Shelter | Deflection | Wildfire | Sanctuary |
|---|---|---|---|---|---|---|---|---|
| John A N Chee | gap | gap | added: opposes (own words) | gap | partial (own words) | partial (own words) | gap | gap |
| Lisa Reynolds | added: supports (record) | gap | added: supports (record) | added: supports (record) | added: supports (record) | added: supports (record) | added: opposes (record) | added: supports (record) |

### Oregon Senate · District 19 (`oregon-state-senate-19`)

**Stakes items:** 2027–29 budget gap — Oregon Office of Economic Analysis · September 2026 revenue forecast (https://www.oregon.gov/das/oea/Documents/revenue0926.pdf); Tax disconnect — Legislative Revenue Office · revenue impact of SB 1507 A (https://olis.oregonlegislature.gov/liz/2026R1/Downloads/CommitteeMeetingDocument/314766); Road funding — OPB, from the Oregon Capital Chronicle · ODOT faces staff cuts as severe weather strains maintenance (https://www.opb.org/article/2026/08/21/odot-staff-cuts-maintenance-weather/); Abernethy Bridge — KATU · ODOT leaders provide an update on agency projects and finances (https://katu.com/news/local/odot-leaders-provide-an-update-on-agency-projects-and-finances); West Linn-Wilsonville schools — OPB · After school closure vote, West Linn-Wilsonville school board faces recall (https://www.opb.org/article/2026/03/09/school-closure-vote-west-linn-wilsonville-recall/); Shelter money cliff — Legislative Fiscal Office · HB 5011 budget report, Housing and Community Services Department 2025–27 (https://olis.oregonlegislature.gov/liz/2025R1/Downloads/CommitteeMeetingDocument/308817); Data centers — Oregon Capital Chronicle, via Jefferson Public Radio · Kotek pauses data centers on state land; demonstrators want more (https://www.ijpr.org/politics-government/2026-09-09/gov-kotek-pauses-data-centers-on-state-land-capitol-demonstrators-want-her-to-go-further).

| Candidate | Road pkg | Kicker | Budget gap | Data centers | Shelter | Deflection | Wildfire | Sanctuary |
|---|---|---|---|---|---|---|---|---|
| Mary Dirksen | gap | gap | added: opposes (own words) | gap | partial (own words) | partial (own words) | gap | gap |
| Rob Wagner | added: supports (record) | gap | added: supports (record) | added: supports (record) | added: supports (record) | added: supports (record) | added: supports (record) | added: supports (record) |

### Oregon Senate · District 20 (`oregon-state-senate-20`)

**Stakes items:** 2027–29 budget gap — Oregon Office of Economic Analysis · September 2026 revenue forecast (https://www.oregon.gov/das/oea/Documents/revenue0926.pdf); Tax disconnect — Legislative Revenue Office · revenue impact of SB 1507 A (https://olis.oregonlegislature.gov/liz/2026R1/Downloads/CommitteeMeetingDocument/314766); Road funding — OPB, from the Oregon Capital Chronicle · ODOT faces staff cuts as severe weather strains maintenance (https://www.opb.org/article/2026/08/21/odot-staff-cuts-maintenance-weather/); Abernethy Bridge — KATU · ODOT leaders provide an update on agency projects and finances (https://katu.com/news/local/odot-leaders-provide-an-update-on-agency-projects-and-finances); Shelter money cliff — Legislative Fiscal Office · HB 5011 budget report, Housing and Community Services Department 2025–27 (https://olis.oregonlegislature.gov/liz/2025R1/Downloads/CommitteeMeetingDocument/308817); Deflection funding — Oregon Criminal Justice Commission · Behavioral Health Initiatives Report (https://www.oregon.gov/cjc/CJC%20Document%20Library/2025_CJC_Behavioral_Health_Initiatives_Report.pdf); Data centers — Oregon Capital Chronicle, via Jefferson Public Radio · Kotek pauses data centers on state land; demonstrators want more (https://www.ijpr.org/politics-government/2026-09-09/gov-kotek-pauses-data-centers-on-state-land-capitol-demonstrators-want-her-to-go-further).

| Candidate | Road pkg | Kicker | Budget gap | Data centers | Shelter | Deflection | Wildfire | Sanctuary |
|---|---|---|---|---|---|---|---|---|
| Mark Meek | added: supports (record) | gap | added: opposes (record) | added: supports (record) | added: supports (record) | added: supports (record) | gap | added: supports (record) |
| Michele Stroh | added: opposes (own words) | gap | added: opposes (own words) | gap | partial (own words) | added: supports (own words) | gap | gap |

### Oregon Senate · District 24 (`oregon-state-senate-24`)

**Stakes items:** 2027–29 budget gap — Oregon Office of Economic Analysis · September 2026 revenue forecast (https://www.oregon.gov/das/oea/Documents/revenue0926.pdf); Shelter money cliff — Legislative Fiscal Office · HB 5011 budget report, Housing and Community Services Department 2025–27 (https://olis.oregonlegislature.gov/liz/2025R1/Downloads/CommitteeMeetingDocument/308817); Road funding — OPB, from the Oregon Capital Chronicle · ODOT faces staff cuts as severe weather strains maintenance (https://www.opb.org/article/2026/08/21/odot-staff-cuts-maintenance-weather/); Hospital detention — OPB · Gresham family detained by immigration officers while seeking medical care for their 7-year-old (https://www.opb.org/article/2026/01/23/gresham-family-seeking-medical-care-child-detained-immigration-officers/); Federal enforcement — Governor’s Office · Signs eight bills bolstering protections for immigrant and refugee communities (https://apps.oregon.gov/oregon-newsroom/OR/GOV/Posts/Post/governor-kotek-signs-bills-bolstering-protections-for-immigrant-and-refugee-communities); Data centers — Oregon Capital Chronicle, via Jefferson Public Radio · Kotek pauses data centers on state land; demonstrators want more (https://www.ijpr.org/politics-government/2026-09-09/gov-kotek-pauses-data-centers-on-state-land-capitol-demonstrators-want-her-to-go-further); Deflection funding — Oregon Criminal Justice Commission · Behavioral Health Initiatives Report (https://www.oregon.gov/cjc/CJC%20Document%20Library/2025_CJC_Behavioral_Health_Initiatives_Report.pdf).

| Candidate | Road pkg | Kicker | Budget gap | Data centers | Shelter | Deflection | Wildfire | Sanctuary |
|---|---|---|---|---|---|---|---|---|
| Kayse Jama | added: supports (record) | gap | added: supports (record) | added: supports (record) | added: supports (record) | added: opposes (record) | added: supports (record) | added: supports (record) |

### Oregon Senate · District 26 (`oregon-state-senate-26`)

**Stakes items:** 2027–29 budget gap — Oregon Office of Economic Analysis · September 2026 revenue forecast (https://www.oregon.gov/das/oea/Documents/revenue0926.pdf); Hood River bridge — OPB · Oregon matches Washington’s $125 million to replace the Hood River–White Salmon bridge (https://www.opb.org/article/2025/07/08/oregon-matches-washington-125-million-replace-hood-river-white-salmon-bridge/); Grasshopper Fire — OPB · The Grasshopper Fire destroyed homes and tested firefighters (https://www.opb.org/article/2026/08/17/grasshopper-fire-what-comes-next/); Wildfire costs — Legislative Revenue Office · revenue impact of HB 3940 -A24 (https://olis.oregonlegislature.gov/liz/2025R1/Downloads/CommitteeMeetingDocument/309208); Road funding — OPB, from the Oregon Capital Chronicle · ODOT faces staff cuts as severe weather strains maintenance (https://www.opb.org/article/2026/08/21/odot-staff-cuts-maintenance-weather/); Data centers — Oregon Capital Chronicle, via Jefferson Public Radio · Kotek pauses data centers on state land; demonstrators want more (https://www.ijpr.org/politics-government/2026-09-09/gov-kotek-pauses-data-centers-on-state-land-capitol-demonstrators-want-her-to-go-further); Shelter money cliff — Legislative Fiscal Office · HB 5011 budget report, Housing and Community Services Department 2025–27 (https://olis.oregonlegislature.gov/liz/2025R1/Downloads/CommitteeMeetingDocument/308817).

| Candidate | Road pkg | Kicker | Budget gap | Data centers | Shelter | Deflection | Wildfire | Sanctuary |
|---|---|---|---|---|---|---|---|---|
| Jeff Helfrich | added: opposes (own words) | gap | added: opposes (record) | added: opposes (record) | added: opposes (record) | added: supports (record) | added: opposes (record) | added: opposes (record) |
| Nicole Bassett | gap | gap | partial (own words) | partial (own words) | gap | gap | added: supports (own words) | gap |

### Oregon House · District 26 (`oregon-state-house-26`)

**Stakes items:** 2027–29 budget gap — Oregon Office of Economic Analysis · September 2026 revenue forecast (https://www.oregon.gov/das/oea/Documents/revenue0926.pdf); Road funding — OPB, from the Oregon Capital Chronicle · ODOT faces staff cuts as severe weather strains maintenance (https://www.opb.org/article/2026/08/21/odot-staff-cuts-maintenance-weather/); Boone Bridge money — Oregon Capital Chronicle, via The Outlook · Layoffs or redirecting funding: lawmakers grapple with ODOT budget gap again (https://theoutlookonline.com/2026/02/12/layoffs-or-redirecting-funding-oregon-lawmakers-grapple-with-odot-budget-gap-again/); West Linn-Wilsonville schools — OPB · After school closure vote, West Linn-Wilsonville school board faces recall (https://www.opb.org/article/2026/03/09/school-closure-vote-west-linn-wilsonville-recall/); Shelter money cliff — Legislative Fiscal Office · HB 5011 budget report, Housing and Community Services Department 2025–27 (https://olis.oregonlegislature.gov/liz/2025R1/Downloads/CommitteeMeetingDocument/308817); Data centers — Oregon Capital Chronicle, via Jefferson Public Radio · Kotek pauses data centers on state land; demonstrators want more (https://www.ijpr.org/politics-government/2026-09-09/gov-kotek-pauses-data-centers-on-state-land-capitol-demonstrators-want-her-to-go-further); Deflection funding — Oregon Criminal Justice Commission · Behavioral Health Initiatives Report (https://www.oregon.gov/cjc/CJC%20Document%20Library/2025_CJC_Behavioral_Health_Initiatives_Report.pdf).

| Candidate | Road pkg | Kicker | Budget gap | Data centers | Shelter | Deflection | Wildfire | Sanctuary |
|---|---|---|---|---|---|---|---|---|
| Steph Terrio | gap | gap | partial (own words) | partial (own words) | partial (own words) | gap | gap | gap |
| Stephanie Carkin | added: opposes (own words) | gap | added: opposes (own words) | gap | gap | gap | gap | gap |
| Sue R Rieke Smith | added: supports (record) | gap | added: supports (record) | added: supports (own words) | added: supports (record) | partial (own words) | added: supports (record) | added: supports (record) |

### Oregon House · District 29 (`oregon-state-house-29`)

**Stakes items:** 2027–29 budget gap — Oregon Office of Economic Analysis · September 2026 revenue forecast (https://www.oregon.gov/das/oea/Documents/revenue0926.pdf); Hillsboro data centers — OPB · Hillsboro mayor’s absence looms large in heated data center discussions (https://www.opb.org/article/2026/06/18/hillsboro-mayor-absence-looms-large-heated-data-center-discussions/); Data centers — Oregon Capital Chronicle, via Jefferson Public Radio · Kotek pauses data centers on state land; demonstrators want more (https://www.ijpr.org/politics-government/2026-09-09/gov-kotek-pauses-data-centers-on-state-land-capitol-demonstrators-want-her-to-go-further); Road funding — OPB, from the Oregon Capital Chronicle · ODOT faces staff cuts as severe weather strains maintenance (https://www.opb.org/article/2026/08/21/odot-staff-cuts-maintenance-weather/); Shelter money cliff — Legislative Fiscal Office · HB 5011 budget report, Housing and Community Services Department 2025–27 (https://olis.oregonlegislature.gov/liz/2025R1/Downloads/CommitteeMeetingDocument/308817); Federal enforcement — Governor’s Office · Signs eight bills bolstering protections for immigrant and refugee communities (https://apps.oregon.gov/oregon-newsroom/OR/GOV/Posts/Post/governor-kotek-signs-bills-bolstering-protections-for-immigrant-and-refugee-communities); Deflection funding — Oregon Criminal Justice Commission · Behavioral Health Initiatives Report (https://www.oregon.gov/cjc/CJC%20Document%20Library/2025_CJC_Behavioral_Health_Initiatives_Report.pdf).

| Candidate | Road pkg | Kicker | Budget gap | Data centers | Shelter | Deflection | Wildfire | Sanctuary |
|---|---|---|---|---|---|---|---|---|
| Brian Schimmel | gap | gap | partial (own words) | gap | gap | gap | gap | gap |
| Susan McLain | added: supports (record) | gap | added: supports (record) | added: supports (record) | added: supports (record) | added: supports (record) | added: supports (record) | added: supports (record) |

### Oregon House · District 40 (`oregon-state-house-40`)

**Stakes items:** 2027–29 budget gap — Oregon Office of Economic Analysis · September 2026 revenue forecast (https://www.oregon.gov/das/oea/Documents/revenue0926.pdf); Road funding — OPB, from the Oregon Capital Chronicle · ODOT faces staff cuts as severe weather strains maintenance (https://www.opb.org/article/2026/08/21/odot-staff-cuts-maintenance-weather/); Abernethy Bridge — KATU · ODOT leaders provide an update on agency projects and finances (https://katu.com/news/local/odot-leaders-provide-an-update-on-agency-projects-and-finances); Shelter money cliff — Legislative Fiscal Office · HB 5011 budget report, Housing and Community Services Department 2025–27 (https://olis.oregonlegislature.gov/liz/2025R1/Downloads/CommitteeMeetingDocument/308817); Deflection funding — Oregon Criminal Justice Commission · Behavioral Health Initiatives Report (https://www.oregon.gov/cjc/CJC%20Document%20Library/2025_CJC_Behavioral_Health_Initiatives_Report.pdf); Data centers — Oregon Capital Chronicle, via Jefferson Public Radio · Kotek pauses data centers on state land; demonstrators want more (https://www.ijpr.org/politics-government/2026-09-09/gov-kotek-pauses-data-centers-on-state-land-capitol-demonstrators-want-her-to-go-further); Tax disconnect — Legislative Revenue Office · revenue impact of SB 1507 A (https://olis.oregonlegislature.gov/liz/2026R1/Downloads/CommitteeMeetingDocument/314766).

| Candidate | Road pkg | Kicker | Budget gap | Data centers | Shelter | Deflection | Wildfire | Sanctuary |
|---|---|---|---|---|---|---|---|---|
| Adam Baker | added: opposes (own words) | gap | added: opposes (own words) | partial (own words) | partial (own words) | partial (own words) | gap | gap |
| Michael W Sugar | partial (own words) | gap | added: supports (own words) | gap | partial (own words) | partial (own words) | added: supports (own words) | added: supports (own words) |
| Pat Hubbell | gap | gap | added: opposes (own words) | gap | gap | partial (own words) | gap | gap |

### Oregon House · District 51 (`oregon-state-house-51`)

**Stakes items:** 2027–29 budget gap — Oregon Office of Economic Analysis · September 2026 revenue forecast (https://www.oregon.gov/das/oea/Documents/revenue0926.pdf); Wildfire costs — Legislative Revenue Office · revenue impact of HB 3940 -A24 (https://olis.oregonlegislature.gov/liz/2025R1/Downloads/CommitteeMeetingDocument/309208); Wildfire map repeal — OLIS · SB 83 (2025), wildfire hazard map and building-code repeal (https://olis.oregonlegislature.gov/liz/2025R1/Measures/Overview/SB83); Road funding — OPB, from the Oregon Capital Chronicle · ODOT faces staff cuts as severe weather strains maintenance (https://www.opb.org/article/2026/08/21/odot-staff-cuts-maintenance-weather/); Shelter money cliff — Legislative Fiscal Office · HB 5011 budget report, Housing and Community Services Department 2025–27 (https://olis.oregonlegislature.gov/liz/2025R1/Downloads/CommitteeMeetingDocument/308817); Data centers — Oregon Capital Chronicle, via Jefferson Public Radio · Kotek pauses data centers on state land; demonstrators want more (https://www.ijpr.org/politics-government/2026-09-09/gov-kotek-pauses-data-centers-on-state-land-capitol-demonstrators-want-her-to-go-further); Tax disconnect — Legislative Revenue Office · revenue impact of SB 1507 A (https://olis.oregonlegislature.gov/liz/2026R1/Downloads/CommitteeMeetingDocument/314766).

| Candidate | Road pkg | Kicker | Budget gap | Data centers | Shelter | Deflection | Wildfire | Sanctuary |
|---|---|---|---|---|---|---|---|---|
| Darla Mead | partial (own words) | gap | partial (own words) | added: supports (own words) | partial (own words) | gap | partial (own words) | gap |
| Matt Bunch | added: opposes (own words) | gap | added: opposes (record) | gap | partial (own words) | gap | gap | added: opposes (record) |

### Oregon House · District 52 (`oregon-state-house-52`)

**Stakes items:** 2027–29 budget gap — Oregon Office of Economic Analysis · September 2026 revenue forecast (https://www.oregon.gov/das/oea/Documents/revenue0926.pdf); Hood River bridge — OPB · Oregon matches Washington’s $125 million to replace the Hood River–White Salmon bridge (https://www.opb.org/article/2025/07/08/oregon-matches-washington-125-million-replace-hood-river-white-salmon-bridge/); Grasshopper Fire — OPB · The Grasshopper Fire destroyed homes and tested firefighters (https://www.opb.org/article/2026/08/17/grasshopper-fire-what-comes-next/); Wildfire costs — Legislative Revenue Office · revenue impact of HB 3940 -A24 (https://olis.oregonlegislature.gov/liz/2025R1/Downloads/CommitteeMeetingDocument/309208); Data centers — Oregon Capital Chronicle, via Jefferson Public Radio · Kotek pauses data centers on state land; demonstrators want more (https://www.ijpr.org/politics-government/2026-09-09/gov-kotek-pauses-data-centers-on-state-land-capitol-demonstrators-want-her-to-go-further); Road funding — OPB, from the Oregon Capital Chronicle · ODOT faces staff cuts as severe weather strains maintenance (https://www.opb.org/article/2026/08/21/odot-staff-cuts-maintenance-weather/); Shelter money cliff — Legislative Fiscal Office · HB 5011 budget report, Housing and Community Services Department 2025–27 (https://olis.oregonlegislature.gov/liz/2025R1/Downloads/CommitteeMeetingDocument/308817).

| Candidate | Road pkg | Kicker | Budget gap | Data centers | Shelter | Deflection | Wildfire | Sanctuary |
|---|---|---|---|---|---|---|---|---|
| Hank Sanders | gap | gap | gap | added: supports (own words) | gap | gap | added: supports (own words) | gap |
| Scott C Hege | partial (own words) | gap | added: opposes (own words) | added: mixed (reported) | gap | gap | added: supports (reported) | gap |



Totals across the 29 candidates × 8 topics (232 cells): 90 added (57 supports, 32 opposes, 1 mixed), 31 partial,
111 gaps. By source kind: 54 public-record cells, 63 candidate-statement cells, 4 reported.

## Venues checked per candidate (all fetched September 21–22, 2026)

- Neron Misslin: courtneyfororegon.com/priorities and home; SOS statement pp. 64–65; OLIS (HB 3991, 3546, 3644, 4002, 3940, SB 1507, HB 4138).
- Lancaster: glennlancaster.com/issues2/ and home (news page not read); SOS statement pp. 66–67.
- Nelson: nothing published found (no site, statement, questionnaire); ORESTAR refuses automated requests. All eight gaps.
- Muñoz: myrnaforsenate.com/issues and /about; SOS statement pp. 68–69.
- Hutchison: haroldhutchison.carrd.co; Oregon Abigail Adams Project questionnaire (SS15-06); SOS statement pp. 70–71.
- Bangs: courtneybangs.com/priorities; SOS statement pp. 72–73; Headlight Herald April 21, 2026 edition (her forum remarks are not in the text).
- Armitage: senatedistrict16.com (JavaScript-rendered, no text); Headlight Herald April 21, 2026 interview and forum report (PDF); SOS statement pp. 74–75.
- Finkle: Tillamook County Pioneer profile (already on file); SOS statement pp. 76–77.
- Reynolds: lisafororegon.com/priorities; SOS statement pp. 78–79; OLIS.
- Chee: Ballotpedia Candidate Connection survey; no site or statement.
- Wagner: robwagnerfororegon.com/priorities/; SOS statement pp. 80–81; KATU May 20, 2026 ("the needs remain"; not used as a cell); OLIS.
- Dirksen: marydirksen.com home and /about; SOS statement pp. 82–83.
- Meek: votemarkmeek.com; SOS statement pp. 86–87; OLIS.
- Stroh: votestroh.com home and /micheles-record/; SOS statement pp. 84–85.
- Jama: kaysejama.com (home, accomplishments, homelessness, environment); SOS statement pp. 88–89; OLIS.
- Bassett: bassettfororegon.com failed TLS on both attempts September 22 (`tlsv1 alert protocol version`), so her cells rest on the SOS statement pp. 90–91; recheck the site.
- Helfrich: helfrichfororegon.com/priorities; SOS statement pp. 92–93; OLIS; OPB July 8, 2025 (quoted on the Hood River bridge; not used as a cell).
- Rieke Smith: votesueriekesmith.com/a-plan-for-action; SOS statement pp. 179–180; OLIS.
- Carkin: stephaniefororegon.com/issues; SOS statement pp. 175–176.
- Terrio: terrioforus.com/policy; SOS statement pp. 177–178.
- McLain: susanmclain.org/priorities/; SOS statement pp. 192–193; OLIS.
- Schimmel: brianschimmel.org (platform headings only); Ballotpedia survey; SOS statement pp. 190–191.
- Baker: voteadambaker.com/issues/; SOS statement pp. 226–227.
- Sugar: sugarfororegon.com/priorities (accordion text decoded from the page's embedded JSON); SOS statement pp. 224–225.
- Hubbell: hubbell4health.com and /platform; SOS statement pp. 228–229.
- Mead: darlameadfororegon.com home, /issues/creating-local-economic-opportunity, /issues/enforcing-environmental-protections; SOS statement pp. 263–264.
- Bunch: mattbunch51.com/issues; SOS statement pp. 261–262; OLIS (2026 session only).
- Sanders: hankfororegon.com/issues and the three issue posts; Columbia Community Connection Sept 16, 2026 profile; SOS statement pp. 265–266.
- Hege: hegefororegon.com/priorities; Ballotpedia survey; Columbia Community Connection Sept 16, 2026 interview; SOS statement pp. 267–268.

## Gap questions to email each campaign

Shared wording, then the per-campaign list of open topics.

- Road package: "Would you vote for a 2027 transportation package that raises the gas tax or vehicle fees? If not, what would you fund ODOT maintenance with after June 2027?"
- Kicker: "Would you vote to hold back any part of a future kicker refund, and for what?"
- Budget gap: "Should the 2027–29 gap be closed with new revenue, cuts, or both? Which first?"
- Data centers: "Separate power rates, an end to property-tax breaks, or a pause on new data centers: which would you vote for?"
- Shelter: "Would you renew the $102 million of one-time shelter money that ends June 30, 2027?"
- Deflection: "Would you keep funding county deflection programs, and keep possession a misdemeanor?"
- Wildfire: "Should the state spend more on wildfire prevention and suppression, and from what source?"
- Sanctuary: "Would you vote for further state limits on federal immigration enforcement, repeal existing ones, or leave the law as it is?"

Open topics by campaign: Neron Misslin — kicker. Lancaster — data centers, wildfire, sanctuary (and the exact shelter and
deflection choices). Nelson — all eight. Muñoz — road package, kicker, deflection, wildfire (and the shelter choice).
Hutchison — data centers, shelter, deflection (and the budget-gap and wildfire choices). Bangs — kicker, data centers,
shelter, deflection, wildfire, sanctuary. Armitage — kicker, data centers, shelter, deflection, wildfire, sanctuary.
Finkle — everything but roads. Reynolds — kicker. Chee — road package, kicker, data centers, wildfire, sanctuary.
Wagner — kicker. Dirksen — road package, kicker, data centers, wildfire, sanctuary. Meek — kicker, wildfire (absent for
HB 3940). Stroh — kicker, data centers, wildfire, sanctuary. Jama — kicker. Bassett — road package, kicker, shelter,
deflection, sanctuary. Helfrich — kicker. Rieke Smith — kicker. Carkin — kicker, data centers, shelter, deflection,
wildfire, sanctuary. Terrio — road package, kicker, deflection, wildfire, sanctuary. McLain — kicker. Schimmel —
everything but the budget gap. Baker — kicker, wildfire, sanctuary. Sugar — kicker, data centers. Hubbell — road
package, kicker, data centers, shelter, wildfire, sanctuary. Mead — kicker, deflection, sanctuary. Bunch — kicker,
data centers, deflection, wildfire. Sanders — road package, kicker, budget gap, shelter, deflection, sanctuary.
Hege — kicker, shelter, deflection, sanctuary.

## Least sure

1. Reynolds "opposes" on wildfire money rests on a single no vote on HB 3940; no vote explanation is on the
   history, so her reason (the nicotine tax, the Rainy Day Fund transfer, or something else) is unknown. The text
   states only the vote.
2. Meek "opposes" on the budget-gap topic is his no vote on SB 1507 (the one Democrat among the nays); his reason
   is not on the record. Stroh's statement (p. 85) describes his June 2025 opposition to an earlier transportation
   bill and a committee removal; that account is hers, not the record, and is not used.
3. Helfrich's transportation cell is a candidate statement ("I opposed major tax increases, including the gas
   tax"); he was excused for the HB 3991 floor vote, which the evidence note says.
4. Hege's data-center cell is "mixed" from the Columbia Community Connection interview: opposes a statewide
   moratorium, wants transparency, says The Dalles does not need more. His own site says local decisions with
   public information on resource use; the two agree.
5. Terrio's budget cell is "partial" because her 1.5% corporate tax increase is written as Medicare reform.
6. The 83%–17% Measure 120 result is taken from KATU (May 20, 2026); the SOS results site is JavaScript-rendered
   and Ballotpedia's page for the measure was not found under the expected title.
7. The ODOT bill numbers for the 2026 gap-closing "two bills" could not be identified from OLIS titles (likely a
   budget-reconciliation bill plus a redirect); the context cites ODOT's own page for the $297 million.
8. Bassett's site was unreachable (TLS failure) on September 22; her three cells use the filed statement only.
9. Neron Misslin's HB 3546 House vote of April 22, 2025 (aye, before her Senate appointment) is inferred from her
   absence from the nay and excused lists, as are all "aye" attributions here; OLIS prints only nays and excused
   by name. Every aye cell was checked against the tenure dates above.
10. The Hillsboro "15 developments" and "34 data centers" figures are OPB's (June 18, 2026), the latter attributed
    there to an outside count.
