const CACHE_NAME = "depa-fx-p8-3-v1";
const APP_SHELL = [
  "./",
  "./index.html",
  "./manifest.webmanifest",
  "./icon-192.png",
  "./icon-512.png",
  "./icon-maskable-512.png",
  "./apple-touch-icon.png"
];

self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(APP_SHELL))
  );
});

self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys()
      .then(keys => Promise.all(
        keys.map(key => key === CACHE_NAME ? null : caches.delete(key))
      ))
      .then(() => self.clients.claim())
  );
});

self.addEventListener("message", event => {
  if (event.data && event.data.type === "SKIP_WAITING") {
    self.skipWaiting();
  }
});

self.addEventListener("fetch", event => {
  const request = event.request;

  if (request.method !== "GET") return;

  const url = new URL(request.url);

  // Market/API traffic must always go to the network.
  // Never serve cached cross-origin financial data.
  if (url.origin !== self.location.origin) {
    event.respondWith(fetch(request));
    return;
  }

  if (request.mode === "navigate") {
    event.respondWith(
      fetch(request)
        .then(response => {
          const copy = response.clone();
          caches.open(CACHE_NAME).then(cache => cache.put("./index.html", copy));
          return response;
        })
        .catch(() =>
          caches.match(request)
            .then(cached => cached || caches.match("./index.html"))
        )
    );
    return;
  }

  event.respondWith(
    caches.match(request)
      .then(cached => {
        if (cached) return cached;

        return fetch(request).then(response => {
          if (!response || response.status !== 200 || response.type === "opaque") {
            return response;
          }

          const copy = response.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(request, copy));
          return response;
        });
      })
  );
});


self.addEventListener("notificationclick", event => {
  event.notification.close();

  const target = event.notification &&
    event.notification.data &&
    event.notification.data.url
      ? event.notification.data.url
      : "./#watch";

  event.waitUntil(
    clients.matchAll({ type:"window", includeUncontrolled:true })
      .then(list => {
        for (const client of list) {
          if ("focus" in client) {
            if ("navigate" in client) {
              return client.navigate(target).then(() => client.focus());
            }
            return client.focus();
          }
        }
        if (clients.openWindow) return clients.openWindow(target);
        return undefined;
      })
  );
});
