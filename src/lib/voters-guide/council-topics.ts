export const comparisonTopics = [
  {
    id: "values",
    label: "Values & tradeoffs",
    question: "What do they put first—and what would that choice require?",
    context:
      "Our interpretation of documented priorities, not a personality assessment. These descriptions are not scores or endorsements.",
  },
  {
    id: "housing",
    label: "Housing",
    question: "How would they make housing more affordable?",
    context:
      "Building more homes, protecting tenants and changing ownership are different tools. Look for the mechanism, who benefits and how it would be funded.",
  },
  {
    id: "safety",
    label: "Safety & homelessness",
    question:
      "What balance of enforcement, prevention and care do they propose?",
    context:
      "Support for police and support for unarmed response can coexist. Shelter, treatment and housing commitments are distinct; capacity and implementation matter.",
  },
  {
    id: "money",
    label: "Taxes & spending",
    question: "Who pays—and what would receive priority?",
    context:
      "A promise of better management is not a costed saving. New services need both startup money and continuing revenue.",
  },
  {
    id: "climate",
    label: "Climate & streets",
    question: "Where would they invest—and what would they restrict?",
    context:
      "Compare street space, infrastructure and climate spending. Council sets city policy; regional transit decisions also require partners.",
  },
  {
    id: "record",
    label: "Recorded decisions",
    question: "What did they do when a decision came to a vote?",
    context:
      "Four decisions, including the competing budget proposals and Moda amendments. Read what each person did beside their publicly stated reasons. This is a selected sample of their record.",
  },
] as const;
export type ComparisonTopic = (typeof comparisonTopics)[number]["id"];
