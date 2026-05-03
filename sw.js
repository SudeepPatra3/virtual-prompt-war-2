const CACHE_NAME = 'civic-ai-v1';
const ASSETS_TO_CACHE = [
  '/',
  '/index.html',
  '/style.css',
  '/utils.js',
  '/script.js'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(ASSETS_TO_CACHE))
  );
});

self.addEventListener('fetch', event => {
  // Pass through non-GET requests and API calls
  if (event.request.method !== 'GET' || event.request.url.includes('generativelanguage')) return;
  
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        return response || fetch(event.request).then(fetchRes => {
            return caches.open(CACHE_NAME).then(cache => {
                cache.put(event.request.url, fetchRes.clone());
                return fetchRes;
            });
        });
      })
  );
});
