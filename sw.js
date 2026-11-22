// Tryb offline: najpierw sieć (zawsze świeża wersja), a gdy jej brak – kopia z pamięci.
const CACHE = 'madra-sowa-v2';
const FILES = ['./', 'index.html', 'style.css', 'data.js', 'app.js', 'icon.svg', 'icon-192.png', 'icon-512.png',
  'apple-touch-icon.png', 'manifest.webmanifest'];

self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(CACHE).then((c) => c.addAll(FILES)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (e) => {
  if (e.request.method !== 'GET') return;
  e.respondWith(
    fetch(e.request)
      .then((res) => {
        if (res.ok) {
          const copy = res.clone();
          caches.open(CACHE).then((c) => c.put(e.request, copy));
          return res;
        }
        // błąd serwera nie może nadpisać dobrej kopii
        return caches.match(e.request, { ignoreSearch: true }).then((hit) => hit || res);
      })
      .catch(() => caches.match(e.request, { ignoreSearch: true }))
  );
});
