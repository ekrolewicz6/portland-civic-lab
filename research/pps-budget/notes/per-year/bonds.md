# PPS Bond Program Ledger — worksheet

Source table: `research/pps-budget/data/fragments/bonds/bond_projects.csv` (175 rows).
All figures in $ thousands, from the corpus text files only. Every row cites doc_id + page
(page = form-feed page index of the .txt, which matches the PDF page order).

Column convention: `current_estimate_k` is the audit's headline current figure — current
budget for Hirsh audits #1–#3, estimated final cost for Hirsh audit #4, and estimate-at-
completion for the Sjoberg Evashenk (SE) audits where tabulated. The companion figure
(revised budget or EAC) is always in `notes`.

## Audit-year coverage map (which snapshots exist)

| Snapshot | Report date | Data as-of | Auditor | Doc | Budget table? |
|---|---|---|---|---|---|
| 2012 bond audit #1 | Jun 2014 | 2014-03-01 | Hirsh & Associates | ...audit-1-of-4 | Yes — Appendix B p119 (exact $), Fig 3 p17, Fig 7 p29 |
| 2012 bond audit #2 | May 2015 | 2015-03 | Hirsh | ...audit-2-of-4 | Yes — Fig 2 p13 |
| 2012 bond audit #3 | May 2016 | 2016-03 | Hirsh | ...audit-3-of-4 | Yes — Fig 2 p13; FHS deep-dive p22–24 |
| 2012 bond audit #4 | Jun 2017 | 2017-03 (cost report Apr 2017) | Hirsh | ...audit-4-of-4 | Yes — Fig 8 p33 (resources), Fig 9 p37 (est final cost) |
| 2017 bond Year 1 Phase 1 | Apr 2019 | 2017-01 (budget development) | Sjoberg Evashenk | ...year-1-phase-1 | Yes — Exhibits 6–9 p12–15 (ballot vs internal model) |
| 2017 bond Year 1 Phase 2 | Aug 2019 | 2019-06-19 (e-Builder) | SE | ...year-1-phase-2 | Yes — Exhibit 5 p14 (2012 retrospective), Exhibit 6 p16 (2017) |
| Year 2 (FY2019/20) | Jul 2020 | 2020-01-14 | SE | ...year-2 | Yes — Exhibit 3 p12, H&S Exhibit 5 p16 |
| Year 3 (FY2020/21) | Nov 2021 | 2021-03 | SE | ...year-3 | **Exhibit 2 (p12) is an image — numbers lost**; narrative only (Benson 357,700; program 1,098,000) |
| Year 4 (FY2021/22) | **Feb 2023** | 2022-03-31 | SE | ...year-4 | Exhibits 2–3 (p13–14) are images; **Exhibit 12 p32 survives** (ballot/revised/EAC, rounded); 2020 bond components p41 |
| Year 5 (FY2022/23) | May 2024 | 2023-05 (curric/tech 2023-02; Harrison 2023-07) | SE | ...year-5 | **Exhibit 3 (p12) EAC table is an image — lost**; Exhibit 4 p14 (2020 originals), Exhibit 5 p15 (contingency), Exhibit 6 p16, Exhibits 10–11 p30/32 survive |
| Year 6 (FY2023/24) | Jun 2025 | 2025-02-13 (infra 2025-01; tech 2024-07) | SE | ...year-6 | Yes — best tables in the corpus: Exhibit 3 p13, Exhibit 4 p14, Exhibit 6 p19, Exhibit 7 p21, Exhibit 12 p32, Exhibit 14 p38 (exact $) |
| TSCC measure 26-259 | May 2025 election | 2025-05 | TSCC | tscc-measure-26-259-review | Proposed **2025** bond ($1.83B), not the 2020 bond; Jan-2025 staff cost-breakout on p8 is an image — lost |

**The "audit-year-2022 gap":** no bond performance audit report was *issued* in calendar
2022 — Year 3 (FY2020/21) came out November 2021 and Year 4 (FY2021/22) came out
February 2023. Fiscal-year coverage is nonetheless continuous (FY18/19 → FY23/24);
the gap is in publication cadence, and it means there is no snapshot dated between
March 2021 and March 2022 data-dates other than the Year 4 exhibits themselves.

The eleven `bond-audit-status-of-implementation-*` files are recommendation-status
trackers only (concur/working/complete) — no budget or spend figures; not row sources.

## Escalation story per project

