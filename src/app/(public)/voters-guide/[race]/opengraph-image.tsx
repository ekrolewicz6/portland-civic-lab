import { ImageResponse } from "next/og";
import logo from "@/lib/og-logo.json";
import { findRace } from "@/lib/voters-guide/published";
import { loadOgFonts, OG_CACHE_HEADERS, OG_CONTENT_TYPE, OG_PALETTE, OG_SIZE } from "@/lib/voters-guide/race-sheet/og-fonts";
import { RACE_IMAGE_ALT, raceFacts } from "@/lib/voters-guide/race-sheet/seo";

/**
 * Share image for a race sheet: the district card's family (cream panel,
 * deep green panel with the arched frame, gold accents) with the district
 * numeral and the one promise the page makes, "Every candidate on one page".
 */
export const runtime = "edge";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;
export const alt = RACE_IMAGE_ALT;

// No generateStaticParams: Next forbids it alongside the edge runtime, and
// webpack-dev aborts the whole route table on that error. The image is
// rendered on request and cached for a year by OG_CACHE_HEADERS.

export default async function Image({ params }: { params: Promise<{ race: string }> }) {
  const { race: id } = await params;
  const race = findRace(id);
  if (!race) return new Response("Image not found", { status: 404 });
  const { district, short, strapline, seatsWord, body, mark, council } = raceFacts(race);
  const fonts = await loadOgFonts();
  const { green, cream, gold, moss, pine, hairline, frame, mist } = OG_PALETTE;
  const seatsLine = race.seats === 1 ? "One seat. Your say." : `${seatsWord[0].toUpperCase()}${seatsWord.slice(1)} seats. Your say.`;

  return new ImageResponse(
    <div style={{ display: "flex", width: "100%", height: "100%", background: cream, color: green, fontFamily: "DM Sans", position: "relative" }}>
      <div style={{ display: "flex", flexDirection: "column", width: 800, padding: "46px 60px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 14, fontSize: 24 }}>
          {/* Embedded brand asset, not a remote fetch. Satori requires native img. */}
          <img src={logo} width={45} height={45} alt="" />
          Portland Civic Lab
        </div>
        <div style={{ display: "flex", fontSize: 20, letterSpacing: "0.1em", marginTop: 40, color: moss }}>
          {`${body.toUpperCase()} · ${short.toUpperCase()}`}
        </div>
        <div style={{ display: "flex", flexDirection: "column", fontFamily: "Cormorant", fontSize: 104, lineHeight: 0.95, letterSpacing: "-0.04em", marginTop: 18 }}>
          <span>Every candidate</span>
          <span>on one page.</span>
        </div>
        <div style={{ display: "flex", flexDirection: "column", marginTop: 26, fontSize: 28, lineHeight: 1.35, color: pine }}>
          <span>What each says on rent, safety, taxes and streets.</span>
          <span>{council ? "How sitting councilors voted. Every source." : "How they would deliver it. Every source."}</span>
        </div>
        <div style={{ position: "absolute", display: "flex", left: 60, bottom: 43, width: 675, paddingTop: 20, borderTop: `1px solid ${hairline}`, alignItems: "center", justifyContent: "space-between", fontSize: 21 }}>
          <span>{strapline.toUpperCase()}</span>
          <span style={{ color: moss }}>Free & nonpartisan</span>
        </div>
      </div>
      <div style={{ display: "flex", flexDirection: "column", width: 400, height: "100%", background: green, color: cream, alignItems: "center", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", top: 28, right: 28, bottom: 28, left: 28, border: `1px solid ${frame}`, borderRadius: "180px 180px 0 0" }} />
        {district ? (
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", width: "100%" }}>
            <span style={{ marginTop: 110, fontSize: 23, letterSpacing: "0.18em", color: gold }}>DISTRICT</span>
            <span style={{ fontFamily: "Cormorant", fontSize: 260, lineHeight: 1, marginTop: -42, transform: district === "3" ? "translateY(-60px)" : "translateY(0px)" }}>{district}</span>
            <span style={{ fontSize: 25, marginTop: 22, color: gold }}>{seatsLine}</span>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", width: "100%", padding: "0 48px" }}>
            <svg width="64" height="64" viewBox="0 0 64 64" style={{ marginTop: 106 }}><rect x="5" y="5" width="54" height="54" rx="6" fill="none" stroke={gold} strokeWidth="2" /><path d="M18 31L28 41L47 21" fill="none" stroke={gold} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" /></svg>
            <div style={{ display: "flex", fontFamily: "Cormorant", fontSize: mark.length > 4 ? 88 : 132, lineHeight: 1, marginTop: 26, letterSpacing: "-0.02em" }}>{mark}</div>
            <div style={{ display: "flex", fontSize: 26, lineHeight: 1.2, marginTop: 14, textAlign: "center" }}>{short.toLowerCase().replace(/[^a-z]/g, "") === mark.toLowerCase().replace(/[^a-z]/g, "") ? body : short}</div>
            <span style={{ fontSize: 23, marginTop: 30, color: gold }}>{seatsLine}</span>
          </div>
        )}
        <div style={{ position: "absolute", display: "flex", flexDirection: "column", alignItems: "center", bottom: 57, fontSize: 19, lineHeight: 1.5, color: mist }}>
          <span>Plans · Sources · Record</span>
          <span style={{ marginTop: 18, fontSize: 17 }}>portlandciviclab.org</span>
        </div>
      </div>
    </div>,
    { ...size, fonts, headers: OG_CACHE_HEADERS },
  );
}
