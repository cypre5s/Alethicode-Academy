<template>
  <div class="dialogue-area" v-if="engine.dialogueText.value" @click.stop="handleClick">
    <div class="dialogue-box" :class="dialogueClass" :style="boxSkinVars">
      <div class="speaker-glow-bar" v-if="engine.speaker.value && engine.dialogueType.value === 'normal'"
           :style="{ background: glowBarGradient }"></div>

      <div v-if="engine.speaker.value && engine.dialogueType.value === 'normal'" class="speaker-row">
        <div class="speaker-chip" :class="'speaker-' + (engine.speaker.value.id || '')"
             :style="{ '--speaker-gradient': speakerGradient }">
          {{ engine.speaker.value.name }}
        </div>
      </div>

      <div class="dialogue-text" :class="'text-' + engine.dialogueType.value">
        <span v-for="(seg, i) in renderedSegments" :key="i"
              :class="seg.classes" v-html="seg.html"></span>
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
import { characters } from '../data/characters.js'
import { parseTextEffects, getCharPause, SPEED_MULTIPLIERS, stripTags } from '../engine/TextEffectParser.js'

const emit = defineEmits(['open-backlog', 'open-save', 'open-load', 'open-menu'])
const engine = inject('engine')
const audio = inject('audio')

const renderedSegments = ref([])
const isTyping = ref(false)
let typeTimer = null
let autoTimer = null
let pauseTimer = null

const dialogueClass = computed(() => ({
  narration: engine.dialogueType.value === 'narration',
  monologue: engine.dialogueType.value === 'monologue',
  normal: engine.dialogueType.value === 'normal',
  heartbeat: engine.dialogueBoxEffect?.value === 'heartbeat',
  closeup: engine.dialogueBoxEffect?.value === 'closeup',
}))

const speakerGradient = computed(() => {
  const color = engine.speaker.value?.color || '#dc8ca6'
  return `linear-gradient(135deg, ${color}, ${color}88)`
})

const glowBarGradient = computed(() => {
  const color = engine.speaker.value?.color || '#dc8ca6'
  return `linear-gradient(90deg, transparent, ${color}60, ${color}90, ${color}60, transparent)`
})

const boxSkinVars = computed(() => {
  const speakerId = engine.speaker.value?.id
  const color = engine.speaker.value?.color || '#dc8ca6'
  return {
    '--speaker-glow-color': color,
    '--speaker-glow-alpha': speakerId ? '0.35' : '0',
  }
})

function getCharRhythm() {
  const id = engine.speaker.value?.id
  if (!id) return null
  return characters[id]?.textRhythm || null
}

function buildSegmentHtml(content, effects) {
  const escaped = content
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
  return escaped
}

function buildSegmentClasses(effects) {
  const classes = ['seg']
  for (const e of effects) {
    classes.push('fx-' + e)
  }
  return classes.join(' ')
}

watch(() => engine.dialogueText.value, (newText) => {
  if (!newText) return
  startTyping(newText)
}, { immediate: true })

function startTyping(rawText) {
  clearInterval(typeTimer)
  clearTimeout(autoTimer)
  clearTimeout(pauseTimer)
  renderedSegments.value = []
  isTyping.value = true

  const tokens = parseTextEffects(rawText)
  const rhythm = getCharRhythm()
  const baseInterval = engine.textSpeed.value
  let speedMultiplier = 1.0

  let tokenIdx = 0
  let charIdx = 0
  const currentSegments = []
  let activeSegment = null

  function effectsKey(effects) {
    return effects.join(',')
  }

  function tick() {
    while (tokenIdx < tokens.length) {
      const token = tokens[tokenIdx]

      if (token.type === 'pause') {
        tokenIdx++
        charIdx = 0
        clearInterval(typeTimer)
        pauseTimer = setTimeout(() => {
          typeTimer = setInterval(tick, baseInterval * speedMultiplier)
        }, token.duration)
        return
      }

      if (token.type === 'speed') {
        speedMultiplier = SPEED_MULTIPLIERS[token.value] || 1.0
        clearInterval(typeTimer)
        typeTimer = setInterval(tick, baseInterval * speedMultiplier)
        tokenIdx++
        charIdx = 0
        continue
      }

      if (token.type === 'text') {
        if (charIdx >= token.content.length) {
          tokenIdx++
          charIdx = 0
          activeSegment = null
          continue
        }

        const ch = token.content[charIdx]
        const prevCh = charIdx > 0 ? token.content[charIdx - 1] : null
        const key = effectsKey(token.effects)

        if (!activeSegment || activeSegment._key !== key) {
          activeSegment = {
            _key: key,
            html: '',
            classes: buildSegmentClasses(token.effects),
          }
          currentSegments.push(activeSegment)
        }

        activeSegment.html += buildSegmentHtml(ch, token.effects)
        charIdx++

        renderedSegments.value = currentSegments.map(s => ({ html: s.html, classes: s.classes }))

        const punctPause = getCharPause(ch, prevCh, rhythm)
        if (punctPause > 0) {
          clearInterval(typeTimer)
          pauseTimer = setTimeout(() => {
            typeTimer = setInterval(tick, baseInterval * speedMultiplier)
          }, punctPause)
          return
        }

        return
      }

      tokenIdx++
      charIdx = 0
    }

    clearInterval(typeTimer)
    isTyping.value = false
    if (engine.autoPlay.value) {
      const plain = stripTags(engine.dialogueText.value)
      const delay = Math.max(engine.autoPlayDelay.value, plain.length * 50)
      autoTimer = setTimeout(() => engine.advanceText(), delay)
    }
  }

  const rhythmDelay = rhythm?.preSentenceDelay || 0
  if (rhythmDelay > 0) {
    pauseTimer = setTimeout(() => {
      typeTimer = setInterval(tick, baseInterval * speedMultiplier)
    }, rhythmDelay)
  } else {
    typeTimer = setInterval(tick, baseInterval * speedMultiplier)
  }
}

