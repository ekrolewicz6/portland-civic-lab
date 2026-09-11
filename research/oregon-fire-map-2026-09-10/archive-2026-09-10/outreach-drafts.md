# Oregon fire map: outreach drafts

Prepared September 10, 2026. Nothing has been sent. Each draft says who it is for and what it asks. Fill in the bracketed parts. Keep the emails short; the detail belongs in the follow-up call.

A note on the public records route: Oregon's Public Records Law (ORS 192.311 to 192.478) covers ODF, ODA, DEQ, PUC, and OEM. Agencies may charge fees but can reduce or waive them when release serves the public interest (ORS 192.324(5)). ODF's portal gives the first 30 minutes of staff time free. Federal agencies fall under FOIA, but the federal datasets we need are already public. Ask voluntarily first and say the formal request is available; most program staff would rather hand over an export than process a records request. We are not lawyers; check the fee waiver language before relying on it.

---

## 1. ODF Smoke Management: the data request (send first)

**To:** Stacy McCarter, Mitigation Program Manager, stacy.mccarter@odf.oregon.gov
**Cc:** forestryinformation@odf.oregon.gov
**Subject:** Request for Smoke Data System export for a public prescribed fire map

Hi Stacy,

I'm Edan Krolewicz, working with Jenna Knobloch and Dominic Kuklawood on a public map of fire in Oregon. The goal is to show, in one place, where prescribed burns have happened, why each unit was burned, and how that sits alongside the state's wildfire history. We want people to be able to click on a burn and see the acres, the burn type, the reason, and the conditions on the day.

Your program already collects most of this. The prescribed fire map and the daily PDFs show today's units, and the annual reports give the totals, but the history lives in the Smoke Data System. We'd like to ask for an export.

Specifically, for every year the system holds (or as far back as is practical):

1. Registered units: registration number, date registered, district, ownership code, county, township/range/section, latitude, longitude, unit acres, elevation, slope, burn type, burn reason, fuel species, planned acres and tons by burn method, and the unit comments.
2. Accomplishments: registration number, actual burn date and ignition time, acres burned, tons burned by method, fuel moistures, days since significant rain, and wind speed as recorded.
3. The code lists for burn type, burn reason, ownership, and district.
4. The smoke intrusion records that feed Table 2 of the annual report.

A CSV or Excel export of the underlying tables is ideal. For private landowners we do not need names, addresses, or phone numbers; business names for commercial operators and the agency for public units are enough. If it is easier to strip those fields before sending, please do.

We understand this may be a public records request under ORS 192.311 and are glad to file it through the portal if that's the right route. If fees apply, we'd ask you to consider a waiver since the map will be free and public, and we'll happily share what we build with the program and with the Smoke Management Advisory Committee.

Two smaller questions: is there a GIS contact for the Fire_Smoke_Management feature service, and would you be willing to point us to a few Certified Burn Managers or burn associations who might want to help explain their burns?

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
(d) smoke intrusion records for 2016 through 2025.

Please provide the records in their native tabular format (CSV, Excel, or database export). I do not request the names, mailing addresses, or telephone numbers of private individuals and ask that those fields be omitted rather than redacted line by line. I request a fee waiver or reduction under ORS 192.324(5) because the records will be used to build a free public map of prescribed fire in Oregon and will not be used for commercial purposes. If fees will exceed $[amount], please provide an estimate before proceeding. Please identify the responsive systems or offices if any portion of the records is held elsewhere.

---

## 3. Practitioner note (Certified Burn Managers, PBA leads, land trusts)

Send individually. Change the first line for each person.

**Subject:** A public map of prescribed fire in Oregon; 20 minutes of your advice?

Hi [name],

I found you through ODF's Certified Burn Manager directory [or: through the OSU Extension PBA page / through Stacy McCarter]. I'm working with two collaborators, Jenna Knobloch and Dominic Kuklawood, on a public map of fire in Oregon: every prescribed burn we can document, with the reason it was done, alongside the state's wildfire history. The point is to let people see that good fire is happening, where, and why, instead of only hearing about it when there's smoke.

