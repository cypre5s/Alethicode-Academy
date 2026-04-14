/**
 * AdaptiveQuality — 帧率自适应质量控制器
 *
 * 核心思想：
 *   监控实际 FPS，当帧率持续低于阈值时自动降级特效。
 *   帧率恢复后逐步恢复特效。形成闭环的自适应系统。
 *
 * 降级链（从高到低）：
 *   Level 0: 全部特效开启
 *   Level 1: 禁用 shader 特效、减少天气粒子 50%
 *   Level 2: 禁用 backdrop-filter、禁用 CSS 滤镜动画
 *   Level 3: 禁用 Live2D 物理模拟、禁用所有非必要动画
 *   Level 4: 最低画质模式，仅保留核心叙事功能
 */
import { ref, readonly } from 'vue'

const FPS_SAMPLE_SIZE = 30
const DEGRADE_THRESHOLD_FPS = 24
const RECOVER_THRESHOLD_FPS = 45
const CHECK_INTERVAL_MS = 2000
const DEGRADE_COOLDOWN_MS = 5000
const RECOVER_COOLDOWN_MS = 10000
const MAX_LEVEL = 4

const currentLevel = ref(0)
const currentFPS = ref(60)
const isMonitoring = ref(false)

let _frameTimes = []
let _lastFrameTime = 0
let _checkTimer = null
let _lastDegradeTime = 0
let _lastRecoverTime = 0
let _rafHandle = null

const LEVEL_ACTIONS = {
  1: {
    apply() {
      document.documentElement.classList.add('aq-level-1')
      _dispatch('shader-effects-disable')
    },
    revert() {
      document.documentElement.classList.remove('aq-level-1')
      _dispatch('shader-effects-enable')
    },
  },
  2: {
    apply() {
      document.documentElement.classList.add('aq-level-2')
    },
    revert() {
      document.documentElement.classList.remove('aq-level-2')
    },
  },
  3: {
    apply() {
      document.documentElement.classList.add('aq-level-3')
      _dispatch('live2d-physics-disable')
    },
    revert() {
      document.documentElement.classList.remove('aq-level-3')
      _dispatch('live2d-physics-enable')
    },
  },
  4: {
    apply() {
      document.documentElement.classList.add('aq-level-4')
      _dispatch('minimal-mode-enable')
    },
    revert() {
      document.documentElement.classList.remove('aq-level-4')
      _dispatch('minimal-mode-disable')
    },
  },
}

function _dispatch(eventName) {
  window.dispatchEvent(new CustomEvent(eventName))
}

function _measureFrame(timestamp) {
  if (_lastFrameTime > 0) {
    const delta = timestamp - _lastFrameTime
    if (delta > 0 && delta < 500) {
      _frameTimes.push(delta)
      if (_frameTimes.length > FPS_SAMPLE_SIZE) _frameTimes.shift()
    }
  }
  _lastFrameTime = timestamp
  if (isMonitoring.value) {
    _rafHandle = requestAnimationFrame(_measureFrame)
  }
}

function _getAverageFPS() {
  if (_frameTimes.length < 5) return 60
  const avg = _frameTimes.reduce((a, b) => a + b, 0) / _frameTimes.length
  return Math.round(1000 / avg)
}

function _check() {
  const fps = _getAverageFPS()
  currentFPS.value = fps
  const now = Date.now()

  if (fps < DEGRADE_THRESHOLD_FPS && currentLevel.value < MAX_LEVEL) {
    if (now - _lastDegradeTime > DEGRADE_COOLDOWN_MS) {
      _degrade()
      _lastDegradeTime = now
    }
  } else if (fps > RECOVER_THRESHOLD_FPS && currentLevel.value > 0) {
    if (now - _lastRecoverTime > RECOVER_COOLDOWN_MS) {
      _recover()
      _lastRecoverTime = now
    }
  }
}

function _degrade() {
  const newLevel = currentLevel.value + 1
  if (newLevel > MAX_LEVEL) return
  const action = LEVEL_ACTIONS[newLevel]
  if (action) action.apply()
  currentLevel.value = newLevel
  console.log(`[AdaptiveQuality] Degraded to level ${newLevel} (FPS: ${currentFPS.value})`)
}

function _recover() {
  const oldLevel = currentLevel.value
  if (oldLevel <= 0) return
  const action = LEVEL_ACTIONS[oldLevel]
  if (action) action.revert()
  currentLevel.value = oldLevel - 1
  console.log(`[AdaptiveQuality] Recovered to level ${currentLevel.value} (FPS: ${currentFPS.value})`)
}

export function start() {
  if (isMonitoring.value) return
  isMonitoring.value = true
  _lastFrameTime = 0
  _frameTimes = []
  _rafHandle = requestAnimationFrame(_measureFrame)
  _checkTimer = setInterval(_check, CHECK_INTERVAL_MS)
}

export function stop() {
  isMonitoring.value = false
  if (_rafHandle) cancelAnimationFrame(_rafHandle)
  if (_checkTimer) clearInterval(_checkTimer)
  _checkTimer = null
}

export function forceLevel(level) {
  while (currentLevel.value < level) _degrade()
  while (currentLevel.value > level) _recover()
}

export function getStatus() {
  return {
    level: currentLevel.value,
    fps: currentFPS.value,
    isMonitoring: isMonitoring.value,
    sampleCount: _frameTimes.length,
  }
}

export { currentLevel, currentFPS, isMonitoring }
