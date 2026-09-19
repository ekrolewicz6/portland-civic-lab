// Reviewed against official actions through September 18, 2026.
// Full Council votes, amendments and committee actions are labeled separately.
import type { CouncilDecision } from "./council-decisions";
import type {
  DecisionAccount,
  CouncilDisagreement,
} from "./council-record-accounts";

export const additionalDecisions: CouncilDecision[] = [
  {
    id: "water-bonds",
    title: "Borrow for Bull Run water treatment",
    summary:
      "Council authorized water-system revenue bonds with up to $525 million in net proceeds, principally for the Bull Run filtration project. The measure passed 9–3. Repayment comes from water-system revenues, making future customer bills part of the financing choice.",
    limit:
      "This was a borrowing authorization, separate from the annual ordinance setting water rates. The project’s revised $2.5 billion budget was larger than this individual bond authorization.",
    source: {
      label: "Borrow for Bull Run water treatment · official record",
      url: "https://www.portland.gov/council/documents/ordinance/passed/192177",
      kind: "Public record",
      date: "May 20, 2026",
    },
    votes: {
      "Tiffany Koyama Lane": "Yes",
      "Angelita Morillo": "No",
      "Steve Novick": "Yes",
      "Mitch Green": "No",
      "Olivia Clark": "Yes",
      "Eric Zimmerman": "Yes",
    },
  },
  {
    id: "water-rates",
    title: "Raise annual water rates",
    summary:
      "The 2026–27 water-rate ordinance passed 8–4. It increased average effective retail water rates by 8.1%; the bureau estimated a typical residential water charge would rise from $65.57 to $70.89 per month, before sewer and stormwater charges.",
    limit:
      "The typical-bill estimate assumes five hundred cubic feet of monthly water use. Actual bills depend on use, billing period and applicable assistance; this is not the total combined utility bill.",
    source: {
      label: "Raise annual water rates · official record",
      url: "https://www.portland.gov/council/documents/ordinance/passed/192183",
      kind: "Public record",
      date: "May 27, 2026",
    },
    votes: {
      "Tiffany Koyama Lane": "No",
      "Angelita Morillo": "No",
      "Steve Novick": "Yes",
      "Mitch Green": "Yes",
      "Olivia Clark": "Yes",
      "Eric Zimmerman": "No",
    },
  },
  {
    id: "sewer-rates",
    title: "Set sewer and stormwater rates",
    summary:
      "Council approved the 2026–27 sewer and stormwater rate schedule 9–3 to fund wastewater and stormwater services. Morillo supported this schedule after opposing the separate water-rate ordinance.",
    limit:
      "Water supply, wastewater and stormwater are separate services with separate rate decisions, even when their charges appear on the same bill.",
    source: {
      label: "Set sewer and stormwater rates · official record",
      url: "https://www.portland.gov/council/documents/ordinance/passed/192182",
      kind: "Public record",
      date: "May 27, 2026",
    },
    votes: {
      "Tiffany Koyama Lane": "No",
      "Angelita Morillo": "Yes",
      "Steve Novick": "Yes",
      "Mitch Green": "Yes",
      "Olivia Clark": "Yes",
      "Eric Zimmerman": "No",
    },
  },
  {
    id: "street-fee",
    title: "Create a monthly transportation utility fee",
    summary:
      "Council passed the new fee 9–3, with collection beginning in January 2027. The initial monthly charge is $12 for a typical single-family home and $8.40 per apartment unit; commercial charges use a percentage of the utility bill. The adopted allocation sends 75% to maintenance and 25% to safety work.",
    limit:
      "Approving a revenue source does not show that every promised repair has happened. The ordinance includes review of business charges and assistance for residents.",
    source: {
      label: "Create a monthly transportation utility fee · official record",
      url: "https://www.portland.gov/council/documents/ordinance/passed/192171",
      kind: "Public record",
      date: "April 29, 2026",
    },
    votes: {
      "Tiffany Koyama Lane": "Yes",
      "Angelita Morillo": "Yes",
      "Steve Novick": "Yes",
      "Mitch Green": "Yes",
      "Olivia Clark": "Yes",
      "Eric Zimmerman": "No",
    },
  },
  {
    id: "sidewalk-plan",
    title: "Develop a sidewalk and paving program",
    summary:
      "Council adopted the Sidewalk Improvement and Paving Program framework 11–1. It directed development of projects and funding options for neglected streets and missing sidewalks, highlighting gaps in Districts 1 and 4.",
    limit:
      "The resolution began planning; it did not appropriate the full cost of a construction program.",
    source: {
      label: "Develop a sidewalk and paving program · official record",
      url: "https://www.portland.gov/council/documents/resolution/adopted/37705",
      kind: "Public record",
      date: "May 7, 2025",
    },
    votes: {
      "Tiffany Koyama Lane": "Yes",
      "Angelita Morillo": "Yes",
      "Steve Novick": "No",
      "Mitch Green": "Yes",
      "Olivia Clark": "Yes",
      "Eric Zimmerman": "Yes",
    },
  },
  {
    id: "transport-rates",
    title: "Update parking and transportation fees",
    summary:
      "Council approved the annual transportation fee schedule 10–2. The package updated parking, permits and other transportation charges, generally using a 6.18% cost escalation, and incorporated the separately approved transportation utility fee.",
    limit:
      "This vote set a fee schedule; it did not independently authorize new staffing or additional spending.",
    source: {
      label: "Update parking and transportation fees · official record",
      url: "https://www.portland.gov/council/documents/ordinance/passed/192181",
      kind: "Public record",
      date: "May 27, 2026",
    },
    votes: {
      "Tiffany Koyama Lane": "Yes",
      "Angelita Morillo": "Yes",
      "Steve Novick": "Yes",
      "Mitch Green": "Yes",
      "Olivia Clark": "Yes",
      "Eric Zimmerman": "No",
    },
  },
  {
    id: "arts-tax",
    title: "Raise the arts tax and expand exemptions",
    summary:
      "Council passed the arts-tax reform 7–5. It raised the individual assessment from $35 to $50 while replacing the old low-income rules with filing thresholds of $20,000 for single filers and $40,000 for joint filers, measured using Oregon taxable income. It also provided for inflation indexing.",
    limit:
      "The reform changed who files and pays as well as the assessment. Calling it only a tax increase or only tax relief leaves out part of the decision.",
    source: {
      label: "Raise the arts tax and expand exemptions · official record",
      url: "https://www.portland.gov/council/documents/ordinance/passed/192185",
      kind: "Public record",
      date: "May 27, 2026",
    },
    votes: {
      "Tiffany Koyama Lane": "Yes",
      "Angelita Morillo": "Yes",
      "Steve Novick": "No",
      "Mitch Green": "Yes",
      "Olivia Clark": "No",
      "Eric Zimmerman": "No",
    },
  },
  {
    id: "psr-framework",
    title: "Expand Portland Street Response’s role",
    summary:
      "Council voted 10–2 to support expanding Portland Street Response as an unarmed, co-equal branch of the emergency-response system and to establish a community committee. Clark and Ryan voted no.",
    limit:
      "The resolution set Council’s direction and petitioned the mayor; it did not itself deliver round-the-clock service or fund every expansion.",
    source: {
      label: "Expand Portland Street Response’s role · official record",
      url: "https://www.portland.gov/council/documents/resolution/adopted/37709",
      kind: "Public record",
      date: "June 25, 2025",
    },
    votes: {
      "Tiffany Koyama Lane": "Yes",
      "Angelita Morillo": "Yes",
      "Steve Novick": "Yes",
      "Mitch Green": "Yes",
      "Olivia Clark": "No",
      "Eric Zimmerman": "Yes",
    },
  },
  {
    id: "psr-committee",
    title: "Appoint the Street Response community committee",
    summary:
      "All 12 councilors approved the membership of the Portland Street Response Committee: 14 community members and one staff representative. This implemented the community-oversight part of the earlier resolution.",
    limit:
      "Clark supported these appointments after opposing the June framework. An appointment vote and a vote on service design answer different questions.",
    source: {
      label:
        "Appoint the Street Response community committee · official record",
      url: "https://www.portland.gov/council/documents/resolution/adopted/37728",
      kind: "Public record",
      date: "December 18, 2025",
    },
    votes: {
      "Tiffany Koyama Lane": "Yes",
      "Angelita Morillo": "Yes",
      "Steve Novick": "Yes",
      "Mitch Green": "Yes",
      "Olivia Clark": "Yes",
      "Eric Zimmerman": "Yes",
    },
  },
  {
    id: "oversight-first-board",
    title: "Appoint the first police-accountability board",
    summary:
      "Council appointed 21 members and six alternates to the Community Board for Police Accountability, 11–1. All six incumbents in these races supported the appointments.",
    limit:
      "Voters authorized the system in 2020 and the previous Council adopted its code. These councilors were voting on appointments, not creating the entire system from scratch.",
    source: {
      label: "Appoint the first police-accountability board · official record",
      url: "https://www.portland.gov/council/documents/report/accepted/2025-246",
      kind: "Public record",
      date: "June 18, 2025",
    },
    votes: {
      "Tiffany Koyama Lane": "Yes",
      "Angelita Morillo": "Yes",
      "Steve Novick": "Yes",
      "Mitch Green": "Yes",
      "Olivia Clark": "Yes",
      "Eric Zimmerman": "Yes",
    },
  },
  {
    id: "oversight-replacements",
    title: "Fill vacancies and restart accountability-board terms",
    summary:
      "Council approved the replacement and term-setting resolution 10–2. It moved two alternates into member positions, reset terms to the first meeting date, requested quarterly reporting and directed further recruitment. Clark and Zimmerman opposed it.",
    limit:
      "This was a particular appointment package. It was not a referendum on every power of the accountability system or on the separate question of its budget.",
    source: {
      label:
        "Fill vacancies and restart accountability-board terms · official record",
      url: "https://www.portland.gov/council/documents/resolution/adopted/37737",
      kind: "Public record",
      date: "February 12, 2026",
    },
    votes: {
      "Tiffany Koyama Lane": "Yes",
      "Angelita Morillo": "Yes",
      "Steve Novick": "Yes",
      "Mitch Green": "Yes",
      "Olivia Clark": "No",
      "Eric Zimmerman": "No",
    },
  },
  {
    id: "community-policing",
    title: "Preserve a community-policing advisory body in code",
    summary:
      "Council voted 11–0, with Koyama Lane absent, to put the Portland Committee on Community-Engaged Policing into City Code. The action preserved a public advisory channel as federal settlement requirements changed.",
    limit:
      "This advisory committee is distinct from the Community Board for Police Accountability and its misconduct-review system.",
    source: {
      label:
        "Preserve a community-policing advisory body in code · official record",
      url: "https://www.portland.gov/council/documents/ordinance/passed/192168",
      kind: "Public record",
      date: "April 16, 2026",
    },
    votes: {
      "Tiffany Koyama Lane": "Absent",
      "Angelita Morillo": "Yes",
      "Steve Novick": "Yes",
      "Mitch Green": "Yes",
      "Olivia Clark": "Yes",
      "Eric Zimmerman": "Yes",
    },
  },
  {
    id: "police-staffing",
    title: "Request a police staffing and cost assessment",
    summary:
      "Council approved a police organizational and staffing assessment 7–5. The final resolution requested staffing levels, recruitment and retention plans, training and ongoing costs, and the effect of other services such as Street Response on police workload.",
    limit:
      "The adopted text requested an assessment; it did not appropriate money to hire 400 officers. The original impact statement’s reference to 400 should not be mistaken for an enacted hiring commitment.",
    source: {
      label: "Request a police staffing and cost assessment · official record",
      url: "https://www.portland.gov/council/documents/resolution/adopted/37738",
      kind: "Public record",
      date: "February 12, 2026",
    },
    votes: {
      "Tiffany Koyama Lane": "No",
      "Angelita Morillo": "No",
      "Steve Novick": "Yes",
      "Mitch Green": "No",
      "Olivia Clark": "Yes",
      "Eric Zimmerman": "Yes",
    },
  },
  {
    id: "nuisance-properties",
    title: "Expand chronic-nuisance property enforcement",
    summary:
      "Council passed the amended property-enforcement ordinance 7–5. It expanded the activities covered by chronic-nuisance rules and gave the City a longer period to document repeated incidents, with the final threshold of three incidents in 90 days rather than 30.",
    limit:
      "The initial proposal used two incidents in 90 days; Council amended it to three. The final vote should be described using that adopted threshold.",
    source: {
      label: "Expand chronic-nuisance property enforcement · official record",
      url: "https://www.portland.gov/council/documents/ordinance/passed/192173",
      kind: "Public record",
      date: "May 6, 2026",
    },
    votes: {
      "Tiffany Koyama Lane": "No",
      "Angelita Morillo": "No",
      "Steve Novick": "Yes",
      "Mitch Green": "No",
      "Olivia Clark": "Yes",
      "Eric Zimmerman": "Yes",
    },
  },
  {
    id: "firearms-table",
    title: "Pause the firearms-in-public-buildings proposal",
    summary:
      "The five-member Community and Public Safety Committee voted 3–2 to table the proposal restricting firearms, including licensed concealed carry, in specified City buildings used for official meetings. Zimmerman supported the pause; Morillo and Novick opposed it.",
    limit:
      "This was a committee motion to table, not a full-Council vote to enact or reject a citywide gun ban. Koyama Lane, Green and Clark were not on this committee.",
    source: {
      label:
        "Pause the firearms-in-public-buildings proposal · official record",
      url: "https://www.portland.gov/council/documents/ordinance/protecting-public-buildings",
      kind: "Public record",
      date: "September 15, 2026",
    },
    votes: {
      "Tiffany Koyama Lane": "Not on committee",
      "Angelita Morillo": "No",
      "Steve Novick": "No",
      "Mitch Green": "Not on committee",
      "Olivia Clark": "Not on committee",
      "Eric Zimmerman": "Yes",
    },
    voteLabel: "Committee vote to table",
  },
  {
    id: "psychedelics-referral",
    title: "Advance a natural-psychedelics enforcement proposal",
    summary:
      "The public-safety committee recommended passage 4–1 of a proposal making non-commercial personal use of natural psychedelics a low enforcement priority and creating an advisory commission. Morillo, Novick and Zimmerman supported referral.",
    limit:
      "This committee recommendation did not enact the proposal. Full Council consideration was scheduled for September 23, after this guide’s September 18 review.",
    source: {
      label:
        "Advance a natural-psychedelics enforcement proposal · official record",
      url: "https://www.portland.gov/council/documents/ordinance/psychedelic-health-and-safety-act",
      kind: "Public record",
      date: "August 4, 2026",
    },
    votes: {
      "Tiffany Koyama Lane": "Not on committee",
      "Angelita Morillo": "Yes",
      "Steve Novick": "Yes",
      "Mitch Green": "Not on committee",
      "Olivia Clark": "Not on committee",
      "Eric Zimmerman": "Yes",
    },
    voteLabel: "Committee referral",
  },
  {
    id: "climate-plan",
    title: "Amend the five-year climate investment plan",
    summary:
      "Council approved amendments to the Portland Clean Energy Community Benefits Fund’s five-year investment plan 9–3. The amended plan allocated approximately $1.59 billion through June 2029, with budget changes subject to subsequent authorization.",
    limit:
      "This was a vote on the particular allocation package, not on whether Portland should have a climate fund. The final resolution and amendment roll calls are available in the linked record.",
    source: {
      label: "Amend the five-year climate investment plan · official record",
      url: "https://www.portland.gov/council/documents/ordinance/passed/192154",
      kind: "Public record",
      date: "March 11, 2026",
    },
    votes: {
      "Tiffany Koyama Lane": "Yes",
      "Angelita Morillo": "No",
      "Steve Novick": "Yes",
      "Mitch Green": "No",
      "Olivia Clark": "Yes",
      "Eric Zimmerman": "Yes",
    },
  },
  {
    id: "climate-interest",
    title: "Transfer climate-fund interest into the general budget",
    summary:
      "Council voted 10–2 to transfer $26,890,729 in audited climate-fund interest earnings into the General Fund for the 2026–27 budget. Morillo and Avalos opposed it.",
    limit:
      "This transfer concerned interest earnings, rather than the fund’s principal. It was separate from the June and July fights over additional service restorations.",
    source: {
      label:
        "Transfer climate-fund interest into the general budget · official record",
      url: "https://www.portland.gov/council/documents/ordinance/passed/192179",
      kind: "Public record",
      date: "May 27, 2026",
    },
    votes: {
      "Tiffany Koyama Lane": "Yes",
      "Angelita Morillo": "No",
      "Steve Novick": "Yes",
      "Mitch Green": "Yes",
      "Olivia Clark": "Yes",
      "Eric Zimmerman": "Yes",
    },
  },
  {
    id: "homebuyer-income",
    title: "Remove an income test for certain fee-exempt homes",
    summary:
      "Council passed a temporary change 8–3, with one absent, removing the buyer-income test for a defined group of previously permitted homes in the affordable-housing development-charge exemption program. The program’s owner-occupancy and sale-price conditions remained distinct from the waived income test.",
    limit:
      "This was narrower than the 2025 general housing-fee waiver. It addressed homes permitted before January 1, 2026 under the affordable-housing program and was tied to the September 2028 sunset.",
    source: {
      label:
        "Remove an income test for certain fee-exempt homes · official record",
      url: "https://www.portland.gov/council/documents/ordinance/passed/192210",
      kind: "Public record",
      date: "July 29, 2026",
    },
    votes: {
      "Tiffany Koyama Lane": "No",
      "Angelita Morillo": "Yes",
      "Steve Novick": "Yes",
      "Mitch Green": "Yes",
      "Olivia Clark": "Yes",
      "Eric Zimmerman": "No",
    },
  },
  {
    id: "housing-strategy",
    title: "Require a unified housing strategy",
    summary:
      "Council voted 11–1 to direct a unified housing strategy aligning existing City plans and agreements, including housing production, affordability and homelessness prevention.",
    limit:
      "A direction to develop a strategy is not evidence that housing targets were achieved or that every later housing proposal received the same support.",
    source: {
      label: "Require a unified housing strategy · official record",
      url: "https://www.portland.gov/council/documents/resolution/adopted/37714",
      kind: "Public record",
      date: "August 6, 2025",
    },
    votes: {
      "Tiffany Koyama Lane": "Yes",
      "Angelita Morillo": "Yes",
      "Steve Novick": "Yes",
      "Mitch Green": "Yes",
      "Olivia Clark": "Yes",
      "Eric Zimmerman": "Yes",
    },
  },
  {
    id: "homelessness-plan",
    title: "Adopt the updated homelessness action plan and measures",
    summary:
      "Council adopted the updated City–County Homelessness Response System action plan and performance measures 9–3. All six incumbents in these races voted yes.",
    limit:
      "The plan and performance measures did not by themselves appropriate all resources for implementation. Support also does not settle a member’s position on individual camp-removal policies.",
    source: {
      label:
        "Adopt the updated homelessness action plan and measures · official record",
      url: "https://www.portland.gov/council/documents/resolution/adopted/37726",
      kind: "Public record",
      date: "December 17, 2025",
    },
    votes: {
      "Tiffany Koyama Lane": "Yes",
      "Angelita Morillo": "Yes",
      "Steve Novick": "Yes",
      "Mitch Green": "Yes",
      "Olivia Clark": "Yes",
      "Eric Zimmerman": "Yes",
    },
  },
  {
    id: "permit-pause",
    title: "Temporarily suspend selected development upgrade requirements",
    summary:
      "Council approved a temporary pause in four development-related upgrade requirements 11–0, with Zimmerman absent. The measure sought to reduce project costs, while the budget analysis warned that some sidewalk-ramp and tree responsibilities could shift to the City.",
    limit:
      "The pause runs through January 1, 2029. It was not a repeal of all permitting standards; the City’s analysis identified possible costs and infrastructure gaps.",
    source: {
      label:
        "Temporarily suspend selected development upgrade requirements · official record",
      url: "https://www.portland.gov/council/documents/ordinance/passed/192095",
      kind: "Public record",
      date: "September 24, 2025",
    },
    votes: {
      "Tiffany Koyama Lane": "Yes",
      "Angelita Morillo": "Yes",
      "Steve Novick": "Yes",
      "Mitch Green": "Yes",
      "Olivia Clark": "Yes",
      "Eric Zimmerman": "Absent",
    },
  },
  {
    id: "permit-reform",
    title: "Develop a second phase of permitting reform",
    summary:
      "Council directed a second phase of code alignment and permitting reform, 11–0 with one absent. The resolution called for coordinated code writing, practical expertise and measures of permitting performance.",
    limit:
      "This resolution directed further work. It did not itself enact every future code change or establish that permit processing had already become faster.",
    source: {
      label: "Develop a second phase of permitting reform · official record",
      url: "https://www.portland.gov/council/documents/resolution/adopted/37749",
      kind: "Public record",
      date: "July 16, 2026",
    },
    votes: {
      "Tiffany Koyama Lane": "Yes",
      "Angelita Morillo": "Yes",
      "Steve Novick": "Yes",
      "Mitch Green": "Yes",
      "Olivia Clark": "Yes",
      "Eric Zimmerman": "Yes",
    },
  },
  {
    id: "urban-forest-plan",
    title: "Adopt the updated Urban Forest Plan",
    summary:
      "Council adopted the updated Urban Forest Plan 11–0, with one absent, after debating how the City should approach street-tree care and sidewalk damage. All six supported the final plan.",
    limit:
      "The resolution is non-binding City policy. Adoption did not immediately transfer every property owner’s street-tree or sidewalk responsibility to the City.",
    source: {
      label: "Adopt the updated Urban Forest Plan · official record",
      url: "https://www.portland.gov/council/documents/resolution/adopted/37720",
      kind: "Public record",
      date: "October 22, 2025",
    },
    votes: {
      "Tiffany Koyama Lane": "Yes",
      "Angelita Morillo": "Yes",
      "Steve Novick": "Yes",
      "Mitch Green": "Yes",
      "Olivia Clark": "Yes",
      "Eric Zimmerman": "Yes",
    },
  },
  {
    id: "tree-responsibility",
    title: "Make the street-tree responsibility plan explicitly conditional",
    summary:
      "Before adopting the forest plan, Council voted 7–4, with one absent, to make an action item explicitly describe a plan that would allow the proposed change if implemented. This qualified the language about a future City role in street-tree maintenance.",
    limit:
      "The underlying amendment changed the strength of a planning commitment, not an immediate service or liability transfer.",
    source: {
      label:
        "Make the street-tree responsibility plan explicitly conditional · official record",
      url: "https://www.portland.gov/council/documents/resolution/adopted/37720",
      kind: "Public record",
      date: "October 22, 2025",
    },
    votes: {
      "Tiffany Koyama Lane": "No",
      "Angelita Morillo": "No",
      "Steve Novick": "Yes",
      "Mitch Green": "Yes",
      "Olivia Clark": "Yes",
      "Eric Zimmerman": "Yes",
    },
    voteLabel: "Amendment vote",
  },
  {
    id: "forest-park",
    title: "Overturn approval of the Forest Park power-line proposal",
    summary:
      "All 12 councilors granted the appeal and overturned the hearings officer’s approval of the proposed utility work affecting Forest Park. The decision denied the environmental review while approving the other specified reviews.",
    limit:
      "This was a land-use decision on a particular application and its approval criteria. It was not a general vote against electricity infrastructure.",
    source: {
      label:
        "Overturn approval of the Forest Park power-line proposal · official record",
      url: "https://www.portland.gov/council/documents/report/findings-adopted/2025-161",
      kind: "Public record",
      date: "May 7, 2025",
    },
    votes: {
      "Tiffany Koyama Lane": "Yes",
      "Angelita Morillo": "Yes",
      "Steve Novick": "Yes",
      "Mitch Green": "Yes",
      "Olivia Clark": "Yes",
      "Eric Zimmerman": "Yes",
    },
  },
  {
    id: "parks-levy",
    title: "Refer the five-year parks levy to voters",
    summary:
      "Council voted 11–0, with Clark absent, to send a five-year parks levy to the November 2025 ballot at $1.40 per $1,000 of assessed property value, up from the expiring levy’s $0.80. The proposal sought to sustain park services and provide some maintenance funding.",
    limit:
      "This roll call records the Council’s ballot referral, not the subsequent public election. Assessed property value is not the same as market value.",
    source: {
      label: "Refer the five-year parks levy to voters · official record",
      url: "https://www.portland.gov/council/documents/resolution/adopted/37710",
      kind: "Public record",
      date: "July 16, 2025",
    },
    votes: {
      "Tiffany Koyama Lane": "Yes",
      "Angelita Morillo": "Yes",
      "Steve Novick": "Yes",
      "Mitch Green": "Yes",
      "Olivia Clark": "Absent",
      "Eric Zimmerman": "Yes",
    },
  },
  {
    id: "sellwood",
    title: "Transfer Sellwood Community House to its nonprofit operator",
    summary:
      "Council approved selling the Sellwood Community Center property to Friends of Sellwood Community House for $1, with a deed restriction requiring public benefit in perpetuity. The measure passed 10–1, with Koyama Lane absent.",
    limit:
      "The symbolic sale price came with a continuing use restriction. The City’s analysis also identified a reduction in potential future capital-maintenance exposure.",
    source: {
      label:
        "Transfer Sellwood Community House to its nonprofit operator · official record",
      url: "https://www.portland.gov/council/documents/ordinance/passed/192130",
      kind: "Public record",
      date: "December 3, 2025",
    },
    votes: {
      "Tiffany Koyama Lane": "Absent",
      "Angelita Morillo": "Yes",
      "Steve Novick": "Yes",
      "Mitch Green": "Yes",
      "Olivia Clark": "Yes",
      "Eric Zimmerman": "Yes",
    },
  },
  {
    id: "vision-zero",
    title: "Renew the traffic-death prevention effort",
    summary:
      "All 12 councilors reaffirmed the goal of eliminating traffic deaths and serious injuries, called for a renewed cross-bureau task force and added attention to deaths involving people experiencing homelessness.",
    limit:
      "The resolution renewed direction and coordination. It did not prove that traffic deaths had fallen or fund every future safety project.",
    source: {
      label: "Renew the traffic-death prevention effort · official record",
      url: "https://www.portland.gov/council/documents/resolution/adopted/37716",
      kind: "Public record",
      date: "September 17, 2025",
    },
    votes: {
      "Tiffany Koyama Lane": "Yes",
      "Angelita Morillo": "Yes",
      "Steve Novick": "Yes",
      "Mitch Green": "Yes",
      "Olivia Clark": "Yes",
      "Eric Zimmerman": "Yes",
    },
  },
  {
    id: "82nd-transit",
    title: "Approve the preferred 82nd Avenue transit alternative",
    summary:
      "Council unanimously approved the locally preferred alternative for the 82nd Avenue transit project, establishing its route, general station locations and transit mode as a basis for further design and funding work.",
    limit:
      "Approval of the preferred alternative was a project-development decision, not authorization of the entire construction budget or proof of completed service improvements.",
    source: {
      label:
        "Approve the preferred 82nd Avenue transit alternative · official record",
      url: "https://www.portland.gov/council/documents/resolution/adopted/37706",
      kind: "Public record",
      date: "May 21, 2025",
    },
    votes: {
      "Tiffany Koyama Lane": "Yes",
      "Angelita Morillo": "Yes",
      "Steve Novick": "Yes",
      "Mitch Green": "Yes",
      "Olivia Clark": "Yes",
      "Eric Zimmerman": "Yes",
    },
  },
  {
    id: "privacy-office",
    title: "Create a City Data and Privacy Office",
    summary:
      "Council unanimously created a City Data and Privacy Office and a chief data officer role to coordinate protection and stewardship of City-held information.",
    limit:
      "The ordinance established responsibilities and a transition process. It did not demonstrate that every City dataset or outside data-sharing risk had already been secured.",
    source: {
      label: "Create a City Data and Privacy Office · official record",
      url: "https://www.portland.gov/council/documents/ordinance/passed/192143",
      kind: "Public record",
      date: "February 5, 2026",
    },
    votes: {
      "Tiffany Koyama Lane": "Yes",
      "Angelita Morillo": "Yes",
      "Steve Novick": "Yes",
      "Mitch Green": "Yes",
      "Olivia Clark": "Yes",
      "Eric Zimmerman": "Yes",
    },
  },
  {
    id: "privacy-framework",
    title: "Adopt the City’s data-governance and privacy framework",
    summary:
      "Council unanimously adopted the amended framework accompanying the privacy office, addressing data sharing, surveillance risks and secondary uses of information, including artificial intelligence.",
    limit:
      "Zimmerman opposed the December committee referral of this resolution but supported the amended final measure in February.",
    source: {
      label:
        "Adopt the City’s data-governance and privacy framework · official record",
      url: "https://www.portland.gov/council/documents/resolution/adopted/37736",
      kind: "Public record",
      date: "February 5, 2026",
    },
    votes: {
      "Tiffany Koyama Lane": "Yes",
      "Angelita Morillo": "Yes",
      "Steve Novick": "Yes",
      "Mitch Green": "Yes",
      "Olivia Clark": "Yes",
      "Eric Zimmerman": "Yes",
    },
  },
  {
    id: "asset-strategy",
    title: "Develop a citywide infrastructure and asset strategy",
    summary:
      "Council unanimously directed development of a citywide strategy for managing roughly $80 billion in public assets, including roads, water systems, buildings and other infrastructure.",
    limit:
      "This directed planning and analysis, including possible bond options. It did not itself approve a new general-obligation bond or fund the full maintenance backlog.",
    source: {
      label:
        "Develop a citywide infrastructure and asset strategy · official record",
      url: "https://www.portland.gov/council/documents/resolution/adopted/37715",
      kind: "Public record",
      date: "August 6, 2025",
    },
    votes: {
      "Tiffany Koyama Lane": "Yes",
      "Angelita Morillo": "Yes",
      "Steve Novick": "Yes",
      "Mitch Green": "Yes",
      "Olivia Clark": "Yes",
      "Eric Zimmerman": "Yes",
    },
  },
  {
    id: "committee-structure",
    title: "Replace eight policy committees with five",
    summary:
      "Council adopted a new committee structure 8–3, with Morillo absent. It replaced eight policy committees with five, including a Finance and Governance Committee of the Whole, effective March 30.",
    limit:
      "Committee structure determines where legislation is developed and scrutinized; this was not a change to the voter-approved four electoral districts.",
    source: {
      label: "Replace eight policy committees with five · official record",
      url: "https://www.portland.gov/council/documents/resolution/establish-city-council-committees",
      kind: "Public record",
      date: "February 19, 2026",
    },
    votes: {
      "Tiffany Koyama Lane": "Yes",
      "Angelita Morillo": "Absent",
      "Steve Novick": "Yes",
      "Mitch Green": "Yes",
      "Olivia Clark": "Yes",
      "Eric Zimmerman": "No",
    },
  },
  {
    id: "council-office-budget",
    title: "Increase Council and mayoral office budgets",
    summary:
      "Council approved a $4,588,234 midyear transfer from General Fund contingency to Council and mayoral offices, 10–2. The package increased staffing and office resources as the new government began work.",
    limit:
      "The measure addressed the remaining 2024–25 fiscal year. Annualized office figures should not be confused with this midyear appropriation.",
    source: {
      label: "Increase Council and mayoral office budgets · official record",
      url: "https://www.portland.gov/council/documents/ordinance/passed/192020",
      kind: "Public record",
      date: "January 15, 2025",
    },
    votes: {
      "Tiffany Koyama Lane": "Yes",
      "Angelita Morillo": "Yes",
      "Steve Novick": "No",
      "Mitch Green": "Yes",
      "Olivia Clark": "Yes",
      "Eric Zimmerman": "Yes",
    },
  },
  {
    id: "council-priorities",
    title: "Establish an annual Council priority-setting process",
    summary:
      "Council approved an annual priority-setting process 10–2. It provided for January planning meetings, possible temporary suspension of policy committees and a shared framework, while preserving councilors’ ability to develop their own legislation.",
    limit:
      "The resolution set a process rather than deciding a particular policy agenda. It expressly preserved independent legislative work.",
    source: {
      label:
        "Establish an annual Council priority-setting process · official record",
      url: "https://www.portland.gov/council/documents/resolution/adopted/37730",
      kind: "Public record",
      date: "December 18, 2025",
    },
    votes: {
      "Tiffany Koyama Lane": "Yes",
      "Angelita Morillo": "Yes",
      "Steve Novick": "No",
      "Mitch Green": "Yes",
      "Olivia Clark": "Yes",
      "Eric Zimmerman": "Yes",
    },
  },
  {
    id: "surplus-inquiry",
    title: "Require a public inquiry into unspent housing funds",
    summary:
      "Council approved a public-information and inquiry process 8–4 after questions about unspent rental-registry funds and how the administration communicated them during budget deliberations.",
    limit:
      "An inquiry is not a finding of wrongdoing. Novick and Clark supported an unsuccessful alternative directing an administrative investigation or work with the Auditor.",
    source: {
      label:
        "Require a public inquiry into unspent housing funds · official record",
      url: "https://www.portland.gov/council/documents/resolution/adopted/37734",
      kind: "Public record",
      date: "February 4, 2026",
    },
    votes: {
      "Tiffany Koyama Lane": "Yes",
      "Angelita Morillo": "Yes",
      "Steve Novick": "No",
      "Mitch Green": "Yes",
      "Olivia Clark": "No",
      "Eric Zimmerman": "No",
    },
  },
  {
    id: "campaign-enforcement",
    title: "Update campaign-finance enforcement after a court ruling",
    summary:
      "Council passed amendments to campaign-finance enforcement code 10–1, with one absent, following a court ruling concerning the City’s voter-approved campaign-finance regulations.",
    limit:
      "This final vote concerned enforcement rules. It should not be treated as an endorsement of every position taken on individual amendments.",
    source: {
      label:
        "Update campaign-finance enforcement after a court ruling · official record",
      url: "https://www.portland.gov/council/documents/ordinance/passed/192156",
      kind: "Public record",
      date: "March 18, 2026",
    },
    votes: {
      "Tiffany Koyama Lane": "Yes",
      "Angelita Morillo": "Yes",
      "Steve Novick": "Yes",
      "Mitch Green": "Yes",
      "Olivia Clark": "Yes",
      "Eric Zimmerman": "Yes",
    },
  },
  {
    id: "small-donor",
    title: "Revise the Small Donor Elections program",
    summary:
      "Council voted 11–1 to revise the public campaign-financing program following recommendations from the Independent Portland Elections Commission. All six incumbents supported the ordinance.",
    limit:
      "A vote on the public financing program is separate from a candidate’s own eligibility, participation or compliance record.",
    source: {
      label: "Revise the Small Donor Elections program · official record",
      url: "https://www.portland.gov/council/documents/ordinance/passed/192098",
      kind: "Public record",
      date: "September 24, 2025",
    },
    votes: {
      "Tiffany Koyama Lane": "Yes",
      "Angelita Morillo": "Yes",
      "Steve Novick": "Yes",
      "Mitch Green": "Yes",
      "Olivia Clark": "Yes",
      "Eric Zimmerman": "Yes",
    },
  },
  {
    id: "labor-complaint",
    title: "Withdraw authority for an unfair-labor-practice complaint",
    summary:
      "All 12 councilors withdrew the previous Council’s authorization to file an unfair-labor-practice complaint against AFSCME. Green and Zimmerman introduced the resolution.",
    limit:
      "This decision addressed a particular City labor dispute; it did not settle every later disagreement over contracts, staffing or layoffs.",
    source: {
      label:
        "Withdraw authority for an unfair-labor-practice complaint · official record",
      url: "https://www.portland.gov/council/documents/resolution/adopted/37695",
      kind: "Public record",
      date: "January 15, 2025",
    },
    votes: {
      "Tiffany Koyama Lane": "Yes",
      "Angelita Morillo": "Yes",
      "Steve Novick": "Yes",
      "Mitch Green": "Yes",
      "Olivia Clark": "Yes",
      "Eric Zimmerman": "Yes",
    },
  },
  {
    id: "professional-workers",
    title: "Ratify the first Professional Workers union contract",
    summary:
      "Council unanimously ratified the first agreement with City of Portland Professional Workers. The City estimated $5.9 million in 2025–26 costs, including wage adjustments, a one-time payment, leave and other negotiated terms.",
    limit:
      "Ratification establishes contract terms. It does not guarantee that all funded positions will be retained in later budgets.",
    source: {
      label:
        "Ratify the first Professional Workers union contract · official record",
      url: "https://www.portland.gov/council/documents/ordinance/passed/192076",
      kind: "Public record",
      date: "June 18, 2025",
    },
    votes: {
      "Tiffany Koyama Lane": "Yes",
      "Angelita Morillo": "Yes",
      "Steve Novick": "Yes",
      "Mitch Green": "Yes",
      "Olivia Clark": "Yes",
      "Eric Zimmerman": "Yes",
    },
  },
  {
    id: "afscme-contract",
    title: "Ratify the AFSCME Local 189 successor contract",
    summary:
      "Council approved the successor agreement with AFSCME Local 189, 11–0 with Koyama Lane absent. The agreement included wage and benefit changes; the City estimated $6 million in added 2025–26 costs.",
    limit:
      "The fiscal estimate is for this contract’s changes, not the entire City payroll.",
    source: {
      label: "Ratify the AFSCME Local 189 successor contract · official record",
      url: "https://www.portland.gov/council/documents/ordinance/passed/192032",
      kind: "Public record",
      date: "March 20, 2025",
    },
    votes: {
      "Tiffany Koyama Lane": "Absent",
      "Angelita Morillo": "Yes",
      "Steve Novick": "Yes",
      "Mitch Green": "Yes",
      "Olivia Clark": "Yes",
      "Eric Zimmerman": "Yes",
    },
  },
  {
    id: "trade-unions-contract",
    title: "Ratify the District Council of Trade Unions contract",
    summary:
      "Council approved the successor agreement with the District Council of Trade Unions, 11–0 with Koyama Lane absent. The City estimated approximately $1.8 million in added 2025–26 costs for the negotiated changes.",
    limit:
      "The approval of negotiated terms was separate from the annual decision about how many positions to fund.",
    source: {
      label:
        "Ratify the District Council of Trade Unions contract · official record",
      url: "https://www.portland.gov/council/documents/ordinance/passed/192033",
      kind: "Public record",
      date: "March 20, 2025",
    },
    votes: {
      "Tiffany Koyama Lane": "Absent",
      "Angelita Morillo": "Yes",
      "Steve Novick": "Yes",
      "Mitch Green": "Yes",
      "Olivia Clark": "Yes",
      "Eric Zimmerman": "Yes",
    },
  },
  {
    id: "review-staff-contract",
    title: "Approve retention terms for Independent Police Review staff",
    summary:
      "Council approved the contract for represented Independent Police Review employees, 10–1 with Koyama Lane absent. It included retention payments, with total new spending capped at $161,500.",
    limit:
      "These were civilian review employees. This was not a collective-bargaining agreement with the police officers’ union.",
    source: {
      label:
        "Approve retention terms for Independent Police Review staff · official record",
      url: "https://www.portland.gov/council/documents/ordinance/passed/192132",
      kind: "Public record",
      date: "December 10, 2025",
    },
    votes: {
      "Tiffany Koyama Lane": "Absent",
      "Angelita Morillo": "Yes",
      "Steve Novick": "Yes",
      "Mitch Green": "Yes",
      "Olivia Clark": "Yes",
      "Eric Zimmerman": "Yes",
    },
  },
  {
    id: "children-remand",
    title:
      "Send Children’s Levy funding recommendations back for reconsideration",
    summary:
      "Council voted 7–5 to remand the Children’s Levy allocation recommendations rather than immediately approve the proposed grants. Morillo moved the remand and Green seconded it.",
    limit:
      "This was a motion to send recommendations back, not a vote to abolish the levy or eliminate all children’s services.",
    source: {
      label:
        "Send Children’s Levy funding recommendations back for reconsideration · official record",
      url: "https://www.portland.gov/council/documents/ordinance/council-action-see-notes/2025-207",
      kind: "Public record",
      date: "June 4, 2025",
    },
    votes: {
      "Tiffany Koyama Lane": "Yes",
      "Angelita Morillo": "Yes",
      "Steve Novick": "No",
      "Mitch Green": "Yes",
      "Olivia Clark": "No",
      "Eric Zimmerman": "No",
    },
    voteLabel: "Vote to remand",
  },
  {
    id: "children-grants",
    title: "Approve the three-year Children’s Levy grants",
    summary:
      "Council ultimately approved roughly $71 million in three-year Children’s Levy grants unanimously. Earlier in the same meeting, Morillo’s amendment to continue waiting for revised recommendations failed 6–6.",
    limit:
      "The final unanimous vote followed a divided process. It should be read alongside the remand and the unsuccessful amendment, rather than used to erase them.",
    source: {
      label: "Approve the three-year Children’s Levy grants · official record",
      url: "https://www.portland.gov/council/documents/ordinance/passed/192080",
      kind: "Public record",
      date: "June 25, 2025",
    },
    votes: {
      "Tiffany Koyama Lane": "Yes",
      "Angelita Morillo": "Yes",
      "Steve Novick": "Yes",
      "Mitch Green": "Yes",
      "Olivia Clark": "Yes",
      "Eric Zimmerman": "Yes",
    },
  },
  {
    id: "sanctuary-code",
    title: "Strengthen sanctuary protections in City Code",
    summary:
      "Council unanimously strengthened sanctuary protections in City Code, including limits on using City resources for immigration enforcement and measures for staff training, access to City spaces and immigrant-community liaison work.",
    limit:
      "Local sanctuary rules govern City conduct and resources; they do not give Council control over all federal immigration operations.",
    source: {
      label: "Strengthen sanctuary protections in City Code · official record",
      url: "https://www.portland.gov/council/documents/ordinance/passed/192115",
      kind: "Public record",
      date: "October 15, 2025",
    },
    votes: {
      "Tiffany Koyama Lane": "Yes",
      "Angelita Morillo": "Yes",
      "Steve Novick": "Yes",
      "Mitch Green": "Yes",
      "Olivia Clark": "Yes",
      "Eric Zimmerman": "Yes",
    },
  },
  {
    id: "protect-portland",
    title: "Adopt the Protect Portland initiative",
    summary:
      "Council unanimously approved the Protect Portland initiative, calling for preparedness, public information about rights, transparency and local protections against unlawful federal actions.",
    limit:
      "This resolution and the binding sanctuary code were separate measures adopted on the same day.",
    source: {
      label: "Adopt the Protect Portland initiative · official record",
      url: "https://www.portland.gov/council/documents/resolution/adopted/37719",
      kind: "Public record",
      date: "October 15, 2025",
    },
    votes: {
      "Tiffany Koyama Lane": "Yes",
      "Angelita Morillo": "Yes",
      "Steve Novick": "Yes",
      "Mitch Green": "Yes",
      "Olivia Clark": "Yes",
      "Eric Zimmerman": "Yes",
    },
  },
  {
    id: "officer-identification",
    title: "Require law-enforcement identification and restrict masking",
    summary:
      "Council passed the amended law-enforcement identification ordinance 8–4. It addressed visible identification, facial coverings and procedures for responding to people claiming police authority, with implementation subject to applicable labor-bargaining obligations.",
    limit:
      "Passage is not proof that the City can compel every federal agency to comply. The record includes amendments responding to legal and implementation questions.",
    source: {
      label:
        "Require law-enforcement identification and restrict masking · official record",
      url: "https://www.portland.gov/council/documents/ordinance/passed/192184",
      kind: "Public record",
      date: "May 27, 2026",
    },
    votes: {
      "Tiffany Koyama Lane": "Yes",
      "Angelita Morillo": "Yes",
      "Steve Novick": "Yes",
      "Mitch Green": "Yes",
      "Olivia Clark": "No",
      "Eric Zimmerman": "No",
    },
  },
  {
    id: "investment-policy",
    title: "Adopt investment policy and seek ethical-screening options",
    summary:
      "Council adopted the investment-policy resolution 10–1, with Clark absent. An amendment called for developing ethical investment options considering human rights, labor, environmental and consumer impacts.",
    limit:
      "The resolution called for options and public consideration; it did not itself enact a named-company divestment list.",
    source: {
      label:
        "Adopt investment policy and seek ethical-screening options · official record",
      url: "https://www.portland.gov/council/documents/resolution/adopted/37723",
      kind: "Public record",
      date: "December 3, 2025",
    },
    votes: {
      "Tiffany Koyama Lane": "Yes",
      "Angelita Morillo": "Yes",
      "Steve Novick": "Yes",
      "Mitch Green": "Yes",
      "Olivia Clark": "Absent",
      "Eric Zimmerman": "No",
    },
  },
  {
    id: "storefront-plan",
    title: "Accept the Storefront Support Program action plan",
    summary:
      "Council accepted the storefront-support report 9–3. It outlined responses to commercial vacancies, street-level problems and business-support needs; accepting the report did not itself fund all proposed actions.",
    limit:
      "This was acceptance of a report. Proposed program costs still belonged in subsequent budget decisions.",
    source: {
      label:
        "Accept the Storefront Support Program action plan · official record",
      url: "https://www.portland.gov/council/documents/report/accepted/2026-080",
      kind: "Public record",
      date: "March 4, 2026",
    },
    votes: {
      "Tiffany Koyama Lane": "Yes",
      "Angelita Morillo": "No",
      "Steve Novick": "Yes",
      "Mitch Green": "Yes",
      "Olivia Clark": "Yes",
      "Eric Zimmerman": "Yes",
    },
  },
  {
    id: "cully-plan",
    title: "Approve Cully’s five-year investment action plan",
    summary:
      "Council approved Cully’s tax-increment-financing action plan 10–1, with Zimmerman absent. It set priorities for affordable housing, anti-displacement work, community assets and business opportunities in the district.",
    limit:
      "Tax-increment financing uses growth in designated property-tax revenues for district investment. The action plan guided later budgets rather than appropriating every project’s full cost.",
    source: {
      label:
        "Approve Cully’s five-year investment action plan · official record",
      url: "https://www.portland.gov/council/documents/resolution/adopted/37744",
      kind: "Public record",
      date: "March 11, 2026",
    },
    votes: {
      "Tiffany Koyama Lane": "Yes",
      "Angelita Morillo": "Yes",
      "Steve Novick": "Yes",
      "Mitch Green": "Yes",
      "Olivia Clark": "Yes",
      "Eric Zimmerman": "Absent",
    },
  },
  {
    id: "campesinos",
    title: "Rename César E. Chávez Boulevard as Campesinos Boulevard",
    summary:
      "Council unanimously approved renaming the boulevard to honor farmworkers collectively, following community concerns about its existing namesake. Koyama Lane co-sponsored the measure; the Council also adopted amendments and an emergency clause.",
    limit:
      "The adopted ordinance is the latest action. Earlier proposals referred back to committee should not be presented as if Council had never reached a decision.",
    source: {
      label:
        "Rename César E. Chávez Boulevard as Campesinos Boulevard · official record",
      url: "https://www.portland.gov/council/documents/ordinance/renaming-cesar-e-chavez-blvd",
      kind: "Public record",
      date: "September 9, 2026",
    },
    votes: {
      "Tiffany Koyama Lane": "Yes",
      "Angelita Morillo": "Yes",
      "Steve Novick": "Yes",
      "Mitch Green": "Yes",
      "Olivia Clark": "Yes",
      "Eric Zimmerman": "Yes",
    },
  },
  {
    id: "force-fed-poultry",
    title: "Prohibit sales of products from force-fed poultry",
    summary:
      "Council passed the ordinance 7–5 to prohibit sales of products from force-fed poultry, including foie gras made that way. It provided a delayed start for the prohibited-conduct rules to allow affected businesses to adjust.",
    limit:
      "The ordinance concerns products from force-fed poultry, not every poultry product. A no vote alone does not establish opposition to all animal-welfare protections.",
    source: {
      label:
        "Prohibit sales of products from force-fed poultry · official record",
      url: "https://www.portland.gov/council/documents/ordinance/passed/192190",
      kind: "Public record",
      date: "June 4, 2026",
    },
    votes: {
      "Tiffany Koyama Lane": "Yes",
      "Angelita Morillo": "Yes",
      "Steve Novick": "Yes",
      "Mitch Green": "Yes",
      "Olivia Clark": "No",
      "Eric Zimmerman": "No",
    },
  },
  {
    id: "board-eligibility",
    title: "Consider removing an accountability-board member as ineligible",
    summary:
      "Council rejected, 5–7, the portion of the administration’s report that would have declared board member Schuyler (Hugh) Halsey ineligible. The separate vote left him on the board.",
    limit:
      "This was a contested appointment-eligibility decision, not an independent finding by this guide about the member’s conduct or views.",
    source: {
      label:
        "Consider removing an accountability-board member as ineligible · official record",
      url: "https://www.portland.gov/council/documents/report/accepted/2026-047",
      kind: "Public record",
      date: "February 11, 2026",
    },
    votes: {
      "Tiffany Koyama Lane": "No",
      "Angelita Morillo": "No",
      "Steve Novick": "Yes",
      "Mitch Green": "No",
      "Olivia Clark": "Yes",
      "Eric Zimmerman": "Yes",
    },
    voteLabel: "Divided report: eligibility",
  },
  {
    id: "board-removal",
    title: "Remove an accountability-board alternate for cause",
    summary:
      "In a separate 7–5 vote on the same report, Council approved removing alternate Bob Weinstein for cause, based on the administration’s account of incomplete required onboarding. Novick joined Koyama Lane, Morillo and Green on this vote.",
    limit:
      "The two contested removals received separate votes. The later unanimous vote on the remainder of the report must not be presented as unanimous support for either removal.",
    source: {
      label:
        "Remove an accountability-board alternate for cause · official record",
      url: "https://www.portland.gov/council/documents/report/accepted/2026-047",
      kind: "Public record",
      date: "February 11, 2026",
    },
    votes: {
      "Tiffany Koyama Lane": "Yes",
      "Angelita Morillo": "Yes",
      "Steve Novick": "Yes",
      "Mitch Green": "Yes",
      "Olivia Clark": "No",
      "Eric Zimmerman": "No",
    },
    voteLabel: "Divided report: removal",
  },
];

