import { ref } from 'vue'
import { getAudioAssetPath } from './audioCatalog.js'

const DEFAULT_MASTER_VOLUME = 0.5
const DEFAULT_BGM_VOLUME = 0.35
const DEFAULT_SFX_VOLUME = 0.6

const bgmPlaying = ref(false)
const currentBgmId = ref(null)
const bgmVolume = ref(DEFAULT_BGM_VOLUME)
const sfxVolume = ref(DEFAULT_SFX_VOLUME)
const masterVol = ref(DEFAULT_MASTER_VOLUME)

let audioCtx = null
let masterGain = null
let bgmGain = null
let sfxGain = null
let bgmAnalyser = null

let currentBgmSource = null
let currentBgmBuffer = null
let currentBgmStartTime = 0
let currentBgmPauseOffset = 0
const bufferCache = new Map()

const activeSfxNodes = new Set()
const activeFades = new Map()

const SCENE_BGM_POOL = {
  classroom_day: ['daily', 'daily_b', 'club_activity', 'together'],
  classroom_evening: ['evening_calm', 'nostalgia', 'autumn_leaves'],
  classroom_night: ['sad', 'gentle_rain', 'heartache'],
  computer_room_day: ['peaceful', 'study', 'peaceful_b'],
  computer_room_evening: ['tension', 'determination', 'anxiety'],
  computer_room_night: ['mystery', 'starry_night', 'night_walk'],
  festival_day: ['festival', 'summer_sun', 'playful'],
  festival_evening: ['festival', 'warmth', 'together'],
  festival_night: ['festival', 'starry_night', 'nostalgia'],
  hallway_day: ['daily', 'daily_b', 'spring_breeze', 'playful'],
  hallway_evening: ['evening_calm', 'autumn_leaves', 'nostalgia'],
  hallway_night: ['mystery', 'night_walk', 'anxiety'],
  library_day: ['peaceful', 'study', 'peaceful_b'],
  library_evening: ['romantic', 'heartache', 'nostalgia'],
  library_night: ['mystery', 'gentle_rain', 'winter_cold'],
  player_room_day: ['daily', 'warmth', 'spring_breeze'],
  player_room_evening: ['evening_calm', 'nostalgia', 'together'],
  player_room_night: ['sad', 'gentle_rain', 'night_walk', 'starry_night'],
  rooftop_day: ['daily', 'hope', 'spring_breeze', 'summer_sun'],
  rooftop_evening: ['romantic', 'confession', 'heartache'],
  rooftop_night: ['starry_night', 'night_walk', 'nostalgia'],
  cafeteria_day: ['daily', 'daily_b', 'playful', 'comedy'],
  cafeteria_evening: ['evening_calm', 'warmth', 'together'],
  cafeteria_night: ['peaceful', 'gentle_rain', 'peaceful_b'],
  school_gate_day: ['morning_fresh', 'spring_breeze', 'hope'],
  school_gate_evening: ['evening_calm', 'autumn_leaves', 'nostalgia'],
  school_gate_night: ['mystery', 'night_walk', 'winter_cold'],
  school_yard_day: ['daily', 'club_activity', 'summer_sun', 'playful'],
  school_yard_evening: ['romantic', 'evening_calm', 'autumn_leaves'],
  school_yard_night: ['mystery', 'starry_night', 'night_walk'],
  black: [null],
}

function pickFromPool(pool) {
  if (!pool || pool.length === 0) return null
  return pool[Math.floor(Math.random() * pool.length)]
}

function clampVolume(value) {
  return Math.max(0, Math.min(1, Number(value) || 0))
}

function ensureContext() {
  if (audioCtx && audioCtx.state !== 'closed') {
    if (audioCtx.state === 'suspended') {
      audioCtx.resume().catch(() => {})
    }
    return true
  }
  try {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)()

    masterGain = audioCtx.createGain()
    masterGain.gain.value = clampVolume(masterVol.value)
    masterGain.connect(audioCtx.destination)

    bgmGain = audioCtx.createGain()
    bgmGain.gain.value = clampVolume(bgmVolume.value)
    bgmGain.connect(masterGain)

    bgmAnalyser = audioCtx.createAnalyser()
    bgmAnalyser.fftSize = 256
    bgmAnalyser.smoothingTimeConstant = 0.8
    bgmGain.connect(bgmAnalyser)

    sfxGain = audioCtx.createGain()
    sfxGain.gain.value = clampVolume(sfxVolume.value)
    sfxGain.connect(masterGain)

    return true
  } catch {
    return false
  }
}

