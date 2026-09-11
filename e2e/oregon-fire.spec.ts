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
        page.getByText("By Edan Krolewicz, Jenna Knobloch & Dominic Kuklawood"),
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
