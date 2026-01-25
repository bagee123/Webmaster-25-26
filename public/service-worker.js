// Service Worker for Coppell Community Hub
// Implements cache-first strategy for static assets and network-first for dynamic content

const CACHE_VERSION = 'v1.0.0';
const STATIC_CACHE = `static-${CACHE_VERSION}`;
const DYNAMIC_CACHE = `dynamic-${CACHE_VERSION}`;
const IMAGE_CACHE = `images-${CACHE_VERSION}`;

// Assets to cache on install
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/vite.svg',
];

// Install event - cache static assets
self.addEventListener('install', (event) => {
  console.log('Service Worker: Installing...');
  event.waitUntil(
    caches.open(STATIC_CACHE).then((cache) => {
      console.log('Service Worker: Caching static assets');
      return cache.addAll(STATIC_ASSETS).catch((err) => {
        console.warn('Service Worker: Some assets failed to cache', err);
        // Don't fail install if some assets can't be cached
        return Promise.resolve();
      });
    })
  );
  self.skipWaiting();
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  console.log('Service Worker: Activating...');
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== STATIC_CACHE && 
              cacheName !== DYNAMIC_CACHE && 
              cacheName !== IMAGE_CACHE) {
            console.log('Service Worker: Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// Fetch event - implement caching strategies
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-GET requests
  if (request.method !== 'GET') {
    return;
  }

  // Skip cross-origin requests
  if (url.origin !== location.origin) {
    return;
  }

  // Strategy 1: Cache-first for static assets (JS, CSS, fonts)
  if (request.destination === 'script' || 
      request.destination === 'style' || 
      request.destination === 'font') {
    event.respondWith(
      caches.match(request).then((response) => {
        if (response) {
          console.log('Service Worker: Cache hit for', url.pathname);
          return response;
        }
        
        return fetch(request).then((response) => {
          // Check if valid response
          if (!response || response.status !== 200 || response.type === 'error') {
            return response;
          }

          // Clone and cache the response
          const responseToCache = response.clone();
          caches.open(STATIC_CACHE).then((cache) => {
            cache.put(request, responseToCache);
          });

          return response;
        }).catch((err) => {
          console.warn('Service Worker: Fetch failed for', url.pathname, err);
          // Return offline page or cached fallback if available
          return caches.match('/index.html');
        });
      })
    );
    return;
  }

  // Strategy 2: Cache-first for images
  if (request.destination === 'image') {
    event.respondWith(
      caches.match(request).then((response) => {
        if (response) {
          console.log('Service Worker: Image cache hit for', url.pathname);
          return response;
        }

        return fetch(request).then((response) => {
          if (!response || response.status !== 200 || response.type === 'error') {
            return response;
          }

          const responseToCache = response.clone();
          caches.open(IMAGE_CACHE).then((cache) => {
            cache.put(request, responseToCache);
          });

          return response;
        }).catch(() => {
          // Return placeholder or cached version
          return caches.match(request);
        });
      })
    );
    return;
  }

  // Strategy 3: Network-first for HTML and other requests
  event.respondWith(
    fetch(request)
      .then((response) => {
        // Don't cache error responses
        if (!response || response.status !== 200 || response.type === 'error') {
          return response;
        }

        const responseToCache = response.clone();
        caches.open(DYNAMIC_CACHE).then((cache) => {
          cache.put(request, responseToCache);
        });

        return response;
      })
      .catch(() => {
        // Fallback to cache on network error
        return caches.match(request).then((response) => {
          if (response) {
            console.log('Service Worker: Fallback to cache for', url.pathname);
            return response;
          }
          // Return index.html as offline fallback
          return caches.match('/index.html');
        });
      })
  );
});

// Handle messages from clients
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});
