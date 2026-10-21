import { test, expect } from '@playwright/test';
import { createHash } from 'node:crypto';
import { unzipSync } from 'fflate';
import publication from '../src/lib/campaign-finance/active-publication.json';

const route = '/deep-dives/campaign-finance/data';
for (const width of [390, 1440]) {
  test(`complete data downloads are readable at ${width}px`, async ({ page, context }) => {
    await page.setViewportSize({ width, height:900 });
    const errors: string[] = []; page.on('pageerror', error => errors.push(error.message));
    await page.goto(route);
    await expect(page.getByRole('heading', {level:1})).toContainText('Take the campaign-finance data');
    await expect(page.getByRole('link', {name:/Download complete analysis ZIP/})).toBeVisible();
    await expect(page.locator('article')).toContainText(publication.rows.toLocaleString('en-US'));
    const prompt = page.getByLabel('Copy this into your AI tool, then add your question');
    await expect(prompt).toHaveValue(/download its recommended analysis ZIP/);
    await context.grantPermissions(['clipboard-read', 'clipboard-write']);
    await page.getByRole('button', {name:'Copy analysis prompt'}).click();
    await expect(page.getByRole('status').filter({hasText:'Prompt copied.'})).toBeVisible();
    expect(await page.evaluate(() => navigator.clipboard.readText())).toContain('SHA-256');
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    expect(errors).toEqual([]);
  });
}

test('download links and instructions work with JavaScript disabled', async ({ browser }) => {
  const context = await browser.newContext({javaScriptEnabled:false});
  const page = await context.newPage();
  await page.goto(route);
  await expect(page.getByRole('link', {name:/Download complete analysis ZIP/})).toHaveAttribute('href','/data/campaign-finance/downloads/analysis.zip');
  await expect(page.getByRole('link', {name:'Machine-readable manifest'})).toHaveAttribute('href','/data/campaign-finance/downloads/manifest.json');
  await expect(page.getByLabel('Copy this into your AI tool, then add your question')).toHaveValue(/My question is:/);
  const schema = JSON.parse(await page.locator('script[type="application/ld+json"]').last().textContent() ?? '{}');
  expect(schema['@type']).toBe('Dataset');
  expect(schema.version).toBe(publication.snapshot);
  await context.close();
});

test('an unauthenticated client can download and verify the full archive', async ({ request }) => {
  const response = await request.get('/data/campaign-finance/downloads/manifest.json');
  expect(response.ok()).toBe(true);
  expect(response.headers()['access-control-allow-origin']).toBe('*');
  const manifest = await response.json();
  expect(manifest.snapshot).toBe(publication.snapshot);
  const file = await request.get(new URL(manifest.downloads.bundle.url).pathname);
  expect(file.ok()).toBe(true);
  const body = await file.body();
  expect(body.length).toBe(manifest.downloads.bundle.bytes);
  expect(createHash('sha256').update(body).digest('hex')).toBe(manifest.downloads.bundle.sha256);
  const contents = unzipSync(body);
  expect(JSON.parse(Buffer.from(contents['snapshot.json']).toString()).rows).toBe(publication.rows);
  expect(Object.keys(contents).filter(name => name.startsWith('tables/'))).toHaveLength(6);
  expect(Object.keys(contents)).toEqual(expect.arrayContaining(['README.md','schema.json','analysis.sql','evidence/governor/data.json','evidence/committee-race-crosswalk.json']));
  const text = await (await request.get('/llms.txt')).text();
  expect(text).toContain(route);
  expect(text).toContain('/data/campaign-finance/downloads/manifest.json');
  expect(await (await request.get('/sitemap.xml')).text()).toContain(route);
});

test('open data and About expose the kit and a working contact link', async ({ page }) => {
  await page.goto('/open-data');
  await expect(page.getByRole('link', {name:/Download the data or give your AI/})).toHaveAttribute('href',route);
  await page.goto('/about');
  const link = page.getByRole('listitem').filter({hasText:'Campaign-finance data downloads and analysis kit'}).getByRole('link', {name:'Open',exact:true});
  await expect(link).toHaveAttribute('href',route);
  const href = await page.locator('a[href*="project=Campaign-finance"]').getAttribute('href');
  expect(href).toContain('/contact?');
  await page.goto(href!);
  await expect(page.getByRole('heading', {level:1})).toBeVisible();
});
