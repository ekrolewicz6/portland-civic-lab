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
const colemanCox = (question: string, text: string): CandidateAnswer => ({ candidateId: "heather-coleman-cox", question, text, received: "2026-09-23" });
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
