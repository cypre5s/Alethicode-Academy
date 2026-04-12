<template>
  <div class="game-screen" @click="handleScreenClick" tabindex="0">
    <BackgroundLayer />
    <CharacterLayer />
    <TransitionOverlay @title="handleTitle" />
    <StatusToast />

    <DialogueBox
      v-if="showDialogue"
      @open-backlog="panelOpen = 'backlog'"
      @open-save="panelOpen = 'save'"
      @open-load="panelOpen = 'load'"
      @open-menu="panelOpen = 'settings'"
    />

    <div class="yuzu-sidebar" v-if="showDialogue && !panelOpen && !hideUI">
      <button class="yuzu-btn" :class="{ active: engine.autoPlay.value }" @click.stop="engine.autoPlay.value = !engine.autoPlay.value">AUTO</button>
      <button class="yuzu-btn" :class="{ active: engine.canSkipSection.value, disabled: !engine.canSkipSection.value }" :disabled="!engine.canSkipSection.value" @click.stop="engine.skipSection()">SKIP</button>
      <button class="yuzu-btn" @click.stop="panelOpen = 'backlog'">LOG</button>
      <button class="yuzu-btn" @click.stop="panelOpen = 'save'">SAVE</button>
      <button class="yuzu-btn" @click.stop="panelOpen = 'load'">LOAD</button>
      <button class="yuzu-btn" @click.stop="panelOpen = 'settings'">CONFIG</button>
      <div class="sidebar-divider" />
      <button class="yuzu-btn genesis-btn" @click.stop="showWorldConsole = !showWorldConsole" title="World Console">⚡</button>
      <button class="yuzu-btn genesis-btn" @click.stop="showCognitiveMap = !showCognitiveMap" title="认知图谱">🧠</button>
      <button class="yuzu-btn genesis-btn" @click.stop="showCodeArchaeology = !showCodeArchaeology" title="代码考古">🏛️</button>
      <button class="yuzu-btn genesis-btn" @click.stop="showDashboard = !showDashboard" title="学习报告">📊</button>
    </div>

    <ChoiceMenu />
    <CodingChallenge />
    <LocationSelect />
    <FreeTalkPanel />
    <SkipSummary />
    <DebugConsole :visible="showDebugConsole" @close="showDebugConsole = false" />

    <WorldConsole
      :is-open="showWorldConsole"
      :worldVM="engine.worldVM"
      @close="showWorldConsole = false"
      @world-change="onWorldChange"
      @character-say="onCharacterSay"
      @discovery="onDiscovery"
    />
    <CognitiveMap
      :is-open="showCognitiveMap"
      :cognitiveGraph="engine.cognitiveGraph"
      @close="showCognitiveMap = false"
    />
    <CodeArchaeology
      :is-open="showCodeArchaeology"
      :temporalDB="engine.temporalCodeDB"
      @close="showCodeArchaeology = false"
    />
    <LearningDashboard
      :is-open="showDashboard"
      @close="showDashboard = false"
    />

    <transition-group name="notif-slide" tag="div" class="autonomy-notifications">
      <div v-for="(notif, i) in autonomyNotifications" :key="notif.timestamp + '-' + i"
           class="autonomy-notif" @click="handleAutonomyNotif(notif, i)">
        <span class="notif-dot" :style="{ background: notif.charColor }"></span>
        <span class="notif-text" v-if="notif.type === 'proactive_contact'">{{ notif.charName }} 想和你说话</span>
        <span class="notif-text" v-else-if="notif.type === 'absence'">{{ notif.charName }} 似乎在担心你</span>
        <span class="notif-text" v-else-if="notif.type === 'departure'">{{ notif.charName }} 离开了……</span>
        <span class="notif-text" v-else-if="notif.type === 'return'">{{ notif.charName }} 回来了</span>
        <span class="notif-dismiss" @click.stop="engine.characterAutonomy.dismissNotification(i)">✕</span>
      </div>
    </transition-group>

    <SaveLoadPanel
      :visible="panelOpen === 'save' || panelOpen === 'load'"
      :initial-mode="panelOpen === 'load' ? 'load' : 'save'"
      @close="panelOpen = null"
    />

    <BacklogPanel
      :visible="panelOpen === 'backlog'"
      @close="panelOpen = null"
    />

    <SettingsPanel
      :visible="panelOpen === 'settings'"
      @close="panelOpen = null"
      @title="handleTitle"
    />

    <transition name="fade">
      <div v-if="showKeyHints" class="keyhint-overlay" @click="dismissKeyHints" @keydown="dismissKeyHints">
        <div class="keyhint-card">
          <h3 class="keyhint-title">快捷键一览</h3>
          <div class="keyhint-grid">
            <div class="keyhint-item"><kbd>Space</kbd><span>推进对话</span></div>
            <div class="keyhint-item"><kbd>A</kbd><span>自动播放</span></div>
            <div class="keyhint-item"><kbd>Ctrl</kbd><span>按住快进</span></div>
            <div class="keyhint-item"><kbd>Tab</kbd><span>跳过段落</span></div>
            <div class="keyhint-item"><kbd>H</kbd><span>对话记录</span></div>
            <div class="keyhint-item"><kbd>S</kbd><span>存档</span></div>
            <div class="keyhint-item"><kbd>L</kbd><span>读档</span></div>
            <div class="keyhint-item"><kbd>Q</kbd><span>快速存档</span></div>
            <div class="keyhint-item"><kbd>W</kbd><span>快速读档</span></div>
            <div class="keyhint-item"><kbd>D</kbd><span>隐藏 UI</span></div>
            <div class="keyhint-item"><kbd>F</kbd><span>全屏</span></div>
            <div class="keyhint-item"><kbd>Esc</kbd><span>菜单</span></div>
          </div>
          <p class="keyhint-dismiss">点击任意位置关闭</p>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup>
