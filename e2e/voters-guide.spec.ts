import { expect, test } from "@playwright/test";

test("directory searches names with accents and explains coverage", async ({
  page,
}) => {
  await page.goto("/voters-guide");
  await expect(page.getByRole("heading", { level: 1 })).toContainText(
    "Know the choice",
  );
  await expect(
    page.getByText("Working research edition", { exact: true }),
  ).toBeVisible();
  await page
    .getByRole("searchbox", { name: "Search races or candidates" })
    .fill("esther leon");
  await expect(page.getByRole("status")).toHaveText("1 race");
  await expect(
    page.getByRole("link", { name: /Portland Council · District 3/ }),
  ).toBeVisible();
  await page.getByRole("searchbox").fill("unpublished district");
  await expect(
    page.getByRole("heading", { name: "No matching race" }),
  ).toBeVisible();
  await page.getByRole("button", { name: "Clear filters" }).click();
  await expect(page.getByRole("searchbox")).toHaveValue("");
  await expect(page.getByRole("status")).toHaveText("2 races");
});

test("comparison starts neutral, caps three and restores the complete field", async ({
  page,
}) => {
  await page.goto("/voters-guide/portland-district-3");
  const boxes = page.getByRole("checkbox");
  await expect(boxes).toHaveCount(21);
  await expect(page.locator("input:checked")).toHaveCount(0);
  const names = await boxes.evaluateAll((nodes) =>
    nodes.map((n) => n.closest("label")?.textContent),
  );
  expect(names).toEqual(
    [...names].sort((a, b) => (a ?? "").localeCompare(b ?? "", "en")),
  );
  await boxes.nth(0).check();
  await boxes.nth(1).check();
  await boxes.nth(2).check();
  await expect(boxes.nth(3)).toBeDisabled();
  await page.getByRole("button", { name: "Compare selected (3/3)" }).click();
  await expect(page.getByRole("table")).toBeVisible();
  await expect(page.locator("article")).toHaveCount(3);
  await expect(
    page.getByRole("rowheader", { name: "Our interpretation" }),
  ).toBeVisible();
  await page.getByRole("button", { name: "Show all candidates" }).click();
  await expect(page.getByRole("table")).toHaveCount(0);
  await expect(page.locator("article")).toHaveCount(21);
  await expect(page.locator("input:checked")).toHaveCount(0);
});

test("sources are attributed and printing opens then restores disclosure state", async ({
  page,
}) => {
  await page.goto("/voters-guide/portland-district-4");
  await expect(page.locator("details[open]")).toHaveCount(0);
  await page.locator("details summary").first().click();
  await expect(page.locator("details[open]")).toHaveCount(1);
  await expect(page.locator("details[open]")).toContainText(
    "Candidate statement",
  );
  await page.evaluate(() => {
    window.print = () => {};
  });
  await page.getByRole("button", { name: "Print this race" }).click();
  await expect(page.locator("details[open]")).toHaveCount(12);
  await page.evaluate(() => window.dispatchEvent(new Event("afterprint")));
  await expect(page.locator("details[open]")).toHaveCount(1);
  await page.emulateMedia({ media: "print" });
  await expect(
    page.getByText(/candidates · Reviewed September 18, 2026/),
  ).toBeVisible();
});

test("mobile comparisons scroll locally without overflowing the page", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await page.goto("/voters-guide");
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBe(true);
  await page.goto("/voters-guide/portland-district-4");
  await page.getByRole("checkbox").nth(0).check();
  await page.getByRole("checkbox").nth(1).check();
  await page.getByRole("button", { name: "Compare selected (2/3)" }).click();
  await expect(page.getByRole("table")).toBeVisible();
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBe(true);
  expect(errors).toEqual([]);
});

test("export preserves evidence, missing research and the full field", async ({
  request,
}) => {
  const response = await request.get("/voters-guide/evidence");
  expect(response.ok()).toBe(true);
  expect(response.headers()["content-disposition"]).toContain("attachment");
  const payload = await response.json();
  expect(payload.reviewed).toBe("2026-09-18");
  expect(payload.races).toHaveLength(2);
  const people = payload.races.flatMap(
    (r: { candidates: unknown[] }) => r.candidates,
  );
  expect(people).toHaveLength(33);
  expect(people.some((p: { missing?: string }) => p.missing)).toBe(true);
  expect(payload.status).toContain("human editorial review is incomplete");
});

test("unknown race fails closed and research log is reachable", async ({
  page,
  request,
}) => {
  const response = await request.get("/voters-guide/invented-race");
  expect((await request.get("/voters-guide/oregon-governor")).status()).toBe(
    404,
  );
  expect((await request.get("/voters-guide/portland-auditor")).status()).toBe(
    404,
  );
  expect(response.status()).toBe(404);
  await page.goto("/voters-guide/methodology");
  await page
    .getByRole("link", { name: "Read the research and corrections log" })
    .click();
  await expect(
    page.getByRole("heading", { name: "The research log", exact: true }),
  ).toBeVisible();
});

test("Portland portrait directory preserves the field, credits and comparison navigation", async ({
  page,
}) => {
  await page.goto("/voters-guide/portland-district-3");
  await expect(page.getByRole("checkbox")).toHaveCount(21);
  const directory = page.getByRole("group", { name: "Candidates to compare" });
  await expect(directory.locator("img")).toHaveCount(20);
  await expect(directory.getByText("Portrait to come")).toHaveCount(1);
  await expect(page.locator("article")).toHaveCount(21);
  await page
    .getByRole("checkbox", { name: "Compare Ali Beaudoin", exact: true })
    .check();
  await page
    .getByRole("checkbox", { name: "Compare Angelita Morillo", exact: true })
    .check();
  await page.getByRole("button", { name: "Compare selected (2/3)" }).click();
  await expect(page.locator("article")).toHaveCount(2);
  await directory.getByRole("link", { name: /Darren McCormick/ }).click();
  await expect(page.locator("article")).toHaveCount(21);
  await expect(page).toHaveURL(/#darren-mccormick$/);
  await expect(page.locator("#darren-mccormick")).toBeInViewport();
  await expect(page.locator("#darren-mccormick")).toContainText(
    "limited policy statement",
  );
  await expect(page.locator("#heart-free-pham")).toContainText(
    "historical, self-reported positions",
  );
  for (const article of await page.locator("article").all()) {
    const img = article.locator("img");
    if (await img.count()) {
      await img.scrollIntoViewIfNeeded();
      await expect(img).toHaveJSProperty("complete", true);
      expect(
        await img.evaluate((el: HTMLImageElement) => el.naturalWidth),
      ).toBeGreaterThan(0);
      await expect(
        article.getByRole("link", { name: /^Photo:/ }),
      ).toHaveAttribute("href", /^https:\/\//);
    }
  }
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/voters-guide/portland-district-4");
  await expect(page.getByRole("checkbox")).toHaveCount(12);
  await expect(
    page.getByRole("group", { name: "Candidates to compare" }).locator("img"),
  ).toHaveCount(11);
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBe(true);
});
