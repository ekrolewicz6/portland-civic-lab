import type { MetadataRoute } from "next";

const BASE_URL = "https://www.portlandciviclab.org";

const DASHBOARD_QUESTIONS = [
  "housing",
  "homelessness",
  "safety",
  "transportation",
  "education",
  "fiscal",
  "economy",
  "climate",
  "quality",
  "accountability",
];

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const staticPages: MetadataRoute.Sitemap = [
    { url: BASE_URL, lastModified: now, changeFrequency: "weekly", priority: 1.0 },
    { url: `${BASE_URL}/dashboard`, lastModified: now, changeFrequency: "daily", priority: 0.9 },
    { url: `${BASE_URL}/directory`, lastModified: now, changeFrequency: "weekly", priority: 0.7 },
    { url: `${BASE_URL}/concierge`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${BASE_URL}/methodology`, lastModified: now, changeFrequency: "monthly", priority: 0.5 },
    { url: `${BASE_URL}/volunteer`, lastModified: now, changeFrequency: "monthly", priority: 0.6 },
    { url: `${BASE_URL}/open-data`, lastModified: now, changeFrequency: "monthly", priority: 0.6 },
    { url: `${BASE_URL}/apply`, lastModified: now, changeFrequency: "monthly", priority: 0.5 },
    { url: `${BASE_URL}/calculator`, lastModified: now, changeFrequency: "monthly", priority: 0.5 },
  ];

  const dashboardPages: MetadataRoute.Sitemap = DASHBOARD_QUESTIONS.map(
    (q) => ({
      url: `${BASE_URL}/dashboard/${q}`,
      lastModified: now,
      changeFrequency: "daily" as const,
      priority: 0.8,
    }),
  );

  return [...staticPages, ...dashboardPages];
}
