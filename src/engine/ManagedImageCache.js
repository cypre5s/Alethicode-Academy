/**
 * ManagedImageCache — 可释放的图片缓存
 *
 * 解决问题：
 *   浏览器的 Image 对象一旦加载就会驻留内存直到页面卸载。
 *   传统的 `new Image()` 预加载无法真正释放。
 *   本模块通过维护一个受控的 Image 池，支持真正的内存释放。
 *
 * 策略：
 *   - 缓存 Image 对象，记录加载时间和大小
 *   - 超过预算或 TTL 时，将 src 设为空字符串释放解码内存
 *   - 需要重新加载时从网络重新获取（利用 HTTP 缓存）
 *   - 与 MemoryScheduler 集成，在内存压力时被动释放
 */

const _cache = new Map()
const _accessOrder = []

const MAX_ENTRIES_DESKTOP = 60
const MAX_ENTRIES_MOBILE = 25
const TTL_DESKTOP_MS = 10 * 60 * 1000
const TTL_MOBILE_MS = 3 * 60 * 1000

const _isMobile = /Android|iPhone|iPad|iPod|Mobile/i.test(navigator.userAgent)
const _maxEntries = _isMobile ? MAX_ENTRIES_MOBILE : MAX_ENTRIES_DESKTOP
const _ttlMs = _isMobile ? TTL_MOBILE_MS : TTL_DESKTOP_MS

export function preloadImage(src, priority = 'low') {
  if (!src) return Promise.resolve(null)

  if (_cache.has(src)) {
    _touchAccess(src)
    return Promise.resolve(_cache.get(src).img)
  }

  return new Promise((resolve) => {
    const img = new Image()
    img.decoding = 'async'
    img.fetchPriority = priority

    img.onload = () => {
      _cache.set(src, {
        img,
        loaded: Date.now(),
        lastAccess: Date.now(),
        width: img.naturalWidth,
        height: img.naturalHeight,
        estimatedMB: (img.naturalWidth * img.naturalHeight * 4) / (1024 * 1024),
      })
      _touchAccess(src)
      _evictIfNeeded()
      resolve(img)
    }
    img.onerror = () => resolve(null)
    img.src = src
  })
}

export function getImage(src) {
  const entry = _cache.get(src)
  if (entry) {
    _touchAccess(src)
    return entry.img
  }
  return null
}

function _touchAccess(src) {
  const entry = _cache.get(src)
  if (entry) entry.lastAccess = Date.now()

  const idx = _accessOrder.indexOf(src)
  if (idx >= 0) _accessOrder.splice(idx, 1)
  _accessOrder.push(src)
}

function _evictIfNeeded() {
  const now = Date.now()

  for (const [src, entry] of _cache) {
    if (now - entry.lastAccess > _ttlMs) {
      _releaseImage(src)
    }
  }

  while (_cache.size > _maxEntries && _accessOrder.length > 0) {
    const oldest = _accessOrder.shift()
    _releaseImage(oldest)
  }
}

function _releaseImage(src) {
  const entry = _cache.get(src)
  if (entry) {
    entry.img.src = ''
    entry.img.onload = null
    entry.img.onerror = null
  }
  _cache.delete(src)
  const idx = _accessOrder.indexOf(src)
  if (idx >= 0) _accessOrder.splice(idx, 1)
}

export function releaseAll() {
  for (const [src] of _cache) {
    _releaseImage(src)
  }
  _cache.clear()
  _accessOrder.length = 0
}

export function releaseUnused(keepSrcs = []) {
  const keepSet = new Set(keepSrcs)
  for (const [src] of _cache) {
    if (!keepSet.has(src)) {
      _releaseImage(src)
    }
  }
}

export function getStats() {
  let totalMB = 0
  for (const [, entry] of _cache) {
    totalMB += entry.estimatedMB
  }
  return {
    count: _cache.size,
    maxEntries: _maxEntries,
    estimatedMB: Math.round(totalMB * 10) / 10,
    ttlMs: _ttlMs,
    accessOrderLength: _accessOrder.length,
  }
}

export function onMemoryPressure() {
  const now = Date.now()
  const aggressiveTTL = _ttlMs * 0.3
  for (const [src, entry] of _cache) {
    if (now - entry.lastAccess > aggressiveTTL) {
      _releaseImage(src)
    }
  }
}

setInterval(() => _evictIfNeeded(), 30_000)
