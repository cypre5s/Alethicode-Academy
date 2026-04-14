import { ref, reactive, computed } from 'vue'

const GPU_TOTAL_MB = 8192
const GPU_RESERVED_MB = 512

const MODEL_PROFILES = {
  llm: { name: 'Local LLM', vramMB: 4500, warmupMs: 5000, priority: 1 },
  tts: { name: 'Voice Synth', vramMB: 1500, warmupMs: 3000, priority: 2 },
  sd:  { name: 'Image Gen',   vramMB: 4000, warmupMs: 15000, priority: 3 },
}

const allocations = reactive({})
const pendingSwaps = ref([])
const isSwapping = ref(false)

function _isElectron() {
  return typeof window !== 'undefined' && window.electronAPI
}

export function useGPUScheduler() {

  const availableVRAM = computed(() => {
    let used = 0
    for (const v of Object.values(allocations)) used += v
    return GPU_TOTAL_MB - GPU_RESERVED_MB - used
  })

  const canFit = (modelId) => {
    const profile = MODEL_PROFILES[modelId]
    if (!profile) return false
    return availableVRAM.value >= profile.vramMB
  }

  const canCoexist = (a, b) => {
    const pa = MODEL_PROFILES[a]
    const pb = MODEL_PROFILES[b]
    if (!pa || !pb) return false
    return pa.vramMB + pb.vramMB <= GPU_TOTAL_MB - GPU_RESERVED_MB
  }

  async function requestSlot(modelId) {
    if (!_isElectron()) return { success: false, error: 'Not in Electron' }

    const result = await window.electronAPI.invoke('sidecar:request-gpu', { id: modelId })
    if (result.success) {
      allocations[modelId] = result.allocatedMB
    }
    return result
  }

  async function releaseSlot(modelId) {
    if (!_isElectron()) return
    await window.electronAPI.invoke('sidecar:release-gpu', { id: modelId })
    delete allocations[modelId]
  }

  async function swapForTask(targetModelId, taskFn) {
    if (canFit(targetModelId)) {
      const result = await requestSlot(targetModelId)
      if (!result.success) return { success: false, error: result.error }

      try {
        const taskResult = await taskFn()
        return { success: true, result: taskResult }
      } finally {
        await releaseSlot(targetModelId)
      }
    }

    isSwapping.value = true
    const evictable = Object.keys(allocations)
      .filter(id => id !== targetModelId)
      .map(id => ({ id, ...MODEL_PROFILES[id] }))
      .sort((a, b) => b.priority - a.priority)

    const evicted = []
    let freed = 0
    const needed = MODEL_PROFILES[targetModelId]?.vramMB || 0

    for (const e of evictable) {
      if (availableVRAM.value + freed >= needed) break
      evicted.push(e.id)
      freed += allocations[e.id] || e.vramMB
    }

    for (const id of evicted) {
      await window.electronAPI.invoke('sidecar:stop', { id })
      delete allocations[id]
    }

    const reqResult = await requestSlot(targetModelId)
    if (!reqResult.success) {
      isSwapping.value = false
      return { success: false, error: reqResult.error }
    }

    try {
      const taskResult = await taskFn()
      return { success: true, result: taskResult, evicted }
    } finally {
      await releaseSlot(targetModelId)

      for (const id of evicted) {
        if (canFit(id)) {
          await window.electronAPI.invoke('sidecar:start', { id })
          await requestSlot(id)
        }
      }
      isSwapping.value = false
    }
  }

  async function syncStatus() {
    if (!_isElectron()) return
    try {
      const budget = await window.electronAPI.invoke('sidecar:gpu-budget')
      if (budget.allocations) {
        for (const key of Object.keys(allocations)) delete allocations[key]
        Object.assign(allocations, budget.allocations)
      }
    } catch {}
  }

  const warmModels = reactive(new Set())
  const coldModels = reactive(new Set())

  async function warmUp(modelId) {
    if (warmModels.has(modelId)) return true
    const result = await requestSlot(modelId)
    if (result.success) {
      warmModels.add(modelId)
      coldModels.delete(modelId)
      if (_isElectron()) {
        await window.electronAPI.invoke('sidecar:start', { id: modelId })
      }
    }
    return result.success
  }

  async function coolDown(modelId) {
    if (!warmModels.has(modelId)) return
    warmModels.delete(modelId)
    coldModels.add(modelId)
    await releaseSlot(modelId)
    if (_isElectron()) {
      await window.electronAPI.invoke('sidecar:stop', { id: modelId })
    }
  }

  async function ensureReady(modelId) {
    if (warmModels.has(modelId)) return true
    return warmUp(modelId)
  }

  function getOptimalConfig() {
    const budget = GPU_TOTAL_MB - GPU_RESERVED_MB
    const configs = []

    if (budget >= MODEL_PROFILES.llm.vramMB + MODEL_PROFILES.tts.vramMB) {
      configs.push({ models: ['llm', 'tts'], label: 'LLM + TTS 共存' })
    }
    if (budget >= MODEL_PROFILES.llm.vramMB) {
      configs.push({ models: ['llm'], label: '仅 LLM' })
    }
    if (budget >= MODEL_PROFILES.tts.vramMB) {
      configs.push({ models: ['tts'], label: '仅 TTS' })
    }
    if (budget >= MODEL_PROFILES.sd.vramMB) {
      configs.push({ models: ['sd'], label: '仅图像生成 (需卸载其他)' })
    }

    return configs
  }

  return {
    allocations,
    availableVRAM,
    isSwapping,
    warmModels,
    coldModels,
    canFit,
    canCoexist,
    requestSlot,
    releaseSlot,
    swapForTask,
    syncStatus,
    warmUp,
    coolDown,
    ensureReady,
    getOptimalConfig,
    MODEL_PROFILES,
  }
}
