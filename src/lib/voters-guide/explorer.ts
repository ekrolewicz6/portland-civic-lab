import type { Candidate } from "./types";
export const explorerVersion = "2026-09-19.4";
export const explorerTopics = [
  { id: "overview", label: "At a glance" },
  { id: "housing", label: "Housing & rent" },
  { id: "safety", label: "Homelessness & safety" },
  { id: "money", label: "Taxes & city services" },
  { id: "climate", label: "Climate & getting around" },
  { id: "experience", label: "Experience" },
] as const;
export type ExplorerTopic = (typeof explorerTopics)[number]["id"];
export const comparisonEvent = "pcl:open-candidate-comparison";
export const comparisonChangeEvent = "pcl:candidate-comparison-changed";
export function topicPosition(person: Candidate, topic: ExplorerTopic) {
  if (topic === "overview" || topic === "experience") return undefined;
  return person.analysis?.issues[topic];
}
export function hasTopic(person: Candidate, topic: ExplorerTopic) {
  return (
    topic === "overview" ||
    topic === "experience" ||
    !!topicPosition(person, topic)
  );
}
