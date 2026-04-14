import { ref, reactive, computed } from 'vue'

const SAMPLE_WINDOW = 120
const WARNING_THRESHOLD_MS = 16.67
const CRITICAL_THRESHOLD_MS = 33.33

const fps = ref(60)
const frametime = ref(0)
const isProfilerVisible = ref(false)

const systemMetrics = reactive({
  particles: { avg: 0, peak: 0, active: false },
  postfx: { avg: 0, peak: 0, active: false },
  facetrack: { avg: 0, peak: 0, active: false },
  tts: { avg: 0, peak: 0, active: false },
  llm: { avg: 0, peak: 0, active: false },
  aura: { avg: 0, peak: 0, active: false },
  weather: { avg: 0, peak: 0, active: false },
  total: { avg: 0, peak: 0 },
})

const warnings = ref([])

const _frameTimes = []
const _systemTimings = {}
let _lastFrameTime = 0
let _animFrameId = null
let _profileCallback = null

function _addTiming(system, ms) {
  if (!_systemTimings[system]) _systemTimings[system] = []
  _systemTimings[system].push(ms)
  if (_systemTimings[system].length > SAMPLE_WINDOW) _systemTimings[system].shift()
}

function _calcStats(arr) {
  if (!arr || arr.length === 0) return { avg: 0, peak: 0 }
  const avg = arr.reduce((a, b) => a + b, 0) / arr.length
  const peak = Math.max(...arr)
  return { avg: Math.round(avg * 100) / 100, peak: Math.round(peak * 100) / 100 }
}

export function usePerformanceProfiler() {

  function startProfiling(callback) {
    _profileCallback = callback
    _lastFrameTime = performance.now()

    function loop() {
      const now = performance.now()
      const dt = now - _lastFrameTime
      _lastFrameTime = now

      _frameTimes.push(dt)
      if (_frameTimes.length > SAMPLE_WINDOW) _frameTimes.shift()

      const avgDt = _frameTimes.reduce((a, b) => a + b, 0) / _frameTimes.length
      fps.value = Math.round(1000 / avgDt)
      frametime.value = Math.round(avgDt * 100) / 100

      for (const [sys, timings] of Object.entries(_systemTimings)) {
        const stats = _calcStats(timings)
        if (systemMetrics[sys]) {
          systemMetrics[sys].avg = stats.avg
          systemMetrics[sys].peak = stats.peak
        }
      }

      const totalAvg = Object.values(systemMetrics)
        .filter((m, i) => i < Object.keys(systemMetrics).length - 1)
        .reduce((s, m) => s + m.avg, 0)
      systemMetrics.total.avg = Math.round(totalAvg * 100) / 100
      systemMetrics.total.peak = Math.round(
        Object.values(systemMetrics)
          .filter((m, i) => i < Object.keys(systemMetrics).length - 1)
          .reduce((s, m) => s + m.peak, 0) * 100
      ) / 100

      const newWarnings = []
      if (avgDt > CRITICAL_THRESHOLD_MS) {
        newWarnings.push({ level: 'critical', message: `帧时间 ${frametime.value}ms 超过 33ms` })
      } else if (avgDt > WARNING_THRESHOLD_MS) {
        newWarnings.push({ level: 'warning', message: `帧时间 ${frametime.value}ms 超过 16ms` })
      }

      for (const [sys, m] of Object.entries(systemMetrics)) {
        if (sys === 'total') continue
        if (m.active && m.peak > 8) {
          newWarnings.push({ level: 'warning', message: `${sys} 峰值 ${m.peak}ms` })
        }
      }

      warnings.value = newWarnings

      if (_profileCallback) _profileCallback({ fps: fps.value, frametime: frametime.value, metrics: { ...systemMetrics } })

      _animFrameId = requestAnimationFrame(loop)
    }

    _animFrameId = requestAnimationFrame(loop)
  }

  function stopProfiling() {
    if (_animFrameId) {
      cancelAnimationFrame(_animFrameId)
      _animFrameId = null
    }
    _profileCallback = null
  }

  function measureSystem(systemName, fn) {
    const start = performance.now()
    const result = fn()
    const elapsed = performance.now() - start
    _addTiming(systemName, elapsed)
    systemMetrics[systemName] = systemMetrics[systemName] || { avg: 0, peak: 0, active: true }
    systemMetrics[systemName].active = true
    return result
  }

  async function measureSystemAsync(systemName, fn) {
    const start = performance.now()
    const result = await fn()
    const elapsed = performance.now() - start
    _addTiming(systemName, elapsed)
    systemMetrics[systemName] = systemMetrics[systemName] || { avg: 0, peak: 0, active: true }
    systemMetrics[systemName].active = true
    return result
  }

  function markSystemActive(systemName, active) {
    if (systemMetrics[systemName]) {
      systemMetrics[systemName].active = active
    }
  }

  function getReport() {
    return {
      fps: fps.value,
      frametime: frametime.value,
      systems: Object.fromEntries(
        Object.entries(systemMetrics).map(([k, v]) => [k, { ...v }])
      ),
      warnings: [...warnings.value],
      recommendation: _getRecommendation(),
    }
  }

  function _getRecommendation() {
    const recs = []
    if (fps.value < 30) {
      recs.push('帧率过低，建议关闭粒子特效或降低粒子数量')
      if (systemMetrics.particles.active && systemMetrics.particles.avg > 5) {
        recs.push('粒子系统占用较高，尝试降低粒子数量')
      }
      if (systemMetrics.facetrack.active && systemMetrics.facetrack.avg > 5) {
        recs.push('表情追踪占用较高，尝试降低帧率')
      }
    }
    if (fps.value < 50 && fps.value >= 30) {
      recs.push('帧率偏低，可以关闭后处理特效提升流畅度')
    }
    return recs
  }

  function toggleVisibility() {
    isProfilerVisible.value = !isProfilerVisible.value
  }

  return {
    fps, frametime, isProfilerVisible,
    systemMetrics, warnings,
    startProfiling, stopProfiling,
    measureSystem, measureSystemAsync,
    markSystemActive,
    getReport, toggleVisibility,
  }
}
