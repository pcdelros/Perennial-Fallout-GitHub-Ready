# Changelog

## v1.10.6 — unified live shows and edge-to-edge EPK textures

- Removed the separate **Past Shows** section. All four dates remain in the **Live Shows** grid, with upcoming performances first and older dates following in reverse chronological order.
- Replaced past-show action buttons with a visibly subdued, **non-interactive SHOW ENDED** status. Past events retain their dates, venues, times, and address links; no unsupplied ticket links are introduced.
- Preserved date rollover by Phoenix calendar date, and kept only one newsletter form. The empty state is reserved for an entirely empty show list.
- Extended the EPK About / Sound / Press Assets backdrop layers across the full viewport instead of clipping them to the centered content columns. Text and controls retain their previous content width, and parallax remains supported.
- Kept the complete website package and Windows launcher, with updates to the README and validation notes.

## v1.10.5 — confirmed dates and past shows archive

- Added four performances provided by Pete: **The Blooze** on Nov 20 (10 PM), Oct 23 (11 PM), and Sep 26 (11 PM), and **The 44 Sports Grill** on Sep 19 (9 PM), all in 2026.
- Added the supplied full venue addresses and working **Get Directions** Google Maps links, with no fabricated ticket-sale links or set lengths.
- Added a distinct **Past Shows** archive that preserves completed dates without treating them as upcoming events. Upcoming shows are sorted chronologically and past shows reverse chronologically.
- Added browser-side filtering by the **Phoenix, Arizona calendar date** so the Nov 20 show moves into Past Shows after that date passes, without requiring another deployment.
- Kept a **single** newsletter signup form: it appears below Meet The Band when upcoming shows exist, or inside the **No Shows Announced** state when none remain.
- Preserved the v1.10.4 EPK, hero, mobile styles, support pages, audio preview, and existing integrations.

## v1.10.4 — EPK illustrated background restoration and desktop title

- Restored the existing castle/ruins artwork in the EPK hero, replacing the grain-only override introduced in v1.10.3. The original image stays in the codebase and participates in the existing scroll-depth animation.
- Kept the 1:1 band photo card and its pointer-driven 3D hover effect intact.
- Removed the forced line break in the EPK heading. **PERENNIAL FALLOUT** displays on one line at desktop widths, with fluid font sizing to avoid column overflow.
- Preserved the intentional two-line heading on mobile and the existing mobile hero layout.


## v1.10.3 — EPK hero layout fix, balanced no-shows spacing, support-page audit

- Fixed the EPK hero clipping at the source by removing its old fixed-height and flex shrink-to-fit constraints. A full-width responsive grid now lets the square band photo, heading, and **both CTAs** determine the hero height before the information bar.
- Tuned the EPK hero background to a restrained black/burgundy grain treatment instead of the distracting gray imagery. Preserved the square image and 3D hover/parallax effects.
- Set equal top and bottom section padding around the homepage **No Shows Announced** empty state (**96px desktop**, **76px mobile**).
- Audited all four support pages and their navigation paths against the current code. Corrected Purchase Terms to say Buy Track opens the **Fourthwall shop homepage**, not a direct product listing; clarified that product availability and file formats depend on the Fourthwall listing.
- Updated privacy, terms, and cookie wording to reflect **45-second previews, conditional Cloudflare D1/Turnstile/Resend setup, local preferences, and EPK locally hosted fonts**. Updated the support-page revision date.
- Verified the layout with offline Chromium DOM measurements at **1650, 1200, 900, 768, 393 and 320px**. The EPK CTAs clear the following section, and the tested pages show no horizontal overflow. The full Astro build was not available in this environment.

## v1.10.2 — SSFR homepage and EPK mobile fixes

- Restored the **NEW SINGLE** eyebrow to its own line above **THE WAY** by returning the song title to block layout while preserving the subtle rumble effect during playback.
- Simplified the Live Shows empty state by removing the decorative `shows-empty-mark` and hiding the **Live Shows** header when no confirmed dates exist, leaving only the empty-state copy and signup area.
- Adjusted the EPK mobile hero so the square image card sits lower and remains fully in view more reliably.
- Updated the EPK mobile **Meet The Band** behavior so all biographies are expanded automatically rather than using accordions.
- Reworked the EPK parallax script to use the same delayed, eased trailing motion style as the homepage instead of immediate direct movement.
- Cleaned up the mobile formatting of `press-info-bar textured press-parallax` into a stacked single-column summary layout.

## v1.10.1 — EPK polish, homepage CTA cleanup and player motion

- Removed the extra **Enter The Fallout** heading/copy block from the no-shows state. The embedded signup now shows only the form and consent text beneath the empty-state message.
- Updated the homepage **Meet The Band** actions by removing **About Us** and making **View EPK** the primary button.
- Increased the homepage hero artist name under **The Way** to **16px** and added a subtle rumble animation on the song title while the preview is actively playing.
- Reworked the EPK hero away from the blown-out homepage crop. It now uses a square 1:1 band image card on a black stage with hover-based 3D tilt on desktop.
- Added scroll-driven 3D/parallax background motion across the major EPK sections to better match the homepage’s depth and movement.
- In the EPK **Meet The Band** section, member biographies now display fully expanded on desktop and remain accordion-based on mobile.

## v1.10.0 — EPK redesign, updated preview and live-show empty state

