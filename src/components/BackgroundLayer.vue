<template>
  <div class="bg-layer">
    <div class="bg-scene bg-scene-back" :class="`preset-${backPreset}`"
         :style="{ opacity: backOpacity, zIndex: 0 }">
      <div v-if="backEntry?.image" class="bg-base" :style="{ backgroundImage: `url(${backEntry.image})` }"></div>
      <div class="bg-color-grade" :class="`preset-${backPreset}`"></div>
      <div class="bg-haze" :class="`preset-${backPreset}`"></div>
    </div>

    <div class="bg-scene bg-scene-front" :class="`preset-${frontPreset}`"
         :style="{ opacity: frontOpacity, zIndex: 1 }">
      <div v-if="frontEntry?.image" class="bg-base" :style="{ backgroundImage: `url(${frontEntry.image})` }"></div>
      <div class="bg-color-grade" :class="`preset-${frontPreset}`"></div>
      <div class="bg-haze" :class="`preset-${frontPreset}`"></div>
    </div>

    <div class="bg-vignette" :class="vignetteClass" style="z-index: 2"></div>
    <div v-if="emotionOverlay" class="bg-emotion-overlay" :class="'emotion-' + emotionOverlay" style="z-index: 3"></div>
    <div v-if="affectiveFilter" class="bg-affective-filter" :class="'affective-' + affectiveFilter.filter" :style="{ opacity: affectiveFilter.intensity }" style="z-index: 3"></div>

    <div v-if="showStars" class="bg-stars" style="z-index: 4">
      <span v-for="star in activeStars" :key="star.id" class="star" :style="star.style"></span>
    </div>

    <div v-if="showSparkles" class="bg-sparkles" style="z-index: 4">
      <span v-for="sparkle in activeSparkles" :key="sparkle.id" class="sparkle" :style="sparkle.style"></span>
    </div>

    <div v-if="showLanterns" class="bg-lanterns" style="z-index: 4">
      <span v-for="lantern in activeLanterns" :key="lantern.id" class="lantern" :style="lantern.style"></span>
    </div>

    <div v-if="worldWeather === 'rain'" class="bg-world-weather rain-layer" style="z-index: 5">
      <span v-for="drop in rainDrops" :key="drop.id" class="rain-drop" :style="drop.style"></span>
    </div>
    <div v-if="worldWeather === 'snow'" class="bg-world-weather snow-layer" style="z-index: 5">
      <span v-for="flake in snowFlakes" :key="flake.id" class="snow-flake" :style="flake.style"></span>
    </div>
    <div v-if="worldWeather === 'sakura'" class="bg-world-weather sakura-layer" style="z-index: 5">
      <span v-for="petal in sakuraPetals" :key="petal.id" class="sakura-petal" :style="petal.style"></span>
    </div>
    <div v-if="worldWeather === 'fireflies'" class="bg-world-weather firefly-layer" style="z-index: 5">
      <span v-for="fly in fireflyDots" :key="fly.id" class="firefly" :style="fly.style"></span>
    </div>
    <div v-if="worldWeather === 'storm'" class="bg-world-weather storm-layer" style="z-index: 5">
      <span v-for="drop in stormDrops" :key="drop.id" class="storm-drop" :style="drop.style"></span>
      <div class="lightning-flash" :class="{ active: lightningActive }"></div>
    </div>
    <div v-if="worldSkyFilter" class="bg-world-sky-filter" :style="{ backgroundColor: worldSkyFilter }" style="z-index: 3"></div>
    <canvas v-if="shaderEnabled" ref="shaderCanvas" class="bg-shader-overlay" style="z-index: 6"></canvas>
  </div>
</template>

<script setup>
import { computed, inject, ref, watch, onMounted, onUnmounted, nextTick } from 'vue'
import { getBackgroundEntry } from '../data/locations.js'
import { useShaderEffects } from '../engine/ShaderEffectManager.js'

const engine = inject('engine')
const shaderFx = useShaderEffects()
const shaderCanvas = ref(null)
const shaderEnabled = ref(shaderFx.isAvailable.value)

if (typeof window !== 'undefined') {
  window.addEventListener('quality-change', (e) => {
    const q = e.detail?.quality
    if (q === 'low') shaderEnabled.value = false
    else if (shaderFx.isAvailable.value) shaderEnabled.value = true
  })
}

onMounted(async () => {
  if (shaderEnabled.value) {
    await nextTick()
    if (shaderCanvas.value && shaderFx.initialize(shaderCanvas.value)) {
      _syncShaderToScene(engine.currentBg.value)
    } else {
      shaderEnabled.value = false
    }
  }
})

