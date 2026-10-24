# AGENTS.md

## What this is
KDC 2026 · The Light Within: a mobile-first, installable (PWA) guide for the Kids' Diwali Celebration at BAPS Shri Swaminarayan Mandir, Dallas (Saturday, October 31, 2026). Plain HTML/CSS/vanilla JS with **no build step**.

## Layout
- `public/` is the published site (`netlify.toml` → `publish = "public"`, empty build command).
  - `index.html` page shell; sections are empty containers filled by JS.
  - `assets/js/content.js` holds all visitor-facing text, times, links, map labels. Edit content here.
  - `assets/js/app.js` renders the page; map drawing is `buildMap()`.
  - `assets/css/styles.css` uses design tokens at the top.
  - `sw.js` is the offline service worker. Bump `VERSION` and update `PRECACHE` when renaming or removing files.
  - `_headers` sets Netlify security and cache headers.
- `hosting/` contains configs for non-Netlify hosts (Vercel, Apache, nginx). They aren't deployed.

## Conventions and constraints
- A strict CSP plus **Trusted Types** (`require-trusted-types-for 'script'`) is enforced. Build DOM with `textContent`/`createElement` only, never `innerHTML`, `eval`, or inline scripts/styles.
- No third-party scripts, fonts, analytics, cookies, or forms. Fonts are self-hosted. If you add an external origin, update the CSP in `public/_headers`, the `<meta>` CSP in `index.html`, and the files in `hosting/`.
- Progress data lives only in the visitor's localStorage (`event.storageKey`).
- Times in `content.js` are 24h `"HH:MM"` event-local. `?preview=HH:MM` simulates event day.
- Don't add a bundler or framework unless asked; the organisers edit `content.js` by hand.
