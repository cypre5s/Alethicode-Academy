import { ref, reactive } from 'vue'
import { characters } from '../data/characters.js'

const PROC_CACHE_DB = 'alethicode_procedural_events'
const PROC_STORE = 'generated_events'
const MAX_CACHED = 50

let _db = null

function _openDB() {
  if (_db) return Promise.resolve(_db)
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(PROC_CACHE_DB, 1)
    req.onupgradeneeded = () => {
      const db = req.result
      if (!db.objectStoreNames.contains(PROC_STORE)) db.createObjectStore(PROC_STORE, { keyPath: 'id' })
    }
    req.onsuccess = () => { _db = req.result; resolve(_db) }
    req.onerror = () => reject(req.error)
  })
}

function _dbPut(val) {
  return _openDB().then(db => new Promise((resolve, reject) => {
    const tx = db.transaction(PROC_STORE, 'readwrite')
    tx.objectStore(PROC_STORE).put(val)
    tx.oncomplete = () => resolve()
    tx.onerror = () => reject(tx.error)
  })).catch(() => {})
}

function _dbGetAll() {
  return _openDB().then(db => new Promise((resolve, reject) => {
    const tx = db.transaction(PROC_STORE, 'readonly')
    const req = tx.objectStore(PROC_STORE).getAll()
    req.onsuccess = () => resolve(req.result || [])
    req.onerror = () => reject(req.error)
  })).catch(() => [])
}

const CONCEPT_EVENT_TEMPLATES = {
  variables: {
    charId: 'nene',
    dialogue: [
      { speaker: 'nene', text: '对了，你知道吗？变量就像一个小盒子，可以装下任何东西呢。', expression: 'gentle_smile' },
      { speaker: 'nene', text: '比如说，「favorite_color = "蓝色"」——这就是把"蓝色"放进了名叫 favorite_color 的盒子里。', expression: 'smile' },
      { speaker: 'nene', text: '你最喜欢的颜色是什么呢？试着用代码告诉我吧～', expression: 'normal' },
    ]
  },
  for_loop: {
    charId: 'ayase',
    dialogue: [
      { speaker: 'ayase', text: '嘿！你已经学会 for 循环了对吧！', expression: 'grin' },
      { speaker: 'ayase', text: '那来比比谁能用循环画出更酷的图案吧！', expression: 'competitive' },
      { speaker: 'ayase', text: '我上次用循环画了一个金字塔，但是……出了点 Bug……', expression: 'pout' },
    ]
  },
  functions: {
    charId: 'yoshino',
    dialogue: [
      { speaker: 'yoshino', text: '函数定义的规范化非常重要。你写的函数——让我审查一下。', expression: 'glasses_adjust' },
      { speaker: 'yoshino', text: '命名是否清晰？参数是否合理？返回值是否明确？', expression: 'normal' },
      { speaker: 'yoshino', text: '……不是因为关心你才说的。是因为代码规范就是规范。', expression: 'blush' },
    ]
  },
  recursion: {
    charId: 'kanna',
    dialogue: [
      { speaker: 'kanna', text: '……递归。', expression: 'contemplative' },
      { speaker: 'kanna', text: '函数调用自己。就像……镜子映照镜子。', expression: 'absorbed' },
      { speaker: 'kanna', text: '要记得设置终止条件。否则……会永远循环下去。', expression: 'slight_smile' },
    ]
  },
  classes: {
    charId: 'murasame',
    dialogue: [
      { speaker: 'murasame', text: '你开始学类和对象了？不错。', expression: 'impressed' },
      { speaker: 'murasame', text: '类是蓝图。对象是实例。这个世界里的一切——都是某个类的实例。', expression: 'smirk' },
      { speaker: 'murasame', text: '……包括我们。想想看。', expression: 'cold' },
    ]
  },
  algorithms: {
    charId: 'ayase',
    dialogue: [
      { speaker: 'ayase', text: '算法来了！这是我最喜欢的领域！', expression: 'fired_up' },
      { speaker: 'ayase', text: '谁能写出最快的排序？我赌你写不过我！', expression: 'competitive' },
      { speaker: 'ayase', text: '……好吧，如果你赢了，我请你喝果汁。', expression: 'soft_smile' },
    ]
  },
  error_handling: {
    charId: 'nene',
    dialogue: [
      { speaker: 'nene', text: '异常处理……就像生活中的 Plan B 呢。', expression: 'thinking' },
      { speaker: 'nene', text: 'try 里面放想做的事，except 里面放万一失败的后备方案。', expression: 'gentle_smile' },
      { speaker: 'nene', text: '嗯……如果我的程序也有 try-except 就好了。有些感情的 Error，没有 except 能 catch 呢……', expression: 'sad' },
    ]
  },
  list_comp: {
    charId: 'yoshino',
    dialogue: [
      { speaker: 'yoshino', text: '列表推导式。优雅代码的基本功。', expression: 'slight_smile' },
      { speaker: 'yoshino', text: '[x for x in range(10) if x % 2 == 0]——一行代码，胜过五行。', expression: 'glasses_adjust' },
      { speaker: 'yoshino', text: '……我没有在夸你。只是陈述事实。', expression: 'tsundere_pout' },
    ]
  },
  debugging: {
    charId: 'murasame',
    dialogue: [
      { speaker: 'murasame', text: 'Debug 能力才是真正区分新手和高手的东西。', expression: 'fierce' },
      { speaker: 'murasame', text: '不要怕 Bug。每一个 Bug 都在教你一些东西。', expression: 'normal' },
      { speaker: 'murasame', text: '……就像人生的挫折。切。我什么都没说。', expression: 'vulnerable' },
    ]
  },
}

