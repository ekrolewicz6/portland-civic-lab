import { test, expect } from "@playwright/test";
import { races } from "../src/lib/voters-guide/published";
import { buildRaceSheet } from "../src/lib/voters-guide/race-sheet";
import { officeOf } from "../src/lib/voters-guide/race-sheet/office";
import { splitIssues } from "../src/lib/voters-guide/race-sheet/council-splits";
import { councilDisagreements } from "../src/lib/voters-guide/council-record-accounts";

/** Votes are words beside incumbents only; challengers appear beneath a vote only for an explicit statement. */

const VOTE_WORDS = ["Yes", "No", "Absent", "Not on committee"];

for (const race of races.filter((r) => officeOf(r).hasCouncilRecord)) {
  const sheet = buildRaceSheet(race);
  const incumbentIds = new Set(sheet.incumbents.map((p) => p.id));

  test(`${race.id}: four featured votes split among the incumbents, with the Said strip beneath`, async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 900 });
    await page.goto(`/voters-guide/${race.id}`);
    const panel = page.locator("#votes-panel");
    await expect(panel).toContainText("that is not a judgment");
    const featured = panel.locator("details");
    await expect(featured).toHaveCount(4);
    expect(sheet.featured).toHaveLength(4);
    for (const row of sheet.featured) {
      const details = panel.locator(`#vote-${row.questionId}`);
      await expect(details.locator("summary")).toContainText(row.title);
      const pills = details.locator("summary strong[data-vote]");
      await expect(pills).toHaveCount(sheet.incumbents.length);
      for (const vote of row.votes) {
        expect(VOTE_WORDS).toContain(vote.vote);
        await expect(details.locator("summary")).toContainText(vote.name);
        await expect(pills.filter({ hasText: vote.vote }).first()).toBeVisible();
      }
      if (!(await details.evaluate((d) => (d as HTMLDetailsElement).open))) await details.locator("summary").click();
      const challengers = race.candidates.length - sheet.incumbents.length;
      if (row.said.length === 0) {
        await expect(details.getByText("What other candidates have said", { exact: true })).toHaveCount(0);
        await expect(details).toContainText(`No other candidate addresses this exact choice in the sources we reviewed (${challengers} checked).`);
      } else {
        const strip = details.getByText("What other candidates have said", { exact: true }).locator("..");
        const said = strip.getByRole("listitem");
        await expect(said).toHaveCount(row.said.length);
        for (const entry of row.said) {
          expect(incumbentIds.has(entry.id)).toBe(false);
          await expect(strip.getByRole("link", { name: entry.name, exact: true })).toHaveAttribute("href", `/voters-guide/${race.id}/${entry.id}`);
          await expect(strip).toContainText(entry.line);
        }
        await expect(strip).toContainText(`Not addressed in their sources (${challengers - row.said.length})`);
      }
      await expect(details.getByRole("link", { name: /Read the votes and their reasons/ })).toHaveAttribute("href", new RegExp(`^/voters-guide/${race.id}/votes`));
    }
    expect(sheet.featured.some((r) => r.isModa)).toBe(true);
    for (const id of sheet.rows.filter((r) => !incumbentIds.has(r.id)).map((r) => r.id))
      await expect(panel.locator(`summary a[href$="/${id}"]`)).toHaveCount(0);
  });

  test(`${race.id}: the votes page lists the 16 split topics, the agreed list and the full record`, async ({ page }) => {
    const { topics, agreed } = splitIssues(race);
    expect(topics).toHaveLength(16);
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto(`/voters-guide/${race.id}/votes`);
    await expect(page.getByRole("heading", { name: "16 issues where they split" })).toBeVisible();
    const matrix = page.locator("details[data-topic]");
    await expect(matrix).toHaveCount(16);
    expect(await matrix.evaluateAll((nodes) => nodes.map((n) => n.id))).toEqual(topics.map((t) => t.id));
    await expect(page.locator("details[data-topic][open]")).toHaveCount(1);
    await expect(page.locator("#supplemental-budget")).toHaveAttribute("open", "");
    await expect(page.locator("#supplemental-budget strong[data-vote]").first()).toBeVisible();
    const agreedList = page.getByText("Agreed on every vote", { exact: true }).locator("..").getByRole("listitem");
    await expect(agreedList).toHaveCount(agreed.length);
    expect(topics.length + agreed.length).toBe(councilDisagreements.length);
    // The full record: one closed disclosure row per topic, in the matrix's idiom.
    const record = page.locator("#disagreements");
    await expect(record).toBeVisible();
    const recordRows = record.locator("details[id^=disagreement-]");
    await expect(recordRows).toHaveCount(councilDisagreements.length);
    await expect(record.locator("details[id^=disagreement-][open]")).toHaveCount(0);
    await expect(record.locator("[data-reader-candidate]")).toHaveCount(councilDisagreements.length * sheet.incumbents.length);
    // Opening a row shows a reading per incumbent and the decisions beneath.
    const budget = record.locator("#disagreement-supplemental-budget");
    await budget.locator("summary").first().click();
    await expect(budget.locator("[data-reader-candidate]")).toHaveCount(sheet.incumbents.length);
    for (const p of sheet.incumbents) await expect(budget.locator(`[data-reader-candidate="${p.id}"]`)).toContainText(p.name);
    await budget.getByRole("group").locator("summary").click();
    await expect(budget.locator("strong[data-vote]").first()).toBeVisible();
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    // A brief's link to a topic opens that row.
    await page.goto(`/voters-guide/${race.id}/votes#disagreement-moda`);
    await expect(record.locator("#disagreement-moda")).toHaveAttribute("open", "");
  });
}
