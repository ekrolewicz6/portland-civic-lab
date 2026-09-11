"""Render the checked-in research without external packages or hosted assets."""
from pathlib import Path
import html
import re

root = Path(__file__).resolve().parent

def inline(text):
    text = html.escape(text)
    text = re.sub(r'\[([^\]]+)\]\(([^\s)]+)\)', r'<a href="\2">\1</a>', text)
    text = re.sub(r'(?<!["=>])https?://[^\s<"]+', lambda m: '<a href="' + m.group(0).rstrip('.,)') + '">' + m.group(0).rstrip('.,)') + '</a>' + m.group(0)[len(m.group(0).rstrip('.,)')):], text)
    text = re.sub(r'`([^`]+)`', r'<code>\1</code>', text)
    return re.sub(r'\*\*([^*]+)\*\*', r'<strong>\1</strong>', text)

def render(text):
    out, table, code = [], False, False
    for line in text.splitlines():
        if line.startswith('```'):
            out.append('</pre>' if code else '<pre>')
            code = not code
            continue
        if code:
            out.append(html.escape(line) + '\n')
            continue
        if line.startswith('|'):
            if not table:
                out.append('<div class="table"><table>')
                table = True
            if re.match(r'^\|[\s:|\-]+$', line):
                continue
            out.append('<tr>' + ''.join('<td>' + inline(c.strip()) + '</td>' for c in line.strip('|').split('|')) + '</tr>')
            continue
        if table:
            out.append('</table></div>')
            table = False
        if line.startswith('#'):
            count = len(line) - len(line.lstrip('#'))
            level = min(count + 1, 6)
            out.append(f'<h{level}>{inline(line.lstrip("# "))}</h{level}>')
        elif line.startswith('- ') or re.match(r'^\d+\. ', line):
            out.append('<p class="item">' + inline(line) + '</p>')
        elif line.strip() == '---':
            out.append('<hr>')
        elif line.strip():
            out.append('<p>' + inline(line) + '</p>')
    if table:
        out.append('</table></div>')
    return '\n'.join(out)

sections = [
    ('audit', 'Audit & acquisition priorities', 'audit-2026-09-11.md'),
    ('inventory', 'Data inventory', 'data-inventory.md'),
    ('contacts', 'People & programs', 'contacts.md'),
    ('outreach', 'Unsent outreach drafts', 'outreach-drafts.md'),
    ('implementation', 'Implementation & operation', 'implementation.md'),
    ('verification', 'Verification & release', 'verification.md'),
    ('sources', 'Source register', 'sources.md'),
]
nav = ''.join(f'<a href="#{key}">{label}</a>' for key, label, _ in sections)
body = ''.join(f'<section id="{key}">{render((root / filename).read_text())}</section>' for key, _, filename in sections)
page = '''<!doctype html><html lang="en"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>Oregon Fire Map Sourcebook · September 11, 2026</title>
<style>body{margin:0;background:#f6f5ef;color:#243c31;font:16px/1.65 system-ui,sans-serif}header{padding:64px max(24px,calc((100vw - 1160px)/2));background:#203b2d;color:#f6f5ef}header h1{font:normal clamp(36px,5vw,64px)/1.1 Georgia,serif;margin:12px 0 24px}header p{max-width:780px;color:#d4e0d2}nav{display:flex;gap:20px;flex-wrap:wrap;padding:24px;background:#e6ecdf}a{color:#286648;text-underline-offset:3px}main{max-width:1160px;margin:auto;padding:24px}section{border-bottom:1px solid #cbd4c4;padding:28px 0 60px;scroll-margin-top:30px}h2{font:normal 34px/1.2 Georgia,serif}h3{font-size:23px;margin-top:38px}h4{font-size:18px}p{max-width:1000px}.table{overflow:auto}table{border-collapse:collapse;width:100%;font-size:14px}td{vertical-align:top;border:1px solid #cbd4c4;padding:12px;min-width:140px}tr:first-child{font-weight:bold;background:#e6ecdf}code,pre{font:13px/1.6 ui-monospace,monospace;background:#e9ede4}pre{padding:20px;overflow:auto}.item{padding-left:18px}hr{border:0;border-top:1px solid #cbd4c4;margin:30px 0}.status{font-size:12px;letter-spacing:.1em;text-transform:uppercase}footer{padding:30px;background:#e6ecdf}</style>
<header><div class="status">Portland Civic Lab · Research edition · September 11, 2026</div><h1>Oregon Fire Map<br>Sourcebook</h1><p>Edan Krolewicz · Jenna Knobloch · Dominic Kuklawood</p><p>Documented burns, their purposes and Oregon wildfire history. Enough public data for a first map; visible gaps and source-specific evidence, with no claim of comprehensive coverage.</p><p>All outreach remains unsent. The local implementation awaits co-author release review. This file supersedes the original September 10 sourcebook.</p></header>
'''+f'<nav aria-label="Sourcebook sections">{nav}</nav><main>{body}</main>'+'''<footer>Supporting files: <a href="coverage-matrix.csv">Coverage matrix</a> · <a href="outreach-ledger.csv">Outreach ledger</a> · <a href="endpoints.csv">Endpoint register</a> · <a href="import-evidence.json">Import evidence</a>. The previously hosted Claude artifact is a separate copy and has not been updated.</footer></html>'''
(root / 'sourcebook.html').write_text(page)
print('Updated sourcebook.html')
