# Oregon fire map: data and outreach research

Started September 10, 2026. Co-authors: Edan Krolewicz, Jenna Knobloch, Dominic Kuklawood. Goal: a public map of every prescribed burn, wildfire, and related fire activity in Oregon, with as much information per event as can be documented, including why each prescribed unit was chosen.

## Files

| File | What it is |
|---|---|
| [data-inventory.md](data-inventory.md) | Every data source found, what it holds, how to get it, and where the gaps are. Start here. |
| [endpoints.csv](endpoints.csv) | Machine-readable list of the same sources: URLs, geometry, coverage, access status, verification date, key fields. Feed this to the ingest scripts. |
| [contacts.md](contacts.md) | Who holds what, what each group actually does, named contacts, whether to email all 23 burn managers (not yet), and the recommended order. |
| [cbm-directory.csv](cbm-directory.csv) | ODF's Certified Burn Manager directory as published (23 people, pulled from the live sheet on September 10, 2026). |
| [outreach-drafts.md](outreach-drafts.md) | Nine email drafts: the ODF data request, the formal records request text, the practitioner note, Extension, federal stewards, ODA, DEQ/PUC/OEM, tribal programs, and the later note to the whole directory. |
| [sources.md](sources.md) | Register of every page and endpoint consulted, with dates. |
| [sourcebook.html](sourcebook.html) | The same material as one shareable page, published at https://claude.ai/code/artifact/7821c1f5-2dec-47de-9ac2-619769fc68fa (body-only HTML; the artifact host wraps it). |

## How to use this

**This week**

1. Send draft 1 to Stacy McCarter at ODF. The Smoke Data System export is the one dataset that turns this from a federal-lands map into a statewide one. Everything else can proceed while we wait.
2. Start archiving the two public rolling feeds today: ODF's 3-day accomplished layer and the USFS planned Rx layer (URLs in endpoints.csv). Nothing in them is retained by the publisher. A daily cron job that appends every row to a table is enough. Burning resumes in October, so starting now costs nothing and missing October costs a season.
3. Pull the three big public datasets once: BLM OR prescribed fire polygons (36,966), USFS FACTS fire treatments for Oregon (20,531), ODF fire occurrence 1960 to 2024 (69,744). Add NIFC locations and perimeters and the NWCC and Oregon Explorer perimeter histories.
4. Send drafts 4 and 3 to Carrie Berger and Kai Sauerbrey.

**Next two weeks**

5. Build a first map from the public data: wildfire perimeters and ignition points over time, BLM and USFS burns with their stated reason, ODF annual totals by district. That is enough to show practitioners something real.
6. Send the practitioner note (draft 3) to the regional hubs listed in contacts.md and take the calls.
7. Send the ODA, DEQ, PUC, and OEM asks (drafts 6 and 7) in parallel; they are low effort.
8. Follow the NEPA keys (nepa_doc_name, PLANID) for a sample of burns and see how much of the "why" can be extracted automatically from decision documents.

**After the prototype**

9. Tribal program conversations (draft 8), with a clear statement of how their burns would or would not appear.
10. The note to the whole CBM directory and the Prescribed Fire Council (draft 9), asking people to check and annotate their own burns.
11. FTEM request, to show where past burns changed a wildfire's behavior.

## Two product decisions to make early

- **Names.** The ODF feed carries private landowners' names and phone numbers, and the CBM directory carries personal emails and phones. Publish agencies and businesses; aggregate or drop private individuals. Say so in the ODF request.
- **Precision.** ODF locations are township/range/section plus a lat-long the registrant typed in. Federal polygons are surveyed units. Decide how the map shows a point that means "somewhere in this square mile" without implying a surveyed boundary.

## What was checked and what was not

Everything marked "queried" in data-inventory.md was hit on September 10, 2026 and its schema and record counts read. Pages marked "link only" were confirmed to exist. NASA FIRMS, RAVG, EPA AQS, PurpleAir, Synoptic, the Fireshed Registry, and BLM ePlanning are described from general knowledge and were not exercised this session. The OSU Extension PBA page refused automated access; open it in a browser for the PBA contacts.
