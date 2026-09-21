import type { Evidence } from "../../types";
import type { CandidateContact, ContactChannel } from "../types";

/**
 * How to reach each campaign, from what the candidate published: the
 * pamphlet statement, the campaign site, or the campaign email on their own
 * public filing or announcement. Filled by research on September 20, 2026;
 * a candidate with no published channel gets a `none` reason, never a
 * guessed address.
 *
 * Method (September 20, 2026): each pamphlet statement was read as text
 * (District 3 on PDF pages 53–60, District 4 on 61–66); every website the
 * statement prints was fetched and its final https address recorded; each
 * site's contact, volunteer or connect page and its header/footer were read
 * for an email, phone, form and social profile links; and the three
 * candidates whose only public venue is a City filing were read from that
 * filing's contact fields. Social profiles are listed only when the
 * campaign site or the pamphlet links them. Facebook and LinkedIn refuse
 * automated requests, so those profile links are recorded as the site links
 * them without a resolution check.
 */

const PAMPHLET =
  "https://multco.us/file/multnomah_county_voters%27_pamphlet_-_november_2026_general_election/download";

const REVIEWED_ON = "2026-09-20";

const pamphlet = (page: number, note?: string): Evidence => ({
  label: `Multnomah County voters’ pamphlet · PDF page ${page}`,
  url: `${PAMPHLET}#page=${page}`,
  kind: "Candidate statement",
  date: "November 2026 edition; reviewed September 20, 2026",
  ...(note ? { note } : {}),
});

const site = (label: string, url: string, note?: string): Evidence => ({
  label,
  url,
  kind: "Candidate statement",
  date: "Website reviewed September 20, 2026",
  ...(note ? { note } : {}),
});

/** A City candidate filing; the kind matches the filing source already on the brief. */
const filing = (label: string, url: string, date: string, note?: string): Evidence => ({
  label,
  url,
  kind: "Candidate statement",
  date,
  ...(note ? { note } : {}),
});

type From = ContactChannel["from"];

const web = (url: string, from: From): ContactChannel => ({
  url,
  label: url.replace(/^https:\/\/(www\.)?/, "").replace(/\/$/, ""),
  kind: "website",
  from,
});

const email = (address: string, from: From): ContactChannel => ({
  url: `mailto:${address}`,
  label: address,
  kind: "email",
  from,
});

/** `digits` is the ten-digit US number; `label` is how the candidate printed it. */
const phone = (digits: string, label: string, from: From): ContactChannel => ({
  url: `tel:+1${digits}`,
  label,
  kind: "phone",
  from,
});

const form = (
  url: string,
  label: "Contact form" | "Volunteer form",
  from: From,
): ContactChannel => ({ url, label, kind: "form", from });

const social = (label: string, url: string, from: From): ContactChannel => ({
  url,
  label,
  kind: "social",
  from,
});

const entry = (
  candidateId: string,
  channels: ContactChannel[],
  sources: Evidence[],
  none?: string,
): CandidateContact => ({
  candidateId,
  channels,
  ...(none ? { none } : {}),
  sources,
  reviewedOn: REVIEWED_ON,
});

