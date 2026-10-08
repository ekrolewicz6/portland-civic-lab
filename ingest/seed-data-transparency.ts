/**
 * seed-data-transparency.ts
 *
 * Seeds the data transparency layer for the homelessness dashboard:
 *   - homelessness.data_sources (methodology metadata for each source)
 *   - homelessness.data_disputes (structured records of contested public claims)
 *
 * This is the foundation for surfacing the city-county data tension
 * in a non-partisan, methodology-aware way. The rows below are the live
 * rows as of October 8, 2026 (including the October 7 refresh), so a reseed
 * cannot bring back figures that were corrected.
 *
 * Usage:
 *   npx tsx ingest/seed-data-transparency.ts           # dry run: prints what would change
 *   npx tsx ingest/seed-data-transparency.ts --apply   # upserts the rows
 */

import postgres from "postgres";
import { requireDatabaseUrl } from "./lib/db-url";

const DB_URL = requireDatabaseUrl();
const APPLY = process.argv.includes("--apply");

// ── 1. Data Sources (methodology cards) ──────────────────────────────────

const DATA_SOURCES = [
  {
    source_key: "pit_count",
    display_name: "Point-in-Time Count",
    agency: "HUD, from Multnomah County's submission (PSU HRAC conducts the count)",
    methodology:
      "A single-night census in late January, mandated by HUD. Shelters report who slept there; trained volunteers and outreach workers survey people outside. In 2025 Multnomah County also added 5,090 people its service records showed as likely unsheltered that night.",
    scope: "Multnomah County (HUD's Portland, Gresham/Multnomah County Continuum of Care) on one night in late January. Unsheltered people are counted in odd-numbered years; shelters every year.",
    what_it_misses:
      "People doubled-up with friends or family, couch-surfing, sleeping in cars hidden from view, and anyone who actively avoids enumerators. Considered a significant undercount.",
    update_frequency: "Full count every two years; shelters only in other years",
    last_updated: "2025-01-22",
    next_expected: "2027-01-31",
    url: "https://files.hudexchange.info/reports/published/CoC_PopSub_CoC_OR-501-2025_OR_2025.pdf",
    used_by: ["federal", "county", "city"],
  },
  {
    source_key: "hmis_bnl",
    display_name: "HMIS By-Name List",
    agency: "Multnomah County HSD",
    methodology:
      "A continuously-updated, deduplicated roster of every individual known to the homeless services system. Built from intake data across all funded providers (HMIS = Homeless Management Information System). A different measure from the Point-in-Time count; the two should not be compared to judge whether homelessness has grown.",
    scope: "Anyone who has been assessed by a Multnomah County funded homeless service provider.",
    what_it_misses:
      "People who never access services, who refuse intake, or who only use non-HMIS providers (e.g. some faith-based shelters). Can include people who have since become housed if not promptly updated.",
    update_frequency: "monthly (dashboard offline for maintenance as of Oct. 2026)",
    last_updated: "2026-03-31",
    next_expected: "2026-10-31",
    url: "https://hsd.multco.us/data-dashboard/",
    used_by: ["county"],
  },
  {
    source_key: "city_shelter_census",
    display_name: "City Shelter Census",
    agency: "City of Portland",
    methodology:
      "Nightly bed counts from shelters operated by or contracted with the City of Portland. Tracks beds available, beds filled, and turn-aways at city-funded sites.",
    scope: "City-operated overnight shelters only. Does not include county 24-hour shelters or non-city-funded sites.",
    what_it_misses:
      "Anyone not in a city shelter on a given night, including people in county shelters, on the street, or in non-city programs. Cannot estimate total unsheltered population.",
    update_frequency: "nightly",
    last_updated: "2026-04-06",
    next_expected: "2026-04-07",
    url: "https://www.portland.gov/shelter-services/shelter-services-data-dashboards",
    used_by: ["city"],
  },
  {
    source_key: "hrac_prevalence",
    display_name: "HRAC Annual Prevalence Estimate",
    agency: "PSU Homelessness Research & Action Collaborative",
    methodology:
      "Statistical estimate of how many unique people experience homelessness over a full year, based on HMIS turnover, PIT counts, and survey data. Differs from PIT because annual prevalence is typically 3-4x a single-night count.",
    scope: "Annual unique-person estimate for the tri-county region.",
    what_it_misses:
      "Still relies on HMIS as a base. Last full study was based on 2017 data; newer estimates extrapolate. Doesn't fully capture rural or hidden homelessness.",
    update_frequency: "irregular",
    last_updated: "2019-06-01",
    next_expected: "2026-12-31",
    url: "https://www.pdx.edu/homelessness/",
    used_by: ["county", "researchers"],
  },
  {
    source_key: "shs_outcomes",
    display_name: "SHS Outcomes Reports",
    agency: "Metro / Multnomah County HSD",
    methodology:
      "Quarterly and annual reports tracking placements, retention, spending, and demographics for the Supportive Housing Services tax measure. Drawn from HMIS but focused on system throughput, not population size.",
    scope: "Households served by SHS-funded programs in Multnomah County.",
    what_it_misses:
      "Doesn't measure total homeless population. Counts placements, not whether people stayed housed long-term beyond the reporting window.",
    update_frequency: "quarterly; annual report each November",
    last_updated: "2026-06-30",
    next_expected: "2026-11-30",
    url: "https://hsd.multco.us/reports/",
    used_by: ["metro", "county"],
  },
  {
    source_key: "hrac_statewide",
    display_name: "Oregon Statewide Homelessness Estimates",
    agency: "PSU Homelessness Research & Action Collaborative, for Oregon Housing and Community Services",
    methodology:
      "Compiles each Oregon Continuum of Care's Point-in-Time and Housing Inventory Counts by county, and adds school districts' counts of homeless students and a Census-based estimate of people living doubled up.",
    scope: "All 36 Oregon counties on the January count night; students by school year; doubled-up estimates by Census area.",
    what_it_misses:
      "Each county's count keeps its own method, so counties and years are not strictly comparable. Figures are as first submitted to the state, so some differ slightly from HUD's final reports: Multnomah County's shelter beds are 4,008 here and 4,187 in HUD's inventory.",
    update_frequency: "annual, each January",
    last_updated: "2026-01-15",
    next_expected: "2027-01-31",
    url: "https://pdxscholar.library.pdx.edu/hrac_pub/53/",
    used_by: ["state", "researchers"],
  },
];

