import { NextRequest, NextResponse } from "next/server";
import sql from "@/lib/db-query";

export const dynamic = "force-dynamic";

// Maximum rows for large tables to avoid timeouts
const ROW_LIMIT = 50_000;

/**
 * Escape a value for CSV: wrap in quotes if it contains commas, quotes, or newlines.
 * Double any embedded quotes per RFC 4180.
 */
function csvEscape(value: unknown): string {
  if (value === null || value === undefined) return "";
  const str = String(value);
  if (str.includes(",") || str.includes('"') || str.includes("\n") || str.includes("\r")) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
}

/**
 * Convert an array of row objects into a CSV string with a header row.
 */
function rowsToCsv(rows: Record<string, unknown>[]): string {
  if (rows.length === 0) return "";
  const headers = Object.keys(rows[0]);
  const headerLine = headers.map(csvEscape).join(",");
  const dataLines = rows.map((row) =>
    headers.map((h) => csvEscape(row[h])).join(",")
  );
  return [headerLine, ...dataLines].join("\n");
}

/**
 * Build a CSV response with proper headers for download.
 */
function csvResponse(csv: string, question: string): Response {
  return new Response(csv, {
    status: 200,
    headers: {
      "Content-Type": "text/csv",
      "Content-Disposition": `attachment; filename="portland-${question}-data.csv"`,
      "Cache-Control": "no-store",
    },
  });
}

type QueryResult = Record<string, unknown>[];

async function queryCategory(question: string): Promise<{ rows: QueryResult; note?: string } | null> {
  switch (question) {
    case "housing": {
      const rows = await sql`
        SELECT permit_number, permit_type, application_date, issued_date,
               status, processing_days, valuation, neighborhood
        FROM housing.permits
        LIMIT ${ROW_LIMIT}
      `;
      return { rows: rows as unknown as QueryResult };
    }

    case "safety": {
      const rows = await sql`
        SELECT case_number, occur_date, offense_category, offense_type,
               neighborhood, crime_against
        FROM safety.ppb_offenses
        LIMIT ${ROW_LIMIT}
      `;
      return { rows: rows as unknown as QueryResult };
    }

    case "homelessness": {
      const rows = await sql`
        SELECT incident_date, is_vehicle, is_duplicate, lat, lon
        FROM homelessness.irp_campsite_reports
      `;
      return { rows: rows as unknown as QueryResult };
    }

    case "education": {
      // Join enrollment, graduation, and test scores for a combined export
      const enrollment = await sql`
        SELECT * FROM education.enrollment
      `;
      const graduation = await sql`
        SELECT * FROM education.graduation_rates
      `;
      const testScores = await sql`
        SELECT * FROM education.test_scores
      `;
      // Export each as a labeled section
      const sections: string[] = [];

      if (enrollment.length > 0) {
        sections.push("# Enrollment");
        sections.push(rowsToCsv(enrollment as unknown as QueryResult));
      }
      if (graduation.length > 0) {
        sections.push("\n# Graduation Rates");
        sections.push(rowsToCsv(graduation as unknown as QueryResult));
      }
      if (testScores.length > 0) {
        sections.push("\n# Test Scores");
        sections.push(rowsToCsv(testScores as unknown as QueryResult));
      }

      const csv = sections.join("\n");
      return { rows: [], note: csv };
    }

    case "economy": {
      const rows = await sql`
        SELECT * FROM economy.msa_employment_wages
      `;
      return { rows: rows as unknown as QueryResult };
    }

    case "transportation": {
      const ridership = await sql`SELECT * FROM transportation.ridership`;
      const crashes = await sql`SELECT * FROM transportation.crashes`;
      const commute = await sql`SELECT * FROM transportation.commute_mode`;

      const sections: string[] = [];
      if (ridership.length > 0) {
        sections.push("# Ridership");
        sections.push(rowsToCsv(ridership as unknown as QueryResult));
      }
      if (crashes.length > 0) {
        sections.push("\n# Crashes");
        sections.push(rowsToCsv(crashes as unknown as QueryResult));
      }
      if (commute.length > 0) {
        sections.push("\n# Commute Mode");
        sections.push(rowsToCsv(commute as unknown as QueryResult));
      }

      const csv = sections.join("\n");
      return { rows: [], note: csv };
    }

    case "quality": {
      const rows = await sql`
        SELECT * FROM quality.library_stats
      `;
      return { rows: rows as unknown as QueryResult };
    }

    case "accountability": {
      const rows = await sql`
        SELECT * FROM accountability.promises
      `;
      return { rows: rows as unknown as QueryResult };
    }

    case "fiscal": {
      return {
        rows: [],
        note: "category,note\nfiscal,\"Budget data is maintained in a static TypeScript file and is not available for CSV export from the database.\"",
      };
    }

    case "environment":
    case "climate": {
      const rows = await sql`
        SELECT * FROM climate.climate_emissions_trajectory
      `;
      return { rows: rows as unknown as QueryResult };
    }

    default:
      return null;
  }
}

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ question: string }> }
) {
  const { question } = await params;

  try {
    const result = await queryCategory(question);

    if (!result) {
      return NextResponse.json(
        { error: `Unknown category: ${question}` },
        { status: 404 }
      );
    }

    // If the query function returned a pre-built CSV string (multi-table categories)
    if (result.note && result.rows.length === 0) {
      return csvResponse(result.note, question);
    }

    // Single-table result
    const csv = rowsToCsv(result.rows);
    if (!csv) {
      return csvResponse("No data available for this category.\n", question);
    }

    return csvResponse(csv, question);
  } catch (error) {
    console.error(`[export] Failed to export ${question}:`, error);
    return NextResponse.json(
      { error: "Export failed. The database may be temporarily unavailable." },
      { status: 500 }
    );
  }
}
