import { expect, test } from "@playwright/test";

/**
 * What a search engine sees on every page the sitemap lists, read as
 * Googlebot (which gets metadata in <head>; see htmlLimitedBots in
 * next.config.ts). Each page must answer 200 with its own title, description
 * and self-referencing canonical in the head, a share image, no noindex, and
 * a title no other listed page uses.
 */

const GOOGLEBOT = "Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)";
const GPTBOT = "Mozilla/5.0 AppleWebKit/537.36 (KHTML, like Gecko); compatible; GPTBot/1.2; +https://openai.com/gptbot";

const attr = (head: string, selector: RegExp) => head.match(selector)?.[1]?.replaceAll("&amp;", "&");
const metaContent = (head: string, key: string) =>
  attr(head, new RegExp(`<meta[^>]+(?:name|property)="${key}"[^>]*content="([^"]*)"`, "i"));
const trimSlash = (p: string) => (p.length > 1 ? p.replace(/\/$/, "") : p);

test("robots.txt names the sitemap and keeps sign-in and member pages out", async ({ request }) => {
  const body = await (await request.get("/robots.txt")).text();
  expect(body).toContain("Sitemap: https://www.portlandciviclab.org/sitemap.xml");
  for (const path of ["/api/", "/admin", "/member/", "/login"]) expect(body).toContain(`Disallow: ${path}`);
  expect(body).not.toMatch(/Disallow: \/\s*$/m);
});

test("llms.txt maps the site for answer engines", async ({ request }) => {
  const res = await request.get("/llms.txt");
  expect(res.status()).toBe(200);
  const body = await res.text();
  expect(body.startsWith("# Portland Civic Lab\n")).toBe(true);
  expect(body).toContain("https://www.portlandciviclab.org/deep-dives/");
  expect(body).toContain("https://www.portlandciviclab.org/methodology");
});

test("AI crawlers get the title and canonical in <head> on a dynamic page", async ({ request }) => {
  const html = await (await request.get("/ced/decisions", { headers: { "user-agent": GPTBOT } })).text();
  const head = html.split("</head>")[0];
  expect(head).toMatch(/<title>[^<]+<\/title>/);
  expect(attr(head, /<link[^>]+rel="canonical"[^>]*href="([^"]*)"/i)).toBe("https://www.portlandciviclab.org/ced/decisions");
});

test("every sitemap page gives search engines its own title, description and canonical", async ({ request }) => {
  test.setTimeout(300_000);
  const xml = await (await request.get("/sitemap.xml")).text();
  const paths = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => new URL(m[1]).pathname);
  expect(paths.length).toBeGreaterThan(300);
  expect(new Set(paths).size).toBe(paths.length);

  const problems: string[] = [];
  const titles = new Map<string, string>();
  let next = 0;
  async function worker() {
    while (next < paths.length) {
      const path = paths[next++];
      const res = await request.get(path, { headers: { "user-agent": GOOGLEBOT }, maxRedirects: 0, timeout: 60_000 });
      if (res.status() !== 200) { problems.push(`${path}: status ${res.status()}`); continue; }
      const head = (await res.text()).split("</head>")[0];
      const title = attr(head, /<title[^>]*>([^<]*)<\/title>/i);
      const canonical = attr(head, /<link[^>]+rel="canonical"[^>]*href="([^"]*)"/i);
      const ogUrl = metaContent(head, "og:url");
      if (!title) problems.push(`${path}: no <title> in <head>`);
      else if (titles.has(title)) problems.push(`${path}: same title as ${titles.get(title)}`);
      else titles.set(title, path);
      if (!metaContent(head, "description")) problems.push(`${path}: no description`);
      if (!canonical) problems.push(`${path}: no canonical`);
      else if (trimSlash(new URL(canonical).pathname) !== trimSlash(path)) problems.push(`${path}: canonical is ${canonical}`);
      if (ogUrl && trimSlash(new URL(ogUrl).pathname) !== trimSlash(path)) problems.push(`${path}: og:url is ${ogUrl}`);
      if (!metaContent(head, "og:image")) problems.push(`${path}: no og:image`);
      if (/noindex/i.test(metaContent(head, "robots") ?? "")) problems.push(`${path}: noindex but listed in the sitemap`);
    }
  }
  await Promise.all(Array.from({ length: 3 }, worker));
  expect(problems).toEqual([]);
});
