import { test, expect, type Page } from "@playwright/test";

/** My ballot is reader-owned: saved in this tab only, never in a URL, never seeded by a link. */

const tray = (page: Page) => page.locator("[data-race-sheet-tray]");
/** Phones open the panel from the fixed bottom bar; desktop from the floating tray. Click whichever is visible. */
const openBallot = (page: Page) =>
  page
    .locator("[data-race-sheet-bar]")
    .getByRole("button", { name: /My ballot/ })
    .or(page.locator("[data-race-sheet-tray]").getByRole("button"))
    .filter({ visible: true })
    .first()
    .click();
const dialog = (page: Page) => page.getByRole("dialog", { name: "My ballot" });
const slots = (page: Page) => dialog(page).getByRole("list", { name: "Your 6 ballot slots" }).locator(":scope > li");
const storedKeys = (page: Page) => page.evaluate(() => Object.keys(sessionStorage).filter((k) => k.startsWith("pcl-ballot")));
function expectCleanUrl(page: Page) {
  const url = new URL(page.url());
  expect(url.search).toBe("");
  expect(url.href).not.toMatch(/ballot|eli-arnold|olivia-clark/);
}

test("saving, ordering, noting, removing and clearing stay private to this tab", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/voters-guide/portland-district-4");
  await expect(tray(page)).toHaveCount(0);
  await page.getByRole("button", { name: "Save Olivia Clark", exact: true }).click();
  await expect(tray(page)).toContainText("1 saved · Open my ballot");
  await page.getByRole("button", { name: "Save Eli Arnold", exact: true }).click();
  await expect(tray(page)).toContainText("2 saved · Open my ballot");
  expectCleanUrl(page);
  expect(await page.evaluate(() => Object.keys(localStorage))).toEqual([]);
  expect(await storedKeys(page)).toEqual(["pcl-ballot-portland-district-4"]);

  await openBallot(page);
  await expect(dialog(page)).toBeVisible();
  await expect(dialog(page)).toContainText("Stored only in this browser tab. The site never fills, sorts or shares it.");
  await expect(slots(page)).toHaveCount(6);
  await expect(slots(page).nth(0)).toContainText("Olivia Clark");
  await expect(slots(page).nth(1)).toContainText("Eli Arnold");
  await expect(slots(page).nth(0)).toContainText("Voted");
  await page.getByRole("button", { name: "Move Olivia Clark down", exact: true }).click();
  await expect(slots(page).nth(0)).toContainText("Eli Arnold");
  await expect(slots(page).nth(1)).toContainText("Olivia Clark");
  await page.getByLabel("Private note for Eli Arnold").fill("bike lanes");
  expectCleanUrl(page);

  await page.reload();
  await expect(tray(page)).toContainText("2 saved");
  await openBallot(page);
  await expect(slots(page).nth(0)).toContainText("Eli Arnold");
  await expect(page.getByLabel("Private note for Eli Arnold")).toHaveValue("bike lanes");
  await page.getByRole("button", { name: "Remove Olivia Clark", exact: true }).click();
  await expect(slots(page).nth(1)).toContainText("Empty");
  await page.getByRole("button", { name: "Clear", exact: true }).click();
  await page.getByRole("button", { name: "Yes, clear", exact: true }).click();
  await expect(slots(page).nth(0)).toContainText("Tap Save beside a name");
  await page.getByRole("button", { name: "Close my ballot", exact: true }).click();
  await expect(tray(page)).toHaveCount(0);
  expect(await storedKeys(page)).toEqual([]);
  expectCleanUrl(page);
});

test("saving still works when session storage throws, with a visible notice", async ({ page }) => {
  await page.addInitScript(() => {
    Storage.prototype.setItem = () => { throw new Error("Storage disabled"); };
  });
  await page.goto("/voters-guide/portland-district-4");
  await page.getByRole("button", { name: "Save Eli Arnold", exact: true }).click();
  await expect(tray(page)).toContainText("1 saved");
  await openBallot(page);
  await expect(slots(page).nth(0)).toContainText("Eli Arnold");
  await expect(dialog(page).getByRole("status").filter({ hasText: "cannot save" })).toHaveText("This browser cannot save your list after a reload.");
});

test("a legacy #compare link opens a shared view that never fills the ballot", async ({ page }) => {
  await page.goto("/voters-guide/portland-district-4#compare?people=eli-arnold,eli-arnold,steve-novick,olivia-clark&topic=x");
  const shared = page.getByRole("region", { name: "Eli Arnold · Olivia Clark" });
  await expect(shared).toBeVisible();
  await expect(shared).toContainText("Shared view · sent to you");
  await expect(shared).not.toContainText("Novick");
  await expect(tray(page)).toHaveCount(0);
  expect(await storedKeys(page)).toEqual([]);
  await expect(page.getByRole("button", { name: "Save Eli Arnold", exact: true })).toHaveAttribute("aria-pressed", "false");
  await shared.getByRole("button", { name: "Save these to my ballot" }).click();
  await expect(shared).toHaveCount(0);
  await expect(tray(page)).toContainText("2 saved");
  expect(await storedKeys(page)).toEqual(["pcl-ballot-portland-district-4"]);
});

test("a legacy #candidate hash redirects to the brief route", async ({ page }) => {
  await page.goto("/voters-guide/portland-district-3#esther-leon");
  await expect(page).toHaveURL(/\/voters-guide\/portland-district-3\/esther-leon$/);
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Esther León");
});
