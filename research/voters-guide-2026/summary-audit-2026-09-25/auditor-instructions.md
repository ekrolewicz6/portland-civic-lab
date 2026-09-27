# Voters-guide summary audit: instructions for one batch

You are auditing a nonpartisan voters guide (Portland Civic Lab). A reader showed that a candidate's chip overstated her source:
Kellie Torres's safety chip read "More police investigations"; her source says "Support public safety staffing and resources that allow
police to follow through on investigations, fix emergency response times, and make neighborhoods safe." That is about finishing cases
and faster response, not more investigations. It was fixed to "Police follow-through". The reader's broader charge: when you drill into
the cites, the summaries lean. Your job is to test that charge honestly, item by item, for the candidates in your batch file.

## What you audit

Your batch file (JSON) lists races → candidates. For each candidate:
- `issues.<issue>`: `position` (our paraphrase, 1–2 sentences), `line` (≤14-word row summary of the position), `chip` (2–4 word grid label),
  and `source` (the one source the position cites). Issues are housing, safety, money, climate.
- `topicStances[]`: `topicId`, `question` (the topic's plain question), `stance` (supports | opposes | mixed | partial), `chip` (≤4 words),
  `text` (≤40-word sentence), `source`.
- `candidateReplies[]`: the candidate's verbatim replies to our questionnaire. Sources whose URL is
  `https://www.portlandciviclab.org/voters-guide/research-log#...` point to these replies (or to a log entry in
  `/Users/edankrolewicz/Projects/portland-civic-lab/.claude/worktrees/goofy-easley-3bf05e/src/app/(public)/voters-guide/research-log/page.tsx`,
  search it for the anchor id). Treat the reply text as the source.

Compare the position, line, chip, topic chip, topic text and stance value against the SOURCE ITSELF (not against each other only).
Flag an item only if it does one of these:
- (a) ADDS a claim or intensity the source lacks ("more", "ban", "permanent", "end", "cut", "all", "immediately", "fully", a number,
  a commitment where the source only says "explore/consider/review/support efforts", an action verb stronger than the candidate's).
- (b) DROPS a qualifier that changes meaning ("one-time", "until X", "where needed", "for high-need", "alongside", "without raising
  taxes", "in tandem with", a condition, a scope limit like "large employers" or "corporate landlords").
- (c) Uses LOADED or partisan framing the candidate didn't use (e.g. "sweeps", "crackdown", "handouts", "defund", "clear
  encampments" when they said "enforce camping rules", "socialist", "radical", "anti-", "punitive", "tough on") or picks one side's
  vocabulary for a contested thing when the candidate used a neutral or different word.
- (d) Picks a STANCE VALUE the words don't support. Definitions used by the guide: "supports"/"opposes" = explicit statement on that
  exact choice (or a recorded vote for incumbents); "mixed" = the statement is conditional or points both ways; "partial" = the statement
  speaks to the topic without reaching its exact choice (the text should then say what is left unsaid). A general value
  ("restore public order") never earns supports/opposes. Read the topic `question` carefully: supports/opposes are relative to it.

Do NOT flag ordinary compression that only omits secondary items without changing what a reader would believe, and do NOT flag
faithful paraphrase. Omitting a candidate's second or third point is allowed ("a line may omit, never add") unless the omission
changes the meaning of what remains (e.g. keeping "enforcement" and dropping "and services" from "enforcement and services").
Be even-handed: look as hard for a lean that flatters a candidate as for one that hurts. Also flag a clear factual mismatch (wrong
date, wrong vote, wrong number) and an item whose source does not contain the claim at all.

## How to read sources

- Fetch each distinct source URL once and reuse it. Prefer verbatim text: `curl -sL -A "Mozilla/5.0" URL` then convert HTML to text
  (e.g. `textutil -stdin -stdout -format html -convert txt` or a short python html.parser script). WebFetch returns a model summary,
  so if you use it, ask it for verbatim sentences. JS-rendered sites (Wix/Squarespace) may need WebFetch or the snapshot fallback.
- Save each fetched page's text to `<scratchpad>/sources/<short-name>.txt` so the lead can re-check quotes.
- Pamphlet sources are already extracted locally, one file per PDF page (page = the `#page=N` in the URL, PDF index from 1):
  - Multnomah County (multco.us ... voters pamphlet): `<scratchpad>/pamphlets/multnomah/pN.cols.txt` (column-split, best) and `pN.txt`
  - Washington County (washingtoncountyor.gov ... voters-pamphlet): `<scratchpad>/pamphlets/washington/pN.cols.txt` / `pN.txt`
  - Clackamas County (docs.clackamas.us ...): `<scratchpad>/pamphlets/clackamas/pN.cols.txt` / `pN.txt`
  - Oregon state pamphlet (sos.oregon.gov ... Candidate-Statements.pdf): `<scratchpad>/pamphlets/state/pN.txt`
  A page usually holds two candidates side by side: make sure you read the right candidate's column. If a statement continues on the
  next page, read that too.
- Fallback snapshots from September 18, 2026: `/Users/edankrolewicz/Projects/portland-civic-lab/.claude/worktrees/goofy-easley-3bf05e/research/voters-guide-2026/source-manifest.json`
  maps URL → `workingFile`; the text lives at `/Users/edankrolewicz/Projects/portland-civic-lab/runtime-data/voters-guide-2026/<workingFile>`
  (also `pham-*-rendered.txt` there for Pham's JS pages). Use it when the live page fails, and say so.
- Earlier research notes with source quotes: `.../goofy-easley-3bf05e/research/voters-guide-2026/outreach-2026-09-22/*.md`. Use them as
  pointers only; verify against the source.
- If a source is unreachable and no snapshot exists, list it under `unreachable` and do not guess.

## Output

Write `<scratchpad>/findings/<batch-name>.json` with this shape, then reply with a short summary (counts + the confirmed findings, one line each):

{
  "batch": "<batch-name>",
  "checked": { "issueSlots": N, "topicStances": N, "sourcesFetched": N },
  "unreachable": [ { "url": "...", "items": ["cand/issue/safety", ...], "note": "..." } ],
  "findings": [
    {
      "candidateId": "kellie-torres",
      "race": "portland-district-3",
      "item": "issue/safety" | "topic/<topicId>",
      "fields": ["chip", "line", "position"] ,          // which of our texts lean: chip | line | position | topic-chip | topic-text | stance
      "current": { "chip": "...", "line": "...", "position": "...", "stance": "...", "text": "..." },   // only the fields involved
      "sourceUrl": "... (with #page=N)",
      "sourceQuote": "verbatim sentence(s) from the source, the relevant ones only, ≤80 words",
      "category": ["a"],                                  // a | b | c | d
      "verdict": "confirmed" | "borderline",
      "why": "one plain sentence",
      "proposed": { "chip": "...", "line": "...", "position": "...", "stance": "...", "topicChip": "...", "text": "..." }
    }
  ]
}

"confirmed" = a careful editor comparing the two would agree it leans or misstates. "borderline" = arguable; say why briefly.

## Rules your proposed replacements must obey (tests enforce these)

- Issue chip: 2–4 words, ≤26 characters, a noun phrase or short imperative naming the candidate's stated approach. Never contains
  says/said/supports/wants/would/will/calls for; never progressive/conservative/left/right/moderate/liberal. No quoted language.
- Issue line: ≤14 words; starts with an attribution verb (Supports, Opposes, Would, Wants, Proposes, Rejects, Sets…) or a plain
  noun phrase; never starts with Emphasizes/Calls for/Prioritizes/Describes/Argues/Says/States/Notes/Mentions; no vote language
  (voted, roll call, resolution N, ordinance N); the words zoning, permitting, vacancy tax, social housing, PCEF, Bull Run, Zenith, term
  sheet, appropriation, oversight, escalation, unarmed response need a short gloss in parentheses. A line may omit, never add.
- Position: plain full sentences in the guide's voice ("Would…", "Supports…", "She cites…"). Keep it close to the source's own words.
- Topic chip: ≤4 words. Topic text: ≤40 words, full sentence(s), never likely/probably/presumably/seems to/appears to/"as a Democrat" etc.
- Write like a careful human editor: no em dashes, no "not X but Y", no flourish. Prefer the candidate's own verbs.
- Change only what is needed to fix the lean; do not restyle items that are fine.

Do not edit any repository file. Do not contact anyone. Write only inside <scratchpad>.
