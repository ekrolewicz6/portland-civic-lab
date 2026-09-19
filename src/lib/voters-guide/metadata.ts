import type { Metadata } from "next";

export const GUIDE_ORIGIN = "https://www.portlandciviclab.org";
export const GUIDE_IMAGE_VERSION = "20260919-1";
export const guideCards = {
  guide: {
    path: "/voters-guide",
    title: "Portland Voter Guide 2026 | Compare City Council Candidates",
    description: "Compare Portland City Council candidates in Districts 3 and 4 for November 3, 2026. Explore their plans, experience and votes in a free, nonpartisan guide.",
    eyebrow: "CITY COUNCIL · DISTRICTS 3 & 4",
    label: "Portland voter guide",
    district: "",
  },
  "district-3": {
    path: "/voters-guide/portland-district-3",
    title: "Portland District 3 Voter Guide 2026 | Compare Candidates",
    description: "Meet Portland District 3 City Council candidates for November 3, 2026. Compare their plans, experience and public records, with sources and no endorsements.",
    eyebrow: "CITY COUNCIL · DISTRICT 3",
    label: "Portland District 3 voter guide",
    district: "3",
  },
  "district-4": {
    path: "/voters-guide/portland-district-4",
    title: "Portland District 4 Voter Guide 2026 | Compare Candidates",
    description: "Meet Portland District 4 City Council candidates for November 3, 2026. Compare their plans, experience and public records, with sources and no endorsements.",
    eyebrow: "CITY COUNCIL · DISTRICT 4",
    label: "Portland District 4 voter guide",
    district: "4",
  },
  standards: {
    path: "/voters-guide/methodology",
    title: "Portland Voter Guide | Editorial Standards & Coverage",
    description: "How Portland Civic Lab researches candidates, checks sources, separates votes from interpretation and handles corrections. Read our nonpartisan voter guide standards.",
    eyebrow: "EDITORIAL STANDARDS & COVERAGE",
    label: "Voter guide editorial standards",
    district: "",
  },
  research: {
    path: "/voters-guide/research-log",
    title: "Portland Voter Guide | Research, Updates & Corrections",
    description: "Follow the research, coverage updates and corrections behind Portland Civic Lab’s 2026 voter guide. See what changed and how the candidate record was checked.",
    eyebrow: "RESEARCH, UPDATES & CORRECTIONS",
    label: "Voter guide research log",
    district: "",
  },
} as const;
export type GuideCard = keyof typeof guideCards;

export function guideImage(card: GuideCard) {
  const data = guideCards[card];
  return {
    url: `${GUIDE_ORIGIN}/voters-guide/share/${card}?v=${GUIDE_IMAGE_VERSION}`,
    width: 1200,
    height: 630,
    type: "image/png",
    alt: `${data.label}. November 3, 2026. Compare candidates, understand their choices. A free, nonpartisan guide from Portland Civic Lab.`,
  };
}

export function voterGuideMetadata(card: GuideCard): Metadata {
  const data = guideCards[card];
  return {
    title: { absolute: data.title },
    description: data.description,
    alternates: { canonical: `${GUIDE_ORIGIN}${data.path}` },
    openGraph: {
      title: data.title,
      description: data.description,
      url: `${GUIDE_ORIGIN}${data.path}`,
      siteName: "Portland Civic Lab",
      type: "website",
      locale: "en_US",
      images: [guideImage(card)],
    },
    twitter: {
      card: "summary_large_image",
      title: data.title,
      description: data.description,
      images: [guideImage(card)],
    },
  };
}

export function guideStructuredData(card: GuideCard) {
  const data = guideCards[card];
  const url = `${GUIDE_ORIGIN}${data.path}`;
  const trail = [
    { name: "Portland Civic Lab", item: GUIDE_ORIGIN },
    { name: "2026 Portland Voter Guide", item: `${GUIDE_ORIGIN}/voters-guide` },
    ...(card === "guide" ? [] : [{ name: data.label, item: url }]),
  ];
  return {
    "@context": "https://schema.org",
    "@type": card === "guide" || data.district ? "CollectionPage" : "WebPage",
    "@id": `${url}#page`,
    url,
    name: data.title,
    description: data.description,
    inLanguage: "en-US",
    isAccessibleForFree: true,
    image: guideImage(card).url,
    publisher: { "@type": "Organization", name: "Portland Civic Lab", url: GUIDE_ORIGIN },
    breadcrumb: {
      "@type": "BreadcrumbList",
      itemListElement: trail.map((entry, i) => ({ "@type": "ListItem", position: i + 1, ...entry })),
    },
  };
}
