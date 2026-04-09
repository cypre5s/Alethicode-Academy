<template>
  <svg class="sprite" viewBox="0 0 200 450" xmlns="http://www.w3.org/2000/svg">
    <!-- Body -->
    <rect x="60" y="220" width="80" height="180" rx="30" fill="#FFFFFF" />
    <rect x="65" y="225" width="70" height="80" rx="6" fill="#FFF8E1" />
    <circle cx="85" cy="240" r="4" fill="#FF8C42" opacity="0.6" />
    <circle cx="95" cy="248" r="3" fill="#3DAA6D" opacity="0.5" />
    <circle cx="110" cy="238" r="3.5" fill="#6C5CE7" opacity="0.5" />

    <!-- Twintails -->
    <path d="M40 130 Q30 160 25 220 Q20 280 30 340 Q35 360 45 350 Q50 300 48 220 Q47 170 45 140 Z" :fill="hair" />
    <path d="M160 130 Q170 160 175 220 Q180 280 170 340 Q165 360 155 350 Q150 300 152 220 Q153 170 155 140 Z" :fill="hair" />
    <circle cx="42" cy="125" r="8" :fill="hair" />
    <circle cx="42" cy="125" r="5" fill="#FFE066" />
    <circle cx="158" cy="125" r="8" :fill="hair" />
    <circle cx="158" cy="125" r="5" fill="#FFE066" />

    <!-- Neck -->
    <rect x="88" y="195" width="24" height="30" rx="8" fill="#FDE8D0" />

    <!-- Face -->
    <ellipse cx="100" cy="155" rx="46" ry="54" fill="#FDE8D0" />

    <!-- Blush -->
    <ellipse v-if="showBlush" cx="73" cy="166" rx="11" ry="5" fill="#FF9AA2" opacity="0.5" />
    <ellipse v-if="showBlush" cx="127" cy="166" rx="11" ry="5" fill="#FF9AA2" opacity="0.5" />

    <!-- Eyes -->
    <g>
      <template v-if="eyeStyle === 'normal'">
        <ellipse cx="80" cy="148" rx="8" ry="10" fill="#3DAA6D" />
        <ellipse cx="120" cy="148" rx="8" ry="10" fill="#3DAA6D" />
        <circle cx="83" cy="144" r="3" fill="white" opacity="0.8" />
        <circle cx="123" cy="144" r="3" fill="white" opacity="0.8" />
      </template>
      <template v-else-if="eyeStyle === 'fired'">
        <ellipse cx="80" cy="147" rx="9" ry="11" fill="#3DAA6D" />
        <ellipse cx="120" cy="147" rx="9" ry="11" fill="#3DAA6D" />
        <circle cx="84" cy="143" r="4" fill="white" opacity="0.9" />
        <circle cx="124" cy="143" r="4" fill="white" opacity="0.9" />
        <path d="M75 146 L85 150" stroke="white" stroke-width="1" opacity="0.4" />
        <path d="M115 146 L125 150" stroke="white" stroke-width="1" opacity="0.4" />
      </template>
      <template v-else-if="eyeStyle === 'closed'">
        <path d="M72 150 Q80 142 88 150" stroke="#3DAA6D" stroke-width="2.5" fill="none" />
        <path d="M112 150 Q120 142 128 150" stroke="#3DAA6D" stroke-width="2.5" fill="none" />
      </template>
      <template v-else-if="eyeStyle === 'wide'">
        <ellipse cx="80" cy="147" rx="9" ry="13" fill="#3DAA6D" />
        <ellipse cx="120" cy="147" rx="9" ry="13" fill="#3DAA6D" />
        <circle cx="83" cy="143" r="4" fill="white" opacity="0.9" />
        <circle cx="123" cy="143" r="4" fill="white" opacity="0.9" />
      </template>
    </g>

    <!-- Eyebrows -->
    <path :d="leftBrow" stroke="#CC7030" stroke-width="2.5" fill="none" stroke-linecap="round" />
    <path :d="rightBrow" stroke="#CC7030" stroke-width="2.5" fill="none" stroke-linecap="round" />

    <!-- Mouth -->
    <path :d="mouthPath" stroke="#E57373" :stroke-width="mouthSW" :fill="mouthFill" stroke-linecap="round" />

    <!-- Hair Front -->
    <path :d="hairFront" :fill="hair" />
  </svg>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  expression: { type: String, default: 'normal' },
  isSpeaking: Boolean
})

const hair = '#FF8C42'

const showBlush = computed(() => ['blush', 'soft_smile'].includes(props.expression))

const eyeStyle = computed(() => {
  switch (props.expression) {
    case 'grin': case 'soft_smile': return 'closed'
    case 'competitive': case 'fired_up': return 'fired'
    case 'surprised': return 'wide'
    default: return 'normal'
  }
})

const leftBrow = computed(() => {
  switch (props.expression) {
    case 'competitive': case 'fired_up': return 'M68 128 Q76 122 86 130'
    case 'pout': return 'M72 130 Q78 134 86 132'
    case 'surprised': return 'M70 126 Q76 120 86 126'
    default: return 'M72 132 Q78 128 86 132'
  }
})

const rightBrow = computed(() => {
  switch (props.expression) {
    case 'competitive': case 'fired_up': return 'M114 130 Q124 122 132 128'
    case 'pout': return 'M114 132 Q122 134 128 130'
    case 'surprised': return 'M114 126 Q124 120 130 126'
    default: return 'M114 132 Q122 128 128 132'
  }
})

const mouthPath = computed(() => {
  switch (props.expression) {
    case 'grin': return 'M85 170 Q100 185 115 170'
    case 'competitive': case 'fired_up': return 'M88 170 Q100 182 112 170'
    case 'pout': return 'M92 176 Q100 172 108 176'
    case 'surprised': return 'M94 170 Q100 180 106 170 Q100 178 94 170'
    case 'soft_smile': return 'M92 173 Q100 178 108 173'
    case 'blush': return 'M94 173 Q100 170 106 173'
    default: return 'M90 173 Q100 177 110 173'
  }
})

const mouthFill = computed(() => {
  if (['grin', 'competitive', 'fired_up', 'surprised'].includes(props.expression)) return '#E57373'
  return 'none'
})

const mouthSW = computed(() => ['surprised'].includes(props.expression) ? '1' : '2')

const hairFront = 'M48 135 Q52 90 75 70 Q88 58 100 55 Q112 58 125 70 Q148 90 152 135 Q146 118 138 122 Q128 108 118 118 Q108 98 100 108 Q92 98 82 118 Q72 108 62 122 Q54 118 48 135 Z'
</script>

<style scoped>
.sprite { width: 180px; height: auto; transition: all 0.3s ease; }
</style>
