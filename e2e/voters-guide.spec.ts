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
  await expect(second.locator('option[value="steve-novick"]')).toHaveJSProperty(
    "disabled",
    true,
  );
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
  await page
    .getByRole("combobox", { name: "Recorded decisions issue" })
    .selectOption("rental-pricing");
  const rental = page
    .locator("#compare")
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
  await page
    .getByRole("combobox", { name: "Recorded decisions issue" })
    .selectOption("privacy");
  const dataCenters = page
    .locator("#compare")
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
  await page
    .getByRole("combobox", { name: "Recorded decisions issue" })
    .selectOption("rental-pricing");
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
  const cards = page
    .locator("#compare")
    .getByRole("region", { name: /comparison$/ });
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
  expect(payload.councilDecisions).toHaveLength(73);
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
  await expect(
    page.locator("#compare").getByRole("region", { name: /comparison$/ }),
  ).toHaveCount(2);
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

test("disagreements explain both budget votes before any selection", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/voters-guide/portland-district-3");
  const overview = page.getByRole("region", { name: "Where they disagree." });
  await expect(overview).toBeVisible();
  await expect(page.locator("input:checked")).toHaveCount(0);
  const budget = overview.locator("#disagreement-supplemental-budget");
  await expect(budget).toContainText(
    "Broad service restoration; rejected July’s fallback",
  );
  await expect(budget).toContainText(
    "Broad restorations, with oversight funds protected",
  );
  await expect(budget).toContainText(
    "Different funding routes for selected services",
  );
  await expect(
    budget.getByRole("link", { name: /Tiffany Koyama Lane/ }),
  ).toBeVisible();
  await overview
    .getByRole("combobox", { name: "Choose a Council issue" })
    .selectOption("moda");
  await expect(budget).not.toBeVisible();
  const moda = overview.locator("#disagreement-moda");
  await expect(moda).toContainText("Raised the rent, then approved");
  await moda
    .getByText("Read the decisions and reasons", { exact: true })
    .click();
  await expect(
    moda.getByRole("heading", { name: "Her earlier stated concern · July 13" }),
  ).toBeVisible();
  await expect(moda).toContainText("Why she said no");
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBe(true);
  await page.emulateMedia({ media: "print" });
  await expect(budget).toBeVisible();
  await expect(overview.locator("#disagreement-rental-pricing")).toBeVisible();
});

test("individual record and export preserve reasons and amendment disagreements", async ({
  page,
  request,
}) => {
  await page.goto("/voters-guide/portland-district-4");
  const overview = page.getByRole("region", { name: "Where they disagree." });
  await overview
    .getByRole("combobox", { name: "Choose a Council issue" })
    .selectOption("moda");
  await expect(overview).toContainText("Rejected the public cost");
  await expect(
    overview.getByRole("heading", {
      name: "Approved; opposed the rent increase",
    }),
  ).toHaveCount(2);
  await expect(overview).toContainText("His earlier stated case · April 30");
  const green = page.locator("article#mitch-green");
  await expect(green).toContainText("Why he said no");
  await expect(green).toContainText("$275 million");
  await expect(green).not.toContainText("a no vote does not prove opposition");
  const payload = await (await request.get("/voters-guide/evidence")).json();
  expect(payload.decisionAccounts.moda["Steve Novick"].reason.source.kind).toBe(
    "Reporting",
  );
  expect(
    payload.decisionAccounts.moda["Eric Zimmerman"].reason.source.date,
  ).toBe("April 30, 2026");
  expect(
    payload.decisionAccounts["supplemental-budget"]["Tiffany Koyama Lane"]
      .choice,
  ).toBe("Larger plan only");
  expect(payload.councilDisagreements).toHaveLength(29);
});

