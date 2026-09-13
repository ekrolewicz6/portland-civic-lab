export const GUIDE_SOURCES = {
  ecology:
    "https://extension.oregonstate.edu/catalog/pub/em-9340-ecological-effects-fire",
  purpose:
    "https://extension.oregonstate.edu/catalog/em-9339-prescribed-fire-why-we-burn",
  planning:
    "https://extension.oregonstate.edu/catalog/pub/em-9343-planning-prescribed-burn",
  weather:
    "https://extension.oregonstate.edu/catalog/em-9385-prescribed-fire-basics-fire-weather",
  smoke:
    "https://extension.oregonstate.edu/catalog/em-9203-fire-faqs-air-quality-impacts-prescribed-fire-wildfire",
  egley: "https://research.fs.usda.gov/treesearch/59149",
  egleyPaper: "https://research.fs.usda.gov/download/treesearch/59149.pdf",
  finley: "https://www.fws.gov/refuge/william-l-finley/what-we-do",
  nasa: "https://modis.gsfc.nasa.gov/gallery/individual.php?db_date=2020-09-29",
  census:
    "https://www.census.gov/geographies/reference-files/time-series/geo/gazetteer-files.html",
};
export const LANDSCAPES = [
  {
    id: "pine",
    name: "Dry pine forests",
    eyebrow: "East of the Cascades",
    title: "Room for fire. Room for big trees.",
    body: "In many dry pine forests, recurring surface fire helped maintain open stands. Fire exclusion can allow small trees and surface fuels to accumulate. The objective may be to restore a more open forest and reduce damaging fire effects.",
    question: "What fuels have accumulated, and which trees should survive?",
    caution:
      "A treatment can change fire effects without preventing a wildfire. Weather, terrain, treatment age, and follow-up all matter.",
    bbox: "-121.9,43.6,-120.8,44.6",
    mapLabel: "Explore the Bend area",
    source: GUIDE_SOURCES.ecology,
  },
  {
    id: "wet",
    name: "Wetter western forests",
    eyebrow: "Coast Range & western Cascades",
    title: "A different forest. A different rhythm.",
    body: "Wetter forests can have long intervals between fires. Some historically experienced severe fire that replaced much of the canopy. A dry-forest prescription does not automatically fit these places.",
    question:
      "How do this forest’s ecology, weather, and nearby communities shape the choices?",
    caution:
      "A historical pattern is context, not a forecast or a fixed schedule for a changing climate.",
    bbox: "-123.5,43.8,-122.2,45",
    mapLabel: "Explore the western Cascades",
    source: GUIDE_SOURCES.ecology,
  },
  {
    id: "oak",
    name: "Oak & prairie",
    eyebrow: "Willamette Valley",
    title: "Sometimes the goal is to keep a place open.",
    body: "Fire can help maintain grasslands and oak habitats as shrubs and trees encroach. Objectives may include habitat and culturally important plants. Cultural burning has its own purposes, knowledge, and leadership.",
    question:
      "Which plants, animals, and cultural relationships are we trying to sustain?",
    caution:
      "Cultural-fire stories belong in partnership with the people whose knowledge and lands they describe.",
    bbox: "-123.6,44.2,-122.8,45",
    mapLabel: "Explore the Corvallis area",
    source: GUIDE_SOURCES.purpose,
  },
  {
    id: "sage",
    name: "Sagebrush country",
    eyebrow: "Southeastern Oregon",
    title: "More fire is not always the answer.",
    body: "In sagebrush landscapes, invasive annual grasses can contribute to repeated fire and changes in habitat. Understanding the plant community and its condition comes before choosing a treatment.",
    question:
      "Would another fire support this habitat—or help invasive plants replace it?",
    caution:
      "Neither “burn everything” nor “exclude every fire” is a useful rule for all of Oregon.",
    bbox: "-119.8,42.9,-118.2,44",
    mapLabel: "Explore the Burns area",
    source: GUIDE_SOURCES.ecology,
  },
] as const;
export const STORIES = [
  {
    id: "woodpecker",
    name: "Woodpecker",
    location: "McDonald-Dunn Research Forest",
    type: "A documented prescribed burn",
    title: "Two units. Two restoration goals.",
    intro:
      "In October 2025, OSU students burned two units with different objectives: releasing oak and madrone in one, supporting Willamette Valley ponderosa pine in the other.",
    source: "https://www.forestry.oregonstate.edu/news/fire-purpose",
    sourceLabel: "OSU College of Forestry · April 3, 2026",
    bbox: "-123.5,44.5,-123.15,44.85",
    mapLabel: "Explore the surrounding Corvallis area",
    mapNote:
      "Regional context only. Burn-unit geometry has not been verified; we do not place a pin on these units.",
    timeline: [
      {
        year: "Before",
        title: "Choose the objective",
        text: "The account identifies the vegetation each unit was intended to support, rather than offering one generic reason for burning.",
      },
      {
        year: "October 2025",
        title: "Work with conditions",
        text: "OSU describes damp fuels and patchy burning, alongside planning and communication with nearby residents.",
      },
      {
        year: "Next question",
        title: "Did the intended plants benefit?",
        text: "This account documents the burn and its purpose. We have not obtained repeated vegetation measurements or a long-term outcome report.",
      },
    ],
    objective:
      "Release oak and madrone; support Willamette Valley ponderosa pine.",
    observed:
      "Burning and patchy effects described in OSU’s published account.",
    missing:
      "Verified unit boundaries, repeat vegetation measurements, costs, and comparable alternatives.",
  },
  {
    id: "egley",
    name: "Egley",
    location: "Malheur National Forest · 2007",
    type: "A wildfire meets earlier treatments",
    title: "The same fire. Different histories.",
    intro:
      "Researchers compared previously treated and untreated areas of the Egley Fire Complex, then revisited field sites one and nine years after the fire.",
    source: GUIDE_SOURCES.egley,
    sourceLabel: "Dodge and colleagues · Fire Ecology, 2019",
    bbox: "-120.1,43.5,-119.1,44.3",
    mapLabel: "Explore 2007 perimeters near the study",
    mapNote:
      "Map shows source perimeters in the study region. The published figure below supplies the treatment and field-site comparison; these are not inferred matches to today’s treatment records.",
    timeline: [
      {
        year: "1985–2007",
        title: "Several kinds of treatment",
        text: "The study grouped harvest, thinning, pile burning, prescribed fire, and some earlier wildfire together. It does not isolate the effect of prescribed burning alone.",
      },
      {
        year: "2008 · one year",
        title: "Less high-severity area",
        text: "High severity covered 12.9% of treated land versus 26.7% of untreated land in the landscape comparison. These are observed study results, not a randomized experiment or a prediction for another fire.",
      },
      {
        year: "2016 · nine years",
        title: "Recovery has several measures",
        text: "Untreated, high-severity sites had the highest total fuel loads. Invasive cover was also higher at high-severity sites. A returning satellite vegetation signal did not mean every forest attribute had recovered.",
      },
    ],
    objective:
      "Study how prior treatments and wildfire severity relate to later vegetation and fuels.",
    observed:
      "Satellite comparisons plus repeated field measurements at paired sites.",
    missing:
      "Project-specific costs, smoke exposure, and causal effects of each separate treatment type.",
  },
  {
    id: "finley",
    name: "Finley",
    location: "Willamette Valley refuge complex",
    type: "An ecological burning program",
    title: "A prairie is a landscape worth keeping.",
    intro:
      "The refuge program uses prescribed fire as one of several tools to maintain prairie and oak habitats. Its goals also include threatened species and food for wintering geese.",
    source: GUIDE_SOURCES.finley,
    sourceLabel: "U.S. Fish & Wildlife Service · program description",
    bbox: "-123.55,44.3,-123.1,44.7",
    mapLabel: "Explore the surrounding valley",
    mapNote:
      "This is a program story, not a confirmed individual burn. Regional map context does not mark completed refuge burn units.",
    timeline: [
      {
        year: "Prepare",
        title: "Restore the plant community",
        text: "Refuge managers describe weed control, site preparation, planting, and continued maintenance of former croplands.",
      },
      {
        year: "Late summer / fall",
        title: "A regional burn season",
        text: "The refuge says most of its prescribed burning occurs in late summer or early fall. That does not establish the date of any individual burn.",
      },
      {
        year: "Evaluate",
        title: "Look beyond acres",
        text: "The program describes habitat and wildlife objectives. Unit-level permits, actual burn dates, and measured outcomes still need to be added to this atlas.",
      },
    ],
    objective:
      "Maintain native prairie and oak habitats and support target species.",
    observed:
      "The agency describes an active burning and habitat-management program.",
    missing:
      "Unit histories, completion records, monitoring results, costs, and attributable before/after photographs.",
  },
] as const;
export const SEASONS = [
  {
    id: "winter",
    name: "Winter",
    months: "December–February",
    title: "Prepare while the landscape is wet.",
    text: "Plans, site preparation, crew readiness, and communication can continue when a site is too wet to meet its burn objectives. Some kinds of burning may still be possible; this is not a statewide closure calendar.",
  },
  {
    id: "spring",
    name: "Spring",
    months: "March–May",
    title: "Look for a workable window.",
    text: "Practitioners may find conditions between winter wetness and summer drying. A suitable day depends on the particular fuels, objectives, smoke dispersal, and resources—not the month alone.",
  },
  {
    id: "summer",
    name: "Summer",
    months: "June–August",
    title: "Heat narrows some options.",
    text: "Hot, dry conditions can make a prescribed burn harder to control. Crews also respond to wildfires. Some habitat programs burn in late summer when local conditions and objectives align.",
  },
  {
    id: "fall",
    name: "Fall",
    months: "September–November",
    title: "Rain can open a window—or close it.",
    text: "Changing moisture and weather can create opportunities before fuels become too wet. The Willamette Valley refuge program reports most burning in late summer or early fall.",
  },
] as const;