export const contacts: CandidateContact[] = [
  /* ── District 3 ─────────────────────────────────────────────────────── */

  entry(
    "ali-beaudoin",
    [email("Ali.Beaudoin1@gmail.com", "announcement")],
    [
      {
        label: "Beaudoin’s campaign announcement and priorities",
        url: "https://www.linkedin.com/posts/ali-beaudoin-75b9558_meet-the-candidates-for-city-council-district-activity-7503657810526846979-aEnb",
        kind: "Candidate statement",
        date: "September 2026; reviewed September 20, 2026",
        note: "No pamphlet statement and no campaign site found; the announcement gives this address for the campaign.",
      },
    ],
  ),

  entry(
    "joel-corcoran",
    [
      web("https://www.corcoranforportland.org/", "pamphlet"),
      email("team@corcoranforportland.org", "site"),
      phone("5036833060", "503-683-3060", "site"),
      form("https://www.corcoranforportland.org/contact", "Contact form", "site"),
      social("Instagram", "https://www.instagram.com/corcoran4pdx/", "pamphlet"),
      social("Facebook", "https://www.facebook.com/corcoran4pdx", "site"),
      social("LinkedIn", "https://www.linkedin.com/company/corcoran4pdx", "site"),
    ],
    [
      pamphlet(56, "Prints the website and the Instagram handle @corcoran4pdx."),
      site(
        "Corcoran · contact page",
        "https://www.corcoranforportland.org/contact",
        "The page holds a contact form; the email, phone and profile links are in the site footer.",
      ),
    ],
  ),

  entry(
    "guy-frankenstein",
    [],
    [
      {
        label: "Mercury questionnaire · Frankenstein’s responses",
        url: "https://www.portlandmercury.com/news/meet-the-candidates-for-city-council-district-3/",
        kind: "Candidate statement",
        date: "Reviewed September 20, 2026",
      },
    ],
    "No pamphlet statement or City filing among his sources, and the Mercury questionnaire lists no website, email or phone. The guyfrankenstein.com domain serves a placeholder page (“Website under deconstruction”) with a personal address and no campaign identification, so it is not treated as a campaign channel.",
  ),

  entry(
    "matthias-hallett",
    [
      web("https://www.matthiashallett.com/", "pamphlet"),
      form("https://www.matthiashallett.com/contact", "Contact form", "site"),
      social("Instagram", "https://www.instagram.com/matthiashallettfordistrict3/", "site"),
      social("Facebook", "https://www.facebook.com/profile.php?id=61573265956273", "site"),
      social("X", "https://x.com/MallettHallett", "site"),
      social("TikTok", "https://www.tiktok.com/@matthiashallettfo", "site"),
    ],
    [
      pamphlet(58),
      site(
        "Hallett · contact page",
        "https://www.matthiashallett.com/contact",
        "The contact page is an embedded form and lists no email or phone; the profile links are in the site footer.",
      ),
    ],
  ),

  entry(
    "patrick-hilton",
    [
      web("https://www.patrickhilton4pdx.org/", "pamphlet"),
      email("patrickhilton4d3pdx@outlook.com", "site"),
      form("https://www.patrickhilton4pdx.org/volunteer", "Volunteer form", "site"),
    ],
    [
      pamphlet(57, "Prints patrickhilton4pdx.org, which resolves at www.patrickhilton4pdx.org."),
      site(
        "Hilton · home page",
        "https://www.patrickhilton4pdx.org/",
        "No contact page; the email is in the site footer. No social profile links on the site.",
      ),
      site("Hilton · volunteer page", "https://www.patrickhilton4pdx.org/volunteer"),
    ],
  ),

  entry(
    "larry-kelly",
    [],
    [pamphlet(54)],
    "No website, email or phone in the pamphlet statement, and no campaign site found.",
  ),

  entry(
    "tiffany-koyama-lane",
    [
      web("https://teachertiffanyforthepeople.com/", "pamphlet"),
      email("info@teachertiffanyforthepeople.com", "site"),
      form("https://teachertiffanyforthepeople.com/#join-us", "Volunteer form", "site"),
      social("Instagram", "https://www.instagram.com/teachertiffanyforthepeople/", "site"),
      social("Facebook", "https://www.facebook.com/teachertiffanyforthepeople", "site"),
      social("LinkedIn", "https://www.linkedin.com/company/teacher-tiffany-for-the-people", "site"),
    ],
    [
      pamphlet(54),
      site(
        "Koyama Lane · home page",
        "https://teachertiffanyforthepeople.com/",
        "No separate contact page; the email and profile links are in the site footer and the volunteer sign-up form is the Join Us section of the home page.",
      ),
    ],
  ),

  entry(
    "kenneth-kent-r-landgraver-iii",
    [],
    [pamphlet(60)],
    "No website, email or phone in the pamphlet statement, and no campaign site found.",
  ),

  entry(
    "keir-legree",
    [
      web("https://www.keir4pdx.com/", "pamphlet"),
      form("https://www.keir4pdx.com/#Volunteer%20Sign%20Up", "Volunteer form", "site"),
    ],
    [
      pamphlet(59, "Prints keir4pdx.com, which resolves at www.keir4pdx.com."),
      site(
        "Legree · home page",
        "https://www.keir4pdx.com/",
        "The site lists no email, phone or social profiles; the volunteer sign-up form is a section of the home page, linked from the site’s own navigation.",
      ),
    ],
  ),

  entry(
    "esther-leon",
    [
      web("https://estherforportland.com/", "pamphlet"),
      email("esther.for.portland@gmail.com", "site"),
      social("Instagram", "https://www.instagram.com/dr.estherforportland/", "site"),
    ],
    [
      pamphlet(60),
      site(
        "León · home page",
        "https://estherforportland.com/",
        "Single-page site; the email is in the Contact section and the Instagram profile is embedded under a Social Media heading.",
      ),
    ],
  ),

  entry(
    "darren-mccormick",
    [email("darrenzyx@gmail.com", "filing")],
    [
      filing(
        "2026 candidate filing · contact fields on PDF page 3",
        "https://www.portland.gov/auditor/elections/documents/mccormick-darren-2026-aud-120/download#page=3",
        "Filed July 2026; reviewed September 20, 2026",
        "The filing’s primary (campaign) email. Its campaign phone and campaign website fields are blank, and no pamphlet statement or campaign site exists.",
      ),
    ],
  ),

  entry(
    "angelita-morillo",
    [
      web("https://www.angelitaforportland.com/", "pamphlet"),
      email("info@angelitaforportland.com", "site"),
      social("Instagram", "https://www.instagram.com/pnwpolicyangel/", "site"),
      social("Facebook", "https://www.facebook.com/pnwpolicyangel", "site"),
      social("Bluesky", "https://bsky.app/profile/pnwpolicyangel.bsky.social", "site"),
      social("TikTok", "https://www.tiktok.com/@pnwpolicyangel", "site"),
    ],
    [
      pamphlet(56),
      site(
        "Morillo · get involved page",
        "https://www.angelitaforportland.com/get-involved",
        "The page links out to shift sign-ups rather than holding a form; the email and profile links are in the site footer.",
      ),
    ],
  ),

  entry(
    "steve-novick",
    [
      web("https://www.novickforportland.com/", "pamphlet"),
      email("vote@novickforportland.com", "site"),
      social("Instagram", "https://www.instagram.com/stevenovick96/", "site"),
      social("Facebook", "https://www.facebook.com/steve.novick.OR/", "site"),
    ],
    [
      pamphlet(57),
      site(
        "Novick · get involved page",
        "https://www.novickforportland.com/get-involved",
        "The page holds a newsletter sign-up, not a contact form; the email is in the site footer and the page links the profiles.",
      ),
    ],
  ),

  entry(
    "cristal-otero",
    [
      web("https://www.cristalforportland.com/", "pamphlet"),
      form("https://www.cristalforportland.com/volunteer", "Volunteer form", "site"),
    ],
    [
      pamphlet(59),
      site(
        "Otero · volunteer page",
        "https://www.cristalforportland.com/volunteer",
        "The site lists no email, phone or social profiles; the volunteer page embeds a Google Form.",
      ),
    ],
  ),

  entry(
    "terry-parker",
    [],
    [pamphlet(55)],
    "No website, email or phone in the pamphlet statement, and no campaign site found.",
  ),

  entry(
    "heart-free-pham",
    [web("https://fightwithheartpdx.com/", "filing"), email("fightwithheartpdx@gmail.com", "filing")],
    [
      filing(
        "2026 candidate filing · contact fields on PDF page 3",
        "https://www.portland.gov/auditor/elections/documents/pham-heart-free-2026-aud-120-original/download#page=3",
        "August 17, 2026; reviewed September 20, 2026",
        "The filing’s primary (campaign) email and campaign website fields; its campaign phone field is blank. No pamphlet statement.",
      ),
      site(
        "Pham · home page",
        "https://fightwithheartpdx.com/",
        "The site is a JavaScript app; no contact page, email, phone or social profile links were found in its pages or script bundle.",
      ),
    ],
  ),

  entry(
    "tom-sollitt",
    [
      web("https://www.tomforpdx.com/", "pamphlet"),
      email("tomforpdx@gmail.com", "site"),
      social("Instagram", "https://www.instagram.com/tomforpdx/", "site"),
      social("Bluesky", "https://bsky.app/profile/tomforpdx.bsky.social", "site"),
    ],
    [
      pamphlet(53, "Prints TomForPDX.com, which resolves at www.tomforpdx.com."),
      site(
        "Sollitt · home page",
        "https://www.tomforpdx.com/",
        "No separate contact page; the email and the campaign’s two profiles are the site’s social icons. Other Instagram links on the page credit photographers and are not campaign channels.",
      ),
    ],
  ),

  entry(
    "john-sweeney",
    [email("jsweeney88@gmail.com", "pamphlet"), phone("5032300863", "503-230-0863", "pamphlet")],
    [pamphlet(53, "The statement prints the phone and email; it lists no website and no campaign site was found.")],
  ),

  entry(
    "kellie-torres",
    [
      web("https://www.kellietorresforportland.com/", "pamphlet"),
      form("https://www.kellietorresforportland.com/get-involved", "Volunteer form", "site"),
      social("Instagram", "https://www.instagram.com/kellietorresforportland", "site"),
      social("Facebook", "https://www.facebook.com/kellietorresforportland", "site"),
    ],
    [
      pamphlet(58),
      site(
        "Torres · get involved page",
        "https://www.kellietorresforportland.com/get-involved",
        "The site lists no email or phone; the page holds the volunteer sign-up form and the profile links are in the footer.",
      ),
    ],
  ),

  entry(
    "kimberly-tucker",
    [web("https://kimberlyforpdxd3.com/", "site"), email("kimberlyforpdx.d3@gmail.com", "site")],
    [
      site(
        "Tucker · campaign site home page",
        "https://kimberlyforpdxd3.com/",
        "Her campaign site (“Kimberly Tucker for Portland’s District 3”); no pamphlet statement, and the Mercury questionnaire lists no contact. The home page prints the email beside a media-request form and links no social profiles.",
      ),
    ],
  ),

  entry(
    "martin-ward",
    [
      web("https://www.theprinceofpeace.net/", "pamphlet"),
      email("thefreshprinceofpeace@gmail.com", "site"),
      social("Facebook", "https://www.facebook.com/martinwardforcitycouncil", "site"),
      social("X", "https://x.com/bibleboy503", "site"),
      social("Instagram", "https://www.instagram.com/thefreshprinceofpeace/", "site"),
      social("YouTube", "https://www.youtube.com/@theprinceofpeacetv/", "site"),
    ],
    [
      pamphlet(55, "Prints www.theprinceofpeace.net; the domain resolves only with the www prefix."),
      site(
        "Ward · home page",
        "https://www.theprinceofpeace.net/",
        "A Contact Martin Ward section on the home page lists the email and the profiles (the X profile is linked as twitter.com/bibleboy503).",
      ),
    ],
  ),

  /* ── District 4 ─────────────────────────────────────────────────────── */

  entry(
    "timothy-tj-anderson",
    [social("LinkedIn", "https://www.linkedin.com/in/timjandersonjr/", "pamphlet")],
    [
      pamphlet(
        65,
        "The statement prints only a LinkedIn profile: no website, email or phone, and no campaign site was found.",
      ),
    ],
  ),

  entry(
    "eli-arnold",
    [
      web("https://www.eliforportland.com/", "pamphlet"),
      email("info@eliforportland.com", "site"),
      form("https://www.eliforportland.com/contact", "Contact form", "site"),
      social("Instagram", "https://www.instagram.com/eliforportland/", "site"),
      social("Facebook", "https://www.facebook.com/eliforportland/", "site"),
      social("X", "https://x.com/EliforPortland", "site"),
    ],
    [
      pamphlet(65, "Prints EliforPortland.com, which resolves at www.eliforportland.com."),
      site(
        "Arnold · contact page",
        "https://www.eliforportland.com/contact",
        "The page holds a contact form and prints the email; the profile links are in the site footer.",
      ),
    ],
  ),

  entry(
    "olivia-clark",
    [
      web("https://www.oliviaforportland.com/", "pamphlet"),
      email("onclark@gmail.com", "site"),
      social("Instagram", "https://www.instagram.com/olivia4portland/", "site"),
      social("Facebook", "https://www.facebook.com/profile.php?id=61558653216495", "site"),
    ],
    [
      pamphlet(62),
      site(
        "Clark · home page",
        "https://www.oliviaforportland.com/",
        "No contact page; the email and profile links are in the site footer, and the only form is a newsletter sign-up.",
      ),
    ],
  ),

  entry(
    "jayne-cronlund",
    [
      web("https://www.jayneforaflourishingportland.com/", "site"),
      email("friendsofjayneportland@gmail.com", "site"),
      social("Instagram", "https://www.instagram.com/jayne_cronlund/", "site"),
      social("Facebook", "https://www.facebook.com/jayne.cronlund", "site"),
    ],
    [
      pamphlet(
        63,
        "Prints jayneforaflourishingfuture.com, which does not resolve; the campaign’s site is jayneforaflourishingportland.com.",
      ),
      site(
        "Cronlund · home page",
        "https://www.jayneforaflourishingportland.com/",
        "Single-page site for the District 4 campaign; a Contact section at the foot of the page holds a form and the email, and the footer links the profiles.",
      ),
    ],
  ),

  entry(
    "jamey-evenstar",
    [
      web("https://www.evenstarforportland.com/", "pamphlet"),
      email("evenstarforportland@gmail.com", "site"),
      social("Instagram", "https://www.instagram.com/evenstarforportland", "site"),
      social("Bluesky", "https://bsky.app/profile/jameyevenstar.bsky.social", "site"),
      social("YouTube", "https://www.youtube.com/@portlandbytransit", "site"),
    ],
    [
      pamphlet(64, "Prints evenstarforportland.com, which resolves at www.evenstarforportland.com."),
      site(
        "Evenstar · home page",
        "https://www.evenstarforportland.com/",
        "No contact page; the email and profile icons are in the header and footer. The site’s Bluesky icon links a malformed address (www.bsky.app/jameyevenstar.bsky.social); the profile URL recorded here is that handle’s resolving page. A Facebook icon links a share URL rather than a profile and is omitted.",
      ),
    ],
  ),

  entry(
    "john-j-goldsmith",
    [email("jgjohngoldsmith@gmail.com", "filing"), phone("5033190864", "(503) 319-0864", "filing")],
    [
      filing(
        "Amended 2026 candidate filing · contact fields on PDF page 3",
        "https://www.portland.gov/auditor/elections/documents/goldsmith-john-2026-aud-120-amendment-redacted/download#page=3",
        "August 24, 2026; reviewed September 20, 2026",
        "The filing’s primary (campaign) email and the number in its Campaign phone number field. Its campaign website field prints www.johngoldsmith4pdx.net, which does not resolve (the host redirects to a loopback address), so no website is listed. No pamphlet statement.",
      ),
    ],
  ),

  entry(
    "mitch-green",
    [
      web("https://www.mitch4portland.com/", "pamphlet"),
      email("info@mitch4portland.com", "site"),
      social("Instagram", "https://www.instagram.com/mitch4portland/", "site"),
      social("Facebook", "https://www.facebook.com/mitch4portland/", "site"),
      social("Bluesky", "https://bsky.app/profile/mitchgreen.bsky.social", "site"),
    ],
    [
      pamphlet(62, "Prints mitch4portland.com, which resolves at www.mitch4portland.com."),
      site(
        "Green · connect page",
        "https://www.mitch4portland.com/connect",
        "The page names the email as the way to reach the campaign and holds a newsletter sign-up; the profile links are in the site footer.",
      ),
    ],
  ),

  entry(
    "josh-leake",
    [
      web("https://www.joshforportland.com/", "pamphlet"),
      email("vote@joshforportland.com", "pamphlet"),
      phone("9714358683", "(971) 435-8683", "site"),
      form("https://www.joshforportland.com/contact", "Contact form", "site"),
      social("Instagram", "https://www.instagram.com/joshforportland/", "site"),
      social("Facebook", "https://www.facebook.com/profile.php?id=61559848786491", "site"),
      social("X", "https://x.com/joshforportland", "site"),
      social("YouTube", "https://www.youtube.com/@JoshforPortland", "site"),
    ],
    [
      pamphlet(66, "Prints JoshforPortland.com and the email, which resolve at www.joshforportland.com."),
      site(
        "Leake · home page",
        "https://www.joshforportland.com/",
        "The number is offered on the home page as “Text me at (971) 435-8683” (an SMS link); the profile links are in the site footer.",
      ),
      site("Leake · contact page", "https://www.joshforportland.com/contact", "Holds a contact form."),
    ],
  ),

  entry(
    "john-mcdonald",
    [],
    [pamphlet(63)],
    "No website, email or phone in the pamphlet statement, and no campaign site found.",
  ),

  entry(
    "matt-schulte",
    [
      web("https://mattschulte.wordpress.com/", "pamphlet"),
      email("matt@lowerboom.com", "site"),
      social("Instagram", "https://www.instagram.com/mattschulte", "site"),
      social("LinkedIn", "https://www.linkedin.com/in/mattschulte/", "site"),
    ],
    [
      pamphlet(61, "Prints Mattschulte.org, which redirects to mattschulte.wordpress.com."),
      site(
        "Schulte · contact page",
        "https://mattschulte.wordpress.com/contact/",
        "The contact page lists the email and links the two profiles; no phone.",
      ),
    ],
  ),

  entry(
    "jeremy-beausoleil-smith",
    [
      web("https://jeremy4pdx.com/", "pamphlet"),
      email("info@jeremy4pdx.com", "site"),
      form("https://jeremy4pdx.com/connect-to-the-campaign/", "Volunteer form", "site"),
      social("Instagram", "https://www.instagram.com/jeremy4pdx/", "site"),
      social(
        "Facebook",
        "https://www.facebook.com/p/Jeremy-Beausoleil-Smith-for-Portland-City-Council-District-4-61555869070487/",
        "site",
      ),
      social("Bluesky", "https://bsky.app/profile/jeremy4pdx.bsky.social", "site"),
      social("TikTok", "https://www.tiktok.com/@jeremy4pdx", "site"),
      social("YouTube", "https://www.youtube.com/@Jeremy4PDX", "site"),
    ],
    [
      pamphlet(61),
      site(
        "Beausoleil Smith · home page",
        "https://jeremy4pdx.com/",
        "The email and profile links are in the site footer.",
      ),
      site(
        "Beausoleil Smith · volunteer page",
        "https://jeremy4pdx.com/connect-to-the-campaign/",
        "Holds the volunteer sign-up form.",
      ),
    ],
  ),

  entry(
    "eric-zimmerman",
    [
      web("https://ez4pdx.com/", "pamphlet"),
      phone("9719100482", "971-910-0482", "site"),
      form("https://ez4pdx.com/join-us/", "Volunteer form", "site"),
      social("Instagram", "https://www.instagram.com/ez4pdx/", "site"),
      social("Facebook", "https://www.facebook.com/ez4pdx", "site"),
    ],
    [
      pamphlet(64, "Prints www.EZ4PDX.com, which resolves at ez4pdx.com."),
      site(
        "Zimmerman · home page",
        "https://ez4pdx.com/",
        "No email on the site; the phone and profile links are in the site footer.",
      ),
      site("Zimmerman · join us page", "https://ez4pdx.com/join-us/", "Holds the sign-up form."),
    ],
  ),
];
