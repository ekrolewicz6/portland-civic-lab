import { notFound } from "next/navigation";
import { isValidQuestion, questionMeta } from "@/lib/questions";
import type { DashboardResponse } from "@/lib/types";

interface PageProps {
  params: Promise<{ question: string }>;
}

async function fetchQuestionData(
  question: string
): Promise<DashboardResponse> {
  const baseUrl =
    process.env.NEXT_PUBLIC_BASE_URL ||
    (process.env.VERCEL_URL
      ? `https://${process.env.VERCEL_URL}`
      : "http://localhost:3000");

  const res = await fetch(`${baseUrl}/api/dashboard/${question}`, {
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error(`Failed to fetch data for ${question}`);
  }

  return res.json();
}

export async function generateStaticParams() {
  return [
    { question: "housing" },
    { question: "homelessness" },
    { question: "safety" },
    { question: "transportation" },
    { question: "education" },
    { question: "fiscal" },
    { question: "economy" },
    { question: "climate" },
    { question: "quality" },
    { question: "accountability" },
  ];
}

export async function generateMetadata({ params }: PageProps) {
  const { question } = await params;
  if (!isValidQuestion(question)) return {};
  const meta = questionMeta[question];
  return {
    title: `${meta.shortTitle} — Portland Civic Lab`,
    description: meta.description,
  };
}

export default async function EmbedPage({ params }: PageProps) {
  const { question } = await params;

  // Redirect environment alias
  if (question === "environment") {
    return notFound();
  }

  if (!isValidQuestion(question)) {
    notFound();
  }

  const meta = questionMeta[question];

  let data: DashboardResponse | null = null;
  try {
    data = await fetchQuestionData(question);
  } catch {
    data = null;
  }

  const trendColor =
    data?.trend?.direction === "up"
      ? "#22c55e"
      : data?.trend?.direction === "down"
        ? "#ef4444"
        : "#a8a29e";

  const trendBg =
    data?.trend?.direction === "up"
      ? "rgba(34,197,94,0.10)"
      : data?.trend?.direction === "down"
        ? "rgba(239,68,68,0.10)"
        : "rgba(168,162,158,0.10)";

  return (
    <div
      style={{
        fontFamily: "var(--font-body), system-ui, sans-serif",
        maxWidth: 480,
        margin: "0 auto",
        padding: 0,
      }}
    >
      {/* Card */}
      <div
        style={{
          border: "1px solid #ebe5da",
          borderRadius: 8,
          overflow: "hidden",
          backgroundColor: "#faf6f0",
        }}
      >
        {/* Color bar */}
        <div
          style={{
            height: 4,
            backgroundColor: meta.color,
          }}
        />

        <div style={{ padding: "20px 24px 16px" }}>
          {/* Category label */}
          <div
            style={{
              fontSize: 11,
              fontWeight: 600,
              textTransform: "uppercase" as const,
              letterSpacing: "0.15em",
              color: "#78716c",
              marginBottom: 6,
            }}
          >
            {meta.shortTitle}
          </div>

          {/* Question title */}
          <h2
            style={{
              fontFamily: "var(--font-display), system-ui, sans-serif",
              fontSize: 22,
              fontWeight: 500,
              color: "#1c1917",
              lineHeight: 1.2,
              margin: "0 0 12px",
            }}
          >
            {meta.title}
          </h2>

          {data ? (
            <>
              {/* Headline value */}
              <p
                style={{
                  fontSize: 15,
                  color: "#44403c",
                  lineHeight: 1.5,
                  margin: "0 0 14px",
                }}
              >
                {data.headline}
              </p>

              {/* Trend pill */}
              {data.trend && (
                <span
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 4,
                    fontSize: 13,
                    fontWeight: 600,
                    fontFamily: "var(--font-mono), monospace",
                    color: trendColor,
                    backgroundColor: trendBg,
                    padding: "4px 12px",
                    borderRadius: 100,
                    letterSpacing: "0.01em",
                  }}
                >
                  {data.trend.direction === "up"
                    ? "\u2191"
                    : data.trend.direction === "down"
                      ? "\u2193"
                      : "\u2192"}{" "}
                  {data.trend.direction === "up" ? "+" : ""}
                  {data.trend.percentage}% {data.trend.label}
                </span>
              )}
            </>
          ) : (
            <p
              style={{
                fontSize: 14,
                color: "#78716c",
                fontStyle: "italic",
                margin: 0,
              }}
            >
              Data temporarily unavailable.
            </p>
          )}
        </div>

        {/* Footer: source + powered-by */}
        <div
          style={{
            borderTop: "1px solid #ebe5da",
            padding: "10px 24px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: 12,
          }}
        >
          {data?.source && (
            <span
              style={{
                fontSize: 11,
                color: "#a8a29e",
                whiteSpace: "nowrap" as const,
                overflow: "hidden",
                textOverflow: "ellipsis",
                flex: 1,
                minWidth: 0,
              }}
            >
              {data.source}
            </span>
          )}
          <a
            href={`https://www.portlandciviclab.org/dashboard/${question}`}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              fontSize: 11,
              fontWeight: 600,
              color: meta.color,
              textDecoration: "none",
              whiteSpace: "nowrap" as const,
              flexShrink: 0,
            }}
          >
            Portland Civic Lab &rarr;
          </a>
        </div>
      </div>
    </div>
  );
}
