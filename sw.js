const CACHE = "memorial-v1";

self.addEventListener("install", (e) => {
  e.waitUntil(
    caches.open(CACHE).then((cache) =>
      cache.addAll([
        "/", 
        "/Memoire/",
        "index.html",
        "styles/base.css",
        "styles/index.css",
        "scripts/password.js",
        "scripts/menu.js",
        "scripts/gallery-loader.js",
        "assets/config/password.json",
        "assets/images/left-wing.png",
        "assets/images/right-wing.png"
      ])
    )
  );
  self.skipWaiting();
});

self.addEventListener("fetch", (e) => {
  e.respondWith(
    caches.match(e.request).then((res) => res || fetch(e.request))
  );
});
