# Perennial Fallout — Website (Astro + TypeScript)

This repository contains the band's **homepage** source code. It uses Astro 7, TypeScript, custom CSS, and a static production build for Cloudflare Pages. This is **v1.7.1**, preserving the v1.6 design and mobile 60/40 hero split with a dedicated, cropped mobile hero image, reliable music seeking, and subtler hero grain. No EPK page is included.

## Before publishing

The website can be built and deployed, but **some content and services are placeholders**. Update `src/data/site.ts` with the real band-member names, confirmed show dates and times, ticket links, streaming/social links and purchase links. The newsletter currently has **no signup endpoint**; it does not subscribe visitors. Privacy/purchase links display *Coming Soon*. Confirm you have permission to publish all photos, art and the included audio track.

> IMPORTANT: `src/data/site.ts` contains example venues/dates. **Do not treat them as confirmed performances or distribute calendar reminders without verification.**

## Develop on Windows

- Install [Node.js](https://nodejs.org/) **22.23.4 or later** (includes npm). The `.node-version` file pins the required Node version for supported build environments, including Cloudflare Pages.
- Run `START_WEBSITE.bat` in the project directory, or use the commands below in a terminal.

```sh
npm ci
npm run dev
```

Open `http://127.0.0.1:4321` in a browser. Stop the server with **Ctrl+C**.

## Verify before committing or deploying

```sh
npm ci
npm run typecheck:client
npm run check
npm run build
```

`npm run build` creates the static production website in `dist/`. Don't commit `dist/`: Cloudflare builds it from the source. The Astro Dev Toolbar doesn't appear in that production output.

## Update your existing GitHub → Cloudflare Pages website

If the site is already deployed at `perennial-fallout.pages.dev`, **update the existing GitHub repository**, not a new Cloudflare project. Replace the existing repository files with this version (keep its `.git` folder when using GitHub Desktop), review the changes, commit, and push to `main`. Cloudflare Pages will build and deploy automatically.

Test on iPhone after the new deployment completes; refresh Safari to pick up the new styles and scripts. No backend configuration changes are required.

## Publish from GitHub to Cloudflare Pages

1. Create a new repository (for example `perennial-fallout-website`).
2. Commit **the contents of this folder**, not the outer ZIP, using GitHub Desktop or Git. Keep `src/`, `public/`, `package.json`, `package-lock.json`, `astro.config.mjs`, `tsconfig*.json`, `.gitignore` and `README.md`.
3. In Cloudflare's dashboard, go to **Workers & Pages**, create a **Pages** project, and connect the GitHub repository.
4. Configure:

   | Setting | Value |
   | --- | --- |
   | Framework preset | Astro |
   | Production branch | `main` |
   | Build command | `npm run build` |
   | Build output directory | `dist` |
   | Root directory | repository root (`/`) |

5. Deploy. Later GitHub commits to `main` will trigger new deployments.

For a manual upload of static output *instead* of Git deployment, build locally and upload **the contents of `dist/`**, not this source tree.

## Project map

- `src/pages/index.astro`: homepage
- `src/components/`: header, hero, music player, shows, band, newsletter and footer
- `src/layouts/`: document metadata, common styles and fonts
- `src/styles/`: original styling and version overrides (preserved to avoid changing the design)
- `src/scripts/`: TypeScript behavior, animation, audio preview, navigation and calendars
- `src/data/site.ts`: editable site content and external destinations
- `public/assets/`: the website's images, audio, icons and background textures (keep in Git)
- `START_WEBSITE.bat`: Windows local-development convenience launcher (Cloudflare does not execute it)

## Cleanup notes

Only required source files, assets, project configuration, lockfile and documentation are included. Generated `dist/`, `dist-preview/`, `.astro/` and `node_modules/` are excluded. Run `npm ci` to recreate dependencies. The v1.7 edits are isolated to the hero composition, audio-seeking behavior, and hero grain. Other design elements are unchanged.

## Future integrations

Sanity CMS, Stripe, Cloudflare R2/Workers and a newsletter provider are **not configured**. The homepage currently uses static data and placeholders for these integrations.

## Confirm the live v1.7.1 deployment (important)

The GitHub repository inspected during this update still showed `package.json` version `1.6.0` and did **not** include `src/styles/v1.7.css`. This indicates the existing live site may not have received the previous v1.7 update. The ZIP alone does not update Cloudflare.

1. Copy **all contents** of this package into the same local folder that GitHub Desktop uses for the Cloudflare-connected repository, preserving the `.git` folder.
2. In GitHub Desktop, verify that `package.json` now contains `"version": "1.7.1"` and there are new `src/styles/v1.7.css` and `src/styles/v1.7.1.css` files.
3. Commit the changes and click **Push origin**. Cloudflare Pages will deploy automatically from `main` if configured correctly.
4. In Cloudflare Pages → Deployments, confirm the latest build says **Success** and its commit matches the pushed commit.
5. Visit the live site and use **View Page Source** on desktop: search for `<meta name="application-version" content="1.7.1">` (Astro may reorder attributes). This is a nonvisual marker for checking the deployed version. On iPhone, reopen the website in a private tab after Cloudflare deployment finishes.

This release keeps the 60/40 mobile stage, v1.7 seek handling and grain level, and all other original design elements. The mobile portrait is newly cropped from the supplied art with no retouching of any face.