test("broader history preserves changing coalitions, amendment votes and pending Zenith status", async ({
  page,
  request,
}) => {
  const payload = await (await request.get("/voters-guide/evidence")).json();
  const decision = (id: string) =>
    payload.councilDecisions.find((d: { id: string }) => d.id === id);
  expect(decision("parks-police").votes["Steve Novick"]).toBe("Yes");
  expect(decision("services-first").votes["Steve Novick"]).toBe("No");
  expect(decision("novick-restorations").votes["Steve Novick"]).toBe("Yes");
  expect(decision("novick-restorations").votes["Olivia Clark"]).toBe("No");
  expect(decision("oversight-funding").summary).toContain("5–6");
  expect(decision("novick-restorations").summary).toContain("3–8");
  expect(decision("camp-removal").votes["Olivia Clark"]).toBe("Absent");
  expect(decision("camp-removal").votes["Eric Zimmerman"]).toBe("Absent");
  expect(decision("performing-arts").votes["Mitch Green"]).toBe("Yes");
  expect(decision("moda").votes["Mitch Green"]).toBe("No");
  expect(decision("zenith-investigation").votes["Olivia Clark"]).toBe("Yes");
  expect(decision("zenith-enforcement").votes["Olivia Clark"]).toBe("No");
  expect(decision("zenith-transfer").summary).toContain("reconsider");
  const ids = payload.councilDisagreements.flatMap(
    (t: { decisionIds: string[] }) => t.decisionIds,
  );
  expect(new Set(ids).size).toBe(73);
  for (const district of [3, 4]) {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto(`/voters-guide/portland-district-${district}`);
    const overview = page.locator("#disagreements");
    await overview.getByRole("button", { name: /Zenith & climate/ }).click();
    const zenith = page.locator("#disagreement-zenith");
    await expect(zenith).toBeVisible();
    await zenith
      .getByText("Read the decisions and reasons", { exact: true })
      .click();
    await expect(zenith).toContainText("no basis to revoke");
    await expect(zenith).toContainText("September 23");
    await expect(
      zenith.getByText("Amendment vote", { exact: true }),
    ).toHaveCount(3);
    await expect(
      zenith.getByText("September 16 vote", { exact: true }),
    ).toHaveCount(3);
    for (const button of await overview.getByRole("button").all()) {
      await button.click();
      expect(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= innerWidth,
        ),
      ).toBe(true);
    }
  }
});

test("coverage audit reaches every indexed subject and distinguishes water votes", async ({
  request,
}) => {
  const payload = await (await request.get("/voters-guide/evidence")).json();
  expect(payload.councilCoverageAudit.dossiers).toHaveLength(24);
  const topics = new Map(
    payload.councilDisagreements.map(
      (t: { id: string; decisionIds: string[] }) => [t.id, t.decisionIds],
    ),
  );
  for (const item of payload.councilCoverageAudit.dossiers)
    expect(topics.has(item.issueId)).toBe(true);
  const decision = (id: string) =>
    payload.councilDecisions.find((d: { id: string }) => d.id === id);
  expect(decision("water-bonds").votes["Mitch Green"]).toBe("No");
  expect(decision("water-rates").votes["Mitch Green"]).toBe("Yes");
  expect(decision("water-bonds").votes["Tiffany Koyama Lane"]).toBe("Yes");
  expect(decision("water-rates").votes["Tiffany Koyama Lane"]).toBe("No");
  expect(decision("sewer-rates").votes["Angelita Morillo"]).toBe("Yes");
  expect(decision("board-eligibility").votes["Steve Novick"]).toBe("Yes");
  expect(decision("board-eligibility").votes["Angelita Morillo"]).toBe("No");
  expect(decision("board-removal").votes["Steve Novick"]).toBe("Yes");
  expect(decision("board-removal").votes["Angelita Morillo"]).toBe("Yes");
});

test("mobile issue navigation shows context, committee limits and direct links", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/voters-guide/portland-district-4#disagreement-water");
  const overview = page.locator("#disagreements");
  const picker = overview.getByRole("combobox", {
    name: "Choose a Council issue",
  });
  await expect(picker).toHaveValue("water");
  await expect(page.locator("#disagreement-water")).toBeVisible();
  await expect(page.locator("#water-question")).toBeInViewport();
  await expect(
    page
      .locator("#disagreement-water")
      .getByText(/Portland is building a filtration system/),
  ).toBeVisible();
  await picker.selectOption("firearms");
  await expect(page).toHaveURL(/#disagreement-firearms$/);
  const firearms = page.locator("#disagreement-firearms");
  await expect(firearms).toContainText("Not a member of this committee");
  await expect(
    firearms.getByRole("heading", {
      name: "Voted to put the proposal on hold",
    }),
  ).toBeVisible();
  await firearms
    .getByText("Read the decisions and reasons", { exact: true })
    .click();
  await expect(
    firearms.locator('strong[data-vote="Not on committee"]'),
  ).toHaveCount(2);
  await expect(firearms.locator('strong[data-vote="Absent"]')).toHaveCount(0);
  await picker.selectOption("psychedelics");
  await expect(page.locator("#disagreement-psychedelics")).toContainText(
    "pending proposal",
  );
  for (const option of await picker.locator("option").all()) {
    await picker.selectOption((await option.getAttribute("value"))!);
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
    ).toBe(true);
    await expect(overview.locator('section[data-active="true"]')).toHaveCount(
      1,
    );
  }
  const green = page.locator("article#mitch-green");
  await green
    .getByRole("combobox", { name: "Record issue for Mitch Green" })
    .selectOption("water");
  const visibleRecords = green.locator('details[data-active="true"]');
  await expect(visibleRecords).toHaveCount(3);
  await visibleRecords.first().locator("summary").click();
  await expect(visibleRecords.first()).toContainText("$525 million");
});
