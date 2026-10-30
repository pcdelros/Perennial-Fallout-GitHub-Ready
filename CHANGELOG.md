# Perennial Fallout — v1.7

- **Mobile hero:** Made the band artwork fill the mobile photo stage rather than appear letterboxed. Cropping favors the upper band composition, keeps the drummer clear of the logo, and transitions into the player with the existing dark gradients. The mobile hero remains 60svh.
- **Scrubbing:** Expanded the progress range touch target to 44px without an oversized visible bar. Audio previews can be scrubbed by mouse, touch, or keyboard. The audio position updates while dragging and continues playing after release if it was playing before the seek. Paused media stays paused.
- **Grain:** Reduced the hero-only grain animation to 3.2% opacity and slowed it to a 4.8-second cycle, preserving the general background textures.
- No changes to demo show data, external destinations, backend services, or other sections.

---

# v1.6 — mobile 60/40 rollback

Based strictly on the original v1.6 project, with only the mobile hero-to-player viewport proportion changed from 75/25 to 60/40 and a stronger top-to-transparent black fade for navbar blending. All other v1.6 code and visuals remain intact. No v1.6.5 audio or hero motion changes are included.

---

# Perennial Fallout changelog

## v1.6
- Mobile hero artwork occupies 75svh (stable mobile viewport) and starts lower, leaving room above the drummer beneath the logo. The music player begins at the 75% mark and remains fully usable by scrolling.
- Preview time label counts down from `0:45` to `0:00`, including seeks and repeats, without displaying time remaining in the full recording.
- Song artist font size is 12px as requested; play and pause SVGs are 28px.
- Live Web Audio frequency analysis drives a low-opacity crimson highlight glow over the static band artwork during playback. It clears on pause, visibility loss, or reduced-motion preference. No extra dependencies.
- Astro + TypeScript component architecture and all v1.5 interactions preserved.

## v1.5
- Astro + TypeScript migration from prior static prototype; standalone preview retained.

## GitHub preparation (source cleanup only)

- Removed generated builds, local npm packages, caches and offline-preview artifacts from the distributable.
- Preserved the v1.6 + 60/40 design source, public assets and npm lockfile.
- Updated `.gitignore`, README and Windows development launcher.
- No page styling or application behavior was changed.
