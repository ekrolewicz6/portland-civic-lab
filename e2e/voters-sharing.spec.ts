import { expect, test } from "@playwright/test";
import { guideCards, guideImage, GUIDE_ORIGIN } from "../src/lib/voters-guide/metadata";

const bots = ["facebookexternalhit/1.1", "Twitterbot/1.0", "Slackbot-LinkExpanding 1.0"];
for (const [key, card] of Object.entries(guideCards)) {
  test(`${key}: crawlers receive the correct guide title, canonical and full-size artwork without JavaScript`, async ({ request, page }) => {
    for (const bot of bots) {
      const response = await request.get(card.path, { headers: { "user-agent": bot } });
      expect(response.status()).toBe(200);
      const head = await page.evaluate((html) => {
        const doc = new DOMParser().parseFromString(html, "text/html");
        const meta = (name: string) => Array.from(doc.head.querySelectorAll(`meta[property="${name}"],meta[name="${name}"]`)).map(el => el.getAttribute("content"));
        return {
          title: doc.title,
          canonical: Array.from(doc.head.querySelectorAll('link[rel="canonical"]')).map(el => el.getAttribute("href")),
          ogTitle: meta("og:title"), twitterTitle: meta("twitter:title"),
          description: meta("description"), ogDescription: meta("og:description"), twitterDescription: meta("twitter:description"),
          url: meta("og:url"), images: meta("og:image"), twitterImages: meta("twitter:image"),
          width: meta("og:image:width"), height: meta("og:image:height"), alt: meta("og:image:alt"),
          twitterCard: meta("twitter:card"), robots: meta("robots"),
          schemas: Array.from(doc.querySelectorAll('script[type="application/ld+json"]')).map(el => JSON.parse(el.textContent!)),
        };
      }, await response.text());
      expect(head.title).toBe(card.title);
      expect(head.canonical).toEqual([GUIDE_ORIGIN + card.path]);
      expect(head.url).toEqual([GUIDE_ORIGIN + card.path]);
      expect(head.ogTitle).toEqual([card.title]);
      expect(head.twitterTitle).toEqual([card.title]);
      expect(head.description).toEqual([card.description]);
      expect(head.ogDescription).toEqual([card.description]);
      expect(head.twitterDescription).toEqual([card.description]);
      expect(head.images).toEqual([guideImage(key as keyof typeof guideCards).url]);
      expect(head.twitterImages).toEqual(head.images);
      expect(head.width).toEqual(["1200"]);
      expect(head.height).toEqual(["630"]);
      expect(head.alt[0]).toContain(card.label);
      expect(head.twitterCard).toEqual(["summary_large_image"]);
      expect(head.robots.join(" ")).not.toContain("noindex");
      const schema = head.schemas.find(s => s["@id"] === GUIDE_ORIGIN + card.path + "#page");
      expect(schema.name).toBe(card.title);
      expect(schema.isAccessibleForFree).toBe(true);
      expect(schema.breadcrumb.itemListElement.at(-1).item).toBe(GUIDE_ORIGIN + card.path);
    }
    // Follow the declared artwork path on the tested deployment, not production.
    const url = new URL(guideImage(key as keyof typeof guideCards).url);
    const image = await request.get(url.pathname + url.search);
    expect(image.status()).toBe(200);
    expect(image.headers()["content-type"]).toContain("image/png");
    const bytes = await image.body();
    expect(bytes.subarray(0, 8).toString("hex")).toBe("89504e470d0a1a0a");
    expect(bytes.readUInt32BE(16)).toBe(1200);
    expect(bytes.readUInt32BE(20)).toBe(630);
    expect(bytes.length).toBeGreaterThan(20000);
    expect(bytes.length).toBeLessThan(1000000);
  });
}

test("guide search entries are discoverable and invalid share cards fail closed", async ({ request }) => {
  const sitemap = await (await request.get("/sitemap.xml")).text();
  for (const card of Object.values(guideCards)) expect(sitemap).toContain(GUIDE_ORIGIN + card.path);
  expect((await request.get("/voters-guide/share/not-a-card")).status()).toBe(404);
  expect((await request.get("/voters-guide/share/toString")).status()).toBe(404);
});
