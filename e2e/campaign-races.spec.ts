import { test, expect } from '@playwright/test';

const path = '/deep-dives/campaign-finance/races';
const races = ['portland-district-3', 'portland-district-4', 'portland-auditor', 'oregon-governor'];

for (const width of [390, 1440]) {
  test.describe(`Races index at ${width}px`, () => {
    test.use({ viewport: { width, height: 900 } });

    test('one section per race, with money for every matched committee', async ({ page }) => {
      test.setTimeout(90_000);
      const errors: string[] = [];
      page.on('pageerror', error => errors.push(error.message));
      expect((await page.goto(path))?.status()).toBe(200);
      await expect(page.getByRole('heading', { level: 1 })).toHaveText('Campaign money, race by race');

      const sections = page.locator('[data-race]');
      await expect(sections).toHaveCount(races.length);
      expect(await sections.evaluateAll(list => list.map(section => (section as HTMLElement).dataset.race))).toEqual(races);

      for (const id of races) {
        const section = page.locator(`[data-race="${id}"]`);
        await expect(section.locator('dd')).toHaveCount(2);
        await expect(section.locator('dd').first()).toHaveText(/^\$[\d,]+$/);
        const rows = section.locator('[data-candidate]');
        expect(await rows.count()).toBeGreaterThan(0);
        await expect(rows.first().locator('p')).toContainText('raised');
        // City matching is a Portland program; the governor's race never shows it.
        await expect(section.getByText('City matching funds')).toHaveCount(id === 'oregon-governor' ? 0 : 1);
      }
      await expect(page.locator('[data-race="oregon-governor"]')).not.toContainText('City match');

      // Every candidate is listed once, either with a bar or in the unmatched sentence.
      const d3 = page.locator('[data-race="portland-district-3"]');
      const listed = await d3.locator('[data-candidate]').count();
      const unmatched = Number(await d3.locator('[data-unmatched]').getAttribute('data-unmatched') ?? 0);
      await expect(d3.getByText(`${listed + unmatched} candidates`, { exact: false })).toBeVisible();

      expect(await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth)).toBeLessThanOrEqual(0);
      expect(errors).toEqual([]);
    });
  });
}
