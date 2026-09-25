import type { CandidateAnswer } from "../types";
/** Replies to the identical questions sent to every candidate on September 19, 2026. */
const received = "2026-09-19";
const legree = (question: string, text: string): CandidateAnswer => ({ candidateId: "keir-legree", question, text, received });
const legree2 = (question: string, text: string): CandidateAnswer => ({ candidateId: "keir-legree", question, text, received: "2026-09-22" });
const anderson = (question: string, text: string): CandidateAnswer => ({ candidateId: "timothy-tj-anderson", question, text, received });
const otero = (question: string, text: string): CandidateAnswer => ({ candidateId: "cristal-otero", question, text, received });
const otero2 = (question: string, text: string): CandidateAnswer => ({ candidateId: "cristal-otero", question, text, received: "2026-09-22" });
const anderson2 = (question: string, text: string): CandidateAnswer => ({ candidateId: "timothy-tj-anderson", question, text, received: "2026-09-22" });
const arnold = (question: string, text: string): CandidateAnswer => ({ candidateId: "eli-arnold", question, text, received: "2026-09-20" });
const novick = (question: string, text: string): CandidateAnswer => ({ candidateId: "steve-novick", question, text, received: "2026-09-21" });
const sollitt = (question: string, text: string): CandidateAnswer => ({ candidateId: "tom-sollitt", question, text, received: "2026-09-22" });
const sweeney = (question: string, text: string): CandidateAnswer => ({ candidateId: "john-sweeney", question, text, received: "2026-09-22" });
const sollitt3 = (question: string, text: string): CandidateAnswer => ({ candidateId: "tom-sollitt", question, text, received: "2026-09-23" });
const mcdonald = (question: string, text: string): CandidateAnswer => ({ candidateId: "john-mcdonald", question, text, received: "2026-09-23" });
const mcdonald2 = (question: string, text: string): CandidateAnswer => ({ candidateId: "john-mcdonald", question, text, received: "2026-09-24" });
const colemanCox = (question: string, text: string): CandidateAnswer => ({ candidateId: "heather-coleman-cox", question, text, received: "2026-09-23" });
const schroeder = (question: string, text: string): CandidateAnswer => ({ candidateId: "gregory-schroeder", question, text, received: "2026-09-24" });
const schulte = (question: string, text: string): CandidateAnswer => ({ candidateId: "matt-schulte", question, text, received: "2026-09-24" });
const delplato = (question: string, text: string): CandidateAnswer => ({ candidateId: "will-delplato", question, text, received: "2026-09-24" });
const russ = (question: string, text: string): CandidateAnswer => ({ candidateId: "david-russ", question, text, received: "2026-09-24" });
const beaudoin = (question: string, text: string): CandidateAnswer => ({ candidateId: "ali-beaudoin", question, text, received: "2026-09-23" });
const cronlund = (question: string, text: string): CandidateAnswer => ({ candidateId: "jayne-cronlund", question, text, received: "2026-09-23" });

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
  legree2(
    "Rent and homes: how would you deliver it?",
    "My approach would be a change in priorities. I would explore expanding the allowable use of PCEF funds so they can help acquire, build or preserve affordable housing when those projects also meet strong energy-efficiency and carbon-reduction standards. [...] I would also prioritize purchasing existing apartment buildings when that is faster and less expensive than building new housing.",
  ),
  legree2(
    "Streets, buses and air: what would show it worked?",
    "When we see fewer traffic deaths and serious injuries, while maintaining reasonable travel times for buses and cars and avoiding significant traffic diversion onto neighborhood streets. For major street redesigns, PBOT should publish before-and-after results so we can see whether the project actually worked. If it didn’t, we should be willing to modify it.",
  ),
  legree2(
    "Street Response",
    "I support Portland Street Response and believe it plays an important role. Before expanding PSR to 24/7, however, I would prioritize increasing the number of police officers available to respond to 911 calls and to situations where PSR needs police support. Once we have adequate police staffing, I would be open to expanding PSR.",
  ),
  legree2(
    "Moda Center deal",
    "I think it’s very important that we keep the Trail Blazers in Portland. But I don’t like the idea of spending hundreds of millions of public dollars on the Moda Center we don’t have. One option I’d want to explore is transferring ownership of the Moda Center to the Blazers’ new owner in exchange for an ironclad agreement to keep the Blazers in Portland for at least 20 years. The City acquired the arena for $1 in 2024.",
  ),
  legree2("New taxes or fees", "My priority is to hold the line on new taxes and fees."),
  legree2("Data centers", "I support restricting new AI data centers."),
  legree2(
    "Street repair fee",
    "I would keep the street repair fee only if PBOT can clearly demonstrate that it is necessary and show measurable results. If they cannot demonstrate that the fee is necessary and effective, I would support repealing it.",
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
  otero2(
    "Camps, crime and who responds",
    "I would focus more intensive resources on the smaller group of people repeatedly cycling through the street, shelters, emergency rooms and jail, rather than treating homelessness as one undifferentiated problem. I would assign Portland Street Response teams to high-contact areas so the same responders can build relationships over time and connect people to shelter, treatment and housing. I would also strengthen jail-release handoffs with peer support, transportation and dedicated shelter or treatment capacity. [...] I would measure success by whether the people we are targeting are spending fewer nights outside, cycling through jail and emergency rooms less often, and entering shelter, treatment and permanent housing at higher rates.",
  ),
  otero2(
    "Your bills and taxes",
    "I would start with the bills the City directly controls. I would set a five-year goal of reducing the inflation-adjusted cost of water service by at least 5% while maintaining safe and reliable service. I would get there by scrutinizing major capital projects before costs are locked in, reducing reliance on expensive borrowing where lower-cost financing is available, pursuing more state and federal funding, reducing water loss, and reviewing the fees and overhead the City charges to the Water Bureau.",
  ),
  otero2(
    "Streets, buses and air",
    "I would make those results more visible by connecting project-level reporting to Portland’s overall emissions goals, particularly transportation. I want more of our clean-energy investments coordinated with transportation—reducing transportation emissions while making transit, biking and clean transportation more affordable and accessible. Success should be visible in measurable emissions reductions as well as what Portlanders actually experience in their transportation costs and choices.",
  ),
  otero2(
    "Moda Center deal",
    "I support renovating the Moda Center and keeping the Trail Blazers in their home, but I want us to be more creative about how we finance it. The State and Multnomah County are already making substantial commitments, so before Portland simply fills the remaining gap, I would explore whether Metro could take an investment or ownership role in this regional asset and pursue private philanthropy, sponsorship and naming opportunities.",
  ),
  otero2(
    "Clearing camps",
    "Not in its current form. We still need the ability to remove camps that create serious health, safety or accessibility problems, but I would shift some Impact Reduction Program capacity into bureaus that encounter unsheltered homelessness every day, particularly Parks. [...] I would rather invest in reducing repeat problems than continually clear the same camps from one location to another.",
  ),
  otero2(
    "Data centers",
    "I would put stronger conditions on large new data centers where their energy, water or infrastructure demands could shift costs onto Portland residents. At minimum, the City should require transparency about resource use, recover infrastructure costs from the companies creating them, and establish strong energy-efficiency, water-use and labor standards.",
  ),
  otero2(
    "Street Response",
    "Yes, but I would do it as part of the behavioral-health response system we already have rather than building another parallel system. [...] I would expand Portland Street Response to 24 hours while creating clearer roles and coordination among those programs so the right responder is dispatched and people with repeated crises receive sustained follow-up rather than another one-time intervention.",
  ),
  otero2(
    "Street repair fee",
    "I am skeptical that basic street maintenance should require another monthly utility fee. [...] Before adding $12 a month to a household’s utility bill, I would revisit how transportation is funded through the regular City budget and determine whether more ongoing revenue can be dedicated to basic maintenance. If we cannot fund a core responsibility within the existing budget, I want a clear explanation of why before asking Portlanders to pay another fee.",
  ),
  anderson2(
    "The Council’s choices, in short",
    "I will say I’m not going to lock in to a lot with a full board view, so there is a lot I’m not going to see, but if we need the short list: [Moda Center] Yes, but no more than 60 million. [Clearing camps] Yes. [Data centers] Yes. [Street Response] No, not without additions. [Water rates] No. [Street repair fee] Need more info; not going to give a short answer.",
  ),
  mcdonald(
    "Moda Center deal",
    "I fully support the city’s current proposal of $120 million up front with $275 million in ongoing maintenance over a 20-year lease. I’m confident that other revenue streams will become available with the success of our teams.",
  ),
  mcdonald2(
    "Street Response",
    "I support making PSR a 24/7 operation (68 FTEs / $10.5 million annually) primarily funded through the general fund while also pursuing partnerships with the VA, TriMet and Central City Concern. Additionally, we must collaborate with healthcare agencies at an executive level to understand upcoming changes to Medicaid under H.R. 1. Shifting funds from the city’s share of the Oregon Opioid Settlement could fill gaps in years when general funds are needed elsewhere.",
  ),
  mcdonald2(
    "Journalism",
    "Here’s some of my most recent journalism: “Commuter rail’s price of protection” (Trains) and “In Vancouver, Pride Became An Answer To Fear” (OutSFL, August 26, 2026).",
  ),
  colemanCox(
    "Rent and homes",
    "I serve as VChair on the City of Gresham Community Development and Housing Committee. In this role we identify programs that support pathways to homeownership, rental assistance, home mending, adapting and DIY programs. [...] I would like to support bringing the vacant storefronts back to life with thriving new business or the expansion of existing business.",
  ),
  colemanCox(
    "Camps, crime and who responds",
    "I strongly support equipping our first responders with all of the tools, resources and personnel they need to keep our city safe; in addition supporting community partners that work with law enforcement to identify what strategies work to decrease crime, and listen to the professionals combatting homelessness and understand what strategies they recommend to aid in housing our houseless residents.",
  ),
  colemanCox(
    "Your bills and taxes",
    "As Chair of the City of Gresham Public Safety Levy Committee it is the task of this committee to hold the city accountable for the tax dollars they are collecting to fund this levy. This is accomplished through quarterly meetings with city staff and first responder leaders. We then take this information and report out to the public. We ensure each dollar spent is directly tied to the language of the levy that voters passed.",
  ),
  colemanCox(
    "Streets, buses and air",
    "When I talk about sustainable growth, I mean bringing good jobs to Gresham while making sure our roads and other infrastructure can support that growth and our natural resources are protected.",
  ),
  colemanCox(
    "Levy and fire district",
    "I wholeheartedly support renewing the levy and beginning to make the case transparent for residents right now as to why we need to continually fund the public safety levy.",
  ),
  colemanCox(
    "Groundwater and rates",
    "The financial investment to move from Bull Run water to groundwater is much too great to retract. I encourage residents to sound the alarm if something is terribly off with their water (sight, smell, taste) so the city can remedy it. [...] The move to groundwater seems logical. Nonetheless, the notification of the switch should have come with a lot more noise and information.",
  ),
  colemanCox(
    "Public-safety fee",
    "I support keeping the Police, Fire and Parks Fee at $15 a month. Residents deserve to know what they are paying for and how this fee works alongside the fire and police levy. If Council considers changing the amount, I believe residents should have a chance to weigh in.",
  ),
  colemanCox(
    "General-fund gap",
    "I would not continue using reserves to cover a gap that comes back every year. That money will run out, and we still need it for unexpected needs. I also would not jump to cutting services residents rely on. I would want staff to walk us through what is causing the gap, where we can save money, and what other revenue options would mean for residents. Then Council needs to make those decisions in public and explain them clearly.",
  ),
  colemanCox(
    "Camping and shelters",
    "I support keeping our parks and public spaces safe and available for all residents. I also understand the need to keep reaching out to people experiencing homelessness and help connect them with shelter and a path to stable housing. I am open to pod shelters under the new permit process, but I would want to know who would run them, where they would go, how they would affect nearby residents, and whether they would help people move into housing.",
  ),
  colemanCox(
    "Keep Gresham’s own fire department, or join a district?",
    "I have met with Gresham Fire, who is currently outsourced to Fairview, Wood Village and Troutdale. I also met with the Mayor of Wood Village, Jairo Rios-Campos; I support moving toward a fire district. A committee is already formed with this endeavor in mind. I believe sharing the responsibilities across the communities being served will produce more sustainable funding while maintaining strong fire and emergency services.",
  ),
  schroeder(
    "Rent and homes",
    "As a Planning Commissioner, I have supported efforts to remove barriers to housing construction, and I would continue that work by looking for opportunities to reduce unnecessary City fees and streamline the development process so projects can move from conception to completion more quickly. Gresham cannot build its way out of a regional housing shortage by itself, so I also support expanding rehabilitation grants and down-payment assistance while measuring success by increased housing production, more opportunities for homeownership, preservation of existing housing, and fewer Gresham households that are housing-cost burdened.",
  ),
  schroeder(
    "Camps, crime and who responds",
    "I favor an individualized approach that combines accountability with a genuine path off the street. I would like Gresham to strengthen partnerships with nonprofits that can engage people experiencing homelessness, identify whether they need temporary shelter, housing assistance, addiction treatment, mental-health care, education or other support, but when appropriate services are available and someone refuses them while continuing to violate camping or other laws, I support enforcement of those laws and the legal consequences that may follow.",
  ),
  schroeder(
    "Bills and taxes",
    "My first priority is making sure the City is using the revenue it already receives efficiently and directing it toward core services and community needs; residents should not be asked to pay more simply to compensate for inefficiency. I also want to grow Gresham’s economy by attracting employers, supporting local businesses and encouraging investment because greater economic activity expands the tax base without automatically raising taxes.",
  ),
  schroeder(
    "Streets, buses and air",
    "Gresham already has the foundation of an excellent bicycle and pedestrian network, and I would prioritize connecting and improving separated routes such as the Springwater Corridor, Wy’East Way and Gresham-Fairview Trail and strengthening their connections to transit. I do not support expanding conventional on-street bike lanes where bicycles and vehicle traffic share the roadway; wherever practical, I prefer infrastructure that separates bicycles from cars. [...] I want to prioritize filling [sidewalk] gaps, improving safe street crossings, and creating better pedestrian connections between neighborhoods, schools, parks, businesses and transit.",
  ),
  schroeder(
    "Public-safety fee",
    "I would not expand the current $15 Police, Fire and Parks Fee, but because it currently provides significant funding for essential services, I would not eliminate it without a replacement. My preference would be to transition away from the Council-imposed fee toward voter-approved funding, with parks considered separately from police and fire so voters can make a clear choice about the level of funding they want for each.",
  ),
  schroeder(
    "Levy and fire district",
    "I am open to a regional fire district. Gresham already provides fire services to neighboring communities through service agreements, so before changing that system I would want an honest cost-benefit analysis showing what each community currently contributes and comparing that with a district model, including costs, response times, staffing, service levels, governance and accountability. I would support a district if the analysis demonstrated that it makes financial sense for Gresham without degrading services, and preferably improves them. I would then use those findings, along with the results of the current voter-approved public-safety levy, to determine what funding is actually needed before asking voters to consider any levy renewal.",
  ),
  schroeder(
    "General-fund gap",
    "A structural deficit that continues to grow is not sustainable, but I would need a much deeper understanding of the City’s budget and long-term forecasts before saying that the answer is simply cutting services or raising revenue. I would first look for operational efficiencies and opportunities to coordinate projects or funding where work overlaps, while making economic development a priority. Using reserves may be appropriate for one-time costs, but it cannot be the long-term solution to an ongoing structural deficit.",
  ),
  schroeder(
    "Groundwater and rates",
    "I support Gresham having a reliable and resilient water supply, although I would have preferred retaining Bull Run as our primary source and developing groundwater as a backup. [...] Many residents, including me, have experienced a noticeable decline in taste and the everyday quality of the water even though it continues to meet drinking-water standards. I do not believe individual households should simply be expected to purchase filtration systems to address a systemwide change in water quality. Before supporting additional rate increases, I want a clear accounting of what those increases are paying for, what obligations remain from the groundwater transition, and what the City can do systemwide to improve taste and hardness.",
  ),
  schroeder(
    "Camping and shelters",
    "I support maintaining Gresham’s camping restrictions while continuing housing-focused outreach and offering appropriate services and shelter before enforcement. I remain very wary of pod shelters in our community, although I am not categorically opposed to them. [...] Any proposal in Gresham would need careful scrutiny, particularly regarding its impact on the surrounding neighborhood, and I would want clear evidence that it provides a genuine path toward treatment, employment or stable housing rather than simply creating a more permanent place for homelessness.",
  ),
  schroeder(
    "Immigration enforcement",
    "I believe the City Attorney has correctly described Gresham’s limited role. State law restricts the City’s participation in federal immigration enforcement, while the City also cannot interfere with lawful federal enforcement activity. I do not support declaring a local emergency when doing so would not materially change the City’s legal authority or the situation on the ground.",
  ),
  schulte(
    "Rent and homes",
    "Portland has to address both what it costs to live here and the potential for being able to earn here. Housing production is part of that, but the number of units is not the entire question. [...] The Home-Share Mitigation Fund would use part of the Home Sharing Pilot Program’s existing $500,000 budget to protect participating homeowners against property damage or sudden vacancy.",
  ),
  schulte(
    "Camps, crime and who responds",
    "ReBoot would provide continuing human connection through paid navigators, professional support, trained volunteers, a Navigation Center and an immediate-action fund. [...] If someone in a shelter bed needs medication but cannot get to the pharmacy, misses an appointment because a phone was lost, or loses contact during a handoff, ReBoot would act before that small failure becomes another disconnect.",
  ),
  schulte(
    "Your bills and taxes",
    "City Council’s first responsibility is to stop making Portland more expensive. [...] Put the combined effect of proposed City-controlled household costs in front of Council at the same time instead of approving increases separately. If the combined cost is growing faster than Portland household incomes, Council has to reduce, delay or offset discretionary increases.",
  ),
  schulte(
    "Streets, buses and air",
    "Complete the Safe Routes priority network around every District 4 elementary school within one Council term. [...] TriMet’s missing riders and downtown’s missing workers are basically the same missing trips.",
  ),
  schulte(
    "Moda Center deal",
    "Schulte would have been very hardline on requiring the Blazers to contribute. But the train has left the station on Portland’s approach. Now that we have committed, Schulte generally supports the term sheet and public funding as initial negotiating strategy, but not the City’s approach to negotiations. Portland should demand other concessions, such as what Dundon offered and agreed to in Raleigh. [...] Schulte would take Portland’s case directly and immediately to Commissioner Adam Silver and the NBA Board of Governors.",
  ),
  schulte(
    "Police staffing",
    "Fill the positions that are already funded. Before expanding police staffing, stop sending officers to thousands of calls that do not require them. Move appropriate welfare checks, unattended deaths and repeat false alarms away from armed officers. Reassign the officer hours that creates to emergency response and investigations.",
  ),
  schulte(
    "Street repair fee",
    "Yes. Portland’s streets need to be fixed. The fee should include completing the Safe Routes priority network around every District 4 elementary school.",
  ),
  schulte(
    "What utility partners, engineering studies and financing would the energy proposal require?",
    "The first phase of the Grid would have PGE, Pacific Power, participating building owners and Prosper Portland identify candidate buildings and measure what is actually there: electrical service, current loads, equipment, building conditions and local-grid capacity. [...] Upgrades could be financed through PropertyFit, PCEF loans, Energy Trust incentives, state and federal funding and private investment. The General Fund would not be the main source.",
  ),
  delplato(
    "Rent and homes",
    "Gresham has some of the slowest permit approvals and highest permit fees in the area. I would streamline permitting, create a business liaison to help applicants through city red tape, and adopt a pre-approved home design program modeled on Bend’s, which saves homeowners $5,000–$10,000+ in design costs. Success: shorter permit timelines and lower fees than neighboring cities.",
  ),
  delplato(
    "Camps, crime and who responds",
    "Police and Fire are core services I will protect, while making sure they have the tools and resources to do the job without red tape. I do not support Portland-style permissive camping policies. Success: faster response times.",
  ),
  delplato(
    "Bills and taxes",
    "Gresham’s real structural shortfall is about $12 million this year, growing to $30.8 million by 2031. I would act early: review purchasing, contracts and technology for savings before adding new taxes or fees; review each major program’s cost against its results on a regular schedule; and match ongoing costs with ongoing money rather than one-time funds. Success: a shrinking structural gap in each adopted budget.",
  ),
  delplato(
    "Streets, buses and air",
    "I would extend Gresham’s five-year Capital Improvement Program to a 10- to 20-year horizon, so we budget for road and pipe replacement before it becomes an emergency.",
  ),
  delplato(
    "Groundwater and rates",
    "Keep the current groundwater system. There is no viable alternative today, and costs will be better controlled than buying Portland’s water, which is expected to become much higher than current prices. Residents also deserve honest answers and accountability on taste, odor and hardness concerns, and I support promoting the city’s free water testing and pushing for a responsive fix.",
  ),
  delplato(
    "Public-safety fee",
    "Still reviewing.",
  ),
  delplato(
    "Immigration enforcement",
    "I’m keeping my focus local, on Gresham’s budget, safety and services.",
  ),
  russ(
    "Housing and homelessness",
    "Nearly every one of my statements, proposed Bills, and proposed actions will lead to reduced homelessness. My goal is to return the country, and prosperity, to the people. When the economy soars, homelessness will drop dramatically. Giving money to NGO’s to over pay their bloated staff only exacerbates the problem. We can not continue with the failed policies created by Progressive theology.",
  ),
  {
    candidateId: "david-russ",
    question: "Housing and homelessness (his clarification)",
    text: "My statement regarding distribution of federal funds was regarding NGO’s. I did not say “non-profits.” Many NGO’s are non-profit, but not all. [...] These entities spend more on their staff, consulting, and programs that actually make the homeless dependent on them than what they spend helping the homeless to become independent.",
    received: "2026-09-25",
  },
  russ(
    "Transportation, energy and climate",
    "I have not created a specific process by which I intend to make this happen, however, since the US Constitution does not provide for the Federal Government controlling large swaths of lands within state boundaries this should really not be a complicated issue. Removing lands that are not specifically National Parks Open to all, will also reduce the Federal Budget.",
  ),
  russ(
    "ICE and border money",
    "I fully support ensuring that Federal Law Enforcement has sufficient funding to efficiently perform their duties.",
  ),
  russ(
    "Fix Our Forests Act",
    "The Fix Our Forests act is OK. However, it is basically a bureaucratic maze designed to give the bureaucrats a way to claim they are doing things right while simultaneously wasting huge amounts of money in consulting and administration. I would support this legislation only as a gap stop. However, the fact is States could administrate exact same program for less.",
  ),
  russ(
    "Medicaid and SNAP cuts",
    "Yes. Keep rules as long as the Federal Government is involved.",
  ),
  russ(
    "ACA premium credits",
    "The “Affordable Care Act” has clearly damaged healthcare affordability. The issue is complicated, and Federal Overreach. I would support another possibility while it is unwound.",
  ),
  russ(
    "Tariffs",
    "I do not support such a thing. That would require a re-write of The Constitution. This nation had no income tax and funded virtually everything via Tariffs until 1913 (137 years!).",
  ),
  russ(
    "Iran war powers",
    "Anyone who has not participated in the highest level of National Security meetings in the White House only “imagines” that they have sufficient information to make a call on this issue. I have not been in one of those meetings.",
  ),
  russ(
    "Federal housing programs",
    "The current level of Federal Involvement in housing is already a huge violation of the 10th Amendment. [...] If States believe that this type of program is important, they should institute them internally.",
  ),
  russ(
    "Data-center costs",
    "At this point, smart municipalities are cutting deals with data centers that are very favorable for the municipality. Some have even secured free power for their residents! If the Federal Government gets involved it will undoubtedly start to skew the deals toward the data centers due to federal lobbying. [...] Smart people in local areas need to cut the right deals for their constituents.",
  ),
  { candidateId: "barbara-j-kahl", question: "Housing and homelessness", text: "Federal HUD grants should fund both new construction and brownstone rejuvenation so federal dollars reflect Oregon’s diversity, not just refugee-targeted capacity. Direct attention toward permitting speed and trades partnerships, with budget tracking of builds and rejuvenation publicly, transparency required. Pair this with Federal HHS funds for stepwise addiction/mental health recovery networks vetted through Oregon’s Medical Board blended with vetted, transparent accountability partners, who will measure patient outcomes. Measure results transparently: from intake to success as a productive citizen. Target 2027–2028 project windows, congressional budget permitting.", received: "2026-09-25" },
  { candidateId: "barbara-j-kahl", question: "Public safety and immigration", text: "Federal funds are available through COPS and SAFER grants to supplement police and fire services via payroll and equipment purchases, provided federal accountability standards are attached. That federal accountability would require addressing Oregon’s sanctuary laws. Federal enforcement priorities would include cybercrime, narcotics and human trafficking task force enhancement. Audits of response times for 911 calls for both police and fire are measurable. Data showing crimes curtailed, pounds of drugs removed from the streets and people freed from trafficking would be immediately measurable. OR-1 has not seen those grants in 4 cycles with the current representative. It doesn’t require Salem to approve them.", received: "2026-09-25" },
  { candidateId: "barbara-j-kahl", question: "Taxes and spending", text: "Tax code, federal audits, federal grant oversight. Multiple federal agencies have regulatory overlap with state agencies. Removing duplicate regulations and permitting fees on those duplicate regulations would ease burden in builds, environmental protections, energy and a multitude of other side areas. I’d work to develop an enlarged audit team, applying recovered waste to federal debt paydown, followed by a federal tax-code rebalance to ease the payroll tax burden on small businesses. The measurable results would be less regulatory burden and duplication when building or businesses want to grow, with more money left in taxpayers’ pockets. I made a commitment to not increase taxes; I intend to keep it.", received: "2026-09-25" },
  { candidateId: "barbara-j-kahl", question: "Transportation, energy and environment", text: "Federally, I think of transportation as the Columbia River, an economic hub serving the entire NW and sometimes farther. To keep the Columbia moving billions in products, dredging must occur. Our dredging equipment is over 50 years old and the river depth is insufficient to accommodate larger, deeper-hulled shipping vessels. They are migrating towards the Puget Sound, taking billions of income from Oregon ports. Working with the Army Corps of Engineers, purchase modern dredging equipment, develop silt storage that protects our environment, to bring the Columbia River into the 21st century for cargo shipping. Additionally, the Columbia River is our most environmentally safe, dependable energy source through hydropower. Recent solar and wind energy projects have shown some benefit, but they are unreliable, requiring fossil fuel as back up and oil to keep the wind turbines moving. [...] Moving toward incorporating SMRs would be beneficial. These are zero carbon units that produce reliable constant energy lasting 60 years without needing storage units. Storage, post-lifecycle, is also an open area for resolution.", received: "2026-09-25" },
  { candidateId: "barbara-j-kahl", question: "Medicaid and SNAP", text: "As a compassionate person, this is a difficult question, however, it is taxpayer money we are talking about. While I appreciate these programs in times of need, we must also understand that a culture of government dependence has been growing in our country. We are losing our workforce that provides the dollars to sustain these needed programs. Congress sets the eligibility rules regardless of state sanctuary policy. I support work requirements and real eligibility verification as basic accountability for taxpayer dollars, not a state fight, but a federal one. We must provide needed support to those who qualify, not to those who choose dependence over self-sustainability.", received: "2026-09-25" },
  { candidateId: "barbara-j-kahl", question: "Federal housing programs", text: "Multiple housing programs are available, including HUD, USDA, FHA, and VA for those who qualify. I will ensure these programs are well funded to meet our needs. The federal ROAD to Housing Act was a great win that supports these agencies’ work on new housing construction or repairs needed to make homes livable. It supports reducing local permitting barriers, cutting regulatory delays due to environmental oversight, and duplicate permitting now in existence, where I will ensure the federal permitting processes are streamlined. [...] As these are new changes, I will ensure these agencies are held accountable for following the new laws.", received: "2026-09-25" },
  { candidateId: "barbara-j-kahl", question: "ACA premium credits", text: "The ACA premium credits were restored temporarily. However, that won’t fix the broken medical system. Private equity has driven hospital pricing up 37%; Medicare pays conglomerates up to 4 times more for the same service a private physician provides. Those ACA credits are feeding the dragon that continues to raise the prices for their profit margins. I will work to revamp antitrust laws, placing guardrails on private equity firms. Creating standardized pricing throughout Medicare and Medicaid will bring costs down while requiring cost transparency to patients before services are provided.", received: "2026-09-25" },
  { candidateId: "barbara-j-kahl", question: "Tariffs", text: "Tariffs, well intentioned, poorly executed. If we adopt the tariff model, it needs to be phased in instead of imposing them all at once. Pair each phase with an income tax reduction. Require large importers to sign enforceable agreements limiting cost transfer to consumers. Protect American industry by bringing manufacturing back to the U.S. (the original intent of the tariffs) and allow corporations to grow jobs without forcing families to pay for it.", received: "2026-09-25" },
  { candidateId: "barbara-j-kahl", question: "ICE and border money", text: "Yes fund ICE, with caveats. Unfettered immigration most damages those who immigrated here legally. [...] To best use those funds, I’d begin by assessing the maximum number of people allowed into the U.S. annually and determine if that number still makes sense. I’d evaluate the manner in which they are allowed in: does it take American jobs or promote growth in American resources? I’d focus on citizenship processing for those immigrating legally. Perhaps this would remove the decades long backlog. Fund development of AI tools to perform background checks in minutes, not months. Reduce the redundant paperwork burden for legal entries. Enforce the law for those coming here illegally.", received: "2026-09-25" },
  { candidateId: "barbara-j-kahl", question: "Iran war powers", text: "I come from a long line of military family members. My own husband was deployed in the Persian Gulf and the Strait of Hormuz while I was the ship’s ombudsman; I know why they are there. [...] Congress should determine if the war should continue, but those with military experience in this conflict zone must be consulted to understand the true risks if we leave that area.", received: "2026-09-25" },
  { candidateId: "barbara-j-kahl", question: "Fix Our Forests Act", text: "I was disappointed that our incumbent in CD1 voted No on the Fix our Forests Act. [...] Yes, I would vote to thin our forests, protect our environment by enforcing riparian zone areas, and bring that timber home to reopen our mills, put people back to work milling wood to build homes, reducing costs, bring revenue back to rural schools and for rural public safety needs.", received: "2026-09-25" },
  { candidateId: "barbara-j-kahl", question: "Data-center costs", text: "I would like to see data centers controlled, tax breaks removed and those funds returned to the public trust. I’d like data centers to provide their own energy when their need exceeds other businesses of the same size, and mandate enclosed cooling systems to avoid draining water reservoirs and aquifers that feed public water. I’d like to envision re-engineering them to be stacked rather than sprawled.", received: "2026-09-25" },
  { candidateId: "diana-helm", question: "Crisis care, jail and deflection", text: "Our deflection program is working well and we now have the Stabilization Center in Milwaukie that handles those in crisis, whether it’s mental health, substance abuse or other issues. Our Recovery Campus opens in fall of 2027 and will assist those with SUDs, mental health issues, homelessness, workforce training and transition housing. We need a new jail but are doing the best we can with a very old building. Part of our Strategic Plan is to research the cost of a new jail and where to site it. However, this is years away at this point.", received: "2026-09-25" },
  { candidateId: "diana-helm", question: "Taxes and the budget gap", text: "Every budget cycle each department must present a balanced budget to the Board. Revenue is not keeping up with inflation, so cuts are sometimes necessary within each department. Priority General Fund dollars center on Public Safety, Health, Housing and Human Services (which includes seniors and those with disabilities), Transportation and more. Our County Budget is available at clackamas.us.", received: "2026-09-25" },
  { candidateId: "diana-helm", question: "Roads, bridges and air (data centers)", text: "There is currently a moratorium on Data Centers in Clackamas County (with the exception of individual cities, which would have to institute their own policy). Nothing will happen until we codify a new policy that addresses water use, energy use, sound, and air quality.", received: "2026-09-25" },
  { candidateId: "diana-helm", question: "Judicial-warrant rule", text: "County Counsel recommends we follow state law.", received: "2026-09-25" },
  { candidateId: "ali-beaudoin", question: "Clearing camps", text: "I would support clearing unsafe camping areas while making sure we provide stable housing and appropriate support for the people living there.", received: "2026-09-25" },
  beaudoin(
    "Rent and homes",
    "I would focus on increasing the supply of housing, simplifying complex permitting processes, reducing unnecessary regulatory costs, and supporting more middle-income and workforce housing. I also want to expand pathways to homeownership and make better use of vacant or underutilized properties. On the financing side, I would explore working with the city and financial institutions to offer first-time homebuyers temporary interest-rate assistance to reduce their monthly costs while mortgage rates remain elevated.",
  ),
  beaudoin(
    "Camps, crime and who responds",
    "We need enforcement when there is violence, property crime, or unsafe behavior; prevention through housing and behavioral-health services; and a stronger non-police response for people who need care rather than enforcement. The goal should be matching the response to the problem instead of using one system for everything.",
  ),
  beaudoin(
    "Your bills and taxes",
    "I would focus on reducing the city’s commercial vacancy rate and bringing businesses back to downtown Portland and neighborhood commercial corridors. That would create jobs and expand the city’s tax base without raising taxes, and as revenues improve, we should look for opportunities to reduce the tax burden and eliminate unnecessary fees.",
  ),
  beaudoin(
    "Streets, buses and air",
    "I would prioritize investment in basic transportation infrastructure, including street maintenance, sidewalks, safer crossings, reliable buses, and neighborhood connectivity, while continuing to support biking and pedestrian improvements.",
  ),
  beaudoin(
    "New taxes or fees",
    "I would generally hold the line on new taxes and fees until the city demonstrates that existing revenue is being spent efficiently and programs are producing measurable results. If a new revenue source is proposed, it should have a clear purpose, a sunset or review mechanism, and strong accountability for how the money is spent.",
  ),
  beaudoin(
    "Police staffing",
    "Portland needs enough officers to provide timely responses to serious crime and emergencies, so I support rebuilding staffing where there are documented service gaps. At the same time, I would invest in alternative responders, prevention, and community-based services so police are not the default response to every problem.",
  ),
  beaudoin(
    "Clearing camps",
    "I support enforcing public-space rules while making sure there are realistic pathways to shelter, housing, and services. The city should measure what happens after a removal, including where people go, whether the area stays clear, and the cost, rather than measuring success simply by the number of camps cleared.",
  ),
  beaudoin(
    "Data centers",
    "I support a temporary pause on new AI data centers while the city evaluates their impacts on electricity, water, infrastructure, noise, and surrounding neighborhoods. Portland should pursue economic development while making sure large users pay their fair share of the infrastructure and resources they require.",
  ),
  beaudoin(
    "Street Response",
    "I support expanding Portland Street Response toward 24/7 coverage where the data shows it can safely and effectively handle calls that do not require police. Expansion should be tied to measurable outcomes, response times, and demonstrated demand.",
  ),
  beaudoin(
    "Street repair fee",
    "I would oppose adding or maintaining fees without first demonstrating that they are necessary and that existing transportation dollars are being used effectively. Portland should prioritize maintaining the infrastructure we already have and be transparent about exactly what each fee delivers.",
  ),
  beaudoin(
    "Water rates",
    "I recognize that Bull Run filtration and aging infrastructure require substantial investment, and I support making the necessary investments in Portland’s water system. I would support necessary, phased increases, but only alongside aggressive cost controls, outside funding opportunities, and clear protections for households that cannot afford higher bills.",
  ),
  cronlund(
    "What spending would you prioritize or reduce to sustain public-space investment?",
    "Sustain investment in our public parks and reduce the backlog of maintenance without reducing access. I propose a careful approach to achieving 35% reduction in the $800 million backlog without new taxes. I will advocate for clear reporting back to the voters on progress toward this goal. I support a modest increase in police if tied to decreasing response time. Moda Center renovations to secure short term, prevailing wage construction jobs and provide a centerpiece from which restorative development proposed in the Albina Vision Trust may succeed. [...] I will allocate funds from my office budget to support a City Hall led planning process.",
  ),
  cronlund(
    "Housing affordability and production; public safety and homelessness",
    "I will advocate for Portland Housing Bureau to exercise greater oversight and accountability for its nonprofit partners, including 1) ensuring that nonprofit expenses are legal and within budget, 2) existing housing is full to capacity, 3) residents are cared for and 4) neighbors feel safe around these affordable housing properties. I would direct Bureau of Development Services to explore how we could streamline downtown office vacancy to housing for willing property owners. Office vacancy downtown is at 37%.",
  ),
  cronlund(
    "Accomplishments",
    "While I was executive director of Three Rivers Land Conservancy, I championed and created the organizational foundation of the Backyard Habitat Certification program. The pilot program lasted for 4 years under Three Rivers before it was transferred to Audubon and Columbia Land Trust. [...] While working at Greenline Fine Woodworking with my husband on our small family business, I acted as business manager from 2010 through the end of 2023. [...] One of our significant accomplishments was restoring a private residence called Firehouse 17. This property and Greenline received a Restore Oregon DeMuro award in 2019.",
  ),
  colemanCox(
    "Immigration enforcement",
    "I am a part of one of the community groups that supported the mayor and city council to produce the rule of law resolution. I support our local police focusing on keeping our city safe. I am open to an emergency declaration if it would give the City a practical way to better protect our residents.",
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
  sollitt(
    "Rent and homes",
    "On housing, I would focus first on preserving existing naturally occurring affordable housing and making better use of the resources we already have. [...] I would introduce a standardized fiscal scorecard for significant PHB investments showing the City's full contribution including direct funding, land and waived fees alongside outside funding, cost per unit, affordability and delivery schedule. [...] We should measure success through units preserved or created, units occupied, time from completion to occupancy, City contribution per occupied and/or preserved unit, outside dollars leveraged, permitting time, and actual versus projected project cost and schedule.",
  ),
  sollitt(
    "Camps, crime and who responds",
    "My approach is to clearly define who responds to what. Police should handle situations that require police authority or present a public-safety threat. Fire/EMS should handle medical emergencies. Portland Street Response and CHAT should handle appropriate behavioral-health, welfare and non-emergency calls. [...] Recent budget decisions preserved visible police and fire staffing while reducing administrative, dispatch, technology and support capacity that those responders rely on. [...] Within my first year, I would want Council to have a clear response-allocation plan identifying which calls should be handled by police, Fire/EMS, PSR, CHAT or County resources, the staffing and support capacity required to provide those services reliably, and the cost of each response.",
  ),
  sollitt(
    "Your bills and taxes",
    "Before asking Portlanders for more money, I want to demonstrate that we are using what they already give us wisely. Within my first budget, I would introduce a budget amendment to restore the Auditor's performance-audit capacity that was reduced because of the City's financial crisis. [...] I would not set an arbitrary savings target for the Auditor. [...] My first-year benchmark would be restoring the lost audit capacity and establishing a clear process for Council and the public to see what happens with the Auditor's findings.",
  ),
  sollitt(
    "Streets, buses and air",
    "My priority after becoming elected is maintaining what we already have before committing to new projects until new funding sources can be identified. [...] I would also work with the PCEF Committee to determine whether existing voter-approved climate funding can be more strategically allocated, within its approved purpose, toward transportation and air-quality needs. If the public's direction needs to change, I would take that question back to voters rather than have Council circumvent it. I would restrict spending on projects without a clear public benefit, sustainable funding source and measurable outcome.",
  ),
  sollitt(
    "Moda Center deal",
    "I would have voted no on adopting the proposed Moda Center renovation term sheet. I support keeping the Trail Blazers in Portland, but I believe the City should have started from a much stronger negotiating position. [...] Given the scale of the public investment, we should have secured a clear, material return for Portland, along with stronger accountability and remedies.",
  ),
  sollitt(
    "Clearing camps",
    "No. I would pause any discussion about increasing or reducing funding until we have a clear accounting of the program in order to right-size funding. [...] I agree that we need to keep rights-of-way clear, but this has become a contentious point for our community that has raised some legitimate concerns.",
  ),
  sollitt(
    "Data centers",
    "I support restricting new AI data centers in Portland. [...] I would support restrictions while we develop clear standards around resource use, environmental impacts, infrastructure costs, community impacts, and transparency. If a proposed facility can demonstrate that it meets those standards and provides a meaningful public benefit, that should be part of the conversation.",
  ),
  sollitt(
    "Street Response",
    "I support eventually making Portland Street Response a 24/7 service, but simply adding City funding to the existing system isn't sustainable. PSR needs an operational overhaul, including dispatch, geographic coverage, recruitment, and retention. [...] I would also consider temporarily reducing hours to alleviate the burden on current staff rather than continuing to stretch the system beyond its capacity.",
  ),
  sollitt(
    "Street repair fee",
    "I would eliminate the monthly street repair fee. [...] I don't want to pretend I have a single replacement funding source that solves this overnight. [...] This is exactly why I would want to undertake the hard work of auditing our transportation obligations, finding efficiencies, pursuing outside funding and partnerships, and identifying more equitable revenue options rather than defaulting to another fee.",
  ),
  sollitt3(
    "Which measurable service targets would you put in the next budget?",
    "Before we can consider measurable service targets we need to know what we can actually afford. I can identify general areas where the city should measure, such as permitting timelines, call and response times, street and sidewalk maintenance, 311, housing and homelessness outcomes, infrastructure condition, and major project delivery. [...] Every major service should have a credible baseline, a measurable target, an accountable owner, and an identified cost. [...] Requests for additional funding should identify the capacity it would restore or add and the measurable improvement residents should expect in return.",
  ),
  sollitt3(
    "Climate, transportation and environmental health",
    "I support continued investment in clean energy, energy efficiency, building electrification and climate resilience, including through the Portland Clean Energy Community Benefits Fund. [...] I support reducing our dependence on fossil fuels and addressing the risks of the Critical Energy Infrastructure Hub, especially given Portland’s earthquake risk. I also support protecting our tree canopy, restoring natural areas and waterways, including Portland Harbor, and preparing neighborhoods for extreme heat and other climate impacts. [...] Whether it is a data center or a facility like Zenith, the public should understand the energy and water use, environmental and safety risks, infrastructure costs and commitments being made. There should not be secret deals or NDAs that prevent meaningful public scrutiny.",
  ),
  sollitt3(
    "Accomplishments",
    "Legendary Makers Market: In 2023, I founded and produced the event through Asian American Town, leading the concept, partnerships, programming and production. The 2023 debut started with a $0 budget, brought together more than 100 AAPI vendors, and was presented in partnership with the Portland Night Market. The event grew substantially in its second year, more than 200 vendors and partners and an estimated 35,000 attendees with support from the City of Beaverton. [...] I Hope You Get Rich: In 2025, I founded and produced Oregon’s first Asian American pitch competition inspired by Pitch Black and Pitch Latino [...] It also started with a $0 budget.",
  ),
  sollitt(
    "Water rates",
    "I would not support additional rate increases without first exhausting meaningful alternatives to reduce the burden on ratepayers. [...] I can't promise that rate increases can be avoided given the commitment the City has already made, but I can promise that I would treat reducing the burden on ratepayers as a priority and require clear, independent accountability for the remaining work.",
  ),
  sweeney(
    "What agreements would permit the homelessness funding changes, and what happens to services during a transition?",
    "Under Resolution “A” in 1983, Multnomah County took over the jails, bridges and welfare services in Multnomah County. Before that, Multnomah County was a full-service government like the City of Portland. I think that moving the homeless/houseless services to the county would be more effective in serving those in need. The funding is with both federal and local money. Shifting it to the county, the federal funds would follow the services. This should be seamless in both the services provided and the funds to support them.",
  ),
  sweeney(
    "Housing",
    "Let’s take a hint from IKEA: IKEA builds to the price. Let’s look at the people we are trying to house and what their income is, and what they can afford. Then build to the price! There are new plans out there. One of them is Quonset houses. New models run less than $4,000 for the house. This has a lot of possibilities.",
  ),
  sweeney(
    "Parks and military work",
    "I was with the Portland Parks for 33 years, and I pride myself on the fact that more of my temporary employees became permanent. They were making just above minimum wage and became permanent. Many got married and started families. [...] I served in the Army Guard and Army Reserve for 28 years. Started as a private and ended as a captain. Over the years I met many fine people and encouraged them to join the city or the Guard or Reserves.",
  ),
];
