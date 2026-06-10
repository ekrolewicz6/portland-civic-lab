# Data Storage Strategy

**Last updated:** June 9, 2026

## Where data lives

| Location | Role | In git? |
|----------|------|---------|
| **Postgres** (Supabase) | Authoritative store. All dashboard reads go through it (with a `dashboard_cache` layer). Cron routes and ingest scripts write here. | No (schema in `src/db/schema.ts` + `drizzle/` migrations) |
| **`runtime-data/`** | Local working directory (~2.8 GB): downloaded source files (Zillow CSVs, ODE XLSX, HUD XLSB), scrape caches, JSON snapshots used by seed scripts, and the contact-form local fallback. | **No — gitignored.** Never commit this. |
| **`data/`, `etl/`, `scripts/`** | Local convenience **symlinks** only: `data → runtime-data`, `etl → ingest/legacy/python`, `scripts → ingest`. They exist so old commands and muscle memory keep working. | No — gitignored |
| **`ingest/`** | TypeScript ingest/seed/sync scripts (the real ones). Python legacy lives in `ingest/legacy/python`. | Yes |

## History of the migration (April 2026)

The repo originally committed raw data files (PDFs, XLSX, CSVs, scraped permit
JSON) under `data/`, with Python ETL under `etl/` and helper scripts under
`scripts/`. In April 2026 those directories were physically moved
(`data/` → `runtime-data/`, `etl/` → `ingest/legacy/python`,
`scripts/` → `ingest`) and replaced with symlinks.

The ~7,400 file deletions in git status are the second half of that
migration: removing the old tracked paths from git. Committing them
untracks roughly 500 MB of binaries from the working tree (note: they remain
in git history unless the history is rewritten).

## Rules

1. **Never commit data files.** If a seed script needs a source file, it
   belongs in `runtime-data/` and the script's header comment should say
   where to download it.
2. **Postgres is the source of truth** for everything the site renders.
   `runtime-data/` snapshots are inputs and caches, not a database.
3. **New ingest code goes in `ingest/`** (TypeScript). Don't add to the
   legacy Python tree.
4. **Fresh clones won't have the symlinks** (they're gitignored). If you need
   them: `ln -s runtime-data data && ln -s ingest scripts`.
