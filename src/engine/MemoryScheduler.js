/**
 * MemoryScheduler — 内存调度中枢
 *
 * 核心策略：
 *   1. 分区预算制：为音频/图片/Live2D/脚本各分配独立预算
 *   2. LRU + TTL 双重淘汰：最近最少使用 + 超时自动过期
 *   3. 内存压力感知：检测实际堆内存动态调整阈值
 *   4. 场景转换驱动 GC：章节切换时精准回收
 *   5. 后台冻结：切后台时激进回收，回前台时按需恢复
 */
import { reactive, readonly } from 'vue'

// ─── 预算配置 ──────────────────────────────────────────
const BUDGETS = {
  desktop: {
    audioBuffers: 10,          // 最多缓存 10 个解码 AudioBuffer
    audioStreamThreshold: 60,  // 超过 60 秒的音频改用流式播放
    imageCacheMB: 120,         // 图片解码缓存上限
    live2dModels: 3,           // 同时加载的 Live2D 模型数
    scriptCacheCount: 8,       // 脚本缓存章节数
    particlePoolSize: 200,     // 天气粒子对象池大小
    ttlSeconds: 600,           // 10 分钟未访问则淘汰
    gcIntervalMs: 45_000,      // GC 检查间隔
    pressureThreshold: 0.85,   // 堆内存使用率警戒线
  },
  mobile: {
    audioBuffers: 3,
    audioStreamThreshold: 30,
    imageCacheMB: 50,
    live2dModels: 1,
    scriptCacheCount: 4,
    particlePoolSize: 60,
    ttlSeconds: 180,
    gcIntervalMs: 20_000,
    pressureThreshold: 0.7,
  },
  mobileLow: {
    audioBuffers: 2,
    audioStreamThreshold: 15,
    imageCacheMB: 25,
    live2dModels: 0,
    scriptCacheCount: 3,
    particlePoolSize: 20,
    ttlSeconds: 90,
    gcIntervalMs: 15_000,
    pressureThreshold: 0.6,
  },
}

// ─── 状态 ──────────────────────────────────────────────
const _state = reactive({
  platform: 'desktop',
  audioEntries: 0,
  imageMB: 0,
  live2dModels: 0,
  scriptsCached: 0,
  gcRuns: 0,
  lastGC: 0,
  memoryPressure: 0,
  isBackgrounded: false,
  evictedTotal: 0,
})

let _budget = BUDGETS.desktop
let _gcTimer = null

// ─── 内部注册表 ────────────────────────────────────────

// 音频 LRU 缓存
const _audioLRU = new Map() // url -> { lastAccess, sizeEstimate }
let _audioCacheRef = null

// 图片追踪
const _imageTracker = new Map() // url -> { mb, lastAccess, element? }

// 脚本缓存追踪
let _scriptCacheRef = null

// Live2D 追踪
const _live2dTracker = new Map() // charId -> { lastAccess, loaded }

// 淘汰回调
const _evictionCallbacks = new Map() // subsystem -> callback(url)

// ─── 初始化 ──────────────────────────────────────────

export function initialize() {
  _detectPlatform()
  _budget = BUDGETS[_state.platform]
  _startPeriodicGC()
  _listenVisibility()
  _listenMemoryPressure()
  console.log(`[MemSched] Platform: ${_state.platform}, Budget: audio=${_budget.audioBuffers}, img=${_budget.imageCacheMB}MB, TTL=${_budget.ttlSeconds}s`)
}

function _detectPlatform() {
  const isMobile = /Android|iPhone|iPad|iPod|Mobile/i.test(navigator.userAgent)
  if (!isMobile) {
    _state.platform = 'desktop'
    return
  }
  const mem = navigator.deviceMemory || 3
  _state.platform = mem <= 3 ? 'mobileLow' : 'mobile'
}

// ─── 音频管理 ──────────────────────────────────────────

export function registerAudioCache(cacheMap) {
  _audioCacheRef = cacheMap
}

export function onAudioBufferAccess(url) {
  _audioLRU.set(url, { lastAccess: Date.now(), sizeEstimate: 0 })
  _state.audioEntries = _audioLRU.size
}

export function onAudioBufferLoaded(url, buffer) {
  const sizeEstimate = buffer ? (buffer.length * buffer.numberOfChannels * 4) / (1024 * 1024) : 0
  _audioLRU.set(url, { lastAccess: Date.now(), sizeEstimate })
  _state.audioEntries = _audioLRU.size
  _evictAudio()
}

/**
 * 判断是否应该流式播放（<audio>元素）而非解码到 AudioBuffer
 * 长音频（BGM）流式播放可节省大量内存：3分钟BGM解码后约30MB，流式约0
 */
export function shouldStreamAudio(durationSeconds) {
  return durationSeconds > _budget.audioStreamThreshold
}

