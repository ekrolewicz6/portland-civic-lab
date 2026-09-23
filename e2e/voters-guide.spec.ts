import { test, expect, type Page } from "@playwright/test";
import { races } from "../src/lib/voters-guide/published";
import { buildRaceSheet, issues, type IssueId } from "../src/lib/voters-guide/race-sheet";
import { issuesFor, coverageSentence as coverageFor } from "../src/lib/voters-guide/race-sheet/issue-framing";
import { officeOf } from "../src/lib/voters-guide/race-sheet/office";
import { councilDecisions } from "../src/lib/voters-guide/council-decisions";
import { extraTopics } from "../src/lib/voters-guide/race-sheet/topics";

/**
 * The race page: every name once, A–Z, one row each, four cells per row.
 * A cell is a ≤4-word chip over a documented position, or the identical gap
 * button. A chip opens the sentence, its source and the way to the brief.
 * Desktop highlights a column from the header; phones from the chip rail.
 */

const sheets = races.map(buildRaceSheet);
/** The four issues as the race's office frames them: the words on the page, the same ids everywhere. */
const framedFor = (raceId: string) => issuesFor(officeOf(races.find((r) => r.id === raceId)!).group);
const coverageSentence = (raceId: string, issue: IssueId, count: number, total: number) =>
  coverageFor(framedFor(raceId).find((i) => i.id === issue)!, count, total);
const gapName = (raceId: string, name: string, issue: IssueId) =>
  `${name} on ${framedFor(raceId).find((i) => i.id === issue)!.label.toLowerCase()}: not found in the sources we reviewed`;
const words = (text: string) => text.trim().split(/\s+/).filter(Boolean).length;

const rail = (page: Page) => page.locator("[data-race-sheet-rail]").getByRole("group", { name: "Show each candidate's line on" });
const grid = (page: Page) => page.locator("#list table");
const rows = (page: Page) => page.locator("#list tbody tr[id^='row-']");
const row = (page: Page, id: string) => page.locator(`#list tr[id="row-${id}"]`);
const cell = (page: Page, id: string, issue: IssueId) => row(page, id).locator(`td[data-issue="${issue}"]`);
const head = (page: Page, issue: IssueId) => page.locator(`#list thead th[data-issue="${issue}"]`);
const detail = (page: Page, id: string) => page.locator(`#stance-${id}`);
const fits = (page: Page) => page.evaluate(() => document.documentElement.scrollWidth <= innerWidth);

/** A cell is documented when the research object has a position; that is what the chip and the coverage count both derive from. */
const documented = (sheet: (typeof sheets)[number], id: string, issue: IssueId) => sheet.rows.find((r) => r.id === id)!.cells[issue].position !== null;

test("every authored chip sits over a documented position and is at most four words", () => {
  for (const sheet of sheets)
    for (const r of sheet.rows)
      for (const issue of issues) {
        const c = r.cells[issue.id];
        if (c.chip === null) continue;
        expect(c.position, `${sheet.race.id}/${r.id}/${issue.id}: chip "${c.chip}" without a position`).not.toBeNull();
        expect(words(c.chip), `${sheet.race.id}/${r.id}/${issue.id}: "${c.chip}"`).toBeLessThanOrEqual(4);
        expect(c.chip).not.toMatch(/\b(says|said|supports|wants|would|will)\b/i);
      }
  for (const sheet of sheets)
    for (const issue of issues)
      expect(sheet.coverage[issue.id]).toBe(sheet.rows.filter((r) => r.cells[issue.id].position !== null).length);
});

