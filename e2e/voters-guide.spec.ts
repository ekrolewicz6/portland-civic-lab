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

test("comparison starts neutral, supports direct selection and prevents duplicates", async ({
  page,
}) => {
  await page.goto("/voters-guide/portland-district-3");
  const first = page.getByRole("combobox", {
    name: "Candidate 1",
    exact: true,
  });
  const second = page.getByRole("combobox", {
    name: "Candidate 2",
    exact: true,
  });
  await expect(first).toHaveValue("");
  await expect(second).toHaveValue("");
  await expect(page.locator("input:checked")).toHaveCount(0);
  await first.selectOption("steve-novick");
  await second.selectOption("tiffany-koyama-lane");
  await expect(second.locator('option[value="steve-novick"]')).toHaveJSProperty("disabled", true);
  await expect(
    page.getByRole("region", { name: "Steve Novick comparison" }),
  ).toContainText("Targeted enforcement");
  await page.getByRole("button", { name: "+ Add a third candidate" }).click();
  await page
    .getByRole("combobox", { name: "Candidate 3", exact: true })
    .selectOption("angelita-morillo");
  await expect(
    page.getByRole("checkbox", { name: "Compare Ali Beaudoin", exact: true }),
  ).toBeDisabled();
  await page.getByRole("button", { name: "Housing", exact: true }).click();
  await expect(
    page.getByRole("region", { name: "Steve Novick comparison" }),
  ).toContainText("faster permitting");
  await expect(
    page.getByRole("region", { name: "Tiffany Koyama Lane comparison" }),
  ).toContainText("publicly owned housing");
  await expect(page.locator("article")).toHaveCount(21);
  await page
    .getByRole("button", { name: "Clear comparison", exact: true })
    .click();
  await expect(first).toHaveValue("");
  await expect(page.locator("input:checked")).toHaveCount(0);
});

test("record comparison preserves absent votes, agreement and legislative limits", async ({
  page,
}) => {
  await page.goto("/voters-guide/portland-district-4");
  await page
    .getByRole("combobox", { name: "Candidate 1", exact: true })
    .selectOption("eric-zimmerman");
  await page
    .getByRole("combobox", { name: "Candidate 2", exact: true })
    .selectOption("olivia-clark");
  await page.getByRole("button", { name: "Recorded decisions" }).click();
  const rental = page
    .locator("section")
    .filter({
      has: page.getByRole("heading", {
        name: "Restrict algorithmic rent coordination",
        exact: true,
      }),
    })
    .last();
  await expect(rental).toContainText("Absent");
  await expect(rental).toContainText("No");
  await expect(rental).toContainText("Absence is not a vote against");
  const dataCenters = page
    .locator("section")
    .filter({
      has: page.getByRole("heading", {
        name: "Seek transparency and future data-center restrictions",
      }),
    })
    .last();
  await expect(dataCenters.locator('strong[data-vote="Yes"]')).toHaveCount(2);
  await expect(dataCenters).toContainText("did not itself enact a moratorium");
  await page
    .getByRole("combobox", { name: "Candidate 1", exact: true })
    .selectOption("john-j-goldsmith");
  await expect(rental).toContainText("No vote in this record");
  await page.getByRole("button", { name: "Housing", exact: true }).click();
  await expect(
    page.getByRole("region", { name: "John J Goldsmith comparison" }),
  ).toContainText("Evidence gap");
  await expect(
    page.getByRole("region", { name: "John J Goldsmith comparison" }),
  ).toContainText("not evidence of neutrality");
});

test("sources are attributed and printing opens then restores disclosure state", async ({
  page,
}) => {
  await page.goto("/voters-guide/portland-district-4");
  await expect(page.locator("details[open]")).toHaveCount(0);
  await page
    .locator("article details summary")
    .filter({ hasText: "Sources behind this profile" })
    .first()
    .click();
  await expect(page.locator("details[open]")).toHaveCount(1);
  await expect(page.locator("details[open]")).toContainText(
    "Candidate statement",
  );
  await page.evaluate(() => {
    window.print = () => {};
  });
  await page.getByRole("button", { name: "Print this race" }).click();
  expect(await page.locator("details[open]").count()).toBe(
    await page.locator("details").count(),
  );
  await page.evaluate(() => window.dispatchEvent(new Event("afterprint")));
  await expect(page.locator("details[open]")).toHaveCount(1);
  await page.emulateMedia({ media: "print" });
  await expect(
    page.getByText(/candidates · Reviewed September 18, 2026/),
  ).toBeVisible();
});

test("mobile comparisons fit the screen and show matched issue cards", async ({
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
  await page.getByRole("link", { name: "See comparison ↑" }).click();
  await page.getByRole("button", { name: "Taxes & spending" }).click();
  const cards = page.getByRole("region", { name: /comparison$/ });
  await expect(cards).toHaveCount(2);
  for (const card of await cards.all()) {
    const box = await card.boundingBox();
    expect(box!.x).toBeGreaterThanOrEqual(0);
    expect(box!.x + box!.width).toBeLessThanOrEqual(390);
  }
  await expect(page.getByRole("table")).toHaveCount(0);
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
  expect(payload.councilDecisions).toHaveLength(4);
  for (const race of payload.races)
    for (const candidate of race.candidates) {
      expect(candidate.analysis.tradeoff.length).toBeGreaterThan(30);
      for (const issue of Object.values(candidate.analysis.issues) as {
        source: { url: string };
      }[])
        expect(issue.source.url).toMatch(/^https:/);
    }
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
  await page.getByRole("link", { name: "See comparison ↑" }).click();
  await expect(page.getByRole("region", { name: /comparison$/ })).toHaveCount(
    2,
  );
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
