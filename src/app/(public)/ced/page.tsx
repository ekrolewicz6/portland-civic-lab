import type { Metadata } from "next";
import PortfolioHome from "@/components/ced/Home";
import { today } from "@/lib/ced/model";
export const dynamic = "force-dynamic";
export const metadata: Metadata = {
  alternates: { canonical: "/ced" },
  openGraph: {
    title: "CED Portfolio Map",
    description:
      "Portland’s initiatives, decisions, dependencies, public funding and outcomes, connected through public records.",
    url: "/ced",
    type: "website",
  },
};
export default function Page() {
  return <PortfolioHome asOf={today()} />;
}
