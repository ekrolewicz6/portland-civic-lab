import { expect, test } from '@playwright/test';
import publication from '../src/lib/campaign-finance/active-publication.json';

const base = '/deep-dives/campaign-finance';
for (const [suffix, title] of [['', 'Portland'], ['/data', 'download'], ['/governor', 'governor']]) {
  test(`${base}${suffix}: crawlers receive current metadata and a distinct share image`, async ({ page, request }) => {
    const path = base + suffix;
    const response = await request.get(path, { headers: { 'user-agent': 'facebookexternalhit/1.1' } });
    expect(response.status()).toBe(200);
    const meta = await page.evaluate(html => {
      const doc = new DOMParser().parseFromString(html, 'text/html');
      const get = (name: string) => doc.head.querySelector(`meta[property="${name}"],meta[name="${name}"]`)?.getAttribute('content');
      return { title: doc.title, description: get('description'), canonical: doc.head.querySelector('link[rel="canonical"]')?.getAttribute('href'), ogTitle: get('og:title'), ogUrl: get('og:url'), ogDescription: get('og:description'), image: get('og:image'), alt: get('og:image:alt'), card: get('twitter:card'), twitterImage: get('twitter:image'), twitterTitle: get('twitter:title'), robots: get('robots') };
    }, await response.text());
    expect(meta.title.toLowerCase()).toContain(title.toLowerCase());
    expect(meta.canonical).toBe(`https://www.portlandciviclab.org${path}`);
    expect(meta.ogUrl).toBe(meta.canonical);
    expect(meta.ogDescription).toBe(meta.description);
    expect(meta.description!.length).toBeLessThanOrEqual(160);
    expect(meta.twitterTitle).toBe(meta.ogTitle);
    expect(meta.card).toBe('summary_large_image');
    expect(meta.twitterImage).toBe(meta.image);
    expect(meta.alt!.length).toBeGreaterThan(40);
    expect(meta.robots ?? '').not.toContain('noindex');
    const image = new URL(meta.image!);
    expect(image.origin).toBe('https://www.portlandciviclab.org');
    expect(image.pathname.startsWith(`${path}/opengraph-image`)).toBe(true);
    expect(image.pathname.endsWith(`/${publication.snapshot}`)).toBe(true);
    const result = await request.get(image.pathname + image.search);
    expect(result.status()).toBe(200);
    expect(result.headers()['content-type']).toContain('image/png');
    const bytes = await result.body();
    expect(bytes.subarray(0,8).toString('hex')).toBe('89504e470d0a1a0a');
    expect(bytes.readUInt32BE(16)).toBe(1200);
    expect(bytes.readUInt32BE(20)).toBe(630);
    expect(bytes.length).toBeLessThan(500_000);
  });
}
