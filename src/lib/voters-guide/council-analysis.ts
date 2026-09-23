import type { Candidate, Evidence } from "./types";

type Issues = Partial<
  Record<"housing" | "safety" | "money" | "climate", string>
>;
type AnalysisRow = [string[], string, Issues];

// Authored comparisons; never inferred from party, missing answers or endorsements.
const rows: Record<string, AnalysisRow> = {
  "Ali Beaudoin": [
    ["Financial discipline", "Small-business growth"],
    "The test is whether operational changes produce enough savings and investment to support services. The reviewed announcement names neither specific cuts nor a revenue estimate.",
    {
      money:
        "Emphasizes cost analysis, eliminating unnecessary spending and testing whether programs meet their goals. Specific cuts and tax changes are not established in the reviewed announcement.",
    },
  ],
  "Joel Corcoran": [
    ["Institutional accountability", "Public provision"],
    "Independent legal and budget capacity could strengthen Council oversight, but creating that capacity also costs money. Contract savings and public utility proposals need separate business cases.",
    {
      money:
        "Proposes independent Council legal and budget offices, monthly budget reviews and contract audits; wants clearer rules for work performed by city employees.",
      climate:
        "Supports expanded public utility options. The reviewed pamphlet does not establish an acquisition plan, financing or a rate guarantee.",
    },
  ],
  "Guy Frankenstein": [
    ["Redistribution", "Opposition to ICE"],
    "His responses identify who he wants city government to challenge. They do not establish which city powers, budget changes or legal mechanisms would deliver those goals.",
    {
      money:
        "Calls for larger contributions from billion-dollar companies. A particular tax instrument or projected revenue is not established in the reviewed response.",
    },
  ],
  "Matthias Hallett": [
    ["Police capacity", "Private-sector recovery"],
    "He links economic recovery to stronger policing and a lighter burden on business. Expanding staffing without new taxes depends on reallocations or growth; the reviewed materials do not reconcile those costs.",
    {
      housing:
        "Favors faster permitting, deadlines and escalation when applications stall.",
      safety:
        "Would increase police recruitment, retention and neighborhood presence.",
      money:
        "Wants a more competitive business tax structure and recruitment of employers serving markets outside the region.",
    },
  ],
  "Patrick Hilton": [
    ["Preservation", "Community ownership"],
    "Adaptive reuse and shared ownership seek to protect people and places from displacement. The unresolved comparison is how quickly those tools would add affordable homes relative to redevelopment.",
    {
      housing:
        "Prioritizes adaptive reuse, community land trusts and co-housing, with pathways to ownership.",
      safety:
        "Supports safe-sleeping infrastructure alongside consistent rules for public space.",
      money:
        "Proposes taxes on vacant units and polluters, and shifting money away from consultants.",
    },
  ],
  "Larry Kelly": [
    ["Housing access", "Treatment and support"],
    "He combines reducing housing barriers with services rather than treating either as sufficient. The statement does not specify which rules change or how much treatment and housing capacity would be funded.",
    {
      housing:
        "Supports expanding housing choices and removing unnecessary barriers; specific code changes are not identified in the reviewed statement.",
      safety:
        "Supports Portland Street Response, addiction treatment and permanent housing.",
      money:
        "Wants government to be easier for small businesses to work with. Specific tax and spending changes are not established here.",
    },
  ],
  "Tiffany Koyama Lane": [
    ["Worker and tenant power", "Public investment"],
    "Public ownership and regulation are central tools in her program. Building homes and sustaining services require recurring funding; voting for a study or regulation is different from demonstrating its eventual results.",
    {
      housing: "Supports rental assistance and social housing.",
      money:
        "Prioritizes housing and services and demands oversight of the Moda agreement.",
      climate:
        "Emphasizes street safety and scrutiny of oil infrastructure and data centers.",
    },
  ],
  "Kenneth (Kent) R Landgraver III": [
    ["Consensus", "Legislative cooperation"],
    "Seeking unanimity may build broader buy-in, but can also prolong decisions when interests conflict. His statement does not explain when he would accept a majority decision or which policy compromises he would make.",
    {
      money:
        "Says tax dollars should support public work. Specific budget reallocations or revenue proposals are not established in the reviewed statement.",
    },
  ],
  "Keir Legree": [
    ["Operational delivery", "Household costs"],
    "His stated goals connect city performance to safety and utility bills. His emailed replies of September 19 and 22, 2026 add the mechanisms: competitive bidding, independent cost estimates and scope control for projects; Clean Energy Fund money and building purchases for affordable housing; more shelter and treatment capacity; and a proposed one-year pause on cash bottle redemptions as a measured experiment. He would hold the line on new taxes and fees while hiring more officers and dispatchers; savings are not quantified, and what would pay for the new positions is open.",
    {
      safety:
        "Wants more police and 911 dispatchers and a different approach to street homelessness. The reviewed pamphlet does not detail that homelessness plan.",
      money:
        "Proposes reducing infrastructure-project costs and utility bills without specifying the reductions in the reviewed pamphlet.",
    },
  ],
  "Esther León": [
    ["Public provision", "Non-police crisis care"],
    "She would shift more responsibility for affordability and care into public institutions. That requires funding and implementation across several governments; local proposals and changes to state-controlled systems are not interchangeable.",
    {
      housing:
        "Proposes social housing, simpler zoning and a vacancy tax on corporate landlords.",
      safety:
        "Supports 24-hour citywide Street Response and supportive housing with treatment.",
      money:
        "Proposes new taxes to support a larger public role in housing and services.",
      climate:
        "Supports a data-center moratorium and a transition to public utilities.",
    },
  ],
  "Darren McCormick": [
    ["Enforcement-led response"],
    "His filing establishes a preference for more police and detention. It does not specify offenses, detention standards, treatment capacity or costs. A broader account of his priorities remains a research gap.",
    {
      safety:
        "His July 2026 filing calls for additional police and incarceration of people he characterizes as dangerous and affected by drugs. The filing does not explain the legal criteria or treatment component.",
    },
  ],
  "Angelita Morillo": [
    ["Tenant and civil rights", "Climate investment"],
    "She favors expanding public alternatives and constraining institutional power. The practical questions are which protections Council can enforce and how to fund housing, transport and services together.",
    {
      housing:
        "Supports stronger tenant rights and shelter design involving unhoused residents.",
      safety:
        "Supports Street Response, violence prevention and police accountability.",
      money:
        "Prioritizes public investment and opposed the amended Moda term sheet; that vote does not by itself establish opposition to retaining the team.",
      climate:
        "Supports transit, bike lanes and sidewalks; opposes oil-train and data-center expansion.",
    },
  ],
  "Steve Novick": [
    ["Cost-effective services", "Targeted enforcement"],
    "His agenda combines unarmed response with police investigations and hazardous-camp removal. The distinction is which intervention fits which problem, rather than a simple choice between enforcement and services.",
    {
      housing:
        "Calls for more housing and supportive mental-health and addiction services.",
      safety:
        "Supports unarmed welfare checks, red-flag gun-law use and retaining hazardous-camp removal funding.",
      money:
        "Wants lower Council office spending and scrutiny of the Moda agreement.",
    },
  ],
  "Cristal Otero": [
    ["Household affordability", "Worker power"],
    "She evaluates affordability through wages, ownership and monthly bills together. Her emailed reply fills in the cooperative model: the co-op carries the financing, residents buy a subsidized membership share, resale follows an affordability formula, and buildings get capital-needs assessments before conversion. Not yet settled: which partner funds the ongoing subsidy for the lowest-income households, and when a first building would convert.",
    {
      housing:
        "Proposes stable housing for people with intellectual disabilities and brain injuries and paths to resident ownership.",
      money:
        "Would evaluate borrowing and infrastructure by the effect on household bills.",
      climate:
        "Wants Portland Clean Energy Fund spending to remain tied to climate purposes.",
    },
  ],
  "Terry Parker": [
    ["Maintenance first", "Driver access"],
    "He puts upkeep and motor-vehicle access ahead of some new transport projects. That leaves a concrete tradeoff over street space: how to improve bus reliability and safety without the dedicated lanes he opposes.",
    {
      safety:
        "Supports police and fire staffing and long-term support for unhoused people.",
      money:
        "Would prioritize maintaining streets and parks before new projects.",
      climate:
        "Opposes business-access-and-transit lanes on 82nd Avenue. His predicted traffic effects are campaign claims, not independently established findings in this guide.",
    },
  ],
  "Heart Free Pham": [
    ["Recovery with requirements", "Fiscal restraint"],
    "He opposes criminalizing homelessness itself but supports consequences for refusing available services. The distinction turns on what those consequences are, whether suitable care exists and who can lawfully require it. His housing-cost and fiscal claims still need independent verification.",
    {
      housing:
        "Promotes hempblock construction as a way to reduce building and energy costs. His numerical savings and claims about engineering requirements are campaign assertions, not validated findings here.",
      safety:
        "Supports civil-commitment reform, wellness farms with job training and consequences for refusing available services, while opposing criminalization of homelessness itself.",
      money:
        "Would examine the tax base and migration risks and require cost-benefit accounting before new taxes or spending. His causal and numerical claims are not independently established here.",
    },
  ],
  "Tom Sollitt": [
    ["Reliable public services", "Community participation"],
    "His focus is making existing institutions respond and coordinate, and his emailed reply attaches a measure to each issue: homes preserved and occupied, response times and repeat calls, audit findings acted on, street condition and transit reliability. What remains open is what would pay for street maintenance if the repair fee ends.",
    {
      money:
        "Calls for dependable basic services and stronger oversight of bureaus and contractors.",
    },
  ],
  "John Sweeney": [
    ["Service preservation", "Limits on arena spending"],
    "He would free resources by rejecting arena spending and moving homeless services to the County, citing the 1983 Resolution A transfer of jails, bridges and welfare as the precedent. Shifting responsibility does not itself eliminate service costs; a workable transition still needs a named agreement and continuing provision.",
    {
      safety:
        "Wants the County to assume primary responsibility for homelessness services.",
      money:
        "Opposes spending to retain the Trail Blazers and prioritizes preserving city services as revenue declines.",
    },
  ],
  "Kellie Torres": [
    ["Service delivery", "Civic partnerships"],
    "She treats administrative coordination and partnerships as ways to increase city capacity. Private or philanthropic support can help projects, but it does not establish stable operating revenue or guarantee equal investment across neighborhoods.",
    {
      money:
        "Calls for protecting core services and accountability for spending.",
      safety:
        "Emphasizes safe, connected neighborhoods and public-service delivery.",
    },
  ],
  "Kimberly Tucker": [
    ["Program evaluation", "Spending accountability"],
    "Her response explains how she would judge programs, but not which policy outcomes she would prioritize when evidence and resources point in competing directions. That distinction remains important for comparing her with detailed platforms.",
    {
      money:
        "Wants stronger cost-benefit analysis and clearer explanations for program funding decisions. Specific programs to expand or cut are not named in the reviewed response.",
    },
  ],
  "Martin Ward": [
    ["Public housing", "Restrictions on personal conduct"],
    "His platform combines public provision with restrictions on reproductive care and consensual relationships. Those restrictions are substantive policy commitments; the guide does not adopt his classification of consensual conduct as crime or imply Council can enact all of them.",
    {
      housing:
        "Would test government-owned housing, build permanent shelter and oppose demolition of Lloyd Center.",
      money:
        "Rejects Moda renovations and proposes large spending cuts. The reviewed statement does not substantiate the claimed savings.",
      safety:
        "Would install video cameras at every intersection, buy non-lethal equipment such as tranquilizers, increase police training and add police officers.",
    },
  ],
  "Timothy (TJ) Anderson": [
    ["Lived experience", "Audit first"],
    "His pamphlet statement makes a case for representation informed by homelessness and disability; his emailed answers add an audit-first program: map city spending and assets before any new tax or fee, more officers with lower-cost responders for routine calls, and housing growth through investability and reuse of city assets. Beyond the audit’s $5 million cap, the costs and the mechanics of a Council pay freeze are not yet specified.",
    {},
  ],
  "Eli Arnold": [
    ["Frontline safety", "Tax restraint"],
    "His program expands safety capacity while pledging no new taxes and promoting fareless transit. Those commitments compete for existing money; a complete funding plan and regional agreements would determine what can be delivered together.",
    {
      housing:
        "Supports moving people from tents into housing, shelter and services.",
      safety:
        "Would prioritize police, fire, dispatch and behavioral-health staffing.",
      money: "Pledges no new taxes.",
      climate:
        "Proposes using existing clean-energy resources toward fareless transit, which also requires regional cooperation.",
    },
  ],
  "Olivia Clark": [
    ["Basic services", "Public-space enforcement"],
    "She pairs removing camping and public drug use with shelter and treatment. Implementation depends on actual placement capacity; restoring services also requires choosing between reserves, recurring revenue and other spending.",
    {
      housing: "Supports reducing barriers to housing production.",
      safety:
        "Wants to end street camping and open-air drug use, improve 911 response and protect police and fire funding.",
      money: "Prioritizes core services and business recovery.",
      climate: "Supports maintenance of public assets, sidewalks and pavement.",
    },
  ],
  "Jayne Cronlund": [
    ["Shared public spaces", "Collaborative development"],
    "Her program emphasizes places and partnerships that support community life and jobs. The reviewed statement leaves the harder funding and housing choices open; collaboration alone does not resolve competing budget claims.",
    {
      money:
        "Supports living-wage jobs, the creative and sustainable economy, and regular reporting on shared government goals.",
      climate:
        "Prioritizes parks, trails, natural areas and business districts.",
    },
  ],
  "Jamey Evenstar": [
    ["Housing stability", "Accessible transportation"],
    "Evenstar’s platform treats housing and transport costs as linked barriers to staying in Portland. Social housing and improved transit need financing, and city spending cannot alone determine regional fares or service levels.",
    {
      housing: "Emphasizes tenant protections and housing access.",
      climate: "Wants faster, easier-to-use buses.",
    },
  ],
  "John J Goldsmith": [
    [],
    "His 2026 filing establishes occupational and civic background. It does not provide enough reviewed policy evidence to characterize his governing priorities; those positions remain unknown in this edition.",
    {},
  ],
  "Mitch Green": [
    ["Permanent affordability", "Worker and tenant power"],
    "His approach changes ownership and bargaining power as well as housing supply. Establishing a housing study or tenant protection is an intermediate step; financing, production and long-term operating performance remain separate tests.",
    {
      housing:
        "Supports permanently affordable housing and tenant collective bargaining.",
      money: "Wants greater contributions from large corporations.",
      climate:
        "Would protect climate funding and reduce fossil-fuel activity at the CEI Hub.",
    },
  ],
  "Josh Leake": [
    ["Housing production", "Economic recovery"],
    "He emphasizes financing and development as a route to affordability and recovery. The test is which projects have sites, committed money and attainable rents, rather than whether a housing total is ambitious.",
    {
      housing:
        "Would combine public, private and federal resources to develop housing.",
      safety:
        "Combines responses to crime and disorder with behavioral-health services and dignity for unhoused people.",
      money:
        "Supports creative and technology industries and activating public spaces.",
    },
  ],
  "John McDonald": [
    ["Major civic investment", "Contract scrutiny"],
    "He supports large capital commitments while seeking tighter oversight of homelessness spending. Comparing those priorities requires the total public exposure and recurring costs of both, not just the appeal of the projects.",
    {
      safety:
        "Would limit new homelessness contracts and scrutinize existing providers.",
      money:
        "Supports modernizing Moda Center and retaining the Trail Blazers.",
      climate: "Supports continuing the Interstate Bridge Replacement.",
    },
  ],
  "Matt Schulte": [
    ["Reuse of downtown assets", "Project-led recovery"],
    "His energy proposal uses existing downtown buildings as an economic resource. Utility participation, engineering feasibility and private ownership arrangements determine whether the idea can become a deliverable city program.",
    {
      safety:
        "Proposes ReBoot, connecting volunteers and professionals to help people navigate services.",
      money:
        "Proposes the Grid-Connected Core with downtown building owners to attract economic activity.",
      climate:
        "Would reuse downtown buildings and electrical capacity as energy infrastructure.",
    },
  ],
  "Jeremy Beausoleil Smith": [
    ["Public construction", "Climate and tenant protection"],
    "He combines social housing with climate infrastructure and regulation. Construction funding is only one requirement: maintenance, staffing and legal implementation are continuing obligations.",
    {
      housing:
        "Supports social housing, a renters’ bill of rights and housing linked to treatment.",
      safety: "Supports expanded Portland Street Response.",
      money: "Would protect the Portland Clean Energy Fund.",
      climate:
        "Proposes a four-year AI data-center ban, walking and cycling improvements, and action on CEI Hub risks.",
    },
  ],
  "Eric Zimmerman": [
    ["Services and enforcement", "Tax restraint"],
    "He would maintain several forms of response while resisting tax and fee increases. The key choice is what to reduce or reallocate if existing revenue cannot sustain police, fire, shelter, unarmed response and maintenance together.",
    {
      housing: "Supports housing production and shelter.",
      safety:
        "Combines police, Street Response, camp cleanups, enforcement and treatment.",
      money:
        "Opposes several tax and fee increases while prioritizing police, fire and maintenance.",
    },
  ],
};

