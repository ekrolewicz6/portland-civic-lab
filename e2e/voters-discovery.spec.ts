import { test, expect } from "@playwright/test";
import { createHash } from "node:crypto";
import baseline from "../research/voters-guide-2026/preservation-baseline.json";
import { races } from "../src/lib/voters-guide/published";
import { councilDecisions } from "../src/lib/voters-guide/council-decisions";
import {
  councilDisagreements,
  decisionAccounts,
} from "../src/lib/voters-guide/council-record-accounts";
import {
  assess,
  discoveryEvidence,
  orderResults,
  questions,
  questionCoverage,
} from "../src/lib/voters-guide/discovery";
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
test("exact votes, conditions, absence and race coverage control comparison", async () => {
  const novick = people.find((p) => p.id === "steve-novick")!;
  const challenger = people.find((p) => p.id === "john-sweeney")!;
  expect(
    assess(novick, { "homebuyer-income": "yes" }, []).aligned,
  ).toHaveLength(1);
  expect(
    assess(novick, { "homebuyer-income": "no" }, []).different,
  ).toHaveLength(1);
  expect(
    assess(novick, { "homebuyer-income": "depends" }, []).unknown,
  ).toHaveLength(1);
  // An arena opinion does not establish a vote on this specific term sheet.
  expect(assess(challenger, { moda: "yes" }, []).different).toHaveLength(0);
  expect(assess(challenger, { moda: "yes" }, []).unknown).toHaveLength(1);
  const d4 = races.find((r) => r.id.endsWith("4"))!.candidates;
  const camps = questions.find((q) => q.id === "camp-removal")!;
  expect(questionCoverage(d4, camps)).toEqual({
    known: 1,
    total: 12,
    comparable: false,
  });
  expect(
    orderResults(d4, { "camp-removal": "yes" }, []).every((r) => r.group === 3),
  ).toBe(true);
  const d3 = races.find((r) => r.id.endsWith("3"))!.candidates;
  // Unanimity is informative but cannot distinguish this field.
  expect(
    questionCoverage(
      d3,
      questions.find((q) => q.id === "street-fee")!,
    ).comparable,
  ).toBe(false);
  expect(assess(novick, { nonsense: "yes" }, []).group).toBe(3);
});
test("evidence mapping is valid and requirements do not invent skills", async () => {
  for (const person of people)
    for (const [id, p] of Object.entries(discoveryEvidence(person).positions)) {
      const q = questions.find((q) => q.id === id)!;
      expect(q).toBeTruthy();
      expect(p.source.url).toMatch(/^https:\/\//);
      expect(p.text.length).toBeGreaterThan(20);
      for (const option of [...p.supported, ...p.opposed])
        expect(q.options.some((o) => o.id === option)).toBe(true);
    }
  const results = orderResults(people, {}, [
    { id: "agreements", requirement: true },
  ]);
  expect(results.every((r) => r.unmet.length === 1)).toBe(true);
  const candidates = orderResults(people, {}, []);
  expect(candidates.map((r) => r.person.name)).toEqual(
    people.map((p) => p.name).sort((a, b) => a.localeCompare(b)),
  );
});
for (const district of [3, 4])
  test(`district ${district}: mobile flow, shortlist, privacy and preservation`, async ({
    page,
  }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    const errors: string[] = [];
    page.on("pageerror", (e) => errors.push(e.message));
    await page.goto(`/voters-guide/portland-district-${district}`);
    const guide = page.getByRole("region", {
      name: "Find candidates to consider",
      exact: true,
    });
    await guide
      .getByRole("button", { name: "Find candidates to consider" })
      .click();
    await guide
      .getByRole("button", { name: "Homes people can afford" })
      .click();
    await guide.getByRole("button", { name: /Continue/ }).click();
    await guide.getByRole("button", { name: /Yes —/ }).click();
    await guide.getByRole("button", { name: /Next: experience/ }).click();
    await guide.getByRole("button", { name: "Explore candidates →" }).click();
    await expect(
      guide.getByRole("heading", {
        name: "Agreement on every choice we checked",
      }),
    ).toBeVisible();
    await guide
      .getByRole("button", { name: /Save to my shortlist/ })
      .first()
      .click();
    await guide.getByRole("button", { name: "My shortlist (1)" }).click();
    await guide.getByRole("combobox").selectOption("experience");
    await expect(
      guide.getByText("Reported roles, not a rating of successful outcomes."),
    ).toBeVisible();
    expect(new URL(page.url()).search).toBe("");
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= window.innerWidth,
      ),
    ).toBe(true);
    await page.reload();
    await expect(
      guide.getByRole("button", { name: "My shortlist (1)" }),
    ).toBeVisible();
    await guide.getByRole("button", { name: "My shortlist (1)" }).click();
    await guide
      .getByRole("button", { name: "Reset answers & shortlist" })
      .click();
    await expect(
      guide.getByRole("button", { name: "My shortlist (0)" }),
    ).toBeVisible();
    for (const c of races.find((r) => r.id.endsWith(String(district)))!
      .candidates)
      await expect(page.locator(`article#${c.id}`)).toHaveCount(1);
    await page.goto(
      `/voters-guide/portland-district-${district}#disagreement-zenith`,
    );
    await expect(page.locator("#disagreements")).toBeVisible();
    expect(errors).toEqual([]);
  });
