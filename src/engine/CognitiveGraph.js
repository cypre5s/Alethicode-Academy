import { ref, reactive, computed } from 'vue'

const CONCEPT_TAXONOMY = {
  variables:       { id: 'variables',       label: '变量', domain: 'basics', prerequisites: [], tier: 0 },
  data_types:      { id: 'data_types',      label: '数据类型', domain: 'basics', prerequisites: ['variables'], tier: 0 },
  strings:         { id: 'strings',         label: '字符串', domain: 'basics', prerequisites: ['variables', 'data_types'], tier: 0 },
  numbers:         { id: 'numbers',         label: '数值运算', domain: 'basics', prerequisites: ['variables', 'data_types'], tier: 0 },
  print_io:        { id: 'print_io',        label: '输入输出', domain: 'basics', prerequisites: ['variables'], tier: 0 },
  operators:       { id: 'operators',       label: '运算符', domain: 'basics', prerequisites: ['variables', 'data_types'], tier: 0 },
  booleans:        { id: 'booleans',        label: '布尔逻辑', domain: 'control', prerequisites: ['operators'], tier: 1 },
  if_else:         { id: 'if_else',         label: '条件判断', domain: 'control', prerequisites: ['booleans'], tier: 1 },
  for_loop:        { id: 'for_loop',        label: 'for 循环', domain: 'loops', prerequisites: ['variables', 'if_else'], tier: 1 },
  while_loop:      { id: 'while_loop',      label: 'while 循环', domain: 'loops', prerequisites: ['booleans', 'for_loop'], tier: 1 },
  range_func:      { id: 'range_func',      label: 'range() 函数', domain: 'loops', prerequisites: ['for_loop'], tier: 1 },
  lists:           { id: 'lists',           label: '列表', domain: 'data_structures', prerequisites: ['variables', 'for_loop'], tier: 2 },
  list_methods:    { id: 'list_methods',    label: '列表方法', domain: 'data_structures', prerequisites: ['lists'], tier: 2 },
  indexing:        { id: 'indexing',         label: '索引与切片', domain: 'data_structures', prerequisites: ['lists', 'strings'], tier: 2 },
  dictionaries:    { id: 'dictionaries',    label: '字典', domain: 'data_structures', prerequisites: ['lists'], tier: 2 },
  tuples:          { id: 'tuples',          label: '元组', domain: 'data_structures', prerequisites: ['lists'], tier: 2 },
  functions:       { id: 'functions',       label: '函数定义', domain: 'functions', prerequisites: ['variables', 'for_loop'], tier: 2 },
  parameters:      { id: 'parameters',      label: '参数与返回值', domain: 'functions', prerequisites: ['functions'], tier: 2 },
  scope:           { id: 'scope',           label: '作用域', domain: 'functions', prerequisites: ['functions', 'variables'], tier: 2 },
  string_methods:  { id: 'string_methods',  label: '字符串方法', domain: 'strings', prerequisites: ['strings', 'functions'], tier: 2 },
  f_strings:       { id: 'f_strings',       label: 'f-string格式化', domain: 'strings', prerequisites: ['strings', 'variables'], tier: 1 },
  list_comp:       { id: 'list_comp',       label: '列表推导式', domain: 'advanced', prerequisites: ['lists', 'for_loop', 'if_else'], tier: 3 },
  nested_loops:    { id: 'nested_loops',    label: '嵌套循环', domain: 'advanced', prerequisites: ['for_loop'], tier: 2 },
  recursion:       { id: 'recursion',       label: '递归', domain: 'advanced', prerequisites: ['functions', 'if_else'], tier: 3 },
  file_io:         { id: 'file_io',         label: '文件读写', domain: 'advanced', prerequisites: ['strings', 'functions'], tier: 3 },
  error_handling:  { id: 'error_handling',  label: '异常处理', domain: 'advanced', prerequisites: ['functions'], tier: 3 },
  classes:         { id: 'classes',         label: '类与对象', domain: 'oop', prerequisites: ['functions', 'dictionaries'], tier: 3 },
  inheritance:     { id: 'inheritance',     label: '继承', domain: 'oop', prerequisites: ['classes'], tier: 3 },
  lambda_funcs:    { id: 'lambda_funcs',    label: 'Lambda表达式', domain: 'advanced', prerequisites: ['functions', 'list_comp'], tier: 3 },
  modules:         { id: 'modules',         label: '模块导入', domain: 'advanced', prerequisites: ['functions'], tier: 3 },
  algorithms:      { id: 'algorithms',      label: '基础算法', domain: 'algorithms', prerequisites: ['lists', 'for_loop', 'functions'], tier: 3 },
  sorting:         { id: 'sorting',         label: '排序算法', domain: 'algorithms', prerequisites: ['algorithms', 'lists'], tier: 3 },
  debugging:       { id: 'debugging',       label: '调试技巧', domain: 'meta', prerequisites: ['print_io', 'if_else'], tier: 1 },
  code_reading:    { id: 'code_reading',    label: '代码阅读', domain: 'meta', prerequisites: ['variables', 'for_loop'], tier: 1 },
  problem_solving: { id: 'problem_solving', label: '问题分解', domain: 'meta', prerequisites: ['functions', 'if_else'], tier: 2 },
}