function finishTyping() {
  clearInterval(typeTimer)
  clearTimeout(pauseTimer)

  const tokens = parseTextEffects(engine.dialogueText.value)
  const segments = []
  let activeSegment = null

  for (const token of tokens) {
    if (token.type !== 'text') continue
    const key = token.effects.join(',')
    if (!activeSegment || activeSegment._key !== key) {
      activeSegment = {
        _key: key,
        html: buildSegmentHtml(token.content, token.effects),
        classes: buildSegmentClasses(token.effects),
      }
      segments.push(activeSegment)
    } else {
      activeSegment.html += buildSegmentHtml(token.content, token.effects)
    }
  }

  renderedSegments.value = segments.map(s => ({ html: s.html, classes: s.classes }))
  isTyping.value = false
}

function handleClick() {
  audio.playSfx('click')
  if (isTyping.value) {
    finishTyping()
    if (engine.autoPlay.value) {
      const plain = stripTags(engine.dialogueText.value)
      const delay = Math.max(engine.autoPlayDelay.value, plain.length * 50)
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
  clearTimeout(pauseTimer)
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

.speaker-glow-bar {
  position: absolute;
  top: -1px;
  left: 0;
  right: 0;
  height: 2px;
  opacity: 0.8;
  animation: glow-pulse 3s ease-in-out infinite;
}

@keyframes glow-pulse {
  0%, 100% { opacity: 0.5; }
  50% { opacity: 1; }
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

.dialogue-box.heartbeat {
  animation: box-heartbeat 1.2s ease-in-out infinite;
}

@keyframes box-heartbeat {
  0%, 100% { box-shadow: inset 0 0 0 rgba(var(--speaker-glow-color), 0); }
  15% { box-shadow: inset 0 0 20px rgba(220, 100, 140, 0.15); }
  30% { box-shadow: inset 0 0 0 rgba(220, 100, 140, 0); }
  45% { box-shadow: inset 0 0 14px rgba(220, 100, 140, 0.1); }
}

.dialogue-box.closeup {
  background: linear-gradient(180deg,
    rgba(10, 8, 20, 0.0) 0%,
    rgba(10, 8, 20, 0.82) 12%,
    rgba(10, 8, 20, 0.92) 100%);
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
  animation: nameplate-appear 0.4s ease both;
}

@keyframes nameplate-appear {
  0% { opacity: 0; transform: translateY(4px); }
  100% { opacity: 1; transform: translateY(0); }
}

.speaker-nene .speaker-chip,
.speaker-chip.speaker-nene {
  animation: nameplate-appear 0.4s ease both, nameplate-soft-pulse 4s ease-in-out 0.4s infinite;
}

@keyframes nameplate-soft-pulse {
  0%, 100% { box-shadow: 0 -4px 16px rgba(0, 0, 0, 0.15); }
  50% { box-shadow: 0 -4px 20px rgba(244, 194, 208, 0.25); }
}

.speaker-chip.speaker-murasame {
  animation: nameplate-appear 0.4s ease both, nameplate-sharp-flash 3s ease-in-out 0.4s infinite;
}

@keyframes nameplate-sharp-flash {
  0%, 90%, 100% { box-shadow: 0 -4px 16px rgba(0, 0, 0, 0.15); }
  95% { box-shadow: 0 -2px 12px rgba(220, 53, 69, 0.35); }
}

.speaker-chip.speaker-kanna {
  animation: nameplate-appear 0.6s ease both;
}

.speaker-chip.speaker-yoshino {
  animation: nameplate-appear 0.3s ease both;
  letter-spacing: 0.2em;
}

.speaker-chip.speaker-ayase {
  animation: nameplate-appear 0.25s ease both;
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

/* --- Text effect classes --- */

.seg { display: inline; }

.fx-em {
  color: rgba(255, 235, 210, 1);
  text-shadow: 0 0 8px rgba(255, 200, 140, 0.4), 0 1px 4px rgba(0, 0, 0, 0.5);
  font-size: 1.05em;
  letter-spacing: 0.04em;
}

.fx-shake {
  display: inline-block;
  animation: text-shake 0.15s ease-in-out 3;
}

@keyframes text-shake {
  0%, 100% { transform: translateX(0); }
  25% { transform: translateX(-2px); }
  75% { transform: translateX(2px); }
}

.fx-fade {
  animation: text-fade-in 0.8s ease both;
}

@keyframes text-fade-in {
  0% { opacity: 0; }
  100% { opacity: 1; }
}

.fx-breath {
  animation: text-breath 2.4s ease-in-out infinite;
}

@keyframes text-breath {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.55; }
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
