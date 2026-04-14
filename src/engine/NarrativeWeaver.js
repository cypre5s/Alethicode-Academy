import { ref } from 'vue'
import { characters } from '../data/characters.js'
import { locations, sceneIdFromBackgroundId } from '../data/locations.js'

const WEAVE_CACHE_DB = 'alethicode_weave_cache'
const WEAVE_STORE = 'weave_segments'
const MAX_CACHE_ENTRIES = 100
const DURATION_MAP = { short: { min: 3, max: 5 }, medium: { min: 8, max: 12 }, long: { min: 15, max: 20 } }

let _db = null

function _openDB() {
  if (_db) return Promise.resolve(_db)
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(WEAVE_CACHE_DB, 1)
    req.onupgradeneeded = () => {
      const db = req.result
      if (!db.objectStoreNames.contains(WEAVE_STORE)) {
        db.createObjectStore(WEAVE_STORE)
      }
    }
    req.onsuccess = () => { _db = req.result; resolve(_db) }
    req.onerror = () => reject(req.error)
  })
}

function _cacheGet(key) {
  return _openDB().then(db => new Promise((resolve, reject) => {
    const tx = db.transaction(WEAVE_STORE, 'readonly')
    const req = tx.objectStore(WEAVE_STORE).get(key)
    req.onsuccess = () => resolve(req.result)
    req.onerror = () => reject(req.error)
  })).catch(() => null)
}

function _cachePut(key, value) {
  return _openDB().then(db => new Promise((resolve, reject) => {
    const tx = db.transaction(WEAVE_STORE, 'readwrite')
    tx.objectStore(WEAVE_STORE).put(value, key)
    tx.oncomplete = () => resolve()
    tx.onerror = () => reject(tx.error)
  })).catch(() => {})
}

function _hashState(cmd, gameState, profileSnapshot) {
  const parts = [
    cmd.anchor_before || '',
    cmd.anchor_after || '',
    cmd.mood || '',
    JSON.stringify(cmd.characters || []),
  ]
  for (const cid of (cmd.characters || [])) {
    const rel = gameState.relationship?.[cid]
    if (rel) parts.push(`${cid}:${rel.affection}:${rel.trust}:${rel.comfort}`)
  }
  if (profileSnapshot) {
    parts.push(`b${Math.round(profileSnapshot.boldness * 10)}e${Math.round(profileSnapshot.empathy * 10)}`)
  }
  let hash = 0
  const str = parts.join('|')
  for (let i = 0; i < str.length; i++) {
    hash = ((hash << 5) - hash + str.charCodeAt(i)) | 0
  }
  return 'weave_' + Math.abs(hash).toString(36)
}

function _buildWeavePrompt(cmd, gameState, profileCard, memoryCard) {
  const charNames = (cmd.characters || [])
    .map(cid => characters[cid]?.name || cid)
    .join('、')

  const charProfiles = (cmd.characters || []).map(cid => {
    const char = characters[cid]
    if (!char) return ''
    const rel = gameState.relationship?.[cid] || { affection: 0, trust: 0, comfort: 0 }
    return `${char.name}（${char.role}）：好感${rel.affection}/信任${rel.trust}/安心${rel.comfort}，性格：${char.personality || ''}`
  }).filter(Boolean).join('\n')

  const bgId = gameState.currentBg || ''
  const sceneId = sceneIdFromBackgroundId(bgId)
  const loc = locations[sceneId]
  const locationDesc = loc ? `${loc.name} —— ${loc.description}` : '未知地点'

  const durationSpec = DURATION_MAP[cmd.duration || 'short'] || DURATION_MAP.short
  const constraints = cmd.constraints || {}

  return `你是视觉小说《Alethicode Academy —— 编程学园恋物语》的叙事编织器。
你的任务是生成一段过渡场景——连接两个剧情锚点之间的"结缔组织"。

【前锚点】${cmd.anchor_before || '（上一幕结束）'}
【后锚点】${cmd.anchor_after || '（下一幕开始）'}
【场景背景】${cmd.context || '过渡场景'}
【地点】${locationDesc}
【时间段】${gameState.currentTimeSlot || '未知'}
【情绪基调】${cmd.mood || 'neutral'}
【登场角色】${charNames}

【角色状态】
${charProfiles}

${profileCard || ''}
${memoryCard || ''}

【约束】
${constraints.mustMention ? '必须提及：' + constraints.mustMention.join('、') : ''}
${constraints.mustNotMention ? '禁止提及：' + constraints.mustNotMention.join('、') : ''}
${constraints.relationshipGate ? '关系门槛：' + JSON.stringify(constraints.relationshipGate) : ''}

【生成规则】
- 生成 ${durationSpec.min}~${durationSpec.max} 条 VN 指令
- 允许的指令类型：dialogue, narration, monologue, char_expression, char_enter, char_exit, se
- dialogue 格式：{ "type": "dialogue", "speaker": "角色id", "text": "台词", "expression": "表情", "live2d_hints": {"motion":"可选动作","gaze":"可选视线目标"} }
- narration 格式：{ "type": "narration", "text": "旁白" }
- monologue 格式：{ "type": "monologue", "text": "内心独白" }
- char_expression 格式：{ "type": "char_expression", "character": "角色id", "expression": "表情" }
- live2d_hints 是可选的，用于建议角色的 Live2D 动画。motion 可选值：happy_idle/lean_forward/step_back/shy_fidget/react_surprise。gaze 可选值：player/code_area/sky/memory/away
- 不要生成 choice、challenge、ending、cg 等交互指令
- 所有台词要符合角色性格和当前关系阶段
- 过渡要自然，不要突兀地开始或结束
- 主角名字用 {playerName} 占位符

只输出 JSON 数组，不要任何解释文字：
[{ "type": "...", ... }, ...]`
}