async function loadAudioBuffer(url) {
  if (bufferCache.has(url)) return bufferCache.get(url)
  try {
    const response = await fetch(url)
    const arrayBuffer = await response.arrayBuffer()
    const buffer = await audioCtx.decodeAudioData(arrayBuffer)
    bufferCache.set(url, buffer)
    return buffer
  } catch {
    return null
  }
}

function cancelFade(key) {
  const handle = activeFades.get(key)
  if (handle) {
    cancelAnimationFrame(handle)
    activeFades.delete(key)
  }
}

function fadeGain(gainNode, from, to, duration, key, onDone) {
  if (!gainNode) return
  cancelFade(key)

  if (!duration || duration <= 0) {
    gainNode.gain.setValueAtTime(clampVolume(to), audioCtx.currentTime)
    onDone?.()
    return
  }

  const now = audioCtx.currentTime
  gainNode.gain.cancelScheduledValues(now)
  gainNode.gain.setValueAtTime(clampVolume(from), now)
  gainNode.gain.linearRampToValueAtTime(clampVolume(to), now + duration / 1000)

  if (onDone) {
    const startAt = performance.now()
    const tick = (ts) => {
      if (ts - startAt >= duration) {
        activeFades.delete(key)
        onDone()
        return
      }
      activeFades.set(key, requestAnimationFrame(tick))
    }
    activeFades.set(key, requestAnimationFrame(tick))
  }
}

function stopCurrentBgm(fadeOut = 1000) {
  if (!currentBgmSource) return
  const source = currentBgmSource
  const sourceGain = source._fadeGain
  currentBgmSource = null

  if (sourceGain && fadeOut > 0) {
    fadeGain(sourceGain, sourceGain.gain.value, 0, fadeOut, 'bgm_fadeout', () => {
      try { source.stop() } catch { /* already stopped */ }
      sourceGain.disconnect()
    })
  } else {
    try { source.stop() } catch { /* */ }
    if (sourceGain) sourceGain.disconnect()
  }
}

function stopBgm(fadeOut = 1000) {
  stopCurrentBgm(fadeOut)
  currentBgmId.value = null
  bgmPlaying.value = false
}

async function playBgm(bgmId, crossfadeDuration = 1500) {
  const assetPath = getAudioAssetPath('bgm', bgmId)
  if (!assetPath) return

  if (!ensureContext()) {
    playBgmFallback(bgmId, crossfadeDuration)
    return
  }

  if (currentBgmId.value === bgmId && currentBgmSource) {
    bgmPlaying.value = true
    return
  }

  try {
    const buffer = await loadAudioBuffer(assetPath)
    if (!buffer) return

    stopCurrentBgm(crossfadeDuration)

    const source = audioCtx.createBufferSource()
    source.buffer = buffer
    source.loop = true

    const sourceGain = audioCtx.createGain()
    sourceGain.gain.value = 0
    source._fadeGain = sourceGain

    source.connect(sourceGain)
    sourceGain.connect(bgmGain)

    source.start(0)
    currentBgmSource = source
    currentBgmBuffer = buffer
    currentBgmId.value = bgmId
    bgmPlaying.value = true
    currentBgmStartTime = audioCtx.currentTime

    fadeGain(sourceGain, 0, 1, Math.min(crossfadeDuration, 1500), 'bgm_fadein')

    source.addEventListener('ended', () => {
      if (currentBgmSource === source) {
        currentBgmSource = null
        bgmPlaying.value = false
      }
    })
  } catch {
    playBgmFallback(bgmId, crossfadeDuration)
  }
}

let _fallbackBgmAudio = null
function playBgmFallback(bgmId, crossfadeDuration) {
  const assetPath = getAudioAssetPath('bgm', bgmId)
  if (!assetPath) return
  if (_fallbackBgmAudio) {
    _fallbackBgmAudio.pause()
    _fallbackBgmAudio.src = ''
  }
  _fallbackBgmAudio = new Audio(assetPath)
  _fallbackBgmAudio.loop = true
  _fallbackBgmAudio.volume = clampVolume(masterVol.value * bgmVolume.value)
  _fallbackBgmAudio.play().catch(() => {})
  currentBgmId.value = bgmId
  bgmPlaying.value = true
}

