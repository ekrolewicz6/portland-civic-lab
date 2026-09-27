# Continuous fire guide — September 27, 2026

## Delivered experience

The main `/oregon-fire` page now tells a continuous eight-chapter story before offering the atlas. It follows how fire moves; differences among Oregon landscapes; landscape history; choosing and preparing work; treatment research; post-fire effects; spending and uncertainty; and action at landscape, building and community scales.

Each chapter has an essential explanation, a meaningful visual, a takeaway, public sources, a transition and an independent deeper article under `/oregon-fire/learn/[slug]`. Eight articles include evidence locators, limitations, a discussion question, previous/next links and a return to the relevant main-page chapter. The guide works without map interaction and its essential narrative remains available without JavaScript.

Original SVG illustrations explain fuels, landscapes, tree-ring evidence, project preparation and ember exposure. A sourced chart presents the 2024 synthesis's reported mean relative severity reductions. Existing dated NASA images show the 2020 Oregon landscape before and after the fires. The cost explorer is explicitly hypothetical; its assumptions can be changed. These materials do not use the private interview.

The atlas remains below the guide and is also available at `/oregon-fire/atlas`. Existing story, comparison and planning query settings redirect there with all query values preserved. Map-only place and record links remain on the main page. Source freshness, coverage, contribution links, exports and reviewed project/story routes are retained.

Main-page metadata, social-image text, Article structured data and the sitemap now describe the guide. Public authors remain Edan Krolewicz and Dominic Kuklawood.

## Evidence boundaries

- The treatment chart reports study means for subsequent wildfire severity in analyzed seasonally dry western conifer settings. It does not measure fires prevented, homes saved, monetary savings or all Oregon ecosystems. Three treatment-category means are not presented as a statistically established ranking.
- Egley's reported percentages and hectare denominators do not consistently reproduce one another. No new quantitative graphic was derived from those ratios; the deeper article identifies the unresolved issue.
- ODF units, ignitions and acres are distinct measures. Forestland smoke-program records are not a statewide all-burn inventory.
- NASA photographs retain acquisition dates and false-color interpretation. Display images are not inputs for quantitative area calculations.
- No Woodpecker location, monitoring result, expense or alternative was invented. Project-specific gaps remain visible in the existing reviewed story and dossier.
- Costs and probabilities in the explorer are teaching assumptions, not Oregon estimates. Actual prevention-versus-response accounting still requires comparable project, incident, maintenance and impact records.
- No private testimony or identifying interview details were added to code, public evidence, exports or deployment inputs. No outreach messages were sent during this release.

## Verification

- Production build: passed (`npm run build`).
- Application typecheck and ingestion typecheck: passed.
- Source lint and diff whitespace checks: passed.
- Focused Playwright coverage: **11 passed; 5 opt-in live-data tests skipped**. Tested continuous ordering, all eight deeper routes, canonicals, structured data, missing-route 404, retained existing editorial/project flows, map failure behavior, keyboard chapter jumps, mobile widths, hypothetical cost controls, no-JavaScript reading/images, and legacy settings.
- An actual anchor-navigation defect was found and corrected: global smooth scrolling caused long keyboard jumps to land outside the requested chapter. The guide now uses direct native jumps and a header-aware chapter-navigation position.
- Final desktop and 390px mobile screenshots reviewed, including hero illustration and direct chapter navigation. No horizontal page overflow was found.
- All 18 chapter sources checked on September 27: **17 working, 1 access-blocked (USFWS HTTP 403), 0 missing**. A blocked automated request is not classified as a broken link. See `long-guide-link-check-2026-09-27.json`.
- Main social image returned HTTP 200 and `image/png` in local production verification.

Production promotion and live checks are recorded in the release receipt after the successful deployment. The broader acquisition, scientific review and classroom-material backlog remains in the teaching-guide blueprint; this release does not claim a complete curriculum or school validation.
