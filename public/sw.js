const CACHE_VERSION = 2
const CACHE_NAME = `alethicode-v${CACHE_VERSION}`
const STATIC_CACHE = `alethicode-static-v${CACHE_VERSION}`
const AUDIO_CACHE = `alethicode-audio-v${CACHE_VERSION}`
const IMAGE_CACHE = `alethicode-img-v${CACHE_VERSION}`

const STATIC_ASSETS = [
  '/',
  '/index.html',
]

const MAX_AUDIO_CACHE_ITEMS = 60
const MAX_IMAGE_CACHE_ITEMS = 200

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(STATIC_CACHE).then(cache => cache.addAll(STATIC_ASSETS))
  )
  self.skipWaiting()
})

self.addEventListener('activate', (event) => {
  const keepCaches = new Set([STATIC_CACHE, AUDIO_CACHE, IMAGE_CACHE])
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => !keepCaches.has(k)).map(k => caches.delete(k)))
    )
  )
  self.clients.claim()
})

self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url)
  if (event.request.method !== 'GET') return
  if (url.origin !== self.location.origin) return

  if (/\.(webp|svg|png|jpg|jpeg|gif)$/i.test(url.pathname)) {
    event.respondWith(cacheFirstWithLimit(event.request, IMAGE_CACHE, MAX_IMAGE_CACHE_ITEMS))
  } else if (/\.(mp3|ogg|wav|m4a)$/i.test(url.pathname)) {
    event.respondWith(cacheFirstWithLimit(event.request, AUDIO_CACHE, MAX_AUDIO_CACHE_ITEMS))
  } else if (/\.(js|css)$/i.test(url.pathname) && url.pathname.includes('/assets/')) {
    event.respondWith(staleWhileRevalidate(event.request, STATIC_CACHE))
  } else if (url.pathname === '/' || url.pathname === '/index.html') {
    event.respondWith(networkFirst(event.request, STATIC_CACHE))
  }
})

async function cacheFirstWithLimit(request, cacheName, maxItems) {
  const cache = await caches.open(cacheName)
  const cached = await cache.match(request)
  if (cached) return cached

  try {
    const response = await fetch(request)
    if (response.ok) {
      const cloned = response.clone()
      trimCache(cacheName, maxItems - 1).then(() => {
        cache.put(request, cloned)
      })
    }
    return response
  } catch {
    return new Response('', { status: 503, statusText: 'Offline' })
  }
}

async function staleWhileRevalidate(request, cacheName) {
  const cache = await caches.open(cacheName)
  const cached = await cache.match(request)
  const fetchPromise = fetch(request).then(response => {
    if (response.ok) cache.put(request, response.clone())
    return response
  }).catch(() => cached || new Response('', { status: 503 }))
  return cached || fetchPromise
}

async function networkFirst(request, cacheName) {
  try {
    const response = await fetch(request)
    if (response.ok) {
      const cache = await caches.open(cacheName)
      cache.put(request, response.clone())
    }
    return response
  } catch {
    const cached = await caches.match(request)
    return cached || new Response('Offline', { status: 503 })
  }
}

async function trimCache(cacheName, maxItems) {
  const cache = await caches.open(cacheName)
  const keys = await cache.keys()
  if (keys.length <= maxItems) return
  const toDelete = keys.slice(0, keys.length - maxItems)
  await Promise.all(toDelete.map(k => cache.delete(k)))
}

self.addEventListener('message', (event) => {
  if (event.data === 'skipWaiting') {
    self.skipWaiting()
  }
  if (event.data?.type === 'PREFETCH') {
    const urls = event.data.urls || []
    caches.open(IMAGE_CACHE).then(cache => {
      for (const url of urls) {
        cache.match(url).then(cached => {
          if (!cached) fetch(url).then(r => { if (r.ok) cache.put(url, r) }).catch(() => {})
        })
      }
    })
  }
})
