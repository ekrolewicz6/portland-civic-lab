import type { ExtraTopic } from "./types";

/**
 * Extra columns a reader can add to the grid: the concrete choices this
 * Council has faced or will face. Where a topic matches a decision,
 * incumbents' recorded votes render as pills; every other cell is an
 * explicit, sourced statement or a gap. Order is editorial and disclosed.
 */
export const extraTopics: ExtraTopic[] = [
  {
    id: "moda",
    label: "Moda Center deal",
    short: "Moda",
    question: "Public money and terms for renovating the Moda Center?",
    context: "Council approved non-binding negotiating terms in August 2026. A final deal, and any public money, would need further votes.",
    decisionId: "moda",
  },
  {
    id: "new-taxes",
    label: "New taxes or fees",
    short: "Taxes",
    question: "Raise new revenue, or hold the line on taxes and fees?",
    context: "Recent votes raised water rates and created a street repair fee; candidates differ on whether households or large companies should pay more.",
  },
  {
    id: "police-staffing",
    label: "Police staffing",
    short: "Police",
    question: "Hire more sworn officers, or invest first elsewhere?",
    context: "Council adopted a staffing assessment but has not funded a specific hiring target; unarmed responders and clinicians are the alternative or complement.",
  },
  {
    id: "camp-removal",
    label: "Clearing camps",
    short: "Camps",
    question: "Keep funding camp removals at current levels?",
    context: "A 2025 amendment to move about $4.3 million from removals to services failed; camping rules stayed in place.",
    decisionId: "camp-removal",
  },
  {
    id: "data-centers",
    label: "Data centers",
    short: "Data centers",
    question: "Restrict new AI data centers in the city?",
    context: "Data centers draw large amounts of power and water; several candidates propose a moratorium or ban, others are silent.",
  },
  {
    id: "street-response",
    label: "Street Response",
    short: "Response",
    question: "Expand Portland Street Response to a full 24/7 role?",
    context: "The unarmed crisis team's scope and funding have been contested at Council.",
    decisionId: "psr-framework",
  },
  {
    id: "street-fee",
    label: "Street repair fee",
    short: "Street fee",
    question: "Keep the monthly street repair fee?",
    context: "Council created a monthly transportation utility fee in 2026; some candidates would repeal or replace it.",
    decisionId: "street-fee",
  },
  {
    id: "water-rates",
    label: "Water rates",
    short: "Water",
    question: "Raise water bills to pay for the Bull Run filtration plant and system repairs?",
    context: "Rates rose about $5 a month in 2026; the filtration plant and borrowing drive future increases.",
    decisionId: "water-rates",
  },
];
export const extraTopicById = (id: string) => extraTopics.find((t) => t.id === id);
