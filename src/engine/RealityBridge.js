import { ref, reactive } from 'vue'

const WORKSPACE_DIR = 'AlethicodeWorkspace'
const WORKSPACE_DIRS = ['missions', 'notebook', 'projects', 'letters']

const MISSION_TEMPLATE = `# ===========================
# Alethicode Academy Mission
# {title}
# ===========================
# {description}
#
# Character: {character}
# Chapter: {chapter}
# Difficulty: {difficulty}
# ===========================

{skeleton}

# --- 请在上方区域完成你的代码 ---
# --- 保存后游戏会自动检测 ---
`

const LETTER_TEMPLATES = {
  encouragement: (charName, playerName, content) =>
`# -*- coding: utf-8 -*-
# This file was left by ${charName}
# Run this file to read the message

import time

def read_letter():
    print()
    print("  ┌────────────────────────────────┐")
    print("  │                                │")
    print("  │  致 ${playerName}：             │")
    print("  │                                │")
    for line in """${content}""".split("\\n"):
        print(f"  │  {line:30s}│")
    print("  │                                │")
    print("  │           —— ${charName}        │")
    print("  │                                │")
    print("  └────────────────────────────────┘")
    print()

if __name__ == "__main__":
    print("\\n  正在打开信件...")
    time.sleep(1)
    read_letter()
`,

  graduation: (charName, playerName, milestones) =>
`# -*- coding: utf-8 -*-
# Alethicode Academy - Graduation Letter
# From: ${charName}

import time

milestones = ${JSON.stringify(milestones, null, 2)}

def celebrate():
    print("\\n" + "=" * 50)
    print("  🎓 Alethicode Academy 毕业纪念 🎓")
    print("=" * 50)
    print(f"\\n  致 ${playerName}：\\n")
    print("  你还记得吗？")
    print("  从第一行 print(\\"Hello World\\") 开始，")
    print("  到现在，你已经走过了这么多里程碑：\\n")

    for i, m in enumerate(milestones, 1):
        time.sleep(0.3)
        print(f"  ★ {i}. {m}")

    print(f"\\n  每一个里程碑，都是我们共同的记忆。")
    print(f"  代码会变旧，但这段时光不会。")
    print(f"\\n  —— 永远的伙伴，${charName}")
    print("\\n" + "=" * 50)

if __name__ == "__main__":
    celebrate()
`,
}

