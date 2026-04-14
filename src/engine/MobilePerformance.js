import { ref, reactive, readonly } from 'vue'

const _state = reactive({
  isMobile: false,
  isLowEnd: false,
  tier: 'high',
  dpr: 1,
  screenWidth: 0,
  screenHeight: 0,
  hasWebGL2: false,
  hasWebGPU: false,
  deviceMemory: 8,
  cores: 4,
  isTouch: false,
  isIOS: false,
  isAndroid: false,
  batteryLevel: 1,
  initialized: false,
})

const MOBILE_TIER_PROFILES = {
  ultraLow: {
    backdropFilter: false,
    cssFilter: false,
    blurEffects: false,
    weatherParticles: 0,
    maxLive2DModels: 0,
    live2dTextureSize: 0,
    live2dPhysics: false,
    shaderEffects: false,
    canvasParticles: false,
    dprCap: 1,
    animationReduction: 0.3,
    screenshotScale: 0.5,
    transitionDuration: 0.5,
    maxConcurrentAnimations: 3,
  },
  low: {
    backdropFilter: false,
    cssFilter: true,
    blurEffects: false,
    weatherParticles: 8,
    maxLive2DModels: 1,
    live2dTextureSize: 512,
    live2dPhysics: false,
    shaderEffects: false,
    canvasParticles: true,
    dprCap: 1.5,
    animationReduction: 0.5,
    screenshotScale: 1,
    transitionDuration: 0.7,
    maxConcurrentAnimations: 5,
  },
  medium: {
    backdropFilter: true,
    cssFilter: true,
    blurEffects: true,
    weatherParticles: 20,
    maxLive2DModels: 1,
    live2dTextureSize: 1024,
    live2dPhysics: true,
    shaderEffects: false,
    canvasParticles: true,
    dprCap: 2,
    animationReduction: 0.8,
    screenshotScale: 1.5,
    transitionDuration: 1,
    maxConcurrentAnimations: 8,
  },
  high: {
    backdropFilter: true,
    cssFilter: true,
    blurEffects: true,
    weatherParticles: 40,
    maxLive2DModels: 2,
    live2dTextureSize: 2048,
    live2dPhysics: true,
    shaderEffects: true,
    canvasParticles: true,
    dprCap: 3,
    animationReduction: 1,
    screenshotScale: 2,
    transitionDuration: 1,
    maxConcurrentAnimations: 15,
  },
}

function _detectDevice() {
  const ua = navigator.userAgent || ''
  _state.isIOS = /iPhone|iPad|iPod/.test(ua)
  _state.isAndroid = /Android/.test(ua)
  _state.isMobile = _state.isIOS || _state.isAndroid || /Mobile|webOS|Opera Mini/i.test(ua)
  _state.isTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0
  _state.dpr = window.devicePixelRatio || 1
  _state.screenWidth = window.screen.width
  _state.screenHeight = window.screen.height
  _state.deviceMemory = navigator.deviceMemory || 4
  _state.cores = navigator.hardwareConcurrency || 2

  try {
    const c = document.createElement('canvas')
    _state.hasWebGL2 = !!c.getContext('webgl2')
  } catch { _state.hasWebGL2 = false }

  _state.hasWebGPU = !!navigator.gpu
}

function _detectTier() {
  const saved = localStorage.getItem('alethicode_graphics_quality')
  if (saved && ['ultraLow', 'low', 'medium', 'high'].includes(saved)) {
    _state.tier = saved
    _state.isLowEnd = saved === 'ultraLow' || saved === 'low'
    return
  }

  if (!_state.isMobile) {
    if (_state.cores >= 4 && _state.deviceMemory >= 4) {
      _state.tier = 'high'
    } else {
      _state.tier = 'medium'
    }
    _state.isLowEnd = false
    return
  }

  // Mobile-specific tier detection
  const mem = _state.deviceMemory
  const cores = _state.cores

  if (mem <= 2 || cores <= 2 || !_state.hasWebGL2) {
    _state.tier = 'ultraLow'
  } else if (mem <= 4 || cores <= 4) {
    _state.tier = 'low'
  } else if (mem <= 6) {
    _state.tier = 'medium'
  } else {
    _state.tier = 'high'
  }

  // iOS tends to have better GPU but hates backdrop-filter stacking
  if (_state.isIOS && _state.tier === 'medium') {
    _state.tier = 'medium'
  }

  _state.isLowEnd = _state.tier === 'ultraLow' || _state.tier === 'low'
}

function _applyMobileCSSVars() {
  const profile = getProfile()
  const root = document.documentElement

  if (!profile.backdropFilter) {
    root.style.setProperty('--mp-backdrop-filter', 'none')
    root.style.setProperty('--mp-backdrop-bg', 'rgba(0, 0, 0, 0.75)')
  } else {
    root.style.setProperty('--mp-backdrop-filter', '')
    root.style.setProperty('--mp-backdrop-bg', '')
  }

  root.style.setProperty('--mp-animation-speed', String(profile.animationReduction))
  root.style.setProperty('--mp-transition-duration', profile.transitionDuration + 's')

  if (_state.isMobile) {
    root.classList.add('is-mobile')
    root.classList.add(`mobile-tier-${_state.tier}`)
  }

  if (_state.isTouch) {
    root.classList.add('is-touch')
  }
}

async function _monitorBattery() {
  try {
    if ('getBattery' in navigator) {
      const battery = await navigator.getBattery()
      _state.batteryLevel = battery.level
      battery.addEventListener('levelchange', () => {
        _state.batteryLevel = battery.level
        if (battery.level < 0.15 && _state.tier !== 'ultraLow') {
          console.warn('[MobilePerf] Low battery, reducing effects')
        }
      })
    }
  } catch {}
}

export function initialize() {
  if (_state.initialized) return
  _detectDevice()
  _detectTier()
  _applyMobileCSSVars()
  _monitorBattery()
  _state.initialized = true

  window.addEventListener('resize', () => {
    _state.screenWidth = window.screen.width
    _state.screenHeight = window.screen.height
  })

  console.log(`[MobilePerf] Device: ${_state.isMobile ? 'Mobile' : 'Desktop'}, Tier: ${_state.tier}, DPR: ${_state.dpr}, Mem: ${_state.deviceMemory}GB, Cores: ${_state.cores}`)
}

export function getProfile() {
  return MOBILE_TIER_PROFILES[_state.tier] || MOBILE_TIER_PROFILES.high
}

export function setQuality(tier) {
  if (MOBILE_TIER_PROFILES[tier]) {
    _state.tier = tier
    _state.isLowEnd = tier === 'ultraLow' || tier === 'low'
    localStorage.setItem('alethicode_graphics_quality', tier)
    _applyMobileCSSVars()
    window.dispatchEvent(new CustomEvent('quality-change', { detail: { quality: tier } }))
  }
}

export function getEffectiveDPR() {
  const profile = getProfile()
  return Math.min(_state.dpr, profile.dprCap)
}

export function shouldUseBackdropFilter() {
  return getProfile().backdropFilter
}

export function getWeatherParticleCount() {
  return getProfile().weatherParticles
}

export function getScreenshotScale() {
  return getProfile().screenshotScale
}

export const state = readonly(_state)
export const isMobile = ref(false)
export const isTouch = ref(false)

export function updateRefs() {
  isMobile.value = _state.isMobile
  isTouch.value = _state.isTouch
}
