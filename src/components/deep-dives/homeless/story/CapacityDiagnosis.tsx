import styles from "./CapacityDiagnosis.module.css";

const PEOPLE = 10_526;
const BEDS = 4_187;
const GAP = PEOPLE - BEDS;
const BED_SHARE = (BEDS / PEOPLE) * 100;

const SOURCES = {
  pit: "https://hsd.multco.us/wp-content/uploads/2025/11/2025-Tri-County-PITC-Report-11.04.25.pdf",
  hic: "https://files.hudexchange.info/reports/published/CoC_HIC_CoC_OR-501-2025_OR_2025.pdf",
  budget: "https://multco.us/file/homeless_services_department-0/download",
  closures: "https://hsd.multco.us/2026/05/06/shelter-updates/",
  city: "https://www.portland.gov/shelter-services/news/2026/7/21/changes-city-shelter-services",
  access: "https://hsd.multco.us/emergency-shelters/list-of-shelters/",
};

const CHECKS = [
  { name: "Listed", question: "Does the place exist?", detail: "An inventory counts physical capacity." },
  { name: "Staffed", question: "Can it operate safely?", detail: "The necessary staff and services must be in place." },
  { name: "Vacant", question: "Is a space available?", detail: "It cannot already be occupied or held for someone else." },
  { name: "Suitable", question: "Can this person use it?", detail: "Household, access and support needs have to fit." },
  { name: "Accepting", question: "Can someone get in?", detail: "Intake, referral and arrival have to connect." },
];

function SourceLink({ href, children }: { href: string; children: string }) {
  return <a href={href} target="_blank" rel="noopener noreferrer">{children} <span aria-hidden="true">↗</span></a>;
}

