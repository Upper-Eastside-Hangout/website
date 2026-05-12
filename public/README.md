# /public assets — drop these in before first deploy

The site references these by path. They're omitted from git intentionally so
the source tree stays light.

Required (Phase 0):

- `logo-primary.png` — Transparent PNG of the Hangout wordmark+flamingo mark.
  Used in the Hero. Source: `richycooks_FO2DDF84B942_V2_REV1.png` from the
  designer drop. Suggested width >= 1400px for retina.
- `logo-cream.png` — Cream/white variant of the wordmark for the dark forest
  footer. If you don't have one yet, the brief notes a vector SVG should be
  commissioned later; for now, drop the same PNG and it'll appear darker than
  ideal but won't break the layout.
- `og-image.png` — 1200x630 social card. Quick first pass: the primary logo
  centered on a `#F5EBD8` cream rectangle exported at 1200x630.
- `favicon.ico`, `apple-touch-icon.png` — Generate from the logo via any
  favicon generator (e.g. realfavicongenerator.net). Drop the resulting files
  here. Apple touch icon should be 180x180.

Optional:

- `neighborhood-illustration.png` — The framed "UPPER EASTSIDE MIAMI" art
  block from the mockup. If absent, the Neighborhood section renders a styled
  text placeholder.
