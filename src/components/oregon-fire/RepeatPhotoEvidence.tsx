import Image from "next/image";
import Link from "next/link";

const release = "https://doi.org/10.5066/P13VCTOE";
const paper = "https://doi.org/10.1017/dry.2026.10019";
const photograph = "/images/oregon-fire/usgs-horse-canyon-repeat-pair.jpg";

/** A reviewed example outside Oregon, not a burn record or causal assessment. */
export default function RepeatPhotoEvidence() {
  return (
    <div id="reading-landscape" className="fire-repeat-evidence">
      <span className="fire-eyebrow">Learning to read a landscape / Utah example</span>
      <h3>One viewpoint. Fifty years. More than one story.</h3>
      <p>These photographs show Horse Canyon in Canyonlands National Park, Utah—not Woodpecker or an Oregon fire site. Researchers compared vegetation patches within the same view instead of giving the entire landscape one verdict.</p>
      <figure className="fire-repeat-figure">
        <div className="fire-repeat-dates" aria-hidden="true"><span>1965 <small>Historical view · left</small></span><span>2015 <small>Repeat view · right</small></span></div>
        <Image src={photograph} width={2161} height={1019} sizes="(max-width: 700px) calc(100vw - 40px), 1100px" alt="Horse Canyon in 1965 on the left and 2015 on the right: matched sandstone landmarks, with more visible grass in the later foreground. Researchers assessed grassland and woodland patches separately." />
        <figcaption>Horse Canyon, Canyonlands National Park, Utah. Left: 1965, Brigham Young University archive collection. Right: 2015, National Park Service (credited as C. Shelz in Figure 4). Original paired image supplied in the USGS release, shown without cropping or retouching. <a href={photograph}>Open the full-size photograph ↗</a></figcaption>
      </figure>
      <div className="fire-repeat-patches" aria-label="Published interpretation of two vegetation patches">
        <div><span className="fire-eyebrow">Grassland patch</span><h4>More cover. A larger patch.</h4><p>The interpretation records denser live plant cover, more individual plants, larger plants, and an increased patch size.</p></div>
        <div><span className="fire-eyebrow">Pinyon–juniper patch</span><h4>Cover classified as unchanged.</h4><p>Live plant cover, plant count, plant size, and patch size were classified as “No Change.” The patch’s position shifted, as did the grassland patch’s.</p></div>
      </div>
      <p className="fire-guide-note">These are directional visual classifications for photo pair s6659, not measured percentages or acreage. “No Change” in one attribute does not mean every aspect of a patch stayed the same. Sources: <a href={release}>USGS data, rows for s6659</a> and <a href={paper}>associated study, Figure 4 (page 7)</a>.</p>
      <div className="fire-repeat-reading">
        <div><h4>What the photographs show</h4><p>A dated, local comparison of visible vegetation. Reading separate patches reveals changes that a single “greener” or “less green” judgment would miss.</p></div>
        <div><h4>What they do not establish</h4><p>Why the change happened, whether fire caused it, or whether denser vegetation meets a restoration goal. The study considers grazing history, climate, soils, and terrain. This pair is not a test of prescribed fire.</p></div>
      </div>
      <details><summary>Five things to look for in a repeat photograph</summary><dl className="fire-repeat-metrics"><div><dt>Patch position</dt><dd>Did the vegetation’s location shift?</dd></div><div><dt>Patch size</dt><dd>Did its extent expand or contract?</dd></div><div><dt>Plant count</dt><dd>Are more or fewer individuals visible?</dd></div><div><dt>Plant size</dt><dd>Do visible individuals look larger or smaller?</dd></div><div><dt>Live plant cover</dt><dd>Does vegetation look denser or more open?</dd></div></dl><p>Camera position, image quality, season, and the years being compared can affect what is visible. Photo interpretation needs supporting measurements and local history.</p></details>
      <div className="fire-repeat-oregon"><span className="fire-eyebrow">Bring this method to Oregon</span><h4>Match the viewpoint. Then follow the evidence.</h4><p>For an Oregon project, we need photographs with dates, a verified viewpoint, credits and reuse permission, plus records of the work and later monitoring. Compare what changed with the project’s actual objective. More vegetation alone is not an outcome score.</p><Link href="/contact?topic=Data+correction&project=Oregon+Fire+Map&fireRecord=story:why-burn:reading-landscape">Contribute a dated Oregon photo pair or supporting record →</Link></div>
      <p className="fire-guide-note">The release’s supplied example image is CC0. This Colorado Plateau example remains separate from the atlas’s Oregon records.</p>
    </div>
  );
}
