# Rivers to Ridges intake and integration plan — October 7, 2026

**Status:** received, inspected in full, not imported or published. Paul Gordon's October 6 reply in the existing “Rivers to Ridges ecological burns for a public Oregon fire atlas” thread supplies the partnership's combined 2017–2026 GIS and a nonspatial historical acreage workbook back to 1986. He says 2026 burned acreage is not yet included because the season is underway. This supersedes the October 3 note that the files were pending. Do not count these as a statewide permit or accomplishment inventory.

## Original evidence and method

| Original attachment | SHA-256 | What was inspected |
|---|---|---|
| `All_R2R_Rx_Fire_Data.zip` | `d169d7313220191cf41f6edba8d10ae326c286c004e6644c46dce01b86059ec1` | All eight ZIP members; DBF schema and all 588 rows; SHP/SHX headers, extents, record counts and polygon rings; projection and XML metadata. |
| `2025 Rivers to Ridges Historic Acres Burned.xlsx` | `0f19b9d61219aa8e896c02ae4d937f7a7aedd7e104e1375cd8b33951d28fb101` | Both sheets (`DATA` A1:M359 and `CHART` A1:B41), formulas and cached results, chart references, annual subtotals, dates, categories, hidden content and comments. No hidden rows, columns, sheets, or comments. |

Keep the originals private and unchanged. This research note omits direct phone numbers, personal contact fields, and the workbook's original detailed row text except for findings necessary to explain reconciliation. The attachments have not been placed in Git or build inputs. Record publication permission/attribution and any sensitive-site review separately from technical access.

## What the files actually contain

The shapefile holds **588 polygon rows**, not 588 distinct completed burns. Its DBF was last updated October 6. It has 343 distinct exact geometry byte sequences, with many repeated polygons across years; that can represent annual re-permitting or repeated work and must not be globally deduplicated. `Map_ID` has only 87 distinct values, including 63 zeros, so it is not a safe primary key. Within-year exact duplicates also occur, especially in 2019. There are 540 one-part, 41 two-part, five three-part and two four-part polygons; eight rings are degenerate slivers. Preserve a source-row ordinal and geometry/attribute hash for source identity, and request a stable unit identifier if one exists.

| GIS `Rx_Year` | Rows | `Unit_Acres` sum | Positive `Acres_Burn` rows / raw sum | Reading |
|---:|---:|---:|---:|---|
| 2017 | 45 | 1,045.63 | 0 / 0 | Burn-acre field not populated; workbook reports 346 acres. |
| 2018 | 42 | 766.72 | 2 / 22.47 | Workbook reports 702 acres; incomplete accomplishment field. |
| 2019 | 58 | 1,878.99 | 0 / 0 | Many within-year duplicate shapes; workbook annual row is zero. |
| 2020 | 0 | — | — | No GIS rows; workbook annual row is zero. |
| 2021 | 53 | 1,377.78 | 0 / 0 | Workbook reports 58 acres. |
| 2022 | 73 | 1,875.50 | 0 / 0 | Workbook reports 517 acres. |
| 2023 | 75 | 1,483.97 | 27 / 473.00 | Workbook reports 479.30 acres; reconciliation required. |
| 2024 | 79 | 1,455.35 | 14 / 178.45 | Workbook reports 204.99; GIS sum includes an exact duplicate 11.18-acre value. |
| 2025 | 82 | 1,381.76 | 14 / 155.62 | Matches the workbook's 15 dated entries in acres, but two dates can refer to one GIS feature. |
| 2026 | 74 | 1,412.25 | 1 / 3.00 | Conflicts with the note that 2026 burned acreage is not yet included; hold accomplishment claim. |
| 2029 | 6 | 38.70 | 0 / 0 | Future year; hold pending explanation. |

One additional GIS row has year zero and blank/zero attributes. All 588 `Acres_Burn` cells are numeric, but zeros often mean **not populated**, not “did not burn.” `Unit_Acres` is unit/permit area, not actual area burned. `Shape__Are` agrees with raw polygon area in square feet, yet several polygons disagree materially with `Unit_Acres`. The clearest outlier is the 2025 Alvadore Road feature: 85 `Unit_Acres`, 64 `Acres_Burn`, and about **3,504 polygon acres**. Hold that boundary from the public map until corrected. Nine rows have `Acres_Burn` slightly above `Unit_Acres`; preserve both source values and flag them, without adjusting one to match the other.

