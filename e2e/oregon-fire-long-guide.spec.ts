import { test, expect } from "@playwright/test";
import { FIRE_LESSONS } from "../src/lib/oregon-fire/lesson";

test("the full lesson precedes the atlas and deeper reading returns to its chapter",async({page})=>{
  const errors:string[]=[];
  page.on("pageerror",error=>errors.push(error.message));
  await page.route("**/api/oregon-fire/records?*",route=>route.fulfill({status:503,json:{error:"Records temporarily unavailable"}}));
  await page.goto("/oregon-fire");
  await expect(page.locator(".fire-long-chapter")).toHaveCount(8);
  await expect(page.locator(".fire-long-chapter h2")).toHaveText(FIRE_LESSONS.map(l=>l.title));
  await expect(page.locator(".fire-long-byline")).toContainText("Edan Krolewicz & Dominic Kuklawood");
  expect(await page.locator(".fire-guide-finish").evaluate(el=>Boolean(el.compareDocumentPosition(document.querySelector("#explore")!) & Node.DOCUMENT_POSITION_FOLLOWING))).toBeTruthy();
  await expect(page.locator(".fire-review-bars")).toContainText("72%");
  await page.getByRole("link",{name:"Go deeper: the research"}).click();
  await expect(page).toHaveURL(/learn\/does-treatment-work$/);
  await expect(page.getByRole("heading",{name:"Interpret the averages without turning them into a ranking"})).toBeVisible();
  await page.getByRole("link",{name:"Return to this chapter in the guide"}).click();
  await expect(page).toHaveURL(/oregon-fire#fire-stories$/);
  await expect(page.locator("#fire-stories h2")).toBeInViewport();
  expect(errors).toEqual([]);
});

test("all deeper articles have public evidence, correct canonicals and valid routes",async({request})=>{
  for(const lesson of FIRE_LESSONS){
    const response=await request.get(`/oregon-fire/learn/${lesson.slug}`);
    expect(response.ok()).toBeTruthy();
    const html=await response.text();
    expect(html).toContain(`https://www.portlandciviclab.org/oregon-fire/learn/${lesson.slug}`);
    expect(html).toContain("Read the evidence");
    expect(html).toContain("Think it through");
    expect(html).toContain('application/ld+json');
    expect(html).not.toMatch(/Richard Pasquale|Jenna Knobloch/);
  }
  expect((await request.get("/oregon-fire/learn/not-a-chapter")).status()).toBe(404);
});

test("mobile lesson, keyboard chapter navigation and cost assumptions",async({page})=>{
  await page.setViewportSize({width:390,height:844});
  await page.goto("/oregon-fire");
  for(const lesson of FIRE_LESSONS){
    await page.locator(`#${lesson.anchor}`).scrollIntoViewIfNeeded();
    expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBeTruthy();
  }
  await page.getByRole("slider",{name:/Chance of a relevant wildfire/}).focus();
  await page.keyboard.press("Home");
  await page.keyboard.press("ArrowRight");
  await expect(page.locator(".fire-cost-equation")).toHaveText("5% × $10M = $500K");
  const chapter=page.getByRole("navigation",{name:"Chapters in the fire guide"}).getByRole("link",{name:"03 What changed"});
  await chapter.focus();
  await page.keyboard.press("Enter");
  await expect(page).toHaveURL(/#landscape-history$/);
  await expect(page.locator("#landscape-history h2")).toBeInViewport();
  await page.getByRole("link",{name:"Go deeper: what changed"}).click();
  expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBeTruthy();
});

test("essential story and real images are readable without JavaScript",async({browser})=>{
  const context=await browser.newContext({javaScriptEnabled:false,viewport:{width:390,height:844}});
  const page=await context.newPage();
  await page.goto("/oregon-fire");
  await expect(page.locator(".fire-long-chapter")).toHaveCount(8);
  await expect(page.locator(".fire-long-chapter h2")).toHaveText(FIRE_LESSONS.map(l=>l.title));
  await page.locator("#through-time").scrollIntoViewIfNeeded();
  const image=page.locator(".fire-aftermath-images img").first();
  await expect.poll(()=>image.evaluate((el:HTMLImageElement)=>el.complete && el.naturalWidth>0)).toBeTruthy();
  await page.locator("#costs-and-choices").scrollIntoViewIfNeeded();
  await expect(page.locator(".fire-cost-equation")).toHaveText("20% × $10M = $2M");
  await page.getByRole("link",{name:"Go deeper: the costs"}).click();
  await expect(page.getByRole("heading",{name:"First establish what was actually spent"})).toBeVisible();
  expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBeTruthy();
  await context.close();
});

test("legacy guide views preserve all their query values in the atlas",async({page})=>{
  await page.goto("/oregon-fire?place=4115800&story=egley&stage=2&factor=plan&goal=forest&kind=all&scarYears=1&scarEnd=2024&scarMode=severity#fire-stories");
  await expect(page).toHaveURL(/oregon-fire\/atlas\?/);
  const url=new URL(page.url());
  expect(url.searchParams.get("place")).toBe("4115800");
  expect(url.searchParams.get("story")).toBe("egley");
  expect(url.searchParams.get("stage")).toBe("2");
  expect(url.searchParams.get("factor")).toBe("plan");
  expect(url.searchParams.get("scarEnd")).toBe("2024");
  await expect(page.locator("#fire-stories")).toContainText("The same fire. Different histories.");
  await page.goto("/oregon-fire?place=4115800#explore");
  await expect(page).toHaveURL(/oregon-fire\?place=4115800/);
  await expect(page.locator(".fire-long-chapter")).toHaveCount(8);
});
