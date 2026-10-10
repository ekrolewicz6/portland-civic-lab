import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { portfolio, today } from "@/lib/ced/model";
import {
  InitiativesExplorer,
  DecisionsExplorer,
  TimelineExplorer,
  DependencyExplorer,
  MoneyExplorer,
  OutcomesExplorer,
} from "@/components/ced/Explorer";
import {
  Changes,
  Oversight,
  Methodology,
  Briefing,
} from "@/components/ced/StaticViews";
import { metaDescription } from "@/lib/page-meta";
export const dynamic = "force-dynamic";
const views: Record<string, [string, string, string]> = {
  initiatives: [
    "The portfolio",
    `${portfolio.initiatives.length} connected initiatives`,
    "Find the work by owner, stage, domain or intended outcome. Open any initiative for its decisions, dependencies, money and evidence.",
  ],
  decisions: [
    "The decision register",
    "What needs to happen next?",
    "Decisions and milestones, with authority, expected timing and a permanent record of what changed.",
  ],
  timeline: [
    "The public schedule",
    "What happens when",
    "Upcoming decisions and milestones, with the uncertainty in their dates preserved.",
  ],
  dependencies: [
    "The dependency map",
    "What is waiting on what?",
    "Trace shared responsibilities, approvals, financing and delivery needs across the portfolio.",
  ],
  money: [
    "The funding ledger",
    "Follow the money—and its meaning",
    "Known financial records, separated by what the amount actually represents.",
  ],
  outcomes: [
    "The theory of contribution",
    "What is the work meant to change?",
    "Link CED’s official outcome framework to the initiatives that could contribute.",
  ],
  oversight: [
    "The evidence gaps",
    "What still needs an answer",
    "Unresolved information needs and dated Council questions, kept alongside the portfolio.",
  ],
  changes: [
    "The institutional memory",
    "What changed in the record",
    "Events, decisions and corrected expectations, preserved with evidence.",
  ],
  methodology: [
    "Method & sources",
    "A record you can inspect",
    "Scope, evidence, freshness and the rules behind the map.",
  ],
  briefing: [
    "The conversation brief",
    "CED Portfolio Map",
    "A concise, printable guide to the portfolio, dependency map and recent movement.",
  ],
};
export async function generateMetadata({
  params,
}: {
  params: Promise<{ view: string }>;
}): Promise<Metadata> {
  const { view } = await params;
  return {
    title: views[view]?.[0] ?? "Not found",
    description: views[view] ? metaDescription(`${views[view][2]} Part of the CED Portfolio Map of Portland’s community and economic development work.`) : undefined,
    alternates: { canonical: `/ced/${view}` },
  };
}
export default async function Page({
  params,
}: {
  params: Promise<{ view: string }>;
}) {
  const { view } = await params;
  const copy = views[view];
  if (!copy) notFound();
  const asOf = today();
  const body: Record<string, React.ReactNode> = {
    initiatives: <InitiativesExplorer />,
    decisions: <DecisionsExplorer asOf={asOf} />,
    timeline: <TimelineExplorer asOf={asOf} />,
    dependencies: <DependencyExplorer />,
    money: <MoneyExplorer />,
    outcomes: <OutcomesExplorer />,
    oversight: <Oversight asOf={asOf} />,
    changes: <Changes />,
    methodology: <Methodology />,
    briefing: <Briefing asOf={asOf} />,
  };
  return (
    <>
      <header className="ced-page-head">
        <p className="ced-eyebrow">{copy[0]}</p>
        <h1>{copy[1]}</h1>
        <p>{copy[2]}</p>
      </header>
      <Suspense fallback={<p>Loading portfolio view…</p>}>
        {body[view]}
      </Suspense>
    </>
  );
}
