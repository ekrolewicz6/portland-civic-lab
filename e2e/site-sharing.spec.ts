import { expect, test } from "@playwright/test";
import { HOME_TITLE, HOME_DESCRIPTION } from "../src/lib/home-metadata";

const paths = ["/", "/dashboard", "/dashboard/performance", "/deep-dives", "/about", "/business", "/property", "/institutions", "/donate", "/contact", "/directory", "/org-chart", "/decisions", "/methodology", "/independence", "/open-data", "/records", "/proposals", "/volunteer", "/concierge", "/deep-dives/pps-budget", "/deep-dives/libraries", "/deep-dives/fpdr"];

test("dynamic dashboard and bureau images work in both image runtimes", async ({ request }) => {
  for (const path of ["/dashboard/housing", "/org-chart/water"]) {
    const response = await request.get(path, { headers: { "user-agent": "Twitterbot/1.0" } });
    expect(response.status()).toBe(200);
    const html = await response.text();
    const match = html.match(/<meta property="og:image" content="([^"]+)"/);
    expect(match).not.toBeNull();
    const url = new URL(match![1].replaceAll("&amp;", "&"));
    expect(url.pathname).toContain(path + "/opengraph-image");
    const responseImage = await request.get(url.pathname + url.search);
    expect(responseImage.status()).toBe(200);
    const bytes = await responseImage.body();
    expect(bytes.subarray(0, 8).toString("hex")).toBe("89504e470d0a1a0a");
    expect(bytes.readUInt32BE(16)).toBe(1200);
    expect(bytes.readUInt32BE(20)).toBe(630);
  }
});

for (const path of paths) {
  test(`${path}: public search and sharing metadata identifies this page and serves its image`, async ({ request, page }) => {
    test.setTimeout(90000);
    const response = await request.get(path, { headers: { "user-agent": "facebookexternalhit/1.1" }, timeout: 75000 });
    expect(response.status()).toBe(200);
    const data = await page.evaluate((html) => {
      const doc = new DOMParser().parseFromString(html, "text/html");
      const meta = (name: string) => doc.head.querySelector(`meta[property="${name}"],meta[name="${name}"]`)?.getAttribute("content");
      return { title: doc.title, description: meta("description"), canonical: doc.head.querySelector('link[rel="canonical"]')?.getAttribute("href"), ogTitle: meta("og:title"), ogDescription: meta("og:description"), ogUrl: meta("og:url"), image: meta("og:image"), imageAlt: meta("og:image:alt"), twitterTitle: meta("twitter:title"), twitterImage: meta("twitter:image"), card: meta("twitter:card") };
    }, await response.text());
    expect(new URL(data.canonical!).pathname).toBe(path);
    expect(new URL(data.ogUrl!).pathname).toBe(path);
    expect(data.twitterTitle).toBe(data.ogTitle);
    expect(data.ogDescription).toBe(data.description);
    expect(data.imageAlt!.length).toBeGreaterThan(15);
    expect(data.twitterImage).toBe(data.image);
    expect(data.card).toBe("summary_large_image");
    if (path === "/") {
      expect(data.title).toBe(HOME_TITLE);
      expect(data.description).toBe(HOME_DESCRIPTION);
    } else expect(data.ogTitle).not.toBe(HOME_TITLE);
    const imageUrl = new URL(data.image!);
    expect(imageUrl.pathname.startsWith(path === "/" ? "/opengraph-image" : `${path}/opengraph-image`)).toBe(true);
    const image = await request.get(imageUrl.pathname + imageUrl.search);
    expect(image.status()).toBe(200);
    expect(image.headers()["content-type"]).toContain("image/png");
    const png = await image.body();
    expect(png.subarray(0, 8).toString("hex")).toBe("89504e470d0a1a0a");
    expect(png.readUInt32BE(16)).toBe(1200);
    expect(png.readUInt32BE(20)).toBe(630);
    expect(png.length).toBeLessThan(1000000);
  });
}
