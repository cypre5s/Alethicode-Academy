import { ref, reactive, shallowRef } from 'vue'

const DB_NAME = 'alethicode_temporal_code'
const DB_VERSION = 1
const STORE_NAME = 'code_strata'
const MILESTONE_STORE = 'milestones'

const MILESTONE_DETECTORS = {
  first_print:       { label: '第一次输出', detect: (code) => /print\s*\(/.test(code) },
  first_variable:    { label: '第一个变量', detect: (code) => /^\s*\w+\s*=\s*.+/m.test(code) },
  first_if:          { label: '第一次条件判断', detect: (code) => /\bif\s+/.test(code) },
  first_for_loop:    { label: '第一个for循环', detect: (code) => /\bfor\s+\w+\s+in\s+/.test(code) },
  first_while:       { label: '第一个while循环', detect: (code) => /\bwhile\s+/.test(code) },
  first_function:    { label: '第一个函数定义', detect: (code) => /\bdef\s+\w+\s*\(/.test(code) },
  first_return:      { label: '第一次使用return', detect: (code) => /\breturn\s+/.test(code) },
  first_list:        { label: '第一个列表', detect: (code) => /\[.+\]/.test(code) && !/\[\s*\]/.test(code) },
  first_dict:        { label: '第一个字典', detect: (code) => /\{.+:.+\}/.test(code) },
  first_list_comp:   { label: '第一次列表推导式', detect: (code) => /\[\s*\w+.*\bfor\s+\w+\s+in\s+/.test(code) },
  first_class:       { label: '第一个类定义', detect: (code) => /\bclass\s+\w+/.test(code) },
  first_try_except:  { label: '第一次异常处理', detect: (code) => /\btry\s*:/.test(code) && /\bexcept\b/.test(code) },
  first_import:      { label: '第一次导入模块', detect: (code) => /\bimport\s+/.test(code) },
  first_lambda:      { label: '第一个Lambda', detect: (code) => /\blambda\s+/.test(code) },
  first_f_string:    { label: '第一次f-string', detect: (code) => /f["']/.test(code) },
  first_nested_loop: { label: '第一个嵌套循环', detect: (code) => {
    const forMatches = code.match(/\bfor\s+\w+\s+in\s+/g)
    return forMatches && forMatches.length >= 2
  }},
  first_recursion:   { label: '第一次递归', detect: (code) => {
    const funcMatch = code.match(/\bdef\s+(\w+)\s*\(/)
    if (!funcMatch) return false
    const funcName = funcMatch[1]
    return new RegExp(`\\b${funcName}\\s*\\(`).test(code.slice(code.indexOf(':') + 1))
  }},
  code_10_lines:     { label: '写出10行代码', detect: (code) => code.split('\n').filter(l => l.trim() && !l.trim().startsWith('#')).length >= 10 },
  code_20_lines:     { label: '写出20行代码', detect: (code) => code.split('\n').filter(l => l.trim() && !l.trim().startsWith('#')).length >= 20 },
  first_debug_fix:   { label: '第一次修Bug成功', detect: () => false },
}

function _computeComplexity(code) {
  if (!code) return 0
  const lines = code.split('\n').filter(l => l.trim() && !l.trim().startsWith('#'))
  const lineCount = lines.length
  const indentLevels = lines.map(l => (l.match(/^\s*/)?.[0].length || 0) / 4)
  const maxIndent = Math.max(0, ...indentLevels)
  const uniqueKeywords = new Set()
  const keywords = ['def', 'class', 'for', 'while', 'if', 'elif', 'else', 'try', 'except',
                     'return', 'import', 'lambda', 'with', 'yield', 'raise', 'pass', 'break', 'continue']
  for (const kw of keywords) {
    if (new RegExp(`\\b${kw}\\b`).test(code)) uniqueKeywords.add(kw)
  }
  return Math.round(
    lineCount * 1.0 +
    maxIndent * 3.0 +
    uniqueKeywords.size * 2.0
  )
}

function _computeDiff(oldCode, newCode) {
  if (!oldCode) return [{ type: 'add', content: newCode }]
  const oldLines = oldCode.split('\n')
  const newLines = newCode.split('\n')
  const diffs = []

  const maxLen = Math.max(oldLines.length, newLines.length)
  for (let i = 0; i < maxLen; i++) {
    if (i >= oldLines.length) {
      diffs.push({ type: 'add', line: i, content: newLines[i] })
    } else if (i >= newLines.length) {
      diffs.push({ type: 'remove', line: i, content: oldLines[i] })
    } else if (oldLines[i] !== newLines[i]) {
      diffs.push({ type: 'change', line: i, old: oldLines[i], new: newLines[i] })
    }
  }
  return diffs.slice(0, 50)
}

export function useTemporalCodeDB() {
  const isReady = ref(false)
  const totalEntries = ref(0)
  const milestones = reactive({})
  const recentStrata = reactive([])
  const strataStats = reactive({
    totalCode: 0,
    avgComplexity: 0,
    peakComplexity: 0,
    totalExecutionTime: 0,
    successRate: 0,
  })

  let _db = null
  let _lastCode = null

  async function initialize() {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(DB_NAME, DB_VERSION)

      request.onerror = () => {
        console.error('[TemporalCodeDB] Failed to open database')
        isReady.value = false
        resolve(false)
      }

      request.onupgradeneeded = (event) => {
        const db = event.target.result

        if (!db.objectStoreNames.contains(STORE_NAME)) {
          const store = db.createObjectStore(STORE_NAME, { keyPath: 'id' })
          store.createIndex('timestamp', 'timestamp', { unique: false })
          store.createIndex('chapter', 'context.chapter', { unique: false })
          store.createIndex('character', 'context.character', { unique: false })
          store.createIndex('challenge', 'context.challenge', { unique: false })
          store.createIndex('complexity', 'complexity', { unique: false })
        }

        if (!db.objectStoreNames.contains(MILESTONE_STORE)) {
          db.createObjectStore(MILESTONE_STORE, { keyPath: 'id' })
        }
      }

      request.onsuccess = async (event) => {
        _db = event.target.result
        isReady.value = true
        await _loadMilestones()
        await _loadRecentStrata()
        await _computeStats()
        resolve(true)
      }
    })
  }

  async function recordCode(code, context = {}, execution = {}) {
    if (!_db || !code?.trim()) return null

    const id = `code_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`
    const complexity = _computeComplexity(code)
    const mutations = _lastCode ? _computeDiff(_lastCode, code) : null

    const entry = {
      id,
      timestamp: Date.now(),
      code: code.slice(0, 5000),
      complexity,
      context: {
        chapter: context.chapter || '',
        challenge: context.challenge || '',
        character: context.character || '',
        emotion: context.emotion || '',
        location: context.location || '',
        challengeType: context.challengeType || '',
      },
      execution: {
        success: execution.success ?? null,
        output: (execution.output || '').slice(0, 1000),
        stderr: (execution.stderr || '').slice(0, 500),
        duration_ms: execution.duration_ms || 0,
        attempts: execution.attempts || 1,
      },
      mutations: mutations?.slice(0, 30) || [],
      cognitiveSnapshot: context.cognitiveSnapshot || null,
    }

    _lastCode = code

    return new Promise((resolve) => {
      const tx = _db.transaction([STORE_NAME], 'readwrite')
      tx.objectStore(STORE_NAME).put(entry)
      tx.oncomplete = async () => {
        totalEntries.value++
        recentStrata.unshift(entry)
        if (recentStrata.length > 30) recentStrata.splice(30)
        await _detectMilestones(code, entry)
        await _computeStats()
        resolve(entry)
      }
      tx.onerror = () => resolve(null)
    })
  }

  async function _detectMilestones(code, entry) {
    const newMilestones = []
    for (const [milestoneId, detector] of Object.entries(MILESTONE_DETECTORS)) {
      if (milestones[milestoneId]) continue
      try {
        if (detector.detect(code)) {
          const milestone = {
            id: milestoneId,
            label: detector.label,
            timestamp: Date.now(),
            codeEntryId: entry.id,
            code: code.slice(0, 2000),
            context: entry.context,
          }
          milestones[milestoneId] = milestone
          newMilestones.push(milestone)
          await _saveMilestone(milestone)
        }
      } catch {}
    }
    return newMilestones
  }

  async function _saveMilestone(milestone) {
    if (!_db) return
    return new Promise((resolve) => {
      const tx = _db.transaction([MILESTONE_STORE], 'readwrite')
      tx.objectStore(MILESTONE_STORE).put(milestone)
      tx.oncomplete = () => resolve()
      tx.onerror = () => resolve()
    })
  }

  async function _loadMilestones() {
    if (!_db) return
    return new Promise((resolve) => {
      const tx = _db.transaction([MILESTONE_STORE], 'readonly')
      const request = tx.objectStore(MILESTONE_STORE).getAll()
      request.onsuccess = () => {
        for (const m of (request.result || [])) {
          milestones[m.id] = m
        }
        resolve()
      }
      request.onerror = () => resolve()
    })
  }

  async function _loadRecentStrata() {
    if (!_db) return
    return new Promise((resolve) => {
      const tx = _db.transaction([STORE_NAME], 'readonly')
      const store = tx.objectStore(STORE_NAME)
      const index = store.index('timestamp')
      const request = index.openCursor(null, 'prev')
      const results = []

      request.onsuccess = (event) => {
        const cursor = event.target.result
        if (cursor && results.length < 30) {
          results.push(cursor.value)
          cursor.continue()
        } else {
          recentStrata.push(...results)
          resolve()
        }
      }
      tx.oncomplete = () => {
        const countTx = _db.transaction([STORE_NAME], 'readonly')
        const countReq = countTx.objectStore(STORE_NAME).count()
        countReq.onsuccess = () => { totalEntries.value = countReq.result || recentStrata.length }
      }
      request.onerror = () => resolve()
    })
  }

  async function _computeStats() {
    if (!_db) return
    return new Promise((resolve) => {
      const tx = _db.transaction([STORE_NAME], 'readonly')
      const store = tx.objectStore(STORE_NAME)
      const request = store.getAll()

      request.onsuccess = () => {
        const all = request.result || []
        totalEntries.value = all.length
        if (all.length === 0) { resolve(); return }

        let totalComplexity = 0
        let peakComplexity = 0
        let totalExecTime = 0
        let successCount = 0

        for (const entry of all) {
          totalComplexity += entry.complexity || 0
          peakComplexity = Math.max(peakComplexity, entry.complexity || 0)
          totalExecTime += entry.execution?.duration_ms || 0
          if (entry.execution?.success) successCount++
        }

        strataStats.totalCode = all.length
        strataStats.avgComplexity = Math.round(totalComplexity / all.length)
        strataStats.peakComplexity = peakComplexity
        strataStats.totalExecutionTime = totalExecTime
        strataStats.successRate = all.length > 0 ? Math.round((successCount / all.length) * 100) / 100 : 0
        resolve()
      }
      request.onerror = () => resolve()
    })
  }

  async function findMilestone(milestoneId) {
    return milestones[milestoneId] || null
  }

  async function findByChapter(chapter) {
    if (!_db) return []
    return new Promise((resolve) => {
      const tx = _db.transaction([STORE_NAME], 'readonly')
      const index = tx.objectStore(STORE_NAME).index('chapter')
      const request = index.getAll(chapter)
      request.onsuccess = () => resolve(request.result || [])
      request.onerror = () => resolve([])
    })
  }

  async function findByChallenge(challengeId) {
    if (!_db) return []
    return new Promise((resolve) => {
      const tx = _db.transaction([STORE_NAME], 'readonly')
      const index = tx.objectStore(STORE_NAME).index('challenge')
      const request = index.getAll(challengeId)
      request.onsuccess = () => resolve(request.result || [])
      request.onerror = () => resolve([])
    })
  }

  async function findByCharacter(characterId) {
    if (!_db) return []
    return new Promise((resolve) => {
      const tx = _db.transaction([STORE_NAME], 'readonly')
      const index = tx.objectStore(STORE_NAME).index('character')
      const request = index.getAll(characterId)
      request.onsuccess = () => resolve(request.result || [])
      request.onerror = () => resolve([])
    })
  }

  async function getTimelineData(options = {}) {
    if (!_db) return { strata: [], milestoneMarkers: [] }
    const { since, until, limit = 100 } = options

    return new Promise((resolve) => {
      const tx = _db.transaction([STORE_NAME], 'readonly')
      const index = tx.objectStore(STORE_NAME).index('timestamp')
      const range = since && until
        ? IDBKeyRange.bound(since, until)
        : since
          ? IDBKeyRange.lowerBound(since)
          : null
      const request = index.getAll(range, limit)

      request.onsuccess = () => {
        const strata = (request.result || []).map(entry => ({
          id: entry.id,
          timestamp: entry.timestamp,
          complexity: entry.complexity,
          success: entry.execution?.success,
          chapter: entry.context?.chapter,
          character: entry.context?.character,
          challenge: entry.context?.challenge,
          codeSummary: _summarizeCode(entry.code),
          lineCount: entry.code.split('\n').filter(l => l.trim()).length,
        }))

        const milestoneMarkers = Object.values(milestones).map(m => ({
          id: m.id,
          label: m.label,
          timestamp: m.timestamp,
          codeEntryId: m.codeEntryId,
        }))

        resolve({ strata, milestoneMarkers })
      }
      request.onerror = () => resolve({ strata: [], milestoneMarkers: [] })
    })
  }

  function _summarizeCode(code) {
    if (!code) return ''
    const lines = code.split('\n').filter(l => l.trim())
    if (lines.length <= 3) return lines.join('\n')
    return lines.slice(0, 2).join('\n') + `\n... (${lines.length} lines)`
  }

  async function getCodeEntry(entryId) {
    if (!_db) return null
    return new Promise((resolve) => {
      const tx = _db.transaction([STORE_NAME], 'readonly')
      const request = tx.objectStore(STORE_NAME).get(entryId)
      request.onsuccess = () => resolve(request.result || null)
      request.onerror = () => resolve(null)
    })
  }

  function buildTemporalPromptCard(characterId) {
    const charMilestones = Object.values(milestones)
      .filter(m => !characterId || m.context?.character === characterId || !m.context?.character)
      .sort((a, b) => a.timestamp - b.timestamp)

    const recent = recentStrata.slice(0, 5)
    const lines = ['【代码考古卡】']

    if (charMilestones.length > 0) {
      lines.push(`代码里程碑：`)
      for (const m of charMilestones.slice(-5)) {
        const timeAgo = _formatTimeAgo(m.timestamp)
        lines.push(`  ★ ${m.label} (${timeAgo})`)
      }
      lines.push('角色可以引用这些里程碑作为"共同记忆"——"还记得你第一次写for循环吗？"')
    }

    if (recent.length > 0) {
      lines.push(`最近代码活动：`)
      for (const s of recent.slice(0, 3)) {
        const summary = _summarizeCode(s.code)
        lines.push(`  - ${s.execution?.success ? '✓' : '✗'} ${summary.split('\n')[0]}`)
      }
    }

    lines.push(`总代码量：${totalEntries.value} 份 | 成功率：${Math.round(strataStats.successRate * 100)}% | 最高复杂度：${strataStats.peakComplexity}`)

    return lines.join('\n')
  }

  function _formatTimeAgo(timestamp) {
    const diff = Date.now() - timestamp
    if (diff < 60000) return '刚才'
    if (diff < 3600000) return `${Math.round(diff / 60000)}分钟前`
    if (diff < 86400000) return `${Math.round(diff / 3600000)}小时前`
    return `${Math.round(diff / 86400000)}天前`
  }

  function getMilestonesList() {
    return Object.values(milestones).sort((a, b) => a.timestamp - b.timestamp)
  }

  function recordDebugFix(codeEntry) {
    if (!milestones.first_debug_fix) {
      const milestone = {
        id: 'first_debug_fix',
        label: MILESTONE_DETECTORS.first_debug_fix.label,
        timestamp: Date.now(),
        codeEntryId: codeEntry?.id || null,
        code: codeEntry?.code?.slice(0, 2000) || '',
        context: codeEntry?.context || {},
      }
      milestones.first_debug_fix = milestone
      _saveMilestone(milestone)
    }
  }

  return {
    isReady,
    totalEntries,
    milestones,
    recentStrata,
    strataStats,

    initialize,
    recordCode,
    recordDebugFix,
    findMilestone,
    findByChapter,
    findByChallenge,
    findByCharacter,
    getTimelineData,
    getCodeEntry,
    getMilestonesList,

    buildTemporalPromptCard,
  }
}