function _evictAudio() {
  if (!_audioCacheRef) return
  const now = Date.now()

  // TTL 淘汰
  for (const [url, meta] of _audioLRU) {
    if (now - meta.lastAccess > _budget.ttlSeconds * 1000) {
      _audioCacheRef.delete(url)
      _audioLRU.delete(url)
      _state.evictedTotal++
    }
  }

  // LRU 淘汰
  while (_audioLRU.size > _budget.audioBuffers) {
    let oldestUrl = null, oldestTime = Infinity
    for (const [url, meta] of _audioLRU) {
      if (meta.lastAccess < oldestTime) {
        oldestTime = meta.lastAccess
        oldestUrl = url
      }
    }
    if (oldestUrl) {
      _audioCacheRef.delete(oldestUrl)
      _audioLRU.delete(oldestUrl)
      _state.evictedTotal++
    } else break
  }

  _state.audioEntries = _audioLRU.size
}

// ─── 图片管理 ──────────────────────────────────────────

export function trackImage(url, widthPx, heightPx) {
  const mb = (widthPx * heightPx * 4) / (1024 * 1024)
  _imageTracker.set(url, { mb, lastAccess: Date.now() })
  _recalcImageMB()
}

export function touchImage(url) {
  const entry = _imageTracker.get(url)
  if (entry) entry.lastAccess = Date.now()
}

export function evictImages(aggressive = false) {
  const now = Date.now()
  const targetMB = aggressive ? _budget.imageCacheMB * 0.5 : _budget.imageCacheMB

  // TTL 淘汰
  for (const [url, meta] of _imageTracker) {
    const ttl = aggressive ? _budget.ttlSeconds * 500 : _budget.ttlSeconds * 1000
    if (now - meta.lastAccess > ttl) {
      _imageTracker.delete(url)
      _state.evictedTotal++
      _fireEviction('image', url)
    }
  }

  // 超预算时 LRU 淘汰
  if (_state.imageMB > targetMB) {
    const sorted = [..._imageTracker.entries()].sort((a, b) => a[1].lastAccess - b[1].lastAccess)
    while (_state.imageMB > targetMB * 0.7 && sorted.length > 0) {
      const [url] = sorted.shift()
      _imageTracker.delete(url)
      _state.evictedTotal++
      _fireEviction('image', url)
    }
  }

  _recalcImageMB()
}

function _recalcImageMB() {
  let total = 0
  for (const [, meta] of _imageTracker) total += meta.mb
  _state.imageMB = Math.round(total * 10) / 10
}

// ─── Live2D 管理 ───────────────────────────────────────

export function onLive2DModelLoaded(charId) {
  _live2dTracker.set(charId, { lastAccess: Date.now(), loaded: true })
  _state.live2dModels = _live2dTracker.size
}

export function onLive2DModelAccess(charId) {
  const entry = _live2dTracker.get(charId)
  if (entry) entry.lastAccess = Date.now()
}

export function getLive2DEvictionList() {
  if (_live2dTracker.size <= _budget.live2dModels) return []
  const sorted = [..._live2dTracker.entries()]
    .filter(([, m]) => m.loaded)
    .sort((a, b) => a[1].lastAccess - b[1].lastAccess)
  return sorted.slice(0, sorted.length - _budget.live2dModels).map(([id]) => id)
}

export function onLive2DModelUnloaded(charId) {
  _live2dTracker.delete(charId)
  _state.live2dModels = _live2dTracker.size
}

// ─── 脚本缓存管理 ──────────────────────────────────────

export function registerScriptCache(cacheObj) {
  _scriptCacheRef = cacheObj
}

export function evictScripts(currentChapterId) {
  if (!_scriptCacheRef) return

  const keys = Object.keys(_scriptCacheRef).filter(k => _scriptCacheRef[k])
  if (keys.length <= _budget.scriptCacheCount) return

  const currentPrefix = currentChapterId ? currentChapterId.replace(/[_-].*/, '') : ''
  const evictable = keys.filter(k => {
    const prefix = k.replace(/[_-].*/, '')
    return prefix !== currentPrefix
  })

  const excess = keys.length - _budget.scriptCacheCount
  for (let i = 0; i < Math.min(excess, evictable.length); i++) {
    delete _scriptCacheRef[evictable[i]]
    _state.evictedTotal++
  }
  _state.scriptsCached = Object.keys(_scriptCacheRef).filter(k => _scriptCacheRef[k]).length
}

// ─── 对象池 ───────────────────────────────────────────

class ObjectPool {
  constructor(factory, reset, maxSize) {
    this._factory = factory
    this._reset = reset
    this._maxSize = maxSize
    this._pool = []
    this._active = 0
  }

  acquire() {
    this._active++
    if (this._pool.length > 0) {
      return this._pool.pop()
    }
    return this._factory()
  }

  release(obj) {
    this._active--
    if (this._pool.length < this._maxSize) {
      this._reset(obj)
      this._pool.push(obj)
    }
  }

