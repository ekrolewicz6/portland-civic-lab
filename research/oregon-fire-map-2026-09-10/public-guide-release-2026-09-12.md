# Public field guide release — September 12, 2026

The project owner approved building the public-understanding recommendations. This release adds a guided entry to the existing atlas; public authors remain Edan Krolewicz and Dominic Kuklawood. No outreach or real correction submission was sent.

## Implemented

- Three entry paths and a persistent chapter navigator: understand fire, find a place, and explore records.
- Four illustrated ecological contexts, with reader questions, source links, and direct map navigation. Illustrations are conceptual and explicitly not site assessments.
- Search across 426 Oregon incorporated/Census-designated places from the 2025 Census Gazetteer. Local summaries use the actual filtered result count, number of contributing sources, and newest reported record year. Global filter-option counts are not used as local statistics. Geographic views are centered on Census reference points and explicitly are not city boundaries or parcel risk assessments. The search is local to the application and does not send queries to a third-party geocoder.
- Three source-attributed case studies: OSU Woodpecker, the Egley Fire Complex study, and the Willamette Valley refuge burning program. Timeline controls and intended/documented/missing evidence panels distinguish completed burns, study observations, and program descriptions.
- The Egley study's original Figure 1, showing treatment areas, severity, and paired field sites. The application reproduces the figure under CC BY 4.0, with author/source/license attribution and an extraction/compression notice. The graphic is not a new spatial match between today's records.
- Egley comparison bars use the paper's reported 12.9% high-severity share of treated land and 26.7% of untreated land. Treatment categories were grouped; this does not isolate prescribed fire. Field measurements were made in 2008 and 2016 after the 2007 fire. Results are observational and do not forecast another location.
- A draggable, keyboard-accessible NASA imagery comparison: July 19, 2020 versus September 27, 2020 or September 27, 2025. Original observation dates, false-color interpretation, cloud/season differences, and limits on interpreting ecological recovery remain visible.
- A seasonal planning guide and selectable explanations of weather, fuels, smoke, people/equipment, and preparation/approvals. It is explanatory, not an operational go/no-go tool or a claim about a specific cancellation.
- An objectives view covering communities, habitat/cultural priorities, and forest condition; options are paired with evidence questions and limitations. Project costs and outcome data not obtained are marked missing.
- Direct links to official current smoke, evacuation, and emergency resources, separate from historical interpretation.
- Shared URLs preserve landscape, selected place, story, timeline, imagery date, season, planning topic, management objective, and map settings. Navigation respects reduced motion and keyboard focus. Map updates retain guide choices and no longer replace a reader's section anchor with the map anchor.
- The recent-perimeter selector now reaches 2000, allowing the 2007 Egley scene. Requested windows extending earlier than 2000 are clipped to the overlay's coverage and explained; they do not display earlier years as zero-fire observations.

## Sources and assets

See [asset provenance](public-guide-assets-2026-09-12.json) for original download URLs, retrieval timestamp, image dates, bounding box, dimensions, and checksums.

- Census original: `https://www2.census.gov/geo/docs/maps-data/data/gazetteer/2025_Gazetteer/2025_gaz_place_41.txt`. Fields used: GEOID, NAME, INTPTLAT, INTPTLONG. The reference point is not a polygon centroid or a verified burn location.
- NASA GIBS WMS, `MODIS_Terra_CorrectedReflectance_Bands721`, EPSG:4326, bbox `[-124.5,43.5,-120.5,46]`, 1200×1000, three explicit dates. Data provided by NASA GIBS/Terra MODIS. Cached local images ensure the historical comparison does not drift as a live layer changes. NASA's [September 29, 2020 explanation](https://modis.gsfc.nasa.gov/gallery/individual.php?db_date=2020-09-29) describes the July/September 2020 comparison; the 2025 GIBS view is an additional dated observation, not a NASA claim of recovery.
- Dodge et al. 2019: [catalog](https://research.fs.usda.gov/treesearch/59149), [paper](https://research.fs.usda.gov/download/treesearch/59149.pdf), DOI 10.1186/s42408-019-0055-7. The paper states CC BY 4.0. Figure 1 extracted from PDF page 5; numeric comparison verified on page 7. Study-region map extent is illustrative geographic context around the reported study location, not a plot boundary.
- OSU: [Woodpecker account](https://www.forestry.oregonstate.edu/news/fire-purpose), [ecological effects](https://extension.oregonstate.edu/catalog/pub/em-9340-ecological-effects-fire), [purposes](https://extension.oregonstate.edu/catalog/em-9339-prescribed-fire-why-we-burn), [planning](https://extension.oregonstate.edu/catalog/pub/em-9343-planning-prescribed-burn), [weather](https://extension.oregonstate.edu/catalog/em-9385-prescribed-fire-basics-fire-weather), and [smoke](https://extension.oregonstate.edu/catalog/em-9203-fire-faqs-air-quality-impacts-prescribed-fire-wildfire).
- USFWS: [Finley program](https://www.fws.gov/refuge/william-l-finley/what-we-do). This describes program objectives and general seasonality, not an individual confirmed burn or measured result.

## Evidence still needed

Woodpecker unit geometry, repeat ground photography, project-specific costs and alternatives, measured local outcomes, and steward-confirmed unit histories remain acquisition needs. Park/watershed name search is not included in the Census place-name dataset. A vegetation layer and exact landownership inventory have not been inferred from town locations. Cultural-fire case studies still require willing partners and decisions about disclosure. No statewide ecological-success percentage is invented.

## Validation

Application and ingestion typechecks, full-project lint, and the production build passed. The existing fire-map suite and new focused browser flows cover URL/history behavior, keyboard and mobile use, actual image loading, historic-year selection, imagery interaction, source links, private correction interception, and unavailable versus valid-empty place summaries. The new source/utility links were checked with GET requests and returned HTTP 200. Post-deployment checks are performed separately before completion.
