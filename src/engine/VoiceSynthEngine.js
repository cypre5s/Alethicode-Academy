import { ref, reactive } from 'vue'

const VOICE_CONFIG_KEY = 'alethicode_voice_config'

const enabled = ref(false)
const speaking = ref(false)
const currentCharacter = ref(null)
const volume = ref(0.8)
const autoSpeak = ref(true)

const voiceProfiles = reactive({})

const _queue = []
let _audioContext = null
let _currentSource = null
let _gainNode = null
let _analyserNode = null

function _isElectron() {
  return typeof window !== 'undefined' && window.electronAPI
}

function _getAudioContext() {
  if (!_audioContext) {
    _audioContext = new (window.AudioContext || window.webkitAudioContext)()
    _gainNode = _audioContext.createGain()
    _analyserNode = _audioContext.createAnalyser()
    _analyserNode.fftSize = 256
    _gainNode.connect(_analyserNode)
    _analyserNode.connect(_audioContext.destination)
  }
  if (_audioContext.state === 'suspended') _audioContext.resume()
  return _audioContext
}

function _loadConfig() {
  try {
    const raw = localStorage.getItem(VOICE_CONFIG_KEY)
    if (!raw) return
    const cfg = JSON.parse(raw)
    if (typeof cfg.enabled === 'boolean') enabled.value = cfg.enabled
    if (typeof cfg.volume === 'number') volume.value = Math.max(0, Math.min(1, cfg.volume))
    if (typeof cfg.autoSpeak === 'boolean') autoSpeak.value = cfg.autoSpeak
  } catch {}
}

function _saveConfig() {
  try {
    localStorage.setItem(VOICE_CONFIG_KEY, JSON.stringify({
      enabled: enabled.value,
      volume: volume.value,
      autoSpeak: autoSpeak.value,
    }))
  } catch {}
}

export function useVoiceSynth() {
  _loadConfig()

  async function initialize() {
    if (!_isElectron()) return false
    try {
      const result = await window.electronAPI.invoke('local-tts:voices')
      if (result.success) {
        Object.assign(voiceProfiles, result.voices)
        return true
      }
    } catch {}
    return false
  }

  async function speak(text, characterId, emotion) {
    if (!enabled.value || !_isElectron() || !text) return null

    const cleanText = text
      .replace(/[「」『』【】《》〈〉（）\(\)]/g, '')
      .replace(/……+/g, '...')
      .replace(/\.{4,}/g, '...')
      .trim()

    if (!cleanText || cleanText.length < 2) return null

    const utterance = { text: cleanText, characterId, emotion, id: Date.now() }
    _queue.push(utterance)

    if (!speaking.value) {
      return _processQueue()
    }
    return utterance.id
  }

  async function _processQueue() {
    if (_queue.length === 0) {
      speaking.value = false
      currentCharacter.value = null
      return null
    }

    speaking.value = true
    const utterance = _queue.shift()
    currentCharacter.value = utterance.characterId

    try {
      const result = await window.electronAPI.invoke('local-tts:synthesize', {
        text: utterance.text,
        characterId: utterance.characterId,
        emotion: utterance.emotion,
      })

      if (!result.success) {
        _processQueue()
        return null
      }

      if (result.audioBase64) {
        const audioData = Uint8Array.from(atob(result.audioBase64), c => c.charCodeAt(0))
        await _playAudioBuffer(audioData.buffer)
      }

      _processQueue()
      return utterance.id
    } catch {
      _processQueue()
      return null
    }
  }

  async function _playAudioBuffer(arrayBuffer) {
    return new Promise((resolve, reject) => {
      const ctx = _getAudioContext()
      ctx.decodeAudioData(arrayBuffer.slice(0), (buffer) => {
        if (_currentSource) {
          try { _currentSource.stop() } catch {}
        }

        const source = ctx.createBufferSource()
        source.buffer = buffer
        _gainNode.gain.value = volume.value
        source.connect(_gainNode)

        source.onended = () => {
          _currentSource = null
          resolve()
        }

        _currentSource = source
        source.start(0)
      }, reject)
    })
  }

  function stop() {
    _queue.length = 0
    if (_currentSource) {
      try { _currentSource.stop() } catch {}
      _currentSource = null
    }
    speaking.value = false
    currentCharacter.value = null
  }

  function getAnalyserData() {
    if (!_analyserNode) return null
    const data = new Uint8Array(_analyserNode.frequencyBinCount)
    _analyserNode.getByteFrequencyData(data)
    return data
  }

  function getLipSyncValue() {
    const data = getAnalyserData()
    if (!data) return 0

    let sum = 0
    const vowelRange = { start: 2, end: 20 }
    for (let i = vowelRange.start; i < vowelRange.end && i < data.length; i++) {
      sum += data[i]
    }
    const avg = sum / (vowelRange.end - vowelRange.start)
    return Math.min(1, avg / 128)
  }

  function setEnabled(val) {
    enabled.value = !!val
    _saveConfig()
  }

  function setVolume(val) {
    volume.value = Math.max(0, Math.min(1, val))
    if (_gainNode) _gainNode.gain.value = volume.value
    _saveConfig()
  }

  function setAutoSpeak(val) {
    autoSpeak.value = !!val
    _saveConfig()
  }

  const _prefetchCache = new Map()
  const PREFETCH_MAX = 20

  async function prefetch(text, characterId, emotion) {
    if (!enabled.value || !_isElectron() || !text) return
    const key = `${characterId}:${text.slice(0, 50)}`
    if (_prefetchCache.has(key)) return

    try {
      const result = await window.electronAPI.invoke('local-tts:synthesize', {
        text: text.replace(/[「」『』【】《》〈〉（）\(\)]/g, '').trim(),
        characterId,
        emotion,
      })
      if (result.success && result.audioBase64) {
        _prefetchCache.set(key, result.audioBase64)
        if (_prefetchCache.size > PREFETCH_MAX) {
          const firstKey = _prefetchCache.keys().next().value
          _prefetchCache.delete(firstKey)
        }
      }
    } catch {}
  }

  function getEmotionSpeedMod(emotion) {
    const mods = {
      normal: 1.0, smile: 1.05, blush: 0.9, sad: 0.85,
      surprised: 1.15, angry: 1.1, thinking: 0.9, cold: 0.95,
      fired_up: 1.2, competitive: 1.1, gentle_smile: 0.95,
    }
    return mods[emotion] || 1.0
  }

  function isSpeaking() { return speaking.value }
  function getCurrentCharacter() { return currentCharacter.value }

  return {
    enabled, speaking, currentCharacter, volume, autoSpeak,
    voiceProfiles,
    initialize, speak, stop, prefetch,
    getAnalyserData, getLipSyncValue, getEmotionSpeedMod,
    isSpeaking, getCurrentCharacter,
    setEnabled, setVolume, setAutoSpeak,
  }
}
