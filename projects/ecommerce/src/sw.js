const wait = (time) =>
  new Promise((resolve) => {
    setTimeout(() => resolve(), time);
  });

let delay = 0;

self.addEventListener('message', (event) => {
  console.log('Delay updated to:', delay);
  delay = event.data;
});

self.addEventListener('fetch', function (event) {
  console.log('Fetch delay at:', delay);
  const fetchPromise = wait(delay).then(() => fetch(event.request));
  event.respondWith(fetchPromise);
});
