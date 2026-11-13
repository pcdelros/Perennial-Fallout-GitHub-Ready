# Changelog

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
