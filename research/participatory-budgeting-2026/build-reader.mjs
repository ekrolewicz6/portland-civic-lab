import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

const dir = path.dirname(fileURLToPath(import.meta.url));
const slug = text => String(text).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
const escape = text => text.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;');
const md = fs.readFileSync(path.join(dir, 'independent-analysis.md'), 'utf8');
const headings = [...md.matchAll(/^## (.+)$/gm)].map(m => m[1]);
const body = renderToStaticMarkup(React.createElement(ReactMarkdown, {
  remarkPlugins: [remarkGfm],
  components: {
    h2: ({children}) => React.createElement('h2', {id: slug(children)}, children),
    table: ({children}) => React.createElement('div', {className: 'table-wrap', tabIndex: 0}, React.createElement('table', {}, children)),
  },
}, md));
const toc = headings.map(h => `<a href="#${slug(h)}">${escape(h)}</a>`).join('');
const html = `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="description" content="An independent analysis of Portland Measure 26-267: the strongest arguments for and against participatory budgeting, budget tradeoffs, evidence, and campaign claim checks.">
<title>Portland Measure 26-267 | Independent voter analysis</title>
<style>
:root{--ink:#1c2934;--muted:#51616e;--line:#d9dfdf;--paper:#fffefa;--accent:#405a68;--soft:#eef2f1}
*{box-sizing:border-box}html{scroll-behavior:smooth;scroll-padding-top:24px}body{margin:0;background:var(--paper);color:var(--ink);font:18px/1.7 Georgia,'Times New Roman',serif}a{color:#1d536b;text-decoration-thickness:1px;text-underline-offset:3px}a:hover{color:#000}a:focus-visible,.table-wrap:focus-visible{outline:3px solid #a36f34;outline-offset:4px}.skip{position:absolute;top:-80px;left:16px}.skip:focus{top:10px;background:white;padding:8px;z-index:2}.masthead{border-bottom:1px solid var(--line);padding:25px 6vw;display:flex;justify-content:space-between;gap:20px;font:12px/1.5 system-ui,sans-serif;letter-spacing:.13em;text-transform:uppercase}.layout{max-width:1400px;margin:auto;display:grid;grid-template-columns:250px minmax(0,890px);gap:65px;padding:52px 38px 100px}nav{position:sticky;top:24px;align-self:start;font:13px/1.45 system-ui,sans-serif;max-height:90vh;overflow:auto}nav p{font-size:11px;font-weight:700;letter-spacing:.13em;text-transform:uppercase;margin:0 0 15px;color:var(--muted)}nav a{display:block;padding:7px 0;text-decoration:none;color:var(--muted)}nav a:hover{text-decoration:underline;color:var(--ink)}article{min-width:0}h1{font-size:clamp(36px,4.1vw,58px);line-height:1.07;letter-spacing:-.025em;font-weight:500;margin:0 0 28px}h2{font:600 29px/1.25 system-ui,sans-serif;letter-spacing:-.02em;border-top:1px solid var(--line);padding-top:32px;margin:58px 0 22px}h3{font:600 21px/1.35 system-ui,sans-serif;margin:32px 0 12px}p{margin:0 0 21px}article>p:first-of-type{font:13px/1.65 system-ui,sans-serif;color:var(--muted);margin-bottom:34px}strong{font-weight:700}li{padding-left:4px;margin:8px 0}ul,ol{padding-left:25px}.table-wrap{overflow-x:auto;margin:24px 0 30px;border:1px solid var(--line);border-radius:4px}table{border-collapse:collapse;width:100%;font:14px/1.6 system-ui,sans-serif;min-width:550px}th,td{text-align:left;vertical-align:top;padding:14px 15px;border-bottom:1px solid var(--line)}th{background:var(--soft);font-weight:650}tr:last-child td{border-bottom:0}td:first-child{min-width:135px}tr:nth-child(even) td{background:#f8f9f6}footer{border-top:1px solid var(--line);padding:22px 6vw;font:12px/1.6 system-ui,sans-serif;color:var(--muted)}.edition{font:12px system-ui,sans-serif;margin-top:24px;padding-top:15px;border-top:1px solid var(--line)}
@media(max-width:1050px){.layout{grid-template-columns:190px minmax(0,1fr);gap:34px;padding:38px 26px}nav{font-size:12px}}
@media(max-width:760px){body{font-size:17px}.layout{display:block;padding:28px 20px 60px}nav{position:static;max-height:none;border-bottom:1px solid var(--line);margin-bottom:32px;padding-bottom:22px}nav a{display:inline-block;padding:5px 12px 5px 0;font-size:12px}.masthead{padding:18px 20px;flex-wrap:wrap;font-size:10px}h1{font-size:40px}h2{font-size:26px;margin-top:42px}.edition{display:none}}
@media print{@page{margin:18mm}body{font-size:10.5pt;line-height:1.5;background:white}.masthead{padding:0 0 12px}nav{display:none}.layout{display:block;padding:25px 0 0;max-width:none}h1{font-size:32pt}h2{font-size:19pt;margin-top:26px;padding-top:18px;break-after:avoid}h3{font-size:13pt;break-after:avoid}table{font-size:8pt;min-width:0}.table-wrap{overflow:visible;break-inside:auto}tr{break-inside:avoid}th,td{padding:7px}a{color:inherit;text-decoration:underline}footer{padding:15px 0}p{orphans:3;widows:3}}
</style></head><body><a class="skip" href="#analysis">Skip to analysis</a>
<header class="masthead"><span>Portland · Measure 26-267</span><span>Independent voter analysis · September 17, 2026</span></header>
<div class="layout"><nav aria-label="Contents"><p>In this analysis</p>${toc}<div class="edition">Research edition<br>Not an endorsement<br>Sources linked throughout</div></nav><main id="analysis"><article>${body}</article></main></div>
<footer>Prepared from public records, campaign materials, and research. No campaign reviewed or approved this analysis. Research cutoff: September 17, 2026. This file is a local reading copy, not a published website.</footer></body></html>`;
fs.writeFileSync(path.join(dir, 'independent-analysis.html'), html);
console.log(`Wrote independent-analysis.html (${html.length} characters); ${headings.length} navigation links.`);
