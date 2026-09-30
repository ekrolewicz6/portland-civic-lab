# Data-center article readability

The article previously used 8–13px text for several explanations, sources, calculator labels and mobile example cards. SVG text also shrank with chart width. The PGE rate panel used translucent white text that was hard to read against green.

The revision uses relative type sizes: 18px for primary explanations, 16px for controls, 15px for supporting notes, and a 14px minimum for short category labels at the default browser font setting. It respects the reader’s default font size, keeps chart labels in HTML, and changes column layouts before text gets cramped. The PGE panel uses opaque, higher-contrast text. Article-specific wrapping of the site header and footer prevents overflow with enlarged text; the global header scrolls away on this article so a larger header cannot cover the section navigation.

## Verification

Run the headless checks against a local preview or the live URL:

```
DC_PREVIEW_URL=http://127.0.0.1:3167 node research/data-centers-2026-09-29/verify-readability.cjs
DC_PREVIEW_URL=http://127.0.0.1:3167 node research/data-centers-2026-09-29/verify-browser.cjs
```

The readability check opens every article disclosure and inspects actual rendered text at widths of 320, 390, 440, 768, 1024, 1280, 1440, 1920 and 2560 CSS pixels. It also checks 200% text at 390 and 1280 pixels and increased letter, word, line and paragraph spacing at 320 pixels. It checks the text-size floor, solid-background text contrast, clipping, horizontal page overflow and 44px-high calculator controls. Screenshots cover the rate panel, hero and calculator results. Gradients and diagrams receive visual review; this is a focused readability check, not a full WCAG audit.

The existing calculator checks cover every example, complete input replacement, positive and negative outcomes, break-even, CSV cash flows, keyboard slider input, cost and post-tax-break scenarios, responsive navigation, and reading without JavaScript. Additional interaction review covers changing examples and reaching break-even at 200% text and a one-year chart. TypeScript, scoped ESLint and whitespace checks are also required.

## Standards used

- [WCAG 2.2: Resize Text](https://www.w3.org/WAI/WCAG22/Understanding/resize-text.html): enlargement to 200% without lost content or functionality.
- [WCAG 2.2: Reflow](https://www.w3.org/WAI/WCAG22/Understanding/reflow.html): readable layouts at 320 CSS pixels (equivalent to a 1280px-wide viewport at 400% zoom).
- [WCAG 2.2: Contrast Minimum](https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum.html): 4.5:1 for normal text and 3:1 for large text. WCAG does not prescribe a universal minimum pixel size; this article’s type-size floor is a design choice.
