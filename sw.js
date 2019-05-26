var CACHE_VERSION = 16;
var CACHE_STATIC_NAME = 'static-v' + CACHE_VERSION;
var CACHE_DYNAMIC_NAME = 'dynamic-v' + CACHE_VERSION;

self.addEventListener('install', function(event) {
  self.skipWaiting();
  console.log(
    '[Service Worker] Installing Service Worker ...',
    event
  );
  event.waitUntil(
    caches.open(CACHE_STATIC_NAME).then(function(cache) {
      console.log('[Service Worker] Precaching App Shell...');
      cache.addAll([
        '/pomodoro/',
        '/pomodoro/index.html',
        '/pomodoro/style.css',
        '/pomodoro/script.js',
        '/pomodoro/app.js',
        '/pomodoro/audio.mp3',
        '/pomodoro/todo.html'
      ]);
    })
  );
});

self.addEventListener('activate', function(event) {
  console.log(
    '[Service Worker] Activating Service Worker ....',
    event
  );
  event.waitUntil(
    caches.keys().then(function(keyList) {
      return Promise.all(
        keyList.map(function(key) {
          if (key != CACHE_STATIC_NAME && key != CACHE_DYNAMIC_NAME) {
            console.log(
              '[Service Worker] Removing old cache...',
              key
            );
            return caches.delete(key);
          }
        })
      );
    })
  );
  return self.clients.claim();
});

self.addEventListener('fetch', function(event) {
  event.respondWith(
    caches
      .match(event.request)
      .then(res => {
        if (res) {
          return res;
        } else {
          return fetch(event.request)
            .then(function(res) {
              return caches.open(CACHE_DYNAMIC_NAME).then(function(cache) {
                cache.put(event.request, res.clone());
                return res;
              });
            })
            .catch(function() {});
        }
      })
      .catch(() => {
        return fetch(event.request)
          .then(function(res) {
            return caches.open(CACHE_DYNAMIC_NAME).then(function(cache) {
              cache.put(event.request, res.clone());
              return res;
            });
          })
          .catch(function() {});
      })
  );
});
