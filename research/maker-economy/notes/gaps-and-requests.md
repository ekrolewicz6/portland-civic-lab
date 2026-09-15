# Evidence gaps, source tensions, and agency inquiries

*September 15, 2026. All inquiries below are drafts; none has been sent. Public research and preparation of these drafts complete phase one. Interviews and survey fieldwork are a later phase.*

## 1. Public evidence versus community evidence

| Research question | Public evidence obtained | What it establishes | What is missing; route to improve |
|---|---|---|---|
| Who tracks the sector? | Auditor mandate/index/arts audit; City Arts page; Our Creative Future; Prosper industry page; OED catalog | Public oversight, planning, cluster support, and labor-data functions are distributed | Confirm unpublished recurring series and responsibility with agencies |
| Broader creative scale? | WESTAF tri-county 2022 report | Published regional occupation/jobs and industry/earnings benchmarks | City subset, current vendor methodology, and producer-level classification |
| Nonprofit contribution? | Original Portland AEP6 summary and county full report | Participating nonprofit expenditure and modeled impact, with study limitations | Maker coverage; representativeness; city-specific model boundaries |
| Payroll work in relevant production? | 2019, 2023, 2025 county QCEW bulk files | Selected industries, jobs, payroll, establishment counts, concentration | City extraction; self-employment; physical-maker share of mixed categories |
| Businesses without employees? | 2023 Census NES county bulk file and disclosure layout | Establishments and gross receipts in published categories | Unique people, profit, informal activity, city geography, maker subcategories |
| What do local spaces produce? | Public portfolios, services, classes, market archives | Specific practices, offered capacity, some delivered commissions | Production volume, completed classes, active users, actual transactions |
| Economic connections? | Commission destinations; operator description of local material purchases | Examples of outside demand and local supply relationships | Values, retained local income, origin of materials, network prevalence |
| Livelihoods? | Payroll annual averages; nonemployer receipts | Partial financial context | Owner profit, hours, income dependence, seasonality; maker questionnaire |
| Ability to remain? | Published access terms | Illustrative access cost and conditions | Rent burden, lease security, closures/moves, missing facilities; operator/maker interviews |
| Total maker headcount? | Fragmented venue and business evidence | No defensible total in phase one | Deduplicated frame and coverage analysis, including unaffiliated makers |

## 2. Prioritized unresolved questions

| Priority | Question | Next source or activity | Why it changes the conclusion |
|---|---|---|---|
| 1 | Can OED provide city-boundary aggregate payroll data for the exact selected codes? | OED inquiry below | Separates Portland production from county context |
| 1 | Is there an existing creative-economy tracking program or newer city-level study? | Auditor, City Arts, Prosper, regional planners | Directly resolves the institutional part of Martin's question |
| 1 | How many unique active makers are outside shared-space directories? | Pilot, supplier/guild/community recruitment | Determines whether any membership-based expansion is untenable |
| 1 | How many makers earn positive and sustained income, and how much of their livelihood depends on it? | Maker survey and project interviews | Distinguishes gross activity from livelihood viability |
| 2 | What work and income actually depend on shared facilities? | Operator records plus maker alternatives | Tests the role of shared infrastructure without asserting causation |
| 2 | What share of customer payments comes from outside Portland and remains with local labor/suppliers? | Sample completed-project accounts | Gives substance to the export and local-spending mechanisms |
| 2 | What do current undated membership counters describe? | Past Lives and ADX factual confirmation | Prevents false current headcounts and revenue estimates |
| 2 | What do departing/closed makers reveal about affordability and survival? | Former-participant recruitment | Reduces survivorship bias |
| 3 | Can economic changes be attributed to a specific policy or workspace intervention? | Designed comparison with baseline and follow-up | Goes beyond descriptive reporting; outside phase-one inference |

## 3. Source tensions and retrieval limitations

### RACC summary units

The RACC overview identifies 4,589,494 as Portland audience-spending dollars. The original Portland AEP6 PDF identifies that number as attendances and gives audience spending of $167,314,696. The page also describes the Multnomah figures in a way that warrants checking against its original report. This corpus uses original Portland table values and does not propagate the webpage's mislabeled unit. No correction request has been sent. Source IDs: `racc-web`, `aep6-portland`, `aep6-multnomah`.

### AEP6 city label and county model

The Portland summary's methods specify a Multnomah County input-output model and county-based local/nonlocal attendees. “City of Portland study” is not sufficient grounds to call all modeled jobs or taxes city-only. City and county study values are not additive. This report includes no assumed maker multiplier.

### Past Lives retail and membership timing

The homepage and membership page differ about retail availability. Membership, studio, and commission counters do not have an explicit period. Membership pricing has minimum commitments and separate orientation costs. Current operation, enrollment, and revenue cannot be inferred by multiplying these fields.

### BEA continuity

The BEA program page states regular production has ended, with a February 2026 notice, while still linking the April 2025 release for 2023. The linked release page carries a superseded-data banner. The article uses BEA as a contextual source and reports the program-status notice; it does not use a supposedly current Oregon dollar total. Confirm the final data vintage before quantitative reuse.

### Access and reproducibility

