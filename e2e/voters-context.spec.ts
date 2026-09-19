import { expect, test } from "@playwright/test";
import { councilDisagreements } from "../src/lib/voters-guide/council-record-accounts";
import { councilReaderCopy } from "../src/lib/voters-guide/council-reader-copy";
import { councilDecisions } from "../src/lib/voters-guide/council-decisions";

const shorthand = /parks shift|climate-interest|oversight underspending|citizen-suit|PSU\/Keller|\bremand\b|baseline interest|broad restorations/i;
test("all 29 topics have six contextual summaries and retain their source decisions", () => {
  expect(Object.keys(councilReaderCopy).sort()).toEqual(councilDisagreements.map(t => t.id).sort());
  for (const topic of councilDisagreements) {
    const copy = councilReaderCopy[topic.id];
    expect(Object.keys(copy.readings).sort()).toEqual(Object.keys(councilDecisions.find(d => d.id === topic.decisionIds[0])!.votes).sort());
    for (const card of Object.values(copy.readings)) {
      expect(card.headline + " " + card.text).not.toMatch(shorthand);
      expect(card.text.split(/\s+/).length).toBeLessThanOrEqual(150);
    }
  }
});
for (const district of [3, 4]) {
  test(`district ${district}: every council topic displays self-contained summaries on mobile`, async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto(`/voters-guide/portland-district-${district}#disagreements`);
    const picker = page.getByRole("combobox", { name: "Choose a Council issue" });
    for (const topic of councilDisagreements) {
      await picker.selectOption(topic.id);
      const panel = page.locator(`#disagreement-${topic.id}`);
      await expect(panel).toBeVisible();
      const cards = panel.locator("[data-reader-candidate]");
      await expect(cards).toHaveCount(3);
      for (const card of await cards.all()) {
        await expect(card).not.toContainText(shorthand);
        expect((await card.locator("p").allTextContents()).join(" ").length).toBeGreaterThan(80);
      }
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    }
  });
}
test("the reported budget example explains the money, services, dates and forecast", async ({ page }) => {
  await page.goto("/voters-guide/portland-district-4#disagreements");
  const panel = page.locator("#disagreement-supplemental-budget");
  await expect(panel).toContainText("$1.9 million in proposed new police funding to park maintenance");
  await expect(panel).toContainText("$12.2 million");
  const green = panel.locator('[data-reader-candidate="mitch-green"]');
  await expect(green.locator("p")).toHaveCount(3);
  await expect(green).toContainText("In 2025");
  await expect(green).toContainText("In June 2026");
  await expect(green).toContainText("parks, fire rescue, unarmed police support and other city jobs");
  await expect(green).toContainText("investigating police misconduct");
  await expect(green).toContainText("one-time money");
  const clark = panel.locator('[data-reader-candidate="olivia-clark"]');
  await expect(clark).toContainText("$7.68 million");
  await expect(clark).toContainText("Those savings were a forecast");
});
