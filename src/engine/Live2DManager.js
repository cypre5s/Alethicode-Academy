import { ref, reactive, shallowRef, watch, markRaw } from 'vue'
import { assetPath } from '../utils/assetPath.js'
import { characters } from '../data/characters.js'
import {
  LIVE2D_ANIMATION_MAP,
  EMOTION_TO_LIVE2D,
  TEACHING_STATES,
  SYMBIOSIS_ANIMATION_TIERS,
  BGM_MOOD_TO_BREATH,
  GAZE_TARGETS,
} from '../data/live2dAnimationMap.js'
import { EMERGENT_RULES } from '../data/live2dEmergentRules.js'

let PIXI = null
let Live2DModel = null
let _live2dLibReady = false

async function _ensureLive2DLibs() {
  if (_live2dLibReady) return true
  try {
    PIXI = await import('pixi.js')
    window.PIXI = PIXI
    const l2dModule = await import('pixi-live2d-display')
    Live2DModel = l2dModule.Live2DModel
    Live2DModel.registerTicker(PIXI.Ticker)
    _live2dLibReady = true
    return true
  } catch (err) {
    console.warn('[Live2D] Cubism SDK not available, falling back to static sprites:', err.message)
    return false
  }
}

// ─── Performance Tier Detection ─────────────────────────────────────
function detectPerformanceTier() {
  try {
    const canvas = document.createElement('canvas')
    const gl = canvas.getContext('webgl2') || canvas.getContext('webgl')
    if (!gl) return 'fallback'
    const isMobile = /Android|iPhone|iPad|iPod|Mobile/i.test(navigator.userAgent)
    const cores = navigator.hardwareConcurrency || 2
    const memory = navigator.deviceMemory || 2
    if (isMobile && memory <= 2) return 'fallback'
    if (isMobile && memory <= 4) return 'low'
    if (isMobile) return 'medium'
    if (cores <= 2) return 'medium'
    return 'high'
  } catch { return 'fallback' }
}

function _getMobileSafeDPR() {
  const dpr = window.devicePixelRatio || 1
  const isMobile = /Android|iPhone|iPad|iPod|Mobile/i.test(navigator.userAgent)
  if (!isMobile) return dpr
  return Math.min(dpr, 1.5)
}

const TIER_CONFIG = {
  fallback: { maxModels: 0, textureSize: 0, physics: false, microActionFreq: 0, gazeTargets: 0, emergent: false },
  low:      { maxModels: 1, textureSize: 1024, physics: false, microActionFreq: 0.5, gazeTargets: 3, emergent: false },
  medium:   { maxModels: 2, textureSize: 2048, physics: true, microActionFreq: 0.8, gazeTargets: 8, emergent: false },
  high:     { maxModels: 3, textureSize: 4096, physics: true, microActionFreq: 1.0, gazeTargets: 8, emergent: true },
}

// ─── Animation State Machine ────────────────────────────────────────
const STATES = ['Idle', 'Speaking', 'Reacting', 'Teaching', 'Listening', 'Departing']
const STATE_PRIORITY = { Departing: 6, Reacting: 5, Speaking: 4, Teaching: 3, Listening: 2, Idle: 1 }
const STATE_INTERRUPTIBLE = { Idle: true, Listening: true, Teaching: true, Speaking: true, Reacting: false, Departing: false }

class AnimationStateMachine {
  constructor(charId) {
    this.charId = charId
    this.current = 'Idle'
    this.history = []
    this.stateStartTime = Date.now()
    this.pendingReturn = null
  }

  canTransition(toState) {
    if (toState === this.current) return true
    if (!STATE_INTERRUPTIBLE[this.current] && STATE_PRIORITY[toState] <= STATE_PRIORITY[this.current]) return false
    return STATE_PRIORITY[toState] >= STATE_PRIORITY[this.current] || STATE_INTERRUPTIBLE[this.current]
  }

  transition(toState, duration = null) {
    if (!this.canTransition(toState)) return false
    this.history.push({ from: this.current, to: toState, at: Date.now() })
    if (this.history.length > 50) this.history.shift()
    this.current = toState
    this.stateStartTime = Date.now()
    if (duration) {
      this.pendingReturn = setTimeout(() => {
        this.current = 'Idle'
        this.stateStartTime = Date.now()
        this.pendingReturn = null
      }, duration)
    }
    return true
  }

  dispose() {
    if (this.pendingReturn) clearTimeout(this.pendingReturn)
  }
}

// ─── Engine Event Bus ───────────────────────────────────────────────
class EngineEventBus {
  constructor() {
    this._queue = []
    this._dedupeMap = new Map()
    this._listeners = []
  }

  push(event) {
    const key = `${event.source}:${event.type}:${event.target}`
    const existing = this._dedupeMap.get(key)
    if (existing && Date.now() - existing.timestamp < 500) {
      Object.assign(existing, event, { timestamp: Date.now() })
      return
    }
    const e = { ...event, timestamp: event.timestamp || Date.now() }
    this._dedupeMap.set(key, e)
    this._queue.push(e)
    setTimeout(() => this._dedupeMap.delete(key), 600)
    this._flush()
  }

  _flush() {
    const now = Date.now()
    this._queue = this._queue.filter(e => !e.ttl || now - e.timestamp < e.ttl)
    this._queue.sort((a, b) => (b.priority || 0) - (a.priority || 0) || b.timestamp - a.timestamp)
    while (this._queue.length > 0) {
      const e = this._queue.shift()
      for (const fn of this._listeners) fn(e)
    }
  }

  on(fn) { this._listeners.push(fn) }
  off(fn) { this._listeners = this._listeners.filter(f => f !== fn) }
}

// ─── Priority Resolver ──────────────────────────────────────────────
class PriorityResolver {
  resolve(event, stateMachine) {
    if (!event || !stateMachine) return null
    const now = Date.now()
    if (event.ttl && now - event.timestamp > event.ttl) return null
    if (!stateMachine.canTransition(event._targetState || 'Reacting')) return null
    return event
  }
}

// ─── Blend Controller ───────────────────────────────────────────────
class BlendController {
  constructor() {
    this._layers = {}
  }