- The Census API returned an HTML “Missing Key” page despite HTTP 200. No numeric value was extracted from it. The official county bulk ZIP successfully provided the actual NES evidence. CBP's tested API route also returned the key page; no CBP estimate is used.
- Direct BLS documentation downloads returned 403 responses. Coverage, availability, and classification pages were readable through web retrieval; the numeric QCEW bulk CSVs were successfully downloaded and hash-pinned. Documentation fetch failures remain explicit in the lockfile.
- The first attempted ADX studio URL returned 404; the currently linked `art-studios-portland` page was retrieved and used.
- The original audit PDF endpoint returned 404 to direct download. The full audit HTML page was retrieved instead and is the cited audit evidence.
- A direct OEWS metro-page attempt failed. This release asserts no newly extracted occupation headcount; it uses the attributed WESTAF regional occupation snapshot and identifies OED's catalog for follow-up.
- Raw source HTML/PDF/ZIP files remain gitignored. A hash proves which saved bytes were used, but cannot reconstruct a removed webpage. The archive script refuses silent replacement when a restored source has changed.

## 4. Agency inquiry drafts

Ask for existing aggregate records and definitions, not private taxpayer files or a new custom analysis presented as an existing record. These drafts can be adapted into records requests if ordinary inquiry does not locate the evidence.

### A. City Auditor / Audit Services

**Subject:** Existing measurement of Portland's creative and maker economy

Portland Civic Lab is preparing a public-source examination of Portland's creative economy, with particular attention to physical art, craft, fabrication, and shared workshops. A community question asks whether the City Auditor tracks the sector.

We reviewed the published Audit Services mandate, audit index, and March 2026 Arts Access Fund audit. These establish a performance-oversight role, but we have not identified a recurring sector-wide economic measurement series.

Does the Auditor's Office maintain, commission, or receive any existing creative-economy or maker-economy data, studies, inventories, or tracking reports? If so, please point us to the records and their dates, geographic coverage, definitions, and responsible office. If another city entity performs this function, a referral would be useful. We are distinguishing oversight of public arts funding from measurement of the entire sector.

**Public route:** [Audit Services](https://www.portland.gov/auditor/audit-services).

### B. Office of Arts & Culture / Our Creative Future partners

**Subject:** Creative-economy measures, definitions, and implementation records

We are examining the economic role of Portland makers within the broader creative economy. We have reviewed Our Creative Future, its 2022 WESTAF regional snapshot, and the original Portland AEP6 summary.

Please identify existing updates, underlying public tables, inventories, or implementation reports addressing the plan's economic measurement and creative-economy strategies. For each, we would appreciate the reference year, geographic boundaries, industry and occupation definitions, treatment of self-employment, and any available city-only breakdown.

Do existing records distinguish physical makers, independent businesses, home studios, shared workspaces, and nonprofit arts organizations? Is there an existing inventory of affordable creative production space, including closures or relocations? Please identify the data owner and update schedule. We are seeking existing records, not a newly commissioned study.

**Public routes:** [Office of Arts & Culture](https://www.portland.gov/arts) and [Our Creative Future](https://ourcreativefuture.org/).

### C. RACC / AEP6 research team

**Subject:** Confirming Portland AEP6 units and geographic interpretation

We are using the original Portland AEP6 two-page summary. Its first page reports 4,589,494 attendances and $167,314,696 in audience expenditures. RACC's overview appears to label the attendance figure as dollars. Can you confirm the correct interpretation and whether an updated overview or errata exists?

The methods page specifies a Multnomah County input-output model and defines local attendees by county residence. Please clarify which modeled outcomes should be described as county effects, how the Portland and Multnomah studies overlap, and whether a full Portland methods report is available.

We would also welcome existing participation and eligibility documentation explaining coverage of maker organizations, independent artists, and for-profit businesses. We are not seeking private respondent financial records.

**Public route:** [RACC AEP6](https://racc.org/advocacy-community-engagement/aep6/).

### D. Oregon Employment Department

**Subject:** Existing Portland city aggregates for selected creative-production industries

We extracted private-sector Multnomah County QCEW data for 2019, 2023, and 2025. We would like to determine whether existing tabulations can isolate workplaces inside Portland city boundaries.

Our selected codes are NAICS 327110, 337122, 337212, 339910, 339992, 332323, 337121, 323113, 315, 316, 811420, 711510, 541420, 541430, 541490, and 611610. We seek annual-average establishments and employment, annual payroll, average annual pay, suppression flags, and a matching private-sector total. Please identify geographic methodology, revisions, and code changes between 2017 and 2022 NAICS.

Which existing sources best measure relevant self-employment and craft occupations at city, county, or tri-county scale? Please distinguish historical estimates from projections and explain geographic limitations. Aggregate or suppressed tables are sufficient; no establishment-identifying records are requested.

**Public route:** [OED data catalog](https://www.qualityinfo.org/data).

### E. Prosper Portland / city business-data staff

**Subject:** Existing maker-business and creative-workspace evidence

We are researching physical making within Portland's broader creative economy. Your athletic/outdoor cluster overlaps with apparel, product design, and small production, but includes activity beyond our maker definition.

Please identify existing cluster studies, small-manufacturer or maker inventories, creative-workspace records, and aggregated business outcomes. We would like to distinguish production inside city boundaries from headquarters employment and regional brand affiliation. Please include definitions, source years, update schedules, self-employment coverage, and any published closure or relocation information.

If the Revenue Division holds existing non-identifying aggregates useful to this question, please identify available tables and their coverage, including tax exemptions, registration versus active operation, allocation to Portland, and confidentiality limits. We do not request individual tax returns or private business records.

**Public route:** [Prosper Portland industry work](https://prosperportland.us/our-work/athletic-outdoor-industry/).

## 5. Editorial conclusions that should remain off limits

Do not publish a citywide maker total, the number earning a living, total maker profit, exports, fiscal return, or attributed jobs created until supporting evidence exists. Do not convert community survey response volume into coverage of the city. Do not describe this public-source phase as a completed community census.
