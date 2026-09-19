import { pageMeta } from "@/lib/page-meta";
import type { Metadata } from "next";

export const metadata: Metadata = pageMeta({
  title: 'Portland Business Directory',
  description: 'Find registered Portland businesses by name, location and business type. Explore registration information drawn from Oregon Secretary of State records.',
  path: "/directory",
});

export default function DirectoryLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
