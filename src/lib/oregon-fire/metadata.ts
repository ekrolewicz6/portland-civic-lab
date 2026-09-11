export const FIRE_URL = "https://www.portlandciviclab.org/oregon-fire";
export const FIRE_TITLE = "Oregon Fire Map: Prescribed Burns & Wildfire History";
export const FIRE_DESCRIPTION =
  "Explore Oregon prescribed burns, planned burn units, and wildfire history. See reported purposes, dates, agencies, and source records on an interactive map.";
export const FIRE_AUTHORS = [
  "Edan Krolewicz", "Jenna Knobloch", "Dominic Kuklawood",
];

export const fireStructuredData = {
  "@context": "https://schema.org",
  "@type": "CollectionPage",
  "@id": `${FIRE_URL}#page`,
  url: FIRE_URL,
  name: FIRE_TITLE,
  description: FIRE_DESCRIPTION,
  inLanguage: "en-US",
  isAccessibleForFree: true,
  author: FIRE_AUTHORS.map((name) => ({ "@type": "Person", name })),
  publisher: { "@type": "Organization", name: "Portland Civic Lab", url: "https://www.portlandciviclab.org" },
  spatialCoverage: { "@type": "Place", name: "Oregon, United States" },
  about: ["Prescribed burning in Oregon", "Oregon wildfire history", "Public fire records"],
  breadcrumb: {
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Portland Civic Lab", item: "https://www.portlandciviclab.org" },
      { "@type": "ListItem", position: 2, name: "Fire in Oregon", item: FIRE_URL },
    ],
  },
};