const DOMAIN_COLORS = {
  basics: '#4FC3F7',
  control: '#FFB74D',
  loops: '#FF7043',
  data_structures: '#AB47BC',
  functions: '#66BB6A',
  strings: '#26C6DA',
  advanced: '#EF5350',
  oop: '#EC407A',
  algorithms: '#FFA726',
  meta: '#78909C',
}

const STATE_THRESHOLDS = {
  dark:       { soloPassRate: 0, transferScore: 0, exposure: 0 },
  flickering: { soloPassRate: 0.3, transferScore: 0, exposure: 2 },
  lit:        { soloPassRate: 0.5, transferScore: 0.4, exposure: 5, applicationDiversity: 2 },
  blazing:    { soloPassRate: 0.8, transferScore: 0.7, exposure: 10, applicationDiversity: 4, explanationDepth: 0.6 },
}

function _createConceptNode(conceptDef) {
  return {
    id: conceptDef.id,
    label: conceptDef.label,
    domain: conceptDef.domain,
    tier: conceptDef.tier,
    prerequisites: [...conceptDef.prerequisites],
    connections: [],
    metrics: {
      exposure: 0,
      soloPassRate: 0,
      transferScore: 0,
      explanationDepth: 0,
      applicationDiversity: 0,
      lastActivation: null,
      activationPattern: [],
      totalAttempts: 0,
      soloPassCount: 0,
      assistedPassCount: 0,
      failCount: 0,
      contexts: [],
    },
    state: 'dark',
    stateHistory: [],
    sparkMoment: null,
  }
}

function _computeState(metrics) {
  const { soloPassRate, transferScore, exposure, applicationDiversity, explanationDepth } = metrics

  if (soloPassRate >= STATE_THRESHOLDS.blazing.soloPassRate &&
      transferScore >= STATE_THRESHOLDS.blazing.transferScore &&
      exposure >= STATE_THRESHOLDS.blazing.exposure &&
      applicationDiversity >= STATE_THRESHOLDS.blazing.applicationDiversity &&
      explanationDepth >= STATE_THRESHOLDS.blazing.explanationDepth) {
    return 'blazing'
  }

  if (soloPassRate >= STATE_THRESHOLDS.lit.soloPassRate &&
      transferScore >= STATE_THRESHOLDS.lit.transferScore &&
      exposure >= STATE_THRESHOLDS.lit.exposure &&
      applicationDiversity >= (STATE_THRESHOLDS.lit.applicationDiversity || 0)) {
    return 'lit'
  }

  if (exposure >= STATE_THRESHOLDS.flickering.exposure ||
      soloPassRate >= STATE_THRESHOLDS.flickering.soloPassRate) {
    if (soloPassRate >= 0.8 && transferScore < 0.2) {
      return 'flickering'
    }
    return 'flickering'
  }

  return 'dark'
}

