import { describe, expect, it } from "vitest";
import { races } from "@/lib/voters-guide/published";
import { buildRaceSheet, ISSUE_IDS } from "@/lib/voters-guide/race-sheet";
import { issueLines } from "@/lib/voters-guide/race-sheet/content/lines";
import { stanceChips } from "@/lib/voters-guide/race-sheet/content/stances";
import { deliveries } from "@/lib/voters-guide/race-sheet/content/delivery";
import { topicStances } from "@/lib/voters-guide/race-sheet/content/topic-stances";
import { extraTopics } from "@/lib/voters-guide/race-sheet/topics";
import { packs } from "@/lib/voters-guide/race-sheet/content/packs";
import { topicsFor } from "@/lib/voters-guide/race-sheet";
import { ownWords } from "@/lib/voters-guide/race-sheet/content/own-words";
import { contacts } from "@/lib/voters-guide/race-sheet/content/contacts";
import { candidateDescription } from "@/lib/voters-guide/race-sheet/seo";
import { officeOf } from "@/lib/voters-guide/race-sheet/office";
import { choiceParagraphs } from "@/lib/voters-guide/race-sheet/content/choice";
import { saidPlacements } from "@/lib/voters-guide/race-sheet/content/said";
import { missingStates, primaryStatements, roleOverrides } from "@/lib/voters-guide/race-sheet/content/roles";
import { featuredVotes } from "@/lib/voters-guide/race-sheet/featured";
import { questions } from "@/lib/voters-guide/discovery";
import { councilDecisions } from "@/lib/voters-guide/council-decisions";
import { sourceChip } from "@/lib/voters-guide/race-sheet/source-chip";

const words = (s: string) => s.trim().split(/\s+/).filter(Boolean).length;
const people = races.flatMap((r) => r.candidates.map((c) => ({ race: r, person: c })));
const find = (id: string) => people.find((p) => p.person.id === id);
const pool = (id: string) => {
  const p = find(id)?.person;
  if (!p) return [];
  return [
    ...(p.sources ?? []),
    ...(p.analysis?.sources ?? []),
    ...Object.values(p.analysis?.issues ?? {}).map((i) => i.source),
  ];
};
const REPORTING_VERBS = /^(emphasi[sz]es|calls for|prioriti[sz]es|describes|argues|says|states|notes|mentions)\b/i;
const VOTE_LANGUAGE = /\b(voted|roll call|roll-call|term sheet vote|resolution \d+|ordinance \d+)\b/i;
const JARGON = /\b(zoning|permitting|vacancy tax|social housing|PCEF|Bull Run|Zenith|term sheet|appropriation|oversight|escalation|unarmed response)\b/i;