import { ref, inject, provide, watch, computed, onMounted, onUnmounted } from 'vue'
import BackgroundLayer from './BackgroundLayer.vue'
import CharacterLayer from './CharacterLayer.vue'
import DialogueBox from './DialogueBox.vue'
import ChoiceMenu from './ChoiceMenu.vue'
import CodingChallenge from './CodingChallenge.vue'
import LocationSelect from './LocationSelect.vue'
import FreeTalkPanel from './FreeTalkPanel.vue'
import SaveLoadPanel from './SaveLoadPanel.vue'
import BacklogPanel from './BacklogPanel.vue'
import SettingsPanel from './SettingsPanel.vue'
import TransitionOverlay from './TransitionOverlay.vue'
import StatusToast from './StatusToast.vue'
import SkipSummary from './SkipSummary.vue'
import { defineAsyncComponent } from 'vue'
const DebugConsole = defineAsyncComponent(() => import('./DebugConsole.vue'))
const WorldConsole = defineAsyncComponent(() => import('./WorldConsole.vue'))
const CognitiveMap = defineAsyncComponent(() => import('./CognitiveMap.vue'))
const CodeArchaeology = defineAsyncComponent(() => import('./CodeArchaeology.vue'))
const LearningDashboard = defineAsyncComponent(() => import('./LearningDashboard.vue'))
import { useLLMManager } from '../engine/LLMManager.js'
import { useLive2DManager } from '../engine/Live2DManager.js'

const emit = defineEmits(['title'])
const engine = inject('engine')
const saveManager = inject('saveManager')
const audio = inject('audio')

const llm = useLLMManager()
llm.loadApiKey()
engine.registerLLMManager(llm)
provide('llm', llm)

// ─── Live2D System Initialization ─────────────────────────────
const live2d = useLive2DManager()

