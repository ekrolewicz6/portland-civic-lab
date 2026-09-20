import type { CandidateAnswer } from "../types";
/** Replies to the identical questions sent to every candidate on September 19, 2026. */
const received = "2026-09-19";
const legree = (question: string, text: string): CandidateAnswer => ({ candidateId: "keir-legree", question, text, received });
const anderson = (question: string, text: string): CandidateAnswer => ({ candidateId: "timothy-tj-anderson", question, text, received });

export const answers: CandidateAnswer[] = [
  legree(
    "Infrastructure costs and utility bills",
    "I am not proposing that Portland defer essential maintenance. My goal is to reduce the cost of delivering infrastructure, not reduce necessary infrastructure. I support stronger competitive bidding, independent cost estimates, tighter control of project scope and change orders, and comparing Portland’s project costs with comparable cities.",
  ),
  legree(
    "Housing affordability and production",
    "I support increasing housing supply, speeding up permitting and reducing unnecessary barriers to construction. I also support expanding government-owned affordable housing and preserving existing affordable housing. Portland should focus more on whether subsidized units are actually affordable to lower-income residents and on getting existing vacant affordable units occupied.",
  ),
  legree(
    "Homelessness",
    "I support a different approach focused on measurable results: moving people from the street into shelter, treatment, housing and greater stability. That includes expanding shelter and mental-health/addiction treatment capacity; expecting reasonable progress toward stability in exchange for publicly funded services; and greater accountability for how City and County homelessness dollars are spent.",
  ),
  legree(
    "Climate, transportation and environmental health",
    "I support reducing emissions and improving environmental health, but I believe programs should be evaluated for measurable results and cost effectiveness. I support a balanced transportation system where people can safely walk, bike, take transit or drive, [with] pedestrian and bicycle improvements where there is demonstrated safety or transportation need.",
  ),
  legree(
    "Business experience",
    "I have spent approximately 30 years managing Savoy Studios, an architectural art-glass company, where I manage employees, budgets, contracts, vendors, schedules and complex projects in the U.S. and internationally. I also founded PlanXT, a project-management software company.",
  ),
  anderson(
    "Three policies and what each would cost",
    "First would be a value-based audit and investigation of where our money went over this year and the past two years as a starting point. [...] I would expect that to cost no more than $5 million. [...] While this is going on, no additional taxes or fees would be passed until we figure out where everything is going. Second would be [...] a resolution that each councilor would put in 100 hours of volunteer work per year while they are on council. [...] Third would be that until the City of Portland is back to growth in average salaries and jobs for at least two full years, with tests done every six months, benefits and the pay structure for City Council would be frozen at current levels.",
  ),
  anderson(
    "Housing affordability and production",
    "We need more housing, and the fastest way could be to make the city more investable, but there may also be ways we could reuse city assets to help with it. [...] Reuse city assets at a lower cost for short-term help, and for the long term, we need to make the city more approachable and investable, not just to big accounts but to people who want to make Portland a home.",
  ),
  anderson(
    "Public safety",
    "Get police response times down. We will need more officers. That is pretty much a given. But if we can find ways to handle issues that may not need our most highly trained officers and instead give those responsibilities to a combination of cadets, volunteers, and other programs as appropriate, we can work on getting response times down faster.",
  ),
  anderson(
    "Homelessness",
    "Spending money without thought is not helping. We need to figure out what has been working, what has not, and work with urgency because there are people who need help. But there are also citizens who do not want to see their taxes wasted, so first a clear understanding of what got us hear, a timeline of peoples needs through homelessness and a method to best work with others in the city to accelerate it and covering what needs remain.",
  ),
  anderson(
    "City spending and revenue",
    "Get it under control. We have enough to do what we need with what we have, or at least get a full view of what we need before asking for more. Revenue is in the same boat. When revenue is not growing, we are not growing our tax base, and that means what we have available for next year will generally be smaller than this year's budget.",
  ),
  anderson(
    "Climate, transportation and environmental health",
    "I think we can use this to help our business investability. [...] It is good for both, and we can use those areas of focus that benefit multiple things to help our climate efforts. [...] We are always going to have some cars and trucks, but I would like to see more public transit and better train systems. Leave cars for those who want them and those who need them for their services. Don’t burn our finances for the future for what we want now.",
  ),
  anderson(
    "Advisory and budget-committee work",
    "As chair for the Department of County Assets and Management, I helped bring the group's thoughts together toward the budget recommendations for our department and the projects being considered. [...] TriMet Committee for Accessible Transportation: We have gone through information related to recent cuts, trying to make sure the lowest number of people would be affected, as changes to the TriMet service area are also reflected in paratransit. [...] Tuition Review Advisory Committee at Portland State: As a student, we voted on a recommendation for an 8% tuition increase for students. [...] The 8% vote in our group passed 5-4 as a recommendation. The finance board ultimately felt it was not a move they could make.",
  ),
];
