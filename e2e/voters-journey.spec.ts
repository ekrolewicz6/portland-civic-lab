import { test, expect } from "@playwright/test";
for (const district of [3, 4]) {
  test(`district ${district}: one tap from a priority to documented proposals`, async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto(`/voters-guide/portland-district-${district}`);
    const guide = page.locator("#find-candidates");
    await expect(guide.getByRole("heading", { name: "Start with what matters to you." })).toBeInViewport();
    await expect(guide.getByRole("button", { name: /Housing & rent/ })).toBeInViewport();
    await expect(guide.locator("[data-candidate]")).toHaveCount(0);
    await guide.getByRole("button", { name: /Housing & rent/ }).click();
    await expect(guide.getByLabel("Explore a topic")).toHaveValue("housing");
    await expect(guide.locator("[data-candidate]")).toHaveCount(4);
    await expect(guide.locator("[data-candidate]").first().getByRole("link", { name: /· source/ })).toHaveAttribute("href", /^https:/);
    await guide.getByRole("button", { name: /Select .* for quick comparison/ }).first().click();
    await guide.getByRole("button", { name: /Select .* for quick comparison/ }).first().click();
    await guide.getByRole("button", { name: "Compare these two →" }).click();
    await expect(guide.getByRole("region", { name: "Keep exploring" })).toContainText("One issue is a starting point.");
    await guide.getByRole("button", { name: "Compare experience →" }).click();
    await expect(guide.getByLabel("Explore a topic")).toHaveValue("experience");
    await expect(guide.locator("[data-candidate]")).toHaveCount(2);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  });
}
test("shared comparisons restore candidates, topic and recorded issue without stored data", async ({ page, context }) => {
  await page.addInitScript(() => {
    Object.defineProperty(navigator, "share", { value: undefined, configurable: true });
    Object.defineProperty(navigator, "clipboard", { value: { writeText: async (value: string) => { (window as unknown as { copied: string }).copied = value; } }, configurable: true });
  });
  await page.goto("/voters-guide/portland-district-4#compare");
  await page.getByRole("combobox", { name: "Candidate 1", exact: true }).selectOption("eli-arnold");
  await page.getByRole("combobox", { name: "Candidate 2", exact: true }).selectOption("olivia-clark");
  await page.getByRole("button", { name: "Recorded decisions", exact: true }).click();
  await page.getByRole("combobox", { name: "Recorded decisions issue", exact: true }).selectOption("water");
  await page.getByRole("button", { name: "Share this comparison", exact: true }).click();
  await expect(page.getByText("Link copied. Ready to share or save.")).toBeVisible();
  const url = await page.evaluate(() => (window as unknown as { copied: string }).copied);
  expect(new URL(url).search).toBe("");
  const recipient = await context.newPage();
  await recipient.goto(url);
  await expect(recipient.locator("#compare")).toBeVisible();
  await expect(recipient.getByRole("combobox", { name: "Candidate 1", exact: true })).toHaveValue("eli-arnold");
  await expect(recipient.getByRole("combobox", { name: "Candidate 2", exact: true })).toHaveValue("olivia-clark");
  await expect(recipient.getByRole("combobox", { name: "Recorded decisions issue", exact: true })).toHaveValue("water");
  await expect(recipient.locator("#find-candidates")).toBeHidden();
  await recipient.close();
});
test("sharing has a manual fallback and malformed shared IDs never select other races", async ({ page }) => {
  await page.addInitScript(() => {
    Object.defineProperty(navigator, "share", { value: undefined, configurable: true });
    Object.defineProperty(navigator, "clipboard", { value: { writeText: async () => { throw new Error("blocked"); } }, configurable: true });
  });
  await page.goto("/voters-guide/portland-district-4#compare?people=eli-arnold,eli-arnold,steve-novick,olivia-clark&topic=unknown&issue=unknown");
  await expect(page.getByRole("combobox", { name: "Candidate 1", exact: true })).toHaveValue("eli-arnold");
  await expect(page.getByRole("combobox", { name: "Candidate 2", exact: true })).toHaveValue("olivia-clark");
  await expect(page.getByRole("button", { name: "Values & tradeoffs", exact: true })).toHaveAttribute("aria-pressed", "true");
  await page.getByRole("button", { name: "Share this comparison", exact: true }).click();
  await expect(page.getByLabel("Link to this view")).toHaveValue(/#compare\?people=eli-arnold%2Colivia-clark&topic=values/);
});
test("a quick comparison can be shared, reopened, and followed into a shareable profile", async ({ page, context }) => {
  await page.addInitScript(() => {
    Object.defineProperty(navigator, "share", { value: undefined, configurable: true });
    Object.defineProperty(navigator, "clipboard", { value: { writeText: async (value: string) => { (window as unknown as { copied: string }).copied = value; } }, configurable: true });
  });
  await page.goto("/voters-guide/portland-district-4");
  const guide = page.locator("#find-candidates");
  await guide.getByRole("button", { name: /Climate & getting around/ }).click();
  await guide.getByRole("button", { name: /Select .* for quick comparison/ }).first().click();
  await guide.getByRole("button", { name: /Select .* for quick comparison/ }).first().click();
  await guide.getByRole("button", { name: "Compare these two →" }).click();
  const ids = await guide.locator("[data-candidate]").evaluateAll((nodes) => nodes.map((n) => (n as HTMLElement).dataset.candidate!));
  await guide.getByRole("button", { name: "Share this comparison", exact: true }).click();
  const url = await page.evaluate(() => (window as unknown as { copied: string }).copied);
  const recipient = await context.newPage();
  await recipient.goto(url);
  await expect(recipient.getByRole("combobox", { name: "Candidate 1", exact: true })).toHaveValue([...ids].sort()[0]);
  await expect(recipient.getByRole("combobox", { name: "Candidate 2", exact: true })).toHaveValue([...ids].sort()[1]);
  await expect(recipient.getByRole("button", { name: "Climate & streets", exact: true })).toHaveAttribute("aria-pressed", "true");
  await recipient.close();
  await guide.locator("[data-candidate]").first().getByRole("link", { name: "Full profile & record →" }).click();
  await page.getByRole("button", { name: "Share this profile", exact: true }).click();
  const profileUrl = await page.evaluate(() => (window as unknown as { copied: string }).copied);
  expect(new URL(profileUrl).hash).toBe(`#${ids[0]}`);
  await page.goto(profileUrl);
  await expect(page.locator(`article#${ids[0]}`)).toBeVisible();
  await expect(page.locator("article:visible")).toHaveCount(1);
});
