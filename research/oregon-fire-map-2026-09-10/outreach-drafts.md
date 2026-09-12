# Oregon fire map: outreach drafts

Prepared September 10; revised September 11, 2026. Nothing has been sent. Each draft says who it is for and what it asks. Fill in the bracketed parts. Keep the emails short; the detail belongs in the follow-up call.

Ask for existing records through the program’s preferred route. Request a fee estimate before any chargeable work; discuss scope and any available public-interest fee reduction before committing. No fees, sends, calls or introductions have been authorized by these drafts.

---

## 1. ODF Smoke Management: the data request (send first)

**To:** Stacy McCarter, Mitigation Program Manager, stacy.mccarter@odf.oregon.gov
**Cc:** forestryinformation@odf.oregon.gov
**Subject:** Request for Smoke Data System export for a public prescribed fire map

Hi Stacy,

I'm Edan Krolewicz, working with Dominic Kuklawood on a public map of fire in Oregon. The goal is to show, in one place, where prescribed burns have happened, why each unit was burned, and how that sits alongside the state's wildfire history. We want people to be able to click on a burn and see the acres, the burn type, the reason, and the conditions on the day.

Your program already collects most of this. The prescribed fire map and the daily PDFs show today's units, and the annual reports give the totals, but the history lives in the Smoke Data System. We'd like to ask for an export.

Could we start with a 2025 sample and schema, then expand to every available year? Please distinguish registered units from individual ignitions and accomplishments, and include:

1. Registered units: registration number, date registered, district, ownership code, county, township/range/section, latitude, longitude, unit acres, elevation, slope, burn type, burn reason, fuel species, planned acres and tons by burn method, and the unit comments.
2. Accomplishments: registration number, actual burn date and ignition time, acres burned, tons burned by method, fuel moistures, days since significant rain, and wind speed as recorded.
3. Authorizations, permit decisions, cancellations and status history, with IDs linking these to units and individual ignitions. Existing polygons or diagrams, source coordinate reference system, accuracy and date precision would help.
4. The code lists for burn type, burn reason, ownership, and district.
5. The smoke intrusion records that feed Table 2 of the annual report.

A CSV or Excel export of the underlying tables is ideal. For private landowners we do not need names, addresses, or phone numbers; business names for commercial operators and the agency for public units are enough. If it is easier to strip those fields before sending, please do.

We understand this may be a public records request under ORS 192.311 and are glad to file it through the portal if that's the right route. If fees apply, we'd ask you to consider a waiver since the map will be free and public, and we'll happily share what we build with the program and with the Smoke Management Advisory Committee.

Could you also describe reporting delays, retention, known omissions and jurisdictions outside this system? We understand registrations are not a complete statewide permit inventory. Is there a GIS contact for the Fire_Smoke_Management feature service, and would you be willing to point us to a few Certified Burn Managers or burn associations who might want to help explain their burns?

Thanks for your time. Happy to talk by phone if that's quicker.

Edan Krolewicz
[phone]
[project page, if any]

---

## 2. Formal public records request text (ODF portal, if needed)

For https://apps.odf.oregon.gov/PublicRecords/Request/Create.

Under ORS 192.311 to 192.478, I request electronic copies of the following records held in the Oregon Department of Forestry Smoke Management Program's Smoke Data System, for all years available:

(a) the registered unit table, including registration number, registration date, district, ownership code, county, township, range, section, latitude, longitude, unit acres, elevation, slope, burn type, burn reason, fuel species, planned acres and planned tons by method, and comments;
(b) the accomplishment table, including registration number, actual burn date, ignition time, acres burned, tons burned by method, fuel moisture values, days since significant rain, and wind speed;
(c) the lookup tables for burn type, burn reason, ownership, and district codes;
(d) authorization/permit decisions, cancellations and status histories, including join keys to registrations and individual ignitions;
(e) existing geometry, schema, code lists and documentation of reporting delays, precision, retention and omitted jurisdictions;
(f) smoke intrusion records for 2016 through 2025.

A 2025 sample and schema first would help us refine the larger request.

Please provide the records in their native tabular format (CSV, Excel, or database export). I do not request the names, mailing addresses, or telephone numbers of private individuals and ask that those fields be omitted rather than redacted line by line. I request a fee waiver or reduction under ORS 192.324(5) because the records will be used to build a free public map of prescribed fire in Oregon with source attribution and visible coverage limits. Please provide a fee estimate before any chargeable work; we will confirm the scope before proceeding. Please identify the responsive systems or offices if any portion of the records is held elsewhere.

---

## 3. Practitioner note (Certified Burn Managers, PBA leads, land trusts)

