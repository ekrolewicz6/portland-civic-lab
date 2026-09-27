# Repeat-photo feature verification — September 26, 2026

Scope: server-rendered teaching example in the first chapter of “Why burn this place?”, original approved image, source citations, research assessment and acquisition manifest. No ingestion/schema changes or outreach sends.

- `npx tsc --noEmit`: passed.
- `npx tsc --noEmit -p tsconfig.oregon-fire.json`: passed.
- `npm run build`: passed; existing WorkOS Edge Runtime warnings remain.
- Repository lint: initial `npm run lint` included previously generated `.vercel/output` bundles and reported 99 generated-code errors. `npx eslint . --ignore-pattern '.vercel/**'`: passed on application, ingestion, tests and research source scripts. No source error was concealed.
- Focused Playwright production-build suite: **3 passed**, including existing dossier/export/correction flow, mobile chapter/metadata checks, and new JavaScript-disabled photo interpretation/date/place/keyboard-disclosure checks.
- First new-test run stalled on browser stability checks for a click without JavaScript. Replaced it with focus + Enter, verifying native keyboard behavior; the rerun passed. No application workaround or forced click was used.
- Chromium desktop 1440×1050 and mobile 390×844: reviewed screenshots; no page errors or horizontal overflow. Responsive original pair loaded in both.
- Public image SHA-256: `e178cf35c7e0538d569f75ac62a9d42886c89686db0fc9813b4d126526d8f616`, identical to the downloaded source.
- React review: server component; static direct imports; native disclosure; informative alt text, caption and full-resolution link; no new client state, dependency or data-fetch waterfall.
- Privacy: feature and evidence derive solely from public USGS/Cambridge records. Original PDF/CSV/XML remain in ignored runtime acquisition storage. Only the approved photo pair enters public assets.

Publication uses the existing production Git deployment. Live verification follows readiness; earlier production remains available until the new successful deployment replaces it. Independent scientific review and Oregon repeat-photo acquisition remain outstanding.

Final readability adjustment: new evidence notes use 14px text and #455545 on the cream background rather than inheriting 12px muted text. Rebuilt successfully and repeated all three focused editorial tests; all passed.
