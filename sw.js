/**
 * GameCenter - Service Worker
 * Enables offline support and caching
 */

const CACHE_NAME = 'gamecenter-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/css/style.css',
  '/css/games.css',
  '/css/mobile.css',
  '/js/main.js',
  '/js/game-manager.js',
  '/js/particles.js',
  '/js/hero-animation.js',
  '/js/stats.js',
  '/js/achievements.js',
  '/js/enhancements.js',
  '/js/sound-effects.js',
  '/js/pause-system.js',
  '/js/settings.js',
  '/js/difficulty.js',
  '/js/performance-optimizer.js'
];

// Install event
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(urlsToCache).catch(() => {
        // Silently fail if some resources can't be cached
      });
    })
  );
  self.skipWaiting();
});

// Activate event
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// Fetch event
self.addEventListener('fetch', (event) => {
  // Skip non-GET requests
  if (event.request.method !== 'GET') {
    return;
  }

  event.respondWith(
    caches.match(event.request).then((response) => {
      // Return cached response if available
      if (response) {
        return response;
      }

      // Otherwise fetch from network
      return fetch(event.request).then((response) => {
        // Don't cache non-successful responses
        if (!response || response.status !== 200 || response.type === 'error') {
          return response;
        }

        // Clone the response
        const responseToCache = response.clone();

        // Cache the response
        caches.open(CACHE_NAME).then((cache) => {
          cache.put(event.request, responseToCache);
        });

        return response;
      }).catch(() => {
        // Return offline page if available
        return caches.match('/index.html');
      });
    })
  );
});
