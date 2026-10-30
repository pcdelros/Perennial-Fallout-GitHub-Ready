# v1.7.1 — Mobile Safari hero framing

- Added `public/assets/images/hero-mobile-v171.webp`, a faithful crop of the existing hero source; updated `<picture>` to load it on phones. Desktop source is unchanged.
- Stabilized mobile picture placement in its 60svh hero stage and reduced black dead space around the band. The band remains fully visible at typical widths without overlapping the header logo.
- Improved top and bottom image blending; preserved v1.7 45-second seek/scrub changes and subdued grain.
- Included a production `application-version` meta tag, and added GitHub/Cloudflare verification instructions to distinguish outdated deployments from Safari layout issues.
- No EPK page or new services.