### 2012 bond ($482M authorized, Nov 2012; program basis)
- **Program**: 482,000 → 499,108 (Mar 2014, a1 p119) → 522,900 (Mar 2015, a2 p13) →
  550,500 (Mar 2016, a3 p13) → est. final 547,000 *excluding* the unresolved Grant need
  with resources of 557,300 (Mar/Apr 2017, a4 p33–34, "at risk of completing over budget")
  → **594,400 cost at completion** (Jun 2019, y1p2 p14). Delivered as promised only because
  $115.8M of non-bond funding (premiums 56.9, Concordia 15.5, interest 4.1, other 39.3)
  absorbed the overrun.
- **Grant HS**: 88,337 → 79,108 (re-baselined down, Mar 2014) → 93,500 → 111,900 →
  est final ≥140,000 vs budget 116,900 (Mar 2017 — ≥$23M unfunded, CM/GC GMP est ~$33M
  over at 100% DD) → **158,700** (Jun 2019, fact-sheet basis 95,000). Largest 2012 overrun:
  +80% on the Hirsh basis.
- **Franklin HS**: 81,586 → 91,163 → 104,500 → 106,600 (PSU EAC 108,900; PD est to 112,000)
  → 112,800 final (+38% incl 14.2% escalation; initial CM/GC GMP estimate came in $28M over).
- **Roosevelt HS**: 68,419 → 82,243 → 92,200 → 96,600 → 102,000 est final (+49%); $4M of the
  GMP growth financed by a 20-year federal loan repaid from the general fund.
- **Faubion PK-8**: 27,036 (bond share) → 44,700 → 48,900 → 49,200 (+82% on bond share;
  +21% counting the $15.5M Concordia contribution).
- **Improvement Projects**: 67,700 → est final 64,700 — the only major line *under* original,
  achieved by cutting IP2016–18 scope and redirecting IP escalation reserves to the high schools (2014).
- Recurring findings: Nov 2013 BOE capacity increase (+$10M), $45M escalation reserve
  exhausted early (a2 p8–9), Marshall swing site 42.7% over (a1 p29), FHS reporting swing
  from −$4.6M to +$2.3M in one quarter (a3 p23), change-order/contractor-invoice issues
  left unresolved into the 2017 program (y1p2 p14).

### 2017 bond ($790M authorized, May 2017)
- **Program**: 790,000 (built after an unexplained ~$100M cut from the internal $678M
  four-school model — y1p1 p13–14) → **1,070,000** (Jun 2019) → 1,080,900 (Jan 2020) →
  1,098,000 (Mar 2021) → 1,063,000 excl. MPG (Mar 2022, MPG moved to 2020 bond) →
  EAC **898,338 on 2017-source funds only** vs revised budget 941,430 (Feb 2025, y6 p13 —
  the Benson gap having been shifted to the 2020 bond's $152M "2017 Bond Balance" +
  contingency, carried there as "Benson 2020" 164,904).
- **Benson Polytechnic**: 202,000 ballot (internal model 231,000) → 330,000 (Jun 2019) →
  357,700 (Jan 2020, incl. Board-added MPG + swing; funds projected exhausted Dec 2021,
  ~$290M gap) → 357,700 held (Mar 2021) → 410,200 (Mar 2022: +21.2 escalation, +17 scope,
  +14 budgeting error) → full-project EAC **421,205** on budget 418,309 (Feb 2025), with
  pending claims flagged as upside risk. Largest escalation in the ledger: +108% vs ballot.
- **Lincoln**: 187,000 → 243,100 (Jun 2019) → revised 240,470 → completed **223,558**
  ($16.9M under revised; savings unallocated as of Feb 2025).
- **Madison/McDaniel**: 146,000 → 206,500 (Jun 2019) → completed **200,508** (+37% vs ballot,
  ~on revised budget; renamed McDaniel by Year 3).
- **Kellogg**: 45,000 → 59,800 → completed **57,893** (+29% vs ballot, under revised 60,000).
- **Health & Safety**: 150,000 → spent 32,800 (Jun 2019) → 60,400 (Jan 2020, funding grown
  to 160,500 with OSCIM/SRGP grants) → EAC 175,283 on revised 179,281 (Feb 2025) —
  over-delivery funded by grants, against a $1.6B assessed districtwide need.
- The Year 1 Phase 2 verdict stands as the program's frame: the four schools were always
  going to cost ~$280M more than the bond; the 2020 bond was the plug.

### 2020 bond ($1,208M authorized, Nov 2020)
- **Program**: 1,208,000 → EAC 1,232,013 vs revised budget 1,342,414, spent 632,325
  (Feb 2025, y6 p21). Contingency drawn 93,257 → 59,511 largely for Jefferson (+55,000)
  and Harrison Park (25,600).
