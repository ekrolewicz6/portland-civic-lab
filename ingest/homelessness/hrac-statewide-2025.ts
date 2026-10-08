/**
 * PSU Homelessness Research & Action Collaborative, "2025 Oregon Statewide
 * Homelessness Estimates" (Cho, Greene, Spurbeck and Zapata, January 2026),
 * prepared for Oregon Housing and Community Services.
 *
 * Every number below was read from the report PDF that Dr. Minji Cho sent on
 * October 8, 2026 (archived as
 * runtime-data/source-archive/2026-10-08/hrac-2025-oregon-statewide-homelessness-estimates.pdf,
 * SHA-256 a8d746124fac532cd17539f019cbb9d21303be261dfd44c861075057776fae7b) and is
 * checked against it by verify-hrac-statewide.ts. Page numbers are the report's own.
 *
 * The county tables are complete (all 36 counties), so statewide sums match the
 * report's totals. Seeded into the database by ingest/seed-statewide-homelessness.ts.
 */

export const REPORT = {
  title: "2025 Oregon Statewide Homelessness Estimates",
  publisher: "PSU Homelessness Research & Action Collaborative",
  url: "https://pdxscholar.library.pdx.edu/hrac_pub/53/",
  published: "2026-01",
  countNight: "2025-01-22",
  pdfSha256: "a8d746124fac532cd17539f019cbb9d21303be261dfd44c861075057776fae7b",
};

// [county, CoC, sheltered, unsheltered, total, unsheltered %, shelter beds (ES, SH, TH),
//  sheltered per 1,000, unsheltered per 1,000, total per 1,000]
export type CountyPit = [string, string, number, number, number, number | null, number, number, number, number];
// [county, 2023 unsheltered, 2025 unsheltered, change, % change]
export type UnshelteredChange = [string, number, number, number, number | null];
// [county, seasonal/overflow beds, year-round beds, total beds, total homeless, beds as % of PIT]
export type ShelterBeds = [string, number, number, number, number, number | null];
// [county, 2023-24 students, 2024-25 students, change, % change]; null where ODE suppressed a count under 10
export type StudentHomelessness = [string, number | null, number | null, number | null, number | null];
// [area, estimate, margin of error]
export type DoubledUp = [string, number, number];
// [group, % of population, % of PIT count, ratio stated by HRAC]
export type RacialDisparity = [string, number | null, number, number | null];

