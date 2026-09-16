"use client";

import { useState } from "react";
import {
  CalendarClock,
  Wallet,
  TrendingUp,
  Sprout,
  Landmark,
} from "lucide-react";
import { REFORM_OPTIONS } from "@/lib/fpdr/data";
import SourceLink from "./SourceLink";
import styles from "./briefing.module.css";

const optionIcons = {
  "status-quo": CalendarClock,
  cash: Wallet,
  rapid: TrendingUp,
  gradual: Sprout,
  pob: Landmark,
};

export default function ReformMenu() {
  const [view, setView] = useState<"timing" | "cost">("timing");
  const timing = view === "timing";
  return (
    <div>
      <div
        className={styles.viewSwitch}
        role="group"
        aria-label="Compare funding options"
      >
        <button
          type="button"
          aria-pressed={timing}
          aria-controls="funding-comparison"
          onClick={() => setView("timing")}
        >
          When to consider it
        </button>
        <button
          type="button"
          aria-pressed={!timing}
          aria-controls="funding-comparison"
          onClick={() => setView("cost")}
        >
          Who pays &amp; tradeoffs
        </button>
      </div>
      <p className={styles.guideNote}>
        The Lab’s decision guide. These are conditions to test, not findings
        that Portland meets them today.
      </p>
      <div
        id="funding-comparison"
        className={timing ? styles.timingView : undefined}
      >
        <div className={styles.optionsHead} aria-hidden="true">
          <span>The choice</span>
          {timing ? (
            <>
              <span>More viable when…</span>
              <span>Ask before acting</span>
            </>
          ) : (
            <>
              <span>Who pays now</span>
              <span>What could change later</span>
              <span>The tradeoff</span>
            </>
          )}
        </div>
        {REFORM_OPTIONS.map((option) => {
          const Icon = optionIcons[option.id];
          return (
            <article key={option.id} className={styles.optionRow}>
              <header>
                <Icon
                  className={styles.optionIcon}
                  size={21}
                  aria-hidden="true"
                />
                <div>
                  <h3>{option.name}</h3>
                  <span>{option.tag}</span>
                </div>
              </header>
              {timing ? (
                <>
                  <div>
                    <span>When</span>
                    <p>{option.when}</p>
                  </div>
                  <div>
                    <span>Ask</span>
                    <p>{option.ask}</p>
                  </div>
                </>
              ) : (
                <>
                  <div>
                    <span>Now</span>
                    <p>{option.now}</p>
                  </div>
                  <div>
                    <span>Later</span>
                    <p>{option.later}</p>
                  </div>
                  <div>
                    <span>Risk</span>
                    <p>{option.risk}</p>
                  </div>
                </>
              )}
            </article>
          );
        })}
      </div>
      <p className={styles.note}>
        The Lab’s comparison of the current approach and four mechanisms
        presented by the City. Future savings depend on investment results.{" "}
        <SourceLink id="cityFinancing2026">City, slide 16</SourceLink> ·{" "}
        <SourceLink id="gfoaBonds">
          GFOA’s advice against pension-obligation bonds
        </SourceLink>
        .
      </p>
      <details className={styles.details}>
        <summary>Would lower interest rates make it the right time?</summary>
        <div className={styles.rateGuide}>
          <div>
            <Wallet aria-hidden="true" size={22} />
            <h4>Saving your own money</h4>
            <p>
              Higher yields on new bonds can help. High rates are not
              automatically a reason to wait.
            </p>
          </div>
          <div>
            <Landmark aria-hidden="true" size={22} />
            <h4>Borrowing to invest</h4>
            <p>
              Lower borrowing costs help. Returns are still uncertain; the debt
              must still be paid.
            </p>
          </div>
        </div>
        <p>
          There is no single interest-rate trigger in the Council packet. Test
          the full plan, including fees, benefit payments and losses.{" "}
          <SourceLink id="gfoaBonds">GFOA’s borrowing advisory</SourceLink> ·{" "}
          <SourceLink id="pewFunding2026">
            Pew’s recommendation for comparative analysis
          </SourceLink>
          .
        </p>
      </details>
      <details className={styles.details}>
        <summary>What scale of change did the City describe?</summary>
        <p>
          The City’s September 16 presentation describes a cash option requiring
          at least $1 billion, a rapid rise to the Charter cap, and a gradual
          increase over 15–20 years or longer. These are staff’s descriptions of
          options, not adopted policies or minimum requirements for every
          possible reserve.
        </p>
        <p>
          The presentation characterizes a rapid increase as roughly doubling
          FPDR bills. Actual household effects and compression need a
          property-level analysis; the slide is not a tax quote. The City
          describes pension bonds as adding market and interest-rate risk.
        </p>
      </details>
      <details className={styles.details}>
        <summary>Could Portland start with a smaller reserve?</summary>
        <p>
          Pew describes Indiana’s teachers’ system pairing prefunding for new
          hires with a $425 million stabilization fund for its older plan in
          1996. That reserve supported cash flow and eventual prefunding.
        </p>
        <p>
          A phased reserve is worth comparing here. Indiana’s experience does
          not establish the right size, legal structure or savings for Portland.{" "}
          <SourceLink id="pewFunding2026">Pew, pp. 10–12</SourceLink>.
        </p>
      </details>
    </div>
  );
}
