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
  explorerTopics,
  hasTopic,
  topicPosition,
} from "../src/lib/voters-guide/explorer";
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
for (const district of [3, 4]) {
  const race = races.find((r) => r.id.endsWith(String(district)))!;
  test(`district ${district}: every topic returns sourced positions, not empty match cards`, async ({
    page,
  }) => {
    await page.setViewportSize({ width: 390, height: 700 });
    const errors: string[] = [];
    page.on("pageerror", (error) => errors.push(error.message));
    await page.goto(`/voters-guide/portland-district-${district}`);
    const guide = page.getByRole("region", {
      name: "Quick candidate comparison",
      exact: true,
    });
    const cards = guide.locator("[data-candidate]");
    await expect(cards).toHaveCount(race.candidates.length);
    for (const topic of explorerTopics) {
      await guide.getByLabel("Explore a topic").selectOption(topic.id);
      const known = race.candidates.filter((p) => hasTopic(p, topic.id));
      expect(known.length).toBeGreaterThan(1);
      await expect(cards).toHaveCount(known.length);
      for (const person of known) {
        const card = guide.locator(`[data-candidate="${person.id}"]`);
        const position = topicPosition(person, topic.id);
        await expect(card).toContainText(
          topic.id === "experience"
            ? person.background
            : (position?.position ?? person.summary),
        );
        if (position)
          await expect(
            card.getByRole("link", { name: /· source/ }),
          ).toHaveAttribute("href", position.source.url);
        await expect(
          card.getByRole("link", { name: "Full profile & record →" }),
        ).toHaveAttribute("href", `#${person.id}`);
      }
      const missing = race.candidates.filter((p) => !hasTopic(p, topic.id));
      if (missing.length) {
        const gaps = guide.locator("details").filter({
          has: page.locator("summary", { hasText: "more candidates" }),
        });
        await gaps.locator("summary").click();
        for (const person of missing)
          await expect(
            gaps.getByRole("link", { name: person.name, exact: true }),
          ).toHaveAttribute("href", `#${person.id}`);
        await gaps.locator("summary").click();
      }
      await expect(
        guide.getByText(/We have not established alignment/),
      ).toHaveCount(0);
      expect(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= innerWidth,
        ),
      ).toBe(true);
    }
    await page.setViewportSize({ width: 1365, height: 900 });
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
    ).toBe(true);
    expect(errors).toEqual([]);
  });
}

