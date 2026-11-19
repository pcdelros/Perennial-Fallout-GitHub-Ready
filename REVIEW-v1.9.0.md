# Perennial Fallout v1.9.0 | Local review

The new electronic press kit lives at `/epk/`. Desktop and mobile visitors can read the band’s approved biography, see the five performers, hear “The Way” and download a one-page press sheet or the complete press asset bundle.

## Open it on Windows

1. Extract the entire ZIP into a new folder. The project root contains `START_WEBSITE.bat` alongside `package.json`.
2. With Node.js 22.23.4 or later and npm installed, double-click `START_WEBSITE.bat`. The first run needs an internet connection for `npm ci`. Keep the command window open while reviewing.
3. The homepage opens at `http://127.0.0.1:4321/`. Choose **View EPK** or enter `http://127.0.0.1:4321/epk/`.
4. For mobile layouts, press **F12** in Edge or Chrome, then **Ctrl+Shift+M**. Choose **Responsive** and enter 320, 390, 768 or 1440 for the width. Try the mobile menu, member biographies, playback and downloads.
5. Press **Ctrl+C** in the command window to stop. If Windows asks whether to terminate the batch job, enter **Y**.

## What changed

The EPK has a compact photographic hero, an introduction, the lineup, the sound, the mission, live performance, planned projects, press resources and booking information. Peter’s approved text supplies the band and member biographies. The homepage retains the name **PETER** and the kit uses his approved billing, **Pete · Lead Guitar**.

The two homepage navigation menus, the band section’s View EPK action and footer Quick Links open the dedicated page in a new tab. Visitors can return through **Back to site**, the header logo or the shared footer. On the EPK, the footer’s EPK link returns to the top of the current page.

Nine native HTML disclosures expose the full band bio, the five individual bios, the longer mission, performance details and planned projects. Each supports mouse, touch, Enter and Space through the browser. The summary retains focus, its chevron reflects the open state, and the browser supplies the expanded or collapsed announcement. Reduced-motion preferences disable the transitions.

The EPK’s native audio controls play the same passage as the homepage. The v1.8.4 public MP3 contained the entire recording. Its player selected a 45-second window starting about 17.54 seconds into that file. The replacement at the same URL contains that passage only. The existing Fourthwall product URL remains the purchase destination.

## Files modified

| Existing file | Change |
| --- | --- |
| `src/components/Header.astro` | Real EPK links in the desktop and mobile menus. |
| `src/components/Band.astro` | The existing View EPK control links to the dedicated page. |
| `src/components/Footer.astro` | EPK Quick Link across the homepage and support pages, with current-page behavior on the EPK. |
| `src/layouts/BaseLayout.astro` | Page-specific head slot, optional locally served fonts and a version marker read from the package. |
| `src/data/site.ts` | Imports the existing roster from shared member data. |
| `src/scripts/player.ts` | The custom homepage player starts at the beginning of the physically trimmed excerpt. |
| `public/assets/audio/the-way.mp3` | Contains 45 seconds of audio at the original public path. |
| `START_WEBSITE.bat` | Uses Astro’s `--open` option to launch the browser after startup. |
| `package.json`, `package-lock.json` | Updates the project version to 1.9.0. |
| `README.md`, `CHANGELOG.md` | Local preview instructions and release history. |

## Files added

| Location | Contents |
| --- | --- |
| `src/pages/epk/index.astro` | The new route, press navigation, metadata, print hook and native audio error feedback. |
| `src/components/epk/` | `Disclosure.astro`, `Lineup.astro`, `Sound.astro`, `Resources.astro` and `PressIcon.astro`. |
| `src/data/epk.json` | Peter’s approved text, lineup billing, genre, public site origin, group image and booking email field. |
| `src/data/members.json` | The five original portrait assignments, names, roles, alternative text and homepage order. |
| `src/styles/epk.css` | EPK styling for desktop, tablet, phone, keyboard focus, reduced motion and print. |
| `public/assets/epk/` | Five 480-pixel portrait derivatives, one 640-pixel hero, a sharing JPEG and the artwork embedded in the supplied “The Way” MP3. |
| `public/assets/fonts/` | The existing Barlow and Metal Mania families in local webfont format, with both licenses. |
| `public/press/` | Short and full band bios, member bios, the printable PDF and the complete press ZIP. |
| `scripts/build-press-assets.py` | Optional maintainer command for regenerating press copy, images, PDF and ZIP. |
| `REVIEW-v1.9.0.md` | Development summary, verification results and remaining band inputs. |

## Press downloads and future edits

**Download EPK** saves a US Letter one-page PDF with selectable text, named portraits, the sound, live highlights, planned projects and the website address. **All press assets** saves 11 files, including the PDF, three TXT files, the SVG logo, the group image and five individual portraits. The press bundle contains website-resolution WebP images. Individual resource links also work directly. Browser printing of the HTML page expands all nine disclosures for printing and restores the previous open states afterward.

