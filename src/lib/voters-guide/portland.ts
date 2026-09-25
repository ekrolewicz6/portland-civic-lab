import {
  candidate as c,
  electionSource,
  officialSources,
  pamphletSource as p,
  type Candidate,
  type Race,
} from "./types";
const roster = electionSource(
  "Portland certified candidate register",
  officialSources.portland,
);
const statement = (page: number) => [p("multnomah", page)];
const pending = (name: string): Candidate => ({
  ...c(
    name,
    "Qualified candidate on the City’s 2026 register.",
    "A current platform has not yet been substantiated in the sources reviewed for this guide.",
    [],
    "There is not enough reviewed evidence to characterize this candidate’s policy approach.",
    "What are your three specific priorities, how would you fund them, and what results would you report?",
    [roster],
  ),
  missing:
    "No 2026 pamphlet statement found in the reviewed Multnomah pamphlet. Further campaign and interview research is needed. This is a research gap, not evidence that the candidate has no positions.",
});
const d3: Candidate[] = [
  c(
    "Ali Beaudoin",
    "Tax and business consultant; former corporate finance professional and business instructor.",
    "Wants to apply financial and operational discipline to city government, with small-business growth and long-term economic health as priorities.",
    [
      "Assess costs and likely effects before adopting policies.",
      "Eliminate unnecessary spending and measure whether programs meet their goals.",
      "Make it easier to build and operate local businesses.",
    ],
    "Beaudoin’s approach stresses management and economic growth. The reviewed announcement does not yet identify specific spending cuts or changes to business rules.",
    "Which fees would you cut first as revenue grows, and what vacancy rate would show the plan is working?",
    [
      {
        label: "Beaudoin’s campaign announcement and priorities",
        url: "https://www.linkedin.com/posts/ali-beaudoin-75b9558_meet-the-candidates-for-city-council-district-activity-7503657810526846979-aEnb",
        kind: "Candidate statement",
        date: "September 2026; reviewed September 18, 2026",
      },
    ],
  ),
  c(
    "Joel Corcoran",
    "Lawyer; former Council policy counsel and U.S. Senate staff member.",
    "Puts Council procedure, budget discipline and contract oversight at the center of his campaign.",
    [
      "Independent Council legal and budget offices; monthly budget reviews.",
      "Audit contracts and set rules for work performed in-house.",
      "Expand public utility options and support local businesses.",
    ],
    "His program combines institutional reform with explicitly progressive goals. His criticism of partisan conflict should not be read as an absence of political commitments.",
    "Which contract savings and utility changes could Council deliver in its first year?",
    statement(56),
  ),
  c(
    "Guy Frankenstein",
    "Human-rights graduate student; background in auto insurance.",
    "Describes himself as a democratic socialist and calls for confrontational opposition to ICE and large corporations.",
    [
      "Remove ICE agents from Portland.",
      "Seek larger contributions from billion-dollar companies.",
    ],
    "His response calls for challenging ICE and corporate power. It does not establish a lawful city implementation mechanism, a budget or how he would assemble support for legislation.",
    "What specific city legislation would implement these goals?",
    [
      {
        label: "Mercury questionnaire · Frankenstein’s responses",
        url: "https://www.portlandmercury.com/news/meet-the-candidates-for-city-council-district-3/",
        kind: "Candidate statement",
        date: "September 9, 2026",
        note: "Candidate responses within reporting; the publisher’s characterizations are not adopted as facts.",
      },
    ],
  ),
  c(
    "Matthias Hallett",
    "Estate-planning attorney; former deputy probate clerk.",
    "Argues that police staffing, faster permitting and a more competitive business tax structure are prerequisites for Portland’s recovery.",
    [
      "Fund police recruitment, retention and neighborhood presence.",
      "Set permitting deadlines with escalation for stalled applications.",
      "Recruit manufacturing and other employers that sell outside the region.",
    ],
    "He emphasizes rebuilding the tax base through private investment and stronger policing. The statement does not cost the proposed staffing or tax changes.",
    "Which taxes would change, and how would police expansion be funded during the transition?",
    statement(58),
  ),
  c(
    "Patrick Hilton",
    "Building operations manager with architectural-design and parks experience.",
    "Wants housing policy to protect existing buildings, neighborhood businesses and tenants while creating paths to ownership.",
    [
      "Prioritize adaptive reuse, community land trusts and co-housing.",
      "Expand safe-sleeping infrastructure and consistent public-space rules.",
      "Tax vacant units and polluters; redirect consultant spending.",
    ],
    "His housing approach favors preservation and community ownership. Readers should distinguish its anti-displacement goals from the separate question of how many additional homes it would produce.",
    "How many homes would the preservation and ownership programs create, and on what timeline?",
    statement(57),
  ),
  c(
    "Larry Kelly",
    "Chef with a biochemistry degree; no prior governmental experience listed.",
    "Connects housing affordability, mental-health services and small-business support.",
    [
      "Expand housing options and remove unnecessary barriers.",
      "Support Street Response, addiction treatment and permanent housing.",
      "Make local government easier for small businesses to work with.",
    ],
    "He favors both more housing and a service-centered homelessness response. His statement sets a direction but leaves spending and enforcement details open.",
    "Which housing barriers would you remove first, and what services would you fund?",
    statement(54),
  ),
  c(
    "Tiffany Koyama Lane",
    "Incumbent councilor; former public-school teacher and union organizer.",
    "Identifies as a democratic socialist and emphasizes workers, renters, immigrant protections and public participation.",
    [
      "Continue support for rental assistance and social housing.",
      "Protect immigrant and LGBTQIA+ families and improve street safety.",
      "Demand public oversight of oil infrastructure, data centers and the Moda deal.",
    ],
    "Her approach uses public investment and regulation to protect residents from economic and environmental risks. Her pamphlet’s accomplishment list is a campaign account, not an independent evaluation.",
    "What recurring revenue would sustain housing and service commitments?",
    statement(54),
  ),
  c(
    "Kenneth (Kent) R Landgraver III",
    "Scientific instrument technician and Oregon National Guard veteran.",
    "Centers his campaign on consensus, public-service experience and making the new Council work as a legislature.",
    [
      "Seek unanimous decisions through consensus or compromise.",
      "Ensure tax dollars support public work.",
      "Resist recreating the former commission system.",
    ],
    "This is principally a theory of governing. Unanimity is his preference; it is not a legal requirement for Council action.",
    "How would you resolve an urgent decision when unanimity is impossible?",
    statement(60),
  ),
  c(
    "Keir Legree",
    "Longtime art-glass business general manager and business founder.",
    "Applies a business-management approach to homelessness, public safety and utility costs.",
    [
      "Hire more police officers and 911 dispatchers.",
      "Reduce infrastructure-project costs and utility bills.",
      "Change the approach to street homelessness.",
    ],
    "He stresses operational execution and costs. The reviewed statement does not describe the homelessness plan or a financed utility-rate reduction in detail.",
    "Holding the line on new taxes and fees, what would pay for more police officers and 911 dispatchers?",
    statement(59),
  ),
  c(
    "Esther León",
    "Physical therapist and community-college professor.",
    "Proposes a larger public role in housing, utilities, climate protection and non-police crisis response.",
    [
      "A corporate-landlord vacancy tax, social housing and simpler zoning.",
      "24-hour citywide Street Response and supportive housing with treatment.",
      "A moratorium on AI data centers and a transition to public utilities.",
    ],
    "Her program is a substantial expansion of public provision, financed partly through new taxes. Some proposals require cooperation from agencies outside Council’s control.",
    "What would the housing and utility proposals cost, and which require state or regional approval?",
    statement(60),
  ),
  pending("Darren McCormick"),
  c(
    "Angelita Morillo",
    "Incumbent councilor; former anti-hunger policy advocate.",
    "Identifies as a democratic socialist and puts tenants, transit, climate and civil liberties at the center of her platform.",
    [
      "Strengthen tenant rights and create shelters with unhoused residents.",
      "Invest in transit, bike lanes and sidewalks; oppose oil-train and data-center expansion.",
      "Support Street Response, violence prevention and police accountability.",
    ],
    "She emphasizes public investment and restraints on institutional power. Her opposition to a particular funding agreement should be read in the context of that agreement, not as opposition to the service itself.",
    "How would you finance service expansion while controlling household bills?",
    statement(56),
  ),
  c(
    "Steve Novick",
    "Incumbent councilor; former city commissioner and government environmental lawyer.",
    "Combines progressive policy goals with cost scrutiny and support for some enforcement measures.",
    [
      "Reduce Council office spending and shift welfare checks to unarmed responders.",
      "Use red-flag gun laws and preserve hazardous-camp removal funding.",
      "Scrutinize the Moda agreement and remove minor business regulations.",
    ],
    "He does not fit a simple services-versus-enforcement split: his stated program contains both, with an emphasis on lower-cost delivery.",
    "What evidence would determine when an unarmed response or camp removal is appropriate?",
    statement(57),
  ),
  c(
    "Cristal Otero",
    "Social-work and government-administration professional with homeless-services experience.",
    "Focuses on the household cost of government decisions and housing stability for people with disabilities.",
    [
      "Evaluate borrowing and infrastructure by their effect on monthly bills.",
      "Develop stable housing for people with intellectual disabilities and brain injuries.",
      "Keep PCEF spending tied to climate and support labor standards.",
    ],
    "Her affordability argument includes utility financing, not just rent. Proposed transitions to resident ownership would need a financing and management model.",
    "Which partner would fund the ongoing subsidy for co-op households at 0–30% of area median income, and when would a first building convert?",
    statement(59),
  ),
  c(
    "Terry Parker",
    "Retired customer-relations professional and longtime transportation participant.",
    "Prioritizes maintaining existing infrastructure, police and fire staffing, and a stronger voice for drivers.",
    [
      "Maintain streets and parks before undertaking new projects.",
      "Oppose business-access-and-transit lanes on 82nd Avenue.",
      "Fund police and fire staffing and long-term support for unhoused people.",
    ],
    "His transportation priorities differ from candidates favoring more dedicated transit space. His predicted traffic impacts are campaign assertions, not findings established here.",
    "What alternative would improve transit reliability and safety on 82nd Avenue?",
    statement(55),
  ),
  pending("Heart Free Pham"),
  c(
    "Tom Sollitt",
    "Branding, marketing and events professional.",
    "Wants dependable basic services and a Council that makes bureaus and contractors follow through.",
    [
      "Improve permit processing, maintenance and responsiveness.",
      "Invest in gathering places, local businesses and neighborhoods.",
      "Use Council oversight to coordinate service delivery.",
    ],
    "He makes reliability the test of government. The statement offers a governing approach more than a detailed spending plan.",
    "If the street repair fee ends, what would pay for street maintenance until other revenue is found?",
    statement(53),
  ),
  c(
    "John Sweeney",
    "Mechanical designer; 33 years with Portland Parks; Army Guard and Reserve captain.",
    "Prioritizes preserving city services, changing homelessness funding arrangements and opposing spending to retain the Trail Blazers.",
    [
      "Preserve services during declining revenue.",
      "Have the County take primary responsibility for homelessness services.",
      "Oppose spending aimed at keeping the Blazers in Portland.",
    ],
    "He would redirect resources away from arena support and revisit city-county funding. His prediction that the team will leave is not an established fact.",
    "Which agreement among the City, the County and Metro would move homeless services and their funding, and on what timeline?",
    statement(53),
  ),
  c(
    "Kellie Torres",
    "Portland Parks external-affairs manager and former commissioner’s chief of staff.",
    "Emphasizes public-service experience, partnerships and protection of core services.",
    [
      "Protect services and require accountability for spending.",
      "Support small businesses and safe, connected neighborhoods.",
      "Defend immigrant families and civil rights.",
    ],
    "She argues that administrative experience will improve delivery. Her statement gives fewer specific budget tradeoffs than some competing platforms.",
    "Which services would receive priority if revenue falls short?",
    statement(58),
  ),
  c(
    "Kimberly Tucker",
    "Behavior analyst and mental-health volunteer.",
    "Emphasizes program accountability, constituents’ needs and stronger cost-benefit analysis of city spending.",
    [
      "Examine why programs receive or lose funding.",
      "Evaluate whether spending decisions are adequately supported.",
    ],
    "The reviewed response explains a decision-making standard more than a legislative agenda. It does not name specific programs to expand or cut.",
    "Which programs would you evaluate first, and what evidence would change your funding decision?",
    [
      {
        label: "Mercury questionnaire · Tucker’s responses",
        url: "https://www.portlandmercury.com/news/meet-the-candidates-for-city-council-district-3/",
        kind: "Candidate statement",
        date: "September 9, 2026",
        note: "Candidate responses within reporting; the publisher’s campaign assessment is not adopted.",
      },
    ],
  ),
  c(
    "Martin Ward",
    "Candidate with a political-science master’s degree; no governmental experience listed.",
    "Combines public housing and large proposed spending cuts with opposition to abortion, gender-related surgery and same-sex relationships.",
    [
      "Test government-owned housing and build permanent shelter.",
      "Reject Moda renovations and the proposed Lloyd Center demolition.",
      "Pursue restrictions on several forms of reproductive care and sexual conduct.",
    ],
    "His statement places consensual adult relationships alongside crimes under a sex-crime heading. That is his framing, not this guide’s. Council also lacks unilateral authority over several proposals, including school curricula and state health policy.",
    "What legally available city actions would implement these proposals, and what supports the claimed savings?",
    statement(55),
  ),
];
const d4: Candidate[] = [
  c(
    "Timothy (TJ) Anderson",
    "Student and disability advocate with county advisory and budget-committee experience.",
    "Runs on listening, lived experience of homelessness and disability, and practical public service.",
    [
      "Bring community and budget-committee experience to Council.",
      "Listen across neighborhood and political differences.",
      "Focus on whether city institutions work for residents.",
    ],
    "The reviewed statement is primarily biographical. It does not establish specific positions on major budget, housing or policing decisions.",
    "How would the $5 million audit be funded, and what would its findings change first?",
    statement(65),
  ),
  c(
    "Eli Arnold",
    "Portland bicycle police officer and military veteran.",
    "Pairs stronger frontline safety services with a no-new-taxes pledge and support for fareless transit.",
    [
      "Prioritize police, fire, dispatch and behavioral-health staffing.",
      "Move people from tents into housing, shelter and services.",
      "Use existing clean-energy resources toward fareless transit.",
    ],
    "His safety approach includes both law enforcement and behavioral health. Fareless transit would require regional cooperation and an eligible, durable funding source.",
    "How would expanded staffing and transit commitments fit within existing revenue?",
    statement(65),
  ),
  c(
    "Olivia Clark",
    "Incumbent councilor; former TriMet public-affairs director and gubernatorial policy adviser.",
    "Emphasizes public safety, infrastructure maintenance, business recovery and removing barriers to housing.",
    [
      "Improve 911 response and end street camping and open-air drug use.",
      "Protect police and fire funding and support local businesses.",
      "Maintain public assets and improve sidewalks and pavement.",
    ],
    "Her platform gives enforcement and basic infrastructure a prominent role. Ending camping is a goal; the implementation and available placements matter.",
    "What shelter and treatment capacity would make the camping policy workable?",
    statement(62),
  ),
  c(
    "Jayne Cronlund",
    "Small-business owner and former conservation nonprofit executive.",
    "Emphasizes collaboration, living-wage jobs and shared public spaces.",
    [
      "Support jobs in Portland’s creative and sustainable economy.",
      "Invest in parks, trails, natural areas and business districts.",
      "Set shared government goals and regularly report results.",
    ],
    "Her statement focuses on coalition-building and common assets. It leaves major housing, safety and revenue decisions less specified.",
    "How would the parks maintenance backlog shrink 35% without new taxes, and over what period?",
    statement(63),
  ),
  c(
    "Jamey Evenstar",
    "City Council chief of staff, policy director and analyst; renter and transit rider.",
    "Argues for progressive leadership grounded in housing stability and more accessible transportation.",
    [
      "Build on work on tenant protections and housing access.",
      "Make buses faster and easier to use.",
      "Defend residents against federal overreach and concentrated financial influence.",
    ],
    "Evenstar’s case rests on policy and implementation experience inside City Hall. The platform connects social housing, transit affordability and public participation, while leaving a complete funding plan open.",
    "Which tenant protections and bus improvements would you introduce first?",
    statement(64),
  ),
  pending("John J Goldsmith"),
  c(
    "Mitch Green",
    "Incumbent councilor; economist, Army veteran and former Bonneville Power Administration employee.",
    "Identifies as a democratic socialist and proposes permanent affordability, tenant power and climate investment.",
    [
      "Expand permanently affordable housing and tenant collective bargaining.",
      "Require greater contributions from large corporations.",
      "Protect climate funding and reduce fossil-fuel activity at the CEI Hub.",
    ],
    "His approach treats affordability as a question of ownership and bargaining power as well as supply. Revenue and legal authority are central implementation questions.",
    "Which corporate-revenue tools are legally available to Council, and how would they fund permanent housing?",
    statement(62),
  ),
  c(
    "Josh Leake",
    "Housing-finance professional, business owner and Portland Film Festival founder.",
    "Connects housing development and economic recovery with enforcement and behavioral-health services.",
    [
      "Combine public, private and federal resources to build housing.",
      "Address crime and disorder while treating unhoused people with dignity.",
      "Support the creative and technology economies and activate public spaces.",
    ],
    "He emphasizes financing and development experience. Housing totals and funding sources need project-level evidence before they can be treated as deliverable commitments.",
    "Which sites and financing commitments would produce homes in the first term?",
    statement(66),
  ),
  c(
    "John McDonald",
    "TriMet hydro technician and journalist.",
    "Supports major civic projects while calling for closer scrutiny of budgets and homelessness contracts.",
    [
      "Modernize Moda Center and retain the Trail Blazers.",
      "Keep the Interstate Bridge Replacement moving.",
      "Limit new homelessness contracts and scrutinize existing providers.",
    ],
    "He is more explicitly supportive of large capital projects than candidates seeking to reject or narrow them. Oversight proposals need to be weighed alongside those commitments.",
    "What maximum public exposure would you accept in the arena and bridge projects?",
    statement(63),
  ),
  c(
    "Matt Schulte",
    "Musician, filmmaker and business founder.",
    "Proposes using vacant downtown buildings as energy infrastructure and improving navigation of social services.",
    [
      "Develop the Grid-Connected Core with downtown building owners.",
      "Connect volunteers and professionals through a ReBoot service-navigation program.",
      "Use existing buildings and electrical capacity to attract activity.",
    ],
    "His program is unusually focused on two initiatives. Their technical feasibility, ownership arrangements and costs remain to be demonstrated.",
    "If combined City costs outpace incomes under your Affordability Rule, which increases would Council cut or delay first?",
    statement(61),
  ),
  c(
    "Jeremy Beausoleil Smith",
    "PSU capital-projects and construction manager.",
    "Proposes social housing, stronger tenant protections and a city Green New Deal.",
    [
      "A renters’ bill of rights and more housing linked to treatment.",
      "Protect PCEF, improve walking and cycling, and address CEI Hub risks.",
      "A four-year AI data-center ban and expanded Street Response.",
    ],
    "His program uses public construction and regulation to pursue housing and climate goals together. Those proposals require both capital and ongoing operating funds.",
    "How would you fund and maintain the proposed housing and infrastructure?",
    statement(61),
  ),
  c(
    "Eric Zimmerman",
    "Incumbent councilor, National Guard officer and former county commissioner’s chief of staff.",
    "Combines support for housing production, policing, Street Response and camp cleanups with opposition to several tax increases.",
    [
      "Protect police and fire while supporting Street Response.",
      "Build housing and restrain tax and fee increases.",
      "Combine shelter, enforcement, cleanups and treatment; restore maintenance.",
    ],
    "His stated approach combines services with enforcement rather than choosing only one. The budget question is how to maintain that package under constrained revenue.",
    "Which spending would you reduce if existing revenue cannot sustain those services?",
    statement(64),
  ),
];
const base = {
  geography: "Portland" as const,
  jurisdiction: "City of Portland",
  authority:
    "Council adopts city laws and the budget. The mayor and city administrator run operations. Council cannot independently set TriMet fares, school curricula or state law.",
  stakes:
    "Housing rules, the city budget, streets, public safety, utilities, climate investment and oversight of major contracts.",
  rosterSource: roster,
  rosterStatus: "Official list checked" as const,
};
export const portlandRaces: Race[] = [
  {
    ...base,
    id: "portland-district-3",
    title: "Portland Council · District 3",
    seats: 3,
    method: "Ranked choice · three seats",
    comparison:
      "Compare how candidates would balance housing construction and tenant protections, police and unarmed response, and service commitments against taxes and utility bills. Candidates appear alphabetically; this is not a ranking.",
    candidates: d3,
  },
  {
    ...base,
    id: "portland-district-4",
    title: "Portland Council · District 4",
    seats: 3,
    method: "Ranked choice · three seats",
    comparison:
      "A central disagreement is how to fund recovery: public housing and new corporate contributions, or private development and restraint on taxes. Candidates also differ on camp enforcement and public investment in Moda Center.",
    candidates: d4,
  },
  {
    ...base,
    id: "portland-auditor",
    title: "Portland City Auditor",
    seats: 1,
    method: "Ranked choice · one seat",
    authority:
      "The auditor independently examines city performance and administers functions including city elections. The office does not run city bureaus.",
    stakes:
      "Independent oversight of public money, performance and the new form of city government.",
    comparison:
      "One named candidate appears on the checked register. Assess audit priorities and follow-through even in an uncontested race.",
    candidates: [
      c(
        "Simone Rede",
        "Incumbent city auditor; government performance auditor.",
        "Emphasizes independent oversight, service outcomes and the effective use of tax dollars.",
        [
          "Scrutinize emergency-response performance and climate commitments.",
          "Track public-asset maintenance and arts spending.",
          "Apply professional auditing standards independently.",
        ],
        "Audits can identify problems and track recommendations; they do not themselves implement bureau fixes.",
        "Which unresolved audit recommendations would you prioritize in the next term?",
        statement(52),
      ),
    ],
  },
];

