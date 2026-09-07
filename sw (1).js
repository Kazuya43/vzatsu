const CACHE = 'vzatsu-v1';
const FILES = ['/vzatsu/', '/vzatsu/index.html', '/vzatsu/manifest.json', '/vzatsu/icon-512.png', '/vzatsu/icon-192.png'];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(FILES)));
  self.skipWaiting();
});

self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(keys =>
    Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
  ));
});

self.addEventListener('fetch', e => {
  if (e.request.url.includes('googleapis.com') || e.request.url.includes('holodex.net')) return;
  e.respondWith(caches.match(e.request).then(r => r || fetch(e.request)));
});
