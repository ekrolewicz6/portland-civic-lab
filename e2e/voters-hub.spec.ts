import { test, expect } from "@playwright/test";
import { races } from "../src/lib/voters-guide/published";
import { issues, raceSheetVersion, shortRaceTitle } from "../src/lib/voters-guide/race-sheet";
import { candidateTitle, printTitle, raceTitle, votesTitle } from "../src/lib/voters-guide/race-sheet/seo";
import { guideCards, GUIDE_ORIGIN } from "../src/lib/voters-guide/metadata";
import { GROUP_ORDER, officeOf } from "../src/lib/voters-guide/race-sheet/office";

/** The hub, the export, the crawler surface and the routes that must fail closed. */

const councilRaces = races.filter((r) => officeOf(r).group === "council");

test("hub: a card with a portrait mosaic for every published race, grouped by office, a district map, no search box, no inline name lists", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/voters-guide");
  await expect(page.getByRole("heading", { level: 1 })).toContainText("Know their choices");
  await expect(page.getByRole("searchbox")).toHaveCount(0);
  await expect(page.getByRole("textbox")).toHaveCount(0);
  for (const race of races) {
    const short = shortRaceTitle(race);
    const card = page.locator(`a[href="/voters-guide/${race.id}"]`).filter({ hasText: "Explore the complete field" });
    await expect(card).toHaveCount(1);
    await expect(card.getByRole("heading", { name: new RegExp(`${short.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}$`) })).toBeVisible();
    const n = race.candidates.length;
    await expect(card).toContainText(`${n} candidate${n === 1 ? "" : "s"} · ${race.seats} seat${race.seats === 1 ? "" : "s"}`);
    // The mosaic is decorative: one portrait tile per candidate, hidden from assistive tech, no names.
    const mosaic = card.locator("div[aria-hidden='true']").first();
    await expect(mosaic.locator(":scope > *")).toHaveCount(race.candidates.length);
  }
  const text = await page.locator("main").first().innerText();
  for (const person of races.flatMap((r) => r.candidates)) expect(text, person.name).not.toContain(person.name);
  // Every office group with a published race has its own section heading.
  for (const group of GROUP_ORDER.filter((g) => g !== "council")) {
    const count = races.filter((r) => officeOf(r).group === group).length;
    await expect(page.locator(`#group-${group}`)).toHaveCount(count ? 1 : 0);
  }
  // The district map links only the published districts.
  const map = page.getByRole("img", { name: /Council districts/i }).first();
  await expect(map).toBeVisible();
  for (const race of councilRaces) {
    const district = shortRaceTitle(race).match(/\d+/)![0];
    await expect(page.getByRole("link", { name: `District ${district} race page` })).toHaveAttribute("href", `/voters-guide/${race.id}`);
  }
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  await page.locator(`a[href="/voters-guide/${races[0].id}"]`).filter({ hasText: "Explore the complete field" }).click();
  await expect(page).toHaveURL(new RegExp(`/voters-guide/${races[0].id}$`));
});

