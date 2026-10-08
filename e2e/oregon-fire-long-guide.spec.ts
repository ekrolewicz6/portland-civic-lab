import { test, expect } from "@playwright/test";
import { FIRE_GUIDE_ORDER, FIRE_LESSONS } from "../src/lib/oregon-fire/lesson";

// The guide shows its chapters in FIRE_GUIDE_ORDER, not the order of FIRE_LESSONS.
const guideTitles=FIRE_GUIDE_ORDER.map(slug=>FIRE_LESSONS.find(l=>l.slug===slug)!.title);

test("the full lesson precedes the atlas and deeper reading returns to its chapter",async({page})=>{
  const errors:string[]=[];
  page.on("pageerror",error=>errors.push(error.message));
  await page.route("**/api/oregon-fire/records?*",route=>route.fulfill({status:503,json:{error:"Records temporarily unavailable"}}));
  await page.goto("/oregon-fire");
  await expect(page.locator(".fire-long-chapter")).toHaveCount(8);
  await expect(page.locator(".fire-long-chapter h2")).toHaveText(guideTitles);
  await expect(page.locator(".fire-long-byline")).toContainText("Edan Krolewicz & Dominic Kuklawood");
  expect(await page.locator(".fire-guide-finish").evaluate(el=>Boolean(el.compareDocumentPosition(document.querySelector("#explore")!) & Node.DOCUMENT_POSITION_FOLLOWING))).toBeTruthy();
  await expect(page.locator(".fire-review-bars")).toContainText("72%");
  await page.getByRole("link",{name:"Go deeper: what helped"}).click();
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
  // The sticky chapter row follows the scroll above with a smooth scroll of its own, and a
  // jump started while the row is still moving can stall. Let it reach the last chapter first.
  const chapters=page.getByRole("navigation",{name:"Chapters in the fire guide"});
  await expect(chapters.getByRole("link",{name:"08 What comes next"})).toHaveAttribute("aria-current","true");
  await expect.poll(()=>chapters.locator(".fire-nav-track").evaluate(el=>Math.ceil(el.scrollLeft+el.clientWidth)>=el.scrollWidth)).toBe(true);
  const chapter=chapters.getByRole("link",{name:"03 What changed"});
  await chapter.focus();
  await page.keyboard.press("Enter");
  await expect(page).toHaveURL(/#landscape-history$/);
  await expect(page.locator("#landscape-history h2")).toBeInViewport();
  await page.getByRole("link",{name:"Go deeper: what changed"}).click();
  expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBeTruthy();
  // The teaching calculator sits one level deeper than the main guide.
  await page.goto("/oregon-fire/learn/costs-and-choices");
  await expect(page.locator(".fire-cost-equation")).toHaveText("20% × $10 million = $2 million");
  await page.getByRole("slider",{name:/What is the chance fire reaches the work/}).focus();
  await page.keyboard.press("Home");
  await page.keyboard.press("ArrowRight");
  await expect(page.locator(".fire-cost-equation")).toHaveText("5% × $10 million = $500,000");
  expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBeTruthy();
});

test("essential story and real images are readable without JavaScript",async({browser})=>{
  const context=await browser.newContext({javaScriptEnabled:false,viewport:{width:390,height:844}});
  const page=await context.newPage();
  await page.goto("/oregon-fire");
  await expect(page.locator(".fire-long-chapter")).toHaveCount(8);
  await expect(page.locator(".fire-long-chapter h2")).toHaveText(guideTitles);
  await page.locator("#through-time").scrollIntoViewIfNeeded();
  const image=page.locator(".fire-aftermath-images img").first();
  await expect.poll(()=>image.evaluate((el:HTMLImageElement)=>el.complete && el.naturalWidth>0)).toBeTruthy();
  await page.locator("#costs-and-choices").scrollIntoViewIfNeeded();
  await page.getByRole("link",{name:"Go deeper: the money"}).click();
  await expect(page).toHaveURL(/learn\/costs-and-choices$/);
  await expect(page.getByRole("heading",{name:"First establish what was actually spent"})).toBeVisible();
  // The calculator's starting example is server-rendered on the deeper page.
  await expect(page.locator(".fire-cost-equation")).toHaveText("20% × $10 million = $2 million");
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

test("the documentary visuals and videos support the story at desktop and mobile sizes", async ({page}) => {
  await page.route("**/api/oregon-fire/records?*",route=>route.fulfill({status:503,json:{error:"Records temporarily unavailable"}}));
  await page.setViewportSize({width:1440,height:900});
  await page.goto("/oregon-fire");
  await expect(page.locator(".fire-hero-image-pair img")).toHaveCount(2);
  await expect(page.locator(".fire-hero-evidence")).toContainText("NASA Terra MODIS");
  expect(await page.locator(".fire-long-hero h1").evaluate(el=>parseFloat(getComputedStyle(el).fontSize))).toBeLessThan(100);
  expect(await page.locator(".fire-long-chapter h2").first().evaluate(el=>parseFloat(getComputedStyle(el).fontSize))).toBeLessThan(65);
  await expect(page.locator(".fire-video-feature")).toHaveCount(2);
  await expect(page.locator(".fire-video-feature iframe")).toHaveCount(0);
  await expect(page.getByRole("link",{name:"Watch on YouTube"})).toHaveCount(2);
  await page.getByRole("button",{name:"Play Why wildfires have gotten worse—and what we can do about it"}).click();
  await expect(page.locator(".fire-video-feature iframe")).toHaveCount(1);
  await expect(page.locator(".fire-video-feature iframe")).toHaveAttribute("title",/Why wildfires have gotten worse/);
  await page.setViewportSize({width:390,height:844});
  await page.locator("#understand").scrollIntoViewIfNeeded();
  expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBeTruthy();
  await expect(page.locator(".fire-landscape-strip>div")).toHaveCount(4);
  await page.locator("#burn-windows").scrollIntoViewIfNeeded();
  expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBeTruthy();
});


test("the cost example distinguishes actual possibilities, their average, and break-even", async ({page}) => {
  await page.goto("/oregon-fire/learn/costs-and-choices");
  const calculator=page.locator(".fire-cost-explorer");
  await expect(calculator.getByRole("img",{name:/20 of 100 possible futures/})).toBeVisible();
  await expect(calculator.locator(".fire-cost-outcomes")).toContainText("Avoid $0 in wildfire damage");
  await expect(calculator.locator(".fire-cost-threshold")).toContainText("10%");
  const chance=calculator.getByRole("slider",{name:/What is the chance fire reaches the work/});
  await chance.focus();
  await page.keyboard.press("Home");
  await expect(calculator.locator(".fire-cost-verdict")).toContainText("falls short of project cost by $1 million");
  await expect(calculator.getByRole("img",{name:/0 of 100 possible futures/})).toBeVisible();
  await page.keyboard.press("ArrowRight");
  await page.keyboard.press("ArrowRight");
  await expect(calculator.locator(".fire-cost-verdict")).toContainText("breaks even");
  await page.keyboard.press("End");
  await expect(calculator.locator(".fire-cost-verdict")).toContainText("exceeds project cost by $9 million");
  await calculator.getByRole("slider",{name:/What does the project cost/}).focus();
  await page.keyboard.press("End");
  await calculator.getByRole("slider",{name:/how much damage does the work prevent/}).focus();
  await page.keyboard.press("Home");
  await expect(calculator.locator(".fire-cost-threshold")).toContainText("Even a 100% chance would not cover");
  await calculator.getByRole("button",{name:"Reset the example"}).click();
  await expect(calculator.locator(".fire-cost-equation")).toHaveText("20% × $10 million = $2 million");
  await expect(calculator.locator(".fire-cost-verdict")).toContainText("exceeds project cost by $1 million");
});