const DAILY_TEMPLATES = [
  {
    id: 'study_group',
    condition: (state) => state.chapter !== 'prologue',
    generate: (state) => ({
      scene: 'classroom',
      characters: ['nene', 'yoshino'],
      dialogue: [
        { speaker: 'nene', text: '今天放学后要不要一起复习呢？', expression: 'smile' },
        { speaker: 'yoshino', text: '……如果你要参加的话，我可以顺便指导一下。', expression: 'cold' },
      ],
    }),
  },
  {
    id: 'rooftop_sunset',
    condition: (state) => state.timeSlot === 'evening',
    generate: (state) => ({
      scene: 'rooftop',
      characters: ['ayase'],
      dialogue: [
        { speaker: 'ayase', text: '哇——！今天的夕阳好漂亮！', expression: 'surprised' },
        { speaker: 'ayase', text: '嘿嘿，你也觉得吧？偶尔不写代码，看看风景也挺好的。', expression: 'soft_smile' },
      ],
    }),
  },
  {
    id: 'library_encounter',
    condition: (state) => true,
    generate: (state) => ({
      scene: 'library',
      characters: ['kanna'],
      dialogue: [
        { speaker: 'kanna', text: '……', expression: 'normal' },
        { speaker: 'kanna', text: '你来了。……这个座位，我帮你留着的。', expression: 'slight_smile' },
      ],
    }),
  },
  {
    id: 'competition_prep',
    condition: (state) => state.totalChallenges >= 5,
    generate: (state) => ({
      scene: 'computer_room',
      characters: ['murasame'],
      dialogue: [
        { speaker: 'murasame', text: '编程竞赛快到了。你的准备……只能说勉强及格。', expression: 'cold' },
        { speaker: 'murasame', text: '……明天同一时间来。我亲自训练你。别迟到。', expression: 'smirk' },
      ],
    }),
  },
  {
    id: 'cafe_break',
    condition: (state) => state.chapter !== 'prologue',
    generate: (state) => ({
      scene: 'cafeteria',
      characters: ['nene', 'ayase'],
      dialogue: [
        { speaker: 'ayase', text: '午餐时间！今天食堂有新菜单！', expression: 'grin' },
        { speaker: 'nene', text: '嗯嗯，看起来很好吃呢～一起去吧！', expression: 'smile' },
      ],
    }),
  },
]

