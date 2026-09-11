# Oregon fire map: data inventory

Compiled September 10, 2026 for the Oregon fire map project (Edan Krolewicz, Jenna Knobloch, Dominic Kuklawood). Every source below was checked on that date. "Queried" means the endpoint was hit and its schema and record count read; "link only" means the page was confirmed to exist but not exercised. Machine-readable versions of the endpoints are in [endpoints.csv](endpoints.csv). Contacts are in [contacts.md](contacts.md), email drafts in [outreach-drafts.md](outreach-drafts.md).

## The short version

1. **Prescribed fire on state, private, and most federal forestland in Oregon is registered in one system: ODF's Smoke Data System (SDS).** Federal units register there too (the 2025 annual report lists Deschutes NF, Mt. Hood NF, BLM districts and Crater Lake NP by name). The registration record includes latitude and longitude, acres, burn type, a burn reason code, fuel loading, and then, after the burn, acres and tons actually burned, ignition time, fuel moistures, days since rain, and wind. In 2025 that was 2,946 registered units and 2,717 units burned across 179,230 acres. The system needs a login, and the public map only shows a rolling one-day and three-day window. **The single most valuable request is an export of the SDS registration and accomplishment tables for all years.** This is the email to write first.
2. **Two federal datasets are fully public and go back decades.** BLM's Oregon/Washington prescribed fire polygons (36,966 completed burns, with a `REASON` field and a NEPA plan ID) and the Forest Service FACTS hazardous fuel treatments (20,531 Oregon fire-treatment records, with NEPA document names and a purpose code). Between them they cover most federal burns with a stated reason. They can be pulled today.
3. **Wildfire history is well covered by public feeds.** ODF fire occurrence points 1960 to 2024 (69,744 fires with cause and timing), NIFC/IRWIN incident locations and perimeters (all agencies, refreshed every five minutes, and they include prescribed fires as a category), NWCC large fire perimeters 2000 to present, and Oregon Explorer's cleaned perimeter history through 2025. MTBS gives burn severity for fires over 1,000 acres.
4. **The "why this location" answer lives in three places**, in descending order of usefulness: the NEPA documents behind federal burns (linked by ID from FACTS and BLM records), the burn reason code and comments in ODF's SDS, and landscape-scale priority layers (ODF's 20-Year Strategy priority geographies, county CWPPs, the Forest Service Wildfire Crisis Strategy landscapes). The narrative versions come from practitioners, which is what the certified burn manager directory and the prescribed burn associations are for.
5. **Two things exist only as records requests:** the ODA Willamette Valley field burning program (grass seed residue, up to 15,000 acres a year, registered by April 1), and anything historical from ODF's SDS. Backyard and debris burning permits are issued by local fire districts and are not centralized anywhere; treat that as out of scope for a first version.

## Tier 1: prescribed fire records

### ODF Smoke Management Program (the statewide registry)

Oregon's Smoke Management Plan (OAR 629-048) requires anyone burning on forestland to register the unit with ODF and report accomplishments. ODF meteorologists issue daily burn instructions. The data is entered by ODF field offices and by federal units into the Smoke Data System.

| What | Where | Status |
|---|---|---|
| Smoke Data System (system of record) | https://apps.odf.oregon.gov/SmokeDataSystem/#/ | Login required (returned HTTP 401). Request an export. |
| Public prescribed fire map | https://experience.arcgis.com/experience/909972015b8c4bbaa4736d9fdeb55800 | Public. Shows planned and accomplished burns for today and the last three days. |
| Underlying feature service (four layers) | https://gis.odf.oregon.gov/odfags/rest/services/Fire/Fire_Smoke_Management/FeatureServer | Public, queried. Point geometry. Zero rows on September 10 because nothing was burning. |
| Daily plans, daily accomplishments, weekly registrations, weekly accomplishments (PDF) | Links on https://www.oregon.gov/odf/fire/pages/burn.aspx | Public. Same rolling window in PDF form. |
| Annual smoke management reports 2020 to 2025 | https://www.oregon.gov/odf/fire/Documents/smr2025.pdf (change the year) | Public. Statewide and district totals, intrusions, emissions. No unit-level rows. |
| Registration form (defines the record) | RegistrationSheets_Interactive.xlsx linked from the burn page | Public. See field list below. |
| Smoke Sensitive Receptor Areas | Hosted/Fire_Smoke_Sensitive_Areas feature service (see endpoints.csv) | Public. |

