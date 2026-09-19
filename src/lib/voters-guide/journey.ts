import type { Race } from "./types";
import { comparisonTopics } from "./council-topics";
import { councilDisagreements } from "./council-record-accounts";

// Share only public candidate IDs and the topic being viewed, never inferred preferences.
export function comparisonFragment(ids: string[], topic: string, issue?: string) {
  const params = new URLSearchParams({ people: [...new Set(ids.filter(Boolean))].sort().join(","), topic });
  if (topic === "record" && issue) params.set("issue", issue);
  return `compare?${params}`;
}
export function sharedComparison(hash: string, race: Pick<Race, "candidates"> | { candidates: { id: string }[] }) {
  if (!hash.startsWith("#compare?")) return null;
  const params = new URLSearchParams(hash.slice(hash.indexOf("?") + 1));
  const ids = [...new Set((params.get("people") ?? "").split(","))]
    .filter((id) => race.candidates.some((p) => p.id === id)).slice(0, 3);
  const topic = comparisonTopics.find((t) => t.id === params.get("topic"))?.id ?? "values";
  const issue = councilDisagreements.find((item) => item.id === params.get("issue"))?.id ?? "supplemental-budget";
  return { ids, topic, issue };
}
