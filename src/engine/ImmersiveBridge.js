import { ref, watch, reactive } from 'vue'
import { useFaceTracking } from './FaceTrackingEngine.js'
import { useVoiceSynth } from './VoiceSynthEngine.js'
import { useWebGPUParticles } from './WebGPUParticleEngine.js'
import { useWebGPUPostFX } from './WebGPUPostFX.js'
import { useGPUScheduler } from './GPUScheduler.js'
import { useWeatherSystem } from './WeatherSystem.js'
import { useCharacterAura } from './CharacterAura.js'
import { usePerformanceProfiler } from './PerformanceProfiler.js'

const CHARACTER_EMOTION_RESPONSES = {
  nene: {
    smile:    { expression: 'smile', speech: null, chance: 0.3 },
    frown:    { expression: 'sad', speech: '怎么了？是遇到难题了吗？', chance: 0.4 },
    surprise: { expression: 'surprised', speech: '诶？！怎么了？', chance: 0.5 },
    sleepy:   { expression: 'gentle_smile', speech: '困了吗？要不要休息一下？', chance: 0.5 },
    neutral:  { expression: null, speech: null, chance: 0 },
    absent:   { expression: 'sad', speech: '人呢……？不要丢下我一个人啊……', chance: 0.8 },
    return:   { expression: 'smile', speech: '你回来啦！', chance: 0.9 },
  },
  yoshino: {
    smile:    { expression: 'slight_smile', speech: null, chance: 0.15 },
    frown:    { expression: 'normal', speech: '有问题就问，别在那皱眉。', chance: 0.3 },
    surprise: { expression: 'surprised', speech: null, chance: 0.2 },
    sleepy:   { expression: 'cold', speech: '注意力不集中的话就去休息。', chance: 0.4 },
    neutral:  { expression: null, speech: null, chance: 0 },
    absent:   { expression: 'cold', speech: '……走了吗。', chance: 0.3 },
    return:   { expression: 'normal', speech: '回来了。继续。', chance: 0.4 },
  },
  ayase: {
    smile:    { expression: 'grin', speech: '嘿嘿，你在笑什么！', chance: 0.4 },
    frown:    { expression: 'pout', speech: '喂！别愁眉苦脸的！', chance: 0.5 },
    surprise: { expression: 'surprised', speech: '被吓到了？哈哈哈！', chance: 0.5 },
    sleepy:   { expression: 'competitive', speech: '别睡啊！来跟我比赛提精神！', chance: 0.6 },
    neutral:  { expression: null, speech: null, chance: 0 },
    absent:   { expression: 'pout', speech: '哈？人呢？跑哪去了！', chance: 0.7 },
    return:   { expression: 'fired_up', speech: '回来了！快来比一把！', chance: 0.8 },
  },
  kanna: {
    smile:    { expression: 'slight_smile', speech: null, chance: 0.1 },
    frown:    { expression: 'contemplative', speech: null, chance: 0.1 },
    surprise: { expression: 'surprised', speech: '……！', chance: 0.2 },
    sleepy:   { expression: 'warm_smile', speech: '……睡吧。', chance: 0.3 },
    neutral:  { expression: null, speech: null, chance: 0 },
    absent:   { expression: 'teary', speech: '……', chance: 0.2 },
    return:   { expression: 'slight_smile', speech: '……你回来了。', chance: 0.3 },
  },
  murasame: {
    smile:    { expression: 'smirk', speech: null, chance: 0.2 },
    frown:    { expression: 'normal', speech: '遇到瓶颈了？给我看看。', chance: 0.3 },
    surprise: { expression: 'impressed', speech: null, chance: 0.2 },
    sleepy:   { expression: 'cold', speech: '体力管理也是实力的一部分。去睡。', chance: 0.4 },
    neutral:  { expression: null, speech: null, chance: 0 },
    absent:   { expression: 'cold', speech: '切。又跑了。', chance: 0.3 },
    return:   { expression: 'smirk', speech: '总算回来了。', chance: 0.4 },
  },
}

