# Deep dives chat handoff — saved October 4, 2026

The implementation work in this chat is published. This note preserves decisions, release evidence and unfinished follow-ups so the chat can be archived. It does not authorize new outreach or deployment.

## Published work

All seven PRs below are merged; their exact merge commits and dates are saved in `pull-requests.json`.

- [#66](https://github.com/ekrolewicz6/portland-civic-lab/pull/66): data-center visuals, calculator and real agreement examples.
- [#72](https://github.com/ekrolewicz6/portland-civic-lab/pull/72): campaign timeline event selection updates in place without scrolling.
- [#73](https://github.com/ekrolewicz6/portland-civic-lab/pull/73): plain-language data-center article.
- [#74](https://github.com/ekrolewicz6/portland-civic-lab/pull/74): temporary construction versus ongoing data-center jobs.
- [#76](https://github.com/ekrolewicz6/portland-civic-lab/pull/76): redesigned deep-dive discovery library and original participatory-budgeting analysis.
- [#77](https://github.com/ekrolewicz6/portland-civic-lab/pull/77): data-center typography and responsive readability.
- [#80](https://github.com/ekrolewicz6/portland-civic-lab/pull/80): participatory-budgeting visual voter guide and separate research edition.

Public destinations:

- https://www.portlandciviclab.org/deep-dives
- https://www.portlandciviclab.org/deep-dives/data-centers
- https://www.portlandciviclab.org/deep-dives/participatory-budgeting
- https://www.portlandciviclab.org/deep-dives/participatory-budgeting/research

The final visual-guide release was merged as `0fc4f1605bcae11c236b4bf9fb5d3ca068ed159a`, deployed as `dpl_4XgatWtjF4wo1gupLNwuqHMJtcMG`, and verified on the public domain. This is historical release evidence, not a claim that this is still the site's newest deployment.

## Editorial and design decisions to retain

Deep dives should be visual first, understandable to a tenth grader, and no more complicated than necessary. Define unfamiliar terms, use normal sentences, keep meaningful qualifications, and put sources next to claims. Avoid dense text blocks, fragments that obscure meaning, AI-style rhetorical habits, or illustrations that imply unsupported facts.

The participatory-budgeting guide is approximately 1,860 visible words, with seven sections: ballot outcomes; an illustrated neighborhood journey; complete and equally prominent YES/NO campaign cases; money diagrams and scenarios; settled versus open rules; Metro/Cambridge/Seattle examples; four voter questions and a source shelf. Three verified campaign excerpts appear on each side. Explanatory paraphrases are identified as such. No campaign endorsement is implied.

The guide's minimum funding denominator is the previous year's adopted General Fund discretionary ongoing expenses, not the whole city budget. $16.4M is the ballot's preliminary estimate. The $1M administration scenario is an advocate estimate; $2M/$3M are alternatives. Administration is inside program spending; no new tax does not mean no tradeoff. The guide identifies no guaranteed service-cut list and notes future project costs. Funding, resident process and project delivery dates are distinct. Selected projects are not presented as completed projects.

The full original report, introduction, 14 sections and sources remain in the research edition. All 14 old main-page anchors and five PDF URLs are retained. See `research/participatory-budgeting-2026/visual-guide-review.md` for the complete preservation map and source checks. The original Markdown's September 17–20 research dates were retained, rather than relabeling all historical evidence as newly reviewed.

## Verification and limitations

Eight focused guide/discovery tests passed locally and on production; four guide tests passed on the hosted preview. Screenshots were reviewed at 320, 390, 768, 1024, 1440 and 1920px. Checks include 200% text, reduced motion, keyboard controls, no scroll jump on scenario selection, reading without JavaScript, research rendering, old anchor targets and PDF downloads. Five production PDFs matched their original SHA-256 hashes. TypeScript and scoped lint passed; no production runtime errors were observed during verification.

Full CI run 37103878138: 463 passed, one unrelated Oregon-fire test passed on retry, five skipped, seven failures. The seven failure identities matched baseline main run 36911488433: two campaign navigation tests, the fundraising timeline test, two Oregon-fire guide tests and two Oregon-fire map tests. Do not describe full CI as green. These findings are historical; recheck current status before future work.

Independent human editorial sign-off remains outstanding. The assistant did a source/editorial pass and a rough grade-level calculation, not an independent human review.

The latest supplied AGENTS.md adds an About-page publication check: inspect `/about` and `src/lib/topics.ts`, plus homepage, navigation and deep-dive index, when releasing further changes. The requirement arrived after this guide's release. Do not assume a review was performed retroactively; verify current published listings before making any corrective release. Preserve evidence dates for team/funding/relationship claims.

## Earlier outreach request: unfinished

The user requested graceful, individually relevant feedback emails linking the data-center deep dive to Margaret Hoffman, Michael Jung, Dan Dorran, Greg Dotson, Bill Edmonds, Tim Miller, Jean Wilson, and other relevant readers. Earlier session notes reported ten prepared drafts and zero sends, with sender-domain authentication (SPF/DKIM/DMARC) unresolved. Draft IDs and current mailbox state were not reverified during archive preparation. Reconcile the actual drafts and send ledger before any future send; never assume a draft was sent or recreate uncertain messages blindly.

No outreach was sent during the visual-guide implementation or archive preparation. Current instructions require reading `/Users/edankrolewicz/.codex/policies/email-outreach.md` and using `/Users/edankrolewicz/.codex/tools/email-send-gate.mjs` before any outreach. Sending is sequential under the shared rolling-24-hour allowance. Random delays are not spam-filter evasion. Honor opt-outs, preserve receipts and obtain authorization for any new follow-up workflow. Do not infer authorization to contact additional people from this handoff.

## Local evidence and workspace safety

Durable local archive:
`/Users/edankrolewicz/Projects/portland-civic-lab/runtime-data/chat-archives/2026-10-04-deep-dives`

It contains 135 task evidence files (about 48 MB): screenshots, source captures, tests, release reports and verification scripts copied out of `/tmp`. `manifest.json` records file sizes and SHA-256 hashes. Session-cookie/storage files and raw deployment-state responses were excluded. This archive is local; the concise handoff and release receipts are also saved on a remote Git branch.

Worktrees used:

- `/Users/edankrolewicz/.codex/worktrees/data-center-readability/portland-civic-lab`: final guide and archive handoff. The temporary 3167 server was stopped after publication.
- `/Users/edankrolewicz/.codex/worktrees/data-center-release/portland-civic-lab`: earlier release/library work. Its untracked `research/data-centers-2026-09-29/deployment-verification.json` was copied to the durable archive.

The primary checkout `/Users/edankrolewicz/Projects/portland-civic-lab` has substantial unrelated/stale local changes. Do not deploy it, bulk-commit it, reset it or treat all local differences as unpublished work. Begin future work from current main in an appropriate checkout and compare before copying files. No unrelated local changes were modified during archive preparation. Worktrees and the chat were not archived automatically; active previews or other tasks may still need them.
