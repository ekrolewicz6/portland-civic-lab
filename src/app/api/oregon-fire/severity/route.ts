import { NextResponse } from "next/server";
import { z } from "zod";
import { MTBS_WMS, MTBS_VERIFIED_YEAR } from "@/lib/oregon-fire/landscape";

const query = z.object({
  year: z.coerce.number().int().min(2000).max(MTBS_VERIFIED_YEAR),
  z: z.coerce.number().int().min(0).max(18),
  x: z.coerce.number().int().min(0),
  y: z.coerce.number().int().min(0),
});
export async function GET(request: Request) {
  const p = query.safeParse(
    Object.fromEntries(new URL(request.url).searchParams),
  );
  if (!p.success)
    return NextResponse.json(
      { error: "Invalid severity tile" },
      { status: 400 },
    );
  const { year, z, x, y } = p.data,
    n = 2 ** z;
  if (x >= n || y >= n)
    return NextResponse.json(
      { error: "Invalid tile coordinates" },
      { status: 400 },
    );
  const edge = 20037508.342789244,
    step = (2 * edge) / n;
  const bbox = [
    -edge + x * step,
    edge - (y + 1) * step,
    -edge + (x + 1) * step,
    edge - y * step,
  ];
  const url = new URL(MTBS_WMS);
  url.search = new URLSearchParams({
    service: "WMS",
    request: "GetMap",
    version: "1.1.1",
    layers: `mtbs_CONUS_${year}`,
    styles: "",
    format: "image/png",
    transparent: "true",
    srs: "EPSG:3857",
    bbox: bbox.join(","),
    width: "256",
    height: "256",
  }).toString();
  try {
    const r = await fetch(url, {
      signal: AbortSignal.timeout(20000),
      next: { revalidate: 86400 },
    });
    if (!r.ok || !r.headers.get("content-type")?.includes("image/png"))
      throw new Error("Upstream did not return an image");
    const bytes = new Uint8Array(await r.arrayBuffer());
    if (
      bytes.length < 24 ||
      ![137, 80, 78, 71, 13, 10, 26, 10].every((v, i) => bytes[i] === v)
    )
      throw new Error("Invalid PNG");
    return new Response(bytes, {
      headers: {
        "Content-Type": "image/png",
        "Cache-Control": "public, max-age=3600, s-maxage=86400",
        "X-Fire-Source": "USGS-USFS-MTBS",
        "X-Fire-Assessment-Year": String(year),
      },
    });
  } catch {
    return NextResponse.json(
      { error: "MTBS assessment tile unavailable" },
      { status: 502, headers: { "Cache-Control": "no-store" } },
    );
  }
}
