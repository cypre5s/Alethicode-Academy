import { ref, reactive } from 'vue'
import { characters } from '../data/characters.js'

const CG_CACHE_DB = 'alethicode_dynamic_cg'
const CG_STORE = 'generated_cgs'
const GALLERY_STORE = 'cg_gallery'
const MAX_GALLERY = 50

let _db = null

function _openDB() {
  if (_db) return Promise.resolve(_db)
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(CG_CACHE_DB, 1)
    req.onupgradeneeded = () => {
      const db = req.result
      if (!db.objectStoreNames.contains(CG_STORE)) db.createObjectStore(CG_STORE)
      if (!db.objectStoreNames.contains(GALLERY_STORE)) db.createObjectStore(GALLERY_STORE, { keyPath: 'id' })
    }
    req.onsuccess = () => { _db = req.result; resolve(_db) }
    req.onerror = () => reject(req.error)
  })
}

function _dbPut(store, key, value) {
  return _openDB().then(db => new Promise((resolve, reject) => {
    const tx = db.transaction(store, 'readwrite')
    if (key != null) tx.objectStore(store).put(value, key)
    else tx.objectStore(store).put(value)
    tx.oncomplete = () => resolve()
    tx.onerror = () => reject(tx.error)
  })).catch(() => {})
}

function _dbGet(store, key) {
  return _openDB().then(db => new Promise((resolve, reject) => {
    const tx = db.transaction(store, 'readonly')
    const req = tx.objectStore(store).get(key)
    req.onsuccess = () => resolve(req.result)
    req.onerror = () => reject(req.error)
  })).catch(() => null)
}

function _dbGetAll(store) {
  return _openDB().then(db => new Promise((resolve, reject) => {
    const tx = db.transaction(store, 'readonly')
    const req = tx.objectStore(store).getAll()
    req.onsuccess = () => resolve(req.result || [])
    req.onerror = () => reject(req.error)
  })).catch(() => [])
}

const STYLE_DESCRIPTORS = {
  base: 'anime-style visual novel CG illustration, soft watercolor lighting, warm color palette, high quality, detailed background, romantic atmosphere',
  characters: {
    nene: 'pink hair, ribbon, school uniform, bright energetic eyes, cheerful expression',
    yoshino: 'long dark hair, glasses, elegant, composed, intellectual aura, neat uniform',
    ayase: 'short sporty hair, competitive gaze, athletic build, energetic pose',
    kanna: 'silver-white hair, quiet expression, mysterious aura, ethereal beauty',
    murasame: 'dark flowing hair, mature expression, confident posture, sharp eyes',
  },
  sceneTypes: {
    intimate_study: 'library setting, warm lamp light, books scattered, two people close together studying',
    rooftop_sunset: 'school rooftop, dramatic sunset sky, wind blowing hair, golden hour lighting',
    festival: 'japanese summer festival, lanterns, yukata, fireworks in sky, festive crowd',
    competition: 'computer lab, screens glowing, intense concentration, competitive atmosphere',
    confession: 'cherry blossoms falling, soft pink lighting, emotional moment, close-up faces',
    casual_hangout: 'school courtyard, casual relaxed pose, natural daylight, friendly atmosphere',
    rainy_day: 'rain outside window, cozy indoor scene, warm lighting, reflective mood',
    night_conversation: 'starry night sky, quiet atmosphere, moonlight, intimate conversation',
  },
  moods: {
    warm_quiet: 'warm tones, soft lighting, peaceful atmosphere, gentle mood',
    nervous_anticipation: 'slightly tense atmosphere, anticipatory, dramatic lighting',
    joyful: 'bright vivid colors, celebratory, dynamic energy, smiles',
    melancholic: 'muted cool tones, wistful, gentle rain or twilight',
    romantic: 'soft pink and gold tones, intimate framing, dreamy bokeh',
    intense: 'high contrast, dramatic shadows, focused expression',
  },
}

function _buildImagePrompt(params) {
  const parts = [STYLE_DESCRIPTORS.base]

  if (params.characters) {
    for (const cid of params.characters) {
      if (STYLE_DESCRIPTORS.characters[cid]) {
        parts.push(STYLE_DESCRIPTORS.characters[cid])
      }
    }
  }

  if (params.sceneType && STYLE_DESCRIPTORS.sceneTypes[params.sceneType]) {
    parts.push(STYLE_DESCRIPTORS.sceneTypes[params.sceneType])
  }

  if (params.mood && STYLE_DESCRIPTORS.moods[params.mood]) {
    parts.push(STYLE_DESCRIPTORS.moods[params.mood])
  }

  if (params.uniqueContext) {
    parts.push(params.uniqueContext)
  }

  if (params.expression) {
    const exprMap = {
      smile: 'gentle smile',
      blush: 'blushing, embarrassed but happy',
      sad: 'slightly sad, wistful expression',
      surprised: 'surprised, wide eyes',
      rare_gentle: 'rare gentle expression, vulnerability showing',
      competitive: 'fierce competitive expression',
    }
    if (exprMap[params.expression]) parts.push(exprMap[params.expression])
  }

  return parts.join(', ')
}

