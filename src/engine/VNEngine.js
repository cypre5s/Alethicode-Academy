import { ref, reactive, computed } from 'vue'
import { characters } from '../data/characters.js'
import { locations, resolveBackgroundId, sceneIdFromBackgroundId } from '../data/locations.js'
import { challenges } from '../data/challenges.js'
import { scriptIndex, loadScript, isScriptAvailable, preloadModule } from '../scripts/index.js'
import { getRelationshipStage } from '../data/relationshipRules.js'
import { pickSceneObjective } from '../data/sceneObjectives.js'
import { classifyChallengeOutcome, calculateRelationshipDelta } from '../data/learningDomains.js'
import { getPostChallengeEvent } from '../data/postChallengeEvents.js'
import { preloadForScript } from './AssetPreloader.js'
import { usePersistentMemory } from './PersistentMemoryManager.js'
import { useBehaviorProfiler } from './BehaviorProfiler.js'
import { useNarrativeWeaver } from './NarrativeWeaver.js'
import { useCharacterAutonomy } from './CharacterAutonomyEngine.js'
import { useAffectiveResonance } from './AffectiveResonanceEngine.js'
import { useDynamicCGGenerator } from './DynamicCGGenerator.js'
import { useSpacedRepetition } from './SpacedRepetitionScheduler.js'
import { useWorldVM } from './WorldVM.js'
import { useCognitiveGraph } from './CognitiveGraph.js'
import { useTemporalCodeDB } from './TemporalCodeDB.js'
import { useSymbioticCodeDNA } from './SymbioticCodeDNA.js'
import { useRealityBridge } from './RealityBridge.js'
import { usePedagogyKernel } from './PedagogyKernel.js'
import { useNarrativeCodeBridge } from './NarrativeCodeBridge.js'
import { evaluateMetaUnlocks } from '../data/metaNarrativeManifest.js'
import { triggerHaptic, setMoodTheme, mapCommandToHaptic } from './ExperienceEnhancer.js'