for (const sheet of sheets) {
  const { race } = sheet;
  const total = sheet.rows.length;
  const framed = issuesFor(sheet.office.group);

  test(`${race.id}: every candidate on the checked roster, alphabetical, one row each, with Save and no numeral`, async ({ page }) => {
    await page.goto(`/voters-guide/${race.id}`);
    await expect(rows(page)).toHaveCount(total);
    for (const width of [320, 390, 1280]) {
      await page.setViewportSize({ width, height: width < 700 ? 844 : 900 });
      const ids = await rows(page).evaluateAll((nodes) => nodes.map((n) => n.id.replace(/^row-/, "")));
      expect(ids).toEqual(sheet.rows.map((r) => r.id));
      expect(new Set(ids).size).toBe(race.candidates.length);
      expect(sheet.rows.map((r) => r.name)).toEqual([...sheet.rows.map((r) => r.name)].sort((a, b) => a.localeCompare(b, "en")));
      for (const r of sheet.rows) {
        const tr = row(page, r.id);
        await expect(tr).toHaveCount(1);
        await expect(tr.locator("th[scope=row]")).toHaveCount(1);
        await expect(tr.locator(`#name-${r.id}`)).toHaveText(r.name);
        const text = (await tr.locator("th[scope=row]").innerText()).replace(/\s+/g, " ");
        expect(text).toContain(r.name);
        expect(text.slice(0, text.indexOf(r.name)), `numeral before ${r.name}`).not.toMatch(/\d/);
        expect(text).toContain(r.role);
        const save = tr.getByRole("button", { name: `Save ${r.name} to my ballot`, exact: true });
        await expect(save).toHaveCount(1);
        await expect(save).toHaveAttribute("aria-pressed", "false");
        await expect(tr.locator("td[data-issue]")).toHaveCount(issues.length);
      }
      expect(await fits(page)).toBe(true);
    }
  });

  test(`${race.id}: every cell is a ≤4-word chip over a documented position or the one gap button; header counts equal coverage`, async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 900 });
    await page.goto(`/voters-guide/${race.id}`);
    await expect(rows(page)).toHaveCount(total);
    const gapMarkup = new Set<string>();
    const cells = await page.locator("#list tbody tr[id^='row-'] td[data-issue]").evaluateAll((nodes) =>
      nodes.map((td) => {
        const buttons = [...td.querySelectorAll("button")];
        const b = buttons[0];
        return {
          id: (td.closest("tr") as HTMLElement).id.replace(/^row-/, ""),
          issue: (td as HTMLElement).dataset.issue!,
          buttons: buttons.length,
          label: b?.getAttribute("aria-label"),
          expanded: b?.getAttribute("aria-expanded"),
          text: (b?.textContent ?? "").replace(/\s+/g, " ").trim(),
          inner: b?.innerHTML ?? "",
        };
      }),
    );
    expect(cells).toHaveLength(total * issues.length);
    const seen: Record<IssueId, number> = { housing: 0, safety: 0, money: 0, climate: 0 };
    for (const c of cells) {
      const issue = c.issue as IssueId;
      const r = sheet.rows.find((x) => x.id === c.id)!;
      const where = `${r.id}/${issue}`;
      expect(c.buttons, where).toBe(1);
      expect(c.expanded, where).toBe("false");
      if (documented(sheet, r.id, issue)) {
        seen[issue] += 1;
        expect(c.label, `${where}: a chip carries its own text, not an aria-label`).toBeNull();
        expect(c.text.length, where).toBeGreaterThan(0);
        expect(words(c.text), `${where}: "${c.text}"`).toBeLessThanOrEqual(4);
        const authored = r.cells[issue].chip;
        if (authored) expect(c.text, where).toBe(authored);
        else expect((r.cells[issue].line ?? r.cells[issue].position)!.startsWith(c.text.replace(/…$/, "")), `${where}: fallback "${c.text}"`).toBe(true);
      } else {
        expect(c.label, where).toBe(gapName(race.id, r.name, issue));
        expect(c.text, where).toContain("—");
        gapMarkup.add(c.inner);
      }
    }
    expect(gapMarkup.size, "every gap button has identical markup").toBeLessThanOrEqual(1);
    for (const issue of issues) {
      expect(seen[issue.id]).toBe(sheet.coverage[issue.id]);
      await expect(head(page, issue.id)).toContainText(`${sheet.coverage[issue.id]} of ${total} documented`);
      await expect(page.locator(`#list tbody td[data-issue="${issue.id}"] button:not([aria-label])`)).toHaveCount(sheet.coverage[issue.id]);
    }
    expect(await fits(page)).toBe(true);
  });

  test(`${race.id}: desktop header buttons highlight one column, mirror #issue= and dim the others`, async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 900 });
    await page.goto(`/voters-guide/${race.id}`);
    await expect(rows(page)).toHaveCount(total);
    await expect(rail(page)).toBeHidden();
    await expect(grid(page)).toHaveAttribute("data-active", "");
    const opacity = (id: string, issue: IssueId) => cell(page, id, issue).locator("button").evaluate((el) => getComputedStyle(el).opacity);
    for (const issue of issues) {
      const button = head(page, issue.id).getByRole("button");
      await expect(button).toHaveAttribute("aria-pressed", "false");
      await button.click();
      await expect(button).toHaveAttribute("aria-pressed", "true");
      await expect(page).toHaveURL(new RegExp(`#issue=${issue.id}$`));
      expect(new URL(page.url()).search).toBe("");
      await expect(grid(page)).toHaveAttribute("data-active", issue.id);
      for (const other of issues.filter((o) => o.id !== issue.id)) await expect(head(page, other.id).getByRole("button")).toHaveAttribute("aria-pressed", "false");
      await expect(rows(page)).toHaveCount(total);
      const lit = sheet.rows.find((r) => r.cells[issue.id].position !== null);
      const dimmed = sheet.rows.flatMap((r) => issues.filter((o) => o.id !== issue.id && r.cells[o.id].position !== null).map((o) => [r.id, o.id] as const))[0];
      if (lit) expect(await opacity(lit.id, issue.id)).toBe("1");
      if (dimmed) expect(Number(await opacity(dimmed[0], dimmed[1]))).toBeLessThan(1);
      expect(await fits(page)).toBe(true);
    }
    // Pressing the active header again shows all columns and clears the hash.
    await head(page, "climate").getByRole("button").click();
    await expect(head(page, "climate").getByRole("button")).toHaveAttribute("aria-pressed", "false");
    await expect(grid(page)).toHaveAttribute("data-active", "");
    expect(new URL(page.url()).hash).toBe("");
    // A deep link lands with the column already highlighted.
    await page.goto(`/voters-guide/${race.id}#issue=money`);
    await expect(head(page, "money").getByRole("button")).toHaveAttribute("aria-pressed", "true");
    await expect(grid(page)).toHaveAttribute("data-active", "money");
  });

  test(`${race.id}: on a phone the rail highlights a column, mirrors #issue= and states the coverage`, async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto(`/voters-guide/${race.id}`);
    await expect(rows(page)).toHaveCount(total);
    const status = page.locator("[data-race-sheet-rail] [role=status]");
    await expect(status).toHaveText(`${total} candidates, A–Z. Tap any position to read the sentence, how they would deliver it, and the source.`);
    const chips = rail(page).locator("button[aria-pressed]");
    await expect(chips.first()).toHaveText("All");
    await expect(chips).toHaveText(["All", ...framed.map((i) => i.short)]);
    await expect(rail(page).getByRole("button", { name: "All", exact: true })).toHaveAttribute("aria-pressed", "true");
    // The column headers are for the table's semantics only on phones.
    expect(await page.locator("#list thead").evaluate((el) => el.getBoundingClientRect().width)).toBeLessThanOrEqual(1);
    for (const issue of framed) {
      await rail(page).getByRole("button", { name: issue.short, exact: true }).click();
      await expect(rail(page).getByRole("button", { name: issue.short, exact: true })).toHaveAttribute("aria-pressed", "true");
      await expect(page).toHaveURL(new RegExp(`#issue=${issue.id}$`));
      expect(new URL(page.url()).search).toBe("");
      await expect(grid(page)).toHaveAttribute("data-active", issue.id);
      await expect(rows(page)).toHaveCount(total);
      await expect(status).toHaveText(coverageSentence(race.id, issue.id, sheet.coverage[issue.id], total));
      // The question the chip asks sits above the coverage line.
      await expect(page.locator("[data-race-sheet-rail]")).toContainText(issue.question);
      expect(sheet.coverage[issue.id]).toBe(sheet.rows.filter((r) => r.cells[issue.id].position !== null).length);
      // A pressed chip shows one column: only that tile is visible on every card, full width.
      const first = sheet.rows[0];
      for (const other of issues) {
        const td = cell(page, first.id, other.id);
        if (other.id === issue.id) await expect(td).toBeVisible();
        else await expect(td).toBeHidden();
      }
      expect(await fits(page)).toBe(true);
    }
    await rail(page).getByRole("button", { name: "All", exact: true }).click();
    expect(new URL(page.url()).hash).toBe("");
    await expect(grid(page)).toHaveAttribute("data-active", "");
    await expect(status).toHaveText(`${total} candidates, A–Z. Tap any position to read the sentence, how they would deliver it, and the source.`);
    await expect(rows(page)).toHaveCount(total);
  });
}

