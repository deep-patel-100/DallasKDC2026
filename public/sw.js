/* KDC 2026 service worker: makes the site load fast and work offline at the event.
   - Pages, scripts and styles: network first (edits show up right away), cache as backup.
   - Images and fonts: cache first.
   Bump VERSION only if you rename or remove files. */
const VERSION = 'kdc-2026-v13';
const PRECACHE = [
  './', './index.html', './site.webmanifest',
  './assets/css/styles.css', './assets/js/content.js', './assets/js/app.js',
  './assets/fonts/fredoka-latin-wght-normal.woff2', './assets/fonts/fredoka-latin-ext-wght-normal.woff2',
  './assets/fonts/nunito-latin-wght-normal.woff2', './assets/fonts/nunito-latin-ext-wght-normal.woff2',
  './assets/img/kdc-logo.webp', './assets/img/campus-map.webp', './assets/img/light-within-logo.webp', './assets/img/bal-prakash.webp',
  './assets/img/astronaut.svg', './assets/img/camera.svg', './assets/img/diya.svg', './assets/img/fuel.svg',
  './assets/img/moon.svg', './assets/img/planet-compassion.svg', './assets/img/planet-determination.svg',
  './assets/img/planet-faith.svg', './assets/img/planet-servitude.svg', './assets/img/rocket.svg',
  './assets/img/saturn-blue.svg', './assets/img/comet.svg', './assets/img/asteroid.svg', './assets/img/planet-jupiter.svg',
  './assets/img/satellite.svg', './assets/img/sparkle.svg', './assets/img/constellations.svg', './assets/img/saturn-pink.svg', './assets/img/stage.svg', './assets/img/sun.svg',
  './assets/icons/icon-192.png', './assets/icons/favicon-48.png'
];

self.addEventListener('install', (event) => {
  event.waitUntil(caches.open(VERSION).then((c) => c.addAll(PRECACHE)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== VERSION).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  const req = event.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  if (url.origin !== self.location.origin) return; // never touch third-party requests
  if (req.destination === 'video' || req.headers.has('range')) return; // let the browser stream videos directly

  const dest = req.destination;
  const networkFirst = req.mode === 'navigate' || ['document', 'script', 'style', 'manifest'].includes(dest);

  if (networkFirst) {
    event.respondWith(
      fetch(req)
        .then((res) => {
          if (res.ok && res.type === 'basic') caches.open(VERSION).then((c) => c.put(req, res.clone()));
          return res;
        })
        .catch(() => caches.match(req, { ignoreSearch: req.mode === 'navigate' })
          .then((hit) => hit || (req.mode === 'navigate' ? caches.match('./index.html') : undefined))
          .then((hit) => hit || Response.error()))
    );
    return;
  }

  event.respondWith(
    caches.match(req).then((hit) => hit || fetch(req).then((res) => {
      if (res.ok && res.type === 'basic') { const copy = res.clone(); caches.open(VERSION).then((c) => c.put(req, copy)); }
      return res;
    }))
  );
});