Edit approved copy and `bookingEmail` in `src/data/epk.json`. Enter the verified address without a `mailto:` prefix. The page then shows an email link and the press-sheet generator picks up the address. Roster photographs are resolved from `src/data/members.json`.

For maintainers updating the downloads, run `python scripts/build-press-assets.py` with Pillow, fontTools and ReportLab installed in a Python environment. Review the regenerated one-sheet for fit. All generated assets are included in the release. Windows preview and the standard Astro build need only Node.js and npm.

## Validation report

Tests used Node.js 24.22.3, npm 11.9.0 and the supplied lockfile’s Astro 7.4.4. The five requested commands were repeated on a fresh extraction into a folder whose name contained spaces.

| Command | Result |
| --- | --- |
| `npm ci` | Passed. Installed 266 packages from the existing dependency lock. |
| `npm run typecheck:client` | Passed. |
| `npm run typecheck:functions` | Passed. |
| `npm run check` | Passed. Zero errors and zero warnings. One existing deprecation hint refers to the homepage clipboard fallback in `src/scripts/links.ts`. |
| `npm run build` | Passed. Produced eight static pages, including `dist/epk/index.html`. |

| Functional check | Result |
| --- | --- |
| Local entry points | Ran the launcher's `npm run dev -- --open` command on Linux. All eight page routes, the PDF and the press ZIP returned HTTP 200 at port 4321. A test browser-open handler received the homepage URL and fetched it successfully. Interrupting the server released the port. |
| Navigation | Exercised the homepage menus, band action and footer link in Chrome. The EPK opened separately. The mobile menu closed after selection. Followed Live shows from the EPK back to the homepage. Also checked every EPK internal URL and fragment against the built pages. |
| Portraits and content | Matched the five names, instruments, paths and bios to the supplied lineup. The eight original homepage image files are byte-identical to v1.8.4. |
| Disclosures and keyboard | Tested opening and closing all nine, the full biography with Enter and Space, and a member biography with the keyboard. Chrome exposed named controls and their expanded or collapsed state. |
| Preview and checkout link | Played the excerpt in Chrome on both pages. Tested homepage seeking to the end and replay. Scrubbed the EPK player, then observed it stop at exactly 45 seconds. Decoding the public MP3 produced 45.000 seconds, and the samples matched the original excerpt. Local media range requests returned HTTP 206. Both pages link to the same Fourthwall product. |
| Downloads and print | Chrome initiated the PDF and ZIP downloads. Verified the one-page PDF’s text, portraits, links and rendered layout. Opened and integrity-checked all 11 bundle members. Checked each individual download target. Verified expansion and state restoration across browser print events. |
| Homepage regression | Built the supplied v1.8.4 homepage and compared its rendered structure with v1.9.0. They match after accounting for the four EPK controls, version marker and hashed asset filenames. Existing styles, photographs, Cloudflare Functions, migration and newsletter server module matched the source ZIP. Checked the local newsletter setup message and Merchandise Coming Soon feedback. |
| Browser diagnostics | Observed no application console errors during the tested EPK and homepage interactions. |
| Accessibility | Ran axe-core on the production EPK at 390 and 1440 pixels with disclosures closed and open. It reported zero violations in the selected WCAG A/AA rules. The tool flagged color contrast for manual review. Sampled body, disclosure, tag and primary-button foreground/background pairs ranged from 7.9:1 to 15.7:1. |

### Responsive checks

Chrome rendered the built page at each width, both collapsed and with every disclosure expanded. Measurements included document overflow, clipped or out-of-bounds text, hero-button overlap and main-content control heights.

| Viewport | Layout | Result |
| --- | --- | --- |
| 320 px | Stacked hero actions and compact portrait rows | Passed |
| 390 px | Phone layout and mobile navigation | Passed |
| 768 px | Two-column content and a three-column lineup | Passed |
| 1440 px | Two-column hero and a five-column lineup | Passed |

At all four widths, document content fit the available width, checked body copy was at least 16 px, and checked main-content link and disclosure targets were at least 44 px tall.

### Test limits

The interactive tests ran in desktop Chrome with responsive viewports. Windows double-click behavior, a physical iPhone with Safari, assistive-technology speech output and a physical printer were unavailable. The batch file retained Windows line endings. The launcher command, browser-open callback and server shutdown were exercised on Linux. Live Fourthwall purchase fulfillment and production newsletter delivery were outside this local review.

## Items awaiting the band

| Item | Current presentation |
| --- | --- |
| Verified public booking and press email | The contact section shows a pending-confirmation message. |
| Approved performance video URL | The live section uses the supplied description. |
| Original high-resolution promotional photography | Available downloads use the supplied web-size images. |
| Confirmed appearances and release dates | The EPK lists planned activities. The homepage’s sample shows stay out of the kit. |
