# Portland maker economy research corpus

**As of September 15, 2026.** Phase-one public research and publication materials for the [website deep dive](https://www.portlandciviclab.org/deep-dives/maker-economy). Community research is prepared but has not been fielded. No outreach sent.

## Read the findings

- [Deep dive](document.md) — publication-ready narrative about physical production, business activity, and livelihoods.
- [Production and places](case-studies.md) — twelve case sections spanning fabrication, furniture, leather, home ceramics, printmaking, and shared facilities.
- [Definitions and methodology](methodology.md) — measurement units, code boundaries, exclusions, and inference limits.
- [Economic tables](data/derived/tables.md) — reproduced payroll, nonemployer, and definition-sensitivity comparisons.
- [Community research kit](community-research-kit.md) — operator/maker questionnaires, interview guide, pilot, recruitment, privacy, and analysis protocol.
- [Gaps and unsent inquiries](notes/gaps-and-requests.md) — public-versus-community evidence matrix, prioritized questions, source tensions, and agency drafts.
- [Source registry](sources.md) — source URLs, periods, geography, and archive status.

## Evidence and file roles

| File | Role |
|---|---|
| `sources.json` | Human-maintained source identifiers, titles, URLs, geography, periods |
| `checksums.lock.json` | Raw-source SHA-256 checksums and archive failures; do not silently refresh |
| `classifications.json` | Exact industry selections; broader categories are context, not a maker taxonomy |
| `data/qcew.csv` | 51 rows: 17 county payroll categories across 2019, 2023, 2025; private ownership |
| `data/nonemployers.csv` | 14 county NES rows including benchmark; 2023 establishments and receipts |
| `data/observations.csv` | 19 original-report or website observations with locators |
| `data/ecosystem.csv` | 21 discovery entries; producers, shared facilities, suppliers and networks |
| `data/derived/` | Generated comparisons, sensitivity, study checks, and readable tables |

These counts describe the corpus, not Portland's population of makers. The same facility hosts PDX Hackerspace and Dorkbot; the discovery entries are not all separate sites. The home maker's exact location is deliberately not published or treated as city-verified.

## Reproduce

Run from repository root after installing the repository's Node dependencies:

```sh
# Offline: reproduce calculations and source registry from committed evidence.
npx tsx ingest/maker-economy/build.ts
npx tsx ingest/maker-economy/build-makers.ts

# Offline: check generated outputs without modifying them.
npx tsx ingest/maker-economy/build.ts --check
npx tsx ingest/maker-economy/build-makers.ts --check

# Prepare and verify the website copies after editing the corpus.
npx tsx ingest/maker-economy/publish.ts
npx tsx ingest/maker-economy/publish.ts --check

# Online: restore missing hash-pinned source files; preserve changed remote pages as candidates.
npx tsx ingest/maker-economy/archive.ts

# Re-extract numeric evidence from the archived raw QCEW CSVs and Census ZIP.
# Uses the system unzip executable; raw files remain gitignored.
npx tsx ingest/maker-economy/extract.ts
npx tsx ingest/maker-economy/build.ts --check
```

The extract script requires archived `qcew2019.csv`, `qcew2023.csv`, `qcew2025.csv`, and `nes2023.zip` beneath `runtime-data/maker-economy/`. It validates hashes before parsing. Offline reproduction needs only the committed extracts, so inaccessible historical web pages do not block calculations. PDF/web observations and the inventory are curated manually and cite document pages or section headings; they are not auto-refreshed by the numeric extractor.

## Source preservation

Original PDFs, HTML, ZIPs, text layers, and review images live in `runtime-data/maker-economy/` and are not committed. The lockfile pins the downloaded originals. Four BLS documentation files could not be archived directly, although their content was reviewed through web retrieval. Numeric bulk files were archived. See the gaps note for failed API and obsolete URL attempts.

When updating, preserve the prior vintage, inspect changed source content, update dated observations intentionally, and regenerate the calculations. Recheck every article number and citation. Current offered prices and undated website membership counters cannot be updated by assuming the new retrieval date is their measurement period.

## Quality controls

The build checks row uniqueness, provenance, source references, geographic codes, suppression preservation, study arithmetic, non-nested sensitivity baskets, local artifact links, and generated-file consistency. Run `npx tsc -p ingest --noEmit` for TypeScript validation. Website rendering uses generated publication and figure files; no API, database, or migration changes are needed.

No individual financial responses, private home addresses, or the contact-form submitter's email are included. The submitter is acknowledged only as a maker who prompted the question.

## Expanded directory extraction

`data/directory-listings.csv` contains 597 source records. `data/directory-links.csv` preserves reviewed and unresolved matches; `data/historical-survey.csv` pins the historical chart inputs. The directory extractor needs Python 3 with lxml: `python3 ingest/maker-economy/extract-directories.py`. Restore the four pinned HTML files first. The offline TypeScript figure build needs only committed CSVs. It emits `src/lib/maker-economy/figures.json`; the publication build copies new evidence downloads.

Run the calculator verification with `npx vitest run tests/maker-economy.test.ts`. The browser review covers source filtering, search, calculator inputs, narrow layouts, and visual captions.