  setLayer(charId, paramId, value, weight = 1, decay = 0, source = 'unknown') {
    const key = `${charId}:${paramId}`
    if (!this._layers[key]) this._layers[key] = []
    const existing = this._layers[key].find(l => l.source === source)
    if (existing) {
      existing.value = value; existing.weight = weight; existing.decay = decay; existing.timestamp = Date.now()
    } else {
      this._layers[key].push({ value, weight, decay, source, timestamp: Date.now() })
    }
  }

  resolve(charId, paramId) {
    const key = `${charId}:${paramId}`
    const layers = this._layers[key]
    if (!layers || layers.length === 0) return null
    const now = Date.now()
    let totalWeight = 0
    let blended = 0
    for (let i = layers.length - 1; i >= 0; i--) {
      const l = layers[i]
      let w = l.weight
      if (l.decay > 0) {
        const elapsed = (now - l.timestamp) / 1000
        w *= Math.max(0, 1 - elapsed * l.decay)
        if (w <= 0.001) { layers.splice(i, 1); continue }
      }
      totalWeight += w
      blended += l.value * w
    }
    return totalWeight > 0 ? blended / totalWeight : null
  }

  clear(charId) {
    for (const key of Object.keys(this._layers)) {
      if (key.startsWith(charId + ':')) delete this._layers[key]
    }
  }
}

// ─── Gaze Controller ────────────────────────────────────────────────
class GazeController {
  constructor() {
    this._targets = {}
    this._mousePos = { x: 0.5, y: 0.5 }
    this._wanderAngle = 0
    this._lastGlance = 0
    this._boundMouseMove = this._onMouseMove.bind(this)
    if (typeof window !== 'undefined') {
      window.addEventListener('mousemove', this._boundMouseMove, { passive: true })
    }
  }

  _onMouseMove(e) {
    this._mousePos.x = e.clientX / window.innerWidth
    this._mousePos.y = e.clientY / window.innerHeight
  }

  setTarget(charId, targetName, duration = 0) {
    this._targets[charId] = { target: targetName, setAt: Date.now(), duration }
  }

  getEyeBall(charId, dt) {
    const entry = this._targets[charId]
    const targetName = entry?.target || 'wander'
    if (entry?.duration && Date.now() - entry.setAt > entry.duration) {
      this._targets[charId] = { target: 'player', setAt: Date.now(), duration: 0 }
    }

    const target = GAZE_TARGETS[targetName]
    if (!target) return this._computeWander(dt)

    if (targetName === 'mouse') {
      return { x: (this._mousePos.x - 0.5) * 0.6, y: (this._mousePos.y - 0.5) * 0.4 }
    }
    if (targetName === 'wander') return this._computeWander(dt)
    return { x: target.eyeBallX || 0, y: target.eyeBallY || 0 }
  }

  _computeWander(dt) {
    this._wanderAngle += dt * 0.3
    return {
      x: Math.sin(this._wanderAngle) * 0.15 + Math.sin(this._wanderAngle * 0.7) * 0.08,
      y: Math.cos(this._wanderAngle * 0.8) * 0.1,
    }
  }

  dispose() {
    if (typeof window !== 'undefined') {
      window.removeEventListener('mousemove', this._boundMouseMove)
    }
  }
}

// ─── Breath Modulator ───────────────────────────────────────────────
class BreathModulator {
  constructor() {
    this._charBreaths = {}
    this._bgmMod = { periodScale: 1, amplitudeScale: 1 }
  }

  getBreath(charId, now) {
    if (!this._charBreaths[charId]) {
      this._charBreaths[charId] = {
        phase: Math.random() * Math.PI * 2,
        basePeriod: 3.2 + Math.random() * 1.3,
        emotionMod: { periodScale: 1, amplitudeScale: 1 },
      }
    }
    const b = this._charBreaths[charId]
    const period = b.basePeriod * b.emotionMod.periodScale * this._bgmMod.periodScale
    const amplitude = 0.5 * b.emotionMod.amplitudeScale * this._bgmMod.amplitudeScale
    const t = now / 1000
    const asymmetry = 0.03 * Math.sin(t * 0.37 + b.phase * 2.1)
    return Math.sin((t / period) * Math.PI * 2 + b.phase) * amplitude + asymmetry
  }

  setEmotionMod(charId, mod) {
    if (!this._charBreaths[charId]) this.getBreath(charId, Date.now())
    this._charBreaths[charId].emotionMod = { ...this._charBreaths[charId].emotionMod, ...mod }
  }

  setBgmMod(mod) {
    this._bgmMod = { ...this._bgmMod, ...mod }
  }

  syncBreaths(charIds, syncFactor) {
    if (charIds.length < 2 || syncFactor <= 0) return
    const phases = charIds.map(id => this._charBreaths[id]?.phase || 0)
    const avgPhase = phases.reduce((a, b) => a + b, 0) / phases.length
    for (const id of charIds) {
      if (this._charBreaths[id]) {
        this._charBreaths[id].phase += (avgPhase - this._charBreaths[id].phase) * syncFactor * 0.01
      }
    }
  }
}

// ─── Emergent Animation Resolver ────────────────────────────────────
class EmergentAnimationResolver {
  constructor(enabled) {
    this._enabled = enabled
    this._lastTrigger = 0
    this._cooldown = 10000
  }

  check(signals) {
    if (!this._enabled) return null
    const now = Date.now()
    if (now - this._lastTrigger < this._cooldown) return null
    for (const rule of EMERGENT_RULES) {
      try {
        if (rule.condition(signals)) {
          this._lastTrigger = now
          return rule
        }
      } catch { /* ignore malformed rules */ }
    }
    return null
  }
}

// ─── Model Pool (LRU) ──────────────────────────────────────────────
class ModelPool {
  constructor(maxSize) {
    this._max = maxSize
    this._models = new Map()
    this._accessOrder = []
  }

  has(charId) { return this._models.has(charId) }
  get(charId) {
    if (!this._models.has(charId)) return null
    this._touch(charId)
    return this._models.get(charId)
  }

  set(charId, model) {
    if (this._models.size >= this._max && !this._models.has(charId)) {
      this._evict()
    }
    this._models.set(charId, model)
    this._touch(charId)
  }

