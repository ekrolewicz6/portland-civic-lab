import Image from "next/image";
import Link from "next/link";

const release = "https://doi.org/10.5066/P13VCTOE";
const paper = "https://doi.org/10.1017/dry.2026.10019";
const photograph = "/images/oregon-fire/usgs-horse-canyon-repeat-pair.jpg";

/** A reviewed example outside Oregon, not a burn record or causal assessment. */
export default function RepeatPhotoEvidence() {
  return (
    <div id="reading-landscape" className="fire-repeat-evidence">
      <span className="fire-eyebrow">A real photo comparison / Utah</span>
      <h3>What changed in fifty years?</h3>
      <p>These photographs show Horse Canyon in Canyonlands National Park, Utah—not Woodpecker. They show how the same view can contain different changes.</p>
      <figure className="fire-repeat-figure">
        <div className="fire-repeat-dates" aria-hidden="true"><span>1965 <small>Historical view · left</small></span><span>2015 <small>Repeat view · right</small></span></div>
        <Image src={photograph} width={2161} height={1019} sizes="(max-width: 700px) calc(100vw - 40px), 1100px" alt="Horse Canyon in 1965 on the left and 2015 on the right: matched sandstone landmarks, with more visible grass in the later foreground. Researchers assessed grassland and woodland patches separately." />
        <figcaption>Horse Canyon, Canyonlands National Park, Utah. Left: 1965, Brigham Young University archive collection. Right: 2015, National Park Service (credited as C. Shelz in Figure 4). Original paired image supplied in the USGS release, shown without cropping or retouching. <a href={photograph}>Open the full-size photograph ↗</a></figcaption>
      </figure>
      <div className="fire-repeat-patches" aria-label="Published interpretation of two vegetation patches">
        <div><span className="fire-eyebrow">Grassland patch</span><h4>More cover. A larger patch.</h4><p>Researchers saw a larger grassland patch, with more plants and denser cover.</p></div>
        <div><span className="fire-eyebrow">Pinyon–juniper patch</span><h4>Woodland cover looked similar.</h4><p>Researchers recorded no change in woodland cover, plant count, plant size, or patch size. Its position shifted. The grassland patch shifted too.</p></div>
      </div>
      <p className="fire-guide-note">These descriptions come from comparing the photographs, rather than measuring exact percentages. Sources: <a href={release}>USGS data, rows for s6659</a> and <a href={paper}>associated study, Figure 4 (page 7)</a>.</p>
      <div className="fire-repeat-reading">
        <div><h4>What the photographs show</h4><p>The grassland and woodland changed differently. Looking at each part of the view tells us more than calling the whole landscape “greener.”</p></div>
        <div><h4>What they do not establish</h4><p>A photograph alone cannot tell us the cause. Grazing, climate, soils, and terrain can matter. This pair is not a test of prescribed fire.</p></div>
      </div>
      <details><summary>Five things to look for in a repeat photograph</summary><dl className="fire-repeat-metrics"><div><dt>Patch position</dt><dd>Did the vegetation’s location shift?</dd></div><div><dt>Patch size</dt><dd>Did its extent expand or contract?</dd></div><div><dt>Plant count</dt><dd>Are more or fewer individuals visible?</dd></div><div><dt>Plant size</dt><dd>Do visible individuals look larger or smaller?</dd></div><div><dt>Live plant cover</dt><dd>Does vegetation look denser or more open?</dd></div></dl><p>Camera position, image quality, season, and the years being compared can affect what is visible. Photo interpretation needs supporting measurements and local history.</p></details>
      <div className="fire-repeat-oregon"><span className="fire-eyebrow">Bring this method to Oregon</span><h4>For Oregon, we need matching photos and measurements.</h4><p>We need photos of the same place before and after the work, with dates and permission to use them. Then we can compare the visible changes with measurements of trees and habitat.</p><Link href="/contact?topic=Data+correction&project=Oregon+Fire+Map&fireRecord=story:why-burn:reading-landscape">Contribute a dated Oregon photo pair or supporting record →</Link></div>
      <p className="fire-guide-note">The USGS release allows reuse of this image under CC0. This example is in Utah.</p>
    </div>
  );
}
