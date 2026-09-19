# A vote that feels like your own

The product's promise: understand the choices well enough to make your own.
A successful visit ends with a voter able to explain a meaningful difference
between candidates and why it matters to them. Time on site and agreement with
any particular candidate are not success measures.

## The storyboard

These are design targets to validate with readers, not measured completion times.

| Moment | Voter's question | Experience | Target time | What they leave with |
| --- | --- | --- | --- | --- |
| Arrive | Where do I start? | Confirm the race; choose one of four familiar issues, or meet everyone. No quiz or account. | 10–15 seconds | A clear starting point they chose |
| Discover | What would these people actually do? | Read a small group of sourced proposals on the selected issue. The complete field stays reachable by name and pagination. | 30–60 seconds | One concrete proposal and a reason to look closer |
| Compare | What is different about these candidates? | Choose two people and see the same topic side by side. Switch candidates or topics freely. | 1–3 minutes | A difference they can explain in their own words |
| Consider | What else matters to my choice? | A gentle next step leads to experience, other priorities, and the record. No forced completion or match score. | Optional 2–5 minutes | A more rounded view, including uncertainties |
| Check | Can I trust this claim? | Open one profile or one recorded decision, see context and sources, and return without losing the comparison. | Optional 2–10 minutes | Evidence they can inspect, and clear limits |
| Take away | How do I keep or discuss what I learned? | Share/copy a link opening the selected candidates, topic, and, when relevant, Council issue. | 5–15 seconds | A useful reference, not a generated endorsement |

People may enter at any point. A shared profile opens that profile. A shared
comparison opens the comparison, without repeating onboarding. Browser Back
and section navigation preserve the work of reading and choosing.

## Visual and interaction principles

- Give each screen one dominant purpose. The opening screen invites a choice;
  a candidate view answers it; a comparison supports a decision.
- Warm paper colors, deep green, restrained serif headings, and generous spacing
  establish a calm civic reading experience. No urgency countdowns, confetti,
  leaderboards, candidate scores, or personality labels.
- Make familiar words prominent. Put legislative terminology and research
  qualifications next to the evidence they explain, not before the first insight.
- Reveal detail when requested. Preserve complete research, attribution,
  candidate photos, decision explanations, and print output.
- Keep navigation and the next action reachable on mobile. Measure the bottom
  navigation's actual height so controls do not overlap when text wraps.
- Keep the reader in control: choose any candidate, change topics, inspect a
  source, share, stop, or return. No claim that reading a few cards completes
  the work of choosing representatives.
- Apply the same structure, alphabetical ordering, evidence labels, and missing
  information treatment to every candidate. Uncertainty is never disagreement.
- Share only public candidate IDs and the displayed topic. The fragment contains
  no preference answers, private notes, inferred alignment, or suggested ranking;
  URL fragments are not included in the HTTP request. Sharing is an explicit
  reader action, with native share, clipboard, and manual-copy paths.

## Acceptance checks

Automated: both races; one-tap entry to sourced issue proposals; every candidate
and topic reachable; exact source-data preservation; two/three candidate
comparison; indirect navigation; deep links; recipient reconstruction of a
shared comparison; invalid IDs; disabled storage and clipboard; full print
output; keyboard focus; mobile overflow and action-bar spacing.

Human validation still required: ask first-time readers (including teenagers,
older voters, and people using larger text) to choose an issue, explain one
candidate difference, inspect its source, change a candidate, and share the
comparison. Record time to first useful insight, misreadings, backtracking,
confidence before/after, and whether confidence is supported by understanding.
Do not record their political choices as analytics. The time targets and the
claim of empowerment must be tested through comprehension, not inferred from
passing browser tests.
