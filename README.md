# Perennial Fallout — Website v1.8.3

Official Perennial Fallout website. Built with **Astro 7 + TypeScript**, statically deployed through **GitHub → Cloudflare Pages**. This update adds complete Support pages and a fully coded optional email signup flow via Cloudflare D1 + Resend while preserving the existing responsive homepage, audio preview, band portraits, and branding.

## What's in this release

- Four complete responsive support pages linked in the existing footer: `/purchase-terms/`, `/privacy-policy/`, `/terms-of-use/`, `/cookie-preferences/`.
- Cookie Preferences lets visitors enable/disable persistence of music-player volume and repeat, or erase saved preferences; no site-operated analytics or advertising tags are present.
- Newsletter button uses **SUBSCRIBE** and **SUBSCRIBING…** with matching uppercase button typography.
- Newsletter backend: Cloudflare Turnstile, D1 subscriber storage, double opt-in confirmation, Resend welcome email, band notification to `perennialfallout@gmail.com`, and unsubscribe.
- All private API keys and subscriber records remain outside the frontend and Git repository.

**Newsletter email delivery requires configuration in Cloudflare and Resend; deploying the ZIP alone does not activate it.** Follow [SETUP-NEWSLETTER.md](./SETUP-NEWSLETTER.md) for exact steps. The public form fails closed and does not pretend subscribers are registered before backend setup is complete.

## Website details

- `src/pages/index.astro` — homepage
- `src/pages/{purchase-terms,privacy-policy,terms-of-use,cookie-preferences}/` — public support pages
- `src/layouts/SupportLayout.astro` + `src/styles/support.css` — responsive branded legal layout
- `src/scripts/preferences.ts` — optional volume/repeat persistence, controlled by cookie preferences
- `src/components/Newsletter.astro` + `src/scripts/newsletter.ts` — existing form with confirmation UI
- `functions/api/newsletter/` — Cloudflare Pages Functions
- `server/newsletter.ts` — shared server-only email, verification and token helpers
- `migrations/0001_subscribers.sql` — D1 schema, not executed until setup
- `src/data/site.ts` — band and event content
- `public/assets/` — original image, audio, and texture assets

## Local setup

Install **Node.js 22.23.4+**. Use `START_WEBSITE.bat` on Windows or:

```bash
npm ci
npm run typecheck:client
npm run typecheck:functions
npm run check
npm run build
```

Launch the site with `npm run dev`, then open `http://127.0.0.1:4321`. The Astro local dev server displays the support pages, but it does not run Cloudflare Pages Functions; complete the Cloudflare setup and test the live deployment to exercise email signup.

## Existing content and unfinished sales channels

The site still includes the band's existing content and the current placeholder actions for planned external social, merchandise, and track-purchase destinations. **No onsite payment/checkout functionality is active.** Show dates in `src/data/site.ts` were originally supplied as examples and **must be confirmed with the band before advertising or publishing reminders**. Do not treat those dates or ticket links as verified live events.

Footer support pages describe the current site's real practices rather than claiming checkout is already operational. The policies should be reviewed by the band's owner and, if needed, qualified counsel before going live, especially when future direct sales, shipping, analytics, or marketing are added.

## GitHub and Cloudflare deployment

Copy the package contents into the existing **Cloudflare-connected** GitHub repository, keeping its `.git/` folder. Commit and push to the production branch. Do not create a second Cloudflare project. Build command: `npm run build`. Output: `dist`. Framework preset: Astro. Keep the `functions/` directory in Git to deploy serverless APIs.

The package deliberately **excludes** `node_modules`, `.git`, generated `dist/`, subscriber exports, and API secrets. The `START_WEBSITE.bat` is optional for local development, not used by Cloudflare. The original photos, audio track and other assets must be licensed/authorized for public use.
