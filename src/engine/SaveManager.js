import { ref } from 'vue'

const SAVE_PREFIX = 'alethicode_save_'
const AUTO_KEY = 'alethicode_save_auto'
const QUICK_KEY = 'alethicode_save_quick'
const SETTINGS_KEY = 'alethicode_settings'
const GLOBAL_KEY = 'alethicode_global'
const MAX_SLOTS = 6
const CURRENT_VERSION = '3.0.0'

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
    try {
      localStorage.setItem(SAVE_PREFIX + slotIndex, JSON.stringify(data))
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
      const data = JSON.parse(raw)
      if (!data.currentChapter || !data.affection) {
        return { error: 'corrupted', data }
      }
      if (data.version && data.version !== CURRENT_VERSION) {
        return { error: 'version_mismatch', data, savedVersion: data.version, currentVersion: CURRENT_VERSION }
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
    const data = { ...state, timestamp: Date.now(), dateStr: new Date().toLocaleString('zh-CN'), version: '3.0.0' }
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
