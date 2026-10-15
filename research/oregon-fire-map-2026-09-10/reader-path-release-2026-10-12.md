# Fire guide reader-path revision

October 12, 2026. Release candidate based on the [audience and Extension-source memo](audience-and-extension-source-plan-2026-10-12.md). The private conversation remains outside the repository. This revision does not claim OSU Extension review or endorsement.

## Public change

- The main guide now offers three entry paths: learn how fire works, see decisions at land/home/community scales, or investigate records around a place. They all lead into the existing continuous guide.
- A new illustrated contrast uses two landscapes within OSU Extension's Willamette Valley and Western Cascades account: prairie/oak on the valley floor and wetter, higher-elevation forests. The illustrations are original site assets. The source's seven-region index is linked; our four older habitat examples remain explicitly introductory, not a regional map.
- The money chapter now separates ODF's calendar-2025 expenditures across 13 programs from OSFM's announced February-2023 Community Wildfire Protection Plan investment. A four-stage diagram explains budget, award, expenditure, and documented work/result without summing incomparable figures. The deeper article cites both agencies and dates the revision.
- The place finder now gives readers three questions to ask of one record: record type, reported purpose/location, and follow-up evidence.
- `/about`'s question list now includes the published Fire in Oregon guide and atlas through `src/lib/topics.ts`.

## Evidence and limits

- [OSU Extension, *Not all flame's the same*](https://extension.oregonstate.edu/catalog/em-9459-not-all-flames-same) and its [Willamette Valley/Western Cascades chapter](https://extension.oregonstate.edu/catalog/em-9461-not-all-flames-same-willamette-valley-western-cascades) support the regional contrast. It is not a treatment prescription or site-level history.
- [ODF's 2025 implementation report](https://www.oregon.gov/odf/aboutodf/documents/2025-odf-sb83-landscape-resilency-strategy-implementation-report.pdf) supplies the bounded $50.98 million expenditure account. [OSFM's investment page](https://www.oregon.gov/osfm/wildfire/pages/investments-for-oregon.aspx) supplies the separate $2.7 million program announcement and county/project description. Neither source supplies a joined statewide prevention total or project-by-project outcomes.
- No photograph, map boundary, burn result, or quotation from the private conversation was published. A matched before/after burn sequence still needs a named unit, dates, original viewpoint, objective, follow-up evidence, and reuse rights.

## Verification

`npx tsc --noEmit --incremental false`, focused ESLint, and `npm run build` passed. The build's ORESTAR release preflight passed. Eleven focused Playwright checks passed after stale test assumptions about chapter order and calculator location were corrected. Browser screenshots were inspected at 1440px and 390px widths for the entry paths, region comparison, and funding diagram. The guided content remains server-rendered and readable without JavaScript. Publication status must be recorded separately from this local verification.

## Smallest useful follow-up

After checking the existing correspondence, ask for one precise editorial check: whether the new contrast misses an important western-Oregon distinction. Ask whether there is one existing matched, credited photo-point sequence for a completed Oregon burn that can be connected to its objective and assessed for reuse. An invitation to circulate the site to colleagues is not a commitment to review a full dataset.
