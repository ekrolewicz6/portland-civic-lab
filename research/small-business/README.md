# Portland small-business economy: evidence dossier and webpage

**Evidence cutoff:** September 30, 2026. **Status:** research foundation and an initial verified atlas; not a completed city-level census or causal program evaluation. Read [the dossier](dossier.md) and [visual atlas](visual-atlas.html) first. The central test is whether Portland enables sustainable firms **and** better lives for owners, workers, customers and residents.

This package deliberately separates a Portland **city** policy question from the best available **Multnomah County** and **Portland–Vancouver–Hillsboro MSA** business-size data. A Prosper report gives a Portland-city small-business employment series, though its size definition needs confirmation. The best directly reproducible size-share headline is 2022 metro employer-business jobs, payroll and receipts by **enterprise size**, supplemented by 2019–2023 metro establishment dynamics. A Portland city small-versus-large GDP split is not presently established. The package documents what would be required to estimate one.

## Package

- [Dossier](dossier.md): answers, confidence, competing explanations, editorial priorities.
- [Visual atlas](visual-atlas.html): 16 sourced figures with underlying [data](data/README.md) and accessible captions.
- [Source explorer](source-explorer.html), [source register](sources.tsv), [claim ledger](claims.tsv), [crawl log](crawl-log.json): audit trail. The 68-source register is a substantive first pass, **not** the proposed 150–250-source exhaustive review. Status distinguishes screened, reviewed, archived, queued and inaccessible. A source being listed does not mean its findings were validated.
- [Methods](methodology.md) and [GDP feasibility memo](gdp-feasibility.md).
- [Program inventory](program-inventory.tsv), [policy comparison](future-program.md), [fieldwork kit](fieldwork-kit.md), and [priority gaps](notes/gaps-and-requests.md).
- `build.py` recreates numerical extracts and figures; `render.py` rebuilds the two HTML readers; `verify.py` checks internal links, source/claim references, figure count and the numerical reconciliation file. `archive.py` logs permitted downloads and hashes. The [raw-input manifest](raw-inputs.tsv) supplies exact official URLs, paths, hashes and file sizes. Raw downloads live in ignored `runtime-data/small-business/`; reused BLS/Census files live in ignored `runtime-data/maker-economy/`.

## Reproduce

Use a Python environment with `openpyxl`, `numpy` and `matplotlib`. Download source files to the paths in `raw-inputs.tsv`; the script refuses files whose SHA-256 differs from `data/checks.json`. The QCEW annual county CSVs and 2023 NES county ZIP are reused from the [maker-economy corpus](../maker-economy/). Then run:

```sh
python3 research/small-business/build.py
python3 research/small-business/enrich_sources.py
python3 research/small-business/render.py
python3 research/small-business/verify.py
```

Reproduction needs the pinned raw files, which are deliberately ignored rather than adding large third-party datasets to Git. CSV extracts, charts, documentation and source URLs are tracked. `archive.py --check` validates archived source hashes without fetching. Sources are attributed to their publishers; all calculations and interpretation here are original.

## Reading rules

- The SUSB `<20` and `<500` rows overlap. They are **alternative thresholds**, never additive components. SUSB `500+` complements `<500`; county uses wider nonoverlapping bands.
- SUSB jobs are mid-March employer payroll jobs, not all working people. SUSB payroll and receipts are not value added or owner income. NES nonemployers are separate, a different year, and may include part-time activity.
- QCEW 2019–2025 county jobs measure covered annual-average employment and are not directly interchangeable with SUSB mid-March jobs.
- Reported program reach is output, not proof of economic impact. The OSB report's district totals and interaction terms are unresolved and carried as such.

No records request was sent and no interviewee was contacted in this phase. The original research phase made no production changes. The October 3 release adds the webpage and publication links; it adds no API or database.

## Visual webpage — October 3 extension

The research now supports a twelve-chapter Next.js report at `/deep-dives/small-business`, with 20 substantive figures, definition and metric switches, industry-standardized peer comparisons, all 387-metro context, business journeys, owner-cash scenarios, a costed policy lab, and a searchable source library. Publication route: `https://www.portlandciviclab.org/deep-dives/small-business`. The October 3 release includes the deep-dive library, About topic and sitemap. See the validation record for deployment status.

New source readings and methods are in [webpage research](notes/webpage-research.md), [web sources](web-sources.json), [web claims](web-claims.tsv), and [archive hashes](web-archive.json). Updated readings may share a URL with the original register; they are not additional unique documents. The original 68-source corpus and 16-figure standalone atlas remain intact.

`python3 research/small-business/build-web.py` produces the bundled page data and public downloads from pinned raw/extracted files. `node research/small-business/verify-web.cjs` checks a running local preview (default localhost3014; override `SMALL_BUSINESS_PREVIEW`) using Playwright and axe. Browser screenshots and diagnostics go to ignored `runtime-data/small-business/`.

Start the isolated preview with `npx tsx research/small-business/preview.ts`. It uses port3014 by default (`SMALL_BUSINESS_PORT` overrides it) and an ignored build cache under `runtime-data/small-business/.next`, preventing collisions with other running site previews. See [web validation](web-validation.md) for the checks and remaining evidence gaps.

## October 5 OSB review

The complete Year One report and its announcement now inform the page: two additional exhibits, all reported category shares and district counts, four business stories, three partner statements, the delivery model and a current help link. See [the page-by-page coverage review](osb-source-review.md). The original report hash is unchanged; a new 126-versus-136 event discrepancy is explicit. The original 16-figure standalone atlas remains unchanged.
