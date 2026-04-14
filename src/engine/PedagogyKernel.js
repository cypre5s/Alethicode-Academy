import { ref, reactive, computed } from 'vue'

const CONCEPT_CONSTRAINTS = [
  { concept: 'variables',       prerequisites: [] },
  { concept: 'data_types',      prerequisites: ['variables'] },
  { concept: 'strings',         prerequisites: ['variables', 'data_types'] },
  { concept: 'numbers',         prerequisites: ['variables', 'data_types'] },
  { concept: 'print_io',        prerequisites: ['variables'] },
  { concept: 'operators',       prerequisites: ['variables', 'data_types'] },
  { concept: 'booleans',        prerequisites: ['operators'] },
  { concept: 'if_else',         prerequisites: ['booleans'] },
  { concept: 'for_loop',        prerequisites: ['variables', 'if_else'] },
  { concept: 'while_loop',      prerequisites: ['booleans', 'for_loop'] },
  { concept: 'range_func',      prerequisites: ['for_loop'] },
  { concept: 'lists',           prerequisites: ['variables', 'for_loop'] },
  { concept: 'list_methods',    prerequisites: ['lists'] },
  { concept: 'indexing',        prerequisites: ['lists', 'strings'] },
  { concept: 'dictionaries',    prerequisites: ['lists'] },
  { concept: 'functions',       prerequisites: ['variables', 'for_loop'] },
  { concept: 'parameters',      prerequisites: ['functions'] },
  { concept: 'scope',           prerequisites: ['functions', 'variables'] },
  { concept: 'f_strings',       prerequisites: ['strings', 'variables'] },
  { concept: 'string_methods',  prerequisites: ['strings', 'functions'] },
  { concept: 'list_comp',       prerequisites: ['lists', 'for_loop', 'if_else'] },
  { concept: 'nested_loops',    prerequisites: ['for_loop'] },
  { concept: 'recursion',       prerequisites: ['functions', 'if_else'] },
  { concept: 'error_handling',  prerequisites: ['functions'] },
  { concept: 'classes',         prerequisites: ['functions', 'dictionaries'] },
  { concept: 'algorithms',      prerequisites: ['lists', 'for_loop', 'functions'] },
  { concept: 'debugging',       prerequisites: ['print_io', 'if_else'] },
  { concept: 'code_reading',    prerequisites: ['variables', 'for_loop'] },
  { concept: 'problem_solving', prerequisites: ['functions', 'if_else'] },
]

const CHAPTER_GOALS = {
  prologue: ['variables', 'print_io'],
  chapter1: ['variables', 'strings', 'numbers', 'print_io', 'data_types', 'operators'],
  chapter2: ['booleans', 'if_else', 'for_loop', 'while_loop', 'range_func', 'lists', 'debugging'],
  chapter3: ['functions', 'parameters', 'scope', 'list_methods', 'dictionaries', 'algorithms', 'list_comp'],
}

const SCENE_CONCEPT_AFFINITY = {
  computer_room: ['for_loop', 'while_loop', 'algorithms', 'debugging', 'functions', 'lists'],
  classroom:     ['variables', 'data_types', 'operators', 'booleans', 'if_else', 'print_io'],
  library:       ['code_reading', 'strings', 'string_methods', 'dictionaries', 'classes'],
  rooftop:       ['problem_solving', 'recursion', 'scope', 'list_comp'],
  player_room:   ['debugging', 'error_handling', 'code_reading', 'functions'],
  cafeteria:     ['strings', 'f_strings', 'print_io', 'lists'],
  school_gate:   ['variables', 'print_io', 'data_types'],
  school_yard:   ['for_loop', 'lists', 'nested_loops'],
  hallway:       ['if_else', 'booleans', 'operators'],
  festival:      ['algorithms', 'list_comp', 'functions', 'recursion'],
}

const CHARACTER_TEACHING_STRENGTHS = {
  nene:     ['variables', 'print_io', 'strings', 'for_loop', 'functions', 'debugging'],
  yoshino:  ['data_types', 'scope', 'classes', 'error_handling', 'code_reading', 'algorithms'],
  ayase:    ['for_loop', 'while_loop', 'algorithms', 'nested_loops', 'recursion', 'list_comp'],
  kanna:    ['recursion', 'list_comp', 'problem_solving', 'algorithms', 'scope'],
  murasame: ['classes', 'error_handling', 'algorithms', 'debugging', 'problem_solving', 'scope'],
}

