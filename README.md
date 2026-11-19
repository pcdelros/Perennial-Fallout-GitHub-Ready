# Perennial Fallout — Website v1.10.4

Official band website built with Astro 7 and TypeScript. This release restores the EPK hero's illustrated castle background and keeps the full band name on one line at desktop widths. It retains the hero sizing, homepage spacing, and support-page improvements from v1.10.3.

## Preview on Windows

1. Install Node.js 22.23.4 or later with npm. Extract the full ZIP into a new folder.
2. Double-click `START_WEBSITE.bat` in the folder containing `package.json`. On the first run, keep the command window open while npm installs the locked dependencies. This step requires internet access.
3. The browser opens the homepage at `http://127.0.0.1:4321/`. Select **View EPK** or visit `http://127.0.0.1:4321/epk/` directly.
4. In Edge or Chrome, press **F12**, then **Ctrl+Shift+M**. Select **Responsive** and enter a width such as 320, 390, 768 or 1440. Try a biography, the audio preview and **Download EPK**.
5. To stop the server, press **Ctrl+C** in the command window. If Windows asks whether to end the batch job, enter **Y**.

The page includes an updated one-page PDF and a press ZIP. [REVIEW-v1.10.4.md](./REVIEW-v1.10.4.md) covers the changes and how to test them. The version history is in [CHANGELOG.md](./CHANGELOG.md).

## Existing homepage integrations

- The BUY TRACK link opens the Fourthwall **store homepage**, not a specific product listing. Purchases and digital downloads, when configured, are handled by Fourthwall.
- The newsletter uses Cloudflare Turnstile, a D1 database, double opt-in confirmation and Resend. Local Astro preview exercises the form UI. Production email delivery requires the services described in [SETUP-NEWSLETTER.md](./SETUP-NEWSLETTER.md).

## Website details

- `src/pages/epk/index.astro`, `src/components/epk/` and `src/styles/epk.css` — press kit
- `src/data/epk.json` — approved EPK text and booking contact
- `src/data/members.json` — shared homepage-to-portrait assignments
- `public/press/` — generated downloads included with the application

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

The site still includes placeholder actions for the band's planned external social and merchandise destinations. “The Way” links directly to Fourthwall; **the site itself does not process payments**. Make sure Fourthwall can accept orders and is correctly configured for payouts before inviting purchases. The sample show dates have been removed from `src/data/site.ts`. Only confirmed dates should be added to `siteConfig.shows`. While the list is empty, Live Shows displays an integrated Enter The Fallout signup instead of the separate bottom newsletter. When confirmed shows are added, the cards and the original bottom newsletter return automatically.

Footer support pages describe the current site's real practices rather than claiming checkout is already operational. The policies should be reviewed by the band's owner and, if needed, qualified counsel before going live, especially when future direct sales, shipping, analytics, or marketing are added.

## GitHub and Cloudflare deployment

After the band approves the local release, copy the package contents into the existing **Cloudflare-connected** GitHub repository, keeping its `.git/` folder. Commit and push to the production branch. Do not create a second Cloudflare project. Build command: `npm run build`. Output: `dist`. Framework preset: Astro. Keep the `functions/` directory in Git to deploy serverless APIs.

The package deliberately **excludes** `node_modules`, `.git`, generated `dist/`, subscriber exports, and API secrets. The `START_WEBSITE.bat` is optional for local development, not used by Cloudflare. The original photos, audio track and other assets must be licensed/authorized for public use.

## Safari / Turnstile troubleshooting

The newsletter uses a visible Managed Turnstile widget. If it does not appear on a **deployed** site, first confirm `PUBLIC_TURNSTILE_SITE_KEY` is configured as a Cloudflare **build variable** and redeploy. Safari content blockers or network restrictions can block requests to `challenges.cloudflare.com`; try temporarily allowing content on that site and reload. Confirm that the newsletter subscription completes on both Safari and Chrome; the widget being shown does not by itself prove that server-side verification and Resend email are working.

## Purchase link testing

1. Open the deployed homepage and select **BUY TRACK** on desktop and mobile. It should open `https://perennial-fallout-shop.fourthwall.com/`. The EPK buy button should do the same.
2. Confirm that the Fourthwall storefront homepage visibly lists “The Way” and that checkout is enabled. The site no longer points directly to the product, so customers will need to select it in the shop.
3. Verify the intended price and MP3 deliverable in the shop. Have Pete configure payouts before inviting real customers.
4. Complete an authorized test order and verify order confirmation, email download, and customer-visible business information; a working link alone does **not** establish that checkout or payout verification is active.
5. Update `buyTrackUrl` in `src/data/site.ts` if the Fourthwall store homepage changes.
