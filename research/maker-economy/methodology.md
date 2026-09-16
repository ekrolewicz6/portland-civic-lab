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

## 6. The expanded discovery register

The September 15 revision extracts **597 source listings**: 103 Portland Open Studios 2025 profiles, 172 entries on an undated Ceramic Showcase directory, 115 Gathering of the Guilds listings dated 2026, and 207 entries on Portland Saturday Market's undated craft-vendor page. The pottery directory's image paths include 2024; that does not establish a complete event-year attribution. Neither undated list is labeled a 2026 participant census.

`extract-directories.py` parses four hash-pinned HTML files using lxml. It captures names, stated media, public profile URLs, source identifiers, periods, and listing locators. It does not extract emails, phone numbers, home addresses, or point locations. The exact source unit is a listing. Joint artists, businesses, individual people, guilds, and organizational booths remain distinguishable from a headcount; the source register has not been resolved into legal entities.

The tour and specialist directories provide physical-media evidence at the listing level. The market directory is retained as **activity needs review** because it includes products outside the physical-maker boundary and often supplies no discipline text. Inclusion in this discovery file is not a claim that every record meets the definition. Searches use source media labels, not an inferred occupational classification.

For browsing, names are normalized to lowercase ASCII alphanumeric strings, with event booth suffixes removed from display names but preserved in locators. Identical normalized names are grouped provisionally. A reviewed link joins Sienna Cenere / Sienna Art Studios because the two directories point to the same artist website. This yields **589 profile groups**, not an estimate of unique people or businesses. Four repeated organizational booth records collapse to one profile. A same-name match can still be wrong; unrecognized aliases can still remain separate.

The committed [link review](data/directory-links.csv) also records holds: Amy Fields / Amy Fields Ceramics needs identity confirmation; a surname alone is not sufficient; two artists sharing a studio domain remain separate. Do not merge all identical website domains. The [raw listing extract](data/directory-listings.csv) remains available so every grouping can be inspected or reversed. A completed deduplication would additionally resolve person-to-business and business-to-worksite relationships and flag closures.

**No capture–recapture estimate is calculated.** Directory overlap is affected by discipline, event participation, web visibility, shared recruitment, geography, and different years. Those conditions undermine the assumptions behind estimating a hidden population from two lists. Small observed overlap is not evidence that an enormous unseen maker population exists.

## 7. A staged estimation model

The current public-source model produces exact counts of source records, selected administrative categories, and a fee-based scenario. It does **not** produce a citywide maker-population point estimate. Here is the estimand and route needed for a defensible next version.

### Frame-based active and paid counts

Fix one calendar year. Resolve the discovery records into separate person and business frames. Within each frame, partition by discipline, location evidence, and business stage; put unknown cases in explicit strata. Review all unusually large firms individually for revenue estimation.

For stratum `h`, let `L_h` be unique candidate entities in the frame and `p_h` be the fraction meeting **all** target conditions: eligible physical production, Portland work location, active in the reference year, and paid activity if measuring earners. With a documented simple random audit sample, estimate:

`N_frame = Σ_h L_h × p_h`.

Estimate a sampling interval for each proportion and propagate it to the frame total using the survey design. Where all selected cases respond, a design-based stratified total variance can use `Σ_h L_h² × (1 − n_h/L_h) × s_h²/n_h`, where `s_h²` is the sample variance of the eligibility indicator. Small samples and proportions near zero or one need appropriate bounded intervals. Do not call nonresponse an ineligible observation. Report a sensitivity interval treating unresolved sampled cases as all eligible versus none eligible, alongside any justified response adjustment. This sensitivity is not a confidence interval.

**These quantities have not been measured here.** Do not insert guessed 50% eligibility or a guessed Portland share into a published total. A random audit of directory entries supports the frame only. It does not measure makers absent from every source.

### Coverage beyond the frame

Recruit independent of prominent spaces: supplier customers, repair networks, neighborhood organizations, and multilingual community groups. Record recruitment channel and whether the respondent was already in the frame. These convenience channels reveal omissions, but their discovery rate is not automatically a population inclusion probability. A representative coverage estimate requires an independent probability-based household or business sampling frame, or another validated design.