const CHALLENGE_TEMPLATES = {
  concept_intro: {
    difficulty: 'easy',
    types: ['multiple_choice', 'fill_blank'],
    purpose: '初次接触概念',
  },
  reinforcement: {
    difficulty: 'medium',
    types: ['code_order', 'fill_blank', 'code_writing'],
    purpose: '巩固已有认知',
  },
  transfer: {
    difficulty: 'medium',
    types: ['creative_code', 'teach_back'],
    purpose: '迁移应用到新场景',
  },
  mastery: {
    difficulty: 'hard',
    types: ['pair_debug', 'creative_code', 'code_writing'],
    purpose: '深度理解验证',
  },
  review: {
    difficulty: 'adaptive',
    types: ['multiple_choice', 'fill_blank', 'code_writing'],
    purpose: '间隔复习',
  },
}

const EMOTION_TEACHING_MAP = {
  focused:    { preferTypes: ['code_writing', 'code_order'], avoidTypes: ['creative_code'], intensityMultiplier: 1.2 },
  happy:      { preferTypes: ['creative_code', 'teach_back'], avoidTypes: [], intensityMultiplier: 1.0 },
  confused:   { preferTypes: ['multiple_choice', 'fill_blank'], avoidTypes: ['code_writing', 'pair_debug'], intensityMultiplier: 0.7 },
  bored:      { preferTypes: ['creative_code', 'pair_debug'], avoidTypes: ['multiple_choice'], intensityMultiplier: 1.3 },
  frustrated: { preferTypes: ['fill_blank', 'multiple_choice'], avoidTypes: ['code_writing', 'pair_debug'], intensityMultiplier: 0.5 },
  neutral:    { preferTypes: [], avoidTypes: [], intensityMultiplier: 1.0 },
}

