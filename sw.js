var CACHE_NAME = 'scannerCache';
var urlsToCache = [
  'external/instascan.js',
  'external/jquery.min.js'
];

self.addEventListener('install', function(event) {
  // Perform install steps
  event.waitUntil(
    caches.open(CACHE_NAME)
    .then(function(cache) {
      console.log('Opened cache');
      return cache.addAll(urlsToCache);
    })
  );
});