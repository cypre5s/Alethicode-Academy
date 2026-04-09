import assert from 'node:assert/strict'
import test from 'node:test'

import { useSaveManager } from '../src/engine/SaveManager.js'

function createMockStorage({ failWrites = false } = {}) {
  const store = new Map()
  return {
    getItem(key) {
      return store.has(key) ? store.get(key) : null
    },
    setItem(key, value) {
      if (failWrites) throw new Error('storage unavailable')
      store.set(key, String(value))
    },
    removeItem(key) {
      store.delete(key)
    },
    clear() {
      store.clear()
    },
  }
}

test('SaveManager 支持本地存档读写删除', () => {
  globalThis.localStorage = createMockStorage()
  const saveManager = useSaveManager()

  const state = { currentChapter: 'chapter1', currentBg: 'school_gate_day', affection: { nene: 0 } }
  saveManager.saveToSlot(0, state)

  const loaded = saveManager.loadFromSlot(0)
  assert.equal(loaded.currentChapter, 'chapter1')
  assert.equal(loaded.currentBg, 'school_gate_day')
  assert.equal(loaded.slotIndex, 0)

  saveManager.deleteSlot(0)
  assert.equal(saveManager.loadFromSlot(0), null)
})

test('SaveManager 支持自动存档回读', () => {
  globalThis.localStorage = createMockStorage()
  const saveManager = useSaveManager()

  saveManager.saveAuto({ currentChapter: 'chapter2', affection: { nene: 12 } })
  const loaded = saveManager.loadAuto()

  assert.equal(loaded.currentChapter, 'chapter2')
  assert.equal(loaded.affection.nene, 12)
})

test('SaveManager 遇到损坏 JSON 不崩溃', () => {
  const storage = createMockStorage()
  storage.setItem('alethicode_save_0', '{bad json')
  globalThis.localStorage = storage

  const saveManager = useSaveManager()
  const result = saveManager.loadFromSlot(0)
  assert.equal(result?.error, 'corrupted')
})

test('SaveManager 可检测本地存储健康状态', () => {
  globalThis.localStorage = createMockStorage({ failWrites: true })
  const saveManager = useSaveManager()

  assert.equal(saveManager.isStorageHealthy(), false)
  assert.doesNotThrow(() => saveManager.saveToSlot(0, { currentChapter: 'chapter1' }))
  const result = saveManager.loadFromSlot(0)
  assert.equal(result?.error, 'storage_unavailable')
})