/** Historical capacity, current changes, and usable access are separate comparisons. */
export default function CapacityDiagnosis() {
  return (
    <div className={styles.diagnosis}>
      <div className={styles.verdict}>
        <h3><span>No.</span> Shelter capacity was far below need.</h3>
        <p className={styles.lead}>On the same January 2025 count, Multnomah County reported more than twice as many people experiencing homelessness as shelter and transitional beds. There were not enough of those beds for everyone at once.</p>
      </div>

      <figure className={styles.comparison}>
        <figcaption className={styles.chartHeading}>
          <strong>One county. One count.</strong>
          <span>January 2025 · Multnomah County / CoC OR-501</span>
        </figcaption>
        <div className={styles.chart}>
          <div className={styles.barRow}>
            <div className={styles.barLabel}>
              <span>People experiencing homelessness</span>
              <strong>{PEOPLE.toLocaleString("en-US")}</strong>
            </div>
            <div className={styles.track} aria-hidden="true"><div className={styles.peopleBar} /></div>
            <p className={styles.barNote}>3,614 sheltered + 1,822 surveyed unsheltered + 5,090 presumed unsheltered from records</p>
          </div>

          <div className={styles.barRow}>
            <div className={styles.barLabel}>
              <span>Shelter &amp; transitional beds</span>
              <strong>{BEDS.toLocaleString("en-US")}</strong>
            </div>
            <div className={`${styles.track} ${styles.inventoryTrack}`} aria-hidden="true">
              <div className={styles.bedsBar} style={{ width: `${BED_SHARE}%` }} />
              <div className={styles.gapBar} style={{ width: `${100 - BED_SHARE}%` }} />
            </div>
            <p className={styles.barNote}>3,350 emergency + 20 Safe Haven + 817 transitional · 0 seasonal or overflow additions reported</p>
          </div>
        </div>

        <div className={styles.gapExplanation}>
          <div className={styles.gapValue}><strong>{GAP.toLocaleString("en-US")}</strong><span>people above the year-round bed inventory</span></div>
          <p>This is the <strong>January 2025 inventory gap</strong>, not the number of new beds needed today. People can also move directly into housing; everyone does not need to pass through a shelter.</p>
        </div>

        <div className={styles.sourceLine}>
          <SourceLink href={SOURCES.pit}>2025 PIT report · pp. 23–25</SourceLink>
          <SourceLink href={SOURCES.hic}>2025 HUD inventory · p. 1</SourceLink>
        </div>
        <details className={styles.method}>
          <summary>What this comparison establishes</summary>
          <p>The population count refers to January 22, 2025. The inventory is the same CoC’s January 2025 count of operating shelter and transitional beds. Both include adults and children. The bars use the same numerical scale; beds are potential places for people, not a count of vacant spaces.</p>
          <p>The 5,090 people presumed unsheltered were identified through administrative records, not all encountered on count night. The count has uncertainty and predates 2026 closures. The arithmetic is 10,526 − 4,187 = 6,339; it does not determine the mix of shelter, housing and care needed now.</p>
          <p>Permanent-housing inventory is separate: it includes places serving people who are already housed. It cannot be added to this chart as if those homes were empty. Nor does subtracting the sheltered population from bed inventory establish usable vacancies.</p>
        </details>
      </figure>

      <div className={styles.accessSection}>
        <div className={styles.subheading}>
          <p className={styles.eyebrow}>The next failure point</p>
          <h3>A listed bed still has to be usable.</h3>
          <p>A capacity total answers only the first question. These are the checks needed to turn a place on paper into an offer someone can use.</p>
        </div>

        <ol className={styles.checks} aria-label="Checks required for a usable placement">
          {CHECKS.map((check, index) => (
            <li key={check.name}>
              <div className={styles.checkHeader}><span className={styles.checkIndex} aria-hidden="true">0{index + 1}</span><strong>{check.name}</strong></div>
              <h4>{check.question}</h4>
              <p>{check.detail}</p>
            </li>
          ))}
        </ol>
        <p className={styles.unknownNote}><span aria-hidden="true">?</span> A current count passing every check is not established by these public sources. This is a checklist, not a measured funnel.</p>

        <div className={styles.accessExample}>
          <div><span className={styles.exampleLabel}>A documented closed door</span><h4>Roseway has rooms. It is taking no new participants.</h4></div>
          <div><p>The County says intake has stopped ahead of its planned October 30, 2026 closure. Remaining physical capacity therefore cannot be treated as an available offer.</p><SourceLink href={SOURCES.closures}>HSD closure update · checked Sept. 8, 2026</SourceLink></div>
        </div>
        <p className={styles.accessDetail}>Other doors require a particular route: Banfield and Stark accept referrals from congregate shelters; Rockwood Bridge requires an approved permanent-housing placement. <SourceLink href={SOURCES.access}>HSD access directory · July 2026</SourceLink></p>
      </div>

      <div className={styles.changesSection}>
        <div className={styles.subheading}>
          <p className={styles.eyebrow}>What has changed since that count?</p>
          <h3>In 2026, funded capacity is shrinking.</h3>
          <p>Closures are happening now. Future capacity estimates need to be shown separately from places operating today.</p>
        </div>
        <div className={styles.changeCards}>
          <article className={styles.changeCard}>
            <p className={styles.cardStatus}>County · adopted FY2027 plan</p>
            <p className={styles.changeNumber}>605</p>
            <h4>adult shelter units being cut</h4>
            <p>Plus 90 family scattered-site vouchers. The County cites a funding tradeoff between shelter capacity and housing assistance.</p>
            <SourceLink href={SOURCES.budget}>Adopted budget · p. 49</SourceLink>
          </article>
          <article className={styles.changeCard}>
            <p className={styles.cardStatus}>City · projected winter capacity</p>
            <p className={styles.changeNumber}>580 <span>from 876</span></p>
            <h4>regular adult overnight beds</h4>
            <p>The August 24 plan projects 296 fewer beds. Northrup’s 200 beds are scheduled to close September 18.</p>
            <SourceLink href={SOURCES.city}>City shelter changes · Aug. 24, 2026</SourceLink>
          </article>
          <article className={`${styles.changeCard} ${styles.closureCard}`}>
            <p className={styles.cardStatus}>County · confirmed closures</p>
            <h4>Places already lost</h4>
            <dl className={styles.closureList}>
              <div><dt>Laurelwood</dt><dd>June 30, 2026</dd></div>
              <div><dt>Walnut Park</dt><dd>July 14, 2026</dd></div>
              <div><dt>River District Navigation Center</dt><dd>August 31, 2026</dd></div>
            </dl>
            <SourceLink href={SOURCES.closures}>HSD closure update · checked Sept. 8</SourceLink>
          </article>
        </div>
        <p className={styles.scopeNote}>These scopes overlap and use different units. Do not add the City’s beds to the County’s unit reductions, or subtract either from the January 2025 inventory to invent a current total.</p>
      </div>
    </div>
  );
}
