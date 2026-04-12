import { ref } from 'vue'

const isActive = ref(false)
const mouthOpenY = ref(0)
const currentVolume = ref(0)

let analyserNode = null
let animFrameId = null
let smoothedValue = 0

const SMOOTHING_FACTOR = 0.35
const CLOSE_SPEED = 0.12
const OPEN_THRESHOLD = 0.02
const VOWEL_FREQUENCY_RANGE = { min: 300, max: 3000 }
const AMPLITUDE_SCALE = 2.5
const MAX_MOUTH_OPEN = 1.0

function getVowelAmplitude(frequencyData, sampleRate, fftSize) {
  if (!frequencyData) return 0

  const binSize = sampleRate / fftSize
  const minBin = Math.floor(VOWEL_FREQUENCY_RANGE.min / binSize)
  const maxBin = Math.min(
    Math.ceil(VOWEL_FREQUENCY_RANGE.max / binSize),
    frequencyData.length - 1
  )

  let sum = 0
  let count = 0
  for (let i = minBin; i <= maxBin; i++) {
    sum += frequencyData[i]
    count++
  }
  return count > 0 ? (sum / count) / 255 : 0
}

function getRMSAmplitude(timeDomainData) {
  if (!timeDomainData) return 0
  let sum = 0
  for (let i = 0; i < timeDomainData.length; i++) {
    const v = (timeDomainData[i] - 128) / 128
    sum += v * v
  }
  return Math.sqrt(sum / timeDomainData.length)
}

function updateLoop() {
  if (!isActive.value || !analyserNode) {
    mouthOpenY.value = 0
    smoothedValue = 0
    return
  }

  const freqData = new Uint8Array(analyserNode.frequencyBinCount)
  const timeData = new Uint8Array(analyserNode.fftSize)
  analyserNode.getByteFrequencyData(freqData)
  analyserNode.getByteTimeDomainData(timeData)

  const sampleRate = analyserNode.context?.sampleRate || 44100
  const vowelAmp = getVowelAmplitude(freqData, sampleRate, analyserNode.fftSize)
  const rmsAmp = getRMSAmplitude(timeData)

  const combined = (vowelAmp * 0.6 + rmsAmp * 0.4) * AMPLITUDE_SCALE
  const targetValue = Math.min(combined, MAX_MOUTH_OPEN)

  if (targetValue > smoothedValue) {
    smoothedValue += (targetValue - smoothedValue) * SMOOTHING_FACTOR
  } else {
    smoothedValue += (targetValue - smoothedValue) * CLOSE_SPEED
  }

  if (smoothedValue < OPEN_THRESHOLD) smoothedValue = 0

  mouthOpenY.value = smoothedValue
  currentVolume.value = rmsAmp

  animFrameId = requestAnimationFrame(updateLoop)
}

export function startLipSync(analyser) {
  if (!analyser) return
  analyserNode = analyser
  isActive.value = true
  if (animFrameId) cancelAnimationFrame(animFrameId)
  animFrameId = requestAnimationFrame(updateLoop)
}

export function stopLipSync() {
  isActive.value = false
  if (animFrameId) {
    cancelAnimationFrame(animFrameId)
    animFrameId = null
  }
  smoothedValue = 0
  mouthOpenY.value = 0
  currentVolume.value = 0
}

export function applyToLive2D(model) {
  if (!model) return
  try {
    const coreModel = model.internalModel?.coreModel
    if (!coreModel) return

    const paramId = 'ParamMouthOpenY'
    const idx = coreModel._modelSetting?.getParameterIndex?.(paramId)
      ?? coreModel.getParameterIndex?.(paramId)

    if (idx !== undefined && idx >= 0) {
      coreModel.setParameterValueById?.(paramId, mouthOpenY.value)
        ?? coreModel.setParamFloat?.(idx, mouthOpenY.value)
    } else {
      coreModel.setParameterValueByIndex?.(0, mouthOpenY.value)
    }
  } catch { /* Live2D model not ready */ }
}

export function useLipSync() {
  return {
    isActive,
    mouthOpenY,
    currentVolume,
    startLipSync,
    stopLipSync,
    applyToLive2D,
  }
}
