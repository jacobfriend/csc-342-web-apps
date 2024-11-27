function log(...data) {
  console.log("SWv5.0", ...data);
}

log("SW Script executing - adding event listeners");

self.addEventListener("install", event => {
  log('install', event);
});

self.addEventListener('fetch', event => {
  log('fetch', event);

	// get the client (page) that is being controlled
	self.clients.get(event.clientId).then(client => {
		if(client)
			client.postMessage({url: event.request.url});
	});
		
});

self.addEventListener('message', event => {
  log('message', event.data);
  if(event.data.action === 'skipWaiting') {
    self.skipWaiting();
  }
});