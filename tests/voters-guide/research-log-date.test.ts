import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { RESEARCH_LOG_UPDATED } from "@/lib/voters-guide/research-log";

/** Every log entry heading carries an id that ends in its ISO date. */
const LOG = "src/app/(public)/voters-guide/research-log/page.tsx";

describe("the research log's last-modified date", () => {
  it("matches the newest entry heading in the log", () => {
    const source = readFileSync(LOG, "utf8");
    const dates = [...source.matchAll(/<h2 id="[a-z0-9-]*?(\d{4}-\d{2}-\d{2})"/g)].map((m) => m[1]);
    expect(dates.length).toBeGreaterThan(0);
    expect(RESEARCH_LOG_UPDATED).toBe([...dates].sort().at(-1));
  });
});
