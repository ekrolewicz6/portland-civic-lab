import { test, expect, type Page } from "@playwright/test";
import { races } from "../src/lib/voters-guide/published";
import { buildRaceSheet, issues, type IssueId } from "../src/lib/voters-guide/race-sheet";

/** The race page: every name once, A–Z, one line each; chips swap the line in place. */

const sheets = races.map(buildRaceSheet);
const nouns: Record<IssueId, string> = { housing: "housing", safety: "safety", money: "taxes and bills", climate: "streets and climate" };
const rail = (page: Page) => page.getByRole("group", { name: "Show each candidate's line on" });
const rows = (page: Page) => page.locator("#list article[data-candidate]");
const fits = (page: Page) => page.evaluate(() => document.documentElement.scrollWidth <= innerWidth);

for (const sheet of sheets) {
  const { race } = sheet;
  test(`${race.id}: every candidate on the checked roster, alphabetical, once, with Save and no numeral`, async ({ page }) => {
    await page.goto(`/voters-guide/${race.id}`);
    for (const width of [320, 390, 1280]) {
      await page.setViewportSize({ width, height: width < 700 ? 844 : 900 });
      const ids = await rows(page).evaluateAll((nodes) => nodes.map((n) => (n as HTMLElement).dataset.candidate));
      expect(ids).toEqual(sheet.rows.map((r) => r.id));
      expect(new Set(ids).size).toBe(race.candidates.length);
      expect(sheet.rows.map((r) => r.name)).toEqual([...sheet.rows.map((r) => r.name)].sort((a, b) => a.localeCompare(b, "en")));
      for (const row of sheet.rows) {
        const article = page.locator(`#list article[data-candidate="${row.id}"]`);
        await expect(article.getByRole("button", { name: `Save ${row.name}`, exact: true })).toHaveAttribute("aria-pressed", "false");
        const text = (await article.locator("summary").innerText()).replace(/\s+/g, " ");
        expect(text).toContain(row.name);
        expect(text.slice(0, text.indexOf(row.name)), `numeral before ${row.name}`).not.toMatch(/\d/);
      }
      expect(await fits(page)).toBe(true);
    }
  });

  test(`${race.id}: chips keep every row, swap lines, report coverage and mirror #issue=`, async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto(`/voters-guide/${race.id}`);
    const status = page.locator("[data-race-sheet-rail] [role=status]");
    await expect(status).toHaveText(`${sheet.rows.length} candidates, A–Z. Tap a name for more.`);
    for (const issue of issues) {
      await rail(page).getByRole("button", { name: issue.label, exact: true }).click();
      await expect(page).toHaveURL(new RegExp(`#issue=${issue.id}$`));
      expect(new URL(page.url()).search).toBe("");
      await expect(rows(page)).toHaveCount(sheet.rows.length);
      await expect(status).toHaveText(`${sheet.coverage[issue.id]} of ${sheet.rows.length} have a ${nouns[issue.id]} position in the sources we reviewed.`);
      const gaps: string[] = [];
      for (const row of sheet.rows) {
        const summary = page.locator(`#list article[data-candidate="${row.id}"] summary`);
        const cell = row.cells[issue.id];
        if (cell.line) await expect(summary).toContainText(cell.line);
        else if (row.missing) await expect(summary).toContainText(row.missing === "filing-only" ? "Filing statement only" : "No platform found");
        else {
          await expect(summary).toContainText("Not found in the sources we reviewed");
          gaps.push(await summary.evaluate((el) => [...el.querySelectorAll("span[aria-hidden]")].find((s) => s.textContent === "—")!.parentElement!.outerHTML));
        }
      }
      expect(gaps.length).toBe(sheet.rows.filter((r) => !r.cells[issue.id].line && !r.missing).length);
      expect(new Set(gaps).size, "a dash row has identical markup for everyone").toBeLessThanOrEqual(1);
      expect(await fits(page)).toBe(true);
    }
    await rail(page).getByRole("button", { name: "Summary", exact: true }).click();
    expect(new URL(page.url()).hash).toBe("");
    await expect(rows(page)).toHaveCount(sheet.rows.length);
  });
}

