import { test, expect } from "@playwright/test";

for (const viewport of [
  { width: 1440, height: 1000 },
  { width: 390, height: 844 },
]) {
  test.describe(`Oregon Fire at ${viewport.width}px`, () => {
    test.use({ viewport });
    test("coverage, attribution, keyboard layers and unavailable responses", async ({
      page,
    }) => {
      await page.route("**/api/oregon-fire/records?*", (route) =>
        route.fulfill({
          status: 503,
          json: { error: "Records temporarily unavailable" },
        }),
      );
      const errors: string[] = [];
      page.on("pageerror", (e) => errors.push(e.message));
      await page.goto("/oregon-fire");
      await expect(page.getByRole("heading", { level: 1 })).toContainText(
        "Fire in Oregon",
      );
      await expect(
        page.getByText("By Edan Krolewicz & Dominic Kuklawood"),
      ).toBeVisible();
      await expect(
        page.locator(".fire-explorer").getByRole("alert"),
      ).toContainText("Records temporarily unavailable");
      const planned = page.getByRole("button", {
        name: "Plans & permits",
        exact: true,
      });
      await planned.focus();
      await page.keyboard.press("Enter");
      await expect(planned).toHaveAttribute("aria-pressed", "true");
      await expect(page).toHaveURL(/kind=planned/);
      await expect(
        page.getByRole("link", { name: "Read OSU’s account" }),
      ).toHaveAttribute(
        "href",
        "https://www.forestry.oregonstate.edu/news/fire-purpose",
      );
      expect(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= innerWidth,
        ),
      ).toBeTruthy();
      expect(errors).toEqual([]);
    });
  });
}

test.describe("Oregon Fire live imported-data checks", () => {
  // Opt-in because the ordinary CI database intentionally has no imported
  // national data. These checks run against the actual local import before release.
  test.skip(
    process.env.OREGON_FIRE_LIVE_CHECK !== "1",
    "Requires actual imported sources",
  );
  test.setTimeout(90_000);
  test("real API, pagination, classifications, provenance and complete CSV export", async ({
    request,
  }) => {
    const response = await request.get("/api/oregon-fire/records");
    expect(response.ok()).toBeTruthy();
    const first = await response.json();
    expect(first.dataStatus).toBe("available");
    expect(first.records.length).toBe(50);
    expect(first.total).toBeGreaterThan(50);
    expect(
      first.map.reduce(
        (n: number, item: { count: number }) => n + item.count,
        0,
      ),
    ).toBe(first.total);
    expect(
      first.records.every((r: { kind: string }) => r.kind === "prescribed"),
    ).toBeTruthy();
    const next = await (
      await request.get(`/api/oregon-fire/records?cursor=${first.nextCursor}`)
    ).json();
    expect(next.records[0].id).not.toBe(first.records[0].id);
    const id = first.records[0].id,
      detail = await (
        await request.get(`/api/oregon-fire/records/${id}`)
      ).json();
    expect(detail.record.id).toBe(id);
    expect(detail.geometry.type).toMatch(/Point|Polygon/);
    expect(detail.observedAt).toBeTruthy();
    expect(detail.record.geometryMeaning).toMatch(/not a .*burn/);
    expect(Object.keys(detail.attributes).join(",")).not.toMatch(
      /FirstName|LastName|CONTACT_EMAIL|CONTACT_PHONE/,
    );
    const q = new URLSearchParams({ q: first.records[0].name });
    const subset = await (
      await request.get(`/api/oregon-fire/records?${q}`)
    ).json();
    const csv = await request.get(`/api/oregon-fire/export?${q}`);
    expect(csv.ok()).toBeTruthy();
    expect(csv.headers()["content-type"]).toContain("text/csv");
    const text = await csv.text();
    expect(text).toContain("lastObservedAt");
    for (const r of subset.records) expect(text).toContain(r.id);
    expect(
      (await request.get("/api/oregon-fire/records?bbox=bad")).status(),
    ).toBe(400);
    expect(
      (await request.get("/api/oregon-fire/records/nonexistent")).status(),
    ).toBe(404);
  });
  test("selection, shared URLs, map movement and private correction prefill", async ({
    page,
    request,
  }) => {
    const errors: string[] = [];
    page.on("pageerror", (e) => errors.push(e.message));
    await page.goto("/oregon-fire");
    const first = page.locator(".fire-result").first();
    await expect(first).toBeVisible({ timeout: 30000 });
    await first.focus();
    await page.keyboard.press("Enter");
    const detail = page.getByLabel("Selected burn record");
    await expect(
      detail.getByRole("heading", { name: "Why this place?" }),
    ).toBeVisible({ timeout: 30000 });
    const id = new URL(page.url()).searchParams.get("selected")!;
    expect(id).toBeTruthy();
    await page.reload();
    await expect(
      detail.getByText("Documented site-selection explanation"),
    ).toBeVisible({ timeout: 30000 });
    expect(new URL(page.url()).searchParams.get("selected")).toBe(id);
    await expect(
      detail.getByRole("link", { name: "Open original source" }),
    ).toHaveAttribute("href", /^https:\/\//);
    const before = new URL(page.url()).searchParams.get("bbox");
    await page.getByRole("button", { name: "Zoom in", exact: true }).click();
    await expect
      .poll(() => new URL(page.url()).searchParams.get("bbox"))
      .not.toBe(before);
    await detail.getByRole("link", { name: /Explain this burn/ }).click();
    const message = page.getByRole("textbox", { name: "Message", exact: true });
    await expect(message).toHaveValue(new RegExp(id), { timeout: 30000 });
    await expect(message).toHaveValue(/Publication preference/);
    await expect(message).toHaveValue(/Supporting evidence/);
    let submission: Record<string, string> | null = null;
    await page.route("**/api/contact", async (route) => {
      submission = route.request().postDataJSON();
      await route.fulfill({
        status: 200,
        json: { ok: true, delivery: "database" },
      });
    });
    await page
      .getByRole("textbox", { name: "Name", exact: true })
      .fill("Local verification");
    await page
      .getByRole("textbox", { name: "Reply email" })
      .fill("test@example.invalid");
    await page.getByRole("button", { name: "Send message" }).click();
    await expect(page.getByText(/Your message is saved/)).toBeVisible();
    expect(submission).not.toBeNull();
    // Intercepted at the browser: no actual contact request or email is sent.
    const source = await (
      await request.get(`/api/oregon-fire/records/${id}`)
    ).json();
    expect(source.explanations).toEqual([]);
    expect(errors).toEqual([]);
  });
  test("mobile map and list remain usable with a shared filter", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/oregon-fire?kind=planned&from=2025");
    await expect(page.locator(".fire-result").first()).toBeVisible({
      timeout: 30000,
    });
    await expect(page.getByLabel("From year")).toHaveValue("2025");
    await expect(
      page.getByRole("button", { name: "Plans & permits", exact: true }),
    ).toHaveAttribute("aria-pressed", "true");
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
    ).toBeTruthy();
    await page.screenshot({
      path: "test-results/oregon-fire-mobile.png",
      fullPage: true,
    });
  });
});

