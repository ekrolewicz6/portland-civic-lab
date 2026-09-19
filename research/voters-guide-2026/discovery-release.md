# Guided introduction — September 19, 2026

The guided introduction is additive. The 33 complete candidate objects, 73 decisions, 29 issue analyses and all individual decision accounts are unchanged. `preservation-baseline.json` records their hashes and public destinations. The preservation test fails if a substantive object changes; intentional future editorial corrections must review and update that baseline explicitly. Existing profile, comparison and issue anchors remain available.

New introductory wording explains choices in plain language; the complete briefs retain their original nuance and citations. A glossary defines recurring Council terms. Progressive disclosure keeps candidate differences, experience, promises and supporting evidence available without displaying all of them at once.

The question mappings are authored positive-support observations attached to existing source-linked issue summaries. Alternative tools are not mutually exclusive. Only explicit opposing positions produce disagreement. No party, endorsement, demographic attribute, nonresponse, absence or committee nonmembership supplies a position. Repeated votes do not add weight. Relevant experience is identified from reported roles and is not a competence score or independently verified success. No evidence has yet been coded for the cross-group agreement skill; requiring it therefore produces an honest empty initial result, with the entire field still available.

The full evidence export includes the versioned questions and mappings. Answers and shortlist are stored only in sessionStorage. No preference payload is submitted, put in URLs or sent to analytics by the feature. Existing sitewide page analytics remain in place. Reset replaces the session preferences with empty defaults.

The inbox search for responses to the September 19 outreach found none during implementation. Public methodology now records sending to all 33 candidates without claiming delivery or participation. No messages were resent.

Validation: 19 guide tests passed on the production build, including both mobile race flows, session restoration/reset, storage unavailability, requirements yielding no initial candidates, positive and opposing evidence, sparse evidence, evidence export, existing comparison/print behavior and preservation. TypeScript and targeted lint checks passed. Mobile visual review prompted a shorter introduction and earlier start button. Technical verification is not a first-time-voter usability study; that study and separate independent editorial review remain outstanding and are disclosed publicly.

For future review: ask first-time voters to choose priorities, identify candidates worth considering and explain one alignment and reservation without reading complete profiles. Record time, misunderstood wording, mistaken inferences and difficulty reaching sources. Do not report the three-minute target as a measured completion time before that study.

## Revision 2026-09-19.2 — quick, concrete choices

Supersedes the original broad-goal question mappings above. The initial route now has at most five screens: priorities, up to three policy questions (one per priority, no padding), and optional experience. With no priorities selected it skips policy questions. Budget and Moda follow-ups are optional after results. Two minutes is a design target, not a measured completion time.

Questions describe exact recorded proposals in ordinary language and separate yes, no, depends and not sure. Only yes/no roll calls establish a comparison with that specific past proposal. Absence and broad campaign preferences cannot be recoded as votes. Individual sourced explanations and legislative limits accompany evidence. The comparison explicitly discloses that challengers’ answers to these exact proposals are not established and directs readers to their full campaign profiles.

A per-race coverage gate requires at least two documented votes and differing positions before an answer can affect groups. Thus District 4 camp-removal answers and District 3 street-fee answers remain background only. This is a minimal discrimination check, not a claim of representative coverage. Depends is never treated as a midpoint or agreement. Session versioning prevents old answers being reinterpreted under new questions. The evidence export includes per-race coverage.

Validation: production build, TypeScript and targeted ESLint passed; all 20 guide tests passed, including the maximum-length route, optional extension, exact-vote/absence/conditional semantics, district coverage gate, mobile flows, storage failure, shortlist restoration, existing comparison behavior and unchanged research hashes. Browser verification at 390px and 1365px found no horizontal overflow or page errors. Independent editorial review and first-time-voter usability testing remain outstanding.

## Revision 2026-09-19.3 — reduce reading effort

Reviewed all nine policy questions, the priority picker and experience instructions. Short questions and concrete, proposal-specific answer labels replace generic yes/no text. Brief context remains visible; the complete earlier explanation and mapping caveats are available after the answers in an optional disclosure. No decision IDs or vote mappings changed. The housing question still asks about the same income-limit exception, not a general housing subsidy. Rounded water-bill figures are explicitly approximate. Moda's proposed amounts remain visible because the financial scale is essential to that choice.

The priority screen says one topic is enough, explains the three-topic limit, reports selected topics and labels Continue with the actual number of questions. It does not add screens or automatically advance after a tap. The version change prevents silently reusing answers given under the earlier wording. These changes reduce required reading but do not establish a measured completion time or tested reading grade.

## Revision 2026-09-19.4 — replace the alignment quiz

User testing revealed the core failure: the exact-vote quiz could return only unknown-position cards, particularly District 4 homelessness. It is retired, rather than patched with more caveats or fabricated candidate positions. The public evidence export explicitly marks its old mappings as retired.

The new introduction immediately displays real candidate research. Six views (overview, four existing issue categories, experience) use the existing sourced candidate fields and alphabetical order. Topic gaps are one compact list linking every remaining candidate, not repeated empty cards. A two-person comparison keeps the topic selected, offers broader-platform fallback where a topic is missing, and carries both names and the topic into the complete record comparison. Profile and record views link back. Session storage saves only the new topic and selections under a new key; the old quiz session is not reinterpreted or deleted.

No original candidate, decision, account or issue-analysis object is changed. Meaningful verification must cover all topics in both districts, useful text and sources for each displayed topic card, the original District 4 homelessness failure, navigation into full research and back, sparse-topic comparison fallback, selection editing, storage failure, reload and phone widths. Do not claim measured completion time or user comprehension from automated checks.
