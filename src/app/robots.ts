import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        // Sign-in, session-gated and machine endpoints: nothing here is for a search result.
        disallow: ["/login", "/signup", "/auth/", "/api/", "/admin", "/member/", "/member$", "/bed-finder-admin", "/dashboard/embed/"],
      },
    ],
    sitemap: "https://www.portlandciviclab.org/sitemap.xml",
  };
}
