<template>
  <svg class="sprite" viewBox="0 0 200 450" xmlns="http://www.w3.org/2000/svg">
    <!-- Body (black custom uniform) -->
    <rect x="58" y="218" width="84" height="185" rx="30" fill="#1A1A1A" />
    <rect x="63" y="222" width="74" height="85" rx="6" fill="#222222" />
    <path d="M80 222 L100 245 L120 222" stroke="#8B1A1A" stroke-width="1.5" fill="none" />

    <!-- Ponytail -->
    <path d="M130 100 Q155 95 165 110 Q175 130 170 180 Q168 220 160 280 Q155 310 145 330 Q140 340 135 335 Q140 300 145 250 Q148 200 145 150 Q142 120 135 108 Z" :fill="hair" />
    <circle cx="130" cy="100" r="6" fill="#D4AF37" />

    <!-- Hair Back -->
    <path d="M48 135 Q45 180 48 210 Q50 180 52 145 Z" :fill="hair" opacity="0.5" />

    <!-- Neck -->
    <rect x="88" y="195" width="24" height="28" rx="8" fill="#FDE0CC" />

    <!-- Face -->
    <ellipse cx="100" cy="155" rx="46" ry="54" fill="#FDE0CC" />

    <!-- Blush -->
    <ellipse v-if="showBlush" cx="73" cy="166" rx="10" ry="5" fill="#FFB6C1" opacity="0.35" />
    <ellipse v-if="showBlush" cx="127" cy="166" rx="10" ry="5" fill="#FFB6C1" opacity="0.35" />

    <!-- Eyes -->
    <g>
      <template v-if="eyeStyle === 'normal'">
        <ellipse cx="80" cy="148" rx="7" ry="9" fill="#D4AF37" />
        <ellipse cx="120" cy="148" rx="7" ry="9" fill="#D4AF37" />
        <circle cx="83" cy="145" r="2.5" fill="white" opacity="0.6" />
        <circle cx="123" cy="145" r="2.5" fill="white" opacity="0.6" />
      </template>
      <template v-else-if="eyeStyle === 'narrow'">
        <ellipse cx="80" cy="150" rx="7" ry="5" fill="#D4AF37" />
        <ellipse cx="120" cy="150" rx="7" ry="5" fill="#D4AF37" />
        <circle cx="82" cy="149" r="2" fill="white" opacity="0.5" />
        <circle cx="122" cy="149" r="2" fill="white" opacity="0.5" />
      </template>
      <template v-else-if="eyeStyle === 'closed'">
        <path d="M73 151 Q80 145 87 151" stroke="#D4AF37" stroke-width="2.5" fill="none" />
        <path d="M113 151 Q120 145 127 151" stroke="#D4AF37" stroke-width="2.5" fill="none" />
      </template>
      <template v-else-if="eyeStyle === 'fierce'">
        <ellipse cx="80" cy="147" rx="8" ry="10" fill="#D4AF37" />
        <ellipse cx="120" cy="147" rx="8" ry="10" fill="#D4AF37" />
        <circle cx="84" cy="144" r="3" fill="white" opacity="0.7" />
        <circle cx="124" cy="144" r="3" fill="white" opacity="0.7" />
        <path d="M76 145 L84 148" stroke="#FFD700" stroke-width="0.8" opacity="0.5" />
        <path d="M116 145 L124 148" stroke="#FFD700" stroke-width="0.8" opacity="0.5" />
      </template>
      <template v-else-if="eyeStyle === 'soft'">
        <ellipse cx="80" cy="150" rx="6" ry="8" fill="#D4AF37" />
        <ellipse cx="120" cy="150" rx="6" ry="8" fill="#D4AF37" />
        <circle cx="82" cy="147" r="2.5" fill="white" opacity="0.8" />
        <circle cx="122" cy="147" r="2.5" fill="white" opacity="0.8" />
      </template>
    </g>

    <!-- Eyebrows -->
    <path :d="leftBrow" stroke="#5A1010" stroke-width="2.5" fill="none" stroke-linecap="round" />
    <path :d="rightBrow" stroke="#5A1010" stroke-width="2.5" fill="none" stroke-linecap="round" />

    <!-- Mouth -->
    <path :d="mouthPath" stroke="#C75050" :stroke-width="mouthSW" :fill="mouthFill" stroke-linecap="round" />

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

const hair = '#8B1A1A'

const showBlush = computed(() => ['blush', 'vulnerable', 'genuine_smile'].includes(props.expression))

const eyeStyle = computed(() => {
  switch (props.expression) {
    case 'smirk': case 'cold': return 'narrow'
    case 'genuine_smile': return 'closed'
    case 'fierce': case 'impressed': return 'fierce'
    case 'vulnerable': return 'soft'
    default: return 'normal'
  }
})

const leftBrow = computed(() => {
  switch (props.expression) {
    case 'smirk': return 'M70 130 Q76 126 86 132'
    case 'cold': case 'fierce': return 'M68 128 Q76 124 86 132'
    case 'impressed': return 'M70 128 Q76 124 86 130'
    case 'vulnerable': return 'M72 132 Q78 134 86 134'
    default: return 'M70 132 Q76 128 86 132'
  }
})

const rightBrow = computed(() => {
  switch (props.expression) {
    case 'smirk': return 'M114 130 Q124 124 132 128'
    case 'cold': case 'fierce': return 'M114 132 Q124 124 132 128'
    case 'impressed': return 'M114 130 Q124 124 130 128'
    case 'vulnerable': return 'M114 134 Q122 134 128 132'
    default: return 'M114 132 Q124 128 130 132'
  }
})

const mouthPath = computed(() => {
  switch (props.expression) {
    case 'smirk': return 'M90 174 Q96 172 100 174 Q106 178 112 172'
    case 'cold': return 'M92 174 Q100 172 108 174'
    case 'impressed': return 'M92 173 Q100 176 108 173'
    case 'genuine_smile': return 'M90 172 Q100 180 110 172'
    case 'fierce': return 'M88 172 Q100 178 112 172'
    case 'vulnerable': return 'M94 174 Q100 172 106 174'
    case 'blush': return 'M94 173 Q100 170 106 173'
    default: return 'M92 174 Q100 172 108 174'
  }
})

const mouthFill = computed(() => {
  if (['genuine_smile', 'fierce'].includes(props.expression)) return '#C75050'
  return 'none'
})

const mouthSW = computed(() => '2')

const hairFront = 'M48 138 Q52 92 76 70 Q90 58 100 54 Q110 58 124 70 Q148 92 152 138 Q148 120 142 124 Q135 110 128 118 Q120 100 112 112 Q106 95 100 105 Q94 95 88 112 Q80 100 72 118 Q65 110 58 124 Q52 120 48 138 Z'
</script>

<style scoped>
.sprite { width: 185px; height: auto; transition: all 0.3s ease; }
</style>
