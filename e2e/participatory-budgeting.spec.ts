import { expect, test } from "@playwright/test";

const route = "/deep-dives/participatory-budgeting";

test("readers can reach the complete analysis and download its five source documents", async ({ page, request }) => {
  const errors: string[] = [];
  page.on("pageerror", error => errors.push(error.message));
  await page.goto("/deep-dives?q=26-267#collection");
  await page.getByTestId("dive-card").getByRole("link").click();
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Who should decide Portland’s next public investments?");
  const nav = page.getByRole("navigation", { name: "In this analysis" });
  await expect(nav.getByRole("link")).toHaveCount(14);
  const missing = await nav.getByRole("link").evaluateAll(links => links.map(a => a.getAttribute("href")!).filter(href => !document.getElementById(href.slice(1))));
  expect(missing).toEqual([]);
  await page.getByRole("link", { name: "Examine the case for NO ↓" }).click();
  await expect(page.getByRole("heading", { name: "The strongest case for voting NO", exact: true })).toBeInViewport();
  const documents = await page.locator('article a[href^="/research/participatory-budgeting/"]').evaluateAll(links => [...new Set(links.map(a => a.getAttribute("href")!))]);
  expect(documents).toHaveLength(5);
  for (const href of documents) {
    const response = await request.get(href);
    expect(response.status(), href).toBe(200);
    expect(response.headers()["content-type"]).toContain("application/pdf");
    expect((await response.body()).subarray(0, 5).toString()).toBe("%PDF-");
  }
  expect(errors).toEqual([]);
});

test("administration scenarios update project money and remain usable by keyboard", async ({ page }) => {
  await page.goto(route + "#follow-the-money-three-different-questions");
  const budget = page.getByRole("figure", { name: "One allocation. Two uses." });
  await expect(budget).toContainText("$15.4M");
  await budget.getByRole("button", { name: "$3 million", exact: true }).click();
  await expect(budget).toContainText("$13.4M");
  await expect(budget).toContainText("(18.3%)");
  await budget.getByRole("button", { name: "$2 million", exact: true }).focus();
  await page.keyboard.press("Enter");
  await expect(budget).toContainText("$14.4M");
  await expect(budget.getByRole("button", { name: "$2 million", exact: true })).toHaveAttribute("aria-pressed", "true");
});

test("article fits phones through wide screens and remains readable without JavaScript", async ({ page, browser }) => {
  await page.goto(route);
  for (const width of [320, 390, 768, 1024, 1440, 1800]) {
    await page.setViewportSize({ width, height: 950 });
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1), `overflow at ${width}`).toBe(true);
    const smallText = await page.locator("article").evaluate(article => [...article.querySelectorAll("p, a, span, button, td, th, dt, small")].filter(el => el.getClientRects().length && Number.parseFloat(getComputedStyle(el).fontSize) < 14).map(el => el.textContent?.slice(0, 50)));
    expect(smallText, `small text at ${width}`).toEqual([]);
  }
  await page.setViewportSize({ width: 390, height: 950 });
  await page.evaluate(() => { document.documentElement.style.fontSize = "200%"; });
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1)).toBe(true);
  const context = await browser.newContext({ javaScriptEnabled: false });
  const noJS = await context.newPage();
  await noJS.goto(route);
  await expect(noJS.getByRole("heading", { name: "Sources and scope", exact: true })).toBeVisible();
  await expect(noJS.getByRole("figure")).toContainText("$15.4M");
  await context.close();
});
