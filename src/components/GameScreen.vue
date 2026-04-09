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
      <button class="yuzu-btn" :class="{ active: engine.canSkipSection.value }" @click.stop="engine.skipSection()">SKIP</button>
      <button class="yuzu-btn" @click.stop="panelOpen = 'backlog'">LOG</button>
      <button class="yuzu-btn" @click.stop="panelOpen = 'save'">SAVE</button>
      <button class="yuzu-btn" @click.stop="panelOpen = 'load'">LOAD</button>
      <button class="yuzu-btn" @click.stop="panelOpen = 'settings'">CONFIG</button>
    </div>

    <ChoiceMenu />
    <CodingChallenge />
    <LocationSelect />
    <FreeTalkPanel />
    <SkipSummary />

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
  </div>
</template>

<script setup>
import { ref, inject, watch, computed, onMounted, onUnmounted } from 'vue'
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

const emit = defineEmits(['title'])
const engine = inject('engine')
const saveManager = inject('saveManager')
const audio = inject('audio')

const panelOpen = ref(null)
const hideUI = ref(false)

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
  emit('title')
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
let longPressTimer = null

function onTouchStart(e) {
  touchStartY = e.touches[0].clientY
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
  if (dy > 60 && !panelOpen.value && !isInteractiveMode()) {
    panelOpen.value = 'backlog'
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
  padding: 8px 10px;
  min-width: 56px;
  border: none;
  border-radius: 4px;
  background: rgba(10, 8, 20, 0.4);
  backdrop-filter: blur(6px);
  color: rgba(255, 220, 180, 0.55);
  font-size: 10px;
  font-family: var(--vn-font);
  letter-spacing: 0.12em;
  text-align: center;
  cursor: pointer;
  transition: all 0.2s ease;
}

.yuzu-btn:hover {
  background: rgba(10, 8, 20, 0.6);
  color: rgba(255, 220, 180, 0.9);
}

.yuzu-btn.active {
  background: rgba(220, 140, 166, 0.25);
  color: var(--vn-primary);
}

@media (max-width: 768px) {
  .yuzu-sidebar {
    display: none;
  }
}
</style>
