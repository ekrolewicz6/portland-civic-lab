# Source archive manifests

Every raw file the Lab downloads for its research is saved privately under `runtime-data/source-archive/<date>/` in the main checkout (git-ignored, because of size and because some downloads are bulky copies of public feeds). One manifest per date in this folder lists each file's source URL, size and SHA-256, so a figure on the site can always be traced to the exact file it was read from.

Add to the archive whenever something is downloaded, and add its line to that day's manifest in the same change.
