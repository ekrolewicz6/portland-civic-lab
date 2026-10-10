# OSB Year One report coverage and evidence review

Reviewed October 5, 2026 against the original 13-page PDF and September 10 announcement. The newly downloaded PDF has the same SHA-256 as the original archived source: `bf3f83dd299ae9a39f6df33365bcaf0a93a5fc11420a585d8677fb25dd618002`. The sources describe the first year after the May 2025 launch; this review adds detail, not a new observation period or a second impact study.

Sources:

- [OSB Year One Impact Report](https://static1.squarespace.com/static/6801755ad7acc40d46586c99/t/6aa09dc0156a0f27de3f3e85/1788911040812/OSB+Year+One+Impact+Report+Accessible+1.pdf)
- [September 10 announcement](https://pdxofficeofsmallbusiness.com/news/portland-office-of-small-business-year-one-impact-report)

## Every substantive source section

| Source location | Information and treatment in the webpage |
|---|---|
| PDF p. 1 | Cover identifies Year One. Report title and source attribution retained; decorative cover not copied. |
| PDF p. 2 | May 2025 launch; manager Mitch Daugherty's account of trust, empathy, different owner circumstances and continuing support; 750+ engagements, 1,600 touchpoints; district business counts; permitting, utility issues, technical assistance and funding navigation; more than 135 events, office hours, district events, webinars and quarterly meetings with elected officials/staff; five-language website with startup, permitting, management and community resources; monthly interbureau meetings; year-two coordination, visibility and responsiveness. Integrated into the support chapter, complete district display and reconciliation notes. Claims about improved collaboration are attributed to OSB. |
| PDF p. 3 | 759 businesses and 1,700+ interactions; summary of multilingual resources and human assistance; four featured owners. Retained as reported outputs, with the touchpoint discrepancy explicit. |
| PDF p. 4 inquiry channels | All seven percentages: liaison outreach 30, appointment 25, Prosper website 19, phone 10, OSB website 9, partner referral 5, chat 2. Full display and downloadable CSV. Channel percentages do not measure case resolution. |
| PDF p. 4 industry | All sixteen categories, including less-visible sectors. The fifteen numeric values sum to 102%, plus agriculture <1%. No normalization, invented counts or false precision for agriculture. It is a client mix, not the city economy. |
| PDF p. 4 services | All five shares and meanings: Prosper resources 50%, community connections 18%, other resources 14%, city bureau support 11%, access to capital 7%. Explicitly explain that 7% refers to funding outside Prosper; Prosper loans/grants occur in the 50% category. Referrals do not establish money received. |
| PDF p. 5 | 136 events attended/hosted; district map shows D1 34, D2 27, D3 33, D4 32. These sum to 126, a new unresolved gap of 10. Event and business counts remain separate. The Professional Auto Body & Paint site visit is mentioned. Photo caption names owners Anthony Lam/Nancy Le and staff Julieanna Elegant/Mitch Daugherty; individual photo credits/names are available in the linked original, not treated as outcome evidence. No report photographs were republished. |
| PDF p. 6 | Uluf Hassan, District 1, new/home-based childcare; decade of experience, preschool plan in Division Midway, office-hours contact with Jon Bebe/PP&D/Division Midway Alliance; regulatory and suitable-space guidance, grant/loan opportunities, coaching/training; confidence described in her testimonial. Included in an expandable case. The source's home-based category and commercial-space search are both retained. Opening, licensing and funding are not confirmed. |
| PDF p. 7 | PBOT director Millicent Williams' partner statement: cross-agency coordination, consistent communication, construction updates, Sunday Parkways, early troubleshooting and business voice. Paraphrased and attributed; no independent impact inferred. |
| PDF p. 8 | One Taekwondo, District 2, founded 2016 by Vicente, education/professional services; lessons for adults and children; August 2025 fire affected four businesses; Julieanna Elegant reached out; investigator communication/report, Hispanic Metropolitan Chamber/IBRN assistance, associations at former/new locations, social profile, Spanish/technical help with St. Johns grant application, sign at new location. Included in an expandable case with one brief owner quotation. Grant award and causal survival benefit are not inferred. |
| PDF p. 9 | PEMO partner statement: public-space/corridor work, rapid response, internal/external referrals, Problem Solver network and shared business connections. Paraphrased as a partner account; general claims about economic vitality, safety and resilience are not presented as measured effects. |
| PDF p. 10 | Hey Doc, District 3, November 2021 opening; chiropractic, pelvic health, acupuncture, massage and mental health services; growth from one provider/one manager to 12 providers/five administrative staff and building ownership; Montserrat's early contact and early-2026 building purchase; Jon Bebe/Mitch Daugherty with architect Kaeli Nolte of Zone Design Group; PP&D coordination, fee-reduction application and application completeness. Included in an expandable case; growth not attributed to OSB, fee reduction not stated as awarded, no measured permit-time saving. |
| PDF p. 11 | PP&D's Alice Nielsen: permitting/property information, staff understanding of permit process, more work still needed. Paraphrased and attributed, not validated efficiency estimates. |
| PDF p. 12 | Tangier, District 4, 2010 founding; Najia's Moroccan/Mediterranean family restaurant; grant inquiry and Julieanna Elegant; Revenue/SOS connections; Xcelerate Women/IBRN online ordering; Building Energy Efficiency grant awarded the previous fall and equipment-upgrade scope under development; Travel Portland visitor promotion; immediate continuing support in owner testimonial. Included in expandable case. Grant amount, completed installation, energy savings and extra sales remain unknown. |
| PDF p. 13 | Central help entry point. Direct link included, directing readers to current contact options. It does not promise eligibility or funding. |
| September 10 announcement | Dan Ruan byline; same 750+ businesses/1,700+ follow-ups, relationship-building, multilingual access, office hours, bureau coordination, education/outreach/visibility and year-two priorities. Cited for that framing and context; not counted as independent corroboration. Original photographs, repeated quotation and site footer/translation/newsletter/navigation are not copied into the analytical report. |

## Reconciliations and limits

- Businesses: 103 + 182 + 154 + 142 = 581, versus 759 unique businesses. Gap 178 is unexplained, not labeled unassigned.
- Events: 34 + 27 + 33 + 32 = 126, versus 136. Gap 10 is unexplained; do not infer events outside districts or missing records.
- Interactions: p. 2 says 1,600 touchpoints; p. 3 and the announcement say 1,700+. Definitions/periods are not reconciled in the documents.
- Industry percentages: 102% plus <1% is reproduced as printed. Rounding could contribute; the report does not establish a full reconciliation or category-counting rule.
- The four operator-selected stories and three partner statements are qualitative evidence of how assistance works. They cannot estimate the typical outcome, effects on business survival, jobs or incomes, or results for nonusers.
- Case facts are historical as reported; no new owner interview or current-business-status verification was performed.
- Staff and partner names describe report-era roles. No relationship with Portland Civic Lab is implied.

## Files and checks

`data/osb-year-one.json` is the structured transcription. `data/osb-year-one.csv` contains all 28 percentage rows, eight district-count rows and two headline counts, with page references; agriculture's unknown exact share is a blank numeric cell and `<1%` display. `build-web.py` publishes both page data and CSV. Claims w17–w24 in `web-claims.tsv` record the added evidence. `osb-review-archive.json` preserves fresh source hashes and retrieval times separately from the original archive.

The page adds two visual exhibits to the existing 18, for 20 total. Original evidence cutoff remains September 30; this October 5 edit uses the same pre-cutoff report and announcement. The more recent plain-language rewrite is preserved.
