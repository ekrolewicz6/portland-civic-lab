import { expect, test } from "@playwright/test";

test("the guide answers questions in order and keeps the teaching calculator deeper", async ({ page }) => {
  await page.route("**/api/oregon-fire/records?*", route => route.fulfill({
    status: 503, json: { error: "Records temporarily unavailable" },
  }));
  await page.goto("/oregon-fire");
  await expect(page.getByRole("heading", { level: 1, name: /Fire in Oregon/ })).toBeVisible();
  await expect(page.getByRole("navigation", { name: "Questions answered in the guide" })).toContainText("What does the money buy?");
  await expect(page.locator(".fire-long-chapter")).toHaveCount(8);
  await expect(page.locator("#actual-fire-spending")).toContainText("$50.98 million");
  await expect(page.locator("#actual-fire-spending")).toContainText("Forest Legacy");
  await expect(page.locator(".fire-cost-explorer")).toHaveCount(0);
  // Just after load the router re-applies its own URL, dropping a hash set in
  // the meantime. The explorer's alert appears once that has settled.
  await expect(page.locator(".fire-explorer").getByRole("alert").filter({ hasText: "Records temporarily unavailable" })).toHaveCount(1);
  await page.getByRole("navigation", { name: "Questions answered in the guide" })
    .getByRole("link", { name: /What does the money buy/ }).click();
  await expect(page).toHaveURL(/#costs-and-choices$/);
  await expect(page.locator("#costs-and-choices")).toContainText("What does the money actually buy?");
  await page.getByRole("link", { name: /Follow the landscape investigation/ }).click();
  await expect(page).toHaveURL(/\/oregon-fire\/landscapes$/);
  await expect(page.getByRole("heading", { level: 1 })).toContainText("turn a plan into work");
  await expect(page.getByText(/no candidate has passed them yet/i)).toBeVisible();
});

test("the main guide and landscape screen fit a narrow phone", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  for (const url of ["/oregon-fire", "/oregon-fire/landscapes"]) {
    await page.goto(url);
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBeTruthy();
  }
});

test("the landscape investigation has a working social image and canonical URL", async ({ request }) => {
  const page = await request.get("/oregon-fire/landscapes");
  expect(page.ok()).toBeTruthy();
  const html = await page.text();
  expect(html).toContain('rel="canonical" href="https://www.portlandciviclab.org/oregon-fire/landscapes"');
  const image = html.match(/<meta property="og:image" content="([^"]+)"/);
  expect(image?.[1]).toBeTruthy();
  const imageUrl = new URL(image![1]);
  const response = await request.get(`${imageUrl.pathname}${imageUrl.search}`);
  expect(response.ok()).toBeTruthy();
  expect(response.headers()["content-type"]).toContain("image/png");
});