test("the two missing states share one visual treatment on the row", async ({ page }) => {
  const classes: string[] = [];
  for (const [raceId, id, label] of [["portland-district-3", "darren-mccormick", "Filing statement only"], ["portland-district-4", "john-j-goldsmith", "No platform found"]]) {
    await page.goto(`/voters-guide/${raceId}`);
    const chip = page.locator(`#list article[data-candidate="${id}"] summary`).getByText(label, { exact: true });
    await expect(chip).toBeVisible();
    classes.push((await chip.getAttribute("class")) ?? "");
    await page.getByRole("button", { name: "Rent and homes", exact: true }).click();
    await expect(chip).toBeVisible();
  }
  expect(classes[0]).not.toBe("");
  expect(classes[0]).toBe(classes[1]);
});

test("a card shows our reading with tags and tradeoff together, expands its source chip and links the brief", async ({ page }) => {
  const sheet = sheets.find((s) => s.race.id === "portland-district-3")!;
  const row = sheet.rows.find((r) => r.id === "esther-leon")!;
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/voters-guide/portland-district-3#issue=housing");
  await expect(page.getByRole("button", { name: "Rent and homes", exact: true })).toHaveAttribute("aria-pressed", "true");
  const article = page.locator('#list article[data-candidate="esther-leon"]');
  await article.locator("summary").click();
  const reading = article.locator('[data-layer="interpretation"]');
  await expect(reading).toContainText("Our reading");
  await expect(reading.getByRole("list", { name: "Values we read in their statements" }).locator("li")).toHaveText(row.values);
  await expect(reading).toContainText(row.tradeoff);
  await expect(article.locator('[data-layer="position"]')).toContainText(row.cells.housing.position!);
  const chip = article.getByText("Primary source", { exact: true }).locator("..").getByRole("button", { name: row.primarySource.label });
  await expect(chip).toHaveAttribute("aria-expanded", "false");
  await chip.click();
  await expect(chip).toHaveAttribute("aria-expanded", "true");
  const detail = page.locator(`[id="${await chip.getAttribute("aria-controls")}"]`);
  await expect(detail).toContainText(`${row.primarySource.evidence.kind} · ${row.primarySource.evidence.date}`);
  if (row.primarySource.evidence.note) await expect(detail).toContainText(row.primarySource.evidence.note);
  await expect(detail.getByRole("link")).toHaveAttribute("href", row.primarySource.url);
  await expect(article.getByRole("link", { name: "Full brief" })).toHaveAttribute("href", "/voters-guide/portland-district-3/esther-leon");
  expect(await fits(page)).toBe(true);
});

test("share yields a URL with no query string and at most #issue=", async ({ page }) => {
  await page.addInitScript(() => {
    Object.defineProperty(navigator, "share", { value: undefined, configurable: true });
    Object.defineProperty(navigator, "clipboard", { value: { writeText: async (value: string) => { (window as unknown as { copied: string }).copied = value; } }, configurable: true });
  });
  await page.goto("/voters-guide/portland-district-4");
  await page.getByRole("button", { name: "Save Eli Arnold", exact: true }).click();
  await page.getByRole("button", { name: "Share this list", exact: true }).click();
  const copied = () => page.evaluate(() => (window as unknown as { copied: string }).copied);
  let url = new URL(await copied());
  expect(url.search).toBe("");
  expect(url.hash).toBe("");
  await page.getByRole("button", { name: "Your bills and taxes", exact: true }).click();
  await page.getByRole("button", { name: "Share the money view", exact: true }).click();
  url = new URL(await copied());
  expect(url.search).toBe("");
  expect(url.hash).toBe("#issue=money");
  expect(url.href).not.toContain("eli-arnold");
});

test("no horizontal overflow at 320, 390, 768 and 1280 on the race page and a brief", async ({ page }) => {
  for (const path of ["/voters-guide/portland-district-3#issue=safety", "/voters-guide/portland-district-3/heart-free-pham"]) {
    await page.goto(path);
    for (const width of [320, 390, 768, 1280]) {
      await page.setViewportSize({ width, height: 844 });
      expect(await fits(page), `${path} at ${width}`).toBe(true);
    }
  }
});