// One identical final-action question for all six incumbents; amendments are not
// substituted for the final vote. Checked against the official City record.
const modaVotes: Record<string, "Yes" | "No"> = {
  "Tiffany Koyama Lane": "No",
  "Angelita Morillo": "No",
  "Steve Novick": "Yes",
  "Mitch Green": "No",
  "Olivia Clark": "Yes",
  "Eric Zimmerman": "Yes",
};
const councilProfiles: Record<string, string> = {
  "Tiffany Koyama Lane": "6d6f522f-151f-4b25-af01-2534c9f65e2e",
  "Angelita Morillo": "7a321a0f-2652-4647-870f-e94a043ba75e",
  "Steve Novick": "987661d0-41ab-4aa0-bdf1-3b098917ecbd",
  "Mitch Green": "bd183feb-4b31-4730-9e7b-26557462c272",
  "Olivia Clark": "a7c2738a-c555-4c8d-afe1-1489db738764",
  "Eric Zimmerman": "2d6e841b-f6c8-4979-a044-dfe8c3e98496",
};
for (const person of [...d3, ...d4]) {
  const vote = modaVotes[person.name];
  if (!vote) continue;
  person.record = [
    {
      text: `Voted ${vote.toLowerCase()} on the amended, non-binding Moda Center term sheet on August 12, 2026. Resolution 37750 passed 8–4. This authorized a negotiating framework, not a final construction contract; the vote alone does not establish the councilor’s motive.`,
      source: {
        label: "Resolution 37750 · final roll call and amendment history",
        url: "https://www.portland.gov/council/documents/resolution/adopted/37750",
        kind: "Public record",
        date: "August 12, 2026",
      },
    },
  ];
  person.sources.push({
    label: "Council Lab · current-term record and official-source links",
    url: `https://council.portlandciviclab.org/people/${councilProfiles[person.name]}`,
    kind: "Reporting",
    date: "Current-term research index",
    note: "Independent, unofficial research aid. Follow the linked City records for authoritative votes. Automated transcript excerpts require recording verification before quotation.",
  });
}

