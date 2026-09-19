import {
  candidate as c,
  electionSource,
  type Candidate,
  type Evidence,
  type Race,
} from "./types";
import { stateRosterUrl } from "./state";

const roster = electionSource(
  "Oregon Secretary of State · qualified 2026 general-election filings",
  stateRosterUrl,
);
const source = (
  url: string,
  label: string,
  date = "Undated campaign page; reviewed September 18, 2026",
): Evidence[] => [{ url, label, date, kind: "Candidate statement" }];
const pending = (name: string, party: string): Candidate => ({
  ...c(
    name,
    "Qualified candidate in the official general-election filings.",
    "A current, attributable policy brief has not yet been completed.",
    [],
    "Party affiliation does not establish this candidate’s personal positions. The missing brief is a research gap.",
    "Which specific laws and budget changes would you prioritize, and how would they be funded?",
    [roster],
    party,
  ),
  missing:
    "Current campaign and interview research remains incomplete. Inclusion in the official field is checked separately from policy evidence.",
});
function race(
  chamber: "Senate" | "House",
  district: number,
  comparison: string,
  candidates: Candidate[],
): Race {
  return {
    id: `oregon-state-${chamber.toLowerCase()}-${district}`,
    title: `Oregon ${chamber} · District ${district}`,
    geography: "Oregon",
    jurisdiction: `Oregon Legislature · ${chamber} district ${district}`,
    seats: 1,
    method: "Vote for one",
    authority:
      "The Legislature adopts state laws, taxes and budgets, including school funding, healthcare, housing rules and transportation. Most legislation needs both chambers and the governor, or a veto override. An individual legislator cannot order a local agency to act.",
    stakes:
      "Housing costs and land use, schools, healthcare, transportation funding, taxes, civil rights and state oversight.",
    comparison,
    rosterSource: roster,
    rosterStatus: "Official list checked",
    candidates,
  };
}
export const legislativeRaces: Race[] = [
  race(
    "Senate",
    13,
    "Neron Misslin emphasizes public investment, tenant protections and family services. Lancaster emphasizes tax restraint, changes to housing rules and stronger enforcement. Nelson’s brief remains open; do not infer his positions from his party.",
    [
      c(
        "Courtney Neron Misslin",
        "Incumbent senator; educator and former state representative.",
        "Connects affordability to childcare, public education, housing stability and healthcare access.",
        [
          "Expand school meals, special-education support and affordable childcare.",
          "Preserve subsidized housing, prevent evictions and fund infrastructure for new homes.",
          "Protect Medicaid and reproductive care; invest in behavioral-health services.",
        ],
        "She favors both new housing and protection of existing affordability, with substantial public investment. Her campaign’s legislative accomplishment claims still need independent outcome review.",
        "Which programs would receive priority if available revenue cannot fund all of these commitments?",
        source(
          "https://www.courtneyfororegon.com/priorities",
          "Neron Misslin · priorities",
        ),
        "Democrat · Working Families",
      ),
      c(
        "Glenn Lancaster",
        "Electrical-engineering entrepreneur and Wilsonville community advocate.",
        "Blames policy choices for rising costs and proposes tax restraint, housing-rule changes and stronger enforcement.",
        [
          "Oppose gas-tax and other tax increases.",
          "Change land-use and housing policies that restrict supply.",
          "Enforce laws and demand measurable results from schools and public programs.",
        ],
        "His program emphasizes reversing government-imposed costs. The reviewed platform does not identify the specific land-use changes or replacement transportation revenue.",
        "Which housing restrictions would you change, and how would roads and services be funded?",
        source("https://glennlancaster.com/issues2/", "Lancaster · priorities"),
        "Republican",
      ),
      pending("Tim E Nelson", "Libertarian"),
    ],
  ),
  race(
    "Senate",
    15,
    "Muñoz emphasizes land-use protections, scrutiny of data centers and investment in working families. Hutchison emphasizes deregulation, academic standards and replacing assessment-based property taxation.",
    [
      c(
        "Myrna A Munoz",
        "Candidate for Senate District 15; campaign uses the name Myrna Muñoz.",
        "Wants stronger environmental safeguards and community input on industrial growth, alongside civil-rights and affordability protections.",
        [
          "Protect working lands and scrutinize data-center impacts.",
          "Strengthen due process and protections against racial profiling.",
          "Expand healthcare and affordable housing while protecting workers’ rights.",
        ],
        "Her economic approach places conditions on growth to protect residents and resources. The reviewed page does not specify a data-center ban or the financing for expanded services.",
        "What enforceable conditions would you require of a new data center, and how would you finance housing and healthcare?",
        source("https://myrnaforsenate.com/issues", "Muñoz · platform"),
        "Democrat · Working Families",
      ),
      c(
        "Harold Hutchison",
        "Retired Forest Grove resident; describes himself as conservative.",
        "Proposes less regulation, higher academic standards and structural changes to taxation and government.",
        [
          "Eliminate assessment-based property taxation.",
          "Pursue term limits and stronger academic standards.",
          "Reduce regulation and strengthen the rule of law and confidence in elections.",
        ],
        "Eliminating this tax basis would require a replacement funding model for affected services. His election-confidence goal does not itself establish a flaw in current elections.",
        "What would replace assessment-based property taxes, and which election changes do you propose?",
        source(
          "https://haroldhutchison.carrd.co/",
          "Hutchison · legislative goals",
        ),
        "Republican",
      ),
    ],
  ),
  race(
    "Senate",
    16,
    "Bangs emphasizes tax restraint, natural-resource industries and local control. Armitage emphasizes economic opportunity and household costs. Finkle emphasizes oversight, care safety and rural preparedness. Compare concrete legislation behind those goals.",
    [
      c(
        "Courtney Bangs",
        "Clatsop County commissioner and educator.",
        "Proposes tax and regulatory restraint, support for natural-resource industries and greater local control over growth.",
        [
          "Oppose new taxes and fees; support predictable timber harvests.",
          "Reduce housing and childcare barriers and improve roads and levees.",
          "Support law enforcement and parental involvement; protect children before birth and support prenatal and adoption services.",
        ],
        "Her approach links public-service funding to resource production and existing revenue. The platform leaves the specific abortion-law changes and cost tradeoffs unstated.",
        "Which regulations would you change, and how would you finance the infrastructure commitments?",
        source(
          "https://www.CourtneyBangs.com/priorities",
          "Bangs · priorities",
        ),
        "Republican",
      ),
      c(
        "Rachel Armitage",
        "Former appointed state senator.",
        "In an April interview, described household prosperity, lower fees and taxes, economic development and expanded housing access as priorities.",
        [
          "Reduce costs borne by constituents.",
          "Support North Coast economic development and housing access.",
        ],
        "This is a dated statement of direction, not a fully costed general-election platform. It does not establish agreement with every policy associated with her party.",
        "Which fees, taxes and housing rules would you change first?",
        [
          {
            label: "Tillamook Headlight Herald · Armitage interview",
            url: "https://bloximages.chicago2.vip.townnews.com/tillamookheadlightherald.com/content/tncms/assets/v3/editorial/b/5e/b5e85786-7bcd-4dfd-8653-96868d0c2f25/69e6cc94c66a0.pdf.pdf",
            kind: "Reporting",
            date: "April 21, 2026",
            note: "Primary-season interview; later campaign commitments require additional review.",
          },
        ],
        "Democrat",
      ),
      c(
        "Melisa Finkle",
        "State-government investigator based in Rockaway Beach.",
        "Describes a campaign centered on direct constituent accountability and oversight of services.",
        [
          "Develop proposals on short- and long-term care safety.",
          "Address rural infrastructure and emergency preparedness.",
        ],
        "Her oversight background helps explain the focus on administration. A claimed independence from campaign networks is not proof of policy independence or effectiveness.",
        "What specific care-safety and preparedness changes would you introduce, and what would they cost?",
        [
          {
            label: "Tillamook County Pioneer · Finkle campaign profile",
            url: "https://www.tillamookcountypioneer.net/independent-candidate-takes-unconventional-path-in-oregon-senate-district-16/",
            kind: "Reporting",
            date: "August 18, 2026",
          },
        ],
        "Independent",
      ),
    ],
  ),
  race(
    "Senate",
    17,
    "Reynolds emphasizes children’s wellbeing, healthcare access and gun-violence prevention. Chee’s current policy brief remains incomplete, so this edition cannot yet establish a fair issue-by-issue contrast.",
    [
      c(
        "Lisa Reynolds",
        "Incumbent senator and Washington County pediatrician.",
        "Frames state policy around reducing child poverty and improving health and opportunity for families.",
        [
          "Reduce child poverty and improve outcomes for families.",
          "Expand healthcare access, especially behavioral-health services.",
          "Prevent gun violence.",
        ],
        "Her medical background informs a prevention-oriented agenda. The overview establishes priorities but does not give a complete next-term budget or legislative plan.",
        "Which child-poverty and healthcare measures would you introduce next, and how would you evaluate them?",
        source(
          "https://www.lisafororegon.com/",
          "Reynolds · current campaign overview",
        ),
        "Democrat",
      ),
      pending("John A N Chee", "Republican"),
    ],
  ),
  race(
    "Senate",
    19,
    "Wagner emphasizes public investment, housing production and rights protections. Dirksen emphasizes lower taxes, spending scrutiny, public safety and parental involvement. Both address affordability through different tools.",
    [
      c(
        "Rob Wagner",
        "Incumbent senator and Senate president.",
        "Supports education and housing investment, reproductive and gender-affirming healthcare, environmental protection and gun-safety laws.",
        [
          "Build more housing through public, private and nonprofit partnerships.",
          "Protect healthcare access, immigrant rights and public-school funding.",
          "Require data centers to cover energy costs and support firearm safe-storage rules.",
        ],
        "He presents continuity in state investment and protections as the response to federal policy and affordability pressures. Campaign claims about enacted results need separate record and outcome checks.",
        "Which investments would you preserve first under tighter revenue, and what housing outcomes would you commit to?",
        source(
          "https://www.robwagnerfororegon.com/priorities/",
          "Wagner · priorities",
        ),
        "Democrat",
      ),
      c(
        "Mary Dirksen",
        "Former state senior policy analyst with budget-committee and volunteer experience.",
        "Proposes tax relief and closer spending oversight alongside stronger public-safety and education standards.",
        [
          "Support law enforcement and stronger consequences for repeat offending.",
          "Reduce wasteful spending and pursue tax relief.",
          "Increase curriculum transparency, parental involvement and foundational learning.",
        ],
        "Her program prioritizes lower burdens and institutional accountability. The reviewed page does not identify the tax changes or program reductions needed to balance the budget.",
        "Which taxes and expenditures would change, and what services would you protect?",
        source("https://www.marydirksen.com", "Dirksen · priorities"),
        "Republican",
      ),
    ],
  ),
  race(
    "Senate",
    20,
    "Both candidates emphasize affordability and public safety. Meek pairs those goals with housing, healthcare and school investment; Stroh emphasizes a conditional no-new-taxes pledge, stronger enforcement and relief for childcare providers.",
    [
      c(
        "Mark Meek",
        "Incumbent senator, business owner and Air Force veteran.",
        "Combines opposition to road tolls with support for housing, treatment, police resources and family services.",
        [
          "Keep tolls off I-205 and lower household costs.",
          "Expand housing, shelter and treatment while supporting law enforcement.",
          "Protect reproductive care and invest in student mental health and career education.",
        ],
        "His platform includes both enforcement and expanded services. His claimed role in past achievements is a campaign account, not an independent attribution of causation.",
        "How would you fund the service commitments and transportation needs while keeping roads toll-free?",
        source("https://votemarkmeek.com", "Meek · priorities"),
        "Democrat",
      ),
      c(
        "Michele Stroh",
        "Oregon City School Board member and childcare-business owner.",
        "Proposes stronger school standards and public safety while withholding support for new taxes until spending is demonstrably accountable.",
        [
          "Support fully staffed police and stronger consequences for repeat offenders.",
          "Reduce regulatory burdens on small businesses and childcare providers.",
          "Strengthen academic standards, curriculum quality and parental involvement.",
        ],
        "Her affordability approach emphasizes lower government burdens. The threshold for considering new taxes, and the services to reduce if revenue is insufficient, remain open questions.",
        "What evidence would satisfy your accountability condition, and which spending would you reduce first?",
        source(
          "https://votestroh.com/",
          "Stroh · priorities and campaign announcement",
        ),
        "Republican",
      ),
    ],
  ),
  race(
    "Senate",
    24,
    "One named candidate appears in the checked filings. Assess priorities, implementation and accountability even without a listed opponent.",
    [
      c(
        "Kayse Jama",
        "Incumbent state senator.",
        "Emphasizes housing investment, childcare access, education equity, climate action and participation in democracy.",
        [
          "Expand housing and childcare opportunities.",
          "Address educational and workforce disparities.",
          "Support campaign-finance reform and access to voting.",
        ],
        "His campaign presents an investment-centered record. Dollar amounts described as housing investment are not, by themselves, evidence of completed homes or reduced homelessness.",
        "Which housing and childcare outcomes would you report, and what policy changes would follow if investments fall short?",
        source(
          "https://www.kaysejama.com/accomplishments",
          "Jama · campaign account of legislative priorities",
        ),
        "Democrat · Working Families",
      ),
    ],
  ),
  race(
    "Senate",
    26,
    "Bassett emphasizes rural services, land-use protection and clean-energy investment. Helfrich emphasizes tax relief, policing and conservative positions on abortion and firearms. Both identify jobs and local economic opportunity as priorities.",
    [
      c(
        "Nicole Bassett",
        "Business founder with experience in sustainable manufacturing and reuse.",
        "Connects rural economic opportunity with land-use protections, healthcare, affordable housing and climate resilience.",
        [
          "Expand vocational training and local jobs; protect rural hospitals.",
          "Uphold farm and forest protections while addressing housing and energy needs.",
          "Invest in wildfire prevention, home protection and a cleaner energy grid.",
        ],
        "She treats environmental protection and economic development as connected. The practical test is how housing growth and energy demand fit within the protections she supports.",
        "Which housing and energy changes would you permit, and how would rural services be funded?",
        source("https://www.bassettfororegon.com/", "Bassett · priorities"),
        "Democrat · Independent · Working Families",
      ),
      c(
        "Jeff Helfrich",
        "State representative, former law-enforcement officer and Air Force veteran.",
        "Supports limited government, tax relief, stronger police funding and conservative positions on abortion and gun rights.",
        [
          "Balance the budget and provide tax relief.",
          "Fund and support law enforcement.",
          "Protect gun rights, oppose abortion and attract employers.",
        ],
        "The platform states broad commitments without specifying the abortion restrictions or spending changes he would seek. Those details matter more than the ideological label.",
        "Which taxes and services would change, and what abortion legislation would you support?",
        source(
          "https://www.helfrichfororegon.com/priorities",
          "Helfrich · priorities",
        ),
        "Republican",
      ),
    ],
  ),
  race(
    "House",
    26,
    "Rieke Smith emphasizes public services and rights protections; Carkin emphasizes business conditions and performance budgeting. Terrio offers a different governing philosophy centered on dignity and criticism of shareholder-first capitalism, with less policy detail in the reviewed material.",
    [
      c(
        "Sue R Rieke Smith",
        "Incumbent representative; former nurse, teacher and superintendent.",
        "Supports stronger public education, housing stability, broader healthcare access and reproductive freedom.",
        [
          "Increase school investment and oppose private-school vouchers.",
          "Expand affordable housing and protect tenants.",
          "Integrate mental-health and addiction treatment, protect abortion and IVF access, and invest in clean energy.",
        ],
        "Her approach relies on public investment and protections for workers and service users. Claims about past graduation improvements require independent review before assigning causation.",
        "How would you finance school, housing and healthcare expansion, and what would you prioritize first?",
        source(
          "https://www.votesueriekesmith.com/",
          "Rieke Smith · campaign priorities",
        ),
        "Democrat · Independent",
      ),
      c(
        "Stephanie Carkin",
        "Business co-owner.",
        "Proposes a more business-friendly regulatory system, performance budgeting and practical infrastructure and workforce investment.",
        [
          "Streamline regulations and permitting for businesses.",
          "Audit underperforming programs and use performance-based budgeting.",
          "Prioritize roads and bridges, classroom resources, apprenticeships and vocational training.",
        ],
        "She seeks a larger tax base through private growth and lower administrative costs. The platform does not quantify the savings or list all regulations to remove.",
        "Which regulations and programs would change first, with what effect on services and state revenue?",
        source("https://www.StephanieForOregon.com/issues", "Carkin · issues"),
        "Republican · Libertarian",
      ),
      c(
        "Steph Terrio",
        "Candidate for House District 26.",
        "Frames politics around human dignity, clearer legislation and resistance to economic and political systems that prioritize private gain.",
        [
          "Write legislation that is precise and understandable.",
          "Evaluate decisions by their effect on constituents’ dignity.",
          "Challenge manipulation by political allies as well as opponents.",
        ],
        "This is primarily a philosophy of representation. The reviewed campaign page does not specify housing, healthcare or tax legislation.",
        "What three state-law changes would put this philosophy into practice, and what would they cost?",
        source("https://www.terrioforus.com/", "Terrio · campaign statement"),
        "Pacific Green · Progressive",
      ),
    ],
  ),
  race(
    "House",
    29,
    "McLain emphasizes public education, infrastructure, civil rights and housing investment. Schimmel’s policy brief remains incomplete, so a full comparative conclusion would be premature.",
    [
      c(
        "Susan McLain",
        "Incumbent representative, former teacher and Metro councilor.",
        "Supports school investment, housing production, public transportation and environmental and reproductive protections.",
        [
          "Invest in schools and pathways to homeownership.",
          "Improve roads, transit and walking and cycling infrastructure; replace the Interstate Bridge.",
          "Protect working lands and prevent data-center energy costs from shifting to residents.",
        ],
        "She combines large infrastructure commitments with conservation and public services. Her platform’s record claims require separate checks; funding and project-cost risks remain central questions.",
        "What would you prioritize in the next transportation package, and how would you limit cost overruns?",
        source(
          "https://www.susanmclain.org/priorities/",
          "McLain · priorities",
        ),
        "Democrat",
      ),
      pending("Brian Schimmel", "Republican · Independent"),
    ],
  ),
  race(
    "House",
    40,
    "Baker and Sugar both oppose tolls and emphasize affordability and public safety. Baker specifies audits, permitting changes and enforcement paired with treatment; Sugar’s reviewed overview emphasizes services, housing and reproductive rights. Hubbell’s brief remains open.",
    [
      c(
        "Adam Baker",
        "Retired police officer and real-estate professional.",
        "Pairs tax restraint and reduced housing barriers with enforcement, treatment and evidence-based program review.",
        [
          "Require efficiency and results before new taxes; oppose I-205 tolls.",
          "Reduce fees and permitting delays and expand starter-home supply.",
          "Support police, recovery programs and mental-health prevention and inpatient care.",
        ],
        "His plan includes additional services as well as cost restraint. Treating people and reducing administrative costs are separate commitments whose budgets need to be reconciled.",
        "Which fees and regulations would you change, and how would treatment and policing commitments be funded?",
        source(
          "https://voteadambaker.com/issues/",
          "Baker · policy commitments",
        ),
        "Republican",
      ),
      c(
        "Michael W Sugar",
        "Teacher, debate coach and union leader.",
        "Emphasizes lower living costs, accessible healthcare, educational opportunity and housing for first-time buyers.",
        [
          "Support toll-free roads and timely transportation projects.",
          "Protect reproductive rights and improve healthcare access.",
          "Expand housing opportunities, support businesses and improve disaster preparedness.",
        ],
        "The reviewed overview includes both tax cuts and stronger services, but does not specify their fiscal balance. It establishes priorities, not a fully costed plan.",
        "Which taxes would you cut, and what would pay for the proposed service and housing improvements?",
        source(
          "https://www.sugarfororegon.com/priorities",
          "Sugar · priorities",
        ),
        "Democrat · Working Families",
      ),
      pending("Pat Hubbell", "Independent"),
    ],
  ),
  race(
    "House",
    51,
    "Mead emphasizes healthcare access, rural opportunity and environmental protection. Bunch emphasizes local development control, policing, tax restraint and parental rights. Compare how each would fund services and accommodate needed housing.",
    [
      c(
        "Darla Mead",
        "Oncology nurse, community advocate and foster parent.",
        "Wants healthcare access less dependent on employment, stronger rural economies and protection of natural resources.",
        [
          "Expand affordable care and separate health-insurance access from employment.",
          "Support career education, housing and lower burdens on small businesses.",
          "Protect watersheds and forests, invest in clean energy and reduce disaster risk.",
        ],
        "Her program combines expanded care with rural economic development. Separating coverage from employment requires a financing and delivery model beyond the general goal.",
        "What healthcare model would you propose, and what taxes or other revenue would finance it?",
        source(
          "https://www.darlameadfororegon.com/",
          "Mead · campaign priorities",
        ),
        "Democrat · Working Families",
      ),
      c(
        "Matt Bunch",
        "Candidate for House District 51.",
        "Prioritizes police support, local control of housing and land use, parental rights and restraint on transportation taxes.",
        [
          "Give law enforcement tools, training and support.",
          "Let local communities shape growth rather than requiring higher density statewide.",
          "Oppose gas, vehicle-fee and payroll-tax increases; prioritize road maintenance.",
        ],
        "Greater local discretion could produce different housing rules across communities. The reviewed platform does not quantify how it would meet housing demand or transportation needs without new revenue.",
        "What housing targets and transportation funding would you support under this approach?",
        source("https://www.mattbunch51.com/issues", "Bunch · issues"),
        "Republican",
      ),
    ],
  ),
  race(
    "House",
    52,
    "A concrete disagreement concerns data centers: Sanders opposes new data centers, while Hege favors local decision-making. Both support more housing and wildfire prevention, but differ on the government tools and fiscal limits they emphasize.",
    [
      c(
        "Hank Sanders",
        "Former reporter and Oregon Senate staff member.",
        "Proposes targeted state programs to lower rural costs and stronger restrictions on data centers.",
        [
          "Oppose new data centers and tax breaks; disclose resource use and benefits.",
          "Create a home-hardening strike team for wildfire prevention.",
          "Offer $5,000 rural childcare-worker tax credits and Medicaid paperwork support.",
        ],
        "His approach uses new programs and targeted credits to tackle specific cost pressures. Proposed savings and effects on insurance prices need evidence and financing estimates.",
        "What would these programs cost, and is your opposition to new data centers permanent or conditional?",
        [
          ...source(
            "https://hankfororegon.com/issues",
            "Sanders · dated policy proposals",
            "January–May 2026; reviewed September 18, 2026",
          ),
          ...source(
            "https://hankfororegon.com/issues/restrictions-on-data-centers",
            "Sanders · no new data centers",
            "May 16, 2026",
          ),
        ],
        "Democrat · Independent",
      ),
      c(
        "Scott C Hege",
        "Wasco County commissioner and former Port of The Dalles executive director.",
        "Emphasizes economic growth, local control of data centers, housing supply and the financial limits of state services.",
        [
          "Oppose a statewide data-center moratorium while improving resource-use transparency.",
          "Examine housing regulations, procurement and construction costs.",
          "Invest in forest treatment and fire response; protect rural care while reviewing sustainable benefits.",
        ],
        "He supports local discretion and cost scrutiny rather than a statewide development pause. His account of data-center benefits is not an independent cost-benefit audit.",
        "Which healthcare benefits and housing rules would you change, and how would communities assess data-center costs?",
        [
          {
            label: "Columbia Community Connection · Hege interview",
            url: "https://columbiacommunityconnection.com/the-dalles/hege-puts-experience-at-center-of-house-district-52-campaign",
            kind: "Reporting",
            date: "September 16, 2026",
          },
        ],
        "Republican",
      ),
    ],
  ),
];
