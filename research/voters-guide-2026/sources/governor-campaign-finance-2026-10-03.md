# Governor's race campaign finance: sources and findings (October 3, 2026)

Supports `/deep-dives/campaign-finance/governor` and the fundraising panels on the governor voter-guide pages. Method and rebuild steps are in `ingest/orestar/GOVERNOR.md`. Reviewed judgments are in `ingest/orestar/governor-review.json`.

## Records

- Ledger: active ORESTAR snapshot `orestar-20250101-20261004-de091bba2ee3`, January 1, 2025 through October 4, 2026, 321,089 transactions. Completeness not verified (manual exports). First built October 3 on the September 28 snapshot; rebuilt October 5 after the October 4 import and five reviewed amendments.
- Committees: Friends of Tina Kotek (ORESTAR 4792), Friends of Christine Drazan (ORESTAR 19050). Both confirmed against ORESTAR statements of organization retrieved September 27, 2026: candidate name, office of Governor, 2026 general election.
  - Kotek's committee has been registered for governor since September 2021.
  - Drazan's was registered for State Representative, 51st District, from March 2024 until it was amended to Governor on October 27, 2025.
- Brett Smith (Pacific Green nominee): no committee among filers with transactions. ORS 260.043 exempts a candidate who expects to raise and spend no more than $750 in a calendar year. https://oregon.public.law/statutes/ors_260.043
- Official account summaries, retrieved September 27, 2026 (already published in `public/data/campaign-finance/account-summaries.csv`):
  - Kotek: 2025 opening cash $891,062.45; 2026 opening $2,432,342.22; ending balance $8,376,671.93. Reconciles to the ledger exactly.
  - Drazan: 2025 opening cash $138,365.45; 2026 opening $982,810.75; ending balance $964,650.50. The 2026 summary shows $800 more in payments than the ledger; unresolved.

## Findings (all from the ledger, checked by tests)

| | Christine Drazan | Tina Kotek |
|---|---|---|
| Cash contributions | $11,990,998 in 5,744 records | $14,341,446 in 9,537 records |
| Named individuals | $5,964,287 (50%) | $3,315,436 (23%) |
| Businesses, direct | $3,707,122 (31%) | $1,308,600 (9%) |
| Unions and union committees (minimum) | $0 | $4,346,306 (30%) |
| National governors' groups | $0 | $3,250,000 (23%) |
| Business and trade committees (minimum) | $1,332,571 | $50,000 |
| Combined gifts of $100 or less | $328,773 | $683,528 |
| Sources giving $100,000 or more | 26 sources, 55% of cash | 20 sources, 60% of cash |
| Named money with an Oregon address | 94% | 55% |
| Cash payments in these records | $10,175,820 through 2026-10-01 | $5,314,939 through 2026-08-26 |
| Broadcast advertising | $5,781,541 | $2,316,402 |
| Cash on 2026-08-26 (our calculation) | $1,504,707 | $6,462,123 |
| Median days from payment to filing, since June | 1 | 30 |

- Largest sources. Kotek: Democratic Governors Association $2,000,000; Democratic Governors Victory Fund $1,250,000; Citizen Action for Political Education (33) $1,000,000; Oregon Nurses Political Action Committee (12986) $820,000; Building a Stronger Oregon (23285) $505,000; Local 48 Electricians PAC (4572) $500,000. Drazan: Don H Jones, Jr. $1,517,275; AGC Committee for Action (4) $703,500; K & E Excavating Inc. $400,000; Marta Von Borstel $400,000; Murphy Plywood $350,000.
- No contribution from the Republican Governors Association appears in Drazan's records in this period.
- Biggest weeks. Kotek: 2026-07-27 week, $2,208,033 (Democratic Governors Association $1,500,000). Drazan: 2026-08-31 week, $1,176,467 (AGC Committee for Action (4) $700,000). All three of Drazan's biggest weeks began on or after August 31.
- Under the 2027 rule's two-election total of $6,600: 86 individuals and 82 businesses gave Drazan more ($7,888,740 together); 77 individuals and 52 businesses gave Kotek more ($2,521,876 together).
- 14 sources gave to both. 11 gave more to Kotek, 1 gave more to Drazan, 2 gave the same to each.
- Committee funding one step up: union committees on Kotek's list are funded mostly by combined gifts of $100 or less (Citizen Action for Political Education $1,541,207 of $1,798,726). AGC Committee for Action received $1,004,436 of $1,006,786 from AGC Oregon-Columbia Chapter.
- Building a Stronger Oregon (23285) received $10,000,000 from the North Coast States Regional Council of Carpenters on September 16, 2026. It has given Kotek $505,000 in these records, most recently on 2026-09-28.
- One reviewed independent-expenditure allocation names a linked committee: Oregon Right to Life PAC, $2,500 in opposition to Kotek's committee, August 26, 2026 (transaction 5821511). The detail review covers 77 of 137 flagged records.

