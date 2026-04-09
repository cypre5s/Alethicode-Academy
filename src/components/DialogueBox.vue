<template>
  <div class="dialogue-area" v-if="engine.dialogueText.value" @click.stop="handleClick">
    <div class="dialogue-box" :class="dialogueClass">
      <div v-if="engine.speaker.value && engine.dialogueType.value === 'normal'" class="speaker-row">
        <div class="speaker-chip" :style="{ '--speaker-gradient': speakerGradient }">
          {{ engine.speaker.value.name }}
        </div>
      </div>

      <div class="dialogue-text" :class="'text-' + engine.dialogueType.value">
        <span class="typed-text">{{ displayedText }}</span>
        <span v-if="isTyping" class="cursor-blink"></span>
        <span v-else class="next-indicator">继续</span>
      </div>
    </div>

    <div class="dialogue-controls">
      <button
        v-if="engine.canSkipSection.value"
        class="ctrl-btn skip-btn"
        @click.stop="engine.skipSection()"
      >
        <span class="ctrl-key">Tab</span>
        <span>跳过</span>
      </button>
      <button class="ctrl-btn" @click.stop="$emit('open-backlog')">
        <span class="ctrl-key">H</span>
        <span>记录</span>
      </button>
      <button class="ctrl-btn" :class="{ active: engine.autoPlay.value }" @click.stop="toggleAuto">
        <span class="ctrl-key">A</span>
        <span>自动</span>
      </button>
      <button class="ctrl-btn" @click.stop="$emit('open-save')">
        <span class="ctrl-key">S</span>
        <span>存档</span>
      </button>
      <button class="ctrl-btn" @click.stop="$emit('open-load')">
        <span class="ctrl-key">L</span>
        <span>读档</span>
      </button>
      <button class="ctrl-btn" @click.stop="$emit('open-menu')">
        <span class="ctrl-key">Esc</span>
        <span>菜单</span>
      </button>
    </div>
  </div>
</template>

<script setup>
import { computed, inject, onUnmounted, ref, watch } from 'vue'

const emit = defineEmits(['open-backlog', 'open-save', 'open-load', 'open-menu'])
const engine = inject('engine')
const audio = inject('audio')

const displayedText = ref('')
const isTyping = ref(false)
let typeTimer = null
let autoTimer = null

const dialogueClass = computed(() => ({
  narration: engine.dialogueType.value === 'narration',
  monologue: engine.dialogueType.value === 'monologue',
  normal: engine.dialogueType.value === 'normal',
}))

const speakerGradient = computed(() => {
  const color = engine.speaker.value?.color || '#dc8ca6'
  return `linear-gradient(135deg, ${color}, ${color}88)`
})

watch(() => engine.dialogueText.value, (newText) => {
  if (!newText) return
  startTyping(newText)
}, { immediate: true })

function startTyping(text) {
  clearInterval(typeTimer)
  clearTimeout(autoTimer)
  displayedText.value = ''
  isTyping.value = true
  let index = 0
  typeTimer = setInterval(() => {
    if (index < text.length) {
      displayedText.value += text[index]
      index += 1
      return
    }
    clearInterval(typeTimer)
    isTyping.value = false
    if (engine.autoPlay.value) {
      const delay = Math.max(engine.autoPlayDelay.value, text.length * 50)
      autoTimer = setTimeout(() => engine.advanceText(), delay)
    }
  }, engine.textSpeed.value)
}

function handleClick() {
  audio.playSfx('click')
  if (isTyping.value) {
    clearInterval(typeTimer)
    displayedText.value = engine.dialogueText.value
    isTyping.value = false
    if (engine.autoPlay.value) {
      const delay = Math.max(engine.autoPlayDelay.value, engine.dialogueText.value.length * 50)
      autoTimer = setTimeout(() => engine.advanceText(), delay)
    }
    return
  }
  clearTimeout(autoTimer)
  engine.advanceText()
}

function toggleAuto() {
  engine.autoPlay.value = !engine.autoPlay.value
  if (engine.autoPlay.value && !isTyping.value) {
    autoTimer = setTimeout(() => engine.advanceText(), engine.autoPlayDelay.value)
  } else {
    clearTimeout(autoTimer)
  }
}

