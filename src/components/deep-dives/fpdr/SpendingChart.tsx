import { SPENDING_FY27 } from "@/lib/fpdr/data";
import { fmtMillions } from "@/lib/fpdr/engine";
import styles from "./fpdr-tools.module.css";

export default function SpendingChart() {
  const total = SPENDING_FY27.reduce((sum, item) => sum + item.amount, 0);
  return (
    <div>
      <div className={styles.spendingBar} aria-hidden="true">
        {SPENDING_FY27.map((item) => (
          <div
            key={item.key}
            style={{
              width: `${(item.amount / total) * 100}%`,
              background: item.color,
            }}
          />
        ))}
      </div>
      <dl className={styles.spendingRows}>
        {SPENDING_FY27.map((item) => (
          <div key={item.key}>
            <dt>
              <i style={{ background: item.color }} />
              <span>
                {item.label}
                <small>{item.note}</small>
              </span>
            </dt>
            <dd>
              {fmtMillions(item.amount)}{" "}
              <small>{((item.amount / total) * 100).toFixed(0)}%</small>
            </dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
