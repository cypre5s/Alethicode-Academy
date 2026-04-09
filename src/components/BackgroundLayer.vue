<template>
  <div class="bg-layer" :class="{ transitioning: engine.isTransitioning.value }">
    <div v-if="entry?.image" class="bg-base" :style="bgStyle"></div>
    <div class="bg-color-grade" :class="`preset-${preset}`"></div>
    <div class="bg-haze" :class="`preset-${preset}`"></div>
    <div class="bg-vignette"></div>

    <div v-if="showStars" class="bg-stars">
      <span v-for="star in stars" :key="star.id" class="star" :style="star.style"></span>
    </div>

    <div v-if="showSparkles" class="bg-sparkles">
      <span v-for="sparkle in sparkles" :key="sparkle.id" class="sparkle" :style="sparkle.style"></span>
    </div>

    <div v-if="showLanterns" class="bg-lanterns">
      <span v-for="lantern in lanterns" :key="lantern.id" class="lantern" :style="lantern.style"></span>
    </div>
  </div>
</template>

<script setup>
import { computed, inject } from 'vue'
import { getBackgroundEntry } from '../data/locations.js'

const engine = inject('engine')

function makeParticles(length, mapper) {
  return Array.from({ length }, (_, index) => mapper(index))
}

const stars = makeParticles(42, (index) => ({
  id: `star-${index}`,
  style: {
    left: `${(index * 73) % 100}%`,
    top: `${8 + ((index * 29) % 48)}%`,
    width: `${1 + (index % 3)}px`,
    height: `${1 + (index % 3)}px`,
    animationDelay: `${(index % 8) * 0.35}s`,
    animationDuration: `${2.8 + (index % 5) * 0.6}s`,
  },
}))

const sparkles = makeParticles(18, (index) => ({
  id: `sparkle-${index}`,
  style: {
    left: `${8 + ((index * 17) % 84)}%`,
    top: `${12 + ((index * 31) % 70)}%`,
    width: `${8 + (index % 5) * 3}px`,
    height: `${8 + (index % 5) * 3}px`,
    animationDelay: `${(index % 6) * 0.4}s`,
    animationDuration: `${5.6 + (index % 4) * 0.8}s`,
  },
}))

const lanterns = makeParticles(6, (index) => ({
  id: `lantern-${index}`,
  style: {
    left: `${14 + index * 14}%`,
    top: `${10 + (index % 2) * 2}%`,
    animationDelay: `${index * 0.2}s`,
    animationDuration: `${5.4 + (index % 3) * 0.6}s`,
  },
}))

const entry = computed(() => getBackgroundEntry(engine.currentBg.value))
const preset = computed(() => entry.value?.effectPreset || 'spring_day')

const bgStyle = computed(() => ({
  backgroundImage: `url(${entry.value?.image})`,
}))

const showStars = computed(() => ['blue_night', 'lab_night_glow', 'fireworks_bloom'].includes(preset.value))
const showLanterns = computed(() => preset.value === 'festival_lantern')
const showSparkles = computed(() => ['spring_day', 'golden_hour', 'festival_lantern', 'fireworks_bloom'].includes(preset.value))
</script>

<style scoped>
.bg-layer {
  position: absolute;
  inset: 0;
  z-index: 0;
  overflow: hidden;
  transition: opacity 0.65s ease;
}

.bg-layer.transitioning {
  opacity: 0;
}

.bg-base,
.bg-color-grade,
.bg-haze,
.bg-vignette,
.bg-stars,
.bg-sparkles,
.bg-lanterns {
  position: absolute;
  inset: 0;
}

.bg-base {
  background-position: center;
  background-repeat: no-repeat;
  background-size: cover;
  transform: scale(1.04);
  filter: saturate(1.03) contrast(1.03);
  animation: bg-drift 20s ease-in-out infinite alternate;
}

.bg-color-grade {
  pointer-events: none;
  mix-blend-mode: screen;
}

.bg-color-grade.preset-spring_day {
  background:
    radial-gradient(circle at 16% 18%, rgba(255, 239, 218, 0.44), transparent 36%),
    linear-gradient(180deg, rgba(255, 251, 245, 0.08), rgba(248, 232, 226, 0.1));
}

.bg-color-grade.preset-golden_hour {
  background:
    radial-gradient(circle at 78% 16%, rgba(255, 205, 135, 0.48), transparent 34%),
    linear-gradient(180deg, rgba(255, 233, 205, 0.12), rgba(255, 196, 152, 0.12));
}

