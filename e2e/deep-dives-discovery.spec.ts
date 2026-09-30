import { expect, test } from "@playwright/test";

const cards = (page: import("@playwright/test").Page) => page.getByTestId("dive-card");

test("readers can combine topics and search, recover from no results, and share their selection", async ({ page }) => {
  const errors: string[] = [];
  page.on("pageerror", e => errors.push(e.message));
  await page.goto("/deep-dives");
  await expect(cards(page)).toHaveCount(17);
  const links = await cards(page).locator("a").evaluateAll(elements => elements.map(a => a.getAttribute("href")));
  expect(new Set(links).size).toBe(17);
  await page.getByRole("link", { name: "Find your next question" }).click();
  await page.getByRole("navigation", { name: "Filter stories by topic" }).getByRole("link", { name: "Housing & care 5", exact: true }).click();
  await expect(cards(page)).toHaveCount(5);
  await page.getByRole("searchbox", { name: "Search deep dives" }).fill("wood");
  await expect(cards(page)).toHaveCount(1);
  await expect(cards(page)).toContainText("Can Oregon build more homes with wood?");
  await expect(page).toHaveURL(/topic=housing&q=wood/);
  await page.reload();
  await expect(cards(page)).toHaveCount(1);
  await expect(page.getByRole("searchbox")).toHaveValue("wood");
  await page.getByRole("searchbox").fill("no-such-story-xyz");
  await expect(cards(page)).toHaveCount(0);
  await expect(page.getByRole("heading", { name: "No stories match that search yet." })).toBeVisible();
  await page.getByRole("button", { name: "Show all 17 deep dives" }).click();
  await expect(cards(page)).toHaveCount(17);
  await expect(page.getByRole("searchbox")).toHaveValue("");
  expect(errors).toEqual([]);
});

test("sort and browser history preserve the reader’s place and filters", async ({ page }) => {
  await page.goto("/deep-dives#collection");
  const topics = page.getByRole("navigation", { name: "Filter stories by topic" });
  await topics.getByRole("link", { name: "Public money 10", exact: true }).click();
  await expect(cards(page)).toHaveCount(10);
  const before = await page.evaluate(() => window.scrollY);
  await topics.getByRole("link", { name: "Work & economy 4", exact: true }).click();
  await expect(cards(page)).toHaveCount(4);
  expect(Math.abs(await page.evaluate(() => window.scrollY) - before)).toBeLessThan(3);
  await page.goBack();
  await expect(topics.getByRole("link", { name: "Public money 10", exact: true })).toHaveAttribute("aria-current", "true");
  await expect(cards(page)).toHaveCount(10);
  await page.goForward();
  await expect(cards(page)).toHaveCount(4);
  await page.getByRole("combobox", { name: "Sort by" }).selectOption("title");
  const titles = await cards(page).getByRole("heading").allTextContents();
  expect(titles).toEqual([...titles].sort((a,b)=>a.localeCompare(b,"en")));
  await cards(page).getByRole("link", { name: "Are Oregon’s data-center tax breaks worth it?" }).click();
  await expect(page).toHaveURL(/\/deep-dives\/data-centers$/);
  await expect(page.getByRole("heading", { level: 1 })).toContainText("Oregon’s data centers");
  await page.goBack();
  await expect(cards(page)).toHaveCount(4);
  await expect(page.getByRole("combobox", { name: "Sort by" })).toHaveValue("title");
});

test("the whole collection is readable without JavaScript and direct query URLs work", async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  const page = await context.newPage();
  await page.goto("/deep-dives");
  await expect(cards(page)).toHaveCount(17);
  await page.goto("/deep-dives?topic=money&q=schools#collection");
  await expect(cards(page)).toHaveCount(2);
  await expect(cards(page).getByRole("link", { name: "What gets a school dollar to a student?" })).toBeVisible();
  await page.goto("/deep-dives?topic=invalid&sort=invalid");
  await expect(cards(page)).toHaveCount(17);
  await context.close();
});

test("phone and wide layouts fit the screen, and filters work with a keyboard", async ({ page }) => {
  await page.goto("/deep-dives");
  for (const width of [320, 390, 768, 1024, 1440, 1800]) {
    await page.setViewportSize({ width, height: 950 });
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1)).toBe(true);
    await expect(cards(page)).toHaveCount(17);
  }
  await page.setViewportSize({ width: 390, height: 950 });
  await page.evaluate(() => { document.documentElement.style.fontSize = "200%"; });
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1)).toBe(true);
  await page.evaluate(() => { document.documentElement.style.fontSize = ""; });
  await page.getByRole("navigation", { name: "Filter stories by topic" }).getByRole("link", { name: "Power & politics 6", exact: true }).focus();
  await page.keyboard.press("Enter");
  await expect(cards(page)).toHaveCount(6);
  await page.getByRole("searchbox").focus();
  await page.keyboard.type("council");
  await expect(cards(page)).toHaveCount(4);
  await expect(page.getByRole("status")).toContainText("4 deep dives");
});