/** Tables 1 and 2 (pp. 8-9). HRAC notes these "may vary from those reported directly to HUD". */
export const COUNTY_PIT: CountyPit[] = [
  ["Crook", "Central Oregon", 25, 344, 369, 93.2, 26, 0.95, 13.05, 14],
  ["Deschutes", "Central Oregon", 572, 1039, 1611, 64.5, 733, 2.74, 4.98, 7.72],
  ["Jefferson", "Central Oregon", 69, 59, 128, 46.1, 96, 2.71, 2.32, 5.03],
  ["Clackamas", "Clackamas", 210, 358, 568, 63, 272, 0.49, 0.84, 1.33],
  ["Jackson", "Jackson", 740, 421, 1161, 36.3, 794, 3.34, 1.9, 5.25],
  ["Lane", "Lane", 1505, 2004, 3509, 57.1, 1900, 3.93, 5.24, 9.17],
  ["Marion", "Marion/Polk", 1017, 719, 1736, 41.4, 1544, 2.92, 2.07, 4.99],
  ["Polk", "Marion/Polk", 123, 234, 357, 65.5, 79, 1.39, 2.64, 4.02],
  ["Multnomah", "Multnomah", 3614, 6912, 10526, 65.7, 4008, 4.51, 8.62, 13.13],
  ["Washington", "Washington", 701, 239, 940, 25.4, 861, 1.15, 0.39, 1.54],
  ["Baker", "Balance of State", 9, 32, 41, 78, 5, 0.54, 1.91, 2.45],
  ["Benton", "Balance of State", 301, 274, 575, 47.7, 315, 3.08, 2.8, 5.88],
  ["Clatsop", "Balance of State", 215, 1028, 1243, 82.7, 232, 5.15, 24.6, 29.75],
  ["Columbia", "Balance of State", 51, 342, 393, 87, 51, 0.95, 6.38, 7.33],
  ["Coos", "Balance of State", 140, 315, 455, 69.2, 165, 2.14, 4.83, 6.97],
  ["Curry", "Balance of State", 14, 190, 204, 93.1, 14, 0.59, 8.05, 8.65],
  ["Douglas", "Balance of State", 101, 248, 349, 71.1, 130, 0.91, 2.23, 3.14],
  ["Gilliam", "Balance of State", 0, 0, 0, null, 0, 0, 0, 0],
  ["Grant", "Balance of State", 0, 28, 28, 100, 0, 0, 3.9, 3.9],
  ["Harney", "Balance of State", 0, 58, 58, 100, 0, 0, 7.77, 7.77],
  ["Hood River", "Balance of State", 49, 30, 79, 38, 21, 2.01, 1.23, 3.24],
  ["Josephine", "Balance of State", 34, 323, 357, 90.5, 34, 0.39, 3.69, 4.08],
  ["Klamath", "Balance of State", 67, 127, 194, 65.5, 68, 0.96, 1.82, 2.78],
  ["Lake", "Balance of State", 0, 10, 10, 100, 0, 0, 1.22, 1.22],
  ["Lincoln", "Balance of State", 282, 334, 616, 54.2, 300, 5.51, 6.53, 12.04],
  ["Linn", "Balance of State", 268, 265, 533, 49.7, 338, 2.05, 2.03, 4.07],
  ["Malheur", "Balance of State", 94, 201, 295, 68.1, 97, 2.99, 6.4, 9.39],
  ["Morrow", "Balance of State", 2, 2, 4, 50, 0, 0.14, 0.14, 0.28],
  ["Sherman", "Balance of State", 0, 6, 6, 100, 0, 0, 3.11, 3.11],
  ["Tillamook", "Balance of State", 51, 52, 103, 50.5, 56, 1.85, 1.88, 3.73],
  ["Umatilla", "Balance of State", 138, 140, 278, 50.4, 152, 1.7, 1.73, 3.43],
  ["Union", "Balance of State", 16, 42, 58, 72.4, 23, 0.61, 1.61, 2.23],
  ["Wallowa", "Balance of State", 0, 1, 1, 100, 0, 0, 0.13, 0.13],
  ["Wasco", "Balance of State", 72, 112, 184, 60.9, 140, 2.72, 4.24, 6.96],
  ["Wheeler", "Balance of State", 0, 0, 0, null, 0, 0, 0, 0],
  ["Yamhill", "Balance of State", 127, 23, 150, 15.3, 153, 1.16, 0.21, 1.37],
];

/** Table 3 (p. 28). 2023 was the last year every Oregon CoC counted unsheltered people. */
export const UNSHELTERED_CHANGE: UnshelteredChange[] = [
  ["Crook", 22, 344, 322, 1464],
  ["Deschutes", 1075, 1039, -36, -3],
  ["Jefferson", 91, 59, -32, -35],
  ["Clackamas", 178, 358, 180, 101],
  ["Jackson", 556, 421, -135, -24],
  ["Lane", 2110, 2004, -106, -5],
  ["Marion", 654, 719, 65, 10],
  ["Polk", 225, 234, 9, 4],
  ["Multnomah", 3944, 6912, 2968, 75],
  ["Washington", 230, 239, 9, 4],
  ["Baker", 2, 32, 30, 1500],
  ["Benton", 149, 274, 125, 84],
  ["Clatsop", 887, 1028, 141, 16],
  ["Columbia", 312, 342, 30, 10],
  ["Coos", 457, 315, -142, -31],
  ["Curry", 105, 190, 85, 81],
  ["Douglas", 412, 248, -164, -40],
  ["Gilliam", 0, 0, 0, null],
  ["Grant", 15, 28, 13, 87],
  ["Harney", 26, 58, 32, 123],
  ["Hood River", 64, 30, -34, -53],
  ["Josephine", 191, 323, 132, 69],
  ["Klamath", 33, 127, 94, 285],
  ["Lake", 9, 10, 1, 11],
  ["Lincoln", 62, 334, 272, 439],
  ["Linn", 232, 265, 33, 14],
  ["Malheur", 295, 201, -94, -32],
  ["Morrow", 45, 2, -43, -96],
  ["Sherman", 33, 6, -27, -82],
  ["Tillamook", 42, 52, 10, 24],
  ["Umatilla", 237, 140, -97, -41],
  ["Union", 29, 42, 13, 45],
  ["Wallowa", 0, 1, 1, null],
  ["Wasco", 96, 112, 16, 17],
  ["Wheeler", 4, 0, -4, -100],
  ["Yamhill", 182, 23, -159, -87],
];

