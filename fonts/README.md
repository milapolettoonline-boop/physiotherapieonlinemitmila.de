# Locally hosted fonts

All public pages load their fonts from this folder instead of Google Fonts, so no font request leaves the visitor's browser before a consent decision.

## Contents

- `fonts.css`: `@font-face` rules for DM Sans (400, 500, 600, 700), Playfair Display (600, 700) and Poppins (300, 400, 500, 600, 700, 800). Each rule keeps the `unicode-range` and `font-display: swap` that Google Fonts declares for these families.
- `files/`: WOFF2 files for the `latin` and `latin-ext` subsets.
- `licenses/`: SIL Open Font License 1.1 texts for each family, copied from the official Google Fonts repository.

## Source and method

- CSS and WOFF2 files were taken from the Google Fonts CSS2 API for the same family and weight request the pages used before (`DM Sans` 400 to 700, `Playfair Display` 600 and 700, `Poppins` 300 to 800, `display=swap`).
- Subsets other than `latin` and `latin-ext` (Cyrillic, Vietnamese, Greek) are not hosted. German text, including umlauts and ß, is covered by `latin`.
- Layout was checked against the previous version: 2562 text elements compared for position, size, font family, weight and size, with no differences, and identical screenshots at 1440x900 and 390x844.

## Updating

Fetch new files from the Google Fonts CSS2 API with the same family and weight parameters, keep the `latin` and `latin-ext` blocks, and replace the matching files in `files/`. Keep the OFL texts in `licenses/` and update `fonts.css` if the file names change.

Google Fonts is not used by any page. Do not add a `fonts.googleapis.com` or `fonts.gstatic.com` link to the site.
