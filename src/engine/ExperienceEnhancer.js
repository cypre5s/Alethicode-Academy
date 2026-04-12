import { ref, watch, onUnmounted } from 'vue'

const moodColor = ref('default')
const particleEffect = ref(null)
const isScreenLocked = ref(false)

let wakeLockSentinel = null

const MOOD_THEMES = {
  default:    { primary: '#e8d5b7', accent: '#c9a96e', glow: 'rgba(201,169,110,0.15)' },
  romantic:   { primary: '#f5c6d0', accent: '#e8829b', glow: 'rgba(232,130,155,0.2)' },
  tension:    { primary: '#d4c5a9', accent: '#c9844a', glow: 'rgba(201,132,74,0.15)' },
  mystery:    { primary: '#b8c4d8', accent: '#6b7fa0', glow: 'rgba(107,127,160,0.2)' },
  sad:        { primary: '#c8c8d8', accent: '#8888aa', glow: 'rgba(136,136,170,0.15)' },
  peaceful:   { primary: '#d5e8d5', accent: '#7aba7a', glow: 'rgba(122,186,122,0.15)' },
  festival:   { primary: '#ffe4b5', accent: '#ff9933', glow: 'rgba(255,153,51,0.2)' },
  battle:     { primary: '#e8d0d0', accent: '#cc4444', glow: 'rgba(204,68,68,0.2)' },
  ending:     { primary: '#e8dff5', accent: '#9b7fd4', glow: 'rgba(155,127,212,0.25)' },
}

export function setMoodTheme(bgmId) {
  const theme = MOOD_THEMES[bgmId] || MOOD_THEMES.default
  moodColor.value = bgmId || 'default'
  const root = document.documentElement
  if (root) {
    root.style.setProperty('--mood-primary', theme.primary)
    root.style.setProperty('--mood-accent', theme.accent)
    root.style.setProperty('--mood-glow', theme.glow)
  }
}

export function triggerHaptic(pattern = 'light') {
  if (!navigator.vibrate) return
  const patterns = {
    light:     [15],
    click:     [10],
    heartbeat: [80, 100, 80, 200, 80, 100, 80],
    surprise:  [50, 30, 100],
    firework:  [30, 50, 30, 50, 30, 50, 100, 200, 150],
    wrong:     [100, 50, 100],
    correct:   [20, 40, 60],
    levelup:   [50, 30, 50, 30, 50, 30, 200],
    tension:   [200, 100, 200, 100, 300],
    ending:    [100, 50, 100, 50, 100, 50, 100, 50, 500],
  }
  const p = patterns[pattern] || patterns.light
  try { navigator.vibrate(p) } catch { /* unsupported */ }
}

export async function acquireWakeLock() {
  if (!('wakeLock' in navigator)) return false
  try {
    wakeLockSentinel = await navigator.wakeLock.request('screen')
    isScreenLocked.value = true
    wakeLockSentinel.addEventListener('release', () => {
      isScreenLocked.value = false
    })
    return true
  } catch {
    return false
  }
}

export async function releaseWakeLock() {
  if (wakeLockSentinel) {
    await wakeLockSentinel.release()
    wakeLockSentinel = null
    isScreenLocked.value = false
  }
}

export function setupVisibilityHandler(audioManager) {
  if (typeof document === 'undefined') return
  let wasBgmPlaying = false

  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      wasBgmPlaying = audioManager.bgmPlaying.value
      if (wasBgmPlaying) {
        audioManager.stopBgm(300)
      }
    } else {
      if (wasBgmPlaying && audioManager.currentBgmId.value) {
        audioManager.playBgm(audioManager.currentBgmId.value, 500)
      }
      acquireWakeLock()
    }
  })
}

export async function viewTransition(callback) {
  if (document.startViewTransition) {
    const transition = document.startViewTransition(callback)
    await transition.finished
  } else {
    callback()
  }
}

export function mapCommandToHaptic(cmdType) {
  const mapping = {
    se_surprise: 'surprise',
    se_firework: 'firework',
    se_wrong: 'wrong',
    se_correct: 'correct',
    se_level_up: 'levelup',
    se_heartbeat: 'heartbeat',
    screen_effect_shake: 'tension',
    screen_effect_flash_white: 'surprise',
    ending: 'ending',
    choice: 'light',
    challenge_success: 'correct',
    challenge_fail: 'wrong',
  }
  return mapping[cmdType] || null
}

export function useExperienceEnhancer() {
  return {
    moodColor,
    particleEffect,
    isScreenLocked,
    setMoodTheme,
    triggerHaptic,
    acquireWakeLock,
    releaseWakeLock,
    setupVisibilityHandler,
    viewTransition,
    mapCommandToHaptic,
  }
}
