var CACHE_NAME = 'scannerCache';
var urlsToCache = [
  'index.html',
  'external/instascan.js',
  'external/jquery.min.js',
  'css/material-icons.css',
  'css/material.indigo-red.min.css',
  'external/material.min.js'
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