**Fields in the public rolling feed** (3-day accomplished layer): DistrictName, County, RegistrationNumber, TRS, Elevation, DistanceFromSSRA, Ownership, FirstName, LastName, BusinessName, SaleName, AcresPlanned, Plan_Types, TotalUnitTons, TotalTonsPlanned, TotalTonsBurned, PlannedIgnitionTime, ActualIgnitionTime, BurnType, UnitAcres, LandingAcres, LandingTons, PileAcres, PileTons, BroadcastAcres, BroadcastTons, BurnBossName.

**Fields on the registration form** (what SDS holds for every unit): date registered, district ID, ownership code (state/county/municipal, private, BLM, USFS, other federal), sale name, township/range/section, latitude, longitude, county, distance to SSRA, unit acres, cutting date, elevation, slope, burn type, burn reason, unit information, fuel species, broadcast acres, duff depth, landing acres and tons, pile acres and tons, fuel loading by size class (0 to 1/4", 1/4 to 1", 1 to 3", 3 to 9", 9 to 20", 20"+), shrub type and cover, litter type and depth, tons per acre, operator name and contact, comments. Accomplishment part: acres burned, landing/pile/broadcast tons burned, achieved rapid ignition, shrub consumption, duff fuel moisture, 1000-hour fuel moisture code, 10-hour and 100-hour fuel moisture, days since significant rain, wind speed, planned date and time, actual burn date and ignition time.

**Burn type codes:** Broadcast, Broadcast Natural, Grapple, Handpile, Landing Only, Underburn Natural, Right-of-way, Rangeland, Underburn Activity, Tractor Pile.

**Burn reason codes:** Hazard & Silviculture; Level 2 Regulation, Fee exempt; Forest Health; Hazardous Reduction; Forest Health Maintenance; Other; Silviculture; Wildlife Habitat.

**Districts in the form** include ODF districts, all Oregon national forest ranger districts, BLM districts, Crater Lake NP and Oregon Caves NM, and the Columbia Gorge Scenic Area, which is how we know federal burns are in the same registry.

**What the 2025 annual report gives us now:** 179,230 acres burned, 2,946 registered units, 3,941 ignitions, 2,717 units burned, 152,714 acres using emission reduction techniques, 2 intrusions; accomplishment by district (Coos 301 units, South Cascade 387, Southwest 237, Western Lane 267, Deschutes NF 91, Wallowa-Whitman NF 110, and so on), by ownership, by burn type, by month; and ten-year history tables. Useful for validating any export and for a first statewide chart before the export arrives.

**Privacy note:** the feed and the registration carry private landowners' names and phone numbers. Whatever we publish should show the business or agency for public units and aggregate or drop names for private ones. Say this in the request; it makes the redaction review faster.

### Forest Service (national forests)

| What | Where | Status |
|---|---|---|
| Pacific Northwest Prescribed Fire Tracker (planned units, OR and WA) | https://experience.arcgis.com/experience/55ce8bfdea4345b6a06ae81d67e7d411 | Public. |
| Underlying layer: PNW Planned Rx Polygon | https://services1.arcgis.com/gGHDlz6USftL5Pau/arcgis/rest/services/PNW_Planned_Rx_Polygon_Public/FeatureServer/1 | Public, queried. 1,117 polygons. Fields: ACTIVITY_UNIT_NAME, BURN_STATUS, NBR_UNITS_PLANNED, DATE_COMPLETED, NBR_UNITS_ACCOMPLISHED, AGENCY_NAME, DISTRICT_NAME, CONTACT_NAME, CONTACT_PHONE, CONTACT_EMAIL, COMMENTS, ACTIVITY (e.g. "Jackpot Burning - Scattered concentrations"), Season, Dateplanned. |
| FACTS Hazardous Fuel Treatments, Fire sublayer | https://apps.fs.usda.gov/arcx/rest/services/EDW/EDW_HazardousFuelsTreatments_01/MapServer/3 | Public, queried. 20,531 Oregon records. Fields include activity, treatment_type, date_completed, fiscal_year_completed, gis_acres, nepa_project_id, nepa_doc_name, purpose_code, iswui, cwpp, implementation_project, fund_code, method, equipment. |
| FACTS download (shapefile/GDB) | https://data-usfs.hub.arcgis.com/datasets/usfs::hazardous-fuel-treatment-reduction-polygon-feature-layer | Public. Large. Metadata contact SM.FS.data@usda.gov. |
| National fire occurrence and perimeters (FIRESTAT) | https://apps.fs.usda.gov/arcx/rest/services/EDW/EDW_FireOccurrenceAndPerimeter_01/MapServer | Public. |
| Forest project pages (NEPA documents) | Each forest's "Projects" page on fs.usda.gov | Public. The nepa_doc_name in FACTS is the key. PALS itself is not public. |
| Central Oregon Fire Info prescribed fire plans | https://centraloregonfire.org/prescribed-fire-smoke-plans/ | Public. Per-burn narratives with reasons; the best regional model for what we want statewide. |
| Annual R6 fire summaries 2017 to 2025 | Linked from https://www.fs.usda.gov/r06/fire/resources | Public PDFs. |

