import { describe, it, expect } from "vitest";
import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { governor, governorCandidate, governorCandidates, governorUnlinked, roundMoney, share, words, nearestThousand } from "@/lib/campaign-finance/governor";
import counties from "@/lib/campaign-finance/oregon-counties.json";

const drazan = governorCandidate("christine-drazan")!;
const kotek = governorCandidate("tina-kotek")!;
const sum = <T,>(rows: T[], value: (row: T) => number) => rows.reduce((total, row) => total + value(row), 0);

describe("governor finance edition", () => {
  it("links two reviewed committees and leaves the third candidate as missing coverage, never zero", () => {
    expect(governorCandidates.map((c) => c.name)).toEqual(["Christine Drazan", "Tina Kotek"]);
    expect([drazan.committeeId, kotek.committeeId]).toEqual(["19050", "4792"]);
    expect(governorUnlinked.map((c) => c.candidateId)).toEqual(["brett-smith"]);
    expect(governorUnlinked[0]).not.toHaveProperty("totals");
    for (const candidate of governor.candidates) expect(candidate.linkSource).toMatch(/^https:\/\//);
  });

  it.each(governorCandidates.map((c) => [c.name, c] as const))("%s: every breakdown adds up to the cash total", (_name, c) => {
    const cash = c.totals.cashCents;
    expect(sum(c.kinds, (k) => k.cents)).toBe(cash);
    expect(sum(c.kinds, (k) => k.records)).toBe(c.totals.cashRecords);
    expect(sum(c.reportedTypes, (t) => t.cents)).toBe(cash);
    expect(sum(c.bands, (b) => b.cents) + c.totals.smallCents).toBe(cash);
    expect(sum(c.bands, (b) => b.groups)).toBe(c.totals.namedGroups);
    expect(sum(c.weekly, (w) => w.cents)).toBe(cash);
    expect(sum(c.monthly, (m) => m.cashCents)).toBe(cash);
    expect(sum(c.monthly, (m) => m.paymentCents)).toBe(c.totals.paidCents);
    expect(c.totals.namedCents + c.totals.smallCents).toBe(cash);
    expect(c.kinds.find((k) => k.key === "small")!.cents).toBe(c.totals.smallCents);
    const geo = c.geography;
    expect(geo.oregonCents + geo.outsideCents + geo.unknownCents).toBe(c.totals.namedCents);
    const individual = c.kinds.find((k) => k.key === "individual")!.cents;
    expect(geo.individuals.oregon.cents + geo.individuals.outside.cents + geo.individuals.unknown.cents).toBe(individual);
    expect(sum(geo.counties, (county) => county.cents) + geo.countyUndetermined.cents).toBe(geo.individuals.oregon.cents);
    expect(geo.counties).toHaveLength(36);
    expect(sum(c.spending.purposes, (p) => p.cents)).toBe(c.totals.paidCents);
    expect(c.likeForLike.raisedCents + c.likeForLike.raisedAfterCents).toBe(cash);
    expect(c.likeForLike.paidCents + c.likeForLike.paidAfterCents).toBe(c.totals.paidCents);
    expect(c.likeForLike.asOf).toBe(governor.commonPaymentDate);
    expect(c.peaks[0].cents).toBe(Math.max(...c.weekly.map((w) => w.cents)));
    expect(c.topSources.every((source) => !/^(disclosure:|unknown:)/.test(source.id))).toBe(true);
    for (const [index, source] of c.topSources.entries()) if (index) expect(source.cents).toBeLessThanOrEqual(c.topSources[index - 1].cents);
  });

  it("maps every county total onto a county shape", () => {
    const names = new Set(counties.counties.map((county) => county.name));
    expect(names.size).toBe(36);
    for (const c of governorCandidates) for (const county of c.geography.counties) expect(names.has(county.county), county.county).toBe(true);
  });

  it("publishes evidence files whose checksums match", () => {
    for (const [name, file] of Object.entries(governor.evidence)) {
      const body = readFileSync(`public${file.url}`);
      expect(createHash("sha256").update(body).digest("hex"), name).toBe(file.sha256);
      expect(body.toString("utf8").trimEnd().split("\n").length - 1, name).toBe(file.rows);
    }
    expect(readFileSync("public/data/campaign-finance/governor/data.json", "utf8")).toBe(readFileSync("src/lib/campaign-finance/governor-data.json", "utf8"));
  });

  // The page's headings and lead sentences state these as facts. If a rebuilt
  // edition changes one, the copy in governor/page.tsx has to be reread.
  it("still supports the sentences written on the page", () => {
    const kind = (c: typeof kotek, key: string) => c.kinds.find((k) => k.key === key)!.cents;
    const large = (c: typeof kotek) => sum(c.bands.filter((b) => b.key === "100k_1m" || b.key === "1m_plus"), (b) => b.cents);
    expect(kotek.totals.cashCents).toBeGreaterThan(drazan.totals.cashCents);
    expect(kind(drazan, "individual")).toBeGreaterThan(kind(kotek, "individual"));
    expect(kind(drazan, "business")).toBeGreaterThan(kind(kotek, "business"));
    expect(kind(kotek, "labor")).toBeGreaterThan(Math.max(...kotek.kinds.filter((k) => k.key !== "labor").map((k) => k.cents)));
    expect(kotek.topSources.filter((s) => s.kind === "governors").map((s) => s.name)).toEqual(["Democratic Governors Association", "Democratic Governors Victory Fund"]);
    expect(drazan.totals.republicanGovernorsCents).toBe(0);
    for (const c of governorCandidates) expect(large(c) * 2).toBeGreaterThan(c.totals.cashCents);
    expect(kotek.peaks[0].top[0].name).toBe("Democratic Governors Association");
    expect(drazan.peaks[0].top[0].name).toMatch(/^AGC Committee for Action/);
    // "have all come since the end of August"
    expect(drazan.peaks.every((peak) => peak.start >= "2026-08-31")).toBe(true);
    expect(drazan.geography.oregonCents / drazan.totals.namedCents).toBeGreaterThan(0.9);
    const kotekOutside = kotek.geography.outsideCents / kotek.totals.namedCents;
    expect(kotekOutside).toBeGreaterThan(0.4);
    expect(kotekOutside).toBeLessThan(0.5);
    expect(drazan.topSources.filter((s) => s.name.startsWith("Don H Jones") && s.city === "Ashland")).toHaveLength(2);
    for (const c of governorCandidates) expect(c.spending.purposes[0].label).toBe("Broadcast advertising (radio, TV)");
    expect(governor.commonPaymentDate).toBe(kotek.totals.latestPaymentDate);
    expect(kotek.likeForLike.paidAfterCents).toBe(0);
    expect(kotek.likeForLike.cashPositionCents).toBeGreaterThan(drazan.likeForLike.cashPositionCents);
    expect(drazan.totals.medianPaymentFilingLagDays).toBe(1);
    expect(governor.upstream.find((row) => row.committeeId === "33")!.combinedSmallCents).toBeGreaterThan(0);
    expect(governor.upstream.find((row) => row.committeeId === "4")!.topNamed).toHaveLength(1);
    expect(governor.context.tenMillion.cents).toBe(1_000_000_000);
    expect(governor.context.tenMillion.quote.split(/\s+/).length).toBeLessThan(15);
    expect(governor.independent.allocations).toHaveLength(1);
  });

  it("formats money and counts for prose", () => {
    expect(roundMoney(1_279_350_447)).toBe("$12.8 million");
    expect(roundMoney(1_000_000_000)).toBe("$10 million");
    expect(roundMoney(134_000_000)).toBe("$1.34 million");
    expect(roundMoney(70_350_000)).toBe("$703,500");
    expect(nearestThousand(96_465_050)).toBe("$965,000");
    expect(share(5_000_000, 1_279_350_447)).toBe("under 1%");
    expect(share(100_443_600, 100_678_570)).toBe("over 99%");
    expect(share(0, 10)).toBe("0%");
    expect(words(13, true)).toBe("Thirteen");
    expect(words(1)).toBe("one");
  });
});