const campaign = (label: string, url: string): Evidence => ({
  label,
  url,
  kind: "Candidate statement",
  date: "Website reviewed September 18, 2026",
  note: "Campaign position. Claimed results and numerical premises have not automatically been independently verified.",
});
/* Candidate replies and council-office statements cited by the positions below (September 22, 2026). */
const replyNote =
  "Written by the candidate in reply to the Lab’s questions and kept on file; excerpts appear on the brief. Receipt does not verify the claims.";
const officeNote =
  "Published by the councilor’s own office. Claims in it have not automatically been independently verified.";
const sollittEmail: Evidence = {
  label: "Sollitt · emailed response to the Lab’s questions",
  url: "https://www.portlandciviclab.org/voters-guide/research-log#sollitt-2026-09-22",
  kind: "Candidate statement",
  date: "Received September 22, 2026",
  note: replyNote,
};
const greenStatement: Evidence = {
  label: "Green · statement responding to The Oregonian and Chief Day (council office press release)",
  url: "https://www.portland.gov/council/districts/4/mitch-green/news/2026/9/16/press-release-councilor-green-police-tweets",
  kind: "Candidate statement",
  date: "Councilor’s own office statement, September 16, 2026; read September 22, 2026",
  note: officeNote,
};
const greenPolicy: Evidence = {
  label: "Green · policy (City of Portland council office page)",
  url: "https://www.portland.gov/council/districts/4/mitch-green/policy",
  kind: "Candidate statement",
  date: "Councilor’s own office page; read September 22, 2026",
  note: officeNote,
};
const greenRecordPage: Evidence = {
  label: "Green · record",
  url: "https://www.mitch4portland.com/record",
  kind: "Candidate statement",
  date: "Website reviewed September 22, 2026",
  note: "Campaign position. Claimed results and numerical premises have not automatically been independently verified.",
};
const sweeneyEmail: Evidence = {
  label: "Sweeney · emailed response to the Lab’s questions",
  url: "https://www.portlandciviclab.org/voters-guide/research-log#sweeney-2026-09-22",
  kind: "Candidate statement",
  date: "Received September 22, 2026",
  note: replyNote,
};
const supplements: Record<string, { source: Evidence; issues: Issues; issueSources?: Partial<Record<keyof Issues, Evidence>>; also?: Evidence[] }> = {
  "Timothy (TJ) Anderson": {
    // Emailed reply to the individual questions the Lab sent him on September 19, 2026.
    source: {
      label: "Anderson · emailed response to the Lab’s questions",
      url: "https://www.portlandciviclab.org/voters-guide/research-log#anderson-2026-09-19",
      kind: "Candidate statement",
      date: "Received September 19, 2026",
      note: "Written by the candidate in reply to the Lab’s questions and kept on file; excerpts appear on his brief. Receipt does not verify the claims.",
    },
    issues: {
      housing:
        "Wants more housing and says the fastest route may be making the city more investable, for large accounts and for people who want to make Portland home, alongside reusing city assets at lower cost for short-term help; opposes committing to a single plan.",
      safety:
        "Wants police response times down and says more officers will be needed, with cadets, volunteers and other programs handling calls that do not need the most highly trained officers. On homelessness, would first establish what has worked, a timeline of people’s needs and how to work with others in the city before spending more.",
      money:
        "Would start with a value-based audit of where city money went this year and the past two, plus a public list of city assets, at a cost he puts at no more than $5 million, with no new taxes or fees until it is done. Would freeze Council pay and benefits until average salaries and jobs have grown for two full years, and ask each councilor for 100 hours of volunteer work a year.",
      climate:
        "Would favor climate measures that also improve business investability, and wants more public transit and better train systems while leaving cars to those who want or need them, without burning future finances for what is wanted now.",
    },
  },
  "Keir Legree": {
    // Emailed reply to the identical questions the Lab sent every candidate on September 19, 2026.
    source: {
      label: "Legree · emailed response to the Lab’s questions",
      url: "https://www.portlandciviclab.org/voters-guide/research-log#legree-2026-09-19",
      kind: "Candidate statement",
      date: "Received September 19, 2026",
      note: "Written by the candidate in reply to the Lab’s questions and kept on file; excerpts appear on his brief. Receipt does not verify the claims.",
    },
    issues: {
      housing:
        "Supports increasing housing supply, faster permitting and fewer construction barriers, plus expanding government-owned affordable housing, preserving existing affordable homes and filling vacant subsidized units.",
      safety:
        "Wants more police officers and 911 dispatchers, and a homelessness approach judged by measurable results: more shelter and treatment capacity, expected progress toward stability in exchange for publicly funded services, and accountability for City and County spending. Proposes seeking state authorization for a one-year pause on cash bottle and can redemptions in Portland as a measured experiment.",
      money:
        "Would lower the cost of delivering infrastructure rather than defer maintenance: stronger competitive bidding, independent cost estimates, tighter control of scope and change orders, cost comparisons with peer cities, and a public-benefit test before major projects begin.",
      climate:
        "Supports reducing emissions and a balanced transportation system for walking, biking, transit and driving, with pedestrian and bicycle improvements where safety or transportation need is demonstrated and major projects evaluated for use, safety, cost and system impacts.",
    },
  },
  "Matthias Hallett": {
    source: campaign(
      "Hallett · Re-Vision platform",
      "https://www.matthiashallett.com/revision",
    ),
    issues: {
      safety:
        "Supports a goal of two police officers per 1,000 residents without raising taxes; emphasizes recruitment and street presence.",
      money:
        "Calls for audits and limits on unaccountable spending, lighter burdens on businesses, and an agreement to retain the Blazers. His critique of ranked-choice voting is a campaign position, not evidence the count is unreliable.",
    },
  },
  "Tiffany Koyama Lane": {
    source: campaign(
      "Koyama Lane · policy and track record",
      "https://teachertiffanyforthepeople.com/policy-track-record/",
    ),
    issues: {
      housing:
        "Supports publicly owned housing as an alternative to for-profit landlords and continued rental assistance.",
      climate:
        "Prioritizes Vision Zero, bike and transit infrastructure, tree canopy and a data-center moratorium.",
      money:
        "Favors public services, stronger union contracts and regulating corporations while lowering the burden on working families. A fully costed next-term program is not established here.",
    },
  },
  "Steve Novick": {
    source: campaign(
      "Novick · second-term priorities",
      "https://NovickForPortland.com",
    ),
    // His emailed reply of September 21, 2026 explains his July budget votes and names past work with public sources.
    also: [
      {
        label: "Novick · emailed response to the Lab’s questions",
        url: "https://www.portlandciviclab.org/voters-guide/research-log#novick-2026-09-21",
        kind: "Candidate statement",
        date: "Received September 21, 2026",
        note: "Written by the candidate in reply to the Lab’s questions and kept on file; excerpts appear on his brief. Receipt does not verify the claims.",
      },
      {
        label: "City of Portland · red flag law presentation (placed file 2026-230)",
        url: "https://www.portland.gov/council/documents/presentation/placed-file/2026-230",
        kind: "Public record",
        date: "2026",
        note: "Cited by the candidate for the red flag law he says he led.",
      },
      {
        label: "OPB · Portland gas tax passes (2016)",
        url: "https://www.opb.org/news/series/election-2016/oregon-portland-gas-tax-passes/",
        kind: "Reporting",
        date: "May 2016",
        note: "Cited by the candidate for the 10-cent city gas tax he proposed as commissioner.",
      },
      {
        label: "Portland Tribune · Novick wants 10-cent city gas tax on May 2016 ballot",
        url: "https://portlandtribune.com/2015/10/05/novick-wants-10-cent-city-gas-tax-on-may-2016-ballot/",
        kind: "Reporting",
        date: "October 5, 2015",
        note: "Cited by the candidate for the same measure.",
      },
      {
        label: "U.S. District Court · Superfund cost-recovery decision, 750 F. Supp. 1460",
        url: "https://law.justia.com/cases/federal/district-courts/FSupp/750/1460/1473496/",
        kind: "Public record",
        date: "1990",
        note: "Cited by the candidate as one of the decisions from the Superfund cost-recovery litigation he says he led as a Justice Department lawyer.",
      },
      {
        label: "U.S. District Court · Superfund cost-recovery decision, 733 F. Supp. 1424",
        url: "https://law.justia.com/cases/federal/district-courts/FSupp/733/1424/1516926/",
        kind: "Public record",
        date: "1990",
        note: "Cited by the candidate for the same litigation.",
      },
      {
        label: "The Oregonian · Measures 66 and 67 tax debate (2010)",
        url: "https://www.oregonlive.com/politics/2010/01/measures_66_67_tax_debate_heat.html",
        kind: "Reporting",
        date: "January 2010",
        note: "Cited by the candidate for his policy-research and communications role in the 2010 campaign.",
      },
    ],
    issues: {
      housing:
        "Supports faster permitting and attracting housing investment, alongside stronger state and county mental-health and addiction services.",
      safety:
        "Would add detectives for property crime and shift welfare checks to unarmed responders; supports removing hazardous camps rather than indiscriminate sweeps.",
      money:
        "Wants lower Council office budgets, a financially fair Moda agreement, Medicaid reimbursement for Street Response, and replacing the Arts Tax while preserving arts funding.",
      climate:
        "Supports using PCEF for transit and potentially part of the water-filtration project to offset water-rate increases. That differs from reserving the fund for its existing program mix.",
    },
  },
  "Esther León": {
    source: campaign("León · issue platform", "https://EstherForPortland.com"),
    issues: {
      housing:
        "Would expand social housing and simplify zoning; proposes vacancy taxes aimed at large landlords, with residential proceeds helping formerly unhoused tenants enter rentals.",
      safety:
        "Would fund citywide 24/7 Street Response, expand unarmed support specialists and reduce armed responses; opposes sweeps and favors housing with health or addiction support.",
      money:
        "Proposes land-value taxation, targeted vacancy taxes and exploration of basic income for artists. These are proposals, not established city revenue authority or costed programs.",
      climate:
        "Supports protected bikeways, car-free plazas, later transit service and a regional transit funding mechanism; opposes Waymo. Regional transit changes require cooperation beyond Council.",
    },
  },
  "Cristal Otero": {
    source: campaign(
      "Otero · policy platform",
      "https://www.cristalforportland.com/my-platform",
    ),
    // Her housing position adds the detail from her emailed reply of September 19, 2026.
    issueSources: {
      housing: {
        label: "Otero · emailed response to the Lab’s questions",
        url: "https://www.portlandciviclab.org/voters-guide/research-log#otero-2026-09-19",
        kind: "Candidate statement",
        date: "Received September 19, 2026",
        note: "Written by the candidate in reply to the Lab’s questions and kept on file; excerpts appear on her brief. Receipt does not verify the claims.",
      },
    },
    issues: {
      housing:
        "Supports more housing across incomes and anti-displacement protections, and proposes a pathway for roughly 5–20% of the Housing Bureau’s affordable rental portfolio (about 950 to 3,800 homes at today’s scale) to move to limited-equity cooperative ownership over time, aimed at households at 0–30% of area median income, starting with publicly owned or financed buildings whose residents want it.",
      safety:
        "Supports emergency response alongside prevention, behavioral health and housing stability; the page does not name a police staffing target.",
      money:
        "Would test program results and, when more revenue is necessary, favor taxes on the wealthiest households and largest corporations over working households and small businesses.",
    },
  },
  "John Sweeney": {
    // His housing position comes from his emailed reply of September 22, 2026.
    source: sweeneyEmail,
    issues: {
      housing:
        "Would build housing to the price the people being housed can afford, starting from their incomes, and points to low-cost designs such as Quonset-style houses, which he says can cost under $4,000 each.",
    },
  },
  "Kimberly Tucker": {
    source: {
      label: "Tucker · The other issues",
      url: "https://kimberlyforpdxd3.com/the-other-issues",
      kind: "Candidate statement",
      date: "Website reviewed September 22, 2026",
      note: "Campaign position. Claimed results and numerical premises have not automatically been independently verified.",
    },
    issues: {
      safety:
        "Says police response times are too long; would add armed officers and specialists for non-criminal calls, focus crisis-intervention training on mental health and de-escalation, and publish the police budget in plain language with a cost-benefit analysis.",
    },
  },
  "Tom Sollitt": {
    source: campaign(
      "Sollitt · platform and campaign case studies",
      "https://TomForPDX.com",
    ),
    // Each position below comes from his emailed reply of September 22, 2026.
    issueSources: { housing: sollittEmail, safety: sollittEmail, money: sollittEmail, climate: sollittEmail },
    issues: {
      housing:
        "Would put preserving existing affordable housing first, using current Housing Bureau staff and pressing Metro, the County, Home Forward, state and federal programs, nonprofits and private partners to share costs; would ease adaptive reuse and keep the current relocation-assistance threshold.",
      safety:
        "Would define who answers which calls: police where police authority or a safety threat is involved, Fire and EMS for medical emergencies, Street Response and CHAT for behavioral-health, welfare and non-emergency calls. Counts dispatch, technology and support capacity, not only frontline headcount, as public-safety staffing.",
      money:
        "Before asking for more money, would show existing money is used well: restore the Auditor’s performance-audit capacity in his first budget, have it examine high-risk contracts and programs, and report its recommendations and results quarterly.",
      climate:
        "Would maintain existing streets before committing to new projects until new funding is found, prioritizing maintenance, preservation and safety; would ask the Clean Energy Fund committee whether voter-approved climate money can go further toward transportation and air quality, and restrict projects without a clear public benefit, funding source and measurable outcome.",
    },
  },
  "Kellie Torres": {
    source: campaign(
      "Torres · priorities",
      "https://www.KellieTorresForPortland.com/priorities",
    ),
    issues: {
      housing:
        "Sets a goal of enabling 4,000 homes annually through fewer code barriers, faster permitting and a mix of rental and ownership housing. This is a campaign target, not a forecast.",
      safety:
        "Supports police capacity for investigations, faster emergency responses, public-space maintenance and connecting people in crisis with services.",
      money:
        "Would expand public-private partnerships, philanthropy and sponsorships; proposes a reimagined Tom McCall Waterfront Bowl. Costs and committed funding are not established on the reviewed page.",
      climate:
        "Emphasizes parks, trails, river access and habitat restoration through public and private partnerships.",
    },
  },
  "Jamey Evenstar": {
    source: campaign(
      "Evenstar · six-part platform",
      "https://evenstarforportland.com/platform",
    ),
    issues: {
      housing:
        "Would establish a foundation for permanently affordable social housing and housing stability.",
      safety:
        "Supports expanded unarmed crisis response and stronger state and county mental-health services.",
      money:
        "Favors earlier transparent budgets, participatory budgeting, worker-owned businesses and investment across commercial corridors.",
      climate:
        "Proposes lower-cost transit for people under 25, buses separated from traffic, more southwest transit options and climate resilience focused on vulnerable residents.",
    },
  },
  "Eli Arnold": {
    source: campaign(
      "Arnold · detailed issue platform",
      "https://www.eliforportland.com/issues",
    ),
    issues: {
      housing:
        "Proposes faster filling of subsidized vacancies, stronger screening and pre-placement stabilization, incentives for small builders, and deferring development charges until occupancy or sale.",
      safety:
        "Would add four police-clinician behavioral-health units, increase detective and traffic staffing, and expand neighborhood response teams, coordinated with Street Response.",
      money:
        "Proposes raising the small-business exemption to $150,000 and a three-to-five-year tax holiday for new small businesses. ",
      climate:
        "Supports phased fareless transit and incremental CEI Hub safety improvements, including easier decommissioning of unused petroleum tanks.",
    },
    // His emailed reply of September 20, 2026 adds no issue position; it explains how staffing and transit
    // fit existing revenue and documents two programs, with the reporting he cited listed beside it.
    also: [
      {
        label: "Arnold · emailed response to the Lab’s questions",
        url: "https://www.portlandciviclab.org/voters-guide/research-log#arnold-2026-09-20",
        kind: "Candidate statement",
        date: "Received September 20, 2026",
        note: "Written by the candidate in reply to the Lab’s questions and kept on file; excerpts appear on his brief. Receipt does not verify the claims.",
      },
      {
        label: "The Oregonian · Portland police and FBI target fentanyl dealers",
        url: "https://www.oregonlive.com/crime/2026/08/portland-police-fbi-to-target-fentanyl-dealers-in-public-housing-outside-treatment-clinics.html",
        kind: "Reporting",
        date: "August 2026",
        note: "Cited by the candidate for the downtown fentanyl enforcement partnership he says he developed in 2023.",
      },
      {
        label: "KATU · Federal officials detail a three-year downtown fentanyl crackdown",
        url: "https://katu.com/news/local/feds-detail-3-year-downtown-portland-fentanyl-crackdown-100-charged-100-kg-seized-oregon-portland-dealing-police-bueau-fbi-federal-bureau-of-investigations-us-attorneys-office-special-agent-drugs-trafficking-prosecution",
        kind: "Reporting",
        date: "2026",
        note: "Cited by the candidate for the same partnership; the report describes the crackdown, not his individual role.",
      },
      {
        label: "OPB · Police and drug-treatment providers’ pilot program will continue",
        url: "https://www.opb.org/article/2024/04/10/pilot-program-that-has-police-drug-treatment-providers-work-together-in-portland-will-continue/",
        kind: "Reporting",
        date: "April 10, 2024",
        note: "Cited by the candidate for the Provider Police Joint Connection Program with the Bike Squad and MHAAO.",
      },
    ],
  },
  "Olivia Clark": {
    source: campaign(
      "Clark · priorities",
      "https://www.OliviaforPortland.com/priorities",
    ),
    issues: {
      housing:
        "Would expedite permits, reduce development fees for affordable housing and seek federal resources.",
      safety:
        "Pairs removing street camping and public drug use with more shelter, treatment and sobering capacity. Supports matching 911 calls to EMTs, Street Response or police.",
      climate:
        "Prioritizes water, sewer and street systems able to withstand heat, drought and extreme weather.",
    },
  },
  "Mitch Green": {
    source: campaign(
      "Green · priorities",
      "https://mitch4portland.com/priorities",
    ),
    // His safety position comes from his office's September 16, 2026 statement; the campaign pointed us to it
    // and to his record page on September 22, 2026, after the column had wrongly read "not found".
    issueSources: { safety: greenStatement },
    also: [greenRecordPage, greenPolicy],
    issues: {
      safety:
        "Would protect and expand Portland Street Response, defend unarmed first responders against budget cuts, and protect the Office for Community Police Accountability, pressing for police transparency and accountability.",
      housing:
        "Favors permanently affordable social housing with rents linked to income and tenant unions built into governance.",
      money:
        "Favors public dollars invested in public assets and cooperative ownership. Describes preschool and support for working families as economic development.",
      climate:
        "Would preserve and expand PCEF for clean energy and transit; opposes its use for Moda renovations and additional policing. Supports walkable, transit-oriented neighborhoods and car-free spaces.",
    },
  },
};

