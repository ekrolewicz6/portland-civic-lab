import { ImageResponse } from "next/og";
import { isValidQuestion, questionMeta } from "@/lib/questions";

export const runtime = "edge";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = "Portland Civic Lab dashboard section";

interface Props {
  params: { question: string };
}

// Per-section OG image. Same newspaper masthead frame as the homepage,
// but with the section name + question. Color accent comes from the
// section's brand color.
export default async function Image({ params }: Props) {
  const { question } = params;
  const meta = isValidQuestion(question) ? questionMeta[question] : null;
  const sectionLabel = meta?.shortTitle ?? "Section";
  const headline = meta?.title ?? "Portland Civic Lab";
  const description = meta?.description ?? "";
  const accent = meta?.color ?? "#e1864b";

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
        {/* Top accent bar */}
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

        {/* Edition rule */}
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
            marginTop: "32px",
          }}
        >
          <div
            style={{
              fontSize: "20px",
              fontWeight: 700,
              letterSpacing: "-0.01em",
              color: "white",
            }}
          >
            PORTLAND CIVIC LAB
          </div>
          <div
            style={{
              fontSize: "12px",
              fontFamily: "monospace",
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              color: "rgba(120,180,140,0.7)",
            }}
          >
            CIVIC DASHBOARD
          </div>
        </div>

        {/* Section label */}
        <div
          style={{
            marginTop: "44px",
            fontSize: "18px",
            fontFamily: "monospace",
            letterSpacing: "0.22em",
            textTransform: "uppercase",
            color: accent,
            fontWeight: 600,
          }}
        >
          {sectionLabel}
        </div>

        {/* Headline question */}
        <div
          style={{
            display: "flex",
            marginTop: "16px",
            fontSize: headline.length > 32 ? "68px" : "84px",
            lineHeight: 1.04,
            letterSpacing: "-0.025em",
            color: "white",
            fontWeight: 400,
            maxWidth: "1020px",
          }}
        >
          {headline}
        </div>

        {/* Description */}
        {description && (
          <div
            style={{
              display: "flex",
              marginTop: "28px",
              fontSize: "20px",
              lineHeight: 1.4,
              color: "rgba(255,255,255,0.55)",
              maxWidth: "920px",
            }}
          >
            {description.length > 180 ? description.slice(0, 180) + "…" : description}
          </div>
        )}

        {/* Bottom rule + URL */}
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
              background: `linear-gradient(to right, ${accent}, rgba(255,255,255,0.15), transparent)`,
              marginBottom: "20px",
            }}
          />
          <div
            style={{
              display: "flex",
              alignItems: "baseline",
              justifyContent: "space-between",
            }}
          >
            <div
              style={{
                fontSize: "14px",
                fontFamily: "monospace",
                letterSpacing: "0.2em",
                textTransform: "uppercase",
                color: "rgba(255,255,255,0.45)",
              }}
            >
              Real public data · Updated automatically
            </div>
            <div
              style={{
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
    ),
    { ...size },
  );
}
