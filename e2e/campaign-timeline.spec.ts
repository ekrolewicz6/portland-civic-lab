import { test, expect } from '@playwright/test';
import frozen from '../src/lib/campaign-finance/campaign-dynamics.json';
import { buildEventWindows, timelineCatalog } from '../src/lib/campaign-finance/timeline';

test('fundraising timeline: every event stays visible, filters agree, and phone controls work', async ({ page }) => {
  const errors: string[] = [];
  page.on('pageerror', error => errors.push(error.message));
  const fixture = { ...frozen, events: buildEventWindows(frozen.candidates.map(candidate => candidate.committeeId), '2025-01-01', frozen.end, (_id, _date, key) => key === 'public_cents' ? 10000 : 100), refresh: { status: 'validated' } };
  await page.route('**/api/campaign-finance/daily', route => route.fulfill({ json: fixture }));
  await page.goto('/deep-dives/campaign-finance');
  const chart = page.locator('#cumulative-fundraising');
  await expect(chart.getByRole('status')).toContainText('Filings through');
  const expected = timelineCatalog.events.filter(event => event.date >= '2026-03-23' && event.date <= frozen.end).length;
  for (const width of [320,390,768,1440]) {
    await page.setViewportSize({ width, height: 900 });
    await expect.poll(async () => {
      const counts = await chart.locator('[aria-label="All events on the chart timeline"] button span').allTextContents();
      return counts.reduce((sum, value) => sum + Number(value), 0);
    }).toBe(expected);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  }
  await page.setViewportSize({ width: 390, height: 844 });
  const marker = chart.locator('[aria-label="All events on the chart timeline"] button').first();
  await marker.focus();
  await page.keyboard.press('Enter');
  await expect(chart.getByRole('heading', { name: 'The week before & after' })).toBeVisible();
  await chart.getByLabel('Money shown', { exact: true }).selectOption('public_cents');
  await expect(chart.locator('[class*="windowComparison"]')).toContainText('$2,800.00');
  await chart.getByRole('button', { name: 'Close timeline details' }).click();
  await chart.getByRole('button', { name: /#1/ }).click();
  await expect(chart.getByRole('button', { name: 'Each week', exact: true })).toHaveAttribute('aria-pressed','true');
  await expect(chart.getByRole('link', { name: /Browse this race/ })).toHaveAttribute('href', /basis=cash_contribution.*matching=only/);
  await chart.getByRole('button', { name: 'District 4', exact: true }).click();
  await expect(chart.getByRole('region', { name: 'Timeline selection' })).toHaveCount(0);
  expect(errors).toEqual([]);
});
