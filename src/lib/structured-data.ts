import { DEEP_DIVES } from "@/lib/deep-dives";
import { eventPath, type LabEvent } from "@/lib/events";
import { FOUNDER } from "@/lib/team";
import { LEGAL_ENTITY, TAGLINE } from "@/lib/site";

/**
 * schema.org JSON-LD for search and answer engines. The root layout puts the
 * Organization and WebSite on every page; page-level nodes (articles, events)
 * point back to them by @id rather than repeating them, so every page
 * describes the Lab the same way.
 */

export const SITE_URL = "https://www.portlandciviclab.org";
export const ORG_ID = `${SITE_URL}/#organization`;
export const WEBSITE_ID = `${SITE_URL}/#website`;

type Node = Record<string, unknown>;

export function organizationNode(): Node {
  return {
    "@type": "Organization",
    "@id": ORG_ID,
    name: "Portland Civic Lab",
    alternateName: "PCL",
    legalName: LEGAL_ENTITY,
    url: SITE_URL,
    logo: {
      "@type": "ImageObject",
      url: `${SITE_URL}/images/brand/logo-dark.png`,
      width: 1254,
      height: 1254,
    },
    slogan: TAGLINE,
    description:
      "Free, public, source-linked civic tools for Portland, Oregon, and paid decision work for property owners and public institutions at published prices.",
    foundingDate: "2026",
    foundingLocation: { "@type": "Place", name: "Portland, Oregon" },
    founder: { "@type": "Person", name: FOUNDER.name, jobTitle: FOUNDER.title },
    areaServed: {
      "@type": "City",
      name: "Portland",
      containedInPlace: { "@type": "State", name: "Oregon" },
    },
    contactPoint: { "@type": "ContactPoint", contactType: "general inquiries", url: `${SITE_URL}/contact` },
    knowsAbout: [
      "Portland city government",
      "Portland city budget",
      "Oregon elections and voter guides",
      "Oregon campaign finance",
      "Homelessness and housing in Portland",
      "Portland economic development",
      "Public records and open data",
    ],
    sameAs: ["https://github.com/ekrolewicz6/portland-civic-lab"],
  };
}

export function websiteNode(): Node {
  return {
    "@type": "WebSite",
    "@id": WEBSITE_ID,
    name: "Portland Civic Lab",
    alternateName: ["PCL", "portlandciviclab.org"],
    url: SITE_URL,
    description: TAGLINE,
    inLanguage: "en-US",
    publisher: { "@id": ORG_ID },
  };
}

/** Article node for a deep-dive landing page, from the deep-dives registry. */
export function deepDiveArticleNode(slug: string): Node | null {
  const d = DEEP_DIVES.find((x) => x.slug === slug);
  if (!d) return null;
  const url = `${SITE_URL}/deep-dives/${d.slug}`;
  return {
    "@type": "Article",
    "@id": `${url}#article`,
    headline: d.title,
    description: d.description,
    url,
    mainEntityOfPage: url,
    dateModified: d.updated,
    about: d.subject,
    keywords: d.keywords,
    inLanguage: "en-US",
    isAccessibleForFree: true,
    author: { "@id": ORG_ID },
    publisher: { "@id": ORG_ID },
    isPartOf: { "@id": WEBSITE_ID },
  };
}

/** Event node for a Lab event page. */
export function eventNode(e: LabEvent): Node {
  const url = `${SITE_URL}${eventPath(e)}`;
  return {
    "@type": "Event",
    "@id": `${url}#event`,
    name: e.title,
    description: e.summary,
    url,
    startDate: e.start,
    endDate: e.end,
    eventStatus: "https://schema.org/EventScheduled",
    eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
    isAccessibleForFree: e.cost === "Free",
    location: {
      "@type": "Place",
      name: e.venue ?? "Venue to be announced, Portland, Oregon",
      address: { "@type": "PostalAddress", addressLocality: "Portland", addressRegion: "OR", addressCountry: "US" },
    },
    ...(e.cost === "Free"
      ? { offers: { "@type": "Offer", price: 0, priceCurrency: "USD", availability: "https://schema.org/InStock", url: e.luma.url } }
      : {}),
    organizer: { "@id": ORG_ID },
  };
}

/** Serialize one node, or several as a graph, for a <script type="application/ld+json">. */
export function ldJson(...nodes: (Node | null)[]): string {
  const list = nodes.filter((n): n is Node => n !== null);
  const doc = list.length === 1 ? { "@context": "https://schema.org", ...list[0] } : { "@context": "https://schema.org", "@graph": list };
  // "<" escaped so a string value can never close the script element.
  return JSON.stringify(doc).replace(/</g, "\\u003c");
}
