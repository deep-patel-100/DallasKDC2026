# KDC 2026 · The Light Within

The Kids' Diwali Celebration booklet (BAPS Shri Swaminarayan Mandir, Dallas · Saturday, October 31, 2026) as a mobile-first, installable website.

**No build step, no frameworks, no third-party scripts.** Live on Netlify at https://dallaskdc2026.netlify.app/.

> **Repository layout:** the website itself lives in `public/` (Netlify publishes that folder as-is, see `netlify.toml`). Configs for other hosts (`vercel.json`, `.htaccess`, `deploy/` for nginx) are kept in `hosting/`. File paths below are relative to `public/`.

---

## What's inside

| Section | What visitors can do |
|---|---|
| **Hero** | Live countdown to gates opening, Add to calendar (.ics), Directions, Share. Switches to "Mission in progress!" on the day. |
| **Schedule** (Astronaut Mission) | List or Timeline view. Tap any activity for times, details and "Show on map". On event day: a live **Happening now / Up next** panel, a red "now" line on the timeline, and past sessions greyed out. |
| **Map** | Picture of the mandir campus with the five KDC locations. Tap a location (or its card, or the buttons) for its times. Enlarge + zoom for small screens. |
| **Mission: Light Within** | All four planets. Kids tap word-bank words to fill in each story's blanks; answers are checked automatically, with confetti and a passport star when solved. "Big idea" plus the **Actions to Take at Home** checklists with a weekly "I did it!" star tally. |
| **Reels** | Extra resources at the end of the page: YouTube videos or playlists, your own MP4s, or links. Shows "Coming soon" for empty tiles. |
| **Explorer's Passport** (Recap) | The 10 recap stops as collectible stars, a progress bar and a "Mission complete" celebration. |
| **Reminders** and **Footer** | Booklet reminders, BAPS links, install-app button. |

Works offline once loaded (handy if mandir Wi-Fi is busy), can be added to a phone's home screen, respects reduced-motion settings, and is keyboard and screen-reader friendly. All progress is saved only in the visitor's own browser; nothing is collected or sent anywhere.

---

## Editing content: one file

**Everything a visitor reads is in `assets/js/content.js`.** Open it in any text editor (VS Code, Notepad, TextEdit in plain-text mode).

- **Times** are 24-hour `"HH:MM"` in event-local time (`"15:45"` = 3:45 PM).
- **Colors** are names: `teal, yellow, pink, orange, green, sky, lavender, red`.
- **Bold**: `**like this**`.
- **Story blanks**: wrap the answer in double brackets, `[[pillar]]`. The word bank is built automatically (alphabetical), or set `wordBank: [...]` to control the order.
- **Session with only a start time** (Mahāpūjā, Stage Program): add `duration` (minutes) to the item. Visitors still see only the start time; duration just sizes the timeline bar and drives "Happening now".
- **Registration banner**: set `registration.show: true` and add the `url`.
- **Reels**: paste a YouTube ID into `youtubeId` (the part after `v=` or `/shorts/`), a playlist ID into `playlist`, an MP4 path into `video`, or a link into `url`. See the notes above `reels` in `content.js`.
- **Next year**: change `event.storageKey` so last year's saved progress doesn't carry over.

The map is the campus picture `assets/img/campus-map.webp` (plus `campus-map-large.webp` for the enlarged view). Location names and details are in `content.js` (`map.zones`); the number positions and tap areas over the picture are `MAP_SPOTS` in `assets/js/app.js`.
Colors, fonts and spacing are the tokens at the top of `assets/css/styles.css`.
Illustrations are SVG files in `assets/img/` and can be swapped one-for-one.

### Handy links

- `…/#planet-faith`, `#planet-compassion`, `#planet-determination`, `#planet-servitude` open that story directly. **Print these as QR codes in each exhibition room.**
- `…/#zone-fuel`, `#zone-launchpad`, `#zone-universe`, `#zone-zerogravity`, `#zone-exhibition` open the map at that spot.
- `…/?preview=12:10` shows the site as it will look at 12:10 PM on event day (live panel, now-line). `?preview=2026-10-31T16:30` also works. Good for rehearsing.

---

## Preview on your computer

The security policy blocks pages opened by double-click (`file://`), so run a tiny local server from the `public/` folder:

```bash
python3 -m http.server 8000
# or
npx serve .
```

Then open http://localhost:8000.

---

## Hosting

Upload **the whole folder** (keep the structure). Matching security headers are already written for each host:

| Host | File used | Notes |
|---|---|---|
| **Netlify** | `_headers` | Drag the folder onto app.netlify.com/drop. |
| **Cloudflare Pages** | `_headers` | Create a project, upload the folder, no build command. |
| **Vercel** | `vercel.json` | `vercel deploy` or import a Git repo, framework "Other". |
| **Apache / cPanel** | `.htaccess` | Needs `mod_headers` (almost always on). Forces HTTPS. |
| **nginx** | `deploy/nginx.conf` + `deploy/kdc-security.conf` | Edit domain/paths; see the note in the file. |
| **GitHub Pages** | `<meta>` CSP in `index.html` | Can't send headers; the meta policy covers most of it. |

Always serve over **HTTPS** (all hosts above do this automatically). Offline mode and install-to-home-screen require it.

### Before launch checklist

1. In `content.js` set `event.siteUrl` to the final address.
2. In `index.html`, change `og:image` to the full URL (`https://your-domain/assets/img/og-image.jpg`) so link previews show the image in WhatsApp, iMessage and similar apps.
3. Confirm `event.address` and the directions link.
4. Add reels and registration if you're using them.
5. Optional: rename `deploy/security.txt.example`, fill in a contact, and put it at `/.well-known/security.txt`.
6. Check the site at https://securityheaders.com and https://pagespeed.web.dev.

---

## Security

- **Strict Content-Security-Policy**: only this site's own scripts, styles, fonts and images load; the only outside resources allowed are YouTube's privacy-enhanced embed (`youtube-nocookie.com`) and its thumbnails, used only if you add reels.
- **Trusted Types** enforced: the browser itself refuses any HTML/script injection API. The code builds the page with `textContent` only, never `innerHTML` or `eval`.
- **Clickjacking** blocked: on Netlify only the site itself and the Netlify dashboard (for its preview panel) may frame it (`frame-ancestors 'self' https://app.netlify.com`). The other host configs in `hosting/` block all framing (`frame-ancestors 'none'`, `X-Frame-Options: DENY`).
- **HSTS**, `nosniff`, strict `Referrer-Policy`, `Cross-Origin-Opener/Resource-Policy`, and a `Permissions-Policy` that turns off camera, microphone, location, payment, USB and tracking APIs.
- **No cookies, no analytics, no forms, no accounts.** Kids' progress stays on their device (localStorage) and can be cleared with "Reset passport".
- Fonts (Fredoka, Nunito; SIL Open Font License, included) are self-hosted, so there are no Google Fonts requests.
- YouTube videos load inside a sandboxed iframe only after a tap.

If you add anything from another domain later (analytics, a form service), add that domain to the CSP in **both** the header file for your host and the `<meta>` tag in `index.html`.

---

## Files

```
index.html               page shell
assets/js/content.js     ← ALL editable text, times, links
assets/js/app.js         builds the page (rarely needs edits)
assets/css/styles.css    design tokens + layout
assets/img/              logos, reel pictures, SVG illustrations
assets/fonts/            self-hosted fonts + licenses
assets/icons/            app icons
sw.js                    offline support
site.webmanifest         install-to-home-screen settings
404.html                 "Lost in space" page
_headers, vercel.json, .htaccess, deploy/   security headers per host
```
