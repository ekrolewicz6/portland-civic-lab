import type { CandidateAnswer } from "../types";
/** Replies to the identical questions sent to every candidate on September 19, 2026. */
const received = "2026-09-19";
const legree = (question: string, text: string): CandidateAnswer => ({ candidateId: "keir-legree", question, text, received });
const anderson = (question: string, text: string): CandidateAnswer => ({ candidateId: "timothy-tj-anderson", question, text, received });
const otero = (question: string, text: string): CandidateAnswer => ({ candidateId: "cristal-otero", question, text, received });
const arnold = (question: string, text: string): CandidateAnswer => ({ candidateId: "eli-arnold", question, text, received: "2026-09-20" });
const novick = (question: string, text: string): CandidateAnswer => ({ candidateId: "steve-novick", question, text, received: "2026-09-21" });

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
  otero(
    "Which buildings could transition to resident ownership?",
    "I have proposed creating a pathway for roughly 5–20% of the Portland Housing Bureau’s affordable rental portfolio to transition to limited-equity cooperative ownership over time. The Portland Housing Bureau currently regulates more than 19,000 affordable units, so at today’s scale that would represent approximately 950 to 3,800 homes. [...] I would begin with publicly owned or publicly financed affordable housing where residents are interested in cooperative ownership and where the building is financially and physically appropriate for conversion.",
  ),
  otero(
    "How would residents be protected from financial risk?",
    "Residents should not have to qualify for conventional individual mortgages or suddenly become responsible for major building repairs. The cooperative would own the property and carry the primary financing, while residents would purchase an affordable—and for extremely low-income households potentially heavily subsidized—membership share. Buildings would need capital-needs assessments, adequate replacement reserves, and resources to address deferred maintenance before conversion. [...] Resale would be governed by an affordability formula rather than unrestricted market appreciation.",
  ),
  otero(
    "Who would pay for it?",
    "Portland cannot do this alone. Making this model work for households at 0–30% of area median income would require a stronger partnership among the City, Multnomah County, Metro, Home Forward, the State of Oregon, and affordable-housing providers. The City could help with acquisition, capital investment, land, and financing, while regional, county, state, and federal resources could help provide the ongoing affordability and housing assistance that extremely low-income households may still need.",
  ),
  otero(
    "Government experience",
    "After my fellowship ended, Fairview hired me as its COVID-19 Response Specialist. One of the first major municipal programs I developed and implemented was an emergency assistance program for small businesses affected by the pandemic. [...] At Multnomah County, I joined the early implementation of the Metro Supportive Housing Services measure. [...] One project I am particularly proud of was helping develop the first joint social-services procurement undertaken by Multnomah, Washington, and Clackamas counties. [...] Since 2024, much of my work has focused on Supportive Housing Services-funded programs operating in other Multnomah County departments.",
  ),
  arnold(
    "How would expanded staffing and transit commitments fit within existing revenue?",
    "No immediate increase to police funding. When vacancies are filled I would seek to increase authorized staffing if the city budget can accommodate. For fareless transit I would seek to use PCEF as a stable funding source. Total TriMet fare revenues are about $60 million, but only a portion of that is Portland. I would be seeking to redirect a portion of future revenue.",
  ),
  arnold(
    "Policing work: the downtown fentanyl partnership",
    "When street fentanyl sales became ubiquitous downtown I developed a program in which police partnered with organizations [to] identify high volume dealers. We established a relationship with Federal Prosecutors to hold high volume dealers accountable in 2023. This has resulted in dozens of successful prosecutions and a decline in the fentanyl trade downtown.",
  ),
  arnold(
    "Policing work: the Provider Police Joint Connection Program",
    "During Measure 110 I was concerned about the lack of meaningful interventions for people with serious addictions who were using drugs on the street downtown. The Portland Police Bureau Bike Squad and MHAAO partnered to bring peer support workers immediately to the scene and attempt to place people into treatment. The Provider Police Joint Connection Program was a success and was ultimately funded by the City, County, and State.",
  ),
  novick(
    "Why he opposed Services First and co-proposed the smaller restoration package",
    "I thought “services first” spent too much money that we should be counting on to balance next year’s budget, and would have unacceptably exacerbated what will already be a tough budget next year. Also, I thought restoring cuts in police training was essential. I agree with Zohran Mamdani that the police should be well trained in things like deescalation and driving safely in emergency situations.",
  ),
  novick(
    "Concrete accomplishments, in his words",
    "Red flag law. Passed gas tax. Was the lead lawyer for the “cost recovery” portion of a Superfund lawsuit; won precedent-setting decisions. Was policy researcher and one of the lead communicators for the successful measures 66 and 67 in 2010.",
  ),
  novick(
    "What evidence would determine when an unarmed response or camp removal is appropriate?",
    "I don’t understand the question — when is there a choice between unarmed response and camp removal? [The Lab has since clarified that it asked two separate questions: what should decide when an unarmed response is the right call, and what should decide when a camp removal is; his answer is pending.]",
  ),
];