- **Jefferson HS**: 311,000 → 366,000 (Dec 2022, escalation) → 100% SD estimate
  **491,000** (Sep 2024; construction 407,000; CMGC construction-only had hit 513,000 in
  Jul 2023) → design paused for a cost-reduction exercise; opening slipped two years to
  2028-29. eBuilder EAC still carried at 366,008 in Feb 2025 — the audit flags the real
  estimate as higher.
- **Cleveland HS**: 20,000 planning-only allocation → full-modernization estimate
  ~481,000 (May 2024) → Dec 2024 75%-SD construction-only >462,000 → Superintendent
  target 360,000 (340,000 from the proposed 2025 bond); opening risk to 2030-31.
- **Ida B. Wells HS**: 20,000 planning-only → estimate ~455,000 (May 2024; construction
  367,000 → 376,000 Dec 2024) → target 360,000.
- **CBSE**: 60,000 allocated, **$0 spent** through Feb 2025; conceptual schedule (complete
  summer 2025) never updated; director hired only Fall 2024. Flagged in Year 4, Year 5,
  Year 6 and by TSCC.
- **Technology**: 128,200 → EAC 105,354 (bond) on revised 151,682 (incl. non-bond), but a
  cumulative **4-year schedule slip to 2029** (IDIQ contracting pool of 4 during the
  vaccination mandate; unfixable until the IDIQ ended Nov 2024).
- **Curriculum**: 53,444 → EAC 73,370 (revised 70,161 with non-bond top-up); delivered
  more than planned; $10.5M Middle School Redesign found non-compensable and redistributed.
- **Infrastructure** (241,000 incl. capacity): EAC 228,762 within the 231,000 allocation.
  ADA+SPED ~$5M (11%) over and a year late; mechanical re-scoped from 15 full replacements
  to 4 full + 27 control upgrades (−15%); seismic +44% on bond-only basis (grant-funded).
- **Harrison Park MS**: a 4,400 capacity allocation grew into a 42,700 project via transfers
  from five other categories + 25,600 contingency (scope change judged reasonable, y5 p16).
- **Benson MPG**: 64,000 → 80,516 (Feb 2025).

### 2025 bond (context only — TSCC 26-259)
Proposed $1,830,000 (May 2025 election): finishes Jefferson/Cleveland/IBW and ERP,
5% contingency (83,000) + 83,000 admin. The Cleveland/IBW "targets" of 360,000 each
assume 340,000 apiece from this measure.

## Anomalies and basis warnings

1. **Image-table losses**: Y3 Exhibit 2 (p12), Y4 Exhibits 2–3 (p13–14), Y5 Exhibit 3 (p12),
   Y6 Exhibits 9–11 timelines (p24/27/29), and the TSCC 26-259 Jan-2025 cost breakout (p8)
   are graphics; their numbers exist only where narrative repeats them. No interpolation done.
2. **No 2022-issued audit** (see coverage map): publication gap, not a fiscal-year gap.
3. **2012 original-budget basis conflict**: Hirsh audits use OSM project budgets (Franklin
   81,586 / Grant 88,337 / Roosevelt 68,419 / Faubion 27,036); SE Year 1 Phase 2 uses 2012
   Bond Fact Sheet amounts (85,000 / 95,000 / 70,000 / 28,000). Both are recorded, flagged in notes.
4. **Benson accounting shift**: from Year 4 the MPG ($64M→$76M→$80.5M) and later a $164.9M
   "Benson 2020" completion tranche are carried under the 2020 bond; 2017-program totals
   after Mar 2022 are not comparable to earlier totals without re-adding these.
5. **H&S "current" figures** mix cost and *available funding* (grants added): Jan 2020
   figure 160,500 is funding, not EAC; category budgets are net of an 8% management set-aside.
6. **Grant HS current budget discrepancy** in audit #4: Figure 9 says 116,900, narrative
   p35 says 116,800.
7. **Y6 Exhibit 7 contingency typo**: revised contingency prints "$59,511.241" —
   recorded as 59,511.241k (thousands-separator typo in source).
8. **2020 bond total wording**: narratives say "$1.2 billion"; authorized amount is
   1,208,000 (y5 Exhibit 5 p15; 26-215 review header). Y6 footnote 2 misprints "$1.2 million".
9. **tscc-measure-26-259-review is the 2025 measure**, not the 2020 bond; the 2020 bond
   TSCC review is `tscc-measure-26-215-review.txt` (outside this extraction's assigned scope).
10. **Audit #4 has no spent-to-date column** (Figure 9); spent_k left blank for the 2017-03
    snapshot rather than inferred.
11. **Y6 Benson EAC is explicitly not final**: pending claims, unfinished work and missed
    milestones "heighten the risk that the project may ultimately cost more" (y6 p14).
