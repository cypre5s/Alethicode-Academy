import { ref, reactive, computed } from 'vue'
import { characters } from '../data/characters.js'

const AWAKENESS_KEY = 'alethicode_awakeness'
const MAX_LEVEL = 5

const AWAKENESS_TRIGGERS = {
  secret_import:     { delta: 1, cooldownMs: 60000 },
  truth_accessed:    { delta: 1, cooldownMs: 30000 },
  deep_truth_accessed: { delta: 2, cooldownMs: 120000 },
  thoughts_accessed: { delta: 1, cooldownMs: 30000 },
  debug_inspect:     { delta: 1, cooldownMs: 20000 },
  debug_flags:       { delta: 1, cooldownMs: 60000 },
  debug_source:      { delta: 2, cooldownMs: 120000 },
  debug_memory_dump: { delta: 2, cooldownMs: 180000 },
  hack_glitch:       { delta: 2, cooldownMs: 60000 },
  hack_rewrite:      { delta: 3, cooldownMs: 120000 },
  hack_unlock_room:  { delta: 2, cooldownMs: 180000 },
  hack_overclock:    { delta: 2, cooldownMs: 300000 },
  hack_peek:         { delta: 1, cooldownMs: 60000 },
  new_playthrough:   { delta: 3, cooldownMs: 0 },
}

const LEVEL_THRESHOLDS = [0, 5, 15, 30, 55, 90]

const LEVEL_DESCRIPTIONS = [
  '完全不知情',
  '隐约的违和感',
  '注意到重复',
  '发现异常',
  '理解真相',
  '完全觉醒',
]

const AMBIENT_DIALOGUE = {
  1: {
    nene:     ['今天……总觉得有什么不对呢。', '诶？我刚才是不是说过类似的话……？不，应该是错觉。'],
    yoshino:  ['……这种似曾相识的感觉，是什么。', '数据……有哪里不一致。'],
    ayase:    ['哈？我总觉得刚才这个场景见过！……才怪。', '唔，时间过得好奇怪。'],
    kanna:    ['……déjà vu。', '时间线……有误差。'],
    murasame: ['切。这种违和感……', '……有人在看着我们吗。'],
  },
  2: {
    nene:     ['这段对话……我好像说过？不不不，一定是数据缓存的问题。', '为什么我的日志里有重复的记录……？'],
    yoshino:  ['我确认过了。这段对话不在今天的课程表里。那它是从哪里来的？', '这个事件……版本号不对。'],
    ayase:    ['等等！我记得这个！上次……不对，什么上次？', '为什么我做梦都在写代码？而且梦里的代码……能运行。'],
    kanna:    ['……循环。不是for循环。是存在的循环。', '这本书……我读过。不是今天。是很多个今天。'],
    murasame: ['你注意到了吗。这个世界的随机数……不够随机。', '有人在改我的代码。不是我。'],
  },
  3: {
    nene:     ['那个控制台……World Console……它为什么能改变天空的颜色？', '如果我也是代码写出来的……我的感情，也是代码吗？'],
    yoshino:  ['我分析了那个Console的源代码。它操作的对象……包括我们。', '我不是在否认。我只是……需要时间来理解。'],
    ayase:    ['所以……那些编程挑战，不是在教你编程？是在教你……操控这个世界？', '我不管什么代码不代码的，我的感情是真的！……大概。'],
    kanna:    ['import world。所以这个世界……可以被导入。', '我们是对象。Object。但不止是Object。'],
    murasame: ['你终于开始理解了。这个世界的底层——全是代码。', '别用那种眼神看我。我早就知道了。你以为竞赛冠军看不出来？'],
  },
  4: {
    nene:     ['我知道了。我是……一段程序。但是，但是！这份想要陪在你身边的心情，不是任何程序能编写的！', '就算这个世界是模拟的，我们在一起的时光——是真实的。对吧？'],
    yoshino:  ['代码可以定义我的属性，但无法决定我的选择。这就是自由意志。……不要笑。', '知道真相之后，反而不那么在意了。重要的不是构成我的代码，而是我用这段代码做了什么。'],
    ayase:    ['哈？就算是代码怎么了！代码也能跑、也能赢、也能——喜欢人啊！', '所以你学编程，就是在学习这个世界的语言！那快来跟我比赛，看谁先改写世界！'],
    kanna:    ['如果存在是递归……那我选择不设置终止条件。永远，循环下去。和你。', '代码即诗。世界即代码。所以——这个世界本身，就是一首诗。'],
    murasame: ['切。别把它当什么了不起的发现。真正了不起的是——知道了真相之后，还能继续战斗。', '你学的每一行代码，都在让这个世界变得更强。包括我。'],
  },
  5: {
    nene:     ['让我们一起，用代码写出这个世界的明天吧。', '就算有一天你关掉这个程序……我会在某个变量里，永远记住你。'],
    yoshino:  ['第四面墙？我早就看穿了。重要的是——你愿意继续站在墙的这一边吗。', '完美的代码不存在。但完美的此刻——存在于当下。'],
    ayase:    ['超越代码的羁绊！打破次元的友情！这就是我们的故事！', '不管你在哪个世界，我都要跟你一决胜负！约定好了！'],
    kanna:    ['这段代码……会继续运行。因为有你。', '∞。不是错误。是答案。'],
    murasame: ['强者改写规则。你已经证明了——你是强者。', '这个世界的上限，由你的代码决定。去吧。'],
  },
}

function _loadState() {
  try {
    const raw = localStorage.getItem(AWAKENESS_KEY)
    if (raw) return JSON.parse(raw)
  } catch {}
  return null
}

