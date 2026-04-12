import { getBackgroundEntry } from '../data/locations.js'
import { getCharacterSprite, getLive2DModelPath } from '../data/characterSprites.js'
import { getAudioAssetPath } from './audioCatalog.js'

const _preloaded = new Set()
const _audioPreloaded = new Set()
const _live2dPreloaded = new Set()
const _preloadQueue = []
let _isProcessing = false
const LOOKAHEAD = 30
const CONCURRENT_LOADS = 6
const AUDIO_LOOKAHEAD = 10

const requestIdleCallback = typeof window !== 'undefined' && window.requestIdleCallback
  ? window.requestIdleCallback
  : (fn) => setTimeout(fn, 16)

function _preloadImage(src, priority = 'low') {
  if (!src || _preloaded.has(src)) return
  _preloaded.add(src)
  if (priority === 'high') {
    const link = document.createElement('link')
    link.rel = 'preload'
    link.as = 'image'
    link.href = src
    link.fetchPriority = 'high'
    document.head.appendChild(link)
    setTimeout(() => link.remove(), 30000)
  } else {
    _preloadQueue.push(src)
    _processQueue()
  }
}

function _preloadAudio(src, priority = 'low') {
  if (!src || _audioPreloaded.has(src)) return
  _audioPreloaded.add(src)
  if (priority === 'high') {
    const link = document.createElement('link')
    link.rel = 'preload'
    link.as = 'fetch'
    link.href = src
    link.crossOrigin = 'anonymous'
    document.head.appendChild(link)
    setTimeout(() => link.remove(), 60000)
  } else {
    requestIdleCallback(() => {
      fetch(src, { mode: 'cors', priority: 'low' }).catch(() => {})
    })
  }
}

function _processQueue() {
  if (_isProcessing || _preloadQueue.length === 0) return
  _isProcessing = true
  const batch = _preloadQueue.splice(0, CONCURRENT_LOADS)
  let pending = batch.length
  for (const src of batch) {
    const img = new Image()
    img.decoding = 'async'
    img.fetchPriority = 'low'
    img.onload = img.onerror = () => {
      pending--
      if (pending <= 0) {
        _isProcessing = false
        if (_preloadQueue.length > 0) requestIdleCallback(() => _processQueue())
      }
    }
    img.src = src
  }
}

export function preloadForScript(script, startIndex) {
  if (!script || !script.length) return
  const end = Math.min(startIndex + LOOKAHEAD, script.length)
  const audioEnd = Math.min(startIndex + AUDIO_LOOKAHEAD, script.length)

  for (let i = startIndex; i < end; i++) {
    const cmd = script[i]
    if (!cmd) continue
    const priority = (i - startIndex) < 3 ? 'high' : 'low'

    switch (cmd.type) {
      case 'bg': {
        const bgId = cmd.src || cmd.location || cmd.id
        const entry = getBackgroundEntry(bgId)
        if (entry?.image) _preloadImage(entry.image, priority)
        break
      }
      case 'char_enter':
      case 'show': {
        const charId = cmd.character
        const expr = cmd.expression || 'normal'
        const src = getCharacterSprite(charId, expr)
        if (src) _preloadImage(src, priority)
        const normalSrc = getCharacterSprite(charId, 'normal')
        if (normalSrc) _preloadImage(normalSrc, 'low')
        break
      }
      case 'dialogue': {
        if (cmd.expression) {
          const src = getCharacterSprite(cmd.speaker, cmd.expression)
          if (src) _preloadImage(src, priority)
        }
        break
      }
      case 'char_expression': {
        const src = getCharacterSprite(cmd.character, cmd.expression)
        if (src) _preloadImage(src, priority)
        break
      }
      case 'cg': {
        if (cmd.id) {
          const cgPath = `/assets/cg/${cmd.id}.webp`
          _preloadImage(cgPath, 'high')
        }
        break
      }
    }

    if (i < audioEnd) {
      switch (cmd.type) {
        case 'bgm': {
          const bgmId = cmd.src || cmd.id
          if (bgmId) {
            const path = getAudioAssetPath('bgm', bgmId)
            if (path) _preloadAudio(path, priority)
          }
          if (cmd.crossfade) {
            const nextBgm = script[i + 1]
            if (nextBgm?.type === 'bgm') {
              const nextPath = getAudioAssetPath('bgm', nextBgm.src || nextBgm.id)
              if (nextPath) _preloadAudio(nextPath, 'low')
            }
          }
          break
        }
        case 'se': {
          const seId = cmd.src || cmd.id
          if (seId) {
            const path = getAudioAssetPath('sfx', seId)
            if (path) _preloadAudio(path, priority)
          }
          break
        }
      }
    }
  }
}

export function preloadBackground(bgId) {
  const entry = getBackgroundEntry(bgId)
  if (entry?.image) _preloadImage(entry.image)
}

export function preloadCharacter(charId, expression = 'normal') {
  const src = getCharacterSprite(charId, expression)
  if (src) _preloadImage(src)
}

export function preloadLive2DModel(charId) {
  if (_live2dPreloaded.has(charId)) return
  _live2dPreloaded.add(charId)
  const modelPath = getLive2DModelPath(charId)
  if (modelPath) {
    fetch(modelPath, { mode: 'cors' }).catch(() => {})
  }
}

export function preloadNextChapter(chapterId) {
  requestIdleCallback(() => {
    import('../scripts/index.js').then(({ preloadModule }) => {
      if (preloadModule) preloadModule(chapterId)
    }).catch(() => {})
  })
}

export function warmUpAudioBuffers(bgmIds) {
  if (!bgmIds || bgmIds.length === 0) return
  requestIdleCallback(() => {
    for (const id of bgmIds.slice(0, 3)) {
      const path = getAudioAssetPath('bgm', id)
      if (path) _preloadAudio(path, 'low')
    }
  })
}

export function getPreloadStats() {
  return {
    images: _preloaded.size,
    audio: _audioPreloaded.size,
    live2d: _live2dPreloaded.size,
    queueLength: _preloadQueue.length,
  }
}