test("the two missing states share one visual treatment on the row and four gap cells", async ({ page }) => {
  const classes: string[] = [];
  for (const [raceId, id, label] of [["portland-district-3", "darren-mccormick", "Filing statement only"], ["portland-district-4", "john-j-goldsmith", "No platform found"]]) {
    await page.goto(`/voters-guide/${raceId}`);
    const tag = row(page, id).locator("th[scope=row]").getByText(label, { exact: true });
    await expect(tag).toBeVisible();
    classes.push((await tag.getAttribute("class")) ?? "");
    const sheet = sheets.find((s) => s.race.id === raceId)!;
    const r = sheet.rows.find((x) => x.id === id)!;
    for (const issue of issues) if (!r.cells[issue.id].position) await expect(cell(page, id, issue.id).getByRole("button", { name: gapName(raceId, r.name, issue.id), exact: true })).toHaveCount(1);
    await page.getByRole("button", { name: "Rent and homes", exact: true }).click();
    await expect(tag).toBeVisible();
  }
  expect(classes[0]).not.toBe("");
  expect(classes[0]).toBe(classes[1]);
});

for (const width of [390, 1280]) {
  test(`at ${width} a chip opens the sentence with its source chip and the Full brief link; a second chip swaps it; a gap explains itself`, async ({ page }) => {
    const sheet = sheets.find((s) => s.race.id === "portland-district-3")!;
    const r = sheet.rows.find((x) => x.id === "esther-leon")!;
    expect(r.cells.housing.position).not.toBeNull();
    await page.setViewportSize({ width, height: 844 });
    await page.goto("/voters-guide/portland-district-3#issue=housing");
    await expect(grid(page)).toHaveAttribute("data-active", "housing");
    await expect(detail(page, "esther-leon")).toHaveCount(0);
    const chip = cell(page, "esther-leon", "housing").getByRole("button");
    await expect(chip).toHaveAttribute("aria-expanded", "false");
    await chip.click();
    await expect(chip).toHaveAttribute("aria-expanded", "true");
    await expect(chip).toHaveAttribute("aria-controls", "stance-esther-leon");
    const open = detail(page, "esther-leon");
    await expect(open).toBeVisible();
    await expect(open).toHaveAttribute("data-issue", "housing");
    expect(await open.evaluate((el) => el.closest("tr")?.previousElementSibling?.id)).toBe("row-esther-leon");
    await expect(open).toContainText("Esther León on rent and homes");
    await expect(open).toContainText("Said:");
    // The detail is the ladder: the full position as "What", then How and Measured by.
    await expect(open).toContainText(r.cells.housing.position!);
    await expect(open.locator("dl dt")).toHaveText(["What", "How", "Measured by"]);
    const source = r.cells.housing.source!;
    // The What rung's source; How and Measured by may cite the same venue.
    const sourceChip = open.locator("dl dd").first().getByRole("button", { name: source.label });
    await expect(sourceChip).toHaveAttribute("aria-expanded", "false");
    await sourceChip.click();
    await expect(sourceChip).toHaveAttribute("aria-expanded", "true");
    const expanded = page.locator(`[id="${await sourceChip.getAttribute("aria-controls")}"]`);
    await expect(expanded).toContainText(`${source.evidence.kind} · ${source.evidence.date}`);
    if (source.evidence.note) await expect(expanded).toContainText(source.evidence.note);
    await expect(expanded.getByRole("link")).toHaveAttribute("href", source.url);
    await expect(open.getByRole("link", { name: "Full brief" })).toHaveAttribute("href", "/voters-guide/portland-district-3/esther-leon");
    expect(await fits(page)).toBe(true);

    // Another chip on the same row swaps the detail; only one is ever open.
    // On a phone a pressed rail chip shows one column, so show all columns first.
    if (width < 769) await rail(page).getByRole("button", { name: "All", exact: true }).click();
    const second = issues.find((i) => i.id !== "housing" && r.cells[i.id].position !== null)!;
    await cell(page, "esther-leon", second.id).getByRole("button").click();
    await expect(chip).toHaveAttribute("aria-expanded", "false");
    await expect(page.locator("#list [id^='stance-']")).toHaveCount(1);
    await expect(detail(page, "esther-leon")).toHaveAttribute("data-issue", second.id);
    await expect(detail(page, "esther-leon")).toContainText(r.cells[second.id].position!);
    await expect(detail(page, "esther-leon").getByRole("link", { name: "Full brief" })).toHaveAttribute("href", "/voters-guide/portland-district-3/esther-leon");
    await detail(page, "esther-leon").getByRole("button", { name: "Close", exact: true }).click();
    await expect(detail(page, "esther-leon")).toHaveCount(0);

    // A gap cell opens the same detail frame and names the gap as a gap.
    const gap = sheet.rows.flatMap((x) => issues.filter((i) => x.cells[i.id].position === null).map((i) => ({ row: x, issue: i })))[0];
    expect(gap).toBeDefined();
    await cell(page, gap.row.id, gap.issue.id).getByRole("button", { name: gapName("portland-district-3", gap.row.name, gap.issue.id), exact: true }).click();
    await expect(detail(page, gap.row.id)).toContainText("Not found in the sources we reviewed. That is a research gap, not a position.");
    await expect(detail(page, gap.row.id).getByRole("link", { name: "Full brief" })).toHaveAttribute("href", `/voters-guide/portland-district-3/${gap.row.id}`);
    expect(await fits(page)).toBe(true);
  });
}

