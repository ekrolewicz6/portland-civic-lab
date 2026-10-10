import data from "@/data/small-business/osb-year-one.json";
import { Figure, Source } from "./Evidence";

type Share = {
  label: string;
  percent: number | null;
  display: string;
  description?: string;
};

function ShareList({ rows, title }: { rows: Share[]; title: string }) {
  return (
    <div className="sb-osb-share-list">
      <h4>{title}</h4>
      <dl>
        {rows.map((row) => (
          <div key={row.label} className="sb-osb-share-row">
            <dt>{row.label}</dt>
            <dd>
              <strong>{row.display}</strong>
              <div className="sb-osb-track" aria-hidden="true">
                {row.percent !== null && (
                  <span style={{ width: `${row.percent}%` }} />
                )}
              </div>
              {row.description && <p>{row.description}</p>}
            </dd>
          </div>
        ))}
      </dl>
    </div>
  );
}

export function OSBReport() {
  return (
    <div className="sb-osb-report" id="osb-year-one">
      <div className="sb-prose sb-prose-wide">
        <p className="sb-eyebrow">A closer look at the office’s first year</p>
        <h3>A person who stays with the problem.</h3>
        <p>
          OSB launched at Prosper Portland in May 2025. Its first-year report
          describes a practical role: help an owner find the right bureau, sort
          out a utility bill, understand permits, reach a business advisor or
          identify funding. The September 10 announcement puts trust and
          follow-through at the center of that work. It describes the same
          businesses and period as the PDF, not a second set of results.{" "}
          <Source id="osb-2026" page={2}>
            Report, p. 2
          </Source>{" "}
          <Source id="osb-site">Read the announcement</Source>
        </p>
        <p>
          <a href="/data/small-business/osb-source-review.md" download>
            Download the page-by-page source review ↓
          </a>
        </p>
        <p>
          The report is strongest at showing what assistance looks like. An
          owner can need language support, a document and a useful introduction
          before a grant application is even possible. The cases below make that
          work visible. They also help separate a task completed from a business
          outcome that still needs to be measured.
        </p>
      </div>
      <div className="sb-osb-delivery">
        <div>
          <strong>5 languages</strong>
          <h4>Information owners can use</h4>
          <p>
            The website offers startup instructions, permitting guidance,
            community connections and resources for managing a business. The
            report says these were available in five languages.
          </p>
        </div>
        <div>
          <strong>Monthly</strong>
          <h4>Bureaus compare notes</h4>
          <p>
            Staff describe regular coordination meetings to connect processes
            that had operated separately and work through business issues
            together.
          </p>
        </div>
        <div>
          <strong>Quarterly</strong>
          <h4>Business districts get a hearing</h4>
          <p>
            District leaders meet elected officials or their staff. Office
            hours, webinars, event promotion and visits to businesses provide
            other ways to reach the office.
          </p>
        </div>
      </div>
      <p className="sb-section-source">
        Delivery model reported in{" "}
        <Source id="osb-2026" page={2}>
          the manager’s letter, p. 2
        </Source>
        . The report also documents an on-site visit with Professional Auto Body
        &amp; Paint on{" "}
        <Source id="osb-2026" page={5}>
          p. 5
        </Source>
        . These describe access and activity; they do not establish time saved
        or equal access across languages.
      </p>
      <Figure
        number="16"
        title="Who asks for help—and what the office offers."
        subtitle="Office of Small Business, first-year report. Every category on page 4, with percentages as printed."
        sources={["osb-2026"]}
        download="osb-year-one.csv"
        note={
          <>
            These are the office’s clients, inquiry channels and recorded
            service categories—not the mix of all Portland businesses. Exact
            category counts and counting rules are not provided.{" "}
            <Source id="osb-2026" page={4}>
              Open the original charts, p. 4
            </Source>
          </>
        }
      >
        <div className="sb-osb-mix">
          <ShareList rows={data.industry} title="Businesses served" />
          <div>
            <ShareList rows={data.intake} title="Where inquiries came from" />
            <ShareList rows={data.services} title="Services provided" />
          </div>
        </div>
        <div className="sb-osb-reading">
          <p>
            <strong>Outreach is a route into the system.</strong> Liaisons
            generated 30% of inquiries; appointments accounted for 25%. A
            website alone would miss how much of this service begins with a
            person.
          </p>
          <p>
            <strong>The 7% capital category is easy to misread.</strong> It
            means referrals to funding outside Prosper Portland. Prosper’s own
            grants and loans sit inside the much larger 50% resources category.
            Neither percentage tells us how many clients actually received
            money.
          </p>
          <p>
            <strong>Keep the rounding visible.</strong> The printed industry
            values add to 102% plus agriculture’s “under 1%.” We preserve those
            values; we do not force them to 100% or turn them into exact
            business counts. Agriculture has no bar because its precise share is
            not given.
          </p>
        </div>
      </Figure>
      <Figure
        number="17"
        title="OSB showed up in every district. Its totals still need explaining."
        subtitle="Businesses by district from page 2; group events attended or hosted from page 5. First-year activity, not a measure of need or success."
        sources={["osb-2026"]}
        download="osb-year-one.csv"
        note={
          <>
            The business counts and event counts measure different things.
            Neither is divided by a district’s eligible businesses, so these are
            not rankings of access.{" "}
            <Source id="osb-2026" page={2}>
              Business counts, p. 2
            </Source>{" "}
            <Source id="osb-2026" page={5}>
              Event map, p. 5
            </Source>
          </>
        }
      >
        <div className="sb-osb-districts">
          {data.districts.map((d) => (
            <div key={d.district}>
              <h4>District {d.district}</h4>
              <dl>
                <div>
                  <dt>Businesses</dt>
                  <dd>{d.businesses}</dd>
                </div>
                <div>
                  <dt>Group events</dt>
                  <dd>{d.events}</dd>
                </div>
              </dl>
            </div>
          ))}
        </div>
        <div className="sb-osb-reconcile">
          <div>
            <span>Businesses</span>
            <strong>
              581 <small>listed</small> / 759 <small>reported</small>
            </strong>
            <p>A difference of 178. The report does not explain it.</p>
          </div>
          <div>
            <span>Events</span>
            <strong>
              126 <small>listed</small> / 136 <small>reported</small>
            </strong>
            <p>
              A difference of 10. The report does not explain this gap either.
            </p>
          </div>
        </div>
        <p className="sb-chart-explainer">
          The letter’s “more than 135” events is consistent with the 136
          headline. The district map is not. Separately, page 2 uses 1,600
          touchpoints, while page 3 and the announcement say 1,700+
          interactions. The counting terms or periods might differ; we cannot
          assign a reason from these documents.{" "}
          <Source id="osb-site">Announcement</Source>
        </p>
      </Figure>
      <div className="sb-osb-case-heading">
        <p className="sb-eyebrow">Four businesses, four different problems</p>
        <h3>The work a referral count cannot describe.</h3>
        <p>
          These are the four stories OSB selected for its report. They show how
          support was delivered, not how often it works. Business details and
          outcomes below are attributed to that report, not independently
          verified follow-up interviews.
        </p>
      </div>
      <div className="sb-osb-cases">
        <article>
          <p className="sb-eyebrow">District 1 · Starting childcare</p>
          <h4>Uluf Hassan</h4>
          <p>
            After a decade in early childhood development, Hassan wanted to open
            a preschool in Division Midway. The report identifies the business
            as new and home-based childcare; it also describes a search for
            suitable commercial space.
          </p>
          <details>
            <summary>From an idea to the requirements for opening</summary>
            <div>
              <p>
                At District 1 office hours she met liaison Jon Bebe, Permitting
                &amp; Development staff and Division Midway Alliance. They
                connected her with help on childcare requirements, premises that
                could meet the rules, grant and loan opportunities, business
                coaching and technical training. She described gaining
                confidence to navigate zoning, regulations and financing.
              </p>
              <p>
                <strong>What the report establishes:</strong> connections and
                guidance. It does not confirm an opening date, a license or a
                funding award. Those are the next milestones to follow.
              </p>
            </div>
          </details>
          <Source id="osb-2026" page={6}>
            Uluf Hassan’s story, p. 6
          </Source>
        </article>
        <article>
          <p className="sb-eyebrow">District 2 · Recovering from a fire</p>
          <h4>One Taekwondo Academy</h4>
          <p>
            Vicente founded the studio in 2016 to teach children and adults. An
            August 2025 fire forced it and three other businesses to relocate or
            close. Liaison Julieanna Elegant reached out to all four.
          </p>
          <details>
            <summary>
              Spanish-language help, documents and a new location
            </summary>
            <div>
              <p>
                OSB helped Vicente communicate with the investigator and obtain
                the fire report, connected him to the Hispanic Metropolitan
                Chamber through the Inclusive Business Resource Network,
                introduced business associations near his old and new locations,
                and promoted the studio on social media. It also helped with his
                St. Johns Small Business Grant application.
              </p>
              <p>
                Vicente reported help getting a sign for the new location and
                valued being able to work in Spanish: “I could get help directly
                in Spanish.”
              </p>
              <p>
                <strong>What the report establishes:</strong> specific
                assistance during a move. A grant application is described, not
                a grant award. It does not isolate how much this help changed
                the studio’s survival prospects.
              </p>
            </div>
          </details>
          <Source id="osb-2026" page={8}>
            One Taekwondo’s story, p. 8
          </Source>
        </article>
        <article>
          <p className="sb-eyebrow">
            District 3 · Buying and adapting a building
          </p>
          <h4>Hey Doc</h4>
          <p>
            The clinic opened in November 2021, offering chiropractic, pelvic
            health, acupuncture, massage and mental health care. The report
            describes growth from one provider and an office manager to 12
            providers and five administrative staff, and ownership of its
            building.
          </p>
          <details>
            <summary>
              Working through permits with the clinic’s architect
            </summary>
            <div>
              <p>
                Founder Montserrat first contacted Jon Bebe when OSB launched,
                then returned for help as the clinic acquired a building in
                early 2026. Bebe and manager Mitch Daugherty worked with
                architect Kaeli Nolte of Zone Design Group and Permitting &amp;
                Development, helped navigate a fee-reduction application, and
                answered detailed application questions intended to prevent
                delays.
              </p>
              <p>
                <strong>What the report establishes:</strong> coordination and
                application support. It gives no measured permit-time reduction
                or fee savings. The clinic’s reported growth is not a count of
                jobs caused by OSB.
              </p>
            </div>
          </details>
          <Source id="osb-2026" page={10}>
            Hey Doc’s story, p. 10
          </Source>
        </article>
        <article>
          <p className="sb-eyebrow">
            District 4 · Keeping an established restaurant going
          </p>
          <h4>Tangier</h4>
          <p>
            Founded in 2010, Najia’s downtown family restaurant serves Moroccan
            and Mediterranean food. What began as a request for help applying
            for a grant became an ongoing relationship with liaison Julieanna
            Elegant.
          </p>
          <details>
            <summary>Online ordering, equipment and new customers</summary>
            <div>
              <p>
                OSB connected Najia with the City Revenue Division and Oregon
                Secretary of State. Xcelerate Women, an Inclusive Business
                Resource Network partner, helped set up online ordering. The
                report says she received a Prosper Building Energy Efficiency
                grant the previous fall and was working out its scope for
                restaurant equipment. Travel Portland connections offered ways
                to promote the restaurant to visitors.
              </p>
              <p>
                <strong>What the report establishes:</strong> online-ordering
                help, connections and a reported grant award. It does not give
                the grant amount, confirm completed upgrades, or measure energy
                savings or extra sales. Najia emphasized prompt, continuing
                follow-up in her testimonial.
              </p>
            </div>
          </details>
          <Source id="osb-2026" page={12}>
            Tangier’s story, p. 12
          </Source>
        </article>
      </div>
      <div className="sb-osb-partners">
        <h3>What the city partners say changed</h3>
        <p>
          The report includes statements from three partners. They describe
          useful ways of working together; they are not independent evaluations.
        </p>
        <div className="sb-three-col">
          <div>
            <h4>Transportation</h4>
            <p>
              PBOT director Millicent Williams describes clearer construction
              updates, promotion of events such as Sunday Parkways, and a
              channel for addressing business concerns early.
            </p>
            <Source id="osb-2026" page={7}>
              PBOT statement, p. 7
            </Source>
          </div>
          <div>
            <h4>Public spaces</h4>
            <p>
              The Public Environment Management Office describes mutual
              referrals, help with commercial-corridor problems and connections
              through its Problem Solver network.
            </p>
            <Source id="osb-2026" page={9}>
              PEMO statement, p. 9
            </Source>
          </div>
          <div>
            <h4>Permitting</h4>
            <p>
              PP&amp;D’s Alice Nielsen describes better access to permitting and
              property information, and staff learning what owners will
              encounter. She also says more work remains.
            </p>
            <Source id="osb-2026" page={11}>
              PP&amp;D statement, p. 11
            </Source>
          </div>
        </div>
      </div>
      <div className="sb-osb-next">
        <div>
          <h3>Build on the relationships. Measure what gets finished.</h3>
          <p>
            The announcement’s year-two priorities are better coordination,
            visibility and responsiveness. A useful next report would follow the
            milestones these stories reveal: a childcare license, a completed
            move, a permit decision, an installed upgrade and an owner’s time
            saved. It would include people who stopped seeking help.{" "}
            <Source id="osb-site">Year-two direction</Source>
          </p>
          <p>
            This also sharpens the AI question: software might help prepare
            documents or track a case. It still takes people and institutions to
            resolve a fire-report request, judge a site’s requirements or
            coordinate a permit.
          </p>
        </div>
        <aside>
          <span className="sb-eyebrow">Find the starting point</span>
          <h4>Ask OSB for help</h4>
          <p>
            The report directs owners to the office’s help page. Follow it for
            current contact options and services.
          </p>
          <a
            href="https://pdxofficeofsmallbusiness.com/get-help"
            target="_blank"
            rel="noreferrer"
          >
            Visit the OSB help page ↗
          </a>
          <p>
            <Source id="osb-2026" page={13}>
              Report, p. 13
            </Source>
          </p>
        </aside>
      </div>
    </div>
  );
}
