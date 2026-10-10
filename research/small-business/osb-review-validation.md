# OSB source integration validation

October 5, 2026. Update based on the latest published plain-language report at base commit `7cea0953`.

## Source and data checks

- Read all 13 PDF pages and the September 10 announcement; visually inspected the complete numerical charts and district map on PDF pages 4–5.
- Fresh PDF SHA-256 matches the previously archived report. Both new retrieval records are in `osb-review-archive.json`.
- `verify-osb.py` passes: 16 industry categories, seven inquiry channels, five services, 38 CSV rows, all district values, null exact value for agriculture, and the 178-business and 10-event differences.
- Original `verify.py` passes: 68 sources, 36 original claims, 15 program channels, 16 standalone atlas figures and reconciled employment totals. Web claims w17–w24 are additional and separate.
- `osb-source-review.md` records where every substantive source section appears and which decorative/duplicated material was not republished.

## Application checks

- Production build including the existing read-only publication gate passed; focused ESLint passed. Existing WorkOS Edge Runtime warnings and unconfigured local database notices do not affect this static report.
- Full report browser checks passed on the production build: 20 figures, 12 chapters, 22 unique downloads, no console/page errors, no overflow at 768/390/320px, zero scoped axe WCAG2A/2AA/2.1AA violations.
- New OSB checks passed: 28 category rows, four districts, four stories, report-page citation fragments, keyboard expansion of every story, no-JavaScript content, and responsive checks at 1440/390/320px. Zero scoped axe violations with all stories expanded. Desktop and phone screenshots reviewed.
- Headless agent-browser confirms the page renders meaningful content without a framework error overlay.
- Corrected the deep-dive discovery test's stale counts from the original small-business launch (18 total, 11 money, five work). All four focused discovery tests passed: search/filter recovery, history/sorting, no-JavaScript/direct links, and phone/keyboard layouts. Other full-site tests were not rerun locally; this is not an all-site-CI claim.

The source's unresolved totals remain visible. Case-study growth, grant applications, permit coordination and testimonials are not presented as causal outcomes. No outreach, new interviews, API or database changes were made. Production verification is recorded separately after publication.
