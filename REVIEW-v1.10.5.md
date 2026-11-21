# Perennial Fallout — v1.10.5 review

Based on **v1.10.4**, with only the Live Shows content and handling updated.

## Confirmed source details

The band supplied these dates and addresses (no ticket URLs or end times):

| Date | Venue | Time (Phoenix local) | Address |
| --- | --- | --- | --- |
| Fri Nov 20, 2026 | The Blooze | 10 PM | 12014 N 32nd St, Phoenix, AZ 85028 |
| Fri Oct 23, 2026 | The Blooze | 11 PM | 12014 N 32nd St, Phoenix, AZ 85028 |
| Sat Sep 26, 2026 | The Blooze | 11 PM | 12014 N 32nd St, Phoenix, AZ 85028 |
| Sat Sep 19, 2026 | The 44 Sports Grill | 9 PM | 4494 W Peoria Ave, Glendale, AZ 85302 |

## Changes

- **Live Shows:** Display future/today's scheduled performances, venue, time, address, and a Google Maps directions action.
- **Past Shows:** Preserve all earlier dates in a muted archive below upcoming performances.
- **Automatic rollover:** Based on the Arizona calendar date, not the visitor's own timezone. Without a known end time, a show moves to Past Shows at the beginning of the next local calendar day.
- **Newsletter:** One initialized form, moved into the no-shows empty state when no upcoming performances remain. No duplicate form IDs or Turnstile widgets.
- **Tickets:** None advertised because none were supplied.
- **Visuals:** Existing burgundy/black brand system, band photography, audio, EPK, support pages, and homepage sections are unchanged.

## Validation

- `tsc --project tsconfig.scripts.json --noEmit`: PASS.
- `tsc --project tsconfig.functions.json --noEmit`: PASS.
- Offline Chromium rendering of the show section at 1440, 390, and 320px: no horizontal overflow; dates appeared in correct sections.
- Tested simulated Phoenix dates November 20 and November 21: Nov 20 appears as upcoming on Nov 20, then moves to Past Shows on Nov 21; the newsletter moves to the empty state with only one form.
- Full Astro build is **unverified** in this environment: the local Node version is 22.16.0 (the project needs >=22.23.4) and the offline npm cache is incomplete. Run the commands below on the target machine or verify the Cloudflare Pages deployment.

```bash
npm ci
npm run typecheck:client
npm run typecheck:functions
npm run check
npm run build
```

## Deployment

Extract the ZIP and copy **the contents**, not the ZIP itself, into the existing Git repository. Preserve `.git` and existing Cloudflare dashboard bindings/variables, then commit and push. Existing Pages settings remain `npm run build` and output `dist`.
