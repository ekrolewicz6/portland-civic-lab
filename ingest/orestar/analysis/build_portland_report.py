"""Chart-led district investigation, generated from immutable derived evidence.
Use the bundled PDF Python runtime (reportlab); no network access or database writes.
"""
from __future__ import annotations
import csv, hashlib, html, json, re
from collections import defaultdict
from datetime import date, timedelta
from pathlib import Path
from reportlab.pdfgen import canvas
from reportlab.lib import colors
from reportlab.lib.styles import ParagraphStyle
from reportlab.platypus import Paragraph, Table, TableStyle, Spacer
from reportlab.graphics.shapes import Drawing, Rect, Line, String, Circle, PolyLine
from reportlab.graphics import renderPDF, renderSVG

ROOT=Path(__file__).resolve().parents[3]
BASE=ROOT/'research/campaign-finance/investigation'
DATA=BASE/'portland'
PDF=ROOT/'output/pdf/portland-districts-3-4-money-and-coalitions.pdf'
FIG=DATA/'figures'
W=516
NAVY=colors.HexColor('#183747'); BLUE=colors.HexColor('#14758A'); GOLD=colors.HexColor('#B18A2F')
GRAY=colors.HexColor('#BBC6CC'); PURPLE=colors.HexColor('#806788'); INK=colors.HexColor('#172C35'); LIGHT=colors.HexColor('#EDF3F4')
STYLES={
 'body':ParagraphStyle('body',fontName='Times-Roman',fontSize=12.2,leading=16,textColor=INK,spaceAfter=7),
 'small':ParagraphStyle('small',fontName='Helvetica',fontSize=8.1,leading=11,textColor=colors.HexColor('#4A626D'),spaceAfter=5),
 'title':ParagraphStyle('title',fontName='Helvetica-Bold',fontSize=24,leading=27,textColor=NAVY,spaceAfter=10),
 'deck':ParagraphStyle('deck',fontName='Helvetica',fontSize=11.5,leading=15,textColor=BLUE,spaceAfter=12),
 'h2':ParagraphStyle('h2',fontName='Helvetica-Bold',fontSize=13,leading=16,textColor=NAVY,spaceAfter=7),
 'cell':ParagraphStyle('cell',fontName='Helvetica',fontSize=9,leading=12,textColor=INK),
 'head':ParagraphStyle('head',fontName='Helvetica-Bold',fontSize=8.2,leading=10.5,textColor=colors.white)
}
def read(name):
    with (DATA/(name+'.csv')).open() as f: return list(csv.DictReader(f))
R=json.loads((DATA/'report-data.json').read_text()); M=json.loads((DATA/'analysis.json').read_text()); CTX=json.loads((BASE/'portland-context.json').read_text()); ADDED=json.loads((BASE/'active-campaign-events.json').read_text())
C={x['committee_id']:x for x in R['candidates']}; N=M['names']; E=read('event-windows'); WK=read('candidate-weeks'); OV=read('donor-overlap-tests'); PAIRS=read('shared-donor-pair-amounts'); LED=read('donor-candidate-complete-ledger'); DON=read('donor-portfolios-complete'); PAY=read('candidate-payees-reviewed-groups')
CORE=['23208','23028','15109','24897','23295','23365','17629','23199']
SHORT={'23208':'Koyama Lane','23028':'Morillo','15109':'Novick','24897':'Torres','23295':'Arnold','23365':'Green','17629':'Zimmerman','23199':'Clark','24661':'Sollitt','24973':'León','24972':'Corcoran','24966':'Hallett','24979':'Otero','23411':'Smith','25040':'Evenstar','25103':'Cronlund','24615':'Goldsmith'}
def money(v,dec=0):return '${:,.{}f}'.format(float(v)/100,dec)
def pct(v):return f'{100*v:.1f}%'
def p(s,style='body'):return Paragraph(s.replace('–','-').replace('—',' - ').replace('‑','-'),STYLES[style])
def link(url,label):return f'<a href="{html.escape(url,quote=True)}" color="#14758A">{html.escape(label)}</a>'
def source(label):return next(e['url'] for e in CTX['events'] if e['label']==label)
def event(dt,cid,n=7):return next(r for r in E if r['event_date']==dt and r['committee_id']==cid and int(r['window_days'])==n)
def tbl(rows,widths=None):
    dat=[[p(str(x),'head' if i==0 else 'cell') for x in row] for i,row in enumerate(rows)]
    t=Table(dat,colWidths=widths or [W/len(rows[0])]*len(rows[0]),hAlign='LEFT')
    t.setStyle(TableStyle([('BACKGROUND',(0,0),(-1,0),NAVY),('ROWBACKGROUNDS',(0,1),(-1,-1),[colors.white,LIGHT]),('VALIGN',(0,0),(-1,-1),'TOP'),('LEFTPADDING',(0,0),(-1,-1),7),('RIGHTPADDING',(0,0),(-1,-1),7),('TOPPADDING',(0,0),(-1,-1),6),('BOTTOMPADDING',(0,0),(-1,-1),6),('LINEBELOW',(0,-1),(-1,-1),.5,GRAY)]))
    t._evidence_rows=rows;return t
