import { REFORM_OPTIONS } from "@/lib/fpdr/data";
import SourceLink from "./SourceLink";
import styles from "./fpdr-tools.module.css";

export default function ReformMenu() {
  return (
    <div className={styles.options}>
      {REFORM_OPTIONS.map((option, index) => (
        <article key={option.id}>
          <div className={styles.optionTop}>
            <span className={styles.optionNumber}>0{index + 1}</span>
            <span className={styles.eyebrow}>{option.tag}</span>
          </div>
          <h3>{option.name}</h3>
          <p className={styles.body}>{option.how}</p>
          <dl>
            <div>
              <dt>The case for it</dt>
              <dd>{option.caseFor}</dd>
            </div>
            <div>
              <dt>The tradeoff</dt>
              <dd>{option.tradeoff}</dd>
            </div>
          </dl>
          <details>
            <summary>The question to resolve</summary>
            <p>{option.question}</p>
          </details>
          <p className={styles.hint}>
            <SourceLink id={option.source}>
              {option.id === "study"
                ? "Funding authority"
                : "Source perspective"}
            </SourceLink>
            {option.id === "study" ? " · Process proposed by the Lab" : ""}
          </p>
        </article>
      ))}
    </div>
  );
}