function playBgmForScene(sceneName) {
  const pool = SCENE_BGM_POOL[sceneName]
  if (!pool) return
  const bgmId = pickFromPool(pool)
  if (bgmId === null) {
    stopBgm()
    return
  }
  if (bgmId) playBgm(bgmId)
}

async function playSfx(sfxId) {
  const assetPath = getAudioAssetPath('sfx', sfxId)
  if (!assetPath) return

  if (!ensureContext()) {
    const audio = new Audio(assetPath)
    audio.volume = clampVolume(masterVol.value * sfxVolume.value)
    audio.play().catch(() => {})
    return
  }

  try {
    const buffer = await loadAudioBuffer(assetPath)
    if (!buffer) return

    const source = audioCtx.createBufferSource()
    source.buffer = buffer

    source.connect(sfxGain)
    activeSfxNodes.add(source)

    source.addEventListener('ended', () => {
      activeSfxNodes.delete(source)
    })

    source.start(0)
  } catch {
    const audio = new Audio(assetPath)
    audio.volume = clampVolume(masterVol.value * sfxVolume.value)
    audio.play().catch(() => {})
  }
}

function applyLiveVolumes() {
  if (masterGain) masterGain.gain.setValueAtTime(clampVolume(masterVol.value), audioCtx?.currentTime || 0)
  if (bgmGain) bgmGain.gain.setValueAtTime(clampVolume(bgmVolume.value), audioCtx?.currentTime || 0)
  if (sfxGain) sfxGain.gain.setValueAtTime(clampVolume(sfxVolume.value), audioCtx?.currentTime || 0)
  if (_fallbackBgmAudio) {
    _fallbackBgmAudio.volume = clampVolume(masterVol.value * bgmVolume.value)
  }
}

function setMasterVolume(value) {
  masterVol.value = clampVolume(value)
  applyLiveVolumes()
}

function setBgmVolume(value) {
  bgmVolume.value = clampVolume(value)
  applyLiveVolumes()
}

function setSfxVolume(value) {
  sfxVolume.value = clampVolume(value)
  applyLiveVolumes()
}

const _bgmChangeListeners = []

function onBgmChange(fn) {
  _bgmChangeListeners.push(fn)
}

function _notifyBgmChange(bgmId) {
  for (const fn of _bgmChangeListeners) {
    try { fn(bgmId) } catch { /* */ }
  }
}

function getAudioAmplitude() {
  if (!bgmAnalyser || !bgmPlaying.value) return 0
  const data = new Uint8Array(bgmAnalyser.frequencyBinCount)
  bgmAnalyser.getByteFrequencyData(data)
  let sum = 0
  for (let i = 0; i < data.length; i++) sum += data[i]
  return (sum / data.length) / 255
}

function getFrequencyData() {
  if (!bgmAnalyser) return null
  const data = new Uint8Array(bgmAnalyser.frequencyBinCount)
  bgmAnalyser.getByteFrequencyData(data)
  return data
}

function getAudioContext() {
  return audioCtx
}

const _origPlayBgm = playBgm
const _origStopBgm = stopBgm

const _wrappedPlayBgm = function (bgmId, crossfadeDuration = 1500) {
  _origPlayBgm(bgmId, crossfadeDuration)
  _notifyBgmChange(bgmId)
}

const _wrappedStopBgm = function (fadeOut = 1000) {
  _origStopBgm(fadeOut)
  _notifyBgmChange(null)
}

export function useAudioManager() {
  return {
    bgmPlaying,
    currentBgmId,
    bgmVolume,
    sfxVolume,
    masterVol,
    playBgm: _wrappedPlayBgm,
    playBgmForScene,
    stopBgm: _wrappedStopBgm,
    playSfx,
    setMasterVolume,
    setBgmVolume,
    setSfxVolume,
    ensureContext,
    onBgmChange,
    getAudioAmplitude,
    getFrequencyData,
    getAudioContext,
  }
}