test("empty requirements, storage failure and zero policy answers remain usable", async ({
  page,
}) => {
  await page.addInitScript(() => {
    Object.defineProperty(window, "sessionStorage", {
      get() {
        throw new Error("Storage disabled");
      },
    });
  });
  await page.goto("/voters-guide/portland-district-4");
  const guide = page.getByRole("region", {
    name: "Find candidates to consider",
    exact: true,
  });
  await guide
    .getByRole("button", { name: "Find candidates to consider" })
    .click();
  await guide.getByRole("button", { name: /Skip policy questions/ }).click();
  await guide
    .getByRole("button", { name: "Building agreements across groups" })
    .click();
  await guide.getByRole("checkbox").check();
  await guide.getByRole("button", { name: "Explore candidates →" }).click();
  await expect(
    guide.getByText(/No requirement has been relaxed/),
  ).toBeVisible();
  await expect(
    guide.getByText(/You have not selected a policy approach/),
  ).toBeVisible();
  await expect(guide.getByText(/Browser storage is unavailable/)).toBeVisible();
  await guide
    .getByText("Experience requirements not established (12 candidates)", {
      exact: true,
    })
    .click();
  await expect(guide.getByRole("article")).toHaveCount(12);
});

test("three priorities take at most five screens; extra questions are optional", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/voters-guide/portland-district-4");
  const guide = page.getByRole("region", {
    name: "Find candidates to consider",
    exact: true,
  });
  await guide
    .getByRole("button", { name: "Find candidates to consider" })
    .click();
  for (const name of [
    "Homes people can afford",
    "Public safety",
    "Climate & environmental health",
  ])
    await guide.getByRole("button", { name }).click();
  await expect(
    guide.getByRole("button", { name: "Getting around" }),
  ).toBeDisabled();
  await guide.getByRole("button", { name: /Continue/ }).click();
  for (let i = 1; i <= 3; i++) {
    await expect(
      guide.getByText(`Question ${i} of 3`, { exact: true }),
    ).toBeVisible();
    await guide.getByRole("button", { name: /^It depends$/ }).click();
    await guide
      .getByRole("button", {
        name: i === 3 ? /Next: experience/ : /Next question/,
      })
      .click();
  }
  await expect(
    guide.getByRole("heading", { name: "What experience matters to you?" }),
  ).toBeVisible();
  await guide.getByRole("button", { name: "Explore candidates →" }).click();
  await expect(guide.getByRole("article")).toHaveCount(12);
  await expect(
    guide.getByRole("heading", { name: /Agreement on every/ }),
  ).toHaveCount(0);
  await guide
    .getByText("Want to explore one more choice? (Optional)", { exact: true })
    .click();
  await guide
    .getByRole("button", { name: /starting terms for renovating Moda/ })
    .click();
  await expect(
    guide.getByText("Optional extra question", { exact: true }),
  ).toBeVisible();
  await guide.getByRole("button", { name: /No —/ }).click();
  await guide.getByRole("button", { name: /Back to results/ }).click();
  await expect(
    guide.getByRole("heading", { name: "Candidates to explore", exact: true }),
  ).toBeVisible();
});
