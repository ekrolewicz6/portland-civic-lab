import type { Metadata } from "next";

export const metadata: Metadata = {
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
