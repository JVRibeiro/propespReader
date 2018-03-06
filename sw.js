var CACHE_NAME = 'scannerCache';
var urlsToCache = [
  'external/instascan.js',
  'external/jquery.min.js',
  'https://fonts.googleapis.com/icon?family=Material+Icons',
  'https://code.getmdl.io/1.3.0/material.indigo-red.min.css',
  'https://code.getmdl.io/1.3.0/material.min.js'
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