test.describe('Recent fire scars',()=>{
  test.skip(process.env.OREGON_FIRE_LIVE_CHECK !== '1','Requires imported perimeter sources');
  test.setTimeout(90_000);
  test('complete perimeter overlay, window controls, shared links and severity tiles', async ({page,request})=>{
    const response=await request.get('/api/oregon-fire/landscape?end=2026&years=5');
    expect(response.ok()).toBeTruthy(); const data=await response.json();
    expect(data.total).toBe(data.scars.length); expect(data.total).toBeGreaterThan(100);
    expect(data.years.reduce((sum:number,y:{count:number})=>sum+y.count,0)).toBe(data.total);
    expect(data.scars.every((r:{year:number;geometry:{type:string}})=>r.year>=2022&&r.year<=2026&&/Polygon/.test(r.geometry.type))).toBeTruthy();
    expect(data.scars.some((r:{sourceId:string})=>r.sourceId==='wfigs-perimeters')).toBeTruthy();
    expect((await request.get('/api/oregon-fire/landscape?years=100')).status()).toBe(400);
    expect((await request.get('/api/oregon-fire/severity?year=2024&z=7&x=999&y=45')).status()).toBe(400);
    const errors:string[]=[]; page.on('pageerror',e=>errors.push(e.message));
    await page.goto('/oregon-fire?scarEnd=2024&scarYears=1&markers=0');
    await expect(page.getByRole('button',{name:'Recent fire scars On',exact:true})).toHaveAttribute('aria-pressed','true');
    await expect(page.locator('.fire-scar-count strong')).not.toHaveText('…',{timeout:45000});
    await expect(page.locator('.fire-map canvas').first()).toBeAttached();
    await page.getByRole('button',{name:'Burn severity',exact:true}).click();
    await expect(page.getByLabel('Severity fire year')).toHaveValue('2024');
    await expect(page.getByLabel('Burn severity legend')).toContainText('Moderate');
    await expect.poll(async()=>page.locator('.fire-severity-state').innerText(),{timeout:45000}).toContain('generally maps');
    expect(await page.locator('img[src*="/severity?"]').evaluateAll(images=>images.some(i=>(i as HTMLImageElement).naturalWidth===256))).toBeTruthy();
    await expect(page).toHaveURL(/scarMode=severity/);
    await page.reload(); await expect(page.getByRole('button',{name:'Burn severity',exact:true})).toHaveAttribute('aria-pressed','true');
    await page.getByRole('button',{name:'Recent fire scars On',exact:true}).click();
    await expect(page.locator('img[src*="/severity?"]')).toHaveCount(0);
    await expect(page.getByRole('img',{name:/49 percent/})).toBeAttached();
    expect(errors).toEqual([]);
  });
  test('mobile controls, forest context and failed assessments remain explicit',async({page})=>{
    await page.setViewportSize({width:390,height:844});
    await page.route('**/api/oregon-fire/severity?*',r=>r.fulfill({status:502,json:{error:'Assessment unavailable'}}));
    await page.goto('/oregon-fire?scarMode=severity&scarEnd=2024&scarYears=1');
    await expect(page.locator('.fire-severity-state')).toContainText('could not load',{timeout:30000});
    await expect(page.getByLabel('Severity fire year')).toBeVisible();
    await page.getByRole('button',{name:'Year of fire',exact:true}).click();
    await page.getByRole('button',{name:'10 years',exact:true}).click();
    await expect(page).toHaveURL(/scarYears=10/);
    expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBeTruthy();
    await page.locator('.fire-landscape-controls').scrollIntoViewIfNeeded();
    await page.screenshot({path:'test-results/fire-scars-mobile.png',fullPage:true});
  });
});
