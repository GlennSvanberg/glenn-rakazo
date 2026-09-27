// Minimal installability service worker: lifecycle only, no precache.
//
// This file exists so the web app meets the browser installability
// requirement (web manifest + a service worker with a fetch handler).
// Every request passes through to the network untouched, so there is no
// stale-cache risk. Offline support is a separate, later step.

self.addEventListener("install", (event) => {
  event.waitUntil(self.skipWaiting());
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    (async () => {
      for (const key of await caches.keys()) {
        if (key.startsWith("rakazo-")) await caches.delete(key);
      }
      await self.clients.claim();
    })(),
  );
});

self.addEventListener("fetch", (event) => {
  event.respondWith(fetch(event.request));
});