test("keir-legree: four documented chips on the grid, four positions and both replies' answers on the brief", async ({ page }) => {
  const sheet = sheets.find((s) => s.rows.some((r) => r.id === "keir-legree"))!;
  const r = sheet.rows.find((x) => x.id === "keir-legree")!;
  for (const issue of issues) {
    expect(r.cells[issue.id].position, issue.id).not.toBeNull();
    expect(r.cells[issue.id].chip, issue.id).not.toBeNull();
  }
  // Five answers from his September 19 reply, seven from his September 22 reply.
  expect(r.answers).toHaveLength(12);
  expect(r.answers.filter((a) => a.received === "2026-09-19")).toHaveLength(5);
  expect(r.answers.filter((a) => a.received === "2026-09-22")).toHaveLength(7);
  await page.setViewportSize({ width: 1280, height: 900 });
  await page.goto(`/voters-guide/${sheet.race.id}`);
  for (const issue of issues) await expect(cell(page, "keir-legree", issue.id).getByRole("button")).toHaveText(r.cells[issue.id].chip!);
  await page.goto(`/voters-guide/${sheet.race.id}/keir-legree`);
  await expect(page.getByRole("heading", { level: 1 })).toHaveText(r.name);
  const stand = page.locator('section[aria-labelledby="keir-legree-stand"]');
  for (const issue of issues) await expect(stand).toContainText(r.cells[issue.id].position!);
  await expect(stand.getByText("Not found in the sources we reviewed. That is a research gap, not a position.")).toHaveCount(0);
  const wordsSection = page.locator('section[aria-labelledby="keir-legree-words"]');
  await expect(wordsSection.getByRole("heading", { level: 2 })).toHaveText("Their answers to our questions");
  await expect(wordsSection.locator("blockquote")).toHaveCount(12);
  for (const a of r.answers) {
    await expect(wordsSection).toContainText(a.question);
    await expect(wordsSection).toContainText(a.text);
  }
  await expect(wordsSection.getByText("Received 2026-09-19", { exact: true })).toHaveCount(5);
  await expect(wordsSection.getByText("Received 2026-09-22", { exact: true })).toHaveCount(7);
});

