<template>
  <div class="transition-overlay">
    <transition name="fade-fast">
      <div
        v-if="engine.isTransitioning.value"
        class="overlay-bg"
        :class="transitionClass"
        :style="{ animationDuration: engine.transitionDuration.value + 'ms' }"
      ></div>
    </transition>

    <transition name="fade-fast">
      <div
        v-if="effect"
        class="screen-effect"
        :class="'effect-' + effect.effect"
        :style="{ animationDuration: effect.duration + 'ms' }"
      ></div>
    </transition>

    <transition name="title-card-transition">
      <div v-if="engine.showTitleCard.value" class="title-card-overlay">
        <div class="title-card-content">
          <span class="title-card-kicker">Alethicode Academy</span>
          <h1 class="title-card-text">{{ engine.titleCardText.value }}</h1>
          <p v-if="engine.titleCardSubtitle.value" class="title-card-subtitle">
            {{ engine.titleCardSubtitle.value }}
          </p>
        </div>
      </div>
    </transition>

    <transition name="cg-transition">
      <div v-if="engine.showCG.value" class="cg-overlay" @click="engine.dismissCG()">
        <div class="cg-display">
          <img
            v-if="currentCg"
            class="cg-image"
            :src="currentCg.image"
            :alt="currentCg.title"
            decoding="async"
          />
          <div class="cg-frame"></div>
          <div class="cg-info">
            <span class="cg-route">{{ currentCg?.route || 'CG' }}</span>
            <span class="cg-title">{{ currentCg?.title || engine.currentCG.value }}</span>
            <span class="cg-hint">点击继续</span>
          </div>
        </div>
      </div>
    </transition>

    <transition name="ending-transition">
      <div v-if="engine.showEnding.value" class="ending-overlay">
        <div class="ending-backdrop" :style="endingBackdropStyle"></div>
        <div class="ending-content">
          <div class="ending-type">{{ endingTypeLabel }}</div>
          <h1 class="ending-title">{{ engine.endingData.value?.title }}</h1>
          <p v-if="engine.endingData.value?.text" class="ending-text">
            {{ engine.endingData.value.text }}
          </p>
          <div class="ending-route">{{ routeLabel }} End</div>
          <button class="ending-btn" @click="$emit('title')">返回标题</button>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup>
import { computed, inject } from 'vue'
import { getCgEntry } from '../data/cgCatalog.js'

defineEmits(['title'])

const engine = inject('engine')
const effect = computed(() => engine.screenEffect.value)
const currentCg = computed(() => getCgEntry(engine.currentCG.value))
const endingCg = computed(() => getCgEntry(engine.endingData.value?.cg))

const transitionClass = computed(() => {
  const type = engine.transitionType.value
  return {
    'transition-fade': type === 'fade',
    'transition-slide': type === 'slide' || type === 'slide_left',
    'transition-dissolve': type === 'dissolve',
    'transition-none': type === 'none',
  }
})

const endingTypeLabel = computed(() => {
  const type = engine.endingData.value?.endingType
  if (type === 'good') return 'Good Ending'
  if (type === 'true') return 'True Ending'
  return 'Normal Ending'
})

const routeLabel = computed(() => {
  const route = engine.endingData.value?.route
  const routeNames = {
    nene: 'Nene',
    yoshino: 'Yoshino',
    ayase: 'Ayase',
    kanna: 'Kanna',
    murasame: 'Murasame',
  }
  return routeNames[route] || route || ''
})

const endingBackdropStyle = computed(() => (
  endingCg.value?.image
    ? { backgroundImage: `url(${endingCg.value.image})` }
    : {}
))
</script>

<style scoped>
.transition-overlay {
  position: absolute;
  inset: 0;
  z-index: 50;
  pointer-events: none;
}

.overlay-bg,
.screen-effect,
.title-card-overlay,
.cg-overlay,
.ending-overlay {
  position: absolute;
  inset: 0;
}

