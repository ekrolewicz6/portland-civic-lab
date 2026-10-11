import { expect, test } from '@playwright/test';

test('current statistics cover reviewed council, auditor and governor candidates', async ({ request }) => {
  const response = await request.get('/api/campaign-finance/donations');
  expect(response.ok()).toBeTruthy();
  const data = await response.json();
  expect(data.candidates).toHaveLength(20);
  expect(data.end).toBe('2026-10-10');
  for (const candidate of data.candidates) {
    const stats = candidate.statistics;
    expect(Object.values(stats.funding).reduce((total: number, source: any) => total + source.cents, 0)).toBe(stats.nonmatchingCents);
    expect(stats.cashCents).toBe(stats.matchingCents + stats.nonmatchingCents);
    const recordResponse = await request.get(`/api/campaign-finance?committee=${candidate.committeeId}&basis=cash_contribution`);
    const records = await recordResponse.json();
    expect(stats.cashCents).toBe(Number(records.totals[0].amount_cents));
    expect(data.snapshot).toBe(records.snapshot);
  }
  const goldsmith = data.candidates.find((candidate: any) => candidate.committeeId === '24615');
  expect(goldsmith.statistics.individuals.medianCents).toBeNull();
  expect((await request.get('/api/campaign-finance/donations?committee=unknown')).status()).toBe(404);
  expect((await request.get('/api/campaign-finance/donations?committee=23208&race=oregon-governor')).status()).toBe(400);
});

for (const width of [1440, 390]) {
  test(`donation charts and profiles work at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    const errors: string[] = [];
    page.on('pageerror', error => errors.push(error.message));
    await page.goto('/deep-dives/campaign-finance');
    await expect(page.locator('[data-donation-comparison="portland-district-3"] tbody tr')).toHaveCount(9);
    await expect(page.locator('[data-donation-comparison="portland-district-4"] tbody tr')).toHaveCount(8);
    const weekly = page.locator('[data-chart="weekly"]').first();
    await expect(weekly).toContainText('Through 2026-10-10');
    const district4 = page.locator('#district-4');
    await expect(district4).toContainText('Sep 28–Oct 4');
    const timeline = page.locator('#campaign-timeline');
    await expect(timeline).toContainText('2026-10-10');
    await page.goto('/voters-guide/portland-district-3/tiffany-koyama-lane');
    const stats = page.locator('[data-donation-statistics="23208"]');
    await expect(stats).toContainText('Median individual gift');
    await expect(stats).toContainText('$100.00');
    await stats.getByText('Largest reported business, committee and labor sources', { exact: true }).click();
    await expect(stats).toContainText('political committee / PAC');
    await page.goto('/deep-dives/campaign-finance/governor');
    await expect(page.locator('[data-donation-comparison="oregon-governor"] tbody tr')).toHaveCount(2);
    await page.goto('/voters-guide/oregon-governor/tina-kotek');
    await expect(page.locator('[data-donation-statistics="4792"]')).toContainText('Median individual gift');
    expect(await page.evaluate(() => document.body.scrollWidth <= window.innerWidth)).toBeTruthy();
    expect(errors).toEqual([]);
  });
}