The `.prj` and embedded XML projection identify **NAD83 HARN Oregon South StatePlane, international feet (EPSG:2914)**. The XML also contains an obsolete/inconsistent EPSG:26910 reference and a 2018 title; its extent does not match the SHP's native coordinates. Treat the actual `.prj` as the leading candidate, verify known sites after a standards-based transform to WGS84, and ask the custodian to confirm the export CRS. The `Lat_Y_Dec_`/`Long_X_Dec` fields are not usable decimal coordinates. Source geometry represents unit boundaries, not measured burned footprints. Its location accuracy and any sensitive-unit restrictions are not documented.

The DBF has no observed burn-date field. `Ignition_C` has Yes/No/blank values without a supplied definition and is not proof of accomplishment. `Permittee_` and `Permitted_` are blank. `Fire_Distr` is sparse. The contact/burn-boss/public-engagement fields include names and phone numbers; do not expose them through public records, raw-attribute APIs, exports, search, or source download. Use a strict public allowlist rather than storing the whole DBF in `fire.records.attributes`.

The workbook has annual subtotals for every year **1986–2025**. Its detailed acreage and annual subtotals reconcile to **6,358.11 acres** (`DATA!B359`), and the `CHART` sheet uses those annual rows. The workbook includes at least three expressly wildfire-labeled entries—119 acres in 2013, 40 in 2017, and 17.5 in 2023—inside the overall ledger. Therefore **6,358.11 must not be described as a prescribed-burn total**. Ask what the ledger is intended to include and classify those rows before a public aggregate. The “Number of Units” annual field is not consistently the number of detailed entries, unique polygons, or ignitions. Dates are mostly year-only in older rows; never invent a day. A zero annual row describes this partnership's ledger, not all Lane County fire.

The 2025 example demonstrates the correct model. `DATA!D344:F358` contains 15 dated burn entries totaling **155.62 acres** (`DATA!D359`). The GIS has 14 positive-acre rows with the same total. Alvadore Road appears twice in the workbook (55 acres September 16 and nine September 20) but once in the GIS (64 reported burned acres). Keep two accomplishment events linked to one unit **only after confirming the ID/name crosswalk**. Parenthetical `#` identifiers in the workbook are helpful candidates, not a universally reliable join key.

## What this changes for the public atlas

### Editorial value for the larger fire story

The best contribution is **an example of how a fire decision becomes a dated event**, not another statewide acreage headline. The 2025 ledger's 15 dated entries and 14 positive-acre GIS rows offer a concrete, checkable way to show that a mapped unit, a burn date, and reported burned acres are different things. A single unit can have more than one burn date. Once the unit crosswalk and geometry are verified, a compact unit map plus event timeline and two explicitly labeled acreage bars would teach this more clearly than a layer of hundreds of undifferentiated polygons. Do not use the Alvadore polygon as the map example until its boundary is corrected.

The historical ledger can support a **40-year small-multiple or annual bar chart** of this partnership's reported fire activity, with the three expressly wildfire-labeled entries separately coded and the definition confirmed by Paul. Its large year-to-year swings (for example 702 reported acres in 2018, zero ledger acres in 2019 and 2020, and 517 in 2022) raise the reader's “why doesn't more happen every year?” question. They do not answer it: the files contain no weather, staffing, funding, target, or cancellation history. Place such a chart inside the chapter about turning plans into work, paired with a sourced explanation from separate records. Do not imply a statewide trend or infer a cause from the bars.

The workbook has **135 exact-date entries**, all from 2016–2025; 45 are in September, 87 in October, and three in July. A calendar strip can show when **this partnership's documented entries** occurred, alongside a plain explanation that missing dates before 2016 prevent a comparable long-term seasonal analysis. It cannot by itself establish a safe “burn window,” smoke impact, or a statewide seasonal pattern. Add weather/permit constraints only from independent evidence.

The presence of explicitly wildfire-labeled entries in a restoration-burn ledger is also a useful editorial lead: planned units and wildfires can intersect. Investigate one such entry against incident and project records before telling it as a case. The ledger alone cannot show ecological effects, whether the planned burn was replaced, or whether prior work changed fire behavior. The partnership's site names can guide a separate investigation of ecological objectives beyond forest fuels, but names alone do not establish habitat type or purpose.

**Recommendation:** make the 2025 map-and-timeline example the first public use after verification; keep the annual and seasonal charts as secondary evidence-led visuals. Do not put the raw 6,358.11-acre figure or a “percent completed” graphic in the hero. The files add a missing **delivery** chapter to the Oregon story; they do not yet supply effectiveness, smoke, or cost evidence.

