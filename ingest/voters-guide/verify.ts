/** Integrity checks do not replace editorial verification of each factual claim. */
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { createHash } from "node:crypto";
import {
  races,
  candidateCount,
  profileCount,
} from "../../src/lib/voters-guide";
import { races as publishedRaces } from "../../src/lib/voters-guide/published";
import type { Evidence } from "../../src/lib/voters-guide/types";
import { councilDecisions } from "../../src/lib/voters-guide/council-decisions";
import { decisionAccounts } from "../../src/lib/voters-guide/council-record-accounts";
import roster from "../../research/voters-guide-2026/state-roster.json";
import manifest from "../../research/voters-guide-2026/source-manifest.json";

const normalize = (s: string) =>
  s
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]/gi, "")
    .toLowerCase();
const unique = (values: string[], context: string) =>
  assert.equal(new Set(values).size, values.length, `Duplicate ${context}`);
function evidence(s: Evidence) {
  assert.ok(s.label && s.date, "Sources need a title and date/review date");
  assert.equal(
    new URL(s.url).protocol,
    "https:",
    `Unexpected source protocol: ${s.url}`,
  );
  assert.ok(
    !/example\.com|localhost/.test(s.url),
    `Placeholder source: ${s.url}`,
  );
}
unique(
  races.map((r) => r.id),
  "race IDs",
);
assert.deepEqual(
  publishedRaces.map((r) => r.id),
  ["portland-district-3", "portland-district-4"],
  "Unexpected public release scope",
);
assert.equal(publishedRaces.flatMap((r) => r.candidates).length, 33);
for (const decision of councilDecisions) {
  assert.deepEqual(
    Object.keys(decisionAccounts[decision.id]).sort(),
    Object.keys(decision.votes).sort(),
    `Unequal explanation coverage: ${decision.id}`,
  );
  for (const account of Object.values(decisionAccounts[decision.id])) {
    assert.ok(account.choice && account.action);
    if (account.actionSource) evidence(account.actionSource);
    if (account.reason) {
      assert.ok(account.reason.label && account.reason.text);
      evidence(account.reason.source);
    }
  }
}
for (const person of publishedRaces.flatMap((r) => r.candidates)) {
  assert.ok(person.analysis?.tradeoff, `Missing comparison: ${person.name}`);
  person.analysis.sources.forEach(evidence);
  Object.values(person.analysis.issues).forEach((issue) => {
    assert.ok(issue.position.length > 10);
    evidence(issue.source);
  });
  if (person.background.startsWith("Incumbent")) {
    assert.equal(
      person.record?.length,
      4,
      `Unequal record sample: ${person.name}`,
    );
  }
}
assert.equal(
  publishedRaces.flatMap((r) => r.candidates).filter((c) => c.portrait).length,
  31,
);
let reconciled = 0;
for (const race of races) {
  unique(
    race.candidates.map((c) => c.id),
    `candidate IDs in ${race.id}`,
  );
  unique(
    race.candidates.map((c) => normalize(c.name)),
    `candidate names in ${race.id}`,
  );
  assert.ok(race.candidates.length && race.seats > 0, `Empty race: ${race.id}`);
  evidence(race.rosterSource);
  for (const c of race.candidates) {
    assert.ok(c.sources.length, `No evidence: ${c.name}`);
    assert.ok(
      c.summary && c.interpretation && c.question,
      `Incomplete profile fields: ${c.name}`,
    );
    assert.ok(
      c.missing || c.priorities.length,
      `Unlabeled evidence gap: ${c.name}`,
    );
    c.sources.forEach(evidence);
    c.record?.forEach((r) => evidence(r.source));
  }
  if (race.geography !== "Oregon") continue;
  let office: string;
  if (race.id === "oregon-governor") office = "Governor";
  else if (race.id === "oregon-us-senate" || race.id === "oregon-senate")
    office = "US Senator";
  else {
    const match = race.id.match(/^oregon-(state-)?(house|senate)-(\d+)$/);
    assert.ok(match, `Unknown office mapping: ${race.id}`);
    const prefix = match[1]
      ? match[2] === "house"
        ? "State Representative"
        : "State Senator"
      : "US Representative";
    const district = Number(match[3]);
    office =
      roster.candidates.find(
        (r) =>
          r.office.startsWith(prefix + ",") &&
          Number(r.office.match(/\d+/)?.[0]) === district,
      )?.office ?? "";
  }
  const official = roster.candidates.filter((r) => r.office === office);
  assert.ok(official.length, `No official rows: ${office}`);
  assert.deepEqual(
    race.candidates.map((c) => normalize(c.name)).sort(),
    [...new Set(official.map((c) => normalize(c.name)))].sort(),
    `Roster mismatch: ${race.id}`,
  );
  for (const c of race.candidates) {
    const parties = [
      ...new Set(
        official
          .filter((o) => normalize(o.name) === normalize(c.name))
          .map((o) => o.party),
      ),
    ].sort();
    assert.deepEqual(
      c.affiliation.split(" · ").sort(),
      parties,
      `Party mismatch: ${c.name}`,
    );
  }
  for (const person of race.candidates) {
    const officialIds = official
      .filter((o) => normalize(o.name) === normalize(person.name))
      .map((o) => o.filingId)
      .sort();
    const linkedIds = person.sources
      .filter((s) => s.url.includes("cfDetail.do"))
      .map((s) => new URL(s.url).searchParams.get("cfRsn"))
      .sort();
    assert.deepEqual(
      linkedIds,
      officialIds,
      `Filing link mismatch: ${person.name}`,
    );
  }
  reconciled++;
}
assert.equal(
  races.find((r) => r.id === "portland-district-3")?.candidates.length,
  21,
);
assert.equal(
  races.find((r) => r.id === "portland-district-4")?.candidates.length,
  12,
);
const localVotes = races
  .filter((r) => r.id.startsWith("portland-district-"))
  .flatMap((r) => r.candidates)
  .filter((c) => c.record?.some((r) => r.source.url.endsWith("/37750")));
assert.equal(localVotes.length, 6, "Comparable council record missing");
const houseVotes = races
  .filter((r) => /^oregon-house-\d+$/.test(r.id))
  .flatMap((r) => r.candidates)
  .filter((c) => c.record?.some((r) => r.source.url.endsWith("/2025190")));
assert.equal(houseVotes.length, 6, "Comparable congressional record missing");
let filesChecked = 0;
for (const source of manifest.sources) {
  assert.match(source.sha256, /^[a-f0-9]{64}$/);
  const file = path.join("runtime-data/voters-guide-2026", source.workingFile);
  if (!fs.existsSync(file)) continue; // Downloads are intentionally not committed.
  assert.equal(
    createHash("sha256").update(fs.readFileSync(file)).digest("hex"),
    source.sha256,
    `Changed source representation: ${file}`,
  );
  filesChecked++;
}
console.log(
  JSON.stringify(
    {
      races: races.length,
      candidates: candidateCount,
      briefs: profileCount,
      officialStateFieldsReconciled: reconciled,
      sourceHashesChecked: filesChecked,
    },
    null,
    2,
  ),
);
