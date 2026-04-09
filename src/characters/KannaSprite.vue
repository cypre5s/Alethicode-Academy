<template>
  <svg class="sprite" viewBox="0 0 200 450" xmlns="http://www.w3.org/2000/svg">
    <!-- Scarf -->
    <path d="M55 210 Q60 195 80 190 L120 190 Q140 195 145 210 L150 320 Q145 340 130 345 L100 350 L70 345 Q55 340 50 320 Z" fill="#E8DDD0" opacity="0.9" />
    <path d="M60 215 Q65 200 85 195 L115 195 Q135 200 140 215 L142 280 Q140 290 130 295 L100 300 L70 295 Q60 290 58 280 Z" fill="#DDD0C0" opacity="0.6" />

    <!-- Body -->
    <rect x="65" y="230" width="70" height="170" rx="25" fill="#F5F5F5" />

    <!-- Hair Back -->
    <path d="M50 130 Q45 170 48 220 Q50 230 55 225 Q52 170 55 140 Z" :fill="hair" opacity="0.7" />
    <path d="M150 130 Q155 170 152 220 Q150 230 145 225 Q148 170 145 140 Z" :fill="hair" opacity="0.7" />

    <!-- Neck -->
    <rect x="88" y="195" width="24" height="25" rx="8" fill="#FDE8D0" />

    <!-- Face -->
    <ellipse cx="100" cy="155" rx="44" ry="52" fill="#FDE8D0" />

    <!-- Blush -->
    <ellipse v-if="showBlush" cx="74" cy="165" rx="10" ry="5" fill="#FFB6C1" opacity="0.4" />
    <ellipse v-if="showBlush" cx="126" cy="165" rx="10" ry="5" fill="#FFB6C1" opacity="0.4" />

    <!-- Eyes -->
    <g>
      <template v-if="eyeStyle === 'normal'">
        <ellipse cx="80" cy="150" rx="7" ry="8" fill="#C9A96E" />
        <ellipse cx="120" cy="150" rx="7" ry="8" fill="#C9A96E" />
        <circle cx="82" cy="147" r="2.5" fill="white" opacity="0.7" />
        <circle cx="122" cy="147" r="2.5" fill="white" opacity="0.7" />
      </template>
      <template v-else-if="eyeStyle === 'gentle'">
        <path d="M73 152 Q80 146 87 152" stroke="#C9A96E" stroke-width="2" fill="none" />
        <path d="M113 152 Q120 146 127 152" stroke="#C9A96E" stroke-width="2" fill="none" />
      </template>
      <template v-else-if="eyeStyle === 'absorbed'">
        <ellipse cx="80" cy="150" rx="6" ry="7" fill="#C9A96E" />
        <ellipse cx="120" cy="150" rx="6" ry="7" fill="#C9A96E" />
        <circle cx="81" cy="148" r="2" fill="white" opacity="0.5" />
        <circle cx="121" cy="148" r="2" fill="white" opacity="0.5" />
      </template>
      <template v-else-if="eyeStyle === 'wide'">
        <ellipse cx="80" cy="149" rx="8" ry="11" fill="#C9A96E" />
        <ellipse cx="120" cy="149" rx="8" ry="11" fill="#C9A96E" />
        <circle cx="83" cy="146" r="3.5" fill="white" opacity="0.8" />
        <circle cx="123" cy="146" r="3.5" fill="white" opacity="0.8" />
      </template>
      <template v-else-if="eyeStyle === 'teary'">
        <ellipse cx="80" cy="149" rx="7" ry="9" fill="#C9A96E" />
        <ellipse cx="120" cy="149" rx="7" ry="9" fill="#C9A96E" />
        <circle cx="82" cy="146" r="2.5" fill="white" opacity="0.8" />
        <circle cx="122" cy="146" r="2.5" fill="white" opacity="0.8" />
        <ellipse cx="76" cy="160" rx="3" ry="5" fill="#ADD8E6" opacity="0.5" />
        <ellipse cx="124" cy="160" rx="3" ry="5" fill="#ADD8E6" opacity="0.5" />
      </template>
    </g>

    <!-- Eyebrows -->
    <path :d="leftBrow" stroke="#8BA8C0" stroke-width="1.8" fill="none" stroke-linecap="round" />
    <path :d="rightBrow" stroke="#8BA8C0" stroke-width="1.8" fill="none" stroke-linecap="round" />

    <!-- Mouth -->
    <path :d="mouthPath" stroke="#D4717A" stroke-width="1.5" fill="none" stroke-linecap="round" />

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

const hair = '#7BA7C9'

const showBlush = computed(() => ['blush', 'warm_smile'].includes(props.expression))

const eyeStyle = computed(() => {
  switch (props.expression) {
    case 'slight_smile': case 'warm_smile': return 'gentle'
    case 'absorbed': case 'contemplative': return 'absorbed'
    case 'surprised': return 'wide'
    case 'teary': return 'teary'
    default: return 'normal'
  }
})

const leftBrow = computed(() => {
  switch (props.expression) {
    case 'surprised': return 'M72 132 Q78 126 86 130'
    case 'contemplative': return 'M72 134 Q78 130 86 132'
    case 'teary': return 'M72 130 Q78 134 86 134'
    default: return 'M73 134 Q78 130 85 134'
  }
})

const rightBrow = computed(() => {
  switch (props.expression) {
    case 'surprised': return 'M114 130 Q122 126 128 132'
    case 'contemplative': return 'M114 132 Q122 130 128 134'
    case 'teary': return 'M114 134 Q122 134 128 130'
    default: return 'M115 134 Q122 130 127 134'
  }
})

const mouthPath = computed(() => {
  switch (props.expression) {
    case 'slight_smile': case 'warm_smile': return 'M94 173 Q100 177 106 173'
    case 'surprised': return 'M96 172 Q100 176 104 172'
    case 'contemplative': return 'M94 174 Q100 172 106 174'
    default: return 'M95 174 Q100 173 105 174'
  }
})

const hairFront = 'M50 140 Q55 95 78 72 Q90 60 100 56 Q110 60 122 72 Q145 95 150 140 Q145 125 138 128 Q130 112 122 122 Q112 102 104 114 Q96 102 86 118 Q78 108 70 124 Q62 118 55 130 Q50 128 50 140 Z'
</script>

<style scoped>
.sprite { width: 170px; height: auto; transition: all 0.3s ease; }
</style>