const FALLBACK_SEGMENTS = {
  nervous_anticipation: [
    { type: 'narration', text: '教室里弥漫着一种微妙的紧张感。' },
    { type: 'monologue', text: '接下来的事情……会顺利吗。' },
    { type: 'narration', text: '窗外的风吹动了窗帘，阳光在桌面上投下摇曳的光影。' },
  ],
  warm_quiet: [
    { type: 'narration', text: '午后的阳光透过窗帘缝隙，在空气中画出一道金色的光柱。' },
    { type: 'monologue', text: '这样安静的时光，不知不觉就让人放松下来了。' },
    { type: 'narration', text: '远处传来社团活动的声音，给安静的空间增添了一丝生活气息。' },
  ],
  tense: [
    { type: 'narration', text: '空气中弥漫着一种无形的压力。' },
    { type: 'monologue', text: '……不对劲。总觉得有什么事情要发生。' },
    { type: 'narration', text: '走廊尽头传来急促的脚步声，然后归于沉寂。' },
  ],
  default: [
    { type: 'narration', text: '时间在不知不觉中流逝着。' },
    { type: 'monologue', text: '接下来该做什么好呢……' },
    { type: 'narration', text: '深呼一口气，{playerName} 整理了一下思绪。' },
  ],
}

export function useNarrativeWeaver() {
  const isWeaving = ref(false)
  const lastWeaveQuality = ref(1)
  const weaveCount = ref(0)

  async function generateSegment(cmd, gameState, llmManager, profileCard, memoryCard) {
    const cacheKey = _hashState(cmd, gameState, null)
    const cached = await _cacheGet(cacheKey)
    if (cached && Array.isArray(cached.commands) && cached.quality >= 0.5) {
      lastWeaveQuality.value = cached.quality
      return cached.commands
    }

    if (!llmManager?.apiKey?.value || llmManager?.offlineMode?.value) {
      return _getFallback(cmd)
    }

    isWeaving.value = true
    const prompt = _buildWeavePrompt(cmd, gameState, profileCard, memoryCard)

    try {
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 15000)
      const baseUrl = llmManager.baseUrl.value
      const endpoint = `${baseUrl}/chat/completions`

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${llmManager.apiKey.value}`,
        },
        signal: controller.signal,
        body: JSON.stringify({
          model: llmManager.model.value,
          max_tokens: 1500,
          temperature: 0.85,
          messages: [
            { role: 'system', content: prompt },
            { role: 'user', content: '生成过渡场景指令数组。' },
          ],
        }),
      })

      clearTimeout(timeoutId)
      if (!response.ok) throw new Error(`API ${response.status}`)

      const data = await response.json()
      const text = data.choices?.[0]?.message?.content || '[]'
      const cleaned = text.replace(/```json\n?|```/g, '').trim()
      const commands = JSON.parse(cleaned)

      if (!Array.isArray(commands) || commands.length === 0) throw new Error('Empty result')

      const validated = _validateCommands(commands, cmd)
      const quality = _scoreQuality(validated, cmd)
      lastWeaveQuality.value = quality

      if (quality >= 0.5) {
        await _cachePut(cacheKey, { commands: validated, quality, timestamp: Date.now() })
        weaveCount.value++
      }

      isWeaving.value = false
      return quality >= 0.5 ? validated : _getFallback(cmd)
    } catch {
      isWeaving.value = false
      return _getFallback(cmd)
    }
  }

  function _validateCommands(commands, cmd) {
    const ALLOWED_TYPES = ['dialogue', 'narration', 'monologue', 'char_expression', 'char_enter', 'char_exit', 'se']
    const validChars = new Set(cmd.characters || [])

    return commands
      .filter(c => c && typeof c === 'object' && ALLOWED_TYPES.includes(c.type))
      .map(c => {
        const clean = { type: c.type }
        if (c.type === 'dialogue') {
          clean.speaker = validChars.has(c.speaker) ? c.speaker : (cmd.characters?.[0] || 'nene')
          clean.text = _sanitize(c.text)
          clean.expression = typeof c.expression === 'string' ? c.expression.replace(/[^a-z_]/g, '') : 'normal'
          if (c.live2d_hints && typeof c.live2d_hints === 'object') {
            clean.live2d_hints = {}
            if (typeof c.live2d_hints.motion === 'string') clean.live2d_hints.motion = c.live2d_hints.motion.replace(/[^a-z_]/g, '')
            if (typeof c.live2d_hints.gaze === 'string') clean.live2d_hints.gaze = c.live2d_hints.gaze.replace(/[^a-z_]/g, '')
          }
        } else if (c.type === 'narration' || c.type === 'monologue') {
          clean.text = _sanitize(c.text)
        } else if (c.type === 'char_expression') {
          clean.character = validChars.has(c.character) ? c.character : (cmd.characters?.[0] || 'nene')
          clean.expression = typeof c.expression === 'string' ? c.expression.replace(/[^a-z_]/g, '') : 'normal'
        } else if (c.type === 'char_enter' || c.type === 'char_exit') {
          clean.character = validChars.has(c.character) ? c.character : (cmd.characters?.[0] || 'nene')
          if (c.expression) clean.expression = typeof c.expression === 'string' ? c.expression.replace(/[^a-z_]/g, '') : 'normal'
          if (c.position) clean.position = c.position
        } else if (c.type === 'se') {
          clean.id = typeof c.id === 'string' ? c.id.replace(/[^a-z0-9_]/g, '') : 'click'
        }
        return clean
      })
      .filter(c => {
        if (c.type === 'dialogue' || c.type === 'narration' || c.type === 'monologue') {
          return c.text && c.text.length > 0
        }
        return true
      })
  }

  function _sanitize(text) {
    if (typeof text !== 'string') return ''
    return text
      .replace(/<[^>]*>/g, '')
      .replace(/on\w+\s*=/gi, '')
      .slice(0, 500)
      .trim()
  }

  function _scoreQuality(commands, cmd) {
    if (!commands || commands.length === 0) return 0
    let score = 0.5

    const durationSpec = DURATION_MAP[cmd.duration || 'short'] || DURATION_MAP.short
    if (commands.length >= durationSpec.min && commands.length <= durationSpec.max) score += 0.2
    else if (commands.length > 0) score += 0.1

    const hasDialogue = commands.some(c => c.type === 'dialogue')
    if (hasDialogue) score += 0.15

    const hasVariety = new Set(commands.map(c => c.type)).size >= 2
    if (hasVariety) score += 0.15

    return Math.min(score, 1)
  }

  function _getFallback(cmd) {
    const mood = cmd.mood || 'default'
    const base = FALLBACK_SEGMENTS[mood] || FALLBACK_SEGMENTS.default
    lastWeaveQuality.value = 0.3
    return [...base]
  }

  return {
    isWeaving,
    lastWeaveQuality,
    weaveCount,
    generateSegment,
  }
}