export function useVNEngine() {
  const _pendingTimers = new Set()
  function _safeTimeout(fn, ms) {
    const id = setTimeout(() => { _pendingTimers.delete(id); fn() }, ms)
    _pendingTimers.add(id)
    return id
  }
  function _clearAllTimers() {
    _pendingTimers.forEach(id => clearTimeout(id))
    _pendingTimers.clear()
  }

  const persistentMemory = usePersistentMemory()
  const behaviorProfiler = useBehaviorProfiler()
  const narrativeWeaver = useNarrativeWeaver()
  const characterAutonomy = useCharacterAutonomy()
  const affectiveResonance = useAffectiveResonance()
  const dynamicCG = useDynamicCGGenerator()
  const spacedRepetition = useSpacedRepetition()

  const worldVM = useWorldVM()
  const cognitiveGraph = useCognitiveGraph()
  const temporalCodeDB = useTemporalCodeDB()
  const symbioticCodeDNA = useSymbioticCodeDNA()
  const realityBridge = useRealityBridge()
  const pedagogyKernel = usePedagogyKernel()
  const narrativeCodeBridge = useNarrativeCodeBridge()

  persistentMemory.initialize()
  cognitiveGraph.initialize()
  symbioticCodeDNA.initialize()
  temporalCodeDB.initialize()
  realityBridge.initialize()
  pedagogyKernel.initialize({
    cognitiveGraph,
    affectiveResonance,
    spacedRepetition,
    behaviorProfiler,
  })

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
  const freeTalkSummaries = reactive({ nene: [], yoshino: [], ayase: [], kanna: [], murasame: [] })
  const memories = reactive({ nene: [], yoshino: [], ayase: [], kanna: [], murasame: [] })
  const visitLog = reactive({
    nene: { totalVisits: 0, lastVisitChapter: '', lastVisitTimeSlot: '', lastTopics: [] },
    yoshino: { totalVisits: 0, lastVisitChapter: '', lastVisitTimeSlot: '', lastTopics: [] },
    ayase: { totalVisits: 0, lastVisitChapter: '', lastVisitTimeSlot: '', lastTopics: [] },
    kanna: { totalVisits: 0, lastVisitChapter: '', lastVisitTimeSlot: '', lastTopics: [] },
    murasame: { totalVisits: 0, lastVisitChapter: '', lastVisitTimeSlot: '', lastTopics: [] },
  })
  const lastChallengeResult = ref(null)
  const relationshipChangeLog = reactive([])
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
    _clearAllTimers()
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
    Object.keys(freeTalkSummaries).forEach(k => freeTalkSummaries[k] = [])
    Object.keys(memories).forEach(k => memories[k] = [])
    Object.keys(visitLog).forEach(k => {
      visitLog[k] = { totalVisits: 0, lastVisitChapter: '', lastVisitTimeSlot: '', lastTopics: [] }
    })
    lastChallengeResult.value = null
    relationshipChangeLog.length = 0
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

    persistentMemory.detectSaveDeletion()
    persistentMemory.onNewGame(name)
    const dejaVuFlags = persistentMemory.getDejaVuFlags()
    Object.entries(dejaVuFlags).forEach(([k, v]) => { flags[`deja_${k}`] = v })

    const metaUnlocks = evaluateMetaUnlocks(
      persistentMemory.soul,
      flags,
      narrativeCodeBridge.codeStoryArc
    )
    for (const meta of metaUnlocks) {
      flags[`meta_${meta.id}`] = true
    }

    behaviorProfiler.onSessionStart()
    characterAutonomy.onSessionStart()
    affectiveResonance.enable()

    worldVM.initialize(name).then(() => {
      worldVM.syncPlayerName(name || '')
    })

    spacedRepetition.setChapterRef(currentChapter)
    loadChapter('prologue')
  }

  const _isLoadingChapter = ref(false)

  async function loadChapter(chapterId) {
    _clearAllTimers()
    _isLoadingChapter.value = true
    Object.keys(visibleCharacters).forEach(k => delete visibleCharacters[k])
    let script = scriptIndex[chapterId]
    if (!script) {
      try {
        script = await loadScript(chapterId)
      } catch (err) {
        console.error(`[loadChapter] failed to load "${chapterId}":`, err)
      }
    }
    if (!script) {
      console.error(`[loadChapter] script "${chapterId}" is null, attempting fallback`)
      _isLoadingChapter.value = false
      _handleLoadFailure(chapterId)
      return
    }
    currentChapter.value = chapterId
    currentScript.value = script
    scriptPointer.value = 0
    _isLoadingChapter.value = false
    preloadForScript(script, 0)

    if (chapterId === 'chapter3' || chapterId === 'ch3_festival') {
      _preloadRouteModules()
    }

    executeNext()
  }

  function _handleLoadFailure(chapterId) {
    speaker.value = null
    dialogueText.value = `[加载失败] 章节 "${chapterId}" 无法加载。请刷新页面重试。`
    dialogueType.value = 'narration'
  }

  function jumpToLabel(label) {
    const idx = currentScript.value.findIndex(cmd => cmd.label === label)
    if (idx >= 0) {
      scriptPointer.value = idx
      executeNext()
    }
  }

  function executeNext() {
    if (_isLoadingChapter.value) return

    if (scriptPointer.value >= currentScript.value.length) {
      onChapterEnd()
      return
    }

    characterAutonomy.autonomyTick(
      { relationship, flags, challengeResults },
      behaviorProfiler.getProfileSnapshot()
    )

    const cmd = currentScript.value[scriptPointer.value]
    scriptPointer.value++
    preloadForScript(currentScript.value, scriptPointer.value)
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

      case 'weave_zone': handleWeaveZone(cmd); break
      case 'deja_vu': handleDejaVu(cmd); break
      case 'dynamic_cg': handleDynamicCG(cmd); break

      case 'world_challenge': handleWorldChallenge(cmd); break
      case 'world_unlock': handleWorldUnlock(cmd); break
      case 'cognitive_trigger': handleCognitiveTrigger(cmd); break
      case 'reality_mission': handleRealityMission(cmd); break
      case 'reality_letter': handleRealityLetter(cmd); break
      case 'pedagogy_challenge': handlePedagogyChallenge(cmd); break

      case 'code_narrative': handleCodeNarrative(cmd); break
      case 'code_branch': handleCodeBranch(cmd); break

      case 'live2d_motion': handleLive2DMotion(cmd); break
      case 'live2d_expression': handleLive2DExpression(cmd); break
      case 'live2d_gaze': handleLive2DGaze(cmd); break
      case 'live2d_sequence': handleLive2DSequence(cmd); break
      case 'live2d_param': handleLive2DParam(cmd); break
      case 'live2d_teaching': handleLive2DTeaching(cmd); break

      default: executeNext()
    }
  }

  function handleSilenceBeat(cmd) {
    const duration = Math.min(cmd.duration || 400, 5000)
    const mode = cmd.mode || 'blank'

    if (mode === 'blackout') {
      screenEffect.value = { type: 'fade-to-black' }
      _safeTimeout(() => {
        screenEffect.value = null
        executeNext()
      }, duration)
    } else if (mode === 'nameplate_first') {
      const charId = cmd.character
      const char = characters[charId]
      speaker.value = char || null
      dialogueText.value = ''
      dialogueType.value = 'normal'
      _safeTimeout(() => {
        executeNext()
      }, duration || 600)
    } else {
      _safeTimeout(() => executeNext(), duration)
    }
  }

  function handleCharAction(cmd) {
    const charId = cmd.character
    if (visibleCharacters[charId]) {
      visibleCharacters[charId].microAction = cmd.action || null
      const holdDuration = cmd.hold || 1200
      _safeTimeout(() => {
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
    behaviorProfiler.onDialogueShow()

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
        _safeTimeout(() => {
          if (visibleCharacters[charId]?.microAction === cmd.microAction) {
            visibleCharacters[charId].microAction = null
          }
        }, 1200)
      }
    }

    if (_live2dManagerRef && char && charId !== 'narrator') {
      _live2dManagerRef.startSpeaking(charId, cmd.text)
      if (cmd.expression) _live2dManagerRef.setExpression(charId, cmd.expression)
      if (cmd.live2d_hints) _live2dManagerRef.applyLLMHints(charId, cmd.live2d_hints)
    }

    if (char && charId !== 'narrator') {
      persistentMemory.recordLastWords(charId, cmd.text)
      const rel = relationship[charId]
      if (rel) {
        const avg = Math.round((rel.affection + rel.trust + rel.comfort) / 3)
        persistentMemory.updateAffectionHighWater(charId, avg)
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

    behaviorProfiler.onChoiceSelect(index, option._optionType || 'safe')

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
      if (isScriptAvailable(option.next)) {
        loadChapter(option.next)
      } else {
        jumpToLabel(option.next)
      }
    } else {
      executeNext()
    }
  }

  async function handleCondition(cmd) {
    const result = evaluateConditionExpr(cmd.check || cmd.condition)
    if (result) {
      if (cmd.true_branch) {
        if (isScriptAvailable(cmd.true_branch)) await loadChapter(cmd.true_branch)
        else jumpToLabel(cmd.true_branch)
      } else {
        executeNext()
      }
    } else {
      if (cmd.false_branch) {
        if (isScriptAvailable(cmd.false_branch)) await loadChapter(cmd.false_branch)
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

  function _extractLocation(bgId) {
    return String(bgId || '').replace(/_(day|evening|night)$/, '')
  }

  function handleBg(cmd) {
    const bgSrc = cmd.src || cmd.location || cmd.id
    const transition = cmd.transition || 'fade'
    const duration = cmd.duration || 800

    const oldLoc = _extractLocation(currentBg.value)
    const newLoc = _extractLocation(bgSrc)
    if (oldLoc !== newLoc && newLoc !== 'black' && oldLoc !== 'black') {
      Object.keys(visibleCharacters).forEach(k => delete visibleCharacters[k])
    }

    isTransitioning.value = true
    transitionType.value = transition
    transitionDuration.value = duration

    _safeTimeout(() => {
      currentBg.value = bgSrc
      if (cmd.variant) currentBgVariant.value = cmd.variant
      _safeTimeout(() => { isTransitioning.value = false }, duration / 2)
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
    _safeTimeout(() => {
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
      _safeTimeout(() => {
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
    _safeTimeout(() => executeNext(), dur)
  }

  function handleHideAll() {
    Object.keys(visibleCharacters).forEach(k => delete visibleCharacters[k])
    executeNext()
  }

  function handleBgm(cmd) {
    const bgmId = cmd.src || cmd.id
    unlockedBGM.add(bgmId)
    audioCallbacks.playBgm?.(bgmId, cmd.fadeIn || cmd.crossfade || 1500)
    setMoodTheme(bgmId)
    executeNext()
  }

  function handleBgmStop(cmd) {
    audioCallbacks.stopBgm?.(cmd.fadeOut || 1000)
    executeNext()
  }

  function handleSe(cmd) {
    const seId = cmd.src || cmd.id
    audioCallbacks.playSfx?.(seId)
    const haptic = mapCommandToHaptic(`se_${seId}`)
    if (haptic) triggerHaptic(haptic)
    executeNext()
  }

  function handleScreenEffect(cmd) {
    screenEffect.value = {
      effect: cmd.effect,
      duration: cmd.duration || 500
    }
    const haptic = mapCommandToHaptic(`screen_effect_${cmd.effect}`)
    if (haptic) triggerHaptic(haptic)
    _safeTimeout(() => {
      screenEffect.value = null
    }, cmd.duration || 500)
    executeNext()
  }

  function handleWait(cmd) {
    const ms = cmd.duration || cmd.ms || 1000
    _safeTimeout(() => executeNext(), ms)
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

  function resolveLLMChallenge(challengeId, llmResult) {
    const data = challengeData.value
    if (!data) { executeNext(); return }

    const id = data.id || challengeId
    const outcome = llmResult.outcome || (llmResult.success ? 'solo_pass' : 'thoughtful_fail')
    const domain = data.knowledge_domain || challenges[id]?.knowledge_domain || null
    const relatedChar = data.related_character || challenges[id]?.related_character || null

    challengeResults[id] = {
      passed: llmResult.success,
      timestamp: Date.now(),
      challengeId: id,
      title: data.title || '',
      outcome,
      hintsUsed: 0,
      knowledge_domain: domain,
    }
    lastChallengeResult.value = challengeResults[id]

    if (domain) spacedRepetition.recordOutcome(id, domain, outcome)

    const llmMappedConcepts = cognitiveGraph.mapChallengeToConcepts(id, domain)
    for (const conceptId of llmMappedConcepts) {
      cognitiveGraph.recordOutcome(conceptId, outcome, { contextType: `${data.type}_${id}` })
    }
    _detectTransfer(llmMappedConcepts, id)
    if (data.type === 'teach_back' && llmResult.clarity !== undefined) {
      for (const conceptId of llmMappedConcepts) {
        const avgQuality = ((llmResult.clarity || 3) + (llmResult.accuracy || 3) + (llmResult.empathy || 3)) / 3
        cognitiveGraph.recordTeachBack(conceptId, avgQuality)
      }
    }

    if (relatedChar && relationship[relatedChar]) {
      symbioticCodeDNA.recordInteraction(relatedChar)
      const delta = llmResult.relationshipDelta || calculateRelationshipDelta(outcome, relatedChar, domain)
      _lastChangeTrigger = `${data.type}:${id} outcome:${outcome}`
      applyRelationshipDelta(relatedChar, delta, data.type)
      const aggregate = Math.round((delta.affection + delta.trust + delta.comfort) / 3) || (delta.affection + delta.trust + delta.comfort > 0 ? 1 : delta.affection + delta.trust + delta.comfort < 0 ? -1 : 0)
      if (aggregate !== 0) {
        const char = characters[relatedChar]
        if (char) {
          affectionToast.value = { character: relatedChar, name: char.nameShort || char.name, change: aggregate, color: char.color }
          _safeTimeout(() => { affectionToast.value = null }, 2000)
        }
      }
    }

    if (relatedChar && memories[relatedChar]) {
      const memText = llmResult.memoryText || `完成了「${data.title || id}」（${data.type}）`
      const emotionMap = { excellent_teach: 'warm', accurate_teach: 'warm', warm_but_wrong: 'bittersweet', poor_teach: 'tense', solo_pass: 'warm', assisted_pass: 'warm', thoughtful_fail: 'bittersweet', careless_fail: 'tense' }
      memories[relatedChar].push({
        id: `learn_${id}_${Date.now()}`,
        text: memText,
        context: data.type,
        chapter: currentChapter.value,
        timestamp: Date.now(),
        emotion: emotionMap[outcome] || 'warm',
        relStageAtTime: getRelationshipStage(relationship[relatedChar]),
        source: data.type,
        challenge_id: id,
        knowledge_domain: domain,
        outcome,
      })
      if (memories[relatedChar].length > 30) memories[relatedChar] = memories[relatedChar].slice(-30)
    }

    isChallenge.value = false
    challengeData.value = null
    executeNext()
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

    if (domain) spacedRepetition.recordOutcome(id, domain, outcome)

    const mappedConcepts = cognitiveGraph.mapChallengeToConcepts(id, domain)
    for (const conceptId of mappedConcepts) {
      cognitiveGraph.recordOutcome(conceptId, outcome, { contextType: `challenge_${id}` })
    }
    _detectTransfer(mappedConcepts, id)

    if (relatedChar && relationship[relatedChar]) {
      symbioticCodeDNA.recordInteraction(relatedChar)
      const delta = calculateRelationshipDelta(outcome, relatedChar, domain)
      _lastChangeTrigger = `challenge:${id} outcome:${outcome}`
      applyRelationshipDelta(relatedChar, delta, 'challenge')
      const aggregate = Math.round((delta.affection + delta.trust + delta.comfort) / 3) || (delta.affection + delta.trust + delta.comfort > 0 ? 1 : delta.affection + delta.trust + delta.comfort < 0 ? -1 : 0)
      if (aggregate !== 0) {
        const char = characters[relatedChar]
        if (char) {
          affectionToast.value = { character: relatedChar, name: char.nameShort || char.name, change: aggregate, color: char.color }
          _safeTimeout(() => { affectionToast.value = null }, 2000)
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
      if (isScriptAvailable(loc.next)) loadChapter(loc.next)
      else jumpToLabel(loc.next)
    } else {
      currentBg.value = resolveBackgroundId(locId, currentTimeSlot.value)
      executeNext()
    }
  }

  function handleFreeTalk(cmd) {
    const mode = cmd.mode || 'free'

    if (mode === 'scripted') {
      if (cmd.dialogue && cmd.dialogue.length > 0) {
        currentScript.value = [
          ...currentScript.value.slice(0, scriptPointer.value),
          ...cmd.dialogue,
          ...currentScript.value.slice(scriptPointer.value)
        ]
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
      promptId: cmd.promptId || null,
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

    const charId = freeTalkData.value?.character
    if (charId) {
      symbioticCodeDNA.recordInteraction(charId)
      if (worldVM.isReady.value) {
        worldVM.syncCharacterState(charId, relationship)
      }
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

  async function handleRouteDecision(cmd) {
    const charIds = Object.keys(relationship)
    const allMet = charIds.every(k => _relAvg(k) >= 30)
    const murasameOk = _relAvg('murasame') >= 50 && allMet && flags.murasame_gate_passed

    let target
    if (murasameOk) {
      target = 'murasame'
    } else {
      const sorted = charIds
        .filter(k => k !== 'murasame')
        .map(k => [k, _relAvg(k)])
        .sort((a, b) => b[1] - a[1])
      target = sorted[0][1] >= 20 ? sorted[0][0] : 'nene'
    }

    currentRoute.value = target
    await loadChapter(`route_${target}`)
  }

  function handleCG(cmd) {
    const cgId = cmd.id
    const preBeat = cmd.preBeat !== false ? 400 : 0

    unlockedCGs.add(cgId)

    if (preBeat > 0) {
      screenEffect.value = { type: 'fade-to-black' }
      _safeTimeout(() => {
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

    if ((cmd.text || '').includes('文化祭') || currentChapter.value === 'ch3_festival') {
      _preloadRouteModules()
    }

    _safeTimeout(() => {
      showTitleCard.value = false
      titleCardText.value = ''
      titleCardSubtitle.value = ''
      executeNext()
    }, 3000)
  }

  function _preloadRouteModules() {
    const modules = ['route_nene', 'route_yoshino', 'route_ayase', 'route_kanna', 'route_murasame']
    for (const mod of modules) {
      preloadModule(mod).catch(() => {})
    }
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

    const route = cmd.route || currentRoute.value
    if (route) {
      persistentMemory.recordEnding(route, cmd.endingType || cmd.type || 'normal')
    }
  }

  async function handleWeaveZone(cmd) {
    const gameState = {
      relationship: JSON.parse(JSON.stringify(relationship)),
      currentBg: currentBg.value,
      currentTimeSlot: currentTimeSlot.value,
      playerName: playerName.value,
    }

    const profileCard = behaviorProfiler.buildPlayerInsightCard()
    const memoryCard = persistentMemory.buildMemoryPromptCard()

    const _llmRef = _getLLMManagerRef()
    const commands = await narrativeWeaver.generateSegment(cmd, gameState, _llmRef, profileCard, memoryCard)

    if (commands && commands.length > 0) {
      currentScript.value = [
        ...currentScript.value.slice(0, scriptPointer.value),
        ...commands,
        ...currentScript.value.slice(scriptPointer.value),
      ]
    }
    executeNext()
  }

  function handleDejaVu(cmd) {
    const dejaFlags = persistentMemory.getDejaVuFlags()
    const conditionMet = cmd.check ? dejaFlags[cmd.check] : dejaFlags.is_replay

    if (conditionMet && cmd.true_branch) {
      if (isScriptAvailable(cmd.true_branch)) loadChapter(cmd.true_branch)
      else jumpToLabel(cmd.true_branch)
    } else if (!conditionMet && cmd.false_branch) {
      if (isScriptAvailable(cmd.false_branch)) loadChapter(cmd.false_branch)
      else jumpToLabel(cmd.false_branch)
    } else {
      executeNext()
    }
  }

  async function handleDynamicCG(cmd) {
    const params = {
      sceneType: cmd.template || cmd.sceneType || 'casual_hangout',
      characters: cmd.characters || [],
      mood: cmd.mood || 'warm_quiet',
      expression: cmd.expression || null,
      uniqueContext: cmd.context || '',
    }

    const _llmRef = _getLLMManagerRef()
    const result = await dynamicCG.generateCG(params, _llmRef)

    if (result?.type === 'generated_image' && result.imageUrl) {
      showCG.value = true
      currentCG.value = { id: result.id, dynamicUrl: result.imageUrl, isDynamic: true }
    } else if (result?.type === 'text_description' && result.textDescription) {
      speaker.value = null
      dialogueText.value = `✦ ${result.textDescription}`
      dialogueType.value = 'narration'
      history.push({ type: 'narration', text: result.textDescription })
    } else {
      executeNext()
    }
  }

  const _conceptChallengeHistory = {}

  function _detectTransfer(conceptIds, challengeId) {
    for (const conceptId of conceptIds) {
      if (!_conceptChallengeHistory[conceptId]) {
        _conceptChallengeHistory[conceptId] = new Set()
      }
      const prevChallenges = _conceptChallengeHistory[conceptId]
      if (prevChallenges.size > 0) {
        for (const prevId of prevChallenges) {
          if (prevId !== challengeId) {
            cognitiveGraph.recordTransfer(conceptId, conceptId)
            break
          }
        }
      }
      prevChallenges.add(challengeId)
    }
  }

  function resolveWorldChallenge(success, code, executionResult) {
    const data = challengeData.value
    if (!data) { executeNext(); return }

    const id = data.id || `world_${Date.now()}`
    const outcome = success ? 'solo_pass' : 'thoughtful_fail'

    challengeResults[id] = {
      passed: success, timestamp: Date.now(), challengeId: id,
      title: data.title || '', outcome, hintsUsed: 0,
    }
    lastChallengeResult.value = challengeResults[id]

    if (code && temporalCodeDB) {
      temporalCodeDB.recordCode(code, {
        chapter: currentChapter.value,
        challenge: id,
        challengeType: 'world_challenge',
        location: currentBg.value,
      }, {
        success,
        output: executionResult?.stdout || '',
      })
    }
    if (code && symbioticCodeDNA) {
      symbioticCodeDNA.analyzePlayerCode(code)
    }

    isChallenge.value = false
    challengeData.value = null
    executeNext()
  }

  function handleWorldChallenge(cmd) {
    isChallenge.value = true
    challengeData.value = {
      ...cmd,
      isWorldChallenge: true,
      title: cmd.title || 'World Challenge',
      description: cmd.description || '',
      tier: cmd.tier ?? worldVM.worldState.unlockedTier,
      expectedOutcome: cmd.expectedOutcome || null,
      hints: cmd.hints || [],
    }
  }

  function handleWorldUnlock(cmd) {
    const tier = cmd.tier ?? (worldVM.worldState.unlockedTier + 1)
    worldVM.unlockTier(tier)
    if (cmd.announcement) {
      speaker.value = null
      dialogueText.value = cmd.announcement
      dialogueType.value = 'narration'
      history.push({ type: 'narration', text: cmd.announcement })
    } else {
      executeNext()
    }
  }

  function handleCognitiveTrigger(cmd) {
    const concept = cmd.concept
    const state = cognitiveGraph.getConceptState(concept)

    if (cmd.condition) {
      const conditionMet = cmd.condition === state ||
        (cmd.condition === 'lit_or_blazing' && (state === 'lit' || state === 'blazing')) ||
        (cmd.condition === 'not_dark' && state !== 'dark')

      if (conditionMet && cmd.true_branch) {
        if (isScriptAvailable(cmd.true_branch)) loadChapter(cmd.true_branch)
        else jumpToLabel(cmd.true_branch)
        return
      } else if (!conditionMet && cmd.false_branch) {
        if (isScriptAvailable(cmd.false_branch)) loadChapter(cmd.false_branch)
        else jumpToLabel(cmd.false_branch)
        return
      }
    }
    executeNext()
  }

  async function handleRealityMission(cmd) {
    const mission = await realityBridge.createMission({
      id: cmd.id || `mission_${Date.now()}`,
      title: cmd.title || 'Mission',
      description: cmd.description || '',
      character: cmd.character || '',
      chapter: currentChapter.value,
      difficulty: cmd.difficulty || 'normal',
      skeleton: cmd.skeleton || '',
      testCode: cmd.testCode || null,
    })

    if (mission && cmd.dialogue) {
      speaker.value = characters[cmd.character] || null
      dialogueText.value = cmd.dialogue.replace(/{playerName}/g, playerName.value)
      dialogueType.value = 'normal'
      history.push({ type: 'dialogue', speaker: characters[cmd.character]?.name || '', text: cmd.dialogue, speakerColor: characters[cmd.character]?.color || '#aaa' })
    } else {
      executeNext()
    }
  }

  async function handleRealityLetter(cmd) {
    await realityBridge.createLetter({
      type: cmd.letterType || 'encouragement',
      characterName: characters[cmd.character]?.name || cmd.character || 'Someone',
      playerName: playerName.value,
      content: cmd.content || '',
      milestones: cmd.milestones || temporalCodeDB.getMilestonesList().map(m => m.label),
    })
    executeNext()
  }

  async function handlePedagogyChallenge(cmd) {
    const gameContext = {
      chapter: currentChapter.value,
      location: currentBg.value,
      character: cmd.character || null,
      timeSlot: currentTimeSlot.value,
    }

    const recommendation = pedagogyKernel.decideWhatToTeach(gameContext)
    if (!recommendation) { executeNext(); return }

    const _llmRef = _getLLMManagerRef()
    if (_llmRef) {
      pedagogyKernel.initialize({
        cognitiveGraph,
        affectiveResonance,
        spacedRepetition,
        llmManager: _llmRef,
        behaviorProfiler,
      })
    }

    const gameState = { currentChapter: currentChapter.value, currentBg: currentBg.value }
    const challenge = await pedagogyKernel.generateDynamicChallenge(recommendation, gameState)

    if (challenge) {
      isChallenge.value = true
      challengeData.value = {
        ...challenge,
        isDynamic: true,
        contextDialogue: cmd.context_dialogue || null,
        rewards: cmd.rewards || {},
      }
    } else {
      executeNext()
    }
  }

  function handleCodeNarrative(cmd) {
    isChallenge.value = true
    challengeData.value = {
      ...cmd,
      isCodeNarrative: true,
      title: cmd.title || '编写代码',
      description: cmd.description || '',
      narrativeTriggers: cmd.triggers || [],
      branches: cmd.branches || {},
    }
  }

  function handleCodeBranch(cmd) {
    const met = narrativeCodeBridge.shouldTriggerBranch(cmd.conditions || {})
    if (met && cmd.true_branch) {
      if (isScriptAvailable(cmd.true_branch)) loadChapter(cmd.true_branch)
      else jumpToLabel(cmd.true_branch)
    } else if (!met && cmd.false_branch) {
      if (isScriptAvailable(cmd.false_branch)) loadChapter(cmd.false_branch)
      else jumpToLabel(cmd.false_branch)
    } else {
      executeNext()
    }
  }

  function resolveCodeNarrative(code, result) {
    const evaluation = narrativeCodeBridge.evaluateCode(code, result, {
      chapter: currentChapter.value,
      character: challengeData.value?.related_character || null,
    })

    if (code && temporalCodeDB) {
      temporalCodeDB.recordCode(code, {
        chapter: currentChapter.value,
        challenge: challengeData.value?.id || 'narrative',
        challengeType: 'code_narrative',
      }, result)
    }

    if (code && symbioticCodeDNA) {
      symbioticCodeDNA.analyzePlayerCode(code)
    }

    const pending = narrativeCodeBridge.consumePendingEvents()
    if (pending.length > 0) {
      const allDialogues = pending.flatMap(e => e.dialogues.map(d => ({ type: 'dialogue', ...d })))
      if (allDialogues.length > 0) {
        currentScript.value = [
          ...currentScript.value.slice(0, scriptPointer.value),
          ...allDialogues,
          ...currentScript.value.slice(scriptPointer.value),
        ]
      }
    }

    isChallenge.value = false
    challengeData.value = null
    executeNext()
    return evaluation
  }

  let _llmManagerRef = null
  function registerLLMManager(llm) {
    _llmManagerRef = llm
    narrativeCodeBridge.bridge({ speaker, flags, relationship, memories, currentChapter, screenEffect, applyRelationshipDelta }, worldVM, llm)
  }
  function _getLLMManagerRef() { return _llmManagerRef }

  let _live2dManagerRef = null
  function registerLive2DManager(l2d) { _live2dManagerRef = l2d }

  // ─── Live2D Instruction Handlers ────────────────────────────────
  function handleLive2DMotion(cmd) {
    if (_live2dManagerRef) {
      _live2dManagerRef.playMotion(cmd.character, cmd.motion, cmd.index || 0, cmd.priority || 2)
    }
    executeNext()
  }

  function handleLive2DExpression(cmd) {
    if (_live2dManagerRef) {
      _live2dManagerRef.setExpression(cmd.character, cmd.expression, cmd.blend ? cmd.blend * 1000 : 800)
    }
    executeNext()
  }

  function handleLive2DGaze(cmd) {
    if (_live2dManagerRef) {
      _live2dManagerRef._gazeController?.setTarget(cmd.character, cmd.target, cmd.duration || 2000)
    }
    executeNext()
  }

  function handleLive2DSequence(cmd) {
    if (_live2dManagerRef) {
      _live2dManagerRef.playSequence(cmd.character, cmd.sequence || [])
    }
    const totalDuration = (cmd.sequence || []).reduce((s, step) => s + (step.duration || 500), 0)
    if (cmd.wait !== false && totalDuration > 0) {
      _safeTimeout(() => executeNext(), totalDuration)
    } else {
      executeNext()
    }
  }

  function handleLive2DParam(cmd) {
    if (_live2dManagerRef) {
      _live2dManagerRef.setParam(cmd.character, cmd.param, cmd.value, cmd.duration || 300)
    }
    executeNext()
  }

  function handleLive2DTeaching(cmd) {
    if (_live2dManagerRef) {
      _live2dManagerRef.setTeachingState(cmd.character, cmd.state || 'explaining')
    }
    executeNext()
  }

  function applyRelationshipDelta(charId, deltas, source) {
    if (!relationship[charId]) return
    const delta = { affection: 0, trust: 0, comfort: 0 }
    if (typeof deltas === 'number') {
      delta.affection = deltas; delta.trust = deltas; delta.comfort = deltas
      relationship[charId].affection = Math.min(Math.max(relationship[charId].affection + deltas, 0), 100)
      relationship[charId].trust = Math.min(Math.max(relationship[charId].trust + deltas, 0), 100)
      relationship[charId].comfort = Math.min(Math.max(relationship[charId].comfort + deltas, 0), 100)
    } else {
      if (deltas.affection) { delta.affection = deltas.affection; relationship[charId].affection = Math.min(Math.max(relationship[charId].affection + deltas.affection, 0), 100) }
      if (deltas.trust) { delta.trust = deltas.trust; relationship[charId].trust = Math.min(Math.max(relationship[charId].trust + deltas.trust, 0), 100) }
      if (deltas.comfort) { delta.comfort = deltas.comfort; relationship[charId].comfort = Math.min(Math.max(relationship[charId].comfort + deltas.comfort, 0), 100) }
    }
    if (delta.affection || delta.trust || delta.comfort) {
      relationshipChangeLog.push({
        timestamp: Date.now(),
        character: charId,
        delta,
        source: source || 'unknown',
        chapter: currentChapter.value,
        trigger: _lastChangeTrigger || '',
      })
      if (relationshipChangeLog.length > 200) relationshipChangeLog.splice(0, relationshipChangeLog.length - 200)
    }
  }

  let _lastChangeTrigger = ''
  function setChangeTrigger(trigger) { _lastChangeTrigger = trigger }

  function showAffectionToast(charId, change, skipAdd = false, source) {
    if (change === 0) return
    const char = characters[charId]
    if (!char) return
    if (!skipAdd) {
      applyRelationshipDelta(charId, change, source || 'choice')
    }
    affectionToast.value = { character: charId, name: char.nameShort || char.name, change, color: char.color }
    _safeTimeout(() => { affectionToast.value = null }, 2000)
  }

  function onChapterEnd() {
    const nextMap = {
      prologue: 'chapter1',
      chapter1: 'chapter2',
      chapter2: 'chapter3',
      chapter3: 'chapter4',
      chapter4: 'chapter5',
      chapter5: null
    }
    const ch = currentChapter.value
    let next = nextMap[ch]
    if (next === undefined) {
      if (ch.startsWith('ch1_')) next = 'chapter2'
      else if (ch.startsWith('ch2_')) next = 'chapter3'
      else if (ch.startsWith('ch3_')) next = 'chapter4'
      else if (ch.startsWith('ch4_')) next = 'chapter5'
      else if (ch.startsWith('ch5_')) next = nextMap.chapter5
      else if (ch.startsWith('route_') || ch.endsWith('_path')) {
        if (!showEnding.value) {
          showEnding.value = true
          endingData.value = {
            endingType: 'normal',
            route: currentRoute.value || ch.replace('route_', ''),
            title: '完',
            text: '故事到此告一段落。'
          }
        }
        return
      }
    }
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
        case 'bg': {
          const skipBgSrc = cmd.src || cmd.location || cmd.id
          const skipOldLoc = _extractLocation(currentBg.value)
          const skipNewLoc = _extractLocation(skipBgSrc)
          if (skipOldLoc !== skipNewLoc && skipNewLoc !== 'black' && skipOldLoc !== 'black') {
            Object.keys(visibleCharacters).forEach(k => delete visibleCharacters[k])
          }
          currentBg.value = skipBgSrc
          if (cmd.variant) currentBgVariant.value = cmd.variant
          break
        }
        case 'char_enter':
        case 'show':
          visibleCharacters[cmd.character] = {
            id: cmd.character,
            expression: cmd.expression || 'normal',
            position: cmd.position || 'center',
            animation: null,
            entering: false
          }
          break
        case 'char_exit':
        case 'hide':
          delete visibleCharacters[cmd.character]
          break
        case 'hideAll':
          Object.keys(visibleCharacters).forEach(k => delete visibleCharacters[k])
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
    if (_isLoadingChapter.value) return
    if (isChoosing.value || isChallenge.value || isLocationSelect.value || isFreeTalk.value) return
    if (showSkipSummary.value) return
    if (showCG.value) { dismissCG(); return }
    if (showEnding.value) return
    behaviorProfiler.onDialogueAdvance()
    affectiveResonance.onPlayerActivity('click_slow')
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
      freeTalkSummaries: Object.fromEntries(
        Object.entries(freeTalkSummaries).map(([k, v]) => [k, v.slice(-8)])
      ),
      memories: JSON.parse(JSON.stringify(memories)),
      visitLog: JSON.parse(JSON.stringify(visitLog)),
      relationshipChangeLog: relationshipChangeLog.slice(-100),
      srsData: spacedRepetition.getState(),
      worldVMData: worldVM.getState(),
      cognitiveGraphData: cognitiveGraph.getState(),
      symbioticDNAData: symbioticCodeDNA.getState(),
      realityBridgeData: realityBridge.getState(),
      pedagogyData: pedagogyKernel.getState(),
      settings: {
        textSpeed: textSpeed.value,
        autoSpeed: autoPlayDelay.value,
        bgmVolume: bgmVolume.value,
        seVolume: seVolume.value,
        fontSize: fontSize.value,
      },
      live2dState: _live2dManagerRef?.getState?.()?.live2dState || null,
    }
  }

  async function restoreState(state) {
    _clearAllTimers()
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
    Object.keys(freeTalkSummaries).forEach(k => freeTalkSummaries[k] = [])
    if (state.freeTalkSummaries) {
      Object.entries(state.freeTalkSummaries).forEach(([k, v]) => {
        if (k in freeTalkSummaries && Array.isArray(v)) freeTalkSummaries[k] = v
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
    relationshipChangeLog.length = 0
    if (state.relationshipChangeLog) relationshipChangeLog.push(...state.relationshipChangeLog)
    if (state.srsData) spacedRepetition.restoreState(state.srsData)
    if (state.worldVMData) worldVM.restoreState(state.worldVMData)
    if (state.cognitiveGraphData) cognitiveGraph.restoreState(state.cognitiveGraphData)
    if (state.symbioticDNAData) symbioticCodeDNA.restoreState(state.symbioticDNAData)
    if (state.realityBridgeData) realityBridge.restoreState(state.realityBridgeData)
    if (state.pedagogyData) pedagogyKernel.restoreState(state.pedagogyData)
    if (state.live2dState && _live2dManagerRef) _live2dManagerRef.restoreState({ live2dState: state.live2dState })
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

    let script = scriptIndex[state.currentChapter]
    if (!script) {
      script = await loadScript(state.currentChapter)
    }
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
    conversationHistory, freeTalkSummaries, memories, visitLog, lastChallengeResult,
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
    selectChoice, resolveChallenge, resolveLLMChallenge, resolveWorldChallenge, resolveCodeNarrative, selectLocation,
    resolveFreeTalk, dismissCG, skipSection, dismissSkipSummary,
    getState, restoreState, registerAudioCallbacks,
    showAffectionToast, applyRelationshipDelta, setChangeTrigger,
    relationshipChangeLog,
    seenDialogues, skipOnlyRead, isSeen, markSeen, flushSeen,
    scriptPointer,

    persistentMemory,
    behaviorProfiler,
    narrativeWeaver,
    characterAutonomy,
    affectiveResonance,
    dynamicCG,
    spacedRepetition,
    registerLLMManager,
    registerLive2DManager,

    worldVM,
    cognitiveGraph,
    temporalCodeDB,
    symbioticCodeDNA,
    realityBridge,
    pedagogyKernel,
    narrativeCodeBridge,
  }
}