Send individually. Change the first line for each person.

**Subject:** A public map of prescribed fire in Oregon; 20 minutes of your advice?

Hi [name],

I found you through ODF's Certified Burn Manager directory [or: through the OSU Extension PBA page / through Stacy McCarter]. I'm working with co-author Dominic Kuklawood, on a public map of fire in Oregon: every prescribed burn we can document, with the reason it was done, alongside the state's wildfire history. The goal is to help readers understand documented burns, their purposes and outcomes, with uncertainty and source coverage made visible.

The state and federal records give us the where and the acres. They don't give us the why in plain language, and that's the part the public needs. You've planned and run these burns, so I'd like to ask for 20 minutes on the phone to learn how you'd want your burns shown, what would make the map useful to you, and what would make it wrong. If you keep burn plans or photos you'd be willing to share for units you've led, that would be a bonus, but the conversation is the ask.

Would any time in the next two weeks work?

Edan Krolewicz
[phone]

---

## 4. OSU Extension Fire Program (Carrie Berger)

**To:** carrie.berger@oregonstate.edu
**Subject:** Oregon prescribed fire map: could Extension advise?

Hi Carrie,

I'm Edan Krolewicz, working with Dominic Kuklawood on a public map of prescribed fire and wildfire in Oregon. We are preparing a request to ODF for a Smoke Data System export and importing the BLM and Forest Service treatment records. What we can't get from records is the landowner's side: why a unit was burned, in words a neighbor would understand.

The Extension Fire Program sits closest to that. Could we ask you for a short call to get your read on the project, and, if you think it's worthwhile, introductions to the regional fire specialists and the prescribed burn associations? We'd also like to know how you'd want Extension's guides credited or linked from the map.

Thanks,
Edan Krolewicz
[phone]

---

## 5. Federal data stewards (short)

**To BLM:** sjeronimo@blm.gov
**To USFS EDW:** SM.FS.data@usda.gov

**Subject:** Field definitions for [BLM OR Prescribed Fire Treatments Polygon / FACTS Hazardous Fuel Treatments]

Hello,

I'm building a public map of prescribed fire in Oregon and using [dataset name] from [hub URL]. Could you point me to the code lists for [REASON, REASON2, INITIATIVE, and BURN_TYPE / purpose_code, treatment_type, and method], and to how [PLANID / nepa_doc_name] can be matched to the planning documents on [ePlanning / forest project pages]? Could you also share stable identifier definitions, reporting rules, project-to-unit crosswalks, and a few burn plans or accomplishment reports? Does another activity dataset contain burns omitted from hazardous-fuels reporting? Many BLM PLANID values are missing, and FACTS includes treatments consumed by wildfire; we want to classify these correctly. Any notes on update cadence and known gaps would help too. The map will credit the dataset by name.

Thanks,
Edan Krolewicz

---

## 6. ODA field burning

**To:** Jason Eck, jason.eck@oda.oregon.gov; 503-986-4794
**Subject:** Request for Willamette Valley field burning registration and accomplishment records

Hello,

I'm working on a public map of fire in Oregon that includes agricultural field burning alongside forestland prescribed fire and wildfire. For the Willamette Valley field burning program, could you provide, for each year available, the registered fields (location, acres, crop or residue type, grower business name) daily field-specific permit decisions, and actual burn accomplishments (date, fields burned, acres), with linking IDs and boundaries? Tabular exports are ideal. We do not need individual growers' personal contact information. If this should be filed as a public records request under ORS 192.311, please let me know and I'll do so; we’d welcome any available public-interest fee reduction. Please provide an estimate before chargeable work.

Thanks,
Edan Krolewicz
[phone]

---

## 7. DEQ, PUC, OEM (one paragraph each)

**DEQ open-burning program — first request:** request the habitat/wetland restoration permit index, applications, site diagrams, burn justifications, agency recommendations, conditions and completion reports. Ask how those records connect to ODF or LRAPA reporting.

**DEQ Air Quality — additional workstream** (public records page or 503-229-5696): request hourly PM2.5 for all Oregon monitors, 2016 to present, and any smoke intrusion investigations tied to prescribed burns. Mention that EPA AQS may already hold the monitor history and ask which is more complete.

**PUC Safety Division** (503-378-6600): ask whether the utilities' ignition records and high fire risk zone boundaries filed under UM 2207, 2208, and 2209 and OAR 860-300 exist in structured form, and whether the PSPS annual reports (due December 31) can be provided as data rather than PDF.