/**
 * Table 17 (p. 44). HRAC's Multnomah total, 4,008, comes from data submitted to the
 * state; HUD's final 2025 Housing Inventory Count for OR-501 lists 4,187 emergency,
 * Safe Haven and transitional beds for the same night (HRAC, p. 8: totals "may vary
 * from those reported directly to HUD by CoCs due to updates made after the data were
 * submitted to OHCS and HRAC").
 */
export const SHELTER_BEDS: ShelterBeds[] = [
  ["Crook", 2, 24, 26, 369, 7],
  ["Deschutes", 79, 654, 733, 1611, 45],
  ["Jefferson", 35, 61, 96, 128, 75],
  ["Clackamas", 22, 250, 272, 568, 48],
  ["Jackson", 86, 708, 794, 1161, 68],
  ["Lane", 741, 1159, 1900, 3509, 54],
  ["Marion", 377, 1167, 1544, 1736, 89],
  ["Polk", 13, 66, 79, 357, 22],
  ["Multnomah", 0, 4008, 4008, 10526, 38],
  ["Washington", 0, 861, 861, 940, 92],
  ["Baker", 5, 0, 5, 41, 12],
  ["Benton", 98, 217, 315, 575, 55],
  ["Clatsop", 0, 232, 232, 1243, 19],
  ["Columbia", 0, 51, 51, 393, 13],
  ["Coos", 0, 165, 165, 455, 36],
  ["Curry", 0, 14, 14, 204, 7],
  ["Douglas", 0, 130, 130, 349, 37],
  ["Gilliam", 0, 0, 0, 0, null],
  ["Grant", 0, 0, 0, 28, 0],
  ["Harney", 0, 0, 0, 58, 0],
  ["Hood River", 0, 21, 21, 79, 27],
  ["Josephine", 0, 34, 34, 357, 10],
  ["Klamath", 30, 38, 68, 194, 35],
  ["Lake", 0, 0, 0, 10, 0],
  ["Lincoln", 0, 300, 300, 616, 49],
  ["Linn", 2, 336, 338, 533, 63],
  ["Malheur", 16, 81, 97, 295, 33],
  ["Morrow", 0, 0, 0, 4, 0],
  ["Sherman", 0, 0, 0, 6, 0],
  ["Tillamook", 7, 49, 56, 103, 54],
  ["Umatilla", 19, 133, 152, 278, 55],
  ["Union", 0, 23, 23, 58, 40],
  ["Wallowa", 0, 0, 0, 1, 0],
  ["Wasco", 27, 113, 140, 184, 76],
  ["Wheeler", 0, 0, 0, 0, null],
  ["Yamhill", 1, 152, 153, 150, 102],
];

/** Table 18 (p. 45): year-round shelter beds, January 2023 to January 2025. */
export const MULTNOMAH_YEAR_ROUND_BEDS = { y2023: 3149, y2025: 4008, change: 859 };

/**
 * Table 19 (p. 47), McKinney-Vento counts reported by school districts to ODE. Counties
 * do not sum to the statewide row because students counted in two counties are
 * deduplicated statewide; use the "Statewide" row for Oregon.
 */