export function usePedagogyKernel() {
  const isInitialized = ref(false)
  const currentRecommendation = ref(null)
  const teachingLog = reactive([])
  const dynamicChallengeQueue = reactive([])

  let _cognitiveGraph = null
  let _affectiveResonance = null
  let _spacedRepetition = null
  let _llmManager = null
  let _behaviorProfiler = null

  function initialize(dependencies) {
    _cognitiveGraph = dependencies.cognitiveGraph || null
    _affectiveResonance = dependencies.affectiveResonance || null
    _spacedRepetition = dependencies.spacedRepetition || null
    _llmManager = dependencies.llmManager || null
    _behaviorProfiler = dependencies.behaviorProfiler || null
    isInitialized.value = true
  }

  function decideWhatToTeach(gameContext) {
    const { chapter, location, character, timeSlot } = gameContext

    const signals = _gatherSignals(gameContext)
    const candidates = _generateCandidates(signals, gameContext)
    const scored = _scoreCandidates(candidates, signals, gameContext)

    if (scored.length === 0) return null

    const best = scored[0]
    const recommendation = {
      concept: best.conceptId,
      label: best.label,
      score: best.score,
      reason: best.reason,
      templateType: best.templateType,
      challengeType: best.challengeType,
      difficulty: best.difficulty,
      character: best.bestCharacter || character,
      signals: best.signalSummary,
      timestamp: Date.now(),
    }

    currentRecommendation.value = recommendation
    teachingLog.push(recommendation)
    if (teachingLog.length > 100) teachingLog.splice(0, teachingLog.length - 100)

    return recommendation
  }

  function _gatherSignals(gameContext) {
    const signals = {
      readyConcepts: [],
      flickeringConcepts: [],
      zpd: [],
      chapterGoals: [],
      sceneAffinity: [],
      dueReviews: [],
      emotion: 'neutral',
      emotionMultiplier: 1.0,
      preferTypes: [],
      avoidTypes: [],
      playerBoldness: 0.5,
    }

    if (_cognitiveGraph) {
      signals.readyConcepts = _cognitiveGraph.getReadyConcepts().map(n => n.id)
      signals.flickeringConcepts = _cognitiveGraph.getFlickeringConcepts().map(n => n.id)
      signals.zpd = _cognitiveGraph.getZoneOfProximalDevelopment()
    }

    const chapter = gameContext.chapter || 'prologue'
    const goals = CHAPTER_GOALS[chapter] || CHAPTER_GOALS[chapter.split('_')[0]] || []
    signals.chapterGoals = goals

    const location = _extractLocation(gameContext.location || gameContext.currentBg || '')
    signals.sceneAffinity = SCENE_CONCEPT_AFFINITY[location] || []

    if (_spacedRepetition) {
      const due = _spacedRepetition.getDueReviews(chapter)
      signals.dueReviews = due.map(d => d.domain || d.challengeId)
    }

    if (_affectiveResonance) {
      const emotion = _affectiveResonance.getDominantEmotion?.() || 'neutral'
      signals.emotion = emotion
      const emotionMap = EMOTION_TEACHING_MAP[emotion] || EMOTION_TEACHING_MAP.neutral
      signals.emotionMultiplier = emotionMap.intensityMultiplier
      signals.preferTypes = emotionMap.preferTypes
      signals.avoidTypes = emotionMap.avoidTypes
    }

    if (_behaviorProfiler) {
      const profile = _behaviorProfiler.getProfileSnapshot?.()
      signals.playerBoldness = profile?.boldness ?? 0.5
    }

    return signals
  }

  function _generateCandidates(signals, gameContext) {
    const candidates = []
    const chapter = gameContext.chapter || 'prologue'

    for (const conceptId of signals.readyConcepts) {
      if (signals.chapterGoals.includes(conceptId)) {
        candidates.push({
          conceptId,
          label: _cognitiveGraph?.nodes?.[conceptId]?.label || conceptId,
          templateType: 'concept_intro',
          reason: '前置已通电 + 章节目标',
          priority: 3,
        })
      }
    }

    for (const conceptId of signals.flickeringConcepts) {
      candidates.push({
        conceptId,
        label: _cognitiveGraph?.nodes?.[conceptId]?.label || conceptId,
        templateType: 'transfer',
        reason: '似懂非懂——需要迁移验证',
        priority: 4,
      })
    }

    for (const zpdItem of signals.zpd.slice(0, 5)) {
      if (!candidates.find(c => c.conceptId === zpdItem.conceptId)) {
        candidates.push({
          conceptId: zpdItem.conceptId,
          label: zpdItem.label,
          templateType: zpdItem.currentState === 'flickering' ? 'reinforcement' : 'concept_intro',
          reason: `最近发展区 (就绪度${Math.round(zpdItem.readiness * 100)}%)`,
          priority: 2 + zpdItem.readiness,
        })
      }
    }

    for (const conceptId of signals.sceneAffinity) {
      const existing = candidates.find(c => c.conceptId === conceptId)
      if (existing) {
        existing.priority += 1.5
        existing.reason += ' + 场景契合'
      }
    }

    for (const reviewDomain of signals.dueReviews) {
      const mapped = _mapDomainToConcepts(reviewDomain)
      for (const conceptId of mapped) {
        const existing = candidates.find(c => c.conceptId === conceptId)
        if (existing) {
          existing.priority += 1
          existing.reason += ' + 间隔复习到期'
        } else {
          candidates.push({
            conceptId,
            label: _cognitiveGraph?.nodes?.[conceptId]?.label || conceptId,
            templateType: 'review',
            reason: '间隔复习到期',
            priority: 2,
          })
        }
      }
    }

    return candidates
  }

  function _scoreCandidates(candidates, signals, gameContext) {
    const character = gameContext.character || 'nene'

    return candidates.map(candidate => {
      let score = candidate.priority || 1

      score *= signals.emotionMultiplier

      const charStrengths = CHARACTER_TEACHING_STRENGTHS[character] || []
      if (charStrengths.includes(candidate.conceptId)) {
        score += 2
      }

      const template = CHALLENGE_TEMPLATES[candidate.templateType]
      if (template) {
        const availableTypes = template.types.filter(t => !signals.avoidTypes.includes(t))
        const preferred = availableTypes.filter(t => signals.preferTypes.includes(t))
        const challengeType = preferred.length > 0
          ? preferred[Math.floor(Math.random() * preferred.length)]
          : availableTypes[Math.floor(Math.random() * availableTypes.length)]

        candidate.challengeType = challengeType
        candidate.difficulty = template.difficulty === 'adaptive'
          ? _computeAdaptiveDifficulty(candidate.conceptId)
          : template.difficulty
      }

      candidate.bestCharacter = _findBestTeacher(candidate.conceptId, character)

      const recentlyTaught = teachingLog.slice(-5).find(t => t.concept === candidate.conceptId)
      if (recentlyTaught && Date.now() - recentlyTaught.timestamp < 300000) {
        score *= 0.3
      }

      candidate.score = Math.round(score * 100) / 100
      candidate.signalSummary = {
        emotion: signals.emotion,
        emotionMultiplier: signals.emotionMultiplier,
        isChapterGoal: signals.chapterGoals.includes(candidate.conceptId),
        isSceneAffinity: signals.sceneAffinity.includes(candidate.conceptId),
        isDueReview: signals.dueReviews.some(d => _mapDomainToConcepts(d).includes(candidate.conceptId)),
      }

      return candidate
    })
    .sort((a, b) => b.score - a.score)
  }

  function _computeAdaptiveDifficulty(conceptId) {
    if (!_cognitiveGraph) return 'medium'
    const state = _cognitiveGraph.getConceptState(conceptId)
    if (state === 'dark') return 'easy'
    if (state === 'flickering') return 'medium'
    if (state === 'lit') return 'medium'
    return 'hard'
  }

  function _findBestTeacher(conceptId, defaultChar) {
    let bestChar = defaultChar
    let bestScore = 0

    for (const [charId, strengths] of Object.entries(CHARACTER_TEACHING_STRENGTHS)) {
      const idx = strengths.indexOf(conceptId)
      if (idx >= 0) {
        const score = strengths.length - idx
        if (score > bestScore) {
          bestScore = score
          bestChar = charId
        }
      }
    }
    return bestChar
  }

  function _mapDomainToConcepts(domain) {
    if (_cognitiveGraph?.mapChallengeToConcepts) {
      const mapped = _cognitiveGraph.mapChallengeToConcepts('', domain)
      if (mapped.length > 0) return mapped
    }
    return [domain]
  }

  function _extractLocation(bgId) {
    return String(bgId || '').replace(/_(day|evening|night)$/, '')
  }

  async function generateDynamicChallenge(recommendation, gameState) {
    if (!_llmManager || !_llmManager.apiKey?.value) {
      return _generateFallbackChallenge(recommendation)
    }

    const concept = recommendation.concept
    const conceptLabel = recommendation.label
    const challengeType = recommendation.challengeType || 'fill_blank'
    const difficulty = recommendation.difficulty || 'medium'
    const character = recommendation.character || 'nene'

    const prompt = `你是一个Python教学挑战题目生成器。根据以下信息生成一道挑战题：

概念：${conceptLabel}（${concept}）
题型：${challengeType}
难度：${difficulty}
关联角色：${character}
章节：${gameState.currentChapter || 'unknown'}
场景：${gameState.currentBg || 'unknown'}

要求：
- 题目必须围绕指定概念
- 难度要匹配指定等级（easy/medium/hard）
- 题目描述应有趣且贴合学园场景
- 如果是 fill_blank：提供带空白的代码和正确答案
- 如果是 multiple_choice：提供4个选项和正确答案索引
- 如果是 code_writing：提供题目描述和测试用例
- 如果是 code_order：提供打乱的代码行和正确顺序
- 如果是 teach_back：提供要解释的概念和评估标准

只输出 JSON：
{
  "title": "题目标题",
  "description": "题目描述（贴合学园场景）",
  "type": "${challengeType}",
  "difficulty": "${difficulty}",
  "knowledge_domain": "${concept}",
  "related_character": "${character}",
  "content": {
    // 根据题型不同：
    // fill_blank: { code_template, blank_answer, hints }
    // multiple_choice: { question, options, correct_index }
    // code_writing: { prompt, test_cases, starter_code }
    // code_order: { lines, correct_order }
    // teach_back: { concept, rubric }
  },
  "hints": ["提示1", "提示2"],
  "successText": "正确时角色的反应",
  "failText": "错误时角色的反应"
}`

    try {
      const endpoint = `${_llmManager.baseUrl.value}/chat/completions`
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 15000)

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${_llmManager.apiKey.value}`,
        },
        signal: controller.signal,
        body: JSON.stringify({
          model: _llmManager.model.value,
          max_tokens: 800,
          temperature: 0.8,
          messages: [
            { role: 'system', content: prompt },
            { role: 'user', content: '生成一道挑战题。' },
          ],
        }),
      })

      clearTimeout(timeoutId)
      if (!response.ok) throw new Error(`HTTP ${response.status}`)

      const data = await response.json()
      const text = data.choices?.[0]?.message?.content || ''
      const cleaned = text.replace(/```json\n?|```/g, '').trim()
      const parsed = JSON.parse(cleaned)

      const challenge = {
        id: `dynamic_${concept}_${Date.now()}`,
        isDynamic: true,
        ...parsed,
        generated_at: Date.now(),
        source_recommendation: recommendation,
      }

      dynamicChallengeQueue.push(challenge)
      return challenge
    } catch (e) {
      console.warn('[PedagogyKernel] Dynamic challenge generation failed:', e.message)
      return _generateFallbackChallenge(recommendation)
    }
  }

  function _generateFallbackChallenge(recommendation) {
    const concept = recommendation.concept
    const label = recommendation.label

    const fallbacks = {
      variables: {
        title: '变量的魔法',
        type: 'fill_blank',
        description: '让我们用变量来保存一些重要的信息',
        content: { code_template: '# 创建一个变量来保存你的名字\nname = ___\nprint(f"你好, {name}!")', blank_answer: '"你的名字"' },
        hints: ['变量就像一个盒子，可以装任何东西', '字符串需要用引号包裹'],
      },
      for_loop: {
        title: '循环的力量',
        type: 'fill_blank',
        description: '用循环来数星星',
        content: { code_template: 'for i in range(___):\n    print(f"第{i+1}颗星 ★")', blank_answer: '5' },
        hints: ['range(n) 会生成 0 到 n-1 的数字', '想想你要数几颗星星'],
      },
      functions: {
        title: '创造你自己的魔法',
        type: 'code_writing',
        description: '定义一个函数，接受一个名字参数，返回问候语',
        content: { prompt: '写一个叫 greet 的函数', test_cases: ['greet("世界") → "你好, 世界!"'], starter_code: 'def greet(name):\n    # 在这里写你的代码\n    pass' },
        hints: ['用 return 返回结果', 'f-string 可以在字符串中嵌入变量'],
      },
    }

    const fallback = fallbacks[concept] || {
      title: `${label}练习`,
      type: 'fill_blank',
      description: `来练习一下${label}吧`,
      content: { code_template: `# ${label}练习\n# 请完成代码\nresult = ___`, blank_answer: '42' },
      hints: [`想想${label}的基本用法`],
    }

    return {
      id: `dynamic_fallback_${concept}_${Date.now()}`,
      isDynamic: true,
      difficulty: recommendation.difficulty || 'easy',
      knowledge_domain: concept,
      related_character: recommendation.character || 'nene',
      ...fallback,
      generated_at: Date.now(),
      source_recommendation: recommendation,
      successText: '做得不错！',
      failText: '没关系，再试试看？',
    }
  }

  function consumeDynamicChallenge() {
    return dynamicChallengeQueue.shift() || null
  }

  function buildPedagogyPromptCard(gameContext) {
    const rec = currentRecommendation.value
    const lines = ['【教学内核卡】']

    if (rec) {
      lines.push(`当前推荐教学概念：${rec.label}（${rec.concept}）`)
      lines.push(`推荐理由：${rec.reason}`)
      lines.push(`推荐题型：${rec.challengeType || '自适应'}`)
      lines.push(`推荐难度：${rec.difficulty || 'medium'}`)
      lines.push(`推荐教学角色：${rec.character || 'nene'}`)

      if (rec.signals) {
        const flags = []
        if (rec.signals.isChapterGoal) flags.push('章节目标')
        if (rec.signals.isSceneAffinity) flags.push('场景契合')
        if (rec.signals.isDueReview) flags.push('复习到期')
        if (flags.length > 0) lines.push(`教学信号：${flags.join(' + ')}`)
        lines.push(`玩家情绪：${rec.signals.emotion}（教学强度×${rec.signals.emotionMultiplier}）`)
      }
    }

    const recentLog = teachingLog.slice(-3)
    if (recentLog.length > 0) {
      lines.push(`近期教学：${recentLog.map(t => t.label).join(' → ')}`)
    }

    lines.push('角色在引导学习时，应遵循推荐概念和难度，但用自己的方式自然表达。')

    return lines.join('\n')
  }

  function getTeachingHistory() {
    return [...teachingLog]
  }

  function getState() {
    return {
      teachingLog: teachingLog.slice(-50),
      currentRecommendation: currentRecommendation.value,
    }
  }

  function restoreState(state) {
    if (!state) return
    if (state.teachingLog) {
      teachingLog.length = 0
      teachingLog.push(...state.teachingLog)
    }
    if (state.currentRecommendation) {
      currentRecommendation.value = state.currentRecommendation
    }
  }

  return {
    isInitialized,
    currentRecommendation,
    teachingLog,
    dynamicChallengeQueue,

    initialize,
    decideWhatToTeach,
    generateDynamicChallenge,
    consumeDynamicChallenge,

    buildPedagogyPromptCard,
    getTeachingHistory,

    getState,
    restoreState,

    CHAPTER_GOALS,
    SCENE_CONCEPT_AFFINITY,
    CHARACTER_TEACHING_STRENGTHS,
  }
}