export function useDynamicCGGenerator() {
  const isGenerating = ref(false)
  const lastError = ref(null)
  const generatedCount = ref(0)
  const galleryItems = reactive([])

  const imageApiKey = ref('')
  const imageApiUrl = ref('')
  const imageModel = ref('')

  function configure(config) {
    if (config.apiKey) imageApiKey.value = config.apiKey
    if (config.apiUrl) imageApiUrl.value = config.apiUrl
    if (config.model) imageModel.value = config.model
  }

  function isConfigured() {
    return !!(imageApiKey.value && imageApiUrl.value)
  }

  async function loadGallery() {
    const items = await _dbGetAll(GALLERY_STORE)
    galleryItems.splice(0, galleryItems.length, ...items.sort((a, b) => b.timestamp - a.timestamp))
  }

  async function generateCG(params, llmManager) {
    const cacheKey = `cg_${JSON.stringify(params).slice(0, 200)}`
    const cached = await _dbGet(CG_STORE, cacheKey)
    if (cached && cached.imageUrl) {
      return cached
    }

    const apiKey = imageApiKey.value || llmManager?.apiKey?.value
    const apiUrl = imageApiUrl.value || (llmManager?.baseUrl?.value ? `${llmManager.baseUrl.value}` : '')

    if (!apiKey || !apiUrl) {
      return _generateTextCG(params, llmManager)
    }

    isGenerating.value = true
    lastError.value = null

    try {
      const imagePrompt = _buildImagePrompt(params)

      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 60000)

      const response = await fetch(`${apiUrl}/images/generations`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`,
        },
        signal: controller.signal,
        body: JSON.stringify({
          model: imageModel.value || 'dall-e-3',
          prompt: imagePrompt,
          n: 1,
          size: '1024x1024',
          quality: 'standard',
        }),
      })

      clearTimeout(timeoutId)

      if (!response.ok) {
        return _generateTextCG(params, llmManager)
      }

      const data = await response.json()
      const imageUrl = data.data?.[0]?.url || data.data?.[0]?.b64_json

      if (!imageUrl) {
        return _generateTextCG(params, llmManager)
      }

      const result = {
        id: `dcg_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
        imageUrl,
        isBase64: !!data.data?.[0]?.b64_json,
        prompt: imagePrompt.slice(0, 200),
        params: { ...params },
        timestamp: Date.now(),
        type: 'generated_image',
      }

      await _cacheCG(cacheKey, result)
      generatedCount.value++
      isGenerating.value = false
      return result
    } catch (e) {
      lastError.value = e.message
      isGenerating.value = false
      return _generateTextCG(params, llmManager)
    }
  }

  async function _generateTextCG(params, llmManager) {
    if (!llmManager?.apiKey?.value) return _getPlaceholder(params)

    try {
      const charNames = (params.characters || []).map(c => characters[c]?.name || c).join('、')
      const prompt = `你是一个CG描写生成器。为视觉小说生成一段画面描写，用于在没有实际图片时以文字形式展现CG场景。

场景类型：${params.sceneType || '日常'}
角色：${charNames}
情绪：${params.mood || 'warm_quiet'}
背景：${params.uniqueContext || '学园日常'}

生成一段 50~100 字的画面描写，要有画面感，像在描述一幅画。
只输出描写文字，不要JSON。`

      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 10000)

      const response = await fetch(`${llmManager.baseUrl.value}/chat/completions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${llmManager.apiKey.value}`,
        },
        signal: controller.signal,
        body: JSON.stringify({
          model: llmManager.model.value,
          max_tokens: 200,
          temperature: 0.9,
          messages: [
            { role: 'system', content: prompt },
            { role: 'user', content: '生成CG画面描写。' },
          ],
        }),
      })

      clearTimeout(timeoutId)
      if (!response.ok) return _getPlaceholder(params)

      const data = await response.json()
      const text = data.choices?.[0]?.message?.content || ''

      const result = {
        id: `dcg_text_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
        textDescription: text.trim().slice(0, 300),
        params: { ...params },
        timestamp: Date.now(),
        type: 'text_description',
        characters: params.characters || [],
        mood: params.mood || 'warm_quiet',
      }

      await _saveToGallery(result)
      generatedCount.value++
      return result
    } catch {
      return _getPlaceholder(params)
    }
  }

  function _getPlaceholder(params) {
    const charNames = (params.characters || []).map(c => characters[c]?.name || c).join('与')
    const moodTexts = {
      warm_quiet: '温暖而安静的',
      nervous_anticipation: '紧张又期待的',
      joyful: '欢快的',
      melancholic: '略带感伤的',
      romantic: '浪漫的',
      intense: '激烈的',
    }
    const moodText = moodTexts[params.mood] || '特别的'

    return {
      id: `dcg_placeholder_${Date.now()}`,
      textDescription: `${charNames}${moodText}一刻——这是属于你独有的回忆。`,
      params: { ...params },
      timestamp: Date.now(),
      type: 'placeholder',
    }
  }

  async function _cacheCG(key, result) {
    await _dbPut(CG_STORE, key, result)
    await _saveToGallery(result)
  }

  async function _saveToGallery(item) {
    await _dbPut(GALLERY_STORE, null, item)
    galleryItems.unshift(item)
    if (galleryItems.length > MAX_GALLERY) {
      galleryItems.splice(MAX_GALLERY)
    }
  }

  function shouldGenerateCG(emotionIntensity, sceneType) {
    if (emotionIntensity >= 0.7) return true
    if (sceneType === 'confession' || sceneType === 'festival') return true
    return false
  }

  return {
    isGenerating,
    lastError,
    generatedCount,
    galleryItems,
    imageApiKey,
    imageApiUrl,
    imageModel,
    configure,
    isConfigured,
    loadGallery,
    generateCG,
    shouldGenerateCG,
  }
}
