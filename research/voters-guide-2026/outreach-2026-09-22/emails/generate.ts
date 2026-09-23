/**
 * Draft one follow-up email per campaign from the same data the race pages
 * render, so every question is a gap the page actually shows. Output: one
 * markdown file per race under research/voters-guide-2026/outreach-2026-09-22/emails/
 * plus a README with the send list. Nothing is sent.
 */
import { mkdirSync, writeFileSync } from "node:fs";
import { races } from "@/lib/voters-guide/published";
import { buildRaceSheet, topicsFor, issuesFor, type SheetRow } from "@/lib/voters-guide/race-sheet";
import { officeOf, GROUP_ORDER } from "@/lib/voters-guide/race-sheet/office";

const OUT = "research/voters-guide-2026/outreach-2026-09-22/emails";
mkdirSync(OUT, { recursive: true });

/** Council candidates who answered the September 19 email; the note acknowledges it. */
const REPLIED: Record<string, string> = {
  "timothy-tj-anderson": "your reply on September 19",
  "cristal-otero": "your reply on September 19",
  "eli-arnold": "your reply on September 20",
  "steve-novick": "Katie Shriver’s reply with your answers on September 21",
  "tom-sollitt": "your reply on September 22",
  "john-sweeney": "your reply on September 22",
};

const SITE = "https://www.portlandciviclab.org";
const firstName = (name: string) => name.replace(/\(.*?\)\s*/g, "").split(/\s+/)[0];
/** The page asks about "them"; the email asks "you". */
const second = (q: string) => q.replace(/\bdo they\b/g, "do you").replace(/\bwould they\b/g, "would you").replace(/\bthey\b/g, "you").replace(/\btheir\b/g, "your");

/** A campaign that answers through a staffer: greet them, and say the questions are for the candidate. */
const VIA: Record<string, string> = { "steve-novick": "Katie" };

function channelLine(row: SheetRow, council: boolean) {
  if (REPLIED[row.id]) return { to: "reply", how: `reply to the existing thread (${REPLIED[row.id]})` };
  const ch = row.contact.channels;
  const email = ch.find((c) => c.kind === "email");
  const form = ch.find((c) => c.kind === "form");
  const site = ch.find((c) => c.kind === "website");
  const social = ch.filter((c) => c.kind === "social");
  if (email) return { to: email.label, how: `email ${email.label}` };
  if (form) return { to: form.url, how: `contact form ${form.url}` };
  if (site) return { to: site.url, how: `site ${site.url} (no email or form published; look for a contact page before sending)` };
  if (social.length) return { to: social[0].url, how: `${social[0].label} message ${social[0].url} (no email or form published)` };
  if (council) return { to: "ledger", how: `no public channel on the page (${row.contact.none ?? "none found"}); use the address from the September 19 ledger (City contact list), which stays out of the guide` };
  return { to: "", how: `no public channel: ${row.contact.none ?? "none found"}` };
}

