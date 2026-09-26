import { test, expect } from "@playwright/test";
test("story, dossier, evidence, export and correction flow", async ({ page, request }) => {
  await page.goto("/oregon-fire/stories/why-burn");
  await expect(page.getByRole("heading", { name: "Why burn this place?", exact:true })).toBeVisible();
  await expect(page.locator(".fire-story-nav a")).toHaveCount(5);
  await page.getByRole("link",{name:"See the project record"}).click();
  await expect(page).toHaveURL(/projects\/woodpecker#timeline/);
  await expect(page.getByText("Itemized costs have not been obtained",{exact:false})).toBeVisible();
  await page.getByRole("link",{name:"Contribute a record or correction"}).click();
  await expect(page.locator("textarea")).toHaveValue(/project:woodpecker/);
  const p=await request.get("/api/oregon-fire/projects/woodpecker"); expect(p.ok()).toBeTruthy();
  expect((await p.json()).project.recordIds).toEqual([]);
  expect((await request.get("/api/oregon-fire/projects/not-published")).status()).toBe(404);
  const csv=await request.get("/api/oregon-fire/projects/export"); expect(csv.ok()).toBeTruthy(); expect(await csv.text()).toContain("datePrecision");
});
test("mobile chapters and SEO have meaningful content without map interaction", async ({ page }) => {
  await page.setViewportSize({width:390,height:844});
  await page.goto("/oregon-fire/stories/why-burn");
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute("href",/oregon-fire\/stories\/why-burn$/);
  await expect(page.locator('meta[property="og:image"]').first()).toHaveAttribute("content",/opengraph-image|api\/oregon-fire\/social/);
  await expect(page.locator("#helped")).toContainText("Still unknown");
  expect(await page.evaluate(()=>document.documentElement.scrollWidth <= innerWidth)).toBeTruthy();
  await page.getByRole("link", { name:"05 Did it help?" }).click();
  await expect(page).toHaveURL(/#helped$/);
});
