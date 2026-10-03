import { LESSON_SOURCES } from "@/lib/oregon-fire/lesson";

export default function FireMaintenanceEvidence() {
  return <figure className="fire-maintenance-evidence">
    <div><span className="fire-eyebrow">Why the first treatment is not the finish line</span><h3>Effects can change as vegetation grows back.</h3><p>A review grouped studies by the time between treatment and later wildfire. The average reduction in the severity measures was smaller in the group with older treatments.</p></div>
    <div className="fire-maintenance-bars" aria-label="Average relative severity reduction reported in the review: 66 percent when wildfire arrived within ten years of treatment, 28 percent when wildfire arrived after ten years.">
      <div><span>Fire within 10 years</span><div><i style={{ width: "66%" }} /></div><strong>66%</strong></div>
      <div><span>Fire after 10 years</span><div><i style={{ width: "28%" }} /></div><strong>28%</strong></div>
    </div>
    <figcaption><a href={LESSON_SOURCES.synthesis.url}>Davis and colleagues, 2024 review ↗</a>. Mean relative reductions across analyzed treatment and forest groups reached by wildfire. The comparison does not prescribe a ten-year reburn date. Local monitoring, vegetation and objectives determine whether and when maintenance is needed.</figcaption>
  </figure>;
}