The Fire Service tracker carries a contact per unit, which is a ready-made list of the ranger district fuels staff who actually plan the burns.

### Bureau of Land Management (Oregon/Washington)

| What | Where | Status |
|---|---|---|
| BLM OR Prescribed Fire Treatments Polygon | https://services1.arcgis.com/KbxwQRRfWyEYLgp4/arcgis/rest/services/BLM_OR_Prescribed_Fire_Treatments_Polygon_Hub/FeatureServer/1 | Public, queried. 36,966 completed burns, earliest seen FY1979. Fields: TRT_NAME, PROJ_NAME, UNIT_NUM, BURN_TYPE (Broadcast Burn, Pile Burn, ...), TRT_STATUS, TRT_DATE, TRT_FY, REASON (e.g. Fuels Reduction), REASON2, INITIATIVE, PLANID (NEPA), TRT_ACRES, GIS_ACRES, CONTRACTOR, NFPORS_TRTID, BLM_ORG_CD. Updated September 4, 2026. |
| Download page | https://gbp-blm-egis.hub.arcgis.com/datasets/BLM-EGIS::blm-or-prescribed-fire-treatments-polygon-hub | Public. Shapefile and GDB. Data steward listed as sjeronimo@blm.gov. |
| Planned burns this season (narrative) | https://www.blm.gov/programs/fire/regional-info/oregon-washington/prescribed-fire | Public. Burn names, acres, windows, by district. |
| NEPA documents | https://eplanning.blm.gov | Public. PLANID is the key. Not exercised this session. |

### Tribal, NGO, and landowner burns

These register with ODF when on forestland, so they should appear in an SDS export, but the reasons and the cultural context will not. Sources:

