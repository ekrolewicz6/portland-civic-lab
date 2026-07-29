import type { Metadata } from "next";
import { pageMeta } from "@/lib/page-meta";

export const metadata: Metadata = pageMeta({
  title: "Funding for Portland small businesses",
  description:
    "Tell Portland Civic Lab about your business once. We search city, county, state, federal, and private programs for money you qualify for, prepare the applications, and track every one.",
  path: "/business",
});

export default function BusinessLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
