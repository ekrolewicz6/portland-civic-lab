# Derived tables and data lineage

`build.py` creates these CSVs and `checks.json`. Values are source units unless the column ends `_usd`; Census SUSB PAYR and RCPT are multiplied by 1,000 to convert from reported thousands of dollars. Derived shares are proportions, not percentages. Blank numeric fields are missing/suppressed, never zero. The original Census noise flags and BLS disclosure codes are preserved.

| File | Grain and period | Headline use | Source |
|---|---|---|---|
| `city-small-employment-report-2019-2024.csv` | Portland city × two exact chart endpoints | Reported small-business jobs; size unit unresolved | `prosper-insights` Figure 1.06 |
| `metro-size-2022.csv` | Nine selected MSAs × SUSB enterprise-size rows, 2022 | Size shares, payroll/job, peers | `susb-msa-2022` |
| `county-size-2022.csv` | Multnomah County × four nonoverlapping enterprise-size bands, 2022 | County shares | `susb-county-2022` |
| `metro-sectors-2022.csv` | Portland MSA × 2-digit NAICS × all-size or <500, 2022 | Sector jobs/firms and small share | `susb-msa-2022` |
| `qcew-sectors-2019-2025.csv` | Multnomah County private × 2-digit NAICS × 2019/2025 | Job changes; annual averages | `qcew-2019`, `qcew-2025` |
| `nonemployer-sectors-2023.csv` | Multnomah County × 2-digit NAICS, 2023 | Businesses with no payroll employees | `nes-2023` |
| `bds-metro-2019-2023.csv` | Nine selected MSAs × 2019–2023 | Establishment entry/exit, job flows | `bds-msa-2023` |
| `bds-portland-firm-age-2023.csv` | Portland MSA × five firm-age categories, 2023 | New firms versus established/left-censored groups | `bds-msa-age-2023` |
| `checks.json` | Source hashes and reconciled totals | Validation | Raw files above and OSB PDF |

Raw file hashes pinned by `build.py` / `checks.json`:

- Revised SUSB metro text: `e90e9f9029af62b954d98e4bdad82f504f36aad2508e17d2240d53beb336230d`.
- SUSB county workbook: `21ba2207f8bd76683945437e66091a5c84c80c1ef551b8ee2badd15afb1ea833`.
- BDS metro CSV: `1efaa54b3926fddd410719cb77dcb65a8f2f47eb5ba070d0037be60cc6fc3b79`.
- BDS metro by firm age CSV: `b2b22253b0fd51569e79a800dccc9e17afbfaff7f7395738fa90d1cc4ffd6015`.
- Reused QCEW 2019: `b7692e311b2744c3e3ad35a3ce205a2b744096a3ddfa9c1500b43957025df142`.
- Reused QCEW 2025: `04d3b9a1b4d79c6fec3de32045a0e5c18910ce8f1ed3febd52a3f1acc48a7bbb`.
- Reused NES 2023 ZIP: `65030a96b0e5542ca7b52aa954c2c66cf1cff0f936e8b2b225375d3d186bac28`.
- Prosper Insights PDF: `aa21830664a1fa7faa4b7491b24a1b90a2450da249f017c506dca482c13b36c0`.
- User-supplied OSB PDF: `bf3f83dd299ae9a39f6df33365bcaf0a93a5fc11420a585d8677fb25dd618002`.

The SUSB MSA file was [revised July 22, 2025](https://www.census.gov/data/datasets/2022/econ/susb/2022-susb.html); the published notice says extraneous estimates were removed. The current pinned file is the revised edition. OSB chart values are transcribed from page 4, with district figures from page 2; these are not part of a city census. QCEW and NES cached inputs are from the existing maker-economy corpus; source URLs and periods are listed in `sources.tsv`. Inspect [methods](../methodology.md) before combining tables. **Do not add 2023 NES to 2022 SUSB or treat receipts as value added.**