  remove(charId) {
    const m = this._models.get(charId)
    if (m) { m.destroy(); this._models.delete(charId) }
    this._accessOrder = this._accessOrder.filter(id => id !== charId)
  }

  _touch(charId) {
    this._accessOrder = this._accessOrder.filter(id => id !== charId)
    this._accessOrder.push(charId)
  }

  _evict() {
    if (this._accessOrder.length === 0) return
    const oldest = this._accessOrder.shift()
    this.remove(oldest)
  }

  dispose() {
    for (const [, m] of this._models) m.destroy()
    this._models.clear()
    this._accessOrder = []
  }

  entries() { return this._models.entries() }
  keys() { return this._models.keys() }
}

// ─── Lip Sync (text-length based fallback) ──────────────────────────
class LipSyncController {
  constructor() {
    this._active = {}
    this._analyser = null
    this._freqData = null
    this._timeData = null
    this._smoothed = {}
  }

  bindAnalyser(analyserNode) {
    this._analyser = analyserNode
    if (analyserNode) {
      this._freqData = new Uint8Array(analyserNode.frequencyBinCount)
      this._timeData = new Uint8Array(analyserNode.fftSize)
    }
  }

  startSpeaking(charId, textLength) {
    const duration = Math.min(Math.max(textLength * 80, 800), 8000)
    this._active[charId] = { start: Date.now(), duration, textLength }
    if (!this._smoothed[charId]) this._smoothed[charId] = 0
  }

  stopSpeaking(charId) {
    delete this._active[charId]
    this._smoothed[charId] = 0
  }

  _getAudioAmplitude() {
    if (!this._analyser || !this._freqData) return 0
    this._analyser.getByteFrequencyData(this._freqData)
    this._analyser.getByteTimeDomainData(this._timeData)

    const sampleRate = this._analyser.context?.sampleRate || 44100
    const binSize = sampleRate / this._analyser.fftSize
    const minBin = Math.floor(300 / binSize)
    const maxBin = Math.min(Math.ceil(3000 / binSize), this._freqData.length - 1)
    let vowelSum = 0, vowelCount = 0
    for (let i = minBin; i <= maxBin; i++) { vowelSum += this._freqData[i]; vowelCount++ }
    const vowelAmp = vowelCount > 0 ? (vowelSum / vowelCount) / 255 : 0

    let rmsSum = 0
    for (let i = 0; i < this._timeData.length; i++) {
      const v = (this._timeData[i] - 128) / 128
      rmsSum += v * v
    }
    const rmsAmp = Math.sqrt(rmsSum / this._timeData.length)
    return (vowelAmp * 0.6 + rmsAmp * 0.4) * 2.5
  }

  getMouthOpen(charId, now) {
    const entry = this._active[charId]
    if (!entry) return 0
    const elapsed = now - entry.start
    if (elapsed > entry.duration) { delete this._active[charId]; this._smoothed[charId] = 0; return 0 }

    let targetValue
    if (this._analyser) {
      targetValue = Math.min(this._getAudioAmplitude(), 1.0)
    } else {
      const progress = elapsed / entry.duration
      const base = Math.sin(progress * Math.PI) * 0.3
      const rapid = Math.sin(elapsed / 80 * Math.PI) * 0.4
      const variation = Math.sin(elapsed / 200 * Math.PI * 1.7) * 0.15
      targetValue = Math.max(0, Math.min(1, base + Math.abs(rapid) + variation))
    }

    const prev = this._smoothed[charId] || 0
    const openSpeed = 0.35
    const closeSpeed = 0.12
    if (targetValue > prev) {
      this._smoothed[charId] = prev + (targetValue - prev) * openSpeed
    } else {
      this._smoothed[charId] = prev + (targetValue - prev) * closeSpeed
    }
    if (this._smoothed[charId] < 0.02) this._smoothed[charId] = 0

    return this._smoothed[charId]
  }
}

