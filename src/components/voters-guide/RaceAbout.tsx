import Link from "next/link";
import { ArrowUpRight, Users, Columns2, Landmark, CalendarDays, ChevronDown } from "lucide-react";
import type { Race } from "@/lib/voters-guide/types";
import { REVIEW_LABEL } from "@/lib/voters-guide/types";
import styles from "./race-about.module.css";

export default function RaceAbout({ race }: { race: Race }) {
  const district = race.id.slice(-1);
  return <section id="about-guide" data-panel="about" aria-labelledby="race-about-title" className={styles.about}>
    <header className={styles.hero}>
      <span className={styles.eyebrow}>ABOUT YOUR GUIDE · DISTRICT {district}</span>
      <h2 id="race-about-title" data-navigation-focus>Your city.<br /><em>Your choice.</em></h2>
      <p>Get to know the people asking to represent you. Compare their plans, understand their choices, and check the evidence for yourself.</p>
      <div className={styles.facts}>
        <span><CalendarDays size={18} aria-hidden="true" />November 3, 2026</span>
        <span><Users size={18} aria-hidden="true" />{race.candidates.length} candidates · 3 seats</span>
      </div>
    </header>
    <nav className={styles.actions} aria-label="Full research navigation">
      <a href="#find-candidates"><Users aria-hidden="true" /><span><strong>Meet the candidates</strong><small>Their priorities and experience</small></span><ArrowUpRight aria-hidden="true" /></a>
      <a href="#compare"><Columns2 aria-hidden="true" /><span><strong>Compare your choices</strong><small>The same questions, side by side</small></span><ArrowUpRight aria-hidden="true" /></a>
      <a href="#disagreements"><Landmark aria-hidden="true" /><span><strong>Check the council record</strong><small>The votes, the reasons, the differences</small></span><ArrowUpRight aria-hidden="true" /></a>
    </nav>
    <div className={styles.context}>
      <div><span className={styles.eyebrow}>WHAT’S AT STAKE</span><h3>The decisions that shape daily life.</h3><p>Your council makes decisions about {race.stakes.charAt(0).toLowerCase() + race.stakes.slice(1)}</p></div>
      <div className={styles.voting}><strong>You can rank your choices.</strong><p>This race uses ranked-choice voting to fill three seats. Your address determines which district is on your ballot.</p><a href="https://multco.us/info/ranked-choice-voting-rcv">How ranked-choice voting works ↗</a></div>
    </div>
    <div className={styles.details}>
      <details><summary>What this council can do<ChevronDown size={19} aria-hidden="true" /></summary><div className={styles.body}><p>{race.authority}</p><h3>Where the choices differ</h3><p>{race.comparison}</p><p className={styles.caption}>Our synthesis of the candidates’ proposals and public records.</p></div></details>
      <details><summary>Terms explained in plain English<ChevronDown size={19} aria-hidden="true" /></summary><div className={styles.body}>
          <dl>
            <dt>
              <strong>Amendment</strong>
            </dt>
            <dd>
              A proposed change to a measure. A vote on one amendment does not
              establish support for the final package.
            </dd>
            <dt>
              <strong>Supplemental budget</strong>
            </dt>
            <dd>
              A change to a budget after its original adoption, often to respond
              to new costs or revenue.
            </dd>
            <dt>
              <strong>Appropriation</strong>
            </dt>
            <dd>
              Permission to spend public money for a particular purpose. It does
              not mean the money has already been spent.
            </dd>
            <dt>
              <strong>PCEF</strong>
            </dt>
            <dd>
              The Portland Clean Energy Fund. Debates involve both what climate
              work to fund and whether its money should help cover other city
              costs.
            </dd>
            <dt>
              <strong>Term sheet</strong>
            </dt>
            <dd>
              A document setting out the main terms of a proposed deal. Read the
              specific vote to see what was approved and what still required
              agreement.
            </dd>
            <dt>
              <strong>Social housing</strong>
            </dt>
            <dd>
              Housing intended to remain affordable through public or nonprofit
              ownership. Proposals differ in who qualifies, how rents are set
              and how construction is paid for.
            </dd>
            <dt>
              <strong>CEI Hub</strong>
            </dt>
            <dd>
              The Critical Energy Infrastructure Hub, an area of fuel storage
              and related facilities along the Willamette River. The research
              covers pollution, earthquake risks and proposals affecting
              individual operators such as Zenith.
            </dd>
          </dl>
      </div></details>
      <details><summary>Sources, fairness and research limits<ChevronDown size={19} aria-hidden="true" /></summary><div className={styles.body}>
        <p>We use the same profile structure for every candidate and list candidates alphabetically. A missing position means our research is incomplete; it does not mean the candidate has no position.</p>
        <p><strong>{race.rosterStatus}.</strong> <a href={race.rosterSource.url}>{race.rosterSource.label} ↗</a>. The candidate list and policy research are checked separately.</p>
        <p>A candidate’s published statement establishes what they say, not that their factual claims are true. A recorded vote, a stated reason and our interpretation are labeled separately.</p>
        <Link href="/voters-guide/methodology">Read our editorial standards →</Link>
      </div></details>
    </div>
    <footer className={styles.footer}>
      <strong>Independent research. Your decision.</strong>
      <p>Research reviewed {REVIEW_LABEL}. This working edition includes AI-assisted research and has not completed a separate human editorial review.</p>
      <div><Link href="/voters-guide/methodology#corrections">Suggest a correction</Link><Link href="/voters-guide/methodology#coverage">See research gaps</Link></div>
    </footer>
  </section>;
}