live2d.bridgeWorldVM(engine.worldVM)
live2d.bridgeAffective(engine.affectiveResonance)
live2d.bridgeCognitive(engine.cognitiveGraph)
live2d.bridgeAutonomy(engine.characterAutonomy)
live2d.bridgeSymbiotic(engine.symbioticCodeDNA)
live2d.bridgePedagogy(engine.pedagogyKernel)
live2d.bridgeBehavior(engine.behaviorProfiler)
live2d.bridgeAudio(audio)
if (audio.getAudioContext?.()) {
  const ctx = audio.getAudioContext()
  const analyser = ctx.createAnalyser()
  analyser.fftSize = 512
  analyser.smoothingTimeConstant = 0.75
  const masterNode = ctx.destination
  try { live2d.bindAudioAnalyser(analyser) } catch {}
}
live2d.bridgeMemory(engine.persistentMemory)
live2d.bridgeTemporal(engine.temporalCodeDB)
live2d.bridgeSRS(engine.spacedRepetition)
live2d.bridgeNarrative(engine.narrativeWeaver)

engine.registerLive2DManager?.(live2d)
provide('live2d', live2d)

const autonomyNotifications = computed(() => engine.characterAutonomy?.pendingNotifications?.value || [])

const panelOpen = ref(null)
const hideUI = ref(false)
const showDebugConsole = ref(false)
const showWorldConsole = ref(false)
const showCognitiveMap = ref(false)
const showCodeArchaeology = ref(false)
const showDashboard = ref(false)

import('../engine/PythonRunner.js').then(async ({ usePythonRunner }) => {
  const pythonRunner = usePythonRunner()
  engine.worldVM.bindPythonRunner(pythonRunner)
  if (!engine.worldVM.isReady.value) {
    await engine.worldVM.initialize(engine.playerName.value || '')
  }
})

function onWorldChange(change) {
  if (change.entity_type === 'environment' && change.property === 'weather') {
    engine.screenEffect.value = { effect: change.value, duration: 2000 }
  }
}

function onCharacterSay(say) {
  if (say.character && say.text) {
    engine.history.push({ type: 'dialogue', speaker: say.character, text: say.text, speakerColor: '#64c8ff' })
  }
}

function onDiscovery(disc) {
  audio.playSfx('level_up')
}

const KEYHINT_FLAG = 'alethicode_keyhints_shown'
const showKeyHints = ref(false)
try {
  if (!localStorage.getItem(KEYHINT_FLAG)) showKeyHints.value = true
} catch {}

function dismissKeyHints() {
  showKeyHints.value = false
  try { localStorage.setItem(KEYHINT_FLAG, '1') } catch {}
}

const showDialogue = computed(() => {
  return !hideUI.value &&
    engine.dialogueText.value &&
    !engine.isChoosing.value &&
    !engine.isChallenge.value &&
    !engine.isLocationSelect.value &&
    !engine.isFreeTalk.value &&
    !engine.showTitleCard.value &&
    !engine.showEnding.value
})

watch(() => engine.showPanel.value, (val) => {
  if (val) { panelOpen.value = val; engine.showPanel.value = null }
})

watch(panelOpen, (val) => {
  if (val === 'backlog' && engine.behaviorProfiler) {
    engine.behaviorProfiler.onBacklogOpen()
  }
})

watch(() => engine.currentBg.value, (bgName) => {
  if (bgName && bgName !== 'black') audio.playBgmForScene(bgName)
})

engine.registerAudioCallbacks({
  playBgm: (id, fade) => audio.playBgm(id, fade),
  stopBgm: (fade) => audio.stopBgm(fade),
  playSfx: (id) => audio.playSfx(id)
})

let autoSaveInterval = null
onMounted(() => {
  autoSaveInterval = setInterval(() => {
    if (engine.dialogueText.value) {
      const state = engine.getState()
      saveManager.saveAuto(state)
    }
  }, 30000)
})

onUnmounted(() => clearInterval(autoSaveInterval))

function handleScreenClick() {
  if (hideUI.value) { hideUI.value = false; return }
  if (panelOpen.value || engine.showSkipSummary.value) return
}

