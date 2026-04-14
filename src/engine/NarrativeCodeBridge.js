import { ref, reactive, computed } from 'vue'

const NARRATIVE_TRIGGERS = {
  print_heart: {
    pattern: /print\s*\(\s*["'].*[❤♥💖💗♡ᐸ3˖°].*["']\s*\)/i,
    alternatePattern: /print\s*\(\s*["'].*(?:love|heart|daisuki|suki|喜欢|爱).*["']\s*\)/i,
    event: 'secret_confession_code',
    oneShot: true,
    description: 'Player printed a heart or love message',
    affinity: { any_speaking: 5 },
    memory: { text: '写了一段带有心意的代码', emotion: 'warm' },
  },
  infinite_loop: {
    runtimePattern: /maximum.*recursion|timed?\s*out|infinite/i,
    event: 'code_crash_reaction',
    cooldown: 60000,
    description: 'Player triggered infinite loop or stack overflow',
    affinity: { any_speaking: -1 },
    memory: { text: '写了一个无限循环', emotion: 'concern' },
  },
  creative_output: {
    outputPattern: /[█▓▒░╔╗╚╝║═┌┐└┘│─┼★☆●○◆◇▲△▼▽♠♣♦♤♧♢]/,
    event: 'ascii_art_discovered',
    cooldown: 120000,
    description: 'Player created ASCII art or creative text output',
    affinity: { kanna: 3 },
    memory: { text: '创作了一段ASCII艺术', emotion: 'fascination' },
  },
  elegant_comprehension: {
    pattern: /\[\s*\w+.*for\s+\w+\s+in\s+.*(?:if\s+|\])/,
    event: 'elegant_code_noticed',
    cooldown: 300000,
    description: 'Player used list comprehension elegantly',
    affinity: { yoshino: 4 },
    memory: { text: '写出了优雅的列表推导式', emotion: 'impressed' },
  },
  helper_function: {
    pattern: /def\s+(?:help|assist|support|save|protect|guard)\w*\s*\(/i,
    event: 'protective_coding',
    oneShot: true,
    description: 'Player defined a helper/protective function',
    affinity: { nene: 3 },
    memory: { text: '写了一个保护性的辅助函数', emotion: 'touched' },
  },
  speed_demon: {
    pattern: /(?:sort|sorted|min|max|sum)\s*\(/,
    outputTiming: { maxMs: 100 },
    event: 'speed_achievement',
    cooldown: 600000,
    description: 'Player wrote optimized code',
    affinity: { ayase: 3 },
  },
  recursive_beauty: {
    pattern: /def\s+\w+\([^)]*\)[\s\S]*?\1\s*\(/,
    event: 'recursion_mastered',
    oneShot: true,
    description: 'Player wrote recursive code',
    affinity: { kanna: 4, murasame: 2 },
    memory: { text: '掌握了递归的美', emotion: 'awe' },
  },
  error_handler: {
    pattern: /try\s*:[\s\S]*?except/,
    event: 'resilient_coder',
    cooldown: 300000,
    affinity: { nene: 2 },
  },
  class_definition: {
    pattern: /class\s+[A-Z]\w+.*:/,
    event: 'oop_awakening',
    oneShot: true,
    description: 'Player defined a class with proper naming',
    affinity: { yoshino: 4, murasame: 2 },
    memory: { text: '写了第一个类定义', emotion: 'impressed' },
  },
  dictionary_master: {
    pattern: /\{[^}]*:\s*[^}]+\}/,
    event: 'data_structure_insight',
    cooldown: 600000,
    affinity: { kanna: 2 },
  },
  fibonacci_code: {
    pattern: /fib|fibonacci/i,
    event: 'fibonacci_discovery',
    oneShot: true,
    description: 'Player wrote Fibonacci sequence',
    affinity: { kanna: 5 },
    memory: { text: '发现了斐波那契之美', emotion: 'wonder' },
  },
  game_code: {
    pattern: /(?:game|play|score|level|life|lives|enemy|player)\s*=/i,
    event: 'game_dev_spirit',
    cooldown: 600000,
    affinity: { ayase: 3 },
  },
  world_manipulation: {
    pattern: /world\.\w+\.\w+\s*=/,
    event: 'reality_editor_awakening',
    cooldown: 120000,
    description: 'Player modified world state',
    affinity: { kanna: 2, murasame: 1 },
  },
  canvas_art: {
    pattern: /canvas\.(?:circle|rect|line|heart|star|polygon)/,
    event: 'digital_artist',
    cooldown: 300000,
    description: 'Player drew on canvas',
    affinity: { kanna: 3, nene: 2 },
    memory: { text: '在画布上创作了数字艺术', emotion: 'creative' },
  },
  hack_attempt: {
    pattern: /import\s+hack/,
    event: 'hacker_detected',
    oneShot: true,
    description: 'Player imported the hack module',
    affinity: { murasame: 5 },
    memory: { text: '尝试入侵世界系统', emotion: 'intrigue' },
  },
  secret_seeker: {
    pattern: /import\s+game_secrets/,
    event: 'truth_seeker',
    oneShot: true,
    description: 'Player sought hidden knowledge',
    affinity: { kanna: 3, murasame: 2 },
    memory: { text: '开始探索世界的真相', emotion: 'curiosity' },
  },
  music_code: {
    pattern: /sound\.(?:bgm|play)/,
    event: 'dj_mode',
    cooldown: 300000,
    affinity: { ayase: 2, nene: 1 },
  },
  screen_hacker: {
    pattern: /screen\.(?:shake|glitch|flash)/,
    event: 'screen_manipulation',
    cooldown: 120000,
    affinity: { murasame: 2 },
  },
  poetry_print: {
    pattern: /print\s*\(\s*["'].*[\u4e00-\u9fff].*[\u4e00-\u9fff].*["']\s*\)/,
    event: 'code_poetry',
    cooldown: 300000,
    description: 'Player printed Chinese text like poetry',
    affinity: { kanna: 3, nene: 2 },
    memory: { text: '用代码写了一首诗', emotion: 'touched' },
  },
  math_formula: {
    pattern: /math\.(?:sqrt|sin|cos|pi|log|factorial)/,
    event: 'math_beauty',
    cooldown: 600000,
    affinity: { yoshino: 3, kanna: 2 },
  },
  while_true: {
    pattern: /while\s+True\s*:/,
    event: 'brave_loop',
    cooldown: 300000,
    affinity: { ayase: 2 },
  },
  lambda_usage: {
    pattern: /lambda\s+\w+\s*:/,
    event: 'functional_thinker',
    oneShot: true,
    affinity: { yoshino: 3, kanna: 2 },
    memory: { text: '使用了Lambda表达式', emotion: 'elegant' },
  },
  multi_function: {
    pattern: /def\s+\w+[\s\S]*def\s+\w+/,
    event: 'modular_design',
    cooldown: 600000,
    description: 'Player defined multiple functions',
    affinity: { yoshino: 3 },
  },
  long_program: {
    outputPattern: /.{20,}[\s\S]*.{20,}[\s\S]*.{20,}/,
    event: 'prolific_coder',
    cooldown: 600000,
    description: 'Player wrote substantial output',
    affinity: { murasame: 2, ayase: 1 },
  },
  narrate_attempt: {
    pattern: /narrate\s*\(/,
    event: 'storyteller_code',
    cooldown: 300000,
    description: 'Player used narrate to tell stories',
    affinity: { nene: 3, kanna: 2 },
    memory: { text: '用代码讲了一个故事', emotion: 'warm' },
  },
  time_manipulation: {
    pattern: /time\.(?:set|skip)/,
    event: 'time_traveler',
    cooldown: 300000,
    affinity: { kanna: 3 },
    memory: { text: '操纵了时间', emotion: 'mysterious' },
  },
  particles_party: {
    pattern: /particles\.(?:hearts|sparkle|snow|emit)/,
    event: 'particle_magician',
    cooldown: 300000,
    affinity: { nene: 3, ayase: 2 },
  },
  spawn_gift: {
    pattern: /spawn_item\s*\(/,
    event: 'item_creator',
    cooldown: 300000,
    description: 'Player created an item',
    affinity: { nene: 2 },
    memory: { text: '创造了一件物品', emotion: 'creative' },
  },
  debug_mode_used: {
    pattern: /debug_mode\.inspect/,
    event: 'system_analyst',
    oneShot: true,
    affinity: { yoshino: 2, murasame: 3 },
    memory: { text: '开始分析系统内部', emotion: 'curiosity' },
  },
  string_formatting: {
    pattern: /f["'].*\{.*\}.*["']/,
    event: 'format_master',
    cooldown: 600000,
    affinity: { nene: 2 },
  },
  input_function: {
    pattern: /input\s*\(/,
    event: 'interactive_code',
    cooldown: 600000,
    affinity: { nene: 2, ayase: 1 },
  },
  sorting_algorithm: {
    pattern: /(?:bubble|merge|quick|insertion|selection)\s*(?:_?sort)/i,
    event: 'algorithm_warrior',
    oneShot: true,
    affinity: { ayase: 4, murasame: 3, kanna: 2 },
    memory: { text: '实现了经典排序算法', emotion: 'growth' },
  },
  binary_search: {
    pattern: /binary\s*_?search|bisect/i,
    event: 'divide_conquer',
    oneShot: true,
    affinity: { kanna: 4, murasame: 2 },
    memory: { text: '掌握了二分查找', emotion: 'insight' },
  },
}

const NARRATIVE_CONSEQUENCES = {
  secret_confession_code: {
    type: 'inject_dialogue',
    variants: {
      nene: [
        { speaker: 'nene', expression: 'blush', text: '诶……你写的这段代码……输出了什么奇怪的东西……' },
        { speaker: 'nene', expression: 'blush', text: '等、等一下……这是……给我的吗？' },
      ],
      yoshino: [
        { speaker: 'yoshino', expression: 'blush', text: '……这种代码完全不符合规范。' },
        { speaker: 'yoshino', expression: 'rare_gentle', text: '但是……我会保存下来的。仅此而已。' },
      ],
      ayase: [
        { speaker: 'ayase', expression: 'surprised', text: '等等等等！你在代码里写什么呢！！' },
        { speaker: 'ayase', expression: 'blush', text: '……虽然确实有点心动就是了。' },
      ],
      kanna: [
        { speaker: 'kanna', expression: 'blush', text: '……' },
        { speaker: 'kanna', expression: 'warm_smile', text: '……嗯。收到了。' },
      ],
      murasame: [
        { speaker: 'murasame', expression: 'smirk', text: '用代码传情？……还挺有创意的。' },
        { speaker: 'murasame', expression: 'impressed', text: '不过含金量还得再升升。' },
      ],
    },
    flag: 'code_confession_seen',
  },
  code_crash_reaction: {
    type: 'inject_dialogue',
    variants: {
      nene: [
        { speaker: 'nene', expression: 'confused', text: '啊……代码崩溃了。没关系没关系，Bug 是成长的证明！' },
      ],
      yoshino: [
        { speaker: 'yoshino', expression: 'cold', text: '……你又把程序搞崩了。debug 之前先用脑子。' },
      ],
      ayase: [
        { speaker: 'ayase', expression: 'grin', text: '哇哈哈！你也会写死循环！我不是一个人了！' },
      ],
      kanna: [
        { speaker: 'kanna', expression: 'contemplative', text: '……无限循环。像永远走不出的迷宫。' },
      ],
    },
  },
  ascii_art_discovered: {
    type: 'inject_dialogue',
    generic: [
      { speaker: 'kanna', expression: 'absorbed', text: '……你用文字画了一幅画。代码也可以是艺术。' },
    ],
    flag: 'discovered_code_art',
    unlock_cg: null,
  },
  elegant_code_noticed: {
    type: 'inject_dialogue',
    variants: {
      yoshino: [
        { speaker: 'yoshino', expression: 'glasses_adjust', text: '列表推导式……写得不错。代码的优雅不在于华丽，而在于精准。' },
        { speaker: 'yoshino', expression: 'slight_smile', text: '继续保持这个水平。' },
      ],
    },
    generic: [
      { speaker: 'yoshino', expression: 'slight_smile', text: '……这段代码的风格，有进步。' },
    ],
  },
  recursion_mastered: {
    type: 'inject_dialogue',
    generic: [
      { speaker: 'kanna', expression: 'warm_smile', text: '递归……用自己定义自己。就像记忆里的记忆。' },
      { speaker: 'kanna', expression: 'contemplative', text: '你开始理解了……代码的深层结构。' },
    ],
    flag: 'mastered_recursion',
  },
  oop_awakening: {
    type: 'inject_dialogue',
    generic: [
      { speaker: 'yoshino', expression: 'glasses_adjust', text: '类定义。面向对象的第一步。命名规范用了 PascalCase，不错。' },
      { speaker: 'yoshino', expression: 'slight_smile', text: '……继续。我会看着的。' },
    ],
  },
  hacker_detected: {
    type: 'inject_dialogue',
    generic: [
      { speaker: 'murasame', expression: 'smirk', text: '……你发现了 hack 模块？有意思。看来你不只是个普通学生。' },
      { speaker: 'murasame', expression: 'impressed', text: '但要小心。窥探太深……后果自负。' },
    ],
    flag: 'hack_module_discovered',
  },
  truth_seeker: {
    type: 'inject_dialogue',
    generic: [
      { speaker: 'kanna', expression: 'contemplative', text: '……你在寻找什么？' },
      { speaker: 'kanna', expression: 'warm_smile', text: '真相……有时候，比代码更复杂。' },
    ],
    flag: 'game_secrets_discovered',
  },
  digital_artist: {
    type: 'inject_dialogue',
    generic: [
      { speaker: 'kanna', expression: 'absorbed', text: '……你在画布上创作。代码也可以是画笔。' },
      { speaker: 'nene', expression: 'smile', text: '哇～好漂亮！你用代码画出来的吗？太厉害了！' },
    ],
  },
  reality_editor_awakening: {
    type: 'inject_dialogue',
    generic: [
      { speaker: 'murasame', expression: 'cold', text: '你改变了世界的属性。……你开始理解这个世界的本质了。' },
    ],
  },
  code_poetry: {
    type: 'inject_dialogue',
    generic: [
      { speaker: 'kanna', expression: 'warm_smile', text: '……诗。用代码写的诗。' },
      { speaker: 'nene', expression: 'gentle_smile', text: '好美的文字……这是代码输出的吗？感觉好温暖呢。' },
    ],
  },
  storyteller_code: {
    type: 'inject_dialogue',
    generic: [
      { speaker: 'nene', expression: 'surprised', text: '你用代码讲了一个故事！世界里出现了新的文字……' },
    ],
  },
  time_traveler: {
    type: 'inject_dialogue',
    generic: [
      { speaker: 'kanna', expression: 'contemplative', text: '时间……被改变了。你感觉到了吗？空气的温度不一样了。' },
    ],
  },
  algorithm_warrior: {
    type: 'inject_dialogue',
    generic: [
      { speaker: 'ayase', expression: 'fired_up', text: '排序算法！不错嘛！来比比谁的实现更快！' },
      { speaker: 'murasame', expression: 'impressed', text: '……算法基础扎实。有竞赛的潜质。' },
    ],
    flag: 'mastered_sorting',
  },
  fibonacci_discovery: {
    type: 'inject_dialogue',
    generic: [
      { speaker: 'kanna', expression: 'absorbed', text: '1, 1, 2, 3, 5, 8, 13……自然界的密码。你也发现了。' },
      { speaker: 'kanna', expression: 'warm_smile', text: '……这个数列很美。像螺旋。像银河。' },
    ],
  },
  system_analyst: {
    type: 'inject_dialogue',
    generic: [
      { speaker: 'yoshino', expression: 'cold', text: '你在用 debug_mode 分析系统……你看到了什么？' },
      { speaker: 'murasame', expression: 'smirk', text: '分析系统内部？好胆量。但准备好承受真相了吗。' },
    ],
    flag: 'debug_mode_used',
  },
}

const CODE_WORLD_EFFECTS = [
  {
    id: 'sakura_code',
    outputPattern: /[🌸🌺🌷💐花桜さくら]/,
    worldEffect: { weather: 'sakura' },
    duration: 15000,
    description: 'Sakura petals when code outputs flower symbols',
  },
  {
    id: 'starry_code',
    outputPattern: /[★☆✧✦⭐🌟✨星]/,
    worldEffect: { stars: true, time: 'night' },
    duration: 20000,
    description: 'Night sky with stars when code outputs star symbols',
  },
  {
    id: 'rain_code',
    outputPattern: /[🌧☔💧雨rain]/i,
    worldEffect: { weather: 'rain' },
    duration: 15000,
    description: 'Rain effect when code outputs rain symbols',
  },
  {
    id: 'fire_code',
    outputPattern: /[🔥火炎flame]/i,
    worldEffect: { weather: 'fireflies' },
    duration: 15000,
    description: 'Fireflies when code outputs fire symbols',
  },
]

const STORY_BRANCH_EVALUATORS = {
  code_quality: (code, result) => {
    let score = 50
    if (result.success) score += 20
    if (code.includes('def ')) score += 10
    if (code.includes('for ') || code.includes('while ')) score += 5
    if (/try\s*:/.test(code)) score += 10
    if (/\[\s*\w+.*for/.test(code)) score += 10
    if (code.split('\n').some(l => l.trim().startsWith('#'))) score += 5
    const lines = code.split('\n').filter(l => l.trim()).length
    if (lines > 2 && lines < 30) score += 5
    if (result.stderr) score -= 15
    return Math.min(100, Math.max(0, score))
  },

  creativity: (code, result) => {
    let score = 0
    if (/[^\x00-\x7F]/.test(result.stdout || '')) score += 20
    if (/[█▓▒░╔╗╚╝║═┌┐└┘│─★☆●○]/u.test(result.stdout || '')) score += 30
    if ((result.stdout || '').split('\n').length > 5) score += 10
    if (code.includes('random') || code.includes('import random')) score += 15
    if (/f["']/.test(code)) score += 10
    if (code.includes('\\n') || code.includes('\\t')) score += 5
    return Math.min(100, Math.max(0, score))
  },

  emotional_intent: (code, result) => {
    let score = 0
    const combined = code + ' ' + (result.stdout || '')
    if (/love|heart|❤|♥|💖|喜欢|爱|好き|daisuki/i.test(combined)) score += 40
    if (/friend|友|仲間|nakama/i.test(combined)) score += 20
    if (/help|protect|save|守|助|support/i.test(combined)) score += 20
    if (/sorry|ごめん|对不起|抱歉/i.test(combined)) score += 15
    if (/thank|ありがとう|谢|感谢/i.test(combined)) score += 15
    return Math.min(100, Math.max(0, score))
  },
}

export function useNarrativeCodeBridge() {
  const triggerHistory = reactive({})
  const worldEffectTimers = {}
  const pendingNarrativeEvents = ref([])
  const codeStoryArc = reactive({
    totalExecutions: 0,
    successRate: 0,
    dominantStyle: 'beginner',
    peakCreativity: 0,
    peakEmotion: 0,
    storyMoments: [],
  })

  let _engineRef = null
  let _worldVMRef = null
  let _llmRef = null

  function bridge(engine, worldVM, llm) {
    _engineRef = engine
    _worldVMRef = worldVM
    _llmRef = llm
  }

  function evaluateCode(code, result, context = {}) {
    codeStoryArc.totalExecutions++
    const successes = codeStoryArc.storyMoments.filter(m => m.success).length
    codeStoryArc.successRate = Math.round((successes / codeStoryArc.totalExecutions) * 100)

    const quality = STORY_BRANCH_EVALUATORS.code_quality(code, result)
    const creativity = STORY_BRANCH_EVALUATORS.creativity(code, result)
    const emotion = STORY_BRANCH_EVALUATORS.emotional_intent(code, result)

    codeStoryArc.peakCreativity = Math.max(codeStoryArc.peakCreativity, creativity)
    codeStoryArc.peakEmotion = Math.max(codeStoryArc.peakEmotion, emotion)

    if (creativity > 60) codeStoryArc.dominantStyle = 'creative'
    else if (quality > 80) codeStoryArc.dominantStyle = 'meticulous'
    else if (emotion > 50) codeStoryArc.dominantStyle = 'expressive'
    else if (codeStoryArc.successRate > 80) codeStoryArc.dominantStyle = 'reliable'

    const events = []
    const now = Date.now()

    for (const [id, trigger] of Object.entries(NARRATIVE_TRIGGERS)) {
      if (trigger.oneShot && triggerHistory[id]) continue
      if (trigger.cooldown && triggerHistory[id] && (now - triggerHistory[id]) < trigger.cooldown) continue

      let matched = false

      if (trigger.pattern && trigger.pattern.test(code)) matched = true
      if (!matched && trigger.alternatePattern && trigger.alternatePattern.test(code)) matched = true
      if (!matched && trigger.runtimePattern && trigger.runtimePattern.test(result.stderr || '')) matched = true
      if (!matched && trigger.outputPattern && trigger.outputPattern.test(result.stdout || '')) matched = true

      if (matched) {
        triggerHistory[id] = now
        events.push({ triggerId: id, ...trigger })
      }
    }

    for (const effect of CODE_WORLD_EFFECTS) {
      if (effect.outputPattern.test(result.stdout || '') || effect.outputPattern.test(code)) {
        _applyWorldEffect(effect)
      }
    }

    codeStoryArc.storyMoments.push({
      timestamp: now,
      quality, creativity, emotion,
      success: result.success,
      triggeredEvents: events.map(e => e.event),
      chapter: context.chapter || '',
    })
    if (codeStoryArc.storyMoments.length > 100) {
      codeStoryArc.storyMoments.splice(0, codeStoryArc.storyMoments.length - 100)
    }

    if (events.length > 0) {
      _processNarrativeEvents(events, context)
    }

    return { quality, creativity, emotion, events: events.map(e => e.event) }
  }

  function _applyWorldEffect(effect) {
    if (!_engineRef) return

    if (worldEffectTimers[effect.id]) {
      clearTimeout(worldEffectTimers[effect.id])
    }

    if (effect.worldEffect.weather) {
      _engineRef.screenEffect.value = { effect: effect.worldEffect.weather, duration: effect.duration || 10000 }
    }

    worldEffectTimers[effect.id] = setTimeout(() => {
      delete worldEffectTimers[effect.id]
    }, effect.duration || 10000)
  }

  function _processNarrativeEvents(events, context) {
    if (!_engineRef) return

    for (const event of events) {
      const consequence = NARRATIVE_CONSEQUENCES[event.event]
      if (!consequence) continue

      if (consequence.flag) {
        _engineRef.flags[consequence.flag] = true
      }

      if (event.affinity && _engineRef.relationship) {
        const speakingChar = _engineRef.speaker.value?.id
        for (const [charId, delta] of Object.entries(event.affinity)) {
          const targetChar = charId === 'any_speaking' ? speakingChar : charId
          if (targetChar && _engineRef.relationship[targetChar]) {
            _engineRef.applyRelationshipDelta(targetChar, delta, 'code_narrative')
          }
        }
      }

      if (event.memory && _engineRef.memories) {
        const charId = _engineRef.speaker.value?.id || context.character
        if (charId && _engineRef.memories[charId]) {
          _engineRef.memories[charId].push({
            id: `code_narrative_${event.event}_${Date.now()}`,
            text: event.memory.text,
            context: 'code_narrative',
            chapter: _engineRef.currentChapter?.value || '',
            timestamp: Date.now(),
            emotion: event.memory.emotion || 'warm',
            source: 'code_narrative',
          })
        }
      }

      if (consequence.type === 'inject_dialogue') {
        const dialogues = _pickDialogue(consequence, context)
        if (dialogues && dialogues.length > 0) {
          pendingNarrativeEvents.value.push({
            event: event.event,
            dialogues,
            timestamp: Date.now(),
          })
        }
      }
    }
  }

  function _pickDialogue(consequence, context) {
    const speakingChar = _engineRef?.speaker.value?.id || context.character
    if (consequence.variants && speakingChar && consequence.variants[speakingChar]) {
      return consequence.variants[speakingChar]
    }
    if (consequence.generic) {
      return consequence.generic
    }
    if (consequence.variants) {
      const chars = Object.keys(consequence.variants)
      const pick = chars[Math.floor(Math.random() * chars.length)]
      return consequence.variants[pick]
    }
    return null
  }

  function consumePendingEvents() {
    const events = [...pendingNarrativeEvents.value]
    pendingNarrativeEvents.value = []
    return events
  }

  function getStoryBranchScore(dimension) {
    const evaluator = STORY_BRANCH_EVALUATORS[dimension]
    if (!evaluator) return 50

    const recent = codeStoryArc.storyMoments.slice(-10)
    if (recent.length === 0) return 50

    return Math.round(recent.reduce((sum, m) => sum + (m[dimension] || 50), 0) / recent.length)
  }

  function getCodePersonality() {
    return {
      style: codeStoryArc.dominantStyle,
      successRate: codeStoryArc.successRate,
      creativity: codeStoryArc.peakCreativity,
      emotion: codeStoryArc.peakEmotion,
      totalExecutions: codeStoryArc.totalExecutions,
    }
  }

  function shouldTriggerBranch(conditions) {
    if (conditions.minQuality && getStoryBranchScore('code_quality') < conditions.minQuality) return false
    if (conditions.minCreativity && getStoryBranchScore('creativity') < conditions.minCreativity) return false
    if (conditions.minEmotion && getStoryBranchScore('emotional_intent') < conditions.minEmotion) return false
    if (conditions.style && codeStoryArc.dominantStyle !== conditions.style) return false
    if (conditions.minExecutions && codeStoryArc.totalExecutions < conditions.minExecutions) return false
    return true
  }

  function getState() {
    return {
      triggerHistory: { ...triggerHistory },
      codeStoryArc: JSON.parse(JSON.stringify(codeStoryArc)),
    }
  }

  function restoreState(state) {
    if (!state) return
    if (state.triggerHistory) Object.assign(triggerHistory, state.triggerHistory)
    if (state.codeStoryArc) Object.assign(codeStoryArc, state.codeStoryArc)
  }

  return {
    bridge,
    evaluateCode,
    consumePendingEvents,
    getStoryBranchScore,
    getCodePersonality,
    shouldTriggerBranch,
    pendingNarrativeEvents,
    codeStoryArc,
    getState,
    restoreState,
  }
}
