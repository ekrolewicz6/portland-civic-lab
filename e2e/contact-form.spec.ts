import { test, expect } from "@playwright/test";

for (const width of [390, 1440]) {
  test.describe(`Contact form at ${width}px`, () => {
    test.use({ viewport: { width, height: 900 } });
    test("recovers from a network failure without losing the message", async ({ page }) => {
      let fail = true;
      await page.route("**/api/contact", (route) => fail
        ? route.abort("failed")
        : route.fulfill({ json: { ok: true, delivery: "resend" } }));
      await page.goto("/contact?topic=Volunteering&project=Oregon%20Fire");
      await expect(page.locator('select[name="topic"]')).toHaveValue("Volunteering");
      await expect(page.locator('textarea[name="message"]')).toContainText("Oregon Fire");
      await page.getByRole("textbox", { name: "Name", exact: true }).fill("Test sender");
      await page.getByRole("textbox", { name: "Reply email" }).fill("sender@example.com");
      await page.getByRole("button", { name: "Send message" }).click();
      await expect(page.getByText("Connection interrupted. Please try again.")).toBeVisible();
      await expect(page.getByRole("button", { name: "Send message" })).toBeEnabled();
      await expect(page.locator('textarea[name="message"]')).toContainText("Oregon Fire");
      fail = false;
      await page.getByRole("button", { name: "Send message" }).click();
      await expect(page.getByText(/Your message is on its way/)).toBeVisible();
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    });
    test("acknowledges durable receipt when notification is queued", async ({ page }) => {
      await page.route("**/api/contact", route => route.fulfill({ json: { ok: true, delivery: "queued" } }));
      await page.goto("/contact");
      await page.locator('input[name="name"]').fill("Test sender");
      await page.locator('input[name="email"]').fill("sender@example.com");
      await page.locator('textarea[name="message"]').fill("A message for the Lab that should be saved.");
      await page.getByRole("button", { name: "Send message" }).click();
      await expect(page.getByText(/Your message has been received/)).toBeVisible();
      await expect(page.getByText(/Your message is on its way/)).toHaveCount(0);
    });
  });
}
