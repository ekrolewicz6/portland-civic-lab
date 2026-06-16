import { ImageResponse } from "next/og";
import { ogFrame, OG_SIZE, OG_CONTENT_TYPE } from "@/lib/og-template";
import { getBureauDetail, bureauIds } from "@/lib/org/bureau";
import { SERVICE_AREA_BY_SLUG } from "@/data/org-structure";

// Generated at build for every bureau (the page is statically generated).
export const runtime = "nodejs";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;
export const alt = "Portland bureau — headcount, salary cost, and budget";

export function generateStaticParams() {
  return bureauIds().map((bureauId) => ({ bureauId }));
}

function money(n: number): string {
  if (n >= 1e9) return `$${(n / 1e9).toFixed(2)}B`;
  if (n >= 1e6) return `$${(n / 1e6).toFixed(1)}M`;
  if (n >= 1e3) return `$${Math.round(n / 1e3)}k`;
  return `$${Math.round(n)}`;
}

export default function Image({
  params,
}: {
  params: { bureauId: string };
}) {
  const d = getBureauDetail(params.bureauId);
  if (!d) {
    return new ImageResponse(
      ogFrame({ eyebrow: "City government", headline: "Portland bureau" }),
      { ...OG_SIZE },
    );
  }
  const sa = SERVICE_AREA_BY_SLUG[d.node.serviceArea];
  return new ImageResponse(
    ogFrame({
      eyebrow: sa.label,
      headline: d.node.name,
      accent: sa.color,
      stats: [
        { value: money(d.personnel.totalCost), label: "Salary cost" },
        {
          value: d.personnel.totalFte.toLocaleString(undefined, {
            maximumFractionDigits: 0,
          }),
          label: "Authorized FTE",
        },
        {
          value: d.finance ? money(d.finance.operatingTotal) : "—",
          label: "Operating budget",
        },
      ],
    }),
    { ...OG_SIZE },
  );
}
