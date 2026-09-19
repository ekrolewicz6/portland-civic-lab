# Sharing and search — September 19, 2026

The guide previously inherited the homepage's canonical URL, Open Graph title,
description and artwork. Every published guide page now declares its own title,
description, canonical URL, Open Graph and Twitter large-image metadata, and
page/breadcrumb structured data. Coverage is explicitly Portland City Council
Districts 3 and 4; these previews do not promise a complete Oregon guide.

The five 1200 × 630 PNG cards cover the guide index, Districts 3 and 4, editorial
standards, and the research log. The visual system uses the existing cream,
forest-green and gold palette, bundled Cormorant/DM Sans fonts and the Lab logo.
Large guide/district labels remain the primary information. No candidates are
featured or favored in the artwork. Images use local bundled assets and work
without a third-party font or campaign-image server.

The image routes live at `/voters-guide/share/{card}`. Metadata adds the version
from `GUIDE_IMAGE_VERSION`; bump it when changing published artwork to give
image caches a new URL. Social platforms separately cache page previews, so a
new image URL does not forcibly refresh an existing post. Use the platform's
sharing debugger/rescrape function when an already-shared link looks stale.

Candidate, topic and comparison fragments still restore the reader's chosen
view. Fragments are not sent to servers, so their social preview accurately
identifies the parent district guide, rather than claiming to show particular
candidates. The existing sharing/navigation behavior is unchanged.

Verification checks the raw HTML returned to Facebook, Twitter and Slack user
agents, without executing page JavaScript: one correct canonical, matching
titles/descriptions, one intended image, dimensions, alt text, large-card
metadata and structured data. Each declared image is fetched anonymously and
checked for a valid 1200 × 630 PNG under 1 MB. Invalid card IDs return 404.
All five rendered cards receive a visual inspection; these checks do not claim
to reproduce every app's crop or clear third-party caches.
