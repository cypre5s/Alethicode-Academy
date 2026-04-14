import { ref, reactive, computed } from 'vue'

const FACE_CONFIG_KEY = 'alethicode_face_tracking'

const enabled = ref(false)
const isTracking = ref(false)
const hasCamera = ref(false)
const lastError = ref(null)

const playerEmotion = ref('neutral')
const playerGaze = reactive({ x: 0.5, y: 0.5, direction: 'center' })
const ambientLight = ref(0.5)
const playerPresent = ref(true)

let _videoElement = null
let _canvasElement = null
let _canvasCtx = null
let _faceLandmarker = null
let _animFrameId = null
let _stream = null
let _lastEmotionTime = 0
let _emotionHistory = []
let _absenceTimer = null
let _listeners = {}

const EMOTION_THRESHOLDS = {
  smile: { mouthWidth: 0.045, eyeOpenness: 0.03 },
  frown: { browLower: 0.015 },
  surprise: { mouthOpen: 0.06, eyeWide: 0.04 },
  sleepy: { eyeOpenness: -0.015, headTilt: 15 },
}

const GAZE_ZONES = {
  topLeft: { label: 'away', description: '看向左上方' },
  topRight: { label: 'away', description: '看向右上方' },
  center: { label: 'screen', description: '看着屏幕' },
  bottomLeft: { label: 'down', description: '看向左下方' },
  bottomRight: { label: 'down', description: '看向右下方' },
}

function _loadConfig() {
  try {
    const raw = localStorage.getItem(FACE_CONFIG_KEY)
    if (!raw) return
    const cfg = JSON.parse(raw)
    if (typeof cfg.enabled === 'boolean') enabled.value = cfg.enabled
  } catch {}
}

function _saveConfig() {
  try {
    localStorage.setItem(FACE_CONFIG_KEY, JSON.stringify({ enabled: enabled.value }))
  } catch {}
}

function _emit(event, data) {
  const cbs = _listeners[event]
  if (cbs) cbs.forEach(cb => cb(data))
}

function _classifyEmotion(landmarks) {
  if (!landmarks || landmarks.length < 468) return 'neutral'

  const leftEyeTop = landmarks[159]
  const leftEyeBottom = landmarks[145]
  const rightEyeTop = landmarks[386]
  const rightEyeBottom = landmarks[374]

  const mouthLeft = landmarks[61]
  const mouthRight = landmarks[291]
  const mouthTop = landmarks[13]
  const mouthBottom = landmarks[14]
  const upperLipTop = landmarks[0]

  const leftBrow = landmarks[65]
  const rightBrow = landmarks[295]
  const leftBrowInner = landmarks[55]
  const rightBrowInner = landmarks[285]
  const foreheadCenter = landmarks[10]

  const leftEyeOpen = Math.abs(leftEyeTop.y - leftEyeBottom.y)
  const rightEyeOpen = Math.abs(rightEyeTop.y - rightEyeBottom.y)
  const avgEyeOpen = (leftEyeOpen + rightEyeOpen) / 2

  const mouthWidth = Math.abs(mouthRight.x - mouthLeft.x)
  const mouthHeight = Math.abs(mouthBottom.y - mouthTop.y)
  const mouthAspect = mouthHeight / Math.max(mouthWidth, 0.001)

  const leftBrowHeight = leftBrow.y - foreheadCenter.y
  const rightBrowHeight = rightBrow.y - foreheadCenter.y
  const avgBrowHeight = (leftBrowHeight + rightBrowHeight) / 2

  if (mouthAspect > 0.4 && avgEyeOpen > 0.035) return 'surprise'
  if (mouthWidth > 0.15 && mouthAspect < 0.15 && avgEyeOpen > 0.02) return 'smile'
  if (avgBrowHeight < -0.01 && mouthAspect < 0.1) return 'frown'
  if (avgEyeOpen < 0.015) return 'sleepy'
  if (avgBrowHeight > 0.005 && mouthAspect < 0.1) return 'thinking'

  return 'neutral'
}

function _classifyGaze(landmarks) {
  if (!landmarks || landmarks.length < 468) return { x: 0.5, y: 0.5, direction: 'center' }

  const leftIris = landmarks[468] || landmarks[473] || landmarks[159]
  const rightIris = landmarks[473] || landmarks[468] || landmarks[386]
  const nose = landmarks[1]

  const avgIrisX = (leftIris.x + rightIris.x) / 2
  const avgIrisY = (leftIris.y + rightIris.y) / 2

  const relX = avgIrisX - nose.x
  const relY = avgIrisY - nose.y

  let direction = 'center'
  if (relX < -0.02) direction = relY < -0.01 ? 'topLeft' : 'bottomLeft'
  else if (relX > 0.02) direction = relY < -0.01 ? 'topRight' : 'bottomRight'
  else if (relY < -0.015) direction = 'up'
  else if (relY > 0.015) direction = 'down'

  return { x: avgIrisX, y: avgIrisY, direction }
}

