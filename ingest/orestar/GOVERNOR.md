# Governor's race finance edition

The page at `/deep-dives/campaign-finance/governor` and the fundraising panels on `/voters-guide/oregon-governor` read one precomputed file, `src/lib/campaign-finance/governor-data.json`. It is a dated edition. It does not move when the active ledger is refreshed.

## Two layers on the page

The two lead charts (cash raised and cash paid out per candidate over time) and the block on money in, money out and where payments went are read from the published ledger on every request, through `governorMoney()` in `src/lib/campaign-finance/money-lead.ts`. They move whenever the ledger is refreshed and deployed.

Everything below them is the dated edition in `governor-data.json`. Its headings state findings, so it changes only when it is rebuilt and reread.

A candidate whose latest payment is more than three weeks older than the ledger is flagged on the page, so a spending line that stops early is read as a gap in the records.

Both lead charts open on the same month: the first month in which money in plus money out reaches 2% of its final total (`activeStart` in `src/lib/campaign-finance/money-flow.ts`). A line that began earlier enters at the left edge holding what it had already reached, so its last point still equals the legend total. The caption names the month and the amount carried in. The council page's lead charts follow the same rule.

Pointing at a line, tapping it, or stepping to it with the arrow keys shows the campaign's name and its running total on that date (`MoneyLines.tsx`). The reading always sits on a date the line covers.

## Rebuild

From the research checkout, which holds the ledger under `runtime-data/`:

```sh
npm run orestar:governor
```

From another checkout or worktree, point at the checkout that holds the ledger:

```sh
/path/to/research/runtime-data/orestar-analysis/py312/bin/python \
  ingest/orestar/analysis/publish_governor.py --data-root /path/to/research
```

The script opens the active DuckDB snapshot read-only, checks its SHA-256 against `research/campaign-finance/active-snapshot-manifest.json`, and writes:

- `src/lib/campaign-finance/governor-data.json` and an identical `public/data/campaign-finance/governor/data.json`
- nine evidence CSVs in `public/data/campaign-finance/governor/`, each with its checksum recorded in the JSON

It downloads nothing. It asserts that every breakdown adds up to the committee's cash total and refuses to write an empty evidence file.

After a rebuild, run `npx vitest run tests/campaign-finance`. One test, "still supports the sentences written on the page", fails when a rebuilt edition no longer matches a fact stated in the page's headings or lead sentences. Reread `src/app/(public)/deep-dives/campaign-finance/governor/page.tsx` before changing that test.

## Reviewed inputs

`ingest/orestar/governor-review.json` holds everything that is a judgment and not a calculation:

- candidate to committee links, each with its basis, source and retrieval date
- sponsor groupings for committees and associations that gave $50,000 or more, each with a one-line basis and a source where the name alone is not enough
- the four dated events on the timeline
- legal and reporting context: the 2027 contribution limits, filing deadlines, the September 16 carpenters transfer and OPB's October 1 balances

Change that file, not the script, when a link, grouping or event needs review. Do not add a sponsor grouping without a basis.

## Definitions

- **Cash**: `cash_contribution` records, gross, before refunds. In-kind support, loans and refunds are separate.
- **Source**: one conservative record group (`entity_id`), which is one reported name, type and address. Spellings are never merged.
- **Combined small gifts**: ORESTAR's "Miscellaneous Cash Contributions $100 and under" entries. They count toward totals and carry no names or addresses.
- **Kind of source**: the filing's contributor type, except that reviewed committees and associations take their reviewed sponsor group. Unreviewed committees stay under "other", so union and trade totals are minimums.
- **Gift-size band**: the source's total to that committee since January 1, 2025.
- **Oregon and other states**: the state reported for the contributor.
- **County**: named individuals only. ZIP code to county through `ingest/orestar/reference/oregon-zcta-county-2020.csv`, which assigns each Census ZIP area to the county holding most of its land. Post office box ZIP codes fall back to the county holding at least 80% of that city's placed gifts. ZIP codes come from the private raw records and are never written out.
- **Paid out**: `cash_payment` records. Payables are not added to their later payments.
- **Cash left on the comparison date**: official 2026 opening balance plus every filed cash movement through the last date both committees have payments on file.

## Reference files

- `ingest/orestar/reference/oregon-zcta-county-2020.csv`: derived from the Census Bureau's 2020 ZCTA to county relationship file, `tab20_zcta520_county20_natl.txt` (SHA-256 `3ed41278d637dc249e0323306f68be8a6c234e3090f4de88ef328dee71aeaaaf`).
- `src/lib/campaign-finance/oregon-counties.json`: Oregon county outlines from the Census Bureau's 2023 cartographic boundary file `cb_2023_us_county_5m`, projected to an 800 by 588 drawing. Polygons only.

## Limits to keep stating

- The ledger behind this edition is a manual export whose completeness is not verified. Late filings, deletions and amendments can be missing.
- Kotek's committee files payments about 30 days after making them and Drazan's about one day after. Any spending or balance comparison has to use a date both have reached.
- Outside spending is not attributed to this race in the transaction export. Only reviewed detail records name a target, and that review is incomplete.
- Brett Smith has no committee among filers with transactions. That is missing coverage.
