import { test, expect } from "@playwright/test";
import { portfolio, stats, today, upcoming } from "../src/lib/ced/model";
test("portfolio loads, navigates and exposes current derived counts", async ({
  page,
}) => {
  const errors: string[] = [];
  page.on("pageerror", (e) => errors.push(e.message));
  await page.goto("/ced");
  await expect(page.locator(".ced h1")).toHaveText(
    "One portfolio.Connected decisions.",
  );
  await expect(page.locator(".ced-stat-strip")).toContainText("28");
  await page
    .getByRole("navigation", { name: "CED portfolio" })
    .getByRole("link", { name: "Initiatives", exact: true })
    .click();
  await expect(page.locator(".ced-initiative-card")).toHaveCount(28);
  expect(errors).toEqual([]);
});
test("initiative filters, search, empty state and shareable query work", async ({
  page,
}) => {
  await page.goto("/ced/initiatives");
  await page.getByLabel("Domains").selectOption("Housing");
  await expect(page.locator(".ced-initiative-card")).toHaveCount(5);
  await page.reload();
  await expect(page.getByLabel("Domains")).toHaveValue("Housing");
  await page.getByLabel("Search the portfolio").fill("middle-income");
  await page.getByRole("button", { name: "Search", exact: true }).click();
  await expect(page.locator(".ced-initiative-card")).toHaveCount(1);
  await expect(page.locator(".ced-initiative-card")).toContainText(
    "Middle-income",
  );
  await page.getByLabel("Search the portfolio").fill("no-matching-record-xyz");
  await page.getByRole("button", { name: "Search", exact: true }).click();
  await expect(page.locator(".ced-empty")).toContainText(
    "No initiatives match",
  );
  await page.getByRole("button", { name: "Clear filters" }).first().click();
  await expect(page.locator(".ced-initiative-card")).toHaveCount(28);
});
test("resolved decisions stay out of active queue and appear in history", async ({
  page,
}) => {
  await page.goto("/ced/decisions");
  await expect(page.locator(".ced-decision")).toHaveCount(41);
  await expect(page.locator("#psu-direction")).toHaveCount(0);
  await page.getByRole("link", { name: /Decision history/ }).click();
  await expect(page.locator(".ced-decision")).toHaveCount(7);
  await expect(page.locator("#psu-direction")).toContainText("Resolved");
  await expect(page.locator("#psu-direction a.ced-source")).toHaveAttribute(
    "href",
    /37752/,
  );
  await page.goto("/ced/decisions?status=Past+expected+date");
  await expect(page.locator(".ced-decision")).toHaveCount(stats(today()).past);
  await expect(page.locator("#broadway-4a-start")).toContainText("Summer 2026");
});
test("timeline retains precision and imprecise-date records", async ({
  page,
}) => {
  await page.goto("/ced/timeline");
  await expect(page.locator(".ced-timeline-event")).toHaveCount(
    upcoming(today()).length,
  );
  await page.getByRole("button", { name: "All dates", exact: true }).click();
  await expect(page).toHaveURL(/horizon=all/);
  await expect(page.locator(".ced-timeline")).toContainText("2029");
  await page.reload();
  await expect(
    page.getByRole("button", { name: "All dates", exact: true }),
  ).toHaveAttribute("aria-pressed", "true");
  await page.getByLabel("Domains").selectOption("Climate");
  await expect(page.locator(".ced-timeline-event")).toHaveCount(
    portfolio.decisions.filter(
      (d) =>
        d.state === "unresolved" &&
        d.expected.start &&
        portfolio.initiatives.find((i) => i.id === d.initiative)?.domain ===
          "Climate",
    ).length,
  );
  await expect(page).toHaveURL(/domain=Climate/);
  await page.getByLabel("Domains").selectOption("all");
  await page.locator(".ced-details summary").click();
  await expect(page.locator(".ced-compact-list")).toContainText(
    "Early winter 2026–2027",
  );
});
test("dependency selection reveals shared initiatives and source evidence", async ({
  page,
}) => {
  await page.goto("/ced/dependencies");
  await expect(page.locator(".ced-graph-root")).toContainText(
    "Broadway Corridor",
  );
  await page.locator(".ced-graph-node").filter({ hasText: "PBOT" }).click();
  await expect(page).toHaveURL(/dependency=PBOT/);
  await expect(page.locator(".ced-map-list button[aria-pressed]")).toHaveCount(
    4,
  );
  await page
    .locator(".ced-map-list button")
    .filter({ hasText: "OMSI District" })
    .click();
  await expect(page.locator(".ced-graph-root")).toContainText("OMSI");
  await expect(page.locator(".ced-map-detail")).toContainText("Water Avenue");
  await page.reload();
  await expect(page.locator(".ced-graph-root")).toContainText("OMSI");
});
test("money separates conditional contributions and avoids totals", async ({
  page,
}) => {
  await page.goto("/ced/money");
  await page
    .getByRole("button", { name: "Proposed / conditional", exact: true })
    .click();
  await expect(page.locator(".ced-funding")).toHaveCount(1);
  await expect(page.locator(".ced-funding")).toContainText("$120M");
  await expect(page.locator(".ced-funding")).toContainText("non-binding");
});
test("outcomes show causal limits and correct definition discrepancy", async ({
  page,
}) => {
  await page.goto("/ced/outcomes");
  await expect(page.locator(".ced-outcome-heading")).toContainText(
    "less than 30%",
  );
  await expect(page.locator(".ced-outcome-heading")).toContainText(
    "more than 30%",
  );
  await page.getByRole("button", { name: /Lower carbon emissions/ }).click();
  await expect(page.locator(".ced-outcome-links article")).toHaveCount(5);
});
test("all 28 dossiers and all product surfaces render without page errors", async ({
  page,
}) => {
  test.setTimeout(180000);
  const errors: string[] = [];
  page.on("pageerror", (e) => errors.push(e.message));
  for (const route of [
    "/ced/oversight",
    "/ced/changes",
    "/ced/methodology",
    "/ced/briefing",
    ...portfolio.initiatives.map((i) => `/ced/initiatives/${i.id}`),
  ]) {
    const response = await page.goto(route);
    expect(response?.status(), route).toBe(200);
    await expect(page.locator(".ced h1")).toBeVisible();
    await expect(page.locator("[data-nextjs-dialog]")).toHaveCount(0);
  }
  expect(errors).toEqual([]);
});
test("legacy URLs and initiative fragments reach current records", async ({
  page,
}) => {
  await page.goto("/decisions");
  await expect(page).toHaveURL(/\/ced\/decisions$/);
  await page.goto(
    "/dashboard/performance/dcas/ced#keller-psu-performing-arts-decision",
  );
  await expect(page).toHaveURL(
    /\/ced\/initiatives\/keller-psu-performing-arts-decision$/,
  );
  await expect(page.locator(".ced-initiative-head")).toContainText("Planning");
});
test("exports include evidence history and reject invalid formats", async ({
  request,
  page,
}) => {
  const json = await request.get("/ced/export?format=json");
  expect(json.status()).toBe(200);
  expect((await json.json()).initiatives).toHaveLength(28);
  const csv = await request.get("/ced/export?format=csv");
  expect(csv.headers()["content-disposition"]).toContain(".csv");
  expect(await csv.text()).toContain("Resolved");
  expect((await request.get("/ced/export?format=html")).status()).toBe(400);
  await page.goto("/ced/decisions");
  const download = page.waitForEvent("download");
  await page.getByRole("link", { name: "Download register" }).click();
  expect((await download).suggestedFilename()).toMatch(/\.csv$/);
});
test("Institutions and About connect to the product with a working contact destination", async ({
  page,
}) => {
  await page.goto("/institutions");
  await expect(
    page.getByRole("link", { name: "Explore the full public portfolio" }),
  ).toHaveAttribute("href", "/ced");
  await expect(page.getByText("Data infrastructure & tools")).toBeVisible();
  await page.goto("/about");
  const row = page.locator("li").filter({ hasText: "The CED Portfolio Map" });
  await expect(
    row.getByRole("link", { name: "Open", exact: true }),
  ).toHaveAttribute("href", "/ced");
  await row.getByRole("link", { name: "Work on this" }).click();
  await expect(page).toHaveURL(/project=The%20CED%20Portfolio%20Map/);
  await expect(page.locator("h1")).toBeVisible();
});
test("mobile views fit the viewport, and print retains briefing content", async ({
  page,
}, testInfo) => {
  await page.setViewportSize({ width: 390, height: 844 });
  for (const route of [
    "/ced",
    "/ced/initiatives",
    "/ced/decisions",
    "/ced/dependencies",
    "/ced/money",
    "/ced/outcomes",
    "/ced/initiatives/keller-psu-performing-arts-decision",
  ]) {
    await page.goto(route);
    await expect(page.locator(".ced h1")).toBeVisible();
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= window.innerWidth + 1,
      ),
      route,
    ).toBe(true);
  }
  await page.goto("/ced/briefing");
  await page.emulateMedia({ media: "print" });
  await expect(
    page.getByText("The work between strategy and outcomes", { exact: true }),
  ).toBeVisible();
  await expect(
    page.getByRole("button", { name: "Print / save PDF" }),
  ).toBeHidden();
  await page.pdf({
    path: testInfo.outputPath("briefing.pdf"),
    format: "A4",
    printBackground: true,
    margin: { top: "14mm", bottom: "14mm", left: "14mm", right: "14mm" },
  });
});