// ═══════════════════════════════════════════════════════════════════
//  Live2DManager — The Heart
// ═══════════════════════════════════════════════════════════════════
export function useLive2DManager() {
  const performanceTier = detectPerformanceTier()
  const tierConfig = TIER_CONFIG[performanceTier]
  const live2dEnabled = ref(performanceTier !== 'fallback')
  const live2dReady = ref(false)
  const loadingModels = reactive({})
  const activeCharacters = reactive({})
  const debugLog = reactive([])

  let _pixiApp = null
  let _canvasRef = null
  const _stateMachines = {}
  const _eventBus = new EngineEventBus()
  const _priorityResolver = new PriorityResolver()
  const _blendController = new BlendController()
  const _gazeController = new GazeController()
  const _breathModulator = new BreathModulator()
  const _emergentResolver = new EmergentAnimationResolver(tierConfig.emergent)
  const _modelPool = new ModelPool(tierConfig.maxModels)
  const _lipSync = new LipSyncController()
  const _microActionTimers = {}
  const _expressionTransitions = {}
  let _tickerCallback = null
  let _disposed = false

  const _currentSignals = reactive({
    cognitive: null,
    symbiosis: 0,
    affective: null,
    autonomy: null,
    teaching: null,
    behavior_curiosity: 0,
    memory_recent: false,
  })

  // ─── Debug Logging ──────────────────────────────────────────────
  function _log(source, message, data) {
    const entry = { source, message, data, timestamp: Date.now() }
    debugLog.push(entry)
    if (debugLog.length > 200) debugLog.splice(0, debugLog.length - 200)
  }

  // ─── PixiJS Initialization ──────────────────────────────────────
  async function initCanvas(canvasEl) {
    if (_pixiApp || !canvasEl || !live2dEnabled.value) return
    const libsOk = await _ensureLive2DLibs()
    if (!libsOk || !PIXI) {
      live2dEnabled.value = false
      _log('init', 'Live2D libs not available, fallback to static sprites')
      return
    }
    _canvasRef = canvasEl
    _pixiApp = markRaw(new PIXI.Application({
      view: canvasEl,
      transparent: true,
      backgroundAlpha: 0,
      antialias: _perfTier === 'high',
      resolution: _getMobileSafeDPR(),
      autoDensity: true,
      resizeTo: canvasEl.parentElement,
    }))
    _startTicker()
    live2dReady.value = true
    _log('init', 'PixiJS application initialized', { tier: performanceTier })
  }

  // ─── Model Loading ─────────────────────────────────────────────
  async function loadModel(charId) {
    if (_modelPool.has(charId) || loadingModels[charId] || !_pixiApp || !Live2DModel) return _modelPool.get(charId)
    loadingModels[charId] = true

    try {
      const modelPath = assetPath(`assets/live2d/${charId}/${charId}.model3.json`)
      const model = await Live2DModel.from(modelPath, { autoInteract: false })
      if (_disposed) { model.destroy(); return null }

      model.anchor.set(0.5, 1)
      _configureModelForTier(model)
      _modelPool.set(charId, markRaw(model))
      _stateMachines[charId] = new AnimationStateMachine(charId)
      _log('model', `Loaded Live2D model: ${charId}`, { charId })
      return model
    } catch (err) {
      _log('model', `Failed to load model: ${charId}`, { error: err.message })
      return null
    } finally {
      delete loadingModels[charId]
    }
  }

  function _configureModelForTier(model) {
    if (!tierConfig.physics && model.internalModel?.physicsManager) {
      model.internalModel.physicsManager = null
    }
  }

  // ─── Character Show/Hide ────────────────────────────────────────
  async function showCharacter(charId, position = 'center', expression = 'normal') {
    if (!_pixiApp) return
    const model = await loadModel(charId)
    if (!model) return

    const stage = _pixiApp.stage
    if (!model.parent) stage.addChild(model)

    _positionModel(model, position)
    model.alpha = 0

    activeCharacters[charId] = { position, expression, entering: true }

    _animateAlpha(model, 0, 1, 600, () => {
      if (activeCharacters[charId]) activeCharacters[charId].entering = false
    })

    setExpression(charId, expression)
    _startIdleBehavior(charId)
    _log('show', `Character shown: ${charId}`, { position, expression })
  }

  function hideCharacter(charId, animation = 'fade_out') {
    const model = _modelPool.get(charId)
    if (!model) return

    const sm = _stateMachines[charId]
    if (sm) sm.transition('Departing')

    _animateAlpha(model, model.alpha, 0, 500, () => {
      if (model.parent) model.parent.removeChild(model)
      _stopIdleBehavior(charId)
      delete activeCharacters[charId]
      if (sm) sm.dispose()
      delete _stateMachines[charId]
    })
    _log('hide', `Character hidden: ${charId}`, { animation })
  }

  function hideAllCharacters() {
    for (const charId of Object.keys(activeCharacters)) {
      hideCharacter(charId)
    }
  }

  // ─── Positioning ────────────────────────────────────────────────
  function _positionModel(model, position, offsetX = 0) {
    if (!_pixiApp) return
    const w = _pixiApp.screen.width
    const h = _pixiApp.screen.height
    const scale = Math.min(w / 800, h / 1000) * 0.7
    model.scale.set(scale)

    const bottomMargin = h * 0.12
    model.y = h - bottomMargin

    switch (position) {
      case 'left': model.x = w * 0.2 + offsetX; break
      case 'right': model.x = w * 0.8 + offsetX; break
      case 'center': default: model.x = w * 0.5 + offsetX; break
    }
  }

  function moveCharacter(charId, toPosition, duration = 500) {
    const model = _modelPool.get(charId)
    if (!model || !_pixiApp) return
    if (activeCharacters[charId]) activeCharacters[charId].position = toPosition

    const w = _pixiApp.screen.width
    let targetX
    switch (toPosition) {
      case 'left': targetX = w * 0.2; break
      case 'right': targetX = w * 0.8; break
      case 'center': default: targetX = w * 0.5; break
    }
    _animateProperty(model, 'x', model.x, targetX, duration)
  }

  // ─── Expression System (with emotional inertia) ─────────────────
  function setExpression(charId, expressionName, blendDuration = 800) {
    const model = _modelPool.get(charId)
    if (!model) return

    const prev = _expressionTransitions[charId]
    _expressionTransitions[charId] = {
      target: expressionName,
      startedAt: Date.now(),
      duration: blendDuration,
      from: prev?.target || 'normal',
    }

    try {
      const idx = model.internalModel?.settings?.expressions?.findIndex(
        e => e.Name === expressionName || e.name === expressionName
      )
      if (idx !== undefined && idx >= 0) {
        model.expression(idx)
      }
    } catch { /* expression not found, graceful fallback */ }

    _log('expression', `Expression set: ${charId} → ${expressionName}`, { blendDuration })
  }

  // ─── Motion System ──────────────────────────────────────────────
  function playMotion(charId, motionGroup, index = 0, priority = 2) {
    const model = _modelPool.get(charId)
    if (!model) return
    try {
      model.motion(motionGroup, index, priority)
      _log('motion', `Motion played: ${charId} → ${motionGroup}[${index}]`, { priority })
    } catch (err) {
      _log('motion', `Motion failed: ${charId} → ${motionGroup}`, { error: err.message })
    }
  }

  // ─── Direct Parameter Control ───────────────────────────────────
  function setParam(charId, paramId, value, duration = 0) {
    const model = _modelPool.get(charId)
    if (!model) return
    if (duration > 0) {
      _blendController.setLayer(charId, paramId, value, 1.0, 1 / (duration / 1000), 'direct')
    } else {
      try {
        const core = model.internalModel?.coreModel
        if (core) {
          const idx = core.getParameterIndex(paramId)
          if (idx >= 0) core.setParameterValueById(paramId, value)
        }
      } catch { /* param not found */ }
    }
  }

  // ─── Animation Sequence Playback ────────────────────────────────
  function playSequence(charId, steps) {
    if (!steps || steps.length === 0) return
    const sm = _stateMachines[charId]
    if (sm) sm.transition('Reacting', steps.reduce((sum, s) => sum + (s.duration || s.hold || 500), 0))

    let delay = 0
    for (const step of steps) {
      const d = delay
      setTimeout(() => {
        if (!activeCharacters[charId]) return
        if (step.expression) setExpression(charId, step.expression)
        if (step.motion) playMotion(charId, step.motion)
        if (step.gaze) _gazeController.setTarget(charId, step.gaze)
        if (step.param) setParam(charId, step.param, step.value)
      }, d)
      delay += step.duration || step.hold || 500
    }
    _log('sequence', `Sequence played: ${charId}`, { steps: steps.length, totalDuration: delay })
  }

  // ─── Speaking (Lip-Sync + State) ────────────────────────────────
  function startSpeaking(charId, text) {
    const sm = _stateMachines[charId]
    if (sm) sm.transition('Speaking')
    _lipSync.startSpeaking(charId, (text || '').length)
    _gazeController.setTarget(charId, 'player')
    _log('speak', `Speaking started: ${charId}`, { textLen: (text || '').length })
  }

  function stopSpeaking(charId) {
    const sm = _stateMachines[charId]
    if (sm && sm.current === 'Speaking') sm.transition('Idle')
    _lipSync.stopSpeaking(charId)
  }

  // ─── Idle Micro-Actions (Principle 5: silence is performance) ───
  function _startIdleBehavior(charId) {
    _stopIdleBehavior(charId)
    const interval = (8000 + Math.random() * 12000) / tierConfig.microActionFreq
    _microActionTimers[charId] = setInterval(() => {
      if (!activeCharacters[charId]) return
      const sm = _stateMachines[charId]
      if (sm?.current !== 'Idle') return
      _performMicroAction(charId)
    }, interval)
  }

  function _stopIdleBehavior(charId) {
    if (_microActionTimers[charId]) {
      clearInterval(_microActionTimers[charId])
      delete _microActionTimers[charId]
    }
  }

  function _performMicroAction(charId) {
    const tier = _getSymbiosisTier(charId)
    const pool = tier.microActionPool || []
    if (pool.length === 0) return

    const action = pool[Math.floor(Math.random() * pool.length)]
    const motionName = `micro_${action}`
    playMotion(charId, motionName, 0, 1)

    if (action === 'peek_at_player' || action === 'peek_shy') {
      _gazeController.setTarget(charId, 'player', 1500)
      setTimeout(() => {
        if (activeCharacters[charId]) _gazeController.setTarget(charId, 'away', 800)
      }, 1500)
    }
    _log('micro', `Micro-action: ${charId} → ${action}`)
  }

  // ─── Symbiosis Tier Lookup ──────────────────────────────────────
  let _symbioticRef = null
  function _getSymbiosisTier(charId) {
    let influence = 0
    if (_symbioticRef) {
      try {
        const profile = _symbioticRef.getProfile?.(charId)
        influence = profile?.player_influence || 0
      } catch { /* */ }
    }
    if (influence >= 0.7) return SYMBIOSIS_ANIMATION_TIERS.tier3
    if (influence >= 0.4) return SYMBIOSIS_ANIMATION_TIERS.tier2
    if (influence >= 0.2) return SYMBIOSIS_ANIMATION_TIERS.tier1
    return SYMBIOSIS_ANIMATION_TIERS.tier0
  }

  // ─── Main Ticker (runs every frame) ─────────────────────────────
  function _startTicker() {
    if (_tickerCallback) return
    _tickerCallback = (dt) => {
      if (_disposed) return
      const now = Date.now()
      const dtSec = dt / 60

      for (const [charId, model] of _modelPool.entries()) {
        if (!activeCharacters[charId]) continue
        const core = model.internalModel?.coreModel
        if (!core) continue

        // Principle 1: Breath never stops
        const breath = _breathModulator.getBreath(charId, now)
        _safeSetParam(core, 'ParamBreath', breath)

        // Principle 2: Asymmetric blink
        _applyAsymmetricBlink(core, charId, now)

        // Principle 4: Gaze is the soul's window
        const gaze = _gazeController.getEyeBall(charId, dtSec)
        _safeSetParam(core, 'ParamEyeBallX', gaze.x)
        _safeSetParam(core, 'ParamEyeBallY', gaze.y)

        // Lip sync
        const mouth = _lipSync.getMouthOpen(charId, now)
        if (mouth > 0) _safeSetParam(core, 'ParamMouthOpenY', mouth)

        // Blend controller overrides
        for (const paramId of ['ParamAngleX', 'ParamAngleY', 'ParamAngleZ', 'ParamBodyAngleX', 'ParamBodyAngleY',
          'ParamBrowLY', 'ParamBrowRY', 'ParamMouthForm', 'ParamArmLA', 'ParamArmRA']) {
          const blended = _blendController.resolve(charId, paramId)
          if (blended !== null) _safeSetParam(core, paramId, blended)
        }

        // Symbiosis position offset
        const tier = _getSymbiosisTier(charId)
        if (tier.positionOffset && activeCharacters[charId]) {
          const pos = activeCharacters[charId].position
          _positionModel(model, pos, tier.positionOffset)
        }
      }

      // Principle 6: Music shapes the body (breath sync from BGM)
      const charIds = Object.keys(activeCharacters)
      if (charIds.length >= 2) {
        const syncFactor = _getSymbiosisTier(charIds[0]).breathSync || 0
        if (syncFactor > 0) _breathModulator.syncBreaths(charIds, syncFactor)
      }
    }
    _pixiApp.ticker.add(_tickerCallback)
  }

  const _blinkTimers = {}
  function _applyAsymmetricBlink(core, charId, now) {
    if (!_blinkTimers[charId]) {
      _blinkTimers[charId] = { nextBlink: now + 2000 + Math.random() * 4000, blinking: false, phase: 0 }
    }
    const bt = _blinkTimers[charId]
    if (!bt.blinking && now >= bt.nextBlink) {
      bt.blinking = true
      bt.phase = 0
      bt.asymmetry = 30 + Math.random() * 50
    }
    if (bt.blinking) {
      bt.phase += 16
      const totalDuration = 150
      const progress = bt.phase / totalDuration
      if (progress >= 1) {
        bt.blinking = false
        bt.nextBlink = now + 2000 + Math.random() * 5000
        _safeSetParam(core, 'ParamEyeLOpen', 1)
        _safeSetParam(core, 'ParamEyeROpen', 1)
      } else {
        const blink = progress < 0.5 ? 1 - progress * 2 : (progress - 0.5) * 2
        _safeSetParam(core, 'ParamEyeLOpen', blink)
        const rDelay = bt.asymmetry / totalDuration
        const rProgress = Math.max(0, progress - rDelay)
        const rBlink = rProgress < 0.4 ? 1 - rProgress * 2.5 : Math.min(1, (rProgress - 0.4) * 2.5)
        _safeSetParam(core, 'ParamEyeROpen', rBlink)
      }
    }
  }

  function _safeSetParam(core, paramId, value) {
    try { core.setParameterValueById(paramId, value) } catch { /* param not found */ }
  }

  // ─── Alpha Animation Helper ─────────────────────────────────────
  function _animateAlpha(model, from, to, duration, onDone) {
    const start = Date.now()
    model.alpha = from
    const tick = () => {
      const elapsed = Date.now() - start
      const t = Math.min(1, elapsed / duration)
      const eased = t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2
      model.alpha = from + (to - from) * eased
      if (t < 1) requestAnimationFrame(tick)
      else { model.alpha = to; onDone?.() }
    }
    requestAnimationFrame(tick)
  }

  function _animateProperty(obj, prop, from, to, duration) {
    const start = Date.now()
    const tick = () => {
      const t = Math.min(1, (Date.now() - start) / duration)
      const eased = t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2
      obj[prop] = from + (to - from) * eased
      if (t < 1) requestAnimationFrame(tick)
    }
    requestAnimationFrame(tick)
  }

  // ═══ 12-Engine Bridge Methods ════════════════════════════════════

  // 4.1 WorldVM Bridge
  function bridgeWorldVM(worldVM) {
    if (!worldVM) return
    const origNotify = worldVM._notify_change
    if (typeof origNotify === 'function') {
      worldVM._notify_change = function (change) {
        origNotify.call(worldVM, change)
        _onWorldVMEvent(change)
      }
    }
    _log('bridge', 'WorldVM bridge connected')
  }

  function _onWorldVMEvent(change) {
    if (!change) return
    const charId = change.entity_id || change.character
    if (!charId || !activeCharacters[charId]) return

    if (change.property === 'expression') {
      setExpression(charId, change.value)
    } else if (change.property === 'mood') {
      const map = EMOTION_TO_LIVE2D[change.value]
      if (map) {
        if (map.expression) setExpression(charId, map.expression)
        if (map.motion) playMotion(charId, map.motion)
        if (map.gazeBias) _gazeController.setTarget(charId, map.gazeBias)
        if (map.breathMod) _breathModulator.setEmotionMod(charId, map.breathMod)
      }
    }
    _eventBus.push({
      source: 'world_vm', type: change.property, target: charId,
      payload: change, priority: 8, ttl: 2000,
    })
  }

  // WorldVM _l2d sub-object for Python direct control
  function createL2DProxy(charId) {
    return {
      param: (paramId, value) => setParam(charId, paramId, value),
      motion: (motionName, idx) => playMotion(charId, motionName, idx || 0, 3),
      look_at: (target) => _gazeController.setTarget(charId, target),
      sequence: (steps) => playSequence(charId, steps),
    }
  }

  // 4.2 CognitiveGraph Bridge
  function bridgeCognitive(cognitiveGraph) {
    if (!cognitiveGraph?.onConceptTransition) {
      if (cognitiveGraph) {
        const origRecord = cognitiveGraph.recordOutcome
        if (typeof origRecord === 'function') {
          cognitiveGraph.recordOutcome = function (...args) {
            const result = origRecord.apply(cognitiveGraph, args)
            _onCognitiveTransition(args[0], null, cognitiveGraph.getConceptState?.(args[0]))
            return result
          }
        }
      }
    } else {
      cognitiveGraph.onConceptTransition((conceptId, from, to) => {
        _onCognitiveTransition(conceptId, from, to)
      })
    }
    _log('bridge', 'CognitiveGraph bridge connected')
  }

  function _onCognitiveTransition(conceptId, from, to) {
    _currentSignals.cognitive = to
    const charIds = Object.keys(activeCharacters)
    if (charIds.length === 0) return
    const charId = charIds[0]

    const reactions = LIVE2D_ANIMATION_MAP.cognitive_transitions || {}
    const transKey = to || 'lit'
    const reaction = reactions[transKey]
    if (!reaction) return

    if (reaction.perCharacter && reaction.perCharacter[charId]) {
      playSequence(charId, reaction.perCharacter[charId])
    } else if (reaction.sequence) {
      playSequence(charId, reaction.sequence)
    } else {
      if (reaction.expression) setExpression(charId, reaction.expression, reaction.duration || 1500)
      if (reaction.motion) playMotion(charId, reaction.motion)
      if (reaction.gaze) _gazeController.setTarget(charId, reaction.gaze, reaction.duration || 1500)
    }

    _eventBus.push({
      source: 'cognitive_graph', type: 'concept_transition', target: charId,
      payload: { conceptId, from, to }, priority: to === 'blazing' ? 9 : 7, ttl: 3000,
    })
    _checkEmergent()
  }

  // 4.3 AffectiveResonance Bridge
  function bridgeAffective(affectiveResonance) {
    if (!affectiveResonance) return
    const origApply = affectiveResonance.applyEffect || affectiveResonance._applyEffect
    if (typeof origApply === 'function') {
      const patchTarget = affectiveResonance.applyEffect ? affectiveResonance : affectiveResonance
      const methodName = affectiveResonance.applyEffect ? 'applyEffect' : '_applyEffect'
      patchTarget[methodName] = function (effectName, ...rest) {
        origApply.call(patchTarget, effectName, ...rest)
        _onAffectiveEffect(effectName)
      }
    }
    _log('bridge', 'AffectiveResonance bridge connected')
  }

  function _onAffectiveEffect(effectName) {
    _currentSignals.affective = effectName
    const mapping = EMOTION_TO_LIVE2D[effectName]
    if (!mapping) return

    for (const charId of Object.keys(activeCharacters)) {
      if (mapping.expression) setExpression(charId, mapping.expression)
      if (mapping.motion) playMotion(charId, mapping.motion)
      if (mapping.gazeBias) _gazeController.setTarget(charId, mapping.gazeBias, 3000)
      if (mapping.breathMod) _breathModulator.setEmotionMod(charId, mapping.breathMod)
    }
    _checkEmergent()
  }

  // 4.4 CharacterAutonomy Bridge
  function bridgeAutonomy(characterAutonomy) {
    if (!characterAutonomy) return
    const origTick = characterAutonomy.autonomyTick
    if (typeof origTick === 'function') {
      characterAutonomy.autonomyTick = function (...args) {
        const result = origTick.apply(characterAutonomy, args)
        const notifs = characterAutonomy.pendingNotifications?.value || []
        if (notifs.length > 0) _onAutonomyEvent(notifs[notifs.length - 1])
        return result
      }
    }
    _log('bridge', 'CharacterAutonomy bridge connected')
  }

  function _onAutonomyEvent(notif) {
    if (!notif) return
    _currentSignals.autonomy = notif.type
    const charId = notif.character
    if (!charId) return

    const reactions = LIVE2D_ANIMATION_MAP.autonomy || {}
    const reaction = reactions[notif.type]
    if (reaction?.sequence) {
      playSequence(charId, reaction.sequence)
    }
    _checkEmergent()
  }

  // 4.5 SymbioticCodeDNA Bridge
  function bridgeSymbiotic(symbioticCodeDNA) {
    _symbioticRef = symbioticCodeDNA || null
    if (symbioticCodeDNA) {
      const origRecord = symbioticCodeDNA.recordInteraction
      if (typeof origRecord === 'function') {
        symbioticCodeDNA.recordInteraction = function (charId, ...rest) {
          origRecord.call(symbioticCodeDNA, charId, ...rest)
          _onSymbioticUpdate(charId)
        }
      }
    }
    _log('bridge', 'SymbioticCodeDNA bridge connected')
  }

  function _onSymbioticUpdate(charId) {
    if (!activeCharacters[charId]) return
    const tier = _getSymbiosisTier(charId)
    _currentSignals.symbiosis = tier === SYMBIOSIS_ANIMATION_TIERS.tier3 ? 0.85 :
      tier === SYMBIOSIS_ANIMATION_TIERS.tier2 ? 0.55 :
      tier === SYMBIOSIS_ANIMATION_TIERS.tier1 ? 0.3 : 0.1

    if (tier.idleMotion) playMotion(charId, tier.idleMotion, 0, 1)
    _checkEmergent()
  }

  // 4.6 PedagogyKernel Bridge
  function bridgePedagogy(pedagogyKernel) {
    if (!pedagogyKernel) return
    _log('bridge', 'PedagogyKernel bridge connected')
  }

  function setTeachingState(charId, stateName) {
    const state = TEACHING_STATES[stateName]
    if (!state) return
    const sm = _stateMachines[charId]
    if (sm) sm.transition('Teaching')

    if (state.expression) setExpression(charId, state.expression)
    if (state.motion) playMotion(charId, state.motion)
    if (state.breathMod) _breathModulator.setEmotionMod(charId, state.breathMod)

    if (state.gazePattern) {
      let idx = 0
      const interval = state.gazeInterval || 2000
      const gazeLoop = setInterval(() => {
        if (!activeCharacters[charId] || sm?.current !== 'Teaching') {
          clearInterval(gazeLoop); return
        }
        _gazeController.setTarget(charId, state.gazePattern[idx % state.gazePattern.length])
        idx++
      }, interval)
    }

    _currentSignals.teaching = stateName
    _checkEmergent()
  }

  // 4.7 BehaviorProfiler Bridge
  let _behaviorRef = null
  function bridgeBehavior(behaviorProfiler) {
    _behaviorRef = behaviorProfiler || null
    _log('bridge', 'BehaviorProfiler bridge connected')
  }

  function _getResponseAmplitude() {
    if (!_behaviorRef) return { expressionIntensity: 0.8, transitionSmoothing: 0.5, teachingEnergy: 0.7, idleRelaxation: 0.5, reactionDelay: 300 }
    try {
      const profile = _behaviorRef.getProfileSnapshot?.() || {}
      return {
        expressionIntensity: 0.6 + (profile.boldness || 0.5) * 0.4,
        transitionSmoothing: 0.3 + (profile.empathy || 0.5) * 0.7,
        teachingEnergy: 0.5 + (profile.curiosity || 0.5) * 0.5,
        idleRelaxation: 0.3 + (profile.commitment || 0.5) * 0.5,
        reactionDelay: 400 - (profile.impulsivity || 0.5) * 250,
      }
    } catch {
      return { expressionIntensity: 0.8, transitionSmoothing: 0.5, teachingEnergy: 0.7, idleRelaxation: 0.5, reactionDelay: 300 }
    }
  }

  // 4.8 LLM Bridge (live2d_hints from LLM responses)
  function applyLLMHints(charId, hints) {
    if (!hints || !activeCharacters[charId]) return
    if (hints.motion) playMotion(charId, hints.motion)
    if (hints.expression) setExpression(charId, hints.expression)
    if (hints.gaze) _gazeController.setTarget(charId, hints.gaze, 3000)
    if (hints.breath === 'fast') _breathModulator.setEmotionMod(charId, { periodScale: 0.7, amplitudeScale: 1.3 })
    if (hints.breath === 'slow') _breathModulator.setEmotionMod(charId, { periodScale: 1.3, amplitudeScale: 0.8 })
    if (hints.sequence) playSequence(charId, hints.sequence)
    _log('llm', `LLM hints applied: ${charId}`, hints)
  }

  // 4.9 AudioManager Bridge
  function bridgeAudio(audioManager) {
    if (!audioManager) return
    watch(() => audioManager.currentBgmId?.value, (bgmId) => {
      if (!bgmId) return
      _onBgmChange(bgmId)
    })
    _log('bridge', 'AudioManager bridge connected')
  }

  function _onBgmChange(bgmId) {
    const mod = BGM_MOOD_TO_BREATH[bgmId]
    if (mod) {
      _breathModulator.setBgmMod(mod)
    } else {
      _breathModulator.setBgmMod({ periodScale: 1, amplitudeScale: 1 })
    }
  }

  // 4.10 NarrativeWeaver Bridge
  function bridgeNarrative(narrativeWeaver) {
    if (!narrativeWeaver) return
    _log('bridge', 'NarrativeWeaver bridge connected')
  }

  // 4.11 SpacedRepetition Bridge
  function bridgeSRS(spacedRepetition) {
    if (!spacedRepetition) return
    _log('bridge', 'SpacedRepetition bridge connected')
  }

  function onReviewStart(charId) {
    if (!activeCharacters[charId]) return
    playSequence(charId, [
      { expression: 'thinking', gaze: 'memory', duration: 800 },
      { gaze: 'player', duration: 400 },
    ])
  }

  function onReviewResult(charId, success) {
    if (!activeCharacters[charId]) return
    if (success) {
      setExpression(charId, 'smile', 600)
    } else {
      setExpression(charId, 'gentle_smile', 600)
      _breathModulator.setEmotionMod(charId, { periodScale: 1.1, amplitudeScale: 0.9 })
    }
  }

  // 4.12 PersistentMemory & TemporalCodeDB Bridge
  function bridgeMemory(persistentMemory) {
    if (!persistentMemory) return
    _log('bridge', 'PersistentMemory bridge connected')
  }

  function bridgeTemporal(temporalCodeDB) {
    if (!temporalCodeDB) return
    _log('bridge', 'TemporalCodeDB bridge connected')
  }

  function onMemoryReference(charId, emotion) {
    if (!activeCharacters[charId]) return
    const flashMap = {
      warm: 'gentle_smile', funny: 'smile', bittersweet: 'sad',
      tense: 'thinking', romantic: 'blush',
    }
    const expr = flashMap[emotion] || 'thinking'
    playSequence(charId, [
      { expression: expr, duration: 300 },
      { expression: activeCharacters[charId]?.expression || 'normal', duration: 500 },
    ])
  }

  function onMilestone(charId) {
    if (!activeCharacters[charId]) return
    playSequence(charId, [
      { expression: 'surprised', duration: 500 },
      { expression: 'proud', motion: 'react_celebration', duration: 2000 },
      { expression: 'warm_smile', gaze: 'player', duration: 1500 },
    ])
  }

  // ─── Emergent Check ─────────────────────────────────────────────
  function _checkEmergent() {
    const rule = _emergentResolver.check(_currentSignals)
    if (!rule) return
    const charIds = Object.keys(activeCharacters)
    if (charIds.length === 0) return
    _log('emergent', `Emergent animation triggered: ${rule.animation}`, { description: rule.description })
    for (const charId of charIds) {
      if (rule.sequence) playSequence(charId, rule.sequence)
      else if (rule.animation) playMotion(charId, rule.animation)
    }
  }

  // ─── Transition Coordination ────────────────────────────────────
  function prepareTransition() {
    for (const charId of Object.keys(activeCharacters)) {
      _stopIdleBehavior(charId)
      _lipSync.stopSpeaking(charId)
    }
  }

  function onTransitionComplete() {
    for (const charId of Object.keys(activeCharacters)) {
      _startIdleBehavior(charId)
    }
  }

  // ─── Save/Load State ────────────────────────────────────────────
  function getState() {
    const state = {}
    for (const [charId, data] of Object.entries(activeCharacters)) {
      state[charId] = {
        currentExpression: _expressionTransitions[charId]?.target || 'normal',
        currentMotion: _stateMachines[charId]?.current || 'Idle',
        gazeTarget: _gazeController._targets[charId]?.target || 'player',
        symbiosisTier: _currentSignals.symbiosis,
      }
    }
    return state
  }

  function restoreState(savedState) {
    if (!savedState) return
    for (const [charId, data] of Object.entries(savedState)) {
      if (activeCharacters[charId]) {
        if (data.currentExpression) setExpression(charId, data.currentExpression, 0)
        if (data.gazeTarget) _gazeController.setTarget(charId, data.gazeTarget)
      }
    }
  }

  // ─── Resize Handler ─────────────────────────────────────────────
  function handleResize() {
    if (!_pixiApp) return
    _pixiApp.renderer.resize(_pixiApp.screen.width, _pixiApp.screen.height)
    for (const [charId, model] of _modelPool.entries()) {
      if (activeCharacters[charId]) {
        _positionModel(model, activeCharacters[charId].position)
      }
    }
  }

  // ─── Dispose ────────────────────────────────────────────────────
  function dispose() {
    _disposed = true
    for (const charId of Object.keys(_microActionTimers)) {
      clearInterval(_microActionTimers[charId])
    }
    _gazeController.dispose()
    _modelPool.dispose()
    for (const sm of Object.values(_stateMachines)) sm.dispose()
    if (_pixiApp) {
      if (_tickerCallback) _pixiApp.ticker.remove(_tickerCallback)
      _pixiApp.destroy(true, { children: true, texture: true, baseTexture: true })
      _pixiApp = null
    }
  }

  // ─── Public API ─────────────────────────────────────────────────
  return {
    // State
    live2dEnabled,
    live2dReady,
    loadingModels,
    activeCharacters,
    debugLog,
    performanceTier,

    // Initialization
    initCanvas,
    handleResize,
    dispose,

    // Character management
    loadModel,
    showCharacter,
    hideCharacter,
    hideAllCharacters,
    moveCharacter,

    // Animation
    setExpression,
    playMotion,
    setParam,
    playSequence,
    startSpeaking,
    stopSpeaking,

    // Teaching
    setTeachingState,

    // LLM hints
    applyLLMHints,

    // Review
    onReviewStart,
    onReviewResult,

    // Memory
    onMemoryReference,
    onMilestone,

    // Transition
    prepareTransition,
    onTransitionComplete,

    // Save/Load
    getState: () => ({ live2dState: getState() }),
    restoreState: (s) => restoreState(s?.live2dState),

    // WorldVM proxy factory
    createL2DProxy,

    // 12-Engine Bridges
    bridgeWorldVM,
    bridgeCognitive,
    bridgeAffective,
    bridgeAutonomy,
    bridgeSymbiotic,
    bridgePedagogy,
    bridgeBehavior,
    bridgeAudio,
    bridgeNarrative,
    bridgeSRS,
    bridgeMemory,
    bridgeTemporal,

    // Audio-driven Lip Sync
    bindAudioAnalyser: (analyserNode) => _lipSync.bindAnalyser(analyserNode),

    // Internal refs (for DebugConsole)
    _eventBus,
    _stateMachines,
    _blendController,
    _gazeController,
    _breathModulator,
    _currentSignals,
    _getResponseAmplitude,
  }
}
