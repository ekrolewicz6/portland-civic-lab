import type { Metadata } from "next";
import Link from "next/link";
import { Layers3, ArrowUpRight } from "lucide-react";
import CedNav from "@/components/ced/CedNav";
import { dateLabel, EDITION } from "@/lib/ced/model";
import "./ced.css";
export const metadata: Metadata = {
  title: {
    default: "CED Portfolio Map",
    template: "%s | CED Portfolio Map",
  },
  openGraph: {
    title: "CED Portfolio Map",
    description:
      "Portland’s initiatives, decisions, dependencies, public funding and outcomes, connected through public records.",
    url: "/ced",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "CED Portfolio Map",
    description:
      "Follow the work across Portland’s Community & Economic Development portfolio.",
  },
  description:
    "Portland’s Community & Economic Development initiatives, decisions, dependencies, public funding and outcomes, reconstructed from public records.",
};
export default function CedLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="ced">
      <div className="ced-masthead ced-shell">
        <Link className="ced-brand" href="/ced">
          <Layers3 size={22} />
          <span>
            CED <b>Portfolio Map</b>
          </span>
        </Link>
        <div className="ced-edition">
          <span className="ced-live-dot" />
          Public-source demonstration
          <span className="ced-edition-date">
            {" "}
            · Record checked {dateLabel(EDITION)}
          </span>
        </div>
      </div>
      <div className="ced-nav-wrap">
        <div className="ced-shell">
          <CedNav />
        </div>
      </div>
      <div className="ced-shell ced-content">{children}</div>
      <div className="ced-bottom">
        <div className="ced-shell">
          <p>
            <strong>A public reconstruction of the work.</strong> Stages and
            connections are PCL’s organization of the cited record. This is not
            authoritative City status, a City partnership, or a complete
            inventory.
          </p>
          <div>
            <Link href="/ced/methodology">Method & sources</Link>
            <Link href="/ced/briefing">Printable briefing</Link>
            <Link href="/contact?topic=CED%20Portfolio%20Map%20correction">
              Suggest a correction <ArrowUpRight size={13} />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
