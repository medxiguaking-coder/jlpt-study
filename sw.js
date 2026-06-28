const CACHE = 'jlpt-v31';
const ASSETS = [
  '/style.css?v=31',
  '/app.js?v=31',
  '/data/vocab.js?v=31',
  '/data/grammar.js?v=31',
  '/data/grammar_compare.js?v=31',
  '/data/keigo.js?v=31',
  '/data/srs.js?v=31'
];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(ASSETS)));
  // Activate immediately without waiting
  self.skipWaiting();
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', e => {
  const url = new URL(e.request.url);
  // Never cache HTML — always fetch fresh from network
  if (url.pathname === '/' || url.pathname.endsWith('.html')) {
    e.respondWith(fetch(e.request).catch(() => caches.match(e.request)));
    return;
  }
  e.respondWith(caches.match(e.request).then(r => r || fetch(e.request)));
});