// ── 2. Data Disputes ─────────────────────────────────────────────────────

const DATA_DISPUTES = [
  {
    slug: "wilson-county-2026",
    title: "Mayor Wilson and Multnomah County dispute homelessness counts",
    date_surfaced: "2026-04-01",
    status: "active",
    claim_a_source: "Mayor Keith Wilson / City of Portland",
    claim_a_summary:
      "City overnight shelters opened under Wilson show declining unsheltered counts. Wilson's office argues the county's numbers are inflated by possible double-counting, fake names, and people accessing services who are not actually homeless.",
    claim_a_data: {
      metric: "unsheltered_trend",
      direction: "declining",
      basis: "City shelter occupancy data and TASS counts",
      time_frame: "Jan 2025 - present",
    },
    claim_b_source: "Multnomah County HSD",
    // OPB, Apr. 1, 2026: "about 8,800 people considered unsheltered ... When Wilson entered office,
    // that number was roughly 6,000." The county's dashboard showed 6,275 for January 2025.
    // Both figures are from the by-name list; until Oct. 8, 2026 this row described the basis as
    // "by-name list and PIT count" and gave a 47% rise computed from the rounded 6,000.
    claim_b_summary:
      "The county's by-name list counted 6,275 people living unsheltered in January 2025, when Mayor Wilson took office, and about 8,800 in January 2026. The county released a memo addressing the city's claims point by point.",
    claim_b_data: {
      metric: "unsheltered_on_by_name_list",
      jan_2025: 6275,
      jan_2026: 8800,
      basis: "Multnomah County by-name list (monthly); not the Point-in-Time count",
    },
    expert_assessment:
      "Marisa Zapata, director of PSU's Homelessness Research & Action Collaborative, called the city's allegations of double-counting \"completely unfounded.\" The county's methodology is consistent with HUD-required HMIS practices.",
    expert_source: "PSU HRAC",
    methodology_difference:
      "The two sides measure different things. The city counts people in city-operated shelter beds on a given night. The county's by-name list counts everyone in contact with its homeless services over months, across all providers, so it will always be much larger, and city shelters can fill more beds while the list grows. Neither is the federal Point-in-Time count (10,526 people, 6,912 of them unsheltered, on January 22, 2025), and the by-name list should not be compared with that count to judge whether homelessness has grown. The county plans to restate the list about 20% lower under a shorter inactivity rule.",
    news_url:
      "https://www.opb.org/article/2026/04/01/behind-portlands-homelessness-data-familial-political-fight-emerges/",
  },
];

