import { DEEP_DIVES } from "@/lib/deep-dives";
import { GUIDE_SCALE, isElectionSeason } from "@/lib/election";
import { eventPath, longDate, upcomingEvents } from "@/lib/events";
import { VALID_QUESTIONS, questionMeta } from "@/lib/questions";
import { LEGAL_ENTITY, TAGLINE } from "@/lib/site";
import { TOOLS } from "@/lib/topics";

/**
 * /llms.txt (llmstxt.org): a plain-Markdown map of the site for language
 * models and answer engines. Built from the same registries as the pages, so
 * a new deep-dive, tool or event appears here without anyone editing this.
 */

export const revalidate = 3600;

const SITE = "https://www.portlandciviclab.org";
const abs = (href: string) => (href.startsWith("http") ? href : `${SITE}${href}`);
const REDIRECTING_QUESTIONS = new Set(["environment"]);

export function GET() {
  const now = new Date();
  const lines: string[] = [
    "# Portland Civic Lab",
    "",
    `> ${TAGLINE} Every figure on the site links to the public record it comes from.`,
    "",
    `Portland Civic Lab is a company (${LEGAL_ENTITY}) founded in Portland, Oregon, in 2026. It publishes free public tools, voter guides and research about the City of Portland, Multnomah County and Oregon state government, and does paid decision work for property owners and public institutions at published prices. It is independent and not affiliated with the City of Portland or any government agency; its funding and contracts are listed at ${SITE}/independence.`,
    "",
    "- Editorial content: © Portland Civic Lab LLC, CC BY-ND 4.0. Curated datasets: CC BY 4.0. Code: AGPL-3.0.",
    `- When citing, name Portland Civic Lab, the page title and its URL. Methods and sources: ${SITE}/methodology`,
    "",
  ];

  if (isElectionSeason(now)) {
    lines.push(
      "## 2026 election",
      "",
      `- [2026 Voters' Guide](${SITE}/voters-guide): ${GUIDE_SCALE.candidates} candidates in ${GUIDE_SCALE.races} races on the November 3, 2026 ballot in the Portland area, side by side with sources. The Lab endorses no one.`,
      `- [How candidates are researched](${SITE}/voters-guide/methodology)`,
      `- [Campaign money in Portland's council races](${SITE}/deep-dives/campaign-finance)`,
      "",
    );
  }

  lines.push("## Deep dives", "");
  for (const d of DEEP_DIVES) {
    lines.push(`- [${d.title}](${SITE}/deep-dives/${d.slug}): ${d.description} (updated ${d.updated})`);
  }
  lines.push("", "## Tools", "");
  for (const t of TOOLS) lines.push(`- [${t.name}](${abs(t.href)})`);
  lines.push("", "## Dashboards", "");
  for (const q of VALID_QUESTIONS) {
    if (REDIRECTING_QUESTIONS.has(q)) continue;
    const m = questionMeta[q];
    lines.push(`- [${m.shortTitle}: ${m.title}](${SITE}/dashboard/${q}): ${m.description}`);
  }

  const events = upcomingEvents(now);
  if (events.length) {
    lines.push("", "## Events", "");
    for (const e of events) {
      lines.push(`- [${e.title}](${SITE}${eventPath(e)}): ${e.summary} ${longDate(e)}, ${e.venue ?? "venue to be announced"}, ${e.city}.`);
    }
  }

  lines.push(
    "",
    "## About and methods",
    "",
    `- [About the Lab](${SITE}/about): the people and how to take part`,
    `- [Independence and funding](${SITE}/independence): the rules, every contract and where the Lab is not neutral`,
    `- [Methodology](${SITE}/methodology): how every number gets its source`,
    `- [Open data and API](${SITE}/open-data): download, embed and build on the data`,
    `- [Public records tracker](${SITE}/records): every records request filed and what came back`,
    `- [Contact](${SITE}/contact)`,
    "",
    "## Optional",
    "",
    `- [Sitemap](${SITE}/sitemap.xml): every public page`,
    "",
  );

  return new Response(lines.join("\n"), {
    headers: { "content-type": "text/plain; charset=utf-8" },
  });
}