// Current filings establish identity/background; historical answers are never
// silently presented as a renewed 2026 platform.
const mccormick = d3.find((person) => person.name === "Darren McCormick")!;
mccormick.background =
  "His public professional profile lists Portland Witness reporting and policy-research projects; Braver Angels lists him as an organizer of Portland discussion gatherings.";
mccormick.summary =
  "His July 2026 filing calls for more police and incarceration of people he describes as dangerous and affected by drugs. He writes: “More cops. Lock up the dangerously unstable drug zombies.” That is his language, not this guide’s description of people.";
mccormick.interpretation =
  "This is a clear preference for an enforcement-led response. The brief filing does not explain which conduct would trigger detention, what legal process would apply, or how treatment would fit into the approach.";
mccormick.question =
  "What specific offenses and legal standards would your proposal address, how many officers would you fund, and what would it cost?";
mccormick.missing =
  "A limited policy statement is verified in the 2026 filing. A broader platform, funding detail and independent record review remain incomplete.";
mccormick.sources.push({
  label: "2026 candidate filing · policy language on PDF page 4",
  url: "https://www.portland.gov/auditor/elections/documents/mccormick-darren-2026-aud-120/download#page=4",
  kind: "Candidate statement",
  date: "Filed July 2026; reviewed September 18, 2026",
});
const pham = d3.find((person) => person.name === "Heart Free Pham")!;
pham.background =
  "Lists his current work as a Willamette University campus safety officer and previous work as a teacher in his 2026 filing.";
