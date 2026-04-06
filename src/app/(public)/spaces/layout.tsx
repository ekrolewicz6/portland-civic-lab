import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Commercial Real Estate Listings",
  description:
    "Browse available commercial spaces in Portland, Oregon. Office, retail, industrial, and flex spaces with vacancy data, pricing, and neighborhood context.",
  openGraph: {
    title: "Portland Commercial Spaces | Portland Civic Lab",
    description: "Available commercial real estate across Portland with vacancy rates and pricing.",
    url: "https://www.portlandciviclab.org/spaces",
  },
  alternates: { canonical: "https://www.portlandciviclab.org/spaces" },
};

export default function SpacesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
