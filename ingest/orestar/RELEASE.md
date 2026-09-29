# Campaign-finance publication

## One current database, two publication layers

The current explorer, candidate finance panels, contribution squares, race comparisons and cumulative timeline query the active read-only DuckDB ledger. The researched article, geography classifications, official balances, supplier study and reviewed donor relationships keep their stated analysis dates; a new spreadsheet does not silently rewrite reviewed claims.

Production loads `server-data/campaign-finance/manifest.json` and its checksum-verified `finance.duckdb`. The client receives only necessary rows or precomputed chart data, never the database file. Source records, street addresses, request logs, working notes and original spreadsheets stay in the ignored local archive. The publication database is newly created from a strict column allowlist, not copied from a file whose deleted pages might retain private fields.

## Manual updates

From the research checkout, run `npm run orestar:refresh:manual -- /absolute/path/export.xlsx`. The command validates, privately archives, deduplicates, recomputes financial facts, verifies the active ledger, builds the minimized publication bundle and checks its privacy contract. Changed overlapping rows or unfamiliar matching payors stop for review. Failures and attempts stay in the private manual-refresh log. Repeating an unchanged file is safe.

The local ledger becomes current without a separate public page per day. A production update still requires a reviewed deployment. Do not call unreviewed, partial exports complete; the manifest retains completeness status. The headless daily collector remains sequential and must not bypass source access restrictions.

## Release checks

1. In the research checkout: `npm run orestar:test`.
2. Rebuild the bundle: `npm run orestar:package`. To package into an isolated release checkout, pass `-- --output /absolute/path/to/release`.
3. In the release checkout: `npm run orestar:release:check` and `npm run build`.
4. Run the headless smoke test: `node ingest/orestar/verify-release.mjs http://127.0.0.1:3146`. Screenshots and logs go to an ignored temporary directory, not public assets.
5. Verify the hosted preview, including database-backed routes and downloads, before production. Inspect the built function traces for the minimized database and absence of research/runtime-data originals.

Only finance-related, reviewed source and publication artifacts belong in the release commit. Do not stage unrelated research, local environments, messages, tips, screenshots, exports or private outreach. Production deployments must be explicitly authorized.