test("District 4 homelessness leads to real comparisons and carries selections into full research", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 700 });
  await page.goto("/voters-guide/portland-district-4");
  const guide = page.getByRole("region", {
    name: "Quick candidate comparison",
    exact: true,
  });
  await guide.getByLabel("Explore a topic").selectOption("safety");
  await expect(guide.locator('[data-candidate="olivia-clark"]')).toContainText(
    "Pairs removing street camping",
  );
  for (const name of ["Eli Arnold", "Olivia Clark"])
    await guide
      .getByRole("button", {
        name: `Select ${name} for quick comparison`,
        exact: true,
      })
      .click();
  await expect(
    guide.getByRole("button", { name: "Compare these two →" }),
  ).toBeInViewport({ ratio: 1 });
  await guide.getByRole("button", { name: "Compare these two →" }).click();
  await expect(guide.locator("[data-candidate]")).toHaveCount(2);
  await expect(
    guide.getByRole("heading", { name: "Side by side." }),
  ).toBeInViewport();
  await guide.getByLabel("Explore a topic").selectOption("climate");
  await expect(guide.locator('[data-candidate="olivia-clark"]')).toContainText(
    "water, sewer and street systems",
  );
  await guide.getByLabel("Explore a topic").selectOption("safety");
  await guide.getByRole("link", { name: "Compare full records →" }).click();
  await expect(
    page.getByRole("combobox", { name: "Candidate 1", exact: true }),
  ).toHaveValue("eli-arnold");
  await expect(
    page.getByRole("combobox", { name: "Candidate 2", exact: true }),
  ).toHaveValue("olivia-clark");
  await expect(
    page
      .getByRole("group", { name: "Comparison issue" })
      .getByRole("button", { name: "Safety & homelessness" }),
  ).toHaveAttribute("aria-pressed", "true");
  await page
    .locator("#compare")
    .getByRole("link", { name: "← Back to quick comparison" })
    .click();
  await expect(guide.locator("[data-candidate]")).toHaveCount(2);
  await guide
    .locator('[data-candidate="eli-arnold"]')
    .getByRole("link", { name: "Full profile & record →" })
    .click();
  await page
    .locator("article#eli-arnold")
    .getByRole("link", { name: "← Back to quick comparison" })
    .click();
  await expect(guide.getByLabel("Explore a topic")).toHaveValue("safety");
  await guide.getByLabel("Explore a topic").selectOption("experience");
  await guide.getByRole("link", { name: "Compare full records →" }).click();
  await expect(
    page
      .getByRole("group", { name: "Comparison issue" })
      .getByRole("button", { name: "Experience", exact: true }),
  ).toHaveAttribute("aria-pressed", "true");
  await expect(page.locator("#compare")).toContainText(
    races
      .find((r) => r.id.endsWith("4"))!
      .candidates.find((p) => p.id === "eli-arnold")!.background,
  );
  await page
    .locator("#compare")
    .getByRole("link", { name: "← Back to quick comparison" })
    .click();
  await guide.getByLabel("Explore a topic").selectOption("safety");
  expect(new URL(page.url()).search).toBe("");
  await page.reload();
  await expect(guide.getByLabel("Explore a topic")).toHaveValue("safety");
  await expect(
    guide.getByRole("button", {
      name: "Remove Eli Arnold for quick comparison",
      exact: true,
    }),
  ).toHaveAttribute("aria-pressed", "true");
  await guide.getByRole("button", { name: "Compare these two →" }).click();
  await expect(guide.locator("[data-candidate]")).toHaveCount(2);
  await guide.getByRole("button", { name: "Clear selection" }).click();
  await expect(
    guide.getByRole("button", { name: "Compare these two →" }),
  ).toHaveCount(0);
});

test("a missing topic shows the selected person's broader platform, never an empty result", async ({
  page,
}) => {
  const race = races.find((r) => r.id.endsWith("4"))!;
  const missing = race.candidates.find((p) => !hasTopic(p, "safety"))!;
  const known = race.candidates.find((p) => hasTopic(p, "safety"))!;
  await page.goto("/voters-guide/portland-district-4");
  const guide = page.getByRole("region", {
    name: "Quick candidate comparison",
    exact: true,
  });
  for (const person of [missing, known])
    await guide
      .getByRole("button", {
        name: `Select ${person.name} for quick comparison`,
        exact: true,
      })
      .click();
  await guide.getByRole("button", { name: "Compare these two →" }).click();
  await guide.getByLabel("Explore a topic").selectOption("safety");
  const card = guide.locator(`[data-candidate="${missing.id}"]`);
  await expect(card).toContainText("Here is their broader platform.");
  await expect(card).toContainText(missing.summary);
  await expect(guide.locator("[data-candidate]")).toHaveCount(2);
});

test("storage failure does not block browsing or comparing", async ({
  page,
}) => {
  await page.addInitScript(() =>
    Object.defineProperty(window, "sessionStorage", {
      get() {
        throw new Error("Storage disabled");
      },
    }),
  );
  await page.goto("/voters-guide/portland-district-4");
  const guide = page.getByRole("region", {
    name: "Quick candidate comparison",
    exact: true,
  });
  await expect(guide.locator("[data-candidate]")).toHaveCount(12);
  await guide.getByLabel("Explore a topic").selectOption("safety");
  await guide
    .getByRole("button", { name: /Select .* for quick comparison/ })
    .first()
    .click();
  await guide
    .getByRole("button", { name: /Select .* for quick comparison/ })
    .first()
    .click();
  await guide.getByRole("button", { name: "Compare these two →" }).click();
  await expect(guide.locator("[data-candidate]")).toHaveCount(2);
  await expect(guide.getByText(/this browser cannot save them/)).toBeVisible();
});