export const STUDENT_HOMELESSNESS: StudentHomelessness[] = [
  ["Crook", 87, 118, 31, 35.6],
  ["Deschutes", 813, 811, -2, -0.2],
  ["Jefferson", 113, 78, -35, -31],
  ["Clackamas", 801, 982, 181, 22.6],
  ["Jackson", 1770, 1647, -123, -6.9],
  ["Lane", 2310, 2053, -257, -11.1],
  ["Marion", 2350, 2271, -79, -3.4],
  ["Polk", 159, 248, 89, 56],
  ["Multnomah", 3407, 2903, -504, -14.8],
  ["Washington", 3337, 2894, -443, -13.3],
  ["Baker", 226, 205, -21, -9.3],
  ["Benton", 374, 356, -18, -4.8],
  ["Clatsop", 246, 272, 26, 10.6],
  ["Columbia", 209, 161, -48, -23],
  ["Coos", 659, 677, 18, 2.7],
  ["Curry", 120, 93, -27, -22.5],
  ["Douglas", 582, 560, -22, -3.8],
  ["Gilliam", 41, 34, -7, -17.1],
  ["Grant", 18, 39, 21, 116.7],
  ["Harney", 27, 28, 1, 3.7],
  ["Hood River", 39, 39, 0, 0],
  ["Josephine", 758, 786, 28, 3.7],
  ["Klamath", 355, 468, 113, 31.8],
  ["Lake", 42, 54, 12, 28.6],
  ["Lincoln", 716, 642, -74, -10.3],
  ["Linn", 1194, 1079, -115, -9.6],
  ["Malheur", 286, 331, 45, 15.7],
  ["Morrow", 112, 144, 32, 28.6],
  ["Sherman", null, null, null, null],
  ["Tillamook", 188, 180, -8, -4.3],
  ["Umatilla", 263, 220, -43, -16.3],
  ["Union", 112, 123, 11, 9.8],
  ["Wallowa", 17, 18, 1, 5.9],
  ["Wasco", 140, 160, 20, 14.3],
  ["Wheeler", 24, 111, 87, 362.5],
  ["Yamhill", 630, 601, -29, -4.6],
  ["Statewide", 22072, 21122, -950, -4.3],
];

/**
 * Table 20 (p. 49): ACS 2024 one-year estimates by Census PUMA. A PUMA can cover
 * several counties, so several rows are county groups, not single counties.
 */
export const DOUBLED_UP: DoubledUp[] = [
  ["Crook, Deschutes and Jefferson", 477, 170],
  ["Clackamas", 1159, 520],
  ["Jackson", 762, 368],
  ["Lane", 1503, 326],
  ["Multnomah", 3477, 960],
  ["Washington", 3118, 710],
  ["Marion", 2149, 604],
  ["Polk and Lincoln", 168, 108],
  ["Benton and Linn", 1430, 394],
  ["Coos, Curry and Josephine", 904, 299],
  ["Douglas", 791, 328],
  ["Clatsop, Columbia and Tillamook", 3124, 959],
  ["Baker, Union, Wallowa and east and south Umatilla", 597, 210],
  ["Hood River, Grant, Morrow, Sherman, Wasco, Wheeler and northwest Umatilla", 218, 108],
  ["Harney, Klamath, Lake and Malheur", 1253, 488],
  ["Yamhill", 412, 240],
  ["Statewide", 21542, 1993],
];

/**
 * Racial disparities, statewide (pp. 16-17 and Chart 1, p. 18). The ratios are the ones
 * HRAC states in the text; it gives none for Hispanic or Latino Oregonians ("slightly
 * lower" than their population share, varying by county) or Asian Oregonians ("much
 * lower"). The % of the PIT count is computed from Tables 5 and 12 (unsheltered plus
 * sheltered), leaving out people whose race was not recorded: 22,919 people, Chart 1's
 * n. HRAC prints population shares (ACS 2019-2023, Table B03002) only in the chart, so
 * they are left null.
 */
