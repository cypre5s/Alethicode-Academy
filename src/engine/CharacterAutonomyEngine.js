import { ref, reactive, computed } from 'vue'
import { characters } from '../data/characters.js'
import { getRelationshipStage } from '../data/relationshipRules.js'

const AUTONOMY_STORAGE_KEY = 'alethicode_autonomy_state'
const ABSENCE_THRESHOLD_HOURS = 72
const INITIATIVE_COOLDOWN_TURNS = 20
const DEPARTURE_TRUST_FLOOR = 10
const DEPARTURE_TRUST_PEAK_MIN = 40

function _loadState() {
  try {
    const raw = localStorage.getItem(AUTONOMY_STORAGE_KEY)
    if (raw) return JSON.parse(raw)
  } catch {}
  return null
}

function _saveState(data) {
  try { localStorage.setItem(AUTONOMY_STORAGE_KEY, JSON.stringify(data)) } catch {}
}

function _hoursAgo(timestamp) {
  if (!timestamp) return Infinity
  return (Date.now() - timestamp) / (1000 * 60 * 60)
}

export function useCharacterAutonomy() {
  const characterStates = reactive({})
  const pendingNotifications = ref([])
  const departedCharacters = reactive(new Set())
  const interceptedChoice = ref(null)

  const charIds = Object.keys(characters).filter(id => characters[id]?.isPlayable !== false)

  for (const cid of charIds) {
    characterStates[cid] = {
      lastInteractionTime: null,
      lastSessionTime: null,
      turnsSinceLastTalk: 0,
      trustPeakEver: 0,
      initiativeQueued: false,
      initiativeReason: null,
      departed: false,
      departureReason: null,
      absenceHandled: false,
      proactiveContactCount: 0,
    }
  }

  const saved = _loadState()
  if (saved) {
    for (const [cid, state] of Object.entries(saved)) {
      if (characterStates[cid]) Object.assign(characterStates[cid], state)
    }
    if (saved._departed) {
      saved._departed.forEach(id => departedCharacters.add(id))
    }
  }

  function _persist() {
    const data = JSON.parse(JSON.stringify(characterStates))
    data._departed = [...departedCharacters]
    _saveState(data)
  }

  function autonomyTick(gameState, profilerProfile) {
    const events = []

    for (const cid of charIds) {
      const cs = characterStates[cid]
      const rel = gameState.relationship?.[cid]
      if (!rel) continue

      if (rel.trust > cs.trustPeakEver) {
        cs.trustPeakEver = rel.trust
      }

      cs.turnsSinceLastTalk++

      if (departedCharacters.has(cid)) {
        if (rel.trust >= 25 && rel.affection >= 20) {
          departedCharacters.delete(cid)
          cs.departed = false
          cs.departureReason = null
          events.push({
            type: 'return',
            character: cid,
            reason: 'trust_restored',
          })
        }
        continue
      }

      if (
        rel.trust < DEPARTURE_TRUST_FLOOR &&
        cs.trustPeakEver >= DEPARTURE_TRUST_PEAK_MIN
      ) {
        const commitAdj = profilerProfile?.commitment > 0.6 ? 5 : 0
        if (rel.trust < DEPARTURE_TRUST_FLOOR - commitAdj) {
          departedCharacters.add(cid)
          cs.departed = true
          cs.departureReason = 'trust_collapse'
          events.push({
            type: 'departure',
            character: cid,
            reason: 'trust_collapse',
          })
          continue
        }
      }

      const realHoursAgo = _hoursAgo(cs.lastSessionTime)
      if (realHoursAgo >= ABSENCE_THRESHOLD_HOURS && !cs.absenceHandled) {
        cs.absenceHandled = true
        events.push({
          type: 'absence',
          character: cid,
          hoursAbsent: Math.round(realHoursAgo),
          reason: 'long_absence',
        })
      }

      const avg = Math.round((rel.affection + rel.trust + rel.comfort) / 3)
      if (
        avg >= 40 &&
        cs.turnsSinceLastTalk >= INITIATIVE_COOLDOWN_TURNS &&
        !cs.initiativeQueued
      ) {
        cs.initiativeQueued = true
        cs.initiativeReason = _pickInitiativeReason(cid, rel, gameState)
        events.push({
          type: 'proactive_contact',
          character: cid,
          reason: cs.initiativeReason,
        })
      }
    }

    if (events.length > 0) {
      const notifications = events.map(e => ({
        ...e,
        charName: characters[e.character]?.name || e.character,
        charColor: characters[e.character]?.color || '#999',
        timestamp: Date.now(),
      }))
      pendingNotifications.value = [...pendingNotifications.value, ...notifications]
    }

    _persist()
    return events
  }

  function _pickInitiativeReason(charId, rel, gameState) {
    const stage = getRelationshipStage(rel)
    const reasons = []

    if (stage === '亲近' || stage === '暧昧' || stage === '恋慕') {
      reasons.push('miss_you', 'share_discovery', 'check_on_you')
    }
    if (rel.affection >= 50) {
      reasons.push('want_to_talk', 'thinking_of_you')
    }
    if (gameState.challengeResults) {
      const recentChallenges = Object.values(gameState.challengeResults)
        .filter(c => c.timestamp && Date.now() - c.timestamp < 3600000)
      if (recentChallenges.some(c => !c.passed)) {
        reasons.push('encourage_after_failure')
      }
    }
    reasons.push('random_thought', 'found_something_interesting')
    return reasons[Math.floor(Math.random() * reasons.length)]
  }

  function evaluateChoiceRefusal(characterId, choiceText, gameState) {
    if (departedCharacters.has(characterId)) return null

    const rel = gameState.relationship?.[characterId]
    if (!rel) return null

    const stage = getRelationshipStage(rel)
    const char = characters[characterId]
    if (!char) return null

    const isInappropriate = _isChoiceInappropriate(choiceText, stage, char)
    if (!isInappropriate) return null

    return {
      type: 'refusal',
      character: characterId,
      originalChoice: choiceText,
      reason: isInappropriate.reason,
      severity: isInappropriate.severity,
    }
  }

  function _isChoiceInappropriate(text, stage, char) {
    if (!text || typeof text !== 'string') return null
    const lower = text.toLowerCase()

    const intimatePatterns = [
      /亲一?[下个]/, /抱[你住]/, /牵[你手]/, /表白/, /告白/, /我喜欢你/, /我爱你/,
      /在一起/, /做我[的的]女朋友/, /约会/,
    ]
    const rudePatterns = [
      /笨蛋/, /白痴/, /废物/, /滚/, /闭嘴/, /无聊/, /烦死/,
    ]

    if (stage === '初识' || stage === '熟悉') {
      for (const p of intimatePatterns) {
        if (p.test(lower)) {
          return { reason: 'too_intimate_for_stage', severity: 'medium' }
        }
      }
    }

    for (const p of rudePatterns) {
      if (p.test(lower)) {
        return { reason: 'rude_or_hostile', severity: 'high' }
      }
    }

    return null
  }

  function onInteraction(characterId) {
    if (!characterStates[characterId]) return
    characterStates[characterId].lastInteractionTime = Date.now()
    characterStates[characterId].turnsSinceLastTalk = 0
    characterStates[characterId].absenceHandled = false
    if (characterStates[characterId].initiativeQueued) {
      characterStates[characterId].initiativeQueued = false
      characterStates[characterId].initiativeReason = null
    }
    _persist()
  }

  function onSessionStart() {
    for (const cid of charIds) {
      characterStates[cid].lastSessionTime = Date.now()
    }
    _persist()
  }

  function dismissNotification(index) {
    const arr = [...pendingNotifications.value]
    arr.splice(index, 1)
    pendingNotifications.value = arr
  }

  function isCharacterAvailable(characterId) {
    return !departedCharacters.has(characterId)
  }

  function repairRelationship(characterId) {
    if (departedCharacters.has(characterId)) {
      departedCharacters.delete(characterId)
      if (characterStates[characterId]) {
        characterStates[characterId].departed = false
        characterStates[characterId].departureReason = null
      }
      _persist()
    }
  }

  function buildAutonomyPromptCard(characterId, gameState) {
    const cs = characterStates[characterId]
    if (!cs) return ''

    const lines = []
    const realHours = _hoursAgo(cs.lastSessionTime)

    if (realHours >= 24) {
      const days = Math.round(realHours / 24)
      lines.push(`玩家已经 ${days} 天没来了。角色应表现出${days > 5 ? '受伤或释然' : '关心或小小的不满'}。`)
    }

    if (cs.initiativeQueued && cs.initiativeReason) {
      const reasonMap = {
        miss_you: '角色主动想见面，因为想念',
        share_discovery: '角色发现了有趣的东西想分享',
        check_on_you: '角色在关心玩家的状况',
        want_to_talk: '角色单纯想聊天',
        thinking_of_you: '角色不自觉地想到了玩家',
        encourage_after_failure: '角色听说玩家最近遇到了挫折，想要鼓励',
        random_thought: '角色突然想到了和玩家有关的事',
        found_something_interesting: '角色发现了玩家可能感兴趣的东西',
      }
      lines.push(`角色主动联系原因：${reasonMap[cs.initiativeReason] || cs.initiativeReason}`)
      lines.push('这次是角色先开口的——语气应该自然，不要像在回应玩家的话。')
    }

    if (cs.trustPeakEver > 40 && (gameState.relationship?.[characterId]?.trust || 0) < 20) {
      lines.push('角色能感觉到关系变淡了。曾经的亲近变成了客气和距离。')
    }

    if (lines.length === 0) return ''
    return '【角色自主行为卡】\n' + lines.join('\n')
  }

  return {
    characterStates,
    pendingNotifications,
    departedCharacters,
    interceptedChoice,
    autonomyTick,
    evaluateChoiceRefusal,
    onInteraction,
    onSessionStart,
    dismissNotification,
    isCharacterAvailable,
    repairRelationship,
    buildAutonomyPromptCard,
  }
}
