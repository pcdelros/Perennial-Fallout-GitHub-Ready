# Perennial Fallout — v1.10.4 review

Focused visual patch based on **v1.10.3**. No content, music, newsletter, purchase flow, or support page edits.

## Corrections

- Restored the approved EPK hero's castle artwork (`desktop-5.webp`; `mobile-5.webp` on mobile) with subdued overlays and the existing scroll parallax.
- Removed forced `<br />` from the desktop EPK title and sized the heading responsively as one line at viewport widths above 760px.
- Preserved the EPK square band photo, 3D tilt on hover, content placement, buttons, and mobile stacked title.

## Run before publishing

```bash
npm ci
npm run build
```

Review the EPK at approximately 393px, 900px, 1200px, and 1650px. Verify the castle art is visible, the heading fits horizontally on desktop, and the 3D hover remains active.
