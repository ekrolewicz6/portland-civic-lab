const { chromium, expect } = require("@playwright/test");
const fs = require("node:fs");
const path = require("node:path");

(async () => {
  const base = process.env.DC_PREVIEW_URL || "http://127.0.0.1:3166";
  const output = process.env.DC_VERIFY_OUTPUT || "/tmp/data-centers-redesign";
  fs.mkdirSync(output, { recursive: true });
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1440, height: 1000 }, acceptDownloads: true });
  const errors = [], failures = [];
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
    const showAdvanced = async () => {
      const summary = calculator.locator("summary").filter({ hasText: "Payments, jobs" });
      if (await summary.locator("..").getAttribute("open") === null) await summary.click();
    };
    const ledgerValue = label => calculator.locator("dl > div").filter({ has: page.getByText(label, { exact: true }) }).locator("dd");
    const defaultResult = await result.innerText();
    for (const [id, years, expected] of [["dalles-1",15,6.3],["dalles-2",15,6.96],["hillsboro",5,2.178]]) {
      await calculator.getByTestId("example-" + id).click();
      await expect(calculator.getByTestId("example-" + id)).toHaveAttribute("aria-pressed","true");
      await expect(field("Taxable value ($M)")).toHaveValue("600");
      await expect(field("Years of tax break")).toHaveValue(String(years));
      await expect(calculator.locator(".dc-verdict")).toContainText("The deal comes out ahead");
      await showAdvanced();
      await expect(field("Public costs per year ($M)")).toHaveValue("0");
      const pending = page.waitForEvent("download");
      await calculator.getByRole("button", { name:"Download CSV" }).click();
      const download = await pending;
      const saved = path.join(output, id + ".csv");
      await download.saveAs(saved);
      const csv = fs.readFileSync(saved,"utf8");
      const inputs = JSON.parse(csv.split("\n").find(l=>l.startsWith("# ledger=")).split("; inputs=")[1]);
      expect(Object.keys(inputs)).toHaveLength(22);
      expect(inputs.buildWithoutPct).toBe(50);
      expect(inputs.serviceCostM).toBe(0);
      const rows = csv.split("\n").filter(l=>/^\d+,/.test(l));
      expect(rows).toHaveLength(30);
      expect(Number(rows[0].split(",")[2])).toBeCloseTo(expected);
      if (id === "hillsboro") {
        expect(Number(rows[3].split(",")[2])).toBeCloseTo(4.29);
        expect(Number(rows[5].split(",")[2])).toBeCloseTo(6.6);
      }
      await calculator.getByRole("button", { name:"Certain", exact:true }).click();
      await expect(calculator.locator(".dc-verdict")).toContainText("No tax break comes out ahead");
      await calculator.getByRole("button", { name:"Set to break-even" }).click();
      await expect(result).toHaveText("$0.0M");
      await expect(calculator.locator(".dc-verdict")).toContainText("The options break even");
      await field("Public costs per year ($M)").fill("100");
    }
    await calculator.getByTestId("example-dalles-1").click();
    await expect(result).toHaveText(defaultResult);
    await calculator.getByRole("button", { name:"Local + Oregon", exact:true }).click();
    await expect(result).not.toHaveText(defaultResult);
    await calculator.getByRole("button", { name:"Local public money", exact:true }).click();
    await expect(result).toHaveText(defaultResult);
    await calculator.getByRole("slider").focus();
    await calculator.getByRole("slider").press("ArrowRight");
    await expect(calculator.getByRole("slider")).toHaveValue("51");

    await calculator.locator("summary").filter({hasText:"See the full numbers"}).click();
    await field("Years to compare").fill("15");
    await expect(ledgerValue("Included post-abatement property tax")).toHaveText("$0.0M");
    await field("Years to compare").fill("30");
    await expect(ledgerValue("Included post-abatement property tax")).not.toHaveText("$0.0M");
    await field("Public costs per year ($M)").fill("100");
    await expect(calculator.locator(".dc-tipping-point")).toContainText("No standard threshold");
    await calculator.getByRole("button", { name:"Reset example" }).click();
    await expect(result).toHaveText(defaultResult);
    await calculator.locator("summary").filter({hasText:"Where these example"}).click();
    await expect(calculator).toContainText("not actual assessed values");
    await calculator.getByRole("button", {name:"Start custom"}).click();
    await expect(field("Taxable value ($M)")).toHaveValue("1400");
    await expect(result).toHaveText("−$8.5M");
    await calculator.getByTestId("example-dalles-1").click();
    await calculator.locator("details").evaluateAll(els=>els.forEach(el=>el.open=false));

    const anchors = await page.locator('nav[aria-label="Article sections"] a').evaluateAll(links => links.map(a => a.getAttribute("href")));
    for (const anchor of anchors) {
      await page.locator('nav[aria-label="Article sections"] a[href="' + anchor + '"]').click();
      await expect(page).toHaveURL(new RegExp(anchor + "$"));
      await expect(page.locator(anchor)).toBeVisible();
      expect(await page.locator(anchor).evaluate(el=>el.getBoundingClientRect().top)).toBeGreaterThan(90);
    }
    await page.locator("#test summary").first().click();
    await expect(page.locator("#test")).toContainText("Who is responsible");
    await page.locator("#library summary").click();
    await expect(page.locator("#library").getByRole("link", { name: "official committee index" })).toBeVisible();
    await page.locator("#voices summary").click();
    await expect(page.locator("#voices")).toContainText("Trustee Lisa Ganuelas");

    for (const width of [1440, 1024, 768, 390, 320]) {
      await page.setViewportSize({width,height:1000});
      await page.evaluate(()=>window.scrollTo({top:0,behavior:"instant"}));
      expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1)).toBe(true);
      if ([1440,390,320].includes(width)) {
        await page.screenshot({path:path.join(output,width+"-hero.png")});
        await calculator.screenshot({path:path.join(output,width+"-calculator.png")});
        await page.locator("#evidence").screenshot({path:path.join(output,width+"-evidence.png")});
      }
      await calculator.getByTestId("example-hillsboro").click();
      await expect(field("Years of tax break")).toHaveValue("5");
      await calculator.getByRole("button",{name:"Certain",exact:true}).click();
      await expect(calculator.locator(".dc-verdict")).toContainText("No tax break comes out ahead");
      await calculator.getByTestId("example-dalles-1").click();
      expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1)).toBe(true);
    }
    const noJs = await browser.newPage({javaScriptEnabled:false,viewport:{width:390,height:844}});
    await noJs.goto(base+"/deep-dives/data-centers");
    await expect(noJs.getByRole("heading",{level:1})).toContainText("Oregon built the cloud");
    await expect(noJs.locator(".dc-waffle")).toBeVisible();
    await expect(noJs.locator("#sources")).toContainText("Know what is fact");
    await noJs.close();
    expect(errors).toEqual([]);
    expect(failures).toEqual([]);
    fs.writeFileSync(path.join(output,"result.json"),JSON.stringify({
      verifiedAt:new Date().toISOString(),route:"/deep-dives/data-centers",viewports:[1440,1024,768,390,320],
      examples:3,errors,failures,
      checks:["all examples replace complete input sets","documented payment rules","positive and negative comparisons",
        "exact break-even","CSV payment schedules","separate fiscal perspectives","keyboard slider",
        "post-abatement years","high-cost edge case","reset and custom","all article anchors clear header",
        "source and enforcement disclosures","responsive controls and no overflow","no-JavaScript article"]
    },null,2)+"\n");
    console.log("PASS: three examples, break-even, cash flows, keyboard, five responsive widths and no-JS reading; no browser errors.");
  } finally { await browser.close(); }
})().catch(e=>{console.error(e);process.exitCode=1;});