onUnmounted(() => { shaderFx.dispose() })

const SCENE_SHADER_MAP = {
  night: { effect: 'starfield', intensity: 0.6 },
  evening: { effect: 'warmGlow', intensity: 0.8 },
  rain: { effect: 'raindrops', intensity: 0.7 },
  festival: { effect: 'bokeh', intensity: 0.5, tint: [1.0, 0.6, 0.4] },
}

function _syncShaderToScene(bgName) {
  if (!shaderEnabled.value) return
  Object.keys(shaderFx.activeEffects).forEach(k => shaderFx.disableEffect(k))

  const bgLower = (bgName || '').toLowerCase()
  for (const [keyword, config] of Object.entries(SCENE_SHADER_MAP)) {
    if (bgLower.includes(keyword)) {
      shaderFx.enableEffect(config.effect, { intensity: config.intensity, tint: config.tint, fadeIn: 2000 })
      return
    }
  }
}

watch(() => engine.currentBg.value, _syncShaderToScene)

const frontBgId = ref(engine.currentBg.value)
const backBgId = ref(null)
const frontOpacity = ref(1)
const backOpacity = ref(0)
let crossfadeTimer = null

const frontEntry = computed(() => getBackgroundEntry(frontBgId.value))
const backEntry = computed(() => backBgId.value ? getBackgroundEntry(backBgId.value) : null)
const frontPreset = computed(() => frontEntry.value?.effectPreset || 'spring_day')
const backPreset = computed(() => backEntry.value?.effectPreset || 'spring_day')

const activePreset = computed(() => frontOpacity.value >= 0.5 ? frontPreset.value : backPreset.value)

watch(() => engine.currentBg.value, (newBg, oldBg) => {
  if (newBg === frontBgId.value) return
  if (crossfadeTimer) clearTimeout(crossfadeTimer)

  backBgId.value = frontBgId.value
  backOpacity.value = 1
  frontBgId.value = newBg
  frontOpacity.value = 0

  requestAnimationFrame(() => {
    frontOpacity.value = 1
    backOpacity.value = 0
  })

  const dur = engine.transitionDuration.value || 800
  crossfadeTimer = setTimeout(() => {
    backBgId.value = null
    crossfadeTimer = null
  }, dur + 100)
})

function _getParticleScale() {
  const isMobile = /Android|iPhone|iPad|iPod|Mobile/i.test(navigator.userAgent)
  if (!isMobile) return 1
  const mem = navigator.deviceMemory || 3
  if (mem <= 2) return 0
  if (mem <= 4) return 0.25
  return 0.5
}
const _particleScale = _getParticleScale()

function makeParticles(length, mapper) {
  const adjustedLength = Math.max(1, Math.round(length * _particleScale))
  return Array.from({ length: adjustedLength }, (_, index) => mapper(index))
}