function onContextMenu(e) {
  e.preventDefault()
  if (panelOpen.value) return
  hideUI.value = !hideUI.value
}

function handleTitle() {
  const state = engine.getState()
  saveManager.saveAuto(state)
  panelOpen.value = null
  if (engine.behaviorProfiler) engine.behaviorProfiler.onSessionEnd()
  if (engine.affectiveResonance) engine.affectiveResonance.disable()
  emit('title')
}

function handleAutonomyNotif(notif, index) {
  engine.characterAutonomy.dismissNotification(index)
  if (notif.type === 'proactive_contact' && notif.character) {
    audio.playSfx('click')
  }
}

let ctrlHeld = false
let skipTimer = null

function startSkipMode() {
  if (skipTimer) return
  skipTimer = setInterval(() => {
    if (!ctrlHeld || panelOpen.value) { stopSkipMode(); return }
    if (engine.isChoosing.value || engine.isChallenge.value ||
        engine.isLocationSelect.value || engine.isFreeTalk.value ||
        engine.showEnding.value || engine.showSkipSummary.value) return
    engine.advanceText()
  }, 100)
}

function stopSkipMode() {
  if (skipTimer) { clearInterval(skipTimer); skipTimer = null }
}

function isInteractiveMode() {
  return engine.isChallenge.value || engine.isFreeTalk.value ||
    engine.isChoosing.value || engine.isLocationSelect.value
}

function isTypingInField() {
  const tag = document.activeElement?.tagName
  return tag === 'INPUT' || tag === 'TEXTAREA' || document.activeElement?.isContentEditable
}

function onKeydown(e) {
  if (panelOpen.value) {
    if (e.key === 'Escape') panelOpen.value = null
    return
  }

  if (e.key === 'Escape') {
    panelOpen.value = 'settings'
    return
  }

  if (isTypingInField() || isInteractiveMode()) return

  if (e.key === 'Control') {
    ctrlHeld = true
    startSkipMode()
    return
  }

  if (e.key === 'Tab') {
    e.preventDefault()
    if (engine.canSkipSection.value) engine.skipSection()
    return
  }

  if (e.key === ' ' || e.key === 'Enter') {
    e.preventDefault()
    engine.advanceText()
  }
  if (e.key === 'h' || e.key === 'H') panelOpen.value = 'backlog'
  if (e.key === 's' || e.key === 'S') panelOpen.value = 'save'
  if (e.key === 'l' || e.key === 'L') panelOpen.value = 'load'
  if (e.key === 'a' || e.key === 'A') {
    engine.autoPlay.value = !engine.autoPlay.value
  }
  if (e.key === 'd' || e.key === 'D') {
    hideUI.value = !hideUI.value
  }
  if (e.key === 'q' || e.key === 'Q') {
    const state = engine.getState()
    saveManager.quickSave(state)
    audio.playSfx('save')
  }
  if (e.key === 'w' || e.key === 'W') {
    const state = saveManager.quickLoad()
    if (state) engine.restoreState(state)
  }
  if (e.key === 'f' || e.key === 'F') {
    if (document.fullscreenElement) {
      document.exitFullscreen()
    } else {
      document.documentElement.requestFullscreen?.()
    }
  }
  if (e.key === '`') {
    showDebugConsole.value = !showDebugConsole.value
  }
  if (e.key === '~') {
    showWorldConsole.value = !showWorldConsole.value
  }
  if (e.key === 'g' || e.key === 'G') {
    showCognitiveMap.value = !showCognitiveMap.value
  }
  if (e.key === 'p' || e.key === 'P') {
    captureScreenshot()
  }
  if (e.key === 'r' || e.key === 'R') {
    showDashboard.value = !showDashboard.value
  }
}

