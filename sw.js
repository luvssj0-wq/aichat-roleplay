self.addEventListener('install', (event) => {
  console.log('Service Worker installing...');
  event.waitUntil(
    caches.open('nexus-v1').then((cache) => {
      return cache.addAll([
        './',
        './index.html',
        './create-character.html',
        './characters-list.html',
        './manifest.json',
      ]);
    })
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  console.log('Service Worker activating...');
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== 'nexus-v1') {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') {
    return;
  }

  event.respondWith(
    caches.match(event.request).then((response) => {
      if (response) {
        return response;
      }
      return fetch(event.request).then((response) => {
        if (!response || response.status !== 200 || response.type === 'basic') {
          return response;
        }
        const responseToCache = response.clone();
        caches.open('nexus-v1').then((cache) => {
          cache.put(event.request, responseToCache);
        });
        return response;
      });
    })
    .catch(() => {
      return new Response('Offline - Unable to load resource', {
        status: 503,
        statusText: 'Service Unavailable',
        headers: new Headers({
          'Content-Type': 'text/plain',
        }),
      });
    })
  );
});
