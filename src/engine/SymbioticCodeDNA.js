import { reactive, computed } from 'vue'

const CHARACTER_BASE_DNA = {
  nene: {
    base_personality: 'gentle_teacher',
    coding_aesthetic: 'verbose_clear',
    naming_preference: 'snake_case',
    comment_style: 'descriptive',
    structure_preference: ['for_loop', 'if_else', 'basic_functions'],
    debug_approach: 'print_debug',
    teaching_style: 'analogies',
    code_samples: [
      `# 音音觉得代码应该像跟朋友说话一样清晰
student_name = "你"
greeting_message = f"欢迎来到编程的世界，{student_name}！"
print(greeting_message)  # 让每一行都有意义`,
      `# 循环就像每天的日常——重复但每次都有小变化
for day in range(1, 8):
    mood = "开心" if day != 6 else "有点累"
    print(f"第{day}天：{mood}")`,
    ],
  },
  yoshino: {
    base_personality: 'strict_perfectionist',
    coding_aesthetic: 'elegant_concise',
    naming_preference: 'snake_case',
    comment_style: 'minimal',
    structure_preference: ['list_comprehension', 'functions', 'type_hints'],
    debug_approach: 'systematic',
    teaching_style: 'documentation',
    code_samples: [
      `def validate_input(data: list) -> list:
    return [x for x in data if isinstance(x, (int, float)) and x > 0]`,
      `# 代码规范不是可选项
scores = [85, 92, 78, 96, 88]
above_average = sorted(
    [s for s in scores if s > sum(scores) / len(scores)],
    reverse=True
)`,
    ],
  },
  ayase: {
    base_personality: 'competitive_energetic',
    coding_aesthetic: 'speed_optimized',
    naming_preference: 'camelCase',
    comment_style: 'sparse',
    structure_preference: ['while_loop', 'recursion', 'algorithms'],
    debug_approach: 'intuitive',
    teaching_style: 'challenge',
    code_samples: [
      `# 速度就是一切！
def quickSort(arr):
    if len(arr) <= 1: return arr
    pivot = arr[len(arr)//2]
    left = [x for x in arr if x < pivot]
    mid = [x for x in arr if x == pivot]
    right = [x for x in arr if x > pivot]
    return quickSort(left) + mid + quickSort(right)`,
      `# 来比比谁先写完！
result = sum(i**2 for i in range(1, 101) if i % 3 == 0)`,
    ],
  },
  kanna: {
    base_personality: 'quiet_deep_thinker',
    coding_aesthetic: 'minimalist',
    naming_preference: 'short_meaningful',
    comment_style: 'philosophical',
    structure_preference: ['recursion', 'generators', 'functional'],
    debug_approach: 'trace_analysis',
    teaching_style: 'socratic',
    code_samples: [
      `# ……数字里也有美
def fib(n):
    a, b = 0, 1
    for _ in range(n):
        yield a
        a, b = b, a + b`,
      `# 分形。无限中的有限
def fractal(depth, prefix=""):
    if depth == 0:
        return
    print(prefix + "★")
    fractal(depth - 1, prefix + "  ")`,
    ],
  },
  murasame: {
    base_personality: 'elite_challenger',
    coding_aesthetic: 'production_grade',
    naming_preference: 'snake_case',
    comment_style: 'docstring',
    structure_preference: ['classes', 'design_patterns', 'error_handling'],
    debug_approach: 'systematic',
    teaching_style: 'demanding',
    code_samples: [
      `class CodeValidator:
    """代码不是写给机器看的。是写给六个月后的自己看的。"""

    @staticmethod
    def check(code: str) -> dict:
        issues = []
        if len(code.split('\\n')) > 50:
            issues.append("函数太长，考虑拆分")
        return {"valid": len(issues) == 0, "issues": issues}`,
      `# 错误处理不是可选项
def safe_divide(a, b):
    try:
        return a / b
    except ZeroDivisionError:
        return float('inf')
    except TypeError as e:
        raise ValueError(f"Invalid operands: {e}")`,
    ],
  },
}

