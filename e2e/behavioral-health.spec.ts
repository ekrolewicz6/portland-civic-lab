import { test, expect } from "@playwright/test";

for (const viewport of [{ width: 1440, height: 1000 }, { width: 390, height: 844 }]) {
  test.describe(`Council evidence at ${viewport.width}px`, () => {
    test.use({ viewport });
    test.beforeEach(async ({ page }) => {
      // Keep existing site analytics out of local interaction checks.
      await page.route(/https:\/\/(www\.)?(googletagmanager|google-analytics)\.com\//, (route) => route.abort());
    });

    test("read qualifications, follow sources and move between deep dives", async ({ page, request }) => {
      const errors: string[] = [];
      page.on("pageerror", (error) => errors.push(error.message));
      await page.goto("/deep-dives/homelessness#behavioral-health");
      const evidence = page.locator("#behavioral-health");
      await expect(evidence.getByRole("heading", { name: /clinical-capacity plan/ })).toBeVisible();
      await expect(evidence.getByText(/A recorded diagnosis is not a current clinical assessment/)).toBeVisible();
      const disclosure = evidence.locator("summary").filter({ hasText: "Conflicting estimates" });
      await disclosure.focus();
      await page.keyboard.press("Enter");
      await expect(evidence.getByText(/3.5× greater likelihood/)).toBeVisible();
      await expect(evidence.getByText(/9% versus 5%/)).toBeVisible();
      await expect(evidence.getByText(/Unknown follow-up must remain separate/).first()).toBeVisible();
      await expect(page.getByText(/Funding shares and captured savings are different/)).toBeAttached();
      await expect(page.getByText(/kept by the CCO|58¢ of every avoided/)).toHaveCount(0);
      await evidence.getByRole("link", { name: /Compare psychiatric care/ }).click();
      await expect(page).toHaveURL(/continuum#clinical$/);
      await expect(page.locator("#clinical").getByRole("heading", { name: "Psychiatric respite", exact: true })).toBeVisible();
      for (const file of ["council-memo.pdf", "council-presentation.pdf"]) {
        const response = await request.get(`/reports/behavioral-health-2026-09-09/${file}`);
        expect(response.ok()).toBeTruthy();
        expect(response.headers()["content-type"]).toContain("application/pdf");
      }
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBeTruthy();
      expect(errors).toEqual([]);
    });

    test("keyboard journey and records requests preserve care and housing distinctions", async ({ page, context }) => {
      await context.grantPermissions(["clipboard-read", "clipboard-write"]);
      const mutations: string[] = [];
      page.on("request", (request) => { if (["POST", "PUT", "PATCH", "DELETE"].includes(request.method())) mutations.push(request.url()); });
      await page.goto("/deep-dives/continuum#pathways");
      const choice = page.getByRole("button", { name: "Leaving psychiatric inpatient care" });
      await choice.focus();
      await page.keyboard.press("Enter");
      await expect(choice).toHaveAttribute("aria-pressed", "true");
      await expect(page.getByRole("heading", { name: "Receiving care unavailable" })).toBeVisible();
      await page.getByRole("button", { name: "A better handoff" }).click();
      await expect(page.getByRole("heading", { name: "Arrive with continuing care" })).toBeVisible();
      await expect(page.getByText(/Completing treatment is not a general condition/)).toBeVisible();
      for (const label of ["BH cohort evidence", "Regional care model", "Psychiatric capacity", "Clinical operating finance", "Council follow-through"]) {
        const button = page.getByRole("button", { name: label, exact: true });
        await button.focus();
        await page.keyboard.press("Space");
        await expect(button).toHaveAttribute("aria-pressed", "true");
        await page.getByRole("button", { name: "Copy this request" }).click();
        await expect(page.getByRole("status").filter({ hasText: "request copied" })).toContainText("It has not been sent");
        const copied = await page.evaluate(() => navigator.clipboard.readText());
        expect(copied).toContain("Do not provide individual client or staff records");
        expect(copied).toContain("September 9, 2026");
      }
      expect(mutations).toEqual([]);
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBeTruthy();
      const broken = await page.locator('a[href^="#"]').evaluateAll((links) => links.map((link) => link.getAttribute("href")!).filter((href) => href.length > 1 && !document.getElementById(decodeURIComponent(href.slice(1)))));
      expect(broken).toEqual([]);
    });
  });
}
