import { issues, type Issue, type IssueId } from "./issues";
import type { OfficeGroup } from "./office";

/**
 * The four issues are one vocabulary (the ids never change, so chips, briefs
 * and the #issue= fragment work for every race), but the words a reader sees
 * follow the office. "Camps, crime and who responds" is a City Council
 * question; the county runs jails, ambulances and shelter, the state sets the
 * kicker and the Climate Protection Program. Each framing keeps the same four
 * columns and changes only the label, the short chip, the question and the
 * scanning note. Council and the other cities keep the defaults.
 */

type Framing = Partial<Record<IssueId, Pick<Issue, "label" | "short" | "question" | "context" | "noun">>>;

const county: Framing = {
  housing: {
    label: "Homelessness and housing",
    short: "Homes",
    noun: "homelessness",
    question: "How would they cut homelessness and house more people?",
    context:
      "The county runs shelter, homeless services and housing vouchers with city and Metro money. Look for shelter versus housing first, the mechanism and the money.",
  },
  safety: {
    label: "Crisis care, jail and deflection",
    short: "Safety",
    noun: "safety",
    question: "How would they handle addiction, crisis calls and jail capacity?",
    context:
      "The county runs the jails, the deflection center, ambulance contracts and behavioral health. Beds, staffing and contracts matter more than slogans.",
  },
  money: {
    label: "Taxes and the budget gap",
    short: "Money",
    noun: "taxes and budget",
    question: "Who pays, and what would receive priority as the gap closes?",
    context:
      "Preschool for All, the supportive housing tax and a structural gap frame every choice. A promise of efficiency is not a costed saving.",
  },
  climate: {
    label: "Roads, bridges and air",
    short: "Roads",
    noun: "roads and climate",
    question: "Where would they invest, and what would they restrict?",
    context:
      "Bridges, county roads, air quality and climate programs are county work; regional transit needs partners.",
  },
};

const state: Framing = {
  housing: {
    label: "Housing and homelessness",
    short: "Homes",
    noun: "housing",
    question: "How would they get more homes built and more people housed?",
    context:
      "State law sets zoning floors, tenant protections and shelter funding. Look for the mechanism, the money and the timeline.",
  },
  safety: {
    label: "Crime, drugs and who responds",
    short: "Safety",
    noun: "safety",
    question: "What balance of enforcement, treatment and prevention do they propose?",
    context:
      "Drug possession law, deflection, state police and behavioral-health beds are state calls; capacity and funding matter.",
  },
  money: {
    label: "Taxes, the kicker and the budget",
    short: "Money",
    noun: "taxes and budget",
    question: "Who pays, and what would receive priority?",
    context:
      "The state budget is set every two years; the kicker, new taxes and cuts are the levers. A promise of better management is not a costed saving.",
  },
  climate: {
    label: "Roads, transit and climate",
    short: "Roads",
    noun: "roads and climate",
    question: "Where would they invest, and what would they restrict?",
    context:
      "Transportation funding, the Climate Protection Program and the Interstate Bridge are state decisions with local effects.",
  },
};

const federal: Framing = {
  housing: {
    label: "Housing and homelessness",
    short: "Homes",
    noun: "housing",
    question: "What would they do in Congress about housing costs?",
    context: "Federal vouchers, tax credits and lending rules shape local housing. Look for the mechanism and the money.",
  },
  safety: {
    label: "Public safety and immigration",
    short: "Safety",
    noun: "safety",
    question: "What balance of enforcement, prevention and care do they propose?",
    context: "Federal enforcement, immigration policy and grants to local police and treatment are Congress's levers.",
  },
  money: {
    label: "Taxes, spending and your bills",
    short: "Money",
    noun: "taxes and spending",
    question: "Who pays, and what would receive priority?",
    context: "Tax rates, tariffs, benefits and the deficit are federal choices; a promise of efficiency is not a costed saving.",
  },
  climate: {
    label: "Transportation, energy and climate",
    short: "Climate",
    noun: "transportation and climate",
    question: "Where would they invest, and what would they restrict?",
    context: "Highway and transit funding, energy rules and climate spending run through Congress.",
  },
};

const framings: Partial<Record<OfficeGroup, Framing>> = {
  county,
  state,
  legislature: state,
  federal,
};

/** The four issues as this office's readers should see them. */
export function issuesFor(group: OfficeGroup): Issue[] {
  const framing = framings[group];
  if (!framing) return issues;
  return issues.map((issue) => ({ ...issue, ...(framing[issue.id] ?? {}) }));
}

/**
 * The status line in two parts: the head is what phones show on one line;
 * the tail completes the sentence from 769px up (and in the DOM text).
 */
export function coverageParts(issue: Issue, count: number, total: number) {
  return { head: `${count} of ${total} have a ${issue.noun} position`, tail: " in the sources we reviewed." };
}

export function coverageSentence(issue: Issue, count: number, total: number) {
  const { head, tail } = coverageParts(issue, count, total);
  return head + tail;
}