export const additionalAccounts: Record<
  string,
  Record<string, DecisionAccount>
> = {
  "water-bonds": {
    "Tiffany Koyama Lane": {
      choice: "Approved the water borrowing",
      action:
        "Voted to authorize the bond financing for Bull Run water treatment and related water-system needs, accepting repayment obligations supported by water revenues.",
    },
    "Angelita Morillo": {
      choice: "Opposed this borrowing package",
      action:
        "Voted against authorizing this water-system bond package. The vote rejected this financing decision; it did not establish a position against providing safe drinking water.",
    },
    "Steve Novick": {
      choice: "Approved the water borrowing",
      action:
        "Voted to authorize the bond financing for Bull Run water treatment and related water-system needs, accepting repayment obligations supported by water revenues.",
    },
    "Mitch Green": {
      choice: "Opposed this borrowing package",
      action:
        "Voted against authorizing this water-system bond package. The vote rejected this financing decision; it did not establish a position against providing safe drinking water.",
    },
    "Olivia Clark": {
      choice: "Approved the water borrowing",
      action:
        "Voted to authorize the bond financing for Bull Run water treatment and related water-system needs, accepting repayment obligations supported by water revenues.",
    },
    "Eric Zimmerman": {
      choice: "Approved the water borrowing",
      action:
        "Voted to authorize the bond financing for Bull Run water treatment and related water-system needs, accepting repayment obligations supported by water revenues.",
    },
  },
  "water-rates": {
    "Tiffany Koyama Lane": {
      choice: "Opposed the water-rate increase",
      action:
        "Voted against the annual water-rate schedule and its increase in customer charges.",
    },
    "Angelita Morillo": {
      choice: "Opposed the water-rate increase",
      action:
        "Voted against the annual water-rate schedule and its increase in customer charges.",
    },
    "Steve Novick": {
      choice: "Approved the water-rate increase",
      action:
        "Voted for the annual water-rate schedule supporting treatment, operations, maintenance and debt payments, including the 8.1% average effective retail increase.",
    },
    "Mitch Green": {
      choice: "Approved the water-rate increase",
      action:
        "Voted for the annual water-rate schedule supporting treatment, operations, maintenance and debt payments, including the 8.1% average effective retail increase.",
    },
    "Olivia Clark": {
      choice: "Approved the water-rate increase",
      action:
        "Voted for the annual water-rate schedule supporting treatment, operations, maintenance and debt payments, including the 8.1% average effective retail increase.",
    },
    "Eric Zimmerman": {
      choice: "Opposed the water-rate increase",
      action:
        "Voted against the annual water-rate schedule and its increase in customer charges.",
      reason: {
        label: "Zimmerman · June explanation",
        text: "He grouped these increases with new transportation charges and the arts-tax increase, arguing that their combined burden was too much while residents faced rising living costs.",
        source: {
          label: "Zimmerman · June explanation",
          url: "https://www.portland.gov/council/districts/4/eric-zimmerman/news/2026/6/30/june-newsletter-q2-review",
          kind: "Candidate statement",
          date: "June 30, 2026",
        },
      },
    },
  },
  "sewer-rates": {
    "Tiffany Koyama Lane": {
      choice: "Opposed sewer and stormwater rates",
      action: "Voted against the annual sewer and stormwater rate schedule.",
    },
    "Angelita Morillo": {
      choice: "Approved sewer and stormwater rates",
      action:
        "Voted for the annual rates and charges funding sewer and stormwater operations and infrastructure.",
    },
    "Steve Novick": {
      choice: "Approved sewer and stormwater rates",
      action:
        "Voted for the annual rates and charges funding sewer and stormwater operations and infrastructure.",
    },
    "Mitch Green": {
      choice: "Approved sewer and stormwater rates",
      action:
        "Voted for the annual rates and charges funding sewer and stormwater operations and infrastructure.",
    },
    "Olivia Clark": {
      choice: "Approved sewer and stormwater rates",
      action:
        "Voted for the annual rates and charges funding sewer and stormwater operations and infrastructure.",
    },
    "Eric Zimmerman": {
      choice: "Opposed sewer and stormwater rates",
      action: "Voted against the annual sewer and stormwater rate schedule.",
      reason: {
        label: "Zimmerman · June explanation",
        text: "He grouped these increases with new transportation charges and the arts-tax increase, arguing that their combined burden was too much while residents faced rising living costs.",
        source: {
          label: "Zimmerman · June explanation",
          url: "https://www.portland.gov/council/districts/4/eric-zimmerman/news/2026/6/30/june-newsletter-q2-review",
          kind: "Candidate statement",
          date: "June 30, 2026",
        },
      },
    },
  },
  "street-fee": {
    "Tiffany Koyama Lane": {
      choice: "Approved a new source of street funding",
      action:
        "Co-authored the allocation amendment with Zimmerman, then voted for the fee. It reserves 75% of revenue for maintenance and divides the remaining 25% between Vision Zero safety work and the sidewalk program.",
      reason: {
        label: "Koyama Lane · case for the allocation",
        text: "She connected the spending requirements to constituent priorities for road repair, walking and cycling infrastructure, and fewer traffic deaths.",
        source: {
          label: "Koyama Lane · case for the allocation",
          url: "https://www.portland.gov/council/districts/3/tiffany-koyama-lane/news/2026/5/21/councilor-koyama-lane-delivers-vision-zero",
          kind: "Candidate statement",
          date: "May 21, 2026",
        },
      },
    },
    "Angelita Morillo": {
      choice: "Approved a new source of street funding",
      action:
        "Voted to add the transportation fee to utility bills, with dedicated maintenance and safety spending, financial assistance and public reporting.",
    },
    "Steve Novick": {
      choice: "Approved a new source of street funding",
      action:
        "Voted to add the transportation fee to utility bills, with dedicated maintenance and safety spending, financial assistance and public reporting.",
    },
    "Mitch Green": {
      choice: "Approved a new source of street funding",
      action:
        "Co-authored the business-rate review amendment with Clark, then supported the fee and its dedicated maintenance and safety funding.",
    },
    "Olivia Clark": {
      choice: "Approved a new source of street funding",
      action:
        "Helped lead the fee proposal and co-authored a business-rate review amendment with Green, then voted for the new revenue source.",
      reason: {
        label: "Clark · explanation reported by the Mercury",
        text: "She argued that postponing repairs would leave future residents with a larger burden, and described stable transportation revenue as the fiscally responsible choice.",
        source: {
          label: "Clark · explanation reported by the Mercury",
          url: "https://www.portlandmercury.com/news/portland-city-council-officially-adopts-transportation-utility-fee/",
          kind: "Reporting",
          date: "April 29, 2026; updated August 24",
        },
      },
    },
    "Eric Zimmerman": {
      choice: "Opposed the fee after helping shape it",
      action:
        "Voted against creating the fee, after working with Koyama Lane on the amendment allocating revenue to maintenance, traffic safety and missing sidewalks.",
      reason: {
        label: "Zimmerman · why he voted no",
        text: "He said residents should have a vote before another monthly charge was added. Because he expected passage, he worked on directing the money toward existing roads and Southwest sidewalks.",
        source: {
          label: "Zimmerman · why he voted no",
          url: "https://www.portland.gov/council/districts/4/eric-zimmerman/news/2026/5/29/may-newsletter-approved-budget-protecting-pemo-nw",
          kind: "Candidate statement",
          date: "May 29, 2026",
        },
      },
    },
  },
  "sidewalk-plan": {
    "Tiffany Koyama Lane": {
      choice: "Supported the sidewalk program framework",
      action:
        "Voted to develop the sidewalk and paving program, including a project and funding plan for historically underserved areas.",
    },
    "Angelita Morillo": {
      choice: "Supported the sidewalk program framework",
      action:
        "Voted to develop the sidewalk and paving program, including a project and funding plan for historically underserved areas.",
    },
    "Steve Novick": {
      choice: "Opposed this program framework",
      action:
        "Cast the sole vote against the final sidewalk-program resolution. He later supported the citywide transportation utility fee; this vote therefore does not establish opposition to all street funding.",
    },
    "Mitch Green": {
      choice: "Supported the sidewalk program framework",
      action:
        "Voted to develop the sidewalk and paving program, including a project and funding plan for historically underserved areas.",
    },
    "Olivia Clark": {
      choice: "Supported the sidewalk program framework",
      action:
        "Voted to develop the sidewalk and paving program, including a project and funding plan for historically underserved areas.",
    },
    "Eric Zimmerman": {
      choice: "Supported the sidewalk program framework",
      action:
        "Voted to develop the sidewalk and paving program, including a project and funding plan for historically underserved areas.",
    },
  },
  "transport-rates": {
    "Tiffany Koyama Lane": {
      choice: "Approved the annual transportation charges",
      action:
        "Voted for the updated parking, permit and transportation fee schedule supporting the transportation budget.",
    },
    "Angelita Morillo": {
      choice: "Approved the annual transportation charges",
      action:
        "Voted for the updated parking, permit and transportation fee schedule supporting the transportation budget.",
    },
    "Steve Novick": {
      choice: "Approved the annual transportation charges",
      action:
        "Voted for the updated parking, permit and transportation fee schedule supporting the transportation budget.",
    },
    "Mitch Green": {
      choice: "Approved the annual transportation charges",
      action:
        "Voted for the updated parking, permit and transportation fee schedule supporting the transportation budget.",
    },
    "Olivia Clark": {
      choice: "Approved the annual transportation charges",
      action:
        "Voted for the updated parking, permit and transportation fee schedule supporting the transportation budget.",
    },
    "Eric Zimmerman": {
      choice: "Opposed the annual transportation charges",
      action:
        "Voted against the package updating parking and other transportation fees.",
      reason: {
        label: "Zimmerman · June explanation",
        text: "He identified street-parking increases as one part of the combined tax and fee burden he opposed because of residents’ rising living costs.",
        source: {
          label: "Zimmerman · June explanation",
          url: "https://www.portland.gov/council/districts/4/eric-zimmerman/news/2026/6/30/june-newsletter-q2-review",
          kind: "Candidate statement",
          date: "June 30, 2026",
        },
      },
    },
  },
  "arts-tax": {
    "Tiffany Koyama Lane": {
      choice: "Supported a higher tax with broader exemptions",
      action:
        "Co-sponsored the reform and helped advance its revised income thresholds, then supported the final package of a higher assessment and broader exemptions.",
    },
    "Angelita Morillo": {
      choice: "Supported a higher tax with broader exemptions",
      action:
        "Voted for the package intended to preserve arts-education and arts funding while removing the filing or payment obligation for many lower-income residents.",
    },
    "Steve Novick": {
      choice: "Opposed the final arts-tax package",
      action:
        "Voted against the package increasing the assessment and changing its exemptions and administration.",
      reason: {
        label: "Novick · earlier objection reported by OPB",
        text: "During the May 13 debate, he criticized the structure and inconvenience of the tax, arguing that the proposed changes did not fix its underlying problems.",
        source: {
          label: "Novick · earlier objection reported by OPB",
          url: "https://www.opb.org/article/2026/05/27/portland-votes-to-increase-arts-tax-allow-fewer-people-to-pay/",
          kind: "Reporting",
          date: "May 13 remarks; reported May 27, 2026",
        },
      },
    },
    "Mitch Green": {
      choice: "Supported a higher tax with broader exemptions",
      action:
        "Voted for the package intended to preserve arts-education and arts funding while removing the filing or payment obligation for many lower-income residents.",
    },
    "Olivia Clark": {
      choice: "Opposed the final arts-tax package",
      action:
        "Voted against the package increasing the assessment and changing its exemptions and administration.",
    },
    "Eric Zimmerman": {
      choice: "Opposed the final arts-tax package",
      action:
        "Voted against the package increasing the assessment and changing its exemptions and administration.",
      reason: {
        label: "Zimmerman · why he voted no",
        text: "He argued that the higher charge would still burden minimum-wage workers and that voters should decide major changes to a tax they originally approved.",
        source: {
          label: "Zimmerman · why he voted no",
          url: "https://www.portland.gov/council/districts/4/eric-zimmerman/news/2026/5/29/may-newsletter-approved-budget-protecting-pemo-nw",
          kind: "Candidate statement",
          date: "May 29, 2026",
        },
      },
    },
  },
  "psr-framework": {
    "Tiffany Koyama Lane": {
      choice: "Supported expanding the unarmed response",
      action:
        "Voted for a framework to expand the role of Portland Street Response and establish community participation in its development.",
    },
    "Angelita Morillo": {
      choice: "Supported expanding the unarmed response",
      action:
        "Voted for a framework to expand the role of Portland Street Response and establish community participation in its development.",
      reason: {
        label: "Earlier joint statement on Street Response",
        text: "In a joint statement before the vote, supported broader unarmed response and voluntary transport, while warning that routine police involvement could undermine trust in Street Response.",
        source: {
          label: "Earlier joint statement on Street Response",
          url: "https://www.portland.gov/council/districts/2/sameer-kanal/news/2025/3/25/statement-councilors-candace-avalos-mitch-green",
          kind: "Candidate statement",
          date: "March 25, 2025",
        },
      },
    },
    "Steve Novick": {
      choice: "Supported expanding the unarmed response",
      action:
        "Voted for a framework to expand the role of Portland Street Response and establish community participation in its development.",
    },
    "Mitch Green": {
      choice: "Supported expanding the unarmed response",
      action:
        "Voted for a framework to expand the role of Portland Street Response and establish community participation in its development.",
      reason: {
        label: "Earlier joint statement on Street Response",
        text: "In a joint statement before the vote, supported broader unarmed response and voluntary transport, while warning that routine police involvement could undermine trust in Street Response.",
        source: {
          label: "Earlier joint statement on Street Response",
          url: "https://www.portland.gov/council/districts/2/sameer-kanal/news/2025/3/25/statement-councilors-candace-avalos-mitch-green",
          kind: "Candidate statement",
          date: "March 25, 2025",
        },
      },
    },
    "Olivia Clark": {
      choice: "Opposed this expansion framework",
      action:
        "Voted against this resolution setting out Portland Street Response’s expanded role and its community committee.",
    },
    "Eric Zimmerman": {
      choice: "Supported expanding the unarmed response",
      action:
        "Opposed sending the proposal forward in committee in April, then voted yes on the amended resolution before full Council in June. His final position on that resolution was support.",
    },
  },
  "psr-committee": {
    "Tiffany Koyama Lane": {
      choice: "Supported the committee appointments",
      action:
        "Voted to seat the community committee that would advise the development of Portland Street Response.",
    },
    "Angelita Morillo": {
      choice: "Supported the committee appointments",
      action:
        "Voted to seat the community committee that would advise the development of Portland Street Response.",
    },
    "Steve Novick": {
      choice: "Supported the committee appointments",
      action:
        "Voted to seat the community committee that would advise the development of Portland Street Response.",
    },
    "Mitch Green": {
      choice: "Supported the committee appointments",
      action:
        "Voted to seat the community committee that would advise the development of Portland Street Response.",
    },
    "Olivia Clark": {
      choice: "Supported the committee appointments",
      action:
        "Voted to seat the community committee that would advise the development of Portland Street Response.",
    },
    "Eric Zimmerman": {
      choice: "Supported the committee appointments",
      action:
        "Voted to seat the community committee that would advise the development of Portland Street Response.",
    },
  },
  "oversight-first-board": {
    "Tiffany Koyama Lane": {
      choice: "Supported launching the board through appointments",
      action:
        "Voted to appoint the first members and alternates of the new community police-accountability board.",
    },
    "Angelita Morillo": {
      choice: "Supported launching the board through appointments",
      action:
        "Voted to appoint the first members and alternates of the new community police-accountability board.",
    },
    "Steve Novick": {
      choice: "Supported launching the board through appointments",
      action:
        "Voted to appoint the first members and alternates of the new community police-accountability board.",
    },
    "Mitch Green": {
      choice: "Supported launching the board through appointments",
      action:
        "Voted to appoint the first members and alternates of the new community police-accountability board.",
    },
    "Olivia Clark": {
      choice: "Supported launching the board through appointments",
      action:
        "Voted to appoint the first members and alternates of the new community police-accountability board.",
    },
    "Eric Zimmerman": {
      choice: "Supported launching the board through appointments",
      action:
        "Voted to appoint the first members and alternates of the new community police-accountability board.",
    },
  },
  "oversight-replacements": {
    "Tiffany Koyama Lane": {
      choice: "Supported the board’s replacement and term plan",
      action:
        "Voted for the replacement appointments, revised term dates and reporting arrangements to help the police-accountability board begin work.",
    },
    "Angelita Morillo": {
      choice: "Supported the board’s replacement and term plan",
      action:
        "Voted for the replacement appointments, revised term dates and reporting arrangements to help the police-accountability board begin work.",
    },
    "Steve Novick": {
      choice: "Supported the board’s replacement and term plan",
      action:
        "Voted for the replacement appointments, revised term dates and reporting arrangements to help the police-accountability board begin work.",
    },
    "Mitch Green": {
      choice: "Supported the board’s replacement and term plan",
      action:
        "Voted for the replacement appointments, revised term dates and reporting arrangements to help the police-accountability board begin work.",
    },
    "Olivia Clark": {
      choice: "Opposed this board appointment and term package",
      action:
        "Voted against the February replacement and term-setting resolution, after supporting the board’s initial appointments in June 2025.",
    },
    "Eric Zimmerman": {
      choice: "Opposed this board appointment and term package",
      action:
        "Voted against the February replacement and term-setting resolution, after supporting the board’s initial appointments in June 2025.",
    },
  },
  "community-policing": {
    "Tiffany Koyama Lane": {
      choice: "Absent from this vote",
      action:
        "Was absent when Council voted on preserve a community-policing advisory body in code. The record does not contain a yes or no vote for this decision.",
    },
    "Angelita Morillo": {
      choice: "Supported a continuing community advisory role",
      action:
        "Voted to preserve the community-policing committee’s formal role advising the mayor and police chief.",
    },
    "Steve Novick": {
      choice: "Supported a continuing community advisory role",
      action:
        "Voted to preserve the community-policing committee’s formal role advising the mayor and police chief.",
    },
    "Mitch Green": {
      choice: "Supported a continuing community advisory role",
      action:
        "Voted to preserve the community-policing committee’s formal role advising the mayor and police chief.",
    },
    "Olivia Clark": {
      choice: "Supported a continuing community advisory role",
      action:
        "Voted to preserve the community-policing committee’s formal role advising the mayor and police chief.",
    },
    "Eric Zimmerman": {
      choice: "Supported a continuing community advisory role",
      action:
        "Voted to preserve the community-policing committee’s formal role advising the mayor and police chief.",
    },
  },
  "police-staffing": {
    "Tiffany Koyama Lane": {
      choice: "Opposed this staffing-assessment resolution",
      action:
        "Voted against this resolution directing a police organizational and staffing report.",
    },
    "Angelita Morillo": {
      choice: "Opposed this staffing-assessment resolution",
      action:
        "Voted against this resolution directing a police organizational and staffing report.",
    },
    "Steve Novick": {
      choice: "Supported the police staffing assessment",
      action:
        "Voted to request the organizational, recruitment and cost report to inform future police staffing decisions.",
    },
    "Mitch Green": {
      choice: "Opposed this staffing-assessment resolution",
      action:
        "Voted against this resolution directing a police organizational and staffing report.",
    },
    "Olivia Clark": {
      choice: "Supported the police staffing assessment",
      action:
        "Voted to request the organizational, recruitment and cost report to inform future police staffing decisions.",
    },
    "Eric Zimmerman": {
      choice: "Supported the police staffing assessment",
      action:
        "Voted to request the organizational, recruitment and cost report to inform future police staffing decisions.",
    },
  },
  "nuisance-properties": {
    "Tiffany Koyama Lane": {
      choice: "Opposed the expanded enforcement rules",
      action:
        "Voted against expanding the chronic-nuisance ordinance and its enforcement framework.",
    },
    "Angelita Morillo": {
      choice: "Opposed the expanded enforcement rules",
      action:
        "Voted against expanding the chronic-nuisance ordinance and its enforcement framework.",
    },
    "Steve Novick": {
      choice: "Led the revised enforcement proposal",
      action:
        "Led the proposal and amendments before voting for passage. The final rules extended the documentation window while retaining a three-incident threshold.",
      reason: {
        label: "Novick · explanation after passage",
        text: "He argued that the old 30-day window made enforcement too difficult for a stretched police force. He cited trafficking near McDaniel High School and urged holding property owners responsible for taking preventive steps.",
        source: {
          label: "Novick · explanation after passage",
          url: "https://www.portland.gov/council/districts/3/steve-novick/news/2026/5/8/novick-newsletter-may-8th",
          kind: "Candidate statement",
          date: "May 8, 2026",
        },
      },
    },
    "Mitch Green": {
      choice: "Opposed the expanded enforcement rules",
      action:
        "Voted against expanding the chronic-nuisance ordinance and its enforcement framework.",
    },
    "Olivia Clark": {
      choice: "Supported stronger tools against repeated property crime",
      action:
        "Voted for the amended rules allowing the City to require property owners to address repeated criminal activity, including trafficking-related activity.",
    },
    "Eric Zimmerman": {
      choice: "Supported stronger tools against repeated property crime",
      action:
        "Voted for the amended rules allowing the City to require property owners to address repeated criminal activity, including trafficking-related activity.",
    },
  },
  "firearms-table": {
    "Tiffany Koyama Lane": {
      choice: "Not a member of this committee",
      action:
        "Did not have a vote in this five-member committee. This is not an absence from Council or a position against the proposal.",
    },
    "Angelita Morillo": {
      choice: "Opposed putting the proposal on hold",
      action:
        "Voted against the committee motion to table the firearms proposal, keeping a distinction between delaying consideration and voting on the final law.",
    },
    "Steve Novick": {
      choice: "Opposed putting the proposal on hold",
      action:
        "Voted against the committee motion to table the firearms proposal, keeping a distinction between delaying consideration and voting on the final law.",
    },
    "Mitch Green": {
      choice: "Not a member of this committee",
      action:
        "Did not have a vote in this five-member committee. This is not an absence from Council or a position against the proposal.",
    },
    "Olivia Clark": {
      choice: "Not a member of this committee",
      action:
        "Did not have a vote in this five-member committee. This is not an absence from Council or a position against the proposal.",
    },
    "Eric Zimmerman": {
      choice: "Voted to put the proposal on hold",
      action:
        "Moved and supported the committee motion to table the proposed public-building firearms restrictions.",
    },
  },
  "psychedelics-referral": {
    "Tiffany Koyama Lane": {
      choice: "Not a member of this committee",
      action:
        "Did not have a vote in this five-member committee. This is not an absence from Council or a position against the proposal.",
    },
    "Angelita Morillo": {
      choice: "Supported advancing the amended proposal",
      action:
        "Voted to send the amended natural-psychedelics proposal to full Council with a recommendation for passage.",
    },
    "Steve Novick": {
      choice: "Supported advancing the amended proposal",
      action:
        "Voted to send the amended natural-psychedelics proposal to full Council with a recommendation for passage.",
    },
    "Mitch Green": {
      choice: "Not a member of this committee",
      action:
        "Did not have a vote in this five-member committee. This is not an absence from Council or a position against the proposal.",
    },
    "Olivia Clark": {
      choice: "Not a member of this committee",
      action:
        "Did not have a vote in this five-member committee. This is not an absence from Council or a position against the proposal.",
    },
    "Eric Zimmerman": {
      choice: "Supported advancing the amended proposal",
      action:
        "Opposed Kanal’s amendment in committee, then supported referring the amended proposal to full Council. His referral vote was yes; full Council had not yet voted.",
    },
  },
  "climate-plan": {
    "Tiffany Koyama Lane": {
      choice: "Approved the amended climate-investment package",
      action:
        "Voted for the final package of revisions to the climate fund’s multi-year investment plan.",
    },
    "Angelita Morillo": {
      choice: "Opposed the final investment-plan package",
      action:
        "Voted against the final package of climate-investment amendments, after participating in changes to the proposal.",
    },
    "Steve Novick": {
      choice: "Approved the amended climate-investment package",
      action:
        "Voted for the final package of revisions to the climate fund’s multi-year investment plan.",
    },
    "Mitch Green": {
      choice: "Opposed the final investment-plan package",
      action:
        "Voted against the final package of climate-investment amendments, after participating in changes to the proposal.",
    },
    "Olivia Clark": {
      choice: "Approved the amended climate-investment package",
      action:
        "Voted for the final package of revisions to the climate fund’s multi-year investment plan.",
    },
    "Eric Zimmerman": {
      choice: "Approved the amended climate-investment package",
      action:
        "Voted for the final package of revisions to the climate fund’s multi-year investment plan.",
    },
  },
  "climate-interest": {
    "Tiffany Koyama Lane": {
      choice: "Supported this interest transfer",
      action:
        "Voted to transfer the specified climate-fund interest into the general budget to support City expenses.",
    },
    "Angelita Morillo": {
      choice: "Opposed this particular interest transfer",
      action:
        "Voted against the May interest-transfer ordinance. Morillo later proposed using climate-fund interest for specified service restorations, so this vote does not establish opposition to every such use.",
    },
    "Steve Novick": {
      choice: "Supported this interest transfer",
      action:
        "Voted to transfer the specified climate-fund interest into the general budget to support City expenses.",
    },
    "Mitch Green": {
      choice: "Supported this interest transfer",
      action:
        "Voted to transfer the specified climate-fund interest into the general budget to support City expenses.",
    },
    "Olivia Clark": {
      choice: "Supported this interest transfer",
      action:
        "Voted to transfer the specified climate-fund interest into the general budget to support City expenses.",
    },
    "Eric Zimmerman": {
      choice: "Supported this interest transfer",
      action:
        "Voted to transfer the specified climate-fund interest into the general budget to support City expenses.",
    },
  },
  "homebuyer-income": {
    "Tiffany Koyama Lane": {
      choice: "Opposed removing the buyer-income test",
      action:
        "Voted against the temporary removal of the income qualification for this group of homes receiving development-charge exemptions.",
    },
    "Angelita Morillo": {
      choice: "Supported widening the eligible buyer pool",
      action:
        "Voted to remove the income qualification temporarily for the specified already-permitted homes, making it possible to sell them to a wider group of buyers.",
    },
    "Steve Novick": {
      choice: "Supported widening the eligible buyer pool",
      action:
        "Voted to remove the income qualification temporarily for the specified already-permitted homes, making it possible to sell them to a wider group of buyers.",
    },
    "Mitch Green": {
      choice: "Supported widening the eligible buyer pool",
      action:
        "Voted to remove the income qualification temporarily for the specified already-permitted homes, making it possible to sell them to a wider group of buyers.",
    },
    "Olivia Clark": {
      choice: "Supported widening the eligible buyer pool",
      action:
        "Voted to remove the income qualification temporarily for the specified already-permitted homes, making it possible to sell them to a wider group of buyers.",
    },
    "Eric Zimmerman": {
      choice: "Opposed removing the buyer-income test",
      action:
        "Voted against the temporary removal of the income qualification for this group of homes receiving development-charge exemptions.",
    },
  },
  "housing-strategy": {
    "Tiffany Koyama Lane": {
      choice: "Supported coordinating the City’s housing plans",
      action:
        "Voted to require a unified strategy connecting housing production, affordability and homelessness prevention across existing plans.",
    },
    "Angelita Morillo": {
      choice: "Supported coordinating the City’s housing plans",
      action:
        "Voted to require a unified strategy connecting housing production, affordability and homelessness prevention across existing plans.",
    },
    "Steve Novick": {
      choice: "Supported coordinating the City’s housing plans",
      action:
        "Voted to require a unified strategy connecting housing production, affordability and homelessness prevention across existing plans.",
    },
    "Mitch Green": {
      choice: "Supported coordinating the City’s housing plans",
      action:
        "Voted to require a unified strategy connecting housing production, affordability and homelessness prevention across existing plans.",
    },
    "Olivia Clark": {
      choice: "Supported coordinating the City’s housing plans",
      action:
        "Voted to require a unified strategy connecting housing production, affordability and homelessness prevention across existing plans.",
    },
    "Eric Zimmerman": {
      choice: "Supported coordinating the City’s housing plans",
      action:
        "Voted to require a unified strategy connecting housing production, affordability and homelessness prevention across existing plans.",
    },
  },
  "homelessness-plan": {
    "Tiffany Koyama Lane": {
      choice: "Supported the shared action plan and performance measures",
      action:
        "Voted to update the coordinated City–County homelessness plan and the measures used to track its progress.",
    },
    "Angelita Morillo": {
      choice: "Supported the shared action plan and performance measures",
      action:
        "Voted to update the coordinated City–County homelessness plan and the measures used to track its progress.",
    },
    "Steve Novick": {
      choice: "Supported the shared action plan and performance measures",
      action:
        "Voted to update the coordinated City–County homelessness plan and the measures used to track its progress.",
    },
    "Mitch Green": {
      choice: "Supported the shared action plan and performance measures",
      action:
        "Voted to update the coordinated City–County homelessness plan and the measures used to track its progress.",
    },
    "Olivia Clark": {
      choice: "Supported the shared action plan and performance measures",
      action:
        "Voted to update the coordinated City–County homelessness plan and the measures used to track its progress.",
    },
    "Eric Zimmerman": {
      choice: "Supported the shared action plan and performance measures",
      action:
        "Voted to update the coordinated City–County homelessness plan and the measures used to track its progress.",
    },
  },
  "permit-pause": {
    "Tiffany Koyama Lane": {
      choice: "Supported the temporary development-cost relief",
      action:
        "Voted for the pause in selected infrastructure and site-upgrade requirements associated with development, accepting the tradeoff between lower project costs and improvements otherwise delivered by applicants.",
    },
    "Angelita Morillo": {
      choice: "Supported the temporary development-cost relief",
      action:
        "Voted for the pause in selected infrastructure and site-upgrade requirements associated with development, accepting the tradeoff between lower project costs and improvements otherwise delivered by applicants.",
    },
    "Steve Novick": {
      choice: "Supported the temporary development-cost relief",
      action:
        "Voted for the pause in selected infrastructure and site-upgrade requirements associated with development, accepting the tradeoff between lower project costs and improvements otherwise delivered by applicants.",
    },
    "Mitch Green": {
      choice: "Supported the temporary development-cost relief",
      action:
        "Voted for the pause in selected infrastructure and site-upgrade requirements associated with development, accepting the tradeoff between lower project costs and improvements otherwise delivered by applicants.",
    },
    "Olivia Clark": {
      choice: "Supported the temporary development-cost relief",
      action:
        "Voted for the pause in selected infrastructure and site-upgrade requirements associated with development, accepting the tradeoff between lower project costs and improvements otherwise delivered by applicants.",
    },
    "Eric Zimmerman": {
      choice: "Absent from this vote",
      action:
        "Supported sending the ordinance forward from the housing committee in August, but was absent from the final September vote. His committee support and final absence are separate facts.",
    },
  },
  "permit-reform": {
    "Tiffany Koyama Lane": {
      choice: "Supported further permitting reform",
      action:
        "Voted to pursue simpler, better-coordinated development rules and a process for measuring whether permitting service improves.",
    },
    "Angelita Morillo": {
      choice: "Supported further permitting reform",
      action:
        "Voted to pursue simpler, better-coordinated development rules and a process for measuring whether permitting service improves.",
    },
    "Steve Novick": {
      choice: "Supported further permitting reform",
      action:
        "Voted to pursue simpler, better-coordinated development rules and a process for measuring whether permitting service improves.",
    },
    "Mitch Green": {
      choice: "Supported further permitting reform",
      action:
        "Voted to pursue simpler, better-coordinated development rules and a process for measuring whether permitting service improves.",
    },
    "Olivia Clark": {
      choice: "Supported further permitting reform",
      action:
        "Voted to pursue simpler, better-coordinated development rules and a process for measuring whether permitting service improves.",
    },
    "Eric Zimmerman": {
      choice: "Supported further permitting reform",
      action:
        "Voted to pursue simpler, better-coordinated development rules and a process for measuring whether permitting service improves.",
    },
  },
  "urban-forest-plan": {
    "Tiffany Koyama Lane": {
      choice: "Supported the amended urban-forest plan",
      action:
        "Voted for the final plan guiding tree-canopy protection, growth and management across Portland.",
    },
    "Angelita Morillo": {
      choice: "Supported the amended urban-forest plan",
      action:
        "Voted for the final plan guiding tree-canopy protection, growth and management across Portland.",
    },
    "Steve Novick": {
      choice: "Supported the amended urban-forest plan",
      action:
        "Voted for the final plan guiding tree-canopy protection, growth and management across Portland.",
    },
    "Mitch Green": {
      choice: "Supported the amended urban-forest plan",
      action:
        "Voted for the final plan guiding tree-canopy protection, growth and management across Portland.",
    },
    "Olivia Clark": {
      choice: "Supported the amended urban-forest plan",
      action:
        "Voted for the final plan guiding tree-canopy protection, growth and management across Portland.",
    },
    "Eric Zimmerman": {
      choice: "Supported the amended urban-forest plan",
      action:
        "Voted for the final plan guiding tree-canopy protection, growth and management across Portland.",
    },
  },
  "tree-responsibility": {
    "Tiffany Koyama Lane": {
      choice: "Opposed weakening the commitment’s wording",
      action:
        "Voted against replacing the more direct planning instruction with expressly conditional language. Both still supported the final forest plan.",
    },
    "Angelita Morillo": {
      choice: "Opposed weakening the commitment’s wording",
      action:
        "Voted against replacing the more direct planning instruction with expressly conditional language. Both still supported the final forest plan.",
    },
    "Steve Novick": {
      choice: "Supported the conditional wording",
      action:
        "Voted to make clear that developing the plan was a step toward a possible future change, rather than the immediate implementation of that change.",
    },
    "Mitch Green": {
      choice: "Supported the conditional wording",
      action:
        "Voted to make clear that developing the plan was a step toward a possible future change, rather than the immediate implementation of that change.",
    },
    "Olivia Clark": {
      choice: "Supported the conditional wording",
      action:
        "Voted to make clear that developing the plan was a step toward a possible future change, rather than the immediate implementation of that change.",
    },
    "Eric Zimmerman": {
      choice: "Supported the conditional wording",
      action:
        "Voted to make clear that developing the plan was a step toward a possible future change, rather than the immediate implementation of that change.",
    },
  },
  "forest-park": {
    "Tiffany Koyama Lane": {
      choice: "Supported the appeal and environmental-review denial",
      action:
        "Voted to overturn approval of this Forest Park utility proposal on the findings adopted by Council.",
    },
    "Angelita Morillo": {
      choice: "Supported the appeal and environmental-review denial",
      action:
        "Voted to overturn approval of this Forest Park utility proposal on the findings adopted by Council.",
    },
    "Steve Novick": {
      choice: "Supported the appeal and environmental-review denial",
      action:
        "Voted to overturn approval of this Forest Park utility proposal on the findings adopted by Council.",
    },
    "Mitch Green": {
      choice: "Supported the appeal and environmental-review denial",
      action:
        "Voted to overturn approval of this Forest Park utility proposal on the findings adopted by Council.",
    },
    "Olivia Clark": {
      choice: "Supported the appeal and environmental-review denial",
      action:
        "Voted to overturn approval of this Forest Park utility proposal on the findings adopted by Council.",
    },
    "Eric Zimmerman": {
      choice: "Supported the appeal and environmental-review denial",
      action:
        "Voted to overturn approval of this Forest Park utility proposal on the findings adopted by Council.",
    },
  },
  "parks-levy": {
    "Tiffany Koyama Lane": {
      choice: "Supported asking voters for the higher parks levy",
      action:
        "Voted to place the proposed parks funding measure before voters, with the higher levy rate and its service commitments.",
    },
    "Angelita Morillo": {
      choice: "Supported asking voters for the higher parks levy",
      action:
        "Voted to place the proposed parks funding measure before voters, with the higher levy rate and its service commitments.",
    },
    "Steve Novick": {
      choice: "Supported asking voters for the higher parks levy",
      action:
        "Voted to place the proposed parks funding measure before voters, with the higher levy rate and its service commitments.",
    },
    "Mitch Green": {
      choice: "Supported asking voters for the higher parks levy",
      action:
        "Voted to place the proposed parks funding measure before voters, with the higher levy rate and its service commitments.",
    },
    "Olivia Clark": {
      choice: "Absent from this vote",
      action:
        "Was absent when Council voted on refer the five-year parks levy to voters. The record does not contain a yes or no vote for this decision.",
    },
    "Eric Zimmerman": {
      choice: "Supported asking voters for the higher parks levy",
      action:
        "Voted to place the proposed parks funding measure before voters, with the higher levy rate and its service commitments.",
    },
  },
  sellwood: {
    "Tiffany Koyama Lane": {
      choice: "Absent from this vote",
      action:
        "Was absent when Council voted on transfer Sellwood Community House to its nonprofit operator. The record does not contain a yes or no vote for this decision.",
    },
    "Angelita Morillo": {
      choice: "Supported the nonprofit transfer with public-benefit conditions",
      action:
        "Voted to transfer the property to the nonprofit operator while retaining a permanent public-benefit restriction.",
    },
    "Steve Novick": {
      choice: "Supported the nonprofit transfer with public-benefit conditions",
      action:
        "Voted to transfer the property to the nonprofit operator while retaining a permanent public-benefit restriction.",
    },
    "Mitch Green": {
      choice: "Supported the nonprofit transfer with public-benefit conditions",
      action:
        "Voted to transfer the property to the nonprofit operator while retaining a permanent public-benefit restriction.",
    },
    "Olivia Clark": {
      choice: "Supported the nonprofit transfer with public-benefit conditions",
      action:
        "Voted to transfer the property to the nonprofit operator while retaining a permanent public-benefit restriction.",
    },
    "Eric Zimmerman": {
      choice: "Supported the nonprofit transfer with public-benefit conditions",
      action:
        "Voted to transfer the property to the nonprofit operator while retaining a permanent public-benefit restriction.",
    },
  },
  "vision-zero": {
    "Tiffany Koyama Lane": {
      choice: "Supported the traffic-safety framework",
      action:
        "Sponsored the Vision Zero resolution, supported adding community engagement and voted for the final traffic-safety framework.",
    },
    "Angelita Morillo": {
      choice: "Supported the traffic-safety framework",
      action:
        "Voted for the renewed Vision Zero effort, community participation and analysis of disproportionate traffic deaths among people experiencing homelessness.",
    },
    "Steve Novick": {
      choice: "Supported the traffic-safety framework",
      action:
        "Voted for the renewed Vision Zero effort, community participation and analysis of disproportionate traffic deaths among people experiencing homelessness.",
    },
    "Mitch Green": {
      choice: "Supported the traffic-safety framework",
      action:
        "Voted for the renewed Vision Zero effort, community participation and analysis of disproportionate traffic deaths among people experiencing homelessness.",
    },
    "Olivia Clark": {
      choice: "Supported the traffic-safety framework",
      action:
        "Voted for the renewed Vision Zero effort, community participation and analysis of disproportionate traffic deaths among people experiencing homelessness.",
    },
    "Eric Zimmerman": {
      choice: "Supported the traffic-safety framework",
      action:
        "Moved the unanimously approved amendment requiring analysis of traffic deaths involving people experiencing homelessness, then backed the final resolution.",
    },
  },
  "82nd-transit": {
    "Tiffany Koyama Lane": {
      choice: "Supported the 82nd Avenue transit framework",
      action:
        "Voted to advance the preferred transit alternative aimed at improving speed and reliability on 82nd Avenue.",
    },
    "Angelita Morillo": {
      choice: "Supported the 82nd Avenue transit framework",
      action:
        "Voted to advance the preferred transit alternative aimed at improving speed and reliability on 82nd Avenue.",
    },
    "Steve Novick": {
      choice: "Supported the 82nd Avenue transit framework",
      action:
        "Voted to advance the preferred transit alternative aimed at improving speed and reliability on 82nd Avenue.",
    },
    "Mitch Green": {
      choice: "Supported the 82nd Avenue transit framework",
      action:
        "Voted to advance the preferred transit alternative aimed at improving speed and reliability on 82nd Avenue.",
    },
    "Olivia Clark": {
      choice: "Supported the 82nd Avenue transit framework",
      action:
        "Voted to advance the preferred transit alternative aimed at improving speed and reliability on 82nd Avenue.",
    },
    "Eric Zimmerman": {
      choice: "Supported the 82nd Avenue transit framework",
      action:
        "Voted to advance the preferred transit alternative aimed at improving speed and reliability on 82nd Avenue.",
    },
  },
  "privacy-office": {
    "Tiffany Koyama Lane": {
      choice: "Supported a central data-and-privacy office",
      action:
        "Voted to establish a City authority for data governance and privacy rather than leaving those responsibilities scattered across bureaus.",
    },
    "Angelita Morillo": {
      choice: "Supported a central data-and-privacy office",
      action:
        "Voted to establish a City authority for data governance and privacy rather than leaving those responsibilities scattered across bureaus.",
    },
    "Steve Novick": {
      choice: "Supported a central data-and-privacy office",
      action:
        "Voted to establish a City authority for data governance and privacy rather than leaving those responsibilities scattered across bureaus.",
    },
    "Mitch Green": {
      choice: "Supported a central data-and-privacy office",
      action:
        "Voted to establish a City authority for data governance and privacy rather than leaving those responsibilities scattered across bureaus.",
    },
    "Olivia Clark": {
      choice: "Supported a central data-and-privacy office",
      action:
        "Voted to establish a City authority for data governance and privacy rather than leaving those responsibilities scattered across bureaus.",
    },
    "Eric Zimmerman": {
      choice: "Supported a central data-and-privacy office",
      action:
        "Voted to establish a City authority for data governance and privacy rather than leaving those responsibilities scattered across bureaus.",
    },
  },
  "privacy-framework": {
    "Tiffany Koyama Lane": {
      choice: "Supported the final privacy framework",
      action:
        "Voted for the amended framework directing how the City should manage privacy and data-use risks.",
    },
    "Angelita Morillo": {
      choice: "Supported the final privacy framework",
      action:
        "Voted for the amended framework directing how the City should manage privacy and data-use risks.",
    },
    "Steve Novick": {
      choice: "Supported the final privacy framework",
      action:
        "Voted for the amended framework directing how the City should manage privacy and data-use risks.",
    },
    "Mitch Green": {
      choice: "Supported the final privacy framework",
      action:
        "Voted for the amended framework directing how the City should manage privacy and data-use risks.",
    },
    "Olivia Clark": {
      choice: "Supported the final privacy framework",
      action:
        "Voted for the amended framework directing how the City should manage privacy and data-use risks.",
    },
    "Eric Zimmerman": {
      choice: "Supported the final privacy framework",
      action:
        "Opposed the December committee referral and sought to table the proposal, then supported the amended final framework before full Council in February.",
    },
  },
  "asset-strategy": {
    "Tiffany Koyama Lane": {
      choice: "Supported coordinated infrastructure planning",
      action:
        "Voted to assess infrastructure needs, align investment priorities across bureaus and examine long-term financing options.",
    },
    "Angelita Morillo": {
      choice: "Supported coordinated infrastructure planning",
      action:
        "Voted to assess infrastructure needs, align investment priorities across bureaus and examine long-term financing options.",
    },
    "Steve Novick": {
      choice: "Supported coordinated infrastructure planning",
      action:
        "Voted to assess infrastructure needs, align investment priorities across bureaus and examine long-term financing options.",
    },
    "Mitch Green": {
      choice: "Supported coordinated infrastructure planning",
      action:
        "Voted to assess infrastructure needs, align investment priorities across bureaus and examine long-term financing options.",
    },
    "Olivia Clark": {
      choice: "Supported coordinated infrastructure planning",
      action:
        "Voted to assess infrastructure needs, align investment priorities across bureaus and examine long-term financing options.",
    },
    "Eric Zimmerman": {
      choice: "Supported coordinated infrastructure planning",
      action:
        "Voted to assess infrastructure needs, align investment priorities across bureaus and examine long-term financing options.",
    },
  },
  "committee-structure": {
    "Tiffany Koyama Lane": {
      choice: "Supported the revised committee structure",
      action:
        "Voted for the five-committee structure and full-Council finance and governance committee.",
    },
    "Angelita Morillo": {
      choice: "Absent from this vote",
      action:
        "Was absent when Council voted on replace eight policy committees with five. The record does not contain a yes or no vote for this decision.",
    },
    "Steve Novick": {
      choice: "Supported the revised committee structure",
      action:
        "Voted for the five-committee structure and full-Council finance and governance committee.",
    },
    "Mitch Green": {
      choice: "Supported the revised committee structure",
      action:
        "Voted for the five-committee structure and full-Council finance and governance committee.",
    },
    "Olivia Clark": {
      choice: "Supported the revised committee structure",
      action:
        "Voted for the five-committee structure and full-Council finance and governance committee.",
    },
    "Eric Zimmerman": {
      choice: "Opposed the committee reorganization",
      action:
        "Voted against replacing the existing committee arrangement with the proposed five-committee structure.",
    },
  },
  "council-office-budget": {
    "Tiffany Koyama Lane": {
      choice: "Supported additional resources for elected offices",
      action:
        "Voted to use contingency funds to increase Council and mayoral office budgets and staffing during the transition to the new government.",
    },
    "Angelita Morillo": {
      choice: "Supported additional resources for elected offices",
      action:
        "Voted to use contingency funds to increase Council and mayoral office budgets and staffing during the transition to the new government.",
    },
    "Steve Novick": {
      choice: "Opposed the elected-office budget increase",
      action:
        "Voted against the package increasing Council and mayoral office resources from contingency.",
      reason: {
        label: "Novick · later statement of budget priorities",
        text: "In a later budget explanation, he argued that Council office spending was too high compared with other cities and should be reduced to restore frontline services.",
        source: {
          label: "Novick · later statement of budget priorities",
          url: "https://www.portland.gov/council/districts/3/steve-novick/news/2026/5/8/novick-newsletter-may-8th",
          kind: "Candidate statement",
          date: "May 8, 2026",
        },
      },
    },
    "Mitch Green": {
      choice: "Supported additional resources for elected offices",
      action:
        "Voted to use contingency funds to increase Council and mayoral office budgets and staffing during the transition to the new government.",
    },
    "Olivia Clark": {
      choice: "Supported additional resources for elected offices",
      action:
        "Voted to use contingency funds to increase Council and mayoral office budgets and staffing during the transition to the new government.",
    },
    "Eric Zimmerman": {
      choice: "Supported additional resources for elected offices",
      action:
        "Voted to use contingency funds to increase Council and mayoral office budgets and staffing during the transition to the new government.",
    },
  },
  "council-priorities": {
    "Tiffany Koyama Lane": {
      choice: "Supported a shared annual priority-setting process",
      action:
        "Voted for the annual Council planning procedure, including a shared framework that identifies agreement, disagreement and unresolved priorities.",
    },
    "Angelita Morillo": {
      choice: "Supported a shared annual priority-setting process",
      action:
        "Voted for the annual Council planning procedure, including a shared framework that identifies agreement, disagreement and unresolved priorities.",
    },
    "Steve Novick": {
      choice: "Opposed this annual planning procedure",
      action:
        "Voted against the final procedure for annual Council priority-setting.",
    },
    "Mitch Green": {
      choice: "Supported a shared annual priority-setting process",
      action:
        "Voted for the annual Council planning procedure, including a shared framework that identifies agreement, disagreement and unresolved priorities.",
    },
    "Olivia Clark": {
      choice: "Supported a shared annual priority-setting process",
      action:
        "Voted for the annual Council planning procedure, including a shared framework that identifies agreement, disagreement and unresolved priorities.",
    },
    "Eric Zimmerman": {
      choice: "Supported a shared annual priority-setting process",
      action:
        "Voted for the annual Council planning procedure, including a shared framework that identifies agreement, disagreement and unresolved priorities.",
    },
  },
  "surplus-inquiry": {
    "Tiffany Koyama Lane": {
      choice: "Supported the Council-led public inquiry",
      action:
        "Voted for the process to gather and disclose information about the housing funds and the administration’s communication with Council.",
    },
    "Angelita Morillo": {
      choice: "Supported the Council-led public inquiry",
      action:
        "Voted for the process to gather and disclose information about the housing funds and the administration’s communication with Council.",
    },
    "Steve Novick": {
      choice: "Opposed this inquiry process",
      action:
        "Supported an alternative calling for an administrative investigation or work with the Auditor, then opposed the final Council inquiry resolution.",
    },
    "Mitch Green": {
      choice: "Supported the Council-led public inquiry",
      action:
        "Voted for the process to gather and disclose information about the housing funds and the administration’s communication with Council.",
    },
    "Olivia Clark": {
      choice: "Opposed this inquiry process",
      action:
        "Supported an alternative calling for an administrative investigation or work with the Auditor, then opposed the final Council inquiry resolution.",
    },
    "Eric Zimmerman": {
      choice: "Opposed this inquiry process",
      action:
        "Voted against the final public-inquiry resolution. This records a choice about the proposed investigation process rather than establishing approval of any financial mismanagement.",
    },
  },
  "campaign-enforcement": {
    "Tiffany Koyama Lane": {
      choice: "Supported the revised enforcement code",
      action:
        "Voted to update the City’s campaign-finance code in response to the court ruling and the amendments considered by Council.",
    },
    "Angelita Morillo": {
      choice: "Supported the revised enforcement code",
      action:
        "Voted to update the City’s campaign-finance code in response to the court ruling and the amendments considered by Council.",
    },
    "Steve Novick": {
      choice: "Supported the revised enforcement code",
      action:
        "Voted to update the City’s campaign-finance code in response to the court ruling and the amendments considered by Council.",
    },
    "Mitch Green": {
      choice: "Supported the revised enforcement code",
      action:
        "Voted to update the City’s campaign-finance code in response to the court ruling and the amendments considered by Council.",
    },
    "Olivia Clark": {
      choice: "Supported the revised enforcement code",
      action:
        "Voted to update the City’s campaign-finance code in response to the court ruling and the amendments considered by Council.",
    },
    "Eric Zimmerman": {
      choice: "Supported the revised enforcement code",
      action:
        "Voted to update the City’s campaign-finance code in response to the court ruling and the amendments considered by Council.",
    },
  },
  "small-donor": {
    "Tiffany Koyama Lane": {
      choice: "Supported the public campaign-finance program revisions",
      action:
        "Voted for the Small Donor Elections code changes recommended to improve the program after the 2024 election.",
    },
    "Angelita Morillo": {
      choice: "Supported the public campaign-finance program revisions",
      action:
        "Voted for the Small Donor Elections code changes recommended to improve the program after the 2024 election.",
    },
    "Steve Novick": {
      choice: "Supported the public campaign-finance program revisions",
      action:
        "Voted for the Small Donor Elections code changes recommended to improve the program after the 2024 election.",
    },
    "Mitch Green": {
      choice: "Supported the public campaign-finance program revisions",
      action:
        "Voted for the Small Donor Elections code changes recommended to improve the program after the 2024 election.",
    },
    "Olivia Clark": {
      choice: "Supported the public campaign-finance program revisions",
      action:
        "Voted for the Small Donor Elections code changes recommended to improve the program after the 2024 election.",
    },
    "Eric Zimmerman": {
      choice: "Supported the public campaign-finance program revisions",
      action:
        "Voted for the Small Donor Elections code changes recommended to improve the program after the 2024 election.",
    },
  },
  "labor-complaint": {
    "Tiffany Koyama Lane": {
      choice: "Supported withdrawing the complaint authority",
      action:
        "Voted to reverse the prior authorization for the City Attorney to file the labor complaint.",
    },
    "Angelita Morillo": {
      choice: "Supported withdrawing the complaint authority",
      action:
        "Voted to reverse the prior authorization for the City Attorney to file the labor complaint.",
    },
    "Steve Novick": {
      choice: "Supported withdrawing the complaint authority",
      action:
        "Voted to reverse the prior authorization for the City Attorney to file the labor complaint.",
    },
    "Mitch Green": {
      choice: "Supported withdrawing the complaint authority",
      action:
        "Co-introduced the resolution to withdraw the previous Council’s complaint authority, then supported its unanimous passage.",
    },
    "Olivia Clark": {
      choice: "Supported withdrawing the complaint authority",
      action:
        "Voted to reverse the prior authorization for the City Attorney to file the labor complaint.",
    },
    "Eric Zimmerman": {
      choice: "Supported withdrawing the complaint authority",
      action:
        "Co-introduced the resolution to withdraw the previous Council’s complaint authority, then supported its unanimous passage.",
    },
  },
  "professional-workers": {
    "Tiffany Koyama Lane": {
      choice: "Supported the first Professional Workers contract",
      action:
        "Voted to approve the negotiated initial agreement establishing pay, leave and other employment conditions for the bargaining unit.",
    },
    "Angelita Morillo": {
      choice: "Supported the first Professional Workers contract",
      action:
        "Voted to approve the negotiated initial agreement establishing pay, leave and other employment conditions for the bargaining unit.",
    },
    "Steve Novick": {
      choice: "Supported the first Professional Workers contract",
      action:
        "Voted to approve the negotiated initial agreement establishing pay, leave and other employment conditions for the bargaining unit.",
    },
    "Mitch Green": {
      choice: "Supported the first Professional Workers contract",
      action:
        "Voted to approve the negotiated initial agreement establishing pay, leave and other employment conditions for the bargaining unit.",
    },
    "Olivia Clark": {
      choice: "Supported the first Professional Workers contract",
      action:
        "Voted to approve the negotiated initial agreement establishing pay, leave and other employment conditions for the bargaining unit.",
    },
    "Eric Zimmerman": {
      choice: "Supported the first Professional Workers contract",
      action:
        "Voted to approve the negotiated initial agreement establishing pay, leave and other employment conditions for the bargaining unit.",
    },
  },
  "afscme-contract": {
    "Tiffany Koyama Lane": {
      choice: "Absent from this vote",
      action:
        "Was absent when Council voted on ratify the AFSCME Local 189 successor contract. The record does not contain a yes or no vote for this decision.",
    },
    "Angelita Morillo": {
      choice: "Supported the negotiated AFSCME agreement",
      action:
        "Voted to ratify the successor agreement covering wages, benefits and working conditions for represented City employees.",
    },
    "Steve Novick": {
      choice: "Supported the negotiated AFSCME agreement",
      action:
        "Voted to ratify the successor agreement covering wages, benefits and working conditions for represented City employees.",
    },
    "Mitch Green": {
      choice: "Supported the negotiated AFSCME agreement",
      action:
        "Voted to ratify the successor agreement covering wages, benefits and working conditions for represented City employees.",
    },
    "Olivia Clark": {
      choice: "Supported the negotiated AFSCME agreement",
      action:
        "Voted to ratify the successor agreement covering wages, benefits and working conditions for represented City employees.",
    },
    "Eric Zimmerman": {
      choice: "Supported the negotiated AFSCME agreement",
      action:
        "Voted to ratify the successor agreement covering wages, benefits and working conditions for represented City employees.",
    },
  },
  "trade-unions-contract": {
    "Tiffany Koyama Lane": {
      choice: "Absent from this vote",
      action:
        "Was absent when Council voted on ratify the District Council of Trade Unions contract. The record does not contain a yes or no vote for this decision.",
    },
    "Angelita Morillo": {
      choice: "Supported the negotiated trade-union agreement",
      action:
        "Voted to ratify the contract covering pay and employment terms for the represented trade-union workers.",
    },
    "Steve Novick": {
      choice: "Supported the negotiated trade-union agreement",
      action:
        "Voted to ratify the contract covering pay and employment terms for the represented trade-union workers.",
    },
    "Mitch Green": {
      choice: "Supported the negotiated trade-union agreement",
      action:
        "Voted to ratify the contract covering pay and employment terms for the represented trade-union workers.",
    },
    "Olivia Clark": {
      choice: "Supported the negotiated trade-union agreement",
      action:
        "Voted to ratify the contract covering pay and employment terms for the represented trade-union workers.",
    },
    "Eric Zimmerman": {
      choice: "Supported the negotiated trade-union agreement",
      action:
        "Voted to ratify the contract covering pay and employment terms for the represented trade-union workers.",
    },
  },
  "review-staff-contract": {
    "Tiffany Koyama Lane": {
      choice: "Absent from this vote",
      action:
        "Was absent when Council voted on approve retention terms for Independent Police Review staff. The record does not contain a yes or no vote for this decision.",
    },
    "Angelita Morillo": {
      choice: "Supported the staff retention agreement",
      action:
        "Voted to approve employment terms and retention payments for represented Independent Police Review staff.",
    },
    "Steve Novick": {
      choice: "Supported the staff retention agreement",
      action:
        "Voted to approve employment terms and retention payments for represented Independent Police Review staff.",
    },
    "Mitch Green": {
      choice: "Supported the staff retention agreement",
      action:
        "Voted to approve employment terms and retention payments for represented Independent Police Review staff.",
    },
    "Olivia Clark": {
      choice: "Supported the staff retention agreement",
      action:
        "Voted to approve employment terms and retention payments for represented Independent Police Review staff.",
    },
    "Eric Zimmerman": {
      choice: "Supported the staff retention agreement",
      action:
        "Voted to approve employment terms and retention payments for represented Independent Police Review staff.",
    },
  },
  "children-remand": {
    "Tiffany Koyama Lane": {
      choice: "Supported reconsidering the proposed grants",
      action:
        "Voted to send the allocation recommendations back for further work rather than approve the proposed awards at that meeting.",
    },
    "Angelita Morillo": {
      choice: "Supported reconsidering the proposed grants",
      action:
        "Voted to send the allocation recommendations back for further work rather than approve the proposed awards at that meeting.",
    },
    "Steve Novick": {
      choice: "Opposed sending the recommendations back",
      action:
        "Voted against remanding the proposed Children’s Levy allocations for reconsideration.",
    },
    "Mitch Green": {
      choice: "Supported reconsidering the proposed grants",
      action:
        "Voted to send the allocation recommendations back for further work rather than approve the proposed awards at that meeting.",
    },
    "Olivia Clark": {
      choice: "Opposed sending the recommendations back",
      action:
        "Voted against remanding the proposed Children’s Levy allocations for reconsideration.",
    },
    "Eric Zimmerman": {
      choice: "Opposed sending the recommendations back",
      action:
        "Voted against remanding the proposed Children’s Levy allocations for reconsideration.",
    },
  },
  "children-grants": {
    "Tiffany Koyama Lane": {
      choice: "Supported the final grant package",
      action:
        "Supported Morillo’s unsuccessful amendment to keep waiting for revised recommendations, then voted for the final three-year grant package.",
    },
    "Angelita Morillo": {
      choice: "Supported the final grant package",
      action:
        "Supported Morillo’s unsuccessful amendment to keep waiting for revised recommendations, then voted for the final three-year grant package.",
    },
    "Steve Novick": {
      choice: "Supported the final grant package",
      action:
        "Opposed Morillo’s amendment to keep waiting for revised recommendations, then voted for the final three-year grant package.",
    },
    "Mitch Green": {
      choice: "Supported the final grant package",
      action:
        "Supported Morillo’s unsuccessful amendment to keep waiting for revised recommendations, then voted for the final three-year grant package.",
    },
    "Olivia Clark": {
      choice: "Supported the final grant package",
      action:
        "Opposed Morillo’s amendment to keep waiting for revised recommendations, then voted for the final three-year grant package.",
    },
    "Eric Zimmerman": {
      choice: "Supported the final grant package",
      action:
        "Opposed Morillo’s amendment to keep waiting for revised recommendations, then voted for the final three-year grant package.",
    },
  },
  "sanctuary-code": {
    "Tiffany Koyama Lane": {
      choice: "Supported the binding sanctuary protections",
      action:
        "Voted to put stronger sanctuary requirements and implementation duties into City Code.",
    },
    "Angelita Morillo": {
      choice: "Supported the binding sanctuary protections",
      action:
        "Voted to put stronger sanctuary requirements and implementation duties into City Code.",
    },
    "Steve Novick": {
      choice: "Supported the binding sanctuary protections",
      action:
        "Voted to put stronger sanctuary requirements and implementation duties into City Code.",
    },
    "Mitch Green": {
      choice: "Supported the binding sanctuary protections",
      action:
        "Voted to put stronger sanctuary requirements and implementation duties into City Code.",
    },
    "Olivia Clark": {
      choice: "Supported the binding sanctuary protections",
      action:
        "Voted to put stronger sanctuary requirements and implementation duties into City Code.",
    },
    "Eric Zimmerman": {
      choice: "Supported the binding sanctuary protections",
      action:
        "Voted to put stronger sanctuary requirements and implementation duties into City Code.",
    },
  },
  "protect-portland": {
    "Tiffany Koyama Lane": {
      choice: "Supported the preparedness and public-information initiative",
      action:
        "Voted for the City’s coordinated response, transparency and rights-information measures alongside the sanctuary ordinance.",
    },
    "Angelita Morillo": {
      choice: "Supported the preparedness and public-information initiative",
      action:
        "Voted for the City’s coordinated response, transparency and rights-information measures alongside the sanctuary ordinance.",
    },
    "Steve Novick": {
      choice: "Supported the preparedness and public-information initiative",
      action:
        "Voted for the City’s coordinated response, transparency and rights-information measures alongside the sanctuary ordinance.",
    },
    "Mitch Green": {
      choice: "Supported the preparedness and public-information initiative",
      action:
        "Voted for the City’s coordinated response, transparency and rights-information measures alongside the sanctuary ordinance.",
    },
    "Olivia Clark": {
      choice: "Supported the preparedness and public-information initiative",
      action:
        "Voted for the City’s coordinated response, transparency and rights-information measures alongside the sanctuary ordinance.",
    },
    "Eric Zimmerman": {
      choice: "Supported the preparedness and public-information initiative",
      action:
        "Voted for the City’s coordinated response, transparency and rights-information measures alongside the sanctuary ordinance.",
    },
  },
  "officer-identification": {
    "Tiffany Koyama Lane": {
      choice: "Supported the identification and masking rules",
      action:
        "Voted for the amended officer-identification code and the direction to publish the policy and address any required bargaining.",
    },
    "Angelita Morillo": {
      choice: "Supported the identification and masking rules",
      action:
        "Voted for the amended officer-identification code and the direction to publish the policy and address any required bargaining.",
    },
    "Steve Novick": {
      choice: "Supported the identification and masking rules",
      action:
        "Voted for the amended officer-identification code and the direction to publish the policy and address any required bargaining.",
    },
    "Mitch Green": {
      choice: "Supported the identification and masking rules",
      action:
        "Voted for the amended officer-identification code and the direction to publish the policy and address any required bargaining.",
    },
    "Olivia Clark": {
      choice: "Opposed the identification and masking ordinance",
      action:
        "Voted against the final ordinance setting these identification and facial-covering requirements.",
    },
    "Eric Zimmerman": {
      choice: "Opposed the identification and masking ordinance",
      action:
        "Voted against the final ordinance setting these identification and facial-covering requirements.",
    },
  },
  "investment-policy": {
    "Tiffany Koyama Lane": {
      choice: "Supported the policy with ethical-investment work",
      action:
        "Voted for the amended investment-policy resolution, including development of options for screening investments for human-rights and other impacts.",
    },
    "Angelita Morillo": {
      choice: "Supported the policy with ethical-investment work",
      action:
        "Voted for the amended investment-policy resolution, including development of options for screening investments for human-rights and other impacts.",
    },
    "Steve Novick": {
      choice: "Supported the policy with ethical-investment work",
      action:
        "Voted for the amended investment-policy resolution, including development of options for screening investments for human-rights and other impacts.",
    },
    "Mitch Green": {
      choice: "Supported the policy with ethical-investment work",
      action:
        "Voted for the amended investment-policy resolution, including development of options for screening investments for human-rights and other impacts.",
    },
    "Olivia Clark": {
      choice: "Absent from this vote",
      action:
        "Was absent when Council voted on adopt investment policy and seek ethical-screening options. The record does not contain a yes or no vote for this decision.",
    },
    "Eric Zimmerman": {
      choice: "Opposed the amended investment-policy resolution",
      action:
        "Voted against the ethical-policy amendment and the final investment-policy resolution.",
    },
  },
  "storefront-plan": {
    "Tiffany Koyama Lane": {
      choice: "Supported accepting the storefront action plan",
      action:
        "Voted to accept the proposed direction for improving storefront conditions and City support for business owners.",
    },
    "Angelita Morillo": {
      choice: "Opposed accepting this storefront action plan",
      action:
        "Voted against accepting this report and action plan. The record does not turn that vote into opposition to every form of small-business assistance.",
    },
    "Steve Novick": {
      choice: "Supported accepting the storefront action plan",
      action:
        "Voted to accept the proposed direction for improving storefront conditions and City support for business owners.",
    },
    "Mitch Green": {
      choice: "Supported accepting the storefront action plan",
      action:
        "Voted to accept the proposed direction for improving storefront conditions and City support for business owners.",
    },
    "Olivia Clark": {
      choice: "Supported accepting the storefront action plan",
      action:
        "Voted to accept the proposed direction for improving storefront conditions and City support for business owners.",
    },
    "Eric Zimmerman": {
      choice: "Supported accepting the storefront action plan",
      action:
        "Voted to accept the proposed direction for improving storefront conditions and City support for business owners.",
    },
  },
  "cully-plan": {
    "Tiffany Koyama Lane": {
      choice: "Supported the Cully investment priorities",
      action:
        "Voted to approve the community-developed framework directing future district investments, including housing stability and small-business support.",
    },
    "Angelita Morillo": {
      choice: "Supported the Cully investment priorities",
      action:
        "Voted to approve the community-developed framework directing future district investments, including housing stability and small-business support.",
    },
    "Steve Novick": {
      choice: "Supported the Cully investment priorities",
      action:
        "Voted to approve the community-developed framework directing future district investments, including housing stability and small-business support.",
    },
    "Mitch Green": {
      choice: "Supported the Cully investment priorities",
      action:
        "Opposed the plan’s committee referral in February, then supported the final resolution in March. His final vote approved the district’s investment priorities.",
    },
    "Olivia Clark": {
      choice: "Supported the Cully investment priorities",
      action:
        "Voted to approve the community-developed framework directing future district investments, including housing stability and small-business support.",
    },
    "Eric Zimmerman": {
      choice: "Absent from this vote",
      action:
        "Was absent when Council voted on approve Cully’s five-year investment action plan. The record does not contain a yes or no vote for this decision.",
    },
  },
  campesinos: {
    "Tiffany Koyama Lane": {
      choice: "Supported the Campesinos Boulevard name",
      action:
        "Co-sponsored the renaming ordinance, advanced an amendment accepted unanimously and voted for passage.",
    },
    "Angelita Morillo": {
      choice: "Supported the Campesinos Boulevard name",
      action:
        "Voted to rename the street in recognition of farmworkers collectively and authorize the City’s implementation and notification work.",
    },
    "Steve Novick": {
      choice: "Supported the Campesinos Boulevard name",
      action:
        "Advanced an amendment accepted unanimously and voted for the final renaming ordinance.",
    },
    "Mitch Green": {
      choice: "Supported the Campesinos Boulevard name",
      action:
        "Voted to rename the street in recognition of farmworkers collectively and authorize the City’s implementation and notification work.",
    },
    "Olivia Clark": {
      choice: "Supported the Campesinos Boulevard name",
      action:
        "Moved the unanimously approved emergency clause to respond to community concerns and facilitate staff implementation, then supported the ordinance.",
    },
    "Eric Zimmerman": {
      choice: "Supported the Campesinos Boulevard name",
      action:
        "Voted to rename the street in recognition of farmworkers collectively and authorize the City’s implementation and notification work.",
    },
  },
  "force-fed-poultry": {
    "Tiffany Koyama Lane": {
      choice: "Supported the sales prohibition",
      action:
        "Voted for the ordinance restricting sales of products from force-fed poultry after the transition period.",
    },
    "Angelita Morillo": {
      choice: "Supported the sales prohibition",
      action:
        "Voted for the ordinance restricting sales of products from force-fed poultry after the transition period.",
    },
    "Steve Novick": {
      choice: "Supported the sales prohibition",
      action:
        "Voted for the ordinance restricting sales of products from force-fed poultry after the transition period.",
    },
    "Mitch Green": {
      choice: "Supported the sales prohibition",
      action:
        "Voted for the ordinance restricting sales of products from force-fed poultry after the transition period.",
    },
    "Olivia Clark": {
      choice: "Opposed the final sales prohibition",
      action:
        "Advanced an amendment that Council adopted, then opposed the final sales prohibition. Her participation in revising implementation did not change her final no vote.",
    },
    "Eric Zimmerman": {
      choice: "Opposed the final sales prohibition",
      action: "Voted against the final ordinance restricting these products.",
    },
  },
  "board-eligibility": {
    "Tiffany Koyama Lane": {
      choice: "Rejected the proposed eligibility removal",
      action:
        "Voted against the administration’s proposed ineligibility finding for Halsey, helping defeat that part of the report.",
    },
    "Angelita Morillo": {
      choice: "Rejected the proposed eligibility removal",
      action:
        "Voted against the administration’s proposed ineligibility finding for Halsey, helping defeat that part of the report.",
    },
    "Steve Novick": {
      choice: "Supported the proposed eligibility removal",
      action:
        "Voted to approve the administration’s proposed ineligibility finding for Halsey. The motion failed.",
    },
    "Mitch Green": {
      choice: "Rejected the proposed eligibility removal",
      action:
        "Voted against the administration’s proposed ineligibility finding for Halsey, helping defeat that part of the report.",
    },
    "Olivia Clark": {
      choice: "Supported the proposed eligibility removal",
      action:
        "Voted to approve the administration’s proposed ineligibility finding for Halsey. The motion failed.",
    },
    "Eric Zimmerman": {
      choice: "Supported the proposed eligibility removal",
      action:
        "Voted to approve the administration’s proposed ineligibility finding for Halsey. The motion failed.",
    },
  },
  "board-removal": {
    "Tiffany Koyama Lane": {
      choice: "Supported removing the alternate",
      action:
        "Voted to approve the portion of the report removing Weinstein for cause under the board’s requirements.",
    },
    "Angelita Morillo": {
      choice: "Supported removing the alternate",
      action:
        "Voted to approve the portion of the report removing Weinstein for cause under the board’s requirements.",
    },
    "Steve Novick": {
      choice: "Supported removing the alternate",
      action:
        "Voted to approve the portion of the report removing Weinstein for cause under the board’s requirements.",
    },
    "Mitch Green": {
      choice: "Supported removing the alternate",
      action:
        "Voted to approve the portion of the report removing Weinstein for cause under the board’s requirements.",
    },
    "Olivia Clark": {
      choice: "Opposed removing the alternate",
      action:
        "Voted against the portion of the report removing Weinstein from the alternate roster.",
    },
    "Eric Zimmerman": {
      choice: "Opposed removing the alternate",
      action:
        "Voted against the portion of the report removing Weinstein from the alternate roster.",
    },
  },
};