def text(d,x,y,s,size=9,color=INK,anchor='start',bold=False):d.add(String(x,y,str(s),fontName='Helvetica-Bold' if bold else 'Helvetica',fontSize=size,fillColor=color,textAnchor=anchor))
def savefig(d,name):d._figure_name=name;FIG.mkdir(parents=True,exist_ok=True);renderSVG.drawToFile(d,str(FIG/(name+'.svg')));return d
def stacked(ids,name):
    h=43+len(ids)*27;d=Drawing(W,h);left=104;scale=320/30000000
    keys=[('public_cents',GOLD),('unidentified_cents',GRAY),('visible_individual_cents',BLUE),('other_visible_nonmatching_cents',PURPLE)]
    for i,cid in enumerate(ids):
        r=C[cid];y=h-27-i*27;text(d,left-9,y+4,SHORT[cid],9,anchor='end');x=left
        for k,col in keys:
            width=r[k]*scale;d.add(Rect(x,y,width,16,fillColor=col,strokeColor=None));x+=width
        text(d,510,y+4,money(r['cash_cents']),8.5,anchor='end')
    for tick in [0,10000000,20000000,30000000]:
        x=left+tick*scale;d.add(Line(x,25,x,h-8,strokeColor=colors.HexColor('#E2E9EA'),strokeWidth=.35));text(d,x,10,'$'+str(tick//100000)+'k',8,anchor='middle')
    return savefig(d,name)
def cumulative_receipts(ids,name):
    start=date(2026,3,23);end=date(2026,9,27)
    drawing=Drawing(W,286);left=57;right=13;bottom=47;top=250
    chart_width=W-left-right;chart_height=top-bottom;ceiling=10000000
    palette=[colors.HexColor(c) for c in ['#176B58','#A45B31','#315B97','#8A751E']]
    def xpos(day):return left+(day-start).days/(end-start).days*chart_width
    def ypos(cents):return bottom+cents/ceiling*chart_height
    for amount in [0,2500000,5000000,7500000,10000000]:
        yy=ypos(amount);drawing.add(Line(left,yy,W-right,yy,strokeColor=colors.HexColor('#DCE4DC'),strokeWidth=.6))
        text(drawing,left-8,yy-2,chr(36)+str(amount//100000)+'k',8,anchor='end')
    for month in [4,5,6,7,8,9]:
        day=date(2026,month,1);xx=xpos(day)
        drawing.add(Line(xx,bottom,xx,top,strokeColor=colors.HexColor('#EEF1EC'),strokeWidth=.6))
        text(drawing,xx,bottom-16,day.strftime('%b'),8,anchor='middle')
    for i,day in enumerate([date(2026,6,24),date(2026,7,6),date(2026,8,12),date(2026,9,13)],1):
        xx=xpos(day);drawing.add(Line(xx,bottom,xx,top,strokeColor=GOLD,strokeWidth=.8,strokeDashArray=[3,3]))
        drawing.add(Circle(xx,top+12,9,fillColor=GOLD,strokeColor=None))
        text(drawing,xx,top+9,str(i),8,colors.white,anchor='middle',bold=True)
    for color,cid in zip(palette,ids):
        total=0;series=[]
        for row in sorted((row for row in WK if row['committee_id']==cid),key=lambda row:row['week_start']):
            total+=int(row['nonmatching_cents'])
            day=min(date.fromisoformat(row['week_start'])+timedelta(days=6),end)
            if day>=start:series.append((day,total))
        for (day1,value1),(day2,value2) in zip(series,series[1:]):
            drawing.add(Line(xpos(day1),ypos(value1),xpos(day2),ypos(value2),strokeColor=color,strokeWidth=2.3))
        if series:drawing.add(Circle(xpos(series[-1][0]),ypos(series[-1][1]),3.2,fillColor=color,strokeColor=None))
    for index,(color,cid) in enumerate(zip(palette,ids)):
        xx=8+(index%2)*250;yy=18-(index//2)*15
        drawing.add(Line(xx,yy+3,xx+18,yy+3,strokeColor=color,strokeWidth=3))
        text(drawing,xx+23,yy,SHORT[cid],8.5)
    return savefig(drawing,name)
def legend():return p('Gold: reviewed City matches | Gray: unidentified / aggregate | Blue: itemized Individual | Purple: other identified sources','small')
def eventbars():
    ids=['23295','17629','23365'];d=Drawing(W,190);x0=102;scale=320/1200000
    for i,cid in enumerate(ids):
        r=event('2026-09-13',cid);y=148-i*55;text(d,0,y+17,SHORT[cid],10,bold=True)
        for j,(key,color,lab) in enumerate([('pre_cents',GRAY,'Before'),('post_cents',BLUE,'After')]):
            yy=y-j*19;v=int(r[key]);d.add(Rect(x0,yy,v*scale,13,fillColor=color,strokeColor=None));text(d,x0-7,yy+3,lab,8,anchor='end');text(d,x0+v*scale+6,yy+3,money(v),9)
    text(d,0,4,'Before: Sept. 6-12 | After: Sept. 14-20 | Sept. 13 excluded',9)
    return savefig(d,'september-before-after')
def weekly_heat():
    dates=sorted({r['week_start'] for r in WK if r['week_start']>='2026-01-01'});d=Drawing(W,236);left=96;cw=400/len(dates)
    text(d,0,218,'Weekly receipts excluding reviewed City matches',10,bold=True)
    for j,dt in enumerate(dates):
        if j==0 or dt[:7]!=dates[j-1][:7]:text(d,left+j*cw,197,date.fromisoformat(dt).strftime('%b'),8)
    lookup={(r['committee_id'],r['week_start']):r for r in WK}
    for i,cid in enumerate(CORE):
        y=174-i*20;text(d,left-7,y+4,SHORT[cid],8.4,anchor='end')
        for j,dt in enumerate(dates):
            val=int(lookup[(cid,dt)]['nonmatching_cents']);a=min(val/2000000,1)**.55
            col=colors.Color(.94*(1-a)+.078*a,.97*(1-a)+.46*a,.97*(1-a)+.54*a)
            d.add(Rect(left+j*cw,y,cw-1,15,fillColor=col,strokeColor=None))
    text(d,left,7,'Common scale: white = $0; darkest = $20,000/week. Final weeks provisional.',7.8)
    return savefig(d,'weekly-fundraising-heatmap')
def torres():
    d=Drawing(W,200);left=36;bottom=30;plotw=445;start=date(2026,7,27);end=date(2026,8,23);n=(end-start).days+1;cw=plotw/n
    rows=[r for r in read('candidate-daily-nonmatching') if r['committee_id']=='24897'];dd={r['date']:int(r['nonmatching_cents']) for r in rows}
    for tick in [0,1000000,2000000]:
        y=bottom+tick/2000000*132;d.add(Line(left,y,left+plotw,y,strokeColor=GRAY,strokeWidth=.4));text(d,left-4,y-3,money(tick),8,anchor='end')
    for j in range(n):
        dt=start+timedelta(days=j);v=dd.get(dt.isoformat(),0);d.add(Rect(left+j*cw,bottom,cw-2,v/2000000*132,fillColor=BLUE,strokeColor=None))
        if dt.day in [1,9,12,23]:text(d,left+j*cw+cw/2,15,dt.strftime('%b %d'),8,anchor='middle')
    x=left+(date(2026,8,12)-start).days*cw+cw/2;d.add(Line(x,bottom,x,174,strokeColor=GOLD,strokeWidth=1));text(d,x+7,169,'Aug. 12: endorsement event',8,color=GOLD)
    text(d,0,187,'Nonmatching cash by reported transaction date',10,bold=True)
    return savefig(d,'torres-before-endorsement')
def overlap():
    ids=['23208','23028','23365','15109','24897','23295','17629','23199'];sz=36;left=146;d=Drawing(W,359)
    names={'23208':'TKL','23028':'Morillo','23365':'Green','15109':'Novick','24897':'Torres','23295':'Arnold','17629':'Zimmer.','23199':'Clark'}
    counts={frozenset([r['committee_a'],r['committee_b']]):int(r['shared']) for r in OV}
    amounts={frozenset([r['committee_a'],r['committee_b']]):r for r in PAIRS}
    assert len(amounts)==len(counts)==136
    for i,cid in enumerate(ids):text(d,left-10,298-i*sz,SHORT[cid],9,anchor='end')
    for j,cid in enumerate(ids):text(d,left+j*sz+sz/2,330,names[cid],7.6,anchor='middle')
    for i,a in enumerate(ids):
        for j,b in enumerate(ids):
            y=287-i*sz;key=frozenset([a,b])
            v=counts.get(key,0);intensity=min(v/41,1);col=colors.Color(.94-.86*intensity,.97-.51*intensity,.97-.43*intensity)
            d.add(Rect(left+j*sz,y,sz-2,sz-2,fillColor=LIGHT if a==b else col,strokeColor=None))
            if a==b:
                text(d,left+j*sz+sz/2,y+14,'-',10,anchor='middle')
                continue
            pair=amounts[key]
            assert int(pair['shared_groups'])==v, (a,b)
            label_color=colors.white if v>23 else INK
            text(d,left+j*sz+sz/2,y+20,str(v),9.6,color=label_color,anchor='middle')
            text(d,left+j*sz+sz/2,y+7,money(int(pair['pair_gross_cents'])),7.1,color=label_color,anchor='middle')
    text(d,0,15,'Top: shared Individual record groups. Bottom: gross dollars given to both committees, rounded.',7.3)
    text(d,0,4,'Public matches excluded; before refunds. Pairs overlap, so do not add the cells.',7.3)
    return savefig(d,'shared-donor-matrix')
def endorsements():
    ids=['23208','23028','15109','24897','23295','23365','17629','23199','25040'];d=Drawing(W,230);left=140;cw=40
    labels={'23208':'TKL','23028':'Morillo','15109':'Novick','24897':'Torres','23295':'Arnold','23365':'Green','17629':'Zimmer.','23199':'Clark','25040':'Evenstar'}
    orgnames=['United for Portland','Future Portland','Portland for All','PROTEC17','SEIU Oregon','Oregon AFSCME']
    for i,cid in enumerate(ids):text(d,left+i*cw+cw/2,208,labels[cid],7.2,anchor='middle')
    for j,e in enumerate(CTX['endorsements']):
        y=175-j*27;text(d,left-8,y+7,orgnames[j],8.5,anchor='end')
        for i,cid in enumerate(ids):
            yes=N[cid] in e['candidates'];d.add(Rect(left+i*cw,y,cw-2,22,fillColor=BLUE if yes else LIGHT,strokeColor=None));text(d,left+i*cw+cw/2,y+7,'Y' if yes else '-',9,color=colors.white if yes else GRAY,anchor='middle')
    text(d,0,3,'Y = endorsement on reviewed organization page; dash = not listed there.',8)
    return savefig(d,'endorsement-crosscuts')
def cashbars():
    ids=sorted(CORE,key=lambda c:-C[c]['official_ending_cash_cents']);d=Drawing(W,225);x0=104;scale=310/25000000
    for i,cid in enumerate(ids):
        y=199-i*24;v=C[cid]['official_ending_cash_cents'];text(d,x0-9,y+4,SHORT[cid],9,anchor='end');d.add(Rect(x0,y,v*scale,15,fillColor=BLUE,strokeColor=None));text(d,x0+v*scale+5,y+4,money(v),8.5)
    text(d,0,1,'ORESTAR 2026 account-summary ending cash as retrieved Sept. 27, 2026.',8)
    return savefig(d,'official-cash-reserves')
def spark(cid):
    rr=sorted([r for r in WK if r['committee_id']==cid and r['week_start']>='2026-01-01'],key=lambda r:r['week_start']);d=Drawing(W,66);left=27;width=470;mx=max(int(r['nonmatching_cents']) for r in rr) or 1
    for i,r in enumerate(rr):
        x=left+i*width/len(rr);h=int(r['nonmatching_cents'])/mx*42;d.add(Rect(x,13,width/len(rr)-1,h,fillColor=GRAY if r['provisional']=='True' else BLUE,strokeColor=None))
    text(d,0,53,money(mx),7.5);text(d,left,1,'Jan',7.5);text(d,left+width,1,'Sep',7.5,anchor='end');text(d,W,57,'Nonmatching weekly cash; per-candidate scale',7.4,anchor='end')
    return savefig(d,'weekly-'+cid)

PAGES=[]
def page(title,deck,*blocks,kicker='THE DISTRICT INVESTIGATION'):
    PAGES.append(dict(title=title,deck=deck,blocks=list(blocks),kicker=kicker))
T=R['totals']; publicshare=T['public_cents']/T['cash_cents']; hidden=T['unidentified_cents']/T['nonmatching_cents']
page('Money moved on both sides of the fight',
     'Portland City Council Districts 3 and 4 | January 1, 2025 - September 27, 2026',
     p('The September attacks on Mitch Green offer an appealingly simple campaign story: controversy erupts, opponents raise money, and the race shifts. The financial record is more interesting - and less conclusive.'),
     p('<b>In the week after Green\'s old tweets were republished, reported receipts excluding City matches rose for Eli Arnold, Eric Zimmerman and Green himself.</b> Arnold and Zimmerman recorded their strongest such weeks of 2026. Green\'s receipts were almost five times the prior week. The records support simultaneous fundraising increases, not a measured transfer of political support.'),
     eventbars(),
     p('Another seemingly obvious story also breaks on inspection. Kellie Torres\'s largest nonmatching fundraising week came <b>before</b> Mayor Keith Wilson\'s endorsement event. Nearly half of nonmatching cash across these reviewed campaigns is recorded under unidentified or aggregate labels, making a complete reconstruction of individual supporters impossible from ORESTAR alone.'),
     p(f'The underlying contest is partly a contest over public financing: {money(T["public_cents"])} in reviewed City matching receipts accounts for <b>{pct(publicshare)}</b> of the {money(T["cash_cents"])} recorded cash contributions. Endorsement networks show recognizable camps, but labor organizations and individual donor portfolios cross their boundaries.'),
     p('This is an investigative data edition, not a completed history or election forecast. It analyzes 6,700 records for 17 reviewed candidate committees, maps 15 dated event anchors and supplies every disclosed source group\'s candidate ledger. Sixteen of the 33 ballot candidates remain unlinked. Recent filings remain provisional; November-December 2024 is missing. The window is just under 21 months, not two complete years.','small'),
     p('Evidence: candidate-report-metrics.csv; event-windows.csv; candidate-coverage.csv. Event date: '+link(source('Archived Green tweets republished'),'Sept. 13 publication')+'. This date source is adversarial commentary, used only as a publication anchor.','small'),kicker='PORTLAND CIVIC LAB / RESEARCH EDITION 1')

for dist in [3,4]:
    ids=[r['committee_id'] for r in R['candidates'] if r['district']==dist]
    if dist==3:
        paragraphs=[
          '<b>Koyama Lane leads the linked District 3 field in total cash receipts, but Novick leads when reviewed City matching receipts are removed.</b> Those are different fundraising achievements. Koyama Lane\'s $200,000 in recorded matches gives her total a much larger public component than Novick\'s $100,000.',
          'Koyama Lane recorded $277,809.22 in cash contributions, Morillo $239,618.67, Novick $190,893.99 and Torres $170,361.00. On the nonmatching measure the order becomes Novick ($90,893.99), Koyama Lane ($77,809.22), Torres ($72,361.00), then Morillo ($64,973.67). Nonmatching does not mean exclusively private individuals: it still includes aggregate receipts, committees, self/family and other sources.',
          'The strategic question is not simply who has the largest donors. It is who combines match-eligible participation, money beyond those matches, and resources still available for the final campaign. Smaller linked campaigns should not be confused with the unlinked candidates: León and Sollitt have reported public payments; an unlinked candidate has an unknown total here.'
        ]
    else:
        paragraphs=[
          '<b>Arnold has both the largest total cash receipts and the largest verified cash reserve among the reviewed District 4 campaigns.</b> But his nonmatching receipts are only $738.15 above Zimmerman\'s. The much larger headline gap mostly reflects $200,000 in recorded matches for Arnold versus $88,100 for Zimmerman.',
          'Green has $240,577.86 in cash receipts, including $162,401.00 in reviewed matches. His $78,176.86 nonmatching total is below Arnold\'s $85,681.15 and Zimmerman\'s $84,943.00, but above Clark\'s $72,376.45. Removing matches compresses the field considerably; it does not reveal a single dominant private fundraising operation.',
          'Smith, Evenstar and Cronlund have meaningful public support in the ledger, too. Smith\'s $103,227 total includes $84,150 in matches. Treating his 12 visible Individual groups as his entire donor base would miss the basic design of this reporting system: many smaller contributions are aggregated.'
        ]
    page(f'District {dist}: two fundraising races',
         'Total cash receipts and money outside reviewed City matches tell different stories.',
         stacked(ids,'district-'+str(dist)+'-funding-mix'),legend(),*[p(x) for x in paragraphs],
         p('All amounts are gross cash contributions in the full snapshot window, before refunds. Not election-cycle totals. Cash receipts exclude loans and noncash support. Evidence: candidate-report-metrics.csv; public-matching-receipts.csv.','small'))

page('The rules are part of the story',
     'A June funding decision changed the resources candidates could pursue.',
     p('A scandal timeline alone misses an event with a direct financial mechanism. The City\'s June 24, 2026 notice restored statutory matching caps for this election after additional one-time funding. For council candidates, the published tiers became $100,000, $200,000 and $300,000. Earlier notices describe reductions and a partial restoration. '+link('https://www.portland.gov/smalldonorelections/program-notices','City program notices')+'.'),
     p('The current guide describes ten-to-one matching on eligible Portland-resident contributions up to $25, with qualification and higher-tier donor thresholds. That makes two distinct skills financially valuable: persuading more eligible people to give, and raising amounts not supplied by matching. A City payment may reimburse a stock of earlier qualifying gifts; its deposit week is not a week in which thousands of voters suddenly changed their minds. '+link('https://www.portland.gov/smalldonorelections/how-run-under-small-donor-elections','City participation guide')+'.'),
     tbl([['Measure','What it can tell us','What it cannot tell us'],['Reviewed City receipts',money(T['public_cents'])+' in recorded matches','Which underlying small gift generated each public dollar'],['Nonmatching cash',money(T['nonmatching_cents'])+' outside reviewed matches','A pure measure of private individuals or political enthusiasm'],['Unidentified share',money(T['unidentified_cents'])+'; '+pct(hidden)+' of nonmatching cash','Who the underlying contributors were'],['Itemized Individual groups','1,117 conservative record groups across both districts','All donors, verified unique people, or likely voters']], [118,191,207]),
     p('A useful counterexample is Novick: he leads the reviewed District 3 candidates in nonmatching cash and has 204 visible Individual groups, yet trails Koyama Lane and Morillo in total cash. Public financing changes what a fundraising lead means. This is a descriptive accounting result, not proof that one coalition is more grassroots than another.'),
     p('The City\'s live distribution table and ORESTAR do not always show the same amount. For example, the City lists $193,778 distributed for Morillo while this frozen ORESTAR snapshot contains $174,645 in reviewed matching receipts. That $19,133 difference is retained for reconciliation, not added to her total. Different reporting times or records may explain it. '+link('https://www.portland.gov/smalldonorelections/all-about-2026-election','City 2026 table')+'.'),
     p('Evidence: candidate-report-metrics.csv and the existing public-matching-receipts.csv / portland-public-financing.csv. No candidate-specific matching eligibility determination is made here.','small'))

page('What happened after the tweets?',
     'The increase is visible. The cause is not identified.',
     eventbars(),
     p('The seven-day comparison excludes September 13 itself. Arnold rose from $1,740 to $9,190; Zimmerman from $6,510 to $10,825; Green from $1,710.66 to $8,491.48. These are reported cash receipts outside reviewed matching payments. Each also increased on the narrower itemized-Individual measure: Arnold $350 to $3,900; Zimmerman $4,925 to $8,255; Green $577.66 to $2,403.32.'),
     p('The longer 14-day window has the same direction for all three: Arnold $5,145 to $12,355; Zimmerman $10,255 to $16,671; Green $2,658.32 to $10,293.93. The second week is even less mature. These comparisons are useful as checks against a one-sided backlash narrative, not as estimates of what any controversy caused.'),
     p('The sequence contains several overlapping events: a Sept. 13 republication, the police chief\'s Sept. 16 response, the billboard reported Sept. 18, and ongoing campaign activity. WW also reported Green\'s explanation that the old posts arose in the context of police violence and accountability. That response belongs alongside the criticism. '+link(source('Police chief responds to Green tweets'),'WW, Sept. 16')+'.'),
     p('<b>Why we cannot say the money moved from Green to his opponents:</b> these are different receipt streams, not a panel of donor intentions or voters. We do not observe people who considered giving but did not. Aggregate rows conceal underlying gifts. Campaign appeals, the approach of voting, regular giving and filing schedules are alternative explanations.'),
     p('Clark\'s last nonmatching transaction is Sept. 8 and Torres\'s Sept. 13 in this snapshot. Their apparent zeroes afterward are a disclosure warning, not evidence of a fundraising collapse. Current-version cash filing lags also differ substantially across campaigns.','small'))

page('The billboard does not have a clean test',
     'Moving an uncertain installation date by a few days changes the answer.',
     tbl([['Assumed start','Arnold: before / after','Zimmerman: before / after','Green: before / after']]+[
       [f'Sept. {day}',*[money(next(r for r in read('billboard-date-sensitivity') if r['committee_id']==cid and r['assumed_billboard_onset']==f'2026-09-{day}')['pre_cents'])+' / '+money(next(r for r in read('billboard-date-sensitivity') if r['committee_id']==cid and r['assumed_billboard_onset']==f'2026-09-{day}')['post_cents']) for cid in ['23295','17629','23365']]] for day in range(14,19)
     ],[80,145,146,145]),
     p('Each row compares the seven days before with the seven days after its assumed start date, excluding the start day. For Arnold, the apparent response changes from an increase to a decrease between the Sept. 16 and Sept. 17 assumptions. Zimmerman\'s changes direction sooner. Green increases under every tested date, but that still does not identify the billboard as a cause.'),
     p('WW\'s Sept. 18 story describes the billboard as installed earlier that week; it does not give a verified installation day. It identifies Ditch Mitch as the advertiser and reports United for Portland Action Fund as its biggest funder according to the PAC website. WW also includes Green\'s response that his policy work made him a target. '+link(source('Anti-Green billboard reported'),'WW billboard report')+'.'),
     p('<b>The frozen transaction dataset contains no Ditch Mitch filer rows.</b> The news account establishes an investigative lead; it does not fill the missing financial ledger. We cannot price the billboard, identify every funder or reconcile its support/oppose allocation from this snapshot. Nor can we allocate every dollar raised by a larger outside committee to this contest.'),
     p('The lesson is substantive, not just statistical: an attack campaign can coincide with money mobilizing on both sides, and the treatment date may itself be ambiguous. A precise-looking percentage attributed to the billboard would disguise those facts.'),
     p('Evidence: billboard-date-sensitivity.csv; outside-committees.csv. All comparisons on this page are provisional and affected by overlapping events and reporting delays. Dates refer to 2026.','small'))

page('Torres: the gifts, City deposit and endorsement',
     'Her largest reported week shows why gifts, City matching and event dates must be separated.',
     torres(),
     p('Torres\'s strongest 2026 week outside reviewed matches was August 3-9: <b>$19,335</b>. All 54 nonmatching records in that week carry an August 9 transaction date. Forty-seven are exactly $350, accounting for $16,450; one aggregate row supplies another $1,585. These are records, not 54 independently verified people.'),
     p('The mayor\'s endorsement event is dated Wednesday, August 12 in an August 14 secondary account of Oregonian reporting. The recorded contribution date is three days earlier. It would therefore be wrong to describe this spike as money raised after the public endorsement event. '+link(source('Wilson endorsement event for Torres'),'Hoodline, Aug. 14; secondary timing source')+'.'),
     p('The same week also contains a separate <b>$72,000 City matching receipt dated August 4</b>. A chart that mixed public deposits and nonmatching gifts would show $91,335 and obscure two different financial events. The August 9 batch alone represents 26.7% of Torres\'s full-window nonmatching cash.'),
     p('The City caps an individual\'s contribution to a participating campaign at $350 per election; Torres is listed as certified. Across these 17 campaigns, 426 contribution records dated 2026 are exactly $350. The repeated amount alone does not identify a fundraiser. The appeals behind the August 9 receipts remain unverified. Current-version records show filing dates of Aug. 12, Aug. 27 and Sept. 15; an amended filing date does not reveal when a first version appeared. '+link('https://www.portland.gov/code/2/16/120','City rule')+'; '+link('https://www.portland.gov/smalldonorelections/all-about-2026-election','official candidate status')+'.'),
     p('Evidence: candidate-daily-nonmatching.csv (Torres, 2026-08-09); transactions.csv; public-matching-receipts.csv. All 54 transaction IDs are preserved in the daily evidence row.','small'))

page('Strong weeks came at different times',
     'The election is not one common fundraising wave.',
     weekly_heat(),
     tbl([['Candidate','Strongest 2026 week','Nonmatching cash','Interpretation'],['Koyama Lane','Aug. 24-30','$4,896.94','Before September tweet episode'],['Morillo','June 22-28','$6,757.33','Near match-cap restoration / Moda debate'],['Novick','June 1-7','$6,150.00','Before August campaign conflicts'],['Torres','Aug. 3-9','$19,335.00','Aug. 9 reported-date concentration'],['Arnold','Sept. 14-20','$9,190.00','Recent; overlaps several events'],['Green','July 20-26','$9,030.12','Before August fire reporting'],['Zimmerman','Sept. 14-20','$10,825.00','Recent; overlaps several events'],['Clark','Mar. 16-22','$4,300.00','Much earlier fundraising peak']],[100,99,92,225]),
     p('These maxima describe the records; they do not explain every peak. Green\'s largest week includes $6,180 on July 24. In a 14-day window around the Aug. 4 fire report, his nonmatching cash falls from $12,856 to $1,461.82. That is consistent with a slowdown, but the unusually strong prior period makes a simple scandal-effect interpretation unreliable. A campaign solicitation calendar is still missing.'),
     p('Evidence: strongest-weeks.csv; candidate-weeks.csv; candidate-daily-nonmatching.csv. Week means Monday-Sunday. The initial week crossing Jan. 1, 2026 is excluded from 2026 peak rankings. Gray/aggregate receipts have reported dates, not recoverable dates for each underlying donor gift.','small'))

page('Cumulative giving: District 3',
     'Four leading linked committees accumulate nonmatching cash at different speeds.',
     cumulative_receipts(['23208','23028','15109','24897'],'district-3-cumulative-nonmatching'),
     p('The line is gross cash outside reviewed City matches, reported by transaction date and accumulated from January 1, 2025. The displayed axis begins March 23, 2026 without resetting its prior balance. Novick eventually leads this measure, while Koyama Lane leads total cash once City matching is counted. Torres has the steepest single-week jump in early August, but that batch precedes the public Wilson endorsement event.'),
     p('<b>Numbered public anchors:</b> 1 June 24, matching-cap restoration and Moda work session; 2 July 6, reported building-trades endorsement withdrawals from Green; 3 August 12, Moda term-sheet vote and Torres endorsement event; 4 September 13, Green tweets republished. A marker is not a causal estimate.','small'),
     p('Evidence: candidate-weeks.csv; candidate-cumulative-weekly.csv; expanded event ledger on following pages.','small'))

page('Cumulative giving: District 4',
     'The late-campaign increases are not confined to one candidate.',
     cumulative_receipts(['23295','23365','17629','23199'],'district-4-cumulative-nonmatching'),
     p('Arnold, Green, Zimmerman and Clark have different accumulation paths. Green has a strong July interval before the September attacks; Arnold and Zimmerman climb most sharply in the weeks around mid-September, but Green also records an increase. The last Clark nonmatching transaction in this frozen snapshot is September 8; the flatter tail is not proof that donations stopped.'),
     p('<b>Numbered public anchors:</b> 1 June 24, matching-cap restoration and Moda work session; 2 July 6, reported building-trades endorsement withdrawals from Green; 3 August 12, nonbinding Moda term-sheet vote; 4 September 13, Green tweets republished. The billboard was reported September 18, but its exact installation day is unknown, so it is not drawn as a precise treatment line.','small'),
     p('The line is nonmatching gross cash accumulated from January 1, 2025 and shown from March 23, 2026. City matching and refunds are separate. Recent weeks are provisional. Evidence: candidate-weeks.csv; candidate-cumulative-weekly.csv; billboard-date-sensitivity.csv.','small'))

page('Earlier controversies were not a single wave',
     'The 2025 Peacock texts and the 2026 tweets are different events.',
     p('The first Peacock group-text investigation was published on August 6, 2025. It should not be combined with the September 2026 resurfacing of Green\'s older tweets. The August 2025 date also coincides with an official partial restoration of matching caps - an immediate example of competing explanations in an event study. '+link(source('First Peacock group-text investigation'),'WW, Aug. 6, 2025')+'; '+link('https://www.portland.gov/smalldonorelections/program-notices','City dated notices')+'.'),
     tbl([['Candidate','Aug. 6, 2025: before / after','Oct. 8, 2025: before / after']]+[[SHORT[cid],money(event('2025-08-06',cid,14)['pre_cents'],2)+' / '+money(event('2025-08-06',cid,14)['post_cents'],2),money(event('2025-10-08',cid,14)['pre_cents'],2)+' / '+money(event('2025-10-08',cid,14)['post_cents'],2)] for cid in CORE],[112,202,202]),
     p('These are symmetric 14-day windows, excluding the event day, outside reviewed City matches. Around the first publication, Clark rises from $350 to $875; Zimmerman falls from $500 to zero; Green rises from zero to $4,331.12. Koyama Lane and Morillo decline. That is not a broad, uniform surge for a moderate opposition.'),
     p('Around the October 8 follow-up publication, small baselines generate dramatic ratios without much money. Morillo rises from $15 to $151; Green from $165 to $708. Clark falls from $2,405 to $2,035 and Zimmerman from $1,200 to $25. A percentage-only account would overstate some of these shifts. '+link(source('Additional Peacock messages reported'),'WW follow-up')+'.'),
     p('Zero here means no such reported receipts for that already-linked committee in the chosen dates. It does not mean no political support, and it does not resolve whether a campaign was actively soliciting funds then. We have not reconstructed the campaigns\' appeal calendars or the missing end of 2024.'),
     p('Evidence: event-windows.csv includes 7-, 14- and 28-day versions for every event and all 17 linked committees, including incomplete-window flags. No causal effect is estimated.','small'))

page('Shared donors form recognizable clusters',
     'The strongest measured overlap crosses district lines.',
     overlap(),
     p('Koyama Lane and Green share 41 strict Individual record groups; Morillo and Green share 35; Koyama Lane and Morillo share 33. The largest pair therefore links a District 3 incumbent to a District 4 incumbent. It describes a donor network extending beyond a single ballot, not a direct contest for the same three seats.'),
     p('Arnold and Zimmerman share 26 groups; Zimmerman and Clark 21. Those are meaningful financial connections inside District 4. They do not establish coordination, nor do they tell us which candidate a donor would rank first. A donor can support several eventual winners in Portland\'s three-seat districts.'),
     p('The matrix uses exact conservative fingerprints. Loosening the rule to same-name matching changes Torres-Zimmerman from <b>5 to 43</b> shared groups. That is a warning about unresolved identity links, not permission to assert 43 shared people. We retain the groups separately and publish the review queue.'),
     p('Evidence: donor-overlap-tests.csv; shared-donor-pair-amounts.csv (exact cents, each side, refunds and source-group IDs); identity-review-queue.csv; donor-candidate-complete-ledger.csv. Full matrix: all 136 pairs of 17 linked committees. Unidentified categories are excluded, never turned into common donors.','small'))

page('Do the clusters exceed ordinary popularity?',
     'A degree-preserving network test asks a narrower question than a political label.',
     p('Popular candidates will share donors by chance; prolific donors naturally connect more campaigns. We tested observed overlap against networks that preserve both quantities: each candidate\'s number of visible Individual groups and each group\'s number of supported candidates. The test shuffles the connections, not the dollar amounts.'),
     tbl([['Pair','Observed','Null mean','Adjusted q']]+[[SHORT[r['committee_a']]+' / '+SHORT[r['committee_b']],r['shared'],f"{float(r['null_mean']):.2f}",f"{float(r['bh_q']):.4f}"] for r in OV[:5]]+[[SHORT[r['committee_a']]+' / '+SHORT[r['committee_b']],r['shared'],f"{float(r['null_mean']):.2f}",f"{float(r['bh_q']):.4f}"] for r in OV if {r['committee_a'],r['committee_b']}=={'23365','25040'}],[258,63,94,101]),
     p('The first five listed pairs each exceed every sampled null overlap in 2,997 draws. Their adjusted q-values are about 0.0091. Green-Evenstar also passes the exploratory 0.05 threshold, with only six observed shared groups and q about 0.0454. The latter is much closer to the threshold and should not carry the same narrative weight.'),
     p('This supports a modest conclusion: in the visible network, certain pairs share more donor groups than candidate popularity and donor breadth alone would predict. It does <b>not</b> identify ideological loyalty, common management, coordinated spending or a causal alliance. Endorsements and documented joint campaigning supply separate evidence of political relationships.'),
     p('We ran three independently seeded chains of 999 draws, with 13,000 successful burn-in swaps per chain and 1,300 successful swaps between draws. Chain means and lag-1 correlations are published. For Koyama Lane-Green, chain means are 5.62, 5.75 and 5.69 versus 41 observed. These diagnostics are reassuring about repeatability, not proof of perfect mixing.'),
     p('All 136 pair tests form one Benjamini-Hochberg correction family. Minimum attainable simulation p is 1/2,998; it is not zero. A preliminary single-chain run was superseded to fix hash-order reproducibility and use a three-chain protocol. Missing aggregate donors, address variation and unreviewed identity links remain more important substantive limitations than additional decimal places.','small'))

page('Endorsements are not two sealed camps',
     'Labor support crosscuts the familiar coalition story.',
     endorsements(),
     p('United for Portland\'s reviewed list includes Novick, Torres, Clark and Zimmerman; Future Portland Action Fund also includes Arnold. Portland for All and PROTEC17 list Koyama Lane, Morillo, Green and Evenstar in these two districts. Those are documented organizational choices, not ideology assigned to individual contributors.'),
     p('<b>SEIU endorses all six incumbents.</b> Oregon AFSCME\'s reviewed list includes Koyama Lane, Novick, Clark, Evenstar, Green and Zimmerman. The differences matter: a claim that “labor” simply backs one side erases distinctions between organizations and between individual candidates.'),
     p('The visible committee-donor portfolios also cross lines. IBEW Local 48 Small Donor PAC records $2,225 across Green, Zimmerman, Clark and Novick. The Iron Workers District Council records $2,000 across Morillo, Green, Clark and Zimmerman. Teamsters 37 Political Fund records $1,050 across Green, Novick and Zimmerman. These are committee-ID links, not guessed name matches.'),
     p('It is reasonable to investigate whether an organization is supporting a governing coalition, maintaining relationships, reflecting members\' preferences or responding to candidates\' records. The donations alone do not choose among those explanations. “Hedging” is a hypothesis requiring stated strategy or interviews, not a transaction type.'),
     p('Sources: '+ '; '.join(link(e['url'],e['organization']) for e in CTX['endorsements'])+'. Portland for All '+link('https://www.portlandforall.org/district4','District 4 list')+'. Pages checked Sept. 27; announcement dates are not established. This is a six-organization comparison, not every endorsement. Evidence: portland-context.json; donor-portfolios-complete.csv.','small'))

page('Frequent is not the same as large',
     'Every disclosed source group has a portfolio; frequency and dollars answer different questions.',
     tbl([['Reported individual group','Records / dates','Gross cash','Candidate portfolio']]+[[r['reported_name'],str(r['contribution_records'])+' / '+str(r['distinct_reported_dates']),money(r['gross_cents'],2),r['candidate_portfolio'].replace(' records / ',' rows / ')] for r in R['frequency_leaders'][:4]],[122,75,74,245]),
     p('Christopher Schweizer and Toby Hodges tie at 17 contribution records, but their gross totals differ: $696 versus $175.94. Schweizer\'s exact record group also has a $56 Morillo refund, leaving $640 in gross receipts less observed refunds. Hodges\'s 17 records occur on seven calendar dates across three candidates. Neither 17 rows nor seven dates is a count of separate political decisions.'),
     p('The Hodges records include repeated $6.66 amounts on the seventh of successive months and contributions spread across Koyama Lane, Morillo and Green. A recurring-payment arrangement is a plausible explanation of the calendar pattern; it is not confirmed. We do not infer a personal ideology or motive from a pattern of amounts.'),
     p('Across all 1,117 visible Individual groups, 172 have multiple records to the same candidate, but only <b>148 have contributions on multiple reported dates to that candidate</b>. The distinction matters for cases such as James M Labbe: two Green records totaling $1,225 share a single Dec. 10, 2025 date.'),
     p('The complete ledger contains 1,148 visible nonmatching source groups, including organizations, with 1,344 donor-candidate relationships. It lists each candidate, contribution count, distinct dates, gross amount, observed same-group refunds, annual subtotals, and every gift\'s date, amount and transaction ID. Aggregate categories are deliberately absent from this donor list.'),
     p('Evidence: donor-portfolios-complete.csv; donor-candidate-complete-ledger.csv; named-case-evidence-review.csv. Names identify public campaign-finance record groups, not externally verified people. No residential street addresses are published.','small'))

page('Multi-candidate giving: hedges, slates, or both?',
     'The ledger identifies portfolios. Motives remain open.',
     tbl([['Reported group','Gross cash','Recorded recipients'],['Warren Rosenfeld','$2,014.45','Novick $875; Clark $439.45; Zimmerman $350; Arnold $350'],['Donald Singer','$1,450.00','Novick $350; Clark $350; Zimmerman $400; Arnold $350. A $50 Zimmerman refund is also observed.'],['Mark Goodman','$1,400.00','Novick $350; Zimmerman $350; Clark $700'],['Portland Association of Teachers PAC','$2,975.00','Koyama Lane, Morillo and Green'],['IBEW Local 48 Small Donor PAC','$2,225.00','Green, Zimmerman, Clark and Novick']],[159,79,278]),
     p('Rosenfeld is the largest gross-dollar group among the Individual groups with repeated records to a candidate. But his three Novick records all carry Dec. 22, 2025. The $875 total is observable; three separate giving occasions are not. These full-window portfolios can span reporting or program periods and should not be turned into contribution-limit allegations.'),
     p('There are <b>131 visible Individual groups supporting more than one of the 17 reviewed candidates</b>, or 11.7% of those groups. That figure omits unknown small donors and any real people split into multiple address fingerprints. It is a property of disclosed records, not a survey of voters.'),
     p('A donor supporting Clark, Zimmerman and Arnold might want all three to win, might be unsure which will win, might favor different issues in each candidate, or might simply respond to several invitations. In a three-winner contest, spreading money does not inherently mean betting against one\'s first choice. Cross-district portfolios are even less naturally interpreted as hedges.'),
     p('The next reporting step is to ask high-frequency and cross-coalition donors what they intended, and compare their explanations with dated appeals and endorsements. No outreach was sent for this edition. We publish the observed portfolios and competing explanations rather than inventing motives.'),
     p('Evidence: donor-portfolios-complete.csv; donor-candidate-complete-ledger.csv; named-case-evidence-review.csv. Organizational groups use ORESTAR committee IDs. Individual groups remain provisional.','small'))

page('Money raised is not money left',
     'Official balances show a different kind of advantage.',
     cashbars(),
     p('Arnold\'s official ending cash of $229,675.22 is about 2.19 times Green\'s $104,923.78. That is not simply their receipts gap: Green has also recorded much more cash spending in the observed window, $134,649.66 versus Arnold\'s $55,672.73. Spending sooner can mean organizing earlier, settling older costs or many other things; the balance alone does not evaluate the purchase.'),
     p('Koyama Lane has paid $146,908.49, the largest cash-payment total of the reviewed candidates. Morillo has paid $92,581.31; Novick $29,285.07; Torres $34,304.02; Clark $26,691.23; Zimmerman $17,818.45. These totals span Jan. 2025 onward and are not all necessarily costs of the current campaign.'),
     p('<b>Zimmerman\'s account summary separately reports $45,000 in outstanding loans</b> and $826.17 in payables. No loan-receipt records for him occur inside this snapshot. The outstanding balance must not be erased simply because the observed receipt window begins later. Other candidates have smaller payables or personal-expenditure balances listed in their profiles.'),
     p('These balances come from official 2026 account summaries whose cash contributions, payments and net changes reconcile with the snapshot. We did not assume beginning cash was zero. They are reported balances, not an audit of bank statements or a forecast of how long a campaign can operate. A negative personal-expenditure balance for Green is retained as a source anomaly, not silently corrected.'),
     p('Evidence: candidate-report-metrics.csv; account-summaries.csv; candidate-accounting-bases.csv. Loans, payables, personal expenditures, refunds and noncash support are kept separate.','small'))

page('The spending network has its own structure',
     'Payments reveal suppliers, not profit or coordination.',
     tbl([['Candidate','Selected large reported payees','Cash payments'],['Koyama Lane','Iris Hodge; Gusto; Infused LLC','$32,571.25; $22,816.74; $18,552.10'],['Morillo','Team Mars Consulting; Gal Pal Productions','$23,316.64; $22,188.50'],['Green','Margaux Weeke; Leslie McCollom Fontaine; Infused LLC','$38,429.40; $27,452.30; $13,525.50'],['Arnold','Purple State Strategies Inc; C &amp; E Systems','$11,956.49; $11,770.67'],['Zimmerman','C &amp; E Systems; Purple State Strategies Inc','$6,120.16; $4,304.91'],['Clark','C &amp; E Systems; Rebecca Stavenjord','$10,229.12; $10,000.00'],['Novick','Kathleen Shriver; C &amp; E Systems','$9,575.69; $7,573.50'],['Torres','City Wins LLC; Morel Ink','$9,000.00; $6,166.00']],[88,265,163]),
     p('The repeated names suggest two useful reporting paths. Arnold and Zimmerman both pay Purple State Strategies; several campaigns pay C &amp; E Systems. Green and Koyama Lane both pay Infused LLC. These overlaps can explain the campaign-services market without establishing that campaigns coordinated legally or politically.'),
     p('A payee such as a payroll processor may pass money through to workers or tax authorities. An individual payee may receive wages, reimbursement or a contract payment. A company\'s gross receipts are not its profit. The source descriptions and transaction associations must be reviewed before labeling all of these dollars “consulting” or attributing a shared campaign strategy.'),
     p('This table aggregates the displayed reported payee names within each candidate committee; exact fingerprint groups and transaction IDs remain available in the evidence. It counts cash-payment records only. A payable and its subsequent payment are not summed as two purchases.'),
     p('Evidence: candidate-payees-reviewed-groups.csv; transactions.csv. The named amounts were checked against the source-name aggregation, while the downloadable table preserves conservative entity groups. No beneficial-ownership or organizational affiliation claim is made.','small'))

page('What the outside-money record cannot yet tell us',
     'Missing detail is most consequential where the political claims are strongest.',
     p('Candidate-controlled receipts are not the entire race. The billboard is an obvious example, but the frozen data do not yet support a complete race-level accounting of independent spending. Such an accounting requires detailed targets, support/oppose allocations and transaction associations, not just a committee\'s overall spending total.'),
     tbl([['Selected outside committee','Observed cash receipts','Observed record dates / warning'],['United for Portland Action Fund','$45,061.33','12 records; latest May 7, 2026. Not a complete September financing trace.'],['Go Portland Go','$166,355.00','145 records; latest Sept. 19, 2026. Activity may concern other races.'],['Future Portland PAC','$13,140.00','73 records; latest Sept. 8, 2026. Do not conflate PAC and similarly named organizations.'],['Ditch Mitch','Unknown in this snapshot','No filer rows found. Missing is not zero.']],[160,109,247]),
     p('The reported source names in Go Portland Go include Partnership for Progress ($32,000), Timothy Boyle ($25,000) and Jeff Swickard ($25,000). Those are leads in the outside-committee ledger, not money that can be assigned wholesale to Arnold, Torres or any other candidate. A documented target allocation is needed first.'),
     p('The initial billboards story and the newer outside committee should be reconciled with subsequent filings before making a named money-trail conclusion. This edition deliberately stops short of claiming who ultimately paid for each message. It also does not label organizational money as conservative solely because it opposes one incumbent.'),
     p('The same boundary applies to governance. A donor\'s appearance in the ledger is not evidence of a contract, policy favor or quid pro quo. Any such story needs a verified identity, a dated government record, a relevant decision and alternative explanations.'),
     p('Evidence: outside-committees.csv. Counts and dates describe the snapshot, not the complete history of those organizations. Source for the billboard connection: '+link(source('Anti-Green billboard reported'),'WW, Sept. 18')+'.','small'))

# Concise, source-backed event catalogue; all event windows are downloadable.
event_notes={
 'City announces reduced public-matching caps':'Institutional funding shock. Compare public and nonmatching streams separately.',
 'First Peacock group-text investigation':'Mixed 14-day responses; no uniform opposition surge in linked committees.',
 'City partially restores public-matching caps':'Same date as Peacock publication; a confound, not a second independent experiment.',
 'City attorney response to group-text complaints':'Source reports legal advice and timing issues; no finding of wrongdoing inferred.',
 'Additional Peacock messages reported':'Small starting amounts create large percentage changes; publish dollars too.',
 'City announces full restoration of 2026 matching caps':'Direct change in available public-financing caps; not itself a cash receipt.',
 'Moda Center funding protest and Chamber event':'Policy and campaign mobilization overlap the matching-cap announcement.',
 'Reporting on Green backyard fire':'Green 14-day receipts decline from a high prior period; causal attribution unsupported.',
 'Moda Center deal becomes campaign issue':'Joint campaign activity is separately reported; its fundraising effect is unidentified.',
 'Wilson endorsement event for Torres':'Aug. 9 receipt batch precedes this event. Original reporting still needs direct verification.',
 'City certifies November ballot':'Official roster defines 33 candidates; 17 have reviewed finance links.',
 'Archived Green tweets republished':'7-day receipts increase for Arnold, Zimmerman and Green; recent and provisional.',
 'Police chief responds to Green tweets':'Overlaps original publication, billboard and active campaigning.',
 'Anti-Green billboard reported':'Installation date uncertain within Sept. 14-18; start-date sensitivity reverses some comparisons.',
 'Zenith franchise-transfer council vote':'Only four following days observed. No credible fundraising-response estimate.'
}
event_notes.update({
 'Mayor proposes a $120 million Moda Center package':'A policy proposal, not a campaign receipt. Its fundraising impact is not identified.',
 'Governor signs arena-related SB 1501':'State-level financing context. Simultaneous campaign activity prevents attribution.',
 'Council approves a budget to close a shortfall':'Major City decision. Committee receipts nearby cannot establish a budget response.',
 'Council holds first Moda Center work session':'First formal Council work session in the official timeline.',
 'Building-trades endorsement withdrawals from Green reported':'The publication date anchors the report; exact withdrawal dates remain unverified.',
 'Draft Moda Center term sheet delivered to Council':'Formal negotiating step. Compare with other events and appeals in the same period.',
 'District 3 challenger Mullen exit reported':'Publication date, not proven withdrawal date. His committee is not among the 17 linked.',
 'County delays Moda Center funding vote':'Another government action in an already active campaign period.',
 'Council holds Moda Center work session':'Second work session in the official timeline; not an independent experiment.',
 'Council debates amendments to the Moda term sheet':'Participant account; many contemporaneous appeals or gifts could affect receipts.',
 'Council approves nonbinding Moda term sheet, 8–4':'Official vote. Nonbinding term sheet is neither final lease nor campaign contribution.',
 'Green, Morillo and Avalos publish response to Moda vote':'Official dated statement after the vote; its separate fundraising effect is unknown.',
 'City filing deadline for incumbent candidates':'Official ballot-access deadline, not itself evidence of donor reaction.',
 'City filing deadline for new candidates':'Official ballot-access deadline. Missing committee links remain missing.'
})
all_events=sorted(CTX['events']+ADDED['events'],key=lambda e:(e['date'],e['label']))
event_groups=[
 ('2025 through May 2026',[e for e in all_events if e['date']<'2026-06-01']),
 ('June and July 2026',[e for e in all_events if '2026-06-01'<=e['date']<'2026-08-01']),
 ('August 2026',[e for e in all_events if '2026-08-01'<=e['date']<'2026-09-01']),
 ('September 2026',[e for e in all_events if e['date']>='2026-09-01'])
]
assert sum(len(events) for _,events in event_groups)==29
for period,evs in event_groups:
    page('The expanded event ledger: '+period,
         'Sourced public date anchors, not a census of fundraisers, appeals or voter contacts.',
         tbl([['Date','Event and source','What this date can tell us']]+[[e['date'],link(e['url'],e['label'])+'<br/><font size="7">'+html.escape(e['date_kind'])+'</font>',event_notes[e['label']]] for e in evs],[75,205,236]),
         p('All 29 anchors have seven-day nonmatching-cash comparisons in campaign-dynamics.json. The original 15 also have 7-, 14- and 28-day comparisons in event-windows.csv. Event dates are excluded; incomplete post-windows stay missing. Overlapping events cannot be treated as independent experiments.','small'),
         p('Unresolved: exact billboard installation day; every fundraiser, appeal and endorsement announcement; and the original property-tax story date. A nearby change in receipts does not establish a cause.','small'),kicker='CHRONOLOGY / SOURCE LEDGER')

# Individually written candidate readings complement mechanically generated metrics.
READINGS={
 '23208':'The linked District 3 total-cash leader has a large public-financing component and the largest cash-payment total in these two districts. Her strongest strict donor overlap is with Green across the district boundary. Visible repeat giving is substantial, but a majority of her nonmatching cash is unidentified, so itemized donor counts are an incomplete measure of breadth.',
 '23028':'Morillo combines public matching with a repeat-giving network that overlaps Koyama Lane and Green. Her best nonmatching week arrives in June, not during the September tweet episode. The City distribution table exceeds the matching receipts located in this frozen ORESTAR snapshot; that discrepancy remains explicit.',
 '15109':'Novick leads reviewed District 3 candidates in nonmatching cash and visible Individual groups, while ranking behind Koyama Lane and Morillo on total cash. His relatively low observed payments leave a substantial reported balance. Broad itemized support is not proof of a larger overall donor base because aggregate reporting differs.',
 '24897':'Torres\'s concentrated August 9 receipt batch is the defining fundraising event in her observed campaign. It precedes the mayor\'s endorsement event. Her last nonmatching receipt is September 13, so the later apparent silence must not be interpreted as a collapse. Same-name donor overlap is unusually sensitive to identity matching.',
 '24661':'Most recorded cash comes from City matches; most nonmatching cash is aggregate. Eight visible Individual groups do not describe the true size of his supporting public. The last observed nonmatching date is August 26 and current-version filing lags are long, limiting late-campaign comparisons.',
 '24973':'Public matches make up most of the recorded total. A small visible donor network and substantial aggregate share preclude reliable claims about concentration among all supporters. Noncash support is listed separately rather than added to cash available to spend.',
 '24972':'The linked committee has a small observed cash operation, not an absent one. Its records include aggregate contributions and a contribution refund. The account summary also reports unreimbursed personal expenditures, which should not be overlooked when comparing resources.',
 '24966':'The official balance is small relative to reported payables. This is a financial constraint visible in the account summary, not a prediction that the campaign cannot continue. A small loan receipt is separate from contributions; the pipeline does not count it as donor fundraising.',
 '24979':'Only one itemized Individual group appears, while most recorded cash is aggregate. That is too little identity visibility to describe a donor coalition. No reviewed matching receipt is in this snapshot; that does not by itself establish the candidate\'s program eligibility.',
 '23295':'Arnold leads the linked District 4 field in total cash and reported reserves. His nonmatching total is close to Zimmerman\'s, and 26 strict Individual groups support both. September 14-20 is his strongest recorded 2026 nonmatching week, but multiple events and delayed filings prevent attribution to one controversy.',
 '23365':'Green\'s September receipts rise during the attacks, complicating a one-sided backlash narrative. His largest nonmatching week remains July 20-26. He has spent substantially more than Arnold in the observed period and holds less reported cash. His strongest measured shared-donor connections cross into District 3.',
 '17629':'Zimmerman nearly matches Arnold in nonmatching receipts and has the largest itemized-Individual dollar total among these linked candidates. His overlap with Arnold could reflect shared priorities, joint support or competition for a donor pool; it is not a voter-transfer forecast. A $45,000 outstanding loan balance remains relevant despite no observed loan receipt inside the window.',
 '23199':'Clark\'s fundraising peak arrives much earlier, in March. She has organizational endorsements spanning this comparison and shared donors with Zimmerman and Arnold. Her last nonmatching transaction is September 8; reporting incompleteness makes a late-campaign slowdown claim premature.',
 '23411':'Smith\'s receipts are dominated by public matching, and his nonmatching stream is overwhelmingly aggregate. His 12 visible Individual groups are especially misleading as a stand-in for all supporters. Loan receipts and an outstanding personal-expenditure balance are reported separately.',
 '25040':'Evenstar is endorsed by Portland for All, PROTEC17 and Oregon AFSCME in the reviewed lists. Six strict Individual groups overlap Green, more than the degree-preserving null typically produces but still a small absolute number. Same-date repeat rows should not be mistaken for recurring supporters.',
 '25103':'Cronlund\'s recorded matching funds are a majority of cash receipts, with a smaller visible itemized network. Her strongest nonmatching week is July 20-26, before the final September controversies. The observed balance and personal-expenditure liability are separate facts, not a complete measure of campaign capacity.',
 '24615':'The observed $600 is classified as self/family cash, not itemized Individual support. With no visible Individual groups in this snapshot, donor-network measures are unavailable, not evidence of zero community support. The committee has a reviewed link and a reported balance, unlike unlinked candidates.'
}
def card(cid):
    r=C[cid];ens=[e['organization'] for e in CTX['endorsements'] if N[cid] in e['candidates']]
    blocks=[p(f'{html.escape(N[cid])} <font size="9">/ District {r["district"]} / ORESTAR {cid}</font>','h2'),
      tbl([['Cash / City matches','Nonmatching / unidentified','Reported ending cash'],[money(r['cash_cents'],2)+' / '+money(r['public_cents'],2),money(r['nonmatching_cents'],2)+' / '+money(r['unidentified_cents'],2),money(r['official_ending_cash_cents'],2)]],[172,172,172]),Spacer(1,6),spark(cid),
      p(READINGS[cid]),
      p(f'<b>Peak:</b> week of {r["best_2026_nonmatching_week"]}, {money(r["best_week_cents"],2)} outside matches. <b>Visible Individuals:</b> {r["individual_groups"]} groups; {r["repeat_date_individual_groups"]} repeat on different dates. <b>Payments:</b> {money(r["cash_payment_cents"],2)}. <b>Refunds:</b> {money(r["refund_cents"],2)}. <b>In-kind:</b> {money(r["inkind_cents"],2)}.','small'),
      p(f'<b>Official liabilities:</b> loans {money(r["official_loans_cents"],2)}; payables {money(r["official_payables_cents"],2)}; personal expenditures {money(r["official_personal_expenditures_cents"],2)}. <b>Reviewed endorsements:</b> {html.escape("; ".join(ens) or "None on the six reviewed lists; not a claim of no endorsements")}.','small')]
    return blocks
ordered=['23208','23028','15109','24897','24661','24973','24972','24966','24979','23295','23365','17629','23199','23411','25040','25103','24615']
for i in range(0,len(ordered),2):
    ids=ordered[i:i+2];blocks=[]
    for j,cid in enumerate(ids):
        if j:blocks.append(Spacer(1,12))
        blocks.extend(card(cid))
    if len(ids)==1:blocks.append(p('The full donor-candidate ledger can be filtered by committee ID for every disclosed source group and dated gift. All source transaction IDs are retained. Missing aggregate identities cannot be reconstructed by assigning a generic “miscellaneous” donor.'))
    page('Candidate field notes',
         'Full-window financial records; 2026 weekly pattern. Chart scales vary by candidate.',*blocks,kicker='CANDIDATE PROFILES / EVIDENCE APPENDIX')

page('Coverage and the boundaries of the story',
     'Unknown is a separate category, not a zero.',
     tbl([['District','Reviewed links','Unlinked ballot candidates']]+[[str(d),str(sum(x['district']==d for x in R['candidates']))+' of '+str(len(CTX['roster'][str(d)])),'; '.join(r['candidate'] for r in read('candidate-coverage') if int(r['district'])==d and r['coverage']!='reviewed_link')] for d in [3,4]],[54,96,366]),
     p('All 17 linked committees are analyzed throughout their observed Jan. 2025-Sept. 2026 activity. That includes existing committee operations and potentially costs or refunds associated with the prior election. The current candidate-to-committee crosswalk does not reclassify every historical transaction as a 2026 campaign transaction.'),
     p('The underlying statewide snapshot has 316,926 transactions from 1,888 filers. The district investigation is a defined subset, not a claim to cover every financing vehicle affecting these races. Unlinked roster names, unavailable independent-expenditure targets and missing late filings prevent a complete race-wide total.'),
     p('The missing November-December 2024 interval matters for inherited resources and the transition between campaigns. Official account summaries prevent us from inventing zero opening balances, but they do not replace missing transaction-level history. No historical backfill or deployment was begun for this edition.'),
     p('Residential street fields remain in the local research archive but are omitted from published evidence. We do not map donors\' homes. We do not infer a person\'s political beliefs, occupation, wealth, employer position or motive solely from a financial record.'),
     p('The newest weeks should be reread after more filings arrive. Current-version filed dates are not necessarily first-publication dates, especially for amendments. This dataset contains 107 amended and 6,593 original-status district records; it is not a complete version history.'),
     p('Evidence: candidate-coverage.csv; transactions.csv; source manifest; committee-race-crosswalk.json. Candidate roster: '+link('https://www.portland.gov/auditor/elections/run4office/2026-city-candidates','official City roster')+'.','small'))

QUESTIONS=[
 ('Who leads each district in total and nonmatching cash?','answered','Different rankings; district funding-mix charts and candidate metrics define the covered population.'),
 ('Did the September tweet episode coincide with more fundraising?','qualified','Arnold, Zimmerman and Green all increase in 7- and 14-day recorded windows; no causal estimate.'),
 ('Did the billboard cause a moderate/conservative surge?','currently unanswerable','Installation date uncertain; date sensitivity reverses some changes; donor ideology not inferred.'),
 ('Did Wilson\'s public endorsement precede Torres\'s largest spike?','answered','No. Reported Aug. 9 contributions precede the Aug. 12 event in the cited secondary account.'),
 ('What actually caused Torres\'s Aug. 9 batch?','currently unanswerable','Fundraiser or solicitation record not verified; identical amounts alone cannot explain motives.'),
 ('Which weeks were strongest for every linked candidate?','answered','Top-five rankings on three accounting measures; per-candidate peaks and full weekly ledger.'),
 ('Can every weekly movement be explained by an event?','currently unanswerable','No complete appeals, fundraiser, endorsement or event archive; reporting dates also matter.'),
 ('What happened around the 2025 Peacock texts?','qualified','Mixed dollar changes, not a uniform opposition surge; small baselines and simultaneous rule changes.'),
 ('How much money is public, identified or hidden?','answered','65.8% of cash is reviewed City matches; 48.8% of nonmatching cash is unidentified in covered committees.'),
 ('Which endorsements and alliances are documented?','qualified','Six organization lists and dated reporting; announcement dates and every endorsement not reconstructed.'),
 ('Who gave to whom, how often and how much?','qualified','Complete ledger for 1,148 visible groups; 1,344 candidate relationships, dates, amounts and IDs. Unknown aggregate donors cannot be recovered.'),
 ('Who are the biggest repeat donors?','qualified','Separate dollar and frequency rankings, with exact-group refunds and distinct dates. Person identities remain provisional.'),
 ('Which donors hedge their bets and why?','currently unanswerable','Multi-candidate portfolios observable; hedging and personal motives require corroboration or interviews.'),
 ('Are shared-donor clusters stronger than popularity predicts?','qualified','Three-chain degree-preserving null; all 136 pair tests corrected; six pass exploratory q<0.05, with identity and missingness limits.'),
 ('Do loose name matches change the network?','answered','Yes. Torres-Zimmerman is 5 strict groups versus 43 name-only candidates for review, not verified shared donors.'),
 ('Who has cash left and outstanding debt?','qualified','Official reported balances reconciled with snapshot flows; not a bank audit or financial-runway forecast.'),
 ('Which vendors receive campaign spending?','qualified','Cash-payment ledger and named-payee comparisons available; reimbursements, pass-throughs and ownership need review.'),
 ('Who funded the billboard and every independent expenditure?','currently unanswerable','Ditch Mitch absent as a filer; target allocations and complete outside-funding trace missing.'),
 ('Which candidates are drawing new rather than existing voters?','currently unanswerable','Donors are not voters; itemization and identity changes prevent this inference.'),
 ('Does fundraising predict the November result?','currently unanswerable','Election pending; no outcome or causal model is justified by this edition.'),
 ('Does financial support purchase policy decisions?','currently unanswerable','No verified governance case study or causal design in this edition.'),
 ('Are the two districts fully covered?','qualified','17 of 33 candidates have reviewed links. Unlinked candidates and late records are not zero.'),
]
for i in range(0,len(QUESTIONS),8):
    page('Questions, answers and remaining leads',
         'Each question has an explicit research status; unsupported answers are not filled in.',
         tbl([['Question','Status','Answer or limitation']]+[[q,s,a] for q,s,a in QUESTIONS[i:i+8]],[180,91,245]),kicker='RESEARCH QUESTION CATALOGUE')

page('Methods that change the interpretation',
     'Reproducible calculations, restrained claims.',
     p('<b>Accounting.</b> Reported amounts remain integer cents until display. Cash contributions, matching receipts, cash payments, contribution refunds, noncash support, financing and obligations are separate bases. We neither add payables to subsequent cash payments nor trace a particular donor\'s commingled dollar to a vendor. Nonmatching means cash contribution minus a reviewed list of City matching transaction IDs.'),
     p('<b>Identity.</b> Committee IDs are authoritative where available. Other entities use conservative name, type and full-address fingerprints inherited from the snapshot. They remain provisional record groups. Same-name alternatives are a sensitivity exercise only. Aggregate and anonymous labels remain disclosure categories associated with each filing committee and are excluded from donor overlap and people counts.'),
     p('<b>Timing.</b> Weekly charts use Monday-Sunday transaction-date totals. An event comparison excludes the event day and uses symmetric 7-, 14- or 28-day windows. An incomplete post-window is not extrapolated. Weeks ending within 14 days of the snapshot are flagged as provisional; that heuristic is not a legal deadline or guarantee of completeness. Aggregate-row dates do not reveal each underlying gift date.'),
     p('<b>Network.</b> The 1,300 observed Individual-group/candidate edges are rewired by valid double-edge swaps preserving both degree sequences. Seeds 20260927, 20260928 and 20260929 each produce 999 draws after burn-in. Upper-tail p=(1+null overlaps at least observed)/(1+2,997); Benjamini-Hochberg q-values cover all 136 candidate pairs. Chain means, lag-1 diagnostics, null percentiles and name sensitivity are exported. Missing donors and identity error are not cured by simulation.'),
     p('<b>Concentration.</b> Candidate metrics include top-ten share and effective donor groups, calculated only within disclosed Individual cash. Effective groups equals 1 / sum(squared amount shares). It expresses concentration, not a literal people count. The report does not rank whole-electorate support using these partial records.'),
     p('<b>Verification.</b> Independent derived tables reconcile to 6,700 district records, 3,940 cash-contribution records and $2,071,208.05 in cash contributions. Candidate public/unidentified/individual/other components sum back to cash; portfolio and relationship totals agree. Every headline source group has an evidence-review row. Official accounts reconcile reported contributions, payments and net changes, but do not prove completeness.'),
     p('No sampling confidence interval is placed around exact reported totals. We did not fit an election-outcome regression to a pending election or run dozens of event-significance tests and select favorable ones. Event comparisons are descriptive, with competing explanations and counterexamples retained.','small'))

page('Evidence, reproduction and next reporting',
     'A research package, not an uncheckable set of charts.',
     tbl([['File','Use'],['donor-candidate-complete-ledger.csv','Every visible source/candidate pair, amounts, dates, records, refunds and transaction IDs.'],['donor-portfolios-complete.csv','Every visible source group\'s multi-candidate portfolio; dollar and frequency analysis.'],['candidate-report-metrics.csv','All 17 candidates: separate cash sources, source visibility, official balances and debt.'],['candidate-weeks.csv / strongest-weeks.csv','Full 91-week series and top-five 2026 weeks on three separate measures.'],['event-windows.csv / campaign-dynamics.json','Original and new event windows; cumulative candidate timelines.'],['donor-overlap-tests.csv / identity-review-queue.csv','All pair tests, diagnostics, sensitivity and unresolved possible matches.'],['shared-donor-pair-amounts.csv','Exact gross and observed-refund amounts for every pair of candidates sharing Individual groups.'],['transactions.csv / outside-committees.csv','Source-record evidence; no residential street fields.'],['report-data.json / analysis.json','Metric definitions, checksums, snapshot identity and reproducible calculation metadata.']],[239,277]),
     p('<b>Reproduce locally:</b> run investigation.py, portland_investigation.py and portland_report_data.py with the pinned analysis Python environment. Then run build_portland_report.py with the bundled reportlab runtime. The acquisition snapshot is read-only; these stages perform no ORESTAR requests. The SVG figures and readable Markdown are generated from the same tables as the PDF.'),
     p('<b>Highest-value next reporting:</b> resolve the other 16 candidate links; obtain a complete dated appeal/fundraiser archive; reconcile the City matching differences; acquire the Ditch Mitch ledger and independent-spending targets; review high-impact identity candidates; then seek explanations from campaigns and donors. Each changes what can be responsibly concluded, rather than merely adding another statistic.'),
     p('The statewide investigation remains next in sequence. It should not replace this district-level work or be presented as completed by it. No deployment, historical backfill or outbound outreach occurred in producing this edition.'),
     p('Snapshot: '+M['snapshot']+'. Source database SHA-256: '+M['source_database_sha256']+'. All research files are under research/campaign-finance/investigation/portland/. External sources are linked at their point of use; portland-context.json retains the dated source ledger.','small'))

def plain(s):
    s=re.sub(r'<a href="([^"]+)"[^>]*>(.*?)</a>',lambda m:'['+re.sub('<[^>]+>','',m[2])+']('+html.unescape(m[1])+')',s)
    s=s.replace('<b>','**').replace('</b>','**').replace('<br/>','; ')
    return html.unescape(re.sub('<[^>]+>','',s))
def main():
    PDF.parent.mkdir(parents=True,exist_ok=True)
    c=canvas.Canvas(str(PDF),pagesize=(612,792));c.setTitle('Portland Districts 3 and 4: Money, Events and Coalitions');c.setAuthor('Portland Civic Lab');c.setSubject('Investigative data edition, frozen September 27, 2026; not an election forecast')
    md=['# Money moved on both sides of the fight','\nPortland City Council Districts 3 and 4. Research edition: September 27, 2026.\n'];layout=[]
    for num,page_ in enumerate(PAGES,1):
        c.setFillColor(NAVY);c.rect(0,775,612,17,fill=1,stroke=0);c.setFont('Helvetica-Bold',8);c.drawString(48,752,page_['kicker']);c.setFillColor(GRAY);c.setLineWidth(.5);c.line(48,743,564,743)
        y=727;items=[p(page_['title'],'title'),p(page_['deck'],'deck')]+page_['blocks']
        height=0
        for b in items:
            _,bh=b.wrap(W,1000);height+=bh+b.getSpaceAfter()
        if height>667:raise RuntimeError(f'Page {num} ({page_["title"]}) overflows: {height:.1f} > 667')
        c.bookmarkPage('page-'+str(num));c.addOutlineEntry(page_['title'],'page-'+str(num),level=0)
        md.extend(['\n## '+page_['title'],'\n'+page_['deck']+'\n'])
        for b in items:
            _,bh=b.wrap(W,1000);b.drawOn(c,48,y-bh);y-=bh+b.getSpaceAfter()
        for b in page_['blocks']:
            if isinstance(b,Paragraph):md.append(plain(b.text)+'\n')
            elif isinstance(b,Table):
                rows=b._evidence_rows;md.append('\n'+'\n'.join('| '+' | '.join(plain(str(x)).replace('|','/') for x in row)+' |' for row in [rows[0],['---']*len(rows[0])]+rows[1:])+'\n')
            elif isinstance(b,Drawing):md.append(f'\n![{b._figure_name}](figures/{b._figure_name}.svg)\n')
        c.setStrokeColor(GRAY);c.line(48,43,564,43);c.setFillColor(NAVY);c.setFont('Helvetica',7.5);c.drawString(48,29,'PORTLAND CIVIC LAB | Frozen Sept. 27, 2026 | Local review edition');c.drawRightString(564,29,f'{num} / {len(PAGES)}');c.showPage()
        layout.append({'page':num,'title':page_['title'],'body_height_points':height,'bottom_points':y})
    c.save();(DATA/'PORTLAND-INVESTIGATION.md').write_text('\n'.join(md)+'\n')
    with (DATA/'question-catalogue.csv').open('w',newline='') as f:
        w=csv.writer(f);w.writerow(['question','status','answer_or_limitation']);w.writerows(QUESTIONS)
    (DATA/'report-layout-check.json').write_text(json.dumps({'pdf':str(PDF),'pages':layout,'pdf_sha256':hashlib.sha256(PDF.read_bytes()).hexdigest(),'source_data_sha256':hashlib.sha256((DATA/'report-data.json').read_bytes()).hexdigest()},indent=2)+'\n')
    print(json.dumps({'pdf':str(PDF),'pages':len(PAGES),'figures':len(list(FIG.glob('*.svg'))),'min_bottom_points':min(x['bottom_points'] for x in layout)},indent=2))
if __name__=='__main__':main()
