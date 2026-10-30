# Perennial Fallout — Website (Astro + TypeScript)

This repository contains the band's **homepage** source code. It uses Astro 7, TypeScript, custom CSS, and a static production build for Cloudflare Pages. This is the **v1.6 design with the mobile 60/40 hero adjustment**. No EPK page is included.

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

Only required source files, assets, project configuration, lockfile and documentation are included. Generated `dist/`, `dist-preview/`, `.astro/` and `node_modules/` are excluded. Run `npm ci` to recreate dependencies. No visual redesign was performed during this cleanup.

## Future integrations

Sanity CMS, Stripe, Cloudflare R2/Workers and a newsletter provider are **not configured**. The homepage currently uses static data and placeholders for these integrations.