export const PIT_WITH_KNOWN_RACE = 22919;
export const RACIAL_DISPARITIES: RacialDisparity[] = [
  ["American Indian, Alaska Native, or Indigenous", null, 4.6, 6.92],
  ["Native Hawaiian or Pacific Islander", null, 2.1, 5.47],
  ["Black, African American, or African", null, 9.3, 5.08],
  ["Multiracial", null, 5.6, 1.0],
  ["White", null, 64.2, 0.89],
  ["Hispanic/Latina/e/o (any race)", null, 12.9, null],
  ["Asian or Asian American", null, 0.7, null],
  ["Middle Eastern or North African", null, 0.2, null],
  ["Some other race", null, 0.3, null],
];
/** People with known race in the PIT count, by group: [unsheltered (Table 5), sheltered (Table 12)]. */
export const RACE_COUNTS: Record<string, [number, number]> = {
  "American Indian, Alaska Native, or Indigenous": [718, 339],
  "Native Hawaiian or Pacific Islander": [185, 288],
  "Black, African American, or African": [1378, 758],
  "Multiracial": [881, 411],
  "White": [9783, 4930],
  "Hispanic/Latina/e/o (any race)": [1796, 1162],
  "Asian or Asian American": [112, 58],
  "Middle Eastern or North African": [29, 18],
  "Some other race": [68, 5],
};

/** Statewide figures quoted on the dashboard, upserted into homelessness.context_stats. */
export const CONTEXT_STATS = [
  { metric: "statewide_pit_total", value: "27119", context: "2025 PIT Count: 27,119 people across Oregon on a single night in January 2025", source: "PSU HRAC 2025 Statewide Homelessness Estimates", as_of_date: "2025-01-22" },
  { metric: "statewide_unsheltered", value: "16512", context: "60.9% of all homeless Oregonians were unsheltered on the night of the count", source: "PSU HRAC 2025 Statewide Homelessness Estimates", as_of_date: "2025-01-22" },
  { metric: "statewide_sheltered", value: "10607", context: "39.1% sheltered; sheltered count up 49% from 2023 as shelter beds expanded", source: "PSU HRAC 2025 Statewide Homelessness Estimates", as_of_date: "2025-01-22" },
  { metric: "statewide_pit_change_pct", value: "34.9", context: "34.9% increase from 20,110 in 2023, which HRAC attributes partly to better counting and method changes, not only more homelessness", source: "PSU HRAC 2025 Statewide Homelessness Estimates", as_of_date: "2025-01-22" },
  { metric: "statewide_shelter_beds", value: "12607", context: "12,607 total shelter beds (11,047 year-round + 1,560 seasonal or overflow), a 45% increase over 2023", source: "PSU HRAC 2025 Statewide Homelessness Estimates (HIC)", as_of_date: "2025-01-22" },
  { metric: "statewide_doubled_up", value: "21542", context: "Estimated 21,542 people doubled up in Oregon (2024 ACS), plus or minus 1,993", source: "PSU HRAC via ACS 1-year estimates (Richard et al. method)", as_of_date: "2024-12-31" },
  { metric: "statewide_student_homeless", value: "21122", context: "21,122 K-12 students (4.0% of all students) experienced homelessness in 2024-25; 3,052 unsheltered, probably the most ever recorded", source: "Oregon Department of Education, via PSU HRAC 2025 Statewide Homelessness Estimates (Table 19)", as_of_date: "2025-06-30" },
  { metric: "multco_shelter_gap_pct", value: "38", context: "Multnomah County shelter beds equal 38% of its PIT count (4,008 beds for 10,526 people, HRAC); HUD's final inventory for the same night lists 4,187 beds (40%)", source: "PSU HRAC 2025 Statewide Homelessness Estimates (Table 17); HUD 2025 HIC, OR-501", as_of_date: "2025-01-22" },
  { metric: "ai_an_disparity_ratio", value: "6.92", context: "American Indian, Alaska Native and Indigenous Oregonians experience homelessness at 6.92 times their share of the population", source: "PSU HRAC 2025 Statewide Homelessness Estimates", as_of_date: "2025-01-22" },
  { metric: "black_disparity_ratio", value: "5.08", context: "Black and African American Oregonians experience homelessness at 5.08 times their share of the population", source: "PSU HRAC 2025 Statewide Homelessness Estimates", as_of_date: "2025-01-22" },
  { metric: "nhpi_disparity_ratio", value: "5.47", context: "Native Hawaiian and Pacific Islander Oregonians experience homelessness at 5.47 times their share of the population", source: "PSU HRAC 2025 Statewide Homelessness Estimates", as_of_date: "2025-01-22" },
];
