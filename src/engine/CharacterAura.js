import { ref, reactive, computed } from 'vue'

const CHARACTER_AURA_COLORS = {
  nene:     { base: [255, 182, 210], glow: [255, 150, 200], particle: [255, 200, 220] },
  yoshino:  { base: [120, 140, 200], glow: [100, 120, 180], particle: [140, 160, 220] },
  ayase:    { base: [255, 180, 80],  glow: [255, 160, 50],  particle: [255, 200, 100] },
  kanna:    { base: [180, 200, 255], glow: [160, 180, 240], particle: [200, 220, 255] },
  murasame: { base: [160, 100, 200], glow: [140, 80, 180],  particle: [180, 120, 220] },
}

const EMOTION_AURA_MODIFIERS = {
  normal:     { intensity: 0.0, pulse: 0, hueShift: 0 },
  smile:      { intensity: 0.3, pulse: 0.5, hueShift: 0 },
  gentle_smile: { intensity: 0.4, pulse: 0.3, hueShift: 10 },
  blush:      { intensity: 0.5, pulse: 1.0, hueShift: -10 },
  surprised:  { intensity: 0.6, pulse: 2.0, hueShift: 20 },
  sad:        { intensity: 0.2, pulse: 0.2, hueShift: 30 },
  angry:      { intensity: 0.7, pulse: 3.0, hueShift: -30 },
  cold:       { intensity: 0.15, pulse: 0.1, hueShift: 40 },
  thinking:   { intensity: 0.2, pulse: 0.8, hueShift: 15 },
  competitive: { intensity: 0.6, pulse: 2.5, hueShift: -15 },
  fired_up:   { intensity: 0.8, pulse: 3.0, hueShift: -20 },
  vulnerable: { intensity: 0.4, pulse: 0.5, hueShift: 20 },
  genuine_smile: { intensity: 0.5, pulse: 0.6, hueShift: 5 },
}

const AFFECTION_AURA_SCALE = {
  0:   0.0,
  20:  0.3,
  40:  0.5,
  60:  0.7,
  80:  0.9,
  100: 1.0,
}

const enabled = ref(true)
const activeAuras = reactive({})

function _getAffectionScale(affection) {
  const keys = Object.keys(AFFECTION_AURA_SCALE).map(Number).sort((a, b) => a - b)
  for (let i = keys.length - 1; i >= 0; i--) {
    if (affection >= keys[i]) return AFFECTION_AURA_SCALE[keys[i]]
  }
  return 0
}

export function useCharacterAura() {

  function updateAura(characterId, expression, affection) {
    if (!enabled.value) return null

    const colors = CHARACTER_AURA_COLORS[characterId]
    if (!colors) return null

    const emotionMod = EMOTION_AURA_MODIFIERS[expression] || EMOTION_AURA_MODIFIERS.normal
    const affScale = _getAffectionScale(affection || 0)
    const finalIntensity = emotionMod.intensity * affScale

    if (finalIntensity < 0.05) {
      delete activeAuras[characterId]
      return null
    }

    const aura = {
      characterId,
      color: colors.base,
      glowColor: colors.glow,
      intensity: finalIntensity,
      pulseSpeed: emotionMod.pulse,
      hueShift: emotionMod.hueShift,
      radius: 80 + finalIntensity * 120,
    }

    activeAuras[characterId] = aura
    return aura
  }

  function getAuraCSS(characterId, time) {
    const aura = activeAuras[characterId]
    if (!aura || !enabled.value) return {}

    const t = (time || performance.now()) / 1000
    const pulse = 1 + Math.sin(t * aura.pulseSpeed * Math.PI) * 0.15 * aura.intensity
    const [r, g, b] = aura.glowColor
    const alpha = aura.intensity * pulse * 0.4

    return {
      filter: `drop-shadow(0 0 ${aura.radius * pulse * 0.3}px rgba(${r},${g},${b},${alpha})) hue-rotate(${aura.hueShift}deg)`,
      transition: 'filter 0.5s ease',
    }
  }

  function getAuraGradientCSS(characterId, time) {
    const aura = activeAuras[characterId]
    if (!aura || !enabled.value) return 'none'

    const t = (time || performance.now()) / 1000
    const pulse = 1 + Math.sin(t * aura.pulseSpeed * Math.PI) * 0.2
    const [r, g, b] = aura.glowColor
    const alpha1 = aura.intensity * pulse * 0.15
    const alpha2 = aura.intensity * pulse * 0.05

    return `radial-gradient(ellipse at 50% 70%, rgba(${r},${g},${b},${alpha1}) 0%, rgba(${r},${g},${b},${alpha2}) 50%, transparent 80%)`
  }

  function setEnabled(val) {
    enabled.value = !!val
    if (!val) {
      for (const key of Object.keys(activeAuras)) delete activeAuras[key]
    }
  }

  function clearAll() {
    for (const key of Object.keys(activeAuras)) delete activeAuras[key]
  }

  return {
    enabled,
    activeAuras,
    updateAura,
    getAuraCSS,
    getAuraGradientCSS,
    setEnabled,
    clearAll,
    CHARACTER_AURA_COLORS,
  }
}