export function useProceduralEventGenerator() {
  const generatedEvents = reactive([])
  const usedEventIds = reactive(new Set())
  const pendingConceptEvents = ref([])

  function getConceptEvent(conceptId) {
    const template = CONCEPT_EVENT_TEMPLATES[conceptId]
    if (!template) return null
    const eventId = `concept_${conceptId}_${Date.now()}`
    if (usedEventIds.has(`concept_${conceptId}`)) return null
    usedEventIds.add(`concept_${conceptId}`)
    return {
      id: eventId,
      type: 'concept_celebration',
      concept: conceptId,
      ...template,
    }
  }

  function getDailyEvents(gameState) {
    const available = DAILY_TEMPLATES.filter(t => {
      if (usedEventIds.has(t.id)) return false
      return t.condition(gameState)
    })
    const shuffled = available.sort(() => Math.random() - 0.5)
    return shuffled.slice(0, 3).map(t => {
      const event = t.generate(gameState)
      return { id: t.id, type: 'daily', ...event }
    })
  }

  function markEventUsed(eventId) {
    usedEventIds.add(eventId)
  }

  function checkConceptUnlocks(cognitiveGraph) {
    if (!cognitiveGraph) return []
    const events = []
    const conceptStates = cognitiveGraph.getAllConceptStates?.() || {}
    for (const [conceptId, state] of Object.entries(conceptStates)) {
      if (state === 'lit' || state === 'blazing') {
        const event = getConceptEvent(conceptId)
        if (event) events.push(event)
      }
    }
    return events
  }

  async function generateLLMEvent(llmManager, gameState) {
    if (!llmManager?.chat) return null
    const { chapter, relationship, recentConcepts } = gameState

    const prompt = `你是 Alethicode Academy 的叙事引擎。请生成一个简短的日常事件。
当前章节：${chapter}
最近学习的概念：${(recentConcepts || []).join('、')}
角色好感度：${Object.entries(relationship || {}).map(([k,v]) => `${k}:${Math.round((v.affection+v.trust+v.comfort)/3)}`).join(', ')}

请以JSON格式输出一个事件：
{"scene": "场景ID", "characters": ["角色ID"], "dialogue": [{"speaker": "角色ID", "text": "台词", "expression": "表情"}]}
场景ID可选：classroom, rooftop, library, computer_room, cafeteria, school_gate, school_yard
角色ID可选：nene, yoshino, ayase, kanna, murasame
表情参考各角色的 expressions 列表。
事件要简短（2-3句对话），要温馨/有趣/感人。`

    try {
      const response = await llmManager.chat([{ role: 'user', content: prompt }], { maxTokens: 300 })
      if (!response) return null
      const jsonMatch = response.match(/\{[\s\S]*\}/)
      if (!jsonMatch) return null
      const parsed = JSON.parse(jsonMatch[0])
      if (!parsed.dialogue?.length) return null

      const event = {
        id: `llm_daily_${Date.now()}`,
        type: 'daily_llm',
        scene: parsed.scene || 'classroom',
        characters: parsed.characters || [],
        dialogue: parsed.dialogue.slice(0, 5),
      }

      _dbPut({ ...event, generatedAt: Date.now() }).catch(() => {})
      return event
    } catch {
      return null
    }
  }

  function getState() {
    return {
      usedEventIds: [...usedEventIds],
      generatedCount: generatedEvents.length,
    }
  }

  function restoreState(state) {
    if (!state) return
    usedEventIds.clear()
    if (state.usedEventIds) state.usedEventIds.forEach(id => usedEventIds.add(id))
  }

  return {
    generatedEvents,
    pendingConceptEvents,
    getConceptEvent,
    getDailyEvents,
    markEventUsed,
    checkConceptUnlocks,
    generateLLMEvent,
    getState,
    restoreState,
  }
}
