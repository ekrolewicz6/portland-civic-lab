# Homelessness dashboard: newest data for the stale tables

Research for refreshing the stale tables behind portlandciviclab.org/dashboard/homelessness, and for re-refreshing them on a schedule. Retrieved October 7, 2026, unless a row says otherwise. Quotes are verbatim from the URL in the same row and are under 15 words. Rows read from PDF tables quote the text that `pdftotext -layout` extracted (column spacing collapsed); rows read from images of spreadsheets say so. Nothing here is estimated. Sums that I computed are labeled "(sum)". Raw copies of every file are listed under "Archived files" at the end.

Short IDs used below:

- **HSD Q4 FY26**: Multnomah County, "Supportive Housing Services Quarterly Report," FY26 Q4 (April to June 2026), title "Q4 FY26 SHS Report FINAL (Updated 8.28.26)". https://hsd.multco.us/wp-content/uploads/2026/09/Q4-FY26-SHS-Report-FINAL-Updated-8.28.26.pdf
- **HSD Q4 FY25**: same series, FY25 Q4, with financials, updated March 23, 2026. https://hsd.multco.us/wp-content/uploads/2026/03/FINAL-Q4-FY25-SHS-Report-with-Financials-updated-3.23.36.pdf
- **HSD AR FY25**: Multnomah County, FY 2025 SHS Annual Report, updated December 11, 2025. https://hsd.multco.us/wp-content/uploads/2025/12/FINAL-SHS-Annual-Report-Updated-12.11.25.pdf
- **County release Nov 26, 2025**: "Counties report: Supportive Housing Services measure has now housed 15,724 people across Portland region." https://multco.us/news/counties-report-supportive-housing-services-measure-has-now-housed-15724-people-across
- **HRAP May 2026**: Homelessness Response System, "Preliminary Report - May 2026." https://multco.us/file/hrap_quarterly_report_may_2026/download
- **Metro FR FY26 Q4**: Metro, SHS financial report FY26 Q4, dated September 15, 2026. https://www.oregonmetro.gov/sites/default/files/2026-09/shs-financial-report-fy26-q4-through-june-2026.pdf
- **Metro AR FY25**: Metro, SHS regional annual report FY2024-25 (v2, March 25, 2026). https://www.oregonmetro.gov/sites/default/files/2026-03/supportive-housing-services-regional-annual-report-fy2024-2025-v2-03.25.26.pdf

---

## 1. shelter_capacity

**Database now:** 2024-Q1 to 2024-Q4, `total_beds` 1,703 / 1,992 / 2,133 / 2,068, `utilization_pct` ending 90.6, plus a `county_24hr_beds` / `city_overnight_beds` split (2024-Q4: 1,175 / 893), source "JOHS Shelter Capacity Report Q4 2024".

**Bottom line:** the county's Quarterly Data Dashboard has not changed since it was published on April 16, 2025. It still ends at FY2024 Q4 (April to June 2024). There are no newer quarters there to scrape. Three problems with the existing rows:

1. **The quarters are mislabeled.** The dashboard labels the capacity points "Q1 2024 (FY)" to "Q4 2024 (FY)". The county's fiscal year runs July to June, so 1,703 / 1,992 / 2,133 / 2,068 describe July 2023 to June 2024, not calendar 2024. (The scraper's own code maps them to calendar quarters 2023-Q3 to 2024-Q2; the seed file labels them 2024-Q1 to 2024-Q4.)
2. **They are not "beds" in the sense of all shelter.** The chart is "Average HSD-funded shelter capacity" and counts only county-funded shelters.
3. **The 24-hour / overnight split has no source I could find.** The dashboard has no such split, and I found no document titled "Shelter Capacity Report" from JOHS or HSD. Treat `county_24hr_beds` and `city_overnight_beds` as unverified.

### Figures

| Figure | Value | Period | Definition | URL | Retrieved | Quote |
|---|---|---|---|---|---|---|
| Average HSD-funded shelter capacity, newest point | 2,068 | FY2024 Q4 (Apr to Jun 2024) | Average capacity, county-funded shelters only | https://hsd.multco.us/quarterly-data-dashboard/ (Chart.js `chart-1324`) | 2026-10-07 | "Average shelter capacity (only includes shelters in Multnomah County that receive funding" |
| Same chart, full series | 995, 1,155, 1,133, 1,356, 1,391, 1,375, 1,480, 1,587, 1,703, 1,992, 2,133, 2,068 | FY2022 Q1 to FY2024 Q4 | As above. The fifth label is a county typo ("Q1 2022 (FY)" appears twice; it should read Q1 2023) | Same | 2026-10-07 | `"Q1 2024 (FY)","Q2 2024 (FY)","Q3 2024 (FY)","Q4 2024 (FY)"` |
| Shelter utilization | 90.5, 92.1, 92.6, 90.6 (%) | Labeled "2024 Q1" to "2024 Q4"; the page does not say calendar or fiscal | Share of available beds occupied on a given night, HSD-supported short-term shelters | Same (`chart-1370`) | 2026-10-07 | "percent of available shelter beds that are occupied on any given night" |
| Page last modified | 2025-04-16 08:36 (created and modified the same minute) | n/a | WordPress page record | https://hsd.multco.us/wp-json/wp/v2/pages?slug=quarterly-data-dashboard&_fields=id,date,modified,link | 2026-10-07 | `"modified":"2025-04-16T08:36:18"` |
| SHS-funded shelter units, FY26 to date | 145 new / 1,680 sustained | FY26 (Jul 2025 to Jun 2026), year to date at Q4 | Units fully or partly funded by SHS only; preliminary | HSD Q4 FY26, p. 1 | 2026-10-07 | "145 new / 1,680 sustained" |
| Note on the SHS unit figure | Not all shelter | n/a | | HSD Q4 FY26, p. 1, footnote 3 | 2026-10-07 | "are not representative of the entire shelter units available in Multnomah County" |
| SHS-funded shelter units, earlier FY26 quarters | Q1: 0 new / 905 sustained; Q2: 0 new / 1,044 sustained; Q3: 124 new / 1,380 sustained | FY26 year to date at each quarter | As above | Q1: https://hsd.multco.us/wp-content/uploads/2026/03/FINAL-Q1-FY26-SHS-Report-Updated-3.23.26.pdf ; Q2: https://hsd.multco.us/wp-content/uploads/2026/04/Q2-FY26-SHS-Report-FINAL-Updated-4.3.26.pdf ; Q3: https://hsd.multco.us/wp-content/uploads/2026/05/Multnomah-County-Q3-FY26-SHS-Report-FINAL.pdf | 2026-10-07 | Q3 row: "124 new / 1,380 sustained" |
| SHS-funded shelter units, FY25 final | 1,876 (270 new / 1,606 sustained) | FY25 (Jul 2024 to Jun 2025) | Units created or sustained with SHS funds, year total | HSD AR FY25, p. 23 (Figure 3a) | 2026-10-07 | "beds/units created or sustained with SHS funds" ... "1,876" |
| People in SHS-funded shelter | 4,454 people (3,736 households) | FY26 to date at Q4 | SHS-funded shelter only | HSD Q4 FY26, p. 22 | 2026-10-07 | "Total People 942 4,454" (942 = Q4 alone) |
| County plus City shelter, all funding | "more than 3,600 total shelter units" | FY25 | Units funded by the County and/or the City of Portland | HSD AR FY25, p. 14 | 2026-10-07 | "more than 3,600 total shelter units in our community" |
| 24/7 shelter beds, County plus City | "nearly 3,000" | As of January 12, 2026 | 24/7 beds currently open | https://multco.us/news/news-release-new-report-suggests-change-shelter-investments-could-help-more-people-leave | 2026-10-07 | "nearly 3,000 24/ 7 shelter beds currently open" |
| County-funded shelter after FY27 cuts (version 1) | 1,742 units | FY2027 (from Jul 2026), after closures | County-funded units; closes 605 adult units and 90 family vouchers | https://hsd.multco.us/2026/05/06/shelter-updates/ (posted May 6, 2026; updated Sept 1, 2026) | 2026-10-07 | "still leave 1,742 County-funded shelter units overall" |
| County-funded shelter after FY27 cuts (version 2) | 1,667 beds | Same | "funded shelter beds" | https://mailchi.mp/multco/hsd-monthly-july-2026 (HSD newsletter, July 2026) | 2026-10-07 | "the County will maintain 1,667 funded shelter beds overall" |
| Closure size | 605 adult units, 90 family vouchers | FY2027 | | https://hsd.multco.us/2026/05/06/shelter-updates/ | 2026-10-07 | "phased closure of 605 adult shelter units and 90 scattered-site shelter vouchers" |
| SHS ramp-down | 522 shelter units | FY27 | SHS-funded subset | HSD Q4 FY26, p. 9 | 2026-10-07 | "HSD made the difficult decision to ramp down 522 shelter units in FY27" |
| City overnight shelter, Oct to Dec 2025 | 976 beds plus 590 "flex up" beds | FY26 Q2 | City of Portland Overnight Shelter program | https://multco.us/file/hrap_quarterly_report_february_2026/download (City letter, p. 38; the letter's heading says "Second Quarter of 2026-27", which looks like a typo for 2025-26 since it covers July to December 2025) | 2026-10-07 | "reached full capacity with 976 open and available beds" |
| City overnight shelter, winter 2026-27 (planned) | 580 regular adult beds (vs. 876 the prior year) | Winter 2026-27 | Regular adult overnight beds, excludes flex | https://www.portland.gov/shelter-services/news/2026/7/21/changes-city-shelter-services (published July 21, 2026; updated Aug 24, 2026) | 2026-10-07 | "580 regular, adult overnight emergency shelter beds available this winter" |
| City 24/7 and alternative shelter (planned) | 718-person capacity (vs. 867 in 2025-26) | FY2026-27 | People, not beds | Same | 2026-10-07 | "capacity for 718 people across its 24/7 and alternative shelter sites" |

