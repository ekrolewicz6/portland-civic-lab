# Recent fire scars, severity, and forest context — September 12, 2026

This iteration implements the approved feedback about recent wildfire scars and the ecological work wildfire can do. Public credits remain Edan Krolewicz and Dominic Kuklawood. No correspondence or outreach was sent.

## Available in the page

- A separate recent-wildfire perimeter overlay, enabled by default, with 1-, 5-, and 10-year windows and a selectable ending year. Prescribed-burn records remain visible alongside it. Record markers can be hidden independently of the results list.
- Source-defined MTBS severity colors for a selected **fire year**. This is an annual mosaic of published assessments, not a claim that every fire in that year has been assessed. The year selector is not an observation/assessment date. Individual assessment dates need a future event-level metadata integration.
- Source-linked detail selection and shareable map controls. Overview geometry is simplified; selected records retain original imported geometry.
- A dated forest-area graphic and an explanation separating fire extent, severity, recovery, and ecological benefit. No statewide “good fire” percentage is asserted.

## Acquisition and evidence

### WFIGS recent wildfire perimeters — downloaded and imported

[Official feature service](https://services3.arcgis.com/T4QMspbfLg3qTGWY/arcgis/rest/services/WFIGS_Interagency_Perimeters_YearToDate/FeatureServer/0).

The source is distinct from the existing occurrence-point feed. Query: `attr_IncidentTypeCategory = 'WF' AND attr_FireDiscoveryDateTime >= TIMESTAMP '2026-01-01 00:00:00'`. ID discovery uses the WGS84 envelope `[-124.9,41.8,-116.3,46.4]` with `esriSpatialRelIntersects`; every returned ID is fetched, followed by Oregon geometry intersection. WA-only features are excluded; border-crossing perimeters are retained. The entire source boundary is preserved rather than clipped at the state line.

Initial complete import examined 6,713 national features and published 386 Oregon records. The bounded repeat examined 488 candidates and published the same 386. One record lacked usable geometry. Import metadata, query parameters, source timestamps, checksums, sanitized versions, and failures are retained in the existing database. Six-hour refreshes use the existing cron. Last successful perimeters are retained across subsequent snapshots.

The display uses Oregon Explorer's completed historical perimeter source through 2025 and WFIGS for later years. This hierarchy avoids adding current observations to the same historical year; it is not an assertion of perfect within-source incident deduplication. Counts are **perimeter records**, never statewide unique-fire totals. At verification, 2022–2026 returned 1,776 records and 2017–2026 returned 2,616. Complete statewide payloads were approximately 1.98 MB and 3.03 MB, respectively; no records were dropped to meet a response-size limit.

### MTBS — queried and displayed through a fixed tile endpoint

[Public WMS capabilities](https://edcintl.cr.usgs.gov/geoserver/mtbs/ows?service=WMS&request=GetCapabilities), [definitions and limitations](https://www.mtbs.gov/faqs).

Capabilities advertise annual CONUS layers through 2026. Presence of a layer does not establish complete coverage. The initial severity selection is 2024. GetLegendGraphic confirmed colors: unburned-to-low `#008080`, low `#52CCCC`, moderate `#FFE820`, high `#A80000`, increased greenness `#39B54A`, and non-processing mask white. Browser tests confirmed actual 256-pixel PNG mosaics. Direct cross-origin image loading was blocked by the browser; the application now serves validated, cached images from this one fixed official upstream. Invalid coordinates fail explicitly, as do unavailable tiles.

Western MTBS coverage generally starts at 1,000 acres. Mosaics include wildfire and prescribed fire. Empty or unmapped pixels do not establish absence of burning. Vegetation-change classes alone do not establish ecological benefit. This display is not an imported, locally archived event-level severity dataset; upstream publications may change.

### Oregon forest area — downloaded and verified

[Forests of Oregon, 2022 (FS-663)](https://research.fs.usda.gov/download/treesearch/70007.pdf), [catalog](https://research.fs.usda.gov/treesearch/70007). Published September 2025.

Reported forest land: **29,754,801 acres**, sampling error **±0.43%**, approximately **49%** of sampled land area. The page rounds the headline to 29.75 million acres and preserves the inventory year, publication date, exact estimate, error, and source link. FIA forest land is a land classification, not a live canopy count. Burned acreage is not subtracted from it.

## Deferred evidence and measures

A mapped vegetation layer, unique forest area exposed to fire, ecological outcome indicators, and a restoration-target progress bar still require defined geography, time windows, overlap accounting, forest-type context, and reviewed outcome evidence. No metric is silently substituted for these missing measures. No tribal/cultural records have been newly released through this work.

## Verification

Focused checks cover WFIGS normalization and bounded pagination, repeated imports, full response counts, border filtering, source links, map/list selection, URL persistence, mobile layout, keyboard controls, real severity images, explicit image failures, and intercepted private correction submissions. Application and ingestion typechecks, lint, all 16 focused data tests, and all 7 browser tests passed before release. Production build and live verification are checked separately at deployment. No real correction message or outreach email is sent by the tests.
