import { decisionsCsv, portfolio, today } from "@/lib/ced/model";
export const dynamic = "force-dynamic";
export function GET(request: Request) {
  const format = new URL(request.url).searchParams.get("format") ?? "json";
  if (!["csv", "json"].includes(format))
    return new Response("Use format=json or format=csv", { status: 400 });
  const csv = format === "csv";
  return new Response(
    csv
      ? "\ufeff" + decisionsCsv(today())
      : JSON.stringify(
          {
            ...portfolio,
            evaluatedAt: today(),
            scope:
              "Public-source demonstration; not authoritative City status. Funding amounts overlap and must not be summed indiscriminately.",
          },
          null,
          2,
        ),
    {
      headers: {
        "Content-Type": csv
          ? "text/csv; charset=utf-8"
          : "application/json; charset=utf-8",
        "Content-Disposition": `attachment; filename="ced-portfolio-${portfolio.edition}.${format}"`,
        "Cache-Control": "no-store",
        "X-Content-Type-Options": "nosniff",
      },
    },
  );
}
