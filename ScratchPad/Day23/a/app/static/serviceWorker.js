const STATIC_CACHE_NAME = 'ncparks-static-v4';

function log(...data) {
  console.log("SWv4.0", ...data);
}

function fetchAndCache(request) {
  return fetch(request).then((response) => {
    if (response.ok && request.method == 'GET') {
      caches.open(STATIC_CACHE_NAME).then((cache) => {
        cache.put(request, response);
      })
    }
    return response.clone();
  });
}

function cacheFirst(request) {
  return caches.match(request).then(response => {
    if (response) {
      return response;
    }
    else {
      return fetchAndCache(request);
    }
  }).catch((error) => {
    return caches.match('/offline');
  });
}

log("SW Script executing - adding event listeners");

self.addEventListener('install', event => {
  log('install', event);

  // As soon as this method returns, the service worker is considered installed
  event.waitUntil(
    caches.open(STATIC_CACHE_NAME).then((cache) => {
      return cache.addAll([
        '/',
        '/offline',
        '/css/base.css',
        '/css/error.css',
        '/css/home.css',
        '/css/login.css',
        '/css/offline.css',
        '/css/park.css',
        'img/ncparkmap.png',
        'img/park.jpg',
        '/js/APIClient.js',
        '/js/auth.js',
        '/js/common.js',
        '/js/home.js',
        '/js/HTTPClient.js',
        '/js/login.js',
        '/js/park.js',
        'https://unpkg.com/leaflet@1.9.1/dist/leaflet.css',
        'https://unpkg.com/leaflet@1.9.1/dist/leaflet.js',
        'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.2.0/css/all.min.css',
      ]);
    })
  );
});

self.addEventListener('activate', event => {
  log('activate', event);
  // As soon as this method returns, the service worker is considered active
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.filter(cacheName => 
          cacheName.startsWith('ncparks-') && cacheName != STATIC_CACHE_NAME
        ).then(oldCaches => {
          return Promise.all(
            oldCaches.map(cacheName => {
              return caches.delete(cacheName);
            })
          )
        })
      )
    })
  )
});


self.addEventListener('fetch', event => {
  event.respondWith(cacheFirst(event.request));
});



self.addEventListener('message', event => {
  log('message', event.data);
  if(event.data.action === 'skipWaiting') {
    self.skipWaiting();
  }
});