function questionsFor(row: SheetRow, raceId: string) {
  const race = races.find((r) => r.id === raceId)!;
  const office = officeOf(race);
  const issues = issuesFor(office.group);
  const topics = topicsFor(race);
  const out: { heading: string; items: string[] }[] = [];

  // 1. The four issues: a missing position, or a position without its how / measured-by rung.
  const issueItems: string[] = [];
  for (const issue of issues) {
    const cell = row.cells[issue.id];
    const ladder = row.ladder[issue.id];
    if (!cell.position) {
      // An auditor, sheriff, clerk or treasurer sets no policy on the four issues; ask only about what they have said.
      if (!["auditor", "sheriff", "clerk", "treasurer"].includes(office.memberWord)) issueItems.push(`**${issue.label}.** ${second(issue.question)}`);
      continue;
    }
    const what = cell.chip ?? cell.line ?? cell.position;
    const missing: string[] = [];
    if (!ladder.how) missing.push("how you would deliver it (the funding source, rule change, staffing, sequencing or partner)");
    if (!ladder.measure) missing.push("what number, deadline or visible result would show it worked");
    if (missing.length) issueItems.push(`**${issue.label}.** Your page shows “${what}.” We could not find ${missing.join(", or ")}.`);
  }
  if (issueItems.length) out.push({ heading: "The four issues every race page tracks", items: issueItems });

  // 2. The office's own choices: no statement, or a statement that does not reach the exact choice.
  const gapItems: string[] = [];
  const partialItems: string[] = [];
  const voteOnly: string[] = [];
  for (const t of topics) {
    const tc = row.topicCells[t.id];
    if (tc.chip && tc.stance === "partial") {
      partialItems.push(`**${t.label}.** ${t.question} (Your page carries “${tc.chip}” from your published statement; it does not say which way you come down on this choice.)`);
    } else if (tc.vote && !tc.chip) {
      voteOnly.push(`**${t.label}.** Your recorded vote (${tc.vote}) is on the page; a sentence on the reasoning would appear beside it in your words.`);
    } else if (!tc.chip && !tc.vote) {
      gapItems.push(`**${t.label}.** ${t.question}`);
    }
  }
  if (partialItems.length) out.push({ heading: "Choices your published statements come close to", items: partialItems });
  if (gapItems.length) out.push({ heading: "Choices we found no statement on", items: gapItems });
  if (voteOnly.length) out.push({ heading: "Recorded votes without a statement", items: voteOnly });
  return { out, office, topics, issues };
}

/** Whose choices the boards are, in the page's own words. */
const whose = (office: ReturnType<typeof officeOf>) =>
  office.group === "state"
    ? `the next ${office.memberWord} faces`
    : office.group === "legislature"
      ? "the 2027 Legislature faces"
      : office.group === "federal"
        ? "Congress faces"
        : office.group === "county"
          ? `${office.body} faces`
          : `the ${office.body} faces`;

function email(row: SheetRow, raceId: string) {
  const race = races.find((r) => r.id === raceId)!;
  const { out, office, topics } = questionsFor(row, raceId);
  const page = `${SITE}/voters-guide/${raceId}/${row.id}`;
  const boards = `${SITE}/voters-guide/${raceId}#topics`;
  const council = office.group === "council";
  const replied = REPLIED[row.id];
  const seat = office.seat;
  const n = out.reduce((s, g) => s + g.items.length, 0);
  const onRecord = topics.filter((t) => row.topicCells[t.id].chip || row.topicCells[t.id].vote).length;

  const opening = council
    ? replied
      ? `Thank you for ${replied}; it is on your page in your own words, and the research log records it. Since then we have added every choice this Council has faced to the ${office.short} page, with each candidate’s statement or the gap beside it.`
      : `I emailed on September 19 with a first set of questions for your page in our nonpartisan voters guide. Since then we have added every choice this Council has faced to the ${office.short} page, with each candidate’s statement or the gap beside it, so this is the shorter list that remains.`
    : `I run Portland Civic Lab, a nonpartisan, volunteer research project publishing a voters guide for every race on the November 3 ballot. Your page is at ${page}. It is built only from your published words (your filed statement, your site and public statements) and the public record, the same way for every candidate, with a source on every line. It carries no endorsements, rankings or scores. The race page also has a board for each live choice ${whose(office)}, with every candidate’s statement or a gap: ${boards}.`;

  const ask =
    n === 0
      ? `Your page has a published position on each issue and a statement on every choice we track (${onRecord} of ${topics.length}). If anything on it is wrong or out of date, tell me and I will fix it with a note in the research log.`
      : `Right now the page shows ${onRecord} of ${topics.length} choices on record for you. A gap on a page is a research gap, not a position, and it says so, but readers do compare. The questions below are the gaps. A sentence or two on any of them is enough; we quote or paraphrase with a date and attribute it to your campaign, and we never fill a gap from a general goal.`;

  const lines: string[] = [];
  lines.push(`Subject: Portland Civic Lab voters guide: ${row.name}, ${seat}`);
  lines.push("");
  const via = VIA[row.id];
  lines.push(`Hi ${via ?? firstName(row.name)},`);
  lines.push("");
  lines.push(
    via
      ? `Thank you for your reply with ${firstName(row.name)}’s answers on September 21; they are on his page in his own words, and the research log records them. Since then we have added every choice this Council has faced to the ${office.short} page, with each candidate’s statement or the gap beside it.`
      : opening,
  );
  lines.push("");
  lines.push(via ? ask.replace("on record for you", `on record for ${firstName(row.name)}`) + ` The questions are phrased to ${firstName(row.name)}.` : ask);
  let k = 0;
  for (const group of out) {
    lines.push("");
    lines.push(group.heading);
    for (const item of group.items) {
      k += 1;
      lines.push(`${k}. ${item.replace(/\*\*/g, "")}`);
    }
  }
  lines.push("");
  lines.push(
    council
      ? `If any line on your page is wrong, out of date or unfair, say so and I will correct it and note the change in the research log. Thanks for your time.`
      : `If any line on your page is wrong, out of date or unfair, say so and I will correct it and note the change in the research log. Anything you send on the record we treat the same as we treat every campaign’s statements. Thanks for your time.`,
  );
  lines.push("");
  lines.push("Edan Krolewicz");
  lines.push("Portland Civic Lab");
  lines.push("edan@portlandciviclab.org");
  return { text: lines.join("\n"), n, onRecord, total: topics.length };
}