describe("issue lines (the row layer)", () => {
  it("has exactly one reviewed line for every documented issue position, and none without a parent", () => {
    const filled = people.flatMap(({ person }) =>
      ISSUE_IDS.filter((issue) => person.analysis?.issues[issue]).map((issue) => `${person.id}/${issue}`),
    );
    const authored = issueLines.map((l) => `${l.candidateId}/${l.issue}`);
    expect(new Set(authored).size, "duplicate lines").toBe(authored.length);
    expect(authored.filter((k) => !filled.includes(k)), "lines with no parent position").toEqual([]);
    expect(filled.filter((k) => !authored.includes(k)), "documented positions with no line").toEqual([]);
  });
  it.each(issueLines.map((l) => [`${l.candidateId}/${l.issue}`, l] as const))("%s obeys the caps", (_key, line) => {
    expect(words(line.line), line.line).toBeLessThanOrEqual(14);
    expect(line.line, "reporting verb").not.toMatch(REPORTING_VERBS);
    expect(line.line, "vote language in a Said line").not.toMatch(VOTE_LANGUAGE);
    expect(line.from).toBe(`analysis.issues.${line.issue}.position`);
    expect(line.reviewedOn).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    const jargon = line.line.match(JARGON);
    if (jargon) expect(line.line, `jargon "${jargon[0]}" needs a gloss in parentheses`).toMatch(/\(/);
  });
});

describe("stance chips (the grid layer)", () => {
  it("has exactly one chip per documented position, none without a parent, none duplicated", () => {
    const filled = people.flatMap(({ person }) =>
      ISSUE_IDS.filter((issue) => person.analysis?.issues[issue]).map((issue) => `${person.id}/${issue}`),
    );
    const authored = stanceChips.map((c) => `${c.candidateId}/${c.issue}`);
    expect(new Set(authored).size, "duplicate chips").toBe(authored.length);
    expect(authored.filter((k) => !filled.includes(k)), "chips with no parent position").toEqual([]);
    expect(filled.filter((k) => !authored.includes(k)), "documented positions with no chip").toEqual([]);
  });
  it.each(stanceChips.map((c) => [`${c.candidateId}/${c.issue}`, c] as const))("%s is 2–4 plain words, no attribution verbs, no side label", (_key, chip) => {
    expect(words(chip.chip), chip.chip).toBeGreaterThanOrEqual(2);
    expect(words(chip.chip), chip.chip).toBeLessThanOrEqual(4);
    expect(chip.chip.length, chip.chip).toBeLessThanOrEqual(26);
    expect(chip.chip, "attribution verb").not.toMatch(/\b(says|said|supports|wants|would|will|calls for)\b/i);
    expect(chip.chip, "side label").not.toMatch(/\b(progressive|conservative|left|right|moderate|liberal)\b/i);
    expect(chip.from).toBe(`analysis.issues.${chip.issue}.position`);
    expect(chip.reviewedOn).toMatch(/^\d{4}-\d{2}-\d{2}$/);
  });
});

const HTTPS = /^https:\/\//;
const INFERENCE = /\b(likely|probably|presumably|would likely|seems to|appears to|as a (democrat|republican|progressive|conservative))\b/i;

describe("the promise ladder (how, measured by)", () => {
  it("names each candidate and issue once, and only where that issue has a documented position", () => {
    const keys = deliveries.map((d) => `${d.candidateId}/${d.issue}`);
    expect(new Set(keys).size, "duplicate ladders").toBe(keys.length);
    for (const d of deliveries) {
      const entry = find(d.candidateId);
      expect(entry, `${d.candidateId}: unknown candidate`).toBeTruthy();
      expect(entry!.person.analysis?.issues[d.issue], `${d.candidateId}/${d.issue}: a ladder needs a documented position beneath it`).toBeTruthy();
    }
  });
  it.each(deliveries.map((d) => [`${d.candidateId}/${d.issue}`, d] as const))("%s: every rung is short, sourced over https, and not an inference", (_k, d) => {
    // An entry with neither rung is allowed: it records that the sources were reviewed and nothing was found.
    for (const rung of [d.how, d.measure]) {
      if (!rung) continue;
      expect(words(rung.text), rung.text).toBeLessThanOrEqual(40);
      expect(rung.text, "inference language").not.toMatch(INFERENCE);
      expect(rung.source.url, rung.source.url).toMatch(HTTPS);
      expect(rung.source.kind).toBeTruthy();
      expect(rung.source.date).toBeTruthy();
    }
    if (d.askedOn) expect(d.askedOn).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    expect(d.reviewedOn).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    expect(d.reviewedBy.length).toBeGreaterThan(0);
  });
});

/** Every topic once: a pack may list the same topic object for several of its races (a subset for a sheriff or auditor). */
const allTopics = Array.from(new Set([...extraTopics, ...packs.flatMap((p) => p.topics.flatMap((t) => t.topics))]));

describe("extra topics", () => {
  it("are a fixed, deduplicated list with a plain question, and any decisionId resolves", () => {
    const ids = allTopics.map((t) => t.id);
    expect(new Set(ids).size).toBe(ids.length);
    for (const t of allTopics) {
      expect(t.question.trim().endsWith("?"), `${t.id}: question should be a question`).toBe(true);
      expect(words(t.short)).toBeLessThanOrEqual(2);
      if (t.decisionId) expect(councilDecisions.some((d) => d.id === t.decisionId), `${t.id}: decision ${t.decisionId}`).toBe(true);
    }
  });
  it("stances name a known candidate and topic once each, with a short chip, a sourced sentence and no inference", () => {
    const keys = topicStances.map((s) => `${s.candidateId}/${s.topicId}`);
    expect(new Set(keys).size, "duplicate stances").toBe(keys.length);
    for (const s of topicStances) {
      const where = `${s.candidateId}/${s.topicId}`;
      expect(find(s.candidateId), `${where}: unknown candidate`).toBeTruthy();
      expect(allTopics.some((t) => t.id === s.topicId), `${where}: unknown topic`).toBe(true);
      expect(["supports", "opposes", "mixed", "partial"]).toContain(s.stance);
      expect(words(s.chip), `${where}: "${s.chip}"`).toBeLessThanOrEqual(4);
      expect(words(s.text), `${where}: ${s.text}`).toBeLessThanOrEqual(40);
      expect(s.text, `${where}: inference language`).not.toMatch(INFERENCE);
      expect(s.source.url, where).toMatch(HTTPS);
      expect(s.reviewedOn).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    }
  });
  for (const race of races) {
    it(`${race.id}: incumbents' topic cells carry their recorded vote where the topic is a decision; nobody else gets a vote`, () => {
      const sheet = buildRaceSheet(race);
      for (const row of sheet.rows) {
        for (const topic of topicsFor(race)) {
          const cell = row.topicCells[topic.id];
          const decision = topic.decisionId ? councilDecisions.find((d) => d.id === topic.decisionId) : undefined;
          if (row.incumbent && decision) expect(cell.vote, `${row.id}/${topic.id}`).toBe(decision.votes[row.name] ?? null);
          else expect(cell.vote, `${row.id}/${topic.id}`).toBeNull();
          if (cell.chip) expect(cell.text && cell.source, `${row.id}/${topic.id}: a chip needs its sentence and source`).toBeTruthy();
        }
      }
      for (const topic of topicsFor(race)) {
        const onRecord = sheet.rows.filter((r) => r.topicCells[topic.id].vote || r.topicCells[topic.id].chip).length;
        expect(onRecord).toBeLessThanOrEqual(sheet.rows.length);
      }
    });
  }
});

describe("in their words (the verbatim opening)", () => {
  it("covers every published candidate exactly once, except those with no published statement at all", () => {
    const ids = ownWords.map((o) => o.candidateId);
    expect(new Set(ids).size).toBe(ids.length);
    // A candidate with nothing published (a filing and nothing else) has no words to quote; the row says so.
    const expected = people.filter(({ person }) => !(person.missing && (missingStates[person.id] ?? "no-platform") === "no-platform" && !ids.includes(person.id))).map((p) => p.person.id);
    expect([...ids].sort()).toEqual(expected.sort());
    for (const { person } of people) if (!ids.includes(person.id)) expect(person.missing, `${person.id} has no opening and no missing state`).toBeTruthy();
  });
  it.each(ownWords.map((o) => [o.candidateId, o] as const))("%s: ≤60 words, ends at a sentence boundary, nothing elided, sourced", (_id, o) => {
    expect(words(o.text)).toBeLessThanOrEqual(60);
    expect(o.text, "ends mid-sentence").toMatch(/[.!?…”"]$/);
    expect(o.text, "an ellipsis means something was cut inside the quote").not.toMatch(/\.\.\.|…/);
    expect(o.text, "a bracketed insertion is not verbatim").not.toMatch(/\[/);
    expect(o.source.url).toMatch(HTTPS);
    expect(o.source.kind).toBe("Candidate statement");
    // A pamphlet opening cites an official pamphlet page: a county elections office or the Secretary of State's filed statements.
    if (o.rule === "pamphlet-opening") expect(o.source.url).toMatch(/^https:\/\/(multco\.us|www\.washingtoncountyor\.gov|docs\.clackamas\.us|sos\.oregon\.gov)\/.*#page=\d+$/);
  });
  it("leads every non-missing candidate's search description with their own words, never ours", () => {
    for (const { race, person } of people) {
      const d = candidateDescription(race, person);
      expect(d.length).toBeLessThanOrEqual(160);
      if (ownWords.some((o) => o.candidateId === person.id) && !person.missing) {
        expect(d, person.id).toContain("In their words: “");
        expect(d, person.id).not.toContain("Our summary:");
      }
    }
  });
});

describe("reaching the campaign", () => {
  it("covers every published candidate exactly once", () => {
    const ids = contacts.map((o) => o.candidateId);
    expect(new Set(ids).size).toBe(ids.length);
    expect([...ids].sort()).toEqual(people.map((p) => p.person.id).sort());
  });
  it.each(contacts.map((o) => [o.candidateId, o] as const))("%s: only published channels, well-formed, sourced, or a stated reason", (_id, o) => {
    if (o.channels.length === 0) {
      expect(o.none, "no channels needs a reason").toBeTruthy();
      expect(o.none!.length).toBeGreaterThan(20);
    } else {
      expect(o.sources.length, "channels need the page they came from").toBeGreaterThan(0);
    }
    for (const s of o.sources) expect(s.url).toMatch(HTTPS);
    const kinds = o.channels.map((ch) => ch.kind);
    expect(kinds.filter((k) => k === "website").length, "at most one website").toBeLessThanOrEqual(1);
    for (const ch of o.channels) {
      if (ch.kind === "email") expect(ch.url).toMatch(/^mailto:[^@\s]+@[^@\s]+\.[a-z]+$/i);
      else if (ch.kind === "phone") expect(ch.url).toMatch(/^tel:\+1\d{10}$/);
      else expect(ch.url, `${ch.kind} must be https`).toMatch(HTTPS);
      expect(ch.label.length).toBeGreaterThan(0);
      expect(ch.label, "labels are plain, no protocol").not.toMatch(/^https?:/);
      expect(["pamphlet", "site", "filing", "announcement", "questionnaire"]).toContain(ch.from);
    }
    expect(o.reviewedOn).toMatch(/^\d{4}-\d{2}-\d{2}$/);
  });
});

describe("choice paragraphs", () => {
  it("cover every published race", () => {
    for (const race of races) expect(choiceParagraphs.some((c) => c.raceId === race.id), race.id).toBe(true);
  });
  it.each(choiceParagraphs.map((c) => [c.raceId, c] as const))("%s is short, nameless and not a forced binary", (_id, c) => {
    expect(words(c.text)).toBeLessThanOrEqual(45);
    const names = find("x") ? [] : people.filter((p) => p.race.id === c.raceId).map((p) => p.person.name.split(" ").pop()!);
    for (const last of names) expect(c.text, `names ${last}`).not.toMatch(new RegExp(`\\b${last}\\b`));
    expect(c.text, "X, or Y dichotomy").not.toMatch(/,\s+or\s+/);
    expect(c.from).toBe("race.comparison");
  });
});

describe("said placements", () => {
  it.each(saidPlacements.map((s) => [`${s.candidateId}/${s.questionId}`, s] as const))("%s is an explicit, sourced challenger statement", (_k, s) => {
    const entry = find(s.candidateId);
    expect(entry, "unknown candidate").toBeTruthy();
    expect(entry!.person.record?.some((r) => r.decisionId), "incumbents never appear as Said").toBeFalsy();
    expect(questions.some((q) => q.id === s.questionId), "unknown question").toBe(true);
    expect(featuredVotes.some((f) => f.questionId === s.questionId && f.raceId === entry!.race.id), "not a featured vote for this race").toBe(true);
    expect(words(s.line)).toBeLessThanOrEqual(10);
    expect(pool(s.candidateId).some((e) => e.url === s.sourceUrl), `source ${s.sourceUrl} not in candidate's evidence`).toBe(true);
  });
});

describe("roles and sources", () => {
  it.each(roleOverrides.map((r) => [r.candidateId, r] as const))("%s role is ≤6 words and from background", (_id, r) => {
    expect(words(r.role)).toBeLessThanOrEqual(6);
    expect(r.from).toBe("background");
    expect(find(r.candidateId)).toBeTruthy();
  });
  it.each(primaryStatements.map((p) => [p.candidateId, p] as const))("%s primary statement exists in their evidence and is not the register", (_id, p) => {
    const evidence = pool(p.candidateId).find((e) => e.url === p.sourceUrl);
    expect(evidence, "url not in evidence pool").toBeTruthy();
    expect(evidence!.kind).not.toBe("Election authority");
  });
});

describe("the built sheet", () => {
  for (const race of races) {
    const sheet = buildRaceSheet(race);
    it(`${race.id}: every candidate has a row, alphabetical, with a short role`, () => {
      expect(sheet.rows.map((r) => r.id).sort()).toEqual(race.candidates.map((c) => c.id).sort());
      const names = sheet.rows.map((r) => r.name);
      expect(names).toEqual([...names].sort((a, b) => a.localeCompare(b, "en")));
      for (const row of sheet.rows) expect(words(row.role), `${row.name}: ${row.role}`).toBeLessThanOrEqual(6);
      for (const row of sheet.rows) expect(row.role, `${row.name} falls back to a truncated background`).not.toMatch(/…$/);
    });
    it(`${race.id}: ${officeOf(race).hasCouncilRecord ? "four featured votes resolve to split decisions among this district's incumbents" : "no featured votes and no council record"}`, () => {
      expect(sheet.featured).toHaveLength(officeOf(race).hasCouncilRecord ? 4 : 0);
      for (const f of sheet.featured) {
        expect(councilDecisions.some((d) => d.id === f.decision.id)).toBe(true);
        const v = f.votes.map((x) => x.vote);
        expect(v.includes("Yes") && v.includes("No"), `${f.title} is not split: ${v.join(", ")}`).toBe(true);
        expect(f.votes.map((x) => x.name)).toEqual([...f.votes.map((x) => x.name)].sort((a, b) => a.localeCompare(b, "en")));
      }
    });
    it(`${race.id}: coverage counts documented positions, not lines`, () => {
      for (const issue of ISSUE_IDS)
        expect(sheet.coverage[issue]).toBe(race.candidates.filter((c) => c.analysis?.issues[issue]).length);
    });
  }
});

describe("sourceChip", () => {
  it("classifies the common venues", () => {
    const e = (url: string, kind: "Candidate statement" | "Public record" | "Election authority" | "Reporting" = "Candidate statement") => ({ label: "x", url, kind, date: "2026" });
    expect(sourceChip(e("https://multco.us/file/pamphlet.pdf#page=60")).label).toBe("Pamphlet p. 60");
    expect(sourceChip(e("https://www.estherforportland.com/issues")).venue).toBe("Site");
    expect(sourceChip(e("https://www.portlandmercury.com/q")).venue).toBe("Questionnaire");
    expect(sourceChip(e("https://www.linkedin.com/posts/x")).venue).toBe("Post");
    expect(sourceChip(e("https://www.portland.gov/council/documents/resolution/adopted/37750", "Public record")).venue).toBe("Record");
    expect(sourceChip(e("https://secure.sos.state.or.us/orestar/cfDetail.do?cfRsn=1", "Election authority")).venue).toBe("Filing");
  });
});