pham.sources.push({
  label: "2026 candidate filing · background on PDF page 4",
  url: "https://www.portland.gov/auditor/elections/documents/pham-heart-free-2026-aud-120-original/download#page=4",
  kind: "Candidate statement",
  date: "August 17, 2026",
});
pham.record = [
  {
    text: "In his 2024 OPB/Oregonian questionnaire, Pham opposed using $25 million in PCEF funds for electric city vehicles and advocated ending the Small Donor Elections program. These are historical, self-reported positions; this guide has not established whether he renews them in 2026.",
    source: {
      label: "Pham’s 2024 questionnaire · historical campaign answers",
      url: "https://www.opb.org/article/2024/10/07/portland-oregon-city-council-district-3-politics-elections/",
      kind: "Candidate statement",
      date: "October 7, 2024",
    },
  },
];
pham.summary =
  "Combines treatment and civil-commitment reform with consequences for refusing available services. Calls for measuring program results and assessing fiscal risks before raising taxes, and promotes hemp-based housing construction.";
pham.priorities = [
  "Oppose criminalizing homelessness itself while supporting consequences for refusal of available services and wellness farms with job training.",
  "Require public outcome measures and cost-benefit accounting before expanding programs or taxes.",
  "Promote hempblock construction and respond to property crime affecting small businesses.",
];
pham.interpretation =
  "His platform combines support with requirements to accept help and skepticism about current spending. The consequences he proposes and the legal process for imposing them need clarification; his construction and fiscal claims are not independently verified here.";
