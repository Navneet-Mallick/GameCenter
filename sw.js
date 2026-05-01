/**
 * ProGames07 Service Worker
 * Provides offline functionality and caching for PWA
 */

const CACHE_NAME = 'progames07-v1.0.3';
const RUNTIME_CACHE = 'progames07-runtime-v1.0.3';

// Files to cache immediately
const PRECACHE_URLS = [
  './',
  './index.html',
  './css/style.css',
  './css/games.css',
  './css/mobile.css',
  './js/main.js',
  './js/game-manager.js',
  './js/game-loader.js',
  './js/canvas-helper.js',
  './js/particles.js',
  './js/hero-animation.js',
  './js/stats.js',
  './js/achievements.js',
  './js/enhancements.js',
  './js/sound-effects.js',
  './js/pause-system.js',
  './js/music-manager.js',
  './js/settings.js',
  './js/difficulty.js',
  './js/performance-optimizer.js',
  './js/game-optimizer.js',
  './js/debug.js',
  './js/games/runner.js',
  './js/games/flappy.js',
  './js/games/tetris.js',
  './js/games/minesweeper.js',
  './js/games/snake.js',
  './js/games/breakout.js',
  './js/games/space.js',
  './manifest.json',
  './icons/icon-192x192.png',
  './icons/icon-512x512.png'
];

// Install event - cache core files
self.addEventListener('install', (event) => {
  console.log('[SW] Installing service worker...');
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('[SW] Caching app shell');
        return cache.addAll(PRECACHE_URLS);
      })
      .then(() => self.skipWaiting())
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  console.log('[SW] Activating service worker...');
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME && cacheName !== RUNTIME_CACHE) {
            console.log('[SW] Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Fetch event - serve from cache, fallback to network
self.addEventListener('fetch', (event) => {
  // Skip cross-origin requests
  if (!event.request.url.startsWith(self.location.origin)) {
    return;
  }

  // Skip chrome-extension and other non-http requests
  if (!event.request.url.startsWith('http')) {
    return;
  }

  event.respondWith(
    caches.match(event.request)
      .then(cachedResponse => {
        if (cachedResponse) {
          // Return cached version and update cache in background
          event.waitUntil(
            fetch(event.request)
              .then(response => {
                if (response && response.status === 200) {
                  return caches.open(RUNTIME_CACHE).then(cache => {
                    cache.put(event.request, response.clone());
                    return response;
                  });
                }
                return response;
              })
              .catch(() => {}) // Ignore network errors
          );
          return cachedResponse;
        }

        // Not in cache, fetch from network
        return fetch(event.request)
          .then(response => {
            // Don't cache non-successful responses
            if (!response || response.status !== 200 || response.type === 'error') {
              return response;
            }

            // Clone the response
            const responseToCache = response.clone();

            // Cache the fetched response
            caches.open(RUNTIME_CACHE)
              .then(cache => {
                cache.put(event.request, responseToCache);
              });

            return response;
          })
          .catch(() => {
            // Network failed, return offline page if available
            return caches.match('/index.html');
          });
      })
  );
});

// Background sync for future features
self.addEventListener('sync', (event) => {
  console.log('[SW] Background sync:', event.tag);
  if (event.tag === 'sync-scores') {
    event.waitUntil(syncScores());
  }
});

async function syncScores() {
  // Placeholder for future online leaderboard sync
  console.log('[SW] Syncing scores...');
}

// Push notifications for future features
self.addEventListener('push', (event) => {
  const options = {
    body: event.data ? event.data.text() : 'New game available!',
    icon: './icons/icon-192x192.png',
    badge: './icons/icon-192x192.png',
    vibrate: [200, 100, 200],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: 1
    },
    actions: [
      {
        action: 'play',
        title: 'Play Now',
        icon: './icons/icon-192x192.png'
      },
      {
        action: 'close',
        title: 'Close',
        icon: './icons/icon-192x192.png'
      }
    ]
  };

  event.waitUntil(
    self.registration.showNotification('ProGames07', options)
  );
});

// Notification click handler
self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  if (event.action === 'play') {
    event.waitUntil(
      clients.openWindow('/')
    );
  }
});

// Message handler for communication with main app
self.addEventListener('message', (event) => {
  console.log('[SW] Message received:', event.data);
  
  if (event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
  
  if (event.data.type === 'CLEAR_CACHE') {
    event.waitUntil(
      caches.keys().then(cacheNames => {
        return Promise.all(
          cacheNames.map(cacheName => caches.delete(cacheName))
        );
      })
    );
  }
});

console.log('[SW] Service Worker loaded');
