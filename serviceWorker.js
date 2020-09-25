const staticCacheName = "color-picker-v1";
const staticCacheAssets = [
    "/",
    "/index.html",
    "/src/main.css",
    "/src/wtf-forms.css",
    "/src/main.js",
    "/images/dropper.png",
    "/images/dropper3.png",
    "/images/icons/favicon.ico",
    "https://cdnjs.cloudflare.com/ajax/libs/materialize/1.0.0/css/materialize.min.css",
    "https://fonts.googleapis.com/icon?family=Material+Icons",
    "https://fonts.googleapis.com/css2?family=Courier+Prime:ital,wght@0,400;0,700;1,400;1,700&display=swap",
    "https://cdnjs.cloudflare.com/ajax/libs/materialize/1.0.0/js/materialize.min.js",
    "https://cdnjs.cloudflare.com/ajax/libs/color-thief/2.3.0/color-thief.umd.js"
]

self.addEventListener("install", event => {
    event.waitUntil(
        caches.open(staticCacheName)
        .then( cache => cache.addAll(staticCacheAssets))
    );
});

self.addEventListener("activate", event => {
    event.waitUntil(
        caches.keys()
        .then( cacheNames => {
            return Promise.all(
                cacheNames.filter(cache => cache != staticCacheName)
                .map(cache => caches.delete(cache))
            );
        })
    );
});

self.addEventListener("fetch", event => {
    event.respondWith(
        caches.match(event.request)
        .then( response => response || fetch(event.request))
        .catch( err => caches.match("/index.html"))
    );
});