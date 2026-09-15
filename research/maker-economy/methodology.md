# Definitions, measurement rules, and reproducibility

**Version:** September 15, 2026. This appendix defines the study, rather than claiming an official maker classification exists.

## 1. Units and boundaries

A **maker** directly creates, materially transforms, custom-fabricates, or creatively repairs physical objects. Eligible activity includes physical visual art, craft, furniture, ceramics, textiles, jewelry, printmaking, instruments, hardware prototypes, and creative repair. Designing a physical product qualifies when connected to a documented production project. General software, digital services, food/drink, ordinary resale, routine building maintenance, and large industrial production are adjacent or excluded from the core maker lens.

An individual may participate without selling anything. Keep these measures separate:

- **Active maker:** a unique person who performed eligible activity during the defined year; include paid and unpaid participants, labeled separately.
- **Income-earning maker:** received payment for eligible work during that year. Revenue is not evidence of profit or full-time livelihood.
- **Employment:** payroll jobs, not unique people. Annual-average jobs are not cumulative people employed during the year or full-time equivalents.
- **Business/establishment:** the statistical unit in its source, not an owner or a person. Multiple businesses can belong to one person; multiple people can operate a business.
- **Space membership:** a relationship with a facility. Memberships, active users, tenants, staff, visits, and course registrations are different units.
- **Receipts/revenue:** business inflow before expenses. **Payroll:** employee compensation captured by the source. **Profit/owner earnings:** a separately defined residual. **Value added:** output less intermediate purchases; it is not obtained by summing local transactions.

City totals require city-boundary work locations. This release contains no citywide maker estimate. Public commercial addresses are recorded as published, not GIS-certified; a home-based business remains geographically unverified without exposing its address. County FIPS 41051 is Multnomah County. The regional WESTAF report covers three named Oregon counties, not the wider interstate metropolitan area.

## 2. Industry and occupation inclusion rules

Use NAICS industry codes to describe establishments and SOC occupation codes to describe workers. Never add the two views. In particular, a designer working for a noncreative employer can appear in an occupation measure but not a creative-industry measure; a bookkeeper at a creative employer can do the reverse.

The machine-readable [classification list](classifications.json) fixes every code in the payroll and nonemployer extracts. These are selected windows into activity, not a comprehensive creative-sector taxonomy.

| Industry group | Codes used | Treatment |
|---|---|---|
| Selected physical production | 327110, 337122, 337212, 339910, 339992 | Pottery/ceramics/plumbing fixtures; wood household furniture; architectural woodwork; jewelry/silverware; musical instruments. Retain industrial/non-maker contamination explicitly. |
| Additional mixed production | 332323, 337121, 323113, 315, 316, 811420 | Ornamental metal; upholstered furniture; screen printing; apparel; leather; furniture repair. Include establishment-level makers only after confirming activity. |
| Independent creative activity | 711510; NES publishes 7115 | Includes writers and performers as well as physical artists. No assumed maker fraction. |
| Creative services | 541420, 541430, 541490; NES 5414 and 54192 | Separate context for industrial/graphic/other design and photography. Physical-output verification required for maker inclusion. |
| Supporting infrastructure | 611610; individually identified workshops, markets, suppliers | Fine arts education includes non-maker instruction. Makerspaces have no single reliable industry code; classify their activity and members separately. |

NES uses broader published categories: clay/refractory manufacturing (3271) cannot be equated with the narrower payroll ceramics category (327110); furniture (337) cannot be equated with wood household furniture (337122). Do not apportion broader categories using an invented fraction. All NES rows in the extract are mutually non-nested; alternative parent rows remain outside the calculation.

