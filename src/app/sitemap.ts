import type { MetadataRoute } from "next";
import { races } from "@/lib/voters-guide/published";
import { REVIEW_DATE } from "@/lib/voters-guide/types";
import { bureauIds } from "@/lib/org/bureau";
import { VALID_QUESTIONS } from "@/lib/questions";

const BASE_URL = "https://www.portlandciviclab.org";

/**
 * Question slugs that redirect rather than render, and so must not be listed.
 * /dashboard/environment redirects to /dashboard/climate.
 */
const REDIRECTING_QUESTIONS = new Set(["environment"]);

// Derived from the canonical list rather than hand-maintained. The previous
// hard-coded copy had drifted and omitted /dashboard/economic-health, a live
// page that was therefore never submitted.
const DASHBOARD_QUESTIONS = VALID_QUESTIONS.filter(
  (q) => !REDIRECTING_QUESTIONS.has(q),
);

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const staticPages: MetadataRoute.Sitemap = [
    { url: BASE_URL, lastModified: now, changeFrequency: "weekly", priority: 1.0 },
    { url: `${BASE_URL}/dashboard`, lastModified: now, changeFrequency: "daily", priority: 0.9 },
    { url: `${BASE_URL}/org-chart`, lastModified: now, changeFrequency: "weekly", priority: 0.7 },
    { url: `${BASE_URL}/directory`, lastModified: now, changeFrequency: "weekly", priority: 0.7 },
    { url: `${BASE_URL}/concierge`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${BASE_URL}/methodology`, lastModified: now, changeFrequency: "monthly", priority: 0.5 },
    { url: `${BASE_URL}/volunteer`, lastModified: now, changeFrequency: "monthly", priority: 0.6 },
    { url: `${BASE_URL}/open-data`, lastModified: now, changeFrequency: "monthly", priority: 0.6 },
    { url: `${BASE_URL}/records`, lastModified: now, changeFrequency: "weekly", priority: 0.7 },
    { url: `${BASE_URL}/proposals`, lastModified: now, changeFrequency: "daily", priority: 0.7 },
    { url: `${BASE_URL}/donate`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${BASE_URL}/deep-dives`, lastModified: now, changeFrequency: "weekly", priority: 0.8 },
    ...["", "/case-studies", "/methodology", "/tables", "/community-research-kit", "/gaps", "/sources"].map((section) => ({
      url: `${BASE_URL}/deep-dives/maker-economy${section}`,
      lastModified: new Date("2026-09-15T00:00:00Z"),
      changeFrequency: "monthly" as const,
      priority: section ? 0.6 : 0.8,
    })),
    { url: `${BASE_URL}/oregon-fire`, lastModified: now, changeFrequency: "daily", priority: 0.8 },
    {
      url: `${BASE_URL}/deep-dives/pps-budget`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/deep-dives/venue-portfolio`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/deep-dives/i-5-rose-quarter`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/deep-dives/city-budget`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/deep-dives/data-centers`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/deep-dives/portland-growth-politics`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/deep-dives/oregon-economic-development`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/deep-dives/fpdr`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/deep-dives/lloyd`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/deep-dives/mass-timber`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/deep-dives/homelessness`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/deep-dives/who-runs-portland`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    { url: `${BASE_URL}/business`, lastModified: now, changeFrequency: "weekly", priority: 0.8 },
    { url: `${BASE_URL}/property`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${BASE_URL}/about`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${BASE_URL}/institutions`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${BASE_URL}/independence`, lastModified: now, changeFrequency: "monthly", priority: 0.6 },
    { url: `${BASE_URL}/decisions`, lastModified: now, changeFrequency: "weekly", priority: 0.7 },
  ];

  const dashboardPages: MetadataRoute.Sitemap = DASHBOARD_QUESTIONS.map(
    (q) => ({
      url: `${BASE_URL}/dashboard/${q}`,
      lastModified: now,
      changeFrequency: "daily" as const,
      priority: 0.8,
    }),
  );

  const bureauPages: MetadataRoute.Sitemap = bureauIds().map((id) => ({
    url: `${BASE_URL}/org-chart/${id}`,
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }));

  const guidePages: MetadataRoute.Sitemap = [
    "", "/methodology", "/research-log", ...races.map(r => `/${r.id}`),
  ].map(path => ({
    url: `${BASE_URL}/voters-guide${path}`,
    lastModified: new Date(`${REVIEW_DATE}T00:00:00Z`),
    changeFrequency: "weekly",
    priority: path ? 0.7 : 0.9,
  }));
  return [...staticPages, ...dashboardPages, ...bureauPages, ...guidePages];
}
