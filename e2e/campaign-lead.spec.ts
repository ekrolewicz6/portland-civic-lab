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

    // Both charts open on the same month, once money starts to move, and say so.
    const starts = await page.locator('[data-chart^="lead-"]').evaluateAll(nodes => nodes.map(node => node.getAttribute('data-start')));
    expect(starts).toHaveLength(2);
    expect(starts[0]).toBe(starts[1]);
    expect(starts[0]! > '2025-01-01' && starts[0]! < '2026-07-01').toBe(true);
    for (const measure of ['raised', 'paid']) await expect(page.locator(`[data-chart="lead-${measure}"] figcaption`)).toContainText(/The chart starts in \w+ 20\d\d\. The \$[\d,]+ (raised|paid out) before then/);

    // Two separate queries must agree: the lines' final values add up to the money-in and money-out totals.
    const legendTotal = async (measure: string) => (await page.locator(`[data-chart="lead-${measure}"] ol li[data-series] strong`).allInnerTexts()).reduce((sum, text) => sum + cents(text), 0);
    const council = page.locator('[data-money-row="council"]');
    const [moneyIn, moneyOut] = (await council.locator('b').allInnerTexts()).slice(0, 2).map(cents);
    expect(Math.abs(await legendTotal('raised') - moneyIn)).toBeLessThanOrEqual(1700);
    expect(Math.abs(await legendTotal('paid') - moneyOut)).toBeLessThanOrEqual(1700);

    await expect(page.locator('[data-money-row="statewide"]')).toContainText('Paid to Oregon addresses');
    await expect(page.locator('[data-money-row="governor"]').getByRole('link', { name: /governor’s race/ })).toHaveAttribute('href', '/deep-dives/campaign-finance/governor');
    for (const row of ['council', 'governor', 'statewide']) {
      const widths = await page.locator(`[data-money-row="${row}"] [role="img"] span`).evaluateAll(nodes => nodes.map(node => parseFloat((node as HTMLElement).style.width)));
      expect(Math.abs(widths.reduce((sum, value) => sum + value, 0) - 100)).toBeLessThan(0.01);
    }
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
  });
}

const reading = /\$[\d,]+ raised by \w{3} \d{1,2}, 20\d\d/;

test('a line names itself to a mouse, to the legend and to the arrow keys', async ({ page }) => {
  test.setTimeout(90_000);
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto('/deep-dives/campaign-finance');
  for (const district of ['district-3', 'district-4']) {
    const panel = page.locator(`[data-chart="lead-raised"] [data-panel="${district}"]`);
    const plot = panel.locator('[data-plot]');
    const tip = panel.locator('[data-tip]');
    const rows = panel.locator('ol li[data-series]');
    const names = await rows.locator('a').allInnerTexts();
    await plot.scrollIntoViewIfNeeded();
    await expect(tip).toHaveCount(0);

    // Arrow keys: down steps through campaigns in legend order, left moves back in time, Escape lets go.
    await plot.focus();
    await page.keyboard.press('ArrowDown');
    await expect(tip).toContainText(names[0]);
    await expect(tip).toContainText(reading);
    await expect(panel.locator('svg path[data-lifted]')).toHaveCount(1);
    const latest = await tip.innerText();
    await page.keyboard.press('ArrowLeft');
    expect(await tip.innerText()).not.toBe(latest);
    await page.keyboard.press('ArrowDown');
    await expect(tip).toContainText(names[1]);
    await expect(plot.locator('[aria-live]')).toContainText(names[1]);
    await page.keyboard.press('Escape');
    await expect(tip).toHaveCount(0);
    await expect(panel.locator('svg path[data-lifted]')).toHaveCount(0);

    // Pointing at a name lifts its line. Clicking keeps it lifted after the mouse leaves.
    await rows.nth(2).locator('strong').hover();
    await expect(tip).toContainText(names[2]);
    await rows.nth(2).locator('strong').click();
    await page.mouse.move(2, 2);
    await expect(tip).toContainText(names[2]);
    await expect(rows.nth(2)).toHaveAttribute('data-pinned', '');
    await panel.getByRole('button', { name: 'Show all lines' }).click();
    await expect(tip).toHaveCount(0);

    // Pointing at the chart itself, just left of where the leading line ends.
    const end = (await plot.locator('[data-end]').first().boundingBox())!;
    await page.mouse.move(end.x + end.width / 2 - 6, end.y + end.height / 2);
    await expect(tip).toContainText(names[0]);
    await expect(tip).toContainText(reading);
    await page.mouse.move(2, 2);
    await expect(tip).toHaveCount(0);
  }
});

test.describe('on a phone', () => {
  test.use({ viewport: { width: 390, height: 844 }, hasTouch: true });
  test('tapping a line or a name picks out one campaign', async ({ page }) => {
    test.setTimeout(90_000);
    await page.goto('/deep-dives/campaign-finance');
    const panel = page.locator('[data-chart="lead-raised"] [data-panel="district-3"]');
    const plot = panel.locator('[data-plot]');
    const tip = panel.locator('[data-tip]');
    const rows = panel.locator('ol li[data-series]');
    const names = await rows.locator('a').allInnerTexts();
    // The site scrolls smoothly, so positions are only read after a jump that does not animate.
    await plot.scrollIntoViewIfNeeded();
    const end = (await plot.locator('[data-end]').first().boundingBox())!;
    await page.touchscreen.tap(end.x + end.width / 2 - 6, end.y + end.height / 2);
    await expect(tip).toContainText(names[0]);
    await expect(tip).toContainText(reading);
    // The reading stays inside the plot, so nothing scrolls sideways.
    const [tipBox, plotBox] = [(await tip.boundingBox())!, (await plot.boundingBox())!];
    expect(tipBox.x).toBeGreaterThanOrEqual(plotBox.x - 1);
    expect(tipBox.x + tipBox.width).toBeLessThanOrEqual(plotBox.x + plotBox.width + 1);
    await panel.getByRole('button', { name: 'Show all lines' }).tap();
    await expect(tip).toHaveCount(0);

    // A name far down the legend brings the chart back on screen with that line lifted.
    await rows.last().scrollIntoViewIfNeeded();
    await page.evaluate(() => window.scrollBy({ top: 260, behavior: 'instant' }));
    await rows.last().locator('strong').tap();
    await expect(tip).toContainText(names.at(-1)!);
    await expect(plot).toBeInViewport({ ratio: 0.9 });
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
  });
});