For future occupation-based extraction, use the following fixed screening rules under the [2018 SOC definitions](https://www.bls.gov/soc/2018/soc_2018_definitions.pdf):

| SOC | Occupation | Maker treatment |
|---|---|---|
| 27-1012 | Craft artists | Core candidate; verify work geography and activity period |
| 27-1013 | Fine artists, including painters, sculptors, and illustrators | Include physical work; separate digital-only illustration |
| 27-1021, 27-1022 | Commercial/industrial designers; fashion designers | Include documented physical-product production; otherwise creative context |
| 51-7011, 51-7021 | Cabinetmakers/bench carpenters; furniture finishers | Include small-scale/custom work; production-line employment is adjacent |
| 51-6052, 51-6093 | Tailors/dressmakers/custom sewers; upholsterers | Include eligible making and creative repair; retain industrial boundary |
| 51-9071, 51-9195 | Jewelers/precious stone and metal workers; molders/shapers/casters except metal/plastic | Activity verification required; occupational labels are broader than art/craft |
| 51-4121, 51-4041 | Welders and related workers; machinists | Include only verified artistic/custom fabrication or prototype work; never import the whole trade |
| Other arts/design/media, teaching, technical or support occupations | Including digital design, music, performance, and management | Broader context or infrastructure unless physical making is independently verified |

No new local SOC headcount is asserted in this release. The published WESTAF occupation total remains attributed to its own definition and vendor vintage. Its underlying person/job records are not available here for reclassification or deduplication.

## 3. Source coverage and arithmetic

### Payroll: BLS QCEW

Use annual Multnomah files for 2019, 2023, and 2025; filter ownership 5 (private), size 0 (all sizes), annual period A, and the exact codes in the classification list. The article compares 2019 with the latest complete calendar year retrieved, 2025. Selected-code comparisons bridge 2017 and 2022 NAICS; do not extend them to changed codes without a concordance. Current BLS industry titles and version guidance are the classification reference. [BLS code guidance](https://www.bls.gov/cew/classifications/industry/industry-titles.htm)

Rows carrying disclosure flags keep published establishment counts but blank employment, wages, and location quotients. The raw suppression zeros are never interpreted as economic zeros. Extracted data are subject to subsequent source revisions; hashes pin this release's vintage.

- Job change = `(jobs_2025 / jobs_2019 - 1) × 100`.
- Industry share = `industry_jobs / all_private_jobs`, using the same county, year, and ownership.
- Relative annual pay = `industry_average_pay / all_private_average_pay` for the same year.
- Location quotients are BLS-published measures, not recalculated here. They compare local and national employment concentration on BLS's denominator basis; do not substitute our private-employment-share denominator.

Pay is nominal. No inflation-adjusted wage-growth claim is made. Average pay can reflect part-time hours and occupational mix. QCEW coverage excludes proprietors and unincorporated self-employment. [Coverage](https://www.bls.gov/cew/overview.htm)

### Nonemployers: Census NES

Use the 2023 county ZIP, `nonemp23co.txt`, ST 41 / CTY 051. Convert RCPTOT from thousands of dollars to dollars. Preserve establishment, receipts, and noise flags; blank suppressed values. The selected published receipts have low-noise flag G, meaning the disclosure procedure changed the value by less than 2%; that is not a confidence interval for total measurement error. [Record layout](https://www2.census.gov/programs-surveys/nonemployer-statistics/technical-documentation/record-layouts/county-record-layout/county_record_layout_2017.txt)

NES counts qualifying tax-reporting businesses without paid employees. County geography generally follows the administrative business mailing address, which can differ from the production location. Nonconstruction businesses below $1,000 annual receipts are excluded, as are businesses above industry-specific maximum receipts thresholds. The data miss noncommercial hobby activity and does not identify all owners as separate people. Mean receipts divide total category receipts by establishments; they do not estimate median earnings or livelihood adequacy. The 2022 methodological change prevents a casual 2019–2023 trend comparison. This release uses a 2023 cross-section, the latest listed release located in the NES catalog. [NES methodology](https://www.census.gov/programs-surveys/nonemployer-statistics/technical-documentation/methodology.html)

### Existing studies and operator figures

[Observations](data/observations.csv) carry original report pages or webpage section locators. PDF tables and methodology pages for the Portland AEP6 and WESTAF reports were visually inspected. Preserve the original study's expenditure, modeled-employment, and earnings terminology. The AEP6 participation fraction is a coverage warning, not a license to multiply spending by the inverse response rate. Do not use a county impact model to assert city tax receipts or a city GDP share.

Website counters are operator statements with unspecified periods unless otherwise stated. A 2026 retrieval date is not a 2026 membership census. Prices describe offered access terms, not realized revenue or a comparable bundle of services. Do not multiply advertised dues by undated membership counts.

## 4. Sensitivity and inference limits

The [generated sensitivity table](data/derived/definition-sensitivity.csv) demonstrates classification effects. Five selected manufacturing categories produce 365 covered payroll jobs in Multnomah County in 2025; adding architectural metal raises the count to 635; adding independent artists/writers/performers raises it to 852. The baskets overlap and contain non-maker jobs while missing many makers. **They are neither population estimates nor lower and upper bounds.** They are not added together.

The public evidence supports descriptive findings about classified activity. It cannot attribute a change to a makerspace or policy. Client destinations are evidence of geographic reach, not quantified exports. National averages, state GDP shares, or observed space members are not used to allocate a city total.

A future city estimate needs a defined target population, a deduplicated frame, known recruitment and response patterns, coverage assessment, and a defensible estimator. Where those conditions fail, publish respondent statistics and observed verified counts only. Clearly distinguish sampling intervals from scenario assumptions and missing-population uncertainty.

## 5. Reproduction and quality checks

See [README](README.md) for commands. Committed CSVs are the inputs to offline calculations; raw sources live under gitignored working storage. Source URLs, hashes, and fetch failures are recorded in the registry and lockfile. Online restoration cannot guarantee a past HTML page is still available: changed content is kept as a candidate and does not silently replace pinned evidence.

The checks validate source IDs, row uniqueness, suppression handling, geographic codes, AEP6 arithmetic, non-nested sensitivity baskets, local links, and generated-output consistency. They do not certify an operator's claims or turn nonrepresentative evidence into a census.

Manual review checks units, dates, industry boundaries, study geography, causal wording, and privacy. Only public commercial addresses enter the inventory; no private survey data or contact-form email addresses are included.