- Replaced the EPK-specific header with the same `Header.astro` navigation used on the homepage. Redesigned the EPK as a streamlined editorial press page, using the existing burgundy/black textures, typography, pills and photographic visual direction.
- Updated Peter’s displayed homepage name to **PETE**, and kept the approved EPK name, biography and portrait aligned. Regenerated the PDF, downloadable bios and press ZIP to reflect Pete and the public booking contact.
- Set booking and press inquiries to **perennialfallout@gmail.com**.
- Updated BUY TRACK destinations on both pages to the Fourthwall store homepage.
- Updated the homepage and EPK audio with the supplied new mix, preserving the original public **45-second preview** to avoid exposing the full recording.
- Removed all three unverified sample concerts. Live Shows now has a dedicated no-dates state that includes Enter The Fallout signup. When shows are populated, the signup appears in its usual lower-page location instead. There is only one newsletter form on the homepage at a time.
- Preserved the existing Cloudflare newsletter flow, download paths, mobile menu behavior, support pages, and homepage artwork.


## v1.9.0 — Electronic press kit

- Added the dedicated `/epk/` page with Peter Orillo’s approved biography, lineup, sound, mission, performance description and planned activities.
- Connected the homepage desktop and mobile menus, View EPK action and footer Quick Links to the EPK in a new tab. The EPK links back to the homepage and its sections.
- Added nine native disclosures, responsive portraits, locally served Metal Mania and Barlow on the EPK, share metadata, a native audio preview and the existing Fourthwall purchase destination.
- Added a printable, one-page PDF, three plain-text biography downloads, the band logo and website-size group photo. The complete press ZIP also includes all five member portraits.
- Replaced the full-length public MP3 with the same excerpt previously selected in the browser. Both players share the existing asset URL. The clip contains 45 seconds of decoded audio.
- Updated the Windows launcher to let Astro open the browser after the server starts. The port, double-click workflow and first-run installation from the lockfile are preserved.

Release notes, the file inventory and validation results are in [REVIEW-v1.9.0.md](./REVIEW-v1.9.0.md).

## v1.8.3 — Newsletter integration and Support pages

- Added complete Purchase Terms, Privacy Policy, Terms of Use, and Cookie Preferences pages, linked from the existing footer.
- New branded support layout, responsive page navigation and working music player preference controls.
- Cloudflare Pages Functions implement double opt-in newsletter signup, Resend confirmation/welcome emails, Gmail notifications and unsubscribe. D1 migration and deployment guide included. The integration requires production Cloudflare and Resend configuration to send messages.
- Kept the approved homepage layout, media, animation and existing button styles; newsletter button is uppercase **SUBSCRIBE**.


## v1.8.1

- **Desktop hero:** Fade the upper edge of the actual artwork into the black page background while retaining the previously approved side fades. This removes the hard horizontal seam visible behind the desktop navigation.
- **Mobile hero:** Reduce excess dark space beneath the band on taller phones by capping the stage to the photograph’s full-width proportions; preserve the existing height limit on shorter devices and the lowered drummer framing. Shift the bottom fade closer to the stage edge to blend smoothly into the music player.
- **Mobile Live Shows:** Reduce show-card content-to-actions row gap from 40px to **8px**, a 32px reduction.
- **New Single:** Add a low-intensity, slow text-only shine animation on the eyebrow label, with reduced-motion support.
- **Compatibility:** Leave player logic, navigation, existing hero images, band portraits, and all other sections unchanged.

## v1.8

- **Desktop:** Softly fade the actual left and right edges of the bottom-aligned hero artwork into black, avoiding sharp vertical cutoffs on wide displays while retaining the full composition.
- **Mobile:** Shift the full-width hero image slightly downward, keep the drummer below the navigation logo, and feather the photo and hero overlays into the exact music-player background color to eliminate the horizontal seam.
- **Mobile:** Set the featured song title to 36px and the newsletter form's row gap to 12px.
- **Global:** Fix the About Us action so it targets the band section (`#band`) rather than the heading inside its padded container, preserving the visible top spacing after clicking.
- **Scope:** All v1.7.5 music player, sharing, parallax, textures, and other sections remain unchanged.

## v1.7.5

- Desktop hero image now sits bottom-center within the hero stage, eliminating the unused black strip below the artwork, while preserving its aspect ratio.
- Mobile hero artwork now feathers its top and bottom edges into the surrounding backgrounds without cropping its sides.
- Mobile show-card internal row gap increased by 24px (16px → 40px).
- Featured song title now displays at 48px.
- The existing **Share** action is preserved; it opens native sharing where supported, with a copy-link fallback.
- Player progress now updates with a lightweight animation-frame loop during playback as well as media events, and reliably ends a scrub when a pointer is released outside the slider.
- All other v1.7.3 design, media, and interactions are retained.

# v1.7.3 — Band member names and single sharing

- Updated the five band portraits with **uppercase** names: DONNIE (drums), PETER (guitar), CLINT (vocals), CHAD (guitar), ODIN (bass).
- Confirmed **CHAD** is the bearded guitarist (`member-guitar-2.webp`) and **PETER** is the other guitarist (`member-guitar-1.webp`).
- Replaced the hero music-player **ALL MUSIC** button with **SHARE**.
- The Share button opens the native share sheet on supported mobile devices (including Safari on iPhone). On other browsers it copies a link to the `#music` section; the button briefly says **LINK COPIED**. Canceling the share sheet does not copy the link.
- Kept the v1.7.2 mobile hero image behavior and the music scrubber fixes unchanged.
- Updated `package.json`, `package-lock.json`, and the HTML deployment version marker to `1.7.3`.

## Deploy

Copy the contents of the archive into the existing Cloudflare-connected GitHub repository root, commit, and **Push origin**. Check the successful Cloudflare deployment before refreshing Safari.