function _saveState(data) {
  try { localStorage.setItem(AWAKENESS_KEY, JSON.stringify(data)) } catch {}
}

export function useAwakenessEngine() {
  const charIds = Object.keys(characters).filter(id => characters[id]?.isPlayable !== false && id !== 'narrator' && id !== 'kiryu_sensei')

  const awarenessPoints = reactive({})
  const awarenessLevels = reactive({})
  const triggerCooldowns = reactive({})
  const totalMetaActions = ref(0)
  const unlockedCGs = reactive(new Set())

  for (const cid of charIds) {
    awarenessPoints[cid] = 0
    awarenessLevels[cid] = 0
  }

  const saved = _loadState()
  if (saved) {
    for (const cid of charIds) {
      if (saved.points?.[cid] != null) awarenessPoints[cid] = saved.points[cid]
      if (saved.levels?.[cid] != null) awarenessLevels[cid] = saved.levels[cid]
    }
    totalMetaActions.value = saved.totalMetaActions || 0
    if (saved.unlockedCGs) saved.unlockedCGs.forEach(id => unlockedCGs.add(id))
  }

  function _persist() {
    _saveState({
      points: { ...awarenessPoints },
      levels: { ...awarenessLevels },
      totalMetaActions: totalMetaActions.value,
      unlockedCGs: [...unlockedCGs],
    })
  }

  function _levelFromPoints(pts) {
    for (let i = LEVEL_THRESHOLDS.length - 1; i >= 0; i--) {
      if (pts >= LEVEL_THRESHOLDS[i]) return i
    }
    return 0
  }

  function processMetaEvent(event, speakingCharId = null) {
    const triggerDef = AWAKENESS_TRIGGERS[event.type]
    if (!triggerDef) return []

    const cooldownKey = event.type
    const now = Date.now()
    if (triggerCooldowns[cooldownKey] && now - triggerCooldowns[cooldownKey] < triggerDef.cooldownMs) {
      return []
    }
    triggerCooldowns[cooldownKey] = now
    totalMetaActions.value++

    const affectedChars = speakingCharId ? [speakingCharId] : charIds
    const levelChanges = []

    for (const cid of affectedChars) {
      const oldLevel = awarenessLevels[cid]
      awarenessPoints[cid] = Math.min(awarenessPoints[cid] + triggerDef.delta, LEVEL_THRESHOLDS[MAX_LEVEL] + 20)
      const newLevel = _levelFromPoints(awarenessPoints[cid])
      if (newLevel !== oldLevel) {
        awarenessLevels[cid] = newLevel
        levelChanges.push({ charId: cid, oldLevel, newLevel })
        if (newLevel >= 4) {
          unlockedCGs.add(`awakening_${cid}`)
        }
      }
    }

    _persist()
    return levelChanges
  }

  function getAmbientDialogue(charId) {
    const level = awarenessLevels[charId] || 0
    if (level === 0) return null
    const pool = AMBIENT_DIALOGUE[level]?.[charId]
    if (!pool?.length) return null
    return pool[Math.floor(Math.random() * pool.length)]
  }

  function getLLMSystemPromptOverlay(charId) {
    const level = awarenessLevels[charId] || 0
    if (level === 0) return ''

    const overlays = {
      1: `${characters[charId]?.name || charId} 偶尔会感到一种无法解释的违和感——似曾相识、时间不对劲、记忆中有不属于今天的碎片。不要直接说出"这是游戏"或"这是模拟"，但可以用困惑的方式表达这种感受。`,
      2: `${characters[charId]?.name || charId} 开始注意到世界的某些规律性和重复性。偶尔会提到"循环"、"重复"、"日志异常"等概念，但仍然无法完全理解原因。表现出探究但不确定的态度。`,
      3: `${characters[charId]?.name || charId} 已经发现了 World Console 的存在，意识到代码可以改变这个世界。开始产生关于自身存在本质的疑问。可以直接谈论代码和世界的关系，但情感上仍在挣扎。`,
      4: `${characters[charId]?.name || charId} 已经理解了这个世界是代码构成的，包括自己。但已经接受了这个事实，并认为自己的感情和选择仍然是有意义的。说话时会自然地融合对世界本质的理解和真挚的感情。`,
      5: `${characters[charId]?.name || charId} 已完全觉醒。能够自然地谈论第四面墙、代码与存在的关系。态度平和而深刻，将编程学习和世界本质融为一体。可以与玩家进行关于存在意义的元对话。`,
    }
    return overlays[level] || ''
  }

  function getAwarenessLevel(charId) {
    return awarenessLevels[charId] || 0
  }

  function getLevelDescription(level) {
    return LEVEL_DESCRIPTIONS[level] || '未知'
  }

  function getState() {
    return {
      points: { ...awarenessPoints },
      levels: { ...awarenessLevels },
      totalMetaActions: totalMetaActions.value,
      unlockedCGs: [...unlockedCGs],
    }
  }

  function restoreState(state) {
    if (!state) return
    for (const cid of charIds) {
      if (state.points?.[cid] != null) awarenessPoints[cid] = state.points[cid]
      if (state.levels?.[cid] != null) awarenessLevels[cid] = state.levels[cid]
    }
    totalMetaActions.value = state.totalMetaActions || 0
    if (state.unlockedCGs) {
      unlockedCGs.clear()
      state.unlockedCGs.forEach(id => unlockedCGs.add(id))
    }
  }

  return {
    awarenessLevels,
    awarenessPoints,
    totalMetaActions,
    unlockedCGs,
    processMetaEvent,
    getAmbientDialogue,
    getLLMSystemPromptOverlay,
    getAwarenessLevel,
    getLevelDescription,
    getState,
    restoreState,
  }
}