- **Prescribed Fire Liability Program enrollment map** (HB 4016, 2024): https://experience.arcgis.com/experience/79e14d6fbce649c2adbdadc9ef670244/ Enrolled prescribed and cultural burns since 2024. Public; not exercised.
- **Certified Burn Manager directory**: 23 people as of August 2026, saved as [cbm-directory.csv](cbm-directory.csv). See contacts.md for what they do.
- **Prescribed burn associations** (seven as of January 2026): Rogue Valley, Umpqua, Mt. Adams, Central Oregon Prescribed Burn Co-op, North Valley, Northeast Oregon, Southern Blues. OSU Extension keeps the list: https://extension.oregonstate.edu/fire-program/prescribed-burn-associations (returned 403 to automated fetch; open in a browser).
- **The Nature Conservancy Oregon**: Sycan Marsh Preserve (30,000 acres, Klamath Basin) is the state's most studied prescribed fire site. TNC's fire program director Kai Sauerbrey is in the CBM directory.
- **Klamath Tribes Wildland Fire Program**: spring 2026 burns reported at https://www.klamathtribesnews.org/2026/04/29/2026-prescribed-burns/ and a 2025 program report at https://www.klamathtribesnews.org/2025/09/02/klamath-tribes-wildland-fire-program-report/.
- **Grand Ronde, Siletz, and Warm Springs** are partners in a 2024 NFWF-funded ecocultural burning project (https://pacificbirds.org/2024/12/oregon-partners-nfwf-grant/). Warm Springs traditional fire use is documented in a USFS research paper (https://research.fs.usda.gov/treesearch/59061).
- **Lomakatsi Restoration Project** and the **Ashland Forest Resiliency** partnership (City of Ashland, Lomakatsi, Rogue River-Siskiyou NF, TNC) run the Rogue Basin TREX.
- **Willamette Ignitions Network** (Eugene) trains burn crews and hosts the September 2026 CBM course.

### Agricultural field burning (ODA)

Willamette Valley grass seed and cereal residue burning, up to 15,000 acres a year in the north valley, administered by ODA with ODF meteorologists making daily burn decisions. Every field is registered by April 1. No public dataset was found; the ODA page lists a program phone (503-986-4701 in older material; 503-986-4550 on the current page) and info@oda.oregon.gov. This is a records request for field registrations and daily burn accomplishments by year. Rules are OAR 603-077.

### Backyard, debris, and open burning

Permits come from local fire districts (many use beforeyouburn.com), with air rules from DEQ statewide and LRAPA in Lane County. There is no statewide registry. Recommendation: leave out of version one, and revisit with a records request to a few large districts if the map needs it.

## Tier 2: wildfire records

| Source | Coverage | Key fields | Where | Status |
|---|---|---|---|---|
| ODF Fire Occurrence | 1960 to 2024, ODF-protected lands (about 16 million acres) | 69,744 fires. Cause (general, specific, comments, lead investigator, degree of certainty), TRS and lat-long, ignition/discovery/report/attack/control datetimes, size at attack, final acres, size class, fuel, slope, aspect, elevation, protection agency, land class, county | https://services.arcgis.com/uUvqNMGPm7axC2dD/arcgis/rest/services/ODF_Fire/FeatureServer/1 and Socrata at data.oregon.gov (fa7z-shhx) | Public, queried |
| NIFC WFIGS incident locations (IRWIN) | All agencies, live; year-to-date and full history | IncidentTypeCategory (WF, RX, CX), cause, discovery/containment/control/out dates, acres, jurisdiction, protecting unit, TRS, IrwinID. 2026 Oregon so far: 1,802 WF, 159 RX | https://services3.arcgis.com/T4QMspbfLg3qTGWY/arcgis/rest/services/WFIGS_Incident_Locations_YearToDate/FeatureServer/0 and data-nifc.opendata.arcgis.com | Public, queried |
| NIFC WFIGS perimeters | 2021 to present, plus history view to 2024 | Perimeter polygons keyed by IrwinID | WFIGS_Interagency_Perimeters, _YearToDate, _Current; InterAgencyFirePerimeterHistory All Years | Public |
| NWCC Fire History | 2000 to present, OR and WA large fires | 3,045 perimeters. Name, year, start date, cause, perimeter and reported acres, containment and control dates, IRWIN ID | https://services3.arcgis.com/T4QMspbfLg3qTGWY/arcgis/rest/services/NWCC_Fire_History/FeatureServer/0 | Public, queried |
| Oregon Wildfire Perimeter History (through 2025) | pre-2000 and 2000 to 2025 | 4,608 recent perimeters, cleaned by OSU INR from NIFC in April 2026 | https://services1.arcgis.com/CD5mKowwN6nIaqd8/arcgis/rest/services/library_env_or_wildfire_perimeter_history/FeatureServer | Public, queried |
| FPA FOD v6 | 1992 to 2020, national | 2.3 million wildfires; the cleanest cross-agency ignition record. Two-year lag; check for a v7 | USFS Research Data Archive RDS-2013-0009 | Public |
| MTBS | 1984 to 2024, fires over 1,000 acres in the West | Burned area boundaries and severity rasters; includes prescribed fires over the threshold | https://www.mtbs.gov/ | Public |
| RAVG | Fires over 1,000 acres on NFS land, more timely than MTBS | Basal area and canopy loss rasters | fs.usda.gov post-fire vegetation condition | Not verified this session |
| NASA FIRMS | 2000 to present hotspots (MODIS, VIIRS) | Satellite detections, including many prescribed burns | firms.modaps.eosdis.nasa.gov (API key) | Not verified this session |
| OSFM wildfire map | Fires over 100 acres, current | Structural response, sources WFIGS/IRWIN, OEM, NWS, ALERTWest | https://osfminfo.org/ | Public |
| InciWeb and ICS-209 | Large fires | Daily narrative, resources, structures threatened | inciweb.wildfire.gov; NWCC situation reports | Public |
| ALERTWest cameras | Live plus archive | 70 Oregon cameras, panoramas every two minutes | https://www.alertwest.live/ | Public viewing |
| ODF 2020 Labor Day Fires | 2020 | Perimeters for the Labor Day fires | services.arcgis.com/uUvqNMGPm7axC2dD .../2020_Oregon_Labor_Day_Fires_View | Public |

## Tier 3: context layers

- **Smoke and air quality.** DEQ AQI and hourly monitoring at https://aqi.oregon.gov/ (history by records request or the EPA AQS API); AirNow fire and smoke map; PurpleAir API for sensors; ODF's smoke forecasts and the intrusion tables in the annual reports; the interagency blog at https://www.oregonsmoke.org/. The smoke sensitive receptor area layer is public.
- **Fire weather and danger.** ODF's live Fire Danger Level, Industrial Fire Precaution Level, Regulated Use Area, and Significant Fire Potential layers (Hosted folder on gis.odf.oregon.gov/odfags); NWS fire weather zones (in the ODF web map); Red Flag warnings via the NWS API; RAWS stations via Synoptic; NWCC Predictive Services outlooks.
- **Hazard and risk.** The 2025 Statewide Wildfire Hazard Map (hazardmap.forestry.oregonstate.edu) was repealed as a regulatory instrument by SB 83 in 2025 but the data stands; the Oregon Wildfire Risk Explorer is being rebuilt (expected early 2026, check status); Wildfire Risk to Communities (USFS); LANDFIRE fuels and fire regimes.
- **Why-here layers.** ODF 20-Year Strategy Priority Geographies (feature service, listed); county CWPPs via the Oregon CWPP Planning Tool; Forest Service Wildfire Crisis Strategy landscapes; ODF Landscape Resiliency Program projects (2023 to 2025 implementation summary at https://www.oregon.gov/odf/fire/Documents/lrp-2023-25-implementation-summary.pdf).
- **Evacuation and response.** Genasys Protect zones (all 36 counties and nine tribes under a state contract), Public RAPTOR, the OEM ArcGIS hub.
- **Boundaries.** ODF forest protection districts, ownership and land management, wilderness, fire weather zones, PLSS.
- **Utilities.** PUC wildfire mitigation plans (UM 2207 Pacific Power, UM 2208 PGE, UM 2209 Idaho Power; rules in OAR 860-300 under AR 638). Plans contain the utilities' high fire risk zones and ignition histories; PSPS lessons-learned reports are due each December 31. No structured ignition dataset is published; ask PUC safety staff.
- **Treatment effectiveness.** FTEM (fuel treatment effectiveness monitoring) records every time a wildfire meets a prior treatment. It lives in IFTDSS behind a NIFC login; the public dashboard is at https://fireportal.usda.gov/ftem/. Worth a request once we have the treatment layers, because it answers "did the burn work."
- **Policy timeline for captions.** SB 762 (2021) created the Certified Burn Manager program, the Landscape Resiliency Program and the hazard map; SB 80 (2023) revised them; HB 4016 (2024) created the Prescribed Fire Liability pilot; SB 83 (2025) repealed the hazard map and its mandates. The Wildfire Programs Advisory Council reports each October (2025 report at https://www.oregon.gov/gov/Documents/WPAC%20Report_2025.pdf).

## Gaps and what fills them

| Gap | Fill |
|---|---|
| Per-burn history on state and private land (and federal units as registered) | SDS export from ODF. Records request plus a voluntary ask. |
| Reasons for private burns | Burn reason code in SDS; practitioner interviews; PBA and CBM narratives. |
| Reasons for federal burns | NEPA documents by nepa_doc_name (USFS) and PLANID (BLM). |
| Cultural burns | Direct relationships with tribal fire programs; the liability program enrollment map. |
| Field burning | ODA records request. |
| Backyard and debris burning | Not centralized; out of scope for v1. |
| Live per-burn feed | Poll the four ODF layers and the USFS tracker layer daily and keep every row. |
| Treatment effectiveness | FTEM request. |
| Structures lost and damage | OSFM season reports; OEM damage assessments; county assessors. |

## Notes on building

- Poll ODF's 3-day accomplished layer and the USFS planned layer every day starting now. Nothing in the public feeds is retained, so our archive becomes the only public history until the export arrives.
- Join keys: IrwinID (NIFC locations to perimeters, and NWCC history), RegistrationNumber (ODF feed to SDS export), nepa_project_id and PLANID (treatments to documents), NFPORS_TRTID (BLM to DOI reporting).
- ODF fire occurrence is in EPSG:2992 (Oregon Lambert, feet). BLM and NIFC are WGS84.
- Both ODF and USFS services have maxRecordCount 2000; page with resultOffset.
