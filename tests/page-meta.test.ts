import { describe, expect, it } from "vitest";
import { metaDescription, pageMeta } from "@/lib/page-meta";

describe("page metadata", () => {
  it("keeps short descriptions and trims long ones to whole sentences", () => {
    expect(metaDescription("Short and complete.")).toBe("Short and complete.");
    const long = "First sentence explains the page in plain words for a reader. Second sentence adds a useful detail about the data. Third sentence would push it past the limit for sure.";
    const out = metaDescription(long);
    expect(out.length).toBeLessThanOrEqual(160);
    expect(out).toBe("First sentence explains the page in plain words for a reader. Second sentence adds a useful detail about the data.");
  });
  it("cuts one very long sentence at a word boundary", () => {
    const out = metaDescription("word ".repeat(60).trim() + ".");
    expect(out.length).toBeLessThanOrEqual(160);
    expect(out.endsWith("…")).toBe(true);
    expect(out).not.toMatch(/\s…$/);
  });
  it("sets a self canonical, and leaves the section's share card alone when asked", () => {
    const full = pageMeta({ title: "T", description: "D", path: "/x" });
    expect(full.alternates?.canonical).toBe("https://www.portlandciviclab.org/x");
    expect(full.openGraph?.url).toBe("https://www.portlandciviclab.org/x");
    const section = pageMeta({ title: "T", description: "D", path: "/x/y", sectionImage: true });
    expect(section.alternates?.canonical).toBe("https://www.portlandciviclab.org/x/y");
    expect(section.openGraph).toBeUndefined();
  });
});
