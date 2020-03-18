const cacheName = 'static-assets-v1'
const assetsLocation = [
  '/',
  '/index.html',
  '/src/js/app.js',
  '/src/js/feed.js',
  '/src/js/material.min.js',
  '/src/css/app.css',
  '/src/css/feed.css',
  '/src/images/main-image.jpg',
  'https://fonts.googleapis.com/css?family=Roboto:400,700',
  'https://fonts.googleapis.com/icon?family=Material+Icons',
  'https://cdnjs.cloudflare.com/ajax/libs/material-design-lite/1.3.0/material.indigo-pink.min.css',
]

async function precache() {
  console.log('[Service Worker] precaching assets...')
  const cache = await caches.open(cacheName)
  const cache = await caches.open(staticCacheName)
  return cache.addAll(assetsLocation)
}

async function fetchFromCacheWhenAvailable(request) {
  const response = await caches.match(request)
  if (response) {
    return response
  }
  return fetch(request)
}

self.addEventListener('install', (event) => {
  console.log('[Service Worker] installing service worker...', event)
  event.waitUntil(precache())
})

self.addEventListener('activate', (event) => {
  console.log('[Service Worker] activating service worker...', event)
  return self.clients.claim()
})

self.addEventListener('fetch', (event) => {
  console.log('[Service Worker] fetch interceptor...', event.request.url)
  event.respondWith(fetch(event.request))
})
