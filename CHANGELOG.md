# v1.7.3 — Band member names and single sharing

- Updated the five band portraits with **uppercase** names: DONNIE (drums), PETER (guitar), CLINT (vocals), CHAD (guitar), ODIN (bass).
- Confirmed **CHAD** is the bearded guitarist (`member-guitar-2.webp`) and **PETER** is the other guitarist (`member-guitar-1.webp`).
- Replaced the hero music-player **ALL MUSIC** button with **SHARE**.
- The Share button opens the native share sheet on supported mobile devices (including Safari on iPhone). On other browsers it copies a link to the `#music` section; the button briefly says **LINK COPIED**. Canceling the share sheet does not copy the link.
- Kept the v1.7.2 mobile hero image behavior and the music scrubber fixes unchanged.
- Updated `package.json`, `package-lock.json`, and the HTML deployment version marker to `1.7.3`.

## Deploy

Copy the contents of the archive into the existing Cloudflare-connected GitHub repository root, commit, and **Push origin**. Check the successful Cloudflare deployment before refreshing Safari.
