# ORESTAR campaign-finance downloader

ORESTAR's public campaign-finance search reports the full matching record count,
but displays and exports at most 5,000 records. The Oregon Secretary of State's
own user manual says to narrow searches and combine multiple exports; the public
export endpoint does not expose a supported limit or offset parameter.

`download-contributions.ts` automates that supported workflow for campaign
finance. It can produce separate contribution and non-contribution datasets, or
one file containing all six transaction families:

- Contribution
- Expenditure
- Other
- Other Account Receivable
- Other Disbursement
- Other Receipt

- starts with 14-day, non-overlapping transaction-date windows;
- recursively splits any window above 5,000 rows;
- falls back to contribution subtype if a single day is above the cap;
- refuses to continue if a slice still cannot be made safe, rather than silently
  accepting a truncated export;
- verifies every downloaded workbook/CSV row count against the search result;
- stores SHA-256 checksums and progress in a resumable manifest;
- re-queues transient failures after continuing with the remaining slices, and
  records each failure and its last error in the manifest;
- appends every request retry and slice failure to `events.ndjson` so recovered
  faults are retained for later audit rather than disappearing from the record;
- rejects duplicate transaction IDs while producing one merged CSV;
- rechecks the full live count before declaring the dump complete.

Run it from the repository root. These two commands produce the requested
separate datasets:

```sh
npm run orestar:contributions -- \
  --start 2025-01-01 \
  --end 2026-09-27

npm run orestar:non-contributions -- \
  --start 2025-01-01 \
  --end 2026-09-27
```

`npm run orestar:transactions` produces a single file containing all transaction
families instead. The commands accept `--dataset contributions|other|all` when
the script is invoked directly.

After both separate datasets exist, build analysis-ready entity and relationship
indexes:

```sh
npm run orestar:entities -- \
  --start 2025-01-01 \
  --end 2026-09-27
```

This produces one entity table and one activity/relationship table. ORESTAR
committee IDs are authoritative keys when present. Counterparties without an ID
receive a deterministic key derived from normalized name, type, and public
address fields. Those fingerprints are useful for analysis but should not be
treated as authoritative person identities.

The default output is ignored working data under
`runtime-data/orestar/contributions-START_END/` or
`runtime-data/orestar/non-contributions-START_END/`. Rerunning resumes completed
slices. Use `--refresh` to replace them or `--merge-only` to rebuild the merged
CSV from the verified raw files. `--slice-days`, `--delay-ms`, and
`--failure-rounds` expose the throughput/reliability settings; the defaults are
tuned to reduce total requests while keeping every export below the hard cap.

All ORESTAR browser collectors are headless by default so they do not open
windows or interrupt other applications. `--headed` is an explicit opt-in for
supervised troubleshooting; never automatically fall back to a visible browser.
If the security service rejects headless access, stop source collection and
record the gap. Do not work around access restrictions. Source collection uses
one active tab, runs sequentially, and pauses between requests. Do not run
multiple copies against ORESTAR.

## Bulk analysis without browser windows

The fixed 316,926-row snapshot is already local. Run the analytical pipeline in
bulk; it does not visit transactions individually or request remote sources:

```sh
npm run orestar:research
npm run orestar:research -- --jobs=1
```

The default is two concurrent independent jobs, each using at most two DuckDB
threads; numerical-library threads are capped at one per job. Dependent
publication stages wait for their inputs. An exclusive runner lock prevents
accidental duplicate runs. Use `--jobs=1` to leave more resources for other work.

Input and output hashes validate cached stages, including every evidence CSV
and archived enrichment artifact. Rerunning reuses unchanged successes and
retries failed stages; `--force` deliberately recomputes all stages.
`runtime-data/orestar-analysis/research-runs/events.ndjson` preserves attempts,
failures, timings, and cache reuse; per-stage logs retain diagnostic output.
The consolidated `research/campaign-finance/failure-register.json` distinguishes
failed retrievals from unattempted coverage.

Only extra source fields absent from the exports (for example independent
expenditure targets and association details) require separate source retrieval.
Missing detail does not prevent bulk analysis of fields already available.
The current working report does not claim the entire research programme is
complete. No deployment or pre-2025 backfill is part of this command.

The default dataset excludes deleted transactions and expired versions of
amended transactions. This is the appropriate analysis view when totals should
not double-count superseded filings. Contribution subtypes remain in the export:
cash, in-kind, forgiven obligations, and non-exempt loans can be separated later.

Raw exports may include public contributor addresses, employer, and occupation
fields. Keep the complete dump in ignored `runtime-data/`; publish only fields
needed for the analysis.

The transaction exports and derived entity table cover financial activity. A
complete institutional mirror would also need separate public-search harvests
for committee registration history, associated people, candidate filings,
measures/petitions, certificates, and election activity. The entity metadata
states this limitation explicitly so transaction-derived identities are not
mistaken for complete registration profiles.

Official references:

- [ORESTAR transaction search](https://secure.sos.state.or.us/orestar/gotoPublicTransactionSearch.do)
- [Search Transactions tutorial](https://sos.oregon.gov/elections/Documents/orestar-search-transactions.pdf)
- [ORESTAR transaction filing manual](https://sos.oregon.gov/elections/documents/orestartransfiling.pdf)
- [Campaign Finance Manual](https://sos.oregon.gov/elections/documents/campaign-finance.pdf)