const index: string[] = [];
index.push("# Follow-up emails to every campaign (drafted September 22, 2026)");
index.push("");
index.push("Sent the evening of September 22; what went out, what was held and the replies so far are in [SENT.md](SENT.md).");
index.push("");
index.push("One draft per campaign, generated from the same data the race pages render, so each question is a gap the page shows today: a missing position on one of the four issues, a position without its how or measured-by rung, a choice with no statement, a statement that does not reach the exact choice (shown as partial), or a recorded vote without a statement.");
index.push("");
index.push("Before sending to a Council candidate, check the September 19 ledger (`runtime-data/voters-guide-2026/outreach/`) and Gmail Sent; the four who replied are acknowledged by name. No other campaign has been contacted; their drafts open with an introduction. Contact channels come from each candidate’s pamphlet statement, filing or site and are already shown on their page. Keep replies on the record, attribute them, and log material changes.");
index.push("");
index.push("| Race | Candidate | Send via | On record | Questions | File |");
index.push("| --- | --- | --- | ---: | ---: | --- |");

let totalQ = 0;
let totalC = 0;
for (const group of GROUP_ORDER) {
  for (const race of races.filter((r) => officeOf(r).group === group)) {
    const sheet = buildRaceSheet(race);
    const office = officeOf(race);
    const file = `${race.id}.md`;
    const body: string[] = [];
    body.push(`# ${office.seat}: follow-up emails (drafted September 22, 2026; nothing sent)`);
    body.push("");
    body.push(`Race page: ${SITE}/voters-guide/${race.id} · boards: ${SITE}/voters-guide/${race.id}#topics`);
    body.push("");
    for (const row of sheet.rows) {
      const { to, how } = channelLine(row, office.group === "council");
      const e = email(row, race.id);
      totalQ += e.n;
      totalC += 1;
      body.push(`## ${row.name}`);
      body.push("");
      body.push(`Send via: ${how}`);
      body.push("");
      body.push("```text");
      body.push(e.text);
      body.push("```");
      body.push("");
      index.push(`| ${office.seat} | ${row.name} | ${to === "reply" ? "reply to thread" : to === "ledger" ? "September 19 ledger address" : to ? how.split(" ")[0] + " " + to : "none"} | ${e.onRecord}/${e.total} | ${e.n} | [${file}](${file}) |`);
    }
    writeFileSync(`${OUT}/${file}`, body.join("\n"));
  }
}
index.push("");
index.push(`Totals: ${totalC} campaigns, ${totalQ} questions.`);
writeFileSync(`${OUT}/README.md`, index.join("\n") + "\n");
console.log("campaigns", totalC, "questions", totalQ);
