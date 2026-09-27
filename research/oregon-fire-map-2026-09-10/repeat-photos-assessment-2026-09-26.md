# Colorado Plateau repeat photography: assessment and Oregon application

Reviewed September 26, 2026. Public sources only. This is an out-of-state methodological example, not Oregon fire-history data.

## Decision

Add the release's original Horse Canyon pair to the first chapter of `/oregon-fire/stories/why-burn#reading-landscape`, with dates, location, original credits, two patch interpretations, source locators and limitations. Use it to teach readers how to evaluate observations. Keep it separate from Woodpecker, Egley and all Oregon map records. Preserve the original pair without cropping, retouching or reconstructed vegetation. Native HTML supports reading and expanding the interpretation without JavaScript.

The central lesson is that different vegetation patches in the same view can change differently. More cover is an observation, not a universal restoration target. To assess a fire project, compare changes with documented objectives, baseline and follow-up measurements, and local history.

## Sources and acquisition

- [USGS landing page](https://www.usgs.gov/data/repeat-photo-interpretation-vegetation-change-1910-2016-colorado-plateau-usa-and-contextual), published July 2, 2026; [release DOI](https://doi.org/10.5066/P13VCTOE).
- [ScienceBase JSON catalog](https://www.sciencebase.gov/catalog/item/6941c24ed4be0266e9e22f56?format=json), inspected and downloaded. Provides three files: CSV, XML metadata and **one example photo pair**, not a downloadable archive of all 338 pairs. XML update July 6, 2026.
- [Associated study](https://doi.org/10.1017/dry.2026.10019), *A picture is worth a thousand plants: Using historic and repeat photography to quantify long-term change in drylands on the Colorado Plateau*. Published online March 2, 2026. Read the downloaded typeset 15-page PDF; inspected Figure 4 on page 7 visually, not just extracted text.
- Technical acquisition status: metadata inspected, files downloaded and checksummed, selected rows reconciled against Figure 4. Steward confirmation: **not obtained**. Automated web retrieval failures (ScienceBase tool failure and Cambridge 429) did not imply missing sources; normal file requests succeeded.

Original downloads and review render live outside Git under ignored `runtime-data/oregon-fire/colorado-plateau-repeat-photos-2026/`. The approved paired photograph is the only acquisition asset copied into public media. `paper-accepted.pdf` is a local filename; its actual downloaded content is the **typeset published paper**, not an accepted manuscript. See the machine-readable manifest for URLs and checksums.

## What the release contains

The publication describes 338 photo pairs over roughly 3,100 square kilometres of the Colorado Plateau, covering shrubland, semi-desert grassland and pinyon–juniper communities. These are dryland systems outside Oregon. The paper considers grazing cessation, climate, terrain, soil/water context and land-use history; it is not an experimental prescribed-fire treatment study.

The CSV records vegetation **patch interpretations**: position shifts, patch size, individual plant count and size, live plant cover, disturbance and invasive-plant change. These are coarse categorical judgments, not measured percentage cover, acreage or exact plant counts. Environmental fields include grazing history, precipitation, landform and terrain metrics. Temperature discussed in the source documentation is not a column in this CSV.

Observed CSV structure: 559 rows, 311 unique `stake.id` labels and 311 unique `(stake.id, yr.obs.1, yr.obs.2)` tuples. The paper describes 296 physical stakes and 338 pairs, with multiple orientations and comparisons. These figures are **not reconciled**; do not use rows or stake labels as unique photo-pair counts. Do not derive statewide, regional or project achievement percentages from them.

Missing `NAN` values remain unknown. Metadata defines `last.yr.grazed=2016` as continuing grazing, not an independently verified cessation date. The precipitation label and process description need reconciliation before numeric display. The catalog footprint is not a photo-point inventory; no reliable point geometry was obtained from the CSV.

## Reviewed example: Horse Canyon, stake s6659

Figure 4, page 7, confirms Horse Canyon, Canyonlands National Park, Utah, **1965 on the left / 2015 on the right**. Historical collection: Brigham Young University, Provo, Utah. Repeat photograph: C. Shelz, National Park Service, as credited in the figure caption. The paper acknowledgments use a different spelling; preserve the caption credit rather than silently correcting it.

The two CSV rows for `s6659` (centroid `c6659_1`) distinguish:

| Attribute | Grassland (`IM_grassland`) | Pinyon–juniper (`CP_PJ`) |
|---|---|---|
| Patch position shift | Yes | Yes |
| Patch size | Increase | No Change |
| Individual count | Increase | No Change |
| Individual size | Larger | No Change |
| Live plant cover | More Dense | No Change |

Both rows also classify fewer invasives and recovery from disturbance. These labels require the source's context and are not ecological scores. The record includes grazing history; this observational example alone does not establish grazing cessation as the cause of the photographed changes, or fire as the cause. Avoid equating “No Change” in several attributes with no change whatsoever.

## Limits and rights

- Opportunistic photography, predominantly national-park settings, is not a representative Oregon sample.
- Camera angle, photographic quality, seasons, long and varying intervals, drought baselines and approximate viewsheds constrain inference. Some species-level changes may not be visible.
- Wider findings are community- and context-specific. Neither denser vegetation nor woodland expansion has a universal interpretation.
- USGS landing and XML explicitly mark release data **CC0**, including the supplied example pair. Preserve original credits despite public-domain reuse.
- Downloaded typeset paper declares **CC BY 4.0** on its first page. Cached accepted-manuscript search material reported different rights; record actual inspected version. We link the paper rather than republish it.
- The paper discloses Adobe Photoshop generative fill for Figure 3/graphical-abstract materials. **Do not use those as historical photographic evidence.** Our selected Figure 4 pair is the original image separately supplied in the USGS release.
- No restricted material or private interview content contributed to this assessment or feature.

## Oregon acquisition backlog and questions

1. For Woodpecker and other reviewed projects, request an existing matched-photo packet: original files, dates, viewpoint, photographer, permission, unit relationship and monitoring. Ask for existing records, not a new photo survey.
2. Preserve before/preparation/after/follow-up dates, seasons and treatment sequence. Confirm images show the actual reviewed unit before connecting them to that project's timeline.
3. Pair observations with objectives: e.g. intended understory vegetation, retained trees or habitat structure. Record what was measured, method, units, spatial scope and uncertainty. Vegetation gain is not a substitute for these measures.
4. Use northeastern Oregon historical repeat photography as a separately located example once dates/credits/rights are reviewed. Do not show it as Woodpecker's past.
5. For this release's custodians, if a comparative research use becomes necessary: ask how 559 patch rows and 311 labels map to 296 stakes/338 comparisons; whether a public photo inventory/originals and precise viewpoint metadata exist; clarify precipitation units/aggregation and categorical rules. No email has been sent for this assessment.
6. No endpoint from this release belongs in the Oregon burn importer. If an Oregon repeat-photo collection becomes available, model it as dated media and observations with verified relationships, not a fire occurrence or inferred burned footprint.

## Verification

Original paired image SHA-256 matches the downloaded source. Application/ingestion typechecks, lint, production build, focused editorial browser tests and visual desktop/mobile checks are recorded in the release evidence after execution. Review is a public-source editorial check; independent scientific review remains pending.