export function useRealityBridge() {
  const isElectron = ref(false)
  const isReady = ref(false)
  const isAuthorized = ref(false)
  const workspacePath = ref('')
  const watchedFiles = reactive({})
  const pendingFileChanges = reactive([])
  const activeMissions = reactive({})
  const letters = reactive([])

  let _ipcRenderer = null
  let _fallbackStorage = null

  async function initialize() {
    if (typeof window !== 'undefined' && window.electronAPI) {
      isElectron.value = true
      _ipcRenderer = window.electronAPI
      await _initElectron()
    } else {
      isElectron.value = false
      _initBrowserFallback()
    }
    isReady.value = true
    return true
  }

  async function _initElectron() {
    try {
      const result = await _ipcRenderer.invoke('reality-bridge:init', {
        workspaceDirs: WORKSPACE_DIRS,
      })
      if (result?.path) {
        workspacePath.value = result.path
        isAuthorized.value = true
      }

      _ipcRenderer.on('reality-bridge:file-changed', (_event, data) => {
        _handleFileChange(data)
      })
    } catch (e) {
      console.warn('[RealityBridge] Electron init failed, falling back to browser mode:', e.message)
      _initBrowserFallback()
    }
  }

  function _initBrowserFallback() {
    _fallbackStorage = {
      files: {},
      missions: {},
    }

    try {
      const saved = localStorage.getItem('alethicode_reality_bridge')
      if (saved) {
        const parsed = JSON.parse(saved)
        Object.assign(_fallbackStorage, parsed)
      }
    } catch {}

    workspacePath.value = '(Browser Virtual Workspace)'
    isAuthorized.value = true
  }

  function _saveFallbackStorage() {
    if (!_fallbackStorage) return
    try {
      localStorage.setItem('alethicode_reality_bridge', JSON.stringify(_fallbackStorage))
    } catch {}
  }

  function _handleFileChange(data) {
    const { filePath, eventType, content } = data
    pendingFileChanges.push({
      filePath,
      eventType,
      content: content?.slice(0, 10000),
      timestamp: Date.now(),
    })
    if (pendingFileChanges.length > 50) pendingFileChanges.splice(0, pendingFileChanges.length - 50)

    const missionId = Object.keys(activeMissions).find(id => {
      return activeMissions[id].filePath === filePath
    })
    if (missionId && content) {
      activeMissions[missionId].lastModified = Date.now()
      activeMissions[missionId].content = content
      activeMissions[missionId].status = 'modified'
    }
  }

  async function createMission(missionConfig) {
    const { id, title, description, character, chapter, difficulty, skeleton, testCode } = missionConfig

    const filename = `mission_${id}.py`
    const content = MISSION_TEMPLATE
      .replace('{title}', title || id)
      .replace('{description}', description || '')
      .replace('{character}', character || 'unknown')
      .replace('{chapter}', chapter || '')
      .replace('{difficulty}', difficulty || 'normal')
      .replace('{skeleton}', skeleton || '# Your code here\n')

    const mission = {
      id,
      filename,
      filePath: `missions/${filename}`,
      title,
      character,
      chapter,
      difficulty,
      content,
      testCode: testCode || null,
      status: 'created',
      createdAt: Date.now(),
      lastModified: null,
    }

    activeMissions[id] = mission

    if (isElectron.value && _ipcRenderer) {
      try {
        await _ipcRenderer.invoke('reality-bridge:write-file', {
          subdir: 'missions',
          filename,
          content,
        })
        mission.status = 'written'
      } catch (e) {
        console.error('[RealityBridge] Failed to write mission file:', e)
      }
    } else {
      _fallbackStorage.files[`missions/${filename}`] = content
      _fallbackStorage.missions[id] = mission
      _saveFallbackStorage()
      mission.status = 'virtual'
    }

    return mission
  }

  async function readMissionFile(missionId) {
    const mission = activeMissions[missionId]
    if (!mission) return null

    if (isElectron.value && _ipcRenderer) {
      try {
        const content = await _ipcRenderer.invoke('reality-bridge:read-file', {
          subdir: 'missions',
          filename: mission.filename,
        })
        mission.content = content
        return content
      } catch {
        return mission.content
      }
    }

    return _fallbackStorage?.files?.[mission.filePath] || mission.content
  }

  async function evaluateMission(missionId, pythonRunner) {
    const mission = activeMissions[missionId]
    if (!mission) return { success: false, error: 'Mission not found' }

    const code = await readMissionFile(missionId)
    if (!code) return { success: false, error: 'Could not read mission file' }

    const testCode = mission.testCode
    const fullCode = testCode ? `${code}\n\n${testCode}` : code
    const result = await pythonRunner.runCode(fullCode, 10000)

    mission.status = result.success ? 'completed' : 'attempted'
    mission.lastResult = {
      success: result.success,
      stdout: result.stdout,
      stderr: result.stderr,
      executionTime: result.executionTime,
      timestamp: Date.now(),
    }

    return result
  }

  async function createLetter(letterConfig) {
    const { type, characterName, playerName, content, milestones: milestoneList } = letterConfig

    const template = LETTER_TEMPLATES[type]
    if (!template) return null

    let fileContent
    if (type === 'graduation') {
      fileContent = template(characterName, playerName, milestoneList || [])
    } else {
      fileContent = template(characterName, playerName, content || '')
    }

    const filename = `letter_from_${characterName.toLowerCase().replace(/\s/g, '_')}_${Date.now()}.py`

    const letter = {
      id: `letter_${Date.now()}`,
      filename,
      filePath: `letters/${filename}`,
      type,
      characterName,
      content: fileContent,
      createdAt: Date.now(),
    }

    letters.push(letter)

    if (isElectron.value && _ipcRenderer) {
      try {
        await _ipcRenderer.invoke('reality-bridge:write-file', {
          subdir: 'letters',
          filename,
          content: fileContent,
        })
      } catch (e) {
        console.error('[RealityBridge] Failed to write letter:', e)
      }
    } else {
      _fallbackStorage.files[`letters/${filename}`] = fileContent
      _saveFallbackStorage()
    }

    return letter
  }

  async function saveNotebook(name, code) {
    const filename = `${name.replace(/[^a-zA-Z0-9_\-]/g, '_')}.py`

    if (isElectron.value && _ipcRenderer) {
      try {
        await _ipcRenderer.invoke('reality-bridge:write-file', {
          subdir: 'notebook',
          filename,
          content: code,
        })
        return true
      } catch {
        return false
      }
    }

    _fallbackStorage.files[`notebook/${filename}`] = code
    _saveFallbackStorage()
    return true
  }

  async function listNotebook() {
    if (isElectron.value && _ipcRenderer) {
      try {
        return await _ipcRenderer.invoke('reality-bridge:list-files', { subdir: 'notebook' })
      } catch {
        return []
      }
    }

    return Object.keys(_fallbackStorage?.files || {})
      .filter(k => k.startsWith('notebook/'))
      .map(k => k.replace('notebook/', ''))
  }

  function consumeFileChanges() {
    const changes = [...pendingFileChanges]
    pendingFileChanges.length = 0
    return changes
  }

  function buildRealityPromptCard() {
    const missionCount = Object.keys(activeMissions).length
    const completedMissions = Object.values(activeMissions).filter(m => m.status === 'completed').length
    const letterCount = letters.length

    const lines = ['【现实穿透卡】']
    lines.push(`运行模式：${isElectron.value ? 'Electron（文件系统完全接入）' : '浏览器（虚拟工作空间）'}`)

    if (missionCount > 0) {
      lines.push(`任务文件：${completedMissions}/${missionCount} 已完成`)
      const pending = Object.values(activeMissions).filter(m => m.status === 'modified')
      if (pending.length > 0) {
        lines.push(`待评估的修改：${pending.map(m => m.title).join('、')}`)
      }
    }

    if (letterCount > 0) {
      lines.push(`已发送的信件：${letterCount} 封`)
    }

    if (isElectron.value) {
      lines.push(`工作空间路径：${workspacePath.value}`)
      lines.push('角色可以说"我把代码放在你的电脑上了"。')
    }

    return lines.join('\n')
  }

  function getState() {
    return {
      activeMissions: JSON.parse(JSON.stringify(activeMissions)),
      letters: letters.map(l => ({ id: l.id, type: l.type, characterName: l.characterName, createdAt: l.createdAt })),
    }
  }

  function restoreState(state) {
    if (!state) return
    if (state.activeMissions) {
      for (const [id, mission] of Object.entries(state.activeMissions)) {
        activeMissions[id] = mission
      }
    }
  }

  return {
    isElectron,
    isReady,
    isAuthorized,
    workspacePath,
    watchedFiles,
    pendingFileChanges,
    activeMissions,
    letters,

    initialize,
    createMission,
    readMissionFile,
    evaluateMission,
    createLetter,
    saveNotebook,
    listNotebook,
    consumeFileChanges,

    buildRealityPromptCard,
    getState,
    restoreState,
  }
}
