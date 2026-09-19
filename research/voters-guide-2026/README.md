# November 2026 voters guide

Research edition dated September 18, 2026. Authored briefs live in `src/lib/voters-guide/`; `/voters-guide` renders the guide. This is a substantial working edition, **not a completed independent investigation of every candidate**. No candidate endorsements, preference scores or personalized political recommendations are produced.

## Evidence and reproducibility

- `source-manifest.json` records URLs and SHA-256 hashes of retrieved source representations. HTML entries are hashes of normalized text, not original HTML. PDF and XLSX entries hash the downloaded originals.
- Working downloads and extractions are in ignored `runtime-data/voters-guide-2026/`. Do not publish the complete ORESTAR export: it includes old elections and unnecessary personal contact/address fields.
- `state-roster.json` retains only public ballot names, offices, parties and filing identifiers. The official export contained 261 November 2026 filing rows. Filter election exactly, require qualification, exclude withdrawals, and consolidate cross-nominations by office/name when displaying people. Do not count parties as separate candidates.
- The live ORESTAR `currentElection` shortcut changes over time. Preserve the dated snapshot; verify individual filing IDs and current certification before later publication.
- Local pamphlets contain candidate-authored statements, not government verification. Page citations use PDF page indices starting at 1, not printed page labels. Check complete page context when column extraction clips text.
- Portland includes every named candidate on the September 3 certified list: 21 in District 3, 12 in District 4, one auditor. Withdrawn/disqualified entries are excluded. County/city lists are separate from pamphlet participation.
- Council Lab was used as a discovery index. The six incumbent Moda votes were checked at official resolution 37750, **final amended nonbinding term sheet on August 12**, not intermediate amendments. Council Lab’s withheld automated synthesis was not treated as evidence.
- The same House roll call (July 3, 2025, #190, concurrence with the Senate amendment to H.R. 1) is included for all six congressional incumbents. A package vote is not a separate vote on each provision.

## Editorial rules

Attribute campaign claims; separate interpretation, records and open questions. Do not infer intent from identity, donors, endorsers or silence. Explain practical effects and office authority without recommending a candidate. Give each candidate the same visual prominence and comparison fields. Alphabetize displayed names and never preselect a candidate. Missing evidence is a research gap, not a negative finding.

Unverified accusations in campaign material are excluded. Do not quote audio/transcripts until the recording, speaker, date and timestamp have been checked. A stale page is labeled historical/undated rather than assumed current. An incumbent’s claim of success requires an independent outcome check, not merely proof of an appropriation.

## Work remaining beyond the initial Council release

1. Independent human editorial review of every brief against its cited source, with conflict disclosures.
2. Complete the visibly missing candidate briefs and regional legislative, judicial and remaining municipal coverage. Include minor-party candidates using the same criteria.
3. Broaden record checks beyond the common roll calls; examine budgets, outcomes, primary-source interviews, debates, changes in position and campaign finance.
4. Reconcile the state pamphlet after its announced September 29 release and recheck final rosters/withdrawals.
5. Resolve any conflicting election instructions against current certified ballots; never infer a voting method from the number of vacancies.
6. If candidate outreach is authorized later, send the same core questions and deadline to everyone. Do not claim that an unanswered editorial question was sent or refused.

## Research log

- 2026-09-18: Initial local working edition created. Official lists checked separately from statements. State export resolved an incorrect secondary-source cross-nomination for David Brock Smith: the checked qualified filing is Republican; Gary Lyndon Dye holds the Libertarian filing.
- 2026-09-18: Missing pamphlet participants retained, including Daniel Miller (Gresham), Kimberly Culbertson (Hillsboro), Shawne Martinez (Tigard), and Patrick Walsh (Lake Oswego).
- 2026-09-18: Older Bentz issue-page text and Dye’s 2020-branded site flagged rather than silently treated as new 2026 commitments.

These are construction notes, not corrections to a previously published edition. Append material corrections with the old assertion, new assertion, supporting evidence, reviewer and date.

## Reproduce and check

```sh
npx tsx ingest/voters-guide/extract-state-roster.ts runtime-data/voters-guide-2026/state-filings.xlsx /tmp/voters-guide-roster.json
npx tsx ingest/voters-guide/verify.ts
npx playwright test e2e/voters-guide.spec.ts
```

The extractor explicitly filters the November 2026 election and retains only four public filing fields. The downloaded export includes earlier elections; do not trust the URL parameter alone. The saved narrowed roster was reproduced identically. SheetJS emits ZIP size warnings for the state-generated workbook; the rows were also read independently with Python/openpyxl. The validator checks candidate and party sets for every covered state/federal office, stable IDs, required evidence, comparable roll calls, and available source-file hashes. These are integrity checks, not automated judgments of truth or neutrality.

The September 18 edition now contains 48 races and 153 candidates, including eight regional Senate races and five initial House races. Legislative expansion is a research sequence, not a competitiveness ranking. Remaining races and candidate gaps are disclosed publicly. Oregon City commission instructions are deliberately deferred to the official ballot because current filing material and an older charter explanation did not resolve the precise ballot format consistently.

## Council publication scope

The first public release includes Districts 3 and 4 only: two races, 33 candidates, 30 substantive briefs and 31 portraits. `src/lib/voters-guide/published.ts` is the explicit allowlist used by all public guide pages, the sitemap and JSON download. Other research remains unpublished; direct URLs for unpublished races return 404. Human review and other limitations remain visible in the public edition.
