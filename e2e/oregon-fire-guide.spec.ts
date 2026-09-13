import { test, expect } from "@playwright/test";
test("guide choices survive map navigation, reload, and back", async ({
  page,
}) => {
  const errors: string[] = [];
  page.on("pageerror", (e) => errors.push(e.message));
  await page.goto("/oregon-fire#understand");
  await expect(
    page.getByRole("navigation", { name: "Choose your way into the atlas" }),
  ).toBeAttached();
  const landscapes = page.getByRole("group", {
    name: "Oregon fire landscapes",
  });
  await landscapes.getByRole("button", { name: /Oak & prairie/ }).focus();
  await page.keyboard.press("Enter");
  await expect(page).toHaveURL(/landscape=oak/);
  await expect(
    page.getByRole("heading", {
      name: "Sometimes the goal is to keep a place open.",
    }),
  ).toBeVisible();
  await page
    .getByRole("button", { name: "Explore the Corvallis area", exact: true })
    .click();
  await expect(page).toHaveURL(/#explore$/);
  expect(new URL(page.url()).searchParams.get("kind")).toBe("all");
  await expect(
    page.getByRole("button", { name: "All records", exact: true }),
  ).toHaveAttribute("aria-pressed", "true");
  await page.reload();
  await expect(
    landscapes.getByRole("button", { name: /Oak & prairie/ }),
  ).toHaveAttribute("aria-pressed", "true");
  await page.goBack();
  await expect(
    landscapes.getByRole("button", { name: /Oak & prairie/ }),
  ).toHaveAttribute("aria-pressed", "true");
  expect(errors).toEqual([]);
});
test("place search handles matching, unavailable data, and shared selection", async ({
  page,
}) => {
  await page.route("**/api/oregon-fire/records?*", (r) =>
    r.fulfill({
      status: 503,
      json: { error: "Local records temporarily unavailable" },
    }),
  );
  await page.goto("/oregon-fire#find-place");
  await page.getByLabel("Find an Oregon city or community").fill("Corvallis");
  await page
    .getByRole("button", { name: "Corvallis City", exact: true })
    .click();
  await expect(
    page.getByRole("heading", { name: "Around Corvallis" }),
  ).toBeVisible();
  await expect(
    page.locator(".fire-place-summary").getByRole("alert"),
  ).toContainText("temporarily unavailable");
  await expect(page.locator(".fire-place-stats")).toHaveCount(0);
  await page.reload();
  await expect(
    page.getByRole("heading", { name: "Around Corvallis" }),
  ).toBeAttached();
  await page
    .getByLabel("Find an Oregon city or community")
    .fill("there-is-no-such-town");
  await expect(
    page.getByText("No matching place in the Census list.", { exact: false }),
  ).toBeVisible();
  await page
    .getByRole("button", { name: "Explore records around Corvallis" })
    .click();
  await expect(page).toHaveURL(/place=/);
  await expect(page).toHaveURL(/#explore$/);
});
test("Egley evidence, historical map, imagery, and planning are addressable", async ({
  page,
  request,
}) => {
  test.setTimeout(90000);
  const errors: string[] = [];
  page.on("pageerror", (e) => errors.push(e.message));
  await page.goto("/oregon-fire#fire-stories");
  await page
    .getByRole("group", { name: "Documented Oregon stories" })
    .getByRole("button", { name: /Egley/ })
    .click();
  await expect(page.getByRole("img", { name: /12.9 percent/ })).toBeVisible();
  await page
    .getByRole("group", { name: "Story timeline" })
    .getByRole("button", { name: "2016 · nine years" })
    .click();
  await expect(
    page.getByRole("heading", { name: "Recovery has several measures" }),
  ).toBeVisible();
  const figure = page.locator(".fire-study-figure img");
  await expect(figure).toBeVisible();
  await expect
    .poll(() => figure.evaluate((e: HTMLImageElement) => e.naturalWidth))
    .toBeGreaterThan(0);
  await page
    .getByRole("button", { name: "Explore 2007 perimeters near the study" })
    .click();
  await expect(page.getByLabel("Fire scars through year")).toHaveValue("2007");
  expect(
    (await request.get("/api/oregon-fire/landscape?end=2007&years=1")).status(),
  ).not.toBe(400);
  await page
    .getByRole("button", { name: "Five years later", exact: true })
    .click();
  const slider = page.getByRole("slider", {
    name: "Earlier satellite image reveal",
  });
  await slider.fill("75");
  await expect(slider).toHaveAttribute(
    "aria-valuetext",
    "75 percent earlier image",
  );
  const compare = page.locator(".fire-image-compare");
  const box = await compare.boundingBox();
  await compare.click({
    position: { x: box!.width * 0.25, y: box!.height * 0.5 },
  });
  await expect(slider).toHaveValue("25");
  await expect(
    page.getByRole("heading", {
      name: "A greener pixel is not a recovered forest.",
    }),
  ).toBeVisible();
  await page
    .getByRole("group", { name: "Explore the burn-planning year" })
    .getByRole("button", { name: /Spring/ })
    .click();
  await page
    .getByRole("group", { name: "What a burn needs" })
    .getByRole("button", { name: "Smoke", exact: true })
    .click();
  await expect(
    page.getByRole("heading", { name: "The people downwind matter." }),
  ).toBeVisible();
  await page
    .getByRole("group", { name: "Management objective" })
    .getByRole("button", { name: "Communities", exact: true })
    .click();
  await expect(
    page.getByRole("heading", {
      name: "Are people and essential places better protected?",
    }),
  ).toBeVisible();
  await page.reload();
  expect(new URL(page.url()).searchParams.get("story")).toBe("egley");
  await expect(
    page.getByRole("button", { name: "Five years later", exact: true }),
  ).toHaveAttribute("aria-pressed", "true");
  await expect(
    page
      .getByRole("group", { name: "What a burn needs" })
      .getByRole("button", { name: "Smoke", exact: true }),
  ).toHaveAttribute("aria-pressed", "true");
  expect(errors).toEqual([]);
});
test("mobile chapters, sources, images, and touch-sized controls fit", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto(
    "/oregon-fire?story=egley&stage=2&landscape=sage#fire-stories",
  );
  await expect(
    page.getByRole("heading", { name: "The same fire. Different histories." }),
  ).toBeAttached();
  for (const id of [
    "understand",
    "find-place",
    "fire-stories",
    "through-time",
    "burn-windows",
    "what-success-means",
  ]) {
    await page.locator(`#${id}`).scrollIntoViewIfNeeded();
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
    ).toBeTruthy();
  }
  const hrefs = await page
    .locator(".fire-chapter-nav a")
    .evaluateAll((es) => es.map((e) => e.getAttribute("href")!));
  for (const h of hrefs) await expect(page.locator(h)).toBeAttached();
  await page.locator("#through-time").scrollIntoViewIfNeeded();
  await page.screenshot({
    path: "test-results/fire-guide-comparison-mobile.png",
  });
  await page.locator("#fire-stories").scrollIntoViewIfNeeded();
  await page.screenshot({ path: "test-results/fire-guide-story-mobile.png" });
});
test("place summary distinguishes unavailable inventories from valid empty results", async ({
  page,
}) => {
  let available = false;
  await page.route("**/api/oregon-fire/records?*", (r) =>
    r.fulfill({
      json: {
        dataStatus: available ? "available" : "unavailable",
        records: [],
        total: 0,
        nextCursor: null,
        map: [],
        aggregated: true,
        sourceCounts: [],
        filters: {
          agencies: ["GLOBAL LABEL"],
          purposes: ["GLOBAL PURPOSE"],
          methods: [],
          statuses: [],
        },
      },
    }),
  );
  await page.goto("/oregon-fire?place=4105800#find-place");
  await expect(
    page.locator(".fire-place-summary").getByRole("alert"),
  ).toContainText("not available");
  await expect(page.locator(".fire-place-stats")).toHaveCount(0);
  available = true;
  await page.reload();
  await expect(page.locator(".fire-place-stats")).toContainText("0");
  await expect(page.locator(".fire-place-summary")).toContainText(
    "No imported records match",
  );
  await expect(page.locator(".fire-place-summary")).not.toContainText(
    "GLOBAL LABEL",
  );
});
