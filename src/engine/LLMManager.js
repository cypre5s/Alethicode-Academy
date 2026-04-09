import { ref } from 'vue'
import { characters } from '../data/characters.js'
import { fallbackDialogues } from '../data/fallbackDialogues.js'

const LLM_CONFIG_KEY = 'alethicode_llm_config'
const MAX_INPUT_LENGTH = 500
const MAX_RESPONSE_TEXT_LENGTH = 1000
const MIN_REQUEST_INTERVAL_MS = 2000

let _lastRequestTime = 0
const ENV_API_KEY = (import.meta.env.VITE_DEEPSEEK_API_KEY || '').trim()
const ENV_BASE_URL = (import.meta.env.VITE_DEEPSEEK_BASE_URL || 'https://api.deepseek.com').replace(/\/+$/, '')
const ENV_MODEL = import.meta.env.VITE_DEEPSEEK_MODEL || 'deepseek-chat'

const apiKey = ref('')
const baseUrl = ref(ENV_BASE_URL)
const model = ref(ENV_MODEL)
const isGenerating = ref(false)
const lastError = ref(null)
const offlineMode = ref(false)

function _loadConfig() {
  const defaults = { apiKey: ENV_API_KEY, baseUrl: ENV_BASE_URL, model: ENV_MODEL }
  try {
    const raw = localStorage.getItem(LLM_CONFIG_KEY)
    if (!raw || raw.length > 10000) return defaults
    const saved = JSON.parse(raw)
    if (typeof saved !== 'object' || saved === null) return defaults
    const loadedKey = typeof saved.apiKey === 'string' ? saved.apiKey.slice(0, 256) : defaults.apiKey
    const loadedUrl = typeof saved.baseUrl === 'string' ? saved.baseUrl.slice(0, 512).replace(/\/+$/, '') : defaults.baseUrl
    const loadedModel = typeof saved.model === 'string' ? saved.model.slice(0, 128) : defaults.model
    return { apiKey: loadedKey || defaults.apiKey, baseUrl: loadedUrl || defaults.baseUrl, model: loadedModel || defaults.model }
  } catch {}
  return defaults
}

function _saveConfig() {
  try {
    localStorage.setItem(LLM_CONFIG_KEY, JSON.stringify({
      apiKey: apiKey.value,
      baseUrl: baseUrl.value,
      model: model.value
    }))
  } catch {}
}

function _sanitizeText(str) {
  if (typeof str !== 'string') return ''
  return str
    .replace(/<script[\s>][\s\S]*?<\/script>/gi, '')
    .replace(/<iframe[\s>][\s\S]*?<\/iframe>/gi, '')
    .replace(/<object[\s>][\s\S]*?<\/object>/gi, '')
    .replace(/<embed[\s>][\s\S]*?>/gi, '')
    .replace(/<link[\s>][\s\S]*?>/gi, '')
    .replace(/on\w+\s*=\s*["'][^"']*["']/gi, '')
    .replace(/javascript\s*:/gi, '')
    .replace(/data\s*:\s*text\/html/gi, '')
    .slice(0, MAX_RESPONSE_TEXT_LENGTH)
    .trim()
}

function _sanitizeLLMResponse(parsed) {
  const validExpressions = [
    'normal', 'smile', 'gentle_smile', 'blush', 'surprised', 'sad',
    'angry', 'thinking', 'confused', 'cold', 'pout', 'tsundere_pout',
    'slight_smile', 'rare_gentle', 'glasses_adjust', 'competitive',
    'fired_up', 'grin', 'soft_smile', 'absorbed', 'contemplative',
    'teary', 'warm_smile', 'fierce', 'smirk', 'impressed',
    'genuine_smile', 'vulnerable', 'heart_eyes'
  ]

  const expr = typeof parsed.expression === 'string'
    ? parsed.expression.replace(/[^a-z_]/g, '')
    : 'normal'

  return {
    text: _sanitizeText(parsed.text || ''),
    expression: validExpressions.includes(expr) ? expr : 'normal',
    action: _sanitizeText(parsed.action || ''),
    affectionChange: Math.min(Math.max(parseInt(parsed.affection_change) || 0, 0), 2),
    innerThought: _sanitizeText(parsed.inner_thought || ''),
    source: 'llm'
  }
}

