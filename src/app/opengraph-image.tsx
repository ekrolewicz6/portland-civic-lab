import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt =
  "Portland Civic Lab — How is Portland actually doing? Eight questions held to public record.";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// Newspaper-masthead style OG image, mirrors the homepage hero.
export default async function Image() {
  const editionDate = new Date()
    .toLocaleDateString("en-US", {
      weekday: "long",
      month: "long",
      day: "numeric",
      year: "numeric",
    })
    .toUpperCase();

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          backgroundColor: "#0f2419",
          color: "white",
          padding: "64px 80px",
          fontFamily: "serif",
          position: "relative",
        }}
      >
        {/* Top edition rule */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "20px",
            fontSize: "16px",
            letterSpacing: "0.22em",
            textTransform: "uppercase",
            color: "rgba(255,255,255,0.4)",
            fontFamily: "monospace",
          }}
        >
          <span style={{ color: "rgba(225,138,75,0.85)" }}>VOL. I · NO. 1</span>
          <div style={{ flex: 1, height: "1px", background: "rgba(255,255,255,0.15)" }} />
          <span>{editionDate}</span>
        </div>

        {/* Wordmark */}
        <div
          style={{
            display: "flex",
            alignItems: "baseline",
            gap: "16px",
            marginTop: "44px",
          }}
        >
          <div
            style={{
              fontSize: "22px",
              fontWeight: 700,
              letterSpacing: "-0.01em",
              color: "white",
            }}
          >
            PORTLAND CIVIC LAB
          </div>
          <div
            style={{
              fontSize: "13px",
              fontFamily: "monospace",
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              color: "rgba(120,180,140,0.7)",
            }}
          >
            CIVIC DASHBOARD
          </div>
        </div>

        {/* Headline */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            marginTop: "36px",
            fontSize: "92px",
            lineHeight: 1.02,
            letterSpacing: "-0.025em",
            color: "white",
            fontWeight: 400,
          }}
        >
          <div style={{ display: "flex" }}>How is Portland</div>
          <div style={{ display: "flex", alignItems: "baseline", gap: "20px" }}>
            <span style={{ fontStyle: "italic", color: "#e8a857" }}>
              actually
            </span>
            <span>doing?</span>
          </div>
        </div>

        {/* Bottom rule + tagline */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            position: "absolute",
            left: "80px",
            right: "80px",
            bottom: "64px",
          }}
        >
          <div
            style={{
              height: "1px",
              background:
                "linear-gradient(to right, rgba(225,138,75,0.5), rgba(255,255,255,0.15), transparent)",
              marginBottom: "24px",
            }}
          />
          <div
            style={{
              display: "flex",
              alignItems: "baseline",
              justifyContent: "space-between",
              gap: "40px",
            }}
          >
            <div
              style={{
                fontSize: "22px",
                color: "rgba(255,255,255,0.65)",
                lineHeight: 1.4,
                maxWidth: "780px",
              }}
            >
              Eight questions held to public record. Real data, updated
              automatically, no spin.
            </div>
            <div
              style={{
                fontSize: "13px",
                fontFamily: "monospace",
                letterSpacing: "0.2em",
                textTransform: "uppercase",
                color: "rgba(225,138,75,0.7)",
                whiteSpace: "nowrap",
              }}
            >
              portlandciviclab.org
            </div>
          </div>
        </div>
      </div>
    ),
    { ...size },
  );
}
