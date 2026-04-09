<template>
  <div class="character-layer">
    <transition-group name="char-anim">
      <div v-for="(char, id) in engine.visibleCharacters" :key="id"
           class="character-sprite"
           :class="[
             'pos-' + (char.position || 'center'),
             char.entering ? 'anim-' + (char.animation || 'fade_in') : '',
             char.exiting ? 'anim-exit-' + (char.animation || 'fade_out') : '',
             isSpeaking(id) ? 'speaking' : 'idle',
             char.microAction ? 'has-micro-action' : '',
             hasFlash(char) ? 'micro-flash' : '',
           ]"
           :style="microActionStyle(char)">
        <img
          v-if="!spriteErrors[id]"
          class="character-image"
          :src="getSpriteSrc(id, char.expression || 'normal')"
          :alt="getCharacterAlt(id, char.expression || 'normal')"
          loading="eager"
          decoding="async"
          @error="handleSpriteError(id)"
        />
        <div v-else class="sprite-fallback" :style="{ background: getCharColor(id) }">
          {{ getCharName(id) }}
        </div>
      </div>
    </transition-group>
  </div>
</template>

<script setup>
import { inject, reactive, computed } from 'vue'
import { characters } from '../data/characters.js'
import { getCharacterSprite } from '../data/characterSprites.js'
import { getPreset } from '../data/characterAnimPresets.js'

const engine = inject('engine')
const spriteErrors = reactive({})

function isSpeaking(id) {
  return engine.speaker.value?.id === id
}

function hasFlash(char) {
  if (!char.microAction) return false
  const preset = getPreset(char.microAction)
  return preset?.flash === true
}

function microActionStyle(char) {
  const styles = {}
  if (!char.microAction) {
    if (isSpeaking(char.id || '')) {
      styles.transform = appendCenterOffset(char, 'translateY(-2px) scale(1.01)')
      styles.transitionDuration = '0.8s'
      styles.transitionTimingFunction = 'ease-in-out'
    }
    return styles
  }

  const preset = getPreset(char.microAction)
  if (!preset) return styles

  if (preset.transform) {
    styles.transform = appendCenterOffset(char, preset.transform)
  }
  if (preset.filter) {
    styles.filter = `drop-shadow(0 4px 20px rgba(0,0,0,0.4)) ${preset.filter}`
  }
  if (preset.animation) {
    styles.animation = preset.animation
  }
  if (preset.transitionDuration) {
    styles.transitionDuration = preset.transitionDuration
  }
  if (preset.transitionTimingFunction) {
    styles.transitionTimingFunction = preset.transitionTimingFunction
  }

  return styles
}

function appendCenterOffset(char, transform) {
  if ((char.position || 'center') === 'center') {
    return `translateX(-50%) ${transform}`
  }
  return transform
}

function getSpriteSrc(id, expression) {
  return getCharacterSprite(id, expression) || getCharacterSprite(id, 'normal') || ''
}

function getCharacterAlt(id, expression) {
  const name = characters[id]?.name || id
  return `${name} ${expression}`
}

function getCharColor(id) {
  return characters[id]?.color || '#999'
}

function getCharName(id) {
  return characters[id]?.nameShort || id
}

function handleSpriteError(id) {
  spriteErrors[id] = true
}
</script>

<style scoped>
.character-layer {
  position: absolute;
  inset: 0;
  z-index: 1;
  pointer-events: none;
}

.character-sprite {
  position: absolute;
  bottom: clamp(92px, 14vh, 180px);
  display: flex;
  flex-direction: column;
  align-items: center;
  transition: all 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  filter: drop-shadow(0 4px 20px rgba(0,0,0,0.4));
}

.character-image {
  display: block;
  width: clamp(300px, 34vw, 540px);
  height: auto;
  max-height: 90vh;
  object-fit: contain;
  object-position: center bottom;
  user-select: none;
  -webkit-user-drag: none;
}

.pos-left { left: 8%; }
.pos-center { left: 50%; transform: translateX(-50%); }
.pos-right { right: 8%; }

.speaking {
  filter: drop-shadow(0 4px 20px rgba(0,0,0,0.4)) brightness(1);
  z-index: 2;
  transform: translateY(-2px);
  opacity: 1;
  animation: breathe 3.6s ease-in-out infinite;
}

.speaking:not(.has-micro-action) {
  animation: breathe 3.6s ease-in-out infinite;
}

.has-micro-action.speaking {
  animation: none;
}

.idle {
  filter: drop-shadow(0 4px 20px rgba(0,0,0,0.3)) brightness(0.85);
  z-index: 1;
  opacity: 0.72;
  animation: breathe-idle 4.2s ease-in-out infinite;
}

