import { expect, test } from "@playwright/test";

for (const district of [3, 4]) {
  test(`district ${district}: About has a readable mobile introduction, complete details and working exits`, async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto(`/voters-guide/portland-district-${district}#about-guide`);
    const about = page.locator("#about-guide");
    await expect(about).toBeVisible();
    await expect(page.locator("#race-about-title")).toBeFocused();
    await expect(about).toContainText("November 3, 2026");
    await expect(about).toContainText("3 seats");
    await expect(about.getByRole("navigation")).toBeVisible();
    await about.getByText("What this council can do", { exact: true }).click();
    await expect(about).toContainText("The mayor and city administrator run operations");
    await about.getByText("Terms explained in plain English", { exact: true }).click();
    await expect(about.locator("dt")).toHaveCount(7);
    await expect(about.getByText("Supplemental budget", { exact: true })).toBeVisible();
    await about.getByText("Sources, fairness and research limits", { exact: true }).click();
    await expect(about).toContainText("has not completed a separate human editorial review");
    await expect(about.getByRole("link", { name: "Read our editorial standards" })).toBeVisible();
    for (const width of [320, 390, 768, 1365]) {
      await page.setViewportSize({ width, height: 844 });
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    }
    await about.getByRole("link", { name: /Compare your choices/ }).click();
    await expect(page.locator("#compare")).toBeVisible();
    await page.goBack();
    await expect(about).toBeVisible();
    await about.getByRole("link", { name: /Check the council record/ }).click();
    await expect(page.locator("#disagreements")).toBeVisible();
    await page.goBack();
    await about.getByRole("link", { name: /Meet the candidates/ }).click();
    await expect(page.locator("#find-candidates")).toBeVisible();
  });
}
