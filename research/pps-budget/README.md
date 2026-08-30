# PPS budget research corpus

The working corpus for the Portland Civic Lab deep dive into the Portland
Public Schools (Multnomah County SD 1J) budget, FY2016-17 through FY2026-27.

## Map

- `sources.md` — GENERATED master registry (do not hand-edit; regenerate via
  `npx tsx ingest/pps-budget/build.ts`). The source of truth is
  `ingest/pps-budget/sources.ts` (+ `sources.generated.json`, harvested from
  the PPS index pages on 2026-08-29 by `harvest-index.ts`).
- `document.md` — the research document (the deliverable).
- `data/` — committed structured extracts. Every row carries
  `fy, basis, doc_id, page` provenance. `data/derived/` holds computed series
  (reproducible via `ingest/pps-budget/analysis/`). `data/NOTES.md` carries
  per-table caveats; `data/COVERAGE.md` is generated.
- `notes/` — working ledgers: `gaps.md` (what the public record lacks),
  `tensions.md` (contradictions to resolve), `records-requests.md` (drafted,
  unsent), `per-year/` (extraction worksheets), `boardbook-harvest.md`,
  `harvest-2026-08-29.txt` (raw index-page harvest).

PDFs and text layers live in `runtime-data/pps-budget/` (gitignored, multi-GB).
`ingest/pps-budget/checksums.lock.json` is committed and pins exactly what was
extracted from; every registry URL also has a Wayback snapshot recorded there.
Rebuild the corpus from nothing with:

```
npx tsx ingest/pps-budget/archive.ts
npx tsx ingest/pps-budget/fetch.ts --tier 2
```

## House rules

1. **Actuals beat plans.** Budget books are plans; ACFRs are audited actuals.
   Rows carry a `basis` field (actual-acfr > actual-budgetary > revised >
   adopted > approved > proposed). The document uses the best available basis
   and always says which.
2. **Every number traces.** A figure enters `document.md` only from a CSV with
   doc+page provenance, cited inline as `[docId p.N]`.
3. **Every dollar gets a ledger tag**: locked, committed, movable, or unknown.
   No exceptions, in prose or charts.
4. **The Maine firewall.** portlandschools.org and portlandk12.org are
   Portland, Maine. Domain-verify every figure. Oregon school budgets never go
   to a voter referendum.
5. **NOE and F-33 never share a chart.** Oregon's chart of accounts and the
   federal finance survey measure different things.