const activeStars = computed(() => {
  if (!showStars.value) return []
  return makeParticles(42, (index) => ({
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
})

const activeSparkles = computed(() => {
  if (!showSparkles.value) return []
  return makeParticles(18, (index) => ({
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
})

const activeLanterns = computed(() => {
  if (!showLanterns.value) return []
  return makeParticles(6, (index) => ({
    id: `lantern-${index}`,
    style: {
      left: `${14 + index * 14}%`,
      top: `${10 + (index % 2) * 2}%`,
      animationDelay: `${index * 0.2}s`,
      animationDuration: `${5.4 + (index % 3) * 0.6}s`,
    },
  }))
})

const showStars = computed(() => ['blue_night', 'lab_night_glow', 'fireworks_bloom'].includes(activePreset.value))
const showLanterns = computed(() => activePreset.value === 'festival_lantern')
const showSparkles = computed(() => ['spring_day', 'golden_hour', 'festival_lantern', 'fireworks_bloom'].includes(activePreset.value))

const emotionOverlay = computed(() => engine.sceneEmotion?.value || null)

const affectiveFilter = computed(() => engine.affectiveResonance?.getActiveFilters() || null)

const worldWeather = computed(() => engine.worldVM?.worldState?.sky?.weather || 'clear')
const worldSkyFilter = computed(() => {
  const color = engine.worldVM?.worldState?.sky?.color
  if (!color || color === '#87CEEB') return null
  return color + '18'
})

const lightningActive = ref(false)
let lightningTimer = null
watch(worldWeather, (w) => {
  if (w === 'storm') {
    const flash = () => {
      lightningActive.value = true
      setTimeout(() => { lightningActive.value = false }, 150)
      lightningTimer = setTimeout(flash, 3000 + Math.random() * 7000)
    }
    lightningTimer = setTimeout(flash, 2000)
  } else {
    if (lightningTimer) clearTimeout(lightningTimer)
    lightningActive.value = false
  }
})

const rainDrops = computed(() => {
  if (worldWeather.value !== 'rain') return []
  return makeParticles(80, (i) => ({
    id: `rain-${i}`,
    style: {
      left: `${(i * 1.27) % 100}%`,
      animationDelay: `${(i * 0.037) % 1.2}s`,
      animationDuration: `${0.5 + (i % 4) * 0.15}s`,
      opacity: 0.3 + (i % 3) * 0.2,
    },
  }))
})

const snowFlakes = computed(() => {
  if (worldWeather.value !== 'snow') return []
  return makeParticles(50, (i) => ({
    id: `snow-${i}`,
    style: {
      left: `${(i * 2.03) % 100}%`,
      width: `${3 + (i % 4) * 2}px`,
      height: `${3 + (i % 4) * 2}px`,
      animationDelay: `${(i * 0.13) % 4}s`,
      animationDuration: `${4 + (i % 5) * 1.5}s`,
      opacity: 0.4 + (i % 3) * 0.2,
    },
  }))
})

const sakuraPetals = computed(() => {
  if (worldWeather.value !== 'sakura') return []
  return makeParticles(30, (i) => ({
    id: `sakura-${i}`,
    style: {
      left: `${(i * 3.37) % 100}%`,
      animationDelay: `${(i * 0.23) % 5}s`,
      animationDuration: `${5 + (i % 4) * 2}s`,
      opacity: 0.5 + (i % 3) * 0.15,
    },
  }))
})

const fireflyDots = computed(() => {
  if (worldWeather.value !== 'fireflies') return []
  return makeParticles(24, (i) => ({
    id: `fly-${i}`,
    style: {
      left: `${10 + (i * 3.7) % 80}%`,
      top: `${20 + (i * 2.9) % 60}%`,
      animationDelay: `${(i * 0.3) % 3}s`,
      animationDuration: `${3 + (i % 3) * 1.5}s`,
    },
  }))
})

const stormDrops = computed(() => {
  if (worldWeather.value !== 'storm') return []
  return makeParticles(120, (i) => ({
    id: `storm-${i}`,
    style: {
      left: `${(i * 0.87) % 100}%`,
      animationDelay: `${(i * 0.021) % 0.6}s`,
      animationDuration: `${0.3 + (i % 3) * 0.1}s`,
      opacity: 0.4 + (i % 3) * 0.15,
    },
  }))
})

onUnmounted(() => {
  if (lightningTimer) clearTimeout(lightningTimer)
})

const vignetteClass = computed(() => ({
  'vignette-heavy': emotionOverlay.value === 'vignette' || emotionOverlay.value === 'aftermath',
}))
</script>

<style scoped>
.bg-layer {
  position: absolute;
  inset: 0;
  z-index: 0;
  overflow: hidden;
  contain: strict;
  will-change: contents;
}

.bg-scene {
  position: absolute;
  inset: 0;
  transition: opacity 0.8s ease;
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
  transition: all 0.8s ease;
}

.bg-vignette.vignette-heavy {
  background:
    radial-gradient(circle at center, transparent 28%, rgba(27, 17, 11, 0.35) 100%),
    linear-gradient(180deg, rgba(48, 28, 17, 0.12), transparent 28%, transparent 64%, rgba(40, 22, 14, 0.2));
}

.bg-emotion-overlay {
  position: absolute;
  inset: 0;
  pointer-events: none;
  transition: opacity 1s ease, filter 1s ease;
}

.emotion-aftermath {
  background: rgba(15, 10, 20, 0.12);
  filter: saturate(0.85);
}

.emotion-vignette {
  background: radial-gradient(circle at center, transparent 30%, rgba(10, 5, 15, 0.3) 100%);
}

.emotion-tension {
  background: rgba(20, 5, 5, 0.1);
  filter: saturate(0.9) contrast(1.05);
}

.emotion-warmth {
  background: radial-gradient(circle at 50% 60%, rgba(255, 200, 150, 0.08), transparent 60%);
}

.emotion-melancholy {
  background: rgba(10, 15, 30, 0.15);
  filter: saturate(0.8);
}

.bg-affective-filter {
  position: absolute;
  inset: 0;
  pointer-events: none;
  transition: opacity 2s ease, background 2s ease;
}

.affective-warm_glow {
  background: radial-gradient(circle at 50% 60%, rgba(255, 200, 140, 0.12), transparent 70%);
}

.affective-soft_desaturate {
  background: rgba(10, 15, 25, 0.08);
  filter: saturate(0.88);
}

.affective-slight_red {
  background: rgba(30, 5, 5, 0.06);
}

.affective-cool_dim {
  background: rgba(5, 10, 25, 0.08);
}

.affective-warm_subtle {
  background: radial-gradient(circle at 50% 50%, rgba(255, 230, 180, 0.06), transparent 60%);
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

/* ─── WorldVM Weather Particles ─── */
.bg-world-weather { position: absolute; inset: 0; overflow: hidden; pointer-events: none; }
.bg-world-sky-filter { position: absolute; inset: 0; pointer-events: none; mix-blend-mode: overlay; transition: background-color 2s ease; }
.bg-shader-overlay { position: absolute; inset: 0; width: 100%; height: 100%; pointer-events: none; mix-blend-mode: screen; }

.rain-drop {
  position: absolute; top: -20px; width: 1px; height: 18px;
  background: linear-gradient(to bottom, transparent, rgba(174, 194, 224, 0.5));
  animation: rain-fall linear infinite;
}
@keyframes rain-fall {
  0% { transform: translateY(-20px); }
  100% { transform: translateY(calc(100vh + 20px)); }
}

.snow-flake {
  position: absolute; top: -10px; border-radius: 50%;
  background: rgba(255, 255, 255, 0.8);
  animation: snow-drift linear infinite;
}
@keyframes snow-drift {
  0% { transform: translateY(-10px) translateX(0) rotate(0deg); }
  25% { transform: translateY(25vh) translateX(15px) rotate(90deg); }
  50% { transform: translateY(50vh) translateX(-10px) rotate(180deg); }
  75% { transform: translateY(75vh) translateX(20px) rotate(270deg); }
  100% { transform: translateY(calc(100vh + 10px)) translateX(5px) rotate(360deg); }
}

.sakura-petal {
  position: absolute; top: -20px; width: 10px; height: 8px;
  background: radial-gradient(ellipse, rgba(255, 183, 197, 0.8), rgba(255, 150, 170, 0.3));
  border-radius: 50% 0 50% 50%;
  animation: sakura-fall linear infinite;
}
@keyframes sakura-fall {
  0% { transform: translateY(-20px) translateX(0) rotate(0deg); opacity: 0; }
  10% { opacity: 1; }
  25% { transform: translateY(25vh) translateX(40px) rotate(120deg); }
  50% { transform: translateY(50vh) translateX(-20px) rotate(240deg); }
  75% { transform: translateY(75vh) translateX(30px) rotate(300deg); }
  90% { opacity: 0.8; }
  100% { transform: translateY(calc(100vh + 20px)) translateX(10px) rotate(400deg); opacity: 0; }
}

.firefly {
  position: absolute; width: 4px; height: 4px; border-radius: 50%;
  background: rgba(200, 255, 100, 0.9);
  box-shadow: 0 0 8px rgba(200, 255, 100, 0.6), 0 0 16px rgba(200, 255, 100, 0.3);
  animation: firefly-glow ease-in-out infinite alternate;
}
@keyframes firefly-glow {
  0% { opacity: 0.1; transform: translate(0, 0) scale(0.8); }
  50% { opacity: 1; transform: translate(12px, -8px) scale(1.2); }
  100% { opacity: 0.2; transform: translate(-8px, 6px) scale(0.9); }
}

.storm-drop {
  position: absolute; top: -30px; width: 1.5px; height: 28px;
  background: linear-gradient(to bottom, transparent, rgba(180, 200, 220, 0.6));
  animation: storm-fall linear infinite;
  transform: rotate(10deg);
}
@keyframes storm-fall {
  0% { transform: translateY(-30px) translateX(-10px) rotate(10deg); }
  100% { transform: translateY(calc(100vh + 30px)) translateX(20px) rotate(10deg); }
}

.lightning-flash {
  position: absolute; inset: 0;
  background: rgba(200, 220, 255, 0);
  transition: background 0.05s;
  pointer-events: none;
}
.lightning-flash.active {
  background: rgba(200, 220, 255, 0.3);
}

@media (prefers-reduced-motion: reduce) {
  .bg-base,
  .star,
  .sparkle,
  .lantern,
  .rain-drop,
  .snow-flake,
  .sakura-petal,
  .firefly,
  .storm-drop {
    animation: none;
  }
}
</style>
