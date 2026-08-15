const CACHE_NAME = "jean-martial-v4";
const APP_SHELL = [
  "/",
  "/manifest.webmanifest",
  "/site-icon-192.png",
  "/site-icon-512.png",
  "/apple-touch-icon.png",
];

self.addEventListener("install", (event) => {
  event.waitUntil(caches.open(CACHE_NAME).then((cache) => cache.addAll(APP_SHELL)));
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(
          keys
            .filter((key) => key.startsWith("jean-martial-") && key !== CACHE_NAME)
            .map((key) => caches.delete(key)),
        ),
      )
      .then(() => self.clients.claim()),
  );
});

self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") return;
  if (new URL(event.request.url).pathname === "/sw.js") return;

  const isNavigation = event.request.mode === "navigate";
  event.respondWith(
    fetch(event.request, { cache: isNavigation ? "no-store" : "default" })
      .then((response) => {
        if (event.request.url.startsWith(self.location.origin) && response.ok) {
          caches.open(CACHE_NAME).then((cache) => cache.put(event.request, response.clone()));
        }
        return response;
      })
      .catch(() => caches.match(event.request).then((cached) => cached || caches.match("/"))),
  );
});