const GAZE_STARE_THRESHOLD_MS = 5000
const GAZE_STARE_RESPONSES = {
  nene:     { expression: 'blush', speech: '那、那个……一直盯着我看的话……会害羞的……', chance: 0.6 },
  yoshino:  { expression: 'blush', speech: '……看够了吗。', chance: 0.4 },
  ayase:    { expression: 'blush', speech: '你、你在看什么啊！', chance: 0.7 },
  kanna:    { expression: 'blush', speech: '……视线。', chance: 0.3 },
  murasame: { expression: 'vulnerable', speech: '……别用那种眼神看我。', chance: 0.4 },
}

const AMBIENT_LIGHT_RESPONSES = {
  dark: {
    nene:     '这么暗的环境对眼睛不好哦……要不要开灯？',
    yoshino:  '亮度不够。对眼睛有害。',
    ayase:    '好暗啊！开个灯吧！',
    kanna:    '……暗。',
    murasame: '在暗处看屏幕，近视加深别怪我。',
  },
  bright: {
    nene:     '光线好亮呢～今天天气不错！',
    yoshino:  '光线条件不错，适合学习。',
    ayase:    '太阳好大！精神来了！',
    kanna:    '……刺眼。',
    murasame: '嗯。光照充足。',
  },
}

const SCENE_PARTICLE_MAP = {
  school_gate_day: 'sakura',
  school_yard_day: 'sakura',
  rooftop_evening: 'embers',
  rooftop_night: 'fireflies',
  festival_evening: 'fireworks',
  festival_night: 'fireworks',
  computer_room_night: 'codeRain',
  library_night: 'fireflies',
}

const SCENE_POSTFX_MAP = {
  school_gate_day: 'peaceful',
  classroom_day: 'peaceful',
  rooftop_evening: 'romantic',
  library_night: 'mystery',
  computer_room_night: 'tension',
  festival_evening: 'festival',
  player_room_night: 'sad',
}

