# Portland participatory budgeting: independent research

Baseline research: September 17, 2026. Campaign packet update: September 20, 2026. Election: November 3, 2026. Measure: 26-267.

- **[Read the formatted report](independent-analysis.html)** — approximately 8,000 words with navigation, linked sources, and printable styling.
- **[Editable full voter analysis](independent-analysis.md)** — proposal, budget tradeoffs, strongest arguments on both sides, evidence from other cities, and campaign claim checks.
- **[Read the short voter brief](voter-brief.md)** — a quick introduction suitable for sharing.
- **[Read the research and verification notes](research-notes.md)** — source inventory, unresolved questions, methodology, and publication cautions.

The Next.js route `/deep-dives/participatory-budgeting` reads the full analysis directly from the Markdown source. The HTML edition remains a standalone local reading copy. All six campaign additions are documented in [campaign-materials-review.md](campaign-materials-review.md). The five original PDFs are in `public/research/participatory-budgeting/`; third-party source rights remain with their owners.

To rebuild it after editing the Markdown, run `node research/participatory-budgeting-2026/build-reader.mjs` from the repository root. It uses the repository's existing React Markdown dependencies; no new rendering dependencies are required.

`sources/` contains working source captures and official documents retained for verification. These are research materials, not a package for republication. Campaign captures record the text available on September 17, 2026; claims and endorsements can change. Official documents retain their original dates.

This is an independent desk-research analysis, not an endorsement, legal opinion, formal systematic literature review, or campaign-finance audit. Campaign-supplied documents inform the September 20 update. Private correspondence is not reproduced or treated as an interview. Neither campaign approved the analysis.