  get activeCount() { return this._active }
  get poolSize() { return this._pool.length }

  drain() {
    this._pool.length = 0
  }
}

export function createParticlePool() {
  return new ObjectPool(
    () => document.createElement('span'),
    (el) => {
      el.className = ''
      el.removeAttribute('style')
    },
    _budget.particlePoolSize
  )
}

// ─── 淘汰回调注册 ─────────────────────────────────────

export function onEviction(subsystem, callback) {
  _evictionCallbacks.set(subsystem, callback)
}

function _fireEviction(subsystem, url) {
  const cb = _evictionCallbacks.get(subsystem)
  if (cb) cb(url)
}

// ─── 场景转换 ──────────────────────────────────────────

export function onSceneTransition(fromId, toId) {
  const fromPrefix = fromId ? fromId.replace(/[_-].*/, '') : ''
  const toPrefix = toId ? toId.replace(/[_-].*/, '') : ''
  const isChapterChange = fromPrefix !== toPrefix

  if (isChapterChange) {
    _evictAudio()
    evictImages(false)
    evictScripts(toId)
  }

  _state.gcRuns++
  _state.lastGC = Date.now()
}

// ─── 内存压力感知 ──────────────────────────────────────

function _listenMemoryPressure() {
  if (typeof performance === 'undefined') return

  const check = () => {
    if (performance.memory) {
      const used = performance.memory.usedJSHeapSize
      const limit = performance.memory.jsHeapSizeLimit
      _state.memoryPressure = Math.round((used / limit) * 100) / 100

      if (_state.memoryPressure > _budget.pressureThreshold) {
        console.warn(`[MemSched] Memory pressure HIGH: ${(_state.memoryPressure * 100).toFixed(0)}%`)
        _emergencyEvict()
      }
    }
  }

  setInterval(check, 10_000)
}

function _emergencyEvict() {
  _evictAudio()
  evictImages(true)
  evictScripts(null)

  const live2dEvict = getLive2DEvictionList()
  for (const charId of live2dEvict) {
    _fireEviction('live2d', charId)
  }

  _state.gcRuns++
  _state.lastGC = Date.now()
  console.warn(`[MemSched] Emergency eviction complete. Evicted total: ${_state.evictedTotal}`)
}

// ─── 后台冻结 ──────────────────────────────────────────

function _listenVisibility() {
  document.addEventListener('visibilitychange', () => {
    _state.isBackgrounded = document.hidden
    if (document.hidden) {
      _onBackground()
    }
  })
}

function _onBackground() {
  _evictAudio()
  evictImages(true)
  evictScripts(null)
  _state.gcRuns++
  _state.lastGC = Date.now()
}

// ─── 定期 GC ──────────────────────────────────────────

function _startPeriodicGC() {
  if (_gcTimer) return
  _gcTimer = setInterval(() => {
    _evictAudio()

    if (_state.imageMB > _budget.imageCacheMB * 0.8) {
      evictImages(false)
    }
  }, _budget.gcIntervalMs)
}

export function stopPeriodicGC() {
  if (_gcTimer) {
    clearInterval(_gcTimer)
    _gcTimer = null
  }
}

// ─── 报告 ─────────────────────────────────────────────

export function getReport() {
  const report = {
    platform: _state.platform,
    budget: { ..._budget },
    audio: {
      cached: _state.audioEntries,
      max: _budget.audioBuffers,
      entries: [..._audioLRU.entries()].map(([url, m]) => ({
        url: url.split('/').pop(),
        mb: m.sizeEstimate.toFixed(1),
        ageSeconds: Math.round((Date.now() - m.lastAccess) / 1000),
      })),
    },
    images: {
      tracked: _imageTracker.size,
      estimatedMB: _state.imageMB,
      maxMB: _budget.imageCacheMB,
    },
    live2d: {
      loaded: _state.live2dModels,
      max: _budget.live2dModels,
    },
    scripts: {
      cached: _state.scriptsCached,
      max: _budget.scriptCacheCount,
    },
    gc: {
      runs: _state.gcRuns,
      lastGC: _state.lastGC ? new Date(_state.lastGC).toISOString() : 'never',
      evictedTotal: _state.evictedTotal,
    },
    memoryPressure: `${(_state.memoryPressure * 100).toFixed(0)}%`,
  }

  if (performance?.memory) {
    report.heap = {
      usedMB: Math.round(performance.memory.usedJSHeapSize / 1048576),
      totalMB: Math.round(performance.memory.totalJSHeapSize / 1048576),
      limitMB: Math.round(performance.memory.jsHeapSizeLimit / 1048576),
    }
  }

  return report
}

export const state = readonly(_state)

// ─── 兼容旧接口 ──────────────────────────────────────

export { _startPeriodicGC as startPeriodicGC }
export { getReport as getMemoryReport }
