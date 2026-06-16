import type { ReactElement } from "react";

// Shared Open Graph image frame — the newspaper-masthead look used across the
// site, so every share card is unmistakably Portland Civic Lab. Pass an
// eyebrow, headline, an accent color, and EITHER a description OR a row of
// stats. Used by every route's opengraph-image.tsx via `new ImageResponse(...)`.
//
// Satori (next/og) only supports flexbox — every element with >1 child sets
// display:flex.

export const OG_SIZE = { width: 1200, height: 630 };
export const OG_CONTENT_TYPE = "image/png";

const BG = "#0f2419";
export const EMBER = "#e1864b";

export interface OgStat {
  value: string;
  label: string;
}

export interface OgProps {
  eyebrow: string;
  headline: string;
  description?: string;
  stats?: OgStat[];
  accent?: string;
  footerLeft?: string;
}

export function ogFrame({
  eyebrow,
  headline,
  description,
  stats,
  accent = EMBER,
  footerLeft = "Real public data · every number linked to its source",
}: OgProps): ReactElement {
  const len = headline.length;
  const headlineSize = len > 46 ? 60 : len > 30 ? 74 : 88;
  const editionDate = new Date()
    .toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    })
    .toUpperCase();

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        backgroundColor: BG,
        color: "white",
        padding: "60px 80px",
        fontFamily: "serif",
        position: "relative",
      }}
    >
      {/* top accent bar */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: "8px",
          background: accent,
        }}
      />

      {/* edition rule */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "20px",
          fontSize: "15px",
          letterSpacing: "0.22em",
          textTransform: "uppercase",
          color: "rgba(255,255,255,0.4)",
          fontFamily: "monospace",
        }}
      >
        <span style={{ color: "rgba(225,138,75,0.85)" }}>PORTLAND CIVIC LAB</span>
        <div style={{ flex: 1, height: "1px", background: "rgba(255,255,255,0.15)" }} />
        <span>{editionDate}</span>
      </div>

      {/* eyebrow */}
      <div
        style={{
          display: "flex",
          marginTop: "50px",
          fontSize: "18px",
          fontFamily: "monospace",
          letterSpacing: "0.22em",
          textTransform: "uppercase",
          color: accent,
          fontWeight: 600,
        }}
      >
        {eyebrow}
      </div>

      {/* headline */}
      <div
        style={{
          display: "flex",
          marginTop: "18px",
          fontSize: `${headlineSize}px`,
          lineHeight: 1.04,
          letterSpacing: "-0.025em",
          color: "white",
          fontWeight: 400,
          maxWidth: "1040px",
        }}
      >
        {headline}
      </div>

      {/* stats row OR description */}
      {stats && stats.length > 0 ? (
        <div style={{ display: "flex", marginTop: "44px", gap: "56px" }}>
          {stats.map((s, i) => (
            <div key={i} style={{ display: "flex", flexDirection: "column" }}>
              <div style={{ display: "flex", fontSize: "46px", color: "white", lineHeight: 1 }}>
                {s.value}
              </div>
              <div
                style={{
                  display: "flex",
                  marginTop: "10px",
                  fontSize: "15px",
                  fontFamily: "monospace",
                  letterSpacing: "0.12em",
                  textTransform: "uppercase",
                  color: "rgba(255,255,255,0.5)",
                }}
              >
                {s.label}
              </div>
            </div>
          ))}
        </div>
      ) : description ? (
        <div
          style={{
            display: "flex",
            marginTop: "28px",
            fontSize: "22px",
            lineHeight: 1.4,
            color: "rgba(255,255,255,0.6)",
            maxWidth: "940px",
          }}
        >
          {description.length > 190 ? description.slice(0, 190) + "…" : description}
        </div>
      ) : null}

      {/* footer */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          position: "absolute",
          left: "80px",
          right: "80px",
          bottom: "58px",
        }}
      >
        <div
          style={{
            height: "1px",
            background: `linear-gradient(to right, ${accent}, rgba(255,255,255,0.15), transparent)`,
            marginBottom: "20px",
          }}
        />
        <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between" }}>
          <div
            style={{
              display: "flex",
              fontSize: "14px",
              fontFamily: "monospace",
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              color: "rgba(255,255,255,0.45)",
            }}
          >
            {footerLeft}
          </div>
          <div
            style={{
              display: "flex",
              fontSize: "14px",
              fontFamily: "monospace",
              letterSpacing: "0.2em",
              textTransform: "uppercase",
              color: "rgba(225,138,75,0.7)",
            }}
          >
            portlandciviclab.org
          </div>
        </div>
      </div>
    </div>
  );
}