function _estimateAmbientLight(videoElement, canvas, ctx) {
  if (!videoElement || !canvas || !ctx) return 0.5

  try {
    const sampleSize = 64
    canvas.width = sampleSize
    canvas.height = sampleSize
    ctx.drawImage(videoElement, 0, 0, sampleSize, sampleSize)
    const imageData = ctx.getImageData(0, 0, sampleSize, sampleSize)
    const data = imageData.data

    let totalBrightness = 0
    const pixelCount = data.length / 4
    for (let i = 0; i < data.length; i += 4) {
      totalBrightness += (data[i] * 0.299 + data[i + 1] * 0.587 + data[i + 2] * 0.114)
    }

    return totalBrightness / (pixelCount * 255)
  } catch {
    return 0.5
  }
}

export function useFaceTracking() {
  _loadConfig()

  async function initialize() {
    try {
      const devices = await navigator.mediaDevices.enumerateDevices()
      hasCamera.value = devices.some(d => d.kind === 'videoinput')
      return hasCamera.value
    } catch {
      hasCamera.value = false
      return false
    }
  }

  async function start() {
    if (isTracking.value) return true
    if (!hasCamera.value) return false

    try {
      _stream = await navigator.mediaDevices.getUserMedia({
        video: { width: 320, height: 240, frameRate: 15, facingMode: 'user' },
      })

      _videoElement = document.createElement('video')
      _videoElement.srcObject = _stream
      _videoElement.setAttribute('playsinline', '')
      _videoElement.muted = true
      await _videoElement.play()

      _canvasElement = document.createElement('canvas')
      _canvasCtx = _canvasElement.getContext('2d', { willReadFrequently: true })

      try {
        const vision = await import('https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/vision_bundle.mjs')
        const { FaceLandmarker, FilesetResolver } = vision

        const filesetResolver = await FilesetResolver.forVisionTasks(
          'https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm'
        )

        _faceLandmarker = await FaceLandmarker.createFromOptions(filesetResolver, {
          baseOptions: {
            modelAssetPath: 'https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/1/face_landmarker.task',
            delegate: 'GPU',
          },
          runningMode: 'VIDEO',
          numFaces: 1,
          outputFaceBlendshapes: true,
          outputFacialTransformationMatrixes: false,
        })
      } catch {
        _faceLandmarker = null
      }

      isTracking.value = true
      enabled.value = true
      _saveConfig()
      _startLoop()
      return true
    } catch (err) {
      lastError.value = err.message
      return false
    }
  }

  function stop() {
    isTracking.value = false
    if (_animFrameId) {
      cancelAnimationFrame(_animFrameId)
      _animFrameId = null
    }
    if (_stream) {
      _stream.getTracks().forEach(t => t.stop())
      _stream = null
    }
    if (_videoElement) {
      _videoElement.pause()
      _videoElement.srcObject = null
      _videoElement = null
    }
    if (_absenceTimer) {
      clearTimeout(_absenceTimer)
      _absenceTimer = null
    }
    _faceLandmarker = null
  }

  function _startLoop() {
    let frameCount = 0

    function loop() {
      if (!isTracking.value) return

      frameCount++
      if (frameCount % 2 !== 0) {
        _animFrameId = requestAnimationFrame(loop)
        return
      }

      if (_faceLandmarker && _videoElement && _videoElement.readyState >= 2) {
        try {
          const results = _faceLandmarker.detectForVideo(_videoElement, performance.now())

          if (results.faceLandmarks && results.faceLandmarks.length > 0) {
            const landmarks = results.faceLandmarks[0]
            playerPresent.value = true

            if (_absenceTimer) { clearTimeout(_absenceTimer); _absenceTimer = null }

            const newEmotion = _classifyEmotion(landmarks)
            _emotionHistory.push(newEmotion)
            if (_emotionHistory.length > 10) _emotionHistory.shift()

            const now = Date.now()
            if (now - _lastEmotionTime > 500) {
              const counts = {}
              for (const e of _emotionHistory) counts[e] = (counts[e] || 0) + 1
              let dominant = 'neutral'
              let maxCount = 0
              for (const [e, c] of Object.entries(counts)) {
                if (c > maxCount) { maxCount = c; dominant = e }
              }

              if (dominant !== playerEmotion.value) {
                const oldEmotion = playerEmotion.value
                playerEmotion.value = dominant
                _emit('emotionChange', { emotion: dominant, previous: oldEmotion })
              }
              _lastEmotionTime = now
            }

            const gaze = _classifyGaze(landmarks)
            playerGaze.x = gaze.x
            playerGaze.y = gaze.y
            if (gaze.direction !== playerGaze.direction) {
              playerGaze.direction = gaze.direction
              _emit('gazeChange', { direction: gaze.direction })
            }

            _detectBlink(landmarks)
            _estimateHeadPose(landmarks)
            _extractMicroExpressions(landmarks)
            _calculateEngagement(landmarks)

          } else {
            if (playerPresent.value && !_absenceTimer) {
              _absenceTimer = setTimeout(() => {
                playerPresent.value = false
                _emit('playerAbsent', {})
              }, 5000)
            }
          }
        } catch {}
      }

      if (_videoElement && frameCount % 30 === 0) {
        const light = _estimateAmbientLight(_videoElement, _canvasElement, _canvasCtx)
        if (Math.abs(light - ambientLight.value) > 0.1) {
          const oldLight = ambientLight.value
          ambientLight.value = light
          _emit('ambientLightChange', { level: light, previous: oldLight })
        }
      }

      _animFrameId = requestAnimationFrame(loop)
    }

    _animFrameId = requestAnimationFrame(loop)
  }

  const blinkState = reactive({ isBlinking: false, blinkCount: 0, lastBlinkTime: 0 })
  const headPose = reactive({ pitch: 0, yaw: 0, roll: 0 })
  const microExpressions = reactive({ lipCornerPull: 0, browRaise: 0, jawDrop: 0, eyeSquint: 0 })
  const engagementScore = ref(0.5)

  let _blinkThreshold = 0.015
  let _wasEyeClosed = false
  let _engagementHistory = []

  function _detectBlink(landmarks) {
    if (!landmarks || landmarks.length < 468) return
    const leftOpen = Math.abs(landmarks[159].y - landmarks[145].y)
    const rightOpen = Math.abs(landmarks[386].y - landmarks[374].y)
    const avgOpen = (leftOpen + rightOpen) / 2

    if (avgOpen < _blinkThreshold && !_wasEyeClosed) {
      _wasEyeClosed = true
    } else if (avgOpen > _blinkThreshold * 1.5 && _wasEyeClosed) {
      _wasEyeClosed = false
      blinkState.isBlinking = true
      blinkState.blinkCount++
      blinkState.lastBlinkTime = Date.now()
      setTimeout(() => { blinkState.isBlinking = false }, 150)
      _emit('blink', { count: blinkState.blinkCount })
    }
  }

  function _estimateHeadPose(landmarks) {
    if (!landmarks || landmarks.length < 468) return
    const nose = landmarks[1]
    const chin = landmarks[152]
    const leftEar = landmarks[234]
    const rightEar = landmarks[454]
    const forehead = landmarks[10]

    headPose.yaw = (leftEar.z - rightEar.z) * 500
    headPose.pitch = (forehead.y - chin.y - 0.12) * 300
    headPose.roll = Math.atan2(rightEar.y - leftEar.y, rightEar.x - leftEar.x) * (180 / Math.PI)
  }

  function _extractMicroExpressions(landmarks) {
    if (!landmarks || landmarks.length < 468) return
    const mouthLeft = landmarks[61]
    const mouthRight = landmarks[291]
    const mouthTop = landmarks[13]
    const mouthBottom = landmarks[14]
    const leftBrow = landmarks[65]
    const rightBrow = landmarks[295]
    const forehead = landmarks[10]
    const leftEyeTop = landmarks[159]
    const leftEyeBottom = landmarks[145]

    microExpressions.lipCornerPull = Math.abs(mouthRight.x - mouthLeft.x) * 5
    microExpressions.browRaise = Math.max(0, (forehead.y - (leftBrow.y + rightBrow.y) / 2) * 20)
    microExpressions.jawDrop = Math.abs(mouthBottom.y - mouthTop.y) * 10
    microExpressions.eyeSquint = Math.max(0, 1 - Math.abs(leftEyeTop.y - leftEyeBottom.y) * 40)
  }

  function _calculateEngagement(landmarks) {
    if (!landmarks) return

    let score = 0.5
    const gaze = playerGaze.direction
    if (gaze === 'center') score += 0.2

    const absYaw = Math.abs(headPose.yaw)
    if (absYaw < 10) score += 0.15
    else if (absYaw > 30) score -= 0.2

    const emotion = playerEmotion.value
    if (emotion === 'smile') score += 0.1
    if (emotion === 'sleepy') score -= 0.3
    if (emotion === 'frown') score -= 0.1

    const blinkRate = blinkState.blinkCount / Math.max(1, (Date.now() - blinkState.lastBlinkTime) / 60000)
    if (blinkRate > 25) score -= 0.1
    if (blinkRate < 5 && blinkRate > 0) score += 0.05

    score = Math.max(0, Math.min(1, score))
    _engagementHistory.push(score)
    if (_engagementHistory.length > 30) _engagementHistory.shift()

    engagementScore.value = _engagementHistory.reduce((a, b) => a + b, 0) / _engagementHistory.length
  }

  function on(event, callback) {
    if (!_listeners[event]) _listeners[event] = []
    _listeners[event].push(callback)
  }

  function off(event, callback) {
    if (!_listeners[event]) return
    _listeners[event] = _listeners[event].filter(cb => cb !== callback)
  }

  function setEnabled(val) {
    enabled.value = !!val
    _saveConfig()
    if (!val && isTracking.value) stop()
  }

  return {
    enabled, isTracking, hasCamera, lastError,
    playerEmotion, playerGaze, ambientLight, playerPresent,
    blinkState, headPose, microExpressions, engagementScore,
    initialize, start, stop,
    setEnabled,
    on, off,
  }
}