export function useCognitiveGraph() {
  const nodes = reactive({})
  const isInitialized = ref(false)

  function initialize() {
    for (const [id, def] of Object.entries(CONCEPT_TAXONOMY)) {
      nodes[id] = _createConceptNode(def)
    }

    for (const node of Object.values(nodes)) {
      for (const prereqId of node.prerequisites) {
        if (nodes[prereqId] && !nodes[prereqId].connections.includes(node.id)) {
          nodes[prereqId].connections.push(node.id)
        }
        if (!node.connections.includes(prereqId)) {
          node.connections.push(prereqId)
        }
      }
    }

    isInitialized.value = true
  }

  function recordExposure(conceptId, context = {}) {
    const node = nodes[conceptId]
    if (!node) return

    node.metrics.exposure++
    node.metrics.lastActivation = Date.now()
    node.metrics.activationPattern.push(Date.now())
    if (node.metrics.activationPattern.length > 50) {
      node.metrics.activationPattern.splice(0, node.metrics.activationPattern.length - 50)
    }

    if (context.contextType && !node.metrics.contexts.includes(context.contextType)) {
      node.metrics.contexts.push(context.contextType)
      node.metrics.applicationDiversity = node.metrics.contexts.length
    }

    _updateState(node)
  }

  function recordOutcome(conceptId, outcome, context = {}) {
    const node = nodes[conceptId]
    if (!node) return

    node.metrics.totalAttempts++
    node.metrics.exposure++
    node.metrics.lastActivation = Date.now()

    if (outcome === 'solo_pass' || outcome === 'excellent_teach') {
      node.metrics.soloPassCount++
    } else if (outcome === 'assisted_pass' || outcome === 'accurate_teach') {
      node.metrics.assistedPassCount++
    } else {
      node.metrics.failCount++
    }

    node.metrics.soloPassRate = node.metrics.totalAttempts > 0
      ? node.metrics.soloPassCount / node.metrics.totalAttempts
      : 0

    if (context.contextType && !node.metrics.contexts.includes(context.contextType)) {
      node.metrics.contexts.push(context.contextType)
      node.metrics.applicationDiversity = node.metrics.contexts.length
    }

    if (context.isTransferApplication) {
      const transferAttempts = node.metrics.contexts.filter(c => c.startsWith('transfer_')).length
      node.metrics.transferScore = Math.min(1, transferAttempts * 0.25 + (outcome.includes('pass') ? 0.2 : 0))
    }

    _updateState(node)
  }

  function recordTeachBack(conceptId, quality) {
    const node = nodes[conceptId]
    if (!node) return

    const normalized = Math.min(1, Math.max(0, quality / 5))
    const alpha = 0.4
    node.metrics.explanationDepth = node.metrics.explanationDepth * (1 - alpha) + normalized * alpha

    node.metrics.transferScore = Math.min(1,
      node.metrics.transferScore + (quality >= 4 ? 0.15 : quality >= 3 ? 0.05 : -0.05)
    )

    _updateState(node)
  }

  function recordTransfer(fromConceptId, toConceptId) {
    const from = nodes[fromConceptId]
    const to = nodes[toConceptId]
    if (!from || !to) return

    from.metrics.transferScore = Math.min(1, from.metrics.transferScore + 0.15)
    if (!from.metrics.contexts.includes(`transfer_${toConceptId}`)) {
      from.metrics.contexts.push(`transfer_${toConceptId}`)
      from.metrics.applicationDiversity = from.metrics.contexts.length
    }

    _updateState(from)
    recordExposure(toConceptId, { contextType: `transfer_from_${fromConceptId}` })
  }

  const _transitionCallbacks = []

  function onConceptTransition(fn) {
    _transitionCallbacks.push(fn)
  }

  function _updateState(node) {
    const oldState = node.state
    const newState = _computeState(node.metrics)

    if (newState !== oldState) {
      node.state = newState
      node.stateHistory.push({ from: oldState, to: newState, timestamp: Date.now() })

      if ((oldState === 'dark' || oldState === 'flickering') && (newState === 'lit' || newState === 'blazing')) {
        node.sparkMoment = {
          timestamp: Date.now(),
          fromState: oldState,
          toState: newState,
          metrics: { ...node.metrics },
        }
      }

      for (const cb of _transitionCallbacks) {
        try { cb(node.id, oldState, newState) } catch { /* */ }
      }
    }
  }

  function getConceptState(conceptId) {
    return nodes[conceptId]?.state || 'dark'
  }

  function getConceptMetrics(conceptId) {
    return nodes[conceptId]?.metrics || null
  }

  function arePrerequisitesMet(conceptId) {
    const node = nodes[conceptId]
    if (!node) return false
    return node.prerequisites.every(prereqId => {
      const prereq = nodes[prereqId]
      return prereq && (prereq.state === 'lit' || prereq.state === 'blazing')
    })
  }

  function getReadyConcepts() {
    return Object.values(nodes).filter(node =>
      node.state === 'dark' && arePrerequisitesMet(node.id)
    )
  }

  function getFlickeringConcepts() {
    return Object.values(nodes).filter(n => n.state === 'flickering')
  }

  function getZoneOfProximalDevelopment() {
    const zpd = []
    for (const node of Object.values(nodes)) {
      if (node.state === 'dark' || node.state === 'flickering') {
        const prereqStates = node.prerequisites.map(pid => nodes[pid]?.state || 'dark')
        const litPrereqs = prereqStates.filter(s => s === 'lit' || s === 'blazing').length
        const totalPrereqs = node.prerequisites.length

        if (totalPrereqs === 0 || litPrereqs / totalPrereqs >= 0.5) {
          const readiness = totalPrereqs === 0 ? 1 : litPrereqs / totalPrereqs
          const flickeringBonus = node.state === 'flickering' ? 0.3 : 0
          zpd.push({
            conceptId: node.id,
            label: node.label,
            domain: node.domain,
            readiness: readiness + flickeringBonus,
            currentState: node.state,
            missingPrereqs: node.prerequisites.filter(pid => {
              const s = nodes[pid]?.state
              return s !== 'lit' && s !== 'blazing'
            }),
          })
        }
      }
    }
    return zpd.sort((a, b) => b.readiness - a.readiness)
  }

  function getRecentSparks(since = Date.now() - 3600000) {
    const sparks = []
    for (const node of Object.values(nodes)) {
      if (node.sparkMoment && node.sparkMoment.timestamp >= since) {
        sparks.push({ conceptId: node.id, label: node.label, ...node.sparkMoment })
      }
    }
    return sparks.sort((a, b) => b.timestamp - a.timestamp)
  }

  function getDomainMastery() {
    const domains = {}
    for (const node of Object.values(nodes)) {
      if (!domains[node.domain]) {
        domains[node.domain] = { total: 0, dark: 0, flickering: 0, lit: 0, blazing: 0, color: DOMAIN_COLORS[node.domain] || '#888' }
      }
      domains[node.domain].total++
      domains[node.domain][node.state]++
    }

    const result = {}
    for (const [domain, counts] of Object.entries(domains)) {
      const mastery = (counts.lit * 0.7 + counts.blazing * 1.0 + counts.flickering * 0.2) / counts.total
      result[domain] = { ...counts, mastery: Math.round(mastery * 100) / 100 }
    }
    return result
  }

  function getGraphVisualizationData() {
    const vizNodes = []
    const vizEdges = []

    for (const node of Object.values(nodes)) {
      const intensity = {
        dark: 0,
        flickering: 0.3 + Math.sin(Date.now() / 500) * 0.15,
        lit: 0.7,
        blazing: 1.0,
      }[node.state]

      vizNodes.push({
        id: node.id,
        label: node.label,
        domain: node.domain,
        tier: node.tier,
        state: node.state,
        intensity,
        color: DOMAIN_COLORS[node.domain] || '#888',
        metrics: {
          exposure: node.metrics.exposure,
          soloPassRate: node.metrics.soloPassRate,
          transferScore: node.metrics.transferScore,
        },
        hasSpark: !!node.sparkMoment,
      })
    }

    const edgeSet = new Set()
    for (const node of Object.values(nodes)) {
      for (const connId of node.connections) {
        const edgeKey = [node.id, connId].sort().join('--')
        if (!edgeSet.has(edgeKey)) {
          edgeSet.add(edgeKey)
          const sourceState = node.state
          const targetState = nodes[connId]?.state || 'dark'
          const bothLit = (sourceState === 'lit' || sourceState === 'blazing') &&
                          (targetState === 'lit' || targetState === 'blazing')
          vizEdges.push({
            source: node.id,
            target: connId,
            strength: bothLit ? 1 : (sourceState !== 'dark' && targetState !== 'dark') ? 0.5 : 0.1,
            active: bothLit,
          })
        }
      }
    }

    return { nodes: vizNodes, edges: vizEdges }
  }

  function buildCognitivePromptCard(characterId) {
    const flickering = getFlickeringConcepts()
    const recentSparks = getRecentSparks(Date.now() - 7200000)
    const zpd = getZoneOfProximalDevelopment().slice(0, 5)
    const domainMastery = getDomainMastery()

    const lines = ['【认知图谱卡】']

    if (recentSparks.length > 0) {
      lines.push(`🔥 最近顿悟：${recentSparks.map(s => `${s.label}(${s.fromState}→${s.toState})`).join('、')}`)
      lines.push('如果自然且合适，可以庆祝/提及这个突破。')
    }

    if (flickering.length > 0) {
      lines.push(`⚡ 似懂非懂（flickering）：${flickering.map(n => n.label).join('、')}`)
      lines.push('这些概念玩家能答对但可能未真正理解——可以温柔地试探真实理解。')
    }

    if (zpd.length > 0) {
      lines.push(`🎯 最近发展区：${zpd.map(z => `${z.label}(就绪度${Math.round(z.readiness * 100)}%)`).join('、')}`)
    }

    const strongDomains = Object.entries(domainMastery)
      .filter(([, v]) => v.mastery >= 0.6)
      .map(([k, v]) => `${k}(${Math.round(v.mastery * 100)}%)`)
    if (strongDomains.length > 0) {
      lines.push(`✅ 强势领域：${strongDomains.join('、')}`)
    }

    const weakDomains = Object.entries(domainMastery)
      .filter(([, v]) => v.mastery < 0.3 && v.total > 0)
      .map(([k]) => k)
    if (weakDomains.length > 0) {
      lines.push(`📚 待加强领域：${weakDomains.join('、')}`)
    }

    return lines.join('\n')
  }

  function getOverallProgress() {
    const total = Object.keys(nodes).length
    const counts = { dark: 0, flickering: 0, lit: 0, blazing: 0 }
    for (const node of Object.values(nodes)) {
      counts[node.state]++
    }
    return {
      total,
      ...counts,
      mastery: total > 0 ? Math.round(((counts.lit * 0.7 + counts.blazing) / total) * 100) : 0,
    }
  }

  function mapChallengeToConcepts(challengeId, knowledgeDomain) {
    const domainToConceptMap = {
      variables: ['variables', 'data_types'],
      io: ['print_io', 'variables'],
      strings: ['strings', 'string_methods', 'f_strings'],
      conditionals: ['if_else', 'booleans', 'operators'],
      loops: ['for_loop', 'while_loop', 'range_func'],
      lists: ['lists', 'list_methods', 'indexing'],
      functions: ['functions', 'parameters', 'scope'],
      data_structures: ['lists', 'dictionaries', 'tuples'],
      algorithms: ['algorithms', 'sorting'],
      oop: ['classes', 'inheritance'],
      advanced: ['list_comp', 'recursion', 'error_handling'],
      debugging: ['debugging', 'code_reading'],
    }
    return domainToConceptMap[knowledgeDomain] || []
  }

  function getState() {
    const serialized = {}
    for (const [id, node] of Object.entries(nodes)) {
      serialized[id] = {
        metrics: { ...node.metrics },
        state: node.state,
        stateHistory: node.stateHistory.slice(-10),
        sparkMoment: node.sparkMoment,
      }
    }
    return serialized
  }

  function restoreState(state) {
    if (!state) return
    for (const [id, saved] of Object.entries(state)) {
      if (nodes[id]) {
        Object.assign(nodes[id].metrics, saved.metrics || {})
        nodes[id].state = saved.state || 'dark'
        nodes[id].stateHistory = saved.stateHistory || []
        nodes[id].sparkMoment = saved.sparkMoment || null
      }
    }
  }

  return {
    nodes,
    isInitialized,
    initialize,

    recordExposure,
    recordOutcome,
    recordTeachBack,
    recordTransfer,

    getConceptState,
    getConceptMetrics,
    arePrerequisitesMet,
    getReadyConcepts,
    getFlickeringConcepts,
    getZoneOfProximalDevelopment,
    getRecentSparks,
    getDomainMastery,
    getOverallProgress,
    getGraphVisualizationData,

    mapChallengeToConcepts,
    buildCognitivePromptCard,
    onConceptTransition,

    getState,
    restoreState,

    CONCEPT_TAXONOMY,
    DOMAIN_COLORS,
  }
}
