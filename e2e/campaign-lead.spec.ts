import { test, expect } from '@playwright/test';

const cents = (text: string) => Math.round(Number(text.replace(/[^0-9.]/g, '')) * 100);

for (const width of [390, 1440]) {
  test(`campaign money page leads with raised and spent lines at ${width}px`, async ({ page }) => {
    test.setTimeout(90_000);
    await page.setViewportSize({ width, height: 900 });
    const response = await page.goto('/deep-dives/campaign-finance');
    expect(response?.status()).toBe(200);
    const charts = page.locator('article [data-chart]');
    // The first things a reader meets: raised over time, spent over time, then money in and out.
    expect(await charts.evaluateAll(nodes => nodes.slice(0, 3).map(node => node.getAttribute('data-chart')))).toEqual(['lead-raised', 'lead-paid', 'money-in-out']);

    for (const measure of ['raised', 'paid']) {
      const figure = page.locator(`[data-chart="lead-${measure}"]`);
      await expect(figure.locator('[data-panel]')).toHaveCount(2);
      // One line and one legend row per candidate with records, in both districts.
      const lines = await figure.locator('svg path[data-series]').count();
      expect(lines).toBeGreaterThanOrEqual(15);
      expect(await figure.locator('ol li[data-series]').count()).toBe(lines);
    }

    // Two separate queries must agree: the lines' final values add up to the money-in and money-out totals.
    const legendTotal = async (measure: string) => (await page.locator(`[data-chart="lead-${measure}"] ol li[data-series] strong`).allInnerTexts()).reduce((sum, text) => sum + cents(text), 0);
    const council = page.locator('[data-money-row="council"]');
    const [moneyIn, moneyOut] = (await council.locator('b').allInnerTexts()).slice(0, 2).map(cents);
    expect(Math.abs(await legendTotal('raised') - moneyIn)).toBeLessThanOrEqual(1700);
    expect(Math.abs(await legendTotal('paid') - moneyOut)).toBeLessThanOrEqual(1700);

    await expect(page.locator('[data-money-row="statewide"]')).toContainText('Paid to Oregon addresses');
    for (const row of ['council', 'statewide']) {
      const widths = await page.locator(`[data-money-row="${row}"] [role="img"] span`).evaluateAll(nodes => nodes.map(node => parseFloat((node as HTMLElement).style.width)));
      expect(Math.abs(widths.reduce((sum, value) => sum + value, 0) - 100)).toBeLessThan(0.01);
    }
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
  });
}