export function useImmersiveBridge() {
  const faceTracker = useFaceTracking()
  const voiceSynth = useVoiceSynth()
  const particles = useWebGPUParticles()
  const postFX = useWebGPUPostFX()
  const gpuScheduler = useGPUScheduler()
  const weather = useWeatherSystem()
  const aura = useCharacterAura()
  const profiler = usePerformanceProfiler()

  let _engine = null
  let _stareStartTime = null
  let _stareTriggered = false
  let _lastPlayerPresent = true
  let _emotionReactionCooldown = 0
  const _cooldownInterval = 8000

  let _blinkStareCombo = 0
  let _headNodCount = 0
  let _lastHeadPitch = 0
  let _nodCooldown = 0
  let _engagementCheckTimer = null

  function attach(engine) {
    _engine = engine

    faceTracker.on('emotionChange', _onPlayerEmotionChange)
    faceTracker.on('gazeChange', _onGazeChange)
    faceTracker.on('playerAbsent', _onPlayerAbsent)
    faceTracker.on('ambientLightChange', _onAmbientLightChange)
    faceTracker.on('blink', _onBlink)

    _engagementCheckTimer = setInterval(_onEngagementTick, 10000)

    watch(() => engine.currentBg?.value, (newBg) => {
      if (!newBg) return
      _updateSceneEffects(newBg)

      const variant = engine.currentBgVariant?.value || 'day'
      if (variant === 'evening') weather.setWeather('sunset')
      else if (variant === 'night') weather.setWeather('night_clear')
    })

    watch(() => engine.sceneEmotion?.value, (mood) => {
      if (mood) {
        postFX.lerpMood(mood, 2000)
        weather.setWeatherForEmotion(mood)
      }
    })

    watch(() => engine.speakerExpression?.value, (expr) => {
      const charId = engine.speaker?.value?.id
      if (!charId) return
      const affection = engine.affection?.[charId] || engine.relationship?.[charId]?.affection || 0
      aura.updateAura(charId, expr, affection)
    })

    watch(() => engine.dialogueText?.value, (text) => {
      if (!text || !voiceSynth.enabled.value || !voiceSynth.autoSpeak.value) return
      const charId = engine.speaker?.value?.id
      if (!charId) return
      const emotion = engine.speakerExpression?.value || 'normal'
      voiceSynth.speak(text, charId, emotion)
    })
  }

  function detach() {
    faceTracker.off('emotionChange', _onPlayerEmotionChange)
    faceTracker.off('gazeChange', _onGazeChange)
    faceTracker.off('playerAbsent', _onPlayerAbsent)
    faceTracker.off('ambientLightChange', _onAmbientLightChange)
    faceTracker.off('blink', _onBlink)
    if (_engagementCheckTimer) { clearInterval(_engagementCheckTimer); _engagementCheckTimer = null }
    _engine = null
  }

  function _onPlayerEmotionChange({ emotion, previous }) {
    if (!_engine) return
    const now = Date.now()
    if (now - _emotionReactionCooldown < _cooldownInterval) return
    _emotionReactionCooldown = now

    const charId = _engine.speaker?.value?.id
    if (!charId) return

    const responses = CHARACTER_EMOTION_RESPONSES[charId]
    if (!responses) return

    const response = responses[emotion]
    if (!response || Math.random() > response.chance) return

    if (response.expression && _engine.speakerExpression) {
      const originalExpr = _engine.speakerExpression.value
      _engine.speakerExpression.value = response.expression
      setTimeout(() => {
        if (_engine?.speakerExpression) _engine.speakerExpression.value = originalExpr
      }, 3000)
    }
  }

  function _onGazeChange({ direction }) {
    if (!_engine) return
    const charId = _engine.speaker?.value?.id
    if (!charId || !GAZE_STARE_RESPONSES[charId]) return

    if (direction === 'center') {
      if (!_stareStartTime) _stareStartTime = Date.now()
      if (!_stareTriggered && Date.now() - _stareStartTime > GAZE_STARE_THRESHOLD_MS) {
        _stareTriggered = true
        const resp = GAZE_STARE_RESPONSES[charId]
        if (Math.random() < resp.chance && _engine.speakerExpression) {
          const original = _engine.speakerExpression.value
          _engine.speakerExpression.value = resp.expression
          setTimeout(() => {
            if (_engine?.speakerExpression) _engine.speakerExpression.value = original
          }, 4000)
        }
      }
    } else {
      _stareStartTime = null
      _stareTriggered = false
    }
  }

  function _onPlayerAbsent() {
    if (!_engine || !_lastPlayerPresent) return
    _lastPlayerPresent = false

    const charId = _engine.speaker?.value?.id
    if (!charId) return
    const resp = CHARACTER_EMOTION_RESPONSES[charId]?.absent
    if (!resp || Math.random() > resp.chance) return

    if (resp.expression && _engine.speakerExpression) {
      _engine.speakerExpression.value = resp.expression
    }

    watch(() => faceTracker.playerPresent.value, (present) => {
      if (present && !_lastPlayerPresent) {
        _lastPlayerPresent = true
        const returnResp = CHARACTER_EMOTION_RESPONSES[charId]?.return
        if (returnResp && _engine.speakerExpression) {
          _engine.speakerExpression.value = returnResp.expression
          setTimeout(() => {
            if (_engine?.speakerExpression) _engine.speakerExpression.value = 'normal'
          }, 4000)
        }
      }
    }, { once: true })
  }

  function _onBlink() {
    if (!_engine) return
    if (_stareTriggered) {
      _blinkStareCombo++
      if (_blinkStareCombo >= 3) {
        _blinkStareCombo = 0
      }
    }
  }

  function _onEngagementTick() {
    if (!_engine) return
    const engagement = faceTracker.engagementScore?.value ?? 0.5

    if (engagement < 0.3 && _engine.autoPlayDelay) {
      _engine.autoPlayDelay.value = Math.min(5000, _engine.autoPlayDelay.value + 200)
    } else if (engagement > 0.7 && _engine.autoPlayDelay) {
      _engine.autoPlayDelay.value = Math.max(1500, _engine.autoPlayDelay.value - 100)
    }

    if (engagement < 0.2) {
      postFX.effectParams.colorGrading.saturation = Math.max(0.6, postFX.effectParams.colorGrading.saturation - 0.02)
    } else if (engagement > 0.8) {
      postFX.effectParams.colorGrading.saturation = Math.min(1.3, postFX.effectParams.colorGrading.saturation + 0.01)
    }
  }

  function _onAmbientLightChange({ level }) {
    if (level < 0.15) {
      postFX.effectParams.colorGrading.brightness = -0.06
      postFX.effectParams.colorGrading.contrast = 0.9
      postFX.effectParams.colorGrading.vignetteStrength = 3.0
    } else if (level < 0.3) {
      postFX.effectParams.colorGrading.brightness = -0.03
      postFX.effectParams.colorGrading.vignetteStrength = 2.0
    } else if (level > 0.8) {
      postFX.effectParams.colorGrading.brightness = 0.03
      postFX.effectParams.colorGrading.contrast = 1.05
      postFX.effectParams.colorGrading.vignetteStrength = 0.8
    } else {
      postFX.effectParams.colorGrading.brightness = 0
      postFX.effectParams.colorGrading.contrast = 1.0
    }
  }

  function _updateSceneEffects(bgId) {
    const particlePreset = SCENE_PARTICLE_MAP[bgId]
    if (particlePreset && particles.isSupported.value) {
      particles.startEffect(particlePreset)
    } else {
      particles.stopEffect()
    }

    const moodPreset = SCENE_POSTFX_MAP[bgId]
    if (moodPreset) {
      postFX.setMood(moodPreset)
    }
  }

  async function initializeAll(particleCanvas) {
    const results = { faceTracking: false, voiceSynth: false, particles: false }

    results.faceTracking = await faceTracker.initialize()
    results.voiceSynth = await voiceSynth.initialize()

    if (particleCanvas) {
      results.particles = await particles.initialize(particleCanvas)
    }

    return results
  }

  function triggerAwakenessScreenCrack(intensity = 1.0) {
    postFX.triggerScreenCrack(intensity, 0.5, 0.5)
    postFX.triggerChromaticAberration(intensity * 0.8, 4000)
    postFX.triggerScreenShake(intensity * 8, 800)

    if (particles.isSupported.value) {
      particles.burstAt(
        (_canvas?.width || 800) / 2,
        (_canvas?.height || 600) / 2,
        300,
        'dataVortex',
        [0.3, 0.8, 1.0, 1.0]
      )
    }

    setTimeout(() => postFX.clearScreenCrack(), 6000)
  }

  function triggerEmotionalBurst(emotion, charId, x, y) {
    if (!particles.isSupported.value) return

    const emotionEffects = {
      romantic: { preset: 'heartbeat', color: [1, 0.4, 0.5, 0.9], count: 200 },
      joy: { preset: 'fireworks', color: [1, 0.9, 0.3, 1], count: 300 },
      tension: { preset: 'embers', color: [1, 0.3, 0.1, 0.8], count: 150 },
      sadness: { preset: 'snow', color: [0.7, 0.7, 0.9, 0.6], count: 100 },
      mystery: { preset: 'dataVortex', color: [0.3, 0.5, 1, 0.7], count: 200 },
    }

    const fx = emotionEffects[emotion]
    if (fx) {
      particles.burstAt(x || 400, y || 300, fx.count, fx.preset, fx.color)
      postFX.triggerScreenShake(2, 200)
    }
  }

  return {
    faceTracker,
    voiceSynth,
    particles,
    postFX,
    gpuScheduler,
    weather,
    aura,
    profiler,

    attach,
    detach,
    initializeAll,
    triggerAwakenessScreenCrack,
    triggerEmotionalBurst,

    CHARACTER_EMOTION_RESPONSES,
    SCENE_PARTICLE_MAP,
    SCENE_POSTFX_MAP,
  }
}
