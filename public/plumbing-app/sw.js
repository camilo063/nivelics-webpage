// 45 Minutes Plumbing Supply — service worker
// Cambia CACHE_VERSION cada vez que subas cambios para que los celulares descarguen la versión nueva.
const CACHE_VERSION = '45min-v1';
const APP_SHELL = [
  './', './index.html', './manifest.webmanifest', './favicon.ico',
  './assets/logo.jpg', './assets/van.jpg', './assets/store.jpg', './assets/site.jpg',
  './icons/icon-192.png', './icons/icon-512.png', './icons/icon-maskable-512.png', './icons/apple-touch-icon.png'
];

self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(CACHE_VERSION).then((c) => c.addAll(APP_SHELL)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== CACHE_VERSION).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (e) => {
  const req = e.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  // Páginas: red primero (para ver cambios), caché si no hay conexión
  if (req.mode === 'navigate') {
    e.respondWith(fetch(req).catch(() => caches.match('./index.html')));
    return;
  }
  // Archivos propios y Google Fonts: caché primero, red de respaldo
  if (url.origin === location.origin || url.host.endsWith('googleapis.com') || url.host.endsWith('gstatic.com')) {
    e.respondWith(
      caches.match(req).then((hit) => hit || fetch(req).then((res) => {
        if (res.ok || res.type === 'opaque') {
          const copy = res.clone();
          caches.open(CACHE_VERSION).then((c) => c.put(req, copy));
        }
        return res;
      }))
    );
  }
});