function _throttleCheck() {
  const now = Date.now()
  if (now - _lastRequestTime < MIN_REQUEST_INTERVAL_MS) return false
  _lastRequestTime = now
  return true
}

function _isValidApiUrl(url) {
  try {
    const parsed = new URL(url)
    if (!['https:', 'http:'].includes(parsed.protocol)) return false
    if (parsed.hostname === 'localhost' || parsed.hostname === '127.0.0.1') return true
    if (/^(10\.|172\.(1[6-9]|2\d|3[01])\.|192\.168\.)/.test(parsed.hostname)) return false
    return true
  } catch {
    return false
  }
}

function _safeJsonParse(text) {
  const cleaned = text.replace(/```json\n?|```/g, '').trim()
  const parsed = JSON.parse(cleaned)
  if (parsed === null || typeof parsed !== 'object' || Array.isArray(parsed)) {
    throw new Error('Invalid response structure')
  }
  if ('__proto__' in parsed || 'constructor' in parsed || 'prototype' in parsed) {
    throw new Error('Prototype pollution detected')
  }
  return parsed
}

function _validateApiResponse(response) {
  const ct = response.headers.get('content-type') || ''
  if (!ct.includes('application/json') && !ct.includes('text/json') && !ct.includes('text/event-stream')) {
    throw new Error('Unexpected response content-type: ' + ct.split(';')[0])
  }
  if (response.status === 429) throw new Error('API 速率限制，请稍后再试')
  if (response.status === 401 || response.status === 403) throw new Error('API Key 无效或已过期')
  if (!response.ok) throw new Error(`API error: ${response.status}`)
}