export function withCouncilAnalysis(person: Candidate): Candidate {
  const row = rows[person.name];
  if (!row) return person;
  const baseSource =
    person.name === "Darren McCormick"
      ? person.sources.find((s) => s.url.includes("mccormick-darren"))!
      : person.sources[0];
  const extra = supplements[person.name];
  const issues: NonNullable<Candidate["analysis"]>["issues"] = {};
  for (const [key, position] of Object.entries(row[2])) {
    issues[key as keyof Issues] = { position, source: baseSource };
  }
  for (const [key, position] of Object.entries(extra?.issues ?? {})) {
    issues[key as keyof Issues] = { position, source: extra!.issueSources?.[key as keyof Issues] ?? extra!.source };
  }
  if (person.name === "Heart Free Pham") {
    for (const [topic, path] of [
      ["housing", "housing"],
      ["safety", "homelessness"],
      ["money", "economics"],
    ] as const) {
      issues[topic] = {
        position: row[2][topic]!,
        source: person.sources.find(
          (source) => source.url === `https://fightwithheartpdx.com/${path}`,
        )!,
      };
    }
  }
  return {
    ...person,
    sources: extra ? [...person.sources, extra.source, ...Object.values(extra.issueSources ?? {}), ...(extra.also ?? [])] : person.sources,
    analysis: {
      values: row[0],
      tradeoff: row[1],
      issues,
      sources:
        person.name === "Heart Free Pham"
          ? person.sources.filter((s) =>
              s.url.includes("fightwithheartpdx.com"),
            )
          : extra
            ? [baseSource, extra.source]
            : [baseSource],
    },
  };
}
