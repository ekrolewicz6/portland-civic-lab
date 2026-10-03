import { expect, test } from "@playwright/test";

const route = "/deep-dives/participatory-budgeting";
const legacyAnchors = ["what-a-yes-or-no-vote-would-do", "what-participatory-budgeting-actually-means", "read-the-actual-commitment-carefully", "follow-the-money-three-different-questions", "why-supporters-want-a-charter-guarantee", "the-strongest-case-for-voting-yes", "the-strongest-case-for-voting-no", "what-other-places-actually-tell-us", "checking-the-campaign-claims", "who-benefits-who-bears-the-risk", "what-would-make-the-proposal-easier-to-judge", "a-fair-way-to-make-the-voting-decision", "read-the-supplied-campaign-materials", "sources-and-scope"];

test("visual guide preserves campaign cases, old anchors, research and all five PDFs", async ({ page, request }) => {
  const errors: string[] = [];
  page.on("pageerror", error => errors.push(error.message));
  await page.goto("/deep-dives?q=26-267#collection");
  await page.getByTestId("dive-card").getByRole("link").click();
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Should Portland guarantee residents a vote on part of its budget?");
  await expect(page.getByRole("navigation", { name: "Article sections" }).getByRole("link")).toHaveCount(7);
  for (const id of legacyAnchors) expect(await page.locator(`[id="${id}"]`).count(), id).toBe(1);
  for (const side of ["yes", "no"]) {
    const panel = page.locator(`#the-strongest-case-for-voting-${side}`);
    await expect(panel).toBeVisible();
    await expect(panel.locator("blockquote")).toHaveCount(3);
  }
  await page.getByRole("link", { name: "Read the NO case", exact: true }).click();
  await expect(page.getByRole("heading", { name: "Test the approach before locking it in." })).toBeInViewport();
  const article = page.locator("article").first();
  const words = (await article.innerText()).trim().split(/\s+/).length;
  expect(words).toBeGreaterThanOrEqual(1600);
  expect(words).toBeLessThanOrEqual(2000);
  const documents = await article.locator('a[href^="/research/participatory-budgeting/"]').evaluateAll(links => [...new Set(links.map(a => a.getAttribute("href")!))]);
  expect(documents).toHaveLength(5);
  for (const href of documents) {
    const response = await request.get(href);
    expect(response.status(), href).toBe(200);
    expect(response.headers()["content-type"]).toContain("application/pdf");
    expect((await response.body()).subarray(0, 5).toString()).toBe("%PDF-");
  }
  await page.getByRole("link", { name: "Read the research edition" }).click();
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("The full research behind the voter guide.");
  await expect(page.getByRole("navigation", { name: "In this analysis" }).getByRole("link")).toHaveCount(14);
  for (const id of legacyAnchors) expect(await page.locator(`[id="${id}"]`).count(), id).toBe(1);
  expect(errors).toEqual([]);
});

test("allocation scenarios update in place and work with a keyboard", async ({ page }) => {
  await page.goto(route);
  const budget = page.getByTestId("pb-budget");
  const button = budget.getByRole("button", { name: "$3 million Illustrative alternative" });
  await button.scrollIntoViewIfNeeded();
  const before = await page.evaluate(() => scrollY);
  await button.click();
  await expect(budget).toContainText("$13.4 million");
  await expect(budget).toContainText("18.3% for administration");
  expect(Math.abs(await page.evaluate(() => scrollY) - before)).toBeLessThan(2);
  await budget.getByRole("button", { name: "$2 million Illustrative alternative" }).focus();
  await page.keyboard.press("Enter");
  await expect(budget).toContainText("$14.4 million");
  await expect(budget.getByRole("button", { name: "$2 million Illustrative alternative" })).toHaveAttribute("aria-pressed", "true");
  await budget.getByRole("button", { name: "$1 million Advocate’s estimate" }).click();
  await expect(budget).toContainText("$15.4 million");
});

test("guide fits six screen sizes, text enlargement and reduced motion", async ({ page }) => {
  await page.goto(route);
  for (const width of [320, 390, 768, 1024, 1440, 1920]) {
    await page.setViewportSize({ width, height: 950 });
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1), `overflow at ${width}`).toBe(true);
    const smallText = await page.locator("article").first().evaluate(article => [...article.querySelectorAll("p, a, span, button, dt, small")].filter(el => el.getClientRects().length && Number.parseFloat(getComputedStyle(el).fontSize) < 15).map(el => el.textContent?.slice(0, 50)));
    expect(smallText, `small text at ${width}`).toEqual([]);
  }
  for (const width of [320,390,768,1440]) {
    await page.setViewportSize({ width, height: 950 });
    await page.evaluate(() => { document.documentElement.style.fontSize = "200%"; });
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1), `zoom overflow at ${width}`).toBe(true);
  }
  await page.emulateMedia({ reducedMotion: "reduce" });
  expect(await page.locator("article").first().evaluate(el => getComputedStyle(el).scrollBehavior)).toBe("auto");
});

test("guide and complete research remain readable without JavaScript", async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  const page = await context.newPage();
  await page.goto(route);
  await expect(page.getByRole("heading", { name: "Read the words. Check the evidence." })).toBeVisible();
  expect(await page.getByTestId("pb-budget").innerText()).toContain("With $2M in administration, $14.4M remains for projects.");
  await page.getByText("What those budget terms mean", {exact:true}).click();
  await expect(page.getByText(/“Adopted” means approved/)).toBeVisible();
  await page.goto(route+"/research");
  await expect(page.getByRole("navigation", { name: "In this analysis" }).getByRole("link")).toHaveCount(14);
  await expect(page.locator("#what-other-places-actually-tell-us")).toContainText("Cambridge");
  await context.close();
});
