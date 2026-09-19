import {
  candidate as c,
  electionSource,
  type Candidate,
  type Evidence,
  type Race,
} from "./types";

export const stateRosterUrl =
  "https://secure.sos.state.or.us/orestar/cfFilings.do?cfSearchButtonName=currentElection";
const roster = electionSource(
  "Oregon Secretary of State · qualified 2026 general-election filings",
  stateRosterUrl,
);
const campaign = (
  label: string,
  url: string,
  date = "Undated page; reviewed September 18, 2026",
): Evidence => ({ label, url, kind: "Candidate statement", date });
const pending = (name: string, party: string, note: string): Candidate => ({
  ...c(
    name,
    "Qualified candidate in the Secretary of State’s filing records.",
    "A sufficiently current, attributable policy brief has not yet been completed.",
    [],
    "The research gap does not establish that the candidate has no positions. Party affiliation is not a substitute for their own statements.",
    "What are your three proposed changes, their costs, and the legislation needed to implement them?",
    [roster],
    party,
  ),
  missing: note,
});
const federalAuthority =
  "Congress writes federal law, approves spending and oversees the executive branch. A representative needs support from colleagues; most legislation also needs Senate approval and the president’s signature, or a veto override.";
function race(
  id: string,
  title: string,
  jurisdiction: string,
  authority: string,
  stakes: string,
  comparison: string,
  candidates: Candidate[],
): Race {
  return {
    id,
    title,
    jurisdiction,
    authority,
    stakes,
    comparison,
    candidates,
    geography: "Oregon",
    seats: 1,
    method: "Vote for one",
    rosterSource: roster,
    rosterStatus: "Official list checked",
  };
}
const houseVote: Evidence = {
  label: "House Clerk · roll call 190, final House action on H.R. 1",
  url: "https://clerk.house.gov/Votes/2025190",
  kind: "Public record",
  date: "July 3, 2025",
};
function incumbent(person: Candidate, vote: "Aye" | "No"): Candidate {
  return {
    ...person,
    record: [
      {
        text: `Voted ${vote} on the final House motion accepting the Senate’s H.R. 1 amendment, July 3, 2025. It passed 218–214. This records a vote on the entire package, not a separate vote on each provision.`,
        source: houseVote,
      },
    ],
  };
}

