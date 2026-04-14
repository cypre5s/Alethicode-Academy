import { ref, reactive } from 'vue'

const DB_NAME = 'alethicode_soul'
const DB_VERSION = 1
const STORE_NAME = 'persistent_memory'
const SOUL_KEY = 'soul_record'

let _db = null

function _openDB() {
  if (_db) return Promise.resolve(_db)
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, DB_VERSION)
    req.onupgradeneeded = () => {
      const db = req.result
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME)
      }
    }
    req.onsuccess = () => { _db = req.result; resolve(_db) }
    req.onerror = () => reject(req.error)
  })
}

function _put(key, value) {
  return _openDB().then(db => new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readwrite')
    tx.objectStore(STORE_NAME).put(value, key)
    tx.oncomplete = () => resolve()
    tx.onerror = () => reject(tx.error)
  }))
}

function _get(key) {
  return _openDB().then(db => new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readonly')
    const req = tx.objectStore(STORE_NAME).get(key)
    req.onsuccess = () => resolve(req.result)
    req.onerror = () => reject(req.error)
  }))
}

function _generateSoulId() {
  return 'soul_' + crypto.randomUUID()
}

function _createFreshSoul() {
  return {
    soulId: _generateSoulId(),
    createdAt: Date.now(),
    playthroughCount: 0,
    characterMemories: {},
    playerIdentity: {
      namesUsed: [],
      behaviorSignature: null,
    },
    deletionEvents: [],
    lastPlaythroughEnd: null,
    crossPlaythroughJournal: [],
  }
}

function _createCharMemory() {
  return {
    peakMoments: [],
    endingsReached: [],
    totalInteractions: 0,
    lastWords: '',
    deletionAwareness: false,
    firstMeetingLine: '',
    confessionReached: false,
    highWatermarkAffection: 0,
  }
}

