function log(...data) {
  console.log("SWv1.0", ...data);
}

log("SW Script executing - adding event listeners");

const STATIC_CACHE_NAME = "plant-static-v1";

self.addEventListener("install", (event) => {
  log("install", event);
  event.waitUntil(
    caches.open(STATIC_CACHE_NAME).then((cache) => {
      return cache.addAll([
        "/",
        "/offline",
        "/plants",
        "/create",
        "/stats",
        "/error",
      ]);
    })
  );
});

self.addEventListener("activate", (event) => {
  log("activate", event);
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((cacheName) => {
            return (
              cacheName.startsWith("plant-") && cacheName != STATIC_CACHE_NAME
            );
          })
          .map((cacheName) => {
            return caches.delete(cacheName);
          })
      );
    })
  );
});

self.addEventListener("fetch", (event) => {
  var requestUrl = new URL(event.request.url);

  // Check for JPG images and respond with cache-first strategy
  if (requestUrl.pathname.endsWith(".jpg")) {
    event.respondWith(cacheFirst(event.request));
    return;
  }

  // Treat API calls (to our API) differently
  if (
    requestUrl.origin === location.origin &&
    requestUrl.pathname.startsWith("/api")
  ) {
    //If we are here, we are intercepting a call to our API
    if (event.request.method === "GET") {
      // Only intercept (and cache) GET API requests
      event.respondWith(networkFirst(event.request));
    }
  } else {
    // If we are here, this was not a call to our API
    event.respondWith(networkFirst(event.request));
  }
});

function cacheFirst(request) {
  return caches
    .match(request)
    .then((response) => {
      //Return a response if we have one cached. Otherwise, get from the network
      return response || fetchAndCache(request);
    })
    .catch((error) => {
      return caches.match("/offline");
    });
}

function networkFirst(request) {
  return fetchAndCache(request).catch((error) => {
    // Try to return from cache
    return caches.match(request).then((cachedResponse) => {
      if (cachedResponse) {
        return cachedResponse;
      }
      console.warn("No cache match for:", request.url);
      // Explicitly return the offline page if no cache match
      notifyClientForOffline();
      return new Response("", { status: 503 });
    });
  });
}

function notifyClientForOffline() {
  self.clients.matchAll({ type: "window" }).then((clients) => {
    if (clients && clients.length) {
      clients.forEach((client) => {
        client.postMessage({ action: "navigateOffline" });
      });
    }
  });
}

function fetchAndCache(request) {
  return fetch(request).then((response) => {
    var requestUrl = new URL(request.url);
    // Cache successful GET requests that are not browser extensions
    if (
      response.ok &&
      request.method === "GET" &&
      !requestUrl.protocol.startsWith("chrome-extension")
    ) {
      caches.open(STATIC_CACHE_NAME).then((cache) => {
        cache.put(request, response);
      });
    }
    return response.clone();
  });
}

self.addEventListener("message", (event) => {
  log("message", event.data);
  if (event.data.action === "skipWaiting") {
    self.skipWaiting();
  }
});

/********************\
  * PUSH NOTIFICATIONS *
  \********************/

// function addPushNotificationToLocalStorage(data) {
//   self.clients.matchAll({ type: "window" }).then((clients) => {
//     if (clients && clients.length) {
//       clients.forEach((client) => {
//         client.postMessage({ action: "push", message: data });
//       });
//     }
//   });
// }

self.addEventListener("push", (event) => {
  let message = event.data.json();
  log("push", message);
  self.registration.showNotification(message.title, {
    body: message.body,
    icon: `/logo.svg`,
  });
  //   addPushNotificationToLocalStorage(message);
});

self.addEventListener("notificationclick", (event) => {
  log("notificationclick", event);
  event.notification.close();
  event.waitUntil(self.clients.openWindow(self.location.origin));
});
