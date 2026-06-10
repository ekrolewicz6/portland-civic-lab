# Civic Dashboard Architecture Notes

This app lives at `apps/civic-dashboard/`.

## Ownership

- Owns dashboard UI, API routes, data presentation, and ingestion code.
- Reads canonical shared data from `../../data/datasets/`.
- Reads shared public analysis from `../../data/knowledge/`.
- Keeps app-local generated or scraped files in `runtime-data/`.

## Important Folders

- `src/` - Next.js app and API implementation.
- `docs/data-source-inventory.md` - canonical dashboard data-source inventory.
- `ingest/` - TypeScript ingestion, seeding, scraping, and verification scripts.
- `ingest/legacy/python/` - legacy Python ETL system retained for transition.
- `runtime-data/` - app-local cached or downloaded data. The `data/` path is a compatibility symlink.

New ingestion work should go in `ingest/`. Treat `ingest/legacy/python/` as
legacy unless a task explicitly requires it.
