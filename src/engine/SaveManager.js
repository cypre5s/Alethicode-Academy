import { ref } from 'vue'

const SAVE_PREFIX = 'alethicode_save_'
const AUTO_KEY = 'alethicode_save_auto'
const QUICK_KEY = 'alethicode_save_quick'
const SETTINGS_KEY = 'alethicode_settings'
const GLOBAL_KEY = 'alethicode_global'
const MAX_SLOTS = 6
const CURRENT_VERSION = '3.1.0'
const CHECKSUM_SALT = 'alethicode_v3_salt'
const MAX_SAVE_SIZE = 512 * 1024

function _computeChecksum(obj) {
  const copy = { ...obj }
  delete copy._checksum
  const str = JSON.stringify(copy)
  let hash = 0
  for (let i = 0; i < str.length; i++) {
    hash = ((hash << 5) - hash + str.charCodeAt(i)) | 0
  }
  return (CHECKSUM_SALT + Math.abs(hash).toString(36))
}

function _migrateMemories(memories) {
  if (!memories || typeof memories !== 'object') return {}
  const result = {}
  for (const [charId, entries] of Object.entries(memories)) {
    if (!Array.isArray(entries)) { result[charId] = []; continue }
    result[charId] = entries.map((entry, idx) => {
      if (typeof entry === 'string') {
        return {
          id: `mem_${charId}_migrated_${idx}`,
          text: entry,
          context: '',
          chapter: '',
          timestamp: Date.now() - (entries.length - idx) * 60000,
          emotion: 'warm',
          relStageAtTime: '',
          source: 'free_talk',
        }
      }
      return entry
    })
  }
  return result
}

function _validateSaveStructure(data) {
  if (!data || typeof data !== 'object') return false
  if (typeof data.currentChapter !== 'string') return false
  if (typeof data.timestamp !== 'number' || data.timestamp > Date.now() + 86400000) return false
  const hasRelationship = typeof data.relationship === 'object' && data.relationship !== null
  const hasAffection = typeof data.affection === 'object' && data.affection !== null
  if (!hasRelationship && !hasAffection) return false
  if (hasAffection) {
    for (const [, val] of Object.entries(data.affection)) {
      if (typeof val === 'number' && (val < 0 || val > 200)) return false
    }
  }
  return true
}

export function useSaveManager() {
  const saves = ref(loadAllSaves())

  function isStorageHealthy() {
    try {
      const key = '__alethicode_storage_probe__'
      localStorage.setItem(key, 'ok')
      localStorage.removeItem(key)
      return true
    } catch {
      return false
    }
  }

  function loadAllSaves() {
    if (!isStorageHealthy()) {
      return Array.from({ length: MAX_SLOTS }, () => null)
    }
    const result = []
    for (let i = 0; i < MAX_SLOTS; i++) {
      try {
        const raw = localStorage.getItem(SAVE_PREFIX + i)
        result.push(raw ? JSON.parse(raw) : null)
      } catch { result.push(null) }
    }
    return result
  }

  function saveToSlot(slotIndex, state) {
    if (!isStorageHealthy()) return { error: 'storage_unavailable' }
    const data = {
      ...state,
      timestamp: Date.now(),
      slotIndex,
      version: CURRENT_VERSION,
      dateStr: new Date().toLocaleString('zh-CN')
    }
    data._checksum = _computeChecksum(data)
    try {
      const serialized = JSON.stringify(data)
      if (serialized.length > MAX_SAVE_SIZE) return { error: 'save_too_large' }
      localStorage.setItem(SAVE_PREFIX + slotIndex, serialized)
      saves.value[slotIndex] = data
      return { ok: true }
    } catch (e) {
      if (e.name === 'QuotaExceededError' || e.code === 22) {
        return { error: 'quota_exceeded' }
      }
      return { error: 'unknown', message: e.message }
    }
  }

  function loadFromSlot(slotIndex) {
    if (!isStorageHealthy()) return { error: 'storage_unavailable' }
    try {
      const raw = localStorage.getItem(SAVE_PREFIX + slotIndex)
      if (!raw) return null
      if (raw.length > MAX_SAVE_SIZE) return { error: 'corrupted' }
      const data = JSON.parse(raw)
      if (!_validateSaveStructure(data)) {
        return { error: 'corrupted', data }
      }
      if (data._checksum && data._checksum !== _computeChecksum(data)) {
        return { error: 'tampered' }
      }
      if (data.version && data.version !== CURRENT_VERSION) {
        if (data.version === '3.0.0') {
          data.version = CURRENT_VERSION
          data.memories = _migrateMemories(data.memories)
          data.visitLog = data.visitLog || {}
        } else {
          return { error: 'version_mismatch', data, savedVersion: data.version, currentVersion: CURRENT_VERSION }
        }
      }
      return data
    } catch { return { error: 'corrupted' } }
  }

  function deleteSlot(slotIndex) {
    if (!isStorageHealthy()) return
    localStorage.removeItem(SAVE_PREFIX + slotIndex)
    saves.value[slotIndex] = null
  }

  function saveAuto(state) {
    if (!isStorageHealthy()) return
    const data = { ...state, timestamp: Date.now(), dateStr: new Date().toLocaleString('zh-CN'), version: CURRENT_VERSION }
    data._checksum = _computeChecksum(data)
    try { localStorage.setItem(AUTO_KEY, JSON.stringify(data)) }
    catch (e) { console.warn('Auto save failed:', e) }
  }

  function loadAuto() {
    if (!isStorageHealthy()) return { error: 'storage_unavailable' }
    try {
      const raw = localStorage.getItem(AUTO_KEY)
      if (!raw) return null
      const data = JSON.parse(raw)
      if (!data.currentChapter || !data.affection) {
        return { error: 'corrupted', data }
      }
      return data
    } catch { return { error: 'corrupted' } }
  }

  function refresh() {
    saves.value = loadAllSaves()
  }

  function quickSave(state) {
    if (!isStorageHealthy()) return
    const data = { ...state, timestamp: Date.now(), dateStr: new Date().toLocaleString('zh-CN'), version: CURRENT_VERSION }
    data._checksum = _computeChecksum(data)
    try { localStorage.setItem(QUICK_KEY, JSON.stringify(data)) }
    catch {}
  }

  function quickLoad() {
    if (!isStorageHealthy()) return null
    try {
      const raw = localStorage.getItem(QUICK_KEY)
      if (!raw) return null
      const data = JSON.parse(raw)
      if (!data.currentChapter || !data.affection) return null
      return data
    } catch { return null }
  }

  function saveSettings(settings) {
    if (!isStorageHealthy()) return
    try { localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings)) }
    catch {}
  }

  function loadSettings() {
    if (!isStorageHealthy()) return null
    try {
      const raw = localStorage.getItem(SETTINGS_KEY)
      return raw ? JSON.parse(raw) : null
    } catch { return null }
  }

  function saveGlobal(globalData) {
    if (!isStorageHealthy()) return
    try { localStorage.setItem(GLOBAL_KEY, JSON.stringify(globalData)) }
    catch {}
  }

  function loadGlobal() {
    if (!isStorageHealthy()) return null
    try {
      const raw = localStorage.getItem(GLOBAL_KEY)
      return raw ? JSON.parse(raw) : null
    } catch { return null }
  }

  return {
    saves, saveToSlot, loadFromSlot, deleteSlot, saveAuto, loadAuto,
    quickSave, quickLoad,
    saveSettings, loadSettings,
    saveGlobal, loadGlobal,
    refresh, isStorageHealthy,
    MAX_SLOTS
  }
}