.overlay-bg {
  pointer-events: all;
}

.transition-fade {
  background: rgba(60, 39, 23, 0.52);
  animation: transition-fade-pulse ease;
}

.transition-slide {
  background: linear-gradient(90deg, rgba(91, 61, 38, 0.44), rgba(212, 164, 109, 0.34));
  animation: transition-slide ease;
}

.transition-dissolve {
  background: rgba(255, 245, 236, 0.54);
  backdrop-filter: blur(14px);
  animation: transition-fade-pulse ease;
}

.transition-none {
  display: none;
}

@keyframes transition-fade-pulse {
  0% { opacity: 0; }
  42% { opacity: 1; }
  60% { opacity: 1; }
  100% { opacity: 0; }
}

@keyframes transition-slide {
  0% { transform: translateX(-100%); }
  42% { transform: translateX(0); }
  60% { transform: translateX(0); }
  100% { transform: translateX(100%); }
}

.screen-effect {
  pointer-events: none;
}

.effect-flash_white {
  background: rgba(255, 255, 255, 0.98);
  animation: flash-white forwards;
}

.effect-shake {
  animation: screen-shake forwards;
}

.effect-fade_to_black {
  background: rgba(31, 20, 15, 0.84);
  animation: fade-to-black forwards;
}

@keyframes flash-white {
  0% { opacity: 0; }
  18% { opacity: 1; }
  100% { opacity: 0; }
}

@keyframes screen-shake {
  0%, 100% { transform: translate(0); }
  20% { transform: translate(-8px, 2px); }
  40% { transform: translate(6px, -4px); }
  60% { transform: translate(-4px, 4px); }
  80% { transform: translate(5px, -3px); }
}

@keyframes fade-to-black {
  0% { opacity: 0; }
  100% { opacity: 1; }
}

.title-card-overlay {
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(27, 18, 13, 0.64);
  backdrop-filter: blur(12px);
  pointer-events: all;
}

.title-card-content {
  min-width: min(78vw, 680px);
  padding: 40px 52px;
  border: 1px solid rgba(216, 175, 111, 0.42);
  border-radius: 28px;
  background: linear-gradient(180deg, rgba(255, 252, 248, 0.82), rgba(255, 245, 236, 0.74));
  box-shadow: 0 30px 80px rgba(53, 31, 12, 0.24);
  text-align: center;
}

.title-card-kicker {
  display: block;
  margin-bottom: 14px;
  color: var(--vn-gold);
  font-size: 13px;
  letter-spacing: 0.28em;
  text-transform: uppercase;
}

.title-card-text {
  font-family: var(--vn-font-title);
  font-size: clamp(34px, 5vw, 54px);
  color: var(--vn-text);
  letter-spacing: 0.1em;
}

.title-card-subtitle {
  margin-top: 16px;
  color: var(--vn-text-dim);
  font-size: 16px;
  letter-spacing: 0.16em;
}

.title-card-transition-enter-active { transition: opacity 0.8s ease; }
.title-card-transition-leave-active { transition: opacity 1.2s ease; }
.title-card-transition-enter-from,
.title-card-transition-leave-to { opacity: 0; }

.cg-overlay {
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(18, 12, 10, 0.92);
  backdrop-filter: blur(12px);
  pointer-events: all;
  cursor: pointer;
}

.cg-display {
  position: relative;
  width: min(90vw, 1120px);
  aspect-ratio: 16 / 9;
  overflow: hidden;
  border-radius: 28px;
  box-shadow: 0 32px 100px rgba(28, 15, 7, 0.34);
}

.cg-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  animation: cg-push 0.9s ease both;
}

.cg-frame {
  position: absolute;
  inset: 0;
  border: 1px solid rgba(233, 201, 152, 0.4);
  border-radius: 28px;
  box-shadow: inset 0 0 0 12px rgba(255, 255, 255, 0.04);
}

