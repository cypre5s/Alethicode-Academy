<template>
  <svg class="sprite" viewBox="0 0 200 450" xmlns="http://www.w3.org/2000/svg">
    <!-- Body -->
    <rect x="60" y="220" width="80" height="180" rx="30" fill="#D4E8F7" />
    <rect x="65" y="225" width="70" height="90" rx="8" fill="#FFFFFF" />
    <circle cx="100" cy="240" r="6" fill="#6C5CE7" opacity="0.7" />
    <text x="100" y="260" text-anchor="middle" font-size="5" fill="#6C5CE7" opacity="0.6">AI TUTOR</text>

    <!-- Hair Back -->
    <ellipse cx="100" cy="180" rx="55" ry="20" :fill="hair" opacity="0.6" />
    <path :d="hairBackPath" :fill="hair" opacity="0.8" />

    <!-- Neck -->
    <rect x="88" y="195" width="24" height="30" rx="8" fill="#FDE8D0" />

    <!-- Face -->
    <ellipse cx="100" cy="155" rx="48" ry="56" fill="#FDE8D0" />

    <!-- Blush -->
    <ellipse v-if="showBlush" cx="72" cy="165" rx="12" ry="6" fill="#FFB6C1" opacity="0.5">
      <animate attributeName="opacity" values="0.3;0.6;0.3" dur="2s" repeatCount="indefinite" />
    </ellipse>
    <ellipse v-if="showBlush" cx="128" cy="165" rx="12" ry="6" fill="#FFB6C1" opacity="0.5">
      <animate attributeName="opacity" values="0.3;0.6;0.3" dur="2s" repeatCount="indefinite" />
    </ellipse>

    <!-- Eyes -->
    <g :transform="eyeTransform">
      <template v-if="eyeStyle === 'normal'">
        <ellipse cx="80" cy="148" rx="8" ry="10" fill="#9B7DC8" />
        <ellipse cx="120" cy="148" rx="8" ry="10" fill="#9B7DC8" />
        <circle cx="82" cy="145" r="3" fill="white" opacity="0.8" />
        <circle cx="122" cy="145" r="3" fill="white" opacity="0.8" />
      </template>
      <template v-else-if="eyeStyle === 'closed'">
        <path d="M72 150 Q80 144 88 150" stroke="#9B7DC8" stroke-width="2.5" fill="none" />
        <path d="M112 150 Q120 144 128 150" stroke="#9B7DC8" stroke-width="2.5" fill="none" />
      </template>
      <template v-else-if="eyeStyle === 'wide'">
        <ellipse cx="80" cy="148" rx="9" ry="12" fill="#9B7DC8" />
        <ellipse cx="120" cy="148" rx="9" ry="12" fill="#9B7DC8" />
        <circle cx="83" cy="144" r="4" fill="white" opacity="0.9" />
        <circle cx="123" cy="144" r="4" fill="white" opacity="0.9" />
      </template>
      <template v-else-if="eyeStyle === 'halfclosed'">
        <ellipse cx="80" cy="150" rx="8" ry="6" fill="#9B7DC8" />
        <ellipse cx="120" cy="150" rx="8" ry="6" fill="#9B7DC8" />
        <circle cx="82" cy="148" r="2" fill="white" opacity="0.6" />
        <circle cx="122" cy="148" r="2" fill="white" opacity="0.6" />
      </template>
    </g>

    <!-- Eyebrows -->
    <path :d="leftBrow" stroke="#C4A080" stroke-width="2" fill="none" stroke-linecap="round" />
    <path :d="rightBrow" stroke="#C4A080" stroke-width="2" fill="none" stroke-linecap="round" />

    <!-- Mouth -->
    <path :d="mouthPath" :stroke="mouthStroke" :stroke-width="mouthStrokeWidth"
          :fill="mouthFill" stroke-linecap="round" />

    <!-- Hair Front -->
    <path :d="hairFrontPath" :fill="hair" />
    <path d="M52 120 Q60 95 70 120" :fill="hair" opacity="0.9" />
    <path d="M130 120 Q140 95 148 120" :fill="hair" opacity="0.9" />
  </svg>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  expression: { type: String, default: 'normal' },
  isSpeaking: Boolean
})

const hair = '#F4C2D0'

const showBlush = computed(() => ['blush', 'confused', 'gentle_smile'].includes(props.expression))

const eyeStyle = computed(() => {
  switch (props.expression) {
    case 'smile': case 'gentle_smile': return 'closed'
    case 'surprised': return 'wide'
    case 'sad': case 'thinking': return 'halfclosed'
    default: return 'normal'
  }
})

const eyeTransform = computed(() => {
  if (props.expression === 'thinking') return 'translate(3, -2)'
  return ''
})

const leftBrow = computed(() => {
  switch (props.expression) {
    case 'surprised': return 'M70 130 Q76 124 86 128'
    case 'sad': return 'M72 128 Q78 132 86 130'
    case 'confused': return 'M70 130 Q76 126 86 132'
    default: return 'M72 132 Q78 128 86 132'
  }
})

const rightBrow = computed(() => {
  switch (props.expression) {
    case 'surprised': return 'M114 128 Q124 124 130 130'
    case 'sad': return 'M114 130 Q122 132 128 128'
    case 'confused': return 'M114 132 Q124 126 130 130'
    default: return 'M114 132 Q122 128 128 132'
  }
})

const mouthPath = computed(() => {
  switch (props.expression) {
    case 'smile': case 'gentle_smile': return 'M90 172 Q100 180 110 172'
    case 'surprised': return 'M94 170 Q100 178 106 170 Q100 176 94 170'
    case 'sad': return 'M90 176 Q100 172 110 176'
    case 'blush': return 'M94 173 Q100 170 106 173'
    case 'thinking': return 'M92 173 Q96 170 100 173'
    default: return 'M92 173 Q100 177 108 173'
  }
})

const mouthFill = computed(() => {
  if (['surprised'].includes(props.expression)) return '#E57373'
  return 'none'
})

const mouthStroke = computed(() => '#E57373')
const mouthStrokeWidth = computed(() => props.expression === 'surprised' ? '1' : '2')

const hairBackPath = 'M45 140 Q40 200 50 360 Q60 390 80 400 L100 400 L120 400 Q140 390 150 360 Q160 200 155 140 Z'
const hairFrontPath = 'M45 140 Q50 90 70 70 Q85 55 100 50 Q115 55 130 70 Q150 90 155 140 Q148 120 140 125 Q130 110 120 120 Q110 100 100 110 Q90 100 80 120 Q70 110 60 125 Q52 120 45 140 Z'
</script>

<style scoped>
.sprite { width: 180px; height: auto; transition: all 0.3s ease; }
</style>
