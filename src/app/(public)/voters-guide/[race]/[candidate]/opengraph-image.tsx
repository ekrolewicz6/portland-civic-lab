import { ImageResponse } from "next/og";
import logo from "@/lib/og-logo.json";
import { findRace } from "@/lib/voters-guide/published";
import { displayNameSize, loadOgFonts, OG_CACHE_HEADERS, OG_CONTENT_TYPE, OG_PALETTE, OG_SIZE } from "@/lib/voters-guide/race-sheet/og-fonts";
import { candidateImageAlt, candidateRole, raceFacts } from "@/lib/voters-guide/race-sheet/seo";

/**
 * Share image for a candidate brief. Typographic, no portrait: every
 * candidate gets the same card with their name set large, their role line,
 * and the district panel. The name shrinks by one rule for everyone so long
 * names fit; nothing else changes from person to person.
 */
export const runtime = "edge";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

type Params = { race: string; candidate: string };

function resolve({ race: raceId, candidate: personId }: Params) {
  const race = findRace(raceId);
  const person = race?.candidates.find((c) => c.id === personId);
  return race && person ? { race, person } : null;
}

// No generateStaticParams: Next forbids it alongside the edge runtime, and
// webpack-dev aborts the whole route table on that error. Each image is
// rendered on request and cached for a year by OG_CACHE_HEADERS.

/** One image per brief, with the candidate's own alt text. Its URL ends in `/opengraph-image/card`. */
export async function generateImageMetadata({ params }: { params: Params | Promise<Params> }) {
  const found = resolve(await params);
  if (!found) return [];
  return [{ id: "card", alt: candidateImageAlt(found.race, found.person), size, contentType }];
}

export default async function Image({ params }: { params: Params | Promise<Params> }) {
  const found = resolve(await params);
  if (!found) return new Response("Image not found", { status: 404 });
  const { race, person } = found;
  const { district, short } = raceFacts(race);
  const fonts = await loadOgFonts();
  const { green, cream, gold, moss, pine, hairline, frame, mist } = OG_PALETTE;
  const nameSize = displayNameSize(person.name);

  return new ImageResponse(
    <div style={{ display: "flex", width: "100%", height: "100%", background: cream, color: green, fontFamily: "DM Sans", position: "relative" }}>
      <div style={{ display: "flex", flexDirection: "column", width: 800, padding: "46px 60px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 14, fontSize: 24 }}>
          {/* Embedded brand asset, not a remote fetch. Satori requires native img. */}
          <img src={logo} width={45} height={45} alt="" />
          Portland Civic Lab
        </div>
        <div style={{ display: "flex", fontSize: 20, letterSpacing: "0.1em", marginTop: 40, color: moss }}>
          {`PORTLAND CITY COUNCIL · ${short.toUpperCase()}`}
        </div>
        <div style={{ display: "flex", width: 680, fontFamily: "Cormorant", fontSize: nameSize, lineHeight: 0.95, letterSpacing: "-0.03em", marginTop: 18 }}>
          {person.name}
        </div>
        <div style={{ display: "flex", marginTop: 22, fontSize: 28, lineHeight: 1.35, color: pine, width: 680 }}>
          {candidateRole(person)}
        </div>
        <div style={{ display: "flex", marginTop: 20, fontSize: 24, lineHeight: 1.35, color: moss, width: 680 }}>
          What they propose, our reading of it, and every source. Same questions for everyone.
        </div>
        <div style={{ position: "absolute", display: "flex", left: 60, bottom: 43, width: 675, paddingTop: 20, borderTop: `1px solid ${hairline}`, alignItems: "center", justifyContent: "space-between", fontSize: 21 }}>
          <span>NOVEMBER 3, 2026</span>
          <span style={{ color: moss }}>Free & nonpartisan</span>
        </div>
      </div>
      <div style={{ display: "flex", flexDirection: "column", width: 400, height: "100%", background: green, color: cream, alignItems: "center", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", top: 28, right: 28, bottom: 28, left: 28, border: `1px solid ${frame}`, borderRadius: "180px 180px 0 0" }} />
        {district ? (
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", width: "100%" }}>
            <span style={{ marginTop: 110, fontSize: 23, letterSpacing: "0.18em", color: gold }}>DISTRICT</span>
            <span style={{ fontFamily: "Cormorant", fontSize: 260, lineHeight: 1, marginTop: -42, transform: district === "3" ? "translateY(-60px)" : "translateY(0px)" }}>{district}</span>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", marginTop: 16, fontSize: 25, lineHeight: 1.4, color: gold }}>
              <span>Candidate brief.</span>
              <span>Free & nonpartisan.</span>
            </div>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", width: "100%", padding: "0 48px" }}>
            <svg width="64" height="64" viewBox="0 0 64 64" style={{ marginTop: 106 }}><rect x="5" y="5" width="54" height="54" rx="6" fill="none" stroke={gold} strokeWidth="2" /><path d="M18 31L28 41L47 21" fill="none" stroke={gold} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" /></svg>
            <div style={{ display: "flex", fontFamily: "Cormorant", fontSize: 56, lineHeight: 1.05, marginTop: 31, textAlign: "center" }}>{race.title}</div>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", marginTop: 30, fontSize: 23, lineHeight: 1.4, color: gold }}>
              <span>Candidate brief.</span>
              <span>Free & nonpartisan.</span>
            </div>
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
