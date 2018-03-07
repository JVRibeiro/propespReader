/* jshint esversion: 6 */

let CACHE_NAME = 'scannerCache?v=0.0.30';
let urlsToCache = [
  '/',
  'js/scanner.js',
  'css/material-icons.css',
  'fonts/material-icons.woff2',
  'css/material.indigo-green.min.css',
  'external/material.min.js',
  'external/jquery.min.js',
  'external/instascan.min.js',
  'external/cripto-aes.min.js'
];

self.addEventListener('install', function(event) {
  // Perform install steps
  event.waitUntil(
    caches.open(CACHE_NAME)
    .then(function(cache) {
      // Cache armazenado
      console.log('Opened cache');
      return cache.addAll(urlsToCache);
    })
  );

  self.skipWaiting();
});




self.addEventListener('fetch', function(event) {
  event.respondWith(
    caches.match(event.request)
    .then(function(response) {
      // Cache hit - return response
      if (response) {
        console.log('Update cache');
        return response;
      }

      // IMPORTANT: Clone the request. A request is a stream and
      // can only be consumed once. Since we are consuming this
      // once by cache and once by the browser for fetch, we need
      // to clone the response.
      let fetchRequest = event.request.clone();

      return fetch(fetchRequest).then(
        function(response) {
          // Check if we received a valid response
          if (!response || response.status !== 200 || response.type !== 'basic') {
            // Code if not online
            alert('Você está offline.');
            return response;
          }

          // Code if online

          // IMPORTANT: Clone the response. A response is a stream
          // and because we want the browser to consume the response
          // as well as the cache consuming the response, we need
          // to clone it so we have two streams.
          let responseToCache = response.clone();

          caches.open(CACHE_NAME)
            .then(function(cache) {
              cache.put(event.request, responseToCache);
            });

          return response;
        }
      );
    })
  );
});




// listen to the service worker promise in index.html to see if there has been a new update.
// condition: the service-worker.js needs to have some kind of change - e.g. increment CACHE_VERSION.
self.addEventListener('isUpdateAvailable')
  .then(isAvailable => {
    if (isAvailable) {
      alert('Update available');
    }
  });