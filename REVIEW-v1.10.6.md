# Perennial Fallout — v1.10.6 release notes

**Baseline:** complete v1.10.5 website. This is a full GitHub-ready package, not an overlay.

## Requested fixes

1. **Live Shows:** All four confirmed performances appear in a single `Live Shows` grid. There is no separate `Past Shows` section.
2. **Ended shows:** On the calendar day *after* a performance (Phoenix time), the card retains its details but replaces active controls with non-clickable **SHOW ENDED** text. No ticket purchase or reminder controls are exposed for past entries.
3. **EPK backgrounds:** About, Sound, and Press Assets use full-viewport-width decorative texture layers rather than the narrow content column. The copy, buttons, and EPK hero are unchanged.

## Preserved behavior

- Upcoming events precede completed performances, which are ordered newest to oldest.
- The newsletter has one form. It is displayed below Meet The Band while any show records exist; an entirely empty schedule displays the no-shows signup instead.
- Existing band photography, 45-second preview, EPK download, legal/support pages, Fourthwall shop link, and Cloudflare Pages Functions are unchanged.

## Validation

- `npm run typecheck:client` — passed.
- `npm run typecheck:functions` — passed.
- Offline Chromium checks at 1440px, 390px and 320px — passed: one Live Shows grid, correct ended-show states, one newsletter, responsive cards, full-width texture, and no horizontal document overflow.
- Simulated Phoenix dates November 20 and November 21 — verified date rollover without making ended actions interactive.
- **Full Astro production build is not verified here** because the current Node.js version is 22.16.0 and the required Astro dependencies are not installed. On a supported Windows/Cloudflare environment with Node 22.23.4+, run `npm ci && npm run build` before publishing.

## Deployment

Extract the complete ZIP and test it using `START_WEBSITE.bat`. Copy its contents into the existing GitHub repo, preserving `.git`; commit and push when ready. Cloudflare Pages build command: `npm run build`; output directory: `dist`.
