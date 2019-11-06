'use strict';

const CACHE_NAME = 'static-cache-v4';

self.addEventListener('install', (evt) => {
  console.log('[ServiceWorker] Install');
  self.skipWaiting();
});

self.addEventListener('activate', (evt) => {
  console.log('[ServiceWorker] Activate');
  evt.waitUntil(
    caches.keys().then((keyList) => {
      return Promise.all(keyList.map((key) => {
        if (key !== CACHE_NAME) {
          console.log('[ServiceWorker] Removing old cache', key);
          return caches.delete(key);
        }
      }));
    })
  );
  // const clearCache = async () => {
  //   let keyList = await caches.keys()
  //   keyList.map(async (key) => {
  //     if (key !== CACHE_NAME) {
  //       console.log('[ServiceWorker] Removing old cache', key)
  //       await caches.delete(key)
  //     }
  //   })

  // }
  self.clients.claim();
});

self.addEventListener('fetch', (e) => {
  e.respondWith(
    caches.match(e.request).then((r) => {
      console.log('[Service Worker] Fetching resource: ' + e.request.url);
      return r || fetch(e.request).then((response) => {
        return caches.open(CACHE_NAME).then((cache) => {
          console.log('[Service Worker] Caching new resource: ' + e.request.url);
          cache.put(e.request, response.clone());
          return response;
        });
      });
    })
  );

  // const cachefirst = async () => {
  //   let r = await caches.match(e.request)
  //   console.log('[Service Worker] Fetching resource: ' + e.request.url);
  //   if (r) { return r }

  //   r = await fetch(e.request)
  //   const cache = await caches.open(CACHE_NAME)
  //   console.log('[Service Worker] Caching new resource: ' + e.request.url);
  //   await cache.put(e.request, r.clone())
  //   return r
  // }
});