.bg-color-grade.preset-blue_night {
  background:
    radial-gradient(circle at 72% 18%, rgba(255, 218, 164, 0.12), transparent 30%),
    linear-gradient(180deg, rgba(32, 65, 108, 0.22), rgba(16, 27, 46, 0.2));
}

.bg-color-grade.preset-lab_night_glow {
  background:
    radial-gradient(circle at 48% 38%, rgba(124, 220, 255, 0.18), transparent 36%),
    linear-gradient(180deg, rgba(17, 49, 89, 0.2), rgba(6, 16, 32, 0.22));
}

.bg-color-grade.preset-festival_lantern {
  background:
    radial-gradient(circle at 72% 18%, rgba(255, 201, 112, 0.44), transparent 32%),
    linear-gradient(180deg, rgba(255, 239, 214, 0.12), rgba(255, 188, 124, 0.14));
}

.bg-color-grade.preset-fireworks_bloom {
  background:
    radial-gradient(circle at 70% 15%, rgba(255, 212, 136, 0.16), transparent 32%),
    linear-gradient(180deg, rgba(22, 47, 92, 0.18), rgba(8, 18, 36, 0.2));
}

.bg-haze {
  pointer-events: none;
  mix-blend-mode: screen;
}

.bg-haze.preset-spring_day {
  background: linear-gradient(180deg, rgba(255, 255, 255, 0.2), transparent 26%, transparent 72%, rgba(255, 247, 242, 0.12));
}

.bg-haze.preset-golden_hour,
.bg-haze.preset-festival_lantern {
  background: linear-gradient(180deg, rgba(255, 245, 229, 0.18), transparent 28%, transparent 70%, rgba(255, 212, 160, 0.12));
}

.bg-haze.preset-blue_night,
.bg-haze.preset-lab_night_glow,
.bg-haze.preset-fireworks_bloom {
  background: linear-gradient(180deg, rgba(255, 255, 255, 0.05), transparent 24%, transparent 74%, rgba(10, 18, 36, 0.08));
}

.bg-vignette {
  pointer-events: none;
  background:
    radial-gradient(circle at center, transparent 44%, rgba(27, 17, 11, 0.12) 100%),
    linear-gradient(180deg, rgba(48, 28, 17, 0.05), transparent 28%, transparent 74%, rgba(40, 22, 14, 0.08));
}

.bg-stars,
.bg-sparkles,
.bg-lanterns {
  pointer-events: none;
}

.star {
  position: absolute;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.92);
  box-shadow: 0 0 10px rgba(255, 255, 255, 0.75);
  animation: twinkle ease-in-out infinite;
}

.sparkle {
  position: absolute;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(255, 247, 227, 0.85) 0%, rgba(255, 216, 174, 0.24) 50%, transparent 72%);
  filter: blur(0.5px);
  animation: float-sparkle ease-in-out infinite;
}

.lantern {
  position: absolute;
  width: 40px;
  height: 72px;
  border-radius: 14px;
  background: linear-gradient(180deg, rgba(255, 213, 128, 0.92), rgba(255, 160, 82, 0.88));
  box-shadow: 0 0 36px rgba(255, 188, 110, 0.34);
  animation: swing ease-in-out infinite;
}

.lantern::before {
  content: '';
  position: absolute;
  top: -20px;
  left: 50%;
  width: 2px;
  height: 24px;
  background: rgba(117, 79, 46, 0.82);
  transform: translateX(-50%);
}

.lantern::after {
  content: '';
  position: absolute;
  inset: 12px 6px;
  border-radius: 999px;
  background: linear-gradient(180deg, rgba(255, 239, 201, 0.66), rgba(255, 255, 255, 0.05));
}

@keyframes bg-drift {
  0% {
    transform: scale(1.04) translate3d(-1.2%, -0.8%, 0);
  }
  100% {
    transform: scale(1.07) translate3d(1.4%, 0.8%, 0);
  }
}

@keyframes twinkle {
  0%,
  100% {
    opacity: 0.28;
    transform: scale(0.84);
  }
  50% {
    opacity: 1;
    transform: scale(1.12);
  }
}

@keyframes float-sparkle {
  0%,
  100% {
    opacity: 0.2;
    transform: translate3d(0, 0, 0);
  }
  50% {
    opacity: 0.8;
    transform: translate3d(0, -12px, 0);
  }
}

@keyframes swing {
  0%,
  100% {
    transform: rotate(-2deg);
  }
  50% {
    transform: rotate(2deg);
  }
}

@media (prefers-reduced-motion: reduce) {
  .bg-base,
  .star,
  .sparkle,
  .lantern {
    animation: none;
  }
}
</style>