**OEM GIS** (via https://oregon-oem-geo.hub.arcgis.com/): ask for a statewide Genasys evacuation zone layer and the historical evacuation orders and levels by zone and date, if retained.

---

## 8. Tribal fire programs

Do this by phone or in person where possible. If email is the first step, keep it to this.

**Subject:** A public map of fire in Oregon; asking how you'd want to be involved, if at all

Hello,

My name is Edan Krolewicz. With my co-author I'm building a public map of prescribed and cultural fire and wildfire in Oregon. Before anything about [tribe]'s burning appears on it, we want to ask whether you'd want it there, and if so, how it should be described and credited. If the answer is no, we'll leave it out. If you'd be open to a conversation, we'd be glad to come to you.

Respectfully,
Edan Krolewicz
[phone]

---

## 9. Later: the note to the whole CBM directory and the Prescribed Fire Council

Later template only: send after co-author review and an actual published prototype. Replace [URL] and describe only the sources actually imported.

**Subject:** Your burns on Oregon's prescribed fire map; a request to check them

Hello,

A reviewed first version of our public map is available at [URL]. It shows documented source records from [verified imported sources], distinguishing plans from completed burns and labeling coverage gaps. Many units still lack a site-specific explanation. If you led any of the burns on the map, could you look up your units and tell us, in a sentence or two each, why the landowner burned and what it was meant to do? There's a form at [URL] and it takes a few minutes per unit. If something is wrong, tell us and we'll fix it.

Thank you for the work you do.

Edan Krolewicz, Dominic Kuklawood

---

## 10. LRAPA / Rivers to Ridges

**Route:** prescribed-burning program, 541-736-1056; https://www.lrapa-or.gov/air-quality-protection/community-center/prescribed-burns/
**Subject:** Existing ecological burn-unit GIS and permit histories

Hello,

We’re building a free public map showing documented burns in Oregon, their purposes, and their relationship to wildfire history. I’m working with Dominic Kuklawood. Could you share the GIS underlying your permitted-unit map and any existing annual permit indexes, applications, unit schedules and actual burn dates/acres? We would keep permitted units separate from confirmed burns. Existing objectives, plans and historical versions would help us explain why particular units were selected. Could someone review two or three examples for accuracy? Please provide a fee estimate before any chargeable work.

Thanks, Edan Krolewicz

## 11. Janine Salwasser / Oregon Explorer

**Route:** https://inr.oregonstate.edu/directory/janine-salwasser; 541-737-9921
**Subject:** Review of source hierarchy for an Oregon fire map

Hi Janine,

With Dominic Kuklawood, I’m building a public map of documented prescribed burns and wildfire history. We plan to use Oregon Explorer as the historical perimeter baseline, FPA FOD v7 for occurrences, and recent WFIGS for provisional additions. We’ll preserve separate source records and link verified identifiers, rather than sum overlapping datasets. Could we ask for 20 minutes to review this hierarchy, known gaps and opportunities to reuse existing work? We would attribute Oregon Explorer clearly and welcome review of a few examples.

Thanks, Edan

## 12. USFWS / NPS unit histories

**Routes:** willamettevalley@fws.gov; Crater Lake fire program via 541-594-3000. Send separately and name the relevant refuge or park.
**Subject:** Existing burn-unit histories and ecological objectives for a public map

Hello,

We’re building a free public map of documented burns in Oregon, their purposes and wildfire context. Could your fire-management staff point us to existing unit histories, boundaries, plans, burn dates/acres, objectives and monitoring results for [refuge/park]? We would distinguish planned treatments from completed burns, preserve source accuracy, and attribute explanations. IDs connecting these records to ODF or federal systems would help avoid duplicates. A small sample and review of two or three examples would be a useful starting point. Please provide an estimate before any chargeable work.

Thanks, Edan Krolewicz, with Dominic Kuklawood

## 13. Justin Welty / USGS LTDL

**To:** jwelty@usgs.gov
**Subject:** Oregon coverage and supporting documents in LTDL

Hi Justin,

We’re building a public map of documented burns in Oregon with source-attributed objectives. We’ve identified the LTDL public release and will start there. Could you point us to its Oregon coverage notes, supporting treatment documents and any stable crosswalk to BLM treatment records? We want to preserve distinct records and avoid treating overlap as evidence of effectiveness. A short review of a few examples would also be helpful.

Thanks, Edan Krolewicz, with Dominic Kuklawood

## Common invitation wording

We’re building a free public map showing documented burns in Oregon, their purposes, and their relationship to wildfire history. Could you help us obtain the existing records your program holds and review a few examples for accuracy? We would distinguish plans from completed burns and attribute explanations to their sources.

All drafts remain unsent. No published prototype, contact, reply or partner agreement should be inferred from a template.
