# Perennial Fallout — v1.10.2 review

Follow-up SSFR patch built from **v1.10.1**.

## Summary

This update corrects the homepage hero eyebrow/title layout, simplifies the no-shows presentation, and fixes several EPK mobile presentation issues.

### Homepage
- **NEW SINGLE** now sits above **THE WAY** again.
- The empty Live Shows state no longer shows the section header or the decorative marker.

### EPK
- Mobile hero spacing has been lowered and loosened so the square band card reads more naturally.
- Mobile **Meet The Band** bios are automatically expanded.
- The EPK parallax now eases with delayed motion like the homepage.
- The mobile press info bar is reformatted into a clean stacked layout.

## Validation notes

A full Astro build was not available in this environment because the local install does not expose a runnable Astro CLI. Before deployment, run:

```bash
npm ci
npm run build
```
