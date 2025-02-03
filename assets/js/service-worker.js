// Cache Name
const CACHE_NAME = "expense-tracker-v1";

// Assets to Cache
const ASSETS_TO_CACHE = [
  "/",
  "/index.html",
  "/about-us.html",
  "/features.html",
  "/assets/css/main.css",
  "/assets/css/features.css",
  "/assets/js/main.js",
  "/assets/js/features.js",
  "/assets/js/service-worker.js",
  "/manifest.json",
  "/readme.txt",
  "/assets/img",
];

// Install the Service Worker and Cache Assets
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log("Caching assets...");
      return cache.addAll(ASSETS_TO_CACHE);
    })
  );
});

// Activate the Service Worker and Clean Up Old Caches
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cache) => {
          if (cache !== CACHE_NAME) {
            console.log("Deleting old cache:", cache);
            return caches.delete(cache);
          }
        })
      );
    })
  );
});

// Fetch Cached Assets When Offline
self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      // Return cached response if available, otherwise fetch from the network
      return cachedResponse || fetch(event.request);
    })
  );
});
