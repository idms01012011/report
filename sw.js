// sw.js แก้ paths ให้เป็น relative
const CACHE_NAME = 'service-report';
const urlsToCache = [
  'index.html',
  'manifest.json',
  'logo.jpg',
  'sw.js'
];

self.addEventListener('install', event => {
  console.log('Service Worker installing');
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Caching files');
        return cache.addAll(urlsToCache);
      })
      .catch(err => {
        console.error('Cache failed:', err);
      })
  );
});
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(response => {
      return response || fetch(event.request);
    })
  );
});