The state and federal records give us the where and the acres. They don't give us the why in plain language, and that's the part the public needs. You've planned and run these burns, so I'd like to ask for 20 minutes on the phone to learn how you'd want your burns shown, what would make the map useful to you, and what would make it wrong. If you keep burn plans or photos you'd be willing to share for units you've led, that would be a bonus, but the conversation is the ask.

Would any time in the next two weeks work?

Edan Krolewicz
[phone]

---

## 4. OSU Extension Fire Program (Carrie Berger)

**To:** carrie.berger@oregonstate.edu
**Subject:** Oregon prescribed fire map: could Extension advise?

Hi Carrie,

I'm Edan Krolewicz, working with Jenna Knobloch and Dominic Kuklawood on a public map of prescribed fire and wildfire in Oregon. We've asked ODF for a Smoke Data System export and are pulling the BLM and Forest Service treatment records. What we can't get from records is the landowner's side: why a unit was burned, in words a neighbor would understand.

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

I'm building a public map of prescribed fire in Oregon and using [dataset name] from [hub URL]. Could you point me to the code lists for [REASON, REASON2, INITIATIVE, and BURN_TYPE / purpose_code, treatment_type, and method], and to how [PLANID / nepa_doc_name] can be matched to the planning documents on [ePlanning / forest project pages]? Any notes on update cadence and known gaps would help too. The map will credit the dataset by name.

Thanks,
Edan Krolewicz

---

## 6. ODA field burning

**To:** info@oda.oregon.gov (ask to be routed to the Smoke Management Program, 503-986-4701)
**Subject:** Request for Willamette Valley field burning registration and accomplishment records

Hello,

I'm working on a public map of fire in Oregon that includes agricultural field burning alongside forestland prescribed fire and wildfire. For the Willamette Valley field burning program, could you provide, for each year available, the registered fields (location, acres, crop or residue type, grower business name) and the daily burn accomplishments (date, fields burned, acres)? Tabular exports are ideal. We do not need individual growers' personal contact information. If this should be filed as a public records request under ORS 192.311, please let me know and I'll do so; we'd ask that fees be waived since the map is free and public.

Thanks,
Edan Krolewicz
[phone]

---

## 7. DEQ, PUC, OEM (one paragraph each)

**DEQ Air Quality** (public records page or 503-229-5696): request hourly PM2.5 for all Oregon monitors, 2016 to present, and any smoke intrusion investigations tied to prescribed burns. Mention that EPA AQS may already hold the monitor history and ask which is more complete.

**PUC Safety Division** (503-378-6600): ask whether the utilities' ignition records and high fire risk zone boundaries filed under UM 2207, 2208, and 2209 and OAR 860-300 exist in structured form, and whether the PSPS annual reports (due December 31) can be provided as data rather than PDF.

**OEM GIS** (via https://oregon-oem-geo.hub.arcgis.com/): ask for a statewide Genasys evacuation zone layer and the historical evacuation orders and levels by zone and date, if retained.

---

## 8. Tribal fire programs

Do this by phone or in person where possible. If email is the first step, keep it to this.

**Subject:** A public map of fire in Oregon; asking how you'd want to be involved, if at all

Hello,

My name is Edan Krolewicz. With two collaborators I'm building a public map of prescribed and cultural fire and wildfire in Oregon. Before anything about [tribe]'s burning appears on it, we want to ask whether you'd want it there, and if so, how it should be described and credited. If the answer is no, we'll leave it out. If you'd be open to a conversation, we'd be glad to come to you.

Respectfully,
Edan Krolewicz
[phone]

---

## 9. Later: the note to the whole CBM directory and the Prescribed Fire Council

Send only once there is a prototype to link to.

**Subject:** Your burns on Oregon's prescribed fire map; a request to check them

Hello,

We've published a first version of a public map of prescribed fire in Oregon at [URL]. It draws on ODF's smoke management records and federal treatment data. It shows where burns happened; it mostly can't say why in plain words. If you led any of the burns on the map, could you look up your units and tell us, in a sentence or two each, why the landowner burned and what it was meant to do? There's a form at [URL] and it takes a few minutes per unit. If something is wrong, tell us and we'll fix it.

Thank you for the work you do.

Edan Krolewicz, Jenna Knobloch, Dominic Kuklawood
