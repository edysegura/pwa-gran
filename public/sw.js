const staticCacheName = 'static-assets-v1'
const dynamicCacheName = 'dynamic-cache-v1'

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
  const cache = await caches.open(staticCacheName)
  return cache.addAll(assetsLocation)
}

function removeOldCache(key) {
  const rePattern = new RegExp(`${staticCacheName}|${dynamicCacheName}`)
  if (!rePattern.test(key)) {
    console.log('[Service Worker] removing old cache')
    return caches.delete(key)
  }
}

async function cacheCleanup() {
  const keyList = await caches.keys()
  return Promise.all(keyList.map(removeOldCache))
}

async function fetchFromNetwork(request) {
  console.log('[Service Worker] caching new request...', request.url)
  const cache = await caches.open(dynamicCacheName)
  const response = await fetch(request)
  cache.put(request.url, response.clone())
  return response
}

async function fetchFromCache(request) {
  const response = await caches.match(request)
  if (response) {
    console.log('[Service Worker] fetched from cache...', request.url)
    return response
  }
  return fetchFromNetwork(request)
}

self.addEventListener('install', (event) => {
  console.log('[Service Worker] installing service worker...', event)
  event.waitUntil(precache())
  self.skipWaiting()
})

self.addEventListener('activate', (event) => {
  console.log('[Service Worker] activating service worker...', event)
  event.waitUntil(cacheCleanup())
  self.clients.claim()
})

self.addEventListener('fetch', (event) => {
  console.log('[Service Worker] fetch interceptor...')
  event.respondWith(fetchFromCache(event.request))
})