onUnmounted(() => {
  clearInterval(typeTimer)
  clearTimeout(autoTimer)
})
</script>

<style scoped>
.dialogue-area {
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 10;
  cursor: pointer;
}

.dialogue-box {
  position: relative;
  min-height: 180px;
  padding: 36px 60px 28px;
  background: linear-gradient(180deg,
    rgba(10, 8, 20, 0.0) 0%,
    rgba(10, 8, 20, 0.72) 12%,
    rgba(10, 8, 20, 0.86) 100%);
  backdrop-filter: blur(8px);
  border-top: 1px solid rgba(255, 220, 180, 0.1);
}

.dialogue-box.narration {
  background: linear-gradient(180deg,
    rgba(10, 8, 20, 0.0) 0%,
    rgba(10, 8, 20, 0.65) 12%,
    rgba(10, 8, 20, 0.78) 100%);
}

.dialogue-box.monologue {
  background: linear-gradient(180deg,
    rgba(10, 8, 20, 0.0) 0%,
    rgba(15, 12, 30, 0.68) 12%,
    rgba(15, 12, 30, 0.82) 100%);
}

.speaker-row {
  position: absolute;
  top: 6px;
  left: 56px;
}

.speaker-chip {
  padding: 5px 22px 6px;
  border-radius: 4px 4px 0 0;
  background: var(--speaker-gradient);
  color: #fffdfb;
  font-family: var(--vn-font-title);
  font-size: 15px;
  font-weight: 600;
  letter-spacing: 0.15em;
  box-shadow: 0 -4px 16px rgba(0, 0, 0, 0.15);
}

.dialogue-text {
  color: rgba(255, 252, 245, 0.95);
  font-size: var(--vn-dialogue-font-size);
  line-height: 2.0;
  white-space: pre-wrap;
  text-shadow: 0 1px 4px rgba(0, 0, 0, 0.5);
}

.text-monologue {
  color: rgba(190, 200, 240, 0.88);
  font-style: italic;
  text-shadow: 0 1px 3px rgba(0, 0, 0, 0.4);
}

.text-narration {
  color: rgba(230, 225, 215, 0.9);
  text-shadow: 0 1px 3px rgba(0, 0, 0, 0.4);
}

.cursor-blink {
  display: inline-block;
  width: 10px;
  height: 1.2em;
  margin-left: 6px;
  border-right: 2px solid rgba(220, 180, 160, 0.7);
  vertical-align: bottom;
  animation: blink 0.9s step-end infinite;
}

.next-indicator {
  display: inline-flex;
  align-items: center;
  margin-left: 12px;
  padding: 3px 10px;
  border-radius: 999px;
  background: rgba(255, 220, 180, 0.12);
  color: rgba(255, 220, 180, 0.7);
  font-size: 11px;
  letter-spacing: 0.05em;
}

@keyframes blink {
  50% { opacity: 0; }
}

.dialogue-controls {
  display: none;
}

@media (max-width: 768px) {
  .dialogue-box {
    min-height: 160px;
    padding: 32px 20px 22px;
  }

  .speaker-row {
    left: 18px;
  }

  .dialogue-controls {
    display: flex;
    justify-content: space-between;
    gap: 6px;
    padding: 6px 16px 12px;
    background: rgba(10, 8, 20, 0.86);
  }

  .ctrl-btn {
    display: inline-flex;
    align-items: center;
    gap: 4px;
    padding: 6px 10px;
    border-radius: 4px;
    border: 1px solid rgba(255, 220, 180, 0.12);
    background: rgba(255, 255, 255, 0.06);
    color: rgba(255, 220, 180, 0.6);
    font-size: 11px;
    flex: 1;
    justify-content: center;
  }

  .ctrl-btn.active {
    color: var(--vn-primary);
    border-color: rgba(220, 140, 166, 0.3);
    background: rgba(220, 140, 166, 0.1);
  }

  .ctrl-key {
    display: none;
  }
}
</style>
