import { test, expect } from '@playwright/test';

const path = '/deep-dives/campaign-finance/governor';

for (const width of [390, 1440]) {
  test(`governor money story at ${width}px: charts, sources and no sideways scroll`, async ({ page }) => {
    test.setTimeout(90_000);
    await page.setViewportSize({ width, height: 900 });
    const errors: string[] = [];
    page.on('pageerror', error => errors.push(error.message));
    const response = await page.goto(path);
    expect(response?.status()).toBe(200);
    await expect(page.getByRole('heading', { level: 1 })).toContainText('The money behind');
    const nav = page.getByRole('navigation', { name: 'Campaign finance', exact: true });
    await expect(nav.getByRole('link', { name: 'Governor', exact: true })).toHaveAttribute('aria-current', 'page');
    for (const chart of ['opening', 'source-mix', 'top-sources', 'gift-sizes', 'cumulative', 'weekly', 'states', 'counties', 'funders', 'both', 'spending', 'payees', 'position']) {
      await expect(page.locator(`[data-chart="${chart}"]`), chart).toHaveCount(1);
    }
    // Candidates are listed alphabetically, never ranked by money.
    await expect(page.locator('[data-chart="source-mix"] [data-candidate]').first()).toHaveAttribute('data-candidate', 'christine-drazan');
    await expect(page.locator('[data-chart="opening"]')).toContainText('Brett Smith');
    await expect(page.locator('[data-chart="counties"] svg path')).toHaveCount(72);
    await page.getByRole('button', { name: 'Number of gifts' }).click();
    await expect(page.locator('[data-county-maps]')).toHaveAttribute('data-county-maps', 'gifts');
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
    const tiny = await page.locator('article').evaluate(root => [...root.querySelectorAll('*')].filter(element =>
      !element.closest('svg') && element.children.length === 0 && element.textContent?.trim() && element.getClientRects().length && parseFloat(getComputedStyle(element).fontSize) < 12).length);
    expect(tiny).toBe(0);
    expect(errors).toEqual([]);
  });
}

test('governor evidence downloads and the voter guide panel agree with the story', async ({ page, request }) => {
  const data = await (await request.get('/data/campaign-finance/governor/data.json')).json();
  expect(data.version).toBe('governor-finance-v1');
  const csv = await request.get('/data/campaign-finance/governor/source-groups.csv');
  expect(csv.status()).toBe(200);
  expect((await csv.text()).split('\n')[0]).not.toMatch(/street|address|zip|employer|occupation/i);

  await page.goto('/voters-guide/oregon-governor');
  const panel = page.locator('#race-fundraising');
  await expect(panel.getByRole('link', { name: /Read the full investigation/ })).toHaveAttribute('href', path);
  const rows = panel.locator('tbody tr');
  await expect(rows).toHaveCount(3);
  await expect(rows.nth(0)).toContainText('Brett Smith');
  await expect(rows.nth(0)).toContainText('No committee in these records');
  const kotek = data.candidates.find((candidate: { candidateId: string }) => candidate.candidateId === 'tina-kotek');
  const dollars = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(Math.round(kotek.totals.cashCents / 100));
  await expect(rows.nth(2)).toContainText(dollars);

  await page.goto('/voters-guide/oregon-governor/brett-smith');
  await expect(page.locator('#campaign-finance')).toContainText('No committee naming Brett Smith');
});
