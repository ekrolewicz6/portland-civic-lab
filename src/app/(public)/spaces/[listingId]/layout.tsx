import type { Metadata } from "next";

export const metadata: Metadata = {
  // Demo surface with sample data — keep out of search until real listings ship.
  robots: { index: false, follow: false },
  title: "Commercial Space Detail",
  description:
    "Commercial real estate listing details — square footage, pricing, lease terms, and neighborhood context for available Portland spaces.",
  openGraph: {
    title: "Commercial Space | Portland Civic Lab",
    description: "Available commercial real estate in Portland with detailed listing information.",
  },
};

export default function ListingDetailLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
