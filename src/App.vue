<template>
  <div class="game-container">
    <TitleScreen v-if="screen === 'title'"
      @start="startGame"
      @continue-game="continueGame"
      @load="openLoad"
      @gallery="openGallery"
      @settings="openSettings" />
    <GameScreen v-else-if="screen === 'game'" @title="goTitle" />
    <GalleryScreen v-else-if="screen === 'gallery'" @back="goTitle" />

    <SettingsPanel
      v-if="screen === 'title'"
      :visible="showTitleSettings"
      @close="showTitleSettings = false"
      @title="goTitle"
    />
  </div>
</template>

<script setup>
import { ref, provide, watch, onMounted } from 'vue'
import TitleScreen from './components/TitleScreen.vue'
import GameScreen from './components/GameScreen.vue'
import GalleryScreen from './components/GalleryScreen.vue'
import SettingsPanel from './components/SettingsPanel.vue'
import { useVNEngine } from './engine/VNEngine.js'
import { useSaveManager } from './engine/SaveManager.js'
import { useAudioManager } from './engine/AudioManager.js'
import { acquireWakeLock, setupVisibilityHandler } from './engine/ExperienceEnhancer.js'

const screen = ref('title')
const showTitleSettings = ref(false)
const engine = useVNEngine()
const saveManager = useSaveManager()
const audio = useAudioManager()
setupVisibilityHandler(audio)
acquireWakeLock()

provide('engine', engine)
provide('saveManager', saveManager)
provide('audio', audio)

if (import.meta.env.DEV) {
  window.__engine = engine
  window.__screen = screen
}

onMounted(() => {
  const saved = saveManager.loadSettings()
  if (saved) {
    if (saved.textSpeed != null) engine.textSpeed.value = saved.textSpeed
    if (saved.autoPlayDelay != null) engine.autoPlayDelay.value = saved.autoPlayDelay
    if (saved.bgmVolume != null) { engine.bgmVolume.value = saved.bgmVolume; audio.setBgmVolume(saved.bgmVolume) }
    if (saved.seVolume != null) { engine.seVolume.value = saved.seVolume; audio.setSfxVolume(saved.seVolume) }
    if (saved.masterVolume != null) audio.setMasterVolume(saved.masterVolume)
    if (saved.fontSize) {
      engine.fontSize.value = saved.fontSize
      const sizeMap = { small: '14px', medium: '17px', large: '22px' }
      document.documentElement.style.setProperty('--vn-dialogue-font-size', sizeMap[saved.fontSize] || '17px')
    }
  }

  const global = saveManager.loadGlobal()
  if (global) {
    if (global.unlockedCGs) global.unlockedCGs.forEach(id => engine.unlockedCGs.add(id))
    if (global.unlockedBGM) global.unlockedBGM.forEach(id => engine.unlockedBGM.add(id))
    if (global.endingFlags) Object.assign(engine.flags, global.endingFlags)
  }
})

function persistSettings() {
  saveManager.saveSettings({
    textSpeed: engine.textSpeed.value,
    autoPlayDelay: engine.autoPlayDelay.value,
    bgmVolume: engine.bgmVolume.value,
    seVolume: engine.seVolume.value,
    masterVolume: audio.masterVol.value,
    fontSize: engine.fontSize.value,
  })
}

function persistGlobal() {
  const endingFlags = {}
  Object.entries(engine.flags).forEach(([k, v]) => {
    if (k.startsWith('ending_')) endingFlags[k] = v
  })
  saveManager.saveGlobal({
    unlockedCGs: [...engine.unlockedCGs],
    unlockedBGM: [...engine.unlockedBGM],
    endingFlags,
  })
}

watch(() => engine.textSpeed.value, persistSettings)
watch(() => engine.autoPlayDelay.value, persistSettings)
watch(() => engine.bgmVolume.value, persistSettings)
watch(() => engine.seVolume.value, persistSettings)
watch(() => engine.fontSize.value, persistSettings)
watch(() => audio.masterVol.value, persistSettings)
watch(() => engine.unlockedCGs.size, persistGlobal)
watch(() => engine.unlockedBGM.size, persistGlobal)

function startGame(playerName) {
  audio.ensureContext()
  engine.newGame(playerName)
  screen.value = 'game'
}

function continueGame() {
  audio.ensureContext()
  const autoSave = saveManager.loadAuto()
  if (autoSave) {
    engine.restoreState(autoSave)
    screen.value = 'game'
  } else {
    startGame()
  }
}

function openLoad() {
  audio.ensureContext()
  engine.showPanel.value = 'load'
  const autoSave = saveManager.loadAuto()
  if (autoSave) engine.restoreState(autoSave)
  else engine.newGame()
  screen.value = 'game'
}

function openGallery() {
  screen.value = 'gallery'
}

function openSettings() {
  if (screen.value === 'title') {
    showTitleSettings.value = true
  } else {
    engine.showPanel.value = 'settings'
  }
}

function goTitle() {
  persistGlobal()
  engine.flushSeen()
  audio.stopBgm(500)
  showTitleSettings.value = false
  screen.value = 'title'
}
</script>
