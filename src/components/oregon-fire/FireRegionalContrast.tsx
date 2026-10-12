import LandscapeIllustration from "./LandscapeIllustration";

const source = "https://extension.oregonstate.edu/catalog/em-9461-not-all-flames-same-willamette-valley-western-cascades";
const allRegions = "https://extension.oregonstate.edu/catalog/em-9459-not-all-flames-same";

export default function FireRegionalContrast() {
  return <figure className="fire-region-contrast">
    <div className="fire-region-heading">
      <span className="fire-eyebrow">One region · different fire histories</span>
      <h3>Even the western side of the Cascades has no single fire story.</h3>
      <p>OSU Extension describes both of these landscapes in its Willamette Valley and Western Cascades guide. What fire did, and what work makes sense now, changes as the land changes.</p>
    </div>
    <div className="fire-region-pair">
      <div>
        <LandscapeIllustration kind="oak" />
        <div><span>Valley floor</span><h4>Prairie and oak</h4><p>Indigenous burning helped maintain open grasslands and oak habitat. Keeping those places open can be a management goal today.</p></div>
      </div>
      <div>
        <LandscapeIllustration kind="wet" />
        <div><span>Higher Cascades</span><h4>Cool, wet forests</h4><p>Longer intervals between fires were common at higher elevations. Some fires killed many trees; a frequent low-fire pattern is not the model for every stand.</p></div>
      </div>
    </div>
    <figcaption>These are illustrated vegetation examples, not a map of particular sites. <a href={source}>Read OSU Extension’s regional account ↗</a> · <a href={allRegions}>Compare all seven Oregon regions ↗</a></figcaption>
  </figure>;
}
