
var bestandenNaarCache = [
  "/",
  "/index.html",
  "/app.js",
  "/manifest.json",
  "javascript/script.js",
  "/style.css",
  ];

var statischeCache = "mijnpwacache"


self.addEventListener("install", function(event){
  console.log("[Service Worker] Installing Service Worker", event);
  event.waitUntil(
    caches.open(statischeCache)
    .then(function(cache){
      console.log("werkt enzo naar cache");
      cache.addAll(bestandenNaarCache);
    })
  )
});

self.addEventListener("activate", function(event){
  // console.log("[Service Worker] Activating Service Worker", event);
  // return self.clients.claim();
  event.waitUntil(
    caches.keys().then(
      function(cacheNamen){
        return Promise.all(
          cacheNamen.map(function(cacheNaam){
            if(bestandenNaarCache.indexOf(cacheNaam)=== -1){
              return caches.delete(cacheNaam);
            }
          })
        );
      })
    );
});

self.addEventListener("fetch", function(event){
  console.log("[Service Worker] Fetching something", event);
  event.respondWith(fetch(event.request));
  event.respondWith(
    caches.match(event.request)
    .then(function(response){
        if(response){
          return response;
        } else{
          return fetch (event.request);
        }
    }))

});
