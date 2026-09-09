const CACHE = 'vzatsu-v2';
// アイコンとmanifestだけキャッシュする。HTMLは常にネットワークから取る。
const FILES = ['/vzatsu/manifest.json', '/vzatsu/icon-512.png', '/vzatsu/icon-192.png'];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(FILES)));
  self.skipWaiting();
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', e => {
  const url = e.request.url;
  if (url.includes('googleapis.com') || url.includes('holodex.net')) return;

  // HTML（ページ本体）はネットワーク優先。更新が必ず反映される。
  if (e.request.mode === 'navigate' || url.endsWith('.html') || url.endsWith('/vzatsu/')) {
    e.respondWith(fetch(e.request).catch(() => caches.match(e.request)));
    return;
  }

  // それ以外（アイコン等）はキャッシュ優先。
  e.respondWith(caches.match(e.request).then(r => r || fetch(e.request)));
});