.cg-info {
  position: absolute;
  left: 28px;
  right: 28px;
  bottom: 24px;
  display: flex;
  flex-direction: column;
  gap: 6px;
  padding: 18px 20px;
  border-radius: 20px;
  background: linear-gradient(180deg, rgba(255, 250, 245, 0.3), rgba(38, 23, 16, 0.34));
  backdrop-filter: blur(10px);
  color: #fff8f2;
}

.cg-route {
  color: rgba(255, 231, 196, 0.92);
  font-size: 12px;
  letter-spacing: 0.18em;
  text-transform: uppercase;
}

.cg-title {
  font-family: var(--vn-font-title);
  font-size: clamp(24px, 3vw, 34px);
}

.cg-hint {
  color: rgba(255, 242, 228, 0.72);
  font-size: 13px;
}

.cg-transition-enter-active { transition: all 0.7s ease; }
.cg-transition-leave-active { transition: all 0.45s ease; }
.cg-transition-enter-from { opacity: 0; transform: scale(1.04); }
.cg-transition-leave-to { opacity: 0; }

@keyframes cg-push {
  0% { transform: scale(1.04); filter: blur(3px); }
  100% { transform: scale(1); filter: blur(0); }
}

.ending-overlay {
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  pointer-events: all;
}

.ending-backdrop {
  position: absolute;
  inset: 0;
  background-position: center;
  background-repeat: no-repeat;
  background-size: cover;
  filter: blur(16px) saturate(1.05);
  transform: scale(1.08);
}

.ending-backdrop::after {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(180deg, rgba(22, 15, 11, 0.28), rgba(18, 12, 10, 0.82));
}

.ending-content {
  position: relative;
  z-index: 1;
  width: min(90vw, 720px);
  padding: 48px 54px;
  border-radius: 30px;
  border: 1px solid rgba(216, 177, 110, 0.42);
  background: linear-gradient(180deg, rgba(255, 252, 247, 0.88), rgba(255, 245, 236, 0.82));
  box-shadow: 0 32px 90px rgba(35, 21, 10, 0.3);
  text-align: center;
}

.ending-type {
  color: var(--vn-gold);
  font-size: 13px;
  letter-spacing: 0.28em;
  text-transform: uppercase;
}

.ending-title {
  margin-top: 16px;
  font-family: var(--vn-font-title);
  font-size: clamp(34px, 5vw, 52px);
  color: var(--vn-text);
}

.ending-text {
  margin-top: 20px;
  color: var(--vn-text-dim);
  font-size: 16px;
  line-height: 1.9;
}

.ending-route {
  margin-top: 22px;
  color: var(--vn-primary-dark);
  font-size: 15px;
  letter-spacing: 0.16em;
}

.ending-btn {
  margin-top: 28px;
  min-width: 180px;
  padding: 14px 28px;
  border-radius: 999px;
  border: 1px solid rgba(216, 177, 110, 0.4);
  background: linear-gradient(135deg, rgba(224, 145, 171, 0.9), rgba(201, 156, 76, 0.92));
  color: #fff;
  font-size: 15px;
  box-shadow: 0 16px 30px rgba(188, 133, 98, 0.24);
}

.ending-btn:hover {
  transform: translateY(-2px);
}

.ending-transition-enter-active { transition: opacity 0.8s ease; }
.ending-transition-leave-active { transition: opacity 0.4s ease; }
.ending-transition-enter-from,
.ending-transition-leave-to { opacity: 0; }

@media (max-width: 768px) {
  .cg-display {
    width: min(94vw, 1120px);
    border-radius: 20px;
  }

  .cg-frame {
    border-radius: 20px;
  }

  .cg-info {
    left: 16px;
    right: 16px;
    bottom: 14px;
    padding: 14px 16px;
  }

  .title-card-content,
  .ending-content {
    width: min(92vw, 720px);
    padding: 32px 24px;
  }
}
</style>