1. **Immediately improve the sourcebook and coverage display:** say that R2R files were received and inspected, with 2017–2026 mapped unit records and a 1986–2025 partnership ledger; say public map publication is pending reconciliation. Show the actual file vintage and known limits.
2. **Build a separate permitted-unit layer** for quality-checked GIS polygons. Its legend must say “mapped unit / permit-season boundary,” never “acres burned.” Preserve annual repeats and original `Rx_Year`. Hold the 2029 rows, year-zero row, Alvadore Road outlier, invalid geometries, and any sensitive or unverified site until reviewed. Do not render private contact fields.
3. **Build a separate accomplishment table** from workbook detail rows, preserving exact date or year precision, partner/program, reported acres, original row locator and source version. Classify explicit wildfire-outcome entries separately. Zero GIS burned acres cannot override positive workbook evidence.
4. **Create verified links** between workbook accomplishments and GIS units using year + stable identifier (if provided) + site/subunit + steward-confirmed exceptions. Keep unresolved matches as candidates, without public pins. Multiple dates may link to one unit, and one unit may recur over years.
5. **Tell one strong local story:** a Lane County ecological-burn sequence that visibly distinguishes unit authorized, date actually burned, area reported burned, and what the records do not explain about purpose or outcomes. Ask for one existing plan/monitoring example only after selecting a reliable, publication-cleared unit. This is more useful than a large map of unlabeled permit polygons.
6. **After October 31**, ingest a new immutable 2026 version with actual burned-unit dates/acreage if the custodian sends it; preserve the pre-update snapshot and never infer completion from a missing planning row.

## Technical path in the existing application

- Make a **local file importer**, reusing `fire.sources`, `fire.import_runs`, `fire.records`, the existing spatial intersection/normalization logic, and complete-run publication. Do not route these static attachments through the ArcGIS-fetch path. Archive checksums, row counts, projection decision, parse warnings, and rejected rows in run metadata. A failed parse must leave the previous active run untouched.
- Parse SHP/DBF with a vetted library; verify row alignment and polygon validity. Transform EPSG:2914 to EPSG:4326 with PROJ/GDAL, compare at least three recognizable sites with the steward's map, then test Oregon intersection and recompute area with an appropriate equal-area method. Do not use DBF “decimal” coordinate fields.
- Give `r2r-units` and `r2r-accomplishments` distinct source IDs and record kinds (`planning-unit`/`permit` versus `accomplishment`). Use file checksum + row ordinal or a custodian-supplied stable key for native identity; never `Map_ID` alone. Preserve source versions and year-specific repeats.
- Use an explicit privacy allowlist before any database insert, including held rows and rejection logs. `fire.rejections.attributes` currently stores raw attributes in the generic ingestion path, so this importer must sanitize those too. Store originals privately outside deployment inputs. Do not expose raw partner contact fields through record detail, CSV, or project APIs.
- Produce a validation report: counts by year, duplicate and outlier lists, 2025 15-entry/14-polygon reconciliation, 2023–2024 discrepancies, wildfire-labeled workbook rows, unknown dates, and held geometries. Review it with the custodian before switching a source's `active_run` to public.
- Add source-specific map and chart copy with definitions. No source-specific count should be silently summed with ODF, FACTS, BLM, or the PNW tracker because overlapping activities may exist.

Focused checks: all 588 GIS rows and 40 annual workbook rows accounted for; no Washington-only geometry; correct WGS84 positions; Alvadore Road held; year 2029 held; no blank date converted to a day; 2025 55+9 linked without erasing either event; workbook wildfire entries excluded from prescribed-fire totals; no personal contacts in HTML, JSON, CSV, logs or error records; complete-run rollback works; map legend and mobile detail clearly distinguish planned units from actual burning.

## Small clarification to Paul, after preparing a sample reconciliation

The existing thread already covers the original request and the post-season 2026 update. Do not send another broad packet request. A short note could thank him and ask just:

1. Is `Map_ID` unique only within a year's map, or is there another stable unit key/crosswalk? What do the zero `Acres_Burn` values and `Ignition_C` mean, and does the 2026 three-acre entry represent a partial accomplishment despite the email's note?
2. Can he confirm the shapefile's Oregon South StatePlane HARN international-feet projection, explain the six 2029 rows, and point us to a corrected Alvadore Road boundary (85 unit acres versus roughly 3,504 polygon acres)?
3. Does the historic acreage ledger intentionally include wildfire-burned units, and should the 2023/2024 workbook or GIS be treated as authoritative for actual burned acreage? Is there a practical restriction on publishing generalized unit boundaries with City/R2R attribution?

Send a compact example table, not the whole audit; give him an easy option to answer only what he knows. Wait for the already-promised end-of-season 2026 update rather than asking for it again now.