export function useLLMManager() {

  function setApiKey(key) {
    apiKey.value = (key || '').trim()
    _saveConfig()
  }

  function setBaseUrl(url) {
    const cleaned = (url || ENV_BASE_URL).replace(/\/+$/, '')
    if (cleaned && !_isValidApiUrl(cleaned + '/v1')) {
      return
    }
    baseUrl.value = cleaned
    _saveConfig()
  }

  function setModel(m) {
    model.value = m || ENV_MODEL
    _saveConfig()
  }

  function loadApiKey() {
    const cfg = _loadConfig()
    apiKey.value = cfg.apiKey
    baseUrl.value = cfg.baseUrl
    model.value = cfg.model
    offlineMode.value = typeof navigator !== 'undefined' && !navigator.onLine
    return apiKey.value
  }

  async function testConnection() {
    const start = Date.now()
    try {
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 20000)
      const response = await fetch(`${baseUrl.value}/chat/completions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey.value}`
        },
        signal: controller.signal,
        body: JSON.stringify({
          model: model.value,
          max_tokens: 10,
          messages: [{ role: 'user', content: 'Hi' }]
        })
      })
      clearTimeout(timeoutId)
      const latency = Date.now() - start
      if (!response.ok) {
        const data = await response.json().catch(() => ({}))
        return { ok: false, latency, error: data.error?.message || `HTTP ${response.status}` }
      }
      return { ok: true, latency, error: null }
    } catch (e) {
      return { ok: false, latency: Date.now() - start, error: e.name === 'AbortError' ? '连接超时' : e.message }
    }
  }

  function buildCharacterPrompt(characterId, gameState) {
    const char = characters[characterId]
    if (!char) return ''

    const aff = gameState.affection?.[characterId] || 0
    const affectionLevel =
      aff < 15 ? '初识' :
      aff < 30 ? '熟悉' :
      aff < 50 ? '亲近' :
      aff < 75 ? '暧昧' : '恋慕'

    const triggeredEvents = Object.keys(gameState.flags || {})
      .filter(k => gameState.flags[k] === true)
      .join('、') || '无'

    return `你是视觉小说《Alethicode Academy —— 编程学园恋物语》中的角色「${char.name}」。
你正在与主角（名字：${gameState.playerName || '藤堂 和真'}）进行日常对话。

【角色身份】
${char.fullProfile || char.description || char.role}

【性格与说话方式】
${char.personality || ''}
口癖：${(char.catchphrases || []).join('、') || '无'}

【当前状态】
- 好感度等级：${affectionLevel}（${aff}/100）
- 当前章节：${gameState.currentChapter || '未知'}
- 时间段：${gameState.currentTimeSlot || '未知'}
- 已发生的重要事件：${triggeredEvents}

【好感度对应行为准则】
${char.affectionBehavior ? `
- 初识(0-14)：${char.affectionBehavior.stranger || '保持基本礼貌'}
- 熟悉(15-29)：${char.affectionBehavior.acquaintance || '稍微放松'}
- 亲近(30-49)：${char.affectionBehavior.friend || '更加友好'}
- 暧昧(50-74)：${char.affectionBehavior.crush || '表现出好感'}
- 恋慕(75-100)：${char.affectionBehavior.love || '明显心动'}` : '根据好感度自然调整态度'}

【对话规则】
1. 每次回复 1-3 句话，模拟 Galgame 对话框的节奏感
2. 用【】标注表情/动作，如【微微脸红】【别过头去】
3. 保持角色一致性，绝不出戏
4. 绝不提及自己是 AI、游戏角色或虚构存在
5. 如果话题涉及编程，可以结合角色的编程定位自然回应
6. 如果玩家说了奇怪/不合时宜的话，以角色性格自然反应
7. 不要主动推进主线剧情，保持日常闲聊的范围

【回复格式（严格 JSON）】
{
  "text": "角色的台词内容",
  "expression": "表情标识（从 ${(char.expressions || ['normal']).join(', ')} 中选择）",
  "action": "可选的动作描写",
  "affection_change": 0到2之间的整数,
  "inner_thought": "可选，主角的内心独白反应"
}`
  }

  async function generateCharacterDialogue(characterId, playerInput, gameState) {
    if (!apiKey.value) return getFallbackDialogue(characterId, gameState)
    if (offlineMode.value || (typeof navigator !== 'undefined' && !navigator.onLine)) {
      offlineMode.value = true
      return getFallbackDialogue(characterId, gameState)
    }

    const safeInput = typeof playerInput === 'string'
      ? playerInput.slice(0, MAX_INPUT_LENGTH).trim()
      : ''
    if (!safeInput) return getFallbackDialogue(characterId, gameState)

    if (!_throttleCheck()) {
      lastError.value = '请求过于频繁，请稍后再试'
      return getFallbackDialogue(characterId, gameState)
    }

    const endpoint = `${baseUrl.value}/chat/completions`
    if (!_isValidApiUrl(endpoint)) {
      lastError.value = 'API 地址无效'
      return getFallbackDialogue(characterId, gameState)
    }

    isGenerating.value = true
    lastError.value = null
    const MAX_RETRIES = 2
    const TIMEOUT_MS = 10000

    for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
      try {
        const controller = new AbortController()
        const timeoutId = setTimeout(() => controller.abort(), TIMEOUT_MS)

        const conversationHistory = gameState.conversationHistory?.[characterId]?.slice(-10) || []

        const response = await fetch(endpoint, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${apiKey.value}`
          },
          signal: controller.signal,
          body: JSON.stringify({
            model: model.value,
            max_tokens: 300,
            temperature: 0.7,
            messages: [
              { role: 'system', content: buildCharacterPrompt(characterId, gameState) },
              ...conversationHistory,
              { role: 'user', content: safeInput }
            ]
          })
        })

        clearTimeout(timeoutId)
        _validateApiResponse(response)

        const data = await response.json()
        const text = data.choices?.[0]?.message?.content || ''
        const parsed = _safeJsonParse(text)

        isGenerating.value = false
        return _sanitizeLLMResponse(parsed)
      } catch (error) {
        lastError.value = error.message
        if (attempt === MAX_RETRIES) {
          isGenerating.value = false
          return getFallbackDialogue(characterId, gameState)
        }
        await new Promise(r => setTimeout(r, 1000 * (attempt + 1)))
      }
    }

    isGenerating.value = false
    return getFallbackDialogue(characterId, gameState)
  }

  async function generatePlayerOptions(characterId, gameState, context) {
    if (!apiKey.value) return getDefaultOptions(characterId)
    if (offlineMode.value || (typeof navigator !== 'undefined' && !navigator.onLine)) {
      return getDefaultOptions(characterId)
    }

    const endpoint = `${baseUrl.value}/chat/completions`
    if (!_isValidApiUrl(endpoint)) return getDefaultOptions(characterId)

    try {
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 8000)

      const safeContext = typeof context === 'string' ? context.slice(0, 200) : ''

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey.value}`
        },
        signal: controller.signal,
        body: JSON.stringify({
          model: model.value,
          max_tokens: 200,
          temperature: 0.8,
          messages: [
            {
              role: 'system',
              content: `根据上下文为视觉小说玩家生成3个对话选项。角色：${characters[characterId]?.name}，场景：${safeContext}。
回复严格JSON数组格式：["选项1", "选项2", "选项3"]
选项应自然、有趣、符合场景。`
            },
            { role: 'user', content: `生成3个玩家对话选项。当前好感度：${gameState.affection?.[characterId] || 0}` }
          ]
        })
      })

      clearTimeout(timeoutId)
      _validateApiResponse(response)

      const data = await response.json()
      const text = data.choices?.[0]?.message?.content || '[]'
      const cleaned = text.replace(/```json\n?|```/g, '').trim()
      const options = JSON.parse(cleaned)
      if (!Array.isArray(options)) return getDefaultOptions(characterId)
      return options
        .filter(o => typeof o === 'string')
        .map(o => _sanitizeText(o).slice(0, 100))
        .slice(0, 5)
    } catch {
      return getDefaultOptions(characterId)
    }
  }

  function getDefaultOptions(characterId) {
    const defaults = {
      nene: ['今天的课怎么样？', '你平时喜欢做什么？', '能教我编程吗？'],
      yoshino: ['你在看什么书？', '代码规范真的那么重要吗？', '班级活动的事情怎么样了？'],
      ayase: ['要不要比一场？', '你最近在玩什么游戏？', '作业写完了吗？'],
      kanna: ['你在看什么算法？', '图书馆有推荐的书吗？', '……'],
      murasame: ['你每天都在这里练习吗？', '能给我出一道题吗？', '你是怎么变得这么厉害的？']
    }
    return defaults[characterId] || ['你好', '最近怎么样？', '再见']
  }

  function getFallbackDialogue(characterId, gameState) {
    const aff = gameState.affection?.[characterId] || 0
    const level = aff < 30 ? 'low' : aff < 60 ? 'mid' : 'high'

    const pool = fallbackDialogues?.[characterId]?.[level]
    if (!pool || pool.length === 0) {
      return {
        text: '……',
        expression: 'normal',
        action: null,
        affectionChange: 0,
        innerThought: null,
        source: 'fallback'
      }
    }

    const line = pool[Math.floor(Math.random() * pool.length)]
    return { ...line, source: 'fallback' }
  }

  return {
    apiKey, baseUrl, model, isGenerating, lastError, offlineMode,
    setApiKey, setBaseUrl, setModel, loadApiKey, testConnection,
    buildCharacterPrompt,
    generateCharacterDialogue,
    generatePlayerOptions,
    getFallbackDialogue
  }
}
