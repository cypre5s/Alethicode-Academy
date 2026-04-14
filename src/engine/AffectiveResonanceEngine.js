import { ref, reactive, computed } from 'vue'

const EMOTION_DECAY_MS = 15000
const DISTRACTION_THRESHOLD_MS = 30000

export function useAffectiveResonance() {
  const enabled = ref(false)
  const cameraActive = ref(false)
  const cameraPermission = ref('prompt')
  const currentEmotion = ref('neutral')
  const emotionConfidence = ref(0)
  const isDistracted = ref(false)
  const lastActivityTime = ref(Date.now())

  const emotionHistory = reactive([])
  const MAX_HISTORY = 50

  const emotionEffects = {
    happy: { characterReaction: 'mirror_happiness', bgFilter: 'warm_glow', intensity: 0.8 },
    sad: { characterReaction: 'comfort_mode', bgFilter: 'soft_desaturate', intensity: 0.6 },
    surprised: { characterReaction: 'acknowledge_reaction', bgFilter: null, intensity: 0.7 },
    angry: { characterReaction: 'careful_approach', bgFilter: 'slight_red', intensity: 0.5 },
    fearful: { characterReaction: 'reassure', bgFilter: 'cool_dim', intensity: 0.4 },
    neutral: { characterReaction: null, bgFilter: null, intensity: 0 },
    distracted: { characterReaction: 'attention_call', bgFilter: null, intensity: 0.3 },
    engaged: { characterReaction: 'positive_flow', bgFilter: 'warm_subtle', intensity: 0.5 },
  }

  const currentEffect = computed(() => emotionEffects[currentEmotion.value] || emotionEffects.neutral)

  let _inactivityTimer = null

  function _startInactivityMonitor() {
    if (_inactivityTimer) clearInterval(_inactivityTimer)
    _inactivityTimer = setInterval(() => {
      const elapsed = Date.now() - lastActivityTime.value
      if (elapsed >= DISTRACTION_THRESHOLD_MS && !isDistracted.value) {
        isDistracted.value = true
        _updateEmotion('distracted', 0.5)
      }
    }, 5000)
  }

  function _stopInactivityMonitor() {
    if (_inactivityTimer) {
      clearInterval(_inactivityTimer)
      _inactivityTimer = null
    }
  }

  function enable() {
    enabled.value = true
    lastActivityTime.value = Date.now()
    _startInactivityMonitor()
  }

  function disable() {
    enabled.value = false
    cameraActive.value = false
    _stopInactivityMonitor()
    currentEmotion.value = 'neutral'
    emotionConfidence.value = 0
    isDistracted.value = false
  }

  function _updateEmotion(emotion, confidence) {
    currentEmotion.value = emotion
    emotionConfidence.value = confidence
    emotionHistory.push({
      emotion,
      confidence,
      timestamp: Date.now(),
    })
    if (emotionHistory.length > MAX_HISTORY) {
      emotionHistory.splice(0, emotionHistory.length - MAX_HISTORY)
    }
  }

  function onPlayerActivity(activityType) {
    if (!enabled.value) return
    lastActivityTime.value = Date.now()

    if (isDistracted.value) {
      isDistracted.value = false
      _updateEmotion('engaged', 0.6)
      return
    }

    switch (activityType) {
      case 'click_fast':
        break
      case 'click_slow':
        if (currentEmotion.value === 'neutral') {
          _updateEmotion('engaged', 0.4)
        }
        break
      case 'choice_hesitation':
        _updateEmotion('surprised', 0.3)
        break
      case 'typing_active':
        _updateEmotion('engaged', 0.5)
        break
      case 'scroll_up':
        _updateEmotion('engaged', 0.4)
        break
    }
  }

  function inferEmotionFromContext(context) {
    if (!enabled.value) return

    if (context.sceneEmotion === 'romantic' || context.sceneEmotion === 'confession') {
      if (currentEmotion.value === 'neutral') _updateEmotion('engaged', 0.6)
    } else if (context.sceneEmotion === 'sad' || context.sceneEmotion === 'farewell') {
      if (currentEmotion.value === 'neutral') _updateEmotion('sad', 0.3)
    } else if (context.sceneEmotion === 'tense' || context.sceneEmotion === 'conflict') {
      if (currentEmotion.value === 'neutral') _updateEmotion('surprised', 0.3)
    }
  }

  function onFreeTalkSentiment(messageText) {
    if (!enabled.value || !messageText) return

    const positivePatterns = [/哈哈/, /笑/, /开心/, /好/, /棒/, /厉害/, /谢谢/, /喜欢/, /可爱/]
    const negativePatterns = [/难过/, /伤心/, /抱歉/, /对不起/, /不好/, /烦/, /累/, /讨厌/]
    const surprisePatterns = [/！！/, /真的吗/, /不会吧/, /什么/, /竟然/, /哇/]

    let posScore = 0
    let negScore = 0
    let surpriseScore = 0

    for (const p of positivePatterns) {
      if (p.test(messageText)) posScore++
    }
    for (const p of negativePatterns) {
      if (p.test(messageText)) negScore++
    }
    for (const p of surprisePatterns) {
      if (p.test(messageText)) surpriseScore++
    }

    if (posScore > negScore && posScore > surpriseScore) {
      _updateEmotion('happy', Math.min(0.3 + posScore * 0.1, 0.8))
    } else if (negScore > posScore && negScore > surpriseScore) {
      _updateEmotion('sad', Math.min(0.3 + negScore * 0.1, 0.7))
    } else if (surpriseScore > 0) {
      _updateEmotion('surprised', Math.min(0.3 + surpriseScore * 0.1, 0.7))
    }
  }

  async function requestCameraAccess() {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true })
      stream.getTracks().forEach(t => t.stop())
      cameraPermission.value = 'granted'
      return true
    } catch {
      cameraPermission.value = 'denied'
      return false
    }
  }

  async function startCamera() {
    if (cameraPermission.value !== 'granted') {
      const ok = await requestCameraAccess()
      if (!ok) return false
    }
    cameraActive.value = true
    return true
  }

  function stopCamera() {
    cameraActive.value = false
  }

  function buildEmotionPromptCard() {
    if (!enabled.value) return ''
    if (currentEmotion.value === 'neutral' && !isDistracted.value) return ''

    const lines = ['【玩家情绪感应卡（隐性，角色自然反应即可，不要提及"检测到"）】']

    const emotionDescriptions = {
      happy: '玩家似乎在微笑或感到愉快',
      sad: '玩家似乎有些低落',
      surprised: '玩家似乎感到意外',
      angry: '玩家似乎有些不满',
      fearful: '玩家似乎感到紧张',
      distracted: '玩家似乎心不在焉，注意力可能不在这里',
      engaged: '玩家正认真地关注着对话',
    }

    const desc = emotionDescriptions[currentEmotion.value]
    if (desc) {
      lines.push(`当前感应：${desc}（置信度：${Math.round(emotionConfidence.value * 100)}%）`)
    }

    const effect = currentEffect.value
    if (effect.characterReaction) {
      const reactionGuide = {
        mirror_happiness: '角色可以自然地跟着开心，说一些轻快的话',
        comfort_mode: '角色可以温柔一些，不要说太沉重的话',
        acknowledge_reaction: '角色可以对玩家的反应自然回应',
        careful_approach: '角色说话小心一些，不要火上浇油',
        reassure: '角色可以给出一些安慰或保证',
        attention_call: '角色可以轻轻唤回玩家的注意力',
        positive_flow: '保持当前良好的互动氛围',
      }
      if (reactionGuide[effect.characterReaction]) {
        lines.push(`建议反应：${reactionGuide[effect.characterReaction]}`)
      }
    }

    if (isDistracted.value) {
      lines.push('玩家可能在走神，角色可以用有趣的方式引起注意，或者轻声呼唤。')
    }

    return lines.join('\n')
  }

  function getActiveFilters() {
    if (!enabled.value) return null
    const effect = currentEffect.value
    if (!effect.bgFilter) return null
    return {
      filter: effect.bgFilter,
      intensity: effect.intensity,
      emotion: currentEmotion.value,
    }
  }

  function getDominantEmotion(windowMs = 60000) {
    const cutoff = Date.now() - windowMs
    const recent = emotionHistory.filter(e => e.timestamp >= cutoff)
    if (recent.length === 0) return 'neutral'

    const counts = {}
    for (const e of recent) {
      counts[e.emotion] = (counts[e.emotion] || 0) + e.confidence
    }
    let max = 0
    let dominant = 'neutral'
    for (const [emotion, score] of Object.entries(counts)) {
      if (score > max) { max = score; dominant = emotion }
    }
    return dominant
  }

  function destroy() {
    disable()
    _stopInactivityMonitor()
  }

  return {
    enabled,
    cameraActive,
    cameraPermission,
    currentEmotion,
    emotionConfidence,
    isDistracted,
    currentEffect,
    emotionHistory,
    enable,
    disable,
    onPlayerActivity,
    inferEmotionFromContext,
    onFreeTalkSentiment,
    requestCameraAccess,
    startCamera,
    stopCamera,
    buildEmotionPromptCard,
    getActiveFilters,
    getDominantEmotion,
    destroy,
  }
}
