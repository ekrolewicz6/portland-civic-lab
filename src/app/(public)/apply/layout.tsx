import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Apply for PCB Certification",
  description:
    "Apply to become a certified Portland Civic Lab Business. Access tax benefits, real estate, network value, and more.",
  openGraph: {
    title: "Apply for PCB Certification | Portland Civic Lab",
    description: "Become a certified Portland Civic Lab Business — access tax benefits, real estate, and network value.",
    url: "https://www.portlandciviclab.org/apply",
  },
  alternates: { canonical: "https://www.portlandciviclab.org/apply" },
};

export default function ApplyLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