test("evidence export carries the race-sheet overlay with its version, provenance and https-only sources", async ({ request }) => {
  const response = await request.get("/voters-guide/evidence");
  expect(response.ok()).toBe(true);
  expect(response.headers()["content-disposition"]).toContain("attachment");
  const payload = await response.json();
  expect(payload.status).toContain("human editorial review is incomplete");
  expect(payload.note).toContain("Candidate statements, independent records and editorial interpretations are separate fields");
  expect(payload.races).toHaveLength(races.length);
  expect(payload.councilDecisions).toHaveLength(73);
  const people = payload.races.flatMap((r: { candidates: unknown[] }) => r.candidates);
  expect(people).toHaveLength(races.reduce((n, r) => n + r.candidates.length, 0));
  for (const candidate of people as { sources: { url: string }[]; analysis?: { sources: { url: string }[]; issues: Record<string, { source: { url: string } }> } }[]) {
    const urls = [...candidate.sources, ...(candidate.analysis?.sources ?? []), ...Object.values(candidate.analysis?.issues ?? {}).map((i) => i.source)].map((s) => s.url);
    expect(urls.length).toBeGreaterThan(0);
    for (const url of urls) expect(url).toMatch(/^https:\/\//);
  }
  expect(payload.raceSheet.version).toBe(raceSheetVersion);
  expect(payload.raceSheet.issueLines.length).toBeGreaterThan(0);
  for (const line of payload.raceSheet.issueLines as { from?: string; reviewedBy?: string; line: string }[]) {
    expect(line.from, line.line).toMatch(/^analysis\.issues\.\w+\.position$/);
    expect(typeof line.reviewedBy, line.line).toBe("string");
    expect(line.reviewedBy!.length).toBeGreaterThan(0);
  }
  for (const said of payload.raceSheet.saidPlacements as { from: string; reviewedBy: string }[]) {
    expect(said.from.length).toBeGreaterThan(0);
    expect(said.reviewedBy.length).toBeGreaterThan(0);
  }
});

test("unknown races, candidates, share cards and votes pages for offices without a Council record fail closed", async ({ request }) => {
  for (const path of ["/voters-guide/invented-race", "/voters-guide/portland-district-1", "/voters-guide/portland-district-3/not-a-person", "/voters-guide/portland-district-3/toString", "/voters-guide/share/not-a-card", "/voters-guide/oregon-governor/votes"])
    expect((await request.get(path)).status(), path).toBe(404);
  expect((await request.get("/voters-guide/portland-district-3/votes")).status()).toBe(200);
  expect((await request.get("/voters-guide/oregon-governor")).status()).toBe(200);
  expect((await request.get("/voters-guide/portland-district-3/print")).status()).toBe(200);
});

const d3 = races.find((r) => r.id === "portland-district-3")!;
const leon = d3.candidates.find((c) => c.id === "esther-leon")!;
const pages: [string, string, boolean][] = [
  [guideCards.guide.path, guideCards.guide.title, true],
  [guideCards.standards.path, guideCards.standards.title, true],
  [guideCards.research.path, guideCards.research.title, true],
  ...races.map((race): [string, string, boolean] => [`/voters-guide/${race.id}`, raceTitle(race), true]),
  [`/voters-guide/portland-district-3/${leon.id}`, candidateTitle(d3, leon), true],
  ["/voters-guide/portland-district-3/votes", votesTitle(d3), true],
  ["/voters-guide/portland-district-3/print", printTitle(d3), false],
];
for (const [path, title, indexed] of pages) {
  test(`crawlers get the right title and canonical for ${path}`, async ({ request }) => {
    const response = await request.get(path, { headers: { "user-agent": "facebookexternalhit/1.1" } });
    expect(response.status()).toBe(200);
    const html = (await response.text()).replace(/&amp;/g, "&").replace(/&#x27;|&#39;/g, "'");
    expect(html.match(/<title>([^<]*)<\/title>/)?.[1]).toBe(title);
    expect(html.match(/<link rel="canonical" href="([^"]*)"/)?.[1]).toBe(GUIDE_ORIGIN + path);
    expect(html.match(/<meta property="og:url" content="([^"]*)"/)?.[1]).toBe(GUIDE_ORIGIN + path);
    expect(/<meta name="robots" content="[^"]*noindex/.test(html)).toBe(!indexed);
  });
}

test("the sitemap lists the hub, every race, the council votes routes and every brief", async ({ request }) => {
  const sitemap = await (await request.get("/sitemap.xml")).text();
  for (const race of races) {
    expect(sitemap).toContain(`${GUIDE_ORIGIN}/voters-guide/${race.id}</loc>`);
    if (officeOf(race).hasCouncilRecord) expect(sitemap).toContain(`${GUIDE_ORIGIN}/voters-guide/${race.id}/votes</loc>`);
    else expect(sitemap).not.toContain(`${GUIDE_ORIGIN}/voters-guide/${race.id}/votes</loc>`);
    for (const person of race.candidates) expect(sitemap).toContain(`${GUIDE_ORIGIN}/voters-guide/${race.id}/${person.id}</loc>`);
    expect(sitemap).not.toContain(`/voters-guide/${race.id}/print`);
  }
});