Report the observed, verified frame count until such a design exists. If a future independent study supports coverage `c`, a sensitivity calculation `N_total = N_frame / c` must carry uncertainty in both terms and demonstrate comparable target definitions. No value for `c` is assigned in this release.

### Revenue, earnings, and local retention

Estimate revenue by business—not by multiplying a person count by mean sales. Under a probability sample of the business frame, a design-weighted total can use `Σ_i revenue_i / inclusion_probability_i`; handle nonresponse and certainty-selected large firms explicitly. If only voluntary revenue ranges are available, report the range distribution first. Any midpoint calculation must show lower/upper band sensitivity; open-ended bands cannot receive an arbitrary upper bound.

Keep separate totals for gross receipts, wages, owner earnings, and purchases. For a sampled project, record customer geography, final payment, production locations, labor, and purchased inputs. A customer outside the city establishes outside demand; local retention requires the expense and labor records. Payments between Portland producers are links in the account, not extra final demand. No new regional multiplier is applied.

### Administrative cross-checks

The article's nine-category NES basket contains 542 businesses and $25,663,000 in receipts in Multnomah County in 2023. Codes are 315, 316, 321, 3231, 3271, 3272, 332, 337, and 81142. They are disjoint published categories. Adding 3399 changes that basket to 763 businesses / $45,426,000. Both contain out-of-scope activity and miss relevant makers; they are sensitivity cases, not maker bounds. County geographies must not substitute for Portland's parts in any county.

The 2018 Urban Manufacturing Alliance study describes access to city/district QCEW through Portland's Bureau of Planning and Sustainability. Request that route before allocating county employment using population shares. Employer industry data measure jobs at establishments, while resident occupation data answer who lives here. Do not add them.

## 8. Figure and scenario provenance

- **Directory chart and explorer:** `data/directory-listings.csv`, `data/directory-links.csv`; grouped by `build-makers.ts`. Counts refer to the specific archived page extracts, not complete network membership.
- **Receipts:** `data/nonemployers.csv`; sum the nine codes above. Charts display rounded millions; underlying dollar values stay exact. Mean furniture receipts = $4,457,000 / 101 = $44,128.71.
- **Payroll chart:** `data/derived/employment-comparison.csv`; same county, private ownership, and annual-average unit in 2019 and 2025. All-private comparison uses code 10. Chart labels abbreviate some categories; exact labels and codes remain in the data.
- **Historical revenue distribution:** `data/historical-survey.csv`; 84 revenue respondents in the 2015 Portland Made Collective survey, report page 6. 26 + 15 = 41 respondents in the two bands up to $50,000. The six bands sum to 84. The report's separate large-firm addition is $216,405,000 / $316,094,000 = 68.462%; it is not our contemporary impact estimate. Pages 6, 11, and 17 were visually reviewed.
- **Historical workplace percentages:** report pages 16–17; respondent average share of work by location, not share of makers or firms. No inference that today's home-work share is 41%.
- **Workspace offers:** named operator pages, September 15 review; different bundles and contract commitments. No dues-times-members revenue calculation.
- **Ceramic Showcase scenario:** OPA 2026 rules, individual booth, 5 × 10 feet, $275 booth + $20 registration. Marginal commission rates are 17%, 14%, 12%, 10%, 5%, with thresholds $2,000, $3,000, $4,000, $5,500. At $3,500, commission is $540. Sales, entered production costs, other costs, and hours are user assumptions. Starting costs ($1,050 / $250) and hours (80) are illustrative, not estimated typical maker inputs. The remaining $1,365 is before uncounted overhead, dues, and taxes; dividing by entered hours does not turn it into a wage.

All figure inputs are generated from committed extracts. `build-makers.ts --check` detects stale outputs. Commission tests cover each tier boundary, the source's worked example, and negative remainders. The page renders data access, units, dates, geography, and limitations adjacent to the relevant visual.