## The reporting-lag caveat

Kotek's committee had no payments on file dated after August 26 when the ledger was collected. Drazan's had payments through September 28. So the official balances on September 27 ($8.38 million and $965,000) compared a campaign whose September spending was filed with one whose was not. OPB reported after later filings that Kotek had $4.4 million on hand and Drazan roughly $1.6 million. The page leads with a same-date comparison (August 26) and says why.

## Outside sources

- Drazan enters the race, October 27, 2025: Oregon Capital Chronicle, https://oregoncapitalchronicle.com/2025/10/27/republican-christine-drazan-mounts-2026-bid-for-oregon-governor/ (the story also reports cash on hand then: Drazan more than $600,000, Kotek $1.5 million).
- Kotek announces, December 4, 2025: Oregon Capital Chronicle, https://oregoncapitalchronicle.com/2025/12/04/oregon-gov-tina-kotek-confirms-she-will-be-seeking-reelection-in-2026/
- Primary, May 19, 2026: Oregon Capital Chronicle, https://oregoncapitalchronicle.com/2026/05/19/oregon-2026-primary-governor-results/ (Drazan 41%, Ed Diehl 31%, Chris Dudley 16%; Kotek 84%).
- $10 million transfer and October 1 balances: OPB, Dirk VanderHart, "$10 million political check is not aimed at any particular Oregon race this year, union says," October 1, 2026, https://www.opb.org/article/2026/10/01/ten-million-dollar-political-check-oregon-election-carpenters-union/. Used: Ron Rowlett's statement on the money's purpose (quoted in part on the page), the governor's $4.4 million and Drazan's roughly $1.6 million on hand, $500,000 from Building a Stronger Oregon and $150,000 in January from the carpenters' union before it reorganized, and SEIU members' $1.35 million through two PACs.
- Earlier account of the same transfer and the September 28 balances ($8.3 million and $965,000, matching the official summaries): Oregon Journalism Project in Willamette Week, Nigel Jaquiss, September 29, 2026, https://www.wweek.com/news/city/2026/09/29/10-million-mystery-check-hangs-over-governors-race/
- Brett Smith, Pacific Green nominee: OPB, July 23, 2026, https://www.opb.org/article/2026/07/23/oregon-governor-race-third-party-candidate-brett-smith/
- Contribution limits: enrolled HB 4018 (2026), chapter 139, Oregon Laws 2026, effective April 9, 2026, https://olis.oregonlegislature.gov/liz/2026R1/Downloads/MeasureDocument/HB4018/Enrolled. For a state office such as governor: $3,300 per election from a person; $2,000 per election from another candidate's principal campaign committee; $5,000 per election cycle from a multicandidate committee; $30,000 per election from a party or caucus committee; eight times the person limit per election from a membership organization; $10 per contributor per election from a small donor committee. "Person" includes individuals, corporations, limited liability companies and labor organizations. The contribution limits become operative January 1, 2027 (chapter 9, Oregon Laws 2024, HB 4024). HB 4018 passed the House 39 to 19 and the Senate 20 to 9.
- Filing deadlines: ORS 260.057, https://oregon.public.law/statutes/ors_260.057. Thirty calendar days; seven calendar days during the 42 days before an election (from September 22, 2026); older unfiled transactions due by the 35th day before the election (September 29, 2026).
- Sponsor of Citizen Action for Political Education: SEIU Local 503, https://seiu503.org/get-involved/cape-and-political-action/
- Northwest Regional Organizing Coalition: Laborers' union regional body, https://www.idealist.org/en/nonprofit/4fc3d492da2e4c6b995a521cb4347702-liuna-nroc-seattle

## Decisions

- Candidates are listed alphabetically everywhere and never ranked by money.
- Colors encode the kind of source or the measure. They never encode a candidate or a party.
- Individual donors are named only where they are among a campaign's largest sources, as the council investigation does. Payments to individuals are totaled, not listed, on the page.
- The 2027-limits count covers individuals and businesses only. Committee limits depend on the kind of committee and are not estimated.
- No sector labels beyond the reviewed sponsor groups. No claim about why anyone gave.
- A complete, current ORESTAR export would bring in Kotek's September payments and should be followed by `npm run orestar:governor` and a reread of the page.

## Update, October 5, 2026

- The page now leads with two live charts (cash raised and cash paid out per candidate over time) and a block on money in, money out and where payments went. Those read the published ledger on each request; the chapters keep the edition's date.
- Payments by payee address in these records: Drazan 92% to other states, 7% to Oregon addresses; Kotek 79% to other states, 16% to Oregon addresses, 5% to other committees. The address is the payee's, and media buyers can spend the money in Oregon.
- Kotek's payments after August 26 are still missing. The October 4 download searched by transaction date from September 28, so payments dated August 27 to September 27 and filed after September 27 are not in it. The page says so in the spending chart, the spending chapter and the list of gaps.
