# Perennial Fallout — v1.10.0 review

This release starts from the provided **v1.9.0 EPK ZIP** and includes the new mix supplied alongside the update. The change is a **minor version increment** because the EPK underwent a substantial visual redesign and the homepage's show/newsletter presentation changed.

## Visual and content changes

- **Homepage lineup:** PETER is now **PETE**. The photograph and guitar role are unchanged.
- **Buy Track:** `https://perennial-fallout-shop.fourthwall.com/` on the homepage and EPK. This is the **store home**, not an automatic checkout for The Way. The shop must feature the song for customers to find it.
- **EPK:** Reuses the same header component, responsive menu, music equalizer button, site fonts, colors, images, textures, and pill styles as the homepage. The separate press-only masthead and jump navigation are gone. Content is organized as a hero, quick band facts, short bio with optional full bio, featured music preview, member portraits/bios, downloadable press assets, and booking contact. Redundant mission/performance/planned-project panels were removed from the *web page*; previously approved text remains in `src/data/epk.json` and in the one-page press sheet.
- **Booking contact:** `perennialfallout@gmail.com` on the EPK page and regenerated press PDF.
- **Press downloads:** The bundled ZIP and one-page PDF now show Pete's name and the contact email, and the portrait file within the ZIP is `pete.webp`. All links remain on the same paths.
- **New mix:** The submitted full-length audio was 200.54 seconds. The public website continues to serve the same 45-second preview window (starting 17.54 seconds into the supplied updated mix) via `/assets/audio/the-way.mp3`. The full purchased recording is not included in the site build. Both audio players use that same URL.
- **Shows and newsletter:** `siteConfig.shows` is now empty because the previous three shows were examples. The section says **NO SHOWS ANNOUNCED** and includes the only Enter The Fallout signup form on the homepage. If a genuine show is added to the array, the show cards return and the newsletter moves back below Meet The Band; never show two signup forms at once. Existing D1, Resend, Turnstile and API code is not changed.

## How to review

1. Run `npm ci`, then `npm run dev` and open the local homepage and `/epk/`. Use Node.js **22.23.4 or later**.
2. Check the shared navbar on desktop and mobile (including menu, EPK link, equalizer music toggle and links back to homepage sections).
3. Confirm the show empty state contains **Enter The Fallout** and there is no repeated newsletter below Meet The Band.
4. On the homepage, check the guitarist's name **PETE** and the link under BUY TRACK.
5. On the EPK, check the email link, audio, member disclosures, ZIP and PDF download. Open the PDFs and ZIP and confirm PETE and the booking email.
6. To test the future shows state, temporarily add a **confirmed** `Show` object to `src/data/site.ts`. The newsletter should move back below Meet The Band and disappear from the show list. Restore `shows: []` afterward if there is no confirmed performance.
7. For production, test desktop, mobile and Safari after Cloudflare publishes the GitHub commit. Verify the actual Fourthwall product listing and newsletter double opt-in; local development cannot verify payment fulfillment or email delivery.

## Testing limitation in this environment

The static assets, updated audio metadata, generated press bundle and PDF have been checked. A full Astro build was **not** completed in this container because its installed Node.js is older than the project's required 22.23.4 and npm registry access is unavailable. Run the checks below in the normal Node.js/Cloudflare build environment before publishing:

```bash
npm ci
npm run typecheck:client
npm run typecheck:functions
npm run check
npm run build
```
