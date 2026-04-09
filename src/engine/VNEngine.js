import { ref, reactive, computed } from 'vue'
import { characters } from '../data/characters.js'
import { locations, resolveBackgroundId, sceneIdFromBackgroundId } from '../data/locations.js'
import { challenges } from '../data/challenges.js'
import { scriptIndex } from '../scripts/index.js'
import { getRelationshipStage } from '../data/relationshipRules.js'
import { pickSceneObjective } from '../data/sceneObjectives.js'
import { classifyChallengeOutcome, calculateRelationshipDelta } from '../data/learningDomains.js'
import { getPostChallengeEvent } from '../data/postChallengeEvents.js'

export function useVNEngine() {
  const currentScript = ref([])
  const scriptPointer = ref(0)
  const currentChapter = ref('prologue')
  const currentNode = ref(null)

  const speaker = ref(null)
  const dialogueText = ref('')
  const dialogueType = ref('normal')
  const speakerExpression = ref('normal')
  const visibleCharacters = reactive({})
  const currentBg = ref('school_gate_day')
  const currentBgVariant = ref('day')
  const currentBgTransition = ref('fade')

  const playerName = ref('')
  const relationship = reactive({
    nene:     { affection: 0, trust: 0, comfort: 0 },
    yoshino:  { affection: 0, trust: 0, comfort: 0 },
    ayase:    { affection: 0, trust: 0, comfort: 0 },
    kanna:    { affection: 0, trust: 0, comfort: 0 },
    murasame: { affection: 0, trust: 0, comfort: 0 },
  })
  const affection = new Proxy({}, {
    get(_, key) {
      if (key === '__v_isReactive' || key === '__v_isRef') return undefined
      return relationship[key] ? Math.round((relationship[key].affection + relationship[key].trust + relationship[key].comfort) / 3) : 0
    },
    set(_, key, val) {
      if (relationship[key]) {
        const current = Math.round((relationship[key].affection + relationship[key].trust + relationship[key].comfort) / 3)
        const delta = val - current
        relationship[key].affection = Math.min(Math.max(relationship[key].affection + delta, 0), 100)
        relationship[key].trust = Math.min(Math.max(relationship[key].trust + delta, 0), 100)
        relationship[key].comfort = Math.min(Math.max(relationship[key].comfort + delta, 0), 100)
      }
      return true
    },
    has(_, key) { return key in relationship },
    ownKeys() { return Object.keys(relationship) },
    getOwnPropertyDescriptor(_, key) {
      if (key in relationship) return { configurable: true, enumerable: true, value: this.get(_, key) }
      return undefined
    }
  })
  const flags = reactive({})
  const challengeResults = reactive({})
  const conversationHistory = reactive({ nene: [], yoshino: [], ayase: [], kanna: [], murasame: [] })
  const memories = reactive({ nene: [], yoshino: [], ayase: [], kanna: [], murasame: [] })
  const visitLog = reactive({
    nene: { totalVisits: 0, lastVisitChapter: '', lastVisitTimeSlot: '', lastTopics: [] },
    yoshino: { totalVisits: 0, lastVisitChapter: '', lastVisitTimeSlot: '', lastTopics: [] },
    ayase: { totalVisits: 0, lastVisitChapter: '', lastVisitTimeSlot: '', lastTopics: [] },
    kanna: { totalVisits: 0, lastVisitChapter: '', lastVisitTimeSlot: '', lastTopics: [] },
    murasame: { totalVisits: 0, lastVisitChapter: '', lastVisitTimeSlot: '', lastTopics: [] },
  })
  const lastChallengeResult = ref(null)
  const unlockedCGs = reactive(new Set())
  const unlockedBGM = reactive(new Set())
  const history = reactive([])

  const SEEN_KEY = 'alethicode_seen_dialogues'
  const seenDialogues = reactive(new Set(_loadSeenDialogues()))
  const skipOnlyRead = ref(true)

  function _loadSeenDialogues() {
    try { return JSON.parse(localStorage.getItem(SEEN_KEY)) || [] }
    catch { return [] }
  }

  function _persistSeen() {
    try {
      if (seenDialogues.size > 0) {
        localStorage.setItem(SEEN_KEY, JSON.stringify([...seenDialogues]))
      }
    } catch {}
  }

  function markSeen(chapterId, index) {
    seenDialogues.add(`${chapterId}:${index}`)
  }

  function isSeen(chapterId, index) {
    return seenDialogues.has(`${chapterId}:${index}`)
  }

  function flushSeen() {
    _persistSeen()
  }

  const showPanel = ref(null)
  const isChoosing = ref(false)
  const choicePrompt = ref('')
  const choiceOptions = ref([])
  const isChallenge = ref(false)
  const challengeData = ref(null)
  const isLocationSelect = ref(false)
  const locationOptions = ref([])
  const isFreeTalk = ref(false)
  const freeTalkData = ref(null)

  const isTransitioning = ref(false)
  const transitionType = ref('fade')
  const transitionDuration = ref(1000)
  const screenEffect = ref(null)
  const dialogueBoxEffect = ref(null)
  const sceneEmotion = ref(null)
  const showTitleCard = ref(false)
  const titleCardText = ref('')
  const titleCardSubtitle = ref('')
  const showCG = ref(false)
  const currentCG = ref(null)
  const showEnding = ref(false)
  const endingData = ref(null)
  const affectionToast = ref(null)

  const showSkipSummary = ref(false)
  const skipSummary = ref([])

  const textSpeed = ref(30)
  const autoPlay = ref(false)
  const autoPlayDelay = ref(3000)
  const bgmVolume = ref(0.5)
  const seVolume = ref(0.7)
  const fontSize = ref('medium')

  const gamePhase = ref('prologue')
  const currentRoute = ref(null)
  const currentTimeSlot = ref('morning')

  const hasSave = computed(() => {
    try { return !!localStorage.getItem('alethicode_save_auto') }
    catch { return false }
  })

  const audioCallbacks = {
    playBgm: null,
    stopBgm: null,
    playSfx: null,
  }

  function registerAudioCallbacks(cbs) {
    Object.assign(audioCallbacks, cbs)
  }

  function newGame(name) {
    if (name) playerName.value = name
    scriptPointer.value = 0
    currentChapter.value = 'prologue'
    Object.keys(relationship).forEach(k => {
      relationship[k].affection = 0
      relationship[k].trust = 0
      relationship[k].comfort = 0
    })
    Object.keys(flags).forEach(k => delete flags[k])
    Object.keys(challengeResults).forEach(k => delete challengeResults[k])
    Object.keys(conversationHistory).forEach(k => conversationHistory[k] = [])
    Object.keys(memories).forEach(k => memories[k] = [])
    Object.keys(visitLog).forEach(k => {
      visitLog[k] = { totalVisits: 0, lastVisitChapter: '', lastVisitTimeSlot: '', lastTopics: [] }
    })
    lastChallengeResult.value = null
    Object.keys(visibleCharacters).forEach(k => delete visibleCharacters[k])
    history.length = 0
    unlockedCGs.clear()
    unlockedBGM.clear()
    speaker.value = null
    dialogueText.value = ''
    dialogueType.value = 'normal'
    currentBg.value = 'school_gate_day'
    currentBgVariant.value = 'day'
    showPanel.value = null
    isChoosing.value = false
    isChallenge.value = false
    isLocationSelect.value = false
    isFreeTalk.value = false
    showCG.value = false
    showEnding.value = false
    showTitleCard.value = false
    gamePhase.value = 'prologue'
    currentRoute.value = null
    currentTimeSlot.value = 'morning'
    loadChapter('prologue')
  }

  function loadChapter(chapterId) {
    const script = scriptIndex[chapterId]
    if (!script) return
    currentChapter.value = chapterId
    currentScript.value = script
    scriptPointer.value = 0
    executeNext()
  }

  function jumpToLabel(label) {
    const idx = currentScript.value.findIndex(cmd => cmd.label === label)
    if (idx >= 0) {
      scriptPointer.value = idx
      executeNext()
    }
  }

  function executeNext() {
    if (scriptPointer.value >= currentScript.value.length) {
      onChapterEnd()
      return
    }
    const cmd = currentScript.value[scriptPointer.value]
    scriptPointer.value++
    executeCommand(cmd)
  }

  function executeCommand(cmd) {
    if (!cmd) { executeNext(); return }

    switch (cmd.type) {
      case 'dialogue': handleDialogue(cmd); break
      case 'monologue': handleMonologue(cmd); break
      case 'narration': handleNarration(cmd); break

      case 'choice': handleChoice(cmd); break
      case 'condition': handleCondition(cmd); break
      case 'jump': loadChapter(cmd.target); break
      case 'jump_label': jumpToLabel(cmd.target); break

      case 'bg': handleBg(cmd); break
      case 'char_enter': handleCharEnter(cmd); break
      case 'char_exit': handleCharExit(cmd); break
      case 'char_expression': handleCharExpression(cmd); break
      case 'char_move': handleCharMove(cmd); break
      case 'show': handleCharEnter(cmd); break
      case 'hide': handleCharExit(cmd); break
      case 'hideAll': handleHideAll(); break

      case 'bgm': handleBgm(cmd); break
      case 'bgm_stop': handleBgmStop(cmd); break
      case 'se': handleSe(cmd); break
      case 'sfx': handleSe(cmd); break

      case 'screen_effect': handleScreenEffect(cmd); break
      case 'silence_beat': handleSilenceBeat(cmd); break
      case 'char_action': handleCharAction(cmd); break
      case 'set_emotion': sceneEmotion.value = cmd.emotion || null; executeNext(); break
      case 'dialogue_effect': dialogueBoxEffect.value = cmd.effect || null; executeNext(); break
      case 'wait': handleWait(cmd); break
      case 'auto_save': handleAutoSave(); break

      case 'challenge': handleChallenge(cmd); break
      case 'location_select': handleLocationSelect(cmd); break
      case 'free_talk': handleFreeTalk(cmd); break
      case 'competition': handleCompetition(cmd); break

      case 'flag': handleFlag(cmd); break
      case 'set_flag': handleFlag({ set: cmd.key, value: cmd.value }); break
      case 'affection': handleAffection(cmd); break
      case 'route_decision': handleRouteDecision(cmd); break
      case 'route_branch': handleRouteDecision(cmd); break

      case 'cg': handleCG(cmd); break
      case 'title_card': handleTitleCard(cmd); break
      case 'chapter_title': handleTitleCard({ text: cmd.text }); break
      case 'ending': handleEnding(cmd); break
      case 'unlock_cg': unlockedCGs.add(cmd.id); executeNext(); break

      default: executeNext()
    }
  }

  function handleSilenceBeat(cmd) {
    const duration = Math.min(cmd.duration || 400, 5000)
    const mode = cmd.mode || 'blank'

    if (mode === 'blackout') {
      screenEffect.value = { type: 'fade-to-black' }
      setTimeout(() => {
        screenEffect.value = null
        executeNext()
      }, duration)
    } else if (mode === 'nameplate_first') {
      const charId = cmd.character
      const char = characters[charId]
      speaker.value = char || null
      dialogueText.value = ''
      dialogueType.value = 'normal'
      setTimeout(() => {
        executeNext()
      }, duration || 600)
    } else {
      setTimeout(() => executeNext(), duration)
    }
  }

  function handleCharAction(cmd) {
    const charId = cmd.character
    if (visibleCharacters[charId]) {
      visibleCharacters[charId].microAction = cmd.action || null
      const holdDuration = cmd.hold || 1200
      setTimeout(() => {
        if (visibleCharacters[charId]?.microAction === cmd.action) {
          visibleCharacters[charId].microAction = null
        }
      }, holdDuration)
    }
    if (cmd.bgVignette !== undefined) {
      sceneEmotion.value = cmd.bgVignette ? 'vignette' : null
    }
    executeNext()
  }

  function handleDialogue(cmd) {
    markSeen(currentChapter.value, scriptPointer.value - 1)
    const charId = cmd.speaker
    const char = characters[charId]
    speaker.value = char || (charId === '???' ? { id: '???', name: '???', color: '#aaa' } : null)
    dialogueText.value = cmd.text.replace(/{playerName}/g, playerName.value)
    dialogueType.value = 'normal'
    speakerExpression.value = cmd.expression || 'normal'

    if (cmd.dialogueEffect) {
      dialogueBoxEffect.value = cmd.dialogueEffect
    }

    if (char && charId !== 'narrator' && visibleCharacters[charId]) {
      visibleCharacters[charId].expression = cmd.expression || visibleCharacters[charId].expression
      if (cmd.microAction) {
        visibleCharacters[charId].microAction = cmd.microAction
        setTimeout(() => {
          if (visibleCharacters[charId]?.microAction === cmd.microAction) {
            visibleCharacters[charId].microAction = null
          }
        }, 1200)
      }
    }

    history.push({
      type: 'dialogue',
      speaker: char?.name || charId || '',
      speakerColor: char?.color || '#aaa',
      text: cmd.text.replace(/{playerName}/g, playerName.value),
      expression: cmd.expression
    })
  }

  function handleMonologue(cmd) {
    markSeen(currentChapter.value, scriptPointer.value - 1)
    speaker.value = null
    dialogueText.value = cmd.text.replace(/{playerName}/g, playerName.value)
    dialogueType.value = 'monologue'
    history.push({ type: 'monologue', text: dialogueText.value })
  }

  function handleNarration(cmd) {
    markSeen(currentChapter.value, scriptPointer.value - 1)
    speaker.value = null
    dialogueText.value = cmd.text.replace(/{playerName}/g, playerName.value)
    dialogueType.value = 'narration'
    history.push({ type: 'narration', text: dialogueText.value })
  }

  function handleChoice(cmd) {
    isChoosing.value = true
    choicePrompt.value = cmd.prompt || ''
    choiceOptions.value = cmd.options.map(o => ({
      text: o.text,
      effects: o.effects || {},
      next: o.next || null,
      flags: o.flags || o.flag || null,
      condition: o.condition || null
    }))
  }

  function selectChoice(index) {
    const option = choiceOptions.value[index]
    isChoosing.value = false
    choicePrompt.value = ''
    choiceOptions.value = []
    history.push({ type: 'choice', text: option.text })

    if (option.effects) {
      Object.entries(option.effects).forEach(([k, v]) => {
        if (k in affection) {
          showAffectionToast(k, v)
        }
      })
    }
    if (option.flags) {
      if (typeof option.flags === 'object' && !Array.isArray(option.flags)) {
        Object.entries(option.flags).forEach(([k, v]) => { flags[k] = v })
      } else if (option.flags.key) {
        flags[option.flags.key] = option.flags.value
      }
    }
    if (option.next) {
      if (scriptIndex[option.next]) {
        loadChapter(option.next)
      } else {
        jumpToLabel(option.next)
      }
    } else {
      executeNext()
    }
  }

  function handleCondition(cmd) {
    const result = evaluateConditionExpr(cmd.check || cmd.condition)
    if (result) {
      if (cmd.true_branch) {
        if (scriptIndex[cmd.true_branch]) loadChapter(cmd.true_branch)
        else jumpToLabel(cmd.true_branch)
      } else {
        executeNext()
      }
    } else {
      if (cmd.false_branch) {
        if (scriptIndex[cmd.false_branch]) loadChapter(cmd.false_branch)
        else jumpToLabel(cmd.false_branch)
      } else {
        executeNext()
      }
    }
  }

  function _safeEvalCondition(expr) {
    const COMPARISON_RE = /^(flags|affection)\.(\w{1,32})\s*(>=|<=|>|<|===|==|!==|!=)\s*(.+)$/
    const match = expr.trim().match(COMPARISON_RE)
    if (!match) return false
    const [, ns, key, op, rawVal] = match

    let left
    if (ns === 'flags') left = flags[key]
    else if (ns === 'affection') left = affection[key] || 0
    else return false

    let right
    const trimmed = rawVal.trim()
    if (trimmed === 'true') right = true
    else if (trimmed === 'false') right = false
    else if (trimmed === 'null') right = null
    else if (/^-?\d+(\.\d+)?$/.test(trimmed)) right = Number(trimmed)
    else if (/^["'].*["']$/.test(trimmed)) right = trimmed.slice(1, -1)
    else return false

    switch (op) {
      case '>=': return left >= right
      case '<=': return left <= right
      case '>':  return left > right
      case '<':  return left < right
      case '===': case '==': return left === right
      case '!==': case '!=': return left !== right
      default: return false
    }
  }

  function evaluateConditionExpr(expr) {
    if (!expr) return true
    if (typeof expr === 'object') {
      if (expr.flag) return flags[expr.flag] === expr.value
      if (expr.affection) {
        const val = affection[expr.character] || 0
        if (expr.op === '>=') return val >= expr.value
        if (expr.op === '>') return val > expr.value
        if (expr.op === '<') return val < expr.value
        if (expr.op === '<=') return val <= expr.value
        if (expr.op === '==') return val === expr.value
      }
      return true
    }
    if (typeof expr === 'string') {
      try {
        return _safeEvalCondition(expr)
      } catch {
        return false
      }
    }
    return true
  }

  function handleBg(cmd) {
    const bgSrc = cmd.src || cmd.location || cmd.id
    const transition = cmd.transition || 'fade'
    const duration = cmd.duration || 800

    isTransitioning.value = true
    transitionType.value = transition
    transitionDuration.value = duration

    setTimeout(() => {
      currentBg.value = bgSrc
      if (cmd.variant) currentBgVariant.value = cmd.variant
      setTimeout(() => { isTransitioning.value = false }, duration / 2)
    }, duration / 2)

    executeNext()
  }

  function handleCharEnter(cmd) {
    const charId = cmd.character
    visibleCharacters[charId] = {
      id: charId,
      expression: cmd.expression || 'normal',
      position: cmd.position || 'center',
      animation: cmd.animation || 'fade_in',
      entering: true
    }
    setTimeout(() => {
      if (visibleCharacters[charId]) {
        visibleCharacters[charId].entering = false
        visibleCharacters[charId].animation = null
      }
    }, 600)
    executeNext()
  }

  function handleCharExit(cmd) {
    const charId = cmd.character
    if (visibleCharacters[charId]) {
      visibleCharacters[charId].exiting = true
      visibleCharacters[charId].animation = cmd.animation || 'fade_out'
      setTimeout(() => {
        delete visibleCharacters[charId]
      }, 500)
    }
    executeNext()
  }

  function handleCharExpression(cmd) {
    const charId = cmd.character
    if (visibleCharacters[charId]) {
      visibleCharacters[charId].expression = cmd.expression
    }
    executeNext()
  }

  function handleCharMove(cmd) {
    const charId = cmd.character
    if (visibleCharacters[charId]) {
      visibleCharacters[charId].position = cmd.to || cmd.position
    }
    const dur = cmd.duration || 500
    setTimeout(() => executeNext(), dur)
  }

  function handleHideAll() {
    Object.keys(visibleCharacters).forEach(k => delete visibleCharacters[k])
    executeNext()
  }

  function handleBgm(cmd) {
    const bgmId = cmd.src || cmd.id
    unlockedBGM.add(bgmId)
    audioCallbacks.playBgm?.(bgmId, cmd.fadeIn || cmd.crossfade || 1500)
    executeNext()
  }

  function handleBgmStop(cmd) {
    audioCallbacks.stopBgm?.(cmd.fadeOut || 1000)
    executeNext()
  }

  function handleSe(cmd) {
    const seId = cmd.src || cmd.id
    audioCallbacks.playSfx?.(seId)
    executeNext()
  }

  function handleScreenEffect(cmd) {
    screenEffect.value = {
      effect: cmd.effect,
      duration: cmd.duration || 500
    }
    setTimeout(() => {
      screenEffect.value = null
    }, cmd.duration || 500)
    executeNext()
  }

  function handleWait(cmd) {
    const ms = cmd.duration || cmd.ms || 1000
    setTimeout(() => executeNext(), ms)
  }

  function handleAutoSave() {
    const state = getState()
    try {
      localStorage.setItem('alethicode_save_auto', JSON.stringify({
        ...state, timestamp: Date.now(), dateStr: new Date().toLocaleString('zh-CN')
      }))
    } catch {}
    executeNext()
  }

  function handleChallenge(cmd) {
    const ch = challenges[cmd.id]
    if (ch) {
      isChallenge.value = true
      challengeData.value = {
        ...ch,
        contextDialogue: cmd.context_dialogue || cmd.contextDialogue || null,
        rewards: cmd.rewards || cmd.success_affection || {},
        failRewards: cmd.fail_affection || {},
        failConsequence: cmd.fail_consequence || null,
        successConsequence: cmd.success_consequence || null
      }
    } else {
      executeNext()
    }
  }

  function resolveChallenge(success, challengeId, meta = {}) {
    const data = challengeData.value
    if (!data) { executeNext(); return }

    const id = data.id || challengeId
    const hintsUsed = meta.hintsUsed || 0
    const outcome = classifyChallengeOutcome(success, hintsUsed, id, challengeResults, challenges)
    const domain = data.knowledge_domain || challenges[id]?.knowledge_domain || null
    const relatedChar = data.related_character || challenges[id]?.related_character || null

    const resultEntry = {
      passed: success,
      timestamp: Date.now(),
      challengeId: id,
      title: data.title || '',
      outcome,
      hintsUsed,
      knowledge_domain: domain,
    }
    challengeResults[id] = resultEntry
    lastChallengeResult.value = resultEntry

    if (relatedChar && relationship[relatedChar]) {
      const delta = calculateRelationshipDelta(outcome, relatedChar, domain)
      applyRelationshipDelta(relatedChar, delta)
      const aggregate = Math.round((delta.affection + delta.trust + delta.comfort) / 3) || (delta.affection + delta.trust + delta.comfort > 0 ? 1 : delta.affection + delta.trust + delta.comfort < 0 ? -1 : 0)
      if (aggregate !== 0) {
        const char = characters[relatedChar]
        if (char) {
          affectionToast.value = { character: relatedChar, name: char.nameShort || char.name, change: aggregate, color: char.color }
          setTimeout(() => { affectionToast.value = null }, 2000)
        }
      }
    }

    if (success) {
      if (data.successConsequence?.flag) {
        Object.entries(data.successConsequence.flag).forEach(([k, v]) => { flags[k] = v })
      }
      if (data.successConsequence?.effects) {
        Object.entries(data.successConsequence.effects).forEach(([k, v]) => {
          if (k in affection && k !== relatedChar) { showAffectionToast(k, v) }
        })
      }
    } else {
      if (data.failConsequence?.flag) {
        Object.entries(data.failConsequence.flag).forEach(([k, v]) => { flags[k] = v })
      }
    }

    if (relatedChar && memories[relatedChar]) {
      const postEvent = getPostChallengeEvent(id, relatedChar, outcome)
      let memText = ''
      if (postEvent?.memory_template) {
        const charName = characters[relatedChar]?.nameShort || characters[relatedChar]?.name || relatedChar
        memText = postEvent.memory_template
          .replace('${name}', playerName.value)
          .replace('${character_name}', charName)
          .replace('${title}', data.title || id)
      }
      if (!memText) {
        const outcomeTexts = {
          solo_pass: `独立做对了「${data.title || id}」`,
          assisted_pass: `在提示下做对了「${data.title || id}」`,
          thoughtful_fail: `在「${data.title || id}」上暂时失败了`,
          careless_fail: `在「${data.title || id}」上又犯了类似的错`,
        }
        memText = outcomeTexts[outcome] || `完成了「${data.title || id}」`
      }
      const emotionMap = {
        solo_pass: 'warm',
        assisted_pass: 'warm',
        thoughtful_fail: 'bittersweet',
        careless_fail: 'tense',
      }
      memories[relatedChar].push({
        id: `learn_${id}_${Date.now()}`,
        text: memText,
        context: 'challenge',
        chapter: currentChapter.value,
        timestamp: Date.now(),
        emotion: emotionMap[outcome] || 'warm',
        relStageAtTime: getRelationshipStage(relationship[relatedChar]),
        source: 'challenge',
        challenge_id: id,
        knowledge_domain: domain,
        outcome,
      })
      if (memories[relatedChar].length > 30) {
        memories[relatedChar] = memories[relatedChar].slice(-30)
      }
    }

    isChallenge.value = false
    challengeData.value = null
    executeNext()
  }

  function handleLocationSelect(cmd) {
    isLocationSelect.value = true
    const available = cmd.available || cmd.locations || []
    locationOptions.value = available.map(loc => {
      const locId = typeof loc === 'string' ? loc : loc.id
      const sceneId = sceneIdFromBackgroundId(locId)
      const locData = locations[sceneId]
      return {
        id: locId,
        name: locData?.name || locId,
        character: (typeof loc === 'object' ? loc.character : null) || locData?.meetCharacter || null,
        next: typeof loc === 'object' ? loc.next : null,
        description: locData?.description || ''
      }
    })
  }

  function selectLocation(locId) {
    const loc = locationOptions.value.find(l => l.id === locId)
    isLocationSelect.value = false
    locationOptions.value = []

    if (loc?.character && loc.character in affection) {
      showAffectionToast(loc.character, 1)
    }

    if (loc?.next) {
      if (scriptIndex[loc.next]) loadChapter(loc.next)
      else jumpToLabel(loc.next)
    } else {
      currentBg.value = resolveBackgroundId(locId, currentTimeSlot.value)
      executeNext()
    }
  }

  function handleFreeTalk(cmd) {
    const mode = cmd.mode || 'free'

    if (mode === 'scripted') {
      if (cmd.dialogue) {
        cmd.dialogue.forEach(line => executeCommand(line))
      }
      executeNext()
      return
    }

    const charId = cmd.character
    const rel = relationship[charId]
    const stage = rel ? getRelationshipStage(rel) : '初识'
    const objective = cmd.sceneObjective || pickSceneObjective(charId, stage)

    if (visitLog[charId]) {
      visitLog[charId].totalVisits++
      visitLog[charId].lastVisitChapter = currentChapter.value
      visitLog[charId].lastVisitTimeSlot = currentTimeSlot.value
    }

    isFreeTalk.value = true
    freeTalkData.value = {
      character: charId,
      maxTurns: cmd.max_turns || 5,
      context: cmd.context || '',
      currentTurn: 0,
      mode,
      sceneObjective: objective,
      mustMention: cmd.mustMention || null,
      mustNotMention: cmd.mustNotMention || null,
      relationshipTarget: cmd.relationshipTarget || null,
      lastChallengeResult: lastChallengeResult.value,
      visitCount: visitLog[charId]?.totalVisits || 1,
    }
  }

  function resolveFreeTalk(affectionChanges) {
    isFreeTalk.value = false
    if (affectionChanges) {
      Object.entries(affectionChanges).forEach(([k, v]) => {
        if (k in affection) { showAffectionToast(k, v, true) }
      })
    }
    freeTalkData.value = null
    executeNext()
  }

  function handleCompetition(cmd) {
    isChallenge.value = true
    const rounds = (cmd.rounds || []).map(r => ({
      ...r,
      challengeData: challenges[r.challenge_id] || null
    }))
    challengeData.value = {
      ...cmd,
      isCompetition: true,
      title: cmd.title || '编程竞赛',
      rounds,
      currentRound: 0,
      scores: { player: 0, opponent: 0 },
      final_ranking_effects: cmd.final_ranking_effects || {}
    }
  }

  function handleFlag(cmd) {
    if (cmd.set) flags[cmd.set] = cmd.value !== undefined ? cmd.value : true
    executeNext()
  }

  function handleAffection(cmd) {
    if (cmd.changes) {
      Object.entries(cmd.changes).forEach(([k, v]) => {
        if (k in affection) { showAffectionToast(k, v) }
      })
    } else if (cmd.character && cmd.change !== undefined) {
      if (cmd.character in affection) {
        showAffectionToast(cmd.character, cmd.change)
      }
    }
    executeNext()
  }

  function _relAvg(charId) {
    const r = relationship[charId]
    if (!r) return 0
    return Math.round((r.affection + r.trust + r.comfort) / 3)
  }

  function handleRouteDecision(cmd) {
    const charIds = Object.keys(relationship)
    const allMet = charIds.every(k => _relAvg(k) >= 30)
    const murasameOk = _relAvg('murasame') >= 50 && allMet && flags.murasame_gate_passed

    if (murasameOk) {
      currentRoute.value = 'murasame'
      loadChapter('route_murasame')
      return
    }

    const sorted = charIds
      .filter(k => k !== 'murasame')
      .map(k => [k, _relAvg(k)])
      .sort((a, b) => b[1] - a[1])
    const [topChar] = sorted[0]

    if (sorted[0][1] >= 20) {
      currentRoute.value = topChar
      loadChapter(`route_${topChar}`)
    } else {
      currentRoute.value = 'nene'
      loadChapter('route_nene')
    }
  }

  function handleCG(cmd) {
    const cgId = cmd.id
    const preBeat = cmd.preBeat !== false ? 400 : 0

    unlockedCGs.add(cgId)

    if (preBeat > 0) {
      screenEffect.value = { type: 'fade-to-black' }
      setTimeout(() => {
        screenEffect.value = null
        showCG.value = true
        currentCG.value = cmd.zoom !== undefined || cmd.vignette !== undefined || cmd.crop
          ? { id: cgId, zoom: cmd.zoom, vignette: cmd.vignette, crop: cmd.crop }
          : cgId
      }, preBeat)
    } else {
      showCG.value = true
      currentCG.value = cmd.zoom !== undefined || cmd.vignette !== undefined || cmd.crop
        ? { id: cgId, zoom: cmd.zoom, vignette: cmd.vignette, crop: cmd.crop }
        : cgId
    }
  }

  function dismissCG() {
    showCG.value = false
    currentCG.value = null
    executeNext()
  }

  function handleTitleCard(cmd) {
    showTitleCard.value = true
    titleCardText.value = cmd.text || ''
    titleCardSubtitle.value = cmd.subtitle || ''
    audioCallbacks.playSfx?.('chapter')
    setTimeout(() => {
      showTitleCard.value = false
      titleCardText.value = ''
      titleCardSubtitle.value = ''
      executeNext()
    }, 3000)
  }

  function handleEnding(cmd) {
    showEnding.value = true
    endingData.value = {
      endingType: cmd.endingType || cmd.type || 'normal',
      route: cmd.route || currentRoute.value,
      title: cmd.title || '结局',
      text: cmd.text || '',
      cg: cmd.cg || null
    }
    if (cmd.cg) unlockedCGs.add(cmd.cg)
    flags[`ending_${cmd.route || currentRoute.value}_${cmd.endingType || cmd.type}`] = true
    history.push({ type: 'ending', text: cmd.title })
  }

  function applyRelationshipDelta(charId, deltas) {
    if (!relationship[charId]) return
    if (typeof deltas === 'number') {
      relationship[charId].affection = Math.min(Math.max(relationship[charId].affection + deltas, 0), 100)
      relationship[charId].trust = Math.min(Math.max(relationship[charId].trust + deltas, 0), 100)
      relationship[charId].comfort = Math.min(Math.max(relationship[charId].comfort + deltas, 0), 100)
    } else {
      if (deltas.affection) relationship[charId].affection = Math.min(Math.max(relationship[charId].affection + deltas.affection, 0), 100)
      if (deltas.trust) relationship[charId].trust = Math.min(Math.max(relationship[charId].trust + deltas.trust, 0), 100)
      if (deltas.comfort) relationship[charId].comfort = Math.min(Math.max(relationship[charId].comfort + deltas.comfort, 0), 100)
    }
  }

  function showAffectionToast(charId, change, skipAdd = false) {
    if (change === 0) return
    const char = characters[charId]
    if (!char) return
    if (!skipAdd) {
      applyRelationshipDelta(charId, change)
    }
    affectionToast.value = { character: charId, name: char.nameShort || char.name, change, color: char.color }
    setTimeout(() => { affectionToast.value = null }, 2000)
  }

  function onChapterEnd() {
    const nextMap = {
      prologue: 'chapter1',
      chapter1: 'chapter2',
      chapter2: 'chapter3',
      chapter3: null
    }
    const next = nextMap[currentChapter.value]
    if (next) {
      loadChapter(next)
    }
  }

  const INTERACTIVE_TYPES = ['challenge', 'choice', 'location_select', 'free_talk', 'ending', 'route_decision']
  const TEXT_TYPES = ['dialogue', 'monologue', 'narration']

  function scanNextInteractive(startIdx) {
    const script = currentScript.value
    for (let i = startIdx; i < script.length; i++) {
      if (INTERACTIVE_TYPES.includes(script[i].type)) {
        return { index: i, type: script[i].type }
      }
    }
    return { index: script.length, type: 'end' }
  }

  const canSkipSection = computed(() => {
    if (isChoosing.value || isChallenge.value || isLocationSelect.value ||
        isFreeTalk.value || showEnding.value || showSkipSummary.value || showCG.value) {
      return false
    }
    const next = scanNextInteractive(scriptPointer.value)
    if (next.type === 'challenge') return false
    if (next.type === 'end' && next.index <= scriptPointer.value) return false
    const hasText = currentScript.value
      .slice(scriptPointer.value, next.index)
      .some(cmd => TEXT_TYPES.includes(cmd.type))
    return hasText
  })

  function skipSection() {
    if (!canSkipSection.value) return

    const script = currentScript.value
    const next = scanNextInteractive(scriptPointer.value)
    const collected = []

    for (let i = scriptPointer.value; i < next.index; i++) {
      const cmd = script[i]

      if (TEXT_TYPES.includes(cmd.type)) {
        const charId = cmd.speaker
        const char = charId ? (characters[charId] || (charId === '???' ? { name: '???' } : null)) : null
        const text = (cmd.text || '').replace(/{playerName}/g, playerName.value)
        collected.push({
          type: cmd.type,
          speaker: char?.name || null,
          text
        })
        history.push({
          type: cmd.type,
          speaker: char?.name || '',
          speakerColor: char?.color || '#aaa',
          text
        })
        continue
      }

      switch (cmd.type) {
        case 'bg':
          currentBg.value = cmd.src || cmd.location || cmd.id
          if (cmd.variant) currentBgVariant.value = cmd.variant
          break
        case 'char_enter':
          visibleCharacters[cmd.character] = {
            id: cmd.character,
            expression: cmd.expression || 'normal',
            position: cmd.position || 'center',
            animation: null,
            entering: false
          }
          break
        case 'char_exit':
          delete visibleCharacters[cmd.character]
          break
        case 'char_expression':
          if (visibleCharacters[cmd.character]) {
            visibleCharacters[cmd.character].expression = cmd.expression
          }
          break
        case 'bgm':
          unlockedBGM.add(cmd.src || cmd.id)
          audioCallbacks.playBgm?.(cmd.src || cmd.id, cmd.fadeIn || cmd.crossfade || 1500)
          break
        case 'bgm_stop':
          audioCallbacks.stopBgm?.(cmd.fadeOut || 1000)
          break
        case 'flag':
        case 'set_flag':
          if (cmd.set) flags[cmd.set] = cmd.value !== undefined ? cmd.value : true
          else if (cmd.key) flags[cmd.key] = cmd.value !== undefined ? cmd.value : true
          break
        case 'affection':
          if (cmd.changes) {
            Object.entries(cmd.changes).forEach(([k, v]) => {
              if (k in affection) affection[k] += v
            })
          } else if (cmd.character && cmd.change !== undefined) {
            if (cmd.character in affection) affection[cmd.character] += cmd.change
          }
          break
        case 'auto_save':
          handleAutoSave()
          break
      }
    }

    scriptPointer.value = next.index

    const maxLines = 8
    let summary = collected
    if (summary.length > maxLines) {
      const head = summary.slice(0, 3)
      const tail = summary.slice(-3)
      const mid = [{ type: 'narration', speaker: null, text: `……（省略了 ${summary.length - 6} 段对话）……` }]
      summary = [...head, ...mid, ...tail]
    }

    skipSummary.value = summary
    showSkipSummary.value = true
    dialogueText.value = ''
    speaker.value = null
  }

  function dismissSkipSummary() {
    showSkipSummary.value = false
    skipSummary.value = []
    if (scriptPointer.value < currentScript.value.length) {
      executeNext()
    } else {
      onChapterEnd()
    }
  }

  function advanceText() {
    if (isChoosing.value || isChallenge.value || isLocationSelect.value || isFreeTalk.value) return
    if (showSkipSummary.value) return
    if (showCG.value) { dismissCG(); return }
    if (showEnding.value) return
    executeNext()
  }

  function getState() {
    return {
      scriptPointer: scriptPointer.value,
      currentChapter: currentChapter.value,
      playerName: playerName.value,
      relationship: JSON.parse(JSON.stringify(relationship)),
      affection: Object.fromEntries(Object.keys(relationship).map(k => [k, _relAvg(k)])),
      flags: { ...flags },
      challengeResults: { ...challengeResults },
      currentBg: currentBg.value,
      currentBgVariant: currentBgVariant.value,
      currentTimeSlot: currentTimeSlot.value,
      visibleCharacters: JSON.parse(JSON.stringify(visibleCharacters)),
      history: history.slice(-200),
      unlockedCGs: [...unlockedCGs],
      unlockedBGM: [...unlockedBGM],
      gamePhase: gamePhase.value,
      currentRoute: currentRoute.value,
      dialogueText: dialogueText.value,
      dialogueType: dialogueType.value,
      speakerName: speaker.value?.name || '',
      speakerId: speaker.value?.id || null,
      conversationHistory: Object.fromEntries(
        Object.entries(conversationHistory).map(([k, v]) => [k, v.slice(-10)])
      ),
      memories: JSON.parse(JSON.stringify(memories)),
      visitLog: JSON.parse(JSON.stringify(visitLog)),
      settings: {
        textSpeed: textSpeed.value,
        autoSpeed: autoPlayDelay.value,
        bgmVolume: bgmVolume.value,
        seVolume: seVolume.value,
        fontSize: fontSize.value,
      }
    }
  }

  function restoreState(state) {
    if (!state) return
    playerName.value = state.playerName || ''

    Object.keys(relationship).forEach(k => {
      if (state.relationship && state.relationship[k]) {
        relationship[k].affection = state.relationship[k].affection || 0
        relationship[k].trust = state.relationship[k].trust || 0
        relationship[k].comfort = state.relationship[k].comfort || 0
      } else if (state.affection && typeof state.affection[k] === 'number') {
        const old = state.affection[k]
        relationship[k].affection = old
        relationship[k].trust = Math.round(old * 0.8)
        relationship[k].comfort = Math.round(old * 0.9)
      } else {
        relationship[k].affection = 0
        relationship[k].trust = 0
        relationship[k].comfort = 0
      }
    })

    Object.keys(flags).forEach(k => delete flags[k])
    if (state.flags) Object.assign(flags, state.flags)
    Object.keys(challengeResults).forEach(k => delete challengeResults[k])
    if (state.challengeResults) Object.assign(challengeResults, state.challengeResults)
    Object.keys(visibleCharacters).forEach(k => delete visibleCharacters[k])
    if (state.visibleCharacters) Object.assign(visibleCharacters, state.visibleCharacters)
    Object.keys(conversationHistory).forEach(k => conversationHistory[k] = [])
    if (state.conversationHistory) {
      Object.entries(state.conversationHistory).forEach(([k, v]) => {
        if (k in conversationHistory) conversationHistory[k] = v
      })
    }
    Object.keys(memories).forEach(k => memories[k] = [])
    if (state.memories) {
      Object.entries(state.memories).forEach(([k, v]) => {
        if (!(k in memories) || !Array.isArray(v)) return
        memories[k] = v.map((entry, idx) => {
          if (typeof entry === 'string') {
            return {
              id: `mem_${k}_migrated_${idx}`,
              text: entry,
              context: '',
              chapter: state.currentChapter || '',
              timestamp: Date.now() - (v.length - idx) * 60000,
              emotion: 'warm',
              relStageAtTime: '',
              source: 'free_talk',
            }
          }
          return entry
        }).slice(-20)
      })
    }
    Object.keys(visitLog).forEach(k => {
      visitLog[k] = { totalVisits: 0, lastVisitChapter: '', lastVisitTimeSlot: '', lastTopics: [] }
    })
    if (state.visitLog) {
      Object.entries(state.visitLog).forEach(([k, v]) => {
        if (k in visitLog && typeof v === 'object') {
          visitLog[k] = { ...visitLog[k], ...v }
        }
      })
    }
    lastChallengeResult.value = null
    history.length = 0
    if (state.history) history.push(...state.history)
    unlockedCGs.clear()
    if (state.unlockedCGs) state.unlockedCGs.forEach(id => unlockedCGs.add(id))
    unlockedBGM.clear()
    if (state.unlockedBGM) state.unlockedBGM.forEach(id => unlockedBGM.add(id))
    gamePhase.value = state.gamePhase || 'prologue'
    currentRoute.value = state.currentRoute || null
    currentTimeSlot.value = state.currentTimeSlot || 'morning'
    currentBg.value = state.currentBg || 'school_gate_day'
    currentBgVariant.value = state.currentBgVariant || 'day'

    if (state.settings) {
      textSpeed.value = state.settings.textSpeed || 30
      autoPlayDelay.value = state.settings.autoSpeed || 3000
      bgmVolume.value = state.settings.bgmVolume ?? 0.5
      seVolume.value = state.settings.seVolume ?? 0.7
      fontSize.value = state.settings.fontSize || 'medium'
    }

    const script = scriptIndex[state.currentChapter]
    if (script) {
      currentChapter.value = state.currentChapter
      currentScript.value = script
      scriptPointer.value = state.scriptPointer || 0
      if (state.speakerId) speaker.value = characters[state.speakerId] || null
      dialogueText.value = state.dialogueText || ''
      dialogueType.value = state.dialogueType || 'normal'
    } else {
      newGame()
    }
  }

  return {
    speaker, dialogueText, dialogueType, speakerExpression,
    visibleCharacters, currentBg, currentBgVariant, currentBgTransition,
    playerName, affection, relationship, flags, challengeResults,
    conversationHistory, memories, visitLog, lastChallengeResult,
    history, unlockedCGs, unlockedBGM,
    showPanel, isChoosing, choicePrompt, choiceOptions,
    isChallenge, challengeData,
    isLocationSelect, locationOptions,
    isFreeTalk, freeTalkData,
    isTransitioning, transitionType, transitionDuration,
    screenEffect, dialogueBoxEffect, sceneEmotion,
    showTitleCard, titleCardText, titleCardSubtitle,
    showCG, currentCG, showEnding, endingData, affectionToast,
    showSkipSummary, skipSummary, canSkipSection,
    textSpeed, autoPlay, autoPlayDelay, bgmVolume, seVolume, fontSize,
    gamePhase, currentRoute, currentChapter, currentTimeSlot, hasSave,
    newGame, loadChapter, executeNext, advanceText,
    selectChoice, resolveChallenge, selectLocation,
    resolveFreeTalk, dismissCG, skipSection, dismissSkipSummary,
    getState, restoreState, registerAudioCallbacks,
    showAffectionToast, applyRelationshipDelta,
    seenDialogues, skipOnlyRead, isSeen, markSeen, flushSeen
  }
}
