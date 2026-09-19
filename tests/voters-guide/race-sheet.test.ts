import { describe, expect, it } from "vitest";
import { races } from "@/lib/voters-guide/published";
import { buildRaceSheet, ISSUE_IDS } from "@/lib/voters-guide/race-sheet";
import { issueLines } from "@/lib/voters-guide/race-sheet/content/lines";
import { choiceParagraphs } from "@/lib/voters-guide/race-sheet/content/choice";
import { saidPlacements } from "@/lib/voters-guide/race-sheet/content/said";
import { primaryStatements, roleOverrides } from "@/lib/voters-guide/race-sheet/content/roles";
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
    it(`${race.id}: four featured votes resolve to split decisions among this district's incumbents`, () => {
      expect(sheet.featured).toHaveLength(4);
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
