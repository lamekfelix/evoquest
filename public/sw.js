// EvoQuest Service Worker — cache-first, offline-ready
const CACHE = 'evoquest-v1';

const CORE = [
  './',
  './EvoQuest.html',
  './styles.css',
  './manifest.json',
  './icon-192.svg',
  './icon-512.svg',
  './icon-maskable.svg',
  './state.jsx',
  './components.jsx',
  './ios-frame.jsx',
  './screens-dashboard.jsx',
  './screens-agenda.jsx',
  './screens-habits.jsx',
  './screens-para.jsx',
  './screens-character.jsx',
  './screens-charts.jsx',
  './screens-profile.jsx',
  './screens-workout.jsx',
  './screens-diet.jsx',
  './screens-mobile.jsx',
  './screens-login.jsx',
  './app.jsx',
  'https://unpkg.com/react@18.3.1/umd/react.development.js',
  'https://unpkg.com/react-dom@18.3.1/umd/react-dom.development.js',
  'https://unpkg.com/@babel/standalone@7.29.0/babel.min.js',
  'https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=Inter:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500;600&display=swap'
];

self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE).then(async (c) => {
      // cache core individually so one failure doesn't blow the whole install
      await Promise.all(CORE.map(async (url) => {
        try { await c.add(url); } catch (err) { console.warn('[sw] skip', url, err); }
      }));
      self.skipWaiting();
    })
  );
});

self.addEventListener('activate', (e) => {
  e.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)));
    await self.clients.claim();
  })());
});

// Cache-first with network fallback; save successful network responses back to cache.
self.addEventListener('fetch', (e) => {
  const req = e.request;
  if (req.method !== 'GET') return;
  e.respondWith((async () => {
    const cached = await caches.match(req, { ignoreSearch: false });
    if (cached) return cached;
    try {
      const res = await fetch(req);
      if (res && res.status === 200 && (res.type === 'basic' || res.type === 'cors')) {
        const clone = res.clone();
        caches.open(CACHE).then(c => c.put(req, clone)).catch(() => {});
      }
      return res;
    } catch (err) {
      // offline + not cached: fall back to the shell
      if (req.mode === 'navigate') {
        const shell = await caches.match('./EvoQuest.html');
        if (shell) return shell;
      }
      throw err;
    }
  })());
});
