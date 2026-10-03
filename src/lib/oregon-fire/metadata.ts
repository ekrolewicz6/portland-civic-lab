export const FIRE_URL = "https://www.portlandciviclab.org/oregon-fire";
export const FIRE_TITLE = "Fire in Oregon: A Visual Guide to Wildfire & Prescribed Fire";
export const FIRE_DESCRIPTION =
  "An illustrated guide to fire in Oregon: why places burn differently, why people use prescribed fire, what the work costs, and how to tell whether it helped. Explore the public records and follow a landscape investigation.";
export const FIRE_AUTHORS = [
  "Edan Krolewicz", "Dominic Kuklawood",
];

export const fireStructuredData = {
  "@context": "https://schema.org",
  "@type": "Article",
  "@id": `${FIRE_URL}#page`,
  url: FIRE_URL,
  name: FIRE_TITLE,
  headline: "Fire in Oregon: How fire works, what we can change, and what the choices cost",
  datePublished: "2026-09-11",
  dateModified: "2026-09-30",
  description: FIRE_DESCRIPTION,
  inLanguage: "en-US",
  isAccessibleForFree: true,
  author: FIRE_AUTHORS.map((name) => ({ "@type": "Person", name })),
  publisher: { "@type": "Organization", name: "Portland Civic Lab", url: "https://www.portlandciviclab.org" },
  spatialCoverage: { "@type": "Place", name: "Oregon, United States" },
  about: ["Prescribed burning in Oregon", "Oregon wildfire history", "Public fire records", "Recent wildfire scars", "Satellite burn severity"],
  breadcrumb: {
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Portland Civic Lab", item: "https://www.portlandciviclab.org" },
      { "@type": "ListItem", position: 2, name: "Fire in Oregon", item: FIRE_URL },
    ],
  },
};
