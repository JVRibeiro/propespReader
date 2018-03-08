/* jshint esversion: 6 */

let CACHE_VERSION = '0.0.58';
let CACHE_NAME = 'scannerCache';
let urlsToCache = [
  'index.html',
  'js/scanner.js',
  'css/material-icons.css',
  'fonts/material-icons.woff2',
  'css/material.indigo-green.min.css',
  'external/material.min.js',
  'external/jquery.min.js',
  'external/instascan.min.js',
  'external/cripto-aes.min.js'
];

// clear old caches
function clearOldCaches() {
  return caches.keys()
    .then(keylist => {
      console.log('old cache clear.');

      return Promise.all(
        keylist
        .filter(key => key !== CACHE_NAME)
        .map(key => caches.delete(key))
      );
    });
}


self.addEventListener('install', function (event) {
  // Perform install steps
  event.waitUntil(
    caches.open(CACHE_NAME)
    .then(function (cache) {
      // Cache armazenado
      console.log('service worker: install ' + CACHE_VERSION);
      return cache.addAll(urlsToCache);
    })
  );

  self.skipWaiting();
});

// application activated
self.addEventListener('activate', event => {

  console.log('service worker: activate');

  // delete old caches
  event.waitUntil(
    clearOldCaches()
    .then(() => self.clients.claim())
  );

});




self.addEventListener('fetch', function (event) {
  event.respondWith(
    caches.match(event.request)
    .then(function (response) {
      // Cache hit - return response
      if (response) {
        // return cached file
        //console.log('cache fetch: ' + url);
        return response;
      }

      // IMPORTANT: Clone the request. A request is a stream and
      // can only be consumed once. Since we are consuming this
      // once by cache and once by the browser for fetch, we need
      // to clone the response.
      let fetchRequest = event.request.clone();

      return fetch(fetchRequest).then(
        function (response) {
          // Check if we received a valid response
          if (!response || response.status !== 200 || response.type !== 'basic') {
            return response;
          }

          // Code if online

          // IMPORTANT: Clone the response. A response is a stream
          // and because we want the browser to consume the response
          // as well as the cache consuming the response, we need
          // to clone it so we have two streams.
          let responseToCache = response.clone();

          caches.open(CACHE_NAME).then(function (cache) {
            cache.put(event.request, responseToCache);
          });

          return response;
        }
      );
    })
  );
});
