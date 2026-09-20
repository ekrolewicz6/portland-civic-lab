import { test, expect } from "@playwright/test";
import { races } from "../src/lib/voters-guide/published";
import { buildRaceSheet, issues } from "../src/lib/voters-guide/race-sheet";

/** The brief: one skeleton for everyone, on its own route; the print edition carries all of them. */

const d3 = buildRaceSheet(races.find((r) => r.id === "portland-district-3")!);
const at = (id: string) => d3.rows.findIndex((r) => r.id === id);

for (const id of ["esther-leon", "tiffany-koyama-lane"]) {
  const row = d3.rows.find((r) => r.id === id)!;
  test(`brief for ${id}: breadcrumb, H1, four issues, sources, neighbours and the ${row.incumbent ? "votes" : "no-vote sentence"}`, async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto(`/voters-guide/portland-district-3/${id}`);
    const crumbs = page.getByRole("navigation", { name: "Breadcrumb" });
    await expect(crumbs.getByRole("link", { name: "Voter guide" })).toHaveAttribute("href", "/voters-guide");
    await expect(crumbs.getByRole("link", { name: "District 3" })).toHaveAttribute("href", "/voters-guide/portland-district-3");
    await expect(crumbs.locator("[aria-current=page]")).toHaveText(row.name);
    await expect(page.getByRole("heading", { level: 1 })).toHaveText(row.name);
    await expect(page.getByRole("heading", { level: 2 })).toContainText(["In their words", "What they say they would do", "Our reading", "Where they stand", "Council votes", /^Sources \(\d+\)$/]);
    const opening = page.locator(`section[aria-labelledby="${id}-opening"]`);
    await expect(opening.locator("blockquote")).toContainText(row.ownWords!.text);
    await expect(opening).toContainText("verbatim opening");
    await expect(opening.locator("details summary")).toHaveText(row.ownWords!.source.label);
    await expect(opening.locator("details a[rel=noopener]")).toHaveAttribute("href", row.ownWords!.source.url);
    const stand = page.locator(`section[aria-labelledby="${id}-stand"]`);
    await expect(stand.getByRole("heading", { level: 3 })).toHaveText(issues.map((i) => i.label));
    for (const issue of issues) {
      const cell = row.cells[issue.id];
      if (cell.position) await expect(stand).toContainText(cell.position);
    }
    await expect(stand.getByText("Not found in the sources we reviewed. That is a research gap, not a position.")).toHaveCount(issues.filter((i) => !row.cells[i.id].position).length);
    await expect(page.locator(`section[aria-labelledby="${id}-sources"] ol li`)).not.toHaveCount(0);
    const votes = page.locator(`section[aria-labelledby="${id}-votes"]`);
    if (row.incumbent) {
      await expect(votes.locator("ol li")).toHaveCount(4);
      await expect(votes.locator("strong[data-vote]")).toHaveCount(4);
      await expect(votes.getByRole("link", { name: /^All \d+ topics/ })).toHaveAttribute("href", "/voters-guide/portland-district-3/votes");
    } else {
      await expect(votes).toContainText("No Council vote yet. That is not a judgment about experience.");
      await expect(votes.locator("strong[data-vote]")).toHaveCount(0);
    }
    const previous = d3.rows[at(id) - 1];
    const next = d3.rows[at(id) + 1];
    await expect(page.locator("a[rel=prev]")).toHaveAttribute("href", `/voters-guide/portland-district-3/${previous.id}`);
    await expect(page.locator("a[rel=next]")).toHaveAttribute("href", `/voters-guide/portland-district-3/${next.id}`);
    await expect(page.locator("a[rel=prev]")).toContainText(previous.name);
    await expect(page.locator("a[rel=next]")).toContainText(next.name);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  });
}

for (const race of races) {
  test(`${race.id}: the print edition carries every brief and opens every disclosure before printing`, async ({ page }) => {
    await page.goto(`/voters-guide/${race.id}/print`);
    const articles = page.locator("article[id]");
    await expect(articles).toHaveCount(race.candidates.length);
    expect(await articles.evaluateAll((nodes) => nodes.map((n) => n.id))).toEqual(buildRaceSheet(race).rows.map((r) => r.id));
    await expect(page.getByRole("heading", { level: 1 })).toHaveText(race.title);
    const total = await page.locator("details").count();
    expect(total).toBeGreaterThan(0);
    expect(await page.locator("details[open]").count()).toBeLessThan(total);
    await page.evaluate(() => { window.print = () => window.dispatchEvent(new Event("beforeprint")); });
    await page.getByRole("button", { name: "Print", exact: true }).click();
    await expect(page.locator("details[open]")).toHaveCount(total);
    await page.evaluate(() => window.dispatchEvent(new Event("afterprint")));
    expect(await page.locator("details[open]").count()).toBeLessThan(total);
  });
}
