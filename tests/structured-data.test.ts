import { describe, expect, it } from "vitest";
import { DEEP_DIVES } from "@/lib/deep-dives";
import { eventBySlug } from "@/lib/events";
import { ORG_ID, WEBSITE_ID, deepDiveArticleNode, eventNode, ldJson, organizationNode, websiteNode } from "@/lib/structured-data";

describe("structured data", () => {
  it("describes the Lab once, as a graph every page carries", () => {
    const doc = JSON.parse(ldJson(organizationNode(), websiteNode()));
    expect(doc["@context"]).toBe("https://schema.org");
    expect(doc["@graph"].map((n: { "@type": string }) => n["@type"])).toEqual(["Organization", "WebSite"]);
    expect(doc["@graph"][0]["@id"]).toBe(ORG_ID);
    expect(doc["@graph"][1].publisher["@id"]).toBe(ORG_ID);
    expect(doc["@graph"][1]["@id"]).toBe(WEBSITE_ID);
  });
  it("gives every registered deep-dive an article with its own URL and update date", () => {
    for (const d of DEEP_DIVES) {
      const a = deepDiveArticleNode(d.slug)!;
      expect(a["@type"]).toBe("Article");
      expect(a.url).toBe(`https://www.portlandciviclab.org/deep-dives/${d.slug}`);
      expect(a.dateModified).toBe(d.updated);
      expect(String(a.headline).length).toBeLessThanOrEqual(110);
    }
    expect(deepDiveArticleNode("no-such-dive")).toBeNull();
  });
  it("marks the screening up as a free, in-person Portland event", () => {
    const e = eventNode(eventBySlug("aaron-swartz-at-40")!);
    expect(e["@type"]).toBe("Event");
    expect(e.startDate).toBe("2026-11-08T17:00:00-08:00");
    expect(e.eventAttendanceMode).toBe("https://schema.org/OfflineEventAttendanceMode");
    expect((e.location as { address: { addressLocality: string } }).address.addressLocality).toBe("Portland");
    expect((e.offers as { price: number }).price).toBe(0);
    expect((e.organizer as { "@id": string })["@id"]).toBe(ORG_ID);
  });
  it("cannot close its script element", () => {
    expect(ldJson({ "@type": "Thing", name: "</script><b>" })).not.toContain("</script>");
  });
});