export const stateRaces: Race[] = [
  race(
    "oregon-governor",
    "Governor of Oregon",
    "Statewide · four-year term",
    "The governor directs state agencies, proposes a budget and can sign or veto legislation. The Legislature controls appropriations and changes to state law. Federal policy is outside the governor’s unilateral control.",
    "Housing production, schools, childcare, public services, taxes, energy and the state’s relationship with the federal government.",
    "Compare the mechanisms as well as the goals: Kotek proposes expanded services and new data-center standards; Drazan proposes tax and regulatory changes and stricter service accountability; Smith emphasizes limits on participation in unauthorized wars.",
    [
      c(
        "Tina Kotek",
        "Incumbent governor; former Oregon House speaker.",
        "Her September 2026 platform proposes expanded childcare and housing access, more classroom time, and economic development organized around existing businesses and emerging industries.",
        [
          "Develop a path toward universal preschool and expand infant and toddler care.",
          "Pause new data-center development until statewide standards protect ratepayers and require clean energy and union jobs.",
          "Increase instructional time and support renters and first-time buyers.",
        ],
        "This is an agenda for expanding public capacity while setting new conditions on development. The size, timetable and financing of the commitments are essential to assessing feasibility.",
        "How would the next budget pay for childcare and school expansion, and what would be reduced or taxed to do so?",
        [
          campaign(
            "Kotek · second-term platform",
            "https://www.tinafororegon.com/oregons-future/",
            "Released September 17, 2026; reviewed September 18",
          ),
        ],
        "Democrat · Working Families",
      ),
      c(
        "Christine Drazan",
        "State senator; former House Republican leader.",
        "Her plan connects affordability to lower taxes and regulatory costs, faster construction and stronger expectations for schools and publicly funded services.",
        [
          "Veto new taxes and fees; reform business and estate taxes and repeal the Climate Protection Program.",
          "Set a 120-day housing-permit limit and permit private plan review.",
          "Audit homelessness spending, expand treatment and recovery, and restore graduation standards.",
        ],
        "She proposes reducing government-imposed costs and tightening performance requirements. Those changes would affect revenue, environmental safeguards and service delivery; projected savings need evidence.",
        "Which services would you reduce if tax changes lower revenue, and how would you evaluate faster permitting and treatment outcomes?",
        [
          campaign(
            "Drazan · policy plan",
            "https://www.christinefororegon.com/drazan-plan/",
          ),
        ],
        "Republican · Libertarian",
      ),
      c(
        "Brett Smith",
        "Welder and inventor; previous congressional candidate.",
        "In an August 2026 interview, Smith makes opposition to undeclared wars and two-party governance central to his candidacy.",
        [
          "Propose a state constitutional amendment protecting residents from drafts for wars without congressional authorization.",
          "Strengthen civilian emergency preparedness.",
          "Oppose Oregon ports handling weapons for wars lacking congressional authorization.",
        ],
        "His proposals use state institutions to challenge federal war policy. Their legal reach and enforceability would require close examination; a campaign proposal alone does not establish state authority over federal decisions.",
        "How would these proposals operate within federal law, and what are your detailed housing, education and budget plans?",
        [
          campaign(
            "KEPW · interview with Brett Smith",
            "https://kepw-wholecommunity.news/2026/08/07/meet-the-candidate-brett-smith-for-oregon-governor/",
            "August 2026",
          ),
        ],
        "Pacific Green",
      ),
    ],
  ),
  race(
    "oregon-us-senate",
    "U.S. Senate · Oregon",
    "Statewide · six-year term",
    `${federalAuthority} Senators also vote on federal judges, executive appointments and treaties.`,
    "Federal taxes and spending, health coverage, climate and energy, immigration, labor rights and oversight.",
    "Merkley favors expanded federal social guarantees and climate action. Smith emphasizes spending restraint, public safety and resource industries. Research on Dye and Henry remains incomplete; do not treat that gap as agreement with either major-party candidate.",
    [
      c(
        "Jeff Merkley",
        "Incumbent U.S. senator; former Oregon House speaker.",
        "Supports expanded public guarantees for healthcare and education, stronger labor rights, climate investment and changes to election and campaign-finance rules.",
        [
          "Support Medicare for All and lower prescription prices.",
          "Move toward fully renewable energy and a Green New Deal.",
          "Expand voting access, reduce undisclosed political spending and protect organizing rights.",
        ],
        "He favors a larger federal role in providing services and constraining corporate power. Broad goals still require financing choices and a path through Congress.",
        "Which commitments could advance under the next Senate’s rules and majority, and how would you finance them?",
        [campaign("Merkley · issues", "https://www.jeffmerkley.com/issues/")],
        "Democrat · Working Families",
      ),
      c(
        "David Brock Smith",
        "Oregon state senator with business and local-government experience.",
        "Emphasizes lower spending and taxes, support for police and rural industries, and treatment paired with accountability for public disorder.",
        [
          "Oppose new taxes and reduce wasteful spending.",
          "Support active forest management, timber employment and wildfire-risk reduction.",
          "Expand treatment and recovery while opposing street camping.",
        ],
        "The program links economic growth to lower government burdens and more resource production. Local homelessness enforcement and federal funding involve different authorities and should be evaluated separately.",
        "Which federal programs would you reduce, and what would your forest and treatment proposals cost?",
        [
          campaign(
            "David Brock Smith · issues",
            "https://www.davidbrocksmithfororegon.com/issues",
          ),
        ],
        "Republican",
      ),
      pending(
        "Gary Lyndon Dye",
        "Libertarian",
        "The website listed in his 2026 filing is branded for the 2020 campaign. Its positions need current confirmation before being presented as a 2026 platform.",
      ),
      pending(
        "Chris Henry",
        "Pacific Green · Progressive",
        "The website listed in the official filing could not be reached during review. Current attributable policy research remains open.",
      ),
    ],
  ),
  race(
    "oregon-house-1",
    "U.S. House · District 1",
    "Oregon congressional district 1 · two-year term",
    federalAuthority,
    "Healthcare, education, housing affordability and the federal role in local economic development.",
    "Bonamici emphasizes public investment and rights protections; Kahl emphasizes business costs, school choice and regulatory changes. Both identify housing and workforce needs; compare how they would pay for and deliver changes.",
    [
      incumbent(
        c(
          "Suzanne Bonamici",
          "Incumbent U.S. representative.",
          "Her stated priorities include affordable housing, universal healthcare, education, climate action and protecting reproductive and voting rights.",
          [
            "Expand economic opportunity for working families.",
            "Improve access to housing and healthcare.",
            "Protect reproductive freedom and democratic participation.",
          ],
          "This is a platform for federal investment and rights protections. The overview identifies policy direction; detailed legislation and costs require further review.",
          "What housing and healthcare changes would you prioritize first, with what funding and measurable results?",
          [
            campaign(
              "Bonamici · priorities",
              "https://www.bonamiciforcongress.com/priorities/",
            ),
          ],
          "Democrat · Working Families",
        ),
        "No",
      ),
      c(
        "Barbara J Kahl",
        "Veterinarian; describes more than three decades serving Oregon communities.",
        "Connects economic growth with support for businesses, workforce education, increased housing supply and federal oversight.",
        [
          "Support school choice and education funding that follows the student.",
          "Streamline housing permits and use federal incentives to reduce financing barriers.",
          "Support working ports, timber communities and law-enforcement funding with accountability.",
        ],
        "Her program combines market access and regulatory relief with selected public investment. School funding and permitting also involve state and local authority.",
        "Which federal incentives and regulations would you change, and how would school choice affect public-school funding?",
        [
          campaign(
            "Kahl · campaign platform",
            "https://www.drkahlforcongress.com/",
          ),
        ],
        "Republican",
      ),
    ],
  ),
  race(
    "oregon-house-2",
    "U.S. House · District 2",
    "Oregon congressional district 2 · two-year term",
    federalAuthority,
    "Rural healthcare, public lands, water, agriculture, wildfire and the federal safety net.",
    "Beck proposes restoring services and revising federal rural programs. Bentz emphasizes resource use, less regulation and border enforcement. Bentz’s online issue pages contain older material, which is disclosed in his brief.",
    [
      c(
        "Chris Beck",
        "Former state representative with rural-development experience.",
        "Proposes stronger federal support for rural healthcare, housing and working lands, and reversing policies he says raise rural costs.",
        [
          "Repeal H.R. 1 and restore Medicaid, nutrition and wildfire-prevention resources.",
          "Phase in a public healthcare option and encourage rural health professionals.",
          "Redirect tax preferences on luxury and vacation homes toward first-time rural buyers.",
        ],
        "He treats federal investment and service access as foundations of rural prosperity. His claims about the size of past funding reductions need independent checks.",
        "What would your rural housing and healthcare package cost, and which revenue changes would cover it?",
        [
          campaign(
            "Beck · district issues",
            "https://www.chrisbeckforcongress.com/district2issues",
          ),
        ],
        "Democrat · Independent",
      ),
      incumbent(
        c(
          "Cliff Bentz",
          "Incumbent U.S. representative; farmer, attorney and former state legislator.",
          "His campaign issue pages favor less regulation, lower taxes, irrigation and resource use, stronger border barriers, and opposition to government-run healthcare.",
          [
            "Support farmers’ and ranchers’ water access and active federal forest management.",
            "Strengthen border security and complete border barriers.",
            "Oppose single-payer healthcare and support gun rights.",
          ],
          "The platform favors private enterprise and resource use with a smaller regulatory role. Some text refers to the early pandemic; it is evidence of a published position, not proof of a newly issued 2026 commitment.",
          "Which positions on these older pages remain your current commitments, and how would you protect rural health access?",
          [
            campaign(
              "Bentz · published issue pages",
              "https://cliffbentz.com/issues/",
              "Undated; includes pandemic-era language; reviewed September 18, 2026",
            ),
          ],
          "Republican",
        ),
        "Aye",
      ),
    ],
  ),
  race(
    "oregon-house-3",
    "U.S. House · District 3",
    "Oregon congressional district 3 · two-year term",
    federalAuthority,
    "Federal housing support, healthcare, civil rights and executive-branch oversight.",
    "Dexter’s published program details federal housing and healthcare tools. A current policy brief for Ayles is still missing; readers should not infer his positions from his party alone.",
    [
      incumbent(
        c(
          "Maxine E Dexter",
          "Incumbent U.S. representative; physician and former state legislator.",
          "Supports a long-term single-payer healthcare model, stronger oversight of healthcare intermediaries and expanded federal housing assistance.",
          [
            "Expand affordable-housing tax credits, HOME and the National Housing Trust Fund.",
            "Support rental and first-time-buyer assistance and innovative construction.",
            "Regulate pharmacy benefit managers and private-equity involvement in healthcare.",
          ],
          "Her approach expands public financing and regulation in housing and healthcare. Her campaign’s descriptions of state legislative results remain separate from the congressional vote checked below.",
          "How would you prioritize housing subsidies and healthcare reform if Congress cannot fund the entire agenda?",
          [
            campaign(
              "Dexter · housing",
              "https://maxinefororegon.com/issue/housing-and-homelessness/",
            ),
            campaign(
              "Dexter · healthcare",
              "https://maxinefororegon.com/issue/fight-for-universal-affordable-healthcare/",
            ),
          ],
          "Democrat",
        ),
        "No",
      ),
      pending(
        "Loran Ayles",
        "Republican",
        "The official filing confirms candidacy. A sufficiently current primary-source platform has not yet been reviewed.",
      ),
    ],
  ),
  race(
    "oregon-house-4",
    "U.S. House · District 4",
    "Oregon congressional district 4 · two-year term",
    federalAuthority,
    "Healthcare, working-family costs, forests and ports, immigration and federal oversight.",
    "Hoyle emphasizes public investment and labor protections; DeSpain combines enforcement and regulatory relief with a conditional immigration-status proposal; Filip proposes much larger changes to ownership, social provision and military spending.",
    [
      incumbent(
        c(
          "Val Hoyle",
          "Incumbent U.S. representative; former state labor commissioner and legislator.",
          "Supports stronger labor rights, expanded healthcare access and federal assistance to reduce housing and childcare costs.",
          [
            "Restore enhanced ACA premium assistance and pursue universal healthcare.",
            "Expand housing vouchers, down-payment assistance and a renter tax credit.",
            "Support paid leave, universal preschool and easier union organizing.",
          ],
          "She proposes reducing household costs through public support and stronger rules for employers and corporations. Her campaign’s claimed accomplishments need separate outcome verification.",
          "Which affordability measures would you enact first, and how would you finance their continuing costs?",
          [campaign("Hoyle · issues", "https://www.valhoyle.com/issues/")],
          "Democrat · Working Families",
        ),
        "No",
      ),
      c(
        "Monique DeSpain",
        "Retired Air Force colonel and attorney.",
        "Supports stronger border and criminal-law enforcement, expanded treatment capacity, faster housing development and active forest management.",
        [
          "Allow a one-time route to lawful status for long-settled, noncriminal undocumented residents who meet screening, tax and work requirements; distinguish this from automatic citizenship.",
          "Expand treatment and recovery housing with measured outcomes.",
          "Reduce construction barriers and support sustainable timber harvests.",
        ],
        "Her immigration proposal combines tighter future enforcement with conditional legal status for some current residents. Describing it simply as either unrestricted immigration or universal deportation would miss that distinction.",
        "Who would qualify for lawful status, and how would you fund treatment expansion while changing federal spending?",
        [
          campaign(
            "DeSpain · priorities",
            "https://www.moniqueforcongress.com/issues/",
          ),
        ],
        "Republican · Libertarian",
      ),
      c(
        "Justin Filip",
        "Pacific Green and Progressive nominee.",
        "Proposes universal public services, expanded worker protections and substantial redistribution of resources away from military spending.",
        [
          "Establish a $25 minimum wage, a federal job guarantee and stronger paid-leave rights.",
          "Provide Medicare for All and move toward public ownership of healthcare and pharmaceutical systems.",
          "Reduce military spending by 50–75% and nationalize energy and rail systems.",
        ],
        "This would be a broad change in public ownership and federal obligations, extending well beyond adding subsidies to existing markets. Implementation would require major legislation and financing.",
        "How would the transition to public ownership work, what would it cost, and which measures would you pursue first?",
        [
          campaign(
            "Filip · platform",
            "https://www.justin4congress.com/our-platform",
          ),
        ],
        "Pacific Green · Progressive",
      ),
    ],
  ),
  race(
    "oregon-house-5",
    "U.S. House · District 5",
    "Oregon congressional district 5 · two-year term",
    federalAuthority,
    "Housing, healthcare, public safety, natural resources and federal spending.",
    "Bynum emphasizes housing access and health coverage; Adair emphasizes affordability, law enforcement and congressional ethics. A current profile for Townsend remains a research gap.",
    [
      incumbent(
        c(
          "Janelle S Bynum",
          "Incumbent U.S. representative; engineer, business owner and former state legislator.",
          "Emphasizes housing supply and homeownership, protection of Medicare and Medicaid, and lower prescription costs.",
          [
            "Address construction-workforce and financing barriers to housing.",
            "Support pathways to ownership and responses to youth homelessness.",
            "Protect Medicare, expand Medicaid and lower drug prices.",
          ],
          "Her reviewed pages describe goals and legislative activity without a fully costed program. Bill introduction and bipartisan sponsorship do not by themselves establish achieved outcomes.",
          "Which housing bill would most directly lower costs, and what evidence would show that it worked?",
          [
            campaign(
              "Bynum · housing",
              "https://www.janellebynum.com/issues/lowering-the-cost-of-housing",
            ),
            campaign(
              "Bynum · healthcare",
              "https://www.janellebynum.com/issues/lowering-cost-of-healthcare",
            ),
          ],
          "Democrat",
        ),
        "No",
      ),
      c(
        "Patti Adair",
        "Deschutes County commissioner.",
        "Names affordability, law enforcement, natural resources, business growth and congressional ethics as priorities.",
        [
          "Support law-enforcement resources.",
          "Promote sustainable natural-resource use and business growth.",
          "Ban congressional insider trading.",
        ],
        "The reviewed priorities page gives a direction but relatively little detail on the tax, spending or regulatory changes behind it. That limits comparison of implementation, not her entitlement to inclusion.",
        "Which three federal changes would lower household costs, and how would your congressional trading restrictions be enforced?",
        [
          campaign(
            "Adair · priorities",
            "https://www.pattiforcongress.com/priorities",
          ),
        ],
        "Republican · Libertarian",
      ),
      pending(
        "Andrea Townsend",
        "Pacific Green",
        "The official filing confirms candidacy. Current attributable policy material remains under research.",
      ),
    ],
  ),
  race(
    "oregon-house-6",
    "U.S. House · District 6",
    "Oregon congressional district 6 · two-year term",
    federalAuthority,
    "Health and mental-health access, housing, immigration, economic policy and federal authority.",
    "Salinas favors targeted federal investment and healthcare protections. Russ proposes a much smaller federal role in several policy areas and stricter immigration enforcement.",
    [
      incumbent(
        c(
          "Andrea Salinas",
          "Incumbent U.S. representative; former state legislator.",
          "Supports lower prescription costs, broader mental-health access, housing investment and federal protection of abortion access.",
          [
            "Expand Medicare drug-price negotiation and mental-health services.",
            "Increase housing supply and assistance.",
            "Combine border security with more efficient immigration courts and protections for established immigrant communities.",
          ],
          "Her platform uses federal programs and regulation to expand access while retaining a role for enforcement. Campaign claims about bills and funding need independent follow-up beyond the vote recorded here.",
          "Which mental-health and housing measures would receive priority in a constrained budget?",
          [
            campaign(
              "Salinas · issues",
              "https://www.andreasalinasfororegon.com/issues/",
            ),
          ],
          "Democrat · Independent",
        ),
        "No",
      ),
      c(
        "David Russ",
        "Former Dundee mayor.",
        "Advocates stronger state and local control, fewer federal subsidies and regulations, domestic manufacturing and stricter immigration enforcement.",
        [
          "Transfer federal public lands toward state or local control.",
          "Reduce federal control over schools, utilities, business and infrastructure.",
          "End subsidies to large corporations and federal subsidies or loans to noncitizens.",
        ],
        "His program would redistribute authority and reduce selected federal interventions. The financial and legal effects depend on the programs and lands involved.",
        "Which transfers and spending reductions would you pursue first, and who would fund the responsibilities shifted to states or localities?",
        [campaign("Russ · campaign platform", "https://www.russisforus.com/")],
        "Republican",
      ),
    ],
  ),
];