const STYLE_PATTERNS = {
  naming: {
    snake_case: /[a-z]+_[a-z]+/g,
    camelCase: /[a-z]+[A-Z][a-z]+/g,
    UPPER_CASE: /[A-Z]{2,}_[A-Z]+/g,
    single_letter: /\b[a-z]\b(?=\s*[=\s])/g,
  },
  structure: {
    for_loop: /\bfor\s+\w+\s+in\s+/g,
    while_loop: /\bwhile\s+/g,
    list_comprehension: /\[\s*\w+.*\bfor\s+\w+\s+in\s+/g,
    functions: /\bdef\s+\w+\s*\(/g,
    classes: /\bclass\s+\w+/g,
    try_except: /\btry\s*:/g,
    lambda: /\blambda\s+/g,
    recursion: null,
    generators: /\byield\s+/g,
  },
  comment: {
    none: (code) => !/#/.test(code),
    sparse: (code) => {
      const lines = code.split('\n')
      const commentLines = lines.filter(l => l.trim().startsWith('#')).length
      return commentLines > 0 && commentLines / lines.length < 0.15
    },
    moderate: (code) => {
      const lines = code.split('\n')
      const commentLines = lines.filter(l => l.trim().startsWith('#')).length
      return commentLines / lines.length >= 0.15 && commentLines / lines.length < 0.3
    },
    heavy: (code) => {
      const lines = code.split('\n')
      const commentLines = lines.filter(l => l.trim().startsWith('#')).length
      return commentLines / lines.length >= 0.3
    },
  },
  debug: {
    print_debug: /\bprint\s*\(\s*f?["'].*debug|print\s*\(\s*["']---/gi,
    assert_debug: /\bassert\s+/g,
    logging: /\blogging\.\w+/g,
  },
}

function _analyzeCodeStyle(code) {
  if (!code || code.length < 10) return null

  const result = {
    naming: {},
    structures: {},
    commentFrequency: 'none',
    debugApproach: null,
    avgLineLength: 0,
    indentStyle: 'spaces',
    lineCount: 0,
  }

  for (const [style, pattern] of Object.entries(STYLE_PATTERNS.naming)) {
    const matches = code.match(pattern)
    result.naming[style] = matches ? matches.length : 0
  }

  for (const [structure, pattern] of Object.entries(STYLE_PATTERNS.structure)) {
    if (pattern === null) continue
    const matches = code.match(pattern)
    result.structures[structure] = matches ? matches.length : 0
  }

  for (const [freq, detector] of Object.entries(STYLE_PATTERNS.comment)) {
    if (typeof detector === 'function' && detector(code)) {
      result.commentFrequency = freq
      break
    }
  }

  for (const [approach, pattern] of Object.entries(STYLE_PATTERNS.debug)) {
    const matches = code.match(pattern)
    if (matches && matches.length > 0) {
      result.debugApproach = approach
      break
    }
  }

  const lines = code.split('\n')
  result.lineCount = lines.length
  result.avgLineLength = Math.round(lines.reduce((sum, l) => sum + l.length, 0) / lines.length)
  result.indentStyle = code.includes('\t') ? 'tabs' : 'spaces'

  return result
}

function _computeSimilarity(playerProfile, charDNA) {
  let score = 0
  let maxScore = 0

  const playerNaming = playerProfile.dominantNaming
  if (playerNaming === charDNA.naming_preference) score += 3
  else if (playerNaming && charDNA.naming_preference) score += 1
  maxScore += 3

  const playerStructures = playerProfile.preferredStructures || []
  const charStructures = charDNA.structure_preference || []
  const overlap = playerStructures.filter(s => charStructures.includes(s)).length
  score += overlap * 2
  maxScore += charStructures.length * 2

  if (playerProfile.commentFrequency === charDNA.comment_style) score += 2
  maxScore += 2

  if (playerProfile.debugApproach === charDNA.debug_approach) score += 2
  maxScore += 2

  const aesthetic = playerProfile.codeAesthetic
  if (aesthetic === charDNA.coding_aesthetic) score += 3
  maxScore += 3

  return maxScore > 0 ? Math.round((score / maxScore) * 100) / 100 : 0
}

export function useSymbioticCodeDNA() {
  const characterDNA = reactive({})
  const playerProfile = reactive({
    codesSampled: 0,
    dominantNaming: null,
    preferredStructures: [],
    commentFrequency: 'none',
    debugApproach: null,
    codeAesthetic: null,
    avgLineLength: 0,
    namingHistory: { snake_case: 0, camelCase: 0, UPPER_CASE: 0, single_letter: 0 },
    structureHistory: {},
    recentAnalyses: [],
  })
  const symbiosisScores = reactive({})
  const sharedVocabulary = reactive({})

  function initialize() {
    for (const [charId, baseDNA] of Object.entries(CHARACTER_BASE_DNA)) {
      characterDNA[charId] = {
        ...baseDNA,
        absorbed_patterns: {
          naming_style: baseDNA.naming_preference,
          comment_frequency: baseDNA.comment_style,
          preferred_structures: [...baseDNA.structure_preference],
          debug_approach: baseDNA.debug_approach,
          code_aesthetic: baseDNA.coding_aesthetic,
        },
        personality_drift: {
          base: baseDNA.base_personality,
          current: baseDNA.base_personality,
          player_influence: 0,
          drift_history: [],
        },
        shared_vocabulary: [],
        generated_code_samples: [...(baseDNA.code_samples || [])],
        interaction_count: 0,
      }
      symbiosisScores[charId] = 0
      sharedVocabulary[charId] = []
    }
  }

  function analyzePlayerCode(code) {
    const analysis = _analyzeCodeStyle(code)
    if (!analysis) return

    playerProfile.codesSampled++

    for (const [style, count] of Object.entries(analysis.naming)) {
      playerProfile.namingHistory[style] = (playerProfile.namingHistory[style] || 0) + count
    }

    let maxNaming = ''
    let maxNamingCount = 0
    for (const [style, count] of Object.entries(playerProfile.namingHistory)) {
      if (count > maxNamingCount) {
        maxNaming = style
        maxNamingCount = count
      }
    }
    playerProfile.dominantNaming = maxNaming || null

    for (const [structure, count] of Object.entries(analysis.structures)) {
      if (count > 0) {
        playerProfile.structureHistory[structure] = (playerProfile.structureHistory[structure] || 0) + count
      }
    }

    playerProfile.preferredStructures = Object.entries(playerProfile.structureHistory)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([k]) => k)

    if (analysis.commentFrequency !== 'none') {
      playerProfile.commentFrequency = analysis.commentFrequency
    }

    if (analysis.debugApproach) {
      playerProfile.debugApproach = analysis.debugApproach
    }

    const alpha = Math.min(0.3, 1 / playerProfile.codesSampled)
    playerProfile.avgLineLength = playerProfile.avgLineLength * (1 - alpha) + analysis.avgLineLength * alpha

    if (playerProfile.avgLineLength < 40 && playerProfile.commentFrequency === 'sparse') {
      playerProfile.codeAesthetic = 'minimalist'
    } else if (playerProfile.avgLineLength < 50 && playerProfile.commentFrequency !== 'heavy') {
      playerProfile.codeAesthetic = 'elegant_concise'
    } else if (playerProfile.commentFrequency === 'heavy' || playerProfile.commentFrequency === 'moderate') {
      playerProfile.codeAesthetic = 'verbose_clear'
    } else {
      playerProfile.codeAesthetic = 'speed_optimized'
    }

    playerProfile.recentAnalyses.push({
      timestamp: Date.now(),
      ...analysis,
    })
    if (playerProfile.recentAnalyses.length > 20) {
      playerProfile.recentAnalyses.splice(0, playerProfile.recentAnalyses.length - 20)
    }

    _updateAllSymbiosis()
  }

  function _updateAllSymbiosis() {
    for (const charId of Object.keys(characterDNA)) {
      _updateCharacterSymbiosis(charId)
    }
  }

  function _updateCharacterSymbiosis(charId) {
    const dna = characterDNA[charId]
    if (!dna) return

    symbiosisScores[charId] = _computeSimilarity(playerProfile, CHARACTER_BASE_DNA[charId])

    const influence = Math.min(0.6, dna.interaction_count * 0.02 + symbiosisScores[charId] * 0.3)
    dna.personality_drift.player_influence = influence

    if (influence > 0.2) {
      const absorbed = dna.absorbed_patterns
      if (playerProfile.dominantNaming && influence > 0.3) {
        absorbed.naming_style = playerProfile.dominantNaming
      }
      if (playerProfile.commentFrequency !== 'none' && influence > 0.25) {
        absorbed.comment_frequency = playerProfile.commentFrequency
      }
      if (playerProfile.debugApproach && influence > 0.35) {
        absorbed.debug_approach = playerProfile.debugApproach
      }
    }

    _updatePersonalityDrift(charId)
  }

  function _updatePersonalityDrift(charId) {
    const dna = characterDNA[charId]
    if (!dna) return

    const influence = dna.personality_drift.player_influence
    const base = dna.personality_drift.base

    const driftMap = {
      gentle_teacher: {
        low: 'gentle_teacher',
        mid: 'collaborative_partner',
        high: 'equal_companion',
      },
      strict_perfectionist: {
        low: 'strict_perfectionist',
        mid: 'respectful_rival',
        high: 'trusted_mentor',
      },
      competitive_energetic: {
        low: 'competitive_energetic',
        mid: 'friendly_rival',
        high: 'training_partner',
      },
      quiet_deep_thinker: {
        low: 'quiet_deep_thinker',
        mid: 'contemplative_pair',
        high: 'kindred_spirit',
      },
      elite_challenger: {
        low: 'elite_challenger',
        mid: 'acknowledged_equal',
        high: 'true_partner',
      },
    }

    const levels = driftMap[base]
    if (!levels) return

    let newPersonality
    if (influence < 0.2) newPersonality = levels.low
    else if (influence < 0.4) newPersonality = levels.mid
    else newPersonality = levels.high

    if (newPersonality !== dna.personality_drift.current) {
      dna.personality_drift.drift_history.push({
        from: dna.personality_drift.current,
        to: newPersonality,
        timestamp: Date.now(),
        influence,
      })
      dna.personality_drift.current = newPersonality
    }
  }

  function recordInteraction(charId) {
    if (characterDNA[charId]) {
      characterDNA[charId].interaction_count++
      _updateCharacterSymbiosis(charId)
    }
  }

  function addSharedTerm(charId, term) {
    if (!characterDNA[charId]) return
    if (!sharedVocabulary[charId]) sharedVocabulary[charId] = []
    if (!sharedVocabulary[charId].includes(term)) {
      sharedVocabulary[charId].push(term)
      characterDNA[charId].shared_vocabulary.push(term)
      if (sharedVocabulary[charId].length > 30) sharedVocabulary[charId].splice(0, 1)
    }
  }

  function generateCharacterCode(charId, concept, context = '') {
    const dna = characterDNA[charId]
    if (!dna) return null

    const absorbed = dna.absorbed_patterns
    const influence = dna.personality_drift.player_influence

    return {
      characterId: charId,
      personality: dna.personality_drift.current,
      style: {
        naming: influence > 0.3 ? absorbed.naming_style : CHARACTER_BASE_DNA[charId].naming_preference,
        comments: influence > 0.25 ? absorbed.comment_frequency : CHARACTER_BASE_DNA[charId].comment_style,
        structures: influence > 0.2
          ? [...new Set([...CHARACTER_BASE_DNA[charId].structure_preference, ...playerProfile.preferredStructures.slice(0, 2)])]
          : CHARACTER_BASE_DNA[charId].structure_preference,
        debugApproach: influence > 0.35 ? absorbed.debug_approach : CHARACTER_BASE_DNA[charId].debug_approach,
      },
      sampleCode: dna.generated_code_samples[
        Math.floor(Math.random() * dna.generated_code_samples.length)
      ],
      sharedVocab: sharedVocabulary[charId] || [],
    }
  }

  function getSymbiosisOverview() {
    const overview = {}
    for (const [charId, dna] of Object.entries(characterDNA)) {
      overview[charId] = {
        score: symbiosisScores[charId] || 0,
        personality: dna.personality_drift.current,
        influence: dna.personality_drift.player_influence,
        sharedTerms: (sharedVocabulary[charId] || []).length,
        interactions: dna.interaction_count,
      }
    }
    return overview
  }

  function buildSymbioticPromptCard(charId) {
    const dna = characterDNA[charId]
    if (!dna) return ''

    const score = symbiosisScores[charId] || 0
    const influence = dna.personality_drift.player_influence
    const personality = dna.personality_drift.current
    const absorbed = dna.absorbed_patterns
    const vocab = sharedVocabulary[charId] || []

    const lines = ['【共生代码DNA卡】']
    lines.push(`当前关系人格：${personality}（基础：${dna.personality_drift.base}）`)
    lines.push(`代码DNA重合度：${Math.round(score * 100)}%`)
    lines.push(`玩家影响度：${Math.round(influence * 100)}%`)

    if (influence > 0.2) {
      lines.push(`从玩家身上吸收的编码习惯：`)
      lines.push(`  命名风格：${absorbed.naming_style}`)
      lines.push(`  注释频率：${absorbed.comment_frequency}`)
      lines.push(`  调试方式：${absorbed.debug_approach}`)
      lines.push('角色在写代码示例时，应自然地融入这些从玩家吸收的风格。')
    }

    if (vocab.length > 0) {
      lines.push(`共同发明的术语：${vocab.slice(-8).join('、')}`)
      lines.push('如果在合适的场景，可以使用这些共同术语。')
    }

    if (playerProfile.codeAesthetic) {
      lines.push(`玩家编码美学：${playerProfile.codeAesthetic}`)
    }

    return lines.join('\n')
  }

  function getState() {
    return {
      playerProfile: JSON.parse(JSON.stringify(playerProfile)),
      characterDNA: JSON.parse(JSON.stringify(characterDNA)),
      symbiosisScores: { ...symbiosisScores },
      sharedVocabulary: JSON.parse(JSON.stringify(sharedVocabulary)),
    }
  }

  function restoreState(state) {
    if (!state) return
    if (state.playerProfile) Object.assign(playerProfile, state.playerProfile)
    if (state.characterDNA) {
      for (const [charId, dna] of Object.entries(state.characterDNA)) {
        if (characterDNA[charId]) Object.assign(characterDNA[charId], dna)
      }
    }
    if (state.symbiosisScores) Object.assign(symbiosisScores, state.symbiosisScores)
    if (state.sharedVocabulary) {
      for (const [charId, vocab] of Object.entries(state.sharedVocabulary)) {
        sharedVocabulary[charId] = vocab
      }
    }
  }

  function getProfile(charId) {
    const dna = characterDNA[charId]
    if (!dna) return null
    const influence = dna.personality_drift?.player_influence || 0
    let animationTier = 0
    if (influence >= 0.7) animationTier = 3
    else if (influence >= 0.4) animationTier = 2
    else if (influence >= 0.2) animationTier = 1
    return {
      player_influence: influence,
      animationTier,
      personality: dna.personality_drift?.current || dna.personality_drift?.base,
      interaction_count: dna.interaction_count || 0,
      score: symbiosisScores[charId] || 0,
    }
  }

  return {
    characterDNA,
    playerProfile,
    symbiosisScores,
    sharedVocabulary,

    initialize,
    analyzePlayerCode,
    recordInteraction,
    addSharedTerm,
    generateCharacterCode,
    getSymbiosisOverview,
    getProfile,

    buildSymbioticPromptCard,

    getState,
    restoreState,
  }
}