// ── Main ─────────────────────────────────────────────────────────────────

/** JSON with object keys sorted, since jsonb does not keep key order. */
const canonical = (v: unknown): string =>
  v && typeof v === "object" && !Array.isArray(v)
    ? `{${Object.keys(v).sort().map((k) => `${JSON.stringify(k)}:${canonical((v as Record<string, unknown>)[k])}`).join(",")}}`
    : JSON.stringify(v ?? null);
const same = (a: unknown, b: unknown) => canonical(a) === canonical(b);

async function main() {
  const sql = postgres(DB_URL, { max: 1, prepare: false, onnotice: () => {} });

  try {
    // ── Compare with the live rows ──
    const liveSources = await sql`SELECT source_key, display_name, agency, methodology, scope, what_it_misses,
      update_frequency, last_updated::text AS last_updated, next_expected::text AS next_expected, url, used_by
      FROM homelessness.data_sources`.catch(() => []);
    const liveDisputes = await sql`SELECT slug, title, date_surfaced::text AS date_surfaced, status, claim_a_source,
      claim_a_summary, claim_a_data, claim_b_source, claim_b_summary, claim_b_data, expert_assessment, expert_source,
      methodology_difference, news_url FROM homelessness.data_disputes`.catch(() => []);
    let changes = 0;
    for (const [label, rows, live, key] of [
      ["data_sources", DATA_SOURCES, liveSources, "source_key"],
      ["data_disputes", DATA_DISPUTES, liveDisputes, "slug"],
    ] as const) {
      for (const row of rows as readonly Record<string, unknown>[]) {
        const old = (live as readonly Record<string, unknown>[]).find((r) => r[key] === row[key]);
        if (!old) {
          console.log(`${label}: + ${row[key]}`);
          changes++;
          continue;
        }
        for (const [field, value] of Object.entries(row)) {
          if (!same(old[field], value)) {
            console.log(`${label}: ~ ${row[key]}.${field}\n    was: ${JSON.stringify(old[field])}\n    now: ${JSON.stringify(value)}`);
            changes++;
          }
        }
      }
    }
    if (!APPLY) {
      console.log(`\nDry run: ${changes} changes. Nothing written. Re-run with --apply to upsert.`);
      return;
    }

    // Ensure schema exists
    await sql.unsafe(`CREATE SCHEMA IF NOT EXISTS homelessness`);

    // ── data_sources ──
    await sql.unsafe(`
      CREATE TABLE IF NOT EXISTS homelessness.data_sources (
        id SERIAL PRIMARY KEY,
        source_key TEXT UNIQUE NOT NULL,
        display_name TEXT NOT NULL,
        agency TEXT NOT NULL,
        methodology TEXT NOT NULL,
        scope TEXT NOT NULL,
        what_it_misses TEXT,
        update_frequency TEXT,
        last_updated DATE,
        next_expected DATE,
        url TEXT,
        used_by TEXT[],
        created_at TIMESTAMPTZ DEFAULT NOW()
      )
    `);

    for (const row of DATA_SOURCES) {
      await sql`
        INSERT INTO homelessness.data_sources
          (source_key, display_name, agency, methodology, scope,
           what_it_misses, update_frequency, last_updated, next_expected, url, used_by)
        VALUES (
          ${row.source_key}, ${row.display_name}, ${row.agency},
          ${row.methodology}, ${row.scope}, ${row.what_it_misses},
          ${row.update_frequency}, ${row.last_updated}::date,
          ${row.next_expected}::date, ${row.url}, ${row.used_by}
        )
        ON CONFLICT (source_key) DO UPDATE SET
          display_name = EXCLUDED.display_name,
          agency = EXCLUDED.agency,
          methodology = EXCLUDED.methodology,
          scope = EXCLUDED.scope,
          what_it_misses = EXCLUDED.what_it_misses,
          update_frequency = EXCLUDED.update_frequency,
          last_updated = EXCLUDED.last_updated,
          next_expected = EXCLUDED.next_expected,
          url = EXCLUDED.url,
          used_by = EXCLUDED.used_by
      `;
    }
    console.log(`data_sources: ${DATA_SOURCES.length} rows upserted.`);

    // ── data_disputes ──
    await sql.unsafe(`
      CREATE TABLE IF NOT EXISTS homelessness.data_disputes (
        id SERIAL PRIMARY KEY,
        slug TEXT UNIQUE NOT NULL,
        title TEXT NOT NULL,
        date_surfaced DATE NOT NULL,
        status TEXT DEFAULT 'active',
        claim_a_source TEXT NOT NULL,
        claim_a_summary TEXT NOT NULL,
        claim_a_data JSONB,
        claim_b_source TEXT NOT NULL,
        claim_b_summary TEXT NOT NULL,
        claim_b_data JSONB,
        expert_assessment TEXT,
        expert_source TEXT,
        methodology_difference TEXT NOT NULL,
        news_url TEXT,
        created_at TIMESTAMPTZ DEFAULT NOW()
      )
    `);

    for (const row of DATA_DISPUTES) {
      await sql`
        INSERT INTO homelessness.data_disputes
          (slug, title, date_surfaced, status,
           claim_a_source, claim_a_summary, claim_a_data,
           claim_b_source, claim_b_summary, claim_b_data,
           expert_assessment, expert_source, methodology_difference, news_url)
        VALUES (
          ${row.slug}, ${row.title}, ${row.date_surfaced}::date, ${row.status},
          ${row.claim_a_source}, ${row.claim_a_summary}, ${sql.json(row.claim_a_data)},
          ${row.claim_b_source}, ${row.claim_b_summary}, ${sql.json(row.claim_b_data)},
          ${row.expert_assessment}, ${row.expert_source},
          ${row.methodology_difference}, ${row.news_url}
        )
        ON CONFLICT (slug) DO UPDATE SET
          title = EXCLUDED.title,
          status = EXCLUDED.status,
          claim_a_source = EXCLUDED.claim_a_source,
          claim_a_summary = EXCLUDED.claim_a_summary,
          claim_a_data = EXCLUDED.claim_a_data,
          claim_b_source = EXCLUDED.claim_b_source,
          claim_b_summary = EXCLUDED.claim_b_summary,
          claim_b_data = EXCLUDED.claim_b_data,
          expert_assessment = EXCLUDED.expert_assessment,
          expert_source = EXCLUDED.expert_source,
          methodology_difference = EXCLUDED.methodology_difference,
          news_url = EXCLUDED.news_url
      `;
    }
    console.log(`data_disputes: ${DATA_DISPUTES.length} rows upserted.`);

    // The dashboard serves a cached payload; clear it so the page reads the new rows.
    await sql`DELETE FROM public.dashboard_cache WHERE question IN ('homelessness', 'homelessness_detail')`;
    console.log("Applied.");
  } finally {
    await sql.end();
  }
}

main().catch((err) => {
  console.error("Fatal error:", err);
  process.exit(1);
});
