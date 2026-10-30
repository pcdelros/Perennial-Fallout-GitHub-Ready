# v1.7.2 — Edge-to-edge mobile hero

- Adjusted the **mobile-only** hero image so it fills the page from left edge to right edge without horizontal cropping, zoom, or aspect-ratio distortion.
- Replaced the mobile `object-fit: cover` behavior with a natural-aspect-ratio image (`width:100%; height:auto`) and eliminated the enlarged duplicate background layer.
- Kept the 60/40 viewport split, logo clearance, top/bottom gradients, and original image fidelity. On short phones the stage's bottom fade may mask some lower smoke.
- Kept v1.7.1 audio seek fixes, subtle grain, desktop hero, textures, and other pages/components unchanged.
- Updated the version marker to `1.7.2` for deployment verification.

## Deployment

Replace the files in your existing GitHub repository root with the **contents** of this release, then commit and push. Cloudflare Pages should redeploy automatically from the connected branch. Verify that `package.json` version is `1.7.2`, and the website's page source contains `application-version` set to `1.7.2`.