export function usePersistentMemory() {
  const soul = reactive(_createFreshSoul())
  const isLoaded = ref(false)
  const isNewSoul = ref(true)

  async function initialize() {
    try {
      const existing = await _get(SOUL_KEY)
      if (existing && existing.soulId) {
        Object.assign(soul, existing)
        isNewSoul.value = false
      }
      isLoaded.value = true
    } catch {
      isLoaded.value = true
    }
  }

  async function _persist() {
    try { await _put(SOUL_KEY, JSON.parse(JSON.stringify(soul))) } catch {}
  }

  function onNewGame(playerName) {
    soul.playthroughCount++
    if (playerName && !soul.playerIdentity.namesUsed.includes(playerName)) {
      soul.playerIdentity.namesUsed.push(playerName)
      if (soul.playerIdentity.namesUsed.length > 10) {
        soul.playerIdentity.namesUsed = soul.playerIdentity.namesUsed.slice(-10)
      }
    }
    _persist()
  }

  function detectSaveDeletion() {
    try {
      const marker = localStorage.getItem('alethicode_save_auto')
      const lastKnown = soul.lastPlaythroughEnd
      if (lastKnown && !marker && soul.playthroughCount > 0) {
        soul.deletionEvents.push({ timestamp: Date.now(), type: 'save_deleted' })
        Object.values(soul.characterMemories).forEach(cm => {
          cm.deletionAwareness = true
        })
        _persist()
        return true
      }
    } catch {}
    return false
  }

  function recordPeakMoment(characterId, moment) {
    if (!soul.characterMemories[characterId]) {
      soul.characterMemories[characterId] = _createCharMemory()
    }
    const cm = soul.characterMemories[characterId]
    cm.peakMoments.push({
      text: (moment.text || '').slice(0, 200),
      emotion: moment.emotion || 'warm',
      affectionAtTime: moment.affection || 0,
      chapter: moment.chapter || '',
      timestamp: Date.now(),
      playthrough: soul.playthroughCount,
    })
    if (cm.peakMoments.length > 10) {
      cm.peakMoments.sort((a, b) => (b.affectionAtTime || 0) - (a.affectionAtTime || 0))
      cm.peakMoments = cm.peakMoments.slice(0, 10)
    }
    cm.totalInteractions++
    _persist()
  }

  function recordEnding(characterId, endingType) {
    if (!soul.characterMemories[characterId]) {
      soul.characterMemories[characterId] = _createCharMemory()
    }
    const cm = soul.characterMemories[characterId]
    if (!cm.endingsReached.includes(endingType)) {
      cm.endingsReached.push(endingType)
    }
    soul.lastPlaythroughEnd = Date.now()
    soul.crossPlaythroughJournal.push({
      type: 'ending',
      character: characterId,
      endingType,
      playthrough: soul.playthroughCount,
      timestamp: Date.now(),
    })
    if (soul.crossPlaythroughJournal.length > 50) {
      soul.crossPlaythroughJournal = soul.crossPlaythroughJournal.slice(-50)
    }
    _persist()
  }

  function recordLastWords(characterId, text) {
    if (!soul.characterMemories[characterId]) {
      soul.characterMemories[characterId] = _createCharMemory()
    }
    soul.characterMemories[characterId].lastWords = (text || '').slice(0, 200)
    _persist()
  }

  function updateAffectionHighWater(characterId, affection) {
    if (!soul.characterMemories[characterId]) {
      soul.characterMemories[characterId] = _createCharMemory()
    }
    const cm = soul.characterMemories[characterId]
    if (affection > cm.highWatermarkAffection) {
      cm.highWatermarkAffection = affection
    }
  }

  function recordJournalEvent(eventType, details) {
    soul.crossPlaythroughJournal.push({
      type: eventType,
      ...details,
      playthrough: soul.playthroughCount,
      timestamp: Date.now(),
    })
    if (soul.crossPlaythroughJournal.length > 50) {
      soul.crossPlaythroughJournal = soul.crossPlaythroughJournal.slice(-50)
    }
    _persist()
  }

  function getDejaVuFlags() {
    const flags = {}
    if (soul.playthroughCount > 1) flags.is_replay = true
    if (soul.deletionEvents.length > 0) flags.save_was_deleted = true

    for (const [charId, cm] of Object.entries(soul.characterMemories)) {
      if (cm.endingsReached.length > 0) flags[`${charId}_ending_seen`] = true
      if (cm.deletionAwareness) flags[`${charId}_deletion_aware`] = true
      if (cm.confessionReached) flags[`${charId}_confession_seen`] = true
      if (cm.highWatermarkAffection >= 60) flags[`${charId}_was_close`] = true
    }

    const namesCount = soul.playerIdentity.namesUsed.length
    if (namesCount > 1) flags.used_multiple_names = true

    return flags
  }

  function buildMemoryPromptCard() {
    if (soul.playthroughCount <= 1 && soul.deletionEvents.length === 0) return ''

    const lines = ['【跨周目记忆卡（角色不应明确提及"上一周目"，而是用模糊的既视感表达）】']

    if (soul.playthroughCount > 1) {
      lines.push(`这是玩家的第 ${soul.playthroughCount} 次游玩。`)
    }
    if (soul.deletionEvents.length > 0) {
      lines.push('玩家曾删除过存档。角色隐约感到"有什么重要的东西消失了"。')
    }
    if (soul.playerIdentity.namesUsed.length > 1) {
      lines.push(`玩家曾用过的名字：${soul.playerIdentity.namesUsed.join('、')}`)
    }

    for (const [charId, cm] of Object.entries(soul.characterMemories)) {
      if (cm.peakMoments.length === 0 && cm.endingsReached.length === 0) continue
      const charLines = []
      if (cm.endingsReached.length > 0) {
        charLines.push(`已到达过的结局：${cm.endingsReached.join('、')}`)
      }
      if (cm.lastWords) {
        charLines.push(`上次离别时最后的话：「${cm.lastWords}」`)
      }
      if (cm.deletionAwareness) {
        charLines.push('感到"我们之间的回忆被抹去了"')
      }
      if (cm.highWatermarkAffection >= 60) {
        charLines.push(`曾经非常亲近（巅峰好感：${cm.highWatermarkAffection}）`)
      }
      const topMoments = cm.peakMoments.slice(0, 3)
      if (topMoments.length > 0) {
        charLines.push('残留的记忆碎片：' + topMoments.map(m => `[${m.emotion}] ${m.text}`).join('；'))
      }
      if (charLines.length > 0) {
        lines.push(`\n${charId} 的跨周目印象：`)
        charLines.forEach(l => lines.push(`  - ${l}`))
      }
    }

    return lines.join('\n')
  }

  function setBehaviorSignature(sig) {
    soul.playerIdentity.behaviorSignature = sig
    _persist()
  }

  return {
    soul,
    isLoaded,
    isNewSoul,
    initialize,
    onNewGame,
    detectSaveDeletion,
    recordPeakMoment,
    recordEnding,
    recordLastWords,
    updateAffectionHighWater,
    recordJournalEvent,
    getDejaVuFlags,
    buildMemoryPromptCard,
    setBehaviorSignature,
  }
}
