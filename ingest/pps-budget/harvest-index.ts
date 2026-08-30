/**
 * Harvest document links (with anchor text) from the PPS / TSCC index pages
 * that carry the budget corpus. Output feeds the hand-curated registry in
 * sources.ts — this script never writes the registry itself.
 *
 *   npx tsx ingest/pps-budget/harvest-index.ts
 *
 * Writes runtime-data/pps-budget/harvest.json and a readable .txt beside it.
 * Also saves each index page's raw HTML under runtime-data/pps-budget/html/
 * so the harvest is reproducible even after the pages change.
 */

import fs from "node:fs";
import path from "node:path";

const OUT_DIR = "runtime-data/pps-budget";
const HTML_DIR = path.join(OUT_DIR, "html");

const INDEX_PAGES: Record<string, string> = {
  "annual-budgets":
    "https://www.pps.net/departments/budget-grant-accounting/annual-budgets",
  "acfr-index":
    "https://www.pps.net/board/board-of-education/pps-audit-reports/annual-comprehensive-financial-reports",
  "financial-reports": "https://www.pps.net/departments/finance/financial-reports",
  "cbrc-archive":
    "https://www.pps.net/departments/budget-grant-accounting/cbrc-community-budget-review-committee/archived-materials",
  "cbrc-main":
    "https://www.pps.net/departments/budget-grant-accounting/cbrc-community-budget-review-committee",
  "bond-audits":
    "https://www.pps.net/board/board-of-education/pps-audit-reports/external-bond-performance-audits",
  "sos-audits":
    "https://www.pps.net/board/board-of-education/pps-audit-reports/secretary-of-state-sos-audit-services",
  "oipa":
    "https://www.pps.net/board/board-of-education/pps-audit-reports/pps-office-of-internal-performance-auditors-oipa",
  "labor-relations":
    "https://www.pps.net/departments/human-resources/employee-and-labor-relations",
  "salary-schedules":
    "https://www.pps.net/departments/human-resources/classification-and-compensation/salary-schedules",
  "public-notices": "https://www.pps.net/board/board-of-education/publicnotices",
  "esser-overview":
    "https://www.pps.net/departments/budget-grant-accounting/esser-federal-funds-overview",
  "budget-process-fy27":
    "https://www.pps.net/about/2026-27-budget-process/2026-27-budget-process",
};

interface Harvested {
  page: string;
  pageUrl: string;
  href: string;
  text: string;
}

function absolutize(href: string, base: string): string {
  try {
    return new URL(href, base).toString();
  } catch {
    return href;
  }
}

function extractLinks(html: string, page: string, pageUrl: string): Harvested[] {
  const out: Harvested[] = [];
  const re = /<a\b[^>]*href="([^"]+)"[^>]*>([\s\S]*?)<\/a>/gi;
  let m: RegExpExecArray | null;
  while ((m = re.exec(html))) {
    const href = absolutize(m[1], pageUrl);
    const text = m[2]
      .replace(/<[^>]+>/g, " ")
      .replace(/&amp;/g, "&")
      .replace(/&nbsp;/g, " ")
      .replace(/\s+/g, " ")
      .trim();
    const isDoc =
      /resource-manager\/view|resources\.finalsite\.net|\.pdf(\?|$)|\.xlsx?(\?|$)|drive\.google\.com|tsccmultco\.com\/wp-content/i.test(
        href,
      );
    if (isDoc) out.push({ page, pageUrl, href, text });
  }
  return out;
}

async function main() {
  fs.mkdirSync(HTML_DIR, { recursive: true });
  const all: Harvested[] = [];
  for (const [page, url] of Object.entries(INDEX_PAGES)) {
    process.stdout.write(`${page} … `);
    try {
      const res = await fetch(url, {
        redirect: "follow",
        headers: { "User-Agent": "Mozilla/5.0 (Macintosh)" },
      });
      if (!res.ok) {
        console.log(`HTTP ${res.status}`);
        continue;
      }
      const html = await res.text();
      fs.writeFileSync(path.join(HTML_DIR, `${page}.html`), html);
      const links = extractLinks(html, page, url);
      all.push(...links);
      console.log(`${links.length} doc links`);
    } catch (e) {
      console.log(`FAILED: ${(e as Error).message}`);
    }
  }

  // Dedupe by href, keeping the longest anchor text seen.
  const byHref = new Map<string, Harvested>();
  for (const h of all) {
    const prior = byHref.get(h.href);
    if (!prior || h.text.length > prior.text.length) byHref.set(h.href, h);
  }
  const deduped = [...byHref.values()];

  fs.writeFileSync(
    path.join(OUT_DIR, "harvest.json"),
    JSON.stringify(deduped, null, 2),
  );
  const txt = deduped
    .map((h) => `${h.page}\t${h.text || "(no text)"}\t${h.href}`)
    .join("\n");
  fs.writeFileSync(path.join(OUT_DIR, "harvest.txt"), txt);
  console.log(`\n${deduped.length} unique document links → ${OUT_DIR}/harvest.{json,txt}`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