Beds or units: the county's newer sources count **units** (SHS reports, the May 2026 closure post) or mix "beds/units" (the FY25 annual report, the Adult Shelter Review). The county's monthly Shelter Utilization Report explains that it measures households against units and that one bed equals one unit in a congregate shelter (https://public.tableau.com/static/images/Sh/ShelterUtilizationReport/Report/1.png: "One bed is equivalent to one unit in a congregate shelter."). The two FY27 figures above (1,742 units, 1,667 beds) come from the same department two months apart and do not match; I could not find which is current.

### How this source publishes

- **Quarterly Data Dashboard** (https://hsd.multco.us/quarterly-data-dashboard/): static WordPress page with inline Chart.js configs (`window.johs.charts.push`). Plain curl with a browser user agent returns 200. It has not been updated since April 2025, so a scheduled fetch will keep returning FY2024 data. If it is ever updated, check: chart IDs are post IDs that change on edit (`chart-1324` for capacity is declared through a `const config` variable, not inline, so the scraper's inline regex misses it); labels use fiscal quarters; and the scraper's hard-coded quarter list will mislabel anything new. Use `https://hsd.multco.us/wp-json/wp/v2/pages?slug=quarterly-data-dashboard&_fields=modified` as a cheap change check.
- **Shelter Utilization Report** (monthly, Tableau Public, https://public.tableau.com/app/profile/hsd/viz/ShelterUtilizationReport/Report): last republished 2026-08-18 20:20 UTC (`"lastPublishDate":1787084406215` at https://public.tableau.com/profile/api/single_workbook/ShelterUtilizationReport). Data download is disabled (`"allowDataAccess":false`), and the static image URL only serves the "About" tab. It excludes domestic violence shelters, voucher programs and shelters not in HMIS. Not machine-readable without a browser; I did not try to work around that.
- **SHS quarterly reports** (https://hsd.multco.us/reports/): PDFs, due 45 days after each quarter (Nov 15, Feb 15, May 15, Aug 15), often posted later and re-posted with "Updated" dates. File names are not predictable (for example `Q4-FY26-SHS-Report-FINAL-Updated-8.28.26.pdf`; two links on the page end in a stray space). Scrape the reports page for links; do not build URLs. Shelter units are in the first-page grid and are year-to-date SHS-funded units, which is a different measure from the old dashboard's average capacity.
- **City of Portland**: the July 21, 2026 shelter-changes article and the City's letter inside each HRAP quarterly report. The City's own dashboards (https://www.portland.gov/shelter-services/shelter-services-data-dashboards, "updated 12.22.2025") are Smartsheet and ArcGIS pages covering data only through October 2025 (overnight) and September 2025 (alternative).

### Could not find

- Any county quarterly capacity series after FY2024 Q4 on the same definition (average HSD-funded capacity).
- The "JOHS Shelter Capacity Report" named as the database source, or any county source for the 24-hour vs. overnight split.
- Machine-readable data from the Shelter Utilization Report (data access disabled; sheet names not exposed).
- Which of 1,742 units (May 2026) or 1,667 beds (July 2026) is the county's current figure.

---

## 2. housing_placements

**Database now:** FY2022 to FY2025. FY2025: 6,160 total, 2,599 SHS, 244 PSH, 17,589 evictions prevented, labeled "partial year".

**Bottom line:** FY2025 is final and is a full year, not partial. The county release covers July 1, 2024 to June 30, 2025. Two fixes to the FY2025 row: `psh_placements` = 244 is the number of **new PSH units opened**, not people placed (SHS placed 1,085 people into PSH), and the label "partial year" should go. FY2026 systemwide placements are **not published yet**; the county says its FY26 annual SHS report comes in November 2026. Only preliminary SHS-funded FY26 figures exist.

### Figures

| Figure | Value | Period | Definition | URL | Retrieved | Quote |
|---|---|---|---|---|---|---|
| Systemwide placements, FY25 | 6,160 people | Jul 1, 2024 to Jun 30, 2025 | Multnomah homeless services system, SHS plus other funding | County release Nov 26, 2025 | 2026-10-07 | "6,160 people left homelessness for housing — a 12% increase" |
| Systemwide placements, FY24 (check) | 5,477 people | FY24 | Same | Same | 2026-10-07 | "a 12% increase over last year’s 5,477 people" |
| Period of the systemwide figures | Full fiscal year | Jul 1, 2024 to Jun 30, 2025 | | Same | 2026-10-07 | "Outcomes from July 1, 2024, to June 30, 2025" |
| Systemwide prevention, FY25 | 17,589 people | FY25 | Eviction prevention, all funding | Same | 2026-10-07 | "17,589 people avoided homelessness in the first place with eviction prevention" |
| Systemwide, sustained in housing | 8,800 people | FY25 | Housed in earlier years, still in a housing program | Same | 2026-10-07 | "8,800 people who had left homelessness for housing in previous years" |
| Systemwide shelter stays | 10,208 people (FY24: 9,101) | FY25 | Stayed in County- or City-funded shelter | Same | 2026-10-07 | "10,208 people stayed in a County- or City-funded shelter" |
| SHS placements, FY25 final | 2,599 people (1,613 households) | FY25 | SHS-funded PSH, RRH, housing with services, housing only; unduplicated | HSD AR FY25, p. 19 | 2026-10-07 | "house a total of 2,599 people (1,613 households)" |
| SHS PSH placements, FY25 | 1,085 people (715 households) | FY25 | SHS-funded permanent supportive housing | HSD AR FY25, p. 21 (Figure 2) | 2026-10-07 | "# of people placed in PSH in Year Four 1,085" |
| SHS RRH placements, FY25 | 1,420 people (842 households) | FY25 | SHS-funded rapid rehousing | Same | 2026-10-07 | "# of people placed in RRH in Year Four 1,420" |
| SHS housing with services / housing only, FY25 | 127 / 110 people | FY25 | | Same | 2026-10-07 | "# of people placed in Housing with Services 127" |
| SHS prevention, FY25 | 2,416 people (1,099 households) | FY25 | SHS-funded only (the 17,589 above is systemwide) | Same | 2026-10-07 | "# of people served with prevention services 2,416" |
| New PSH units opened, FY25 (what the DB's 244 actually is) | 244 units | FY25 | Units, not placements | HSD AR FY25, p. 14 | 2026-10-07 | "we opened 244 new units of permanent supportive housing" |
| Cumulative PSH units added since July 2021 | 1,541 units | Jul 2021 to Jun 2025 | Multnomah, SHS-funded | Same | 2026-10-07 | "1,541 new and fully operational supportive housing units" |
| SHS placements, FY26 preliminary | 1,390 people (914 households) | FY26 (Jul 2025 to Jun 2026) | SHS-funded, unduplicated, newly housed; preliminary, "subject to change" | HSD Q4 FY26, p. 3 | 2026-10-07 | "ending the year with 1,390 people and 914 households (unduplicated)" |
| SHS PSH / RRH, FY26 preliminary | PSH 439 people (383 households); RRH 938 people (512 households) | FY26 | Newly served | HSD Q4 FY26, p. 4 | 2026-10-07 | "Permanent Supportive Housing 439 people 248 people /" (row text) |
| SHS housing with services / housing only, FY26 preliminary | 72 people (42 households) / 29 people (17 households) | FY26 | | Same | 2026-10-07 | "Housing With Services 72 people 34 people/" (row text) |
| SHS prevention, FY26 preliminary | 1,806 people (1,217 households) | FY26 | SHS-funded only | Same | 2026-10-07 | "Homeless Prevention 1,806 people 700 people/" (row text) |
| FY26 numbers are preliminary | | | | HSD Q4 FY26, p. 4 | 2026-10-07 | "subject to change in the SHS annual report as SHS spending data is finalized" |
| When final FY26 numbers come | November 2026 | | | HSD Q4 FY26, p. 4, footnote 4 | 2026-10-07 | "FY26 Annual SHS Report to be published in November 2026" |
| Systemwide monthly outflow to housing (context) | "more than 400" a month; 9,425 people in housing programs (March 2026) | 2024 to Mar 2026 | By-name list outflow to permanent housing | HRAP May 2026, p. 15; https://hsd.multco.us/wp-content/uploads/2026/06/Homeless-Response-System-KPI.HSD-Provider-Conference.6.2026.pdf, slide 17 | 2026-10-07 | "more than 400 people leave homelessness to permanent housing each month" |

Caution on comparing FY25 and FY26 SHS numbers: the FY25 Q4 report showed 898 PSH and 923 RRH people placed (HSD Q4 FY25, p. 1: "898 people placed"), and the FY25 annual report raised these to 1,085 and 1,420 after a data-mart attribution change. FY26's Q4 figures will likely move too. Compare FY26 only after the annual report.

Database checks: FY2022 4,406, FY2023 4,266 and FY2024 5,477 match the county Quarterly Data Dashboard's "New Housing Placements" chart (`"data":["4406","4266","5477"]`). FY2024 `shs_placements` 2,322 matches that page's "SHS Housing Placement" chart, cumulative Q4 FY2024 (`"data":["253","537","1075","2322"]`). FY2024 `rapid_rehousing` 2,890 could not be traced to a source.

### How this source publishes

- **Systemwide annual outcomes**: once a year, in a multco.us news release that accompanies the SHS annual reports (last one November 26, 2025). No fixed URL; the slug is the headline. Not machine-readable. The HSD data dashboard (Tableau) also carried monthly placements but is offline (item 8).
- **SHS annual report**: PDF on https://hsd.multco.us/reports/, about November each year, often re-posted with corrections (FY25 version "Updated 12.11.25"). Tables extract cleanly with `pdftotext -layout`.
- **SHS quarterly reports**: same page; first-page grid and the "Annual Work Plan" table. Year-to-date, preliminary, and revised in later reports.
- **HRAP quarterly reports** (https://multco.us/info/reports-data-and-documents): systemwide monthly inflow and outflow in prose, PDF. File URLs follow `https://multco.us/file/hrap_quarterly_report_<month>_<year>/download` but one older file has a `-0` suffix; scrape the page.
- multco.us and hsd.multco.us returned 200 to curl with a browser user agent on October 7, 2026.

### Could not find

- FY2026 systemwide placements, prevention or shelter totals (not yet published).
- A source for FY2024 `rapid_rehousing` = 2,890.
- Program-level FY26 estimates exist in the county's FY2027 budget program offers, but they are estimates for single programs, not a systemwide total, so I did not use them.

---

## 3. shs_funding

**Database now:** 2021 to 2025, "tax_revenue" and "spending", 2025 revenue missing. Source "SHS Annual Report / Metro".

**Bottom line (from Metro's own reports, checked against the PDFs):**

- The **spending** rows are **regional** (all three counties) and correct, with the year label meaning the fiscal year that ends that June: 2022 = $55.9M, 2023 = $149.1M, 2024 = $294.1M, 2025 = $424.9M.
- The **revenue** rows do not match Metro's collections. "2021 $240M" is Year 1 (April 2021 to June 2022), which belongs on the 2022 row. $337M, $357M and $255M for 2022 to 2024 are not collections figures in any Metro report I checked ($357M matches Metro's fall 2023 *forecast* for FY24).
- The 2025 row mixes scopes: $424.9M spending is regional, but `psh_units_added` 244 and `psh_units_cumulative` 1,541 are Multnomah-only.
- FY25 regional gross collections: **$324,964,017**. FY26: **$357.3M** (unaudited; includes about $36M of one-time late payments).
- FY26 regional county spending: **$339.4M**, preliminary.

### Figures: regional (all three counties)

| Figure | Value | Period | Definition | URL | Retrieved | Quote |
|---|---|---|---|---|---|---|
| Gross collections | $324,964,017 | FY25 (Jul 2024 to Jun 2025) | Personal plus business income tax collected | Metro AR FY25, Exhibit F | 2026-10-07 | "FY 2024-25 Actual Collections $324,964,017" |
| Net tax revenue | $315,080,384 | FY25 | After collection costs | Same | 2026-10-07 | "Net Tax Revenue 312,006,266 315,080,384 87%" |
| Paid to the three counties | $299,326,365 | FY25 | After Metro's admin share | Same | 2026-10-07 | "County Partner Revenue 296,405,953 299,326,365 101%" |
| Gross collections | $357.3M | FY26 (Jul 2025 to Jun 2026) | Unaudited | https://www.oregonmetro.gov/sites/default/files/2026-09/fy-2025-26-shs-year-end-report_0.pdf | 2026-10-07 | "FY25-26 Actual Collections $357,300,000" |
| One-time late payments in FY26 | $36.0M (adjusted FY26: $321.3M) | FY26 | | Same | 2026-10-07 | "One-time late payments $36,000,000" |
| Tax revenue incl. interest | $358,351,564 | FY26 | Collections plus interest | Metro FR FY26 Q4 | 2026-10-07 | "Tax Revenue 328,800,000 358,351,564 109%" |
| Net tax revenue | $347,057,987 | FY26 | After collection costs | Same | 2026-10-07 | "Net Tax Revenue 317,369,858 347,057,987 109%" |
| Paid to the three counties | $329,705,088 | FY26 | | Same | 2026-10-07 | "County Partner Revenue 301,501,365 329,705,088 109%" |
| County program spending | $424.9M (Clackamas $73.5M, Multnomah $218.9M, Washington $132.5M) | FY25 | After year-end close | Metro AR FY25, p. 70 | 2026-10-07 | "Program costs $73.5 $218.9 $132.5 $424.9" |
| County program spending | $339.4M (Clackamas $66.9M, Multnomah $168.7M, Washington $103.8M) | FY26 | Preliminary, from the counties' Q4 reports | Metro FR FY26 Q4 | 2026-10-07 | "Program Costs $66.9 $168.7 $103.8 $339.4" |
| Earlier spending (checks DB rows) | $55.9M / $149.1M / $294.1M | FY22 / FY23 / FY24 | County program spending | https://www.oregonmetro.gov/sites/default/files/2025-10/supportive-housing-services-regional-annual-report-fy2024-20250211.pdf | 2026-10-07 | "Year three $54.4 $143.5 $96.2 $294.1" |
| Earlier gross collections (to replace DB revenue rows) | FY22 $242.7M; FY23 $347.0M; FY24 $335.1M | FY22 to FY24 | FY22 and FY23 are sums of audited personal plus business tax actuals in Metro's adopted budgets (sum); FY24 from the annual report | FY24: Metro FY24 annual report (URL in the row above). FY22, FY23: https://www.oregonmetro.gov/sites/default/files/2025-11/fy-2024-25-adopted-budget-20241021.pdf | 2026-10-07 | FY24: "FY 2023-24 Actual Collections $335,136,020" |
| Year 1 collections (the DB's "2021") | "nearly $240M" | Apr 2021 to Jun 2022 | Cash basis | https://www.oregonmetro.gov/sites/default/files/2025-10/supportive-housing-services-regional-annual-report-fy2022-20220616.pdf, p. 23 | 2026-10-07 | "nearly $240M in" (sentence continues "revenue collected through June 30, 2022") |
| Latest forecast | FY26 $351.1M; FY27 $344.5M | Fall 2025 forecast | Gross forecast collections | https://www.oregonmetro.gov/sites/default/files/2026-01/supportive-housing-services-revenue-forecast-fall-2025.pdf, Figure 1 | 2026-10-07 | "Forecasted Tax Revenue $351.1 $344.5 $343.5 $367.4 $397.8" |

### Figures: Multnomah County only

| Figure | Value | Period | Definition | URL | Retrieved | Quote |
|---|---|---|---|---|---|---|
| Metro payment to Multnomah | $135,694,619 | FY25 | Metro's table; matches the county's own report | Metro AR FY25, Exhibit F | 2026-10-07 | "Multnomah County 134,370,699 135,694,619 101%" |
| Multnomah SHS spending | $218,913,601 | FY25 | "Subtotal Program Costs", final | HSD Q4 FY25, p. 27 (spreadsheet image, read visually) | 2026-10-07 | "Subtotal Program Costs ... 218,913,601" |
| Same, by population | $151,678,995 Population A + $67,234,606 Population B | FY25 | Sum is $218,913,601 (sum) | HSD AR FY25, p. 144 | 2026-10-07 | "HSD spent $151,678,995 (69%) on services for Population A" |
| Metro payment to Multnomah | $149,466,306 | FY26 | Metro's table | Metro FR FY26 Q4 | 2026-10-07 | "Multnomah County 136,680,619 149,466,306 109%" |
| Revenue as the county books it | $149,678,873 | FY26 | Timing differs from Metro's figure | Metro FR FY26 Q4; HSD Q4 FY26, p. 28 | 2026-10-07 | "SHS Program Revenue 136,584,365 149,678,873 110%" |
| Multnomah SHS spending | $168,721,926 | FY26 | Expense and contingency; preliminary | Metro FR FY26 Q4 | 2026-10-07 | "Expense & Contingency 195,385,814 168,721,926 86%" |
| Ending balance | $45,906,041 | End of FY26 | Includes $4.2M reserves | Same | 2026-10-07 | "ending balance of $45.9 million for next fiscal year" |
| Forecast payment to Multnomah | $145.9M (FY26), $143.0M (FY27) | Fall 2025 forecast | | Fall 2025 forecast, Figure 1 | 2026-10-07 | "Multnomah $145.9 $143.0 $142.4 $152.2 $165.5" (row text) |

Related table not in this request: `shs_by_county` gives Multnomah's FY2025 "allocation" as $145.9M. That is Metro's fall 2025 forecast for FY26. Metro actually paid Multnomah $135.7M in FY25.

### How this source publishes

- **Metro pages to scrape for links**: `https://www.oregonmetro.gov/what-metro-does/housing-and-homelessness/supportive-housing-services/funding` (financial reports, forecasts, year-end revenue memo) and `.../progress` (annual reports). PDFs sit under `/sites/default/files/YYYY-MM/<slug>.pdf`, where the folder is the upload month, not the period covered. File names are inconsistent (`_0`, `v2-03.25.26`, `11-...`), so do not build URLs.
- **Cadence**: quarterly financial reports (Q4 in mid-September, Q2 in mid-March); a year-end revenue memo in September; a revenue forecast in November or December; the regional annual report in February or March of the following year.
- **Machine-readable option**: Metro's collections dashboard on Infogram (https://infogram.com/shs-revenue-collection-1h7v4pdwgv3e84k, linked from the FY26 Q4 report) embeds monthly collections as JSON in the page (`window.infographicData`). It restates fiscal years as August to July, so its totals differ from the reports. Use the reports for annual figures.
- Plain curl returned 200 for Metro pages and PDFs, with no bot check.
- **Multnomah's own figures**: the financial tables in the county's quarterly SHS reports are images of a spreadsheet (pages 26 to 31). They cannot be extracted as text, so take Multnomah figures from Metro's reports, which print them as text.

### Could not find

- Audited FY26 spending (expected in Metro's FY26 regional annual report, about February to March 2027; counties' final reports were due October 31).
- A spring 2026 forecast update. The fall 2026 forecast is expected in November 2026.
- Any Metro collections figure equal to the database's $337M (2022) or $255M (2024). Metro's FY25 Q4 financial report (https://www.oregonmetro.gov/sites/default/files/2026-02/shs-financial-report-fy25-q4-through-june-2025-final.pdf) puts the three counties' combined ending balance at $255.0M ("Ending Balance (incl. Reserves) $94.9 $63.0 $97.1 $255.0"); that may be where the database's $255M came from, but it is a fund balance, not revenue. The FY25 annual report later revised it to $262.1M.

---

## 4. overdose_deaths (Domicile Unknown)

**Database now:** through 2024 (2024: 372 deaths, 214 overdose, 183 fentanyl; county-wide comparison 379).

**Bottom line:** the report on **2025 deaths is not published**. The county's page still lists "Analyzing Deaths in 2024" as the newest edition. The 2024 and 2023 rows in the database match the source PDFs. The last three editions came out in December of the following year (2024 deaths: December 19, 2025), so the 2025 report would likely appear around December 2026. That timing is an inference; the county has not announced a date.

### Figures

| Figure | Value | Period | Definition | URL | Retrieved | Quote |
|---|---|---|---|---|---|---|
| Newest edition listed | Deaths in 2024 | As of Oct 7, 2026 | Landing page lists 2019, 2020, 2021, 2023, 2024 by title, plus older and 2022 links; no 2025 | https://multco.us/info/domicile-unknown | 2026-10-07 | "Domicile Unknown Report: Analyzing Deaths in 2024" |
| Release of the 2024 report | Dec 19, 2025 | | County news release | https://multco.us/news/multnomah-county-releases-domicile-unknown-report-homeless-deaths-occurring-2024 | 2026-10-07 | "Multnomah County releases Domicile Unknown report of homeless deaths occurring in 2024" |
| Deaths of people experiencing homelessness | 372 (321 Medical Examiner + 51 Vital Records) | Calendar 2024 | Two sources combined | https://multco.us/file/domicile_unknown_report:_analyzing_deaths_in_2024/download | 2026-10-07 | "In 2024, 372 deaths (51 from Vital Records and 321 from Medical Examiner)" |
| Overdose deaths | 214 | 2024 | Medical Examiner cases only; underlying cause X40-44, Y10-14 (accidental and undetermined intent) | Same | 2026-10-07 | "due to drug overdose (N=214)" |
| Involving fentanyl | 183 (86% of overdoses) | 2024 | Overdose plus multiple-cause code T40.4 | Same, Table 2 | 2026-10-07 | "Synthetic opioids (mainly fentanyl) 183 86%" |
| Involving methamphetamine | 175 (82%) | 2024 | Overdose plus T43.6 | Same, Table 2 | 2026-10-07 | "Psychostimulants (mainly meth) 175 82%" |
| County-wide synthetic-opioid deaths (the DB's 379) | 379 (2023: 483) | 2024 | All county residents; CDC WONDER provisional | Same, Discussion | 2026-10-07 | "declined 21%, from 483 in 2023 to 379 deaths in 2024" |
| County-wide confirmed overdose deaths | 634 | 2024 | All county residents | 2024 news release (URL above) | 2026-10-07 | "compared with 634 overall confirmed deaths in 2024" |
| 2023 check | 456 deaths; 282 overdose; 251 fentanyl | 2023 | Same definitions | https://multco.us/file/domicile_unknown_report:_analyzing_deaths_in_2023/download | 2026-10-07 | "There were 282 total deaths due to unintentional drug overdose." |
| Hint about 2025 (no count) | Fentanyl deaths fell in 2025 (county-wide, preliminary) | 2025 | Health officer statement; not homeless-specific | 2024 news release (URL above), quoting the county health officer | 2026-10-07 | "fentanyl overdose deaths have continued to decrease in 2025" |

Who is counted: the report uses the SB 850 / HUD definition of homelessness ("an individual who lacks a fixed, regular and adequate nighttime residence"). Medical Examiner cases are flagged as "domicile unknown" or homeless, or had a transient or missing address, or died in a shelter, and are then reviewed by hand. Vital Records cases are deaths in the county with residence "Domicile Unknown" that were certified by a clinician (ME-certified deaths are excluded there to avoid double counting). Note that the overdose and fentanyl counts come from Medical Examiner cases only, while the 372 total includes Vital Records deaths.

The 2024 and 2023 rows were gathered by a research sub-agent; I re-opened the landing page today and checked the 2024 figures against the extracted PDF text.

### How this source publishes

- One PDF a year, no data table and no interactive version. Recent editions: 2022 deaths (dated December 2023), 2023 deaths (December 2024), 2024 deaths (December 2025, released Dec 19, 2025).
- File URLs are `https://multco.us/file/<slug>/download`, with slugs built from titles and not predictable (colons in every slug, a "2019_" prefix on the 2018 report, a trailing underscore on 2016). Scrape the landing page for a link whose text contains "Analyzing Deaths in <YEAR>".
- The landing page's "Last reviewed November 21, 2024" line is stale and should not be used as a change signal. HTTP Last-Modified on the PDFs reflects upload time. Store a hash of each PDF; the 2024 file on the site was created three days after the release, so it may have been revised.
- multco.us returned 200 to curl on October 7.
- The county's weekly overdose dashboard (linked from https://multco.us/info/death-data) covers all Medical Examiner deaths but has no housing-status filter, so it cannot stand in for this report.

### Could not find

- A 2025-deaths report, a preliminary 2025 count of deaths among people experiencing homelessness, or news coverage of one. (A December 2025 podcast titled "Multnomah County's 2025 Domicile Unknown Report" is about the 2024-deaths edition.)
- Any announced publication date.

---

## 5. eviction_filings (Evicted in Oregon)

**Database now:** monthly filings March 2025 to February 2026 from Datawrapper chart `0Ofed`, version 22.

**Bottom line:** the newest version is **34**, "Updated on September 15, 2026," covering **September 2025 to August 2026**. Multnomah filed 1,048 eviction cases in August 2026 and 12,286 over the twelve months. Months March 2026 to August 2026 are new to the database. April 2026 was revised from 955 (version 24) to 966 (version 26 onward), so a refresh must re-write the trailing months, not only append.

### Figures (version 34)

| Month | Multnomah | Washington | Oregon (statewide) |
|---|---|---|---|
| Sep 2025 | 999 | 421 | 2,455 |
| Oct 2025 | 1,152 | 440 | 2,660 |
| Nov 2025 | 786 | 327 | 1,884 |
| Dec 2025 | 1,131 | 421 | 2,574 |
| Jan 2026 | 1,132 | 488 | 2,750 |
| Feb 2026 | 916 | 392 | 2,241 |
| Mar 2026 | 1,118 | 340 | 2,468 |
| Apr 2026 | 966 | 340 | 2,319 |
| May 2026 | 951 | 315 | 2,280 |
| Jun 2026 | 979 | 395 | 2,519 |
| Jul 2026 | 1,108 | 377 | 2,630 |
| Aug 2026 | 1,048 | 402 | 2,446 |
| Total (CSV "Total" column) | 12,286 | 4,658 | 29,226 |

Source for every cell: https://datawrapper.dwcdn.net/0Ofed/34/dataset.csv, retrieved 2026-10-07. Definition: eviction (FED) cases filed in Oregon circuit courts, by county and month filed. The September 2025 to February 2026 values match the database rows exactly.

| Item | Value | URL | Retrieved | Quote |
|---|---|---|---|---|
| Newest version | 34 | https://datawrapper.dwcdn.net/0Ofed/ (redirects to `/0Ofed/34/`); versions 35 to 45 return 404 | 2026-10-07 | `url=https://datawrapper.dwcdn.net/0Ofed/34/` |
| Period covered | Sep 2025 to Aug 2026 | https://datawrapper.dwcdn.net/0Ofed/34/ (chart intro) | 2026-10-07 | "Includes cases that were filed between September 2025 and August 2026" |
| Update date | Sept 15, 2026 | Same (chart notes); chart metadata `lastModifiedAt` 2026-09-16T10:21:26Z, `publicVersion` 34 | 2026-10-07 | "Updated on September 15, 2026." |
| Chart title | | Same | 2026-10-07 | "Eviction cases filed in Oregon in the past twelve months" |
| Source line | Oregon Judicial Department | Same | 2026-10-07 | "Oregon Judicial Department's court records" |
| Coverage | Circuit courts only (about 90% of cases); justice courts excluded | https://www.evictedinoregon.com/data-tables | 2026-10-07 | "this data only includes data on eviction cases filed at a circuit court" |
| Calendar-2025 chart (stable full year) | Multnomah 12,094 total; Jan 1,093, Feb 922 (Mar to Dec equal the database) | https://datawrapper.dwcdn.net/vlDrt/2/dataset.csv (chart "Eviction cases filed in Oregon in 2025", "Updated on February 15, 2026.") | 2026-10-07 | header `Total Jan Feb ... Dec`; row `Multnomah 12094 1093 922 896 ...` |
| Annual filing rate | Multnomah 7 per 100 rental units in 2025 (2024: 7; 2023: 5) | https://datawrapper.dwcdn.net/cbJjQ/2/dataset.csv (chart "Annual rate of eviction cases filed per 100 rental units in Oregon") | 2026-10-07 | row `Multnomah 1 1 4 5 7 7` under header `2020 ... 2025` |
| Default judgments | Multnomah 999 (8%) of 12,640 cases with a first appearance, Sep 2025 to Aug 2026 | https://datawrapper.dwcdn.net/lyn6N/18/dataset.csv | 2026-10-07 | row `Multnomah 12640 8% 999` |
| Stipulated agreements | Multnomah 2,857 (23%) of 12,640, Sep 2025 to Aug 2026 | https://datawrapper.dwcdn.net/YTFNI/19/dataset.csv | 2026-10-07 | row `Multnomah 12640 23% 2857` |

The database's `filing_rate_per_100` = 7.0 on every Multnomah month is the **annual** 2025 rate from `cbJjQ`, repeated monthly. It is not a monthly rate.

### Exact CSV header (for date mapping)

Version 34's first line, tab-separated, first cell empty:

```
\tTotal\tSep\tOct\tNov\tDec\tJan\tFeb\tMar\tApr\tMay\tJun\tJul\tAug
```

Months are three-letter English abbreviations with **no year**. The year exists only in the chart's HTML (the intro sentence "Includes cases that were filed between September 2025 and August 2026"). The window rolls monthly, so the first month changes with each update (version 22 started at `Mar`, 23 at `Apr`, 24 and 25 at `May`, 26 to 28 at `Jun`, 29 to 31 at `Jul`, 32 and 33 at `Aug`, 34 at `Sep`). The current scraper's fixed `Mar → 2025-03-01 … Feb → 2026-02-01` map is wrong for every version after 22.

Safe mapping rule for a script: read the start and end month-year from the intro sentence with a regex like `filed between (\w+) (\d{4}) and (\w+) (\d{4})`, assign the 12 header months in order starting at the start month, and assert that the last column equals the end month and that there are exactly 12 month columns. Stop if any check fails.

Other parsing notes: the file has no trailing newline; some cells are blank (for example Hood River, Lake, Morrow, Tillamook, Wallowa), meaning no reported filings or suppressed values, which the page does not explain; four county names carry an asterisk (`Douglas*`, `Lane*`, `Linn*`, `Marion*`); Clackamas appears in the CSV with small counts (322 over twelve months) because most Clackamas cases go to justice courts.

### How this source publishes

- Evicted in Oregon (PSU) updates the "Most Recent" chart about the 15th of each month with the previous month's filings. Observed: "Updated on September 15, 2026" (data through August); the calendar-2025 chart "Updated on February 15, 2026." The next update should land around October 15, 2026 with September 2026.
- Each update publishes a new Datawrapper version; some months have two or three versions (corrections). Old versions' `dataset.csv` stays available, but old versions' HTML pages redirect elsewhere, so the period text can only be read from the current version.
- Fetch path for a scheduled job: `GET https://datawrapper.dwcdn.net/0Ofed/` → parse the version from the meta refresh → `GET /0Ofed/<v>/` and parse the intro period and the "Updated on" note → `GET /0Ofed/<v>/dataset.csv`. Upsert all 12 months each run, since recent months are revised. Datawrapper and evictedinoregon.com both returned 200 to curl.
- Calendar-year tabs are separate charts linked from the intro: 2020 `vRxuo`, 2021 `HgGc8`, 2022 `0X4P4`, 2023 `WnCmP`, 2024 `dM4s6`, 2025 `vlDrt`. These are better for a stable history; the 12-month chart is better for the latest months.

### Could not find

- Eviction counts for September 2026 (not yet published).
- An explanation of blank cells.
- Justice-court filings (not in this dataset).

---

## 6. affordable_housing_vacancy (Home Forward)

**Database now:** two rows from news. (1) As of 2025-11-01, "Willamette Week / KATU investigation": 955 vacant units, 14%, 185 days to fill, $8.4M forgone rent. (2) As of 2025-12-01, "Home Forward (response)": about 11%.

**Bottom line:** much newer data exist. Home Forward launched a public **occupancy dashboard** on May 21, 2026. Today it shows **91.4% overall occupancy** (94.5% subsidized units, 89.9% unsubsidized; target 94%), **data as of October 2, 2026**. It reports occupancy, not vacancy, and only the current snapshot. Both existing rows need fixing:

- Row 1 mixes dates. The 955/956 units and 14% come from a November 7, 2025 vacancy report. The 185 days and $8.4M are calendar-2025 figures first published in February 2026, and Home Forward's own audited financial statements confirm them.
- Row 2 is not a December 2025 Home Forward statement. The roughly 11% is Home Forward data as of December 31, 2025, reported by Willamette Week and OPB in February 2026.
- KATU's December 3, 2025 story repeated Willamette Week's figures; I found no separate KATU investigation.

### Figures

| Figure | Value | As of | Definition | URL | Retrieved | Quote |
|---|---|---|---|---|---|---|
| Overall occupancy | 91.4% | Data as of Oct 2, 2026 | Home Forward portfolio; dashboard target 94% | https://www.homeforward.org/performance-dashboard/ (Power BI embed; read with a headless browser) | 2026-10-07 | "91.4% Overall Occupancy Rate" ... "Data as of: 10/2/2026" |
| Subsidized / unsubsidized occupancy | 94.5% / 89.9% | Oct 2, 2026 | Same | Same | 2026-10-07 | "94.5% Subsidized Units" ... "89.9% Unsubsidized Units" |
| Dashboard launch | May 21, 2026 | | Home Forward press release | https://www.homeforward.org/home-forward-launches-public-dashboard-as-part-of-transparency-and-accountability-commitment/ | 2026-10-07 | "portfolio-wide occupancy rate, which recently surpassed 90%" |
| Occupancy at launch | 90.2% | About May 21, 2026 | All housing units (KOIN report; KOIN's site returned 403, read via AOL syndication) | https://www.aol.com/articles/dashboard-reveals-data-multnomah-county-001748000.html | 2026-10-07 | "occupancy rate across all of its housing units, which now stands at 90.2%" |
| Q1 2026 occupancy | 89.4% | Q1 2026 (reported at the Apr 21 board meeting) | Portfolio; from minutes in the May packet | https://www.homeforward.org/wp-content/uploads/2026/05/2026_05_Board_Meeting_Packet_Amended.pdf | 2026-10-07 | "first quarter increasing the occupancy rate to 89.4%" |
| Vacancy, mid-March 2026 | 11.7% | About Mar 25, 2026 | Whole portfolio, reported by Willamette Week | https://www.wweek.com/news/city/2026/03/25/home-forward-officials-brief-board-on-agencys-struggles/ | 2026-10-07 | "Home Forward's vacancy rate across its portfolio is currently 11.7%." |
| Where vacancies sit | 47% in eight downtown buildings | Mar 17, 2026 board meeting | | https://www.homeforward.org/wp-content/uploads/2026/04/2026_04_Board-Packet.pdf | 2026-10-07 | "Our eight downtown properties account for 47% of our portfolio vacancies." |
| Vacancy, April 2026 | "roughly 10%" | Apr 14, 2026 | Agency figure reported by Willamette Week | https://www.wweek.com/news/2026/04/14/while-home-forward-struggled-its-ceo-spent-more-than-100000-on-taxpayer-funded-travel-over-three-years/ | 2026-10-07 | "the vacancy rate is now roughly 10%, it says" |
| Vacancy, end of 2025 (fixes DB row 2) | 11% | Dec 31, 2025 | Home Forward data, as reported by OPB (Feb 27, 2026) and Willamette Week (Feb 24, 2026) | https://www.opb.org/article/2026/02/27/portland-home-forward-housing-authority-vacancies-turnover/ | 2026-10-07 | "as of December 31st, 2025, and it had dropped modestly to 11%" |
| Empty units, Nov 2025 (fixes DB row 1) | 956 of 6,847 affordable units (headline: 955) | Nov 7, 2025 vacancy report | | https://www.wweek.com/news/city/2025/12/03/portlands-housing-authority-sits-on-955-empty-apartments/ | 2026-10-07 | "sitting on 956 empty affordable apartment units, according to a Nov. 7 vacancy report" |
| Vacancy rate, Nov 2025 | 14% | Nov 2025 | Same | Same | 2026-10-07 | "The 14% vacancy rate for the housing authority is more than double" |
| Days to fill and lost rent | 185 days average; $8.4M | Calendar 2025 (Home Forward's fiscal year ends Dec 31) | Audited financial statements, management's discussion | https://www.homeforward.org/wp-content/uploads/2026/06/Final-Signed-Financial-Statements-for-Upload.pdf (same text in the June 16, 2026 board packet) | 2026-10-07 | "averaging 185 days to fill a unit—contributed to an estimated $8.4 million" |
| Next scheduled update | Work session agenda item on occupancy | Oct 8, 2026 | No materials posted for that item | https://www.homeforward.org/wp-content/uploads/2026/10/2026_10_08_Work_Session_Packet.pdf (path as listed on the board page; see archive) | 2026-10-07 | "Progress Report: Housing Portfolio Occupancy" |

These rows were gathered by a research sub-agent. I re-checked the dashboard screenshot, the April and May packet quotes, the June packet's "185 days ... $8.4 million" sentence and the October 8 agenda line in the downloaded files. Conflict to note: Willamette Week on April 28, 2026 wrote of a "vacancy rate spike to 15% last year"; every other source says 14%.

Mapping to the table's `vacancy_pct`: the dashboard gives occupancy. 100 minus 91.4 is 8.6% (derived, not published as a vacancy rate). The denominators may differ from the November 2025 report's 6,847 affordable units; no source says whether they match.

### How this source publishes

- **Occupancy dashboard** (https://www.homeforward.org/performance-dashboard/): a Power BI Government embed rendered by JavaScript. curl and WebFetch get no numbers; a headless browser (Playwright) reads the values, which also appear in the page's aria-labels. It shows only the current snapshot plus a "Data as of" date, so a time series requires saving a snapshot on each run. Home Forward told its board it would update monthly; the June minutes say "as new data is available."
- **Board packets** (https://www.homeforward.org/board-of-commissioners/): monthly PDFs under `/wp-content/uploads/YYYY/MM/`, with unpredictable file names; scrape the page for links. Occupancy figures appear only in minutes and narrative text, published in the following month's packet. Packets can exceed 400 pages.
- **Press releases**: https://www.homeforward.org/post-sitemap.xml carries `lastmod` dates, a cheap change check.
- **Annual figures**: audited financial statements (calendar year) at https://www.homeforward.org/financial-information/, about June of the following year.
- **News**: Willamette Week and OPB have reported the vacancy figures; they are secondary and should be labeled as such.

### Could not find

- A 2026 count of vacant units (only rates and occupancy percentages).
- A days-to-fill figure newer than the 2025 average of 185.
- Any 2026 City, County or HUD audit or action on Home Forward vacancies.
- A December 2025 Home Forward statement giving 11% (the figure surfaced in February 2026).

---

## 7. doubled_up

**Database now:** 2024 estimates from PSU HRAC's "2025 Oregon Statewide Homelessness Estimates" (Table 20; 2024 ACS 1-year microdata; Richard et al. method): Multnomah 3,477 (±960), Washington 3,118 (±710), Clackamas 1,159 (±520), Oregon 21,542 (±1,993).

**Bottom line:** the 2025 ACS 1-year release is **not out** and has **no release date**. The Census Bureau held it in August 2026 while it reworks disclosure-avoidance methods under a new Commerce Department order. The 2025 PUMS microdata, which the doubled-up method needs, is also unpublished (the 2025 folders and API endpoints return 404). Nobody has published 2025 doubled-up estimates, and nobody can from public data until the 2025 PUMS appears. The database's 2024 figures match HRAC's Table 20 and are still the newest available. Multnomah County's own HRAP indicator uses the same 3,477 (2024).

### Figures

| Figure | Value | Period | Definition | URL | Retrieved | Quote |
|---|---|---|---|---|---|---|
| Multnomah doubled-up estimate | 3,477 (±960) | 2024 (ACS 1-year) | HRAC Table 20, "ACS Estimates of Doubled-Up Homelessness, 2024" | PSU's Google Drive copy of the report, linked from https://www.pdx.edu/news/portland-state-releases-new-2025-statewide-homelessness-report : https://drive.google.com/file/d/1foT7bUYUTwLPW1MOy98X3pj8oeJ0LGFS/view (printed p. 49, PDF p. 50) | 2026-10-07 | "Multnomah Multnomah 3,477 +/- 960" (row text) |
| Washington / Clackamas / Oregon | 3,118 (±710) / 1,159 (±520) / 21,542 (±1,993) | 2024 | Same table | Same | 2026-10-07 | "Total 21,542 +/- 1,993" (row text) |
| Why 2024 data | | | | Same, printed p. 48 | 2026-10-07 | "We use the 2024 one-year ACS estimates, as this source is the most recent" |
| County figures are PUMA-based | | | | Same | 2026-10-07 | "calculate estimates at the Public Use Microdata Areas (PUMA) level" |
| County indicator using the same number | 3,477 | 2024 | HRAP KEI #6: people living without a lease in households at or below 30% of area median income | HRAP May 2026, p. 10 | 2026-10-07 | "ACS data estimated that at any given time in 2024, 3,477 people" |
| County says it updates annually | | | | https://hsd.multco.us/wp-content/uploads/2026/06/Homeless-Response-System-KPI.HSD-Provider-Conference.6.2026.pdf, slide 10 | 2026-10-07 | "American Community Survey data, updated annually" |
| 2025 ACS 1-year status | No release date | As of Aug 6, 2026 update; still current Oct 7 | | https://www.census.gov/programs-surveys/acs/news/updates.html | 2026-10-07 | "The release date for the 2025 ACS 1-year estimates is being determined." |
| Reason and target | New Commerce disclosure-avoidance order; Census aims for "later this year" | Aug 2026 | | https://www.census.gov/newsroom/press-releases/2026/iphi-acs-media-advisory.html (same sentence on the updates page) | 2026-10-07 | "allow the release of the ACS 1-year tables later this year" |
| 2025 PUMS files | Not published (HTTP 404) | | | https://www2.census.gov/programs-surveys/acs/data/pums/2025/1-Year/ | 2026-10-07 | HTTP 404 (no text) |
| 2025 PUMS API | Not published (HTTP 404) | | | https://api.census.gov/data/2025/acs/acs1/pums | 2026-10-07 | HTTP 404 (no text) |
| Previous cycle, for timing | 2024 tables Sept 11, 2025; 2024 PUMS Dec 4, 2025 | | | https://www.census.gov/programs-surveys/acs/news/data-releases/2024/release-schedule.html | 2026-10-07 | "Updated December 4, 2025" |
| HRAC 2026 statewide report | Not announced; project page lists only reports through 2025 | | | https://www.pdx.edu/homelessness/oregon-statewide-homelessness-estimates | 2026-10-07 | "for the years 2022, 2023, 2024, 2025, and 2026" |

The Census and HRAC rows above were gathered by a research sub-agent; I re-opened the Census updates page, the press release, both 404 URLs and the Table 20 rows myself.

### How this source publishes

- **HRAC**: one PDF a year, released in January (January 21, 2025; January 15, 2026), covering the prior year's ACS. No machine-readable tables; table numbers change between editions. PDXScholar's PDF copy is behind a Cloudflare check (not bypassed); PSU's news release links a Google Drive copy that opens.
- **Census status checks a job can run without an API key**: `https://www2.census.gov/programs-surveys/acs/data/pums/<YEAR>/1-Year/` and `https://api.census.gov/data/<YEAR>/acs/acs1/pums` turn from 404 to 200 when a year's PUMS is released.
- **Recomputing it ourselves**: possible in principle from the Census PUMS person and housing files (`.../pums/<YEAR>/1-Year/csv_por.zip` and `csv_hor.zip` for Oregon) with person and replicate weights, summing Multnomah's six PUMAs. It would probably not match HRAC exactly, since HRAC does not publish its code.
- **Trap**: data queries to api.census.gov now require a key. A keyless request redirects to an HTML "missing key" page that returns HTTP 200, so a job must check that it received JSON.
- Census has said its disclosure methods will change through 2029, so the 2025 microdata may not be fully comparable with 2024 when it comes out.

### Could not find

- Any 2025-based doubled-up estimate from HRAC, Oregon Housing and Community Services, the Oregon Department of Education, Metro, Multnomah County, SchoolHouse Connection or the National Alliance to End Homelessness.
- A release date for the 2025 ACS 1-year tables or PUMS.
- Any HRAC announcement of a 2026 statewide report.

---

## 8. The county's by-name dashboard

**Bottom line:** still offline today. The embedded Tableau view shows "Dashboard Maintenance in Progress," "Status: Temporarily Unavailable," and "Expected Return: October 2026." No county page announces a return date beyond that image, and I found no county page about the restated series. The only public account of the restatement remains OregonLive's September 25, 2026 article (already recorded in `sources.md`, item 1e).

### Figures and status

| Item | Value | URL | Retrieved | Quote |
|---|---|---|---|---|
| Dashboard status | Maintenance placeholder; no data | https://public.tableau.com/static/images/Mu/MultnomahCountyHomelessServicesDepartmentDataDashboard_17447622060640/TotalPopulation/1.png (the image the HSD page embeds) | 2026-10-07 | "Status: Temporarily Unavailable" ... "Expected Return: October 2026" |
| Workbook last republished | 2026-09-19 00:27 UTC; data download disabled | https://public.tableau.com/profile/api/single_workbook/MultnomahCountyHomelessServicesDepartmentDataDashboard_17447622060640 | 2026-10-07 | `"lastPublishDate":1789777625240` ... `"allowDataAccess":false` |
| HSD dashboard page | Unchanged since May 30, 2025; still embeds the same workbook; no notice | https://hsd.multco.us/data-dashboard/ ; modified date from https://hsd.multco.us/wp-json/wp/v2/pages?slug=data-dashboard&_fields=modified | 2026-10-07 | "a monthly view of data that helps us track our progress" |
| HSD news posts | Newest post May 6, 2026 (shelter closures); none on the dashboard since May 15, 2025 | https://hsd.multco.us/wp-json/wp/v2/posts?per_page=15&_fields=date,modified,link,title | 2026-10-07 | "March 2025 data now available" (newest dashboard post) |
| HSD September 2026 newsletter | No dashboard notice; says audited SHS numbers come in November | https://mailchi.mp/multco/hsd-monthly-september-2026 | 2026-10-07 | "Final, audited numbers will be published in the official SHS Annual Report this November." |
| Last county by-name figures in a county document | March 2026: "nearly 18,500" total; "just over 9,100" unsheltered; "just over 9,450" chronic | HRAP May 2026, pp. 7, 13, 14 | 2026-10-07 | "As of March 2026, nearly 18,500 people were known to be experiencing" |
| Same, in a June 2026 county slide deck | 18,480 total (+209 month to month, +3,234 or 21.2% year over year); 9,107 unsheltered | https://hsd.multco.us/wp-content/uploads/2026/06/Homeless-Response-System-KPI.HSD-Provider-Conference.6.2026.pdf, slides 6 and 14 (deck dated June 12, 2026; the timeline slide says the data run through March 2026) | 2026-10-07 | "Roughly 18,480 currently accessing services" |
| March 2026 inflow and outflow | 1,687 entered; 1,468 left | HRAP May 2026, p. 8 | 2026-10-07 | "In March 2026, 1,687 people entered homeless services, while 1,468 left" |
| City-County plan for a new dashboard | Planned "Dashboard live" with a July 2026 report of data through June; not done as of today | June 2026 deck, slide 20 | 2026-10-07 | "Quarterly report, data through June (baseline)." ... "Dashboard live." |
| HRS reports page | Newest report is May 2026; page last reviewed May 22, 2026 | https://multco.us/info/reports-data-and-documents | 2026-10-07 | "Last reviewed May 22, 2026" |
| HRAP Tableau dashboard | Old four-goal dashboard, data through Dec 31, 2025; last republished 2026-02-17 | https://public.tableau.com/app/profile/homelessness.response/viz/HRAPDashboard/LandingPage ; metadata https://public.tableau.com/profile/api/single_workbook/HRAPDashboard | 2026-10-07 | "Data Through: December 31, 2025" |

Note on the March 2026 numbers: 18,479 (KGW's components) and "roughly 18,480" (county deck) agree, and 9,107 unsheltered matches KGW exactly. These figures are from the old method and will be restated about 20% lower when the dashboard returns (OregonLive, per `sources.md`).

### How this source publishes

- The by-name data exist only in the Tableau Public workbook embedded at https://hsd.multco.us/data-dashboard/. Data access is disabled and the CSV endpoint returned 404 behind an AWS WAF script on October 7 (see `sources.md`). A scheduled job can check status cheaply: (a) `lastPublishDate` from the `single_workbook` API above changes when the county republishes; (b) the static image `.../TotalPopulation/1.png` shows either the maintenance notice or the headline "N People Experiencing Homelessness in <Month Year>". Reading numbers from the image needs a person or OCR; I did not try to get data any other way.
- The HRS quarterly reports (PDF, multco.us) repeat the latest by-name totals in prose about every three months, with a lag of about two months.
- Watch for: the restated series replacing every month back to January 2024 (store each edition with its retrieval date rather than overwriting), and the joint City-County work session the June deck lists for October 20.

### Could not find

- Any county announcement, release or page (multco.us, hsd.multco.us, HSD newsletters for July and September 2026) giving a return date other than "October 2026," or describing the restatement.
- County figures for April to September 2026.
- The July 2026 HRS baseline report or the new KPI dashboard the June deck said would go live.

---

## Archived files

All files below were saved on October 7, 2026 to `portland-civic-lab/runtime-data/source-archive/2026-10-07/dashboard-refresh/` (git-ignored; about 190 MB). Each was fetched by plain HTTP from a public URL, except the Home Forward dashboard screenshot (headless browser rendering of a public page). No bot check, CAPTCHA or paywall was bypassed; pages that refused access (HTTP 403/404/504) are kept as error bodies and named as such. Files whose source says "derived" are images rendered from an archived PDF. Text extracts (`pdftotext`) and response-header dumps were not archived; they can be regenerated from the PDFs. Not archived: 70-byte blank placeholder images that Tableau returned for guessed sheet names.

182 files.

| File | Source URL |
|---|---|
| `census-2020-tract-to-puma.txt` | https://www2.census.gov/geo/docs/maps-data/data/rel2020/2020_Census_Tract_to_2020_PUMA.txt |
| `census-acs-2024-release-schedule.html` | https://www.census.gov/programs-surveys/acs/news/data-releases/2024/release-schedule.html |
| `census-acs-data-releases.html` | https://www.census.gov/programs-surveys/acs/news/data-releases.html |
| `census-acs-news-updates-agent-copy.html` | https://www.census.gov/programs-surveys/acs/news/updates.html |
| `census-acs-news-updates.html` | https://www.census.gov/programs-surveys/acs/news/updates.html |
| `census-api-2024-acs1-keyless-missing-key-page.html` | https://api.census.gov/data/2024/acs/acs1?get=NAME,B01003_001E&for=county:051&in=state:41 (redirected to https://api.census.gov/data/missing_key.html) |
| `census-api-2024-acs1-pums-variables.json` | https://api.census.gov/data/2024/acs/acs1/pums/variables.json |
| `census-api-2025-acs1-keyless-missing-key-page.html` | https://api.census.gov/data/2025/acs/acs1?get=NAME,B01003_001E&for=county:051&in=state:41 (redirected to https://api.census.gov/data/missing_key.html) |
| `census-api-2025-acs1-pums-http404.html` | https://api.census.gov/data/2025/acs/acs1/pums (HTTP 404 body) |
| `census-api-2025-catalog.json` | https://api.census.gov/data/2025.json |
| `census-api-data-catalog.json` | https://api.census.gov/data.json |
| `census-director-blog-2026-08-disclosure-avoidance.html` | https://www.census.gov/newsroom/blogs/director/2026/08/understanding-the-new-disclosure-avoidance-policy.html |
| `census-press-release-2026-iphi-acs-media-advisory-agent-copy.html` | https://www.census.gov/newsroom/press-releases/2026/iphi-acs-media-advisory.html |
| `census-press-release-2026-iphi-acs-media-advisory.html` | https://www.census.gov/newsroom/press-releases/2026/iphi-acs-media-advisory.html |
| `census-project-letter-2026-09-04-acs-delay.pdf` | https://thecensusproject.org/wp-content/uploads/2026/09/Census-Project-Letter-Re-DAO-and-ACS-9-4-2026.pdf |
| `census-upcoming-releases.html` | https://www.census.gov/data/what-is-data-census-gov/upcoming-releases.html |
| `census-www2-summary-file-2025-documentation-index.html` | https://www2.census.gov/programs-surveys/acs/summary_file/2025/table-based-SF/documentation/ |
| `census-www2-summary-file-index.html` | https://www2.census.gov/programs-surveys/acs/summary_file/ |
| `derived-fy25-q4-shs-report-p26-revenue-crop.png` | derived (pdftoppm) from multco-shs-quarterly-report-fy25-q4-with-financials-updated-2026-03-23.pdf |
| `derived-fy25-q4-shs-report-p27-program-costs-crop.png` | derived (pdftoppm) from multco-shs-quarterly-report-fy25-q4-with-financials-updated-2026-03-23.pdf |
| `derived-fy26-q4-shs-report-p28-revenue-crop.png` | derived (pdftoppm) from multco-shs-quarterly-report-fy26-q4-updated-2026-08-28.pdf |
| `derived-fy26-q4-shs-report-p30-program-costs-crop.png` | derived (pdftoppm) from multco-shs-quarterly-report-fy26-q4-updated-2026-08-28.pdf |
| `derived-metro-shs-financial-report-fy26-q4-p01.png` | derived (pdftoppm) from metro-shs-financial-report-fy26-q4.pdf |
| `derived-metro-shs-financial-report-fy26-q4-p04.png` | derived (pdftoppm) from metro-shs-financial-report-fy26-q4.pdf |
| `derived-metro-shs-regional-annual-report-fy22-p34.png` | derived (pdftoppm) from metro-shs-regional-annual-report-fy22.pdf |
| `evictedinoregon-data-http404-error.html` | https://www.evictedinoregon.com/data (HTTP 404 error body) |
| `evictedinoregon-data-tables.html` | https://www.evictedinoregon.com/data-tables |
| `evictedinoregon-datawrapper-0Ofed-latest-redirect.html` | https://datawrapper.dwcdn.net/0Ofed/ |
| `evictedinoregon-datawrapper-0Ofed-v20-dataset.csv` | https://datawrapper.dwcdn.net/0Ofed/20/dataset.csv |
| `evictedinoregon-datawrapper-0Ofed-v21-dataset.csv` | https://datawrapper.dwcdn.net/0Ofed/21/dataset.csv |
| `evictedinoregon-datawrapper-0Ofed-v22-dataset.csv` | https://datawrapper.dwcdn.net/0Ofed/22/dataset.csv |
| `evictedinoregon-datawrapper-0Ofed-v22-page-redirect-stub.html` | https://datawrapper.dwcdn.net/0Ofed/22/ |
| `evictedinoregon-datawrapper-0Ofed-v23-dataset.csv` | https://datawrapper.dwcdn.net/0Ofed/23/dataset.csv |
| `evictedinoregon-datawrapper-0Ofed-v24-dataset.csv` | https://datawrapper.dwcdn.net/0Ofed/24/dataset.csv |
| `evictedinoregon-datawrapper-0Ofed-v25-dataset.csv` | https://datawrapper.dwcdn.net/0Ofed/25/dataset.csv |
| `evictedinoregon-datawrapper-0Ofed-v26-dataset.csv` | https://datawrapper.dwcdn.net/0Ofed/26/dataset.csv |
| `evictedinoregon-datawrapper-0Ofed-v27-dataset.csv` | https://datawrapper.dwcdn.net/0Ofed/27/dataset.csv |
| `evictedinoregon-datawrapper-0Ofed-v28-dataset.csv` | https://datawrapper.dwcdn.net/0Ofed/28/dataset.csv |
| `evictedinoregon-datawrapper-0Ofed-v29-dataset.csv` | https://datawrapper.dwcdn.net/0Ofed/29/dataset.csv |
| `evictedinoregon-datawrapper-0Ofed-v30-dataset.csv` | https://datawrapper.dwcdn.net/0Ofed/30/dataset.csv |
| `evictedinoregon-datawrapper-0Ofed-v31-dataset.csv` | https://datawrapper.dwcdn.net/0Ofed/31/dataset.csv |
| `evictedinoregon-datawrapper-0Ofed-v32-dataset.csv` | https://datawrapper.dwcdn.net/0Ofed/32/dataset.csv |
| `evictedinoregon-datawrapper-0Ofed-v33-dataset.csv` | https://datawrapper.dwcdn.net/0Ofed/33/dataset.csv |
| `evictedinoregon-datawrapper-0Ofed-v34-chart.html` | https://datawrapper.dwcdn.net/0Ofed/34/ |
| `evictedinoregon-datawrapper-0Ofed-v34-dataset.csv` | https://datawrapper.dwcdn.net/0Ofed/34/dataset.csv |
| `evictedinoregon-datawrapper-0Ofed-v35-404.html` | https://datawrapper.dwcdn.net/0Ofed/35/dataset.csv |
| `evictedinoregon-datawrapper-EbhgM-v29-chart.html` | https://datawrapper.dwcdn.net/EbhgM/29/ |
| `evictedinoregon-datawrapper-T51yH-v22-chart.html` | https://datawrapper.dwcdn.net/T51yH/22/ |
| `evictedinoregon-datawrapper-YTFNI-v19-chart.html` | https://datawrapper.dwcdn.net/YTFNI/19/ |
| `evictedinoregon-datawrapper-YTFNI-v19-dataset.csv` | https://datawrapper.dwcdn.net/YTFNI/19/dataset.csv |
| `evictedinoregon-datawrapper-cbJjQ-v2-chart.html` | https://datawrapper.dwcdn.net/cbJjQ/2/ |
| `evictedinoregon-datawrapper-cbJjQ-v2-dataset.csv` | https://datawrapper.dwcdn.net/cbJjQ/2/dataset.csv |
| `evictedinoregon-datawrapper-lyn6N-v18-chart.html` | https://datawrapper.dwcdn.net/lyn6N/18/ |
| `evictedinoregon-datawrapper-lyn6N-v18-dataset.csv` | https://datawrapper.dwcdn.net/lyn6N/18/dataset.csv |
| `evictedinoregon-datawrapper-vlDrt-v1-dataset.csv` | https://datawrapper.dwcdn.net/vlDrt/1/dataset.csv |
| `evictedinoregon-datawrapper-vlDrt-v2-chart.html` | https://datawrapper.dwcdn.net/vlDrt/2/ |
| `evictedinoregon-datawrapper-vlDrt-v2-dataset.csv` | https://datawrapper.dwcdn.net/vlDrt/2/dataset.csv |
| `evictedinoregon-datawrapper-wEBS1-v23-chart.html` | https://datawrapper.dwcdn.net/wEBS1/23/ |
| `evictedinoregon-home.html` | https://www.evictedinoregon.com/ |
| `homeforward-audited-financial-statements-2025.pdf` | https://www.homeforward.org/wp-content/uploads/2026/06/Final-Signed-Financial-Statements-for-Upload.pdf |
| `homeforward-board-of-commissioners.html` | https://www.homeforward.org/board-of-commissioners/ |
| `homeforward-board-packet-2025-11-18.pdf` | https://www.homeforward.org/wp-content/uploads/2025/11/2025_11_18_Board_Packet_Updated.pdf |
| `homeforward-board-packet-2025-12.pdf` | https://www.homeforward.org/wp-content/uploads/2025/12/2025_12_Board_Packet_Update.pdf |
| `homeforward-board-packet-2026-02.pdf` | https://www.homeforward.org/wp-content/uploads/2026/02/2026_02_Board_Packet.pdf |
| `homeforward-board-packet-2026-03-revised.pdf` | https://www.homeforward.org/wp-content/uploads/2026/03/2026_03_Board_Packet_Revised_03_16_26.pdf |
| `homeforward-board-packet-2026-04.pdf` | https://www.homeforward.org/wp-content/uploads/2026/04/2026_04_Board-Packet.pdf |
| `homeforward-board-packet-2026-05-amended.pdf` | https://www.homeforward.org/wp-content/uploads/2026/05/2026_05_Board_Meeting_Packet_Amended.pdf |
| `homeforward-board-packet-2026-06-16.pdf` | https://www.homeforward.org/wp-content/uploads/2026/06/2026_06_16_Board_Packet_Updated.pdf |
| `homeforward-board-packet-2026-07-21.pdf` | https://www.homeforward.org/wp-content/uploads/2026/07/2026_07_21_Board_Packet.pdf |
| `homeforward-board-packet-2026-08-25.pdf` | https://www.homeforward.org/wp-content/uploads/2026/08/2026_08_25_Board_Packet.pdf |
| `homeforward-board-packet-2026-09-22.pdf` | https://www.homeforward.org/wp-content/uploads/2026/09/2026_09_22_Board_Packet.pdf |
| `homeforward-financial-information.html` | https://www.homeforward.org/financial-information/ |
| `homeforward-home.html` | https://www.homeforward.org/ |
| `homeforward-in-the-news.html` | https://www.homeforward.org/in-the-news/ |
| `homeforward-newsroom.html` | https://www.homeforward.org/newsroom/ |
| `homeforward-occupancy-dashboard-screenshot-2026-10-07.png` | screenshot (headless Chromium) of https://app.powerbigov.us/view?r=eyJrIjoiNTRlM2MxMjQtZWIxNS00OTU2LThlODMtOTllMjM4NjI0N2I1IiwidCI6IjZiNjdiMDMzLTk3NGQtNGFiNC04NGUyLWNjMTcxNzgzNGIwOSJ9 (embedded at https://www.homeforward.org/performance-dashboard/) |
| `homeforward-page-sitemap.xml` | https://www.homeforward.org/page-sitemap.xml |
| `homeforward-performance-dashboard-page.html` | https://www.homeforward.org/performance-dashboard/ |
| `homeforward-post-sitemap.xml` | https://www.homeforward.org/post-sitemap.xml |
| `homeforward-release-2026-04-14-new-commitments.html` | https://www.homeforward.org/home-forward-announces-new-commitments-to-strengthen-transparency-accountability-and-performance/ |
| `homeforward-release-2026-05-21-public-dashboard.html` | https://www.homeforward.org/home-forward-launches-public-dashboard-as-part-of-transparency-and-accountability-commitment/ |
| `homeforward-robots.txt` | https://www.homeforward.org/robots.txt |
| `homeforward-sitemap-index.xml` | https://www.homeforward.org/sitemap_index.xml |
| `homeforward-special-board-meeting-2026-05-01.pdf` | https://www.homeforward.org/wp-content/uploads/2026/05/2026_05_01_Special_Board_Meeting_Updated.pdf |
| `homeforward-statement-from-board.html` | https://www.homeforward.org/statement-from-the-board-of-commissioners/ |
| `homeforward-work-session-agenda-2026-02-05.pdf` | https://www.homeforward.org/wp-content/uploads/2026/02/2026_02_05_Work_Session_Agenda_Final.pdf |
| `homeforward-work-session-packet-2026-10-08.pdf` | https://www.homeforward.org/wp-content/uploads/2026/10/2026_10_08_Work_Session_Packet.pdf |
| `hrac-2025-oregon-statewide-homelessness-estimates.pdf` | https://drive.google.com/uc?export=download&id=1foT7bUYUTwLPW1MOy98X3pj8oeJ0LGFS (PSU Google Drive copy linked from https://www.pdx.edu/news/portland-state-releases-new-2025-statewide-homelessness-report) |
| `hsd-data-dashboard-page.html` | https://hsd.multco.us/data-dashboard/ |
| `hsd-emergency-shelters-page.html` | https://hsd.multco.us/emergency-shelters/ |
| `hsd-home.html` | https://hsd.multco.us/ |
| `hsd-hrs-kpi-provider-conference-2026-06.pdf` | https://hsd.multco.us/wp-content/uploads/2026/06/Homeless-Response-System-KPI.HSD-Provider-Conference.6.2026.pdf |
| `hsd-newsletter-2026-07.html` | https://mailchi.mp/multco/hsd-monthly-july-2026 |
| `hsd-newsletter-2026-09.html` | https://mailchi.mp/multco/hsd-monthly-september-2026 |
| `hsd-newsletter-archive.html` | https://hsd.multco.us/news/newsletter-archive/ |
| `hsd-post-2026-05-06-shelter-updates.html` | https://hsd.multco.us/2026/05/06/shelter-updates/ |
| `hsd-quarterly-data-dashboard.html` | https://hsd.multco.us/quarterly-data-dashboard/ |
| `hsd-reports-page.html` | https://hsd.multco.us/reports/ |
| `hsd-wp-page-data-dashboard.json` | https://hsd.multco.us/wp-json/wp/v2/pages?slug=data-dashboard&_fields=id,date,modified,link |
| `hsd-wp-page-quarterly-data-dashboard.json` | https://hsd.multco.us/wp-json/wp/v2/pages?slug=quarterly-data-dashboard&_fields=id,date,modified,link |
| `hsd-wp-page-reports.json` | https://hsd.multco.us/wp-json/wp/v2/pages?slug=reports&_fields=id,date,modified,link |
| `hsd-wp-posts-latest.json` | https://hsd.multco.us/wp-json/wp/v2/posts?per_page=15&_fields=date,modified,link,title |
| `ihep-2026-acs-delay-letter.html` | https://www.ihep.org/press/ihep-100-organizations-urge-commerce-department-to-end-indefinite-delay-of-acs-data-release/ |
| `kgw-affordable-units-vacant-http403-error.html` | https://www.kgw.com/article/news/local/the-story/portland-affordable-housing-units-vacant-empty-wilson-apartment/283-b1090855-b548-4e1b-90bf-65be95e5be5c (HTTP 403 error body) |
| `koin-home-forward-dashboard-http403-error.html` | https://www.koin.com/news/portland/dashboard-reveals-data-from-multnomah-county-housing-authority-amid-transparency-concerns/ (HTTP 403 error body) |
| `metro-about-finance-http404-error.html` | https://www.oregonmetro.gov/about-metro/finance (HTTP 404 error body) |
| `metro-fy2023-24-adopted-budget.pdf` | https://www.oregonmetro.gov/sites/default/files/2025-11/fy-2023-24-adopted-budget-20231106.pdf |
| `metro-fy2024-25-adopted-budget.pdf` | https://www.oregonmetro.gov/sites/default/files/2025-11/fy-2024-25-adopted-budget-20241021.pdf |
| `metro-fy2026-27-proposed-budget.pdf` | https://www.oregonmetro.gov/sites/default/files/2026-04/fy-2026-27-proposed-budget-20260403.pdf |
| `metro-shs-financial-report-fy24-q4.pdf` | https://www.oregonmetro.gov/sites/default/files/2025-12/supportive-housing-services-financial-report-fy2024-q4-20240911.pdf |
| `metro-shs-financial-report-fy25-q3.pdf` | https://www.oregonmetro.gov/sites/default/files/2025-12/11-shs-financial-report-fy25-q3-through-mar-2025-final.pdf |
| `metro-shs-financial-report-fy25-q4.pdf` | https://www.oregonmetro.gov/sites/default/files/2026-02/shs-financial-report-fy25-q4-through-june-2025-final.pdf |
| `metro-shs-financial-report-fy26-q2.pdf` | https://www.oregonmetro.gov/sites/default/files/2026-03/shs-financial-report-fy26-q2-through-dec-2025-final.pdf |
| `metro-shs-financial-report-fy26-q4.pdf` | https://www.oregonmetro.gov/sites/default/files/2026-09/shs-financial-report-fy26-q4-through-june-2026.pdf |
| `metro-shs-funding-page.html` | https://www.oregonmetro.gov/what-metro-does/housing-and-homelessness/supportive-housing-services/funding |
| `metro-shs-fy26-year-end-revenue-report.pdf` | https://www.oregonmetro.gov/sites/default/files/2026-09/fy-2025-26-shs-year-end-report_0.pdf |
| `metro-shs-oversight-committee-meeting-2026-09-09.html` | https://www.oregonmetro.gov/events/supportive-housing-services-regional-policy-and-oversight-committee-meeting-2026-09-09 |
| `metro-shs-oversight-committee-page.html` | https://www.oregonmetro.gov/committees/supportive-housing-services-regional-policy-oversight-committee |
| `metro-shs-overview-page.html` | https://www.oregonmetro.gov/public-projects/supportive-housing-services (redirected to https://www.oregonmetro.gov/what-metro-does/housing-and-homelessness/supportive-housing-services) |
| `metro-shs-progress-page.html` | https://www.oregonmetro.gov/what-metro-does/housing-and-homelessness/supportive-housing-services/progress |
| `metro-shs-regional-annual-report-fy22.pdf` | https://www.oregonmetro.gov/sites/default/files/2025-10/supportive-housing-services-regional-annual-report-fy2022-20220616.pdf |
| `metro-shs-regional-annual-report-fy23.pdf` | https://www.oregonmetro.gov/sites/default/files/2025-10/supportive-housing-services-regional-annual-report-fy2023-20230630.pdf |
| `metro-shs-regional-annual-report-fy24.pdf` | https://www.oregonmetro.gov/sites/default/files/2025-10/supportive-housing-services-regional-annual-report-fy2024-20250211.pdf |
| `metro-shs-regional-annual-report-fy25-v2.pdf` | https://www.oregonmetro.gov/sites/default/files/2026-03/supportive-housing-services-regional-annual-report-fy2024-2025-v2-03.25.26.pdf |
| `metro-shs-revenue-collection-infogram.html` | https://infogram.com/shs-revenue-collection-1h7v4pdwgv3e84k |
| `metro-shs-revenue-forecast-fall-2025.pdf` | https://www.oregonmetro.gov/sites/default/files/2026-01/supportive-housing-services-revenue-forecast-fall-2025.pdf |
| `multco-death-data-page.html` | https://multco.us/info/death-data |
| `multco-domicile-unknown-landing-recheck.html` | https://multco.us/info/domicile-unknown |
| `multco-domicile-unknown-landing.html` | https://multco.us/info/domicile-unknown |
| `multco-domicile-unknown-report-deaths-2020.pdf` | https://multco.us/file/domicile_unknown_report:_analyzing_deaths_in_2020/download |
| `multco-domicile-unknown-report-deaths-2021.pdf` | https://multco.us/file/domicile_unknown_report:_analyzing_deaths_in_2021/download |
| `multco-domicile-unknown-report-deaths-2022.pdf` | https://multco.us/file/domicile_unknown_report:_analyzing_deaths_in_2022/download |
| `multco-domicile-unknown-report-deaths-2023.pdf` | https://multco.us/file/domicile_unknown_report:_analyzing_deaths_in_2023/download |
| `multco-domicile-unknown-report-deaths-2024.pdf` | https://multco.us/file/domicile_unknown_report:_analyzing_deaths_in_2024/download |
| `multco-hrap-2.0-draft-2025-10-15.pdf` | https://multco.us/file/oct._15_draft_homelessness_response_action_plan_2.0/download |
| `multco-hrap-quarterly-report-2025-11.pdf` | https://multco.us/file/hrap_quarterly_report_november_2025/download |
| `multco-hrap-quarterly-report-2026-02.pdf` | https://multco.us/file/hrap_quarterly_report_february_2026/download |
| `multco-hrap-quarterly-report-2026-05.pdf` | https://multco.us/file/hrap_quarterly_report_may_2026/download |
| `multco-hrs-program-page.html` | https://multco.us/programs/homelessness-response-system |
| `multco-hrs-reports-data-and-documents.html` | https://multco.us/info/reports-data-and-documents |
| `multco-hsd-adult-shelter-review-fy25.pdf` | https://hsd.multco.us/wp-content/uploads/2026/01/Adult-Shelter-Review-FY25.pdf |
| `multco-news-2025-11-26-shs-housed-15724.html` | https://multco.us/news/counties-report-supportive-housing-services-measure-has-now-housed-15724-people-across |
| `multco-news-2025-12-19-domicile-unknown-2024.html` | https://multco.us/news/multnomah-county-releases-domicile-unknown-report-homeless-deaths-occurring-2024 |
| `multco-news-2026-01-12-shelter-review.html` | https://multco.us/news/news-release-new-report-suggests-change-shelter-investments-could-help-more-people-leave |
| `multco-shs-annual-report-fy25-updated-2025-12-11.pdf` | https://hsd.multco.us/wp-content/uploads/2025/12/FINAL-SHS-Annual-Report-Updated-12.11.25.pdf |
| `multco-shs-quarterly-report-fy25-q4-with-financials-updated-2026-03-23.pdf` | https://hsd.multco.us/wp-content/uploads/2026/03/FINAL-Q4-FY25-SHS-Report-with-Financials-updated-3.23.36.pdf |
| `multco-shs-quarterly-report-fy26-q1-updated-2026-03-23.pdf` | https://hsd.multco.us/wp-content/uploads/2026/03/FINAL-Q1-FY26-SHS-Report-Updated-3.23.26.pdf |
| `multco-shs-quarterly-report-fy26-q2-updated-2026-04-03.pdf` | https://hsd.multco.us/wp-content/uploads/2026/04/Q2-FY26-SHS-Report-FINAL-Updated-4.3.26.pdf |
| `multco-shs-quarterly-report-fy26-q3.pdf` | https://hsd.multco.us/wp-content/uploads/2026/05/Multnomah-County-Q3-FY26-SHS-Report-FINAL.pdf |
| `multco-shs-quarterly-report-fy26-q4-updated-2026-08-28.pdf` | https://hsd.multco.us/wp-content/uploads/2026/09/Q4-FY26-SHS-Report-FINAL-Updated-8.28.26.pdf |
| `naeh-state-of-homelessness.html` | https://endhomelessness.org/state-of-homelessness/ |
| `novoco-acs-delay-http403-error.html` | https://www.novoco.com/news/2025-acs-data-release-delayed (HTTP 403 error body) |
| `opb-2026-02-27-home-forward-vacancies.html` | https://www.opb.org/article/2026/02/27/portland-home-forward-housing-authority-vacancies-turnover/ |
| `oregon-ohna-2026-results-report.pdf` | https://www.oregon.gov/das/oea/Documents/OHNA-2026-Results-Report.pdf |
| `pdx-archives-44450-page.html` | https://archives.pdx.edu/ds/psu/44450 |
| `pdx-homelessness-home.html` | https://www.pdx.edu/homelessness/research (redirected to https://www.pdx.edu/homelessness/) |
| `pdx-hrac-news.html` | https://www.pdx.edu/homelessness/news |
| `pdx-hrac-statewide-estimates-page.html` | https://www.pdx.edu/homelessness/oregon-statewide-homelessness-estimates |
| `pdx-news-2026-01-15-statewide-report.html` | https://www.pdx.edu/news/portland-state-releases-new-2025-statewide-homelessness-report |
| `pdxscholar-hrac-pub-53-landing.html` | https://pdxscholar.library.pdx.edu/hrac_pub/53/ |
| `portland-gov-2026-07-21-changes-city-shelter-services.html` | https://www.portland.gov/shelter-services/news/2026/7/21/changes-city-shelter-services |
| `portland-gov-shelter-services-data-dashboards.html` | https://www.portland.gov/shelter-services/shelter-services-data-dashboards |
| `richard-et-al-quantifying-doubled-up-homelessness.pdf` | https://nlihc.org/sites/default/files/Quantifying-Doubled-Up-Homelessness.pdf |
| `tableau-hrap-dashboard-landing.png` | https://public.tableau.com/static/images/HR/HRAPDashboard/LandingPage/1.png |
| `tableau-hrap-dashboard-workbook-metadata.json` | https://public.tableau.com/profile/api/single_workbook/HRAPDashboard |
| `tableau-hsd-data-dashboard-totalpopulation-maintenance.png` | https://public.tableau.com/static/images/Mu/MultnomahCountyHomelessServicesDepartmentDataDashboard_17447622060640/TotalPopulation/1.png |
| `tableau-hsd-data-dashboard-workbook-metadata.json` | https://public.tableau.com/profile/api/single_workbook/MultnomahCountyHomelessServicesDepartmentDataDashboard_17447622060640 |
| `tableau-shelter-utilization-report-about.png` | https://public.tableau.com/static/images/Sh/ShelterUtilizationReport/Report/1.png |
| `tableau-shelter-utilization-report-workbook-metadata.json` | https://public.tableau.com/profile/api/single_workbook/ShelterUtilizationReport |
| `tnsdc-acs-delay-http504-error.html` | https://tnsdc.utk.edu/2026/08/13/new-rule-pushes-back-2025-american-community-survey-other-census-bureau-product-releases/ (HTTP 504 error body) |
| `wweek-2025-12-03-955-empty-apartments.html` | https://www.wweek.com/news/city/2025/12/03/portlands-housing-authority-sits-on-955-empty-apartments/ |
| `wweek-2025-12-10-how-can-955-units-sit-empty.html` | https://www.wweek.com/news/2025/12/10/how-can-955-home-forward-units-sit-empty-when-7500-people-are-sleeping-outside/ |
| `wweek-2026-02-17-185-days-to-fill.html` | https://www.wweek.com/news/2026/02/17/it-takes-home-forward-185-days-on-average-to-fill-an-apartment-at-one-of-its-buildings/ |
| `wweek-2026-02-24-portfolio-financial-distress.html` | https://www.wweek.com/news/2026/02/24/home-forwards-real-estate-portfolio-is-fast-approaching-financial-distress/ |
| `wweek-2026-03-11-public-pressure.html` | https://www.wweek.com/news/2026/03/11/public-pressure-on-home-forward-ramps-up/ |
| `wweek-2026-03-25-officials-brief-board.html` | https://www.wweek.com/news/city/2026/03/25/home-forward-officials-brief-board-on-agencys-struggles/ |
| `wweek-2026-04-14-ceo-travel.html` | https://www.wweek.com/news/2026/04/14/while-home-forward-struggled-its-ceo-spent-more-than-100000-on-taxpayer-funded-travel-over-three-years/ |
| `wweek-2026-04-28-ceo-will-resign.html` | https://www.wweek.com/news/city/2026/04/28/embattled-home-forward-ceo-will-resign/ |
| `wweek-2026-05-06-whats-next-for-home-forward.html` | https://www.wweek.com/news/2026/05/06/whats-next-for-home-forward/ |
| `wweek-2026-05-18-interim-leader.html` | https://www.wweek.com/news/city/2026/05/18/interim-leader-of-home-forward-pledges-greater-transparency-new-chapter-after-ceo-resigns/ |
| `wweek-2026-07-15-budget-shortfall-correction.html` | https://www.wweek.com/news/city/2026/07/15/home-forward-said-its-budget-shortfall-had-improved-that-was-wrong-agency-now-says/ |
| `wweek-2026-09-02-rent-portions.html` | https://www.wweek.com/news/2026/09/02/facing-budget-shortfall-home-forward-plans-to-increase-rent-portions-for-most-residents-and-voucher-holders/ |
