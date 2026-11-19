# Perennial Fallout — v1.10.3 review

Built on **v1.10.2**. This release fixes the EPK layout regression and aligns the public support pages with the actual website integration.

## EPK hero root-cause correction

The old EPK `.press-hero` had a fixed `height:min(700px,58vw)`, and its flex-based `.press-hero-content` could shrink the new grid. This combination caused the bottom call-to-action button to fall under the information bar. The hero now sizes to its content, and the photo and copy use a full-width responsive grid. Both CTA links should remain visible before the information bar on desktop and mobile. The backdrop is near-black with restrained red/grain detail rather than a large gray background image.

## No-shows layout

- Kept the minimal no-shows form and text.
- Set the section's top and bottom padding to **96px each on desktop** and **76px each on mobile**.
- Existing behavior still switches to actual show cards and the standalone bottom newsletter once confirmed dates are provided in `siteConfig.shows`.

## Support-page audit

**Support links checked:** `/purchase-terms/`, `/privacy-policy/`, `/terms-of-use/`, and `/cookie-preferences/`. Their internal destinations resolve to existing Astro pages. Contact email remains `perennialfallout@gmail.com`.

**Content corrections:**
- The Buy Track destination is the Fourthwall **shop homepage**: `https://perennial-fallout-shop.fourthwall.com/`, not a direct product or instant checkout.
- No statement is made that a specific song is currently on sale; availability, price, files and delivery terms depend on the actual Fourthwall listing and checkout.
- The site's player offers a 45-second public preview, not a paid full-length download.
- Newsletter delivery depends on the Cloudflare Pages Functions, Turnstile site key/secret, D1 database and Resend configuration. The code uses double opt-in when enabled. The current code does not send regular marketing campaigns.
- Music preferences are kept in browser local storage only after the visitor chooses to save them.
- The EPK serves its fonts locally; home and support pages may load Google Fonts.
- Support pages show a revised date of November 18, 2026.

**Not verified from source code:** whether the Fourthwall store presently lists and fulfills The Way, whether Cloudflare email secrets/bindings are enabled in the live project, or whether optional analytics exist in external provider dashboards. Do not assert these as confirmed. This content is operationally aligned with the code; the band should review the legal pages before publishing.

## Layout verification

An offline Chromium reconstruction using the actual styles and image assets was checked at desktop, tablet and mobile widths of 1650, 1200, 900, 768, 393 and 320px. All measured EPK CTA rectangles were above the following info bar by at least 64px. The sections had no horizontal overflow at those widths. At 393px and 320px, the no-shows section had identical 76px top and bottom padding; at 1440px, both paddings were 96px.

Full Astro compilation was **not** run because this environment's dependencies do not contain a runnable Astro CLI. Run `npm ci` and `npm run build` with a supported Node.js version before pushing to Cloudflare Pages.

## Main files changed

- `src/styles/epk.css` — remove the original height/flex constraints
- `src/styles/v1.10.3.css` — stable hero and empty-state styles
- `src/layouts/BaseLayout.astro`, `src/pages/epk/index.astro` — include new release CSS
- `src/layouts/SupportLayout.astro` — revision date
- `src/pages/{purchase-terms,privacy-policy,terms-of-use,cookie-preferences}/index.astro` — content corrections
- `package.json`, `package-lock.json`, `CHANGELOG.md`, `README.md`