.idle:not(.has-micro-action) {
  animation: breathe-idle 4.2s ease-in-out infinite;
}

.has-micro-action.idle {
  animation: none;
}

.pos-center.speaking:not(.has-micro-action) {
  transform: translateX(-50%) translateY(-2px);
  animation-name: breathe-center;
}

.pos-center.idle:not(.has-micro-action) {
  animation-name: breathe-idle-center;
}

.micro-flash {
  animation: char-flash 0.15s ease-out !important;
}

/* --- Breathe keyframes --- */

@keyframes breathe {
  0%, 100% { transform: translateY(-2px) scaleY(1); }
  50% { transform: translateY(-2px) scaleY(1.004); }
}

@keyframes breathe-center {
  0%, 100% { transform: translateX(-50%) translateY(-2px) scaleY(1); }
  50% { transform: translateX(-50%) translateY(-2px) scaleY(1.004); }
}

@keyframes breathe-idle {
  0%, 100% { transform: translateY(0) scaleY(1); }
  50% { transform: translateY(0) scaleY(1.003); }
}

@keyframes breathe-idle-center {
  0%, 100% { transform: translateX(-50%) translateY(0) scaleY(1); }
  50% { transform: translateX(-50%) translateY(0) scaleY(1.003); }
}

/* --- Micro-action keyframes --- */

@keyframes char-shake {
  0%, 100% { transform: translateX(0); }
  20% { transform: translateX(-4px); }
  40% { transform: translateX(4px); }
  60% { transform: translateX(-3px); }
  80% { transform: translateX(3px); }
}

@keyframes char-nod {
  0%, 100% { transform: translateY(0); }
  40% { transform: translateY(6px); }
  60% { transform: translateY(2px); }
  80% { transform: translateY(5px); }
}

@keyframes char-tilt {
  0%, 100% { transform: rotate(0deg); }
  40% { transform: rotate(3deg); }
  70% { transform: rotate(-1deg); }
}

@keyframes char-tremble {
  0%, 100% { transform: translateX(0) translateY(0); }
  25% { transform: translateX(-1px) translateY(1px); }
  50% { transform: translateX(1px) translateY(-1px); }
  75% { transform: translateX(-1px) translateY(0); }
}

@keyframes char-bounce {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-10px); }
}

@keyframes char-flash {
  0% { filter: drop-shadow(0 4px 20px rgba(0,0,0,0.4)) brightness(2); }
  100% { filter: drop-shadow(0 4px 20px rgba(0,0,0,0.4)) brightness(1); }
}

/* --- Enter / exit --- */

.sprite-fallback {
  width: clamp(200px, 24vw, 320px);
  height: clamp(400px, 50vh, 600px);
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  font-size: 24px;
  font-weight: 700;
  font-family: var(--vn-font-title);
  text-shadow: 0 2px 8px rgba(0,0,0,0.3);
  opacity: 0.7;
}

.anim-fade_in { animation: char-fade-in 0.6s ease both; }
.anim-slide_from_left { animation: char-slide-left 0.6s ease both; }
.anim-slide_from_right { animation: char-slide-right 0.6s ease both; }
.anim-exit-fade_out { animation: char-fade-out 0.5s ease both; }
.anim-exit-slide_out_left { animation: char-exit-left 0.5s ease both; }

@keyframes char-fade-in {
  0% { opacity: 0; transform: translateY(30px); }
  100% { opacity: 1; transform: translateY(0); }
}

@keyframes char-slide-left {
  0% { opacity: 0; transform: translateX(-120px); }
  100% { opacity: 1; transform: translateX(0); }
}

@keyframes char-slide-right {
  0% { opacity: 0; transform: translateX(120px); }
  100% { opacity: 1; transform: translateX(0); }
}

@keyframes char-fade-out {
  0% { opacity: 1; }
  100% { opacity: 0; transform: translateY(-20px); }
}

@keyframes char-exit-left {
  0% { opacity: 1; transform: translateX(0); }
  100% { opacity: 0; transform: translateX(-120px); }
}

.char-anim-enter-active { transition: all 0.5s ease; }
.char-anim-leave-active { transition: all 0.3s ease; }
.char-anim-enter-from { opacity: 0; transform: translateY(30px); }
.char-anim-leave-to { opacity: 0; }

@media (max-width: 768px) {
  .character-sprite {
    bottom: clamp(112px, 18vh, 210px);
  }

  .character-image {
    width: clamp(220px, 52vw, 360px);
    max-height: 82vh;
  }
  .pos-left { left: 2%; }
  .pos-right { right: 2%; }
}
</style>