export const additionalTopics: CouncilDisagreement[] = [
  {
    id: "water",
    label: "Water bills & Bull Run",
    decisionIds: ["water-bonds", "water-rates", "sewer-rates"],
    question: "Who accepted the borrowing—and who accepted higher bills?",
    context:
      "Portland is building a filtration system for its Bull Run drinking-water supply. Council faced two different questions: whether to authorize borrowing for construction, and what to charge customers for the water system’s annual costs. Sewer and stormwater rates were decided separately. Reading these votes together exposes differences that a single “for or against Bull Run” label would conceal.",
    contrast:
      "Green opposed the bonds but backed the water-rate increase. Koyama Lane and Zimmerman backed the bonds but opposed the rate increase.",
    takeaway:
      "Our reading: the coalitions changed between financing construction and setting household charges. Morillo opposed both water decisions but supported the sewer and stormwater schedule.",
    sources: [],
    readings: {
      "Tiffany Koyama Lane": {
        headline: "Supported borrowing; opposed higher water bills",
        text: "Approved the Bull Run bond financing, then voted against both the annual water-rate increase and the sewer/stormwater schedule. Her votes distinguish paying for construction from accepting those annual charges.",
      },
      "Angelita Morillo": {
        headline: "Opposed water borrowing and the water-rate increase",
        text: "Voted no on the bonds and the annual water schedule, but yes on sewer and stormwater rates. Her opposition was not a blanket rejection of every utility funding decision.",
      },
      "Steve Novick": {
        headline: "Supported the borrowing and the annual rates",
        text: "Approved the water bonds, the water-rate increase and the sewer/stormwater schedule. These votes accepted both construction financing and the annual charges supporting the systems.",
      },
      "Mitch Green": {
        headline: "Opposed the bonds; supported annual rates",
        text: "Rejected the water bond authorization but approved the water-rate increase and sewer/stormwater schedule. His votes separated the construction-financing decision from annual utility funding.",
      },
      "Olivia Clark": {
        headline: "Supported the borrowing and the annual rates",
        text: "Approved the water bonds and both annual utility-rate schedules. On these votes, she accepted the financing package and the customer charges that support utility operations and obligations.",
      },
      "Eric Zimmerman": {
        headline: "Supported the bonds; opposed the rate increases",
        text: "Approved the water bond authorization, then opposed the water and sewer/stormwater rate schedules. He publicly placed those no votes within his concern about the cumulative cost of living.",
      },
    },
  },
  {
    id: "transportation",
    label: "Street funding & sidewalks",
    decisionIds: ["street-fee", "sidewalk-plan", "transport-rates"],
    question: "How should Portland pay for streets it already has?",
    context:
      "Portland’s street budget has struggled to keep up with deteriorating roads, missing sidewalks and safety needs. A monthly utility fee creates a steadier revenue source, but adds another recurring household and business expense. The comparison separates that new fee from the earlier sidewalk-planning resolution and the annual parking and permit schedule.",
    contrast:
      "Five of these six supported the new monthly fee; Zimmerman opposed it. Novick was the exception on the earlier sidewalk-program vote.",
    takeaway:
      "Our reading: Zimmerman helped determine how the fee would be spent while opposing its creation. Novick opposed one sidewalk framework but supported the broader revenue package; those are different decisions.",
    sources: [],
    readings: {
      "Tiffany Koyama Lane": {
        headline: "Supported the fee and directed money to safety",
        text: "Backed the sidewalk framework and annual fee schedule. With Zimmerman, she secured the maintenance and safety allocation in the new utility fee, then voted to enact it.",
      },
      "Angelita Morillo": {
        headline: "Supported new revenue and the sidewalk framework",
        text: "Voted for the sidewalk program, the transportation utility fee and the annual transportation schedule. These choices accepted additional charges to support repairs and safety work.",
      },
      "Steve Novick": {
        headline: "Supported the fee; rejected the earlier sidewalk framework",
        text: "Voted against the 2025 sidewalk-program resolution but for the 2026 utility fee and annual transportation charges. His record does not fit a simple opposition-to-street-spending description.",
      },
      "Mitch Green": {
        headline: "Supported the fee and a review of business charges",
        text: "Backed all three measures. He and Clark added a process to reconsider how commercial properties are charged, reflecting that business utility use is not the same thing as road use.",
      },
      "Olivia Clark": {
        headline: "Favored stable revenue for repairs",
        text: "Supported all three measures and helped lead the utility-fee effort. Her public argument was that deferring maintenance would make future residents pay more.",
      },
      "Eric Zimmerman": {
        headline: "Opposed new charges, but shaped their use",
        text: "Supported the sidewalk framework, opposed the utility fee and annual transportation schedule, and helped direct the fee’s revenue toward maintenance and safety before its passage.",
      },
    },
  },
  {
    id: "arts-tax",
    label: "Arts tax & household costs",
    decisionIds: ["arts-tax"],
    question: "Preserve arts funding by charging fewer people more?",
    context:
      "The arts tax helps pay for elementary-school arts teachers and nonprofit arts organizations. Its flat assessment and separate filing requirement have also drawn criticism. The 2026 reform tried to maintain revenue while exempting more low-income residents; those still subject to the tax would pay a higher amount. Council’s disagreement was about that combination, not whether art itself has value.",
    contrast:
      "Koyama Lane, Morillo and Green backed the reform. Novick, Clark and Zimmerman voted no.",
    takeaway:
      "Our reading: the yes votes accepted a larger assessment paired with broader exemptions. Novick criticized the tax’s design; Zimmerman emphasized affordability and a public vote. The roll call alone does not supply Clark’s individual explanation.",
    sources: [],
  },
  {
    id: "street-response",
    label: "Unarmed crisis response",
    decisionIds: ["psr-framework", "psr-committee"],
    question: "What role should unarmed responders have in emergencies?",
    context:
      "Portland Street Response sends mental-health and medical responders to certain crises that do not require an armed police response. Council’s 2025 resolution sought a broader, co-equal role for that service and a community committee to help guide it. Whether to endorse that framework, how to staff it and who to appoint were separate decisions.",
    contrast:
      "Clark opposed the expansion framework, while the other five supported the final resolution. All six later backed committee appointments.",
    takeaway:
      "Our reading: the final June vote distinguishes Clark from the other five. Zimmerman changed from opposing the committee referral to supporting the amended Council resolution; Clark’s later appointment vote also belongs in the record.",
    sources: [],
    readings: {
      "Tiffany Koyama Lane": {
        headline: "Supported the framework and community committee",
        text: "Backed the expanded unarmed-response framework in June and the committee appointments in December.",
      },
      "Angelita Morillo": {
        headline: "Supported expansion with an unarmed-service emphasis",
        text: "Backed both decisions. Her earlier joint statement supported expanding access while warning that police involvement could weaken trust in the service.",
      },
      "Steve Novick": {
        headline: "Supported the final expansion framework",
        text: "Supported sending the proposal forward from committee and voted for the final resolution and the later committee appointments.",
      },
      "Mitch Green": {
        headline: "Supported expansion with an unarmed-service emphasis",
        text: "Backed both decisions. His earlier joint statement favored preserving the service’s unarmed mission while expanding the situations it could respond to.",
      },
      "Olivia Clark": {
        headline: "Opposed the framework; supported later appointments",
        text: "Voted no on the June expansion resolution, then yes on seating its community committee in December. Those votes show a distinction between the framework and carrying out the appointments.",
      },
      "Eric Zimmerman": {
        headline: "Changed from a committee no to a final yes",
        text: "Opposed referral in April, then supported the amended resolution in June and committee appointments in December. Showing only the committee vote would misstate his final position.",
      },
    },
  },
  {
    id: "police-accountability",
    label: "Police accountability",
    decisionIds: [
      "oversight-first-board",
      "board-eligibility",
      "board-removal",
      "oversight-replacements",
      "community-policing",
      "oversight-funding",
    ],
    question: "Where did they agree on oversight—and where did they split?",
    context:
      "Portland has a new police-misconduct accountability system and a separate community-policing advisory committee. Council appointed the first accountability board, then split over two proposed removals: it rejected declaring Schuyler (Hugh) Halsey ineligible but approved removing alternate Bob Weinstein for cause. A later budget fight asked whether expected oversight underspending could pay for other services. These decisions reveal different coalitions within the same institution.",
    contrast:
      "All six supported the initial board. Novick joined Clark and Zimmerman on the unsuccessful eligibility removal, but joined Koyama Lane, Morillo and Green on removing the alternate.",
    takeaway:
      "Our reading: support for creating a functioning board did not settle disputes about its membership or budget. The separate removal votes and the June funding amendment are more revealing than a single “supports police oversight” label.",
    sources: [],
    readings: {
      "Tiffany Koyama Lane": {
        headline: "Backed the board and protected its expected underspending",
        text: "Supported the initial and replacement appointments, rejected the proposed ineligibility removal and supported removing the alternate. She opposed Clark’s June proposal to use expected oversight underspending elsewhere.",
      },
      "Angelita Morillo": {
        headline: "Backed the board and protected its expected underspending",
        text: "Supported the appointments, rejected the proposed ineligibility removal and supported removing the alternate. She opposed the proposed use of expected oversight underspending for other services.",
      },
      "Steve Novick": {
        headline:
          "Supported both proposed removals and the funding alternative",
        text: "Supported the appointments and both proposed removals, though the eligibility motion failed. He also backed Clark’s proposal to use expected oversight underspending for selected service restorations.",
      },
      "Mitch Green": {
        headline: "Backed the board and protected its expected underspending",
        text: "Supported the appointments, rejected the proposed ineligibility removal and supported removing the alternate. He opposed using expected oversight underspending for the alternative service package.",
      },
      "Olivia Clark": {
        headline: "Split on membership; proposed using expected underspending",
        text: "Supported the first appointments, backed the failed eligibility removal, opposed removing the alternate and opposed the replacement package. She later proposed using expected oversight underspending to restore police and fire services.",
      },
      "Eric Zimmerman": {
        headline: "Split on membership; supported the funding alternative",
        text: "Supported the first appointments, backed the failed eligibility removal, opposed removing the alternate and opposed the replacement package. He supported Clark’s alternative use of expected oversight underspending.",
      },
    },
  },
  {
    id: "police-enforcement",
    label: "Police staffing & property enforcement",
    decisionIds: ["police-staffing", "nuisance-properties"],
    question:
      "How much emphasis should the City put on police capacity and enforcement?",
    context:
      "Two debates concerned the reach of conventional policing. One requested a costed assessment of future staffing; the other expanded the tools used against properties associated with repeated criminal activity, including trafficking. The staffing resolution was a planning decision, while the nuisance ordinance changed enforcement rules. Neither should be confused with an immediate appropriation for more officers.",
    contrast:
      "Novick, Clark and Zimmerman supported both measures. Koyama Lane, Morillo and Green opposed both.",
    takeaway:
      "Our reading: these votes show a consistent difference over these specific policing initiatives. Novick’s public case for the nuisance ordinance emphasized trafficking survivors, students near McDaniel High School and the practical difficulty of documenting repeated incidents.",
    sources: [],
  },
  {
    id: "firearms",
    label: "Firearms in public buildings",
    decisionIds: ["firearms-table"],
    question:
      "Proceed with building-specific gun restrictions, or put the proposal on hold?",
    context:
      "A change in state law allowed local governments to restrict licensed concealed carry in certain public buildings used for official meetings. Portland’s proposal addressed specified City facilities; it was not a prohibition on all firearms throughout Portland. As of September 18, the latest action was a committee decision to table the item after months of consideration.",
    contrast:
      "Zimmerman voted to table it. Morillo and Novick voted against that pause. The other three were not committee members.",
    takeaway:
      "The stage matters: a yes here means support for pausing the proposal, not support for the gun restriction. No final full-Council vote is available as of the review date.",
    sources: [],
  },
  {
    id: "psychedelics",
    label: "Natural psychedelics",
    decisionIds: ["psychedelics-referral"],
    question: "Should personal use receive lower police priority?",
    context:
      "The proposal concerns non-commercial personal use of naturally occurring psychedelic plants and fungi. It would set a local enforcement priority and establish an advisory commission, while retaining enforcement against sales, impaired driving and unsafe conduct. A city enforcement priority would not repeal state or federal drug laws. The three incumbents serving on the committee supported advancing the amended proposal.",
    contrast:
      "Morillo, Novick and Zimmerman supported referral. Koyama Lane, Green and Clark had no vote in that committee.",
    takeaway:
      "This is a pending proposal, not an enacted legalization measure. The guide records the committee action without inventing final positions for members who have not had a full-Council vote.",
    sources: [],
  },
  {
    id: "climate-fund",
    label: "Climate fund & general services",
    decisionIds: ["climate-plan", "climate-interest"],
    question:
      "Which climate investments—and when should interest pay for other services?",
    context:
      "Voters created the Portland Clean Energy Community Benefits Fund to finance climate action with community benefits. Council now makes decisions about its large investment plan and about using interest earnings in the City’s general budget. Those are distinct choices: a councilor can support climate investments, oppose a particular allocation package and still support a specified use of interest for services.",
    contrast:
      "Morillo and Green opposed the amended investment plan. Morillo alone among these six opposed the May interest transfer; their later budget-restoration positions differed again.",
    takeaway:
      "Our reading: there is no single “protect or spend the climate fund” split. Compare the proposed uses and conditions. The budget section separately explains the June and July service-restoration amendments.",
    sources: [],
    readings: {
      "Tiffany Koyama Lane": {
        headline: "Supported the plan and the May transfer",
        text: "Approved the investment-plan amendments and the transfer of audited interest to the general budget. She also supported later efforts to use additional interest for service restorations.",
      },
      "Angelita Morillo": {
        headline: "Opposed both May’s transfer and the final plan package",
        text: "Rejected these two measures but later promoted targeted service restorations using climate-fund interest. The terms and beneficiaries of a transfer matter to understanding her record.",
      },
      "Steve Novick": {
        headline: "Supported the plan and interest for selected services",
        text: "Approved both measures. In the later budget fight, he offered a smaller interest-funded restoration package rather than supporting every proposed use of the fund.",
      },
      "Mitch Green": {
        headline: "Opposed the plan package; supported the interest transfer",
        text: "Voted no on the final investment-plan amendments but yes on May’s interest transfer. He also backed later service-restoration proposals using interest earnings.",
      },
      "Olivia Clark": {
        headline: "Supported the plan and the May transfer",
        text: "Approved both measures. She later proposed paying for selected restorations with expected police-oversight underspending and backed July’s smaller package.",
      },
      "Eric Zimmerman": {
        headline: "Supported the plan and the May transfer",
        text: "Approved both measures but opposed the broader June service-restoration proposal. His record distinguishes this baseline interest transfer from further proposed spending.",
      },
    },
  },
  {
    id: "permitting",
    label: "Permitting & development costs",
    decisionIds: ["permit-pause", "permit-reform"],
    question:
      "Reduce construction barriers—and who covers the public improvements?",
    context:
      "Some development permits trigger requirements for sidewalks, accessibility ramps, street trees or other site improvements. Pausing selected requirements can make projects less expensive, but it can also leave the City with work that private applicants would otherwise provide. Council paired temporary relief with a longer effort to make its codes and permitting process more consistent.",
    contrast:
      "All five incumbents present supported the 2025 pause; Zimmerman supported committee referral but missed the final vote. All six supported the next reform phase.",
    takeaway:
      "These measures show substantial agreement, along with a concrete tradeoff: easier development can defer public improvements or shift their costs. Whether the reforms deliver more homes and faster permits must be evaluated separately from these votes.",
    sources: [],
  },
  {
    id: "parks-trees",
    label: "Parks, trees & public land",
    decisionIds: [
      "parks-levy",
      "urban-forest-plan",
      "tree-responsibility",
      "forest-park",
      "sellwood",
    ],
    question: "Who should pay for and care for Portland’s parks and trees?",
    context:
      "The record includes a parks-tax referral, an urban-forest plan, a contested amendment about future City responsibility, a Forest Park land-use appeal and the transfer of a neighborhood community facility to its nonprofit operator. These decisions concern both public access and who bears maintenance costs. Their different legal effects matter: a planning commitment, a tax referral and a property transfer are not interchangeable.",
    contrast:
      "There was broad agreement on the final parks and forest decisions, but Koyama Lane and Morillo opposed adding conditional wording to the tree-responsibility plan.",
    takeaway:
      "Our reading: the forest-plan amendment reveals a difference concealed by the unanimous final vote. The parks levy and Sellwood transfer also show that public services can be supported through different funding and ownership arrangements.",
    sources: [],
    readings: {
      "Tiffany Koyama Lane": {
        headline: "Supported the levy and a stronger tree-planning commitment",
        text: "Backed the parks-levy referral, final forest plan and Forest Park appeal. She opposed making the tree-responsibility planning instruction expressly conditional and was absent from the Sellwood transfer vote.",
      },
      "Angelita Morillo": {
        headline: "Supported the levy and a stronger tree-planning commitment",
        text: "Backed the levy referral, forest plan, Forest Park appeal and Sellwood transfer. She joined Koyama Lane in opposing the conditional wording added to the tree-responsibility plan.",
      },
      "Steve Novick": {
        headline: "Supported the levy and conditional tree planning",
        text: "Backed the final levy referral, forest plan, Forest Park appeal and Sellwood transfer. He supported qualifying the commitment to future City responsibility in the forest plan.",
      },
      "Mitch Green": {
        headline: "Supported the levy and conditional tree planning",
        text: "Backed all four final measures and supported the conditional wording in the tree-responsibility plan. On that amendment, he differed from Koyama Lane and Morillo.",
      },
      "Olivia Clark": {
        headline: "Supported the forest decisions and nonprofit transfer",
        text: "Backed the final forest plan, conditional tree-planning language, Forest Park appeal and Sellwood transfer. She was absent on the parks-levy referral, so that roll call supplies no yes or no vote.",
      },
      "Eric Zimmerman": {
        headline: "Supported the levy and conditional tree planning",
        text: "Backed the parks-levy referral, final forest plan, conditional wording, Forest Park appeal and Sellwood transfer. These votes combine support for public services with different ways of funding and maintaining them.",
      },
    },
  },
  {
    id: "traffic-transit",
    label: "Traffic safety & 82nd Avenue",
    decisionIds: ["vision-zero", "82nd-transit"],
    question: "Where did they agree on safer streets and better transit?",
    context:
      "Vision Zero is the City’s effort to prevent traffic deaths and serious injuries. The 82nd Avenue project addresses slow and unreliable transit on a major corridor. Both received unanimous support, but they involve different work: coordinating safety measures across bureaus versus choosing the framework for a specific transit investment.",
    contrast:
      "All six supported both measures. Koyama Lane sponsored the Vision Zero resolution; Zimmerman added attention to traffic deaths among homeless residents.",
    takeaway:
      "There is shared ground here. Disagreements about new street fees elsewhere in the guide should not be used to erase these recorded votes for safety planning and transit development.",
    sources: [],
  },
  {
    id: "privacy",
    label: "Privacy, surveillance & AI",
    decisionIds: ["privacy-office", "privacy-framework", "data-centers"],
    question: "How should City data and new technology be governed?",
    context:
      "Routine City records can reveal sensitive information about residents when shared, combined or reused. Council created a central privacy office and a framework for managing those risks, including surveillance and artificial intelligence. A separate data-center resolution addressed transparency and possible future restrictions on facilities; it did not impose a moratorium.",
    contrast:
      "All six supported the final privacy measures and data-center resolution. Zimmerman moved from opposing committee referral of the privacy framework to supporting the amended final version.",
    takeaway:
      "Our reading: the final votes show substantial agreement on public oversight of data and technology. Distinguish rules for City-held information from regulation of privately operated data centers.",
    sources: [],
  },
  {
    id: "infrastructure",
    label: "Infrastructure & maintenance",
    decisionIds: ["asset-strategy"],
    question: "How should Portland prioritize its aging public assets?",
    context:
      "Bureaus maintain different inventories, budgets and standards for roads, buildings, utilities and other public assets. The citywide strategy was intended to make those needs comparable, identify financial gaps and help Council decide what to repair first. It also called for considering longer-term funding tools.",
    contrast: "All six supported developing the asset-management strategy.",
    takeaway:
      "The shared planning vote is useful context, but choices about actual borrowing and new charges appear in the water and street-funding comparisons. Supporting a strategy does not establish support for every future funding measure.",
    sources: [],
  },
  {
    id: "governance",
    label: "Council powers, offices & oversight",
    decisionIds: [
      "council-office-budget",
      "committee-structure",
      "council-priorities",
      "surplus-inquiry",
    ],
    question:
      "How much capacity should Council build, and how should it exercise oversight?",
    context:
      "The new 12-member Council had to decide how to staff its offices, organize committee work, set priorities and obtain information from the administration. These choices affect who develops policy and how spending is scrutinized. They also carry tradeoffs between legislative capacity, administrative cooperation, transparency and the money left for direct services.",
    contrast:
      "Novick opposed the initial office-budget increase and the annual priority process. Zimmerman opposed the committee reorganization. The housing-funds inquiry split Koyama Lane, Morillo and Green from Novick, Clark and Zimmerman.",
    takeaway:
      "Our reading: these are disagreements about how the new government should work, not merely parliamentary housekeeping. Novick and Clark’s support for an alternative investigation matters when interpreting their no votes on the final inquiry.",
    sources: [],
    readings: {
      "Tiffany Koyama Lane": {
        headline: "Supported added office resources and the public inquiry",
        text: "Backed the office-budget increase, committee reorganization, annual priority process and inquiry into housing funds. Her votes supported building Council’s policy and oversight capacity.",
      },
      "Angelita Morillo": {
        headline: "Supported added office resources and the public inquiry",
        text: "Backed the office-budget increase, priority-setting process and housing-funds inquiry. She was absent from the committee-reorganization vote.",
      },
      "Steve Novick": {
        headline:
          "Opposed higher office spending and the final inquiry process",
        text: "Rejected the office-budget increase and annual priority procedure, but supported reorganizing committees. On the housing funds, he backed an alternative administrative investigation or audit approach before opposing the final inquiry resolution.",
      },
      "Mitch Green": {
        headline: "Supported added office resources and the public inquiry",
        text: "Backed all four measures: office resources, committee reorganization, annual priority-setting and the public inquiry into how housing-fund information reached Council.",
      },
      "Olivia Clark": {
        headline:
          "Supported office capacity; preferred a different investigation",
        text: "Backed office resources, the committee structure and annual priorities. She supported an alternative investigation or audit approach to the housing funds, then opposed the final inquiry resolution.",
      },
      "Eric Zimmerman": {
        headline:
          "Supported office resources; opposed the reorganization and inquiry",
        text: "Backed the office-budget increase and annual priority-setting, but opposed the five-committee reorganization and the final housing-funds inquiry resolution.",
      },
    },
  },
  {
    id: "elections",
    label: "Campaign finance & elections",
    decisionIds: ["small-donor", "campaign-enforcement"],
    question: "What rules should govern money in City elections?",
    context:
      "Portland has both limits and disclosure requirements for campaign money and a Small Donor Elections program that supplies public matching funds to qualifying candidates. Council considered revisions to program administration and, separately, changes to campaign-finance enforcement after a court ruling. These final votes show agreement among the six incumbents.",
    contrast:
      "All six backed the Small Donor Elections revisions and the amended campaign-finance enforcement code.",
    takeaway:
      "The votes describe their legislative choices. They do not by themselves evaluate any candidate’s fundraising practices or establish that all amendment debates were unanimous.",
    sources: [],
  },
  {
    id: "labor",
    label: "Labor contracts & City workers",
    decisionIds: [
      "labor-complaint",
      "professional-workers",
      "afscme-contract",
      "trade-unions-contract",
      "review-staff-contract",
    ],
    question:
      "Where did they agree on worker contracts—and where does the budget record differ?",
    context:
      "Council ratifies negotiated contracts setting pay, benefits and working conditions, then makes separate budget decisions about services and staffing. The major agreements here drew broad support. The layoff and restoration fights in the budget comparison reveal more disagreement than the contract votes themselves.",
    contrast:
      "All six supported the first Professional Workers contract and withdrawal of the labor-complaint authority. All five present supported the other three agreements.",
    takeaway:
      "Our reading: the contract votes do not justify labeling only one side of the later budget divide as supportive of workers. Compare negotiated terms alongside the specific jobs each member sought to retain or restore.",
    sources: [],
  },
  {
    id: "children",
    label: "Children’s Levy & grant choices",
    decisionIds: ["children-remand", "children-grants"],
    question: "Reconsider the grant awards, or move ahead to fund services?",
    context:
      "The Children’s Levy finances services through grants to outside organizations. In June 2025, Council first split over whether to send funding recommendations back, then returned to decide how to fund the next three years. The central distinction was whether to continue reconsidering the allocation process or proceed with the grant package.",
    contrast:
      "Koyama Lane, Morillo and Green backed reconsideration. Novick, Clark and Zimmerman opposed the remand. All six ultimately approved the grants.",
    takeaway:
      "Our reading: the disagreement concerned allocation and timing, followed by shared support for the final funding. A bare unanimous roll call would miss the dispute; a bare remand vote would miss the eventual resolution.",
    sources: [],
  },
  {
    id: "sanctuary",
    label: "Sanctuary & officer identification",
    decisionIds: [
      "sanctuary-code",
      "protect-portland",
      "officer-identification",
    ],
    question:
      "Where did shared support for sanctuary give way to disagreement?",
    context:
      "All six backed the October 2025 sanctuary and Protect Portland measures. A later ordinance went further into visible law-enforcement identification, facial coverings and procedures for checking claimed authority. The two sets of decisions show why a general label such as “supports sanctuary” is not enough to describe the methods a councilor will endorse.",
    contrast:
      "All six supported the sanctuary measures. Novick joined Koyama Lane, Morillo and Green on the identification ordinance; Clark and Zimmerman opposed it.",
    takeaway:
      "Our reading: the disagreement is over this additional enforcement and identification tool, within an earlier shared sanctuary position. The detention-facility fee comparison shows another distinct coalition.",
    sources: [],
    readings: {
      "Tiffany Koyama Lane": {
        headline: "Supported sanctuary and the identification ordinance",
        text: "Backed both October sanctuary measures and the later law-enforcement identification and masking ordinance.",
      },
      "Angelita Morillo": {
        headline: "Supported sanctuary and the identification ordinance",
        text: "Backed the sanctuary measures and the later identification ordinance. These votes sit alongside her sponsorship of the separate detention-facility fee measure.",
      },
      "Steve Novick": {
        headline:
          "Supported identification rules, despite opposing detention fees",
        text: "Backed sanctuary and the identification ordinance, while opposing the separate detention-fee precedent. His choices vary with the local tool being proposed.",
      },
      "Mitch Green": {
        headline: "Supported sanctuary and the identification ordinance",
        text: "Backed the October sanctuary measures and the later identification rules. He also supported the separate detention-facility fees.",
      },
      "Olivia Clark": {
        headline: "Supported sanctuary; opposed the identification ordinance",
        text: "Backed both sanctuary measures and the detention-fee ordinance, but opposed the later identification and masking rules. Her record distinguishes among the proposed local responses.",
      },
      "Eric Zimmerman": {
        headline: "Supported sanctuary; opposed the identification ordinance",
        text: "Backed the October sanctuary measures, then opposed the later identification ordinance. He was absent from the separate final detention-fee vote.",
      },
    },
  },
  {
    id: "economy",
    label: "Business support & City investments",
    decisionIds: [
      "storefront-plan",
      "cully-plan",
      "business-tax",
      "investment-policy",
    ],
    question:
      "Which tools should support local businesses and guide public investment?",
    context:
      "Council considered storefront assistance, neighborhood investment, a larger business-tax exemption and ethical criteria for the City’s own investment portfolio. These are different tools with different beneficiaries. A councilor’s vote on one does not establish a general position for or against business.",
    contrast:
      "All six backed the business-tax exemption. Morillo opposed accepting the storefront plan; Zimmerman opposed the amended investment-policy resolution.",
    takeaway:
      "Our reading: the small-business tax vote shows common ground, while the storefront and investment-policy votes reveal disagreements about particular approaches. The ethical-investment resolution sought options; it did not enact a company blacklist.",
    sources: [],
    readings: {
      "Tiffany Koyama Lane": {
        headline:
          "Backed tax relief, storefront support and ethical-policy work",
        text: "Supported the business-tax exemption, storefront report, Cully investment plan and amended investment-policy resolution.",
      },
      "Angelita Morillo": {
        headline: "Backed tax relief; opposed the storefront report",
        text: "Supported the larger business-tax exemption, Cully plan and ethical-investment work, but opposed accepting the storefront-support report. The report vote did not erase her support for those other business and investment tools.",
      },
      "Steve Novick": {
        headline: "Backed the four measures",
        text: "Supported the business-tax exemption, storefront report, Cully plan and amended investment-policy resolution. These votes combined tax relief, place-based investment and further ethical-policy work.",
      },
      "Mitch Green": {
        headline: "Backed the final measures after a committee disagreement",
        text: "Supported all four final measures. On Cully, he opposed committee referral before supporting the final plan, a change that a single-stage summary would miss.",
      },
      "Olivia Clark": {
        headline: "Backed tax relief, storefront support and the Cully plan",
        text: "Supported those three measures and was absent from the final investment-policy vote. Her absence supplies no final position on the ethical-policy amendment.",
      },
      "Eric Zimmerman": {
        headline:
          "Backed tax relief and storefront support; opposed the investment resolution",
        text: "Co-sponsored the tax exemption and supported the storefront report, but opposed the amended investment-policy resolution. He was absent from the final Cully-plan vote.",
      },
    },
  },
  {
    id: "public-memory",
    label: "Campesinos Boulevard & public recognition",
    decisionIds: ["campesinos"],
    question: "Whom should a public street honor?",
    context:
      "Council chose to honor farmworkers as a group through the name Campesinos Boulevard rather than continue the existing individual commemoration. The ordinance also addressed how the change would proceed: Council waived the usual renaming process and directed public notice and sign changes. The final vote occurred in September 2026 after earlier proposals had returned to committee.",
    contrast:
      "All six supported the renaming. Koyama Lane co-sponsored it; Novick and Clark also advanced changes adopted during the final consideration.",
    takeaway:
      "This is shared ground in the final record. Distinctions in their roles can be described without manufacturing a disagreement where the final votes were unanimous.",
    sources: [],
  },
  {
    id: "animal-welfare",
    label: "Animal welfare & business rules",
    decisionIds: ["force-fed-poultry"],
    question:
      "Should animal-welfare concerns justify a local sales restriction?",
    context:
      "The foie gras debate asked whether Portland should prohibit products made by force-feeding poultry, and how to manage the transition for businesses that sell them. The policy creates a targeted market restriction to address a production practice. Council also considered amendments before reaching the final vote.",
    contrast:
      "Koyama Lane, Morillo, Novick and Green voted yes. Clark and Zimmerman voted no.",
    takeaway:
      "The vote identifies a concrete difference over local regulation of this practice. It does not support a sweeping judgment about either side’s concern for animals or businesses.",
    sources: [],
  },
];
