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

let currentBgmAudio = null
const activeSfxAudios = new Set()
const fadeHandleMap = new WeakMap()

const SCENE_BGM_MAP = {
  classroom_day: 'daily',
  classroom_evening: 'evening_calm',
  classroom_night: 'sad',
  computer_room_day: 'peaceful',
  computer_room_evening: 'tension',
  computer_room_night: 'mystery',
  festival_day: 'festival',
  festival_evening: 'festival',
  festival_night: 'festival',
  hallway_day: 'daily',
  hallway_evening: 'evening_calm',
  hallway_night: 'mystery',
  library_day: 'peaceful',
  library_evening: 'romantic',
  library_night: 'mystery',
  player_room_day: 'daily',
  player_room_evening: 'evening_calm',
  player_room_night: 'sad',
  rooftop_day: 'daily',
  rooftop_evening: 'romantic',
  rooftop_night: 'festival',
  cafeteria_day: 'daily',
  cafeteria_evening: 'evening_calm',
  cafeteria_night: 'peaceful',
  school_gate_day: 'morning_fresh',
  school_gate_evening: 'evening_calm',
  school_gate_night: 'mystery',
  school_yard_day: 'daily',
  school_yard_evening: 'romantic',
  school_yard_night: 'mystery',
  black: null,
}

function clampVolume(value) {
  return Math.max(0, Math.min(1, Number(value) || 0))
}

function getBgmTargetVolume() {
  return clampVolume(masterVol.value * bgmVolume.value)
}

function getSfxTargetVolume() {
  return clampVolume(masterVol.value * sfxVolume.value)
}

function ensureContext() {
  return true
}

function stopFade(audio) {
  const handle = fadeHandleMap.get(audio)
  if (handle) {
    cancelAnimationFrame(handle)
    fadeHandleMap.delete(audio)
  }
}

function fadeAudio(audio, from, to, duration, onDone) {
  if (!audio) return

  stopFade(audio)
  audio.volume = clampVolume(from)

  if (!duration || duration <= 0) {
    audio.volume = clampVolume(to)
    onDone?.()
    return
  }

  const startAt = performance.now()
  const startVolume = clampVolume(from)
  const targetVolume = clampVolume(to)

  const tick = (now) => {
    const progress = Math.min(1, (now - startAt) / duration)
    audio.volume = clampVolume(startVolume + (targetVolume - startVolume) * progress)

    if (progress < 1) {
      const nextHandle = requestAnimationFrame(tick)
      fadeHandleMap.set(audio, nextHandle)
      return
    }

    fadeHandleMap.delete(audio)
    onDone?.()
  }

  const firstHandle = requestAnimationFrame(tick)
  fadeHandleMap.set(audio, firstHandle)
}

function disposeAudio(audio) {
  if (!audio) return
  stopFade(audio)
  audio.pause()
  audio.currentTime = 0
  audio.src = ''
  activeSfxAudios.delete(audio)
}

function createBgmAudio(src) {
  const audio = new Audio(src)
  audio.loop = true
  audio.preload = 'auto'
  audio.volume = 0
  return audio
}

function applyLiveVolumes() {
  if (currentBgmAudio) {
    currentBgmAudio.volume = getBgmTargetVolume()
  }

  const liveSfxVolume = getSfxTargetVolume()
  activeSfxAudios.forEach((audio) => {
    audio.volume = liveSfxVolume
  })
}

function stopBgm(fadeOut = 1000) {
  const playingAudio = currentBgmAudio
  if (!playingAudio) return

  currentBgmAudio = null
  currentBgmId.value = null
  bgmPlaying.value = false

  fadeAudio(playingAudio, playingAudio.volume, 0, fadeOut, () => {
    disposeAudio(playingAudio)
  })
}

function playBgm(bgmId, crossfadeDuration = 1500) {
  const assetPath = getAudioAssetPath('bgm', bgmId)
  if (!assetPath) return

  ensureContext()

  if (currentBgmId.value === bgmId && currentBgmAudio) {
    if (currentBgmAudio.paused) {
      void currentBgmAudio.play().catch(() => {})
    }
    fadeAudio(
      currentBgmAudio,
      currentBgmAudio.volume,
      getBgmTargetVolume(),
      Math.min(crossfadeDuration, 600),
    )
    bgmPlaying.value = true
    return
  }

  const previousAudio = currentBgmAudio
  const previousBgmId = currentBgmId.value
  const nextAudio = createBgmAudio(assetPath)

  void nextAudio.play().then(() => {
    currentBgmAudio = nextAudio
    currentBgmId.value = bgmId
    bgmPlaying.value = true

    fadeAudio(
      nextAudio,
      0,
      getBgmTargetVolume(),
      previousAudio ? crossfadeDuration : Math.min(crossfadeDuration, 500),
    )

    if (previousAudio) {
      fadeAudio(previousAudio, previousAudio.volume, 0, crossfadeDuration, () => {
        disposeAudio(previousAudio)
      })
    }
  }).catch(() => {
    disposeAudio(nextAudio)
    currentBgmAudio = previousAudio
    currentBgmId.value = previousBgmId
    bgmPlaying.value = !!previousAudio && !previousAudio.paused
  })
}

function playBgmForScene(sceneName) {
  const bgmId = SCENE_BGM_MAP[sceneName]
  if (bgmId === null) {
    stopBgm()
    return
  }
  if (bgmId) playBgm(bgmId)
}

function playSfx(sfxId) {
  const assetPath = getAudioAssetPath('sfx', sfxId)
  if (!assetPath) return

  ensureContext()

  const audio = new Audio(assetPath)
  audio.preload = 'auto'
  audio.volume = getSfxTargetVolume()
  activeSfxAudios.add(audio)

  const cleanup = () => disposeAudio(audio)
  audio.addEventListener('ended', cleanup, { once: true })
  audio.addEventListener('error', cleanup, { once: true })

  void audio.play().catch(() => {
    cleanup()
  })
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

export function useAudioManager() {
  return {
    bgmPlaying,
    currentBgmId,
    bgmVolume,
    sfxVolume,
    masterVol,
    playBgm,
    playBgmForScene,
    stopBgm,
    playSfx,
    setMasterVolume,
    setBgmVolume,
    setSfxVolume,
    ensureContext,
  }
}
