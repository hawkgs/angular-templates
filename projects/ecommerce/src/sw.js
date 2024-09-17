// Keeps the currently set fetch delay
let delay = 0;

function wait(time) {
  return new Promise((resolve) => {
    setTimeout(() => resolve(), time);
  });
}

function addCacheControlHeader(event) {
  const headers = new Headers(event.request.headers);
  headers.set('Cache-Control', 'no-cache');

  return new Request(event.request, {
    mode: 'cors',
    credentials: 'omit',
    headers: headers,
  });
}

self.addEventListener('message', (event) => {
  console.log('Delay updated to:', delay);
  delay = event.data;
});

self.addEventListener('fetch', function (event) {
  console.log('Fetch delay at:', delay);
  const noCacheRequest = addCacheControlHeader(event);
  const fetchPromise = wait(delay).then(() => fetch(noCacheRequest));
  event.respondWith(fetchPromise);
});
