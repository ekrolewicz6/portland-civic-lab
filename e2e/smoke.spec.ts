import { test, expect } from "@playwright/test";

test("home page renders with hero and project cards", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { level: 1 })).toContainText(
    "Portland, decoded"
  );
  await expect(page.getByText("Portland Parks Atlas")).toBeVisible();
});

test("dashboard hub lists topics", async ({ page }) => {
  await page.goto("/dashboard");
  await expect(page.getByRole("heading", { level: 1 })).toContainText(
    "Portland"
  );
  // Topic cards link into individual dashboards
  await expect(page.locator('a[href*="/dashboard/housing"]').first()).toBeVisible();
});

test("housing topic page renders hero and source citation", async ({ page }) => {
  await page.goto("/dashboard/housing");
  await expect(page.getByRole("heading", { level: 1 })).toContainText(
    "Are We Building Enough?"
  );
  await expect(page.getByText("Data Source")).toBeVisible();
});

test("methodology page renders source tables", async ({ page }) => {
  await page.goto("/methodology");
  await expect(page.getByRole("heading", { level: 1 })).toContainText(
    "Methodology"
  );
  await expect(page.getByText("Our Principles")).toBeVisible();
});

test("contact page renders the form", async ({ page }) => {
  await page.goto("/contact");
  await expect(page.getByRole("button", { name: /send message/i })).toBeVisible();
});

test("proposals page renders the board", async ({ page }) => {
  await page.goto("/proposals");
  await expect(page.getByRole("heading", { level: 1 })).toContainText(
    "What should Portland Civic Lab track next?"
  );
});

test("records page renders the guide", async ({ page }) => {
  await page.goto("/records");
  await expect(page.getByRole("heading", { level: 1 })).toContainText(
    "The records belong to you"
  );
});

test("org chart page renders the tree", async ({ page }) => {
  await page.goto("/org-chart");
  await expect(page.getByRole("heading", { level: 1 })).toContainText(
    "The Portland org chart"
  );
  await expect(
    page.getByText("Office of the City Administrator").first()
  ).toBeVisible();
});

test("org chart node selection shows leader detail", async ({ page }) => {
  await page.goto("/org-chart");
  await page
    .getByRole("button", { name: /Portland Police Bureau/ })
    .first()
    .click();
  await expect(page.getByText("Chief of Police")).toBeVisible();
});

test("org API returns the full structure", async ({ request }) => {
  const response = await request.get("/api/org");
  expect(response.status()).toBe(200);
  const data = await response.json();
  expect(data.stats.totalUnits).toBeGreaterThan(50);
  expect(data.tree.children.length).toBe(2);
});

test("login is a redirect, never a page with a password field", async ({
  request,
}) => {
  const response = await request.get("/login", { maxRedirects: 0 });
  expect([302, 307, 308]).toContain(response.status());
});

test("data flags API validates input", async ({ request }) => {
  const response = await request.post("/api/data-flags", {
    data: { question: "housing", message: "short" },
  });
  expect(response.status()).toBe(400);
});

test("proposals API requires membership to post", async ({ request }) => {
  const response = await request.post("/api/proposals", {
    data: {
      title: "Smoke test proposal",
      description: "This should be rejected because the request is anonymous.",
    },
  });
  expect(response.status()).toBe(401);
});
