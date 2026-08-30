# Gaps ledger — what the public record does not contain

Tracked to closure or to "documented unknowable." Sourced from the 2026-08-29
document census and governance research (full detail in the plan archive).

| # | Gap | Status | Next step |
|---|---|---|---|
| G1 | No bond Official Statements / continuing disclosure on any PPS site (EMMA only) | open | Manual EMMA pull, both issuer names |
| G2 | No public monthly/quarterly interim financials | open | Records request R1 (or the admission none exist) |
| G3 | No SoS performance audit of PPS since 2019-01 | documented | Findings section; 7-year oversight gap |
| G4 | OIPA output minimal; nothing on budgeting/forecasting/position control | documented | Findings section |
| G5 | ~~Bond audit for 2022 missing~~ | **CLOSED 2026-08-30** | The FY2021-22 audit is the Year 4 report (issued Feb 2023), in corpus. Real finding: no audit was ISSUED in calendar 2022 (16-month publication gap during active construction). R2 withdrawn |
| G6 | ~~FY2026-27 CBRC report not on the archive page~~ | **CLOSED 2026-08-29** | The report (presented May 12, 2026) is now posted and in the corpus as `cbrc-2026-27-cbrc-proposed-budget-review`. The 463756ca draft is the FY2024-25 cycle |
| G7 | TSCC FY2026-27 PPS review not located; pre-2011-12 annual reports offline | open | Informal TSCC ask (R8) |
| G8 | No budget-in-brief / multi-year trend doc (the exact SoS 2019-01 deficiency, unremediated 7 years) | documented | Load-bearing finding; we build the trend series ourselves |
| G9 | No published cost model for the 2023 PAT settlement ($175M is press-only); PAT 2011-13 CBA missing | open | Records request R3 |
| G10 | ODE comparative finance lags ~2 years (through 2023-24) | documented | Caveat in peer comparisons |
| G11 | Legacy pps.net URLs dying; docs behind opaque Finalsite UUIDs | mitigated | archive.ts snapshots every registry URL |
| G12 | No index of budget amendments / supplemental budgets | open | BoardBook month-by-month harvest (R9 fallback) |
| G13 | No Adopted FY2026-27 Vol. 2 posted — only "Proposed … Updated 2026-05-06" | open (new, found at harvest 2026-08-29) | Watch the annual-budgets page; ask PPS budget office |
| G15 | Two CBRC PDFs have unusable text layers: the FY2022-23 annual review (completely empty; scanned) and the 2021-22 levy review narrative pages | open | OCR pass (ocrmypdf) before citing either |
| G14 | Actual (not adopted) FTE is not audited or published anywhere public | candidate (from pipeline design) | Verify during extraction; if real, add to findings |

## C8 unverified specifics (from governance research)
1. ~~"Pensioner" ADMw weight~~ — does not exist; dropped from framing.
2. TSCC FY27 PPS review — see G7.
3. FY2026-27 General Fund exact total ($868.6M KOIN vs ~$862M implied) — resolve from adopted Vol. 1 appropriation resolution.
4. PPS construction excise tax rate and annual yield — not located.
5. ODE's computed local-option exclusion limit for Portland SD 1J — records request R7; determines whether the 2024 levy renewal is fully additive.
6. SOFG formal adoption status + "policy diet" outcome.
7. CIR v. PPS docket status (equity staffing formula suit, filed Oct 2025).
8. Executive Order 26-06 on Instructional Time — unread.
9. Carole Smith tenure dates — cited from general knowledge; verify.
10. FY27 budget calendar dates — pull from BoardBook minutes.
11. FY27 salaries+benefits % of GF — use FY26's verified 79.6% until the book is checked.

## Archiving status (2026-08-29)
Wayback Save-Page-Now is rejecting anonymous saves from this IP (429, tiny
quota). 69 snapshots recorded (as of 2026-08-30); the rest are marked FAILED in
`ingest/pps-budget/archives.lock.json` and are retryable with
`npx tsx ingest/pps-budget/archive.ts --retry` once the quota window resets
(try again after a few hours, or authenticate SPN with an archive.org account
for the S3-API rate limits). Local preservation is complete meanwhile: all 115
documents downloaded and checksum-locked.
