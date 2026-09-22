# What's at stake: Portland City Council, Districts 3 and 4 (September 22, 2026)

File: `src/lib/voters-guide/race-sheet/content/packs/council.ts` (the council pack's `stakes` array; nothing else in the pack). One `RaceStakes` per race, eight items each, seven shared and one specific to the district. Every source is a City record read on September 22, 2026; reporting that carried the same number is named in the Evidence note.

Checks run: `npx vitest run tests/voters-guide/race-sheet.test.ts` (2,168 passed) and `npx tsc --noEmit -p .` (clean). A throwaway test confirmed both race ids resolve, labels are ≤4 words, labels are unique per race, and every source is https. Every source URL was fetched and returned 200 on September 22 except the Impact Reduction Program dashboard, which answered 504 to curl three times but loaded in full through the page fetcher (heavy embedded Clear Impact dashboards; the figures were re-confirmed on the second load).

## The intro (both districts)

Verified facts behind the intro sentences (the intro has no source field):

| Claim | Where verified |
| --- | --- |
| Twelve councilors, four districts of three; the mayor is not a member | City Charter §2-102, https://www.portland.gov/charter/2/1 |
| Legislative and quasi-judicial authority in the Council; executive and administrative authority in the mayor | Charter §2-101 and §2-104, same page; the mayor "executes and administers the City Code" (§2-302, https://www.portland.gov/charter/2/3); bureaus moved under the city administrator July 1, 2024, https://www.portland.gov/transition/city-organization |
| Districts 3 and 4 seats won in 2024 carried an initial two-year term; from this election, four years | Charter §3-101, https://www.portland.gov/charter/3/1 |
| $8.55 billion total budget; $803.4 million General Fund discretionary | City Budget Office, FY 2026–27 Adopted Budget, https://www.portland.gov/budget/2026-2027-budget/development/adopted |
| District 3 neighborhoods (Buckman, Kerns, Montavilla, Woodstock; inner Southeast plus Laurelhurst, Rose City Park, Roseway, Beaumont-Wilshire in inner Northeast) | https://www.portland.gov/council/districts/3 |
| District 4 neighborhoods (Portland Downtown, Old Town, Pearl District, Northwest District, Southwest Hills, Multnomah, Sellwood-Moreland, Eastmoreland) | https://www.portland.gov/council/districts/4 |

The task brief called District 3 "inner Southeast"; the City's page also lists inner Northeast neighborhoods, and the hub's district line already says "Southeast and inner Northeast", so the intro says "inner Southeast and a slice of inner Northeast" to match the map.

## Items and sources

### Shared by both districts

| # | Label | Numbers in the text | Source (kind: Public record) |
| --- | --- | --- | --- |
| 1 | Next budget gap | $8.55B budget; $803.4M discretionary; $170M gap; ~140 positions; $47M reserves/contingency; $27M PCEF interest; assessed value growth <2.2% two years running; personnel ~70% of ongoing GF bureau costs; work session Sept 23 | Financial Stabilization & Recovery Plan Workgroup recommendations (September 2026), https://www.portland.gov/hello/documents/financial-stabilization-and-recovery-plan-workgroup-recommendations (Appendix A). June closure figures: City release June 18, 2026, https://www.portland.gov/hello/news/2026/6/18/portland-city-council-adopts-final-budget-2026-27. Supplemental: Ordinance 192207, https://www.portland.gov/council/documents/ordinance/passed/192207 ($9.96M contingency, 30 positions, 10–2, July 22, 2026). Work session listed at https://www.portland.gov/hello/financial-stabilization |
| 2 | Moda Center deal | ~$500M renovation; $573M public budget = $365M state + $120M City ("from sources yet to be confirmed") + $88M county; $275M City over 20 years from Spectator Venues fund; definitive documents by Dec 31, 2026; 8–4 | Resolution 37750, https://www.portland.gov/council/documents/resolution/adopted/37750 |
| 3 | Camping and removals | Code 14A.50.150/.160; 7,480 removals, 105,180 reports, $8,521,559 removal cost in FY 2025–26; $4.3M amendment, 5 yes of 7 needed; 580 vs 876 overnight beds | IRP dashboard (updated 8/7/26), https://www.portland.gov/homelessness-impact-reduction/impact-reduction-program-dashboard-and-performance-measures. Code: https://www.portland.gov/code/14/a50/150 and /160. Amendment: OPB, Nov 13, 2025, https://www.opb.org/article/2025/11/13/homeless-camp-removal-sweep-portland/. Beds: https://www.portland.gov/shelter-services/news/2026/7/21/changes-city-shelter-services |
| 4 | Street Response | $10M budget; 52 staff; seven days a week, not 24/7; 15,353 calls in 2025; 6% co-response; Resolution 37709 10–2; 4.0 FTE / $659,274 restored | PSR five-year article, Feb 17, 2026, https://www.portland.gov/streetresponse/news/2026/2/17/five-years-portland-street-response-has-become-pillar-public-safety. Resolution 37709: https://www.portland.gov/council/documents/resolution/adopted/37709. Amendment Morillo 1: passed amendments PDF, https://www.portland.gov/budget/2026-2027-budget/documents/fy-26-27-budget-amendments-only-passed-amendments/download (p. 25–26) |
| 5 | Street fee, water bills | $12 / $8.40 a month from Jan 1, 2027; $46M a year net; 75% maintenance; 9–3; water 8–4, $65.57 to $70.89; Bull Run $2.1B (2024) to $2.56B (Feb 2026), $2.58B program-wide; deadline Sept 2029 | Ordinance 192171, https://www.portland.gov/council/documents/ordinance/passed/192171. Water: Ordinance 192183, https://www.portland.gov/council/documents/ordinance/passed/192183. Bull Run: https://www.portland.gov/water/bullruntreatment/filtration/filtration-costs-and-funding and OPB Feb 20, 2026, https://www.opb.org/article/2026/02/19/bull-run-filtration-cost-increase/ |
| 6 | Police staffing | 877 authorized sworn; ~89 positions / $11.7M unfunded; ~$320M budget; 20.4 min (FY 2024–25) vs 7.5 (FY 2015–16); $37.3M/yr by FY 2035–36; $338M capital; Resolution 37738 7–5 | Report on police staff recruitment goals and costs, June 15, 2026, https://www.portland.gov/community-safety/documents/report-police-staff-recruitment-goals-and-costs (pp. 4–5, 12, 18) |
| 7 | Data centers | 11–0, one absent; no NDAs; notice at 20 MW; intent to pursue moratorium or zoning limits on hyperscale data centers; 5.6% of Oregon's electricity | Resolution 37753, https://www.portland.gov/council/documents/resolution/adopted/37753 |

### District 3 only

| # | Label | Numbers in the text | Source |
| --- | --- | --- | --- |
| 8 | Shelter in District 3 | Clinton Triangle, 1490 SE Gideon St, 160 units / 205 people; SE Grand Recovery 140 beds + CityTeam Grand 80 beds = 220; 718 vs 867 alternative/24-7 capacity; shelter services cut $18M (31%) | City Shelter Services, "Changes for City shelter services," July 21, 2026 (updated Aug 24), https://www.portland.gov/shelter-services/news/2026/7/21/changes-city-shelter-services. Cut: City release June 18, 2026 |

Placement: Clinton Triangle is in Hosford-Abernethy and both SE Grand shelters are in Buckman, both on the District 3 page.

### District 4 only

| # | Label | Numbers in the text | Source |
| --- | --- | --- | --- |
| 8 | Keller and PSU venue | ~3,000 seats; 2030 goal; $137.5M state commitment; Keller 1,200–1,800 seats; $8.5M–$17.5M maintenance over ten years; PSU agreement by Dec 1, 2026; financial plan before any commitment; 8–4 | Resolution 37752, https://www.portland.gov/council/documents/resolution/adopted/37752 |

Placement: the Keller and the PSU site (310/330 SW Lincoln St) are in Portland Downtown, on the District 4 page.

## Order on the page

District 3: budget, Moda, camping, shelter (D3), Street Response, street fee and water, police, data centers. District 4: budget, Moda, camping, Street Response, street fee and water, police, data centers, Keller/PSU. The district item sits next to the topic it extends (camping → shelter for District 3; the venue decision last for District 4, as the newest vote).

## Not used, and why

- Street fee and water rates are one item, not two, to keep each district at eight items with a district-specific one; both charges land on the same utility bill and both had spring 2026 votes. If the block can carry nine, split them: the water ordinance and the Bull Run page are already in the Evidence note.
- Zenith franchise transfer (Ordinance 2026-263, NW Front Ave, District 4): failed 5–6 with one absent on September 16; a motion to reconsider was pending for September 23 (https://www.portland.gov/council/documents/ordinance/zenith-franchise-transfer-isq-holdings). Left out because it may be resolved the day after this is written; worth adding once the outcome is on the record.
- West-side shelter changes for District 4: NW Northrup Shelter closed September 18, 2026; River District Navigation Center closed August 2026; Multnomah Safe Rest Village (2731 SW Multnomah Blvd, 100 units / 130 people) converts to a recovery-focused site in fall 2026; SW Naito Village (55 units / 60 people) expanded. All on the shelter-changes page. A ninth item if wanted.
- Montavilla Park picnic shelter: $755,000 from Parks Levy contingency to rebuild the shelter demolished in 2021 (amendments Koyama Lane 6 and 9, passed June 11, 2026). District 3 and specific, but small next to the rest.
- Water bonds: Ordinance 192177 (May 20, 2026, 9–3) authorized up to $525 million in net proceeds, mainly for Bull Run. Already in the repo's council record; the item cites the program total instead.
- A FY 2027–28 gap figure: the City Budget Office's March 2026 update publishes a balanced five-year forecast (FY 2027–28 resources $767.3M against CAL expenses $767.4M after the FY 2026–27 ongoing reductions), not a projected gap, and no fall 2026 forecast was posted by September 22 (https://www.portland.gov/budget/2026-2027-budget/documents/general-fund-forecast-march-2026-update/download). The item therefore states the one-time money used to close FY 2026–27 and the workgroup's structural findings rather than a number for next year. The December 2026 forecast will give one.

## Least sure

1. **"Next budget gap" as a label** with no dollar figure for FY 2027–28 in the text: the label names the problem the next term opens with; the text gives the one-time closures that set it up. Rename to "Budget and reserves" if the reviewer prefers the label to match the numbers exactly.
2. **Moda: "$120 million from the City 'from sources yet to be confirmed'"** is the resolution's own phrase; the $573 million public budget is the sum of the state, City and county construction shares (365 + 120 + 88), with the $275 million over 20 years and the county's $13.6 million ongoing on top. The text says "plus" for the $275 million so the reader does not add it into $573 million.
3. **Street Response "not around the clock"**: the February 2026 page says PSR answers calls seven days a week and that many hope it "will finally operate around the clock"; it does not print hours. Council's resolution did not mandate 24/7. If hours have changed since February, the sentence needs updating.
4. **Police "about 89 positions ($11.7 million) unfunded"** is the report's estimate of positions that cannot be filled within the current appropriation while keeping overtime at current levels; it is not a vacancy count (the report separately puts vacancies at around 10%).
5. **Bull Run "rose about $450 million in February 2026 to $2.56 billion"** is the project figure OPB reported on February 20, 2026 from the bureau's announcement; the bureau's page now says $2.58 billion program-wide (including $20 million corrosion control and $101 million financing) and $2.46 billion for the filtration project itself. The text gives both so neither reads as a contradiction.
6. **Camping "580 adult overnight beds this winter, down from 876"** is the City's July 21 expectation "after all planned changes"; the page was updated August 24 and could change again with winter flex beds, which it says are a slight decrease, not counted in the 580.
7. **Data centers "5.6% of Oregon's electricity"** is a recital in the resolution, not a City measurement; attributed to the resolution in the text.
8. **Keller "$137.5 million state funding commitment"** is as the resolution describes it; the split ($85 million theater/academic, $52.5 million parking) is from the resolution's background and is not in the text.
