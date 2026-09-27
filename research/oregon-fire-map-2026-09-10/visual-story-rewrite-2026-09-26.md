# Why-burn visual rewrite — September 26, 2026

Trigger: reader feedback identified abstract wording, a non-explanatory box diagram and insufficient visual teaching. Replace the abstract decision framework with a concrete, illustrated story. Public authors and existing section anchors remain.

## Public changes

- First chapter: original SVG comparison of ladder fuels and space beneath tree crowns. Explain fuel in everyday language; source the mechanism to OSU's Fire Behavior guide. Clearly label the comparison as an illustration of a dry forest, not a prediction, actual unit photograph, or before/after assessment.
- Woodpecker: original oak/pine drawings beside the two actual reported goals. Locate the project near Corvallis in text; retain the need for verified unit boundaries and reuse-cleared unit photographs.
- Choices: concrete preparation/weather/planning steps rather than abstract labels. Keep the difference among tools and their costs.
- Costs: keyboard-accessible sliders and a labeled bar comparison, using invented values only. Initial calculation is $1M full-program cost, 20% relevant-fire probability within a 20-year effective period, and $10M conditional damage avoided; expected damage avoided $2M. At 5%, $500K. This teaches arithmetic and sensitivity, not Oregon ROI or a wildfire forecast. Variable labels explain time horizon and assumptions. No-JavaScript view preserves the initial example and hides inactive controls.
- Actual burn: published preparation and October 2025 implementation timeline; distinguish missing follow-up from reported work.
- Results: plain questions about tree/habitat response and full costs. Keep the original USGS Utah pair with verified dates/credits, simplify its wording, and place it with the discussion of how to check changes.

The page removes the abstract flowchart, jargon such as “documented objective,” and generic rhetorical headlines. All five existing section IDs and `#reading-landscape` remain valid. Costs add `#costs`. No new private interview content enters application, metadata or public research.

## Evidence and limits

- [OSU Fire Behavior](https://extension.oregonstate.edu/catalog/em-9341-fire-behavior): fuel connectivity/ladder fuels, moisture, wind and slope; original illustrations paraphrase mechanisms rather than reuse copyrighted images.
- [OSU Woodpecker account](https://www.forestry.oregonstate.edu/news/fire-purpose): site selection, goals, planning, October 2025 burning, initial patchy effects. Still not a quantitative long-term assessment or verified expenditure report.
- [OSU planning](https://extension.oregonstate.edu/catalog/pub/em-9343-planning-prescribed-burn): workflow explanation; written plans and preparation.
- [OSU ecological effects](https://extension.oregonstate.edu/catalog/pub/em-9340-ecological-effects-fire): geographic/ecosystem differences. Latest fetch timed out; prior inspection is retained. A timeout is not a missing page.
- [Treatment leverage research](https://research.fs.usda.gov/treesearch/55535): encounter probability and contingent benefits; catalog/abstract inspected. The teaching calculator supplies no study parameters and makes no claim of local validity.
- [USGS repeat-photo assessment](repeat-photos-assessment-2026-09-26.md): same original image, dates, credits and source limitations; revised public wording only.

Cost example excludes discounting, treatment risks, smoke, response expenditures and ecological benefits. It does not compare actual strategies or prove savings. A real analysis needs validated costs, probabilities, treatment effects, accounting scope and maintenance assumptions. Unknown project outcomes and costs remain unknown.

## Verification plan

Application and ingestion typechecks; focused source lint; production build; four focused browser tests covering existing project/export/correction routes, shared anchors/metadata/mobile layout, no-JavaScript photo reading/native disclosure, and keyboard-driven economic sensitivity. Review screenshots of complete desktop and mobile chapters before production release. New diagrams and chart must retain readable captions and meaningful accessible labels.

## Completed local checks

Application and ingestion typechecks passed. Full source lint passed with generated `.vercel` output excluded. Final production build passed (existing WorkOS Edge Runtime warnings remain). Four focused Playwright tests passed, including original project/export/correction flows, metadata/shared chapters/mobile, JavaScript-disabled photo interpretation, and a keyboard change from the 20%/$2M example to 5%/$500K.

Inspected desktop and mobile fire diagrams, tree illustrations, timeline and cost chart. No browser page errors or horizontal overflow. Native shared-anchor scrolling settled with the target below the fixed navigation. New original social image returned HTTP 200 PNG and was visually reviewed. React review: server-rendered illustrations and narrative; isolated state-only client calculator; no added packages or network calls; controls and outputs labeled; static fallback remains readable. No interview quotations or identifying testimony published.
