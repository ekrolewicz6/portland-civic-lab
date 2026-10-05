import { test, expect } from '@playwright/test';

const base = '/deep-dives/campaign-finance';
const pages = [
  { path: '', active: 'Overview' },
  { path: '/explorer', active: 'Explore records' },
  { path: '/races', active: 'Compare races' },
  { path: '/races/portland-district-3', active: 'Compare races', nested: true },
  { path: '/entities/committee:23208', active: 'Explore records', nested: true },
  { path: '/suppliers', active: 'Who gets paid' },
  { path: '/governor', active: 'Governor' },
  { path: '/statewide', active: 'Statewide' },
  { path: '/questions', active: 'Research questions', reference: true },
  { path: '/methodology', active: 'Methods & gaps', reference: true },
  { path: '/evidence', active: 'Evidence downloads', reference: true },
  { path: '/api-reference', active: 'ORESTAR reference', reference: true },
];

for (const width of [390, 1440]) {
  test.describe(`Campaign finance navigation at ${width}px`, () => {
    test.use({ viewport: { width, height: 900 } });
    for (const route of pages) {
      test(`shared menu on ${route.path || '/overview'}`, async ({ page }) => {
        test.setTimeout(60_000);
        const errors: string[] = [];
        page.on('pageerror', error => errors.push(error.message));
        const response = await page.goto(`${base}${route.path}`);
        expect(response?.status()).toBe(200);
        const nav = page.getByRole('navigation', { name: 'Campaign finance', exact: true });
        await expect(nav).toHaveCount(1);
        await expect(nav.getByRole('link', { name: 'Explore records', exact: true })).toBeVisible();
        await expect(nav.getByRole('link', { name: 'Explore records', exact: true })).toHaveAttribute('href', `${base}/explorer`);
        for (const label of ['Overview', 'Compare races', 'Who gets paid', 'Governor', 'Statewide']) {
          await expect(nav.getByRole('link', { name: label, exact: true })).toBeVisible();
        }
        await expect(page.getByRole('navigation', { name: 'Campaign finance research', exact: true })).toHaveCount(0);
        const summary = nav.locator('summary');
        await summary.click();
        await expect(nav.getByRole('link', { name: 'Research questions', exact: false })).toBeVisible();
        await expect(nav.getByRole('link', { name: 'ORESTAR reference', exact: false })).toBeVisible();
        const current = nav.locator('[aria-current]');
        await expect(current).toHaveCount(1);
        await expect(current).toContainText(route.active);
        await expect(current).toHaveAttribute('aria-current', route.nested ? 'location' : 'page');
        if (route.reference) await expect(summary).toHaveAttribute('data-active', 'true');
        const bounds = await nav.boundingBox();
        expect(bounds).not.toBeNull();
        expect(bounds!.x).toBeGreaterThanOrEqual(0);
        expect(bounds!.x + bounds!.width).toBeLessThanOrEqual(width);
        expect(await nav.evaluate(element => element.scrollWidth <= element.clientWidth)).toBe(true);
        await summary.press('Escape');
        await expect(nav.locator('details')).not.toHaveAttribute('open');
        await expect(summary).toBeFocused();
        expect(errors).toEqual([]);
      });
    }
  });
}

test('menu follows client-side navigation and browser history', async ({ page }) => {
  await page.goto(base);
  const nav = page.getByRole('navigation', { name: 'Campaign finance', exact: true });
  const summary = nav.locator('summary');
  await summary.focus();
  await summary.press('Enter');
  await nav.getByRole('link', { name: /^Methods & gaps/ }).click();
  await expect(page).toHaveURL(`${base}/methodology`);
  await expect(nav.locator('details')).not.toHaveAttribute('open');
  await expect(summary).toHaveAttribute('data-active', 'true');
  await nav.getByRole('link', { name: 'Explore records', exact: true }).click();
  await expect(page).toHaveURL(`${base}/explorer`);
  await expect(nav.getByRole('link', { name: 'Explore records', exact: true })).toHaveAttribute('aria-current', 'page');
  await page.goBack();
  await expect(summary).toHaveAttribute('data-active', 'true');
});

for (const width of [320, 768]) {
  test(`expanded menu fits at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.goto(base);
    const nav = page.getByRole('navigation', { name: 'Campaign finance', exact: true });
    await nav.locator('summary').click();
    for (const link of await nav.getByRole('link').all()) {
      const box = await link.boundingBox();
      expect(box).not.toBeNull();
      expect(box!.x).toBeGreaterThanOrEqual(0);
      expect(box!.x + box!.width).toBeLessThanOrEqual(width);
    }
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  });
}