pham.question =
  "What consequences would follow service refusal, who would determine that an appropriate service was available, and which government has authority to act?";
delete pham.missing;
for (const [path, label] of [
  ["homelessness", "Homelessness and recovery"],
  ["economics", "Tax base and spending"],
  ["housing", "Housing construction"],
  ["public-safety", "Public safety"],
])
  pham.sources.push({
    label: `Pham · ${label}`,
    url: `https://fightwithheartpdx.com/${path}`,
    kind: "Candidate statement",
    date: "Current campaign website reviewed September 18, 2026",
    note: "Read from the rendered issue page. Policy commitments are attributed; economic, crime and construction claims have not been independently established by this guide.",
  });
const goldsmith = d4.find((person) => person.name === "John J Goldsmith")!;
goldsmith.background =
  "His amended 2026 filing lists work as a unionized security officer, earlier Justice Department analysis work, and volunteer gardening and LGBT memorial advocacy.";
goldsmith.sources.push({
  label: "Amended 2026 candidate filing · background on PDF pages 4–5",
  url: "https://www.portland.gov/auditor/elections/documents/goldsmith-john-2026-aud-120-amendment-redacted/download#page=4",
  kind: "Candidate statement",
  date: "August 24, 2026",
});

mccormick.sources.push(
  {
    label: "Public professional profile · projects and experience",
    url: "https://www.linkedin.com/in/darren-mccormick-esq",
    kind: "Candidate statement",
    date: "Reviewed September 18, 2026",
  },
  {
    label: "Braver Angels · Portland discussion event and organizers",
    url: "https://braverangels.org/event/monthly-pdx-depolarization-gathering-3-2/2026-07-08/",
    kind: "Reporting",
    date: "July 8, 2026",
    note: "Event organizer’s listing, used for civic background only.",
  },
);
