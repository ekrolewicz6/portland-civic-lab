const { chromium, expect } = require('@playwright/test');
const fs = require('node:fs');
const path = require('node:path');
const base = process.env.DC_PREVIEW_URL || 'http://127.0.0.1:3167';
const output = process.env.DC_VERIFY_OUTPUT || '/tmp/data-centers-readability';

async function inspect(page) {
  return page.locator('.dc-story').evaluate(root => {
    const small = [], contrast = [], clipped = [];
    const colorCanvas = document.createElement('canvas');
    colorCanvas.width = colorCanvas.height = 1;
    const ctx = colorCanvas.getContext('2d');
    const rgba = color => { ctx.clearRect(0,0,1,1);ctx.fillStyle=color;ctx.fillRect(0,0,1,1);return [...ctx.getImageData(0,0,1,1).data].map((v,i) => i===3?v/255:v); };
    const over = (fg,bg) => fg.slice(0,3).map((v,i)=>v*fg[3]+bg[i]*(1-fg[3]));
    const luminance = c => c.map(v=>{v/=255;return v<=.04045?v/12.92:Math.pow((v+.055)/1.055,2.4);}).reduce((sum,v,i)=>sum+v*[.2126,.7152,.0722][i],0);
    const walker = document.createTreeWalker(root,NodeFilter.SHOW_TEXT);
    while(walker.nextNode()) {
      const node=walker.currentNode,el=node.parentElement;
      if(!node.textContent.trim() || !el || ['TITLE','STYLE','SCRIPT'].includes(el.tagName) || !el.checkVisibility()) continue;
      const range=document.createRange();range.selectNodeContents(node);
      const rect=range.getBoundingClientRect();if(!rect.width || !rect.height)continue;
      const style=getComputedStyle(el),font=parseFloat(style.fontSize);
      const item={text:node.textContent.trim().slice(0,100),tag:el.tagName,class:el.className,font};
      if(font<14)small.push(item);
      // Composite solid CSS backgrounds from the page to the text; gradients are reviewed visually.
      const ancestors=[];for(let p=el;p;p=p.parentElement)ancestors.push(p);
      let bg=[255,255,255];for(const p of ancestors.reverse())bg=over(rgba(getComputedStyle(p).backgroundColor),bg);
      const fg=over(rgba(style.color),bg),l=[luminance(fg),luminance(bg)].sort((a,b)=>b-a),ratio=(l[0]+.05)/(l[1]+.05);
      const minimum=font>=24 || (font>=18.66 && parseInt(style.fontWeight)>=700)?3:4.5;
      if(ratio<minimum-.01)contrast.push({...item,ratio:Math.round(ratio*100)/100,minimum});
      // Ignore the intentional horizontally scrollable section navigation, but catch clipped text elsewhere.
      if(!el.closest('.dc-nav') && (rect.right>innerWidth+1 || rect.left< -1))clipped.push({...item,left:rect.left,right:rect.right});
    }
    const controls=[...root.querySelectorAll('input,select,button')].filter(el=>el.checkVisibility()).map(el=>({name:el.getAttribute('aria-label') || el.textContent.trim().slice(0,50),height:el.getBoundingClientRect().height,font:parseFloat(getComputedStyle(el).fontSize)}));
    return {small,contrast,clipped,shortControls:controls.filter(c=>c.height<44),tinyInputs:controls.filter(c=>c.font<16 && !c.name.includes('example')),overflow:document.documentElement.scrollWidth>innerWidth+1};
  });
}
(async()=>{
  fs.mkdirSync(output,{recursive:true});
  const browser=await chromium.launch({headless:true});
  const page=await browser.newPage();
  const errors=[];page.on('pageerror',e=>errors.push(e.message));
  const reports=[];
  try {
    await page.goto(base+'/deep-dives/data-centers',{waitUntil:'networkidle'});
    await page.evaluate(()=>document.fonts.ready);
    for(const width of [320,390,440,768,1024,1280,1440,1920,2560]) {
      await page.setViewportSize({width,height:1000});
      await page.locator('.dc-story details').evaluateAll(nodes=>nodes.forEach(el=>el.open=true));
      const result=await inspect(page);reports.push({width,scale:1,...result});
      if([320,390,768,1440,1920].includes(width)) {
        await page.locator('.dc-rate-shift').screenshot({path:path.join(output,`${width}-rates.png`)});
        await page.locator('#dc-comparison').screenshot({path:path.join(output,`${width}-comparison.png`)});
        await page.locator('.dc-hero').screenshot({path:path.join(output,`${width}-hero.png`)});
      }
    }
    for(const width of [390,1280]) {
      await page.setViewportSize({width,height:1000});
      await page.addStyleTag({content:'html:has(.dc-story){font-size:200%}'});
      const result=await inspect(page);reports.push({width,scale:2,...result});
      await page.locator('.dc-rate-shift').screenshot({path:path.join(output,`${width}-200-percent-rates.png`)});
      await page.locator('#dc-comparison').screenshot({path:path.join(output,`${width}-200-percent-comparison.png`)});
    }
    // Increased word, letter, line and paragraph spacing must not hide article content.
    await page.setViewportSize({width:320,height:1000});
    await page.addStyleTag({content:'html:has(.dc-story){font-size:100%}.dc-story *{line-height:1.5!important;letter-spacing:.12em!important;word-spacing:.16em!important}.dc-story p{margin-bottom:2em!important}'});
    reports.push({width:320,spacing:'WCAG text spacing',...await inspect(page)});
    fs.writeFileSync(path.join(output,'readability.json'),JSON.stringify({checkedAt:new Date().toISOString(),base,reports,errors},null,2));
    for(const report of reports) {
      console.log(JSON.stringify({width:report.width,scale:report.scale,spacing:report.spacing,small:report.small.length,contrast:report.contrast.length,clipped:report.clipped.length,shortControls:report.shortControls.length,overflow:report.overflow}));
      expect(report.small,`Small text at ${report.width}`).toEqual([]);
      expect(report.contrast,`Low contrast at ${report.width}`).toEqual([]);
      expect(report.clipped,`Clipped text at ${report.width}`).toEqual([]);
      expect(report.shortControls,`Small controls at ${report.width}`).toEqual([]);
      expect(report.overflow,`Page overflow at ${report.width}`).toBe(false);
    }
    expect(errors).toEqual([]);
    console.log('PASS: all article disclosures, nine widths, 200% text and increased text spacing.');
  } finally {await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1});
