import { test, expect } from "@playwright/test";
import { createHash } from "node:crypto";
import baseline from "../research/voters-guide-2026/preservation-baseline.json";
import { races } from "../src/lib/voters-guide/published";
import { councilDecisions } from "../src/lib/voters-guide/council-decisions";
import {
  councilDisagreements,
  decisionAccounts,
} from "../src/lib/voters-guide/council-record-accounts";
const hash = (value: unknown) =>
  createHash("sha256").update(JSON.stringify(value)).digest("hex");
const people = races.flatMap((r) => r.candidates);
test("all existing research and sources are preserved exactly", async () => {
  expect(people).toHaveLength(33);
  expect(councilDecisions).toHaveLength(73);
  expect(councilDisagreements).toHaveLength(29);
  for (const row of baseline.candidates)
    expect(hash(people.find((c) => c.id === row.id))).toBe(row.hash);
  for (const row of baseline.decisions)
    expect(hash(councilDecisions.find((c) => c.id === row.id))).toBe(row.hash);
  for (const row of baseline.issues)
    expect(hash(councilDisagreements.find((c) => c.id === row.id))).toBe(
      row.hash,
    );
  expect(hash(decisionAccounts)).toBe(baseline.accountsHash);
});