test("share yields a URL with no query string and at most #issue=", async ({ page }) => {
  await page.addInitScript(() => {
    Object.defineProperty(navigator, "share", { value: undefined, configurable: true });
    Object.defineProperty(navigator, "clipboard", { value: { writeText: async (value: string) => { (window as unknown as { copied: string }).copied = value; } }, configurable: true });
  });
  await page.setViewportSize({ width: 1280, height: 900 });
  await page.goto("/voters-guide/portland-district-4");
  await page.getByRole("button", { name: "Save Eli Arnold to my ballot", exact: true }).click();
  await page.getByRole("button", { name: "Share this list", exact: true }).click();
  const copied = () => page.evaluate(() => (window as unknown as { copied: string }).copied);
  let url = new URL(await copied());
  expect(url.search).toBe("");
  expect(url.hash).toBe("");
  await head(page, "money").getByRole("button").click();
  await page.getByRole("button", { name: "Share the money view", exact: true }).click();
  url = new URL(await copied());
  expect(url.search).toBe("");
  expect(url.hash).toBe("#issue=money");
  expect(url.href).not.toContain("eli-arnold");
});

test("no horizontal overflow at 320, 390, 768 and 1280 on the race page, with a detail open, and on a brief", async ({ page }) => {
  await page.goto("/voters-guide/portland-district-3#issue=housing");
  await expect(rows(page)).not.toHaveCount(0);
  for (const width of [320, 390, 768, 1280]) {
    await page.setViewportSize({ width, height: 844 });
    expect(await fits(page), `race page at ${width}`).toBe(true);
    const chip = cell(page, "esther-leon", "housing").getByRole("button");
    await chip.click();
    await expect(detail(page, "esther-leon")).toBeVisible();
    expect(await fits(page), `race page with a detail open at ${width}`).toBe(true);
    await chip.click();
    await expect(detail(page, "esther-leon")).toHaveCount(0);
  }
  await page.goto("/voters-guide/portland-district-3/heart-free-pham");
  for (const width of [320, 390, 768, 1280]) {
    await page.setViewportSize({ width, height: 844 });
    expect(await fits(page), `brief at ${width}`).toBe(true);
  }
});