async function captureScreenshot() {
  try {
    const gameEl = document.querySelector('.game-screen')
    if (!gameEl) return
    const { default: html2canvas } = await import('html2canvas')
    const canvas = await html2canvas(gameEl, { backgroundColor: '#0a0814', scale: 2, useCORS: true })
    const link = document.createElement('a')
    link.download = `alethicode-${Date.now()}.png`
    link.href = canvas.toDataURL('image/png')
    link.click()
    audio.playSfx('save')
  } catch (err) {
    console.warn('[Screenshot] failed:', err)
  }
}

function onKeyup(e) {
  if (e.key === 'Control') { ctrlHeld = false; stopSkipMode() }
}

function onWheel(e) {
  if (e.deltaY < 0 && !panelOpen.value && !isInteractiveMode()) {
    panelOpen.value = 'backlog'
  }
}

let touchStartY = 0
let touchStartX = 0
let longPressTimer = null
let lastTapTime = 0

function onTouchStart(e) {
  touchStartY = e.touches[0].clientY
  touchStartX = e.touches[0].clientX
  longPressTimer = setTimeout(() => {
    ctrlHeld = true
    startSkipMode()
  }, 500)
}

function onTouchMove(e) {
  if (longPressTimer) { clearTimeout(longPressTimer); longPressTimer = null }
}

function onTouchEnd(e) {
  if (longPressTimer) { clearTimeout(longPressTimer); longPressTimer = null }
  if (ctrlHeld) { ctrlHeld = false; stopSkipMode(); return }

  const dy = touchStartY - e.changedTouches[0].clientY
  const dx = e.changedTouches[0].clientX - touchStartX
  const absDx = Math.abs(dx)
  const absDy = Math.abs(dy)

  if (absDx < 15 && absDy < 15) {
    const now = Date.now()
    if (now - lastTapTime < 350) {
      hideUI.value = !hideUI.value
      lastTapTime = 0
      return
    }
    lastTapTime = now
  }

  if (absDy > 60 && absDy > absDx && !panelOpen.value && !isInteractiveMode()) {
    if (dy > 0) {
      panelOpen.value = 'backlog'
    }
  } else if (absDx > 60 && absDx > absDy && !panelOpen.value && !isInteractiveMode()) {
    if (dx < 0) {
      panelOpen.value = 'save'
    } else {
      panelOpen.value = 'load'
    }
  }
}

onMounted(() => {
  window.addEventListener('keydown', onKeydown)
  window.addEventListener('keyup', onKeyup)
  window.addEventListener('wheel', onWheel)
  window.addEventListener('contextmenu', onContextMenu)
  window.addEventListener('touchstart', onTouchStart, { passive: true })
  window.addEventListener('touchmove', onTouchMove, { passive: true })
  window.addEventListener('touchend', onTouchEnd)
})

onUnmounted(() => {
  stopSkipMode()
  if (longPressTimer) clearTimeout(longPressTimer)
  window.removeEventListener('keydown', onKeydown)
  window.removeEventListener('keyup', onKeyup)
  window.removeEventListener('wheel', onWheel)
  window.removeEventListener('contextmenu', onContextMenu)
  window.removeEventListener('touchstart', onTouchStart)
  window.removeEventListener('touchmove', onTouchMove)
  window.removeEventListener('touchend', onTouchEnd)
})
</script>

<style scoped>
.game-screen {
  width: 100%;
  height: 100%;
  position: relative;
  overflow: hidden;
  user-select: none;
  outline: none;
  contain: layout style;
  will-change: contents;
}

