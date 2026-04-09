<template>
  <svg class="sprite" viewBox="0 0 200 450" xmlns="http://www.w3.org/2000/svg">
    <!-- Body -->
    <rect x="60" y="220" width="80" height="180" rx="30" fill="#F5F5F5" />
    <rect x="65" y="225" width="70" height="80" rx="6" fill="#FAFAFA" />
    <line x1="100" y1="225" x2="100" y2="300" stroke="#E0E0E0" stroke-width="1" />

    <!-- Hair Back (long straight black) -->
    <rect x="42" y="120" width="116" height="280" rx="10" :fill="hair" opacity="0.9" />

    <!-- Neck -->
    <rect x="88" y="195" width="24" height="30" rx="8" fill="#FDE8D0" />

    <!-- Face -->
    <ellipse cx="100" cy="155" rx="46" ry="54" fill="#FDE8D0" />

    <!-- Blush -->
    <ellipse v-if="showBlush" cx="73" cy="165" rx="10" ry="5" fill="#FFB6C1" opacity="0.4" />
    <ellipse v-if="showBlush" cx="127" cy="165" rx="10" ry="5" fill="#FFB6C1" opacity="0.4" />

    <!-- Glasses (only in glasses_adjust) -->
    <g v-if="showGlasses" opacity="0.8">
      <rect x="66" y="138" width="28" height="22" rx="4" stroke="#6A3D9A" stroke-width="1.5" fill="none" />
      <rect x="106" y="138" width="28" height="22" rx="4" stroke="#6A3D9A" stroke-width="1.5" fill="none" />
      <line x1="94" y1="149" x2="106" y2="149" stroke="#6A3D9A" stroke-width="1.5" />
    </g>

    <!-- Eyes -->
    <g>
      <template v-if="eyeStyle === 'normal'">
        <ellipse cx="80" cy="148" rx="7" ry="9" fill="#6A3D9A" />
        <ellipse cx="120" cy="148" rx="7" ry="9" fill="#6A3D9A" />
        <circle cx="82" cy="145" r="2.5" fill="white" opacity="0.7" />
        <circle cx="122" cy="145" r="2.5" fill="white" opacity="0.7" />
      </template>
      <template v-else-if="eyeStyle === 'narrow'">
        <ellipse cx="80" cy="150" rx="7" ry="5" fill="#6A3D9A" />
        <ellipse cx="120" cy="150" rx="7" ry="5" fill="#6A3D9A" />
      </template>
      <template v-else-if="eyeStyle === 'closed'">
        <path d="M73 150 Q80 144 87 150" stroke="#6A3D9A" stroke-width="2.5" fill="none" />
        <path d="M113 150 Q120 144 127 150" stroke="#6A3D9A" stroke-width="2.5" fill="none" />
      </template>
      <template v-else-if="eyeStyle === 'angry'">
        <ellipse cx="80" cy="150" rx="7" ry="7" fill="#6A3D9A" />
        <ellipse cx="120" cy="150" rx="7" ry="7" fill="#6A3D9A" />
        <circle cx="82" cy="148" r="2" fill="white" opacity="0.5" />
        <circle cx="122" cy="148" r="2" fill="white" opacity="0.5" />
      </template>
    </g>

    <!-- Eyebrows -->
    <path :d="leftBrow" stroke="#1A1A2E" stroke-width="2.5" fill="none" stroke-linecap="round" />
    <path :d="rightBrow" stroke="#1A1A2E" stroke-width="2.5" fill="none" stroke-linecap="round" />

    <!-- Mouth -->
    <path :d="mouthPath" stroke="#D4717A" :stroke-width="mouthSW" :fill="mouthFill" stroke-linecap="round" />

    <!-- Hair Front (hime cut) -->
    <path :d="hairFront" :fill="hair" />
    <rect x="48" y="105" width="20" height="80" rx="4" :fill="hair" />
    <rect x="132" y="105" width="20" height="80" rx="4" :fill="hair" />
  </svg>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  expression: { type: String, default: 'normal' },
  isSpeaking: Boolean
})

const hair = '#1A1A2E'

const showBlush = computed(() => ['blush', 'tsundere_pout', 'rare_gentle'].includes(props.expression))
const showGlasses = computed(() => ['glasses_adjust', 'cold'].includes(props.expression))

const eyeStyle = computed(() => {
  switch (props.expression) {
    case 'cold': case 'glasses_adjust': return 'narrow'
    case 'slight_smile': case 'rare_gentle': return 'closed'
    case 'angry': case 'tsundere_pout': return 'angry'
    default: return 'normal'
  }
})

const leftBrow = computed(() => {
  switch (props.expression) {
    case 'angry': case 'tsundere_pout': return 'M70 130 Q76 125 86 134'
    case 'cold': return 'M72 132 Q78 130 86 132'
    case 'rare_gentle': return 'M72 134 Q78 130 86 134'
    default: return 'M72 133 Q78 129 86 133'
  }
})

const rightBrow = computed(() => {
  switch (props.expression) {
    case 'angry': case 'tsundere_pout': return 'M114 134 Q124 125 130 130'
    case 'cold': return 'M114 132 Q122 130 128 132'
    case 'rare_gentle': return 'M114 134 Q122 130 128 134'
    default: return 'M114 133 Q122 129 128 133'
  }
})

const mouthPath = computed(() => {
  switch (props.expression) {
    case 'slight_smile': case 'rare_gentle': return 'M92 173 Q100 178 108 173'
    case 'angry': return 'M90 174 L110 174'
    case 'tsundere_pout': return 'M88 174 Q94 170 100 173 Q106 170 112 174'
    case 'cold': return 'M92 174 Q100 172 108 174'
    case 'blush': return 'M94 173 Q100 170 106 173'
    default: return 'M92 174 Q100 172 108 174'
  }
})

const mouthFill = computed(() => 'none')
const mouthSW = computed(() => '2')

const hairFront = 'M45 135 Q50 85 75 65 Q88 55 100 50 Q112 55 125 65 Q150 85 155 135 Q148 115 140 120 Q132 105 125 115 Q118 95 110 108 Q105 90 100 100 Q95 90 90 108 Q82 95 75 115 Q68 105 60 120 Q52 115 45 135 Z'
</script>

<style scoped>
.sprite { width: 180px; height: auto; transition: all 0.3s ease; }
</style>
