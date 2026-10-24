/* ==========================================================================
   KDC 2026 · The Light Within · app.js
   Builds the page from assets/js/content.js. You normally don't need to edit
   this file: change words, times and links in content.js instead.

   Security notes
   • No third-party scripts, no eval, no innerHTML: every piece of text is
     inserted with textContent through the h()/s() helpers below, so content
     can never inject markup or script.
   • Runs under a strict Content-Security-Policy with Trusted Types.
   • Progress (stories, stars, tallies) is stored only in this browser's
     localStorage. Nothing is sent anywhere.
   ========================================================================== */
(() => {
  'use strict';

  const C = globalThis.KDC_CONTENT;
  if (!C) { console.error('KDC: content.js did not load.'); return; }
  const EV = C.event;

  /* ================================================================ DOM */
  const SVG_NS = 'http://www.w3.org/2000/svg';
  const js = (name, root = document) => root.querySelector(`[data-js="${name}"]`);
  const BLOCKED_ATTRS = /^(on|style$|srcdoc$)/i;

  function applyProps(el, props) {
    if (!props) return;
    for (const [k, v] of Object.entries(props)) {
      if (v === null || v === undefined || v === false) continue;
      if (k === 'text') el.textContent = v;
      else if (k === 'on') for (const [ev, fn] of Object.entries(v)) el.addEventListener(ev, fn);
      else if (k === 'data') for (const [dk, dv] of Object.entries(v)) { if (dv != null) el.dataset[dk] = dv; }
      else if (k === 'vars') for (const [vk, vv] of Object.entries(v)) el.style.setProperty(vk, String(vv));
      else if (BLOCKED_ATTRS.test(k)) throw new Error(`KDC: attribute "${k}" is not allowed`);
      else el.setAttribute(k, v === true ? '' : String(v));
    }
  }
  function appendKids(el, kids) {
    for (const kid of kids.flat(Infinity)) {
      if (kid === null || kid === undefined || kid === false || kid === true || kid === '' || kid === 0) continue;
      el.append(kid instanceof Node ? kid : String(kid));
    }
    return el;
  }
  const h = (tag, props, ...kids) => { const el = document.createElement(tag); applyProps(el, props); return appendKids(el, kids); };
  const s = (tag, props, ...kids) => { const el = document.createElementNS(SVG_NS, tag); applyProps(el, props); return appendKids(el, kids); };

  /** "Hello **world**" → ["Hello ", <strong>world</strong>] */
  const rich = (str) => String(str ?? '').split(/(\*\*[^*]+\*\*|\[[^\]]+\]\(https:\/\/[^)\s]+\))/g).filter(Boolean)
    .map((part) => {
      if (part.startsWith('**') && part.endsWith('**')) return h('strong', { text: part.slice(2, -2) });
      const link = /^\[([^\]]+)\]\((https:\/\/[^)\s]+)\)$/.exec(part);
      if (link) return h('a', { href: link[2], target: '_blank', rel: 'noopener noreferrer', text: link[1] });
      return part;
    });

  const safeName = (name) => (/^[a-z0-9-]+$/i.test(name || '') ? name : 'diya');
  const art = (name, cls, alt = '') => h('img', {
    src: `assets/img/${safeName(name)}.svg`, alt, class: cls, width: 96, height: 96, decoding: 'async'
  });

  const ICON_PATHS = {
    calendar: 'M7 3v3M17 3v3M4 9h16M5 5h14a1 1 0 0 1 1 1v13a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1z',
    pin: 'M12 21s-7-6.2-7-11a7 7 0 0 1 14 0c0 4.8-7 11-7 11zM12 12.5a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5z',
    share: 'M12 3v12M7 8l5-5 5 5M5 13v6a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-6',
    chevron: 'M9 6l6 6-6 6',
    left: 'M15 6l-6 6 6 6',
    expand: 'M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5',
    map: 'M9 4 3 6v14l6-2 6 2 6-2V4l-6 2-6-2zM9 4v14M15 6v14',
    play: 'M8 5v14l11-7z',
    reset: 'M3 12a9 9 0 1 0 3-6.7M3 4v5h5',
    eye: 'M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12zM12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6z',
    plus: 'M12 5v14M5 12h14',
    minus: 'M5 12h14',
    up: 'M12 19V5M5 12l7-7 7 7',
    download: 'M12 3v12M7 10l5 5 5-5M5 21h14',
    clock: 'M12 7v5l3 2M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18z',
    check: 'M5 12.5l4.5 4.5L19 7',
    sun: 'M12 16a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4',
    car: 'M3 17v-4l2-5.5A2 2 0 0 1 6.9 6h10.2A2 2 0 0 1 19 7.5l2 5.5v4zM3 13h18M6 17v2M18 17v2M7 15h.01M17 15h.01',
    users: 'M16 20v-1a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v1M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM22 20v-1a4 4 0 0 0-3-3.9M16 3.1a4 4 0 0 1 0 7.8',
    flame: 'M12 3c-3.2 4.2-5 6.8-5 10a5 5 0 0 0 10 0c0-3.2-1.8-5.8-5-10zM12 13c-1 1.4-1.6 2.3-1.6 3.2a1.6 1.6 0 0 0 3.2 0c0-.9-.6-1.8-1.6-3.2z',
    help: 'M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18zM9.2 9.2a2.9 2.9 0 0 1 5.6 1c0 1.9-2.8 2.6-2.8 4M12 17.5h.01',
    video: 'M3 6.5h12a1.5 1.5 0 0 1 1.5 1.5v8a1.5 1.5 0 0 1-1.5 1.5H3zM16.5 10.5 21 8v8l-4.5-2.5',
    shoe: 'M3 17.5h18V15c0-1.4-1-2.2-2.4-2.5l-4.4-1-2.4-3.5H9c-.7 1.7-2.3 2.4-4.2 2.4H3zM3 14.5h18',
    food: 'M7 3v7M5 3v4a2 2 0 0 0 4 0V3M7 10v11M17 21V3c-2.2 0-3.5 2.8-3.5 6.5V13H17',
    camera: 'M4 8h3l2-3h6l2 3h3v11H4zM12 16.5a3.2 3.2 0 1 0 0-6.4 3.2 3.2 0 0 0 0 6.4z',
    gift: 'M4 11h16v10H4zM3 7h18v4H3zM12 7v14M12 7C10 7 7.5 6.6 7.5 4.8 7.5 3 10.5 3.5 12 7zM12 7c2 0 4.5-.4 4.5-2.2C16.5 3 13.5 3.5 12 7z',
    pencil: 'M4 20l4-1L19 8l-3-3L5 16zM14 7l3 3',
    ticket: 'M3 7.5h18v3a2 2 0 0 0 0 3v3H3v-3a2 2 0 0 0 0-3zM14 7.5v9',
    arrow: 'M5 12h14M13 6l6 6-6 6',
    star: 'M12 3l2.6 5.6 6 .7-4.5 4.1 1.2 6L12 16.4 6.7 19.4l1.2-6L3.4 9.3l6-.7z'
  };
  const icon = (name, filled = false) => s('svg', { viewBox: '0 0 24 24', width: 20, height: 20, 'aria-hidden': 'true', focusable: 'false' },
    s('path', { d: ICON_PATHS[name], fill: filled ? 'currentColor' : 'none', stroke: filled ? 'none' : 'currentColor', 'stroke-width': 2, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }));

  const button = (label, opts = {}) => h('button', {
    type: 'button', class: `btn ${opts.cls || ''}`.trim(), 'aria-label': opts.aria, on: { click: opts.onClick }
  }, opts.icon && icon(opts.icon, opts.filled), label);

  const linkOut = (label, href, opts = {}) => h('a', {
    class: `btn ${opts.cls || ''}`.trim(), href, target: '_blank', rel: 'noopener noreferrer'
  }, opts.icon && icon(opts.icon), label);

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const scrollToEl = (el) => el?.scrollIntoView({ behavior: reduceMotion.matches ? 'auto' : 'smooth', block: 'start' });
  const goTo = (id) => scrollToEl(document.getElementById(id));

  /* ============================================================ STORAGE */
  const store = (() => {
    const prefix = `${EV.storageKey || 'kdc'}:`;
    const memory = new Map();
    return {
      get(key, fallback) {
        try {
          const raw = window.localStorage.getItem(prefix + key);
          return raw === null ? fallback : JSON.parse(raw);
        } catch { return memory.has(key) ? memory.get(key) : fallback; }
      },
      set(key, value) {
        memory.set(key, value);
        try { window.localStorage.setItem(prefix + key, JSON.stringify(value)); } catch { /* private mode: keep in memory */ }
      },
      clearAll() {
        memory.clear();
        try {
          Object.keys(window.localStorage).filter((k) => k.startsWith(prefix)).forEach((k) => window.localStorage.removeItem(k));
        } catch { /* ignore */ }
      }
    };
  })();
  const asObject = (v) => (v && typeof v === 'object' && !Array.isArray(v) ? v : {});
  const asArray = (v) => (Array.isArray(v) ? v : []);

  /* =============================================================== TIME */
  const toMin = (hhmm) => { const [hh, mm] = String(hhmm).split(':').map(Number); return hh * 60 + mm; };
  const fromMin = (m) => `${String(Math.floor(m / 60)).padStart(2, '0')}:${String(m % 60).padStart(2, '0')}`;
  const at = (hhmm) => new Date(`${EV.date}T${hhmm}:00${EV.utcOffset}`);
  const meridiem = (hhmm) => (Math.floor(toMin(hhmm) / 60) >= 12 ? 'PM' : 'AM');
  function fmt(hhmm, withMeridiem = true) {
    const m = toMin(hhmm); const hr = Math.floor(m / 60) % 12 || 12;
    return `${hr}:${String(m % 60).padStart(2, '0')}${withMeridiem ? ` ${meridiem(hhmm)}` : ''}`;
  }
  const fmtRange = (a, b) => (meridiem(a) === meridiem(b) ? `${fmt(a, false)} – ${fmt(b)}` : `${fmt(a)} – ${fmt(b)}`);

  /* Preview another time: ?preview=12:10 (event day) or ?preview=2026-10-31T12:10 */
  const PREVIEW_OFFSET = (() => {
    const p = new URLSearchParams(window.location.search).get('preview');
    if (!p) return 0;
    let target = null;
    if (/^\d{2}:\d{2}$/.test(p)) target = at(p);
    else if (/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/.test(p)) target = new Date(`${p}:00${EV.utcOffset}`);
    return target && !Number.isNaN(target.getTime()) ? target.getTime() - Date.now() : 0;
  })();
  const now = () => new Date(Date.now() + PREVIEW_OFFSET);
  const phase = (t = now()) => (t < at(EV.gatesOpen) ? 'before' : t < at(EV.ends) ? 'live' : 'after');
  const nowHHMM = (t = now()) => {
    const local = new Date(t.getTime() + offsetMinutes() * 60000);
    return fromMin(local.getUTCHours() * 60 + local.getUTCMinutes());
  };
  function offsetMinutes() {
    const m = /^([+-])(\d{2}):(\d{2})$/.exec(EV.utcOffset || '+00:00');
    return m ? (m[1] === '-' ? -1 : 1) * (Number(m[2]) * 60 + Number(m[3])) : 0;
  }

  /* ========================================================== SCHEDULE DATA */
  const ITEMS = C.schedule.items.map((it) => ({
    ...it,
    sessions: it.sessions.map((se, i) => ({
      index: i,
      start: se.start,
      end: se.end || fromMin(toMin(se.start) + (it.duration || 30)),
      showEnd: Boolean(se.end),
      note: se.note || ''
    }))
  }));
  const ITEM = Object.fromEntries(ITEMS.map((it) => [it.id, it]));
  const sessionLabel = (se) => (se.showEnd ? fmtRange(se.start, se.end) : fmt(se.start));
  const sessionState = (se, t = now()) => (t >= at(se.end) ? 'past' : t >= at(se.start) ? 'now' : 'future');
  const whereLine = (it) => [it.activity, it.location].filter(Boolean).join(' · ');
  const nextSession = (it, t = now()) => it.sessions.find((se) => sessionState(se, t) === 'future');

  /* ============================================================== TOAST */
  let toastTimer;
  function toast(message) {
    const el = js('toast');
    el.textContent = message;
    el.classList.add('is-on');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => el.classList.remove('is-on'), 2600);
  }

  /* =========================================================== CONFETTI */
  function confetti(count = 140) {
    if (reduceMotion.matches) return;
    const canvas = js('confetti');
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const W = window.innerWidth; const H = window.innerHeight;
    canvas.width = W * dpr; canvas.height = H * dpr; ctx.scale(dpr, dpr);
    const colors = ['#ffd23f', '#ff5fa2', '#2ec4b6', '#4cc3ff', '#ff8a3d', '#7ed957', '#b9a6ff', '#ffffff'];
    const parts = Array.from({ length: count }, () => ({
      x: W / 2 + (Math.random() - 0.5) * W * 0.3, y: H * 0.35,
      vx: (Math.random() - 0.5) * 14, vy: -Math.random() * 14 - 4,
      r: Math.random() * 5 + 3, c: colors[Math.floor(Math.random() * colors.length)],
      rot: Math.random() * Math.PI, vr: (Math.random() - 0.5) * 0.3, round: Math.random() > 0.6
    }));
    const t0 = performance.now();
    (function frame(t) {
      const elapsed = t - t0;
      ctx.clearRect(0, 0, W, H);
      for (const p of parts) {
        p.vy += 0.35; p.vx *= 0.99; p.x += p.vx; p.y += p.vy; p.rot += p.vr;
        ctx.save(); ctx.globalAlpha = Math.max(0, 1 - elapsed / 2600);
        ctx.translate(p.x, p.y); ctx.rotate(p.rot); ctx.fillStyle = p.c;
        if (p.round) { ctx.beginPath(); ctx.arc(0, 0, p.r / 1.6, 0, Math.PI * 2); ctx.fill(); } else ctx.fillRect(-p.r, -p.r / 2.5, p.r * 2, p.r / 1.25);
        ctx.restore();
      }
      if (elapsed < 2600) requestAnimationFrame(frame); else ctx.clearRect(0, 0, W, H);
    })(t0);
  }
  const buzz = (ms = 25) => { try { navigator.vibrate?.(ms); } catch { /* unsupported */ } };

  /* ============================================================== SHEET */
  const sheet = js('sheet');
  const sheetBody = js('sheet-body');
  let lastFocus = null;
  function openSheet({ color, wide = false, build }) {
    lastFocus = document.activeElement;
    sheetBody.replaceChildren();
    if (color) sheet.dataset.color = color; else delete sheet.dataset.color;
    sheet.classList.toggle('sheet--wide', wide);
    build({ append: (...kids) => appendKids(sheetBody, kids) }); // skips false/empty values
    if (!sheet.open) sheet.showModal();
    sheetBody.scrollTop = 0;
  }
  const closeSheet = () => { if (sheet.open) sheet.close(); };
  sheet.addEventListener('close', () => {
    sheetBody.replaceChildren(); // stops any playing video
    sheet.style.transform = '';
    if (lastFocus && document.contains(lastFocus)) lastFocus.focus({ preventScroll: true });
  });
  sheet.addEventListener('click', (e) => { if (e.target === sheet) closeSheet(); });
  js('sheet-close').addEventListener('click', closeSheet);

  // Swipe down to dismiss (phones)
  (() => {
    let startY = null; let dy = 0;
    const wideScreen = window.matchMedia('(min-width: 40rem)');
    sheet.addEventListener('touchstart', (e) => {
      if (wideScreen.matches || sheetBody.scrollTop > 0 || e.target.closest('.map-zoom, .video-frame')) return;
      startY = e.touches[0].clientY; dy = 0; sheet.style.transition = 'none';
    }, { passive: true });
    sheet.addEventListener('touchmove', (e) => {
      if (startY === null) return;
      dy = Math.max(0, e.touches[0].clientY - startY);
      sheet.style.transform = `translateY(${dy}px)`;
    }, { passive: true });
    sheet.addEventListener('touchend', () => {
      if (startY === null) return;
      sheet.style.transition = '';
      if (dy > 110) closeSheet(); else sheet.style.transform = '';
      startY = null;
    });
  })();

  /* =========================================================== ACTIONS */
  function downloadCalendar() {
    const stamp = (d) => d.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '');
    const esc = (v) => String(v).replace(/\\/g, '\\\\').replace(/\r?\n/g, '\\n').replace(/([,;])/g, '\\$1');
    const lines = [
      'BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//BAPS//KDC//EN', 'CALSCALE:GREGORIAN', 'METHOD:PUBLISH',
      'BEGIN:VEVENT',
      `UID:${EV.storageKey}-${EV.date}@kdc`,
      `DTSTAMP:${stamp(new Date())}`,
      `DTSTART:${stamp(at(EV.gatesOpen))}`,
      `DTEND:${stamp(at(EV.ends))}`,
      `SUMMARY:${esc(`${EV.shortName} · ${EV.name}: ${EV.theme}`)}`,
      `LOCATION:${esc([EV.venue, EV.address].filter(Boolean).join(', '))}`,
      `DESCRIPTION:${esc(EV.tagline)}`,
      EV.siteUrl ? `URL:${EV.siteUrl}` : null,
      'BEGIN:VALARM', 'TRIGGER:-PT2H', 'ACTION:DISPLAY', `DESCRIPTION:${esc(EV.shortName)}`, 'END:VALARM',
      'END:VEVENT', 'END:VCALENDAR'
    ].filter(Boolean);
    const blob = new Blob([`${lines.join('\r\n')}\r\n`], { type: 'text/calendar;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = h('a', { href: url, download: `${EV.storageKey || 'kdc'}.ics` });
    document.body.append(a); a.click(); a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 5000);
  }

  async function shareSite() {
    const url = EV.siteUrl || window.location.href.split('#')[0].split('?')[0];
    const data = { title: `${EV.shortName} · ${EV.theme}`, text: `${EV.name} · ${EV.dateLabel} · ${EV.venue}`, url };
    if (navigator.share) {
      try { await navigator.share(data); } catch { /* user cancelled */ }
      return;
    }
    try { await navigator.clipboard.writeText(url); toast('Link copied!'); } catch { toast(url); }
  }

  /* ========================================================= SECTION HEAD */
  const sectionHead = (id, cfg) => h('header', { class: 'section-head' },
    cfg.eyebrow && h('p', { class: 'eyebrow', text: cfg.eyebrow }),
    h('h2', { class: 'section-title', id: `${id}-title`, text: cfg.title }),
    cfg.intro && h('p', { class: 'section-intro', text: cfg.intro }));

  /* =============================================================== HERO */
  const countdownRefs = {};
  function renderHero() {
    const H = C.hero;
    const root = js('hero');
    root.append(
      art('moon', 'hero__deco hero__deco--moon'),
      art('saturn-pink', 'hero__deco hero__deco--saturn'),
      art('rocket', 'hero__deco hero__deco--rocket'),
      h('div', { class: 'hero__art' },
        art('astronaut', 'hero__deco hero__deco--astro'),
        h('div', { class: 'hero__logo' },
          h('img', { src: 'assets/img/kdc-logo.webp', alt: H.logoAlt, width: 1040, height: 669, fetchpriority: 'high', decoding: 'async' }))),
      h('div', { class: 'hero__copy' },
      h('h1', { class: 'hero__title', id: 'hero-title' },
        h('span', { class: 'visually-hidden', text: `${EV.name} ${EV.date.slice(0, 4)}: ` }), EV.theme),
      EV.tagline && h('p', { class: 'hero__tagline', text: EV.tagline }),
      h('p', { class: 'pill-date' }, h('time', { datetime: EV.date, text: EV.dateLabel })),
      h('p', { class: 'hero__meta' }, `${fmt(EV.gatesOpen)} – ${fmt(EV.ends)} ${EV.timeZoneLabel || ''}`.trim(), h('span', { text: EV.venue })),
      h('div', { class: 'countdown', 'data-js': 'countdown' }),
      h('div', { class: 'hero__actions' },
        button(H.calendarButton, { icon: 'calendar', onClick: downloadCalendar }),
        EV.directionsUrl && linkOut(H.directionsButton, EV.directionsUrl, { icon: 'pin' }),
        button(H.shareButton, { icon: 'share', onClick: shareSite })))
    );
    updateCountdown();
  }

  function updateCountdown() {
    const el = js('countdown');
    if (!el) return;
    const H = C.hero;
    const ph = phase();
    if (el.dataset.phase !== ph) {
      el.dataset.phase = ph;
      el.replaceChildren();
      if (ph === 'before') {
        const cell = (key, unit) => {
          countdownRefs[key] = h('span', { class: 'countdown__num', text: '0' });
          return h('div', { class: 'countdown__cell' }, countdownRefs[key], h('span', { class: 'countdown__unit', text: unit }));
        };
        el.append(
          h('p', { class: 'countdown__label', id: 'countdown-label', text: H.countdownLabel }),
          h('div', { class: 'countdown__grid', role: 'timer', 'aria-labelledby': 'countdown-label' },
            cell('d', 'Days'), cell('h', 'Hours'), cell('m', 'Min'), cell('s', 'Sec')));
      } else if (ph === 'live') {
        el.append(
          h('p', { class: 'countdown__live' }, h('span', { class: 'live-dot', 'aria-hidden': 'true' }), H.liveLabel),
          button(H.liveButton, { cls: 'btn--small', icon: 'clock', onClick: () => goTo('schedule') }));
      } else {
        el.append(h('p', { class: 'countdown__live', text: H.afterLabel }));
      }
    }
    if (ph === 'before') {
      let diff = Math.max(0, Math.floor((at(EV.gatesOpen) - now()) / 1000));
      const d = Math.floor(diff / 86400); diff -= d * 86400;
      const hr = Math.floor(diff / 3600); diff -= hr * 3600;
      const mi = Math.floor(diff / 60); const se = diff - mi * 60;
      countdownRefs.d.textContent = String(d);
      countdownRefs.h.textContent = String(hr).padStart(2, '0');
      countdownRefs.m.textContent = String(mi).padStart(2, '0');
      countdownRefs.s.textContent = String(se).padStart(2, '0');
    }
  }

  /* ======================================================= REGISTRATION */
  const registrationUrl = () => {
    const R = C.registration;
    return R?.show && /^https:\/\/[^\s]+$/.test(R.url || '') ? R.url : '';
  };
  function renderRegistration() {
    const R = C.registration;
    const url = registrationUrl();
    if (!url) return;
    const prices = Array.isArray(R.prices) ? R.prices : [];
    js('registration').append(h('aside', { class: 'register', 'aria-labelledby': 'register-title' },
      h('span', { class: 'register__icon', 'aria-hidden': 'true' }, icon('ticket')),
      h('div', { class: 'register__copy' }, h('h2', { id: 'register-title', text: R.heading }), R.text && h('p', { text: R.text })),
      prices.length > 0 && h('div', { class: 'register__prices' }, prices.map((p) =>
        h('p', { class: 'register__price' }, h('strong', { text: p.amount }), h('span', { text: p.label })))),
      h('a', { class: 'btn register__btn', href: url, target: '_blank', rel: 'noopener noreferrer' }, R.buttonLabel, icon('arrow'))));
  }

  /* ========================================================== NAVIGATION */
  function renderNav() {
    js('brand-short').textContent = EV.shortName;
    js('brand-theme').textContent = EV.theme;
    js('topnav').append(...C.nav.map((n) => h('a', { href: `#${n.id}`, text: n.label, data: { nav: n.id } })));
    js('tabbar').append(...C.nav.filter((n) => n.tab).slice(0, 5).map((n) =>
      h('a', { href: `#${n.id}`, data: { nav: n.id } }, art(n.icon, '', ''), h('span', { text: n.label }))));
    js('share-top').addEventListener('click', shareSite);

    // Highlight the section in view
    const links = [...document.querySelectorAll('[data-nav]')];
    const setCurrent = (id) => links.forEach((a) => {
      if (a.dataset.nav === id) a.setAttribute('aria-current', 'true'); else a.removeAttribute('aria-current');
    });
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((e) => { if (e.isIntersecting) setCurrent(e.target.id === 'top' ? '' : e.target.id); });
    }, { rootMargin: '-45% 0px -50% 0px' });
    ['top', ...C.nav.map((n) => n.id)].forEach((id) => { const el = document.getElementById(id); if (el) observer.observe(el); });

    // Topbar shadow once the page scrolls; hero planets and constellations
    // drift away as the hero leaves the screen (--leave: 0 at top, 1 when gone;
    // --scroll: px scrolled, so the constellations move with the page)
    const topbar = js('topbar');
    const hero = js('hero');
    let ticking = false;
    const onScroll = () => {
      topbar.classList.toggle('is-scrolled', window.scrollY > 8);
      const leave = reduceMotion.matches ? 0 : Math.min(1, window.scrollY / Math.max(1, (hero?.offsetHeight || 1) * 0.8));
      document.documentElement.style.setProperty('--leave', leave.toFixed(3));
      document.documentElement.style.setProperty('--scroll', reduceMotion.matches ? '0' : String(Math.round(window.scrollY)));
      ticking = false;
    };
    window.addEventListener('scroll', () => {
      if (ticking) return; ticking = true;
      requestAnimationFrame(onScroll);
    }, { passive: true });
    onScroll();
  }

  /* ============================================================ SCHEDULE */
  function openActivity(id) {
    const it = ITEM[id];
    if (!it) return;
    const t = now(); const live = phase(t) === 'live';
    const upcoming = nextSession(it, t);
    openSheet({
      color: it.color,
      build: (body) => body.append(
        h('div', { class: 'sheet__head' }, art(it.icon, ''),
          h('div', null, h('h2', { class: 'sheet__title', id: 'sheet-title', text: it.name }), h('p', { class: 'sheet__sub', text: whereLine(it) }))),
        it.details && h('p', null, rich(it.details)),
        h('ul', { class: 'map-info__times', 'aria-label': 'Times' }, it.sessions.map((se) => {
          const st = sessionState(se, t);
          let status = null;
          if (live && st === 'now') status = h('span', { class: 'status status--now', text: 'Happening now' });
          else if (live && st === 'past') status = h('span', { class: 'status', text: 'Done' });
          else if (live && upcoming === se) status = h('span', { class: 'status status--next', text: 'Up next' });
          return h('li', { data: { color: it.color } }, h('strong', { text: sessionLabel(se) }), status, se.note && h('span', { class: 'session-note', text: se.note }));
        })),
        h('div', { class: 'sheet__actions' },
          it.zone && button('Show on map', { cls: 'btn--accent', icon: 'map', onClick: () => { closeSheet(); selectZone(it.zone, true); } }),
          it.link && button(`Open ${C.mission.title}`, { icon: 'chevron', onClick: () => { closeSheet(); goTo(it.link); } }))
      )
    });
  }

  function renderSchedule() {
    const S = C.schedule;
    const root = js('schedule');
    const t0 = toMin(S.timelineStart); const t1 = toMin(S.timelineEnd); const span = t1 - t0;

    // List view
    const list = h('ul', { class: 'sched-list' }, ITEMS.map((it) => h('li', null,
      h('button', { type: 'button', class: 'sched-item', data: { color: it.color, item: it.id }, on: { click: () => openActivity(it.id) } },
        art(it.icon, 'sched-item__icon'),
        h('span', null,
          h('span', { class: 'sched-item__name', text: it.name }),
          h('span', { class: 'sched-item__times' }, it.sessions.map((se) =>
            h('span', { class: 'time-chip', data: { item: it.id, session: se.index } }, sessionLabel(se)))),
          h('span', { class: 'sched-item__where', text: whereLine(it) })),
        h('span', { class: 'chev' }, icon('chevron'))))));

    // Timeline view
    const axis = h('div', { class: 'tl-axis', 'aria-hidden': 'true' });
    for (let m = Math.ceil(t0 / 60) * 60; m <= t1; m += 60) {
      const hr = Math.floor(m / 60);
      axis.append(h('span', { vars: { left: `${((m - t0) / span) * 100}%` }, text: `${hr % 12 || 12} ${hr >= 12 ? 'PM' : 'AM'}` }));
    }
    const grid = h('div', { class: 'tl-grid', 'data-js': 'tl-grid', vars: { '--hours': span / 60 } },
      h('div', { class: 'tl-label tl-label--axis', 'aria-hidden': 'true' }), axis,
      ITEMS.map((it) => [
        h('div', { class: 'tl-label', data: { color: it.color } }, h('span', null, it.name, h('small', { text: whereLine(it) }))),
        h('div', { class: 'tl-track', data: { color: it.color } }, it.sessions.map((se) => {
          const len = toMin(se.end) - toMin(se.start);
          return h('button', {
            type: 'button', class: 'tl-block',
            data: { item: it.id, session: se.index },
            'aria-label': `${it.name}, ${sessionLabel(se)}`,
            vars: { '--s': (toMin(se.start) - t0) / span, '--l': len / span },
            on: { click: () => openActivity(it.id) }
          }, len >= 60 && se.showEnd ? `${fmt(se.start, false)}–${fmt(se.end, false)}` : fmt(se.start, false));
        }))
      ]));
    const timeline = h('div', { class: 'card timeline' },
      h('div', { class: 'tl-scroll', tabindex: '0', 'aria-label': 'Timeline by activity. Scroll sideways to see the whole day.' }, grid),
      h('p', { class: 'tl-hint', text: 'Scroll sideways to see the whole day →' }));

    // Toggle
    const wide = window.matchMedia('(min-width: 60rem)').matches;
    let view = store.get('view', wide ? 'timeline' : 'list');
    if (view !== 'list' && view !== 'timeline') view = 'list';
    const btnList = h('button', { type: 'button', text: S.listLabel });
    const btnTl = h('button', { type: 'button', text: S.timelineLabel });
    const setView = (v) => {
      view = v; store.set('view', v);
      list.hidden = v !== 'list'; timeline.hidden = v !== 'timeline';
      btnList.setAttribute('aria-pressed', String(v === 'list'));
      btnTl.setAttribute('aria-pressed', String(v === 'timeline'));
      if (v === 'timeline') requestAnimationFrame(refreshLive);
    };
    btnList.addEventListener('click', () => setView('list'));
    btnTl.addEventListener('click', () => setView('timeline'));

    root.append(h('div', { class: 'container' },
      sectionHead('schedule', S),
      h('div', { class: 'card now-next', 'data-js': 'now-next', hidden: true }),
      h('div', { class: 'toolbar' }, h('div', { class: 'seg', role: 'group', 'aria-label': 'Schedule view' }, btnList, btnTl)),
      list, timeline,
      (S.footnotes?.length > 0) && h('div', { class: 'card footnotes' }, S.footnotes.map((f) => h('p', null, rich(f))))));
    setView(view);
  }

  let nowNextSignature = '';
  function refreshLive() {
    const t = now(); const ph = phase(t);
    // Time chips & timeline blocks
    document.querySelectorAll('[data-item][data-session]').forEach((el) => {
      const se = ITEM[el.dataset.item]?.sessions[Number(el.dataset.session)];
      if (!se) return;
      const st = ph === 'live' ? sessionState(se, t) : (ph === 'after' ? 'past' : 'future');
      el.classList.toggle('is-past', st === 'past');
      el.classList.toggle('is-now', st === 'now');
      if (el.classList.contains('time-chip')) {
        const badge = el.querySelector('.badge-now');
        if (st === 'now' && !badge) el.append(h('span', { class: 'badge-now', text: 'NOW' }));
        if (st !== 'now' && badge) badge.remove();
      }
    });
    document.querySelectorAll('.sched-item').forEach((el) => {
      const it = ITEM[el.dataset.item];
      el.classList.toggle('is-live', ph === 'live' && it.sessions.some((se) => sessionState(se, t) === 'now'));
    });
    const grid = js('tl-grid');
    if (grid) {
      const S = C.schedule; const t0 = toMin(S.timelineStart); const t1 = toMin(S.timelineEnd);
      const m = toMin(nowHHMM(t));
      const showLine = ph === 'live' && m >= t0 && m <= t1;
      grid.classList.toggle('is-live', showLine);
      if (showLine) {
        const frac = (m - t0) / (t1 - t0);
        grid.style.setProperty('--now', String(frac));
        const scroller = grid.parentElement;
        if (!scroller.dataset.autoscrolled && scroller.offsetParent) {
          scroller.dataset.autoscrolled = '1';
          const label = grid.querySelector('.tl-label')?.offsetWidth || 0;
          scroller.scrollLeft = Math.max(0, label + frac * (grid.scrollWidth - label) - scroller.clientWidth / 2);
        }
      }
    }

    // Now & next panel
    const panel = js('now-next');
    if (!panel) return;
    if (ph !== 'live') { panel.hidden = true; nowNextSignature = ''; return; }
    const nowList = []; const nextList = [];
    ITEMS.forEach((it) => it.sessions.forEach((se) => {
      const st = sessionState(se, t);
      if (st === 'now') nowList.push({ it, se });
      else if (st === 'future' && at(se.start) - t <= 90 * 60000) nextList.push({ it, se });
    }));
    nextList.sort((a, b) => toMin(a.se.start) - toMin(b.se.start));
    const sig = `${nowHHMM(t)}|${nowList.map((x) => x.it.id).join()}|${nextList.map((x) => x.it.id + x.se.start).join()}`;
    if (sig === nowNextSignature) return;
    nowNextSignature = sig;
    const chip = ({ it, se }, showTime) => h('li', null, h('button', {
      type: 'button', class: 'mini-chip', data: { color: it.color }, on: { click: () => openActivity(it.id) }
    }, it.name, showTime && h('em', { text: fmt(se.start) })));
    panel.replaceChildren(
      h('p', { class: 'now-next__head' }, h('span', { class: 'live-dot', 'aria-hidden': 'true' }), `Live · ${fmt(nowHHMM(t))}`),
      h('div', { class: 'now-next__rows' },
        h('div', null, h('p', { class: 'now-next__label', text: 'Happening now' }),
          nowList.length ? h('ul', { class: 'now-next__list' }, nowList.map((x) => chip(x, false))) : h('p', { class: 'sched-item__where', text: 'Explore any open activity!' })),
        h('div', null, h('p', { class: 'now-next__label', text: 'Up next' }),
          nextList.length ? h('ul', { class: 'now-next__list' }, nextList.slice(0, 4).map((x) => chip(x, true))) : h('p', { class: 'sched-item__where', text: 'Nothing else starting soon.' }))));
    panel.hidden = false;
  }

  /* ================================================================= MAP
     The campus picture (assets/img/campus-map.webp, 2000 × 1125) with tap
     targets drawn over it, in the picture's pixel positions. "num" is the
     centre of the location's number badge, which is the only part that lights
     up. "hit" areas are the invisible tap targets around the name: [x, y] is
     the centre, w × h the size, r the tilt in degrees. "card" is the
     location's position (0–4) in the list on the right. If the picture is
     replaced, move these to match. */
  const MAP_SPOTS = {
    universe:    { num: [935, 187],  card: 0, hit: [{ x: 840, y: 135, w: 340, h: 125, r: 30 }] },
    launchpad:   { num: [795, 313],  card: 1, hit: [{ x: 722, y: 338, w: 320, h: 120, r: 25 }] },
    fuel:        { num: [511, 322],  card: 2, hit: [{ x: 388, y: 330, w: 340, h: 150, r: 26 }] },
    zerogravity: { num: [568, 455],  card: 3, hit: [{ x: 635, y: 500, w: 255, h: 135, r: 32 }] },
    exhibition:  { num: [1101, 263], card: 4, hit: [{ x: 1272, y: 405, w: 340, h: 125, r: 30 }] }
  };
  const CARD_NUM_Y = (i) => 135 + i * 196.75; // number badges on the cards sit at x 1711
  function buildMap(large = false) {
    const Z = C.map.zones;
    const hit = (sp) => s('rect', { class: 'zone-hit', x: sp.x - sp.w / 2, y: sp.y - sp.h / 2, width: sp.w, height: sp.h, rx: Math.min(sp.h / 2, 46), transform: `rotate(${sp.r} ${sp.x} ${sp.y})` });
    const ring = (cx, cy, r) => s('circle', { class: 'zone-ring', cx, cy, r });
    return s('svg', { class: 'map-svg', viewBox: '0 0 2000 1125', role: 'group', 'aria-label': `${C.map.title}: ${C.map.imageAlt || ''} Tap a location for details.` },
      s('image', { href: large ? 'assets/img/campus-map-large.webp' : 'assets/img/campus-map.webp', x: 0, y: 0, width: 2000, height: 1125 }),
      Object.entries(MAP_SPOTS).filter(([id]) => Z[id]).map(([id, sp]) => s('g', {
        class: 'zone', data: { zone: id }, tabindex: '0', role: 'button', 'aria-label': Z[id].name || id
      },
      sp.hit.map(hit),
      s('rect', { class: 'zone-hit', x: 1692, y: CARD_NUM_Y(sp.card) - 3, width: 288, height: 186, rx: 22 }),
      ring(sp.num[0], sp.num[1], 44), ring(1711, CARD_NUM_Y(sp.card), 34))));
  }

  function wireMap(svg, onZone) {
    const handle = (target) => {
      const z = target.closest('.zone');
      if (z) { onZone(z.dataset.zone); return true; }
      return false;
    };
    svg.addEventListener('click', (e) => handle(e.target));
    svg.addEventListener('keydown', (e) => {
      if ((e.key === 'Enter' || e.key === ' ') && handle(e.target)) e.preventDefault();
    });
  }

  let mapSvg; let mapInfo; let locButtons = [];
  function selectZone(id, scroll = false) {
    const Z = C.map.zones; const z = Z[id];
    if (!z || z.interactive === false || !mapSvg) return;
    mapSvg.querySelectorAll('.zone').forEach((g) => g.classList.toggle('is-active', g.dataset.zone === (z.spot || id)));
    locButtons.forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.zone === id)));
    const its = (z.schedule || []).map((sid) => ITEM[sid]).filter(Boolean);
    mapInfo.replaceChildren();
    appendKids(mapInfo, [
      h('h3', { class: 'map-info__title', text: z.name }),
      z.info && h('p', { class: 'map-info__text' }, rich(z.info)),
      its.length > 0 && h('ul', { class: 'map-info__times' }, its.map((it) => h('li', { data: { color: it.color } },
        h('strong', { text: it.sessions.map(sessionLabel).join(' · ') }), h('span', { text: whereLine(it) || it.name })))),
      h('div', { class: 'sheet__actions' },
        its.map((it) => button(its.length > 1 ? `${it.name}: ${it.activity}` : 'Details', { cls: 'btn--small', icon: 'clock', onClick: () => openActivity(it.id) })),
        z.link && button(`Open ${C.mission.title}`, { cls: 'btn--small btn--primary', icon: 'chevron', onClick: () => goTo(z.link) }))]);
    if (scroll) goTo('map');
  }

  function renderMap() {
    const M = C.map;
    const root = js('map');
    mapSvg = buildMap();
    wireMap(mapSvg, (id) => selectZone(id));
    mapInfo = h('div', { class: 'card map-info', 'aria-live': 'polite' }, h('p', { class: 'map-info__empty', text: M.pickPrompt }));
    locButtons = Object.entries(M.zones).filter(([, z]) => z.interactive !== false && z.name).map(([id, z]) => h('button', {
      type: 'button', 'aria-pressed': 'false', data: { zone: id }, text: z.name, on: { click: () => selectZone(id) }
    }));

    const enlarge = h('button', { type: 'button', class: 'icon-btn', 'aria-label': M.enlargeLabel, on: { click: openBigMap } }, icon('expand'));
    root.append(h('div', { class: 'container' },
      sectionHead('map', M),
      h('div', { class: 'map-layout' },
        h('div', null,
          h('div', { class: 'card map-frame' }, enlarge, mapSvg),
          M.legend?.length > 0 && h('ul', { class: 'legend', 'aria-label': 'Legend' }, M.legend.map((l) => h('li', null, h('i', { class: l.swatch, 'aria-hidden': 'true' }), l.label)))),
        h('div', { class: 'map-side' },
          mapInfo,
          h('h3', { class: 'visually-hidden', text: 'Locations' }),
          h('ul', { class: 'loc-list', 'aria-label': 'Locations' }, locButtons.map((b) => h('li', null, b)))))));
  }

  function openBigMap() {
    const big = buildMap(true);
    let zoom = 1;
    const frame = h('div', { class: 'map-zoom' }, big);
    const setZoom = (z) => { zoom = Math.min(3, Math.max(1, z)); frame.style.setProperty('--zoom', String(zoom)); };
    wireMap(big, (id) => { closeSheet(); selectZone(id, true); });
    openSheet({
      wide: true,
      build: (body) => body.append(
        h('h2', { class: 'sheet__title', id: 'sheet-title', text: C.map.title }),
        frame,
        h('div', { class: 'zoom-controls' },
          h('button', { type: 'button', class: 'icon-btn', 'aria-label': 'Zoom out', on: { click: () => setZoom(zoom - 0.5) } }, icon('minus')),
          h('button', { type: 'button', class: 'btn btn--small', text: 'Reset', on: { click: () => setZoom(1) } }),
          h('button', { type: 'button', class: 'icon-btn', 'aria-label': 'Zoom in', on: { click: () => setZoom(zoom + 0.5) } }, icon('plus'))))
    });
  }

  /* ============================================================= MISSION */
  const STOPS = C.mission.stops;
  const normalize = (w) => String(w).normalize('NFC').trim().toLocaleLowerCase();
  function parseStory(paragraphs) {
    const answers = [];
    const paras = paragraphs.map((p) => String(p).split(/(\[\[[^\]]+\]\]|\*\*[^*]+\*\*)/g).filter(Boolean).map((part) => {
      if (part.startsWith('[[') && part.endsWith(']]')) { answers.push(part.slice(2, -2).trim()); return { blank: answers.length - 1 }; }
      if (part.startsWith('**') && part.endsWith('**')) return { bold: part.slice(2, -2) };
      return part;
    }));
    return { paras, answers };
  }
  const storyState = (id) => asObject(store.get(`story:${id}`, {}));
  const isStopDone = (id) => storyState(id).done === true;

  let currentStop = STOPS.some((st) => st.id === store.get('stop')) ? store.get('stop') : STOPS[0]?.id;
  let pickerButtons = [];
  let stopPanel;

  function renderMission() {
    const M = C.mission;
    const root = js('mission');
    const picker = h('ul', { class: 'planet-picker', role: 'tablist', 'aria-label': 'Planets' });
    pickerButtons = STOPS.map((stop) => {
      const done = h('span', { class: 'planet-btn__done', hidden: !isStopDone(stop.id) }, '✓ Done');
      const b = h('button', {
        type: 'button', role: 'tab', class: 'planet-btn', id: `tab-${stop.id}`, 'aria-controls': 'stop-panel',
        data: { color: stop.color, stop: stop.id }, on: { click: () => selectStop(stop.id, true) }
      }, art(stop.icon, ''), h('span', { class: 'planet-btn__stop', text: 'Planet' }),
      h('span', { class: 'planet-btn__name', text: stop.planet.replace(/^Planet\s+/i, '') }), done);
      picker.append(h('li', { role: 'presentation' }, b));
      return b;
    });
    picker.addEventListener('keydown', (e) => {
      const i = STOPS.findIndex((st) => st.id === currentStop);
      let j = null;
      if (e.key === 'ArrowRight') j = (i + 1) % STOPS.length;
      else if (e.key === 'ArrowLeft') j = (i - 1 + STOPS.length) % STOPS.length;
      else if (e.key === 'Home') j = 0;
      else if (e.key === 'End') j = STOPS.length - 1;
      if (j === null) return;
      e.preventDefault(); selectStop(STOPS[j].id); pickerButtons[j].focus();
    });
    stopPanel = h('div', { id: 'stop-panel', role: 'tabpanel' });
    root.append(h('div', { class: 'container' }, sectionHead('mission', M), picker, stopPanel));
    selectStop(currentStop);
  }

  function selectStop(id, focusPanel = false) {
    const idx = STOPS.findIndex((st) => st.id === id);
    if (idx < 0) return;
    currentStop = id; store.set('stop', id);
    pickerButtons.forEach((b) => {
      const on = b.dataset.stop === id;
      b.setAttribute('aria-selected', String(on));
      b.tabIndex = on ? 0 : -1;
    });
    stopPanel.setAttribute('aria-labelledby', `tab-${id}`);
    stopPanel.dataset.color = STOPS[idx].color;
    stopPanel.replaceChildren(buildStop(STOPS[idx], idx));
    if (focusPanel && window.matchMedia('(max-width: 64rem)').matches) {
      // On phones, bring the story into view after picking a planet
      requestAnimationFrame(() => stopPanel.querySelector('.stop__head')?.scrollIntoView({ behavior: reduceMotion.matches ? 'auto' : 'smooth', block: 'start' }));
    }
  }

  function goToPlanet(id) {
    if (!STOPS.some((st) => st.id === id)) return;
    selectStop(id);
    goTo('mission');
  }

  function buildStop(stop, idx) {
    const M = C.mission;
    const { paras, answers } = parseStory(stop.paragraphs);
    const bank = Array.isArray(stop.wordBank) && stop.wordBank.length
      ? stop.wordBank.slice()
      : answers.slice().sort((a, b) => a.localeCompare(b, undefined, { sensitivity: 'base' }));

    // Restore saved state (validated)
    const saved = storyState(stop.id);
    const filled = answers.map((_, i) => {
      const v = asArray(saved.filled)[i];
      return Number.isInteger(v) && v >= 0 && v < bank.length ? v : null;
    });
    // never allow the same chip twice
    filled.forEach((v, i) => { if (v !== null && filled.indexOf(v) !== i) filled[i] = null; });
    let done = saved.done === true;
    let revealed = saved.revealed === true;
    let wrong = new Set();
    let active = filled.indexOf(null);

    const feedback = h('p', { class: 'feedback', role: 'status' });
    const bigIdea = h('div', { class: 'big-idea' },
      h('p', { class: 'big-idea__label', text: M.bigIdeaLabel }), h('p', null, rich(stop.bigIdea)));

    const blanks = answers.map((_, i) => h('button', { type: 'button', class: 'blank', on: { click: () => onBlank(i) } }));
    const chips = bank.map((w, ci) => h('button', { type: 'button', class: 'chip', text: w, on: { click: () => onChip(ci) } }));

    const save = () => store.set(`story:${stop.id}`, { filled, done, revealed });

    function update() {
      blanks.forEach((b, i) => {
        const word = filled[i] !== null ? bank[filled[i]] : '';
        b.textContent = word || '\u00a0';
        const correct = (done || revealed) && word;
        b.className = 'blank';
        if (word) b.classList.add('is-filled');
        if (correct) b.classList.add('is-correct');
        if (wrong.has(i)) b.classList.add('is-wrong');
        if (!done && !revealed && i === active) b.classList.add('is-active');
        b.setAttribute('aria-label', `Blank ${i + 1} of ${answers.length}: ${word || 'empty'}${!done && i === active ? ', selected' : ''}${wrong.has(i) ? ', not quite' : ''}`);
        b.disabled = done || revealed;
      });
      chips.forEach((c, ci) => {
        const used = filled.includes(ci);
        c.classList.toggle('is-used', used);
        c.setAttribute('aria-label', used ? `${bank[ci]}, placed in the story` : bank[ci]);
        c.disabled = done || revealed;
      });
      bigIdea.classList.toggle('is-lit', done);
      const pickerDone = pickerButtons[idx]?.querySelector('.planet-btn__done');
      if (pickerDone) pickerDone.hidden = !done;
    }

    function nextEmpty(from) {
      for (let k = 1; k <= filled.length; k++) {
        const j = (from + k) % filled.length;
        if (filled[j] === null) return j;
      }
      return -1;
    }

    function onChip(ci) {
      if (done || revealed) return;
      const pos = filled.indexOf(ci);
      if (pos >= 0) { filled[pos] = null; wrong.delete(pos); active = pos; update(); save(); return; }
      const target = active >= 0 && filled[active] === null ? active : filled.indexOf(null);
      if (target < 0) return;
      filled[target] = ci; wrong.delete(target);
      active = nextEmpty(target);
      buzz(10);
      update(); save();
      if (!filled.includes(null)) check();
      else feedback.textContent = '';
    }

    function onBlank(i) {
      if (done || revealed) return;
      if (filled[i] !== null) { filled[i] = null; wrong.delete(i); }
      active = i;
      update(); save();
    }

    function check() {
      wrong = new Set(answers.map((a, i) => (normalize(bank[filled[i]]) === normalize(a) ? -1 : i)).filter((i) => i >= 0));
      if (wrong.size === 0) {
        done = true; save(); update();
        feedback.className = 'feedback is-ok';
        feedback.textContent = M.successText;
        confetti(); buzz([30, 40, 30]);
        refreshPassport(stop.id);
      } else {
        feedback.className = 'feedback is-err';
        feedback.textContent = M.tryAgainText;
        update();
      }
    }

    function reset() {
      filled.fill(null); done = false; revealed = false; wrong = new Set(); active = 0;
      feedback.textContent = ''; feedback.className = 'feedback';
      save(); update(); refreshPassport();
      blanks[0]?.focus();
    }

    function reveal() {
      answers.forEach((a, i) => {
        const ci = bank.findIndex((w, k) => normalize(w) === normalize(a) && !answers.slice(0, i).some((_, p) => filled[p] === k));
        filled[i] = ci >= 0 ? ci : null;
      });
      revealed = true; wrong = new Set();
      feedback.className = 'feedback';
      feedback.textContent = 'Answers shown. Tap “Start over” to try it yourself and earn your star!';
      save(); update();
    }

    if (done) { feedback.className = 'feedback is-ok'; feedback.textContent = M.successText; }

    const story = h('article', { class: 'story', 'aria-label': `${stop.story}: fill in the blanks` },
      h('div', { class: 'story__text' }, paras.map((parts) => h('p', null, parts.map((part) => {
        if (typeof part === 'string') return part;
        if ('bold' in part) return h('strong', { text: part.bold });
        return blanks[part.blank];
      })))),
      h('div', { class: 'wordbank' },
        h('p', { class: 'wordbank__label' }, 'Word bank: ', h('span', { text: M.wordBankLabel.replace(/^Word bank:\s*/i, '') })),
        h('ul', { class: 'chips', 'aria-label': 'Word bank' }, chips.map((c) => h('li', null, c)))),
      feedback,
      h('div', { class: 'story__controls' },
        button(M.resetLabel, { cls: 'btn--ink btn--small', icon: 'reset', onClick: reset }),
        button(M.revealLabel, { cls: 'btn--ink btn--small', icon: 'eye', onClick: reveal })));

    // Actions at home (simple list; nothing to track)
    const actions = h('section', { class: 'card actions', 'aria-labelledby': `actions-${stop.id}` },
      h('h3', { class: 'actions__title', id: `actions-${stop.id}`, text: M.actionsTitle }),
      h('p', { class: 'actions__intro', text: M.actionsIntro }),
      h('ul', { class: 'actions__list' }, stop.actions.map((a) => h('li', { class: 'action' },
        h('span', { class: 'action__icon', 'aria-hidden': 'true' }, icon('star', true)),
        h('div', null, h('h4', { text: a.title }), h('p', null, rich(a.text)))))));

    const prev = STOPS[idx - 1]; const next = STOPS[idx + 1];
    update();
    return h('div', { class: 'stop' },
      h('div', { class: 'stop__head' }, art(stop.icon, ''),
        h('div', null,
          h('p', { class: 'stop__eyebrow', text: M.title }),
          h('h3', { class: 'stop__title', text: stop.planet }),
          h('p', { class: 'stop__story-title', text: stop.story }))),
      h('div', { class: 'stop__cols' }, h('div', null, story, bigIdea), actions),
      h('div', { class: 'stop-nav' },
        prev ? button(`${M.prevLabel}: ${prev.planet}`, { icon: 'left', cls: 'btn--small', onClick: () => goToPlanet(prev.id) }) : h('span'),
        next ? button(`${M.nextLabel}: ${next.planet}`, { icon: 'chevron', cls: 'btn--small btn--primary', onClick: () => goToPlanet(next.id) }) : null));
  }

  /* =============================================================== REELS
     A reel plays a YouTube video (youtubeId), the newest videos of a YouTube
     playlist or channel (playlist), or a video file (video). With only a url
     it opens that link in a new tab. image is an optional local thumbnail. */
  const COLOR_CYCLE = ['pink', 'teal', 'orange', 'sky', 'yellow', 'green', 'lavender'];
  const httpsUrl = (u) => (/^https:\/\/[^\s]+$/.test(u || '') ? u : '');
  function renderReels() {
    const R = C.reels;
    const root = js('reels');
    const track = h('ul', { class: 'reel-track', 'aria-label': R.title });
    R.items.forEach((r, i) => {
      const yt = /^[\w-]{6,20}$/.test(r.youtubeId || '') ? r.youtubeId : '';
      const list = /^[\w-]{10,40}$/.test(r.playlist || '') ? r.playlist : '';
      const vid = /^(?!.*\.\.)[\w/.-]+\.(mp4|webm)$/i.test(r.video || '') ? r.video : '';
      const img = /^assets\/img\/[\w.-]+\.(webp|png|jpe?g|svg)$/i.test(r.image || '') ? r.image : '';
      const url = httpsUrl(r.url);
      const playable = Boolean(yt || list || vid);
      let thumb = art(r.icon || 'astronaut', 'reel__art');
      if (img) thumb = h('img', { class: 'reel__thumb', src: img, alt: '', loading: 'lazy', decoding: 'async' });
      else if (yt) thumb = h('img', { class: 'reel__thumb', src: `https://i.ytimg.com/vi/${yt}/hqdefault.jpg`, alt: '', loading: 'lazy', decoding: 'async' });
      let badge = h('span', { class: 'reel__soon', text: R.comingSoon });
      if (playable) badge = h('span', { class: 'reel__play', 'aria-hidden': 'true' }, icon('play', true));
      else if (url) badge = h('span', { class: 'reel__play', 'aria-hidden': 'true' }, icon('arrow'));
      const inner = [thumb, badge, h('span', { class: 'reel__title', text: r.title }), r.text && h('span', { class: 'reel__text', text: r.text })];
      const color = COLOR_CYCLE[i % COLOR_CYCLE.length];
      let tile;
      if (playable) tile = h('button', { type: 'button', class: 'reel', data: { color }, 'aria-label': `Play: ${r.title}`, on: { click: () => playReel(r, { yt, list, vid, url }) } }, inner);
      else if (url) tile = h('a', { class: 'reel', data: { color }, href: url, target: '_blank', rel: 'noopener noreferrer', 'aria-label': `${r.title} (opens in a new tab)` }, inner);
      else tile = h('div', { class: 'reel', data: { color }, 'aria-label': `${r.title}, ${R.comingSoon}`, role: 'group' }, inner);
      track.append(h('li', null, tile));
    });
    root.append(h('div', { class: 'container' }, sectionHead('reels', R), R.featured && featuredVideo(R.featured, R),
      R.moreTitle && h('h3', { class: 'reels__more', text: R.moreTitle }),
      track, R.items.length > 1 && h('p', { class: 'swipe-hint', text: R.swipeHint })));
  }

  /* The big 16:9 video. A local file plays in place; YouTube loads only after a tap. */
  function featuredVideo(f, R) {
    const yt = /^[\w-]{6,20}$/.test(f.youtubeId || '') ? f.youtubeId : '';
    const vid = /^(?!.*\.\.)[\w/.-]+\.(mp4|webm)$/i.test(f.video || '') ? f.video : '';
    const poster = /^assets\/img\/[\w.-]+\.(webp|png|jpe?g)$/i.test(f.poster || '') ? f.poster : '';
    const frame = h('div', { class: 'feature-video' });
    if (vid) {
      frame.append(h('video', { src: vid, poster: poster || null, controls: true, playsinline: true, preload: 'metadata', title: f.title }));
    } else if (yt) {
      const start = h('button', { type: 'button', class: 'feature-video__start', 'aria-label': `Play: ${f.title}`, on: { click: () => frame.replaceChildren(h('iframe', {
        src: `https://www.youtube-nocookie.com/embed/${yt}?autoplay=1&playsinline=1&rel=0&modestbranding=1`,
        title: f.title, allow: 'autoplay; encrypted-media; picture-in-picture; fullscreen', allowfullscreen: true,
        referrerpolicy: 'strict-origin-when-cross-origin',
        sandbox: 'allow-scripts allow-same-origin allow-presentation allow-popups allow-popups-to-escape-sandbox'
      })) } },
        h('img', { class: 'reel__thumb', src: poster || `https://i.ytimg.com/vi/${yt}/hqdefault.jpg`, alt: '', loading: 'lazy', decoding: 'async' }),
        h('span', { class: 'reel__play', 'aria-hidden': 'true' }, icon('play', true)));
      frame.append(start);
    } else {
      frame.append(h('div', { class: 'feature-video__soon', role: 'group', 'aria-label': `${f.title}, ${R.comingSoon}` },
        art('rocket', 'feature-video__art'), h('span', { class: 'reel__soon', text: R.comingSoon })));
    }
    return frame;
  }

  function playReel(r, { yt, list, vid, url }) {
    const embed = yt ? `https://www.youtube-nocookie.com/embed/${yt}?autoplay=1&playsinline=1&rel=0&modestbranding=1`
      : list ? `https://www.youtube-nocookie.com/embed/videoseries?list=${list}&autoplay=1&playsinline=1&rel=0&modestbranding=1` : '';
    const watch = url || (yt ? `https://www.youtube.com/watch?v=${yt}` : list ? `https://www.youtube.com/playlist?list=${list}` : '');
    openSheet({
      build: (body) => body.append(
        h('h2', { class: 'sheet__title', id: 'sheet-title', text: r.title }),
        h('div', { class: 'video-frame' }, embed
          ? h('iframe', {
            src: embed,
            title: r.title, allow: 'autoplay; encrypted-media; picture-in-picture; fullscreen', allowfullscreen: true,
            referrerpolicy: 'strict-origin-when-cross-origin', loading: 'lazy',
            sandbox: 'allow-scripts allow-same-origin allow-presentation allow-popups allow-popups-to-escape-sandbox'
          })
          : h('video', { src: vid, controls: true, playsinline: true, autoplay: true, preload: 'metadata' })),
        embed && watch && h('p', { class: 'sheet__sub' }, url ? '' : 'Video not loading? ',
          h('a', { href: watch, target: '_blank', rel: 'noopener noreferrer', text: url ? (r.linkLabel || 'Watch more on YouTube') : 'Watch it on YouTube' })))
    });
  }

  /* ============================================================ PASSPORT */
  const STAMPS = C.passport.stamps;
  const manualStamps = () => asObject(store.get('stamps', {}));
  const isStampOn = (st) => (st.stop ? isStopDone(st.stop) : manualStamps()[st.id] === true);
  let stampButtons = [];

  function renderPassport() {
    const P = C.passport;
    const root = js('passport');
    stampButtons = STAMPS.map((st) => {
      const b = h('button', {
        type: 'button', class: 'stamp', data: { stamp: st.id },
        on: {
          click: () => {
            if (st.stop) {
              if (!isStopDone(st.stop)) { toast(`Finish the ${st.label} story to earn this star!`); goToPlanet(st.stop); }
              else toast(`⭐ ${st.label} complete!`);
              return;
            }
            const all = manualStamps();
            const on = !all[st.id];
            if (on) all[st.id] = true; else delete all[st.id];
            store.set('stamps', all);
            if (on) { toast(`⭐ ${st.label} collected!`); buzz(30); }
            refreshPassport(on ? st.id : null);
          }
        }
      },
      h('span', { class: 'stamp__icon' }, art(st.icon, ''), h('span', { class: 'stamp__star', 'aria-hidden': 'true', text: '★' })),
      h('span', { class: 'stamp__label', text: st.label }),
      h('span', { class: 'stamp__sub', text: st.sub }));
      return b;
    });
    root.append(h('div', { class: 'container' },
      sectionHead('passport', P),
      h('div', { class: 'card passport' },
        h('div', { class: 'complete', 'data-js': 'complete', hidden: true },
          h('img', { src: 'assets/img/diya.svg', alt: '', width: 64, height: 64 }),
          h('h3', { text: P.completeTitle }), h('p', { text: P.completeText })),
        h('div', { class: 'progress' },
          h('p', { class: 'progress__row' }, h('span', { text: 'Explorer progress' }), h('strong', { 'data-js': 'progress-num' })),
          h('div', { class: 'progress__bar', role: 'progressbar', 'aria-valuemin': '0', 'aria-valuemax': String(STAMPS.length), 'data-js': 'progress-bar', 'aria-label': 'Explorer progress' },
            h('div', { class: 'progress__fill', 'data-js': 'progress-fill' }))),
        h('ul', { class: 'stamps' }, stampButtons.map((b) => h('li', null, b))),
        h('div', { class: 'passport__foot' },
          button(P.resetLabel, { cls: 'btn--ghost btn--small', icon: 'reset', onClick: resetAll })))));
    refreshPassport(null, true);
  }

  let wasComplete = null;
  function refreshPassport(justOn = null, initial = false) {
    let count = 0;
    stampButtons.forEach((b, i) => {
      const st = STAMPS[i]; const on = isStampOn(st);
      if (on) count++;
      b.classList.toggle('is-on', on);
      b.classList.toggle('just-on', on && (justOn === st.id || justOn === st.stop));
      b.setAttribute('aria-pressed', String(on));
      b.setAttribute('aria-label', `${st.label}, ${st.sub}: ${on ? 'star collected' : 'not collected yet'}`);
    });
    const total = STAMPS.length;
    js('progress-num').textContent = `${count} / ${total} ${C.passport.progressLabel}`;
    js('progress-fill').style.setProperty('--p', String(total ? count / total : 0));
    js('progress-bar').setAttribute('aria-valuenow', String(count));
    const complete = total > 0 && count === total;
    js('complete').hidden = !complete;
    if (complete && wasComplete === false && !initial) { confetti(220); toast(C.passport.completeTitle); }
    wasComplete = complete;
  }

  function resetAll() {
    if (!window.confirm(C.passport.resetConfirm)) return;
    const keepView = store.get('view');
    store.clearAll();
    if (keepView) store.set('view', keepView);
    selectStop(currentStop);
    pickerButtons.forEach((b) => { const d = b.querySelector('.planet-btn__done'); if (d) d.hidden = true; });
    refreshPassport();
    toast('Passport reset. Ready for a new mission!');
  }

  /* =========================================================== REMINDERS */
  function renderReminders() {
    const R = C.reminders;
    js('reminders').append(h('div', { class: 'container' },
      sectionHead('reminders', R),
      h('ul', { class: 'reminder-grid' }, R.items.map((r) => h('li', { class: 'card reminder' },
        ICON_PATHS[r.icon] ? h('span', { class: 'reminder__icon', 'aria-hidden': 'true' }, icon(r.icon))
          : h('span', { class: 'reminder__emoji', 'aria-hidden': 'true', text: r.emoji || '✦' }),
        h('div', null, h('h3', { text: r.title }), h('p', null, rich(r.text))))))));
  }

  /* ============================================================== FOOTER */
  let installPrompt = null;
  function renderFooter() {
    const F = C.footer;
    const installBtn = button(F.installLabel, { cls: 'btn--small', icon: 'download', onClick: async () => {
      if (!installPrompt) return;
      installPrompt.prompt();
      try { await installPrompt.userChoice; } catch { /* ignore */ }
      installPrompt = null; installBtn.hidden = true;
    } });
    installBtn.hidden = true;
    window.addEventListener('beforeinstallprompt', (e) => { e.preventDefault(); installPrompt = e; installBtn.hidden = false; });
    window.addEventListener('appinstalled', () => { installBtn.hidden = true; toast('Installed! Find KDC on your home screen.'); });

    js('footer').append(h('div', { class: 'container' },
      h('p', { class: 'footer__thanks', text: F.thankYou }),
      h('p', { class: 'footer__event', text: `${EV.shortName} · ${EV.dateLabel}` }),
      h('p', { class: 'footer__address' }, EV.venue, EV.address && h('br'), EV.address),
      h('p', { class: 'footer__org' }, `${EV.organization}® | `,
        h('a', { href: EV.website, target: '_blank', rel: 'noopener noreferrer', text: EV.websiteLabel })),
      h('div', { class: 'footer__actions' },
        h('a', { class: 'btn btn--small', href: '#top' }, icon('up'), F.backToTop),
        EV.directionsUrl && linkOut('Directions', EV.directionsUrl, { cls: 'btn--small', icon: 'pin' }),
        installBtn)));
  }

  /* ====================================================== SPACE DECOR
     Floating planets, comets and friends behind each section.
     [image name in assets/img, position: tl | tr | bl | br] */
  const SECTION_DECOR = {
    schedule:  [['saturn-blue', 'tr'], ['sparkle', 'tl'], ['asteroid', 'bl']],
    map:       [['comet', 'tl'], ['planet-jupiter', 'br']],
    mission:   [['asteroid', 'tl'], ['sparkle', 'br']],
    reels:     [['satellite', 'tl'], ['comet', 'br']],
    passport:  [['sparkle', 'tl'], ['saturn-blue', 'br']],
    reminders: [['asteroid', 'tr'], ['satellite', 'bl']]
  };
  function decorateSections() {
    Object.entries(SECTION_DECOR).forEach(([id, list]) => {
      const section = document.getElementById(id);
      if (!section) return;
      list.forEach(([img, pos], i) => section.prepend(art(img, `sdeco sdeco--${pos} sdeco--${img}`, '')));
    });
  }

  /* ========================================================= DEEP LINKS */
  function handleHash() {
    const m = /^#planet-([a-z0-9-]+)$/i.exec(window.location.hash);
    if (m) { goToPlanet(m[1]); return; }
    const z = /^#zone-([a-z0-9-]+)$/i.exec(window.location.hash);
    if (z) selectZone(z[1], true);
  }

  /* ====================================================== SERVICE WORKER */
  function registerServiceWorker() {
    if (!('serviceWorker' in navigator)) return;
    const local = ['localhost', '127.0.0.1', '[::1]'].includes(window.location.hostname);
    if (window.location.protocol !== 'https:' && !local) return;
    let url = 'sw.js';
    if (window.trustedTypes?.createPolicy) {
      const policy = window.trustedTypes.createPolicy('kdc', {
        createScriptURL: (u) => { if (u === 'sw.js') return u; throw new TypeError('KDC: blocked script URL'); }
      });
      url = policy.createScriptURL('sw.js');
    }
    window.addEventListener('load', () => navigator.serviceWorker.register(url).catch(() => { /* offline support is optional */ }));
  }

  /* =============================================================== START */
  function start() {
    renderNav();
    renderHero();
    renderRegistration();
    renderSchedule();
    renderMap();
    renderMission();
    renderPassport();
    renderReminders();
    renderReels();
    renderFooter();
    decorateSections();
    refreshLive();
    handleHash();
    window.addEventListener('hashchange', handleHash);

    let tick = 0;
    setInterval(() => {
      if (document.hidden) return;
      updateCountdown();
      if (++tick % 20 === 0) refreshLive();
    }, 1000);
    document.addEventListener('visibilitychange', () => { if (!document.hidden) { updateCountdown(); refreshLive(); } });
    registerServiceWorker();
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start); else start();
})();
