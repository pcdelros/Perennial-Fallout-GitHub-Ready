# Perennial Fallout — v1.10.1 review

Follow-up update built from **v1.10.0**.

## Summary

This patch refines the homepage and EPK presentation without changing the existing data model, newsletter backend flow, or audio-preview length.

### Homepage
- Live Shows empty state keeps the form but removes the duplicated embedded newsletter heading/copy.
- Meet The Band now uses **View EPK** as the primary action and removes **About Us**.
- The artist name beneath **The Way** is now 16px.
- The **The Way** title gets a subtle rumble effect only while audio is playing.

### EPK
- Hero redesign uses a square band image card on a black background instead of the homepage hero crop.
- Desktop pointer hover adds a restrained 3D tilt effect to the square card.
- Major sections now participate in scroll-based parallax/depth motion.
- Member biographies show expanded text on desktop and remain accordion-style on mobile.

## Validation notes

- Source files were updated and checked for content consistency.
- A full Astro build could not be executed in this environment because the installed dependencies do not include a runnable local Astro CLI.
- Before deployment, run:

```bash
npm ci
npm run build
```

## Main files changed

- `src/components/Newsletter.astro`
- `src/components/Shows.astro`
- `src/components/Band.astro`
- `src/components/MusicPlayer.astro`
- `src/components/epk/Lineup.astro`
- `src/components/epk/Sound.astro`
- `src/components/epk/Resources.astro`
- `src/pages/epk/index.astro`
- `src/scripts/player.ts`
- `src/styles/v1.10.1.css`
- `package.json`
