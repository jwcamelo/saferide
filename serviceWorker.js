const staticSafeRide = "safe-ride-alert-v1"
const assets = [
  "/",
  "/index.html",
  "/style.css",
  "/script.js",
  "/img/gps.png",
  "/img/refresh.png",
  "/img/saferide.png",
];

self.addEventListener("install", installEvent => {
  installEvent.waitUntil(
    caches.open(staticSafeRide).then(cache => {
      cache.addAll(assets)
    })
  )
});

self.addEventListener("fetch", fetchEvent => {
    fetchEvent.respondWith(
      caches.match(fetchEvent.request).then(res => {
        return res || fetch(fetchEvent.request)
      })
    )
  });