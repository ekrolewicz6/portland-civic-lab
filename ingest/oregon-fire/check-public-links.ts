/** Read-only public-source audit. Access failure is not evidence of a missing page. */
import { readFile, writeFile } from "node:fs/promises";
const root = "research/oregon-fire-map-2026-09-10/";
type State = "working" | "redirected" | "missing" | "access-blocked" | "unverified";
async function main() {
  const registry = JSON.parse(await readFile(root + "endpoint-registry-2026-09-26.json", "utf8")) as { sources: { id: string; title: string; url: string }[] };
  const rows: { id: string; url: string; finalUrl?: string; state: State; status?: number; title?: string; checkedAt: string; reason?: string }[] = [];
  let cursor = 0;
  async function worker() {
    while (cursor < registry.sources.length) {
      const source = registry.sources[cursor++];
      try {
        const response = await fetch(source.url, { redirect: "follow", signal: AbortSignal.timeout(20000), headers: { "User-Agent": "PortlandCivicLab-source-audit/1.0" } });
        const type = response.headers.get("content-type") ?? "";
        // Do not download entire PDFs/rasters merely to test a link.
        const html = /text\/html/.test(type) ? (await response.text()).slice(0, 250000) : "";
        if (!html) await response.body?.cancel();
        const title = html.match(/<title[^>]*>([\s\S]*?)<\/title>/i)?.[1]?.replace(/\s+/g, " ").trim();
        const soft404 = !!title && /\b404\b|page not found|page cannot be found|page doesn.t exist/i.test(title);
        const state: State = response.status === 404 || response.status === 410 || soft404 ? "missing" : [401,403,429].includes(response.status) ? "access-blocked" : !response.ok ? "unverified" : response.redirected ? "redirected" : "working";
        rows.push({ id: source.id, url: source.url, finalUrl: response.url, state, status: response.status, title, checkedAt: new Date().toISOString(), ...(soft404 ? { reason: "Soft 404 indicated by document title" } : {}) });
      } catch (error) {
        rows.push({ id: source.id, url: source.url, state: "unverified", checkedAt: new Date().toISOString(), reason: error instanceof Error ? error.name : "Request failed" });
      }
    }
  }
  await Promise.all(Array.from({ length: 6 }, worker));
  rows.sort((a,b) => a.url.localeCompare(b.url));
  await writeFile(root + "evidence-2026-09-26/link-checks.json", JSON.stringify({ capturedAt: new Date().toISOString(), method: "GET with redirects; HTTP and HTML-title checks. Working means reachable, not an editorial accuracy or geographic-coverage finding.", rows }, null, 2) + "\n");
  console.log(JSON.stringify(rows.reduce((counts, r) => ({ ...counts, [r.state]: (counts[r.state] ?? 0) + 1 }), {} as Record<string,number>)));
}
main().catch((error) => { console.error(error instanceof Error ? error.message : "Link check failed"); process.exitCode = 1; });
