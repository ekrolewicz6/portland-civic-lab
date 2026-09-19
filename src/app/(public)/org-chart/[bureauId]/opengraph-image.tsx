import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ogImage, OG_SIZE, OG_CONTENT_TYPE } from "@/lib/og-template";
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

export default async function Image({
  params,
}: {
  params: Promise<{ bureauId: string }>;
}) {
  const { bureauId } = await params;
  const [serif, sans] = await Promise.all([
    readFile(join(process.cwd(), "src/lib/oregon-fire/fonts/CormorantGaramond-Medium.ttf")),
    readFile(join(process.cwd(), "src/lib/oregon-fire/fonts/DMSans-Regular.ttf")),
  ]);
  const fonts = [{ name: "Cormorant", data: serif, weight: 500 as const, style: "normal" as const }, { name: "DM Sans", data: sans, weight: 400 as const, style: "normal" as const }];
  const d = getBureauDetail(bureauId);
  if (!d) {
    return ogImage({ eyebrow: "City government", headline: "Portland bureau" }, fonts);
  }
  const sa = SERVICE_AREA_BY_SLUG[d.node.serviceArea];
  return ogImage({
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
    }, fonts);
}