/* ── Topic boards and the promise ladder ───────────────────────────── */

const boards = (page: Page) => page.locator("#topics");
const board = (page: Page, id: string) => page.locator(`#topic-${id}`);
const boardRow = (page: Page, topicId: string, id: string) => page.locator(`#topic-${topicId}-${id}`);
const jump = (page: Page) => page.locator("[data-race-sheet-rail]").getByRole("link", { name: /more choices/ });

test("desktop: each Council choice is a board beneath the grid; opening one lists every candidate A–Z with a vote, a sourced reading or the gap, and the hash mirrors it", async ({ page }) => {
  const sheet = sheets.find((s) => s.race.id === "portland-district-4")!;
  const moda = extraTopics.find((t) => t.id === "moda")!;
  const taxes = extraTopics.find((t) => t.id === "new-taxes")!;
  const decision = councilDecisions.find((d) => d.id === moda.decisionId)!;
  await page.setViewportSize({ width: 1280, height: 900 });
  await page.goto("/voters-guide/portland-district-4");
  // The grid is four columns and never scrolls sideways; the boards sit beneath it.
  await expect(page.locator('#list thead th[data-issue]')).toHaveCount(issues.length);
  await expect(jump(page)).toHaveAttribute("href", "#topics");
  await expect(jump(page)).toContainText(`${extraTopics.length} more choices`);
  await expect(boards(page).getByRole("heading", { level: 2 })).toHaveText("Eight choices this Council has faced");
  const all = boards(page).locator("details[data-topic]");
  await expect(all).toHaveCount(extraTopics.length);
  expect(await all.evaluateAll((nodes) => nodes.map((n) => n.getAttribute("data-topic")))).toEqual(extraTopics.map((t) => t.id));
  await expect(boards(page).locator("details[data-topic][open]")).toHaveCount(0);
  for (const t of extraTopics) {
    await expect(board(page, t.id).locator("summary")).toContainText(t.label);
    await expect(board(page, t.id).locator("summary")).toContainText(t.question);
    const onRecord = sheet.rows.filter((x) => x.topicCells[t.id].vote || x.topicCells[t.id].chip).length;
    await expect(board(page, t.id).locator("summary")).toContainText(`${onRecord} of ${sheet.rows.length} on record`);
  }

  await board(page, moda.id).locator("summary").click();
  await expect(board(page, moda.id)).toHaveAttribute("open", "");
  await expect(page).toHaveURL(/#topics=moda$/);
  await expect(board(page, moda.id)).toContainText(moda.context);
  const ids = await board(page, moda.id).locator("li[id^='topic-moda-']").evaluateAll((nodes) => nodes.map((n) => n.id.replace(/^topic-moda-/, "")));
  expect(ids).toEqual(sheet.rows.map((r) => r.id));
  for (const r of sheet.rows) {
    const li = boardRow(page, moda.id, r.id);
    const tc = r.topicCells[moda.id];
    await expect(li.getByRole("link", { name: r.name, exact: true })).toHaveAttribute("href", `/voters-guide/portland-district-4/${r.id}`);
    if (r.incumbent) {
      expect(tc.vote, `${r.id} is an incumbent on a decision topic`).toBe(decision.votes[r.name] ?? null);
      if (tc.vote) {
        await expect(li).toContainText(tc.vote);
        await expect(li).toContainText("Recorded vote");
        await expect(li).toContainText(decision.voteLabel ?? decision.title);
      }
    } else {
      expect(tc.vote, `${r.id} is a challenger and can hold no vote`).toBeNull();
    }
    if (tc.chip) {
      await expect(li).toContainText(tc.chip);
      await expect(li).toContainText(tc.text!);
      await expect(li.getByRole("button", { name: new RegExp(`^${tc.source!.label.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}`) })).toBeVisible();
      if (tc.stance === "partial") await expect(li).toContainText("the exact choice is unsaid");
    } else if (!tc.vote) {
      await expect(li).toContainText("Not found");
      await expect(li).toContainText("a research gap, not a position");
    }
  }
  expect(await fits(page)).toBe(true);

  // A second board opens beside the first; the hash carries both, in the order opened.
  await board(page, taxes.id).locator("summary").click();
  await expect(page).toHaveURL(/#topics=moda,new-taxes$/);
  // Open all, then close all.
  await boards(page).getByRole("button", { name: /^Open all \d+$/ }).click();
  await expect(boards(page).locator("details[data-topic][open]")).toHaveCount(extraTopics.length);
  await expect(jump(page)).toContainText(`${extraTopics.length} open`);
  expect(await fits(page)).toBe(true);
  await boards(page).getByRole("button", { name: "Close all", exact: true }).click();
  await expect(boards(page).locator("details[data-topic][open]")).toHaveCount(0);
  expect(new URL(page.url()).hash).toBe("");

  // Highlighting an issue keeps the open boards; the share fragment carries both and nothing else.
  await board(page, moda.id).locator("summary").click();
  await head(page, "money").getByRole("button").click();
  await expect(page).toHaveURL(/#issue=money&topics=moda$/);
  await board(page, moda.id).locator("summary").click();
  await expect(page).toHaveURL(/#issue=money$/);

  // The hash restores the view on load, and a board's own id opens it.
  await page.goto("/voters-guide/portland-district-4#topics=moda,police-staffing");
  await expect(board(page, "moda")).toHaveAttribute("open", "");
  await expect(board(page, "police-staffing")).toHaveAttribute("open", "");
  await expect(boards(page).locator("details[data-topic][open]")).toHaveCount(2);
  // A board's own id opens it: on a hash change it joins the open set; on a fresh load it is the only one.
  await page.goto("/voters-guide/portland-district-4#topic-water-rates");
  await expect(board(page, "water-rates")).toHaveAttribute("open", "");
  await expect(boards(page).locator("details[data-topic][open]")).toHaveCount(3);
  await page.reload();
  await expect(board(page, "water-rates")).toHaveAttribute("open", "");
  await expect(boards(page).locator("details[data-topic][open]")).toHaveCount(1);
});

test("phone: a board lists every candidate without overflow, and topics no longer sit inside the cards", async ({ page }) => {
  const sheet = sheets.find((s) => s.race.id === "portland-district-3")!;
  const moda = extraTopics.find((t) => t.id === "moda")!;
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/voters-guide/portland-district-3#topics=moda");
  await expect(rows(page)).toHaveCount(sheet.rows.length);
  await expect(page.locator('#list td[data-issue="topic"]')).toHaveCount(0);
  await expect(board(page, moda.id)).toHaveAttribute("open", "");
  await expect(board(page, moda.id)).toContainText(moda.question);
  await expect(board(page, moda.id).locator("li[id^='topic-moda-']")).toHaveCount(sheet.rows.length);
  expect(await fits(page)).toBe(true);
});

test("the ladder asks the same three questions of every candidate, on the grid detail and on the brief, and a missing rung is a gap", async ({ page }) => {
  const sheet = sheets.find((s) => s.race.id === "portland-district-3")!;
  const r = sheet.rows.find((x) => x.id === "esther-leon")!;
  await page.setViewportSize({ width: 1280, height: 900 });
  await page.goto("/voters-guide/portland-district-3");
  await cell(page, "esther-leon", "housing").getByRole("button").click();
  const open = detail(page, "esther-leon");
  const labels = open.locator("dl dt");
  await expect(labels).toHaveText(["What", "How", "Measured by"]);
  const ladder = r.ladder.housing;
  for (const [rung, i] of [[ladder.how, 1], [ladder.measure, 2]] as const) {
    const body = open.locator("dl dd").nth(i);
    if (rung) {
      await expect(body).toContainText(rung.text);
      await expect(body.getByRole("button", { name: rung.source.label })).toBeVisible();
    } else {
      await expect(body).toContainText("Not in their sources");
    }
  }
  // The brief carries the identical ladder under each documented position.
  await page.goto("/voters-guide/portland-district-3/esther-leon");
  const stand = page.locator('section[aria-labelledby="esther-leon-stand"]');
  const documentedIssues = issues.filter((i) => r.cells[i.id].position);
  await expect(stand.locator("dl")).toHaveCount(documentedIssues.length);
  await expect(stand.locator("dl dt").filter({ hasText: /^How$/ })).toHaveCount(documentedIssues.length);
  await expect(stand.locator("dl dt").filter({ hasText: /^Measured by$/ })).toHaveCount(documentedIssues.length);
  expect(await fits(page)).toBe(true);
});

test("my ballot and the shared view introduce a candidate by their four chips, never by a sentence we chose", async ({ page }) => {
  const sheet = sheets.find((s) => s.race.id === "portland-district-4")!;
  const r = sheet.rows.find((x) => x.id === "eli-arnold")!;
  await page.setViewportSize({ width: 1280, height: 900 });
  await page.goto("/voters-guide/portland-district-4");
  await page.getByRole("button", { name: "Save Eli Arnold to my ballot", exact: true }).click();
  await page
    .locator("[data-race-sheet-bar]")
    .getByRole("button", { name: /My ballot/ })
    .or(page.locator("[data-race-sheet-tray]").getByRole("button"))
    .filter({ visible: true })
    .first()
    .click();
  const dialog = page.getByRole("dialog", { name: "My ballot" });
  const chips = dialog.getByRole("list", { name: "Eli Arnold: where they stand" });
  await expect(chips.locator(":scope > li")).toHaveCount(4);
  for (const issue of issues) {
    const c = r.cells[issue.id].chip;
    if (c) await expect(chips).toContainText(c);
  }
  const summaryStart = r.summary.split(/\s+/).slice(0, 6).join(" ");
  await expect(dialog).not.toContainText(summaryStart);
});