.yuzu-sidebar {
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
  z-index: 8;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.yuzu-btn {
  padding: 7px 10px;
  min-width: 52px;
  border: none;
  border-radius: 3px;
  background: rgba(10, 8, 20, var(--vn-sidebar-opacity, 0.4));
  backdrop-filter: blur(6px);
  color: rgba(255, 220, 180, 0.45);
  font-size: 9.5px;
  font-family: var(--vn-font);
  font-weight: 500;
  letter-spacing: 0.14em;
  text-align: center;
  cursor: pointer;
  transition: all 0.25s ease;
}

.yuzu-btn:hover {
  background: rgba(10, 8, 20, 0.55);
  color: rgba(255, 220, 180, 0.85);
  transform: translateX(-1px);
}

.yuzu-btn.active {
  background: rgba(220, 140, 166, 0.25);
  color: var(--vn-primary);
}

.yuzu-btn.disabled {
  opacity: 0.3;
  cursor: not-allowed;
}

.sidebar-divider {
  width: 36px;
  height: 1px;
  background: rgba(255, 220, 180, 0.15);
  margin: 2px auto;
}

.genesis-btn {
  font-size: 14px !important;
  letter-spacing: 0 !important;
  padding: 6px 8px !important;
  min-width: 40px !important;
}

@media (max-width: 768px) {
  .yuzu-sidebar {
    display: none;
  }
}

.keyhint-overlay {
  position: absolute;
  inset: 0;
  z-index: 100;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(10, 8, 20, 0.7);
  backdrop-filter: blur(8px);
  cursor: pointer;
}

.keyhint-card {
  padding: 32px 40px;
  border-radius: 24px;
  background: linear-gradient(180deg, rgba(255, 251, 246, 0.92), rgba(255, 245, 236, 0.88));
  border: 1px solid rgba(216, 177, 110, 0.36);
  box-shadow: 0 24px 60px rgba(30, 18, 8, 0.3);
  max-width: 480px;
  width: 90%;
}

.keyhint-title {
  text-align: center;
  font-family: var(--vn-font-title);
  font-size: 22px;
  color: var(--vn-text);
  margin-bottom: 20px;
}

.keyhint-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px 24px;
}

.keyhint-item {
  display: flex;
  align-items: center;
  gap: 10px;
}

.keyhint-item kbd {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 40px;
  padding: 4px 10px;
  border-radius: 6px;
  border: 1px solid rgba(180, 155, 120, 0.4);
  background: rgba(255, 255, 255, 0.8);
  color: var(--vn-text);
  font-family: var(--vn-font);
  font-size: 12px;
  font-weight: 600;
}

.keyhint-item span {
  color: var(--vn-text-dim);
  font-size: 13px;
}

.keyhint-dismiss {
  text-align: center;
  margin-top: 18px;
  color: var(--vn-text-dim);
  font-size: 12px;
  opacity: 0.6;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.autonomy-notifications {
  position: absolute;
  top: 16px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 25;
  display: flex;
  flex-direction: column;
  gap: 8px;
  pointer-events: none;
}

.autonomy-notif {
  pointer-events: all;
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 18px;
  border-radius: 999px;
  background: linear-gradient(135deg, rgba(255, 251, 246, 0.95), rgba(255, 244, 234, 0.92));
  border: 1px solid rgba(219, 182, 123, 0.4);
  box-shadow: 0 4px 20px rgba(30, 18, 8, 0.15);
  backdrop-filter: blur(12px);
  cursor: pointer;
  transition: all 0.2s ease;
  white-space: nowrap;
}

.autonomy-notif:hover {
  transform: scale(1.02);
  box-shadow: 0 6px 24px rgba(30, 18, 8, 0.2);
}

.notif-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  animation: notif-pulse 2s ease-in-out infinite;
}

@keyframes notif-pulse {
  0%, 100% { opacity: 1; transform: scale(1); }
  50% { opacity: 0.6; transform: scale(1.3); }
}

.notif-text {
  font-size: 13px;
  color: var(--vn-text);
  font-family: var(--vn-font);
}

.notif-dismiss {
  font-size: 12px;
  color: var(--vn-text-dim);
  opacity: 0.5;
  cursor: pointer;
  padding: 2px 4px;
}

.notif-dismiss:hover { opacity: 1; }

.notif-slide-enter-active { transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1); }
.notif-slide-leave-active { transition: all 0.3s ease; }
.notif-slide-enter-from { transform: translateY(-20px); opacity: 0; }
.notif-slide-leave-to { transform: translateY(-10px); opacity: 0; }
</style>
