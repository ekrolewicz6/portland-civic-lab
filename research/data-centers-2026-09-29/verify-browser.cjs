const { chromium, expect } = require("@playwright/test");
const fs = require("node:fs");
const path = require("node:path");

(async () => {
  const base = process.env.DC_PREVIEW_URL || "http://127.0.0.1:3165";
  const output = process.env.DC_VERIFY_OUTPUT || "/tmp/data-centers-verification";
  fs.mkdirSync(output, { recursive: true });
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1440, height: 1000 }, acceptDownloads: true });
  const errors = [];
  const failures = [];
  page.on("pageerror", e => errors.push(e.message));
  page.on("console", m => { if (m.type() === "error") errors.push(m.text()); });
  page.on("response", r => { if (r.url().startsWith(base) && r.status() >= 400) failures.push({ status: r.status(), url: r.url() }); });
  try {
    await page.goto(base + "/deep-dives/data-centers", { waitUntil: "networkidle" });
    await expect(page.getByRole("heading", { level: 1 })).toContainText("Oregon built the cloud");
    await expect(page.locator("[data-nextjs-dialog]")).toHaveCount(0);
    const calculator = page.getByTestId("deal-calculator");
    const result = page.getByTestId("net-result");
    const field = name => calculator.getByRole("spinbutton", { name, exact: true });
    const amount = () => result.innerText();
    const ledgerValue = label => calculator.locator("dl > div").filter({ has: page.getByText(label, { exact: true }) }).locator("dd");
    const initial = await amount();
    await expect(result).toHaveText("−$8.5M");
    await expect(ledgerValue("Included state income tax if built")).toHaveText("$0.0M");
    await calculator.getByRole("button", { name: "Combined Oregon receipts", exact: true }).click();
    await expect(result).not.toHaveText(initial);
    await expect(ledgerValue("Included state income tax if built")).not.toHaveText("$0.0M");
    await calculator.getByRole("button", { name: "Local public receipts", exact: true }).click();
    await expect(result).toHaveText(initial);

    await field("Build probability without break (%)").fill("0");
    await expect(result).toHaveText("$124.2M");
    await field("Build probability without break (%)").fill("100");
    await expect(result).toHaveText("−$141.2M");
    await field("Build probability with deal (%)").fill("0");
    await expect(result).toHaveText("−$265.4M");
    await calculator.getByRole("button", { name: "Reset assumptions" }).click();
    await field("Analysis horizon (years)").fill("15");
    await expect(ledgerValue("Included post-abatement property tax")).toHaveText("$0.0M");
    await field("Analysis horizon (years)").fill("30");
    await expect(ledgerValue("Included post-abatement property tax")).not.toHaveText("$0.0M");

    await field("Assumed taxable value ($M)").fill("600");
    await calculator.getByRole("combobox", { name: "Payments during abatement" }).selectOption("share");
    await field("Minimum annual payment ($M)").fill("3");
    const downloadPromise = page.waitForEvent("download");
    await calculator.getByRole("button", { name: "Download cash flows (CSV)" }).click();
    const download = await downloadPromise;
    const csvPath = path.join(output, download.suggestedFilename());
    await download.saveAs(csvPath);
    const csv = fs.readFileSync(csvPath, "utf8");
    expect(csv).toContain("ledger=local");
    expect(csv).toContain('"minimumPaymentM":3');
    const rows = csv.split("\n").filter(line => /^\d+,/.test(line));
    expect(rows).toHaveLength(30);
    const first = rows[0].split(",").map(Number);
    expect(first[1]).toBeCloseTo(6.6);
    expect(first[2]).toBeCloseTo(3.3);

    await calculator.locator("summary").filter({ hasText: "Adjust costs" }).click();
    await field("Annual incremental public costs ($M)").fill("100");
    await expect(calculator).toContainText("No standard threshold");
    await calculator.getByRole("button", { name: "Reset assumptions" }).click();
    await expect(field("Assumed taxable value ($M)")).toHaveValue("1400");
    await expect(calculator.getByRole("button", { name: "Local public receipts", exact: true })).toHaveAttribute("aria-pressed", "true");
    await expect(result).toHaveText(initial);

    const anchors = await page.locator('nav[aria-label="Article sections"] a').evaluateAll(links => links.map(a => a.getAttribute("href")));
    for (const anchor of anchors) {
      await page.locator('nav[aria-label="Article sections"] a[href="' + anchor + '"]').click();
      await expect(page).toHaveURL(new RegExp(anchor + "$"));
      await expect(page.locator(anchor)).toBeVisible();
    }
    await page.locator("#test summary").first().click();
    await expect(page.locator("#test")).toContainText("Responsible authority");
    await page.locator("#record summary").filter({ hasText: "Document index" }).click();
    await expect(page.locator("#library").getByRole("link", { name: "official committee index" })).toBeVisible();
    await page.locator("#record summary").filter({ hasText: "Stakeholder positions" }).click();
    await expect(page.locator("#voices")).toContainText("Trustee Lisa Ganuelas");
    await page.locator("#price > div").first().scrollIntoViewIfNeeded().catch(() => {});
    await calculator.evaluate(el => window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - 140, behavior: "instant" }));
    await page.screenshot({ path: path.join(output, "desktop-calculator.png") });

    const widths = [390, 320];
    for (const width of widths) {
      await page.setViewportSize({ width, height: 844 });
      await page.evaluate(() => window.scrollTo({ top: 0, behavior: "instant" }));
      await page.screenshot({ path: path.join(output, "mobile-" + width + "-hero.png") });
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth + 1)).toBe(true);
      await calculator.scrollIntoViewIfNeeded();
      await field("Build probability without break (%)").fill("25");
      await expect(result).toHaveText("$57.9M");
      await calculator.getByRole("button", { name: "Reset assumptions" }).click();
      await calculator.evaluate(el => window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - 130, behavior: "instant" }));
      await page.screenshot({ path: path.join(output, "mobile-" + width + "-calculator.png") });
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth + 1)).toBe(true);
    }
    expect(errors).toEqual([]);
    expect(failures).toEqual([]);
    fs.writeFileSync(path.join(output, "result.json"), JSON.stringify({
      verifiedAt: new Date().toISOString(), route: "/deep-dives/data-centers",
      desktop: "1440x1000", mobileWidths: widths, errors, failures,
      checks: ["article renders", "two fiscal perspectives", "probability sensitivity", "post-abatement years",
        "signed-contract annual arithmetic", "CSV input and cash-flow parity", "cost threshold edge case",
        "reset", "all nine article anchors", "enforcement and source disclosures", "mobile controls", "no horizontal page overflow"]
    }, null, 2) + "\n");
    console.log("PASS: article, calculator, CSV, disclosures, anchors and responsive layout; no browser errors.");
  } finally { await browser.close(); }
})().catch(e => { console.error(e); process.exitCode = 1; });
