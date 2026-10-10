# Webpage validation — October 3, 2026

Route: `/deep-dives/small-business`. Prepared for publication with the deep-dive library, About topic and sitemap. Production-build verification passed in an isolated checkout based on the current live commit `8d7908473ac0276ca004bc899ebaa7d8240d1ecd`; deployment and live verification follow the release push.

- All12 chapters and18 visual exhibits render in a headless Chromium browser.
- Numerical interactions checked: size threshold and contribution measure; industry sorting; observed versus industry-standardized peer shares; metropolitan sample restriction; sector selection by keyboard; entry/exit metro selection; business journey; carrying-cost calculation; all three policy-cost envelopes.
- Edge cases checked: owner expenses exceed receipts; assumed additional program effect is zero; source search returns no matches; industry adjustment disabled for non-job measures.
- Twenty download links returned200 and nonempty content. Chapter anchors and unique element IDs checked.
- No page exceptions or console errors in final interaction pass.
- No horizontal page overflow at768,390 and320px; representative desktop and mobile screenshots reviewed.
- The report passes axe WCAG2A/2AA/2.1AA automated checks after contrast corrections. Automated checks are not a complete accessibility certification; keyboard behavior and accessible table alternatives were also checked.
- TypeScript `npx tsc --noEmit` and focused ESLint pass.
- Original corpus verification passes:68 registered sources,36 claims,15 program channels,16 standalone figures, metro1,084,535 jobs and county439,591 jobs. Archive hash checks pass.
- New metropolitan and industry-standardized calculations reproduce through `build-web.py`; raw source hash is pinned. New claims and additional source readings are separately logged.

Large source data are in ignored runtime-data and are not committed. Browser artifacts and machine-readable results are in `runtime-data/small-business/`. The page bundles static derived evidence and requires no new production API, database table or external service.

Remaining evidence limitations are substantive: city size-unit ambiguity; unreconciled OSB district/interaction totals; Chamber20%/28%; absent city owner-profit distribution, representative worker-benefit detail, complete survival cohorts, causal program effects and a valid local GDP split. They remain visible in the report.

## Release checks

- `npm ci` and `npm run build` succeeded on the release checkout; the existing read-only campaign-finance publication gate also passed.
- The same browser suite passed against `next start` on the production build: 12 chapters, 18 figures, 20 downloads, zero page exceptions, zero console errors and zero scoped automated accessibility violations.
- Catalog card, About “Work on this” contact link, sitemap entry and generated PNG social image were verified.
- Existing authentication-library Edge Runtime warnings remain in the build; compilation and prerendering succeeded.

## Plain-language and readability pass (October 3, 2026)

Branch `claude/small-business-readability`, based on release commit `76f330a1`. Copy on the page and in every chart was rewritten in plain language; no source figure changed. The Census terms map to page terms as follows: enterprise → company, establishment → business location, receipts → sales, payroll → pay, nonemployer → business with no employees, location quotient → share of jobs here compared with the U.S.

- Two derived statements were added to the claim ledger as `w15` (13 of 18 county industries below 2019 employment) and `w16` (only Sacramento above Portland among the nine metros).
- No rendered text is below 12px at 1440, 1280, 768 or 390px, including chart labels after scaling. No text is clipped and the page does not scroll sideways at those widths. The chapter navigation fits on one row at 1280px and wider.
- `verify-web.cjs` was updated to the new headings and control labels and passed against the local preview before release: 12 chapters, 18 figures, 20 downloads, all interactions, 768/390/320px overflow checks, zero console errors and zero scoped axe violations. `npx tsc --noEmit` and ESLint on the page and its components pass.
- Measured on body text, the Flesch-Kincaid grade moved from about 11.5 to about 7.5. The page has roughly 23% more words because telegraphic fragments became full sentences.
- The page title in metadata and the About topic are unchanged. The deep-dive index card and the social image now use the new headline.
